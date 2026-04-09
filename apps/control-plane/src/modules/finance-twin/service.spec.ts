import { describe, expect, it } from "vitest";
import { SourceRegistryService } from "../sources/service";
import { InMemorySourceRepository } from "../sources/repository";
import { InMemorySourceFileStorage } from "../sources/storage";
import { FinanceTwinUnsupportedSourceError } from "./errors";
import { InMemoryFinanceTwinRepository } from "./repository";
import { FinanceTwinService } from "./service";

describe("FinanceTwinService", () => {
  it("syncs one uploaded trial-balance CSV into persisted finance twin state", async () => {
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
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
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
      company: {
        companyKey: "acme",
        displayName: "Acme Holdings",
      },
      latestSource: {
        sourceId: created.source.id,
        sourceSnapshotId: registered.snapshot.id,
        sourceFileId: registered.sourceFile.id,
      },
      syncRun: {
        status: "succeeded",
        sourceFileId: registered.sourceFile.id,
        extractorKey: "trial_balance_csv",
      },
      reportingPeriod: {
        periodKey: "2026-03-31",
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
        totalDebitAmount: "125000.00",
        totalCreditAmount: "42000.00",
        totalNetAmount: "83000.00",
        currencyCode: "USD",
      },
    });
    expect(summary).toMatchObject({
      company: {
        companyKey: "acme",
      },
      latestSyncRun: {
        id: synced.syncRun.id,
        status: "succeeded",
      },
      latestReportingPeriod: {
        id: synced.reportingPeriod.id,
      },
      freshness: {
        overall: {
          state: "fresh",
        },
        trialBalance: {
          state: "fresh",
        },
      },
      coverage: {
        reportingPeriodCount: 1,
        ledgerAccountCount: 2,
        trialBalanceLineCount: 2,
        lineageCount: 5,
      },
    });
  });

  it("persists a failed sync posture when the uploaded source is outside the supported extractor family", async () => {
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
          "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
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

    const summary = await financeTwinService.getCompanySummary("acme");

    expect(summary.latestSyncRun).toMatchObject({
      sourceFileId: registered.sourceFile.id,
      status: "failed",
    });
    expect(summary.latestSource).toBeNull();
    expect(summary.freshness.trialBalance.state).toBe("failed");
    expect(summary.coverage.trialBalanceLineCount).toBe(0);
  });
});
