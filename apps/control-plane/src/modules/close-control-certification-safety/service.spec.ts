import { describe, expect, it, vi } from "vitest";
import type {
  CloseControlCertificationBoundaryResult,
  CloseControlCertificationBoundaryStatus,
  CloseControlCertificationBoundaryTarget,
  CloseControlCertificationSafetyResult,
  CloseControlCertificationSafetyTargetFamily,
  CloseControlReviewSection,
  CloseControlReviewStatus,
  CloseControlReviewSummaryResult,
  ExternalDeliveryHumanConfirmationBoundaryResult,
  ExternalDeliveryHumanConfirmationStatus,
  ExternalDeliveryHumanConfirmationTarget,
} from "@pocket-cto/domain";
import {
  CloseControlCertificationSafetyCompanyKeyMismatchError,
  CloseControlCertificationSafetyService,
} from "./service";

const generatedAt = "2026-05-01T10:00:00.000Z";

describe("CloseControlCertificationSafetyService", () => {
  it("builds a ready internal certification-safety result from matching F6Q/F6S/F6N payloads", async () => {
    const service = buildService();

    const result = await service.getCertificationSafety("acme");

    expect(result.companyKey).toBe("acme");
    expect(result.aggregateStatus).toBe(
      "ready_for_certification_safety_review",
    );
    expect(
      result.closeControlCertificationSafetyTargets.map(
        (target) => target.targetFamily,
      ),
    ).toEqual([
      "certification_boundary_safety",
      "human_confirmation_boundary_safety",
      "review_summary_safety",
      "source_freshness_and_lineage_safety",
      "proof_and_limitation_safety",
      "human_review_next_step_safety",
      "certification_absence_safety",
    ]);
    expect(
      result.closeControlCertificationSafetyTargets.map(
        (target) => target.status,
      ),
    ).toEqual([
      "ready_for_certification_safety_review",
      "ready_for_certification_safety_review",
      "ready_for_certification_safety_review",
      "ready_for_certification_safety_review",
      "ready_for_certification_safety_review",
      "ready_for_certification_safety_review",
      "ready_for_certification_safety_review",
    ]);
    assertNoForbiddenStatuses(result);
  });

  it.each([
    {
      name: "F6Q certification-boundary",
      serviceInput: {
        certificationBoundary: buildCertificationBoundary({
          status: "needs_human_review_before_certification_boundary",
        }),
      },
      targetFamily: "certification_boundary_safety" as const,
    },
    {
      name: "F6S human-confirmation",
      serviceInput: {
        humanConfirmation: buildHumanConfirmation({
          status: "needs_human_review_before_confirmation",
        }),
      },
      targetFamily: "human_confirmation_boundary_safety" as const,
    },
    {
      name: "F6N review-summary",
      serviceInput: {
        reviewSummary: buildReviewSummary({ status: "needs_human_review" }),
      },
      targetFamily: "review_summary_safety" as const,
    },
  ])("maps needs-review posture from $name", async (scenario) => {
    const service = buildService(scenario.serviceInput);

    const result = await service.getCertificationSafety("acme");
    const target = requireTarget(result, scenario.targetFamily);

    expect(target.status).toBe(
      "needs_human_review_before_certification_safety",
    );
    expect(result.aggregateStatus).toBe(
      "needs_human_review_before_certification_safety",
    );
  });

  it.each([
    {
      name: "F6Q certification-boundary",
      serviceInput: {
        certificationBoundary: buildCertificationBoundary({
          status: "blocked_by_evidence",
        }),
      },
      targetFamily: "certification_boundary_safety" as const,
    },
    {
      name: "F6S human-confirmation",
      serviceInput: {
        humanConfirmation: buildHumanConfirmation({
          status: "blocked_by_evidence",
        }),
      },
      targetFamily: "human_confirmation_boundary_safety" as const,
    },
    {
      name: "F6N review-summary",
      serviceInput: {
        reviewSummary: buildReviewSummary({ status: "blocked_by_evidence" }),
      },
      targetFamily: "review_summary_safety" as const,
    },
  ])("maps blocked posture from $name", async (scenario) => {
    const service = buildService(scenario.serviceInput);

    const result = await service.getCertificationSafety("acme");
    const target = requireTarget(result, scenario.targetFamily);

    expect(target.status).toBe("blocked_by_evidence");
    expect(result.aggregateStatus).toBe("blocked_by_evidence");
  });

  it.each([
    {
      input: {
        certificationBoundary: buildCertificationBoundary({
          companyKey: "globex",
        }),
      },
      path: "certificationBoundary.companyKey",
    },
    {
      input: {
        humanConfirmation: buildHumanConfirmation({ companyKey: "globex" }),
      },
      path: "humanConfirmationBoundary.companyKey",
    },
    {
      input: {
        reviewSummary: buildReviewSummary({ companyKey: "globex" }),
      },
      path: "reviewSummary.companyKey",
    },
  ])("fails closed when $path mismatches", async (scenario) => {
    const now = vi.fn(() => new Date(generatedAt));
    const service = buildService({ ...scenario.input, now });

    const resultPromise = service.getCertificationSafety("acme");

    await expect(resultPromise).rejects.toBeInstanceOf(
      CloseControlCertificationSafetyCompanyKeyMismatchError,
    );
    await expect(resultPromise).rejects.toMatchObject({
      body: {
        error: {
          code: "invalid_request",
          details: [
            {
              path: scenario.path,
              message: `Expected ${scenario.path} to match requested companyKey "acme", received "globex"`,
            },
          ],
          message: "Invalid request",
        },
      },
      statusCode: 400,
    });
    expect(now).not.toHaveBeenCalled();
  });

  it("exposes absence boundaries for certification, close complete, sign-off, attestation, assurance, opinions, providers, outbox, runtime, reports, approvals, missions, monitor reruns, source mutation, prose, writes, instructions, and actions", async () => {
    const service = buildService();

    const result = await service.getCertificationSafety("acme");

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
      assuranceCreated: false,
      legalOpinionCreated: false,
      auditOpinionCreated: false,
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

  it("does not call provider, credential, outbox, monitor rerun, mission, report, approval, delivery, runtime, source-mutation, prose, certification, opinion, assurance, or action methods", async () => {
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
      circulateReport: vi.fn(),
      createCertification: vi.fn(),
      createCloseComplete: vi.fn(),
      createSignOff: vi.fn(),
      createAttestation: vi.fn(),
      createAssurance: vi.fn(),
      createLegalOpinion: vi.fn(),
      createAuditOpinion: vi.fn(),
      createMission: vi.fn(),
      createRuntimeThread: vi.fn(),
      createSourceMutation: vi.fn(),
      generateProse: vi.fn(),
      generateNotificationProse: vi.fn(),
      runCashPostureMonitor: vi.fn(),
      runCollectionsPressureMonitor: vi.fn(),
      runPayablesPressureMonitor: vi.fn(),
      runPolicyCovenantThresholdMonitor: vi.fn(),
    };
    const service = buildService({
      extraCertificationMethods: forbiddenMethods,
      extraHumanConfirmationMethods: forbiddenMethods,
      extraReviewMethods: forbiddenMethods,
    });

    await service.getCertificationSafety("acme");

    for (const method of Object.values(forbiddenMethods)) {
      expect(method).not.toHaveBeenCalled();
    }
  });
});

function buildService(
  input: {
    certificationBoundary?: CloseControlCertificationBoundaryResult;
    extraCertificationMethods?: Record<string, unknown>;
    extraHumanConfirmationMethods?: Record<string, unknown>;
    extraReviewMethods?: Record<string, unknown>;
    humanConfirmation?: ExternalDeliveryHumanConfirmationBoundaryResult;
    now?: () => Date;
    reviewSummary?: CloseControlReviewSummaryResult;
  } = {},
) {
  return new CloseControlCertificationSafetyService({
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
    externalDeliveryHumanConfirmationBoundaryService: {
      getHumanConfirmationBoundary: vi
        .fn()
        .mockResolvedValue(input.humanConfirmation ?? buildHumanConfirmation()),
      ...input.extraHumanConfirmationMethods,
    },
    now: input.now ?? (() => new Date(generatedAt)),
  });
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
      buildCertificationTarget(status),
    ],
    evidenceSummary:
      "F6Q certification boundary is derived from shipped review and provider posture only.",
    limitations: ["Certification boundary is internal posture only."],
    runtimeActionBoundary: buildCertificationBoundaryAbsence(),
  };
}

