import { describe, expect, it, vi } from "vitest";
import {
  CLOSE_CONTROL_CHECKLIST_ITEM_FAMILIES,
  type CloseControlAcknowledgementReadinessResult,
  type CloseControlAcknowledgementTarget,
  type CloseControlChecklistItem,
  type CloseControlChecklistResult,
  type CloseControlChecklistStatus,
  type CloseControlReviewSummaryResult,
  type DeliveryReadinessResult,
  type DeliveryReadinessStatus,
  type DeliveryReadinessTarget,
  type MonitorKind,
  type OperatorAttentionItem,
  type OperatorReadinessResult,
  type OperatorReadinessStatus,
} from "@pocket-cto/domain";
import {
  CloseControlReviewSummaryCompanyKeyMismatchError,
  CloseControlReviewSummaryService,
} from "./service";

const generatedAt = "2026-04-29T12:00:00.000Z";
const monitorResultId = "11111111-1111-4111-8111-111111111111";

describe("CloseControlReviewSummaryService", () => {
  it("builds a ready internal review summary from matching shipped F6H/F6J/F6K/F6M payloads", async () => {
    const service = buildService();

    const result = await service.getReviewSummary("acme");

    expect(result.companyKey).toBe("acme");
    expect(result.aggregateStatus).toBe("ready_for_review_summary");
    expect(result.reviewSections.map((section) => section.family)).toEqual([
      "close_control_checklist_posture",
      "operator_readiness_posture",
      "acknowledgement_readiness_posture",
      "delivery_boundary_posture",
      "monitor_context_posture",
      "source_and_wiki_freshness_posture",
    ]);
    assertNoForbiddenStatuses(result);
  });

  it.each([
    {
      name: "F6H checklist",
      sectionFamily: "close_control_checklist_posture" as const,
      serviceInput: {
        checklist: buildChecklist({ status: "needs_review" }),
      },
    },
    {
      name: "F6J operator-readiness",
      sectionFamily: "operator_readiness_posture" as const,
      serviceInput: {
        operatorReadiness: buildOperatorReadiness({
          status: "needs_review",
        }),
      },
    },
    {
      name: "F6K acknowledgement-readiness",
      sectionFamily: "acknowledgement_readiness_posture" as const,
      serviceInput: {
        acknowledgementReadiness: buildAcknowledgementReadiness({
          status: "needs_review_before_acknowledgement",
        }),
      },
    },
    {
      name: "F6M delivery-boundary",
      sectionFamily: "delivery_boundary_posture" as const,
      serviceInput: {
        deliveryReadiness: buildDeliveryReadiness({
          status: "needs_review_before_delivery",
        }),
      },
    },
  ])("maps needs-review posture from $name", async (scenario) => {
    const service = buildService(scenario.serviceInput);

    const result = await service.getReviewSummary("acme");
    const section = requireSection(result, scenario.sectionFamily);

    expect(section.status).toBe("needs_human_review");
    expect(result.aggregateStatus).toBe("needs_human_review");
  });

  it.each([
    {
      name: "F6H checklist",
      sectionFamily: "close_control_checklist_posture" as const,
      serviceInput: {
        checklist: buildChecklist({ status: "blocked_by_evidence" }),
      },
    },
    {
      name: "F6J operator-readiness",
      sectionFamily: "operator_readiness_posture" as const,
      serviceInput: {
        operatorReadiness: buildOperatorReadiness({
          status: "blocked_by_evidence",
        }),
      },
    },
    {
      name: "F6K acknowledgement-readiness",
      sectionFamily: "acknowledgement_readiness_posture" as const,
      serviceInput: {
        acknowledgementReadiness: buildAcknowledgementReadiness({
          status: "blocked_by_evidence",
        }),
      },
    },
    {
      name: "F6M delivery-boundary",
      sectionFamily: "delivery_boundary_posture" as const,
      serviceInput: {
        deliveryReadiness: buildDeliveryReadiness({
          status: "blocked_by_evidence",
        }),
      },
    },
  ])("maps blocked posture from $name", async (scenario) => {
    const service = buildService(scenario.serviceInput);

    const result = await service.getReviewSummary("acme");
    const section = requireSection(result, scenario.sectionFamily);

    expect(section.status).toBe("blocked_by_evidence");
    expect(result.aggregateStatus).toBe("blocked_by_evidence");
  });

  it.each([
    {
      name: "F6H checklist",
      expectedPath: "checklist.companyKey",
      serviceInput: {
        checklist: buildChecklist({ companyKey: "globex" }),
      },
    },
    {
      name: "F6J operator-readiness",
      expectedPath: "operatorReadiness.companyKey",
      serviceInput: {
        operatorReadiness: buildOperatorReadiness({ companyKey: "globex" }),
      },
    },
    {
      name: "F6K acknowledgement-readiness",
      expectedPath: "acknowledgementReadiness.companyKey",
      serviceInput: {
        acknowledgementReadiness: buildAcknowledgementReadiness({
          companyKey: "globex",
        }),
      },
    },
    {
      name: "F6M delivery-readiness",
      expectedPath: "deliveryReadiness.companyKey",
      serviceInput: {
        deliveryReadiness: buildDeliveryReadiness({ companyKey: "globex" }),
      },
    },
  ])("fails closed when $name companyKey mismatches", async (scenario) => {
    const now = vi.fn(() => new Date(generatedAt));
    const service = buildService({ ...scenario.serviceInput, now });

    const resultPromise = service.getReviewSummary("acme");

    await expect(resultPromise).rejects.toBeInstanceOf(
      CloseControlReviewSummaryCompanyKeyMismatchError,
    );
    await expect(resultPromise).rejects.toMatchObject({
      body: {
        error: {
          code: "invalid_request",
          details: [
            {
              path: scenario.expectedPath,
              message: `Expected ${scenario.expectedPath} to match requested companyKey "acme", received "globex"`,
            },
          ],
          message: "Invalid request",
        },
      },
      statusCode: 400,
    });
    expect(now).not.toHaveBeenCalled();
  });

  it("exposes absence boundaries for runtime, delivery, reports, approvals, certification, sources, and actions", async () => {
    const service = buildService();

    const result = await service.getReviewSummary("acme");

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
      reportReleased: false,
      reportCirculated: false,
      approvalCreated: false,
      certificationCreated: false,
      closeCompleteCreated: false,
      signOffCreated: false,
      attestationCreated: false,
      missionCreated: false,
      monitorRunTriggered: false,
      monitorResultCreated: false,
      sourceMutationCreated: false,
      generatedProseCreated: false,
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

  it("does not call monitor rerun, mission, report, approval, delivery, runtime, source-mutation, prose, or action methods", async () => {
    const forbiddenMethods = {
      createApproval: vi.fn(),
      createCertification: vi.fn(),
      createCloseComplete: vi.fn(),
      createDelivery: vi.fn(),
      createGeneratedProse: vi.fn(),
      createMission: vi.fn(),
      createReport: vi.fn(),
      createRuntimeThread: vi.fn(),
      createSourceMutation: vi.fn(),
      sendOutboxEvent: vi.fn(),
      runCashPostureMonitor: vi.fn(),
      runCollectionsPressureMonitor: vi.fn(),
      runPayablesPressureMonitor: vi.fn(),
      runPolicyCovenantThresholdMonitor: vi.fn(),
    };
    const service = buildService({
      extraAcknowledgementMethods: forbiddenMethods,
      extraCloseControlMethods: forbiddenMethods,
      extraDeliveryMethods: forbiddenMethods,
      extraReadinessMethods: forbiddenMethods,
    });

    await service.getReviewSummary("acme");

    for (const method of Object.values(forbiddenMethods)) {
      expect(method).not.toHaveBeenCalled();
    }
  });
});

function buildService(
  input: {
    acknowledgementReadiness?: CloseControlAcknowledgementReadinessResult;
    checklist?: CloseControlChecklistResult;
    deliveryReadiness?: DeliveryReadinessResult;
    extraAcknowledgementMethods?: Record<string, unknown>;
    extraCloseControlMethods?: Record<string, unknown>;
    extraDeliveryMethods?: Record<string, unknown>;
    extraReadinessMethods?: Record<string, unknown>;
    now?: () => Date;
    operatorReadiness?: OperatorReadinessResult;
  } = {},
) {
  return new CloseControlReviewSummaryService({
    closeControlAcknowledgementService: {
      getAcknowledgementReadiness: vi
        .fn()
        .mockResolvedValue(
          input.acknowledgementReadiness ?? buildAcknowledgementReadiness(),
        ),
      ...input.extraAcknowledgementMethods,
    },
    closeControlService: {
      getChecklist: vi.fn().mockResolvedValue(input.checklist ?? buildChecklist()),
      ...input.extraCloseControlMethods,
    },
    deliveryReadinessService: {
      getDeliveryReadiness: vi
        .fn()
        .mockResolvedValue(input.deliveryReadiness ?? buildDeliveryReadiness()),
      ...input.extraDeliveryMethods,
    },
    operatorReadinessService: {
      getReadiness: vi
        .fn()
        .mockResolvedValue(input.operatorReadiness ?? buildOperatorReadiness()),
      ...input.extraReadinessMethods,
    },
    now: input.now ?? (() => new Date(generatedAt)),
  });
}

function buildChecklist(
  input: {
    companyKey?: string;
    status?: CloseControlChecklistStatus;
  } = {},
): CloseControlChecklistResult {
  const status = input.status ?? "ready_for_review";

  return {
    companyKey: input.companyKey ?? "acme",
    generatedAt,
    aggregateStatus: status,
    items: CLOSE_CONTROL_CHECKLIST_ITEM_FAMILIES.map((family) =>
      buildChecklistItem({ family, status }),
    ),
    evidenceSummary:
      "F6H checklist is derived from source-backed close/control posture.",
    limitations: ["Checklist posture is internal review posture only."],
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
      summary: "Checklist read is deterministic and action-free.",
      replayImplication: "Checklist read is not appended to mission replay.",
    },
  };
}

function buildChecklistItem(input: {
  family: CloseControlChecklistItem["family"];
  status: CloseControlChecklistStatus;
}): CloseControlChecklistItem {
  const monitorItem = input.family === "monitor_replay_readiness";

  return {
    family: input.family,
    status: input.status,
    sourcePosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "missing_source"
          : input.status === "needs_review"
            ? "limited_source"
            : monitorItem
              ? "monitor_context_present"
              : "source_backed",
      summary: "Checklist source posture is source-backed test posture.",
      refs: [],
    },
    evidenceBasis: {
      basisKind: monitorItem
        ? "latest_persisted_monitor_result_context"
        : "derived_source_coverage",
      summary: "Checklist evidence is stored posture only.",
      refs: [
        {
          kind: monitorItem ? "monitor_result" : "derived_checklist_read",
          evidencePath: `close-control.checklist.items.${input.family}`,
          summary: "Stored checklist evidence ref.",
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind: monitorItem ? "cash_posture" : null,
          monitorResultId: monitorItem ? monitorResultId : null,
        },
      ],
    },
    freshnessSummary: {
      state:
        input.status === "blocked_by_evidence"
          ? "missing"
          : input.status === "needs_review"
            ? "mixed"
            : "fresh",
      summary: "Checklist freshness posture is carried forward.",
      latestObservedAt: generatedAt,
    },
    limitations: ["Checklist item remains internal review posture."],
    humanReviewNextStep: "Review checklist item before any follow-up.",
    proofPosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : input.status === "needs_review"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Checklist proof posture is carried forward.",
    },
  };
}

