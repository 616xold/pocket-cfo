import { createHash } from "node:crypto";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp } from "../apps/control-plane/src/app.ts";
import { createEmbeddedWorkerContainer } from "../apps/control-plane/src/bootstrap.ts";
import { closeAllPools } from "../packages/db/src/client.ts";
import { buildRunTag, loadNearestEnvFile, wait } from "./m2-exit-utils.mjs";

const DEFAULT_COMPANY_KEY = "local-finance-memo-company";
const DEFAULT_COMPANY_NAME = "Local Finance Memo Company";
const DEFAULT_CREATED_BY = "finance-memo-smoke";
const MODULE_PATH = fileURLToPath(import.meta.url);
const POLL_INTERVAL_MS = 250;
const MAX_POLLS = 40;
const QUESTION_KIND = "cash_posture";
const OPERATOR_PROMPT = "What is our current cash posture from stored state?";
const SILENT_LOGGER = {
  error() {},
  info() {},
};

function parseArgs(argv) {
  const options = {
    companyKey: DEFAULT_COMPANY_KEY,
    companyName: DEFAULT_COMPANY_NAME,
    createdBy: DEFAULT_CREATED_BY,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const entry = argv[index];

    if (!entry?.startsWith("--")) {
      throw new Error(`Unexpected argument: ${entry}`);
    }

    const [rawFlag, inlineValue] = entry.slice(2).split("=", 2);
    const value = inlineValue ?? argv[index + 1];

    if (inlineValue === undefined) {
      index += 1;
    }

    if (value === undefined) {
      throw new Error(`Missing value for --${rawFlag}`);
    }

    switch (rawFlag) {
      case "company-key":
        options.companyKey = value;
        break;
      case "company-name":
        options.companyName = value;
        break;
      case "created-by":
        options.createdBy = value;
        break;
      default:
        throw new Error(`Unexpected argument: --${rawFlag}`);
    }
  }

  return options;
}

function buildFixture(input) {
  const seedText = JSON.stringify(
    {
      createdBy: input.createdBy,
      note: "Seed snapshot for the packaged F5A finance memo smoke.",
      requestedBy: "finance_memo_smoke",
      runTag: input.runTag,
    },
    null,
    2,
  );
  const uploadText = [
    "account_name,bank,last4,statement_balance,available_balance,current_balance,currency,as_of",
    `Operating Checking,First National,1234,1200.00,1000.00,,USD,${input.primaryAsOfDate}`,
    "Payroll Reserve,First National,5678,,,250.00,USD,",
    `Treasury Sweep,First National,9012,,400.00,,USD,${input.secondaryAsOfDate}`,
    `Euro Operating,Euro Bank,9999,300.00,,,EUR,${input.primaryAsOfDate}`,
  ].join("\n");

  return {
    createdBy: input.createdBy,
    companyKey: `${input.companyKey}-${input.runTag.toLowerCase()}`,
    companyName: `${input.companyName} ${input.runTag}`,
    sourceName: `Finance memo smoke ${input.runTag}`,
    seed: {
      body: Buffer.from(`${seedText}\n`, "utf8"),
      mediaType: "application/json",
      originalFileName: `finance-memo-seed-${input.runTag}.json`,
    },
    upload: {
      body: Buffer.from(`${uploadText}\n`, "utf8"),
      mediaType: "text/csv",
      originalFileName: `bank-account-summary-${input.runTag}.csv`,
    },
  };
}

