import {
  type CloseControlFreshnessState,
  type CloseControlProofPosture,
  type DeliveryReadinessSourcePostureState,
  type DeliveryReadinessStatus,
  type DeliveryReadinessTarget,
  type OperatorAttentionItem,
  type OperatorReadinessResult,
} from "@pocket-cto/domain";
import {
  collectLineage,
  mapOperatorEvidenceRefs,
  mapOperatorReadinessEvidenceRef,
} from "./evidence";
import {
  dedupe,
  findWorstFreshnessState,
  findWorstProofState,
  findWorstSourceState,
  hasMissingSourceState,
  mapOperatorItemBasisKind,
  mapOperatorItemTargetKind,
  mapOperatorStatus,
} from "./helpers";

export function buildOperatorAggregateTarget(
  readiness: OperatorReadinessResult,
): DeliveryReadinessTarget {
  const nonReadyItems = readiness.attentionItems.filter(
    (item) => item.status !== "ready_for_review",
  );
  const status = mapOperatorStatus(readiness.aggregateStatus);

  return {
    targetKey: "operator-readiness:aggregate",
    targetKind: "operator_readiness_target",
    status,
    evidenceBasis: {
      basisKind: "operator_readiness_posture",
      summary:
        "Aggregate delivery readiness is based on F6J operator-readiness aggregate posture.",
      refs: [
        {
          kind: "operator_readiness_result",
          evidencePath: "operatorReadiness.aggregateStatus",
          summary: `Operator-readiness aggregate status is ${readiness.aggregateStatus}.`,
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
          proofRef: "operatorReadiness.runtimeActionBoundary",
        },
        ...nonReadyItems.flatMap((item) => mapOperatorEvidenceRefs(item)),
      ],
    },
    sourceLineageRefs: collectLineage(nonReadyItems),
    sourcePosture: {
      state: mapOperatorAggregateSourceState(nonReadyItems, status),
      summary: buildOperatorAggregateSourceSummary(readiness, nonReadyItems),
      missingSource:
        status === "blocked_by_evidence" &&
        hasMissingSourceState(
          mapOperatorAggregateSourceState(nonReadyItems, status),
        ),
      refs: nonReadyItems.flatMap((item) =>
        item.sourcePosture.refs.map((ref) =>
          mapOperatorReadinessEvidenceRef(ref, {
            fallbackKind: "source_lineage",
            operatorReadinessItemKey: item.itemKey,
          }),
        ),
      ),
    },
    freshnessSummary: {
      state: mapOperatorAggregateFreshnessState(nonReadyItems, status),
      summary: buildOperatorAggregateFreshnessSummary(readiness, nonReadyItems),
      latestObservedAt: readiness.generatedAt,
    },
    limitations: dedupe([
      ...readiness.limitations,
      ...nonReadyItems.flatMap((item) => item.limitations),
      "Operator-readiness delivery target is internal review posture only.",
    ]),
    proofPosture: buildOperatorAggregateProof(readiness, nonReadyItems, status),
    humanReviewNextStep:
      status === "ready_for_delivery_review"
        ? "Review F6J operator-readiness evidence before any future delivery review."
        : "Review non-ready F6J operator-readiness items before future delivery review.",
    relatedOperatorReadinessItemKey: null,
    relatedAcknowledgementTargetKey: null,
    relatedMonitorKind: null,
    relatedChecklistItemFamily: null,
  };
}

