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
  FP0156_AUTHORIZATION_PARSER_LOCAL_ADAPTER_APP_CONSTRUCTION_INJECTION_PLAN_PATH,
  FP0157_AUTHORIZATION_PARSER_LOCAL_AUTH_DEMO_HARNESS_PLAN_PATH,
  buildMcpWwwAuthenticateLocalProofGatedMissingTokenChallengeDependency,
  buildProtectedResourceMetadataRouteInputEvidenceBundle,
  buildReadOnlyMcpAuthorizationParserLocalAdapterImplementationProof,
  buildTokenValidationResultEnvelope,
  buildTokenValidationResultEnvelopeInputDescriptor,
  createReadOnlyMcpAuthorizationParserRouteDecisionDependency,
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
  validRouteInput,
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
  verifyFp0156AbsentOrAuthorizationParserLocalAdapterAppConstructionInjectionPlan,
  verifyFp0157AbsentOrReadOnlyMcpAuthLocalDemoHarnessPlan,
  verifyFp0158Absent,
  verifyReadOnlyMcpAuthorizationParserImplementationBoundary,
  verifyReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundary,
  verifyReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundary,
  verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary,
} from "../packages/domain/src/index.ts";
import { createInMemoryContainer } from "../apps/control-plane/src/bootstrap.ts";
import {
  READ_ONLY_APP_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_APP_CONSTRUCTION_ERROR,
  READ_ONLY_APP_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_DOUBLE_INJECTION_ERROR,
  withReadOnlyAppMcpAuthorizationParserLocalAdapter,
} from "../apps/control-plane/src/read-only-app-mcp-authorization-parser-local-adapter-app-construction.ts";

const SCHEMA_VERSION =
  "v2by.read-only-chatgpt-app-mcp-auth-local-demo-harness-proof.v1";

const APP_PATH = "apps/control-plane/src/app.ts";
const APP_SPEC_PATH = "apps/control-plane/src/app.spec.ts";
const BOOTSTRAP_PATH = "apps/control-plane/src/bootstrap.ts";
const APP_HELPER_PATH =
  "apps/control-plane/src/read-only-app-mcp-authorization-parser-local-adapter-app-construction.ts";
const MCP_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const ROUTE_SPEC_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.spec.ts";
const METADATA_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const INVALID_TOKEN_CHALLENGE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts";
const HARNESS_PATH = "tools/read-only-mcp-auth-local-demo-harness.mjs";
const FP0156_PROOF_PATH =
  "tools/read-only-mcp-authorization-parser-local-adapter-app-construction-injection-proof.mjs";
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
const appSpecSource = safeRead(APP_SPEC_PATH);
const bootstrapSource = safeRead(BOOTSTRAP_PATH);
const appHelperSource = safeRead(APP_HELPER_PATH);
const routeSource = safeRead(MCP_ROUTE_PATH);
const routeSpecSource = safeRead(ROUTE_SPEC_PATH);
const metadataRouteSource = safeRead(METADATA_ROUTE_PATH);
const invalidTokenChallengeSource = safeRead(INVALID_TOKEN_CHALLENGE_PATH);
const harnessSource = safeRead(HARNESS_PATH);
const fp0157PlanText = safeRead(
  FP0157_AUTHORIZATION_PARSER_LOCAL_AUTH_DEMO_HARNESS_PLAN_PATH,
);
const fp0156PlanText = safeRead(
  FP0156_AUTHORIZATION_PARSER_LOCAL_ADAPTER_APP_CONSTRUCTION_INJECTION_PLAN_PATH,
);
const fp0155PlanText = safeRead(
  FP0155_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_PLAN_PATH,
);
const fp0154PlanText = safeRead(
  FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH,
);
const harnessSummary = runHarness();
const runtimeDependency =
  createReadOnlyMcpAuthorizationParserRouteDecisionDependency();
