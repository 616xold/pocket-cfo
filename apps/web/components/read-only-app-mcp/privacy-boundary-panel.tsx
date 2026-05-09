import React from "react";
import {
  createReadOnlyAppMcpSectionId,
  type ReadOnlyAppMcpHeadingLevel,
} from "./ids";
import { bodyStyle, compactPanelStyle, strongBodyStyle } from "./styles";
import type { ReadOnlyAppMcpBoundary } from "./types";
import { ReadOnlyList, ReadOnlyPanel, SectionHeading } from "./ui";

type PrivacyBoundaryPanelProps = {
  boundary: ReadOnlyAppMcpBoundary;
  headingLevel?: ReadOnlyAppMcpHeadingLevel;
  sectionIdScope?: string;
};

export function PrivacyBoundaryPanel({
  boundary,
  headingLevel,
  sectionIdScope,
}: PrivacyBoundaryPanelProps) {
  const titleId = createReadOnlyAppMcpSectionId({
    scope: sectionIdScope,
    section: "privacy-boundary",
  });

  return (
    <ReadOnlyPanel labelledBy={titleId}>
      <SectionHeading
        eyebrow="Privacy boundary"
        headingLevel={headingLevel}
        id={titleId}
        summary={boundary.summary}
        title={boundary.title}
      />
      <ReadOnlyList
        emptyLabel="No privacy boundary items were recorded."
        items={boundary.items}
        renderItem={(item) => (
          <div style={compactPanelStyle}>
            <p style={strongBodyStyle}>{item}</p>
            <p style={bodyStyle}>Displayed as local proof posture only.</p>
          </div>
        )}
      />
    </ReadOnlyPanel>
  );
}
