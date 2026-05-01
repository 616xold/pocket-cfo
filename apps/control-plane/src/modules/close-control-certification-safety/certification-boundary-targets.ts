import type {
  CloseControlCertificationBoundaryResult,
  CloseControlCertificationBoundaryTarget,
  CloseControlCertificationSafetyTarget,
} from "@pocket-cto/domain";
import {
  buildCertificationSafetyEvidenceRef,
  mapCertificationEvidenceRef,
} from "./evidence";
import {
  collectProofRefs,
  dedupe,
  mapCertificationBoundaryStatus,
} from "./helpers";

export function buildCertificationBoundarySafetyTarget(
  certificationBoundary: CloseControlCertificationBoundaryResult,
): CloseControlCertificationSafetyTarget {
  const relatedTarget = selectCertificationBoundaryTarget(
    certificationBoundary,
  );
  const status = mapCertificationBoundaryStatus(
    certificationBoundary.aggregateStatus,
  );
  const proofRefs = collectProofRefs([
    ...relatedTarget.proofRefs,
    ...relatedTarget.evidenceBasis.refs.map((ref) => ref.proofRef),
    `close-control.certificationBoundary.targets.${relatedTarget.targetKey}.proofPosture`,
  ]);

  return {
    targetKey: "certification-boundary-safety",
    targetFamily: "certification_boundary_safety",
    status,
    evidenceBasis: {
      basisKind: "certification_boundary_posture",
      summary:
        "Certification-safety posture is derived from the shipped F6Q internal certification-boundary result only.",
      refs: [
        buildCertificationSafetyEvidenceRef({
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
      "F6T certification-boundary safety is internal certification-safety posture only; no certification occurred and no close complete occurred.",
      "F6T does not convert F6Q readiness into certification, sign-off, attestation, assurance, legal opinion, audit opinion, approval, report release, report circulation, delivery permission, or provider authorization.",
      ...certificationBoundary.limitations,
      ...relatedTarget.limitations,
    ]),
    proofPosture: relatedTarget.proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_certification_safety_review"
        ? "Review the F6Q internal certification-boundary posture before any future certification-safety review target."
        : "Resolve the cited F6Q certification-boundary posture before certification-safety review.",
    relatedCertificationBoundaryTargetKey: relatedTarget.targetKey,
    relatedHumanConfirmationTargetKey: null,
    relatedReviewSummarySectionKey:
      relatedTarget.relatedReviewSummarySectionKey,
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
        target.status === "needs_human_review_before_certification_boundary",
    ) ??
    certificationBoundary.closeControlCertificationBoundaryTargets.find(
      (target) => target.targetFamily === "certification_absence_boundary",
    ) ??
    fallbackTarget
  );
}
