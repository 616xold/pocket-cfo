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
  buildTokenValidationResultEnvelope,
  buildTokenValidationResultEnvelopeInputDescriptor,
  scanTokenValidationNoLeakage,
  verifyExactTokenValidationResultEnvelopeFailureTaxonomy,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0136InvalidTokenChallengeContractsBoundary,
  verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary,
  verifyFp0140InvalidTokenChallengeImplementationPlanningBoundary,
  verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary,
  verifyFp0142FailureTaxonomyHttpWwwAuthenticateConsistency,
  verifyFp0142RouteIntegrationSequencingPlanBoundary,
  verifyFp0143AbsentOrInvalidTokenAppConstructionWiring,
  verifyFp0144AbsentOrDocsOnlyProductionTokenValidationSequencingPlan,
  verifyMcpInvalidTokenChallengeContractBoundaries,
  verifyTokenValidationResultEnvelopeBoundaryFields,
  verifyTokenValidationResultEnvelopeHttpPostureMapping,
} from "../packages/domain/src/index.ts";
import {
  assessReadOnlyAppMcpInvalidTokenChallengeEnvelope,
  buildReadOnlyAppMcpInvalidTokenChallengeResponse,
} from "../apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts";

const SCHEMA_VERSION =
  "v2bk.read-only-app-mcp-invalid-token-app-construction-wiring.v1";
const FP0125_PLAN =
  "plans/FP-0125-read-only-chatgpt-app-mcp-protected-resource-metadata-local-route-implementation.md";
const FP0107_PLAN =
  "plans/FP-0107-read-only-chatgpt-app-mcp-local-fastify-mcp-route-adapter-foundation.md";
const FP0106_PLAN =
  "plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md";
const FP0100_PLAN =
  "plans/FP-0100-read-only-chatgpt-app-mcp-public-app-security-boundary-contracts-foundation.md";
const APP_PATH = "apps/control-plane/src/app.ts";
const TYPES_PATH = "apps/control-plane/src/lib/types.ts";
const BOOTSTRAP_PATH = "apps/control-plane/src/bootstrap.ts";
const MCP_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const METADATA_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const MISSING_TOKEN_HELPER_PATH =
  "packages/domain/src/read-only-app-mcp-www-authenticate-missing-token-challenge.ts";
const ROUTE_SPEC_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.spec.ts";
const APP_SPEC_PATH = "apps/control-plane/src/app.spec.ts";

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const changedExecutableSource = readChangedExecutableSource(changedPaths);
const changedText = readChangedText(changedPaths);
const appSource = safeRead(APP_PATH);
const typesSource = safeRead(TYPES_PATH);
const bootstrapSource = safeRead(BOOTSTRAP_PATH);
const routeSource = safeRead(MCP_ROUTE_PATH);
const routeSpecSource = safeRead(ROUTE_SPEC_PATH);
const appSpecSource = safeRead(APP_SPEC_PATH);
const metadataRouteSource = safeRead(METADATA_ROUTE_PATH);
const fp0143PlanText = safeRead(
  FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH,
);
const sourceScope = verifySourceScope();
const routeScope = verifyRouteScope();
const appWiringScope = verifyAppWiringScope();
const fp0139Scope = verifyFp0139EnvelopeScope();
const priorBoundaries = verifyPriorBoundaries();
const changedTokenExampleScan = scanChangedTokenExamples(changedText);

