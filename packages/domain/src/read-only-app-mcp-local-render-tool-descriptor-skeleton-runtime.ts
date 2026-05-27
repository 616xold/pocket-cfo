import { LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI } from "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime";

export const MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_RUNTIME_SCHEMA_VERSION =
  "v2ch.read-only-chatgpt-app-mcp-local-render-tool-descriptor-skeleton-runtime.v1";

export const READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_NAME =
  "render_pocket_cfo_local_preview_demo";

export const READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_TITLE =
  "Render Pocket CFO local preview";

export const READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_DESCRIPTION =
  "Render only prepared sanitized local preview structuredContent from prior local read-only evidence preview/demo bridge output.";

export const READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI =
  LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI;

export const READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_INVOCATION_STARTED =
  "Rendering local preview.";

export const READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_INVOCATION_DONE =
  "Local preview ready.";

export const READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_FIELD_CASING =
  "camelCase";

export const READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_REQUIRED_FIELDS =
  [
    "schemaVersion",
    "localOnly",
    "noRuntime",
    "noRealFinanceData",
    "noPublicApp",
    "authBoundaryLaneStatus",
    "evidenceToolLaneStatus",
    "sourceAnchorStatus",
    "freshnessPosture",
    "evidenceCardSummary",
    "citationSummary",
    "documentMapSummary",
    "sourceCoverageSummary",
    "companyPostureSummary",
    "capabilityBoundarySummary",
    "limitations",
    "productionTokenValidationImplemented",
    "publicChatGptAppImplemented",
  ] as const;

type RequiredStructuredContentField =
  (typeof READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_REQUIRED_FIELDS)[number];

export type ReadOnlyMcpLocalRenderToolDescriptorStructuredContent = {
  schemaVersion: string;
  localOnly: true;
  noRuntime: true;
  noRealFinanceData: true;
  noPublicApp: true;
  authBoundaryLaneStatus: string;
  evidenceToolLaneStatus: string;
  sourceAnchorStatus: string;
  freshnessPosture: string;
  evidenceCardSummary: string;
  citationSummary: string;
  documentMapSummary: string;
  sourceCoverageSummary: string;
  companyPostureSummary: string;
  capabilityBoundarySummary: string;
  limitations: readonly string[];
  productionTokenValidationImplemented: false;
  publicChatGptAppImplemented: false;
};

export type ReadOnlyMcpLocalRenderToolDescriptorSkeleton = {
  name: typeof READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_NAME;
  title: typeof READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_TITLE;
  description: typeof READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_DESCRIPTION;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  annotations: {
    readOnlyHint: true;
    destructiveHint: false;
    idempotentHint: true;
    openWorldHint: false;
  };
  _meta: {
    ui: {
      resourceUri: typeof READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI;
    };
    "openai/outputTemplate": typeof READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI;
    "openai/toolInvocation/invoking": typeof READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_INVOCATION_STARTED;
    "openai/toolInvocation/invoked": typeof READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_INVOCATION_DONE;
  };
};

const TEXT_SCHEMA = {
  maxLength: 360,
  minLength: 1,
  type: "string",
} as const;

const FORBIDDEN_STRUCTURED_CONTENT_TEXT_PATTERNS = [
  /\bauthorization\s*:/iu,
  /\bbearer\s+\S+/iu,
  /\b(?:jwt|jwks|introspection)\b/iu,
  /\btoken(?:\s|-)?(?:material|derived|fingerprint|value|parser)\b/iu,
  /\bparser\s+decision\b/iu,
  /\braw\s+source\b|\bsource\s+(?:body|dump|pack)\b/iu,
  /\bprivate\s+field\b|\bprovider\s+data\b|\bmodel\s+output\b|\bwrite\s+output\b/iu,
  /\bpublic\s+demo\s+data\b/iu,
  new RegExp(
    `\\b(?:actual|real)\\s+(?:bank|revenue|cash|customer|vendor|${[
      "pay",
      "roll",
    ].join("")}|ledger)\\b`,
    "iu",
  ),
  /https?:\/\/|\bwww\./iu,
  /<[^>]+>/u,
  /\bwindow\s*\.\s*openai\b|\bcallTool\b/iu,
  /\b(?:payment|provider call|send report|certification control|session cookie|jwt decoder)\b/iu,
] as const;

export function buildReadOnlyMcpLocalRenderToolDescriptorSkeleton(): ReadOnlyMcpLocalRenderToolDescriptorSkeleton {
  return {
    name: READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_NAME,
    title: READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_TITLE,
    description: READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_DESCRIPTION,
    inputSchema: buildDescriptorStructuredContentEnvelopeSchema(),
    outputSchema: buildDescriptorStructuredContentEnvelopeSchema(),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    _meta: {
      ui: {
        resourceUri: READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI,
      },
      "openai/outputTemplate":
        READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI,
      "openai/toolInvocation/invoking":
        READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_INVOCATION_STARTED,
      "openai/toolInvocation/invoked":
        READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_INVOCATION_DONE,
    },
  };
}

