import type {
  CfoWikiDocumentExtractRecord,
  EvidenceIndexCoverageStatus,
  EvidenceIndexExtractionMethod,
  EvidenceIndexFreshnessPosture,
  EvidenceIndexLimitationPosture,
  EvidenceIndexSourceDocument,
  SourceAnchor,
} from "@pocket-cto/domain";
import { buildLimitation } from "./limitations";
import { buildSourceLimitations } from "./source-limitations";
import type {
  EvidenceIndexAdditionalCoverageInput,
  EvidenceIndexBoundSourceInput,
} from "./types";

export type SourceDocumentBuild = EvidenceIndexSourceDocument & {
  coverageStatus: EvidenceIndexCoverageStatus;
};

export function buildSourceDocument(input: {
  companyKey: string;
  generatedAt: string;
  source: EvidenceIndexBoundSourceInput;
}): SourceDocumentBuild {
  const source = input.source;
  const freshness =
    source.freshnessOverride ??
    buildFreshness({
      checkedAt: input.generatedAt,
      extractedAt: source.latestExtract?.extractedAt ?? null,
      sourceCapturedAt: source.latestSnapshot?.capturedAt ?? null,
      state: freshnessStateFor(source),
      summary: freshnessSummaryFor(source),
    });
  const extractionMethod = extractionMethodFor(source);
  const coverageStatus = coverageStatusFor(source, freshness);

  return {
    capturedAt: source.latestSnapshot?.capturedAt ?? null,
    checksumSha256: source.latestSnapshot?.checksumSha256 ?? null,
    companyKey: input.companyKey,
    coverageStatus,
    documentRole: source.binding.documentRole,
    extractionMethod,
    freshness,
    id: documentId(
      input.companyKey,
      source.source.id,
      source.latestSnapshot?.id,
    ),
    lifecycleStatus: lifecycleFor(source),
    limitations: buildSourceLimitations(source, extractionMethod),
    mediaType:
      source.latestSnapshot?.mediaType ??
      source.latestSourceFile?.mediaType ??
      null,
    sourceFileId:
      source.latestSourceFile?.id ?? source.latestExtract?.sourceFileId ?? null,
    sourceId: source.source.id,
    sourceKind: source.source.kind,
    sourceSnapshotId: source.latestSnapshot?.id ?? null,
    storageKind:
      source.latestSnapshot?.storageKind ??
      source.latestSourceFile?.storageKind ??
      null,
    storageRef:
      source.latestSnapshot?.storageRef ??
      source.latestSourceFile?.storageRef ??
      null,
  };
}

export function buildAdditionalCoverageDocument(input: {
  companyKey: string;
  generatedAt: string;
  source: EvidenceIndexAdditionalCoverageInput;
}): SourceDocumentBuild {
  const freshness =
    input.source.freshnessOverride ??
    buildFreshness({
      checkedAt: input.generatedAt,
      sourceCapturedAt: input.source.latestSnapshot?.capturedAt ?? null,
      state: "missing",
      summary: "This source is visible only as coverage input for V2A.",
    });
  const coverageStatus =
    input.source.freshnessOverride?.state === "stale" ? "stale" : "not_indexed";

  return {
    capturedAt: input.source.latestSnapshot?.capturedAt ?? null,
    checksumSha256: input.source.latestSnapshot?.checksumSha256 ?? null,
    companyKey: input.companyKey,
    coverageStatus,
    documentRole: input.source.documentRole,
    extractionMethod: "source_metadata",
    freshness,
    id: documentId(
      input.companyKey,
      input.source.source.id,
      input.source.latestSnapshot?.id,
    ),
    lifecycleStatus: "current",
    limitations: input.source.limitations.map((summary) =>
      buildLimitation({
        affectedSourceIds: [input.source.source.id],
        code: "source_not_indexed",
        severity: "blocking",
        summary,
      }),
    ),
    mediaType: input.source.latestSnapshot?.mediaType ?? null,
    sourceFileId: input.source.latestSourceFile?.id ?? null,
    sourceId: input.source.source.id,
    sourceKind: input.source.source.kind,
    sourceSnapshotId: input.source.latestSnapshot?.id ?? null,
    storageKind: input.source.latestSnapshot?.storageKind ?? null,
    storageRef: input.source.latestSnapshot?.storageRef ?? null,
  };
}

