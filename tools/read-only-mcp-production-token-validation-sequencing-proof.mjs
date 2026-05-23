import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH,
  FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
  FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
  FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
  FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH,
  FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PATH,
  MCP_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_SCHEMA_VERSION,
  scanTokenValidationNoLeakage,
  verifyExactTokenValidationResultEnvelopeFailureTaxonomy,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0136InvalidTokenChallengeContractsBoundary,
  verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary,
  verifyFp0140InvalidTokenChallengeImplementationPlanningBoundary,
  verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary,
  verifyFp0142RouteIntegrationSequencingPlanBoundary,
  verifyFp0143AbsentOrInvalidTokenAppConstructionWiring,
  verifyFp0144AbsentOrDocsOnlyProductionTokenValidationSequencingPlan,
  verifyFp0144FailureStateMapping,
  verifyFp0144PlanningTextRequiredTopics,
  verifyFp0144ProductionTokenValidationSequencingPlanBoundary,
  verifyFp0145AbsentOrContractOnlyTokenValidationRuntimeProofHardeningPlan,
  verifyFp0146AbsentOrParserContractProviderSelectionProofPlan,
  verifyMcpInvalidTokenChallengeContractBoundaries,
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
const changedTokenLeakageText = readChangedTokenLeakageText(changedPaths);
const routeSource = safeRead(MCP_ROUTE_PATH);
const metadataRouteSource = safeRead(METADATA_ROUTE_PATH);
const fp0144PlanText = safeRead(
  FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PATH,
);
const fp0145PlanText = safeReadIfExists(
  "plans/FP-0145-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-proof-hardening.md",
);
const fp0143PlanText = safeRead(
  FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH,
);
const planTopics = verifyFp0144PlanningTextRequiredTopics(fp0144PlanText);
const sourceScope = verifySourceScope();
const routeScope = verifyRouteScope();
const priorBoundaries = verifyPriorBoundaries();
const changedTokenExampleScan = scanChangedTokenExamples(
  changedTokenLeakageText,
);
const planLeakageScan = scanTokenValidationNoLeakage(fp0144PlanText);
const changedLeakageScan = scanTokenValidationNoLeakage(
  changedTokenLeakageText,
);

