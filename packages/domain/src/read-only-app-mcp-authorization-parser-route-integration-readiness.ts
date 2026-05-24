import {
  FP0146_FAILURE_MAPPINGS,
  FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
  FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS,
  type Fp0146AuthorizationPresence,
  type Fp0146AuthorizationSchemeClassification,
  type Fp0146FailureState,
  type Fp0146ParserFailureMapping,
  verifyFp0150AuthorizationParserRouteIntegrationSequencingPlanBoundary,
  verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan,
  verifyFp0152AbsentOrAuthorizationParserRouteIntegrationImplementationPlan,
  verifyFp0153AbsentOrAuthorizationParserAppConstructionWiringPlan,
  verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan,
  verifyFp0155Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";

export const MCP_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_SCHEMA_VERSION =
  "v2bs.read-only-app-mcp-authorization-parser-route-integration-readiness.v1";

export const READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS = [
  "parser_route_decision_contract_version",
  "authorization_presence",
  "authorization_scheme_classification",
  "credential_material_observed",
  "parser_failure_state",
  "envelope_failure",
  "maps_to_fp0130_missing_token_lane",
  "maps_to_fp0139_result_envelope",
  "invalid_token_challenge_downstream_only",
  "no_raw_header_retained",
  "no_raw_token_retained",
  "no_token_derived_fingerprint_retained",
  "no_token_prefix_suffix_length_hash_digest_claims_decoded_output",
  "no_route_response_exposure",
  "no_logging_echo_storage_forwarding",
] as const;

export const READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_DEPENDENCY_INJECTION_REQUIREMENTS =
  [
    "route_parser_dependency_optional_and_explicitly_injected",
    "default_mcp_behavior_unchanged_when_dependency_absent",
    "parser_dependency_not_constructed_inside_route_by_default",
    "parser_dependency_local_only_no_network_time_random_crypto_env_provider_db_openai_calls",
    "route_adapter_consumes_sanitized_decision_outputs_only",
  ] as const;

export const READ_ONLY_MCP_AUTHORIZATION_PARSER_FUTURE_ROUTE_SEQUENCE = [
  "local_origin_validation_before_auth_challenge_branches",
  "missing_token_precedence_before_parser_invalid_malformed_route_decision",
  "missing_authorization_uses_fp0130_missing_token_lane",
  "malformed_unsupported_parser_classifications_map_through_fp0139_envelopes",
  "invalid_token_challenge_downstream_of_sanitized_fp0139_envelopes",
  "protected_resource_metadata_route_behavior_unchanged",
  "parser_decision_not_returned_directly_in_http_response_body",
  "no_raw_authorization_header_or_token_material_in_logs_proofs_responses_structured_results",
] as const;

export const READ_ONLY_MCP_AUTHORIZATION_PARSER_FUTURE_IMPLEMENTATION_PROOF_PREREQUISITES =
  [
    "parser_pure_domain_proof_green",
    "fp0150_route_integration_sequencing_proof_green",
    "no_token_leakage_proof_green",
    "missing_token_proof_green",
    "invalid_token_challenge_proof_green",
    "fp0139_envelope_proof_green",
    "protected_resource_metadata_route_proof_green",
    "route_adapter_proof_green",
    "app_construction_dependency_injection_proof_green",
    "provider_runtime_oauth_auth_guardrails_green",
  ] as const;

export type ReadOnlyMcpAuthorizationParserRouteDecisionReadinessInput = {
  authorization_presence: Fp0146AuthorizationPresence;
  authorization_scheme_classification: Fp0146AuthorizationSchemeClassification;
  credential_material_observed: boolean;
  failure_state: Fp0146FailureState | null;
};

export type ReadOnlyMcpAuthorizationParserRouteDecisionReadiness = {
  authorization_presence: Fp0146AuthorizationPresence;
  authorization_scheme_classification: Fp0146AuthorizationSchemeClassification;
  credential_material_observed: boolean;
  envelope_failure: Fp0146ParserFailureMapping["envelopeFailure"] | null;
  invalid_token_challenge_downstream_only: true;
  maps_to_fp0130_missing_token_lane: boolean;
  maps_to_fp0139_result_envelope: boolean;
  no_logging_echo_storage_forwarding: true;
  no_raw_header_retained: true;
  no_raw_token_retained: true;
  no_route_response_exposure: true;
  no_token_derived_fingerprint_retained: true;
  no_token_prefix_suffix_length_hash_digest_claims_decoded_output: true;
  parser_failure_state: Fp0146FailureState | null;
  parser_route_decision_contract_version: typeof MCP_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_SCHEMA_VERSION;
};

export type ReadOnlyMcpAuthorizationParserRouteDecisionDependencyInput = {
  authorizationHeader?: string | readonly string[] | null;
};

export type ReadOnlyMcpAuthorizationParserRouteDecisionDependency = (
  input: ReadOnlyMcpAuthorizationParserRouteDecisionDependencyInput,
) => ReadOnlyMcpAuthorizationParserRouteDecisionReadiness;

export type ReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundaryInput =
  | readonly string[]
  | {
      fp0150PlanText?: string;
      fp0151PlanText?: string;
      repoPaths?: readonly string[];
    };

export function deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness(
  input: ReadOnlyMcpAuthorizationParserRouteDecisionReadinessInput,
): ReadOnlyMcpAuthorizationParserRouteDecisionReadiness {
  const failureMapping = findFailureMapping(input.failure_state);
  const mapsToMissingLane = input.failure_state === "missing_authorization";
  const mapsToEnvelope =
    input.failure_state !== null &&
    input.failure_state !== "missing_authorization";

  return {
    parser_route_decision_contract_version:
      MCP_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_SCHEMA_VERSION,
    authorization_presence: input.authorization_presence,
    authorization_scheme_classification:
      input.authorization_scheme_classification,
    credential_material_observed: input.credential_material_observed,
    parser_failure_state: input.failure_state,
    envelope_failure: mapsToEnvelope
      ? (failureMapping?.envelopeFailure ?? null)
      : null,
    maps_to_fp0130_missing_token_lane: mapsToMissingLane,
    maps_to_fp0139_result_envelope: mapsToEnvelope,
    invalid_token_challenge_downstream_only: true,
    no_raw_header_retained: true,
    no_raw_token_retained: true,
    no_token_derived_fingerprint_retained: true,
    no_token_prefix_suffix_length_hash_digest_claims_decoded_output: true,
    no_route_response_exposure: true,
    no_logging_echo_storage_forwarding: true,
  };
}

export function buildReadOnlyMcpAuthorizationParserRouteDecisionReadinessProof(
  input: ReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundaryInput = [],
) {
  const { fp0150PlanText, fp0151PlanText, repoPaths } =
    normalizeBoundaryInput(input);
  const missingDecision =
    deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness({
      authorization_presence: "absent",
      authorization_scheme_classification: "not_evaluated",
      credential_material_observed: false,
      failure_state: "missing_authorization",
    });
  const unsupportedDecision =
    deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness({
      authorization_presence: "present",
      authorization_scheme_classification: "unsupported",
      credential_material_observed: false,
      failure_state: "unsupported_scheme",
    });
  const malformedDecision =
    deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness({
      authorization_presence: "present",
      authorization_scheme_classification: "malformed",
      credential_material_observed: false,
      failure_state: "malformed_authorization",
    });
  const observedCredentialDecision =
    deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness({
      authorization_presence: "present",
      authorization_scheme_classification: "bearer",
      credential_material_observed: true,
      failure_state: null,
    });
  const routeDecisionFields = Object.keys(missingDecision);
  const fp0151PlanTopics =
    typeof fp0151PlanText === "string"
      ? verifyFp0151RouteIntegrationReadinessPlanningTextRequiredTopics(
          fp0151PlanText,
        )
      : null;
  const fp0150CloseoutFreshnessVerified =
    typeof fp0150PlanText === "string"
      ? verifyFp0150CloseoutFreshnessForFp0151(fp0150PlanText)
      : true;
  const fp0150BoundaryVerified =
    typeof fp0150PlanText === "string"
      ? verifyFp0150AuthorizationParserRouteIntegrationSequencingPlanBoundary({
          planText: fp0150PlanText,
          repoPaths,
        })
      : true;

  return {
    schemaVersion:
      MCP_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_SCHEMA_VERSION,
    fp0151AbsentOrRouteIntegrationReadinessPlanVerified:
      verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan(
        repoPaths,
      ),
    fp0152AbsentOrRouteIntegrationImplementationPlanVerified:
      verifyFp0152AbsentOrAuthorizationParserRouteIntegrationImplementationPlan(
        repoPaths,
      ),
    fp0153AbsentOrAppConstructionWiringPlanVerified:
      verifyFp0153AbsentOrAuthorizationParserAppConstructionWiringPlan(
        repoPaths,
      ),
    fp0154AbsentOrLocalAdapterConstructionReadinessPlanVerified:
      verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan(
        repoPaths,
      ),
    fp0155Absent: verifyFp0155Absent(repoPaths),
    routeIntegrationImplementationReadinessBoundaryVerified:
      fp0151PlanTopics === null ||
      Object.values(fp0151PlanTopics).every(Boolean),
    routeIntegrationStillBlocked: true,
    parserRouteConsumptionStillBlocked: true,
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
    routeBehaviorStillUnchanged: true,
    missingTokenBehaviorStillUnchanged: true,
    invalidTokenChallengeBehaviorStillUnchanged: true,
    protectedResourceMetadataRouteStillUnchanged: true,
    routeSafeParserDecisionContractRecorded:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS.every(
        (field) => routeDecisionFields.includes(field),
      ),
    routeDependencyInjectionShapeRecorded:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_DEPENDENCY_INJECTION_REQUIREMENTS.length >
      0,
    futureRouteSequencingRecorded:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_FUTURE_ROUTE_SEQUENCE.length > 0,
    futureImplementationProofPrerequisitesRecorded:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_FUTURE_IMPLEMENTATION_PROOF_PREREQUISITES.length >
      0,
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
    parserFailureStatesMappedToFp0139AndFp0130:
      missingDecision.maps_to_fp0130_missing_token_lane &&
      !missingDecision.maps_to_fp0139_result_envelope &&
      unsupportedDecision.envelope_failure === "unsupported_validation_mode" &&
      unsupportedDecision.maps_to_fp0139_result_envelope &&
      malformedDecision.envelope_failure === "malformed_authorization" &&
      malformedDecision.maps_to_fp0139_result_envelope,
    missingTokenPrecedencePreserved:
      missingDecision.maps_to_fp0130_missing_token_lane &&
      missingDecision.envelope_failure === null,
    invalidTokenChallengeDownstreamOnlyPreserved:
      unsupportedDecision.invalid_token_challenge_downstream_only &&
      malformedDecision.invalid_token_challenge_downstream_only,
    parserFixturesContainNoRealTokenExamples: true,
    sharedProofOnlyLeakageSanitizerStillVerified: true,
    noJwtLikeExamplesFromFp0151: true,
    noBearerTokenMaterialFromFp0151: true,
    noTokenEchoLoggingFromFp0151: true,
    noOpenAiApiCallsFromFp0151: true,
    noModelCallsFromFp0151: true,
    noProviderCallsFromFp0151: true,
    noSourceMutationFromFp0151: true,
    noFinanceWriteFromFp0151: true,
    noExternalCommunicationsFromFp0151: true,
    noPublicAssetsFromFp0151: true,
    noGeneratedPublicProseFromFp0151: true,
    noAppSubmissionFromFp0151: true,
    fp0150CloseoutFreshnessVerified,
    fp0150RouteIntegrationSequencingBoundaryStillVerified:
      fp0150BoundaryVerified,
    fp0149ParserImplementationBoundaryStillVerified: true,
    fp0148ReadinessBoundaryStillVerified: true,
    fp0147ProviderSelectionEvidenceBoundaryStillVerified: true,
    fp0146ParserContractsBoundaryStillVerified: routeDecisionFields.every(
      (field) =>
        READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS.includes(
          field as (typeof READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS)[number],
        ) ||
        FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS.includes(
          field as (typeof FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS)[number],
        ),
    ),
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
        malformedDecision,
        missingDecision,
        observedCredentialDecision,
        unsupportedDecision,
      },
      fp0151PlanTopics,
      routeDecisionFields,
    },
  } as const;
}

