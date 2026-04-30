import Fastify from "fastify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerHttpErrorHandler } from "../../lib/http-errors";
import { registerExternalDeliveryHumanConfirmationBoundaryRoutes } from "./routes";

describe("external-delivery human-confirmation boundary routes", () => {
  const apps: Array<ReturnType<typeof Fastify>> = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("parses companyKey and returns the internal human-confirmation read model", async () => {
    const getHumanConfirmationBoundary = vi.fn().mockResolvedValue({
      companyKey: "acme",
      generatedAt: "2026-04-30T12:00:00.000Z",
      aggregateStatus: "needs_human_review_before_confirmation",
      deliveryGateTargets: [
        {
          targetKey: "delivery-readiness-confirmation-boundary",
          targetFamily: "delivery_readiness_confirmation_boundary",
          status: "needs_human_review_before_confirmation",
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
        reportCirculated: false,
        approvalCreated: false,
        certificationCreated: false,
        closeCompleteCreated: false,
        signOffCreated: false,
        attestationCreated: false,
        legalOpinionCreated: false,
        auditOpinionCreated: false,
        assuranceCreated: false,
        missionCreated: false,
        monitorRunTriggered: false,
        monitorResultCreated: false,
        sourceMutationCreated: false,
        generatedProseCreated: false,
        generatedNotificationProseCreated: false,
      },
    });
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerExternalDeliveryHumanConfirmationBoundaryRoutes(app, {
      externalDeliveryHumanConfirmationBoundaryService: {
        getHumanConfirmationBoundary,
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/external-delivery/companies/acme/human-confirmation-boundary",
    });

    expect(response.statusCode).toBe(200);
    expect(getHumanConfirmationBoundary).toHaveBeenCalledWith("acme");
    expect(response.json()).toMatchObject({
      companyKey: "acme",
      aggregateStatus: "needs_human_review_before_confirmation",
      runtimeActionBoundary: {
        runtimeCodexUsed: false,
        deliveryCreated: false,
        externalProviderCalled: false,
        notificationProviderCalled: false,
        providerCredentialCreated: false,
        providerJobCreated: false,
        outboxSendCreated: false,
        scheduledDeliveryCreated: false,
        autoSendConfigured: false,
        reportCreated: false,
        reportReleased: false,
        reportCirculated: false,
        approvalCreated: false,
        certificationCreated: false,
        closeCompleteCreated: false,
        signOffCreated: false,
        attestationCreated: false,
        legalOpinionCreated: false,
        auditOpinionCreated: false,
        assuranceCreated: false,
        missionCreated: false,
        monitorRunTriggered: false,
        monitorResultCreated: false,
        sourceMutationCreated: false,
        generatedProseCreated: false,
        generatedNotificationProseCreated: false,
      },
    });
  });

  it("rejects invalid company keys before calling the service", async () => {
    const getHumanConfirmationBoundary = vi.fn();
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerExternalDeliveryHumanConfirmationBoundaryRoutes(app, {
      externalDeliveryHumanConfirmationBoundaryService: {
        getHumanConfirmationBoundary,
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/external-delivery/companies/BadCompany/human-confirmation-boundary",
    });

    expect(response.statusCode).toBe(400);
    expect(getHumanConfirmationBoundary).not.toHaveBeenCalled();
  });
});
