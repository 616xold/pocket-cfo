import { z } from "zod";

const trueLiteral = z.literal(true);

export const MCP_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_READINESS_SCHEMA_VERSION =
  "v2bf.read-only-app-mcp-token-validation-runtime-implementation-readiness.v1";

export const FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH =
  "plans/FP-0138-read-only-chatgpt-app-mcp-token-validation-runtime-implementation-planning.md";

export const MCP_TOKEN_VALIDATION_RUNTIME_FP0138_PLAN_PREFIX = "FP-0138";
export const MCP_TOKEN_VALIDATION_RUNTIME_FP0139_PLAN_PREFIX = "FP-0139";

type Fp0138BoundaryInput =
  | readonly string[]
  | {
      planText?: string;
      repoPaths: readonly string[];
    };

export const McpTokenValidationRuntimeImplementationReadinessProofSchema = z
  .object({
    schemaVersion: z.literal(
      MCP_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_READINESS_SCHEMA_VERSION,
    ),
    docsAndPlanOnly: trueLiteral,
    localProofOnly: trueLiteral,
    fp0138AbsentOrDocsOnlyTokenValidationRuntimeImplementationPlanningVerified:
      trueLiteral,
    fp0139AbsentOrLocalProofModeTokenValidationResultEnvelopeVerified:
      trueLiteral,
    fp0140Absent: trueLiteral,
    tokenValidationRuntimeImplementationPlanningBoundaryVerified: trueLiteral,
    noMcpRouteBehaviorChangeFromFp0138: trueLiteral,
    noProtectedResourceMetadataRouteBehaviorChangeFromFp0138: trueLiteral,
    noMissingTokenChallengeBehaviorChangeFromFp0138: trueLiteral,
    noInvalidTokenChallengeRuntimeFromFp0138: trueLiteral,
    noTokenParsingRuntimeFromFp0138: trueLiteral,
    noTokenValidationRuntimeFromFp0138: trueLiteral,
    noJwtDecodingRuntimeFromFp0138: trueLiteral,
    noTokenIntrospectionRuntimeFromFp0138: trueLiteral,
    noRouteConsumesTestDoubleFromFp0138: trueLiteral,
    noOauthImplementationFromFp0138: trueLiteral,
    noTokenSessionStorageFromFp0138: trueLiteral,
    noAuthMiddlewareImplementationFromFp0138: trueLiteral,
    noRealTokenExamplesFromFp0138: trueLiteral,
    noJwtLikeExamplesFromFp0138: trueLiteral,
    noBearerTokenMaterialFromFp0138: trueLiteral,
    noDbQueriesFromFp0138: trueLiteral,
    noSchemaMigrationsFromFp0138: trueLiteral,
    noPackageScriptsFromFp0138: trueLiteral,
    noOpenAiApiCallsFromFp0138: trueLiteral,
    noProviderExternalCallsFromFp0138: trueLiteral,
    noSourceMutationFinanceWriteFromFp0138: trueLiteral,
    localProofModeValidationResultEnvelopePlanningAllowed: trueLiteral,
    productionTokenValidationRuntimeBlockedUntilProviderTrustGates: trueLiteral,
    tokenParsingBlockedUntilNoLeakNoEchoContracts: trueLiteral,
    jwtDecodingBlockedUntilIssuerJwksProviderTrust: trueLiteral,
    tokenIntrospectionBlockedUntilProviderAuthServerSelection: trueLiteral,
    syntheticTestDoubleRouteConsumptionBlocked: trueLiteral,
    invalidTokenChallengeBehaviorBlockedUntilValidationResultEnvelopes:
      trueLiteral,
    validationResultEnvelopeFieldsSpecified: trueLiteral,
    futureFp0139LocalProofEnvelopeRecommended: trueLiteral,
    publicChatGptAppSubmissionFutureOnly: trueLiteral,
    fp0137InvalidTokenChallengeImplementationReadinessBoundaryStillVerified:
      trueLiteral,
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified: trueLiteral,
    fp0135InvalidTokenChallengeSequencingBoundaryStillVerified: trueLiteral,
    fp0134SyntheticTestDoubleEvaluatorBoundaryStillVerified: trueLiteral,
    fp0133TokenValidationTestDoubleContractsBoundaryStillVerified: trueLiteral,
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified: trueLiteral,
    fp0131TokenValidationRuntimeSequencingBoundaryStillVerified: trueLiteral,
    fp0130MissingTokenChallengeBoundaryStillVerified: trueLiteral,
    fp0128TokenValidationReadinessBoundaryStillVerified: trueLiteral,
    fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified: trueLiteral,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified: trueLiteral,
    fp0107RouteAdapterBoundaryStillVerified: trueLiteral,
    fp0106ProtocolEnvelopeBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
  })
  .strict();

