import type {
  ProvenanceRecord,
  ProvenanceRecordKind,
  SourceFileRecord,
  SourceIngestMessage,
  SourceIngestReceiptSummary,
  SourceIngestRunRecord,
  SourceIngestRunStatus,
  SourceKind,
  SourceOriginKind,
  SourceParserSelection,
  SourceRecord,
  SourceSnapshotIngestStatus,
  SourceSnapshotRecord,
  SourceSnapshotStorageKind,
} from "@pocket-cto/domain";
import {
  createMemorySession,
  type PersistenceSession,
  type TransactionalRepository,
} from "../../lib/persistence";

export type CreateSourceRecordInput = {
  kind: SourceKind;
  originKind: SourceOriginKind;
  name: string;
  description: string | null;
  createdBy: string;
};

export type CreateSourceSnapshotRecordInput = {
  sourceId: string;
  version: number;
  originalFileName: string;
  mediaType: string;
  sizeBytes: number;
  checksumSha256: string;
  storageKind: SourceSnapshotStorageKind;
  storageRef: string;
  capturedAt: string;
  ingestStatus: SourceSnapshotIngestStatus;
  ingestErrorSummary?: string | null;
};

export type CreateSourceFileRecordInput = {
  sourceId: string;
  sourceSnapshotId: string;
  originalFileName: string;
  mediaType: string;
  sizeBytes: number;
  checksumSha256: string;
  storageKind: SourceSnapshotStorageKind;
  storageRef: string;
  createdBy: string;
  capturedAt: string;
};

export type CreateProvenanceRecordInput = {
  sourceId: string;
  sourceSnapshotId: string;
  sourceFileId: string;
  kind: ProvenanceRecordKind;
  recordedBy: string;
  recordedAt: string;
};

export type CreateSourceIngestRunRecordInput = {
  sourceId: string;
  sourceSnapshotId: string;
  sourceFileId: string;
  parserSelection: SourceParserSelection;
  inputChecksumSha256: string;
  storageKind: SourceSnapshotStorageKind;
  storageRef: string;
  status: SourceIngestRunStatus;
  warnings: SourceIngestMessage[];
  errors: SourceIngestMessage[];
  receiptSummary: SourceIngestReceiptSummary | null;
  startedAt: string;
  completedAt?: string | null;
};

export type UpdateSourceIngestRunRecordInput = {
  ingestRunId: string;
  status: SourceIngestRunStatus;
  warnings: SourceIngestMessage[];
  errors: SourceIngestMessage[];
  receiptSummary: SourceIngestReceiptSummary | null;
  completedAt?: string | null;
};

export type UpdateSnapshotIngestStateInput = {
  snapshotId: string;
  ingestStatus: SourceSnapshotIngestStatus;
  ingestErrorSummary?: string | null;
};

export interface SourceRepository extends TransactionalRepository {
  createSource(
    input: CreateSourceRecordInput,
    session?: PersistenceSession,
  ): Promise<SourceRecord>;

  createSnapshot(
    input: CreateSourceSnapshotRecordInput,
    session?: PersistenceSession,
  ): Promise<SourceSnapshotRecord>;

  createSourceFile(
    input: CreateSourceFileRecordInput,
    session?: PersistenceSession,
  ): Promise<SourceFileRecord>;

  createProvenanceRecord(
    input: CreateProvenanceRecordInput,
    session?: PersistenceSession,
  ): Promise<ProvenanceRecord>;

  createSourceIngestRun(
    input: CreateSourceIngestRunRecordInput,
    session?: PersistenceSession,
  ): Promise<SourceIngestRunRecord>;

  updateSourceIngestRun(
    input: UpdateSourceIngestRunRecordInput,
    session?: PersistenceSession,
  ): Promise<SourceIngestRunRecord>;

  updateSnapshotIngestState(
    input: UpdateSnapshotIngestStateInput,
    session?: PersistenceSession,
  ): Promise<SourceSnapshotRecord>;

  getSourceById(
    sourceId: string,
    session?: PersistenceSession,
  ): Promise<SourceRecord | null>;

  getSnapshotById(
    snapshotId: string,
    session?: PersistenceSession,
  ): Promise<SourceSnapshotRecord | null>;

  getSourceFileById(
    sourceFileId: string,
    session?: PersistenceSession,
  ): Promise<SourceFileRecord | null>;

  getSourceIngestRunById(
    ingestRunId: string,
    session?: PersistenceSession,
  ): Promise<SourceIngestRunRecord | null>;

  listSources(
    input: { limit: number },
    session?: PersistenceSession,
  ): Promise<SourceRecord[]>;

  getLatestSnapshotVersion(
    sourceId: string,
    session?: PersistenceSession,
  ): Promise<number>;

  listSnapshotsBySourceId(
    sourceId: string,
    session?: PersistenceSession,
  ): Promise<SourceSnapshotRecord[]>;

  listSnapshotsBySourceIds(
    sourceIds: string[],
    session?: PersistenceSession,
  ): Promise<SourceSnapshotRecord[]>;

