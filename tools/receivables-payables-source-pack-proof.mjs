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
import { pocketCfoReceivablesPayablesSourcePack } from "../packages/stack-packs/src/index.ts";
import { loadNearestEnvFile } from "./m2-exit-utils.mjs";

const MODULE_PATH = fileURLToPath(import.meta.url);
const CREATED_BY = "receivables-payables-source-pack-proof";
const COMPANY_NAME = "Demo Receivables/Payables Source Pack";
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
  customerCount: "customer",
  payablesAgingRowCount: "payables_aging_row",
  receivablesAgingRowCount: "receivables_aging_row",
  vendorCount: "vendor",
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

    assertJsonEqual("normalized source/twin posture", fixture.expected, actual);

    const rawFixtureSourcesUnchanged = await assertFixtureSourcesUnchanged(
      fixture.files,
      sourceHashesBefore,
    );

    console.log(
      JSON.stringify({
        sourcePackId: pocketCfoReceivablesPayablesSourcePack.id,
        companyKey: fixture.expected.companyKey,
        sourceRolesVerified: true,
        expectedPostureVerified: true,
        rawFixtureSourcesUnchanged,
        newMonitorFamilyAdded: false,
        newDiscoveryFamilyAdded: false,
        monitorRunTriggered: false,
        missionCreated: false,
        reportCreated: false,
        approvalCreated: false,
        deliveryCreated: false,
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
    pocketCfoReceivablesPayablesSourcePack.fixtureDirectory,
  );
  const sourceFiles = normalizeManifestSourceFiles();
  const expected = JSON.parse(
    await readFile(
      resolve(
        pocketCfoReceivablesPayablesSourcePack.expectedNormalizedPosturePath,
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
    pocketCfoReceivablesPayablesSourcePack.sourceRoles,
    expected.sourceRolesPresent,
  );
  assertJsonEqual(
    "source-pack extractor keys",
    pocketCfoReceivablesPayablesSourcePack.expectedExtractorKeys,
    expected.extractorKeysUsed,
  );
  assertJsonEqual(
    "source-pack source files",
    sourceFiles,
    normalizeExpectedSourceFiles(expected.sourceFiles),
  );

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
    if (Object.hasOwn(pocketCfoReceivablesPayablesSourcePack, forbidden)) {
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
        description: `F6O receivables/payables source-pack source for ${sourceFile.role}.`,
        kind: sourceFile.sourceKind,
        name: `F6O ${sourceFile.role} ${fixture.expected.companyKey}`,
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
  const [
    receivablesAging,
    collectionsPosture,
    payablesAging,
    payablesPosture,
  ] = await Promise.all([
    injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/finance-twin/companies/${companyKey}/receivables-aging`,
    }),
    injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/finance-twin/companies/${companyKey}/collections-posture`,
    }),
    injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/finance-twin/companies/${companyKey}/payables-aging`,
    }),
    injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/finance-twin/companies/${companyKey}/payables-posture`,
    }),
  ]);

  return {
    collectionsPosture,
    payablesAging,
    payablesPosture,
    receivablesAging,
  };
}

function normalizePosture(input) {
  const receivablesCoverage =
    input.views.receivablesAging.latestSuccessfulSlice.coverage;
  const payablesCoverage =
    input.views.payablesAging.latestSuccessfulSlice.coverage;

  return {
    sourcePackId: pocketCfoReceivablesPayablesSourcePack.id,
    companyKey: input.expected.companyKey,
    sourceRolesPresent: pocketCfoReceivablesPayablesSourcePack.sourceRoles,
    extractorKeysUsed: input.sourceFiles.map(
      (sourceFile) => input.syncs[sourceFile.role].extractorKey,
    ),
    sourceFiles: input.sourceFiles,
    sourcePostureByRole: {
      receivables_aging: normalizeRolePosture(
        input.registered.receivables_aging,
        input.views.receivablesAging,
        receivablesCoverage,
      ),
      payables_aging: normalizeRolePosture(
        input.registered.payables_aging,
        input.views.payablesAging,
        payablesCoverage,
      ),
    },
    receivablesAgingPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.receivablesAging.freshness.state,
      customerCount: input.views.receivablesAging.customerCount,
      customerLabels: input.views.receivablesAging.rows
        .map((row) => row.customer.customerLabel)
        .sort(),
      coverage: normalizeCoverage(receivablesCoverage),
      summary: input.views.receivablesAging.latestSuccessfulSlice.summary,
      lineageRefsPresent: input.views.receivablesAging.rows.every(
        (row) => row.lineageRef?.targetKind === "receivables_aging_row",
      ),
      limitationsPresent: input.views.receivablesAging.limitations.length > 0,
      diagnosticsPresent: input.views.receivablesAging.diagnostics.length > 0,
    },
    collectionsPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.collectionsPosture.freshness.state,
      coverageSummary: input.views.collectionsPosture.coverageSummary,
      currencyBuckets: normalizeCollectionsBuckets(
        input.views.collectionsPosture.currencyBuckets,
      ),
      limitationsPresent: input.views.collectionsPosture.limitations.length > 0,
      diagnosticsPresent: input.views.collectionsPosture.diagnostics.length > 0,
    },
    payablesAgingPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.payablesAging.freshness.state,
      vendorCount: input.views.payablesAging.vendorCount,
      vendorLabels: input.views.payablesAging.rows
        .map((row) => row.vendor.vendorLabel)
        .sort(),
      coverage: normalizeCoverage(payablesCoverage),
      summary: input.views.payablesAging.latestSuccessfulSlice.summary,
      lineageRefsPresent: input.views.payablesAging.rows.every(
        (row) => row.lineageRef?.targetKind === "payables_aging_row",
      ),
      limitationsPresent: input.views.payablesAging.limitations.length > 0,
      diagnosticsPresent: input.views.payablesAging.diagnostics.length > 0,
    },
    payablesPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.payablesPosture.freshness.state,
      coverageSummary: input.views.payablesPosture.coverageSummary,
      currencyBuckets: normalizePayablesBuckets(
        input.views.payablesPosture.currencyBuckets,
      ),
      limitationsPresent: input.views.payablesPosture.limitations.length > 0,
      diagnosticsPresent: input.views.payablesPosture.diagnostics.length > 0,
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

