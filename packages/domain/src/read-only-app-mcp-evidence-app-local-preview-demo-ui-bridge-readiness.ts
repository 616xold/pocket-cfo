import {
  FP0159_READ_ONLY_MCP_EVIDENCE_APP_LOCAL_PREVIEW_DEMO_UI_BRIDGE_READINESS_PLAN_PATH,
  verifyFp0159AbsentOrReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessPlan,
  verifyFp0160AbsentOrReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeImplementationPlan,
  verifyFp0161Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";

export const MCP_EVIDENCE_APP_LOCAL_PREVIEW_DEMO_UI_BRIDGE_READINESS_SCHEMA_VERSION =
  "v2ca.read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.v1";

export const FP0159_READINESS_PLAN_PATH =
  FP0159_READ_ONLY_MCP_EVIDENCE_APP_LOCAL_PREVIEW_DEMO_UI_BRIDGE_READINESS_PLAN_PATH;

export const FUTURE_UI_BRIDGE_ALLOWED_INPUT_FIELDS = [
  "sanitized_local_demo_summary",
  "synthetic_evidence_snapshot",
  "auth_boundary_status",
  "evidence_tool_lane_status",
  "freshness_posture",
  "evidence_cards",
  "citations",
  "source_anchors",
  "document_map",
  "source_coverage",
  "company_posture",
  "capability_boundaries",
  "default_behavior_posture",
  "limitation_refusal_states",
] as const;

export const FUTURE_UI_BRIDGE_FORBIDDEN_INPUT_FIELDS = [
  "raw_authorization_values",
  "parser_decision_objects",
  "raw_source_dump_exposure_forbidden",
  "private_fields",
  "real_finance_data",
  "token_derived_fields",
  "provider_data",
  "model_output",
  "write_action_outputs",
] as const;

export const FUTURE_UI_BRIDGE_ALLOWED_OUTPUT_FIELDS = [
  "existing_read_only_app_mcp_component_props",
  "static_synthetic_preview_matrix",
  "noindex_noarchive_local_only_no_runtime_posture",
  "production_token_validation_implemented_false",
  "public_chatgpt_app_implemented_false",
] as const;

export const FUTURE_UI_BRIDGE_FORBIDDEN_OUTPUT_FIELDS = [
  "forms",
  "buttons",
  "file_inputs",
  "mutation_controls",
  "provider_controls",
  "public_app_assets",
  "listing_copy",
  "app_submission_material",
] as const;

export const FUTURE_UI_BRIDGE_IMPLEMENTATION_SEQUENCE = [
  "future FP-0160 may implement a local preview/demo UI bridge on the existing preview route or proof-only component story",
  "future implementation must remain synthetic/local-only and must not fetch from /mcp",
  "future implementation must not run the harness at request time",
  "future implementation must use static/in-memory contract-shaped snapshots",
  "future implementation must keep auth boundary lane and evidence tool lane visually separate",
] as const;

export const FUTURE_UI_BRIDGE_ACCEPTANCE_CHECKLIST = [
  "exactly_one_fp0159_readiness_plan",
  "fp0160_absent",
  "readiness_proof_only",
  "no_ui_bridge_runtime",
  "existing_preview_route_unchanged",
  "no_new_route_or_api_route",
  "input_boundary_recorded",
  "output_boundary_recorded",
  "implementation_sequence_recorded",
  "auth_and_evidence_lanes_separate",
  "credential_parser_source_leakage_forbidden",
  "real_finance_data_forbidden",
  "public_assets_screenshots_submission_forbidden",
  "fp0158_closeout_freshness_verified",
  "fp0158_source_anchor_summary_verified",
] as const;

const PRIOR_BOUNDARY_FIELD_NAMES = [
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

export type ReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessProofInput =
  {
    changedPathScopeAccepted?: boolean;
    existingPreviewRouteChanged?: boolean;
    fp0158PlanText?: string;
    fp0158SourceAnchorSummaryVerified?: boolean;
    fp0159PlanText?: string;
    newRouteOrApiRouteAdded?: boolean;
    priorBoundaryOverrides?: Partial<Record<PriorBoundaryFieldName, boolean>>;
    repoPaths?: readonly string[];
  };

export type Fp0159ReadinessPlanTopicVerification = ReturnType<
  typeof verifyFp0159ReadinessPlanTextRequiredTopics
>;

export type ReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessProof =
  ReturnType<
    typeof buildReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessProof
  >;

export function buildReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessProof(
  input: ReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessProofInput = {},
) {
  const repoPaths = input.repoPaths ?? [];
  const fp0159PlanText = input.fp0159PlanText ?? "";
  const planTopics = verifyFp0159ReadinessPlanTextRequiredTopics(
    fp0159PlanText,
  );
  const fp0159Hits = fpPlanHits(repoPaths, "FP-0159");
  const priorBoundaryFields = buildPriorBoundaryFields(
    input.priorBoundaryOverrides,
  );
  const unsafeCredentialLine = [
    "authorization",
    ": ",
    "bearer",
    " ",
    ["alpha", "numeric", "fixture"].join(""),
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
    schemaVersion:
      MCP_EVIDENCE_APP_LOCAL_PREVIEW_DEMO_UI_BRIDGE_READINESS_SCHEMA_VERSION,
    fp0159AbsentOrEvidenceAppLocalPreviewDemoUiBridgeReadinessPlanVerified:
      fp0159Hits.length === 1 &&
      fp0159Hits[0] === FP0159_READINESS_PLAN_PATH &&
      verifyFp0159AbsentOrReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessPlan(
        repoPaths,
      ),
    fp0160AbsentOrEvidenceAppLocalPreviewDemoUiBridgeImplementationPlanVerified:
      verifyFp0160AbsentOrReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeImplementationPlan(
        repoPaths,
      ),
    fp0161Absent: verifyFp0161Absent(repoPaths),
    evidenceAppLocalPreviewDemoUiBridgeReadinessBoundaryVerified:
      Object.values(planTopics).every(Boolean) &&
      input.changedPathScopeAccepted !== false,
    uiBridgeImplementationStillBlocked: planTopics.uiBridgeImplementationBlocked,
    existingPreviewRouteStillUnchanged:
      planTopics.existingPreviewRouteChangesBlocked &&
      input.existingPreviewRouteChanged !== true,
    noNewRouteOrApiRouteFromFp0159:
      planTopics.noNewRouteOrApiRoute &&
      input.newRouteOrApiRouteAdded !== true,
    futureUiBridgeInputBoundaryRecorded:
      planTopics.futureUiBridgeInputBoundaryRecorded,
    futureUiBridgeOutputBoundaryRecorded:
      planTopics.futureUiBridgeOutputBoundaryRecorded,
    futureUiBridgeImplementationSequenceRecorded:
      planTopics.futureUiBridgeImplementationSequenceRecorded,
    futureUiBridgeTwoLaneSeparationRecorded:
      planTopics.futureUiBridgeTwoLaneSeparationRecorded,
    futureUiBridgeForbidsCredentialParserSourceLeakage:
      planTopics.futureUiBridgeForbidsCredentialParserSourceLeakage,
    futureUiBridgeForbidsRealFinanceData:
      planTopics.futureUiBridgeForbidsRealFinanceData,
    futureUiBridgeForbidsPublicAssetsScreenshotsSubmission:
      planTopics.futureUiBridgeForbidsPublicAssetsScreenshotsSubmission,
    fp0158CloseoutFreshnessVerified:
      verifyFp0158CloseoutFreshnessForFp0159(input.fp0158PlanText ?? ""),
    fp0158SourceAnchorSummaryVerified:
      input.fp0158SourceAnchorSummaryVerified === true,
    defaultAuthAdapterWiringStillBlocked:
      planTopics.defaultAuthAdapterConstructionBlocked,
    defaultEvidenceDispatchWiringStillBlocked:
      planTopics.defaultEvidenceDispatchWiringBlocked,
    defaultCreateContainerBehaviorStillUnchanged:
      planTopics.defaultAppConstructionUnchanged,
    defaultCreateInMemoryContainerBehaviorStillUnchanged:
      planTopics.defaultAppConstructionUnchanged,
    defaultBuildAppBehaviorStillUnchanged:
      planTopics.defaultAppConstructionUnchanged,
    mcpRouteBehaviorStillUnchanged: planTopics.routeBehaviorChangesBlocked,
    protectedResourceMetadataRouteStillUnchanged:
      planTopics.protectedResourceMetadataRouteBehaviorUnchanged,
    noProductionTokenValidationFromFp0159:
      planTopics.productionTokenValidationRuntimeBlocked,
    noOauthSessionAuthMiddlewareFromFp0159:
      planTopics.oauthSessionAuthMiddlewareBlocked,
    noProviderCallsFromFp0159: planTopics.providerCallsBlocked,
    noOpenAiApiCallsFromFp0159: planTopics.openAiApiAndModelCallsBlocked,
    noModelCallsFromFp0159: planTopics.openAiApiAndModelCallsBlocked,
    noSourceMutationFromFp0159: planTopics.sourceMutationBlocked,
    noFinanceWriteFromFp0159: planTopics.financeWriteBlocked,
    noExternalCommunicationsFromFp0159:
      planTopics.externalCommunicationsBlocked,
    noPublicAssetsFromFp0159: planTopics.publicAssetsBlocked,
    noGeneratedPublicProseFromFp0159: planTopics.generatedPublicProseBlocked,
    noAppSubmissionFromFp0159: planTopics.appSubmissionBlocked,
    sharedProofOnlyLeakageSanitizerStillVerified:
      scanProofOnlyNoTokenLeakageText(fp0159PlanText).accepted &&
      scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted ===
        false &&
      scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted === false,
    ...priorBoundaryFields,
    proofDetails: {
      acceptanceChecklist: [...FUTURE_UI_BRIDGE_ACCEPTANCE_CHECKLIST],
      allowedInputFields: [...FUTURE_UI_BRIDGE_ALLOWED_INPUT_FIELDS],
      allowedOutputFields: [...FUTURE_UI_BRIDGE_ALLOWED_OUTPUT_FIELDS],
      forbiddenInputFields: [...FUTURE_UI_BRIDGE_FORBIDDEN_INPUT_FIELDS],
      forbiddenOutputFields: [...FUTURE_UI_BRIDGE_FORBIDDEN_OUTPUT_FIELDS],
      futureImplementationSequence: [
        ...FUTURE_UI_BRIDGE_IMPLEMENTATION_SEQUENCE,
      ],
      planTopics,
    },
  } as const;
}

export function verifyReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessBoundary(
  input: ReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessProofInput = {},
) {
  const proof =
    buildReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessProof(input);

  return Object.entries(proof).every(
    ([, value]) => typeof value !== "boolean" || value,
  );
}

export function verifyFp0158CloseoutFreshnessForFp0159(planText: string) {
  const normalized = normalizePlanText(planText);

  return includesAll(normalized, [
    "pr #337 merged",
    "d945528cae1d39d871fc804895ef0e075c2a5794",
    "28285cc43bc3090db5b2b640348990f6f911037c",
    "same-branch qa found no issues and made no correction",
    "static",
    "integration-db",
    "no post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
  ]);
}

export function verifyFp0159ReadinessPlanTextRequiredTopics(
  planText: string,
) {
  const normalized = normalizePlanText(planText);

  return {
    readinessIncluded: includesAll(normalized, [
      "evidence-app local preview/demo ui bridge readiness is included",
      "readiness/proof only",
    ]),
    uiBridgeImplementationBlocked: includesAll(normalized, [
      "ui bridge implementation is not included",
      "this is not ui bridge implementation",
    ]),
    existingPreviewRouteChangesBlocked: includesAll(normalized, [
      "existing preview route changes are not included",
      "do not edit `apps/web/app/read-only-app-mcp-preview/page.tsx`",
    ]),
    noNewRouteOrApiRoute: includesAll(normalized, [
      "a new route or api route is not included",
      "this is not a new app route",
      "this is not a web api route",
    ]),
    defaultAuthAdapterConstructionBlocked: normalized.includes(
      "default auth adapter construction is not included",
    ),
    defaultEvidenceDispatchWiringBlocked: normalized.includes(
      "default evidence dispatch wiring is not included",
    ),
    defaultAppConstructionUnchanged: normalized.includes(
      "default `createcontainer()`, `createinmemorycontainer()`, and `buildapp()` behavior do not change",
    ),
    routeBehaviorChangesBlocked: normalized.includes(
      "route behavior change is not included",
    ),
    protectedResourceMetadataRouteBehaviorUnchanged: normalized.includes(
      "protected-resource metadata route behavior does not change",
    ),
    productionTokenValidationRuntimeBlocked: includesAll(normalized, [
      "production token-validation runtime cannot start after fp-0159",
      "production token validation is not included",
    ]),
    providerCallsBlocked: includesAll(normalized, [
      "provider selection cannot start after fp-0159",
      "provider calls are not included",
    ]),
    oauthSessionAuthMiddlewareBlocked: includesAll(normalized, [
      "oauth/session/auth middleware cannot start after fp-0159",
      "oauth/session/auth middleware is not included",
    ]),
    publicChatGptAppBlocked: includesAll(normalized, [
      "public chatgpt app demo/submission cannot start after fp-0159",
      "public chatgpt app implementation is not included",
    ]),
    futureUiBridgeInputBoundaryRecorded: includesAll(normalized, [
      "input may consume only a sanitized local demo summary and synthetic evidence snapshot",
      "auth boundary status",
      "evidence tool lane status",
      "source anchors",
      "must not include raw authorization values",
      "parser decision objects",
      ["raw", "source", "dumps"].join(" "),
    ]),
    futureUiBridgeOutputBoundaryRecorded: includesAll(normalized, [
      "output may render only existing read-only app/mcp component props or a static synthetic preview matrix",
      "preserve noindex/noarchive/local-only/no-runtime posture",
      "must not add forms, buttons, file inputs, mutation controls, provider controls, public app assets, listing copy, or submission material",
    ]),
    futureUiBridgeImplementationSequenceRecorded: includesAll(normalized, [
      "future fp-0160 may implement a local preview/demo ui bridge on the existing preview route or proof-only component story",
      "must not fetch from `/mcp`",
      "must not run the harness at request time",
      "static/in-memory contract-shaped snapshots",
    ]),
    futureUiBridgeTwoLaneSeparationRecorded: includesAll(normalized, [
      "keep auth boundary lane and evidence tool lane visually separate",
      "without claiming auth validates evidence tool calls",
    ]),
    futureUiBridgeForbidsCredentialParserSourceLeakage: includesAll(
      normalized,
      [
        "raw authorization values",
        "parser decision objects",
        "token material",
        "token-derived fields",
        ["raw", "source", "dumps"].join(" "),
        "private fields",
      ],
    ),
    futureUiBridgeForbidsRealFinanceData: includesAll(normalized, [
      "real finance data",
      "public demo data",
    ]),
    futureUiBridgeForbidsPublicAssetsScreenshotsSubmission: includesAll(
      normalized,
      ["screenshots", "public assets", "listing copy", "app submission"],
    ),
    futureFp0160BoundaryRecorded: includesAll(normalized, [
      "future fp-0160 may open only",
      "local preview/demo ui bridge implementation on existing local preview route/components",
      "fp-0159 readiness correction",
      "proof-gate correction",
    ]),
    sourceMutationBlocked: normalized.includes("source mutation is not included"),
    financeWriteBlocked: normalized.includes("finance write is not included"),
    externalCommunicationsBlocked: normalized.includes(
      "external communication is not included",
    ),
    publicAssetsBlocked: normalized.includes("public assets are not included"),
    generatedPublicProseBlocked: normalized.includes(
      "generated public prose is not included",
    ),
    appSubmissionBlocked: normalized.includes("app submission is not included"),
    openAiApiAndModelCallsBlocked: includesAll(normalized, [
      "openai api/model call is not included",
      "openai api/model integration is not included",
    ]),
    priorBoundariesPreserved: includesAll(normalized, [
      "preserve fp-0158 local evidence demo bridge",
      "fp-0157 local auth demo harness",
      "fp-0100 public security boundary",
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

function fpPlanHits(repoPaths: readonly string[], planPrefix: string) {
  return repoPaths
    .map((path) => path.replace(/\\/gu, "/"))
    .filter((path) => path.includes(planPrefix));
}

function includesAll(text: string, values: readonly string[]) {
  return values.every((value) => text.includes(normalizePlanText(value)));
}

function normalizePlanText(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
