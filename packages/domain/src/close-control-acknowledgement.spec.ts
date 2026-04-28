import { describe, expect, it } from "vitest";
import {
  CloseControlAcknowledgementReadinessResultSchema,
  CloseControlAcknowledgementRuntimeActionAbsenceBoundarySchema,
  CloseControlAcknowledgementStatusSchema,
  deriveCloseControlAcknowledgementAggregateStatus,
  type CloseControlAcknowledgementStatus,
  type CloseControlAcknowledgementTarget,
} from "./close-control-acknowledgement";

const generatedAt = "2026-04-28T12:00:00.000Z";

describe("close/control acknowledgement-readiness domain contract", () => {
  it("accepts one internal acknowledgement-readiness result with evidence, context, and action absence posture", () => {
    const parsed = CloseControlAcknowledgementReadinessResultSchema.parse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "needs_review_before_acknowledgement",
      acknowledgementTargets: [
        buildTarget("checklist:aggregate", "checklist_aggregate"),
        buildTarget(
          "checklist:item:cash_source_freshness_review",
          "checklist_item_family",
          "needs_review_before_acknowledgement",
        ),
      ],
      evidenceSummary:
        "F6K acknowledgement readiness is derived from deterministic close/control checklist posture and operator-readiness posture only.",
      limitations: [
        "Acknowledgement readiness is internal review posture and does not create an acknowledgement record.",
      ],
      operatorReadinessContext: {
        operatorReadinessAggregateStatus: "needs_review",
        nonReadyReadinessItemKeys: [
          "close-control:cash_source_freshness_review",
        ],
        summary:
          "Operator readiness has one source-freshness attention item that needs review.",
        limitations: [
          "Operator readiness context is carried forward and not mutated.",
        ],
      },
      runtimeActionBoundary: buildBoundary(),
    });

    expect(parsed.aggregateStatus).toBe(
      "needs_review_before_acknowledgement",
    );
    expect(parsed.acknowledgementTargets[0]).toMatchObject({
      targetKind: "checklist_aggregate",
      status: "ready_for_acknowledgement",
      relatedChecklistItemFamily: null,
    });
    expect(parsed.acknowledgementTargets[1]).toMatchObject({
      targetKind: "checklist_item_family",
      relatedChecklistItemFamily: "cash_source_freshness_review",
      relatedReadinessItemKey: "close-control:cash_source_freshness_review",
    });
    expect(parsed.runtimeActionBoundary).toMatchObject({
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
    });
  });

  it("keeps acknowledgement status vocabulary narrow and excludes release or completion wording", () => {
    expect(CloseControlAcknowledgementStatusSchema.options).toEqual([
      "ready_for_acknowledgement",
      "needs_review_before_acknowledgement",
      "blocked_by_evidence",
    ]);
    expect(CloseControlAcknowledgementStatusSchema.options).not.toContain(
      "approved",
    );
    expect(CloseControlAcknowledgementStatusSchema.options).not.toContain(
      "approval_pending",
    );
    expect(CloseControlAcknowledgementStatusSchema.options).not.toContain(
      "signed_off",
    );
    expect(CloseControlAcknowledgementStatusSchema.options).not.toContain(
      "certified",
    );
    expect(CloseControlAcknowledgementStatusSchema.options).not.toContain(
      "close_complete",
    );
  });

  it("derives blocked aggregate acknowledgement readiness when any target is blocked", () => {
    expect(
      deriveCloseControlAcknowledgementAggregateStatus([
        buildTarget("checklist:aggregate", "checklist_aggregate"),
        buildTarget(
          "checklist:item:policy_source_freshness_review",
          "checklist_item_family",
          "blocked_by_evidence",
        ),
      ]),
    ).toBe("blocked_by_evidence");
  });

  it("derives needs-review aggregate acknowledgement readiness when no target is blocked but one needs review", () => {
    expect(
      deriveCloseControlAcknowledgementAggregateStatus([
        buildTarget("checklist:aggregate", "checklist_aggregate"),
        buildTarget(
          "checklist:item:monitor_replay_readiness",
          "checklist_item_family",
          "needs_review_before_acknowledgement",
        ),
      ]),
    ).toBe("needs_review_before_acknowledgement");
  });

  it("rejects aggregate status that hides blocked acknowledgement evidence", () => {
    const result = CloseControlAcknowledgementReadinessResultSchema.safeParse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_acknowledgement",
      acknowledgementTargets: [
        buildTarget("checklist:aggregate", "checklist_aggregate"),
        buildTarget(
          "checklist:item:source_coverage_review",
          "checklist_item_family",
          "blocked_by_evidence",
        ),
      ],
      evidenceSummary: "Derived acknowledgement-readiness result.",
      limitations: ["Internal review posture only."],
      operatorReadinessContext: {
        operatorReadinessAggregateStatus: "blocked_by_evidence",
        nonReadyReadinessItemKeys: ["close-control:source_coverage_review"],
        summary: "Operator readiness context is blocked by evidence.",
        limitations: [],
      },
      runtimeActionBoundary: buildBoundary(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate target keys and any runtime/action absence field set to true", () => {
    const duplicateResult =
      CloseControlAcknowledgementReadinessResultSchema.safeParse({
        companyKey: "acme",
        generatedAt,
        aggregateStatus: "ready_for_acknowledgement",
        acknowledgementTargets: [
          buildTarget("checklist:aggregate", "checklist_aggregate"),
          buildTarget("checklist:aggregate", "checklist_aggregate"),
        ],
        evidenceSummary: "Derived acknowledgement-readiness result.",
        limitations: ["Internal review posture only."],
        operatorReadinessContext: {
          operatorReadinessAggregateStatus: "ready_for_review",
          nonReadyReadinessItemKeys: [],
          summary: "Operator readiness context is ready for review.",
          limitations: [],
        },
        runtimeActionBoundary: buildBoundary(),
      });
    const boundaryResult =
      CloseControlAcknowledgementRuntimeActionAbsenceBoundarySchema.safeParse({
        ...buildBoundary(),
        monitorResultCreated: true,
      });

    expect(duplicateResult.success).toBe(false);
    expect(boundaryResult.success).toBe(false);
  });
});

