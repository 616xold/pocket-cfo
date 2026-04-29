import type {
  CloseControlReviewSection,
  CloseControlReviewSummaryResult,
  DeliveryReadinessResult,
  DeliveryReadinessTarget,
  ExternalProviderBoundaryEvidenceRef,
  ExternalProviderBoundaryTarget,
} from "@pocket-cto/domain";
import {
  inferSourceRole,
  mapDeliveryEvidenceRef,
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

export function buildSourceFreshnessBoundaryTarget(input: {
  deliveryReadiness: DeliveryReadinessResult;
  generatedAt: string;
  reviewSummary: CloseControlReviewSummaryResult;
}): ExternalProviderBoundaryTarget {
  const deliveryTargets = input.deliveryReadiness.deliveryReadinessTargets;
  const reviewSections = input.reviewSummary.reviewSections;
  const sourceState = findWorstSourceState([
    ...deliveryTargets.map((target) => target.sourcePosture.state),
    ...reviewSections.map((section) => section.sourcePosture.state),
  ]);
  const freshnessSummary = summarizeFreshness(
    [
      ...deliveryTargets.map((target) => target.freshnessSummary),
      ...reviewSections.map((section) => section.freshnessSummary),
    ],
    "Provider-boundary source freshness is summarized from shipped F6M and F6N source/freshness posture.",
  );
  const refs = collectSourceRefs(deliveryTargets, reviewSections);
  const relatedDeliveryTarget =
    selectRelevantDeliverySourceTarget(deliveryTargets);
  const relatedReviewSection =
    selectRelevantReviewSourceSection(reviewSections);
  const status = mapSourcePostureToStatus(sourceState, freshnessSummary.state);

  return {
    targetKey: "source-freshness-boundary",
    targetFamily: "source_freshness_boundary",
    status,
    evidenceBasis: {
      basisKind: "source_freshness_posture",
      summary:
        "Provider-boundary source freshness is carried from shipped F6M/F6N source and missing-source posture.",
      refs,
    },
    sourceLineageRefs: collectLineageRefs(deliveryTargets, reviewSections),
    sourcePosture: {
      state: sourceState,
      summary:
        status === "ready_for_provider_boundary_review"
          ? "Shipped F6M/F6N source posture is sufficient for internal provider-boundary review."
          : "Shipped F6M/F6N source posture requires human review before any future provider-boundary work.",
      missingSource:
        sourceState === "missing_source" ||
        sourceState === "monitor_context_missing",
      refs,
    },
    freshnessSummary,
    limitations: dedupe([
      "Source/freshness posture is inherited from shipped F6M/F6N read models and does not mutate raw sources.",
      ...input.deliveryReadiness.limitations,
      ...input.reviewSummary.limitations,
    ]),
    proofPosture: summarizeProof(
      [
        ...deliveryTargets.map((target) => target.proofPosture),
        ...reviewSections.map((section) => section.proofPosture),
      ],
      "Provider-boundary source proof posture is summarized from shipped F6M/F6N proof posture.",
    ),
    proofRefs: collectProofRefs([
      ...deliveryTargets.flatMap((target) =>
        target.evidenceBasis.refs.map((ref) => ref.proofRef),
      ),
      ...reviewSections.flatMap((section) => section.proofRefs),
    ]),
    humanReviewNextStep:
      status === "ready_for_provider_boundary_review"
        ? "Review source/freshness posture before any future provider-boundary plan."
        : "Resolve missing, stale, failed, or limited source posture before any future provider-boundary review.",
    relatedDeliveryReadinessTargetKey: relatedDeliveryTarget?.targetKey ?? null,
    relatedReviewSummarySectionKey: relatedReviewSection?.sectionKey ?? null,
    relatedMonitorKind:
      relatedDeliveryTarget?.relatedMonitorKind ??
      relatedReviewSection?.relatedMonitorKind ??
      null,
    relatedSourceRole: pickRelatedSourceRole(refs, [
      inferSourceRole(relatedDeliveryTarget?.relatedChecklistItemFamily),
      inferSourceRole(relatedReviewSection?.relatedChecklistItemFamily),
    ]),
  };
}

function collectSourceRefs(
  deliveryTargets: DeliveryReadinessTarget[],
  reviewSections: CloseControlReviewSection[],
) {
  return [
    ...deliveryTargets.flatMap((target) =>
      target.sourcePosture.refs.map((ref) =>
        mapDeliveryEvidenceRef(ref, {
          deliveryReadinessTargetKey: target.targetKey,
        }),
      ),
    ),
    ...reviewSections.flatMap((section) =>
      section.sourcePosture.refs.map((ref) =>
        mapReviewEvidenceRef(ref, {
          reviewSummarySectionKey: section.sectionKey,
        }),
      ),
    ),
  ];
}

function selectRelevantDeliverySourceTarget(
  targets: DeliveryReadinessTarget[],
) {
  return (
    targets.find((target) => target.sourcePosture.missingSource) ??
    targets.find((target) => target.sourcePosture.state !== "source_backed") ??
    targets.find((target) => target.relatedChecklistItemFamily) ??
    targets[0]
  );
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

function pickRelatedSourceRole(
  refs: ExternalProviderBoundaryEvidenceRef[],
  candidates: Array<string | null>,
) {
  return (
    candidates.find((candidate): candidate is string => Boolean(candidate)) ??
    refs.find((ref) => ref.relatedSourceRole)?.relatedSourceRole ??
    null
  );
}
