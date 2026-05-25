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
  FP0155_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_PLAN_PATH,
  MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_SCHEMA_VERSION,
  buildReadOnlyMcpAuthorizationParserLocalAdapterImplementationProof,
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
  verifyReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundary,
  verifyReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundary,
  verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary,
} from "../packages/domain/src/index.ts";

const APP_PATH = "apps/control-plane/src/app.ts";
const BOOTSTRAP_PATH = "apps/control-plane/src/bootstrap.ts";
const MCP_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const METADATA_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const INVALID_TOKEN_CHALLENGE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts";
const ADAPTER_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter.ts";
const ADAPTER_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter.spec.ts";
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
const changedLeakageText = readChangedLeakageText(changedPaths);
const appSource = safeRead(APP_PATH);
const bootstrapSource = safeRead(BOOTSTRAP_PATH);
const routeSource = safeRead(MCP_ROUTE_PATH);
const metadataRouteSource = safeRead(METADATA_ROUTE_PATH);
const invalidTokenChallengeSource = safeRead(INVALID_TOKEN_CHALLENGE_PATH);
const adapterSource = safeRead(ADAPTER_PATH);
const adapterSpecSource = safeRead(ADAPTER_SPEC_PATH);
const fp0155PlanText = safeRead(
  FP0155_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_PLAN_PATH,
);
const fp0154PlanText = safeRead(
  FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH,
);
const adapterProof =
  buildReadOnlyMcpAuthorizationParserLocalAdapterImplementationProof({
    fp0154PlanText,
    fp0155PlanText,
    repoPaths,
  });
const sourceScope = verifySourceScope();
const appScope = verifyAppScope();
const routeScope = verifyRouteScope();
const noLeakageScope = verifyNoLeakageScope(changedLeakageText);
const priorBoundaries = verifyPriorBoundaries();

