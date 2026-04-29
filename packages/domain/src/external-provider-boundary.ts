import { z } from "zod";
import {
  CloseControlChecklistItemFamilySchema,
  CloseControlFreshnessSummarySchema,
  CloseControlProofPostureSchema,
} from "./close-control";
import { FinanceCompanyKeySchema } from "./finance-twin";
import { MonitorKindSchema, MonitorSourceLineageRefSchema } from "./monitoring";

export const ExternalProviderBoundaryTargetFamilySchema = z.enum([
  "delivery_readiness_boundary",
  "review_summary_boundary",
  "source_freshness_boundary",
  "proof_and_limitation_boundary",
  "human_review_gate_boundary",
  "outbox_absence_boundary",
]);

export const EXTERNAL_PROVIDER_BOUNDARY_TARGET_FAMILIES =
  ExternalProviderBoundaryTargetFamilySchema.options;

export const ExternalProviderBoundaryStatusSchema = z.enum([
  "ready_for_provider_boundary_review",
  "needs_human_review_before_provider_boundary",
  "blocked_by_evidence",
]);

export const EXTERNAL_PROVIDER_BOUNDARY_STATUSES =
  ExternalProviderBoundaryStatusSchema.options;

export const ExternalProviderBoundaryEvidenceRefKindSchema = z.enum([
  "delivery_readiness_result",
  "delivery_readiness_target",
  "review_summary_result",
  "review_summary_section",
  "source_lineage",
  "proof_posture",
  "absence_boundary",
]);

export const ExternalProviderBoundaryEvidenceRefSchema = z
  .object({
    kind: ExternalProviderBoundaryEvidenceRefKindSchema,
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
    deliveryReadinessTargetKey: z.string().min(1).nullable().default(null),
    reviewSummarySectionKey: z.string().min(1).nullable().default(null),
    proofRef: z.string().min(1).nullable().default(null),
    relatedSourceRole: z.string().min(1).nullable().default(null),
  })
  .strict();

export const ExternalProviderBoundaryEvidenceBasisKindSchema = z.enum([
  "delivery_readiness_posture",
  "review_summary_posture",
  "source_freshness_posture",
  "proof_and_limitation_posture",
  "human_review_gate_posture",
  "runtime_action_absence_posture",
]);

export const ExternalProviderBoundaryEvidenceBasisSchema = z
  .object({
    basisKind: ExternalProviderBoundaryEvidenceBasisKindSchema,
    summary: z.string().min(1),
    refs: z.array(ExternalProviderBoundaryEvidenceRefSchema).default([]),
  })
  .strict();

export const ExternalProviderBoundarySourcePostureStateSchema = z.enum([
  "source_backed",
  "missing_source",
  "failed_source",
  "stale_source",
  "limited_source",
  "monitor_context_present",
  "monitor_context_missing",
  "not_applicable",
]);

export const ExternalProviderBoundarySourcePostureSchema = z
  .object({
    state: ExternalProviderBoundarySourcePostureStateSchema,
    summary: z.string().min(1),
    missingSource: z.boolean().default(false),
    refs: z.array(ExternalProviderBoundaryEvidenceRefSchema).default([]),
  })
  .strict();

