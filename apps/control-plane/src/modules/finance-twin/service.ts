import {
  FinanceTwinCompanySummarySchema,
  FinanceTwinSyncInputSchema,
  FinanceTwinSyncResultSchema,
  type FinanceCompanyRecord,
  type FinanceTwinCompanySummary,
  type FinanceTwinSyncInput,
  type FinanceTwinSyncResult,
  type FinanceTrialBalanceLineRecord,
} from "@pocket-cto/domain";
import {
  SourceFileNotFoundError,
  SourceNotFoundError,
} from "../sources/errors";
import type { SourceRepository } from "../sources/repository";
import type { SourceFileStorage } from "../sources/storage";
import {
  FinanceCompanyNotFoundError,
  FinanceTwinExtractionError,
  FinanceTwinUnsupportedSourceError,
} from "./errors";
import { buildFinanceFreshnessView } from "./freshness";
import type { FinanceTwinRepository } from "./repository";
import {
  extractTrialBalanceCsv,
  supportsTrialBalanceCsvSource,
} from "./trial-balance-csv";

const MAX_ERROR_SUMMARY_LENGTH = 500;
const SUMMARY_LIMITATIONS = [
  "F2A only covers deterministic trial-balance CSV extraction.",
  "CFO Wiki, finance discovery answers, reports, monitoring, and close/control flows are not implemented in this slice.",
];

export class FinanceTwinService {
  private readonly now: () => Date;

  constructor(
    private readonly input: {
      financeTwinRepository: FinanceTwinRepository;
      sourceFileStorage: SourceFileStorage;
      sourceRepository: Pick<
        SourceRepository,
        "getSnapshotById" | "getSourceById" | "getSourceFileById"
      >;
      now?: () => Date;
    },
  ) {
    this.now = input.now ?? (() => new Date());
  }

