import { z } from "zod";

export const FinanceTwinJsonObjectSchema = z
  .record(z.string(), z.unknown())
  .default({});

export const FinanceCompanyKeySchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(
    /^[a-z0-9][a-z0-9_-]*$/u,
    "Company key must use lowercase letters, numbers, hyphens, or underscores",
  );

export const FinanceIsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/u, "Expected ISO date in YYYY-MM-DD format");

export const FinanceAmountSchema = z
  .string()
  .regex(/^-?\d+\.\d{2}$/u, "Expected money amount with 2 decimal places");

export const FinanceTwinExtractorKeySchema = z.enum(["trial_balance_csv"]);

export const FinanceTwinSyncRunStatusSchema = z.enum([
  "running",
  "succeeded",
  "failed",
]);

export const FinanceTwinLineageTargetKindSchema = z.enum([
  "reporting_period",
  "ledger_account",
  "trial_balance_line",
]);

export const FinanceFreshnessStateSchema = z.enum([
  "missing",
  "fresh",
  "stale",
  "failed",
]);

export const FinanceFreshnessSliceNameSchema = z.enum(["trial_balance"]);

export const FinanceCompanyRecordSchema = z.object({
  id: z.string().uuid(),
  companyKey: FinanceCompanyKeySchema,
  displayName: z.string().min(1),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const FinanceReportingPeriodRecordSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  periodKey: z.string().min(1),
  label: z.string().min(1),
  periodStart: FinanceIsoDateSchema.nullable(),
  periodEnd: FinanceIsoDateSchema,
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const FinanceLedgerAccountRecordSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  accountCode: z.string().min(1),
  accountName: z.string().min(1),
  accountType: z.string().min(1).nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const FinanceTrialBalanceLineRecordSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  reportingPeriodId: z.string().uuid(),
  ledgerAccountId: z.string().uuid(),
  syncRunId: z.string().uuid(),
  lineNumber: z.number().int().positive(),
  debitAmount: FinanceAmountSchema,
  creditAmount: FinanceAmountSchema,
  netAmount: FinanceAmountSchema,
  currencyCode: z.string().min(1).nullable(),
  observedAt: z.string().datetime({ offset: true }),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const FinanceTwinSyncRunRecordSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  reportingPeriodId: z.string().uuid().nullable(),
  sourceId: z.string().uuid(),
  sourceSnapshotId: z.string().uuid(),
  sourceFileId: z.string().uuid(),
  extractorKey: FinanceTwinExtractorKeySchema,
  status: FinanceTwinSyncRunStatusSchema,
  startedAt: z.string().datetime({ offset: true }),
  completedAt: z.string().datetime({ offset: true }).nullable(),
  stats: FinanceTwinJsonObjectSchema,
  errorSummary: z.string().nullable(),
  createdAt: z.string().datetime({ offset: true }),
});

export const FinanceTwinLineageRecordSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  syncRunId: z.string().uuid(),
  targetKind: FinanceTwinLineageTargetKindSchema,
  targetId: z.string().uuid(),
  sourceId: z.string().uuid(),
  sourceSnapshotId: z.string().uuid(),
  sourceFileId: z.string().uuid(),
  recordedAt: z.string().datetime({ offset: true }),
  createdAt: z.string().datetime({ offset: true }),
});

export const FinanceTwinSyncInputSchema = z.object({
  companyName: z.string().trim().min(1).max(160).optional(),
});

export const FinanceTwinSourceRefSchema = z.object({
  sourceId: z.string().uuid(),
  sourceSnapshotId: z.string().uuid(),
  sourceFileId: z.string().uuid(),
  syncRunId: z.string().uuid(),
});

export const FinanceFreshnessSummarySchema = z.object({
  state: FinanceFreshnessStateSchema,
  latestSyncRunId: z.string().uuid().nullable(),
  latestSyncStatus: FinanceTwinSyncRunStatusSchema.nullable(),
  latestCompletedAt: z.string().datetime({ offset: true }).nullable(),
  latestSuccessfulSyncRunId: z.string().uuid().nullable(),
  latestSuccessfulCompletedAt: z.string().datetime({ offset: true }).nullable(),
  ageSeconds: z.number().int().nonnegative().nullable(),
  staleAfterSeconds: z.number().int().positive(),
  reasonCode: z.string().min(1),
  reasonSummary: z.string().min(1),
});

