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
  verifyFp0150AuthorizationParserRouteIntegrationSequencingPlanBoundary,
  verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan,
  verifyFp0152AbsentOrAuthorizationParserRouteIntegrationImplementationPlan,
  verifyFp0153AbsentOrAuthorizationParserAppConstructionWiringPlan,
  verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan,
  verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan,
  verifyFp0156Absent,
  verifyReadOnlyMcpAuthorizationParserImplementationBoundary,
  verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary,
} from "../packages/domain/src/index.ts";

const SCHEMA_VERSION =
  "v2bu.read-only-app-mcp-authorization-parser-app-construction-wiring.v1";
const APP_PATH = "apps/control-plane/src/app.ts";
const APP_SPEC_PATH = "apps/control-plane/src/app.spec.ts";
const TYPES_PATH = "apps/control-plane/src/lib/types.ts";
const BOOTSTRAP_PATH = "apps/control-plane/src/bootstrap.ts";
const MCP_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const ROUTE_SPEC_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.spec.ts";
const METADATA_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const INVALID_TOKEN_CHALLENGE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts";
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
const typesSource = safeRead(TYPES_PATH);
const bootstrapSource = safeRead(BOOTSTRAP_PATH);
const routeSource = safeRead(MCP_ROUTE_PATH);
const routeSpecSource = safeRead(ROUTE_SPEC_PATH);
const metadataRouteSource = safeRead(METADATA_ROUTE_PATH);
const invalidTokenChallengeSource = safeRead(INVALID_TOKEN_CHALLENGE_PATH);
const tokenValidationSource = safeRead(TOKEN_VALIDATION_SOURCE_PATH);
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
  buildReadOnlyMcpAuthorizationParserRouteDecisionReadinessProof({
    fp0150PlanText,
    fp0151PlanText,
    repoPaths,
  });
const fp0153Topics = verifyFp0153PlanTopics(fp0153PlanText);
const appScope = verifyAppScope();
const routeScope = verifyRouteScope();
const sourceScope = verifySourceScope();
const noLeakageScope = verifyNoLeakageScope(changedLeakageText);
const priorBoundaries = verifyPriorBoundaries();