const decisionFields = Object.keys(runtimeDependency({}));
const planScope = verifyPlanScope();
const helperScope = verifyHelperScope();
const harnessScope = verifyHarnessScope();
const appScope = verifyAppScope();
const routeScope = verifyRouteScope();
const sourceScope = verifySourceScope();
const noLeakageScope = verifyNoLeakageScope(changedLeakageText);
const priorBoundaries = verifyPriorBoundaries();
const adapterProof =
  buildReadOnlyMcpAuthorizationParserLocalAdapterImplementationProof({
    fp0154PlanText,
    fp0155PlanText,
    repoPaths,
  });

const output = {
  schemaVersion: SCHEMA_VERSION,
  fp0157AbsentOrLocalAuthDemoHarnessPlanVerified:
    verifyFp0157AbsentOrReadOnlyMcpAuthLocalDemoHarnessPlan(repoPaths) &&
    planScope.exactlyOneFp0157Plan,
  fp0158Absent: verifyFp0158Absent(repoPaths) && planScope.noFp0158Plan,
  localAuthDemoHarnessBoundaryVerified:
    planScope.localDemoOnlyPlan &&
    harnessScope.localOnly &&
    harnessScope.inMemoryOnly,
  explicitHelperOnlyLocalHarnessVerified:
    harnessScope.usesExplicitHelper &&
    !harnessScope.constructsAdapterDirectly &&
    !harnessScope.wiresDefaultAdapter,
  helperDoubleInjectionFailsClosed:
    helperScope.doubleInjectionThrowsDeterministicError &&
    helperScope.doubleInjectionCheckBeforeFactoryConstruction,
  helperStillRequiresInvalidTokenMissingTokenAndMetadataLane:
    helperScope.coRegistrationErrorPreserved &&
    helperScope.incompleteCoRegistrationStillFailsClosed,
  defaultAdapterWiringStillBlocked:
    appScope.defaultCreateContainerLeavesDependencyAbsent &&
    appScope.defaultCreateInMemoryContainerLeavesDependencyAbsent,
  defaultCreateContainerBehaviorStillUnchanged:
    appScope.defaultCreateContainerLeavesDependencyAbsent,
  defaultCreateInMemoryContainerBehaviorStillUnchanged:
    appScope.defaultCreateInMemoryContainerLeavesDependencyAbsent,
  defaultBuildAppBehaviorStillUnchanged:
    appScope.buildAppPassThroughPreserved &&
    appScope.buildAppDoesNotCallExplicitHelper &&
    harnessSummary.defaultBehaviorPreserved === true,
  mcpRouteBehaviorStillUnchanged: routeScope.mcpRouteShapePreserved,
  protectedResourceMetadataRouteStillUnchanged:
    routeScope.protectedResourceMetadataRouteShapePreserved,
  localHarnessMissingAuthorizationChallengeVerified:
    harnessSummary.missingAuthorizationChallengeVerified === true,
  localHarnessAuthorizationPresentInvalidChallengeVerified:
    harnessSummary.authorizationPresentInvalidChallengeVerified === true,
  localHarnessMetadataRouteVerified:
    harnessSummary.metadataRouteVerified === true,
  localHarnessSanitizedSummaryOnly:
    harnessScope.summaryFieldsOnly &&
    harnessScope.outputLeakageScan.accepted &&
    harnessSummary.noCredentialMaterialExposed === true,
  parserDecisionNeverReturnedInHttpResponse:
    routeScope.responseNoParserDecisionObjectExposure &&
    harnessSummary.noParserDecisionObjectExposed === true,
  parserDecisionNeverLogged:
    routeScope.noRouteParserDecisionLogging && harnessScope.summaryConsoleOnly,
  parserDecisionNeverCarriesRawAuthorizationHeader:
    !decisionFields.includes("authorization_header") &&
    !decisionFields.includes("raw_authorization_header"),
  parserDecisionNeverCarriesRawTokenMaterial:
    !decisionFields.includes("raw_token") && !decisionFields.includes("token"),
  parserDecisionNeverCarriesTokenDerivedFingerprint:
    !decisionFields.includes("token_fingerprint"),
  parserFixturesContainNoRealTokenExamples:
    noLeakageScope.fixturesLeakageScan.accepted &&
    noLeakageScope.noBearerTokenMaterial &&
    noLeakageScope.noJwtLikeExamples,
  sharedProofOnlyLeakageSanitizerStillVerified:
    noLeakageScope.leakageScan.accepted &&
    noLeakageScope.sharedSanitizerStillStrict,
  productionTokenValidationRuntimeStillBlocked:
    sourceScope.noProductionTokenValidation &&
    harnessSummary.productionTokenValidationImplemented === false,
  providerSelectionStillDeferred: sourceScope.noProviderSelection,
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
  noOpenAiApiCallsFromFp0157: sourceScope.noOpenAiApiCalls,
  noModelCallsFromFp0157: sourceScope.noModelCalls,
  noProviderCallsFromFp0157: sourceScope.noProviderCalls,
  noSourceMutationFromFp0157: sourceScope.noSourceMutation,
  noFinanceWriteFromFp0157: sourceScope.noFinanceWrite,
  noExternalCommunicationsFromFp0157: sourceScope.noExternalCommunications,
  noPublicAssetsFromFp0157: sourceScope.noPublicAssets,
  noGeneratedPublicProseFromFp0157: sourceScope.noGeneratedPublicProse,
  noAppSubmissionFromFp0157: sourceScope.noAppSubmission,
  fp0156CloseoutFreshnessVerified: verifyFp0156CloseoutFreshness(),
  fp0156AppConstructionInjectionBoundaryStillVerified:
    verifyFp0156AbsentOrAuthorizationParserLocalAdapterAppConstructionInjectionPlan(
      repoPaths,
    ) &&
    appScope.buildAppPassThroughPreserved &&
    helperScope.coRegistrationErrorPreserved,
  fp0155LocalAdapterImplementationBoundaryStillVerified:
    verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan(
      repoPaths,
    ) &&
    verifyReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundary({
      fp0154PlanText,
      fp0155PlanText,
      repoPaths,
    }) &&
    adapterProof.localAdapterImplementationBoundaryVerified,
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
    decisionFields,
    harnessScope,
    harnessSummary,
    helperScope,
    noLeakageScope,
    planScope,
    routeScope,
    sourceScope,
  },
};

