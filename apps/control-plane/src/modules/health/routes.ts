import type { FastifyInstance } from "fastify";

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({
    ok: true,
    service: "pocket-cto-control-plane",
    now: new Date().toISOString(),
  }));

  app.post("/health", async () => ({
    ok: true,
    service: "pocket-cto-control-plane",
    now: new Date().toISOString(),
  }));
}
