import { describe, expect, it } from "vitest";
import { InMemorySourceFileStorage } from "../../sources/storage";
import {
  CFO_WIKI_DOCUMENT_EXTRACT_PARSER_VERSION,
  resolveDocumentExtract,
} from "./document-extract";

const source = {
  id: "11111111-1111-4111-8111-111111111111",
  kind: "document" as const,
  originKind: "manual" as const,
  name: "Board deck",
  description: null,
  createdBy: "finance-operator",
  createdAt: "2026-04-13T10:00:00.000Z",
  updatedAt: "2026-04-13T10:00:00.000Z",
};

describe("resolveDocumentExtract", () => {
  it("extracts markdown headings and excerpt blocks from stored raw bytes", async () => {
    const storage = new InMemorySourceFileStorage();
    const stored = await storage.write({
      sourceId: source.id,
      originalFileName: "board-deck.md",
      mediaType: "text/markdown",
      checksumSha256:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      body: Buffer.from(
        "# Board Deck\n\nRevenue grew 20%.\n\n## Risks\n\nCollections remain slow.\n",
      ),
    });

    const extract = await resolveDocumentExtract({
      existingExtract: null,
      now: new Date("2026-04-13T21:00:00.000Z"),
      snapshot: {
        id: "22222222-2222-4222-8222-222222222222",
        sourceId: source.id,
        version: 2,
        originalFileName: "board-deck.md",
        mediaType: "text/markdown",
        sizeBytes: 72,
        checksumSha256:
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        storageKind: "object_store",
        storageRef: stored.storageRef,
        capturedAt: "2026-04-13T20:59:00.000Z",
        ingestStatus: "ready",
        ingestErrorSummary: null,
        createdAt: "2026-04-13T20:59:00.000Z",
        updatedAt: "2026-04-13T20:59:00.000Z",
      },
      source,
      sourceFile: {
        id: "33333333-3333-4333-8333-333333333333",
        sourceId: source.id,
        sourceSnapshotId: "22222222-2222-4222-8222-222222222222",
        originalFileName: "board-deck.md",
        mediaType: "text/markdown",
        sizeBytes: 72,
        checksumSha256:
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        storageKind: "object_store",
        storageRef: stored.storageRef,
        createdBy: "finance-operator",
        capturedAt: "2026-04-13T20:59:00.000Z",
        createdAt: "2026-04-13T20:59:00.000Z",
      },
      sourceFileStorage: storage,
    });

    expect(extract).toMatchObject({
      extractStatus: "extracted",
      documentKind: "markdown_text",
      parserVersion: CFO_WIKI_DOCUMENT_EXTRACT_PARSER_VERSION,
      title: "Board Deck",
    });
    expect(extract.headingOutline).toEqual([
      { depth: 1, text: "Board Deck" },
      { depth: 2, text: "Risks" },
    ]);
    expect(extract.excerptBlocks).toEqual(
      expect.arrayContaining([
        { heading: "Board Deck", text: "Revenue grew 20%." },
        { heading: "Risks", text: "Collections remain slow." },
      ]),
    );
  });

  it("marks unsupported documents truthfully when no stored raw bytes are available", async () => {
    const extract = await resolveDocumentExtract({
      existingExtract: null,
      now: new Date("2026-04-13T21:00:00.000Z"),
      snapshot: {
        id: "22222222-2222-4222-8222-222222222222",
        sourceId: source.id,
        version: 1,
        originalFileName: "board-deck.pdf",
        mediaType: "application/pdf",
        sizeBytes: 2048,
        checksumSha256:
          "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        storageKind: "external_url",
        storageRef: "https://example.com/board-deck.pdf",
        capturedAt: "2026-04-13T20:59:00.000Z",
        ingestStatus: "registered",
        ingestErrorSummary: null,
        createdAt: "2026-04-13T20:59:00.000Z",
        updatedAt: "2026-04-13T20:59:00.000Z",
      },
      source,
      sourceFile: null,
      sourceFileStorage: new InMemorySourceFileStorage(),
    });

    expect(extract).toMatchObject({
      extractStatus: "unsupported",
      documentKind: "unsupported_document",
      sourceFileId: null,
    });
    expect(extract.warnings[0]).toContain("No stored raw source file");
  });

  it("reuses a persisted extract when checksum and parser version still match", async () => {
    const existingExtract = {
      id: "44444444-4444-4444-8444-444444444444",
      companyId: "55555555-5555-4555-8555-555555555555",
      sourceId: source.id,
      sourceSnapshotId: "22222222-2222-4222-8222-222222222222",
      sourceFileId: "33333333-3333-4333-8333-333333333333",
      extractStatus: "extracted" as const,
      documentKind: "plain_text" as const,
      title: "Board Deck",
      headingOutline: [],
      excerptBlocks: [{ heading: null, text: "Cached extract." }],
      extractedText: "Cached extract.",
      renderedMarkdown: "Cached extract.",
      warnings: [],
      errorSummary: null,
      parserVersion: CFO_WIKI_DOCUMENT_EXTRACT_PARSER_VERSION,
      inputChecksumSha256:
        "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
      extractedAt: "2026-04-13T20:58:00.000Z",
      createdAt: "2026-04-13T20:58:00.000Z",
      updatedAt: "2026-04-13T20:58:00.000Z",
    };

    const extract = await resolveDocumentExtract({
      existingExtract,
      now: new Date("2026-04-13T21:00:00.000Z"),
      snapshot: {
        id: existingExtract.sourceSnapshotId,
        sourceId: source.id,
        version: 2,
        originalFileName: "board-deck.txt",
        mediaType: "text/plain",
        sizeBytes: 32,
        checksumSha256: existingExtract.inputChecksumSha256,
        storageKind: "object_store",
        storageRef: "s3://bucket/board-deck.txt",
        capturedAt: "2026-04-13T20:59:00.000Z",
        ingestStatus: "ready",
        ingestErrorSummary: null,
        createdAt: "2026-04-13T20:59:00.000Z",
        updatedAt: "2026-04-13T20:59:00.000Z",
      },
      source,
      sourceFile: {
        id: existingExtract.sourceFileId!,
        sourceId: source.id,
        sourceSnapshotId: existingExtract.sourceSnapshotId,
        originalFileName: "board-deck.txt",
        mediaType: "text/plain",
        sizeBytes: 32,
        checksumSha256: existingExtract.inputChecksumSha256,
        storageKind: "object_store",
        storageRef: "s3://bucket/board-deck.txt",
        createdBy: "finance-operator",
        capturedAt: "2026-04-13T20:59:00.000Z",
        createdAt: "2026-04-13T20:59:00.000Z",
      },
      sourceFileStorage: new InMemorySourceFileStorage(),
    });

    expect(extract.extractedAt).toBe(existingExtract.extractedAt);
    expect(extract.excerptBlocks).toEqual(existingExtract.excerptBlocks);
  });
});
