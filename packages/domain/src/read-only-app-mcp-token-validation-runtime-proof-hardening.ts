import type { TokenValidationFailureTaxonomy } from "./read-only-app-mcp-token-validation-result-envelope-contracts";
import { verifyFp0146AbsentOrParserContractProviderSelectionProofPlan } from "./read-only-app-mcp-authorization-parser-contracts";

export const MCP_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_SCHEMA_VERSION =
  "v2bm.read-only-app-mcp-token-validation-runtime-contracts-proof-hardening.v1";

export const FP0145_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_PLAN_PATH =
  "plans/FP-0145-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-proof-hardening.md";

export const FP0145_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_PLAN_PREFIX =
  "FP-0145";

export const FP0146_TOKEN_VALIDATION_RUNTIME_FOLLOWUP_PLAN_PREFIX = "FP-0146";

export const FP0145_PROVIDER_MODE = "provider_neutral_unresolved" as const;

export const FP0145_FUTURE_RUNTIME_INPUT_BOUNDARY_FIELDS = [
  "authorization_presence",
  "authorization_scheme_classification",
  "sanitized_request_metadata",
  "canonical_resource_uri_reference",
  "resource_indicator_reference",
  "company_selector_reference",
] as const;

export const FP0145_VALIDATION_SOURCE_BOUNDARIES = [
  "provider_neutral_token_validator_contract",
  "jwt_jwks_adapter_future_only",
  "opaque_introspection_adapter_future_only",
  "revocation_replay_future_only",
  "issuer_audience_resource_scope_org_company_future_checks",
] as const;

export const FP0145_RESOURCE_AND_IDENTITY_PREREQUISITES = [
  "canonical_resource_uri",
  "protected_resource_metadata",
  "resource_indicators",
  "authorization_server_discovery",
  "issuer",
  "audience_resource",
  "scope",
  "org_company_binding",
  "company_selector",
  "no_token_leakage",
] as const;

export const FP0145_RUNTIME_SAFETY_PREREQUISITES = [
  "clock_skew",
  "key_rotation",
  "jwks_cache",
  "introspection_availability",
  "revocation",
  "replay_detection",
  "validation_service_unavailable",
  "fail_closed",
] as const;

export const FP0145_FAILURE_MODES = [
  "missing-token",
  "malformed_authorization",
  "malformed_token",
  "invalid",
  "expired",
  "revoked",
  "wrong-audience",
  "wrong-resource",
  "wrong-scope",
  "insufficient-scope",
  "wrong-org",
  "wrong-company",
  "replayed",
  "token-passthrough-attempt",
  "unsupported-token-type",
  "validation-service-unavailable",
] as const;

export type Fp0145FailureMode = (typeof FP0145_FAILURE_MODES)[number];

export type Fp0145FailureModeMapping = {
  envelopeFailure: TokenValidationFailureTaxonomy;
  failureMode: Fp0145FailureMode;
  invalidTokenChallengeDownstreamOfFp0139: boolean;
  missingTokenLaneSeparate: boolean;
  noTokenEcho: true;
};

export const FP0145_FAILURE_MODE_MAPPINGS = [
  mapping("missing-token", "missing_token", false, true),
  mapping("malformed_authorization", "malformed_authorization"),
  mapping("malformed_token", "malformed_authorization"),
  mapping("invalid", "invalid_token"),
  mapping("expired", "expired_token"),
  mapping("revoked", "revoked_token"),
  mapping("wrong-audience", "wrong_audience"),
  mapping("wrong-resource", "wrong_resource"),
  mapping("wrong-scope", "insufficient_scope"),
  mapping("insufficient-scope", "insufficient_scope"),
  mapping("wrong-org", "wrong_org"),
  mapping("wrong-company", "company_binding_mismatch"),
  mapping("replayed", "replay_or_nonce_failure"),
  mapping("token-passthrough-attempt", "invalid_token"),
  mapping("unsupported-token-type", "unsupported_validation_mode"),
  mapping("validation-service-unavailable", "production_validation_unavailable"),
] as const satisfies readonly Fp0145FailureModeMapping[];

type Fp0145BoundaryInput =
  | readonly string[]
  | {
      planText?: string;
      repoPaths: readonly string[];
    };

export type Fp0145RuntimeContractProof = ReturnType<
  typeof buildFp0145RuntimeContractProof
>;

