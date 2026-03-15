import { describe, expect, it } from "vitest";
import type {
  ApprovalRecord,
  ArtifactRecord,
  MissionRecord,
  MissionTaskRecord,
  ProofBundleManifest,
} from "@pocket-cto/domain";
import { assembleProofBundleManifest } from "./proof-bundle-assembly";
import { EvidenceService } from "./service";

const missionId = "11111111-1111-4111-8111-111111111111";
const plannerTaskId = "22222222-2222-4222-8222-222222222222";
const executorTaskId = "33333333-3333-4333-8333-333333333333";

describe("assembleProofBundleManifest", () => {
  it("yields a ready proof bundle for a planner plus executor plus PR path", () => {
    const mission = buildMission();
    const manifest = assembleProofBundleManifest({
      approvals: [],
      artifacts: [
        buildArtifact({
          id: "44444444-4444-4444-8444-444444444444",
          kind: "plan",
          taskId: plannerTaskId,
          createdAt: "2026-03-15T21:00:00.000Z",
          metadata: {
            summary: "Planner captured the implementation plan.",
          },
        }),
        buildArtifact({
          id: "55555555-5555-4555-8555-555555555555",
          kind: "diff_summary",
          taskId: executorTaskId,
          createdAt: "2026-03-15T21:10:00.000Z",
          metadata: {
            summary: "Workspace changes touched README.md and apps/web/page.tsx.",
          },
        }),
        buildArtifact({
          id: "66666666-6666-4666-8666-666666666666",
          kind: "test_report",
          taskId: executorTaskId,
          createdAt: "2026-03-15T21:11:00.000Z",
          metadata: {
            summary: "Local executor validation passed. Validation passed for README.md (+1 more) and a clean git diff check.",
          },
        }),
        buildArtifact({
          id: "77777777-7777-4777-8777-777777777777",
          kind: "pr_link",
          taskId: executorTaskId,
          uri: "https://github.com/616xold/pocket-cto/pull/77",
          createdAt: "2026-03-15T21:12:00.000Z",
          metadata: {
            branchName: "pocket-cto/11111111-1111-4111-8111-111111111111/1-executor",
            draft: true,
            prNumber: 77,
            prUrl: "https://github.com/616xold/pocket-cto/pull/77",
            publishedAt: "2026-03-15T21:12:00.000Z",
            repoFullName: "616xold/pocket-cto",
            summary: "Draft PR #77 opened for 616xold/pocket-cto from pocket-cto/11111111-1111-4111-8111-111111111111/1-executor into main.",
          },
        }),
      ],
      existingBundle: buildPlaceholderBundle(mission),
      mission,
      replayEventCount: 18,
      tasks: buildTasks({
        executorStatus: "succeeded",
        plannerStatus: "succeeded",
      }),
    });

    expect(manifest.status).toBe("ready");
    expect(manifest.evidenceCompleteness.status).toBe("complete");
    expect(manifest.targetRepoFullName).toBe("616xold/pocket-cto");
    expect(manifest.branchName).toBe(
      "pocket-cto/11111111-1111-4111-8111-111111111111/1-executor",
    );
    expect(manifest.pullRequestNumber).toBe(77);
    expect(manifest.pullRequestUrl).toBe(
      "https://github.com/616xold/pocket-cto/pull/77",
    );
    expect(manifest.validationSummary).toContain(
      "Local executor validation passed",
    );
    expect(manifest.verificationSummary).toContain("draft PR #77");
    expect(manifest.artifacts).toEqual([
      {
        id: "44444444-4444-4444-8444-444444444444",
        kind: "plan",
      },
      {
        id: "55555555-5555-4555-8555-555555555555",
        kind: "diff_summary",
      },
      {
        id: "66666666-6666-4666-8666-666666666666",
        kind: "test_report",
      },
      {
        id: "77777777-7777-4777-8777-777777777777",
        kind: "pr_link",
      },
    ]);
  });

  it("yields an incomplete proof bundle when expected evidence is still missing", () => {
    const mission = buildMission();
    const manifest = assembleProofBundleManifest({
      approvals: [],
      artifacts: [
        buildArtifact({
          id: "44444444-4444-4444-8444-444444444444",
          kind: "plan",
          taskId: plannerTaskId,
          createdAt: "2026-03-15T21:00:00.000Z",
          metadata: {
            summary: "Planner captured the implementation plan.",
          },
        }),
      ],
      existingBundle: buildPlaceholderBundle(mission),
      mission,
      replayEventCount: 7,
      tasks: buildTasks({
        executorStatus: "pending",
        plannerStatus: "succeeded",
      }),
    });

    expect(manifest.status).toBe("incomplete");
    expect(manifest.evidenceCompleteness.status).toBe("partial");
    expect(manifest.evidenceCompleteness.missingArtifactKinds).toEqual([
      "diff_summary",
      "test_report",
      "pr_link",
    ]);
    expect(manifest.verificationSummary).toContain("executor validation");
  });

  it("yields a failed proof bundle for a non-shippable executor path", () => {
    const mission = buildMission();
    const manifest = assembleProofBundleManifest({
      approvals: [],
      artifacts: [
        buildArtifact({
          id: "44444444-4444-4444-8444-444444444444",
          kind: "plan",
          taskId: plannerTaskId,
          createdAt: "2026-03-15T21:00:00.000Z",
        }),
        buildArtifact({
          id: "66666666-6666-4666-8666-666666666666",
          kind: "test_report",
          taskId: executorTaskId,
          createdAt: "2026-03-15T21:11:00.000Z",
          metadata: {
            summary: "Local executor validation failed: the executor turn completed without changing any files.",
          },
        }),
        buildArtifact({
          id: "88888888-8888-4888-8888-888888888888",
          kind: "log_excerpt",
          taskId: executorTaskId,
          createdAt: "2026-03-15T21:11:30.000Z",
          metadata: {
            summary: "Captured executor failure excerpts from runtime output and local validation.",
          },
        }),
      ],
      existingBundle: buildPlaceholderBundle(mission),
      mission,
      replayEventCount: 11,
      tasks: buildTasks({
        executorStatus: "failed",
        executorSummary:
          "Executor completed validated workspace changes, but GitHub publish failed: branch protection blocked the push.",
        plannerStatus: "succeeded",
      }),
    });

    expect(manifest.status).toBe("failed");
    expect(manifest.evidenceCompleteness.status).toBe("partial");
    expect(manifest.validationSummary).toContain(
      "Local executor validation failed",
    );
    expect(manifest.verificationSummary).toContain("non-shippable");
    expect(manifest.rollbackSummary).toContain("Retry");
  });

  it("carries the latest approval summary into the manifest", () => {
    const mission = buildMission();
    const manifest = assembleProofBundleManifest({
      approvals: [
        {
          id: "99999999-9999-4999-8999-999999999999",
          kind: "file_change",
          missionId,
          payload: {},
          rationale: "Need a human check before publish",
          requestedBy: "system",
          resolvedBy: "operator",
          status: "approved",
          taskId: executorTaskId,
          createdAt: "2026-03-15T21:05:00.000Z",
          updatedAt: "2026-03-15T21:06:00.000Z",
        } satisfies ApprovalRecord,
      ],
      artifacts: [],
      existingBundle: buildPlaceholderBundle(mission),
      mission,
      replayEventCount: 5,
      tasks: buildTasks({
        executorStatus: "awaiting_approval",
        plannerStatus: "succeeded",
      }),
    });

    expect(manifest.latestApproval).toMatchObject({
      id: "99999999-9999-4999-8999-999999999999",
      kind: "file_change",
      status: "approved",
      resolvedBy: "operator",
    });
  });
});

