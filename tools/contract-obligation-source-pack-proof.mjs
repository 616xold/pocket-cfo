import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  FINANCE_DISCOVERY_QUESTION_KINDS,
  MonitorKindSchema,
} from "@pocket-cto/domain";
import { buildApp } from "../apps/control-plane/src/app.ts";
import { createContainer } from "../apps/control-plane/src/bootstrap.ts";
import { loadEnv } from "../packages/config/src/index.ts";
import { closeAllPools, getPool } from "../packages/db/src/client.ts";
import { pocketCfoContractObligationSourcePack } from "../packages/stack-packs/src/index.ts";
import { loadNearestEnvFile } from "./m2-exit-utils.mjs";

const MODULE_PATH = fileURLToPath(import.meta.url);
const CREATED_BY = "contract-obligation-source-pack-proof";
const COMPANY_NAME = "Demo Contract/Obligation Source Pack";
const EXPECTED_DISCOVERY_FAMILIES = [
  "cash_posture",
  "collections_pressure",
  "payables_pressure",
  "spend_posture",
  "obligation_calendar_review",
  "policy_lookup",
];
const EXPECTED_MONITOR_FAMILIES = [
  "cash_posture",
  "collections_pressure",
  "payables_pressure",
  "policy_covenant_threshold",
];
const REPORT_ARTIFACT_KINDS = [
  "finance_memo",
  "evidence_appendix",
  "board_packet",
  "lender_update",
  "diligence_packet",
];
const LINEAGE_TARGET_KIND_BY_COUNT_KEY = {
  contractCount: "contract",
  contractObligationCount: "contract_obligation",
};
const VOLATILE_EXPECTED_POSTURE_KEYS = new Set([
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

async function main() {
  loadNearestEnvFile();

  const fixture = await loadFixture();
  const pool = getPool(loadEnv().DATABASE_URL);
  let app = null;

  try {
    assertManifestBoundary(fixture.expected, fixture.sourceFiles);
    const familyBoundary = assertFamiliesUnchanged();
    const sourceHashesBefore = hashLoadedFiles(fixture.files);
    const before = await readBoundaryCounts(pool);
    const capturedAt = new Date().toISOString();

    const container = await createContainer();
    app = await buildApp({ container });
    app.log.level = "silent";

    const registered = await registerSources(app, fixture, capturedAt);
    const syncs = await syncSources(app, fixture, registered);
    const views = await readFinanceTwinViews(app, fixture.expected.companyKey);
    const after = await readBoundaryCounts(pool);
    const runtimeActionBoundary = assertRuntimeActionBoundary(before, after);
    const actual = normalizePosture({
      expected: fixture.expected,
      familyBoundary,
      registered,
      runtimeActionBoundary,
      sourceFiles: fixture.sourceFiles,
      syncs,
      views,
    });

    assertJsonEqual("normalized source/twin posture", actual, fixture.expected);

    const rawFixtureSourcesUnchanged = await assertFixtureSourcesUnchanged(
      fixture.files,
      sourceHashesBefore,
    );

    console.log(
      JSON.stringify({
        sourcePackId: pocketCfoContractObligationSourcePack.id,
        companyKey: fixture.expected.companyKey,
        sourceRolesVerified: true,
        expectedPostureVerified: true,
        rawFixtureSourcesUnchanged,
        contractInventoryVerified: true,
        obligationCalendarVerified: true,
        newMonitorFamilyAdded: false,
        newDiscoveryFamilyAdded: false,
        monitorRunTriggered: false,
        missionCreated: false,
        reportCreated: false,
        approvalCreated: false,
        deliveryCreated: false,
        providerCallCreated: false,
        runtimeCodexUsed: false,
        generatedProseCreated: false,
        autonomousActionCreated: false,
      }),
    );
  } finally {
    if (app) {
      await app.close();
    }

    await closeAllPools();
  }
}

async function loadFixture() {
  const fixtureRoot = resolve(
    pocketCfoContractObligationSourcePack.fixtureDirectory,
  );
  const sourceFiles = normalizeManifestSourceFiles();
  const expected = JSON.parse(
    await readFile(
      resolve(
        pocketCfoContractObligationSourcePack.expectedNormalizedPosturePath,
      ),
      "utf8",
    ),
  );
  const files = new Map();

  for (const sourceFile of sourceFiles) {
    const absolutePath = join(fixtureRoot, sourceFile.path);
    const body = await readFile(absolutePath);

    if (body.toString("utf8").trim().length === 0) {
      throw new Error(`Manifest source file is empty: ${sourceFile.path}`);
    }

    files.set(sourceFile.role, {
      absolutePath,
      body,
      checksumSha256: createHash("sha256").update(body).digest("hex"),
      descriptor: sourceFile,
    });
  }

  return { expected, files, fixtureRoot, sourceFiles };
}

function assertManifestBoundary(expected, sourceFiles) {
  assertJsonEqual(
    "source-pack roles",
    pocketCfoContractObligationSourcePack.sourceRoles,
    expected.sourceRolesPresent,
  );
  assertJsonEqual(
    "source-pack extractor keys",
    pocketCfoContractObligationSourcePack.expectedExtractorKeys,
    expected.extractorKeysUsed,
  );
  assertJsonEqual(
    "source-pack source files",
    sourceFiles,
    normalizeExpectedSourceFiles(expected.sourceFiles),
  );

  if (
    pocketCfoContractObligationSourcePack.sourceRoles.length !== 1 ||
    pocketCfoContractObligationSourcePack.sourceRoles[0] !== "contract_metadata"
  ) {
    throw new Error("F6R source pack must be limited to contract_metadata");
  }

  if (
    pocketCfoContractObligationSourcePack.expectedExtractorKeys.length !== 1 ||
    pocketCfoContractObligationSourcePack.expectedExtractorKeys[0] !==
      "contract_metadata_csv"
  ) {
    throw new Error("F6R source pack must be limited to contract_metadata_csv");
  }

  const volatileKeys = findVolatileKeys(expected);

  if (volatileKeys.length > 0) {
    throw new Error(
      `Expected posture contains volatile generated fields: ${volatileKeys.join(
        ", ",
      )}`,
    );
  }

  for (const forbidden of [
    "monitorFamiliesCovered",
    "discoveryFamiliesCovered",
  ]) {
    if (Object.hasOwn(pocketCfoContractObligationSourcePack, forbidden)) {
      throw new Error(`Source pack must not declare ${forbidden}`);
    }
  }
}

async function registerSources(app, fixture, capturedAt) {
  const registered = {};

  for (const sourceFile of fixture.sourceFiles) {
    const file = fixture.files.get(sourceFile.role);

    if (!file) {
      throw new Error(`Missing fixture file for ${sourceFile.role}`);
    }

    const created = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        createdBy: CREATED_BY,
        description: `F6R contract/obligation source-pack source for ${sourceFile.role}.`,
        kind: sourceFile.sourceKind,
        name: `F6R ${sourceFile.role} ${fixture.expected.companyKey}`,
        snapshot: {
          capturedAt,
          checksumSha256: file.checksumSha256,
          mediaType: sourceFile.mediaType,
          originalFileName: basename(sourceFile.path),
          sizeBytes: file.body.byteLength,
          storageKind: "local_path",
          storageRef: file.absolutePath,
        },
      },
      url: "/sources",
    });
    const uploaded = await injectJson(app, {
      expectedStatus: 201,
      headers: { "content-type": "application/octet-stream" },
      method: "POST",
      payload: file.body,
      url: `/sources/${requireString(created?.source?.id, "source id")}/files?${new URLSearchParams(
        {
          capturedAt,
          createdBy: CREATED_BY,
          mediaType: sourceFile.mediaType,
          originalFileName: basename(sourceFile.path),
        },
      ).toString()}`,
    });

    registered[sourceFile.role] = { created, descriptor: sourceFile, uploaded };
  }

  return registered;
}

