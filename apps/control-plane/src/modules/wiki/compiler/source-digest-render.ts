import type { CfoWikiFreshnessSummary } from "@pocket-cto/domain";
import type { WikiDocumentSourceState, WikiDocumentSnapshotState } from "./document-state";

export function buildSourceDigestPageSummary(input: {
  documentSource: WikiDocumentSourceState;
  snapshotState: WikiDocumentSnapshotState;
}) {
  const snapshotLabel = `snapshot v${input.snapshotState.snapshot.version}`;

  if (input.snapshotState.extract.extractStatus === "extracted") {
    return `Deterministic source digest for ${input.documentSource.source.name} ${snapshotLabel}, compiled from stored raw document bytes without freeform synthesis.`;
  }

  return `Compiler-owned source digest placeholder for ${input.documentSource.source.name} ${snapshotLabel}; F3B keeps the unsupported or failed extraction gap visible instead of inventing page content.`;
}

export function buildSourceDigestFreshnessSummary(input: {
  documentSource: WikiDocumentSourceState;
  snapshotState: WikiDocumentSnapshotState;
}): CfoWikiFreshnessSummary {
  const snapshotLabel = `snapshot v${input.snapshotState.snapshot.version}`;

  if (input.snapshotState.extract.extractStatus === "failed") {
    return {
      state: "failed",
      summary: `${input.documentSource.source.name} ${snapshotLabel} failed deterministic extraction.`,
    };
  }

  if (input.snapshotState.extract.extractStatus === "unsupported") {
    return {
      state: "missing",
      summary: `${input.documentSource.source.name} ${snapshotLabel} is bound but unsupported for deterministic extraction in this F3B slice.`,
    };
  }

  if (input.snapshotState.temporalStatus === "superseded") {
    return {
      state: "stale",
      summary: `${input.documentSource.source.name} ${snapshotLabel} remains reviewable but has been superseded by a newer bound snapshot.`,
    };
  }

  return {
    state: "fresh",
    summary: `${input.documentSource.source.name} ${snapshotLabel} is the latest bound snapshot and was extracted deterministically from stored raw bytes.`,
  };
}

export function buildSourceDigestLimitations(input: {
  documentSource: WikiDocumentSourceState;
  snapshotState: WikiDocumentSnapshotState;
}) {
  const limitations: string[] = [];

  if (input.snapshotState.temporalStatus === "superseded") {
    limitations.push(
      "A newer bound snapshot exists for this source, so this page remains visible for audit context but is no longer current.",
    );
  }

  if (!input.snapshotState.sourceFile) {
    limitations.push(
      "No stored raw source file is linked to this snapshot, so F3B cannot extract document content from bytes.",
    );
  }

  if (input.snapshotState.extract.extractStatus === "unsupported") {
    limitations.push(
      input.snapshotState.extract.warnings[0] ??
        "This document kind is unsupported in the current deterministic F3B extract pipeline.",
    );
  }

  if (input.snapshotState.extract.extractStatus === "failed") {
    limitations.push(
      input.snapshotState.extract.errorSummary ??
        "Deterministic document extraction failed for this snapshot.",
    );
  }

  limitations.push(...input.snapshotState.extract.warnings);

  return [...new Set(limitations)];
}

export function renderSourceDigestSections(input: {
  documentSource: WikiDocumentSourceState;
  snapshotState: WikiDocumentSnapshotState;
}) {
  const lines: string[] = [
    "## Source Snapshot",
    `- Source name: ${input.documentSource.source.name}`,
    `- Source id: \`${input.documentSource.source.id}\``,
    `- Snapshot version: ${input.snapshotState.snapshot.version}`,
    `- Snapshot captured at: ${input.snapshotState.snapshot.capturedAt}`,
    `- Extraction support status: \`${input.snapshotState.extract.extractStatus}\``,
    `- Document kind: \`${input.snapshotState.extract.documentKind}\``,
    input.documentSource.binding.documentRole
      ? `- Document role: \`${input.documentSource.binding.documentRole}\``
      : null,
    input.snapshotState.sourceFile
      ? `- Raw file: ${input.snapshotState.sourceFile.originalFileName} (\`${input.snapshotState.sourceFile.mediaType}\`)`
      : "- Raw file: none linked to this snapshot",
    "",
    "## Deterministic Extract",
  ].filter((line): line is string => line !== null);

  if (input.snapshotState.extract.extractStatus === "extracted") {
    lines.push(
      `- Title: ${input.snapshotState.extract.title ?? input.documentSource.source.name}`,
      `- Parser version: \`${input.snapshotState.extract.parserVersion}\``,
      `- Extracted at: ${input.snapshotState.extract.extractedAt}`,
      "",
      "## Heading Outline",
      ...renderHeadingOutline(input.snapshotState),
      "",
      "## Excerpt Blocks",
      ...renderExcerptBlocks(input.snapshotState),
    );

    return lines;
  }

  lines.push(
    `- Title: ${input.snapshotState.extract.title ?? input.documentSource.source.name}`,
    `- Parser version: \`${input.snapshotState.extract.parserVersion}\``,
    `- Extracted at: ${input.snapshotState.extract.extractedAt}`,
    `- Notes: ${input.snapshotState.extract.errorSummary ?? input.snapshotState.extract.warnings[0] ?? "Unsupported or failed extraction remains visible as a gap."}`,
  );

  return lines;
}

function renderHeadingOutline(snapshotState: WikiDocumentSnapshotState) {
  if (snapshotState.extract.headingOutline.length === 0) {
    return ["- No heading outline was persisted for this snapshot."];
  }

  return snapshotState.extract.headingOutline.map(
    (heading) => `- H${heading.depth}: ${heading.text}`,
  );
}

function renderExcerptBlocks(snapshotState: WikiDocumentSnapshotState) {
  if (snapshotState.extract.excerptBlocks.length === 0) {
    return ["- No excerpt blocks were persisted for this snapshot."];
  }

  return snapshotState.extract.excerptBlocks.map((block) =>
    block.heading ? `- ${block.heading}: ${block.text}` : `- ${block.text}`,
  );
}
