import { describe, expect, it, vi } from "vitest";
import type {
  CloseControlCertificationBoundaryResult,
  CloseControlReviewSection,
  CloseControlReviewSectionFamily,
  CloseControlReviewStatus,
  CloseControlReviewSummaryResult,
  ExternalProviderBoundaryResult,
  ExternalProviderBoundaryStatus,
  ExternalProviderBoundaryTarget,
} from "@pocket-cto/domain";
import {
  CloseControlCertificationBoundaryCompanyKeyMismatchError,
  CloseControlCertificationBoundaryService,
} from "./service";

const generatedAt = "2026-04-29T19:55:00.000Z";

describe("CloseControlCertificationBoundaryService", () => {
  it("builds a ready internal certification-boundary result from matching F6N/F6P payloads", async () => {
    const service = buildService();

    const result = await service.getCertificationBoundary("acme");

    expect(result.companyKey).toBe("acme");
    expect(result.aggregateStatus).toBe(
      "ready_for_certification_boundary_review",
    );
    expect(
      result.closeControlCertificationBoundaryTargets.map(
        (target) => target.targetFamily,
      ),
    ).toEqual([
      "review_summary_boundary",
      "provider_boundary",
      "evidence_and_source_boundary",
      "proof_and_limitation_boundary",
      "human_review_gate_boundary",
      "certification_absence_boundary",
    ]);
    expect(
      result.closeControlCertificationBoundaryTargets.map(
        (target) => target.status,
      ),
    ).toEqual([
      "ready_for_certification_boundary_review",
      "ready_for_certification_boundary_review",
      "ready_for_certification_boundary_review",
      "ready_for_certification_boundary_review",
      "ready_for_certification_boundary_review",
      "ready_for_certification_boundary_review",
    ]);
    assertNoForbiddenStatuses(result);
  });

  it.each([
    {
      name: "F6N review-summary",
      serviceInput: {
        reviewSummary: buildReviewSummary({ status: "needs_human_review" }),
      },
      targetFamily: "review_summary_boundary" as const,
    },
    {
      name: "F6P provider-boundary",
      serviceInput: {
        providerBoundary: buildProviderBoundary({
          status: "needs_human_review_before_provider_boundary",
        }),
      },
      targetFamily: "provider_boundary" as const,
    },
  ])("maps needs-review posture from $name", async (scenario) => {
    const service = buildService(scenario.serviceInput);

    const result = await service.getCertificationBoundary("acme");
    const target = requireTarget(result, scenario.targetFamily);

    expect(target.status).toBe(
      "needs_human_review_before_certification_boundary",
    );
    expect(result.aggregateStatus).toBe(
      "needs_human_review_before_certification_boundary",
    );
  });

  it.each([
    {
      name: "F6N review-summary",
      serviceInput: {
        reviewSummary: buildReviewSummary({ status: "blocked_by_evidence" }),
      },
      targetFamily: "review_summary_boundary" as const,
    },
    {
      name: "F6P provider-boundary",
      serviceInput: {
        providerBoundary: buildProviderBoundary({
          status: "blocked_by_evidence",
        }),
      },
      targetFamily: "provider_boundary" as const,
    },
  ])("maps blocked posture from $name", async (scenario) => {
    const service = buildService(scenario.serviceInput);

    const result = await service.getCertificationBoundary("acme");
    const target = requireTarget(result, scenario.targetFamily);

    expect(target.status).toBe("blocked_by_evidence");
    expect(result.aggregateStatus).toBe("blocked_by_evidence");
  });

  it("fails closed when F6N review-summary companyKey mismatches", async () => {
    const now = vi.fn(() => new Date(generatedAt));
    const service = buildService({
      now,
      reviewSummary: buildReviewSummary({ companyKey: "globex" }),
    });

    const resultPromise = service.getCertificationBoundary("acme");

    await expect(resultPromise).rejects.toBeInstanceOf(
      CloseControlCertificationBoundaryCompanyKeyMismatchError,
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

  it("fails closed when F6P provider-boundary companyKey mismatches", async () => {
    const now = vi.fn(() => new Date(generatedAt));
    const service = buildService({
      now,
      providerBoundary: buildProviderBoundary({ companyKey: "globex" }),
    });

    const resultPromise = service.getCertificationBoundary("acme");

    await expect(resultPromise).rejects.toBeInstanceOf(
      CloseControlCertificationBoundaryCompanyKeyMismatchError,
    );
    await expect(resultPromise).rejects.toMatchObject({
      body: {
        error: {
          code: "invalid_request",
          details: [
            {
              path: "externalProviderBoundary.companyKey",
              message:
                'Expected externalProviderBoundary.companyKey to match requested companyKey "acme", received "globex"',
            },
          ],
          message: "Invalid request",
        },
      },
      statusCode: 400,
    });
    expect(now).not.toHaveBeenCalled();
  });

  it("exposes absence boundaries for certification, close complete, sign-off, attestation, opinions, providers, outbox, runtime, reports, approvals, missions, monitor reruns, source mutation, prose, writes, instructions, and actions", async () => {
    const service = buildService();

    const result = await service.getCertificationBoundary("acme");

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

  it("does not call provider, credential, outbox, monitor rerun, mission, report, approval, delivery, runtime, source-mutation, prose, certification, or action methods", async () => {
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
      createLegalOpinion: vi.fn(),
      createAuditOpinion: vi.fn(),
      createMission: vi.fn(),
      createRuntimeThread: vi.fn(),
      createSourceMutation: vi.fn(),
      generateProse: vi.fn(),
      runCashPostureMonitor: vi.fn(),
      runCollectionsPressureMonitor: vi.fn(),
      runPayablesPressureMonitor: vi.fn(),
      runPolicyCovenantThresholdMonitor: vi.fn(),
    };
    const service = buildService({
      extraProviderMethods: forbiddenMethods,
      extraReviewMethods: forbiddenMethods,
    });

    await service.getCertificationBoundary("acme");

    for (const method of Object.values(forbiddenMethods)) {
      expect(method).not.toHaveBeenCalled();
    }
  });
});

function buildService(
  input: {
    extraProviderMethods?: Record<string, unknown>;
    extraReviewMethods?: Record<string, unknown>;
    now?: () => Date;
    providerBoundary?: ExternalProviderBoundaryResult;
    reviewSummary?: CloseControlReviewSummaryResult;
  } = {},
) {
  return new CloseControlCertificationBoundaryService({
    closeControlReviewSummaryService: {
      getReviewSummary: vi
        .fn()
        .mockResolvedValue(input.reviewSummary ?? buildReviewSummary()),
      ...input.extraReviewMethods,
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
      buildReviewSection("source-and-wiki-freshness", status),
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
  status: CloseControlReviewStatus = "ready_for_review_summary",
  family: CloseControlReviewSectionFamily = "source_and_wiki_freshness_posture",
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
      "Review summary section before any future certification-boundary path.",
    relatedChecklistItemFamily: "cash_source_freshness_review",
    relatedReadinessItemKey: null,
    relatedAcknowledgementTargetKey: null,
    relatedDeliveryReadinessTargetKey: null,
    relatedMonitorKind: "cash_posture",
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
      buildProviderTarget({
        status,
        targetKey: "provider-boundary:aggregate",
      }),
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

function buildProviderTarget(input: {
  status: ExternalProviderBoundaryStatus;
  targetKey: string;
}): ExternalProviderBoundaryTarget {
  return {
    targetKey: input.targetKey,
    targetFamily: "review_summary_boundary",
    status: input.status,
    evidenceBasis: {
      basisKind: "review_summary_posture",
      summary: "Provider-boundary target is stored posture only.",
      refs: [],
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "missing_source"
          : input.status === "needs_human_review_before_provider_boundary"
            ? "limited_source"
            : "source_backed",
      summary: "Provider source posture is carried forward.",
      missingSource: input.status === "blocked_by_evidence",
      refs: [],
    },
    freshnessSummary: {
      state:
        input.status === "blocked_by_evidence"
          ? "missing"
          : input.status === "needs_human_review_before_provider_boundary"
            ? "mixed"
            : "fresh",
      summary: "Provider freshness posture is carried forward.",
      latestObservedAt: generatedAt,
    },
    limitations: ["Provider target remains internal boundary posture."],
    proofPosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : input.status === "needs_human_review_before_provider_boundary"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Provider proof posture is carried forward.",
    },
    proofRefs: [
      `external-provider-boundary.targets.${input.targetKey}.proofPosture`,
    ],
    humanReviewNextStep:
      "Review provider boundary before any future certification-boundary path.",
    relatedDeliveryReadinessTargetKey: null,
    relatedReviewSummarySectionKey: "source-and-wiki-freshness",
    relatedMonitorKind: "cash_posture",
    relatedSourceRole: "bank_account_summary",
  };
}

function requireTarget(
  result: CloseControlCertificationBoundaryResult,
  family: CloseControlCertificationBoundaryResult["closeControlCertificationBoundaryTargets"][number]["targetFamily"],
) {
  const target = result.closeControlCertificationBoundaryTargets.find(
    (candidate) => candidate.targetFamily === family,
  );

  if (!target) {
    throw new Error(`Missing certification-boundary target ${family}`);
  }

  return target;
}

function assertNoForbiddenStatuses(
  result: CloseControlCertificationBoundaryResult,
) {
  const statuses = [
    result.aggregateStatus,
    ...result.closeControlCertificationBoundaryTargets.map(
      (target) => target.status,
    ),
  ];

  for (const forbidden of [
    "certified",
    "certification_pending",
    "certification_complete",
    "close_complete",
    "approved",
    "approval_pending",
    "release_ready",
    "released",
    "signed_off",
    "attested",
    "report_released",
    "report_circulated",
    "assurance_ready",
    "legal_opinion",
    "legal_opinion_ready",
    "audit_opinion",
    "audit_opinion_ready",
    "delivered",
    "sent",
  ]) {
    expect(statuses).not.toContain(forbidden);
  }
}
