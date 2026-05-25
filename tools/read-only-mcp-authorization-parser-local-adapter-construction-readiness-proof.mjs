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
  FP0152_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_IMPLEMENTATION_PLAN_PATH,
  FP0153_AUTHORIZATION_PARSER_APP_CONSTRUCTION_WIRING_PLAN_PATH,
  FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH,
  FP0156_AUTHORIZATION_PARSER_LOCAL_ADAPTER_APP_CONSTRUCTION_INJECTION_PLAN_PATH,
  MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_READINESS_SCHEMA_VERSION,
  buildReadOnlyMcpAuthorizationParserLocalAdapterReadinessProof,
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
  verifyFp0150AuthorizationParserRouteIntegrationSequencingPlanBoundary,
  verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan,
  verifyFp0152AbsentOrAuthorizationParserRouteIntegrationImplementationPlan,
  verifyFp0153AbsentOrAuthorizationParserAppConstructionWiringPlan,
  verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan,
  verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan,
  verifyFp0156Absent,
  verifyReadOnlyMcpAuthorizationParserImplementationBoundary,
  verifyReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundary,
  verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary,
} from "../packages/domain/src/index.ts";

const APP_PATH = "apps/control-plane/src/app.ts";
const APP_SPEC_PATH = "apps/control-plane/src/app.spec.ts";
const BOOTSTRAP_PATH = "apps/control-plane/src/bootstrap.ts";
const MCP_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const ROUTE_SPEC_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.spec.ts";
const METADATA_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const INVALID_TOKEN_CHALLENGE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts";
const READINESS_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter-readiness.ts";
const READINESS_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter-readiness.spec.ts";
const TOKEN_VALIDATION_SOURCE_PATH =
  "packages/domain/src/read-only-app-mcp-token-validation.ts";
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
const appSource = safeRead(APP_PATH);
const appSpecSource = safeRead(APP_SPEC_PATH);
const bootstrapSource = safeRead(BOOTSTRAP_PATH);
const routeSource = safeRead(MCP_ROUTE_PATH);
const routeSpecSource = safeRead(ROUTE_SPEC_PATH);
const metadataRouteSource = safeRead(METADATA_ROUTE_PATH);
const invalidTokenChallengeSource = safeRead(INVALID_TOKEN_CHALLENGE_PATH);
const readinessSource = safeRead(READINESS_PATH);
const readinessSpecSource = safeRead(READINESS_SPEC_PATH);
const tokenValidationSource = safeRead(TOKEN_VALIDATION_SOURCE_PATH);
const fp0154PlanText = safeRead(
  FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH,
);
const fp0153PlanText = safeRead(
  FP0153_AUTHORIZATION_PARSER_APP_CONSTRUCTION_WIRING_PLAN_PATH,
);
const fp0152PlanText = safeRead(
  FP0152_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_IMPLEMENTATION_PLAN_PATH,
);
const fp0151PlanText = safeRead(
  FP0151_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_PLAN_PATH,
);
const fp0150PlanText = safeRead(
  FP0150_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
);
const readinessProof =
  buildReadOnlyMcpAuthorizationParserLocalAdapterReadinessProof({
    fp0153PlanText,
    fp0154PlanText,
    repoPaths,
  });
const sourceScope = verifySourceScope();
const appScope = verifyAppScope();
const routeScope = verifyRouteScope();
const noLeakageScope = verifyNoLeakageScope(changedLeakageText);
const priorBoundaries = verifyPriorBoundaries();

