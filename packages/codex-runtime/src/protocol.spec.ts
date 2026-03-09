import { describe, expect, it } from "vitest";
import { TurnStartParamsSchema } from "./protocol";

describe("codex runtime protocol types", () => {
  it("parses a simple turn start payload", () => {
    const parsed = TurnStartParamsSchema.parse({
      threadId: "thr_123",
      input: [{ type: "text", text: "Run tests" }],
    });

    expect(parsed.threadId).toBe("thr_123");
  });
});
