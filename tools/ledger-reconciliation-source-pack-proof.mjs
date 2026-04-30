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
import { pocketCfoLedgerReconciliationSourcePack } from "../packages/stack-packs/src/index.ts";
import { loadNearestEnvFile } from "./m2-exit-utils.mjs";

const MODULE_PATH = fileURLToPath(import.meta.url);
const CREATED_BY = "ledger-reconciliation-source-pack-proof";
const COMPANY_NAME = "Demo Ledger/Reconciliation Source Pack";
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
const EXPECTED_SOURCE_ROLES = [
  "chart_of_accounts",
  "trial_balance",
  "general_ledger",
];
const EXPECTED_EXTRACTOR_KEYS = [
  "chart_of_accounts_csv",
  "trial_balance_csv",
  "general_ledger_csv",
];
const LINEAGE_TARGET_KIND_BY_COUNT_KEY = {
  accountCatalogEntryCount: "account_catalog_entry",
  generalLedgerBalanceProofCount: "general_ledger_balance_proof",
  journalEntryCount: "journal_entry",
  journalLineCount: "journal_line",
  ledgerAccountCount: "ledger_account",
  reportingPeriodCount: "reporting_period",
  trialBalanceLineCount: "trial_balance_line",
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

    assertJsonEqual(
      "normalized source/twin/reconciliation posture",
      actual,
      fixture.expected,
    );

    const rawFixtureSourcesUnchanged = await assertFixtureSourcesUnchanged(
      fixture.files,
      sourceHashesBefore,
    );

    console.log(
      JSON.stringify({
        sourcePackId: pocketCfoLedgerReconciliationSourcePack.id,
        companyKey: fixture.expected.companyKey,
        sourceRolesVerified: true,
        expectedPostureVerified: true,
        rawFixtureSourcesUnchanged,
        accountCatalogVerified: true,
        trialBalanceVerified: true,
        generalLedgerVerified: true,
        reconciliationVerified: true,
        accountBridgeVerified: true,
        balanceBridgePrerequisitesVerified: true,
        balanceProofLineageVerified: true,
        periodContextVerified: true,
        newMonitorFamilyAdded: false,
        newDiscoveryFamilyAdded: false,
        monitorRunTriggered: false,
        missionCreated: false,
        reportCreated: false,
        approvalCreated: false,
        certificationCreated: false,
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
    pocketCfoLedgerReconciliationSourcePack.fixtureDirectory,
  );
  const sourceFiles = normalizeManifestSourceFiles();
  const expected = JSON.parse(
    await readFile(
      resolve(
        pocketCfoLedgerReconciliationSourcePack.expectedNormalizedPosturePath,
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
    pocketCfoLedgerReconciliationSourcePack.sourceRoles,
    expected.sourceRolesPresent,
  );
  assertJsonEqual(
    "source-pack extractor keys",
    pocketCfoLedgerReconciliationSourcePack.expectedExtractorKeys,
    expected.extractorKeysUsed,
  );
  assertJsonEqual(
    "source-pack source files",
    sourceFiles,
    normalizeExpectedSourceFiles(expected.sourceFiles),
  );
  assertJsonEqual(
    "source-pack role boundary",
    pocketCfoLedgerReconciliationSourcePack.sourceRoles,
    EXPECTED_SOURCE_ROLES,
  );
  assertJsonEqual(
    "source-pack extractor boundary",
    pocketCfoLedgerReconciliationSourcePack.expectedExtractorKeys,
    EXPECTED_EXTRACTOR_KEYS,
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
    if (Object.hasOwn(pocketCfoLedgerReconciliationSourcePack, forbidden)) {
      throw new Error(`Source pack must not declare ${forbidden}`);
    }
  }
}

async function registerSources(app, fixture, capturedAt) {
  const firstSourceFile = fixture.sourceFiles[0];
  const firstFile = fixture.files.get(firstSourceFile.role);

  if (!firstFile) {
    throw new Error(
      `Missing source-pack seed file for ${firstSourceFile.role}`,
    );
  }

  const created = await injectJson(app, {
    expectedStatus: 201,
    method: "POST",
    payload: {
      createdBy: CREATED_BY,
      description:
        "F6U ledger/reconciliation source-pack source for chart-of-accounts, trial-balance, and general-ledger proof files.",
      kind: "dataset",
      name: `F6U ledger/reconciliation ${fixture.expected.companyKey}`,
      snapshot: {
        capturedAt,
        checksumSha256: firstFile.checksumSha256,
        mediaType: firstSourceFile.mediaType,
        originalFileName: basename(firstSourceFile.path),
        sizeBytes: firstFile.body.byteLength,
        storageKind: "local_path",
        storageRef: firstFile.absolutePath,
      },
    },
    url: "/sources",
  });
  const sourceId = requireString(created?.source?.id, "source id");
  const registered = {};

  for (const sourceFile of fixture.sourceFiles) {
    const file = fixture.files.get(sourceFile.role);

    if (!file) {
      throw new Error(`Missing fixture file for ${sourceFile.role}`);
    }

    const uploaded = await injectJson(app, {
      expectedStatus: 201,
      headers: { "content-type": "application/octet-stream" },
      method: "POST",
      payload: file.body,
      url: `/sources/${sourceId}/files?${new URLSearchParams({
        capturedAt,
        createdBy: CREATED_BY,
        mediaType: sourceFile.mediaType,
        originalFileName: basename(sourceFile.path),
      }).toString()}`,
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
    summary,
    accountCatalog,
    generalLedger,
    reconciliation,
    accountBridge,
    balanceBridgePrerequisites,
  ] = await Promise.all([
    injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/finance-twin/companies/${companyKey}/summary`,
    }),
    injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/finance-twin/companies/${companyKey}/account-catalog`,
    }),
    injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/finance-twin/companies/${companyKey}/general-ledger`,
    }),
    injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/finance-twin/companies/${companyKey}/reconciliation/trial-balance-vs-general-ledger`,
    }),
    injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/finance-twin/companies/${companyKey}/reconciliation/trial-balance-vs-general-ledger/account-bridge`,
    }),
    injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/finance-twin/companies/${companyKey}/reconciliation/trial-balance-vs-general-ledger/balance-bridge-prerequisites`,
    }),
  ]);
  const proofAccount = findAccountByCode(
    balanceBridgePrerequisites.accounts,
    "1000",
  );

  if (!proofAccount?.balanceProofLineageRef) {
    throw new Error(
      `Expected cash account to expose balanceProofLineageRef, received ${JSON.stringify(
        proofAccount,
      )}`,
    );
  }

  const balanceProof = await injectJson(app, {
    expectedStatus: 200,
    method: "GET",
    url: `/finance-twin/companies/${companyKey}/general-ledger/accounts/${proofAccount.ledgerAccount.id}/balance-proof?${new URLSearchParams(
      {
        syncRunId: proofAccount.balanceProofLineageRef.syncRunId,
      },
    ).toString()}`,
  });
  const balanceProofLineage = await injectJson(app, {
    expectedStatus: 200,
    method: "GET",
    url: `/finance-twin/companies/${companyKey}/lineage/general_ledger_balance_proof/${proofAccount.balanceProofLineageRef.targetId}?${new URLSearchParams(
      {
        syncRunId: proofAccount.balanceProofLineageRef.syncRunId,
      },
    ).toString()}`,
  });

  return {
    accountBridge,
    accountCatalog,
    balanceBridgePrerequisites,
    balanceProof,
    balanceProofLineage,
    generalLedger,
    reconciliation,
    summary,
  };
}

