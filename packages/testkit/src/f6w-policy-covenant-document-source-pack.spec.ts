import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

type ManifestSourceFile = {
  role: string;
  fixturePath: string;
  sourceKind: string;
  mediaType: string;
  documentRole: string;
  expectedDocumentKind: string;
};

type PolicyCovenantDocumentSourcePackManifest = {
  id: string;
  fixtureDirectory: string;
  sourceFiles: ManifestSourceFile[];
  sourceRoles: string[];
  documentRoles: string[];
  sourceKinds: string[];
  mediaTypes: string[];
  expectedDocumentKinds: string[];
};

type ExpectedSourceFile = {
  role: string;
  path: string;
  sourceKind: string;
  mediaType: string;
  documentRole: string;
  expectedDocumentKind: string;
};

const expectedSourceRoles = ["policy_document"];
const expectedDocumentRoles = ["policy_document"];
const expectedSourceKinds = ["document"];
const expectedMediaTypes = ["text/markdown", "text/plain"];
const expectedDocumentKinds = ["markdown_text", "plain_text"];
const runtimeActionBoundaryFields = [
  "monitorRunTriggered",
  "monitorResultCreated",
  "checklistReadTriggered",
  "operatorReadinessReadTriggered",
  "acknowledgementReadTriggered",
  "deliveryReadinessReadTriggered",
  "reviewSummaryReadTriggered",
  "providerBoundaryReadTriggered",
  "certificationBoundaryReadTriggered",
  "humanConfirmationBoundaryReadTriggered",
  "certificationSafetyReadTriggered",
  "missionCreated",
  "reportCreated",
  "approvalCreated",
  "deliveryCreated",
  "providerCallCreated",
  "providerCredentialCreated",
  "providerJobCreated",
  "outboxSendCreated",
  "runtimeCodexUsed",
  "generatedProseCreated",
  "generatedNotificationProseCreated",
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
  "sourceMutationOutsideProofSetupCreated",
  "autonomousActionCreated",
];
const volatileKeys = new Set([
  "id",
  "generatedId",
  "sourceId",
  "sourceIds",
  "sourceFileId",
  "sourceFileIds",
  "sourceSnapshotId",
  "sourceSnapshotIds",
  "snapshotId",
  "snapshotIds",
  "compileRunId",
  "compileRunIds",
  "storageRef",
  "storageRefs",
  "rawObjectStoreRef",
  "rawObjectStoreRefs",
  "createdAt",
  "updatedAt",
  "capturedAt",
  "recordedAt",
  "startedAt",
  "completedAt",
  "generatedAt",
  "timestamp",
  "timestamps",
]);
const forbiddenFixtureTextPatterns = [
  /legal advice/iu,
  /policy advice/iu,
  /certification/iu,
  /certified/iu,
  /close[- ]complete/iu,
  /approval/iu,
  /report release/iu,
  /external delivery/iu,
  /generated prose/iu,
  /payment instruction/iu,
  /collection instruction/iu,
  /customer[- ]contact/iu,
  /autonomous action/iu,
];