const output = {
  schemaVersion: SCHEMA_VERSION,
  fp0153AbsentOrAppConstructionWiringPlanVerified:
    verifyFp0153AbsentOrAuthorizationParserAppConstructionWiringPlan(
      repoPaths,
    ) &&
    exactlyOneFp0153Plan() &&
    Object.values(fp0153Topics).every(Boolean),
  fp0154AbsentOrLocalAdapterConstructionReadinessPlanVerified:
    verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan(
      repoPaths,
    ),
  fp0155AbsentOrLocalAdapterImplementationPlanVerified:
    verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan(
      repoPaths,
    ),
  fp0156Absent: verifyFp0156Absent(repoPaths),
  appConstructionWiringBoundaryVerified:
    appScope.containerPortAdded &&
    appScope.buildAppPassesExplicitDependency &&
    appScope.defaultCreateContainerLeavesDependencyAbsent &&
    fp0153Topics.appConstructionWiringIncluded,
  appContainerParserRouteDecisionPortAdded: appScope.containerPortAdded,
  buildAppPassesExplicitParserRouteDecisionDependency:
    appScope.buildAppPassesExplicitDependency,
  defaultBuildAppBehaviorStillUnchangedWhenDependencyAbsent:
    appScope.defaultBuildAppBehaviorSpecRecorded &&
    appScope.defaultCreateContainerLeavesDependencyAbsent,
  parserConstructionInsideAppStillBlocked: appScope.noParserConstruction,
  parserConstructionInsideRouteStillBlocked: routeScope.noParserConstruction,
  parserDependencyCoRegistrationHardened:
    routeScope.parserDependencyCoRegistrationHardened,
  parserDependencyRequiresInvalidTokenChallengeLane:
    routeScope.parserDependencyRequiresInvalidTokenChallengeLane,
  invalidTokenChallengeCoRegistrationStillRequiresMissingTokenAndMetadata:
    routeScope.invalidTokenChallengeCoRegistrationStillRequiresMissingTokenAndMetadata,
  routeConsumesOnlyRouteSafeParserDecision:
    routeScope.routeSafeDecisionTypeOnly &&
    routeScope.routeDecisionConsumptionLimitedToBooleans,
  parserDecisionNeverReturnedInHttpResponse:
    routeScope.noParserDecisionSend &&
    routeScope.noParserDecisionResponseSpecRecorded,
  parserDecisionNeverLogged:
    routeScope.noParserDecisionLogging && sourceScope.noTokenLogging,
  parserDecisionNeverCarriesRawAuthorizationHeader:
    readinessProof.parserDecisionNeverCarriesRawAuthorizationHeader,
  parserDecisionNeverCarriesRawTokenMaterial:
    readinessProof.parserDecisionNeverCarriesRawTokenMaterial,
  parserDecisionNeverCarriesTokenDerivedFingerprint:
    readinessProof.parserDecisionNeverCarriesTokenDerivedFingerprint,
  parserDecisionNeverCarriesTokenPrefixSuffixLengthHashDigestClaimsDecodedOutput:
    readinessProof.parserDecisionNeverCarriesTokenPrefixSuffixLengthHashDigestClaimsDecodedOutput,
  missingTokenPrecedencePreserved:
    routeScope.originBeforeMissingToken &&
    routeScope.missingTokenBeforeParserDecision &&
    routeScope.missingTokenPrecedenceSpecRecorded,
  invalidTokenChallengeDownstreamOnlyPreserved:
    routeScope.parserDecisionRoutesOnlyToExistingInvalidTokenChallenge &&
    readinessProof.invalidTokenChallengeDownstreamOnlyPreserved,
  protectedResourceMetadataRouteStillUnchanged:
    routeScope.protectedResourceMetadataRouteStillUnchanged,
  productionTokenValidationRuntimeStillBlocked:
    fp0153Topics.productionTokenValidationBlocked &&
    sourceScope.noProductionTokenValidation,
  providerSelectionStillDeferred:
    fp0153Topics.providerSelectionBlocked && sourceScope.noProviderSelection,
  providerCallsStillBlocked:
    fp0153Topics.providerCallsBlocked && sourceScope.noProviderCalls,
  providerIntegrationStillBlocked:
    fp0153Topics.providerIntegrationBlocked && sourceScope.noProviderIntegration,
  tokenParserImplementationStillBlocked:
    fp0153Topics.tokenParserBlocked && sourceScope.noTokenParser,
  jwtDecoderImplementationStillBlocked:
    fp0153Topics.jwtDecoderBlocked && sourceScope.noJwtDecoder,
  jwksFetchImplementationStillBlocked:
    fp0153Topics.jwksFetchBlocked && sourceScope.noJwksFetch,
  tokenIntrospectionImplementationStillBlocked:
    fp0153Topics.tokenIntrospectionBlocked && sourceScope.noTokenIntrospection,
  oauthImplementationStillBlocked:
    fp0153Topics.oauthBlocked && sourceScope.noOauthImplementation,
  tokenSessionStorageStillBlocked:
    fp0153Topics.tokenSessionStorageBlocked && sourceScope.noTokenSessionStorage,
  authMiddlewareStillBlocked:
    fp0153Topics.authMiddlewareBlocked && sourceScope.noAuthMiddleware,
  noOpenAiApiCallsFromFp0153: sourceScope.noOpenAiApiCalls,
  noModelCallsFromFp0153: sourceScope.noModelCalls,
  noProviderCallsFromFp0153: sourceScope.noProviderCalls,
  noSourceMutationFromFp0153: sourceScope.noSourceMutation,
  noFinanceWriteFromFp0153: sourceScope.noFinanceWrite,
  noExternalCommunicationsFromFp0153: sourceScope.noExternalCommunications,
  noPublicAssetsFromFp0153: sourceScope.noPublicAssets,
  noGeneratedPublicProseFromFp0153: sourceScope.noGeneratedPublicProse,
  noAppSubmissionFromFp0153: sourceScope.noAppSubmission,
  parserFixturesContainNoRealTokenExamples:
    noLeakageScope.fixturesLeakageScan.accepted &&
    noLeakageScope.noBearerTokenMaterial &&
    noLeakageScope.noJwtLikeExamples,
  sharedProofOnlyLeakageSanitizerStillVerified:
    noLeakageScope.leakageScan.accepted &&
    noLeakageScope.sharedSanitizerStillStrict &&
    tokenValidationSource.includes("authorization-present-local-only"),
  fp0152CloseoutFreshnessVerified: verifyFp0152CloseoutFreshness(),
  fp0152RouteIntegrationBoundaryStillVerified:
    verifyFp0152AbsentOrAuthorizationParserRouteIntegrationImplementationPlan(
      repoPaths,
    ),
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
    fp0153Topics,
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
      `FP-0153 authorization parser app-construction wiring proof failed: ${key}`,
    );
  }
}
if (!proofOutputLeakageScan.accepted) {
  throw new Error(
    `FP-0153 proof output leaked credential material: ${proofOutputLeakageScan.rejectionReasons.join(", ")}`,
  );
}

