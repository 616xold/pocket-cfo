import type {
  CloseControlAcknowledgementReadinessResult,
  CloseControlReviewSection,
  DeliveryReadinessResult,
  OperatorReadinessResult,
} from "@pocket-cto/domain";
import {
  acknowledgementProofRef,
  buildReviewEvidenceRef,
  deliveryProofRef,
  mapAcknowledgementEvidenceRefs,
  mapDeliveryEvidenceRef,
  mapOperatorEvidenceRef,
  operatorProofRef,
} from "./evidence";
import {
  collectProofRefs,
  dedupe,
  mapAcknowledgementStatus,
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

export function buildOperatorReadinessPostureSection(
  readiness: OperatorReadinessResult,
): CloseControlReviewSection {
  const refs = [
    buildReviewEvidenceRef({
      kind: "operator_readiness_result",
      evidencePath: "operator-readiness.aggregateStatus",
      summary: readiness.evidenceSummary,
      proofRef: "operator-readiness.aggregateStatus",
    }),
    ...readiness.attentionItems.flatMap((item) =>
      item.evidenceBasis.refs.map((ref) =>
        mapOperatorEvidenceRef(ref, {
          operatorReadinessItemKey: item.itemKey,
          proofRef: operatorProofRef(item.itemKey),
        }),
      ),
    ),
  ];

  return {
    sectionKey: "operator-readiness-posture",
    family: "operator_readiness_posture",
    status: mapOperatorStatus(readiness.aggregateStatus),
    evidenceBasis: {
      summary:
        "F6N operator-readiness posture is derived from the shipped F6J read model.",
      refs,
    },
    sourceLineageRefs: dedupeLineageRefs(
      readiness.attentionItems.flatMap((item) => item.sourceLineageRefs),
    ),
    sourcePosture: buildReviewSourcePosture(
      readiness.attentionItems.map((item) => item.sourcePosture.state),
      refs,
      "Operator-readiness source posture is carried from F6J attention items.",
    ),
    freshnessSummary: summarizeFreshness(
      readiness.attentionItems.map((item) => item.freshnessSummary),
      "Operator-readiness freshness posture is carried from F6J attention items.",
    ),
    limitations: dedupe([
      "Operator-readiness is summarized for internal human review only and does not create generated operator content.",
      ...readiness.limitations,
      ...readiness.attentionItems.flatMap((item) => item.limitations),
    ]),
    proofPosture: summarizeProof(
      readiness.attentionItems.map((item) => item.proofPosture),
      "Operator-readiness proof posture is carried from F6J attention items.",
    ),
    proofRefs: collectProofRefs(
      readiness.attentionItems.map((item) => operatorProofRef(item.itemKey)),
    ),
    humanReviewNextStep: buildOperatorNextStep(readiness.aggregateStatus),
    relatedChecklistItemFamily: null,
    relatedReadinessItemKey:
      onlyValue(readiness.attentionItems)?.itemKey ?? null,
    relatedAcknowledgementTargetKey: null,
    relatedDeliveryReadinessTargetKey: null,
    relatedMonitorKind: null,
  };
}

export function buildAcknowledgementReadinessPostureSection(
  acknowledgementReadiness: CloseControlAcknowledgementReadinessResult,
): CloseControlReviewSection {
  const refs = [
    buildReviewEvidenceRef({
      kind: "acknowledgement_readiness_result",
      evidencePath: "close-control.acknowledgementReadiness.aggregateStatus",
      summary: acknowledgementReadiness.evidenceSummary,
      proofRef: "close-control.acknowledgementReadiness.aggregateStatus",
    }),
    ...acknowledgementReadiness.acknowledgementTargets.flatMap(
      mapAcknowledgementEvidenceRefs,
    ),
  ];

  return {
    sectionKey: "acknowledgement-readiness-posture",
    family: "acknowledgement_readiness_posture",
    status: mapAcknowledgementStatus(acknowledgementReadiness.aggregateStatus),
    evidenceBasis: {
      summary:
        "F6N acknowledgement-readiness posture is derived from the shipped F6K read model.",
      refs,
    },
    sourceLineageRefs: [],
    sourcePosture: buildReviewSourcePosture(
      acknowledgementReadiness.acknowledgementTargets.map(
        (target) => target.sourcePosture.state,
      ),
      refs,
      "Acknowledgement-readiness source posture is carried from F6K targets.",
    ),
    freshnessSummary: summarizeFreshness(
      acknowledgementReadiness.acknowledgementTargets.map(
        (target) => target.freshnessSummary,
      ),
      "Acknowledgement-readiness freshness posture is carried from F6K targets.",
    ),
    limitations: dedupe([
      "Acknowledgement-readiness is summarized for internal human review only and does not create acknowledgement, sign-off, or close-complete records.",
      ...acknowledgementReadiness.limitations,
      ...acknowledgementReadiness.operatorReadinessContext.limitations,
      ...acknowledgementReadiness.acknowledgementTargets.flatMap(
        (target) => target.limitations,
      ),
    ]),
    proofPosture: summarizeProof(
      acknowledgementReadiness.acknowledgementTargets.map(
        (target) => target.proofPosture,
      ),
      "Acknowledgement-readiness proof posture is carried from F6K targets.",
    ),
    proofRefs: collectProofRefs(
      acknowledgementReadiness.acknowledgementTargets.map((target) =>
        acknowledgementProofRef(target.targetKey),
      ),
    ),
    humanReviewNextStep: buildAcknowledgementNextStep(
      acknowledgementReadiness.aggregateStatus,
    ),
    relatedChecklistItemFamily: null,
    relatedReadinessItemKey: null,
    relatedAcknowledgementTargetKey:
      onlyValue(acknowledgementReadiness.acknowledgementTargets)?.targetKey ??
      null,
    relatedDeliveryReadinessTargetKey: null,
    relatedMonitorKind: null,
  };
}

export function buildDeliveryBoundaryPostureSection(
  deliveryReadiness: DeliveryReadinessResult,
): CloseControlReviewSection {
  const refs = [
    buildReviewEvidenceRef({
      kind: "delivery_readiness_result",
      evidencePath: "delivery-readiness.aggregateStatus",
      summary: deliveryReadiness.evidenceSummary,
      proofRef: "delivery-readiness.aggregateStatus",
    }),
    ...deliveryReadiness.deliveryReadinessTargets.flatMap((target) =>
      target.evidenceBasis.refs.map((ref) =>
        mapDeliveryEvidenceRef(ref, {
          deliveryReadinessTargetKey: target.targetKey,
        }),
      ),
    ),
  ];

  return {
    sectionKey: "delivery-boundary-posture",
    family: "delivery_boundary_posture",
    status: mapDeliveryStatus(deliveryReadiness.aggregateStatus),
    evidenceBasis: {
      summary:
        "F6N delivery-boundary posture is derived from the shipped F6M internal delivery-readiness boundary.",
      refs,
    },
    sourceLineageRefs: dedupeLineageRefs(
      deliveryReadiness.deliveryReadinessTargets.flatMap(
        (target) => target.sourceLineageRefs,
      ),
    ),
    sourcePosture: buildReviewSourcePosture(
      deliveryReadiness.deliveryReadinessTargets.map(
        (target) => target.sourcePosture.state,
      ),
      refs,
      "Delivery-boundary source posture is carried from F6M targets.",
    ),
    freshnessSummary: summarizeFreshness(
      deliveryReadiness.deliveryReadinessTargets.map(
        (target) => target.freshnessSummary,
      ),
      "Delivery-boundary freshness posture is carried from F6M targets.",
    ),
    limitations: dedupe([
      "Delivery-boundary posture is internal review-summary posture only; no provider, outbox, notification, external message, or delivery record is created.",
      ...deliveryReadiness.limitations,
      ...deliveryReadiness.deliveryReadinessTargets.flatMap(
        (target) => target.limitations,
      ),
    ]),
    proofPosture: summarizeProof(
      deliveryReadiness.deliveryReadinessTargets.map(
        (target) => target.proofPosture,
      ),
      "Delivery-boundary proof posture is carried from F6M targets.",
    ),
    proofRefs: collectProofRefs(
      deliveryReadiness.deliveryReadinessTargets.map((target) =>
        deliveryProofRef(target.targetKey),
      ),
    ),
    humanReviewNextStep: buildDeliveryNextStep(
      deliveryReadiness.aggregateStatus,
    ),
    relatedChecklistItemFamily: null,
    relatedReadinessItemKey: null,
    relatedAcknowledgementTargetKey: null,
    relatedDeliveryReadinessTargetKey:
      onlyValue(deliveryReadiness.deliveryReadinessTargets)?.targetKey ?? null,
    relatedMonitorKind: null,
  };
}

function buildOperatorNextStep(status: OperatorReadinessResult["aggregateStatus"]) {
  if (status === "blocked_by_evidence") {
    return "Resolve blocked F6J operator-readiness evidence before relying on this internal review summary.";
  }

  if (status === "needs_review") {
    return "Review F6J operator-readiness items that need human attention before any follow-up.";
  }

  return "Review F6J operator-readiness posture as one input to the internal close/control review summary.";
}

function buildAcknowledgementNextStep(
  status: CloseControlAcknowledgementReadinessResult["aggregateStatus"],
) {
  if (status === "blocked_by_evidence") {
    return "Resolve blocked F6K acknowledgement-readiness evidence before relying on this internal review summary.";
  }

  if (status === "needs_review_before_acknowledgement") {
    return "Review F6K acknowledgement-readiness targets that need human attention before any follow-up.";
  }

  return "Review F6K acknowledgement-readiness posture as one input to the internal close/control review summary.";
}

function buildDeliveryNextStep(status: DeliveryReadinessResult["aggregateStatus"]) {
  if (status === "blocked_by_evidence") {
    return "Resolve blocked F6M delivery-boundary evidence before relying on this internal review summary.";
  }

  if (status === "needs_review_before_delivery") {
    return "Review F6M delivery-boundary targets that need human attention before any follow-up.";
  }

  return "Review F6M delivery-boundary posture as one input to the internal close/control review summary.";
}
