import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { OperatorReadinessResult } from "@pocket-cto/domain";
import { OperatorReadinessCard } from "./operator-readiness-card";

describe("OperatorReadinessCard", () => {
  it("renders readiness evidence, item posture, and internal absence boundaries", () => {
    const html = renderToStaticMarkup(
      <OperatorReadinessCard readiness={buildReadiness()} />,
    );

    expect(html).toContain("F6J operator readiness");
    expect(html).toContain("acme");
    expect(html).toContain("monitor_alert_attention");
    expect(html).toContain("source_freshness_attention");
    expect(html).toContain("source_backed");
    expect(html).toContain("limited_by_coverage_gap");
    expect(html).toContain("Internal review boundary");
    expect(html).toContain("internal_review_only_no_delivery_created");
    expect(html).toContain("runtimeCodexUsed");
    expect(html).toContain("monitorResultCreated");
    expect(html).toContain("false");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<a ");

    for (const forbidden of [
      "send",
      "notify",
      "email",
      "slack",
      "sms",
      "webhook",
      "publish",
      "approve",
      "create report",
      "create mission",
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

  it("renders a quiet empty posture when no readiness result is available", () => {
    const html = renderToStaticMarkup(
      <OperatorReadinessCard readiness={null} />,
    );

    expect(html).toContain("No readiness posture");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<button");
  });
});

function buildReadiness(): OperatorReadinessResult {
  return {
    companyKey: "acme",
    generatedAt: "2026-04-28T12:00:00.000Z",
    aggregateStatus: "needs_review",
    attentionItems: [
      {
        itemKey: "monitor:cash_posture:11111111-1111-4111-8111-111111111111",
        family: "monitor_alert_attention",
        status: "needs_review",
        evidenceBasis: {
          basisKind: "latest_persisted_monitor_result",
          summary: "Latest persisted monitor result needs review.",
          refs: [],
        },
        sourceLineageRefs: [],
        sourcePosture: {
          state: "source_backed",
          summary: "Monitor source posture is source-backed.",
          refs: [],
        },
        freshnessSummary: {
          state: "fresh",
          summary: "Monitor source freshness is fresh.",
          latestObservedAt: "2026-04-28T12:00:00.000Z",
        },
        limitations: [
          "The monitor item is internal review posture and creates no external delivery.",
        ],
        proofPosture: {
          state: "source_backed",
          summary: "Monitor proof is source-backed.",
        },
        humanReviewNextStep:
          "Review monitor posture before deciding any follow-up.",
        relatedMonitorKind: "cash_posture",
        relatedChecklistItemFamily: null,
        relatedAlertStatus: "alert",
      },
      {
        itemKey: "close-control:cash_source_freshness_review",
        family: "source_freshness_attention",
        status: "needs_review",
        evidenceBasis: {
          basisKind: "source_freshness_posture",
          summary: "Close/control source freshness needs review.",
          refs: [],
        },
        sourceLineageRefs: [],
        sourcePosture: {
          state: "limited_source",
          summary: "Cash source posture is limited.",
          refs: [],
        },
        freshnessSummary: {
          state: "mixed",
          summary: "Cash source freshness is mixed.",
          latestObservedAt: "2026-04-28T12:00:00.000Z",
        },
        limitations: [
          "Checklist posture remains internal review only.",
        ],
        proofPosture: {
          state: "limited_by_coverage_gap",
          summary: "Cash source proof is limited by coverage gaps.",
        },
        humanReviewNextStep:
          "Review source posture before close/control reliance.",
        relatedMonitorKind: null,
        relatedChecklistItemFamily: "cash_source_freshness_review",
        relatedAlertStatus: null,
      },
    ],
    evidenceSummary:
      "Readiness is derived from latest persisted monitor results and close/control checklist posture.",
    limitations: [
      "Operator readiness is internal review posture and creates no external delivery.",
    ],
    runtimeActionBoundary: {
      runtimeCodexUsed: false,
      deliveryCreated: false,
      outboxSendCreated: false,
      reportCreated: false,
      approvalCreated: false,
      missionCreated: false,
      monitorRunTriggered: false,
      monitorResultCreated: false,
      accountingWriteCreated: false,
      bankWriteCreated: false,
      taxFilingCreated: false,
      legalAdviceGenerated: false,
      policyAdviceGenerated: false,
      paymentInstructionCreated: false,
      collectionInstructionCreated: false,
      customerContactInstructionCreated: false,
      autonomousActionCreated: false,
      summary:
        "Readiness rendering is internal review only and no actions were created.",
      replayImplication:
        "The readiness result is not appended to mission replay in this F6J slice.",
    },
  };
}
