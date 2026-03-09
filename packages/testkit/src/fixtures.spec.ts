import { describe, expect, it } from "vitest";
import { buildMissionFixture } from "./fixtures";

describe("test fixtures", () => {
  it("creates a build mission fixture", () => {
    const mission = buildMissionFixture();
    expect(mission.type).toBe("build");
    expect(mission.repos.length).toBeGreaterThan(0);
  });
});
