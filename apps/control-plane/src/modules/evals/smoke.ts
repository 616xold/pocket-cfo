import { type EvalEnv } from "@pocket-cto/config";
import type { EvalTarget } from "./dataset";
import { buildPinnedBackendArgv } from "./pinned-backend";
import { runEvalCommand } from "./run";
import type { EvalBackend, EvalProviderCallSummary } from "./types";

export async function runPlannerSmokeCommand(input?: {
  argv?: string[];
  env?: EvalEnv;
  outputDirectory?: string;
  requiredBackend?: EvalBackend;
}): Promise<Awaited<ReturnType<typeof runEvalCommand>>> {
  return runSmokeEvalCommand("planner", input);
}

export async function runExecutorSmokeCommand(input?: {
  argv?: string[];
  env?: EvalEnv;
  outputDirectory?: string;
  requiredBackend?: EvalBackend;
}): Promise<Awaited<ReturnType<typeof runEvalCommand>>> {
  return runSmokeEvalCommand("executor", input);
}

async function runSmokeEvalCommand(
  target: EvalTarget,
  input?: {
    argv?: string[];
    env?: EvalEnv;
    outputDirectory?: string;
    requiredBackend?: EvalBackend;
  },
) {
  const argv = input?.requiredBackend
    ? buildPinnedBackendArgv({
        argv: input?.argv ?? [],
        backend: input.requiredBackend,
        commandName: `${target} smoke eval`,
      })
    : (input?.argv ?? []);
  const summary = await runEvalCommand(
    [target, "--limit", "1", ...argv],
    {
      env: input?.env,
      outputDirectory: input?.outputDirectory,
      requireLive: true,
    },
  );

  if (input?.requiredBackend && summary.backend !== input.requiredBackend) {
    throw new Error(
      `${capitalize(target)} smoke eval expected backend ${input.requiredBackend} but ran with ${summary.backend}.`,
    );
  }

  const candidateProven = hasBackendProof(summary.live.candidate);
  const graderProven = hasBackendProof(summary.live.grader);

  if (!candidateProven && !graderProven) {
    throw new Error(
      `${capitalize(target)} smoke eval did not capture any backend proof metadata. Live smoke requires response ids or thread/turn ids.`,
    );
  }

  return summary;
}

function hasBackendProof(summary: EvalProviderCallSummary) {
  return (
    summary.responseIds.length > 0 ||
    summary.threadIds.length > 0 ||
    summary.turnIds.length > 0
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase().concat(value.slice(1));
}
