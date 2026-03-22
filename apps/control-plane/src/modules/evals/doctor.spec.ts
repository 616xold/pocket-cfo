import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { EvalEnvSchema } from "@pocket-cto/config";
import { describe, expect, it } from "vitest";
import { createEvalDoctorReport, formatEvalDoctorReport } from "./doctor";

describe("eval doctor", () => {
  it("reports dry-run-required state when the live gate is incomplete", () => {
    const report = createEvalDoctorReport({
      env: EvalEnvSchema.parse({
        EVALS_ENABLED: false,
      }),
      resultsDirectory: "/tmp/evals-results",
    });

    expect(report.apiKey.present).toBe(false);
    expect(report.backend).toBe("openai_responses");
    expect(report.defaultMode).toBe("dry-run");
    expect(report.defaultRunBehavior).toBe("dry-run-required");

    const text = formatEvalDoctorReport(report);

    expect(text).toContain("Backend: openai_responses");
    expect(text).toContain("OPENAI_API_KEY: missing");
    expect(text).toContain("OPENAI_API_KEY source: unavailable");
    expect(text).toContain("EVALS_ENABLED: false");
    expect(text).toContain("Transport: openai_responses_api");
    expect(text).toContain("Default mode: dry-run");
    expect(text).toContain("Results directory: /tmp/evals-results");
  });

  it("reports shell env sourcing without exposing the full API key", () => {
    const report = createEvalDoctorReport({
      cwd: "/tmp",
      env: EvalEnvSchema.parse({
        EVALS_ENABLED: true,
        OPENAI_API_KEY: "sk-test-abcdef1234",
      }),
      rawEnv: {
        OPENAI_API_KEY: "sk-test-abcdef1234",
      },
      resultsDirectory: "/tmp/evals-results",
    });

    expect(report.apiKey.present).toBe(true);
    expect(report.apiKey.masked).toBe("***1234");
    expect(report.apiKey.source).toBe("shell env");
    expect(report.defaultMode).toBe("live");
    expect(report.defaultRunBehavior).toBe("live");

    const text = formatEvalDoctorReport(report);

    expect(text).toContain("OPENAI_API_KEY: present (***1234)");
    expect(text).toContain("OPENAI_API_KEY source: shell env");
    expect(text).toContain("EVALS_ENABLED: true");
    expect(text).toContain("Default mode: live");
    expect(text).not.toContain("sk-test-abcdef1234");
  });

  it("detects a key loaded from the local .env file", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "pocket-cto-evals-doctor-"));
    await writeFile(cwd + "/.env", "OPENAI_API_KEY=sk-test-loaded9999\n", "utf8");

    const report = createEvalDoctorReport({
      cwd,
      env: EvalEnvSchema.parse({
        EVALS_ENABLED: true,
        OPENAI_API_KEY: "sk-test-loaded9999",
      }),
      rawEnv: {},
      resultsDirectory: "/tmp/evals-results",
    });

    expect(report.apiKey.source).toBe("loaded .env");
  });

  it("reports codex_subscription readiness without requiring an API key", () => {
    const report = createEvalDoctorReport({
      env: EvalEnvSchema.parse({
        CODEX_APP_SERVER_COMMAND: process.execPath,
        EVAL_BACKEND: "codex_subscription",
        EVALS_ENABLED: true,
      }),
      resultsDirectory: "/tmp/evals-results",
    });

    expect(report.backend).toBe("codex_subscription");
    expect(report.codex?.binary.status).toBe("present");
    expect(report.codex?.authVerification.status).toBe("unverified");
    expect(report.defaultMode).toBe("live");

    const text = formatEvalDoctorReport(report);

    expect(text).toContain("Backend: codex_subscription");
    expect(text).toContain("Transport: codex_app_server");
    expect(text).toContain("OPENAI_API_KEY: missing (unused for current backend)");
    expect(text).toContain("Codex binary: present");
    expect(text).toContain("Auth verification: unverified");
    expect(text).toContain("A live smoke is still required");
  });

  it("reports unavailable auth verification when the codex binary is absent", () => {
    const report = createEvalDoctorReport({
      env: EvalEnvSchema.parse({
        CODEX_APP_SERVER_COMMAND: "this-command-should-not-exist-pocket-cto",
        EVAL_BACKEND: "codex_subscription",
        EVALS_ENABLED: true,
      }),
      resultsDirectory: "/tmp/evals-results",
    });

    expect(report.codex?.binary.status).toBe("absent");
    expect(report.codex?.authVerification.status).toBe("unavailable");

    const text = formatEvalDoctorReport(report);

    expect(text).toContain(
      "Codex binary: absent (this-command-should-not-exist-pocket-cto)",
    );
    expect(text).toContain("Auth verification: unavailable");
  });

  it("surfaces the latest saved codex proof when a prior smoke succeeded", async () => {
    const resultsDirectory = await mkdtemp(
      join(tmpdir(), "pocket-cto-codex-doctor-results-"),
    );
    await writeFile(
      join(resultsDirectory, "20260322T120000Z-planner.jsonl"),
      `${JSON.stringify({
        backend: "codex_subscription",
        candidate: {
          model: "gpt-5.4",
          output: "candidate output",
          provider: {
            backend: "codex_subscription",
            codexVersion: "2.3.4",
            proofMode: "local_codex_subscription",
            provider: "codex-subscription",
            requestId: null,
            requestedModel: "gpt-5.4",
            resolvedModel: "gpt-5.4",
            responseId: null,
            threadId: "thread_eval_1",
            transport: "codex_app_server",
            turnId: "turn_eval_1",
            usage: null,
            userAgent: "codex/2.3.4",
          },
          text: "candidate output",
        },
        combined: {
          overallScore: 4.1,
          scores: {
            actionability: 4,
            clarity: 4,
            constraintCompliance: 4.5,
            evidenceReadiness: 4,
          },
        },
        completedAt: "2026-03-22T12:00:00.000Z",
        grader: {
          model: "gpt-5.4-mini",
          notes: [],
          overallScore: 4.1,
          provider: null,
          scores: {
            actionability: 4,
            clarity: 4,
            constraintCompliance: 4.5,
            evidenceReadiness: 4,
          },
          verdict: "strong",
        },
        itemId: "planner-passkeys-readonly",
        mode: "live",
        notes: [],
        prompt: {
          sha256: "abc",
          source: "planner-prompt.ts",
          text: "prompt body",
          version: "planner-prompt.v1",
        },
        provenance: {
          branchName: "main",
          datasetName: "planner",
          gitSha: "abc123def456",
          promptVersion: "planner-prompt.v1",
        },
        reference: null,
        rubric: {
          path: "evals/rubrics/quality-rubric.md",
          sha256: "def",
        },
        rule: {
          checks: {
            passed: 4,
            total: 5,
          },
          notes: [],
          scores: {
            actionability: 4,
            clarity: 4,
            constraintCompliance: 4.5,
            evidenceReadiness: 4,
          },
        },
        startedAt: "2026-03-22T11:59:00.000Z",
        target: "planner",
        timestamp: "2026-03-22T12:00:00.000Z",
      })}\n`,
      "utf8",
    );

    const report = createEvalDoctorReport({
      env: EvalEnvSchema.parse({
        CODEX_APP_SERVER_COMMAND: process.execPath,
        EVAL_BACKEND: "codex_subscription",
        EVALS_ENABLED: true,
      }),
      resultsDirectory,
    });

    expect(report.codex?.authVerification.status).toBe("verified");

    const text = formatEvalDoctorReport(report);

    expect(text).toContain("Auth verification: verified");
    expect(text).toContain(
      "Latest saved Codex proof: 20260322T120000Z-planner.jsonl @ 2026-03-22T12:00:00.000Z",
    );
    expect(text).toContain(
      "Latest proof ids: thread=thread_eval_1, turn=turn_eval_1",
    );
  });
});
