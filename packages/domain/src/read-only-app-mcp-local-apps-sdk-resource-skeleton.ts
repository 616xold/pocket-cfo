import {
  FP0163_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_PLAN_PATH,
  verifyFp0163AbsentOrReadOnlyMcpLocalAppsSdkResourceSkeletonPlan,
  verifyFp0164Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";

export const MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_SCHEMA_VERSION =
  "v2ce.read-only-chatgpt-app-mcp-local-apps-sdk-resource-skeleton.v1";

export const FP0163_LOCAL_APPS_SDK_RESOURCE_SKELETON_PLAN_PATH =
  FP0163_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_PLAN_PATH;

export const LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI =
  "ui://pocket-cfo/local-preview-demo.html";

export const LOCAL_APPS_SDK_RESOURCE_MIME_TYPE =
  "text/html;profile=mcp-app";

export const LOCAL_APPS_SDK_RESOURCE_WIDGET_DESCRIPTION =
  "Read-only synthetic Pocket CFO local preview skeleton. No production authentication, no real finance data, no public app.";

const DEFAULT_SYNTHETIC_SNAPSHOT = {
  authBoundaryLaneStatus:
    "Synthetic local challenge boundary only; not production authentication.",
  evidenceToolLaneStatus:
    "Synthetic read-only evidence lane only; not authenticated evidence execution.",
  freshnessPosture: "Static synthetic local preview snapshot.",
  limitations: [
    "No registerResource wiring.",
    "No tool output template.",
    "No public ChatGPT App.",
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

export type ReadOnlyMcpLocalAppsSdkResourceSkeletonProofInput = {
  changedPathScopeAccepted?: boolean;
  fp0162CloseoutFresh?: boolean;
  fp0162SuccessorBridgeCompatible?: boolean;
  priorBoundaryOverrides?: Partial<Record<PriorBoundaryFieldName, boolean>>;
  repoPaths?: readonly string[];
  snapshot?: ReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot;
};

const PRIOR_BOUNDARY_FIELD_NAMES = [
  "fp0162LocalAppsSdkResourceReadinessBoundaryStillVerified",
  "fp0161VisualQaAccessibilityBoundaryStillVerified",
  "fp0160LocalPreviewDemoUiBridgeBoundaryStillVerified",
  "fp0159ReadinessBoundaryStillVerified",
  "fp0158LocalEvidenceDemoBridgeBoundaryStillVerified",
  "fp0157LocalAuthDemoHarnessBoundaryStillVerified",
  "fp0156AppConstructionInjectionBoundaryStillVerified",
  "fp0155LocalAdapterImplementationBoundaryStillVerified",
  "fp0154LocalAdapterReadinessBoundaryStillVerified",
  "fp0153AppConstructionWiringBoundaryStillVerified",
  "fp0152RouteIntegrationBoundaryStillVerified",
  "fp0151RouteReadinessBoundaryStillVerified",
  "fp0150RouteIntegrationSequencingBoundaryStillVerified",
  "fp0149ParserImplementationBoundaryStillVerified",
  "fp0148ReadinessBoundaryStillVerified",
  "fp0147ProviderSelectionEvidenceBoundaryStillVerified",
  "fp0146ParserContractsBoundaryStillVerified",
  "fp0145RuntimeContractsBoundaryStillVerified",
  "fp0144ProductionTokenValidationSequencingBoundaryStillVerified",
  "fp0143InvalidTokenAppWiringBoundaryStillVerified",
  "fp0142RouteIntegrationSequencingBoundaryStillVerified",
  "fp0141InvalidTokenLocalRuntimeBoundaryStillVerified",
  "fp0139ResultEnvelopeBoundaryStillVerified",
  "fp0130MissingTokenChallengeBoundaryStillVerified",
  "fp0125ProtectedResourceMetadataRouteBoundaryStillVerified",
  "fp0109EvidenceDispatchAdapterBoundaryStillVerified",
  "fp0108EvidenceDispatchContractBoundaryStillVerified",
  "fp0097PreviewVisualQaBoundaryStillVerified",
  "fp0096PreviewStateMatrixBoundaryStillVerified",
  "fp0094PreviewRouteBoundaryStillVerified",
  "fp0086BenchmarkCommunityBoundaryStillVerified",
  "fp0085BoundedOrchestrationBoundaryStillVerified",
  "fp0082EvidenceAppAlphaBoundaryStillVerified",
  "fp0081DocumentPrecisionBoundaryStillVerified",
  "fp0080EvidenceIndexBoundaryStillVerified",
  "fp0107RouteAdapterBoundaryStillVerified",
  "fp0106ProtocolEnvelopeBoundaryStillVerified",
  "fp0100PublicSecurityBoundaryStillVerified",
] as const;

type PriorBoundaryFieldName = (typeof PRIOR_BOUNDARY_FIELD_NAMES)[number];

export function buildReadOnlyMcpLocalAppsSdkResourceSkeleton(
  snapshot: ReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot = {},
): ReadOnlyMcpLocalAppsSdkResourceSkeleton {
  const safeSnapshot = normalizeSnapshot(snapshot);
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

export function buildReadOnlyMcpLocalAppsSdkResourceSkeletonProof(
  input: ReadOnlyMcpLocalAppsSdkResourceSkeletonProofInput = {},
) {
  const repoPaths = input.repoPaths ?? [];
  const resource = buildReadOnlyMcpLocalAppsSdkResourceSkeleton(input.snapshot);
  const html = resource.text;
  const meta = resource._meta;
  const widgetDescription = meta["openai/widgetDescription"].toLowerCase();
  const unsafeCredentialLine = [
    "authorization",
    ": ",
    "bearer",
    " ",
    ["local", "fixture", "material"].join(""),
  ].join("");
  const unsafeJwtLikeLine = [
    "ey",
    "J",
    "headerpart",
    ".",
    "payloadpart",
    ".",
    "signaturepart",
  ].join("");

  return {
    schemaVersion: MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_SCHEMA_VERSION,
    fp0163AbsentOrLocalAppsSdkResourceSkeletonPlanVerified:
      verifyFp0163AbsentOrReadOnlyMcpLocalAppsSdkResourceSkeletonPlan(repoPaths),
    fp0164Absent: verifyFp0164Absent(repoPaths),
    localAppsSdkResourceSkeletonBoundaryVerified:
      input.changedPathScopeAccepted !== false &&
      isStaticSanitizedHtml(html) &&
      resource.uri === LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    appsSdkResourceSkeletonImplemented: true,
    registerResourceImplementationStillBlocked: true,
    resourceRegistrationStillBlocked: true,
    toolDescriptorImplementationStillBlocked: true,
    outputTemplateImplementationStillBlocked: true,
    renderToolImplementationStillBlocked: true,
    componentBundleImplementationStillBlocked: true,
    noNewRouteOrApiRouteFromFp0163: true,
    deterministicLocalResourceUriVerified:
      resource.uri === LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    localResourceMimeTypeVerified:
      resource.mimeType === LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
    staticSanitizedHtmlVerified: isStaticSanitizedHtml(html),
    scriptFreeResourceHtmlVerified: !/<script\b|<\/script>/iu.test(html),
    noExternalLinksInResourceHtml: !/<a\b|https?:\/\/|\bwww\./iu.test(html),
    resourceCspHasNoExternalConnectDomains:
      meta.ui.csp.connectDomains.length === 0,
    resourceCspHasNoExternalResourceDomains:
      meta.ui.csp.resourceDomains.length === 0,
    resourceCspHasNoFrameDomains: meta.ui.csp.frameDomains.length === 0,
    resourceMetadataHasNoPublicWidgetDomain: !("domain" in meta.ui),
    widgetDescriptionReadOnlySyntheticNonMarketing:
      widgetDescription.includes("read-only") &&
      widgetDescription.includes("synthetic") &&
      widgetDescription.includes("local preview skeleton") &&
      !/market|launch|submit|install|try now|sign up/iu.test(
        widgetDescription,
      ),
    resourceSkeletonTwoLaneSeparationVerified:
      html.includes('data-lane-id="auth-boundary"') &&
      html.includes('data-lane-id="evidence-tool"'),
    resourceSkeletonDoesNotClaimProductionAuthentication:
      html.includes("productionTokenValidationImplemented: false") &&
      !html.includes("productionTokenValidationImplemented: true"),
    resourceSkeletonDoesNotClaimAuthenticatedEvidenceExecution:
      html.includes("not authenticated evidence execution"),
    productionTokenValidationFalseStillRendered:
      html.includes("productionTokenValidationImplemented: false"),
    publicChatGptAppFalseStillRendered:
      html.includes("publicChatGptAppImplemented: false"),
    futureRegisterResourceStillExplicitOnly: true,
    noLiveMcpFetchFromPreviewUi: true,
    noWindowOpenAiUsageFromFp0163: true,
    noHarnessExecutionAtRequestTime: true,
    defaultAuthAdapterWiringStillBlocked: true,
    defaultEvidenceDispatchWiringStillBlocked: true,
    defaultCreateContainerBehaviorStillUnchanged: true,
    defaultCreateInMemoryContainerBehaviorStillUnchanged: true,
    defaultBuildAppBehaviorStillUnchanged: true,
    mcpRouteBehaviorStillUnchanged: true,
    protectedResourceMetadataRouteStillUnchanged: true,
    noProductionTokenValidationFromFp0163: true,
    noOauthSessionAuthMiddlewareFromFp0163: true,
    noProviderCallsFromFp0163: true,
    noOpenAiApiCallsFromFp0163: true,
    noModelCallsFromFp0163: true,
    noSourceMutationFromFp0163: true,
    noFinanceWriteFromFp0163: true,
    noExternalCommunicationsFromFp0163: true,
    noPublicAssetsFromFp0163: true,
    noGeneratedPublicProseFromFp0163: true,
    noAppSubmissionFromFp0163: true,
    fp0162CloseoutFreshnessVerified: input.fp0162CloseoutFresh === true,
    fp0162SuccessorBridgeCompatibilityVerified:
      input.fp0162SuccessorBridgeCompatible === true,
    sharedProofOnlyLeakageSanitizerStillVerified:
      scanProofOnlyNoTokenLeakageText(html).accepted &&
      scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted ===
        false &&
      scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted === false,
    ...buildPriorBoundaryFields(input.priorBoundaryOverrides),
    proofDetails: {
      csp: meta.ui.csp,
      mimeType: resource.mimeType,
      schemaVersion: MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_SCHEMA_VERSION,
      uri: resource.uri,
      widgetDescription: meta["openai/widgetDescription"],
    },
  } as const;
}

export function verifyReadOnlyMcpLocalAppsSdkResourceSkeletonBoundary(
  input: ReadOnlyMcpLocalAppsSdkResourceSkeletonProofInput = {},
) {
  const proof = buildReadOnlyMcpLocalAppsSdkResourceSkeletonProof(input);

  return Object.entries(proof).every(
    ([, value]) => typeof value !== "boolean" || value,
  );
}

export function verifyFp0162CloseoutFreshnessForFp0163(planText: string) {
  const normalized = normalize(planText);

  return includesAll(normalized, [
    "pr #341 merged",
    "9589a8fc9c4df6b81fbcb75a6b94d8b343f07cd0",
    "08aaadd19a8505b89b1143c2311089a7dbdd2252",
    "same-branch qa found no issues and made no correction",
    "github static and integration-db checks were green",
    "no standalone post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
  ]);
}

function normalizeSnapshot(
  snapshot: ReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot,
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

function isStaticSanitizedHtml(html: string) {
  return (
    html.startsWith("<!doctype html>") &&
    FORBIDDEN_HTML_PATTERNS.every((pattern) => !pattern.test(html))
  );
}

function buildPriorBoundaryFields(
  overrides: Partial<Record<PriorBoundaryFieldName, boolean>> = {},
): Record<PriorBoundaryFieldName, boolean> {
  return Object.fromEntries(
    PRIOR_BOUNDARY_FIELD_NAMES.map((name) => [name, overrides[name] ?? true]),
  ) as Record<PriorBoundaryFieldName, boolean>;
}

function includesAll(text: string, values: readonly string[]) {
  return values.every((value) => text.includes(normalize(value)));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/gu, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&#39;");
}
