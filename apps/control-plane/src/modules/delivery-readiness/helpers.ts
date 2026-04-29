import {
  type CloseControlAcknowledgementStatus,
  type CloseControlFreshnessState,
  type CloseControlProofPosture,
  type CloseControlProofPostureState,
  type DeliveryReadinessEvidenceBasisKind,
  type DeliveryReadinessSourcePostureState,
  type DeliveryReadinessStatus,
  type DeliveryReadinessTargetKind,
  type OperatorAttentionItem,
  type OperatorReadinessStatus,
} from "@pocket-cto/domain";

export function mapOperatorStatus(
  status: OperatorReadinessStatus,
): DeliveryReadinessStatus {
  if (status === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (status === "needs_review") {
    return "needs_review_before_delivery";
  }

  return "ready_for_delivery_review";
}

export function mapAcknowledgementStatus(
  status: CloseControlAcknowledgementStatus,
): DeliveryReadinessStatus {
  if (status === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (status === "needs_review_before_acknowledgement") {
    return "needs_review_before_delivery";
  }

  return "ready_for_delivery_review";
}

export function mapOperatorItemTargetKind(
  item: OperatorAttentionItem,
): DeliveryReadinessTargetKind {
  if (item.relatedMonitorKind) {
    return "monitor_posture_target";
  }

  if (item.relatedChecklistItemFamily) {
    return "source_posture_target";
  }

  return "operator_readiness_target";
}

export function mapOperatorItemBasisKind(
  item: OperatorAttentionItem,
): DeliveryReadinessEvidenceBasisKind {
  if (item.relatedMonitorKind) {
    return "monitor_posture";
  }

  if (item.relatedChecklistItemFamily) {
    return "source_posture";
  }

  return "operator_readiness_posture";
}

export function findWorstSourceState(
  states: DeliveryReadinessSourcePostureState[],
): DeliveryReadinessSourcePostureState | null {
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
    ).find((state) => states.includes(state)) ?? null
  );
}

export function findWorstFreshnessState(
  states: CloseControlFreshnessState[],
): CloseControlFreshnessState | null {
  return (
    (
      ["missing", "failed", "stale", "mixed", "not_applicable", "fresh"] as const
    ).find((state) => states.includes(state)) ?? null
  );
}

export function findWorstProofState(
  states: CloseControlProofPostureState[],
): CloseControlProofPostureState | null {
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
    ).find((state) => states.includes(state)) ?? null
  );
}

export function hasMissingSourceState(
  state: DeliveryReadinessSourcePostureState,
) {
  return state === "missing_source" || state === "monitor_context_missing";
}

export function buildNotApplicableFreshness(generatedAt: string) {
  return {
    state: "not_applicable" as const,
    summary:
      "Acknowledgement-readiness freshness posture was not available for this target.",
    latestObservedAt: generatedAt,
  };
}

export function buildFallbackProof(
  status: DeliveryReadinessStatus,
  summary: string,
): CloseControlProofPosture {
  return {
    state:
      status === "blocked_by_evidence"
        ? "limited_by_missing_source"
        : status === "needs_review_before_delivery"
          ? "limited_by_coverage_gap"
          : "source_backed",
    summary,
  };
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
    approvalCreated: false,
    missionCreated: false,
    monitorRunTriggered: false,
    monitorResultCreated: false,
    sourceMutationCreated: false,
    generatedNotificationProseCreated: false,
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
      "F6M delivery readiness generation is deterministic, read-only, internal-review-only, and no send occurred.",
    replayImplication:
      "The first F6M delivery-readiness result is derived from current stored posture and is not persisted as a mission replay event.",
  };
}

export function dedupe(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}
