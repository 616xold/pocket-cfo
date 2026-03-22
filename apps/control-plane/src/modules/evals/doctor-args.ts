import { evalBackends } from "./types";

export function readEvalDoctorBackendOverride(argv: string[]) {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--") {
      continue;
    }

    if (arg === "--backend") {
      const nextValue = argv[index + 1];

      if (!nextValue) {
        throw new Error(
          `Missing backend after --backend. Expected one of ${evalBackends.join(", ")}.`,
        );
      }

      if (!evalBackends.includes(nextValue as (typeof evalBackends)[number])) {
        throw new Error(
          `Unknown eval backend: ${nextValue}. Expected one of ${evalBackends.join(", ")}.`,
        );
      }

      return nextValue as (typeof evalBackends)[number];
    }

    throw new Error(`Unknown eval doctor flag: ${arg}`);
  }

  return null;
}