  async syncCompanySourceFile(
    companyKey: string,
    sourceFileId: string,
    input: FinanceTwinSyncInput,
  ): Promise<FinanceTwinSyncResult> {
    const parsedInput = FinanceTwinSyncInputSchema.parse(input);
    const sourceFile = await this.input.sourceRepository.getSourceFileById(
      sourceFileId,
    );

    if (!sourceFile) {
      throw new SourceFileNotFoundError(sourceFileId);
    }

    const [source, snapshot] = await Promise.all([
      this.input.sourceRepository.getSourceById(sourceFile.sourceId),
      this.input.sourceRepository.getSnapshotById(sourceFile.sourceSnapshotId),
    ]);

    if (!source) {
      throw new SourceNotFoundError(sourceFile.sourceId);
    }

    if (!snapshot) {
      throw new Error(
        `Source file ${sourceFile.id} is missing its linked source snapshot`,
      );
    }

    const company = await this.input.financeTwinRepository.upsertCompany({
      companyKey,
      displayName:
        parsedInput.companyName?.trim() || buildDefaultCompanyName(companyKey),
    });
    const startedAt = this.now().toISOString();
    const syncRun = await this.input.financeTwinRepository.startSyncRun({
      companyId: company.id,
      sourceId: source.id,
      sourceSnapshotId: snapshot.id,
      sourceFileId: sourceFile.id,
      extractorKey: "trial_balance_csv",
      startedAt,
    });

    try {
      if (!supportsTrialBalanceCsvSource(sourceFile)) {
        throw new FinanceTwinUnsupportedSourceError(sourceFile.id);
      }

      const body = await this.input.sourceFileStorage.read(sourceFile.storageRef);
      const extracted = extractTrialBalanceCsv({
        body,
        sourceFile,
      });
      const observedAt = this.now().toISOString();
      const persisted = await this.input.financeTwinRepository.transaction(
        async (session) => {
          const reportingPeriod =
            await this.input.financeTwinRepository.upsertReportingPeriod(
              {
                companyId: company.id,
                periodKey: extracted.reportingPeriod.periodKey,
                label: extracted.reportingPeriod.label,
                periodStart: extracted.reportingPeriod.periodStart,
                periodEnd: extracted.reportingPeriod.periodEnd,
              },
              session,
            );

          await this.input.financeTwinRepository.createLineage(
            {
              companyId: company.id,
              syncRunId: syncRun.id,
              targetKind: "reporting_period",
              targetId: reportingPeriod.id,
              sourceId: source.id,
              sourceSnapshotId: snapshot.id,
              sourceFileId: sourceFile.id,
              recordedAt: observedAt,
            },
            session,
          );

          const ledgerAccounts = new Map<string, { id: string }>();

          for (const account of extracted.accounts) {
            const storedAccount =
              await this.input.financeTwinRepository.upsertLedgerAccount(
                {
                  companyId: company.id,
                  accountCode: account.accountCode,
                  accountName: account.accountName,
                  accountType: account.accountType,
                },
                session,
              );

            ledgerAccounts.set(account.accountCode, storedAccount);
            await this.input.financeTwinRepository.createLineage(
              {
                companyId: company.id,
                syncRunId: syncRun.id,
                targetKind: "ledger_account",
                targetId: storedAccount.id,
                sourceId: source.id,
                sourceSnapshotId: snapshot.id,
                sourceFileId: sourceFile.id,
                recordedAt: observedAt,
              },
              session,
            );
          }

          const lines: FinanceTrialBalanceLineRecord[] = [];

          for (const line of extracted.lines) {
            const ledgerAccount = ledgerAccounts.get(line.accountCode);

            if (!ledgerAccount) {
              throw new Error(
                `Ledger account ${line.accountCode} was not available for line persistence`,
              );
            }

            const storedLine =
              await this.input.financeTwinRepository.upsertTrialBalanceLine(
                {
                  companyId: company.id,
                  reportingPeriodId: reportingPeriod.id,
                  ledgerAccountId: ledgerAccount.id,
                  syncRunId: syncRun.id,
                  lineNumber: line.lineNumber,
                  debitAmount: line.debitAmount,
                  creditAmount: line.creditAmount,
                  netAmount: line.netAmount,
                  currencyCode: line.currencyCode,
                  observedAt,
                },
                session,
              );

            lines.push(storedLine);
            await this.input.financeTwinRepository.createLineage(
              {
                companyId: company.id,
                syncRunId: syncRun.id,
                targetKind: "trial_balance_line",
                targetId: storedLine.id,
                sourceId: source.id,
                sourceSnapshotId: snapshot.id,
                sourceFileId: sourceFile.id,
                recordedAt: observedAt,
              },
              session,
            );
          }

          const ledgerAccountCount =
            await this.input.financeTwinRepository.countLedgerAccountsByCompanyId(
              company.id,
              session,
            );
          const reportingPeriodCount =
            await this.input.financeTwinRepository.countReportingPeriodsByCompanyId(
              company.id,
              session,
            );
          const finalizedRun = await this.input.financeTwinRepository.finishSyncRun(
            {
              syncRunId: syncRun.id,
              reportingPeriodId: reportingPeriod.id,
              status: "succeeded",
              completedAt: observedAt,
              stats: {
                ledgerAccountCount: extracted.accounts.length,
                reportingPeriodCount,
                trialBalanceLineCount: lines.length,
              },
              errorSummary: null,
            },
            session,
          );
          const lineageCount =
            await this.input.financeTwinRepository.countLineageBySyncRunId(
              syncRun.id,
              session,
            );

          return {
            finalizedRun,
            ledgerAccountCount,
            lineageCount,
            lines,
            reportingPeriod,
            reportingPeriodCount,
          };
        },
      );
      const freshness = buildFinanceFreshnessView({
        latestRun: persisted.finalizedRun,
        latestSuccessfulRun: persisted.finalizedRun,
        now: this.now(),
      });

      return FinanceTwinSyncResultSchema.parse({
        company,
        latestSource: {
          sourceId: source.id,
          sourceSnapshotId: snapshot.id,
          sourceFileId: sourceFile.id,
          syncRunId: persisted.finalizedRun.id,
        },
        syncRun: persisted.finalizedRun,
        reportingPeriod: persisted.reportingPeriod,
        freshness,
        coverage: {
          reportingPeriodCount: persisted.reportingPeriodCount,
          ledgerAccountCount: persisted.ledgerAccountCount,
          trialBalanceLineCount: persisted.lines.length,
          lineageCount: persisted.lineageCount,
        },
        trialBalance: buildTrialBalanceSummary(persisted.lines),
        limitations: SUMMARY_LIMITATIONS,
      });
    } catch (error) {
      const failedAt = this.now().toISOString();

      await this.input.financeTwinRepository.finishSyncRun({
        syncRunId: syncRun.id,
        reportingPeriodId: null,
        status: "failed",
        completedAt: failedAt,
        stats: {},
        errorSummary: summarizeError(error),
      });

      throw error;
    }
  }

