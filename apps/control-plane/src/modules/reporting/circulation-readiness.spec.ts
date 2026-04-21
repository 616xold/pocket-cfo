import { describe, expect, it } from "vitest";
import { buildReportingCirculationReadinessView } from "./circulation-readiness";

describe("buildReportingCirculationReadinessView", () => {
  it("describes pending board-packet circulation approval requests as unresolved", () => {
    const view = buildReportingCirculationReadinessView({
      approvals: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          missionId: "22222222-2222-4222-8222-222222222222",
          taskId: null,
          kind: "report_circulation",
          status: "pending",
          requestedBy: "finance-operator",
          resolvedBy: null,
          rationale: null,
          payload: {},
          createdAt: "2026-04-21T09:00:00.000Z",
          updatedAt: "2026-04-21T09:00:00.000Z",
        },
      ],
      reportKind: "board_packet",
      storedDraft: true,
    });

    expect(view).toMatchObject({
      circulationApprovalStatus: "pending_review",
      circulationReady: false,
      summary:
        "An unresolved circulation approval request from finance-operator already exists; the stored board packet is not yet approved for internal circulation.",
    });
  });

  it("marks circulation readiness as not approved after a resolved non-approval outcome", () => {
    const view = buildReportingCirculationReadinessView({
      approvals: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          missionId: "22222222-2222-4222-8222-222222222222",
          taskId: null,
          kind: "report_circulation",
          status: "declined",
          requestedBy: "finance-operator",
          resolvedBy: "finance-reviewer",
          rationale: "Board packet needs one more revision.",
          payload: {},
          createdAt: "2026-04-21T09:00:00.000Z",
          updatedAt: "2026-04-21T09:05:00.000Z",
        },
      ],
      reportKind: "board_packet",
      storedDraft: true,
    });

    expect(view).toMatchObject({
      circulationApprovalStatus: "not_approved_for_circulation",
      circulationReady: false,
      resolvedBy: "finance-reviewer",
    });
  });
});
