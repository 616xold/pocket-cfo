import { describe, expect, it } from "vitest";

describe("web api module", () => {
  it("keeps the default control-plane URL stable", async () => {
    const mod = await import("./api");
    expect(typeof mod.getMissionDetail).toBe("function");
  });
});