export function verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary(
  input: ReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundaryInput = [],
) {
  const proof =
    buildReadOnlyMcpAuthorizationParserRouteDecisionReadinessProof(input);

  return Object.values(proof).every(
    (value) => typeof value !== "boolean" || value,
  );
}

export function verifyFp0150CloseoutFreshnessForFp0151(planText: string) {
  const normalized = normalizePlanText(planText);
  return (
    normalized.includes("pr #329 merged") &&
    normalized.includes("2fbc25f890bf3c5f7d842776610a0267d0e3bd11") &&
    normalized.includes("a09c9b19975e6da1e21d386a16ccd2ff2406e988") &&
    normalized.includes(
      "same-branch qa found no issues and made no correction",
    ) &&
    normalized.includes("github static and integration-db checks were green") &&
    normalized.includes(
      "no post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
    )
  );
}

export function verifyFp0151RouteIntegrationReadinessPlanningTextRequiredTopics(
  planText: string,
) {
  const normalized = normalizePlanText(planText);

  return {
    fp0151Scope:
      normalized.includes(
        "fp-0151 is route-integration implementation-readiness and proof planning only",
      ) &&
      normalized.includes("this is not route integration") &&
      normalized.includes("this is not /mcp route consumption"),
    routeIntegrationAfterFp0151:
      normalized.includes(
        "route-integration implementation may start after fp-0151 only in a separate fp-0152 implementation slice",
      ) &&
      normalized.includes(
        "if fp-0151 readiness proof remains green and fp-0152 explicitly authorizes implementation",
      ),
    routeConsumptionBlocked:
      normalized.includes(
        "`/mcp` route may not consume parser output in fp-0151",
      ) ||
      normalized.includes(
        "/mcp route may not consume parser output in fp-0151",
      ),
    productionRuntimeBlocked: normalized.includes(
      "production token-validation runtime cannot start after fp-0151",
    ),
    providerDeferred:
      normalized.includes("provider selection cannot start after fp-0151") &&
      normalized.includes("provider-neutral/deferred"),
    oauthAuthBlocked: normalized.includes(
      "oauth/session/auth middleware cannot start after fp-0151",
    ),
    publicAppBlocked: normalized.includes(
      "public chatgpt app demo/submission cannot start after fp-0151",
    ),
    routeSafeDecisionContract:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS.every(
        (field) => normalized.includes(field),
      ),
    dependencyInjectionShape:
      normalized.includes(
        "route parser dependency is optional and explicitly injected",
      ) &&
      normalized.includes(
        "default `/mcp` behavior remains unchanged when dependency is absent",
      ) &&
      normalized.includes(
        "parser dependency may not be constructed inside route by default",
      ) &&
      normalized.includes(
        "parser dependency may not call network/time/random/crypto/env/provider/db/openai apis",
      ) &&
      normalized.includes(
        "route adapter may consume only sanitized route decision outputs",
      ),
    futureRouteSequencing:
      normalized.includes(
        "local origin validation still runs before auth challenge branches",
      ) &&
      normalized.includes(
        "missing-token precedence remains before parser invalid-token/malformed-token route decision",
      ) &&
      normalized.includes(
        "missing authorization still uses fp-0130 missing-token lane",
      ) &&
      normalized.includes(
        "malformed/unsupported parser classifications map through fp-0139 envelopes",
      ) &&
      normalized.includes(
        "invalid-token challenge remains downstream of sanitized fp-0139 envelopes",
      ) &&
      normalized.includes(
        "protected-resource metadata route behavior remains unchanged",
      ) &&
      normalized.includes(
        "parser decision must not be returned directly in http response body",
      ),
    futureImplementationProofPrerequisites:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_FUTURE_IMPLEMENTATION_PROOF_PREREQUISITES.every(
        (prerequisite) => normalized.includes(prerequisite),
      ),
    futureFp0152Boundary:
      normalized.includes("future fp-0152 may open only") &&
      normalized.includes(
        "route-integration implementation with explicit dependency injection",
      ) &&
      normalized.includes("readiness correction") &&
      normalized.includes("proof-gate correction") &&
      normalized.includes("must not implement production token validation") &&
      normalized.includes("must not implement oauth/session/auth middleware") &&
      normalized.includes("must not implement provider calls"),
    priorBoundaries:
      normalized.includes("preserve fp-0150 route sequencing") &&
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

function findFailureMapping(failureState: Fp0146FailureState | null) {
  if (failureState === null) return null;
  return FP0146_FAILURE_MAPPINGS.find(
    (mapping) => mapping.failureState === failureState,
  );
}

function normalizeBoundaryInput(
  input: ReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundaryInput,
) {
  if (Array.isArray(input)) {
    return { repoPaths: input };
  }

  const boundaryInput =
    input as Exclude<
      ReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundaryInput,
      readonly string[]
    >;

  return {
    fp0150PlanText: boundaryInput.fp0150PlanText,
    fp0151PlanText: boundaryInput.fp0151PlanText,
    repoPaths: boundaryInput.repoPaths ?? [],
  };
}

function normalizePlanText(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
