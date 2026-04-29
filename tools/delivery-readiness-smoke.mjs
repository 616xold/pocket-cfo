import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  FINANCE_DISCOVERY_QUESTION_KINDS,
  MonitorKindSchema,
} from "@pocket-cto/domain";
import { buildApp } from "../apps/control-plane/src/app.ts";
import { createContainer } from "../apps/control-plane/src/bootstrap.ts";
import { buildDeliveryReadinessResult } from "../apps/control-plane/src/modules/delivery-readiness/formatter.ts";
import { loadEnv } from "../packages/config/src/index.ts";
import { closeAllPools, getPool } from "../packages/db/src/client.ts";
import { buildRunTag, loadNearestEnvFile } from "./m2-exit-utils.mjs";

const DEFAULT_CREATED_BY = "delivery-readiness-smoke";
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
const DELIVERY_BOUNDARY_FIELDS = [
  "runtimeCodexUsed",
  "deliveryCreated",
  "outboxSendCreated",
  "notificationProviderCalled",
  "emailSent",
  "slackSent",
  "smsSent",
  "webhookCalled",
  "reportCreated",
  "approvalCreated",
  "missionCreated",
  "monitorRunTriggered",
  "monitorResultCreated",
  "sourceMutationCreated",
  "generatedNotificationProseCreated",
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
const FORBIDDEN_DELIVERY_STATUSES = [
  "sent",
  "send_pending",
  "delivered",
  "delivery_scheduled",
  "provider_ready",
  "approved",
  "release_ready",
  "signed_off",
  "certified",
  "close_complete",
];

async function main() {
  loadNearestEnvFile();

  const runTag = buildRunTag();
  const fixture = buildFixture({ runTag });
  const tempDir = await mkdtemp(
    join(tmpdir(), `pocket-cfo-f6m-delivery-${runTag}-`),
  );
  const capturedAt = new Date().toISOString();
  const pool = getPool(loadEnv().DATABASE_URL);
  let app = null;

  try {
    const familyAbsenceBefore = assertFamiliesUnchanged();
    const readyMapping = buildReadyDeliveryReadiness({ generatedAt: capturedAt });
    assertReadyDeliveryReadiness(readyMapping);

    const container = await createContainer();
    app = await buildApp({ container });
    app.log.level = "silent";

    const prepared = await prepareScenario(app, {
      capturedAt,
      company: fixture.company,
      tempDir,
    });
    const monitorRuns = await runExpectedMonitors(app, {
      companyKey: fixture.company.companyKey,
      runTag,
    });
    assertAtLeastOneMonitorNeedsReview(monitorRuns);

    const beforeRead = await readBoundaryCounts(pool);
    const deliveryReadiness = await injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/delivery-readiness/companies/${fixture.company.companyKey}`,
    });
    const afterRead = await readBoundaryCounts(pool);

    assertNoReadSideEffects(beforeRead, afterRead);
    assertDeliveryReadiness(deliveryReadiness);
    const familyAbsenceAfter = assertFamiliesUnchanged();

    console.log(
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          runTag,
          companyKey: fixture.company.companyKey,
          readyMapping: summarizeDeliveryReadiness(readyMapping),
          seededScenario: {
            deliveryReadiness: summarizeDeliveryReadiness(deliveryReadiness),
            monitorStatuses: summarizeMonitorRuns(monitorRuns),
            syncs: summarizeSyncs(prepared.syncs),
          },
          absenceAssertions: {
            ...summarizeNoSideEffects(beforeRead, afterRead),
            ...familyAbsenceBefore,
            ...familyAbsenceAfter,
            forbiddenDeliveryStatusEmitted: false,
            notificationProviderCalled: false,
            generatedNotificationProseCreated: false,
            noSendOccurred: true,
          },
          discoveryFamilies: FINANCE_DISCOVERY_QUESTION_KINDS,
          monitorFamilies: MonitorKindSchema.options,
          shippedF6ProofsRequiredSeparately: [
            "pnpm smoke:operator-readiness:local",
            "pnpm smoke:close-control-acknowledgement:local",
            "pnpm smoke:close-control-checklist:local",
            "pnpm exec tsx tools/bank-card-source-pack-proof.mjs",
          ],
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
    await rm(tempDir, { force: true, recursive: true });
  }
}

function buildFixture(input) {
  const runTag = input.runTag.toLowerCase();

  return {
    company: {
      companyKey: `local-f6m-delivery-${runTag}`,
      companyName: `Local F6M Delivery ${input.runTag}`,
      sources: {
        bank_cash: buildSourceFile({
          mediaType: "text/csv",
          originalFileName: `f6m-bank-${input.runTag}.csv`,
          sourceKind: "dataset",
          sourceName: `F6M bank ${input.runTag}`,
          text: [
            "account_name,bank,last4,statement_balance,currency",
            "Operating Checking,First National,1234,1200.00,USD",
          ].join("\n"),
        }),
        receivables_aging: buildSourceFile({
          mediaType: "text/csv",
          originalFileName: `f6m-receivables-${input.runTag}.csv`,
          sourceKind: "dataset",
          sourceName: `F6M receivables ${input.runTag}`,
          text: [
            "customer_name,customer_id,currency,as_of,current,past_due,total",
            "Clean Customer,C-100,USD,2026-04-26,100.00,0.00,100.00",
          ].join("\n"),
        }),
        payables_aging: buildSourceFile({
          mediaType: "text/csv",
          originalFileName: `f6m-payables-${input.runTag}.csv`,
          sourceKind: "dataset",
          sourceName: `F6M payables ${input.runTag}`,
          text: [
            "vendor_name,vendor_id,currency,as_of,current,past_due,total",
            "Clean Vendor,V-100,USD,2026-04-26,100.00,0.00,100.00",
          ].join("\n"),
        }),
        policy_thresholds: buildSourceFile({
          mediaType: "text/markdown",
          originalFileName: `f6m-policy-${input.runTag}.md`,
          sourceKind: "document",
          sourceName: `F6M policy ${input.runTag}`,
          text: [
            "# F6M Policy",
            "",
            "Pocket CFO threshold: collections_past_due_share <= 50 percent",
          ].join("\n"),
        }),
      },
    },
  };
}

function buildSourceFile(input) {
  return {
    body: Buffer.from(`${input.text}\n`, "utf8"),
    mediaType: input.mediaType,
    originalFileName: input.originalFileName,
    sourceKind: input.sourceKind,
    sourceName: input.sourceName,
  };
}

async function prepareScenario(app, input) {
  const registered = {};
  const syncs = {};

  for (const [role, source] of Object.entries(input.company.sources)) {
    registered[role] = await registerSource(app, {
      capturedAt: input.capturedAt,
      source,
      tempDir: input.tempDir,
    });
  }

  for (const role of ["bank_cash", "receivables_aging", "payables_aging"]) {
    syncs[role] = await syncFinanceSource(app, {
      company: input.company,
      registeredSource: registered[role],
    });
  }

  await bindAndCompilePolicyDocument(app, {
    companyKey: input.company.companyKey,
    policySourceId: registered.policy_thresholds.source.id,
  });

  return { registered, syncs };
}

async function registerSource(app, input) {
  const absolutePath = join(input.tempDir, input.source.originalFileName);
  await writeFile(absolutePath, input.source.body);
  const checksumSha256 = createHash("sha256")
    .update(input.source.body)
    .digest("hex");
  const created = await injectJson(app, {
    expectedStatus: 201,
    method: "POST",
    payload: {
      createdBy: DEFAULT_CREATED_BY,
      description: `F6M delivery readiness smoke source for ${input.source.sourceName}.`,
      kind: input.source.sourceKind,
      name: input.source.sourceName,
      snapshot: {
        capturedAt: input.capturedAt,
        checksumSha256,
        mediaType: input.source.mediaType,
        originalFileName: basename(absolutePath),
        sizeBytes: input.source.body.byteLength,
        storageKind: "local_path",
        storageRef: absolutePath,
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
    payload: input.source.body,
    url: `/sources/${sourceId}/files?${new URLSearchParams({
      capturedAt: input.capturedAt,
      createdBy: DEFAULT_CREATED_BY,
      mediaType: input.source.mediaType,
      originalFileName: basename(absolutePath),
    }).toString()}`,
  });

  return {
    source: created.source,
    sourceFile: uploaded.sourceFile,
  };
}

async function syncFinanceSource(app, input) {
  return injectJson(app, {
    expectedStatus: 201,
    method: "POST",
    payload: {
      companyName: input.company.companyName,
    },
    url: `/finance-twin/companies/${input.company.companyKey}/source-files/${input.registeredSource.sourceFile.id}/sync`,
  });
}

async function bindAndCompilePolicyDocument(app, input) {
  await injectJson(app, {
    expectedStatus: 201,
    method: "POST",
    payload: {
      boundBy: DEFAULT_CREATED_BY,
      documentRole: "policy_document",
      includeInCompile: true,
    },
    url: `/cfo-wiki/companies/${input.companyKey}/sources/${input.policySourceId}/bind`,
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

async function runExpectedMonitors(app, input) {
  const runs = {};

  for (const [monitorKind, monitorPath] of [
    ["cash_posture", "cash-posture"],
    ["collections_pressure", "collections-pressure"],
    ["payables_pressure", "payables-pressure"],
    ["policy_covenant_threshold", "policy-covenant-threshold"],
  ]) {
    runs[monitorKind] = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        runKey: `f6m-${monitorPath}-${input.runTag}`,
        triggeredBy: DEFAULT_CREATED_BY,
      },
      url: `/monitoring/companies/${input.companyKey}/${monitorPath}/run`,
    });
  }

  return runs;
}

function buildReadyDeliveryReadiness(input) {
  return buildDeliveryReadinessResult({
    acknowledgementReadiness: buildSyntheticAcknowledgement({
      companyKey: "local-f6m-ready-mapping",
      generatedAt: input.generatedAt,
    }),
    companyKey: "local-f6m-ready-mapping",
    generatedAt: input.generatedAt,
    operatorReadiness: buildSyntheticReadiness({
      companyKey: "local-f6m-ready-mapping",
      generatedAt: input.generatedAt,
    }),
  });
}

function buildSyntheticReadiness(input) {
  return {
    aggregateStatus: "ready_for_review",
    attentionItems: [
      {
        evidenceBasis: {
          basisKind: "close_control_checklist_posture",
          refs: [],
          summary: "Synthetic operator readiness is ready for review.",
        },
        family: "close_control_attention",
        freshnessSummary: {
          latestObservedAt: input.generatedAt,
          state: "fresh",
          summary: "Synthetic readiness freshness is current.",
        },
        humanReviewNextStep:
          "Review internal readiness context before future delivery review.",
        itemKey: "operator-readiness:aggregate-ready",
        limitations: ["Synthetic readiness creates no record or action."],
        proofPosture: {
          state: "source_backed",
          summary: "Synthetic readiness proof is source-backed.",
        },
        relatedAlertStatus: null,
        relatedChecklistItemFamily: null,
        relatedMonitorKind: null,
        sourceLineageRefs: [],
        sourcePosture: {
          refs: [],
          state: "source_backed",
          summary: "Synthetic readiness source posture is available.",
        },
        status: "ready_for_review",
      },
    ],
    companyKey: input.companyKey,
    evidenceSummary:
      "Synthetic F6J readiness posture for F6M ready mapping proof.",
    generatedAt: input.generatedAt,
    limitations: ["Synthetic readiness is internal review posture only."],
    runtimeActionBoundary: {
      runtimeCodexUsed: false,
      deliveryCreated: false,
      outboxSendCreated: false,
      reportCreated: false,
      approvalCreated: false,
      missionCreated: false,
      monitorRunTriggered: false,
      monitorResultCreated: false,
      accountingWriteCreated: false,
      bankWriteCreated: false,
      taxFilingCreated: false,
      legalAdviceGenerated: false,
      policyAdviceGenerated: false,
      paymentInstructionCreated: false,
      collectionInstructionCreated: false,
      customerContactInstructionCreated: false,
      autonomousActionCreated: false,
      summary: "Synthetic readiness read is deterministic and action-free.",
      replayImplication: "Synthetic readiness read is not persisted.",
    },
  };
}

function buildSyntheticAcknowledgement(input) {
  return {
    acknowledgementTargets: [
      {
        evidenceBasis: {
          checklistEvidenceRefs: [],
          readinessEvidenceRefs: [],
          summary:
            "Synthetic acknowledgement target is ready from stored posture.",
        },
        freshnessSummary: {
          latestObservedAt: input.generatedAt,
          state: "fresh",
          summary: "Synthetic acknowledgement freshness is current.",
        },
        humanReviewNextStep:
          "Review internal acknowledgement posture before future delivery review.",
        limitations: [
          "Synthetic acknowledgement creates no record or action.",
        ],
        proofPosture: {
          state: "source_backed",
          summary: "Synthetic acknowledgement proof is source-backed.",
        },
        relatedChecklistItemFamily: null,
        relatedReadinessItemKey: null,
        sourcePosture: {
          missingSource: false,
          state: "source_backed",
          summary: "Synthetic acknowledgement source posture is available.",
        },
        status: "ready_for_acknowledgement",
        targetKey: "close-control:checklist-aggregate",
        targetKind: "checklist_aggregate",
      },
    ],
    aggregateStatus: "ready_for_acknowledgement",
    companyKey: input.companyKey,
    evidenceSummary:
      "Synthetic F6K acknowledgement posture for F6M ready mapping proof.",
    generatedAt: input.generatedAt,
    limitations: [
      "Synthetic acknowledgement is internal review posture only.",
    ],
    operatorReadinessContext: {
      limitations: [],
      nonReadyReadinessItemKeys: [],
      operatorReadinessAggregateStatus: "ready_for_review",
      summary: "Synthetic operator readiness is ready for review.",
    },
    runtimeActionBoundary: {
      runtimeCodexUsed: false,
      deliveryCreated: false,
      outboxSendCreated: false,
      reportCreated: false,
      approvalCreated: false,
      missionCreated: false,
      monitorRunTriggered: false,
      monitorResultCreated: false,
      accountingWriteCreated: false,
      bankWriteCreated: false,
      taxFilingCreated: false,
      legalAdviceGenerated: false,
      policyAdviceGenerated: false,
      paymentInstructionCreated: false,
      collectionInstructionCreated: false,
      customerContactInstructionCreated: false,
      autonomousActionCreated: false,
      summary:
        "Synthetic acknowledgement read is deterministic and action-free.",
      replayImplication: "Synthetic acknowledgement read is not persisted.",
    },
  };
}

function assertReadyDeliveryReadiness(deliveryReadiness) {
  if (deliveryReadiness.aggregateStatus !== "ready_for_delivery_review") {
    throw new Error("Ready posture did not map to ready_for_delivery_review");
  }

  for (const target of deliveryReadiness.deliveryReadinessTargets) {
    if (target.status !== "ready_for_delivery_review") {
      throw new Error(`Ready target ${target.targetKey} was ${target.status}`);
    }
  }

  assertNoForbiddenStatuses(deliveryReadiness);
  assertRuntimeBoundaryFalse(deliveryReadiness);
}

function assertDeliveryReadiness(deliveryReadiness) {
  if (!deliveryReadiness.companyKey.startsWith("local-f6m-delivery-")) {
    throw new Error("Delivery readiness companyKey did not match seeded company");
  }

  if (deliveryReadiness.aggregateStatus === "ready_for_delivery_review") {
    throw new Error("Non-ready seeded posture unexpectedly mapped to ready");
  }

  assertNoForbiddenStatuses(deliveryReadiness);
  assertRuntimeBoundaryFalse(deliveryReadiness);

  const nonReadyOperatorTarget =
    deliveryReadiness.deliveryReadinessTargets.find(
      (target) =>
        target.relatedOperatorReadinessItemKey &&
        target.status !== "ready_for_delivery_review",
    );
  const nonReadyAcknowledgementTarget =
    deliveryReadiness.deliveryReadinessTargets.find(
      (target) =>
        target.relatedAcknowledgementTargetKey &&
        target.status !== "ready_for_delivery_review",
    );

  if (!nonReadyOperatorTarget) {
    throw new Error("Non-ready operator posture did not produce a target");
  }

  if (!nonReadyAcknowledgementTarget) {
    throw new Error("Non-ready acknowledgement posture did not produce a target");
  }

  for (const target of deliveryReadiness.deliveryReadinessTargets) {
    if (
      !target.evidenceBasis?.summary ||
      !target.sourcePosture?.summary ||
      !target.freshnessSummary?.summary ||
      !target.proofPosture?.summary ||
      !target.humanReviewNextStep
    ) {
      throw new Error(`Target ${target.targetKey} is missing proof posture`);
    }

    if (!Array.isArray(target.limitations) || target.limitations.length === 0) {
      throw new Error(`Target ${target.targetKey} is missing limitations`);
    }
  }
}

function assertRuntimeBoundaryFalse(deliveryReadiness) {
  for (const field of DELIVERY_BOUNDARY_FIELDS) {
    if (deliveryReadiness.runtimeActionBoundary[field] !== false) {
      throw new Error(`Delivery-readiness boundary ${field} was not false`);
    }
  }
}

function assertNoForbiddenStatuses(deliveryReadiness) {
  const statuses = [
    deliveryReadiness.aggregateStatus,
    ...deliveryReadiness.deliveryReadinessTargets.map(
      (target) => target.status,
    ),
  ];

  for (const forbidden of FORBIDDEN_DELIVERY_STATUSES) {
    if (statuses.includes(forbidden)) {
      throw new Error(`Forbidden delivery-readiness status emitted: ${forbidden}`);
    }
  }
}

function assertAtLeastOneMonitorNeedsReview(runs) {
  if (
    !Object.values(runs).some((run) => run.monitorResult.status === "alert")
  ) {
    throw new Error("Seeded F6M scenario did not create alert context");
  }
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

function assertNoReadSideEffects(before, after) {
  for (const [key, beforeValue] of Object.entries(before)) {
    if (after[key] !== beforeValue) {
      throw new Error(
        `Delivery-readiness read changed ${key}: before=${beforeValue}, after=${after[key]}`,
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
    deliveryRecordCreated: after.deliveryRecords !== before.deliveryRecords,
    generatedNotificationProseCreated:
      after.generatedNotificationProse !== before.generatedNotificationProse,
    legalAdviceGenerated: after.legalAdvice !== before.legalAdvice,
    missionCreated: after.missions !== before.missions,
    monitorResultCreated: after.monitorResults !== before.monitorResults,
    notificationProviderCallCreated:
      after.notificationProviderCalls !== before.notificationProviderCalls,
    paymentInstructionCreated:
      after.paymentInstructions !== before.paymentInstructions,
    policyAdviceGenerated: after.policyAdvice !== before.policyAdvice,
    reportArtifactCreated: after.reportArtifacts !== before.reportArtifacts,
    runtimeCodexThreadCreated:
      after.runtimeCodexThreads !== before.runtimeCodexThreads,
    sourceMutationCreated: after.sourceMutations !== before.sourceMutations,
    sourceRecordCreated: after.sourceRecords !== before.sourceRecords,
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
    deliveryRecords,
    generatedNotificationProse,
    legalAdvice,
    missions,
    monitorResults,
    notificationProviderCalls,
    outboxEvents,
    paymentInstructions,
    policyAdvice,
    reportArtifacts,
    runtimeCodexThreads,
    sourceMutations,
    sourceRecords,
    taxFilings,
  ] = await Promise.all([
    readOptionalCount(pool, "accounting_writes"),
    readScalar(pool, "select count(*)::int as count from approvals", []),
    readOptionalCount(pool, "autonomous_actions"),
    readOptionalCount(pool, "bank_writes"),
    readOptionalCount(pool, "collection_instructions"),
    readOptionalCount(pool, "customer_contact_instructions"),
    readOptionalCount(pool, "delivery_records"),
    readOptionalCount(pool, "generated_notification_prose"),
    readOptionalCount(pool, "legal_advice"),
    readScalar(pool, "select count(*)::int as count from missions", []),
    readScalar(pool, "select count(*)::int as count from monitor_results", []),
    readOptionalCount(pool, "notification_provider_calls"),
    readScalar(pool, "select count(*)::int as count from outbox_events", []),
    readOptionalCount(pool, "payment_instructions"),
    readOptionalCount(pool, "policy_advice"),
    readReportArtifactCount(pool),
    readScalar(
      pool,
      "select count(*)::int as count from mission_tasks where codex_thread_id is not null",
      [],
    ),
    readOptionalCount(pool, "source_mutations"),
    readSourceRecordCount(pool),
    readOptionalCount(pool, "tax_filings"),
  ]);

  return {
    accountingWrites,
    approvals,
    autonomousActions,
    bankWrites,
    collectionInstructions,
    customerContactInstructions,
    deliveryRecords,
    generatedNotificationProse,
    legalAdvice,
    missions,
    monitorResults,
    notificationProviderCalls,
    outboxEvents,
    paymentInstructions,
    policyAdvice,
    reportArtifacts,
    runtimeCodexThreads,
    sourceMutations,
    sourceRecords,
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

async function readSourceRecordCount(pool) {
  const [sources, sourceFiles, sourceSnapshots] = await Promise.all([
    readScalar(pool, "select count(*)::int as count from sources", []),
    readScalar(pool, "select count(*)::int as count from source_files", []),
    readScalar(pool, "select count(*)::int as count from source_snapshots", []),
  ]);

  return sources + sourceFiles + sourceSnapshots;
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

function summarizeDeliveryReadiness(deliveryReadiness) {
  return {
    aggregateStatus: deliveryReadiness.aggregateStatus,
    targetStatuses: Object.fromEntries(
      deliveryReadiness.deliveryReadinessTargets.map((target) => [
        target.targetKey,
        {
          relatedAcknowledgementTargetKey:
            target.relatedAcknowledgementTargetKey,
          relatedOperatorReadinessItemKey:
            target.relatedOperatorReadinessItemKey,
          status: target.status,
          targetKind: target.targetKind,
        },
      ]),
    ),
    runtimeActionBoundaryAllFalse: DELIVERY_BOUNDARY_FIELDS.every(
      (field) => deliveryReadiness.runtimeActionBoundary[field] === false,
    ),
  };
}

function summarizeMonitorRuns(runs) {
  return Object.fromEntries(
    Object.entries(runs).map(([monitorKind, run]) => [
      monitorKind,
      run.monitorResult.status,
    ]),
  );
}

function summarizeSyncs(syncs) {
  return Object.fromEntries(
    Object.entries(syncs).map(([role, result]) => [
      role,
      {
        extractorKey: result.syncRun?.extractorKey,
        status: result.syncRun?.status,
      },
    ]),
  );
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
