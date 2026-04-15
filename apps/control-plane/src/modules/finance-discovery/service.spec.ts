import { describe, expect, it } from "vitest";
import {
  CfoWikiPageViewSchema,
  FinanceBankAccountInventoryViewSchema,
  FinanceCashPostureViewSchema,
  type FinanceBankAccountInventoryView,
  type FinanceCashPostureView,
} from "@pocket-cto/domain";
import { CfoWikiPageNotFoundError } from "../wiki/errors";
import { FinanceDiscoveryService } from "./service";

type TestWikiPageKey =
  | "company/overview"
  | "concepts/cash"
  | "metrics/cash-posture";

describe("FinanceDiscoveryService", () => {
  it("builds a deterministic cash-posture answer from stored finance and wiki state", async () => {
    const service = new FinanceDiscoveryService({
      cfoWikiService: {
        async getPage(companyKey, pageKey) {
          return buildWikiPage({
            companyKey,
            pageKey: pageKey as TestWikiPageKey,
            title:
              pageKey === "metrics/cash-posture"
                ? "Cash posture"
                : pageKey === "concepts/cash"
                  ? "Cash"
                  : "Company overview",
          });
        },
      },
      financeTwinService: {
        async getBankAccounts() {
          return buildBankAccountsView();
        },
        async getCashPosture() {
          return buildCashPostureView();
        },
      },
    });

    const answer = await service.answerQuestion({
      companyKey: "acme",
      questionKind: "cash_posture",
      operatorPrompt: "What is our current cash posture?",
    });

    expect(answer.answerSummary).toContain("Stored cash posture for acme covers 4 bank accounts");
    expect(answer.freshnessPosture).toEqual({
      state: "fresh",
      reasonSummary: "Stored bank-account summary state is fresh.",
    });
    expect(answer.relatedRoutes.map((route) => route.routePath)).toEqual([
      "/finance-twin/companies/acme/cash-posture",
      "/finance-twin/companies/acme/bank-accounts",
    ]);
    expect(answer.relatedWikiPages.map((page) => page.pageKey)).toEqual([
      "metrics/cash-posture",
      "concepts/cash",
      "company/overview",
    ]);
    expect(answer.evidenceSections.map((section) => section.key)).toEqual([
      "cash_posture_route",
      "bank_account_inventory_route",
      "wiki_metrics_cash-posture",
      "wiki_concepts_cash",
      "wiki_company_overview",
    ]);
    expect(answer.bodyMarkdown).toContain("## Freshness posture");
    expect(answer.bodyMarkdown).toContain("## Evidence sections");
  });

  it("persists a truthful limited answer when the stored cash posture is stale and partial", async () => {
    const service = new FinanceDiscoveryService({
      cfoWikiService: {
        async getPage(companyKey, pageKey) {
          return buildWikiPage({
            companyKey,
            pageKey: pageKey as TestWikiPageKey,
            title: "Cash posture",
          });
        },
      },
      financeTwinService: {
        async getBankAccounts() {
          return buildBankAccountsView({
            accountCount: 0,
            accounts: [],
            limitations: ["No successful bank-account-summary slice exists yet for this company."],
          });
        },
        async getCashPosture() {
          return buildCashPostureView({
            currencyBuckets: [],
            freshness: {
              state: "stale",
              reasonSummary:
                "The latest bank-account summary sync is older than the freshness threshold.",
            },
            coverageSummary: {
              bankAccountCount: 0,
              reportedBalanceCount: 0,
              statementOrLedgerBalanceCount: 0,
              availableBalanceCount: 0,
              unspecifiedBalanceCount: 0,
              datedBalanceCount: 0,
              undatedBalanceCount: 0,
              currencyBucketCount: 0,
              mixedAsOfDateCurrencyBucketCount: 0,
            },
            limitations: [
              "No successful bank-account-summary slice exists yet for this company.",
            ],
          });
        },
      },
    });

    const answer = await service.answerQuestion({
      companyKey: "acme",
      questionKind: "cash_posture",
    });

    expect(answer.freshnessPosture.state).toBe("stale");
    expect(answer.answerSummary).toContain("is limited");
    expect(answer.limitations).toContain(
      "No persisted bank-account summary rows are available yet for acme.",
    );
  });

  it("keeps missing related wiki pages visible without failing the answer", async () => {
    const service = new FinanceDiscoveryService({
      cfoWikiService: {
        async getPage(companyKey, pageKey) {
          if (pageKey === "company/overview") {
            throw new CfoWikiPageNotFoundError(companyKey, pageKey);
          }

          return buildWikiPage({
            companyKey,
            pageKey: pageKey as TestWikiPageKey,
            title: pageKey === "metrics/cash-posture" ? "Cash posture" : "Cash",
          });
        },
      },
      financeTwinService: {
        async getBankAccounts() {
          return buildBankAccountsView();
        },
        async getCashPosture() {
          return buildCashPostureView();
        },
      },
    });

    const answer = await service.answerQuestion({
      companyKey: "acme",
      questionKind: "cash_posture",
    });

    expect(answer.relatedWikiPages.map((page) => page.pageKey)).toEqual([
      "metrics/cash-posture",
      "concepts/cash",
    ]);
    expect(answer.limitations).toContain(
      "CFO Wiki page company/overview is not available yet for acme.",
    );
  });
});

