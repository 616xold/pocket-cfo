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
  TokenValidationResultEnvelopeProofSchema,
  buildTokenValidationResultEnvelope,
  buildTokenValidationResultEnvelopeInputDescriptor,
  buildTokenValidationResultEnvelopeProof,
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
  verifyFp0139AbsentOrLocalProofModeTokenValidationResultEnvelope,
  verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary,
  verifyFp0139PlanningTextRequiredTopics,
  verifyFp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanning,
  verifyFp0141Absent,
  verifyMcpTokenValidationTestDoubleContractBoundaries,
  verifyMcpTokenValidationTestDoubleRepositoryInventory,
  verifyTokenValidationResultEnvelopeBoundaryFields,
  verifyTokenValidationResultEnvelopeHttpPostureMapping,
  verifyTokenValidationResultEnvelopeNoTokenMaterialRejection,
  verifyTokenValidationResultEnvelopeRequiredScopesSanitized,
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
const fp0139PlanText = safeRead(
  FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH,
);
const fp0140PlanText = safeReadIfExists(
  FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
);
const noLeakageScan = scanTokenValidationNoLeakage(
  fp0139PlanText,
);
const changedTokenExampleScan = scanChangedTokenExamples(
  buildDocLeakageScanText({
    committedBranchDiffDocTexts: readCommittedBranchDiffDocText(
      changedPathScope.committedBranchDiffPaths,
    ),
    dirtyQaDocTexts: readDirtyQaDocText(changedPathScope.dirtyQaTargetFiles),
    fp0139PlanText: "",
  }),
);
const planTopics = verifyFp0139PlanningTextRequiredTopics(fp0139PlanText);
const sourceScope = verifySourceScope();
const repositoryInventory = verifyRepositoryInventory();
const priorBoundaries = verifyPriorBoundaries();
const envelopeChecks = verifyEnvelopeChecks();

const proof = TokenValidationResultEnvelopeProofSchema.parse(
  buildTokenValidationResultEnvelopeProof({
    acceptsSanitizedDescriptorOnly:
      envelopeChecks.acceptsSanitizedDescriptorOnly,
    evidenceFreeSecurityDecisionBoundaryVerified:
      envelopeChecks.evidenceFreeSecurityDecisionBoundaryVerified,
    exactFailureTaxonomyVerified:
      verifyExactTokenValidationResultEnvelopeFailureTaxonomy(),
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
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified:
      priorBoundaries.fp0136InvalidTokenChallengeContractsBoundaryStillVerified,
    fp0137InvalidTokenChallengeReadinessBoundaryStillVerified:
      priorBoundaries.fp0137InvalidTokenChallengeReadinessBoundaryStillVerified,
    fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified:
      priorBoundaries.fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified,
    fp0139BoundaryVerified:
      verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary({
        planText: fp0139PlanText,
        repoPaths,
      }) && Object.values(planTopics).every(Boolean),
    fp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanningVerified:
      verifyFp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanning({
        planText: fp0140PlanText,
        repoPaths,
      }),
    fp0141Absent: verifyFp0141Absent(repoPaths),
    httpPostureRecommendationVerified:
      verifyTokenValidationResultEnvelopeHttpPostureMapping(),
    issuerAudienceResourcePostureVerified:
      envelopeChecks.issuerAudienceResourcePostureVerified,
    noAuthMiddlewareImplementation: sourceScope.noAuthMiddlewareImplementation,
    noBearerMaterialAccepted: envelopeChecks.noBearerMaterialAccepted,
    noBearerTokenMaterial:
      noLeakageScan.accepted &&
      changedTokenExampleScan.noBearerTokenMaterial &&
      repositoryInventory.noBearerTokenMaterialRepositoryInventoryVerified,
    noDbQueriesAdded: sourceScope.noDbQueriesAdded,
    noInvalidTokenChallengeRuntime:
      sourceScope.noInvalidTokenChallengeRuntime &&
      repositoryInventory.noInvalidTokenChallengeRuntimeRepositoryInventoryVerified,
    noJwtDecodingRuntime:
      sourceScope.noJwtDecodingRuntime &&
      repositoryInventory.noJwtDecodingRuntimeRepositoryInventoryVerified,
    noJwtLikeExamples:
      noLeakageScan.accepted &&
      changedTokenExampleScan.noJwtLikeExamples &&
      repositoryInventory.noJwtLikeExampleRepositoryInventoryVerified,
    noJwtLikeMaterialAccepted: envelopeChecks.noJwtLikeMaterialAccepted,
    noMcpRouteBehaviorChange:
      sourceScope.noMcpRouteBehaviorChange && localMcpRouteShapeStillVerified(),
    noMissingTokenChallengeBehaviorChange:
      sourceScope.noMissingTokenChallengeBehaviorChange,
    noOpenAiApiCalls:
      sourceScope.noOpenAiApiCalls &&
      repositoryInventory.noOpenAiApiSourceScanVerified,
    noOauthImplementation:
      sourceScope.noOauthImplementation &&
      repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
    noPackageScriptsAdded: sourceScope.noPackageScriptsAdded,
    noProtectedResourceMetadataRouteBehaviorChange:
      sourceScope.noProtectedResourceMetadataRouteBehaviorChange &&
      metadataRouteShapeStillVerified(),
    noProviderExternalCalls: sourceScope.noProviderExternalCalls,
    noRawTokenInputAccepted: envelopeChecks.noRawTokenInputAccepted,
    noRealTokenExamples:
      noLeakageScan.accepted &&
      changedTokenExampleScan.noRealTokenExamples &&
      repositoryInventory.noRealTokenExampleRepositoryInventoryVerified,
    noRouteBehaviorChange:
      sourceScope.noMcpRouteBehaviorChange &&
      sourceScope.noProtectedResourceMetadataRouteBehaviorChange,
    noRouteConsumesTestDouble:
      sourceScope.noRouteConsumesTestDouble &&
      repositoryInventory.noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified,
    noSchemaMigrationsAdded: sourceScope.noSchemaMigrationsAdded,
    noSourceMutationFinanceWrite:
      sourceScope.noSourceMutation && sourceScope.noFinanceWrite,
    noTokenEchoBoundaryVerified: envelopeChecks.noTokenEchoBoundaryVerified,
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
    noWwwAuthenticateHeaderEmission:
      envelopeChecks.noWwwAuthenticateHeaderEmission,
    proofModeOnlyBoundaryVerified: envelopeChecks.proofModeOnlyBoundaryVerified,
    requiredScopesSanitizedVerified:
      verifyTokenValidationResultEnvelopeRequiredScopesSanitized(),
    resultEnvelopeBuilderImplemented:
      envelopeChecks.resultEnvelopeBuilderImplemented,
    revocationReplayPostureVerified:
      envelopeChecks.revocationReplayPostureVerified,
    subjectOrgCompanyBindingPostureVerified:
      envelopeChecks.subjectOrgCompanyBindingPostureVerified,
    wwwAuthenticateErrorSymbolBoundaryVerified:
      envelopeChecks.wwwAuthenticateErrorSymbolBoundaryVerified,
  }),
);

