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
  FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
  FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
  FP0149_AUTHORIZATION_PARSER_PURE_DOMAIN_IMPLEMENTATION_PLAN_PATH,
  FP0150_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
  FP0151_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_PLAN_PATH,
  MCP_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_SCHEMA_VERSION,
  buildReadOnlyMcpAuthorizationParserRouteDecisionReadinessProof,
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary,
  verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary,
  verifyFp0142RouteIntegrationSequencingPlanBoundary,
  verifyFp0143AbsentOrInvalidTokenAppConstructionWiring,
  verifyFp0144ProductionTokenValidationSequencingPlanBoundary,
  verifyFp0145TokenValidationRuntimeProofHardeningPlanBoundary,
  verifyFp0146ParserContractProviderSelectionProofPlanBoundary,
  verifyFp0147ProviderSelectionEvidenceHardeningPlanBoundary,
  verifyFp0148AuthorizationParserImplementationReadinessPlanBoundary,
  verifyFp0149AbsentOrAuthorizationParserPureDomainImplementationPlan,
  verifyFp0150AbsentOrAuthorizationParserRouteIntegrationSequencingPlan,
  verifyFp0150AuthorizationParserRouteIntegrationSequencingPlanBoundary,
  verifyFp0150CloseoutFreshnessForFp0151,
  verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan,
  verifyFp0151RouteIntegrationReadinessPlanningTextRequiredTopics,
  verifyFp0152Absent,
  verifyReadOnlyMcpAuthorizationParserImplementationBoundary,
  verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary,
} from "../packages/domain/src/index.ts";

const MCP_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const METADATA_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const INVALID_TOKEN_CHALLENGE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts";
const PARSER_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser.ts";
const READINESS_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser-route-integration-readiness.ts";
const READINESS_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser-route-integration-readiness.spec.ts";
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
const changedLeakageText = readChangedLeakageText(changedPaths);
const fp0151PlanText = safeRead(
  FP0151_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_PLAN_PATH,
);
const fp0150PlanText = safeRead(
  FP0150_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
);
const fp0148PlanText = safeRead(
  FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
);
const fp0147PlanText = safeRead(
  FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
);
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
const parserSource = safeRead(PARSER_PATH);
const readinessSource = safeRead(READINESS_PATH);
const readinessSpecSource = safeRead(READINESS_SPEC_PATH);
const routeSource = safeRead(MCP_ROUTE_PATH);
const metadataRouteSource = safeRead(METADATA_ROUTE_PATH);
const invalidTokenChallengeSource = safeRead(INVALID_TOKEN_CHALLENGE_PATH);
const fp0151PlanTopics =
  verifyFp0151RouteIntegrationReadinessPlanningTextRequiredTopics(
    fp0151PlanText,
  );
const readinessProof =
  buildReadOnlyMcpAuthorizationParserRouteDecisionReadinessProof({
    fp0150PlanText,
    fp0151PlanText,
    repoPaths,
  });
const parserBoundaryProof =
  verifyReadOnlyMcpAuthorizationParserImplementationBoundary(repoPaths);
const routeScope = verifyRouteScope();
const sourceScope = verifySourceScope();
const noLeakageScope = verifyNoLeakageScope(changedLeakageText);
const priorBoundaries = verifyPriorBoundaries();

