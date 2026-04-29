import type {
  CloseControlAcknowledgementReadinessResult,
  CloseControlChecklistResult,
  CloseControlReviewSection,
  DeliveryReadinessResult,
  OperatorReadinessResult,
} from "@pocket-cto/domain";
import {
  buildReviewEvidenceRef,
  checklistProofRef,
  deliveryProofRef,
  mapAcknowledgementEvidenceRefs,
  mapDeliveryEvidenceRef,
  mapOperatorEvidenceRef,
  operatorProofRef,
} from "./evidence";
import { mapChecklistItemRefs } from "./checklist-sections";
import {
  collectProofRefs,
  dedupe,
  findWorstReviewStatus,
  mapAcknowledgementStatus,
  mapChecklistStatus,
  mapDeliveryStatus,
  mapOperatorStatus,
  summarizeFreshness,
  summarizeProof,
} from "./helpers";
import {
  buildReviewSourcePosture,
  dedupeLineageRefs,
  onlyValue,
} from "./section-helpers";

type DerivedSectionInput = {
  acknowledgementReadiness: CloseControlAcknowledgementReadinessResult;
  checklist: CloseControlChecklistResult;
  deliveryReadiness: DeliveryReadinessResult;
  operatorReadiness: OperatorReadinessResult;
};

export function buildMonitorContextPostureSection(
  input: DerivedSectionInput,
): CloseControlReviewSection {
  const checklistItems = input.checklist.items.filter(
    (item) =>
      item.family === "monitor_replay_readiness" ||
      item.evidenceBasis.refs.some((ref) => ref.monitorKind),
  );
  const operatorItems = input.operatorReadiness.attentionItems.filter(
    (item) => item.relatedMonitorKind,
  );
  const acknowledgementTargets =
    input.acknowledgementReadiness.acknowledgementTargets.filter((target) =>
      [
        ...target.evidenceBasis.checklistEvidenceRefs,
        ...target.evidenceBasis.readinessEvidenceRefs,
      ].some((ref) => ref.monitorKind),
    );
  const deliveryTargets =
    input.deliveryReadiness.deliveryReadinessTargets.filter(
      (target) => target.relatedMonitorKind,
    );
  const refs = [
    buildReviewEvidenceRef({
      kind: "monitor_context",
      evidencePath: "close-control.review-summary.monitor-context",
      summary:
        "Monitor context is summarized from shipped read posture; F6N does not rerun monitors.",
      proofRef: "close-control.review-summary.monitorContext",
    }),
    ...checklistItems.flatMap((item) => mapChecklistItemRefs(item)),
    ...operatorItems.flatMap((item) =>
      item.evidenceBasis.refs.map((ref) =>
        mapOperatorEvidenceRef(ref, {
          operatorReadinessItemKey: item.itemKey,
          proofRef: operatorProofRef(item.itemKey),
        }),
      ),
    ),
    ...acknowledgementTargets.flatMap(mapAcknowledgementEvidenceRefs),
    ...deliveryTargets.flatMap((target) =>
      target.evidenceBasis.refs.map((ref) =>
        mapDeliveryEvidenceRef(ref, {
          deliveryReadinessTargetKey: target.targetKey,
        }),
      ),
    ),
  ];

  return {
    sectionKey: "monitor-context-posture",
    family: "monitor_context_posture",
    status: findWorstReviewStatus([
      ...checklistItems.map((item) => mapChecklistStatus(item.status)),
      ...operatorItems.map((item) => mapOperatorStatus(item.status)),
      ...acknowledgementTargets.map((target) =>
        mapAcknowledgementStatus(target.status),
      ),
      ...deliveryTargets.map((target) => mapDeliveryStatus(target.status)),
    ]),
    evidenceBasis: {
      summary:
        "F6N monitor context posture is derived from existing checklist, readiness, acknowledgement, and delivery-boundary reads only.",
      refs,
    },
    sourceLineageRefs: dedupeLineageRefs([
      ...operatorItems.flatMap((item) => item.sourceLineageRefs),
      ...deliveryTargets.flatMap((target) => target.sourceLineageRefs),
    ]),
    sourcePosture: buildReviewSourcePosture(
      [
        ...checklistItems.map((item) => item.sourcePosture.state),
        ...operatorItems.map((item) => item.sourcePosture.state),
        ...acknowledgementTargets.map((target) => target.sourcePosture.state),
        ...deliveryTargets.map((target) => target.sourcePosture.state),
      ],
      refs,
      "Monitor context source posture is summarized from existing read posture only.",
    ),
    freshnessSummary: summarizeFreshness(
      [
        ...checklistItems.map((item) => item.freshnessSummary),
        ...operatorItems.map((item) => item.freshnessSummary),
        ...acknowledgementTargets.map((target) => target.freshnessSummary),
        ...deliveryTargets.map((target) => target.freshnessSummary),
      ].filter(Boolean),
      "Monitor context freshness is carried from existing read posture; no monitor was rerun.",
    ),
    limitations: dedupe([
      "Monitor context is review-summary context only; F6N does not trigger monitor runs or create monitor results.",
      ...checklistItems.flatMap((item) => item.limitations),
      ...operatorItems.flatMap((item) => item.limitations),
      ...acknowledgementTargets.flatMap((target) => target.limitations),
      ...deliveryTargets.flatMap((target) => target.limitations),
    ]),
    proofPosture: summarizeProof(
      [
        ...checklistItems.map((item) => item.proofPosture),
        ...operatorItems.map((item) => item.proofPosture),
        ...acknowledgementTargets.map((target) => target.proofPosture),
        ...deliveryTargets.map((target) => target.proofPosture),
      ],
      "Monitor context proof posture is carried from existing read posture only.",
    ),
    proofRefs: collectProofRefs([
      ...checklistItems.map((item) => checklistProofRef(item.family)),
      ...operatorItems.map((item) => operatorProofRef(item.itemKey)),
      ...acknowledgementTargets.map(
        (target) =>
          `close-control.acknowledgementReadiness.targets.${target.targetKey}.proofPosture`,
      ),
      ...deliveryTargets.map((target) => deliveryProofRef(target.targetKey)),
    ]),
    humanReviewNextStep:
      "Review monitor-context posture before deciding whether any separate human-run monitor follow-up is needed.",
    relatedChecklistItemFamily: "monitor_replay_readiness",
    relatedReadinessItemKey: onlyValue(operatorItems)?.itemKey ?? null,
    relatedAcknowledgementTargetKey:
      onlyValue(acknowledgementTargets)?.targetKey ?? null,
    relatedDeliveryReadinessTargetKey:
      onlyValue(deliveryTargets)?.targetKey ?? null,
    relatedMonitorKind:
      onlyValue(deliveryTargets)?.relatedMonitorKind ??
      onlyValue(operatorItems)?.relatedMonitorKind ??
      null,
  };
}

