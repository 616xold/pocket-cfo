import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import {
  FINANCE_DISCOVERY_QUESTION_KINDS,
  MonitorKindSchema,
} from "@pocket-cto/domain";
import { buildApp } from "../apps/control-plane/src/app.ts";
import { createContainer } from "../apps/control-plane/src/bootstrap.ts";
import { loadEnv } from "../packages/config/src/index.ts";
import { closeAllPools, getPool } from "../packages/db/src/client.ts";
import { pocketCfoBoardLenderDocumentSourcePack } from "../packages/stack-packs/src/index.ts";
import { loadNearestEnvFile } from "./m2-exit-utils.mjs";

const CREATED_BY = "board-lender-document-source-pack-proof";
const COMPANY_NAME = "Demo Board/Lender Document Source Pack";
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
const VOLATILE_EXPECTED_POSTURE_KEYS = new Set([
  "id",
  "generatedId",
  "sourceId",
  "sourceIds",
  "sourceFileId",
  "sourceFileIds",
  "sourceSnapshotId",
  "sourceSnapshotIds",
  "snapshotId",
  "snapshotIds",
  "compileRunId",
  "compileRunIds",
  "storageRef",
  "storageRefs",
  "rawObjectStoreRef",
  "rawObjectStoreRefs",
  "createdAt",
  "updatedAt",
  "capturedAt",
  "recordedAt",
  "startedAt",
  "completedAt",
  "generatedAt",
  "timestamp",
  "timestamps",
]);
const FORBIDDEN_MANIFEST_TARGETS = [
  "expectedExtractorKeys",
  "monitorFamiliesCovered",
  "discoveryFamiliesCovered",
  "providerTargets",
  "deliveryTargets",
  "reportTargets",
  "approvalTargets",
  "certificationTargets",
  "runtimeCodexTargets",
  "actionTargets",
];

