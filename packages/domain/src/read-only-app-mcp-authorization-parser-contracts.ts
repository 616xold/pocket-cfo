import type { TokenValidationFailureTaxonomy } from "./read-only-app-mcp-token-validation-result-envelope-contracts";

export const MCP_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_SCHEMA_VERSION =
  "v2bn.read-only-app-mcp-authorization-parser-contracts-provider-selection-proof.v1";

export const FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PATH =
  "plans/FP-0146-read-only-chatgpt-app-mcp-authorization-parser-contracts-provider-selection-proof.md";

export const FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PREFIX =
  "FP-0146";

export const FP0147_AUTHORIZATION_PARSER_FOLLOWUP_PLAN_PREFIX = "FP-0147";

export const FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH =
  "plans/FP-0147-read-only-chatgpt-app-mcp-provider-selection-evidence-hardening.md";

export const FP0148_AUTHORIZATION_PARSER_FOLLOWUP_PLAN_PREFIX = "FP-0148";

export const FP0146_PROVIDER_MODE = "provider_neutral_deferred" as const;

export const FP0146_CANDIDATE_PROVIDER_MODES = [
  "jwt_jwks_candidate",
  "opaque_introspection_candidate",
  "provider_neutral_deferred",
] as const;

export const FP0146_AUTHORIZATION_PRESENCE_VALUES = [
  "absent",
  "present",
] as const;

export const FP0146_AUTHORIZATION_SCHEME_CLASSIFICATION_VALUES = [
  "bearer",
  "unsupported",
  "malformed",
  "not_evaluated",
] as const;

export const FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS = [
  "authorization_presence",
  "authorization_scheme_classification",
  "credential_material_observed",
  "parser_contract_version",
  "sanitized_request_metadata_reference",
  "canonical_resource_uri_reference",
  "resource_indicator_reference",
  "company_selector_reference",
  "no_raw_header_retained",
  "no_raw_token_retained",
  "no_token_derived_fingerprint_retained",
] as const;

export const FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS = [
  "token_prefix",
  "token_suffix",
  "token_length",
  "token_hash",
  "token_digest",
  "token_claims",
  "decoded_header",
  "decoded_payload",
] as const;

export const FP0146_PROVIDER_SELECTION_CRITERIA = [
  "oauth_2_1_posture",
  "protected_resource_metadata_compatibility",
  "authorization_server_metadata_discovery",
  "resource_parameter_support",
  "issuer_claim_source",
  "audience_resource_binding",
  "scopes_and_least_privilege",
  "jwks_availability_and_key_rotation_if_jwt_jwks",
  "introspection_endpoint_revocation_service_unavailable_if_opaque",
  "replay_nonce_posture",
  "development_tenant_test_tenant_posture",
  "mtls_egress_ip_allowlist_posture_if_relevant",
  "no_token_passthrough",
  "no_credential_forwarding",
  "no_provider_calls_in_this_slice",
] as const;

export const FP0146_FAILURE_STATES = [
  "missing_authorization",
  "malformed_authorization",
  "unsupported_scheme",
  "multiple_authorization_values",
  "bearer_without_material",
  "bearer_with_unsafe_whitespace_or_control_characters",
  "token_material_passthrough_attempt",
] as const;

export type Fp0146FailureState = (typeof FP0146_FAILURE_STATES)[number];

export type Fp0146AuthorizationPresence =
  (typeof FP0146_AUTHORIZATION_PRESENCE_VALUES)[number];

export type Fp0146AuthorizationSchemeClassification =
  (typeof FP0146_AUTHORIZATION_SCHEME_CLASSIFICATION_VALUES)[number];

export type Fp0146ProviderMode =
  (typeof FP0146_CANDIDATE_PROVIDER_MODES)[number];

export type Fp0146ParserFailureMapping = {
  envelopeFailure: TokenValidationFailureTaxonomy;
  failureState: Fp0146FailureState;
  invalidTokenChallengeDownstreamOfFp0139: boolean;
  missingTokenLaneSeparate: boolean;
  noForwarding: true;
  noTokenEcho: true;
};

export type Fp0146SanitizedAuthorizationParserOutputContract = {
  authorization_presence: Fp0146AuthorizationPresence;
  authorization_scheme_classification: Fp0146AuthorizationSchemeClassification;
  canonical_resource_uri_reference: string;
  company_selector_reference: string;
  credential_material_observed: boolean;
  no_raw_header_retained: true;
  no_raw_token_retained: true;
  no_token_derived_fingerprint_retained: true;
  parser_contract_version: typeof MCP_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_SCHEMA_VERSION;
  resource_indicator_reference: string;
  sanitized_request_metadata_reference: string;
};

