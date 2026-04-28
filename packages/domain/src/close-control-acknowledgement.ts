import { z } from "zod";
import {
  CloseControlChecklistItemFamilySchema,
  CloseControlEvidenceRefSchema,
  CloseControlFreshnessSummarySchema,
  CloseControlProofPostureSchema,
} from "./close-control";
import { FinanceCompanyKeySchema } from "./finance-twin";
import {
  OperatorReadinessEvidenceRefSchema,
  OperatorReadinessStatusSchema,
} from "./operator-readiness";

export const CloseControlAcknowledgementTargetKindSchema = z.enum([
  "checklist_aggregate",
  "checklist_item_family",
]);

export const CloseControlAcknowledgementStatusSchema = z.enum([
  "ready_for_acknowledgement",
  "needs_review_before_acknowledgement",
  "blocked_by_evidence",
]);

export const CloseControlAcknowledgementSourcePostureStateSchema = z.enum([
  "source_backed",
  "missing_source",
  "failed_source",
  "stale_source",
  "limited_source",
  "monitor_context_present",
  "monitor_context_missing",
  "not_applicable",
]);

export const CloseControlAcknowledgementEvidenceBasisSchema = z
  .object({
    summary: z.string().min(1),
    checklistEvidenceRefs: z.array(CloseControlEvidenceRefSchema).default([]),
    readinessEvidenceRefs: z
      .array(OperatorReadinessEvidenceRefSchema)
      .default([]),
  })
  .strict();

export const CloseControlAcknowledgementSourcePostureSchema = z
  .object({
    state: CloseControlAcknowledgementSourcePostureStateSchema,
    summary: z.string().min(1),
    missingSource: z.boolean().default(false),
  })
  .strict();

export const CloseControlAcknowledgementTargetSchema = z
  .object({
    targetKey: z.string().min(1),
    targetKind: CloseControlAcknowledgementTargetKindSchema,
    status: CloseControlAcknowledgementStatusSchema,
    evidenceBasis: CloseControlAcknowledgementEvidenceBasisSchema,
    sourcePosture: CloseControlAcknowledgementSourcePostureSchema,
    freshnessSummary: CloseControlFreshnessSummarySchema,
    limitations: z.array(z.string().min(1)).min(1),
    proofPosture: CloseControlProofPostureSchema,
    humanReviewNextStep: z.string().min(1),
    relatedChecklistItemFamily:
      CloseControlChecklistItemFamilySchema.nullable().default(null),
    relatedReadinessItemKey: z.string().min(1).nullable().default(null),
  })
  .strict();

export const CloseControlAcknowledgementReadinessContextSchema = z
  .object({
    operatorReadinessAggregateStatus: OperatorReadinessStatusSchema,
    nonReadyReadinessItemKeys: z.array(z.string().min(1)).default([]),
    summary: z.string().min(1),
    limitations: z.array(z.string().min(1)).default([]),
  })
  .strict();

export const CloseControlAcknowledgementRuntimeActionAbsenceBoundarySchema = z
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

export const CloseControlAcknowledgementReadinessResultSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    generatedAt: z.string().datetime({ offset: true }),
    aggregateStatus: CloseControlAcknowledgementStatusSchema,
    acknowledgementTargets: z
      .array(CloseControlAcknowledgementTargetSchema)
      .min(1),
    evidenceSummary: z.string().min(1),
    limitations: z.array(z.string().min(1)).min(1),
    operatorReadinessContext:
      CloseControlAcknowledgementReadinessContextSchema,
    runtimeActionBoundary:
      CloseControlAcknowledgementRuntimeActionAbsenceBoundarySchema,
  })
  .strict()
  .superRefine((result, context) => {
    const expectedStatus = deriveCloseControlAcknowledgementAggregateStatus(
      result.acknowledgementTargets,
    );

    if (result.aggregateStatus !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Aggregate acknowledgement readiness must be ${expectedStatus} for the supplied targets`,
        path: ["aggregateStatus"],
      });
    }

    const targetKeys = result.acknowledgementTargets.map(
      (target) => target.targetKey,
    );
    const duplicateTargetKeys = targetKeys.filter(
      (targetKey, index) => targetKeys.indexOf(targetKey) !== index,
    );

    if (duplicateTargetKeys.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Acknowledgement target keys must be unique",
        path: ["acknowledgementTargets"],
      });
    }
  });

export function deriveCloseControlAcknowledgementAggregateStatus(
  targets: Array<Pick<CloseControlAcknowledgementTarget, "status">>,
): CloseControlAcknowledgementStatus {
  if (targets.some((target) => target.status === "blocked_by_evidence")) {
    return "blocked_by_evidence";
  }

  if (
    targets.some(
      (target) => target.status === "needs_review_before_acknowledgement",
    )
  ) {
    return "needs_review_before_acknowledgement";
  }

  return "ready_for_acknowledgement";
}

export type CloseControlAcknowledgementTargetKind = z.infer<
  typeof CloseControlAcknowledgementTargetKindSchema
>;
export type CloseControlAcknowledgementStatus = z.infer<
  typeof CloseControlAcknowledgementStatusSchema
>;
export type CloseControlAcknowledgementSourcePostureState = z.infer<
  typeof CloseControlAcknowledgementSourcePostureStateSchema
>;
export type CloseControlAcknowledgementEvidenceBasis = z.infer<
  typeof CloseControlAcknowledgementEvidenceBasisSchema
>;
export type CloseControlAcknowledgementSourcePosture = z.infer<
  typeof CloseControlAcknowledgementSourcePostureSchema
>;
export type CloseControlAcknowledgementTarget = z.infer<
  typeof CloseControlAcknowledgementTargetSchema
>;
export type CloseControlAcknowledgementReadinessContext = z.infer<
  typeof CloseControlAcknowledgementReadinessContextSchema
>;
export type CloseControlAcknowledgementRuntimeActionAbsenceBoundary = z.infer<
  typeof CloseControlAcknowledgementRuntimeActionAbsenceBoundarySchema
>;
export type CloseControlAcknowledgementReadinessResult = z.infer<
  typeof CloseControlAcknowledgementReadinessResultSchema
>;
