import { describe, expect, it } from "vitest";
import type {
  ArtifactRecord,
  MissionRecord,
  ProofBundleManifest,
} from "@pocket-cto/domain";
import { ReportingService } from "./service";

describe("ReportingService", () => {
  it("compiles one draft finance memo plus one linked evidence appendix from stored discovery evidence", async () => {
    const sourceMission = buildSourceDiscoveryMission();
    const reportingMission = buildReportingMission(sourceMission.id);
    const discoveryAnswerArtifact = buildDiscoveryAnswerArtifact(sourceMission.id);
    const sourceProofBundle = buildSourceProofBundle(sourceMission.id);
    const repository = createMissionRepositoryStub({
      artifactsByMissionId: {
        [sourceMission.id]: [
          discoveryAnswerArtifact,
          buildProofBundleArtifact(sourceMission.id),
        ],
      },
      missionsById: {
        [sourceMission.id]: sourceMission,
      },
      proofBundlesByMissionId: {
        [sourceMission.id]: sourceProofBundle,
      },
    });

    const service = new ReportingService({
      missionRepository: repository,
    });
    const compiled = await service.compileDraftReport(reportingMission);

    expect(compiled.financeMemo.reportKind).toBe("finance_memo");
    expect(compiled.financeMemo.draftStatus).toBe("draft_only");
    expect(compiled.financeMemo.sourceDiscoveryMissionId).toBe(sourceMission.id);
    expect(compiled.financeMemo.memoSummary).toContain("Cash posture");
    expect(compiled.financeMemo.relatedRoutePaths).toEqual([
      "/finance-twin/companies/acme/cash-posture",
      "/finance-twin/companies/acme/bank-accounts",
    ]);
    expect(compiled.financeMemo.bodyMarkdown).toContain("## Memo Summary");
    expect(compiled.evidenceAppendix.sourceArtifacts).toEqual([
      {
        artifactId: discoveryAnswerArtifact.id,
        kind: "discovery_answer",
      },
      {
        artifactId: "99999999-9999-4999-8999-999999999999",
        kind: "proof_bundle_manifest",
      },
    ]);
    expect(compiled.evidenceAppendix.bodyMarkdown).toContain(
      "## Source Discovery Lineage",
    );
    expect(compiled.evidenceAppendix.limitations).toContain(
      "Working-capital timing remains approximate because no payment calendar inference is performed.",
    );
  });

  it("carries source-proof gaps forward instead of inventing completeness", async () => {
    const sourceMission = buildSourceDiscoveryMission();
    const reportingMission = buildReportingMission(sourceMission.id);
    const repository = createMissionRepositoryStub({
      artifactsByMissionId: {
        [sourceMission.id]: [buildDiscoveryAnswerArtifact(sourceMission.id)],
      },
      missionsById: {
        [sourceMission.id]: sourceMission,
      },
      proofBundlesByMissionId: {},
    });

    const service = new ReportingService({
      missionRepository: repository,
    });
    const compiled = await service.compileDraftReport(reportingMission);

    expect(compiled.financeMemo.sourceArtifacts).toEqual([
      {
        artifactId: "66666666-6666-4666-8666-666666666666",
        kind: "discovery_answer",
      },
    ]);
    expect(compiled.financeMemo.limitationsSummary).toContain(
      "additional limitation",
    );
    expect(compiled.evidenceAppendix.limitations).toContain(
      "The source discovery proof bundle is missing, so this draft memo compiles from the stored discovery answer plus its persisted route and wiki evidence only.",
    );
  });
});

function createMissionRepositoryStub(input: {
  artifactsByMissionId: Record<string, ArtifactRecord[]>;
  missionsById: Record<string, MissionRecord>;
  proofBundlesByMissionId: Record<string, ProofBundleManifest>;
}) {
  return {
    async getMissionById(missionId: string) {
      return input.missionsById[missionId] ?? null;
    },
    async getProofBundleByMissionId(missionId: string) {
      return input.proofBundlesByMissionId[missionId] ?? null;
    },
    async listArtifactsByMissionId(missionId: string) {
      return input.artifactsByMissionId[missionId] ?? [];
    },
  };
}

