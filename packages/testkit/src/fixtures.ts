import type {
  MissionSpec,
  ProofBundleManifest,
  ReplayEvent,
} from "@pocket-cto/domain";

export function buildMissionFixture(): MissionSpec {
  return {
    type: "build",
    title: "Implement passkeys",
    objective: "Implement passkey sign-in without breaking email login",
    repos: ["web", "auth-service"],
    constraints: {
      mustNot: ["disable email login"],
      allowedPaths: [],
      targetBranch: "main",
    },
    acceptance: [
      "users can register and sign in with passkeys",
      "existing email login still works",
    ],
    riskBudget: {
      sandboxMode: "patch-only",
      maxWallClockMinutes: 60,
      maxCostUsd: 12,
      allowNetwork: false,
      requiresHumanApprovalFor: ["merge"],
    },
    deliverables: ["plan", "pull_request", "proof_bundle", "approval_card"],
    evidenceRequirements: ["test report", "screenshot", "rollback note"],
  };
}

export function proofBundlePlaceholderFixture(
  missionId: string,
): ProofBundleManifest {
  return {
    missionId,
    objective: "Placeholder objective",
    changeSummary: "",
    verificationSummary: "",
    riskSummary: "",
    rollbackSummary: "",
    decisionTrace: [],
    artifactIds: [],
    replayEventCount: 0,
    status: "placeholder",
  };
}

export function replayEventFixture(missionId: string): ReplayEvent {
  return {
    id: crypto.randomUUID(),
    missionId,
    taskId: null,
    sequence: 1,
    type: "mission.created",
    actor: "system",
    occurredAt: new Date().toISOString(),
    payload: { reason: "fixture" },
  };
}
