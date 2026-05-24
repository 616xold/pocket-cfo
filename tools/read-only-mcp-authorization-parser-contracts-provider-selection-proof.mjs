import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH,
  FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
  FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
  FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH,
  FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PATH,
  FP0145_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_PLAN_PATH,
  FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PATH,
  MCP_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_SCHEMA_VERSION,
  buildFp0146AuthorizationParserContractsProviderSelectionProof,
  sanitizeProofOnlyNoTokenLeakageFixtureText,
  scanTokenValidationNoLeakage,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary,
  verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary,
  verifyFp0142RouteIntegrationSequencingPlanBoundary,
  verifyFp0143AbsentOrInvalidTokenAppConstructionWiring,
  verifyFp0144ProductionTokenValidationSequencingPlanBoundary,
  verifyFp0145TokenValidationRuntimeProofHardeningPlanBoundary,
  verifyFp0146AbsentOrParserContractProviderSelectionProofPlan,
  verifyFp0146AuthorizationParserContractsProof,
  verifyFp0146ParserContractProviderSelectionProofPlanBoundary,
  verifyFp0146ParserFailureMapping,
  verifyFp0146PlanningTextRequiredTopics,
  verifyFp0147AbsentOrProviderSelectionEvidenceHardeningPlan,
  verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan,
} from "../packages/domain/src/index.ts";

const MCP_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const METADATA_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const FP0100_PLAN =
  "plans/FP-0100-read-only-chatgpt-app-mcp-public-app-security-boundary-contracts-foundation.md";
const FP0106_PLAN =
  "plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md";
const FP0107_PLAN =
  "plans/FP-0107-read-only-chatgpt-app-mcp-local-fastify-mcp-route-adapter-foundation.md";
const FP0125_PLAN =
  "plans/FP-0125-read-only-chatgpt-app-mcp-protected-resource-metadata-local-route-implementation.md";

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const changedExecutableSource = readChangedExecutableSource(changedPaths);
const changedLeakageText = readChangedTokenLeakageText(changedPaths);
const fp0146PlanText = safeRead(
  FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PATH,
);
const fp0145PlanText = safeRead(
  FP0145_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_PLAN_PATH,
);
const fp0144PlanText = safeRead(
  FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PATH,
);
const fp0143PlanText = safeRead(
  FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH,
);
const routeSource = safeRead(MCP_ROUTE_PATH);
const metadataRouteSource = safeRead(METADATA_ROUTE_PATH);
const parserProof =
  buildFp0146AuthorizationParserContractsProviderSelectionProof();
const planTopics = verifyFp0146PlanningTextRequiredTopics(fp0146PlanText);
const sourceScope = verifySourceScope();
const routeScope = verifyRouteScope();
const noLeakageScope = verifyNoLeakageScope(changedLeakageText);
const priorBoundaries = verifyPriorBoundaries();

