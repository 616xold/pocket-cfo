import { z } from "zod";
import {
  CloseControlChecklistItemFamilySchema,
  CloseControlFreshnessSummarySchema,
  CloseControlProofPostureSchema,
} from "./close-control";
import { FinanceCompanyKeySchema } from "./finance-twin";
import { MonitorKindSchema, MonitorSourceLineageRefSchema } from "./monitoring";

export const CloseControlReviewSectionFamilySchema = z.enum([
  "close_control_checklist_posture",
  "operator_readiness_posture",
  "acknowledgement_readiness_posture",
  "delivery_boundary_posture",
  "monitor_context_posture",
  "source_and_wiki_freshness_posture",
]);

export const CLOSE_CONTROL_REVIEW_SECTION_FAMILIES =
  CloseControlReviewSectionFamilySchema.options;

export const CloseControlReviewStatusSchema = z.enum([
  "ready_for_review_summary",
  "needs_human_review",
  "blocked_by_evidence",
]);

export const CLOSE_CONTROL_REVIEW_STATUSES =
  CloseControlReviewStatusSchema.options;

export const CloseControlReviewEvidenceRefKindSchema = z.enum([
  "close_control_checklist",
  "close_control_checklist_item",
  "operator_readiness_result",
  "operator_readiness_item",
  "acknowledgement_readiness_result",
  "acknowledgement_readiness_target",
  "delivery_readiness_result",
  "delivery_readiness_target",
  "monitor_context",
  "source_lineage",
  "proof_posture",
]);

export const CloseControlReviewEvidenceRefSchema = z
  .object({
    kind: CloseControlReviewEvidenceRefKindSchema,
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
    operatorReadinessItemKey: z.string().min(1).nullable().default(null),
    acknowledgementTargetKey: z.string().min(1).nullable().default(null),
    deliveryReadinessTargetKey: z.string().min(1).nullable().default(null),
    proofRef: z.string().min(1).nullable().default(null),
  })
  .strict();

export const CloseControlReviewEvidenceBasisSchema = z
  .object({
    summary: z.string().min(1),
    refs: z.array(CloseControlReviewEvidenceRefSchema).default([]),
  })
  .strict();

export const CloseControlReviewSourcePostureStateSchema = z.enum([
  "source_backed",
  "missing_source",
  "failed_source",
  "stale_source",
  "limited_source",
  "monitor_context_present",
  "monitor_context_missing",
  "not_applicable",
]);

export const CloseControlReviewSourcePostureSchema = z
  .object({
    state: CloseControlReviewSourcePostureStateSchema,
    summary: z.string().min(1),
    missingSource: z.boolean().default(false),
    refs: z.array(CloseControlReviewEvidenceRefSchema).default([]),
  })
  .strict();

