import { z } from "zod";
import {
  CloseControlChecklistItemFamilySchema,
  CloseControlFreshnessSummarySchema,
  CloseControlProofPostureSchema,
} from "./close-control";
import { FinanceCompanyKeySchema } from "./finance-twin";
import {
  MonitorKindSchema,
  MonitorSourceLineageRefSchema,
} from "./monitoring";

export const DeliveryReadinessTargetKindSchema = z.enum([
  "operator_readiness_target",
  "acknowledgement_readiness_target",
  "source_posture_target",
  "monitor_posture_target",
]);

export const DELIVERY_READINESS_TARGET_KINDS =
  DeliveryReadinessTargetKindSchema.options;

export const DeliveryReadinessStatusSchema = z.enum([
  "ready_for_delivery_review",
  "needs_review_before_delivery",
  "blocked_by_evidence",
]);

export const DELIVERY_READINESS_STATUSES =
  DeliveryReadinessStatusSchema.options;

export const DeliveryReadinessEvidenceRefKindSchema = z.enum([
  "operator_readiness_result",
  "operator_readiness_item",
  "acknowledgement_readiness_result",
  "acknowledgement_readiness_target",
  "close_control_checklist",
  "close_control_checklist_item",
  "monitor_result",
  "monitor_alert_card",
  "source_lineage",
  "proof_posture",
]);

export const DeliveryReadinessEvidenceRefSchema = z
  .object({
    kind: DeliveryReadinessEvidenceRefKindSchema,
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
    proofRef: z.string().min(1).nullable().default(null),
  })
  .strict();

export const DeliveryReadinessEvidenceBasisKindSchema = z.enum([
  "operator_readiness_posture",
  "acknowledgement_readiness_posture",
  "source_posture",
  "monitor_posture",
]);

export const DeliveryReadinessEvidenceBasisSchema = z
  .object({
    basisKind: DeliveryReadinessEvidenceBasisKindSchema,
    summary: z.string().min(1),
    refs: z.array(DeliveryReadinessEvidenceRefSchema).default([]),
  })
  .strict();

export const DeliveryReadinessSourcePostureStateSchema = z.enum([
  "source_backed",
  "missing_source",
  "failed_source",
  "stale_source",
  "limited_source",
  "monitor_context_present",
  "monitor_context_missing",
  "not_applicable",
]);

export const DeliveryReadinessSourcePostureSchema = z
  .object({
    state: DeliveryReadinessSourcePostureStateSchema,
    summary: z.string().min(1),
    missingSource: z.boolean().default(false),
    refs: z.array(DeliveryReadinessEvidenceRefSchema).default([]),
  })
  .strict();

export const DeliveryReadinessRuntimeActionAbsenceBoundarySchema = z
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
    approvalCreated: z.literal(false),
    missionCreated: z.literal(false),
    monitorRunTriggered: z.literal(false),
    monitorResultCreated: z.literal(false),
    sourceMutationCreated: z.literal(false),
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

export const DeliveryReadinessTargetSchema = z
  .object({
    targetKey: z.string().min(1),
    targetKind: DeliveryReadinessTargetKindSchema,
    status: DeliveryReadinessStatusSchema,
    evidenceBasis: DeliveryReadinessEvidenceBasisSchema,
    sourceLineageRefs: z.array(MonitorSourceLineageRefSchema).default([]),
    sourcePosture: DeliveryReadinessSourcePostureSchema,
    freshnessSummary: CloseControlFreshnessSummarySchema,
    limitations: z.array(z.string().min(1)).min(1),
    proofPosture: CloseControlProofPostureSchema,
    humanReviewNextStep: z.string().min(1),
    relatedOperatorReadinessItemKey:
      z.string().min(1).nullable().default(null),
    relatedAcknowledgementTargetKey:
      z.string().min(1).nullable().default(null),
    relatedMonitorKind: MonitorKindSchema.nullable().default(null),
    relatedChecklistItemFamily:
      CloseControlChecklistItemFamilySchema.nullable().default(null),
  })
  .strict();

export const DeliveryReadinessResultSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    generatedAt: z.string().datetime({ offset: true }),
    aggregateStatus: DeliveryReadinessStatusSchema,
    deliveryReadinessTargets: z.array(DeliveryReadinessTargetSchema).min(1),
    evidenceSummary: z.string().min(1),
    limitations: z.array(z.string().min(1)).min(1),
    runtimeActionBoundary: DeliveryReadinessRuntimeActionAbsenceBoundarySchema,
  })
  .strict()
  .superRefine((result, context) => {
    const expectedStatus = deriveDeliveryReadinessAggregateStatus(
      result.deliveryReadinessTargets,
    );

    if (result.aggregateStatus !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Aggregate delivery readiness must be ${expectedStatus} for the supplied targets`,
        path: ["aggregateStatus"],
      });
    }

    const targetKeys = result.deliveryReadinessTargets.map(
      (target) => target.targetKey,
    );
    const duplicateTargetKeys = targetKeys.filter(
      (targetKey, index) => targetKeys.indexOf(targetKey) !== index,
    );

    if (duplicateTargetKeys.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Delivery-readiness target keys must be unique",
        path: ["deliveryReadinessTargets"],
      });
    }
  });

export function deriveDeliveryReadinessAggregateStatus(
  targets: Array<Pick<DeliveryReadinessTarget, "status">>,
): DeliveryReadinessStatus {
  if (targets.some((target) => target.status === "blocked_by_evidence")) {
    return "blocked_by_evidence";
  }

  if (
    targets.some(
      (target) => target.status === "needs_review_before_delivery",
    )
  ) {
    return "needs_review_before_delivery";
  }

  return "ready_for_delivery_review";
}

export type DeliveryReadinessTargetKind = z.infer<
  typeof DeliveryReadinessTargetKindSchema
>;
export type DeliveryReadinessStatus = z.infer<
  typeof DeliveryReadinessStatusSchema
>;
export type DeliveryReadinessEvidenceRefKind = z.infer<
  typeof DeliveryReadinessEvidenceRefKindSchema
>;
export type DeliveryReadinessEvidenceRef = z.infer<
  typeof DeliveryReadinessEvidenceRefSchema
>;
export type DeliveryReadinessEvidenceBasisKind = z.infer<
  typeof DeliveryReadinessEvidenceBasisKindSchema
>;
export type DeliveryReadinessEvidenceBasis = z.infer<
  typeof DeliveryReadinessEvidenceBasisSchema
>;
export type DeliveryReadinessSourcePostureState = z.infer<
  typeof DeliveryReadinessSourcePostureStateSchema
>;
export type DeliveryReadinessSourcePosture = z.infer<
  typeof DeliveryReadinessSourcePostureSchema
>;
export type DeliveryReadinessRuntimeActionAbsenceBoundary = z.infer<
  typeof DeliveryReadinessRuntimeActionAbsenceBoundarySchema
>;
export type DeliveryReadinessTarget = z.infer<
  typeof DeliveryReadinessTargetSchema
>;
export type DeliveryReadinessResult = z.infer<
  typeof DeliveryReadinessResultSchema
>;