export const ExternalProviderBoundaryRuntimeActionAbsenceBoundarySchema = z
  .object({
    runtimeCodexUsed: z.literal(false),
    deliveryCreated: z.literal(false),
    externalProviderCalled: z.literal(false),
    notificationProviderCalled: z.literal(false),
    providerCredentialCreated: z.literal(false),
    providerJobCreated: z.literal(false),
    outboxSendCreated: z.literal(false),
    emailSent: z.literal(false),
    slackSent: z.literal(false),
    smsSent: z.literal(false),
    webhookCalled: z.literal(false),
    scheduledDeliveryCreated: z.literal(false),
    autoSendConfigured: z.literal(false),
    reportCreated: z.literal(false),
    reportReleased: z.literal(false),
    approvalCreated: z.literal(false),
    missionCreated: z.literal(false),
    monitorRunTriggered: z.literal(false),
    monitorResultCreated: z.literal(false),
    sourceMutationCreated: z.literal(false),
    generatedNotificationProseCreated: z.literal(false),
    generatedProseCreated: z.literal(false),
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

export const ExternalProviderBoundaryTargetSchema = z
  .object({
    targetKey: z.string().min(1),
    targetFamily: ExternalProviderBoundaryTargetFamilySchema,
    status: ExternalProviderBoundaryStatusSchema,
    evidenceBasis: ExternalProviderBoundaryEvidenceBasisSchema,
    sourceLineageRefs: z.array(MonitorSourceLineageRefSchema).default([]),
    sourcePosture: ExternalProviderBoundarySourcePostureSchema,
    freshnessSummary: CloseControlFreshnessSummarySchema,
    limitations: z.array(z.string().min(1)).min(1),
    proofPosture: CloseControlProofPostureSchema,
    proofRefs: z.array(z.string().min(1)).default([]),
    humanReviewNextStep: z.string().min(1),
    relatedDeliveryReadinessTargetKey: z
      .string()
      .min(1)
      .nullable()
      .default(null),
    relatedReviewSummarySectionKey: z.string().min(1).nullable().default(null),
    relatedMonitorKind: MonitorKindSchema.nullable().default(null),
    relatedSourceRole: z.string().min(1).nullable().default(null),
  })
  .strict();

export const ExternalProviderBoundaryResultSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    generatedAt: z.string().datetime({ offset: true }),
    aggregateStatus: ExternalProviderBoundaryStatusSchema,
    externalProviderBoundaryTargets: z
      .array(ExternalProviderBoundaryTargetSchema)
      .length(EXTERNAL_PROVIDER_BOUNDARY_TARGET_FAMILIES.length),
    evidenceSummary: z.string().min(1),
    limitations: z.array(z.string().min(1)).min(1),
    runtimeActionBoundary:
      ExternalProviderBoundaryRuntimeActionAbsenceBoundarySchema,
  })
  .strict()
  .superRefine((result, context) => {
    const expectedStatus = deriveExternalProviderBoundaryAggregateStatus(
      result.externalProviderBoundaryTargets,
    );

    if (result.aggregateStatus !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Aggregate provider-boundary status must be ${expectedStatus} for the supplied targets`,
        path: ["aggregateStatus"],
      });
    }

    const targetKeys = result.externalProviderBoundaryTargets.map(
      (target) => target.targetKey,
    );
    const duplicateTargetKeys = targetKeys.filter(
      (targetKey, index) => targetKeys.indexOf(targetKey) !== index,
    );

    if (duplicateTargetKeys.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provider-boundary target keys must be unique",
        path: ["externalProviderBoundaryTargets"],
      });
    }

    const families = result.externalProviderBoundaryTargets.map(
      (target) => target.targetFamily,
    );
    const missingFamilies = EXTERNAL_PROVIDER_BOUNDARY_TARGET_FAMILIES.filter(
      (family) => !families.includes(family),
    );
    const duplicateFamilies = families.filter(
      (family, index) => families.indexOf(family) !== index,
    );

    if (missingFamilies.length > 0 || duplicateFamilies.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Provider-boundary results must include each target family exactly once",
        path: ["externalProviderBoundaryTargets"],
      });
    }
  });

export function deriveExternalProviderBoundaryAggregateStatus(
  targets: Array<Pick<ExternalProviderBoundaryTarget, "status">>,
): ExternalProviderBoundaryStatus {
  if (targets.some((target) => target.status === "blocked_by_evidence")) {
    return "blocked_by_evidence";
  }

  if (
    targets.some(
      (target) =>
        target.status === "needs_human_review_before_provider_boundary",
    )
  ) {
    return "needs_human_review_before_provider_boundary";
  }

  return "ready_for_provider_boundary_review";
}

export type ExternalProviderBoundaryTargetFamily = z.infer<
  typeof ExternalProviderBoundaryTargetFamilySchema
>;
export type ExternalProviderBoundaryStatus = z.infer<
  typeof ExternalProviderBoundaryStatusSchema
>;
export type ExternalProviderBoundaryEvidenceRefKind = z.infer<
  typeof ExternalProviderBoundaryEvidenceRefKindSchema
>;
export type ExternalProviderBoundaryEvidenceRef = z.infer<
  typeof ExternalProviderBoundaryEvidenceRefSchema
>;
export type ExternalProviderBoundaryEvidenceBasisKind = z.infer<
  typeof ExternalProviderBoundaryEvidenceBasisKindSchema
>;
export type ExternalProviderBoundaryEvidenceBasis = z.infer<
  typeof ExternalProviderBoundaryEvidenceBasisSchema
>;
export type ExternalProviderBoundarySourcePostureState = z.infer<
  typeof ExternalProviderBoundarySourcePostureStateSchema
>;
export type ExternalProviderBoundarySourcePosture = z.infer<
  typeof ExternalProviderBoundarySourcePostureSchema
>;
export type ExternalProviderBoundaryRuntimeActionAbsenceBoundary = z.infer<
  typeof ExternalProviderBoundaryRuntimeActionAbsenceBoundarySchema
>;
export type ExternalProviderBoundaryTarget = z.infer<
  typeof ExternalProviderBoundaryTargetSchema
>;
export type ExternalProviderBoundaryResult = z.infer<
  typeof ExternalProviderBoundaryResultSchema
>;
