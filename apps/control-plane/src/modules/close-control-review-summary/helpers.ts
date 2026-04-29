import type {
  CloseControlAcknowledgementStatus,
  CloseControlChecklistStatus,
  CloseControlFreshnessState,
  CloseControlFreshnessSummary,
  CloseControlProofPosture,
  CloseControlProofPostureState,
  CloseControlReviewSourcePostureState,
  CloseControlReviewStatus,
  DeliveryReadinessStatus,
  OperatorReadinessStatus,
} from "@pocket-cto/domain";

export function mapChecklistStatus(
  status: CloseControlChecklistStatus,
): CloseControlReviewStatus {
  if (status === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (status === "needs_review") {
    return "needs_human_review";
  }

  return "ready_for_review_summary";
}

export function mapOperatorStatus(
  status: OperatorReadinessStatus,
): CloseControlReviewStatus {
  return mapChecklistStatus(status);
}

export function mapAcknowledgementStatus(
  status: CloseControlAcknowledgementStatus,
): CloseControlReviewStatus {
  if (status === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (status === "needs_review_before_acknowledgement") {
    return "needs_human_review";
  }

  return "ready_for_review_summary";
}

export function mapDeliveryStatus(
  status: DeliveryReadinessStatus,
): CloseControlReviewStatus {
  if (status === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (status === "needs_review_before_delivery") {
    return "needs_human_review";
  }

  return "ready_for_review_summary";
}

export function findWorstReviewStatus(
  statuses: CloseControlReviewStatus[],
): CloseControlReviewStatus {
  if (statuses.includes("blocked_by_evidence")) {
    return "blocked_by_evidence";
  }

  if (statuses.includes("needs_human_review")) {
    return "needs_human_review";
  }

  return "ready_for_review_summary";
}

export function findWorstSourceState(
  states: CloseControlReviewSourcePostureState[],
): CloseControlReviewSourcePostureState {
  return (
    (
      [
        "missing_source",
        "monitor_context_missing",
        "failed_source",
        "stale_source",
        "limited_source",
        "monitor_context_present",
        "source_backed",
        "not_applicable",
      ] as const
    ).find((state) => states.includes(state)) ?? "not_applicable"
  );
}

export function findWorstFreshnessState(
  states: CloseControlFreshnessState[],
): CloseControlFreshnessState {
  return (
    (
      ["missing", "failed", "stale", "mixed", "not_applicable", "fresh"] as const
    ).find((state) => states.includes(state)) ?? "not_applicable"
  );
}

export function findWorstProofState(
  states: CloseControlProofPostureState[],
): CloseControlProofPostureState {
  return (
    (
      [
        "limited_by_missing_source",
        "limited_by_failed_source",
        "limited_by_stale_source",
        "limited_by_data_quality_gap",
        "limited_by_coverage_gap",
        "limited_by_missing_monitor_context",
        "limited_by_alerting_monitor",
        "review_only_context",
        "source_backed",
      ] as const
    ).find((state) => states.includes(state)) ?? "review_only_context"
  );
}

export function summarizeFreshness(
  summaries: CloseControlFreshnessSummary[],
  summary: string,
): CloseControlFreshnessSummary {
  return {
    state: findWorstFreshnessState(
      summaries.map((freshness) => freshness.state),
    ),
    summary,
    latestObservedAt: findLatestObservedAt(summaries),
  };
}

export function summarizeProof(
  postures: CloseControlProofPosture[],
  summary: string,
): CloseControlProofPosture {
  return {
    state: findWorstProofState(postures.map((posture) => posture.state)),
    summary,
  };
}

export function hasMissingSourceState(
  state: CloseControlReviewSourcePostureState,
) {
  return state === "missing_source" || state === "monitor_context_missing";
}

export function buildRuntimeActionBoundary() {
  return {
    runtimeCodexUsed: false,
    deliveryCreated: false,
    outboxSendCreated: false,
    notificationProviderCalled: false,
    emailSent: false,
    slackSent: false,
    smsSent: false,
    webhookCalled: false,
    reportCreated: false,
    reportReleased: false,
    reportCirculated: false,
    approvalCreated: false,
    certificationCreated: false,
    closeCompleteCreated: false,
    signOffCreated: false,
    attestationCreated: false,
    missionCreated: false,
    monitorRunTriggered: false,
    monitorResultCreated: false,
    sourceMutationCreated: false,
    generatedProseCreated: false,
    accountingWriteCreated: false,
    bankWriteCreated: false,
    taxFilingCreated: false,
    legalAdviceGenerated: false,
    policyAdviceGenerated: false,
    paymentInstructionCreated: false,
    collectionInstructionCreated: false,
    customerContactInstructionCreated: false,
    autonomousActionCreated: false,
    summary:
      "F6N close/control review-summary generation is deterministic, read-only, internal, and action-free.",
    replayImplication:
      "The first F6N review-summary result is derived from current stored/read posture and is not persisted as a mission replay event.",
  };
}

export function dedupe(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}

export function collectProofRefs(values: Array<string | null | undefined>) {
  return dedupe(values.filter((value): value is string => Boolean(value)));
}

function findLatestObservedAt(
  summaries: CloseControlFreshnessSummary[],
): string | null {
  const observed = summaries
    .map((summary) => summary.latestObservedAt)
    .filter((value): value is string => Boolean(value))
    .sort();

  return observed.at(-1) ?? null;
}