function buildCashPostureView(input?: {
  coverageSummary?: Partial<FinanceCashPostureView["coverageSummary"]>;
  currencyBuckets?: FinanceCashPostureView["currencyBuckets"];
  freshness?: {
    reasonSummary: string;
    state: FinanceCashPostureView["freshness"]["state"];
  };
  limitations?: string[];
}): FinanceCashPostureView {
  return FinanceCashPostureViewSchema.parse({
    company: {
      id: "11111111-1111-4111-8111-111111111111",
      companyKey: "acme",
      displayName: "Acme",
      createdAt: "2026-04-15T00:00:00.000Z",
      updatedAt: "2026-04-15T00:00:00.000Z",
    },
    latestAttemptedSyncRun: null,
    latestSuccessfulBankSummarySlice: {
      latestSource: null,
      latestSyncRun: null,
      coverage: {
        bankAccountCount: 4,
        summaryRowCount: 4,
        lineageCount: 4,
      },
      summary: null,
    },
    freshness: {
      state: input?.freshness?.state ?? "fresh",
      latestSyncRunId: null,
      latestSyncStatus: null,
      latestCompletedAt: null,
      latestSuccessfulSyncRunId: null,
      latestSuccessfulCompletedAt: null,
      ageSeconds: null,
      staleAfterSeconds: 86400,
      reasonCode: "test",
      reasonSummary:
        input?.freshness?.reasonSummary ?? "Stored bank-account summary state is fresh.",
    },
    currencyBuckets:
      input?.currencyBuckets ??
      [
        {
          currency: "USD",
          statementOrLedgerBalanceTotal: "1200.00",
          availableBalanceTotal: "1400.00",
          unspecifiedBalanceTotal: "250.00",
          accountCount: 3,
          datedAccountCount: 2,
          undatedAccountCount: 1,
          mixedAsOfDates: true,
          earliestAsOfDate: "2026-04-10",
          latestAsOfDate: "2026-04-11",
        },
        {
          currency: "EUR",
          statementOrLedgerBalanceTotal: "300.00",
          availableBalanceTotal: "0.00",
          unspecifiedBalanceTotal: "0.00",
          accountCount: 1,
          datedAccountCount: 1,
          undatedAccountCount: 0,
          mixedAsOfDates: false,
          earliestAsOfDate: "2026-04-09",
          latestAsOfDate: "2026-04-09",
        },
      ],
    coverageSummary: {
      bankAccountCount: 4,
      reportedBalanceCount: 4,
      statementOrLedgerBalanceCount: 2,
      availableBalanceCount: 1,
      unspecifiedBalanceCount: 1,
      datedBalanceCount: 3,
      undatedBalanceCount: 1,
      currencyBucketCount: 2,
      mixedAsOfDateCurrencyBucketCount: 1,
      ...input?.coverageSummary,
    },
    diagnostics: [],
    limitations: input?.limitations ?? [
      "Cash posture is grouped by reported currency only; this route does not perform FX conversion or emit one company-wide cash total.",
    ],
  });
}

