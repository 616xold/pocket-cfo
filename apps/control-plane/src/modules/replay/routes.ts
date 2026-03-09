import type { FastifyInstance } from "fastify";
import type { ReplayService } from "./service";
import { replayMissionParamsSchema } from "./schema";

export async function registerReplayRoutes(
  app: FastifyInstance,
  deps: { replayService: ReplayService },
) {
  app.get("/missions/:missionId/events", async (request) => {
    const { missionId } = replayMissionParamsSchema.parse(request.params);
    return deps.replayService.getMissionEvents(missionId);
  });
}
