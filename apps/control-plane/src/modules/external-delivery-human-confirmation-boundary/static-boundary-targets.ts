import type {
  CloseControlCertificationBoundaryResult,
  CloseControlReviewSummaryResult,
  DeliveryReadinessResult,
  ExternalDeliveryHumanConfirmationEvidenceRef,
  ExternalDeliveryHumanConfirmationTarget,
  ExternalProviderBoundaryResult,
} from "@pocket-cto/domain";
import { buildHumanConfirmationEvidenceRef } from "./evidence";
import { findWorstStatus, hasUnexpectedActionBoundaryValue } from "./helpers";
import { buildCertificationBoundaryConfirmationTarget } from "./certification-targets";
import { buildDeliveryReadinessConfirmationTarget } from "./delivery-targets";
import { buildProviderBoundaryConfirmationTarget } from "./provider-targets";
import { buildReviewSummaryConfirmationTarget } from "./review-summary-targets";

type StaticTargetInput = {
  certificationBoundary: CloseControlCertificationBoundaryResult;
  deliveryReadiness: DeliveryReadinessResult;
  generatedAt: string;
  providerBoundary: ExternalProviderBoundaryResult;
  reviewSummary: CloseControlReviewSummaryResult;
};

export function buildHumanConfirmationAbsenceTarget(
  input: StaticTargetInput,
): ExternalDeliveryHumanConfirmationTarget {
  const actionConflict = hasUnexpectedActionBoundaryValue([
    input.deliveryReadiness.runtimeActionBoundary,
    input.providerBoundary.runtimeActionBoundary,
    input.certificationBoundary.runtimeActionBoundary,
    input.reviewSummary.runtimeActionBoundary,
  ]);
  const upstreamStatus = findWorstStatus([
    buildDeliveryReadinessConfirmationTarget(input.deliveryReadiness).status,
    buildProviderBoundaryConfirmationTarget(input.providerBoundary).status,
    buildCertificationBoundaryConfirmationTarget(input.certificationBoundary)
      .status,
    buildReviewSummaryConfirmationTarget(input.reviewSummary).status,
  ]);
  const status = actionConflict ? "blocked_by_evidence" : upstreamStatus;

  return buildStaticBoundaryTarget({
    targetKey: "human-confirmation-absence-boundary",
    targetFamily: "human_confirmation_absence_boundary",
    status,
    basisKind: "runtime_action_absence_posture",
    evidenceSummary:
      "Human-confirmation absence posture is derived from shipped F6M/F6P/F6Q/F6N absence boundaries and the F6S read path.",
    limitation:
      "F6S creates no delivery, provider call, provider credential, provider job, outbox send, scheduled delivery, auto-send, report, approval, certification, mission, monitor rerun, source mutation, generated prose, finance write, advice, instruction, or autonomous action.",
    humanReviewNextStep: actionConflict
      ? "Resolve the conflicting upstream action boundary before human-confirmation review."
      : "Confirm that no send occurred, no provider call occurred, and no outbox send occurred before any future delivery review target.",
    generatedAt: input.generatedAt,
    refs: [
      buildHumanConfirmationEvidenceRef({
        kind: "absence_boundary",
        evidencePath: "delivery-readiness.runtimeActionBoundary",
        summary: input.deliveryReadiness.runtimeActionBoundary.summary,
      }),
      buildHumanConfirmationEvidenceRef({
        kind: "absence_boundary",
        evidencePath: "external-provider-boundary.runtimeActionBoundary",
        summary: input.providerBoundary.runtimeActionBoundary.summary,
      }),
      buildHumanConfirmationEvidenceRef({
        kind: "absence_boundary",
        evidencePath: "close-control.certificationBoundary.runtimeActionBoundary",
        summary: input.certificationBoundary.runtimeActionBoundary.summary,
      }),
      buildHumanConfirmationEvidenceRef({
        kind: "absence_boundary",
        evidencePath: "close-control.reviewSummary.runtimeActionBoundary",
        summary: input.reviewSummary.runtimeActionBoundary.summary,
      }),
    ],
  });
}

function buildStaticBoundaryTarget(input: {
  basisKind: ExternalDeliveryHumanConfirmationTarget["evidenceBasis"]["basisKind"];
  evidenceSummary: string;
  generatedAt: string;
  humanReviewNextStep: string;
  limitation: string;
  refs: ExternalDeliveryHumanConfirmationEvidenceRef[];
  status: ExternalDeliveryHumanConfirmationTarget["status"];
  targetFamily: ExternalDeliveryHumanConfirmationTarget["targetFamily"];
  targetKey: string;
}): ExternalDeliveryHumanConfirmationTarget {
  return {
    targetKey: input.targetKey,
    targetFamily: input.targetFamily,
    status: input.status,
    evidenceBasis: {
      basisKind: input.basisKind,
      summary: input.evidenceSummary,
      refs: input.refs,
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state: "not_applicable",
      summary:
        "This human-confirmation target is derived from existing read posture and does not create a new source observation.",
      missingSource: false,
      refs: [],
    },
    freshnessSummary: {
      state: "not_applicable",
      summary:
        "This human-confirmation target does not create a new source freshness observation.",
      latestObservedAt: input.generatedAt,
    },
    limitations: [input.limitation],
    proofPosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : input.status === "needs_human_review_before_confirmation"
            ? "review_only_context"
            : "source_backed",
      summary: input.evidenceSummary,
    },
    proofRefs: input.refs
      .map((ref) => ref.proofRef)
      .filter((ref): ref is string => Boolean(ref)),
    humanReviewNextStep: input.humanReviewNextStep,
    relatedDeliveryReadinessTargetKey: null,
    relatedProviderBoundaryTargetKey: null,
    relatedCertificationBoundaryTargetKey: null,
    relatedReviewSummarySectionKey: null,
    relatedMonitorKind: null,
    relatedSourceRole: null,
  };
}
