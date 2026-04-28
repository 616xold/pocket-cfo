import { describe, expect, it } from "vitest";
import {
  OPERATOR_ATTENTION_ITEM_FAMILIES,
  OperatorReadinessResultSchema,
  OperatorReadinessStatusSchema,
  OperatorRuntimeActionAbsenceBoundarySchema,
  deriveOperatorReadinessAggregateStatus,
  type OperatorAttentionItem,
  type OperatorAttentionItemFamily,
} from "./operator-readiness";

const generatedAt = "2026-04-28T12:00:00.000Z";

describe("operator readiness domain contract", () => {
  it("accepts a deterministic internal readiness result with evidence and action absence posture", () => {
    const parsed = OperatorReadinessResultSchema.parse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "needs_review",
      attentionItems: [
        buildItem("monitor_alert_attention", "needs_review"),
        buildItem("source_freshness_attention", "ready_for_review"),
      ],
      evidenceSummary:
        "F6J readiness is derived from latest persisted monitor results and the close/control checklist only.",
      limitations: [
        "Operator readiness is internal review posture and not an external notification.",
      ],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(parsed.aggregateStatus).toBe("needs_review");
    expect(parsed.attentionItems[0]).toMatchObject({
      family: "monitor_alert_attention",
      status: "needs_review",
      relatedMonitorKind: "cash_posture",
      relatedAlertStatus: "alert",
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

  it("keeps the status vocabulary review-oriented", () => {
    expect(OperatorReadinessStatusSchema.options).toEqual([
      "ready_for_review",
      "needs_review",
      "blocked_by_evidence",
    ]);
    expect(OperatorReadinessStatusSchema.options).not.toContain("sent");
    expect(OperatorReadinessStatusSchema.options).not.toContain("delivered");
  });

  it("keeps the family set internal and delivery-free", () => {
    expect(OPERATOR_ATTENTION_ITEM_FAMILIES).toEqual([
      "monitor_alert_attention",
      "close_control_attention",
      "source_freshness_attention",
      "policy_source_attention",
    ]);
    expect(OPERATOR_ATTENTION_ITEM_FAMILIES.join(" ")).not.toContain("channel");
    expect(OPERATOR_ATTENTION_ITEM_FAMILIES.join(" ")).not.toContain("send");
  });

  it("derives aggregate status with blocked evidence taking precedence", () => {
    expect(
      deriveOperatorReadinessAggregateStatus([
        buildItem("monitor_alert_attention", "ready_for_review"),
        buildItem("source_freshness_attention", "blocked_by_evidence"),
      ]),
    ).toBe("blocked_by_evidence");
  });

  it("rejects aggregate status that hides review needs", () => {
    const result = OperatorReadinessResultSchema.safeParse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_review",
      attentionItems: [
        buildItem("monitor_alert_attention", "needs_review"),
      ],
      evidenceSummary: "Derived readiness result.",
      limitations: ["Internal review only."],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate item keys and any runtime/action boundary set to true", () => {
    const duplicateResult = OperatorReadinessResultSchema.safeParse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_review",
      attentionItems: [
        buildItem("monitor_alert_attention"),
        buildItem("monitor_alert_attention"),
      ],
      evidenceSummary: "Derived readiness result.",
      limitations: ["Internal review only."],
      runtimeActionBoundary: buildBoundary(),
    });
    const boundaryResult = OperatorRuntimeActionAbsenceBoundarySchema.safeParse({
      ...buildBoundary(),
      missionCreated: true,
    });

    expect(duplicateResult.success).toBe(false);
    expect(boundaryResult.success).toBe(false);
  });
});

function buildItem(
  family: OperatorAttentionItemFamily,
  status: OperatorAttentionItem["status"] = "ready_for_review",
): OperatorAttentionItem {
  const monitorItem = family === "monitor_alert_attention";
  const checklistItem = family !== "monitor_alert_attention";

  return {
    itemKey: monitorItem
      ? "monitor:cash_posture:11111111-1111-4111-8111-111111111111"
      : `close-control:${family}`,
    family,
    status,
    evidenceBasis: {
      basisKind: monitorItem
        ? "latest_persisted_monitor_result"
        : family === "policy_source_attention"
          ? "policy_source_posture"
          : family === "source_freshness_attention"
            ? "source_freshness_posture"
            : "close_control_checklist_posture",
      summary: "Derived from stored evidence posture only.",
      refs: [
        {
          kind: monitorItem ? "monitor_result" : "close_control_checklist_item",
          evidencePath: monitorItem
            ? "monitorResults.cash_posture"
            : `checklist.items.${family}`,
          summary: "Stored evidence posture ref.",
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind: monitorItem ? "cash_posture" : null,
          monitorResultId: monitorItem
            ? "11111111-1111-4111-8111-111111111111"
            : null,
          checklistItemFamily: checklistItem
            ? "cash_source_freshness_review"
            : null,
          proofRef: "proof.posture",
        },
      ],
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state:
        status === "blocked_by_evidence"
          ? "missing_source"
          : monitorItem
            ? "monitor_context_present"
            : "source_backed",
      summary: "Stored source posture is available for review.",
      refs: [],
    },
    freshnessSummary: {
      state: status === "blocked_by_evidence" ? "missing" : "fresh",
      summary: "Freshness posture is carried from stored source evidence.",
      latestObservedAt: generatedAt,
    },
    limitations: [
      "This item is internal review posture and does not create delivery or action.",
    ],
    proofPosture: {
      state:
        status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : status === "needs_review"
            ? "limited_by_alerting_monitor"
            : "source_backed",
      summary: "Proof posture is carried from stored evidence.",
    },
    humanReviewNextStep:
      "Review the cited stored posture before deciding any follow-up.",
    relatedMonitorKind: monitorItem ? "cash_posture" : null,
    relatedChecklistItemFamily: checklistItem
      ? "cash_source_freshness_review"
      : null,
    relatedAlertStatus: monitorItem
      ? status === "ready_for_review"
        ? "no_alert"
        : "alert"
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
      "F6J operator readiness is deterministic, read-only, runtime-free, delivery-free, report-free, approval-free, mission-free, monitor-run-free, and action-free.",
    replayImplication:
      "The first F6J readiness result is generated from current stored posture and is not persisted as a mission replay event.",
  };
}
