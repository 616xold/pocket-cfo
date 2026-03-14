import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { EvalEnvSchema } from "@pocket-cto/config";
import { describe, expect, it } from "vitest";
import { runPlannerSmokeCommand } from "./smoke";

describe("planner smoke eval", () => {
  it("refuses to run when live mode is not truly enabled", async () => {
    const outputDirectory = await mkdtemp(join(tmpdir(), "pocket-cto-evals-"));

    await expect(
      runPlannerSmokeCommand({
        env: EvalEnvSchema.parse({
          OPENAI_EVALS_ENABLED: false,
        }),
        outputDirectory,
      }),
    ).rejects.toThrow(
      "Live evals are disabled. Set OPENAI_EVALS_ENABLED=true or rerun with --dry-run.",
    );
  });
});
