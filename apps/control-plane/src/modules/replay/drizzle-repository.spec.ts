import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { buildMissionFixture } from "@pocket-cto/testkit";
import { missions } from "@pocket-cto/db";
import {
  closeTestDatabase,
  createTestDb,
  resetTestDatabase,
} from "../../test/database";
import { DrizzleMissionRepository } from "../missions/drizzle-repository";
import { DrizzleReplayRepository } from "./drizzle-repository";

const db = createTestDb();

describe("DrizzleReplayRepository", () => {
  const missionRepository = new DrizzleMissionRepository(db);
  const repository = new DrizzleReplayRepository(db);

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("assigns deterministic mission-local ordinals", async () => {
    const missionSpec = buildMissionFixture();
    const storedMission = await missionRepository.createMission({
      type: missionSpec.type,
      title: missionSpec.title,
      objective: missionSpec.objective,
      sourceKind: "manual_text",
      sourceRef: null,
      createdBy: "operator",
      primaryRepo: missionSpec.repos[0] ?? null,
      spec: missionSpec,
    });

    const firstEvent = await repository.append({
      id: crypto.randomUUID(),
      missionId: storedMission.id,
      taskId: null,
      type: "mission.created",
      actor: "system",
      occurredAt: new Date("2026-03-08T04:00:00.000Z").toISOString(),
      payload: { title: storedMission.title },
    });

    const secondEvent = await repository.append({
      id: crypto.randomUUID(),
      missionId: storedMission.id,
      taskId: null,
      type: "artifact.created",
      actor: "system",
      occurredAt: new Date("2026-03-08T04:00:01.000Z").toISOString(),
      payload: { kind: "proof_bundle_manifest" },
    });

    const listedEvents = await repository.listByMissionId(storedMission.id);
    const [reloadedMission] = await db
      .select({
        replayCursor: missions.replayCursor,
      })
      .from(missions)
      .where(eq(missions.id, storedMission.id))
      .limit(1);

    expect(firstEvent.sequence).toBe(1);
    expect(secondEvent.sequence).toBe(2);
    expect(listedEvents.map((event) => event.sequence)).toEqual([1, 2]);
    expect(reloadedMission?.replayCursor).toBe(2);
  });
});
