import { asc, desc, eq, inArray } from "drizzle-orm";
import {
  provenanceRecords,
  sourceFiles,
  sourceIngestRuns,
  sourceSnapshots,
  sources,
  type Db,
  type DbTransaction,
} from "@pocket-cto/db";
import {
  createDbSession,
  getDbExecutor,
  type PersistenceSession,
} from "../../lib/persistence";
import {
  mapProvenanceRecordRow,
  mapSourceFileRow,
  mapSourceIngestRunRow,
  mapSourceRow,
  mapSourceSnapshotRow,
} from "./repository-mappers";
import type {
  CreateProvenanceRecordInput,
  CreateSourceRecordInput,
  CreateSourceFileRecordInput,
  CreateSourceIngestRunRecordInput,
  CreateSourceSnapshotRecordInput,
  SourceRepository,
  UpdateSnapshotIngestStateInput,
  UpdateSourceIngestRunRecordInput,
} from "./repository";

export class DrizzleSourceRepository implements SourceRepository {
  constructor(private readonly db: Db) {}

  async transaction<T>(
    operation: (session: PersistenceSession) => Promise<T>,
  ): Promise<T> {
    return this.db.transaction(async (tx: DbTransaction) =>
      operation(createDbSession(tx)),
    );
  }

  async createSource(
    input: CreateSourceRecordInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .insert(sources)
      .values({
        kind: input.kind,
        originKind: input.originKind,
        name: input.name,
        description: input.description,
        createdBy: input.createdBy,
      })
      .returning();

    if (!row) {
      throw new Error("Source insert did not return a row");
    }

    return mapSourceRow(row);
  }

  async createSnapshot(
    input: CreateSourceSnapshotRecordInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .insert(sourceSnapshots)
      .values({
        sourceId: input.sourceId,
        version: input.version,
        originalFileName: input.originalFileName,
        mediaType: input.mediaType,
        sizeBytes: input.sizeBytes,
        checksumSha256: input.checksumSha256,
        storageKind: input.storageKind,
        storageRef: input.storageRef,
        capturedAt: new Date(input.capturedAt),
        ingestStatus: input.ingestStatus,
        ingestErrorSummary: input.ingestErrorSummary ?? null,
      })
      .returning();

    if (!row) {
      throw new Error("Source snapshot insert did not return a row");
    }

    await executor
      .update(sources)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(sources.id, input.sourceId));