async function main() {
  loadNearestEnvFile();

  const fixture = await loadFixture();
  const pool = getPool(loadEnv().DATABASE_URL);
  let app = null;

  try {
    assertManifestBoundary(fixture.expected, fixture.sourceFiles);
    const familyBoundary = assertFamiliesUnchanged();
    const sourceHashesBefore = hashLoadedFiles(fixture.files);

    await ensureCompany(pool, fixture.expected.companyKey, COMPANY_NAME);

    const before = await readBoundaryCounts(pool);
    const capturedAt = new Date().toISOString();
    const container = await createContainer();
    app = await buildApp({ container });
    app.log.level = "silent";

    const registered = await registerSources(app, fixture, capturedAt);
    const bindings = await bindSources(app, fixture, registered);
    const compiled = await compileWiki(app, fixture.expected.companyKey);
    const wikiReads = await readWikiPosture(app, fixture, registered);
    const after = await readBoundaryCounts(pool);
    const runtimeActionBoundary = assertRuntimeActionBoundary(before, after);
    const actual = normalizePosture({
      bindings,
      compiled,
      expected: fixture.expected,
      familyBoundary,
      registered,
      runtimeActionBoundary,
      sourceFiles: fixture.sourceFiles,
      wikiReads,
    });

    assertJsonEqual(
      "normalized board/lender source/wiki posture",
      actual,
      fixture.expected,
    );

    const rawFixtureSourcesUnchanged = await assertFixtureSourcesUnchanged(
      fixture.files,
      sourceHashesBefore,
    );

    console.log(
      JSON.stringify({
        sourcePackId: pocketCfoBoardLenderDocumentSourcePack.id,
        companyKey: fixture.expected.companyKey,
        sourceRolesVerified: true,
        documentRolesVerified: true,
        mediaTypesVerified: true,
        expectedDocumentKindsVerified: true,
        expectedPostureVerified: true,
        rawFixtureSourcesUnchanged,
        sourceRegistrationVerified: true,
        cfoWikiBindingVerified: true,
        cfoWikiCompileVerified: true,
        sourceListVerified: true,
        sourceDigestVerified: true,
        sourceCoverageVerified: true,
        indexLogVerified: true,
        limitationsVerified: true,
        newMonitorFamilyAdded: false,
        newDiscoveryFamilyAdded: false,
        monitorRunTriggered: false,
        monitorResultCreated: false,
        missionCreated: false,
        reportCreated: false,
        boardPacketCreated: false,
        lenderUpdateCreated: false,
        reportReleaseCreated: false,
        reportCirculationCreated: false,
        approvalCreated: false,
        certificationCreated: false,
        deliveryCreated: false,
        providerCallCreated: false,
        runtimeCodexUsed: false,
        generatedProseCreated: false,
        sourceMutationOutsideProofSetupCreated: false,
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
    pocketCfoBoardLenderDocumentSourcePack.fixtureDirectory,
  );
  const sourceFiles = normalizeManifestSourceFiles();
  const expected = JSON.parse(
    await readFile(
      resolve(
        pocketCfoBoardLenderDocumentSourcePack.expectedNormalizedPosturePath,
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

    files.set(sourceFile.path, {
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
    "source-pack source files",
    sourceFiles,
    normalizeExpectedSourceFiles(expected.sourceFiles),
  );
  assertJsonEqual(
    "source-pack roles",
    pocketCfoBoardLenderDocumentSourcePack.sourceRoles,
    expected.sourceRolesPresent,
  );
  assertJsonEqual(
    "document roles",
    pocketCfoBoardLenderDocumentSourcePack.documentRoles,
    expected.documentRolesPresent,
  );
  assertJsonEqual(
    "source kinds",
    pocketCfoBoardLenderDocumentSourcePack.sourceKinds,
    expected.sourceKindsPresent,
  );
  assertJsonEqual(
    "media types",
    pocketCfoBoardLenderDocumentSourcePack.mediaTypes,
    expected.mediaTypesPresent,
  );
  assertJsonEqual(
    "expected document kinds",
    pocketCfoBoardLenderDocumentSourcePack.expectedDocumentKinds,
    expected.expectedDocumentKinds,
  );

  if (
    !sameSet(pocketCfoBoardLenderDocumentSourcePack.sourceRoles, [
      "board_material",
      "lender_document",
    ])
  ) {
    throw new Error(
      "F6Y source pack must be limited to board_material and lender_document",
    );
  }

  if (
    !pocketCfoBoardLenderDocumentSourcePack.sourceFiles.every(
      (sourceFile) =>
        sourceFile.sourceKind === "document" &&
        (sourceFile.documentRole === "board_material" ||
          sourceFile.documentRole === "lender_document") &&
        sourceFile.documentRole === sourceFile.role &&
        (sourceFile.mediaType === "text/markdown" ||
          sourceFile.mediaType === "text/plain") &&
        (sourceFile.expectedDocumentKind === "markdown_text" ||
          sourceFile.expectedDocumentKind === "plain_text") &&
        !Object.hasOwn(sourceFile, "expectedExtractorKey"),
    )
  ) {
    throw new Error(
      "F6Y source files must be markdown/plain-text board/lender documents without extractor keys",
    );
  }

  const volatileKeys = findVolatileKeys(expected);

  if (volatileKeys.length > 0) {
    throw new Error(
      `Expected posture contains volatile generated fields: ${volatileKeys.join(
        ", ",
      )}`,
    );
  }

  for (const forbidden of FORBIDDEN_MANIFEST_TARGETS) {
    if (
      Object.hasOwn(pocketCfoBoardLenderDocumentSourcePack, forbidden) ||
      Object.hasOwn(expected, forbidden)
    ) {
      throw new Error(`Source pack must not declare ${forbidden}`);
    }
  }
}

async function ensureCompany(pool, companyKey, displayName) {
  await pool.query(
    `
      insert into finance_companies (company_key, display_name)
      values ($1, $2)
      on conflict (company_key)
      do update set display_name = excluded.display_name, updated_at = now()
    `,
    [companyKey, displayName],
  );
}

async function registerSources(app, fixture, capturedAt) {
  const registered = {};

  for (const sourceFile of fixture.sourceFiles) {
    const file = fixture.files.get(sourceFile.path);

    if (!file) {
      throw new Error(`Missing fixture file for ${sourceFile.path}`);
    }

    const created = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        createdBy: CREATED_BY,
        description: `F6Y board/lender document source-pack source for ${sourceFile.path}.`,
        kind: sourceFile.sourceKind,
        name: `F6Y ${basename(sourceFile.path)} ${fixture.expected.companyKey}`,
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
    const sourceId = requireString(created?.source?.id, "source id");
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

    registered[sourceFile.path] = { created, descriptor: sourceFile, uploaded };
  }

  return registered;
}

async function bindSources(app, fixture, registered) {
  const bindings = {};

  for (const sourceFile of fixture.sourceFiles) {
    const sourceId = requireString(
      registered[sourceFile.path]?.created?.source?.id,
      `${sourceFile.path} source id`,
    );
    const bound = await injectJson(app, {
      expectedStatus: 201,
      method: "POST",
      payload: {
        boundBy: CREATED_BY,
        documentRole: sourceFile.documentRole,
        includeInCompile: true,
      },
      url: `/cfo-wiki/companies/${fixture.expected.companyKey}/sources/${sourceId}/bind`,
    });

    bindings[sourceFile.path] = bound;
  }

  return bindings;
}

async function compileWiki(app, companyKey) {
  return injectJson(app, {
    expectedStatus: 201,
    method: "POST",
    payload: { triggeredBy: CREATED_BY },
    url: `/cfo-wiki/companies/${companyKey}/compile`,
  });
}

async function readWikiPosture(app, fixture, registered) {
  const companyKey = fixture.expected.companyKey;
  const companySummary = await injectJson(app, {
    expectedStatus: 200,
    method: "GET",
    url: `/cfo-wiki/companies/${companyKey}`,
  });
  const sourceList = await injectJson(app, {
    expectedStatus: 200,
    method: "GET",
    url: `/cfo-wiki/companies/${companyKey}/sources`,
  });
  const indexPage = await injectJson(app, {
    expectedStatus: 200,
    method: "GET",
    url: `/cfo-wiki/companies/${companyKey}/index`,
  });
  const logPage = await injectJson(app, {
    expectedStatus: 200,
    method: "GET",
    url: `/cfo-wiki/companies/${companyKey}/log`,
  });
  const sourceCoveragePage = await readWikiPage(
    app,
    companyKey,
    "sources/coverage",
  );
  const sourceDigestPages = {};

  for (const sourceFile of fixture.sourceFiles) {
    const sourceId = requireString(
      registered[sourceFile.path]?.created?.source?.id,
      `${sourceFile.path} source id`,
    );
    const sourceSummary = sourceList.sources.find(
      (entry) => entry.source.id === sourceId,
    );
    const latestVersion = sourceSummary?.latestSnapshot?.version;

    if (typeof latestVersion !== "number") {
      throw new Error(`Latest snapshot version missing for ${sourceFile.path}`);
    }

    sourceDigestPages[sourceFile.path] = await readWikiPage(
      app,
      companyKey,
      `sources/${sourceId}/snapshots/${latestVersion}`,
    );
  }

  return {
    companySummary,
    indexPage,
    logPage,
    sourceCoveragePage,
    sourceDigestPages,
    sourceList,
  };
}

async function readWikiPage(app, companyKey, pageKey) {
  return injectJson(app, {
    expectedStatus: 200,
    method: "GET",
    url: `/cfo-wiki/companies/${companyKey}/pages/${encodeURIComponent(
      pageKey,
    )}`,
  });
}

function normalizePosture(input) {
  return {
    sourcePackId: pocketCfoBoardLenderDocumentSourcePack.id,
    companyKey: input.expected.companyKey,
    sourceFiles: input.sourceFiles,
    sourceRolesPresent: pocketCfoBoardLenderDocumentSourcePack.sourceRoles,
    documentRolesPresent: pocketCfoBoardLenderDocumentSourcePack.documentRoles,
    sourceKindsPresent: pocketCfoBoardLenderDocumentSourcePack.sourceKinds,
    mediaTypesPresent: pocketCfoBoardLenderDocumentSourcePack.mediaTypes,
    expectedDocumentKinds:
      pocketCfoBoardLenderDocumentSourcePack.expectedDocumentKinds,
    sourceRegistrationPosture: normalizeSourceRegistrationPosture(input),
    sourceFilePosture: input.sourceFiles.map((sourceFile) =>
      normalizeSourceFilePosture(input, sourceFile),
    ),
    cfoWikiBindingPosture: normalizeBindingPosture(input),
    deterministicExtractPosture: input.sourceFiles.map((sourceFile) =>
      normalizeExtractPosture(input, sourceFile),
    ),
    sourceListPosture: {
      sourceCount: currentSourceSummaries(input).length,
      allSourcesIncludedInCompile: currentSourceSummaries(input).every(
        (entry) => entry.binding.includeInCompile === true,
      ),
      allSourcesBoundAsBoardOrLenderDocument: currentSourceSummaries(
        input,
      ).every(
        (entry) =>
          entry.binding.documentRole === "board_material" ||
          entry.binding.documentRole === "lender_document",
      ),
      listLimitationsPresent: input.wikiReads.sourceList.limitations.length > 0,
    },
    sourceDigestPosture: input.sourceFiles.map((sourceFile) =>
      normalizeSourceDigestPosture(input, sourceFile),
    ),
    sourceCoveragePosture: normalizeSourceCoveragePosture(input),
    indexLogPosture: normalizeIndexLogPosture(input),
    companySummaryPosture: normalizeCompanySummaryPosture(input),
    freshnessSourceBackedStateByRole:
      normalizeFreshnessSourceBackedStateByRole(input),
    lineagePresenceBySource: input.sourceFiles.map((sourceFile) =>
      normalizeLineagePresence(input, sourceFile),
    ),
    limitationPresenceBySource: input.sourceFiles.map((sourceFile) =>
      normalizeLimitationPresence(input, sourceFile),
    ),
    familyBoundary: {
      ...input.familyBoundary,
      monitorFamilies: MonitorKindSchema.options,
      discoveryFamilies: FINANCE_DISCOVERY_QUESTION_KINDS,
    },
    runtimeActionBoundary: input.runtimeActionBoundary,
    limitations: pocketCfoBoardLenderDocumentSourcePack.limitations.map(
      normalizePackLimitation,
    ),
  };
}

function normalizeSourceRegistrationPosture(input) {
  return {
    registeredSourceCount: Object.keys(input.registered).length,
    uploadedSourceFileCount: Object.values(input.registered).filter((entry) =>
      Boolean(entry.uploaded?.sourceFile?.id),
    ).length,
    sourceSnapshotCountPerSource: assertUniformSnapshotCount(input),
    sourceFileChecksumPresent: Object.values(input.registered).every(
      (entry) => typeof entry.uploaded?.sourceFile?.checksumSha256 === "string",
    ),
    rawObjectStoreWriteExpected: Object.values(input.registered).every(
      (entry) => entry.uploaded?.sourceFile?.storageKind === "object_store",
    ),
    rawFixtureFilesRewritten: false,
  };
}

function assertUniformSnapshotCount(input) {
  const counts = Object.values(input.registered).map((entry) => {
    const createdCount = entry.created?.snapshots?.length ?? 0;
    const uploadSnapshotPresent = entry.uploaded?.snapshot?.id ? 1 : 0;

    return createdCount + uploadSnapshotPresent;
  });
  const uniqueCounts = [...new Set(counts)];

  if (uniqueCounts.length !== 1) {
    throw new Error(`Expected uniform snapshot count, received ${counts}`);
  }

  return uniqueCounts[0] ?? 0;
}

function normalizeSourceFilePosture(input, sourceFile) {
  const registered = input.registered[sourceFile.path];
  const sourceSummary = sourceSummaryFor(input, sourceFile);

  return {
    path: sourceFile.path,
    sourceKind: sourceFile.sourceKind,
    mediaType: sourceFile.mediaType,
    documentRole: sourceFile.documentRole,
    expectedDocumentKind: sourceFile.expectedDocumentKind,
    sourceRegistered: Boolean(registered.created?.source?.id),
    sourceFileUploaded: Boolean(registered.uploaded?.sourceFile?.id),
    latestSnapshotPresent: Boolean(sourceSummary.latestSnapshot?.id),
    latestSourceFilePresent: Boolean(sourceSummary.latestSourceFile?.id),
    latestExtractPresent: Boolean(sourceSummary.latestExtract?.id),
    lineagePresent: Boolean(
      registered.created?.source?.id &&
      registered.uploaded?.sourceFile?.id &&
      sourceSummary.binding?.id,
    ),
    sourceLimitationsPresent: sourceSummary.limitations.length > 0,
  };
}

function normalizeBindingPosture(input) {
  return {
    boundSourceCount: Object.keys(input.bindings).length,
    includedInCompileCount: Object.values(input.bindings).filter(
      (bindingView) => bindingView.source.binding.includeInCompile === true,
    ).length,
    boardMaterialBindingCount: Object.values(input.bindings).filter(
      (bindingView) =>
        bindingView.source.binding.documentRole === "board_material",
    ).length,
    lenderDocumentBindingCount: Object.values(input.bindings).filter(
      (bindingView) =>
        bindingView.source.binding.documentRole === "lender_document",
    ).length,
    bindingLimitationsPresent:
      input.wikiReads.sourceList.limitations.length > 0,
  };
}

function normalizeExtractPosture(input, sourceFile) {
  const extract = requireExtract(input, sourceFile);

  return {
    path: sourceFile.path,
    extractStatus: extract.extractStatus,
    documentKind: extract.documentKind,
    title: extract.title,
    headingCount: extract.headingOutline.length,
    excerptBlockCount: extract.excerptBlocks.length,
    renderedMarkdownPresent:
      typeof extract.renderedMarkdown === "string" &&
      extract.renderedMarkdown.length > 0,
    warningsPresent: extract.warnings.length > 0,
  };
}

function normalizeSourceDigestPosture(input, sourceFile) {
  const page = input.wikiReads.sourceDigestPages[sourceFile.path];

  return {
    path: sourceFile.path,
    latestDigestPresent: Boolean(page.page?.pageKey),
    pageKind: page.page.pageKind,
    freshnessState: page.freshnessSummary.state,
    extractStatusVisible: page.page.markdownBody.includes(
      "Extraction support status: `extracted`",
    ),
    documentKindVisible: page.page.markdownBody.includes(
      `Document kind: \`${sourceFile.expectedDocumentKind}\``,
    ),
    documentRoleVisible: page.page.markdownBody.includes(
      `Document role: \`${sourceFile.documentRole}\``,
    ),
    limitationsPresent: page.limitations.length > 0,
  };
}

function normalizeSourceCoveragePosture(input) {
  const page = input.wikiReads.sourceCoveragePage;
  const body = page.page.markdownBody;

  return {
    pagePresent: Boolean(page.page?.pageKey),
    pageKey: "sources/coverage",
    pageKind: page.page.pageKind,
    freshnessState: page.freshnessSummary.state,
    boundDocumentSourcesVisible: body.includes("## Bound Document Sources"),
    boardMaterialVisible: body.includes("role board_material"),
    lenderDocumentVisible: body.includes("role lender_document"),
    limitationsPresent: page.limitations.length > 0,
  };
}

function normalizeIndexLogPosture(input) {
  const sourceDigestPageKeys = input.sourceFiles.map(
    (sourceFile) =>
      input.wikiReads.sourceDigestPages[sourceFile.path].page.pageKey,
  );

  return {
    indexPagePresent: Boolean(input.wikiReads.indexPage.page?.pageKey),
    indexPageKey: "index",
    indexLinksToSourceCoverage: input.wikiReads.indexPage.links.some(
      (link) => link.toPageKey === "sources/coverage",
    ),
    sourceCoverageLinksToCurrentSourceDigests: sourceDigestPageKeys.every(
      (pageKey) =>
        input.wikiReads.sourceCoveragePage.links.some(
          (link) => link.toPageKey === pageKey,
        ),
    ),
    logPagePresent: Boolean(input.wikiReads.logPage.page?.pageKey),
    logPageKey: "log",
    logCompileRunVisible:
      input.wikiReads.logPage.page.markdownBody.includes(
        `by ${CREATED_BY}; pages`,
      ) && input.wikiReads.logPage.page.markdownBody.includes("`succeeded`"),
    limitationsPresent:
      input.wikiReads.indexPage.limitations.length > 0 &&
      input.wikiReads.logPage.limitations.length > 0,
  };
}

function normalizeCompanySummaryPosture(input) {
  const minimum = input.expected.companySummaryPosture.pageCountMinimum;
  const policyPageCount = input.expected.companySummaryPosture.policyPageCount;
  const sourceDigestPageMinimum =
    input.expected.companySummaryPosture.sourceDigestPageCountMinimum;

  if (input.wikiReads.companySummary.pageCount < minimum) {
    throw new Error(
      `Expected at least ${minimum} wiki pages, received ${input.wikiReads.companySummary.pageCount}`,
    );
  }

  if (
    input.wikiReads.companySummary.pageCountsByKind.policy !== policyPageCount
  ) {
    throw new Error(
      `Expected exactly ${policyPageCount} policy pages, received ${input.wikiReads.companySummary.pageCountsByKind.policy}`,
    );
  }

  if (
    input.wikiReads.companySummary.pageCountsByKind.source_digest <
    sourceDigestPageMinimum
  ) {
    throw new Error(
      `Expected at least ${sourceDigestPageMinimum} source digest pages, received ${input.wikiReads.companySummary.pageCountsByKind.source_digest}`,
    );
  }

  return {
    latestSuccessfulCompilePresent: Boolean(
      input.wikiReads.companySummary.latestSuccessfulCompileRun?.id,
    ),
    pageCountMinimum: minimum,
    policyPageCount,
    sourceDigestPageCountMinimum: sourceDigestPageMinimum,
    limitationsPresent: input.wikiReads.companySummary.limitations.length > 0,
  };
}

function normalizeFreshnessSourceBackedStateByRole(input) {
  const grouped = {};

  for (const sourceFile of input.sourceFiles) {
    const page = input.wikiReads.sourceDigestPages[sourceFile.path];
    const current = grouped[sourceFile.documentRole] ?? {
      freshnessStates: [],
      sourceCount: 0,
    };

    current.freshnessStates.push(page.freshnessSummary.state);
    current.sourceCount += 1;
    grouped[sourceFile.documentRole] = current;
  }

  return Object.fromEntries(
    Object.entries(grouped).map(([role, value]) => [
      role,
      {
        freshnessState: mergeFreshnessStates(value.freshnessStates),
        sourceBackedState: "source_backed",
        sourceCount: value.sourceCount,
      },
    ]),
  );
}

function normalizeLineagePresence(input, sourceFile) {
  const sourceSummary = sourceSummaryFor(input, sourceFile);
  const sourceDigestPage = input.wikiReads.sourceDigestPages[sourceFile.path];

  return {
    path: sourceFile.path,
    sourceRegistrationLineagePresent: Boolean(
      input.registered[sourceFile.path]?.created?.source?.id,
    ),
    sourceFileLineagePresent: Boolean(sourceSummary.latestSourceFile?.id),
    cfoWikiBindingLineagePresent: Boolean(sourceSummary.binding?.id),
    sourceDigestLineagePresent:
      sourceDigestPage.refs.some(
        (ref) => ref.targetKind === "source_snapshot",
      ) &&
      sourceDigestPage.refs.some((ref) => ref.targetKind === "source_file"),
    sourceCoverageLineagePresent:
      input.wikiReads.sourceCoveragePage.page.pageKey === "sources/coverage",
    indexLogLineagePresent:
      input.wikiReads.indexPage.page.pageKey === "index" &&
      input.wikiReads.logPage.page.pageKey === "log",
  };
}

function normalizeLimitationPresence(input, sourceFile) {
  const sourceSummary = sourceSummaryFor(input, sourceFile);

  return {
    path: sourceFile.path,
    sourceLimitationsPresent: sourceSummary.limitations.length > 0,
    sourceDigestLimitationsPresent:
      input.wikiReads.sourceDigestPages[sourceFile.path].limitations.length > 0,
    sourceCoverageLimitationsPresent:
      input.wikiReads.sourceCoveragePage.limitations.length > 0,
    indexLogLimitationsPresent:
      input.wikiReads.indexPage.limitations.length > 0 &&
      input.wikiReads.logPage.limitations.length > 0,
  };
}

function sourceSummaryFor(input, sourceFile) {
  const sourceId = requireString(
    input.registered[sourceFile.path]?.created?.source?.id,
    `${sourceFile.path} source id`,
  );
  const sourceSummary = input.wikiReads.sourceList.sources.find(
    (entry) => entry.source.id === sourceId,
  );

  if (!sourceSummary) {
    throw new Error(`Missing source-list summary for ${sourceFile.path}`);
  }

  return sourceSummary;
}

function currentSourceSummaries(input) {
  const sourceIds = new Set(
    Object.values(input.registered).map((entry) =>
      requireString(entry.created?.source?.id, "source id"),
    ),
  );

  return input.wikiReads.sourceList.sources.filter((entry) =>
    sourceIds.has(entry.source.id),
  );
}

function requireExtract(input, sourceFile) {
  const extract = sourceSummaryFor(input, sourceFile).latestExtract;

  if (!extract) {
    throw new Error(`Missing deterministic extract for ${sourceFile.path}`);
  }

  return extract;
}

function normalizePackLimitation(limitation) {
  return limitation
    .replace("markdown and plain-text", "text/markdown and text/plain")
    .replace(/`/gu, "");
}

function assertRuntimeActionBoundary(before, after) {
  const comparisons = [
    ["monitorResults", "monitorResultCreated"],
    ["missions", "missionCreated"],
    ["reportArtifacts", "reportCreated"],
    ["boardPacketArtifacts", "boardPacketCreated"],
    ["lenderUpdateArtifacts", "lenderUpdateCreated"],
    ["reportReleaseApprovals", "reportReleaseCreated"],
    ["reportCirculationApprovals", "reportCirculationCreated"],
    ["approvals", "approvalCreated"],
    ["outboxEvents", "deliveryCreated"],
    ["outboxEvents", "outboxSendCreated"],
    ["providerCalls", "providerCallCreated"],
    ["providerCredentials", "providerCredentialCreated"],
    ["providerJobs", "providerJobCreated"],
    ["taskRuntimeThreads", "runtimeCodexUsed"],
    ["generatedProse", "generatedProseCreated"],
    ["generatedNotificationProse", "generatedNotificationProseCreated"],
    ["paymentInstructions", "paymentInstructionCreated"],
    ["accountingWrites", "accountingWriteCreated"],
    ["bankWrites", "bankWriteCreated"],
    ["taxFilings", "taxFilingCreated"],
    ["legalAdvice", "legalAdviceGenerated"],
    ["policyAdvice", "policyAdviceGenerated"],
    ["boardAdvice", "boardAdviceGenerated"],
    ["lenderAdvice", "lenderAdviceGenerated"],
    ["collectionInstructions", "collectionInstructionCreated"],
    ["customerContactInstructions", "customerContactInstructionCreated"],
    ["certifications", "certificationCreated"],
    ["certifiedStatuses", "certifiedStatusCreated"],
    ["closeCompleteRecords", "closeCompleteCreated"],
    ["signOffs", "signOffCreated"],
    ["attestations", "attestationCreated"],
    ["legalOpinions", "legalOpinionCreated"],
    ["auditOpinions", "auditOpinionCreated"],
    ["assuranceRecords", "assuranceCreated"],
    ["autonomousActions", "autonomousActionCreated"],
  ];
  const boundary = {
    monitorRunTriggered: false,
    monitorResultCreated: false,
    checklistReadTriggered: false,
    operatorReadinessReadTriggered: false,
    acknowledgementReadTriggered: false,
    deliveryReadinessReadTriggered: false,
    reviewSummaryReadTriggered: false,
    providerBoundaryReadTriggered: false,
    certificationBoundaryReadTriggered: false,
    humanConfirmationBoundaryReadTriggered: false,
    certificationSafetyReadTriggered: false,
  };

  for (const [countKey, boundaryKey] of comparisons) {
    if (after[countKey] !== before[countKey]) {
      throw new Error(`${boundaryKey} changed ${countKey}`);
    }

    boundary[boundaryKey] = false;
  }

  boundary.sourceMutationOutsideProofSetupCreated = false;

  return boundary;
}

async function readBoundaryCounts(pool) {
  const [
    accountingWrites,
    approvals,
    assuranceRecords,
    attestations,
    auditOpinions,
    autonomousActions,
    bankWrites,
    boardAdvice,
    boardPacketArtifacts,
    certifications,
    certifiedStatuses,
    closeCompleteRecords,
    collectionInstructions,
    customerContactInstructions,
    generatedNotificationProse,
    generatedProse,
    legalAdvice,
    legalOpinions,
    lenderAdvice,
    lenderUpdateArtifacts,
    missions,
    monitorResults,
    outboxEvents,
    paymentInstructions,
    policyAdvice,
    providerCalls,
    providerCredentials,
    providerJobs,
    reportArtifacts,
    reportCirculationApprovals,
    reportReleaseApprovals,
    signOffs,
    taxFilings,
    taskRuntimeThreads,
  ] = await Promise.all([
    readOptionalCount(pool, "accounting_writes"),
    readScalar(pool, "select count(*)::int as count from approvals", []),
    readOptionalCount(pool, "assurance_records"),
    readOptionalCount(pool, "attestations"),
    readOptionalCount(pool, "audit_opinions"),
    readOptionalCount(pool, "autonomous_actions"),
    readOptionalCount(pool, "bank_writes"),
    readOptionalCount(pool, "board_advice"),
    readArtifactKindsCount(pool, ["board_packet"]),
    readOptionalCount(pool, "certifications"),
    readOptionalCount(pool, "certified_statuses"),
    readOptionalCount(pool, "close_complete_records"),
    readOptionalCount(pool, "collection_instructions"),
    readOptionalCount(pool, "customer_contact_instructions"),
    readOptionalCount(pool, "generated_notification_prose"),
    readOptionalCount(pool, "generated_prose"),
    readOptionalCount(pool, "legal_advice"),
    readOptionalCount(pool, "legal_opinions"),
    readOptionalCount(pool, "lender_advice"),
    readArtifactKindsCount(pool, ["lender_update"]),
    readScalar(pool, "select count(*)::int as count from missions", []),
    readScalar(pool, "select count(*)::int as count from monitor_results", []),
    readScalar(pool, "select count(*)::int as count from outbox_events", []),
    readOptionalCount(pool, "payment_instructions"),
    readOptionalCount(pool, "policy_advice"),
    readOptionalCount(pool, "provider_calls"),
    readOptionalCount(pool, "provider_credentials"),
    readOptionalCount(pool, "provider_jobs"),
    readArtifactKindsCount(pool, REPORT_ARTIFACT_KINDS),
    readApprovalKindCount(pool, "report_circulation"),
    readApprovalKindCount(pool, "report_release"),
    readOptionalCount(pool, "sign_offs"),
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
    assuranceRecords,
    attestations,
    auditOpinions,
    autonomousActions,
    bankWrites,
    boardAdvice,
    boardPacketArtifacts,
    certifications,
    certifiedStatuses,
    closeCompleteRecords,
    collectionInstructions,
    customerContactInstructions,
    generatedNotificationProse,
    generatedProse,
    legalAdvice,
    legalOpinions,
    lenderAdvice,
    lenderUpdateArtifacts,
    missions,
    monitorResults,
    outboxEvents,
    paymentInstructions,
    policyAdvice,
    providerCalls,
    providerCredentials,
    providerJobs,
    reportArtifacts,
    reportCirculationApprovals,
    reportReleaseApprovals,
    signOffs,
    taxFilings,
    taskRuntimeThreads,
  };
}

async function readArtifactKindsCount(pool, artifactKinds) {
  const result = await pool.query(
    "select count(*)::int as count from artifacts where kind = any($1::artifact_kind[])",
    [artifactKinds],
  );

  return Number(result.rows[0]?.count ?? 0);
}

async function readApprovalKindCount(pool, approvalKind) {
  const result = await pool.query(
    "select count(*)::int as count from approvals where kind = $1::approval_kind",
    [approvalKind],
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

function normalizeManifestSourceFiles() {
  return pocketCfoBoardLenderDocumentSourcePack.sourceFiles.map(
    (sourceFile) => ({
      role: sourceFile.role,
      path: sourceFile.fixturePath,
      sourceKind: sourceFile.sourceKind,
      mediaType: sourceFile.mediaType,
      documentRole: sourceFile.documentRole,
      expectedDocumentKind: sourceFile.expectedDocumentKind,
    }),
  );
}

function normalizeExpectedSourceFiles(sourceFiles) {
  return sourceFiles.map((sourceFile) => ({
    role: sourceFile.role,
    path: sourceFile.path,
    sourceKind: sourceFile.sourceKind,
    mediaType: sourceFile.mediaType,
    documentRole: sourceFile.documentRole,
    expectedDocumentKind: sourceFile.expectedDocumentKind,
  }));
}

function hashLoadedFiles(files) {
  return Object.fromEntries(
    Array.from(files.entries()).map(([path, file]) => [
      path,
      file.checksumSha256,
    ]),
  );
}

async function assertFixtureSourcesUnchanged(files, expectedHashes) {
  for (const [path, file] of files.entries()) {
    const currentHash = createHash("sha256")
      .update(await readFile(file.absolutePath))
      .digest("hex");

    if (currentHash !== expectedHashes[path]) {
      throw new Error(`Fixture source changed during proof: ${path}`);
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

function mergeFreshnessStates(states) {
  const unique = [...new Set(states)];

  return unique.length === 1 ? unique[0] : "mixed";
}

function sameSet(left, right) {
  return (
    left.length === right.length &&
    left.every((entry) => right.includes(entry)) &&
    right.every((entry) => left.includes(entry))
  );
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

  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

await main();
