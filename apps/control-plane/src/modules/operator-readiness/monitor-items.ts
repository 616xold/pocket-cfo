import {
  OperatorAttentionItemSchema,
  type MonitorKind,
  type MonitorLatestResult,
  type MonitorProofBundlePostureState,
  type MonitorResult,
  type OperatorAttentionItem,
  type OperatorReadinessEvidenceRef,
  type OperatorReadinessProofPostureState,
  type OperatorReadinessSourcePostureState,
  type OperatorReadinessStatus,
} from "@pocket-cto/domain";
import { buildEvidenceRef, dedupe } from "./evidence";

export const MONITOR_KINDS: MonitorKind[] = [
  "cash_posture",
  "collections_pressure",
  "payables_pressure",
  "policy_covenant_threshold",
];

export function buildMonitorAttentionItem(
  latest: MonitorLatestResult,
): OperatorAttentionItem {
  const result = latest.monitorResult;

  if (!result) {
    return OperatorAttentionItemSchema.parse({
      itemKey: `monitor:${latest.monitorKind}:missing-latest`,
      family: "monitor_alert_attention",
      status: "blocked_by_evidence",
      evidenceBasis: {
        basisKind: "latest_persisted_monitor_result",
        summary: `No latest persisted ${latest.monitorKind} monitor result is available for operator readiness.`,
        refs: [],
      },
      sourceLineageRefs: [],
      sourcePosture: {
        state: "monitor_context_missing",
        summary: `Latest persisted ${latest.monitorKind} monitor context is missing.`,
        refs: [],
      },
      freshnessSummary: {
        state: "missing",
        summary: `No latest persisted ${latest.monitorKind} monitor result was found.`,
        latestObservedAt: null,
      },
      limitations: [
        `No latest persisted ${latest.monitorKind} monitor result is stored.`,
        "F6J readiness does not rerun monitors or create monitor results.",
      ],
      proofPosture: {
        state: "limited_by_missing_monitor_context",
        summary:
          "Operator readiness is limited because latest persisted monitor-result context is missing.",
      },
      humanReviewNextStep:
        "Review stored monitor-result history and source posture; any monitor rerun remains outside readiness generation.",
      relatedMonitorKind: latest.monitorKind,
      relatedChecklistItemFamily: null,
      relatedAlertStatus: null,
    });
  }

  const status = mapMonitorReadinessStatus(result);
  const evidenceRefs = buildMonitorEvidenceRefs(result);

  return OperatorAttentionItemSchema.parse({
    itemKey: `monitor:${result.monitorKind}:${result.id}`,
    family: "monitor_alert_attention",
    status,
    evidenceBasis: {
      basisKind: "latest_persisted_monitor_result",
      summary:
        result.status === "alert"
          ? `Latest persisted ${result.monitorKind} monitor result is alerting and needs human operator review.`
          : `Latest persisted ${result.monitorKind} monitor result is non-alerting and available for internal review.`,
      refs: evidenceRefs,
    },
    sourceLineageRefs: result.sourceLineageRefs,
    sourcePosture: {
      state: mapMonitorSourcePostureState(result),
      summary: result.sourceFreshnessPosture.summary,
      refs: evidenceRefs,
    },
    freshnessSummary: {
      state: result.sourceFreshnessPosture.state,
      summary: result.sourceFreshnessPosture.summary,
      latestObservedAt: result.createdAt,
    },
    limitations: dedupe([
      ...result.limitations,
      "F6J readiness reads the latest persisted monitor result only and does not rerun monitors, create investigations, or treat alert cards as external action instructions.",
    ]),
    proofPosture: {
      state: mapMonitorProofPostureState(result.proofBundlePosture.state),
      summary: result.proofBundlePosture.summary,
    },
    humanReviewNextStep: result.humanReviewNextStep,
    relatedMonitorKind: result.monitorKind,
    relatedChecklistItemFamily: null,
    relatedAlertStatus: result.status,
  });
}

function mapMonitorReadinessStatus(
  result: MonitorResult,
): OperatorReadinessStatus {
  if (
    result.sourceFreshnessPosture.state === "missing" ||
    result.sourceFreshnessPosture.state === "failed" ||
    result.proofBundlePosture.state === "limited_by_missing_source" ||
    result.proofBundlePosture.state === "limited_by_failed_source"
  ) {
    return "blocked_by_evidence";
  }

  if (
    result.status === "alert" ||
    result.sourceFreshnessPosture.state === "stale" ||
    result.proofBundlePosture.state !== "source_backed"
  ) {
    return "needs_review";
  }

  return "ready_for_review";
}

function mapMonitorSourcePostureState(
  result: MonitorResult,
): OperatorReadinessSourcePostureState {
  if (
    result.sourceFreshnessPosture.missingSource ||
    result.sourceFreshnessPosture.state === "missing"
  ) {
    return "missing_source";
  }

  if (
    result.sourceFreshnessPosture.failedSource ||
    result.sourceFreshnessPosture.state === "failed"
  ) {
    return "failed_source";
  }

  if (result.sourceFreshnessPosture.state === "stale") {
    return "stale_source";
  }

  if (result.proofBundlePosture.state !== "source_backed") {
    return "limited_source";
  }

  return "source_backed";
}

function mapMonitorProofPostureState(
  state: MonitorProofBundlePostureState,
): OperatorReadinessProofPostureState {
  return state;
}

function buildMonitorEvidenceRefs(
  result: MonitorResult,
): OperatorReadinessEvidenceRef[] {
  const refs: OperatorReadinessEvidenceRef[] = [
    buildEvidenceRef({
      kind: "monitor_result",
      evidencePath: `monitorResults.${result.monitorKind}`,
      summary: `Latest persisted ${result.monitorKind} monitor result.`,
      monitorKind: result.monitorKind,
      monitorResultId: result.id,
    }),
    buildEvidenceRef({
      kind: "proof_posture",
      evidencePath: `monitorResults.${result.monitorKind}.proofBundlePosture`,
      summary: result.proofBundlePosture.summary,
      monitorKind: result.monitorKind,
      monitorResultId: result.id,
      proofRef: `monitor-results/${result.id}/proofBundlePosture`,
    }),
  ];

  if (result.alertCard) {
    refs.push(
      buildEvidenceRef({
        kind: "monitor_alert_card",
        evidencePath: `monitorResults.${result.monitorKind}.alertCard`,
        summary: `Stored ${result.monitorKind} alert card posture.`,
        monitorKind: result.monitorKind,
        monitorResultId: result.id,
      }),
    );
  }

  return refs;
}
