import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  FP0127_WWW_AUTHENTICATE_AUTH_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0128_TOKEN_VALIDATION_READINESS_CONTRACTS_PLAN_PATH,
  FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0131_TOKEN_VALIDATION_RUNTIME_SEQUENCING_PLAN_PATH,
  FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH,
  FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
  FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH,
  FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH,
  FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH,
  FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH,
  FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
  FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
  McpInvalidTokenChallengeImplementationPlanningProofSchema,
  buildMcpInvalidTokenChallengeImplementationPlanningProof,
  isMcpTokenValidationTestDoubleProofSourcePath,
  scanTokenValidationNoLeakage,
  verifyExactTokenValidationResultEnvelopeFailureTaxonomy,
  verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary,
  verifyFp0128TokenValidationReadinessContractsBoundary,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0131TokenValidationRuntimeSequencingPlanBoundary,
  verifyFp0132TokenValidationRuntimeContractsBoundary,
  verifyFp0133TokenValidationTestDoubleContractsBoundary,
  verifyFp0134TokenValidationTestDoubleImplementationBoundary,
  verifyFp0135InvalidTokenChallengeSequencingPlanBoundary,
  verifyFp0136InvalidTokenChallengeContractsBoundary,
  verifyFp0137InvalidTokenChallengeImplementationReadinessPlanBoundary,
  verifyFp0138TokenValidationRuntimeImplementationPlanningBoundary,
  verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary,
  verifyFp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanning,
  verifyFp0140FailureModeToHttpPosturePlanning,
  verifyFp0140InvalidTokenChallengeImplementationPlanningBoundary,
  verifyFp0140PlanningTextRequiredTopics,
  verifyFp0140SymbolicWwwAuthenticateErrorPlanning,
  verifyFp0141Absent,
  verifyFp0141AbsentOrLocalInvalidTokenChallengeRuntime,
  verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary,
  verifyFp0142Absent,
  verifyMcpInvalidTokenChallengeContractBoundaries,
  verifyMcpTokenValidationTestDoubleContractBoundaries,
  verifyMcpTokenValidationTestDoubleRepositoryInventory,
  verifyTokenValidationResultEnvelopeBoundaryFields,
  verifyTokenValidationResultEnvelopeHttpPostureMapping,
} from "../packages/domain/src/index.ts";

const FP0125_PLAN =
  "plans/FP-0125-read-only-chatgpt-app-mcp-protected-resource-metadata-local-route-implementation.md";
const FP0107_PLAN =
  "plans/FP-0107-read-only-chatgpt-app-mcp-local-fastify-mcp-route-adapter-foundation.md";
const FP0106_PLAN =
  "plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md";
const FP0100_PLAN =
  "plans/FP-0100-read-only-chatgpt-app-mcp-public-app-security-boundary-contracts-foundation.md";
const MCP_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const METADATA_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const MISSING_TOKEN_HELPER_PATH =
  "packages/domain/src/read-only-app-mcp-www-authenticate-missing-token-challenge.ts";

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const changedExecutableSource = readChangedExecutableSource(changedPaths);
const fp0140PlanText = safeRead(
  FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
);
const fp0141PlanText = safeRead(
  FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
);
const fp0139PlanText = safeRead(FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH);
const fp0140Topics = verifyFp0140PlanningTextRequiredTopics(fp0140PlanText);
const changedDocText = readChangedDocText(changedPaths);
const noLeakageScan = scanTokenValidationNoLeakage(
  [fp0140PlanText, changedDocText].join("\n"),
);
const sourceScope = verifySourceScope();
const fp0141RuntimeBridge = fp0141RuntimeBridgeVerified();
const priorBoundaries = verifyPriorBoundaries();
const repositoryInventory = verifyRepositoryInventory();
const resultEnvelopeBoundary =
  verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary({
    planText: fp0139PlanText,
    repoPaths,
  }) &&
  verifyExactTokenValidationResultEnvelopeFailureTaxonomy() &&
  verifyTokenValidationResultEnvelopeHttpPostureMapping() &&
  verifyTokenValidationResultEnvelopeBoundaryFields();

