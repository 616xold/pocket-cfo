import {
  CloseControlChecklistItemSchema,
  type MonitorLatestResult,
} from "@pocket-cto/domain";
import { CLOSE_CONTROL_MONITOR_KINDS } from "./types";
import { buildProofSummary, dedupe } from "./utils";

export function buildMonitorReplayItem(latestResults: MonitorLatestResult[]) {
  const byKind = new Map(
    latestResults.map((result) => [result.monitorKind, result]),
  );
  const missingKinds = CLOSE_CONTROL_MONITOR_KINDS.filter(
    (kind) => !byKind.get(kind)?.monitorResult,
  );
  const presentResults = CLOSE_CONTROL_MONITOR_KINDS.map(
    (kind) => byKind.get(kind)?.monitorResult ?? null,
  ).filter((result): result is NonNullable<typeof result> => result !== null);
  const reviewResults = presentResults.filter(
    (result) =>
      result.status === "alert" ||
      result.sourceFreshnessPosture.state !== "fresh" ||
      result.proofBundlePosture.state !== "source_backed",
  );
  const status =
    missingKinds.length === 0 && reviewResults.length === 0
      ? "ready_for_review"
      : "needs_review";
  const proofState =
    missingKinds.length > 0
      ? "limited_by_missing_monitor_context"
      : reviewResults.some((result) => result.status === "alert")
        ? "limited_by_alerting_monitor"
        : reviewResults.length > 0
          ? "review_only_context"
          : "source_backed";
  const refs = presentResults.map((result) => ({
    kind: "monitor_result" as const,
    evidencePath: `monitorResults.${result.monitorKind}`,
    monitorKind: result.monitorKind,
    monitorResultId: result.id,
    summary: `Latest persisted ${result.monitorKind} monitor result.`,
  }));

  return CloseControlChecklistItemSchema.parse({
    family: "monitor_replay_readiness",
    status,
    sourcePosture: {
      state:
        missingKinds.length > 0
          ? "monitor_context_missing"
          : "monitor_context_present",
      summary:
        status === "ready_for_review"
          ? "Latest persisted results are available for all shipped F6 monitor families and are clear source-backed context."
          : "Latest persisted monitor-result context is missing, alerting, stale, or limited for at least one shipped F6 monitor family.",
      refs,
    },
    evidenceBasis: {
      basisKind: "latest_persisted_monitor_result_context",
      summary:
        "Reads latest persisted monitor results as context only and does not trigger monitor runs.",
      refs,
    },
    freshnessSummary: {
      state: status === "ready_for_review" ? "fresh" : "mixed",
      summary:
        missingKinds.length > 0
          ? `Missing latest persisted monitor result(s): ${missingKinds.join(", ")}.`
          : status === "ready_for_review"
            ? "All latest persisted monitor results are available as fresh context."
            : "One or more latest persisted monitor results need human review.",
      latestObservedAt:
        presentResults
          .map((result) => result.createdAt)
          .sort()
          .at(-1) ?? null,
    },
    limitations: dedupe([
      ...missingKinds.map(
        (kind) => `No latest persisted ${kind} monitor result is stored.`,
      ),
      ...reviewResults.map(
        (result) =>
          `${result.monitorKind} latest result is ${result.status} with ${result.sourceFreshnessPosture.state} freshness and ${result.proofBundlePosture.state} proof posture.`,
      ),
      "Monitor replay readiness does not rerun monitors or create monitor results.",
      "Monitor alerts are review context only and are not close/control approvals.",
    ]),
    humanReviewNextStep:
      "Review latest persisted monitor-result context separately; reruns remain outside the close/control checklist path.",
    proofPosture: {
      state: proofState,
      summary: buildProofSummary(
        proofState,
        "latest persisted monitor context",
      ),
    },
  });
}