export function buildAnchor(input: {
  document: EvidenceIndexSourceDocument;
  extractionMethod: EvidenceIndexExtractionMethod;
  idSuffix: string;
  limitationPosture: EvidenceIndexLimitationPosture[];
  locator: SourceAnchor["locator"];
}): SourceAnchor {
  return {
    checksumSha256: input.document.checksumSha256,
    companyKey: input.document.companyKey,
    extractionMethod: input.extractionMethod,
    freshness: input.document.freshness,
    id: `${input.document.id}:anchor:${input.idSuffix}`,
    lifecycleStatus: input.document.lifecycleStatus,
    limitations: input.limitationPosture,
    locator: input.locator,
    sourceDocumentId: input.document.id,
    sourceFileId: input.document.sourceFileId,
    sourceId: input.document.sourceId,
    sourceSnapshotId: input.document.sourceSnapshotId,
    storageKind: input.document.storageKind,
    storageRef: input.document.storageRef,
  };
}

export function isSupportedExtract(source: EvidenceIndexBoundSourceInput) {
  return (
    source.binding.includeInCompile &&
    source.source.kind === "document" &&
    source.latestSnapshot !== null &&
    source.latestSourceFile !== null &&
    source.latestExtract?.extractStatus === "extracted" &&
    isSupportedDocumentKind(source.latestExtract)
  );
}

function extractionMethodFor(
  source: EvidenceIndexBoundSourceInput,
): EvidenceIndexExtractionMethod {
  if (!isSupportedExtract(source)) return unsupportedMethodFor(source);

  return source.latestExtract?.documentKind === "plain_text"
    ? "plain_text_deterministic"
    : "markdown_text_deterministic";
}

function unsupportedMethodFor(
  source: EvidenceIndexBoundSourceInput,
): EvidenceIndexExtractionMethod {
  const mediaType = (
    source.latestSnapshot?.mediaType ??
    source.latestSourceFile?.mediaType ??
    ""
  ).toLowerCase();

  if (mediaType === "application/pdf") return "unsupported_pdf";
  if (mediaType.startsWith("image/")) return "unsupported_image_only";
  if (source.latestExtract?.extractStatus === "failed") {
    return "cfo_wiki_document_extract";
  }

  return "source_metadata";
}

function coverageStatusFor(
  source: EvidenceIndexBoundSourceInput,
  freshness: EvidenceIndexFreshnessPosture,
): EvidenceIndexCoverageStatus {
  if (!source.binding.includeInCompile) return "not_indexed";
  if (source.source.kind !== "document") return "unsupported";
  if (!source.latestSnapshot || !source.latestSourceFile) return "missing";
  if (!source.latestExtract) return "not_indexed";
  if (source.latestExtract.extractStatus === "failed") return "failed";
  if (source.latestExtract.extractStatus === "unsupported")
    return "unsupported";
  if (freshness.state === "stale") return "stale";
  return "supported";
}

function lifecycleFor(source: EvidenceIndexBoundSourceInput) {
  if (source.latestExtract?.extractStatus === "failed") return "failed";
  if (!isSupportedExtract(source)) return "unsupported";
  return "current";
}

function isSupportedDocumentKind(extract: CfoWikiDocumentExtractRecord) {
  return (
    extract.documentKind === "markdown_text" ||
    extract.documentKind === "plain_text"
  );
}

function freshnessStateFor(source: EvidenceIndexBoundSourceInput) {
  if (!source.latestSnapshot || !source.latestSourceFile) return "missing";
  if (source.latestExtract?.extractStatus === "failed") return "failed";
  if (!source.latestExtract) return "missing";
  return "fresh";
}

function freshnessSummaryFor(source: EvidenceIndexBoundSourceInput) {
  if (!source.latestSnapshot) return "No source snapshot is available.";
  if (!source.latestSourceFile) return "No immutable source file is available.";
  if (!source.latestExtract)
    return "No deterministic document extract is available.";
  if (source.latestExtract.extractStatus === "failed") {
    return "Deterministic document extraction failed.";
  }
  return "Freshness is derived from the latest stored source snapshot and extract.";
}

function buildFreshness(input: {
  checkedAt: string;
  compiledAt?: string | null;
  extractedAt?: string | null;
  sourceCapturedAt?: string | null;
  state: EvidenceIndexFreshnessPosture["state"];
  summary: string;
}): EvidenceIndexFreshnessPosture {
  return {
    checkedAt: input.checkedAt,
    compiledAt: input.compiledAt ?? null,
    extractedAt: input.extractedAt ?? null,
    sourceCapturedAt: input.sourceCapturedAt ?? null,
    state: input.state,
    summary: input.summary,
  };
}

function documentId(
  companyKey: string,
  sourceId: string,
  snapshotId?: string | null,
) {
  return `source-document:${companyKey}:${sourceId}:${snapshotId ?? "missing"}`;
}