async function syncSources(app, fixture, registered) {
  const syncs = {};

  for (const sourceFile of fixture.sourceFiles) {
    const sourceFileId = requireString(
      registered[sourceFile.role]?.uploaded?.sourceFile?.id,
      `${sourceFile.role} source file id`,
    );
    const synced = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: { companyName: COMPANY_NAME },
      url: `/finance-twin/companies/${fixture.expected.companyKey}/source-files/${sourceFileId}/sync`,
    });

    if (synced.syncRun?.extractorKey !== sourceFile.expectedExtractorKey) {
      throw new Error(
        `${sourceFile.role} synced with ${synced.syncRun?.extractorKey}`,
      );
    }

    syncs[sourceFile.role] = synced.syncRun;
  }

  return syncs;
}

async function readFinanceTwinViews(app, companyKey) {
  const [contracts, obligationCalendar] = await Promise.all([
    injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/finance-twin/companies/${companyKey}/contracts`,
    }),
    injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/finance-twin/companies/${companyKey}/obligation-calendar`,
    }),
  ]);

  return { contracts, obligationCalendar };
}

function normalizePosture(input) {
  const coverage = input.views.contracts.latestSuccessfulSlice.coverage;

  return {
    sourcePackId: pocketCfoContractObligationSourcePack.id,
    companyKey: input.expected.companyKey,
    sourceRolesPresent: pocketCfoContractObligationSourcePack.sourceRoles,
    extractorKeysUsed: input.sourceFiles.map(
      (sourceFile) => input.syncs[sourceFile.role].extractorKey,
    ),
    sourceFiles: input.sourceFiles,
    sourcePostureByRole: {
      contract_metadata: normalizeRolePosture(
        input.registered.contract_metadata,
        input.views.contracts,
        coverage,
      ),
    },
    contractInventoryPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.contracts.freshness.state,
      contractCount: input.views.contracts.contractCount,
      contractLabels: input.views.contracts.contracts.map(
        (row) => row.contract.contractLabel,
      ),
      coverage: normalizeCoverage(coverage),
      summary: input.views.contracts.latestSuccessfulSlice.summary,
      lineageRefsPresent: input.views.contracts.contracts.every(
        (row) => row.lineageRef?.targetKind === "contract",
      ),
      limitationsPresent: input.views.contracts.limitations.length > 0,
      diagnosticsPresent: input.views.contracts.diagnostics.length > 0,
    },
    obligationCalendarPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.obligationCalendar.freshness.state,
      obligationCount:
        input.views.obligationCalendar.upcomingObligations.length,
      obligationTypes:
        input.views.obligationCalendar.upcomingObligations.map(
          (row) => row.obligationType,
        ),
      coverageSummary: input.views.obligationCalendar.coverageSummary,
      currencyBuckets: input.views.obligationCalendar.currencyBuckets,
      lineageRefsPresent:
        input.views.obligationCalendar.upcomingObligations.every(
          (row) => row.lineageRef?.targetKind === "contract_obligation",
        ),
      limitationsPresent:
        input.views.obligationCalendar.limitations.length > 0,
      diagnosticsPresent:
        input.views.obligationCalendar.diagnostics.length > 0,
    },
    familyBoundary: input.familyBoundary,
    runtimeActionBoundary: input.runtimeActionBoundary,
  };
}

