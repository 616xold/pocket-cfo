import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { delimiter, isAbsolute, join, resolve } from "node:path";
import { splitShellWords } from "../runtime-codex/config";
import { normalizeEvalResultRecord } from "./result-files";

export type CodexBinaryStatus = "present" | "absent";
export type CodexAuthVerificationStatus =
  | "verified"
  | "unverified"
  | "unavailable";

export type CodexBinaryReport = {
  command: string;
  resolvedPath: string | null;
  status: CodexBinaryStatus;
};

export type CodexAuthVerificationReport = {
  latestCompletedAt: string | null;
  latestProofFileName: string | null;
  proofMode: string | null;
  reason: string;
  resolvedModel: string | null;
  status: CodexAuthVerificationStatus;
  threadId: string | null;
  turnId: string | null;
};

export function inspectCodexDoctorState(input: {
  commandLine: string;
  resultsDirectory: string;
}) {
  const binary = inspectCodexBinary(input.commandLine);
  const authVerification = inspectCodexAuthVerification({
    binary,
    resultsDirectory: input.resultsDirectory,
  });

  return {
    authVerification,
    binary,
    transport: "codex_app_server" as const,
  };
}

function inspectCodexBinary(commandLine: string): CodexBinaryReport {
  const [command] = splitShellWords(commandLine);

  if (!command) {
    return {
      command: "(empty)",
      resolvedPath: null,
      status: "absent",
    };
  }

  const resolvedPath = resolveBinaryPath(command);

  return {
    command,
    resolvedPath,
    status: resolvedPath ? "present" : "absent",
  };
}

function inspectCodexAuthVerification(input: {
  binary: CodexBinaryReport;
  resultsDirectory: string;
}): CodexAuthVerificationReport {
  if (input.binary.status === "absent") {
    return {
      latestCompletedAt: null,
      latestProofFileName: null,
      proofMode: null,
      reason:
        "The configured Codex binary is not available on PATH, so the local subscription backend cannot start. Doctor cannot verify auth without a working binary and a live smoke.",
      resolvedModel: null,
      status: "unavailable",
      threadId: null,
      turnId: null,
    };
  }

  const latestProof = findLatestCodexProof(input.resultsDirectory);

  if (!latestProof) {
    return {
      latestCompletedAt: null,
      latestProofFileName: null,
      proofMode: null,
      reason:
        "Doctor can confirm the Codex binary and config only. A live smoke is still required to prove current local auth and fresh turn completion.",
      resolvedModel: null,
      status: "unverified",
      threadId: null,
      turnId: null,
    };
  }

  return {
    latestCompletedAt: latestProof.completedAt,
    latestProofFileName: latestProof.fileName,
    proofMode: latestProof.proofMode,
    reason:
      "A saved codex_subscription result already captured thread or turn proof. Another live smoke is still the only safe way to prove the current shell can authenticate and complete a fresh turn.",
    resolvedModel: latestProof.resolvedModel,
    status: "verified",
    threadId: latestProof.threadId,
    turnId: latestProof.turnId,
  };
}

function findLatestCodexProof(resultsDirectory: string) {
  if (!existsSync(resultsDirectory)) {
    return null;
  }

  const fileNames = readdirSync(resultsDirectory)
    .filter((fileName) => fileName.endsWith(".jsonl"))
    .sort()
    .reverse();

  for (const fileName of fileNames) {
    const filePath = join(resultsDirectory, fileName);

    try {
      const content = readFileSync(filePath, "utf8");
      const lines = content
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      for (const line of lines) {
        const record = normalizeEvalResultRecord(JSON.parse(line));
        const provider = pickCodexProvider(record);

        if (!provider) {
          continue;
        }

        return {
          completedAt: record.completedAt,
          fileName,
          proofMode: provider.proofMode,
          resolvedModel: provider.resolvedModel,
          threadId: provider.threadId,
          turnId: provider.turnId,
        };
      }
    } catch {
      continue;
    }
  }

  return null;
}

function pickCodexProvider(
  record: ReturnType<typeof normalizeEvalResultRecord>,
) {
  const candidates = [
    record.candidate.provider,
    record.grader.provider,
    record.reference?.provider ?? null,
  ];

  return (
    candidates.find(
      (provider) =>
        provider?.backend === "codex_subscription" &&
        (provider.threadId !== null || provider.turnId !== null),
    ) ?? null
  );
}

function resolveBinaryPath(command: string) {
  if (command.includes("/")) {
    const candidate = isAbsolute(command) ? command : resolve(command);

    return isUsableBinary(candidate) ? candidate : null;
  }

  const pathEntries = process.env.PATH?.split(delimiter) ?? [];

  for (const entry of pathEntries) {
    const candidate = join(entry, command);

    if (isUsableBinary(candidate)) {
      return candidate;
    }
  }

  return null;
}

function isUsableBinary(filePath: string) {
  if (!existsSync(filePath)) {
    return false;
  }

  try {
    return statSync(filePath).isFile();
  } catch {
    return false;
  }
}