const proofOutputLeakageScan = scanProofOnlyNoTokenLeakageText(
  JSON.stringify(output),
);

for (const [key, value] of Object.entries(output)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(`FP-0157 local auth demo harness proof failed: ${key}`);
  }
}
if (!proofOutputLeakageScan.accepted) {
  throw new Error(
    `FP-0157 proof output leaked credential material: ${proofOutputLeakageScan.rejectionReasons.join(", ")}`,
  );
}

console.log(JSON.stringify(output, null, 2));

function runHarness() {
  const stdout = execFileSync(
    "pnpm",
    ["exec", "tsx", "tools/read-only-mcp-auth-local-demo-harness.mjs"],
    { encoding: "utf8" },
  );
  return JSON.parse(stdout);
}

function verifyPlanScope() {
  const fp0157Hits = repoPaths.filter((path) => /(^|\/)FP-0157/u.test(path));
  const normalized = normalizePlanText(fp0157PlanText);

  return {
    exactlyOneFp0157Plan:
      fp0157Hits.length === 1 &&
      fp0157Hits[0] ===
        FP0157_AUTHORIZATION_PARSER_LOCAL_AUTH_DEMO_HARNESS_PLAN_PATH &&
      existsSync(FP0157_AUTHORIZATION_PARSER_LOCAL_AUTH_DEMO_HARNESS_PLAN_PATH),
    localDemoOnlyPlan: includesAll(normalized, [
      "a local read-only mcp auth demo/smoke harness is included",
      "helper double-injection fail-closed hardening is included",
      "default adapter construction is not included",
      "default `createcontainer()` and `createinmemorycontainer()` behavior do not change",
      "default `buildapp()` behavior does not change when the helper is not used",
      "production token-validation runtime cannot start after fp-0157",
      "provider selection cannot start after fp-0157",
      "oauth/session/auth middleware cannot start after fp-0157",
      "public chatgpt app demo/submission cannot start after fp-0157",
      "future fp-0158 may open only",
    ]),
    noFp0158Plan: repoPaths.every((path) => !/(^|\/)FP-0158/u.test(path)),
  };
}