  async getCompanySummary(companyKey: string): Promise<FinanceTwinCompanySummary> {
    const company = await this.input.financeTwinRepository.getCompanyByKey(
      companyKey,
    );

    if (!company) {
      throw new FinanceCompanyNotFoundError(companyKey);
    }

    return this.buildCompanySummary(company);
  }

  private async buildCompanySummary(
    company: FinanceCompanyRecord,
  ): Promise<FinanceTwinCompanySummary> {
    const [latestRun, latestSuccessfulRun, ledgerAccountCount, reportingPeriodCount] =
      await Promise.all([
        this.input.financeTwinRepository.getLatestSyncRunByCompanyId(company.id),
        this.input.financeTwinRepository.getLatestSuccessfulSyncRunByCompanyId(
          company.id,
        ),
        this.input.financeTwinRepository.countLedgerAccountsByCompanyId(company.id),
        this.input.financeTwinRepository.countReportingPeriodsByCompanyId(
          company.id,
        ),
      ]);
    const [latestReportingPeriod, latestLines, lineageCount] =
      latestSuccessfulRun?.reportingPeriodId
        ? await Promise.all([
            this.input.financeTwinRepository.getReportingPeriodById(
              latestSuccessfulRun.reportingPeriodId,
            ),
            this.input.financeTwinRepository.listTrialBalanceLinesBySyncRunId(
              latestSuccessfulRun.id,
            ),
            this.input.financeTwinRepository.countLineageBySyncRunId(
              latestSuccessfulRun.id,
            ),
          ])
        : [null, [], 0];

    return FinanceTwinCompanySummarySchema.parse({
      company,
      latestSource: latestSuccessfulRun
        ? {
            sourceId: latestSuccessfulRun.sourceId,
            sourceSnapshotId: latestSuccessfulRun.sourceSnapshotId,
            sourceFileId: latestSuccessfulRun.sourceFileId,
            syncRunId: latestSuccessfulRun.id,
          }
        : null,
      latestSyncRun: latestRun,
      latestReportingPeriod,
      freshness: buildFinanceFreshnessView({
        latestRun,
        latestSuccessfulRun,
        now: this.now(),
      }),
      coverage: {
        reportingPeriodCount,
        ledgerAccountCount,
        trialBalanceLineCount: latestLines.length,
        lineageCount,
      },
      trialBalance:
        latestLines.length > 0 ? buildTrialBalanceSummary(latestLines) : null,
      limitations: SUMMARY_LIMITATIONS,
    });
  }
}

function buildTrialBalanceSummary(lines: FinanceTrialBalanceLineRecord[]) {
  let totalDebit = 0n;
  let totalCredit = 0n;
  let totalNet = 0n;
  const currencyCodes = new Set<string>();

  for (const line of lines) {
    totalDebit += parseMoney(line.debitAmount);
    totalCredit += parseMoney(line.creditAmount);
    totalNet += parseMoney(line.netAmount);
    if (line.currencyCode) {
      currencyCodes.add(line.currencyCode);
    }
  }

  return {
    accountCount: new Set(lines.map((line) => line.ledgerAccountId)).size,
    lineCount: lines.length,
    totalDebitAmount: formatMoney(totalDebit),
    totalCreditAmount: formatMoney(totalCredit),
    totalNetAmount: formatMoney(totalNet),
    currencyCode: currencyCodes.size === 1 ? Array.from(currencyCodes)[0] : null,
  };
}

function buildDefaultCompanyName(companyKey: string) {
  return companyKey
    .split(/[-_]+/u)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function summarizeError(error: unknown) {
  const message =
    error instanceof FinanceTwinUnsupportedSourceError
      ? error.message
      : error instanceof FinanceTwinExtractionError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Finance twin sync failed";

  return message.slice(0, MAX_ERROR_SUMMARY_LENGTH);
}

function parseMoney(value: string) {
  const normalized = value.startsWith("-") ? value.slice(1) : value;
  const [wholePart = "0", fractionalPart = "00"] = normalized.split(".");
  const cents =
    BigInt(wholePart) * 100n + BigInt((fractionalPart + "00").slice(0, 2));

  return value.startsWith("-") ? -cents : cents;
}

function formatMoney(cents: bigint) {
  const absolute = cents < 0n ? -cents : cents;
  const whole = absolute / 100n;
  const fraction = (absolute % 100n).toString().padStart(2, "0");
  return `${cents < 0n ? "-" : ""}${whole.toString()}.${fraction}`;
}
