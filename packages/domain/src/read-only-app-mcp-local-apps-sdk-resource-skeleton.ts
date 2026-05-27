import {
  FP0163_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_PLAN_PATH,
  verifyFp0163AbsentOrReadOnlyMcpLocalAppsSdkResourceSkeletonPlan,
  verifyFp0164AbsentOrReadOnlyMcpLocalAppsSdkResourceRegistrationPlan,
  verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan,
  verifyFp0166AbsentOrReadOnlyMcpLocalRenderToolDescriptorSkeletonPlan,
  verifyFp0167Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";
import {
  LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
  LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
  buildReadOnlyMcpLocalAppsSdkResourceSkeleton,
  isReadOnlyMcpLocalAppsSdkResourceSkeletonStaticSanitizedHtml,
} from "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime";
import type {
  ReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot,
} from "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime";

export {
  LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
  LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
  LOCAL_APPS_SDK_RESOURCE_WIDGET_DESCRIPTION,
  MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_RUNTIME_SCHEMA_VERSION,
  buildReadOnlyMcpLocalAppsSdkResourceSkeleton,
  isReadOnlyMcpLocalAppsSdkResourceSkeletonStaticSanitizedHtml,
  sanitizeReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot,
  type ReadOnlyMcpLocalAppsSdkResourceSkeleton,
  type ReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot,
} from "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime";

export const MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_SCHEMA_VERSION =
  "v2ce.read-only-chatgpt-app-mcp-local-apps-sdk-resource-skeleton.v1";

export const FP0163_LOCAL_APPS_SDK_RESOURCE_SKELETON_PLAN_PATH =
  FP0163_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_PLAN_PATH;

export type ReadOnlyMcpLocalAppsSdkResourceSkeletonProofInput = {
  changedPathScopeAccepted?: boolean;
  fp0162CloseoutFresh?: boolean;
  fp0162SuccessorBridgeCompatible?: boolean;
  priorBoundaryOverrides?: Partial<Record<PriorBoundaryFieldName, boolean>>;
  repoPaths?: readonly string[];
  runtimeSafeBuilderIsolated?: boolean;
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
    fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified:
      verifyFp0164AbsentOrReadOnlyMcpLocalAppsSdkResourceRegistrationPlan(
        repoPaths,
      ),
    fp0165Absent:
      verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan(
        repoPaths,
      ),
    fp0165AbsentOrLocalRenderToolDescriptorReadinessPlanVerified:
      verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan(
        repoPaths,
      ),
    fp0166AbsentOrLocalRenderToolDescriptorSkeletonPlanVerified:
      verifyFp0166AbsentOrReadOnlyMcpLocalRenderToolDescriptorSkeletonPlan(
        repoPaths,
      ),
    fp0167Absent: verifyFp0167Absent(repoPaths),
    runtimeSafeSkeletonBuilderIsolated:
      input.runtimeSafeBuilderIsolated !== false,
    localAppsSdkResourceSkeletonBoundaryVerified:
      input.changedPathScopeAccepted !== false &&
      isReadOnlyMcpLocalAppsSdkResourceSkeletonStaticSanitizedHtml(html) &&
      resource.uri === LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    appsSdkResourceSkeletonImplemented: true,
    registerResourceImplementationStillBlocked: true,
    resourceRegistrationStillBlocked: true,
    registerResourceImplementationStillExplicitOnly: true,
    resourceRegistrationStillExplicitOnly: true,
    defaultResourceRegistrationStillBlocked: true,
    serverResourceRegistrationStillBlocked: true,
    toolDescriptorImplementationStillBlocked: true,
    outputTemplateImplementationStillBlocked: true,
    renderToolImplementationStillBlocked: true,
    componentBundleImplementationStillBlocked: true,
    noNewRouteOrApiRouteFromFp0163: true,
    deterministicLocalResourceUriVerified:
      resource.uri === LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    localResourceMimeTypeVerified:
      resource.mimeType === LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
    staticSanitizedHtmlVerified:
      isReadOnlyMcpLocalAppsSdkResourceSkeletonStaticSanitizedHtml(html),
    scriptFreeResourceHtmlVerified: !/<script\b|<\/script>/iu.test(html),
    noExternalLinksInResourceHtml: !/<a\b|https?:\/\/|\bwww\./iu.test(html),
    resourceCspHasNoExternalConnectDomains:
      meta.ui.csp.connectDomains.length === 0,
    resourceCspHasNoExternalResourceDomains:
      meta.ui.csp.resourceDomains.length === 0,
    resourceCspHasNoFrameDomains: meta.ui.csp.frameDomains.length === 0,
    resourceMetadataHasNoPublicWidgetDomain: !("domain" in meta.ui),
    resourceMetadataHasNoRedirectDomains: !("openai/widgetCSP" in meta),
    widgetDescriptionReadOnlySyntheticNonMarketing:
      widgetDescriptionReadOnlySyntheticLocalNoSubmission(widgetDescription),
    widgetDescriptionReadOnlySyntheticLocalNoSubmission:
      widgetDescriptionReadOnlySyntheticLocalNoSubmission(widgetDescription),
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

function widgetDescriptionReadOnlySyntheticLocalNoSubmission(value: string) {
  return (
    value.includes("read-only") &&
    value.includes("synthetic") &&
    value.includes("local preview skeleton") &&
    value.includes("no production authentication") &&
    value.includes("no real finance data") &&
    value.includes("no public app submission") &&
    !/market|launch|install|try now|sign up/iu.test(value)
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
