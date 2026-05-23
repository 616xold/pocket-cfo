import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import {
  FP0127_WWW_AUTHENTICATE_AUTH_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0128_TOKEN_VALIDATION_READINESS_CONTRACTS_PLAN_PATH,
  FP0129_WWW_AUTHENTICATE_CHALLENGE_IMPLEMENTATION_SEQUENCING_PLAN_PATH,
  FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0131_TOKEN_VALIDATION_RUNTIME_SEQUENCING_PLAN_PATH,
  FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH,
  FP0118_PROTECTED_RESOURCE_METADATA_PLAN_PATH,
  FP0120_CANONICAL_RESOURCE_AUTH_SERVER_PLAN_PATH,
  FP0122_PROTECTED_RESOURCE_METADATA_BUILDER_PLAN_PATH,
  FP0123_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_PLAN_PATH,
  scanTokenValidationNoLeakage,
  verifyFp0118ProtectedResourceMetadataPlanBoundary,
  verifyFp0120CanonicalResourceAuthServerPlanBoundary,
  verifyFp0122ProtectedResourceMetadataBuilderContractsBoundary,
  verifyFp0123ProtectedResourceMetadataRouteInputContractsBoundary,
  verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary,
  verifyFp0128TokenValidationReadinessContractsBoundary,
  verifyFp0129WwwAuthenticateChallengeImplementationSequencingPlanBoundary,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0131AbsentOrDocsOnlyTokenValidationRuntimeSequencingPlan,
  verifyFp0131PlanningTextRequiredTopics,
  verifyFp0131TokenValidationRuntimeSequencingPlanBoundary,
  verifyFp0132AbsentOrLocalTokenValidationRuntimeContracts,
  verifyFp0132TokenValidationRuntimeContractsBoundary,
  verifyFp0133AbsentOrLocalTokenValidationTestDoubleContracts,
  verifyFp0134AbsentOrLocalTokenValidationTestDoubleImplementation,
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
const changedPaths = changedFilePaths();
const fp0131PlanText = safeRead(
  FP0131_TOKEN_VALIDATION_RUNTIME_SEQUENCING_PLAN_PATH,
);
const fp0132PlanText = safeRead(
  FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH,
);
const changedExecutableSource = changedPaths
  .filter((path) => /\.(?:ts|tsx|js|mjs|cjs)$/u.test(path))
  .filter((path) => !/\.spec\.ts$/u.test(path))
  .map(safeRead)
  .join("\n");
const planTopicProof = verifyFp0131PlanningTextRequiredTopics(fp0131PlanText);
const sourceProof = verifySourceAndScope();
const leakageProof = verifyNoTokenLeakage();

const proof = {
  schemaVersion:
    "v2ay.read-only-app-mcp-token-validation-runtime-sequencing-proof.v1",
  localProofOnly: true,
  docsAndPlanProofGateOnly: true,
  fp0131AbsentOrDocsOnlyTokenValidationRuntimeSequencingPlanVerified:
    verifyFp0131AbsentOrDocsOnlyTokenValidationRuntimeSequencingPlan({
      planText: fp0131PlanText,
      repoPaths,
    }),
  fp0132AbsentOrLocalTokenValidationRuntimeContractsVerified:
    verifyFp0132AbsentOrLocalTokenValidationRuntimeContracts({
      planText: fp0132PlanText,
      repoPaths,
    }),
  fp0133AbsentOrLocalTokenValidationTestDoubleContractsVerified:
    verifyFp0133AbsentOrLocalTokenValidationTestDoubleContracts(repoPaths),
  fp0134BoundaryVerified: verifyFp0134AbsentOrLocalTokenValidationTestDoubleImplementation(repoPaths),
  tokenValidationRuntimeContractsFoundationVerified:
    verifyFp0132TokenValidationRuntimeContractsBoundary({
      planText: fp0132PlanText,
      repoPaths,
    }),
  noMcpRouteBehaviorChangeFromFp0132:
    !changedPaths.includes(MCP_ROUTE_PATH) ||
    fp0141RouteDependencyBridgeVerified(),
  noProtectedResourceMetadataRouteBehaviorChangeFromFp0132:
    !changedPaths.includes(METADATA_ROUTE_PATH),
  noMissingTokenChallengeBehaviorChangeFromFp0132:
    !changedPaths.includes(MISSING_TOKEN_HELPER_PATH) &&
    (!changedPaths.includes(MCP_ROUTE_PATH) ||
      fp0141RouteDependencyBridgeVerified()),
  noInvalidTokenChallengeRuntimeFromFp0132:
    sourceProof.noInvalidTokenChallengeRuntimeFromFp0131,
  noTokenParsingRuntimeFromFp0132: sourceProof.noTokenParsingRuntimeFromFp0131,
  noTokenValidationRuntimeFromFp0132:
    sourceProof.noTokenValidationRuntimeFromFp0131,
  noJwtDecodingRuntimeFromFp0132: sourceProof.noTokenParsingRuntimeFromFp0131,
  noTokenSessionStorageFromFp0132: sourceProof.noTokenSessionStorageFromFp0131,
  noOauthImplementationFromFp0132: sourceProof.noOauthImplementationFromFp0131,
  noAuthMiddlewareImplementationFromFp0132:
    sourceProof.noAuthMiddlewareImplementationFromFp0131,
  noDbQueriesFromFp0132: sourceProof.noDbQueriesFromFp0131,
  noSchemaMigrationsFromFp0132: sourceProof.noSchemaMigrationsFromFp0131,
  noPackageScriptsFromFp0132: sourceProof.noPackageScriptsFromFp0131,
  noOpenAiApiCallsFromFp0132: sourceProof.noOpenAiApiCallsFromFp0131,
  noProviderExternalCallsFromFp0132:
    sourceProof.noProviderExternalCallsFromFp0131,
  noSourceMutationFinanceWriteFromFp0132:
    sourceProof.noSourceMutationFinanceWriteFromFp0131,
  noPublicAssetsSubmissionArtifactsFromFp0132:
    sourceProof.noPublicAssetsSubmissionArtifactsFromFp0131,
  tokenValidationRuntimeSequencingPlanBoundaryVerified:
    verifyFp0131TokenValidationRuntimeSequencingPlanBoundary({
      planText: fp0131PlanText,
      repoPaths,
    }),
  noMcpRouteBehaviorChangeFromFp0131:
    sourceProof.noMcpRouteBehaviorChangeFromFp0131 &&
    localMcpRouteShapeStillVerified(),
  noProtectedResourceMetadataRouteBehaviorChangeFromFp0131:
    sourceProof.noProtectedResourceMetadataRouteBehaviorChangeFromFp0131 &&
    metadataRouteShapeStillVerified(),
  noMissingTokenChallengeBehaviorChangeFromFp0131:
    sourceProof.noMissingTokenChallengeBehaviorChangeFromFp0131,
  noInvalidTokenChallengeRuntimeFromFp0131:
    sourceProof.noInvalidTokenChallengeRuntimeFromFp0131,
  noTokenParsingRuntimeFromFp0131: sourceProof.noTokenParsingRuntimeFromFp0131,
  noTokenValidationRuntimeFromFp0131:
    sourceProof.noTokenValidationRuntimeFromFp0131,
  noTokenSessionStorageFromFp0131: sourceProof.noTokenSessionStorageFromFp0131,
  noOauthImplementationFromFp0131: sourceProof.noOauthImplementationFromFp0131,
  noAuthMiddlewareImplementationFromFp0131:
    sourceProof.noAuthMiddlewareImplementationFromFp0131,
  noDbQueriesFromFp0131: sourceProof.noDbQueriesFromFp0131,
  noSchemaMigrationsFromFp0131: sourceProof.noSchemaMigrationsFromFp0131,
  noPackageScriptsFromFp0131: sourceProof.noPackageScriptsFromFp0131,
  noOpenAiApiCallsFromFp0131: sourceProof.noOpenAiApiCallsFromFp0131,
  noProviderExternalCallsFromFp0131:
    sourceProof.noProviderExternalCallsFromFp0131,
  noSourceMutationFinanceWriteFromFp0131:
    sourceProof.noSourceMutationFinanceWriteFromFp0131,
  noPublicAssetsSubmissionArtifactsFromFp0131:
    sourceProof.noPublicAssetsSubmissionArtifactsFromFp0131,
  fp0130MissingTokenChallengeBoundaryStillVerified:
    verifyFp0130LocalMissingTokenChallengeImplementationBoundary({
      planText: safeRead(
        FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
      ),
      repoPaths,
    }),
  fp0128TokenValidationReadinessBoundaryStillVerified:
    verifyFp0128TokenValidationReadinessContractsBoundary({
      planText: safeRead(FP0128_TOKEN_VALIDATION_READINESS_CONTRACTS_PLAN_PATH),
      repoPaths,
    }),
  fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified:
    verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary({
      planText: safeRead(
        FP0127_WWW_AUTHENTICATE_AUTH_CHALLENGE_CONTRACTS_PLAN_PATH,
      ),
      repoPaths,
    }),
  fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
    metadataRouteShapeStillVerified() &&
    docsBoundary(FP0125_PLAN, [
      "local-only/read-only",
      "/.well-known/oauth-protected-resource/mcp",
      "unchanged `/mcp`",
    ]),
  fp0123ProtectedResourceMetadataRouteInputBoundaryStillVerified:
    verifyFp0123ProtectedResourceMetadataRouteInputContractsBoundary({
      planText: safeRead(
        FP0123_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_PLAN_PATH,
      ),
      repoPaths,
    }),
  fp0122ProtectedResourceMetadataBuilderBoundaryStillVerified:
    verifyFp0122ProtectedResourceMetadataBuilderContractsBoundary({
      planText: safeRead(FP0122_PROTECTED_RESOURCE_METADATA_BUILDER_PLAN_PATH),
      repoPaths,
    }),
  fp0120CanonicalResourceAuthServerBoundaryStillVerified:
    verifyFp0120CanonicalResourceAuthServerPlanBoundary({
      planText: safeRead(FP0120_CANONICAL_RESOURCE_AUTH_SERVER_PLAN_PATH),
      repoPaths,
    }),
  fp0118ProtectedResourceMetadataBoundaryStillVerified:
    verifyFp0118ProtectedResourceMetadataPlanBoundary({
      planText: safeRead(FP0118_PROTECTED_RESOURCE_METADATA_PLAN_PATH),
      repoPaths,
    }),
  fp0107RouteAdapterBoundaryStillVerified:
    localMcpRouteShapeStillVerified() &&
    docsBoundary(FP0107_PLAN, ["local/control-plane", "post /mcp"]),
  fp0106ProtocolEnvelopeBoundaryStillVerified: docsBoundary(FP0106_PLAN, [
    "mcp protocol envelope",
    "tools/call",
    "no openai api/model calls",
  ]),
  fp0100PublicSecurityBoundaryStillVerified: docsBoundary(FP0100_PLAN, [
    "public-app security boundary",
    "local/proof-only",
    "no endpoints",
  ]),
  planningTextCoversInvalidTokenSequencing:
    planTopicProof.invalidTokenSequencing,
  planningTextCoversSemanticFailureCases: planTopicProof.failureTaxonomy,
  planningTextCoversNoTokenPassthrough: planTopicProof.noTokenPassthrough,
  planningTextCoversNoTokenLeakage:
    planTopicProof.noTokenLeakage && leakageProof.verified,
  planningTextCoversAuthenticatedCompanyBinding:
    planTopicProof.authenticatedCompanyBinding,
  planningTextCoversFutureInterfaces: planTopicProof.futureInterfaces,
  planningTextCoversFutureFp0132Gate: planTopicProof.fp0132Gate,
};

for (const [key, value] of Object.entries(proof)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(`FP-0131 runtime sequencing proof failed: ${key}`);
  }
}