function normalizeRolePosture(registered, view, coverage) {
  return {
    sourceKind: registered.descriptor.sourceKind,
    mediaType: registered.descriptor.mediaType,
    extractorKey: registered.descriptor.expectedExtractorKey,
    sourceRegistered: Boolean(registered.created?.source?.id),
    sourceFileUploaded: Boolean(registered.uploaded?.sourceFile?.id),
    sourceSnapshotPresent: (registered.created?.snapshots?.length ?? 0) > 0,
    sourceFileChecksumPresent:
      typeof registered.uploaded?.sourceFile?.checksumSha256 === "string",
    freshnessState: view.freshness.state,
    sourceBackedState: "source_backed",
    lineagePresent: coverage.lineageCount > 0,
    limitationsPresent: view.limitations.length > 0,
  };
}

function normalizeCoverage(coverage) {
  const { lineageTargetCounts, ...stableCoverage } = coverage;

  return {
    ...stableCoverage,
    lineageTargetKinds: Object.entries(lineageTargetCounts)
      .filter(([, count]) => count > 0)
      .map(([key]) => LINEAGE_TARGET_KIND_BY_COUNT_KEY[key])
      .filter(Boolean)
      .sort(),
  };
}

function assertRuntimeActionBoundary(before, after) {
  const comparisons = [
    ["monitorResults", "monitorRunTriggered"],
    ["missions", "missionCreated"],
    ["reportArtifacts", "reportCreated"],
    ["approvals", "approvalCreated"],
    ["outboxEvents", "deliveryCreated"],
    ["providerCalls", "providerCallCreated"],
    ["providerCredentials", "providerCredentialCreated"],
    ["providerJobs", "providerJobCreated"],
    ["taskRuntimeThreads", "runtimeCodexUsed"],
    ["generatedProse", "generatedProseCreated"],
    ["paymentInstructions", "paymentInstructionCreated"],
    ["accountingWrites", "accountingWriteCreated"],
    ["bankWrites", "bankWriteCreated"],
    ["taxFilings", "taxFilingCreated"],
    ["legalAdvice", "legalAdviceGenerated"],
    ["policyAdvice", "policyAdviceGenerated"],
    ["collectionInstructions", "collectionInstructionCreated"],
    ["customerContactInstructions", "customerContactInstructionCreated"],
    ["certifications", "certificationCreated"],
    ["closeCompletes", "closeCompleteCreated"],
    ["signOffs", "signOffCreated"],
    ["attestations", "attestationCreated"],
    ["legalOpinions", "legalOpinionCreated"],
    ["auditOpinions", "auditOpinionCreated"],
    ["assurances", "assuranceCreated"],
    ["autonomousActions", "autonomousActionCreated"],
  ];
  const boundary = {
    monitorRunTriggered: false,
    checklistReadTriggered: false,
    operatorReadinessReadTriggered: false,
    acknowledgementReadTriggered: false,
    deliveryReadinessReadTriggered: false,
    reviewSummaryReadTriggered: false,
    providerBoundaryReadTriggered: false,
    certificationBoundaryReadTriggered: false,
  };

  for (const [countKey, boundaryKey] of comparisons) {
    if (after[countKey] !== before[countKey]) {
      throw new Error(`${boundaryKey} changed ${countKey}`);
    }

    boundary[boundaryKey] = false;
  }

  boundary.sourceMutationOutsideUploadSync = false;

  return boundary;
}

