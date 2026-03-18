import { execFile as execFileCallback } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createTempGitRepo } from "../workspaces/test-git";
import { InMemoryTwinRepository } from "./repository";
import { TwinService } from "./service";
import { LocalTwinRepositorySourceResolver } from "./source-resolver";

const execFile = promisify(execFileCallback);

const repoFullName = "616xold/pocket-cto";

describe("TwinService ownership sync", () => {
  const cleanups: Array<() => Promise<void>> = [];

  afterEach(async () => {
    await Promise.all(cleanups.splice(0).map((cleanup) => cleanup()));
  });

  it("reruns ownership sync by upserting the same file, rule, and principal entities", async () => {
    const sourceRepo = await createOwnershipSourceRepo(repoFullName, {
      codeownersPath: ".github/CODEOWNERS",
      content: ["* @Platform", "docs/ @Docs-Team", "apps/web/ @Platform"].join(
        "\n",
      ),
    });
    cleanups.push(sourceRepo.cleanup);
    const service = createOwnershipTwinService(sourceRepo.repoRoot);

    await service.syncRepositoryOwnership(repoFullName);
    const firstEntities = await service.listRepositoryEntities(repoFullName);
    const firstOwnershipEntityIds = new Map(
      firstEntities.entities
        .filter((entity) =>
          ["codeowners_file", "ownership_rule", "owner_principal"].includes(
            entity.kind,
          ),
        )
        .map((entity) => [`${entity.kind}::${entity.stableKey}`, entity.id]),
    );

    const secondResult = await service.syncRepositoryOwnership(repoFullName);
    const secondEntities = await service.listRepositoryEntities(repoFullName);
    const secondOwnershipEntityIds = new Map(
      secondEntities.entities
        .filter((entity) =>
          ["codeowners_file", "ownership_rule", "owner_principal"].includes(
            entity.kind,
          ),
        )
        .map((entity) => [`${entity.kind}::${entity.stableKey}`, entity.id]),
    );
    const rulesView = await service.getRepositoryOwnershipRules(repoFullName);
    const ownersView = await service.getRepositoryOwners(repoFullName);

    expect(secondResult).toMatchObject({
      codeownersFilePath: ".github/CODEOWNERS",
      ruleCount: 3,
      ownerCount: 2,
      syncRun: {
        status: "succeeded",
      },
    });
    expect(secondOwnershipEntityIds).toEqual(firstOwnershipEntityIds);
    expect(rulesView).toMatchObject({
      codeownersFile: {
        path: ".github/CODEOWNERS",
      },
      ruleCount: 3,
      ownerCount: 2,
      rules: [
        {
          ordinal: 1,
          rawPattern: "*",
          normalizedOwners: ["@platform"],
        },
        {
          ordinal: 2,
          rawPattern: "docs/",
          normalizedOwners: ["@docs-team"],
        },
        {
          ordinal: 3,
          rawPattern: "apps/web/",
          normalizedOwners: ["@platform"],
        },
      ],
    });
    expect(ownersView).toMatchObject({
      ownerCount: 2,
      owners: [
        {
          handle: "@docs-team",
          assignedRuleCount: 1,
        },
        {
          handle: "@platform",
          assignedRuleCount: 2,
        },
      ],
    });
  });

  it("succeeds truthfully with zero ownership facts when no CODEOWNERS file exists", async () => {
    const sourceRepo = await createOwnershipSourceRepo(repoFullName, {
      codeownersPath: null,
      content: null,
    });
    cleanups.push(sourceRepo.cleanup);
    const service = createOwnershipTwinService(sourceRepo.repoRoot);

    const result = await service.syncRepositoryOwnership(repoFullName);
    const rulesView = await service.getRepositoryOwnershipRules(repoFullName);
    const ownersView = await service.getRepositoryOwners(repoFullName);
    const runs = await service.listRepositoryRuns(repoFullName);

    expect(result).toMatchObject({
      codeownersFilePath: null,
      ruleCount: 0,
      ownerCount: 0,
      entityCount: 0,
      edgeCount: 0,
      syncRun: {
        status: "succeeded",
      },
    });
    expect(rulesView).toMatchObject({
      latestRun: {
        id: result.syncRun.id,
        status: "succeeded",
      },
      codeownersFile: null,
      ruleCount: 0,
      ownerCount: 0,
      rules: [],
    });
    expect(ownersView).toMatchObject({
      codeownersFile: null,
      ownerCount: 0,
      owners: [],
    });
    expect(runs.runs[0]).toMatchObject({
      id: result.syncRun.id,
      status: "succeeded",
      stats: {
        codeownersFileCount: 0,
        ruleCount: 0,
        ownerCount: 0,
      },
    });
  });
});

function createOwnershipTwinService(configuredSourceRepoRoot: string) {
  let tick = 0;

  return new TwinService({
    metadataExtractor: {
      async extract() {
        throw new Error("metadata extractor should not be used in ownership tests");
      },
    },
    repository: new InMemoryTwinRepository(),
    repositoryRegistry: {
      getRepository: vi.fn(async (fullName: string) => {
        return {
          repository: {
            id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
            installationId: "12345",
            githubRepositoryId: "100",
            fullName,
            ownerLogin: fullName.split("/")[0] ?? "616xold",
            name: fullName.split("/")[1] ?? "pocket-cto",
            defaultBranch: "main",
            visibility: "private" as const,
            archived: false,
            disabled: false,
            isActive: true,
            language: "TypeScript",
            lastSyncedAt: "2026-03-18T04:00:00.000Z",
            removedFromInstallationAt: null,
            updatedAt: "2026-03-18T04:00:00.000Z",
          },
          writeReadiness: {
            ready: true,
            failureCode: null,
          },
        };
      }),
      resolveWritableRepository: vi.fn(async () => ({
        installation: {
          installationId: "12345",
        },
        repository: {
          fullName: repoFullName,
        },
      })),
    },
    sourceResolver: new LocalTwinRepositorySourceResolver({
      configuredSourceRepoRoot,
      processCwd: process.cwd(),
    }),
    now: () =>
      new Date(Date.parse("2026-03-18T04:05:00.000Z") + tick++ * 1000),
  });
}

async function createOwnershipSourceRepo(
  fullName: string,
  input: {
    codeownersPath: ".github/CODEOWNERS" | "CODEOWNERS" | "docs/CODEOWNERS" | null;
    content: string | null;
  },
) {
  const sourceRepo = await createTempGitRepo();

  await execFile(
    "git",
    ["remote", "add", "origin", `https://github.com/${fullName}.git`],
    {
      cwd: sourceRepo.repoRoot,
    },
  );
  await Promise.all([
    mkdir(join(sourceRepo.repoRoot, ".github"), {
      recursive: true,
    }),
    mkdir(join(sourceRepo.repoRoot, "docs"), {
      recursive: true,
    }),
    writeFile(
      join(sourceRepo.repoRoot, "README.md"),
      "# Pocket CTO\n\nOwnership sync fixture.\n",
      "utf8",
    ),
  ]);

  if (input.codeownersPath && input.content) {
    await writeFile(
      join(sourceRepo.repoRoot, input.codeownersPath),
      input.content,
      "utf8",
    );
  }

  return {
    cleanup: sourceRepo.cleanup,
    repoRoot: sourceRepo.repoRoot,
  };
}
