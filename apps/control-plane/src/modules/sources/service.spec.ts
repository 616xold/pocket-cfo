import { describe, expect, it } from "vitest";
import { InMemorySourceRepository } from "./repository";
import { SourceRegistryService } from "./service";
import { InMemorySourceFileStorage } from "./storage";

describe("SourceRegistryService", () => {
  it("creates a source with an initial immutable snapshot and lists it with summary metadata", async () => {
    const repository = new InMemorySourceRepository();
    const storage = new InMemorySourceFileStorage();
    const service = new SourceRegistryService(
      repository,
      storage,
      () => new Date("2026-04-06T23:30:00.000Z"),
    );

    const created = await service.createSource({
      kind: "document",
      name: "March bank statement",
      createdBy: "finance-operator",
      originKind: "manual",
      snapshot: {
        originalFileName: "march-bank-statement.pdf",
        mediaType: "application/pdf",
        sizeBytes: 2048,
        checksumSha256:
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        storageKind: "external_url",
        storageRef: "https://example.com/statements/march.pdf",
        ingestStatus: "registered",
      },
    });

    expect(created.source).toMatchObject({
      kind: "document",
      originKind: "manual",
      name: "March bank statement",
      createdBy: "finance-operator",
    });
    expect(created.snapshots).toMatchObject([
      {
        version: 1,
        originalFileName: "march-bank-statement.pdf",
        mediaType: "application/pdf",
        sizeBytes: 2048,
        checksumSha256:
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        storageKind: "external_url",
        storageRef: "https://example.com/statements/march.pdf",
        capturedAt: "2026-04-06T23:30:00.000Z",
        ingestStatus: "registered",
      },
    ]);

    const listed = await service.listSources({ limit: 20 });
    const reloaded = await service.getSource(created.source.id);

    expect(listed).toMatchObject({
      limit: 20,
      sourceCount: 1,
      sources: [
        {
          id: created.source.id,
          snapshotCount: 1,
          latestSnapshot: {
            id: created.snapshots[0]?.id,
            version: 1,
          },
        },
      ],
    });
    expect(reloaded).toMatchObject({
      source: {
        id: created.source.id,
        kind: "document",
        originKind: "manual",
        name: "March bank statement",
        createdBy: "finance-operator",
      },
      snapshots: [
        {
          id: created.snapshots[0]?.id,
          version: 1,
        },
      ],
    });
  });

  it("registers a raw source file, stores its bytes, and mirrors the next snapshot summary", async () => {
    const repository = new InMemorySourceRepository();
    const storage = new InMemorySourceFileStorage();
    const service = new SourceRegistryService(
      repository,
      storage,
      () => new Date("2026-04-08T01:10:00.000Z"),
    );
    const created = await service.createSource({
      kind: "document",
      name: "April board deck",
      createdBy: "finance-operator",
      originKind: "manual",
      snapshot: {
        originalFileName: "april-board-deck-link.txt",
        mediaType: "text/plain",
        sizeBytes: 20,
        checksumSha256:
          "1111111111111111111111111111111111111111111111111111111111111111",
        storageKind: "external_url",
        storageRef: "https://example.com/board/april.txt",
        ingestStatus: "registered",
      },
    });

    const registered = await service.registerSourceFile(
      created.source.id,
      {
        originalFileName: "april-board-deck.pdf",
        mediaType: "application/pdf",
        createdBy: "finance-operator",
        capturedAt: "2026-04-07T23:59:00.000Z",
      },
      Buffer.from("april board deck pdf bytes"),
    );

    expect(registered).toMatchObject({
      sourceFile: {
        sourceId: created.source.id,
        originalFileName: "april-board-deck.pdf",
        mediaType: "application/pdf",
        sizeBytes: 26,
        createdBy: "finance-operator",
        storageKind: "object_store",
        capturedAt: "2026-04-07T23:59:00.000Z",
      },
      snapshot: {
        sourceId: created.source.id,
        version: 2,
        originalFileName: "april-board-deck.pdf",
        mediaType: "application/pdf",
        sizeBytes: 26,
        storageKind: "object_store",
        capturedAt: "2026-04-07T23:59:00.000Z",
      },
      provenanceRecords: [
        {
          sourceId: created.source.id,
          kind: "source_file_registered",
          recordedBy: "finance-operator",
          recordedAt: "2026-04-08T01:10:00.000Z",
        },
      ],
    });
    expect((await storage.read(registered.sourceFile.storageRef)).toString()).toBe(
      "april board deck pdf bytes",
    );

    const listedFiles = await service.listSourceFiles(created.source.id);
    const reloadedFile = await service.getSourceFile(registered.sourceFile.id);
    const reloadedSource = await service.getSource(created.source.id);

    expect(listedFiles).toMatchObject({
      sourceId: created.source.id,
      fileCount: 1,
      files: [
        {
          id: registered.sourceFile.id,
          snapshotVersion: 2,
        },
      ],
    });
    expect(reloadedFile).toMatchObject({
      sourceFile: {
        id: registered.sourceFile.id,
      },
      snapshot: {
        id: registered.snapshot.id,
        version: 2,
      },
      provenanceRecords: [
        {
          sourceFileId: registered.sourceFile.id,
        },
      ],
    });
    expect(reloadedSource.snapshots.map((snapshot) => snapshot.version)).toEqual([
      2,
      1,
    ]);
  });

  it("creates a ready CSV ingest run with a compact tabular receipt", async () => {
    const { created, registered, service } = await createRegisteredSourceFile({
      body: Buffer.from("name,amount\ncash,10\nrunway,12\n"),
      kind: "dataset",
      mediaType: "text/csv",
      now: "2026-04-08T02:00:00.000Z",
      originalFileName: "cash-flow.csv",
    });

    const ingested = await service.ingestSourceFile(registered.sourceFile.id);
    const listedRuns = await service.listSourceIngestRuns(registered.sourceFile.id);
    const reloadedRun = await service.getSourceIngestRun(ingested.ingestRun.id);
    const reloadedSource = await service.getSource(created.source.id);

    expect(ingested).toMatchObject({
      ingestRun: {
        sourceId: created.source.id,
        sourceFileId: registered.sourceFile.id,
        sourceSnapshotId: registered.snapshot.id,
        status: "ready",
        warningCount: 0,
        errorCount: 0,
        parserSelection: {
          parserKey: "csv_tabular",
          matchedBy: "media_type",
        },
        receiptSummary: {
          kind: "csv_tabular",
          columnCount: 2,
          header: ["name", "amount"],
          rowCount: 2,
          sampleRows: [
            ["cash", "10"],
            ["runway", "12"],
          ],
        },
      },
    });
    expect(listedRuns).toMatchObject({
      sourceFileId: registered.sourceFile.id,
      runCount: 1,
      ingestRuns: [
        {
          id: ingested.ingestRun.id,
          status: "ready",
        },
      ],
    });
    expect(reloadedRun).toMatchObject({
      ingestRun: {
        id: ingested.ingestRun.id,
        status: "ready",
      },
    });
    expect(reloadedSource.snapshots[0]).toMatchObject({
      id: registered.snapshot.id,
      ingestStatus: "ready",
      ingestErrorSummary: null,
    });
  });

  it("creates markdown and ZIP ingest receipts, then falls back to metadata-only for unsupported PDF", async () => {
    const markdownFlow = await createRegisteredSourceFile({
      body: Buffer.from("# Board Update\n\n## Risks\nTight cash controls.\n"),
      kind: "document",
      mediaType: "text/markdown",
      now: "2026-04-08T03:00:00.000Z",
      originalFileName: "board-update.md",
    });
    const zipFlow = await createRegisteredSourceFile({
      body: createZipArchive([
        { path: "docs/summary.md", body: Buffer.from("# Summary\n") },
        { path: "exports/cash-flow.csv", body: Buffer.from("name,amount\n") },
      ]),
      kind: "archive",
      mediaType: "application/zip",
      now: "2026-04-08T03:10:00.000Z",
      originalFileName: "bundle.zip",
    });
    const pdfFlow = await createRegisteredSourceFile({
      body: Buffer.from("%PDF-1.7 sample pdf bytes"),
      kind: "document",
      mediaType: "application/pdf",
      now: "2026-04-08T03:20:00.000Z",
      originalFileName: "board-deck.pdf",
    });

    const markdownRun = await markdownFlow.service.ingestSourceFile(
      markdownFlow.registered.sourceFile.id,
    );
    const zipRun = await zipFlow.service.ingestSourceFile(
      zipFlow.registered.sourceFile.id,
    );
    const pdfRun = await pdfFlow.service.ingestSourceFile(
      pdfFlow.registered.sourceFile.id,
    );

    expect(markdownRun).toMatchObject({
      ingestRun: {
        status: "ready",
        parserSelection: {
          parserKey: "markdown_text",
        },
        receiptSummary: {
          kind: "markdown_text",
          headingCount: 2,
          headingPreview: [
            {
              depth: 1,
              text: "Board Update",
            },
            {
              depth: 2,
              text: "Risks",
            },
          ],
        },
      },
    });
    expect(zipRun).toMatchObject({
      ingestRun: {
        status: "ready",
        parserSelection: {
          parserKey: "zip_inventory",
        },
        receiptSummary: {
          kind: "zip_inventory",
          entryCount: 2,
          entries: [
            {
              path: "docs/summary.md",
            },
            {
              path: "exports/cash-flow.csv",
            },
          ],
        },
      },
    });
    expect(pdfRun).toMatchObject({
      ingestRun: {
        status: "ready",
        parserSelection: {
          parserKey: "metadata_fallback",
        },
        warningCount: 1,
        receiptSummary: {
          kind: "metadata_fallback",
        },
      },
    });
  });
});

