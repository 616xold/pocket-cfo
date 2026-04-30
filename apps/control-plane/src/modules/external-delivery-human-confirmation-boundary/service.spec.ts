import { describe, expect, it, vi } from "vitest";
import type {
  CloseControlCertificationBoundaryResult,
  CloseControlCertificationBoundaryStatus,
  CloseControlCertificationBoundaryTarget,
  CloseControlFreshnessState,
  CloseControlProofPostureState,
  CloseControlReviewSection,
  CloseControlReviewStatus,
  CloseControlReviewSummaryResult,
  DeliveryReadinessResult,
  DeliveryReadinessStatus,
  DeliveryReadinessTarget,
  ExternalDeliveryHumanConfirmationBoundaryResult,
  ExternalDeliveryHumanConfirmationSourcePostureState,
  ExternalProviderBoundaryResult,
  ExternalProviderBoundaryStatus,
  ExternalProviderBoundaryTarget,
} from "@pocket-cto/domain";
import {
  ExternalDeliveryHumanConfirmationBoundaryCompanyKeyMismatchError,
  ExternalDeliveryHumanConfirmationBoundaryService,
} from "./service";

const generatedAt = "2026-04-30T12:00:00.000Z";

describe("ExternalDeliveryHumanConfirmationBoundaryService", () => {
  it("builds a ready internal human-confirmation result from matching F6M/F6P/F6Q/F6N payloads", async () => {
    const service = buildService();

    const result = await service.getHumanConfirmationBoundary("acme");

    expect(result.companyKey).toBe("acme");
    expect(result.aggregateStatus).toBe("ready_for_human_confirmation_review");
    expect(result.deliveryGateTargets.map((target) => target.targetFamily)).toEqual([
      "delivery_readiness_confirmation_boundary",
      "provider_boundary_confirmation_boundary",
      "certification_boundary_confirmation_boundary",
      "review_summary_confirmation_boundary",
      "source_freshness_and_proof_boundary",
      "human_confirmation_absence_boundary",
    ]);
    expect(result.deliveryGateTargets.map((target) => target.status)).toEqual([
      "ready_for_human_confirmation_review",
      "ready_for_human_confirmation_review",
      "ready_for_human_confirmation_review",
      "ready_for_human_confirmation_review",
      "ready_for_human_confirmation_review",
      "ready_for_human_confirmation_review",
    ]);
    assertNoForbiddenStatuses(result);
  });

  it.each([
    {
      name: "F6M delivery-readiness",
      serviceInput: {
        deliveryReadiness: buildDeliveryReadiness({
          status: "needs_review_before_delivery",
        }),
      },
      targetFamily: "delivery_readiness_confirmation_boundary" as const,
    },
    {
      name: "F6P provider-boundary",
      serviceInput: {
        providerBoundary: buildProviderBoundary({
          status: "needs_human_review_before_provider_boundary",
        }),
      },
      targetFamily: "provider_boundary_confirmation_boundary" as const,
    },
    {
      name: "F6Q certification-boundary",
      serviceInput: {
        certificationBoundary: buildCertificationBoundary({
          status: "needs_human_review_before_certification_boundary",
        }),
      },
      targetFamily: "certification_boundary_confirmation_boundary" as const,
    },
    {
      name: "F6N review-summary",
      serviceInput: {
        reviewSummary: buildReviewSummary({ status: "needs_human_review" }),
      },
      targetFamily: "review_summary_confirmation_boundary" as const,
    },
  ])("maps needs-review posture from $name", async (scenario) => {
    const service = buildService(scenario.serviceInput);

    const result = await service.getHumanConfirmationBoundary("acme");
    const target = requireTarget(result, scenario.targetFamily);

    expect(target.status).toBe("needs_human_review_before_confirmation");
    expect(result.aggregateStatus).toBe(
      "needs_human_review_before_confirmation",
    );
  });

  it.each([
    {
      name: "F6M delivery-readiness",
      serviceInput: {
        deliveryReadiness: buildDeliveryReadiness({
          status: "blocked_by_evidence",
        }),
      },
      targetFamily: "delivery_readiness_confirmation_boundary" as const,
    },
    {
      name: "F6P provider-boundary",
      serviceInput: {
        providerBoundary: buildProviderBoundary({
          status: "blocked_by_evidence",
        }),
      },
      targetFamily: "provider_boundary_confirmation_boundary" as const,
    },
    {
      name: "F6Q certification-boundary",
      serviceInput: {
        certificationBoundary: buildCertificationBoundary({
          status: "blocked_by_evidence",
        }),
      },
      targetFamily: "certification_boundary_confirmation_boundary" as const,
    },
    {
      name: "F6N review-summary",
      serviceInput: {
        reviewSummary: buildReviewSummary({ status: "blocked_by_evidence" }),
      },
      targetFamily: "review_summary_confirmation_boundary" as const,
    },
  ])("maps blocked posture from $name", async (scenario) => {
    const service = buildService(scenario.serviceInput);

    const result = await service.getHumanConfirmationBoundary("acme");
    const target = requireTarget(result, scenario.targetFamily);

    expect(target.status).toBe("blocked_by_evidence");
    expect(result.aggregateStatus).toBe("blocked_by_evidence");
  });

  it.each([
    {
      name: "missing source posture",
      override: { sourceState: "missing_source" as const },
    },
    {
      name: "failed source posture",
      override: { sourceState: "failed_source" as const },
    },
    {
      name: "missing freshness posture",
      override: { freshnessState: "missing" as const },
    },
    {
      name: "failed freshness posture",
      override: { freshnessState: "failed" as const },
    },
    {
      name: "missing-source proof posture",
      override: { proofState: "limited_by_missing_source" as const },
    },
    {
      name: "failed-source proof posture",
      override: { proofState: "limited_by_failed_source" as const },
    },
  ])(
    "downgrades source/proof boundary to blocked_by_evidence for $name",
    async (scenario) => {
      const service = buildService({
        deliveryReadiness: buildDeliveryReadinessWithSourceProofOverride(
          scenario.override,
        ),
      });

      const result = await service.getHumanConfirmationBoundary("acme");
      const target = requireTarget(
        result,
        "source_freshness_and_proof_boundary",
      );

      expect(target.status).toBe("blocked_by_evidence");
      expect(result.aggregateStatus).toBe("blocked_by_evidence");
    },
  );

  it.each([
    {
      name: "stale source posture",
      override: { sourceState: "stale_source" as const },
    },
    {
      name: "limited source posture",
      override: { sourceState: "limited_source" as const },
    },
    {
      name: "stale freshness posture",
      override: { freshnessState: "stale" as const },
    },
    {
      name: "stale-source proof posture",
      override: { proofState: "limited_by_stale_source" as const },
    },
    {
      name: "review-only proof posture",
      override: { proofState: "review_only_context" as const },
    },
  ])(
    "downgrades source/proof boundary to human review for $name",
    async (scenario) => {
      const service = buildService({
        deliveryReadiness: buildDeliveryReadinessWithSourceProofOverride(
          scenario.override,
        ),
      });

      const result = await service.getHumanConfirmationBoundary("acme");
      const target = requireTarget(
        result,
        "source_freshness_and_proof_boundary",
      );

      expect(target.status).toBe("needs_human_review_before_confirmation");
      expect(result.aggregateStatus).toBe(
        "needs_human_review_before_confirmation",
      );
    },
  );

  it("keeps source/proof target evidence basis, posture, limitations, status, and next step explicit", async () => {
    const service = buildService();

    const result = await service.getHumanConfirmationBoundary("acme");
    const target = requireTarget(
      result,
      "source_freshness_and_proof_boundary",
    );

    expect(target.evidenceBasis).toMatchObject({
      basisKind: "source_freshness_and_proof_posture",
      summary: expect.stringContaining("F6M/F6P/F6Q/F6N"),
    });
    expect(target.sourcePosture).toMatchObject({
      state: "source_backed",
      missingSource: false,
      summary: expect.stringContaining("source and proof posture"),
    });
    expect(target.freshnessSummary).toMatchObject({
      state: "fresh",
      latestObservedAt: generatedAt,
      summary: expect.stringContaining("source freshness"),
    });
    expect(target.limitations).toEqual(
      expect.arrayContaining([
        expect.stringContaining("does not mutate raw sources"),
      ]),
    );
    expect(target.proofPosture).toMatchObject({
      state: "source_backed",
      summary: expect.stringContaining("proof posture"),
    });
    expect(target.proofRefs).toEqual(
      expect.arrayContaining([
        "delivery-readiness.targets.delivery-readiness:aggregate.proofPosture",
        "external-provider-boundary.targets.provider-boundary:aggregate.proofPosture",
        "close-control.certificationBoundary.targets.certification-boundary:aggregate.proofPosture",
        "close-control.reviewSummary.sections.review:aggregate.proofPosture",
      ]),
    );
    expect(target.status).toBe("ready_for_human_confirmation_review");
    expect(target.humanReviewNextStep).toContain(
      "Review the source freshness",
    );
  });

  it.each([
    {
      expectedPath: "deliveryReadiness.companyKey",
      serviceInput: {
        deliveryReadiness: buildDeliveryReadiness({ companyKey: "globex" }),
      },
    },
    {
      expectedPath: "externalProviderBoundary.companyKey",
      serviceInput: {
        providerBoundary: buildProviderBoundary({ companyKey: "globex" }),
      },
    },
    {
      expectedPath: "certificationBoundary.companyKey",
      serviceInput: {
        certificationBoundary: buildCertificationBoundary({
          companyKey: "globex",
        }),
      },
    },
    {
      expectedPath: "reviewSummary.companyKey",
      serviceInput: {
        reviewSummary: buildReviewSummary({ companyKey: "globex" }),
      },
    },
  ])("fails closed when $expectedPath mismatches", async (scenario) => {
    const now = vi.fn(() => new Date(generatedAt));
    const service = buildService({ ...scenario.serviceInput, now });

    const resultPromise = service.getHumanConfirmationBoundary("acme");

    await expect(resultPromise).rejects.toBeInstanceOf(
      ExternalDeliveryHumanConfirmationBoundaryCompanyKeyMismatchError,
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

  it("exposes absence boundaries for delivery, providers, credentials, jobs, outbox, reports, approvals, certification, runtime, sources, prose, writes, instructions, and actions", async () => {
    const service = buildService();

    const result = await service.getHumanConfirmationBoundary("acme");

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
      reportCirculated: false,
      approvalCreated: false,
      certificationCreated: false,
      closeCompleteCreated: false,
      signOffCreated: false,
      attestationCreated: false,
      legalOpinionCreated: false,
      auditOpinionCreated: false,
      assuranceCreated: false,
      missionCreated: false,
      monitorRunTriggered: false,
      monitorResultCreated: false,
      sourceMutationCreated: false,
      generatedProseCreated: false,
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

  it("does not call provider, credential, job, outbox, scheduled delivery, auto-send, monitor rerun, mission, report, approval, delivery, runtime, source-mutation, prose, certification, or action methods", async () => {
    const forbiddenMethods = {
      callProvider: vi.fn(),
      callNotificationProvider: vi.fn(),
      createProviderCredential: vi.fn(),
      createProviderJob: vi.fn(),
      createOutboxSend: vi.fn(),
      createScheduledDelivery: vi.fn(),
      configureAutoSend: vi.fn(),
      createDelivery: vi.fn(),
      createApproval: vi.fn(),
      createReport: vi.fn(),
      releaseReport: vi.fn(),
      circulateReport: vi.fn(),
      createCertification: vi.fn(),
      createCloseComplete: vi.fn(),
      createSignOff: vi.fn(),
      createAttestation: vi.fn(),
      createLegalOpinion: vi.fn(),
      createAuditOpinion: vi.fn(),
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
      extraCertificationMethods: forbiddenMethods,
      extraDeliveryMethods: forbiddenMethods,
      extraProviderMethods: forbiddenMethods,
      extraReviewMethods: forbiddenMethods,
    });

    await service.getHumanConfirmationBoundary("acme");

    for (const method of Object.values(forbiddenMethods)) {
      expect(method).not.toHaveBeenCalled();
    }
  });
});

function buildService(
  input: {
    certificationBoundary?: CloseControlCertificationBoundaryResult;
    deliveryReadiness?: DeliveryReadinessResult;
    extraCertificationMethods?: Record<string, unknown>;
    extraDeliveryMethods?: Record<string, unknown>;
    extraProviderMethods?: Record<string, unknown>;
    extraReviewMethods?: Record<string, unknown>;
    now?: () => Date;
    providerBoundary?: ExternalProviderBoundaryResult;
    reviewSummary?: CloseControlReviewSummaryResult;
  } = {},
) {
  return new ExternalDeliveryHumanConfirmationBoundaryService({
    closeControlCertificationBoundaryService: {
      getCertificationBoundary: vi
        .fn()
        .mockResolvedValue(
          input.certificationBoundary ?? buildCertificationBoundary(),
        ),
      ...input.extraCertificationMethods,
    },
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
    externalProviderBoundaryService: {
      getExternalProviderBoundary: vi
        .fn()
        .mockResolvedValue(input.providerBoundary ?? buildProviderBoundary()),
      ...input.extraProviderMethods,
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
      buildDeliveryTarget("delivery-readiness:aggregate", status),
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

function buildDeliveryReadinessWithSourceProofOverride(input: {
  freshnessState?: CloseControlFreshnessState;
  proofState?: CloseControlProofPostureState;
  sourceState?: ExternalDeliveryHumanConfirmationSourcePostureState;
}): DeliveryReadinessResult {
  const deliveryReadiness = buildDeliveryReadiness();
  const target = deliveryReadiness.deliveryReadinessTargets[0];

  if (!target) {
    throw new Error("Expected delivery-readiness fixture target.");
  }

  return {
    ...deliveryReadiness,
    deliveryReadinessTargets: [
      {
        ...target,
        sourcePosture: {
          ...target.sourcePosture,
          state: input.sourceState ?? target.sourcePosture.state,
          missingSource:
            input.sourceState === "missing_source" ||
            input.sourceState === "monitor_context_missing" ||
            target.sourcePosture.missingSource,
        },
        freshnessSummary: {
          ...target.freshnessSummary,
          state: input.freshnessState ?? target.freshnessSummary.state,
        },
        proofPosture: {
          ...target.proofPosture,
          state: input.proofState ?? target.proofPosture.state,
        },
      },
    ],
  };
}

function buildDeliveryTarget(
  targetKey: string,
  status: DeliveryReadinessStatus,
): DeliveryReadinessTarget {
  return {
    targetKey,
    targetKind: "source_posture_target",
    status,
    evidenceBasis: {
      basisKind: "source_posture",
      summary: "Delivery-readiness target is stored posture only.",
      refs: [],
    },
    sourceLineageRefs: [],
    sourcePosture: buildSourcePosture(status),
    freshnessSummary: buildFreshness(status),
    limitations: ["Delivery target remains internal boundary posture."],
    proofPosture: buildProof(status),
    humanReviewNextStep:
      "Review delivery boundary before any future external path.",
    relatedOperatorReadinessItemKey: "operator-readiness:aggregate",
    relatedAcknowledgementTargetKey: null,
    relatedMonitorKind: null,
    relatedChecklistItemFamily: "cash_source_freshness_review",
  };
}

function buildProviderBoundary(
  input: {
    companyKey?: string;
    status?: ExternalProviderBoundaryStatus;
  } = {},
): ExternalProviderBoundaryResult {
  const status = input.status ?? "ready_for_provider_boundary_review";

  return {
    companyKey: input.companyKey ?? "acme",
    generatedAt,
    aggregateStatus: status,
    externalProviderBoundaryTargets: [
      buildProviderTarget("provider-boundary:aggregate", status),
    ],
    evidenceSummary:
      "F6P provider boundary is derived from shipped delivery and review posture only.",
    limitations: ["Provider boundary is internal boundary posture only."],
    runtimeActionBoundary: {
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
      summary: "Provider-boundary read is deterministic and action-free.",
      replayImplication:
        "Provider-boundary read is not appended to mission replay.",
    },
  };
}

function buildProviderTarget(
  targetKey: string,
  status: ExternalProviderBoundaryStatus,
): ExternalProviderBoundaryTarget {
  return {
    targetKey,
    targetFamily: "delivery_readiness_boundary",
    status,
    evidenceBasis: {
      basisKind: "delivery_readiness_posture",
      summary: "Provider target is stored posture only.",
      refs: [],
    },
    sourceLineageRefs: [],
    sourcePosture: buildSourcePosture(status),
    freshnessSummary: buildFreshness(status),
    limitations: ["Provider target remains internal boundary posture."],
    proofPosture: buildProof(status),
    proofRefs: [`external-provider-boundary.targets.${targetKey}.proofPosture`],
    humanReviewNextStep: "Review provider boundary before any future path.",
    relatedDeliveryReadinessTargetKey: "delivery-readiness:aggregate",
    relatedReviewSummarySectionKey: null,
    relatedMonitorKind: null,
    relatedSourceRole: "bank_account_summary",
  };
}

function buildCertificationBoundary(
  input: {
    companyKey?: string;
    status?: CloseControlCertificationBoundaryStatus;
  } = {},
): CloseControlCertificationBoundaryResult {
  const status = input.status ?? "ready_for_certification_boundary_review";

  return {
    companyKey: input.companyKey ?? "acme",
    generatedAt,
    aggregateStatus: status,
    closeControlCertificationBoundaryTargets: [
      buildCertificationTarget("certification-boundary:aggregate", status),
    ],
    evidenceSummary:
      "F6Q certification boundary is derived from shipped review and provider posture only.",
    limitations: ["Certification boundary is internal boundary posture only."],
    runtimeActionBoundary: {
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
      reportCirculated: false,
      approvalCreated: false,
      certificationCreated: false,
      closeCompleteCreated: false,
      signOffCreated: false,
      attestationCreated: false,
      legalOpinionCreated: false,
      auditOpinionCreated: false,
      assuranceCreated: false,
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
      summary: "Certification-boundary read is deterministic and action-free.",
      replayImplication:
        "Certification-boundary read is not appended to mission replay.",
    },
  };
}

function buildCertificationTarget(
  targetKey: string,
  status: CloseControlCertificationBoundaryStatus,
): CloseControlCertificationBoundaryTarget {
  return {
    targetKey,
    targetFamily: "provider_boundary",
    status,
    evidenceBasis: {
      basisKind: "provider_boundary_posture",
      summary: "Certification target is stored posture only.",
      refs: [],
    },
    sourceLineageRefs: [],
    sourcePosture: buildSourcePosture(status),
    freshnessSummary: buildFreshness(status),
    limitations: ["Certification target remains internal boundary posture."],
    proofPosture: buildProof(status),
    proofRefs: [
      `close-control.certificationBoundary.targets.${targetKey}.proofPosture`,
    ],
    humanReviewNextStep:
      "Review certification boundary before any future path.",
    relatedReviewSummarySectionKey: "review:aggregate",
    relatedProviderBoundaryTargetKey: "provider-boundary:aggregate",
    relatedMonitorKind: null,
    relatedSourceRole: "bank_account_summary",
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
    reviewSections: [buildReviewSection("review:aggregate", status)],
    evidenceSummary:
      "F6N review summary is derived from shipped close/control posture only.",
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
  status: CloseControlReviewStatus,
): CloseControlReviewSection {
  return {
    sectionKey,
    family: "delivery_boundary_posture",
    status,
    evidenceBasis: {
      summary: "Review-summary section is stored posture only.",
      refs: [],
    },
    sourceLineageRefs: [],
    sourcePosture: buildSourcePosture(status),
    freshnessSummary: buildFreshness(status),
    limitations: ["Review-summary section remains internal posture."],
    proofPosture: buildProof(status),
    proofRefs: [`close-control.reviewSummary.sections.${sectionKey}.proofPosture`],
    humanReviewNextStep:
      "Review summary section before any future human-confirmation path.",
    relatedChecklistItemFamily: "cash_source_freshness_review",
    relatedReadinessItemKey: null,
    relatedAcknowledgementTargetKey: null,
    relatedDeliveryReadinessTargetKey: "delivery-readiness:aggregate",
    relatedMonitorKind: null,
  };
}

function buildSourcePosture(status: string) {
  const state:
    | "missing_source"
    | "limited_source"
    | "source_backed" =
    status === "blocked_by_evidence"
      ? "missing_source"
      : status.startsWith("needs_")
        ? "limited_source"
        : "source_backed";

  return {
    state,
    summary: "Source posture is carried forward.",
    missingSource: status === "blocked_by_evidence",
    refs: [],
  };
}

function buildFreshness(status: string) {
  const state: "missing" | "mixed" | "fresh" =
    status === "blocked_by_evidence"
      ? "missing"
      : status.startsWith("needs_")
        ? "mixed"
        : "fresh";

  return {
    state,
    summary: "Freshness posture is carried forward.",
    latestObservedAt: generatedAt,
  };
}

function buildProof(status: string) {
  const state:
    | "limited_by_missing_source"
    | "limited_by_coverage_gap"
    | "source_backed" =
    status === "blocked_by_evidence"
      ? "limited_by_missing_source"
      : status.startsWith("needs_")
        ? "limited_by_coverage_gap"
        : "source_backed";

  return {
    state,
    summary: "Proof posture is carried forward.",
  };
}

function requireTarget(
  result: ExternalDeliveryHumanConfirmationBoundaryResult,
  targetFamily:
    ExternalDeliveryHumanConfirmationBoundaryResult["deliveryGateTargets"][number]["targetFamily"],
) {
  const target = result.deliveryGateTargets.find(
    (candidate) => candidate.targetFamily === targetFamily,
  );

  if (!target) {
    throw new Error(`Missing target family: ${targetFamily}`);
  }

  return target;
}

function assertNoForbiddenStatuses(
  result: ExternalDeliveryHumanConfirmationBoundaryResult,
) {
  const serialized = JSON.stringify(result);

  for (const forbidden of [
    "send_ready",
    "provider_ready",
    "delivery_ready",
    "delivery_scheduled",
    "auto_send_ready",
    "sent",
    "delivered",
    "approved",
    "release_ready",
    "released",
    "certified",
    "close_complete",
    "signed_off",
    "attested",
    "authorized",
    "provider_configured",
    "provider_connected",
  ]) {
    expect(serialized).not.toContain(forbidden);
  }
}
