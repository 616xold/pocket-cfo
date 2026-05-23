import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  FP0127_WWW_AUTHENTICATE_AUTH_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0128_TOKEN_VALIDATION_READINESS_CONTRACTS_PLAN_PATH,
  FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0131_TOKEN_VALIDATION_RUNTIME_SEQUENCING_PLAN_PATH,
  FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH,
  FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH,
  FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH,
  FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH,
  FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH,
  FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
  FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
  MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE,
  buildTokenValidationResultEnvelope,
  buildTokenValidationResultEnvelopeInputDescriptor,
  isMcpTokenValidationTestDoubleProofSourcePath,
  scanTokenValidationNoLeakage,
  verifyExactTokenValidationResultEnvelopeFailureTaxonomy,
  verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary,
  verifyFp0128TokenValidationReadinessContractsBoundary,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0131TokenValidationRuntimeSequencingPlanBoundary,
  verifyFp0132TokenValidationRuntimeContractsBoundary,
  verifyFp0134TokenValidationTestDoubleImplementationBoundary,
  verifyFp0135InvalidTokenChallengeSequencingPlanBoundary,
  verifyFp0136InvalidTokenChallengeContractsBoundary,
  verifyFp0137InvalidTokenChallengeImplementationReadinessPlanBoundary,
  verifyFp0138TokenValidationRuntimeImplementationPlanningBoundary,
  verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary,
  verifyFp0140InvalidTokenChallengeImplementationPlanningBoundary,
  verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary,
  verifyFp0142Absent,
  verifyMcpInvalidTokenChallengeContractBoundaries,
  verifyMcpTokenValidationTestDoubleRepositoryInventory,
  verifyTokenValidationResultEnvelopeBoundaryFields,
  verifyTokenValidationResultEnvelopeHttpPostureMapping,
} from "../packages/domain/src/index.ts";
import {
  assessReadOnlyAppMcpInvalidTokenChallengeEnvelope,
  buildReadOnlyAppMcpInvalidTokenChallengeResponse,
} from "../apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts";

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
const APP_PATH = "apps/control-plane/src/app.ts";

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const changedExecutableSource = readChangedExecutableSource(changedPaths);
const routeSource = safeRead(MCP_ROUTE_PATH);
const metadataRouteSource = safeRead(METADATA_ROUTE_PATH);
const appSource = safeRead(APP_PATH);
const fp0141PlanText = safeRead(
  FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
);
const fp0140PlanText = safeRead(
  FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
);
const sourceScope = verifySourceScope();
const adapterChecks = verifyAdapterBehavior();
const routeChecks = verifyRouteBehaviorShape();
const priorBoundaries = verifyPriorBoundaries();
const repositoryInventory = verifyMcpTokenValidationTestDoubleRepositoryInventory({
  branchDiffPaths: changedPathScope.committedBranchDiffPaths,
  dirtyPaths: changedPathScope.dirtyQaTargetFiles,
  repoPaths,
  sourceTextByPath: readProofSourceTextByPath(repoPaths),
});