export function buildFp0145RuntimeContractProof() {
  return {
    schemaVersion:
      MCP_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_SCHEMA_VERSION,
    localProofOnly: true,
    contractAndProofHardeningOnly: true,
    productionTokenValidationRuntimeCanStartAfterFp0145: false,
    providerMode: FP0145_PROVIDER_MODE,
    providerNeutralRuntimeContractRecorded: true,
    futureRuntimeInputBoundary: {
      allowedSanitizedFields: [
        ...FP0145_FUTURE_RUNTIME_INPUT_BOUNDARY_FIELDS,
      ],
      carriesAuthorizationPresenceOnly: true,
      carriesAuthorizationSchemeClassificationOnly: true,
      carriesDecodedClaims: false,
      carriesRawAuthorizationHeader: false,
      carriesRawTokenMaterial: false,
      carriesTokenText: false,
      tokenMaterialRetained: false,
    },
    validationSourceContracts: [...FP0145_VALIDATION_SOURCE_BOUNDARIES],
    resourceAndIdentityPrerequisites: [
      ...FP0145_RESOURCE_AND_IDENTITY_PREREQUISITES,
    ],
    runtimeSafetyPrerequisites: [...FP0145_RUNTIME_SAFETY_PREREQUISITES],
    failureModeMappings: [...FP0145_FAILURE_MODE_MAPPINGS],
    parserContractMayBePlannedNext: true,
    parserImplementationMayStartNext: false,
    providerSelectionProofMayBePlannedNext: true,
    runtimeImplementationMayStartNext: false,
    missingTokenBehaviorPreservedAsFp0130Lane: true,
    invalidTokenChallengeDownstreamOfFp0139SanitizedEnvelopes: true,
    protectedResourceMetadataRouteBehaviorPreserved: true,
    mcpRouteBehaviorPreserved: true,
    publicChatGptAppDemoSubmissionFutureOnly: true,
  } as const;
}

export function verifyFp0146Absent(repoPaths: readonly string[]) {
  return verifyFp0146AbsentOrParserContractProviderSelectionProofPlan(
    repoPaths,
  );
}

export function verifyFp0145AbsentOrContractOnlyTokenValidationRuntimeProofHardeningPlan(
  input: Fp0145BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const hits = fpPlanHits(
    repoPaths,
    FP0145_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_PLAN_PREFIX,
  );
  if (hits.length === 0) return true;

  return (
    hits.length === 1 &&
    hits[0] ===
      FP0145_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_PLAN_PATH &&
    (typeof planText !== "string" || fp0145PlanTextBoundaryVerified(planText))
  );
}

