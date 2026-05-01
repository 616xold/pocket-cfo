import Fastify from "fastify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerHttpErrorHandler } from "../../lib/http-errors";
import { registerCloseControlCertificationSafetyRoutes } from "./routes";

describe("close-control certification-safety routes", () => {
  const apps: Array<ReturnType<typeof Fastify>> = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("parses companyKey and returns the internal certification-safety read model", async () => {
    const runtimeActionBoundary = buildRuntimeActionBoundaryFixture();
    const getCertificationSafety = vi.fn().mockResolvedValue({
      companyKey: "acme",
      generatedAt: "2026-05-01T10:00:00.000Z",
      aggregateStatus: "needs_human_review_before_certification_safety",
      closeControlCertificationSafetyTargets: [
        {
          targetKey: "certification-boundary-safety",
          targetFamily: "certification_boundary_safety",
          status: "needs_human_review_before_certification_safety",
        },
      ],
      runtimeActionBoundary,
    });
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerCloseControlCertificationSafetyRoutes(app, {
      closeControlCertificationSafetyService: { getCertificationSafety },
    });

    const response = await app.inject({
      method: "GET",
      url: "/close-control/companies/acme/certification-safety",
    });

    expect(response.statusCode).toBe(200);
    expect(getCertificationSafety).toHaveBeenCalledWith("acme");
    expect(response.json()).toMatchObject({
      companyKey: "acme",
      aggregateStatus: "needs_human_review_before_certification_safety",
      runtimeActionBoundary,
    });
  });

  it("rejects invalid company keys before calling the service", async () => {
    const getCertificationSafety = vi.fn();
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerCloseControlCertificationSafetyRoutes(app, {
      closeControlCertificationSafetyService: { getCertificationSafety },
    });

    const response = await app.inject({
      method: "GET",
      url: "/close-control/companies/BadCompany/certification-safety",
    });

    expect(response.statusCode).toBe(400);
    expect(getCertificationSafety).not.toHaveBeenCalled();
  });
});

function buildRuntimeActionBoundaryFixture() {
  return {
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
    assuranceCreated: false,
    legalOpinionCreated: false,
    auditOpinionCreated: false,
    missionCreated: false,
    monitorRunTriggered: false,
    monitorResultCreated: false,
    sourceMutationCreated: false,
    generatedProseCreated: false,
    generatedNotificationProseCreated: false,
    accountingWriteCreated: false,
    bankWriteCreated: false,
    taxFilingCreated: false,
    legalAdviceGenerated: false,
    policyAdviceGenerated: false,
    paymentInstructionCreated: false,
    collectionInstructionCreated: false,
    customerContactInstructionCreated: false,
    autonomousActionCreated: false,
    summary:
      "F6T certification-safety generation is deterministic, read-only, internal, and no certification occurred.",
    replayImplication:
      "The first F6T certification-safety result is derived from current stored/read posture and is not persisted as a mission replay event.",
  };
}