function verifyHelperScope() {
  const completeContainer = completeHelperContainer();
  const injected =
    withReadOnlyAppMcpAuthorizationParserLocalAdapter(completeContainer);
  const partialContainers = [
    {
      ...completeContainer,
      readOnlyAppMcpInvalidTokenChallengeResultEnvelope: undefined,
    },
    {
      ...completeContainer,
      readOnlyAppMcpLocalProofGatedMissingTokenChallenge: undefined,
    },
    {
      ...completeContainer,
      readOnlyAppMcpProtectedResourceMetadataRouteInputEvidenceBundle:
        undefined,
    },
  ];
  const dependencyIndex = appHelperSource.indexOf(
    "container.readOnlyAppMcpAuthorizationParserRouteDecision",
  );
  const factoryIndex = appHelperSource.indexOf(
    "createReadOnlyMcpAuthorizationParserRouteDecisionDependency()",
  );

  return {
    coRegistrationErrorPreserved: appHelperSource.includes(
      READ_ONLY_APP_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_APP_CONSTRUCTION_ERROR,
    ),
    doubleInjectionCheckBeforeFactoryConstruction:
      dependencyIndex >= 0 && factoryIndex > dependencyIndex,
    doubleInjectionThrowsDeterministicError:
      throwsMessage(
        () =>
          withReadOnlyAppMcpAuthorizationParserLocalAdapter({
            ...completeContainer,
            readOnlyAppMcpAuthorizationParserRouteDecision: runtimeDependency,
          }),
        READ_ONLY_APP_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_DOUBLE_INJECTION_ERROR,
      ) &&
      completeContainer.readOnlyAppMcpAuthorizationParserRouteDecision ===
        undefined,
    incompleteCoRegistrationStillFailsClosed: partialContainers.every(
      (container) =>
        throwsMessage(
          () => withReadOnlyAppMcpAuthorizationParserLocalAdapter(container),
          READ_ONLY_APP_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_APP_CONSTRUCTION_ERROR,
        ),
    ),
    noInputMutation:
      injected !== completeContainer &&
      completeContainer.readOnlyAppMcpAuthorizationParserRouteDecision ===
        undefined &&
      typeof injected.readOnlyAppMcpAuthorizationParserRouteDecision ===
        "function",
  };
}

function completeHelperContainer() {
  return {
    ...createInMemoryContainer(),
    readOnlyAppMcpInvalidTokenChallengeResultEnvelope:
      buildTokenValidationResultEnvelope(
        buildTokenValidationResultEnvelopeInputDescriptor({
          outcome: "invalid_token",
        }),
      ),
    readOnlyAppMcpLocalProofGatedMissingTokenChallenge:
      buildMcpWwwAuthenticateLocalProofGatedMissingTokenChallengeDependency(),
    readOnlyAppMcpProtectedResourceMetadataRouteInputEvidenceBundle:
      buildProtectedResourceMetadataRouteInputEvidenceBundle(validRouteInput),
  };
}

