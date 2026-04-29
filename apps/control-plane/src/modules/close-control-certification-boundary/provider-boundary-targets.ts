import type {
  CloseControlCertificationBoundaryTarget,
  ExternalProviderBoundaryResult,
  ExternalProviderBoundaryTarget,
} from "@pocket-cto/domain";
import {
  buildCertificationBoundaryEvidenceRef,
  mapProviderEvidenceRef,
} from "./evidence";
import { collectProofRefs, dedupe, mapProviderStatus } from "./helpers";

export function buildProviderBoundaryTarget(
  providerBoundary: ExternalProviderBoundaryResult,
): CloseControlCertificationBoundaryTarget {
  const relatedTarget = selectProviderBoundaryTarget(providerBoundary);
  const status = mapProviderStatus(providerBoundary.aggregateStatus);
  const proofRefs = collectProofRefs([
    ...relatedTarget.proofRefs,
    ...relatedTarget.evidenceBasis.refs.map((ref) => ref.proofRef),
    `external-provider-boundary.targets.${relatedTarget.targetKey}.proofPosture`,
  ]);

  return {
    targetKey: "provider-boundary",
    targetFamily: "provider_boundary",
    status,
    evidenceBasis: {
      basisKind: "provider_boundary_posture",
      summary:
        "Certification-boundary provider posture is derived from the shipped F6P internal external-provider-boundary result only.",
      refs: [
        buildCertificationBoundaryEvidenceRef({
          kind: "provider_boundary_result",
          evidencePath: "external-provider-boundary.aggregateStatus",
          summary: providerBoundary.evidenceSummary,
        }),
        ...relatedTarget.evidenceBasis.refs.map((ref) =>
          mapProviderEvidenceRef(ref, {
            providerBoundaryTargetKey: relatedTarget.targetKey,
          }),
        ),
      ],
    },
    sourceLineageRefs: relatedTarget.sourceLineageRefs,
    sourcePosture: {
      ...relatedTarget.sourcePosture,
      refs: relatedTarget.sourcePosture.refs.map((ref) =>
        mapProviderEvidenceRef(ref, {
          providerBoundaryTargetKey: relatedTarget.targetKey,
        }),
      ),
    },
    freshnessSummary: relatedTarget.freshnessSummary,
    limitations: dedupe([
      "F6Q provider boundary is internal certification-boundary posture only; it does not authorize provider calls, sends, delivery, report release, approval, or certification.",
      ...providerBoundary.limitations,
      ...relatedTarget.limitations,
    ]),
    proofPosture: relatedTarget.proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_certification_boundary_review"
        ? "Review the F6P internal provider-boundary posture before any future certification review target."
        : "Resolve the cited F6P provider-boundary posture before any future certification-boundary review.",
    relatedReviewSummarySectionKey: relatedTarget.relatedReviewSummarySectionKey,
    relatedProviderBoundaryTargetKey: relatedTarget.targetKey,
    relatedMonitorKind: relatedTarget.relatedMonitorKind,
    relatedSourceRole: relatedTarget.relatedSourceRole,
  };
}

export function selectProviderBoundaryTarget(
  providerBoundary: ExternalProviderBoundaryResult,
): ExternalProviderBoundaryTarget {
  const fallbackTarget = providerBoundary.externalProviderBoundaryTargets[0];

  if (!fallbackTarget) {
    throw new Error("External provider boundary did not include any targets.");
  }

  return (
    providerBoundary.externalProviderBoundaryTargets.find(
      (target) => target.status === "blocked_by_evidence",
    ) ??
    providerBoundary.externalProviderBoundaryTargets.find(
      (target) =>
        target.status === "needs_human_review_before_provider_boundary",
    ) ??
    providerBoundary.externalProviderBoundaryTargets.find(
      (target) => target.targetFamily === "review_summary_boundary",
    ) ??
    fallbackTarget
  );
}
