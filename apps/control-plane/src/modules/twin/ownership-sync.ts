import type { TwinRepositoryOwnershipSyncResult } from "@pocket-cto/domain";
import type {
  GitHubRepositoryDetailResult,
  GitHubRepositorySummary,
} from "../github-app/schema";
import { discoverCodeownersFile } from "./codeowners-discovery";
import {
  parseCodeownersFile,
  type ParsedCodeownersRule,
  type ParsedOwnerPrincipal,
} from "./codeowners-parser";
import {
  buildTwinRepositoryOwnershipSyncResult,
} from "./ownership-formatter";
import type { TwinRepository } from "./repository";
import type { TwinRepositorySourceResolver } from "./source-resolver";
import type { TwinEdgeRecord, TwinEntityRecord, TwinSyncRunRecord } from "./types";
import { toTwinRepositorySummary } from "./formatter";

type TwinRepositoryRegistryPort = {
  getRepository(fullName: string): Promise<GitHubRepositoryDetailResult>;
  resolveWritableRepository(fullName: string): Promise<unknown>;
};

type OwnershipEntityDraft = {
  kind: string;
  payload: Record<string, unknown>;
  stableKey: string;
  summary: string | null;
  title: string;
};

type OwnershipEdgeDraft = {
  fromKind: string;
  fromStableKey: string;
  kind: string;
  payload: Record<string, unknown>;
  toKind: string;
  toStableKey: string;
};

type OwnershipSnapshot = {
  codeownersFilePath: string | null;
  edges: OwnershipEdgeDraft[];
  entities: OwnershipEntityDraft[];
  ownerCount: number;
  ruleCount: number;
};

export const ownershipExtractorName = "codeowners_ownership";

export const ownershipTwinEntityKinds = [
  "codeowners_file",
  "ownership_rule",
  "owner_principal",
] as const;

export const ownershipTwinEdgeKinds = [
  "repository_has_codeowners",
  "codeowners_file_defines_rule",
  "rule_assigns_owner",
] as const;

export async function syncRepositoryOwnership(input: {
  now: () => Date;
  repoFullName: string;
  repository: TwinRepository;
  repositoryRegistry: TwinRepositoryRegistryPort;
  sourceResolver: TwinRepositorySourceResolver;
}): Promise<TwinRepositoryOwnershipSyncResult> {
  const detail = await input.repositoryRegistry.getRepository(input.repoFullName);
  const run = await startOwnershipRun(input);
  let snapshot: OwnershipSnapshot | null = null;

  try {
    const source = await input.sourceResolver.resolveRepositorySource(
      input.repoFullName,
    );
    snapshot = await extractOwnershipSnapshot({
      repoRoot: source.repoRoot,
      repository: detail.repository,
    });
    const persisted = await persistOwnershipSnapshot({
      observedAt: run.startedAt,
      repoFullName: input.repoFullName,
      repository: input.repository,
      runId: run.id,
      snapshot,
    });
    const finishedRun = await finishOwnershipRun({
      errorSummary: null,
      now: input.now,
      repository: input.repository,
      run,
      status: "succeeded",
      stats: buildOwnershipSyncStats(
        snapshot,
        persisted.entities.length,
        persisted.edges.length,
      ),
    });

    return buildTwinRepositoryOwnershipSyncResult({
      codeownersFilePath: snapshot.codeownersFilePath,
      edgeCount: persisted.edges.length,
      edges: persisted.edges,
      entityCount: persisted.entities.length,
      entities: persisted.entities,
      ownerCount: snapshot.ownerCount,
      repository: toTwinRepositorySummary(detail),
      ruleCount: snapshot.ruleCount,
      syncRun: finishedRun,
    });
  } catch (error) {
    await finishOwnershipRun({
      errorSummary: toErrorSummary(error),
      now: input.now,
      repository: input.repository,
      run,
      status: "failed",
      stats: buildOwnershipSyncStats(snapshot, 0, 0),
    });
    throw error;
  }
}

