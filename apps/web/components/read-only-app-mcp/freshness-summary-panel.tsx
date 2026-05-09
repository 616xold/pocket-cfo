import React from "react";
import { FreshnessBadge } from "./freshness-badge";
import {
  createReadOnlyAppMcpSectionId,
  type ReadOnlyAppMcpHeadingLevel,
} from "./ids";
import {
  bodyStyle,
  compactPanelStyle,
  strongBodyStyle,
  twoColumnGridStyle,
} from "./styles";
import type { ReadOnlyAppMcpFreshness } from "./types";
import { ReadOnlyPanel, SectionHeading } from "./ui";

type FreshnessSummaryPanelProps = {
  freshness: ReadOnlyAppMcpFreshness;
  headingLevel?: ReadOnlyAppMcpHeadingLevel;
  sectionIdScope?: string;
};

export function FreshnessSummaryPanel({
  freshness,
  headingLevel,
  sectionIdScope,
}: FreshnessSummaryPanelProps) {
  const titleId = createReadOnlyAppMcpSectionId({
    scope: sectionIdScope,
    section: "freshness",
  });

  return (
    <ReadOnlyPanel labelledBy={titleId}>
      <SectionHeading
        eyebrow="Freshness"
        headingLevel={headingLevel}
        id={titleId}
        summary="Freshness is shown after citations and source anchors so source context stays ahead of freshness posture."
        title="Freshness posture"
      />
      <div style={compactPanelStyle}>
        <FreshnessBadge freshness={freshness} />
        <dl style={twoColumnGridStyle}>
          <div>
            <dt style={bodyStyle}>Checked at</dt>
            <dd style={strongBodyStyle}>{freshness.checkedAt}</dd>
          </div>
          <div>
            <dt style={bodyStyle}>Fail-closed if stale</dt>
            <dd style={strongBodyStyle}>
              {freshness.failClosedIfStale ? "yes" : "no"}
            </dd>
          </div>
        </dl>
        <p style={bodyStyle}>{freshness.summary}</p>
      </div>
    </ReadOnlyPanel>
  );
}
