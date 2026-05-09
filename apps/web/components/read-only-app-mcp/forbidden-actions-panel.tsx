import React from "react";
import {
  createReadOnlyAppMcpSectionId,
  type ReadOnlyAppMcpHeadingLevel,
} from "./ids";
import { bodyStyle, colors, compactPanelStyle, strongBodyStyle } from "./styles";
import type { ReadOnlyAppMcpForbiddenAction } from "./types";
import { ReadOnlyList, ReadOnlyPanel, SectionHeading } from "./ui";

type ForbiddenActionsPanelProps = {
  actions: ReadOnlyAppMcpForbiddenAction[];
  headingLevel?: ReadOnlyAppMcpHeadingLevel;
  sectionIdScope?: string;
};

export function ForbiddenActionsPanel({
  actions,
  headingLevel,
  sectionIdScope,
}: ForbiddenActionsPanelProps) {
  const titleId = createReadOnlyAppMcpSectionId({
    scope: sectionIdScope,
    section: "forbidden-actions",
  });

  return (
    <ReadOnlyPanel labelledBy={titleId}>
      <SectionHeading
        eyebrow="Forbidden actions"
        headingLevel={headingLevel}
        id={titleId}
        summary="Forbidden capabilities are text-only blocked posture, never controls."
        title="Forbidden action posture"
      />
      <ReadOnlyList
        emptyLabel="No forbidden actions were recorded."
        items={actions}
        renderItem={(action, index) => (
          <div style={{ ...compactPanelStyle, borderColor: colors.danger }}>
            <p style={strongBodyStyle}>
              Blocked capability:{" "}
              <code>{readBlockedCapabilityLabel(action.action, index)}</code>
            </p>
            <p style={bodyStyle}>{action.reason}</p>
          </div>
        )}
      />
    </ReadOnlyPanel>
  );
}

function readBlockedCapabilityLabel(action: string, index: number) {
  const normalized = action.toLowerCase();

  if (/(approve|send|pay|certify|connect|upload|submit)/u.test(normalized)) {
    return `blocked external/write capability ${index + 1}`;
  }

  return action.replace(/[_-]+/gu, " ");
}
