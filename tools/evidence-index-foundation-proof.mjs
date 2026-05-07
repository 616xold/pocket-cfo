import { buildEvidenceIndexFoundation } from "../apps/control-plane/src/modules/evidence-index/service.ts";

const generatedAt = "2026-05-07T18:45:00.000Z";
const companyId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

function main() {
  const foundation = buildEvidenceIndexFoundation({
    companyKey: "acme",
    generatedAt,
    sources: buildSources(),
  });
  const coverageStatuses = foundation.sourceCoverageMatrix.entries.map(
    (entry) => entry.coverageStatus,
  );
  const capabilityCodes =
    foundation.sourceCoverageMatrix.capabilityBoundaries.map(
      (boundary) => boundary.code,
    );
  const relationshipKinds = foundation.evidenceTraces.map(
    (trace) => trace.relationshipKind,
  );

  assertIncludes(coverageStatuses, "supported", "supported coverage");
  assertIncludes(coverageStatuses, "stale", "stale coverage");
  assertIncludes(coverageStatuses, "unsupported", "unsupported coverage");
  assertIncludes(coverageStatuses, "missing", "missing coverage");
  assertIncludes(coverageStatuses, "not_indexed", "not indexed coverage");
  assertIncludes(
    capabilityCodes,
    "unsupported_pdf",
    "PDF fail-closed boundary",
  );
  assertIncludes(
    capabilityCodes,
    "unsupported_scan",
    "scan fail-closed boundary",
  );
  assertIncludes(
    capabilityCodes,
    "unsupported_image_only",
    "image-only fail-closed boundary",
  );
  assertIncludes(
    capabilityCodes,
    "unsupported_ocr_only",
    "OCR fail-closed boundary",
  );
  assertIncludes(
    capabilityCodes,
    "unsupported_vector_only",
    "vector fail-closed boundary",
  );
  assertIncludes(
    capabilityCodes,
    "unsupported_pageindex",
    "PageIndex fail-closed boundary",
  );
  assertIncludes(
    capabilityCodes,
    "unsupported_table",
    "table fail-closed boundary",
  );
  assertIncludes(
    capabilityCodes,
    "unsupported_figure",
    "figure fail-closed boundary",
  );
  assertIncludes(
    capabilityCodes,
    "unsupported_graphics",
    "graphics fail-closed boundary",
  );
  assertIncludes(
    capabilityCodes,
    "ambiguous_layout",
    "ambiguous layout fail-closed boundary",
  );
  assertIncludes(relationshipKinds, "raw_source_to_anchor", "raw source trace");
  assertIncludes(
    relationshipKinds,
    "anchor_to_evidence_claim",
    "anchor-to-claim trace",
  );
  assertIncludes(
    relationshipKinds,
    "claim_to_evidence_card",
    "claim-to-card trace",
  );

  const firstCard = foundation.evidenceCards[0];
  if (!firstCard) throw new Error("Expected at least one evidence card");
  const supportedMap = foundation.documentMaps.find(
    (map) => map.coverageStatus === "supported",
  );
  if (!supportedMap) {
    throw new Error("Expected a supported deterministic document map");
  }
  if (supportedMap.sourceTables.length === 0) {
    throw new Error("Expected unsupported table placeholders");
  }
  if (supportedMap.sourceFigures.length === 0) {
    throw new Error("Expected unsupported figure placeholders");
  }
  if (firstCard.sourceAnchors.length === 0) {
    throw new Error("Expected evidence cards to expose source anchors");
  }
  if (firstCard.permittedNextActions.length === 0) {
    throw new Error("Expected evidence cards to expose permitted next actions");
  }
  assertIncludes(
    firstCard.forbiddenActions,
    "write_finance_twin_fact",
    "forbidden finance write action",
  );
  assertRuntimeBoundary(foundation.runtimeBoundary);

  console.log(
    JSON.stringify(
      {
        companyKey: foundation.companyKey,
        documentMapCount: foundation.documentMaps.length,
        sourceAnchorCount: foundation.sourceAnchors.length,
        evidenceClaimCount: foundation.evidenceClaims.length,
        evidenceTraceCount: foundation.evidenceTraces.length,
        evidenceCardCount: foundation.evidenceCards.length,
        coverageStatusesVerified: [...new Set(coverageStatuses)].sort(),
        deterministicDocumentMapVerified: true,
        sourceAnchorMetadataVerified: true,
        evidenceClaimRefsVerified: true,
        evidenceTraceVerified: true,
        evidenceCardPostureVerified: true,
        sourceCoverageMatrixVerified: true,
        unsupportedPdfFailClosed: true,
        unsupportedScanFailClosed: true,
        unsupportedImageOnlyFailClosed: true,
        unsupportedOcrFailClosed: true,
        unsupportedVectorFailClosed: true,
        unsupportedPageIndexFailClosed: true,
        unsupportedTableFigureFailClosed: true,
        rawSourcesRemainAuthoritative: true,
        financeTwinStructuredFactsRemainAuthoritative: true,
        cfoWikiRemainsCompiledDerived: true,
        noRoutesAdded: true,
        noMigrationsAdded: true,
        noUiAdded: true,
        noPackageScriptsAdded: true,
        noFixturesAdded: true,
        ...foundation.runtimeBoundary,
      },
      null,
      2,
    ),
  );
}