export const CloseControlReviewRuntimeActionAbsenceBoundarySchema = z
  .object({
    runtimeCodexUsed: z.literal(false),
    deliveryCreated: z.literal(false),
    outboxSendCreated: z.literal(false),
    notificationProviderCalled: z.literal(false),
    emailSent: z.literal(false),
    slackSent: z.literal(false),
    smsSent: z.literal(false),
    webhookCalled: z.literal(false),
    reportCreated: z.literal(false),
    reportReleased: z.literal(false),
    reportCirculated: z.literal(false),
    approvalCreated: z.literal(false),
    certificationCreated: z.literal(false),
    closeCompleteCreated: z.literal(false),
    signOffCreated: z.literal(false),
    attestationCreated: z.literal(false),
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

export const CloseControlReviewSectionSchema = z
  .object({
    sectionKey: z.string().min(1),
    family: CloseControlReviewSectionFamilySchema,
    status: CloseControlReviewStatusSchema,
    evidenceBasis: CloseControlReviewEvidenceBasisSchema,
    sourceLineageRefs: z.array(MonitorSourceLineageRefSchema).default([]),
    sourcePosture: CloseControlReviewSourcePostureSchema,
    freshnessSummary: CloseControlFreshnessSummarySchema,
    limitations: z.array(z.string().min(1)).min(1),
    proofPosture: CloseControlProofPostureSchema,
    proofRefs: z.array(z.string().min(1)).default([]),
    humanReviewNextStep: z.string().min(1),
    relatedChecklistItemFamily:
      CloseControlChecklistItemFamilySchema.nullable().default(null),
    relatedReadinessItemKey: z.string().min(1).nullable().default(null),
    relatedAcknowledgementTargetKey:
      z.string().min(1).nullable().default(null),
    relatedDeliveryReadinessTargetKey:
      z.string().min(1).nullable().default(null),
    relatedMonitorKind: MonitorKindSchema.nullable().default(null),
  })
  .strict();

export const CloseControlReviewSummaryResultSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    generatedAt: z.string().datetime({ offset: true }),
    aggregateStatus: CloseControlReviewStatusSchema,
    reviewSections: z
      .array(CloseControlReviewSectionSchema)
      .length(CLOSE_CONTROL_REVIEW_SECTION_FAMILIES.length),
    evidenceSummary: z.string().min(1),
    limitations: z.array(z.string().min(1)).min(1),
    runtimeActionBoundary:
      CloseControlReviewRuntimeActionAbsenceBoundarySchema,
  })
  .strict()
  .superRefine((result, context) => {
    const expectedStatus = deriveCloseControlReviewAggregateStatus(
      result.reviewSections,
    );

    if (result.aggregateStatus !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Aggregate review-summary status must be ${expectedStatus} for the supplied sections`,
        path: ["aggregateStatus"],
      });
    }

    const sectionKeys = result.reviewSections.map(
      (section) => section.sectionKey,
    );
    const duplicateSectionKeys = sectionKeys.filter(
      (sectionKey, index) => sectionKeys.indexOf(sectionKey) !== index,
    );

    if (duplicateSectionKeys.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Review-summary section keys must be unique",
        path: ["reviewSections"],
      });
    }

    const families = result.reviewSections.map((section) => section.family);
    const missingFamilies = CLOSE_CONTROL_REVIEW_SECTION_FAMILIES.filter(
      (family) => !families.includes(family),
    );
    const duplicateFamilies = families.filter(
      (family, index) => families.indexOf(family) !== index,
    );

    if (missingFamilies.length > 0 || duplicateFamilies.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Review-summary results must include each section family exactly once",
        path: ["reviewSections"],
      });
    }
  });

export function deriveCloseControlReviewAggregateStatus(
  sections: Array<Pick<CloseControlReviewSection, "status">>,
): CloseControlReviewStatus {
  if (sections.some((section) => section.status === "blocked_by_evidence")) {
    return "blocked_by_evidence";
  }

  if (sections.some((section) => section.status === "needs_human_review")) {
    return "needs_human_review";
  }

  return "ready_for_review_summary";
}

export type CloseControlReviewSectionFamily = z.infer<
  typeof CloseControlReviewSectionFamilySchema
>;
export type CloseControlReviewStatus = z.infer<
  typeof CloseControlReviewStatusSchema
>;
export type CloseControlReviewEvidenceRefKind = z.infer<
  typeof CloseControlReviewEvidenceRefKindSchema
>;
export type CloseControlReviewEvidenceRef = z.infer<
  typeof CloseControlReviewEvidenceRefSchema
>;
export type CloseControlReviewEvidenceBasis = z.infer<
  typeof CloseControlReviewEvidenceBasisSchema
>;
export type CloseControlReviewSourcePostureState = z.infer<
  typeof CloseControlReviewSourcePostureStateSchema
>;
export type CloseControlReviewSourcePosture = z.infer<
  typeof CloseControlReviewSourcePostureSchema
>;
export type CloseControlReviewRuntimeActionAbsenceBoundary = z.infer<
  typeof CloseControlReviewRuntimeActionAbsenceBoundarySchema
>;
export type CloseControlReviewSection = z.infer<
  typeof CloseControlReviewSectionSchema
>;
export type CloseControlReviewSummaryResult = z.infer<
  typeof CloseControlReviewSummaryResultSchema
>;
