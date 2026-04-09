import { describe, expect, it } from "vitest";
import {
  FinanceTwinCompanySummarySchema,
  FinanceTwinSyncInputSchema,
} from "./finance-twin";

describe("finance twin domain schemas", () => {
  it("parses sync input with an optional company name", () => {
    const parsed = FinanceTwinSyncInputSchema.parse({
      companyName: "Acme Holdings",
    });

    expect(parsed.companyName).toBe("Acme Holdings");
  });

  it("parses a company summary with freshness, coverage, and limitations", () => {
    const parsed = FinanceTwinCompanySummarySchema.parse({
      company: {
        id: "11111111-1111-4111-8111-111111111111",
        companyKey: "acme",
        displayName: "Acme",
        createdAt: "2026-04-09T00:00:00.000Z",
        updatedAt: "2026-04-09T00:00:00.000Z",
      },
      latestSource: {
        sourceId: "22222222-2222-4222-8222-222222222222",
        sourceSnapshotId: "33333333-3333-4333-8333-333333333333",
        sourceFileId: "44444444-4444-4444-8444-444444444444",
        syncRunId: "55555555-5555-4555-8555-555555555555",
      },
      latestSyncRun: {
        id: "55555555-5555-4555-8555-555555555555",
        companyId: "11111111-1111-4111-8111-111111111111",
        reportingPeriodId: "66666666-6666-4666-8666-666666666666",
        sourceId: "22222222-2222-4222-8222-222222222222",
        sourceSnapshotId: "33333333-3333-4333-8333-333333333333",
        sourceFileId: "44444444-4444-4444-8444-444444444444",
        extractorKey: "trial_balance_csv",
        status: "succeeded",
        startedAt: "2026-04-09T00:00:00.000Z",
        completedAt: "2026-04-09T00:00:03.000Z",
        stats: {
          trialBalanceLineCount: 2,
        },
        errorSummary: null,
        createdAt: "2026-04-09T00:00:00.000Z",
      },
      latestReportingPeriod: {
        id: "66666666-6666-4666-8666-666666666666",
        companyId: "11111111-1111-4111-8111-111111111111",
        periodKey: "2026-03-31",
        label: "Trial balance as of 2026-03-31",
        periodStart: null,
        periodEnd: "2026-03-31",
        createdAt: "2026-04-09T00:00:00.000Z",
        updatedAt: "2026-04-09T00:00:00.000Z",
      },
      freshness: {
        overall: {
          state: "fresh",
          latestSyncRunId: "55555555-5555-4555-8555-555555555555",
          latestSyncStatus: "succeeded",
          latestCompletedAt: "2026-04-09T00:00:03.000Z",
          latestSuccessfulSyncRunId: "55555555-5555-4555-8555-555555555555",
          latestSuccessfulCompletedAt: "2026-04-09T00:00:03.000Z",
          ageSeconds: 1,
          staleAfterSeconds: 86400,
          reasonCode: "latest_successful_sync_fresh",
          reasonSummary: "Fresh",
        },
        trialBalance: {
          state: "fresh",
          latestSyncRunId: "55555555-5555-4555-8555-555555555555",
          latestSyncStatus: "succeeded",
          latestCompletedAt: "2026-04-09T00:00:03.000Z",
          latestSuccessfulSyncRunId: "55555555-5555-4555-8555-555555555555",
          latestSuccessfulCompletedAt: "2026-04-09T00:00:03.000Z",
          ageSeconds: 1,
          staleAfterSeconds: 86400,
          reasonCode: "latest_successful_sync_fresh",
          reasonSummary: "Fresh",
        },
      },
      coverage: {
        reportingPeriodCount: 1,
        ledgerAccountCount: 2,
        trialBalanceLineCount: 2,
        lineageCount: 5,
      },
      trialBalance: {
        accountCount: 2,
        lineCount: 2,
        totalDebitAmount: "100.00",
        totalCreditAmount: "100.00",
        totalNetAmount: "0.00",
        currencyCode: "USD",
      },
      limitations: ["Only trial-balance CSV extraction is implemented."],
    });

    expect(parsed.freshness.trialBalance.state).toBe("fresh");
    expect(parsed.coverage.trialBalanceLineCount).toBe(2);
  });
});
