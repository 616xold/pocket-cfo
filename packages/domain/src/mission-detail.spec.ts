import { describe, expect, it } from "vitest";
import { MissionDetailViewSchema } from "./mission-detail";

describe("Mission detail domain schema", () => {
  it("parses finance discovery mission detail with a stored answer artifact", () => {
    const parsed = MissionDetailViewSchema.parse({
      mission: {
        id: "11111111-1111-4111-8111-111111111111",
        type: "discovery",
        status: "succeeded",
        title: "Assess cash posture for acme",
        objective: "Answer the stored cash posture question for acme.",
        sourceKind: "manual_discovery",
        sourceRef: null,
        createdBy: "finance-operator",
        primaryRepo: null,
        spec: {
          type: "discovery",
          title: "Assess cash posture for acme",
          objective: "Answer the stored cash posture question for acme.",
          repos: [],
          acceptance: ["persist one durable finance discovery answer artifact"],
          riskBudget: {
            sandboxMode: "read-only",
            maxWallClockMinutes: 5,
            maxCostUsd: 1,
            allowNetwork: false,
            requiresHumanApprovalFor: [],
          },
          deliverables: ["discovery_answer", "proof_bundle"],
          input: {
            discoveryQuestion: {
              companyKey: "acme",
              questionKind: "cash_posture",
            },
          },
        },
        createdAt: "2026-04-14T23:48:00.000Z",
        updatedAt: "2026-04-14T23:49:00.000Z",
      },
      tasks: [
        {
          id: "22222222-2222-4222-8222-222222222222",
          missionId: "11111111-1111-4111-8111-111111111111",
          role: "scout",
          sequence: 0,
          status: "succeeded",
          attemptCount: 1,
          codexThreadId: null,
          codexTurnId: null,
          workspaceId: null,
          dependsOnTaskId: null,
          summary: "Stored cash posture is available with limitations.",
          createdAt: "2026-04-14T23:48:00.000Z",
          updatedAt: "2026-04-14T23:49:00.000Z",
        },
      ],
      proofBundle: {
        missionId: "11111111-1111-4111-8111-111111111111",
        missionTitle: "Assess cash posture for acme",
        objective: "Answer the stored cash posture question for acme.",
        companyKey: "acme",
        questionKind: "cash_posture",
        answerSummary: "Stored cash posture is available with limitations.",
        freshnessSummary: "Bank summary coverage is stale.",
        limitationsSummary:
          "No FX conversion is performed and mixed as-of dates remain visible.",
        relatedRoutePaths: ["/finance-twin/companies/acme/cash-posture"],
        relatedWikiPageKeys: ["metrics/cash-posture"],
        targetRepoFullName: null,
        branchName: null,
        pullRequestNumber: null,
        pullRequestUrl: null,
        changeSummary: "Stored cash posture is available with limitations.",
        validationSummary:
          "Finance discovery answer was assembled deterministically from stored state.",
        verificationSummary:
          "Review freshness and limitation posture before acting on the answer.",
        riskSummary: "Stale bank-summary coverage could leave cash posture outdated.",
        rollbackSummary: "",
        latestApproval: null,
        evidenceCompleteness: {
          status: "complete",
          expectedArtifactKinds: ["discovery_answer"],
          presentArtifactKinds: ["discovery_answer"],
          missingArtifactKinds: [],
          notes: [],
        },
        decisionTrace: ["Scout task 0 produced discovery_answer artifact xyz."],
        artifactIds: ["33333333-3333-4333-8333-333333333333"],
        artifacts: [
          {
            id: "33333333-3333-4333-8333-333333333333",
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
      },
      discoveryAnswer: {
        source: "stored_finance_twin_and_cfo_wiki",
        summary: "Stored cash posture is available with limitations.",
        companyKey: "acme",
        questionKind: "cash_posture",
        answerSummary: "Stored cash posture is available with limitations.",
        freshnessPosture: {
          state: "stale",
          reasonSummary: "Bank summary coverage is stale.",
        },
        limitations: [
          "No FX conversion is performed and mixed as-of dates remain visible.",
        ],
        relatedRoutes: [
          {
            label: "Cash posture",
            routePath: "/finance-twin/companies/acme/cash-posture",
          },
        ],
        relatedWikiPages: [
          {
            pageKey: "metrics/cash-posture",
            title: "Cash posture",
          },
        ],
        evidenceSections: [
          {
            key: "cash-posture-route",
            title: "Cash posture route-backed evidence",
            summary: "Stored Finance Twin cash posture route result.",
            routePath: "/finance-twin/companies/acme/cash-posture",
          },
        ],
        bodyMarkdown: "## Summary\n\nStored cash posture is available with limitations.",
        structuredData: {},
      },
      approvals: [],
      approvalCards: [],
      artifacts: [],
      liveControl: {
        enabled: false,
        limitation: "single_process_only",
        mode: "api_only",
      },
    });

    expect(parsed.discoveryAnswer?.source).toBe(
      "stored_finance_twin_and_cfo_wiki",
    );
    if (parsed.discoveryAnswer?.source !== "stored_finance_twin_and_cfo_wiki") {
      throw new Error("expected finance discovery answer");
    }

    expect(parsed.discoveryAnswer?.companyKey).toBe("acme");
    expect(parsed.proofBundle.questionKind).toBe("cash_posture");
  });
});
