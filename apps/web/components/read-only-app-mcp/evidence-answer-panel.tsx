import React from "react";
import {
  createReadOnlyAppMcpSectionId,
  type ReadOnlyAppMcpHeadingLevel,
} from "./ids";
import {
  bodyStyle,
  colors,
  strongBodyStyle,
  twoColumnGridStyle,
} from "./styles";
import type { ReadOnlyAppMcpAnswer } from "./types";
import { ReadOnlyPanel, SectionHeading } from "./ui";

type EvidenceAnswerPanelProps = {
  answer: ReadOnlyAppMcpAnswer;
  headingLevel?: ReadOnlyAppMcpHeadingLevel;
  sectionIdScope?: string;
};

export function EvidenceAnswerPanel({
  answer,
  headingLevel,
  sectionIdScope,
}: EvidenceAnswerPanelProps) {
  const titleId = createReadOnlyAppMcpSectionId({
    scope: sectionIdScope,
    section: "answer",
  });

  return (
    <ReadOnlyPanel labelledBy={titleId}>
      <div
        style={{
          alignItems: "start",
          display: "flex",
          gap: 12,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <SectionHeading
          eyebrow="Answer status"
          headingLevel={headingLevel}
          id={titleId}
          summary={answer.summary}
          title={answer.title}
        />
      </div>
      <dl style={twoColumnGridStyle}>
        <div>
          <dt style={bodyStyle}>Status</dt>
          <dd style={strongBodyStyle}>{answer.statusLabel}</dd>
        </div>
        <div>
          <dt style={bodyStyle}>Evidence cards</dt>
          <dd style={strongBodyStyle}>{answer.evidenceCount}</dd>
        </div>
      </dl>
      <p style={{ ...bodyStyle, borderTop: `1px solid ${colors.line}`, paddingTop: 12 }}>
        This panel displays stored evidence posture only. It does not create a
        finance conclusion or trigger a tool call.
      </p>
    </ReadOnlyPanel>
  );
}
