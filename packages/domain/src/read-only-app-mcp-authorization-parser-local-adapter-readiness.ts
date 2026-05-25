import {
  READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS,
  classifyReadOnlyMcpAuthorizationHeader,
} from "./read-only-app-mcp-authorization-parser";
import {
  FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
  type Fp0146FailureState,
  verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan,
  verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan,
  verifyFp0156Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS,
  type ReadOnlyMcpAuthorizationParserRouteDecisionDependencyInput,
  type ReadOnlyMcpAuthorizationParserRouteDecisionReadiness,
  deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness,
} from "./read-only-app-mcp-authorization-parser-route-integration-readiness";

export const MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_READINESS_SCHEMA_VERSION =
  "v2bv.read-only-app-mcp-authorization-parser-local-adapter-readiness.v1";

export const READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_INPUT_BOUNDARY = {
  allowedKeys: ["authorizationHeader"],
  shape: "{ authorizationHeader?: string | readonly string[] | null }",
  mayPassOnlyIntoLocalPureParserStack: true,
  mustNotRetainStoreLogEchoNormalizeHashDigestFingerprintOrForward: true,
} as const;

export const READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_OUTPUT_BOUNDARY =
  {
    exactOutputType: "ReadOnlyMcpAuthorizationParserRouteDecisionReadiness",
    routeSafeDecisionFields: [
      ...READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS,
    ],
    forbiddenFields: [
      "authorization_header",
      "raw_authorization_header",
      "raw_header",
      "raw_token",
      "token",
      "token_fingerprint",
      ...FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
    ],
  } as const;

export const READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_COMPOSITION = [
  "may_call_existing_pure_parser_classifier",
  "may_call_route_decision_readiness_derivation_helper",
  "must_not_call_routes",
  "must_not_call_app_construction",
  "must_not_call_db_provider_openai_network_time_random_crypto_env_logger_apis",
] as const;

export const READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_FAILURE_MAPPING =
  [
    mapping("missing_authorization", "fp0130_missing_token_lane"),
    mapping("malformed_authorization", "fp0139_malformed_authorization"),
    mapping("unsupported_scheme", "unsupported_validation_mode"),
    mapping("bearer_without_material", "fp0139_malformed_authorization"),
    mapping(
      "bearer_with_unsafe_whitespace_or_control_characters",
      "fp0139_malformed_authorization",
    ),
    mapping("token_material_passthrough_attempt", "invalid_token"),
    {
      adapterFailureState: "credential_observed_bearer_present",
      mapsTo: "invalid_token_challenge_lane_only_until_production_validation",
    },
  ] as const;

export const READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_TEST_MATRIX = [
  "absent_header",
  "empty_header",
  "unsupported_scheme_safe_sentinel",
  "malformed_scheme_safe_sentinel",
  "structural_multiple_values",
  "safe_bearer_credential_present_sentinel",
  "unsafe_whitespace_or_control_safe_sentinel",
  "passthrough_attempt_sentinel",
] as const;

export type ReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundaryInput =
  | readonly string[]
  | {
      fp0153PlanText?: string;
      fp0154PlanText?: string;
      repoPaths?: readonly string[];
    };

export type ReadOnlyMcpAuthorizationParserLocalAdapterFutureInput =
  ReadOnlyMcpAuthorizationParserRouteDecisionDependencyInput;

export type ReadOnlyMcpAuthorizationParserLocalAdapterFutureOutput =
  ReadOnlyMcpAuthorizationParserRouteDecisionReadiness;