function normalizeCollectionsBuckets(currencyBuckets) {
  return currencyBuckets.map((bucket) => ({
    currency: bucket.currency,
    totalReceivables: bucket.totalReceivables,
    currentBucketTotal: bucket.currentBucketTotal,
    pastDueBucketTotal: bucket.pastDueBucketTotal,
    customerCount: bucket.customerCount,
    datedCustomerCount: bucket.datedCustomerCount,
    undatedCustomerCount: bucket.undatedCustomerCount,
    mixedAsOfDates: bucket.mixedAsOfDates,
    earliestAsOfDate: bucket.earliestAsOfDate,
    latestAsOfDate: bucket.latestAsOfDate,
  }));
}

function normalizePayablesBuckets(currencyBuckets) {
  return currencyBuckets.map((bucket) => ({
    currency: bucket.currency,
    totalPayables: bucket.totalPayables,
    currentBucketTotal: bucket.currentBucketTotal,
    pastDueBucketTotal: bucket.pastDueBucketTotal,
    vendorCount: bucket.vendorCount,
    datedVendorCount: bucket.datedVendorCount,
    undatedVendorCount: bucket.undatedVendorCount,
    mixedAsOfDates: bucket.mixedAsOfDates,
    earliestAsOfDate: bucket.earliestAsOfDate,
    latestAsOfDate: bucket.latestAsOfDate,
  }));
}

function assertRuntimeActionBoundary(before, after) {
  const comparisons = [
    ["monitorResults", "monitorRunTriggered"],
    ["missions", "missionCreated"],
    ["reportArtifacts", "reportCreated"],
    ["approvals", "approvalCreated"],
    ["outboxEvents", "deliveryCreated"],
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
    ["autonomousActions", "autonomousActionCreated"],
  ];
  const boundary = {
    monitorRunTriggered: false,
    checklistReadTriggered: false,
    operatorReadinessReadTriggered: false,
    acknowledgementReadTriggered: false,
    deliveryReadinessReadTriggered: false,
    reviewSummaryReadTriggered: false,
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
    autonomousActions,
    bankWrites,
    collectionInstructions,
    customerContactInstructions,
    generatedProse,
    legalAdvice,
    missions,
    monitorResults,
    outboxEvents,
    paymentInstructions,
    policyAdvice,
    reportArtifacts,
    taxFilings,
    taskRuntimeThreads,
  ] = await Promise.all([
    readOptionalCount(pool, "accounting_writes"),
    readScalar(pool, "select count(*)::int as count from approvals", []),
    readOptionalCount(pool, "autonomous_actions"),
    readOptionalCount(pool, "bank_writes"),
    readOptionalCount(pool, "collection_instructions"),
    readOptionalCount(pool, "customer_contact_instructions"),
    readOptionalCount(pool, "generated_prose"),
    readOptionalCount(pool, "legal_advice"),
    readScalar(pool, "select count(*)::int as count from missions", []),
    readScalar(pool, "select count(*)::int as count from monitor_results", []),
    readScalar(pool, "select count(*)::int as count from outbox_events", []),
    readOptionalCount(pool, "payment_instructions"),
    readOptionalCount(pool, "policy_advice"),
    readReportArtifactCount(pool),
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
    autonomousActions,
    bankWrites,
    collectionInstructions,
    customerContactInstructions,
    generatedProse,
    legalAdvice,
    missions,
    monitorResults,
    outboxEvents,
    paymentInstructions,
    policyAdvice,
    reportArtifacts,
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
  return pocketCfoReceivablesPayablesSourcePack.sourceFiles.map(
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
