import type {
  CloseControlCertificationBoundaryResult,
  CloseControlCertificationBoundaryTarget,
  CloseControlCertificationSafetyTarget,
  CloseControlReviewSection,
  CloseControlReviewSummaryResult,
  ExternalDeliveryHumanConfirmationBoundaryResult,
  ExternalDeliveryHumanConfirmationTarget,
  MonitorKind,
} from "@pocket-cto/domain";
import { buildCertificationSafetyEvidenceRef } from "./evidence";
import {
  collectLineageRefs,
  collectProofRefs,
  dedupe,
  mapProofPostureToStatus,
  summarizeProof,
} from "./helpers";

type ProofInput = {
  certificationBoundary: CloseControlCertificationBoundaryResult;
  humanConfirmation: ExternalDeliveryHumanConfirmationBoundaryResult;
  reviewSummary: CloseControlReviewSummaryResult;
};

export function buildProofAndLimitationSafetyTarget(
  input: ProofInput,
): CloseControlCertificationSafetyTarget {
  const certificationTargets =
    input.certificationBoundary.closeControlCertificationBoundaryTargets;
  const humanTargets = input.humanConfirmation.deliveryGateTargets;
  const reviewSections = input.reviewSummary.reviewSections;
  const proofPosture = summarizeProof(
    [
      ...certificationTargets.map((target) => target.proofPosture),
      ...humanTargets.map((target) => target.proofPosture),
      ...reviewSections.map((section) => section.proofPosture),
    ],
    "Certification-safety proof posture is summarized from shipped F6Q, F6S, and F6N proof posture.",
  );
  const status = mapProofPostureToStatus(proofPosture.state);
  const proofRefs = collectProofRefs([
    ...certificationTargets.flatMap((target) => [
      `close-control.certificationBoundary.targets.${target.targetKey}.proofPosture`,
      ...target.proofRefs,
      ...target.evidenceBasis.refs.map((ref) => ref.proofRef),
    ]),
    ...humanTargets.flatMap((target) => [
      `external-delivery.humanConfirmationBoundary.targets.${target.targetKey}.proofPosture`,
      ...target.proofRefs,
      ...target.evidenceBasis.refs.map((ref) => ref.proofRef),
    ]),
    ...reviewSections.flatMap((section) => [
      `close-control.reviewSummary.sections.${section.sectionKey}.proofPosture`,
      ...section.proofRefs,
      ...section.evidenceBasis.refs.map((ref) => ref.proofRef),
    ]),
  ]);

  return {
    targetKey: "proof-and-limitation-safety",
    targetFamily: "proof_and_limitation_safety",
    status,
    evidenceBasis: {
      basisKind: "proof_and_limitation_posture",
      summary:
        "Certification-safety proof and limitation posture is derived from shipped F6Q/F6S/F6N proof posture and limitations.",
      refs: proofRefs.map((proofRef) =>
        buildCertificationSafetyEvidenceRef({
          kind: "proof_posture",
          evidencePath: proofRef,
          summary: "Stored upstream proof posture reference.",
          proofRef,
        }),
      ),
    },
    sourceLineageRefs: collectLineageRefs([
      ...certificationTargets,
      ...humanTargets,
      ...reviewSections,
    ]),
    sourcePosture: {
      state: "not_applicable",
      summary:
        "Proof and limitation posture is a derived review boundary over already-carried source posture.",
      missingSource: false,
      refs: [],
    },
    freshnessSummary: {
      state: "not_applicable",
      summary:
        "Proof and limitation posture does not create a new source freshness observation.",
      latestObservedAt: null,
    },
    limitations: dedupe([
      "Proof posture supports internal certification-safety review only; it is not certification, approval, sign-off, attestation, assurance, legal opinion, audit opinion, report release, or delivery permission.",
      ...input.certificationBoundary.limitations,
      ...input.humanConfirmation.limitations,
      ...input.reviewSummary.limitations,
    ]),
    proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_certification_safety_review"
        ? "Review proof posture and limitations before any future certification-safety review target."
        : "Resolve proof limitations before certification-safety review.",
    relatedCertificationBoundaryTargetKey: null,
    relatedHumanConfirmationTargetKey: null,
    relatedReviewSummarySectionKey: null,
    relatedMonitorKind: pickMonitorKind({
      certificationTargets,
      humanTargets,
      reviewSections,
    }),
    relatedSourceRole: null,
  };
}

function pickMonitorKind(input: {
  certificationTargets: CloseControlCertificationBoundaryTarget[];
  humanTargets: ExternalDeliveryHumanConfirmationTarget[];
  reviewSections: CloseControlReviewSection[];
}): MonitorKind | null {
  return (
    input.certificationTargets.find((target) => target.relatedMonitorKind)
      ?.relatedMonitorKind ??
    input.humanTargets.find((target) => target.relatedMonitorKind)
      ?.relatedMonitorKind ??
    input.reviewSections.find((section) => section.relatedMonitorKind)
      ?.relatedMonitorKind ??
    null
  );
}
