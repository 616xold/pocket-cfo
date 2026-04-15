import { createHash } from "node:crypto";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp } from "../apps/control-plane/src/app.ts";
import { createEmbeddedWorkerContainer } from "../apps/control-plane/src/bootstrap.ts";
import { closeAllPools } from "../packages/db/src/client.ts";
import { buildRunTag, loadNearestEnvFile, wait } from "./m2-exit-utils.mjs";

const DEFAULT_COMPANY_KEY = "local-finance-discovery-answer-company";
const DEFAULT_COMPANY_NAME = "Local Finance Discovery Answer Company";
const DEFAULT_CREATED_BY = "finance-discovery-answer-smoke";
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
      note: "Seed snapshot for the packaged F4A finance-discovery answer smoke.",
      requestedBy: "finance_discovery_answer_smoke",
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
    sourceName: `Finance discovery answer smoke ${input.runTag}`,
    seed: {
      body: Buffer.from(`${seedText}\n`, "utf8"),
      mediaType: "application/json",
      originalFileName: `finance-discovery-answer-seed-${input.runTag}.json`,
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
        description: "Packaged F4A finance discovery smoke source.",
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

    const createdMission = await injectJson(app, {
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
    const detail = await pollMissionDetail({
      app,
      missionId: createdMission.mission.id,
      worker: container.worker,
    });
    const list = await injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: "/missions?limit=20",
    });

    const discoveryAnswer = detail.discoveryAnswer;
    const discoveryAnswerArtifact =
      detail.artifacts.find((artifact) => artifact.kind === "discovery_answer") ??
      null;
    const proofBundleArtifact =
      detail.artifacts.find((artifact) => artifact.kind === "proof_bundle_manifest") ??
      null;
    const listedMission =
      list.missions.find((mission) => mission.id === detail.mission.id) ?? null;

    assert(detail.mission.type === "discovery", "Expected a discovery mission.");
    assert(detail.mission.primaryRepo === null, "Expected no primary repo for finance analysis.");
    assert(detail.mission.status === "succeeded", "Expected the finance analysis mission to succeed.");
    assert(discoveryAnswer !== null, "Expected a persisted finance discovery answer.");
    assert(
      discoveryAnswer?.source === "stored_finance_twin_and_cfo_wiki",
      "Expected the discovery answer to read from stored Finance Twin and CFO Wiki state.",
    );
    assert(
      discoveryAnswer?.companyKey === fixture.companyKey &&
        discoveryAnswer?.questionKind === QUESTION_KIND,
      "Expected the discovery answer to retain company scope and question kind.",
    );
    assert(
      discoveryAnswer?.relatedRoutes.some((route) =>
        route.routePath.endsWith("/cash-posture"),
      ) &&
        discoveryAnswer?.relatedRoutes.some((route) =>
          route.routePath.endsWith("/bank-accounts"),
        ),
      "Expected related finance-twin routes to be recorded on the answer.",
    );
    assert(
      discoveryAnswer?.relatedWikiPages.some(
        (page) => page.pageKey === "metrics/cash-posture",
      ) &&
        discoveryAnswer?.relatedWikiPages.some(
          (page) => page.pageKey === "concepts/cash",
        ) &&
        discoveryAnswer?.relatedWikiPages.some(
          (page) => page.pageKey === "company/overview",
        ),
      "Expected related CFO Wiki pages to be recorded on the answer.",
    );
    assert(
      discoveryAnswer?.evidenceSections.length >= 5,
      "Expected the answer to include route-backed and wiki-backed evidence sections.",
    );
    assert(
      discoveryAnswer?.limitations.length > 0,
      "Expected the answer to expose at least one visible limitation.",
    );
    assert(
      discoveryAnswer?.bodyMarkdown.includes("## Freshness posture") &&
        discoveryAnswer?.bodyMarkdown.includes("## Limitations"),
      "Expected the answer markdown body to expose freshness and limitations sections.",
    );
    assert(
      detail.proofBundle.companyKey === fixture.companyKey &&
        detail.proofBundle.questionKind === QUESTION_KIND,
      "Expected the proof bundle to persist finance analysis scope.",
    );
    assert(
      detail.proofBundle.targetRepoFullName === null &&
        detail.proofBundle.branchName === null &&
        detail.proofBundle.pullRequestNumber === null &&
        detail.proofBundle.pullRequestUrl === null,
      "Expected the finance proof bundle to avoid repo and PR assumptions.",
    );
    assert(
      detail.proofBundle.relatedRoutePaths.length >= 2 &&
        detail.proofBundle.relatedWikiPageKeys.length >= 3,
      "Expected the proof bundle to retain related routes and wiki pages.",
    );
    assert(
      detail.proofBundle.answerSummary.length > 0 &&
        detail.proofBundle.freshnessSummary.length > 0,
      "Expected the proof bundle to retain answer and freshness summaries.",
    );
    assert(
      detail.proofBundle.status === "ready",
      "Expected the finance proof bundle to be ready after mission completion.",
    );
    assert(
      discoveryAnswerArtifact !== null && proofBundleArtifact !== null,
      "Expected discovery answer and proof-bundle manifest artifacts to be persisted.",
    );
    assert(listedMission !== null, "Expected the finance mission to appear in the mission list.");
    assert(
      listedMission?.companyKey === fixture.companyKey &&
        listedMission?.questionKind === QUESTION_KIND,
      "Expected the mission list read model to retain company scope and question kind.",
    );
    assert(
      typeof listedMission?.answerSummary === "string" &&
        listedMission.answerSummary.length > 0 &&
        listedMission.freshnessState !== null,
      "Expected the mission list read model to expose answer summary and freshness state.",
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
          mission: {
            id: detail.mission.id,
            status: detail.mission.status,
            sourceKind: detail.mission.sourceKind,
            scoutTaskStatus:
              detail.tasks.find((task) => task.role === "scout")?.status ?? null,
            proofBundleStatus: detail.proofBundle.status,
          },
          missionList: {
            questionKind: listedMission?.questionKind ?? null,
            companyKey: listedMission?.companyKey ?? null,
            freshnessState: listedMission?.freshnessState ?? null,
            answerSummary: listedMission?.answerSummary ?? null,
          },
          discoveryAnswer: {
            answerSummary: discoveryAnswer.answerSummary,
            freshnessPosture: discoveryAnswer.freshnessPosture,
            limitationCount: discoveryAnswer.limitations.length,
            relatedRoutes: discoveryAnswer.relatedRoutes,
            relatedWikiPages: discoveryAnswer.relatedWikiPages,
            evidenceSectionCount: discoveryAnswer.evidenceSections.length,
          },
          proofBundle: {
            answerSummary: detail.proofBundle.answerSummary,
            freshnessState: detail.proofBundle.freshnessState,
            freshnessSummary: detail.proofBundle.freshnessSummary,
            limitationsSummary: detail.proofBundle.limitationsSummary,
            relatedRoutePaths: detail.proofBundle.relatedRoutePaths,
            relatedWikiPageKeys: detail.proofBundle.relatedWikiPageKeys,
          },
          artifacts: {
            discoveryAnswerArtifactId: discoveryAnswerArtifact.id,
            proofBundleArtifactId: proofBundleArtifact.id,
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
    join(tmpdir(), "pocket-cfo-finance-discovery-answer-smoke-"),
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
