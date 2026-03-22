import { formatEvalRunSummary, runExecutorSmokeCommand } from "../modules/evals";

const summary = await runExecutorSmokeCommand({
  argv: process.argv.slice(2),
  requiredBackend: "codex_subscription",
});

process.stdout.write(formatEvalRunSummary(summary));