const output = {
  schemaVersion: SCHEMA_VERSION,
  localExplicitDependencyOnly:
    appWiringScope.explicitContainerDependencyVerified &&
    appWiringScope.routeRegistrationDependencyForwardingVerified &&
    sourceScope.noProductionTokenValidation &&
    sourceScope.noTokenParser &&
    sourceScope.noAuthorizationParser &&
    sourceScope.noJwtDecoder &&
    sourceScope.noTokenIntrospection &&
    sourceScope.noOauthImplementation &&
    sourceScope.noTokenSessionStorage &&
    sourceScope.noAuthMiddleware,
  invalidTokenAppConstructionWiringImplemented:
    appWiringScope.explicitContainerDependencyVerified &&
    appWiringScope.routeRegistrationDependencyForwardingVerified,
  buildAppDefaultBehaviorStillUnchanged:
    appWiringScope.buildAppDefaultBehaviorStillUnchanged,
  explicitContainerDependencyVerified:
    appWiringScope.explicitContainerDependencyVerified,
  routeRegistrationDependencyForwardingVerified:
    appWiringScope.routeRegistrationDependencyForwardingVerified,
  invalidTokenDependencyAbsentByDefault:
    appWiringScope.invalidTokenDependencyAbsentByDefault,
  invalidTokenRequiresAuthorizationPresent:
    routeScope.invalidTokenRequiresAuthorizationPresent,
  missingTokenPrecedencePreserved: routeScope.missingTokenPrecedencePreserved,
  protectedResourceMetadataCoRegistrationVerified:
    routeScope.protectedResourceMetadataCoRegistrationVerified,
  missingTokenChallengeCoRegistrationVerified:
    routeScope.missingTokenChallengeCoRegistrationVerified,
  fp0139ResultEnvelopeOnlyDependencyPreserved:
    fp0139Scope.fp0139ResultEnvelopeOnlyDependencyPreserved,
  failureTaxonomyHttpWwwAuthenticateConsistencyStillVerified:
    fp0139Scope.failureTaxonomyHttpWwwAuthenticateConsistencyStillVerified,
  noMcpRouteBehaviorChangeByDefault:
    routeScope.localMcpRouteShape &&
    appWiringScope.invalidTokenDependencyAbsentByDefault &&
    routeScope.defaultJsonRpcServicePathStillPresent,
  getMcpBehaviorUnchanged: routeScope.getMcpBehaviorUnchanged,
  notification202BehaviorUnchanged: routeScope.notification202BehaviorUnchanged,
  originBoundaryUnchanged: routeScope.originBoundaryUnchanged,
  protectedResourceMetadataRouteBehaviorUnchanged:
    routeScope.protectedResourceMetadataRouteBehaviorUnchanged,
  missingTokenBehaviorUnchanged: routeScope.missingTokenBehaviorUnchanged,
  noProductionTokenValidation: sourceScope.noProductionTokenValidation,
  noTokenParser: sourceScope.noTokenParser,
  noAuthorizationParser: sourceScope.noAuthorizationParser,
  noJwtDecoder: sourceScope.noJwtDecoder,
  noTokenIntrospection: sourceScope.noTokenIntrospection,
  noOauthImplementation: sourceScope.noOauthImplementation,
  noTokenSessionStorage: sourceScope.noTokenSessionStorage,
  noAuthMiddleware: sourceScope.noAuthMiddleware,
  noEvaluatorOrTestDoubleRouteConsumption:
    routeScope.noEvaluatorOrTestDoubleRouteConsumption,
  noRealTokenExamples: changedTokenExampleScan.noRealTokenExamples,
  noJwtLikeExamples: changedTokenExampleScan.noJwtLikeExamples,
  noBearerTokenMaterial: changedTokenExampleScan.noBearerTokenMaterial,
  noTokenEcho: fp0139Scope.noTokenEcho,
  noTokenLogging: sourceScope.noTokenLogging,
  noDbQueriesAdded: sourceScope.noDbQueriesAdded,
  noSchemaMigrationsAdded: sourceScope.noSchemaMigrationsAdded,
  noPackageScriptsAdded: sourceScope.noPackageScriptsAdded,
  noOpenAiApiCalls: sourceScope.noOpenAiApiCalls,
  noProviderExternalCalls: sourceScope.noProviderExternalCalls,
  noSourceMutationFinanceWrite: sourceScope.noSourceMutationFinanceWrite,
  fp0143BoundaryVerified:
    exactFp0143PlanPathVerified() &&
    verifyFp0143AbsentOrInvalidTokenAppConstructionWiring({
      planText: fp0143PlanText,
      repoPaths,
    }) &&
    changedPathsWithinFp0143Boundary(),
  fp0144AbsentOrDocsOnlyProductionTokenValidationSequencingPlanVerified:
    verifyFp0144AbsentOrDocsOnlyProductionTokenValidationSequencingPlan({
      planText: safeRead(
        FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PATH,
      ),
      repoPaths,
    }),
  fp0142RouteIntegrationSequencingBoundaryStillVerified:
    priorBoundaries.fp0142RouteIntegrationSequencingBoundaryStillVerified,
  fp0141LocalRuntimeBoundaryStillVerified:
    priorBoundaries.fp0141LocalRuntimeBoundaryStillVerified,
  fp0140ImplementationPlanningBoundaryStillVerified:
    priorBoundaries.fp0140ImplementationPlanningBoundaryStillVerified,
  fp0139ResultEnvelopeBoundaryStillVerified:
    priorBoundaries.fp0139ResultEnvelopeBoundaryStillVerified,
  fp0136InvalidTokenChallengeContractsBoundaryStillVerified:
    priorBoundaries.fp0136InvalidTokenChallengeContractsBoundaryStillVerified,
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
};

