import { describe, expect, it, vi } from "vitest";
import { EvidenceService } from "../evidence/service";
import { StubMissionCompiler } from "../missions/compiler";
import { InMemoryMissionRepository } from "../missions/repository";
import { MissionService } from "../missions/service";
import { InMemoryReplayRepository } from "../replay/repository";
import { ReplayService } from "../replay/service";
import { taskStatusChangeReasons } from "./events";
import { OrchestratorService } from "./service";
import { OrchestratorWorker } from "./worker";

describe("OrchestratorWorker", () => {
  it("claims runnable tasks one tick at a time in single-run mode", async () => {
    const { missionService, worker } = createHarness();
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
        sequence: 0,
        status: "claimed",
        attemptCount: 1,
      },
    });

    const detailAfterFirstTick = await missionService.getMissionDetail(
      created.mission.id,
    );
    expect(detailAfterFirstTick.tasks).toMatchObject([
      {
        id: plannerTask?.id,
        role: "planner",
        status: "claimed",
        attemptCount: 1,
      },
      {
        id: executorTask?.id,
        role: "executor",
        status: "pending",
        attemptCount: 0,
      },
    ]);

    const blockedTick = await worker.run({
      log,
      pollIntervalMs: 1,
      runOnce: true,
    });
    expect(blockedTick).toEqual({ kind: "idle" });

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
        sequence: 1,
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

    expect(log.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "worker.tick",
        outcome: "claimed",
        taskId: plannerTask?.id,
      }),
      "Worker claimed task",
    );
    expect(log.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "worker.tick",
        outcome: "idle",
      }),
      "Worker tick idle",
    );
    expect(log.error).not.toHaveBeenCalled();
  });
});

function createHarness() {
  const missionRepository = new InMemoryMissionRepository();
  const replayRepository = new InMemoryReplayRepository();
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
    worker: new OrchestratorWorker(orchestratorService),
  };
}