  listSourceFilesBySourceId(
    sourceId: string,
    session?: PersistenceSession,
  ): Promise<SourceFileRecord[]>;

  listProvenanceRecordsBySourceFileId(
    sourceFileId: string,
    session?: PersistenceSession,
  ): Promise<ProvenanceRecord[]>;

  listSourceIngestRunsBySourceFileId(
    sourceFileId: string,
    session?: PersistenceSession,
  ): Promise<SourceIngestRunRecord[]>;
}

export class InMemorySourceRepository implements SourceRepository {
  private readonly sources = new Map<string, SourceRecord>();
  private readonly snapshots = new Map<string, SourceSnapshotRecord>();
  private readonly sourceFiles = new Map<string, SourceFileRecord>();
  private readonly provenanceRecords = new Map<string, ProvenanceRecord>();
  private readonly ingestRuns = new Map<string, SourceIngestRunRecord>();

  async transaction<T>(
    operation: (session: PersistenceSession) => Promise<T>,
  ): Promise<T> {
    return operation(createMemorySession());
  }

  async createSource(input: CreateSourceRecordInput): Promise<SourceRecord> {
    const now = new Date().toISOString();
    const source: SourceRecord = {
      id: crypto.randomUUID(),
      kind: input.kind,
      originKind: input.originKind,
      name: input.name,
      description: input.description,
      createdBy: input.createdBy,
      createdAt: now,
      updatedAt: now,
    };

    this.sources.set(source.id, source);
    return source;
  }

