import { describe, expect, it } from "vitest";
import {
  CLOSE_CONTROL_CERTIFICATION_BOUNDARY_STATUSES,
  CLOSE_CONTROL_CERTIFICATION_BOUNDARY_TARGET_FAMILIES,
  CloseControlCertificationBoundaryResultSchema,
  CloseControlCertificationBoundaryRuntimeActionAbsenceBoundarySchema,
  CloseControlCertificationBoundaryStatusSchema,
  deriveCloseControlCertificationBoundaryAggregateStatus,
  type CloseControlCertificationBoundaryStatus,
  type CloseControlCertificationBoundaryTarget,
  type CloseControlCertificationBoundaryTargetFamily,
} from "./close-control-certification-boundary";

const generatedAt = "2026-04-29T19:55:00.000Z";

describe("close/control certification-boundary domain contract", () => {
  it("accepts one deterministic internal certification-boundary result with proof and absence posture", () => {
    const parsed = CloseControlCertificationBoundaryResultSchema.parse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "needs_human_review_before_certification_boundary",
      closeControlCertificationBoundaryTargets: buildAllTargets({
        provider_boundary:
          "needs_human_review_before_certification_boundary",
      }),
      evidenceSummary:
        "F6Q certification-boundary readiness is derived from F6N review-summary and F6P provider-boundary posture only.",
      limitations: [
        "Certification-boundary posture is internal review posture only; no certification occurred and no close complete occurred.",
      ],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(parsed.aggregateStatus).toBe(
      "needs_human_review_before_certification_boundary",
    );
    expect(parsed.closeControlCertificationBoundaryTargets).toHaveLength(6);
    expect(parsed.closeControlCertificationBoundaryTargets[1]).toMatchObject({
      targetFamily: "provider_boundary",
      status: "needs_human_review_before_certification_boundary",
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

  it("keeps target families bounded to internal certification-boundary gates", () => {
    expect(CLOSE_CONTROL_CERTIFICATION_BOUNDARY_TARGET_FAMILIES).toEqual([
      "review_summary_boundary",
      "provider_boundary",
      "evidence_and_source_boundary",
      "proof_and_limitation_boundary",
      "human_review_gate_boundary",
      "certification_absence_boundary",
    ]);
  });

  it("keeps status vocabulary review-only and excludes certification, release, and opinion states", () => {
    expect(CloseControlCertificationBoundaryStatusSchema.options).toEqual([
      "ready_for_certification_boundary_review",
      "needs_human_review_before_certification_boundary",
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
      expect(CLOSE_CONTROL_CERTIFICATION_BOUNDARY_STATUSES).not.toContain(
        forbidden,
      );
    }
  });

  it("derives blocked and needs-review aggregate posture deterministically", () => {
    expect(
      deriveCloseControlCertificationBoundaryAggregateStatus(
        buildAllTargets({
          review_summary_boundary: "blocked_by_evidence",
        }),
      ),
    ).toBe("blocked_by_evidence");

    expect(
      deriveCloseControlCertificationBoundaryAggregateStatus(
        buildAllTargets({
          evidence_and_source_boundary:
            "needs_human_review_before_certification_boundary",
        }),
      ),
    ).toBe("needs_human_review_before_certification_boundary");
  });

  it("rejects aggregate status that hides non-ready targets", () => {
    const result = CloseControlCertificationBoundaryResultSchema.safeParse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_certification_boundary_review",
      closeControlCertificationBoundaryTargets: buildAllTargets({
        proof_and_limitation_boundary:
          "needs_human_review_before_certification_boundary",
      }),
      evidenceSummary: "Derived internal certification-boundary result.",
      limitations: ["Internal certification-boundary posture only."],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate target families and any absence field set to true", () => {
    const duplicateResult =
      CloseControlCertificationBoundaryResultSchema.safeParse({
        companyKey: "acme",
        generatedAt,
        aggregateStatus: "ready_for_certification_boundary_review",
        closeControlCertificationBoundaryTargets: [
          buildTarget("review-summary", "review_summary_boundary"),
          buildTarget("provider", "provider_boundary"),
          buildTarget("evidence", "evidence_and_source_boundary"),
          buildTarget("proof", "proof_and_limitation_boundary"),
          buildTarget("duplicate-proof", "proof_and_limitation_boundary"),
          buildTarget("absence", "certification_absence_boundary"),
        ],
        evidenceSummary: "Derived internal certification-boundary result.",
        limitations: ["Internal certification-boundary posture only."],
        runtimeActionBoundary: buildBoundary(),
      });
    const boundaryResult =
      CloseControlCertificationBoundaryRuntimeActionAbsenceBoundarySchema.safeParse(
        {
          ...buildBoundary(),
          certificationCreated: true,
        },
      );

    expect(duplicateResult.success).toBe(false);
    expect(boundaryResult.success).toBe(false);
  });
});

function buildAllTargets(
  statuses: Partial<
    Record<
      CloseControlCertificationBoundaryTargetFamily,
      CloseControlCertificationBoundaryStatus
    >
  > = {},
): CloseControlCertificationBoundaryTarget[] {
  return CLOSE_CONTROL_CERTIFICATION_BOUNDARY_TARGET_FAMILIES.map((family) =>
    buildTarget(family, family, statuses[family]),
  );
}

function buildTarget(
  targetKey: string,
  targetFamily: CloseControlCertificationBoundaryTargetFamily,
  status: CloseControlCertificationBoundaryStatus = "ready_for_certification_boundary_review",
): CloseControlCertificationBoundaryTarget {
  const reviewTarget = targetFamily === "review_summary_boundary";
  const providerTarget = targetFamily === "provider_boundary";
  const evidenceTarget = targetFamily === "evidence_and_source_boundary";
  const proofTarget = targetFamily === "proof_and_limitation_boundary";
  const absenceTarget = targetFamily === "certification_absence_boundary";

  return {
    targetKey,
    targetFamily,
    status,
    evidenceBasis: {
      basisKind: reviewTarget
        ? "review_summary_posture"
        : providerTarget
          ? "provider_boundary_posture"
          : evidenceTarget
            ? "evidence_and_source_posture"
            : proofTarget
              ? "proof_and_limitation_posture"
              : absenceTarget
                ? "runtime_action_absence_posture"
                : "human_review_gate_posture",
      summary:
        "Certification-boundary target is derived from stored internal posture.",
      refs: [
        {
          kind: reviewTarget
            ? "review_summary_section"
            : providerTarget
              ? "provider_boundary_target"
              : absenceTarget
                ? "absence_boundary"
                : proofTarget
                  ? "proof_posture"
                  : "source_lineage",
          evidencePath: targetKey,
          summary: "Stored certification-boundary evidence reference.",
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind: evidenceTarget ? "cash_posture" : null,
          monitorResultId: null,
          checklistItemFamily: evidenceTarget
            ? "cash_source_freshness_review"
            : null,
          reviewSummarySectionKey: reviewTarget
            ? "close-control-review-summary:delivery-boundary"
            : null,
          providerBoundaryTargetKey: providerTarget
            ? "provider-boundary:aggregate"
            : null,
          proofRef: proofTarget ? "proof.posture" : null,
          relatedSourceRole: evidenceTarget ? "bank_account_summary" : null,
        },
      ],
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state:
        status === "blocked_by_evidence"
          ? "missing_source"
          : status === "needs_human_review_before_certification_boundary"
            ? "limited_source"
            : "source_backed",
      summary:
        "Stored source posture is carried into certification-boundary posture.",
      missingSource: status === "blocked_by_evidence",
      refs: [],
    },
    freshnessSummary: {
      state:
        status === "blocked_by_evidence"
          ? "missing"
          : status === "needs_human_review_before_certification_boundary"
            ? "mixed"
            : "fresh",
      summary: "Freshness posture is carried from upstream read models.",
      latestObservedAt: generatedAt,
    },
    limitations: [
      "This target is internal certification-boundary posture only; no certification occurred.",
    ],
    proofPosture: {
      state:
        status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : status === "needs_human_review_before_certification_boundary"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Proof posture is carried from stored evidence.",
    },
    proofRefs: proofTarget ? ["proof.posture"] : [],
    humanReviewNextStep:
      "Review the cited internal posture before any future certification review target.",
    relatedReviewSummarySectionKey: reviewTarget
      ? "close-control-review-summary:delivery-boundary"
      : null,
    relatedProviderBoundaryTargetKey: providerTarget
      ? "provider-boundary:aggregate"
      : null,
    relatedMonitorKind: evidenceTarget ? "cash_posture" : null,
    relatedSourceRole: evidenceTarget ? "bank_account_summary" : null,
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
      "F6Q certification-boundary generation is deterministic, read-only, internal, certification-free, close-complete-free, delivery-free, provider-call-free, outbox-send-free, report-free, approval-free, mission-free, monitor-run-free, source-mutation-free, generated-prose-free, and action-free.",
    replayImplication:
      "The first F6Q certification-boundary result is generated from current stored/read posture and is not persisted as a mission replay event.",
  };
}
