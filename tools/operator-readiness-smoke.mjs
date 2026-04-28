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
import { buildRunTag, loadNearestEnvFile } from "./m2-exit-utils.mjs";

const DEFAULT_CREATED_BY = "operator-readiness-smoke";
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
const READINESS_BOUNDARY_FIELDS = [
  "runtimeCodexUsed",
  "deliveryCreated",
  "outboxSendCreated",
  "reportCreated",
  "approvalCreated",
  "missionCreated",
  "monitorRunTriggered",
  "monitorResultCreated",
  "accountingWriteCreated",
  "bankWriteCreated",
  "taxFilingCreated",
  "legalAdviceGenerated",
  "policyAdviceGenerated",
  "paymentInstructionCreated",
  "collectionInstructionCreated",
  "customerContactInstructionCreated",
  "autonomousActionCreated",
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
    const beforeReadiness = await readBoundaryCounts(pool);
    const readiness = await readOperatorReadiness(app, {
      companyKey: fixture.expected.demoCompany.companyKey,
    });
    const afterReadiness = await readBoundaryCounts(pool);

    assertOperatorReadiness(readiness, monitorRuns);
    assertNoReadinessSideEffects(beforeReadiness, afterReadiness);
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
          companyKey: fixture.expected.demoCompany.companyKey,
          operatorReadinessVerified: true,
          alertingMonitorAttentionVerified: true,
          closeControlAttentionVerified: true,
          fixtureSourcesUnchanged,
          absenceAssertions: {
            ...summarizeNoSideEffects(beforeReadiness, afterReadiness),
            ...familyAbsence,
          },
          readiness: summarizeReadiness(readiness),
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
        description: `F6J operator readiness smoke source for ${sourceFile.role}.`,
        kind: sourceFile.sourceKind,
        name: `F6J ${sourceFile.role} ${input.expected.demoCompany.companyKey}`,
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
    const registered = input.registered[role];

    if (!registered) {
      throw new Error(`Missing registered source for ${role}`);
    }

    const synced = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        companyName: input.company.companyName,
      },
      url: `/finance-twin/companies/${input.company.companyKey}/source-files/${registered.sourceFile.id}/sync`,
    });

    if (
      synced.syncRun?.extractorKey !==
      registered.descriptor.expectedExtractorKey
    ) {
      throw new Error(
        `${role} synced with ${synced.syncRun?.extractorKey}, expected ${registered.descriptor.expectedExtractorKey}`,
      );
    }
  }
}

async function bindAndCompilePolicyDocument(app, input) {
  const policy = input.registered.policy_thresholds;

  if (!policy) {
    throw new Error("Missing registered policy threshold source");
  }

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
  const entries = [];

  for (const [monitorKind, monitorPath] of [
    ["cash_posture", "cash-posture"],
    ["collections_pressure", "collections-pressure"],
    ["payables_pressure", "payables-pressure"],
    ["policy_covenant_threshold", "policy-covenant-threshold"],
  ]) {
    entries.push([
      monitorKind,
      await injectJson(app, {
        expectedStatus: 201,
        method: "POST",
        payload: {
          runKey: `f6j-${monitorPath}-${input.runTag}`,
          triggeredBy: DEFAULT_CREATED_BY,
        },
        url: `/monitoring/companies/${input.companyKey}/${monitorPath}/run`,
      }),
    ]);
  }

  return Object.fromEntries(entries);
}

async function readOperatorReadiness(app, input) {
  return injectJson(app, {
    expectedStatus: 200,
    method: "GET",
    url: `/operator-readiness/companies/${input.companyKey}`,
  });
}

function assertOperatorReadiness(readiness, monitorRuns) {
  if (readiness.companyKey !== "demo-monitor-stack") {
    throw new Error("Operator readiness companyKey did not match demo company");
  }

  if (readiness.aggregateStatus === "ready_for_review") {
    throw new Error("Alerting demo posture unexpectedly produced ready aggregate");
  }

  assertReadinessBoundaryFalse(readiness);

  for (const [monitorKind, run] of Object.entries(monitorRuns)) {
    const item = requireItem(
      readiness,
      `monitor:${monitorKind}:${run.monitorResult.id}`,
    );

    if (item.family !== "monitor_alert_attention") {
      throw new Error(`${monitorKind} readiness item was not monitor attention`);
    }

    if (run.monitorResult.status === "alert" && item.status !== "needs_review") {
      throw new Error(
        `${monitorKind} alert did not produce needs_review operator attention`,
      );
    }

    if (
      item.relatedMonitorKind !== monitorKind ||
      item.relatedAlertStatus !== run.monitorResult.status
    ) {
      throw new Error(`${monitorKind} readiness item lost monitor relation`);
    }

    assertItemEvidencePosture(item);
  }

  for (const itemKey of [
    "close-control:cash_source_freshness_review",
    "close-control:policy_source_freshness_review",
    "close-control:monitor_replay_readiness",
  ]) {
    const item = requireItem(readiness, itemKey);

    if (item.status === "ready_for_review") {
      throw new Error(`${itemKey} should have produced non-ready attention`);
    }

    if (!item.relatedChecklistItemFamily) {
      throw new Error(`${itemKey} lost checklist item relation`);
    }

    assertItemEvidencePosture(item);
  }
}

