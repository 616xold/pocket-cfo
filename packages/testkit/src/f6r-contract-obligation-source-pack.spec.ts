import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

type ManifestSourceFile = {
  role: string;
  fixturePath: string;
  sourceKind: string;
  mediaType: string;
  expectedExtractorKey: string;
};

type ContractObligationSourcePackManifest = {
  id: string;
  fixtureDirectory: string;
  sourceFiles: ManifestSourceFile[];
  sourceRoles: string[];
  expectedExtractorKeys: string[];
};

type ExpectedSourceFile = {
  role: string;
  path: string;
  sourceKind: string;
  mediaType: string;
  expectedExtractorKey: string;
};

const expectedSourceRoles = ["contract_metadata"];
const expectedExtractorKeys = ["contract_metadata_csv"];
const runtimeActionBoundaryFields = [
  "monitorRunTriggered",
  "checklistReadTriggered",
  "operatorReadinessReadTriggered",
  "acknowledgementReadTriggered",
  "deliveryReadinessReadTriggered",
  "reviewSummaryReadTriggered",
  "providerBoundaryReadTriggered",
  "certificationBoundaryReadTriggered",
  "missionCreated",
  "reportCreated",
  "approvalCreated",
  "deliveryCreated",
  "providerCallCreated",
  "providerCredentialCreated",
  "providerJobCreated",
  "runtimeCodexUsed",
  "generatedProseCreated",
  "paymentInstructionCreated",
  "accountingWriteCreated",
  "bankWriteCreated",
  "taxFilingCreated",
  "legalAdviceGenerated",
  "policyAdviceGenerated",
  "collectionInstructionCreated",
  "customerContactInstructionCreated",
  "certificationCreated",
  "closeCompleteCreated",
  "signOffCreated",
  "attestationCreated",
  "legalOpinionCreated",
  "auditOpinionCreated",
  "assuranceCreated",
  "sourceMutationOutsideUploadSync",
  "autonomousActionCreated",
];
const volatileKeys = new Set([
  "id",
  "generatedId",
  "sourceId",
  "sourceIds",
  "snapshotId",
  "snapshotIds",
  "sourceSnapshotId",
  "sourceSnapshotIds",
  "sourceFileId",
  "sourceFileIds",
  "syncRunId",
  "syncRunIds",
  "storageRef",
  "storageRefs",
  "createdAt",
  "updatedAt",
  "capturedAt",
  "recordedAt",
  "startedAt",
  "completedAt",
  "timestamp",
  "timestamps",
]);

describe("F6R contract/obligation source-pack fixture", () => {
  it("keeps static source files and normalized expected source/twin posture", async () => {
    const manifest = await loadManifest();
    const fixtureRoot = resolve(repoRoot(), manifest.fixtureDirectory);
    const expected = loadExpectedPosture(fixtureRoot);
    const manifestSourceFiles = normalizeManifestSourceFiles(
      manifest.sourceFiles,
    );
    const sourceHashesBefore = hashSourceFiles(
      fixtureRoot,
      manifestSourceFiles,
    );

    expect(manifest.id).toBe("pocket-cfo-contract-obligation-source-pack");
    expect(expected.sourcePackId).toBe(manifest.id);
    expect(expected.companyKey).toBe("demo-contract-obligation-source-pack");
    expect(manifest.sourceRoles).toEqual(expectedSourceRoles);
    expect(manifest.expectedExtractorKeys).toEqual(expectedExtractorKeys);
    expect(expected.sourceRolesPresent).toEqual(expectedSourceRoles);
    expect(expected.extractorKeysUsed).toEqual(expectedExtractorKeys);
    expect(normalizeExpectedSourceFiles(expected.sourceFiles)).toEqual(
      manifestSourceFiles,
    );

    for (const sourceFile of manifestSourceFiles) {
      const body = readFileSync(join(fixtureRoot, sourceFile.path), "utf8");
      expect(body.trim().length).toBeGreaterThan(0);
    }

    expect(expected.contractInventoryPosture.contractCount).toBe(4);
    expect(expected.contractInventoryPosture.contractLabels).toEqual([
      "Master Services Agreement",
      "NDA",
      "Office Lease",
      "Support Agreement",
    ]);
    expect(
      expected.contractInventoryPosture.coverage.lineageTargetKinds,
    ).toEqual(["contract", "contract_obligation"]);
    expect(expected.obligationCalendarPosture.obligationCount).toBe(7);
    expect(
      expected.obligationCalendarPosture.coverageSummary.obligationCount,
    ).toBe(7);
    expect(
      expected.obligationCalendarPosture.currencyBuckets.map(
        (bucket) => bucket.currency,
      ),
    ).toEqual([null, "GBP", "USD"]);
    expect(expected.familyBoundary).toEqual({
      newDiscoveryFamilyAdded: false,
      newMonitorFamilyAdded: false,
    });
    expect(expected).not.toHaveProperty("monitorFamiliesCovered");
    expect(expected).not.toHaveProperty("discoveryFamiliesCovered");

    for (const field of runtimeActionBoundaryFields) {
      expect(expected.runtimeActionBoundary[field]).toBe(false);
    }

    expect(findVolatileKeys(expected)).toEqual([]);
    expect(hashSourceFiles(fixtureRoot, manifestSourceFiles)).toEqual(
      sourceHashesBefore,
    );
  });
});

