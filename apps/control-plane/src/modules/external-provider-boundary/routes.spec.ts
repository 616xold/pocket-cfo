import Fastify from "fastify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerHttpErrorHandler } from "../../lib/http-errors";
import { registerExternalProviderBoundaryRoutes } from "./routes";

describe("external-provider-boundary routes", () => {
  const apps: Array<ReturnType<typeof Fastify>> = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("parses companyKey and returns the internal provider-boundary read model", async () => {
    const getExternalProviderBoundary = vi.fn().mockResolvedValue({
      companyKey: "acme",
      generatedAt: "2026-04-29T18:00:00.000Z",
      aggregateStatus: "needs_human_review_before_provider_boundary",
      externalProviderBoundaryTargets: [
        {
          targetKey: "delivery-readiness-boundary",
          targetFamily: "delivery_readiness_boundary",
          status: "needs_human_review_before_provider_boundary",
        },
      ],
      runtimeActionBoundary: {
        runtimeCodexUsed: false,
        deliveryCreated: false,
        externalProviderCalled: false,
        notificationProviderCalled: false,
        providerCredentialCreated: false,
        providerJobCreated: false,
        outboxSendCreated: false,
        emailSent: false,
        slackSent: false,
        smsSent: false,
        webhookCalled: false,
        scheduledDeliveryCreated: false,
        autoSendConfigured: false,
        reportCreated: false,
        reportReleased: false,
        approvalCreated: false,
        missionCreated: false,
        monitorRunTriggered: false,
        monitorResultCreated: false,
        sourceMutationCreated: false,
        generatedNotificationProseCreated: false,
        generatedProseCreated: false,
      },
    });
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerExternalProviderBoundaryRoutes(app, {
      externalProviderBoundaryService: { getExternalProviderBoundary },
    });

    const response = await app.inject({
      method: "GET",
      url: "/external-provider-boundary/companies/acme",
    });

    expect(response.statusCode).toBe(200);
    expect(getExternalProviderBoundary).toHaveBeenCalledWith("acme");
    expect(response.json()).toMatchObject({
      companyKey: "acme",
      aggregateStatus: "needs_human_review_before_provider_boundary",
      runtimeActionBoundary: {
        runtimeCodexUsed: false,
        deliveryCreated: false,
        externalProviderCalled: false,
        notificationProviderCalled: false,
        providerCredentialCreated: false,
        providerJobCreated: false,
        outboxSendCreated: false,
        reportCreated: false,
        reportReleased: false,
        approvalCreated: false,
        missionCreated: false,
        monitorRunTriggered: false,
        monitorResultCreated: false,
        sourceMutationCreated: false,
        generatedNotificationProseCreated: false,
        generatedProseCreated: false,
      },
    });
  });

  it("rejects invalid company keys before calling the service", async () => {
    const getExternalProviderBoundary = vi.fn();
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerExternalProviderBoundaryRoutes(app, {
      externalProviderBoundaryService: { getExternalProviderBoundary },
    });

    const response = await app.inject({
      method: "GET",
      url: "/external-provider-boundary/companies/BadCompany",
    });

    expect(response.statusCode).toBe(400);
    expect(getExternalProviderBoundary).not.toHaveBeenCalled();
  });
});
