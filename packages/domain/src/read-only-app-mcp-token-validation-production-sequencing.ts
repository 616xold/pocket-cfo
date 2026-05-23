import {
  TOKEN_VALIDATION_FAILURE_TAXONOMY,
  type TokenValidationFailureTaxonomy,
} from "./read-only-app-mcp-token-validation-result-envelope-contracts";

export const MCP_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_SCHEMA_VERSION =
  "v2bl.read-only-app-mcp-production-token-validation-sequencing.v1";

export const FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PATH =
  "plans/FP-0144-read-only-chatgpt-app-mcp-production-token-validation-sequencing-master-plan.md";

export const FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PREFIX =
  "FP-0144";

export const FP0145_PRODUCTION_TOKEN_VALIDATION_RUNTIME_PLAN_PREFIX = "FP-0145";

export const FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_STATES = [
  "missing_token",
  "malformed_authorization",
  "malformed_token",
  "invalid_token",
  "expired_token",
  "revoked_token",
  "wrong_audience",
  "wrong_resource",
  "wrong_scope",
  "insufficient_scope",
  "wrong_org",
  "wrong_company",
  "replayed_token",
  "token_passthrough_attempt",
  "unsupported_token_type",
  "validation_service_unavailable",
] as const;

export type Fp0144ProductionTokenValidationSequencingState =
  (typeof FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_STATES)[number];

export type Fp0144ProductionTokenValidationSequencingMapping = {
  envelopeFailure: TokenValidationFailureTaxonomy;
  invalidTokenChallengeDownstreamOfEnvelope: boolean;
  missingTokenLaneSeparate: boolean;
  noTokenEcho: true;
  state: Fp0144ProductionTokenValidationSequencingState;
};

type Fp0144BoundaryInput =
  | readonly string[]
  | {
      planText?: string;
      repoPaths: readonly string[];
    };

export const FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_STATE_MAPPINGS = [
  mapping("missing_token", "missing_token", false, true),
  mapping("malformed_authorization", "malformed_authorization"),
  mapping("malformed_token", "malformed_authorization"),
  mapping("invalid_token", "invalid_token"),
  mapping("expired_token", "expired_token"),
  mapping("revoked_token", "revoked_token"),
  mapping("wrong_audience", "wrong_audience"),
  mapping("wrong_resource", "wrong_resource"),
  mapping("wrong_scope", "insufficient_scope"),
  mapping("insufficient_scope", "insufficient_scope"),
  mapping("wrong_org", "wrong_org"),
  mapping("wrong_company", "company_binding_mismatch"),
  mapping("replayed_token", "replay_or_nonce_failure"),
  mapping("token_passthrough_attempt", "invalid_token"),
  mapping("unsupported_token_type", "unsupported_validation_mode"),
  mapping(
    "validation_service_unavailable",
    "production_validation_unavailable",
  ),
] as const satisfies readonly Fp0144ProductionTokenValidationSequencingMapping[];

export function verifyFp0145Absent(repoPaths: readonly string[]) {
  return (
    fpPlanHits(
      repoPaths,
      FP0145_PRODUCTION_TOKEN_VALIDATION_RUNTIME_PLAN_PREFIX,
    ).length === 0
  );
}

export function verifyFp0144AbsentOrDocsOnlyProductionTokenValidationSequencingPlan(
  input: Fp0144BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0144Hits = fpPlanHits(
    repoPaths,
    FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PREFIX,
  );
  if (fp0144Hits.length === 0) return true;

  return (
    fp0144Hits.length === 1 &&
    fp0144Hits[0] === FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PATH &&
    (typeof planText !== "string" || fp0144PlanTextBoundaryVerified(planText))
  );
}

