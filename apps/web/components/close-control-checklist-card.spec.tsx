import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { CloseControlChecklistResult } from "@pocket-cto/domain";
import { CloseControlChecklistCard } from "./close-control-checklist-card";

describe("CloseControlChecklistCard", () => {
  it("renders checklist evidence, item posture, and absence boundaries", () => {
    const html = renderToStaticMarkup(
      <CloseControlChecklistCard checklist={buildChecklist()} />,
    );

    expect(html).toContain("F6H close/control checklist");
    expect(html).toContain("acme");
    expect(html).toContain("source_coverage_review");
    expect(html).toContain("cash_source_freshness_review");
    expect(html).toContain("monitor_replay_readiness");
    expect(html).toContain("stored source-backed posture");
    expect(html).toContain("Review-only boundary");
    expect(html).toContain("runtimeCodexUsed");
    expect(html).toContain("monitorRunTriggered");
    expect(html).toContain("missionCreated");
    expect(html).toContain("false");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<a ");

    for (const forbidden of [
      "send",
      "notify",
      "email",
      "slack",
      "publish",
      "approve",
      "create report",
      "book journal",
      "file tax",
      "contact customer",
      "collect payment",
      "ask codex",
      "remediate",
      "rerun monitor",
    ]) {
      expect(html.toLowerCase()).not.toContain(forbidden);
    }
  });

  it("renders a quiet empty posture when no checklist is available", () => {
    const html = renderToStaticMarkup(
      <CloseControlChecklistCard checklist={null} />,
    );

    expect(html).toContain("No checklist posture");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<button");
  });
});

function buildChecklist(): CloseControlChecklistResult {
  const families = [
    "source_coverage_review",
    "cash_source_freshness_review",
    "receivables_aging_source_freshness_review",
    "payables_aging_source_freshness_review",
    "policy_source_freshness_review",
    "monitor_replay_readiness",
  ] as const;

  return {
    companyKey: "acme",
    generatedAt: "2026-04-27T12:00:00.000Z",
    aggregateStatus: "ready_for_review",
    items: families.map((family) => ({
      family,
      status: "ready_for_review",
      sourcePosture: {
        state:
          family === "monitor_replay_readiness"
            ? "monitor_context_present"
            : "source_backed",
        summary: `${family} has stored source-backed posture.`,
        refs: [],
      },
      evidenceBasis: {
        basisKind:
          family === "source_coverage_review"
            ? "derived_source_coverage"
            : family === "policy_source_freshness_review"
              ? "stored_cfo_wiki_policy_posture"
              : family === "monitor_replay_readiness"
                ? "latest_persisted_monitor_result_context"
                : "stored_finance_twin_posture",
        summary: `${family} uses persisted evidence only.`,
        refs: [],
      },
      freshnessSummary: {
        state:
          family === "monitor_replay_readiness" ? "not_applicable" : "fresh",
        summary: `${family} freshness is review-ready.`,
        latestObservedAt: "2026-04-27T12:00:00.000Z",
      },
      limitations: ["This is a deterministic review foundation."],
      humanReviewNextStep:
        "Review stored evidence posture before close sign-off.",
      proofPosture: {
        state:
          family === "monitor_replay_readiness"
            ? "review_only_context"
            : "source_backed",
        summary: `${family} proof is ready for human review.`,
      },
    })),
    evidenceSummary:
      "Stored Finance Twin, CFO Wiki, and monitor context support review.",
    limitations: ["The checklist does not assert close completion."],
    runtimeActionBoundary: {
      runtimeCodexUsed: false,
      deliveryCreated: false,
      reportCreated: false,
      approvalCreated: false,
      accountingWriteCreated: false,
      bankWriteCreated: false,
      taxFilingCreated: false,
      legalAdviceGenerated: false,
      policyAdviceGenerated: false,
      paymentInstructionCreated: false,
      collectionInstructionCreated: false,
      customerContactInstructionCreated: false,
      autonomousActionCreated: false,
      monitorRunTriggered: false,
      missionCreated: false,
      summary:
        "Checklist rendering is review-only and no actions were created.",
      replayImplication:
        "The checklist is not appended to mission replay in this F6H slice.",
    },
  };
}
