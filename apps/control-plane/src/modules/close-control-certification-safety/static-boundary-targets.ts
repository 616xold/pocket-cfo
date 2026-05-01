import type {
  CloseControlCertificationBoundaryResult,
  CloseControlCertificationSafetyEvidenceRef,
  CloseControlCertificationSafetyTarget,
  CloseControlReviewSummaryResult,
  ExternalDeliveryHumanConfirmationBoundaryResult,
} from "@pocket-cto/domain";
import { buildCertificationSafetyEvidenceRef } from "./evidence";
import {
  findWorstStatus,
  mapCertificationBoundaryStatus,
  mapHumanConfirmationStatus,
  mapReviewStatus,
} from "./helpers";
import { hasUnexpectedActionBoundaryValue } from "./runtime-action-boundary";

type StaticTargetInput = {
  certificationBoundary: CloseControlCertificationBoundaryResult;
  generatedAt: string;
  humanConfirmation: ExternalDeliveryHumanConfirmationBoundaryResult;
  reviewSummary: CloseControlReviewSummaryResult;
};

export function buildHumanReviewNextStepSafetyTarget(
  input: StaticTargetInput,
): CloseControlCertificationSafetyTarget {
  const status = findWorstStatus([
    mapCertificationBoundaryStatus(input.certificationBoundary.aggregateStatus),
    mapHumanConfirmationStatus(input.humanConfirmation.aggregateStatus),
    mapReviewStatus(input.reviewSummary.aggregateStatus),
  ]);

  return buildStaticSafetyTarget({
    targetKey: "human-review-next-step-safety",
    targetFamily: "human_review_next_step_safety",
    status,
    basisKind: "human_review_next_step_posture",
    evidenceSummary:
      "Human-review next-step posture is derived from F6Q aggregate certification-boundary, F6S aggregate human-confirmation, and F6N aggregate review-summary posture.",
    limitation:
      "Human-review next-step posture is not certification, close complete, sign-off, attestation, assurance, legal opinion, audit opinion, approval, report release, report circulation, delivery permission, or external representation.",
    humanReviewNextStep:
      status === "ready_for_certification_safety_review"
        ? "Human operator may review the cited internal posture as a future certification-safety review target; no certification occurred."
        : "Human operator must resolve cited F6Q/F6S/F6N posture before certification-safety review.",
    generatedAt: input.generatedAt,
    refs: [
      buildCertificationSafetyEvidenceRef({
        kind: "certification_boundary_result",
        evidencePath: "close-control.certificationBoundary.aggregateStatus",
        summary: input.certificationBoundary.evidenceSummary,
      }),
      buildCertificationSafetyEvidenceRef({
        kind: "human_confirmation_boundary_result",
        evidencePath:
          "external-delivery.humanConfirmationBoundary.aggregateStatus",
        summary: input.humanConfirmation.evidenceSummary,
      }),
      buildCertificationSafetyEvidenceRef({
        kind: "review_summary_result",
        evidencePath: "close-control.reviewSummary.aggregateStatus",
        summary: input.reviewSummary.evidenceSummary,
      }),
    ],
  });
}

export function buildCertificationAbsenceSafetyTarget(
  input: StaticTargetInput,
): CloseControlCertificationSafetyTarget {
  const actionConflict = hasUnexpectedActionBoundaryValue([
    input.certificationBoundary.runtimeActionBoundary,
    input.humanConfirmation.runtimeActionBoundary,
    input.reviewSummary.runtimeActionBoundary,
  ]);

  return buildStaticSafetyTarget({
    targetKey: "certification-absence-safety",
    targetFamily: "certification_absence_safety",
    status: actionConflict
      ? "blocked_by_evidence"
      : "ready_for_certification_safety_review",
    basisKind: "runtime_action_absence_posture",
    evidenceSummary:
      "Certification absence posture is derived from shipped F6Q/F6S/F6N absence boundaries and the F6T read path.",
    limitation:
      "F6T creates no certification record, certified status, close-complete status, sign-off, attestation, assurance, legal opinion, audit opinion, approval, report release, report circulation, delivery, provider call, provider credential, provider job, outbox send, mission, monitor rerun, source mutation, generated prose, finance write, advice, instruction, or autonomous action.",
    humanReviewNextStep: actionConflict
      ? "Resolve the conflicting upstream action boundary before certification-safety review."
      : "Confirm that no certification occurred, no assurance occurred, and no legal or audit opinion occurred before any future certification-safety review target.",
    generatedAt: input.generatedAt,
    refs: [
      buildCertificationSafetyEvidenceRef({
        kind: "absence_boundary",
        evidencePath:
          "close-control.certificationBoundary.runtimeActionBoundary",
        summary: input.certificationBoundary.runtimeActionBoundary.summary,
      }),
      buildCertificationSafetyEvidenceRef({
        kind: "absence_boundary",
        evidencePath:
          "external-delivery.humanConfirmationBoundary.runtimeActionBoundary",
        summary: input.humanConfirmation.runtimeActionBoundary.summary,
      }),
      buildCertificationSafetyEvidenceRef({
        kind: "absence_boundary",
        evidencePath: "close-control.reviewSummary.runtimeActionBoundary",
        summary: input.reviewSummary.runtimeActionBoundary.summary,
      }),
    ],
  });
}

function buildStaticSafetyTarget(input: {
  basisKind: CloseControlCertificationSafetyTarget["evidenceBasis"]["basisKind"];
  evidenceSummary: string;
  generatedAt: string;
  humanReviewNextStep: string;
  limitation: string;
  refs: CloseControlCertificationSafetyEvidenceRef[];
  status: CloseControlCertificationSafetyTarget["status"];
  targetFamily: CloseControlCertificationSafetyTarget["targetFamily"];
  targetKey: string;
}): CloseControlCertificationSafetyTarget {
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
        "This certification-safety target is derived from existing read posture and does not create a new source observation.",
      missingSource: false,
      refs: [],
    },
    freshnessSummary: {
      state: "not_applicable",
      summary:
        "This certification-safety target does not create a new source freshness observation.",
      latestObservedAt: input.generatedAt,
    },
    limitations: [input.limitation],
    proofPosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : input.status === "needs_human_review_before_certification_safety"
            ? "review_only_context"
            : "source_backed",
      summary: input.evidenceSummary,
    },
    proofRefs: input.refs
      .map((ref) => ref.proofRef)
      .filter((ref): ref is string => Boolean(ref)),
    humanReviewNextStep: input.humanReviewNextStep,
    relatedCertificationBoundaryTargetKey: null,
    relatedHumanConfirmationTargetKey: null,
    relatedReviewSummarySectionKey: null,
    relatedMonitorKind: null,
    relatedSourceRole: null,
  };
}