export function sanitizeReadOnlyMcpLocalRenderToolDescriptorStructuredContent(
  input: unknown,
): ReadOnlyMcpLocalRenderToolDescriptorStructuredContent {
  if (!isRecord(input)) {
    throw new Error("Local render descriptor structuredContent must be an object");
  }

  const unknownKeys = Object.keys(input).filter(
    (key) =>
      !READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_REQUIRED_FIELDS.includes(
        key as RequiredStructuredContentField,
      ),
  );
  if (unknownKeys.length > 0) {
    throw new Error(
      `Unsupported local render descriptor structuredContent fields: ${unknownKeys.join(
        ", ",
      )}`,
    );
  }

  for (const field of READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_REQUIRED_FIELDS) {
    if (!(field in input)) {
      throw new Error(
        `Missing local render descriptor structuredContent field: ${field}`,
      );
    }
  }

  return {
    authBoundaryLaneStatus: assertSafeText(input.authBoundaryLaneStatus),
    capabilityBoundarySummary: assertSafeText(input.capabilityBoundarySummary),
    citationSummary: assertSafeText(input.citationSummary),
    companyPostureSummary: assertSafeText(input.companyPostureSummary),
    documentMapSummary: assertSafeText(input.documentMapSummary),
    evidenceCardSummary: assertSafeText(input.evidenceCardSummary),
    evidenceToolLaneStatus: assertSafeText(input.evidenceToolLaneStatus),
    freshnessPosture: assertSafeText(input.freshnessPosture),
    limitations: assertSafeTextList(input.limitations),
    localOnly: assertLiteral(input.localOnly, true, "localOnly"),
    noPublicApp: assertLiteral(input.noPublicApp, true, "noPublicApp"),
    noRealFinanceData: assertLiteral(
      input.noRealFinanceData,
      true,
      "noRealFinanceData",
    ),
    noRuntime: assertLiteral(input.noRuntime, true, "noRuntime"),
    productionTokenValidationImplemented: assertLiteral(
      input.productionTokenValidationImplemented,
      false,
      "productionTokenValidationImplemented",
    ),
    publicChatGptAppImplemented: assertLiteral(
      input.publicChatGptAppImplemented,
      false,
      "publicChatGptAppImplemented",
    ),
    schemaVersion: assertSafeText(input.schemaVersion),
    sourceAnchorStatus: assertSafeText(input.sourceAnchorStatus),
    sourceCoverageSummary: assertSafeText(input.sourceCoverageSummary),
  };
}

function buildDescriptorStructuredContentEnvelopeSchema() {
  return {
    additionalProperties: false,
    properties: {
      structuredContent: buildStructuredContentSchema(),
    },
    required: ["structuredContent"],
    type: "object",
  };
}

function buildStructuredContentSchema() {
  return {
    additionalProperties: false,
    properties: {
      authBoundaryLaneStatus: TEXT_SCHEMA,
      capabilityBoundarySummary: TEXT_SCHEMA,
      citationSummary: TEXT_SCHEMA,
      companyPostureSummary: TEXT_SCHEMA,
      documentMapSummary: TEXT_SCHEMA,
      evidenceCardSummary: TEXT_SCHEMA,
      evidenceToolLaneStatus: TEXT_SCHEMA,
      freshnessPosture: TEXT_SCHEMA,
      limitations: {
        items: TEXT_SCHEMA,
        maxItems: 8,
        minItems: 1,
        type: "array",
      },
      localOnly: { const: true, type: "boolean" },
      noPublicApp: { const: true, type: "boolean" },
      noRealFinanceData: { const: true, type: "boolean" },
      noRuntime: { const: true, type: "boolean" },
      productionTokenValidationImplemented: { const: false, type: "boolean" },
      publicChatGptAppImplemented: { const: false, type: "boolean" },
      schemaVersion: TEXT_SCHEMA,
      sourceAnchorStatus: TEXT_SCHEMA,
      sourceCoverageSummary: TEXT_SCHEMA,
    },
    required: [
      ...READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_REQUIRED_FIELDS,
    ],
    type: "object",
  };
}

function assertLiteral<T extends boolean>(
  value: unknown,
  expected: T,
  field: string,
): T {
  if (value !== expected) {
    throw new Error(`Invalid local render descriptor field: ${field}`);
  }
  return expected;
}

function assertSafeText(value: unknown) {
  if (typeof value !== "string") {
    throw new Error("Local render descriptor text must be a string");
  }
  const trimmed = value.trim();
  if (
    !trimmed ||
    trimmed.length > TEXT_SCHEMA.maxLength ||
    FORBIDDEN_STRUCTURED_CONTENT_TEXT_PATTERNS.some((pattern) =>
      pattern.test(trimmed),
    )
  ) {
    throw new Error("Unsafe local render descriptor structuredContent text");
  }
  return trimmed;
}

function assertSafeTextList(value: unknown) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 8) {
    throw new Error("Local render descriptor limitations must be a bounded list");
  }
  return value.map(assertSafeText);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
