import { z } from "zod";

const trueLiteral = z.literal(true);

export const MCP_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_SCHEMA_VERSION =
  "v2be.read-only-app-mcp-invalid-token-challenge-implementation-readiness.v1";

export const FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH =
  "plans/FP-0137-read-only-chatgpt-app-mcp-invalid-token-challenge-implementation-readiness-master-plan.md";

export const MCP_INVALID_TOKEN_CHALLENGE_FP0138_PLAN_PREFIX = "FP-0138";

type Fp0137BoundaryInput =
  | readonly string[]
  | {
      planText?: string;
      repoPaths: readonly string[];
    };

export const McpInvalidTokenChallengeImplementationReadinessProofSchema = z
  .object({
    schemaVersion: z.literal(
      MCP_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_SCHEMA_VERSION,
    ),
    docsAndPlanOnly: trueLiteral,
    localProofOnly: trueLiteral,
    fp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlanVerified:
      trueLiteral,
    fp0138Absent: trueLiteral,
    invalidTokenChallengeImplementationReadinessPlanBoundaryVerified:
      trueLiteral,
    noMcpRouteBehaviorChangeFromFp0137: trueLiteral,
    noProtectedResourceMetadataRouteBehaviorChangeFromFp0137: trueLiteral,
    noMissingTokenChallengeBehaviorChangeFromFp0137: trueLiteral,
    noInvalidTokenChallengeRuntimeFromFp0137: trueLiteral,
    noTokenParsingRuntimeFromFp0137: trueLiteral,
    noTokenValidationRuntimeFromFp0137: trueLiteral,
    noJwtDecodingRuntimeFromFp0137: trueLiteral,
    noTokenIntrospectionRuntimeFromFp0137: trueLiteral,
    noRouteConsumesTestDoubleFromFp0137: trueLiteral,
    noOauthImplementationFromFp0137: trueLiteral,
    noTokenSessionStorageFromFp0137: trueLiteral,
    noAuthMiddlewareImplementationFromFp0137: trueLiteral,
    noRealTokenExamplesFromFp0137: trueLiteral,
    noJwtLikeExamplesFromFp0137: trueLiteral,
    noBearerTokenMaterialFromFp0137: trueLiteral,
    noDbQueriesFromFp0137: trueLiteral,
    noSchemaMigrationsFromFp0137: trueLiteral,
    noPackageScriptsFromFp0137: trueLiteral,
    noOpenAiApiCallsFromFp0137: trueLiteral,
    noProviderExternalCallsFromFp0137: trueLiteral,
    noSourceMutationFinanceWriteFromFp0137: trueLiteral,
    planningBlocksInvalidTokenRouteBehaviorUntilRuntimeValidationResultEnvelopesExist:
      trueLiteral,
    tokenValidationRuntimeImplementationPlanningRecommendedNext: trueLiteral,
    invalidTokenChallengeImplementationBlockedUntilLaterPlan: trueLiteral,
    publicChatGptAppSubmissionFutureOnly: trueLiteral,
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified: trueLiteral,
    fp0135InvalidTokenChallengeSequencingBoundaryStillVerified: trueLiteral,
    fp0134SyntheticTestDoubleEvaluatorBoundaryStillVerified: trueLiteral,
    fp0133TokenValidationTestDoubleContractsBoundaryStillVerified: trueLiteral,
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified: trueLiteral,
    fp0131TokenValidationRuntimeSequencingBoundaryStillVerified: trueLiteral,
    fp0130MissingTokenChallengeBoundaryStillVerified: trueLiteral,
    fp0128TokenValidationReadinessBoundaryStillVerified: trueLiteral,
    fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified: trueLiteral,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
      trueLiteral,
    fp0107RouteAdapterBoundaryStillVerified: trueLiteral,
    fp0106ProtocolEnvelopeBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
  })
  .strict();

export type McpInvalidTokenChallengeImplementationReadinessProof = z.infer<
  typeof McpInvalidTokenChallengeImplementationReadinessProofSchema
>;

export type McpInvalidTokenChallengeImplementationReadinessProofInput =
  Partial<
    Omit<
      McpInvalidTokenChallengeImplementationReadinessProof,
      "schemaVersion" | "docsAndPlanOnly" | "localProofOnly"
    >
  >;

