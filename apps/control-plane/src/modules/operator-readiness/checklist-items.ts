import {
  OperatorAttentionItemSchema,
  type CloseControlChecklistItem,
  type CloseControlChecklistResult,
  type CloseControlFreshnessSummary,
  type CloseControlProofPostureState,
  type CloseControlSourcePostureState,
  type OperatorAttentionItem,
  type OperatorAttentionItemFamily,
  type OperatorReadinessEvidenceBasisKind,
  type OperatorReadinessEvidenceRef,
  type OperatorReadinessFreshnessState,
  type OperatorReadinessProofPostureState,
  type OperatorReadinessSourcePostureState,
} from "@pocket-cto/domain";
import {
  buildEvidenceRef,
  dedupe,
  mapCloseControlEvidenceRef,
} from "./evidence";

export function buildCloseControlAttentionItems(
  checklist: CloseControlChecklistResult,
): OperatorAttentionItem[] {
  if (checklist.aggregateStatus === "ready_for_review") {
    return [
      OperatorAttentionItemSchema.parse({
        itemKey: "close-control:aggregate",
        family: "close_control_attention",
        status: "ready_for_review",
        evidenceBasis: {
          basisKind: "close_control_checklist_posture",
          summary:
            "The deterministic close/control checklist aggregate is ready for review.",
          refs: [
            buildEvidenceRef({
              kind: "close_control_checklist",
              evidencePath: "closeControlChecklist.aggregateStatus",
              summary:
                "Derived close/control checklist aggregate read posture.",
              checklistItemFamily: null,
            }),
          ],
        },
        sourceLineageRefs: [],
        sourcePosture: {
          state: "source_backed",
          summary: checklist.evidenceSummary,
          refs: [],
        },
        freshnessSummary: {
          state: "fresh",
          summary:
            "Close/control checklist posture was generated from current stored source posture.",
          latestObservedAt: checklist.generatedAt,
        },
        limitations: dedupe([
          ...checklist.limitations,
          "F6J readiness does not acknowledge checklist items, approve close, or mark close complete.",
        ]),
        proofPosture: {
          state: "source_backed",
          summary:
            "Close/control aggregate posture is backed by the generated checklist read model.",
        },
        humanReviewNextStep:
          "Review the close/control checklist evidence posture before deciding any follow-up.",
        relatedMonitorKind: null,
        relatedChecklistItemFamily: null,
        relatedAlertStatus: null,
      }),
    ];
  }

  return checklist.items
    .filter((item) => item.status !== "ready_for_review")
    .map((item) => buildCloseControlAttentionItem(item));
}

function buildCloseControlAttentionItem(
  item: CloseControlChecklistItem,
): OperatorAttentionItem {
  const evidenceRefs = [
    buildChecklistItemRef(item),
    ...item.evidenceBasis.refs.map(mapCloseControlEvidenceRef),
  ];
  const sourceRefs = item.sourcePosture.refs.map(mapCloseControlEvidenceRef);

  return OperatorAttentionItemSchema.parse({
    itemKey: `close-control:${item.family}`,
    family: mapChecklistItemFamily(item.family),
    status: item.status,
    evidenceBasis: {
      basisKind: mapChecklistEvidenceBasisKind(item),
      summary: item.evidenceBasis.summary,
      refs: evidenceRefs,
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state: mapCloseControlSourcePostureState(item.sourcePosture.state),
      summary: item.sourcePosture.summary,
      refs: sourceRefs,
    },
    freshnessSummary: mapCloseControlFreshness(item.freshnessSummary),
    limitations: dedupe([
      ...item.limitations,
      "F6J readiness does not acknowledge checklist items, approve close, or mark close complete.",
    ]),
    proofPosture: {
      state: mapCloseControlProofPostureState(item.proofPosture.state),
      summary: item.proofPosture.summary,
    },
    humanReviewNextStep: item.humanReviewNextStep,
    relatedMonitorKind: readRelatedMonitorKind(item),
    relatedChecklistItemFamily: item.family,
    relatedAlertStatus: null,
  });
}

function mapCloseControlSourcePostureState(
  state: CloseControlSourcePostureState,
): OperatorReadinessSourcePostureState {
  if (state === "monitor_context_missing") {
    return "monitor_context_missing";
  }

  if (state === "monitor_context_present") {
    return "monitor_context_present";
  }

  return state;
}

function mapCloseControlProofPostureState(
  state: CloseControlProofPostureState,
): OperatorReadinessProofPostureState {
  return state;
}

function mapCloseControlFreshness(
  freshness: CloseControlFreshnessSummary,
): {
  latestObservedAt: string | null;
  state: OperatorReadinessFreshnessState;
  summary: string;
} {
  return {
    state: freshness.state,
    summary: freshness.summary,
    latestObservedAt: freshness.latestObservedAt,
  };
}

function mapChecklistItemFamily(
  family: CloseControlChecklistItem["family"],
): OperatorAttentionItemFamily {
  if (family === "policy_source_freshness_review") {
    return "policy_source_attention";
  }

  if (
    family === "source_coverage_review" ||
    family === "cash_source_freshness_review" ||
    family === "receivables_aging_source_freshness_review" ||
    family === "payables_aging_source_freshness_review"
  ) {
    return "source_freshness_attention";
  }

  return "close_control_attention";
}

function mapChecklistEvidenceBasisKind(
  item: CloseControlChecklistItem,
): OperatorReadinessEvidenceBasisKind {
  if (item.family === "policy_source_freshness_review") {
    return "policy_source_posture";
  }

  if (
    item.family === "source_coverage_review" ||
    item.family === "cash_source_freshness_review" ||
    item.family === "receivables_aging_source_freshness_review" ||
    item.family === "payables_aging_source_freshness_review"
  ) {
    return "source_freshness_posture";
  }

  return "close_control_checklist_posture";
}

function readRelatedMonitorKind(item: CloseControlChecklistItem) {
  const ref = [...item.evidenceBasis.refs, ...item.sourcePosture.refs].find(
    (candidate) => candidate.monitorKind !== null,
  );

  return ref?.monitorKind ?? null;
}

function buildChecklistItemRef(
  item: CloseControlChecklistItem,
): OperatorReadinessEvidenceRef {
  return buildEvidenceRef({
    kind: "close_control_checklist_item",
    evidencePath: `closeControlChecklist.items.${item.family}`,
    summary: `Derived close/control checklist item ${item.family}.`,
    checklistItemFamily: item.family,
  });
}
