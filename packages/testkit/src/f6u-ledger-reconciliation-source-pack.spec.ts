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

type LedgerReconciliationSourcePackManifest = {
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

const expectedSourceRoles = [
  "chart_of_accounts",
  "trial_balance",
  "general_ledger",
];
const expectedExtractorKeys = [
  "chart_of_accounts_csv",
  "trial_balance_csv",
  "general_ledger_csv",
];
const runtimeActionBoundaryFields = [
  "monitorRunTriggered",
  "checklistReadTriggered",
  "operatorReadinessReadTriggered",
  "acknowledgementReadTriggered",
  "deliveryReadinessReadTriggered",
  "reviewSummaryReadTriggered",
  "providerBoundaryReadTriggered",
  "certificationBoundaryReadTriggered",
  "humanConfirmationBoundaryReadTriggered",
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

describe("F6U ledger/reconciliation source-pack fixture", () => {
  it("keeps static source files and normalized expected source/twin/reconciliation posture", async () => {
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

    expect(manifest.id).toBe("pocket-cfo-ledger-reconciliation-source-pack");
    expect(expected.sourcePackId).toBe(manifest.id);
    expect(expected.companyKey).toBe("demo-ledger-reconciliation-source-pack");
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

    expect(expected.accountCatalogPosture.accountCount).toBe(5);
    expect(expected.chartOfAccountsAccountCountPosture).toEqual({
      accountCount: 5,
      activeAccountCount: 4,
      inactiveAccountCount: 1,
      parentLinkedCount: 1,
    });
    expect(expected.trialBalancePosture.summary).toMatchObject({
      accountCount: 3,
      lineCount: 3,
      totalDebitAmount: "150.00",
      totalCreditAmount: "150.00",
      totalNetAmount: "0.00",
      currencyCode: "USD",
    });
    expect(expected.trialBalanceAccountCountPosture).toEqual({
      accountCount: 3,
      lineCount: 3,
    });
    expect(expected.generalLedgerPosture.summary).toMatchObject({
      journalEntryCount: 1,
      journalLineCount: 3,
      ledgerAccountCount: 3,
      totalDebitAmount: "150.00",
      totalCreditAmount: "150.00",
      earliestEntryDate: "2026-03-15",
      latestEntryDate: "2026-03-15",
      currencyCode: "USD",
    });
    expect(expected.reconciliationPosture.comparability.state).toBe(
      "window_comparable",
    );
    expect(expected.accountBridgePosture.bridgeReadiness.state).toBe(
      "matched_period_ready",
    );
    expect(
      expected.balanceBridgePrerequisitesPosture.balanceBridgePrerequisites
        .state,
    ).toBe("source_backed_balance_prereq_ready");
    expect(expected.sourceBackedBalanceProofPosture).toMatchObject({
      targetAccountCode: "1000",
      proofPresent: true,
      proofBasis: "source_backed_balance_field",
      openingBalanceEvidencePresent: true,
      endingBalanceEvidencePresent: true,
      lineagePresent: true,
    });
    expect(expected.balanceProofLineagePosture).toMatchObject({
      targetKind: "general_ledger_balance_proof",
      recordCount: 1,
      extractorKeys: ["general_ledger_csv"],
      sourceFileNames: ["general-ledger.csv"],
    });
    expect(expected.periodContextPosture).toMatchObject({
      basis: "source_declared_period",
      windowRelation: "exact_match",
      sourceDeclaredPeriod: {
        contextKind: "period_window",
        periodKey: "2026-03",
        periodStart: "2026-03-01",
        periodEnd: "2026-03-31",
        asOf: null,
      },
    });
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

async function loadManifest(): Promise<LedgerReconciliationSourcePackManifest> {
  const manifestModule = new URL(
    "../../stack-packs/src/index.ts",
    import.meta.url,
  );
  const module = (await import(manifestModule.href)) as {
    pocketCfoLedgerReconciliationSourcePack: LedgerReconciliationSourcePackManifest;
  };

  return module.pocketCfoLedgerReconciliationSourcePack;
}

function repoRoot() {
  return resolve(process.cwd(), "../..");
}

function loadExpectedPosture(fixtureRoot: string) {
  const posturePath = join(fixtureRoot, "expected-source-twin-posture.json");

  expect(existsSync(posturePath)).toBe(true);

  return JSON.parse(readFileSync(posturePath, "utf8")) as {
    accountBridgePosture: {
      bridgeReadiness: { state: string };
    };
    accountCatalogPosture: {
      accountCount: number;
    };
    balanceBridgePrerequisitesPosture: {
      balanceBridgePrerequisites: { state: string };
    };
    balanceProofLineagePosture: {
      extractorKeys: string[];
      recordCount: number;
      sourceFileNames: string[];
      targetKind: string;
    };
    chartOfAccountsAccountCountPosture: {
      accountCount: number;
      activeAccountCount: number;
      inactiveAccountCount: number;
      parentLinkedCount: number;
    };
    companyKey: string;
    extractorKeysUsed: string[];
    familyBoundary: Record<string, boolean>;
    generalLedgerPosture: {
      summary: {
        currencyCode: string | null;
        earliestEntryDate: string;
        journalEntryCount: number;
        journalLineCount: number;
        latestEntryDate: string;
        ledgerAccountCount: number;
        totalCreditAmount: string;
        totalDebitAmount: string;
      };
    };
    periodContextPosture: {
      basis: string;
      sourceDeclaredPeriod: {
        asOf: string | null;
        contextKind: string;
        periodEnd: string | null;
        periodKey: string | null;
        periodStart: string | null;
      };
      windowRelation: string;
    };
    reconciliationPosture: {
      comparability: { state: string };
    };
    runtimeActionBoundary: Record<string, boolean>;
    sourceBackedBalanceProofPosture: {
      targetAccountCode: string;
      proofPresent: boolean;
      proofBasis: string;
      openingBalanceEvidencePresent: boolean;
      endingBalanceEvidencePresent: boolean;
      lineagePresent: boolean;
    };
    sourceFiles: ExpectedSourceFile[];
    sourcePackId: string;
    sourceRolesPresent: string[];
    trialBalanceAccountCountPosture: {
      accountCount: number;
      lineCount: number;
    };
    trialBalancePosture: {
      summary: {
        accountCount: number;
        currencyCode: string | null;
        lineCount: number;
        totalCreditAmount: string;
        totalDebitAmount: string;
        totalNetAmount: string;
      };
    };
  };
}

function hashSourceFiles(
  fixtureRoot: string,
  sourceFiles: ExpectedSourceFile[],
) {
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
