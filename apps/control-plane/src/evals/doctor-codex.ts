import {
  buildPinnedBackendArgv,
  createEvalDoctorReport,
  formatEvalDoctorReport,
  readEvalDoctorBackendOverride,
} from "../modules/evals";

const argv = buildPinnedBackendArgv({
  argv: process.argv.slice(2),
  backend: "codex_subscription",
  commandName: "eval:doctor:codex",
});

const report = createEvalDoctorReport({
  backendOverride: readEvalDoctorBackendOverride(argv),
});

process.stdout.write(formatEvalDoctorReport(report));
