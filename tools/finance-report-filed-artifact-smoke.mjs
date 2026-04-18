import { createHash } from "node:crypto";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp } from "../apps/control-plane/src/app.ts";
import { createEmbeddedWorkerContainer } from "../apps/control-plane/src/bootstrap.ts";
import { closeAllPools } from "../packages/db/src/client.ts";
import { buildRunTag, loadNearestEnvFile, wait } from "./m2-exit-utils.mjs";

const DEFAULT_COMPANY_KEY = "local-finance-report-filed-artifact-company";
const DEFAULT_COMPANY_NAME = "Local Finance Report Filed Artifact Company";
const DEFAULT_CREATED_BY = "finance-report-filed-artifact-smoke";
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
      note: "Seed snapshot for the packaged F5B finance report filed-artifact smoke.",
      requestedBy: "finance_report_filed_artifact_smoke",
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
    sourceName: `Finance report filed-artifact smoke ${input.runTag}`,
    seed: {
      body: Buffer.from(`${seedText}\n`, "utf8"),
      mediaType: "application/json",
      originalFileName: `finance-report-filed-artifact-seed-${input.runTag}.json`,
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
        description: "Packaged F5B finance report filed-artifact smoke source.",
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
    const initialFiledPages = await injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/cfo-wiki/companies/${fixture.companyKey}/filed-pages`,
    });
    const initialExports = await injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/cfo-wiki/companies/${fixture.companyKey}/exports`,
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
    const reportingPublication = reportingDetail.reporting?.publication ?? null;
    const expectedMemoPageKey = `filed/reporting-${reportingDetail.mission.id}-finance_memo`;
    const expectedAppendixPageKey =
      `filed/reporting-${reportingDetail.mission.id}-evidence_appendix`;

    assert(
      reportingDetail.mission.type === "reporting" &&
        reportingDetail.mission.sourceKind === "manual_reporting" &&
        reportingDetail.mission.status === "succeeded",
      "Expected the created report mission to stay a succeeded manual_reporting mission.",
    );
    assert(
      reportingDetail.discoveryAnswer === null,
      "Expected reporting mission detail to avoid surfacing a discovery answer payload directly.",
    );
    assert(
      reportingDetail.reporting !== null &&
        reportingDetail.reporting.reportKind === "finance_memo" &&
        reportingDetail.reporting.draftStatus === "draft_only",
      "Expected reporting mission detail to expose finance_memo draft posture.",
    );
    assert(
      reportingDetail.reporting?.sourceDiscoveryMissionId === discoveryDetail.mission.id &&
        reportingDetail.reporting?.companyKey === fixture.companyKey &&
        reportingDetail.reporting?.questionKind === QUESTION_KIND,
      "Expected reporting detail to retain source discovery lineage and company scope.",
    );
    assert(
      reportingDetail.reporting?.financeMemo !== null &&
        reportingDetail.reporting?.evidenceAppendix !== null &&
        reportingDetail.reporting.financeMemo.bodyMarkdown.includes(
          "## Memo Summary",
        ) &&
        reportingDetail.reporting.evidenceAppendix.bodyMarkdown.includes(
          "## Source Discovery Lineage",
        ),
      "Expected the reporting detail view to expose the stored draft memo and evidence appendix bodies directly.",
    );
    assert(
      financeMemoArtifact !== null &&
        evidenceAppendixArtifact !== null &&
        reportingProofBundleArtifact !== null,
      "Expected reporting mission artifacts to include finance_memo, evidence_appendix, and proof_bundle_manifest.",
    );
    assert(
      reportingPublication?.storedDraft === true &&
        reportingPublication.filedMemo === null &&
        reportingPublication.filedEvidenceAppendix === null &&
        reportingPublication.latestMarkdownExport === null,
      "Expected the initial reporting publication posture to be stored-only before filing or export.",
    );
    assert(
      reportingDetail.proofBundle.reportPublication?.storedDraft === true &&
        reportingDetail.proofBundle.reportPublication?.filedMemo === null &&
        reportingDetail.proofBundle.reportPublication?.filedEvidenceAppendix ===
          null &&
        reportingDetail.proofBundle.reportPublication?.latestMarkdownExport === null,
      "Expected the reporting proof bundle to expose stored-only publication posture before filing or export.",
    );
    assert(
      listedReportingMission?.reportPublication?.storedDraft === true &&
        listedReportingMission.reportPublication?.filedMemo === null &&
        listedReportingMission.reportPublication?.filedEvidenceAppendix === null &&
        listedReportingMission.reportPublication?.latestMarkdownExport === null,
      "Expected the mission list read model to stay truthful about stored-only reporting posture.",
    );
    assert(
      reportingDetail.proofBundle.status === "ready" &&
        initialFiledPages.pageCount === 0 &&
        initialExports.exportCount === 0,
      "Expected F5A proof readiness to stay ready before later filing or export, with no filed pages or exports yet recorded.",
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

    const exportBeforeFiling = await app.inject({
      method: "POST",
      payload: {
        triggeredBy: fixture.createdBy,
      },
      url: `/missions/${reportingDetail.mission.id}/reporting/export`,
    });
    assert(
      exportBeforeFiling.statusCode === 400,
      `Expected markdown export to be rejected before filing, received ${exportBeforeFiling.statusCode}.`,
    );
    assert(
      exportBeforeFiling
        .json()
        .error.details.some((detail) => detail.message.includes("must file both")),
      "Expected export-before-filing rejection to explain that both draft artifacts must be filed first.",
    );

    const filed = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        filedBy: fixture.createdBy,
      },
      url: `/missions/${reportingDetail.mission.id}/reporting/filed-artifacts`,
    });
    const filedPages = await injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/cfo-wiki/companies/${fixture.companyKey}/filed-pages`,
    });
    const [memoPage, appendixPage, detailAfterFiling, missionListAfterFiling] =
      await Promise.all([
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: `/cfo-wiki/companies/${fixture.companyKey}/pages/${encodeURIComponent(expectedMemoPageKey)}`,
        }),
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: `/cfo-wiki/companies/${fixture.companyKey}/pages/${encodeURIComponent(expectedAppendixPageKey)}`,
        }),
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: `/missions/${reportingDetail.mission.id}`,
        }),
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: "/missions?limit=20",
        }),
      ]);
    const listedAfterFiling =
      missionListAfterFiling.missions.find(
        (mission) => mission.id === reportingDetail.mission.id,
      ) ?? null;

    assert(
      filed.publication.filedMemo?.pageKey === expectedMemoPageKey &&
        filed.publication.filedEvidenceAppendix?.pageKey === expectedAppendixPageKey,
      "Expected the mission-centric file action to persist deterministic filed page keys for both draft artifacts.",
    );
    assert(
      filedPages.pageCount === 2 &&
        filedPages.pages.some((page) => page.pageKey === expectedMemoPageKey) &&
        filedPages.pages.some((page) => page.pageKey === expectedAppendixPageKey),
      "Expected the existing CFO Wiki filed-page seam to list both reporting filed pages after filing.",
    );
    assert(
      memoPage.page.filedMetadata?.provenanceSummary.includes(
        reportingDetail.mission.id,
      ) &&
        memoPage.page.filedMetadata?.provenanceSummary.includes(
          discoveryDetail.mission.id,
        ) &&
        memoPage.page.filedMetadata?.provenanceSummary.includes("finance_memo") &&
        memoPage.page.markdownBody.includes("## Memo Summary"),
      "Expected the filed memo page to preserve explicit reporting provenance and the stored memo markdown body.",
    );
    assert(
      appendixPage.page.filedMetadata?.provenanceSummary.includes(
        reportingDetail.mission.id,
      ) &&
        appendixPage.page.filedMetadata?.provenanceSummary.includes(
          discoveryDetail.mission.id,
        ) &&
        appendixPage.page.filedMetadata?.provenanceSummary.includes(
          "evidence_appendix",
        ) &&
        appendixPage.page.markdownBody.includes("## Source Discovery Lineage"),
      "Expected the filed appendix page to preserve explicit reporting provenance and the stored appendix markdown body.",
    );
    assert(
      detailAfterFiling.proofBundle.status === "ready" &&
        detailAfterFiling.reporting?.publication?.filedMemo?.pageKey ===
          expectedMemoPageKey &&
        detailAfterFiling.reporting?.publication?.filedEvidenceAppendix?.pageKey ===
          expectedAppendixPageKey &&
        detailAfterFiling.reporting?.publication?.latestMarkdownExport === null,
      "Expected mission detail to show filed posture separately while preserving ready proof status after filing.",
    );
    assert(
      detailAfterFiling.proofBundle.reportPublication?.filedMemo?.pageKey ===
        expectedMemoPageKey &&
        detailAfterFiling.proofBundle.reportPublication?.filedEvidenceAppendix
          ?.pageKey === expectedAppendixPageKey &&
        detailAfterFiling.proofBundle.reportPublication?.latestMarkdownExport ===
          null,
      "Expected the proof bundle publication summary to stay additive after filing and before export.",
    );
    assert(
      listedAfterFiling?.reportPublication?.filedMemo?.pageKey ===
        expectedMemoPageKey &&
        listedAfterFiling.reportPublication?.filedEvidenceAppendix?.pageKey ===
          expectedAppendixPageKey &&
        listedAfterFiling.reportPublication?.latestMarkdownExport === null,
      "Expected the mission list read model to expose filed posture without implying export has already happened.",
    );

    const exported = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        triggeredBy: fixture.createdBy,
      },
      url: `/missions/${reportingDetail.mission.id}/reporting/export`,
    });
    const exportRunId = requireUuid(
      exported.publication.latestMarkdownExport?.exportRunId,
      "export run id",
    );
    const [exportsAfterRun, exportDetail, detailAfterExport, missionListAfterExport] =
      await Promise.all([
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: `/cfo-wiki/companies/${fixture.companyKey}/exports`,
        }),
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: `/cfo-wiki/companies/${fixture.companyKey}/exports/${exportRunId}`,
        }),
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: `/missions/${reportingDetail.mission.id}`,
        }),
        injectJson(app, {
          expectedStatus: 200,
          method: "GET",
          url: "/missions?limit=20",
        }),
      ]);
    const listedAfterExport =
      missionListAfterExport.missions.find(
        (mission) => mission.id === reportingDetail.mission.id,
      ) ?? null;

    assert(
      exported.publication.latestMarkdownExport?.includesLatestFiledArtifacts ===
        true,
      "Expected the mission-centric markdown export action to mark the latest filed draft artifacts as included.",
    );
    assert(
      exportsAfterRun.exportCount >= 1 &&
        exportsAfterRun.exports.some((run) => run.id === exportRunId),
      "Expected the existing company export seam to record the reporting-triggered markdown export run.",
    );
    assert(
      exportDetail.exportRun.status === "succeeded" &&
        exportDetail.exportRun.manifest?.pages.some(
          (page) => page.pageKey === expectedMemoPageKey,
        ) &&
        exportDetail.exportRun.manifest?.pages.some(
          (page) => page.pageKey === expectedAppendixPageKey,
        ),
      "Expected the markdown export manifest to include both newly filed reporting pages.",
    );
    assert(
      detailAfterExport.proofBundle.status === "ready" &&
        detailAfterExport.reporting?.publication?.latestMarkdownExport
          ?.exportRunId === exportRunId &&
        detailAfterExport.reporting?.publication?.latestMarkdownExport
          ?.includesLatestFiledArtifacts === true,
      "Expected mission detail to expose exported posture while preserving ready proof status after export.",
    );
    assert(
      detailAfterExport.proofBundle.reportPublication?.latestMarkdownExport
        ?.exportRunId === exportRunId &&
        detailAfterExport.proofBundle.reportPublication?.latestMarkdownExport
          ?.includesLatestFiledArtifacts === true,
      "Expected the proof bundle publication posture to expose export linkage additively after export.",
    );
    assert(
      listedAfterExport?.reportPublication?.latestMarkdownExport?.exportRunId ===
        exportRunId &&
        listedAfterExport.reportPublication?.latestMarkdownExport
          ?.includesLatestFiledArtifacts === true,
      "Expected the mission list read model to expose export linkage after the markdown bundle runs.",
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
            proofBundleStatus: detailAfterExport.proofBundle.status,
            scoutTaskStatus:
              detailAfterExport.tasks.find((task) => task.role === "scout")
                ?.status ?? null,
          },
          storedPublication: {
            summary: reportingDetail.reporting.publication.summary,
            storedDraft: reportingDetail.reporting.publication.storedDraft,
            filedMemo: reportingDetail.reporting.publication.filedMemo,
            filedEvidenceAppendix:
              reportingDetail.reporting.publication.filedEvidenceAppendix,
            latestMarkdownExport:
              reportingDetail.reporting.publication.latestMarkdownExport,
          },
          filedPublication: {
            summary: detailAfterFiling.reporting.publication.summary,
            memoPageKey: detailAfterFiling.reporting.publication.filedMemo?.pageKey,
            appendixPageKey:
              detailAfterFiling.reporting.publication.filedEvidenceAppendix
                ?.pageKey,
          },
          exportedPublication: {
            summary: detailAfterExport.reporting.publication.summary,
            exportRunId:
              detailAfterExport.reporting.publication.latestMarkdownExport
                ?.exportRunId,
            includesLatestFiledArtifacts:
              detailAfterExport.reporting.publication.latestMarkdownExport
                ?.includesLatestFiledArtifacts,
          },
          proofBundlePublication: detailAfterExport.proofBundle.reportPublication,
          missionListPublication: listedAfterExport.reportPublication,
          filedPages: {
            pageCount: filedPages.pageCount,
            pageKeys: filedPages.pages.map((page) => page.pageKey),
          },
          exportRun: {
            exportRunId,
            status: exportDetail.exportRun.status,
            pageCount: exportDetail.exportRun.pageCount,
            fileCount: exportDetail.exportRun.fileCount,
            manifestPageKeys:
              exportDetail.exportRun.manifest?.pages.map((page) => page.pageKey) ??
              [],
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
    join(tmpdir(), "pocket-cfo-finance-report-filed-artifact-smoke-"),
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
