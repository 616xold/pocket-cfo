import type {
  CloseControlCertificationBoundaryStatus,
  CloseControlCertificationSafetySourcePostureState,
  CloseControlCertificationSafetyStatus,
  CloseControlFreshnessState,
  CloseControlFreshnessSummary,
  CloseControlProofPosture,
  CloseControlProofPostureState,
  CloseControlReviewStatus,
  ExternalDeliveryHumanConfirmationStatus,
  MonitorSourceLineageRef,
} from "@pocket-cto/domain";

export function mapCertificationBoundaryStatus(
  status: CloseControlCertificationBoundaryStatus,
): CloseControlCertificationSafetyStatus {
  if (status === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (status === "needs_human_review_before_certification_boundary") {
    return "needs_human_review_before_certification_safety";
  }

  return "ready_for_certification_safety_review";
}

export function mapHumanConfirmationStatus(
  status: ExternalDeliveryHumanConfirmationStatus,
): CloseControlCertificationSafetyStatus {
  if (status === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (status === "needs_human_review_before_confirmation") {
    return "needs_human_review_before_certification_safety";
  }

  return "ready_for_certification_safety_review";
}

export function mapReviewStatus(
  status: CloseControlReviewStatus,
): CloseControlCertificationSafetyStatus {
  if (status === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (status === "needs_human_review") {
    return "needs_human_review_before_certification_safety";
  }

  return "ready_for_certification_safety_review";
}

export function mapSourcePostureToStatus(
  state: CloseControlCertificationSafetySourcePostureState,
  freshnessState: CloseControlFreshnessState,
): CloseControlCertificationSafetyStatus {
  if (
    state === "missing_source" ||
    state === "monitor_context_missing" ||
    state === "failed_source" ||
    freshnessState === "missing" ||
    freshnessState === "failed"
  ) {
    return "blocked_by_evidence";
  }

  if (
    state === "stale_source" ||
    state === "limited_source" ||
    freshnessState === "stale" ||
    freshnessState === "mixed"
  ) {
    return "needs_human_review_before_certification_safety";
  }

  return "ready_for_certification_safety_review";
}

export function mapProofPostureToStatus(
  state: CloseControlProofPostureState,
): CloseControlCertificationSafetyStatus {
  if (
    state === "limited_by_missing_source" ||
    state === "limited_by_failed_source"
  ) {
    return "blocked_by_evidence";
  }

  if (state === "source_backed") {
    return "ready_for_certification_safety_review";
  }

  return "needs_human_review_before_certification_safety";
}

export function findWorstStatus(
  statuses: CloseControlCertificationSafetyStatus[],
): CloseControlCertificationSafetyStatus {
  if (statuses.includes("blocked_by_evidence")) {
    return "blocked_by_evidence";
  }

  if (statuses.includes("needs_human_review_before_certification_safety")) {
    return "needs_human_review_before_certification_safety";
  }

  return "ready_for_certification_safety_review";
}

export function findWorstSourceState(
  states: CloseControlCertificationSafetySourcePostureState[],
): CloseControlCertificationSafetySourcePostureState {
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
      [
        "missing",
        "failed",
        "stale",
        "mixed",
        "not_applicable",
        "fresh",
      ] as const
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

export function dedupe(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}

export function collectProofRefs(values: Array<string | null | undefined>) {
  return dedupe(values.filter((value): value is string => Boolean(value)));
}

export function collectLineageRefs(
  values: Array<{ sourceLineageRefs: MonitorSourceLineageRef[] }>,
) {
  const byKey = new Map<string, MonitorSourceLineageRef>();

  for (const ref of values.flatMap((value) => value.sourceLineageRefs)) {
    byKey.set(JSON.stringify(ref), ref);
  }

  return Array.from(byKey.values());
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