function assertItemEvidencePosture(item) {
  if (!item.evidenceBasis?.summary || !item.sourcePosture?.summary) {
    throw new Error(`Readiness item ${item.itemKey} is missing evidence posture`);
  }

  if (!item.freshnessSummary?.summary || !item.proofPosture?.summary) {
    throw new Error(`Readiness item ${item.itemKey} is missing proof posture`);
  }

  if (!Array.isArray(item.limitations) || item.limitations.length === 0) {
    throw new Error(`Readiness item ${item.itemKey} is missing limitations`);
  }

  if (!item.humanReviewNextStep) {
    throw new Error(`Readiness item ${item.itemKey} is missing review step`);
  }
}

function assertReadinessBoundaryFalse(readiness) {
  for (const field of READINESS_BOUNDARY_FIELDS) {
    if (readiness.runtimeActionBoundary[field] !== false) {
      throw new Error(`Readiness boundary ${field} was not false`);
    }
  }
}

function assertNoReadinessSideEffects(before, after) {
  for (const [key, beforeValue] of Object.entries(before)) {
    if (after[key] !== beforeValue) {
      throw new Error(
        `Operator readiness read changed ${key}: before=${beforeValue}, after=${after[key]}`,
      );
    }
  }
}

function summarizeNoSideEffects(before, after) {
  return {
    accountingWriteCreated: after.accountingWrites !== before.accountingWrites,
    approvalCreated: after.approvals !== before.approvals,
    autonomousActionCreated:
      after.autonomousActions !== before.autonomousActions,
    bankWriteCreated: after.bankWrites !== before.bankWrites,
    collectionInstructionCreated:
      after.collectionInstructions !== before.collectionInstructions,
    customerContactInstructionCreated:
      after.customerContactInstructions !== before.customerContactInstructions,
    deliveryOutboxEventCreated: after.outboxEvents !== before.outboxEvents,
    legalAdviceGenerated: after.legalAdvice !== before.legalAdvice,
    missionCreated: after.missions !== before.missions,
    monitorResultCreated: after.monitorResults !== before.monitorResults,
    paymentInstructionCreated:
      after.paymentInstructions !== before.paymentInstructions,
    policyAdviceGenerated: after.policyAdvice !== before.policyAdvice,
    reportArtifactCreated: after.reportArtifacts !== before.reportArtifacts,
    runtimeCodexThreadCreated:
      after.runtimeCodexThreads !== before.runtimeCodexThreads,
    taxFilingCreated: after.taxFilings !== before.taxFilings,
  };
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
      throw new Error(
        `Fixture source changed during operator readiness smoke: ${role}`,
      );
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

function summarizeReadiness(readiness) {
  return {
    aggregateStatus: readiness.aggregateStatus,
    companyKey: readiness.companyKey,
    itemStatuses: Object.fromEntries(
      readiness.attentionItems.map((item) => [item.itemKey, item.status]),
    ),
    families: Array.from(
      new Set(readiness.attentionItems.map((item) => item.family)),
    ).sort(),
    runtimeActionBoundary: readiness.runtimeActionBoundary,
  };
}

function requireItem(readiness, itemKey) {
  const item = readiness.attentionItems.find(
    (candidate) => candidate.itemKey === itemKey,
  );

  if (!item) {
    throw new Error(`Operator readiness missing item ${itemKey}`);
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

  try {
    return JSON.parse(response.body);
  } catch (error) {
    throw new Error(
      `${input.method} ${input.url} returned non-JSON: ${String(error)}`,
    );
  }
}

function requireString(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing ${label}`);
  }

  return value;
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        error: error instanceof Error ? error.message : String(error),
        modulePath: MODULE_PATH,
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
});
