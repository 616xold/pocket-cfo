import React from "react";
import {
  createReadOnlyAppMcpSectionId,
  type ReadOnlyAppMcpHeadingLevel,
} from "./ids";
import { bodyStyle, compactPanelStyle, strongBodyStyle } from "./styles";
import type { ReadOnlyAppMcpBoundary } from "./types";
import { ReadOnlyList, ReadOnlyPanel, SectionHeading } from "./ui";

type NoRuntimeBoundaryPanelProps = {
  boundary: ReadOnlyAppMcpBoundary;
  headingLevel?: ReadOnlyAppMcpHeadingLevel;
  sectionIdScope?: string;
};

export function NoRuntimeBoundaryPanel({
  boundary,
  headingLevel,
  sectionIdScope,
}: NoRuntimeBoundaryPanelProps) {
  const titleId = createReadOnlyAppMcpSectionId({
    scope: sectionIdScope,
    section: "no-runtime-boundary",
  });

  return (
    <ReadOnlyPanel labelledBy={titleId}>
      <SectionHeading
        eyebrow="No-runtime boundary"
        headingLevel={headingLevel}
        id={titleId}
        summary={boundary.summary}
        title={boundary.title}
      />
      <ReadOnlyList
        emptyLabel="No no-runtime boundary items were recorded."
        items={boundary.items}
        renderItem={(item) => (
          <div style={compactPanelStyle}>
            <p style={strongBodyStyle}>{item}</p>
            <p style={bodyStyle}>No route, endpoint, tool call, or deployment is implied.</p>
          </div>
        )}
      />
    </ReadOnlyPanel>
  );
}