function buildMission(): MissionRecord {
  return {
    id: missionId,
    type: "build",
    status: "running",
    title: "Implement passkeys for sign-in",
    objective: "Ship passkeys without breaking email login.",
    sourceKind: "manual_text",
    sourceRef: null,
    createdBy: "operator",
    primaryRepo: "web",
    spec: {
      type: "build",
      title: "Implement passkeys for sign-in",
      objective: "Ship passkeys without breaking email login.",
      repos: ["web"],
      constraints: {
        allowedPaths: [],
        mustNot: [],
      },
      acceptance: ["Ship passkeys without breaking email login."],
      riskBudget: {
        sandboxMode: "patch-only",
        maxWallClockMinutes: 30,
        maxCostUsd: 5,
        allowNetwork: false,
        requiresHumanApprovalFor: [],
      },
      deliverables: ["Open a decision-ready proof bundle."],
      evidenceRequirements: ["proof bundle"],
    },
    createdAt: "2026-03-15T21:00:00.000Z",
    updatedAt: "2026-03-15T21:00:00.000Z",
  };
}

function buildTasks(input: {
  executorStatus: MissionTaskRecord["status"];
  executorSummary?: string | null;
  plannerStatus: MissionTaskRecord["status"];
}): MissionTaskRecord[] {
  return [
    {
      id: plannerTaskId,
      missionId,
      role: "planner",
      sequence: 0,
      status: input.plannerStatus,
      attemptCount: 1,
      codexThreadId: "thread_planner_1",
      codexTurnId: null,
      workspaceId: null,
      dependsOnTaskId: null,
      summary: "Planner captured the implementation plan.",
      createdAt: "2026-03-15T21:00:00.000Z",
      updatedAt: "2026-03-15T21:01:00.000Z",
    },
    {
      id: executorTaskId,
      missionId,
      role: "executor",
      sequence: 1,
      status: input.executorStatus,
      attemptCount: 1,
      codexThreadId: "thread_executor_1",
      codexTurnId: null,
      workspaceId: null,
      dependsOnTaskId: plannerTaskId,
      summary: input.executorSummary ?? "Executor summary placeholder.",
      createdAt: "2026-03-15T21:02:00.000Z",
      updatedAt: "2026-03-15T21:12:00.000Z",
    },
  ];
}

function buildArtifact(
  input: Partial<ArtifactRecord> &
    Pick<ArtifactRecord, "id" | "kind"> & { createdAt: string },
): ArtifactRecord {
  return {
    id: input.id,
    missionId,
    taskId: input.taskId ?? null,
    kind: input.kind,
    uri:
      input.uri ??
      `pocket-cto://missions/${missionId}/artifacts/${input.kind}/${input.id}`,
    mimeType: input.mimeType ?? "application/json",
    sha256: input.sha256 ?? null,
    metadata: input.metadata ?? {},
    createdAt: input.createdAt,
  };
}

function buildPlaceholderBundle(mission: MissionRecord): ProofBundleManifest {
  return new EvidenceService().createPlaceholder(mission);
}
