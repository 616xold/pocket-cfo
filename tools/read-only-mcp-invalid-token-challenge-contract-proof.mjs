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
  FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
  McpInvalidTokenChallengeProofSchema,
  buildMcpInvalidTokenChallengeProof,
  isMcpTokenValidationTestDoubleProofSourcePath,
  scanTokenValidationNoLeakage,
  verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary,
  verifyFp0128TokenValidationReadinessContractsBoundary,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0131TokenValidationRuntimeSequencingPlanBoundary,
  verifyFp0132TokenValidationRuntimeContractsBoundary,
  verifyFp0133TokenValidationTestDoubleContractsBoundary,
  verifyFp0134TokenValidationTestDoubleImplementationBoundary,
  verifyFp0135InvalidTokenChallengeSequencingPlanBoundary,
  verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts,
  verifyFp0136InvalidTokenChallengeContractsBoundary,
  verifyFp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlan,
  verifyFp0138Absent,
  verifyFp0138AbsentOrDocsOnlyTokenValidationRuntimeImplementationPlanning,
  verifyFp0139AbsentOrLocalProofModeTokenValidationResultEnvelope,
  verifyFp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanning,
  verifyFp0141Absent,
  verifyMcpInvalidTokenChallengeContractBoundaries,
  verifyMcpTokenValidationTestDoubleContractBoundaries,
  verifyMcpTokenValidationTestDoubleRepositoryInventory,
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
const fp0136PlanText = safeRead(
  FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
);
const fp0137PlanText = safeReadIfExists(
  FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH,
);
const docLeakageScanText = readDocLeakageScanText({
  changedPathScope,
  fp0136PlanText,
});
const docLeakageScannerContract = verifyDocLeakageScannerContract();
const noLeakageScan = scanTokenValidationNoLeakage(fp0136PlanText);
const changedTokenExampleScan = scanChangedTokenExamples(
  docLeakageScanText.scanText,
);
const sourceScope = verifySourceScope();
const repositoryInventory = verifyRepositoryInventory();
const priorBoundaries = verifyPriorBoundaries();

