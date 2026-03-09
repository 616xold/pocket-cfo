import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  closeTestDatabase,
  createTestDb,
  resetTestDatabase,
} from "../../test/database";
import { EvidenceService } from "../evidence/service";
import { StubMissionCompiler } from "../missions/compiler";
import { DrizzleMissionRepository } from "../missions/drizzle-repository";
import { MissionService } from "../missions/service";
import { DrizzleReplayRepository } from "../replay/drizzle-repository";
import { ReplayService } from "../replay/service";
import { taskStatusChangeReasons } from "./events";
import { OrchestratorService } from "./service";
import { OrchestratorWorker } from "./worker";

const db = createTestDb();

describe("OrchestratorWorker (DB-backed)", () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("persists deterministic task claims and dependency-aware replay ordering", async () => {
    const { missionService, replayService, worker } = createHarness();
    const log = {
      error: vi.fn(),
      info: vi.fn(),
    };
    const created = await missionService.createFromText({
      text: "Implement passkeys for sign-in",
      sourceKind: "manual_text",
      requestedBy: "operator",
    });

    const plannerTask = created.tasks[0];
    const executorTask = created.tasks[1];
    expect(plannerTask?.role).toBe("planner");
    expect(executorTask?.role).toBe("executor");

    const firstTick = await worker.run({
      log,
      pollIntervalMs: 1,
      runOnce: true,
    });
    expect(firstTick).toMatchObject({
      kind: "claimed",
      task: {
        id: plannerTask?.id,
        role: "planner",
        status: "claimed",
        attemptCount: 1,
      },
    });

    const secondTick = await worker.run({
      log,
      pollIntervalMs: 1,
      runOnce: true,
    });
    expect(secondTick).toEqual({ kind: "idle" });

    await worker.transitionTaskStatus({
      reason: taskStatusChangeReasons.taskCompleted,
      taskId: plannerTask!.id,
      to: "succeeded",
    });

    const thirdTick = await worker.run({
      log,
      pollIntervalMs: 1,
      runOnce: true,
    });
    expect(thirdTick).toMatchObject({
      kind: "claimed",
      task: {
        id: executorTask?.id,
        role: "executor",
        status: "claimed",
        attemptCount: 1,
      },
    });

    const repeatedTick = await worker.run({
      log,
      pollIntervalMs: 1,
      runOnce: true,
    });
    expect(repeatedTick).toEqual({ kind: "idle" });

    const detail = await missionService.getMissionDetail(created.mission.id);
    expect(detail.tasks).toMatchObject([
      {
        id: plannerTask?.id,
        status: "succeeded",
        attemptCount: 1,
      },
      {
        id: executorTask?.id,
        status: "claimed",
        attemptCount: 1,
      },
    ]);

    const replayEvents = await replayService.getMissionEvents(created.mission.id);
    expect(replayEvents.map((event) => event.sequence)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    expect(replayEvents.map((event) => event.type)).toEqual([
      "mission.created",
      "task.created",
      "task.created",
      "mission.status_changed",
      "artifact.created",
      "task.status_changed",
      "task.status_changed",
      "task.status_changed",
    ]);
    expect(replayEvents[5]).toMatchObject({
      taskId: plannerTask?.id,
      payload: {
        from: "pending",
        to: "claimed",
        reason: "worker_claimed",
      },
    });
    expect(replayEvents[6]).toMatchObject({
      taskId: plannerTask?.id,
      payload: {
        from: "claimed",
        to: "succeeded",
        reason: "task_completed",
      },
    });
    expect(replayEvents[7]).toMatchObject({
      taskId: executorTask?.id,
      payload: {
        from: "pending",
        to: "claimed",
        reason: "worker_claimed",
      },
    });
  });
});

function createHarness() {
  const missionRepository = new DrizzleMissionRepository(db);
  const replayRepository = new DrizzleReplayRepository(db);
  const replayService = new ReplayService(replayRepository, missionRepository);
  const missionService = new MissionService(
    new StubMissionCompiler(),
    missionRepository,
    replayService,
    new EvidenceService(),
  );
  const orchestratorService = new OrchestratorService(
    missionRepository,
    replayService,
  );

  return {
    missionService,
    replayService,
    worker: new OrchestratorWorker(orchestratorService),
  };
}
