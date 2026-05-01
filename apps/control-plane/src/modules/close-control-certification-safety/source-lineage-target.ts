import type {
  CloseControlCertificationBoundaryResult,
  CloseControlCertificationBoundaryTarget,
  CloseControlCertificationSafetyEvidenceRef,
  CloseControlCertificationSafetyTarget,
  CloseControlReviewSection,
  CloseControlReviewSummaryResult,
  ExternalDeliveryHumanConfirmationBoundaryResult,
  ExternalDeliveryHumanConfirmationTarget,
} from "@pocket-cto/domain";
import {
  inferSourceRole,
  mapCertificationEvidenceRef,
  mapHumanConfirmationEvidenceRef,
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

type SourceLineageInput = {
  certificationBoundary: CloseControlCertificationBoundaryResult;
  humanConfirmation: ExternalDeliveryHumanConfirmationBoundaryResult;
  reviewSummary: CloseControlReviewSummaryResult;
};

export function buildSourceLineageSafetyTarget(
  input: SourceLineageInput,
): CloseControlCertificationSafetyTarget {
  const certificationTargets =
    input.certificationBoundary.closeControlCertificationBoundaryTargets;
  const humanTargets = input.humanConfirmation.deliveryGateTargets;
  const reviewSections = input.reviewSummary.reviewSections;
  const sourceState = findWorstSourceState([
    ...certificationTargets.map((target) => target.sourcePosture.state),
    ...humanTargets.map((target) => target.sourcePosture.state),
    ...reviewSections.map((section) => section.sourcePosture.state),
  ]);
  const freshnessSummary = summarizeFreshness(
    [
      ...certificationTargets.map((target) => target.freshnessSummary),
      ...humanTargets.map((target) => target.freshnessSummary),
      ...reviewSections.map((section) => section.freshnessSummary),
    ],
    "Certification-safety source freshness is summarized from shipped F6Q, F6S, and F6N source/freshness posture.",
  );
  const refs = collectSourceRefs({
    certificationTargets,
    humanTargets,
    reviewSections,
  });
  const related = selectRelatedSourcePosture({
    certificationTargets,
    humanTargets,
    reviewSections,
  });
  const status = mapSourcePostureToStatus(sourceState, freshnessSummary.state);

  return {
    targetKey: "source-freshness-and-lineage-safety",
    targetFamily: "source_freshness_and_lineage_safety",
    status,
    evidenceBasis: {
      basisKind: "source_freshness_and_lineage_posture",
      summary:
        "Certification-safety source/freshness/lineage posture is carried from shipped F6Q/F6S/F6N posture only.",
      refs,
    },
    sourceLineageRefs: collectLineageRefs([
      ...certificationTargets,
      ...humanTargets,
      ...reviewSections,
    ]),
    sourcePosture: {
      state: sourceState,
      summary:
        status === "ready_for_certification_safety_review"
          ? "Shipped F6Q/F6S/F6N source posture is sufficient for internal certification-safety review."
          : "Shipped F6Q/F6S/F6N source posture requires human review before certification-safety review.",
      missingSource:
        sourceState === "missing_source" ||
        sourceState === "monitor_context_missing",
      refs,
    },
    freshnessSummary,
    limitations: dedupe([
      "Source/freshness/lineage posture is inherited from shipped read models and does not mutate raw sources.",
      "F6T does not read report artifacts, approvals, generic chat, runtime-Codex output, generated prose, provider state, credentials, jobs, outbox jobs, or external communication state as primary input.",
      ...input.certificationBoundary.limitations,
      ...input.humanConfirmation.limitations,
      ...input.reviewSummary.limitations,
    ]),
    proofPosture: summarizeProof(
      [
        ...certificationTargets.map((target) => target.proofPosture),
        ...humanTargets.map((target) => target.proofPosture),
        ...reviewSections.map((section) => section.proofPosture),
      ],
      "Certification-safety source proof posture is summarized from shipped F6Q/F6S/F6N proof posture.",
    ),
    proofRefs: collectProofRefs([
      ...certificationTargets.flatMap((target) => target.proofRefs),
      ...humanTargets.flatMap((target) => target.proofRefs),
      ...reviewSections.flatMap((section) => section.proofRefs),
    ]),
    humanReviewNextStep:
      status === "ready_for_certification_safety_review"
        ? "Review source/freshness/lineage posture before any future certification-safety review target."
        : "Resolve missing, stale, failed, or limited source posture before certification-safety review.",
    relatedCertificationBoundaryTargetKey:
      related.certificationTarget?.targetKey ?? null,
    relatedHumanConfirmationTargetKey: related.humanTarget?.targetKey ?? null,
    relatedReviewSummarySectionKey: related.reviewSection?.sectionKey ?? null,
    relatedMonitorKind:
      related.certificationTarget?.relatedMonitorKind ??
      related.humanTarget?.relatedMonitorKind ??
      related.reviewSection?.relatedMonitorKind ??
      null,
    relatedSourceRole: pickSourceRole(refs, related),
  };
}

function collectSourceRefs(input: {
  certificationTargets: CloseControlCertificationBoundaryTarget[];
  humanTargets: ExternalDeliveryHumanConfirmationTarget[];
  reviewSections: CloseControlReviewSection[];
}) {
  return [
    ...input.certificationTargets.flatMap((target) =>
      target.sourcePosture.refs.map((ref) =>
        mapCertificationEvidenceRef(ref, {
          certificationBoundaryTargetKey: target.targetKey,
        }),
      ),
    ),
    ...input.humanTargets.flatMap((target) =>
      target.sourcePosture.refs.map((ref) =>
        mapHumanConfirmationEvidenceRef(ref, {
          humanConfirmationTargetKey: target.targetKey,
        }),
      ),
    ),
    ...input.reviewSections.flatMap((section) =>
      section.sourcePosture.refs.map((ref) =>
        mapReviewEvidenceRef(ref, {
          reviewSummarySectionKey: section.sectionKey,
        }),
      ),
    ),
  ];
}

function selectRelatedSourcePosture(input: {
  certificationTargets: CloseControlCertificationBoundaryTarget[];
  humanTargets: ExternalDeliveryHumanConfirmationTarget[];
  reviewSections: CloseControlReviewSection[];
}) {
  return {
    certificationTarget: selectSourceTarget(input.certificationTargets),
    humanTarget: selectSourceTarget(input.humanTargets),
    reviewSection: selectSourceTarget(input.reviewSections),
  };
}

function selectSourceTarget<
  T extends { sourcePosture: { missingSource: boolean; state: string } },
>(values: T[]) {
  return (
    values.find((value) => value.sourcePosture.missingSource) ??
    values.find((value) => value.sourcePosture.state !== "source_backed") ??
    values[0] ??
    null
  );
}

function pickSourceRole(
  refs: CloseControlCertificationSafetyEvidenceRef[],
  input: {
    certificationTarget: CloseControlCertificationBoundaryTarget | null;
    humanTarget: ExternalDeliveryHumanConfirmationTarget | null;
    reviewSection: CloseControlReviewSection | null;
  },
) {
  return (
    input.certificationTarget?.relatedSourceRole ??
    input.humanTarget?.relatedSourceRole ??
    inferSourceRole(input.reviewSection?.relatedChecklistItemFamily) ??
    refs.find((ref) => ref.relatedSourceRole)?.relatedSourceRole ??
    null
  );
}