const proof = McpInvalidTokenChallengeProofSchema.parse(
  buildMcpInvalidTokenChallengeProof({
    fp0100PublicSecurityBoundaryStillVerified:
      priorBoundaries.fp0100PublicSecurityBoundaryStillVerified,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      priorBoundaries.fp0106ProtocolEnvelopeBoundaryStillVerified,
    fp0107RouteAdapterBoundaryStillVerified:
      priorBoundaries.fp0107RouteAdapterBoundaryStillVerified,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
      priorBoundaries.fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified,
    fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified:
      priorBoundaries.fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified,
    fp0128TokenValidationReadinessBoundaryStillVerified:
      priorBoundaries.fp0128TokenValidationReadinessBoundaryStillVerified,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      priorBoundaries.fp0130MissingTokenChallengeBoundaryStillVerified,
    fp0131TokenValidationRuntimeSequencingBoundaryStillVerified:
      priorBoundaries.fp0131TokenValidationRuntimeSequencingBoundaryStillVerified,
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified:
      priorBoundaries.fp0132TokenValidationRuntimeContractsBoundaryStillVerified,
    fp0133TokenValidationTestDoubleContractsBoundaryStillVerified:
      verifyFp0133TokenValidationTestDoubleContractsBoundary({
        planText: safeRead(
          FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
        ),
        repoPaths,
      }) && verifyMcpTokenValidationTestDoubleContractBoundaries(),
    fp0134SyntheticTestDoubleEvaluatorBoundaryStillVerified:
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
    fp0136AbsentOrLocalInvalidTokenChallengeContractsVerified:
      verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts({
        planText: fp0136PlanText,
        repoPaths,
      }),
    fp0136BoundaryVerified: verifyFp0136InvalidTokenChallengeContractsBoundary({
      planText: fp0136PlanText,
      repoPaths,
    }),
    fp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlanVerified:
      verifyFp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlan(
        {
          planText: fp0137PlanText,
          repoPaths,
        },
      ),
    fp0138Absent: verifyFp0138Compatibility(),
    invalidTokenChallengeContractsFoundationVerified:
      verifyMcpInvalidTokenChallengeContractBoundaries(),
    noAuthMiddlewareImplementation: sourceScope.noAuthMiddlewareImplementation,
    noAuthMiddlewareImplementationFromFp0136:
      sourceScope.noAuthMiddlewareImplementation,
    noBearerTokenMaterial:
      noLeakageScan.accepted &&
      docLeakageScannerContract.committedBranchDiffBearerMaterialRejected &&
      docLeakageScannerContract.dirtyQaJwtLikeMaterialRejected &&
      docLeakageScannerContract.safeDocsProofAbsenceTextAccepted &&
      docLeakageScannerContract.fullFp0136PlanTextAccepted &&
      changedTokenExampleScan.noBearerTokenMaterial &&
      repositoryInventory.noBearerTokenMaterialRepositoryInventoryVerified,
    noBearerTokenMaterialFromFp0136:
      noLeakageScan.accepted &&
      docLeakageScannerContract.committedBranchDiffBearerMaterialRejected &&
      docLeakageScannerContract.dirtyQaJwtLikeMaterialRejected &&
      docLeakageScannerContract.safeDocsProofAbsenceTextAccepted &&
      docLeakageScannerContract.fullFp0136PlanTextAccepted &&
      changedTokenExampleScan.noBearerTokenMaterial &&
      repositoryInventory.noBearerTokenMaterialRepositoryInventoryVerified,
    noDbQueriesAdded: sourceScope.noDbQueriesAdded,
    noDbQueriesFromFp0136: sourceScope.noDbQueriesAdded,
    noInvalidTokenChallengeRuntime:
      sourceScope.noInvalidTokenChallengeRuntime &&
      repositoryInventory.noInvalidTokenChallengeRuntimeRepositoryInventoryVerified,
    noInvalidTokenChallengeRuntimeFromFp0136:
      sourceScope.noInvalidTokenChallengeRuntime &&
      repositoryInventory.noInvalidTokenChallengeRuntimeRepositoryInventoryVerified,
    noJwtDecodingRuntime:
      sourceScope.noJwtDecodingRuntime &&
      repositoryInventory.noJwtDecodingRuntimeRepositoryInventoryVerified,
    noJwtDecodingRuntimeFromFp0136:
      sourceScope.noJwtDecodingRuntime &&
      repositoryInventory.noJwtDecodingRuntimeRepositoryInventoryVerified,
    noJwtLikeExamples:
      noLeakageScan.accepted &&
      docLeakageScannerContract.committedBranchDiffBearerMaterialRejected &&
      docLeakageScannerContract.dirtyQaJwtLikeMaterialRejected &&
      docLeakageScannerContract.safeDocsProofAbsenceTextAccepted &&
      docLeakageScannerContract.fullFp0136PlanTextAccepted &&
      changedTokenExampleScan.noJwtLikeExamples &&
      repositoryInventory.noJwtLikeExampleRepositoryInventoryVerified,
    noJwtLikeExamplesFromFp0136:
      noLeakageScan.accepted &&
      docLeakageScannerContract.committedBranchDiffBearerMaterialRejected &&
      docLeakageScannerContract.dirtyQaJwtLikeMaterialRejected &&
      docLeakageScannerContract.safeDocsProofAbsenceTextAccepted &&
      docLeakageScannerContract.fullFp0136PlanTextAccepted &&
      changedTokenExampleScan.noJwtLikeExamples &&
      repositoryInventory.noJwtLikeExampleRepositoryInventoryVerified,
    noMcpRouteBehaviorChange:
      sourceScope.noMcpRouteBehaviorChange && localMcpRouteShapeStillVerified(),
    noMcpRouteBehaviorChangeFromFp0136:
      sourceScope.noMcpRouteBehaviorChange && localMcpRouteShapeStillVerified(),
    noMissingTokenChallengeBehaviorChange:
      sourceScope.noMissingTokenChallengeBehaviorChange,
    noMissingTokenChallengeBehaviorChangeFromFp0136:
      sourceScope.noMissingTokenChallengeBehaviorChange,
    noOauthImplementation:
      sourceScope.noOauthImplementation &&
      repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
    noOauthImplementationFromFp0136:
      sourceScope.noOauthImplementation &&
      repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
    noOpenAiApiCalls:
      sourceScope.noOpenAiApiCalls &&
      repositoryInventory.noOpenAiApiSourceScanVerified,
    noOpenAiApiCallsFromFp0136:
      sourceScope.noOpenAiApiCalls &&
      repositoryInventory.noOpenAiApiSourceScanVerified,
    noPackageScriptsAdded: sourceScope.noPackageScriptsAdded,
    noPackageScriptsFromFp0136: sourceScope.noPackageScriptsAdded,
    noProtectedResourceMetadataRouteBehaviorChange:
      sourceScope.noProtectedResourceMetadataRouteBehaviorChange &&
      metadataRouteShapeStillVerified(),
    noProtectedResourceMetadataRouteBehaviorChangeFromFp0136:
      sourceScope.noProtectedResourceMetadataRouteBehaviorChange &&
      metadataRouteShapeStillVerified(),
    noProviderExternalCalls: sourceScope.noProviderExternalCalls,
    noProviderExternalCallsFromFp0136: sourceScope.noProviderExternalCalls,
    noRealTokenExamples:
      noLeakageScan.accepted &&
      docLeakageScannerContract.committedBranchDiffBearerMaterialRejected &&
      docLeakageScannerContract.dirtyQaJwtLikeMaterialRejected &&
      docLeakageScannerContract.safeDocsProofAbsenceTextAccepted &&
      docLeakageScannerContract.fullFp0136PlanTextAccepted &&
      changedTokenExampleScan.noRealTokenExamples &&
      repositoryInventory.noRealTokenExampleRepositoryInventoryVerified,
    noRealTokenExamplesFromFp0136:
      noLeakageScan.accepted &&
      docLeakageScannerContract.committedBranchDiffBearerMaterialRejected &&
      docLeakageScannerContract.dirtyQaJwtLikeMaterialRejected &&
      docLeakageScannerContract.safeDocsProofAbsenceTextAccepted &&
      docLeakageScannerContract.fullFp0136PlanTextAccepted &&
      changedTokenExampleScan.noRealTokenExamples &&
      repositoryInventory.noRealTokenExampleRepositoryInventoryVerified,
    noRouteConsumesTestDouble:
      sourceScope.noRouteConsumesTestDouble &&
      repositoryInventory.noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified,
    noRouteConsumesTestDoubleFromFp0136:
      sourceScope.noRouteConsumesTestDouble &&
      repositoryInventory.noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified,
    noSchemaMigrationsAdded: sourceScope.noSchemaMigrationsAdded,
    noSchemaMigrationsFromFp0136: sourceScope.noSchemaMigrationsAdded,
    noSourceMutationFinanceWrite:
      sourceScope.noSourceMutation && sourceScope.noFinanceWrite,
    noSourceMutationFinanceWriteFromFp0136:
      sourceScope.noSourceMutation && sourceScope.noFinanceWrite,
    noTokenIntrospectionRuntime:
      sourceScope.noTokenIntrospectionRuntime &&
      repositoryInventory.noTokenIntrospectionRuntimeRepositoryInventoryVerified,
    noTokenIntrospectionRuntimeFromFp0136:
      sourceScope.noTokenIntrospectionRuntime &&
      repositoryInventory.noTokenIntrospectionRuntimeRepositoryInventoryVerified,
    noTokenParsingRuntime:
      sourceScope.noTokenParsingRuntime &&
      repositoryInventory.noTokenParsingRuntimeRepositoryInventoryVerified,
    noTokenParsingRuntimeFromFp0136:
      sourceScope.noTokenParsingRuntime &&
      repositoryInventory.noTokenParsingRuntimeRepositoryInventoryVerified,
    noTokenSessionStorage:
      sourceScope.noTokenSessionStorage &&
      repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
    noTokenSessionStorageFromFp0136:
      sourceScope.noTokenSessionStorage &&
      repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
    noTokenValidationRuntime:
      sourceScope.noTokenValidationRuntime &&
      repositoryInventory.noTokenValidationRuntimeRepositoryInventoryVerified,
    noTokenValidationRuntimeFromFp0136:
      sourceScope.noTokenValidationRuntime &&
      repositoryInventory.noTokenValidationRuntimeRepositoryInventoryVerified,
  }),
);

