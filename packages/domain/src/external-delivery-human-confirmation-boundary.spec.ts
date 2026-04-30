import { describe, expect, it } from "vitest";
import {
  EXTERNAL_DELIVERY_HUMAN_CONFIRMATION_STATUSES,
  EXTERNAL_DELIVERY_HUMAN_CONFIRMATION_TARGET_FAMILIES,
  ExternalDeliveryHumanConfirmationBoundaryResultSchema,
  ExternalDeliveryHumanConfirmationRuntimeActionAbsenceBoundarySchema,
  ExternalDeliveryHumanConfirmationStatusSchema,
  deriveExternalDeliveryHumanConfirmationAggregateStatus,
  type ExternalDeliveryHumanConfirmationStatus,
  type ExternalDeliveryHumanConfirmationTarget,
  type ExternalDeliveryHumanConfirmationTargetFamily,
} from "./external-delivery-human-confirmation-boundary";

const generatedAt = "2026-04-30T12:00:00.000Z";

describe("external delivery human-confirmation boundary domain contract", () => {
  it("accepts one deterministic internal human-confirmation result with proof and absence posture", () => {
    const parsed = ExternalDeliveryHumanConfirmationBoundaryResultSchema.parse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "needs_human_review_before_confirmation",
      deliveryGateTargets: buildAllTargets({
        provider_boundary_confirmation_boundary:
          "needs_human_review_before_confirmation",
      }),
      evidenceSummary:
        "F6S human-confirmation readiness is derived from F6M, F6P, F6Q, and F6N posture only.",
      limitations: [
        "Human-confirmation posture is internal delivery-preflight posture only and no send occurred.",
      ],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(parsed.aggregateStatus).toBe(
      "needs_human_review_before_confirmation",
    );
    expect(parsed.deliveryGateTargets).toHaveLength(6);
    expect(parsed.deliveryGateTargets[1]).toMatchObject({
      targetFamily: "provider_boundary_confirmation_boundary",
      status: "needs_human_review_before_confirmation",
      relatedProviderBoundaryTargetKey: "provider-boundary:aggregate",
    });
    expect(parsed.runtimeActionBoundary).toMatchObject({
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

  it("keeps target families bounded to internal delivery-preflight gates", () => {
    expect(EXTERNAL_DELIVERY_HUMAN_CONFIRMATION_TARGET_FAMILIES).toEqual([
      "delivery_readiness_confirmation_boundary",
      "provider_boundary_confirmation_boundary",
      "certification_boundary_confirmation_boundary",
      "review_summary_confirmation_boundary",
      "source_freshness_and_proof_boundary",
      "human_confirmation_absence_boundary",
    ]);
  });

  it("keeps status vocabulary review-only and excludes execution or authorization states", () => {
    expect(ExternalDeliveryHumanConfirmationStatusSchema.options).toEqual([
      "ready_for_human_confirmation_review",
      "needs_human_review_before_confirmation",
      "blocked_by_evidence",
    ]);

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
      expect(EXTERNAL_DELIVERY_HUMAN_CONFIRMATION_STATUSES).not.toContain(
        forbidden,
      );
    }
  });

  it("derives blocked and needs-review aggregate posture deterministically", () => {
    expect(
      deriveExternalDeliveryHumanConfirmationAggregateStatus(
        buildAllTargets({
          certification_boundary_confirmation_boundary: "blocked_by_evidence",
        }),
      ),
    ).toBe("blocked_by_evidence");

    expect(
      deriveExternalDeliveryHumanConfirmationAggregateStatus(
        buildAllTargets({
          source_freshness_and_proof_boundary:
            "needs_human_review_before_confirmation",
        }),
      ),
    ).toBe("needs_human_review_before_confirmation");
  });

  it("rejects aggregate status that hides non-ready targets", () => {
    const result =
      ExternalDeliveryHumanConfirmationBoundaryResultSchema.safeParse({
        companyKey: "acme",
        generatedAt,
        aggregateStatus: "ready_for_human_confirmation_review",
        deliveryGateTargets: buildAllTargets({
          source_freshness_and_proof_boundary:
            "needs_human_review_before_confirmation",
        }),
        evidenceSummary: "Derived internal human-confirmation result.",
        limitations: ["Internal delivery-preflight posture only."],
        runtimeActionBoundary: buildBoundary(),
      });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate target families and any absence field set to true", () => {
    const duplicateResult =
      ExternalDeliveryHumanConfirmationBoundaryResultSchema.safeParse({
        companyKey: "acme",
        generatedAt,
        aggregateStatus: "ready_for_human_confirmation_review",
        deliveryGateTargets: [
          buildTarget(
            "delivery",
            "delivery_readiness_confirmation_boundary",
          ),
          buildTarget("provider", "provider_boundary_confirmation_boundary"),
          buildTarget(
            "certification",
            "certification_boundary_confirmation_boundary",
          ),
          buildTarget("review", "review_summary_confirmation_boundary"),
          buildTarget("source", "source_freshness_and_proof_boundary"),
          buildTarget("duplicate-source", "source_freshness_and_proof_boundary"),
        ],
        evidenceSummary: "Derived internal human-confirmation result.",
        limitations: ["Internal delivery-preflight posture only."],
        runtimeActionBoundary: buildBoundary(),
      });
    const boundaryResult =
      ExternalDeliveryHumanConfirmationRuntimeActionAbsenceBoundarySchema.safeParse(
        {
          ...buildBoundary(),
          outboxSendCreated: true,
        },
      );

    expect(duplicateResult.success).toBe(false);
    expect(boundaryResult.success).toBe(false);
  });
});

function buildAllTargets(
  statuses: Partial<
    Record<
      ExternalDeliveryHumanConfirmationTargetFamily,
      ExternalDeliveryHumanConfirmationStatus
    >
  > = {},
): ExternalDeliveryHumanConfirmationTarget[] {
  return EXTERNAL_DELIVERY_HUMAN_CONFIRMATION_TARGET_FAMILIES.map((family) =>
    buildTarget(family, family, statuses[family]),
  );
}

function buildTarget(
  targetKey: string,
  targetFamily: ExternalDeliveryHumanConfirmationTargetFamily,
  status: ExternalDeliveryHumanConfirmationStatus = "ready_for_human_confirmation_review",
): ExternalDeliveryHumanConfirmationTarget {
  const deliveryTarget =
    targetFamily === "delivery_readiness_confirmation_boundary";
  const providerTarget =
    targetFamily === "provider_boundary_confirmation_boundary";
  const certificationTarget =
    targetFamily === "certification_boundary_confirmation_boundary";
  const reviewTarget = targetFamily === "review_summary_confirmation_boundary";
  const sourceTarget = targetFamily === "source_freshness_and_proof_boundary";

  return {
    targetKey,
    targetFamily,
    status,
    evidenceBasis: {
      basisKind: deliveryTarget
        ? "delivery_readiness_posture"
        : providerTarget
          ? "provider_boundary_posture"
          : certificationTarget
            ? "certification_boundary_posture"
            : reviewTarget
              ? "review_summary_posture"
              : sourceTarget
                ? "source_freshness_and_proof_posture"
                : "runtime_action_absence_posture",
      summary:
        "Human-confirmation target is derived from stored internal posture.",
      refs: [
        {
          kind: deliveryTarget
            ? "delivery_readiness_target"
            : providerTarget
              ? "provider_boundary_target"
              : certificationTarget
                ? "certification_boundary_target"
                : reviewTarget
                  ? "review_summary_section"
                  : sourceTarget
                    ? "source_lineage"
                    : "absence_boundary",
          evidencePath: targetKey,
          summary: "Stored human-confirmation evidence reference.",
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind: sourceTarget ? "cash_posture" : null,
          monitorResultId: null,
          checklistItemFamily: sourceTarget
            ? "cash_source_freshness_review"
            : null,
          deliveryReadinessTargetKey: deliveryTarget
            ? "delivery-readiness:aggregate"
            : null,
          providerBoundaryTargetKey: providerTarget
            ? "provider-boundary:aggregate"
            : null,
          certificationBoundaryTargetKey: certificationTarget
            ? "certification-boundary:aggregate"
            : null,
          reviewSummarySectionKey: reviewTarget ? "review:aggregate" : null,
          proofRef: sourceTarget ? "proof.posture" : null,
          relatedSourceRole: sourceTarget ? "bank_account_summary" : null,
        },
      ],
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state:
        status === "blocked_by_evidence"
          ? "missing_source"
          : status === "needs_human_review_before_confirmation"
            ? "limited_source"
            : "source_backed",
      summary: "Stored source posture is carried into human confirmation.",
      missingSource: status === "blocked_by_evidence",
      refs: [],
    },
    freshnessSummary: {
      state:
        status === "blocked_by_evidence"
          ? "missing"
          : status === "needs_human_review_before_confirmation"
            ? "mixed"
            : "fresh",
      summary: "Freshness posture is carried from stored source evidence.",
      latestObservedAt: generatedAt,
    },
    limitations: ["Human-confirmation target remains internal posture."],
    proofPosture: {
      state:
        status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : status === "needs_human_review_before_confirmation"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Proof posture is carried forward.",
    },
    proofRefs: sourceTarget ? ["proof.posture"] : [],
    humanReviewNextStep:
      "Review this delivery-preflight boundary before any future delivery plan.",
    relatedDeliveryReadinessTargetKey: deliveryTarget
      ? "delivery-readiness:aggregate"
      : null,
    relatedProviderBoundaryTargetKey: providerTarget
      ? "provider-boundary:aggregate"
      : null,
    relatedCertificationBoundaryTargetKey: certificationTarget
      ? "certification-boundary:aggregate"
      : null,
    relatedReviewSummarySectionKey: reviewTarget ? "review:aggregate" : null,
    relatedMonitorKind: sourceTarget ? "cash_posture" : null,
    relatedSourceRole: sourceTarget ? "bank_account_summary" : null,
  };
}

function buildBoundary() {
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
    summary:
      "F6S human-confirmation boundary generation is deterministic and no send occurred.",
    replayImplication:
      "The first F6S human-confirmation result is derived and not persisted as a mission replay event.",
  };
}