function buildTarget(
  targetKey: string,
  targetKind: CloseControlAcknowledgementTarget["targetKind"],
  status: CloseControlAcknowledgementStatus = "ready_for_acknowledgement",
): CloseControlAcknowledgementTarget {
  const checklistItem =
    targetKind === "checklist_item_family"
      ? "cash_source_freshness_review"
      : null;

  return {
    targetKey,
    targetKind,
    status,
    evidenceBasis: {
      summary:
        "Derived from stored close/control checklist posture and operator-readiness posture.",
      checklistEvidenceRefs: [
        {
          kind: "derived_checklist_read",
          evidencePath: targetKey,
          summary: "Derived close/control checklist read posture.",
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind: null,
          monitorResultId: null,
        },
      ],
      readinessEvidenceRefs: [],
    },
    sourcePosture: {
      state: status === "blocked_by_evidence" ? "missing_source" : "source_backed",
      summary:
        status === "blocked_by_evidence"
          ? "Required source posture is missing."
          : "Stored source posture is available for internal review.",
      missingSource: status === "blocked_by_evidence",
    },
    freshnessSummary: {
      state: status === "blocked_by_evidence" ? "missing" : "fresh",
      summary:
        status === "blocked_by_evidence"
          ? "Fresh stored source posture is not available."
          : "Fresh stored source posture is available.",
      latestObservedAt: generatedAt,
    },
    limitations: [
      "This target is acknowledgement-readiness posture and creates no record or action.",
    ],
    proofPosture: {
      state:
        status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : "source_backed",
      summary:
        status === "blocked_by_evidence"
          ? "The target is limited by missing stored evidence."
          : "The target is backed by stored review posture.",
    },
    humanReviewNextStep:
      "Review the cited stored posture before any future acknowledgement path.",
    relatedChecklistItemFamily: checklistItem,
    relatedReadinessItemKey: checklistItem
      ? `close-control:${checklistItem}`
      : null,
  };
}

function buildBoundary() {
  return {
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
      "F6K acknowledgement readiness is deterministic, read-only, and records all runtime/action absence flags as false.",
    replayImplication:
      "The first F6K acknowledgement-readiness result is generated from current stored posture and is not persisted as a mission replay event.",
  };
}