const output = {
  schemaVersion:
    MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_SCHEMA_VERSION,
  fp0155AbsentOrLocalAdapterImplementationPlanVerified:
    verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan(
      repoPaths,
    ) &&
    exactlyOneFp0155Plan() &&
    adapterProof.fp0155AbsentOrLocalAdapterImplementationPlanVerified,
  fp0156Absent: verifyFp0156Absent(repoPaths) && noFp0156Plan(),
  localAdapterImplementationBoundaryVerified:
    verifyReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundary({
      fp0154PlanText,
      fp0155PlanText,
      repoPaths,
    }),
  explicitLocalAdapterFactoryImplemented:
    adapterProof.explicitLocalAdapterFactoryImplemented &&
    adapterSource.includes(
      "createReadOnlyMcpAuthorizationParserRouteDecisionDependency",
    ),
  adapterConstructionInsideAppStillBlocked:
    appScope.noAdapterImport && appScope.noAdapterConstruction,
  adapterConstructionInsideRouteStillBlocked:
    routeScope.noAdapterImport && routeScope.noAdapterConstruction,
  defaultAdapterWiringStillBlocked:
    appScope.defaultCreateContainerLeavesDependencyAbsent,
  buildAppBehaviorStillUnchanged: appScope.buildAppPassThroughPreserved,
  mcpRouteBehaviorStillUnchanged: routeScope.mcpRouteShapePreserved,
  adapterInputBoundaryImplemented: adapterProof.adapterInputBoundaryImplemented,
  adapterOutputBoundaryImplemented: adapterProof.adapterOutputBoundaryImplemented,
  adapterCompositionImplemented:
    adapterProof.adapterCompositionImplemented &&
    sourceScope.callsClassifier &&
    sourceScope.callsRouteDecisionHelper,
  adapterFailureMappingImplemented: adapterProof.adapterFailureMappingImplemented,
  adapterTestMatrixImplemented: adapterProof.adapterTestMatrixImplemented,
  adapterOutputNeverCarriesRawAuthorizationHeader:
    adapterProof.adapterOutputNeverCarriesRawAuthorizationHeader,
  adapterOutputNeverCarriesRawTokenMaterial:
    adapterProof.adapterOutputNeverCarriesRawTokenMaterial,
  adapterOutputNeverCarriesTokenDerivedFingerprint:
    adapterProof.adapterOutputNeverCarriesTokenDerivedFingerprint,
  adapterOutputNeverCarriesTokenPrefixSuffixLengthHashDigestClaimsDecodedOutput:
    adapterProof.adapterOutputNeverCarriesTokenPrefixSuffixLengthHashDigestClaimsDecodedOutput,
  adapterOutputLimitedToRouteSafeDecisionFields:
    adapterProof.adapterOutputLimitedToRouteSafeDecisionFields,
  adapterDeterministicSynchronousSideEffectFree:
    adapterProof.adapterDeterministicSynchronousSideEffectFree &&
    sourceScope.noAsyncRuntimeApis,
  adapterDoesNotImportRoutesOrApp: sourceScope.noRouteOrAppImports,
  adapterDoesNotImportDbProviderOpenAiNetworkRuntimeApis:
    sourceScope.noDbProviderOpenAiNetworkRuntimeImports,
  productionTokenValidationRuntimeStillBlocked:
    sourceScope.noProductionTokenValidation,
  providerSelectionStillDeferred: sourceScope.noProviderSelection,
  providerCallsStillBlocked: sourceScope.noProviderCalls,
  providerIntegrationStillBlocked: sourceScope.noProviderIntegration,
  tokenParserImplementationStillBlocked: sourceScope.noTokenParser,
  jwtDecoderImplementationStillBlocked: sourceScope.noJwtDecoder,
  jwksFetchImplementationStillBlocked: sourceScope.noJwksFetch,
  tokenIntrospectionImplementationStillBlocked: sourceScope.noTokenIntrospection,
  oauthImplementationStillBlocked: sourceScope.noOauthImplementation,
  tokenSessionStorageStillBlocked: sourceScope.noTokenSessionStorage,
  authMiddlewareStillBlocked: sourceScope.noAuthMiddleware,
  noOpenAiApiCallsFromFp0155: sourceScope.noOpenAiApiCalls,
  noModelCallsFromFp0155: sourceScope.noModelCalls,
  noProviderCallsFromFp0155: sourceScope.noProviderCalls,
  noSourceMutationFromFp0155: sourceScope.noSourceMutation,
  noFinanceWriteFromFp0155: sourceScope.noFinanceWrite,
  noExternalCommunicationsFromFp0155: sourceScope.noExternalCommunications,
  noPublicAssetsFromFp0155: sourceScope.noPublicAssets,
  noGeneratedPublicProseFromFp0155: sourceScope.noGeneratedPublicProse,
  noAppSubmissionFromFp0155: sourceScope.noAppSubmission,
  adapterFixturesContainNoRealTokenExamples:
    noLeakageScope.fixturesLeakageScan.accepted &&
    noLeakageScope.noBearerTokenMaterial &&
    noLeakageScope.noJwtLikeExamples,
  sharedProofOnlyLeakageSanitizerStillVerified:
    noLeakageScope.leakageScan.accepted &&
    noLeakageScope.sharedSanitizerStillStrict,
  fp0154CloseoutFreshnessVerified:
    adapterProof.fp0154CloseoutFreshnessVerified,
  fp0154LocalAdapterReadinessBoundaryStillVerified:
    verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan(
      repoPaths,
    ) &&
    verifyReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundary({
      fp0154PlanText,
      repoPaths,
    }),
  fp0153AppConstructionWiringBoundaryStillVerified:
    priorBoundaries.fp0153AppConstructionWiringBoundaryStillVerified,
  fp0152RouteIntegrationBoundaryStillVerified:
    priorBoundaries.fp0152RouteIntegrationBoundaryStillVerified,
  fp0151RouteReadinessBoundaryStillVerified:
    verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan(
      repoPaths,
    ) &&
    verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary({
      repoPaths,
    }),
  fp0150RouteIntegrationSequencingBoundaryStillVerified:
    priorBoundaries.fp0150RouteIntegrationSequencingBoundaryStillVerified,
  fp0149ParserImplementationBoundaryStillVerified:
    priorBoundaries.fp0149ParserImplementationBoundaryStillVerified,
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
      `FP-0155 authorization parser local adapter implementation proof failed: ${key}`,
    );
  }
}
if (!proofOutputLeakageScan.accepted) {
  throw new Error(
    `FP-0155 proof output leaked credential material: ${proofOutputLeakageScan.rejectionReasons.join(", ")}`,
  );
}

