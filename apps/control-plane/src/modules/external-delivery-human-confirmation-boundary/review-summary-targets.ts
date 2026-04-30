import type {
  CloseControlReviewSection,
  CloseControlReviewSummaryResult,
  ExternalDeliveryHumanConfirmationTarget,
} from "@pocket-cto/domain";
import {
  buildHumanConfirmationEvidenceRef,
  inferSourceRole,
  mapReviewEvidenceRef,
} from "./evidence";
import { collectProofRefs, dedupe, mapReviewStatus } from "./helpers";

export function buildReviewSummaryConfirmationTarget(
  reviewSummary: CloseControlReviewSummaryResult,
): ExternalDeliveryHumanConfirmationTarget {
  const relatedSection = selectReviewSummarySection(reviewSummary);
  const status = mapReviewStatus(reviewSummary.aggregateStatus);
  const proofRefs = collectProofRefs([
    ...relatedSection.proofRefs,
    ...relatedSection.evidenceBasis.refs.map((ref) => ref.proofRef),
    `close-control.reviewSummary.sections.${relatedSection.sectionKey}.proofPosture`,
  ]);

  return {
    targetKey: "review-summary-confirmation-boundary",
    targetFamily: "review_summary_confirmation_boundary",
    status,
    evidenceBasis: {
      basisKind: "review_summary_posture",
      summary:
        "Human-confirmation review-summary posture is derived from the shipped F6N internal close/control review summary only.",
      refs: [
        buildHumanConfirmationEvidenceRef({
          kind: "review_summary_result",
          evidencePath: "close-control.reviewSummary.aggregateStatus",
          summary: reviewSummary.evidenceSummary,
        }),
        ...relatedSection.evidenceBasis.refs.map((ref) =>
          mapReviewEvidenceRef(ref, {
            reviewSummarySectionKey: relatedSection.sectionKey,
          }),
        ),
      ],
    },
    sourceLineageRefs: relatedSection.sourceLineageRefs,
    sourcePosture: {
      ...relatedSection.sourcePosture,
      refs: relatedSection.sourcePosture.refs.map((ref) =>
        mapReviewEvidenceRef(ref, {
          reviewSummarySectionKey: relatedSection.sectionKey,
        }),
      ),
    },
    freshnessSummary: relatedSection.freshnessSummary,
    limitations: dedupe([
      "F6S review-summary confirmation is internal human-confirmation readiness only and does not convert review posture into external communication or generated prose.",
      ...reviewSummary.limitations,
      ...relatedSection.limitations,
    ]),
    proofPosture: relatedSection.proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_human_confirmation_review"
        ? "Review the F6N internal close/control review summary as a future delivery review target before any later external delivery plan."
        : "Resolve the cited F6N review-summary posture before human-confirmation review.",
    relatedDeliveryReadinessTargetKey:
      relatedSection.relatedDeliveryReadinessTargetKey,
    relatedProviderBoundaryTargetKey: null,
    relatedCertificationBoundaryTargetKey: null,
    relatedReviewSummarySectionKey: relatedSection.sectionKey,
    relatedMonitorKind: relatedSection.relatedMonitorKind,
    relatedSourceRole: inferSourceRole(relatedSection.relatedChecklistItemFamily),
  };
}

export function selectReviewSummarySection(
  reviewSummary: CloseControlReviewSummaryResult,
): CloseControlReviewSection {
  const fallbackSection = reviewSummary.reviewSections[0];

  if (!fallbackSection) {
    throw new Error("Close/control review summary did not include any sections.");
  }

  return (
    reviewSummary.reviewSections.find(
      (section) => section.status === "blocked_by_evidence",
    ) ??
    reviewSummary.reviewSections.find(
      (section) => section.status === "needs_human_review",
    ) ??
    reviewSummary.reviewSections.find(
      (section) => section.family === "delivery_boundary_posture",
    ) ??
    fallbackSection
  );
}