function buildReportingMission(sourceDiscoveryMissionId: string): MissionRecord {
  return {
    id: "55555555-5555-4555-8555-555555555555",
    type: "reporting",
    status: "queued",
    title: "Draft finance memo for acme from cash posture discovery",
    objective:
      "Compile one draft finance memo plus one linked evidence appendix from completed discovery mission and its stored evidence only.",
    sourceKind: "manual_reporting",
    sourceRef: null,
    createdBy: "finance-operator",
    primaryRepo: null,
    spec: {
      type: "reporting",
      title: "Draft finance memo for acme from cash posture discovery",
      objective:
        "Compile one draft finance memo plus one linked evidence appendix from completed discovery mission and its stored evidence only.",
      repos: [],
      constraints: {
        mustNot: ["do not invoke the codex runtime"],
        allowedPaths: [],
      },
      acceptance: [
        "persist one draft finance_memo artifact",
        "persist one linked evidence_appendix artifact",
      ],
      riskBudget: {
        sandboxMode: "read-only",
        maxWallClockMinutes: 5,
        maxCostUsd: 1,
        allowNetwork: false,
        requiresHumanApprovalFor: [],
      },
      deliverables: ["finance_memo", "evidence_appendix", "proof_bundle"],
      evidenceRequirements: ["stored discovery_answer artifact"],
      input: {
        reportingRequest: {
          sourceDiscoveryMissionId,
          reportKind: "finance_memo",
          companyKey: "acme",
          questionKind: "cash_posture",
          policySourceId: null,
          policySourceScope: null,
        },
      },
    },
    createdAt: "2026-04-18T12:00:00.000Z",
    updatedAt: "2026-04-18T12:00:00.000Z",
  };
}

function buildSourceDiscoveryMission(): MissionRecord {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    type: "discovery",
    status: "succeeded",
    title: "Review cash posture for acme",
    objective:
      "Answer the stored cash posture question for acme from persisted Finance Twin and CFO Wiki state only.",
    sourceKind: "manual_discovery",
    sourceRef: null,
    createdBy: "finance-operator",
    primaryRepo: null,
    spec: {
      type: "discovery",
      title: "Review cash posture for acme",
      objective:
        "Answer the stored cash posture question for acme from persisted Finance Twin and CFO Wiki state only.",
      repos: [],
      constraints: {
        mustNot: [],
        allowedPaths: [],
      },
      acceptance: ["persist one durable finance discovery answer artifact"],
      riskBudget: {
        sandboxMode: "read-only",
        maxWallClockMinutes: 5,
        maxCostUsd: 1,
        allowNetwork: false,
        requiresHumanApprovalFor: [],
      },
      deliverables: ["discovery_answer", "proof_bundle"],
      evidenceRequirements: ["stored finance discovery answer"],
      input: {
        discoveryQuestion: {
          companyKey: "acme",
          questionKind: "cash_posture",
        },
      },
    },
    createdAt: "2026-04-18T11:55:00.000Z",
    updatedAt: "2026-04-18T11:58:00.000Z",
  };
}

function buildDiscoveryAnswerArtifact(missionId: string): ArtifactRecord {
  return {
    id: "66666666-6666-4666-8666-666666666666",
    missionId,
    taskId: "77777777-7777-4777-8777-777777777777",
    kind: "discovery_answer",
    uri: `pocket-cto://missions/${missionId}/tasks/77777777-7777-4777-8777-777777777777/discovery-answer`,
    mimeType: "application/json",
    sha256: null,
    metadata: {
      source: "stored_finance_twin_and_cfo_wiki",
      summary:
        "Cash posture remains constrained by stale bank coverage and visible working-capital gaps.",
      companyKey: "acme",
      questionKind: "cash_posture",
      policySourceId: null,
      policySourceScope: null,
      answerSummary:
        "Cash posture remains constrained by stale bank coverage and visible working-capital gaps.",
      freshnessPosture: {
        state: "stale",
        reasonSummary:
          "Cash posture remains stale because the latest bank account summary sync is older than the freshness threshold.",
      },
      limitations: [
        "Working-capital timing remains approximate because no payment calendar inference is performed.",
      ],
      relatedRoutes: [
        {
          label: "Cash posture",
          routePath: "/finance-twin/companies/acme/cash-posture",
        },
        {
          label: "Bank accounts",
          routePath: "/finance-twin/companies/acme/bank-accounts",
        },
      ],
      relatedWikiPages: [
        {
          pageKey: "metrics/cash-posture",
          title: "Cash posture",
        },
        {
          pageKey: "concepts/cash",
          title: "Cash",
        },
      ],
      evidenceSections: [
        {
          key: "cash_posture_route",
          title: "Cash posture route-backed evidence",
          summary: "Stored Finance Twin cash posture output.",
          routePath: "/finance-twin/companies/acme/cash-posture",
        },
      ],
      bodyMarkdown: "# Cash posture\n\nStored finance answer.",
      structuredData: {},
    },
    createdAt: "2026-04-18T11:58:00.000Z",
  };
}

