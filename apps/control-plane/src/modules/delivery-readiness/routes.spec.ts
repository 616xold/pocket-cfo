import Fastify from "fastify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerHttpErrorHandler } from "../../lib/http-errors";
import { registerDeliveryReadinessRoutes } from "./routes";

describe("delivery-readiness routes", () => {
  const apps: Array<ReturnType<typeof Fastify>> = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("parses companyKey and returns the internal delivery-readiness read model", async () => {
    const getDeliveryReadiness = vi.fn().mockResolvedValue({
      companyKey: "acme",
      generatedAt: "2026-04-28T12:00:00.000Z",
      aggregateStatus: "needs_review_before_delivery",
      deliveryReadinessTargets: [
        {
          targetKey: "operator-readiness:aggregate",
          targetKind: "operator_readiness_target",
          status: "needs_review_before_delivery",
        },
      ],
      runtimeActionBoundary: {
        runtimeCodexUsed: false,
        deliveryCreated: false,
        outboxSendCreated: false,
        notificationProviderCalled: false,
        emailSent: false,
        slackSent: false,
        smsSent: false,
        webhookCalled: false,
        reportCreated: false,
        approvalCreated: false,
        missionCreated: false,
        monitorRunTriggered: false,
        monitorResultCreated: false,
        sourceMutationCreated: false,
        generatedNotificationProseCreated: false,
      },
    });
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerDeliveryReadinessRoutes(app, {
      deliveryReadinessService: { getDeliveryReadiness },
    });

    const response = await app.inject({
      method: "GET",
      url: "/delivery-readiness/companies/acme",
    });

    expect(response.statusCode).toBe(200);
    expect(getDeliveryReadiness).toHaveBeenCalledWith("acme");
    expect(response.json()).toMatchObject({
      companyKey: "acme",
      aggregateStatus: "needs_review_before_delivery",
      runtimeActionBoundary: {
        runtimeCodexUsed: false,
        deliveryCreated: false,
        outboxSendCreated: false,
        notificationProviderCalled: false,
        missionCreated: false,
        monitorRunTriggered: false,
        monitorResultCreated: false,
        sourceMutationCreated: false,
      },
    });
  });

  it("rejects invalid company keys before calling the service", async () => {
    const getDeliveryReadiness = vi.fn();
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerDeliveryReadinessRoutes(app, {
      deliveryReadinessService: { getDeliveryReadiness },
    });

    const response = await app.inject({
      method: "GET",
      url: "/delivery-readiness/companies/BadCompany",
    });

    expect(response.statusCode).toBe(400);
    expect(getDeliveryReadiness).not.toHaveBeenCalled();
  });
});
