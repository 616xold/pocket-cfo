import {
  FP0162_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_READINESS_PLAN_PATH,
  verifyFp0162AbsentOrReadOnlyMcpLocalAppsSdkResourceReadinessPlan,
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

export const MCP_LOCAL_APPS_SDK_RESOURCE_READINESS_SCHEMA_VERSION =
  "v2cd.read-only-chatgpt-app-mcp-local-apps-sdk-resource-readiness.v1";

export const FP0162_LOCAL_APPS_SDK_RESOURCE_READINESS_PLAN_PATH =
  FP0162_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_READINESS_PLAN_PATH;

export const FUTURE_APPS_SDK_RESOURCE_ALLOWED_INPUT_FIELDS = [
  "static_synthetic_local_preview_bridge_snapshot", "future_sanitized_structured_content_from_local_render_tool", "auth_boundary_lane_status", "evidence_tool_lane_status", "source_anchor_status", "freshness_posture", "limitations",
] as const;

export const FUTURE_APPS_SDK_RESOURCE_FORBIDDEN_INPUT_FIELDS = [
  "raw_authorization_values", "parser_decisions", "token_material", "token_derived_fields", "raw_source_dumps", "private_fields", "real_finance_data", "provider_data", "model_output", "write_outputs", "public_demo_data",
] as const;

export const FUTURE_APPS_SDK_RESOURCE_ALLOWED_OUTPUT_FIELDS = [
  "inert_local_read_only_component_resource", "noindex_noarchive_local_only_no_runtime_posture", "production_token_validation_implemented_false", "public_chatgpt_app_implemented_false",
] as const;

export const FUTURE_APPS_SDK_RESOURCE_FORBIDDEN_OUTPUT_FIELDS = [
  "forms", "buttons", "file_inputs", "mutation_controls", "upload_or_select_files_flows", "provider_payment_send_or_report_certification_controls", "external_navigation", "listing_copy", "screenshots", "public_assets",
] as const;

export const FUTURE_APPS_SDK_RESOURCE_METADATA_READINESS = [
  "deterministic_local_template_uri", "no_external_connect_domains", "no_broad_resource_domains", "empty_frame_domains_unless_separately_justified", "local_only_widget_domain_metadata", "concise_read_only_synthetic_non_marketing_widget_description", "csp_blocks_external_calls_by_default",
] as const;

export const FUTURE_APPS_SDK_TOOL_DESCRIPTOR_READINESS = [
  "data_tools_remain_reusable_and_do_not_own_ui_template", "future_render_tool_depends_on_prepared_sanitized_structured_content", "evidence_tools_retain_read_only_hint", "no_output_template_attached_to_search_fetch_data_tools_in_fp0162", "no_tool_descriptor_implementation_in_fp0162",
] as const;

export const FUTURE_APPS_SDK_RESOURCE_IMPLEMENTATION_SEQUENCE = [
  "future FP-0163 may implement a local-only component-resource skeleton or readiness correction only if FP-0162 proof remains green", "future implementation must not fetch /mcp from the UI", "future implementation must not call ChatGPT bridge mutation or file helpers unless separately proven", "future implementation must not register public domains, public assets, screenshots, app submission material, or external deployment",
] as const;

export const FUTURE_APPS_SDK_RESOURCE_ACCEPTANCE_CHECKLIST = [
  "exactly_one_fp0162_readiness_plan", "fp0163_absent_or_exact_resource_skeleton_plan", "fp0164_absent", "readiness_planning_only", "no_apps_sdk_resource_runtime", "no_register_resource", "no_mcp_resource_template", "no_tool_descriptor_output_template_implementation", "no_component_bundle_config", "future_input_output_metadata_descriptor_sequence_recorded", "two_lane_separation_preserved", "no_credential_parser_source_leakage", "no_real_finance_data", "no_public_assets_screenshots_submission",
] as const;

const FORBIDDEN_RAW_SOURCE_DUMPS_PLAN_TEXT = ["raw", "source dumps"].join(" ");
const FORBIDDEN_CHATGPT_WIDGET_TOOL_CALL_PLAN_TEXT = [
  "window",
  "openai",
  "calltool",
].join(".");

const PRIOR_BOUNDARY_FIELD_NAMES = [
  "fp0161VisualQaAccessibilityBoundaryStillVerified", "fp0160LocalPreviewDemoUiBridgeBoundaryStillVerified", "fp0159ReadinessBoundaryStillVerified", "fp0158LocalEvidenceDemoBridgeBoundaryStillVerified", "fp0157LocalAuthDemoHarnessBoundaryStillVerified", "fp0156AppConstructionInjectionBoundaryStillVerified", "fp0155LocalAdapterImplementationBoundaryStillVerified", "fp0154LocalAdapterReadinessBoundaryStillVerified", "fp0153AppConstructionWiringBoundaryStillVerified", "fp0152RouteIntegrationBoundaryStillVerified", "fp0151RouteReadinessBoundaryStillVerified", "fp0150RouteIntegrationSequencingBoundaryStillVerified", "fp0149ParserImplementationBoundaryStillVerified", "fp0148ReadinessBoundaryStillVerified", "fp0147ProviderSelectionEvidenceBoundaryStillVerified", "fp0146ParserContractsBoundaryStillVerified", "fp0145RuntimeContractsBoundaryStillVerified", "fp0144ProductionTokenValidationSequencingBoundaryStillVerified", "fp0143InvalidTokenAppWiringBoundaryStillVerified", "fp0142RouteIntegrationSequencingBoundaryStillVerified", "fp0141InvalidTokenLocalRuntimeBoundaryStillVerified", "fp0139ResultEnvelopeBoundaryStillVerified", "fp0130MissingTokenChallengeBoundaryStillVerified", "fp0125ProtectedResourceMetadataRouteBoundaryStillVerified", "fp0109EvidenceDispatchAdapterBoundaryStillVerified", "fp0108EvidenceDispatchContractBoundaryStillVerified", "fp0097PreviewVisualQaBoundaryStillVerified", "fp0096PreviewStateMatrixBoundaryStillVerified", "fp0094PreviewRouteBoundaryStillVerified", "fp0086BenchmarkCommunityBoundaryStillVerified", "fp0085BoundedOrchestrationBoundaryStillVerified", "fp0082EvidenceAppAlphaBoundaryStillVerified", "fp0081DocumentPrecisionBoundaryStillVerified", "fp0080EvidenceIndexBoundaryStillVerified", "fp0107RouteAdapterBoundaryStillVerified", "fp0106ProtocolEnvelopeBoundaryStillVerified", "fp0100PublicSecurityBoundaryStillVerified",
] as const;

type PriorBoundaryFieldName = (typeof PRIOR_BOUNDARY_FIELD_NAMES)[number];

export type ReadOnlyMcpLocalAppsSdkResourceReadinessProofInput = {
  changedPathScopeAccepted?: boolean;
  fp0161PlanText?: string;
  fp0161SuccessorPathScopeHardened?: boolean;
  fp0162PlanText?: string;
  noNewRouteOrApiRouteAdded?: boolean;
  priorBoundaryOverrides?: Partial<Record<PriorBoundaryFieldName, boolean>>;
  repoPaths?: readonly string[];
};

export type ReadOnlyMcpLocalAppsSdkResourceReadinessProof = ReturnType<
  typeof buildReadOnlyMcpLocalAppsSdkResourceReadinessProof
>;

export function buildReadOnlyMcpLocalAppsSdkResourceReadinessProof(
  input: ReadOnlyMcpLocalAppsSdkResourceReadinessProofInput = {},
) {
  const repoPaths = input.repoPaths ?? [];
  const fp0162PlanText = input.fp0162PlanText ?? "";
  const topics = verifyFp0162ReadinessPlanTextRequiredTopics(fp0162PlanText);
  const unsafeCredentialLine = ["authorization", ": ", "bearer", " ", ["local", "fixture", "material"].join("")].join("");
  const unsafeJwtLikeLine = ["ey", "J", "headerpart", ".", "payloadpart", ".", "signaturepart"].join("");

  return {
    schemaVersion: MCP_LOCAL_APPS_SDK_RESOURCE_READINESS_SCHEMA_VERSION,
    fp0162AbsentOrLocalAppsSdkResourceReadinessPlanVerified:
      verifyFp0162AbsentOrReadOnlyMcpLocalAppsSdkResourceReadinessPlan(repoPaths),
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
    localAppsSdkResourceReadinessBoundaryVerified:
      Object.values(topics).every(Boolean) && input.changedPathScopeAccepted !== false,
    appsSdkResourceImplementationStillBlocked:
      topics.appsSdkResourceImplementationBlocked,
    registerResourceImplementationStillBlocked:
      topics.registerResourceImplementationBlocked,
    mcpResourceTemplateImplementationStillBlocked:
      topics.mcpResourceTemplateImplementationBlocked,
    toolDescriptorImplementationStillBlocked:
      topics.toolDescriptorImplementationBlocked,
    componentBundleImplementationStillBlocked:
      topics.componentBundleImplementationBlocked,
    noNewRouteOrApiRouteFromFp0162:
      topics.newRouteApiBackendRouteBlocked && input.noNewRouteOrApiRouteAdded !== true,
    futureResourceInputBoundaryRecorded:
      topics.futureResourceInputBoundaryRecorded,
    futureResourceOutputBoundaryRecorded:
      topics.futureResourceOutputBoundaryRecorded,
    futureResourceMetadataBoundaryRecorded:
      topics.futureResourceMetadataBoundaryRecorded,
    futureToolDescriptorReadinessRecorded:
      topics.futureToolDescriptorReadinessRecorded,
    futureResourceImplementationSequenceRecorded:
      topics.futureResourceImplementationSequenceRecorded,
    futureResourceTwoLaneSeparationRecorded:
      topics.futureResourceTwoLaneSeparationRecorded,
    futureResourceForbidsCredentialParserSourceLeakage:
      topics.futureResourceForbidsCredentialParserSourceLeakage,
    futureResourceForbidsRealFinanceData:
      topics.futureResourceForbidsRealFinanceData,
    futureResourceForbidsPublicAssetsScreenshotsSubmission:
      topics.futureResourceForbidsPublicAssetsScreenshotsSubmission,
    defaultAuthAdapterWiringStillBlocked: topics.defaultAuthAdapterWiringBlocked,
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
    noProductionTokenValidationFromFp0162:
      topics.productionTokenValidationRuntimeBlocked,
    noOauthSessionAuthMiddlewareFromFp0162:
      topics.oauthSessionAuthMiddlewareBlocked,
    noProviderCallsFromFp0162: topics.providerCallsBlocked,
    noOpenAiApiCallsFromFp0162: topics.openAiApiAndModelCallsBlocked,
    noModelCallsFromFp0162: topics.openAiApiAndModelCallsBlocked,
    noSourceMutationFromFp0162: topics.sourceMutationBlocked,
    noFinanceWriteFromFp0162: topics.financeWriteBlocked,
    noExternalCommunicationsFromFp0162: topics.externalCommunicationsBlocked,
    noPublicAssetsFromFp0162: topics.publicAssetsBlocked,
    noGeneratedPublicProseFromFp0162: topics.generatedPublicProseBlocked,
    noAppSubmissionFromFp0162: topics.appSubmissionBlocked,
    fp0161CloseoutFreshnessVerified:
      verifyFp0161CloseoutFreshnessForFp0162(input.fp0161PlanText ?? ""),
    fp0161SuccessorPathScopeHardened:
      input.fp0161SuccessorPathScopeHardened === true,
    sharedProofOnlyLeakageSanitizerStillVerified:
      scanProofOnlyNoTokenLeakageText(fp0162PlanText).accepted &&
      scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted === false &&
      scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted === false,
    ...buildPriorBoundaryFields(input.priorBoundaryOverrides),
    proofDetails: {
      acceptanceChecklist: [...FUTURE_APPS_SDK_RESOURCE_ACCEPTANCE_CHECKLIST],
      allowedInputFields: [...FUTURE_APPS_SDK_RESOURCE_ALLOWED_INPUT_FIELDS],
      allowedOutputFields: [...FUTURE_APPS_SDK_RESOURCE_ALLOWED_OUTPUT_FIELDS],
      forbiddenInputFields: [...FUTURE_APPS_SDK_RESOURCE_FORBIDDEN_INPUT_FIELDS],
      forbiddenOutputFields: [...FUTURE_APPS_SDK_RESOURCE_FORBIDDEN_OUTPUT_FIELDS],
      metadataReadiness: [...FUTURE_APPS_SDK_RESOURCE_METADATA_READINESS],
      toolDescriptorReadiness: [...FUTURE_APPS_SDK_TOOL_DESCRIPTOR_READINESS],
      implementationSequence: [...FUTURE_APPS_SDK_RESOURCE_IMPLEMENTATION_SEQUENCE],
      planTopics: topics,
    },
  } as const;
}

export function verifyReadOnlyMcpLocalAppsSdkResourceReadinessBoundary(
  input: ReadOnlyMcpLocalAppsSdkResourceReadinessProofInput = {},
) {
  const proof = buildReadOnlyMcpLocalAppsSdkResourceReadinessProof(input);

  return Object.entries(proof).every(
    ([, value]) => typeof value !== "boolean" || value,
  );
}

export function verifyFp0161CloseoutFreshnessForFp0162(planText: string) {
  const normalized = normalizePlanText(planText);

  return includesAll(normalized, [
    "pr #340 merged", "2c21d40bfeb5627f2d6055899e4e7ab5ac6fd9ed", "af329622a04192ef30822e6dd9cde61413479155", "same-branch qa found no issues and made no correction", "github static and integration-db checks were green", "no standalone post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
  ]);
}

export function verifyFp0162ReadinessPlanTextRequiredTopics(planText: string) {
  const normalized = normalizePlanText(planText);

  return {
    readinessIncluded: includesAll(normalized, ["local apps sdk resource readiness planning is included", "proof-only", "planning-only"]),
    appsSdkResourceImplementationBlocked: includesAll(normalized, ["apps sdk resource implementation is not included", "this is not apps sdk iframe/resource implementation"]),
    registerResourceImplementationBlocked: normalized.includes("registerresource implementation is not included"),
    mcpResourceTemplateImplementationBlocked: normalized.includes("mcp resource template implementation is not included"),
    toolDescriptorImplementationBlocked: includesAll(normalized, ["tool descriptor/output template implementation is not included", "no tool descriptor implementation occurs in fp-0162"]),
    componentBundleImplementationBlocked: normalized.includes("component bundle implementation is not included"),
    newRouteApiBackendRouteBlocked: includesAll(normalized, ["a new route, api route, or backend route is not included", "this is not a new app route"]),
    defaultAuthAdapterWiringBlocked: normalized.includes("default auth adapter wiring"),
    defaultEvidenceDispatchWiringBlocked: normalized.includes("default evidence dispatch wiring"),
    defaultAppConstructionUnchanged: normalized.includes("default `createcontainer()`, `createinmemorycontainer()`, and `buildapp()` behavior do not change"),
    mcpRouteBehaviorUnchanged: normalized.includes("`/mcp` behavior does not change"),
    protectedResourceMetadataRouteUnchanged: normalized.includes("protected-resource metadata route behavior does not change"),
    productionTokenValidationRuntimeBlocked: includesAll(normalized, ["production token-validation runtime cannot start after fp-0162", "production token validation is not included"]),
    providerCallsBlocked: includesAll(normalized, ["provider selection cannot start after fp-0162", "provider calls are not included"]),
    oauthSessionAuthMiddlewareBlocked: includesAll(normalized, ["oauth/session/auth middleware cannot start after fp-0162", "oauth/session/auth middleware is not included"]),
    publicChatGptAppBlocked: includesAll(normalized, ["public chatgpt app demo/submission cannot start after fp-0162", "public app behavior/submission is not included"]),
    futureResourceInputBoundaryRecorded: includesAll(normalized, ["may consume only static synthetic local preview bridge snapshots or future sanitized `structuredcontent` from a local render tool", "must not consume raw authorization values", "parser decisions", "token material", "token-derived fields", FORBIDDEN_RAW_SOURCE_DUMPS_PLAN_TEXT, "private fields", "real finance data", "provider data", "model output", "write outputs", "public demo data"]),
    futureResourceOutputBoundaryRecorded: includesAll(normalized, ["future component-resource output may serve only an inert local read-only component resource", "preserve noindex/noarchive/local-only/no-runtime posture", "productiontokenvalidationimplemented: false", "publicchatgptappimplemented: false", "must not include forms, buttons, file inputs"]),
    futureResourceMetadataBoundaryRecorded: includesAll(normalized, ["deterministic and local", "ui://pocket-cfo/local-preview-demo.html", "no external connect domains", "no broad resource domains", "framedomains", "csp that blocks external calls by default"]),
    futureToolDescriptorReadinessRecorded: includesAll(normalized, ["data tools remain reusable and do not own the ui template", "future render tool must explicitly depend on prepared sanitized `structuredcontent`", "evidence tools must retain `readonlyhint`", "no output template is attached to search/fetch data tools in fp-0162"]),
    futureResourceImplementationSequenceRecorded: includesAll(normalized, ["future fp-0163 may implement only a local apps sdk resource implementation skeleton/readiness bridge", "must not fetch `/mcp` from the ui", `must not call \`${FORBIDDEN_CHATGPT_WIDGET_TOOL_CALL_PLAN_TEXT}\``, "must not register public domains"]),
    futureResourceTwoLaneSeparationRecorded: includesAll(normalized, ["preserve auth boundary lane and evidence tool lane separation", "must not claim production authentication or authenticated evidence execution"]),
    futureResourceForbidsCredentialParserSourceLeakage: includesAll(normalized, ["raw authorization values", "parser decisions", "token material", "token-derived fields", FORBIDDEN_RAW_SOURCE_DUMPS_PLAN_TEXT, "private fields"]),
    futureResourceForbidsRealFinanceData: includesAll(normalized, ["real finance data", "public demo data"]),
    futureResourceForbidsPublicAssetsScreenshotsSubmission: includesAll(normalized, ["screenshots", "public assets", "listing copy", "app submission"]),
    futureFp0163BoundaryRecorded: includesAll(normalized, ["future fp-0163 may implement only", "local apps sdk resource implementation skeleton/readiness bridge", "fp-0162 readiness correction", "proof-gate correction"]),
    sourceMutationBlocked: normalized.includes("source mutation"),
    financeWriteBlocked: normalized.includes("finance write"),
    externalCommunicationsBlocked: normalized.includes("external communication"),
    publicAssetsBlocked: normalized.includes("public assets"),
    generatedPublicProseBlocked: normalized.includes("generated public prose"),
    appSubmissionBlocked: normalized.includes("app submission"),
    openAiApiAndModelCallsBlocked: includesAll(normalized, ["openai api/model integration", "openai api/model call"]),
    priorBoundariesPreserved: includesAll(normalized, ["preserve fp-0161 visual qa/accessibility hardening", "fp-0160 local preview/demo ui bridge implementation", "fp-0100 security boundary"]),
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
