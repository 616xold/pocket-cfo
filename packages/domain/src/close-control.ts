import { z } from "zod";
import { FinanceCompanyKeySchema } from "./finance-twin";
import { MonitorKindSchema } from "./monitoring";

export const CloseControlChecklistItemFamilySchema = z.enum([
  "source_coverage_review",
  "cash_source_freshness_review",
  "receivables_aging_source_freshness_review",
  "payables_aging_source_freshness_review",
  "policy_source_freshness_review",
  "monitor_replay_readiness",
]);

export const CLOSE_CONTROL_CHECKLIST_ITEM_FAMILIES =
  CloseControlChecklistItemFamilySchema.options;

export const CloseControlChecklistStatusSchema = z.enum([
  "ready_for_review",
  "needs_review",
  "blocked_by_evidence",
]);

export const CloseControlSourcePostureStateSchema = z.enum([
  "source_backed",
  "missing_source",
  "failed_source",
  "stale_source",
  "limited_source",
  "monitor_context_present",
  "monitor_context_missing",
]);

export const CloseControlFreshnessStateSchema = z.enum([
  "fresh",
  "stale",
  "missing",
  "mixed",
  "failed",
  "not_applicable",
]);

export const CloseControlEvidenceRefKindSchema = z.enum([
  "finance_twin_source",
  "cfo_wiki_source",
  "cfo_wiki_page",
  "monitor_result",
  "derived_checklist_read",
]);

export const CloseControlProofPostureStateSchema = z.enum([
  "source_backed",
  "review_only_context",
  "limited_by_missing_source",
  "limited_by_failed_source",
  "limited_by_stale_source",
  "limited_by_coverage_gap",
  "limited_by_data_quality_gap",
  "limited_by_missing_monitor_context",
  "limited_by_alerting_monitor",
]);

export const CloseControlEvidenceRefSchema = z
  .object({
    kind: CloseControlEvidenceRefKindSchema,
    evidencePath: z.string().min(1),
    summary: z.string().min(1),
    sourceId: z.string().uuid().nullable().default(null),
    sourceSnapshotId: z.string().uuid().nullable().default(null),
    sourceFileId: z.string().uuid().nullable().default(null),
    syncRunId: z.string().uuid().nullable().default(null),
    pageKey: z.string().min(1).nullable().default(null),
    monitorKind: MonitorKindSchema.nullable().default(null),
    monitorResultId: z.string().uuid().nullable().default(null),
  })
  .strict();

export const CloseControlSourcePostureSchema = z
  .object({
    state: CloseControlSourcePostureStateSchema,
    summary: z.string().min(1),
    refs: z.array(CloseControlEvidenceRefSchema).default([]),
  })
  .strict();

export const CloseControlEvidenceBasisKindSchema = z.enum([
  "stored_finance_twin_posture",
  "stored_cfo_wiki_policy_posture",
  "latest_persisted_monitor_result_context",
  "derived_source_coverage",
]);

export const CloseControlEvidenceBasisSchema = z
  .object({
    basisKind: CloseControlEvidenceBasisKindSchema,
    summary: z.string().min(1),
    refs: z.array(CloseControlEvidenceRefSchema).default([]),
  })
  .strict();

export const CloseControlFreshnessSummarySchema = z
  .object({
    state: CloseControlFreshnessStateSchema,
    summary: z.string().min(1),
    latestObservedAt: z
      .string()
      .datetime({ offset: true })
      .nullable()
      .default(null),
  })
  .strict();

export const CloseControlProofPostureSchema = z
  .object({
    state: CloseControlProofPostureStateSchema,
    summary: z.string().min(1),
  })
  .strict();

export const CloseControlChecklistItemSchema = z
  .object({
    family: CloseControlChecklistItemFamilySchema,
    status: CloseControlChecklistStatusSchema,
    sourcePosture: CloseControlSourcePostureSchema,
    evidenceBasis: CloseControlEvidenceBasisSchema,
    freshnessSummary: CloseControlFreshnessSummarySchema,
    limitations: z.array(z.string().min(1)),
    humanReviewNextStep: z.string().min(1),
    proofPosture: CloseControlProofPostureSchema,
  })
  .strict();