async function loadManifest(): Promise<ContractObligationSourcePackManifest> {
  const manifestModule = new URL(
    "../../stack-packs/src/index.ts",
    import.meta.url,
  );
  const module = (await import(manifestModule.href)) as {
    pocketCfoContractObligationSourcePack: ContractObligationSourcePackManifest;
  };

  return module.pocketCfoContractObligationSourcePack;
}

function repoRoot() {
  return resolve(process.cwd(), "../..");
}

function loadExpectedPosture(fixtureRoot: string) {
  const posturePath = join(fixtureRoot, "expected-source-twin-posture.json");

  expect(existsSync(posturePath)).toBe(true);

  return JSON.parse(readFileSync(posturePath, "utf8")) as {
    companyKey: string;
    contractInventoryPosture: {
      contractCount: number;
      contractLabels: string[];
      coverage: { lineageTargetKinds: string[] };
    };
    extractorKeysUsed: string[];
    familyBoundary: Record<string, boolean>;
    obligationCalendarPosture: {
      obligationCount: number;
      coverageSummary: { obligationCount: number };
      currencyBuckets: Array<{ currency: string | null }>;
    };
    runtimeActionBoundary: Record<string, boolean>;
    sourceFiles: ExpectedSourceFile[];
    sourcePackId: string;
    sourceRolesPresent: string[];
  };
}

function hashSourceFiles(fixtureRoot: string, sourceFiles: ExpectedSourceFile[]) {
  return Object.fromEntries(
    sourceFiles.map((sourceFile) => {
      const body = readFileSync(join(fixtureRoot, sourceFile.path));
      return [sourceFile.path, createHash("sha256").update(body).digest("hex")];
    }),
  );
}

function normalizeManifestSourceFiles(
  sourceFiles: ManifestSourceFile[],
): ExpectedSourceFile[] {
  return sourceFiles.map((sourceFile) => ({
    role: sourceFile.role,
    path: sourceFile.fixturePath,
    sourceKind: sourceFile.sourceKind,
    mediaType: sourceFile.mediaType,
    expectedExtractorKey: sourceFile.expectedExtractorKey,
  }));
}

function normalizeExpectedSourceFiles(
  sourceFiles: ExpectedSourceFile[],
): ExpectedSourceFile[] {
  return sourceFiles.map((sourceFile) => ({
    role: sourceFile.role,
    path: sourceFile.path,
    sourceKind: sourceFile.sourceKind,
    mediaType: sourceFile.mediaType,
    expectedExtractorKey: sourceFile.expectedExtractorKey,
  }));
}

function findVolatileKeys(value: unknown, path = "$"): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) =>
      findVolatileKeys(entry, `${path}[${index}]`),
    );
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  return Object.entries(value).flatMap(([key, entry]) => {
    const entryPath = `${path}.${key}`;
    return [
      ...(volatileKeys.has(key) ? [entryPath] : []),
      ...findVolatileKeys(entry, entryPath),
    ];
  });
}