console.log(JSON.stringify(output, null, 2));

function verifyFp0153PlanTopics(planText) {
  const normalized = normalize(planText);
  return {
    appConstructionWiringIncluded:
      normalized.includes("app-construction wiring is included") &&
      (normalized.includes("explicit container dependency pass-through only") ||
        normalized.includes(
          "only as explicit container dependency pass-through",
        )),
    routeCoRegistrationIncluded:
      normalized.includes("route co-registration hardening is included") &&
      normalized.includes(
        "parser route-decision dependency requires the existing invalid-token challenge lane",
      ),
    parserConstructionBlocked:
      (normalized.includes("parser construction inside `buildapp` is excluded") ||
        normalized.includes("parser construction inside `buildapp` is not included")) &&
      (normalized.includes(
        "parser construction inside `/mcp` routes is excluded",
      ) ||
        normalized.includes(
          "parser construction inside `/mcp` routes is not included",
        )),
    defaultBehaviorUnchanged:
      (normalized.includes(
        "default `buildapp()` behavior remains unchanged when the dependency is absent",
      ) ||
        normalized.includes(
          "default `buildapp()` behavior remains unchanged when the container dependency is absent",
        )) &&
      (normalized.includes(
        "default `/mcp` behavior remains unchanged when parser route-decision dependency is absent",
      ) ||
        normalized.includes(
          "default `/mcp` behavior remains unchanged when the dependency is absent",
        )),
    containerShape:
      normalized.includes("readonlyappmcpauthorizationparserroutedecision?:") &&
      normalized.includes("readonlymcpauthorizationparserroutedecisiondependency") &&
      (normalized.includes("explicit container field only") ||
        normalized.includes("optional, explicit")) &&
      normalized.includes("no default construction") &&
      normalized.includes("no env-based construction"),
    buildAppPassThrough:
      (normalized.includes(
        "passes `container.readonlyappmcpauthorizationparserroutedecision`",
      ) ||
        normalized.includes(
          "may pass `container.readonlyappmcpauthorizationparserroutedecision`",
        )) &&
      (normalized.includes("default `createcontainer()` leaves this field absent") ||
        normalized.includes("`createcontainer()`") &&
          normalized.includes("do not construct or populate this field")),
    routeCoRegistration:
      (normalized.includes(
        "if parser route-decision dependency is supplied without invalid-token challenge, route registration fails closed",
      ) ||
        normalized.includes(
          "if the parser route-decision dependency is supplied without invalid-token challenge registration, route registration fails closed",
        )) &&
      (normalized.includes(
        "invalid-token challenge co-registration still requires missing-token challenge and protected-resource metadata evidence",
      ) ||
        normalized.includes(
          "invalid-token challenge co-registration still requires missing-token challenge and protected-resource metadata evidence requirements",
        )),
    futureFp0154Boundary:
      normalized.includes("future fp-0154 may open only") &&
      normalized.includes("local parser route-decision adapter construction readiness") &&
      normalized.includes("app-construction correction") &&
      normalized.includes("proof-gate correction"),
    productionTokenValidationBlocked: normalized.includes(
      "production token-validation runtime cannot start after fp-0153",
    ),
    providerSelectionBlocked: normalized.includes(
      "provider selection cannot start after fp-0153",
    ),
    providerCallsBlocked: normalized.includes("provider calls") &&
      normalized.includes("not implement"),
    providerIntegrationBlocked: normalized.includes("provider integration") &&
      normalized.includes("not implement"),
    tokenParserBlocked: normalized.includes("token parser implementation") &&
      normalized.includes("not implement"),
    jwtDecoderBlocked:
      (normalized.includes("jwt decoder") ||
        normalized.includes("jwt decoding")) &&
      normalized.includes("not implement"),
    jwksFetchBlocked: normalized.includes("jwks fetching") &&
      normalized.includes("not implement"),
    tokenIntrospectionBlocked: normalized.includes("token introspection") &&
      normalized.includes("not implement"),
    oauthBlocked: normalized.includes(
      "oauth/session/auth middleware cannot start after fp-0153",
    ),
    tokenSessionStorageBlocked:
      (normalized.includes("token/session storage") ||
        normalized.includes("token or session storage")) &&
      normalized.includes("not implement"),
    authMiddlewareBlocked: normalized.includes(
      "auth middleware cannot start after fp-0153",
    ),
    priorBoundaries:
      (normalized.includes("fp-0152 route integration") ||
        normalized.includes("fp-0152 route behavior")) &&
      normalized.includes("fp-0151") &&
      normalized.includes("fp-0150") &&
      normalized.includes("fp-0149") &&
      normalized.includes("fp-0143") &&
      normalized.includes("fp-0139") &&
      normalized.includes("fp-0130") &&
      normalized.includes("fp-0125") &&
      normalized.includes("fp-0100"),
  };
}

