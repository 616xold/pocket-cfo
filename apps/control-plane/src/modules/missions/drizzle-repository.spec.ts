import { afterAll, beforeEach, describe, expect, it } from "vitest";
import {
  buildMissionFixture,
  proofBundlePlaceholderFixture,
} from "@pocket-cto/testkit";
import {
  closeTestDatabase,
  createTestDb,
  resetTestDatabase,
} from "../../test/database";
import { DrizzleMissionRepository } from "./drizzle-repository";

const db = createTestDb();

describe("DrizzleMissionRepository", () => {
  const repository = new DrizzleMissionRepository(db);

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("persists missions, tasks, and proof bundle artifacts", async () => {
    const missionSpec = buildMissionFixture();

    const created = await repository.transaction(async (session) => {
      const mission = await repository.createMission(
        {
          type: missionSpec.type,
          title: missionSpec.title,
          objective: missionSpec.objective,
          sourceKind: "manual_text",
          sourceRef: null,
          createdBy: "operator",
          primaryRepo: missionSpec.repos[0] ?? null,
          spec: missionSpec,
        },
        session,
      );

      await repository.addMissionInput(
        {
          missionId: mission.id,
          rawText: missionSpec.objective,
          compilerName: "stub-compiler",
          compilerVersion: "0.1.0",
          compilerConfidence: 30,
          compilerOutput: missionSpec as unknown as Record<string, unknown>,
        },
        session,
      );

      const plannerTask = await repository.createTask(
        {
          missionId: mission.id,
          role: "planner",
          sequence: 0,
          status: "pending",
        },
        session,
      );

      const executorTask = await repository.createTask(
        {
          missionId: mission.id,
          role: "executor",
          sequence: 1,
          status: "pending",
          dependsOnTaskId: plannerTask.id,
        },
        session,
      );

      const proofBundle = proofBundlePlaceholderFixture(mission.id);
      const proofArtifact = await repository.saveProofBundle(
        proofBundle,
        session,
      );

      return {
        mission,
        executorTask,
        plannerTask,
        proofArtifact,
      };
    });

    const storedMission = await repository.getMissionById(created.mission.id);
    const storedTasks = await repository.getTasksByMissionId(
      created.mission.id,
    );
    const storedProofBundle = await repository.getProofBundleByMissionId(
      created.mission.id,
    );

    expect(storedMission?.title).toBe(missionSpec.title);
    expect(storedTasks.map((task) => task.role)).toEqual([
      "planner",
      "executor",
    ]);
    expect(created.executorTask.dependsOnTaskId).toBe(created.plannerTask.id);
    expect(created.proofArtifact.kind).toBe("proof_bundle_manifest");
    expect(storedProofBundle?.missionId).toBe(created.mission.id);
    expect(storedProofBundle?.status).toBe("placeholder");
  });
});
