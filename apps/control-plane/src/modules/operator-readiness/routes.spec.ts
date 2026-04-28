import Fastify from "fastify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerHttpErrorHandler } from "../../lib/http-errors";
import { registerOperatorReadinessRoutes } from "./routes";

describe("operator-readiness routes", () => {
  const apps: Array<ReturnType<typeof Fastify>> = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("parses companyKey and returns the deterministic internal readiness read model", async () => {
    const getReadiness = vi.fn().mockResolvedValue({
      companyKey: "acme",
      generatedAt: "2026-04-28T12:00:00.000Z",
      aggregateStatus: "needs_review",
      attentionItems: [
        {
          itemKey: "monitor:cash_posture:11111111-1111-4111-8111-111111111111",
          family: "monitor_alert_attention",
          status: "needs_review",
        },
      ],
      runtimeActionBoundary: {
        runtimeCodexUsed: false,
        deliveryCreated: false,
        outboxSendCreated: false,
        reportCreated: false,
        approvalCreated: false,
        missionCreated: false,
        monitorRunTriggered: false,
        monitorResultCreated: false,
      },
    });
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerOperatorReadinessRoutes(app, {
      operatorReadinessService: { getReadiness },
    });

    const response = await app.inject({
      method: "GET",
      url: "/operator-readiness/companies/acme",
    });

    expect(response.statusCode).toBe(200);
    expect(getReadiness).toHaveBeenCalledWith("acme");
    expect(response.json()).toMatchObject({
      companyKey: "acme",
      aggregateStatus: "needs_review",
      runtimeActionBoundary: {
        runtimeCodexUsed: false,
        deliveryCreated: false,
        outboxSendCreated: false,
        missionCreated: false,
        monitorRunTriggered: false,
        monitorResultCreated: false,
      },
    });
  });

  it("rejects invalid company keys before calling the service", async () => {
    const getReadiness = vi.fn();
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerOperatorReadinessRoutes(app, {
      operatorReadinessService: { getReadiness },
    });

    const response = await app.inject({
      method: "GET",
      url: "/operator-readiness/companies/BadCompany",
    });

    expect(response.statusCode).toBe(400);
    expect(getReadiness).not.toHaveBeenCalled();
  });
});
