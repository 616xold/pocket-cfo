import { extname } from "node:path";
import type { CfoWikiDocumentExtractRecord } from "@pocket-cto/domain";
import type { SourceFileRecord, SourceRecord, SourceSnapshotRecord } from "@pocket-cto/domain";
import type { SourceFileStorage } from "../../sources/storage";
import type { PersistCfoWikiDocumentExtractInput } from "../repository";

const MAX_EXCERPT_BLOCKS = 5;
const MAX_EXCERPT_TEXT_LENGTH = 400;
const MAX_TITLE_LENGTH = 160;

export const CFO_WIKI_DOCUMENT_EXTRACT_PARSER_VERSION =
  "f3b-document-extract-v1";

export async function resolveDocumentExtract(input: {
  existingExtract: CfoWikiDocumentExtractRecord | null;
  now: Date;
  snapshot: SourceSnapshotRecord;
  source: SourceRecord;
  sourceFile: SourceFileRecord | null;
  sourceFileStorage: Pick<SourceFileStorage, "read">;
}) {
  if (
    input.existingExtract &&
    input.existingExtract.inputChecksumSha256 === input.snapshot.checksumSha256 &&
    input.existingExtract.parserVersion === CFO_WIKI_DOCUMENT_EXTRACT_PARSER_VERSION
  ) {
    return toPersistedDocumentExtract(input.existingExtract);
  }

  if (!input.sourceFile) {
    return buildUnsupportedExtract({
      errorSummary: null,
      now: input.now,
      snapshot: input.snapshot,
      source: input.source,
      sourceFile: null,
      warning:
        "No stored raw source file is linked to this snapshot yet, so F3B cannot compile a deterministic document digest from bytes.",
    });
  }

  const documentKind = detectSupportedDocumentKind(input.sourceFile);

  if (documentKind === null) {
    return buildUnsupportedExtract({
      errorSummary: null,
      now: input.now,
      snapshot: input.snapshot,
      source: input.source,
      sourceFile: input.sourceFile,
      warning: `F3B currently supports deterministic markdown and plain-text extraction only; ${input.sourceFile.mediaType} remains unsupported in this slice.`,
    });
  }

  try {
    const body = await input.sourceFileStorage.read(input.sourceFile.storageRef);
    const text = decodeUtf8(body);

    return documentKind === "markdown_text"
      ? buildMarkdownExtract({
          now: input.now,
          snapshot: input.snapshot,
          source: input.source,
          sourceFile: input.sourceFile,
          text,
        })
      : buildPlainTextExtract({
          now: input.now,
          snapshot: input.snapshot,
          source: input.source,
          sourceFile: input.sourceFile,
          text,
        });
  } catch (error) {
    return {
      sourceId: input.source.id,
      sourceSnapshotId: input.snapshot.id,
      sourceFileId: input.sourceFile.id,
      extractStatus: "failed",
      documentKind: documentKind ?? "unsupported_document",
      title: normalizeTitle(input.source.name),
      headingOutline: [],
      excerptBlocks: [],
      extractedText: null,
      renderedMarkdown: null,
      warnings: [],
      errorSummary: toErrorSummary(error),
      parserVersion: CFO_WIKI_DOCUMENT_EXTRACT_PARSER_VERSION,
      inputChecksumSha256: input.snapshot.checksumSha256,
      extractedAt: input.now.toISOString(),
    } satisfies PersistCfoWikiDocumentExtractInput;
  }
}

type SupportedDocumentKind = "markdown_text" | "plain_text";

function detectSupportedDocumentKind(sourceFile: SourceFileRecord): SupportedDocumentKind | null {
  const fileExtension = extname(sourceFile.originalFileName).toLowerCase();
  const mediaType = sourceFile.mediaType.toLowerCase();

  if (
    mediaType === "text/markdown" ||
    fileExtension === ".md" ||
    fileExtension === ".markdown" ||
    fileExtension === ".mdown"
  ) {
    return "markdown_text";
  }

  if (
    mediaType === "text/plain" ||
    (mediaType.startsWith("text/") && mediaType !== "text/csv") ||
    fileExtension === ".txt" ||
    fileExtension === ".text"
  ) {
    return "plain_text";
  }

  return null;
}

function buildMarkdownExtract(input: {
  now: Date;
  snapshot: SourceSnapshotRecord;
  source: SourceRecord;
  sourceFile: SourceFileRecord;
  text: string;
}) {
  const normalizedText = normalizeExtractedText(input.text);
  const lines = normalizedText === "" ? [] : normalizedText.split("\n");
  const headingOutline = lines
    .map((line) => parseMarkdownHeading(line))
    .filter((heading) => heading !== null);
  const excerptBlocks = buildMarkdownExcerptBlocks(lines);
  const title =
    headingOutline[0]?.text ??
    extractFirstNonEmptyLine(lines) ??
    input.source.name;
  const warnings =
    headingOutline.length === 0
      ? ["No markdown headings were detected, so the outline remains empty."]
      : [];

  return {
    sourceId: input.source.id,
    sourceSnapshotId: input.snapshot.id,
    sourceFileId: input.sourceFile.id,
    extractStatus: "extracted",
    documentKind: "markdown_text",
    title: normalizeTitle(title),
    headingOutline,
    excerptBlocks,
    extractedText: normalizedText,
    renderedMarkdown: normalizedText,
    warnings,
    errorSummary: null,
    parserVersion: CFO_WIKI_DOCUMENT_EXTRACT_PARSER_VERSION,
    inputChecksumSha256: input.snapshot.checksumSha256,
    extractedAt: input.now.toISOString(),
  } satisfies PersistCfoWikiDocumentExtractInput;
}

