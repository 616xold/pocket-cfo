import type {
  CfoWikiDocumentExtractRecord,
  EvidenceIndexSourceDocument,
  EvidenceIndexSourceSection,
  EvidenceIndexUnsupportedRegion,
  SourceAnchor,
} from "@pocket-cto/domain";
import { buildLimitation } from "./limitations";
import { buildAnchor } from "./source-document";

export type TextStructure = {
  anchors: SourceAnchor[];
  sourcePages: Array<{
    anchorId: string;
    id: string;
    label: string;
    limitations: SourceAnchor["limitations"];
    locator: SourceAnchor["locator"];
    order: number;
  }>;
  sourceSections: EvidenceIndexSourceSection[];
  sourceTables: EvidenceIndexUnsupportedRegion[];
  sourceFigures: EvidenceIndexUnsupportedRegion[];
  limitations: SourceAnchor["limitations"];
};

export function buildSupportedTextStructure(input: {
  document: EvidenceIndexSourceDocument;
  extract: CfoWikiDocumentExtractRecord;
}): TextStructure {
  const text = normalizeText(
    input.extract.extractedText ?? input.extract.renderedMarkdown ?? "",
  );
  const lines = text === "" ? [] : text.split("\n");
  const pageAnchor = buildTextSegmentAnchor(input.document, lines.length);
  const sections = buildSections({
    document: input.document,
    lines,
    markdown: input.extract.documentKind === "markdown_text",
  });
  const tables = buildUnsupportedRegions({
    anchorBase: pageAnchor,
    document: input.document,
    lines,
    regionKind: "table",
  });
  const figures = buildUnsupportedRegions({
    anchorBase: pageAnchor,
    document: input.document,
    lines,
    regionKind: "figure",
  });
  const regionAnchors = [...tables, ...figures].map((region) =>
    buildAnchor({
      document: input.document,
      extractionMethod: region.extractionMethod,
      idSuffix: region.id.split(":").at(-1) ?? region.regionKind,
      limitationPosture: region.limitations,
      locator: {
        endLine: null,
        kind: "unsupported_boundary",
        sectionTitle: null,
        startLine: null,
        value: `${region.regionKind}:${region.order}`,
      },
    }),
  );
  const limitations = [
    ...pageAnchor.limitations,
    ...tables.flatMap((region) => region.limitations),
    ...figures.flatMap((region) => region.limitations),
  ];

  return {
    anchors: [
      pageAnchor,
      ...sections.map((entry) => entry.anchor),
      ...regionAnchors,
    ],
    limitations,
    sourceFigures: figures,
    sourcePages: [
      {
        anchorId: pageAnchor.id,
        id: `${input.document.id}:page:1`,
        label: "synthetic text segment 1",
        limitations: pageAnchor.limitations,
        locator: pageAnchor.locator,
        order: 0,
      },
    ],
    sourceSections: sections.map((entry) => entry.section),
    sourceTables: tables,
  };
}

function buildTextSegmentAnchor(
  document: EvidenceIndexSourceDocument,
  lineCount: number,
) {
  return buildAnchor({
    document,
    extractionMethod: document.extractionMethod,
    idSuffix: "segment-1",
    limitationPosture: [
      buildLimitation({
        affectedSourceIds: [document.sourceId],
        code: "synthetic_text_segment_not_pdf_page",
        severity: "warning",
        summary:
          "V2A markdown/plain-text maps use deterministic text segments, not PDF page claims.",
      }),
    ],
    locator: {
      endLine: Math.max(lineCount, 1),
      kind: "synthetic_text_segment",
      sectionTitle: null,
      startLine: 1,
      value: "text-segment:1",
    },
  });
}

function buildSections(input: {
  document: EvidenceIndexSourceDocument;
  lines: string[];
  markdown: boolean;
}) {
  const spans = input.markdown
    ? markdownSpans(input.lines)
    : paragraphSpans(input.lines);

  return spans.map((span, index) => {
    const anchor = buildAnchor({
      document: input.document,
      extractionMethod: input.document.extractionMethod,
      idSuffix: `section-${index + 1}`,
      limitationPosture: [],
      locator: {
        endLine: span.endLine,
        kind: "section_range",
        sectionTitle: span.title,
        startLine: span.startLine,
        value: `lines:${span.startLine}-${span.endLine}`,
      },
    });
    const section: EvidenceIndexSourceSection = {
      anchorId: anchor.id,
      endLine: span.endLine,
      excerpt: span.excerpt,
      id: `${input.document.id}:section:${index + 1}`,
      limitations: [],
      order: index,
      startLine: span.startLine,
      title: span.title,
    };

    return { anchor, section };
  });
}