export function verifyFp0145TokenValidationRuntimeProofHardeningPlanBoundary(
  input: Fp0145BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const hits = fpPlanHits(
    repoPaths,
    FP0145_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_PLAN_PREFIX,
  );

  return (
    hits.length === 1 &&
    hits[0] ===
      FP0145_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_PLAN_PATH &&
    typeof planText === "string" &&
    fp0145PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0145FailureModeMapping() {
  const mappedFailures = FP0145_FAILURE_MODE_MAPPINGS.map(
    ({ envelopeFailure }) => envelopeFailure,
  );
  const mappedModes = FP0145_FAILURE_MODE_MAPPINGS.map(
    ({ failureMode }) => failureMode,
  );

  return (
    FP0145_FAILURE_MODES.every((mode) => mappedModes.includes(mode)) &&
    FP0145_FAILURE_MODE_MAPPINGS.length === FP0145_FAILURE_MODES.length &&
    mappedFailures.every((failure) => typeof failure === "string") &&
    FP0145_FAILURE_MODE_MAPPINGS.every(({ noTokenEcho }) => noTokenEcho) &&
    FP0145_FAILURE_MODE_MAPPINGS.find(
      ({ failureMode }) => failureMode === "missing-token",
    )?.missingTokenLaneSeparate === true
  );
}

export function verifyFp0145RuntimeContractProof() {
  const proof = buildFp0145RuntimeContractProof();

  return (
    proof.contractAndProofHardeningOnly &&
    proof.productionTokenValidationRuntimeCanStartAfterFp0145 === false &&
    proof.providerMode === FP0145_PROVIDER_MODE &&
    proof.futureRuntimeInputBoundary.carriesRawAuthorizationHeader === false &&
    proof.futureRuntimeInputBoundary.carriesRawTokenMaterial === false &&
    proof.futureRuntimeInputBoundary.carriesTokenText === false &&
    proof.validationSourceContracts.length ===
      FP0145_VALIDATION_SOURCE_BOUNDARIES.length &&
    proof.resourceAndIdentityPrerequisites.length ===
      FP0145_RESOURCE_AND_IDENTITY_PREREQUISITES.length &&
    proof.runtimeSafetyPrerequisites.length ===
      FP0145_RUNTIME_SAFETY_PREREQUISITES.length &&
    proof.parserContractMayBePlannedNext &&
    proof.parserImplementationMayStartNext === false &&
    proof.runtimeImplementationMayStartNext === false &&
    proof.missingTokenBehaviorPreservedAsFp0130Lane &&
    proof.invalidTokenChallengeDownstreamOfFp0139SanitizedEnvelopes &&
    proof.protectedResourceMetadataRouteBehaviorPreserved &&
    proof.mcpRouteBehaviorPreserved &&
    verifyFp0145FailureModeMapping()
  );
}

export function verifyFp0145PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    contractProofOnly:
      normalized.includes(
        "fp-0145 defines provider-neutral runtime contracts and proof gates only",
      ) &&
      normalized.includes(
        "fp-0145 does not parse, decode, validate, introspect, fetch, store, authorize, authenticate, or route tokens",
      ),
    productionRuntimeStillBlocked:
      normalized.includes(
        "production token-validation runtime still cannot start after fp-0145",
      ) &&
      normalized.includes(
        "fp-0145 does not authorize production token validation runtime",
      ),
    providerNeutralUnresolved:
      normalized.includes("provider-neutral/unresolved") &&
      normalized.includes("jwt/jwks") &&
      normalized.includes("opaque-token introspection"),
    parserContractOnlyNext:
      normalized.includes("only a parser contract may open next") &&
      normalized.includes("parser implementation remains blocked"),
    sanitizedInputBoundary:
      normalized.includes("authorization presence") &&
      normalized.includes("scheme classification") &&
      normalized.includes("sanitized validation request metadata") &&
      normalized.includes("not raw token material"),
    validationSourceContracts: FP0145_VALIDATION_SOURCE_BOUNDARIES.every(
      (text) => normalized.includes(text.replace(/_/gu, " ")),
    ),
    prerequisitesRecorded: [
      "canonical resource uri",
      "protected-resource metadata",
      "resource indicators",
      "authorization server discovery",
      "issuer",
      "audience/resource",
      "scope",
      "org/company binding",
      "company selector",
      "no-token-leakage",
    ].every((text) => normalized.includes(text)),
    runtimePrerequisitesRecorded: [
      "clock skew",
      "key rotation",
      "jwks cache",
      "introspection availability",
      "revocation",
      "replay detection",
      "validation-service-unavailable",
      "fail-closed",
    ].every((text) => normalized.includes(text)),
    failureModesMapped: FP0145_FAILURE_MODES.every((mode) =>
      normalized.includes(mode),
    ),
    fp0139EnvelopeOnly:
      normalized.includes("fp-0139 result envelopes remain the only") &&
      normalized.includes("future validation output contract"),
    routePosturePreserved:
      normalized.includes("/mcp route behavior unchanged") &&
      normalized.includes("missing-token behavior unchanged") &&
      normalized.includes("invalid-token challenge behavior unchanged") &&
      normalized.includes(
        "protected-resource metadata route behavior unchanged",
      ),
    fp0146Boundary:
      normalized.includes("future fp-0146 may open") &&
      normalized.includes("parser-contract-only") &&
      normalized.includes("provider-selection-proof-only") &&
      normalized.includes("not runtime implementation"),
    publicAppFutureOnly:
      normalized.includes("public chatgpt app demo/submission remains future-only") ||
      normalized.includes("public chatgpt app demo and submission remain future-only"),
  };
}

function fp0145PlanTextBoundaryVerified(planText: string) {
  const topics = verifyFp0145PlanningTextRequiredTopics(planText);
  return Object.values(topics).every(Boolean) && verifyFp0145RuntimeContractProof();
}

function mapping(
  failureMode: Fp0145FailureMode,
  envelopeFailure: TokenValidationFailureTaxonomy,
  invalidTokenChallengeDownstreamOfFp0139 = true,
  missingTokenLaneSeparate = false,
): Fp0145FailureModeMapping {
  return {
    envelopeFailure,
    failureMode,
    invalidTokenChallengeDownstreamOfFp0139,
    missingTokenLaneSeparate,
    noTokenEcho: true,
  };
}

function normalizeBoundaryInput(input: Fp0145BoundaryInput) {
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
