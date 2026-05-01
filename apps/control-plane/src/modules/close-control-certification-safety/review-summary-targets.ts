import type {
  CloseControlCertificationSafetyTarget,
  CloseControlReviewSection,
  CloseControlReviewSummaryResult,
} from "@pocket-cto/domain";
import {
  buildCertificationSafetyEvidenceRef,
  inferSourceRole,
  mapReviewEvidenceRef,
} from "./evidence";
import { collectProofRefs, dedupe, mapReviewStatus } from "./helpers";

export function buildReviewSummarySafetyTarget(
  reviewSummary: CloseControlReviewSummaryResult,
): CloseControlCertificationSafetyTarget {
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
    targetKey: "review-summary-safety",
    targetFamily: "review_summary_safety",
    status,
    evidenceBasis: {
      basisKind: "review_summary_posture",
      summary:
        "Certification-safety review-summary posture is derived from the shipped F6N internal close/control review summary only.",
      refs: [
        buildCertificationSafetyEvidenceRef({
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
      "F6T review-summary safety is internal close/control certification-safety posture only; it is not certification, legal opinion, audit opinion, report release, approval, or generated prose.",
      ...reviewSummary.limitations,
      ...relatedSection.limitations,
    ]),
    proofPosture: relatedSection.proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_certification_safety_review"
        ? "Review the F6N internal close/control summary before any future certification-safety review target."
        : "Resolve the cited F6N review-summary posture before certification-safety review.",
    relatedCertificationBoundaryTargetKey: null,
    relatedHumanConfirmationTargetKey: null,
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
    throw new Error(
      "Close/control review summary did not include any sections.",
    );
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
