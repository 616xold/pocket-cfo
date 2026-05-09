import React from "react";
import {
  createReadOnlyAppMcpSectionId,
  type ReadOnlyAppMcpHeadingLevel,
} from "./ids";
import { bodyStyle, compactPanelStyle, strongBodyStyle } from "./styles";
import type { ReadOnlyAppMcpPermittedNextAction } from "./types";
import { ReadOnlyList, ReadOnlyPanel, SectionHeading } from "./ui";

type PermittedNextActionsPanelProps = {
  actions: ReadOnlyAppMcpPermittedNextAction[];
  headingLevel?: ReadOnlyAppMcpHeadingLevel;
  sectionIdScope?: string;
};

export function PermittedNextActionsPanel({
  actions,
  headingLevel,
  sectionIdScope,
}: PermittedNextActionsPanelProps) {
  const titleId = createReadOnlyAppMcpSectionId({
    scope: sectionIdScope,
    section: "permitted-actions",
  });

  return (
    <ReadOnlyPanel labelledBy={titleId}>
      <SectionHeading
        eyebrow="Permitted next actions"
        headingLevel={headingLevel}
        id={titleId}
        summary="These are static review steps. They do not run tools, mutate data, or release anything."
        title="Permitted next review steps"
      />
      <ReadOnlyList
        emptyLabel="No permitted next review steps are available."
        items={actions}
        renderItem={(action) => (
          <div style={compactPanelStyle}>
            <p style={strongBodyStyle}>{action.label}</p>
            <p style={bodyStyle}>{action.summary}</p>
            <p style={bodyStyle}>
              Static action label: <code>{action.action}</code>
            </p>
          </div>
        )}
      />
    </ReadOnlyPanel>
  );
}
