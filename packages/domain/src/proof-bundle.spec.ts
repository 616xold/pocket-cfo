import { describe, expect, it } from "vitest";
import { ProofBundleManifestSchema } from "./proof-bundle";

describe("Proof bundle domain schema", () => {
  it("parses a finance-ready discovery proof bundle without repo or PR fields", () => {
    const parsed = ProofBundleManifestSchema.parse({
      missionId: "11111111-1111-4111-8111-111111111111",
      missionTitle: "Assess cash posture for acme",
      objective: "Answer the stored cash posture question for acme.",
      companyKey: "acme",
      questionKind: "cash_posture",
      answerSummary:
        "Stored bank summaries show USD and EUR cash buckets, with stale bank coverage notes.",
      freshnessSummary:
        "Finance discovery is stale because the latest bank-account summary sync is older than the freshness threshold.",
      limitationsSummary:
        "No FX conversion is performed and mixed as-of dates remain visible.",
      relatedRoutePaths: ["/finance-twin/companies/acme/cash-posture"],
      relatedWikiPageKeys: ["metrics/cash-posture", "concepts/cash"],
      targetRepoFullName: null,
      branchName: null,
      pullRequestNumber: null,
      pullRequestUrl: null,
      changeSummary:
        "Stored bank summaries show USD and EUR cash buckets, with stale bank coverage notes.",
      validationSummary:
        "Finance discovery answer was assembled deterministically from stored Finance Twin and CFO Wiki state.",
      verificationSummary:
        "Review freshness and limitation posture before acting on the answer.",
      riskSummary:
        "Stale bank-summary coverage could leave the operator looking at an outdated cash posture.",
      rollbackSummary: "",
      latestApproval: null,
      evidenceCompleteness: {
        status: "complete",
        expectedArtifactKinds: ["discovery_answer"],
        presentArtifactKinds: ["discovery_answer"],
        missingArtifactKinds: [],
        notes: [],
      },
      decisionTrace: ["Scout task 0 produced discovery_answer artifact abc."],
      artifactIds: ["22222222-2222-4222-8222-222222222222"],
      artifacts: [
        {
          id: "22222222-2222-4222-8222-222222222222",
          kind: "discovery_answer",
        },
      ],
      replayEventCount: 6,
      timestamps: {
        missionCreatedAt: "2026-04-14T23:48:00.000Z",
        latestPlannerEvidenceAt: null,
        latestExecutorEvidenceAt: null,
        latestPullRequestAt: null,
        latestApprovalAt: null,
        latestArtifactAt: "2026-04-14T23:49:00.000Z",
      },
      status: "ready",
    });

    expect(parsed.companyKey).toBe("acme");
    expect(parsed.questionKind).toBe("cash_posture");
    expect(parsed.targetRepoFullName).toBeNull();
  });
});