const proof = McpInvalidTokenChallengeImplementationPlanningProofSchema.parse(
  buildMcpInvalidTokenChallengeImplementationPlanningProof({
    failureModeToHttpPosturePlanningVerified:
      verifyFp0140FailureModeToHttpPosturePlanning() &&
      fp0140Topics.failureModeHttpPosture,
    fp0100PublicSecurityBoundaryStillVerified:
      priorBoundaries.fp0100PublicSecurityBoundaryStillVerified,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      priorBoundaries.fp0106ProtocolEnvelopeBoundaryStillVerified,
    fp0107RouteAdapterBoundaryStillVerified:
      priorBoundaries.fp0107RouteAdapterBoundaryStillVerified,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
      priorBoundaries.fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      priorBoundaries.fp0130MissingTokenChallengeBoundaryStillVerified,
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified:
      priorBoundaries.fp0132TokenValidationRuntimeContractsBoundaryStillVerified,
    fp0134SyntheticEvaluatorBoundaryStillVerified:
      priorBoundaries.fp0134SyntheticEvaluatorBoundaryStillVerified,
    fp0135InvalidTokenChallengeSequencingBoundaryStillVerified:
      priorBoundaries.fp0135InvalidTokenChallengeSequencingBoundaryStillVerified,
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified:
      priorBoundaries.fp0136InvalidTokenChallengeContractsBoundaryStillVerified,
    fp0137InvalidTokenChallengeReadinessBoundaryStillVerified:
      priorBoundaries.fp0137InvalidTokenChallengeReadinessBoundaryStillVerified,
    fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified:
      priorBoundaries.fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified,
    fp0139ResultEnvelopeBoundaryStillVerified: resultEnvelopeBoundary,
    fp0140BoundaryVerified:
      verifyFp0140InvalidTokenChallengeImplementationPlanningBoundary({
        planText: fp0140PlanText,
        repoPaths,
      }),
    fp0141Absent: verifyFp0141AbsentOrLocalInvalidTokenChallengeRuntime({
      planText: fp0141PlanText,
      repoPaths,
    }),
    invalidTokenChallengeImplementationPlanningVerified:
      Object.values(fp0140Topics).every(Boolean),
    missingTokenBehaviorStillSeparate:
      fp0140Topics.routePosturesSeparate &&
      (sourceScope.noMissingTokenChallengeBehaviorChange ||
        fp0141RuntimeBridge) &&
      priorBoundaries.fp0130MissingTokenChallengeBoundaryStillVerified,
    noAuthMiddlewareImplementation:
      sourceScope.noAuthMiddlewareImplementation &&
      repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
    noBearerTokenMaterial:
      noLeakageScan.accepted &&
      repositoryInventory.noBearerTokenMaterialRepositoryInventoryVerified,
    noDbQueriesAdded: sourceScope.noDbQueriesAdded,
    noInvalidTokenChallengeRuntime:
      (sourceScope.noInvalidTokenChallengeRuntime || fp0141RuntimeBridge) &&
      repositoryInventory.noInvalidTokenChallengeRuntimeRepositoryInventoryVerified,
    noJwtDecodingRuntime:
      sourceScope.noJwtDecodingRuntime &&
      repositoryInventory.noJwtDecodingRuntimeRepositoryInventoryVerified,
    noJwtLikeExamples:
      noLeakageScan.accepted &&
      repositoryInventory.noJwtLikeExampleRepositoryInventoryVerified,
    noMcpRouteBehaviorChange:
      (sourceScope.noMcpRouteBehaviorChange || fp0141RuntimeBridge) &&
      localMcpRouteShapeStillVerified(),
    noMissingTokenChallengeBehaviorChange:
      sourceScope.noMissingTokenChallengeBehaviorChange || fp0141RuntimeBridge,
    noOauthImplementation:
      sourceScope.noOauthImplementation &&
      repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
    noOpenAiApiCalls:
      sourceScope.noOpenAiApiCalls &&
      repositoryInventory.noOpenAiApiSourceScanVerified,
    noPackageScriptsAdded: sourceScope.noPackageScriptsAdded,
    noProtectedResourceMetadataRouteBehaviorChange:
      sourceScope.noProtectedResourceMetadataRouteBehaviorChange &&
      metadataRouteShapeStillVerified(),
    noProviderExternalCalls: sourceScope.noProviderExternalCalls,
    noRealTokenExamples:
      noLeakageScan.accepted &&
      repositoryInventory.noRealTokenExampleRepositoryInventoryVerified,
    noRouteConsumesSyntheticEvaluator:
      sourceScope.noRouteConsumesSyntheticEvaluator &&
      repositoryInventory.noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified &&
      !routeConsumesSyntheticEvaluator(),
    noSchemaMigrationsAdded: sourceScope.noSchemaMigrationsAdded,
    noSourceMutationFinanceWrite:
      sourceScope.noSourceMutation && sourceScope.noFinanceWrite,
    noTokenIntrospectionRuntime:
      sourceScope.noTokenIntrospectionRuntime &&
      repositoryInventory.noTokenIntrospectionRuntimeRepositoryInventoryVerified,
    noTokenParsingRuntime:
      sourceScope.noTokenParsingRuntime &&
      repositoryInventory.noTokenParsingRuntimeRepositoryInventoryVerified,
    noTokenSessionStorage:
      sourceScope.noTokenSessionStorage &&
      repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
    noTokenValidationRuntime:
      sourceScope.noTokenValidationRuntime &&
      repositoryInventory.noTokenValidationRuntimeRepositoryInventoryVerified,
    noWwwAuthenticateHeaderRuntime:
      sourceScope.noWwwAuthenticateHeaderRuntime || fp0141RuntimeBridge,
    protectedResourceMetadataBehaviorStillSeparate:
      fp0140Topics.routePosturesSeparate &&
      sourceScope.noProtectedResourceMetadataRouteBehaviorChange &&
      priorBoundaries.fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified,
    resultEnvelopeDependencyVerified:
      fp0140Topics.resultEnvelopeDependency && resultEnvelopeBoundary,
    symbolicWwwAuthenticateErrorPlanningVerified:
      verifyFp0140SymbolicWwwAuthenticateErrorPlanning() &&
      fp0140Topics.symbolicChallengeOnly,
  }),
);