type Fp0146BoundaryInput =
  | readonly string[]
  | {
      planText?: string;
      repoPaths: readonly string[];
    };

export const FP0146_FAILURE_MAPPINGS = [
  mapping("missing_authorization", "missing_token", false, true),
  mapping("malformed_authorization", "malformed_authorization"),
  mapping("unsupported_scheme", "unsupported_validation_mode"),
  mapping("multiple_authorization_values", "malformed_authorization"),
  mapping("bearer_without_material", "malformed_authorization"),
  mapping(
    "bearer_with_unsafe_whitespace_or_control_characters",
    "malformed_authorization",
  ),
  mapping("token_material_passthrough_attempt", "invalid_token"),
] as const satisfies readonly Fp0146ParserFailureMapping[];

export type Fp0146AuthorizationParserContractsProof = ReturnType<
  typeof buildFp0146AuthorizationParserContractsProviderSelectionProof
>;

export function buildFp0146AuthorizationParserContractsProviderSelectionProof() {
  return {
    schemaVersion:
      MCP_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_SCHEMA_VERSION,
    localProofOnly: true,
    parserContractAndProviderSelectionProofOnly: true,
    authorizationParserImplementationCanStartAfterFp0146: false,
    productionTokenValidationRuntimeCanStartAfterFp0146: false,
    tokenParserImplementationCanStartAfterFp0146: false,
    jwtDecoderImplementationCanStartAfterFp0146: false,
    jwksFetchingCachingImplementationCanStartAfterFp0146: false,
    tokenIntrospectionImplementationCanStartAfterFp0146: false,
    oauthSessionAuthMiddlewareCanStartAfterFp0146: false,
    routeBehaviorMayChangeAfterFp0146: false,
    providerMode: FP0146_PROVIDER_MODE,
    candidateProviderModes: [...FP0146_CANDIDATE_PROVIDER_MODES],
    futureParserInputContract: {
      authorizationHeaderInspectionFutureOnly: true,
      contractRetainsRawAuthorizationHeader: false,
      contractRetainsRawTokenMaterial: false,
      contractRetainsTokenDerivedFingerprint: false,
      sanitizedReferencesOnly: true,
    },
    sanitizedParserOutputContract: buildFp0146SanitizedParserOutputContract(),
    allowedSanitizedParserOutputFields: [
      ...FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS,
    ],
    forbiddenTokenDerivedObservabilityFields: [
      ...FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
    ],
    parserFailureMappings: [...FP0146_FAILURE_MAPPINGS],
    providerSelectionCriteria: [...FP0146_PROVIDER_SELECTION_CRITERIA],
    futureFp0147MayOpenOnly: [
      "parser_implementation_readiness",
      "provider_selection_evidence_hardening",
    ],
    publicChatGptAppDemoSubmissionFutureOnly: true,
    preservesFp0139ResultEnvelopesAsOnlyFutureValidationOutputContract: true,
    preservesFp0130MissingTokenLane: true,
    preservesInvalidTokenChallengeDownstreamOfFp0139: true,
    preservesProtectedResourceMetadataRouteBehavior: true,
    preservesMcpRouteBehavior: true,
    noProviderCallsInThisSlice: true,
    noCredentialForwardingInThisSlice: true,
    noTokenPassthroughInThisSlice: true,
  } as const;
}

export function buildFp0146SanitizedParserOutputContract(
  input: Partial<Fp0146SanitizedAuthorizationParserOutputContract> = {},
): Fp0146SanitizedAuthorizationParserOutputContract {
  return {
    authorization_presence: input.authorization_presence ?? "absent",
    authorization_scheme_classification:
      input.authorization_scheme_classification ?? "not_evaluated",
    credential_material_observed: input.credential_material_observed ?? false,
    parser_contract_version:
      MCP_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_SCHEMA_VERSION,
    sanitized_request_metadata_reference:
      input.sanitized_request_metadata_reference ??
      "sanitized_request_metadata_reference",
    canonical_resource_uri_reference:
      input.canonical_resource_uri_reference ?? "canonical_resource_reference",
    resource_indicator_reference:
      input.resource_indicator_reference ?? "resource_indicator_reference",
    company_selector_reference:
      input.company_selector_reference ?? "company_selector_reference",
    no_raw_header_retained: true,
    no_raw_token_retained: true,
    no_token_derived_fingerprint_retained: true,
  };
}

