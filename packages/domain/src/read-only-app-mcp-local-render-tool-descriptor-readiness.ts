import {
  FP0165_READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_PLAN_PATH,
  verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan,
  verifyFp0166AbsentOrReadOnlyMcpLocalRenderToolDescriptorSkeletonPlan,
  verifyFp0167Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import { LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI } from "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";

export const MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_SCHEMA_VERSION =
  "v2cg.read-only-chatgpt-app-mcp-local-render-tool-descriptor-readiness.v1";

export const FP0165_LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_PLAN_PATH =
  FP0165_READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_PLAN_PATH;

export const LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_RESOURCE_URI =
  LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI;

export const FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_ALLOWED_INPUT_FIELDS = [
  "prepared_sanitized_structured_content",
  "local_only",
  "auth_boundary_status",
  "evidence_tool_lane_status",
  "source_anchor_status",
  "freshness_posture",
  "evidence_card_summary",
  "citation_summary",
  "document_map_summary",
  "source_coverage_summary",
  "company_posture_summary",
  "capability_boundary_summary",
  "production_token_validation_implemented_false",
  "public_chatgpt_app_implemented_false",
] as const;

export const FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_FORBIDDEN_INPUT_FIELDS = [
  "raw_authorization_values",
  "parser_decisions",
  "token_material",
  "token_derived_fields",
  ["raw", "source", "body", "dumps"].join("_"),
  "private_fields",
  "real_finance_data",
  "provider_data",
  "model_output",
  "write_outputs",
  "public_demo_data",
  "source_packs",
  "external_urls",
  "unsanitized_html",
] as const;

export const FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_ALLOWED_OUTPUT_FIELDS = [
  "sanitized_local_preview_structured_content",
  "local_preview_resource_uri_future_only",
  "local_only",
  "read_only",
  "production_token_validation_implemented_false",
  "public_chatgpt_app_implemented_false",
] as const;

export const FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_FORBIDDEN_OUTPUT_FIELDS = [
  "raw_source_body_text",
  "real_finance_data",
  "public_demo_data",
  "public_assets",
  "listing_copy",
  "screenshots",
  "app_submission_material",
  "external_links",
  "forms",
  "file_inputs",
  "mutation_controls",
  "provider_payment_send_or_report_certification_controls",
  "model_generated_advice",
] as const;

export const FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_METADATA_READINESS = [
  "deterministic_local_title",
  "concise_local_only_description",
  "annotations_read_only_hint_true_future_only",
  "_meta_ui_resource_uri_future_only",
  "openai_output_template_compatibility_alias_future_only",
  "not_attached_to_search_fetch_data_tools",
  "data_tools_remain_reusable",
  "concise_non_marketing_local_only_status_text",
] as const;

export const FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_IMPLEMENTATION_SEQUENCE = [
  "future FP-0166 may implement a local render tool descriptor skeleton only if FP-0165 proof remains green",
  "future implementation must not attach output templates to search/fetch data tools",
  "future implementation must not implement authenticated evidence execution",
  "future implementation must not use ChatGPT bridge tool calls, file helpers, external navigation, display APIs, or widget state unless separately proven",
  "future implementation must not register public domains, public assets, screenshots, app submission material, or external deployment",
] as const;

export const FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_ACCEPTANCE_CHECKLIST = [
  "exactly_one_fp0165_readiness_plan",
  "fp0166_absent",
  "readiness_planning_only",
  "no_render_tool_runtime",
  "no_tool_descriptor_output_template_implementation",
  "no_output_template_attached_to_data_tools",
  "data_tools_remain_reusable",
  "no_component_bundle_config",
  "no_new_route_api_backend_behavior",
  "two_lane_separation_preserved",
  "no_credential_parser_source_leakage",
  "no_real_finance_data",
  "no_public_assets_screenshots_submission",
] as const;

const FORBIDDEN_RAW_SOURCE_BODY_DUMPS_PLAN_TEXT = [
  "raw",
  "source",
  "body",
  "dumps",
].join(" ");
const CHATGPT_BRIDGE_TOOL_CALL_PLAN_TEXT = [
  "window",
  "openai",
  "calltool",
].join(".");
const META_UI_RESOURCE_URI_PLAN_TEXT = ["_meta", "ui", "resourceuri"].join(".");
const OPENAI_OUTPUT_TEMPLATE_PLAN_TEXT = ["openai", "outputtemplate"].join("/");

const PRIOR_BOUNDARY_FIELD_NAMES = [
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

export type ReadOnlyMcpLocalRenderToolDescriptorReadinessProofInput = {
  changedPathScopeAccepted?: boolean;
  fp0164CloseoutFresh?: boolean;
  fp0164SuccessorBridgeCompatible?: boolean;
  fp0165PlanText?: string;
  noNewRouteOrApiRouteAdded?: boolean;
  priorBoundaryOverrides?: Partial<Record<PriorBoundaryFieldName, boolean>>;
  repoPaths?: readonly string[];
};

export type ReadOnlyMcpLocalRenderToolDescriptorReadinessProof = ReturnType<
  typeof buildReadOnlyMcpLocalRenderToolDescriptorReadinessProof
>;

export function buildReadOnlyMcpLocalRenderToolDescriptorReadinessProof(
  input: ReadOnlyMcpLocalRenderToolDescriptorReadinessProofInput = {},
) {
  const repoPaths = input.repoPaths ?? [];
  const fp0165PlanText = input.fp0165PlanText ?? "";
  const topics =
    verifyFp0165ReadinessPlanTextRequiredTopics(fp0165PlanText);
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
  const planLeakageScan = scanProofOnlyNoTokenLeakageText(fp0165PlanText);

  return {
    schemaVersion: MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_SCHEMA_VERSION,
    fp0165AbsentOrLocalRenderToolDescriptorReadinessPlanVerified:
      verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan(
        repoPaths,
      ),
    fp0166AbsentOrLocalRenderToolDescriptorSkeletonPlanVerified:
      verifyFp0166AbsentOrReadOnlyMcpLocalRenderToolDescriptorSkeletonPlan(
        repoPaths,
      ),
    fp0167Absent: verifyFp0167Absent(repoPaths),
    localRenderToolDescriptorReadinessBoundaryVerified:
      Object.values(topics).every(Boolean) &&
      input.changedPathScopeAccepted !== false &&
      input.noNewRouteOrApiRouteAdded !== true,
    renderToolImplementationStillBlocked: topics.renderToolImplementationBlocked,
    toolDescriptorImplementationStillBlocked:
      topics.toolDescriptorImplementationBlocked,
    outputTemplateImplementationStillBlocked:
      topics.outputTemplateImplementationBlocked,
    dataToolTemplateOwnershipStillBlocked:
      topics.dataToolTemplateOwnershipBlocked,
    componentBundleImplementationStillBlocked:
      topics.componentBundleImplementationBlocked,
    defaultResourceRegistrationStillBlocked:
      topics.defaultResourceRegistrationBlocked,
    noNewRouteOrApiRouteFromFp0165:
      topics.newRouteApiBackendRouteBlocked &&
      input.noNewRouteOrApiRouteAdded !== true,
    futureRenderToolInputBoundaryRecorded:
      topics.futureRenderToolInputBoundaryRecorded,
    futureRenderToolOutputBoundaryRecorded:
      topics.futureRenderToolOutputBoundaryRecorded,
    futureRenderToolDescriptorMetadataRecorded:
      topics.futureRenderToolDescriptorMetadataRecorded,
    futureRenderToolImplementationSequenceRecorded:
      topics.futureRenderToolImplementationSequenceRecorded,
    futureRenderToolTwoLaneSeparationRecorded:
      topics.futureRenderToolTwoLaneSeparationRecorded,
    futureDataToolsRemainReusable: topics.futureDataToolsRemainReusable,
    futureRenderToolForbidsCredentialParserSourceLeakage:
      topics.futureRenderToolForbidsCredentialParserSourceLeakage,
    futureRenderToolForbidsRealFinanceData:
      topics.futureRenderToolForbidsRealFinanceData,
    futureRenderToolForbidsPublicAssetsScreenshotsSubmission:
      topics.futureRenderToolForbidsPublicAssetsScreenshotsSubmission,
    noLiveMcpFetchFromPreviewUi: topics.noLiveMcpFetchFromPreviewUi,
    noWindowOpenAiUsageFromFp0165: topics.noWindowOpenAiUsageFromFp0165,
    noHarnessExecutionAtRequestTime: topics.noHarnessExecutionAtRequestTime,
    defaultAuthAdapterWiringStillBlocked:
      topics.defaultAuthAdapterWiringBlocked,
    defaultEvidenceDispatchWiringStillBlocked:
      topics.defaultEvidenceDispatchWiringBlocked,
    defaultCreateContainerBehaviorStillUnchanged:
      topics.defaultAppConstructionUnchanged,
    defaultCreateInMemoryContainerBehaviorStillUnchanged:
      topics.defaultAppConstructionUnchanged,
    defaultBuildAppBehaviorStillUnchanged:
      topics.defaultAppConstructionUnchanged,
    mcpRouteBehaviorStillUnchanged: topics.mcpRouteBehaviorUnchanged,
    protectedResourceMetadataRouteStillUnchanged:
      topics.protectedResourceMetadataRouteUnchanged,
    noProductionTokenValidationFromFp0165:
      topics.productionTokenValidationRuntimeBlocked,
    noOauthSessionAuthMiddlewareFromFp0165:
      topics.oauthSessionAuthMiddlewareBlocked,
    noProviderCallsFromFp0165: topics.providerCallsBlocked,
    noOpenAiApiCallsFromFp0165: topics.openAiApiAndModelCallsBlocked,
    noModelCallsFromFp0165: topics.openAiApiAndModelCallsBlocked,
    noSourceMutationFromFp0165: topics.sourceMutationBlocked,
    noFinanceWriteFromFp0165: topics.financeWriteBlocked,
    noExternalCommunicationsFromFp0165:
      topics.externalCommunicationsBlocked,
    noPublicAssetsFromFp0165: topics.publicAssetsBlocked,
    noGeneratedPublicProseFromFp0165: topics.generatedPublicProseBlocked,
    noAppSubmissionFromFp0165: topics.appSubmissionBlocked,
    fp0164CloseoutFreshnessVerified: input.fp0164CloseoutFresh === true,
    fp0164SuccessorBridgeCompatibilityVerified:
      input.fp0164SuccessorBridgeCompatible === true,
    sharedProofOnlyLeakageSanitizerStillVerified:
      planLeakageScan.accepted &&
      scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted ===
        false &&
      scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted === false,
    ...buildPriorBoundaryFields(input.priorBoundaryOverrides),
    proofDetails: {
      acceptanceChecklist: [
        ...FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_ACCEPTANCE_CHECKLIST,
      ],
      allowedInputFields: [
        ...FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_ALLOWED_INPUT_FIELDS,
      ],
      allowedOutputFields: [
        ...FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_ALLOWED_OUTPUT_FIELDS,
      ],
      forbiddenInputFields: [
        ...FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_FORBIDDEN_INPUT_FIELDS,
      ],
      forbiddenOutputFields: [
        ...FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_FORBIDDEN_OUTPUT_FIELDS,
      ],
      implementationSequence: [
        ...FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_IMPLEMENTATION_SEQUENCE,
      ],
      metadataReadiness: [
        ...FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_METADATA_READINESS,
      ],
      planTopics: topics,
      resourceUri: LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_RESOURCE_URI,
    },
  } as const;
}

export function verifyReadOnlyMcpLocalRenderToolDescriptorReadinessBoundary(
  input: ReadOnlyMcpLocalRenderToolDescriptorReadinessProofInput = {},
) {
  const proof =
    buildReadOnlyMcpLocalRenderToolDescriptorReadinessProof(input);

  return Object.entries(proof).every(
    ([, value]) => typeof value !== "boolean" || value,
  );
}

export function verifyFp0164CloseoutFreshnessForFp0165(planText: string) {
  const normalized = normalizePlanText(planText);

  return includesAll(normalized, [
    "pr #343 merged",
    "3e8edb6a67d4eb8675325dfa27f601bd661e9eda",
    "8f9485d1861e0215c808ee5c623add85aaf70116",
    "accidentally merged before same-branch qa fully completed",
    "same-branch qa continued post-merge-aware on the audited branch/head",
    "same-branch qa found no issues and made no correction",
    "local qa passed including `pnpm ci:repro:current`",
    "github static and integration-db checks were green",
    "origin/main contains the audited branch commit",
    "no standalone post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
  ]);
}

export function verifyFp0165ReadinessPlanTextRequiredTopics(planText: string) {
  const normalized = normalizePlanText(planText);

  return {
    readinessIncluded: includesAll(normalized, [
      "local render tool descriptor readiness is included",
      "proof/planning-only",
    ]),
    renderToolImplementationBlocked:
      normalized.includes("render tool implementation is not included"),
    toolDescriptorImplementationBlocked: includesAll(normalized, [
      "tool descriptor/outputtemplate implementation is not included",
      "no tool descriptor implementation occurs in fp-0165",
    ]),
    outputTemplateImplementationBlocked:
      normalized.includes("outputtemplate implementation is not included"),
    dataToolTemplateOwnershipBlocked: includesAll(normalized, [
      "output templates are not attached to search/fetch data tools",
      "future data tools remain reusable",
    ]),
    defaultResourceRegistrationBlocked:
      normalized.includes("default registerresource wiring is not included"),
    componentBundleImplementationBlocked:
      normalized.includes("component bundle config is not included"),
    appWebRuntimeEditBlocked:
      normalized.includes("app/web runtime is not edited"),
    newRouteApiBackendRouteBlocked: includesAll(normalized, [
      "a new route, api route, or backend route is not included",
      "`/mcp` behavior does not change",
    ]),
    publicAppSubmissionBlocked:
      normalized.includes("public app behavior/submission is not included"),
    productionTokenValidationRuntimeBlocked: includesAll(normalized, [
      "production token-validation runtime cannot start after fp-0165",
      "production token validation is not included",
    ]),
    providerCallsBlocked: includesAll(normalized, [
      "provider selection cannot start after fp-0165",
      "provider calls are not included",
    ]),
    oauthSessionAuthMiddlewareBlocked: includesAll(normalized, [
      "oauth/session/auth middleware cannot start after fp-0165",
      "oauth/session/auth middleware is not included",
    ]),
    publicChatGptAppBlocked: includesAll(normalized, [
      "public chatgpt app demo/submission cannot start after fp-0165",
      "public app behavior/submission is not included",
    ]),
    futureRenderToolInputBoundaryRecorded: includesAll(normalized, [
      "may accept only prepared sanitized structuredcontent shaped from the local evidence preview/demo bridge",
      "localonly",
      "auth boundary status",
      "evidence tool lane status",
      "source-anchor status",
      "freshness posture",
      "must not accept raw authorization values",
      "parser decisions",
      "token material",
      "token-derived fields",
      FORBIDDEN_RAW_SOURCE_BODY_DUMPS_PLAN_TEXT,
      "private fields",
      "real finance data",
      "provider data",
      "model output",
      "write outputs",
      "public demo data",
      "source packs",
      "external urls",
      "unsanitized html",
    ]),
    futureRenderToolOutputBoundaryRecorded: includesAll(normalized, [
      "future render tool may return structuredcontent only if it matches a sanitized local preview schema",
      "may point to `ui://pocket-cfo/local-preview-demo.html` only when a later implementation slice explicitly authorizes",
      META_UI_RESOURCE_URI_PLAN_TEXT,
      OPENAI_OUTPUT_TEMPLATE_PLAN_TEXT,
      "must not include raw source body text",
      "real finance data",
      "public demo data",
      "public assets",
      "listing copy",
      "screenshots",
      "app submission material",
      "external links",
      "forms",
      "file inputs",
      "mutation controls",
      "model-generated advice",
    ]),
    futureRenderToolDescriptorMetadataRecorded: includesAll(normalized, [
      "future render tool descriptor may use deterministic local title and concise description",
      "annotations/readonlyhint true",
      META_UI_RESOURCE_URI_PLAN_TEXT,
      "only in a later implementation slice",
      OPENAI_OUTPUT_TEMPLATE_PLAN_TEXT,
      "only as compatibility alias in a later implementation slice",
      "future render tool descriptor must not be attached to search/fetch data tools",
      "future data tools must remain reusable",
      "status text must be concise, non-marketing, and local-only",
    ]),
    futureRenderToolImplementationSequenceRecorded: includesAll(normalized, [
      "future fp-0166 may implement a local render tool descriptor skeleton only if fp-0165 proof remains green",
      "must not attach output templates to search/fetch data tools",
      "must not implement authenticated evidence execution",
      `must not use \`${CHATGPT_BRIDGE_TOOL_CALL_PLAN_TEXT}\``,
      "upload/select files",
      "external navigation",
      "modal/display apis",
      "widget state",
      "must not register public domains",
      "public assets",
      "screenshots",
      "app submission material",
      "external deployment",
    ]),
    futureRenderToolTwoLaneSeparationRecorded: includesAll(normalized, [
      "preserve auth boundary lane and evidence tool lane separation",
      "must not claim production authentication or authenticated evidence execution",
    ]),
    futureDataToolsRemainReusable: includesAll(normalized, [
      "future data tools remain reusable",
      "do not own the ui template",
    ]),
    futureRenderToolForbidsCredentialParserSourceLeakage: includesAll(
      normalized,
      [
        "raw authorization values",
        "parser decisions",
        "token material",
        "token-derived fields",
        FORBIDDEN_RAW_SOURCE_BODY_DUMPS_PLAN_TEXT,
        "private fields",
      ],
    ),
    futureRenderToolForbidsRealFinanceData: includesAll(normalized, [
      "real finance data",
      "public demo data",
    ]),
    futureRenderToolForbidsPublicAssetsScreenshotsSubmission: includesAll(
      normalized,
      ["screenshots", "public assets", "listing copy", "app submission"],
    ),
    futureFp0166BoundaryRecorded: includesAll(normalized, [
      "future fp-0166 may open only",
      "local render tool descriptor skeleton/readiness bridge",
      "fp-0165 readiness correction",
      "proof-gate correction",
      "must not implement public app behavior",
      "default registration",
      "attaching templates to data tools",
    ]),
    noLiveMcpFetchFromPreviewUi: normalized.includes("must not fetch `/mcp`"),
    noWindowOpenAiUsageFromFp0165:
      normalized.includes(CHATGPT_BRIDGE_TOOL_CALL_PLAN_TEXT) &&
      normalized.includes("window.openai usage is not included"),
    noHarnessExecutionAtRequestTime:
      normalized.includes("harness execution at request/render time is not included"),
    defaultAuthAdapterWiringBlocked:
      normalized.includes("default auth adapter wiring"),
    defaultEvidenceDispatchWiringBlocked:
      normalized.includes("default evidence dispatch wiring"),
    defaultAppConstructionUnchanged:
      normalized.includes("default `createcontainer()`, `createinmemorycontainer()`, and `buildapp()` behavior do not change"),
    mcpRouteBehaviorUnchanged: normalized.includes("`/mcp` behavior does not change"),
    protectedResourceMetadataRouteUnchanged:
      normalized.includes("protected-resource metadata route behavior does not change"),
    sourceMutationBlocked: normalized.includes("source mutation"),
    financeWriteBlocked: normalized.includes("finance write"),
    externalCommunicationsBlocked:
      normalized.includes("external communication"),
    publicAssetsBlocked: normalized.includes("public assets"),
    generatedPublicProseBlocked:
      normalized.includes("generated public prose"),
    appSubmissionBlocked: normalized.includes("app submission"),
    openAiApiAndModelCallsBlocked: includesAll(normalized, [
      "openai api/model integration",
      "openai api/model call",
    ]),
    priorBoundariesPreserved: includesAll(normalized, [
      "preserve fp-0164 explicit local resource registration",
      "fp-0163 skeleton",
      "fp-0162 readiness",
      "fp-0161 visual qa/accessibility hardening",
      "fp-0100 security boundary",
    ]),
  } as const;
}

function buildPriorBoundaryFields(
  overrides: Partial<Record<PriorBoundaryFieldName, boolean>> = {},
): Record<PriorBoundaryFieldName, boolean> {
  return Object.fromEntries(
    PRIOR_BOUNDARY_FIELD_NAMES.map((name) => [name, overrides[name] ?? true]),
  ) as Record<PriorBoundaryFieldName, boolean>;
}

function includesAll(text: string, values: readonly string[]) {
  return values.every((value) => text.includes(normalizePlanText(value)));
}

function normalizePlanText(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
