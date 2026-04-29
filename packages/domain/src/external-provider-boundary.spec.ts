import { describe, expect, it } from "vitest";
import {
  EXTERNAL_PROVIDER_BOUNDARY_STATUSES,
  EXTERNAL_PROVIDER_BOUNDARY_TARGET_FAMILIES,
  ExternalProviderBoundaryResultSchema,
  ExternalProviderBoundaryRuntimeActionAbsenceBoundarySchema,
  ExternalProviderBoundaryStatusSchema,
  deriveExternalProviderBoundaryAggregateStatus,
  type ExternalProviderBoundaryStatus,
  type ExternalProviderBoundaryTarget,
  type ExternalProviderBoundaryTargetFamily,
} from "./external-provider-boundary";

const generatedAt = "2026-04-29T18:00:00.000Z";

describe("external provider boundary domain contract", () => {
  it("accepts one deterministic internal provider-boundary result with proof and absence posture", () => {
    const parsed = ExternalProviderBoundaryResultSchema.parse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "needs_human_review_before_provider_boundary",
      externalProviderBoundaryTargets: buildAllTargets({
        delivery_readiness_boundary:
          "needs_human_review_before_provider_boundary",
      }),
      evidenceSummary:
        "F6P provider-boundary readiness is derived from F6M delivery-readiness and F6N review-summary posture only.",
      limitations: [
        "Provider-boundary posture is internal review posture only and no provider call occurred.",
      ],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(parsed.aggregateStatus).toBe(
      "needs_human_review_before_provider_boundary",
    );
    expect(parsed.externalProviderBoundaryTargets).toHaveLength(6);
    expect(parsed.externalProviderBoundaryTargets[0]).toMatchObject({
      targetFamily: "delivery_readiness_boundary",
      status: "needs_human_review_before_provider_boundary",
      relatedDeliveryReadinessTargetKey: "delivery-readiness:aggregate",
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

  it("keeps target families bounded to internal provider-boundary gates", () => {
    expect(EXTERNAL_PROVIDER_BOUNDARY_TARGET_FAMILIES).toEqual([
      "delivery_readiness_boundary",
      "review_summary_boundary",
      "source_freshness_boundary",
      "proof_and_limitation_boundary",
      "human_review_gate_boundary",
      "outbox_absence_boundary",
    ]);
  });

  it("keeps status vocabulary review-only and excludes provider execution states", () => {
    expect(ExternalProviderBoundaryStatusSchema.options).toEqual([
      "ready_for_provider_boundary_review",
      "needs_human_review_before_provider_boundary",
      "blocked_by_evidence",
    ]);

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
      expect(EXTERNAL_PROVIDER_BOUNDARY_STATUSES).not.toContain(forbidden);
    }
  });

  it("derives blocked and needs-review aggregate posture deterministically", () => {
    expect(
      deriveExternalProviderBoundaryAggregateStatus(
        buildAllTargets({
          review_summary_boundary: "blocked_by_evidence",
        }),
      ),
    ).toBe("blocked_by_evidence");

    expect(
      deriveExternalProviderBoundaryAggregateStatus(
        buildAllTargets({
          source_freshness_boundary:
            "needs_human_review_before_provider_boundary",
        }),
      ),
    ).toBe("needs_human_review_before_provider_boundary");
  });

  it("rejects aggregate status that hides non-ready targets", () => {
    const result = ExternalProviderBoundaryResultSchema.safeParse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_provider_boundary_review",
      externalProviderBoundaryTargets: buildAllTargets({
        proof_and_limitation_boundary:
          "needs_human_review_before_provider_boundary",
      }),
      evidenceSummary: "Derived internal provider-boundary result.",
      limitations: ["Internal provider-boundary posture only."],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate target families and any absence field set to true", () => {
    const duplicateResult = ExternalProviderBoundaryResultSchema.safeParse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_provider_boundary_review",
      externalProviderBoundaryTargets: [
        buildTarget("delivery-readiness", "delivery_readiness_boundary"),
        buildTarget("review-summary", "review_summary_boundary"),
        buildTarget("source-freshness", "source_freshness_boundary"),
        buildTarget("proof", "proof_and_limitation_boundary"),
        buildTarget("duplicate-proof", "proof_and_limitation_boundary"),
        buildTarget("outbox-absence", "outbox_absence_boundary"),
      ],
      evidenceSummary: "Derived internal provider-boundary result.",
      limitations: ["Internal provider-boundary posture only."],
      runtimeActionBoundary: buildBoundary(),
    });
    const boundaryResult =
      ExternalProviderBoundaryRuntimeActionAbsenceBoundarySchema.safeParse({
        ...buildBoundary(),
        externalProviderCalled: true,
      });

    expect(duplicateResult.success).toBe(false);
    expect(boundaryResult.success).toBe(false);
  });
});

function buildAllTargets(
  statuses: Partial<
    Record<ExternalProviderBoundaryTargetFamily, ExternalProviderBoundaryStatus>
  > = {},
): ExternalProviderBoundaryTarget[] {
  return EXTERNAL_PROVIDER_BOUNDARY_TARGET_FAMILIES.map((family) =>
    buildTarget(family, family, statuses[family]),
  );
}

function buildTarget(
  targetKey: string,
  targetFamily: ExternalProviderBoundaryTargetFamily,
  status: ExternalProviderBoundaryStatus = "ready_for_provider_boundary_review",
): ExternalProviderBoundaryTarget {
  const deliveryTarget = targetFamily === "delivery_readiness_boundary";
  const reviewTarget = targetFamily === "review_summary_boundary";
  const sourceTarget = targetFamily === "source_freshness_boundary";
  const proofTarget = targetFamily === "proof_and_limitation_boundary";
  const outboxTarget = targetFamily === "outbox_absence_boundary";

  return {
    targetKey,
    targetFamily,
    status,
    evidenceBasis: {
      basisKind: deliveryTarget
        ? "delivery_readiness_posture"
        : reviewTarget
          ? "review_summary_posture"
          : sourceTarget
            ? "source_freshness_posture"
            : proofTarget
              ? "proof_and_limitation_posture"
              : outboxTarget
                ? "runtime_action_absence_posture"
                : "human_review_gate_posture",
      summary:
        "Provider-boundary target is derived from stored internal posture.",
      refs: [
        {
          kind: deliveryTarget
            ? "delivery_readiness_target"
            : reviewTarget
              ? "review_summary_section"
              : outboxTarget
                ? "absence_boundary"
                : proofTarget
                  ? "proof_posture"
                  : "source_lineage",
          evidencePath: targetKey,
          summary: "Stored provider-boundary evidence reference.",
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
          reviewSummarySectionKey: reviewTarget
            ? "close-control-review-summary:delivery-boundary"
            : null,
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
          : status === "needs_human_review_before_provider_boundary"
            ? "limited_source"
            : "source_backed",
      summary:
        "Stored source posture is carried into provider-boundary posture.",
      missingSource: status === "blocked_by_evidence",
      refs: [],
    },
    freshnessSummary: {
      state:
        status === "blocked_by_evidence"
          ? "missing"
          : status === "needs_human_review_before_provider_boundary"
            ? "mixed"
            : "fresh",
      summary: "Freshness posture is carried from upstream read models.",
      latestObservedAt: generatedAt,
    },
    limitations: [
      "This target is internal provider-boundary posture only and no provider call occurred.",
    ],
    proofPosture: {
      state:
        status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : status === "needs_human_review_before_provider_boundary"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Proof posture is carried from stored evidence.",
    },
    proofRefs: proofTarget ? ["proof.posture"] : [],
    humanReviewNextStep:
      "Review the cited internal posture before any future provider boundary work.",
    relatedDeliveryReadinessTargetKey: deliveryTarget
      ? "delivery-readiness:aggregate"
      : null,
    relatedReviewSummarySectionKey: reviewTarget
      ? "close-control-review-summary:delivery-boundary"
      : null,
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
    summary:
      "F6P provider-boundary generation is deterministic, read-only, internal, provider-call-free, delivery-free, outbox-send-free, report-free, approval-free, mission-free, monitor-run-free, source-mutation-free, generated-prose-free, and action-free.",
    replayImplication:
      "The first F6P provider-boundary result is generated from current stored/read posture and is not persisted as a mission replay event.",
  };
}
