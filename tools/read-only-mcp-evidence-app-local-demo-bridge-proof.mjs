/* global console */

import { execFileSync, spawnSync } from "node:child_process";
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
  FP0150_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
  FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH,
  FP0155_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_PLAN_PATH,
  FP0157_AUTHORIZATION_PARSER_LOCAL_AUTH_DEMO_HARNESS_PLAN_PATH,
  FP0158_READ_ONLY_MCP_EVIDENCE_APP_LOCAL_DEMO_BRIDGE_PLAN_PATH,
  MCP_TOOL_ALLOWLIST,
  createReadOnlyMcpAuthorizationParserRouteDecisionDependency,
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
  verifyFp0156AbsentOrAuthorizationParserLocalAdapterAppConstructionInjectionPlan,
  verifyFp0157AbsentOrReadOnlyMcpAuthLocalDemoHarnessPlan,
  verifyFp0158AbsentOrReadOnlyMcpEvidenceAppLocalDemoBridgePlan,
  verifyFp0159Absent,
  verifyReadOnlyMcpAuthorizationParserImplementationBoundary,
  verifyReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundary,
  verifyReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundary,
  verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary,
} from "../packages/domain/src/index.ts";

const SCHEMA_VERSION =
  "v2bz.read-only-chatgpt-app-mcp-evidence-app-local-demo-bridge-proof.v1";

const HARNESS_PATH = "tools/read-only-mcp-evidence-app-local-demo-bridge.mjs";
const AUTH_HARNESS_PROOF_PATH =
  "tools/read-only-mcp-auth-local-demo-harness-proof.mjs";
const FP0156_PROOF_PATH =
  "tools/read-only-mcp-authorization-parser-local-adapter-app-construction-injection-proof.mjs";
const APP_PATH = "apps/control-plane/src/app.ts";
const APP_SPEC_PATH = "apps/control-plane/src/app.spec.ts";
const BOOTSTRAP_PATH = "apps/control-plane/src/bootstrap.ts";
const TYPES_PATH = "apps/control-plane/src/lib/types.ts";
const MCP_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const ROUTE_SPEC_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.spec.ts";
const SERVICE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/service.ts";
const DISPATCHER_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.ts";
const DISPATCHER_SPEC_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts";
const METADATA_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const INVALID_TOKEN_CHALLENGE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts";
const FP0100_PLAN =
  "plans/FP-0100-read-only-chatgpt-app-mcp-public-app-security-boundary-contracts-foundation.md";
const FP0106_PLAN =
  "plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md";
const FP0107_PLAN =
  "plans/FP-0107-read-only-chatgpt-app-mcp-local-fastify-mcp-route-adapter-foundation.md";
const FP0108_PLAN =
  "plans/FP-0108-read-only-chatgpt-app-mcp-read-only-evidence-tool-dispatch-contracts.md";
const FP0109_PLAN =
  "plans/FP-0109-read-only-chatgpt-app-mcp-read-only-evidence-tool-dispatch-adapter-implementation.md";
const FP0125_PLAN =
  "plans/FP-0125-read-only-chatgpt-app-mcp-protected-resource-metadata-local-route-implementation.md";
const FP0086_PLAN =
  "plans/FP-0086-benchmark-community-pack-foundation.md";
const FP0085_PLAN =
  "plans/FP-0085-bounded-llm-orchestration-foundation.md";
const FP0082_PLAN =
  "plans/FP-0082-read-only-mcp-chatgpt-evidence-app-alpha.md";
const FP0081_PLAN =
  "plans/FP-0081-document-precision-adapters-foundation.md";