const bridgeFields = {
  fp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanningVerified:
    verifyFp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanning({
      planText: fp0140PlanText,
      repoPaths,
    }),
  fp0141Absent: proof.fp0141Absent,
  fp0141AbsentOrLocalInvalidTokenChallengeRuntimeVerified:
    verifyFp0141AbsentOrLocalInvalidTokenChallengeRuntime({
      planText: fp0141PlanText,
      repoPaths,
    }),
  fp0141LocalInvalidTokenChallengeRuntimeBoundaryVerified:
    verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary({
      planText: fp0141PlanText,
      repoPaths,
    }),
  fp0142Absent: verifyFp0142Absent(repoPaths),
  invalidTokenChallengeImplementationPlanningBoundaryVerified:
    proof.fp0140BoundaryVerified,
  noInvalidTokenChallengeRuntimeFromFp0140:
    proof.noInvalidTokenChallengeRuntime,
  noWwwAuthenticateHeaderRuntimeFromFp0140:
    proof.noWwwAuthenticateHeaderRuntime,
  noMcpRouteBehaviorChangeFromFp0140: proof.noMcpRouteBehaviorChange,
  noProtectedResourceMetadataRouteBehaviorChangeFromFp0140:
    proof.noProtectedResourceMetadataRouteBehaviorChange,
  noMissingTokenChallengeBehaviorChangeFromFp0140:
    proof.noMissingTokenChallengeBehaviorChange,
  noTokenParsingRuntimeFromFp0140: proof.noTokenParsingRuntime,
  noJwtDecodingRuntimeFromFp0140: proof.noJwtDecodingRuntime,
  noTokenValidationRuntimeFromFp0140: proof.noTokenValidationRuntime,
  noTokenIntrospectionRuntimeFromFp0140: proof.noTokenIntrospectionRuntime,
  noRouteConsumesSyntheticEvaluatorFromFp0140:
    proof.noRouteConsumesSyntheticEvaluator,
  noOauthImplementationFromFp0140: proof.noOauthImplementation,
  noTokenSessionStorageFromFp0140: proof.noTokenSessionStorage,
  noAuthMiddlewareImplementationFromFp0140:
    proof.noAuthMiddlewareImplementation,
  noRealTokenExamplesFromFp0140: proof.noRealTokenExamples,
  noJwtLikeExamplesFromFp0140: proof.noJwtLikeExamples,
  noBearerTokenMaterialFromFp0140: proof.noBearerTokenMaterial,
  noDbQueriesFromFp0140: proof.noDbQueriesAdded,
  noSchemaMigrationsFromFp0140: proof.noSchemaMigrationsAdded,
  noPackageScriptsFromFp0140: proof.noPackageScriptsAdded,
  noOpenAiApiCallsFromFp0140: proof.noOpenAiApiCalls,
  noProviderExternalCallsFromFp0140: proof.noProviderExternalCalls,
  noSourceMutationFinanceWriteFromFp0140:
    proof.noSourceMutationFinanceWrite,
  fp0139TokenValidationResultEnvelopeBoundaryStillVerified:
    proof.fp0139ResultEnvelopeBoundaryStillVerified,
  fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified:
    proof.fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified,
  fp0137InvalidTokenChallengeReadinessBoundaryStillVerified:
    proof.fp0137InvalidTokenChallengeReadinessBoundaryStillVerified,
  fp0136InvalidTokenChallengeContractsBoundaryStillVerified:
    proof.fp0136InvalidTokenChallengeContractsBoundaryStillVerified,
  fp0135InvalidTokenChallengeSequencingBoundaryStillVerified:
    proof.fp0135InvalidTokenChallengeSequencingBoundaryStillVerified,
  fp0134SyntheticTestDoubleEvaluatorBoundaryStillVerified:
    proof.fp0134SyntheticEvaluatorBoundaryStillVerified,
  fp0133TokenValidationTestDoubleContractsBoundaryStillVerified:
    priorBoundaries.fp0133TokenValidationTestDoubleContractsBoundaryStillVerified,
  fp0132TokenValidationRuntimeContractsBoundaryStillVerified:
    proof.fp0132TokenValidationRuntimeContractsBoundaryStillVerified,
  fp0131TokenValidationRuntimeSequencingBoundaryStillVerified:
    priorBoundaries.fp0131TokenValidationRuntimeSequencingBoundaryStillVerified,
  fp0130MissingTokenChallengeBoundaryStillVerified:
    proof.fp0130MissingTokenChallengeBoundaryStillVerified,
  fp0128TokenValidationReadinessBoundaryStillVerified:
    priorBoundaries.fp0128TokenValidationReadinessBoundaryStillVerified,
  fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified:
    priorBoundaries.fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified,
  fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
    proof.fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified,
  fp0107RouteAdapterBoundaryStillVerified:
    proof.fp0107RouteAdapterBoundaryStillVerified,
  fp0106ProtocolEnvelopeBoundaryStillVerified:
    proof.fp0106ProtocolEnvelopeBoundaryStillVerified,
  fp0100PublicSecurityBoundaryStillVerified:
    proof.fp0100PublicSecurityBoundaryStillVerified,
};

