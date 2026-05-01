import type {
  CloseControlCertificationBoundaryEvidenceRef,
  CloseControlCertificationSafetyEvidenceRef,
  CloseControlCertificationSafetyEvidenceRefKind,
  CloseControlChecklistItemFamily,
  CloseControlReviewEvidenceRef,
  ExternalDeliveryHumanConfirmationEvidenceRef,
} from "@pocket-cto/domain";

export function buildCertificationSafetyEvidenceRef(input: {
  certificationBoundaryTargetKey?: string | null;
  evidencePath: string;
  humanConfirmationTargetKey?: string | null;
  kind: CloseControlCertificationSafetyEvidenceRefKind;
  proofRef?: string | null;
  relatedSourceRole?: string | null;
  reviewSummarySectionKey?: string | null;
  summary: string;
}): CloseControlCertificationSafetyEvidenceRef {
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
    certificationBoundaryTargetKey:
      input.certificationBoundaryTargetKey ?? null,
    humanConfirmationTargetKey: input.humanConfirmationTargetKey ?? null,
    reviewSummarySectionKey: input.reviewSummarySectionKey ?? null,
    proofRef: input.proofRef ?? null,
    relatedSourceRole: input.relatedSourceRole ?? null,
  };
}

export function mapCertificationEvidenceRef(
  ref: CloseControlCertificationBoundaryEvidenceRef,
  input: { certificationBoundaryTargetKey?: string | null },
): CloseControlCertificationSafetyEvidenceRef {
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
    certificationBoundaryTargetKey:
      input.certificationBoundaryTargetKey ?? null,
    humanConfirmationTargetKey: null,
    reviewSummarySectionKey: ref.reviewSummarySectionKey,
    proofRef: ref.proofRef,
    relatedSourceRole:
      ref.relatedSourceRole ?? inferSourceRole(ref.checklistItemFamily),
  };
}

export function mapHumanConfirmationEvidenceRef(
  ref: ExternalDeliveryHumanConfirmationEvidenceRef,
  input: { humanConfirmationTargetKey?: string | null },
): CloseControlCertificationSafetyEvidenceRef {
  return {
    kind: inferHumanConfirmationEvidenceKind(ref.kind),
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
    certificationBoundaryTargetKey: ref.certificationBoundaryTargetKey,
    humanConfirmationTargetKey: input.humanConfirmationTargetKey ?? null,
    reviewSummarySectionKey: ref.reviewSummarySectionKey,
    proofRef: ref.proofRef,
    relatedSourceRole:
      ref.relatedSourceRole ?? inferSourceRole(ref.checklistItemFamily),
  };
}

export function mapReviewEvidenceRef(
  ref: CloseControlReviewEvidenceRef,
  input: { reviewSummarySectionKey?: string | null },
): CloseControlCertificationSafetyEvidenceRef {
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
    certificationBoundaryTargetKey: null,
    humanConfirmationTargetKey: null,
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

function inferCertificationEvidenceKind(
  kind: CloseControlCertificationBoundaryEvidenceRef["kind"],
): CloseControlCertificationSafetyEvidenceRefKind {
  switch (kind) {
    case "review_summary_result":
    case "review_summary_section":
    case "provider_boundary_result":
    case "provider_boundary_target":
      return "certification_boundary_target";
    case "source_lineage":
      return "source_lineage";
    case "proof_posture":
      return "proof_posture";
    case "absence_boundary":
      return "absence_boundary";
  }
}

function inferHumanConfirmationEvidenceKind(
  kind: ExternalDeliveryHumanConfirmationEvidenceRef["kind"],
): CloseControlCertificationSafetyEvidenceRefKind {
  switch (kind) {
    case "delivery_readiness_result":
    case "delivery_readiness_target":
    case "provider_boundary_result":
    case "provider_boundary_target":
    case "certification_boundary_result":
    case "certification_boundary_target":
    case "review_summary_result":
    case "review_summary_section":
      return "human_confirmation_target";
    case "source_lineage":
      return "source_lineage";
    case "proof_posture":
      return "proof_posture";
    case "absence_boundary":
      return "absence_boundary";
  }
}

function inferReviewEvidenceKind(
  kind: CloseControlReviewEvidenceRef["kind"],
): CloseControlCertificationSafetyEvidenceRefKind {
  switch (kind) {
    case "delivery_readiness_result":
    case "delivery_readiness_target":
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
