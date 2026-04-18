import { describe, expect, it } from "vitest";
import {
  CreateReportingMissionInputSchema,
  EvidenceAppendixArtifactMetadataSchema,
  FinanceMemoArtifactMetadataSchema,
  ReportingMissionViewSchema,
  readReportingMissionReportKindLabel,
} from "./reporting-mission";

describe("Reporting mission domain schemas", () => {
  it("parses the narrow reporting creation input", () => {
    const parsed = CreateReportingMissionInputSchema.parse({
      sourceDiscoveryMissionId: "11111111-1111-4111-8111-111111111111",
      reportKind: "finance_memo",
      requestedBy: "finance-operator",
    });

    expect(parsed.reportKind).toBe("finance_memo");
    expect(parsed.requestedBy).toBe("finance-operator");
  });

  it("parses finance memo and evidence appendix metadata", () => {
    const financeMemo = FinanceMemoArtifactMetadataSchema.parse({
      source: "stored_discovery_evidence",
      summary:
        "Cash posture remains constrained by stale bank coverage and visible working-capital gaps.",
      reportKind: "finance_memo",
      draftStatus: "draft_only",
      sourceDiscoveryMissionId: "11111111-1111-4111-8111-111111111111",
      companyKey: "acme",
      questionKind: "cash_posture",
      policySourceId: null,
      policySourceScope: null,
      memoSummary:
        "Cash posture remains constrained by stale bank coverage and visible working-capital gaps.",
      freshnessSummary:
        "Cash posture remains stale because the latest bank account summary sync is older than the freshness threshold.",
      limitationsSummary:
        "This memo is draft-only and carries source discovery freshness and limitation posture forward.",
      relatedRoutePaths: ["/finance-twin/companies/acme/cash-posture"],
      relatedWikiPageKeys: ["metrics/cash-posture"],
      sourceArtifacts: [
        {
          artifactId: "22222222-2222-4222-8222-222222222222",
          kind: "discovery_answer",
        },
      ],
      bodyMarkdown:
        "# Draft Finance Memo\n\n## Memo Summary\n\nCash posture remains constrained.",
    });
    const appendix = EvidenceAppendixArtifactMetadataSchema.parse({
      source: "stored_discovery_evidence",
      summary:
        "Evidence appendix for source discovery mission 11111111-1111-4111-8111-111111111111.",
      reportKind: "finance_memo",
      draftStatus: "draft_only",
      sourceDiscoveryMissionId: "11111111-1111-4111-8111-111111111111",
      companyKey: "acme",
      questionKind: "cash_posture",
      policySourceId: null,
      policySourceScope: null,
      appendixSummary:
        "Stored evidence appendix for discovery mission 11111111-1111-4111-8111-111111111111.",
      freshnessSummary:
        "Cash posture remains stale because the latest bank account summary sync is older than the freshness threshold.",
      limitationsSummary:
        "This memo is draft-only and carries source discovery freshness and limitation posture forward.",
      limitations: [
        "The source discovery proof bundle is incomplete with missing evidence kinds: discovery_answer.",
      ],
      relatedRoutePaths: ["/finance-twin/companies/acme/cash-posture"],
      relatedWikiPageKeys: ["metrics/cash-posture"],
      sourceArtifacts: [
        {
          artifactId: "22222222-2222-4222-8222-222222222222",
          kind: "discovery_answer",
        },
      ],
      bodyMarkdown: "# Evidence Appendix\n\n## Source Discovery Lineage\n",
    });

    expect(financeMemo.reportKind).toBe("finance_memo");
    expect(appendix.sourceArtifacts).toHaveLength(1);
  });

  it("parses the reporting read model view", () => {
    const parsed = ReportingMissionViewSchema.parse({
      reportKind: "finance_memo",
      draftStatus: "draft_only",
      sourceDiscoveryMissionId: "11111111-1111-4111-8111-111111111111",
      companyKey: "acme",
      questionKind: "cash_posture",
      policySourceId: null,
      policySourceScope: null,
      reportSummary:
        "Cash posture remains constrained by stale bank coverage and visible working-capital gaps.",
      freshnessSummary:
        "Cash posture remains stale because the latest bank account summary sync is older than the freshness threshold.",
      limitationsSummary:
        "This memo is draft-only and carries source discovery freshness and limitation posture forward.",
      relatedRoutePaths: ["/finance-twin/companies/acme/cash-posture"],
      relatedWikiPageKeys: ["metrics/cash-posture"],
      appendixPresent: true,
      financeMemo: null,
      evidenceAppendix: null,
    });

    expect(parsed.appendixPresent).toBe(true);
    expect(readReportingMissionReportKindLabel(parsed.reportKind)).toBe(
      "Finance memo",
    );
  });
});
