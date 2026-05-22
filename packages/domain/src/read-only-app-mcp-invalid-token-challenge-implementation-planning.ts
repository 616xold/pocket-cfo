import { z } from "zod";
import {
  TOKEN_VALIDATION_FAILURE_TAXONOMY,
  TOKEN_VALIDATION_WWW_AUTHENTICATE_ERROR_SYMBOLS,
} from "./read-only-app-mcp-token-validation-result-envelope-contracts";

const trueLiteral = z.literal(true);

export const MCP_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_SCHEMA_VERSION =
  "v2bh.read-only-app-mcp-invalid-token-challenge-implementation-planning.v1";

export const FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH =
  "plans/FP-0140-read-only-chatgpt-app-mcp-invalid-token-challenge-implementation-planning.md";

export const MCP_INVALID_TOKEN_CHALLENGE_FP0140_PLAN_PREFIX = "FP-0140";
export const MCP_INVALID_TOKEN_CHALLENGE_FP0141_PLAN_PREFIX = "FP-0141";

type Fp0140BoundaryInput =
  | readonly string[]
  | {
      planText?: string;
      repoPaths: readonly string[];
    };

export const McpInvalidTokenChallengeImplementationPlanningProofSchema = z
  .object({
    schemaVersion: z.literal(
      MCP_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_SCHEMA_VERSION,
    ),
    localProofOnly: trueLiteral,
    invalidTokenChallengeImplementationPlanningVerified: trueLiteral,
    fp0140BoundaryVerified: trueLiteral,
    fp0141Absent: trueLiteral,
    resultEnvelopeDependencyVerified: trueLiteral,
    missingTokenBehaviorStillSeparate: trueLiteral,
    protectedResourceMetadataBehaviorStillSeparate: trueLiteral,
    failureModeToHttpPosturePlanningVerified: trueLiteral,
    symbolicWwwAuthenticateErrorPlanningVerified: trueLiteral,
    noWwwAuthenticateHeaderRuntime: trueLiteral,
    noInvalidTokenChallengeRuntime: trueLiteral,
    noTokenParsingRuntime: trueLiteral,
    noJwtDecodingRuntime: trueLiteral,
    noTokenValidationRuntime: trueLiteral,
    noTokenIntrospectionRuntime: trueLiteral,
    noRouteConsumesSyntheticEvaluator: trueLiteral,
    noRealTokenExamples: trueLiteral,
    noJwtLikeExamples: trueLiteral,
    noBearerTokenMaterial: trueLiteral,
    noMcpRouteBehaviorChange: trueLiteral,
    noProtectedResourceMetadataRouteBehaviorChange: trueLiteral,
    noMissingTokenChallengeBehaviorChange: trueLiteral,
    noOauthImplementation: trueLiteral,
    noTokenSessionStorage: trueLiteral,
    noAuthMiddlewareImplementation: trueLiteral,
    noDbQueriesAdded: trueLiteral,
    noSchemaMigrationsAdded: trueLiteral,
    noPackageScriptsAdded: trueLiteral,
    noOpenAiApiCalls: trueLiteral,
    noProviderExternalCalls: trueLiteral,
    noSourceMutationFinanceWrite: trueLiteral,
    fp0139ResultEnvelopeBoundaryStillVerified: trueLiteral,
    fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified:
      trueLiteral,
    fp0137InvalidTokenChallengeReadinessBoundaryStillVerified: trueLiteral,
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified: trueLiteral,
    fp0135InvalidTokenChallengeSequencingBoundaryStillVerified: trueLiteral,
    fp0134SyntheticEvaluatorBoundaryStillVerified: trueLiteral,
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified: trueLiteral,
    fp0130MissingTokenChallengeBoundaryStillVerified: trueLiteral,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified: trueLiteral,
    fp0107RouteAdapterBoundaryStillVerified: trueLiteral,
    fp0106ProtocolEnvelopeBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
  })
  .strict();

export type McpInvalidTokenChallengeImplementationPlanningProof = z.infer<
  typeof McpInvalidTokenChallengeImplementationPlanningProofSchema
>;

export type McpInvalidTokenChallengeImplementationPlanningProofInput =
  Partial<
    Omit<
      McpInvalidTokenChallengeImplementationPlanningProof,
      "schemaVersion" | "localProofOnly"
    >
  >;

