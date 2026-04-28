import {
  OperatorReadinessEvidenceRefSchema,
  type CloseControlEvidenceRef,
  type OperatorReadinessEvidenceRef,
} from "@pocket-cto/domain";

export function buildEvidenceRef(input: unknown): OperatorReadinessEvidenceRef {
  return OperatorReadinessEvidenceRefSchema.parse(input);
}

export function mapCloseControlEvidenceRef(
  ref: CloseControlEvidenceRef,
): OperatorReadinessEvidenceRef {
  return buildEvidenceRef({
    kind:
      ref.kind === "monitor_result"
        ? "monitor_result"
        : ref.kind === "derived_checklist_read"
          ? "close_control_checklist_item"
          : "source_lineage",
    evidencePath: ref.evidencePath,
    summary: ref.summary,
    sourceId: ref.sourceId,
    sourceSnapshotId: ref.sourceSnapshotId,
    sourceFileId: ref.sourceFileId,
    syncRunId: ref.syncRunId,
    pageKey: ref.pageKey,
    monitorKind: ref.monitorKind,
    monitorResultId: ref.monitorResultId,
    checklistItemFamily: null,
    proofRef: null,
  });
}

export function buildRuntimeActionBoundary() {
  return {
    runtimeCodexUsed: false,
    deliveryCreated: false,
    outboxSendCreated: false,
    reportCreated: false,
    approvalCreated: false,
    missionCreated: false,
    monitorRunTriggered: false,
    monitorResultCreated: false,
    accountingWriteCreated: false,
    bankWriteCreated: false,
    taxFilingCreated: false,
    legalAdviceGenerated: false,
    policyAdviceGenerated: false,
    paymentInstructionCreated: false,
    collectionInstructionCreated: false,
    customerContactInstructionCreated: false,
    autonomousActionCreated: false,
    summary:
      "F6J operator readiness generation is deterministic, read-only, runtime-free, delivery-free, report-free, approval-free, mission-free, monitor-run-free, monitor-result-free, and action-free.",
    replayImplication:
      "The first F6J readiness result is generated from current stored posture and is not persisted as a mission replay event.",
  };
}

export function dedupe(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}