function buildHumanConfirmation(
  input: {
    companyKey?: string;
    status?: ExternalDeliveryHumanConfirmationStatus;
  } = {},
): ExternalDeliveryHumanConfirmationBoundaryResult {
  const status = input.status ?? "ready_for_human_confirmation_review";

  return {
    companyKey: input.companyKey ?? "acme",
    generatedAt,
    aggregateStatus: status,
    deliveryGateTargets: [buildHumanConfirmationTarget(status)],
    evidenceSummary:
      "F6S human confirmation is derived from shipped boundary posture only.",
    limitations: ["Human confirmation is internal delivery-preflight only."],
    runtimeActionBoundary: buildHumanConfirmationAbsence(),
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
    reviewSections: [buildReviewSection(status)],
    evidenceSummary:
      "F6N review summary is derived from shipped close/control posture only.",
    limitations: ["Review summary is internal posture only."],
    runtimeActionBoundary: buildReviewSummaryAbsence(),
  };
}

function buildCertificationTarget(
  status: CloseControlCertificationBoundaryStatus,
): CloseControlCertificationBoundaryTarget {
  return {
    targetKey: "certification-boundary:aggregate",
    targetFamily: "certification_absence_boundary",
    status,
    evidenceBasis: {
      basisKind: "runtime_action_absence_posture",
      summary: "Certification-boundary target is stored posture only.",
      refs: [],
    },
    sourceLineageRefs: [],
    sourcePosture: sourcePosture(status),
    freshnessSummary: freshness(status),
    limitations: ["Certification-boundary target remains internal posture."],
    proofPosture: proofPosture(status),
    proofRefs: [
      "close-control.certificationBoundary.targets.certification-boundary:aggregate.proofPosture",
    ],
    humanReviewNextStep:
      "Review certification boundary before any future certification-safety path.",
    relatedReviewSummarySectionKey: "review-summary:aggregate",
    relatedProviderBoundaryTargetKey: "provider-boundary:aggregate",
    relatedMonitorKind: "cash_posture",
    relatedSourceRole: "bank_account_summary",
  };
}

