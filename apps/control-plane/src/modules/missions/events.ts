import type { MissionStatus } from "@pocket-cto/domain";

export const missionStatusChangeReasons = {
  tasksMaterialized: "tasks_materialized",
} as const;

export type MissionStatusChangedPayload = {
  from: MissionStatus;
  to: MissionStatus;
  reason: (typeof missionStatusChangeReasons)[keyof typeof missionStatusChangeReasons];
};

export function buildQueuedMissionStatusChangedPayload(
  from: MissionStatus,
  to: MissionStatus,
): MissionStatusChangedPayload {
  return {
    from,
    to,
    reason: missionStatusChangeReasons.tasksMaterialized,
  };
}
