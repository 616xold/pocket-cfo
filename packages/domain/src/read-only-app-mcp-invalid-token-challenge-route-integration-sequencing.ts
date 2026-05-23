import {
  TOKEN_VALIDATION_FAILURE_TAXONOMY,
  TOKEN_VALIDATION_WWW_AUTHENTICATE_ERROR_SYMBOLS,
} from "./read-only-app-mcp-token-validation-result-envelope-contracts";

export const MCP_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_SCHEMA_VERSION =
  "v2bj.read-only-app-mcp-invalid-token-route-integration-sequencing.v1";

export const FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH =
  "plans/FP-0142-read-only-chatgpt-app-mcp-invalid-token-route-integration-sequencing-master-plan.md";

export const MCP_INVALID_TOKEN_CHALLENGE_FP0143_PLAN_PREFIX = "FP-0143";

type Fp0142BoundaryInput =
  | readonly string[]
  | {
      planText?: string;
      repoPaths: readonly string[];
    };

export function verifyFp0142AbsentOrRouteIntegrationSequencingPlan(
  input: Fp0142BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0142Hits = fpPlanHits(repoPaths, "FP-0142");
  if (fp0142Hits.length === 0) return true;

  return (
    fp0142Hits.length === 1 &&
    fp0142Hits[0] ===
      FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH &&
    (typeof planText !== "string" || fp0142PlanTextBoundaryVerified(planText))
  );
}

export function verifyFp0142RouteIntegrationSequencingPlanBoundary(
  input: Fp0142BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0142Hits = fpPlanHits(repoPaths, "FP-0142");
  return (
    fp0142Hits.length === 1 &&
    fp0142Hits[0] ===
      FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH &&
    typeof planText === "string" &&
    fp0142PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0143Absent(repoPaths: readonly string[]) {
  return fpPlanHits(repoPaths, MCP_INVALID_TOKEN_CHALLENGE_FP0143_PLAN_PREFIX)
    .length === 0;
}

export function verifyFp0142PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    docsAndPlanOnly:
      normalized.includes("docs-and-plan plus proof-gate compatibility only") &&
      normalized.includes("fp-0142 does not implement route integration") &&
      normalized.includes("fp-0142 does not change `/mcp` route behavior"),
    routeIntegrationBlocked:
      normalized.includes("route integration implementation remains blocked") &&
      normalized.includes("future fp-0143 remains absent"),
    appConstructionWiringBlocked:
      normalized.includes("app-construction wiring implementation remains blocked") &&
      normalized.includes("buildapp wiring remains future-only"),
    authorizationHeaderPresenceDecision:
      normalized.includes(
        "future invalid-token challenge activation requires an authorization header to be present",
      ),
    dependencyCoRegistration:
      normalized.includes(
        "co-registered with the missing-token challenge dependency",
      ) &&
      normalized.includes(
        "co-registered with accepted protected-resource metadata route-input evidence",
      ),
    malformedAuthorizationWithoutHeaderParsing:
      normalized.includes(
        "malformed authorization can be represented without parsing raw authorization headers",
      ) &&
      normalized.includes("sanitized fp-0139 `malformed_authorization` result envelope"),
    missingTokenPrecedence:
      normalized.includes("missing-token challenge must take precedence") &&
      normalized.includes("authorization header is absent"),
    protectedResourceMetadataSeparation:
      normalized.includes(
        "protected-resource metadata route behavior remains separate and unchanged",
      ),
    buildAppSurfaceDecision:
      normalized.includes(
        "fp-0141 result-envelope dependency may be surfaced through buildapp only in a future explicit app-construction plan",
      ) &&
      normalized.includes("route-registration-only remains the current state"),
    resultEnvelopeOnlyDependency:
      normalized.includes(
        "fp-0139 result envelopes are the only permitted source",
      ) &&
      normalized.includes(
        "fp-0134 synthetic evaluator output remains proof/test-only",
      ),
    failureTaxonomyHttpWwwAuthenticateConsistency:
      normalized.includes(
        "failure taxonomy / http posture / symbolic www-authenticate error values must be cross-validated",
      ) &&
      normalized.includes("emitted header error"),
    proofBeforeFp0143:
      normalized.includes("before fp-0143 may implement route integration") &&
      normalized.includes("fp-0143 remains absent"),
    permanentForbiddenScope:
      [
        "production token validation",
        "token parser",
        "jwt decoder",
        "token introspection",
        "oauth",
        "token/session storage",
        "auth middleware",
        "real token examples",
        "jwt-like examples",
        "bearer material",
        "token echo",
        "token logging",
        "db queries",
        "schemas",
        "migrations",
        "package scripts",
        "openai api/model calls",
        "provider calls",
        "source mutation",
        "finance writes",
      ].every((requiredText) => normalized.includes(requiredText)),
    officialResearchRecorded:
      normalized.includes("mcp authorization") &&
      normalized.includes("mcp security best practices") &&
      normalized.includes("rfc 6750") &&
      normalized.includes("rfc 8707") &&
      normalized.includes("rfc 9728") &&
      normalized.includes("openai apps sdk authentication") &&
      normalized.includes("openai apps sdk security & privacy"),
  };
}

export function verifyFp0142FailureTaxonomyHttpWwwAuthenticateConsistency() {
  return (
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("malformed_authorization") &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("invalid_token") &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("expired_token") &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("revoked_token") &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("insufficient_scope") &&
    TOKEN_VALIDATION_WWW_AUTHENTICATE_ERROR_SYMBOLS.includes(
      "invalid_request",
    ) &&
    TOKEN_VALIDATION_WWW_AUTHENTICATE_ERROR_SYMBOLS.includes(
      "invalid_token",
    ) &&
    TOKEN_VALIDATION_WWW_AUTHENTICATE_ERROR_SYMBOLS.includes(
      "insufficient_scope",
    ) &&
    TOKEN_VALIDATION_WWW_AUTHENTICATE_ERROR_SYMBOLS.includes(
      "fail_closed_non_leaking",
    )
  );
}

function fp0142PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return (
    [
      "docs-and-plan plus proof-gate compatibility only",
      "fp-0142 does not implement route integration",
      "fp-0142 does not change `/mcp` route behavior",
      "future invalid-token challenge activation requires an authorization header to be present",
      "missing-token challenge must take precedence",
      "protected-resource metadata route behavior remains separate and unchanged",
      "fp-0139 result envelopes are the only permitted source",
      "failure taxonomy / http posture / symbolic www-authenticate error values must be cross-validated",
      "before fp-0143 may implement route integration",
      "fp-0143 remains absent",
    ].every((requiredText) => normalized.includes(requiredText)) &&
    Object.values(verifyFp0142PlanningTextRequiredTopics(planText)).every(
      Boolean,
    )
  );
}

function normalizeBoundaryInput(input: Fp0142BoundaryInput) {
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
