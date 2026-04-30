import { z } from "zod";
import {
  CloseControlChecklistItemFamilySchema,
  CloseControlFreshnessSummarySchema,
  CloseControlProofPostureSchema,
} from "./close-control";
import { FinanceCompanyKeySchema } from "./finance-twin";
import { MonitorKindSchema, MonitorSourceLineageRefSchema } from "./monitoring";

export const ExternalDeliveryHumanConfirmationTargetFamilySchema = z.enum([
  "delivery_readiness_confirmation_boundary",
  "provider_boundary_confirmation_boundary",
  "certification_boundary_confirmation_boundary",
  "review_summary_confirmation_boundary",
  "source_freshness_and_proof_boundary",
  "human_confirmation_absence_boundary",
]);

export const EXTERNAL_DELIVERY_HUMAN_CONFIRMATION_TARGET_FAMILIES =
  ExternalDeliveryHumanConfirmationTargetFamilySchema.options;

export const ExternalDeliveryHumanConfirmationStatusSchema = z.enum([
  "ready_for_human_confirmation_review",
  "needs_human_review_before_confirmation",
  "blocked_by_evidence",
]);

export const EXTERNAL_DELIVERY_HUMAN_CONFIRMATION_STATUSES =
  ExternalDeliveryHumanConfirmationStatusSchema.options;

export const ExternalDeliveryHumanConfirmationEvidenceRefKindSchema = z.enum([
  "delivery_readiness_result",
  "delivery_readiness_target",
  "provider_boundary_result",
  "provider_boundary_target",
  "certification_boundary_result",
  "certification_boundary_target",
  "review_summary_result",
  "review_summary_section",
  "source_lineage",
  "proof_posture",
  "absence_boundary",
]);

export const ExternalDeliveryHumanConfirmationEvidenceRefSchema = z
  .object({
    kind: ExternalDeliveryHumanConfirmationEvidenceRefKindSchema,
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
    providerBoundaryTargetKey: z.string().min(1).nullable().default(null),
    certificationBoundaryTargetKey: z.string().min(1).nullable().default(null),
    reviewSummarySectionKey: z.string().min(1).nullable().default(null),
    proofRef: z.string().min(1).nullable().default(null),
    relatedSourceRole: z.string().min(1).nullable().default(null),
  })
  .strict();

export const ExternalDeliveryHumanConfirmationEvidenceBasisKindSchema = z.enum([
  "delivery_readiness_posture",
  "provider_boundary_posture",
  "certification_boundary_posture",
  "review_summary_posture",
  "source_freshness_and_proof_posture",
  "runtime_action_absence_posture",
]);

export const ExternalDeliveryHumanConfirmationEvidenceBasisSchema = z
  .object({
    basisKind: ExternalDeliveryHumanConfirmationEvidenceBasisKindSchema,
    summary: z.string().min(1),
    refs: z
      .array(ExternalDeliveryHumanConfirmationEvidenceRefSchema)
      .default([]),
  })
  .strict();

export const ExternalDeliveryHumanConfirmationSourcePostureStateSchema =
  z.enum([
    "source_backed",
    "missing_source",
    "failed_source",
    "stale_source",
    "limited_source",
    "monitor_context_present",
    "monitor_context_missing",
    "not_applicable",
  ]);

export const ExternalDeliveryHumanConfirmationSourcePostureSchema = z
  .object({
    state: ExternalDeliveryHumanConfirmationSourcePostureStateSchema,
    summary: z.string().min(1),
    missingSource: z.boolean().default(false),
    refs: z
      .array(ExternalDeliveryHumanConfirmationEvidenceRefSchema)
      .default([]),
  })
  .strict();

export const ExternalDeliveryHumanConfirmationRuntimeActionAbsenceBoundarySchema =
  z
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
      reportCirculated: z.literal(false),
      approvalCreated: z.literal(false),
      certificationCreated: z.literal(false),
      closeCompleteCreated: z.literal(false),
      signOffCreated: z.literal(false),
      attestationCreated: z.literal(false),
      legalOpinionCreated: z.literal(false),
      auditOpinionCreated: z.literal(false),
      assuranceCreated: z.literal(false),
      missionCreated: z.literal(false),
      monitorRunTriggered: z.literal(false),
      monitorResultCreated: z.literal(false),
      sourceMutationCreated: z.literal(false),
      generatedProseCreated: z.literal(false),
      generatedNotificationProseCreated: z.literal(false),
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

export const ExternalDeliveryHumanConfirmationTargetSchema = z
  .object({
    targetKey: z.string().min(1),
    targetFamily: ExternalDeliveryHumanConfirmationTargetFamilySchema,
    status: ExternalDeliveryHumanConfirmationStatusSchema,
    evidenceBasis: ExternalDeliveryHumanConfirmationEvidenceBasisSchema,
    sourceLineageRefs: z.array(MonitorSourceLineageRefSchema).default([]),
    sourcePosture: ExternalDeliveryHumanConfirmationSourcePostureSchema,
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
    relatedProviderBoundaryTargetKey: z
      .string()
      .min(1)
      .nullable()
      .default(null),
    relatedCertificationBoundaryTargetKey: z
      .string()
      .min(1)
      .nullable()
      .default(null),
    relatedReviewSummarySectionKey: z.string().min(1).nullable().default(null),
    relatedMonitorKind: MonitorKindSchema.nullable().default(null),
    relatedSourceRole: z.string().min(1).nullable().default(null),
  })
  .strict();

