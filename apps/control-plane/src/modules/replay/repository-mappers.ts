import type { replayEvents } from "@pocket-cto/db";
import { ReplayEventSchema } from "@pocket-cto/domain";
import type { ReplayEvent } from "@pocket-cto/domain";

type ReplayEventRow = typeof replayEvents.$inferSelect;

export function mapReplayEventRow(row: ReplayEventRow): ReplayEvent {
  return ReplayEventSchema.parse({
    id: row.id,
    missionId: row.missionId,
    taskId: row.taskId,
    sequence: row.sequence,
    type: row.type,
    actor: row.actor,
    occurredAt: row.occurredAt,
    payload: isRecord(row.payload) ? row.payload : {},
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
