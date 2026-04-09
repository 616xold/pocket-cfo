import type {
  financeCompanies,
  financeLedgerAccounts,
  financeReportingPeriods,
  financeTrialBalanceLines,
  financeTwinLineage,
  financeTwinSyncRuns,
} from "@pocket-cto/db";
import type {
  FinanceCompanyRecord,
  FinanceTwinLineageRecord,
  FinanceTwinSyncRunRecord,
  FinanceLedgerAccountRecord,
  FinanceReportingPeriodRecord,
  FinanceTrialBalanceLineRecord,
} from "@pocket-cto/domain";

type FinanceCompanyRow = typeof financeCompanies.$inferSelect;
type FinanceReportingPeriodRow = typeof financeReportingPeriods.$inferSelect;
type FinanceLedgerAccountRow = typeof financeLedgerAccounts.$inferSelect;
type FinanceTwinSyncRunRow = typeof financeTwinSyncRuns.$inferSelect;
type FinanceTrialBalanceLineRow = typeof financeTrialBalanceLines.$inferSelect;
type FinanceTwinLineageRow = typeof financeTwinLineage.$inferSelect;

export function mapFinanceCompanyRow(
  row: FinanceCompanyRow,
): FinanceCompanyRecord {
  return {
    id: row.id,
    companyKey: row.companyKey,
    displayName: row.displayName,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapFinanceReportingPeriodRow(
  row: FinanceReportingPeriodRow,
): FinanceReportingPeriodRecord {
  return {
    id: row.id,
    companyId: row.companyId,
    periodKey: row.periodKey,
    label: row.label,
    periodStart: row.periodStart,
    periodEnd: row.periodEnd,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapFinanceLedgerAccountRow(
  row: FinanceLedgerAccountRow,
): FinanceLedgerAccountRecord {
  return {
    id: row.id,
    companyId: row.companyId,
    accountCode: row.accountCode,
    accountName: row.accountName,
    accountType: row.accountType,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapFinanceTwinSyncRunRow(
  row: FinanceTwinSyncRunRow,
): FinanceTwinSyncRunRecord {
  return {
    id: row.id,
    companyId: row.companyId,
    reportingPeriodId: row.reportingPeriodId,
    sourceId: row.sourceId,
    sourceSnapshotId: row.sourceSnapshotId,
    sourceFileId: row.sourceFileId,
    extractorKey: row.extractorKey,
    status: row.status,
    startedAt: row.startedAt.toISOString(),
    completedAt: row.completedAt?.toISOString() ?? null,
    stats: row.stats as Record<string, unknown>,
    errorSummary: row.errorSummary,
    createdAt: row.createdAt.toISOString(),
  };
}

export function mapFinanceTrialBalanceLineRow(
  row: FinanceTrialBalanceLineRow,
): FinanceTrialBalanceLineRecord {
  return {
    id: row.id,
    companyId: row.companyId,
    reportingPeriodId: row.reportingPeriodId,
    ledgerAccountId: row.ledgerAccountId,
    syncRunId: row.syncRunId,
    lineNumber: row.lineNumber,
    debitAmount: row.debitAmount,
    creditAmount: row.creditAmount,
    netAmount: row.netAmount,
    currencyCode: row.currencyCode,
    observedAt: row.observedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapFinanceTwinLineageRow(
  row: FinanceTwinLineageRow,
): FinanceTwinLineageRecord {
  return {
    id: row.id,
    companyId: row.companyId,
    syncRunId: row.syncRunId,
    targetKind: row.targetKind,
    targetId: row.targetId,
    sourceId: row.sourceId,
    sourceSnapshotId: row.sourceSnapshotId,
    sourceFileId: row.sourceFileId,
    recordedAt: row.recordedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}
