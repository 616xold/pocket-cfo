import { createHash } from "node:crypto";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp } from "../apps/control-plane/src/app.ts";
import { createContainer } from "../apps/control-plane/src/bootstrap.ts";
import { closeAllPools } from "../packages/db/src/client.ts";
import { buildRunTag, loadNearestEnvFile } from "./m2-exit-utils.mjs";

const DEFAULT_COMPANY_KEY = "local-cfo-wiki-doc-pages-company";
const DEFAULT_COMPANY_NAME = "Local CFO Wiki Document Pages Company";
const DEFAULT_CREATED_BY = "cfo-wiki-document-pages-smoke";
const MODULE_PATH = fileURLToPath(import.meta.url);

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
      note: "Seed snapshot for the packaged CFO Wiki document-pages smoke.",
      requestedBy: "cfo_wiki_document_pages_smoke",
      runTag: input.runTag,
    },
    null,
    2,
  );
  const uploadText = [
    "account_code,account_name,period_end,debit,credit,currency_code,account_type",
    "1000,Cash,2026-03-31,125000.00,0.00,USD,asset",
    "2000,Accounts Payable,2026-03-31,0.00,42000.00,USD,liability",
    "3000,Retained Earnings,2026-03-31,0.00,83000.00,USD,equity",
  ].join("\n");

  return {
    companyKey: `${input.companyKey}-${input.runTag.toLowerCase()}`,
    companyName: `${input.companyName} ${input.runTag}`,
    createdBy: input.createdBy,
    financeSourceName: `CFO wiki finance seed ${input.runTag}`,
    markdownSourceName: `Board deck ${input.runTag}`,
    pdfSourceName: `Lender packet ${input.runTag}`,
    seed: {
      body: Buffer.from(`${seedText}\n`, "utf8"),
      mediaType: "application/json",
      originalFileName: `cfo-wiki-document-pages-seed-${input.runTag}.json`,
    },
    financeUpload: {
      body: Buffer.from(`${uploadText}\n`, "utf8"),
      mediaType: "text/csv",
      originalFileName: `trial-balance-${input.runTag}.csv`,
    },
    markdownUpload: {
      body: Buffer.from(
        [
          "# April Board Deck",
          "",
          "Revenue grew 20% month over month.",
          "",
          "## Highlights",
          "",
          "- Cash remained above the covenant minimum.",
          "- Collections improved after the April follow-up sprint.",
          "",
          "## Risks",
          "",
          "The renewal calendar still needs manual review.",
          "",
        ].join("\n"),
        "utf8",
      ),
      mediaType: "text/markdown",
      originalFileName: `board-deck-${input.runTag}.md`,
    },
    pdfUpload: {
      body: Buffer.from(
        [
          "%PDF-1.4",
          "% deterministic unsupported smoke fixture",
          "1 0 obj<</Type/Catalog>>endobj",
        ].join("\n"),
        "utf8",
      ),
      mediaType: "application/pdf",
      originalFileName: `lender-packet-${input.runTag}.pdf`,
    },
  };
}

