import type {
  DeliveryReadinessResult,
  DeliveryReadinessTarget,
  ExternalProviderBoundaryTarget,
} from "@pocket-cto/domain";
import {
  buildProviderBoundaryEvidenceRef,
  inferSourceRole,
  mapDeliveryEvidenceRef,
} from "./evidence";
import { collectProofRefs, dedupe, mapDeliveryStatus } from "./helpers";

export function buildDeliveryReadinessBoundaryTarget(
  deliveryReadiness: DeliveryReadinessResult,
): ExternalProviderBoundaryTarget {
  const relatedTarget = selectDeliveryReadinessTarget(deliveryReadiness);
  const status = mapDeliveryStatus(deliveryReadiness.aggregateStatus);
  const relatedSourceRole = inferSourceRole(
    relatedTarget.relatedChecklistItemFamily,
  );
  const proofRefs = collectProofRefs([
    `delivery-readiness.targets.${relatedTarget.targetKey}.proofPosture`,
    ...relatedTarget.evidenceBasis.refs.map((ref) => ref.proofRef),
  ]);

  return {
    targetKey: "delivery-readiness-boundary",
    targetFamily: "delivery_readiness_boundary",
    status,
    evidenceBasis: {
      basisKind: "delivery_readiness_posture",
      summary:
        "Provider-boundary delivery posture is derived from the shipped F6M internal delivery-readiness result only.",
      refs: [
        buildProviderBoundaryEvidenceRef({
          kind: "delivery_readiness_result",
          evidencePath: "delivery-readiness.aggregateStatus",
          summary: deliveryReadiness.evidenceSummary,
        }),
        ...relatedTarget.evidenceBasis.refs.map((ref) =>
          mapDeliveryEvidenceRef(ref, {
            deliveryReadinessTargetKey: relatedTarget.targetKey,
          }),
        ),
      ],
    },
    sourceLineageRefs: relatedTarget.sourceLineageRefs,
    sourcePosture: {
      ...relatedTarget.sourcePosture,
      refs: relatedTarget.sourcePosture.refs.map((ref) =>
        mapDeliveryEvidenceRef(ref, {
          deliveryReadinessTargetKey: relatedTarget.targetKey,
        }),
      ),
    },
    freshnessSummary: relatedTarget.freshnessSummary,
    limitations: dedupe([
      "F6P delivery-readiness boundary is internal provider-boundary posture only; no provider call occurred and no send occurred.",
      ...deliveryReadiness.limitations,
      ...relatedTarget.limitations,
    ]),
    proofPosture: relatedTarget.proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_provider_boundary_review"
        ? "Review the F6M internal delivery-readiness posture before any future provider-boundary plan."
        : "Resolve the cited F6M delivery-readiness posture before any future provider-boundary review.",
    relatedDeliveryReadinessTargetKey: relatedTarget.targetKey,
    relatedReviewSummarySectionKey: null,
    relatedMonitorKind: relatedTarget.relatedMonitorKind,
    relatedSourceRole,
  };
}

export function selectDeliveryReadinessTarget(
  deliveryReadiness: DeliveryReadinessResult,
): DeliveryReadinessTarget {
  const fallbackTarget = deliveryReadiness.deliveryReadinessTargets[0];

  if (!fallbackTarget) {
    throw new Error("Delivery-readiness result did not include any targets.");
  }

  return (
    deliveryReadiness.deliveryReadinessTargets.find(
      (target) => target.status === "blocked_by_evidence",
    ) ??
    deliveryReadiness.deliveryReadinessTargets.find(
      (target) => target.status === "needs_review_before_delivery",
    ) ??
    fallbackTarget
  );
}
