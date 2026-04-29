import type {
  CloseControlCertificationBoundaryTarget,
  CloseControlReviewSection,
  CloseControlReviewSummaryResult,
  ExternalProviderBoundaryResult,
  ExternalProviderBoundaryTarget,
  MonitorKind,
} from "@pocket-cto/domain";
import { buildCertificationBoundaryEvidenceRef } from "./evidence";
import {
  collectLineageRefs,
  collectProofRefs,
  dedupe,
  mapProofPostureToStatus,
  summarizeProof,
} from "./helpers";

export function buildProofAndLimitationBoundaryTarget(input: {
  providerBoundary: ExternalProviderBoundaryResult;
  reviewSummary: CloseControlReviewSummaryResult;
}): CloseControlCertificationBoundaryTarget {
  const reviewSections = input.reviewSummary.reviewSections;
  const providerTargets = input.providerBoundary.externalProviderBoundaryTargets;
  const proofPosture = summarizeProof(
    [
      ...reviewSections.map((section) => section.proofPosture),
      ...providerTargets.map((target) => target.proofPosture),
    ],
    "Certification-boundary proof posture is summarized from shipped F6N and F6P proof posture.",
  );
  const status = mapProofPostureToStatus(proofPosture.state);
  const proofRefs = collectProofRefs([
    ...reviewSections.flatMap((section) => [
      `close-control.reviewSummary.sections.${section.sectionKey}.proofPosture`,
      ...section.proofRefs,
      ...section.evidenceBasis.refs.map((ref) => ref.proofRef),
    ]),
    ...providerTargets.flatMap((target) => [
      `external-provider-boundary.targets.${target.targetKey}.proofPosture`,
      ...target.proofRefs,
      ...target.evidenceBasis.refs.map((ref) => ref.proofRef),
    ]),
  ]);

  return {
    targetKey: "proof-and-limitation-boundary",
    targetFamily: "proof_and_limitation_boundary",
    status,
    evidenceBasis: {
      basisKind: "proof_and_limitation_posture",
      summary:
        "Certification-boundary proof and limitation posture is derived from shipped F6N/F6P proof posture and limitations.",
      refs: proofRefs.map((proofRef) =>
        buildCertificationBoundaryEvidenceRef({
          kind: "proof_posture",
          evidencePath: proofRef,
          summary: "Stored upstream proof posture reference.",
          proofRef,
        }),
      ),
    },
    sourceLineageRefs: collectLineageRefs(reviewSections, providerTargets),
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
      "Proof posture supports internal certification-boundary review only; it is not certification, approval, sign-off, attestation, legal opinion, audit opinion, report release, or delivery permission.",
      ...input.reviewSummary.limitations,
      ...input.providerBoundary.limitations,
    ]),
    proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_certification_boundary_review"
        ? "Review proof posture and limitations before any future certification review target."
        : "Resolve proof limitations before any future certification-boundary review.",
    relatedReviewSummarySectionKey: null,
    relatedProviderBoundaryTargetKey: null,
    relatedMonitorKind: pickMonitorKind(reviewSections, providerTargets),
    relatedSourceRole: null,
  };
}

function pickMonitorKind(
  reviewSections: CloseControlReviewSection[],
  providerTargets: ExternalProviderBoundaryTarget[],
): MonitorKind | null {
  return (
    reviewSections.find((section) => section.relatedMonitorKind)
      ?.relatedMonitorKind ??
    providerTargets.find((target) => target.relatedMonitorKind)
      ?.relatedMonitorKind ??
    null
  );
}
