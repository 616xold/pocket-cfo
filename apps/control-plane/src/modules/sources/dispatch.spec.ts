import { describe, expect, it } from "vitest";
import { selectSourceParser } from "./dispatch";

describe("selectSourceParser", () => {
  it("prefers media type for CSV files", () => {
    expect(
      selectSourceParser(
        createSource({ kind: "dataset" }),
        createSourceFile({
          mediaType: "text/csv",
          originalFileName: "cash-flow.bin",
        }),
      ),
    ).toMatchObject({
      parserKey: "csv_tabular",
      matchedBy: "media_type",
    });
  });

  it("uses file extension for markdown-like documents", () => {
    expect(
      selectSourceParser(
        createSource({ kind: "document" }),
        createSourceFile({
          mediaType: "application/octet-stream",
          originalFileName: "board-update.md",
        }),
      ),
    ).toMatchObject({
      parserKey: "markdown_text",
      matchedBy: "file_extension",
      fileExtension: "md",
    });
  });

  it("uses source kind for archive octet-stream files without a useful extension", () => {
    expect(
      selectSourceParser(
        createSource({ kind: "archive" }),
        createSourceFile({
          mediaType: "application/octet-stream",
          originalFileName: "bundle",
        }),
      ),
    ).toMatchObject({
      parserKey: "zip_inventory",
      matchedBy: "source_kind",
    });
  });

  it("falls back to metadata-only receipts for unsupported office and pdf formats", () => {
    expect(
      selectSourceParser(
        createSource({ kind: "spreadsheet" }),
        createSourceFile({
          mediaType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          originalFileName: "forecast.xlsx",
        }),
      ),
    ).toMatchObject({
      parserKey: "metadata_fallback",
    });
    expect(
      selectSourceParser(
        createSource({ kind: "document" }),
        createSourceFile({
          mediaType: "application/pdf",
          originalFileName: "board-deck.pdf",
        }),
      ),
    ).toMatchObject({
      parserKey: "metadata_fallback",
    });
  });
});

function createSource(input: { kind: "archive" | "dataset" | "document" | "spreadsheet" }) {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    kind: input.kind,
    originKind: "manual" as const,
    name: "test source",
    description: null,
    createdBy: "finance-operator",
    createdAt: "2026-04-08T00:00:00.000Z",
    updatedAt: "2026-04-08T00:00:00.000Z",
  };
}

function createSourceFile(input: {
  mediaType: string;
  originalFileName: string;
}) {
  return {
    id: "22222222-2222-4222-8222-222222222222",
    sourceId: "11111111-1111-4111-8111-111111111111",
    sourceSnapshotId: "33333333-3333-4333-8333-333333333333",
    originalFileName: input.originalFileName,
    mediaType: input.mediaType,
    sizeBytes: 64,
    checksumSha256:
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    storageKind: "object_store" as const,
    storageRef: "s3://pocket-cto-artifacts/sources/test/file",
    createdBy: "finance-operator",
    capturedAt: "2026-04-08T00:00:00.000Z",
    createdAt: "2026-04-08T00:00:00.000Z",
  };
}
