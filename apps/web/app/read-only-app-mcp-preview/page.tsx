import React from "react";
import {
  ReadOnlyAppMcpEnvelopePreview,
  type ReadOnlyAppMcpCitation,
  type ReadOnlyAppMcpEvidenceCard,
  type ReadOnlyAppMcpForbiddenAction,
  type ReadOnlyAppMcpFreshness,
  type ReadOnlyAppMcpLimitation,
  type ReadOnlyAppMcpPermittedNextAction,
  type ReadOnlyAppMcpSourceAnchor,
} from "../../components/read-only-app-mcp";

const previewFreshness: ReadOnlyAppMcpFreshness = {
  checkedAt: "2026-05-09T23:32:41.000Z",
  failClosedIfStale: true,
  state: "fresh",
  summary:
    "Synthetic local preview freshness posture; no runtime evidence lookup is performed.",
};

const previewLimitations: ReadOnlyAppMcpLimitation[] = [
  {
    code: "local_preview_only",
    severity: "info",
    summary:
      "This page is a local read-only preview over synthetic contract-shaped props.",
  },
  {
    code: "bounded_excerpt_only",
    severity: "warning",
    summary:
      "The preview demonstrates bounded citation posture without displaying a full source body.",
  },
];

const previewCitations: ReadOnlyAppMcpCitation[] = [
  {
    boundedExcerptOnly: true,
    citationId: "synthetic-preview-citation-1",
    locator: "synthetic lines 1-3",
    sourceAnchorId: "synthetic-preview-anchor-1",
    summary:
      "Synthetic bounded citation summary for local preview rendering only.",
  },
];

const previewEvidenceCards: ReadOnlyAppMcpEvidenceCard[] = [
  {
    citations: previewCitations,
    evidenceCardId: "synthetic-preview-evidence-card-1",
    freshness: previewFreshness,
    limitations: previewLimitations,
    sourceAnchorIds: ["synthetic-preview-anchor-1"],
    summary:
      "Synthetic evidence-card posture used only to render the local read-only preview route.",
    title: "Synthetic preview evidence card",
  },
];

const previewSourceAnchors: ReadOnlyAppMcpSourceAnchor[] = [
  {
    checksumSha256:
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    locator: "synthetic lines 1-3",
    sourceAnchorId: "synthetic-preview-anchor-1",
    sourceId: "synthetic-preview-source-1",
    summary:
      "Synthetic source-anchor summary; the preview does not display a full source body.",
    title: "Synthetic preview source anchor",
  },
];

const previewPermittedNextActions: ReadOnlyAppMcpPermittedNextAction[] = [
  {
    action: "request_human_review",
    label: "Human evidence review only",
    summary:
      "A human may compare the cited synthetic preview posture outside this page.",
  },
];

const previewForbiddenActions: ReadOnlyAppMcpForbiddenAction[] = [
  {
    action: "external_release",
    reason: "External release remains future-plan-only.",
  },
  {
    action: "finance_write",
    reason: "Finance writes are unavailable in this read-only preview.",
  },
  {
    action: "provider_call",
    reason: "Provider activity remains outside this local route foundation.",
  },
];

const previewPrivacyBoundary = {
  items: [
    "Synthetic contract-shaped examples only.",
    "No real finance data or private company artifacts.",
    "No private secrets or provider access material.",
  ],
  summary:
    "The route renders local proof props only; it is not public demo data or source truth.",
  title: "Privacy boundary",
};

const previewNoRuntimeBoundary = {
  items: [
    "No data fetch, API call, or POST.",
    "No form, button, file-input control, or server action.",
    "No web API route, backend route, endpoint, or remote MCP server.",
    "No Apps SDK resource, OAuth, app submission asset, OpenAI API call, or model call.",
  ],
  summary:
    "The preview route renders existing local components with in-memory props only.",
  title: "No-runtime boundary",
};

export default function ReadOnlyAppMcpPreviewPage() {
  return (
    <ReadOnlyAppMcpEnvelopePreview
      citations={previewCitations}
      evidenceCards={previewEvidenceCards}
      forbiddenActions={previewForbiddenActions}
      freshness={previewFreshness}
      limitations={previewLimitations}
      noRuntimeBoundary={previewNoRuntimeBoundary}
      permittedNextActions={previewPermittedNextActions}
      privacyBoundary={previewPrivacyBoundary}
      scopeId="local-preview-route"
      shellSubtitle="Local proof-only route preview for the shipped read-only app/MCP UI composition."
      shellTitle="Pocket CFO read-only app/MCP preview"
      sourceAnchors={previewSourceAnchors}
      status={{
        answer: {
          evidenceCount: previewEvidenceCards.length,
          freshness: previewFreshness,
          statusLabel: "Evidence-backed preview",
          summary:
            "Synthetic evidence, citations, freshness, limitations, and boundaries are visible before any public app work.",
          title: "Read-only preview status",
        },
        kind: "answer",
      }}
      summary="One local page renders the shipped FP-0091 and FP-0092 component composition without transport or mutation behavior."
      title="Local read-only premium UI preview"
    />
  );
}