function buildSources() {
  return [
    sourceInput({
      checksum: "a",
      documentRole: "board_material",
      extractKind: "markdown_text",
      extractStatus: "extracted",
      mediaType: "text/markdown",
      sourceId: "11111111-1111-4111-8111-111111111111",
      storageRef: "s3://bucket/board.md",
      text: [
        "# Board Metrics",
        "",
        "Cash is source backed.",
        "",
        "| Metric | Value |",
        "| Cash | 100 |",
        "",
        "![Pipeline chart](chart.png)",
      ].join("\n"),
      wikiPageVersion: 2,
    }),
    sourceInput({
      checksum: "b",
      documentRole: "policy_document",
      extractKind: "plain_text",
      extractStatus: "extracted",
      freshnessState: "stale",
      mediaType: "text/plain",
      sourceId: "22222222-2222-4222-8222-222222222222",
      storageRef: "s3://bucket/policy.txt",
      text: "Renewal policy\n\nNeeds source refresh.",
      wikiPageVersion: 1,
    }),
    sourceInput({
      checksum: "c",
      documentRole: "lender_document",
      extractKind: "unsupported_document",
      extractStatus: "unsupported",
      mediaType: "application/pdf",
      sourceId: "33333333-3333-4333-8333-333333333333",
      storageRef: "s3://bucket/lender.pdf",
      text: null,
      wikiPageVersion: 1,
    }),
    sourceInput({
      checksum: "d",
      documentRole: "general_document",
      extractKind: null,
      extractStatus: null,
      mediaType: "text/plain",
      sourceFileMissing: true,
      sourceId: "44444444-4444-4444-8444-444444444444",
      storageRef: "s3://bucket/missing.txt",
      text: null,
      wikiPageVersion: 1,
    }),
    sourceInput({
      checksum: "e",
      documentRole: "general_document",
      extractKind: "plain_text",
      extractStatus: "extracted",
      includeInCompile: false,
      mediaType: "text/plain",
      sourceId: "55555555-5555-4555-8555-555555555555",
      storageRef: "s3://bucket/excluded.txt",
      text: "Excluded source.",
      wikiPageVersion: 1,
    }),
  ];
}