async function extractOwnershipSnapshot(input: {
  repoRoot: string;
  repository: GitHubRepositorySummary;
}): Promise<OwnershipSnapshot> {
  const discovered = await discoverCodeownersFile(input.repoRoot);

  if (!discovered) {
    return {
      codeownersFilePath: null,
      edges: [],
      entities: [],
      ownerCount: 0,
      ruleCount: 0,
    };
  }

  const parsed = parseCodeownersFile({
    content: discovered.content,
    sourceFilePath: discovered.path,
  });

  return {
    codeownersFilePath: discovered.path,
    edges: buildOwnershipEdges(discovered.path, parsed.rules),
    entities: [
      buildRepositoryEntityDraft(input.repository),
      {
        kind: "codeowners_file",
        payload: {
          path: discovered.path,
          precedenceSlot: discovered.precedenceSlot,
          lineCount: discovered.lineCount,
          sizeBytes: discovered.sizeBytes,
          ruleCount: parsed.rules.length,
          ownerCount: parsed.owners.length,
          skippedBlankOrCommentLineCount: parsed.skippedBlankOrCommentLineCount,
          skippedMalformedLineCount: parsed.skippedMalformedLineCount,
        },
        stableKey: discovered.path,
        summary: "Effective CODEOWNERS file discovered by GitHub precedence.",
        title: discovered.path,
      },
      ...parsed.rules.map((rule) => buildOwnershipRuleEntityDraft(discovered.path, rule)),
      ...parsed.owners.map(buildOwnerPrincipalEntityDraft),
    ],
    ownerCount: parsed.owners.length,
    ruleCount: parsed.rules.length,
  };
}

function buildOwnershipEdges(
  codeownersPath: string,
  rules: ParsedCodeownersRule[],
): OwnershipEdgeDraft[] {
  return [
    {
      fromKind: "repository",
      fromStableKey: "repository",
      kind: "repository_has_codeowners",
      payload: {
        path: codeownersPath,
      },
      toKind: "codeowners_file",
      toStableKey: codeownersPath,
    },
    ...rules.map<OwnershipEdgeDraft>((rule) => ({
      fromKind: "codeowners_file",
      fromStableKey: codeownersPath,
      kind: "codeowners_file_defines_rule",
      payload: {
        ordinal: rule.ordinal,
        sourceFilePath: codeownersPath,
      },
      toKind: "ownership_rule",
      toStableKey: buildOwnershipRuleStableKey(codeownersPath, rule.ordinal),
    })),
    ...rules.flatMap((rule) =>
      rule.normalizedOwners.map<OwnershipEdgeDraft>((ownerHandle) => ({
        fromKind: "ownership_rule",
        fromStableKey: buildOwnershipRuleStableKey(codeownersPath, rule.ordinal),
        kind: "rule_assigns_owner",
        payload: {
          ordinal: rule.ordinal,
          sourceFilePath: codeownersPath,
        },
        toKind: "owner_principal",
        toStableKey: ownerHandle,
      })),
    ),
  ];
}

function buildOwnershipRuleEntityDraft(
  codeownersPath: string,
  rule: ParsedCodeownersRule,
): OwnershipEntityDraft {
  return {
    kind: "ownership_rule",
    payload: {
      sourceFilePath: rule.sourceFilePath,
      ordinal: rule.ordinal,
      lineNumber: rule.lineNumber,
      rawPattern: rule.rawPattern,
      rawOwners: rule.rawOwners,
      normalizedOwners: rule.normalizedOwners,
      patternShape: rule.patternShape,
      commentAndBlankLinesIgnored: true,
    },
    stableKey: buildOwnershipRuleStableKey(codeownersPath, rule.ordinal),
    summary: "Parsed durable CODEOWNERS assignment rule.",
    title: `${rule.rawPattern} (#${rule.ordinal})`,
  };
}

function buildOwnerPrincipalEntityDraft(
  owner: ParsedOwnerPrincipal,
): OwnershipEntityDraft {
  return {
    kind: "owner_principal",
    payload: {
      handle: owner.handle,
      principalKind: owner.principalKind,
    },
    stableKey: owner.handle,
    summary: "Normalized owner principal extracted from CODEOWNERS.",
    title: owner.handle,
  };
}

function buildOwnershipRuleStableKey(codeownersPath: string, ordinal: number) {
  return `${codeownersPath}#${ordinal.toString().padStart(4, "0")}`;
}