function buildUnsupportedRegions(input: {
  anchorBase: SourceAnchor;
  document: EvidenceIndexSourceDocument;
  lines: string[];
  regionKind: "table" | "figure";
}) {
  const matches = input.lines
    .map((line, index) => ({ line, lineNumber: index + 1 }))
    .filter(({ line }) =>
      input.regionKind === "table"
        ? isMarkdownTableLine(line)
        : isMarkdownFigureLine(line),
    );
  const method =
    input.regionKind === "table" ? "unsupported_table" : "unsupported_figure";

  return matches.map(
    (match, index): EvidenceIndexUnsupportedRegion => ({
      anchorId: input.anchorBase.id,
      extractionMethod: method,
      id: `${input.document.id}:${input.regionKind}:${index + 1}`,
      limitations: [
        buildLimitation({
          affectedAnchorIds: [input.anchorBase.id],
          affectedSourceIds: [input.document.sourceId],
          code:
            input.regionKind === "table"
              ? "markdown_table_semantics_unsupported"
              : "unsupported_figure",
          severity: "blocking",
          summary:
            input.regionKind === "table"
              ? "Markdown table-like content is anchored only as an unsupported table placeholder in V2A."
              : "Markdown image or figure content is anchored only as an unsupported figure placeholder in V2A.",
        }),
      ],
      order: match.lineNumber,
      regionKind: input.regionKind,
    }),
  );
}

function markdownSpans(lines: string[]) {
  const spans: TextSpan[] = [];
  let current: TextSpanDraft | null = null;

  lines.forEach((line, index) => {
    const heading = parseMarkdownHeading(line);

    if (heading) {
      if (current) spans.push(toSpan(current, index));
      current = { lines: [line], startLine: index + 1, title: heading };
      return;
    }

    if (!current) current = { lines: [], startLine: index + 1, title: null };
    current.lines.push(line);
  });

  if (current) spans.push(toSpan(current, lines.length));
  return spans.filter((span) => span.excerpt.length > 0);
}

function paragraphSpans(lines: string[]) {
  const spans: TextSpan[] = [];
  let current: TextSpanDraft | null = null;

  lines.forEach((line, index) => {
    if (line.trim() === "") {
      if (current) spans.push(toSpan(current, index));
      current = null;
      return;
    }

    if (!current) current = { lines: [], startLine: index + 1, title: null };
    current.lines.push(line);
  });

  if (current) spans.push(toSpan(current, lines.length));
  return spans.filter((span) => span.excerpt.length > 0);
}

type TextSpanDraft = {
  startLine: number;
  title: string | null;
  lines: string[];
};

type TextSpan = {
  startLine: number;
  endLine: number;
  title: string | null;
  excerpt: string;
};

function toSpan(span: TextSpanDraft, endLine: number): TextSpan {
  return {
    endLine: Math.max(span.startLine, endLine),
    excerpt: normalizeExcerpt(span.lines),
    startLine: span.startLine,
    title: span.title,
  };
}

function parseMarkdownHeading(line: string) {
  const match = /^(#{1,6})\s+(.+?)\s*$/u.exec(line.trim());
  return match?.[2]?.trim().replace(/\s+/g, " ") ?? null;
}

function isMarkdownTableLine(line: string) {
  return /^\s*\|.+\|\s*$/u.test(line);
}

function isMarkdownFigureLine(line: string) {
  return /!\[[^\]]*\]\([^)]+\)/u.test(line);
}

function normalizeText(text: string) {
  return text.replace(/\r\n/g, "\n").trim();
}

function normalizeExcerpt(lines: string[]) {
  return lines
    .join(" ")
    .replace(/^#{1,6}\s+/u, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
}
