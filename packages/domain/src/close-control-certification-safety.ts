import { z } from "zod";
import {
  CloseControlChecklistItemFamilySchema,
  CloseControlFreshnessSummarySchema,
  CloseControlProofPostureSchema,
} from "./close-control";
import { FinanceCompanyKeySchema } from "./finance-twin";
import { MonitorKindSchema, MonitorSourceLineageRefSchema } from "./monitoring";

export const CloseControlCertificationSafetyTargetFamilySchema = z.enum([
  "certification_boundary_safety",
  "human_confirmation_boundary_safety",
  "review_summary_safety",
  "source_freshness_and_lineage_safety",
  "proof_and_limitation_safety",
  "human_review_next_step_safety",
  "certification_absence_safety",
]);

export const CLOSE_CONTROL_CERTIFICATION_SAFETY_TARGET_FAMILIES =
  CloseControlCertificationSafetyTargetFamilySchema.options;

export const CloseControlCertificationSafetyStatusSchema = z.enum([
  "ready_for_certification_safety_review",
  "needs_human_review_before_certification_safety",
  "blocked_by_evidence",
]);

export const CLOSE_CONTROL_CERTIFICATION_SAFETY_STATUSES =
  CloseControlCertificationSafetyStatusSchema.options;

export const CloseControlCertificationSafetyEvidenceRefKindSchema = z.enum([
  "certification_boundary_result",
  "certification_boundary_target",
  "human_confirmation_boundary_result",
  "human_confirmation_target",
  "review_summary_result",
  "review_summary_section",
  "source_lineage",
  "proof_posture",
  "absence_boundary",
]);

export const CloseControlCertificationSafetyEvidenceRefSchema = z
  .object({
    kind: CloseControlCertificationSafetyEvidenceRefKindSchema,
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
    certificationBoundaryTargetKey: z.string().min(1).nullable().default(null),
    humanConfirmationTargetKey: z.string().min(1).nullable().default(null),
    reviewSummarySectionKey: z.string().min(1).nullable().default(null),
    proofRef: z.string().min(1).nullable().default(null),
    relatedSourceRole: z.string().min(1).nullable().default(null),
  })
  .strict();

export const CloseControlCertificationSafetyEvidenceBasisKindSchema = z.enum([
  "certification_boundary_posture",
  "human_confirmation_boundary_posture",
  "review_summary_posture",
  "source_freshness_and_lineage_posture",
  "proof_and_limitation_posture",
  "human_review_next_step_posture",
  "runtime_action_absence_posture",
]);

export const CloseControlCertificationSafetyEvidenceBasisSchema = z
  .object({
    basisKind: CloseControlCertificationSafetyEvidenceBasisKindSchema,
    summary: z.string().min(1),
    refs: z.array(CloseControlCertificationSafetyEvidenceRefSchema).default([]),
  })
  .strict();

export const CloseControlCertificationSafetySourcePostureStateSchema = z.enum([
  "source_backed",
  "missing_source",
  "failed_source",
  "stale_source",
  "limited_source",
  "monitor_context_present",
  "monitor_context_missing",
  "not_applicable",
]);

export const CloseControlCertificationSafetySourcePostureSchema = z
  .object({
    state: CloseControlCertificationSafetySourcePostureStateSchema,
    summary: z.string().min(1),
    missingSource: z.boolean().default(false),
    refs: z.array(CloseControlCertificationSafetyEvidenceRefSchema).default([]),
  })
  .strict();

export const CloseControlCertificationSafetyRuntimeActionAbsenceBoundarySchema =
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
      assuranceCreated: z.literal(false),
      legalOpinionCreated: z.literal(false),
      auditOpinionCreated: z.literal(false),
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

export const CloseControlCertificationSafetyTargetSchema = z
  .object({
    targetKey: z.string().min(1),
    targetFamily: CloseControlCertificationSafetyTargetFamilySchema,
    status: CloseControlCertificationSafetyStatusSchema,
    evidenceBasis: CloseControlCertificationSafetyEvidenceBasisSchema,
    sourceLineageRefs: z.array(MonitorSourceLineageRefSchema).default([]),
    sourcePosture: CloseControlCertificationSafetySourcePostureSchema,
    freshnessSummary: CloseControlFreshnessSummarySchema,
    limitations: z.array(z.string().min(1)).min(1),
    proofPosture: CloseControlProofPostureSchema,
    proofRefs: z.array(z.string().min(1)).default([]),
    humanReviewNextStep: z.string().min(1),
    relatedCertificationBoundaryTargetKey: z
      .string()
      .min(1)
      .nullable()
      .default(null),
    relatedHumanConfirmationTargetKey: z
      .string()
      .min(1)
      .nullable()
      .default(null),
    relatedReviewSummarySectionKey: z.string().min(1).nullable().default(null),
    relatedMonitorKind: MonitorKindSchema.nullable().default(null),
    relatedSourceRole: z.string().min(1).nullable().default(null),
  })
  .strict();

export const CloseControlCertificationSafetyResultSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    generatedAt: z.string().datetime({ offset: true }),
    aggregateStatus: CloseControlCertificationSafetyStatusSchema,
    closeControlCertificationSafetyTargets: z
      .array(CloseControlCertificationSafetyTargetSchema)
      .length(CLOSE_CONTROL_CERTIFICATION_SAFETY_TARGET_FAMILIES.length),
    evidenceSummary: z.string().min(1),
    limitations: z.array(z.string().min(1)).min(1),
    runtimeActionBoundary:
      CloseControlCertificationSafetyRuntimeActionAbsenceBoundarySchema,
  })
  .strict()
  .superRefine((result, context) => {
    const expectedStatus = deriveCloseControlCertificationSafetyAggregateStatus(
      result.closeControlCertificationSafetyTargets,
    );

    if (result.aggregateStatus !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Aggregate certification-safety status must be ${expectedStatus} for the supplied targets`,
        path: ["aggregateStatus"],
      });
    }

    const targetKeys = result.closeControlCertificationSafetyTargets.map(
      (target) => target.targetKey,
    );
    const duplicateTargetKeys = targetKeys.filter(
      (targetKey, index) => targetKeys.indexOf(targetKey) !== index,
    );

    if (duplicateTargetKeys.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Certification-safety target keys must be unique",
        path: ["closeControlCertificationSafetyTargets"],
      });
    }

    const families = result.closeControlCertificationSafetyTargets.map(
      (target) => target.targetFamily,
    );
    const missingFamilies =
      CLOSE_CONTROL_CERTIFICATION_SAFETY_TARGET_FAMILIES.filter(
        (family) => !families.includes(family),
      );
    const duplicateFamilies = families.filter(
      (family, index) => families.indexOf(family) !== index,
    );

    if (missingFamilies.length > 0 || duplicateFamilies.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Certification-safety results must include each target family exactly once",
        path: ["closeControlCertificationSafetyTargets"],
      });
    }
  });

export function deriveCloseControlCertificationSafetyAggregateStatus(
  targets: Array<Pick<CloseControlCertificationSafetyTarget, "status">>,
): CloseControlCertificationSafetyStatus {
  if (targets.some((target) => target.status === "blocked_by_evidence")) {
    return "blocked_by_evidence";
  }

  if (
    targets.some(
      (target) =>
        target.status === "needs_human_review_before_certification_safety",
    )
  ) {
    return "needs_human_review_before_certification_safety";
  }

  return "ready_for_certification_safety_review";
}

export type CloseControlCertificationSafetyTargetFamily = z.infer<
  typeof CloseControlCertificationSafetyTargetFamilySchema
>;
export type CloseControlCertificationSafetyStatus = z.infer<
  typeof CloseControlCertificationSafetyStatusSchema
>;
export type CloseControlCertificationSafetyEvidenceRefKind = z.infer<
  typeof CloseControlCertificationSafetyEvidenceRefKindSchema
>;
export type CloseControlCertificationSafetyEvidenceRef = z.infer<
  typeof CloseControlCertificationSafetyEvidenceRefSchema
>;
export type CloseControlCertificationSafetyEvidenceBasisKind = z.infer<
  typeof CloseControlCertificationSafetyEvidenceBasisKindSchema
>;
export type CloseControlCertificationSafetyEvidenceBasis = z.infer<
  typeof CloseControlCertificationSafetyEvidenceBasisSchema
>;
export type CloseControlCertificationSafetySourcePostureState = z.infer<
  typeof CloseControlCertificationSafetySourcePostureStateSchema
>;
export type CloseControlCertificationSafetySourcePosture = z.infer<
  typeof CloseControlCertificationSafetySourcePostureSchema
>;
export type CloseControlCertificationSafetyRuntimeActionAbsenceBoundary =
  z.infer<
    typeof CloseControlCertificationSafetyRuntimeActionAbsenceBoundarySchema
  >;
export type CloseControlCertificationSafetyTarget = z.infer<
  typeof CloseControlCertificationSafetyTargetSchema
>;
export type CloseControlCertificationSafetyResult = z.infer<
  typeof CloseControlCertificationSafetyResultSchema
>;
