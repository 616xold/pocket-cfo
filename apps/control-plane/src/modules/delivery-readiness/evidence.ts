import {
  type CloseControlAcknowledgementTarget,
  type DeliveryReadinessEvidenceRef,
  type DeliveryReadinessEvidenceRefKind,
  type MonitorKind,
  type MonitorSourceLineageRef,
  type OperatorAttentionItem,
  type OperatorReadinessEvidenceRef,
} from "@pocket-cto/domain";

export function mapOperatorEvidenceRefs(
  item: OperatorAttentionItem,
): DeliveryReadinessEvidenceRef[] {
  return item.evidenceBasis.refs.map((ref) =>
    mapOperatorReadinessEvidenceRef(ref, {
      fallbackKind: inferOperatorEvidenceKind(ref.kind),
      operatorReadinessItemKey: item.itemKey,
    }),
  );
}

export function mapOperatorReadinessEvidenceRef(
  ref: OperatorReadinessEvidenceRef,
  input: {
    fallbackKind: DeliveryReadinessEvidenceRefKind;
    operatorReadinessItemKey: string | null;
  },
): DeliveryReadinessEvidenceRef {
  return {
    kind: input.fallbackKind,
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
    operatorReadinessItemKey: input.operatorReadinessItemKey,
    acknowledgementTargetKey: null,
    proofRef: ref.proofRef,
  };
}

export function mapAcknowledgementEvidenceRefs(
  target: CloseControlAcknowledgementTarget | undefined,
): DeliveryReadinessEvidenceRef[] {
  if (!target) {
    return [];
  }

  const checklistRefs: DeliveryReadinessEvidenceRef[] =
    target.evidenceBasis.checklistEvidenceRefs.map((ref) => {
      const kind: DeliveryReadinessEvidenceRefKind =
        ref.kind === "monitor_result"
          ? "monitor_result"
          : ref.kind === "derived_checklist_read"
            ? "close_control_checklist_item"
            : "source_lineage";

      return {
        kind,
        evidencePath: ref.evidencePath,
        summary: ref.summary,
        sourceId: ref.sourceId,
        sourceSnapshotId: ref.sourceSnapshotId,
        sourceFileId: ref.sourceFileId,
        syncRunId: ref.syncRunId,
        pageKey: ref.pageKey,
        monitorKind: ref.monitorKind,
        monitorResultId: ref.monitorResultId,
        checklistItemFamily: target.relatedChecklistItemFamily,
        operatorReadinessItemKey: target.relatedReadinessItemKey,
        acknowledgementTargetKey: target.targetKey,
        proofRef: null,
      };
    });

  return [
    ...checklistRefs,
    ...target.evidenceBasis.readinessEvidenceRefs.map((ref) =>
      mapOperatorReadinessEvidenceRef(ref, {
        fallbackKind: inferOperatorEvidenceKind(ref.kind),
        operatorReadinessItemKey: target.relatedReadinessItemKey,
      }),
    ),
  ];
}

export function inferMonitorKindFromAcknowledgementTarget(
  target: CloseControlAcknowledgementTarget,
): MonitorKind | null {
  return (
    target.evidenceBasis.checklistEvidenceRefs.find((ref) => ref.monitorKind)
      ?.monitorKind ??
    target.evidenceBasis.readinessEvidenceRefs.find((ref) => ref.monitorKind)
      ?.monitorKind ??
    null
  );
}

export function collectLineage(items: OperatorAttentionItem[]) {
  const byKey = new Map<string, MonitorSourceLineageRef>();

  for (const item of items) {
    for (const ref of item.sourceLineageRefs) {
      byKey.set(monitorSourceLineageKey(ref), ref);
    }
  }

  return Array.from(byKey.values());
}

function inferOperatorEvidenceKind(
  kind: OperatorReadinessEvidenceRef["kind"],
): DeliveryReadinessEvidenceRefKind {
  switch (kind) {
    case "monitor_result":
      return "monitor_result";
    case "monitor_alert_card":
      return "monitor_alert_card";
    case "close_control_checklist":
      return "close_control_checklist";
    case "close_control_checklist_item":
      return "close_control_checklist_item";
    case "source_lineage":
      return "source_lineage";
    case "proof_posture":
      return "proof_posture";
  }
}

function monitorSourceLineageKey(ref: MonitorSourceLineageRef): string {
  if ("lineageKind" in ref) {
    switch (ref.lineageKind) {
      case "policy_source":
        return [
          ref.lineageKind,
          ref.sourceId,
          ref.sourceSnapshotId,
          ref.sourceFileId,
          ref.policyPageKey,
          ref.compileRunId,
        ].join(":");
      case "policy_threshold_fact":
        return [
          ref.lineageKind,
          ref.thresholdId,
          ref.sourceId,
          ref.sourceSnapshotId,
          ref.sourceFileId,
          ref.policyPageKey,
          ref.compileRunId,
        ].join(":");
      case "finance_twin_actual":
        return [
          ref.lineageKind,
          ref.sourceId,
          ref.sourceSnapshotId,
          ref.sourceFileId,
          ref.syncRunId,
          ref.targetKind,
          ref.targetId,
        ].join(":");
    }
  }

  return [
    "finance_twin_source",
    ref.sourceId,
    ref.sourceSnapshotId,
    ref.sourceFileId,
    ref.syncRunId,
    ref.targetKind,
    ref.targetId,
  ].join(":");
}
