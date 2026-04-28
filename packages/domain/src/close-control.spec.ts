import { describe, expect, it } from "vitest";
import {
  CLOSE_CONTROL_CHECKLIST_ITEM_FAMILIES,
  CloseControlChecklistResultSchema,
  CloseControlChecklistStatusSchema,
  CloseControlRuntimeActionBoundarySchema,
  deriveCloseControlAggregateStatus,
  type CloseControlChecklistItem,
  type CloseControlChecklistItemFamily,
} from "./close-control";

const generatedAt = "2026-04-28T12:00:00.000Z";

describe("close/control checklist domain contract", () => {
  it("accepts one source-backed review-only checklist result with every F6H item family", () => {
    const parsed = CloseControlChecklistResultSchema.parse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_review",
      items: CLOSE_CONTROL_CHECKLIST_ITEM_FAMILIES.map((family) =>
        buildItem(family),
      ),
      evidenceSummary:
        "Checklist read was derived from stored Finance Twin source posture, CFO Wiki policy posture, and latest persisted monitor results as context only.",
      limitations: [
        "F6H is a review checklist and does not assert accounting close completion.",
      ],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(parsed.items.map((item) => item.family)).toEqual(
      CLOSE_CONTROL_CHECKLIST_ITEM_FAMILIES,
    );
    expect(parsed.aggregateStatus).toBe("ready_for_review");
    expect(parsed.runtimeActionBoundary).toMatchObject({
      runtimeCodexUsed: false,
      deliveryCreated: false,
      reportCreated: false,
      approvalCreated: false,
      monitorRunTriggered: false,
      missionCreated: false,
    });
  });

  it("keeps the status vocabulary review-oriented and excludes close_complete", () => {
    expect(CloseControlChecklistStatusSchema.options).toEqual([
      "ready_for_review",
      "needs_review",
      "blocked_by_evidence",
    ]);
    expect(CloseControlChecklistStatusSchema.options).not.toContain(
      "close_complete",
    );
  });

  it("derives blocked aggregate status when required evidence is blocked", () => {
    expect(
      deriveCloseControlAggregateStatus([
        buildItem("cash_source_freshness_review"),
        buildItem("policy_source_freshness_review", "blocked_by_evidence"),
      ]),
    ).toBe("blocked_by_evidence");
  });

  it("derives needs-review aggregate status when any item needs review", () => {
    expect(
      deriveCloseControlAggregateStatus([
        buildItem("cash_source_freshness_review"),
        buildItem("monitor_replay_readiness", "needs_review"),
      ]),
    ).toBe("needs_review");
  });

  it("rejects aggregate status that hides blocked evidence", () => {
    const result = CloseControlChecklistResultSchema.safeParse({
      companyKey: "acme",
      generatedAt,
      aggregateStatus: "ready_for_review",
      items: [
        buildItem("source_coverage_review", "blocked_by_evidence"),
        ...CLOSE_CONTROL_CHECKLIST_ITEM_FAMILIES.filter(
          (family) => family !== "source_coverage_review",
        ).map((family) => buildItem(family)),
      ],
      evidenceSummary: "Derived checklist read.",
      limitations: ["Review-only checklist."],
      runtimeActionBoundary: buildBoundary(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects any runtime or action side effect boundary set to true", () => {
    const parsed = CloseControlRuntimeActionBoundarySchema.safeParse({
      ...buildBoundary(),
      runtimeCodexUsed: true,
    });

    expect(parsed.success).toBe(false);
  });
});

function buildItem(
  family: CloseControlChecklistItemFamily,
  status: CloseControlChecklistItem["status"] = "ready_for_review",
): CloseControlChecklistItem {
  return {
    family,
    status,
    sourcePosture: {
      state: status === "ready_for_review" ? "source_backed" : "missing_source",
      summary:
        status === "ready_for_review"
          ? "Stored source posture is present and fresh."
          : "Required stored source posture is missing.",
      refs: [
        buildEvidenceRef({
          evidencePath: `items.${family}`,
          summary: "Derived F6H checklist evidence basis.",
        }),
      ],
    },
    evidenceBasis: {
      basisKind: "derived_source_coverage",
      summary: "Derived from stored source posture.",
      refs: [
        buildEvidenceRef({
          evidencePath: `items.${family}.evidenceBasis`,
          summary: "No model-written prose is used as evidence.",
        }),
      ],
    },
    freshnessSummary: {
      state: status === "ready_for_review" ? "fresh" : "missing",
      summary:
        status === "ready_for_review"
          ? "Fresh stored source posture is available."
          : "Fresh stored source posture is not available.",
      latestObservedAt: generatedAt,
    },
    limitations: [
      "This checklist item is review posture and not accounting close completion.",
    ],
    humanReviewNextStep:
      "Review the cited source posture before relying on this checklist item.",
    proofPosture: {
      state:
        status === "ready_for_review"
          ? "source_backed"
          : "limited_by_missing_source",
      summary:
        status === "ready_for_review"
          ? "The item is backed by stored source posture."
          : "The item is limited by missing stored evidence.",
    },
  };
}

function buildEvidenceRef(input: { evidencePath: string; summary: string }) {
  return {
    kind: "derived_checklist_read" as const,
    evidencePath: input.evidencePath,
    summary: input.summary,
    sourceId: null,
    sourceSnapshotId: null,
    sourceFileId: null,
    syncRunId: null,
    pageKey: null,
    monitorKind: null,
    monitorResultId: null,
  };
}

function buildBoundary() {
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
      "The checklist is a deterministic review-only read with no runtime or external action side effects.",
    replayImplication:
      "The first F6H slice is read-only and derived from current stored posture, so no checklist table or mission replay event is appended.",
  };
}