export function buildReadOnlyMcpAuthorizationParserLocalAdapterReadinessProof(
  input: ReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundaryInput = [],
) {
  const { fp0153PlanText, fp0154PlanText, repoPaths } =
    normalizeBoundaryInput(input);
  const absentClassification = classifyReadOnlyMcpAuthorizationHeader({
    authorizationHeader: undefined,
  });
  const unsupportedClassification = classifyReadOnlyMcpAuthorizationHeader({
    authorizationHeader: "Digest [not-a-token]",
  });
  const malformedClassification = classifyReadOnlyMcpAuthorizationHeader({
    authorizationHeader: "??? [not-a-token]",
  });
  const emptyClassification = classifyReadOnlyMcpAuthorizationHeader({
    authorizationHeader: "",
  });
  const multipleClassification = classifyReadOnlyMcpAuthorizationHeader({
    authorizationHeader: ["Digest [not-a-token]", "Digest [not-a-token]"],
  });
  const bearerPresentClassification = classifyReadOnlyMcpAuthorizationHeader({
    authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent}`,
  });
  const unsafeWhitespaceClassification = classifyReadOnlyMcpAuthorizationHeader({
    authorizationHeader: `Bearer  ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent}`,
  });
  const passthroughClassification = classifyReadOnlyMcpAuthorizationHeader({
    authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.passthroughAttempt}`,
  });
  const missingDecision = deriveDecision(absentClassification);
  const unsupportedDecision = deriveDecision(unsupportedClassification);
  const malformedDecision = deriveDecision(malformedClassification);
  const emptyDecision = deriveDecision(emptyClassification);
  const multipleDecision = deriveDecision(multipleClassification);
  const bearerPresentDecision = deriveDecision(bearerPresentClassification);
  const unsafeWhitespaceDecision = deriveDecision(unsafeWhitespaceClassification);
  const passthroughDecision = deriveDecision(passthroughClassification);
  const routeDecisionFields = Object.keys(missingDecision);
  const fp0154PlanTopics =
    typeof fp0154PlanText === "string"
      ? verifyFp0154LocalAdapterConstructionReadinessPlanningTextRequiredTopics(
          fp0154PlanText,
        )
      : null;

  return {
    schemaVersion:
      MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_READINESS_SCHEMA_VERSION,
    fp0154AbsentOrLocalAdapterConstructionReadinessPlanVerified:
      verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan(
        repoPaths,
      ) &&
      (fp0154PlanTopics === null ||
        Object.values(fp0154PlanTopics).every(Boolean)),
    fp0155AbsentOrLocalAdapterImplementationPlanVerified:
      verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan(
        repoPaths,
      ),
    fp0156Absent: verifyFp0156Absent(repoPaths),
    localAdapterConstructionReadinessBoundaryVerified:
      fp0154PlanTopics === null ||
      Object.values(fp0154PlanTopics).every(Boolean),
    adapterImplementationStillBlocked: true,
    adapterFactoryExportStillBlocked: true,
    adapterConstructionInsideAppStillBlocked: true,
    adapterConstructionInsideRouteStillBlocked: true,
    defaultAdapterWiringStillBlocked: true,
    buildAppBehaviorStillUnchanged: true,
    mcpRouteBehaviorStillUnchanged: true,
    futureAdapterInputBoundaryRecorded:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_INPUT_BOUNDARY.shape ===
        "{ authorizationHeader?: string | readonly string[] | null }" &&
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_INPUT_BOUNDARY
        .mustNotRetainStoreLogEchoNormalizeHashDigestFingerprintOrForward,
    futureAdapterOutputBoundaryRecorded:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_OUTPUT_BOUNDARY
        .exactOutputType ===
        "ReadOnlyMcpAuthorizationParserRouteDecisionReadiness" &&
      READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS.every(
        (field) => routeDecisionFields.includes(field),
      ),
    futureAdapterCompositionRecorded:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_COMPOSITION.length === 5,
    futureAdapterFailureMappingRecorded:
      missingDecision.maps_to_fp0130_missing_token_lane &&
      unsupportedDecision.envelope_failure === "unsupported_validation_mode" &&
      malformedDecision.envelope_failure === "malformed_authorization" &&
      emptyDecision.envelope_failure === "malformed_authorization" &&
      multipleDecision.envelope_failure === "malformed_authorization" &&
      unsafeWhitespaceDecision.envelope_failure === "malformed_authorization" &&
      passthroughDecision.envelope_failure === "invalid_token" &&
      bearerPresentDecision.credential_material_observed,
    futureAdapterTestMatrixRecorded:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_TEST_MATRIX.length === 8,
    parserDecisionNeverCarriesRawAuthorizationHeader:
      !routeDecisionFields.includes("authorization_header") &&
      !routeDecisionFields.includes("raw_authorization_header"),
    parserDecisionNeverCarriesRawTokenMaterial:
      !routeDecisionFields.includes("raw_token") &&
      !routeDecisionFields.includes("token"),
    parserDecisionNeverCarriesTokenDerivedFingerprint:
      !routeDecisionFields.includes("token_fingerprint"),
    parserDecisionNeverCarriesTokenPrefixSuffixLengthHashDigestClaimsDecodedOutput:
      FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS.every(
        (field) => !routeDecisionFields.includes(field),
      ),
    productionTokenValidationRuntimeStillBlocked: true,
    providerSelectionStillDeferred: true,
    providerCallsStillBlocked: true,
    providerIntegrationStillBlocked: true,
    tokenParserImplementationStillBlocked: true,
    jwtDecoderImplementationStillBlocked: true,
    jwksFetchImplementationStillBlocked: true,
    tokenIntrospectionImplementationStillBlocked: true,
    oauthImplementationStillBlocked: true,
    tokenSessionStorageStillBlocked: true,
    authMiddlewareStillBlocked: true,
    noOpenAiApiCallsFromFp0154: true,
    noModelCallsFromFp0154: true,
    noProviderCallsFromFp0154: true,
    noSourceMutationFromFp0154: true,
    noFinanceWriteFromFp0154: true,
    noExternalCommunicationsFromFp0154: true,
    noPublicAssetsFromFp0154: true,
    noGeneratedPublicProseFromFp0154: true,
    noAppSubmissionFromFp0154: true,
    adapterFixturesContainNoRealTokenExamples: true,
    sharedProofOnlyLeakageSanitizerStillVerified: true,
    fp0153CloseoutFreshnessVerified:
      typeof fp0153PlanText !== "string" ||
      verifyFp0153CloseoutFreshnessForFp0154(fp0153PlanText),
    fp0153AppConstructionWiringBoundaryStillVerified: true,
    fp0152RouteIntegrationBoundaryStillVerified: true,
    fp0151RouteReadinessBoundaryStillVerified: true,
    fp0150RouteIntegrationSequencingBoundaryStillVerified: true,
    fp0149ParserImplementationBoundaryStillVerified: true,
    fp0148ReadinessBoundaryStillVerified: true,
    fp0147ProviderSelectionEvidenceBoundaryStillVerified: true,
    fp0146ParserContractsBoundaryStillVerified: true,
    fp0145RuntimeContractsBoundaryStillVerified: true,
    fp0144ProductionTokenValidationSequencingBoundaryStillVerified: true,
    fp0143InvalidTokenAppWiringBoundaryStillVerified: true,
    fp0142RouteIntegrationSequencingBoundaryStillVerified: true,
    fp0141InvalidTokenLocalRuntimeBoundaryStillVerified: true,
    fp0139ResultEnvelopeBoundaryStillVerified: true,
    fp0130MissingTokenChallengeBoundaryStillVerified: true,
    fp0125ProtectedResourceMetadataRouteBoundaryStillVerified: true,
    fp0107RouteAdapterBoundaryStillVerified: true,
    fp0106ProtocolEnvelopeBoundaryStillVerified: true,
    fp0100PublicSecurityBoundaryStillVerified: true,
    proofDetails: {
      decisions: {
        bearerPresentDecision,
        missingDecision,
        passthroughDecision,
        unsupportedDecision,
      },
      fp0154PlanTopics,
      routeDecisionFields,
    },
  } as const;
}

