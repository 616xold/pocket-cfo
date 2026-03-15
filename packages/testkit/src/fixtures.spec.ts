import { describe, expect, it } from "vitest";
import {
  buildMissionFixture,
  proofBundlePlaceholderFixture,
} from "./fixtures";

describe("test fixtures", () => {
  it("creates a build mission fixture", () => {
    const mission = buildMissionFixture();
    expect(mission.type).toBe("build");
    expect(mission.repos.length).toBeGreaterThan(0);
  });

  it("creates a proof-bundle placeholder fixture with the current domain shape", () => {
    const missionId = "11111111-1111-4111-8111-111111111111";
    const proofBundle = proofBundlePlaceholderFixture(missionId);

    expect(proofBundle).toMatchObject({
      missionId,
      missionTitle: "",
      targetRepoFullName: null,
      branchName: null,
      pullRequestNumber: null,
      pullRequestUrl: null,
      validationSummary: "",
      latestApproval: null,
      status: "placeholder",
    });
    expect(proofBundle.evidenceCompleteness.status).toBe("missing");
    expect(proofBundle.artifacts).toEqual([]);
    expect(proofBundle.timestamps.latestArtifactAt).toBeNull();
  });
});
