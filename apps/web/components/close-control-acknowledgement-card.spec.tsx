import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { CloseControlAcknowledgementReadinessResult } from "@pocket-cto/domain";
import { CloseControlAcknowledgementCard } from "./close-control-acknowledgement-card";

describe("CloseControlAcknowledgementCard", () => {
  it("renders acknowledgement targets, evidence posture, limitations, review steps, and absence boundaries", () => {
    const html = renderToStaticMarkup(
      <CloseControlAcknowledgementCard readiness={buildReadiness()} />,
    );

    expect(html).toContain("F6K acknowledgement readiness");
    expect(html).toContain("acme");
    expect(html).toContain("ready_for_acknowledgement");
    expect(html).toContain("needs_review_before_acknowledgement");
    expect(html).toContain("checklist_aggregate");
    expect(html).toContain("cash_source_freshness_review");
    expect(html).toContain("source_backed");
    expect(html).toContain("limited_by_coverage_gap");
    expect(html).toContain("Human review next step");
    expect(html).toContain("internal_review_only_no_approval_created_no_close_complete");
    expect(html).toContain("runtimeCodexUsed");
    expect(html).toContain("outboxSendCreated");
    expect(html).toContain("monitorResultCreated");
    expect(html).toContain("false");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<a ");

    for (const forbiddenButtonLabel of [
      "Create report",
      "Create mission",
      "Ask Codex",
      "Rerun monitor",
      "Book journal",
      "File tax",
      "Contact customer",
      "Collect payment",
    ]) {
      expect(html).not.toContain(forbiddenButtonLabel);
    }
  });

  it("renders a quiet empty posture when no acknowledgement readiness is available", () => {
    const html = renderToStaticMarkup(
      <CloseControlAcknowledgementCard readiness={null} />,
    );

    expect(html).toContain("No acknowledgement-readiness posture");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<button");
  });
});

function buildReadiness(): CloseControlAcknowledgementReadinessResult {
  return {
    companyKey: "acme",
    generatedAt: "2026-04-28T12:00:00.000Z",
    aggregateStatus: "needs_review_before_acknowledgement",
    acknowledgementTargets: [
      {
        targetKey: "close-control:checklist-aggregate",
        targetKind: "checklist_aggregate",
        status: "ready_for_acknowledgement",
        evidenceBasis: {
          summary:
            "Aggregate target uses stored close/control checklist posture.",
          checklistEvidenceRefs: [],
          readinessEvidenceRefs: [],
        },
        sourcePosture: {
          state: "source_backed",
          summary: "Stored aggregate posture is available.",
          missingSource: false,
        },
        freshnessSummary: {
          state: "fresh",
          summary: "Aggregate freshness is current.",
          latestObservedAt: "2026-04-28T12:00:00.000Z",
        },
        limitations: ["Aggregate target remains internal review posture."],
        proofPosture: {
          state: "source_backed",
          summary: "Aggregate proof posture is source-backed.",
        },
        humanReviewNextStep:
          "Review aggregate posture before any future acknowledgement path.",
        relatedChecklistItemFamily: null,
        relatedReadinessItemKey: null,
      },
      {
        targetKey: "close-control:item-family:cash_source_freshness_review",
        targetKind: "checklist_item_family",
        status: "needs_review_before_acknowledgement",
        evidenceBasis: {
          summary:
            "Cash target uses stored checklist item and readiness posture.",
          checklistEvidenceRefs: [],
          readinessEvidenceRefs: [],
        },
        sourcePosture: {
          state: "limited_source",
          summary: "Cash source posture needs review.",
          missingSource: false,
        },
        freshnessSummary: {
          state: "mixed",
          summary: "Cash freshness posture needs review.",
          latestObservedAt: "2026-04-28T12:00:00.000Z",
        },
        limitations: ["Cash source target needs review before acknowledgement readiness."],
        proofPosture: {
          state: "limited_by_coverage_gap",
          summary: "Cash source proof is limited by coverage gaps.",
        },
        humanReviewNextStep:
          "Review cash source posture before internal acknowledgement readiness.",
        relatedChecklistItemFamily: "cash_source_freshness_review",
        relatedReadinessItemKey: "close-control:cash_source_freshness_review",
      },
    ],
    evidenceSummary:
      "Acknowledgement readiness is derived from checklist and operator readiness posture.",
    limitations: [
      "Acknowledgement readiness is internal review posture only.",
    ],
    operatorReadinessContext: {
      operatorReadinessAggregateStatus: "needs_review",
      nonReadyReadinessItemKeys: ["close-control:cash_source_freshness_review"],
      summary: "Operator readiness context has one item needing review.",
      limitations: ["Readiness context is not mutated."],
    },
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
        "Acknowledgement readiness rendering is internal review only and no actions were created.",
      replayImplication:
        "The acknowledgement-readiness result is not appended to mission replay in this slice.",
    },
  };
}