async function readBoundaryCounts(pool) {
  const [
    accountingWrites,
    approvals,
    assurances,
    attestations,
    auditOpinions,
    autonomousActions,
    bankWrites,
    certifications,
    closeCompletes,
    collectionInstructions,
    customerContactInstructions,
    generatedProse,
    legalAdvice,
    legalOpinions,
    missions,
    monitorResults,
    outboxEvents,
    paymentInstructions,
    policyAdvice,
    providerCalls,
    providerCredentials,
    providerJobs,
    reportArtifacts,
    signOffs,
    taxFilings,
    taskRuntimeThreads,
  ] = await Promise.all([
    readOptionalCount(pool, "accounting_writes"),
    readScalar(pool, "select count(*)::int as count from approvals", []),
    readOptionalAnyCount(pool, ["assurances", "assurance_artifacts"]),
    readOptionalAnyCount(pool, ["attestations", "attestation_records"]),
    readOptionalAnyCount(pool, ["audit_opinions", "audit_opinion_records"]),
    readOptionalCount(pool, "autonomous_actions"),
    readOptionalCount(pool, "bank_writes"),
    readOptionalAnyCount(pool, ["certifications", "certification_records"]),
    readOptionalAnyCount(pool, ["close_completes", "close_complete_records"]),
    readOptionalCount(pool, "collection_instructions"),
    readOptionalCount(pool, "customer_contact_instructions"),
    readOptionalCount(pool, "generated_prose"),
    readOptionalCount(pool, "legal_advice"),
    readOptionalAnyCount(pool, ["legal_opinions", "legal_opinion_records"]),
    readScalar(pool, "select count(*)::int as count from missions", []),
    readScalar(pool, "select count(*)::int as count from monitor_results", []),
    readScalar(pool, "select count(*)::int as count from outbox_events", []),
    readOptionalCount(pool, "payment_instructions"),
    readOptionalCount(pool, "policy_advice"),
    readOptionalAnyCount(pool, ["provider_calls", "external_provider_calls"]),
    readOptionalAnyCount(pool, [
      "provider_credentials",
      "external_provider_credentials",
    ]),
    readOptionalAnyCount(pool, ["provider_jobs", "external_provider_jobs"]),
    readReportArtifactCount(pool),
    readOptionalAnyCount(pool, ["sign_offs", "sign_off_records"]),
    readOptionalCount(pool, "tax_filings"),
    readScalar(
      pool,
      "select count(*)::int as count from mission_tasks where codex_thread_id is not null",
      [],
    ),
  ]);

  return {
    accountingWrites,
    approvals,
    assurances,
    attestations,
    auditOpinions,
    autonomousActions,
    bankWrites,
    certifications,
    closeCompletes,
    collectionInstructions,
    customerContactInstructions,
    generatedProse,
    legalAdvice,
    legalOpinions,
    missions,
    monitorResults,
    outboxEvents,
    paymentInstructions,
    policyAdvice,
    providerCalls,
    providerCredentials,
    providerJobs,
    reportArtifacts,
    signOffs,
    taxFilings,
    taskRuntimeThreads,
  };
}

