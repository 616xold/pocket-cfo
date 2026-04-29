import Fastify from "fastify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerHttpErrorHandler } from "../../lib/http-errors";
import { registerCloseControlReviewSummaryRoutes } from "./routes";

describe("close/control review-summary routes", () => {
  const apps: Array<ReturnType<typeof Fastify>> = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("parses companyKey and returns the internal review-summary read model", async () => {
    const getReviewSummary = vi.fn().mockResolvedValue({
      companyKey: "acme",
      generatedAt: "2026-04-29T12:00:00.000Z",
      aggregateStatus: "needs_human_review",
      reviewSections: [
        {
          sectionKey: "close-control-checklist-posture",
          family: "close_control_checklist_posture",
          status: "needs_human_review",
        },
      ],
      runtimeActionBoundary: {
        runtimeCodexUsed: false,
        deliveryCreated: false,
        outboxSendCreated: false,
        notificationProviderCalled: false,
        reportCreated: false,
        reportReleased: false,
        reportCirculated: false,
        approvalCreated: false,
        certificationCreated: false,
        closeCompleteCreated: false,
        signOffCreated: false,
        attestationCreated: false,
        missionCreated: false,
        monitorRunTriggered: false,
        monitorResultCreated: false,
        sourceMutationCreated: false,
        generatedProseCreated: false,
      },
    });
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerCloseControlReviewSummaryRoutes(app, {
      closeControlReviewSummaryService: { getReviewSummary },
    });

    const response = await app.inject({
      method: "GET",
      url: "/close-control/companies/acme/review-summary",
    });

    expect(response.statusCode).toBe(200);
    expect(getReviewSummary).toHaveBeenCalledWith("acme");
    expect(response.json()).toMatchObject({
      companyKey: "acme",
      aggregateStatus: "needs_human_review",
      runtimeActionBoundary: {
        runtimeCodexUsed: false,
        deliveryCreated: false,
        outboxSendCreated: false,
        notificationProviderCalled: false,
        reportCreated: false,
        reportReleased: false,
        reportCirculated: false,
        approvalCreated: false,
        certificationCreated: false,
        closeCompleteCreated: false,
        signOffCreated: false,
        attestationCreated: false,
        missionCreated: false,
        monitorRunTriggered: false,
        monitorResultCreated: false,
        sourceMutationCreated: false,
        generatedProseCreated: false,
      },
    });
  });

  it("rejects invalid company keys before calling the service", async () => {
    const getReviewSummary = vi.fn();
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerCloseControlReviewSummaryRoutes(app, {
      closeControlReviewSummaryService: { getReviewSummary },
    });

    const response = await app.inject({
      method: "GET",
      url: "/close-control/companies/BadCompany/review-summary",
    });

    expect(response.statusCode).toBe(400);
    expect(getReviewSummary).not.toHaveBeenCalled();
  });
});
