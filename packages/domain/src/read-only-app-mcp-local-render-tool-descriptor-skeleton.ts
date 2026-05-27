import {
  FP0166_READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_PLAN_PATH,
  verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan,
  verifyFp0166AbsentOrReadOnlyMcpLocalRenderToolDescriptorSkeletonPlan,
  verifyFp0167Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_RUNTIME_SCHEMA_VERSION,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_DESCRIPTION,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_NAME,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_FIELD_CASING,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_REQUIRED_FIELDS,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_TITLE,
  buildReadOnlyMcpLocalRenderToolDescriptorSkeleton,
  sanitizeReadOnlyMcpLocalRenderToolDescriptorStructuredContent,
} from "./read-only-app-mcp-local-render-tool-descriptor-skeleton-runtime";
import { scanProofOnlyNoTokenLeakageText } from "./read-only-app-mcp-token-validation";

export * from "./read-only-app-mcp-local-render-tool-descriptor-skeleton-runtime";

export const MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_SCHEMA_VERSION =
  "v2ch.read-only-chatgpt-app-mcp-local-render-tool-descriptor-skeleton.v1";

export const FP0166_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_PLAN_PATH =
  FP0166_READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_PLAN_PATH;

export const READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SAMPLE_STRUCTURED_CONTENT =
  {
    authBoundaryLaneStatus:
      "Local auth boundary is deferred; no production authentication.",
    capabilityBoundarySummary:
      "Read-only local preview capability boundary summary only.",
    citationSummary: "Synthetic local citation summary only.",
    companyPostureSummary: "Synthetic company posture summary only.",
    documentMapSummary: "Synthetic local document map summary only.",
    evidenceCardSummary: "Synthetic local evidence card summary only.",
    evidenceToolLaneStatus:
      "Local evidence lane is deferred; no authenticated evidence execution.",
    freshnessPosture: "Static synthetic local preview freshness posture.",
    limitations: [
      "Local descriptor skeleton only.",
      "No render handler.",
      "No public ChatGPT App submission.",
    ],
    localOnly: true,
    noPublicApp: true,
    noRealFinanceData: true,
    noRuntime: true,
    productionTokenValidationImplemented: false,
    publicChatGptAppImplemented: false,
    schemaVersion: MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_RUNTIME_SCHEMA_VERSION,
    sourceAnchorStatus: "Synthetic local source anchor summary only.",
    sourceCoverageSummary: "Synthetic local source coverage summary only.",
  } as const;

