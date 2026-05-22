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
  scanTokenValidationNoLeakage,
  verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary,
  verifyFp0128TokenValidationReadinessContractsBoundary,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0131TokenValidationRuntimeSequencingPlanBoundary,
  verifyFp0132TokenValidationRuntimeContractsBoundary,
  verifyFp0133TokenValidationTestDoubleContractsBoundary,
  verifyFp0134TokenValidationTestDoubleImplementationBoundary,
  verifyFp0135AbsentOrDocsOnlyInvalidTokenChallengeSequencingPlan,
  verifyFp0135InvalidTokenChallengeSequencingPlanBoundary,
  verifyFp0135PlanningTextRequiredTopics,
  verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts,
  verifyFp0136InvalidTokenChallengeContractsBoundary,
  verifyFp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlan,
  verifyFp0138Absent,
  verifyFp0138AbsentOrDocsOnlyTokenValidationRuntimeImplementationPlanning,
  verifyFp0139AbsentOrLocalProofModeTokenValidationResultEnvelope,
  verifyFp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanning,
  verifyFp0141Absent,
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
const fp0135PlanText = safeRead(
  FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH,
);
const fp0136PlanText = safeReadIfExists(
  FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
);
const fp0137PlanText = safeReadIfExists(
  FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH,
);
const changedDocText = readChangedDocText(changedPaths);
const scannedPlanningText = [fp0135PlanText, changedDocText].join("\n");
const planTopics = verifyFp0135PlanningTextRequiredTopics(fp0135PlanText);
const sourceScope = verifySourceScope();
const priorBoundaries = verifyPriorBoundaries();
const repositoryInventory = verifyRepositoryInventory();
const noLeakageScan = scanTokenValidationNoLeakage(scannedPlanningText);

