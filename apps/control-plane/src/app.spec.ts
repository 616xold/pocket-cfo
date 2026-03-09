import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "./app";
import { createInMemoryContainer } from "./bootstrap";

const unknownMissionId = "11111111-1111-4111-8111-111111111111";

describe("control-plane app", () => {
  const apps: FastifyInstance[] = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("POST /missions/text returns 201 with mission, tasks, and a proof bundle placeholder", async () => {
    const app = await createTestApp(apps);

    const response = await app.inject({
      method: "POST",
      url: "/missions/text",
      payload: {
        text: "Implement passkeys for sign-in",
        requestedBy: "operator",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      mission: {
        type: "build",
        status: "queued",
        title: "Implement passkeys for sign-in",
        objective: "Implement passkeys for sign-in",
        sourceKind: "manual_text",
        createdBy: "operator",
      },
      tasks: [
        { role: "planner", sequence: 0, status: "pending" },
        {
          role: "executor",
          sequence: 1,
          status: "pending",
        },
      ],
      proofBundle: {
        status: "placeholder",
        objective: "Implement passkeys for sign-in",
        changeSummary: "",
        verificationSummary: "",
        riskSummary: "",
        rollbackSummary: "",
        decisionTrace: [],
        artifactIds: [],
        replayEventCount: 0,
      },
    });
  });

  it("POST /missions/text returns 400 for an invalid body", async () => {
    const app = await createTestApp(apps);

    const response = await app.inject({
      method: "POST",
      url: "/missions/text",
      payload: {
        text: "",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: {
        code: "invalid_request",
        message: "Invalid request",
        details: [
          {
            path: "text",
            message: "String must contain at least 1 character(s)",
          },
        ],
      },
    });
  });

  it("GET /missions/:missionId returns mission metadata, ordered tasks, and the proof bundle placeholder", async () => {
    const app = await createTestApp(apps);
    const created = await createMission(app);

    const response = await app.inject({
      method: "GET",
      url: `/missions/${created.mission.id}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      mission: {
        id: created.mission.id,
        status: "queued",
        title: "Implement passkeys for sign-in",
      },
      tasks: [
        { sequence: 0, role: "planner" },
        { sequence: 1, role: "executor" },
      ],
      proofBundle: {
        missionId: created.mission.id,
        status: "placeholder",
      },
    });
  });

  it("GET /missions/:missionId returns 400 for an invalid mission id", async () => {
    const app = await createTestApp(apps);

    const response = await app.inject({
      method: "GET",
      url: "/missions/not-a-uuid",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: {
        code: "invalid_request",
        message: "Invalid request",
        details: [
          {
            path: "missionId",
            message: "Invalid uuid",
          },
        ],
      },
    });
  });

  it("GET /missions/:missionId returns 404 for an unknown mission id", async () => {
    const app = await createTestApp(apps);

    const response = await app.inject({
      method: "GET",
      url: `/missions/${unknownMissionId}`,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: {
        code: "mission_not_found",
        message: "Mission not found",
      },
    });
  });

  it("GET /missions/:missionId/events returns ordered replay events", async () => {
    const app = await createTestApp(apps);
    const created = await createMission(app);

    const response = await app.inject({
      method: "GET",
      url: `/missions/${created.mission.id}/events`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject([
      { sequence: 1, type: "mission.created" },
      { sequence: 2, type: "task.created" },
      { sequence: 3, type: "task.created" },
      {
        sequence: 4,
        type: "mission.status_changed",
        payload: {
          from: "planned",
          to: "queued",
          reason: "tasks_materialized",
        },
      },
      { sequence: 5, type: "artifact.created" },
    ]);
  });

  it("GET /missions/:missionId/events returns 400 for an invalid mission id", async () => {
    const app = await createTestApp(apps);

    const response = await app.inject({
      method: "GET",
      url: "/missions/not-a-uuid/events",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: {
        code: "invalid_request",
        message: "Invalid request",
        details: [
          {
            path: "missionId",
            message: "Invalid uuid",
          },
        ],
      },
    });
  });

  it("GET /missions/:missionId/events returns 404 for an unknown mission id", async () => {
    const app = await createTestApp(apps);

    const response = await app.inject({
      method: "GET",
      url: `/missions/${unknownMissionId}/events`,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: {
        code: "mission_not_found",
        message: "Mission not found",
      },
    });
  });
});

async function createTestApp(apps: FastifyInstance[]) {
  const app = await buildApp({
    container: createInMemoryContainer(),
  });
  apps.push(app);
  return app;
}

async function createMission(app: FastifyInstance) {
  const response = await app.inject({
    method: "POST",
    url: "/missions/text",
    payload: {
      text: "Implement passkeys for sign-in",
      requestedBy: "operator",
    },
  });

  expect(response.statusCode).toBe(201);

  return response.json() as {
    mission: {
      id: string;
    };
  };
}