export function verifyFp0146AbsentOrParserContractProviderSelectionProofPlan(
  input: Fp0146BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const hits = fpPlanHits(
    repoPaths,
    FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PREFIX,
  );
  if (hits.length === 0) return true;

  return (
    hits.length === 1 &&
    hits[0] ===
      FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PATH &&
    (typeof planText !== "string" || fp0146PlanTextBoundaryVerified(planText))
  );
}

export function verifyFp0146ParserContractProviderSelectionProofPlanBoundary(
  input: Fp0146BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const hits = fpPlanHits(
    repoPaths,
    FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PREFIX,
  );

  return (
    hits.length === 1 &&
    hits[0] ===
      FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PATH &&
    typeof planText === "string" &&
    fp0146PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0147Absent(repoPaths: readonly string[]) {
  return (
    fpPlanHits(repoPaths, FP0147_AUTHORIZATION_PARSER_FOLLOWUP_PLAN_PREFIX)
      .length === 0
  );
}

export function verifyFp0147AbsentOrProviderSelectionEvidenceHardeningPlan(
  repoPaths: readonly string[],
) {
  const hits = fpPlanHits(
    repoPaths,
    FP0147_AUTHORIZATION_PARSER_FOLLOWUP_PLAN_PREFIX,
  );
  if (hits.length === 0) return true;

  return (
    hits.length === 1 &&
    hits[0] === FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH
  );
}

export function verifyFp0148Absent(repoPaths: readonly string[]) {
  return (
    fpPlanHits(repoPaths, FP0148_AUTHORIZATION_PARSER_FOLLOWUP_PLAN_PREFIX)
      .length === 0
  );
}

export function verifyFp0146AuthorizationParserContractsProof() {
  const proof = buildFp0146AuthorizationParserContractsProviderSelectionProof();
  const outputFieldNames = Object.keys(proof.sanitizedParserOutputContract);

  return (
    proof.parserContractAndProviderSelectionProofOnly &&
    proof.authorizationParserImplementationCanStartAfterFp0146 === false &&
    proof.productionTokenValidationRuntimeCanStartAfterFp0146 === false &&
    proof.tokenParserImplementationCanStartAfterFp0146 === false &&
    proof.jwtDecoderImplementationCanStartAfterFp0146 === false &&
    proof.jwksFetchingCachingImplementationCanStartAfterFp0146 === false &&
    proof.tokenIntrospectionImplementationCanStartAfterFp0146 === false &&
    proof.oauthSessionAuthMiddlewareCanStartAfterFp0146 === false &&
    proof.routeBehaviorMayChangeAfterFp0146 === false &&
    proof.providerMode === FP0146_PROVIDER_MODE &&
    proof.candidateProviderModes.includes("jwt_jwks_candidate") &&
    proof.candidateProviderModes.includes("opaque_introspection_candidate") &&
    proof.candidateProviderModes.includes("provider_neutral_deferred") &&
    proof.futureParserInputContract.contractRetainsRawAuthorizationHeader ===
      false &&
    proof.futureParserInputContract.contractRetainsRawTokenMaterial === false &&
    proof.futureParserInputContract.contractRetainsTokenDerivedFingerprint ===
      false &&
    FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS.every((field) =>
      outputFieldNames.includes(field),
    ) &&
    FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS.every(
      (field) => !outputFieldNames.includes(field),
    ) &&
    verifyFp0146ParserFailureMapping() &&
    proof.providerSelectionCriteria.length ===
      FP0146_PROVIDER_SELECTION_CRITERIA.length &&
    proof.preservesFp0139ResultEnvelopesAsOnlyFutureValidationOutputContract &&
    proof.preservesFp0130MissingTokenLane &&
    proof.preservesInvalidTokenChallengeDownstreamOfFp0139 &&
    proof.preservesProtectedResourceMetadataRouteBehavior &&
    proof.preservesMcpRouteBehavior &&
    proof.noProviderCallsInThisSlice &&
    proof.noCredentialForwardingInThisSlice &&
    proof.noTokenPassthroughInThisSlice
  );
}

export function verifyFp0146ParserFailureMapping() {
  const mappedFailures = FP0146_FAILURE_MAPPINGS.map(
    ({ envelopeFailure }) => envelopeFailure,
  );
  const mappedStates = FP0146_FAILURE_MAPPINGS.map(
    ({ failureState }) => failureState,
  );

  return (
    FP0146_FAILURE_STATES.every((state) => mappedStates.includes(state)) &&
    FP0146_FAILURE_MAPPINGS.length === FP0146_FAILURE_STATES.length &&
    mappedFailures.every((failure) => typeof failure === "string") &&
    FP0146_FAILURE_MAPPINGS.every(
      ({ noForwarding, noTokenEcho }) => noForwarding && noTokenEcho,
    ) &&
    FP0146_FAILURE_MAPPINGS.find(
      ({ failureState }) => failureState === "missing_authorization",
    )?.missingTokenLaneSeparate === true &&
    FP0146_FAILURE_MAPPINGS.find(
      ({ failureState }) => failureState === "unsupported_scheme",
    )?.envelopeFailure === "unsupported_validation_mode" &&
    FP0146_FAILURE_MAPPINGS.find(
      ({ failureState }) =>
        failureState === "token_material_passthrough_attempt",
    )?.envelopeFailure === "invalid_token"
  );
}

export function verifyFp0146PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    parserContractProviderSelectionProofOnly:
      normalized.includes(
        "fp-0146 is parser-contract/provider-selection-proof only",
      ) &&
      normalized.includes(
        "fp-0146 does not parse, decode, validate, introspect, fetch, store, authorize, authenticate, or route tokens",
      ),
    parserImplementationStillBlocked:
      normalized.includes(
        "authorization parser implementation remains blocked",
      ) &&
      normalized.includes(
        "only a future implementation-readiness slice may open",
      ),
    productionRuntimeStillBlocked:
      normalized.includes(
        "production token-validation runtime still cannot start after fp-0146",
      ) &&
      normalized.includes(
        "fp-0146 does not authorize production token validation runtime",
      ),
    providerNeutralDeferred:
      normalized.includes("provider-neutral/deferred") &&
      normalized.includes("jwt/jwks") &&
      normalized.includes("opaque introspection") &&
      normalized.includes("do not invent a provider"),
    sanitizedInputContract:
      normalized.includes("future authorization parser input contract") &&
      normalized.includes("without retaining raw header") &&
      normalized.includes("without retaining raw token material"),
    sanitizedOutputFields:
      FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS.every((field) =>
        normalized.includes(field),
      ),
    forbiddenTokenDerivedFields:
      FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS.every((field) =>
        normalized.includes(field),
      ) && normalized.includes("forbidden until separately proven"),
    failureStatesMapped:
      FP0146_FAILURE_STATES.every((state) => normalized.includes(state)) &&
      normalized.includes(
        "unsupported scheme -> unsupported_validation_mode",
      ) &&
      normalized.includes(
        "token material passthrough attempt -> invalid_token",
      ),
    providerSelectionCriteria: FP0146_PROVIDER_SELECTION_CRITERIA.every(
      (criterion) => normalized.includes(criterion),
    ),
    fp0147Boundary:
      normalized.includes("future fp-0147 may open only") &&
      normalized.includes("parser-implementation-readiness") &&
      normalized.includes("provider-selection-evidence-hardening") &&
      normalized.includes("not production validation runtime"),
    publicAppFutureOnly:
      normalized.includes(
        "public chatgpt app demo/submission remains future-only",
      ) ||
      normalized.includes(
        "public chatgpt app demo and submission remain future-only",
      ),
    priorPosturePreserved:
      normalized.includes(
        "fp-0139 result envelopes remain the only future validation output contract",
      ) &&
      normalized.includes("fp-0130 missing-token lane remains separate") &&
      normalized.includes(
        "invalid-token challenge remains downstream of sanitized fp-0139 envelopes",
      ) &&
      normalized.includes(
        "protected-resource metadata route behavior unchanged",
      ) &&
      (normalized.includes("/mcp route behavior unchanged") ||
        normalized.includes("`/mcp` route behavior unchanged")),
  };
}

function fp0146PlanTextBoundaryVerified(planText: string) {
  const topics = verifyFp0146PlanningTextRequiredTopics(planText);
  return (
    Object.values(topics).every(Boolean) &&
    verifyFp0146AuthorizationParserContractsProof()
  );
}

function mapping(
  failureState: Fp0146FailureState,
  envelopeFailure: TokenValidationFailureTaxonomy,
  invalidTokenChallengeDownstreamOfFp0139 = true,
  missingTokenLaneSeparate = false,
): Fp0146ParserFailureMapping {
  return {
    envelopeFailure,
    failureState,
    invalidTokenChallengeDownstreamOfFp0139,
    missingTokenLaneSeparate,
    noForwarding: true,
    noTokenEcho: true,
  };
}

function normalizeBoundaryInput(input: Fp0146BoundaryInput) {
  if ("repoPaths" in input) return input;
  return { repoPaths: input };
}

function fpPlanHits(repoPaths: readonly string[], planPrefix: string) {
  return repoPaths
    .map((path) => path.replace(/\\/gu, "/"))
    .filter((path) => path.includes(planPrefix));
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
