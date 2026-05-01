import type {
  ExternalDeliveryHumanConfirmationBoundaryResult,
  ExternalDeliveryHumanConfirmationTarget,
  CloseControlCertificationSafetyTarget,
} from "@pocket-cto/domain";
import {
  buildCertificationSafetyEvidenceRef,
  mapHumanConfirmationEvidenceRef,
} from "./evidence";
import {
  collectProofRefs,
  dedupe,
  mapHumanConfirmationStatus,
} from "./helpers";

export function buildHumanConfirmationBoundarySafetyTarget(
  humanConfirmation: ExternalDeliveryHumanConfirmationBoundaryResult,
): CloseControlCertificationSafetyTarget {
  const relatedTarget = selectHumanConfirmationTarget(humanConfirmation);
  const status = mapHumanConfirmationStatus(humanConfirmation.aggregateStatus);
  const proofRefs = collectProofRefs([
    ...relatedTarget.proofRefs,
    ...relatedTarget.evidenceBasis.refs.map((ref) => ref.proofRef),
    `external-delivery.humanConfirmationBoundary.targets.${relatedTarget.targetKey}.proofPosture`,
  ]);

  return {
    targetKey: "human-confirmation-boundary-safety",
    targetFamily: "human_confirmation_boundary_safety",
    status,
    evidenceBasis: {
      basisKind: "human_confirmation_boundary_posture",
      summary:
        "Certification-safety human-confirmation posture is derived from the shipped F6S internal delivery-preflight result only.",
      refs: [
        buildCertificationSafetyEvidenceRef({
          kind: "human_confirmation_boundary_result",
          evidencePath:
            "external-delivery.humanConfirmationBoundary.aggregateStatus",
          summary: humanConfirmation.evidenceSummary,
        }),
        ...relatedTarget.evidenceBasis.refs.map((ref) =>
          mapHumanConfirmationEvidenceRef(ref, {
            humanConfirmationTargetKey: relatedTarget.targetKey,
          }),
        ),
      ],
    },
    sourceLineageRefs: relatedTarget.sourceLineageRefs,
    sourcePosture: {
      ...relatedTarget.sourcePosture,
      refs: relatedTarget.sourcePosture.refs.map((ref) =>
        mapHumanConfirmationEvidenceRef(ref, {
          humanConfirmationTargetKey: relatedTarget.targetKey,
        }),
      ),
    },
    freshnessSummary: relatedTarget.freshnessSummary,
    limitations: dedupe([
      "F6T human-confirmation safety carries no-send, no-provider, no-outbox, no-report-release, no-approval, and no-certification posture only.",
      "F6T does not produce send permission, delivery permission, provider authorization, report release, approval, certification, close complete, sign-off, attestation, assurance, legal opinion, or audit opinion.",
      ...humanConfirmation.limitations,
      ...relatedTarget.limitations,
    ]),
    proofPosture: relatedTarget.proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_certification_safety_review"
        ? "Review the F6S internal human-confirmation posture before any future certification-safety review target."
        : "Resolve the cited F6S human-confirmation posture before certification-safety review.",
    relatedCertificationBoundaryTargetKey:
      relatedTarget.relatedCertificationBoundaryTargetKey,
    relatedHumanConfirmationTargetKey: relatedTarget.targetKey,
    relatedReviewSummarySectionKey:
      relatedTarget.relatedReviewSummarySectionKey,
    relatedMonitorKind: relatedTarget.relatedMonitorKind,
    relatedSourceRole: relatedTarget.relatedSourceRole,
  };
}

export function selectHumanConfirmationTarget(
  humanConfirmation: ExternalDeliveryHumanConfirmationBoundaryResult,
): ExternalDeliveryHumanConfirmationTarget {
  const fallbackTarget = humanConfirmation.deliveryGateTargets[0];

  if (!fallbackTarget) {
    throw new Error(
      "External-delivery human-confirmation boundary did not include any targets.",
    );
  }

  return (
    humanConfirmation.deliveryGateTargets.find(
      (target) => target.status === "blocked_by_evidence",
    ) ??
    humanConfirmation.deliveryGateTargets.find(
      (target) => target.status === "needs_human_review_before_confirmation",
    ) ??
    humanConfirmation.deliveryGateTargets.find(
      (target) => target.targetFamily === "human_confirmation_absence_boundary",
    ) ??
    fallbackTarget
  );
}
