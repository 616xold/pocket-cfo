import React from "react";

type ReadOnlyMarkdownPreviewProps = {
  bodyMarkdown: string;
  title: string;
};

export function ReadOnlyMarkdownPreview({
  bodyMarkdown,
  title,
}: ReadOnlyMarkdownPreviewProps) {
  return (
    <div className="stack" style={{ marginTop: 18 }}>
      <h3>{title}</h3>
      <div
        aria-label={title}
        style={{
          background: "rgba(15, 23, 42, 0.03)",
          border: "1px solid rgba(15, 23, 42, 0.12)",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <pre
          style={{
            fontFamily:
              '"SFMono-Regular", ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace',
            fontSize: "0.92rem",
            lineHeight: 1.55,
            margin: 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {bodyMarkdown}
        </pre>
      </div>
    </div>
  );
}