const output = {
  schemaVersion:
    MCP_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_SCHEMA_VERSION,
  fp0151AbsentOrRouteIntegrationReadinessPlanVerified:
    verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan(
      repoPaths,
    ) &&
    exactlyOneFp0151Plan() &&
    Object.values(fp0151PlanTopics).every(Boolean),
  fp0152Absent: verifyFp0152Absent(repoPaths),
  routeIntegrationImplementationReadinessBoundaryVerified:
    verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary({
      fp0150PlanText,
      fp0151PlanText,
      repoPaths,
    }),
  routeIntegrationStillBlocked:
    normalize(fp0151PlanText).includes("this is not route integration") &&
    normalize(fp0151PlanText).includes(
      "route integration is not included in fp-0151",
    ),
  parserRouteConsumptionStillBlocked:
    routeScope.noRouteParserImports &&
    normalize(fp0151PlanText).includes(
      "/mcp route may not consume parser output in fp-0151",
    ),
  productionTokenValidationRuntimeStillBlocked:
    sourceScope.noProductionTokenValidation &&
    readinessProof.productionTokenValidationRuntimeStillBlocked,
  providerSelectionStillDeferred:
    readinessProof.providerSelectionStillDeferred &&
    normalize(fp0151PlanText).includes("provider-neutral/deferred"),
  providerCallsStillBlocked: sourceScope.noProviderCalls,
  providerIntegrationStillBlocked: sourceScope.noProviderIntegration,
  tokenParserImplementationStillBlocked: sourceScope.noTokenParser,
  jwtDecoderImplementationStillBlocked: sourceScope.noJwtDecoder,
  jwksFetchImplementationStillBlocked: sourceScope.noJwksFetch,
  tokenIntrospectionImplementationStillBlocked:
    sourceScope.noTokenIntrospection,
  oauthImplementationStillBlocked: sourceScope.noOauthImplementation,
  tokenSessionStorageStillBlocked: sourceScope.noTokenSessionStorage,
  authMiddlewareStillBlocked: sourceScope.noAuthMiddleware,
  routeBehaviorStillUnchanged:
    routeScope.noRouteFileDiff && routeScope.noRouteBehaviorChange,
  missingTokenBehaviorStillUnchanged:
    routeScope.noRouteFileDiff && routeScope.noMissingTokenBehaviorChange,
  invalidTokenChallengeBehaviorStillUnchanged:
    routeScope.noRouteFileDiff &&
    routeScope.noInvalidTokenChallengeBehaviorChange,
  protectedResourceMetadataRouteStillUnchanged:
    routeScope.noRouteFileDiff &&
    routeScope.noProtectedResourceMetadataRouteBehaviorChange,
  routeSafeParserDecisionContractRecorded:
    readinessProof.routeSafeParserDecisionContractRecorded,
  routeDependencyInjectionShapeRecorded:
    readinessProof.routeDependencyInjectionShapeRecorded &&
    fp0151PlanTopics.dependencyInjectionShape,
  futureRouteSequencingRecorded:
    readinessProof.futureRouteSequencingRecorded &&
    fp0151PlanTopics.futureRouteSequencing,
  futureImplementationProofPrerequisitesRecorded:
    readinessProof.futureImplementationProofPrerequisitesRecorded &&
    fp0151PlanTopics.futureImplementationProofPrerequisites,
  parserDecisionNeverCarriesRawAuthorizationHeader:
    readinessProof.parserDecisionNeverCarriesRawAuthorizationHeader,
  parserDecisionNeverCarriesRawTokenMaterial:
    readinessProof.parserDecisionNeverCarriesRawTokenMaterial,
  parserDecisionNeverCarriesTokenDerivedFingerprint:
    readinessProof.parserDecisionNeverCarriesTokenDerivedFingerprint,
  parserDecisionNeverCarriesTokenPrefixSuffixLengthHashDigestClaimsDecodedOutput:
    readinessProof.parserDecisionNeverCarriesTokenPrefixSuffixLengthHashDigestClaimsDecodedOutput,
  parserFailureStatesMappedToFp0139AndFp0130:
    readinessProof.parserFailureStatesMappedToFp0139AndFp0130,
  missingTokenPrecedencePreserved:
    readinessProof.missingTokenPrecedencePreserved &&
    fp0151PlanTopics.futureRouteSequencing,
  invalidTokenChallengeDownstreamOnlyPreserved:
    readinessProof.invalidTokenChallengeDownstreamOnlyPreserved,
  parserFixturesContainNoRealTokenExamples:
    noLeakageScope.fixturesLeakageScan.accepted,
  sharedProofOnlyLeakageSanitizerStillVerified:
    noLeakageScope.leakageScan.accepted &&
    noLeakageScope.sharedSanitizerStillStrict,
  noJwtLikeExamplesFromFp0151: noLeakageScope.noJwtLikeExamples,
  noBearerTokenMaterialFromFp0151: noLeakageScope.noBearerTokenMaterial,
  noTokenEchoLoggingFromFp0151:
    noLeakageScope.noTokenEchoLogging && sourceScope.noTokenLogging,
  noOpenAiApiCallsFromFp0151: sourceScope.noOpenAiApiCalls,
  noModelCallsFromFp0151: sourceScope.noModelCalls,
  noProviderCallsFromFp0151: sourceScope.noProviderCalls,
  noSourceMutationFromFp0151: sourceScope.noSourceMutation,
  noFinanceWriteFromFp0151: sourceScope.noFinanceWrite,
  noExternalCommunicationsFromFp0151: sourceScope.noExternalCommunications,
  noPublicAssetsFromFp0151: sourceScope.noPublicAssets,
  noGeneratedPublicProseFromFp0151: sourceScope.noGeneratedPublicProse,
  noAppSubmissionFromFp0151: sourceScope.noAppSubmission,
  fp0150CloseoutFreshnessVerified:
    verifyFp0150CloseoutFreshnessForFp0151(fp0150PlanText),
  fp0150RouteIntegrationSequencingBoundaryStillVerified:
    verifyFp0150AbsentOrAuthorizationParserRouteIntegrationSequencingPlan(
      repoPaths,
    ) &&
    verifyFp0150AuthorizationParserRouteIntegrationSequencingPlanBoundary({
      planText: fp0150PlanText,
      repoPaths,
    }),
  fp0149ParserImplementationBoundaryStillVerified:
    verifyFp0149AbsentOrAuthorizationParserPureDomainImplementationPlan(
      repoPaths,
    ) && Object.values(parserBoundaryProof).every(Boolean),
  fp0148ReadinessBoundaryStillVerified:
    priorBoundaries.fp0148ReadinessBoundaryStillVerified,
  fp0147ProviderSelectionEvidenceBoundaryStillVerified:
    priorBoundaries.fp0147ProviderSelectionEvidenceBoundaryStillVerified,
  fp0146ParserContractsBoundaryStillVerified:
    priorBoundaries.fp0146ParserContractsBoundaryStillVerified,
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
    fp0151PlanTopics,
    noLeakageScope,
    priorBoundaries,
    readinessProof,
    routeScope,
    sourceScope,
  },
};