const output = {
  schemaVersion: MCP_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_SCHEMA_VERSION,
  fp0144AbsentOrDocsOnlyProductionTokenValidationSequencingPlanVerified:
    verifyFp0144AbsentOrDocsOnlyProductionTokenValidationSequencingPlan({
      planText: fp0144PlanText,
      repoPaths,
    }),
  fp0145AbsentOrContractOnlyTokenValidationRuntimeProofHardeningPlanVerified:
    verifyFp0145AbsentOrContractOnlyTokenValidationRuntimeProofHardeningPlan({
      planText: fp0145PlanText,
      repoPaths,
    }),
  fp0146AbsentOrParserContractProviderSelectionProofPlanVerified:
    verifyFp0146AbsentOrParserContractProviderSelectionProofPlan(repoPaths),
  productionTokenValidationSequencingPlanBoundaryVerified:
    verifyFp0144ProductionTokenValidationSequencingPlanBoundary({
      planText: fp0144PlanText,
      repoPaths,
    }) && Object.values(planTopics).every(Boolean),
  noProductionTokenValidationFromFp0144:
    sourceScope.noProductionTokenValidation,
  noAuthorizationParserFromFp0144: sourceScope.noAuthorizationParser,
  noTokenParserFromFp0144: sourceScope.noTokenParser,
  noJwtDecoderFromFp0144: sourceScope.noJwtDecoder,
  noTokenIntrospectionFromFp0144: sourceScope.noTokenIntrospection,
  noJwksFetchFromFp0144: sourceScope.noJwksFetch,
  noOauthImplementationFromFp0144: sourceScope.noOauthImplementation,
  noTokenSessionStorageFromFp0144: sourceScope.noTokenSessionStorage,
  noAuthMiddlewareFromFp0144: sourceScope.noAuthMiddleware,
  noRouteBehaviorChangeFromFp0144: routeScope.noRouteBehaviorChange,
  noMissingTokenBehaviorChangeFromFp0144:
    routeScope.noMissingTokenBehaviorChange,
  noInvalidTokenChallengeBehaviorChangeFromFp0144:
    routeScope.noInvalidTokenChallengeBehaviorChange,
  noProtectedResourceMetadataRouteBehaviorChangeFromFp0144:
    routeScope.noProtectedResourceMetadataRouteBehaviorChange,
  noDbQueriesFromFp0144: sourceScope.noDbQueriesAdded,
  noSchemaMigrationsFromFp0144: sourceScope.noSchemaMigrationsAdded,
  noPackageScriptsFromFp0144: sourceScope.noPackageScriptsAdded,
  noRealTokenExamplesFromFp0144:
    planLeakageScan.accepted &&
    changedLeakageScan.accepted &&
    changedTokenExampleScan.noRealTokenExamples,
  noJwtLikeExamplesFromFp0144:
    planLeakageScan.accepted &&
    changedLeakageScan.accepted &&
    changedTokenExampleScan.noJwtLikeExamples,
  noBearerTokenMaterialFromFp0144:
    planLeakageScan.accepted &&
    changedLeakageScan.accepted &&
    changedTokenExampleScan.noBearerTokenMaterial,
  noTokenEchoLoggingFromFp0144:
    planTopics.noTokenLeakage && sourceScope.noTokenLogging,
  noOpenAiApiCallsFromFp0144: sourceScope.noOpenAiApiCalls,
  noModelCallsFromFp0144: sourceScope.noModelCalls,
  noProviderCallsFromFp0144: sourceScope.noProviderExternalCalls,
  noSourceMutationFromFp0144: sourceScope.noSourceMutation,
  noFinanceWriteFromFp0144: sourceScope.noFinanceWrite,
  noExternalCommunicationsFromFp0144: sourceScope.noExternalCommunications,
  noPublicAssetsFromFp0144: sourceScope.noPublicAssets,
  noGeneratedPublicProseFromFp0144: sourceScope.noGeneratedPublicProse,
  noAppSubmissionFromFp0144: sourceScope.noAppSubmission,
  fp0143InvalidTokenAppWiringBoundaryStillVerified:
    priorBoundaries.fp0143InvalidTokenAppWiringBoundaryStillVerified,
  fp0142RouteIntegrationSequencingBoundaryStillVerified:
    priorBoundaries.fp0142RouteIntegrationSequencingBoundaryStillVerified,
  fp0141InvalidTokenLocalRuntimeBoundaryStillVerified:
    priorBoundaries.fp0141InvalidTokenLocalRuntimeBoundaryStillVerified,
  fp0139ResultEnvelopeBoundaryStillVerified:
    priorBoundaries.fp0139ResultEnvelopeBoundaryStillVerified,
  fp0130MissingTokenChallengeBoundaryStillVerified:
    priorBoundaries.fp0130MissingTokenChallengeBoundaryStillVerified,
  fp0125ProtectedResourceMetadataRouteBoundaryStillVerified:
    priorBoundaries.fp0125ProtectedResourceMetadataRouteBoundaryStillVerified,
  fp0107RouteAdapterBoundaryStillVerified:
    priorBoundaries.fp0107RouteAdapterBoundaryStillVerified,
  fp0106ProtocolEnvelopeBoundaryStillVerified:
    priorBoundaries.fp0106ProtocolEnvelopeBoundaryStillVerified,
  fp0100PublicSecurityBoundaryStillVerified:
    priorBoundaries.fp0100PublicSecurityBoundaryStillVerified,
  jwtJwksVsIntrospectionProviderNeutralDecisionRecorded:
    planTopics.providerNeutralDecisionRecorded,
  authorizationParserDeferralRecorded: planTopics.authorizationParserDeferred,
  issuerAudienceResourceScopeOrgCompanyPrerequisitesRecorded:
    planTopics.prerequisiteGatesRecorded,
  fp0139ResultEnvelopeOnlyOutputContractRecorded:
    planTopics.fp0139EnvelopeOnlyContract,
  failureStateMappingToFp0139EnvelopesVerified:
    verifyFp0144FailureStateMapping() && planTopics.failureStatesMapped,
  invalidTokenChallengeDownstreamOfFp0139:
    planTopics.fp0139EnvelopeOnlyContract,
  missingTokenSeparationPreserved: planTopics.missingTokenSeparate,
  proofDetails: {
    changedPathScope,
    changedLeakageScan,
    changedTokenExampleScan,
    planLeakageScan,
    priorBoundaries,
    routeScope,
    sourceScope,
    topics: planTopics,
  },
};

const proofOutputLeakageScan = scanTokenValidationNoLeakage(
  JSON.stringify(output),
);

