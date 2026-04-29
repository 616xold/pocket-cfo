import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const fixtureRoot = join(
  process.cwd(),
  "fixtures",
  "f6o-receivables-payables-source-pack",
);
const expectedSourceRoles = ["receivables_aging", "payables_aging"];
const expectedExtractorKeys = ["receivables_aging_csv", "payables_aging_csv"];
const manifestSourceFiles = [
  {
    role: "receivables_aging",
    path: "sources/receivables-aging.csv",
    sourceKind: "dataset",
    mediaType: "text/csv",
    expectedExtractorKey: "receivables_aging_csv",
  },
  {
    role: "payables_aging",
    path: "sources/payables-aging.csv",
    sourceKind: "dataset",
    mediaType: "text/csv",
    expectedExtractorKey: "payables_aging_csv",
  },
] as const;
const runtimeActionBoundaryFields = [
  "monitorRunTriggered",
  "checklistReadTriggered",
  "operatorReadinessReadTriggered",
  "acknowledgementReadTriggered",
  "deliveryReadinessReadTriggered",
  "reviewSummaryReadTriggered",
  "missionCreated",
  "reportCreated",
  "approvalCreated",
  "deliveryCreated",
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

describe("F6O receivables/payables source-pack fixture", () => {
  it("keeps static source files and normalized expected source/twin posture", () => {
    const expected = loadExpectedPosture();
    const sourceHashesBefore = hashSourceFiles(manifestSourceFiles);

    expect(expected.sourcePackId).toBe(
      "pocket-cfo-receivables-payables-source-pack",
    );
    expect(expected.companyKey).toBe(
      "demo-receivables-payables-source-pack",
    );
    expect(expected.sourceRolesPresent).toEqual(expectedSourceRoles);
    expect(expected.extractorKeysUsed).toEqual(expectedExtractorKeys);
    expect(normalizeExpectedSourceFiles(expected.sourceFiles)).toEqual(
      manifestSourceFiles,
    );

    for (const sourceFile of manifestSourceFiles) {
      const body = readFileSync(join(fixtureRoot, sourceFile.path), "utf8");
      expect(body.trim().length).toBeGreaterThan(0);
    }

    expect(expected.receivablesAgingPosture.customerCount).toBe(3);
    expect(expected.receivablesAgingPosture.customerLabels).toEqual([
      "Alpha Co",
      "Beta Co",
      "Gamma Co",
    ]);
    expect(expected.receivablesAgingPosture.coverage.lineageTargetKinds).toEqual(
      ["customer", "receivables_aging_row"],
    );
    expect(expected.collectionsPosture.coverageSummary.customerCount).toBe(3);
    expect(expected.collectionsPosture.coverageSummary.rowCount).toBe(3);
    expect(expected.payablesAgingPosture.vendorCount).toBe(3);
    expect(expected.payablesAgingPosture.vendorLabels).toEqual([
      "Cloud Hosting",
      "Office Lease",
      "Paper Supply Co",
    ]);
    expect(expected.payablesAgingPosture.coverage.lineageTargetKinds).toEqual([
      "payables_aging_row",
      "vendor",
    ]);
    expect(expected.payablesPosture.coverageSummary.vendorCount).toBe(3);
    expect(expected.payablesPosture.coverageSummary.rowCount).toBe(3);
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
    expect(hashSourceFiles(manifestSourceFiles)).toEqual(sourceHashesBefore);
  });
});

function loadExpectedPosture() {
  const posturePath = join(fixtureRoot, "expected-source-twin-posture.json");

  expect(existsSync(posturePath)).toBe(true);

  return JSON.parse(readFileSync(posturePath, "utf8")) as {
    collectionsPosture: {
      coverageSummary: { customerCount: number; rowCount: number };
    };
    companyKey: string;
    extractorKeysUsed: string[];
    familyBoundary: Record<string, boolean>;
    payablesAgingPosture: {
      coverage: { lineageTargetKinds: string[] };
      vendorCount: number;
      vendorLabels: string[];
    };
    payablesPosture: {
      coverageSummary: { rowCount: number; vendorCount: number };
    };
    receivablesAgingPosture: {
      coverage: { lineageTargetKinds: string[] };
      customerCount: number;
      customerLabels: string[];
    };
    runtimeActionBoundary: Record<string, boolean>;
    sourceFiles: Array<{
      expectedExtractorKey: string;
      mediaType: string;
      path: string;
      role: string;
      sourceKind: string;
    }>;
    sourcePackId: string;
    sourceRolesPresent: string[];
  };
}

function hashSourceFiles(sourceFiles: ReadonlyArray<{ path: string }>) {
  return Object.fromEntries(
    sourceFiles.map((sourceFile) => {
      const body = readFileSync(join(fixtureRoot, sourceFile.path));
      return [sourceFile.path, createHash("sha256").update(body).digest("hex")];
    }),
  );
}

function normalizeExpectedSourceFiles(
  sourceFiles: Array<{
    expectedExtractorKey: string;
    mediaType: string;
    path: string;
    role: string;
    sourceKind: string;
  }>,
) {
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
