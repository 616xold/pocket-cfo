import { z } from "zod";
import {
  CloseControlChecklistItemFamilySchema,
  CloseControlFreshnessSummarySchema,
  CloseControlProofPostureSchema,
} from "./close-control";
import { FinanceCompanyKeySchema } from "./finance-twin";
import { MonitorKindSchema, MonitorSourceLineageRefSchema } from "./monitoring";

export const CloseControlCertificationBoundaryTargetFamilySchema = z.enum([
  "review_summary_boundary",
  "provider_boundary",
  "evidence_and_source_boundary",
  "proof_and_limitation_boundary",
  "human_review_gate_boundary",
  "certification_absence_boundary",
]);

export const CLOSE_CONTROL_CERTIFICATION_BOUNDARY_TARGET_FAMILIES =
  CloseControlCertificationBoundaryTargetFamilySchema.options;

export const CloseControlCertificationBoundaryStatusSchema = z.enum([
  "ready_for_certification_boundary_review",
  "needs_human_review_before_certification_boundary",
  "blocked_by_evidence",
]);

export const CLOSE_CONTROL_CERTIFICATION_BOUNDARY_STATUSES =
  CloseControlCertificationBoundaryStatusSchema.options;

export const CloseControlCertificationBoundaryEvidenceRefKindSchema = z.enum([
  "review_summary_result",
  "review_summary_section",
  "provider_boundary_result",
  "provider_boundary_target",
  "source_lineage",
  "proof_posture",
  "absence_boundary",
]);

export const CloseControlCertificationBoundaryEvidenceRefSchema = z
  .object({
    kind: CloseControlCertificationBoundaryEvidenceRefKindSchema,
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
    reviewSummarySectionKey: z.string().min(1).nullable().default(null),
    providerBoundaryTargetKey: z.string().min(1).nullable().default(null),
    proofRef: z.string().min(1).nullable().default(null),
    relatedSourceRole: z.string().min(1).nullable().default(null),
  })
  .strict();

export const CloseControlCertificationBoundaryEvidenceBasisKindSchema = z.enum([
  "review_summary_posture",
  "provider_boundary_posture",
  "evidence_and_source_posture",
  "proof_and_limitation_posture",
  "human_review_gate_posture",
  "runtime_action_absence_posture",
]);

export const CloseControlCertificationBoundaryEvidenceBasisSchema = z
  .object({
    basisKind: CloseControlCertificationBoundaryEvidenceBasisKindSchema,
    summary: z.string().min(1),
    refs: z
      .array(CloseControlCertificationBoundaryEvidenceRefSchema)
      .default([]),
  })
  .strict();

export const CloseControlCertificationBoundarySourcePostureStateSchema =
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

export const CloseControlCertificationBoundarySourcePostureSchema = z
  .object({
    state: CloseControlCertificationBoundarySourcePostureStateSchema,
    summary: z.string().min(1),
    missingSource: z.boolean().default(false),
    refs: z
      .array(CloseControlCertificationBoundaryEvidenceRefSchema)
      .default([]),
  })
  .strict();

export const CloseControlCertificationBoundaryRuntimeActionAbsenceBoundarySchema =
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

export const CloseControlCertificationBoundaryTargetSchema = z
  .object({
    targetKey: z.string().min(1),
    targetFamily: CloseControlCertificationBoundaryTargetFamilySchema,
    status: CloseControlCertificationBoundaryStatusSchema,
    evidenceBasis: CloseControlCertificationBoundaryEvidenceBasisSchema,
    sourceLineageRefs: z.array(MonitorSourceLineageRefSchema).default([]),
    sourcePosture: CloseControlCertificationBoundarySourcePostureSchema,
    freshnessSummary: CloseControlFreshnessSummarySchema,
    limitations: z.array(z.string().min(1)).min(1),
    proofPosture: CloseControlProofPostureSchema,
    proofRefs: z.array(z.string().min(1)).default([]),
    humanReviewNextStep: z.string().min(1),
    relatedReviewSummarySectionKey: z.string().min(1).nullable().default(null),
    relatedProviderBoundaryTargetKey: z
      .string()
      .min(1)
      .nullable()
      .default(null),
    relatedMonitorKind: MonitorKindSchema.nullable().default(null),
    relatedSourceRole: z.string().min(1).nullable().default(null),
  })
  .strict();

export const CloseControlCertificationBoundaryResultSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    generatedAt: z.string().datetime({ offset: true }),
    aggregateStatus: CloseControlCertificationBoundaryStatusSchema,
    closeControlCertificationBoundaryTargets: z
      .array(CloseControlCertificationBoundaryTargetSchema)
      .length(CLOSE_CONTROL_CERTIFICATION_BOUNDARY_TARGET_FAMILIES.length),
    evidenceSummary: z.string().min(1),
    limitations: z.array(z.string().min(1)).min(1),
    runtimeActionBoundary:
      CloseControlCertificationBoundaryRuntimeActionAbsenceBoundarySchema,
  })
  .strict()
  .superRefine((result, context) => {
    const expectedStatus =
      deriveCloseControlCertificationBoundaryAggregateStatus(
        result.closeControlCertificationBoundaryTargets,
      );

    if (result.aggregateStatus !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Aggregate certification-boundary status must be ${expectedStatus} for the supplied targets`,
        path: ["aggregateStatus"],
      });
    }

    const targetKeys = result.closeControlCertificationBoundaryTargets.map(
      (target) => target.targetKey,
    );
    const duplicateTargetKeys = targetKeys.filter(
      (targetKey, index) => targetKeys.indexOf(targetKey) !== index,
    );

    if (duplicateTargetKeys.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Certification-boundary target keys must be unique",
        path: ["closeControlCertificationBoundaryTargets"],
      });
    }

    const families = result.closeControlCertificationBoundaryTargets.map(
      (target) => target.targetFamily,
    );
    const missingFamilies =
      CLOSE_CONTROL_CERTIFICATION_BOUNDARY_TARGET_FAMILIES.filter(
        (family) => !families.includes(family),
      );
    const duplicateFamilies = families.filter(
      (family, index) => families.indexOf(family) !== index,
    );

    if (missingFamilies.length > 0 || duplicateFamilies.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Certification-boundary results must include each target family exactly once",
        path: ["closeControlCertificationBoundaryTargets"],
      });
    }
  });

export function deriveCloseControlCertificationBoundaryAggregateStatus(
  targets: Array<Pick<CloseControlCertificationBoundaryTarget, "status">>,
): CloseControlCertificationBoundaryStatus {
  if (targets.some((target) => target.status === "blocked_by_evidence")) {
    return "blocked_by_evidence";
  }

  if (
    targets.some(
      (target) =>
        target.status ===
        "needs_human_review_before_certification_boundary",
    )
  ) {
    return "needs_human_review_before_certification_boundary";
  }

  return "ready_for_certification_boundary_review";
}

export type CloseControlCertificationBoundaryTargetFamily = z.infer<
  typeof CloseControlCertificationBoundaryTargetFamilySchema
>;
export type CloseControlCertificationBoundaryStatus = z.infer<
  typeof CloseControlCertificationBoundaryStatusSchema
>;
export type CloseControlCertificationBoundaryEvidenceRefKind = z.infer<
  typeof CloseControlCertificationBoundaryEvidenceRefKindSchema
>;
export type CloseControlCertificationBoundaryEvidenceRef = z.infer<
  typeof CloseControlCertificationBoundaryEvidenceRefSchema
>;
export type CloseControlCertificationBoundaryEvidenceBasisKind = z.infer<
  typeof CloseControlCertificationBoundaryEvidenceBasisKindSchema
>;
export type CloseControlCertificationBoundaryEvidenceBasis = z.infer<
  typeof CloseControlCertificationBoundaryEvidenceBasisSchema
>;
export type CloseControlCertificationBoundarySourcePostureState = z.infer<
  typeof CloseControlCertificationBoundarySourcePostureStateSchema
>;
export type CloseControlCertificationBoundarySourcePosture = z.infer<
  typeof CloseControlCertificationBoundarySourcePostureSchema
>;
export type CloseControlCertificationBoundaryRuntimeActionAbsenceBoundary =
  z.infer<
    typeof CloseControlCertificationBoundaryRuntimeActionAbsenceBoundarySchema
  >;
export type CloseControlCertificationBoundaryTarget = z.infer<
  typeof CloseControlCertificationBoundaryTargetSchema
>;
export type CloseControlCertificationBoundaryResult = z.infer<
  typeof CloseControlCertificationBoundaryResultSchema
>;
