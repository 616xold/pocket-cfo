import { buildApp } from "./app";
import { getEnv } from "./lib/env";

async function main() {
  const env = getEnv();
  const app = await buildApp();

  await app.listen({
    port: env.CONTROL_PLANE_PORT,
    host: "0.0.0.0",
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
