import { describe, expect, it } from "vitest";
import { buildPinnedBackendArgv } from "./pinned-backend";

describe("buildPinnedBackendArgv", () => {
  it("appends the pinned backend when no override is supplied", () => {
    expect(
      buildPinnedBackendArgv({
        argv: ["--limit", "1"],
        backend: "codex_subscription",
        commandName: "eval:smoke:planner:codex",
      }),
    ).toEqual(["--limit", "1", "--backend", "codex_subscription"]);
  });

  it("rejects conflicting backend overrides", () => {
    expect(() =>
      buildPinnedBackendArgv({
        argv: ["--backend", "openai_responses"],
        backend: "codex_subscription",
        commandName: "eval:smoke:planner:codex",
      }),
    ).toThrow(
      "eval:smoke:planner:codex is pinned to codex_subscription and cannot run with openai_responses.",
    );
  });
});