const FP0080_PLAN =
  "plans/FP-0080-evidence-index-and-document-map-foundation.md";

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const changedLeakageText = readChangedLeakageText(changedPaths);
const fp0158PlanText = safeRead(
  FP0158_READ_ONLY_MCP_EVIDENCE_APP_LOCAL_DEMO_BRIDGE_PLAN_PATH,
);
const fp0157PlanText = safeRead(
  FP0157_AUTHORIZATION_PARSER_LOCAL_AUTH_DEMO_HARNESS_PLAN_PATH,
);
const fp0155PlanText = safeRead(
  FP0155_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_PLAN_PATH,
);
const fp0154PlanText = safeRead(
  FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH,
);
const appSource = safeRead(APP_PATH);
const appSpecSource = safeRead(APP_SPEC_PATH);
const bootstrapSource = safeRead(BOOTSTRAP_PATH);
const typesSource = safeRead(TYPES_PATH);
const routeSource = safeRead(MCP_ROUTE_PATH);
const routeSpecSource = safeRead(ROUTE_SPEC_PATH);
const serviceSource = safeRead(SERVICE_PATH);
const dispatcherSource = safeRead(DISPATCHER_PATH);
const dispatcherSpecSource = safeRead(DISPATCHER_SPEC_PATH);
const metadataRouteSource = safeRead(METADATA_ROUTE_PATH);
const invalidTokenChallengeSource = safeRead(INVALID_TOKEN_CHALLENGE_PATH);
const harnessSource = safeRead(HARNESS_PATH);
const authHarnessProofSource = safeRead(AUTH_HARNESS_PROOF_PATH);
const fp0156ProofSource = safeRead(FP0156_PROOF_PATH);
const harnessRun = runHarness();
const harnessSummary = JSON.parse(harnessRun.stdout);
const planScope = verifyPlanScope();
const harnessScope = verifyHarnessScope();
const routeScope = verifyRouteScope();
const appScope = verifyAppScope();
const evidenceScope = verifyEvidenceScope();
const sourceScope = verifySourceScope();
const noLeakageScope = verifyNoLeakageScope();
const priorBoundaries = verifyPriorBoundaries();
const runtimeDependency =
  createReadOnlyMcpAuthorizationParserRouteDecisionDependency();
const decisionFields = Object.keys(runtimeDependency({}));