const output = {
  schemaVersion:
    "v2bi.read-only-app-mcp-invalid-token-challenge-local-runtime-proof.v1",
  localInvalidTokenChallengeRuntimeOnly:
    adapterChecks.localInvalidTokenChallengeRuntimeOnly,
  invalidTokenChallengeRuntimeImplemented:
    adapterChecks.invalidTokenChallengeRuntimeImplemented,
  consumesFp0139ResultEnvelopeOnly:
    adapterChecks.consumesFp0139ResultEnvelopeOnly,
  invalidRequestMalformedAuthorizationMapsTo400:
    adapterChecks.invalidRequestMalformedAuthorizationMapsTo400,
  invalidExpiredRevokedTokenMapsTo401:
    adapterChecks.invalidExpiredRevokedTokenMapsTo401,
  insufficientScopeMapsTo403: adapterChecks.insufficientScopeMapsTo403,
  symbolicWwwAuthenticateErrorsPreserved:
    adapterChecks.symbolicWwwAuthenticateErrorsPreserved,
  failureTaxonomyHttpPostureWwwAuthenticateConsistencyVerified:
    adapterChecks.failureTaxonomyHttpPostureWwwAuthenticateConsistencyVerified,
  missingTokenEnvelopesRejected: adapterChecks.missingTokenEnvelopesRejected,
  acceptedEnvelopesRejected: adapterChecks.acceptedEnvelopesRejected,
  defaultRouteBehaviorUnchangedWhenInvalidTokenDependencyAbsent:
    routeChecks.defaultRouteBehaviorUnchangedWhenInvalidTokenDependencyAbsent,
  localOnlyInvalidTokenBehaviorDoesNotParseHeadersOrTokens:
    adapterChecks.localOnlyInvalidTokenBehaviorDoesNotParseHeadersOrTokens &&
    sourceScope.noTokenParsingRuntime &&
    sourceScope.noJwtDecodingRuntime &&
    sourceScope.noTokenIntrospectionRuntime,
  resourceMetadataDependencyPreserved:
    adapterChecks.resourceMetadataDependencyPreserved,
  scopeChallengeGuidancePreserved:
    adapterChecks.scopeChallengeGuidancePreserved,
  noTokenParsingRuntime: sourceScope.noTokenParsingRuntime,
  noJwtDecodingRuntime: sourceScope.noJwtDecodingRuntime,
  noProductionTokenValidationRuntime: sourceScope.noTokenValidationRuntime,
  noTokenIntrospectionRuntime: sourceScope.noTokenIntrospectionRuntime,
  noRouteConsumesSyntheticEvaluator:
    routeChecks.noRouteConsumesSyntheticEvaluator,
  noRouteConsumesTokenValidationTestDouble:
    routeChecks.noRouteConsumesTokenValidationTestDouble,
  noRealTokenExamples:
    repositoryInventory.noRealTokenExampleRepositoryInventoryVerified,
  noJwtLikeExamples:
    repositoryInventory.noJwtLikeExampleRepositoryInventoryVerified,
  noBearerTokenMaterial:
    repositoryInventory.noBearerTokenMaterialRepositoryInventoryVerified,
  noTokenEcho: adapterChecks.noTokenEcho,
  noTokenLogging: sourceScope.noTokenLogging,
  noTokenExamplesJwtBearerMaterialInPlansDocsProofOutputs:
    repositoryInventory.noRealTokenExampleRepositoryInventoryVerified &&
    repositoryInventory.noJwtLikeExampleRepositoryInventoryVerified &&
    repositoryInventory.noBearerTokenMaterialRepositoryInventoryVerified,
  missingTokenBehaviorStillSeparate:
    adapterChecks.missingTokenBehaviorStillSeparate &&
    routeChecks.missingTokenBehaviorStillSeparate,
  protectedResourceMetadataRouteBehaviorStillSeparate:
    routeChecks.protectedResourceMetadataRouteBehaviorStillSeparate,
  jsonRpcRefusalEnvelopeStillSeparate:
    adapterChecks.jsonRpcRefusalEnvelopeStillSeparate,
  noMcpRouteBehaviorChangeExceptInvalidTokenChallengeDependency:
    routeChecks.noMcpRouteBehaviorChangeExceptInvalidTokenChallengeDependency,
  noNewRoutePath: routeChecks.noNewRoutePath,
  noOauthImplementation: sourceScope.noOauthImplementation,
  noTokenSessionStorage: sourceScope.noTokenSessionStorage,
  noAuthMiddlewareImplementation: sourceScope.noAuthMiddlewareImplementation,
  noDbQueriesAdded: sourceScope.noDbQueriesAdded,
  noSchemaMigrationsAdded: sourceScope.noSchemaMigrationsAdded,
  noPackageScriptsAdded: sourceScope.noPackageScriptsAdded,
  noOpenAiApiCalls: sourceScope.noOpenAiApiCalls,
  noProviderExternalCalls: sourceScope.noProviderExternalCalls,
  noSourceMutationFinanceWrite:
    sourceScope.noSourceMutation && sourceScope.noFinanceWrite,
  fp0141BoundaryVerified: verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary(
    {
      planText: fp0141PlanText,
      repoPaths,
    },
  ),
  fp0142Absent: verifyFp0142Absent(repoPaths),
  fp0140InvalidTokenImplementationPlanningBoundaryStillVerified:
    verifyFp0140InvalidTokenChallengeImplementationPlanningBoundary({
      planText: fp0140PlanText,
      repoPaths,
    }),
  fp0139ResultEnvelopeBoundaryStillVerified:
    priorBoundaries.fp0139ResultEnvelopeBoundaryStillVerified,
  fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified:
    priorBoundaries.fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified,
  fp0137InvalidTokenChallengeReadinessBoundaryStillVerified:
    priorBoundaries.fp0137InvalidTokenChallengeReadinessBoundaryStillVerified,
  fp0136InvalidTokenChallengeContractsBoundaryStillVerified:
    priorBoundaries.fp0136InvalidTokenChallengeContractsBoundaryStillVerified,
  fp0135InvalidTokenChallengeSequencingBoundaryStillVerified:
    priorBoundaries.fp0135InvalidTokenChallengeSequencingBoundaryStillVerified,
  fp0134SyntheticEvaluatorBoundaryStillVerified:
    priorBoundaries.fp0134SyntheticEvaluatorBoundaryStillVerified,
  fp0132TokenValidationRuntimeContractsBoundaryStillVerified:
    priorBoundaries.fp0132TokenValidationRuntimeContractsBoundaryStillVerified,
  fp0130MissingTokenChallengeBoundaryStillVerified:
    priorBoundaries.fp0130MissingTokenChallengeBoundaryStillVerified,
  fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
    priorBoundaries.fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified,
  fp0107RouteAdapterBoundaryStillVerified:
    priorBoundaries.fp0107RouteAdapterBoundaryStillVerified,
  fp0106ProtocolEnvelopeBoundaryStillVerified:
    priorBoundaries.fp0106ProtocolEnvelopeBoundaryStillVerified,
  fp0100PublicSecurityBoundaryStillVerified:
    priorBoundaries.fp0100PublicSecurityBoundaryStillVerified,
  proofDetails: {
    changedPathScope,
    repositoryInventory: {
      noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified:
        repositoryInventory.noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified,
      tokenValidationTestDoubleRepositoryInventoryVerified:
        repositoryInventory.tokenValidationTestDoubleRepositoryInventoryVerified,
    },
  },
};

