import {
  createEvalDoctorReport,
  formatEvalDoctorReport,
  readEvalDoctorBackendOverride,
} from "../modules/evals";

const report = createEvalDoctorReport({
  backendOverride: readEvalDoctorBackendOverride(process.argv.slice(2)),
});

process.stdout.write(formatEvalDoctorReport(report));
