import { z } from "zod";
import { MissionStatusSchema } from "./mission";
import { MissionTaskStatusSchema } from "./mission-task";

export const ReplayEventTypeSchema = z.enum([
  "mission.created",
  "mission.status_changed",
  "task.created",
  "task.status_changed",
  "artifact.created",
  "approval.requested",
  "approval.resolved",
  "runtime.thread_started",
  "runtime.turn_started",
  "runtime.item_started",
  "runtime.item_completed",
]);

export const ReplayEventSchema = z.object({
  id: z.string().uuid(),
  missionId: z.string().uuid(),
  taskId: z.string().uuid().nullable(),
  sequence: z.number().int().positive(),
  type: ReplayEventTypeSchema,
  actor: z.string().default("system"),
  occurredAt: z.string(),
  payload: z.record(z.string(), z.unknown()).default({}),
});

export const MissionStatusChangeReasonSchema = z.enum(["tasks_materialized"]);

export const MissionStatusChangedPayloadSchema = z.object({
  from: MissionStatusSchema,
  to: MissionStatusSchema,
  reason: MissionStatusChangeReasonSchema,
});

export const TaskStatusChangeReasonSchema = z.enum([
  "worker_claimed",
  "task_completed",
]);

export const TaskStatusChangedPayloadSchema = z.object({
  from: MissionTaskStatusSchema,
  to: MissionTaskStatusSchema,
  reason: TaskStatusChangeReasonSchema,
});

export type ReplayEventType = z.infer<typeof ReplayEventTypeSchema>;
export type ReplayEvent = z.infer<typeof ReplayEventSchema>;
export type MissionStatusChangeReason = z.infer<
  typeof MissionStatusChangeReasonSchema
>;
export type MissionStatusChangedPayload = z.infer<
  typeof MissionStatusChangedPayloadSchema
>;
export type TaskStatusChangeReason = z.infer<
  typeof TaskStatusChangeReasonSchema
>;
export type TaskStatusChangedPayload = z.infer<
  typeof TaskStatusChangedPayloadSchema
>;