const PRIOR_BOUNDARY_FIELD_NAMES = [
  "fp0165LocalRenderToolDescriptorReadinessBoundaryStillVerified",
  "fp0164LocalAppsSdkResourceRegistrationBoundaryStillVerified",
  "fp0163SkeletonBoundaryStillVerified",
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

export type ReadOnlyMcpLocalRenderToolDescriptorSkeletonProofInput = {
  changedPathScopeAccepted?: boolean;
  dataToolTemplateFree?: boolean;
  defaultRuntimeUnchanged?: boolean;
  descriptorRuntimeSource?: string;
  fp0165CloseoutFresh?: boolean;
  fp0165PlanText?: string;
  fp0166PlanText?: string;
  noNewRouteOrApiRouteAdded?: boolean;
  noPreviewRuntimeBridgeUsage?: boolean;
  priorBoundaryOverrides?: Partial<Record<PriorBoundaryFieldName, boolean>>;
  repoPaths?: readonly string[];
};

export type ReadOnlyMcpLocalRenderToolDescriptorSkeletonProof = ReturnType<
  typeof buildReadOnlyMcpLocalRenderToolDescriptorSkeletonProof
>;

export function buildReadOnlyMcpLocalRenderToolDescriptorSkeletonProof(
  input: ReadOnlyMcpLocalRenderToolDescriptorSkeletonProofInput = {},
) {
  const repoPaths = input.repoPaths ?? [];
  const descriptor = buildReadOnlyMcpLocalRenderToolDescriptorSkeleton();
  const planTopics = verifyFp0166SkeletonPlanTextRequiredTopics(
    input.fp0166PlanText ?? "",
  );
  const priorBoundaries = buildPriorBoundaryProof(
    input.priorBoundaryOverrides,
  );
  const canonicalFields = [
    ...READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_REQUIRED_FIELDS,
  ];
  const sanitizedSample =
    sanitizeReadOnlyMcpLocalRenderToolDescriptorStructuredContent(
      READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SAMPLE_STRUCTURED_CONTENT,
    );
  const leakageScan = scanProofOnlyNoTokenLeakageText(
    [input.fp0165PlanText ?? "", input.fp0166PlanText ?? ""].join("\n"),
  );
  const deterministicDescriptor =
    JSON.stringify(descriptor) ===
    JSON.stringify(buildReadOnlyMcpLocalRenderToolDescriptorSkeleton());
  const descriptorSchemaCanonical =
    READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_FIELD_CASING ===
      "camelCase" &&
    canonicalFields.every((field) => /^[a-z][A-Za-z0-9]*$/u.test(field));
  const descriptorMetadataVerified =
    descriptor.annotations.readOnlyHint === true &&
    descriptor._meta.ui.resourceUri ===
      READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI &&
    descriptor._meta["openai/outputTemplate"] ===
      READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI;

  return {
    schemaVersion: MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_SCHEMA_VERSION,
    fp0165AbsentOrLocalRenderToolDescriptorReadinessPlanVerified:
      verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan(
        repoPaths,
      ),
    fp0166AbsentOrLocalRenderToolDescriptorSkeletonPlanVerified:
      verifyFp0166AbsentOrReadOnlyMcpLocalRenderToolDescriptorSkeletonPlan(
        repoPaths,
      ),
    fp0167Absent: verifyFp0167Absent(repoPaths),
    localRenderToolDescriptorSkeletonBoundaryVerified:
      Object.values(planTopics).every(Boolean) &&
      input.changedPathScopeAccepted !== false,
    renderToolDescriptorSkeletonImplemented:
      descriptor.name === READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_NAME,
    renderToolRuntimeStillBlocked: planTopics.renderToolRuntimeBlocked,
    registerToolWiringStillBlocked: planTopics.registerToolWiringBlocked,
    serverToolRegistrationStillBlocked: planTopics.serverToolRegistrationBlocked,
    dataToolTemplateOwnershipStillBlocked:
      planTopics.dataToolTemplateOwnershipBlocked,
    dataToolOutputTemplatesStillBlocked:
      planTopics.dataToolOutputTemplatesBlocked &&
      input.dataToolTemplateFree !== false,
    defaultResourceRegistrationStillBlocked:
      planTopics.defaultResourceRegistrationBlocked,
    componentBundleImplementationStillBlocked:
      planTopics.componentBundleImplementationBlocked,
    noNewRouteOrApiRouteFromFp0166:
      planTopics.routeChangesBlocked && input.noNewRouteOrApiRouteAdded !== true,
    deterministicLocalRenderToolNameVerified:
      descriptor.name === READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_NAME,
    deterministicLocalDescriptorTitleVerified:
      descriptor.title === READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_TITLE,
    deterministicLocalDescriptorDescriptionVerified:
      descriptor.description ===
        READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_DESCRIPTION &&
      descriptor.description.includes("prepared sanitized local preview"),
    descriptorStructuredContentSchemaCanonicalized: descriptorSchemaCanonical,
    descriptorInputForbidsCredentialParserSourceLeakage:
      unsafeStructuredContentInputsAreRejected(),
    descriptorOutputForbidsCredentialParserSourceLeakage:
      unsafeStructuredContentInputsAreRejected(),
    descriptorForbidsRealFinanceData: unsafeStructuredContentInputsAreRejected(),
    descriptorForbidsPublicDemoData: unsafeStructuredContentInputsAreRejected(),
    descriptorForbidsPublicAssetsScreenshotsSubmission:
      planTopics.publicAssetsScreenshotsSubmissionBlocked,
    descriptorReadOnlyHintVerified: descriptor.annotations.readOnlyHint === true,
    descriptorResourceUriVerified:
      descriptor._meta.ui.resourceUri ===
      READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI,
    descriptorOpenAiOutputTemplateAliasVerified:
      descriptor._meta["openai/outputTemplate"] ===
      READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI,
    descriptorTemplateUriNotAttachedToDataTools:
      input.dataToolTemplateFree !== false,
    descriptorStatusTextLocalNonMarketing:
      isConciseLocalStatusText(
        descriptor._meta["openai/toolInvocation/invoking"],
      ) &&
      isConciseLocalStatusText(
        descriptor._meta["openai/toolInvocation/invoked"],
      ),
    runtimeSafeDescriptorSkeletonBuilderIsolated:
      input.descriptorRuntimeSource === undefined ||
      isRuntimeSafeDescriptorSkeletonSource(input.descriptorRuntimeSource),
    noLiveMcpFetchFromPreviewUi: input.noPreviewRuntimeBridgeUsage !== false,
    noWindowOpenAiUsageFromFp0166: input.noPreviewRuntimeBridgeUsage !== false,
    noHarnessExecutionAtRequestTime: planTopics.harnessExecutionBlocked,
    defaultAuthAdapterWiringStillBlocked: planTopics.defaultAuthBlocked,
    defaultEvidenceDispatchWiringStillBlocked:
      planTopics.defaultEvidenceDispatchBlocked,
    defaultCreateContainerBehaviorStillUnchanged:
      input.defaultRuntimeUnchanged !== false,
    defaultCreateInMemoryContainerBehaviorStillUnchanged:
      input.defaultRuntimeUnchanged !== false,
    defaultBuildAppBehaviorStillUnchanged:
      input.defaultRuntimeUnchanged !== false,
    mcpRouteBehaviorStillUnchanged: input.defaultRuntimeUnchanged !== false,
    protectedResourceMetadataRouteStillUnchanged:
      input.defaultRuntimeUnchanged !== false,
    noProductionTokenValidationFromFp0166:
      sanitizedSample.productionTokenValidationImplemented === false,
    noOauthSessionAuthMiddlewareFromFp0166: planTopics.oauthAuthBlocked,
    noProviderCallsFromFp0166: planTopics.providerCallsBlocked,
    noOpenAiApiCallsFromFp0166: planTopics.openAiApiModelCallsBlocked,
    noModelCallsFromFp0166: planTopics.openAiApiModelCallsBlocked,
    noSourceMutationFromFp0166: planTopics.sourceMutationBlocked,
    noFinanceWriteFromFp0166: planTopics.financeWriteBlocked,
    noExternalCommunicationsFromFp0166:
      planTopics.externalCommunicationsBlocked,
    noPublicAssetsFromFp0166: planTopics.publicAssetsScreenshotsSubmissionBlocked,
    noGeneratedPublicProseFromFp0166:
      planTopics.generatedPublicProseBlocked,
    noAppSubmissionFromFp0166: planTopics.appSubmissionBlocked,
    fp0165CloseoutFreshnessVerified:
      input.fp0165CloseoutFresh === true ||
      verifyFp0165CloseoutFreshnessForFp0166(input.fp0165PlanText ?? ""),
    fp0165SuccessorBridgeCompatibilityVerified:
      verifyFp0166AbsentOrReadOnlyMcpLocalRenderToolDescriptorSkeletonPlan(
        repoPaths,
      ),
    sharedProofOnlyLeakageSanitizerStillVerified: leakageScan.accepted,
    descriptorSkeletonDeterministicAndSideEffectFree: deterministicDescriptor,
    descriptorMetadataBoundaryVerified: descriptorMetadataVerified,
    descriptorInputOutputSchemaUsesSameSanitizedEnvelope:
      JSON.stringify(descriptor.inputSchema) ===
      JSON.stringify(descriptor.outputSchema),
    ...priorBoundaries,
  };
}

export function verifyReadOnlyMcpLocalRenderToolDescriptorSkeletonBoundary(
  input: ReadOnlyMcpLocalRenderToolDescriptorSkeletonProofInput = {},
) {
  const proof = buildReadOnlyMcpLocalRenderToolDescriptorSkeletonProof(input);
  return Object.entries(proof)
    .filter(([key]) => key !== "schemaVersion")
    .every(([, value]) => value === true);
}

export function verifyFp0165CloseoutFreshnessForFp0166(planText: string) {
  const normalized = normalize(planText);
  return [
    "pr #344 merged",
    "f5bd30467170493b87cbe8ee477a4453d6375e81",
    "bf025e120d2fea74f8615eb7546da44686a90c35",
    "same-branch qa",
    "found no",
    "pnpm ci:repro:current",
    "github `static` and `integration-db` checks were green",
    "no standalone post-merge qa is required",
  ].every((phrase) => normalized.includes(normalize(phrase)));
}

export function verifyFp0166SkeletonPlanTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    appSubmissionBlocked: includesAll(normalized, [
      "public chatgpt app submission cannot start after fp-0166",
      "app submission material",
    ]),
    componentBundleImplementationBlocked: normalized.includes(
      "component bundle config is not included",
    ),
    dataToolOutputTemplatesBlocked: includesAll(normalized, [
      "output templates are not attached to search/fetch data tools",
      "no outputtemplate/resourceuri on search/fetch data tools",
    ]),
    dataToolTemplateOwnershipBlocked: normalized.includes(
      "data tools remain reusable and do not own the ui template",
    ),
    defaultAuthBlocked: normalized.includes(
      "default auth adapter wiring is not included",
    ),
    defaultEvidenceDispatchBlocked: normalized.includes(
      "default evidence dispatch wiring is not included",
    ),
    defaultResourceRegistrationBlocked: normalized.includes(
      "default registerresource wiring is not included",
    ),
    externalCommunicationsBlocked: normalized.includes(
      "external communications are not included",
    ),
    financeWriteBlocked: normalized.includes("finance writes are not included"),
    generatedPublicProseBlocked: normalized.includes(
      "generated public prose is not included",
    ),
    harnessExecutionBlocked: normalized.includes(
      "harness execution at request/render time is not included",
    ),
    openAiApiModelCallsBlocked: includesAll(normalized, [
      "openai api calls are not included",
      "model calls are not included",
    ]),
    oauthAuthBlocked: normalized.includes(
      "oauth/session/auth middleware cannot start after fp-0166",
    ),
    providerCallsBlocked: normalized.includes(
      "provider calls are not included",
    ),
    publicAssetsScreenshotsSubmissionBlocked: includesAll(normalized, [
      "public assets are not included",
      "screenshots are not included",
      "app submission material is not included",
    ]),
    registerToolWiringBlocked: normalized.includes(
      "registertool wiring is not included",
    ),
    renderToolRuntimeBlocked: normalized.includes(
      "render tool runtime implementation is not included",
    ),
    routeChangesBlocked: normalized.includes(
      "new route, api route, or backend route is not included",
    ),
    serverToolRegistrationBlocked: normalized.includes(
      "mcp server tool registration is not included",
    ),
    sourceMutationBlocked: normalized.includes(
      "source mutation is not included",
    ),
  };
}

