import type {
  SourceFileRecord,
  SourceParserSelection,
  SourceRecord,
} from "@pocket-cto/domain";

const CSV_MEDIA_TYPES = new Set([
  "application/csv",
  "application/vnd.ms-excel",
  "text/csv",
]);

const MARKDOWN_MEDIA_TYPES = new Set([
  "text/markdown",
  "text/x-markdown",
]);

const ZIP_MEDIA_TYPES = new Set([
  "application/x-zip-compressed",
  "application/zip",
]);

const OPEN_XML_MEDIA_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const CSV_EXTENSIONS = new Set(["csv"]);
const MARKDOWN_EXTENSIONS = new Set(["markdown", "md", "txt"]);
const ZIP_EXTENSIONS = new Set(["zip"]);
const OPEN_XML_EXTENSIONS = new Set(["docx", "pptx", "xlsx"]);

export function selectSourceParser(
  source: SourceRecord,
  sourceFile: SourceFileRecord,
): SourceParserSelection {
  const mediaType = normalizeMediaType(sourceFile.mediaType);
  const fileExtension = getFileExtension(sourceFile.originalFileName);

  if (CSV_MEDIA_TYPES.has(mediaType)) {
    return buildSelection("csv_tabular", "media_type", mediaType, fileExtension, source);
  }

  if (CSV_EXTENSIONS.has(fileExtension ?? "")) {
    return buildSelection(
      "csv_tabular",
      "file_extension",
      mediaType,
      fileExtension,
      source,
    );
  }

  if (MARKDOWN_MEDIA_TYPES.has(mediaType)) {
    return buildSelection(
      "markdown_text",
      "media_type",
      mediaType,
      fileExtension,
      source,
    );
  }

  if (MARKDOWN_EXTENSIONS.has(fileExtension ?? "")) {
    return buildSelection(
      "markdown_text",
      "file_extension",
      mediaType,
      fileExtension,
      source,
    );
  }

  if (OPEN_XML_MEDIA_TYPES.has(mediaType) || OPEN_XML_EXTENSIONS.has(fileExtension ?? "")) {
    return buildSelection(
      "metadata_fallback",
      "fallback",
      mediaType,
      fileExtension,
      source,
    );
  }

  if (ZIP_MEDIA_TYPES.has(mediaType)) {
    return buildSelection("zip_inventory", "media_type", mediaType, fileExtension, source);
  }

  if (ZIP_EXTENSIONS.has(fileExtension ?? "")) {
    return buildSelection(
      "zip_inventory",
      "file_extension",
      mediaType,
      fileExtension,
      source,
    );
  }

  if (source.kind === "document" && mediaType.startsWith("text/")) {
    return buildSelection("markdown_text", "source_kind", mediaType, fileExtension, source);
  }

  if (source.kind === "archive" && mediaType === "application/octet-stream") {
    return buildSelection("zip_inventory", "source_kind", mediaType, fileExtension, source);
  }

  return buildSelection(
    "metadata_fallback",
    fileExtension || source.kind === "image" ? "source_kind" : "fallback",
    mediaType,
    fileExtension,
    source,
  );
}

function buildSelection(
  parserKey: SourceParserSelection["parserKey"],
  matchedBy: SourceParserSelection["matchedBy"],
  mediaType: string,
  fileExtension: string | null,
  source: SourceRecord,
): SourceParserSelection {
  return {
    parserKey,
    matchedBy,
    mediaType,
    fileExtension,
    sourceKind: source.kind,
  };
}

function getFileExtension(fileName: string) {
  const lastDot = fileName.lastIndexOf(".");

  if (lastDot < 0 || lastDot === fileName.length - 1) {
    return null;
  }

  return fileName.slice(lastDot + 1).toLowerCase();
}

function normalizeMediaType(mediaType: string) {
  return mediaType.split(";")[0]?.trim().toLowerCase() ?? mediaType.trim().toLowerCase();
}