function normalizePosture(input) {
  const chartCoverage =
    input.views.accountCatalog.latestSuccessfulSlice.coverage;
  const trialBalanceSlice =
    input.views.summary.latestSuccessfulSlices.trialBalance;
  const generalLedgerSlice = input.views.generalLedger.latestSuccessfulSlice;
  const cashAccount = findAccountByCode(
    input.views.balanceBridgePrerequisites.accounts,
    "1000",
  );

  return {
    sourcePackId: pocketCfoLedgerReconciliationSourcePack.id,
    companyKey: input.expected.companyKey,
    sourceRolesPresent: pocketCfoLedgerReconciliationSourcePack.sourceRoles,
    extractorKeysUsed: input.sourceFiles.map(
      (sourceFile) => input.syncs[sourceFile.role].extractorKey,
    ),
    sourceFiles: input.sourceFiles,
    sourcePostureByRole: {
      chart_of_accounts: normalizeRolePosture({
        coverage: chartCoverage,
        freshnessState: input.views.accountCatalog.freshness.state,
        limitations: input.views.accountCatalog.limitations,
        registered: input.registered.chart_of_accounts,
      }),
      trial_balance: normalizeRolePosture({
        coverage: trialBalanceSlice.coverage,
        freshnessState: input.views.summary.freshness.trialBalance.state,
        limitations: input.views.summary.limitations,
        registered: input.registered.trial_balance,
      }),
      general_ledger: normalizeRolePosture({
        coverage: generalLedgerSlice.coverage,
        freshnessState: input.views.generalLedger.freshness.state,
        limitations: input.views.generalLedger.limitations,
        registered: input.registered.general_ledger,
      }),
    },
    accountCatalogPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.accountCatalog.freshness.state,
      accountCount: input.views.accountCatalog.accounts.length,
      accountCodes: input.views.accountCatalog.accounts.map(
        (account) => account.ledgerAccount.accountCode,
      ),
      coverage: normalizeCoverage(chartCoverage),
      summary: input.views.accountCatalog.latestSuccessfulSlice.summary,
      lineagePresent: chartCoverage.lineageCount > 0,
      limitationsPresent: input.views.accountCatalog.limitations.length > 0,
    },
    chartOfAccountsAccountCountPosture: {
      accountCount:
        input.views.accountCatalog.latestSuccessfulSlice.summary.accountCount,
      activeAccountCount:
        input.views.accountCatalog.latestSuccessfulSlice.summary
          .activeAccountCount,
      inactiveAccountCount:
        input.views.accountCatalog.latestSuccessfulSlice.summary
          .inactiveAccountCount,
      parentLinkedCount:
        input.views.accountCatalog.latestSuccessfulSlice.summary
          .parentLinkedCount,
    },
    trialBalancePosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.summary.freshness.trialBalance.state,
      reportingPeriod: normalizeReportingPeriod(
        trialBalanceSlice.reportingPeriod,
      ),
      coverage: normalizeCoverage(trialBalanceSlice.coverage),
      summary: trialBalanceSlice.summary,
      limitationsPresent: input.views.summary.limitations.length > 0,
    },
    trialBalanceAccountCountPosture: {
      accountCount: trialBalanceSlice.summary.accountCount,
      lineCount: trialBalanceSlice.summary.lineCount,
    },
    generalLedgerPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.generalLedger.freshness.state,
      journalEntryExternalIds: input.views.generalLedger.entries.map(
        (entry) => entry.journalEntry.externalEntryId,
      ),
      accountCodes: uniqueSorted(
        input.views.generalLedger.entries.flatMap((entry) =>
          entry.lines.map((line) => line.ledgerAccount.accountCode),
        ),
      ),
      coverage: normalizeCoverage(generalLedgerSlice.coverage),
      periodContext: normalizePeriodContext(generalLedgerSlice.periodContext),
      summary: generalLedgerSlice.summary,
      limitationsPresent: input.views.generalLedger.limitations.length > 0,
    },
    generalLedgerJournalEntryLineCountPosture: {
      journalEntryCount: generalLedgerSlice.summary.journalEntryCount,
      journalLineCount: generalLedgerSlice.summary.journalLineCount,
    },
    reconciliationPosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.reconciliation.freshness.overall.state,
      sliceAlignment: normalizeSliceAlignment(
        input.views.reconciliation.sliceAlignment,
      ),
      comparability: normalizeComparability(
        input.views.reconciliation.comparability,
      ),
      coverageSummary: input.views.reconciliation.coverageSummary,
      accountPosture: normalizeReconciliationAccountPosture(
        input.views.reconciliation.accounts,
      ),
      limitationsPresent: input.views.reconciliation.limitations.length > 0,
      diagnosticsPresent: input.views.reconciliation.diagnostics.length > 0,
    },
    accountBridgePosture: {
      sourceBackedState: "source_backed",
      freshnessState: input.views.accountBridge.freshness.overall.state,
      sliceAlignment: normalizeSliceAlignment(
        input.views.accountBridge.sliceAlignment,
      ),
      bridgeReadiness: normalizeBridgeReadiness(
        input.views.accountBridge.bridgeReadiness,
      ),
      coverageSummary: input.views.accountBridge.coverageSummary,
      accountPosture: normalizeAccountBridgeAccountPosture(
        input.views.accountBridge.accounts,
      ),
      limitationsPresent: input.views.accountBridge.limitations.length > 0,
      diagnosticsPresent: input.views.accountBridge.diagnostics.length > 0,
    },
    balanceBridgePrerequisitesPosture: {
      sourceBackedState: "source_backed",
      freshnessState:
        input.views.balanceBridgePrerequisites.freshness.overall.state,
      accountBridgeReadiness: normalizeBridgeReadiness(
        input.views.balanceBridgePrerequisites.accountBridgeReadiness,
      ),
      balanceBridgePrerequisites: normalizeBalanceBridgePrerequisites(
        input.views.balanceBridgePrerequisites.balanceBridgePrerequisites,
      ),
      coverageSummary: input.views.balanceBridgePrerequisites.coverageSummary,
      accountPosture: normalizeBalanceBridgeAccountPosture(
        input.views.balanceBridgePrerequisites.accounts,
      ),
      limitationsPresent:
        input.views.balanceBridgePrerequisites.limitations.length > 0,
      diagnosticsPresent:
        input.views.balanceBridgePrerequisites.diagnostics.length > 0,
    },
    sourceBackedBalanceProofPosture: normalizeBalanceProof({
      balanceProof: input.views.balanceProof,
      proofAccount: cashAccount,
    }),
    balanceProofLineagePosture: normalizeBalanceProofLineage(
      input.views.balanceProofLineage,
    ),
    periodContextPosture: {
      ...normalizePeriodContext(
        input.views.generalLedger.latestSuccessfulSlice.periodContext,
      ),
      comparabilityState: input.views.reconciliation.comparability.state,
      windowRelation: input.views.reconciliation.comparability.windowRelation,
    },
    familyBoundary: input.familyBoundary,
    runtimeActionBoundary: input.runtimeActionBoundary,
    limitations: pocketCfoLedgerReconciliationSourcePack.limitations,
  };
}

