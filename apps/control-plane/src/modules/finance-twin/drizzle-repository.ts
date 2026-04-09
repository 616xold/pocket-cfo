import { and, asc, count, desc, eq } from "drizzle-orm";
import {
  financeCompanies,
  financeLedgerAccounts,
  financeReportingPeriods,
  financeTrialBalanceLines,
  financeTwinLineage,
  financeTwinSyncRuns,
  type Db,
  type DbTransaction,
} from "@pocket-cto/db";
import {
  createDbSession,
  getDbExecutor,
  type PersistenceSession,
} from "../../lib/persistence";
import {
  mapFinanceCompanyRow,
  mapFinanceLedgerAccountRow,
  mapFinanceReportingPeriodRow,
  mapFinanceTrialBalanceLineRow,
  mapFinanceTwinLineageRow,
  mapFinanceTwinSyncRunRow,
} from "./repository-mappers";
import type {
  CreateFinanceTwinLineageInput,
  FinishFinanceTwinSyncRunInput,
  FinanceTwinRepository,
  StartFinanceTwinSyncRunInput,
  UpsertFinanceCompanyInput,
  UpsertFinanceLedgerAccountInput,
  UpsertFinanceReportingPeriodInput,
  UpsertFinanceTrialBalanceLineInput,
} from "./repository";

export class DrizzleFinanceTwinRepository implements FinanceTwinRepository {
  constructor(private readonly db: Db) {}

  async transaction<T>(
    operation: (session: PersistenceSession) => Promise<T>,
  ): Promise<T> {
    return this.db.transaction(async (tx: DbTransaction) =>
      operation(createDbSession(tx)),
    );
  }

  async getCompanyByKey(companyKey: string, session?: PersistenceSession) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .select()
      .from(financeCompanies)
      .where(eq(financeCompanies.companyKey, companyKey))
      .limit(1);

