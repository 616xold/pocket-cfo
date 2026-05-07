import { describe, expect, it } from "vitest";
import { buildEvidenceIndexFoundation } from "./service";
import type { EvidenceIndexBoundSourceInput } from "./types";

const generatedAt = "2026-05-07T18:45:00.000Z";

describe("EvidenceIndexService", () => {
  it("builds deterministic document maps, anchors, traces, cards, and coverage", () => {
    const foundation = buildEvidenceIndexFoundation({
      companyKey: "acme",
      generatedAt,
      sources: buildSources(),
    });
    const supported = foundation.documentMaps.find((map) =>
      map.sourceDocument.sourceId.endsWith("111111"),
    );
    const pdf = foundation.documentMaps.find((map) =>
      map.sourceDocument.sourceId.endsWith("333333"),
    );
    const coverageStatuses = new Set(
      foundation.sourceCoverageMatrix.entries.map(
        (entry) => entry.coverageStatus,
      ),
    );

    expect(supported?.coverageStatus).toBe("supported");
    expect(supported?.sourceSections[0]).toMatchObject({
      startLine: 1,
      title: "Board Metrics",
    });
    expect(supported?.sourceAnchors[0]).toMatchObject({
      checksumSha256:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      storageKind: "object_store",
      storageRef: "s3://bucket/board.md",
    });
    expect(supported?.sourceTables).toHaveLength(2);
    expect(supported?.sourceFigures).toHaveLength(1);

    expect(pdf).toMatchObject({
      coverageStatus: "unsupported",
      extractionMethod: "unsupported_pdf",
      sourceSections: [],
    });
    expect(
      foundation.sourceCoverageMatrix.capabilityBoundaries.map(
        (boundary) => boundary.code,
      ),
    ).toEqual(
      expect.arrayContaining([
        "unsupported_pdf",
        "unsupported_ocr_only",
        "unsupported_vector_only",
        "unsupported_pageindex",
      ]),
    );
    expect(coverageStatuses).toEqual(
      new Set(["supported", "stale", "unsupported", "missing", "not_indexed"]),
    );
    expect(foundation.evidenceCards[0]).toMatchObject({
      evidence: {
        financeTwinRefs: [{ targetKind: "cash_posture" }],
        wikiRefs: [{ pageKey: expect.stringContaining("sources/") }],
      },
      forbiddenActions: expect.arrayContaining([
        "mutate_raw_source",
        "write_finance_twin_fact",
        "run_llm_summarization",
      ]),
    });
    expect(
      foundation.evidenceTraces.map((trace) => trace.relationshipKind),
    ).toEqual(
      expect.arrayContaining([
        "raw_source_to_anchor",
        "anchor_to_evidence_claim",
        "finance_twin_ref_to_claim",
        "cfo_wiki_ref_to_claim",
        "claim_to_evidence_card",
      ]),
    );
    expect(foundation.runtimeBoundary).toMatchObject({
      llmUsed: false,
      ocrUsed: false,
      pageIndexUsed: false,
      runtimeCodexUsed: false,
      sourceMutationCreated: false,
      vectorSearchUsed: false,
    });
  });
});

function buildSources(): EvidenceIndexBoundSourceInput[] {
  return [
    sourceInput({
      checksum: "a",
      documentRole: "board_material",
      extractKind: "markdown_text",
      extractStatus: "extracted",
      mediaType: "text/markdown",
      sourceId: "11111111-1111-4111-8111-111111111111",
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
      text: "Excluded source.",
      wikiPageVersion: 1,
    }),
  ];
}

function sourceInput(input: {
  checksum: string;
  documentRole: EvidenceIndexBoundSourceInput["binding"]["documentRole"];
  extractKind: "markdown_text" | "plain_text" | "unsupported_document" | null;
  extractStatus: "extracted" | "unsupported" | null;
  freshnessState?: "stale";
  includeInCompile?: boolean;
  mediaType: string;
  sourceFileMissing?: boolean;
  sourceId: string;
  text: string | null;
  wikiPageVersion: number;
}): EvidenceIndexBoundSourceInput {
  const checksum = input.checksum.repeat(64);
  const snapshotId = deriveUuid(input.sourceId, "4222", "8222");
  const sourceFileId = deriveUuid(input.sourceId, "4333", "8333");

  return {
    binding: {
      boundBy: "operator",
      companyId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
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
            companyId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
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
      originalFileName: `source-${input.sourceId}.txt`,
      sizeBytes: input.text?.length ?? 12,
      sourceId: input.sourceId,
      storageKind: "object_store",
      storageRef: input.sourceId.endsWith("111111")
        ? "s3://bucket/board.md"
        : `s3://bucket/${input.sourceId}`,
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
          originalFileName: `source-${input.sourceId}.txt`,
          sizeBytes: input.text?.length ?? 12,
          sourceId: input.sourceId,
          sourceSnapshotId: snapshotId,
          storageKind: "object_store",
          storageRef: input.sourceId.endsWith("111111")
            ? "s3://bucket/board.md"
            : `s3://bucket/${input.sourceId}`,
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

function deriveUuid(sourceId: string, thirdGroup: string, fourthGroup: string) {
  const parts = sourceId.split("-");

  return `${parts[0]}-${parts[1]}-${thirdGroup}-${fourthGroup}-${parts[4]}`;
}
