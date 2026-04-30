import type {
  CloseControlCertificationBoundaryEvidenceRef,
  CloseControlChecklistItemFamily,
  CloseControlReviewEvidenceRef,
  DeliveryReadinessEvidenceRef,
  ExternalDeliveryHumanConfirmationEvidenceRef,
  ExternalDeliveryHumanConfirmationEvidenceRefKind,
  ExternalProviderBoundaryEvidenceRef,
} from "@pocket-cto/domain";

export function buildHumanConfirmationEvidenceRef(input: {
  certificationBoundaryTargetKey?: string | null;
  deliveryReadinessTargetKey?: string | null;
  evidencePath: string;
  kind: ExternalDeliveryHumanConfirmationEvidenceRefKind;
  proofRef?: string | null;
  providerBoundaryTargetKey?: string | null;
  relatedSourceRole?: string | null;
  reviewSummarySectionKey?: string | null;
  summary: string;
}): ExternalDeliveryHumanConfirmationEvidenceRef {
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
    providerBoundaryTargetKey: input.providerBoundaryTargetKey ?? null,
    certificationBoundaryTargetKey:
      input.certificationBoundaryTargetKey ?? null,
    reviewSummarySectionKey: input.reviewSummarySectionKey ?? null,
    proofRef: input.proofRef ?? null,
    relatedSourceRole: input.relatedSourceRole ?? null,
  };
}

export function mapDeliveryEvidenceRef(
  ref: DeliveryReadinessEvidenceRef,
  input: { deliveryReadinessTargetKey?: string | null },
): ExternalDeliveryHumanConfirmationEvidenceRef {
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
    providerBoundaryTargetKey: null,
    certificationBoundaryTargetKey: null,
    reviewSummarySectionKey: null,
    proofRef: ref.proofRef,
    relatedSourceRole: inferSourceRole(ref.checklistItemFamily),
  };
}

export function mapProviderEvidenceRef(
  ref: ExternalProviderBoundaryEvidenceRef,
  input: { providerBoundaryTargetKey?: string | null },
): ExternalDeliveryHumanConfirmationEvidenceRef {
  return {
    kind: inferProviderEvidenceKind(ref.kind),
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
    providerBoundaryTargetKey: input.providerBoundaryTargetKey ?? null,
    certificationBoundaryTargetKey: null,
    reviewSummarySectionKey: ref.reviewSummarySectionKey,
    proofRef: ref.proofRef,
    relatedSourceRole:
      ref.relatedSourceRole ?? inferSourceRole(ref.checklistItemFamily),
  };
}

export function mapCertificationEvidenceRef(
  ref: CloseControlCertificationBoundaryEvidenceRef,
  input: { certificationBoundaryTargetKey?: string | null },
): ExternalDeliveryHumanConfirmationEvidenceRef {
  return {
    kind: inferCertificationEvidenceKind(ref.kind),
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
    deliveryReadinessTargetKey: null,
    providerBoundaryTargetKey: ref.providerBoundaryTargetKey,
    certificationBoundaryTargetKey:
      input.certificationBoundaryTargetKey ?? null,
    reviewSummarySectionKey: ref.reviewSummarySectionKey,
    proofRef: ref.proofRef,
    relatedSourceRole:
      ref.relatedSourceRole ?? inferSourceRole(ref.checklistItemFamily),
  };
}

export function mapReviewEvidenceRef(
  ref: CloseControlReviewEvidenceRef,
  input: { reviewSummarySectionKey?: string | null },
): ExternalDeliveryHumanConfirmationEvidenceRef {
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
    providerBoundaryTargetKey: null,
    certificationBoundaryTargetKey: null,
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
): ExternalDeliveryHumanConfirmationEvidenceRefKind {
  switch (kind) {
    case "source_lineage":
      return "source_lineage";
    case "proof_posture":
      return "proof_posture";
    case "operator_readiness_result":
    case "operator_readiness_item":
    case "acknowledgement_readiness_result":
    case "acknowledgement_readiness_target":
    case "close_control_checklist":
    case "close_control_checklist_item":
    case "monitor_result":
    case "monitor_alert_card":
      return "delivery_readiness_target";
  }
}

function inferProviderEvidenceKind(
  kind: ExternalProviderBoundaryEvidenceRef["kind"],
): ExternalDeliveryHumanConfirmationEvidenceRefKind {
  switch (kind) {
    case "source_lineage":
      return "source_lineage";
    case "proof_posture":
      return "proof_posture";
    case "absence_boundary":
      return "absence_boundary";
    case "delivery_readiness_result":
    case "delivery_readiness_target":
    case "review_summary_result":
    case "review_summary_section":
      return "provider_boundary_target";
  }
}

function inferCertificationEvidenceKind(
  kind: CloseControlCertificationBoundaryEvidenceRef["kind"],
): ExternalDeliveryHumanConfirmationEvidenceRefKind {
  switch (kind) {
    case "source_lineage":
      return "source_lineage";
    case "proof_posture":
      return "proof_posture";
    case "absence_boundary":
      return "absence_boundary";
    case "review_summary_result":
    case "review_summary_section":
    case "provider_boundary_result":
    case "provider_boundary_target":
      return "certification_boundary_target";
  }
}

function inferReviewEvidenceKind(
  kind: CloseControlReviewEvidenceRef["kind"],
): ExternalDeliveryHumanConfirmationEvidenceRefKind {
  switch (kind) {
    case "source_lineage":
      return "source_lineage";
    case "proof_posture":
      return "proof_posture";
    case "close_control_checklist":
    case "close_control_checklist_item":
    case "operator_readiness_result":
    case "operator_readiness_item":
    case "acknowledgement_readiness_result":
    case "acknowledgement_readiness_target":
    case "delivery_readiness_result":
    case "delivery_readiness_target":
    case "monitor_context":
      return "review_summary_section";
  }
}