function normalizeRolePosture(input) {
  return {
    sourceKind: input.registered.descriptor.sourceKind,
    mediaType: input.registered.descriptor.mediaType,
    extractorKey: input.registered.descriptor.expectedExtractorKey,
    sourceRegistered: Boolean(input.registered.created?.source?.id),
    sourceFileUploaded: Boolean(input.registered.uploaded?.sourceFile?.id),
    sourceSnapshotPresent: Boolean(input.registered.uploaded?.snapshot?.id),
    sourceFileChecksumPresent:
      typeof input.registered.uploaded?.sourceFile?.checksumSha256 === "string",
    freshnessState: input.freshnessState,
    sourceBackedState: "source_backed",
    lineagePresent: input.coverage.lineageCount > 0,
    limitationsPresent: input.limitations.length > 0,
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

function normalizeReportingPeriod(reportingPeriod) {
  if (!reportingPeriod) {
    return null;
  }

  return {
    periodKey: reportingPeriod.periodKey,
    periodStart: reportingPeriod.periodStart,
    periodEnd: reportingPeriod.periodEnd,
  };
}

function normalizePeriodContext(periodContext) {
  return {
    basis: periodContext.basis,
    sourceDeclaredPeriod: periodContext.sourceDeclaredPeriod,
    activityWindowEarliestEntryDate:
      periodContext.activityWindowEarliestEntryDate,
    activityWindowLatestEntryDate: periodContext.activityWindowLatestEntryDate,
    reasonCode: periodContext.reasonCode,
  };
}

function normalizeSliceAlignment(sliceAlignment) {
  return {
    state: sliceAlignment.state,
    implementedSliceCount: sliceAlignment.implementedSliceCount,
    availableSliceCount: sliceAlignment.availableSliceCount,
    distinctSourceCount: sliceAlignment.distinctSourceCount,
    distinctSyncRunCount: sliceAlignment.distinctSyncRunCount,
    distinctSourceSnapshotCount: sliceAlignment.distinctSourceSnapshotCount,
    sameSource: sliceAlignment.sameSource,
    sameSyncRun: sliceAlignment.sameSyncRun,
    sameSourceSnapshot: sliceAlignment.sameSourceSnapshot,
    reasonCode: sliceAlignment.reasonCode,
  };
}

function normalizeComparability(comparability) {
  return {
    state: comparability.state,
    basis: comparability.basis,
    windowRelation: comparability.windowRelation,
    trialBalanceWindow: normalizeTrialBalanceWindow(
      comparability.trialBalanceWindow,
    ),
    sourceDeclaredGeneralLedgerPeriod:
      comparability.sourceDeclaredGeneralLedgerPeriod,
    generalLedgerWindow: comparability.generalLedgerWindow,
    sameSource: comparability.sameSource,
    sameSourceSnapshot: comparability.sameSourceSnapshot,
    sameSyncRun: comparability.sameSyncRun,
    reasonCode: comparability.reasonCode,
  };
}

function normalizeTrialBalanceWindow(window) {
  if (!window) {
    return null;
  }

  return {
    periodKey: window.periodKey,
    periodStart: window.periodStart,
    periodEnd: window.periodEnd,
  };
}

function normalizeBridgeReadiness(readiness) {
  return {
    state: readiness.state,
    reasonCode: readiness.reasonCode,
    basis: readiness.basis,
    windowRelation: readiness.windowRelation,
    sameSource: readiness.sameSource,
    sameSourceSnapshot: readiness.sameSourceSnapshot,
    sameSyncRun: readiness.sameSyncRun,
  };
}

function normalizeBalanceBridgePrerequisites(prerequisites) {
  return {
    state: prerequisites.state,
    reasonCode: prerequisites.reasonCode,
    basis: prerequisites.basis,
    windowRelation: prerequisites.windowRelation,
    sameSource: prerequisites.sameSource,
    sameSourceSnapshot: prerequisites.sameSourceSnapshot,
    sameSyncRun: prerequisites.sameSyncRun,
    prerequisites: prerequisites.prerequisites,
  };
}

function normalizeReconciliationAccountPosture(accounts) {
  return {
    accountCodes: accountCodesWhere(accounts, () => true),
    overlapAccountCodes: accountCodesWhere(
      accounts,
      (account) =>
        account.presentInTrialBalance && account.presentInGeneralLedger,
    ),
    trialBalanceOnlyAccountCodes: accountCodesWhere(
      accounts,
      (account) => account.trialBalanceOnly,
    ),
    generalLedgerOnlyAccountCodes: accountCodesWhere(
      accounts,
      (account) => account.generalLedgerOnly,
    ),
    activityLineageAccountCodes: accountCodesWhere(accounts, (account) =>
      Boolean(account.activityLineageRef),
    ),
  };
}

function normalizeAccountBridgeAccountPosture(accounts) {
  return {
    accountCodes: accountCodesWhere(accounts, () => true),
    presentInChartOfAccountsCodes: accountCodesWhere(
      accounts,
      (account) => account.presentInChartOfAccounts,
    ),
    overlapAccountCodes: accountCodesWhere(
      accounts,
      (account) =>
        account.presentInTrialBalance && account.presentInGeneralLedger,
    ),
    trialBalanceOnlyAccountCodes: accountCodesWhere(
      accounts,
      (account) => account.trialBalanceOnly,
    ),
    generalLedgerOnlyAccountCodes: accountCodesWhere(
      accounts,
      (account) => account.generalLedgerOnly,
    ),
    inactiveWithGeneralLedgerActivityAccountCodes: accountCodesWhere(
      accounts,
      (account) => account.inactiveWithGeneralLedgerActivity,
    ),
    missingFromChartOfAccountsCodes: accountCodesWhere(
      accounts,
      (account) => account.missingFromChartOfAccounts,
    ),
    activityLineageAccountCodes: accountCodesWhere(accounts, (account) =>
      Boolean(account.activityLineageRef),
    ),
  };
}

function normalizeBalanceBridgeAccountPosture(accounts) {
  const proofAccount = findAccountByCode(accounts, "1000");

  return {
    accountCodes: accountCodesWhere(accounts, () => true),
    matchedPeriodReadyAccountCodes: accountCodesWhere(
      accounts,
      (account) => account.matchedPeriodAccountBridgeReady,
    ),
    prereqReadyAccountCodes: accountCodesWhere(
      accounts,
      (account) => account.balanceBridgePrereqReady,
    ),
    missingBalanceProofAccountCodes: accountCodesWhere(
      accounts,
      (account) =>
        account.blockedReasonCode === "balance_bridge_missing_balance_proof",
    ),
    missingOverlapAccountCodes: accountCodesWhere(
      accounts,
      (account) =>
        account.blockedReasonCode === "balance_bridge_missing_overlap" ||
        account.blockedReasonCode ===
          "balance_bridge_missing_trial_balance_overlap" ||
        account.blockedReasonCode ===
          "balance_bridge_missing_general_ledger_overlap",
    ),
    proofAccount: proofAccount
      ? {
          accountCode: proofAccount.ledgerAccount.accountCode,
          generalLedgerBalanceProof: normalizeProofFields(
            proofAccount.generalLedgerBalanceProof,
          ),
          activityLineageRefPresent: Boolean(proofAccount.activityLineageRef),
          balanceProofLineageRefPresent: Boolean(
            proofAccount.balanceProofLineageRef,
          ),
        }
      : null,
  };
}

function accountCodesWhere(accounts, predicate) {
  return accounts
    .filter(predicate)
    .map((account) => account.ledgerAccount.accountCode);
}

function normalizeBalanceProof(input) {
  const proof = input.balanceProof.proof?.balanceProof ?? null;

  return {
    targetAccountCode: input.proofAccount.ledgerAccount.accountCode,
    proofPresent: proof !== null,
    proofBasis: proof?.proofBasis ?? null,
    openingBalanceAmount: proof?.openingBalanceAmount ?? null,
    endingBalanceAmount: proof?.endingBalanceAmount ?? null,
    openingBalanceEvidencePresent:
      proof?.openingBalanceEvidencePresent ?? false,
    endingBalanceEvidencePresent: proof?.endingBalanceEvidencePresent ?? false,
    openingBalanceSourceColumn: proof?.openingBalanceSourceColumn ?? null,
    openingBalanceLineNumber: proof?.openingBalanceLineNumber ?? null,
    endingBalanceSourceColumn: proof?.endingBalanceSourceColumn ?? null,
    endingBalanceLineNumber: proof?.endingBalanceLineNumber ?? null,
    reasonCode: proof?.reasonCode ?? null,
    lineagePresent: (input.balanceProof.lineage?.recordCount ?? 0) > 0,
    lineageRecordCount: input.balanceProof.lineage?.recordCount ?? 0,
    limitationsPresent: input.balanceProof.limitations.length > 0,
    diagnosticsPresent: input.balanceProof.diagnostics.length > 0,
  };
}

function normalizeProofFields(proof) {
  return {
    openingBalanceAmount: proof.openingBalanceAmount,
    endingBalanceAmount: proof.endingBalanceAmount,
    openingBalanceEvidencePresent: proof.openingBalanceEvidencePresent,
    endingBalanceEvidencePresent: proof.endingBalanceEvidencePresent,
    openingBalanceSourceColumn: proof.openingBalanceSourceColumn,
    openingBalanceLineNumber: proof.openingBalanceLineNumber,
    endingBalanceSourceColumn: proof.endingBalanceSourceColumn,
    endingBalanceLineNumber: proof.endingBalanceLineNumber,
    proofBasis: proof.proofBasis,
    reasonCode: proof.reasonCode,
  };
}

function normalizeBalanceProofLineage(lineage) {
  return {
    targetKind: lineage.target.targetKind,
    recordCount: lineage.recordCount,
    lineageTargetKinds: uniqueSorted(
      lineage.records.map((record) => record.lineage.targetKind),
    ),
    extractorKeys: uniqueSorted(
      lineage.records.map((record) => record.syncRun.extractorKey),
    ),
    sourceKinds: uniqueSorted(
      lineage.records.map((record) => record.source.kind),
    ),
    sourceFileNames: uniqueSorted(
      lineage.records.map((record) => record.sourceFile.originalFileName),
    ),
    limitationsPresent: lineage.limitations.length > 0,
  };
}

function findAccountByCode(accounts, accountCode) {
  return accounts.find(
    (account) => account.ledgerAccount.accountCode === accountCode,
  );
}

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort();
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
    humanConfirmationBoundaryReadTriggered: false,
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
  return pocketCfoLedgerReconciliationSourcePack.sourceFiles.map(
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
