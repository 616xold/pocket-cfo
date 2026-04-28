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
import { pocketCfoMonitorDemoPack } from "../packages/stack-packs/src/index.ts";
import { loadNearestEnvFile } from "./m2-exit-utils.mjs";

const DEFAULT_CREATED_BY = "close-control-checklist-smoke";
const MODULE_PATH = fileURLToPath(import.meta.url);
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

async function main() {
  loadNearestEnvFile();

  const fixture = await loadFixture();
  const runTag = buildRunTag();
  const capturedAt = new Date().toISOString();
  const pool = getPool(loadEnv().DATABASE_URL);
  let app = null;

  try {
    assertFamiliesUnchanged();

    const container = await createContainer();
    app = await buildApp({ container });
    app.log.level = "silent";

    const registered = await registerFixtureSources(app, {
      capturedAt,
      expected: fixture.expected,
      files: fixture.files,
    });
    await syncFinanceSources(app, {
      company: fixture.expected.demoCompany,
      registered,
    });
    await bindAndCompilePolicyDocument(app, {
      companyKey: fixture.expected.demoCompany.companyKey,
      registered,
    });

    const monitorRuns = await runExpectedMonitors(app, {
      companyKey: fixture.expected.demoCompany.companyKey,
      runTag,
    });
    const beforeDemoChecklist = await readBoundaryCounts(pool);
    const demoChecklist = await readChecklist(app, {
      companyKey: fixture.expected.demoCompany.companyKey,
    });
    const afterDemoChecklist = await readBoundaryCounts(pool);

    assertChecklistShape(
      demoChecklist,
      fixture.expected.demoCompany.companyKey,
    );
    assertFreshSourceChecklistPosture(demoChecklist);
    assertLimitedPostureNeedsReview(demoChecklist);
    assertMonitorReplayContextOnly(demoChecklist, monitorRuns);
    assertChecklistBoundaryFalse(demoChecklist);
    assertNoSideEffects(beforeDemoChecklist, afterDemoChecklist);

    const missingCompanyKey = `close-control-missing-${runTag.toLowerCase()}`;
    await syncSingleFinanceSource(app, {
      companyKey: missingCompanyKey,
      companyName: `Close Control Missing ${runTag}`,
      registeredSource: registered.bank_cash,
    });
    const beforeMissingChecklist = await readBoundaryCounts(pool);
    const missingChecklist = await readChecklist(app, {
      companyKey: missingCompanyKey,
    });
    const afterMissingChecklist = await readBoundaryCounts(pool);

    assertMissingSourceBlocksReadiness(missingChecklist);
    assertChecklistBoundaryFalse(missingChecklist);
    assertNoSideEffects(beforeMissingChecklist, afterMissingChecklist);

    const familyAbsence = assertFamiliesUnchanged();
    const fixtureSourcesUnchanged = await assertFixtureSourcesUnchanged(
      fixture.files,
    );

    console.log(
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          runTag,
          stackPack: {
            id: pocketCfoMonitorDemoPack.id,
            fixtureDirectory: pocketCfoMonitorDemoPack.fixtureDirectory,
          },
          demoChecklist: summarizeChecklist(demoChecklist),
          missingSourceChecklist: summarizeChecklist(missingChecklist),
          fixtureSourcesUnchanged,
          absenceAssertions: {
            ...summarizeNoSideEffects(beforeDemoChecklist, afterDemoChecklist),
            ...familyAbsence,
          },
          discoveryFamilies: FINANCE_DISCOVERY_QUESTION_KINDS,
          monitorFamilies: MonitorKindSchema.options,
        },
        null,
        2,
      ),
    );
  } finally {
    if (app) {
      await app.close();
    }

    await closeAllPools();
  }
}