const output = {
  schemaVersion: SCHEMA_VERSION,
  fp0158AbsentOrEvidenceAppLocalDemoBridgePlanVerified:
    verifyFp0158AbsentOrReadOnlyMcpEvidenceAppLocalDemoBridgePlan(repoPaths) &&
    planScope.exactlyOneFp0158Plan &&
    planScope.planTextBoundaryVerified,
  fp0159Absent: verifyFp0159Absent(repoPaths) && planScope.fp0159Absent,
  evidenceAppLocalDemoBridgeBoundaryVerified:
    planScope.localEvidenceAppDemoBridgeOnly &&
    harnessScope.localOnly &&
    harnessScope.inMemoryOnly,
  authBoundaryLaneVerified:
    harnessSummary.authBoundaryLaneVerified === true &&
    harnessSummary.missingAuthorizationChallengeVerified === true &&
    harnessSummary.authorizationPresentInvalidChallengeVerified === true &&
    harnessSummary.metadataRouteVerified === true,
  evidenceToolLaneVerified:
    harnessSummary.evidenceToolLaneVerified === true &&
    evidenceScope.allRequiredToolsVerified,
  explicitHelperOnlyLocalHarnessVerified:
    harnessSummary.explicitHelperOnly === true &&
    harnessScope.authLaneUsesExplicitHelperOnly,
  explicitEvidenceDispatchOnlyVerified:
    harnessSummary.explicitEvidenceDispatchOnly === true &&
    harnessScope.evidenceLaneUsesExplicitDispatchOnly,
  syntheticEvidenceServiceOnlyVerified:
    harnessScope.syntheticEvidenceServiceOnly &&
    noLeakageScope.evidenceFixturesContainNoRealFinanceData,
  localHarnessSanitizedSummaryOnly:
    harnessScope.summaryFieldsOnly &&
    noLeakageScope.harnessStdoutLeakageScan.accepted &&
    harnessRun.stderr === "",
  localHarnessResponseBodiesHeadersStdoutStderrLeakageScanned:
    harnessScope.scansResponseBodiesAndHeaders &&
    noLeakageScope.harnessStdoutLeakageScan.accepted &&
    noLeakageScope.harnessStderrLeakageScan.accepted,
  defaultAdapterWiringStillBlocked:
    appScope.defaultCreateContainerLeavesParserDependencyAbsent &&
    appScope.defaultCreateInMemoryContainerLeavesParserDependencyAbsent,
  defaultEvidenceDispatchWiringStillBlocked:
    appScope.defaultCreateContainerLeavesEndpointServiceAbsent &&
    appScope.defaultCreateInMemoryContainerLeavesEndpointServiceAbsent &&
    harnessSummary.defaultBehaviorPreserved === true,
  defaultCreateContainerBehaviorStillUnchanged:
    appScope.defaultCreateContainerLeavesParserDependencyAbsent &&
    appScope.defaultCreateContainerLeavesEndpointServiceAbsent,
  defaultCreateInMemoryContainerBehaviorStillUnchanged:
    appScope.defaultCreateInMemoryContainerLeavesParserDependencyAbsent &&
    appScope.defaultCreateInMemoryContainerLeavesEndpointServiceAbsent,
  defaultBuildAppBehaviorStillUnchanged:
    appScope.buildAppPassThroughOnly &&
    !appSource.includes("withReadOnlyAppMcpAuthorizationParserLocalAdapter") &&
    !appSource.includes("new LocalReadOnlyEvidenceToolDispatchAdapter"),
  mcpRouteBehaviorStillUnchanged: routeScope.mcpRouteShapePreserved,
  protectedResourceMetadataRouteStillUnchanged:
    routeScope.protectedResourceMetadataRouteShapePreserved,
  missingTokenChallengeVerified:
    harnessSummary.missingAuthorizationChallengeVerified === true,
  authorizationPresentInvalidChallengeVerified:
    harnessSummary.authorizationPresentInvalidChallengeVerified === true,
  metadataRouteVerified: harnessSummary.metadataRouteVerified === true,
  evidenceSearchVerified: harnessSummary.searchEvidenceVerified === true,
  evidenceCardFetchVerified: harnessSummary.fetchEvidenceCardVerified === true,
  documentMapFetchVerified: harnessSummary.fetchDocumentMapVerified === true,
  sourceCoverageFetchVerified: harnessSummary.fetchSourceCoverageVerified === true,
  companyPostureFetchVerified:
    harnessSummary.fetchCompanyPostureVerified === true,
  capabilityBoundariesFetchVerified:
    harnessSummary.fetchCapabilityBoundariesVerified === true,
  companyKeyMismatchFailsClosed:
    harnessSummary.companyKeyMismatchFailsClosed === true,
  invalidToolFailsClosed: harnessSummary.invalidToolFailsClosed === true,
  invalidArgumentsFailClosed:
    harnessSummary.invalidArgumentsFailClosed === true,
  parserDecisionNeverReturnedInHttpResponse:
    harnessSummary.noParserDecisionObjectExposed === true &&
    routeScope.responseNoParserDecisionObjectExposure,
  parserDecisionNeverLogged:
    routeScope.noRouteParserDecisionLogging &&
    !harnessSource.includes("console.error"),
  parserDecisionNeverCarriesRawAuthorizationHeader:
    !decisionFields.includes("authorization_header") &&
    !decisionFields.includes("raw_authorization_header"),
  parserDecisionNeverCarriesRawTokenMaterial:
    !decisionFields.includes("raw_token") && !decisionFields.includes("token"),
  parserDecisionNeverCarriesTokenDerivedFingerprint:
    !decisionFields.includes("token_fingerprint"),
  noRawSourceDumpExposed:
    harnessSummary.noRawSourceDumpExposed === true &&
    noLeakageScope.noRawSourceDumpInHarnessOutput,
  noPrivateFieldExposed: noLeakageScope.noPrivateFieldInHarnessOutput,
  noGeneratedAdviceExposed: noLeakageScope.noGeneratedAdviceInHarnessOutput,
  noWriteActionExposed:
    harnessSummary.noWriteActionExposed === true &&
    noLeakageScope.noWriteActionInHarnessOutput,
  parserFixturesContainNoRealTokenExamples:
    noLeakageScope.parserFixturesLeakageScan.accepted &&
    noLeakageScope.noBearerTokenMaterial &&
    noLeakageScope.noJwtLikeExamples,
  evidenceFixturesContainNoRealFinanceData:
    noLeakageScope.evidenceFixturesContainNoRealFinanceData,
  sharedProofOnlyLeakageSanitizerStillVerified:
    noLeakageScope.changedLeakageScan.accepted &&
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
  noOpenAiApiCallsFromFp0158: sourceScope.noOpenAiApiCalls,
  noModelCallsFromFp0158: sourceScope.noModelCalls,
  noProviderCallsFromFp0158: sourceScope.noProviderCalls,
  noSourceMutationFromFp0158: sourceScope.noSourceMutation,
  noFinanceWriteFromFp0158: sourceScope.noFinanceWrite,
  noExternalCommunicationsFromFp0158: sourceScope.noExternalCommunications,
  noPublicAssetsFromFp0158: sourceScope.noPublicAssets,
  noGeneratedPublicProseFromFp0158: sourceScope.noGeneratedPublicProse,
  noAppSubmissionFromFp0158: sourceScope.noAppSubmission,
  fp0157CloseoutFreshnessVerified: verifyFp0157CloseoutFreshness(),
  fp0157LocalAuthDemoHarnessBoundaryStillVerified:
    verifyFp0157AbsentOrReadOnlyMcpAuthLocalDemoHarnessPlan(repoPaths) &&
    authHarnessProofSource.includes(
      "fp0158AbsentOrEvidenceAppLocalDemoBridgePlanVerified",
    ),
  fp0156AppConstructionInjectionBoundaryStillVerified:
    verifyFp0156AbsentOrAuthorizationParserLocalAdapterAppConstructionInjectionPlan(
      repoPaths,
    ) &&
    fp0156ProofSource.includes(
      "fp0158AbsentOrEvidenceAppLocalDemoBridgePlanVerified",
    ),
  fp0155LocalAdapterImplementationBoundaryStillVerified:
    verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan(
      repoPaths,
    ) &&
    verifyReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundary({
      fp0154PlanText,
      fp0155PlanText,
      repoPaths,
    }),
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
  fp0109EvidenceDispatchAdapterBoundaryStillVerified:
    priorBoundaries.fp0109EvidenceDispatchAdapterBoundaryStillVerified,
  fp0108EvidenceDispatchContractBoundaryStillVerified:
    priorBoundaries.fp0108EvidenceDispatchContractBoundaryStillVerified,
  fp0086BenchmarkCommunityBoundaryStillVerified:
    priorBoundaries.fp0086BenchmarkCommunityBoundaryStillVerified,
  fp0085BoundedOrchestrationBoundaryStillVerified:
    priorBoundaries.fp0085BoundedOrchestrationBoundaryStillVerified,
  fp0082EvidenceAppAlphaBoundaryStillVerified:
    priorBoundaries.fp0082EvidenceAppAlphaBoundaryStillVerified,
  fp0081DocumentPrecisionBoundaryStillVerified:
    priorBoundaries.fp0081DocumentPrecisionBoundaryStillVerified,
  fp0080EvidenceIndexBoundaryStillVerified:
    priorBoundaries.fp0080EvidenceIndexBoundaryStillVerified,
  fp0107RouteAdapterBoundaryStillVerified:
    priorBoundaries.fp0107RouteAdapterBoundaryStillVerified,
  fp0106ProtocolEnvelopeBoundaryStillVerified:
    priorBoundaries.fp0106ProtocolEnvelopeBoundaryStillVerified,
  fp0100PublicSecurityBoundaryStillVerified:
    priorBoundaries.fp0100PublicSecurityBoundaryStillVerified,
  proofDetails: {
    changedPathScope,
    harnessSummary,
    planScope,
  },
};