export function buildSourceAndWikiFreshnessPostureSection(
  input: DerivedSectionInput,
): CloseControlReviewSection {
  const checklistItems = input.checklist.items.filter(
    (item) => item.family !== "monitor_replay_readiness",
  );
  const operatorItems = input.operatorReadiness.attentionItems.filter(
    (item) =>
      item.relatedChecklistItemFamily ||
      item.family === "source_freshness_attention" ||
      item.family === "policy_source_attention",
  );
  const acknowledgementTargets =
    input.acknowledgementReadiness.acknowledgementTargets.filter(
      (target) => target.relatedChecklistItemFamily,
    );
  const deliveryTargets =
    input.deliveryReadiness.deliveryReadinessTargets.filter(
      (target) =>
        target.relatedChecklistItemFamily ||
        target.targetKind === "source_posture_target",
    );
  const refs = [
    buildReviewEvidenceRef({
      kind: "source_lineage",
      evidencePath: "close-control.review-summary.source-and-wiki-freshness",
      summary:
        "Source and CFO Wiki freshness posture is summarized from shipped read posture only.",
      proofRef: "close-control.review-summary.sourceAndWikiFreshness",
    }),
    ...checklistItems.flatMap((item) => mapChecklistItemRefs(item)),
    ...operatorItems.flatMap((item) =>
      item.evidenceBasis.refs.map((ref) =>
        mapOperatorEvidenceRef(ref, {
          operatorReadinessItemKey: item.itemKey,
          proofRef: operatorProofRef(item.itemKey),
        }),
      ),
    ),
    ...acknowledgementTargets.flatMap(mapAcknowledgementEvidenceRefs),
    ...deliveryTargets.flatMap((target) =>
      target.evidenceBasis.refs.map((ref) =>
        mapDeliveryEvidenceRef(ref, {
          deliveryReadinessTargetKey: target.targetKey,
        }),
      ),
    ),
  ];

  return {
    sectionKey: "source-and-wiki-freshness-posture",
    family: "source_and_wiki_freshness_posture",
    status: findWorstReviewStatus([
      ...checklistItems.map((item) => mapChecklistStatus(item.status)),
      ...operatorItems.map((item) => mapOperatorStatus(item.status)),
      ...acknowledgementTargets.map((target) =>
        mapAcknowledgementStatus(target.status),
      ),
      ...deliveryTargets.map((target) => mapDeliveryStatus(target.status)),
    ]),
    evidenceBasis: {
      summary:
        "F6N source and CFO Wiki freshness posture is derived from the existing source-backed F6H/F6J/F6K/F6M reads.",
      refs,
    },
    sourceLineageRefs: dedupeLineageRefs([
      ...operatorItems.flatMap((item) => item.sourceLineageRefs),
      ...deliveryTargets.flatMap((target) => target.sourceLineageRefs),
    ]),
    sourcePosture: buildReviewSourcePosture(
      [
        ...checklistItems.map((item) => item.sourcePosture.state),
        ...operatorItems.map((item) => item.sourcePosture.state),
        ...acknowledgementTargets.map((target) => target.sourcePosture.state),
        ...deliveryTargets.map((target) => target.sourcePosture.state),
      ],
      refs,
      "Source and CFO Wiki posture is carried from existing read models only.",
    ),
    freshnessSummary: summarizeFreshness(
      [
        ...checklistItems.map((item) => item.freshnessSummary),
        ...operatorItems.map((item) => item.freshnessSummary),
        ...acknowledgementTargets.map((target) => target.freshnessSummary),
        ...deliveryTargets.map((target) => target.freshnessSummary),
      ],
      "Source and CFO Wiki freshness is carried from existing read models only.",
    ),
    limitations: dedupe([
      "Source and CFO Wiki freshness posture is summarized for internal human review only; raw sources are not mutated.",
      ...checklistItems.flatMap((item) => item.limitations),
      ...operatorItems.flatMap((item) => item.limitations),
      ...acknowledgementTargets.flatMap((target) => target.limitations),
      ...deliveryTargets.flatMap((target) => target.limitations),
    ]),
    proofPosture: summarizeProof(
      [
        ...checklistItems.map((item) => item.proofPosture),
        ...operatorItems.map((item) => item.proofPosture),
        ...acknowledgementTargets.map((target) => target.proofPosture),
        ...deliveryTargets.map((target) => target.proofPosture),
      ],
      "Source and CFO Wiki proof posture is carried from existing read models only.",
    ),
    proofRefs: collectProofRefs([
      ...checklistItems.map((item) => checklistProofRef(item.family)),
      ...operatorItems.map((item) => operatorProofRef(item.itemKey)),
      ...acknowledgementTargets.map(
        (target) =>
          `close-control.acknowledgementReadiness.targets.${target.targetKey}.proofPosture`,
      ),
      ...deliveryTargets.map((target) => deliveryProofRef(target.targetKey)),
    ]),
    humanReviewNextStep:
      "Review source and CFO Wiki freshness posture before relying on the summary for any human follow-up.",
    relatedChecklistItemFamily: onlyValue(checklistItems)?.family ?? null,
    relatedReadinessItemKey: onlyValue(operatorItems)?.itemKey ?? null,
    relatedAcknowledgementTargetKey:
      onlyValue(acknowledgementTargets)?.targetKey ?? null,
    relatedDeliveryReadinessTargetKey:
      onlyValue(deliveryTargets)?.targetKey ?? null,
    relatedMonitorKind: null,
  };
}
