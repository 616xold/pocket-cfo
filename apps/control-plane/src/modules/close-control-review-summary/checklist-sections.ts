import type {
  CloseControlChecklistItem,
  CloseControlChecklistResult,
  CloseControlReviewEvidenceRef,
  CloseControlReviewSection,
} from "@pocket-cto/domain";
import {
  buildReviewEvidenceRef,
  checklistProofRef,
  mapChecklistEvidenceRef,
} from "./evidence";
import {
  collectProofRefs,
  dedupe,
  mapChecklistStatus,
  summarizeFreshness,
  summarizeProof,
} from "./helpers";
import { buildReviewSourcePosture } from "./section-helpers";

export function buildChecklistPostureSection(
  checklist: CloseControlChecklistResult,
): CloseControlReviewSection {
  const refs = [
    buildReviewEvidenceRef({
      kind: "close_control_checklist",
      evidencePath: "close-control.checklist.aggregateStatus",
      summary: checklist.evidenceSummary,
      proofRef: "close-control.checklist.aggregateStatus",
    }),
    ...checklist.items.flatMap((item) => mapChecklistItemRefs(item)),
  ];
  const proofRefs = collectProofRefs(
    checklist.items.map((item) => checklistProofRef(item.family)),
  );

  return {
    sectionKey: "close-control-checklist-posture",
    family: "close_control_checklist_posture",
    status: mapChecklistStatus(checklist.aggregateStatus),
    evidenceBasis: {
      summary:
        "F6N close/control checklist posture is derived from the shipped F6H checklist read model.",
      refs,
    },
    sourceLineageRefs: [],
    sourcePosture: buildReviewSourcePosture(
      checklist.items.map((item) => item.sourcePosture.state),
      refs,
      "Source posture is carried from the shipped F6H checklist items.",
    ),
    freshnessSummary: summarizeFreshness(
      checklist.items.map((item) => item.freshnessSummary),
      "Freshness posture is carried from the shipped F6H checklist items.",
    ),
    limitations: dedupe([
      "The checklist section is an internal review-summary section and does not assert close completion.",
      ...checklist.limitations,
      ...checklist.items.flatMap((item) => item.limitations),
    ]),
    proofPosture: summarizeProof(
      checklist.items.map((item) => item.proofPosture),
      "Proof posture is carried from the shipped F6H checklist items.",
    ),
    proofRefs,
    humanReviewNextStep: buildChecklistNextStep(checklist.aggregateStatus),
    relatedChecklistItemFamily: null,
    relatedReadinessItemKey: null,
    relatedAcknowledgementTargetKey: null,
    relatedDeliveryReadinessTargetKey: null,
    relatedMonitorKind: null,
  };
}

export function mapChecklistItemRefs(
  item: CloseControlChecklistItem,
): CloseControlReviewEvidenceRef[] {
  const proofRef = checklistProofRef(item.family);

  return item.evidenceBasis.refs.map((ref) => ({
    ...mapChecklistEvidenceRef(ref, { proofRef }),
    checklistItemFamily: item.family,
  }));
}

function buildChecklistNextStep(
  status: CloseControlChecklistResult["aggregateStatus"],
) {
  if (status === "blocked_by_evidence") {
    return "Resolve the blocked evidence posture in the F6H checklist before using this internal review summary.";
  }

  if (status === "needs_review") {
    return "Review the F6H checklist items that need human attention before any follow-up.";
  }

  return "Review the F6H checklist posture as one input to the internal close/control review summary.";
}
