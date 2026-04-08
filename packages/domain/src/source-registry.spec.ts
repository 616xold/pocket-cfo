import { describe, expect, it } from "vitest";
import {
  CreateSourceInputSchema,
  SourceIngestRunDetailViewSchema,
} from "./source-registry";

describe("Source registry domain schemas", () => {
  it("parses create-source input and defaults manual registration fields", () => {
    const parsed = CreateSourceInputSchema.parse({
      kind: "document",
      name: "March bank statement",
      snapshot: {
        originalFileName: "march-bank-statement.pdf",
        mediaType: "application/pdf",
        sizeBytes: 2048,
        checksumSha256:
          "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        storageKind: "external_url",
        storageRef: "https://example.com/statements/march.pdf",
      },
    });

    expect(parsed.originKind).toBe("manual");
    expect(parsed.createdBy).toBe("operator");
    expect(parsed.snapshot.ingestStatus).toBe("registered");
    expect(parsed.snapshot.checksumSha256).toBe(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    );
  });

  it("parses an ingest-run detail view with parser selection and a compact receipt summary", () => {
    const parsed = SourceIngestRunDetailViewSchema.parse({
      ingestRun: {
        id: "11111111-1111-4111-8111-111111111111",
        sourceId: "22222222-2222-4222-8222-222222222222",
        sourceSnapshotId: "33333333-3333-4333-8333-333333333333",
        sourceFileId: "44444444-4444-4444-8444-444444444444",
        parserSelection: {
          parserKey: "csv_tabular",
          matchedBy: "media_type",
          mediaType: "text/csv",
          fileExtension: "csv",
          sourceKind: "dataset",
        },
        inputChecksumSha256:
          "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        storageKind: "object_store",
        storageRef: "s3://bucket/sources/source-id/checksum/cash-flow.csv",
        status: "ready",
        warnings: [],
        errors: [],
        receiptSummary: {
          kind: "csv_tabular",
          columnCount: 2,
          header: ["name", "amount"],
          rowCount: 1,
          sampleRows: [["cash", "10"]],
        },
        startedAt: "2026-04-08T02:00:00.000Z",
        completedAt: "2026-04-08T02:00:03.000Z",
        createdAt: "2026-04-08T02:00:00.000Z",
        updatedAt: "2026-04-08T02:00:03.000Z",
        warningCount: 0,
        errorCount: 0,
      },
    });

    expect(parsed.ingestRun.parserSelection.parserKey).toBe("csv_tabular");
    expect(parsed.ingestRun.receiptSummary).toMatchObject({
      kind: "csv_tabular",
      columnCount: 2,
    });
  });
});
