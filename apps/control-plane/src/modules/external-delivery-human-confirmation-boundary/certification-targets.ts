import type {
  CloseControlCertificationBoundaryResult,
  CloseControlCertificationBoundaryTarget,
  ExternalDeliveryHumanConfirmationTarget,
} from "@pocket-cto/domain";
import {
  buildHumanConfirmationEvidenceRef,
  mapCertificationEvidenceRef,
} from "./evidence";
import { collectProofRefs, dedupe, mapCertificationStatus } from "./helpers";

export function buildCertificationBoundaryConfirmationTarget(
  certificationBoundary: CloseControlCertificationBoundaryResult,
): ExternalDeliveryHumanConfirmationTarget {
  const relatedTarget = selectCertificationBoundaryTarget(certificationBoundary);
  const status = mapCertificationStatus(certificationBoundary.aggregateStatus);
  const proofRefs = collectProofRefs([
    ...relatedTarget.proofRefs,
    ...relatedTarget.evidenceBasis.refs.map((ref) => ref.proofRef),
    `close-control.certificationBoundary.targets.${relatedTarget.targetKey}.proofPosture`,
  ]);

  return {
    targetKey: "certification-boundary-confirmation-boundary",
    targetFamily: "certification_boundary_confirmation_boundary",
    status,
    evidenceBasis: {
      basisKind: "certification_boundary_posture",
      summary:
        "Human-confirmation certification posture is derived from the shipped F6Q internal certification-boundary result only.",
      refs: [
        buildHumanConfirmationEvidenceRef({
          kind: "certification_boundary_result",
          evidencePath: "close-control.certificationBoundary.aggregateStatus",
          summary: certificationBoundary.evidenceSummary,
        }),
        ...relatedTarget.evidenceBasis.refs.map((ref) =>
          mapCertificationEvidenceRef(ref, {
            certificationBoundaryTargetKey: relatedTarget.targetKey,
          }),
        ),
      ],
    },
    sourceLineageRefs: relatedTarget.sourceLineageRefs,
    sourcePosture: {
      ...relatedTarget.sourcePosture,
      refs: relatedTarget.sourcePosture.refs.map((ref) =>
        mapCertificationEvidenceRef(ref, {
          certificationBoundaryTargetKey: relatedTarget.targetKey,
        }),
      ),
    },
    freshnessSummary: relatedTarget.freshnessSummary,
    limitations: dedupe([
      "F6S certification-boundary confirmation is internal boundary-review posture only; no certification occurred, no close complete occurred, and no sign-off occurred.",
      "F6S does not produce actual certification, close complete, sign-off, attestation, legal opinion, audit opinion, assurance, approval, report release, report circulation, or delivery permission.",
      ...certificationBoundary.limitations,
      ...relatedTarget.limitations,
    ]),
    proofPosture: relatedTarget.proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_human_confirmation_review"
        ? "Review the F6Q internal certification-boundary posture as a future delivery review target before any later external delivery plan."
        : "Resolve the cited F6Q certification-boundary posture before human-confirmation review.",
    relatedDeliveryReadinessTargetKey: null,
    relatedProviderBoundaryTargetKey: relatedTarget.relatedProviderBoundaryTargetKey,
    relatedCertificationBoundaryTargetKey: relatedTarget.targetKey,
    relatedReviewSummarySectionKey: relatedTarget.relatedReviewSummarySectionKey,
    relatedMonitorKind: relatedTarget.relatedMonitorKind,
    relatedSourceRole: relatedTarget.relatedSourceRole,
  };
}

export function selectCertificationBoundaryTarget(
  certificationBoundary: CloseControlCertificationBoundaryResult,
): CloseControlCertificationBoundaryTarget {
  const fallbackTarget =
    certificationBoundary.closeControlCertificationBoundaryTargets[0];

  if (!fallbackTarget) {
    throw new Error(
      "Close/control certification boundary did not include any targets.",
    );
  }

  return (
    certificationBoundary.closeControlCertificationBoundaryTargets.find(
      (target) => target.status === "blocked_by_evidence",
    ) ??
    certificationBoundary.closeControlCertificationBoundaryTargets.find(
      (target) =>
        target.status ===
        "needs_human_review_before_certification_boundary",
    ) ??
    certificationBoundary.closeControlCertificationBoundaryTargets.find(
      (target) => target.targetFamily === "provider_boundary",
    ) ??
    fallbackTarget
  );
}