for (const [key, value] of Object.entries(output)) {
  if (key !== "schemaVersion" && value !== true) {
    throw new Error(`FP-0143 invalid-token app wiring proof failed: ${key}`);
  }
}

console.log(JSON.stringify(output, null, 2));

function verifyAppWiringScope() {
  const registrationCallIndex = appSource.indexOf(
    "registerReadOnlyAppMcpEndpointRoutes(app,",
  );
  const forwardedDependencyIndex = appSource.indexOf(
    "readOnlyAppMcpInvalidTokenChallengeResultEnvelope:\n      container.readOnlyAppMcpInvalidTokenChallengeResultEnvelope",
  );

  return {
    buildAppDefaultBehaviorStillUnchanged:
      appSource.includes(
        "options?.container ?? (await createServerContainer())",
      ) &&
      !bootstrapSource.includes(
        "readOnlyAppMcpInvalidTokenChallengeResultEnvelope",
      ) &&
      routeSource.includes(
        "deps.readOnlyAppMcpInvalidTokenChallengeResultEnvelope === undefined\n      ? null",
      ),
    explicitContainerDependencyVerified:
      typesSource.includes(
        "export type ReadOnlyAppMcpInvalidTokenChallengeResultEnvelopePort = unknown;",
      ) &&
      typesSource.includes(
        "readOnlyAppMcpInvalidTokenChallengeResultEnvelope?: ReadOnlyAppMcpInvalidTokenChallengeResultEnvelopePort;",
      ),
    invalidTokenDependencyAbsentByDefault: !bootstrapSource.includes(
      "readOnlyAppMcpInvalidTokenChallengeResultEnvelope",
    ),
    routeRegistrationDependencyForwardingVerified:
      registrationCallIndex >= 0 &&
      forwardedDependencyIndex > registrationCallIndex &&
      appSource.includes(
        "readOnlyAppMcpLocalProofGatedMissingTokenChallenge:\n      container.readOnlyAppMcpLocalProofGatedMissingTokenChallenge",
      ) &&
      appSource.includes(
        "readOnlyAppMcpProtectedResourceMetadataRouteInputEvidenceBundle:\n      container.readOnlyAppMcpProtectedResourceMetadataRouteInputEvidenceBundle",
      ),
  };
}