const output = {
  schemaVersion: MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_READINESS_SCHEMA_VERSION,
  fp0154AbsentOrLocalAdapterConstructionReadinessPlanVerified:
    verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan(
      repoPaths,
    ) &&
    exactlyOneFp0154Plan() &&
    readinessProof.fp0154AbsentOrLocalAdapterConstructionReadinessPlanVerified,
  fp0155AbsentOrLocalAdapterImplementationPlanVerified:
    verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan(
      repoPaths,
    ) && absentOrExactFp0155Plan(),
  fp0156Absent: verifyFp0156Absent(repoPaths) && noFp0156Plan(),
  localAdapterConstructionReadinessBoundaryVerified:
    verifyReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundary({
      fp0153PlanText,
      fp0154PlanText,
      repoPaths,
    }),
  adapterImplementationStillBlocked:
    sourceScope.noAdapterImplementation &&
    readinessProof.adapterImplementationStillBlocked,
  adapterFactoryExportStillBlocked:
    sourceScope.noAdapterFactoryExport &&
    readinessProof.adapterFactoryExportStillBlocked,
  adapterConstructionInsideAppStillBlocked:
    appScope.noLocalAdapterConstruction &&
    readinessProof.adapterConstructionInsideAppStillBlocked,
  adapterConstructionInsideRouteStillBlocked:
    routeScope.noLocalAdapterConstruction &&
    readinessProof.adapterConstructionInsideRouteStillBlocked,
  defaultAdapterWiringStillBlocked:
    appScope.defaultCreateContainerLeavesParserDependencyAbsent &&
    readinessProof.defaultAdapterWiringStillBlocked,
  buildAppBehaviorStillUnchanged:
    appScope.buildAppExplicitPassThroughPreserved &&
    readinessProof.buildAppBehaviorStillUnchanged,
  mcpRouteBehaviorStillUnchanged:
    routeScope.mcpRouteShapePreserved &&
    readinessProof.mcpRouteBehaviorStillUnchanged,
  futureAdapterInputBoundaryRecorded:
    readinessProof.futureAdapterInputBoundaryRecorded,
  futureAdapterOutputBoundaryRecorded:
    readinessProof.futureAdapterOutputBoundaryRecorded,
  futureAdapterCompositionRecorded:
    readinessProof.futureAdapterCompositionRecorded,
  futureAdapterFailureMappingRecorded:
    readinessProof.futureAdapterFailureMappingRecorded,
  futureAdapterTestMatrixRecorded:
    readinessProof.futureAdapterTestMatrixRecorded,
  parserDecisionNeverCarriesRawAuthorizationHeader:
    readinessProof.parserDecisionNeverCarriesRawAuthorizationHeader,
  parserDecisionNeverCarriesRawTokenMaterial:
    readinessProof.parserDecisionNeverCarriesRawTokenMaterial,
  parserDecisionNeverCarriesTokenDerivedFingerprint:
    readinessProof.parserDecisionNeverCarriesTokenDerivedFingerprint,
  parserDecisionNeverCarriesTokenPrefixSuffixLengthHashDigestClaimsDecodedOutput:
    readinessProof.parserDecisionNeverCarriesTokenPrefixSuffixLengthHashDigestClaimsDecodedOutput,
  productionTokenValidationRuntimeStillBlocked:
    sourceScope.noProductionTokenValidation &&
    readinessProof.productionTokenValidationRuntimeStillBlocked,
  providerSelectionStillDeferred:
    sourceScope.noProviderSelection && readinessProof.providerSelectionStillDeferred,
  providerCallsStillBlocked:
    sourceScope.noProviderCalls && readinessProof.providerCallsStillBlocked,
  providerIntegrationStillBlocked:
    sourceScope.noProviderIntegration && readinessProof.providerIntegrationStillBlocked,
  tokenParserImplementationStillBlocked:
    sourceScope.noTokenParser && readinessProof.tokenParserImplementationStillBlocked,
  jwtDecoderImplementationStillBlocked:
    sourceScope.noJwtDecoder && readinessProof.jwtDecoderImplementationStillBlocked,
  jwksFetchImplementationStillBlocked:
    sourceScope.noJwksFetch && readinessProof.jwksFetchImplementationStillBlocked,
  tokenIntrospectionImplementationStillBlocked:
    sourceScope.noTokenIntrospection &&
    readinessProof.tokenIntrospectionImplementationStillBlocked,
  oauthImplementationStillBlocked:
    sourceScope.noOauthImplementation && readinessProof.oauthImplementationStillBlocked,
  tokenSessionStorageStillBlocked:
    sourceScope.noTokenSessionStorage &&
    readinessProof.tokenSessionStorageStillBlocked,
  authMiddlewareStillBlocked:
    sourceScope.noAuthMiddleware && readinessProof.authMiddlewareStillBlocked,
  noOpenAiApiCallsFromFp0154:
    sourceScope.noOpenAiApiCalls && readinessProof.noOpenAiApiCallsFromFp0154,
  noModelCallsFromFp0154:
    sourceScope.noModelCalls && readinessProof.noModelCallsFromFp0154,
  noProviderCallsFromFp0154:
    sourceScope.noProviderCalls && readinessProof.noProviderCallsFromFp0154,
  noSourceMutationFromFp0154:
    sourceScope.noSourceMutation && readinessProof.noSourceMutationFromFp0154,
  noFinanceWriteFromFp0154:
    sourceScope.noFinanceWrite && readinessProof.noFinanceWriteFromFp0154,
  noExternalCommunicationsFromFp0154:
    sourceScope.noExternalCommunications &&
    readinessProof.noExternalCommunicationsFromFp0154,
  noPublicAssetsFromFp0154:
    sourceScope.noPublicAssets && readinessProof.noPublicAssetsFromFp0154,
  noGeneratedPublicProseFromFp0154:
    sourceScope.noGeneratedPublicProse &&
    readinessProof.noGeneratedPublicProseFromFp0154,
  noAppSubmissionFromFp0154:
    sourceScope.noAppSubmission && readinessProof.noAppSubmissionFromFp0154,
  adapterFixturesContainNoRealTokenExamples:
    noLeakageScope.fixturesLeakageScan.accepted &&
    noLeakageScope.noBearerTokenMaterial &&
    noLeakageScope.noJwtLikeExamples &&
    readinessProof.adapterFixturesContainNoRealTokenExamples,
  sharedProofOnlyLeakageSanitizerStillVerified:
    noLeakageScope.leakageScan.accepted &&
    noLeakageScope.sharedSanitizerStillStrict &&
    tokenValidationSource.includes("authorization-present-local-only") &&
    readinessProof.sharedProofOnlyLeakageSanitizerStillVerified,
  fp0153CloseoutFreshnessVerified:
    readinessProof.fp0153CloseoutFreshnessVerified,
  fp0153AppConstructionWiringBoundaryStillVerified:
    verifyFp0153AbsentOrAuthorizationParserAppConstructionWiringPlan(
      repoPaths,
    ) && priorBoundaries.fp0153AppConstructionWiringBoundaryStillVerified,
  fp0152RouteIntegrationBoundaryStillVerified:
    verifyFp0152AbsentOrAuthorizationParserRouteIntegrationImplementationPlan(
      repoPaths,
    ) && priorBoundaries.fp0152RouteIntegrationBoundaryStillVerified,
  fp0151RouteReadinessBoundaryStillVerified:
    verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan(
      repoPaths,
    ) &&
    verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary({
      fp0150PlanText,
      fp0151PlanText,
      repoPaths,
    }),
  fp0150RouteIntegrationSequencingBoundaryStillVerified:
    verifyFp0150AuthorizationParserRouteIntegrationSequencingPlanBoundary({
      planText: fp0150PlanText,
      repoPaths,
    }),
  fp0149ParserImplementationBoundaryStillVerified:
    verifyFp0149AbsentOrAuthorizationParserPureDomainImplementationPlan(
      repoPaths,
    ) &&
    Object.values(
      verifyReadOnlyMcpAuthorizationParserImplementationBoundary(repoPaths),
    ).every(Boolean),
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
    appScope,
    changedPathScope,
    noLeakageScope,
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
      `FP-0154 authorization parser local adapter readiness proof failed: ${key}`,
    );
  }
}
if (!proofOutputLeakageScan.accepted) {
  throw new Error(
    `FP-0154 proof output leaked credential material: ${proofOutputLeakageScan.rejectionReasons.join(", ")}`,
  );
}

