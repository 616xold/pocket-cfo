import { describe, expect, it, vi } from "vitest";
import type {
  CloseControlReviewSection,
  CloseControlReviewSectionFamily,
  CloseControlReviewStatus,
  CloseControlReviewSummaryResult,
  DeliveryReadinessResult,
  DeliveryReadinessStatus,
  DeliveryReadinessTarget,
  ExternalProviderBoundaryResult,
} from "@pocket-cto/domain";
import {
  ExternalProviderBoundaryCompanyKeyMismatchError,
  ExternalProviderBoundaryService,
} from "./service";

const generatedAt = "2026-04-29T18:00:00.000Z";

describe("ExternalProviderBoundaryService", () => {
  it("builds a ready internal provider-boundary result from matching F6M/F6N payloads", async () => {
    const service = buildService();

    const result = await service.getExternalProviderBoundary("acme");

    expect(result.companyKey).toBe("acme");
    expect(result.aggregateStatus).toBe("ready_for_provider_boundary_review");
    expect(
      result.externalProviderBoundaryTargets.map(
        (target) => target.targetFamily,
      ),
    ).toEqual([
      "delivery_readiness_boundary",
      "review_summary_boundary",
      "source_freshness_boundary",
      "proof_and_limitation_boundary",
      "human_review_gate_boundary",
      "outbox_absence_boundary",
    ]);
    expect(
      result.externalProviderBoundaryTargets.map((target) => target.status),
    ).toEqual([
      "ready_for_provider_boundary_review",
      "ready_for_provider_boundary_review",
      "ready_for_provider_boundary_review",
      "ready_for_provider_boundary_review",
      "ready_for_provider_boundary_review",
      "ready_for_provider_boundary_review",
    ]);
    assertNoForbiddenStatuses(result);
  });

  it.each([
    {
      name: "F6M delivery-readiness",
      targetFamily: "delivery_readiness_boundary" as const,
      serviceInput: {
        deliveryReadiness: buildDeliveryReadiness({
          status: "needs_review_before_delivery",
        }),
      },
    },
    {
      name: "F6N review-summary",
      targetFamily: "review_summary_boundary" as const,
      serviceInput: {
        reviewSummary: buildReviewSummary({ status: "needs_human_review" }),
      },
    },
  ])("maps needs-review posture from $name", async (scenario) => {
    const service = buildService(scenario.serviceInput);

    const result = await service.getExternalProviderBoundary("acme");
    const target = requireTarget(result, scenario.targetFamily);

    expect(target.status).toBe("needs_human_review_before_provider_boundary");
    expect(result.aggregateStatus).toBe(
      "needs_human_review_before_provider_boundary",
    );
  });

  it.each([
    {
      name: "F6M delivery-readiness",
      targetFamily: "delivery_readiness_boundary" as const,
      serviceInput: {
        deliveryReadiness: buildDeliveryReadiness({
          status: "blocked_by_evidence",
        }),
      },
    },
    {
      name: "F6N review-summary",
      targetFamily: "review_summary_boundary" as const,
      serviceInput: {
        reviewSummary: buildReviewSummary({ status: "blocked_by_evidence" }),
      },
    },
  ])("maps blocked posture from $name", async (scenario) => {
    const service = buildService(scenario.serviceInput);

    const result = await service.getExternalProviderBoundary("acme");
    const target = requireTarget(result, scenario.targetFamily);

    expect(target.status).toBe("blocked_by_evidence");
    expect(result.aggregateStatus).toBe("blocked_by_evidence");
  });

  it("fails closed when F6M delivery-readiness companyKey mismatches", async () => {
    const now = vi.fn(() => new Date(generatedAt));
    const service = buildService({
      deliveryReadiness: buildDeliveryReadiness({ companyKey: "globex" }),
      now,
    });

    const resultPromise = service.getExternalProviderBoundary("acme");

    await expect(resultPromise).rejects.toBeInstanceOf(
      ExternalProviderBoundaryCompanyKeyMismatchError,
    );
    await expect(resultPromise).rejects.toMatchObject({
      body: {
        error: {
          code: "invalid_request",
          details: [
            {
              path: "deliveryReadiness.companyKey",
              message:
                'Expected deliveryReadiness.companyKey to match requested companyKey "acme", received "globex"',
            },
          ],
          message: "Invalid request",
        },
      },
      statusCode: 400,
    });
    expect(now).not.toHaveBeenCalled();
  });

  it("fails closed when F6N review-summary companyKey mismatches", async () => {
    const now = vi.fn(() => new Date(generatedAt));
    const service = buildService({
      now,
      reviewSummary: buildReviewSummary({ companyKey: "globex" }),
    });

    const resultPromise = service.getExternalProviderBoundary("acme");

    await expect(resultPromise).rejects.toBeInstanceOf(
      ExternalProviderBoundaryCompanyKeyMismatchError,
    );
    await expect(resultPromise).rejects.toMatchObject({
      body: {
        error: {
          code: "invalid_request",
          details: [
            {
              path: "reviewSummary.companyKey",
              message:
                'Expected reviewSummary.companyKey to match requested companyKey "acme", received "globex"',
            },
          ],
          message: "Invalid request",
        },
      },
      statusCode: 400,
    });
    expect(now).not.toHaveBeenCalled();
  });

  it("exposes absence boundaries for provider, delivery, outbox, runtime, sources, prose, reports, approvals, missions, monitor reruns, finance writes, and actions", async () => {
    const service = buildService();

    const result = await service.getExternalProviderBoundary("acme");

    expect(result.runtimeActionBoundary).toMatchObject({
      runtimeCodexUsed: false,
      deliveryCreated: false,
      externalProviderCalled: false,
      notificationProviderCalled: false,
      providerCredentialCreated: false,
      providerJobCreated: false,
      outboxSendCreated: false,
      emailSent: false,
      slackSent: false,
      smsSent: false,
      webhookCalled: false,
      scheduledDeliveryCreated: false,
      autoSendConfigured: false,
      reportCreated: false,
      reportReleased: false,
      approvalCreated: false,
      missionCreated: false,
      monitorRunTriggered: false,
      monitorResultCreated: false,
      sourceMutationCreated: false,
      generatedNotificationProseCreated: false,
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

  it("does not call provider, credential, outbox, monitor rerun, mission, report, approval, delivery, runtime, source-mutation, prose, or action methods", async () => {
    const forbiddenMethods = {
      callProvider: vi.fn(),
      callNotificationProvider: vi.fn(),
      createProviderCredential: vi.fn(),
      createProviderJob: vi.fn(),
      createOutboxSend: vi.fn(),
      createDelivery: vi.fn(),
      createApproval: vi.fn(),
      createReport: vi.fn(),
      releaseReport: vi.fn(),
      createMission: vi.fn(),
      createRuntimeThread: vi.fn(),
      createSourceMutation: vi.fn(),
      generateNotificationProse: vi.fn(),
      generateProse: vi.fn(),
      runCashPostureMonitor: vi.fn(),
      runCollectionsPressureMonitor: vi.fn(),
      runPayablesPressureMonitor: vi.fn(),
      runPolicyCovenantThresholdMonitor: vi.fn(),
    };
    const service = buildService({
      extraDeliveryMethods: forbiddenMethods,
      extraReviewMethods: forbiddenMethods,
    });

    await service.getExternalProviderBoundary("acme");

    for (const method of Object.values(forbiddenMethods)) {
      expect(method).not.toHaveBeenCalled();
    }
  });
});

function buildService(
  input: {
    deliveryReadiness?: DeliveryReadinessResult;
    extraDeliveryMethods?: Record<string, unknown>;
    extraReviewMethods?: Record<string, unknown>;
    now?: () => Date;
    reviewSummary?: CloseControlReviewSummaryResult;
  } = {},
) {
  return new ExternalProviderBoundaryService({
    closeControlReviewSummaryService: {
      getReviewSummary: vi
        .fn()
        .mockResolvedValue(input.reviewSummary ?? buildReviewSummary()),
      ...input.extraReviewMethods,
    },
    deliveryReadinessService: {
      getDeliveryReadiness: vi
        .fn()
        .mockResolvedValue(input.deliveryReadiness ?? buildDeliveryReadiness()),
      ...input.extraDeliveryMethods,
    },
    now: input.now ?? (() => new Date(generatedAt)),
  });
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
        status,
        targetKey: "delivery-readiness:aggregate",
      }),
    ],
    evidenceSummary:
      "F6M delivery readiness is derived from shipped readiness posture only.",
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
    targetKind: "source_posture_target",
    status: input.status,
    evidenceBasis: {
      basisKind: "source_posture",
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
    relatedChecklistItemFamily: "cash_source_freshness_review",
  };
}

function buildReviewSummary(
  input: {
    companyKey?: string;
    status?: CloseControlReviewStatus;
  } = {},
): CloseControlReviewSummaryResult {
  const status = input.status ?? "ready_for_review_summary";

  return {
    companyKey: input.companyKey ?? "acme",
    generatedAt,
    aggregateStatus: status,
    reviewSections: [
      buildReviewSection(
        "close-control-checklist",
        "close_control_checklist_posture",
      ),
      buildReviewSection("operator-readiness", "operator_readiness_posture"),
      buildReviewSection(
        "acknowledgement-readiness",
        "acknowledgement_readiness_posture",
      ),
      buildReviewSection(
        "delivery-boundary",
        "delivery_boundary_posture",
        status,
      ),
      buildReviewSection("monitor-context", "monitor_context_posture"),
      buildReviewSection(
        "source-and-wiki-freshness",
        "source_and_wiki_freshness_posture",
      ),
    ],
    evidenceSummary:
      "F6N review summary is derived from shipped F6H/F6J/F6K/F6M posture only.",
    limitations: ["Review summary is internal boundary posture only."],
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
      summary: "Review-summary read is deterministic and action-free.",
      replayImplication:
        "Review-summary read is not appended to mission replay.",
    },
  };
}