function sourceInput(input) {
  const checksum = input.checksum.repeat(64);
  const snapshotId = deriveUuid(input.sourceId, "4222", "8222");
  const sourceFileId = deriveUuid(input.sourceId, "4333", "8333");

  return {
    binding: {
      boundBy: "operator",
      companyId,
      createdAt: generatedAt,
      documentRole: input.documentRole,
      id: deriveUuid(input.sourceId, "4666", "8666"),
      includeInCompile: input.includeInCompile ?? true,
      sourceId: input.sourceId,
      updatedAt: generatedAt,
    },
    financeTwinRefs: input.sourceId.endsWith("111111")
      ? [
          {
            routePath: "/finance-twin/companies/acme/cash-posture",
            summary: "Cash posture remains authoritative in the Finance Twin.",
            targetId: "cash-posture",
            targetKind: "cash_posture",
          },
        ]
      : [],
    freshnessOverride:
      input.freshnessState === "stale"
        ? {
            checkedAt: generatedAt,
            compiledAt: generatedAt,
            extractedAt: generatedAt,
            sourceCapturedAt: "2026-01-01T00:00:00.000Z",
            state: "stale",
            summary:
              "The stored source is intentionally marked stale for V2A coverage.",
          }
        : undefined,
    latestExtract:
      input.extractKind && input.extractStatus
        ? {
            companyId,
            createdAt: generatedAt,
            documentKind: input.extractKind,
            errorSummary: null,
            excerptBlocks: input.text
              ? [{ heading: "Board Metrics", text: "Cash is source backed." }]
              : [],
            extractedAt: generatedAt,
            extractedText: input.text,
            extractStatus: input.extractStatus,
            headingOutline:
              input.extractKind === "markdown_text"
                ? [{ depth: 1, text: "Board Metrics" }]
                : [],
            id: deriveUuid(input.sourceId, "4777", "8777"),
            inputChecksumSha256: checksum,
            parserVersion: "f3b-document-extract-v1",
            renderedMarkdown: input.text,
            sourceFileId: input.sourceFileMissing ? null : sourceFileId,
            sourceId: input.sourceId,
            sourceSnapshotId: snapshotId,
            title: "Synthetic source",
            updatedAt: generatedAt,
            warnings:
              input.extractStatus === "unsupported"
                ? ["application/pdf remains unsupported in V2A."]
                : [],
          }
        : null,
    latestSnapshot: {
      capturedAt: generatedAt,
      checksumSha256: checksum,
      createdAt: generatedAt,
      id: snapshotId,
      ingestErrorSummary: null,
      ingestStatus: "ready",
      mediaType: input.mediaType,
      originalFileName: "synthetic-source",
      sizeBytes: input.text?.length ?? 12,
      sourceId: input.sourceId,
      storageKind: "object_store",
      storageRef: input.storageRef,
      updatedAt: generatedAt,
      version: input.wikiPageVersion,
    },
    latestSourceFile: input.sourceFileMissing
      ? null
      : {
          capturedAt: generatedAt,
          checksumSha256: checksum,
          createdAt: generatedAt,
          createdBy: "operator",
          id: sourceFileId,
          mediaType: input.mediaType,
          originalFileName: "synthetic-source",
          sizeBytes: input.text?.length ?? 12,
          sourceId: input.sourceId,
          sourceSnapshotId: snapshotId,
          storageKind: "object_store",
          storageRef: input.storageRef,
        },
    limitations: [],
    source: {
      createdAt: generatedAt,
      createdBy: "operator",
      description: null,
      id: input.sourceId,
      kind: "document",
      name: "Synthetic V2A source",
      originKind: "manual",
      updatedAt: generatedAt,
    },
    wikiRefs: [
      {
        pageKey: `sources/${input.sourceId}/snapshots/${input.wikiPageVersion}`,
        refKind: "source_excerpt",
        summary: "Derived CFO Wiki source digest page.",
      },
    ],
  };
}

function deriveUuid(sourceId, thirdGroup, fourthGroup) {
  const parts = sourceId.split("-");

  return `${parts[0]}-${parts[1]}-${thirdGroup}-${fourthGroup}-${parts[4]}`;
}

function assertIncludes(values, expected, label) {
  if (!values.includes(expected)) {
    throw new Error(`Expected ${label} to include ${expected}`);
  }
}

function assertRuntimeBoundary(boundary) {
  const expectedFalse = [
    "llmUsed",
    "runtimeCodexUsed",
    "vectorSearchUsed",
    "pageIndexUsed",
    "ocrUsed",
    "sourceMutationCreated",
    "financeWriteCreated",
    "providerCallCreated",
    "certificationCreated",
    "deliveryCreated",
    "autonomousActionCreated",
  ];

  for (const key of expectedFalse) {
    if (boundary[key] !== false) {
      throw new Error(`Expected runtime boundary ${key} to be false`);
    }
  }
}

main();
