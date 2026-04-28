import { z } from "zod";
import {
  CloseControlChecklistItemFamilySchema,
  CloseControlChecklistStatusSchema,
} from "./close-control";
import { FinanceCompanyKeySchema } from "./finance-twin";
import {
  MonitorKindSchema,
  MonitorResultStatusSchema,
  MonitorSourceLineageRefSchema,
} from "./monitoring";

export const OperatorAttentionItemFamilySchema = z.enum([
  "monitor_alert_attention",
  "close_control_attention",
  "source_freshness_attention",
  "policy_source_attention",
]);

export const OPERATOR_ATTENTION_ITEM_FAMILIES =
  OperatorAttentionItemFamilySchema.options;

export const OperatorReadinessStatusSchema = CloseControlChecklistStatusSchema;

export const OperatorReadinessEvidenceRefKindSchema = z.enum([
  "monitor_result",
  "monitor_alert_card",
  "close_control_checklist",
  "close_control_checklist_item",
  "source_lineage",
  "proof_posture",
]);

export const OperatorReadinessEvidenceRefSchema = z
  .object({
    kind: OperatorReadinessEvidenceRefKindSchema,
    evidencePath: z.string().min(1),
    summary: z.string().min(1),
    sourceId: z.string().uuid().nullable().default(null),
    sourceSnapshotId: z.string().uuid().nullable().default(null),
    sourceFileId: z.string().uuid().nullable().default(null),
    syncRunId: z.string().uuid().nullable().default(null),
    pageKey: z.string().min(1).nullable().default(null),
    monitorKind: MonitorKindSchema.nullable().default(null),
    monitorResultId: z.string().uuid().nullable().default(null),
    checklistItemFamily:
      CloseControlChecklistItemFamilySchema.nullable().default(null),
    proofRef: z.string().min(1).nullable().default(null),
  })
  .strict();

export const OperatorReadinessEvidenceBasisKindSchema = z.enum([
  "latest_persisted_monitor_result",
  "close_control_checklist_posture",
  "source_freshness_posture",
  "policy_source_posture",
]);

export const OperatorReadinessEvidenceBasisSchema = z
  .object({
    basisKind: OperatorReadinessEvidenceBasisKindSchema,
    summary: z.string().min(1),
    refs: z.array(OperatorReadinessEvidenceRefSchema).default([]),
  })
  .strict();

export const OperatorReadinessSourcePostureStateSchema = z.enum([
  "source_backed",
  "missing_source",
  "failed_source",
  "stale_source",
  "limited_source",
  "monitor_context_present",
  "monitor_context_missing",
  "not_applicable",
]);

export const OperatorReadinessSourcePostureSchema = z
  .object({
    state: OperatorReadinessSourcePostureStateSchema,
    summary: z.string().min(1),
    refs: z.array(OperatorReadinessEvidenceRefSchema).default([]),
  })
  .strict();

export const OperatorReadinessFreshnessStateSchema = z.enum([
  "fresh",
  "stale",
  "missing",
  "mixed",
  "failed",
  "not_applicable",
]);

export const OperatorReadinessFreshnessSummarySchema = z
  .object({
    state: OperatorReadinessFreshnessStateSchema,
    summary: z.string().min(1),
    latestObservedAt: z
      .string()
      .datetime({ offset: true })
      .nullable()
      .default(null),
  })
  .strict();

