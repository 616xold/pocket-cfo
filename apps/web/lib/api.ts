import {
  ApprovalRecordSchema,
  MissionDetailViewSchema,
  OperatorControlAvailabilitySchema,
} from "@pocket-cto/domain";
import type { ApprovalDecision } from "@pocket-cto/domain";
import { z } from "zod";

const healthSchema = z.object({
  ok: z.boolean(),
  service: z.string(),
  now: z.string(),
});
type ControlPlaneHealth = z.output<typeof healthSchema>;

const missionDetailSchema = MissionDetailViewSchema;
type MissionDetail = z.output<typeof missionDetailSchema>;

const liveControlSchema = OperatorControlAvailabilitySchema;

const missionApprovalsSchema = z.object({
  approvals: z.array(ApprovalRecordSchema),
  liveControl: liveControlSchema,
});
type MissionApprovals = z.output<typeof missionApprovalsSchema>;

const resolveApprovalResponseSchema = z.object({
  approval: ApprovalRecordSchema,
  liveControl: liveControlSchema,
});

const interruptTaskResponseSchema = z.object({
  interrupt: z.object({
    cancelledApprovals: z.array(ApprovalRecordSchema).default([]),
    taskId: z.string().uuid(),
    threadId: z.string(),
    turnId: z.string(),
  }),
  liveControl: liveControlSchema,
});

const controlPlaneUrl =
  process.env.NEXT_PUBLIC_CONTROL_PLANE_URL ??
  process.env.CONTROL_PLANE_URL ??
  "http://localhost:4000";

async function fetchJson<TSchema extends z.ZodTypeAny>(
  input: string,
  schema: TSchema,
): Promise<z.output<TSchema> | null> {
  try {
    const response = await fetch(`${controlPlaneUrl}${input}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return schema.parse(json);
  } catch {
    return null;
  }
}

async function postJson<TSchema extends z.ZodTypeAny>(
  input: string,
  body: unknown,
  schema: TSchema,
): Promise<z.output<TSchema>> {
  const response = await fetch(`${controlPlaneUrl}${input}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Control-plane request failed (${response.status}) for ${input}`,
    );
  }

  return schema.parse(await response.json());
}

export async function getControlPlaneHealth(): Promise<ControlPlaneHealth> {
  return (await fetchJson("/health", healthSchema)) ?? {
    ok: false,
    service: "unreachable",
    now: new Date().toISOString(),
  };
}

export async function getMissionDetail(
  missionId: string,
): Promise<MissionDetail | null> {
  return fetchJson(`/missions/${missionId}`, missionDetailSchema);
}

export async function getMissionApprovals(
  missionId: string,
): Promise<MissionApprovals | null> {
  return fetchJson(`/missions/${missionId}/approvals`, missionApprovalsSchema);
}

export async function resolveMissionApproval(input: {
  approvalId: string;
  decision: ApprovalDecision;
  rationale?: string | null;
  resolvedBy: string;
}) {
  return postJson(
    `/approvals/${input.approvalId}/resolve`,
    {
      decision: input.decision,
      rationale: input.rationale ?? undefined,
      resolvedBy: input.resolvedBy,
    },
    resolveApprovalResponseSchema,
  );
}

export async function interruptMissionTask(input: {
  rationale?: string | null;
  requestedBy: string;
  taskId: string;
}) {
  return postJson(
    `/tasks/${input.taskId}/interrupt`,
    {
      rationale: input.rationale ?? undefined,
      requestedBy: input.requestedBy,
    },
    interruptTaskResponseSchema,
  );
}