export type McpTokenValidationRuntimeImplementationReadinessProof = z.infer<
  typeof McpTokenValidationRuntimeImplementationReadinessProofSchema
>;

export type McpTokenValidationRuntimeImplementationReadinessProofInput =
  Partial<
    Omit<
      McpTokenValidationRuntimeImplementationReadinessProof,
      "schemaVersion" | "docsAndPlanOnly" | "localProofOnly"
    >
  >;

export function buildMcpTokenValidationRuntimeImplementationReadinessProof(
  input: McpTokenValidationRuntimeImplementationReadinessProofInput = {},
): McpTokenValidationRuntimeImplementationReadinessProof {
  return McpTokenValidationRuntimeImplementationReadinessProofSchema.parse({
    schemaVersion:
      MCP_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_READINESS_SCHEMA_VERSION,
    docsAndPlanOnly: true,
    localProofOnly: true,
    fp0138AbsentOrDocsOnlyTokenValidationRuntimeImplementationPlanningVerified:
      input.fp0138AbsentOrDocsOnlyTokenValidationRuntimeImplementationPlanningVerified ??
      true,
    fp0139AbsentOrLocalProofModeTokenValidationResultEnvelopeVerified:
      input.fp0139AbsentOrLocalProofModeTokenValidationResultEnvelopeVerified ??
      true,
    fp0140Absent: input.fp0140Absent ?? true,
    tokenValidationRuntimeImplementationPlanningBoundaryVerified:
      input.tokenValidationRuntimeImplementationPlanningBoundaryVerified ??
      true,
    noMcpRouteBehaviorChangeFromFp0138:
      input.noMcpRouteBehaviorChangeFromFp0138 ?? true,
    noProtectedResourceMetadataRouteBehaviorChangeFromFp0138:
      input.noProtectedResourceMetadataRouteBehaviorChangeFromFp0138 ?? true,
    noMissingTokenChallengeBehaviorChangeFromFp0138:
      input.noMissingTokenChallengeBehaviorChangeFromFp0138 ?? true,
    noInvalidTokenChallengeRuntimeFromFp0138:
      input.noInvalidTokenChallengeRuntimeFromFp0138 ?? true,
    noTokenParsingRuntimeFromFp0138:
      input.noTokenParsingRuntimeFromFp0138 ?? true,
    noTokenValidationRuntimeFromFp0138:
      input.noTokenValidationRuntimeFromFp0138 ?? true,
    noJwtDecodingRuntimeFromFp0138:
      input.noJwtDecodingRuntimeFromFp0138 ?? true,
    noTokenIntrospectionRuntimeFromFp0138:
      input.noTokenIntrospectionRuntimeFromFp0138 ?? true,
    noRouteConsumesTestDoubleFromFp0138:
      input.noRouteConsumesTestDoubleFromFp0138 ?? true,
    noOauthImplementationFromFp0138:
      input.noOauthImplementationFromFp0138 ?? true,
    noTokenSessionStorageFromFp0138:
      input.noTokenSessionStorageFromFp0138 ?? true,
    noAuthMiddlewareImplementationFromFp0138:
      input.noAuthMiddlewareImplementationFromFp0138 ?? true,
    noRealTokenExamplesFromFp0138: input.noRealTokenExamplesFromFp0138 ?? true,
    noJwtLikeExamplesFromFp0138: input.noJwtLikeExamplesFromFp0138 ?? true,
    noBearerTokenMaterialFromFp0138:
      input.noBearerTokenMaterialFromFp0138 ?? true,
    noDbQueriesFromFp0138: input.noDbQueriesFromFp0138 ?? true,
    noSchemaMigrationsFromFp0138: input.noSchemaMigrationsFromFp0138 ?? true,
    noPackageScriptsFromFp0138: input.noPackageScriptsFromFp0138 ?? true,
    noOpenAiApiCallsFromFp0138: input.noOpenAiApiCallsFromFp0138 ?? true,
    noProviderExternalCallsFromFp0138:
      input.noProviderExternalCallsFromFp0138 ?? true,
    noSourceMutationFinanceWriteFromFp0138:
      input.noSourceMutationFinanceWriteFromFp0138 ?? true,
    localProofModeValidationResultEnvelopePlanningAllowed:
      input.localProofModeValidationResultEnvelopePlanningAllowed ?? true,
    productionTokenValidationRuntimeBlockedUntilProviderTrustGates:
      input.productionTokenValidationRuntimeBlockedUntilProviderTrustGates ??
      true,
    tokenParsingBlockedUntilNoLeakNoEchoContracts:
      input.tokenParsingBlockedUntilNoLeakNoEchoContracts ?? true,
    jwtDecodingBlockedUntilIssuerJwksProviderTrust:
      input.jwtDecodingBlockedUntilIssuerJwksProviderTrust ?? true,
    tokenIntrospectionBlockedUntilProviderAuthServerSelection:
      input.tokenIntrospectionBlockedUntilProviderAuthServerSelection ?? true,
    syntheticTestDoubleRouteConsumptionBlocked:
      input.syntheticTestDoubleRouteConsumptionBlocked ?? true,
    invalidTokenChallengeBehaviorBlockedUntilValidationResultEnvelopes:
      input.invalidTokenChallengeBehaviorBlockedUntilValidationResultEnvelopes ??
      true,
    validationResultEnvelopeFieldsSpecified:
      input.validationResultEnvelopeFieldsSpecified ?? true,
    futureFp0139LocalProofEnvelopeRecommended:
      input.futureFp0139LocalProofEnvelopeRecommended ?? true,
    publicChatGptAppSubmissionFutureOnly:
      input.publicChatGptAppSubmissionFutureOnly ?? true,
    fp0137InvalidTokenChallengeImplementationReadinessBoundaryStillVerified:
      input.fp0137InvalidTokenChallengeImplementationReadinessBoundaryStillVerified ??
      true,
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

export function verifyFp0138AbsentOrDocsOnlyTokenValidationRuntimeImplementationPlanning(
  input: Fp0138BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0138Hits = fpPlanHits(
    repoPaths,
    MCP_TOKEN_VALIDATION_RUNTIME_FP0138_PLAN_PREFIX,
  );
  if (fp0138Hits.length === 0) return true;

  return (
    fp0138Hits.length === 1 &&
    fp0138Hits[0] ===
      FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH &&
    (typeof planText !== "string" || fp0138PlanTextBoundaryVerified(planText))
  );
}

export function verifyFp0138TokenValidationRuntimeImplementationPlanningBoundary(
  input: Fp0138BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0138Hits = fpPlanHits(
    repoPaths,
    MCP_TOKEN_VALIDATION_RUNTIME_FP0138_PLAN_PREFIX,
  );
  return (
    fp0138Hits.length === 1 &&
    fp0138Hits[0] ===
      FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH &&
    typeof planText === "string" &&
    fp0138PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0139Absent(repoPaths: readonly string[]) {
  return (
    fpPlanHits(repoPaths, MCP_TOKEN_VALIDATION_RUNTIME_FP0139_PLAN_PREFIX)
      .length === 0
  );
}

export function verifyFp0138PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    docsAndProofGateOnly:
      normalized.includes("docs-and-plan plus proof-gate compatibility") &&
      normalized.includes("does not implement token validation runtime") &&
      normalized.includes("does not parse tokens") &&
      normalized.includes("does not decode jwts") &&
      normalized.includes("does not introspect tokens"),
    canStartOnlyLocalProofModeEnvelopePlanning:
      normalized.includes(
        "token-validation runtime implementation can start",
      ) &&
      normalized.includes(
        "only as local proof-mode validation result envelope implementation planning",
      ),
    productionRuntimeBlocked:
      normalized.includes("real production token validation remains blocked") &&
      normalized.includes("issuer/audience/resource/scope") &&
      normalized.includes("user-org-company") &&
      normalized.includes("revocation/replay") &&
      normalized.includes("provider trust gates"),
    parserDecoderIntrospectionBlocked:
      normalized.includes(
        "token parsing remains blocked until parser no-leak/no-echo contracts exist",
      ) &&
      normalized.includes(
        "jwt decoding remains blocked until issuer/jwks/provider trust is proven",
      ) &&
      normalized.includes(
        "token introspection remains blocked until provider/auth-server selection is proven",
      ),
    testDoubleNotRouteInput:
      normalized.includes("synthetic test-double evaluator output") &&
      normalized.includes("may not be consumed by routes"),
    invalidTokenBlockedUntilEnvelope:
      normalized.includes("invalid-token route behavior remains blocked") &&
      normalized.includes("validation result envelopes exist"),
    requiredEnvelopeFields: [
      "accepted / rejected",
      "failure taxonomy",
      "httpstatus recommendation",
      "wwwauthenticateerror",
      "requiredscopes",
      "issuer / audience / resource validation posture",
      "subject / org / company binding posture",
      "revocation/replay posture",
      "no raw token / no token echo markers",
      "evidence-free security decision boundary",
    ].every((text) => normalized.includes(text)),
    noRuntimeAuthRouteScope:
      normalized.includes("no token parser") &&
      normalized.includes("no jwt decoder") &&
      normalized.includes("no token validation runtime") &&
      normalized.includes("no token introspection") &&
      normalized.includes("no oauth") &&
      (normalized.includes("no auth middleware") ||
        normalized.includes("does not add auth middleware")) &&
      normalized.includes("does not change `/mcp`") &&
      normalized.includes(
        "does not change protected-resource metadata route",
      ) &&
      normalized.includes("does not change missing-token"),
    futureFp0139Recommendation:
      normalized.includes(
        "future fp-0139 should be local proof-only validation result envelope implementation planning",
      ) && normalized.includes("fp-0139 remains absent"),
    publicSubmissionFutureOnly:
      normalized.includes("public chatgpt app submission") &&
      normalized.includes("future-only"),
  };
}

function fp0138PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return (
    [
      "docs-and-plan plus proof-gate compatibility master plan",
      "planning plus proof-gate compatibility only",
      "does not implement token validation runtime",
      "does not parse tokens",
      "does not decode jwts",
      "does not introspect tokens",
      "does not store, forward, log, echo, parse, decode, validate, introspect, or replay token material",
      "does not consume synthetic test doubles from any route",
      "does not implement invalid-token challenge behavior",
      "does not change `/mcp`",
      "does not change protected-resource metadata route behavior",
      "does not change missing-token challenge behavior",
      "does not add oauth",
      "does not add token/session storage",
      "does not add auth middleware",
      "does not create fp-0139",
    ].every((requiredText) => normalized.includes(requiredText)) &&
    Object.values(verifyFp0138PlanningTextRequiredTopics(planText)).every(
      Boolean,
    )
  );
}

function normalizeBoundaryInput(input: Fp0138BoundaryInput) {
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