function verifyAppScope() {
  return {
    buildAppPassesExplicitDependency:
      appSource.includes(
        "readOnlyAppMcpAuthorizationParserRouteDecision:",
      ) &&
      appSource.includes(
        "container.readOnlyAppMcpAuthorizationParserRouteDecision",
      ),
    containerPortAdded:
      typesSource.includes(
        "ReadOnlyAppMcpAuthorizationParserRouteDecisionPort",
      ) &&
      typesSource.includes(
        "ReadOnlyMcpAuthorizationParserRouteDecisionDependency",
      ) &&
      typesSource.includes(
        "readOnlyAppMcpAuthorizationParserRouteDecision?: ReadOnlyAppMcpAuthorizationParserRouteDecisionPort",
      ),
    defaultBuildAppBehaviorSpecRecorded:
      appSpecSource.includes(
        "does not construct a parser route-decision dependency in default containers or app construction",
      ) &&
      appSpecSource.includes(
        "passes an explicitly supplied parser route-decision dependency through buildApp only with the invalid-token challenge lane",
      ),
    defaultCreateContainerLeavesDependencyAbsent:
      !bootstrapSource.includes(
        "readOnlyAppMcpAuthorizationParserRouteDecision:",
      ),
    noParserConstruction:
      noPureParserImport(appSource) &&
      noPureParserImport(bootstrapSource) &&
      !/\bparseReadOnlyMcpAuthorizationHeader\s*\(/u.test(appSource) &&
      !/\bparseReadOnlyMcpAuthorizationHeader\s*\(/u.test(bootstrapSource),
  };
}

function verifyRouteScope() {
  const routeBody = routeSource.slice(routeSource.indexOf('app.post("/mcp"'));
  const originIndex = routeBody.indexOf("const originValidation");
  const originRejectedIndex = routeBody.indexOf("sendOriginRejected");
  const missingTokenIndex = routeBody.indexOf(
    "request.headers.authorization === undefined",
  );
  const parserDecisionIndex = routeBody.indexOf(
    "parserRouteDecisionDependency({",
  );

  return {
    invalidTokenChallengeCoRegistrationStillRequiresMissingTokenAndMetadata:
      routeSource.includes("assertInvalidTokenChallengeCoRegistration") &&
      routeSource.includes(
        "Invalid-token challenge requires missing-token challenge co-registration",
      ) &&
      routeSource.includes(
        "Invalid-token challenge requires protected-resource metadata route evidence dependency",
      ),
    missingTokenPrecedenceSpecRecorded:
      routeSpecSource.includes(
        "keeps missing-token challenge ahead of the parser route-decision dependency",
      ),
    noParserConstruction:
      noPureParserImport(routeSource) &&
      !/\bparseReadOnlyMcpAuthorizationHeader\s*\(/u.test(routeSource) &&
      !/\bclassifyReadOnlyMcpAuthorizationHeader\s*\(/u.test(routeSource),
    noParserDecisionLogging:
      !/\b(?:console|logger)\s*\.[a-z]+\s*\([^)]*parserRouteDecision/iu.test(
        routeSource,
      ),
    noParserDecisionResponseSpecRecorded:
      routeSpecSource.includes("expectNoParserDecisionExposure"),
    noParserDecisionSend: !/\.send\s*\(\s*parserRouteDecision\b/u.test(
      routeSource,
    ),
    originBeforeMissingToken:
      originIndex >= 0 &&
      originRejectedIndex > originIndex &&
      missingTokenIndex > originRejectedIndex,
    missingTokenBeforeParserDecision:
      missingTokenIndex >= 0 &&
      parserDecisionIndex > missingTokenIndex,
    parserDependencyCoRegistrationHardened:
      routeSource.includes("assertParserRouteDecisionCoRegistration") &&
      routeSource.includes(
        "Authorization parser route-decision dependency requires invalid-token challenge co-registration",
      ) &&
      routeSpecSource.includes(
        "fails closed before /mcp route registration when parser dependency lacks the invalid-token challenge lane",
      ) &&
      routeSpecSource.includes(
        "fails closed before /mcp route registration when parser dependency is supplied without any challenge lane",
      ),
    parserDependencyRequiresInvalidTokenChallengeLane:
      routeSource.includes("input.invalidTokenChallenge === null") &&
      routeSource.includes(
        "Authorization parser route-decision dependency requires invalid-token challenge co-registration",
      ),
    parserDecisionRoutesOnlyToExistingInvalidTokenChallenge:
      routeSource.includes("routesToExistingInvalidTokenChallenge") &&
      routeSource.includes("invalidTokenChallenge.wwwAuthenticate") &&
      routeSource.includes("invalidTokenChallenge.body"),
    protectedResourceMetadataRouteStillUnchanged:
      countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
      metadataRouteSource.includes(
        "READ_ONLY_APP_MCP_PROTECTED_RESOURCE_METADATA_ROUTE_PATH",
      ),
    routeDecisionConsumptionLimitedToBooleans:
      !/parser_failure_state|envelope_failure|raw|prefix|suffix|hash|digest|claims|decoded/u.test(
        routeSource,
      ) &&
      routeSource.includes("decision.authorization_presence") &&
      routeSource.includes("decision.invalid_token_challenge_downstream_only") &&
      routeSource.includes("decision.maps_to_fp0130_missing_token_lane") &&
      routeSource.includes("decision.maps_to_fp0139_result_envelope") &&
      routeSource.includes("decision.credential_material_observed"),
    routeSafeDecisionTypeOnly:
      routeSource.includes(
        "ReadOnlyMcpAuthorizationParserRouteDecisionReadiness",
      ) &&
      routeSource.includes(
        "ReadOnlyMcpAuthorizationParserRouteDecisionDependency",
      ) &&
      noPureParserImport(routeSource),
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
    noPublicAssets: !publicAssetRegex.test(changedExecutableSource),
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

function verifyNoLeakageScope(leakageText) {
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
  const fixturesLeakageScan = scanProofOnlyNoTokenLeakageText(
    [appSpecSource, routeSpecSource, fp0153PlanText].join("\n"),
  );
  const tokenExampleScan = scanChangedTokenExamples(leakageText);

  return {
    fixturesLeakageScan,
    leakageScan,
    noBearerTokenMaterial: tokenExampleScan.noBearerTokenMaterial,
    noJwtLikeExamples: tokenExampleScan.noJwtLikeExamples,
    sharedSanitizerStillStrict:
      scanProofOnlyNoTokenLeakageText(unsafeBearerLine).accepted === false &&
      scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted === false,
  };
}

function verifyFp0152CloseoutFreshness() {
  const normalized = normalize(fp0152PlanText);
  return (
    normalized.includes("pr #331 merged") &&
    normalized.includes("ade9c5c63487505bc3698a5bec51161cfeb358dd") &&
    normalized.includes("867544bda1f3cd7c44fc8103fa8579e80ef7103f") &&
    normalized.includes("static") &&
    normalized.includes("integration-db") &&
    normalized.includes(
      "post-merge same-branch qa found no issues and made no correction",
    ) &&
    normalized.includes(
      "no post-merge qa is required when current `main` matches the validated pr head/merge posture and ci remains green",
    )
  );
}

function verifyPriorBoundaries() {
  return {
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

function noPureParserImport(source) {
  return !/read-only-app-mcp-authorization-parser["']/u.test(source);
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

function exactlyOneFp0153Plan() {
  const hits = repoPaths.filter((path) => /(^|\/)FP-0153/u.test(path));
  return (
    hits.length === 1 &&
    hits[0] === FP0153_AUTHORIZATION_PARSER_APP_CONSTRUCTION_WIRING_PLAN_PATH &&
    existsSync(FP0153_AUTHORIZATION_PARSER_APP_CONSTRUCTION_WIRING_PLAN_PATH)
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
