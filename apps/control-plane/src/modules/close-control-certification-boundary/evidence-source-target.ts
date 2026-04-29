import type {
  CloseControlCertificationBoundaryEvidenceRef,
  CloseControlCertificationBoundaryTarget,
  CloseControlReviewSection,
  CloseControlReviewSummaryResult,
  ExternalProviderBoundaryResult,
  ExternalProviderBoundaryTarget,
} from "@pocket-cto/domain";
import {
  inferSourceRole,
  mapProviderEvidenceRef,
  mapReviewEvidenceRef,
} from "./evidence";
import {
  collectLineageRefs,
  collectProofRefs,
  dedupe,
  findWorstSourceState,
  mapSourcePostureToStatus,
  summarizeFreshness,
  summarizeProof,
} from "./helpers";

export function buildEvidenceAndSourceBoundaryTarget(input: {
  providerBoundary: ExternalProviderBoundaryResult;
  reviewSummary: CloseControlReviewSummaryResult;
}): CloseControlCertificationBoundaryTarget {
  const reviewSections = input.reviewSummary.reviewSections;
  const providerTargets = input.providerBoundary.externalProviderBoundaryTargets;
  const sourceState = findWorstSourceState([
    ...reviewSections.map((section) => section.sourcePosture.state),
    ...providerTargets.map((target) => target.sourcePosture.state),
  ]);
  const freshnessSummary = summarizeFreshness(
    [
      ...reviewSections.map((section) => section.freshnessSummary),
      ...providerTargets.map((target) => target.freshnessSummary),
    ],
    "Certification-boundary source freshness is summarized from shipped F6N and F6P source/freshness posture.",
  );
  const refs = collectSourceRefs(reviewSections, providerTargets);
  const relatedReviewSection = selectRelevantReviewSourceSection(reviewSections);
  const relatedProviderTarget = selectRelevantProviderSourceTarget(
    providerTargets,
  );
  const status = mapSourcePostureToStatus(sourceState, freshnessSummary.state);

  return {
    targetKey: "evidence-and-source-boundary",
    targetFamily: "evidence_and_source_boundary",
    status,
    evidenceBasis: {
      basisKind: "evidence_and_source_posture",
      summary:
        "Certification-boundary evidence/source posture is carried from shipped F6N/F6P source and missing-source posture.",
      refs,
    },
    sourceLineageRefs: collectLineageRefs(reviewSections, providerTargets),
    sourcePosture: {
      state: sourceState,
      summary:
        status === "ready_for_certification_boundary_review"
          ? "Shipped F6N/F6P source posture is sufficient for internal certification-boundary review."
          : "Shipped F6N/F6P source posture requires human review before any future certification-boundary review.",
      missingSource:
        sourceState === "missing_source" ||
        sourceState === "monitor_context_missing",
      refs,
    },
    freshnessSummary,
    limitations: dedupe([
      "Source/freshness posture is inherited from shipped F6N/F6P read models and does not mutate raw sources.",
      ...input.reviewSummary.limitations,
      ...input.providerBoundary.limitations,
    ]),
    proofPosture: summarizeProof(
      [
        ...reviewSections.map((section) => section.proofPosture),
        ...providerTargets.map((target) => target.proofPosture),
      ],
      "Certification-boundary source proof posture is summarized from shipped F6N/F6P proof posture.",
    ),
    proofRefs: collectProofRefs([
      ...reviewSections.flatMap((section) => section.proofRefs),
      ...providerTargets.flatMap((target) => target.proofRefs),
    ]),
    humanReviewNextStep:
      status === "ready_for_certification_boundary_review"
        ? "Review source/freshness posture before any future certification review target."
        : "Resolve missing, stale, failed, or limited source posture before any future certification-boundary review.",
    relatedReviewSummarySectionKey: relatedReviewSection?.sectionKey ?? null,
    relatedProviderBoundaryTargetKey: relatedProviderTarget?.targetKey ?? null,
    relatedMonitorKind:
      relatedReviewSection?.relatedMonitorKind ??
      relatedProviderTarget?.relatedMonitorKind ??
      null,
    relatedSourceRole: pickRelatedSourceRole(refs, [
      inferSourceRole(relatedReviewSection?.relatedChecklistItemFamily),
      relatedProviderTarget?.relatedSourceRole ?? null,
    ]),
  };
}

function collectSourceRefs(
  reviewSections: CloseControlReviewSection[],
  providerTargets: ExternalProviderBoundaryTarget[],
) {
  return [
    ...reviewSections.flatMap((section) =>
      section.sourcePosture.refs.map((ref) =>
        mapReviewEvidenceRef(ref, {
          reviewSummarySectionKey: section.sectionKey,
        }),
      ),
    ),
    ...providerTargets.flatMap((target) =>
      target.sourcePosture.refs.map((ref) =>
        mapProviderEvidenceRef(ref, {
          providerBoundaryTargetKey: target.targetKey,
        }),
      ),
    ),
  ];
}

function selectRelevantReviewSourceSection(
  sections: CloseControlReviewSection[],
) {
  return (
    sections.find((section) => section.sourcePosture.missingSource) ??
    sections.find(
      (section) => section.sourcePosture.state !== "source_backed",
    ) ??
    sections.find(
      (section) => section.family === "source_and_wiki_freshness_posture",
    ) ??
    sections[0]
  );
}

function selectRelevantProviderSourceTarget(
  targets: ExternalProviderBoundaryTarget[],
) {
  return (
    targets.find((target) => target.sourcePosture.missingSource) ??
    targets.find((target) => target.sourcePosture.state !== "source_backed") ??
    targets.find((target) => target.targetFamily === "source_freshness_boundary") ??
    targets[0]
  );
}

function pickRelatedSourceRole(
  refs: CloseControlCertificationBoundaryEvidenceRef[],
  candidates: Array<string | null>,
) {
  return (
    candidates.find((candidate): candidate is string => Boolean(candidate)) ??
    refs.find((ref) => ref.relatedSourceRole)?.relatedSourceRole ??
    null
  );
}
