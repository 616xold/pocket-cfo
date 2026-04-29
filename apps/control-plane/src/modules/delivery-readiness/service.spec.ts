import { describe, expect, it, vi } from "vitest";
import type {
  CloseControlAcknowledgementReadinessResult,
  CloseControlAcknowledgementTarget,
  CloseControlChecklistItemFamily,
  DeliveryReadinessResult,
  MonitorKind,
  OperatorAttentionItem,
  OperatorReadinessResult,
} from "@pocket-cto/domain";
import { DeliveryReadinessService } from "./service";

const generatedAt = "2026-04-28T12:00:00.000Z";

describe("DeliveryReadinessService", () => {
  it("maps ready operator and acknowledgement posture only to ready-for-delivery-review", async () => {
    const service = buildService();

    const result = await service.getDeliveryReadiness("acme");

    expect(result.aggregateStatus).toBe("ready_for_delivery_review");
    expect(result.deliveryReadinessTargets.map((target) => target.status)).toEqual([
      "ready_for_delivery_review",
      "ready_for_delivery_review",
    ]);
    expect(result.deliveryReadinessTargets.map((target) => target.targetKind)).toEqual([
      "operator_readiness_target",
      "acknowledgement_readiness_target",
    ]);
    assertNoForbiddenStatuses(result);
  });

  it("turns non-ready operator-readiness items into delivery-readiness targets without sending anything", async () => {
    const service = buildService({
      operatorReadiness: buildOperatorReadiness({
        aggregateStatus: "blocked_by_evidence",
        attentionItems: [
          buildOperatorItem({
            itemKey: "monitor:cash_posture:11111111-1111-4111-8111-111111111111",
            relatedMonitorKind: "cash_posture",
            status: "needs_review",
          }),
          buildOperatorItem({
            itemKey: "close-control:policy_source_freshness_review",
            relatedChecklistItemFamily: "policy_source_freshness_review",
            status: "blocked_by_evidence",
          }),
        ],
      }),
    });

    const result = await service.getDeliveryReadiness("acme");
    const monitorTarget = requireTarget(
      result,
      "operator-readiness:item:monitor:cash_posture:11111111-1111-4111-8111-111111111111",
    );
    const sourceTarget = requireTarget(
      result,
      "operator-readiness:item:close-control:policy_source_freshness_review",
    );

    expect(result.aggregateStatus).toBe("blocked_by_evidence");
    expect(monitorTarget).toMatchObject({
      targetKind: "monitor_posture_target",
      status: "needs_review_before_delivery",
      relatedOperatorReadinessItemKey:
        "monitor:cash_posture:11111111-1111-4111-8111-111111111111",
      relatedMonitorKind: "cash_posture",
    });
    expect(sourceTarget).toMatchObject({
      targetKind: "source_posture_target",
      status: "blocked_by_evidence",
      relatedChecklistItemFamily: "policy_source_freshness_review",
      sourcePosture: { missingSource: true },
    });
    expect(result.runtimeActionBoundary.deliveryCreated).toBe(false);
    expect(result.runtimeActionBoundary.notificationProviderCalled).toBe(false);
    expect(result.runtimeActionBoundary.emailSent).toBe(false);
    expect(result.runtimeActionBoundary.slackSent).toBe(false);
    expect(result.runtimeActionBoundary.smsSent).toBe(false);
    expect(result.runtimeActionBoundary.webhookCalled).toBe(false);
    expect(result.runtimeActionBoundary.generatedNotificationProseCreated).toBe(
      false,
    );
  });

  it("turns non-ready acknowledgement-readiness targets into delivery-readiness targets", async () => {
    const service = buildService({
      acknowledgementReadiness: buildAcknowledgementReadiness({
        aggregateStatus: "needs_review_before_acknowledgement",
        targets: [
          buildAcknowledgementTarget({
            targetKey: "close-control:checklist-aggregate",
            targetKind: "checklist_aggregate",
            status: "needs_review_before_acknowledgement",
          }),
          buildAcknowledgementTarget({
            targetKey:
              "close-control:item-family:cash_source_freshness_review",
            relatedReadinessItemKey:
              "close-control:cash_source_freshness_review",
            status: "needs_review_before_acknowledgement",
          }),
        ],
      }),
    });

    const result = await service.getDeliveryReadiness("acme");
    const target = requireTarget(
      result,
      "acknowledgement-readiness:target:close-control:item-family:cash_source_freshness_review",
    );

    expect(result.aggregateStatus).toBe("needs_review_before_delivery");
    expect(target).toMatchObject({
      targetKind: "acknowledgement_readiness_target",
      status: "needs_review_before_delivery",
      relatedAcknowledgementTargetKey:
        "close-control:item-family:cash_source_freshness_review",
      relatedOperatorReadinessItemKey:
        "close-control:cash_source_freshness_review",
      relatedChecklistItemFamily: "cash_source_freshness_review",
    });
    expect(target.evidenceBasis.summary).toContain("stored");
    expect(target.humanReviewNextStep).toContain("future acknowledgement");
  });

  it("does not call provider, outbox, approval, report, mission, monitor-run, source-mutation, or runtime methods", async () => {
    const forbiddenMethods = {
      callNotificationProvider: vi.fn(),
      createApproval: vi.fn(),
      createMission: vi.fn(),
      createReport: vi.fn(),
      createRuntimeThread: vi.fn(),
      createSourceMutation: vi.fn(),
      generateNotificationProse: vi.fn(),
      sendOutboxEvent: vi.fn(),
      runCashPostureMonitor: vi.fn(),
      runCollectionsPressureMonitor: vi.fn(),
      runPayablesPressureMonitor: vi.fn(),
      runPolicyCovenantThresholdMonitor: vi.fn(),
    };
    const service = buildService({
      extraAcknowledgementMethods: forbiddenMethods,
      extraReadinessMethods: forbiddenMethods,
    });

    const result = await service.getDeliveryReadiness("acme");

    expect(result.runtimeActionBoundary).toMatchObject({
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
    for (const method of Object.values(forbiddenMethods)) {
      expect(method).not.toHaveBeenCalled();
    }
  });
});

function buildService(
  input: {
    acknowledgementReadiness?: CloseControlAcknowledgementReadinessResult;
    extraAcknowledgementMethods?: Record<string, unknown>;
    extraReadinessMethods?: Record<string, unknown>;
    operatorReadiness?: OperatorReadinessResult;
  } = {},
) {
  return new DeliveryReadinessService({
    closeControlAcknowledgementService: {
      getAcknowledgementReadiness: vi
        .fn()
        .mockResolvedValue(
          input.acknowledgementReadiness ?? buildAcknowledgementReadiness(),
        ),
      ...input.extraAcknowledgementMethods,
    },
    operatorReadinessService: {
      getReadiness: vi
        .fn()
        .mockResolvedValue(input.operatorReadiness ?? buildOperatorReadiness()),
      ...input.extraReadinessMethods,
    },
    now: () => new Date(generatedAt),
  });
}

function buildOperatorReadiness(
  input: {
    aggregateStatus?: OperatorReadinessResult["aggregateStatus"];
    attentionItems?: OperatorAttentionItem[];
  } = {},
): OperatorReadinessResult {
  return {
    companyKey: "acme",
    generatedAt,
    aggregateStatus: input.aggregateStatus ?? "ready_for_review",
    attentionItems: input.attentionItems ?? [
      buildOperatorItem({
        itemKey: "close-control:aggregate",
        status: "ready_for_review",
      }),
    ],
    evidenceSummary:
      "F6J readiness is derived from latest persisted monitor results and close/control checklist posture.",
    limitations: ["Readiness is internal review posture only."],
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
      summary: "Readiness read is deterministic and action-free.",
      replayImplication: "Readiness read is not appended to mission replay.",
    },
  };
}

function buildOperatorItem(input: {
  itemKey: string;
  relatedChecklistItemFamily?: CloseControlChecklistItemFamily | null;
  relatedMonitorKind?: MonitorKind | null;
  status: OperatorAttentionItem["status"];
}): OperatorAttentionItem {
  return {
    itemKey: input.itemKey,
    family: input.relatedMonitorKind
      ? "monitor_alert_attention"
      : input.relatedChecklistItemFamily === "policy_source_freshness_review"
        ? "policy_source_attention"
        : input.relatedChecklistItemFamily
          ? "source_freshness_attention"
          : "close_control_attention",
    status: input.status,
    evidenceBasis: {
      basisKind: input.relatedMonitorKind
        ? "latest_persisted_monitor_result"
        : input.relatedChecklistItemFamily
          ? "source_freshness_posture"
          : "close_control_checklist_posture",
      summary: "Operator-readiness evidence is stored posture only.",
      refs: [
        {
          kind: input.relatedMonitorKind
            ? "monitor_result"
            : "close_control_checklist_item",
          evidencePath: input.itemKey,
          summary: "Stored readiness evidence ref.",
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind: input.relatedMonitorKind ?? null,
          monitorResultId: input.relatedMonitorKind
            ? "11111111-1111-4111-8111-111111111111"
            : null,
          checklistItemFamily: input.relatedChecklistItemFamily ?? null,
          proofRef: "proof.posture",
        },
      ],
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "missing_source"
          : input.status === "needs_review"
            ? "limited_source"
            : "source_backed",
      summary: "Operator-readiness source posture is carried forward.",
      refs: [],
    },
    freshnessSummary: {
      state: input.status === "blocked_by_evidence" ? "missing" : "fresh",
      summary: "Operator-readiness freshness posture is carried forward.",
      latestObservedAt: generatedAt,
    },
    limitations: ["Operator-readiness context is internal review posture only."],
    proofPosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : input.status === "needs_review"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Readiness proof posture is carried forward.",
    },
    humanReviewNextStep:
      "Review operator-readiness context before any follow-up.",
    relatedMonitorKind: input.relatedMonitorKind ?? null,
    relatedChecklistItemFamily: input.relatedChecklistItemFamily ?? null,
    relatedAlertStatus: input.relatedMonitorKind
      ? input.status === "ready_for_review"
        ? "no_alert"
        : "alert"
      : null,
  };
}