function verifyRouteScope() {
  const missingTokenIndex = routeSource.indexOf(
    "if (missingTokenChallenge && request.headers.authorization === undefined)",
  );
  const invalidTokenIndex = routeSource.indexOf(
    "if (invalidTokenChallenge && request.headers.authorization !== undefined)",
  );

  return {
    defaultJsonRpcServicePathStillPresent:
      routeSource.includes(
        "const response: ReadOnlyAppMcpEndpointResult = service.handle(request.body)",
      ) && routeSource.includes("return response;"),
    getMcpBehaviorUnchanged:
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1 &&
      routeSource.includes('.header("Allow", "POST")') &&
      routeSource.includes(".code(405).send()"),
    invalidTokenRequiresAuthorizationPresent:
      invalidTokenIndex >= 0 &&
      !/invalidTokenChallenge\s*\)\s*\{/u.test(routeSource),
    localMcpRouteShape:
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1,
    metadataRouteShape:
      countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
      !/app\.post|app\.put|app\.patch|app\.delete/iu.test(metadataRouteSource),
    missingTokenBehaviorUnchanged:
      !changedPaths.includes(MISSING_TOKEN_HELPER_PATH) &&
      missingTokenIndex >= 0 &&
      routeSpecSource.includes(
        "keeps missing-token challenge behavior ahead of injected invalid-token mapping",
      ),
    missingTokenChallengeCoRegistrationVerified:
      routeSource.includes("assertInvalidTokenChallengeCoRegistration") &&
      routeSource.includes("missing-token challenge co-registration") &&
      routeSource.includes("input.missingTokenChallenge === null"),
    missingTokenPrecedencePreserved:
      missingTokenIndex >= 0 &&
      invalidTokenIndex > missingTokenIndex &&
      routeSpecSource.includes(
        "keeps invalid-token challenge absent until Authorization is present",
      ),
    noEvaluatorOrTestDoubleRouteConsumption:
      !routeSource.includes("evaluateSyntheticTokenValidationScenario") &&
      !/token-validation-test-double|TestDouble/u.test(routeSource),
    notification202BehaviorUnchanged:
      routeSource.includes("if (response === null)") &&
      routeSource.includes("return reply.code(202).send()"),
    originBoundaryUnchanged:
      countMatches(routeSource, /validateLocalMcpOriginHeader/gu) >= 2 &&
      routeSource.includes("sendOriginRejected"),
    protectedResourceMetadataCoRegistrationVerified:
      routeSource.includes(
        "assertProtectedResourceMetadataRouteInputEvidenceBundleAcceptedForLocalRouteRegistration",
      ) &&
      routeSource.includes(
        "protected-resource metadata route evidence dependency",
      ) &&
      appSpecSource.includes("lacks protected-resource metadata evidence"),
    protectedResourceMetadataRouteBehaviorUnchanged:
      !changedPaths.includes(METADATA_ROUTE_PATH) &&
      countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
      !metadataRouteSource.includes(
        "buildReadOnlyAppMcpInvalidTokenChallengeResponse",
      ) &&
      !metadataRouteSource.includes("WWW-Authenticate"),
  };
}

function verifyFp0139EnvelopeScope() {
  const acceptedEnvelope = buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor(),
  );
  const missingEnvelope = buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor({
      outcome: "missing_token",
    }),
  );
  const responses = [
    responseFor("malformed_authorization"),
    responseFor("invalid_token"),
    responseFor("expired_token"),
    responseFor("revoked_token"),
    responseFor("wrong_org"),
    responseFor("insufficient_scope"),
  ];
  const acceptedAssessment =
    assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(acceptedEnvelope);
  const missingAssessment =
    assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(missingEnvelope);

  return {
    failureTaxonomyHttpWwwAuthenticateConsistencyStillVerified:
      verifyFp0142FailureTaxonomyHttpWwwAuthenticateConsistency() &&
      responses.every(responseConsistencyVerified),
    fp0139ResultEnvelopeOnlyDependencyPreserved:
      responses.every(
        (response) => response.descriptor.consumesFp0139ResultEnvelopeOnly,
      ) &&
      !acceptedAssessment.accepted &&
      acceptedAssessment.rejectionReasons.includes(
        "accepted_envelope_rejected",
      ) &&
      !missingAssessment.accepted &&
      missingAssessment.rejectionReasons.includes(
        "missing_token_behavior_separate",
      ),
    noTokenEcho: scanTokenValidationNoLeakage(
      responses.map((response) => JSON.stringify(response)).join("\n"),
    ).accepted,
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
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
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
    fp0141LocalRuntimeBoundaryStillVerified:
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
  };
}