async function readReportArtifactCount(pool) {
  const result = await pool.query(
    "select count(*)::int as count from artifacts where kind = any($1::artifact_kind[])",
    [REPORT_ARTIFACT_KINDS],
  );

  return Number(result.rows[0]?.count ?? 0);
}

async function readOptionalAnyCount(pool, tableNames) {
  let count = 0;

  for (const tableName of tableNames) {
    count += await readOptionalCount(pool, tableName);
  }

  return count;
}

async function readOptionalCount(pool, tableName) {
  const exists = await pool.query("select to_regclass($1) as table_name", [
    `public.${tableName}`,
  ]);

  if (!exists.rows[0]?.table_name) {
    return 0;
  }

  return readScalar(
    pool,
    `select count(*)::int as count from ${tableName}`,
    [],
  );
}

async function readScalar(pool, query, values) {
  const result = await pool.query(query, values);

  return Number(result.rows[0]?.count ?? 0);
}

function assertFamiliesUnchanged() {
  assertJsonEqual(
    "discovery family list",
    FINANCE_DISCOVERY_QUESTION_KINDS,
    EXPECTED_DISCOVERY_FAMILIES,
  );
  assertJsonEqual(
    "monitor family list",
    MonitorKindSchema.options,
    EXPECTED_MONITOR_FAMILIES,
  );

  return {
    newMonitorFamilyAdded: false,
    newDiscoveryFamilyAdded: false,
  };
}

function normalizeManifestSourceFiles() {
  return pocketCfoContractObligationSourcePack.sourceFiles.map(
    (sourceFile) => ({
      role: sourceFile.role,
      path: sourceFile.fixturePath,
      sourceKind: sourceFile.sourceKind,
      mediaType: sourceFile.mediaType,
      expectedExtractorKey: sourceFile.expectedExtractorKey,
    }),
  );
}

function normalizeExpectedSourceFiles(sourceFiles) {
  return sourceFiles.map((sourceFile) => ({
    role: sourceFile.role,
    path: sourceFile.path,
    sourceKind: sourceFile.sourceKind,
    mediaType: sourceFile.mediaType,
    expectedExtractorKey: sourceFile.expectedExtractorKey,
  }));
}

function hashLoadedFiles(files) {
  return Object.fromEntries(
    Array.from(files.entries()).map(([role, file]) => [
      role,
      file.checksumSha256,
    ]),
  );
}

async function assertFixtureSourcesUnchanged(files, expectedHashes) {
  for (const [role, file] of files.entries()) {
    const currentHash = createHash("sha256")
      .update(await readFile(file.absolutePath))
      .digest("hex");

    if (currentHash !== expectedHashes[role]) {
      throw new Error(`Fixture source changed during proof: ${role}`);
    }
  }

  return true;
}

async function injectJson(app, input) {
  const response = await app.inject({
    headers: input.headers,
    method: input.method,
    payload: input.payload,
    url: input.url,
  });

  if (response.statusCode !== input.expectedStatus) {
    throw new Error(
      `${input.method} ${input.url} failed with ${response.statusCode}: ${response.body}`,
    );
  }

  return response.body ? response.json() : null;
}

function requireString(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} missing from response`);
  }

  return value;
}

function findVolatileKeys(value, path = "$") {
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
      ...(VOLATILE_EXPECTED_POSTURE_KEYS.has(key) ? [entryPath] : []),
      ...findVolatileKeys(entry, entryPath),
    ];
  });
}

function assertJsonEqual(label, actual, expected) {
  const actualJson = stableStringify(actual);
  const expectedJson = stableStringify(expected);

  if (actualJson !== expectedJson) {
    throw new Error(
      `${label} mismatch:\nexpected=${expectedJson}\nactual=${actualJson}`,
    );
  }
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
  }

  if (!value || typeof value !== "object") {
    return JSON.stringify(value);
  }

  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}

if (process.argv[1] && resolve(process.argv[1]) === MODULE_PATH) {
  await main();
}