async function main() {
  loadNearestEnvFile();

  const options = parseArgs(process.argv.slice(2).filter((entry) => entry !== "--"));
  const runTag = buildRunTag();
  const now = new Date();
  const primaryAsOfDate = now.toISOString().slice(0, 10);
  const secondaryAsOfDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const fixture = buildFixture({
    ...options,
    primaryAsOfDate,
    runTag,
    secondaryAsOfDate,
  });
  const capturedAt = now.toISOString();
  const seedSnapshot = await writeSeedSnapshot(fixture.seed);
  let app = null;
  let container = null;

  try {
    container = await createEmbeddedWorkerContainer();
    app = await buildApp({ container });
    app.log.level = "silent";

    const createdSource = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        createdBy: fixture.createdBy,
        description: "Packaged F5A finance memo smoke source.",
        kind: "dataset",
        name: fixture.sourceName,
        snapshot: {
          capturedAt,
          checksumSha256: seedSnapshot.checksumSha256,
          mediaType: fixture.seed.mediaType,
          originalFileName: fixture.seed.originalFileName,
          sizeBytes: fixture.seed.body.byteLength,
          storageKind: "local_path",
          storageRef: seedSnapshot.storageRef,
        },
      },
      url: "/sources",
    });
    const sourceId = requireUuid(createdSource?.source?.id, "source id");
    const uploaded = await injectJson(app, {
      expectedStatus: 201,
      headers: {
        "content-type": "application/octet-stream",
      },
      method: "POST",
      payload: fixture.upload.body,
      url: `/sources/${sourceId}/files?${new URLSearchParams({
        capturedAt,
        createdBy: fixture.createdBy,
        mediaType: fixture.upload.mediaType,
        originalFileName: fixture.upload.originalFileName,
      }).toString()}`,
    });
    const sourceFileId = requireUuid(uploaded?.sourceFile?.id, "source file id");
    const financeSync = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        companyName: fixture.companyName,
      },
      url: `/finance-twin/companies/${fixture.companyKey}/source-files/${sourceFileId}/sync`,
    });
    const wikiCompile = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        triggeredBy: fixture.createdBy,
      },
      url: `/cfo-wiki/companies/${fixture.companyKey}/compile`,
    });

    const [bankAccounts, cashPosture, cashMetricPage, cashConceptPage, companyOverview] =
      await Promise.all([
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: `/finance-twin/companies/${fixture.companyKey}/bank-accounts`,
        }),
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: `/finance-twin/companies/${fixture.companyKey}/cash-posture`,
        }),
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: `/cfo-wiki/companies/${fixture.companyKey}/pages/${encodeURIComponent("metrics/cash-posture")}`,
        }),
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: `/cfo-wiki/companies/${fixture.companyKey}/pages/${encodeURIComponent("concepts/cash")}`,
        }),
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: `/cfo-wiki/companies/${fixture.companyKey}/pages/${encodeURIComponent("company/overview")}`,
        }),
      ]);

    assert(
      bankAccounts.accountCount === 4,
      `Expected four persisted bank accounts, received ${bankAccounts.accountCount}.`,
    );
    assert(
      cashPosture.currencyBuckets.some((bucket) => bucket.currency === "USD"),
      "Expected cash posture to include a USD currency bucket.",
    );
    assert(
      wikiCompile.changedPageKeys.includes("metrics/cash-posture") &&
        wikiCompile.changedPageKeys.includes("concepts/cash") &&
        wikiCompile.changedPageKeys.includes("company/overview"),
      "Expected the CFO Wiki compile to include the cash-posture, cash concept, and company overview pages.",
    );
    assert(
      cashMetricPage.page.pageKey === "metrics/cash-posture" &&
        cashConceptPage.page.pageKey === "concepts/cash" &&
        companyOverview.page.pageKey === "company/overview",
      "Expected the related CFO Wiki pages to be readable before mission execution.",
    );

    const createdDiscoveryMission = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        companyKey: fixture.companyKey,
        operatorPrompt: OPERATOR_PROMPT,
        questionKind: QUESTION_KIND,
        requestedBy: fixture.createdBy,
      },
      url: "/missions/analysis",
    });
    const discoveryDetail = await pollMissionDetail({
      app,
      missionId: createdDiscoveryMission.mission.id,
      worker: container.worker,
    });

    const sourceDiscoveryAnswer = discoveryDetail.discoveryAnswer;
    const sourceDiscoveryAnswerArtifact =
      discoveryDetail.artifacts.find((artifact) => artifact.kind === "discovery_answer") ??
      null;
    const sourceProofBundleArtifact =
      discoveryDetail.artifacts.find(
        (artifact) => artifact.kind === "proof_bundle_manifest",
      ) ?? null;

    assert(
      discoveryDetail.mission.type === "discovery" &&
        discoveryDetail.mission.status === "succeeded",
      "Expected the source discovery mission to succeed before reporting starts.",
    );
    assert(
      sourceDiscoveryAnswer !== null,
      "Expected the source discovery mission to persist a finance discovery answer.",
    );
    assert(
      sourceDiscoveryAnswerArtifact !== null && sourceProofBundleArtifact !== null,
      "Expected the source discovery mission to persist discovery_answer and proof_bundle_manifest artifacts.",
    );
    assert(
      discoveryDetail.proofBundle.status === "ready",
      "Expected the source discovery proof bundle to be ready before reporting starts.",
    );

    const createdReportingMission = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        requestedBy: fixture.createdBy,
        reportKind: "finance_memo",
        sourceDiscoveryMissionId: discoveryDetail.mission.id,
      },
      url: "/missions/reporting",
    });
    const reportingDetail = await pollMissionDetail({
      app,
      missionId: createdReportingMission.mission.id,
      worker: container.worker,
    });
    const missionList = await injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: "/missions?limit=20",
    });

    const financeMemoArtifact =
      reportingDetail.artifacts.find((artifact) => artifact.kind === "finance_memo") ??
      null;
    const evidenceAppendixArtifact =
      reportingDetail.artifacts.find(
        (artifact) => artifact.kind === "evidence_appendix",
      ) ?? null;
    const reportingProofBundleArtifact =
      reportingDetail.artifacts.find(
        (artifact) => artifact.kind === "proof_bundle_manifest",
      ) ?? null;
    const listedReportingMission =
      missionList.missions.find((mission) => mission.id === reportingDetail.mission.id) ??
      null;

    assert(
      reportingDetail.mission.type === "reporting",
      "Expected the created report mission to be a reporting mission.",
    );
    assert(
      reportingDetail.mission.sourceKind === "manual_reporting",
      "Expected reporting mission source kind to be manual_reporting.",
    );
    assert(
      reportingDetail.mission.status === "succeeded",
      "Expected the reporting mission to succeed.",
    );
    assert(
      reportingDetail.discoveryAnswer === null,
      "Expected reporting mission detail to avoid surfacing a discovery answer payload directly.",
    );
    assert(
      reportingDetail.reporting !== null,
      "Expected the reporting mission detail view to expose reporting metadata.",
    );
    assert(
      reportingDetail.reporting?.reportKind === "finance_memo" &&
        reportingDetail.reporting?.draftStatus === "draft_only",
      "Expected the reporting view to expose finance_memo draft posture.",
    );
    assert(
      reportingDetail.reporting?.sourceDiscoveryMissionId === discoveryDetail.mission.id,
      "Expected reporting view to retain source discovery lineage.",
    );
    assert(
      reportingDetail.reporting?.companyKey === fixture.companyKey &&
        reportingDetail.reporting?.questionKind === QUESTION_KIND,
      "Expected reporting view to retain company scope and source question kind.",
    );
    assert(
      reportingDetail.reporting?.appendixPresent === true,
      "Expected reporting view to record linked appendix presence.",
    );
    assert(
      reportingDetail.reporting?.financeMemo !== null &&
        reportingDetail.reporting?.evidenceAppendix !== null,
      "Expected reporting view to expose the persisted finance memo and evidence appendix metadata.",
    );
    assert(
      financeMemoArtifact !== null &&
        evidenceAppendixArtifact !== null &&
        reportingProofBundleArtifact !== null,
      "Expected reporting mission artifacts to include finance_memo, evidence_appendix, and proof_bundle_manifest.",
    );
    assert(
      reportingDetail.reporting?.financeMemo?.sourceArtifacts.some(
        (artifact) =>
          artifact.kind === "discovery_answer" &&
          artifact.artifactId === sourceDiscoveryAnswerArtifact.id,
      ) &&
        reportingDetail.reporting?.financeMemo?.sourceArtifacts.some(
          (artifact) =>
            artifact.kind === "proof_bundle_manifest" &&
            artifact.artifactId === sourceProofBundleArtifact.id,
        ),
      "Expected the draft finance memo to link back to the stored discovery answer and proof bundle artifacts.",
    );
    assert(
      reportingDetail.reporting?.financeMemo?.bodyMarkdown.includes(
        "## Memo Summary",
      ) &&
        reportingDetail.reporting?.evidenceAppendix?.bodyMarkdown.includes(
          "## Source Discovery Lineage",
        ),
      "Expected the draft reporting artifacts to retain deterministic markdown section layouts.",
    );
    assert(
      reportingDetail.reporting?.freshnessSummary ===
        sourceDiscoveryAnswer?.freshnessPosture.reasonSummary &&
        reportingDetail.proofBundle.freshnessSummary ===
          sourceDiscoveryAnswer?.freshnessPosture.reasonSummary,
      "Expected reporting freshness to be carried forward from the stored discovery evidence.",
    );
    assert(
      sourceDiscoveryAnswer?.limitations.every((limitation) =>
        reportingDetail.reporting?.evidenceAppendix?.limitations.includes(
          limitation,
        ),
      ),
      "Expected reporting appendix limitations to carry forward the source discovery limitations.",
    );
    assert(
      reportingDetail.proofBundle.reportKind === "finance_memo" &&
        reportingDetail.proofBundle.reportDraftStatus === "draft_only" &&
        reportingDetail.proofBundle.sourceDiscoveryMissionId ===
          discoveryDetail.mission.id &&
        reportingDetail.proofBundle.appendixPresent === true,
      "Expected the reporting proof bundle to expose report kind, draft posture, source lineage, and appendix presence.",
    );
    assert(
      reportingDetail.proofBundle.status === "ready",
      "Expected the reporting proof bundle to be ready after artifact compilation.",
    );
    assert(
      reportingDetail.tasks.length === 1 &&
        reportingDetail.tasks.every(
          (task) =>
            task.role === "scout" &&
            task.codexThreadId === null &&
            task.codexTurnId === null,
        ),
      "Expected the reporting path to stay scout-only and avoid runtime-codex threads.",
    );
    assert(
      listedReportingMission !== null,
      "Expected the reporting mission to appear in the mission list.",
    );
    assert(
      listedReportingMission?.sourceDiscoveryMissionId === discoveryDetail.mission.id &&
        listedReportingMission?.reportKind === "finance_memo" &&
        listedReportingMission?.reportDraftStatus === "draft_only" &&
        listedReportingMission?.appendixPresent === true,
      "Expected the mission list read model to expose reporting lineage and draft posture explicitly.",
    );
    assert(
      listedReportingMission?.answerSummary === null &&
        typeof listedReportingMission?.reportSummary === "string" &&
        listedReportingMission.reportSummary.length > 0 &&
        listedReportingMission.freshnessState !== null,
      "Expected the mission list read model to expose report summary and freshness without overloading discovery answer fields.",
    );

    console.log(
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          company: {
            companyKey: fixture.companyKey,
            displayName: fixture.companyName,
          },
          financeSync: {
            sourceId,
            sourceFileId,
            syncRunId: financeSync.syncRun.id,
            status: financeSync.syncRun.status,
          },
          wikiCompile: {
            compileRunId: wikiCompile.compileRun.id,
            status: wikiCompile.compileRun.status,
            changedPageKeys: wikiCompile.changedPageKeys,
          },
          discoveryMission: {
            id: discoveryDetail.mission.id,
            status: discoveryDetail.mission.status,
            questionKind: sourceDiscoveryAnswer.questionKind,
            proofBundleStatus: discoveryDetail.proofBundle.status,
            discoveryAnswerArtifactId: sourceDiscoveryAnswerArtifact.id,
            proofBundleArtifactId: sourceProofBundleArtifact.id,
          },
          reportingMission: {
            id: reportingDetail.mission.id,
            status: reportingDetail.mission.status,
            sourceDiscoveryMissionId:
              reportingDetail.reporting.sourceDiscoveryMissionId,
            reportKind: reportingDetail.reporting.reportKind,
            draftStatus: reportingDetail.reporting.draftStatus,
            proofBundleStatus: reportingDetail.proofBundle.status,
            scoutTaskStatus:
              reportingDetail.tasks.find((task) => task.role === "scout")?.status ??
              null,
          },
          reportingArtifacts: {
            financeMemoArtifactId: financeMemoArtifact.id,
            evidenceAppendixArtifactId: evidenceAppendixArtifact.id,
            proofBundleArtifactId: reportingProofBundleArtifact.id,
          },
          reportingView: {
            reportSummary: reportingDetail.reporting.reportSummary,
            freshnessSummary: reportingDetail.reporting.freshnessSummary,
            limitationsSummary: reportingDetail.reporting.limitationsSummary,
            relatedRoutePaths: reportingDetail.reporting.relatedRoutePaths,
            relatedWikiPageKeys: reportingDetail.reporting.relatedWikiPageKeys,
            sourceArtifacts: reportingDetail.reporting.financeMemo.sourceArtifacts,
          },
          missionList: {
            companyKey: listedReportingMission.companyKey,
            sourceDiscoveryMissionId: listedReportingMission.sourceDiscoveryMissionId,
            reportKind: listedReportingMission.reportKind,
            reportDraftStatus: listedReportingMission.reportDraftStatus,
            freshnessState: listedReportingMission.freshnessState,
            reportSummary: listedReportingMission.reportSummary,
            appendixPresent: listedReportingMission.appendixPresent,
          },
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

async function writeSeedSnapshot(seed) {
  const directory = await mkdtemp(
    join(tmpdir(), "pocket-cfo-finance-memo-smoke-"),
  );
  const storageRef = join(directory, seed.originalFileName);

  await writeFile(storageRef, seed.body);

  return {
    checksumSha256: createHash("sha256").update(seed.body).digest("hex"),
    storageRef,
  };
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

async function pollMissionDetail(input) {
  for (let attempt = 0; attempt < MAX_POLLS; attempt += 1) {
    await input.worker.run({
      log: SILENT_LOGGER,
      pollIntervalMs: 1,
      runOnce: true,
    });

    const detail = await injectJson(input.app, {
      expectedStatus: 200,
      method: "GET",
      url: `/missions/${input.missionId}`,
    });

    if (
      isTerminalMissionStatus(detail.mission.status) &&
      detail.tasks.every((task) => isTerminalTaskStatus(task.status))
    ) {
      return detail;
    }

    await wait(POLL_INTERVAL_MS);
  }

  throw new Error(
    `Mission ${input.missionId} did not reach a terminal state within ${MAX_POLLS} polls.`,
  );
}

function isTerminalMissionStatus(status) {
  return ["succeeded", "failed", "cancelled"].includes(status);
}

function isTerminalTaskStatus(status) {
  return ["succeeded", "failed", "cancelled"].includes(status);
}

function requireUuid(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} missing from response`);
  }

  return value;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === MODULE_PATH) {
  await main();
}