const proofOutputLeakageScan = scanProofOnlyNoTokenLeakageText(
  JSON.stringify(output),
);

for (const [key, value] of Object.entries(output)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0158 evidence app local demo bridge proof failed: ${key}`,
    );
  }
}
if (!proofOutputLeakageScan.accepted) {
  throw new Error(
    `FP-0158 proof output leaked credential material: ${proofOutputLeakageScan.rejectionReasons.join(", ")}`,
  );
}
if (JSON.stringify(output).includes("authorization-present-local-only")) {
  throw new Error("FP-0158 proof output exposed the Authorization sentinel");
}

console.log(JSON.stringify(output, null, 2));

function runHarness() {
  const result = spawnSync(
    "pnpm",
    ["exec", "tsx", "tools/read-only-mcp-evidence-app-local-demo-bridge.mjs"],
    {
      encoding: "utf8",
    },
  );
  if (result.status !== 0) {
    throw new Error(
      `FP-0158 harness failed: ${result.stderr || result.stdout}`,
    );
  }
  return {
    stderr: result.stderr,
    stdout: result.stdout,
  };
}

function verifyPlanScope() {
  const fp0158Hits = repoPaths.filter((path) => /(^|\/)FP-0158/u.test(path));
  const normalized = normalizePlanText(fp0158PlanText);

  return {
    exactlyOneFp0158Plan:
      fp0158Hits.length === 1 &&
      fp0158Hits[0] ===
        FP0158_READ_ONLY_MCP_EVIDENCE_APP_LOCAL_DEMO_BRIDGE_PLAN_PATH &&
      existsSync(FP0158_READ_ONLY_MCP_EVIDENCE_APP_LOCAL_DEMO_BRIDGE_PLAN_PATH),
    fp0159Absent: repoPaths.every((path) => !/(^|\/)FP-0159/u.test(path)),
    localEvidenceAppDemoBridgeOnly: includesAll(normalized, [
      "a read-only evidence app local demo bridge is included",
      "the demo bridge uses two local lanes",
      "default auth adapter construction is not included",
      "default evidence dispatch wiring is not included",
      "default `createcontainer()`, `createinmemorycontainer()`, and `buildapp()` behavior do not change",
      "production token-validation runtime cannot start after fp-0158",
      "provider selection cannot start after fp-0158",
      "oauth/session/auth middleware cannot start after fp-0158",
      "public chatgpt app demo/submission cannot start after fp-0158",
      "future fp-0159 may open only",
    ]),
    planTextBoundaryVerified: includesAll(normalized, [
      "auth boundary lane",
      "evidence tool lane",
      "synthetic/stub evidence service",
      "response bodies, relevant response headers, harness stdout, harness stderr, and proof output",
      "no real finance data",
      "no public demo data",
    ]),
  };
}

function verifyHarnessScope() {
  const summaryKeys = Object.keys(harnessSummary).sort();

  return {
    authLaneUsesExplicitHelperOnly:
      harnessSource.includes(
        "withReadOnlyAppMcpAuthorizationParserLocalAdapter",
      ) &&
      !harnessSource.includes("createReadOnlyMcpAuthorizationParserRouteDecisionDependency"),
    evidenceLaneUsesExplicitDispatchOnly:
      harnessSource.includes("new ReadOnlyAppMcpEndpointService") &&
      harnessSource.includes("new LocalReadOnlyEvidenceToolDispatchAdapter") &&
      harnessSource.includes("readOnlyAppMcpEndpointService: endpointService") &&
      !routeSource.includes("LocalReadOnlyEvidenceToolDispatchAdapter"),
    inMemoryOnly:
      harnessSource.includes("createInMemoryContainer") &&
      !harnessSource.includes("createContainer()") &&
      !harnessSource.includes("createServerContainer"),
    localOnly: harnessSummary.localOnly === true,
    scansResponseBodiesAndHeaders:
      harnessSource.includes("collectResponseSurface") &&
      harnessSource.includes("local bridge response bodies and headers"),
    summaryFieldsOnly:
      JSON.stringify(summaryKeys) ===
      JSON.stringify(
        [
          "authBoundaryLaneVerified",
          "authorizationPresentInvalidChallengeVerified",
          "companyKeyMismatchFailsClosed",
          "defaultBehaviorPreserved",
          "evidenceToolLaneVerified",
          "explicitEvidenceDispatchOnly",
          "explicitHelperOnly",
          "fetchCapabilityBoundariesVerified",
          "fetchCompanyPostureVerified",
          "fetchDocumentMapVerified",
          "fetchEvidenceCardVerified",
          "fetchSourceCoverageVerified",
          "invalidArgumentsFailClosed",
          "invalidToolFailsClosed",
          "localOnly",
          "metadataRouteVerified",
          "missingAuthorizationChallengeVerified",
          "noCredentialMaterialExposed",
          "noParserDecisionObjectExposed",
          "noRawSourceDumpExposed",
          "noWriteActionExposed",
          "productionTokenValidationImplemented",
          "publicChatGptAppImplemented",
          "searchEvidenceVerified",
        ].sort(),
      ),
    syntheticEvidenceServiceOnly:
      harnessSource.includes("function syntheticEvidenceService()") &&
      harnessSource.includes("Synthetic local demo citation") &&
      !harnessSource.includes("ReadOnlyEvidenceToolService(") &&
      !harnessSource.includes("buildEvidenceIndexFoundation"),
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

function verifyAppScope() {
  return {
    buildAppPassThroughOnly:
      appSource.includes("container.readOnlyAppMcpAuthorizationParserRouteDecision") &&
      appSource.includes("container.readOnlyAppMcpEndpointService") &&
      !appSource.includes("createReadOnlyMcpAuthorizationParserRouteDecisionDependency"),
    defaultCreateContainerLeavesEndpointServiceAbsent:
      !bootstrapSource.includes("readOnlyAppMcpEndpointService:") &&
      typesSource.includes("readOnlyAppMcpEndpointService?:"),
    defaultCreateContainerLeavesParserDependencyAbsent:
      !bootstrapSource.includes(
        "readOnlyAppMcpAuthorizationParserRouteDecision:",
      ),
    defaultCreateInMemoryContainerLeavesEndpointServiceAbsent:
      !bootstrapSource.includes("readOnlyAppMcpEndpointService:") &&
      bootstrapSource.includes("createInMemoryContainer"),
    defaultCreateInMemoryContainerLeavesParserDependencyAbsent:
      !bootstrapSource.includes(
        "readOnlyAppMcpAuthorizationParserRouteDecision:",
      ) && bootstrapSource.includes("createInMemoryContainer"),
  };
}

function verifyEvidenceScope() {
  return {
    allRequiredToolsVerified:
      sameList(MCP_TOOL_ALLOWLIST, [
        "search_evidence",
        "fetch_evidence_card",
        "fetch_source_anchor",
        "fetch_document_map",
        "fetch_source_coverage",
        "fetch_company_posture",
        "fetch_capability_boundaries",
      ]) &&
      harnessSummary.searchEvidenceVerified === true &&
      harnessSummary.fetchEvidenceCardVerified === true &&
      harnessSummary.fetchDocumentMapVerified === true &&
      harnessSummary.fetchSourceCoverageVerified === true &&
      harnessSummary.fetchCompanyPostureVerified === true &&
      harnessSummary.fetchCapabilityBoundariesVerified === true,
    dispatcherAdapterPreserved:
      dispatcherSource.includes("LocalReadOnlyEvidenceToolDispatchAdapter") &&
      dispatcherSource.includes("expectedCompanyKey") &&
      dispatcherSource.includes("formatEvidenceDispatchLocalRefusal"),
    dispatcherSpecsPreserved:
      dispatcherSpecSource.includes("maps every exact V2G tool") &&
      dispatcherSpecSource.includes("requires expected companyKey") &&
      dispatcherSpecSource.includes("fails closed for invalid tool names"),
    endpointServiceExplicitDispatcherOnly:
      serviceSource.includes("evidenceToolDispatcher?:") &&
      serviceSource.includes("if (this.evidenceToolDispatcher)") &&
      serviceSource.includes("formatToolDispatchRefusalResult"),
  };
}

function verifySourceScope() {
  const fp0158RuntimeSource = [
    harnessSource,
    appSource,
    bootstrapSource,
    routeSource,
    serviceSource,
    dispatcherSource,
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
    ]).test(fp0158RuntimeSource),
    noExternalCommunications: !functionCallRegex([
      ["send", "Email"].join(""),
      ["post", "Slack"].join(""),
      ["external", "Message"].join(""),
      ["publish", "Submission"].join(""),
    ]).test(fp0158RuntimeSource),
    noFinanceWrite: !functionCallRegex([
      ["write", "Finance", "Twin"].join(""),
      ["update", "Ledger"].join(""),
      ["post", "Ledger"].join(""),
      ["create", "Journal", "Entry"].join(""),
    ]).test(fp0158RuntimeSource),
    noGeneratedPublicProse: !functionCallRegex([
      ["generate", "Listing", "Copy"].join(""),
      ["marketing", "Copy"].join(""),
      ["public", "Description"].join(""),
    ]).test(fp0158RuntimeSource),
    noJwtDecoder: !functionCallRegex([
      ["parse", "Jwt"].join(""),
      ["decode", "Jwt"].join(""),
      ["jwt", "Decode"].join(""),
      ["jwt", "Verify"].join(""),
      ["verify", "Jwt"].join(""),
    ]).test(fp0158RuntimeSource),
    noJwksFetch: !functionCallRegex([
      ["jwks", "Client"].join(""),
      ["get", "Signing", "Key"].join(""),
      ["remote", "Jwks"].join(""),
      ["create", "Remote", "JWK", "Set"].join(""),
      ["fetch", "Jwks"].join(""),
      ["load", "Jwks"].join(""),
    ]).test(fp0158RuntimeSource),
    noModelCalls: !functionCallRegex([
      ["responses", "create"].join("."),
      ["chat", "completions"].join("."),
      ["call", "Model"].join(""),
    ]).test(fp0158RuntimeSource),
    noOauthImplementation: !functionCallRegex([
      ["oauth", "Callback"].join(""),
      ["authorize", "Url"].join(""),
      ["token", "Exchange"].join(""),
      ["authorization", "Code"].join(""),
      ["pkce", "Verifier"].join(""),
    ]).test(fp0158RuntimeSource),
    noOpenAiApiCalls: !new RegExp(
      [
        ["new", "OpenAI"].join("\\s+"),
        ["from", "openai"].join("\\s+"),
        ["api", "openai", "com"].join("\\."),
      ].join("|"),
      "iu",
    ).test(fp0158RuntimeSource),
    noProductionTokenValidation: !functionCallRegex([
      ["validate", "Token"].join(""),
      ["verify", "Token"].join(""),
      ["token", "Validator"].join(""),
      ["validate", "Bearer"].join(""),
      ["verify", "Bearer"].join(""),
    ]).test(fp0158RuntimeSource),
    noProviderCalls: !functionCallRegex([
      ["provider", "Connect"].join(""),
      ["create", "Provider", "Job"].join(""),
      ["contact", "Customer"].join(""),
      ["external", "Message"].join(""),
    ]).test(fp0158RuntimeSource),
    noProviderIntegration: !functionCallRegex([
      ["provider", "Connect"].join(""),
      ["create", "Provider", "Job"].join(""),
      ["provider", "Adapter"].join(""),
      ["provider", "Client"].join(""),
    ]).test(fp0158RuntimeSource),
    noProviderSelection: !functionCallRegex([
      ["select", "Provider"].join(""),
      ["choose", "Provider"].join(""),
      ["resolve", "Provider"].join(""),
      ["provider", "Selector"].join(""),
    ]).test(fp0158RuntimeSource),
    noPublicAssets: !functionCallRegex([
      ["create", "Screen", "Shot"].join(""),
      ["upload", "Screen", "Shot"].join(""),
      ["create", "Public", "Asset"].join(""),
      ["generate", "Listing", "Copy"].join(""),
      ["build", "App", "Submission", "Asset"].join(""),
    ]).test(fp0158RuntimeSource),
    noSourceMutation: !functionCallRegex([
      ["upload", "Source"].join(""),
      ["mutate", "Source"].join(""),
      ["rewrite", "Source"].join(""),
      ["delete", "Source"].join(""),
    ]).test(fp0158RuntimeSource),
    noTokenIntrospection: !functionCallRegex([
      ["introspect", "Token"].join(""),
    ]).test(fp0158RuntimeSource),
    noTokenParser: !functionCallRegex([
      ["decode", "Token"].join(""),
      ["parse", "Token"].join(""),
      ["parse", "Jwt"].join(""),
      ["decode", "Jwt"].join(""),
      ["jwt", "Decode"].join(""),
      ["introspect", "Token"].join(""),
    ]).test(fp0158RuntimeSource),
    noTokenSessionStorage: !functionCallRegex([
      ["token", "Store"].join(""),
      ["session", "Store"].join(""),
      ["session", "Handler"].join(""),
      ["refresh", "Token", "Store"].join(""),
      ["set", "Cookie"].join(""),
    ]).test(fp0158RuntimeSource),
  };
}

function verifyNoLeakageScope() {
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
  const changedLeakageScan = scanProofOnlyNoTokenLeakageText(changedLeakageText);
  const parserFixturesLeakageScan = scanProofOnlyNoTokenLeakageText(
    [
      harnessSource,
      authHarnessProofSource,
      fp0156ProofSource,
      fp0158PlanText,
      fp0157PlanText,
    ].join("\n"),
  );
  const harnessStdoutLeakageScan = scanProofOnlyNoTokenLeakageText(
    harnessRun.stdout,
  );
  const harnessStderrLeakageScan = scanProofOnlyNoTokenLeakageText(
    harnessRun.stderr,
  );
  const outputText = `${harnessRun.stdout}\n${harnessRun.stderr}`;
  const tokenExampleScan = scanChangedTokenExamples(changedLeakageText);

  return {
    changedLeakageScan,
    evidenceFixturesContainNoRealFinanceData:
      !/\b(?:account_number|routing_number|bank_balance|payroll|customer_list|vendor_list|tax_id)\b/iu.test(
        harnessSource,
      ),
    harnessStderrLeakageScan,
    harnessStdoutLeakageScan,
    noBearerTokenMaterial: tokenExampleScan.noBearerTokenMaterial,
    noGeneratedAdviceInHarnessOutput:
      !/generatedAdvice|modelGeneratedAdvice|financeAdvice/u.test(outputText),
    noJwtLikeExamples: tokenExampleScan.noJwtLikeExamples,
    noPrivateFieldInHarnessOutput: !/privateField|private_field/u.test(outputText),
    noRawSourceDumpInHarnessOutput:
      !/rawFullText|rawFileText|fullFileText|fileContents|rawSourceDump/u.test(
        outputText,
      ),
    noWriteActionInHarnessOutput:
      !/writeAction|send_report|update_ledger|financeWriteExecuted/u.test(
        outputText,
      ),
    parserFixturesLeakageScan,
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
    fp0125ProtectedResourceMetadataRouteBoundaryStillVerified: docsBoundary(
      FP0125_PLAN,
      ["protected-resource metadata", "local route"],
    ),
    fp0109EvidenceDispatchAdapterBoundaryStillVerified: docsBoundary(
      FP0109_PLAN,
      ["local-only", "dependency-injected", "default fail-closed"],
    ),
    fp0108EvidenceDispatchContractBoundaryStillVerified: docsBoundary(
      FP0108_PLAN,
      ["evidence tool dispatch contracts", "does not change route behavior"],
    ),
    fp0086BenchmarkCommunityBoundaryStillVerified: docsBoundary(FP0086_PLAN, [
      "benchmark/community",
      "no real finance data",
    ]),
    fp0085BoundedOrchestrationBoundaryStillVerified: docsBoundary(FP0085_PLAN, [
      "bounded llm orchestration",
      "no openai api calls",
    ]),
    fp0082EvidenceAppAlphaBoundaryStillVerified: docsBoundary(FP0082_PLAN, [
      "read-only evidence-tool",
      "not as a public mcp server",
    ]),
    fp0081DocumentPrecisionBoundaryStillVerified: docsBoundary(FP0081_PLAN, [
      "document precision",
      "textpdfadapter",
    ]),
    fp0080EvidenceIndexBoundaryStillVerified: docsBoundary(FP0080_PLAN, [
      "evidenceindex",
      "document-map",
    ]),
    fp0107RouteAdapterBoundaryStillVerified: docsBoundary(FP0107_PLAN, [
      "local/control-plane",
      "post /mcp",
    ]),
    fp0106ProtocolEnvelopeBoundaryStillVerified: docsBoundary(FP0106_PLAN, [
      "mcp protocol envelope",
      "tools/call",
    ]),
    fp0100PublicSecurityBoundaryStillVerified: docsBoundary(FP0100_PLAN, [
      "public-app security boundary",
      "local/proof-only",
    ]),
  };
}

function verifyFp0157CloseoutFreshness() {
  const normalized = normalizePlanText(fp0157PlanText);
  return includesAll(normalized, [
    "pr #336 merged",
    "86268a8882f3c404ba4666b868a576c401d4ce61",
    "2d02b692dac61bb02b22a78ce824ff87c107e01f",
    "same-branch qa found no issues and made no correction",
    "static",
    "integration-db",
    "no post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
  ]);
}

function docsBoundary(path, requiredTexts) {
  const normalized = normalizePlanText(safeRead(path));
  return requiredTexts.every((requiredText) =>
    normalized.includes(normalizePlanText(requiredText)),
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

function sameList(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}
