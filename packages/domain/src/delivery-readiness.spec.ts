import { describe, expect, it } from "vitest";
import {
  DELIVERY_READINESS_STATUSES,
  DELIVERY_READINESS_TARGET_KINDS,
  DeliveryReadinessResultSchema,
  DeliveryReadinessRuntimeActionAbsenceBoundarySchema,
  DeliveryReadinessStatusSchema,
  deriveDeliveryReadinessAggregateStatus,
  type DeliveryReadinessStatus,
  type DeliveryReadinessTarget,
  type DeliveryReadinessTargetKind,
} from "./delivery-readiness";

const generatedAt = "2026-04-28T12:00:00.000Z";

describe("delivery readiness domain contract", () => {
  it("accepts one deterministic internal delivery-readiness result with proof and absence posture", () => {
    const parsed = DeliveryReadinessResultSchema.parse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "needs_review_before_delivery",
      deliveryReadinessTargets: [
        buildTarget(
          "operator:item:monitor:cash_posture:11111111-1111-4111-8111-111111111111",
          "monitor_posture_target",
          "needs_review_before_delivery",
        ),
        buildTarget(
          "acknowledgement:aggregate",
          "acknowledgement_readiness_target",
          "ready_for_delivery_review",
        ),
      ],
      evidenceSummary:
        "F6M delivery readiness is derived from internal operator-readiness and acknowledgement-readiness posture only.",
      limitations: [
        "Delivery readiness is internal review posture only and no send occurred.",
      ],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(parsed.aggregateStatus).toBe("needs_review_before_delivery");
    expect(parsed.deliveryReadinessTargets[0]).toMatchObject({
      targetKind: "monitor_posture_target",
      status: "needs_review_before_delivery",
      relatedOperatorReadinessItemKey:
        "monitor:cash_posture:11111111-1111-4111-8111-111111111111",
      relatedMonitorKind: "cash_posture",
    });
    expect(parsed.runtimeActionBoundary).toMatchObject({
      runtimeCodexUsed: false,
      deliveryCreated: false,
      outboxSendCreated: false,
      notificationProviderCalled: false,
      emailSent: false,
      slackSent: false,
      smsSent: false,
      webhookCalled: false,
      reportCreated: false,
      approvalCreated: false,
      missionCreated: false,
      monitorRunTriggered: false,
      monitorResultCreated: false,
      sourceMutationCreated: false,
      generatedNotificationProseCreated: false,
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

  it("keeps target kinds bounded to internal delivery-readiness inputs", () => {
    expect(DELIVERY_READINESS_TARGET_KINDS).toEqual([
      "operator_readiness_target",
      "acknowledgement_readiness_target",
      "source_posture_target",
      "monitor_posture_target",
    ]);
    expect(DELIVERY_READINESS_TARGET_KINDS.join(" ")).not.toContain(
      "provider",
    );
  });

  it("keeps readiness status vocabulary review-only and excludes delivery/provider/approval states", () => {
    expect(DeliveryReadinessStatusSchema.options).toEqual([
      "ready_for_delivery_review",
      "needs_review_before_delivery",
      "blocked_by_evidence",
    ]);
    expect(DELIVERY_READINESS_STATUSES).not.toContain("sent");
    expect(DELIVERY_READINESS_STATUSES).not.toContain("send_pending");
    expect(DELIVERY_READINESS_STATUSES).not.toContain("delivered");
    expect(DELIVERY_READINESS_STATUSES).not.toContain("delivery_scheduled");
    expect(DELIVERY_READINESS_STATUSES).not.toContain("provider_ready");
    expect(DELIVERY_READINESS_STATUSES).not.toContain("approved");
    expect(DELIVERY_READINESS_STATUSES).not.toContain("release_ready");
    expect(DELIVERY_READINESS_STATUSES).not.toContain("signed_off");
    expect(DELIVERY_READINESS_STATUSES).not.toContain("certified");
    expect(DELIVERY_READINESS_STATUSES).not.toContain("close_complete");
  });

  it("derives blocked and needs-review aggregate posture deterministically", () => {
    expect(
      deriveDeliveryReadinessAggregateStatus([
        buildTarget(
          "operator:aggregate",
          "operator_readiness_target",
          "ready_for_delivery_review",
        ),
        buildTarget(
          "acknowledgement:blocked",
          "acknowledgement_readiness_target",
          "blocked_by_evidence",
        ),
      ]),
    ).toBe("blocked_by_evidence");

    expect(
      deriveDeliveryReadinessAggregateStatus([
        buildTarget(
          "operator:aggregate",
          "operator_readiness_target",
          "ready_for_delivery_review",
        ),
        buildTarget(
          "source:cash",
          "source_posture_target",
          "needs_review_before_delivery",
        ),
      ]),
    ).toBe("needs_review_before_delivery");
  });

  it("rejects aggregate status that hides non-ready targets", () => {
    const result = DeliveryReadinessResultSchema.safeParse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_delivery_review",
      deliveryReadinessTargets: [
        buildTarget(
          "operator:item:cash",
          "source_posture_target",
          "needs_review_before_delivery",
        ),
      ],
      evidenceSummary: "Derived internal delivery-readiness result.",
      limitations: ["Internal review only; no send occurred."],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate target keys and any absence field set to true", () => {
    const duplicateResult = DeliveryReadinessResultSchema.safeParse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_delivery_review",
      deliveryReadinessTargets: [
        buildTarget("operator:aggregate", "operator_readiness_target"),
        buildTarget("operator:aggregate", "operator_readiness_target"),
      ],
      evidenceSummary: "Derived internal delivery-readiness result.",
      limitations: ["Internal review only; no send occurred."],
      runtimeActionBoundary: buildBoundary(),
    });
    const boundaryResult =
      DeliveryReadinessRuntimeActionAbsenceBoundarySchema.safeParse({
        ...buildBoundary(),
        notificationProviderCalled: true,
      });

    expect(duplicateResult.success).toBe(false);
    expect(boundaryResult.success).toBe(false);
  });
});

function buildTarget(
  targetKey: string,
  targetKind: DeliveryReadinessTargetKind,
  status: DeliveryReadinessStatus = "ready_for_delivery_review",
): DeliveryReadinessTarget {
  const monitorTarget = targetKind === "monitor_posture_target";
  const sourceTarget = targetKind === "source_posture_target";
  const acknowledgementTarget =
    targetKind === "acknowledgement_readiness_target";

  return {
    targetKey,
    targetKind,
    status,
    evidenceBasis: {
      basisKind: monitorTarget
        ? "monitor_posture"
        : acknowledgementTarget
          ? "acknowledgement_readiness_posture"
          : sourceTarget
            ? "source_posture"
            : "operator_readiness_posture",
      summary:
        "Delivery-readiness target is derived from stored internal posture.",
      refs: [
        {
          kind: monitorTarget
            ? "monitor_result"
            : acknowledgementTarget
              ? "acknowledgement_readiness_target"
              : "operator_readiness_item",
          evidencePath: targetKey,
          summary: "Stored review posture reference.",
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind: monitorTarget ? "cash_posture" : null,
          monitorResultId: monitorTarget
            ? "11111111-1111-4111-8111-111111111111"
            : null,
          checklistItemFamily: sourceTarget
            ? "cash_source_freshness_review"
            : null,
          operatorReadinessItemKey: monitorTarget
            ? "monitor:cash_posture:11111111-1111-4111-8111-111111111111"
            : null,
          acknowledgementTargetKey: acknowledgementTarget
            ? "close-control:checklist-aggregate"
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
          : status === "needs_review_before_delivery"
            ? "limited_source"
            : "source_backed",
      summary: "Stored source posture is carried into delivery readiness.",
      missingSource: status === "blocked_by_evidence",
      refs: [],
    },
    freshnessSummary: {
      state:
        status === "blocked_by_evidence"
          ? "missing"
          : status === "needs_review_before_delivery"
            ? "mixed"
            : "fresh",
      summary: "Freshness posture is carried from stored source evidence.",
      latestObservedAt: generatedAt,
    },
    limitations: [
      "This target is internal delivery-readiness posture only and no send occurred.",
    ],
    proofPosture: {
      state:
        status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : status === "needs_review_before_delivery"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Proof posture is carried from stored evidence.",
    },
    humanReviewNextStep:
      "Review the cited stored posture before any future delivery review.",
    relatedOperatorReadinessItemKey: monitorTarget
      ? "monitor:cash_posture:11111111-1111-4111-8111-111111111111"
      : null,
    relatedAcknowledgementTargetKey: acknowledgementTarget
      ? "close-control:checklist-aggregate"
      : null,
    relatedMonitorKind: monitorTarget ? "cash_posture" : null,
    relatedChecklistItemFamily: sourceTarget
      ? "cash_source_freshness_review"
      : null,
  };
}

function buildBoundary() {
  return {
    runtimeCodexUsed: false,
    deliveryCreated: false,
    outboxSendCreated: false,
    notificationProviderCalled: false,
    emailSent: false,
    slackSent: false,
    smsSent: false,
    webhookCalled: false,
    reportCreated: false,
    approvalCreated: false,
    missionCreated: false,
    monitorRunTriggered: false,
    monitorResultCreated: false,
    sourceMutationCreated: false,
    generatedNotificationProseCreated: false,
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
      "F6M delivery readiness is deterministic, read-only, runtime-free, delivery-free, provider-free, report-free, approval-free, mission-free, monitor-run-free, source-mutation-free, generated-notification-prose-free, and action-free.",
    replayImplication:
      "The first F6M delivery-readiness result is generated from current stored posture and is not persisted as a mission replay event.",
  };
}