export const OperatorReadinessProofPostureStateSchema = z.enum([
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

export const OperatorReadinessProofPostureSchema = z
  .object({
    state: OperatorReadinessProofPostureStateSchema,
    summary: z.string().min(1),
  })
  .strict();

export const OperatorRuntimeActionAbsenceBoundarySchema = z
  .object({
    runtimeCodexUsed: z.literal(false),
    deliveryCreated: z.literal(false),
    outboxSendCreated: z.literal(false),
    reportCreated: z.literal(false),
    approvalCreated: z.literal(false),
    missionCreated: z.literal(false),
    monitorRunTriggered: z.literal(false),
    monitorResultCreated: z.literal(false),
    accountingWriteCreated: z.literal(false),
    bankWriteCreated: z.literal(false),
    taxFilingCreated: z.literal(false),
    legalAdviceGenerated: z.literal(false),
    policyAdviceGenerated: z.literal(false),
    paymentInstructionCreated: z.literal(false),
    collectionInstructionCreated: z.literal(false),
    customerContactInstructionCreated: z.literal(false),
    autonomousActionCreated: z.literal(false),
    summary: z.string().min(1),
    replayImplication: z.string().min(1),
  })
  .strict();

export const OperatorAttentionItemSchema = z
  .object({
    itemKey: z.string().min(1),
    family: OperatorAttentionItemFamilySchema,
    status: OperatorReadinessStatusSchema,
    evidenceBasis: OperatorReadinessEvidenceBasisSchema,
    sourceLineageRefs: z.array(MonitorSourceLineageRefSchema).default([]),
    sourcePosture: OperatorReadinessSourcePostureSchema,
    freshnessSummary: OperatorReadinessFreshnessSummarySchema,
    limitations: z.array(z.string().min(1)).min(1),
    proofPosture: OperatorReadinessProofPostureSchema,
    humanReviewNextStep: z.string().min(1),
    relatedMonitorKind: MonitorKindSchema.nullable().default(null),
    relatedChecklistItemFamily:
      CloseControlChecklistItemFamilySchema.nullable().default(null),
    relatedAlertStatus: MonitorResultStatusSchema.nullable().default(null),
  })
  .strict();

export const OperatorReadinessResultSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    generatedAt: z.string().datetime({ offset: true }),
    aggregateStatus: OperatorReadinessStatusSchema,
    attentionItems: z.array(OperatorAttentionItemSchema),
    evidenceSummary: z.string().min(1),
    limitations: z.array(z.string().min(1)).min(1),
    runtimeActionBoundary: OperatorRuntimeActionAbsenceBoundarySchema,
  })
  .strict()
  .superRefine((result, context) => {
    const expectedStatus = deriveOperatorReadinessAggregateStatus(
      result.attentionItems,
    );

    if (result.aggregateStatus !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Aggregate status must be ${expectedStatus} for the supplied operator attention items`,
        path: ["aggregateStatus"],
      });
    }

    const itemKeys = result.attentionItems.map((item) => item.itemKey);
    const duplicateItemKeys = itemKeys.filter(
      (itemKey, index) => itemKeys.indexOf(itemKey) !== index,
    );

    if (duplicateItemKeys.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Operator attention item keys must be unique",
        path: ["attentionItems"],
      });
    }
  });

export function deriveOperatorReadinessAggregateStatus(
  items: Array<Pick<OperatorAttentionItem, "status">>,
): OperatorReadinessStatus {
  if (items.some((item) => item.status === "blocked_by_evidence")) {
    return "blocked_by_evidence";
  }

  if (items.some((item) => item.status === "needs_review")) {
    return "needs_review";
  }

  return "ready_for_review";
}

export type OperatorAttentionItemFamily = z.infer<
  typeof OperatorAttentionItemFamilySchema
>;
export type OperatorReadinessStatus = z.infer<
  typeof OperatorReadinessStatusSchema
>;
export type OperatorReadinessEvidenceRefKind = z.infer<
  typeof OperatorReadinessEvidenceRefKindSchema
>;
export type OperatorReadinessEvidenceRef = z.infer<
  typeof OperatorReadinessEvidenceRefSchema
>;
export type OperatorReadinessEvidenceBasisKind = z.infer<
  typeof OperatorReadinessEvidenceBasisKindSchema
>;
export type OperatorReadinessEvidenceBasis = z.infer<
  typeof OperatorReadinessEvidenceBasisSchema
>;
export type OperatorReadinessSourcePostureState = z.infer<
  typeof OperatorReadinessSourcePostureStateSchema
>;
export type OperatorReadinessSourcePosture = z.infer<
  typeof OperatorReadinessSourcePostureSchema
>;
export type OperatorReadinessFreshnessState = z.infer<
  typeof OperatorReadinessFreshnessStateSchema
>;
export type OperatorReadinessFreshnessSummary = z.infer<
  typeof OperatorReadinessFreshnessSummarySchema
>;
export type OperatorReadinessProofPostureState = z.infer<
  typeof OperatorReadinessProofPostureStateSchema
>;
export type OperatorReadinessProofPosture = z.infer<
  typeof OperatorReadinessProofPostureSchema
>;
export type OperatorRuntimeActionAbsenceBoundary = z.infer<
  typeof OperatorRuntimeActionAbsenceBoundarySchema
>;
export type OperatorAttentionItem = z.infer<
  typeof OperatorAttentionItemSchema
>;
export type OperatorReadinessResult = z.infer<
  typeof OperatorReadinessResultSchema
>;
