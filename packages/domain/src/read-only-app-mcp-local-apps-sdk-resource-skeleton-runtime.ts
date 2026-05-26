export const MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_RUNTIME_SCHEMA_VERSION =
  "v2ce.read-only-chatgpt-app-mcp-local-apps-sdk-resource-skeleton-runtime.v1";

export const LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI =
  "ui://pocket-cfo/local-preview-demo.html";

export const LOCAL_APPS_SDK_RESOURCE_MIME_TYPE =
  "text/html;profile=mcp-app";

export const LOCAL_APPS_SDK_RESOURCE_WIDGET_DESCRIPTION =
  "Read-only synthetic Pocket CFO local preview skeleton. No production authentication, no real finance data. No public app submission.";

const DEFAULT_SYNTHETIC_SNAPSHOT = {
  authBoundaryLaneStatus:
    "Synthetic local challenge boundary only; not production authentication.",
  evidenceToolLaneStatus:
    "Synthetic read-only evidence lane only; not authenticated evidence execution.",
  freshnessPosture: "Static synthetic local preview snapshot.",
  limitations: [
    "No registerResource default wiring.",
    "No tool output template.",
    "No public ChatGPT App submission.",
  ],
  localOnly: true,
  noRealFinanceData: true,
  noRuntime: true,
  publicChatGptAppImplemented: false,
  sourceAnchorStatus:
    "Synthetic source-anchor status only; no source content.",
  productionTokenValidationImplemented: false,
} as const;

const ACCEPTED_SNAPSHOT_KEYS = [
  "authBoundaryLaneStatus",
  "evidenceToolLaneStatus",
  "freshnessPosture",
  "limitations",
  "localOnly",
  "noRealFinanceData",
  "noRuntime",
  "publicChatGptAppImplemented",
  "sourceAnchorStatus",
  "productionTokenValidationImplemented",
] as const;

