import { z } from "zod";

export const SourceKindSchema = z.enum([
  "document",
  "spreadsheet",
  "dataset",
  "image",
  "archive",
  "other",
]);

export const SourceOriginKindSchema = z.enum(["manual", "connector"]);

export const SourceSnapshotStorageKindSchema = z.enum([
  "local_path",
  "external_url",
  "object_store",
  "connector_ref",
]);

export const SourceSnapshotIngestStatusSchema = z.enum([
  "registered",
  "queued",
  "processing",
  "ready",
  "failed",
]);

export const SourceChecksumSha256Schema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{64}$/, "Invalid SHA-256 checksum")
  .transform((value) => value.toLowerCase());

export const SourceRecordSchema = z.object({
  id: z.string().uuid(),
  kind: SourceKindSchema,
  originKind: SourceOriginKindSchema,
  name: z.string().min(1),
  description: z.string().nullable(),
  createdBy: z.string().min(1),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const SourceSnapshotRecordSchema = z.object({
  id: z.string().uuid(),
  sourceId: z.string().uuid(),
  version: z.number().int().positive(),
  originalFileName: z.string().min(1),
  mediaType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  checksumSha256: SourceChecksumSha256Schema,
  storageKind: SourceSnapshotStorageKindSchema,
  storageRef: z.string().min(1),
  capturedAt: z.string().datetime({ offset: true }),
  ingestStatus: SourceSnapshotIngestStatusSchema,
  ingestErrorSummary: z.string().nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const CreateSourceSnapshotInputSchema = z.object({
  originalFileName: z.string().trim().min(1),
  mediaType: z.string().trim().min(1),
  sizeBytes: z.number().int().nonnegative(),
  checksumSha256: SourceChecksumSha256Schema,
  storageKind: SourceSnapshotStorageKindSchema,
  storageRef: z.string().trim().min(1),
  capturedAt: z.string().datetime({ offset: true }).optional(),
  ingestStatus: SourceSnapshotIngestStatusSchema.default("registered"),
});

export const CreateSourceInputSchema = z.object({
  kind: SourceKindSchema,
  originKind: SourceOriginKindSchema.default("manual"),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1).nullable().optional(),
  createdBy: z.string().trim().min(1).default("operator"),
  snapshot: CreateSourceSnapshotInputSchema,
});

export const ProvenanceRecordKindSchema = z.enum(["source_file_registered"]);

export const SourceFileRecordSchema = z.object({
  id: z.string().uuid(),
  sourceId: z.string().uuid(),
  sourceSnapshotId: z.string().uuid(),
  originalFileName: z.string().min(1),
  mediaType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  checksumSha256: SourceChecksumSha256Schema,
  storageKind: SourceSnapshotStorageKindSchema,
  storageRef: z.string().min(1),
  createdBy: z.string().min(1),
  capturedAt: z.string().datetime({ offset: true }),
  createdAt: z.string().datetime({ offset: true }),
});

export const ProvenanceRecordSchema = z.object({
  id: z.string().uuid(),
  sourceId: z.string().uuid(),
  sourceSnapshotId: z.string().uuid(),
  sourceFileId: z.string().uuid(),
  kind: ProvenanceRecordKindSchema,
  recordedBy: z.string().min(1),
  recordedAt: z.string().datetime({ offset: true }),
});

export const RegisterSourceFileMetadataSchema = z.object({
  originalFileName: z.string().trim().min(1),
  mediaType: z.string().trim().min(1),
  createdBy: z.string().trim().min(1).default("operator"),
  capturedAt: z.string().datetime({ offset: true }).optional(),
});

export const SourceParserKeySchema = z.enum([
  "csv_tabular",
  "markdown_text",
  "zip_inventory",
  "metadata_fallback",
]);

export const SourceParserSelectionMatchSchema = z.enum([
  "media_type",
  "file_extension",
  "source_kind",
  "fallback",
]);

export const SourceParserSelectionSchema = z.object({
  parserKey: SourceParserKeySchema,
  matchedBy: SourceParserSelectionMatchSchema,
  mediaType: z.string().min(1),
  fileExtension: z.string().min(1).nullable(),
  sourceKind: SourceKindSchema,
});

export const SourceIngestRunStatusSchema = z.enum([
  "queued",
  "processing",
  "ready",
  "failed",
]);

export const SourceIngestMessageSchema = z.object({
  code: z.string().trim().min(1),
  message: z.string().trim().min(1),
});

export const SourceIngestCsvReceiptSummarySchema = z.object({
  kind: z.literal("csv_tabular"),
  columnCount: z.number().int().nonnegative(),
  header: z.array(z.string()).nullable(),
  rowCount: z.number().int().nonnegative(),
  sampleRows: z.array(z.array(z.string())),
});

export const SourceIngestHeadingPreviewSchema = z.object({
  depth: z.number().int().min(1).max(6),
  text: z.string().min(1),
});

export const SourceIngestMarkdownReceiptSummarySchema = z.object({
  kind: z.literal("markdown_text"),
  characterCount: z.number().int().nonnegative(),
  excerpt: z.string(),
  headingCount: z.number().int().nonnegative(),
  headingPreview: z.array(SourceIngestHeadingPreviewSchema),
  lineCount: z.number().int().nonnegative(),
});

export const SourceIngestZipEntrySchema = z.object({
  compressedSizeBytes: z.number().int().nonnegative(),
  isDirectory: z.boolean(),
  path: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
});

export const SourceIngestZipReceiptSummarySchema = z.object({
  kind: z.literal("zip_inventory"),
  entries: z.array(SourceIngestZipEntrySchema),
  entryCount: z.number().int().nonnegative(),
  totalCompressedSizeBytes: z.number().int().nonnegative(),
  totalSizeBytes: z.number().int().nonnegative(),
});

export const SourceIngestMetadataFallbackReceiptSummarySchema = z.object({
  kind: z.literal("metadata_fallback"),
  note: z.string().min(1),
});

export const SourceIngestReceiptSummarySchema = z.discriminatedUnion("kind", [
  SourceIngestCsvReceiptSummarySchema,
  SourceIngestMarkdownReceiptSummarySchema,
  SourceIngestZipReceiptSummarySchema,
  SourceIngestMetadataFallbackReceiptSummarySchema,
]);

export const SourceIngestRunRecordSchema = z.object({
  id: z.string().uuid(),
  sourceId: z.string().uuid(),
  sourceSnapshotId: z.string().uuid(),
  sourceFileId: z.string().uuid(),
  parserSelection: SourceParserSelectionSchema,
  inputChecksumSha256: SourceChecksumSha256Schema,
  storageKind: SourceSnapshotStorageKindSchema,
  storageRef: z.string().min(1),
  status: SourceIngestRunStatusSchema,
  warnings: z.array(SourceIngestMessageSchema),
  errors: z.array(SourceIngestMessageSchema),
  receiptSummary: SourceIngestReceiptSummarySchema.nullable(),
  startedAt: z.string().datetime({ offset: true }),
  completedAt: z.string().datetime({ offset: true }).nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const SourceIngestRunSummarySchema = SourceIngestRunRecordSchema.extend({
  errorCount: z.number().int().nonnegative(),
  warningCount: z.number().int().nonnegative(),
});

export const SourceIngestRunListViewSchema = z.object({
  ingestRuns: z.array(SourceIngestRunSummarySchema),
  runCount: z.number().int().nonnegative(),
  sourceFileId: z.string().uuid(),
});

export const SourceIngestRunDetailViewSchema = z.object({
  ingestRun: SourceIngestRunSummarySchema,
});

export const SourceSummarySchema = SourceRecordSchema.extend({
  latestSnapshot: SourceSnapshotRecordSchema.nullable(),
  snapshotCount: z.number().int().nonnegative(),
});

export const SourceListViewSchema = z.object({
  limit: z.number().int().positive(),
  sourceCount: z.number().int().nonnegative(),
  sources: z.array(SourceSummarySchema),
});

export const SourceDetailViewSchema = z.object({
  source: SourceRecordSchema,
  snapshots: z.array(SourceSnapshotRecordSchema),
});

export const SourceFileSummarySchema = SourceFileRecordSchema.extend({
  snapshotVersion: z.number().int().positive(),
});

export const SourceFileListViewSchema = z.object({
  sourceId: z.string().uuid(),
  fileCount: z.number().int().nonnegative(),
  files: z.array(SourceFileSummarySchema),
});

export const SourceFileDetailViewSchema = z.object({
  sourceFile: SourceFileRecordSchema,
  snapshot: SourceSnapshotRecordSchema,
  provenanceRecords: z.array(ProvenanceRecordSchema),
});

export type SourceKind = z.infer<typeof SourceKindSchema>;
export type SourceOriginKind = z.infer<typeof SourceOriginKindSchema>;
export type SourceSnapshotStorageKind = z.infer<
  typeof SourceSnapshotStorageKindSchema
>;
export type SourceSnapshotIngestStatus = z.infer<
  typeof SourceSnapshotIngestStatusSchema
>;
export type SourceRecord = z.infer<typeof SourceRecordSchema>;
export type SourceSnapshotRecord = z.infer<typeof SourceSnapshotRecordSchema>;
export type CreateSourceInput = z.infer<typeof CreateSourceInputSchema>;
export type CreateSourceSnapshotInput = z.infer<
  typeof CreateSourceSnapshotInputSchema
>;
export type ProvenanceRecordKind = z.infer<typeof ProvenanceRecordKindSchema>;
export type SourceFileRecord = z.infer<typeof SourceFileRecordSchema>;
export type ProvenanceRecord = z.infer<typeof ProvenanceRecordSchema>;
export type RegisterSourceFileMetadata = z.infer<
  typeof RegisterSourceFileMetadataSchema
>;
export type SourceParserKey = z.infer<typeof SourceParserKeySchema>;
export type SourceParserSelectionMatch = z.infer<
  typeof SourceParserSelectionMatchSchema
>;
export type SourceParserSelection = z.infer<typeof SourceParserSelectionSchema>;
export type SourceIngestRunStatus = z.infer<typeof SourceIngestRunStatusSchema>;
export type SourceIngestMessage = z.infer<typeof SourceIngestMessageSchema>;
export type SourceIngestCsvReceiptSummary = z.infer<
  typeof SourceIngestCsvReceiptSummarySchema
>;
export type SourceIngestHeadingPreview = z.infer<
  typeof SourceIngestHeadingPreviewSchema
>;
export type SourceIngestMarkdownReceiptSummary = z.infer<
  typeof SourceIngestMarkdownReceiptSummarySchema
>;
export type SourceIngestZipEntry = z.infer<typeof SourceIngestZipEntrySchema>;
export type SourceIngestZipReceiptSummary = z.infer<
  typeof SourceIngestZipReceiptSummarySchema
>;
export type SourceIngestMetadataFallbackReceiptSummary = z.infer<
  typeof SourceIngestMetadataFallbackReceiptSummarySchema
>;
export type SourceIngestReceiptSummary = z.infer<
  typeof SourceIngestReceiptSummarySchema
>;
export type SourceIngestRunRecord = z.infer<typeof SourceIngestRunRecordSchema>;
export type SourceIngestRunSummary = z.infer<
  typeof SourceIngestRunSummarySchema
>;
export type SourceIngestRunListView = z.infer<
  typeof SourceIngestRunListViewSchema
>;
export type SourceIngestRunDetailView = z.infer<
  typeof SourceIngestRunDetailViewSchema
>;
export type SourceSummary = z.infer<typeof SourceSummarySchema>;
export type SourceListView = z.infer<typeof SourceListViewSchema>;
export type SourceDetailView = z.infer<typeof SourceDetailViewSchema>;
export type SourceFileSummary = z.infer<typeof SourceFileSummarySchema>;
export type SourceFileListView = z.infer<typeof SourceFileListViewSchema>;
export type SourceFileDetailView = z.infer<typeof SourceFileDetailViewSchema>;