console.log(
  JSON.stringify(
    {
      ...proof,
      proofDetails: {
        changedPaths,
        leakageProof,
        planTopics: planTopicProof,
        sourceProof,
      },
    },
    null,
    2,
  ),
);

function verifySourceAndScope() {
  const routePathsChanged = changedPaths.some((path) =>
    /^apps\/control-plane\/src\/modules\/read-only-app-mcp-endpoint\/.*\.ts$/u.test(
      path,
    ),
  );
  const forbiddenRuntimePattern =
    /\b(?:decodeToken|parseToken|parseJwt|decodeJwt|jwtDecode|introspectToken|validateToken|verifyToken|tokenValidator|jwtVerify|verifyJwt|validateBearer|verifyBearer|authMiddleware|authorizationMiddleware|routeGuard|requireAuth|authenticateRequest|tokenStore|sessionStore|refreshTokenStore|setCookie|oauthCallback|authorizeUrl|tokenExchange|authorizationCode|pkceVerifier)\s*\(/u;
  const invalidTokenRuntimePattern =
    /\b(?:invalidTokenChallenge|malformedToken|expiredToken|wrongAudience|wrongResource|wrongScope|wrongOrg|revokedToken|replayedToken)\s*\(/u;

  return {
    noAuthMiddlewareImplementationFromFp0131:
      !/\b(?:authMiddleware|authorizationMiddleware|routeGuard|requireAuth|authenticateRequest|setCookie)\s*\(/u.test(
        changedExecutableSource,
      ),
    noDbQueriesFromFp0131:
      !changedPaths.some((path) => /^packages\/db\//u.test(path)) &&
      !/\b(?:from\s+["']drizzle|drizzle\s*\(|select\s*\(|insert\s*\(|update\s*\(|delete\s*\(|sql`)\b/u.test(
        changedExecutableSource,
      ),
    noInvalidTokenChallengeRuntimeFromFp0131: !invalidTokenRuntimePattern.test(
      changedExecutableSource,
    ),
    noMcpRouteBehaviorChangeFromFp0131:
      !changedPaths.includes(MCP_ROUTE_PATH) ||
      fp0141RouteDependencyBridgeVerified(),
    noMissingTokenChallengeBehaviorChangeFromFp0131:
      !changedPaths.includes(MISSING_TOKEN_HELPER_PATH) &&
      (!changedPaths.includes(MCP_ROUTE_PATH) ||
        fp0141RouteDependencyBridgeVerified()),
    noOauthImplementationFromFp0131:
      !/\b(?:oauthCallback|authorizeUrl|tokenExchange|authorizationCode|pkceVerifier)\s*\(/u.test(
        changedExecutableSource,
      ),
    noOpenAiApiCallsFromFp0131:
      !/\b(?:OpenAI|openai|responses\.create|chat\.completions|files\.create)\s*\(/u.test(
        changedExecutableSource,
      ),
    noPackageScriptsFromFp0131:
      !changedPaths.includes("package.json") &&
      !changedPaths.some((path) => /\/package\.json$/u.test(path)),
    noProtectedResourceMetadataRouteBehaviorChangeFromFp0131:
      !changedPaths.includes(METADATA_ROUTE_PATH),
    noProviderExternalCallsFromFp0131:
      !/\b(?:providerConnect|callProvider|createProviderJob|sendEmail|sendReport|contactCustomer|externalMessage)\s*\(/u.test(
        changedExecutableSource,
      ),
    noPublicAssetsSubmissionArtifactsFromFp0131: !changedPaths.some((path) =>
      /(?:app-submission|submission-assets|public-listing|store-listing|listing-copy|screenshots|\.(?:png|jpe?g|gif|webp|svg|ico|avif|mp4|mov|pdf)$)/iu.test(
        path,
      ),
    ),
    noSchemaMigrationsFromFp0131: !changedPaths.some(
      (path) =>
        /^packages\/db\//u.test(path) ||
        /(?:^|\/)migrations?\//iu.test(path) ||
        /\.sql$/iu.test(path),
    ),
    noSourceMutationFinanceWriteFromFp0131:
      !/\b(?:uploadSource|mutateSource|rewriteSource|deleteSource|writeFinanceTwin|updateLedger|financeWrite|postLedger|createJournalEntry)\s*\(/u.test(
        changedExecutableSource,
      ),
    noTokenParsingRuntimeFromFp0131:
      !/\b(?:decodeToken|parseToken|parseJwt|decodeJwt|jwtDecode|introspectToken)\s*\(/u.test(
        changedExecutableSource,
      ),
    noTokenSessionStorageFromFp0131:
      !/\b(?:tokenStore|sessionStore|refreshTokenStore|setCookie)\s*\(/u.test(
        changedExecutableSource,
      ),
    noTokenValidationRuntimeFromFp0131: !forbiddenRuntimePattern.test(
      changedExecutableSource,
    ),
    routePathsChanged,
  };
}

function verifyNoTokenLeakage() {
  const changedDocumentationText = changedDocumentationAddedLines();
  const scannedText = [fp0131PlanText, changedDocumentationText].join("\n");
  const scan = scanTokenValidationNoLeakage(scannedText);
  return {
    rejectionReasons: scan.rejectionReasons,
    verified: scan.accepted,
  };
}

function changedDocumentationAddedLines() {
  const dirtyDocPaths = new Set(worktreeStatusPaths().filter(isDocPath));
  const committedDocPaths = committedBranchDiffPaths()
    .filter(isDocPath)
    .filter((path) => !dirtyDocPaths.has(path));
  const output = [
    ...committedDocPaths.map((path) =>
      readGitOutput([
        "diff",
        "--unified=0",
        "origin/main...HEAD",
        "--",
        path,
      ]),
    ),
    ...[...dirtyDocPaths].map((path) =>
      readGitOutput(["diff", "--unified=0", "HEAD", "--", path]),
    ),
  ].join("\n");
  return output
    .split("\n")
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .map((line) => line.slice(1))
    .join("\n");
}

function isDocPath(path) {
  return /\.(?:md|mdx|txt)$/iu.test(path);
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
    !/invalidTokenChallenge\s*\)\s*\{/u.test(source) &&
    localMcpRouteShapeStillVerified()
  );
}

function localMcpRouteShapeStillVerified() {
  const source = safeRead(MCP_ROUTE_PATH);
  return (
    countMatches(source, /app\.post\("\/mcp"/gu) === 1 &&
    countMatches(source, /app\.get\("\/mcp"/gu) === 1 &&
    source.includes("readOnlyAppMcpLocalProofGatedMissingTokenChallenge") &&
    source.includes('.header("WWW-Authenticate", challenge.wwwAuthenticate)')
  );
}

function metadataRouteShapeStillVerified() {
  const source = safeRead(METADATA_ROUTE_PATH);
  return (
    (source.includes("/.well-known/oauth-protected-resource/mcp") ||
      source.includes("MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH")) &&
    source.includes("registerReadOnlyAppMcpProtectedResourceMetadataRoute") &&
    !/WWW-Authenticate/iu.test(source) &&
    !/app\.post|app\.put|app\.patch|app\.delete/iu.test(source)
  );
}

function docsBoundary(path, requiredTexts) {
  const normalized = safeRead(path).toLowerCase().replace(/\s+/gu, " ");
  return requiredTexts.every((text) => normalized.includes(text));
}

function changedFilePaths() {
  return [...new Set([...committedBranchDiffPaths(), ...worktreeStatusPaths()])]
    .filter(Boolean)
    .sort();
}

function committedBranchDiffPaths() {
  return readGitOutput(["diff", "--name-only", "origin/main...HEAD"])
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function worktreeStatusPaths() {
  return readGitOutput(["status", "--short", "--untracked-files=all"])
    .split("\n")
    .filter((line) => line.trim())
    .map((line) =>
      line
        .replace(/^[A-Z?! ]{1,2}\s+/u, "")
        .replace(/.* -> /u, "")
        .trim(),
    )
    .filter(Boolean);
}

function readGitOutput(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" });
  } catch {
    return "";
  }
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

function safeRead(path) {
  return readFileSync(path, "utf8");
}

function countMatches(source, pattern) {
  return Array.from(source.matchAll(pattern)).length;
}