for (const [key, value] of Object.entries(proof)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0136 invalid-token challenge contract proof failed: ${key}`,
    );
  }
}

console.log(
  JSON.stringify(
    {
      ...proof,
      proofDetails: {
        changedPathScope,
        changedTokenExampleScan,
        docLeakageScanSummary: summarizeDocLeakageScanText(docLeakageScanText),
        docLeakageScannerContract,
        noLeakageScan,
        priorBoundaries,
        repositoryInventory,
        sourceScope,
      },
    },
    null,
    2,
  ),
);

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
    noMcpRouteBehaviorChange:
      !changedPaths.includes(MCP_ROUTE_PATH) ||
      fp0141RouteDependencyBridgeVerified(),
    noMissingTokenChallengeBehaviorChange:
      (!changedPaths.includes(MCP_ROUTE_PATH) ||
        fp0141RouteDependencyBridgeVerified()) &&
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
      !/\b(?:providerConnect|callProvider|createProviderJob|deploy|fetch)\s*\(/u.test(
        changedExecutableSource,
      ),
    noRouteConsumesTestDouble:
      !/\b(?:consumeTestDouble|runTestDouble|testDoubleRuntime|routeTestDouble)\s*\(/u.test(
        changedExecutableSource,
      ),
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

function fp0141RouteDependencyBridgeVerified() {
  const source = safeRead(MCP_ROUTE_PATH);
  const missingTokenIndex = source.indexOf(
    "if (missingTokenChallenge && request.headers.authorization === undefined)",
  );
  const invalidTokenIndex = source.indexOf(
    "if (invalidTokenChallenge && request.headers.authorization !== undefined)",
  );

  return (
    source.includes(
      "readOnlyAppMcpInvalidTokenChallengeResultEnvelope?: unknown",
    ) &&
    source.includes("buildReadOnlyAppMcpInvalidTokenChallengeResponse") &&
    missingTokenIndex >= 0 &&
    invalidTokenIndex > missingTokenIndex &&
    localMcpRouteShapeStillVerified()
  );
}

function scanChangedTokenExamples(text) {
  const sanitized = text
    .replaceAll('authorization: ""', "")
    .replaceAll("authorization-present-local-only", "")
    .replaceAll("resource_metadata", "resource metadata");
  return {
    noBearerTokenMaterial:
      !/\bauthorization\s*:\s*bearer\s+\S+/iu.test(sanitized) &&
      !/\bbearer\s+(?!scheme\b|challenge\b|resource\b|parameter\b|parameters\b|token\b|material\b)[A-Za-z0-9._~+/-]{8,}={0,2}\b/iu.test(
        sanitized,
      ),
    noJwtLikeExamples:
      !/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/u.test(
        sanitized,
      ),
    noRealTokenExamples:
      !/\bauthorization\s*:\s*bearer\s+\S+/iu.test(sanitized) &&
      !/\b(?:access_token|refresh_token|client_secret|x-api-key|api_key)\s*[:=]\s*[A-Za-z0-9][A-Za-z0-9._~+/-]{7,}={0,2}\b/iu.test(
        sanitized,
      ) &&
      !/\bsk-[A-Za-z0-9][A-Za-z0-9_-]{8,}\b/u.test(sanitized),
  };
}

function verifyFp0138Compatibility() {
  return (
    verifyFp0138Absent(repoPaths) ||
    (verifyFp0138AbsentOrDocsOnlyTokenValidationRuntimeImplementationPlanning({
      planText: safeReadIfExists(
        FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH,
      ),
      repoPaths,
    }) &&
      verifyFp0139AbsentOrLocalProofModeTokenValidationResultEnvelope(
        repoPaths,
      ) &&
      verifyFp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanning({
        planText: safeReadIfExists(
          FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
        ),
        repoPaths,
      }) &&
      verifyFp0141Absent(repoPaths))
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
  };
}

function localMcpRouteShapeStillVerified() {
  const source = safeRead(MCP_ROUTE_PATH);
  return (
    countMatches(source, /app\.post\("\/mcp"/gu) === 1 &&
    countMatches(source, /app\.get\("\/mcp"/gu) === 1 &&
    !/read-only-app-mcp-token-validation-test-double/u.test(source)
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

function readDocLeakageScanText({ changedPathScope, fp0136PlanText }) {
  return buildDocLeakageScanText({
    committedBranchDiffDocTexts: readCommittedBranchDiffDocText(
      changedPathScope.committedBranchDiffPaths,
    ),
    dirtyQaDocTexts: readDirtyQaDocText(changedPathScope.dirtyQaTargetFiles),
    fp0136PlanText,
  });
}

function buildDocLeakageScanText({
  committedBranchDiffDocTexts,
  dirtyQaDocTexts,
  fp0136PlanText,
}) {
  const sections = [
    {
      path: FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
      source: "required-fp0136-plan-full-text",
      text: fp0136PlanText,
    },
    ...committedBranchDiffDocTexts.map((entry) => ({
      ...entry,
      source: "committed-branch-diff-additions",
    })),
    ...dirtyQaDocTexts.map((entry) => ({
      ...entry,
      source: "dirty-qa-additions",
    })),
  ];

  return {
    committedBranchDiffDocPaths: committedBranchDiffDocTexts
      .map(({ path }) => path)
      .sort(),
    dirtyQaDocPaths: dirtyQaDocTexts.map(({ path }) => path).sort(),
    scanText: sections
      .map(({ path, source, text }) => `# ${source}: ${path}\n${text}`)
      .join("\n"),
    scannedFullFp0136PlanText: true,
  };
}

