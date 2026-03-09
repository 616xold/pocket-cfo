import type {
  MissionTaskStatus,
  TaskStatusChangeReason,
  TaskStatusChangedPayload,
} from "@pocket-cto/domain";

export const taskStatusChangeReasons = {
  taskCompleted: "task_completed",
  workerClaimed: "worker_claimed",
} as const satisfies Record<string, TaskStatusChangeReason>;

export function buildTaskStatusChangedPayload(
  from: MissionTaskStatus,
  to: MissionTaskStatus,
  reason: TaskStatusChangeReason,
): TaskStatusChangedPayload {
  return {
    from,
    to,
    reason,
  };
}
