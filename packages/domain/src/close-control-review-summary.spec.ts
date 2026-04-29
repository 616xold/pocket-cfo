import { describe, expect, it } from "vitest";
import {
  CLOSE_CONTROL_REVIEW_SECTION_FAMILIES,
  CLOSE_CONTROL_REVIEW_STATUSES,
  CloseControlReviewRuntimeActionAbsenceBoundarySchema,
  CloseControlReviewStatusSchema,
  CloseControlReviewSummaryResultSchema,
  deriveCloseControlReviewAggregateStatus,
  type CloseControlReviewSection,
  type CloseControlReviewSectionFamily,
  type CloseControlReviewStatus,
} from "./close-control-review-summary";

const generatedAt = "2026-04-29T12:00:00.000Z";

describe("close/control review summary domain contract", () => {
  it("accepts one deterministic internal review-summary result with proof and absence posture", () => {
    const parsed = CloseControlReviewSummaryResultSchema.parse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "needs_human_review",
      reviewSections: [
        buildSection("close-control-checklist", "close_control_checklist_posture"),
        buildSection("operator-readiness", "operator_readiness_posture"),
        buildSection(
          "acknowledgement-readiness",
          "acknowledgement_readiness_posture",
        ),
        buildSection(
          "delivery-boundary",
          "delivery_boundary_posture",
          "needs_human_review",
        ),
        buildSection("monitor-context", "monitor_context_posture"),
        buildSection(
          "source-and-wiki-freshness",
          "source_and_wiki_freshness_posture",
        ),
      ],
      evidenceSummary:
        "F6N review summary is derived from F6H, F6J, F6K, and F6M read posture only.",
      limitations: [
        "Review summary is internal human-review posture only and is not certification.",
      ],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(parsed.aggregateStatus).toBe("needs_human_review");
    expect(parsed.reviewSections).toHaveLength(6);
    expect(parsed.reviewSections[3]).toMatchObject({
      family: "delivery_boundary_posture",
      status: "needs_human_review",
      relatedDeliveryReadinessTargetKey: "delivery:aggregate",
    });
    expect(parsed.runtimeActionBoundary).toMatchObject({
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

  it("keeps section families bounded to shipped internal review-summary inputs", () => {
    expect(CLOSE_CONTROL_REVIEW_SECTION_FAMILIES).toEqual([
      "close_control_checklist_posture",
      "operator_readiness_posture",
      "acknowledgement_readiness_posture",
      "delivery_boundary_posture",
      "monitor_context_posture",
      "source_and_wiki_freshness_posture",
    ]);
  });

  it("keeps review-summary status vocabulary internal and excludes forbidden states", () => {
    expect(CloseControlReviewStatusSchema.options).toEqual([
      "ready_for_review_summary",
      "needs_human_review",
      "blocked_by_evidence",
    ]);

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
      expect(CLOSE_CONTROL_REVIEW_STATUSES).not.toContain(forbidden);
    }
  });

  it("derives blocked and needs-review aggregate posture deterministically", () => {
    expect(
      deriveCloseControlReviewAggregateStatus([
        buildSection("checklist", "close_control_checklist_posture"),
        buildSection(
          "acknowledgement",
          "acknowledgement_readiness_posture",
          "blocked_by_evidence",
        ),
      ]),
    ).toBe("blocked_by_evidence");

    expect(
      deriveCloseControlReviewAggregateStatus([
        buildSection("checklist", "close_control_checklist_posture"),
        buildSection(
          "delivery",
          "delivery_boundary_posture",
          "needs_human_review",
        ),
      ]),
    ).toBe("needs_human_review");
  });

  it("rejects aggregate status that hides non-ready sections", () => {
    const result = CloseControlReviewSummaryResultSchema.safeParse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_review_summary",
      reviewSections: [
        buildSection("close-control-checklist", "close_control_checklist_posture"),
        buildSection("operator-readiness", "operator_readiness_posture"),
        buildSection(
          "acknowledgement-readiness",
          "acknowledgement_readiness_posture",
        ),
        buildSection(
          "delivery-boundary",
          "delivery_boundary_posture",
          "needs_human_review",
        ),
        buildSection("monitor-context", "monitor_context_posture"),
        buildSection(
          "source-and-wiki-freshness",
          "source_and_wiki_freshness_posture",
        ),
      ],
      evidenceSummary: "Derived internal review-summary result.",
      limitations: ["Internal review summary only; no certification occurred."],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate section families and any absence field set to true", () => {
    const duplicateResult = CloseControlReviewSummaryResultSchema.safeParse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_review_summary",
      reviewSections: [
        buildSection("close-control-checklist", "close_control_checklist_posture"),
        buildSection("operator-readiness", "operator_readiness_posture"),
        buildSection(
          "acknowledgement-readiness",
          "acknowledgement_readiness_posture",
        ),
        buildSection("duplicate-delivery", "delivery_boundary_posture"),
        buildSection("monitor-context", "monitor_context_posture"),
        buildSection("duplicate-monitor", "monitor_context_posture"),
      ],
      evidenceSummary: "Derived internal review-summary result.",
      limitations: ["Internal review summary only; no certification occurred."],
      runtimeActionBoundary: buildBoundary(),
    });
    const boundaryResult =
      CloseControlReviewRuntimeActionAbsenceBoundarySchema.safeParse({
        ...buildBoundary(),
        certificationCreated: true,
      });

    expect(duplicateResult.success).toBe(false);
    expect(boundaryResult.success).toBe(false);
  });
});

function buildSection(
  sectionKey: string,
  family: CloseControlReviewSectionFamily,
  status: CloseControlReviewStatus = "ready_for_review_summary",
): CloseControlReviewSection {
  return {
    sectionKey,
    family,
    status,
    evidenceBasis: {
      summary: "Review-summary section is derived from stored read posture.",
      refs: [
        {
          kind:
            family === "delivery_boundary_posture"
              ? "delivery_readiness_result"
              : family === "operator_readiness_posture"
                ? "operator_readiness_result"
                : family === "acknowledgement_readiness_posture"
                  ? "acknowledgement_readiness_result"
                  : family === "monitor_context_posture"
                    ? "monitor_context"
                    : "close_control_checklist",
          evidencePath: sectionKey,
          summary: "Stored upstream posture reference.",
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind:
            family === "monitor_context_posture" ? "cash_posture" : null,
          monitorResultId:
            family === "monitor_context_posture"
              ? "11111111-1111-4111-8111-111111111111"
              : null,
          checklistItemFamily:
            family === "source_and_wiki_freshness_posture"
              ? "policy_source_freshness_review"
              : null,
          operatorReadinessItemKey:
            family === "operator_readiness_posture"
              ? "operator-readiness:aggregate"
              : null,
          acknowledgementTargetKey:
            family === "acknowledgement_readiness_posture"
              ? "acknowledgement:aggregate"
              : null,
          deliveryReadinessTargetKey:
            family === "delivery_boundary_posture"
              ? "delivery:aggregate"
              : null,
          proofRef: "proof.posture",
        },
      ],
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state:
        status === "blocked_by_evidence"
          ? "missing_source"
          : status === "needs_human_review"
            ? "limited_source"
            : "source_backed",
      summary: "Source posture is carried from upstream read models.",
      missingSource: status === "blocked_by_evidence",
      refs: [],
    },
    freshnessSummary: {
      state: status === "blocked_by_evidence" ? "missing" : "fresh",
      summary: "Freshness posture is carried from upstream read models.",
      latestObservedAt: generatedAt,
    },
    limitations: [
      "Review-summary section is internal human-review posture only.",
    ],
    proofPosture: {
      state:
        status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : status === "needs_human_review"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Proof posture is carried from upstream read models.",
    },
    proofRefs: ["proof.posture"],
    humanReviewNextStep:
      "Review this internal section before deciding any follow-up.",
    relatedChecklistItemFamily:
      family === "source_and_wiki_freshness_posture"
        ? "policy_source_freshness_review"
        : null,
    relatedReadinessItemKey:
      family === "operator_readiness_posture"
        ? "operator-readiness:aggregate"
        : null,
    relatedAcknowledgementTargetKey:
      family === "acknowledgement_readiness_posture"
        ? "acknowledgement:aggregate"
        : null,
    relatedDeliveryReadinessTargetKey:
      family === "delivery_boundary_posture" ? "delivery:aggregate" : null,
    relatedMonitorKind:
      family === "monitor_context_posture" ? "cash_posture" : null,
  };
}

function buildBoundary() {
  return {
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
    summary:
      "F6N review summary generation is deterministic, read-only, internal, and action-free.",
    replayImplication:
      "The first F6N review-summary result is derived from current stored posture and is not persisted as a mission replay event.",
  };
}