function buildProofBundleArtifact(missionId: string): ArtifactRecord {
  return {
    id: "99999999-9999-4999-8999-999999999999",
    missionId,
    taskId: null,
    kind: "proof_bundle_manifest",
    uri: `pocket-cto://missions/${missionId}/proof-bundle-manifest`,
    mimeType: "application/json",
    sha256: null,
    metadata: {
      manifest: buildSourceProofBundle(missionId),
    },
    createdAt: "2026-04-18T11:58:30.000Z",
  };
}

function buildSourceProofBundle(missionId: string): ProofBundleManifest {
  return {
    missionId,
    missionTitle: "Review cash posture for acme",
    objective:
      "Answer the stored cash posture question for acme from persisted Finance Twin and CFO Wiki state only.",
    sourceDiscoveryMissionId: null,
    companyKey: "acme",
    questionKind: "cash_posture",
    policySourceId: null,
    policySourceScope: null,
    answerSummary:
      "Cash posture remains constrained by stale bank coverage and visible working-capital gaps.",
    reportKind: null,
    reportDraftStatus: null,
    reportSummary: "",
    appendixPresent: false,
    freshnessState: "stale",
    freshnessSummary:
      "Cash posture remains stale because the latest bank account summary sync is older than the freshness threshold.",
    limitationsSummary:
      "Working-capital timing remains approximate because no payment calendar inference is performed.",
    relatedRoutePaths: [
      "/finance-twin/companies/acme/cash-posture",
      "/finance-twin/companies/acme/bank-accounts",
    ],
    relatedWikiPageKeys: ["metrics/cash-posture", "concepts/cash"],
    targetRepoFullName: null,
    branchName: null,
    pullRequestNumber: null,
    pullRequestUrl: null,
    changeSummary:
      "Cash posture remains constrained by stale bank coverage and visible working-capital gaps.",
    validationSummary:
      "Finance discovery answer was assembled deterministically from stored Finance Twin and CFO Wiki state without running the Codex runtime.",
    verificationSummary:
      "Review the stored freshness, route-backed evidence, and visible limitations before acting on the answer.",
    riskSummary:
      "The answer is grounded only in stored Finance Twin and CFO Wiki state, so stale evidence must be weighed before taking follow-up action.",
    rollbackSummary:
      "No code, branch, pull request, or deploy side effect was produced.",
    latestApproval: null,
    evidenceCompleteness: {
      status: "complete",
      expectedArtifactKinds: ["discovery_answer"],
      presentArtifactKinds: ["discovery_answer"],
      missingArtifactKinds: [],
      notes: [],
    },
    decisionTrace: [
      "Scout task 0 terminalized as succeeded with persisted discovery evidence.",
    ],
    artifactIds: ["66666666-6666-4666-8666-666666666666"],
    artifacts: [
      {
        id: "66666666-6666-4666-8666-666666666666",
        kind: "discovery_answer",
      },
    ],
    replayEventCount: 6,
    timestamps: {
      missionCreatedAt: "2026-04-18T11:55:00.000Z",
      latestPlannerEvidenceAt: null,
      latestExecutorEvidenceAt: null,
      latestPullRequestAt: null,
      latestApprovalAt: null,
      latestArtifactAt: "2026-04-18T11:58:00.000Z",
    },
    status: "ready",
  };
}
