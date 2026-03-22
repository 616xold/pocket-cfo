import type { EvalBackend } from "./types";

export function buildPinnedBackendArgv(input: {
  argv: string[];
  backend: EvalBackend;
  commandName: string;
}) {
  const sanitized: string[] = [];

  for (let index = 0; index < input.argv.length; index += 1) {
    const arg = input.argv[index];

    if (!arg) {
      continue;
    }

    if (arg === "--") {
      continue;
    }

    if (arg === "--backend") {
      const nextValue = input.argv[index + 1] ?? null;

      if (!nextValue) {
        throw new Error(
          `Missing backend after --backend. ${input.commandName} is pinned to ${input.backend}.`,
        );
      }

      if (nextValue !== input.backend) {
        throw new Error(
          `${input.commandName} is pinned to ${input.backend} and cannot run with ${nextValue}.`,
        );
      }

      index += 1;
      continue;
    }

    sanitized.push(arg);
  }

  return [...sanitized, "--backend", input.backend];
}