function buildAcknowledgementReadiness(
  input: {
    aggregateStatus?: CloseControlAcknowledgementReadinessResult["aggregateStatus"];
    targets?: CloseControlAcknowledgementTarget[];
  } = {},
): CloseControlAcknowledgementReadinessResult {
  return {
    companyKey: "acme",
    generatedAt,
    aggregateStatus: input.aggregateStatus ?? "ready_for_acknowledgement",
    acknowledgementTargets: input.targets ?? [
      buildAcknowledgementTarget({
        targetKey: "close-control:checklist-aggregate",
        targetKind: "checklist_aggregate",
        status: "ready_for_acknowledgement",
      }),
    ],
    evidenceSummary:
      "F6K acknowledgement readiness is derived from checklist and operator-readiness posture.",
    limitations: [
      "Acknowledgement readiness is internal review posture only.",
    ],
    operatorReadinessContext: {
      operatorReadinessAggregateStatus: "ready_for_review",
      nonReadyReadinessItemKeys: [],
      summary: "Operator readiness context is ready for review.",
      limitations: [],
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
      summary: "Acknowledgement read is deterministic and action-free.",
      replayImplication:
        "Acknowledgement read is not appended to mission replay.",
    },
  };
}

function buildAcknowledgementTarget(input: {
  relatedReadinessItemKey?: string | null;
  status: CloseControlAcknowledgementTarget["status"];
  targetKey: string;
  targetKind?: CloseControlAcknowledgementTarget["targetKind"];
}): CloseControlAcknowledgementTarget {
  return {
    targetKey: input.targetKey,
    targetKind: input.targetKind ?? "checklist_item_family",
    status: input.status,
    evidenceBasis: {
      summary: "Acknowledgement target uses stored readiness posture.",
      checklistEvidenceRefs: [],
      readinessEvidenceRefs: [],
    },
    sourcePosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "missing_source"
          : input.status === "needs_review_before_acknowledgement"
            ? "limited_source"
            : "source_backed",
      summary: "Acknowledgement source posture is carried forward.",
      missingSource: input.status === "blocked_by_evidence",
    },
    freshnessSummary: {
      state:
        input.status === "blocked_by_evidence"
          ? "missing"
          : input.status === "needs_review_before_acknowledgement"
            ? "mixed"
            : "fresh",
      summary: "Acknowledgement freshness posture is carried forward.",
      latestObservedAt: generatedAt,
    },
    limitations: ["Acknowledgement target remains internal review posture."],
    proofPosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : input.status === "needs_review_before_acknowledgement"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Acknowledgement proof posture is carried forward.",
    },
    humanReviewNextStep:
      "Review acknowledgement target before any future acknowledgement path.",
    relatedChecklistItemFamily: input.targetKey.includes(
      "cash_source_freshness_review",
    )
      ? "cash_source_freshness_review"
      : null,
    relatedReadinessItemKey: input.relatedReadinessItemKey ?? null,
  };
}

function requireTarget(result: DeliveryReadinessResult, targetKey: string) {
  const target = result.deliveryReadinessTargets.find(
    (candidate) => candidate.targetKey === targetKey,
  );

  if (!target) {
    throw new Error(`Missing delivery-readiness target ${targetKey}`);
  }

  return target;
}

function assertNoForbiddenStatuses(result: DeliveryReadinessResult) {
  const statuses = [
    result.aggregateStatus,
    ...result.deliveryReadinessTargets.map((target) => target.status),
  ];

  for (const forbidden of [
    "sent",
    "send_pending",
    "delivered",
    "delivery_scheduled",
    "provider_ready",
    "approved",
    "release_ready",
    "signed_off",
    "certified",
    "close_complete",
  ]) {
    expect(statuses).not.toContain(forbidden);
  }
}