export function buildMcpInvalidTokenChallengeImplementationPlanningProof(
  input: McpInvalidTokenChallengeImplementationPlanningProofInput = {},
): McpInvalidTokenChallengeImplementationPlanningProof {
  return McpInvalidTokenChallengeImplementationPlanningProofSchema.parse({
    schemaVersion:
      MCP_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_SCHEMA_VERSION,
    localProofOnly: true,
    invalidTokenChallengeImplementationPlanningVerified:
      input.invalidTokenChallengeImplementationPlanningVerified ?? true,
    fp0140BoundaryVerified: input.fp0140BoundaryVerified ?? true,
    fp0141Absent: input.fp0141Absent ?? true,
    resultEnvelopeDependencyVerified:
      input.resultEnvelopeDependencyVerified ?? true,
    missingTokenBehaviorStillSeparate:
      input.missingTokenBehaviorStillSeparate ?? true,
    protectedResourceMetadataBehaviorStillSeparate:
      input.protectedResourceMetadataBehaviorStillSeparate ?? true,
    failureModeToHttpPosturePlanningVerified:
      input.failureModeToHttpPosturePlanningVerified ?? true,
    symbolicWwwAuthenticateErrorPlanningVerified:
      input.symbolicWwwAuthenticateErrorPlanningVerified ?? true,
    noWwwAuthenticateHeaderRuntime:
      input.noWwwAuthenticateHeaderRuntime ?? true,
    noInvalidTokenChallengeRuntime:
      input.noInvalidTokenChallengeRuntime ?? true,
    noTokenParsingRuntime: input.noTokenParsingRuntime ?? true,
    noJwtDecodingRuntime: input.noJwtDecodingRuntime ?? true,
    noTokenValidationRuntime: input.noTokenValidationRuntime ?? true,
    noTokenIntrospectionRuntime: input.noTokenIntrospectionRuntime ?? true,
    noRouteConsumesSyntheticEvaluator:
      input.noRouteConsumesSyntheticEvaluator ?? true,
    noRealTokenExamples: input.noRealTokenExamples ?? true,
    noJwtLikeExamples: input.noJwtLikeExamples ?? true,
    noBearerTokenMaterial: input.noBearerTokenMaterial ?? true,
    noMcpRouteBehaviorChange: input.noMcpRouteBehaviorChange ?? true,
    noProtectedResourceMetadataRouteBehaviorChange:
      input.noProtectedResourceMetadataRouteBehaviorChange ?? true,
    noMissingTokenChallengeBehaviorChange:
      input.noMissingTokenChallengeBehaviorChange ?? true,
    noOauthImplementation: input.noOauthImplementation ?? true,
    noTokenSessionStorage: input.noTokenSessionStorage ?? true,
    noAuthMiddlewareImplementation:
      input.noAuthMiddlewareImplementation ?? true,
    noDbQueriesAdded: input.noDbQueriesAdded ?? true,
    noSchemaMigrationsAdded: input.noSchemaMigrationsAdded ?? true,
    noPackageScriptsAdded: input.noPackageScriptsAdded ?? true,
    noOpenAiApiCalls: input.noOpenAiApiCalls ?? true,
    noProviderExternalCalls: input.noProviderExternalCalls ?? true,
    noSourceMutationFinanceWrite:
      input.noSourceMutationFinanceWrite ?? true,
    fp0139ResultEnvelopeBoundaryStillVerified:
      input.fp0139ResultEnvelopeBoundaryStillVerified ?? true,
    fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified:
      input.fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified ??
      true,
    fp0137InvalidTokenChallengeReadinessBoundaryStillVerified:
      input.fp0137InvalidTokenChallengeReadinessBoundaryStillVerified ?? true,
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified:
      input.fp0136InvalidTokenChallengeContractsBoundaryStillVerified ?? true,
    fp0135InvalidTokenChallengeSequencingBoundaryStillVerified:
      input.fp0135InvalidTokenChallengeSequencingBoundaryStillVerified ?? true,
    fp0134SyntheticEvaluatorBoundaryStillVerified:
      input.fp0134SyntheticEvaluatorBoundaryStillVerified ?? true,
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified:
      input.fp0132TokenValidationRuntimeContractsBoundaryStillVerified ?? true,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      input.fp0130MissingTokenChallengeBoundaryStillVerified ?? true,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
      input.fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified ??
      true,
    fp0107RouteAdapterBoundaryStillVerified:
      input.fp0107RouteAdapterBoundaryStillVerified ?? true,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      input.fp0106ProtocolEnvelopeBoundaryStillVerified ?? true,
    fp0100PublicSecurityBoundaryStillVerified:
      input.fp0100PublicSecurityBoundaryStillVerified ?? true,
  });
}