describe("F6W policy/covenant document source-pack fixture", () => {
  it("keeps static source files and normalized expected source/wiki/policy posture", async () => {
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

    expect(manifest.id).toBe(
      "pocket-cfo-policy-covenant-document-source-pack",
    );
    expect(expected.sourcePackId).toBe(manifest.id);
    expect(expected.companyKey).toBe(
      "demo-policy-covenant-document-source-pack",
    );
    expect(manifest.sourceRoles).toEqual(expectedSourceRoles);
    expect(manifest.documentRoles).toEqual(expectedDocumentRoles);
    expect(manifest.sourceKinds).toEqual(expectedSourceKinds);
    expect(manifest.mediaTypes).toEqual(expectedMediaTypes);
    expect(manifest.expectedDocumentKinds).toEqual(expectedDocumentKinds);
    expect(expected.sourceRolesPresent).toEqual(expectedSourceRoles);
    expect(expected.documentRolesPresent).toEqual(expectedDocumentRoles);
    expect(expected.sourceKindsPresent).toEqual(expectedSourceKinds);
    expect(expected.mediaTypesPresent).toEqual(expectedMediaTypes);
    expect(expected.expectedDocumentKinds).toEqual(expectedDocumentKinds);
    expect(normalizeExpectedSourceFiles(expected.sourceFiles)).toEqual(
      manifestSourceFiles,
    );

    for (const sourceFile of manifestSourceFiles) {
      const body = readFileSync(join(fixtureRoot, sourceFile.path), "utf8");
      expect(body.trim().length).toBeGreaterThan(0);
      for (const forbidden of forbiddenFixtureTextPatterns) {
        expect(body).not.toMatch(forbidden);
      }
    }

    expect(expected.sourceRegistrationPosture).toMatchObject({
      registeredSourceCount: 2,
      uploadedSourceFileCount: 2,
      sourceFileChecksumPresent: true,
      rawFixtureFilesRewritten: false,
    });
    expect(expected.cfoWikiBindingPosture).toMatchObject({
      boundSourceCount: 2,
      includedInCompileCount: 2,
      policyDocumentBindingCount: 2,
    });
    expect(expected.deterministicExtractPosture.map((entry) => entry.documentKind)).toEqual(
      expectedDocumentKinds,
    );
    expect(expected.policyPagePosture.every((entry) => entry.pagePresent)).toBe(
      true,
    );
    expect(expected.policyCorpusPosture).toMatchObject({
      pagePresent: true,
      pageKey: "concepts/policy-corpus",
      policyPageCount: 2,
    });
    expect(expected.sourceCoveragePosture).toMatchObject({
      pagePresent: true,
      pageKey: "sources/coverage",
    });
    expect(expected.familyBoundary).toMatchObject({
      newDiscoveryFamilyAdded: false,
      newMonitorFamilyAdded: false,
    });
    expect(expected).not.toHaveProperty("expectedExtractorKeys");
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

async function loadManifest(): Promise<PolicyCovenantDocumentSourcePackManifest> {
  const manifestModule = new URL(
    "../../stack-packs/src/index.ts",
    import.meta.url,
  );
  const module = (await import(manifestModule.href)) as {
    pocketCfoPolicyCovenantDocumentSourcePack: PolicyCovenantDocumentSourcePackManifest;
  };

  return module.pocketCfoPolicyCovenantDocumentSourcePack;
}

function repoRoot() {
  return resolve(process.cwd(), "../..");
}

function loadExpectedPosture(fixtureRoot: string) {
  const posturePath = join(
    fixtureRoot,
    "expected-source-wiki-policy-posture.json",
  );

  expect(existsSync(posturePath)).toBe(true);

  return JSON.parse(readFileSync(posturePath, "utf8")) as {
    cfoWikiBindingPosture: Record<string, unknown>;
    companyKey: string;
    deterministicExtractPosture: Array<{ documentKind: string }>;
    documentRolesPresent: string[];
    expectedDocumentKinds: string[];
    familyBoundary: Record<string, boolean | string[]>;
    mediaTypesPresent: string[];
    policyCorpusPosture: Record<string, unknown>;
    policyPagePosture: Array<{ pagePresent: boolean }>;
    runtimeActionBoundary: Record<string, boolean>;
    sourceCoveragePosture: Record<string, unknown>;
    sourceFiles: ExpectedSourceFile[];
    sourceKindsPresent: string[];
    sourcePackId: string;
    sourceRegistrationPosture: Record<string, unknown>;
    sourceRolesPresent: string[];
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
    documentRole: sourceFile.documentRole,
    expectedDocumentKind: sourceFile.expectedDocumentKind,
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
    documentRole: sourceFile.documentRole,
    expectedDocumentKind: sourceFile.expectedDocumentKind,
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