const proofOutputLeakageScan = scanProofOnlyNoTokenLeakageText(
  JSON.stringify(output),
);

for (const [key, value] of Object.entries(output)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0151 authorization parser route-integration readiness proof failed: ${key}`,
    );
  }
}
if (!proofOutputLeakageScan.accepted) {
  throw new Error(
    `FP-0151 proof output leaked credential material: ${proofOutputLeakageScan.rejectionReasons.join(", ")}`,
  );
}

console.log(JSON.stringify(output, null, 2));

function verifyRouteScope() {
  return {
    noInvalidTokenChallengeBehaviorChange:
      countMatches(
        routeSource,
        /readOnlyAppMcpInvalidTokenChallengeResultEnvelope/gu,
      ) === 3 &&
      invalidTokenChallengeSource.includes(
        "buildReadOnlyAppMcpInvalidTokenChallengeResponse",
      ),
    noMissingTokenBehaviorChange:
      countMatches(
        routeSource,
        /readOnlyAppMcpLocalProofGatedMissingTokenChallenge/gu,
      ) === 3 &&
      routeSource.includes(
        "buildMcpWwwAuthenticateMissingTokenChallengeResponse",
      ),
    noProtectedResourceMetadataRouteBehaviorChange:
      countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
      metadataRouteSource.includes(
        "READ_ONLY_APP_MCP_PROTECTED_RESOURCE_METADATA_ROUTE_PATH",
      ),
    noRouteBehaviorChange:
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1,
    noRouteFileDiff: !changedPaths.some((path) =>
      [
        MCP_ROUTE_PATH,
        METADATA_ROUTE_PATH,
        INVALID_TOKEN_CHALLENGE_PATH,
      ].includes(path),
    ),
    noRouteParserImports:
      !routeSource.includes("read-only-app-mcp-authorization-parser") &&
      !metadataRouteSource.includes("read-only-app-mcp-authorization-parser") &&
      !invalidTokenChallengeSource.includes(
        "read-only-app-mcp-authorization-parser",
      ),
  };
}

function verifySourceScope() {
  const modelCallPattern = ["call", "Model"].join("");
  const modelCallRegex = new RegExp(
    `\\b(?:responses\\.create|chat\\.completions|model\\s*\\.\\s*create|models\\s*\\.\\s*create|${modelCallPattern})\\s*\\(`,
    "u",
  );
  const publicAssetRegex = new RegExp(
    `\\b(?:${[
      ["screen", "shot"].join(""),
      ["public", "Asset"].join(""),
      ["listing", "Copy"].join(""),
      ["app", "Submission", "Asset"].join(""),
    ].join("|")})\\b`,
    "u",
  );

  return {
    noAuthMiddleware:
      !/\b(?:authMiddleware|authorizationMiddleware|routeGuard|verifyBearer|requireAuth|authenticateRequest|setCookie)\s*\(/u.test(
        changedExecutableSource,
      ),
    noFinanceWrite:
      !/\b(?:writeFinanceTwin|updateLedger|financeWrite|postLedger|createJournalEntry)\s*\(/u.test(
        changedExecutableSource,
      ),
    noJwtDecoder:
      !/\b(?:parseJwt|decodeJwt|jwtDecode|jwtVerify|verifyJwt)\s*\(/u.test(
        changedExecutableSource,
      ),
    noJwksFetch:
      !/\b(?:jwksClient|jwksUri|getSigningKey|remoteJwks|createRemoteJWKSet|fetchJwks|loadJwks)\s*\(/u.test(
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
      !/\b(?:providerConnect|createProviderJob|sendEmail|sendReport|contactCustomer|externalMessage)\s*\(/u.test(
        changedExecutableSource,
      ),
    noProviderIntegration:
      !/\b(?:providerConnect|createProviderJob|providerAdapter|providerClient)\s*\(/u.test(
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
      !/\b(?:sendEmail|sendReport|postSlack|externalMessage|publishSubmission)\s*\(/u.test(
        changedExecutableSource,
      ),
    noPublicAssets: !publicAssetRegex.test(changedExecutableSource),
    noGeneratedPublicProse:
      !/\b(?:generateListingCopy|marketingCopy|publicDescription)\s*\(/u.test(
        changedExecutableSource,
      ),
    noAppSubmission:
      !/\b(?:appSubmission|submitApp|publishConnector)\s*\(/u.test(
        changedExecutableSource,
      ),
  };
}

function verifyNoLeakageScope(leakageText) {
  const safeFixtureText = [
    parserSource,
    readinessSource,
    readinessSpecSource,
    fp0151PlanText,
  ].join("\n");
  const unsafeBearerLine = [
    "authorization",
    ": ",
    "bearer",
    " ",
    ["alpha", "numeric", "fixture"].join(""),
  ].join("");
  const unsafeJwtLikeLine = [
    "ey",
    "J",
    "headerpart",
    ".",
    "payloadpart",
    ".",
    "signaturepart",
  ].join("");
  const leakageScan = scanProofOnlyNoTokenLeakageText(leakageText);
  const fixturesLeakageScan = scanProofOnlyNoTokenLeakageText(safeFixtureText);
  const tokenExampleScan = scanChangedTokenExamples(leakageText);

  return {
    fixturesLeakageScan,
    leakageScan,
    noBearerTokenMaterial: tokenExampleScan.noBearerTokenMaterial,
    noJwtLikeExamples: tokenExampleScan.noJwtLikeExamples,
    noTokenEchoLogging: tokenExampleScan.noTokenEchoLogging,
    sharedSanitizerStillStrict:
      scanProofOnlyNoTokenLeakageText(unsafeBearerLine).accepted === false &&
      scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted === false,
  };
}

function verifyPriorBoundaries() {
  return {
    fp0148ReadinessBoundaryStillVerified:
      verifyFp0148AuthorizationParserImplementationReadinessPlanBoundary({
        planText: fp0148PlanText,
        repoPaths,
      }),
    fp0147ProviderSelectionEvidenceBoundaryStillVerified:
      verifyFp0147ProviderSelectionEvidenceHardeningPlanBoundary({
        planText: fp0147PlanText,
        repoPaths,
      }),
    fp0146ParserContractsBoundaryStillVerified:
      verifyFp0146ParserContractProviderSelectionProofPlanBoundary({
        planText: fp0146PlanText,
        repoPaths,
      }),
    fp0145RuntimeContractsBoundaryStillVerified:
      verifyFp0145TokenValidationRuntimeProofHardeningPlanBoundary({
        planText: fp0145PlanText,
        repoPaths,
      }),
    fp0144ProductionTokenValidationSequencingBoundaryStillVerified:
      verifyFp0144ProductionTokenValidationSequencingPlanBoundary({
        planText: fp0144PlanText,
        repoPaths,
      }),
    fp0143InvalidTokenAppWiringBoundaryStillVerified:
      verifyFp0143AbsentOrInvalidTokenAppConstructionWiring({
        planText: fp0143PlanText,
        repoPaths,
      }),
    fp0142RouteIntegrationSequencingBoundaryStillVerified:
      verifyFp0142RouteIntegrationSequencingPlanBoundary({
        planText: safeRead(
          FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
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
    fp0139ResultEnvelopeBoundaryStillVerified:
      verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary({
        planText: safeRead(FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH),
        repoPaths,
      }),
    fp0130MissingTokenChallengeBoundaryStillVerified:
      verifyFp0130LocalMissingTokenChallengeImplementationBoundary({
        planText: safeRead(
          FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0125ProtectedResourceMetadataRouteBoundaryStillVerified:
      safeRead(FP0125_PLAN).includes("protected-resource metadata") &&
      safeRead(FP0125_PLAN).includes("local route"),
    fp0107RouteAdapterBoundaryStillVerified:
      safeRead(FP0107_PLAN).includes("local Fastify") &&
      safeRead(FP0107_PLAN).includes("/mcp"),
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      safeRead(FP0106_PLAN).includes("protocol envelope") &&
      safeRead(FP0106_PLAN).includes("tool dispatch"),
    fp0100PublicSecurityBoundaryStillVerified:
      safeRead(FP0100_PLAN).includes(
        "public ChatGPT App/MCP security boundary",
      ) && safeRead(FP0100_PLAN).includes("read-only"),
  };
}

function hasTokenLoggingRuntime(source) {
  return /\b(?:console|logger)\s*\.[a-z]+\s*\([^)]*(?:authorization|credential|token)/iu.test(
    source,
  );
}

function scanChangedTokenExamples(source) {
  const bearerMaterialPattern = new RegExp(
    [
      "\\bbearer\\s+",
      "(?!scheme\\b|challenge\\b|resource\\b|parameter\\b|token\\b|material\\b)",
      "[a-z0-9._~+/=-]{8,}",
    ].join(""),
    "iu",
  );

  return {
    noBearerTokenMaterial: !bearerMaterialPattern.test(source),
    noJwtLikeExamples:
      !/\beyj[a-z0-9_-]{8,}\.[a-z0-9_-]{8,}\.[a-z0-9_-]{8,}\b/iu.test(source),
    noTokenEchoLogging:
      !/(?:console|logger)\.[a-z]+\([^)]*(?:authorization|credential|token)/iu.test(
        source,
      ),
  };
}

function exactlyOneFp0151Plan() {
  return (
    repoPaths.filter((path) => /(^|\/)FP-0151/u.test(path)).length === 1 &&
    existsSync(
      FP0151_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_PLAN_PATH,
    )
  );
}

function changedFilePathScope() {
  const committedBranchDiffPaths = gitLines([
    "diff",
    "--name-only",
    "origin/main...HEAD",
  ]);
  const dirtyPaths = [
    ...gitLines(["diff", "--name-only"]),
    ...gitLines(["diff", "--name-only", "--cached"]),
    ...gitLines(["ls-files", "--others", "--exclude-standard"]),
  ];
  const combinedChangedPaths = [
    ...new Set([...committedBranchDiffPaths, ...dirtyPaths]),
  ].sort();

  return {
    combinedChangedPaths,
    committedBranchDiffPaths,
    dirtyQaTargetFiles: dirtyPaths.filter(Boolean).sort(),
  };
}

function readChangedExecutableSource(paths) {
  return paths
    .filter((path) => /\.(?:mjs|ts|tsx)$/u.test(path))
    .filter((path) => !path.endsWith(".spec.ts"))
    .map((path) => safeRead(path))
    .join("\n");
}

function readChangedLeakageText(paths) {
  return paths
    .filter((path) => /\.(?:md|mjs|ts|tsx)$/u.test(path))
    .map((path) => safeRead(path))
    .join("\n");
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
    const absolutePath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return repoFilePaths(absolutePath, path);
    return [path];
  });
}

function safeRead(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function gitLines(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" })
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function countMatches(value, pattern) {
  return value.match(pattern)?.length ?? 0;
}

function normalize(value) {
  return value.toLowerCase().replace(/\s+/gu, " ").trim();
}
