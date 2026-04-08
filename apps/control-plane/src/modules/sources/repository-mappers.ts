import type {
  provenanceRecords,
  sourceFiles,
  sourceIngestRuns,
  sourceSnapshots,
  sources,
} from "@pocket-cto/db";
import type {
  ProvenanceRecord,
  SourceFileRecord,
  SourceIngestRunRecord,
  SourceRecord,
  SourceSnapshotRecord,
} from "@pocket-cto/domain";

type SourceRow = typeof sources.$inferSelect;
type SourceSnapshotRow = typeof sourceSnapshots.$inferSelect;
type SourceFileRow = typeof sourceFiles.$inferSelect;
type ProvenanceRecordRow = typeof provenanceRecords.$inferSelect;
type SourceIngestRunRow = typeof sourceIngestRuns.$inferSelect;

export function mapSourceRow(row: SourceRow): SourceRecord {
  return {
    id: row.id,
    kind: row.kind,
    originKind: row.originKind,
    name: row.name,
    description: row.description,
    createdBy: row.createdBy,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapSourceSnapshotRow(
  row: SourceSnapshotRow,
): SourceSnapshotRecord {
  return {
    id: row.id,
    sourceId: row.sourceId,
    version: row.version,
    originalFileName: row.originalFileName,
    mediaType: row.mediaType,
    sizeBytes: row.sizeBytes,
    checksumSha256: row.checksumSha256,
    storageKind: row.storageKind,
    storageRef: row.storageRef,
    capturedAt: row.capturedAt.toISOString(),
    ingestStatus: row.ingestStatus,
    ingestErrorSummary: row.ingestErrorSummary,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapSourceFileRow(row: SourceFileRow): SourceFileRecord {
  return {
    id: row.id,
    sourceId: row.sourceId,
    sourceSnapshotId: row.sourceSnapshotId,
    originalFileName: row.originalFileName,
    mediaType: row.mediaType,
    sizeBytes: row.sizeBytes,
    checksumSha256: row.checksumSha256,
    storageKind: row.storageKind,
    storageRef: row.storageRef,
    createdBy: row.createdBy,
    capturedAt: row.capturedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

export function mapProvenanceRecordRow(
  row: ProvenanceRecordRow,
): ProvenanceRecord {
  return {
    id: row.id,
    sourceId: row.sourceId,
    sourceSnapshotId: row.sourceSnapshotId,
    sourceFileId: row.sourceFileId,
    kind: row.kind,
    recordedBy: row.recordedBy,
    recordedAt: row.recordedAt.toISOString(),
  };
}

export function mapSourceIngestRunRow(
  row: SourceIngestRunRow,
): SourceIngestRunRecord {
  return {
    id: row.id,
    sourceId: row.sourceId,
    sourceSnapshotId: row.sourceSnapshotId,
    sourceFileId: row.sourceFileId,
    parserSelection: row.parserSelection,
    inputChecksumSha256: row.inputChecksumSha256,
    storageKind: row.storageKind,
    storageRef: row.storageRef,
    status: row.status,
    warnings: row.warnings,
    errors: row.errors,
    receiptSummary: row.receiptSummary as SourceIngestRunRecord["receiptSummary"],
    startedAt: row.startedAt.toISOString(),
    completedAt: row.completedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