export function buildOperatorItemTarget(
  item: OperatorAttentionItem,
): DeliveryReadinessTarget {
  const status = mapOperatorStatus(item.status);

  return {
    targetKey: `operator-readiness:item:${item.itemKey}`,
    targetKind: mapOperatorItemTargetKind(item),
    status,
    evidenceBasis: {
      basisKind: mapOperatorItemBasisKind(item),
      summary: item.evidenceBasis.summary,
      refs: [
        {
          kind: "operator_readiness_item",
          evidencePath: `operatorReadiness.attentionItems.${item.itemKey}`,
          summary: `Operator-readiness item ${item.itemKey} is ${item.status}.`,
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind: item.relatedMonitorKind,
          monitorResultId:
            item.evidenceBasis.refs.find((ref) => ref.monitorResultId)
              ?.monitorResultId ?? null,
          checklistItemFamily: item.relatedChecklistItemFamily,
          operatorReadinessItemKey: item.itemKey,
          acknowledgementTargetKey: null,
          proofRef: "operatorReadiness.attentionItems.proofPosture",
        },
        ...mapOperatorEvidenceRefs(item),
      ],
    },
    sourceLineageRefs: item.sourceLineageRefs,
    sourcePosture: {
      state: item.sourcePosture.state,
      summary: item.sourcePosture.summary,
      missingSource: hasMissingSourceState(item.sourcePosture.state),
      refs: item.sourcePosture.refs.map((ref) =>
        mapOperatorReadinessEvidenceRef(ref, {
          fallbackKind: "source_lineage",
          operatorReadinessItemKey: item.itemKey,
        }),
      ),
    },
    freshnessSummary: item.freshnessSummary,
    limitations: dedupe([
      ...item.limitations,
      "Operator-readiness item is a future delivery review target only; no send occurred.",
    ]),
    proofPosture: item.proofPosture,
    humanReviewNextStep:
      status === "ready_for_delivery_review"
        ? "Review this operator-readiness item before any future delivery review."
        : item.humanReviewNextStep,
    relatedOperatorReadinessItemKey: item.itemKey,
    relatedAcknowledgementTargetKey: null,
    relatedMonitorKind: item.relatedMonitorKind,
    relatedChecklistItemFamily: item.relatedChecklistItemFamily,
  };
}

function mapOperatorAggregateSourceState(
  nonReadyItems: OperatorAttentionItem[],
  status: DeliveryReadinessStatus,
): DeliveryReadinessSourcePostureState {
  if (status === "ready_for_delivery_review") {
    return "source_backed";
  }

  return (
    findWorstSourceState(nonReadyItems.map((item) => item.sourcePosture.state)) ??
    (status === "blocked_by_evidence" ? "missing_source" : "limited_source")
  );
}

function mapOperatorAggregateFreshnessState(
  nonReadyItems: OperatorAttentionItem[],
  status: DeliveryReadinessStatus,
): CloseControlFreshnessState {
  if (status === "ready_for_delivery_review") {
    return "fresh";
  }

  return (
    findWorstFreshnessState(
      nonReadyItems.map((item) => item.freshnessSummary.state),
    ) ?? (status === "blocked_by_evidence" ? "missing" : "mixed")
  );
}

function buildOperatorAggregateProof(
  readiness: OperatorReadinessResult,
  nonReadyItems: OperatorAttentionItem[],
  status: DeliveryReadinessStatus,
): CloseControlProofPosture {
  if (status === "ready_for_delivery_review") {
    return {
      state: "source_backed",
      summary:
        "Operator-readiness aggregate delivery target is backed by stored readiness posture.",
    };
  }

  const state =
    findWorstProofState(nonReadyItems.map((item) => item.proofPosture.state)) ??
    (status === "blocked_by_evidence"
      ? "limited_by_missing_source"
      : "limited_by_coverage_gap");
  const summaries = nonReadyItems
    .map((item) => `${item.itemKey}: ${item.proofPosture.summary}`)
    .join(" ");

  return {
    state,
    summary:
      summaries ||
      `Operator-readiness aggregate posture is ${readiness.aggregateStatus}.`,
  };
}

function buildOperatorAggregateSourceSummary(
  readiness: OperatorReadinessResult,
  nonReadyItems: OperatorAttentionItem[],
) {
  if (nonReadyItems.length === 0) {
    return `Operator-readiness aggregate context is ${readiness.aggregateStatus}.`;
  }

  return `Operator-readiness aggregate context is ${readiness.aggregateStatus}; non-ready readiness posture: ${nonReadyItems
    .map((item) => `${item.itemKey}=${item.status}`)
    .join(", ")}.`;
}

function buildOperatorAggregateFreshnessSummary(
  readiness: OperatorReadinessResult,
  nonReadyItems: OperatorAttentionItem[],
) {
  if (nonReadyItems.length === 0) {
    return "Operator-readiness freshness posture is ready for internal delivery review.";
  }

  return `Operator-readiness freshness is review-limited by ${readiness.aggregateStatus}: ${nonReadyItems
    .map((item) => `${item.itemKey}: ${item.freshnessSummary.summary}`)
    .join(" ")}`.trim();
}
