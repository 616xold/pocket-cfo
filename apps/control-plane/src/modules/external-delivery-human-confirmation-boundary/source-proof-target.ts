import type {
  CloseControlCertificationBoundaryResult,
  CloseControlCertificationBoundaryTarget,
  CloseControlReviewSection,
  CloseControlReviewSummaryResult,
  DeliveryReadinessResult,
  DeliveryReadinessTarget,
  ExternalDeliveryHumanConfirmationEvidenceRef,
  ExternalDeliveryHumanConfirmationTarget,
  ExternalProviderBoundaryResult,
  ExternalProviderBoundaryTarget,
  MonitorKind,
} from "@pocket-cto/domain";
import {
  inferSourceRole,
  mapCertificationEvidenceRef,
  mapDeliveryEvidenceRef,
  mapProviderEvidenceRef,
  mapReviewEvidenceRef,
} from "./evidence";
import {
  collectLineageRefs,
  collectProofRefs,
  dedupe,
  findWorstSourceState,
  mapSourceProofPostureToStatus,
  summarizeFreshness,
  summarizeProof,
} from "./helpers";

type SourceProofInput = {
  certificationBoundary: CloseControlCertificationBoundaryResult;
  deliveryReadiness: DeliveryReadinessResult;
  providerBoundary: ExternalProviderBoundaryResult;
  reviewSummary: CloseControlReviewSummaryResult;
};

export function buildSourceProofConfirmationTarget(
  input: SourceProofInput,
): ExternalDeliveryHumanConfirmationTarget {
  const deliveryTargets = input.deliveryReadiness.deliveryReadinessTargets;
  const providerTargets = input.providerBoundary.externalProviderBoundaryTargets;
  const certificationTargets =
    input.certificationBoundary.closeControlCertificationBoundaryTargets;
  const reviewSections = input.reviewSummary.reviewSections;
  const sourceState = findWorstSourceState([
    ...deliveryTargets.map((target) => target.sourcePosture.state),
    ...providerTargets.map((target) => target.sourcePosture.state),
    ...certificationTargets.map((target) => target.sourcePosture.state),
    ...reviewSections.map((section) => section.sourcePosture.state),
  ]);
  const freshnessSummary = summarizeFreshness(
    [
      ...deliveryTargets.map((target) => target.freshnessSummary),
      ...providerTargets.map((target) => target.freshnessSummary),
      ...certificationTargets.map((target) => target.freshnessSummary),
      ...reviewSections.map((section) => section.freshnessSummary),
    ],
    "Human-confirmation source freshness is summarized from shipped F6M, F6P, F6Q, and F6N source/freshness posture.",
  );
  const proofPosture = summarizeProof(
    [
      ...deliveryTargets.map((target) => target.proofPosture),
      ...providerTargets.map((target) => target.proofPosture),
      ...certificationTargets.map((target) => target.proofPosture),
      ...reviewSections.map((section) => section.proofPosture),
    ],
    "Human-confirmation proof posture is summarized from shipped F6M, F6P, F6Q, and F6N proof posture.",
  );
  const status = mapSourceProofPostureToStatus({
    freshnessState: freshnessSummary.state,
    proofState: proofPosture.state,
    sourceState,
  });
  const refs = collectSourceRefs({
    certificationTargets,
    deliveryTargets,
    providerTargets,
    reviewSections,
  });
  const proofRefs = collectSourceProofRefs({
    certificationTargets,
    deliveryTargets,
    providerTargets,
    reviewSections,
  });
  const related = selectRelatedSourcePosture({
    certificationTargets,
    deliveryTargets,
    providerTargets,
    reviewSections,
  });

  return {
    targetKey: "source-freshness-and-proof-boundary",
    targetFamily: "source_freshness_and_proof_boundary",
    status,
    evidenceBasis: {
      basisKind: "source_freshness_and_proof_posture",
      summary:
        "Human-confirmation source/proof posture is carried from shipped F6M/F6P/F6Q/F6N posture only.",
      refs,
    },
    sourceLineageRefs: collectLineageRefs([
      ...deliveryTargets,
      ...providerTargets,
      ...certificationTargets,
      ...reviewSections,
    ]),
    sourcePosture: {
      state: sourceState,
      summary:
        status === "ready_for_human_confirmation_review"
          ? "Shipped F6M/F6P/F6Q/F6N source and proof posture is sufficient for internal human-confirmation review."
          : "Shipped F6M/F6P/F6Q/F6N source or proof posture requires human review before confirmation.",
      missingSource:
        sourceState === "missing_source" ||
        sourceState === "monitor_context_missing",
      refs,
    },
    freshnessSummary,
    limitations: dedupe([
      "Source/freshness/proof posture is inherited from shipped read models and does not mutate raw sources.",
      "F6S does not read reports, approvals, generic chat, runtime-Codex output, generated prose, provider state, credentials, jobs, outbox jobs, or external communication state as primary input.",
      ...input.deliveryReadiness.limitations,
      ...input.providerBoundary.limitations,
      ...input.certificationBoundary.limitations,
      ...input.reviewSummary.limitations,
    ]),
    proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_human_confirmation_review"
        ? "Review the source freshness, limitations, and proof posture before any future delivery review target."
        : "Resolve missing, stale, failed, limited, or conflicting source/proof posture before human-confirmation review.",
    relatedDeliveryReadinessTargetKey: related.deliveryTarget?.targetKey ?? null,
    relatedProviderBoundaryTargetKey: related.providerTarget?.targetKey ?? null,
    relatedCertificationBoundaryTargetKey:
      related.certificationTarget?.targetKey ?? null,
    relatedReviewSummarySectionKey: related.reviewSection?.sectionKey ?? null,
    relatedMonitorKind: pickMonitorKind(related),
    relatedSourceRole: pickSourceRole(refs, related),
  };
}

