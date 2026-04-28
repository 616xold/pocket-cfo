import type {
  CfoWikiBoundSourceSummary,
  CloseControlEvidenceRef,
  CloseControlProofPostureState,
  FinanceTwinSourceRef,
} from "@pocket-cto/domain";

export function buildFinanceTwinRefs(
  latestSource: FinanceTwinSourceRef | null,
  sourceLabel: string,
): CloseControlEvidenceRef[] {
  if (!latestSource) {
    return [];
  }

  return [
    {
      kind: "finance_twin_source",
      evidencePath: `${sourceLabel}.latestSuccessfulSource`,
      sourceId: latestSource.sourceId,
      sourceSnapshotId: latestSource.sourceSnapshotId,
      sourceFileId: latestSource.sourceFileId,
      syncRunId: latestSource.syncRunId,
      pageKey: null,
      monitorKind: null,
      monitorResultId: null,
      summary: `Latest successful ${sourceLabel} source backing stored Finance Twin posture.`,
    },
  ];
}

export function buildPolicyRefs(input: {
  page: unknown | null;
  pageKey: string;
  source: CfoWikiBoundSourceSummary;
}): CloseControlEvidenceRef[] {
  return [
    {
      kind: "cfo_wiki_source",
      evidencePath: `policySources.${input.source.source.id}`,
      sourceId: input.source.source.id,
      sourceSnapshotId: input.source.latestSnapshot?.id ?? null,
      sourceFileId: input.source.latestSourceFile?.id ?? null,
      syncRunId: null,
      pageKey: null,
      monitorKind: null,
      monitorResultId: null,
      summary:
        "Stored CFO Wiki policy_document binding and latest extract posture.",
    },
    {
      kind: "cfo_wiki_page",
      evidencePath: `policyPages.${input.pageKey}`,
      sourceId: input.source.source.id,
      sourceSnapshotId: null,
      sourceFileId: null,
      syncRunId: null,
      pageKey: input.pageKey,
      monitorKind: null,
      monitorResultId: null,
      summary: input.page
        ? "Stored compiler-owned CFO Wiki policy page."
        : "Expected CFO Wiki policy page is not stored.",
    },
  ];
}

export function buildProofSummary(
  state: CloseControlProofPostureState,
  sourceLabel: string,
) {
  switch (state) {
    case "source_backed":
      return `The checklist item is backed by stored ${sourceLabel} evidence.`;
    case "review_only_context":
      return `The checklist item uses stored ${sourceLabel} as review-only context.`;
    case "limited_by_missing_source":
      return `The checklist item is limited because required ${sourceLabel} evidence is missing.`;
    case "limited_by_failed_source":
      return `The checklist item is limited because required ${sourceLabel} evidence failed.`;
    case "limited_by_stale_source":
      return `The checklist item is limited because required ${sourceLabel} evidence is stale.`;
    case "limited_by_coverage_gap":
      return `The checklist item is limited by ${sourceLabel} coverage gaps.`;
    case "limited_by_data_quality_gap":
      return `The checklist item is limited by ${sourceLabel} data-quality gaps.`;
    case "limited_by_missing_monitor_context":
      return "The checklist item is limited because latest persisted monitor-result context is missing.";
    case "limited_by_alerting_monitor":
      return "The checklist item is limited because latest persisted monitor context is alerting.";
  }
}

export function buildRuntimeBoundary() {
  return {
    runtimeCodexUsed: false,
    deliveryCreated: false,
    reportCreated: false,
    approvalCreated: false,
    accountingWriteCreated: false,
    bankWriteCreated: false,
    taxFilingCreated: false,
    legalAdviceGenerated: false,
    policyAdviceGenerated: false,
    paymentInstructionCreated: false,
    collectionInstructionCreated: false,
    customerContactInstructionCreated: false,
    autonomousActionCreated: false,
    monitorRunTriggered: false,
    missionCreated: false,
    summary:
      "F6H checklist generation is deterministic, read-only, runtime-free, delivery-free, report-free, approval-free, and action-free.",
    replayImplication:
      "The first F6H checklist is derived from current stored posture and is not persisted as a separate checklist table, so no mission replay event is appended.",
  };
}

export function dedupe(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}
