import type {
  CloseControlReviewSection,
  CloseControlReviewSummaryResult,
  ExternalProviderBoundaryTarget,
} from "@pocket-cto/domain";
import {
  buildProviderBoundaryEvidenceRef,
  inferSourceRole,
  mapReviewEvidenceRef,
} from "./evidence";
import { collectProofRefs, dedupe, mapReviewStatus } from "./helpers";

export function buildReviewSummaryBoundaryTarget(
  reviewSummary: CloseControlReviewSummaryResult,
): ExternalProviderBoundaryTarget {
  const relatedSection = selectReviewSummarySection(reviewSummary);
  const status = mapReviewStatus(reviewSummary.aggregateStatus);
  const relatedSourceRole = inferSourceRole(
    relatedSection.relatedChecklistItemFamily,
  );
  const proofRefs = collectProofRefs([
    ...relatedSection.proofRefs,
    ...relatedSection.evidenceBasis.refs.map((ref) => ref.proofRef),
    `close-control.reviewSummary.sections.${relatedSection.sectionKey}.proofPosture`,
  ]);

  return {
    targetKey: "review-summary-boundary",
    targetFamily: "review_summary_boundary",
    status,
    evidenceBasis: {
      basisKind: "review_summary_posture",
      summary:
        "Provider-boundary review posture is derived from the shipped F6N internal close/control review summary only.",
      refs: [
        buildProviderBoundaryEvidenceRef({
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
      "F6P review-summary boundary is internal provider-boundary posture only; it is not certification, approval, report release, or delivery permission.",
      ...reviewSummary.limitations,
      ...relatedSection.limitations,
    ]),
    proofPosture: relatedSection.proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_provider_boundary_review"
        ? "Review the F6N internal close/control review summary before any future provider-boundary plan."
        : "Resolve the cited F6N review-summary posture before any future provider-boundary review.",
    relatedDeliveryReadinessTargetKey:
      relatedSection.relatedDeliveryReadinessTargetKey,
    relatedReviewSummarySectionKey: relatedSection.sectionKey,
    relatedMonitorKind: relatedSection.relatedMonitorKind,
    relatedSourceRole,
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
