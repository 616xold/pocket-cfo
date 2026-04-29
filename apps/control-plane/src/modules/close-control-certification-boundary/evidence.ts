import type {
  CloseControlCertificationBoundaryEvidenceRef,
  CloseControlCertificationBoundaryEvidenceRefKind,
  CloseControlChecklistItemFamily,
  CloseControlReviewEvidenceRef,
  ExternalProviderBoundaryEvidenceRef,
} from "@pocket-cto/domain";

export function buildCertificationBoundaryEvidenceRef(input: {
  kind: CloseControlCertificationBoundaryEvidenceRefKind;
  evidencePath: string;
  providerBoundaryTargetKey?: string | null;
  proofRef?: string | null;
  relatedSourceRole?: string | null;
  reviewSummarySectionKey?: string | null;
  summary: string;
}): CloseControlCertificationBoundaryEvidenceRef {
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
    reviewSummarySectionKey: input.reviewSummarySectionKey ?? null,
    providerBoundaryTargetKey: input.providerBoundaryTargetKey ?? null,
    proofRef: input.proofRef ?? null,
    relatedSourceRole: input.relatedSourceRole ?? null,
  };
}

export function mapReviewEvidenceRef(
  ref: CloseControlReviewEvidenceRef,
  input: { reviewSummarySectionKey?: string | null },
): CloseControlCertificationBoundaryEvidenceRef {
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
    reviewSummarySectionKey: input.reviewSummarySectionKey ?? null,
    providerBoundaryTargetKey: null,
    proofRef: ref.proofRef,
    relatedSourceRole: inferSourceRole(ref.checklistItemFamily),
  };
}

export function mapProviderEvidenceRef(
  ref: ExternalProviderBoundaryEvidenceRef,
  input: { providerBoundaryTargetKey?: string | null },
): CloseControlCertificationBoundaryEvidenceRef {
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
    reviewSummarySectionKey: ref.reviewSummarySectionKey,
    providerBoundaryTargetKey: input.providerBoundaryTargetKey ?? null,
    proofRef: ref.proofRef,
    relatedSourceRole:
      ref.relatedSourceRole ?? inferSourceRole(ref.checklistItemFamily),
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

function inferReviewEvidenceKind(
  kind: CloseControlReviewEvidenceRef["kind"],
): CloseControlCertificationBoundaryEvidenceRefKind {
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

function inferProviderEvidenceKind(
  kind: ExternalProviderBoundaryEvidenceRef["kind"],
): CloseControlCertificationBoundaryEvidenceRefKind {
  switch (kind) {
    case "delivery_readiness_result":
    case "delivery_readiness_target":
    case "review_summary_result":
    case "review_summary_section":
      return "provider_boundary_target";
    case "source_lineage":
      return "source_lineage";
    case "proof_posture":
      return "proof_posture";
    case "absence_boundary":
      return "absence_boundary";
  }
}
