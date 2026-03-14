import { loadEvalEnv, type EvalEnv } from "@pocket-cto/config";
import { maskApiKey, resolveEvalLiveGuardState } from "./config";
import { getEvalResultsDirectory } from "./paths";

export type EvalDoctorReport = {
  apiKey: {
    masked: string | null;
    present: boolean;
  };
  candidateModel: string;
  defaultMode: "dry-run" | "live";
  defaultRunBehavior: "dry-run-required" | "live";
  evalsEnabled: boolean;
  graderModel: string;
  referenceModel: string;
  resultsDirectory: string;
};

export function createEvalDoctorReport(input?: {
  env?: EvalEnv;
  resultsDirectory?: string;
}): EvalDoctorReport {
  const env = input?.env ?? loadEvalEnv();
  const liveGuard = resolveEvalLiveGuardState(env);

  return {
    apiKey: {
      masked: maskApiKey(liveGuard.apiKey),
      present: liveGuard.apiKeyPresent,
    },
    candidateModel: env.OPENAI_EVAL_MODEL,
    defaultMode: liveGuard.defaultMode,
    defaultRunBehavior: liveGuard.liveReady ? "live" : "dry-run-required",
    evalsEnabled: liveGuard.evalsEnabled,
    graderModel: env.OPENAI_EVAL_GRADER_MODEL,
    referenceModel: env.OPENAI_EVAL_REFERENCE_MODEL,
    resultsDirectory: input?.resultsDirectory ?? getEvalResultsDirectory(),
  };
}

export function formatEvalDoctorReport(report: EvalDoctorReport) {
  const lines = [
    "Eval doctor",
    `OPENAI_API_KEY: ${report.apiKey.present ? `present (${report.apiKey.masked})` : "missing"}`,
    `OPENAI_EVALS_ENABLED: ${report.evalsEnabled ? "true" : "false"}`,
    `Candidate model: ${report.candidateModel}`,
    `Grader model: ${report.graderModel}`,
    `Reference model: ${report.referenceModel}`,
    `Default mode: ${report.defaultMode}`,
    `Results directory: ${report.resultsDirectory}`,
  ];

  if (report.defaultRunBehavior === "dry-run-required") {
    lines.push(
      "Live evals are not fully enabled, so standard eval commands still need --dry-run until OPENAI_API_KEY is present and OPENAI_EVALS_ENABLED=true.",
    );
  }

  return lines.join("\n").concat("\n");
}
