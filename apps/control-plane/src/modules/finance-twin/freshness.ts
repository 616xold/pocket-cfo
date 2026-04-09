import type {
  FinanceFreshnessSummary,
  FinanceFreshnessView,
  FinanceTwinSyncRunRecord,
} from "@pocket-cto/domain";

const TRIAL_BALANCE_STALE_AFTER_SECONDS = 24 * 60 * 60;

export function buildFinanceFreshnessView(input: {
  latestRun: FinanceTwinSyncRunRecord | null;
  latestSuccessfulRun: FinanceTwinSyncRunRecord | null;
  now: Date;
}): FinanceFreshnessView {
  const trialBalance = buildFinanceFreshnessSummary(input);

  return {
    overall: trialBalance,
    trialBalance,
  };
}

function buildFinanceFreshnessSummary(input: {
  latestRun: FinanceTwinSyncRunRecord | null;
  latestSuccessfulRun: FinanceTwinSyncRunRecord | null;
  now: Date;
}): FinanceFreshnessSummary {
  const latestCompletedAt = input.latestRun?.completedAt ?? null;
  const latestSuccessfulCompletedAt =
    input.latestSuccessfulRun?.completedAt ??
    input.latestSuccessfulRun?.startedAt ??
    null;
  const ageSeconds = latestSuccessfulCompletedAt
    ? diffSeconds(input.now, latestSuccessfulCompletedAt)
    : null;

  if (!input.latestRun) {
    return {
      state: "missing",
      latestSyncRunId: null,
      latestSyncStatus: null,
      latestCompletedAt: null,
      latestSuccessfulSyncRunId: null,
      latestSuccessfulCompletedAt: null,
      ageSeconds: null,
      staleAfterSeconds: TRIAL_BALANCE_STALE_AFTER_SECONDS,
      reasonCode: "not_synced",
      reasonSummary:
        "No finance twin sync has been recorded yet for the trial-balance slice.",
    };
  }

  if (input.latestRun.status === "failed") {
    return {
      state: "failed",
      latestSyncRunId: input.latestRun.id,
      latestSyncStatus: input.latestRun.status,
      latestCompletedAt,
      latestSuccessfulSyncRunId: input.latestSuccessfulRun?.id ?? null,
      latestSuccessfulCompletedAt,
      ageSeconds,
      staleAfterSeconds: TRIAL_BALANCE_STALE_AFTER_SECONDS,
      reasonCode: "latest_sync_failed",
      reasonSummary: input.latestSuccessfulRun
        ? "The latest trial-balance sync failed after an earlier successful snapshot was stored."
        : "The latest trial-balance sync failed before any successful finance snapshot was stored.",
    };
  }

  if (!input.latestSuccessfulRun || !latestSuccessfulCompletedAt) {
    return {
      state: "missing",
      latestSyncRunId: input.latestRun.id,
      latestSyncStatus: input.latestRun.status,
      latestCompletedAt,
      latestSuccessfulSyncRunId: null,
      latestSuccessfulCompletedAt: null,
      ageSeconds: null,
      staleAfterSeconds: TRIAL_BALANCE_STALE_AFTER_SECONDS,
      reasonCode: "no_successful_sync",
      reasonSummary:
        "No successful trial-balance sync has completed yet for this company.",
    };
  }

  const stale = ageSeconds !== null && ageSeconds > TRIAL_BALANCE_STALE_AFTER_SECONDS;

  return {
    state: stale ? "stale" : "fresh",
    latestSyncRunId: input.latestRun.id,
    latestSyncStatus: input.latestRun.status,
    latestCompletedAt,
    latestSuccessfulSyncRunId: input.latestSuccessfulRun.id,
    latestSuccessfulCompletedAt,
    ageSeconds,
    staleAfterSeconds: TRIAL_BALANCE_STALE_AFTER_SECONDS,
    reasonCode: stale ? "latest_successful_sync_stale" : "latest_successful_sync_fresh",
    reasonSummary: stale
      ? "The latest successful trial-balance sync is older than the 24 hour freshness window."
      : "The latest successful trial-balance sync is within the 24 hour freshness window.",
  };
}

function diffSeconds(now: Date, earlierIso: string) {
  return Math.max(
    0,
    Math.floor((now.getTime() - new Date(earlierIso).getTime()) / 1000),
  );
}
