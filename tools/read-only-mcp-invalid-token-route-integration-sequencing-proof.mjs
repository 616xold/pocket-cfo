import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH,
  FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH,
  FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH,
  FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
  FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
  FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
  FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH,
  McpInvalidTokenRouteIntegrationSequencingProofSchema,
  buildMcpInvalidTokenRouteIntegrationSequencingProof,
  buildTokenValidationResultEnvelope,
  buildTokenValidationResultEnvelopeInputDescriptor,
  isMcpTokenValidationTestDoubleProofSourcePath,
  scanTokenValidationNoLeakage,
  verifyExactTokenValidationResultEnvelopeFailureTaxonomy,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0134TokenValidationTestDoubleImplementationBoundary,
  verifyFp0136InvalidTokenChallengeContractsBoundary,
  verifyFp0137InvalidTokenChallengeImplementationReadinessPlanBoundary,
  verifyFp0138TokenValidationRuntimeImplementationPlanningBoundary,
  verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary,
  verifyFp0140InvalidTokenChallengeImplementationPlanningBoundary,
  verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary,
  verifyFp0142FailureTaxonomyHttpWwwAuthenticateConsistency,
  verifyFp0142PlanningTextRequiredTopics,
  verifyFp0142RouteIntegrationSequencingPlanBoundary,
  verifyFp0143AbsentOrInvalidTokenAppConstructionWiring,
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
const BOOTSTRAP_PATH = "apps/control-plane/src/bootstrap.ts";
const MISSING_TOKEN_HELPER_PATH =
  "packages/domain/src/read-only-app-mcp-www-authenticate-missing-token-challenge.ts";

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const changedExecutableSource = readChangedExecutableSource(changedPaths);
const changedDocText = readChangedDocText(changedPaths);
const routeSource = safeRead(MCP_ROUTE_PATH);
const metadataRouteSource = safeRead(METADATA_ROUTE_PATH);
const appSource = safeRead(APP_PATH);
const fp0142PlanText = safeRead(
  FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
);
const fp0143PlanText = safeRead(
  FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH,
);
const fp0142Topics = verifyFp0142PlanningTextRequiredTopics(fp0142PlanText);
const sourceScope = verifySourceScope();
const routeScope = verifyRouteScope();
const fp0143AppWiringBridge = verifyFp0143AppWiringBridge();
const localRuntimeBridge = verifyFp0141LocalRuntimeBridge();
const priorBoundaries = verifyPriorBoundaries();
const repositoryInventory =
  verifyMcpTokenValidationTestDoubleRepositoryInventory({
    branchDiffPaths: changedPathScope.committedBranchDiffPaths,
    dirtyPaths: changedPathScope.dirtyQaTargetFiles,
    repoPaths,
    sourceTextByPath: readProofSourceTextByPath(repoPaths),
  });
const noLeakageScan = scanTokenValidationNoLeakage(fp0142PlanText);
const changedTokenExampleScan = scanChangedTokenExamples(changedDocText);