async function loadFixture() {
  const fixtureRoot = resolve(pocketCfoMonitorDemoPack.fixtureDirectory);
  const expected = JSON.parse(
    await readFile(join(fixtureRoot, "expected-monitor-results.json"), "utf8"),
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

  return { expected, files };
}

async function registerFixtureSources(app, input) {
  const registered = {};

  for (const sourceFile of input.expected.sourceFiles) {
    const file = input.files.get(sourceFile.role);

    if (!file) {
      throw new Error(`Missing fixture file for role ${sourceFile.role}`);
    }

    const created = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        createdBy: DEFAULT_CREATED_BY,
        description: `F6H checklist smoke source for ${sourceFile.role}.`,
        kind: sourceFile.sourceKind,
        name: `F6H ${sourceFile.role} ${input.expected.demoCompany.companyKey}`,
        snapshot: {
          capturedAt: input.capturedAt,
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
    const sourceId = requireString(created?.source?.id, "source id");
    const uploaded = await injectJson(app, {
      expectedStatus: 201,
      headers: {
        "content-type": "application/octet-stream",
      },
      method: "POST",
      payload: file.body,
      url: `/sources/${sourceId}/files?${new URLSearchParams({
        capturedAt: input.capturedAt,
        createdBy: DEFAULT_CREATED_BY,
        mediaType: sourceFile.mediaType,
        originalFileName: basename(sourceFile.path),
      }).toString()}`,
    });

    registered[sourceFile.role] = {
      descriptor: sourceFile,
      source: created.source,
      sourceFile: uploaded.sourceFile,
    };
  }

  return registered;
}

async function syncFinanceSources(app, input) {
  for (const role of ["bank_cash", "receivables_aging", "payables_aging"]) {
    await syncSingleFinanceSource(app, {
      companyKey: input.company.companyKey,
      companyName: input.company.companyName,
      registeredSource: input.registered[role],
    });
  }
}

async function syncSingleFinanceSource(app, input) {
  const sourceFileId = requireString(
    input.registeredSource?.sourceFile?.id,
    "source file id",
  );

  return injectJson(app, {
    expectedStatus: 201,
    method: "POST",
    payload: {
      companyName: input.companyName,
    },
    url: `/finance-twin/companies/${input.companyKey}/source-files/${sourceFileId}/sync`,
  });
}

async function bindAndCompilePolicyDocument(app, input) {
  const policy = input.registered.policy_thresholds;

  await excludePreviousPolicyBindings(app, {
    companyKey: input.companyKey,
    currentPolicySourceId: policy.source.id,
  });
  await injectJson(app, {
    expectedStatus: 201,
    method: "POST",
    payload: {
      boundBy: DEFAULT_CREATED_BY,
      documentRole: "policy_document",
      includeInCompile: true,
    },
    url: `/cfo-wiki/companies/${input.companyKey}/sources/${policy.source.id}/bind`,
  });
  await injectJson(app, {
    expectedStatus: 201,
    method: "POST",
    payload: {
      triggeredBy: DEFAULT_CREATED_BY,
    },
    url: `/cfo-wiki/companies/${input.companyKey}/compile`,
  });
}

async function excludePreviousPolicyBindings(app, input) {
  const sourceList = await injectJson(app, {
    expectedStatus: 200,
    method: "GET",
    url: `/cfo-wiki/companies/${input.companyKey}/sources`,
  });

  for (const source of sourceList.sources ?? []) {
    if (
      source.source.id === input.currentPolicySourceId ||
      source.binding.documentRole !== "policy_document" ||
      source.binding.includeInCompile !== true
    ) {
      continue;
    }

    await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        boundBy: DEFAULT_CREATED_BY,
        documentRole: "policy_document",
        includeInCompile: false,
      },
      url: `/cfo-wiki/companies/${input.companyKey}/sources/${source.source.id}/bind`,
    });
  }
}

async function runExpectedMonitors(app, input) {
  const entries = await Promise.all(
    [
      ["cash_posture", "cash-posture"],
      ["collections_pressure", "collections-pressure"],
      ["payables_pressure", "payables-pressure"],
      ["policy_covenant_threshold", "policy-covenant-threshold"],
    ].map(async ([monitorKind, monitorPath]) => [
      monitorKind,
      await injectJson(app, {
        expectedStatus: 201,
        method: "POST",
        payload: {
          runKey: `f6h-${monitorPath}-${input.runTag}`,
          triggeredBy: DEFAULT_CREATED_BY,
        },
        url: `/monitoring/companies/${input.companyKey}/${monitorPath}/run`,
      }),
    ]),
  );

  return Object.fromEntries(entries);
}

async function readChecklist(app, input) {
  return injectJson(app, {
    expectedStatus: 200,
    method: "GET",
    url: `/close-control/companies/${input.companyKey}/checklist`,
  });
}

function assertChecklistShape(checklist, companyKey) {
  if (checklist.companyKey !== companyKey) {
    throw new Error("Checklist companyKey did not match request");
  }

  const families = checklist.items.map((item) => item.family);

  for (const expectedFamily of [
    "source_coverage_review",
    "cash_source_freshness_review",
    "receivables_aging_source_freshness_review",
    "payables_aging_source_freshness_review",
    "policy_source_freshness_review",
    "monitor_replay_readiness",
  ]) {
    if (!families.includes(expectedFamily)) {
      throw new Error(`Checklist missing item family ${expectedFamily}`);
    }
  }
}

function assertFreshSourceChecklistPosture(checklist) {
  for (const family of [
    "receivables_aging_source_freshness_review",
    "payables_aging_source_freshness_review",
  ]) {
    const item = requireItem(checklist, family);

    if (
      item.freshnessSummary.state !== "fresh" ||
      item.status !== "ready_for_review"
    ) {
      throw new Error(`${family} was not fresh and ready for review`);
    }
  }

  const policy = requireItem(checklist, "policy_source_freshness_review");

  if (
    policy.status === "blocked_by_evidence" ||
    policy.sourcePosture.refs.length === 0
  ) {
    throw new Error(
      "Policy source posture did not retain stored CFO Wiki evidence refs",
    );
  }
}