const bridgeFields = {
  fp0139AbsentOrLocalProofModeTokenValidationResultEnvelopeVerified:
    verifyFp0139AbsentOrLocalProofModeTokenValidationResultEnvelope({
      planText: fp0139PlanText,
      repoPaths,
    }),
  fp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanningVerified:
    proof.fp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanningVerified,
  fp0141Absent: proof.fp0141Absent,
  tokenValidationResultEnvelopeImplementationBoundaryVerified:
    proof.fp0139BoundaryVerified,
  noMcpRouteBehaviorChangeFromFp0139: proof.noRouteBehaviorChange,
  noProtectedResourceMetadataRouteBehaviorChangeFromFp0139:
    proof.noProtectedResourceMetadataRouteBehaviorChange,
  noMissingTokenChallengeBehaviorChangeFromFp0139:
    proof.noMissingTokenChallengeBehaviorChange,
  noInvalidTokenChallengeRuntimeFromFp0139:
    proof.noInvalidTokenChallengeRuntime,
  noWwwAuthenticateHeaderRuntimeFromFp0139:
    proof.noWwwAuthenticateHeaderEmission,
  noTokenParsingRuntimeFromFp0139: proof.noTokenParsingRuntime,
  noJwtDecodingRuntimeFromFp0139: proof.noJwtDecodingRuntime,
  noTokenValidationRuntimeFromFp0139: proof.noTokenValidationRuntime,
  noTokenIntrospectionRuntimeFromFp0139: proof.noTokenIntrospectionRuntime,
  noRouteConsumesTestDoubleFromFp0139: proof.noRouteConsumesTestDouble,
  noOauthImplementationFromFp0139: proof.noOauthImplementation,
  noTokenSessionStorageFromFp0139: proof.noTokenSessionStorage,
  noAuthMiddlewareImplementationFromFp0139:
    proof.noAuthMiddlewareImplementation,
  noRealTokenExamplesFromFp0139: proof.noRealTokenExamples,
  noJwtLikeExamplesFromFp0139: proof.noJwtLikeExamples,
  noBearerTokenMaterialFromFp0139: proof.noBearerTokenMaterial,
  noDbQueriesFromFp0139: proof.noDbQueriesAdded,
  noSchemaMigrationsFromFp0139: proof.noSchemaMigrationsAdded,
  noPackageScriptsFromFp0139: proof.noPackageScriptsAdded,
  noOpenAiApiCallsFromFp0139: proof.noOpenAiApiCalls,
  noProviderExternalCallsFromFp0139: proof.noProviderExternalCalls,
  noSourceMutationFinanceWriteFromFp0139: proof.noSourceMutationFinanceWrite,
  fp0135InvalidTokenChallengeSequencingBoundaryStillVerified:
    priorBoundaries.fp0135InvalidTokenChallengeSequencingBoundaryStillVerified,
  fp0133TokenValidationTestDoubleContractsBoundaryStillVerified:
    priorBoundaries.fp0133TokenValidationTestDoubleContractsBoundaryStillVerified,
  fp0131TokenValidationRuntimeSequencingBoundaryStillVerified:
    priorBoundaries.fp0131TokenValidationRuntimeSequencingBoundaryStillVerified,
  fp0128TokenValidationReadinessBoundaryStillVerified:
    priorBoundaries.fp0128TokenValidationReadinessBoundaryStillVerified,
  fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified:
    priorBoundaries.fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified,
};