export const ExternalDeliveryHumanConfirmationBoundaryResultSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    generatedAt: z.string().datetime({ offset: true }),
    aggregateStatus: ExternalDeliveryHumanConfirmationStatusSchema,
    deliveryGateTargets: z
      .array(ExternalDeliveryHumanConfirmationTargetSchema)
      .length(EXTERNAL_DELIVERY_HUMAN_CONFIRMATION_TARGET_FAMILIES.length),
    evidenceSummary: z.string().min(1),
    limitations: z.array(z.string().min(1)).min(1),
    runtimeActionBoundary:
      ExternalDeliveryHumanConfirmationRuntimeActionAbsenceBoundarySchema,
  })
  .strict()
  .superRefine((result, context) => {
    const expectedStatus =
      deriveExternalDeliveryHumanConfirmationAggregateStatus(
        result.deliveryGateTargets,
      );

    if (result.aggregateStatus !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Aggregate human-confirmation status must be ${expectedStatus} for the supplied targets`,
        path: ["aggregateStatus"],
      });
    }

    const targetKeys = result.deliveryGateTargets.map(
      (target) => target.targetKey,
    );
    const duplicateTargetKeys = targetKeys.filter(
      (targetKey, index) => targetKeys.indexOf(targetKey) !== index,
    );

    if (duplicateTargetKeys.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Human-confirmation target keys must be unique",
        path: ["deliveryGateTargets"],
      });
    }

    const families = result.deliveryGateTargets.map(
      (target) => target.targetFamily,
    );
    const missingFamilies =
      EXTERNAL_DELIVERY_HUMAN_CONFIRMATION_TARGET_FAMILIES.filter(
        (family) => !families.includes(family),
      );
    const duplicateFamilies = families.filter(
      (family, index) => families.indexOf(family) !== index,
    );

    if (missingFamilies.length > 0 || duplicateFamilies.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Human-confirmation results must include each target family exactly once",
        path: ["deliveryGateTargets"],
      });
    }
  });

export function deriveExternalDeliveryHumanConfirmationAggregateStatus(
  targets: Array<Pick<ExternalDeliveryHumanConfirmationTarget, "status">>,
): ExternalDeliveryHumanConfirmationStatus {
  if (targets.some((target) => target.status === "blocked_by_evidence")) {
    return "blocked_by_evidence";
  }

  if (
    targets.some(
      (target) =>
        target.status === "needs_human_review_before_confirmation",
    )
  ) {
    return "needs_human_review_before_confirmation";
  }

  return "ready_for_human_confirmation_review";
}

export type ExternalDeliveryHumanConfirmationTargetFamily = z.infer<
  typeof ExternalDeliveryHumanConfirmationTargetFamilySchema
>;
export type ExternalDeliveryHumanConfirmationStatus = z.infer<
  typeof ExternalDeliveryHumanConfirmationStatusSchema
>;
export type ExternalDeliveryHumanConfirmationEvidenceRefKind = z.infer<
  typeof ExternalDeliveryHumanConfirmationEvidenceRefKindSchema
>;
export type ExternalDeliveryHumanConfirmationEvidenceRef = z.infer<
  typeof ExternalDeliveryHumanConfirmationEvidenceRefSchema
>;
export type ExternalDeliveryHumanConfirmationEvidenceBasisKind = z.infer<
  typeof ExternalDeliveryHumanConfirmationEvidenceBasisKindSchema
>;
export type ExternalDeliveryHumanConfirmationEvidenceBasis = z.infer<
  typeof ExternalDeliveryHumanConfirmationEvidenceBasisSchema
>;
export type ExternalDeliveryHumanConfirmationSourcePostureState = z.infer<
  typeof ExternalDeliveryHumanConfirmationSourcePostureStateSchema
>;
export type ExternalDeliveryHumanConfirmationSourcePosture = z.infer<
  typeof ExternalDeliveryHumanConfirmationSourcePostureSchema
>;
export type ExternalDeliveryHumanConfirmationRuntimeActionAbsenceBoundary =
  z.infer<
    typeof ExternalDeliveryHumanConfirmationRuntimeActionAbsenceBoundarySchema
  >;
export type ExternalDeliveryHumanConfirmationTarget = z.infer<
  typeof ExternalDeliveryHumanConfirmationTargetSchema
>;
export type ExternalDeliveryHumanConfirmationBoundaryResult = z.infer<
  typeof ExternalDeliveryHumanConfirmationBoundaryResultSchema
>;
