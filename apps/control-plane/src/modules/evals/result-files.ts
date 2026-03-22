import { readFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import type { EvalProviderMetadata, EvalResultRecord } from "./types";
import { getRepoRoot } from "./paths";

export async function readEvalResultFile(filePath: string) {
  const resolvedPath = isAbsolute(filePath)
    ? filePath
    : resolve(getRepoRoot(), filePath);
  const content = await readFile(resolvedPath, "utf8");
  const records = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => normalizeEvalResultRecord(JSON.parse(line) as EvalResultRecord));

  return {
    path: resolvedPath,
    records,
  };
}

export function normalizeEvalResultRecord(
  record: EvalResultRecord,
): EvalResultRecord {
  const candidateProvider = normalizeProviderMetadata(record.candidate.provider);
  const graderProvider = normalizeProviderMetadata(record.grader.provider);
  const referenceProvider = record.reference
    ? normalizeProviderMetadata(record.reference.provider)
    : null;

  return {
    ...record,
    backend:
      record.backend ??
      candidateProvider?.backend ??
      graderProvider?.backend ??
      referenceProvider?.backend ??
      "openai_responses",
    candidate: {
      ...record.candidate,
      provider: candidateProvider,
    },
    grader: {
      ...record.grader,
      provider: graderProvider,
    },
    provenance: {
      branchName: record.provenance?.branchName ?? null,
      datasetName: record.provenance?.datasetName ?? record.target,
      gitSha: record.provenance?.gitSha ?? null,
      promptVersion:
        record.provenance?.promptVersion ??
        record.prompt?.version ??
        "unknown-prompt-version",
    },
    reference: record.reference
      ? {
          ...record.reference,
          provider: referenceProvider,
        }
      : null,
  };
}

function normalizeProviderMetadata(
  provider:
    | EvalProviderMetadata
    | {
        requestId?: string | null;
        requestedModel: string;
        resolvedModel: string | null;
        responseId: string | null;
        usage: EvalProviderMetadata["usage"];
      }
    | null
    | undefined,
): EvalProviderMetadata | null {
  if (!provider) {
    return null;
  }

  if ("backend" in provider && "transport" in provider) {
    return provider;
  }

  return {
    backend: "openai_responses",
    codexVersion: null,
    proofMode: "api_key",
    provider: "openai-responses",
    requestId: ("requestId" in provider ? provider.requestId : null) ?? null,
    requestedModel: provider.requestedModel,
    resolvedModel: provider.resolvedModel,
    responseId: provider.responseId,
    threadId: null,
    transport: "openai_responses_api",
    turnId: null,
    userAgent: null,
    usage: provider.usage,
  };
}