for (const [key, value] of Object.entries(output)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0144 production token-validation sequencing proof failed: ${key}`,
    );
  }
}
if (!proofOutputLeakageScan.accepted) {
  throw new Error(
    `FP-0144 production token-validation sequencing proof leaked token material: ${proofOutputLeakageScan.rejectionReasons.join(", ")}`,
  );
}

console.log(JSON.stringify(output, null, 2));

function verifyRouteScope() {
  const missingTokenIndex = routeSource.indexOf(
    "if (missingTokenChallenge && request.headers.authorization === undefined)",
  );
  const invalidTokenIndex = routeSource.indexOf(
    "if (invalidTokenChallenge && request.headers.authorization !== undefined)",
  );

  return {
    localMcpRouteShape:
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1,
    metadataRouteShape:
      countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
      (metadataRouteSource.includes(
        "/.well-known/oauth-protected-resource/mcp",
      ) ||
        metadataRouteSource.includes(
          "MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH",
        )) &&
      !/app\.post|app\.put|app\.patch|app\.delete/iu.test(metadataRouteSource),
    missingTokenPrecedencePreserved:
      missingTokenIndex >= 0 && invalidTokenIndex > missingTokenIndex,
    noInvalidTokenChallengeBehaviorChange:
      !changedPaths.includes(MCP_ROUTE_PATH) &&
      !changedPaths.includes(
        "apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts",
      ),
    noMissingTokenBehaviorChange:
      !changedPaths.includes(MCP_ROUTE_PATH) &&
      !changedPaths.includes(MISSING_TOKEN_HELPER_PATH),
    noProtectedResourceMetadataRouteBehaviorChange:
      !changedPaths.includes(METADATA_ROUTE_PATH) &&
      !metadataRouteSource.includes("WWW-Authenticate"),
    noRouteBehaviorChange:
      !changedPaths.includes(MCP_ROUTE_PATH) &&
      !changedPaths.includes(METADATA_ROUTE_PATH) &&
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1,
  };
}

function verifySourceScope() {
  const modelCallPattern = ["call", "Model"].join("");
  const modelCallRegex = new RegExp(
    `\\b(?:responses\\.create|chat\\.completions|model\\s*\\.\\s*create|models\\s*\\.\\s*create|${modelCallPattern})\\s*\\(`,
    "u",
  );

  return {
    noAuthMiddleware:
      !/\b(?:authMiddleware|authorizationMiddleware|routeGuard|verifyBearer|requireAuth|authenticateRequest|setCookie)\s*\(/u.test(
        changedExecutableSource,
      ),
    noAuthorizationParser:
      !/\bauthorization\s*\.\s*(?:split|replace|match|matchAll|exec|startsWith|slice|substring|toLowerCase|trim)\s*\(/iu.test(
        changedExecutableSource,
      ) &&
      !/\b(?:parseAuthorization|parseAuthHeader|authorizationParser|bearerParser)\s*\(/iu.test(
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
    noExternalCommunications:
      !/\b(?:sendEmail|sendReport|contactCustomer|externalMessage|publishListing|submitApp)\s*\(/u.test(
        changedExecutableSource,
      ),
    noGeneratedPublicProse:
      !/\b(?:generateListingCopy|generatePublicProse|appStoreCopy|marketingCopy)\s*\(/u.test(
        changedExecutableSource,
      ),
    noJwksFetch:
      !/\b(?:jwksClient|jwksUri|getSigningKey|remoteJwks|createRemoteJWKSet|fetchJwks|loadJwks)\s*\(/u.test(
        changedExecutableSource,
      ),
    noJwtDecoder:
      !/\b(?:parseJwt|decodeJwt|jwtDecode|jwtVerify|verifyJwt)\s*\(/u.test(
        changedExecutableSource,
      ),
    noModelCalls: !modelCallRegex.test(changedExecutableSource),
    noOauthImplementation:
      !/\b(?:oauthCallback|authorizeUrl|tokenExchange|authorizationCode|pkceVerifier)\s*\(/u.test(
        changedExecutableSource,
      ),
    noOpenAiApiCalls:
      !/(?:\bnew\s+OpenAI\b|\bimport\s+(?:[^;\n]*?\s+from\s+)?["']openai["']|\brequire\s*\(\s*["']openai["']\s*\)|\bresponses\s*\.\s*create\s*\(|\bchat\s*\.\s*completions\b|\bfiles\s*\.\s*create\s*\(|\bapi\.openai\.com\b)/u.test(
        changedExecutableSource,
      ),
    noPackageScriptsAdded: !changedPaths.some((path) =>
      /(?:^|\/)package\.json$/u.test(path),
    ),
    noAppSubmission:
      !/\b(?:submitApp|createAppSubmission|submissionDraft|appSubmission)\s*\(/u.test(
        changedExecutableSource,
      ),
    noProductionTokenValidation:
      !/\b(?:validateToken|verifyToken|tokenValidator|jwtVerify|verifyJwt|validateBearer|verifyBearer)\s*\(/u.test(
        changedExecutableSource,
      ),
    noProviderExternalCalls:
      !/\b(?:providerConnect|callProvider|createProviderJob|deploy|sendEmail|sendReport|contactCustomer|externalMessage)\s*\(/u.test(
        changedExecutableSource,
      ),
    noPublicAssets:
      !changedPaths.some((path) =>
        /(?:^|\/)(?:public|assets|screenshots?|app-submission|submission-assets)\//iu.test(
          path,
        ),
      ) &&
      !/\b(?:writePublicAsset|createScreenshot|generateImage|listingAsset)\s*\(/u.test(
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
    noTokenIntrospection: !/\bintrospectToken\s*\(/u.test(
      changedExecutableSource,
    ),
    noTokenLogging: !hasTokenLoggingRuntime(changedExecutableSource),
    noTokenParser:
      !/\b(?:decodeToken|parseToken|parseJwt|decodeJwt|jwtDecode|introspectToken)\s*\(/u.test(
        changedExecutableSource,
      ),
    noTokenSessionStorage:
      !/\b(?:tokenStore|sessionStore|sessionHandler|refreshTokenStore|setCookie)\s*\(/u.test(
        changedExecutableSource,
      ),
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
      verifyRouteScope().localMcpRouteShape,
    fp0125ProtectedResourceMetadataRouteBoundaryStillVerified:
      docsBoundary(FP0125_PLAN, [
        "local-only/read-only",
        "/.well-known/oauth-protected-resource/mcp",
      ]) && verifyRouteScope().metadataRouteShape,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      verifyFp0130LocalMissingTokenChallengeImplementationBoundary({
        planText: safeRead(
          FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified:
      verifyFp0136InvalidTokenChallengeContractsBoundary({
        planText: safeRead(FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH),
        repoPaths,
      }) && verifyMcpInvalidTokenChallengeContractBoundaries(),
    fp0139ResultEnvelopeBoundaryStillVerified:
      verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary({
        planText: safeRead(FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH),
        repoPaths,
      }) &&
      verifyExactTokenValidationResultEnvelopeFailureTaxonomy() &&
      verifyTokenValidationResultEnvelopeHttpPostureMapping() &&
      verifyTokenValidationResultEnvelopeBoundaryFields(),
    fp0140ImplementationPlanningBoundaryStillVerified:
      verifyFp0140InvalidTokenChallengeImplementationPlanningBoundary({
        planText: safeRead(
          FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0141InvalidTokenLocalRuntimeBoundaryStillVerified:
      verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary({
        planText: safeRead(
          FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0142RouteIntegrationSequencingBoundaryStillVerified:
      verifyFp0142RouteIntegrationSequencingPlanBoundary({
        planText: safeRead(
          FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0143InvalidTokenAppWiringBoundaryStillVerified:
      verifyFp0143AbsentOrInvalidTokenAppConstructionWiring({
        planText: fp0143PlanText,
        repoPaths,
      }),
  };
}

function scanChangedTokenExamples(text) {
  const sanitized = text
    .replaceAll("resource_metadata", "resource metadata")
    .replaceAll("WWW-Authenticate", "www authenticate");
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

function hasTokenLoggingRuntime(source) {
  const logCallPattern =
    /\b(?:console\.\w+|logger\.\w+|log|warn|debug|trace)\s*\([\s\S]{0,1200}?\);/giu;
  const sensitiveReferencePattern =
    /\b(?:rawToken|accessToken|refreshToken|idToken|tokenMaterial|authorizationHeader|rawAuthorization|bearerMaterial|jwtLikeMaterial|bearer|jwt)\b/iu;

  for (const match of source.matchAll(logCallPattern)) {
    const call = match[0];
    if (/console\.log\s*\(\s*JSON\.stringify\s*\(/u.test(call)) continue;
    if (sensitiveReferencePattern.test(call)) return true;
  }

  return false;
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

function readChangedTokenLeakageText(paths) {
  return paths
    .filter((path) => /\.(?:md|mdx|txt|ts|tsx|js|mjs|cjs)$/u.test(path))
    .filter((path) => existsSync(path))
    .map((path) => `# ${path}\n${readAddedLinesOrFullFile(path)}`)
    .join("\n");
}

function readAddedLinesOrFullFile(path) {
  const additions = [
    readDiffAdditions(["diff", "--unified=0", "origin/main...HEAD", "--", path]),
    readDiffAdditions(["diff", "--unified=0", "--", path]),
  ]
    .filter(Boolean)
    .join("\n");

  return additions || safeRead(path);
}

function readDiffAdditions(args) {
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

function repoFilePaths(dir = ".", prefix = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (
      [".git", ".next", ".turbo", "coverage", "dist", "node_modules"].includes(
        entry.name,
      )
    ) {
      return [];
    }
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return repoFilePaths(path, path);
    return [path];
  });
}

function safeRead(path) {
  return readFileSync(path, "utf8");
}

function safeReadIfExists(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : undefined;
}

function countMatches(value, pattern) {
  return value.match(pattern)?.length ?? 0;
}

function normalize(text) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