function buildHumanConfirmationTarget(
  status: ExternalDeliveryHumanConfirmationStatus,
): ExternalDeliveryHumanConfirmationTarget {
  return {
    targetKey: "human-confirmation:aggregate",
    targetFamily: "human_confirmation_absence_boundary",
    status,
    evidenceBasis: {
      basisKind: "runtime_action_absence_posture",
      summary: "Human-confirmation target is stored posture only.",
      refs: [],
    },
    sourceLineageRefs: [],
    sourcePosture: sourcePosture(status),
    freshnessSummary: freshness(status),
    limitations: ["Human-confirmation target remains internal posture."],
    proofPosture: proofPosture(status),
    proofRefs: [
      "external-delivery.humanConfirmationBoundary.targets.human-confirmation:aggregate.proofPosture",
    ],
    humanReviewNextStep:
      "Review human confirmation before any future certification-safety path.",
    relatedDeliveryReadinessTargetKey: null,
    relatedProviderBoundaryTargetKey: "provider-boundary:aggregate",
    relatedCertificationBoundaryTargetKey: "certification-boundary:aggregate",
    relatedReviewSummarySectionKey: "review-summary:aggregate",
    relatedMonitorKind: "cash_posture",
    relatedSourceRole: "bank_account_summary",
  };
}

function buildReviewSection(
  status: CloseControlReviewStatus,
): CloseControlReviewSection {
  return {
    sectionKey: "review-summary:aggregate",
    family: "source_and_wiki_freshness_posture",
    status,
    evidenceBasis: {
      summary: "Review-summary section is stored posture only.",
      refs: [],
    },
    sourceLineageRefs: [],
    sourcePosture: sourcePosture(status),
    freshnessSummary: freshness(status),
    limitations: ["Review-summary section remains internal posture."],
    proofPosture: proofPosture(status),
    proofRefs: [
      "close-control.reviewSummary.sections.review-summary:aggregate.proofPosture",
    ],
    humanReviewNextStep:
      "Review summary section before any future certification-safety path.",
    relatedChecklistItemFamily: "cash_source_freshness_review",
    relatedReadinessItemKey: null,
    relatedAcknowledgementTargetKey: null,
    relatedDeliveryReadinessTargetKey: null,
    relatedMonitorKind: "cash_posture",
  };
}