function buildBankAccountsView(input?: {
  accountCount?: number;
  accounts?: FinanceBankAccountInventoryView["accounts"];
  limitations?: string[];
}): FinanceBankAccountInventoryView {
  return FinanceBankAccountInventoryViewSchema.parse({
    company: {
      id: "11111111-1111-4111-8111-111111111111",
      companyKey: "acme",
      displayName: "Acme",
      createdAt: "2026-04-15T00:00:00.000Z",
      updatedAt: "2026-04-15T00:00:00.000Z",
    },
    latestAttemptedSyncRun: null,
    latestSuccessfulSlice: {
      latestSource: null,
      latestSyncRun: null,
      coverage: {
        bankAccountCount: 4,
        summaryRowCount: 4,
        lineageCount: 4,
        lineageTargetCounts: undefined,
      },
      summary: null,
    },
    freshness: {
      state: "fresh",
      latestSyncRunId: null,
      latestSyncStatus: null,
      latestCompletedAt: null,
      latestSuccessfulSyncRunId: null,
      latestSuccessfulCompletedAt: null,
      ageSeconds: null,
      staleAfterSeconds: 86400,
      reasonCode: "test",
      reasonSummary: "Stored bank-account summary state is fresh.",
    },
    accountCount: input?.accountCount ?? 4,
    accounts:
      input?.accounts ??
      [
        {
          bankAccount: {
            id: "22222222-2222-4222-8222-222222222222",
            companyId: "11111111-1111-4111-8111-111111111111",
            accountLabel: "Operating Checking",
            institutionName: "Acme Bank",
            externalAccountId: "bank-account-1",
            accountNumberLast4: "1234",
            createdAt: "2026-04-15T00:00:00.000Z",
            updatedAt: "2026-04-15T00:00:00.000Z",
          },
          reportedBalances: [
            {
              summary: {
                id: "33333333-3333-4333-8333-333333333333",
                companyId: "11111111-1111-4111-8111-111111111111",
                bankAccountId: "22222222-2222-4222-8222-222222222222",
                syncRunId: "44444444-4444-4444-8444-444444444444",
                lineNumber: 1,
                balanceType: "statement_or_ledger",
                balanceAmount: "1200.00",
                currencyCode: "USD",
                asOfDate: "2026-04-11",
                asOfDateSourceColumn: "as_of_date",
                balanceSourceColumn: "balance",
                observedAt: "2026-04-15T00:00:00.000Z",
                createdAt: "2026-04-15T00:00:00.000Z",
                updatedAt: "2026-04-15T00:00:00.000Z",
              },
              lineageRef: {
                targetKind: "bank_account_summary",
                targetId: "33333333-3333-4333-8333-333333333333",
                syncRunId: "44444444-4444-4444-8444-444444444444",
              },
            },
          ],
          currencyCodes: ["USD"],
          knownAsOfDates: ["2026-04-11"],
          unknownAsOfDateBalanceCount: 0,
          hasMixedAsOfDates: false,
        },
      ],
    diagnostics: [],
    limitations: input?.limitations ?? [],
  });
}

function buildWikiPage(input: {
  companyKey: string;
  pageKey: TestWikiPageKey;
  title: string;
}) {
  return CfoWikiPageViewSchema.parse({
    companyId: "11111111-1111-4111-8111-111111111111",
    companyKey: input.companyKey,
    companyDisplayName: "Acme",
    page: {
      id: "55555555-5555-4555-8555-555555555555",
      companyId: "11111111-1111-4111-8111-111111111111",
      compileRunId: "66666666-6666-4666-8666-666666666666",
      pageKey: input.pageKey,
      pageKind:
        input.pageKey === "metrics/cash-posture"
          ? "metric_definition"
          : input.pageKey === "concepts/cash"
            ? "concept"
            : "company_overview",
      ownershipKind: "compiler_owned",
      temporalStatus: "current",
      title: input.title,
      summary: `${input.title} summary`,
      markdownBody: `# ${input.title}`,
      freshnessSummary: {
        state: "fresh",
        summary: "Page freshness is current.",
      },
      limitations: [],
      lastCompiledAt: "2026-04-15T00:00:00.000Z",
      filedMetadata: null,
      createdAt: "2026-04-15T00:00:00.000Z",
      updatedAt: "2026-04-15T00:00:00.000Z",
      markdownPath: `${input.pageKey}.md`,
    },
    links: [],
    backlinks: [],
    refs: [],
    latestCompileRun: null,
    freshnessSummary: {
      state: "fresh",
      summary: "Page freshness is current.",
    },
    limitations: [],
  });
}
