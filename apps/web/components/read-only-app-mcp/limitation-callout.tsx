import React from "react";
import {
  createReadOnlyAppMcpSectionId,
  type ReadOnlyAppMcpHeadingLevel,
} from "./ids";
import { bodyStyle, colors, compactPanelStyle, strongBodyStyle } from "./styles";
import type { ReadOnlyAppMcpLimitation } from "./types";
import { ReadOnlyList, ReadOnlyPanel, SectionHeading } from "./ui";

type LimitationCalloutProps = {
  headingLevel?: ReadOnlyAppMcpHeadingLevel;
  limitations: ReadOnlyAppMcpLimitation[];
  sectionIdScope?: string;
};

export function LimitationCallout({
  headingLevel,
  limitations,
  sectionIdScope,
}: LimitationCalloutProps) {
  const titleId = createReadOnlyAppMcpSectionId({
    scope: sectionIdScope,
    section: "limitations",
  });

  return (
    <ReadOnlyPanel labelledBy={titleId}>
      <SectionHeading
        eyebrow="Limitations"
        headingLevel={headingLevel}
        id={titleId}
        summary="Limitations are displayed with text labels and severity, not by color alone."
        title="Limitation callout"
      />
      <ReadOnlyList
        emptyLabel="No limitations are available for this envelope."
        items={limitations}
        renderItem={(limitation) => (
          <div style={{ ...compactPanelStyle, borderColor: colors.warning }}>
            <p style={strongBodyStyle}>
              {limitation.severity}: {limitation.code}
            </p>
            <p style={bodyStyle}>{limitation.summary}</p>
          </div>
        )}
      />
    </ReadOnlyPanel>
  );
}