    return row ? mapFinanceCompanyRow(row) : null;
  }

  async upsertCompany(
    input: UpsertFinanceCompanyInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .insert(financeCompanies)
      .values({
        companyKey: input.companyKey,
        displayName: input.displayName,
      })
      .onConflictDoUpdate({
        target: financeCompanies.companyKey,
        set: {
          displayName: input.displayName,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!row) {
      throw new Error("Finance company upsert did not return a row");
    }

    return mapFinanceCompanyRow(row);
  }

  async upsertReportingPeriod(
    input: UpsertFinanceReportingPeriodInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .insert(financeReportingPeriods)
      .values({
        companyId: input.companyId,
        periodKey: input.periodKey,
        label: input.label,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
      })
      .onConflictDoUpdate({
        target: [
          financeReportingPeriods.companyId,
          financeReportingPeriods.periodKey,
        ],
        set: {
          label: input.label,
          periodStart: input.periodStart,
          periodEnd: input.periodEnd,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!row) {
      throw new Error("Finance reporting period upsert did not return a row");
    }

    return mapFinanceReportingPeriodRow(row);
  }

  async getReportingPeriodById(
    reportingPeriodId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .select()
      .from(financeReportingPeriods)
      .where(eq(financeReportingPeriods.id, reportingPeriodId))
      .limit(1);

    return row ? mapFinanceReportingPeriodRow(row) : null;
  }

  async countReportingPeriodsByCompanyId(
    companyId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [result] = await executor
      .select({ count: count() })
      .from(financeReportingPeriods)
      .where(eq(financeReportingPeriods.companyId, companyId));

    return result?.count ?? 0;
  }

  async upsertLedgerAccount(
    input: UpsertFinanceLedgerAccountInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .insert(financeLedgerAccounts)
      .values({
        companyId: input.companyId,
        accountCode: input.accountCode,
        accountName: input.accountName,
        accountType: input.accountType,
      })
      .onConflictDoUpdate({
        target: [
          financeLedgerAccounts.companyId,
          financeLedgerAccounts.accountCode,
        ],
        set: {
          accountName: input.accountName,
          accountType: input.accountType,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!row) {
      throw new Error("Finance ledger account upsert did not return a row");
    }

    return mapFinanceLedgerAccountRow(row);
  }

  async countLedgerAccountsByCompanyId(
    companyId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [result] = await executor
      .select({ count: count() })
      .from(financeLedgerAccounts)
      .where(eq(financeLedgerAccounts.companyId, companyId));

    return result?.count ?? 0;
  }

  async startSyncRun(
    input: StartFinanceTwinSyncRunInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .insert(financeTwinSyncRuns)
      .values({
        companyId: input.companyId,
        sourceId: input.sourceId,
        sourceSnapshotId: input.sourceSnapshotId,
        sourceFileId: input.sourceFileId,
        extractorKey: input.extractorKey,
        status: "running",
        startedAt: new Date(input.startedAt),
        stats: {},
      })
      .returning();

    if (!row) {
      throw new Error("Finance twin sync run insert did not return a row");
    }

    return mapFinanceTwinSyncRunRow(row);
  }

  async finishSyncRun(
    input: FinishFinanceTwinSyncRunInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .update(financeTwinSyncRuns)
      .set({
        reportingPeriodId: input.reportingPeriodId,
        status: input.status,
        completedAt: new Date(input.completedAt),
        stats: input.stats,
        errorSummary: input.errorSummary,
      })
      .where(eq(financeTwinSyncRuns.id, input.syncRunId))
      .returning();

    if (!row) {
      throw new Error(`Finance twin sync run ${input.syncRunId} not found`);
    }

    return mapFinanceTwinSyncRunRow(row);
  }

  async getLatestSyncRunByCompanyId(
    companyId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .select()
      .from(financeTwinSyncRuns)
      .where(eq(financeTwinSyncRuns.companyId, companyId))
      .orderBy(
        desc(financeTwinSyncRuns.startedAt),
        desc(financeTwinSyncRuns.createdAt),
        desc(financeTwinSyncRuns.id),
      )
      .limit(1);

    return row ? mapFinanceTwinSyncRunRow(row) : null;
  }

  async getLatestSuccessfulSyncRunByCompanyId(
    companyId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .select()
      .from(financeTwinSyncRuns)
      .where(
        and(
          eq(financeTwinSyncRuns.companyId, companyId),
          eq(financeTwinSyncRuns.status, "succeeded"),
        ),
      )
      .orderBy(
        desc(financeTwinSyncRuns.startedAt),
        desc(financeTwinSyncRuns.createdAt),
        desc(financeTwinSyncRuns.id),
      )
      .limit(1);

    return row ? mapFinanceTwinSyncRunRow(row) : null;
  }

  async upsertTrialBalanceLine(
    input: UpsertFinanceTrialBalanceLineInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .insert(financeTrialBalanceLines)
      .values({
        companyId: input.companyId,
        reportingPeriodId: input.reportingPeriodId,
        ledgerAccountId: input.ledgerAccountId,
        syncRunId: input.syncRunId,
        lineNumber: input.lineNumber,
        debitAmount: input.debitAmount,
        creditAmount: input.creditAmount,
        netAmount: input.netAmount,
        currencyCode: input.currencyCode,
        observedAt: new Date(input.observedAt),
      })
      .onConflictDoUpdate({
        target: [
          financeTrialBalanceLines.syncRunId,
          financeTrialBalanceLines.ledgerAccountId,
        ],
        set: {
          lineNumber: input.lineNumber,
          debitAmount: input.debitAmount,
          creditAmount: input.creditAmount,
          netAmount: input.netAmount,
          currencyCode: input.currencyCode,
          observedAt: new Date(input.observedAt),
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!row) {
      throw new Error("Finance trial balance line upsert did not return a row");
    }

    return mapFinanceTrialBalanceLineRow(row);
  }

  async listTrialBalanceLinesBySyncRunId(
    syncRunId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const rows = await executor
      .select()
      .from(financeTrialBalanceLines)
      .where(eq(financeTrialBalanceLines.syncRunId, syncRunId))
      .orderBy(asc(financeTrialBalanceLines.lineNumber));

    return rows.map(mapFinanceTrialBalanceLineRow);
  }

  async createLineage(
    input: CreateFinanceTwinLineageInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const inserted = await executor
      .insert(financeTwinLineage)
      .values({
        companyId: input.companyId,
        syncRunId: input.syncRunId,
        targetKind: input.targetKind,
        targetId: input.targetId,
        sourceId: input.sourceId,
        sourceSnapshotId: input.sourceSnapshotId,
        sourceFileId: input.sourceFileId,
        recordedAt: new Date(input.recordedAt),
      })
      .onConflictDoNothing()
      .returning();

    const row =
      inserted[0] ??
      (
        await executor
          .select()
          .from(financeTwinLineage)
          .where(
            and(
              eq(financeTwinLineage.syncRunId, input.syncRunId),
              eq(financeTwinLineage.targetKind, input.targetKind),
              eq(financeTwinLineage.targetId, input.targetId),
            ),
          )
          .limit(1)
      )[0];

    if (!row) {
      throw new Error("Finance twin lineage insert did not return a row");
    }

    return mapFinanceTwinLineageRow(row);
  }

  async countLineageBySyncRunId(
    syncRunId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [result] = await executor
      .select({ count: count() })
      .from(financeTwinLineage)
      .where(eq(financeTwinLineage.syncRunId, syncRunId));

    return result?.count ?? 0;
  }

  private getExecutor(session?: PersistenceSession) {
    return getDbExecutor(session) ?? this.db;
  }
}
