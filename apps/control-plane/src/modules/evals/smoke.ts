import { type EvalEnv } from "@pocket-cto/config";
import { runEvalCommand } from "./run";

export async function runPlannerSmokeCommand(input?: {
  argv?: string[];
  env?: EvalEnv;
  outputDirectory?: string;
}): Promise<Awaited<ReturnType<typeof runEvalCommand>>> {
  const summary = await runEvalCommand(
    ["planner", "--limit", "1", ...(input?.argv ?? [])],
    {
      env: input?.env,
      outputDirectory: input?.outputDirectory,
      requireLive: true,
    },
  );

  const candidateProven = summary.live.candidate.responseIds.length > 0;
  const graderProven = summary.live.grader.responseIds.length > 0;

  if (!candidateProven && !graderProven) {
    throw new Error(
      "Planner smoke eval did not capture any OpenAI response ids. Live smoke requires provider metadata proof.",
    );
  }

  return summary;
}
