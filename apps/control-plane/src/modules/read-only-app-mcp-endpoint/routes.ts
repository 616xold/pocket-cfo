import type { FastifyInstance } from "fastify";
import {
  ReadOnlyAppMcpEndpointService,
  type ReadOnlyAppMcpEndpointResult,
} from "./service";

export async function registerReadOnlyAppMcpEndpointRoutes(
  app: FastifyInstance,
  deps: {
    readOnlyAppMcpEndpointService?: Pick<
      ReadOnlyAppMcpEndpointService,
      "handle"
    >;
  } = {},
) {
  const service =
    deps.readOnlyAppMcpEndpointService ?? new ReadOnlyAppMcpEndpointService();

  app.post("/mcp", async (request, reply) => {
    const response: ReadOnlyAppMcpEndpointResult = service.handle(request.body);

    if (response === null) {
      reply.code(204);
      return undefined;
    }

    return response;
  });
}