export function verifyFp0144ProductionTokenValidationSequencingPlanBoundary(
  input: Fp0144BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0144Hits = fpPlanHits(
    repoPaths,
    FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PREFIX,
  );
  return (
    fp0144Hits.length === 1 &&
    fp0144Hits[0] === FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PATH &&
    typeof planText === "string" &&
    fp0144PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0144FailureStateMapping() {
  const mappedStates =
    FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_STATE_MAPPINGS.map(
      ({ state }) => state,
    );
  const mappedFailures =
    FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_STATE_MAPPINGS.map(
      ({ envelopeFailure }) => envelopeFailure,
    );

  return (
    FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_STATES.every((state) =>
      mappedStates.includes(state),
    ) &&
    FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_STATE_MAPPINGS.length ===
      FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_STATES.length &&
    mappedFailures.every((failure) =>
      TOKEN_VALIDATION_FAILURE_TAXONOMY.includes(failure),
    ) &&
    FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_STATE_MAPPINGS.every(
      ({ noTokenEcho }) => noTokenEcho,
    ) &&
    FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_STATE_MAPPINGS.find(
      ({ state }) => state === "missing_token",
    )?.missingTokenLaneSeparate === true
  );
}

export function verifyFp0144PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    docsAndProofGateOnly:
      normalized.includes("docs-and-plan plus proof-gate compatibility only") &&
      normalized.includes(
        "fp-0144 does not implement production token validation",
      ) &&
      normalized.includes("fp-0144 does not parse authorization headers"),
    productionRuntimeCannotStart:
      normalized.includes(
        "production token-validation runtime cannot start from current repo truth",
      ) &&
      normalized.includes(
        "the next implementation slice should be runtime contracts and proof-hardening only",
      ),
    providerNeutralDecisionRecorded:
      normalized.includes(
        "jwt/jwks versus opaque-token introspection remains unresolved",
      ) &&
      normalized.includes(
        "provider-neutral sequencing is the fp-0144 decision",
      ),
    authorizationParserDeferred: normalized.includes(
      "authorization header parsing cannot start before provider, authorization-server, canonical resource, and no-token-leakage gates are proven",
    ),
    prerequisiteGatesRecorded: [
      "canonical resource uri",
      "protected-resource metadata",
      "resource indicators",
      "authorization server discovery",
      "issuer",
      "audience",
      "scope",
      "org/company binding",
    ].every((requiredText) => normalized.includes(requiredText)),
    validationPrerequisitesRecorded: [
      "jwks fetching/caching",
      "introspection",
      "revocation",
      "replay detection",
      "clock skew",
      "key rotation",
      "issuer validation",
      "audience/resource validation",
      "scope minimization",
    ].every((requiredText) => normalized.includes(requiredText)),
    localProofHardeningNeeded: normalized.includes(
      "one more local proof-hardening and runtime-contract slice is required before runtime validation can open",
    ),
    fp0139EnvelopeOnlyContract:
      normalized.includes(
        "fp-0139 result envelopes remain the only runtime output contract",
      ) &&
      normalized.includes(
        "invalid-token challenge emission remains downstream of fp-0139 sanitized envelopes",
      ),
    failureStatesMapped:
      FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_STATES.every(
        (state) =>
          normalized.includes(state.replace(/_/gu, "-")) ||
          normalized.includes(state),
      ),
    missingTokenSeparate:
      normalized.includes("missing-token behavior stays separate") &&
      normalized.includes("missing_token remains the fp-0130 lane"),
    noTokenLeakage:
      normalized.includes("no-token-leakage remains enforced") &&
      normalized.includes("logs, docs, proof output, examples, error bodies"),
    fp0145FutureOnly:
      normalized.includes("fp-0145 remains absent") &&
      normalized.includes(
        "fp-0145 should not open production runtime implementation",
      ),
    futureOnlyScopeRecorded: [
      "actual validation",
      "parser/jwt/introspection",
      "oauth/session/auth middleware",
      "db/storage",
      "route behavior",
      "remote deployment",
      "public app",
      "submission",
    ].every((requiredText) => normalized.includes(requiredText)),
    officialResearchRecorded: [
      "mcp authorization",
      "mcp security best practices",
      "rfc 6750",
      "rfc 8707",
      "rfc 9728",
      "openai apps sdk authentication",
      "openai apps sdk security & privacy",
    ].every((requiredText) => normalized.includes(requiredText)),
    forbiddenScopeRecorded: [
      "authorization parser",
      "token parser",
      "jwt decoder",
      "token introspection",
      "jwks fetch",
      "oauth implementation",
      "token/session storage",
      "auth middleware",
      "route behavior change",
      "missing-token behavior change",
      "invalid-token challenge behavior change",
      "protected-resource metadata route behavior change",
      "db queries",
      "schema migrations",
      "package scripts",
      "real token examples",
      "jwt-like examples",
      "bearer material",
      "token echo",
      "token logging",
      "openai api/model calls",
      "provider calls",
      "source mutation",
      "finance writes",
    ].every((requiredText) => normalized.includes(requiredText)),
  };
}

function fp0144PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return (
    [
      "docs-and-plan plus proof-gate compatibility only",
      "fp-0144 plans future production token-validation sequencing only",
      "fp-0144 does not implement production token validation",
      "fp-0144 does not parse authorization headers",
      "jwt/jwks versus opaque-token introspection remains unresolved",
      "provider-neutral sequencing is the fp-0144 decision",
      "fp-0139 result envelopes remain the only runtime output contract",
      "missing-token behavior stays separate",
      "invalid-token challenge emission remains downstream of fp-0139 sanitized envelopes",
      "fp-0145 remains absent",
    ].every((requiredText) => normalized.includes(requiredText)) &&
    Object.values(verifyFp0144PlanningTextRequiredTopics(planText)).every(
      Boolean,
    ) &&
    verifyFp0144FailureStateMapping()
  );
}

function mapping(
  state: Fp0144ProductionTokenValidationSequencingState,
  envelopeFailure: TokenValidationFailureTaxonomy,
  invalidTokenChallengeDownstreamOfEnvelope = true,
  missingTokenLaneSeparate = false,
): Fp0144ProductionTokenValidationSequencingMapping {
  return {
    envelopeFailure,
    invalidTokenChallengeDownstreamOfEnvelope,
    missingTokenLaneSeparate,
    noTokenEcho: true,
    state,
  };
}

function normalizeBoundaryInput(input: Fp0144BoundaryInput) {
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
