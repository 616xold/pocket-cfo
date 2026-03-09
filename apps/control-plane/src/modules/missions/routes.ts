import type { FastifyInstance } from "fastify";
import type { MissionService } from "./service";
import { createMissionFromTextSchema, missionIdParamsSchema } from "./schema";

export async function registerMissionRoutes(
  app: FastifyInstance,
  deps: { missionService: MissionService },
) {
  app.post("/missions/text", async (request, reply) => {
    const body = createMissionFromTextSchema.parse(request.body);
    const created = await deps.missionService.createFromText(body);
    reply.code(201);
    return created;
  });

  app.get("/missions/:missionId", async (request) => {
    const params = missionIdParamsSchema.parse(request.params);
    return deps.missionService.getMissionDetail(params.missionId);
  });
}
