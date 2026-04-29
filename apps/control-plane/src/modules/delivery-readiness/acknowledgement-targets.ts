import {
  type CloseControlAcknowledgementReadinessResult,
  type CloseControlAcknowledgementTarget,
  type DeliveryReadinessTarget,
} from "@pocket-cto/domain";
import {
  buildFallbackProof,
  buildNotApplicableFreshness,
  dedupe,
  mapAcknowledgementStatus,
} from "./helpers";
import {
  inferMonitorKindFromAcknowledgementTarget,
  mapAcknowledgementEvidenceRefs,
} from "./evidence";

export function buildAcknowledgementAggregateTarget(
  acknowledgement: CloseControlAcknowledgementReadinessResult,
): DeliveryReadinessTarget {
  const aggregateTarget =
    acknowledgement.acknowledgementTargets.find(
      (target) => target.targetKind === "checklist_aggregate",
    ) ?? acknowledgement.acknowledgementTargets[0];
  const status = mapAcknowledgementStatus(acknowledgement.aggregateStatus);

  return {
    targetKey: "acknowledgement-readiness:aggregate",
    targetKind: "acknowledgement_readiness_target",
    status,
    evidenceBasis: {
      basisKind: "acknowledgement_readiness_posture",
      summary:
        "Aggregate delivery readiness is based on F6K acknowledgement-readiness aggregate posture.",
      refs: [
        {
          kind: "acknowledgement_readiness_result",
          evidencePath: "acknowledgementReadiness.aggregateStatus",
          summary: `Acknowledgement-readiness aggregate status is ${acknowledgement.aggregateStatus}.`,
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind: null,
          monitorResultId: null,
          checklistItemFamily: null,
          operatorReadinessItemKey: null,
          acknowledgementTargetKey: null,
          proofRef: "acknowledgementReadiness.runtimeActionBoundary",
        },
        ...mapAcknowledgementEvidenceRefs(aggregateTarget),
      ],
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state: aggregateTarget?.sourcePosture.state ?? "not_applicable",
      summary:
        aggregateTarget?.sourcePosture.summary ??
        "Acknowledgement-readiness source posture is unavailable.",
      missingSource: aggregateTarget?.sourcePosture.missingSource ?? false,
      refs: [],
    },
    freshnessSummary:
      aggregateTarget?.freshnessSummary ??
      buildNotApplicableFreshness(acknowledgement.generatedAt),
    limitations: dedupe([
      ...acknowledgement.limitations,
      ...(aggregateTarget?.limitations ?? []),
      "Acknowledgement-readiness delivery target is internal review posture only.",
    ]),
    proofPosture:
      aggregateTarget?.proofPosture ??
      buildFallbackProof(status, "Acknowledgement-readiness aggregate posture."),
    humanReviewNextStep:
      status === "ready_for_delivery_review"
        ? "Review F6K acknowledgement-readiness evidence before any future delivery review."
        : "Review non-ready F6K acknowledgement-readiness posture before future delivery review.",
    relatedOperatorReadinessItemKey: null,
    relatedAcknowledgementTargetKey: aggregateTarget?.targetKey ?? null,
    relatedMonitorKind: null,
    relatedChecklistItemFamily:
      aggregateTarget?.relatedChecklistItemFamily ?? null,
  };
}

export function buildAcknowledgementTarget(
  target: CloseControlAcknowledgementTarget,
): DeliveryReadinessTarget {
  const status = mapAcknowledgementStatus(target.status);

  return {
    targetKey: `acknowledgement-readiness:target:${target.targetKey}`,
    targetKind: "acknowledgement_readiness_target",
    status,
    evidenceBasis: {
      basisKind: "acknowledgement_readiness_posture",
      summary: target.evidenceBasis.summary,
      refs: [
        {
          kind: "acknowledgement_readiness_target",
          evidencePath: `acknowledgementReadiness.targets.${target.targetKey}`,
          summary: `Acknowledgement-readiness target ${target.targetKey} is ${target.status}.`,
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind: null,
          monitorResultId: null,
          checklistItemFamily: target.relatedChecklistItemFamily,
          operatorReadinessItemKey: target.relatedReadinessItemKey,
          acknowledgementTargetKey: target.targetKey,
          proofRef: "acknowledgementReadiness.acknowledgementTargets.proofPosture",
        },
        ...mapAcknowledgementEvidenceRefs(target),
      ],
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state: target.sourcePosture.state,
      summary: target.sourcePosture.summary,
      missingSource: target.sourcePosture.missingSource,
      refs: [],
    },
    freshnessSummary: target.freshnessSummary,
    limitations: dedupe([
      ...target.limitations,
      "Acknowledgement-readiness target is a future delivery review target only; no send occurred.",
    ]),
    proofPosture: target.proofPosture,
    humanReviewNextStep:
      status === "ready_for_delivery_review"
        ? "Review this acknowledgement-readiness target before any future delivery review."
        : target.humanReviewNextStep,
    relatedOperatorReadinessItemKey: target.relatedReadinessItemKey,
    relatedAcknowledgementTargetKey: target.targetKey,
    relatedMonitorKind: inferMonitorKindFromAcknowledgementTarget(target),
    relatedChecklistItemFamily: target.relatedChecklistItemFamily,
  };
}
