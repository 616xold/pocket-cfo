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
  FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
  FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS,
  FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
  FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
  FP0149_AUTHORIZATION_PARSER_PURE_DOMAIN_IMPLEMENTATION_PLAN_PATH,
  MCP_AUTHORIZATION_PARSER_IMPLEMENTATION_SCHEMA_VERSION,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS,
  classifyReadOnlyMcpAuthorizationHeader,
  parseReadOnlyMcpAuthorizationHeader,
  sanitizeProofOnlyNoTokenLeakageFixtureText,
  scanProofOnlyNoTokenLeakageText,
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
  verifyFp0148CloseoutFreshnessForFp0149,
  verifyFp0149CloseoutFreshnessForFp0150,
  verifyFp0148SharedProofOnlyLeakageSanitizer,
  verifyFp0149AbsentOrAuthorizationParserPureDomainImplementationPlan,
  verifyFp0150AbsentOrAuthorizationParserRouteIntegrationSequencingPlan,
  verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan,
  verifyReadOnlyMcpAuthorizationParserImplementationBoundary,
} from "../packages/domain/src/index.ts";

const MCP_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const METADATA_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const INVALID_TOKEN_CHALLENGE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts";
const PARSER_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser.ts";
const PARSER_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser.spec.ts";
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
const fp0149PlanText = safeRead(
  FP0149_AUTHORIZATION_PARSER_PURE_DOMAIN_IMPLEMENTATION_PLAN_PATH,
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
const parserSpecSource = safeRead(PARSER_SPEC_PATH);
const routeSource = safeRead(MCP_ROUTE_PATH);
const metadataRouteSource = safeRead(METADATA_ROUTE_PATH);
const sanitizedOutput = parseReadOnlyMcpAuthorizationHeader({
  authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent}`,
});
const sanitizedOutputAlt = parseReadOnlyMcpAuthorizationHeader({
  authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresentAlt}`,
});
const sanitizedOutputFields = Object.keys(sanitizedOutput);
const passthroughAttempt = classifyReadOnlyMcpAuthorizationHeader({
  authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.passthroughAttempt}`,
});
const sourceScope = verifySourceScope();
const routeScope = verifyRouteScope();
const parserScope = verifyParserScope();
const noLeakageScope = verifyNoLeakageScope(changedLeakageText);
const fp0149PlanTopics = verifyFp0149PlanningTextRequiredTopics(fp0149PlanText);
const priorBoundaries = verifyPriorBoundaries();
const boundaryProof =
  verifyReadOnlyMcpAuthorizationParserImplementationBoundary(repoPaths);

const output = {
  schemaVersion: MCP_AUTHORIZATION_PARSER_IMPLEMENTATION_SCHEMA_VERSION,
  fp0149AbsentOrAuthorizationParserPureDomainImplementationPlanVerified:
    verifyFp0149AbsentOrAuthorizationParserPureDomainImplementationPlan(
      repoPaths,
    ) && exactlyOneFp0149Plan(),
  fp0150AbsentOrRouteIntegrationSequencingPlanVerified:
    verifyFp0150AbsentOrAuthorizationParserRouteIntegrationSequencingPlan(
      repoPaths,
    ),
  fp0151AbsentOrRouteIntegrationReadinessPlanVerified:
    verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan(
      repoPaths,
    ),
  authorizationParserPureDomainImplementationBoundaryVerified:
    Object.values(boundaryProof).every(Boolean) &&
    Object.values(fp0149PlanTopics).every(Boolean),
  authorizationParserMaterialObservationHardened:
    sanitizedOutput.authorization_scheme_classification === "bearer" &&
    sanitizedOutput.credential_material_observed === true &&
    sanitizedOutputAlt.authorization_scheme_classification === "bearer" &&
    sanitizedOutputAlt.credential_material_observed === true &&
    passthroughAttempt.authorization_scheme_classification === "malformed" &&
    passthroughAttempt.failure_state === "token_material_passthrough_attempt",
  parserImplementationPureDomainOnly:
    parserScope.noForbiddenParserImports &&
    parserScope.noForbiddenParserRuntimeApis,
  parserRouteConsumptionStillBlocked:
    routeScope.fp0152ExplicitRouteIntegrationBridge
      ? routeScope.noPureParserImport && parserScope.noRouteImports
      : routeScope.noRouteBehaviorChange && parserScope.noRouteImports,
  productionTokenValidationRuntimeStillBlocked:
    sourceScope.noProductionTokenValidation,
  providerSelectionStillDeferred: fp0149PlanTopics.providerSelectionDeferred,
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
    routeScope.noRouteBehaviorChange ||
    routeScope.defaultBehaviorWithoutParserDependencyStillUnchanged,
  missingTokenBehaviorStillUnchanged:
    routeScope.noMissingTokenBehaviorChange ||
    routeScope.missingTokenPrecedencePreserved,
  invalidTokenChallengeBehaviorStillUnchanged:
    routeScope.noInvalidTokenChallengeBehaviorChange ||
    routeScope.invalidTokenChallengeDownstreamOnlyPreserved,
  protectedResourceMetadataRouteStillUnchanged:
    routeScope.noProtectedResourceMetadataRouteBehaviorChange,
  parserOutputLimitedToFp0146SanitizedFields:
    sanitizedOutputFields.join("\n") ===
    FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS.join("\n"),
  parserNeverReturnsRawAuthorizationHeader:
    parserScope.noRawAuthorizationHeaderOutput,
  parserNeverReturnsRawTokenMaterial: parserScope.noRawTokenOutput,
  parserNeverReturnsTokenDerivedFingerprint:
    sanitizedOutput.no_token_derived_fingerprint_retained === true,
  parserNeverReturnsTokenPrefixSuffixLengthHashDigestClaimsDecodedOutput:
    FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS.every(
      (field) => !sanitizedOutputFields.includes(field),
    ),
  parserFailureStatesMappedToFp0139AndFp0130:
    passthroughAttempt.failure_mapping?.envelopeFailure === "invalid_token" &&
    fp0149PlanTopics.failureMapping,
  parserFixturesContainNoRealTokenExamples:
    noLeakageScope.fixturesLeakageScan.accepted,
  sharedProofOnlyLeakageSanitizerStillVerified:
    verifyFp0148SharedProofOnlyLeakageSanitizer() &&
    noLeakageScope.leakageScan.accepted,
  noJwtLikeExamplesFromFp0149: noLeakageScope.noJwtLikeExamples,
  noBearerTokenMaterialFromFp0149: noLeakageScope.noBearerTokenMaterial,
  noTokenEchoLoggingFromFp0149:
    noLeakageScope.noTokenEchoLogging && sourceScope.noTokenLogging,
  noOpenAiApiCallsFromFp0149: sourceScope.noOpenAiApiCalls,
  noModelCallsFromFp0149: sourceScope.noModelCalls,
  noProviderCallsFromFp0149: sourceScope.noProviderCalls,
  noSourceMutationFromFp0149: sourceScope.noSourceMutation,
  noFinanceWriteFromFp0149: sourceScope.noFinanceWrite,
  noExternalCommunicationsFromFp0149: sourceScope.noExternalCommunications,
  noPublicAssetsFromFp0149: sourceScope.noPublicAssets,
  noGeneratedPublicProseFromFp0149: sourceScope.noGeneratedPublicProse,
  noAppSubmissionFromFp0149: sourceScope.noAppSubmission,
  fp0148CloseoutFreshnessVerified:
    verifyFp0148CloseoutFreshnessForFp0149(fp0148PlanText),
  fp0149CloseoutFreshnessVerified:
    verifyFp0149CloseoutFreshnessForFp0150(fp0149PlanText),
  fp0148ReadinessBoundaryStillVerified:
    verifyFp0148AuthorizationParserImplementationReadinessPlanBoundary({
      planText: fp0148PlanText,
      repoPaths,
    }),
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
    fp0149PlanTopics,
    noLeakageScope,
    parserScope,
    priorBoundaries,
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
      `FP-0149 authorization parser pure-domain implementation proof failed: ${key}`,
    );
  }
}
if (!proofOutputLeakageScan.accepted) {
  throw new Error(
    `FP-0149 proof output leaked credential material: ${proofOutputLeakageScan.rejectionReasons.join(", ")}`,
  );
}

console.log(JSON.stringify(output, null, 2));

function verifyParserScope() {
  const forbiddenOutputFields = [
    "authorization_header",
    "raw_authorization",
    "raw_header",
    "raw_token",
    "token_fingerprint",
    "token_prefix",
    "token_suffix",
    "token_length",
    "token_hash",
    "token_digest",
    "token_claims",
    "decoded_header",
    "decoded_payload",
  ];

  return {
    noForbiddenParserImports:
      !/from ["']node:/u.test(parserSource) &&
      !/apps\/control-plane|fastify|routes|packages\/db|drizzle/iu.test(
        parserSource,
      ) &&
      !/openai|provider|jwks|introspect|oauthCallback|sessionStore/iu.test(
        parserSource,
      ),
    noForbiddenParserRuntimeApis:
      !/\b(?:fetch|setTimeout|setInterval)\s*\(/u.test(parserSource) &&
      !/\b(?:Date|Math\.random|crypto|process\.env)\b/u.test(parserSource) &&
      !/\b(?:console|logger)\s*\./u.test(parserSource),
    noRawAuthorizationHeaderOutput: forbiddenOutputFields.every(
      (field) => !sanitizedOutputFields.includes(field),
    ),
    noRawTokenOutput: !sanitizedOutputFields.includes("raw_token"),
    noRouteImports:
      !routeSource.includes("read-only-app-mcp-authorization-parser") &&
      !metadataRouteSource.includes("read-only-app-mcp-authorization-parser"),
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
    defaultBehaviorWithoutParserDependencyStillUnchanged:
      routeSpecSourceIncludes(
        "keeps default POST /mcp behavior unchanged without the parser route-decision dependency",
      ) &&
      routeSource.includes("assertParserRouteDecisionCoRegistration") &&
      routeSource.includes("input.parserRouteDecision === undefined"),
    fp0152ExplicitRouteIntegrationBridge:
      repoPaths.includes(
        "plans/FP-0152-read-only-chatgpt-app-mcp-authorization-parser-route-integration-implementation.md",
      ) &&
      routeSource.includes(
        "readOnlyAppMcpAuthorizationParserRouteDecision?:",
      ),
    invalidTokenChallengeDownstreamOnlyPreserved:
      routeSpecSourceIncludes(
        "routes malformed and unsupported parser decisions to the existing invalid-token challenge",
      ) &&
      routeSpecSourceIncludes(
        "routes observed safe parser decisions to the existing invalid-token challenge until validation runtime exists",
      ),
    missingTokenPrecedencePreserved:
      routeSpecSourceIncludes(
        "keeps missing-token challenge ahead of the parser route-decision dependency",
      ) &&
      routeSource.indexOf("request.headers.authorization === undefined") <
        routeSource.indexOf("parserRouteDecisionDependency({"),
    noPureParserImport: !/read-only-app-mcp-authorization-parser["']/u.test(
      routeSource,
    ),
    noInvalidTokenChallengeBehaviorChange:
      !changedPaths.includes(MCP_ROUTE_PATH) &&
      !changedPaths.includes(INVALID_TOKEN_CHALLENGE_PATH),
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
      !changedPaths.includes(MCP_ROUTE_PATH) &&
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1,
  };
}

function routeSpecSourceIncludes(value) {
  return safeRead(
    "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.spec.ts",
  ).includes(value);
}

function verifyNoLeakageScope(text) {
  const leakageScan = scanProofOnlyNoTokenLeakageText(text);
  const fixtureText = [
    READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialOmitted,
    READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent,
    READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresentAlt,
    READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.notAToken,
    READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.passthroughAttempt,
    parserSource,
    parserSpecSource,
  ].join("\n");
  const fixturesLeakageScan = scanProofOnlyNoTokenLeakageText(fixtureText);
  const changedTokenExampleScan = scanChangedTokenExamples(text);
  return {
    fixturesLeakageScan,
    leakageScan,
    noBearerTokenMaterial:
      leakageScan.accepted && changedTokenExampleScan.noBearerTokenMaterial,
    noJwtLikeExamples:
      leakageScan.accepted && changedTokenExampleScan.noJwtLikeExamples,
    noRealTokenExamples:
      leakageScan.accepted && changedTokenExampleScan.noRealTokenExamples,
    noTokenEchoLogging: !hasTokenLoggingRuntime(changedExecutableSource),
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
      (verifyRouteScope().noRouteBehaviorChange ||
        verifyRouteScope().defaultBehaviorWithoutParserDependencyStillUnchanged),
    fp0125ProtectedResourceMetadataRouteBoundaryStillVerified:
      docsBoundary(FP0125_PLAN, [
        "local-only/read-only",
        "/.well-known/oauth-protected-resource/mcp",
      ]) && verifyRouteScope().noProtectedResourceMetadataRouteBehaviorChange,
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
    fp0146ParserContractsBoundaryStillVerified:
      verifyFp0146ParserContractProviderSelectionProofPlanBoundary({
        planText: fp0146PlanText,
        repoPaths,
      }),
    fp0147ProviderSelectionEvidenceBoundaryStillVerified:
      verifyFp0147ProviderSelectionEvidenceHardeningPlanBoundary({
        planText: fp0147PlanText,
        repoPaths,
      }),
  };
}

function verifyFp0149PlanningTextRequiredTopics(planText) {
  const normalized = normalize(planText);
  return {
    dbSchemaPackageBlocked:
      normalized.includes("does not add db/schema/package work") &&
      normalized.includes("forbidden edit surfaces: routes"),
    failureMapping:
      normalized.includes("missing_authorization") &&
      normalized.includes("fp-0130 missing-token lane") &&
      normalized.includes("unsupported_validation_mode") &&
      normalized.includes("token_material_passthrough_attempt") &&
      normalized.includes("invalid_token"),
    fp0150Boundary:
      normalized.includes(
        "future fp-0150 may open only route-integration sequencing",
      ) && normalized.includes("route integration itself remains blocked"),
    oauthAuthBlocked: normalized.includes(
      "oauth/session/auth middleware remains blocked",
    ),
    outputBoundary:
      FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS.every((field) =>
        normalized.includes(field),
      ) &&
      FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS.every((field) =>
        normalized.includes(field),
      ),
    parserImplementationIncluded:
      normalized.includes("authorization parser implementation is included") &&
      normalized.includes("pure-domain/local-only"),
    providerSelectionDeferred: normalized.includes(
      "provider selection remains provider-neutral/deferred",
    ),
    publicAppBlocked: normalized.includes(
      "public chatgpt app demo/submission remains blocked",
    ),
    rawMaterialBlocked:
      normalized.includes("may not carry raw header material") &&
      normalized.includes("may not carry token-derived fingerprint"),
    routeConsumptionBlocked:
      normalized.includes("/mcp` route consumption remains blocked") ||
      normalized.includes("/mcp route consumption remains blocked"),
    safeSentinels:
      normalized.includes("[credential omitted]") &&
      normalized.includes("[not-a-token]") &&
      normalized.includes("[credential-present]"),
    tokenValidationBlocked: normalized.includes(
      "production token validation remains blocked",
    ),
  };
}

function exactlyOneFp0149Plan() {
  const hits = repoPaths
    .map((path) => path.replace(/\\/gu, "/"))
    .filter((path) => /(^|\/)FP-0149/u.test(path));
  return (
    hits.length === 1 &&
    hits[0] === FP0149_AUTHORIZATION_PARSER_PURE_DOMAIN_IMPLEMENTATION_PLAN_PATH
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

function readChangedExecutableSource(paths) {
  return paths
    .filter((path) => /\.(?:ts|tsx|js|mjs|cjs)$/u.test(path))
    .filter((path) => !path.endsWith(".spec.ts"))
    .filter((path) => existsSync(path))
    .map((path) => `// ${path}\n${safeRead(path)}`)
    .join("\n");
}

function readChangedLeakageText(paths) {
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

function readGitLines(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" })
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
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