function buildRepositoryEntityDraft(
  repository: GitHubRepositorySummary,
): OwnershipEntityDraft {
  return {
    kind: "repository",
    payload: {
      archived: repository.archived,
      defaultBranch: repository.defaultBranch,
      disabled: repository.disabled,
      fullName: repository.fullName,
      isActive: repository.isActive,
      visibility: repository.visibility,
    },
    stableKey: "repository",
    summary: "Synced repository registry metadata.",
    title: repository.fullName,
  };
}

async function finishOwnershipRun(input: {
  errorSummary: string | null;
  now: () => Date;
  repository: TwinRepository;
  run: TwinSyncRunRecord;
  stats: Record<string, number>;
  status: "failed" | "succeeded";
}) {
  return input.repository.finishSyncRun({
    runId: input.run.id,
    status: input.status,
    completedAt: input.now().toISOString(),
    errorSummary: input.errorSummary,
    stats: input.stats,
  });
}

async function persistOwnershipSnapshot(input: {
  observedAt: string;
  repoFullName: string;
  repository: TwinRepository;
  runId: string;
  snapshot: OwnershipSnapshot;
}) {
  return input.repository.transaction(async (session) => {
    const entityIdByKey = new Map<string, string>();
    const entities: TwinEntityRecord[] = [];
    const edges: TwinEdgeRecord[] = [];

    for (const entityDraft of input.snapshot.entities) {
      const entity = await input.repository.upsertEntity(
        {
          repoFullName: input.repoFullName,
          kind: entityDraft.kind,
          stableKey: entityDraft.stableKey,
          title: entityDraft.title,
          summary: entityDraft.summary,
          payload: entityDraft.payload,
          observedAt: input.observedAt,
          sourceRunId: input.runId,
        },
        session,
      );

      entityIdByKey.set(buildEntityLookupKey(entityDraft), entity.id);
      entities.push(entity);
    }

    for (const edgeDraft of input.snapshot.edges) {
      const edge = await input.repository.upsertEdge(
        {
          repoFullName: input.repoFullName,
          kind: edgeDraft.kind,
          fromEntityId: getRequiredEntityId(entityIdByKey, {
            kind: edgeDraft.fromKind,
            stableKey: edgeDraft.fromStableKey,
          }),
          toEntityId: getRequiredEntityId(entityIdByKey, {
            kind: edgeDraft.toKind,
            stableKey: edgeDraft.toStableKey,
          }),
          payload: edgeDraft.payload,
          observedAt: input.observedAt,
          sourceRunId: input.runId,
        },
        session,
      );

      edges.push(edge);
    }

    return {
      edges,
      entities,
    };
  });
}

async function startOwnershipRun(input: {
  now: () => Date;
  repoFullName: string;
  repository: TwinRepository;
  repositoryRegistry: TwinRepositoryRegistryPort;
}) {
  await input.repositoryRegistry.resolveWritableRepository(input.repoFullName);

  return input.repository.startSyncRun({
    repoFullName: input.repoFullName,
    extractor: ownershipExtractorName,
    startedAt: input.now().toISOString(),
    stats: {},
  });
}

function buildEntityLookupKey(
  input: Pick<OwnershipEntityDraft, "kind" | "stableKey">,
) {
  return `${input.kind}::${input.stableKey}`;
}

function buildOwnershipSyncStats(
  snapshot: OwnershipSnapshot | null,
  entityCount: number,
  edgeCount: number,
) {
  return {
    entityCount,
    edgeCount,
    codeownersFileCount: snapshot?.codeownersFilePath ? 1 : 0,
    ruleCount: snapshot?.ruleCount ?? 0,
    ownerCount: snapshot?.ownerCount ?? 0,
  };
}

function getRequiredEntityId(
  entityIdByKey: Map<string, string>,
  input: Pick<OwnershipEntityDraft, "kind" | "stableKey">,
) {
  const entityId = entityIdByKey.get(buildEntityLookupKey(input));

  if (!entityId) {
    throw new Error(
      `Twin ownership entity ${input.kind}:${input.stableKey} was not persisted`,
    );
  }

  return entityId;
}

function toErrorSummary(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
