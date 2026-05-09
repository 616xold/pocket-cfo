import React from "react";
import {
  createReadOnlyAppMcpSectionId,
  type ReadOnlyAppMcpHeadingLevel,
} from "./ids";
import { bodyStyle, compactPanelStyle, strongBodyStyle } from "./styles";
import type { ReadOnlyAppMcpSourceAnchor } from "./types";
import { ReadOnlyList, ReadOnlyPanel, SectionHeading } from "./ui";

type SourceAnchorPanelProps = {
  headingLevel?: ReadOnlyAppMcpHeadingLevel;
  itemHeadingLevel?: ReadOnlyAppMcpHeadingLevel;
  sectionIdScope?: string;
  sourceAnchors: ReadOnlyAppMcpSourceAnchor[];
};

export function SourceAnchorPanel({
  headingLevel,
  itemHeadingLevel = 3,
  sectionIdScope,
  sourceAnchors,
}: SourceAnchorPanelProps) {
  const titleId = createReadOnlyAppMcpSectionId({
    scope: sectionIdScope,
    section: "source-anchors",
  });

  return (
    <ReadOnlyPanel labelledBy={titleId}>
      <SectionHeading
        eyebrow="Source anchors"
        headingLevel={headingLevel}
        id={titleId}
        summary="Anchors identify where evidence can be reviewed without displaying raw full files."
        title="Source anchor panel"
      />
      <ReadOnlyList
        emptyLabel="No source anchors are available for this state."
        items={sourceAnchors}
        renderItem={(anchor) => (
          <SourceAnchorRow
            anchor={anchor}
            headingLevel={itemHeadingLevel}
            sectionIdScope={sectionIdScope}
          />
        )}
      />
    </ReadOnlyPanel>
  );
}

function SourceAnchorRow({
  anchor,
  headingLevel,
  sectionIdScope,
}: {
  anchor: ReadOnlyAppMcpSourceAnchor;
  headingLevel: ReadOnlyAppMcpHeadingLevel;
  sectionIdScope?: string;
}) {
  const titleId = createReadOnlyAppMcpSectionId({
    scope: sectionIdScope,
    section: "source-anchor",
    suffix: anchor.sourceAnchorId,
  });
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <article aria-labelledby={titleId} style={compactPanelStyle}>
      <HeadingTag id={titleId} style={strongBodyStyle}>
        {anchor.title}
      </HeadingTag>
      <p style={bodyStyle}>{anchor.summary}</p>
      <p style={bodyStyle}>
        Source <code>{anchor.sourceId}</code>, anchor{" "}
        <code>{anchor.sourceAnchorId}</code>, {anchor.locator}
      </p>
      {anchor.checksumSha256 ? (
        <p style={bodyStyle}>
          Checksum: <code>{anchor.checksumSha256}</code>
        </p>
      ) : null}
    </article>
  );
}
