import type {
  CloseControlReviewSection,
  CloseControlReviewSummaryResult,
  DeliveryReadinessResult,
  DeliveryReadinessTarget,
  ExternalProviderBoundaryTarget,
  MonitorKind,
} from "@pocket-cto/domain";
import { buildProviderBoundaryEvidenceRef } from "./evidence";
import {
  collectLineageRefs,
  collectProofRefs,
  dedupe,
  mapProofPostureToStatus,
  summarizeProof,
} from "./helpers";

export function buildProofAndLimitationBoundaryTarget(input: {
  deliveryReadiness: DeliveryReadinessResult;
  reviewSummary: CloseControlReviewSummaryResult;
}): ExternalProviderBoundaryTarget {
  const deliveryTargets = input.deliveryReadiness.deliveryReadinessTargets;
  const reviewSections = input.reviewSummary.reviewSections;
  const proofPosture = summarizeProof(
    [
      ...deliveryTargets.map((target) => target.proofPosture),
      ...reviewSections.map((section) => section.proofPosture),
    ],
    "Provider-boundary proof posture is summarized from shipped F6M and F6N proof posture.",
  );
  const status = mapProofPostureToStatus(proofPosture.state);
  const proofRefs = collectProofRefs([
    ...deliveryTargets.flatMap((target) => [
      `delivery-readiness.targets.${target.targetKey}.proofPosture`,
      ...target.evidenceBasis.refs.map((ref) => ref.proofRef),
    ]),
    ...reviewSections.flatMap((section) => [
      `close-control.reviewSummary.sections.${section.sectionKey}.proofPosture`,
      ...section.proofRefs,
      ...section.evidenceBasis.refs.map((ref) => ref.proofRef),
    ]),
  ]);

  return {
    targetKey: "proof-and-limitation-boundary",
    targetFamily: "proof_and_limitation_boundary",
    status,
    evidenceBasis: {
      basisKind: "proof_and_limitation_posture",
      summary:
        "Provider-boundary proof and limitation posture is derived from shipped F6M/F6N proof posture and limitations.",
      refs: proofRefs.map((proofRef) =>
        buildProviderBoundaryEvidenceRef({
          kind: "proof_posture",
          evidencePath: proofRef,
          summary: "Stored upstream proof posture reference.",
          proofRef,
        }),
      ),
    },
    sourceLineageRefs: collectLineageRefs(deliveryTargets, reviewSections),
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
      "Proof posture supports internal provider-boundary review only and is not certification, approval, report release, or delivery permission.",
      ...input.deliveryReadiness.limitations,
      ...input.reviewSummary.limitations,
    ]),
    proofPosture,
    proofRefs,
    humanReviewNextStep:
      status === "ready_for_provider_boundary_review"
        ? "Review proof posture and limitations before any future provider-boundary plan."
        : "Resolve proof limitations before any future provider-boundary review.",
    relatedDeliveryReadinessTargetKey: null,
    relatedReviewSummarySectionKey: null,
    relatedMonitorKind: pickMonitorKind(deliveryTargets, reviewSections),
    relatedSourceRole: null,
  };
}

function pickMonitorKind(
  deliveryTargets: DeliveryReadinessTarget[],
  reviewSections: CloseControlReviewSection[],
): MonitorKind | null {
  return (
    deliveryTargets.find((target) => target.relatedMonitorKind)
      ?.relatedMonitorKind ??
    reviewSections.find((section) => section.relatedMonitorKind)
      ?.relatedMonitorKind ??
    null
  );
}
