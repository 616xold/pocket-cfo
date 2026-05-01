import { describe, expect, it } from "vitest";
import {
  CLOSE_CONTROL_CERTIFICATION_SAFETY_STATUSES,
  CLOSE_CONTROL_CERTIFICATION_SAFETY_TARGET_FAMILIES,
  CloseControlCertificationSafetyResultSchema,
  CloseControlCertificationSafetyRuntimeActionAbsenceBoundarySchema,
  CloseControlCertificationSafetyStatusSchema,
  deriveCloseControlCertificationSafetyAggregateStatus,
  type CloseControlCertificationSafetyStatus,
  type CloseControlCertificationSafetyTarget,
  type CloseControlCertificationSafetyTargetFamily,
} from "./close-control-certification-safety";

const generatedAt = "2026-05-01T10:00:00.000Z";

describe("close/control certification-safety domain contract", () => {
  it("accepts one deterministic internal certification-safety result with proof and absence posture", () => {
    const parsed = CloseControlCertificationSafetyResultSchema.parse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "needs_human_review_before_certification_safety",
      closeControlCertificationSafetyTargets: buildAllTargets({
        human_confirmation_boundary_safety:
          "needs_human_review_before_certification_safety",
      }),
      evidenceSummary:
        "F6T certification-safety readiness is derived from F6Q, F6S, and F6N posture only.",
      limitations: [
        "Certification-safety posture is internal readiness posture only; no certification occurred and no assurance occurred.",
      ],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(parsed.aggregateStatus).toBe(
      "needs_human_review_before_certification_safety",
    );
    expect(parsed.closeControlCertificationSafetyTargets).toHaveLength(7);
    expect(parsed.closeControlCertificationSafetyTargets[1]).toMatchObject({
      targetFamily: "human_confirmation_boundary_safety",
      relatedHumanConfirmationTargetKey: "human-confirmation:aggregate",
      status: "needs_human_review_before_certification_safety",
    });
    expect(parsed.runtimeActionBoundary).toMatchObject({
      runtimeCodexUsed: false,
      deliveryCreated: false,
      externalProviderCalled: false,
      notificationProviderCalled: false,
      providerCredentialCreated: false,
      providerJobCreated: false,
      outboxSendCreated: false,
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

  it("keeps target families bounded to internal certification-safety gates", () => {
    expect(CLOSE_CONTROL_CERTIFICATION_SAFETY_TARGET_FAMILIES).toEqual([
      "certification_boundary_safety",
      "human_confirmation_boundary_safety",
      "review_summary_safety",
      "source_freshness_and_lineage_safety",
      "proof_and_limitation_safety",
      "human_review_next_step_safety",
      "certification_absence_safety",
    ]);
  });

  it("keeps status vocabulary review-only and excludes certification, approval, release, and opinion states", () => {
    expect(CloseControlCertificationSafetyStatusSchema.options).toEqual([
      "ready_for_certification_safety_review",
      "needs_human_review_before_certification_safety",
      "blocked_by_evidence",
    ]);

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
      "assured",
      "assurance_ready",
      "report_released",
      "report_circulated",
      "legal_opinion",
      "legal_opinion_ready",
      "audit_opinion",
      "audit_opinion_ready",
      "delivered",
      "sent",
      "authorized",
    ]) {
      expect(CLOSE_CONTROL_CERTIFICATION_SAFETY_STATUSES).not.toContain(
        forbidden,
      );
    }
  });

  it("derives blocked and needs-review aggregate posture deterministically", () => {
    expect(
      deriveCloseControlCertificationSafetyAggregateStatus(
        buildAllTargets({
          review_summary_safety: "blocked_by_evidence",
        }),
      ),
    ).toBe("blocked_by_evidence");

    expect(
      deriveCloseControlCertificationSafetyAggregateStatus(
        buildAllTargets({
          source_freshness_and_lineage_safety:
            "needs_human_review_before_certification_safety",
        }),
      ),
    ).toBe("needs_human_review_before_certification_safety");
  });

  it("rejects aggregate status that hides non-ready targets", () => {
    const result = CloseControlCertificationSafetyResultSchema.safeParse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_certification_safety_review",
      closeControlCertificationSafetyTargets: buildAllTargets({
        proof_and_limitation_safety:
          "needs_human_review_before_certification_safety",
      }),
      evidenceSummary: "Derived internal certification-safety result.",
      limitations: ["Internal certification-safety posture only."],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate target families and any absence field set to true", () => {
    const duplicateResult =
      CloseControlCertificationSafetyResultSchema.safeParse({
        companyKey: "acme",
        generatedAt,
        aggregateStatus: "ready_for_certification_safety_review",
        closeControlCertificationSafetyTargets: [
          buildTarget("certification", "certification_boundary_safety"),
          buildTarget(
            "human-confirmation",
            "human_confirmation_boundary_safety",
          ),
          buildTarget("review", "review_summary_safety"),
          buildTarget("source", "source_freshness_and_lineage_safety"),
          buildTarget("proof", "proof_and_limitation_safety"),
          buildTarget("duplicate-proof", "proof_and_limitation_safety"),
          buildTarget("absence", "certification_absence_safety"),
        ],
        evidenceSummary: "Derived internal certification-safety result.",
        limitations: ["Internal certification-safety posture only."],
        runtimeActionBoundary: buildBoundary(),
      });
    const boundaryResult =
      CloseControlCertificationSafetyRuntimeActionAbsenceBoundarySchema.safeParse(
        {
          ...buildBoundary(),
          assuranceCreated: true,
        },
      );

    expect(duplicateResult.success).toBe(false);
    expect(boundaryResult.success).toBe(false);
  });
});

function buildAllTargets(
  statuses: Partial<
    Record<
      CloseControlCertificationSafetyTargetFamily,
      CloseControlCertificationSafetyStatus
    >
  > = {},
): CloseControlCertificationSafetyTarget[] {
  return CLOSE_CONTROL_CERTIFICATION_SAFETY_TARGET_FAMILIES.map((family) =>
    buildTarget(family, family, statuses[family]),
  );
}

function buildTarget(
  targetKey: string,
  targetFamily: CloseControlCertificationSafetyTargetFamily,
  status: CloseControlCertificationSafetyStatus = "ready_for_certification_safety_review",
): CloseControlCertificationSafetyTarget {
  const certificationTarget = targetFamily === "certification_boundary_safety";
  const humanConfirmationTarget =
    targetFamily === "human_confirmation_boundary_safety";
  const reviewTarget = targetFamily === "review_summary_safety";
  const sourceTarget = targetFamily === "source_freshness_and_lineage_safety";
  const proofTarget = targetFamily === "proof_and_limitation_safety";
  const absenceTarget = targetFamily === "certification_absence_safety";

  return {
    targetKey,
    targetFamily,
    status,
    evidenceBasis: {
      basisKind: certificationTarget
        ? "certification_boundary_posture"
        : humanConfirmationTarget
          ? "human_confirmation_boundary_posture"
          : reviewTarget
            ? "review_summary_posture"
            : sourceTarget
              ? "source_freshness_and_lineage_posture"
              : proofTarget
                ? "proof_and_limitation_posture"
                : absenceTarget
                  ? "runtime_action_absence_posture"
                  : "human_review_next_step_posture",
      summary:
        "Certification-safety target is derived from stored internal posture.",
      refs: [
        {
          kind: certificationTarget
            ? "certification_boundary_target"
            : humanConfirmationTarget
              ? "human_confirmation_target"
              : reviewTarget
                ? "review_summary_section"
                : absenceTarget
                  ? "absence_boundary"
                  : proofTarget
                    ? "proof_posture"
                    : "source_lineage",
          evidencePath: targetKey,
          summary: "Stored certification-safety evidence reference.",
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
          certificationBoundaryTargetKey: certificationTarget
            ? "certification-boundary:aggregate"
            : null,
          humanConfirmationTargetKey: humanConfirmationTarget
            ? "human-confirmation:aggregate"
            : null,
          reviewSummarySectionKey: reviewTarget ? "review:aggregate" : null,
          proofRef: proofTarget ? "proof.posture" : null,
          relatedSourceRole: sourceTarget ? "bank_account_summary" : null,
        },
      ],
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state:
        status === "blocked_by_evidence"
          ? "missing_source"
          : status === "needs_human_review_before_certification_safety"
            ? "limited_source"
            : "source_backed",
      summary:
        "Stored source posture is carried into certification-safety posture.",
      missingSource: status === "blocked_by_evidence",
      refs: [],
    },
    freshnessSummary: {
      state:
        status === "blocked_by_evidence"
          ? "missing"
          : status === "needs_human_review_before_certification_safety"
            ? "mixed"
            : "fresh",
      summary: "Freshness posture is carried from upstream read models.",
      latestObservedAt: generatedAt,
    },
    limitations: [
      "This target is internal certification-safety posture only; no certification occurred.",
    ],
    proofPosture: {
      state:
        status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : status === "needs_human_review_before_certification_safety"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Proof posture is carried from stored evidence.",
    },
    proofRefs: proofTarget ? ["proof.posture"] : [],
    humanReviewNextStep:
      "Review the cited internal posture before any future certification-safety review target.",
    relatedCertificationBoundaryTargetKey: certificationTarget
      ? "certification-boundary:aggregate"
      : null,
    relatedHumanConfirmationTargetKey: humanConfirmationTarget
      ? "human-confirmation:aggregate"
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
    summary:
      "F6T certification-safety generation is deterministic, read-only, internal, certification-free, assurance-free, legal/audit-opinion-free, delivery-free, provider-call-free, outbox-send-free, report-free, approval-free, mission-free, monitor-run-free, source-mutation-free, generated-prose-free, and action-free.",
    replayImplication:
      "The first F6T certification-safety result is generated from current stored/read posture and is not persisted as a mission replay event.",
  };
}
