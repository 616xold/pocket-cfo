import React from "react";
import { AppShell } from "./app-shell";
import { CitationRail } from "./citation-rail";
import { EvidenceAnswerPanel } from "./evidence-answer-panel";
import { EvidenceCardStack } from "./evidence-card-stack";
import { ForbiddenActionsPanel } from "./forbidden-actions-panel";
import { FreshnessSummaryPanel } from "./freshness-summary-panel";
import { createReadOnlyAppMcpSectionId } from "./ids";
import { LimitationCallout } from "./limitation-callout";
import { NoRuntimeBoundaryPanel } from "./no-runtime-boundary-panel";
import { PermittedNextActionsPanel } from "./permitted-next-actions-panel";
import { PrivacyBoundaryPanel } from "./privacy-boundary-panel";
import { RefusalPanel } from "./refusal-panel";
import { stackStyle, twoColumnGridStyle } from "./styles";
import { SourceAnchorPanel } from "./source-anchor-panel";
import type {
  ReadOnlyAppMcpAnswer,
  ReadOnlyAppMcpBoundary,
  ReadOnlyAppMcpCitation,
  ReadOnlyAppMcpEvidenceCard,
  ReadOnlyAppMcpForbiddenAction,
  ReadOnlyAppMcpFreshness,
  ReadOnlyAppMcpLimitation,
  ReadOnlyAppMcpPermittedNextAction,
  ReadOnlyAppMcpRefusal,
  ReadOnlyAppMcpSourceAnchor,
} from "./types";
import { SectionHeading } from "./ui";

export type ReadOnlyAppMcpEnvelopeStatus =
  | {
      answer: ReadOnlyAppMcpAnswer;
      kind: "answer";
    }
  | {
      kind: "refusal";
      refusal: ReadOnlyAppMcpRefusal;
    };

export type ReadOnlyAppMcpExperienceFrameProps = {
  citations: ReadOnlyAppMcpCitation[];
  evidenceCards: ReadOnlyAppMcpEvidenceCard[];
  forbiddenActions: ReadOnlyAppMcpForbiddenAction[];
  freshness: ReadOnlyAppMcpFreshness;
  limitations: ReadOnlyAppMcpLimitation[];
  noRuntimeBoundary: ReadOnlyAppMcpBoundary;
  permittedNextActions: ReadOnlyAppMcpPermittedNextAction[];
  privacyBoundary: ReadOnlyAppMcpBoundary;
  scopeId?: string;
  sourceAnchors: ReadOnlyAppMcpSourceAnchor[];
  status: ReadOnlyAppMcpEnvelopeStatus;
  summary: string;
  title: string;
};

export type ReadOnlyAppMcpEnvelopePreviewProps =
  ReadOnlyAppMcpExperienceFrameProps & {
    shellSubtitle: string;
    shellTitle: string;
  };

export function ReadOnlyAppMcpEnvelopePreview({
  shellSubtitle,
  shellTitle,
  ...frameProps
}: ReadOnlyAppMcpEnvelopePreviewProps) {
  return (
    <AppShell subtitle={shellSubtitle} title={shellTitle}>
      <ReadOnlyAppMcpExperienceFrame {...frameProps} />
    </AppShell>
  );
}

export function ReadOnlyAppMcpExperienceFrame({
  citations,
  evidenceCards,
  forbiddenActions,
  freshness,
  limitations,
  noRuntimeBoundary,
  permittedNextActions,
  privacyBoundary,
  scopeId = "local-composition-preview",
  sourceAnchors,
  status,
  summary,
  title,
}: ReadOnlyAppMcpExperienceFrameProps) {
  const frameTitleId = createReadOnlyAppMcpSectionId({
    scope: scopeId,
    section: "experience-frame",
  });
  const childScope = (name: string) => `${scopeId}-${name}`;

  return (
    <section
      aria-labelledby={frameTitleId}
      data-layout="read-only-app-mcp-experience-frame"
      data-responsive="narrow-wide"
      style={stackStyle}
    >
      <SectionHeading
        eyebrow="Local envelope preview"
        headingLevel={2}
        id={frameTitleId}
        summary={summary}
        title={title}
      />
      {status.kind === "answer" ? (
        <EvidenceAnswerPanel
          answer={status.answer}
          headingLevel={3}
          sectionIdScope={childScope("answer")}
        />
      ) : (
        <RefusalPanel
          headingLevel={3}
          refusal={status.refusal}
          sectionIdScope={childScope("refusal")}
        />
      )}
      <EvidenceCardStack
        cards={evidenceCards}
        headingLevel={3}
        itemHeadingLevel={4}
        sectionIdScope={childScope("evidence-cards")}
      />
      <CitationRail
        citations={citations}
        headingLevel={3}
        sectionIdScope={childScope("citations")}
      />
      <SourceAnchorPanel
        headingLevel={3}
        itemHeadingLevel={4}
        sectionIdScope={childScope("source-anchors")}
        sourceAnchors={sourceAnchors}
      />
      <FreshnessSummaryPanel
        freshness={freshness}
        headingLevel={3}
        sectionIdScope={childScope("freshness")}
      />
      <LimitationCallout
        headingLevel={3}
        limitations={limitations}
        sectionIdScope={childScope("limitations")}
      />
      <div
        data-layout="read-only-app-mcp-boundary-grid"
        data-responsive="narrow-wide"
        style={twoColumnGridStyle}
      >
        <PermittedNextActionsPanel
          actions={permittedNextActions}
          headingLevel={3}
          sectionIdScope={childScope("permitted-actions")}
        />
        <ForbiddenActionsPanel
          actions={forbiddenActions}
          headingLevel={3}
          sectionIdScope={childScope("forbidden-actions")}
        />
        <PrivacyBoundaryPanel
          boundary={privacyBoundary}
          headingLevel={3}
          sectionIdScope={childScope("privacy")}
        />
        <NoRuntimeBoundaryPanel
          boundary={noRuntimeBoundary}
          headingLevel={3}
          sectionIdScope={childScope("no-runtime")}
        />
      </div>
    </section>
  );
}