console.log(JSON.stringify(output, null, 2));

function verifySourceScope() {
  return {
    callsClassifier: adapterSource.includes(
      "classifyReadOnlyMcpAuthorizationHeader",
    ),
    callsRouteDecisionHelper: adapterSource.includes(
      "deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness",
    ),
    noAsyncRuntimeApis:
      !/\basync\b/u.test(adapterSource) &&
      !/\b(?:fetch|setTimeout|setInterval)\s*\(/u.test(adapterSource),
    noAuthMiddleware: !functionCallRegex([
      ["auth", "Middleware"].join(""),
      ["authorization", "Middleware"].join(""),
      ["route", "Guard"].join(""),
      ["require", "Auth"].join(""),
      ["authenticate", "Request"].join(""),
      ["set", "Cookie"].join(""),
    ]).test(adapterSource),
    noDbProviderOpenAiNetworkRuntimeImports:
      !/from ["'][^"']*(?:packages\/db|\/db|provider|network|logger|runtime)["']/u.test(
        adapterSource,
      ) &&
      !/from ["'](?:node:|openai|jose|jsonwebtoken)["']/u.test(adapterSource),
    noExternalCommunications: !functionCallRegex([
      ["send", "Email"].join(""),
      ["send", "Report"].join(""),
      ["post", "Slack"].join(""),
      ["external", "Message"].join(""),
      ["publish", "Submission"].join(""),
    ]).test(adapterSource),
    noFinanceWrite: !functionCallRegex([
      ["write", "Finance", "Twin"].join(""),
      ["update", "Ledger"].join(""),
      ["finance", "Write"].join(""),
      ["post", "Ledger"].join(""),
      ["create", "Journal", "Entry"].join(""),
    ]).test(adapterSource),
    noGeneratedPublicProse: !functionCallRegex([
      ["generate", "Listing", "Copy"].join(""),
      ["marketing", "Copy"].join(""),
      ["public", "Description"].join(""),
    ]).test(adapterSource),
    noJwtDecoder: !functionCallRegex([
      ["parse", "Jwt"].join(""),
      ["decode", "Jwt"].join(""),
      ["jwt", "Decode"].join(""),
      ["jwt", "Verify"].join(""),
      ["verify", "Jwt"].join(""),
    ]).test(adapterSource),
    noJwksFetch: !functionCallRegex([
      ["jwks", "Client"].join(""),
      ["get", "Signing", "Key"].join(""),
      ["remote", "Jwks"].join(""),
      ["create", "Remote", "JWK", "Set"].join(""),
      ["fetch", "Jwks"].join(""),
      ["load", "Jwks"].join(""),
    ]).test(adapterSource),
    noModelCalls: !functionCallRegex([
      ["responses", "create"].join("."),
      ["chat", "completions"].join("."),
      ["call", "Model"].join(""),
    ]).test(adapterSource),
    noOauthImplementation: !functionCallRegex([
      ["oauth", "Callback"].join(""),
      ["authorize", "Url"].join(""),
      ["token", "Exchange"].join(""),
      ["authorization", "Code"].join(""),
      ["pkce", "Verifier"].join(""),
    ]).test(adapterSource),
    noOpenAiApiCalls:
      !new RegExp(
        [
          ["new", "OpenAI"].join("\\s+"),
          ["from", "openai"].join("\\s+"),
          ["api", "openai", "com"].join("\\."),
        ].join("|"),
        "iu",
      ).test(adapterSource),
    noProductionTokenValidation: !functionCallRegex([
      ["validate", "Token"].join(""),
      ["verify", "Token"].join(""),
      ["token", "Validator"].join(""),
      ["validate", "Bearer"].join(""),
      ["verify", "Bearer"].join(""),
    ]).test(adapterSource),
    noProviderCalls: !functionCallRegex([
      ["provider", "Connect"].join(""),
      ["create", "Provider", "Job"].join(""),
      ["contact", "Customer"].join(""),
      ["external", "Message"].join(""),
    ]).test(adapterSource),
    noProviderIntegration: !functionCallRegex([
      ["provider", "Connect"].join(""),
      ["create", "Provider", "Job"].join(""),
      ["provider", "Adapter"].join(""),
      ["provider", "Client"].join(""),
    ]).test(adapterSource),
    noProviderSelection: !functionCallRegex([
      ["select", "Provider"].join(""),
      ["choose", "Provider"].join(""),
      ["resolve", "Provider"].join(""),
      ["provider", "Selector"].join(""),
    ]).test(adapterSource),
    noPublicAssets: !new RegExp(
      [
        ["screen", "Shot"].join(""),
        ["public", "Asset"].join(""),
        ["listing", "Copy"].join(""),
        ["app", "Submission", "Asset"].join(""),
      ].join("|"),
      "u",
    ).test(adapterSource),
    noRouteOrAppImports:
      !/from ["'][^"']*(?:apps\/|control-plane|\/routes|\/app)["']/u.test(
        adapterSource,
      ),
    noSourceMutation: !functionCallRegex([
      ["upload", "Source"].join(""),
      ["mutate", "Source"].join(""),
      ["rewrite", "Source"].join(""),
      ["delete", "Source"].join(""),
    ]).test(adapterSource),
    noTokenIntrospection: !functionCallRegex([
      ["introspect", "Token"].join(""),
    ]).test(adapterSource),
    noTokenParser: !functionCallRegex([
      ["decode", "Token"].join(""),
      ["parse", "Token"].join(""),
      ["parse", "Jwt"].join(""),
      ["decode", "Jwt"].join(""),
      ["jwt", "Decode"].join(""),
      ["introspect", "Token"].join(""),
    ]).test(adapterSource),
    noTokenSessionStorage: !functionCallRegex([
      ["token", "Store"].join(""),
      ["session", "Store"].join(""),
      ["session", "Handler"].join(""),
      ["refresh", "Token", "Store"].join(""),
      ["set", "Cookie"].join(""),
    ]).test(adapterSource),
  };
}

function verifyAppScope() {
  return {
    buildAppPassThroughPreserved:
      appSource.includes("readOnlyAppMcpAuthorizationParserRouteDecision:") &&
      appSource.includes(
        "container.readOnlyAppMcpAuthorizationParserRouteDecision",
      ),
    defaultCreateContainerLeavesDependencyAbsent:
      !bootstrapSource.includes(
        "readOnlyAppMcpAuthorizationParserRouteDecision:",
      ),
    noAdapterConstruction:
      !/\bcreateReadOnlyMcpAuthorizationParserRouteDecisionDependency\b/u.test(
        appSource,
      ) &&
      !/\bcreateReadOnlyMcpAuthorizationParserRouteDecisionDependency\b/u.test(
        bootstrapSource,
      ),
    noAdapterImport:
      !appSource.includes(
        "read-only-app-mcp-authorization-parser-local-adapter",
      ) &&
      !bootstrapSource.includes(
        "read-only-app-mcp-authorization-parser-local-adapter",
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
    noAdapterConstruction:
      !/\bcreateReadOnlyMcpAuthorizationParserRouteDecisionDependency\b/u.test(
        routeSource,
      ),
    noAdapterImport: !routeSource.includes(
      "read-only-app-mcp-authorization-parser-local-adapter",
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
    [adapterSource, adapterSpecSource, fp0155PlanText].join("\n"),
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
  const fp0150PlanText = safeRead(
    FP0150_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
  );
  const repoBoundary = { repoPaths };

  return {
    fp0153AppConstructionWiringBoundaryStillVerified:
      verifyFp0153AbsentOrAuthorizationParserAppConstructionWiringPlan(
        repoPaths,
      ),
    fp0152RouteIntegrationBoundaryStillVerified:
      verifyFp0152AbsentOrAuthorizationParserRouteIntegrationImplementationPlan(
        repoPaths,
      ),
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
    ...repoBoundary,
  };
}

function exactlyOneFp0155Plan() {
  const hits = repoPaths.filter((path) => /(^|\/)FP-0155/u.test(path));
  return (
    hits.length === 1 &&
    hits[0] === FP0155_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_PLAN_PATH &&
    existsSync(FP0155_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_PLAN_PATH)
  );
}

function noFp0156Plan() {
  return repoPaths.filter((path) => /(^|\/)FP-0156/u.test(path)).length === 0;
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

function functionCallRegex(names) {
  return new RegExp(`\\b(?:${names.join("|")})\\s*\\(`, "u");
}

function countMatches(value, pattern) {
  return value.match(pattern)?.length ?? 0;
}
