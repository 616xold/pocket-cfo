import React from "react";
import type { DocumentMap, SafeSourceExcerpt } from "@pocket-cto/domain";
import { StatusPill } from "../status-pill";

type DocumentMapSummaryProps = {
  documentMaps: DocumentMap[];
  safeExcerpts: SafeSourceExcerpt[];
};

export function DocumentMapSummary({
  documentMaps,
  safeExcerpts,
}: DocumentMapSummaryProps) {
  const firstMap = documentMaps[0] ?? null;

  return (
    <section className="card">
      <div className="section-head">
        <div>
          <p className="kicker">Document map</p>
          <h2>Sections and unsupported regions</h2>
        </div>
        <StatusPill
          label={firstMap ? firstMap.coverageStatus : "missing"}
          tone={firstMap ? "default" : "warn"}
        />
      </div>

      {firstMap ? (
        <div className="stack">
          <p className="muted">
            Source <code>{firstMap.sourceDocument.sourceId}</code> has{" "}
            {firstMap.sourceSections.length} mapped sections,{" "}
            {firstMap.sourceTables.length} unsupported tables, and{" "}
            {firstMap.sourceFigures.length} unsupported figures.
          </p>
          <ul className="list-clean">
            {firstMap.sourceSections.map((section) => (
              <li key={section.id}>
                {section.title ?? "Untitled section"} - lines{" "}
                {section.startLine}-{section.endLine}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="muted">
          No DocumentMap is available through existing web read models. Missing
          maps, unsupported tables, unsupported figures, no-text PDFs, scans,
          OCR-only regions, vector-only hits, PageIndex-only hits, and stale
          extracts stay visible as limitations instead of claims.
        </p>
      )}

      <div className="stack" style={{ marginTop: 18 }}>
        <h3>Bounded, redacted, cited excerpts</h3>
        {safeExcerpts.length > 0 ? (
          safeExcerpts.map((excerpt) => (
            <blockquote
              className="source-note"
              key={`${excerpt.sourceAnchorId}-${excerpt.citation.id}`}
            >
              <p>{excerpt.text}</p>
              <p className="muted">
                Citation: {excerpt.citation.summary} - characters:{" "}
                {excerpt.characterCount} - redactions:{" "}
                {excerpt.redactions.length}
                {excerpt.truncated ? " - truncated" : ""}
              </p>
            </blockquote>
          ))
        ) : (
          <p className="muted">
            No source excerpt is rendered without a citation. Full-file dumps
            are not part of the atlas foundation.
          </p>
        )}
      </div>
    </section>
  );
}
