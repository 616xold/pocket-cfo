import { z } from "zod";

export const TwinEntityTypeSchema = z.enum([
  "repository",
  "service",
  "package",
  "owner",
  "testSuite",
  "ciJob",
  "runbook",
  "dashboard",
  "flag",
  "doc",
]);

export const TwinFreshnessStatusSchema = z.enum([
  "fresh",
  "stale",
  "unknown",
]);

export const TwinEntitySchema = z.object({
  id: z.string().uuid(),
  type: TwinEntityTypeSchema,
  key: z.string(),
  title: z.string(),
  repo: z.string().nullable(),
  freshnessStatus: TwinFreshnessStatusSchema,
  lastObservedAt: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const TwinEdgeSchema = z.object({
  id: z.string().uuid(),
  fromEntityId: z.string().uuid(),
  toEntityId: z.string().uuid(),
  relationType: z.string(),
  sourceRef: z.string().nullable(),
  weight: z.number().default(1),
});

export type TwinEntity = z.infer<typeof TwinEntitySchema>;
export type TwinEdge = z.infer<typeof TwinEdgeSchema>;
