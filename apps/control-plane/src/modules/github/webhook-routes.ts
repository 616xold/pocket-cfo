import type { FastifyInstance } from "fastify";

export async function registerGitHubWebhookRoutes(app: FastifyInstance) {
  app.post("/webhooks/github", async (_request, reply) => {
    reply.code(202);
    return {
      accepted: true,
      note: "GitHub webhook handling is a later milestone.",
    };
  });
}