const output = {
  schemaVersion:
    MCP_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_SCHEMA_VERSION,
  fp0146AbsentOrParserContractProviderSelectionProofPlanVerified:
    verifyFp0146AbsentOrParserContractProviderSelectionProofPlan({
      planText: fp0146PlanText,
      repoPaths,
    }),
  fp0147AbsentOrProviderSelectionEvidenceHardeningPlanVerified:
    verifyFp0147AbsentOrProviderSelectionEvidenceHardeningPlan(repoPaths),
  fp0148AbsentOrAuthorizationParserImplementationReadinessPlanVerified:
    verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan(
      repoPaths,
    ),
  authorizationParserContractsBoundaryVerified:
    verifyFp0146ParserContractProviderSelectionProofPlanBoundary({
      planText: fp0146PlanText,
      repoPaths,
    }) &&
    verifyFp0146AuthorizationParserContractsProof() &&
    Object.values(planTopics).every(Boolean),
  providerSelectionProofBoundaryVerified:
    parserProof.providerSelectionCriteria.length === 15 &&
    parserProof.providerMode === "provider_neutral_deferred" &&
    parserProof.noProviderCallsInThisSlice &&
    planTopics.providerSelectionCriteria,
  authorizationParserImplementationStillBlocked:
    sourceScope.noAuthorizationParser &&
    parserProof.authorizationParserImplementationCanStartAfterFp0146 === false,
  productionTokenValidationRuntimeStillBlocked:
    sourceScope.noProductionTokenValidation &&
    parserProof.productionTokenValidationRuntimeCanStartAfterFp0146 === false,
  tokenParserImplementationStillBlocked:
    sourceScope.noTokenParser &&
    parserProof.tokenParserImplementationCanStartAfterFp0146 === false,
  jwtDecoderImplementationStillBlocked:
    sourceScope.noJwtDecoder &&
    parserProof.jwtDecoderImplementationCanStartAfterFp0146 === false,
  jwksFetchImplementationStillBlocked:
    sourceScope.noJwksFetch &&
    parserProof.jwksFetchingCachingImplementationCanStartAfterFp0146 === false,
  tokenIntrospectionImplementationStillBlocked:
    sourceScope.noTokenIntrospection &&
    parserProof.tokenIntrospectionImplementationCanStartAfterFp0146 === false,
  oauthImplementationStillBlocked:
    sourceScope.noOauthImplementation &&
    parserProof.oauthSessionAuthMiddlewareCanStartAfterFp0146 === false,
  tokenSessionStorageStillBlocked: sourceScope.noTokenSessionStorage,
  authMiddlewareStillBlocked: sourceScope.noAuthMiddleware,
  routeBehaviorStillUnchanged: routeScope.noRouteBehaviorChange,
  missingTokenBehaviorStillUnchanged: routeScope.noMissingTokenBehaviorChange,
  invalidTokenChallengeBehaviorStillUnchanged:
    routeScope.noInvalidTokenChallengeBehaviorChange,
  protectedResourceMetadataRouteStillUnchanged:
    routeScope.noProtectedResourceMetadataRouteBehaviorChange,
  noRawAuthorizationHeaderInContracts:
    parserProof.futureParserInputContract
      .contractRetainsRawAuthorizationHeader === false &&
    parserProof.sanitizedParserOutputContract.no_raw_header_retained === true,
  noRawTokenMaterialInContracts:
    parserProof.futureParserInputContract.contractRetainsRawTokenMaterial ===
      false &&
    parserProof.sanitizedParserOutputContract.no_raw_token_retained === true &&
    noLeakageScope.noRawTokenMaterialInContracts,
  noTokenDerivedFingerprintInContracts:
    parserProof.futureParserInputContract
      .contractRetainsTokenDerivedFingerprint === false &&
    parserProof.sanitizedParserOutputContract
      .no_token_derived_fingerprint_retained === true,
  noTokenPrefixSuffixLengthHashDigestClaimsInContracts:
    noForbiddenTokenDerivedFieldsInAllowedOutput(),
  parserFailureStatesMappedToFp0139:
    verifyFp0146ParserFailureMapping() && planTopics.failureStatesMapped,
  missingTokenStillFp0130Lane:
    parserProof.preservesFp0130MissingTokenLane &&
    planTopics.priorPosturePreserved,
  invalidTokenChallengeStillDownstreamOfFp0139:
    parserProof.preservesInvalidTokenChallengeDownstreamOfFp0139 &&
    planTopics.priorPosturePreserved,
  providerNeutralOrExplicitEvidenceDecisionRecorded:
    parserProof.providerMode === "provider_neutral_deferred" &&
    planTopics.providerNeutralDeferred,
  providerSelectionCriteriaRecorded:
    parserProof.providerSelectionCriteria.length === 15 &&
    planTopics.providerSelectionCriteria,
  noRealTokenExamplesFromFp0146: noLeakageScope.noRealTokenExamples,
  noJwtLikeExamplesFromFp0146: noLeakageScope.noJwtLikeExamples,
  noBearerTokenMaterialFromFp0146: noLeakageScope.noBearerTokenMaterial,
  noTokenEchoLoggingFromFp0146:
    noLeakageScope.noTokenEchoLogging && sourceScope.noTokenLogging,
  noOpenAiApiCallsFromFp0146: sourceScope.noOpenAiApiCalls,
  noModelCallsFromFp0146: sourceScope.noModelCalls,
  noProviderCallsFromFp0146: sourceScope.noProviderCalls,
  noSourceMutationFromFp0146: sourceScope.noSourceMutation,
  noFinanceWriteFromFp0146: sourceScope.noFinanceWrite,
  noExternalCommunicationsFromFp0146: sourceScope.noExternalCommunications,
  noPublicAssetsFromFp0146: sourceScope.noPublicAssets,
  noGeneratedPublicProseFromFp0146: sourceScope.noGeneratedPublicProse,
  noAppSubmissionFromFp0146: sourceScope.noAppSubmission,
  fp0145CloseoutFreshnessVerified: verifyFp0145CloseoutFreshness(),
  fp0145RuntimeContractsBoundaryStillVerified:
    priorBoundaries.fp0145RuntimeContractsBoundaryStillVerified,
  fp0144ProductionTokenValidationSequencingBoundaryStillVerified:
    priorBoundaries.fp0144ProductionTokenValidationSequencingBoundaryStillVerified,
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
  proofDetails: {
    changedPathScope,
    noLeakageScope,
    parserProof,
    planTopics,
    priorBoundaries,
    routeScope,
    sourceScope,
  },
};

const proofOutputLeakageScan = scanTokenValidationNoLeakage(
  JSON.stringify(output),
);

