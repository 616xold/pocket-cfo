import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./shared";

export const sourceKindEnum = pgEnum("source_kind", [
  "document",
  "spreadsheet",
  "dataset",
  "image",
  "archive",
  "other",
]);

export const sourceOriginKindEnum = pgEnum("source_origin_kind", [
  "manual",
  "connector",
]);

export const sourceSnapshotStorageKindEnum = pgEnum(
  "source_snapshot_storage_kind",
  ["local_path", "external_url", "object_store", "connector_ref"],
);

export const sourceSnapshotIngestStatusEnum = pgEnum(
  "source_snapshot_ingest_status",
  ["registered", "queued", "processing", "ready", "failed"],
);

export const provenanceRecordKindEnum = pgEnum("provenance_record_kind", [
  "source_file_registered",
]);

export const sourceParserKeyEnum = pgEnum("source_parser_key", [
  "csv_tabular",
  "markdown_text",
  "zip_inventory",
  "metadata_fallback",
]);

export const sourceIngestRunStatusEnum = pgEnum("source_ingest_run_status", [
  "queued",
  "processing",
  "ready",
  "failed",
]);

export const sources = pgTable(
  "sources",
  {
    id: id(),
    kind: sourceKindEnum("kind").notNull(),
    originKind: sourceOriginKindEnum("origin_kind").notNull().default("manual"),
    name: text("name").notNull(),
    description: text("description"),
    createdBy: text("created_by").notNull().default("operator"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    kindUpdatedAtIndex: index("sources_kind_updated_at_idx").on(
      table.kind,
      table.updatedAt,
    ),
  }),
);

export const sourceSnapshots = pgTable(
  "source_snapshots",
  {
    id: id(),
    sourceId: uuid("source_id")
      .references(() => sources.id, { onDelete: "cascade" })
      .notNull(),
    version: integer("version").notNull(),
    originalFileName: text("original_file_name").notNull(),
    mediaType: text("media_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    checksumSha256: text("checksum_sha256").notNull(),
    storageKind: sourceSnapshotStorageKindEnum("storage_kind").notNull(),
    storageRef: text("storage_ref").notNull(),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull(),
    ingestStatus: sourceSnapshotIngestStatusEnum("ingest_status")
      .notNull()
      .default("registered"),
    ingestErrorSummary: text("ingest_error_summary"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    sourceVersionUnique: uniqueIndex("source_snapshots_source_version_key").on(
      table.sourceId,
      table.version,
    ),
    sourceSnapshotLookupIndex: index("source_snapshots_source_id_idx").on(
      table.sourceId,
    ),
  }),
);

export const sourceFiles = pgTable(
  "source_files",
  {
    id: id(),
    sourceId: uuid("source_id")
      .references(() => sources.id, { onDelete: "cascade" })
      .notNull(),
    sourceSnapshotId: uuid("source_snapshot_id")
      .references(() => sourceSnapshots.id, { onDelete: "cascade" })
      .notNull(),
    originalFileName: text("original_file_name").notNull(),
    mediaType: text("media_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    checksumSha256: text("checksum_sha256").notNull(),
    storageKind: sourceSnapshotStorageKindEnum("storage_kind").notNull(),
    storageRef: text("storage_ref").notNull(),
    createdBy: text("created_by").notNull().default("operator"),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull(),
    createdAt: createdAt(),
  },
  (table) => ({
    sourceFilesSourceIndex: index("source_files_source_id_idx").on(table.sourceId),
    sourceFilesSnapshotUnique: uniqueIndex(
      "source_files_source_snapshot_id_key",
    ).on(table.sourceSnapshotId),
  }),
);

export const provenanceRecords = pgTable(
  "provenance_records",
  {
    id: id(),
    sourceId: uuid("source_id")
      .references(() => sources.id, { onDelete: "cascade" })
      .notNull(),
    sourceSnapshotId: uuid("source_snapshot_id")
      .references(() => sourceSnapshots.id, { onDelete: "cascade" })
      .notNull(),
    sourceFileId: uuid("source_file_id")
      .references(() => sourceFiles.id, { onDelete: "cascade" })
      .notNull(),
    kind: provenanceRecordKindEnum("kind")
      .notNull()
      .default("source_file_registered"),
    recordedBy: text("recorded_by").notNull().default("operator"),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    provenanceSourceFileIndex: index("provenance_records_source_file_id_idx").on(
      table.sourceFileId,
    ),
    provenanceSourceIndex: index("provenance_records_source_id_idx").on(
      table.sourceId,
    ),
  }),
);

export const sourceIngestRuns = pgTable(
  "source_ingest_runs",
  {
    id: id(),
    sourceId: uuid("source_id")
      .references(() => sources.id, { onDelete: "cascade" })
      .notNull(),
    sourceSnapshotId: uuid("source_snapshot_id")
      .references(() => sourceSnapshots.id, { onDelete: "cascade" })
      .notNull(),
    sourceFileId: uuid("source_file_id")
      .references(() => sourceFiles.id, { onDelete: "cascade" })
      .notNull(),
    parserKey: sourceParserKeyEnum("parser_key").notNull(),
    parserSelection: jsonb("parser_selection")
      .$type<{
        fileExtension: string | null;
        matchedBy: "media_type" | "file_extension" | "source_kind" | "fallback";
        mediaType: string;
        parserKey:
          | "csv_tabular"
          | "markdown_text"
          | "zip_inventory"
          | "metadata_fallback";
        sourceKind:
          | "document"
          | "spreadsheet"
          | "dataset"
          | "image"
          | "archive"
          | "other";
      }>()
      .notNull(),
    inputChecksumSha256: text("input_checksum_sha256").notNull(),
    storageKind: sourceSnapshotStorageKindEnum("storage_kind").notNull(),
    storageRef: text("storage_ref").notNull(),
    status: sourceIngestRunStatusEnum("status").notNull().default("queued"),
    warnings: jsonb("warnings")
      .$type<Array<{ code: string; message: string }>>()
      .notNull()
      .default([]),
    errors: jsonb("errors")
      .$type<Array<{ code: string; message: string }>>()
      .notNull()
      .default([]),
    receiptSummary: jsonb("receipt_summary").$type<Record<string, unknown> | null>(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    sourceIngestRunsFileIndex: index("source_ingest_runs_source_file_id_idx").on(
      table.sourceFileId,
      table.createdAt,
    ),
    sourceIngestRunsSourceIndex: index("source_ingest_runs_source_id_idx").on(
      table.sourceId,
      table.createdAt,
    ),
  }),
);