const output = {
  ...proof,
  ...bridgeFields,
  proofDetails: {
    changedPathScope,
    noLeakageScan,
    priorBoundaries,
    repositoryInventory,
    sourceScope,
    topics: fp0140Topics,
  },
};

for (const [key, value] of Object.entries(output)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0140 invalid-token challenge implementation planning proof failed: ${key}`,
    );
  }
}

console.log(JSON.stringify(output, null, 2));

function verifySourceScope() {
  const modelCallPattern = ["call", "Model"].join("");
  const modelCallRegex = new RegExp(
    `\\b(?:responses\\.create|chat\\.completions|model\\s*\\.\\s*create|models\\s*\\.\\s*create|${modelCallPattern})\\s*\\(`,
    "u",
  );

  return {
    noAuthMiddlewareImplementation:
      !/\b(?:authMiddleware|authorizationMiddleware|routeGuard|verifyBearer|requireAuth|authenticateRequest|setCookie)\s*\(/u.test(
        changedExecutableSource,
      ),
    noDbQueriesAdded:
      !changedPaths.some((path) => /^packages\/db\//u.test(path)) &&
      !/\b(?:from\s+["']drizzle|drizzle\s*\(|select\s*\(|insert\s*\(|update\s*\(|delete\s*\(|sql`)\b/u.test(
        changedExecutableSource,
      ),
    noFinanceWrite:
      !/\b(?:writeFinanceTwin|updateLedger|financeWrite|postLedger|createJournalEntry)\s*\(/u.test(
        changedExecutableSource,
      ),
    noInvalidTokenChallengeRuntime:
      !/\b(?:invalidTokenChallenge|malformedToken|expiredToken|wrongAudience|wrongResource|wrongScope|wrongOrg|wrongCompany|revokedToken|replayedToken)\s*\(/u.test(
        changedExecutableSource,
      ),
    noJwtDecodingRuntime:
      !/\b(?:parseJwt|decodeJwt|jwtDecode|jwtVerify|verifyJwt)\s*\(/u.test(
        changedExecutableSource,
      ),
    noMcpRouteBehaviorChange: !changedPaths.includes(MCP_ROUTE_PATH),
    noMissingTokenChallengeBehaviorChange:
      !changedPaths.includes(MCP_ROUTE_PATH) &&
      !changedPaths.includes(MISSING_TOKEN_HELPER_PATH),
    noModelCalls: !modelCallRegex.test(changedExecutableSource),
    noOauthImplementation:
      !/\b(?:oauthCallback|authorizeUrl|tokenExchange|authorizationCode|pkceVerifier)\s*\(/u.test(
        changedExecutableSource,
      ),
    noOpenAiApiCalls:
      !/\b(?:OpenAI|openai|responses\.create|chat\.completions|files\.create|api\.openai\.com)\s*\(/u.test(
        changedExecutableSource,
      ),
    noPackageScriptsAdded:
      !changedPaths.includes("package.json") &&
      !changedPaths.some((path) => /\/package\.json$/u.test(path)),
    noProtectedResourceMetadataRouteBehaviorChange:
      !changedPaths.includes(METADATA_ROUTE_PATH),
    noProviderExternalCalls:
      !/\b(?:providerConnect|callProvider|createProviderJob|deploy|sendEmail|sendReport|contactCustomer|externalMessage)\s*\(/u.test(
        changedExecutableSource,
      ),
    noRouteConsumesSyntheticEvaluator: true,
    noSchemaMigrationsAdded: !changedPaths.some(
      (path) =>
        /^packages\/db\//u.test(path) ||
        /(?:^|\/)migrations?\//iu.test(path) ||
        /\.sql$/iu.test(path),
    ),
    noSourceMutation:
      !/\b(?:uploadSource|mutateSource|rewriteSource|deleteSource)\s*\(/u.test(
        changedExecutableSource,
      ),
    noTokenIntrospectionRuntime: !/\bintrospectToken\s*\(/u.test(
      changedExecutableSource,
    ),
    noTokenParsingRuntime:
      !/\b(?:decodeToken|parseToken|parseJwt|decodeJwt|jwtDecode|introspectToken)\s*\(/u.test(
        changedExecutableSource,
      ),
    noTokenSessionStorage:
      !/\b(?:tokenStore|sessionStore|sessionHandler|refreshTokenStore|setCookie)\s*\(/u.test(
        changedExecutableSource,
      ),
    noTokenValidationRuntime:
      !/\b(?:validateToken|verifyToken|tokenValidator|jwtVerify|verifyJwt|validateBearer|verifyBearer)\s*\(/u.test(
        changedExecutableSource,
      ),
    noWwwAuthenticateHeaderRuntime:
      !changedPaths.includes(MCP_ROUTE_PATH) &&
      !changedPaths.includes(MISSING_TOKEN_HELPER_PATH) &&
      !/\b(?:wwwAuthenticateHeader|emitWwwAuthenticate|setWwwAuthenticate|challengeHeader)\s*\(/iu.test(
        changedExecutableSource,
      ),
  };
}

function fp0141RuntimeBridgeVerified() {
  return (
    verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary({
      planText: fp0141PlanText,
      repoPaths,
    }) &&
    verifyFp0142Absent(repoPaths) &&
    localMcpRouteShapeStillVerified() &&
    fp0141InvalidTokenRouteInjectionShapeVerified()
  );
}

function fp0141InvalidTokenRouteInjectionShapeVerified() {
  const source = safeRead(MCP_ROUTE_PATH);
  const missingTokenIndex = source.indexOf("if (missingTokenChallenge)");
  const invalidTokenIndex = source.indexOf("if (invalidTokenChallenge)");

  return (
    source.includes(
      "readOnlyAppMcpInvalidTokenChallengeResultEnvelope?: unknown",
    ) &&
    source.includes("buildReadOnlyAppMcpInvalidTokenChallengeResponse") &&
    missingTokenIndex >= 0 &&
    invalidTokenIndex > missingTokenIndex &&
    !source.includes("evaluateSyntheticTokenValidationScenario") &&
    !source.includes("buildTokenValidationResultEnvelope")
  );
}

function verifyPriorBoundaries() {
  return {
    fp0100PublicSecurityBoundaryStillVerified: docsBoundary(FP0100_PLAN, [
      "public-app security boundary",
      "local/proof-only",
      "no endpoints",
    ]),
    fp0106ProtocolEnvelopeBoundaryStillVerified: docsBoundary(FP0106_PLAN, [
      "mcp protocol envelope",
      "tools/call",
      "no openai api/model calls",
    ]),
    fp0107RouteAdapterBoundaryStillVerified:
      docsBoundary(FP0107_PLAN, ["local/control-plane", "post /mcp"]) &&
      localMcpRouteShapeStillVerified(),
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
      docsBoundary(FP0125_PLAN, [
        "local-only/read-only",
        "/.well-known/oauth-protected-resource/mcp",
      ]) && metadataRouteShapeStillVerified(),
    fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified:
      verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary({
        planText: safeRead(
          FP0127_WWW_AUTHENTICATE_AUTH_CHALLENGE_CONTRACTS_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0128TokenValidationReadinessBoundaryStillVerified:
      verifyFp0128TokenValidationReadinessContractsBoundary({
        planText: safeRead(
          FP0128_TOKEN_VALIDATION_READINESS_CONTRACTS_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0130MissingTokenChallengeBoundaryStillVerified:
      verifyFp0130LocalMissingTokenChallengeImplementationBoundary({
        planText: safeRead(
          FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0131TokenValidationRuntimeSequencingBoundaryStillVerified:
      verifyFp0131TokenValidationRuntimeSequencingPlanBoundary({
        planText: safeRead(
          FP0131_TOKEN_VALIDATION_RUNTIME_SEQUENCING_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified:
      verifyFp0132TokenValidationRuntimeContractsBoundary({
        planText: safeRead(FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH),
        repoPaths,
      }),
    fp0133TokenValidationTestDoubleContractsBoundaryStillVerified:
      verifyFp0133TokenValidationTestDoubleContractsBoundary({
        planText: safeRead(
          FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
        ),
        repoPaths,
      }) && verifyMcpTokenValidationTestDoubleContractBoundaries(),
    fp0134SyntheticEvaluatorBoundaryStillVerified:
      verifyFp0134TokenValidationTestDoubleImplementationBoundary({
        planText: safeRead(
          FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0135InvalidTokenChallengeSequencingBoundaryStillVerified:
      verifyFp0135InvalidTokenChallengeSequencingPlanBoundary({
        planText: safeRead(FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH),
        repoPaths,
      }),
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified:
      verifyFp0136InvalidTokenChallengeContractsBoundary({
        planText: safeRead(FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH),
        repoPaths,
      }) && verifyMcpInvalidTokenChallengeContractBoundaries(),
    fp0137InvalidTokenChallengeReadinessBoundaryStillVerified:
      verifyFp0137InvalidTokenChallengeImplementationReadinessPlanBoundary({
        planText: safeRead(
          FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified:
      verifyFp0138TokenValidationRuntimeImplementationPlanningBoundary({
        planText: safeRead(
          FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH,
        ),
        repoPaths,
      }),
  };
}

function verifyRepositoryInventory() {
  return verifyMcpTokenValidationTestDoubleRepositoryInventory({
    branchDiffPaths: changedPathScope.committedBranchDiffPaths,
    dirtyPaths: changedPathScope.dirtyQaTargetFiles,
    repoPaths,
    sourceTextByPath: readProofSourceTextByPath(repoPaths),
  });
}

function localMcpRouteShapeStillVerified() {
  const source = safeRead(MCP_ROUTE_PATH);
  return (
    countMatches(source, /app\.post\("\/mcp"/gu) === 1 &&
    countMatches(source, /app\.get\("\/mcp"/gu) === 1 &&
    !source.includes("evaluateSyntheticTokenValidationScenario") &&
    !source.includes("buildTokenValidationResultEnvelope")
  );
}

function metadataRouteShapeStillVerified() {
  const source = safeRead(METADATA_ROUTE_PATH);
  return (
    countMatches(source, /app\.get\(/gu) === 1 &&
    (source.includes("/.well-known/oauth-protected-resource/mcp") ||
      source.includes("MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH")) &&
    !/WWW-Authenticate/iu.test(source) &&
    !/app\.post|app\.put|app\.patch|app\.delete/iu.test(source)
  );
}

function routeConsumesSyntheticEvaluator() {
  return [MCP_ROUTE_PATH, METADATA_ROUTE_PATH]
    .map((path) => safeRead(path))
    .some((source) => source.includes("evaluateSyntheticTokenValidationScenario"));
}

function docsBoundary(path, requiredTexts) {
  if (!existsSync(path)) return false;
  const normalized = normalize(safeRead(path));
  return requiredTexts.every((requiredText) =>
    normalized.includes(normalize(requiredText)),
  );
}

function changedFilePathScope() {
  const committedBranchDiffPaths = readGitLines([
    "diff",
    "--name-only",
    "origin/main...HEAD",
  ]);
  const dirtyQaTargetFiles = readGitLines([
    "status",
    "--short",
    "--untracked-files=all",
  ]).map((line) =>
    line
      .replace(/^[A-Z?! ]{1,2}\s+/u, "")
      .replace(/.* -> /u, "")
      .trim(),
  );

  return {
    combinedChangedPaths: [
      ...new Set([...committedBranchDiffPaths, ...dirtyQaTargetFiles]),
    ]
      .filter(Boolean)
      .sort(),
    committedBranchDiffBase: "origin/main...HEAD",
    committedBranchDiffPaths,
    dirtyQaTargetFiles: dirtyQaTargetFiles.filter(Boolean).sort(),
  };
}

function readGitLines(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" })
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function readChangedExecutableSource(paths) {
  return paths
    .filter((path) => /\.(?:ts|tsx|js|mjs|cjs)$/u.test(path))
    .filter((path) => !path.endsWith(".spec.ts"))
    .filter((path) => existsSync(path))
    .map((path) => `// ${path}\n${safeRead(path)}`)
    .join("\n");
}

function readChangedDocText(paths) {
  return paths
    .filter((path) => /\.(?:md|mdx|txt)$/u.test(path))
    .filter((path) => existsSync(path))
    .map((path) => {
      if (!isTracked(path)) return safeRead(path);
      const committedText = readAddedDiffLines([
        "diff",
        "--unified=0",
        "origin/main...HEAD",
        "--",
        path,
      ]);
      const stagedText = readAddedDiffLines([
        "diff",
        "--cached",
        "--unified=0",
        "--",
        path,
      ]);
      const unstagedText = readAddedDiffLines([
        "diff",
        "--unified=0",
        "--",
        path,
      ]);
      return [committedText, stagedText, unstagedText]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");
}

function readAddedDiffLines(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" })
      .split("\n")
      .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
      .map((line) => line.slice(1))
      .join("\n");
  } catch {
    return "";
  }
}

function readProofSourceTextByPath(paths) {
  return Object.fromEntries(
    paths
      .filter(isMcpTokenValidationTestDoubleProofSourcePath)
      .filter((path) => existsSync(path))
      .map((path) => [path, safeRead(path)]),
  );
}

function repoFilePaths() {
  const results = [];
  const skipped = new Set([
    ".git",
    ".next",
    ".turbo",
    "coverage",
    "dist",
    "node_modules",
  ]);

  function walk(directory, prefix = "") {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && skipped.has(entry.name)) continue;
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolutePath = `${directory}/${entry.name}`;
      if (entry.isDirectory()) walk(absolutePath, relativePath);
      else results.push(relativePath);
    }
  }

  walk(process.cwd());
  return results.sort();
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function safeRead(path) {
  return readFileSync(path, "utf8");
}

function isTracked(path) {
  try {
    execFileSync("git", ["ls-files", "--error-unmatch", "--", path], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return true;
  } catch {
    return false;
  }
}

function normalize(text) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