function sourcePosture(
  status:
    | CloseControlCertificationBoundaryStatus
    | CloseControlReviewStatus
    | ExternalDeliveryHumanConfirmationStatus,
) {
  const state: "missing_source" | "source_backed" | "limited_source" =
    status === "blocked_by_evidence"
      ? "missing_source"
      : status === "ready_for_certification_boundary_review" ||
          status === "ready_for_human_confirmation_review" ||
          status === "ready_for_review_summary"
        ? "source_backed"
        : "limited_source";

  return {
    state,
    summary: "Source posture is carried from upstream read models.",
    missingSource: status === "blocked_by_evidence",
    refs: [],
  };
}

function freshness(
  status:
    | CloseControlCertificationBoundaryStatus
    | CloseControlReviewStatus
    | ExternalDeliveryHumanConfirmationStatus,
) {
  const state: "missing" | "fresh" | "mixed" =
    status === "blocked_by_evidence"
      ? "missing"
      : status === "ready_for_certification_boundary_review" ||
          status === "ready_for_human_confirmation_review" ||
          status === "ready_for_review_summary"
        ? "fresh"
        : "mixed";

  return {
    state,
    summary: "Freshness posture is carried from upstream read models.",
    latestObservedAt: generatedAt,
  };
}

function proofPosture(
  status:
    | CloseControlCertificationBoundaryStatus
    | CloseControlReviewStatus
    | ExternalDeliveryHumanConfirmationStatus,
) {
  const state:
    | "limited_by_missing_source"
    | "source_backed"
    | "limited_by_coverage_gap" =
    status === "blocked_by_evidence"
      ? "limited_by_missing_source"
      : status === "ready_for_certification_boundary_review" ||
          status === "ready_for_human_confirmation_review" ||
          status === "ready_for_review_summary"
        ? "source_backed"
        : "limited_by_coverage_gap";

  return {
    state,
    summary: "Proof posture is carried from upstream read models.",
  };
}

function buildCertificationBoundaryAbsence() {
  const {
    generatedNotificationProseCreated: _generatedNotificationProseCreated,
    ...boundary
  } = buildHumanConfirmationAbsence();

  return boundary;
}

function buildReviewSummaryAbsence() {
  const {
    assuranceCreated: _assuranceCreated,
    auditOpinionCreated: _auditOpinionCreated,
    autoSendConfigured: _autoSendConfigured,
    externalProviderCalled: _externalProviderCalled,
    generatedNotificationProseCreated: _generatedNotificationProseCreated,
    legalOpinionCreated: _legalOpinionCreated,
    providerCredentialCreated: _providerCredentialCreated,
    providerJobCreated: _providerJobCreated,
    scheduledDeliveryCreated: _scheduledDeliveryCreated,
    ...boundary
  } = buildHumanConfirmationAbsence();

  return boundary;
}

function buildHumanConfirmationAbsence() {
  return {
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
    summary: "Upstream read is deterministic and action-free.",
    replayImplication: "Upstream read is not appended to mission replay.",
  } as const;
}

function requireTarget(
  result: CloseControlCertificationSafetyResult,
  family: CloseControlCertificationSafetyTargetFamily,
) {
  const target = result.closeControlCertificationSafetyTargets.find(
    (candidate) => candidate.targetFamily === family,
  );

  if (!target) {
    throw new Error(`Missing certification-safety target ${family}`);
  }

  return target;
}

function assertNoForbiddenStatuses(
  result: CloseControlCertificationSafetyResult,
) {
  const statuses = [
    result.aggregateStatus,
    ...result.closeControlCertificationSafetyTargets.map(
      (target) => target.status,
    ),
  ];

  for (const forbidden of [
    "certified",
    "certification_complete",
    "close_complete",
    "approved",
    "released",
    "signed_off",
    "attested",
    "assured",
    "legal_opinion",
    "audit_opinion",
    "delivered",
    "sent",
    "authorized",
  ]) {
    expect(statuses).not.toContain(forbidden);
  }
}