function verifyHarnessScope() {
  const summaryKeys = Object.keys(harnessSummary).sort();
  const outputLeakageScan = scanProofOnlyNoTokenLeakageText(
    JSON.stringify(harnessSummary),
  );

  return {
    constructsAdapterDirectly: harnessSource.includes(
      "createReadOnlyMcpAuthorizationParserRouteDecisionDependency",
    ),
    inMemoryOnly:
      harnessSource.includes("createInMemoryContainer") &&
      !harnessSource.includes("createContainer()") &&
      !harnessSource.includes("createServerContainer"),
    localOnly: harnessSummary.localOnly === true,
    outputLeakageScan,
    summaryConsoleOnly:
      countMatches(harnessSource, /console\.log/gu) === 1 &&
      harnessSource.includes("console.log(JSON.stringify(summary, null, 2))"),
    summaryFieldsOnly:
      JSON.stringify(summaryKeys) ===
      JSON.stringify(
        [
          "authorizationPresentInvalidChallengeVerified",
          "defaultBehaviorPreserved",
          "explicitHelperOnly",
          "localOnly",
          "metadataRouteVerified",
          "missingAuthorizationChallengeVerified",
          "noCredentialMaterialExposed",
          "noParserDecisionObjectExposed",
          "productionTokenValidationImplemented",
        ].sort(),
      ),
    usesExplicitHelper: harnessSource.includes(
      "withReadOnlyAppMcpAuthorizationParserLocalAdapter",
    ),
    wiresDefaultAdapter:
      bootstrapSource.includes(
        "readOnlyAppMcpAuthorizationParserRouteDecision:",
      ) ||
      appSource.includes("withReadOnlyAppMcpAuthorizationParserLocalAdapter"),
  };
}

function verifyAppScope() {
  return {
    buildAppDoesNotCallExplicitHelper:
      !appSource.includes(
        "withReadOnlyAppMcpAuthorizationParserLocalAdapter",
      ) &&
      !bootstrapSource.includes(
        "withReadOnlyAppMcpAuthorizationParserLocalAdapter",
      ),
    buildAppPassThroughPreserved:
      appSource.includes("readOnlyAppMcpAuthorizationParserRouteDecision:") &&
      appSource.includes(
        "container.readOnlyAppMcpAuthorizationParserRouteDecision",
      ),
    defaultCreateContainerLeavesDependencyAbsent:
      !bootstrapSource.includes(
        "readOnlyAppMcpAuthorizationParserRouteDecision:",
      ) && bootstrapSource.includes("export async function createContainer"),
    defaultCreateInMemoryContainerLeavesDependencyAbsent:
      !bootstrapSource.includes(
        "readOnlyAppMcpAuthorizationParserRouteDecision:",
      ) && bootstrapSource.includes("createInMemoryContainer"),
  };
}

function verifyRouteScope() {
  const postRouteIndex = routeSource.indexOf('app.post("/mcp"');
  const postRouteSource =
    postRouteIndex === -1 ? "" : routeSource.slice(postRouteIndex);
  const originIndex = postRouteSource.indexOf(
    "const originValidation = validateLocalMcpOriginHeader",
  );
  const missingTokenIndex = postRouteSource.indexOf(
    "if (missingTokenChallenge && request.headers.authorization === undefined)",
  );
  const parserCallIndex = postRouteSource.indexOf(
    "parserRouteDecisionDependency({",
  );

  return {
    mcpRouteShapePreserved:
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1,
    missingTokenBeforeParser:
      missingTokenIndex !== -1 &&
      parserCallIndex !== -1 &&
      missingTokenIndex < parserCallIndex,
    noRouteParserDecisionLogging:
      !routeSource.includes("logger") &&
      !routeSource.includes("console.") &&
      !routeSource.includes("parserRouteDecision,"),
    originBeforeParser:
      originIndex !== -1 &&
      parserCallIndex !== -1 &&
      originIndex < parserCallIndex,
    protectedResourceMetadataRouteShapePreserved:
      countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
      metadataRouteSource.includes(
        "assertProtectedResourceMetadataRouteInputEvidenceBundleAcceptedForLocalRouteRegistration",
      ),
    responseNoParserDecisionObjectExposure:
      !routeSource.includes(".send(parserRouteDecision") &&
      !routeSource.includes("return parserRouteDecision") &&
      appSpecSource.includes(
        "parser_route_decision_contract_version|authorization_scheme_classification|credential_material_observed|parser_failure_state|envelope_failure",
      ) &&
      routeSpecSource.includes(
        "routes malformed and unsupported parser decisions to the existing invalid-token challenge",
      ),
    invalidTokenChallengeUsesSanitizedEnvelopeLane:
      invalidTokenChallengeSource.includes("noTokenEcho") &&
      routeSource.includes("routesToExistingInvalidTokenChallenge"),
  };
}