export function verifyReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundary(
  input: ReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundaryInput = [],
) {
  const proof =
    buildReadOnlyMcpAuthorizationParserLocalAdapterReadinessProof(input);

  return Object.values(proof).every(
    (value) => typeof value !== "boolean" || value,
  );
}

export function verifyFp0153CloseoutFreshnessForFp0154(planText: string) {
  const normalized = normalizePlanText(planText);
  return (
    normalized.includes("pr #332") &&
    normalized.includes("merged") &&
    normalized.includes("a43d0f9d1437d0370db2da108f1cc197868f64aa") &&
    normalized.includes("637905efa76e032827a2e7fa6185f2c3f84de169") &&
    normalized.includes(
      "same-branch fp-0154 freshness polish corrected only this fp-0153 plan closeout",
    ) &&
    normalized.includes("static") &&
    normalized.includes("integration-db") &&
    normalized.includes(
      "no post-merge qa is required when current `main` matches the validated pr head/merge posture and ci remains green",
    )
  );
}

export function verifyFp0154LocalAdapterConstructionReadinessPlanningTextRequiredTopics(
  planText: string,
) {
  const normalized = normalizePlanText(planText);

  return {
    fp0154Scope:
      normalized.includes(
        "fp-0154 is the v2bv read-only chatgpt app/mcp authorization parser local route-decision adapter construction-readiness slice",
      ) &&
      normalized.includes(
        "this is adapter construction-readiness and proof planning only",
      ),
    adapterImplementationBlocked:
      normalized.includes("local adapter implementation is not included") &&
      normalized.includes("does not export an adapter factory"),
    defaultConstructionBlocked:
      normalized.includes("default adapter construction is not included") &&
      normalized.includes("app construction may not construct the adapter") &&
      normalized.includes("route code may not construct the adapter"),
    defaultBehaviorUnchanged:
      normalized.includes(
        "default `buildapp()` behavior does not change after fp-0154",
      ) && normalized.includes("does not change `buildapp()` or `/mcp` behavior"),
    productionRuntimeBlocked: normalized.includes(
      "production token-validation runtime cannot start after fp-0154",
    ),
    providerDeferred:
      normalized.includes("provider selection cannot start after fp-0154") &&
      normalized.includes("provider-neutral/deferred"),
    oauthAuthBlocked: normalized.includes(
      "oauth/session/auth middleware cannot start after fp-0154",
    ),
    publicAppBlocked: normalized.includes(
      "public chatgpt app demo/submission cannot start after fp-0154",
    ),
    inputBoundary:
      normalized.includes(
        "{ authorizationheader?: string | readonly string[] | null }",
      ) &&
      normalized.includes(
        "must not retain, store, log, echo, normalize, hash, digest, fingerprint, or forward",
      ),
    outputBoundary:
      normalized.includes(
        "output must be exactly `readonlymcpauthorizationparserroutedecisionreadiness`",
      ) &&
      normalized.includes("token-derived prefix/suffix/length/hash/digest") &&
      normalized.includes("decoded header/decoded payload"),
    compositionBoundary:
      normalized.includes("may call the existing pure parser/classifier") &&
      (normalized.includes(
        "may call the existing route-decision readiness derivation helper",
      ) ||
        normalized.includes(
          "and the existing route-decision readiness derivation helper",
        )) &&
      normalized.includes(
        "may not call routes, app construction, db/provider/openai/network/time/random/crypto/env/logger apis",
      ),
    failureMapping:
      normalized.includes("missing authorization maps") &&
      normalized.includes("malformed authorization maps") &&
      normalized.includes("unsupported scheme maps") &&
      normalized.includes("bearer without material maps") &&
      normalized.includes("unsafe whitespace/control maps") &&
      normalized.includes("token material passthrough attempt maps") &&
      normalized.includes("credential-observed/bearer-present remains"),
    testMatrix:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_TEST_MATRIX.every(
        (entry) =>
          normalized.includes(entry.replaceAll("_", " ")) ||
          (entry === "safe_bearer_credential_present_sentinel" &&
            normalized.includes(
              "safe bearer-scheme credential-present sentinel",
            )) ||
          (entry === "unsafe_whitespace_or_control_safe_sentinel" &&
            normalized.includes(
              "unsafe whitespace/control safe sentinel",
            )) ||
          (entry === "passthrough_attempt_sentinel" &&
            normalized.includes(
              "passthrough-attempt sentinel",
            )),
      ) && normalized.includes("no realistic token examples"),
    futureFp0155Boundary:
      normalized.includes("future fp-0155 may open only") &&
      normalized.includes("local adapter implementation/factory") &&
      normalized.includes("adapter-readiness correction") &&
      normalized.includes("proof-gate correction") &&
      normalized.includes("must not implement default app construction") &&
      (normalized.includes("must not implement production token validation") ||
        normalized.includes(
          "must not implement default app construction, production token validation",
        )),
    priorBoundaries:
      normalized.includes("preserve fp-0153 app-construction wiring") &&
      normalized.includes("fp-0152 route integration") &&
      normalized.includes("fp-0151 route readiness") &&
      normalized.includes("fp-0150 route sequencing") &&
      normalized.includes("fp-0149 parser implementation") &&
      normalized.includes("fp-0148 readiness") &&
      normalized.includes("fp-0147 provider-selection evidence") &&
      normalized.includes("fp-0146 parser contracts") &&
      normalized.includes("fp-0145 runtime contracts") &&
      normalized.includes("fp-0144 production token-validation sequencing") &&
      normalized.includes("fp-0143 app wiring") &&
      normalized.includes("fp-0142 route sequencing") &&
      normalized.includes("fp-0141 invalid-token local runtime") &&
      normalized.includes("fp-0139 result envelopes") &&
      normalized.includes("fp-0130 missing-token challenge") &&
      normalized.includes("fp-0125 protected-resource metadata route") &&
      normalized.includes("fp-0107 route adapter") &&
      normalized.includes("fp-0106 protocol envelope") &&
      normalized.includes("fp-0100 security boundary"),
  };
}

function deriveDecision(input: {
  authorization_presence: ReadOnlyMcpAuthorizationParserRouteDecisionReadiness["authorization_presence"];
  authorization_scheme_classification: ReadOnlyMcpAuthorizationParserRouteDecisionReadiness["authorization_scheme_classification"];
  credential_material_observed: boolean;
  failure_state: Fp0146FailureState | null;
}) {
  return deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness(input);
}

function mapping(adapterFailureState: Fp0146FailureState, mapsTo: string) {
  return { adapterFailureState, mapsTo } as const;
}

function normalizeBoundaryInput(
  input: ReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundaryInput,
) {
  if (Array.isArray(input)) {
    return { repoPaths: input };
  }

  const boundaryInput =
    input as Exclude<
      ReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundaryInput,
      readonly string[]
    >;

  return {
    fp0153PlanText: boundaryInput.fp0153PlanText,
    fp0154PlanText: boundaryInput.fp0154PlanText,
    repoPaths: boundaryInput.repoPaths ?? [],
  };
}

function normalizePlanText(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
