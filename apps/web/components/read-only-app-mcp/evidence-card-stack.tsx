import React from "react";
import {
  createReadOnlyAppMcpSectionId,
  type ReadOnlyAppMcpHeadingLevel,
} from "./ids";
import {
  bodyStyle,
  colors,
  compactPanelStyle,
  strongBodyStyle,
} from "./styles";
import type { ReadOnlyAppMcpEvidenceCard } from "./types";
import { EmptyNote, ReadOnlyList, ReadOnlyPanel, SectionHeading } from "./ui";

type EvidenceCardStackProps = {
  cards: ReadOnlyAppMcpEvidenceCard[];
  headingLevel?: ReadOnlyAppMcpHeadingLevel;
  itemHeadingLevel?: ReadOnlyAppMcpHeadingLevel;
  sectionIdScope?: string;
};

export function EvidenceCardStack({
  cards,
  headingLevel,
  itemHeadingLevel = 3,
  sectionIdScope,
}: EvidenceCardStackProps) {
  const titleId = createReadOnlyAppMcpSectionId({
    scope: sectionIdScope,
    section: "evidence-cards",
  });

  return (
    <ReadOnlyPanel labelledBy={titleId}>
      <SectionHeading
        eyebrow="Evidence cards"
        headingLevel={headingLevel}
        id={titleId}
        summary="Cards summarize bounded, cited evidence. They are review surfaces, not source truth."
        title="Evidence card stack"
      />
      <ReadOnlyList
        emptyLabel="No evidence cards are available for this envelope."
        items={cards}
        renderItem={(card) => (
          <EvidenceCardRow
            card={card}
            headingLevel={itemHeadingLevel}
            sectionIdScope={sectionIdScope}
          />
        )}
      />
    </ReadOnlyPanel>
  );
}

function EvidenceCardRow({
  card,
  headingLevel,
  sectionIdScope,
}: {
  card: ReadOnlyAppMcpEvidenceCard;
  headingLevel: ReadOnlyAppMcpHeadingLevel;
  sectionIdScope?: string;
}) {
  const titleId = createReadOnlyAppMcpSectionId({
    scope: sectionIdScope,
    section: "evidence-card",
    suffix: card.evidenceCardId,
  });
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <article aria-labelledby={titleId} style={compactPanelStyle}>
      <div
        style={{
          alignItems: "start",
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "space-between",
        }}
      >
        <div>
          <HeadingTag id={titleId} style={strongBodyStyle}>
            {card.title}
          </HeadingTag>
          <p style={bodyStyle}>{card.summary}</p>
        </div>
      </div>
      {card.sourceAnchorIds.length > 0 ? (
        <p style={bodyStyle}>
          Source anchors:{" "}
          {card.sourceAnchorIds.map((sourceAnchorId) => (
            <code key={sourceAnchorId} style={{ color: colors.ink }}>
              {sourceAnchorId}{" "}
            </code>
          ))}
        </p>
      ) : (
        <EmptyNote>No source anchors are attached to this card.</EmptyNote>
      )}
      <p style={bodyStyle}>Citations: {card.citations.length}</p>
      <p style={bodyStyle}>Limitations: {card.limitations.length}</p>
    </article>
  );
}