console.log(JSON.stringify(output, null, 2));

function verifyAppScope() {
  return {
    buildAppExplicitPassThroughPreserved:
      appSource.includes(
        "readOnlyAppMcpAuthorizationParserRouteDecision:",
      ) &&
      appSource.includes(
        "container.readOnlyAppMcpAuthorizationParserRouteDecision",
      ) &&
      appSpecSource.includes(
        "passes an explicitly supplied parser route-decision dependency through buildApp only with the invalid-token challenge lane",
      ),
    defaultCreateContainerLeavesParserDependencyAbsent:
      !bootstrapSource.includes(
        "readOnlyAppMcpAuthorizationParserRouteDecision:",
      ),
    noLocalAdapterConstruction:
      !appSource.includes(
        "read-only-app-mcp-authorization-parser-local-adapter-readiness",
      ) &&
      !bootstrapSource.includes(
        "read-only-app-mcp-authorization-parser-local-adapter-readiness",
      ) &&
      !/\b(?:create|build|make)ReadOnlyMcpAuthorizationParserLocalAdapter\b/u.test(
        appSource,
      ) &&
      !/\b(?:create|build|make)ReadOnlyMcpAuthorizationParserLocalAdapter\b/u.test(
        bootstrapSource,
      ),
  };
}

function verifyRouteScope() {
  return {
    mcpRouteShapePreserved:
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1 &&
      countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
      invalidTokenChallengeSource.includes(
        "buildReadOnlyAppMcpInvalidTokenChallengeResponse",
      ),
    noLocalAdapterConstruction:
      !routeSource.includes(
        "read-only-app-mcp-authorization-parser-local-adapter-readiness",
      ) &&
      !routeSource.includes("read-only-app-mcp-authorization-parser\"") &&
      !/\b(?:create|build|make)ReadOnlyMcpAuthorizationParserLocalAdapter\b/u.test(
        routeSource,
      ),
    registrationHardeningPreserved:
      routeSource.includes("assertParserRouteDecisionCoRegistration") &&
      routeSource.includes(
        "Authorization parser route-decision dependency requires invalid-token challenge co-registration",
      ) &&
      routeSpecSource.includes(
        "fails closed before /mcp route registration when parser dependency lacks the invalid-token challenge lane",
      ),
  };
}