export const CloseControlRuntimeActionBoundarySchema = z
  .object({
    runtimeCodexUsed: z.literal(false),
    deliveryCreated: z.literal(false),
    reportCreated: z.literal(false),
    approvalCreated: z.literal(false),
    accountingWriteCreated: z.literal(false),
    bankWriteCreated: z.literal(false),
    taxFilingCreated: z.literal(false),
    legalAdviceGenerated: z.literal(false),
    policyAdviceGenerated: z.literal(false),
    paymentInstructionCreated: z.literal(false),
    collectionInstructionCreated: z.literal(false),
    customerContactInstructionCreated: z.literal(false),
    autonomousActionCreated: z.literal(false),
    monitorRunTriggered: z.literal(false),
    missionCreated: z.literal(false),
    summary: z.string().min(1),
    replayImplication: z.string().min(1),
  })
  .strict();

export const CloseControlChecklistResultSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    generatedAt: z.string().datetime({ offset: true }),
    aggregateStatus: CloseControlChecklistStatusSchema,
    items: z
      .array(CloseControlChecklistItemSchema)
      .length(CLOSE_CONTROL_CHECKLIST_ITEM_FAMILIES.length),
    evidenceSummary: z.string().min(1),
    limitations: z.array(z.string().min(1)),
    runtimeActionBoundary: CloseControlRuntimeActionBoundarySchema,
  })
  .strict()
  .superRefine((result, context) => {
    const expectedStatus = deriveCloseControlAggregateStatus(result.items);

    if (result.aggregateStatus !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Aggregate status must be ${expectedStatus} for the supplied checklist items`,
        path: ["aggregateStatus"],
      });
    }

    const families = result.items.map((item) => item.family);
    const missingFamilies = CLOSE_CONTROL_CHECKLIST_ITEM_FAMILIES.filter(
      (family) => !families.includes(family),
    );
    const duplicateFamilies = families.filter(
      (family, index) => families.indexOf(family) !== index,
    );

    if (missingFamilies.length > 0 || duplicateFamilies.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Checklist results must include each close/control item family exactly once",
        path: ["items"],
      });
    }
  });

export function deriveCloseControlAggregateStatus(
  items: Array<Pick<CloseControlChecklistItem, "status">>,
): CloseControlChecklistStatus {
  if (items.some((item) => item.status === "blocked_by_evidence")) {
    return "blocked_by_evidence";
  }

  if (items.some((item) => item.status === "needs_review")) {
    return "needs_review";
  }

  return "ready_for_review";
}

export type CloseControlChecklistItemFamily = z.infer<
  typeof CloseControlChecklistItemFamilySchema
>;
export type CloseControlChecklistStatus = z.infer<
  typeof CloseControlChecklistStatusSchema
>;
export type CloseControlSourcePostureState = z.infer<
  typeof CloseControlSourcePostureStateSchema
>;
export type CloseControlFreshnessState = z.infer<
  typeof CloseControlFreshnessStateSchema
>;
export type CloseControlEvidenceRefKind = z.infer<
  typeof CloseControlEvidenceRefKindSchema
>;
export type CloseControlProofPostureState = z.infer<
  typeof CloseControlProofPostureStateSchema
>;
export type CloseControlEvidenceRef = z.infer<
  typeof CloseControlEvidenceRefSchema
>;
export type CloseControlSourcePosture = z.infer<
  typeof CloseControlSourcePostureSchema
>;
export type CloseControlEvidenceBasis = z.infer<
  typeof CloseControlEvidenceBasisSchema
>;
export type CloseControlFreshnessSummary = z.infer<
  typeof CloseControlFreshnessSummarySchema
>;
export type CloseControlProofPosture = z.infer<
  typeof CloseControlProofPostureSchema
>;
export type CloseControlChecklistItem = z.infer<
  typeof CloseControlChecklistItemSchema
>;
export type CloseControlRuntimeActionBoundary = z.infer<
  typeof CloseControlRuntimeActionBoundarySchema
>;
export type CloseControlChecklistResult = z.infer<
  typeof CloseControlChecklistResultSchema
>;