async function main() {
  loadNearestEnvFile();

  const options = parseArgs(process.argv.slice(2).filter((entry) => entry !== "--"));
  const runTag = buildRunTag();
  const fixture = buildFixture({
    ...options,
    runTag,
  });
  const seedSnapshot = await writeSeedSnapshot(fixture.seed);
  const financeCapturedAt = new Date("2026-04-01T12:00:00.000Z").toISOString();
  const markdownCapturedAt = new Date("2026-04-08T12:00:00.000Z").toISOString();
  const pdfCapturedAt = new Date("2026-04-09T12:00:00.000Z").toISOString();
  let app = null;

  try {
    const container = await createContainer();
    app = await buildApp({ container });
    app.log.level = "silent";

    const financeSource = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        createdBy: fixture.createdBy,
        description: "Packaged CFO Wiki document-pages smoke finance source.",
        kind: "dataset",
        name: fixture.financeSourceName,
        snapshot: {
          capturedAt: financeCapturedAt,
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
    const financeSourceId = requireUuid(financeSource?.source?.id, "finance source id");
    const financeUpload = await injectJson(app, {
      expectedStatus: 201,
      headers: {
        "content-type": "application/octet-stream",
      },
      method: "POST",
      payload: fixture.financeUpload.body,
      url: `/sources/${financeSourceId}/files?${new URLSearchParams({
        capturedAt: financeCapturedAt,
        createdBy: fixture.createdBy,
        mediaType: fixture.financeUpload.mediaType,
        originalFileName: fixture.financeUpload.originalFileName,
      }).toString()}`,
    });
    const financeSourceFileId = requireUuid(
      financeUpload?.sourceFile?.id,
      "finance source file id",
    );
    const synced = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        companyName: fixture.companyName,
      },
      url: `/finance-twin/companies/${fixture.companyKey}/source-files/${financeSourceFileId}/sync`,
    });

    const markdownSource = await createDocumentSource(app, {
      capturedAt: markdownCapturedAt,
      createdBy: fixture.createdBy,
      originalFileName: `board-deck-link-${runTag}.txt`,
      sourceName: fixture.markdownSourceName,
      storageRef: `https://example.com/${fixture.companyKey}/board-deck/${runTag}`,
    });
    const markdownUpload = await registerDocumentFile(app, markdownSource.id, {
      body: fixture.markdownUpload.body,
      capturedAt: markdownCapturedAt,
      createdBy: fixture.createdBy,
      mediaType: fixture.markdownUpload.mediaType,
      originalFileName: fixture.markdownUpload.originalFileName,
    });

    const pdfSource = await createDocumentSource(app, {
      capturedAt: pdfCapturedAt,
      createdBy: fixture.createdBy,
      originalFileName: `lender-packet-link-${runTag}.txt`,
      sourceName: fixture.pdfSourceName,
      storageRef: `https://example.com/${fixture.companyKey}/lender-packet/${runTag}`,
    });
    await registerDocumentFile(app, pdfSource.id, {
      body: fixture.pdfUpload.body,
      capturedAt: pdfCapturedAt,
      createdBy: fixture.createdBy,
      mediaType: fixture.pdfUpload.mediaType,
      originalFileName: fixture.pdfUpload.originalFileName,
    });

    const markdownBinding = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        boundBy: fixture.createdBy,
        documentRole: "board_material",
      },
      url: `/cfo-wiki/companies/${fixture.companyKey}/sources/${markdownSource.id}/bind`,
    });
    const pdfBinding = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        boundBy: fixture.createdBy,
        documentRole: "lender_document",
      },
      url: `/cfo-wiki/companies/${fixture.companyKey}/sources/${pdfSource.id}/bind`,
    });
    const compiled = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        triggeredBy: fixture.createdBy,
      },
      url: `/cfo-wiki/companies/${fixture.companyKey}/compile`,
    });
    const companySummary = await injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/cfo-wiki/companies/${fixture.companyKey}`,
    });
    const companySources = await injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/cfo-wiki/companies/${fixture.companyKey}/sources`,
    });
    const markdownCurrentPageKey = `sources/${markdownSource.id}/snapshots/2`;
    const markdownSupersededPageKey = `sources/${markdownSource.id}/snapshots/1`;
    const pdfCurrentPageKey = `sources/${pdfSource.id}/snapshots/2`;
    const markdownCurrentPage = await injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/cfo-wiki/companies/${fixture.companyKey}/pages/${encodeURIComponent(markdownCurrentPageKey)}`,
    });
    const markdownSupersededPage = await injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/cfo-wiki/companies/${fixture.companyKey}/pages/${encodeURIComponent(markdownSupersededPageKey)}`,
    });
    const pdfCurrentPage = await injectJson(app, {
      expectedStatus: 200,
      method: "GET",
      url: `/cfo-wiki/companies/${fixture.companyKey}/pages/${encodeURIComponent(pdfCurrentPageKey)}`,
    });

    assert(
      companySummary.pageCountsByKind.index === 1,
      "Expected the F3A index page to remain present.",
    );
    assert(
      companySummary.pageCountsByKind.source_digest === 4,
      "Expected four source digest pages across current and superseded snapshots.",
    );
    assert(
      compiled.changedPageKeys.includes(markdownCurrentPageKey),
      "Expected the markdown source digest page to be part of the changed page set.",
    );
    assert(
      markdownCurrentPage.page.temporalStatus === "current",
      "Expected the uploaded markdown snapshot to compile as the current page.",
    );
    assert(
      markdownSupersededPage.page.temporalStatus === "superseded",
      "Expected the seed snapshot to remain visible as a superseded page.",
    );
    assert(
      markdownCurrentPage.backlinks.length > 0,
      "Expected the current markdown source digest page to expose backlinks.",
    );
    assert(
      markdownCurrentPage.page.markdownBody.includes("## Heading Outline"),
      "Expected the current markdown source digest page to include a heading outline.",
    );
    assert(
      pdfCurrentPage.page.markdownBody.includes("application/pdf remains unsupported"),
      "Expected the current PDF page to surface the unsupported-document limitation.",
    );
    assert(
      companySources.sourceCount === 2,
      "Expected two bound document sources in the company source list.",
    );
    assert(
      companySources.sources.some(
        (entry) => entry.latestExtract?.extractStatus === "extracted",
      ),
      "Expected the company source list to include an extracted document source.",
    );
    assert(
      companySources.sources.some(
        (entry) => entry.latestExtract?.extractStatus === "unsupported",
      ),
      "Expected the company source list to include an unsupported document source.",
    );

    console.log(
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          company: {
            companyKey: companySummary.companyKey,
            displayName: companySummary.companyDisplayName,
          },
          financeSync: {
            sourceId: financeSourceId,
            sourceFileId: financeSourceFileId,
            syncRunId: synced.syncRun.id,
            status: synced.syncRun.status,
          },
          boundSources: [
            {
              sourceId: markdownSource.id,
              bindingId: markdownBinding.source.binding.id,
              latestExtractStatus:
                markdownBinding.source.latestExtract?.extractStatus ?? null,
              latestSnapshotVersion:
                markdownBinding.source.latestSnapshot?.version ?? null,
            },
            {
              sourceId: pdfSource.id,
              bindingId: pdfBinding.source.binding.id,
              latestExtractStatus: pdfBinding.source.latestExtract?.extractStatus ?? null,
              latestSnapshotVersion: pdfBinding.source.latestSnapshot?.version ?? null,
            },
          ],
          compileRun: {
            id: compiled.compileRun.id,
            status: compiled.compileRun.status,
            changedPageKeys: compiled.changedPageKeys,
          },
          companySummary: {
            pageCount: companySummary.pageCount,
            pageCountsByKind: companySummary.pageCountsByKind,
            freshnessSummary: companySummary.freshnessSummary,
            limitations: companySummary.limitations,
          },
          companySources: {
            sourceCount: companySources.sourceCount,
            sources: companySources.sources.map((entry) => ({
              sourceId: entry.source.id,
              latestSnapshotVersion: entry.latestSnapshot?.version ?? null,
              latestExtractStatus: entry.latestExtract?.extractStatus ?? null,
              latestDocumentKind: entry.latestExtract?.documentKind ?? null,
              limitations: entry.limitations,
            })),
          },
          pages: {
            markdownCurrent: summarizePage(markdownCurrentPage),
            markdownSuperseded: summarizePage(markdownSupersededPage),
            pdfCurrent: summarizePage(pdfCurrentPage),
          },
          uploadedFiles: {
            markdownSourceFileId: markdownUpload.sourceFile.id,
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

async function createDocumentSource(app, input) {
  const seedBody = Buffer.from(
    `document smoke seed for ${input.sourceName}\n`,
    "utf8",
  );

  return injectJson(app, {
    expectedStatus: 201,
    method: "POST",
    payload: {
      createdBy: input.createdBy,
      description: `Packaged CFO Wiki document source for ${input.sourceName}.`,
      kind: "document",
      name: input.sourceName,
      snapshot: {
        capturedAt: input.capturedAt,
        checksumSha256: createHash("sha256").update(seedBody).digest("hex"),
        mediaType: "text/plain",
        originalFileName: input.originalFileName,
        sizeBytes: seedBody.byteLength,
        storageKind: "external_url",
        storageRef: input.storageRef,
      },
    },
    url: "/sources",
  }).then((response) => ({
    id: requireUuid(response?.source?.id, "document source id"),
    source: response.source,
  }));
}

async function registerDocumentFile(app, sourceId, input) {
  return injectJson(app, {
    expectedStatus: 201,
    headers: {
      "content-type": "application/octet-stream",
    },
    method: "POST",
    payload: input.body,
    url: `/sources/${sourceId}/files?${new URLSearchParams({
      capturedAt: input.capturedAt,
      createdBy: input.createdBy,
      mediaType: input.mediaType,
      originalFileName: input.originalFileName,
    }).toString()}`,
  });
}

function summarizePage(pageView) {
  return {
    pageKey: pageView.page.pageKey,
    temporalStatus: pageView.page.temporalStatus,
    refCount: pageView.refs.length,
    linkCount: pageView.links.length,
    backlinkCount: pageView.backlinks.length,
    freshnessSummary: pageView.freshnessSummary,
    limitations: pageView.limitations,
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function writeSeedSnapshot(seed) {
  const directory = await mkdtemp(
    join(tmpdir(), "pocket-cfo-wiki-doc-pages-smoke-"),
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

function requireUuid(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} missing from response`);
  }

  return value;
}

if (process.argv[1] && resolve(process.argv[1]) === MODULE_PATH) {
  await main();
}