function verifySourceScope() {
  const modelCallPattern = ["call", "Model"].join("");
  const modelCallRegex = new RegExp(
    `\\b(?:responses\\.create|chat\\.completions|model\\s*\\.\\s*create|models\\s*\\.\\s*create|${modelCallPattern})\\s*\\(`,
    "u",
  );

  return {
    noAdapterFactoryExport:
      !/\b(?:create|build|make)ReadOnlyMcpAuthorizationParserLocalAdapter\b/u.test(
        readinessSource,
      ) && !/\bLocalAdapterFactory\b/u.test(readinessSource),
    noAdapterImplementation:
      readinessSource.includes(
        "buildReadOnlyMcpAuthorizationParserLocalAdapterReadinessProof",
      ) &&
      !/\breturn\s+(?:async\s+)?function\s+readOnlyMcpAuthorizationParserLocalAdapter\b/u.test(
        readinessSource,
      ),
    noAuthMiddleware:
      !/\b(?:authMiddleware|authorizationMiddleware|routeGuard|verifyBearer|requireAuth|authenticateRequest|setCookie)\s*\(/u.test(
        changedExecutableSource,
      ),
    noExternalCommunications:
      !/\b(?:sendEmail|sendReport|postSlack|externalMessage|publishSubmission)\s*\(/u.test(
        changedExecutableSource,
      ),
    noFinanceWrite:
      !/\b(?:writeFinanceTwin|updateLedger|financeWrite|postLedger|createJournalEntry)\s*\(/u.test(
        changedExecutableSource,
      ),
    noGeneratedPublicProse:
      !/\b(?:generateListingCopy|marketingCopy|publicDescription)\s*\(/u.test(
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
    noProviderSelection:
      !/\b(?:selectProvider|chooseProvider|resolveProvider|providerSelector)\s*\(/u.test(
        changedExecutableSource,
      ),
    noPublicAssets:
      !new RegExp(
        `\\b(?:${[
          ["screen", "Shot"].join(""),
          ["public", "Asset"].join(""),
          ["listing", "Copy"].join(""),
          ["app", "Submission", "Asset"].join(""),
        ].join("|")})\\b`,
        "u",
      ).test(changedExecutableSource),
    noSourceMutation:
      !/\b(?:uploadSource|mutateSource|rewriteSource|deleteSource)\s*\(/u.test(
        changedExecutableSource,
      ),
    noTokenIntrospection: !/\bintrospectToken\s*\(/u.test(
      changedExecutableSource,
    ),
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

function verifyNoLeakageScope(leakageText) {
  const unsafeCredentialLine = [
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
  const fixturesLeakageScan = scanProofOnlyNoTokenLeakageText(
    [readinessSource, readinessSpecSource, fp0154PlanText].join("\n"),
  );
  const tokenExampleScan = scanChangedTokenExamples(leakageText);

  return {
    fixturesLeakageScan,
    leakageScan,
    noBearerTokenMaterial: tokenExampleScan.noBearerTokenMaterial,
    noJwtLikeExamples: tokenExampleScan.noJwtLikeExamples,
    sharedSanitizerStillStrict:
      scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted ===
        false && scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted === false,
  };
}

function verifyPriorBoundaries() {
  return {
    fp0153AppConstructionWiringBoundaryStillVerified:
      verifyFp0153AbsentOrAuthorizationParserAppConstructionWiringPlan(
        repoPaths,
      ),
    fp0152RouteIntegrationBoundaryStillVerified:
      verifyFp0152AbsentOrAuthorizationParserRouteIntegrationImplementationPlan(
        repoPaths,
      ),
    fp0148ReadinessBoundaryStillVerified:
      verifyFp0148AuthorizationParserImplementationReadinessPlanBoundary({
        planText: safeRead(
          FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0147ProviderSelectionEvidenceBoundaryStillVerified:
      verifyFp0147ProviderSelectionEvidenceHardeningPlanBoundary({
        planText: safeRead(FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH),
        repoPaths,
      }),
    fp0146ParserContractsBoundaryStillVerified:
      verifyFp0146ParserContractProviderSelectionProofPlanBoundary({
        planText: safeRead(
          FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0145RuntimeContractsBoundaryStillVerified:
      verifyFp0145TokenValidationRuntimeProofHardeningPlanBoundary({
        planText: safeRead(
          FP0145_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0144ProductionTokenValidationSequencingBoundaryStillVerified:
      verifyFp0144ProductionTokenValidationSequencingPlanBoundary({
        planText: safeRead(
          FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0143InvalidTokenAppWiringBoundaryStillVerified:
      verifyFp0143AbsentOrInvalidTokenAppConstructionWiring({
        planText: safeRead(FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH),
        repoPaths,
      }),
    fp0142RouteIntegrationSequencingBoundaryStillVerified:
      verifyFp0142RouteIntegrationSequencingPlanBoundary({
        planText: safeRead(FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH),
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

function exactlyOneFp0154Plan() {
  const hits = repoPaths.filter((path) => /(^|\/)FP-0154/u.test(path));
  return (
    hits.length === 1 &&
    hits[0] ===
      FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH &&
    existsSync(FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH)
  );
}

function absentOrExactFp0155Plan() {
  const hits = repoPaths.filter((path) => /(^|\/)FP-0155/u.test(path));
  return (
    hits.length === 0 ||
    (hits.length === 1 &&
      hits[0] ===
        "plans/FP-0155-read-only-chatgpt-app-mcp-authorization-parser-local-adapter-implementation.md")
  );
}

function noFp0156Plan() {
  const hits = repoPaths.filter((path) => /(^|\/)FP-0156/u.test(path));
  return (
    hits.length === 0 ||
    (hits.length === 1 &&
      hits[0] ===
        FP0156_AUTHORIZATION_PARSER_LOCAL_ADAPTER_APP_CONSTRUCTION_INJECTION_PLAN_PATH)
  );
}

function scanChangedTokenExamples(source) {
  const bearerMaterialPattern = new RegExp(
    [
      "\\bbearer\\s+",
      "(?!scheme\\b|challenge\\b|resource\\b|resource_metadata\\b|parameter\\b|token\\b|material\\b)",
      "[a-z0-9._~+/=-]{8,}",
    ].join(""),
    "iu",
  );

  return {
    noBearerTokenMaterial: !bearerMaterialPattern.test(source),
    noJwtLikeExamples:
      !/\beyj[a-z0-9_-]{8,}\.[a-z0-9_-]{8,}\.[a-z0-9_-]{8,}\b/iu.test(source),
  };
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