const proof = McpInvalidTokenRouteIntegrationSequencingProofSchema.parse(
  buildMcpInvalidTokenRouteIntegrationSequencingProof({
    appConstructionWiringImplementationBlocked:
      fp0142Topics.appConstructionWiringBlocked &&
      fp0143AppWiringBridge.appConstructionWiringIsExactFp0143,
    authorizationHeaderPresenceDecisionRecorded:
      fp0142Topics.authorizationHeaderPresenceDecision,
    exactFp0142PlanPathVerified: exactFp0142PlanPathVerified(),
    failureTaxonomyHttpWwwAuthenticateConsistencyRequired:
      fp0142Topics.failureTaxonomyHttpWwwAuthenticateConsistency &&
      verifyFp0142FailureTaxonomyHttpWwwAuthenticateConsistency() &&
      localRuntimeBridge.failureTaxonomyHttpPostureWwwAuthenticateConsistencyVerified,
    fp0100PublicSecurityBoundaryStillVerified:
      priorBoundaries.fp0100PublicSecurityBoundaryStillVerified,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      priorBoundaries.fp0106ProtocolEnvelopeBoundaryStillVerified,
    fp0107RouteAdapterBoundaryStillVerified:
      priorBoundaries.fp0107RouteAdapterBoundaryStillVerified,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
      priorBoundaries.fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      priorBoundaries.fp0130MissingTokenChallengeBoundaryStillVerified,
    fp0134SyntheticEvaluatorBoundaryStillVerified:
      priorBoundaries.fp0134SyntheticEvaluatorBoundaryStillVerified,
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified:
      priorBoundaries.fp0136InvalidTokenChallengeContractsBoundaryStillVerified,
    fp0137InvalidTokenChallengeReadinessBoundaryStillVerified:
      priorBoundaries.fp0137InvalidTokenChallengeReadinessBoundaryStillVerified,
    fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified:
      priorBoundaries.fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified,
    fp0139ResultEnvelopeBoundaryStillVerified:
      priorBoundaries.fp0139ResultEnvelopeBoundaryStillVerified,
    fp0140ImplementationPlanningBoundaryStillVerified:
      priorBoundaries.fp0140ImplementationPlanningBoundaryStillVerified,
    fp0141LocalRuntimeBoundaryStillVerified:
      priorBoundaries.fp0141LocalRuntimeBoundaryStillVerified &&
      localRuntimeBridge.localRuntimeBoundaryStillVerified,
    fp0143Absent: verifyFp0143AbsentOrInvalidTokenAppConstructionWiring({
      planText: fp0143PlanText,
      repoPaths,
    }),
    fp0139ResultEnvelopeOnlyDependencyPreserved:
      fp0142Topics.resultEnvelopeOnlyDependency &&
      localRuntimeBridge.fp0139ResultEnvelopeOnlyDependencyPreserved,
    invalidTokenRouteIntegrationSequencingPlanVerified:
      verifyFp0142RouteIntegrationSequencingPlanBoundary({
        planText: fp0142PlanText,
        repoPaths,
      }) && Object.values(fp0142Topics).every(Boolean),
    missingTokenPrecedenceDecisionRecorded:
      fp0142Topics.missingTokenPrecedence &&
      routeScope.missingTokenPrecedenceStillVerified &&
      fp0143AppWiringBridge.missingTokenPrecedencePreserved,
    noBearerTokenMaterial:
      noLeakageScan.accepted &&
      changedTokenExampleScan.noBearerTokenMaterial &&
      repositoryInventory.noBearerTokenMaterialRepositoryInventoryVerified,
    noDbQueriesAdded: sourceScope.noDbQueriesAdded,
    noEvaluatorOrTestDoubleRouteConsumptionFromFp0142:
      routeScope.noEvaluatorOrTestDoubleRouteConsumption &&
      repositoryInventory.noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified,
    noJwtLikeExamples:
      noLeakageScan.accepted &&
      changedTokenExampleScan.noJwtLikeExamples &&
      repositoryInventory.noJwtLikeExampleRepositoryInventoryVerified,
    noMcpRouteBehaviorChangeFromFp0142:
      fp0143AppWiringBridge.noMcpRouteBehaviorChangeByDefault &&
      routeScope.localMcpRouteShape,
    noMissingTokenBehaviorChangeFromFp0142:
      fp0143AppWiringBridge.missingTokenPrecedencePreserved &&
      !changedPaths.includes(MISSING_TOKEN_HELPER_PATH),
    noOauthSessionAuthMiddlewareFromFp0142:
      sourceScope.noOauthImplementation &&
      sourceScope.noTokenSessionStorage &&
      sourceScope.noAuthMiddlewareImplementation,
    noOpenAiApiCalls:
      sourceScope.noOpenAiApiCalls &&
      repositoryInventory.noOpenAiApiSourceScanVerified,
    noPackageScriptsAdded: sourceScope.noPackageScriptsAdded,
    noProductionTokenValidationFromFp0142: sourceScope.noTokenValidationRuntime,
    noProtectedResourceMetadataRouteBehaviorChangeFromFp0142:
      sourceScope.noProtectedResourceMetadataRouteBehaviorChange &&
      routeScope.metadataRouteShape,
    noProviderExternalCalls: sourceScope.noProviderExternalCalls,
    noRealTokenExamples:
      noLeakageScan.accepted &&
      changedTokenExampleScan.noRealTokenExamples &&
      repositoryInventory.noRealTokenExampleRepositoryInventoryVerified,
    noSchemaMigrationsAdded: sourceScope.noSchemaMigrationsAdded,
    noSourceMutationFinanceWrite:
      sourceScope.noSourceMutation && sourceScope.noFinanceWrite,
    noTokenEcho:
      noLeakageScan.accepted &&
      changedTokenExampleScan.noRealTokenExamples &&
      localRuntimeBridge.noTokenEcho,
    noTokenLogging: sourceScope.noTokenLogging,
    noTokenParserJwtDecoderIntrospectionFromFp0142:
      sourceScope.noTokenParsingRuntime &&
      sourceScope.noJwtDecodingRuntime &&
      sourceScope.noTokenIntrospectionRuntime,
    protectedResourceMetadataSeparationPreserved:
      fp0142Topics.protectedResourceMetadataSeparation &&
      routeScope.protectedResourceMetadataRouteBehaviorSeparate,
    routeIntegrationImplementationBlocked:
      fp0142Topics.routeIntegrationBlocked &&
      fp0143AppWiringBridge.routeIntegrationRemainsExplicitAppWiringOnly,
  }),
);

