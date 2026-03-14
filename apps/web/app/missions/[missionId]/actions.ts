"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  interruptMissionTask,
  resolveMissionApproval,
} from "../../../lib/api";

const approvalResolutionFormSchema = z.object({
  approvalId: z.string().uuid(),
  decision: z.enum(["accept", "decline"]),
  missionId: z.string().uuid(),
  resolvedBy: z.string().trim().min(1),
});

const taskInterruptFormSchema = z.object({
  missionId: z.string().uuid(),
  requestedBy: z.string().trim().min(1),
  taskId: z.string().uuid(),
});

export async function submitApprovalResolution(formData: FormData) {
  const input = approvalResolutionFormSchema.parse({
    approvalId: formData.get("approvalId"),
    decision: formData.get("decision"),
    missionId: formData.get("missionId"),
    resolvedBy: formData.get("resolvedBy"),
  });

  await resolveMissionApproval({
    approvalId: input.approvalId,
    decision: input.decision,
    resolvedBy: input.resolvedBy,
  });

  revalidatePath(`/missions/${input.missionId}`);
}

export async function submitTaskInterrupt(formData: FormData) {
  const input = taskInterruptFormSchema.parse({
    missionId: formData.get("missionId"),
    requestedBy: formData.get("requestedBy"),
    taskId: formData.get("taskId"),
  });

  await interruptMissionTask({
    requestedBy: input.requestedBy,
    taskId: input.taskId,
  });

  revalidatePath(`/missions/${input.missionId}`);
}
