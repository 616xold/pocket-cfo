import { afterAll, beforeEach, describe, expect, it } from "vitest";
import {
  closeTestDatabase,
  createTestDb,
  resetTestDatabase,
} from "../../test/database";
import { DrizzleSourceRepository } from "./drizzle-repository";

const db = createTestDb();

describe("DrizzleSourceRepository", () => {
  const repository = new DrizzleSourceRepository(db);

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("persists source files and provenance records linked to immutable snapshots", async () => {
    const source = await repository.createSource({
      kind: "spreadsheet",
      originKind: "manual",
      name: "Cash flow export",
      description: "April weekly cash flow model export",
      createdBy: "finance-operator",
    });

    const snapshot = await repository.createSnapshot({
      sourceId: source.id,
      version: 1,
      originalFileName: "cash-flow.xlsx",
      mediaType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      sizeBytes: 8192,
      checksumSha256:
        "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      storageKind: "local_path",
      storageRef: "/tmp/cash-flow.xlsx",
      capturedAt: "2026-04-06T23:40:00.000Z",
      ingestStatus: "registered",
    });
    const sourceFile = await repository.createSourceFile({
      sourceId: source.id,
      sourceSnapshotId: snapshot.id,
      originalFileName: "cash-flow.xlsx",
      mediaType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      sizeBytes: 8192,
      checksumSha256:
        "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      storageKind: "object_store",
      storageRef:
        "s3://pocket-cto-artifacts/sources/source-id/checksum/cash-flow.xlsx",
      createdBy: "finance-operator",
      capturedAt: "2026-04-06T23:40:00.000Z",
    });
    const provenanceRecord = await repository.createProvenanceRecord({
      sourceId: source.id,
      sourceSnapshotId: snapshot.id,
      sourceFileId: sourceFile.id,
      kind: "source_file_registered",
      recordedBy: "finance-operator",
      recordedAt: "2026-04-06T23:40:05.000Z",
    });

    const [listedSource] = await repository.listSources({ limit: 20 });
    const storedSnapshots = await repository.listSnapshotsBySourceId(source.id);
    const [storedSourceFile] = await repository.listSourceFilesBySourceId(
      source.id,
    );
    const [storedProvenanceRecord] =
      await repository.listProvenanceRecordsBySourceFileId(sourceFile.id);
    const latestSnapshotVersion = await repository.getLatestSnapshotVersion(
      source.id,
    );

    expect(listedSource).toMatchObject({
      id: source.id,
      kind: "spreadsheet",
      name: "Cash flow export",
      description: "April weekly cash flow model export",
    });
    expect(storedSnapshots).toMatchObject([
      {
        id: snapshot.id,
        sourceId: source.id,
        version: 1,
        originalFileName: "cash-flow.xlsx",
        storageKind: "local_path",
        storageRef: "/tmp/cash-flow.xlsx",
      },
    ]);
    expect(storedSourceFile).toMatchObject({
      id: sourceFile.id,
      sourceId: source.id,
      sourceSnapshotId: snapshot.id,
      storageKind: "object_store",
      createdBy: "finance-operator",
    });
    expect(storedProvenanceRecord).toMatchObject({
      id: provenanceRecord.id,
      sourceId: source.id,
      sourceSnapshotId: snapshot.id,
      sourceFileId: sourceFile.id,
      kind: "source_file_registered",
      recordedBy: "finance-operator",
    });
    expect(latestSnapshotVersion).toBe(1);
  });

  it("persists ingest runs and snapshot ingest-state updates for stored source files", async () => {
    const source = await repository.createSource({
      kind: "document",
      originKind: "manual",
      name: "Board deck",
      description: null,
      createdBy: "finance-operator",
    });
    const snapshot = await repository.createSnapshot({
      sourceId: source.id,
      version: 1,
      originalFileName: "board-deck.pdf",
      mediaType: "application/pdf",
      sizeBytes: 4096,
      checksumSha256:
        "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
      storageKind: "object_store",
      storageRef:
        "s3://pocket-cto-artifacts/sources/source-id/checksum/board-deck.pdf",
      capturedAt: "2026-04-08T02:00:00.000Z",
      ingestStatus: "registered",
    });
    const sourceFile = await repository.createSourceFile({
      sourceId: source.id,
      sourceSnapshotId: snapshot.id,
      originalFileName: "board-deck.pdf",
      mediaType: "application/pdf",
      sizeBytes: 4096,
      checksumSha256:
        "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
      storageKind: "object_store",
      storageRef:
        "s3://pocket-cto-artifacts/sources/source-id/checksum/board-deck.pdf",
      createdBy: "finance-operator",
      capturedAt: "2026-04-08T02:00:00.000Z",
    });
    const createdRun = await repository.createSourceIngestRun({
      sourceId: source.id,
      sourceSnapshotId: snapshot.id,
      sourceFileId: sourceFile.id,
      parserSelection: {
        parserKey: "metadata_fallback",
        matchedBy: "fallback",
        mediaType: "application/pdf",
        fileExtension: "pdf",
        sourceKind: "document",
      },
      inputChecksumSha256:
        "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
      storageKind: "object_store",
      storageRef:
        "s3://pocket-cto-artifacts/sources/source-id/checksum/board-deck.pdf",
      status: "processing",
      warnings: [],
      errors: [],
      receiptSummary: null,
      startedAt: "2026-04-08T02:10:00.000Z",
    });

    await repository.updateSnapshotIngestState({
      snapshotId: snapshot.id,
      ingestStatus: "processing",
    });

    const finalizedRun = await repository.updateSourceIngestRun({
      ingestRunId: createdRun.id,
      status: "ready",
      warnings: [
        {
          code: "metadata_only_receipt",
          message: "Stored metadata only.",
        },
      ],
      errors: [],
      receiptSummary: {
        kind: "metadata_fallback",
        note: "Stored metadata only.",
      },
      completedAt: "2026-04-08T02:10:03.000Z",
    });
    const storedRun = await repository.getSourceIngestRunById(createdRun.id);
    const listedRuns = await repository.listSourceIngestRunsBySourceFileId(
      sourceFile.id,
    );
    const updatedSnapshot = await repository.getSnapshotById(snapshot.id);

    expect(finalizedRun).toMatchObject({
      id: createdRun.id,
      sourceId: source.id,
      sourceSnapshotId: snapshot.id,
      sourceFileId: sourceFile.id,
      status: "ready",
      parserSelection: {
        parserKey: "metadata_fallback",
      },
      warnings: [
        {
          code: "metadata_only_receipt",
        },
      ],
      receiptSummary: {
        kind: "metadata_fallback",
      },
    });
    expect(storedRun).toMatchObject({
      id: createdRun.id,
      completedAt: "2026-04-08T02:10:03.000Z",
    });
    expect(listedRuns).toMatchObject([
      {
        id: createdRun.id,
        status: "ready",
      },
    ]);
    expect(updatedSnapshot).toMatchObject({
      id: snapshot.id,
      ingestStatus: "processing",
    });
  });
});