const FORBIDDEN_HTML_PATTERNS = [
  /<script\b/iu,
  /<\/script>/iu,
  /<a\b/iu,
  /<button\b/iu,
  /<form\b/iu,
  /<input\b/iu,
  /<select\b/iu,
  /<textarea\b/iu,
  /https?:\/\//iu,
  /\bwww\./iu,
  /\bwindow\s*\.\s*openai\b/iu,
  /["']\/mcp["']/iu,
  /\b(?:upload|select files|payment|provider call|send report|certification control|source pack|public demo data)\b/iu,
] as const;

const FORBIDDEN_INPUT_PATTERNS = [
  /\bauthorization\b/iu,
  /\bparser decision\b/iu,
  /\btoken(?: material|-derived)?\b/iu,
  /\bprivate field\b/iu,
  /\bsource body text\b/iu,
  /\bsource dump\b/iu,
  /\breal finance\b/iu,
  /\bprovider data\b/iu,
  /\bmodel output\b/iu,
  /\bwrite output\b/iu,
  /https?:\/\//iu,
  /<[^>]+>/u,
] as const;

type AcceptedSnapshotKey = (typeof ACCEPTED_SNAPSHOT_KEYS)[number];

export type ReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot = Partial<{
  authBoundaryLaneStatus: string;
  evidenceToolLaneStatus: string;
  freshnessPosture: string;
  limitations: readonly string[];
  localOnly: true;
  noRealFinanceData: true;
  noRuntime: true;
  publicChatGptAppImplemented: false;
  sourceAnchorStatus: string;
  productionTokenValidationImplemented: false;
}>;

export type ReadOnlyMcpLocalAppsSdkResourceSkeleton = {
  uri: typeof LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI;
  mimeType: typeof LOCAL_APPS_SDK_RESOURCE_MIME_TYPE;
  text: string;
  _meta: {
    ui: {
      prefersBorder: true;
      csp: {
        connectDomains: [];
        resourceDomains: [];
        frameDomains: [];
      };
    };
    "openai/widgetDescription": typeof LOCAL_APPS_SDK_RESOURCE_WIDGET_DESCRIPTION;
  };
};

type NormalizedSkeletonSnapshot = {
  authBoundaryLaneStatus: string;
  evidenceToolLaneStatus: string;
  freshnessPosture: string;
  limitations: readonly string[];
  localOnly: true;
  noRealFinanceData: true;
  noRuntime: true;
  publicChatGptAppImplemented: false;
  sourceAnchorStatus: string;
  productionTokenValidationImplemented: false;
};

export function buildReadOnlyMcpLocalAppsSdkResourceSkeleton(
  snapshot: ReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot = {},
): ReadOnlyMcpLocalAppsSdkResourceSkeleton {
  const safeSnapshot =
    sanitizeReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot(snapshot);
  const html = buildSkeletonHtml(safeSnapshot);

  return {
    uri: LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    mimeType: LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
    text: html,
    _meta: {
      ui: {
        prefersBorder: true,
        csp: {
          connectDomains: [],
          resourceDomains: [],
          frameDomains: [],
        },
      },
      "openai/widgetDescription": LOCAL_APPS_SDK_RESOURCE_WIDGET_DESCRIPTION,
    },
  };
}

export function sanitizeReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot(
  snapshot: ReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot = {},
): NormalizedSkeletonSnapshot {
  const unknownKeys = Object.keys(snapshot).filter(
    (key) => !ACCEPTED_SNAPSHOT_KEYS.includes(key as AcceptedSnapshotKey),
  );
  if (unknownKeys.length > 0) {
    throw new Error(
      `Unsupported local Apps SDK resource skeleton snapshot fields: ${unknownKeys.join(
        ", ",
      )}`,
    );
  }

  const merged = { ...DEFAULT_SYNTHETIC_SNAPSHOT, ...snapshot };
  const normalizedLimitations = [...merged.limitations].map(assertSafeText);

  return {
    ...merged,
    authBoundaryLaneStatus: assertSafeText(merged.authBoundaryLaneStatus),
    evidenceToolLaneStatus: assertSafeText(merged.evidenceToolLaneStatus),
    freshnessPosture: assertSafeText(merged.freshnessPosture),
    limitations: normalizedLimitations,
    publicChatGptAppImplemented: false,
    sourceAnchorStatus: assertSafeText(merged.sourceAnchorStatus),
    productionTokenValidationImplemented: false,
  };
}

export function isReadOnlyMcpLocalAppsSdkResourceSkeletonStaticSanitizedHtml(
  html: string,
) {
  return (
    html.startsWith("<!doctype html>") &&
    FORBIDDEN_HTML_PATTERNS.every((pattern) => !pattern.test(html))
  );
}

function buildSkeletonHtml(snapshot: NormalizedSkeletonSnapshot) {
  const limitations = snapshot.limitations
    .map((limitation) => `<li>${escapeHtml(limitation)}</li>`)
    .join("");

  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    "<title>Pocket CFO local resource skeleton</title>",
    "</head>",
    "<body>",
    '<main data-local-only="true" data-read-only="true" data-no-runtime="true">',
    "<h1>Pocket CFO local resource skeleton</h1>",
    "<p>Read-only synthetic local preview skeleton.</p>",
    '<section aria-label="Boundary status">',
    "<h2>Boundary status</h2>",
    '<dl data-lanes="auth-boundary evidence-tool">',
    '<div data-lane-id="auth-boundary">',
    "<dt>Auth boundary lane</dt>",
    `<dd>${escapeHtml(snapshot.authBoundaryLaneStatus)}</dd>`,
    "</div>",
    '<div data-lane-id="evidence-tool">',
    "<dt>Evidence tool lane</dt>",
    `<dd>${escapeHtml(snapshot.evidenceToolLaneStatus)}</dd>`,
    "</div>",
    "<div>",
    "<dt>Source anchor status</dt>",
    `<dd>${escapeHtml(snapshot.sourceAnchorStatus)}</dd>`,
    "</div>",
    "<div>",
    "<dt>Freshness posture</dt>",
    `<dd>${escapeHtml(snapshot.freshnessPosture)}</dd>`,
    "</div>",
    "</dl>",
    "</section>",
    '<section aria-label="Implementation status">',
    "<h2>Implementation status</h2>",
    '<p data-production-token-validation-implemented="false">productionTokenValidationImplemented: false</p>',
    '<p data-public-chatgpt-app-implemented="false">publicChatGptAppImplemented: false</p>',
    "</section>",
    '<section aria-label="Limitations">',
    "<h2>Limitations</h2>",
    `<ul>${limitations}</ul>`,
    "</section>",
    "</main>",
    "</body>",
    "</html>",
  ].join("");
}

function assertSafeText(value: string) {
  const trimmed = value.trim();
  if (
    !trimmed ||
    FORBIDDEN_INPUT_PATTERNS.some((pattern) => pattern.test(trimmed))
  ) {
    throw new Error("Unsafe local Apps SDK resource skeleton snapshot text");
  }
  return trimmed;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&#39;");
}