for (const [key, value] of Object.entries(output)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0146 authorization parser contract proof failed: ${key}`,
    );
  }
}
if (!proofOutputLeakageScan.accepted) {
  throw new Error(
    `FP-0146 proof output leaked token material: ${proofOutputLeakageScan.rejectionReasons.join(", ")}`,
  );
}

console.log(JSON.stringify(output, null, 2));

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
    noFinanceWrite:
      !/\b(?:writeFinanceTwin|updateLedger|financeWrite|postLedger|createJournalEntry)\s*\(/u.test(
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
    noProductionTokenValidation:
      !/\b(?:validateToken|verifyToken|tokenValidator|jwtVerify|verifyJwt|validateBearer|verifyBearer)\s*\(/u.test(
        changedExecutableSource,
      ),
    noProviderCalls:
      !/\b(?:providerConnect|callProvider|createProviderJob|deploy|sendEmail|sendReport|contactCustomer|externalMessage)\s*\(/u.test(
        changedExecutableSource,
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
    noExternalCommunications:
      !/\b(?:sendEmail|sendReport|contactCustomer|externalMessage|publishListing|submitApp)\s*\(/u.test(
        changedExecutableSource,
      ),
    noGeneratedPublicProse:
      !/\b(?:generateListingCopy|generatePublicProse|appStoreCopy|marketingCopy)\s*\(/u.test(
        changedExecutableSource,
      ),
    noAppSubmission:
      !/\b(?:submitApp|createAppSubmission|submissionDraft|appSubmission)\s*\(/u.test(
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
  };
}

function verifyRouteScope() {
  return {
    localMcpRouteShape:
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1,
    metadataRouteShape:
      countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
      (metadataRouteSource.includes(
        '"/.well-known/oauth-protected-resource/mcp"',
      ) ||
        metadataRouteSource.includes(
          "MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH",
        )),
    noInvalidTokenChallengeBehaviorChange:
      !changedPaths.includes(MCP_ROUTE_PATH) &&
      !changedPaths.includes(
        "apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts",
      ),
    noMissingTokenBehaviorChange:
      !changedPaths.includes(MCP_ROUTE_PATH) &&
      routeSource.includes(
        "readOnlyAppMcpLocalProofGatedMissingTokenChallenge",
      ) &&
      routeSource.includes(
        "buildMcpWwwAuthenticateMissingTokenChallengeResponse",
      ),
    noProtectedResourceMetadataRouteBehaviorChange:
      !changedPaths.includes(METADATA_ROUTE_PATH) &&
      countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
      metadataRouteSource.includes(
        "READ_ONLY_APP_MCP_PROTECTED_RESOURCE_METADATA_ROUTE_PATH",
      ) &&
      metadataRouteSource.includes("serializeBoundedMetadataDocument"),
    noRouteBehaviorChange:
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1,
  };
}

function verifyNoLeakageScope(text) {
  const leakageScan = scanTokenValidationNoLeakage(text);
  const changedTokenExampleScan = scanChangedTokenExamples(text);
  return {
    leakageScan,
    noBearerTokenMaterial:
      leakageScan.accepted && changedTokenExampleScan.noBearerTokenMaterial,
    noJwtLikeExamples:
      leakageScan.accepted && changedTokenExampleScan.noJwtLikeExamples,
    noRawTokenMaterialInContracts:
      leakageScan.accepted && changedTokenExampleScan.noRealTokenExamples,
    noRealTokenExamples:
      leakageScan.accepted && changedTokenExampleScan.noRealTokenExamples,
    noTokenEchoLogging: !hasTokenLoggingRuntime(changedExecutableSource),
  };
}

function noForbiddenTokenDerivedFieldsInAllowedOutput() {
  const allowedFields = Object.keys(parserProof.sanitizedParserOutputContract);
  return [
    "token_prefix",
    "token_suffix",
    "token_length",
    "token_hash",
    "token_digest",
    "token_claims",
    "decoded_header",
    "decoded_payload",
  ].every((field) => !allowedFields.includes(field));
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
    fp0139ResultEnvelopeBoundaryStillVerified:
      verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary({
        planText: safeRead(FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH),
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
    fp0144ProductionTokenValidationSequencingBoundaryStillVerified:
      verifyFp0144ProductionTokenValidationSequencingPlanBoundary({
        planText: fp0144PlanText,
        repoPaths,
      }),
    fp0145RuntimeContractsBoundaryStillVerified:
      verifyFp0145TokenValidationRuntimeProofHardeningPlanBoundary({
        planText: fp0145PlanText,
        repoPaths,
      }),
  };
}

function verifyFp0145CloseoutFreshness() {
  const normalized = normalize(fp0145PlanText);
  return (
    normalized.includes(
      "[x] 2026-05-23t22:45:59z - commit, push, and pr creation completed",
    ) &&
    normalized.includes("pr #324") &&
    normalized.includes("9f79fe0c0ce17c9ce7e1a07990324c0ef2295fd3") &&
    normalized.includes("6fd000554cbaf2afd8c33b0a986ee656612fc4f3") &&
    normalized.includes("same-branch qa corrected `plugins.md` only") &&
    normalized.includes("no post-merge qa is required")
  );
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
  return sanitizeProofOnlyNoTokenLeakageFixtureText(
    paths
      .filter((path) => /\.(?:md|mdx|txt|ts|tsx|js|mjs|cjs)$/u.test(path))
      .filter((path) => existsSync(path))
      .map((path) => `# ${path}\n${readAddedLinesOrFullFile(path)}`)
      .join("\n"),
  );
}

function readAddedLinesOrFullFile(path) {
  const additions = [
    readDiffAdditions([
      "diff",
      "--unified=0",
      "origin/main...HEAD",
      "--",
      path,
    ]),
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

function countMatches(value, pattern) {
  return value.match(pattern)?.length ?? 0;
}

function normalize(text) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
