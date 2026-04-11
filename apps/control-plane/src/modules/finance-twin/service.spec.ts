import { describe, expect, it } from "vitest";
import { SourceRegistryService } from "../sources/service";
import { InMemorySourceRepository } from "../sources/repository";
import { InMemorySourceFileStorage } from "../sources/storage";
import {
  FinanceCompanyNotFoundError,
  FinanceTwinUnsupportedSourceError,
} from "./errors";
import { InMemoryFinanceTwinRepository } from "./repository";
import { FinanceTwinService } from "./service";

describe("FinanceTwinService", () => {
  it("syncs one uploaded chart-of-accounts CSV into persisted account-catalog state", async () => {
    const now = () => new Date("2026-04-10T09:15:00.000Z");
    const sourceRepository = new InMemorySourceRepository();
    const sourceStorage = new InMemorySourceFileStorage();
    const sourceService = new SourceRegistryService(
      sourceRepository,
      sourceStorage,
      now,
    );
    const financeRepository = new InMemoryFinanceTwinRepository();
    const financeTwinService = new FinanceTwinService({
      financeTwinRepository: financeRepository,
      sourceFileStorage: sourceStorage,
      sourceRepository,
      now,
    });
    const created = await sourceService.createSource({
      kind: "dataset",
      name: "Chart of accounts",
      createdBy: "finance-operator",
      originKind: "manual",
      snapshot: {
        originalFileName: "chart-of-accounts-link.txt",
        mediaType: "text/plain",
        sizeBytes: 18,
        checksumSha256:
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        storageKind: "external_url",
        storageRef: "https://example.com/chart-of-accounts",
        ingestStatus: "registered",
      },
    });
    const registered = await sourceService.registerSourceFile(
      created.source.id,
      {
        originalFileName: "chart-of-accounts.csv",
        mediaType: "text/csv",
        createdBy: "finance-operator",
      },
      Buffer.from(
        [
          "account_code,account_name,account_type,detail_type,parent_account_code,is_active,description",
          "1000,Cash,asset,current_asset,,true,Operating cash",
          "1100,Petty Cash,asset,current_asset,1000,false,Small cash drawer",
        ].join("\n"),
      ),
    );

    const synced = await financeTwinService.syncCompanySourceFile(
      "acme",
      registered.sourceFile.id,
      {
        companyName: "Acme Holdings",
      },
    );
    const summary = await financeTwinService.getCompanySummary("acme");
    const accountCatalog = await financeTwinService.getAccountCatalog("acme");

    expect(synced).toMatchObject({
      company: {
        companyKey: "acme",
        displayName: "Acme Holdings",
      },
      syncRun: {
        status: "succeeded",
        sourceFileId: registered.sourceFile.id,
        extractorKey: "chart_of_accounts_csv",
      },
      companyTotals: {
        reportingPeriodCount: 0,
        ledgerAccountCount: 2,
      },
      latestSuccessfulSlices: {
        chartOfAccounts: {
          coverage: {
            accountCatalogEntryCount: 2,
            lineageCount: 4,
          },
          summary: {
            accountCount: 2,
            activeAccountCount: 1,
            inactiveAccountCount: 1,
            parentLinkedCount: 1,
          },
        },
      },
    });
    expect(summary).toMatchObject({
      company: {
        companyKey: "acme",
      },
      freshness: {
        overall: {
          state: "missing",
        },
        trialBalance: {
          state: "missing",
        },
        chartOfAccounts: {
          state: "fresh",
        },
        generalLedger: {
          state: "missing",
        },
      },
      latestAttemptedSlices: {
        chartOfAccounts: {
          latestSyncRun: {
            id: synced.syncRun.id,
            status: "succeeded",
          },
        },
      },
      companyTotals: {
        reportingPeriodCount: 0,
        ledgerAccountCount: 2,
      },
      latestSuccessfulSlices: {
        chartOfAccounts: {
          coverage: {
            accountCatalogEntryCount: 2,
          },
        },
      },
    });
    expect(accountCatalog).toMatchObject({
      company: {
        companyKey: "acme",
      },
      latestSuccessfulSlice: {
        coverage: {
          accountCatalogEntryCount: 2,
          lineageCount: 4,
        },
      },
      freshness: {
        state: "fresh",
      },
      accounts: [
        {
          ledgerAccount: {
            accountCode: "1000",
            accountName: "Cash",
          },
          catalogEntry: {
            detailType: "current_asset",
            description: "Operating cash",
            parentAccountCode: null,
            isActive: true,
          },
        },
        {
          ledgerAccount: {
            accountCode: "1100",
            accountName: "Petty Cash",
          },
          catalogEntry: {
            parentAccountCode: "1000",
            isActive: false,
          },
        },
      ],
    });
  });

  it("syncs one uploaded trial-balance CSV and leaves the other slices missing", async () => {
    const now = () => new Date("2026-04-09T23:15:00.000Z");
    const sourceRepository = new InMemorySourceRepository();
    const sourceStorage = new InMemorySourceFileStorage();
    const sourceService = new SourceRegistryService(
      sourceRepository,
      sourceStorage,
      now,
    );
    const financeRepository = new InMemoryFinanceTwinRepository();
    const financeTwinService = new FinanceTwinService({
      financeTwinRepository: financeRepository,
      sourceFileStorage: sourceStorage,
      sourceRepository,
      now,
    });
    const created = await sourceService.createSource({
      kind: "dataset",
      name: "March trial balance",
      createdBy: "finance-operator",
      originKind: "manual",
      snapshot: {
        originalFileName: "march-trial-balance-link.txt",
        mediaType: "text/plain",
        sizeBytes: 18,
        checksumSha256:
          "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        storageKind: "external_url",
        storageRef: "https://example.com/march-trial-balance",
        ingestStatus: "registered",
      },
    });
    const registered = await sourceService.registerSourceFile(
      created.source.id,
      {
        originalFileName: "march-trial-balance.csv",
        mediaType: "text/csv",
        createdBy: "finance-operator",
      },
      Buffer.from(
        [
          "account_code,account_name,period_end,debit,credit,currency_code,account_type",
          "1000,Cash,2026-03-31,125000.00,0.00,USD,asset",
          "2000,Accounts Payable,2026-03-31,0.00,42000.00,USD,liability",
        ].join("\n"),
      ),
    );

    const synced = await financeTwinService.syncCompanySourceFile(
      "acme",
      registered.sourceFile.id,
      {
        companyName: "Acme Holdings",
      },
    );
    const summary = await financeTwinService.getCompanySummary("acme");

    expect(synced).toMatchObject({
      syncRun: {
        extractorKey: "trial_balance_csv",
        status: "succeeded",
      },
      companyTotals: {
        reportingPeriodCount: 1,
        ledgerAccountCount: 2,
      },
      latestSuccessfulSlices: {
        trialBalance: {
          coverage: {
            lineCount: 2,
            lineageCount: 5,
          },
          summary: {
            accountCount: 2,
            lineCount: 2,
            totalDebitAmount: "125000.00",
            totalCreditAmount: "42000.00",
            totalNetAmount: "83000.00",
          },
        },
      },
    });
    expect(summary).toMatchObject({
      freshness: {
        overall: {
          state: "missing",
        },
        trialBalance: {
          state: "fresh",
        },
        chartOfAccounts: {
          state: "missing",
        },
        generalLedger: {
          state: "missing",
        },
      },
      latestSuccessfulSlices: {
        trialBalance: {
          coverage: {
            lineCount: 2,
          },
        },
        chartOfAccounts: {
          coverage: {
            accountCatalogEntryCount: 0,
          },
        },
        generalLedger: {
          coverage: {
            journalEntryCount: 0,
            journalLineCount: 0,
          },
        },
      },
    });
  });

  it("syncs one uploaded general-ledger CSV into persisted journal state", async () => {
    const now = () => new Date("2026-04-11T08:00:00.000Z");
    const sourceRepository = new InMemorySourceRepository();
    const sourceStorage = new InMemorySourceFileStorage();
    const sourceService = new SourceRegistryService(
      sourceRepository,
      sourceStorage,
      now,
    );
    const financeRepository = new InMemoryFinanceTwinRepository();
    const financeTwinService = new FinanceTwinService({
      financeTwinRepository: financeRepository,
      sourceFileStorage: sourceStorage,
      sourceRepository,
      now,
    });
    const created = await sourceService.createSource({
      kind: "dataset",
      name: "General ledger",
      createdBy: "finance-operator",
      originKind: "manual",
      snapshot: {
        originalFileName: "general-ledger-link.txt",
        mediaType: "text/plain",
        sizeBytes: 18,
        checksumSha256:
          "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
        storageKind: "external_url",
        storageRef: "https://example.com/general-ledger",
        ingestStatus: "registered",
      },
    });
    const registered = await sourceService.registerSourceFile(
      created.source.id,
      {
        originalFileName: "general-ledger.csv",
        mediaType: "text/csv",
        createdBy: "finance-operator",
      },
      Buffer.from(
        [
          "journal_id,transaction_date,account_code,account_name,debit,credit,currency_code,memo",
          "J-100,2026-03-31,1000,Cash,100.00,0.00,USD,Seed funding received",
          "J-100,2026-03-31,3000,Common Stock,0.00,100.00,USD,Seed funding received",
          "J-101,2026-04-01,6100,,25.00,0.00,USD,Office expense",
        ].join("\n"),
      ),
    );

    const synced = await financeTwinService.syncCompanySourceFile(
      "acme",
      registered.sourceFile.id,
      {
        companyName: "Acme Holdings",
      },
    );
    const summary = await financeTwinService.getCompanySummary("acme");
    const generalLedger = await financeTwinService.getGeneralLedger("acme");

    expect(synced).toMatchObject({
      syncRun: {
        extractorKey: "general_ledger_csv",
        status: "succeeded",
      },
      latestSuccessfulSlices: {
        generalLedger: {
          coverage: {
            journalEntryCount: 2,
            journalLineCount: 3,
            lineageCount: 8,
          },
          summary: {
            journalEntryCount: 2,
            journalLineCount: 3,
            ledgerAccountCount: 3,
            totalDebitAmount: "125.00",
            totalCreditAmount: "100.00",
            earliestEntryDate: "2026-03-31",
            latestEntryDate: "2026-04-01",
            currencyCode: "USD",
          },
        },
      },
    });
    expect(summary).toMatchObject({
      freshness: {
        overall: {
          state: "missing",
        },
        generalLedger: {
          state: "fresh",
        },
      },
      latestAttemptedSlices: {
        generalLedger: {
          latestSyncRun: {
            id: synced.syncRun.id,
            status: "succeeded",
          },
        },
      },
      latestSuccessfulSlices: {
        generalLedger: {
          coverage: {
            journalEntryCount: 2,
            journalLineCount: 3,
            lineageCount: 8,
          },
        },
      },
    });
    expect(generalLedger).toMatchObject({
      company: {
        companyKey: "acme",
        displayName: "Acme Holdings",
      },
      latestAttemptedSyncRun: {
        id: synced.syncRun.id,
        extractorKey: "general_ledger_csv",
      },
      latestSuccessfulSlice: {
        coverage: {
          journalEntryCount: 2,
          journalLineCount: 3,
          lineageCount: 8,
        },
      },
      freshness: {
        state: "fresh",
      },
      entries: [
        {
          journalEntry: {
            externalEntryId: "J-100",
            transactionDate: "2026-03-31",
          },
          lines: [
            {
              ledgerAccount: {
                accountCode: "1000",
                accountName: "Cash",
              },
            },
            {
              ledgerAccount: {
                accountCode: "3000",
                accountName: "Common Stock",
              },
            },
          ],
        },
        {
          journalEntry: {
            externalEntryId: "J-101",
            transactionDate: "2026-04-01",
          },
          lines: [
            {
              ledgerAccount: {
                accountCode: "6100",
                accountName: null,
              },
            },
          ],
        },
      ],
    });
  });

  it("preserves an existing company display name when a later sync omits companyName", async () => {
    const now = () => new Date("2026-04-11T10:00:00.000Z");
    const sourceRepository = new InMemorySourceRepository();
    const sourceStorage = new InMemorySourceFileStorage();
    const sourceService = new SourceRegistryService(
      sourceRepository,
      sourceStorage,
      now,
    );
    const financeRepository = new InMemoryFinanceTwinRepository();
    const financeTwinService = new FinanceTwinService({
      financeTwinRepository: financeRepository,
      sourceFileStorage: sourceStorage,
      sourceRepository,
      now,
    });
    const created = await sourceService.createSource({
      kind: "dataset",
      name: "Display name preservation",
      createdBy: "finance-operator",
      originKind: "manual",
      snapshot: {
        originalFileName: "display-name-link.txt",
        mediaType: "text/plain",
        sizeBytes: 18,
        checksumSha256:
          "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        storageKind: "external_url",
        storageRef: "https://example.com/display-name",
        ingestStatus: "registered",
      },
    });
    const firstFile = await sourceService.registerSourceFile(
      created.source.id,
      {
        originalFileName: "trial-balance.csv",
        mediaType: "text/csv",
        createdBy: "finance-operator",
      },
      Buffer.from(
        [
          "account_code,account_name,period_end,debit,credit",
          "1000,Cash,2026-03-31,10.00,0.00",
        ].join("\n"),
      ),
    );
    const secondFile = await sourceService.registerSourceFile(
      created.source.id,
      {
        originalFileName: "general-ledger.csv",
        mediaType: "text/csv",
        createdBy: "finance-operator",
      },
      Buffer.from(
        [
          "journal_id,transaction_date,account_code,debit,credit",
          "J-100,2026-03-31,1000,10.00,0.00",
        ].join("\n"),
      ),
    );

    await financeTwinService.syncCompanySourceFile("acme", firstFile.sourceFile.id, {
      companyName: "Acme Holdings",
    });
    await financeTwinService.syncCompanySourceFile("acme", secondFile.sourceFile.id, {});

    await expect(financeTwinService.getCompanySummary("acme")).resolves.toMatchObject({
      company: {
        companyKey: "acme",
        displayName: "Acme Holdings",
      },
    });
  });

  it("rejects unsupported source files before creating finance company state", async () => {
    const now = () => new Date("2026-04-09T23:30:00.000Z");
    const sourceRepository = new InMemorySourceRepository();
    const sourceStorage = new InMemorySourceFileStorage();
    const sourceService = new SourceRegistryService(
      sourceRepository,
      sourceStorage,
      now,
    );
    const financeTwinService = new FinanceTwinService({
      financeTwinRepository: new InMemoryFinanceTwinRepository(),
      sourceFileStorage: sourceStorage,
      sourceRepository,
      now,
    });
    const created = await sourceService.createSource({
      kind: "document",
      name: "Board deck",
      createdBy: "finance-operator",
      originKind: "manual",
      snapshot: {
        originalFileName: "board-deck-link.txt",
        mediaType: "text/plain",
        sizeBytes: 18,
        checksumSha256:
          "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
        storageKind: "external_url",
        storageRef: "https://example.com/board-deck",
        ingestStatus: "registered",
      },
    });
    const registered = await sourceService.registerSourceFile(
      created.source.id,
      {
        originalFileName: "board-deck.pdf",
        mediaType: "application/pdf",
        createdBy: "finance-operator",
      },
      Buffer.from("%PDF-1.7 sample bytes"),
    );

    await expect(
      financeTwinService.syncCompanySourceFile("acme", registered.sourceFile.id, {}),
    ).rejects.toBeInstanceOf(FinanceTwinUnsupportedSourceError);
    await expect(financeTwinService.getCompanySummary("acme")).rejects.toBeInstanceOf(
      FinanceCompanyNotFoundError,
    );
  });
});
