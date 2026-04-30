import type {
  ExternalDeliveryHumanConfirmationTarget,
  ExternalProviderBoundaryResult,
  ExternalProviderBoundaryTarget,
} from "@pocket-cto/domain";
import {
  buildHumanConfirmationEvidenceRef,
  mapProviderEvidenceRef,
} from "./evidence";
import { collectProofRefs, dedupe, mapProviderStatus } from "./helpers";

export function buildProviderBoundaryConfirmationTarget(
  providerBoundary: ExternalProviderBoundaryResult,
): ExternalDeliveryHumanConfirmationTarget {
  const relatedTarget = selectProviderBoundaryTarget(providerBoundary);
  const status = mapProviderStatus(providerBoundary.aggregateStatus);
  const proofRefs = collectProofRefs([
    ...relatedTarget.proofRefs,
    ...relatedTarget.evidenceBasis.refs.map((ref) => ref.proofRef),
    `external-provider-boundary.targets.${relatedTarget.targetKey}.proofPosture`,
  ]);

  return {
    targetKey: "provider-boundary-confirmation-boundary",
    targetFamily: "provider_boundary_confirmation_boundary",
    status,
    evidenceBasis: {
      basisKind: "provider_boundary_posture",
      summary:
        "Human-confirmation provider posture is derived from the shipped F6P internal provider-boundary result only.",
      refs: [
        buildHumanConfirmationEvidenceRef({
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
      "F6S provider-boundary confirmation is internal human-confirmation readiness only; no provider call occurred, no provider credential was created, no provider job was created, and no send occurred.",
      "F6S does not produce provider authorization, credential readiness, provider-job readiness, send readiness, delivery readiness, or send permission.",
      ...providerBoundary.limitations,
      ...relatedTarget.limitations,
    ]),
    proofPosture: relatedTarget.proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_human_confirmation_review"
        ? "Review the F6P internal provider-boundary posture as a future delivery review target before any later external delivery plan."
        : "Resolve the cited F6P provider-boundary posture before human-confirmation review.",
    relatedDeliveryReadinessTargetKey:
      relatedTarget.relatedDeliveryReadinessTargetKey,
    relatedProviderBoundaryTargetKey: relatedTarget.targetKey,
    relatedCertificationBoundaryTargetKey: null,
    relatedReviewSummarySectionKey: relatedTarget.relatedReviewSummarySectionKey,
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
      (target) => target.targetFamily === "delivery_readiness_boundary",
    ) ??
    fallbackTarget
  );
}