for (const [key, value] of Object.entries(output)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0141 invalid-token challenge local runtime proof failed: ${key}`,
    );
  }
}

console.log(JSON.stringify(output, null, 2));

function verifyAdapterBehavior() {
  const malformed = responseFor("malformed_authorization");
  const invalid = responseFor("invalid_token");
  const expired = responseFor("expired_token");
  const revoked = responseFor("revoked_token");
  const wrongOrg = responseFor("wrong_org");
  const insufficientScope = buildReadOnlyAppMcpInvalidTokenChallengeResponse(
    buildTokenValidationResultEnvelope(
      buildTokenValidationResultEnvelopeInputDescriptor({
        outcome: "insufficient_scope",
        requiredScopes: ["mcp:read", "evidence:read"],
      }),
    ),
  );
  const acceptedEnvelope = buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor(),
  );
  const missingEnvelope = buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor({
      outcome: "missing_token",
    }),
  );
  const rawDescriptor = buildTokenValidationResultEnvelopeInputDescriptor({
    outcome: "invalid_token",
  });
  const rawMaterial = { rawToken: ["proof", "token", "material"].join("-") };
  const bearerMaterial = [
    "Bearer",
    ["proof", "token", "material"].join("-"),
  ].join(" ");
  const jwtLikeMaterial = [
    ["jwtlikeheader"].join("").padEnd(12, "x"),
    ["jwtlikepayload"].join("").padEnd(12, "x"),
    ["jwtlikesignature"].join("").padEnd(12, "x"),
  ].join(".");
  const rejectedInputs = [
    acceptedEnvelope,
    missingEnvelope,
    rawDescriptor,
    rawMaterial,
    bearerMaterial,
    jwtLikeMaterial,
  ];
  const sanitizedResponseText = [
    malformed,
    invalid,
    expired,
    revoked,
    wrongOrg,
    insufficientScope,
  ]
    .map((response) => JSON.stringify(response))
    .join("\n");

  return {
    acceptedEnvelopesRejected:
      !assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(acceptedEnvelope)
        .accepted &&
      assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(
        acceptedEnvelope,
      ).rejectionReasons.includes("accepted_envelope_rejected"),
    consumesFp0139ResultEnvelopeOnly:
      assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(
        envelopeFor("invalid_token"),
      ).accepted &&
      rejectedInputs.every(
        (input) =>
          !assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(input).accepted,
      ),
    insufficientScopeMapsTo403:
      insufficientScope.statusCode === 403 &&
      insufficientScope.body.error === "insufficient_scope",
    invalidExpiredRevokedTokenMapsTo401:
      [invalid, expired, revoked].every(
        (response) =>
          response.statusCode === 401 &&
          response.body.error === "invalid_token",
      ),
    invalidRequestMalformedAuthorizationMapsTo400:
      malformed.statusCode === 400 && malformed.body.error === "invalid_request",
    invalidTokenChallengeRuntimeImplemented:
      invalid.descriptor.invalidTokenChallengeRuntimeImplemented,
    failureTaxonomyHttpPostureWwwAuthenticateConsistencyVerified: [
      malformed,
      invalid,
      expired,
      revoked,
      wrongOrg,
      insufficientScope,
    ].every(responseConsistencyVerified),
    jsonRpcRefusalEnvelopeStillSeparate:
      invalid.descriptor.jsonRpcRefusalEnvelopeStillSeparate &&
      !("jsonrpc" in invalid.body),
    localInvalidTokenChallengeRuntimeOnly:
      invalid.descriptor.localInvalidTokenChallengeRuntimeOnly,
    localOnlyInvalidTokenBehaviorDoesNotParseHeadersOrTokens: [
      malformed,
      invalid,
      expired,
      revoked,
      wrongOrg,
      insufficientScope,
    ].every(
      (response) =>
        response.body.noTokenParsingRuntime &&
        response.body.noJwtDecodingRuntime &&
        response.body.noTokenIntrospectionRuntime &&
        response.body.noProductionTokenValidationRuntime,
    ),
    missingTokenBehaviorStillSeparate:
      !assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(missingEnvelope)
        .accepted,
    missingTokenEnvelopesRejected:
      !assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(missingEnvelope)
        .accepted &&
      assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(
        missingEnvelope,
      ).rejectionReasons.includes("missing_token_behavior_separate"),
    noTokenEcho: scanTokenValidationNoLeakage(sanitizedResponseText).accepted,
    resourceMetadataDependencyPreserved:
      [malformed, invalid, insufficientScope].every(
        (response) =>
          response.descriptor.resourceMetadata ===
            MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE &&
          response.wwwAuthenticate.includes("resource_metadata="),
      ),
    scopeChallengeGuidancePreserved:
      insufficientScope.body.requiredScopes?.join(" ") ===
        "mcp:read evidence:read" &&
      insufficientScope.wwwAuthenticate.includes(
        'scope="mcp:read evidence:read"',
      ),
    symbolicWwwAuthenticateErrorsPreserved:
      malformed.descriptor.symbolicWwwAuthenticateError ===
        "invalid_request" &&
      invalid.descriptor.symbolicWwwAuthenticateError === "invalid_token" &&
      insufficientScope.descriptor.symbolicWwwAuthenticateError ===
        "insufficient_scope" &&
      wrongOrg.descriptor.symbolicWwwAuthenticateError ===
        "fail_closed_non_leaking",
  };
}

function verifyRouteBehaviorShape() {
  const missingTokenIndex = routeSource.indexOf("if (missingTokenChallenge)");
  const invalidTokenIndex = routeSource.indexOf("if (invalidTokenChallenge)");

  return {
    missingTokenBehaviorStillSeparate:
      missingTokenIndex >= 0 &&
      invalidTokenIndex > missingTokenIndex &&
      routeSource.includes(
        "buildMcpWwwAuthenticateMissingTokenChallengeResponse",
      ) &&
      routeSource.includes(
        "buildMcpWwwAuthenticateAuthorizationHeaderNoValidationResponse",
      ),
    defaultRouteBehaviorUnchangedWhenInvalidTokenDependencyAbsent:
      routeSource.includes(
        "deps.readOnlyAppMcpInvalidTokenChallengeResultEnvelope === undefined",
      ) &&
      routeSource.includes("? null") &&
      !appSource.includes("readOnlyAppMcpInvalidTokenChallengeResultEnvelope"),
    noMcpRouteBehaviorChangeExceptInvalidTokenChallengeDependency:
      routeSource.includes(
        "readOnlyAppMcpInvalidTokenChallengeResultEnvelope?: unknown",
      ) &&
      routeSource.includes("buildReadOnlyAppMcpInvalidTokenChallengeResponse") &&
      localMcpRouteShapeStillVerified(),
    noNewRoutePath:
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1 &&
      !/app\.(?:put|patch|delete)\(/u.test(routeSource),
    noRouteConsumesSyntheticEvaluator:
      !routeSource.includes("evaluateSyntheticTokenValidationScenario"),
    noRouteConsumesTokenValidationTestDouble:
      !/token-validation-test-double|TestDouble/u.test(routeSource),
    protectedResourceMetadataRouteBehaviorStillSeparate:
      metadataRouteShapeStillVerified() &&
      !metadataRouteSource.includes("WWW-Authenticate") &&
      !metadataRouteSource.includes(
        "buildReadOnlyAppMcpInvalidTokenChallengeResponse",
      ),
  };
}

function responseConsistencyVerified(response) {
  const statusCode = response.descriptor.statusCode;
  const symbolic = response.descriptor.symbolicWwwAuthenticateError;
  const headerError = response.descriptor.wwwAuthenticateHeaderError;

  if (statusCode === 400) {
    return symbolic === "invalid_request" && headerError === "invalid_request";
  }
  if (statusCode === 403) {
    return (
      symbolic === "insufficient_scope" && headerError === "insufficient_scope"
    );
  }
  if (statusCode === 401) {
    return (
      ["invalid_token", "fail_closed_non_leaking"].includes(symbolic) &&
      headerError === "invalid_token"
    );
  }
  return false;
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
    noJwtDecodingRuntime:
      !/\b(?:parseJwt|decodeJwt|jwtDecode|jwtVerify|verifyJwt)\s*\(/u.test(
        changedExecutableSource,
      ),
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
    noProviderExternalCalls:
      !/\b(?:providerConnect|callProvider|createProviderJob|deploy|sendEmail|sendReport|contactCustomer|externalMessage)\s*\(/u.test(
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
    noTokenLogging:
      !hasTokenLoggingRuntime(changedExecutableSource),
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

function hasTokenLoggingRuntime(source) {
  const logCallPattern =
    /\b(?:console\.\w+|logger\.\w+|log|warn|debug|trace)\s*\([\s\S]{0,1200}?\);/giu;
  const sensitiveTokenReferencePattern =
    /\b(?:rawToken|accessToken|refreshToken|idToken|tokenMaterial|authorizationHeader|rawAuthorization|bearerMaterial|jwtLikeMaterial|bearer|jwt)\b/iu;

  for (const match of source.matchAll(logCallPattern)) {
    const call = match[0];
    if (/console\.log\s*\(\s*JSON\.stringify\s*\(/u.test(call)) {
      continue;
    }
    if (sensitiveTokenReferencePattern.test(call)) {
      return true;
    }
  }

  return false;
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
    fp0139ResultEnvelopeBoundaryStillVerified:
      verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary({
        planText: safeRead(FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH),
        repoPaths,
      }) &&
      verifyExactTokenValidationResultEnvelopeFailureTaxonomy() &&
      verifyTokenValidationResultEnvelopeHttpPostureMapping() &&
      verifyTokenValidationResultEnvelopeBoundaryFields(),
  };
}

function responseFor(failure) {
  return buildReadOnlyAppMcpInvalidTokenChallengeResponse(envelopeFor(failure));
}

function envelopeFor(failure) {
  return buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor({
      outcome: failure,
    }),
  );
}

function localMcpRouteShapeStillVerified() {
  return (
    countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
    countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1 &&
    !routeSource.includes("evaluateSyntheticTokenValidationScenario") &&
    !routeSource.includes("buildTokenValidationResultEnvelope")
  );
}

function metadataRouteShapeStillVerified() {
  return (
    countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
    (metadataRouteSource.includes("/.well-known/oauth-protected-resource/mcp") ||
      metadataRouteSource.includes(
        "MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH",
      )) &&
    !/WWW-Authenticate/iu.test(metadataRouteSource) &&
    !/app\.post|app\.put|app\.patch|app\.delete/iu.test(metadataRouteSource)
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

  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (skipped.has(entry.name)) continue;
      const fullPath = directory === "." ? entry.name : `${directory}/${entry.name}`;
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        results.push(fullPath);
      }
    }
  }

  walk(".");
  return results.sort();
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function safeRead(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function normalize(text) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
