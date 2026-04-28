import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ApprovalKindSchema,
  FINANCE_DISCOVERY_QUESTION_KINDS,
  MonitorKindSchema,
} from "@pocket-cto/domain";
import { buildApp } from "../apps/control-plane/src/app.ts";
import { createContainer } from "../apps/control-plane/src/bootstrap.ts";
import { buildCloseControlAcknowledgementReadinessResult } from "../apps/control-plane/src/modules/close-control-acknowledgement/formatter.ts";
import { loadEnv } from "../packages/config/src/index.ts";
import { closeAllPools, getPool } from "../packages/db/src/client.ts";
import { buildRunTag, loadNearestEnvFile } from "./m2-exit-utils.mjs";

const DEFAULT_CREATED_BY = "close-control-acknowledgement-smoke";
const MODULE_PATH = fileURLToPath(import.meta.url);
const EXPECTED_APPROVAL_KINDS = [
  "command",
  "file_change",
  "merge",
  "deploy",
  "rollback",
  "network_escalation",
  "report_release",
  "report_circulation",
];
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
const ACKNOWLEDGEMENT_BOUNDARY_FIELDS = [
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
const CHECKLIST_FAMILIES = [
  "source_coverage_review",
  "cash_source_freshness_review",
  "receivables_aging_source_freshness_review",
  "payables_aging_source_freshness_review",
  "policy_source_freshness_review",
  "monitor_replay_readiness",
];

async function main() {
  loadNearestEnvFile();

  const runTag = buildRunTag();
  const fixture = buildFixture({ runTag });
  const tempDir = await mkdtemp(
    join(tmpdir(), `pocket-cfo-f6k-ack-${runTag}-`),
  );
  const capturedAt = new Date().toISOString();
  const pool = getPool(loadEnv().DATABASE_URL);
  let app = null;

  try {
    assertFamiliesUnchanged();
    assertApprovalKindsUnchanged();
    const readyChecklistMapping = buildReadyChecklistMapping({
      generatedAt: capturedAt,
    });
    assertReadyAcknowledgement(readyChecklistMapping);

    const container = await createContainer();
    app = await buildApp({ container });
    app.log.level = "silent";

    const ready = await prepareScenario(app, {
      capturedAt,
      company: fixture.companies.ready,
      tempDir,
    });
    const readyRuns = await runExpectedMonitors(app, {
      companyKey: fixture.companies.ready.companyKey,
      runTag,
      scenarioKey: "ready",
    });
    assertAllMonitorRunsNoAlert(readyRuns);
    const readyAck = await readAndAssertNoSideEffects(app, pool, {
      companyKey: fixture.companies.ready.companyKey,
    });
    assertSourceBackedSeededAcknowledgement(readyAck);

    const needsReview = await prepareScenario(app, {
      capturedAt,
      company: fixture.companies.needsReview,
      tempDir,
    });
    const needsReviewRuns = await runExpectedMonitors(app, {
      companyKey: fixture.companies.needsReview.companyKey,
      runTag,
      scenarioKey: "needs-review",
    });
    assertAtLeastOneMonitorNeedsReview(needsReviewRuns);
    const needsReviewAck = await readAndAssertNoSideEffects(app, pool, {
      companyKey: fixture.companies.needsReview.companyKey,
    });
    assertNeedsReviewAcknowledgement(needsReviewAck);

    await prepareScenario(app, {
      capturedAt,
      company: fixture.companies.blocked,
      onlySourceRoles: ["bank_cash"],
      tempDir,
    });
    const blockedAck = await readAndAssertNoSideEffects(app, pool, {
      companyKey: fixture.companies.blocked.companyKey,
    });
    assertBlockedAcknowledgement(blockedAck);

    const familyAbsence = assertFamiliesUnchanged();
    const approvalKindAbsence = assertApprovalKindsUnchanged();

    console.log(
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          runTag,
          readyChecklistMapping: summarizeAcknowledgement(readyChecklistMapping),
          sourceBackedSeededScenario: {
            companyKey: fixture.companies.ready.companyKey,
            acknowledgement: summarizeAcknowledgement(readyAck),
            monitorStatuses: summarizeMonitorRuns(readyRuns),
            syncs: summarizeSyncs(ready.syncs),
          },
          needsReviewScenario: {
            companyKey: fixture.companies.needsReview.companyKey,
            acknowledgement: summarizeAcknowledgement(needsReviewAck),
            monitorStatuses: summarizeMonitorRuns(needsReviewRuns),
            syncs: summarizeSyncs(needsReview.syncs),
          },
          blockedScenario: {
            companyKey: fixture.companies.blocked.companyKey,
            acknowledgement: summarizeAcknowledgement(blockedAck),
          },
          absenceAssertions: {
            ...familyAbsence,
            ...approvalKindAbsence,
            closeCompleteStatusEmitted: false,
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
    await rm(tempDir, { force: true, recursive: true });
  }
}

function buildFixture(input) {
  const runTag = input.runTag.toLowerCase();

  return {
    companies: {
      ready: {
        companyKey: `local-f6k-ready-${runTag}`,
        companyName: `Local F6K Ready ${input.runTag}`,
        sources: {
          bank_cash: buildSourceFile({
            mediaType: "text/csv",
            originalFileName: `f6k-ready-bank-${input.runTag}.csv`,
            sourceKind: "dataset",
            sourceName: `F6K ready bank ${input.runTag}`,
            text: [
              "account_name,bank,last4,statement_balance,currency,as_of",
              "Operating Checking,First National,1234,1200.00,USD,2026-04-26",
            ].join("\n"),
          }),
          receivables_aging: buildSourceFile({
            mediaType: "text/csv",
            originalFileName: `f6k-ready-receivables-${input.runTag}.csv`,
            sourceKind: "dataset",
            sourceName: `F6K ready receivables ${input.runTag}`,
            text: [
              "customer_name,customer_id,currency,as_of,current,past_due,total",
              "Clean Customer,C-100,USD,2026-04-26,100.00,0.00,100.00",
            ].join("\n"),
          }),
          payables_aging: buildSourceFile({
            mediaType: "text/csv",
            originalFileName: `f6k-ready-payables-${input.runTag}.csv`,
            sourceKind: "dataset",
            sourceName: `F6K ready payables ${input.runTag}`,
            text: [
              "vendor_name,vendor_id,currency,as_of,current,past_due,total",
              "Clean Vendor,V-100,USD,2026-04-26,100.00,0.00,100.00",
            ].join("\n"),
          }),
          policy_thresholds: buildSourceFile({
            mediaType: "text/markdown",
            originalFileName: `f6k-ready-policy-${input.runTag}.md`,
            sourceKind: "document",
            sourceName: `F6K ready policy ${input.runTag}`,
            text: [
              "# F6K Ready Policy",
              "",
              "Pocket CFO threshold: collections_past_due_share <= 50 percent",
            ].join("\n"),
          }),
        },
      },
      needsReview: {
        companyKey: `local-f6k-needs-review-${runTag}`,
        companyName: `Local F6K Needs Review ${input.runTag}`,
        sources: {
          bank_cash: buildSourceFile({
            mediaType: "text/csv",
            originalFileName: `f6k-needs-bank-${input.runTag}.csv`,
            sourceKind: "dataset",
            sourceName: `F6K needs-review bank ${input.runTag}`,
            text: [
              "account_name,bank,last4,statement_balance,currency",
              "Operating Checking,First National,1234,1200.00,USD",
            ].join("\n"),
          }),
          receivables_aging: buildSourceFile({
            mediaType: "text/csv",
            originalFileName: `f6k-needs-receivables-${input.runTag}.csv`,
            sourceKind: "dataset",
            sourceName: `F6K needs-review receivables ${input.runTag}`,
            text: [
              "customer_name,customer_id,currency,as_of,current,past_due,total",
              "Clean Customer,C-200,USD,2026-04-26,100.00,0.00,100.00",
            ].join("\n"),
          }),
          payables_aging: buildSourceFile({
            mediaType: "text/csv",
            originalFileName: `f6k-needs-payables-${input.runTag}.csv`,
            sourceKind: "dataset",
            sourceName: `F6K needs-review payables ${input.runTag}`,
            text: [
              "vendor_name,vendor_id,currency,as_of,current,past_due,total",
              "Clean Vendor,V-200,USD,2026-04-26,100.00,0.00,100.00",
            ].join("\n"),
          }),
          policy_thresholds: buildSourceFile({
            mediaType: "text/markdown",
            originalFileName: `f6k-needs-policy-${input.runTag}.md`,
            sourceKind: "document",
            sourceName: `F6K needs-review policy ${input.runTag}`,
            text: [
              "# F6K Needs Review Policy",
              "",
              "Pocket CFO threshold: collections_past_due_share <= 50 percent",
            ].join("\n"),
          }),
        },
      },
      blocked: {
        companyKey: `local-f6k-blocked-${runTag}`,
        companyName: `Local F6K Blocked ${input.runTag}`,
        sources: {
          bank_cash: buildSourceFile({
            mediaType: "text/csv",
            originalFileName: `f6k-blocked-bank-${input.runTag}.csv`,
            sourceKind: "dataset",
            sourceName: `F6K blocked bank ${input.runTag}`,
            text: [
              "account_name,bank,last4,statement_balance,currency,as_of",
              "Operating Checking,First National,1234,1200.00,USD,2026-04-26",
            ].join("\n"),
          }),
        },
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
  const roles = input.onlySourceRoles ?? Object.keys(input.company.sources);
  const registered = {};
  const syncs = {};

  for (const role of roles) {
    const source = input.company.sources[role];

    if (!source) {
      throw new Error(`Missing source role ${role}`);
    }

    registered[role] = await registerSource(app, {
      capturedAt: input.capturedAt,
      source,
      tempDir: input.tempDir,
    });
  }

  for (const role of ["bank_cash", "receivables_aging", "payables_aging"]) {
    if (!registered[role]) {
      continue;
    }

    syncs[role] = await syncFinanceSource(app, {
      company: input.company,
      registeredSource: registered[role],
    });
  }

  if (registered.policy_thresholds) {
    await bindAndCompilePolicyDocument(app, {
      companyKey: input.company.companyKey,
      policySourceId: registered.policy_thresholds.source.id,
    });
  }

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
      description: `F6K acknowledgement smoke source for ${input.source.sourceName}.`,
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
        runKey: `f6k-${input.scenarioKey}-${monitorPath}-${input.runTag}`,
        triggeredBy: DEFAULT_CREATED_BY,
      },
      url: `/monitoring/companies/${input.companyKey}/${monitorPath}/run`,
    });
  }

  return runs;
}

async function readAndAssertNoSideEffects(app, pool, input) {
  const before = await readBoundaryCounts(pool);
  const acknowledgement = await injectJson(app, {
    expectedStatus: 200,
    method: "GET",
    url: `/close-control/companies/${input.companyKey}/acknowledgement-readiness`,
  });
  const after = await readBoundaryCounts(pool);

  assertNoReadSideEffects(before, after);
  assertRuntimeBoundaryFalse(acknowledgement);
  assertAcknowledgementTargetPosture(acknowledgement);
  assertNoCloseCompleteStatus(acknowledgement);
  return acknowledgement;
}

function assertReadyAcknowledgement(acknowledgement) {
  if (acknowledgement.aggregateStatus !== "ready_for_acknowledgement") {
    throw new Error(
      `Ready stored posture did not map to acknowledgement readiness: ${JSON.stringify(
        summarizeAcknowledgement(acknowledgement),
      )}`,
    );
  }

  for (const target of acknowledgement.acknowledgementTargets) {
    if (target.status !== "ready_for_acknowledgement") {
      throw new Error(
        `Ready scenario target ${target.targetKey} was not ready: ${target.status}`,
      );
    }
  }

  if (JSON.stringify(acknowledgement).includes("close_complete")) {
    throw new Error("Acknowledgement readiness emitted close_complete");
  }
}

function assertSourceBackedSeededAcknowledgement(acknowledgement) {
  if (acknowledgement.aggregateStatus === "blocked_by_evidence") {
    throw new Error(
      `Seeded source-backed posture unexpectedly blocked acknowledgement readiness: ${JSON.stringify(
        summarizeAcknowledgement(acknowledgement),
      )}`,
    );
  }

  if (
    !acknowledgement.acknowledgementTargets.some(
      (target) => target.status === "ready_for_acknowledgement",
    )
  ) {
    throw new Error("Seeded source-backed posture had no ready targets");
  }

  if (
    acknowledgement.acknowledgementTargets.some(
      (target) => target.status === "close_complete",
    )
  ) {
    throw new Error("Seeded acknowledgement emitted close-complete posture");
  }
}

function buildReadyChecklistMapping(input) {
  return buildCloseControlAcknowledgementReadinessResult({
    checklist: buildSyntheticChecklist({
      companyKey: "local-f6k-ready-checklist-mapping",
      generatedAt: input.generatedAt,
    }),
    companyKey: "local-f6k-ready-checklist-mapping",
    generatedAt: input.generatedAt,
    readiness: buildSyntheticReadiness({
      companyKey: "local-f6k-ready-checklist-mapping",
      generatedAt: input.generatedAt,
    }),
  });
}

function buildSyntheticChecklist(input) {
  const items = CHECKLIST_FAMILIES.map((family) =>
    buildSyntheticChecklistItem({ family, generatedAt: input.generatedAt }),
  );

  return {
    aggregateStatus: "ready_for_review",
    companyKey: input.companyKey,
    evidenceSummary:
      "Synthetic ready checklist posture for F6K mapping proof, using the shipped F6H contract shape.",
    generatedAt: input.generatedAt,
    items,
    limitations: [
      "Synthetic mapping fixture proves ready checklist posture only and creates no record.",
    ],
    runtimeActionBoundary: {
      runtimeCodexUsed: false,
      deliveryCreated: false,
      reportCreated: false,
      approvalCreated: false,
      accountingWriteCreated: false,
      bankWriteCreated: false,
      taxFilingCreated: false,
      legalAdviceGenerated: false,
      policyAdviceGenerated: false,
      paymentInstructionCreated: false,
      collectionInstructionCreated: false,
      customerContactInstructionCreated: false,
      autonomousActionCreated: false,
      monitorRunTriggered: false,
      missionCreated: false,
      summary: "Synthetic checklist read is deterministic and action-free.",
      replayImplication: "Synthetic checklist read is not persisted.",
    },
  };
}

function buildSyntheticChecklistItem(input) {
  return {
    evidenceBasis: {
      basisKind:
        input.family === "source_coverage_review"
          ? "derived_source_coverage"
          : input.family === "policy_source_freshness_review"
            ? "stored_cfo_wiki_policy_posture"
            : input.family === "monitor_replay_readiness"
              ? "latest_persisted_monitor_result_context"
              : "stored_finance_twin_posture",
      refs: [],
      summary: `${input.family} is ready from stored posture for the F6K mapping proof.`,
    },
    family: input.family,
    freshnessSummary: {
      latestObservedAt: input.generatedAt,
      state: "fresh",
      summary: "Fresh stored posture is available.",
    },
    humanReviewNextStep:
      "Review cited stored posture before any future acknowledgement record path.",
    limitations: [
      "Ready mapping fixture remains internal review posture only.",
    ],
    proofPosture: {
      state: "source_backed",
      summary: "Proof is backed by stored posture.",
    },
    sourcePosture: {
      refs: [],
      state:
        input.family === "monitor_replay_readiness"
          ? "monitor_context_present"
          : "source_backed",
      summary: "Stored source posture is ready for internal review.",
    },
    status: "ready_for_review",
  };
}

function buildSyntheticReadiness(input) {
  return {
    aggregateStatus: "ready_for_review",
    attentionItems: [
      {
        evidenceBasis: {
          basisKind: "close_control_checklist_posture",
          refs: [],
          summary: "Synthetic readiness context is ready for review.",
        },
        family: "close_control_attention",
        freshnessSummary: {
          latestObservedAt: input.generatedAt,
          state: "fresh",
          summary: "Synthetic readiness freshness is current.",
        },
        humanReviewNextStep:
          "Review internal readiness context before any future acknowledgement record path.",
        itemKey: "close-control:aggregate",
        limitations: ["Readiness context is internal review posture only."],
        proofPosture: {
          state: "source_backed",
          summary: "Readiness proof posture is source-backed.",
        },
        relatedAlertStatus: null,
        relatedChecklistItemFamily: null,
        relatedMonitorKind: null,
        sourceLineageRefs: [],
        sourcePosture: {
          refs: [],
          state: "source_backed",
          summary: "Readiness source posture is available.",
        },
        status: "ready_for_review",
      },
    ],
    companyKey: input.companyKey,
    evidenceSummary:
      "Synthetic readiness posture for F6K ready mapping proof.",
    generatedAt: input.generatedAt,
    limitations: ["Synthetic readiness creates no record or action."],
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

function assertNeedsReviewAcknowledgement(acknowledgement) {
  if (
    acknowledgement.aggregateStatus !==
    "needs_review_before_acknowledgement"
  ) {
    throw new Error("Needs-review stored posture did not map to review posture");
  }

  const cash = requireTarget(
    acknowledgement,
    "close-control:item-family:cash_source_freshness_review",
  );

  if (cash.status !== "needs_review_before_acknowledgement") {
    throw new Error("Non-ready cash checklist posture did not need review");
  }
}

function assertBlockedAcknowledgement(acknowledgement) {
  if (acknowledgement.aggregateStatus !== "blocked_by_evidence") {
    throw new Error("Missing-source stored posture did not block acknowledgement");
  }

  const blockedTarget = acknowledgement.acknowledgementTargets.find(
    (target) => target.status === "blocked_by_evidence",
  );

  if (!blockedTarget) {
    throw new Error("Blocked scenario did not expose a blocked target");
  }
}

function assertAllMonitorRunsNoAlert(runs) {
  for (const [monitorKind, run] of Object.entries(runs)) {
    if (run.monitorResult.status !== "no_alert") {
      throw new Error(`${monitorKind} was expected to be no_alert`);
    }
  }
}

function assertAtLeastOneMonitorNeedsReview(runs) {
  if (
    !Object.values(runs).some((run) => run.monitorResult.status === "alert")
  ) {
    throw new Error("Needs-review scenario did not create alert context");
  }
}

function assertAcknowledgementTargetPosture(acknowledgement) {
  const aggregate = requireTarget(
    acknowledgement,
    "close-control:checklist-aggregate",
  );

  if (aggregate.targetKind !== "checklist_aggregate") {
    throw new Error("Aggregate acknowledgement target is missing");
  }

  for (const target of acknowledgement.acknowledgementTargets) {
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

function assertRuntimeBoundaryFalse(acknowledgement) {
  for (const field of ACKNOWLEDGEMENT_BOUNDARY_FIELDS) {
    if (acknowledgement.runtimeActionBoundary[field] !== false) {
      throw new Error(`Acknowledgement boundary ${field} was not false`);
    }
  }
}

function assertNoReadSideEffects(before, after) {
  for (const [key, beforeValue] of Object.entries(before)) {
    if (after[key] !== beforeValue) {
      throw new Error(
        `Acknowledgement-readiness read changed ${key}: before=${beforeValue}, after=${after[key]}`,
      );
    }
  }
}

function assertNoCloseCompleteStatus(acknowledgement) {
  const statuses = [
    acknowledgement.aggregateStatus,
    ...acknowledgement.acknowledgementTargets.map((target) => target.status),
  ];

  for (const forbidden of [
    "approved",
    "approval_pending",
    "signed_off",
    "certified",
    "close_complete",
  ]) {
    if (statuses.includes(forbidden)) {
      throw new Error(`Forbidden acknowledgement status emitted: ${forbidden}`);
    }
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

function assertApprovalKindsUnchanged() {
  if (
    JSON.stringify(ApprovalKindSchema.options) !==
    JSON.stringify(EXPECTED_APPROVAL_KINDS)
  ) {
    throw new Error(
      `Approval kind list changed: ${ApprovalKindSchema.options.join(", ")}`,
    );
  }

  return { approvalKindAdded: false };
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

function summarizeAcknowledgement(acknowledgement) {
  return {
    aggregateStatus: acknowledgement.aggregateStatus,
    targetStatuses: Object.fromEntries(
      acknowledgement.acknowledgementTargets.map((target) => [
        target.targetKey,
        {
          missingSource: target.sourcePosture.missingSource,
          sourcePostureState: target.sourcePosture.state,
          status: target.status,
        },
      ]),
    ),
    operatorReadinessAggregateStatus:
      acknowledgement.operatorReadinessContext.operatorReadinessAggregateStatus,
    runtimeActionBoundaryAllFalse: ACKNOWLEDGEMENT_BOUNDARY_FIELDS.every(
      (field) => acknowledgement.runtimeActionBoundary[field] === false,
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

function requireTarget(acknowledgement, targetKey) {
  const target = acknowledgement.acknowledgementTargets.find(
    (candidate) => candidate.targetKey === targetKey,
  );

  if (!target) {
    throw new Error(`Acknowledgement missing target ${targetKey}`);
  }

  return target;
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

if (process.argv[1] && resolve(process.argv[1]) === MODULE_PATH) {
  await main();
}
