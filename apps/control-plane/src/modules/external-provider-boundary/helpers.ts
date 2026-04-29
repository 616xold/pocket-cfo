import type {
  CloseControlFreshnessState,
  CloseControlFreshnessSummary,
  CloseControlProofPosture,
  CloseControlProofPostureState,
  CloseControlReviewSection,
  CloseControlReviewStatus,
  DeliveryReadinessStatus,
  DeliveryReadinessTarget,
  ExternalProviderBoundarySourcePostureState,
  ExternalProviderBoundaryStatus,
  MonitorSourceLineageRef,
} from "@pocket-cto/domain";

export function mapDeliveryStatus(
  status: DeliveryReadinessStatus,
): ExternalProviderBoundaryStatus {
  if (status === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (status === "needs_review_before_delivery") {
    return "needs_human_review_before_provider_boundary";
  }

  return "ready_for_provider_boundary_review";
}

export function mapReviewStatus(
  status: CloseControlReviewStatus,
): ExternalProviderBoundaryStatus {
  if (status === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (status === "needs_human_review") {
    return "needs_human_review_before_provider_boundary";
  }

  return "ready_for_provider_boundary_review";
}

export function mapSourcePostureToStatus(
  state: ExternalProviderBoundarySourcePostureState,
  freshnessState: CloseControlFreshnessState,
): ExternalProviderBoundaryStatus {
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
    return "needs_human_review_before_provider_boundary";
  }

  return "ready_for_provider_boundary_review";
}

export function mapProofPostureToStatus(
  state: CloseControlProofPostureState,
): ExternalProviderBoundaryStatus {
  if (
    state === "limited_by_missing_source" ||
    state === "limited_by_failed_source"
  ) {
    return "blocked_by_evidence";
  }

  if (state === "source_backed") {
    return "ready_for_provider_boundary_review";
  }

  return "needs_human_review_before_provider_boundary";
}

export function findWorstStatus(
  statuses: ExternalProviderBoundaryStatus[],
): ExternalProviderBoundaryStatus {
  if (statuses.includes("blocked_by_evidence")) {
    return "blocked_by_evidence";
  }

  if (statuses.includes("needs_human_review_before_provider_boundary")) {
    return "needs_human_review_before_provider_boundary";
  }

  return "ready_for_provider_boundary_review";
}

export function findWorstSourceState(
  states: ExternalProviderBoundarySourcePostureState[],
): ExternalProviderBoundarySourcePostureState {
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

export function hasUnexpectedActionBoundaryValue(
  boundaries: Array<Record<string, unknown>>,
) {
  const actionKeys = [
    "runtimeCodexUsed",
    "deliveryCreated",
    "externalProviderCalled",
    "notificationProviderCalled",
    "providerCredentialCreated",
    "providerJobCreated",
    "outboxSendCreated",
    "emailSent",
    "slackSent",
    "smsSent",
    "webhookCalled",
    "scheduledDeliveryCreated",
    "autoSendConfigured",
    "reportCreated",
    "reportReleased",
    "approvalCreated",
    "missionCreated",
    "monitorRunTriggered",
    "monitorResultCreated",
    "sourceMutationCreated",
    "generatedNotificationProseCreated",
    "generatedProseCreated",
    "accountingWriteCreated",
    "bankWriteCreated",
    "taxFilingCreated",
    "legalAdviceGenerated",
    "policyAdviceGenerated",
    "paymentInstructionCreated",
    "collectionInstructionCreated",
    "customerContactInstructionCreated",
    "autonomousActionCreated",
  ];

  return boundaries.some((boundary) =>
    actionKeys.some((key) => boundary[key] === true),
  );
}

export function buildRuntimeActionBoundary() {
  return {
    runtimeCodexUsed: false,
    deliveryCreated: false,
    externalProviderCalled: false,
    notificationProviderCalled: false,
    providerCredentialCreated: false,
    providerJobCreated: false,
    outboxSendCreated: false,
    emailSent: false,
    slackSent: false,
    smsSent: false,
    webhookCalled: false,
    scheduledDeliveryCreated: false,
    autoSendConfigured: false,
    reportCreated: false,
    reportReleased: false,
    approvalCreated: false,
    missionCreated: false,
    monitorRunTriggered: false,
    monitorResultCreated: false,
    sourceMutationCreated: false,
    generatedNotificationProseCreated: false,
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
      "F6P provider-boundary generation is deterministic, read-only, internal, and no provider call occurred.",
    replayImplication:
      "The first F6P provider-boundary result is derived from current stored/read posture and is not persisted as a mission replay event.",
  };
}

export function dedupe(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}

export function collectProofRefs(values: Array<string | null | undefined>) {
  return dedupe(values.filter((value): value is string => Boolean(value)));
}

export function collectLineageRefs(
  deliveryTargets: DeliveryReadinessTarget[],
  reviewSections: CloseControlReviewSection[],
) {
  const byKey = new Map<string, MonitorSourceLineageRef>();

  for (const ref of [
    ...deliveryTargets.flatMap((target) => target.sourceLineageRefs),
    ...reviewSections.flatMap((section) => section.sourceLineageRefs),
  ]) {
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
