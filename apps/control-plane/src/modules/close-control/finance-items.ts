import {
  CloseControlChecklistItemSchema,
  type CloseControlChecklistItem,
  type CloseControlChecklistItemFamily,
  type CloseControlProofPostureState,
  type CloseControlSourcePostureState,
  type FinanceCashPostureView,
  type FinanceCollectionsPostureView,
  type FinanceFreshnessSummary,
  type FinancePayablesPostureView,
  type FinanceTwinSourceRef,
} from "@pocket-cto/domain";
import { buildFinanceTwinRefs, buildProofSummary, dedupe } from "./utils";

type FinanceItemFamily = Exclude<
  CloseControlChecklistItemFamily,
  | "source_coverage_review"
  | "policy_source_freshness_review"
  | "monitor_replay_readiness"
>;

export function buildCashItem(view: FinanceCashPostureView) {
  const blockingGap =
    view.coverageSummary.bankAccountCount === 0 ||
    view.coverageSummary.reportedBalanceCount === 0;
  return buildFinanceItem({
    family: "cash_source_freshness_review",
    freshness: view.freshness,
    hasBlockingCoverageGap: blockingGap,
    hasReviewCoverageGap: view.diagnostics.length > 0,
    latestSource: view.latestSuccessfulBankSummarySlice.latestSource,
    limitations: [...view.limitations, ...view.diagnostics],
    readySummary:
      "Stored bank-account-summary posture is present, fresh, and source-backed for cash review.",
    reviewNextStep:
      "Review cash source freshness, bank-account-summary coverage, and lineage before relying on close/control cash posture.",
    sourceLabel: "bank-account-summary",
  });
}

export function buildCollectionsItem(view: FinanceCollectionsPostureView) {
  const coverage = view.coverageSummary;
  const blockingGap =
    coverage.rowCount === 0 ||
    coverage.customerCount === 0 ||
    coverage.currencyBucketCount === 0;
  const reviewGap =
    view.diagnostics.length > 0 ||
    coverage.rowsWithComputablePastDueCount === 0 ||
    coverage.rowsWithComputablePastDueCount < coverage.rowCount ||
    coverage.rowsWithPartialPastDueOnlyCount > 0;
  return buildFinanceItem({
    family: "receivables_aging_source_freshness_review",
    freshness: view.freshness,
    hasBlockingCoverageGap: blockingGap,
    hasReviewCoverageGap: reviewGap,
    latestSource: view.latestSuccessfulReceivablesAgingSlice.latestSource,
    limitations: [...view.limitations, ...view.diagnostics],
    readySummary:
      "Stored receivables-aging posture is present, fresh, and source-backed for collections review.",
    reviewNextStep:
      "Review receivables-aging source freshness, coverage, data-quality diagnostics, and lineage before relying on close/control receivables posture.",
    sourceLabel: "receivables-aging",
  });
}

export function buildPayablesItem(view: FinancePayablesPostureView) {
  const coverage = view.coverageSummary;
  const blockingGap =
    coverage.rowCount === 0 ||
    coverage.vendorCount === 0 ||
    coverage.currencyBucketCount === 0;
  const reviewGap =
    view.diagnostics.length > 0 ||
    coverage.rowsWithComputablePastDueCount === 0 ||
    coverage.rowsWithComputablePastDueCount < coverage.rowCount ||
    coverage.rowsWithPartialPastDueOnlyCount > 0;
  return buildFinanceItem({
    family: "payables_aging_source_freshness_review",
    freshness: view.freshness,
    hasBlockingCoverageGap: blockingGap,
    hasReviewCoverageGap: reviewGap,
    latestSource: view.latestSuccessfulPayablesAgingSlice.latestSource,
    limitations: [...view.limitations, ...view.diagnostics],
    readySummary:
      "Stored payables-aging posture is present, fresh, and source-backed for payables review.",
    reviewNextStep:
      "Review payables-aging source freshness, coverage, data-quality diagnostics, and lineage before relying on close/control payables posture.",
    sourceLabel: "payables-aging",
  });
}

function buildFinanceItem(input: {
  family: FinanceItemFamily;
  freshness: FinanceFreshnessSummary;
  hasBlockingCoverageGap: boolean;
  hasReviewCoverageGap: boolean;
  latestSource: FinanceTwinSourceRef | null;
  limitations: string[];
  readySummary: string;
  reviewNextStep: string;
  sourceLabel: string;
}) {
  const status = mapStatus(input);
  const proofState = mapProofState(input);
  const refs = buildFinanceTwinRefs(input.latestSource, input.sourceLabel);

  return CloseControlChecklistItemSchema.parse({
    family: input.family,
    status,
    sourcePosture: {
      state: mapSourcePostureState(input),
      summary:
        status === "ready_for_review"
          ? input.readySummary
          : `${input.sourceLabel} posture requires human review before close/control reliance.`,
      refs,
    },
    evidenceBasis: {
      basisKind: "stored_finance_twin_posture",
      summary: `Derived from the stored Finance Twin ${input.sourceLabel} posture only.`,
      refs,
    },
    freshnessSummary: {
      state: input.freshness.state,
      summary: input.freshness.reasonSummary,
      latestObservedAt:
        input.freshness.latestSuccessfulCompletedAt ??
        input.freshness.latestCompletedAt ??
        null,
    },
    limitations: dedupe([
      ...input.limitations,
      "No finance facts are inferred beyond stored Finance Twin source posture.",
    ]),
    humanReviewNextStep: input.reviewNextStep,
    proofPosture: {
      state: proofState,
      summary: buildProofSummary(proofState, input.sourceLabel),
    },
  });
}

function mapStatus(input: {
  freshness: FinanceFreshnessSummary;
  hasBlockingCoverageGap: boolean;
  hasReviewCoverageGap: boolean;
}): CloseControlChecklistItem["status"] {
  if (
    input.freshness.state === "missing" ||
    input.freshness.state === "failed" ||
    input.hasBlockingCoverageGap
  ) {
    return "blocked_by_evidence";
  }

  if (input.freshness.state === "stale" || input.hasReviewCoverageGap) {
    return "needs_review";
  }

  return "ready_for_review";
}

function mapSourcePostureState(input: {
  freshness: FinanceFreshnessSummary;
  hasBlockingCoverageGap: boolean;
  hasReviewCoverageGap: boolean;
}): CloseControlSourcePostureState {
  if (input.freshness.state === "missing" || input.hasBlockingCoverageGap) {
    return "missing_source";
  }
  if (input.freshness.state === "failed") {
    return "failed_source";
  }
  if (input.freshness.state === "stale") {
    return "stale_source";
  }
  if (input.hasReviewCoverageGap) {
    return "limited_source";
  }
  return "source_backed";
}

function mapProofState(input: {
  freshness: FinanceFreshnessSummary;
  hasBlockingCoverageGap: boolean;
  hasReviewCoverageGap: boolean;
}): CloseControlProofPostureState {
  if (input.freshness.state === "missing") {
    return "limited_by_missing_source";
  }
  if (input.freshness.state === "failed") {
    return "limited_by_failed_source";
  }
  if (input.freshness.state === "stale") {
    return "limited_by_stale_source";
  }
  if (input.hasBlockingCoverageGap) {
    return "limited_by_coverage_gap";
  }
  if (input.hasReviewCoverageGap) {
    return "limited_by_data_quality_gap";
  }
  return "source_backed";
}