const proof = {
  schemaVersion:
    "v2bc.read-only-app-mcp-invalid-token-challenge-sequencing-proof.v1",
  fp0135AbsentOrDocsOnlyInvalidTokenChallengeSequencingPlanVerified:
    verifyFp0135AbsentOrDocsOnlyInvalidTokenChallengeSequencingPlan({
      planText: fp0135PlanText,
      repoPaths,
    }),
  fp0136AbsentOrLocalInvalidTokenChallengeContractsVerified:
    verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts({
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
    verifyFp0136InvalidTokenChallengeContractsBoundary({
      planText: fp0136PlanText,
      repoPaths,
    }),
  invalidTokenChallengeSequencingPlanBoundaryVerified:
    verifyFp0135InvalidTokenChallengeSequencingPlanBoundary({
      planText: fp0135PlanText,
      repoPaths,
    }),
  noMcpRouteBehaviorChangeFromFp0135:
    sourceScope.noMcpRouteBehaviorChangeFromFp0135 &&
    localMcpRouteShapeStillVerified(),
  noProtectedResourceMetadataRouteBehaviorChangeFromFp0135:
    sourceScope.noProtectedResourceMetadataRouteBehaviorChangeFromFp0135 &&
    metadataRouteShapeStillVerified(),
  noMissingTokenChallengeBehaviorChangeFromFp0135:
    sourceScope.noMissingTokenChallengeBehaviorChangeFromFp0135,
  noInvalidTokenChallengeRuntimeFromFp0135:
    sourceScope.noInvalidTokenChallengeRuntimeFromFp0135 &&
    repositoryInventory.noInvalidTokenChallengeRuntimeRepositoryInventoryVerified,
  noTokenParsingRuntimeFromFp0135:
    sourceScope.noTokenParsingRuntimeFromFp0135 &&
    repositoryInventory.noTokenParsingRuntimeRepositoryInventoryVerified,
  noTokenValidationRuntimeFromFp0135:
    sourceScope.noTokenValidationRuntimeFromFp0135 &&
    repositoryInventory.noTokenValidationRuntimeRepositoryInventoryVerified,
  noJwtDecodingRuntimeFromFp0135:
    sourceScope.noJwtDecodingRuntimeFromFp0135 &&
    repositoryInventory.noJwtDecodingRuntimeRepositoryInventoryVerified,
  noTokenIntrospectionRuntimeFromFp0135:
    sourceScope.noTokenIntrospectionRuntimeFromFp0135 &&
    repositoryInventory.noTokenIntrospectionRuntimeRepositoryInventoryVerified,
  noRouteConsumesTestDoubleFromFp0135:
    sourceScope.noRouteConsumesTestDoubleFromFp0135 &&
    repositoryInventory.noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified,
  noOauthImplementationFromFp0135:
    sourceScope.noOauthImplementationFromFp0135 &&
    repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
  noTokenSessionStorageFromFp0135:
    sourceScope.noTokenSessionStorageFromFp0135 &&
    repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
  noAuthMiddlewareImplementationFromFp0135:
    sourceScope.noAuthMiddlewareImplementationFromFp0135,
  noRealTokenExamplesFromFp0135:
    noLeakageScan.accepted &&
    repositoryInventory.noRealTokenExampleRepositoryInventoryVerified,
  noJwtLikeExamplesFromFp0135:
    noLeakageScan.accepted &&
    repositoryInventory.noJwtLikeExampleRepositoryInventoryVerified,
  noBearerTokenMaterialFromFp0135:
    noLeakageScan.accepted &&
    repositoryInventory.noBearerTokenMaterialRepositoryInventoryVerified,
  noDbQueriesFromFp0135: sourceScope.noDbQueriesFromFp0135,
  noSchemaMigrationsFromFp0135: sourceScope.noSchemaMigrationsFromFp0135,
  noPackageScriptsFromFp0135: sourceScope.noPackageScriptsFromFp0135,
  noOpenAiApiCallsFromFp0135:
    sourceScope.noOpenAiApiCallsFromFp0135 &&
    repositoryInventory.noOpenAiApiSourceScanVerified,
  noProviderExternalCallsFromFp0135:
    sourceScope.noProviderExternalCallsFromFp0135,
  noSourceMutationFinanceWriteFromFp0135:
    sourceScope.noSourceMutationFromFp0135 &&
    sourceScope.noFinanceWriteFromFp0135,
  fp0134SyntheticTestDoubleEvaluatorBoundaryStillVerified:
    verifyFp0134TokenValidationTestDoubleImplementationBoundary({
      planText: safeRead(
        FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
      ),
      repoPaths,
    }),
  fp0133TokenValidationTestDoubleContractsBoundaryStillVerified:
    verifyFp0133TokenValidationTestDoubleContractsBoundary({
      planText: safeRead(
        FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
      ),
      repoPaths,
    }) && verifyMcpTokenValidationTestDoubleContractBoundaries(),
  fp0132TokenValidationRuntimeContractsBoundaryStillVerified:
    priorBoundaries.fp0132TokenValidationRuntimeContractsBoundaryStillVerified,
  fp0131TokenValidationRuntimeSequencingBoundaryStillVerified:
    priorBoundaries.fp0131TokenValidationRuntimeSequencingBoundaryStillVerified,
  fp0130MissingTokenChallengeBoundaryStillVerified:
    priorBoundaries.fp0130MissingTokenChallengeBoundaryStillVerified,
  fp0128TokenValidationReadinessBoundaryStillVerified:
    priorBoundaries.fp0128TokenValidationReadinessBoundaryStillVerified,
  fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified:
    priorBoundaries.fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified,
  fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
    priorBoundaries.fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified,
  fp0107RouteAdapterBoundaryStillVerified:
    priorBoundaries.fp0107RouteAdapterBoundaryStillVerified,
  fp0106ProtocolEnvelopeBoundaryStillVerified:
    priorBoundaries.fp0106ProtocolEnvelopeBoundaryStillVerified,
  fp0100PublicSecurityBoundaryStillVerified:
    priorBoundaries.fp0100PublicSecurityBoundaryStillVerified,
  planningTextCovers401403Mapping: planTopics.statusMapping,
  planningTextCoversResourceMetadata: planTopics.resourceAndScopeAlignment,
  planningTextCoversScopeChallenge: planTopics.resourceAndScopeAlignment,
  planningTextCoversJsonRpcRefusalSeparation:
    planTopics.jsonRpcRefusalSeparation,
  planningTextCoversFailureTaxonomy: planTopics.failureTaxonomy,
  planningTextCoversNoTokenEcho: planTopics.noTokenSamples,
  planningTextCoversFutureFp0136Gate: planTopics.futureFp0136Gate,
  noMcpRouteBehaviorChangeFromFp0136:
    sourceScope.noMcpRouteBehaviorChangeFromFp0135 &&
    localMcpRouteShapeStillVerified(),
  noProtectedResourceMetadataRouteBehaviorChangeFromFp0136:
    sourceScope.noProtectedResourceMetadataRouteBehaviorChangeFromFp0135 &&
    metadataRouteShapeStillVerified(),
  noMissingTokenChallengeBehaviorChangeFromFp0136:
    sourceScope.noMissingTokenChallengeBehaviorChangeFromFp0135,
  noInvalidTokenChallengeRuntimeFromFp0136:
    sourceScope.noInvalidTokenChallengeRuntimeFromFp0135 &&
    repositoryInventory.noInvalidTokenChallengeRuntimeRepositoryInventoryVerified,
  noTokenParsingRuntimeFromFp0136:
    sourceScope.noTokenParsingRuntimeFromFp0135 &&
    repositoryInventory.noTokenParsingRuntimeRepositoryInventoryVerified,
  noTokenValidationRuntimeFromFp0136:
    sourceScope.noTokenValidationRuntimeFromFp0135 &&
    repositoryInventory.noTokenValidationRuntimeRepositoryInventoryVerified,
  noJwtDecodingRuntimeFromFp0136:
    sourceScope.noJwtDecodingRuntimeFromFp0135 &&
    repositoryInventory.noJwtDecodingRuntimeRepositoryInventoryVerified,
  noTokenIntrospectionRuntimeFromFp0136:
    sourceScope.noTokenIntrospectionRuntimeFromFp0135 &&
    repositoryInventory.noTokenIntrospectionRuntimeRepositoryInventoryVerified,
  noRouteConsumesTestDoubleFromFp0136:
    sourceScope.noRouteConsumesTestDoubleFromFp0135 &&
    repositoryInventory.noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified,
  noOauthImplementationFromFp0136:
    sourceScope.noOauthImplementationFromFp0135 &&
    repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
  noTokenSessionStorageFromFp0136:
    sourceScope.noTokenSessionStorageFromFp0135 &&
    repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
  noAuthMiddlewareImplementationFromFp0136:
    sourceScope.noAuthMiddlewareImplementationFromFp0135,
  noRealTokenExamplesFromFp0136:
    noLeakageScan.accepted &&
    repositoryInventory.noRealTokenExampleRepositoryInventoryVerified,
  noJwtLikeExamplesFromFp0136:
    noLeakageScan.accepted &&
    repositoryInventory.noJwtLikeExampleRepositoryInventoryVerified,
  noBearerTokenMaterialFromFp0136:
    noLeakageScan.accepted &&
    repositoryInventory.noBearerTokenMaterialRepositoryInventoryVerified,
  noDbQueriesFromFp0136: sourceScope.noDbQueriesFromFp0135,
  noSchemaMigrationsFromFp0136: sourceScope.noSchemaMigrationsFromFp0135,
  noPackageScriptsFromFp0136: sourceScope.noPackageScriptsFromFp0135,
  noOpenAiApiCallsFromFp0136:
    sourceScope.noOpenAiApiCallsFromFp0135 &&
    repositoryInventory.noOpenAiApiSourceScanVerified,
  noProviderExternalCallsFromFp0136:
    sourceScope.noProviderExternalCallsFromFp0135,
  noSourceMutationFinanceWriteFromFp0136:
    sourceScope.noSourceMutationFromFp0135 &&
    sourceScope.noFinanceWriteFromFp0135,
};

for (const [key, value] of Object.entries(proof)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0135 invalid-token challenge sequencing proof failed: ${key}`,
    );
  }
}

console.log(
  JSON.stringify(
    {
      ...proof,
      proofDetails: {
        changedPathScope,
        noLeakageScan,
        planTopics,
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
    noAuthMiddlewareImplementationFromFp0135:
      !/\b(?:authMiddleware|authorizationMiddleware|routeGuard|verifyBearer|requireAuth|authenticateRequest|setCookie)\s*\(/u.test(
        changedExecutableSource,
      ),
    noDbQueriesFromFp0135:
      !changedPaths.some((path) => /^packages\/db\//u.test(path)) &&
      !/\b(?:from\s+["']drizzle|drizzle\s*\(|select\s*\(|insert\s*\(|update\s*\(|delete\s*\(|sql`)\b/u.test(
        changedExecutableSource,
      ),
    noFinanceWriteFromFp0135:
      !/\b(?:writeFinanceTwin|updateLedger|financeWrite|postLedger|createJournalEntry)\s*\(/u.test(
        changedExecutableSource,
      ),
    noInvalidTokenChallengeRuntimeFromFp0135:
      !/\b(?:invalidTokenChallenge|malformedToken|expiredToken|wrongAudience|wrongResource|wrongScope|wrongOrg|wrongCompany|revokedToken|replayedToken)\s*\(/u.test(
        changedExecutableSource,
      ),
    noJwtDecodingRuntimeFromFp0135:
      !/\b(?:parseJwt|decodeJwt|jwtDecode|jwtVerify|verifyJwt)\s*\(/u.test(
        changedExecutableSource,
      ),
    noMcpRouteBehaviorChangeFromFp0135: !changedPaths.includes(MCP_ROUTE_PATH),
    noMissingTokenChallengeBehaviorChangeFromFp0135:
      !changedPaths.includes(MCP_ROUTE_PATH) &&
      !changedPaths.includes(MISSING_TOKEN_HELPER_PATH),
    noModelCallsFromFp0135: !modelCallRegex.test(changedExecutableSource),
    noOauthImplementationFromFp0135:
      !/\b(?:oauthCallback|authorizeUrl|tokenExchange|authorizationCode|pkceVerifier)\s*\(/u.test(
        changedExecutableSource,
      ),
    noOpenAiApiCallsFromFp0135:
      !/\b(?:OpenAI|openai|responses\.create|chat\.completions|files\.create|api\.openai\.com)\s*\(/u.test(
        changedExecutableSource,
      ),
    noPackageScriptsFromFp0135:
      !changedPaths.includes("package.json") &&
      !changedPaths.some((path) => /\/package\.json$/u.test(path)),
    noProtectedResourceMetadataRouteBehaviorChangeFromFp0135:
      !changedPaths.includes(METADATA_ROUTE_PATH),
    noProviderExternalCallsFromFp0135:
      !/\b(?:providerConnect|callProvider|createProviderJob|deploy|fetch)\s*\(/u.test(
        changedExecutableSource,
      ),
    noRouteConsumesTestDoubleFromFp0135:
      !/\b(?:consumeTestDouble|runTestDouble|testDoubleRuntime|routeTestDouble)\s*\(/u.test(
        changedExecutableSource,
      ),
    noSchemaMigrationsFromFp0135: !changedPaths.some(
      (path) =>
        /^packages\/db\//u.test(path) ||
        /(?:^|\/)migrations?\//iu.test(path) ||
        /\.sql$/iu.test(path),
    ),
    noSourceMutationFromFp0135:
      !/\b(?:uploadSource|mutateSource|rewriteSource|deleteSource)\s*\(/u.test(
        changedExecutableSource,
      ),
    noTokenIntrospectionRuntimeFromFp0135: !/\bintrospectToken\s*\(/u.test(
      changedExecutableSource,
    ),
    noTokenParsingRuntimeFromFp0135:
      !/\b(?:decodeToken|parseToken|parseJwt|decodeJwt|jwtDecode|introspectToken)\s*\(/u.test(
        changedExecutableSource,
      ),
    noTokenSessionStorageFromFp0135:
      !/\b(?:tokenStore|sessionStore|sessionHandler|refreshTokenStore|setCookie)\s*\(/u.test(
        changedExecutableSource,
      ),
    noTokenValidationRuntimeFromFp0135:
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

function readChangedDocText(paths) {
  return paths
    .filter((path) => /\.(?:md|mdx|txt)$/u.test(path))
    .filter((path) => existsSync(path))
    .map((path) => {
      const changedText = isTracked(path)
        ? readAddedDiffLines(path)
        : safeRead(path);
      return `# ${path}\n${changedText}`;
    })
    .join("\n");
}

function readAddedDiffLines(path) {
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

function readProofSourceTextByPath(paths) {
  return Object.fromEntries(
    paths
      .filter((path) =>
        /^tools\/read-only-mcp-invalid-token-challenge.*\.mjs$/u.test(path),
      )
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
  return existsSync(path) ? readFileSync(path, "utf8") : undefined;
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
