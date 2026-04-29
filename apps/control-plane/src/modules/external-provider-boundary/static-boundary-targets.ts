import type {
  CloseControlReviewSummaryResult,
  DeliveryReadinessResult,
  ExternalProviderBoundaryEvidenceRef,
  ExternalProviderBoundaryTarget,
} from "@pocket-cto/domain";
import { buildProviderBoundaryEvidenceRef } from "./evidence";
import { hasUnexpectedActionBoundaryValue, findWorstStatus } from "./helpers";
import { buildDeliveryReadinessBoundaryTarget } from "./delivery-targets";
import { buildReviewSummaryBoundaryTarget } from "./review-summary-targets";

export function buildHumanReviewGateBoundaryTarget(input: {
  deliveryReadiness: DeliveryReadinessResult;
  generatedAt: string;
  reviewSummary: CloseControlReviewSummaryResult;
}): ExternalProviderBoundaryTarget {
  const status = findWorstStatus([
    buildDeliveryReadinessBoundaryTarget(input.deliveryReadiness).status,
    buildReviewSummaryBoundaryTarget(input.reviewSummary).status,
  ]);

  return buildStaticBoundaryTarget({
    targetKey: "human-review-gate-boundary",
    targetFamily: "human_review_gate_boundary",
    status,
    basisKind: "human_review_gate_posture",
    evidenceSummary:
      "Human review gate posture is derived from F6M aggregate delivery-readiness and F6N aggregate review-summary posture.",
    limitation:
      "Human review gate posture is not an approval, sign-off, certification, close completion, report release, or send permission.",
    humanReviewNextStep:
      status === "ready_for_provider_boundary_review"
        ? "Human operator may review the cited internal posture before any future provider-boundary plan."
        : "Human operator must resolve cited F6M/F6N posture before any future provider-boundary review.",
    generatedAt: input.generatedAt,
    refs: [
      buildProviderBoundaryEvidenceRef({
        kind: "delivery_readiness_result",
        evidencePath: "delivery-readiness.aggregateStatus",
        summary: input.deliveryReadiness.evidenceSummary,
      }),
      buildProviderBoundaryEvidenceRef({
        kind: "review_summary_result",
        evidencePath: "close-control.reviewSummary.aggregateStatus",
        summary: input.reviewSummary.evidenceSummary,
      }),
    ],
  });
}

export function buildOutboxAbsenceBoundaryTarget(input: {
  deliveryReadiness: DeliveryReadinessResult;
  generatedAt: string;
  reviewSummary: CloseControlReviewSummaryResult;
}): ExternalProviderBoundaryTarget {
  const actionConflict = hasUnexpectedActionBoundaryValue([
    input.deliveryReadiness.runtimeActionBoundary,
    input.reviewSummary.runtimeActionBoundary,
  ]);

  return buildStaticBoundaryTarget({
    targetKey: "outbox-absence-boundary",
    targetFamily: "outbox_absence_boundary",
    status: actionConflict
      ? "blocked_by_evidence"
      : "ready_for_provider_boundary_review",
    basisKind: "runtime_action_absence_posture",
    evidenceSummary:
      "Outbox absence posture is derived from shipped F6M/F6N absence boundaries and the F6P read path.",
    limitation:
      "F6P does not read outbox as a provider implementation, does not create outbox send events, and no provider call occurred.",
    humanReviewNextStep: actionConflict
      ? "Resolve the conflicting upstream action boundary before any future provider-boundary review."
      : "Confirm the no-send, no-provider-call, and no-outbox-send posture before any future provider-boundary plan.",
    generatedAt: input.generatedAt,
    refs: [
      buildProviderBoundaryEvidenceRef({
        kind: "absence_boundary",
        evidencePath: "delivery-readiness.runtimeActionBoundary",
        summary: input.deliveryReadiness.runtimeActionBoundary.summary,
      }),
      buildProviderBoundaryEvidenceRef({
        kind: "absence_boundary",
        evidencePath: "close-control.reviewSummary.runtimeActionBoundary",
        summary: input.reviewSummary.runtimeActionBoundary.summary,
      }),
    ],
  });
}

function buildStaticBoundaryTarget(input: {
  basisKind: ExternalProviderBoundaryTarget["evidenceBasis"]["basisKind"];
  evidenceSummary: string;
  generatedAt: string;
  humanReviewNextStep: string;
  limitation: string;
  refs: ExternalProviderBoundaryEvidenceRef[];
  status: ExternalProviderBoundaryTarget["status"];
  targetFamily: ExternalProviderBoundaryTarget["targetFamily"];
  targetKey: string;
}): ExternalProviderBoundaryTarget {
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
        "This provider-boundary target is derived from existing read posture and does not create a new source observation.",
      missingSource: false,
      refs: [],
    },
    freshnessSummary: {
      state: "not_applicable",
      summary:
        "This provider-boundary target does not create a new source freshness observation.",
      latestObservedAt: input.generatedAt,
    },
    limitations: [input.limitation],
    proofPosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : input.status === "needs_human_review_before_provider_boundary"
            ? "review_only_context"
            : "source_backed",
      summary: input.evidenceSummary,
    },
    proofRefs: input.refs
      .map((ref) => ref.proofRef)
      .filter((ref): ref is string => Boolean(ref)),
    humanReviewNextStep: input.humanReviewNextStep,
    relatedDeliveryReadinessTargetKey: null,
    relatedReviewSummarySectionKey: null,
    relatedMonitorKind: null,
    relatedSourceRole: null,
  };
}