export const FinanceFreshnessViewSchema = z.object({
  overall: FinanceFreshnessSummarySchema,
  trialBalance: FinanceFreshnessSummarySchema,
});

export const FinanceTrialBalanceSummarySchema = z.object({
  accountCount: z.number().int().nonnegative(),
  lineCount: z.number().int().nonnegative(),
  totalDebitAmount: FinanceAmountSchema,
  totalCreditAmount: FinanceAmountSchema,
  totalNetAmount: FinanceAmountSchema,
  currencyCode: z.string().min(1).nullable(),
});

export const FinanceTwinCoverageSummarySchema = z.object({
  reportingPeriodCount: z.number().int().nonnegative(),
  ledgerAccountCount: z.number().int().nonnegative(),
  trialBalanceLineCount: z.number().int().nonnegative(),
  lineageCount: z.number().int().nonnegative(),
});

export const FinanceTwinCompanySummarySchema = z.object({
  company: FinanceCompanyRecordSchema,
  latestSource: FinanceTwinSourceRefSchema.nullable(),
  latestSyncRun: FinanceTwinSyncRunRecordSchema.nullable(),
  latestReportingPeriod: FinanceReportingPeriodRecordSchema.nullable(),
  freshness: FinanceFreshnessViewSchema,
  coverage: FinanceTwinCoverageSummarySchema,
  trialBalance: FinanceTrialBalanceSummarySchema.nullable(),
  limitations: z.array(z.string().min(1)),
});

export const FinanceTwinSyncResultSchema = z.object({
  company: FinanceCompanyRecordSchema,
  latestSource: FinanceTwinSourceRefSchema,
  syncRun: FinanceTwinSyncRunRecordSchema,
  reportingPeriod: FinanceReportingPeriodRecordSchema,
  freshness: FinanceFreshnessViewSchema,
  coverage: FinanceTwinCoverageSummarySchema,
  trialBalance: FinanceTrialBalanceSummarySchema,
  limitations: z.array(z.string().min(1)),
});

export type FinanceCompanyKey = z.infer<typeof FinanceCompanyKeySchema>;
export type FinanceIsoDate = z.infer<typeof FinanceIsoDateSchema>;
export type FinanceAmount = z.infer<typeof FinanceAmountSchema>;
export type FinanceTwinExtractorKey = z.infer<
  typeof FinanceTwinExtractorKeySchema
>;
export type FinanceTwinSyncRunStatus = z.infer<
  typeof FinanceTwinSyncRunStatusSchema
>;
export type FinanceTwinLineageTargetKind = z.infer<
  typeof FinanceTwinLineageTargetKindSchema
>;
export type FinanceFreshnessState = z.infer<
  typeof FinanceFreshnessStateSchema
>;
export type FinanceFreshnessSliceName = z.infer<
  typeof FinanceFreshnessSliceNameSchema
>;
export type FinanceCompanyRecord = z.infer<typeof FinanceCompanyRecordSchema>;
export type FinanceReportingPeriodRecord = z.infer<
  typeof FinanceReportingPeriodRecordSchema
>;
export type FinanceLedgerAccountRecord = z.infer<
  typeof FinanceLedgerAccountRecordSchema
>;
export type FinanceTrialBalanceLineRecord = z.infer<
  typeof FinanceTrialBalanceLineRecordSchema
>;
export type FinanceTwinSyncRunRecord = z.infer<
  typeof FinanceTwinSyncRunRecordSchema
>;
export type FinanceTwinLineageRecord = z.infer<
  typeof FinanceTwinLineageRecordSchema
>;
export type FinanceTwinSyncInput = z.infer<typeof FinanceTwinSyncInputSchema>;
export type FinanceTwinSourceRef = z.infer<typeof FinanceTwinSourceRefSchema>;
export type FinanceFreshnessSummary = z.infer<
  typeof FinanceFreshnessSummarySchema
>;
export type FinanceFreshnessView = z.infer<typeof FinanceFreshnessViewSchema>;
export type FinanceTrialBalanceSummary = z.infer<
  typeof FinanceTrialBalanceSummarySchema
>;
export type FinanceTwinCoverageSummary = z.infer<
  typeof FinanceTwinCoverageSummarySchema
>;
export type FinanceTwinCompanySummary = z.infer<
  typeof FinanceTwinCompanySummarySchema
>;
export type FinanceTwinSyncResult = z.infer<typeof FinanceTwinSyncResultSchema>;
