import { describe, expect, it } from "vitest";
import { buildReportingReleaseReadinessView } from "./release-readiness";

describe("buildReportingReleaseReadinessView", () => {
  it("describes pending lender-update release approval requests as unresolved", () => {
    const view = buildReportingReleaseReadinessView({
      approvals: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          missionId: "22222222-2222-4222-8222-222222222222",
          taskId: null,
          kind: "report_release",
          status: "pending",
          requestedBy: "finance-operator",
          resolvedBy: null,
          rationale: null,
          payload: {},
          createdAt: "2026-04-21T09:00:00.000Z",
          updatedAt: "2026-04-21T09:00:00.000Z",
        },
      ],
      reportKind: "lender_update",
      storedDraft: true,
    });

    expect(view).toMatchObject({
      releaseApprovalStatus: "pending_review",
      releaseReady: false,
      summary:
        "An unresolved release approval request from finance-operator already exists; the stored lender update is not yet approved for release.",
    });
  });

  it("marks release readiness as not approved after a resolved non-approval outcome", () => {
    const view = buildReportingReleaseReadinessView({
      approvals: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          missionId: "22222222-2222-4222-8222-222222222222",
          taskId: null,
          kind: "report_release",
          status: "cancelled",
          requestedBy: "finance-operator",
          resolvedBy: "finance-operator",
          rationale: "Operator withdrew the request.",
          payload: {},
          createdAt: "2026-04-21T09:00:00.000Z",
          updatedAt: "2026-04-21T09:05:00.000Z",
        },
      ],
      reportKind: "diligence_packet",
      storedDraft: true,
    });

    expect(view).toMatchObject({
      releaseApprovalStatus: "not_approved_for_release",
      releaseReady: false,
      resolvedBy: "finance-operator",
    });
  });
});