async function createRegisteredSourceFile(input: {
  body: Buffer;
  kind: "archive" | "dataset" | "document";
  mediaType: string;
  now: string;
  originalFileName: string;
}) {
  const repository = new InMemorySourceRepository();
  const storage = new InMemorySourceFileStorage();
  const service = new SourceRegistryService(
    repository,
    storage,
    () => new Date(input.now),
  );
  const created = await service.createSource({
    kind: input.kind,
    name: `${input.originalFileName} source`,
    createdBy: "finance-operator",
    originKind: "manual",
    snapshot: {
      originalFileName: `${input.originalFileName}.link`,
      mediaType: "text/plain",
      sizeBytes: 12,
      checksumSha256:
        "9999999999999999999999999999999999999999999999999999999999999999",
      storageKind: "external_url",
      storageRef: "https://example.com/source-file",
      ingestStatus: "registered",
    },
  });
  const registered = await service.registerSourceFile(
    created.source.id,
    {
      originalFileName: input.originalFileName,
      mediaType: input.mediaType,
      createdBy: "finance-operator",
      capturedAt: input.now,
    },
    input.body,
  );

  return {
    created,
    registered,
    service,
  };
}

function createZipArchive(
  files: Array<{ path: string; body: Buffer }>,
) {
  let localOffset = 0;
  const localFiles: Buffer[] = [];
  const centralDirectoryRecords: Buffer[] = [];

  for (const file of files) {
    const fileName = Buffer.from(file.path, "utf-8");
    const localHeader = Buffer.alloc(30);

    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(0, 14);
    localHeader.writeUInt32LE(file.body.length, 18);
    localHeader.writeUInt32LE(file.body.length, 22);
    localHeader.writeUInt16LE(fileName.length, 26);
    localHeader.writeUInt16LE(0, 28);

    const localRecord = Buffer.concat([localHeader, fileName, file.body]);
    localFiles.push(localRecord);

    const centralDirectory = Buffer.alloc(46);
    centralDirectory.writeUInt32LE(0x02014b50, 0);
    centralDirectory.writeUInt16LE(20, 4);
    centralDirectory.writeUInt16LE(20, 6);
    centralDirectory.writeUInt16LE(0, 8);
    centralDirectory.writeUInt16LE(0, 10);
    centralDirectory.writeUInt16LE(0, 12);
    centralDirectory.writeUInt16LE(0, 14);
    centralDirectory.writeUInt32LE(0, 16);
    centralDirectory.writeUInt32LE(file.body.length, 20);
    centralDirectory.writeUInt32LE(file.body.length, 24);
    centralDirectory.writeUInt16LE(fileName.length, 28);
    centralDirectory.writeUInt16LE(0, 30);
    centralDirectory.writeUInt16LE(0, 32);
    centralDirectory.writeUInt16LE(0, 34);
    centralDirectory.writeUInt16LE(0, 36);
    centralDirectory.writeUInt32LE(0, 38);
    centralDirectory.writeUInt32LE(localOffset, 42);

    centralDirectoryRecords.push(Buffer.concat([centralDirectory, fileName]));
    localOffset += localRecord.length;
  }

  const centralDirectoryBuffer = Buffer.concat(centralDirectoryRecords);
  const endOfCentralDirectory = Buffer.alloc(22);

  endOfCentralDirectory.writeUInt32LE(0x06054b50, 0);
  endOfCentralDirectory.writeUInt16LE(0, 4);
  endOfCentralDirectory.writeUInt16LE(0, 6);
  endOfCentralDirectory.writeUInt16LE(files.length, 8);
  endOfCentralDirectory.writeUInt16LE(files.length, 10);
  endOfCentralDirectory.writeUInt32LE(centralDirectoryBuffer.length, 12);
  endOfCentralDirectory.writeUInt32LE(localOffset, 16);
  endOfCentralDirectory.writeUInt16LE(0, 20);

  return Buffer.concat([
    ...localFiles,
    centralDirectoryBuffer,
    endOfCentralDirectory,
  ]);
}