export function verifyFp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanning(
  input: Fp0140BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0140Hits = fpPlanHits(
    repoPaths,
    MCP_INVALID_TOKEN_CHALLENGE_FP0140_PLAN_PREFIX,
  );
  if (fp0140Hits.length === 0) return true;

  return (
    fp0140Hits.length === 1 &&
    fp0140Hits[0] ===
      FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH &&
    (typeof planText !== "string" || fp0140PlanTextBoundaryVerified(planText))
  );
}

export function verifyFp0140InvalidTokenChallengeImplementationPlanningBoundary(
  input: Fp0140BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0140Hits = fpPlanHits(
    repoPaths,
    MCP_INVALID_TOKEN_CHALLENGE_FP0140_PLAN_PREFIX,
  );
  return (
    fp0140Hits.length === 1 &&
    fp0140Hits[0] ===
      FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH &&
    typeof planText === "string" &&
    fp0140PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0141Absent(repoPaths: readonly string[]) {
  return (
    fpPlanHits(repoPaths, MCP_INVALID_TOKEN_CHALLENGE_FP0141_PLAN_PREFIX)
      .length === 0
  );
}

export function verifyFp0140PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    docsAndProofGateOnly:
      normalized.includes("docs-and-plan plus proof-gate compatibility only") &&
      normalized.includes("does not implement invalid-token challenge behavior") &&
      normalized.includes("does not emit www-authenticate headers"),
    resultEnvelopeDependency:
      normalized.includes("consume fp-0139 result envelopes only") &&
      normalized.includes("fp-0134 synthetic evaluator output remains proof/test-only"),
    routePosturesSeparate:
      normalized.includes("missing-token behavior remains separate and unchanged") &&
      normalized.includes(
        "protected-resource metadata route behavior remains separate and unchanged",
      ) &&
      normalized.includes("`/mcp` route behavior remains unchanged"),
    failureModeHttpPosture:
      normalized.includes("malformed_authorization") &&
      normalized.includes("400") &&
      normalized.includes("invalid_token") &&
      normalized.includes("expired_token") &&
      normalized.includes("revoked_token") &&
      normalized.includes("401") &&
      normalized.includes("insufficient_scope") &&
      normalized.includes("403"),
    symbolicChallengeOnly:
      TOKEN_VALIDATION_WWW_AUTHENTICATE_ERROR_SYMBOLS.every((symbol) =>
        normalized.includes(symbol),
      ) && normalized.includes("symbolic only"),
    failClosedNonLeaking:
      normalized.includes("wrong_audience") &&
      normalized.includes("wrong_resource") &&
      normalized.includes("wrong_org") &&
      normalized.includes("company_binding_mismatch") &&
      normalized.includes("fail-closed and non-leaking"),
    noRuntimeScope:
      normalized.includes("no token parser") &&
      normalized.includes("no jwt decoder") &&
      normalized.includes("no token validation runtime") &&
      normalized.includes("no token introspection") &&
      normalized.includes("no oauth") &&
      normalized.includes("no auth middleware"),
    noTokenMaterial:
      normalized.includes("no real token examples") &&
      normalized.includes("no jwt-like examples") &&
      normalized.includes("no bearer token material") &&
      normalized.includes("no-token-echo"),
    fp0141Absent: normalized.includes("fp-0141 remains absent"),
    nextGate:
      normalized.includes("fp-0141 may open only after fp-0140 is merged") &&
      normalized.includes("public chatgpt app submission should wait"),
  };
}

export function verifyFp0140FailureModeToHttpPosturePlanning() {
  return (
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("malformed_authorization") &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("invalid_token") &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("expired_token") &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("revoked_token") &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("insufficient_scope") &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("wrong_audience") &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("wrong_resource") &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("wrong_org") &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.includes("company_binding_mismatch")
  );
}

export function verifyFp0140SymbolicWwwAuthenticateErrorPlanning() {
  return (
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

function fp0140PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return (
    [
      "docs-and-plan plus proof-gate compatibility only",
      "does not implement invalid-token challenge behavior",
      "does not emit www-authenticate headers",
      "does not change /mcp route behavior",
      "does not change protected-resource metadata route behavior",
      "does not change missing-token behavior",
      "does not implement token validation runtime",
      "does not parse tokens",
      "does not decode jwts",
      "does not introspect tokens",
      "does not implement oauth",
      "does not add token/session storage",
      "does not add auth middleware",
      "does not consume synthetic evaluator output from routes",
      "consume fp-0139 result envelopes only",
      "fp-0141 remains absent",
    ].every((requiredText) => normalized.includes(requiredText)) &&
    Object.values(verifyFp0140PlanningTextRequiredTopics(planText)).every(
      Boolean,
    )
  );
}

function normalizeBoundaryInput(input: Fp0140BoundaryInput) {
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