function assertLimitedPostureNeedsReview(checklist) {
  const cash = requireItem(checklist, "cash_source_freshness_review");

  if (
    cash.status !== "needs_review" ||
    cash.proofPosture.state !== "limited_by_data_quality_gap"
  ) {
    throw new Error("Limited cash source posture did not map to needs_review");
  }
}

function assertMonitorReplayContextOnly(checklist, monitorRuns) {
  const item = requireItem(checklist, "monitor_replay_readiness");
  const monitorResultIds = new Set(
    Object.values(monitorRuns).map((run) => run.monitorResult.id),
  );
  const refIds = new Set(
    item.evidenceBasis.refs
      .map((ref) => ref.monitorResultId)
      .filter((value) => typeof value === "string"),
  );

  for (const resultId of monitorResultIds) {
    if (!refIds.has(resultId)) {
      throw new Error(
        "Monitor replay readiness did not cite latest persisted monitor result context",
      );
    }
  }

  if (
    item.status !== "needs_review" ||
    item.proofPosture.state !== "limited_by_alerting_monitor"
  ) {
    throw new Error(
      "Alerting latest monitor results were not surfaced as review posture",
    );
  }
}

function assertMissingSourceBlocksReadiness(checklist) {
  const sourceCoverage = requireItem(checklist, "source_coverage_review");

  if (
    checklist.aggregateStatus === "ready_for_review" ||
    sourceCoverage.status === "ready_for_review"
  ) {
    throw new Error("Missing source posture produced readiness");
  }
}

function assertChecklistBoundaryFalse(checklist) {
  for (const field of [
    "runtimeCodexUsed",
    "deliveryCreated",
    "reportCreated",
    "approvalCreated",
    "accountingWriteCreated",
    "bankWriteCreated",
    "taxFilingCreated",
    "legalAdviceGenerated",
    "policyAdviceGenerated",
    "paymentInstructionCreated",
    "collectionInstructionCreated",
    "customerContactInstructionCreated",
    "autonomousActionCreated",
    "monitorRunTriggered",
    "missionCreated",
  ]) {
    if (checklist.runtimeActionBoundary[field] !== false) {
      throw new Error(`Checklist boundary ${field} was not false`);
    }
  }
}

function assertNoSideEffects(before, after) {
  for (const [key, beforeValue] of Object.entries(before)) {
    if (after[key] !== beforeValue) {
      throw new Error(
        `Checklist read changed ${key}: before=${beforeValue}, after=${after[key]}`,
      );
    }
  }
}

function summarizeNoSideEffects(before, after) {
  return Object.fromEntries(
    Object.keys(before).map((key) => [
      `${key}Created`,
      after[key] !== before[key],
    ]),
  );
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
    runtimeCodexThreads,
    taxFilings,
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
    readScalar(
      pool,
      "select count(*)::int as count from mission_tasks where codex_thread_id is not null",
      [],
    ),
    readOptionalCount(pool, "tax_filings"),
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
    runtimeCodexThreads,
    taxFilings,
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

async function assertFixtureSourcesUnchanged(files) {
  for (const [role, file] of files.entries()) {
    const currentBody = await readFile(file.absolutePath);
    const currentChecksumSha256 = createHash("sha256")
      .update(currentBody)
      .digest("hex");

    if (currentChecksumSha256 !== file.checksumSha256) {
      throw new Error(`Fixture source changed during checklist smoke: ${role}`);
    }
  }

  return true;
}

function assertFamiliesUnchanged() {
  if (
    JSON.stringify(FINANCE_DISCOVERY_QUESTION_KINDS) !==
    JSON.stringify(EXPECTED_DISCOVERY_FAMILIES)
  ) {
    throw new Error(
      `Discovery family list changed: ${FINANCE_DISCOVERY_QUESTION_KINDS.join(", ")}`,
    );
  }

  if (
    JSON.stringify(MonitorKindSchema.options) !==
    JSON.stringify(EXPECTED_MONITOR_FAMILIES)
  ) {
    throw new Error(
      `Monitor family list changed: ${MonitorKindSchema.options.join(", ")}`,
    );
  }

  return {
    newDiscoveryFamilyAdded: false,
    newMonitorFamilyAdded: false,
  };
}

function summarizeChecklist(checklist) {
  return {
    aggregateStatus: checklist.aggregateStatus,
    companyKey: checklist.companyKey,
    itemStatuses: Object.fromEntries(
      checklist.items.map((item) => [item.family, item.status]),
    ),
    runtimeActionBoundary: checklist.runtimeActionBoundary,
  };
}

function requireItem(checklist, family) {
  const item = checklist.items.find((candidate) => candidate.family === family);

  if (!item) {
    throw new Error(`Checklist missing ${family}`);
  }

  return item;
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

function buildRunTag() {
  return new Date()
    .toISOString()
    .replace(/[-:.TZ]/gu, "")
    .slice(0, 17);
}

if (process.argv[1] && resolve(process.argv[1]) === MODULE_PATH) {
  await main();
}
