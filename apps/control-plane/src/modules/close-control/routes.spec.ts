import Fastify from "fastify";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerHttpErrorHandler } from "../../lib/http-errors";
import { registerCloseControlRoutes } from "./routes";

describe("close-control routes", () => {
  const apps: Array<ReturnType<typeof Fastify>> = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("parses companyKey and returns the deterministic checklist read model", async () => {
    const getChecklist = vi.fn().mockResolvedValue({
      companyKey: "acme",
      aggregateStatus: "ready_for_review",
      items: [],
      runtimeActionBoundary: {
        runtimeCodexUsed: false,
        monitorRunTriggered: false,
        missionCreated: false,
      },
    });
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerCloseControlRoutes(app, {
      closeControlService: { getChecklist },
    });

    const response = await app.inject({
      method: "GET",
      url: "/close-control/companies/acme/checklist",
    });

    expect(response.statusCode).toBe(200);
    expect(getChecklist).toHaveBeenCalledWith("acme");
    expect(response.json()).toMatchObject({
      companyKey: "acme",
      aggregateStatus: "ready_for_review",
      runtimeActionBoundary: {
        runtimeCodexUsed: false,
        monitorRunTriggered: false,
        missionCreated: false,
      },
    });
  });

  it("rejects invalid company keys before calling the service", async () => {
    const getChecklist = vi.fn();
    const app = Fastify();
    apps.push(app);
    registerHttpErrorHandler(app);
    await registerCloseControlRoutes(app, {
      closeControlService: { getChecklist },
    });

    const response = await app.inject({
      method: "GET",
      url: "/close-control/companies/BadCompany/checklist",
    });

    expect(response.statusCode).toBe(400);
    expect(getChecklist).not.toHaveBeenCalled();
  });
});