function verifySourceScope() {
  return {
    noAuthMiddleware:
      !/\b(?:authMiddleware|authorizationMiddleware|routeGuard|verifyBearer|requireAuth|authenticateRequest|setCookie)\s*\(/u.test(
        changedExecutableSource,
      ),
    noAuthorizationParser:
      !/\bauthorization\s*\.\s*(?:split|replace|match|matchAll|exec|startsWith|slice|substring|toLowerCase|trim)\s*\(/iu.test(
        routeSource,
      ) &&
      !/\b(?:parseAuthorization|parseAuthHeader|authorizationParser|bearerParser)\s*\(/iu.test(
        changedExecutableSource,
      ),
    noDbQueriesAdded:
      !changedPaths.some((path) => /^packages\/db\//u.test(path)) &&
      !/\b(?:from\s+["']drizzle|drizzle\s*\(|select\s*\(|insert\s*\(|update\s*\(|delete\s*\(|sql`)\b/u.test(
        changedExecutableSource,
      ),
    noJwtDecoder:
      !/\b(?:parseJwt|decodeJwt|jwtDecode|jwtVerify|verifyJwt)\s*\(/u.test(
        changedExecutableSource,
      ),
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
    noProductionTokenValidation:
      !/\b(?:validateToken|verifyToken|tokenValidator|jwtVerify|verifyJwt|validateBearer|verifyBearer)\s*\(/u.test(
        changedExecutableSource,
      ),
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
    noSourceMutationFinanceWrite:
      !/\b(?:uploadSource|mutateSource|rewriteSource|deleteSource|writeFinanceTwin|updateLedger|financeWrite|postLedger|createJournalEntry)\s*\(/u.test(
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

function scanChangedTokenExamples(text) {
  const sanitized = text
    .replaceAll('authorization: ""', "")
    .replaceAll("authorization-present-local-only", "")
    .replaceAll("resource_metadata", "resource metadata");
  return {
    noBearerTokenMaterial:
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

function changedPathsWithinFp0143Boundary() {
  return changedPaths.every((path) =>
    [
      APP_PATH,
      APP_SPEC_PATH,
      MCP_ROUTE_PATH,
      ROUTE_SPEC_PATH,
      TYPES_PATH,
      FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH,
      "plans/FP-0144-read-only-chatgpt-app-mcp-production-token-validation-sequencing-master-plan.md",
      "packages/domain/src/index.ts",
      "packages/domain/src/read-only-app-mcp-invalid-token-challenge-route-integration-sequencing.ts",
      "packages/domain/src/read-only-app-mcp-invalid-token-challenge.spec.ts",
      "packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input-inventory-rules.ts",
      "packages/domain/src/read-only-app-mcp-token-validation-inventory.ts",
      "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts",
      "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts",
      "packages/domain/src/read-only-app-mcp-token-validation-production-sequencing.ts",
      "packages/domain/src/read-only-app-mcp-token-validation-runtime-proof-hardening.ts",
      "packages/domain/src/read-only-app-mcp-token-validation-runtime.spec.ts",
      "packages/domain/src/read-only-app-mcp-token-validation-runtime.ts",
      "packages/domain/src/read-only-app-mcp-token-validation.spec.ts",
      "packages/domain/src/read-only-app-mcp-token-validation-test-double-inventory.ts",
      "tools/read-only-endpoint-architecture-proof.mjs",
      "tools/read-only-endpoint-route-ownership-proof.mjs",
      "tools/read-only-mcp-canonical-resource-auth-server-proof.mjs",
      "tools/read-only-mcp-invalid-token-app-wiring-proof.mjs",
      "tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs",
      "tools/read-only-mcp-invalid-token-challenge-implementation-planning-proof.mjs",
      "tools/read-only-mcp-invalid-token-challenge-implementation-readiness-proof.mjs",
      "tools/read-only-mcp-invalid-token-challenge-local-runtime-proof.mjs",
      "tools/read-only-mcp-invalid-token-challenge-sequencing-proof.mjs",
      "tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs",
      "tools/read-only-mcp-oauth-security-boundary-proof.mjs",
      "tools/read-only-mcp-protected-resource-metadata-builder-proof.mjs",
      "tools/read-only-mcp-protocol-envelope-proof.mjs",
      "tools/read-only-mcp-route-adapter-proof.mjs",
      "tools/read-only-mcp-token-validation-readiness-proof.mjs",
      "tools/read-only-mcp-token-validation-result-envelope-proof.mjs",
      "tools/read-only-mcp-token-validation-runtime-contract-proof.mjs",
      "tools/read-only-mcp-token-validation-runtime-contracts-proof-hardening-proof.mjs",
      "tools/read-only-mcp-token-validation-runtime-implementation-readiness-proof.mjs",
      "tools/read-only-mcp-token-validation-runtime-sequencing-proof.mjs",
      "tools/read-only-mcp-token-validation-test-double-contract-proof.mjs",
      "tools/read-only-mcp-token-validation-test-double-local-proof.mjs",
      "tools/read-only-mcp-production-token-validation-sequencing-proof.mjs",
      "tools/read-only-mcp-authorization-parser-contracts-provider-selection-proof.mjs",
      "tools/read-only-mcp-provider-selection-evidence-hardening-proof.mjs",
      "tools/read-only-mcp-authorization-parser-implementation-readiness-proof.mjs",
      "tools/read-only-mcp-authorization-parser-pure-domain-implementation-proof.mjs",
      "tools/read-only-mcp-authorization-parser-route-integration-implementation-proof.mjs",
      "tools/read-only-mcp-authorization-parser-route-integration-readiness-proof.mjs",
      "tools/read-only-mcp-authorization-parser-route-integration-sequencing-proof.mjs",
      "tools/read-only-mcp-authorization-parser-app-construction-wiring-proof.mjs",
      "tools/read-only-mcp-authorization-parser-local-adapter-construction-readiness-proof.mjs",
      "tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs",
      "plans/FP-0145-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-proof-hardening.md",
      "plans/FP-0146-read-only-chatgpt-app-mcp-authorization-parser-contracts-provider-selection-proof.md",
      "plans/FP-0147-read-only-chatgpt-app-mcp-provider-selection-evidence-hardening.md",
      "plans/FP-0148-read-only-chatgpt-app-mcp-authorization-parser-implementation-readiness.md",
      "plans/FP-0149-read-only-chatgpt-app-mcp-authorization-parser-pure-domain-implementation.md",
      "plans/FP-0150-read-only-chatgpt-app-mcp-authorization-parser-route-integration-sequencing.md",
      "plans/FP-0151-read-only-chatgpt-app-mcp-authorization-parser-route-integration-implementation-readiness.md",
      "plans/FP-0152-read-only-chatgpt-app-mcp-authorization-parser-route-integration-implementation.md",
      "plans/FP-0153-read-only-chatgpt-app-mcp-authorization-parser-app-construction-wiring.md",
      "plans/FP-0154-read-only-chatgpt-app-mcp-authorization-parser-local-adapter-construction-readiness.md",
      "packages/domain/src/read-only-app-mcp-authorization-parser.ts",
      "packages/domain/src/read-only-app-mcp-authorization-parser.spec.ts",
      "packages/domain/src/read-only-app-mcp-authorization-parser-route-integration-readiness.ts",
      "packages/domain/src/read-only-app-mcp-authorization-parser-route-integration-readiness.spec.ts",
      "packages/domain/src/read-only-app-mcp-authorization-parser-implementation-readiness.ts",
      "packages/domain/src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts",
      "packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter-readiness.ts",
      "packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter-readiness.spec.ts",
      "packages/domain/src/read-only-app-mcp-provider-selection-evidence-hardening.ts",
      "packages/domain/src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts",
      "packages/domain/src/read-only-app-mcp-protected-resource-metadata-builder.spec.ts",
      "packages/domain/src/read-only-app-mcp-token-validation.ts",
      "README.md",
      "CODEX_README.md",
      "START_HERE.md",
      "docs/ACTIVE_DOCS.md",
      "docs/PROJECT_STATE.md",
      "docs/V2_BOUNDARY.md",
      "docs/security/read-only-agent-threat-model.md",
      "docs/security/finance-data-threat-model.md",
      "docs/demo/demo-data-policy.md",
      "plans/ROADMAP.md",
      "plugins.md",
    ].includes(path),
  );
}

function exactFp0143PlanPathVerified() {
  const hits = repoPaths.filter((path) => /(^|\/)FP-0143/u.test(path));
  return (
    hits.length === 1 &&
    hits[0] === FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH
  );
}

function responseFor(failure) {
  return buildReadOnlyAppMcpInvalidTokenChallengeResponse(
    buildTokenValidationResultEnvelope(
      buildTokenValidationResultEnvelopeInputDescriptor({
        outcome: failure,
      }),
    ),
  );
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

function readChangedText(paths) {
  return paths
    .filter((path) => /\.(?:ts|tsx|js|mjs|cjs|md|mdx|txt)$/u.test(path))
    .filter((path) => existsSync(path))
    .map((path) => `// ${path}\n${safeRead(path)}`)
    .join("\n");
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
      const fullPath =
        directory === "." ? entry.name : `${directory}/${entry.name}`;
      if (entry.isDirectory()) walk(fullPath);
      else results.push(fullPath);
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
