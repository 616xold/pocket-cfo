import type {
  CloseControlCertificationBoundaryTarget,
  CloseControlReviewSection,
  CloseControlReviewSummaryResult,
} from "@pocket-cto/domain";
import {
  buildCertificationBoundaryEvidenceRef,
  inferSourceRole,
  mapReviewEvidenceRef,
} from "./evidence";
import { collectProofRefs, dedupe, mapReviewStatus } from "./helpers";

export function buildReviewSummaryBoundaryTarget(
  reviewSummary: CloseControlReviewSummaryResult,
): CloseControlCertificationBoundaryTarget {
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
        "Certification-boundary review posture is derived from the shipped F6N internal close/control review summary only.",
      refs: [
        buildCertificationBoundaryEvidenceRef({
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
      "F6Q review-summary boundary is internal certification-boundary posture only; no certification occurred and no close complete occurred.",
      ...reviewSummary.limitations,
      ...relatedSection.limitations,
    ]),
    proofPosture: relatedSection.proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_certification_boundary_review"
        ? "Review the F6N internal close/control review summary before any future certification review target."
        : "Resolve the cited F6N review-summary posture before any future certification-boundary review.",
    relatedReviewSummarySectionKey: relatedSection.sectionKey,
    relatedProviderBoundaryTargetKey: null,
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
      (section) => section.family === "source_and_wiki_freshness_posture",
    ) ??
    fallbackSection
  );
}
