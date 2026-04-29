import type {
  CloseControlCertificationBoundaryEvidenceRef,
  CloseControlCertificationBoundaryTarget,
  CloseControlReviewSummaryResult,
  ExternalProviderBoundaryResult,
} from "@pocket-cto/domain";
import { buildCertificationBoundaryEvidenceRef } from "./evidence";
import { buildProviderBoundaryTarget } from "./provider-boundary-targets";
import { buildReviewSummaryBoundaryTarget } from "./review-summary-targets";
import { findWorstStatus, hasUnexpectedActionBoundaryValue } from "./helpers";

export function buildHumanReviewGateBoundaryTarget(input: {
  generatedAt: string;
  providerBoundary: ExternalProviderBoundaryResult;
  reviewSummary: CloseControlReviewSummaryResult;
}): CloseControlCertificationBoundaryTarget {
  const status = findWorstStatus([
    buildReviewSummaryBoundaryTarget(input.reviewSummary).status,
    buildProviderBoundaryTarget(input.providerBoundary).status,
  ]);

  return buildStaticBoundaryTarget({
    targetKey: "human-review-gate-boundary",
    targetFamily: "human_review_gate_boundary",
    status,
    basisKind: "human_review_gate_posture",
    evidenceSummary:
      "Human review gate posture is derived from F6N aggregate review-summary and F6P aggregate provider-boundary posture.",
    limitation:
      "Human review gate posture is not certification, close complete, sign-off, attestation, legal opinion, audit opinion, approval, report release, or delivery permission.",
    humanReviewNextStep:
      status === "ready_for_certification_boundary_review"
        ? "Human operator may review the cited internal posture before any future certification review target."
        : "Human operator must resolve cited F6N/F6P posture before any future certification-boundary review.",
    generatedAt: input.generatedAt,
    refs: [
      buildCertificationBoundaryEvidenceRef({
        kind: "review_summary_result",
        evidencePath: "close-control.reviewSummary.aggregateStatus",
        summary: input.reviewSummary.evidenceSummary,
      }),
      buildCertificationBoundaryEvidenceRef({
        kind: "provider_boundary_result",
        evidencePath: "external-provider-boundary.aggregateStatus",
        summary: input.providerBoundary.evidenceSummary,
      }),
    ],
  });
}

export function buildCertificationAbsenceBoundaryTarget(input: {
  generatedAt: string;
  providerBoundary: ExternalProviderBoundaryResult;
  reviewSummary: CloseControlReviewSummaryResult;
}): CloseControlCertificationBoundaryTarget {
  const actionConflict = hasUnexpectedActionBoundaryValue([
    input.reviewSummary.runtimeActionBoundary,
    input.providerBoundary.runtimeActionBoundary,
  ]);

  return buildStaticBoundaryTarget({
    targetKey: "certification-absence-boundary",
    targetFamily: "certification_absence_boundary",
    status: actionConflict
      ? "blocked_by_evidence"
      : "ready_for_certification_boundary_review",
    basisKind: "runtime_action_absence_posture",
    evidenceSummary:
      "Certification absence posture is derived from shipped F6N/F6P absence boundaries and the F6Q read path.",
    limitation:
      "F6Q creates no certification record, no close-complete status, no sign-off, no attestation, no legal opinion, no audit opinion, no approval, no report release, no delivery, no provider call, and no outbox send.",
    humanReviewNextStep: actionConflict
      ? "Resolve the conflicting upstream action boundary before any future certification-boundary review."
      : "Confirm that no certification occurred and no close complete occurred before any future certification review target.",
    generatedAt: input.generatedAt,
    refs: [
      buildCertificationBoundaryEvidenceRef({
        kind: "absence_boundary",
        evidencePath: "close-control.reviewSummary.runtimeActionBoundary",
        summary: input.reviewSummary.runtimeActionBoundary.summary,
      }),
      buildCertificationBoundaryEvidenceRef({
        kind: "absence_boundary",
        evidencePath: "external-provider-boundary.runtimeActionBoundary",
        summary: input.providerBoundary.runtimeActionBoundary.summary,
      }),
    ],
  });
}

function buildStaticBoundaryTarget(input: {
  basisKind: CloseControlCertificationBoundaryTarget["evidenceBasis"]["basisKind"];
  evidenceSummary: string;
  generatedAt: string;
  humanReviewNextStep: string;
  limitation: string;
  refs: CloseControlCertificationBoundaryEvidenceRef[];
  status: CloseControlCertificationBoundaryTarget["status"];
  targetFamily: CloseControlCertificationBoundaryTarget["targetFamily"];
  targetKey: string;
}): CloseControlCertificationBoundaryTarget {
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
        "This certification-boundary target is derived from existing read posture and does not create a new source observation.",
      missingSource: false,
      refs: [],
    },
    freshnessSummary: {
      state: "not_applicable",
      summary:
        "This certification-boundary target does not create a new source freshness observation.",
      latestObservedAt: input.generatedAt,
    },
    limitations: [input.limitation],
    proofPosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : input.status ===
              "needs_human_review_before_certification_boundary"
            ? "review_only_context"
            : "source_backed",
      summary: input.evidenceSummary,
    },
    proofRefs: input.refs
      .map((ref) => ref.proofRef)
      .filter((ref): ref is string => Boolean(ref)),
    humanReviewNextStep: input.humanReviewNextStep,
    relatedReviewSummarySectionKey: null,
    relatedProviderBoundaryTargetKey: null,
    relatedMonitorKind: null,
    relatedSourceRole: null,
  };
}
