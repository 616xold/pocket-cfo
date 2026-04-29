import type {
  CloseControlAcknowledgementTarget,
  CloseControlEvidenceRef,
  CloseControlReviewEvidenceRef,
  CloseControlReviewEvidenceRefKind,
  DeliveryReadinessEvidenceRef,
  OperatorReadinessEvidenceRef,
} from "@pocket-cto/domain";

export function buildReviewEvidenceRef(input: {
  kind: CloseControlReviewEvidenceRefKind;
  evidencePath: string;
  summary: string;
  acknowledgementTargetKey?: string | null;
  deliveryReadinessTargetKey?: string | null;
  operatorReadinessItemKey?: string | null;
  proofRef?: string | null;
}): CloseControlReviewEvidenceRef {
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
    operatorReadinessItemKey: input.operatorReadinessItemKey ?? null,
    acknowledgementTargetKey: input.acknowledgementTargetKey ?? null,
    deliveryReadinessTargetKey: input.deliveryReadinessTargetKey ?? null,
    proofRef: input.proofRef ?? null,
  };
}

export function mapChecklistEvidenceRef(
  ref: CloseControlEvidenceRef,
  input: { proofRef?: string | null },
): CloseControlReviewEvidenceRef {
  return {
    kind: inferChecklistEvidenceKind(ref.kind),
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
    operatorReadinessItemKey: null,
    acknowledgementTargetKey: null,
    deliveryReadinessTargetKey: null,
    proofRef: input.proofRef ?? null,
  };
}

export function mapOperatorEvidenceRef(
  ref: OperatorReadinessEvidenceRef,
  input: {
    operatorReadinessItemKey?: string | null;
    proofRef?: string | null;
  },
): CloseControlReviewEvidenceRef {
  return {
    kind: inferOperatorEvidenceKind(ref.kind),
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
    operatorReadinessItemKey: input.operatorReadinessItemKey ?? null,
    acknowledgementTargetKey: null,
    deliveryReadinessTargetKey: null,
    proofRef: input.proofRef ?? ref.proofRef,
  };
}

export function mapAcknowledgementEvidenceRefs(
  target: CloseControlAcknowledgementTarget,
): CloseControlReviewEvidenceRef[] {
  const proofRef = acknowledgementProofRef(target.targetKey);

  return [
    ...target.evidenceBasis.checklistEvidenceRefs.map((ref) => ({
      ...mapChecklistEvidenceRef(ref, { proofRef }),
      checklistItemFamily: target.relatedChecklistItemFamily,
      acknowledgementTargetKey: target.targetKey,
    })),
    ...target.evidenceBasis.readinessEvidenceRefs.map((ref) => ({
      ...mapOperatorEvidenceRef(ref, {
        operatorReadinessItemKey: target.relatedReadinessItemKey,
        proofRef,
      }),
      acknowledgementTargetKey: target.targetKey,
    })),
  ];
}

export function mapDeliveryEvidenceRef(
  ref: DeliveryReadinessEvidenceRef,
  input: { deliveryReadinessTargetKey?: string | null },
): CloseControlReviewEvidenceRef {
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
    operatorReadinessItemKey: ref.operatorReadinessItemKey,
    acknowledgementTargetKey: ref.acknowledgementTargetKey,
    deliveryReadinessTargetKey: input.deliveryReadinessTargetKey ?? null,
    proofRef: ref.proofRef,
  };
}

export function checklistProofRef(family: string) {
  return `close-control.checklist.items.${family}.proofPosture`;
}

export function operatorProofRef(itemKey: string) {
  return `operator-readiness.attentionItems.${itemKey}.proofPosture`;
}

export function acknowledgementProofRef(targetKey: string) {
  return `close-control.acknowledgementReadiness.targets.${targetKey}.proofPosture`;
}

export function deliveryProofRef(targetKey: string) {
  return `delivery-readiness.targets.${targetKey}.proofPosture`;
}

function inferChecklistEvidenceKind(
  kind: CloseControlEvidenceRef["kind"],
): CloseControlReviewEvidenceRefKind {
  switch (kind) {
    case "finance_twin_source":
    case "cfo_wiki_source":
    case "cfo_wiki_page":
      return "source_lineage";
    case "monitor_result":
      return "monitor_context";
    case "derived_checklist_read":
      return "close_control_checklist_item";
  }
}

function inferOperatorEvidenceKind(
  kind: OperatorReadinessEvidenceRef["kind"],
): CloseControlReviewEvidenceRefKind {
  switch (kind) {
    case "monitor_result":
    case "monitor_alert_card":
      return "monitor_context";
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

function inferDeliveryEvidenceKind(
  kind: DeliveryReadinessEvidenceRef["kind"],
): CloseControlReviewEvidenceRefKind {
  switch (kind) {
    case "operator_readiness_result":
      return "operator_readiness_result";
    case "operator_readiness_item":
      return "operator_readiness_item";
    case "acknowledgement_readiness_result":
      return "acknowledgement_readiness_result";
    case "acknowledgement_readiness_target":
      return "acknowledgement_readiness_target";
    case "close_control_checklist":
      return "close_control_checklist";
    case "close_control_checklist_item":
      return "close_control_checklist_item";
    case "monitor_result":
    case "monitor_alert_card":
      return "monitor_context";
    case "source_lineage":
      return "source_lineage";
    case "proof_posture":
      return "proof_posture";
  }
}
