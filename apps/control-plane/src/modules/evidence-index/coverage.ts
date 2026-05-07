import {
  SourceCoverageMatrixSchema,
  type DocumentMap,
  type EvidenceIndexExtractionMethod,
  type EvidenceIndexSourceDocument,
  type SourceCoverageMatrix,
} from "@pocket-cto/domain";
import { buildDefaultCapabilityBoundaries } from "./limitations";

const FOUNDATION_UNSUPPORTED_METHODS: EvidenceIndexExtractionMethod[] = [
  "unsupported_pdf",
  "unsupported_scan",
  "unsupported_image_only",
  "unsupported_table",
  "unsupported_figure",
  "unsupported_graphics",
  "unsupported_ambiguous_layout",
  "unsupported_vector_only",
  "unsupported_ocr_only",
  "unsupported_pageindex",
  "unsupported_llm",
];

export function buildSourceCoverageMatrix(input: {
  companyKey: string;
  generatedAt: string;
  documentMaps: DocumentMap[];
  additionalDocuments?: EvidenceIndexSourceDocument[];
}): SourceCoverageMatrix {
  const entries = [
    ...input.documentMaps.map((map) =>
      buildEntry(map.sourceDocument, map.coverageStatus, map.extractionMethod),
    ),
    ...(input.additionalDocuments ?? []).map((document) =>
      buildEntry(
        document,
        document.lifecycleStatus === "failed" ? "failed" : "not_indexed",
      ),
    ),
  ];

  return SourceCoverageMatrixSchema.parse({
    capabilityBoundaries: buildDefaultCapabilityBoundaries(),
    companyKey: input.companyKey,
    entries,
    generatedAt: input.generatedAt,
  });
}

function buildEntry(
  document: EvidenceIndexSourceDocument,
  coverageStatus: DocumentMap["coverageStatus"],
  extractionMethod?: EvidenceIndexExtractionMethod,
) {
  const supportedMethods =
    coverageStatus === "supported" || coverageStatus === "stale"
      ? dedupeMethods([
          "source_metadata",
          "cfo_wiki_document_extract",
          extractionMethod ?? document.extractionMethod,
        ])
      : [];
  const unsupportedMethods =
    coverageStatus === "supported" || coverageStatus === "stale"
      ? FOUNDATION_UNSUPPORTED_METHODS
      : dedupeMethods([
          document.extractionMethod,
          ...FOUNDATION_UNSUPPORTED_METHODS,
        ]);

  return {
    coverageStatus,
    documentRole: document.documentRole,
    freshness: document.freshness,
    limitations: document.limitations,
    mediaType: document.mediaType,
    sourceFileId: document.sourceFileId,
    sourceId: document.sourceId,
    sourceKind: document.sourceKind,
    sourceSnapshotId: document.sourceSnapshotId,
    supportedMethods,
    unsupportedMethods,
  };
}

function dedupeMethods(methods: EvidenceIndexExtractionMethod[]) {
  return [...new Set(methods)];
}