function buildReviewSection(
  sectionKey: string,
  family: CloseControlReviewSectionFamily,
  status: CloseControlReviewStatus = "ready_for_review_summary",
): CloseControlReviewSection {
  return {
    sectionKey,
    family,
    status,
    evidenceBasis: {
      summary: "Review-summary section is stored posture only.",
      refs: [],
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state:
        status === "blocked_by_evidence"
          ? "missing_source"
          : status === "needs_human_review"
            ? "limited_source"
            : "source_backed",
      summary: "Review-summary source posture is carried forward.",
      missingSource: status === "blocked_by_evidence",
      refs: [],
    },
    freshnessSummary: {
      state:
        status === "blocked_by_evidence"
          ? "missing"
          : status === "needs_human_review"
            ? "mixed"
            : "fresh",
      summary: "Review-summary freshness posture is carried forward.",
      latestObservedAt: generatedAt,
    },
    limitations: ["Review-summary section remains internal posture."],
    proofPosture: {
      state:
        status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : status === "needs_human_review"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Review-summary proof posture is carried forward.",
    },
    proofRefs: [
      `close-control.reviewSummary.sections.${sectionKey}.proofPosture`,
    ],
    humanReviewNextStep:
      "Review summary section before any future provider-boundary path.",
    relatedChecklistItemFamily:
      family === "source_and_wiki_freshness_posture"
        ? "cash_source_freshness_review"
        : null,
    relatedReadinessItemKey: null,
    relatedAcknowledgementTargetKey: null,
    relatedDeliveryReadinessTargetKey:
      family === "delivery_boundary_posture"
        ? "delivery-readiness:aggregate"
        : null,
    relatedMonitorKind:
      family === "monitor_context_posture" ? "cash_posture" : null,
  };
}

function requireTarget(
  result: ExternalProviderBoundaryResult,
  family: ExternalProviderBoundaryResult["externalProviderBoundaryTargets"][number]["targetFamily"],
) {
  const target = result.externalProviderBoundaryTargets.find(
    (candidate) => candidate.targetFamily === family,
  );

  if (!target) {
    throw new Error(`Missing provider-boundary target ${family}`);
  }

  return target;
}

function assertNoForbiddenStatuses(result: ExternalProviderBoundaryResult) {
  const statuses = [
    result.aggregateStatus,
    ...result.externalProviderBoundaryTargets.map((target) => target.status),
  ];

  for (const forbidden of [
    "provider_ready",
    "send_ready",
    "send_pending",
    "sent",
    "delivered",
    "delivery_scheduled",
    "provider_configured",
    "provider_connected",
    "approved",
    "release_ready",
    "signed_off",
    "certified",
    "close_complete",
  ]) {
    expect(statuses).not.toContain(forbidden);
  }
}