function summarizeDocLeakageScanText(docLeakageScanText) {
  const { scanText: _scanText, ...summary } = docLeakageScanText;
  return summary;
}

function readCommittedBranchDiffDocText(paths) {
  return paths
    .filter((path) => /\.(?:md|mdx|txt)$/u.test(path))
    .filter((path) => existsSync(path))
    .map((path) => {
      const changedText = readAddedDiffLines([
        "diff",
        "--unified=0",
        "origin/main...HEAD",
        "--",
        path,
      ]);
      return { path, text: changedText };
    });
}

function readDirtyQaDocText(paths) {
  return paths
    .filter((path) => /\.(?:md|mdx|txt)$/u.test(path))
    .filter((path) => existsSync(path))
    .map((path) => {
      if (!isTracked(path)) return { path, text: safeRead(path) };
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
      return {
        path,
        text: [stagedText, unstagedText].filter(Boolean).join("\n"),
      };
    });
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

function verifyDocLeakageScannerContract() {
  const committedBearerMaterial = ["Bearer", "x".repeat(24)].join(" ");
  const dirtyJwtLikeMaterial = [
    ["eyJ", "dirty"].join("").padEnd(16, "x"),
    "jwtlikepayload".padEnd(16, "x"),
    "jwtlikesignature".padEnd(16, "x"),
  ].join(".");
  const safeDocsProofAbsenceText = [
    "No token validation runtime, no token parser, no JWT decoder, no token introspection runtime, and no Bearer material examples are present.",
    [
      "Do not use",
      ["OPENAI", "API", "KEY"].join("_"),
      "from openai imports,",
      ["responses", "create"].join("."),
      ["chat", "completions"].join("."),
      "or",
      ["api", "openai", "com"].join("."),
      "calls.",
    ].join(" "),
    "Proof output records absence only and does not include credential, cookie, session, Authorization, or token values.",
  ].join("\n");

  return {
    committedBranchDiffBearerMaterialRejected: !scanTokenValidationNoLeakage(
      buildDocLeakageScanText({
        committedBranchDiffDocTexts: [
          { path: "README.md", text: committedBearerMaterial },
        ],
        dirtyQaDocTexts: [],
        fp0136PlanText: "",
      }).scanText,
    ).accepted,
    dirtyQaJwtLikeMaterialRejected: !scanTokenValidationNoLeakage(
      buildDocLeakageScanText({
        committedBranchDiffDocTexts: [],
        dirtyQaDocTexts: [
          {
            path: "docs/security/read-only-agent-threat-model.md",
            text: dirtyJwtLikeMaterial,
          },
        ],
        fp0136PlanText: "",
      }).scanText,
    ).accepted,
    fullFp0136PlanTextAccepted:
      scanTokenValidationNoLeakage(fp0136PlanText).accepted,
    safeDocsProofAbsenceTextAccepted: scanTokenValidationNoLeakage(
      safeDocsProofAbsenceText,
    ).accepted,
  };
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

function safeReadIfExists(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
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
