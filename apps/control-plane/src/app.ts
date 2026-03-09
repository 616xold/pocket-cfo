import Fastify from "fastify";
import { registerHttpErrorHandler } from "./lib/http-errors";
import { createLogger } from "./lib/logger";
import { registerHealthRoutes } from "./modules/health/routes";
import { registerMissionRoutes } from "./modules/missions/routes";
import { registerReplayRoutes } from "./modules/replay/routes";
import { registerGitHubWebhookRoutes } from "./modules/github/webhook-routes";
import { createContainer } from "./bootstrap";
import type { AppContainer } from "./lib/types";

export async function buildApp(options?: { container?: AppContainer }) {
  const logger = createLogger();
  const app = Fastify({ logger });
  const container = options?.container ?? (await createContainer());

  registerHttpErrorHandler(app);

  await registerHealthRoutes(app);
  await registerMissionRoutes(app, {
    missionService: container.missionService,
  });
  await registerReplayRoutes(app, {
    replayService: container.replayService,
  });
  await registerGitHubWebhookRoutes(app);

  return app;
}
