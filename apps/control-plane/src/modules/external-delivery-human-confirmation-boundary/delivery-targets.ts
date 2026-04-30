import type {
  DeliveryReadinessResult,
  DeliveryReadinessTarget,
  ExternalDeliveryHumanConfirmationTarget,
} from "@pocket-cto/domain";
import {
  buildHumanConfirmationEvidenceRef,
  inferSourceRole,
  mapDeliveryEvidenceRef,
} from "./evidence";
import { collectProofRefs, dedupe, mapDeliveryStatus } from "./helpers";

export function buildDeliveryReadinessConfirmationTarget(
  deliveryReadiness: DeliveryReadinessResult,
): ExternalDeliveryHumanConfirmationTarget {
  const relatedTarget = selectDeliveryReadinessTarget(deliveryReadiness);
  const status = mapDeliveryStatus(deliveryReadiness.aggregateStatus);
  const proofRefs = collectProofRefs([
    `delivery-readiness.targets.${relatedTarget.targetKey}.proofPosture`,
    ...relatedTarget.evidenceBasis.refs.map((ref) => ref.proofRef),
  ]);

  return {
    targetKey: "delivery-readiness-confirmation-boundary",
    targetFamily: "delivery_readiness_confirmation_boundary",
    status,
    evidenceBasis: {
      basisKind: "delivery_readiness_posture",
      summary:
        "Human-confirmation delivery-readiness posture is derived from the shipped F6M internal delivery-readiness result only.",
      refs: [
        buildHumanConfirmationEvidenceRef({
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
      "F6S delivery-readiness confirmation is internal human-confirmation readiness only; no send occurred, no provider call occurred, and no outbox send occurred.",
      "F6S does not convert F6M delivery-readiness posture into send permission, provider readiness, delivery-ready posture, scheduling posture, or delivery authorization.",
      ...deliveryReadiness.limitations,
      ...relatedTarget.limitations,
    ]),
    proofPosture: relatedTarget.proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_human_confirmation_review"
        ? "Review the F6M internal delivery-readiness posture as a future delivery review target before any later external delivery plan."
        : "Resolve the cited F6M delivery-readiness posture before human-confirmation review.",
    relatedDeliveryReadinessTargetKey: relatedTarget.targetKey,
    relatedProviderBoundaryTargetKey: null,
    relatedCertificationBoundaryTargetKey: null,
    relatedReviewSummarySectionKey: null,
    relatedMonitorKind: relatedTarget.relatedMonitorKind,
    relatedSourceRole: inferSourceRole(relatedTarget.relatedChecklistItemFamily),
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
