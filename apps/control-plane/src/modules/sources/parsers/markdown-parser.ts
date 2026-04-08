import type { SourceIngestMarkdownReceiptSummary } from "@pocket-cto/domain";
import type { SourceParserInput, SourceParserResult } from "../parser-registry";

const MAX_EXCERPT_LENGTH = 280;
const MAX_HEADING_PREVIEW_COUNT = 10;

export function parseMarkdownReceipt(
  input: SourceParserInput,
): SourceParserResult {
  const text = new TextDecoder("utf-8")
    .decode(input.body)
    .replace(/^\uFEFF/u, "");
  const lines = text.length === 0 ? [] : text.split(/\r?\n/u);
  const headingPreview = lines
    .map(parseHeading)
    .filter((heading) => heading !== null)
    .slice(0, MAX_HEADING_PREVIEW_COUNT);
  const excerpt = text.trim().slice(0, MAX_EXCERPT_LENGTH);
  const summary: SourceIngestMarkdownReceiptSummary = {
    kind: "markdown_text",
    characterCount: text.length,
    excerpt,
    headingCount: lines.map(parseHeading).filter((heading) => heading !== null).length,
    headingPreview,
    lineCount: lines.length,
  };
  const warnings =
    excerpt.length < text.trim().length
      ? [
          {
            code: "markdown_excerpt_truncated",
            message: "Markdown excerpt was truncated to keep the receipt compact",
          },
        ]
      : [];

  return {
    receiptSummary: summary,
    warnings,
  };
}

function parseHeading(line: string) {
  const match = /^(#{1,6})\s+(.+?)\s*$/u.exec(line.trim());

  if (!match?.[1] || !match[2]) {
    return null;
  }

  return {
    depth: match[1].length,
    text: match[2],
  };
}
