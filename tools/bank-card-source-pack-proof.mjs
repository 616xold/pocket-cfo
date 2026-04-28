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
import { pocketCfoBankCardSourcePack } from "../packages/stack-packs/src/index.ts";
import { loadNearestEnvFile } from "./m2-exit-utils.mjs";

const MODULE_PATH = fileURLToPath(import.meta.url);
const CREATED_BY = "bank-card-source-pack-proof";
const COMPANY_NAME = "Demo Bank/Card Source Pack";
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
  bankAccountCount: "bank_account",
  bankAccountSummaryCount: "bank_account_summary",
  spendRowCount: "spend_row",
};

async function main() {
  loadNearestEnvFile();

  const fixture = await loadFixture();
  const pool = getPool(loadEnv().DATABASE_URL);
  let app = null;

  try {
    assertManifestBoundary(fixture.expected);
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
        sourcePackId: pocketCfoBankCardSourcePack.id,
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
  const fixtureRoot = resolve(pocketCfoBankCardSourcePack.fixtureDirectory);
  const expected = JSON.parse(
    await readFile(
      resolve(pocketCfoBankCardSourcePack.expectedNormalizedPosturePath),
      "utf8",
    ),
  );
  const files = new Map();

  for (const sourceFile of expected.sourceFiles) {
    const absolutePath = join(fixtureRoot, sourceFile.path);
    const body = await readFile(absolutePath);
    files.set(sourceFile.role, {
      absolutePath,
      body,
      checksumSha256: createHash("sha256").update(body).digest("hex"),
      descriptor: sourceFile,
    });
  }

  return { expected, files, fixtureRoot };
}

function assertManifestBoundary(expected) {
  assertJsonEqual(
    "source-pack roles",
    pocketCfoBankCardSourcePack.sourceRoles,
    expected.sourceRolesPresent,
  );
  assertJsonEqual(
    "source-pack extractor keys",
    pocketCfoBankCardSourcePack.expectedExtractorKeys,
    expected.extractorKeysUsed,
  );

  for (const forbidden of [
    "monitorFamiliesCovered",
    "discoveryFamiliesCovered",
  ]) {
    if (Object.hasOwn(pocketCfoBankCardSourcePack, forbidden)) {
      throw new Error(`Source pack must not declare ${forbidden}`);
    }
  }
}

async function registerSources(app, fixture, capturedAt) {
  const registered = {};

  for (const sourceFile of fixture.expected.sourceFiles) {
    const file = fixture.files.get(sourceFile.role);

    if (!file) {
      throw new Error(`Missing fixture file for ${sourceFile.role}`);
    }

    const created = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        createdBy: CREATED_BY,
        description: `F6L bank/card source-pack source for ${sourceFile.role}.`,
        kind: sourceFile.sourceKind,
        name: `F6L ${sourceFile.role} ${fixture.expected.companyKey}`,
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

  for (const sourceFile of fixture.expected.sourceFiles) {
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
  const [bankAccounts, cashPosture, spendItems, spendPosture] =
    await Promise.all([
      injectJson(app, {
        expectedStatus: 200,
        method: "GET",
        url: `/finance-twin/companies/${companyKey}/bank-accounts`,
      }),
      injectJson(app, {
        expectedStatus: 200,
        method: "GET",
        url: `/finance-twin/companies/${companyKey}/cash-posture`,
      }),
      injectJson(app, {
        expectedStatus: 200,
        method: "GET",
        url: `/finance-twin/companies/${companyKey}/spend-items`,
      }),
      injectJson(app, {
        expectedStatus: 200,
        method: "GET",
        url: `/finance-twin/companies/${companyKey}/spend-posture`,
      }),
    ]);

  return { bankAccounts, cashPosture, spendItems, spendPosture };
}

function normalizePosture(input) {
  const bankCoverage = input.views.bankAccounts.latestSuccessfulSlice.coverage;
  const cardCoverage = input.views.spendItems.latestSuccessfulSlice.coverage;

  return {
    sourcePackId: pocketCfoBankCardSourcePack.id,
    companyKey: input.expected.companyKey,
    sourceRolesPresent: pocketCfoBankCardSourcePack.sourceRoles,
    extractorKeysUsed: input.expected.sourceFiles.map(
      (sourceFile) => input.syncs[sourceFile.role].extractorKey,
    ),
    sourceFiles: input.expected.sourceFiles,
    sourcePostureByRole: {
      bank_account_summary: normalizeRolePosture(
        input.registered.bank_account_summary,
        input.views.bankAccounts,
        bankCoverage,
      ),
      card_expense: normalizeRolePosture(
        input.registered.card_expense,
        input.views.spendItems,
        cardCoverage,
      ),
    },
    bankAccountInventoryPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.bankAccounts.freshness.state,
      accountCount: input.views.bankAccounts.accountCount,
      coverage: normalizeCoverage(bankCoverage),
      summary: input.views.bankAccounts.latestSuccessfulSlice.summary,
      limitationsPresent: input.views.bankAccounts.limitations.length > 0,
      diagnosticsPresent: input.views.bankAccounts.diagnostics.length > 0,
    },
    cashPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.cashPosture.freshness.state,
      coverageSummary: input.views.cashPosture.coverageSummary,
      currencyBuckets: input.views.cashPosture.currencyBuckets,
      limitationsPresent: input.views.cashPosture.limitations.length > 0,
      diagnosticsPresent: input.views.cashPosture.diagnostics.length > 0,
    },
    cardSpendItemPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.spendItems.freshness.state,
      rowCount: input.views.spendItems.rowCount,
      coverage: normalizeCoverage(cardCoverage),
      summary: input.views.spendItems.latestSuccessfulSlice.summary,
      limitationsPresent: input.views.spendItems.limitations.length > 0,
      diagnosticsPresent: input.views.spendItems.diagnostics.length > 0,
    },
    spendPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.spendPosture.freshness.state,
      coverageSummary: input.views.spendPosture.coverageSummary,
      currencyBuckets: input.views.spendPosture.currencyBuckets,
      limitationsPresent: input.views.spendPosture.limitations.length > 0,
      diagnosticsPresent: input.views.spendPosture.diagnostics.length > 0,
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
    ["taskRuntimeThreads", "runtimeCodexUsed"],
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
  };

  for (const [countKey, boundaryKey] of comparisons) {
    if (after[countKey] !== before[countKey]) {
      throw new Error(`${boundaryKey} changed ${countKey}`);
    }

    boundary[boundaryKey] = false;
  }

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

function assertJsonEqual(label, actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${label} mismatch:\nexpected=${JSON.stringify(expected)}\nactual=${JSON.stringify(actual)}`,
    );
  }
}

if (process.argv[1] && resolve(process.argv[1]) === MODULE_PATH) {
  await main();
}
