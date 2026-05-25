export type LocalPreviewDemoBridgeStatus = {
  label: string;
  tone: "danger" | "fresh" | "proof" | "warning";
};

export type LocalPreviewDemoBridgeLane = {
  description: string;
  label: string;
  statuses: LocalPreviewDemoBridgeStatus[];
  title: string;
};

export type LocalPreviewDemoBridgeSnapshot = {
  authBoundaryLane: LocalPreviewDemoBridgeLane;
  boundaryBadges: string[];
  evidenceSnapshot: {
    capabilityBoundarySummary: string;
    citationSummary: string;
    companyPostureSummary: string;
    documentMapSummary: string;
    evidenceCardSummary: string;
    sourceAnchorSummary: string;
    sourceCoverageSummary: string;
  };
  evidenceToolLane: LocalPreviewDemoBridgeLane;
  localOnly: true;
  noRuntime: true;
  noPublicApp: true;
  noRealFinanceData: true;
  productionTokenValidationImplemented: false;
  publicChatGptAppImplemented: false;
  schemaVersion: string;
};

export const localPreviewDemoBridgeSnapshot = {
  authBoundaryLane: {
    description:
      "Local challenge-boundary smoke, not production authentication.",
    label: "Auth boundary lane",
    statuses: [
      { label: "Missing-token challenge verified", tone: "fresh" },
      {
        label:
          "Authorization-present sanitized invalid-token challenge verified",
        tone: "fresh",
      },
      { label: "Protected-resource metadata verified", tone: "fresh" },
      { label: "No credential/parser exposure verified", tone: "proof" },
      {
        label: "Production token validation implemented: false",
        tone: "warning",
      },
    ],
    title: "Local challenge-boundary smoke",
  },
  boundaryBadges: [
    "Local-only synthetic preview",
    "No production token validation",
    "No public ChatGPT App submission",
    "No real finance data",
    "No runtime fetch",
  ],
  evidenceSnapshot: {
    capabilityBoundarySummary:
      "Synthetic capability boundary: read-only evidence tools only, with write, provider, payment, release, and certification actions unavailable.",
    citationSummary:
      "Synthetic bounded citation: one local citation points to the synthetic source anchor without exposing a source body.",
    companyPostureSummary:
      "Synthetic company posture: local demo company posture is illustrative only and is not a finance fact.",
    documentMapSummary:
      "Synthetic document map: one local document node links the evidence card to the source anchor.",
    evidenceCardSummary:
      "Synthetic evidence card: one static card demonstrates title, freshness, limitations, and bounded citation posture.",
    sourceAnchorSummary:
      "Synthetic source-anchor status: fetch_source_anchor verified and displayed as a first-class bridge status.",
    sourceCoverageSummary:
      "Synthetic source coverage: the local bridge shows coverage present for the synthetic source anchor only.",
  },
  evidenceToolLane: {
    description:
      "Synthetic local read-only evidence dispatch smoke, not authenticated tool execution.",
    label: "Evidence tool lane",
    statuses: [
      { label: "Exact read-only MCP tool allowlist verified", tone: "fresh" },
      { label: "search_evidence verified", tone: "fresh" },
      { label: "fetch_evidence_card verified", tone: "fresh" },
      { label: "fetch_source_anchor verified", tone: "fresh" },
      { label: "fetch_document_map verified", tone: "fresh" },
      { label: "fetch_source_coverage verified", tone: "fresh" },
      { label: "fetch_company_posture verified", tone: "fresh" },
      { label: "fetch_capability_boundaries verified", tone: "fresh" },
      { label: "companyKey mismatch fails closed", tone: "proof" },
      { label: "invalid tool/arguments fail closed", tone: "proof" },
    ],
    title: "Synthetic read-only evidence dispatch smoke",
  },
  localOnly: true,
  noPublicApp: true,
  noRealFinanceData: true,
  noRuntime: true,
  productionTokenValidationImplemented: false,
  publicChatGptAppImplemented: false,
  schemaVersion:
    "v2cb.read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge.v1",
} as const satisfies LocalPreviewDemoBridgeSnapshot;