function buildPlainTextExtract(input: {
  now: Date;
  snapshot: SourceSnapshotRecord;
  source: SourceRecord;
  sourceFile: SourceFileRecord;
  text: string;
}) {
  const normalizedText = normalizeExtractedText(input.text);
  const paragraphs = splitParagraphs(normalizedText);
  const title =
    extractFirstNonEmptyLine(normalizedText.split("\n")) ?? input.source.name;

  return {
    sourceId: input.source.id,
    sourceSnapshotId: input.snapshot.id,
    sourceFileId: input.sourceFile.id,
    extractStatus: "extracted",
    documentKind: "plain_text",
    title: normalizeTitle(title),
    headingOutline: [],
    excerptBlocks: paragraphs.slice(0, MAX_EXCERPT_BLOCKS).map((paragraph) => ({
      heading: null,
      text: paragraph,
    })),
    extractedText: normalizedText,
    renderedMarkdown: paragraphs.join("\n\n"),
    warnings: [],
    errorSummary: null,
    parserVersion: CFO_WIKI_DOCUMENT_EXTRACT_PARSER_VERSION,
    inputChecksumSha256: input.snapshot.checksumSha256,
    extractedAt: input.now.toISOString(),
  } satisfies PersistCfoWikiDocumentExtractInput;
}

function buildUnsupportedExtract(input: {
  errorSummary: string | null;
  now: Date;
  snapshot: SourceSnapshotRecord;
  source: SourceRecord;
  sourceFile: SourceFileRecord | null;
  warning: string;
}) {
  return {
    sourceId: input.source.id,
    sourceSnapshotId: input.snapshot.id,
    sourceFileId: input.sourceFile?.id ?? null,
    extractStatus: "unsupported",
    documentKind: "unsupported_document",
    title: normalizeTitle(input.source.name),
    headingOutline: [],
    excerptBlocks: [],
    extractedText: null,
    renderedMarkdown: null,
    warnings: [input.warning],
    errorSummary: input.errorSummary,
    parserVersion: CFO_WIKI_DOCUMENT_EXTRACT_PARSER_VERSION,
    inputChecksumSha256: input.snapshot.checksumSha256,
    extractedAt: input.now.toISOString(),
  } satisfies PersistCfoWikiDocumentExtractInput;
}

function toPersistedDocumentExtract(
  extract: CfoWikiDocumentExtractRecord,
): PersistCfoWikiDocumentExtractInput {
  return {
    sourceId: extract.sourceId,
    sourceSnapshotId: extract.sourceSnapshotId,
    sourceFileId: extract.sourceFileId,
    extractStatus: extract.extractStatus,
    documentKind: extract.documentKind,
    title: extract.title,
    headingOutline: extract.headingOutline,
    excerptBlocks: extract.excerptBlocks,
    extractedText: extract.extractedText,
    renderedMarkdown: extract.renderedMarkdown,
    warnings: extract.warnings,
    errorSummary: extract.errorSummary,
    parserVersion: extract.parserVersion,
    inputChecksumSha256: extract.inputChecksumSha256,
    extractedAt: extract.extractedAt,
  };
}

function decodeUtf8(body: Buffer) {
  return new TextDecoder("utf-8", { fatal: true })
    .decode(body)
    .replace(/^\uFEFF/u, "");
}

function normalizeExtractedText(text: string) {
  return text.replace(/\r\n/g, "\n").trim();
}

function parseMarkdownHeading(line: string) {
  const match = /^(#{1,6})\s+(.+?)\s*$/u.exec(line.trim());

  if (!match?.[1] || !match[2]) {
    return null;
  }

  return {
    depth: match[1].length,
    text: normalizeTitle(match[2]),
  };
}

function buildMarkdownExcerptBlocks(lines: string[]) {
  const blocks: Array<{ heading: string | null; text: string }> = [];
  let currentHeading: string | null = null;
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    const text = normalizeParagraph(currentParagraph);

    if (!text) {
      currentParagraph = [];
      return;
    }

    blocks.push({
      heading: currentHeading,
      text,
    });
    currentParagraph = [];
  };

  for (const line of lines) {
    const heading = parseMarkdownHeading(line);

    if (heading) {
      flushParagraph();
      currentHeading = heading.text;
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      continue;
    }

    currentParagraph.push(line.trim());
  }

  flushParagraph();

  return blocks.slice(0, MAX_EXCERPT_BLOCKS);
}

function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/u)
    .map((paragraph) => normalizeParagraph(paragraph.split("\n")))
    .filter((paragraph) => paragraph.length > 0)
    .slice(0, MAX_EXCERPT_BLOCKS);
}

function normalizeParagraph(lines: string[]) {
  const text = lines.join(" ").replace(/\s+/g, " ").trim();
  return text.slice(0, MAX_EXCERPT_TEXT_LENGTH);
}

function extractFirstNonEmptyLine(lines: string[]) {
  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.length > 0) {
      return trimmed.replace(/^#{1,6}\s+/u, "");
    }
  }

  return null;
}

function normalizeTitle(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, MAX_TITLE_LENGTH);
}

function toErrorSummary(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
