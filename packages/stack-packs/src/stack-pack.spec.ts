import { describe, expect, it } from "vitest";
import { nextjsVercelPack } from "./packs/nextjs-vercel";

describe("stack packs", () => {
  it("exports the example Next.js pack", () => {
    expect(nextjsVercelPack.id).toBe("nextjs-vercel");
    expect(nextjsVercelPack.supportedMissionTypes).toContain("build");
  });
});