function buildOperatorReadiness(
  input: {
    companyKey?: string;
    status?: OperatorReadinessStatus;
  } = {},
): OperatorReadinessResult {
  const status = input.status ?? "ready_for_review";

  return {
    companyKey: input.companyKey ?? "acme",
    generatedAt,
    aggregateStatus: status,
    attentionItems: [
      buildOperatorItem({
        itemKey: "operator-readiness:aggregate",
        status,
      }),
      buildOperatorItem({
        itemKey: `monitor:cash_posture:${monitorResultId}`,
        relatedMonitorKind: "cash_posture",
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
  relatedChecklistItemFamily?: CloseControlChecklistItem["family"] | null;
  relatedMonitorKind?: MonitorKind | null;
  status: OperatorReadinessStatus;
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
          monitorResultId: input.relatedMonitorKind ? monitorResultId : null,
          checklistItemFamily: input.relatedChecklistItemFamily ?? null,
          proofRef: `operator-readiness.attentionItems.${input.itemKey}.proofPosture`,
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
            : input.relatedMonitorKind
              ? "monitor_context_present"
              : "source_backed",
      summary: "Operator-readiness source posture is carried forward.",
      refs: [],
    },
    freshnessSummary: {
      state:
        input.status === "blocked_by_evidence"
          ? "missing"
          : input.status === "needs_review"
            ? "mixed"
            : "fresh",
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
    companyKey?: string;
    status?: CloseControlAcknowledgementReadinessResult["aggregateStatus"];
  } = {},
): CloseControlAcknowledgementReadinessResult {
  const status = input.status ?? "ready_for_acknowledgement";

  return {
    companyKey: input.companyKey ?? "acme",
    generatedAt,
    aggregateStatus: status,
    acknowledgementTargets: [
      buildAcknowledgementTarget({
        targetKey: "close-control:checklist-aggregate",
        status,
      }),
    ],
    evidenceSummary:
      "F6K acknowledgement readiness is derived from checklist and operator-readiness posture.",
    limitations: ["Acknowledgement readiness is internal review posture only."],
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
  status: CloseControlAcknowledgementTarget["status"];
  targetKey: string;
}): CloseControlAcknowledgementTarget {
  return {
    targetKey: input.targetKey,
    targetKind: "checklist_aggregate",
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
    relatedChecklistItemFamily: null,
    relatedReadinessItemKey: "operator-readiness:aggregate",
  };
}

function buildDeliveryReadiness(
  input: {
    companyKey?: string;
    status?: DeliveryReadinessStatus;
  } = {},
): DeliveryReadinessResult {
  const status = input.status ?? "ready_for_delivery_review";

  return {
    companyKey: input.companyKey ?? "acme",
    generatedAt,
    aggregateStatus: status,
    deliveryReadinessTargets: [
      buildDeliveryTarget({
        targetKey: "delivery-readiness:aggregate",
        status,
      }),
    ],
    evidenceSummary:
      "F6M delivery readiness is derived from operator and acknowledgement posture.",
    limitations: ["Delivery readiness is internal boundary posture only."],
    runtimeActionBoundary: {
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
      summary: "Delivery-readiness read is deterministic and action-free.",
      replayImplication:
        "Delivery-readiness read is not appended to mission replay.",
    },
  };
}

function buildDeliveryTarget(input: {
  status: DeliveryReadinessStatus;
  targetKey: string;
}): DeliveryReadinessTarget {
  return {
    targetKey: input.targetKey,
    targetKind: "operator_readiness_target",
    status: input.status,
    evidenceBasis: {
      basisKind: "operator_readiness_posture",
      summary: "Delivery-readiness target is stored posture only.",
      refs: [],
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "missing_source"
          : input.status === "needs_review_before_delivery"
            ? "limited_source"
            : "source_backed",
      summary: "Delivery source posture is carried forward.",
      missingSource: input.status === "blocked_by_evidence",
      refs: [],
    },
    freshnessSummary: {
      state:
        input.status === "blocked_by_evidence"
          ? "missing"
          : input.status === "needs_review_before_delivery"
            ? "mixed"
            : "fresh",
      summary: "Delivery freshness posture is carried forward.",
      latestObservedAt: generatedAt,
    },
    limitations: ["Delivery target remains internal boundary posture."],
    proofPosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : input.status === "needs_review_before_delivery"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Delivery proof posture is carried forward.",
    },
    humanReviewNextStep:
      "Review delivery boundary before any future external path.",
    relatedOperatorReadinessItemKey: "operator-readiness:aggregate",
    relatedAcknowledgementTargetKey: null,
    relatedMonitorKind: null,
    relatedChecklistItemFamily: null,
  };
}

function requireSection(
  result: CloseControlReviewSummaryResult,
  family: CloseControlReviewSummaryResult["reviewSections"][number]["family"],
) {
  const section = result.reviewSections.find(
    (candidate) => candidate.family === family,
  );

  if (!section) {
    throw new Error(`Missing review-summary section ${family}`);
  }

  return section;
}

function assertNoForbiddenStatuses(result: CloseControlReviewSummaryResult) {
  const statuses = [
    result.aggregateStatus,
    ...result.reviewSections.map((section) => section.status),
  ];

  for (const forbidden of [
    "certified",
    "certification_pending",
    "close_complete",
    "approved",
    "release_ready",
    "signed_off",
    "attested",
    "report_released",
    "delivery_ready",
    "sent",
    "delivered",
  ]) {
    expect(statuses).not.toContain(forbidden);
  }
}
