import type {
  CloseControlChecklistItemFamily,
  CloseControlReviewEvidenceRef,
  DeliveryReadinessEvidenceRef,
  ExternalProviderBoundaryEvidenceRef,
  ExternalProviderBoundaryEvidenceRefKind,
} from "@pocket-cto/domain";

export function buildProviderBoundaryEvidenceRef(input: {
  kind: ExternalProviderBoundaryEvidenceRefKind;
  evidencePath: string;
  summary: string;
  deliveryReadinessTargetKey?: string | null;
  proofRef?: string | null;
  relatedSourceRole?: string | null;
  reviewSummarySectionKey?: string | null;
}): ExternalProviderBoundaryEvidenceRef {
  return {
    kind: input.kind,
    evidencePath: input.evidencePath,
    summary: input.summary,
    sourceId: null,
    sourceSnapshotId: null,
    sourceFileId: null,
    syncRunId: null,
    pageKey: null,
    monitorKind: null,
    monitorResultId: null,
    checklistItemFamily: null,
    deliveryReadinessTargetKey: input.deliveryReadinessTargetKey ?? null,
    reviewSummarySectionKey: input.reviewSummarySectionKey ?? null,
    proofRef: input.proofRef ?? null,
    relatedSourceRole: input.relatedSourceRole ?? null,
  };
}

export function mapDeliveryEvidenceRef(
  ref: DeliveryReadinessEvidenceRef,
  input: { deliveryReadinessTargetKey?: string | null },
): ExternalProviderBoundaryEvidenceRef {
  return {
    kind: inferDeliveryEvidenceKind(ref.kind),
    evidencePath: ref.evidencePath,
    summary: ref.summary,
    sourceId: ref.sourceId,
    sourceSnapshotId: ref.sourceSnapshotId,
    sourceFileId: ref.sourceFileId,
    syncRunId: ref.syncRunId,
    pageKey: ref.pageKey,
    monitorKind: ref.monitorKind,
    monitorResultId: ref.monitorResultId,
    checklistItemFamily: ref.checklistItemFamily,
    deliveryReadinessTargetKey: input.deliveryReadinessTargetKey ?? null,
    reviewSummarySectionKey: null,
    proofRef: ref.proofRef,
    relatedSourceRole: inferSourceRole(ref.checklistItemFamily),
  };
}

export function mapReviewEvidenceRef(
  ref: CloseControlReviewEvidenceRef,
  input: { reviewSummarySectionKey?: string | null },
): ExternalProviderBoundaryEvidenceRef {
  return {
    kind: inferReviewEvidenceKind(ref.kind),
    evidencePath: ref.evidencePath,
    summary: ref.summary,
    sourceId: ref.sourceId,
    sourceSnapshotId: ref.sourceSnapshotId,
    sourceFileId: ref.sourceFileId,
    syncRunId: ref.syncRunId,
    pageKey: ref.pageKey,
    monitorKind: ref.monitorKind,
    monitorResultId: ref.monitorResultId,
    checklistItemFamily: ref.checklistItemFamily,
    deliveryReadinessTargetKey: ref.deliveryReadinessTargetKey,
    reviewSummarySectionKey: input.reviewSummarySectionKey ?? null,
    proofRef: ref.proofRef,
    relatedSourceRole: inferSourceRole(ref.checklistItemFamily),
  };
}

export function inferSourceRole(
  family: CloseControlChecklistItemFamily | null | undefined,
) {
  switch (family) {
    case "cash_source_freshness_review":
      return "bank_account_summary";
    case "receivables_aging_source_freshness_review":
      return "receivables_aging";
    case "payables_aging_source_freshness_review":
      return "payables_aging";
    case "policy_source_freshness_review":
      return "policy_document";
    case "source_coverage_review":
      return "source_registry";
    case "monitor_replay_readiness":
      return "monitor_result_context";
    case null:
    case undefined:
      return null;
  }
}

function inferDeliveryEvidenceKind(
  kind: DeliveryReadinessEvidenceRef["kind"],
): ExternalProviderBoundaryEvidenceRefKind {
  switch (kind) {
    case "operator_readiness_result":
    case "acknowledgement_readiness_result":
    case "close_control_checklist":
    case "proof_posture":
      return "proof_posture";
    case "operator_readiness_item":
    case "acknowledgement_readiness_target":
    case "close_control_checklist_item":
    case "monitor_result":
    case "monitor_alert_card":
      return "delivery_readiness_target";
    case "source_lineage":
      return "source_lineage";
  }
}

function inferReviewEvidenceKind(
  kind: CloseControlReviewEvidenceRef["kind"],
): ExternalProviderBoundaryEvidenceRefKind {
  switch (kind) {
    case "delivery_readiness_result":
    case "delivery_readiness_target":
      return "delivery_readiness_target";
    case "close_control_checklist":
    case "close_control_checklist_item":
    case "operator_readiness_result":
    case "operator_readiness_item":
    case "acknowledgement_readiness_result":
    case "acknowledgement_readiness_target":
    case "monitor_context":
      return "review_summary_section";
    case "source_lineage":
      return "source_lineage";
    case "proof_posture":
      return "proof_posture";
  }
}