function collectSourceRefs(input: {
  certificationTargets: CloseControlCertificationBoundaryTarget[];
  deliveryTargets: DeliveryReadinessTarget[];
  providerTargets: ExternalProviderBoundaryTarget[];
  reviewSections: CloseControlReviewSection[];
}) {
  return [
    ...input.deliveryTargets.flatMap((target) =>
      target.sourcePosture.refs.map((ref) =>
        mapDeliveryEvidenceRef(ref, {
          deliveryReadinessTargetKey: target.targetKey,
        }),
      ),
    ),
    ...input.providerTargets.flatMap((target) =>
      target.sourcePosture.refs.map((ref) =>
        mapProviderEvidenceRef(ref, {
          providerBoundaryTargetKey: target.targetKey,
        }),
      ),
    ),
    ...input.certificationTargets.flatMap((target) =>
      target.sourcePosture.refs.map((ref) =>
        mapCertificationEvidenceRef(ref, {
          certificationBoundaryTargetKey: target.targetKey,
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

function collectSourceProofRefs(input: {
  certificationTargets: CloseControlCertificationBoundaryTarget[];
  deliveryTargets: DeliveryReadinessTarget[];
  providerTargets: ExternalProviderBoundaryTarget[];
  reviewSections: CloseControlReviewSection[];
}) {
  return collectProofRefs([
    ...input.deliveryTargets.flatMap((target) => [
      `delivery-readiness.targets.${target.targetKey}.proofPosture`,
      ...target.evidenceBasis.refs.map((ref) => ref.proofRef),
    ]),
    ...input.providerTargets.flatMap((target) => [
      `external-provider-boundary.targets.${target.targetKey}.proofPosture`,
      ...target.proofRefs,
      ...target.evidenceBasis.refs.map((ref) => ref.proofRef),
    ]),
    ...input.certificationTargets.flatMap((target) => [
      `close-control.certificationBoundary.targets.${target.targetKey}.proofPosture`,
      ...target.proofRefs,
      ...target.evidenceBasis.refs.map((ref) => ref.proofRef),
    ]),
    ...input.reviewSections.flatMap((section) => [
      `close-control.reviewSummary.sections.${section.sectionKey}.proofPosture`,
      ...section.proofRefs,
      ...section.evidenceBasis.refs.map((ref) => ref.proofRef),
    ]),
  ]);
}

function selectRelatedSourcePosture(input: {
  certificationTargets: CloseControlCertificationBoundaryTarget[];
  deliveryTargets: DeliveryReadinessTarget[];
  providerTargets: ExternalProviderBoundaryTarget[];
  reviewSections: CloseControlReviewSection[];
}) {
  return {
    deliveryTarget: selectSourceTarget(input.deliveryTargets),
    providerTarget: selectSourceTarget(input.providerTargets),
    certificationTarget: selectSourceTarget(input.certificationTargets),
    reviewSection: selectSourceTarget(input.reviewSections),
  };
}

function selectSourceTarget<T extends { sourcePosture: { missingSource: boolean; state: string } }>(
  values: T[],
) {
  return (
    values.find((value) => value.sourcePosture.missingSource) ??
    values.find((value) => value.sourcePosture.state !== "source_backed") ??
    values[0] ??
    null
  );
}

function pickMonitorKind(input: {
  certificationTarget: CloseControlCertificationBoundaryTarget | null;
  deliveryTarget: DeliveryReadinessTarget | null;
  providerTarget: ExternalProviderBoundaryTarget | null;
  reviewSection: CloseControlReviewSection | null;
}): MonitorKind | null {
  return (
    input.deliveryTarget?.relatedMonitorKind ??
    input.providerTarget?.relatedMonitorKind ??
    input.certificationTarget?.relatedMonitorKind ??
    input.reviewSection?.relatedMonitorKind ??
    null
  );
}

function pickSourceRole(
  refs: ExternalDeliveryHumanConfirmationEvidenceRef[],
  input: {
    certificationTarget: CloseControlCertificationBoundaryTarget | null;
    deliveryTarget: DeliveryReadinessTarget | null;
    providerTarget: ExternalProviderBoundaryTarget | null;
    reviewSection: CloseControlReviewSection | null;
  },
) {
  return (
    inferSourceRole(input.deliveryTarget?.relatedChecklistItemFamily) ??
    input.providerTarget?.relatedSourceRole ??
    input.certificationTarget?.relatedSourceRole ??
    inferSourceRole(input.reviewSection?.relatedChecklistItemFamily) ??
    refs.find((ref) => ref.relatedSourceRole)?.relatedSourceRole ??
    null
  );
}