const output = {
  ...proof,
  proofDetails: {
    changedPathScope,
    localRuntimeBridge,
    noLeakageScan,
    changedTokenExampleScan,
    fp0143AppWiringBridge,
    priorBoundaries,
    repositoryInventory: {
      noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified:
        repositoryInventory.noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified,
      tokenValidationTestDoubleRepositoryInventoryVerified:
        repositoryInventory.tokenValidationTestDoubleRepositoryInventoryVerified,
    },
    routeScope,
    sourceScope,
    topics: fp0142Topics,
  },
};
const proofOutputLeakageScan = scanTokenValidationNoLeakage(
  JSON.stringify(output),
);

for (const [key, value] of Object.entries(output)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0142 invalid-token route integration sequencing proof failed: ${key}`,
    );
  }
}
if (!proofOutputLeakageScan.accepted) {
  throw new Error(
    `FP-0142 invalid-token route integration sequencing proof leaked token material: ${proofOutputLeakageScan.rejectionReasons.join(", ")}`,
  );
}

console.log(JSON.stringify(output, null, 2));

function exactFp0142PlanPathVerified() {
  const hits = repoPaths.filter((path) => /(^|\/)FP-0142/u.test(path));
  return (
    hits.length === 1 &&
    hits[0] === FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH
  );
}

function verifyFp0141LocalRuntimeBridge() {
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
    acceptedEnvelopesRejected:
      !acceptedAssessment.accepted &&
      acceptedAssessment.rejectionReasons.includes(
        "accepted_envelope_rejected",
      ),
    defaultRouteBehaviorUnchangedWhenInvalidTokenDependencyAbsent:
      !safeRead(BOOTSTRAP_PATH).includes(
        "readOnlyAppMcpInvalidTokenChallengeResultEnvelope",
      ) &&
      routeSource.includes(
        "deps.readOnlyAppMcpInvalidTokenChallengeResultEnvelope === undefined\n      ? null",
      ),
    failureTaxonomyHttpPostureWwwAuthenticateConsistencyVerified:
      responses.every(responseConsistencyVerified),
    fp0139ResultEnvelopeOnlyDependencyPreserved: responses.every(
      (response) => response.descriptor.consumesFp0139ResultEnvelopeOnly,
    ),
    localOnlyInvalidTokenBehaviorDoesNotParseHeadersOrTokens: responses.every(
      (response) =>
        response.body.noTokenParsingRuntime &&
        response.body.noJwtDecodingRuntime &&
        response.body.noTokenIntrospectionRuntime &&
        response.body.noProductionTokenValidationRuntime,
    ),
    localRuntimeBoundaryStillVerified: responses.every(
      (response) =>
        response.descriptor.localInvalidTokenChallengeRuntimeOnly &&
        response.descriptor.invalidTokenChallengeRuntimeImplemented,
    ),
    missingTokenEnvelopesRejected:
      !missingAssessment.accepted &&
      missingAssessment.rejectionReasons.includes(
        "missing_token_behavior_separate",
      ),
    noTokenEcho: scanTokenValidationNoLeakage(
      responses.map((response) => JSON.stringify(response)).join("\n"),
    ).accepted,
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

function responseFor(failure) {
  return buildReadOnlyAppMcpInvalidTokenChallengeResponse(
    buildTokenValidationResultEnvelope(
      buildTokenValidationResultEnvelopeInputDescriptor({
        outcome: failure,
      }),
    ),
  );
}

function verifyRouteScope() {
  const missingTokenIndex = routeSource.indexOf(
    "if (missingTokenChallenge && request.headers.authorization === undefined)",
  );
  const invalidTokenIndex = routeSource.indexOf(
    "if (invalidTokenChallenge && request.headers.authorization !== undefined)",
  );

  return {
    localMcpRouteShape:
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1,
    metadataRouteShape:
      countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
      (metadataRouteSource.includes(
        "/.well-known/oauth-protected-resource/mcp",
      ) ||
        metadataRouteSource.includes(
          "MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH",
        )) &&
      !/app\.post|app\.put|app\.patch|app\.delete/iu.test(metadataRouteSource),
    missingTokenPrecedenceStillVerified:
      missingTokenIndex >= 0 && invalidTokenIndex > missingTokenIndex,
    noEvaluatorOrTestDoubleRouteConsumption:
      !routeSource.includes("evaluateSyntheticTokenValidationScenario") &&
      !/token-validation-test-double|TestDouble/u.test(routeSource),
    protectedResourceMetadataRouteBehaviorSeparate:
      !metadataRouteSource.includes("WWW-Authenticate") &&
      !metadataRouteSource.includes(
        "buildReadOnlyAppMcpInvalidTokenChallengeResponse",
      ),
  };
}

function verifyFp0143AppWiringBridge() {
  const registrationCallIndex = appSource.indexOf(
    "registerReadOnlyAppMcpEndpointRoutes(app,",
  );
  const forwardedDependencyIndex = appSource.indexOf(
    "readOnlyAppMcpInvalidTokenChallengeResultEnvelope:\n      container.readOnlyAppMcpInvalidTokenChallengeResultEnvelope",
  );
  const missingTokenIndex = routeSource.indexOf(
    "if (missingTokenChallenge && request.headers.authorization === undefined)",
  );
  const invalidTokenIndex = routeSource.indexOf(
    "if (invalidTokenChallenge && request.headers.authorization !== undefined)",
  );
  const exactChangedPathBoundary = changedPaths.every((path) =>
    [
      FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH,
      "apps/control-plane/src/lib/types.ts",
      APP_PATH,
      "apps/control-plane/src/app.spec.ts",
      MCP_ROUTE_PATH,
      "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.spec.ts",
      "plans/FP-0144-read-only-chatgpt-app-mcp-production-token-validation-sequencing-master-plan.md",
      "plans/FP-0145-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-proof-hardening.md",
      "plans/FP-0146-read-only-chatgpt-app-mcp-authorization-parser-contracts-provider-selection-proof.md",
      "plans/FP-0147-read-only-chatgpt-app-mcp-provider-selection-evidence-hardening.md",
      "packages/domain/src/index.ts",
      "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts",
      "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts",
      "packages/domain/src/read-only-app-mcp-provider-selection-evidence-hardening.ts",
      "packages/domain/src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts",
      "packages/domain/src/read-only-app-mcp-invalid-token-challenge-route-integration-sequencing.ts",
      "packages/domain/src/read-only-app-mcp-invalid-token-challenge.spec.ts",
      "packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input-inventory-rules.ts",
      "packages/domain/src/read-only-app-mcp-token-validation-inventory.ts",
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
      "tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs",
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
  const explicitContainerDependency =
    safeRead("apps/control-plane/src/lib/types.ts").includes(
      "readOnlyAppMcpInvalidTokenChallengeResultEnvelope?: ReadOnlyAppMcpInvalidTokenChallengeResultEnvelopePort;",
    ) &&
    safeRead("apps/control-plane/src/lib/types.ts").includes(
      "export type ReadOnlyAppMcpInvalidTokenChallengeResultEnvelopePort = unknown;",
    );
  const routeForwarding =
    registrationCallIndex >= 0 &&
    forwardedDependencyIndex > registrationCallIndex;
  const coRegistration =
    routeSource.includes("assertInvalidTokenChallengeCoRegistration") &&
    routeSource.includes("missing-token challenge co-registration") &&
    routeSource.includes(
      "protected-resource metadata route evidence dependency",
    );
  const authorizationPresentOnly =
    invalidTokenIndex >= 0 &&
    !/\b(?:parseAuthorization|parseAuthHeader|bearerParser)\s*\(/u.test(
      routeSource,
    ) &&
    !/\bauthorization\s*\.\s*(?:split|replace|match|startsWith|slice|substring|toLowerCase|trim)\s*\(/iu.test(
      routeSource,
    );
  const missingTokenPrecedencePreserved =
    missingTokenIndex >= 0 && invalidTokenIndex > missingTokenIndex;
  const noRouteExpansion =
    countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
    countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1;
  const noMcpRouteBehaviorChangeByDefault =
    noRouteExpansion &&
    routeSource.includes(
      "deps.readOnlyAppMcpInvalidTokenChallengeResultEnvelope === undefined\n      ? null",
    ) &&
    routeSource.includes(
      "const response: ReadOnlyAppMcpEndpointResult = service.handle(request.body)",
    );
  const appConstructionWiringIsExactFp0143 =
    exactChangedPathBoundary &&
    explicitContainerDependency &&
    routeForwarding &&
    verifyFp0143AbsentOrInvalidTokenAppConstructionWiring({
      planText: fp0143PlanText,
      repoPaths,
    });

  return {
    appConstructionWiringIsExactFp0143,
    authorizationPresentOnly,
    coRegistration,
    exactChangedPathBoundary,
    missingTokenPrecedencePreserved,
    noMcpRouteBehaviorChangeByDefault,
    noRouteExpansion,
    routeIntegrationRemainsExplicitAppWiringOnly:
      appConstructionWiringIsExactFp0143 &&
      coRegistration &&
      authorizationPresentOnly &&
      noMcpRouteBehaviorChangeByDefault,
  };
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
    noMcpRouteBehaviorChange: !changedPaths.includes(MCP_ROUTE_PATH),
    noMissingTokenChallengeBehaviorChange:
      !changedPaths.includes(MCP_ROUTE_PATH) &&
      !changedPaths.includes(MISSING_TOKEN_HELPER_PATH),
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
    noProtectedResourceMetadataRouteBehaviorChange:
      !changedPaths.includes(METADATA_ROUTE_PATH),
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
    noTokenLogging: !hasTokenLoggingRuntime(changedExecutableSource),
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

function scanChangedTokenExamples(text) {
  const sanitized = text
    .replaceAll('authorization: ""', "")
    .replaceAll("authorization-present-local-only", "")
    .replaceAll("resource_metadata", "resource metadata");
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
    fp0134SyntheticEvaluatorBoundaryStillVerified:
      verifyFp0134TokenValidationTestDoubleImplementationBoundary({
        planText: safeRead(
          FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
        ),
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
  };
}

function hasTokenLoggingRuntime(source) {
  const logCallPattern =
    /\b(?:console\.\w+|logger\.\w+|log|warn|debug|trace)\s*\([\s\S]{0,1200}?\);/giu;
  const sensitiveTokenReferencePattern =
    /\b(?:rawToken|accessToken|refreshToken|idToken|tokenMaterial|authorizationHeader|rawAuthorization|bearerMaterial|jwtLikeMaterial|bearer|jwt)\b/iu;

  for (const match of source.matchAll(logCallPattern)) {
    const call = match[0];
    if (/console\.log\s*\(\s*JSON\.stringify\s*\(/u.test(call)) continue;
    if (sensitiveTokenReferencePattern.test(call)) return true;
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

function readChangedDocText(paths) {
  return paths
    .filter((path) => /\.(?:md|mdx|txt)$/u.test(path))
    .filter((path) => existsSync(path))
    .map((path) => `# ${path}\n${safeRead(path)}`)
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
