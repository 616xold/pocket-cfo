import { closeAllPools } from "@pocket-cto/db";
import { buildApp } from "./app";
import {
  createContainer,
  createEmbeddedWorkerContainer,
} from "./bootstrap";
import { getEnv } from "./lib/env";
import { createProcessLogger } from "./lib/logger";
import type { AppContainer, EmbeddedWorkerContainer } from "./lib/types";

async function main() {
  const env = getEnv();
  const log = createProcessLogger();
  const abortController = new AbortController();
  const embeddedWorkerEnabled = readEmbeddedWorkerFlag();
  const container: AppContainer | EmbeddedWorkerContainer = embeddedWorkerEnabled
    ? await createEmbeddedWorkerContainer()
    : await createContainer();
  const app = await buildApp({ container });
  let shuttingDown = false;

  const shutdown = async (signal: NodeJS.Signals | "embedded-worker-error") => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    log.info(
      {
        embeddedWorker: embeddedWorkerEnabled,
        event: "server.shutdown",
        signal,
      },
      "Control-plane shutdown requested",
    );
    abortController.abort();
    process.off("SIGINT", handleSignal);
    process.off("SIGTERM", handleSignal);
    await app.close();
    await closeAllPools();
  };

  const handleSignal = (signal: NodeJS.Signals) => {
    void shutdown(signal);
  };

  process.on("SIGINT", handleSignal);
  process.on("SIGTERM", handleSignal);

  if (hasEmbeddedWorker(container)) {
    void container.worker
      .run({
        log,
        pollIntervalMs: env.WORKER_POLL_INTERVAL_MS,
        runOnce: false,
        signal: abortController.signal,
      })
      .catch(async (error: unknown) => {
        log.error({ err: error }, "Embedded worker failed");
        await shutdown("embedded-worker-error");
      });
  }

  await app.listen({
    host: "0.0.0.0",
    port: env.CONTROL_PLANE_PORT,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

function hasEmbeddedWorker(
  container: AppContainer | EmbeddedWorkerContainer,
): container is EmbeddedWorkerContainer {
  return "worker" in container;
}

function readEmbeddedWorkerFlag() {
  return process.env.CONTROL_PLANE_EMBEDDED_WORKER === "true";
}
