import { describe, expect, it } from "vitest";
import { missions, missionTasks } from "./schema";

describe("db schema exports", () => {
  it("exposes core tables", () => {
    expect(missions).toBeDefined();
    expect(missionTasks).toBeDefined();
  });
});