function verifySourceScope() {
  const fp0157RuntimeSource = [
    appHelperSource,
    harnessSource,
    appSource,
    bootstrapSource,
    routeSource,
    metadataRouteSource,
    invalidTokenChallengeSource,
  ].join("\n");

  return {
    noAuthMiddleware: !functionCallRegex([
      ["auth", "Middleware"].join(""),
      ["authorization", "Middleware"].join(""),
      ["route", "Guard"].join(""),
      ["require", "Auth"].join(""),
      ["authenticate", "Request"].join(""),
      ["set", "Cookie"].join(""),
    ]).test(fp0157RuntimeSource),
    noExternalCommunications: !functionCallRegex([
      ["send", "Email"].join(""),
      ["send", "Report"].join(""),
      ["post", "Slack"].join(""),
      ["external", "Message"].join(""),
      ["publish", "Submission"].join(""),
    ]).test(fp0157RuntimeSource),
    noFinanceWrite: !functionCallRegex([
      ["write", "Finance", "Twin"].join(""),
      ["update", "Ledger"].join(""),
      ["finance", "Write"].join(""),
      ["post", "Ledger"].join(""),
      ["create", "Journal", "Entry"].join(""),
    ]).test(fp0157RuntimeSource),
    noGeneratedPublicProse: !functionCallRegex([
      ["generate", "Listing", "Copy"].join(""),
      ["marketing", "Copy"].join(""),
      ["public", "Description"].join(""),
    ]).test(fp0157RuntimeSource),
    noJwtDecoder: !functionCallRegex([
      ["parse", "Jwt"].join(""),
      ["decode", "Jwt"].join(""),
      ["jwt", "Decode"].join(""),
      ["jwt", "Verify"].join(""),
      ["verify", "Jwt"].join(""),
    ]).test(fp0157RuntimeSource),
    noJwksFetch: !functionCallRegex([
      ["jwks", "Client"].join(""),
      ["get", "Signing", "Key"].join(""),
      ["remote", "Jwks"].join(""),
      ["create", "Remote", "JWK", "Set"].join(""),
      ["fetch", "Jwks"].join(""),
      ["load", "Jwks"].join(""),
    ]).test(fp0157RuntimeSource),
    noModelCalls: !functionCallRegex([
      ["responses", "create"].join("."),
      ["chat", "completions"].join("."),
      ["call", "Model"].join(""),
    ]).test(fp0157RuntimeSource),
    noOauthImplementation: !functionCallRegex([
      ["oauth", "Callback"].join(""),
      ["authorize", "Url"].join(""),
      ["token", "Exchange"].join(""),
      ["authorization", "Code"].join(""),
      ["pkce", "Verifier"].join(""),
    ]).test(fp0157RuntimeSource),
    noOpenAiApiCalls: !new RegExp(
      [
        ["new", "OpenAI"].join("\\s+"),
        ["from", "openai"].join("\\s+"),
        ["api", "openai", "com"].join("\\."),
      ].join("|"),
      "iu",
    ).test(fp0157RuntimeSource),
    noProductionTokenValidation: !functionCallRegex([
      ["validate", "Token"].join(""),
      ["verify", "Token"].join(""),
      ["token", "Validator"].join(""),
      ["validate", "Bearer"].join(""),
      ["verify", "Bearer"].join(""),
    ]).test(fp0157RuntimeSource),
    noProviderCalls: !functionCallRegex([
      ["provider", "Connect"].join(""),
      ["create", "Provider", "Job"].join(""),
      ["contact", "Customer"].join(""),
      ["external", "Message"].join(""),
    ]).test(fp0157RuntimeSource),
    noProviderIntegration: !functionCallRegex([
      ["provider", "Connect"].join(""),
      ["create", "Provider", "Job"].join(""),
      ["provider", "Adapter"].join(""),
      ["provider", "Client"].join(""),
    ]).test(fp0157RuntimeSource),
    noProviderSelection: !functionCallRegex([
      ["select", "Provider"].join(""),
      ["choose", "Provider"].join(""),
      ["resolve", "Provider"].join(""),
      ["provider", "Selector"].join(""),
    ]).test(fp0157RuntimeSource),
    noPublicAssets: !new RegExp(
      [
        ["screen", "Shot"].join(""),
        ["public", "Asset"].join(""),
        ["listing", "Copy"].join(""),
        ["app", "Submission", "Asset"].join(""),
      ].join("|"),
      "u",
    ).test(fp0157RuntimeSource),
    noSourceMutation: !functionCallRegex([
      ["upload", "Source"].join(""),
      ["mutate", "Source"].join(""),
      ["rewrite", "Source"].join(""),
      ["delete", "Source"].join(""),
    ]).test(fp0157RuntimeSource),
    noTokenIntrospection: !functionCallRegex([
      ["introspect", "Token"].join(""),
    ]).test(fp0157RuntimeSource),
    noTokenParser: !functionCallRegex([
      ["decode", "Token"].join(""),
      ["parse", "Token"].join(""),
      ["parse", "Jwt"].join(""),
      ["decode", "Jwt"].join(""),
      ["jwt", "Decode"].join(""),
      ["introspect", "Token"].join(""),
    ]).test(fp0157RuntimeSource),
    noTokenSessionStorage: !functionCallRegex([
      ["token", "Store"].join(""),
      ["session", "Store"].join(""),
      ["session", "Handler"].join(""),
      ["refresh", "Token", "Store"].join(""),
      ["set", "Cookie"].join(""),
    ]).test(fp0157RuntimeSource),
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
    [
      appHelperSource,
      appSpecSource,
      harnessSource,
      fp0157PlanText,
      fp0156PlanText,
    ].join("\n"),
  );
  const tokenExampleScan = scanChangedTokenExamples(leakageText);

  return {
    fixturesLeakageScan,
    leakageScan,
    noBearerTokenMaterial: tokenExampleScan.noBearerTokenMaterial,
    noJwtLikeExamples: tokenExampleScan.noJwtLikeExamples,
    sharedSanitizerStillStrict:
      scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted ===
        false &&
      scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted === false,
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
    fp0150RouteIntegrationSequencingBoundaryStillVerified:
      verifyFp0150AuthorizationParserRouteIntegrationSequencingPlanBoundary({
        planText: safeRead(
          FP0150_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
        ),
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
        planText: safeRead(
          FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
        ),
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
        planText: safeRead(
          FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH,
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

function verifyFp0156CloseoutFreshness() {
  const normalized = normalizePlanText(fp0156PlanText);
  return includesAll(normalized, [
    "pr #335 merged",
    "61c7fa6d07fcb47ff4a4b05db3b870c92b7f715a",
    "08e33b0f665606dee68a03c15ca766b76bc7b4bb",
    "same-branch qa corrected only plugins.md and the fp-0156 plan",
    "static",
    "integration-db",
    "no post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
  ]);
}

function throwsMessage(fn, message) {
  try {
    fn();
    return false;
  } catch (error) {
    return error instanceof Error && error.message === message;
  }
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

function includesAll(text, values) {
  return values.every((value) => text.includes(value));
}

function normalizePlanText(text) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}

function functionCallRegex(names) {
  return new RegExp(`\\b(?:${names.join("|")})\\s*\\(`, "u");
}

function countMatches(value, pattern) {
  return value.match(pattern)?.length ?? 0;
}