  async createSnapshot(
    input: CreateSourceSnapshotRecordInput,
  ): Promise<SourceSnapshotRecord> {
    const now = new Date().toISOString();
    const snapshot: SourceSnapshotRecord = {
      id: crypto.randomUUID(),
      sourceId: input.sourceId,
      version: input.version,
      originalFileName: input.originalFileName,
      mediaType: input.mediaType,
      sizeBytes: input.sizeBytes,
      checksumSha256: input.checksumSha256,
      storageKind: input.storageKind,
      storageRef: input.storageRef,
      capturedAt: input.capturedAt,
      ingestStatus: input.ingestStatus,
      ingestErrorSummary: input.ingestErrorSummary ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.snapshots.set(snapshot.id, snapshot);
    const source = this.sources.get(input.sourceId);

    if (source) {
      this.sources.set(source.id, {
        ...source,
        updatedAt: now,
      });
    }

    return snapshot;
  }

  async createSourceFile(
    input: CreateSourceFileRecordInput,
  ): Promise<SourceFileRecord> {
    const now = new Date().toISOString();
    const sourceFile: SourceFileRecord = {
      id: crypto.randomUUID(),
      sourceId: input.sourceId,
      sourceSnapshotId: input.sourceSnapshotId,
      originalFileName: input.originalFileName,
      mediaType: input.mediaType,
      sizeBytes: input.sizeBytes,
      checksumSha256: input.checksumSha256,
      storageKind: input.storageKind,
      storageRef: input.storageRef,
      createdBy: input.createdBy,
      capturedAt: input.capturedAt,
      createdAt: now,
    };

    this.sourceFiles.set(sourceFile.id, sourceFile);
    return sourceFile;
  }

  async createProvenanceRecord(
    input: CreateProvenanceRecordInput,
  ): Promise<ProvenanceRecord> {
    const provenanceRecord: ProvenanceRecord = {
      id: crypto.randomUUID(),
      sourceId: input.sourceId,
      sourceSnapshotId: input.sourceSnapshotId,
      sourceFileId: input.sourceFileId,
      kind: input.kind,
      recordedBy: input.recordedBy,
      recordedAt: input.recordedAt,
    };

    this.provenanceRecords.set(provenanceRecord.id, provenanceRecord);
    return provenanceRecord;
  }

  async createSourceIngestRun(
    input: CreateSourceIngestRunRecordInput,
  ): Promise<SourceIngestRunRecord> {
    const now = new Date().toISOString();
    const ingestRun: SourceIngestRunRecord = {
      id: crypto.randomUUID(),
      sourceId: input.sourceId,
      sourceSnapshotId: input.sourceSnapshotId,
      sourceFileId: input.sourceFileId,
      parserSelection: input.parserSelection,
      inputChecksumSha256: input.inputChecksumSha256,
      storageKind: input.storageKind,
      storageRef: input.storageRef,
      status: input.status,
      warnings: [...input.warnings],
      errors: [...input.errors],
      receiptSummary: input.receiptSummary,
      startedAt: input.startedAt,
      completedAt: input.completedAt ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.ingestRuns.set(ingestRun.id, ingestRun);
    return ingestRun;
  }

  async updateSourceIngestRun(
    input: UpdateSourceIngestRunRecordInput,
  ): Promise<SourceIngestRunRecord> {
    const existing = this.ingestRuns.get(input.ingestRunId);

    if (!existing) {
      throw new Error(`Source ingest run ${input.ingestRunId} was not found`);
    }

    const updated: SourceIngestRunRecord = {
      ...existing,
      status: input.status,
      warnings: [...input.warnings],
      errors: [...input.errors],
      receiptSummary: input.receiptSummary,
      completedAt: input.completedAt ?? existing.completedAt,
      updatedAt: new Date().toISOString(),
    };

    this.ingestRuns.set(updated.id, updated);
    return updated;
  }

  async updateSnapshotIngestState(
    input: UpdateSnapshotIngestStateInput,
  ): Promise<SourceSnapshotRecord> {
    const existing = this.snapshots.get(input.snapshotId);

    if (!existing) {
      throw new Error(`Source snapshot ${input.snapshotId} was not found`);
    }

    const now = new Date().toISOString();
    const updated: SourceSnapshotRecord = {
      ...existing,
      ingestStatus: input.ingestStatus,
      ingestErrorSummary: input.ingestErrorSummary ?? null,
      updatedAt: now,
    };

    this.snapshots.set(updated.id, updated);
    const source = this.sources.get(updated.sourceId);

    if (source) {
      this.sources.set(source.id, {
        ...source,
        updatedAt: now,
      });
    }

    return updated;
  }

  async getSourceById(sourceId: string): Promise<SourceRecord | null> {
    return this.sources.get(sourceId) ?? null;
  }

  async getSnapshotById(snapshotId: string): Promise<SourceSnapshotRecord | null> {
    return this.snapshots.get(snapshotId) ?? null;
  }

  async getSourceFileById(sourceFileId: string): Promise<SourceFileRecord | null> {
    return this.sourceFiles.get(sourceFileId) ?? null;
  }

  async getSourceIngestRunById(
    ingestRunId: string,
  ): Promise<SourceIngestRunRecord | null> {
    return this.ingestRuns.get(ingestRunId) ?? null;
  }

  async listSources(input: { limit: number }): Promise<SourceRecord[]> {
    return [...this.sources.values()]
      .sort(sortSources)
      .slice(0, input.limit);
  }

  async getLatestSnapshotVersion(sourceId: string): Promise<number> {
    return (
      (await this.listSnapshotsBySourceId(sourceId))[0]?.version ?? 0
    );
  }

  async listSnapshotsBySourceId(
    sourceId: string,
  ): Promise<SourceSnapshotRecord[]> {
    return [...this.snapshots.values()]
      .filter((snapshot) => snapshot.sourceId === sourceId)
      .sort(sortSnapshots);
  }

  async listSnapshotsBySourceIds(
    sourceIds: string[],
  ): Promise<SourceSnapshotRecord[]> {
    if (sourceIds.length === 0) {
      return [];
    }

    const sourceIdSet = new Set(sourceIds);

    return [...this.snapshots.values()]
      .filter((snapshot) => sourceIdSet.has(snapshot.sourceId))
      .sort(sortSnapshots);
  }

  async listSourceFilesBySourceId(sourceId: string): Promise<SourceFileRecord[]> {
    return [...this.sourceFiles.values()]
      .filter((sourceFile) => sourceFile.sourceId === sourceId)
      .sort(sortSourceFiles);
  }

  async listProvenanceRecordsBySourceFileId(
    sourceFileId: string,
  ): Promise<ProvenanceRecord[]> {
    return [...this.provenanceRecords.values()]
      .filter((record) => record.sourceFileId === sourceFileId)
      .sort(sortProvenanceRecords);
  }

  async listSourceIngestRunsBySourceFileId(
    sourceFileId: string,
  ): Promise<SourceIngestRunRecord[]> {
    return [...this.ingestRuns.values()]
      .filter((run) => run.sourceFileId === sourceFileId)
      .sort(sortSourceIngestRuns);
  }
}

function sortSources(left: SourceRecord, right: SourceRecord) {
  return (
    right.updatedAt.localeCompare(left.updatedAt) ||
    right.createdAt.localeCompare(left.createdAt) ||
    left.name.localeCompare(right.name)
  );
}

function sortSnapshots(
  left: SourceSnapshotRecord,
  right: SourceSnapshotRecord,
) {
  return (
    right.version - left.version ||
    right.capturedAt.localeCompare(left.capturedAt) ||
    right.createdAt.localeCompare(left.createdAt)
  );
}

function sortSourceFiles(left: SourceFileRecord, right: SourceFileRecord) {
  return (
    right.capturedAt.localeCompare(left.capturedAt) ||
    right.createdAt.localeCompare(left.createdAt) ||
    left.originalFileName.localeCompare(right.originalFileName)
  );
}

function sortProvenanceRecords(left: ProvenanceRecord, right: ProvenanceRecord) {
  return (
    right.recordedAt.localeCompare(left.recordedAt) ||
    left.id.localeCompare(right.id)
  );
}

function sortSourceIngestRuns(
  left: SourceIngestRunRecord,
  right: SourceIngestRunRecord,
) {
  return (
    right.startedAt.localeCompare(left.startedAt) ||
    right.createdAt.localeCompare(left.createdAt) ||
    left.id.localeCompare(right.id)
  );
}