    return mapSourceSnapshotRow(row);
  }

  async createSourceFile(
    input: CreateSourceFileRecordInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .insert(sourceFiles)
      .values({
        sourceId: input.sourceId,
        sourceSnapshotId: input.sourceSnapshotId,
        originalFileName: input.originalFileName,
        mediaType: input.mediaType,
        sizeBytes: input.sizeBytes,
        checksumSha256: input.checksumSha256,
        storageKind: input.storageKind,
        storageRef: input.storageRef,
        createdBy: input.createdBy,
        capturedAt: new Date(input.capturedAt),
      })
      .returning();

    if (!row) {
      throw new Error("Source file insert did not return a row");
    }

    return mapSourceFileRow(row);
  }

  async createProvenanceRecord(
    input: CreateProvenanceRecordInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .insert(provenanceRecords)
      .values({
        sourceId: input.sourceId,
        sourceSnapshotId: input.sourceSnapshotId,
        sourceFileId: input.sourceFileId,
        kind: input.kind,
        recordedBy: input.recordedBy,
        recordedAt: new Date(input.recordedAt),
      })
      .returning();

    if (!row) {
      throw new Error("Provenance record insert did not return a row");
    }

    return mapProvenanceRecordRow(row);
  }

  async createSourceIngestRun(
    input: CreateSourceIngestRunRecordInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .insert(sourceIngestRuns)
      .values({
        sourceId: input.sourceId,
        sourceSnapshotId: input.sourceSnapshotId,
        sourceFileId: input.sourceFileId,
        parserKey: input.parserSelection.parserKey,
        parserSelection: input.parserSelection,
        inputChecksumSha256: input.inputChecksumSha256,
        storageKind: input.storageKind,
        storageRef: input.storageRef,
        status: input.status,
        warnings: input.warnings,
        errors: input.errors,
        receiptSummary: input.receiptSummary,
        startedAt: new Date(input.startedAt),
        completedAt: input.completedAt ? new Date(input.completedAt) : null,
      })
      .returning();

    if (!row) {
      throw new Error("Source ingest run insert did not return a row");
    }

    return mapSourceIngestRunRow(row);
  }

  async updateSourceIngestRun(
    input: UpdateSourceIngestRunRecordInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .update(sourceIngestRuns)
      .set({
        completedAt: input.completedAt ? new Date(input.completedAt) : null,
        errors: input.errors,
        receiptSummary: input.receiptSummary,
        status: input.status,
        updatedAt: new Date(),
        warnings: input.warnings,
      })
      .where(eq(sourceIngestRuns.id, input.ingestRunId))
      .returning();

    if (!row) {
      throw new Error(`Source ingest run ${input.ingestRunId} was not found`);
    }

    return mapSourceIngestRunRow(row);
  }

  async updateSnapshotIngestState(
    input: UpdateSnapshotIngestStateInput,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .update(sourceSnapshots)
      .set({
        ingestErrorSummary: input.ingestErrorSummary ?? null,
        ingestStatus: input.ingestStatus,
        updatedAt: new Date(),
      })
      .where(eq(sourceSnapshots.id, input.snapshotId))
      .returning();

    if (!row) {
      throw new Error(`Source snapshot ${input.snapshotId} was not found`);
    }

    await executor
      .update(sources)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(sources.id, row.sourceId));

    return mapSourceSnapshotRow(row);
  }

  async getSourceById(sourceId: string, session?: PersistenceSession) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .select()
      .from(sources)
      .where(eq(sources.id, sourceId))
      .limit(1);

    return row ? mapSourceRow(row) : null;
  }

  async getSnapshotById(snapshotId: string, session?: PersistenceSession) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .select()
      .from(sourceSnapshots)
      .where(eq(sourceSnapshots.id, snapshotId))
      .limit(1);

    return row ? mapSourceSnapshotRow(row) : null;
  }

  async getSourceFileById(sourceFileId: string, session?: PersistenceSession) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .select()
      .from(sourceFiles)
      .where(eq(sourceFiles.id, sourceFileId))
      .limit(1);

    return row ? mapSourceFileRow(row) : null;
  }

  async getSourceIngestRunById(
    ingestRunId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .select()
      .from(sourceIngestRuns)
      .where(eq(sourceIngestRuns.id, ingestRunId))
      .limit(1);

    return row ? mapSourceIngestRunRow(row) : null;
  }

  async listSources(
    input: { limit: number },
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const rows = await executor
      .select()
      .from(sources)
      .orderBy(desc(sources.updatedAt), desc(sources.createdAt), asc(sources.name))
      .limit(input.limit);

    return rows.map(mapSourceRow);
  }

  async getLatestSnapshotVersion(
    sourceId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const [row] = await executor
      .select({ version: sourceSnapshots.version })
      .from(sourceSnapshots)
      .where(eq(sourceSnapshots.sourceId, sourceId))
      .orderBy(desc(sourceSnapshots.version))
      .limit(1);

    return row?.version ?? 0;
  }

  async listSnapshotsBySourceId(
    sourceId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const rows = await executor
      .select()
      .from(sourceSnapshots)
      .where(eq(sourceSnapshots.sourceId, sourceId))
      .orderBy(
        desc(sourceSnapshots.version),
        desc(sourceSnapshots.capturedAt),
        desc(sourceSnapshots.createdAt),
      );

    return rows.map(mapSourceSnapshotRow);
  }

  async listSnapshotsBySourceIds(
    sourceIds: string[],
    session?: PersistenceSession,
  ) {
    if (sourceIds.length === 0) {
      return [];
    }

    const executor = this.getExecutor(session);
    const rows = await executor
      .select()
      .from(sourceSnapshots)
      .where(inArray(sourceSnapshots.sourceId, sourceIds))
      .orderBy(
        desc(sourceSnapshots.version),
        desc(sourceSnapshots.capturedAt),
        desc(sourceSnapshots.createdAt),
      );

    return rows.map(mapSourceSnapshotRow);
  }

  async listSourceFilesBySourceId(
    sourceId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const rows = await executor
      .select()
      .from(sourceFiles)
      .where(eq(sourceFiles.sourceId, sourceId))
      .orderBy(
        desc(sourceFiles.capturedAt),
        desc(sourceFiles.createdAt),
        asc(sourceFiles.originalFileName),
      );

    return rows.map(mapSourceFileRow);
  }

  async listProvenanceRecordsBySourceFileId(
    sourceFileId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const rows = await executor
      .select()
      .from(provenanceRecords)
      .where(eq(provenanceRecords.sourceFileId, sourceFileId))
      .orderBy(desc(provenanceRecords.recordedAt), asc(provenanceRecords.id));

    return rows.map(mapProvenanceRecordRow);
  }

  async listSourceIngestRunsBySourceFileId(
    sourceFileId: string,
    session?: PersistenceSession,
  ) {
    const executor = this.getExecutor(session);
    const rows = await executor
      .select()
      .from(sourceIngestRuns)
      .where(eq(sourceIngestRuns.sourceFileId, sourceFileId))
      .orderBy(
        desc(sourceIngestRuns.startedAt),
        desc(sourceIngestRuns.createdAt),
        asc(sourceIngestRuns.id),
      );

    return rows.map(mapSourceIngestRunRow);
  }

  private getExecutor(session?: PersistenceSession) {
    return getDbExecutor(session) ?? this.db;
  }
}