const proofOutput = {
  ...proof,
  ...bridgeFields,
  proofDetails: {
    changedPathScope,
    changedTokenExampleScan,
    envelopeChecks,
    noLeakageScan,
    planTopics,
    priorBoundaries,
    repositoryInventory,
    sourceScope,
  },
};

for (const [key, value] of Object.entries(proofOutput)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0139 token-validation result envelope proof failed: ${key}`,
    );
  }
}

console.log(JSON.stringify(proofOutput, null, 2));

function verifyEnvelopeChecks() {
  const accepted = buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor(),
  );
  const insufficientScope = buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor({
      outcome: "insufficient_scope",
    }),
  );
  const wrongOrg = buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor({
      outcome: "wrong_org",
    }),
  );

  return {
    acceptsSanitizedDescriptorOnly: accepted.accepted,
    evidenceFreeSecurityDecisionBoundaryVerified:
      verifyTokenValidationResultEnvelopeBoundaryFields() &&
      !accepted.evidenceFreeSecurityDecisionBoundary.evidenceInputsUsed,
    issuerAudienceResourcePostureVerified:
      accepted.issuerAudienceResourcePosture.providerCallPerformed === false,
    noBearerMaterialAccepted:
      verifyTokenValidationResultEnvelopeNoTokenMaterialRejection(),
    noJwtLikeMaterialAccepted:
      verifyTokenValidationResultEnvelopeNoTokenMaterialRejection(),
    noRawTokenInputAccepted:
      verifyTokenValidationResultEnvelopeNoTokenMaterialRejection(),
    noTokenEchoBoundaryVerified:
      accepted.noTokenEchoBoundary.carriesRawToken === false,
    noWwwAuthenticateHeaderEmission:
      accepted.wwwAuthenticateHeaderEmitted === false &&
      insufficientScope.wwwAuthenticateHeaderEmitted === false,
    proofModeOnlyBoundaryVerified:
      accepted.proofModeOnlyBoundary.localProofOnly &&
      !accepted.proofModeOnlyBoundary.productionValidationPerformed,
    resultEnvelopeBuilderImplemented:
      accepted.envelopeKind === "token_validation_result_envelope",
    revocationReplayPostureVerified:
      accepted.revocationReplayPosture.revocationStoreChecked === false,
    subjectOrgCompanyBindingPostureVerified:
      wrongOrg.subjectOrgCompanyBindingPosture.failClosedNonLeaking,
    wwwAuthenticateErrorSymbolBoundaryVerified:
      insufficientScope.wwwAuthenticateError === "insufficient_scope" &&
      !insufficientScope.wwwAuthenticateHeaderEmitted,
  };
}

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
      }),
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

function buildDocLeakageScanText({
  committedBranchDiffDocTexts,
  dirtyQaDocTexts,
  fp0139PlanText,
}) {
  return [
    `// ${FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH}\n${fp0139PlanText}`,
    ...committedBranchDiffDocTexts.map(
      (entry) => `// ${entry.path}\n${entry.text}`,
    ),
    ...dirtyQaDocTexts.map((entry) => `// ${entry.path}\n${entry.text}`),
  ].join("\n");
}

function readCommittedBranchDiffDocText(paths) {
  return paths
    .filter((path) => /\.(?:md|mdx|txt)$/u.test(path))
    .filter((path) => existsSync(path))
    .map((path) => {
      try {
        return {
          path,
          text: execFileSync(
            "git",
            ["diff", "--unified=0", "origin/main...HEAD", "--", path],
            { encoding: "utf8" },
          )
            .split("\n")
            .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
            .map((line) => line.slice(1))
            .join("\n"),
        };
      } catch {
        return { path, text: safeRead(path) };
      }
    });
}

function readDirtyQaDocText(paths) {
  return paths
    .filter((path) => /\.(?:md|mdx|txt)$/u.test(path))
    .filter((path) => existsSync(path))
    .map((path) => {
      const addedText = readWorkingTreeAddedText(path);
      return {
        path,
        text: addedText.trim() ? addedText : safeRead(path),
      };
    });
}

function readWorkingTreeAddedText(path) {
  try {
    return execFileSync("git", ["diff", "--unified=0", "--", path], {
      encoding: "utf8",
    })
      .split("\n")
      .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
      .map((line) => line.slice(1))
      .join("\n");
  } catch {
    return "";
  }
}

function safeRead(path) {
  return readFileSync(path, "utf8");
}

function safeReadIfExists(path) {
  return existsSync(path) ? safeRead(path) : undefined;
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function normalize(text) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
