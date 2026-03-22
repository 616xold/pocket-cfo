import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { formatEvalCompareReport, runEvalCompareCommand } from "./compare";

describe("eval compare helper", () => {
  it("compares stored result files and reports score movement and models", async () => {
    const outputDirectory = await mkdtemp(join(tmpdir(), "pocket-cto-evals-"));
    const fileA = join(outputDirectory, "a.jsonl");
    const fileB = join(outputDirectory, "b.jsonl");

    await writeFile(
      fileA,
      `${JSON.stringify(buildRecord({
        branchName: "main",
        candidateModel: "gpt-5-mini",
        gitSha: "aaaabbbbcccc",
        graderModel: "gpt-5-mini",
        overallScore: 3.5,
        scores: {
          actionability: 3.5,
          clarity: 3,
          constraintCompliance: 4,
          evidenceReadiness: 3.5,
        },
      }))}\n`,
      "utf8",
    );
    await writeFile(
      fileB,
      `${JSON.stringify(buildRecord({
        branchName: "main",
        candidateModel: "gpt-5-mini",
        gitSha: "dddd1111eeee",
        graderModel: "gpt-5-mini",
        overallScore: 4.4,
        scores: {
          actionability: 4.5,
          clarity: 4.2,
          constraintCompliance: 4.4,
          evidenceReadiness: 4.5,
        },
      }))}\n`,
      "utf8",
    );

    const report = await runEvalCompareCommand(["--a", fileA, "--b", fileB]);
    const text = formatEvalCompareReport(report);

    expect(report.overallDelta).toBe(0.9);
    expect(report.dimensionDeltas.actionability).toBe(1);
    expect(text).toContain("Overall score: 3.5 -> 4.4 (+0.9)");
    expect(text).toContain(
      "A: a.jsonl (openai_responses:gpt-5-mini / openai_responses:gpt-5-mini)",
    );
    expect(text).toContain(
      "B: b.jsonl (openai_responses:gpt-5-mini / openai_responses:gpt-5-mini)",
    );
    expect(text).toContain(
      "A proof: candidate openai_responses via transport unavailable (proof unavailable; no proof ids); grader openai_responses via transport unavailable (proof unavailable; no proof ids)",
    );
  });

  it("surfaces backend proof differences plainly when comparing api and codex runs", async () => {
    const report = formatEvalCompareReport({
      a: {
        averageOverallScore: 4.2,
        branchName: "main",
        candidateBackend: "openai_responses",
        candidateModel: "gpt-5.4",
        candidateProof: {
          backends: ["openai_responses"],
          codexVersions: [],
          calls: 1,
          proofModes: ["api_key"],
          responseIds: ["resp_123"],
          threadIds: [],
          transports: ["openai_responses_api"],
          turnIds: [],
          usage: null,
        },
        datasetNames: ["planner"],
        fileName: "a.jsonl",
        gitSha: "aaaabbbbcccc",
        graderBackend: "openai_responses",
        graderModel: "gpt-5.4-mini",
        graderProof: {
          backends: ["openai_responses"],
          codexVersions: [],
          calls: 1,
          proofModes: ["api_key"],
          responseIds: ["resp_456"],
          threadIds: [],
          transports: ["openai_responses_api"],
          turnIds: [],
          usage: null,
        },
      },
      b: {
        averageOverallScore: 4.4,
        branchName: "main",
        candidateBackend: "codex_subscription",
        candidateModel: "gpt-5.4",
        candidateProof: {
          backends: ["codex_subscription"],
          codexVersions: ["2.3.4"],
          calls: 1,
          proofModes: ["local_codex_subscription"],
          responseIds: [],
          threadIds: ["thread_eval_1"],
          transports: ["codex_app_server"],
          turnIds: ["turn_eval_1"],
          usage: null,
        },
        datasetNames: ["planner"],
        fileName: "b.jsonl",
        gitSha: "dddd1111eeee",
        graderBackend: "codex_subscription",
        graderModel: "gpt-5.4-mini",
        graderProof: {
          backends: ["codex_subscription"],
          codexVersions: ["2.3.4"],
          calls: 1,
          proofModes: ["local_codex_subscription"],
          responseIds: [],
          threadIds: ["thread_eval_2"],
          transports: ["codex_app_server"],
          turnIds: ["turn_eval_2"],
          usage: null,
        },
      },
      dimensionDeltas: {
        actionability: 0.4,
        clarity: 0.2,
        constraintCompliance: 0.3,
        evidenceReadiness: 0.1,
      },
      overallDelta: 0.2,
    });

    expect(report).toContain(
      "A proof: candidate openai_responses via openai_responses_api (api_key; response ids=1); grader openai_responses via openai_responses_api (api_key; response ids=1)",
    );
    expect(report).toContain(
      "B proof: candidate codex_subscription via codex_app_server (local_codex_subscription; thread ids=1, turn ids=1); grader codex_subscription via codex_app_server (local_codex_subscription; thread ids=1, turn ids=1)",
    );
  });
});

function buildRecord(input: {
  branchName: string;
  candidateModel: string;
  gitSha: string;
  graderModel: string;
  overallScore: number;
  scores: {
    actionability: number;
    clarity: number;
    constraintCompliance: number;
    evidenceReadiness: number;
  };
}) {
  return {
    backend: "openai_responses",
    candidate: {
      model: input.candidateModel,
      output: "candidate output",
      provider: null,
      text: "candidate output",
    },
    combined: {
      overallScore: input.overallScore,
      scores: input.scores,
    },
    completedAt: "2026-03-14T02:00:00.000Z",
    grader: {
      model: input.graderModel,
      notes: [],
      overallScore: input.overallScore,
      provider: null,
      scores: input.scores,
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
      branchName: input.branchName,
      datasetName: "planner",
      gitSha: input.gitSha,
      promptVersion: "planner-prompt.v1",
    },
    reference: null,
    rubric: {
      path: "evals/rubrics/quality-rubric.md",
      sha256: "def",
    },
    rule: {
      checks: {
        passed: 5,
        total: 5,
      },
      notes: [],
      scores: input.scores,
    },
    startedAt: "2026-03-14T01:59:00.000Z",
    target: "planner",
    timestamp: "2026-03-14T02:00:00.000Z",
  };
}
