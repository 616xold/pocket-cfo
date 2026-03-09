import { z } from "zod";
import { CreateMissionFromTextInputSchema } from "@pocket-cto/domain";

export const createMissionFromTextSchema = CreateMissionFromTextInputSchema;

export const missionIdParamsSchema = z.object({
  missionId: z.string().uuid(),
});