export function buildMcpInvalidTokenChallengeImplementationReadinessProof(
  input: McpInvalidTokenChallengeImplementationReadinessProofInput = {},
): McpInvalidTokenChallengeImplementationReadinessProof {
  return McpInvalidTokenChallengeImplementationReadinessProofSchema.parse({
    schemaVersion:
      MCP_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_SCHEMA_VERSION,
    docsAndPlanOnly: true,
    localProofOnly: true,
    fp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlanVerified:
      input.fp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlanVerified ??
      true,
    fp0138Absent: input.fp0138Absent ?? true,
    invalidTokenChallengeImplementationReadinessPlanBoundaryVerified:
      input.invalidTokenChallengeImplementationReadinessPlanBoundaryVerified ??
      true,
    noMcpRouteBehaviorChangeFromFp0137:
      input.noMcpRouteBehaviorChangeFromFp0137 ?? true,
    noProtectedResourceMetadataRouteBehaviorChangeFromFp0137:
      input.noProtectedResourceMetadataRouteBehaviorChangeFromFp0137 ?? true,
    noMissingTokenChallengeBehaviorChangeFromFp0137:
      input.noMissingTokenChallengeBehaviorChangeFromFp0137 ?? true,
    noInvalidTokenChallengeRuntimeFromFp0137:
      input.noInvalidTokenChallengeRuntimeFromFp0137 ?? true,
    noTokenParsingRuntimeFromFp0137:
      input.noTokenParsingRuntimeFromFp0137 ?? true,
    noTokenValidationRuntimeFromFp0137:
      input.noTokenValidationRuntimeFromFp0137 ?? true,
    noJwtDecodingRuntimeFromFp0137:
      input.noJwtDecodingRuntimeFromFp0137 ?? true,
    noTokenIntrospectionRuntimeFromFp0137:
      input.noTokenIntrospectionRuntimeFromFp0137 ?? true,
    noRouteConsumesTestDoubleFromFp0137:
      input.noRouteConsumesTestDoubleFromFp0137 ?? true,
    noOauthImplementationFromFp0137:
      input.noOauthImplementationFromFp0137 ?? true,
    noTokenSessionStorageFromFp0137:
      input.noTokenSessionStorageFromFp0137 ?? true,
    noAuthMiddlewareImplementationFromFp0137:
      input.noAuthMiddlewareImplementationFromFp0137 ?? true,
    noRealTokenExamplesFromFp0137:
      input.noRealTokenExamplesFromFp0137 ?? true,
    noJwtLikeExamplesFromFp0137:
      input.noJwtLikeExamplesFromFp0137 ?? true,
    noBearerTokenMaterialFromFp0137:
      input.noBearerTokenMaterialFromFp0137 ?? true,
    noDbQueriesFromFp0137: input.noDbQueriesFromFp0137 ?? true,
    noSchemaMigrationsFromFp0137:
      input.noSchemaMigrationsFromFp0137 ?? true,
    noPackageScriptsFromFp0137:
      input.noPackageScriptsFromFp0137 ?? true,
    noOpenAiApiCallsFromFp0137:
      input.noOpenAiApiCallsFromFp0137 ?? true,
    noProviderExternalCallsFromFp0137:
      input.noProviderExternalCallsFromFp0137 ?? true,
    noSourceMutationFinanceWriteFromFp0137:
      input.noSourceMutationFinanceWriteFromFp0137 ?? true,
    planningBlocksInvalidTokenRouteBehaviorUntilRuntimeValidationResultEnvelopesExist:
      input.planningBlocksInvalidTokenRouteBehaviorUntilRuntimeValidationResultEnvelopesExist ??
      true,
    tokenValidationRuntimeImplementationPlanningRecommendedNext:
      input.tokenValidationRuntimeImplementationPlanningRecommendedNext ?? true,
    invalidTokenChallengeImplementationBlockedUntilLaterPlan:
      input.invalidTokenChallengeImplementationBlockedUntilLaterPlan ?? true,
    publicChatGptAppSubmissionFutureOnly:
      input.publicChatGptAppSubmissionFutureOnly ?? true,
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified:
      input.fp0136InvalidTokenChallengeContractsBoundaryStillVerified ?? true,
    fp0135InvalidTokenChallengeSequencingBoundaryStillVerified:
      input.fp0135InvalidTokenChallengeSequencingBoundaryStillVerified ?? true,
    fp0134SyntheticTestDoubleEvaluatorBoundaryStillVerified:
      input.fp0134SyntheticTestDoubleEvaluatorBoundaryStillVerified ?? true,
    fp0133TokenValidationTestDoubleContractsBoundaryStillVerified:
      input.fp0133TokenValidationTestDoubleContractsBoundaryStillVerified ??
      true,
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified:
      input.fp0132TokenValidationRuntimeContractsBoundaryStillVerified ?? true,
    fp0131TokenValidationRuntimeSequencingBoundaryStillVerified:
      input.fp0131TokenValidationRuntimeSequencingBoundaryStillVerified ?? true,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      input.fp0130MissingTokenChallengeBoundaryStillVerified ?? true,
    fp0128TokenValidationReadinessBoundaryStillVerified:
      input.fp0128TokenValidationReadinessBoundaryStillVerified ?? true,
    fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified:
      input.fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified ?? true,
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

export function verifyFp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlan(
  input: Fp0137BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0137Hits = fpPlanHits(repoPaths, "FP-0137");
  if (fp0137Hits.length === 0) return true;

  return (
    fp0137Hits.length === 1 &&
    fp0137Hits[0] ===
      FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH &&
    (typeof planText !== "string" || fp0137PlanTextBoundaryVerified(planText))
  );
}

export function verifyFp0137InvalidTokenChallengeImplementationReadinessPlanBoundary(
  input: Fp0137BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0137Hits = fpPlanHits(repoPaths, "FP-0137");
  return (
    fp0137Hits.length === 1 &&
    fp0137Hits[0] ===
      FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH &&
    typeof planText === "string" &&
    fp0137PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0138Absent(repoPaths: readonly string[]) {
  return fpPlanHits(repoPaths, MCP_INVALID_TOKEN_CHALLENGE_FP0138_PLAN_PREFIX)
    .length === 0;
}

export function verifyFp0137PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    blocksRouteBehaviorUntilRuntimeValidationResultEnvelopes:
      normalized.includes("invalid-token route behavior cannot start") &&
      normalized.includes("runtime validation result envelopes"),
    docsAndProofGateOnly:
      normalized.includes("docs-and-plan plus proof-gate compatibility") &&
      normalized.includes("does not implement invalid-token") &&
      normalized.includes("does not add invalid-token challenge headers"),
    futureProofTools:
      normalized.includes("future proof tools must exist") &&
      normalized.includes("token-validation runtime proof") &&
      normalized.includes("invalid-token challenge route proof"),
    httpAndJsonRpcSeparation:
      normalized.includes("http challenge headers") &&
      normalized.includes("json-rpc refusal envelopes remain separate"),
    noRouteMetadataMissingTokenChange:
      normalized.includes("protected-resource metadata route behavior") &&
      normalized.includes("missing-token challenge behavior") &&
      normalized.includes("`/mcp`"),
    noRuntimeAuthTokenScope:
      normalized.includes("no token parser") &&
      normalized.includes("no jwt decoder") &&
      normalized.includes("no token validation runtime") &&
      normalized.includes("no token introspection") &&
      normalized.includes("no oauth") &&
      normalized.includes("no auth middleware"),
    noTokenMaterialExamples:
      normalized.includes("no real token examples") &&
      normalized.includes("no jwt-like examples") &&
      normalized.includes("no bearer token material"),
    statusMappingRuntimeInputs:
      normalized.includes("401/403/400 mapping") &&
      normalized.includes("typed validation result envelope"),
    testDoubleNotRouteInput:
      normalized.includes("synthetic evaluator and test doubles") &&
      normalized.includes("may not be consumed by route behavior"),
    nextRecommendation:
      normalized.includes(
        "recommended next plan should be token-validation runtime implementation planning",
      ) && normalized.includes("fp-0138 remains absent"),
  };
}

function fp0137PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return (
    [
      "docs-and-plan plus proof-gate compatibility master plan",
      "readiness only",
      "does not implement invalid-token www-authenticate route behavior",
      "does not add invalid-token challenge headers",
      "does not change `/mcp`",
      "does not change protected-resource metadata route behavior",
      "does not change missing-token behavior",
      "does not implement token validation runtime",
      "does not parse tokens",
      "does not decode jwts",
      "does not introspect tokens",
      "does not add oauth",
      "does not add token/session storage",
      "does not add auth middleware",
      "does not consume synthetic test doubles from routes",
      "does not create fp-0138",
    ].every((requiredText) => normalized.includes(requiredText)) &&
    Object.values(verifyFp0137PlanningTextRequiredTopics(planText)).every(
      Boolean,
    )
  );
}

function normalizeBoundaryInput(input: Fp0137BoundaryInput) {
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
