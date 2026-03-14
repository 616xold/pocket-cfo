import { EvalEnvSchema } from "@pocket-cto/config";
import { describe, expect, it } from "vitest";
import { createEvalDoctorReport, formatEvalDoctorReport } from "./doctor";

describe("eval doctor", () => {
  it("reports dry-run-required state when the live gate is incomplete", () => {
    const report = createEvalDoctorReport({
      env: EvalEnvSchema.parse({
        OPENAI_EVALS_ENABLED: false,
      }),
      resultsDirectory: "/tmp/evals-results",
    });

    expect(report.apiKey.present).toBe(false);
    expect(report.defaultMode).toBe("dry-run");
    expect(report.defaultRunBehavior).toBe("dry-run-required");

    const text = formatEvalDoctorReport(report);

    expect(text).toContain("OPENAI_API_KEY: missing");
    expect(text).toContain("OPENAI_EVALS_ENABLED: false");
    expect(text).toContain("Default mode: dry-run");
    expect(text).toContain("Results directory: /tmp/evals-results");
  });

  it("reports live readiness without exposing the full API key", () => {
    const report = createEvalDoctorReport({
      env: EvalEnvSchema.parse({
        OPENAI_API_KEY: "sk-test-abcdef1234",
        OPENAI_EVALS_ENABLED: true,
      }),
      resultsDirectory: "/tmp/evals-results",
    });

    expect(report.apiKey.present).toBe(true);
    expect(report.apiKey.masked).toBe("***1234");
    expect(report.defaultMode).toBe("live");
    expect(report.defaultRunBehavior).toBe("live");

    const text = formatEvalDoctorReport(report);

    expect(text).toContain("OPENAI_API_KEY: present (***1234)");
    expect(text).toContain("OPENAI_EVALS_ENABLED: true");
    expect(text).toContain("Default mode: live");
    expect(text).not.toContain("sk-test-abcdef1234");
  });
});