function unsafeStructuredContentInputsAreRejected() {
  const unsafeFragments = [
    ["Authori", "zation: ", "Be", "arer ", "local-fixture"].join(""),
    "parser decision retained",
    "token material",
    "raw source body dump",
    "private field",
    "real bank revenue",
    "provider data",
    "model output",
    "write output",
    "public demo data",
    "https://example.invalid",
    "<script>alert(1)</script>",
    "window.openai.callTool",
  ];

  return unsafeFragments.every((fragment) => {
    try {
      sanitizeReadOnlyMcpLocalRenderToolDescriptorStructuredContent({
        ...READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SAMPLE_STRUCTURED_CONTENT,
        evidenceCardSummary: fragment,
      });
      return false;
    } catch {
      return true;
    }
  });
}

function isConciseLocalStatusText(text: string) {
  return (
    text.length <= 40 &&
    /local preview/iu.test(text) &&
    !/(?:marketing|public|submit|deploy|external|https?:\/\/)/iu.test(text)
  );
}

function isRuntimeSafeDescriptorSkeletonSource(source: string) {
  return (
    source.includes(
      "read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime",
    ) &&
    !/node:(?:fs|child_process|http|https|net|tls|crypto|os|path|url)|from\s+["']react["']|from\s+["']next|fetch\s*\(|XMLHttpRequest|WebSocket|registerResource\s*\(|registerTool\s*\(|buildApp\s*\(|createContainer\s*\(|createInMemoryContainer\s*\(|from\s+["']openai["']|new\s+OpenAI\s*\(|process\.env|Date\.now\s*\(|Math\.random\s*\(|pino|logger|decodeJwt\s*\(|jwtDecode\s*\(|fetchJwks\s*\(|introspectToken\s*\(|oauthCallback\s*\(|sessionStore|setCookie/u.test(
      source,
    )
  );
}

function buildPriorBoundaryProof(
  overrides: Partial<Record<PriorBoundaryFieldName, boolean>> = {},
) {
  return Object.fromEntries(
    PRIOR_BOUNDARY_FIELD_NAMES.map((name) => [name, overrides[name] !== false]),
  ) as Record<PriorBoundaryFieldName, boolean>;
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}

function includesAll(text: string, phrases: readonly string[]) {
  return phrases.every((phrase) => text.includes(normalize(phrase)));
}
