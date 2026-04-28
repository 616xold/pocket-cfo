import {
  CloseControlChecklistItemSchema,
  deriveCloseControlAggregateStatus,
  type CloseControlChecklistItem,
} from "@pocket-cto/domain";
import { dedupe } from "./utils";

export function buildSourceCoverageItem(
  requiredItems: CloseControlChecklistItem[],
): CloseControlChecklistItem {
  const status = deriveCloseControlAggregateStatus(requiredItems);
  return CloseControlChecklistItemSchema.parse({
    family: "source_coverage_review",
    status,
    sourcePosture: {
      state:
        status === "ready_for_review"
          ? "source_backed"
          : status === "blocked_by_evidence"
            ? "missing_source"
            : "limited_source",
      summary:
        status === "ready_for_review"
          ? "Required cash, receivables-aging, payables-aging, and policy source posture is present and fresh."
          : "At least one required close/control source family is missing, stale, failed, or limited.",
      refs: requiredItems.flatMap((item) => item.sourcePosture.refs),
    },
    evidenceBasis: {
      basisKind: "derived_source_coverage",
      summary:
        "Derived from the checklist source-family items; no raw source files are rewritten.",
      refs: requiredItems.flatMap((item) => item.evidenceBasis.refs),
    },
    freshnessSummary: {
      state:
        status === "ready_for_review"
          ? "fresh"
          : status === "blocked_by_evidence"
            ? "missing"
            : "mixed",
      summary:
        status === "ready_for_review"
          ? "All required source families have fresh stored posture."
          : "One or more required source families are not fresh and source-backed.",
      latestObservedAt: null,
    },
    limitations: dedupe(
      requiredItems
        .filter((item) => item.status !== "ready_for_review")
        .map((item) => `${item.family}: ${item.sourcePosture.summary}`),
    ),
    humanReviewNextStep:
      "Resolve missing, failed, stale, or limited source-family posture before treating the checklist as review-ready.",
    proofPosture: {
      state:
        status === "ready_for_review"
          ? "source_backed"
          : status === "blocked_by_evidence"
            ? "limited_by_missing_source"
            : "limited_by_coverage_gap",
      summary:
        status === "ready_for_review"
          ? "Coverage review is backed by all required stored source-family postures."
          : "Coverage review is limited by one or more source-family gaps.",
    },
  });
}
