import Fastify from "fastify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerHttpErrorHandler } from "../../lib/http-errors";
import { registerCloseControlCertificationBoundaryRoutes } from "./routes";

describe("close-control certification-boundary routes", () => {
  const apps: Array<ReturnType<typeof Fastify>> = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("parses companyKey and returns the internal certification-boundary read model", async () => {
    const getCertificationBoundary = vi.fn().mockResolvedValue({
      companyKey: "acme",
      generatedAt: "2026-04-29T19:55:00.000Z",
      aggregateStatus: "needs_human_review_before_certification_boundary",
      closeControlCertificationBoundaryTargets: [
        {
          targetKey: "review-summary-boundary",
          targetFamily: "review_summary_boundary",
          status: "needs_human_review_before_certification_boundary",
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
      },
    });
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerCloseControlCertificationBoundaryRoutes(app, {
      closeControlCertificationBoundaryService: { getCertificationBoundary },
    });

    const response = await app.inject({
      method: "GET",
      url: "/close-control/companies/acme/certification-boundary",
    });

    expect(response.statusCode).toBe(200);
    expect(getCertificationBoundary).toHaveBeenCalledWith("acme");
    expect(response.json()).toMatchObject({
      companyKey: "acme",
      aggregateStatus: "needs_human_review_before_certification_boundary",
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
      },
    });
  });

  it("rejects invalid company keys before calling the service", async () => {
    const getCertificationBoundary = vi.fn();
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerCloseControlCertificationBoundaryRoutes(app, {
      closeControlCertificationBoundaryService: { getCertificationBoundary },
    });

    const response = await app.inject({
      method: "GET",
      url: "/close-control/companies/BadCompany/certification-boundary",
    });

    expect(response.statusCode).toBe(400);
    expect(getCertificationBoundary).not.toHaveBeenCalled();
  });
});
