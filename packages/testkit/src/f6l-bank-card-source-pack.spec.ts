import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const fixtureRoot = join(
  process.cwd(),
  "fixtures",
  "f6l-bank-card-source-pack",
);
const expectedSourceRoles = ["bank_account_summary", "card_expense"];
const expectedExtractorKeys = ["bank_account_summary_csv", "card_expense_csv"];
const runtimeActionBoundaryFields = [
  "monitorRunTriggered",
  "checklistReadTriggered",
  "operatorReadinessReadTriggered",
  "acknowledgementReadTriggered",
  "missionCreated",
  "reportCreated",
  "approvalCreated",
  "deliveryCreated",
  "runtimeCodexUsed",
  "paymentInstructionCreated",
  "accountingWriteCreated",
  "bankWriteCreated",
  "taxFilingCreated",
  "legalAdviceGenerated",
  "policyAdviceGenerated",
  "collectionInstructionCreated",
  "customerContactInstructionCreated",
  "autonomousActionCreated",
];
const volatileKeys = new Set([
  "id",
  "sourceId",
  "sourceSnapshotId",
  "sourceFileId",
  "syncRunId",
  "storageRef",
  "createdAt",
  "updatedAt",
  "capturedAt",
  "recordedAt",
  "startedAt",
  "completedAt",
]);

describe("F6L bank/card source-pack fixture", () => {
  it("keeps static source files and normalized expected source/twin posture", () => {
    const expected = loadExpectedPosture();
    const sourceHashesBefore = hashSourceFiles(expected.sourceFiles);

    expect(expected.sourcePackId).toBe("pocket-cfo-bank-card-source-pack");
    expect(expected.companyKey).toBe("demo-bank-card-source-pack");
    expect(expected.sourceRolesPresent).toEqual(expectedSourceRoles);
    expect(expected.extractorKeysUsed).toEqual(expectedExtractorKeys);
    expect(expected.sourceFiles.map((sourceFile) => sourceFile.role)).toEqual(
      expectedSourceRoles,
    );
    expect(
      expected.sourceFiles.map((sourceFile) => sourceFile.expectedExtractorKey),
    ).toEqual(expectedExtractorKeys);
    expect(
      expected.sourceFiles.map((sourceFile) => sourceFile.sourceKind),
    ).toEqual(["dataset", "dataset"]);
    expect(
      expected.sourceFiles.map((sourceFile) => sourceFile.mediaType),
    ).toEqual(["text/csv", "text/csv"]);

    for (const sourceFile of expected.sourceFiles) {
      const body = readFileSync(join(fixtureRoot, sourceFile.path), "utf8");
      expect(body.trim().length).toBeGreaterThan(0);
    }

    expect(expected.bankAccountInventoryPosture.accountCount).toBe(3);
    expect(expected.bankAccountInventoryPosture.summary.summaryRowCount).toBe(
      4,
    );
    expect(expected.cashPosture.coverageSummary.reportedBalanceCount).toBe(4);
    expect(expected.cardSpendItemPosture.rowCount).toBe(3);
    expect(expected.spendPosture.coverageSummary.rowCount).toBe(3);
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
    expect(hashSourceFiles(expected.sourceFiles)).toEqual(sourceHashesBefore);
  });
});

function loadExpectedPosture() {
  const posturePath = join(fixtureRoot, "expected-source-twin-posture.json");

  expect(existsSync(posturePath)).toBe(true);

  return JSON.parse(readFileSync(posturePath, "utf8")) as {
    bankAccountInventoryPosture: {
      accountCount: number;
      summary: { summaryRowCount: number };
    };
    cardSpendItemPosture: { rowCount: number };
    cashPosture: { coverageSummary: { reportedBalanceCount: number } };
    companyKey: string;
    extractorKeysUsed: string[];
    familyBoundary: Record<string, boolean>;
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
    spendPosture: { coverageSummary: { rowCount: number } };
  };
}

function hashSourceFiles(sourceFiles: Array<{ path: string }>) {
  return Object.fromEntries(
    sourceFiles.map((sourceFile) => {
      const body = readFileSync(join(fixtureRoot, sourceFile.path));
      return [sourceFile.path, createHash("sha256").update(body).digest("hex")];
    }),
  );
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
