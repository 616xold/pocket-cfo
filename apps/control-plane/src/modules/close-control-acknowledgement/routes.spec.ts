import Fastify from "fastify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerHttpErrorHandler } from "../../lib/http-errors";
import { registerCloseControlAcknowledgementRoutes } from "./routes";

describe("close-control acknowledgement routes", () => {
  const apps: Array<ReturnType<typeof Fastify>> = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("parses companyKey and returns the internal acknowledgement-readiness read model", async () => {
    const getAcknowledgementReadiness = vi.fn().mockResolvedValue({
      companyKey: "acme",
      generatedAt: "2026-04-28T12:00:00.000Z",
      aggregateStatus: "ready_for_acknowledgement",
      acknowledgementTargets: [
        {
          targetKey: "close-control:checklist-aggregate",
          targetKind: "checklist_aggregate",
          status: "ready_for_acknowledgement",
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
    await registerCloseControlAcknowledgementRoutes(app, {
      closeControlAcknowledgementService: { getAcknowledgementReadiness },
    });

    const response = await app.inject({
      method: "GET",
      url: "/close-control/companies/acme/acknowledgement-readiness",
    });

    expect(response.statusCode).toBe(200);
    expect(getAcknowledgementReadiness).toHaveBeenCalledWith("acme");
    expect(response.json()).toMatchObject({
      companyKey: "acme",
      aggregateStatus: "ready_for_acknowledgement",
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
    const getAcknowledgementReadiness = vi.fn();
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerCloseControlAcknowledgementRoutes(app, {
      closeControlAcknowledgementService: { getAcknowledgementReadiness },
    });

    const response = await app.inject({
      method: "GET",
      url: "/close-control/companies/BadCompany/acknowledgement-readiness",
    });

    expect(response.statusCode).toBe(400);
    expect(getAcknowledgementReadiness).not.toHaveBeenCalled();
  });
});
