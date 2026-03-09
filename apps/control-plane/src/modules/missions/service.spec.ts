import { describe, expect, it } from "vitest";
import { InMemoryMissionRepository } from "./repository";
import { StubMissionCompiler } from "./compiler";
import { InMemoryReplayRepository } from "../replay/repository";
import { ReplayService } from "../replay/service";
import { EvidenceService } from "../evidence/service";
import { MissionService } from "./service";

function createService() {
  const repository = new InMemoryMissionRepository();
  const replayRepository = new InMemoryReplayRepository();
  const replayService = new ReplayService(replayRepository, repository);
  const evidenceService = new EvidenceService();
  const compiler = new StubMissionCompiler();

  return {
    replayService,
    service: new MissionService(
      compiler,
      repository,
      replayService,
      evidenceService,
    ),
  };
}

describe("MissionService", () => {
  it("creates a mission, tasks, and replay events from text", async () => {
    const { service, replayService } = createService();

    const created = await service.createFromText({
      text: "Implement passkeys for sign-in",
      sourceKind: "manual_text",
      requestedBy: "operator",
    });

    expect(created.mission.title).toContain("Implement passkeys");
    expect(created.mission.status).toBe("queued");
    expect(created.tasks.length).toBe(2);
    expect(created.proofBundle.status).toBe("placeholder");

    const events = await replayService.listByMissionId(created.mission.id);
    expect(events.map((event) => event.type)).toEqual([
      "mission.created",
      "task.created",
      "task.created",
      "mission.status_changed",
      "artifact.created",
    ]);
    expect(events.map((event) => event.sequence)).toEqual([1, 2, 3, 4, 5]);
    expect(events[3]?.payload).toEqual({
      from: "planned",
      to: "queued",
      reason: "tasks_materialized",
    });
  });
});
