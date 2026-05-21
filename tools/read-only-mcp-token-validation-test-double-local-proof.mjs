import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  FP0120_CANONICAL_RESOURCE_AUTH_SERVER_PLAN_PATH,
  FP0122_PROTECTED_RESOURCE_METADATA_BUILDER_PLAN_PATH,
  FP0123_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_PLAN_PATH,
  FP0127_WWW_AUTHENTICATE_AUTH_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0128_TOKEN_VALIDATION_READINESS_CONTRACTS_PLAN_PATH,
  FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0131_TOKEN_VALIDATION_RUNTIME_SEQUENCING_PLAN_PATH,
  FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH,
  FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
  FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH,
  FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH,
  FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES,
  SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME,
  SyntheticTokenValidationEvaluationProofSchema,
  SyntheticTokenValidationScenarioDescriptorSchema,
  assertSyntheticScenarioContainsNoTokenMaterial,
  buildSyntheticTokenValidationEvaluationProof,
  buildSyntheticTokenValidationScenario,
  evaluateSyntheticTokenValidationScenario,
  isMcpTokenValidationTestDoubleProofSourcePath,
  scanTokenValidationNoLeakage,
  syntheticFailureModesByFamily,
  verifyFp0120CanonicalResourceAuthServerPlanBoundary,
  verifyFp0122ProtectedResourceMetadataBuilderContractsBoundary,
  verifyFp0123ProtectedResourceMetadataRouteInputContractsBoundary,
  verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary,
  verifyFp0128TokenValidationReadinessContractsBoundary,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0131TokenValidationRuntimeSequencingPlanBoundary,
  verifyFp0132TokenValidationRuntimeContractsBoundary,
  verifyFp0133TokenValidationTestDoubleContractsBoundary,
  verifyFp0134TokenValidationTestDoubleImplementationBoundary,
  verifyFp0135AbsentOrDocsOnlyInvalidTokenChallengeSequencingPlan,
  verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts,
  verifyFp0136InvalidTokenChallengeContractsBoundary,
  verifyFp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlan,
  verifyFp0138Absent,
  verifyFp0138AbsentOrDocsOnlyTokenValidationRuntimeImplementationPlanning,
  verifyFp0139Absent,
  verifyMcpTokenValidationTestDoubleContractBoundaries,
  verifyMcpTokenValidationTestDoubleNoTokenExamples,
  verifyMcpTokenValidationTestDoubleRepositoryInventory,
} from "../packages/domain/src/index.ts";

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
const MISSING_TOKEN_HELPER_PATH =
  "packages/domain/src/read-only-app-mcp-www-authenticate-missing-token-challenge.ts";

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const changedExecutableSource = readChangedExecutableSource(changedPaths);
const fp0133PlanText = safeRead(
  FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
);
const fp0134PlanText = safeRead(
  FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
);
const fp0135PlanText = safeReadIfExists(
  FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH,
);
const fp0136PlanText = safeReadIfExists(
  FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
);
const fp0137PlanText = safeReadIfExists(
  FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH,
);
const sourceScope = verifySourceScope();
const repositoryInventory = verifyRepositoryInventory();
const scenarioProof = verifyScenarioEvaluation();
const priorBoundaries = verifyPriorBoundaries();

const proof = SyntheticTokenValidationEvaluationProofSchema.parse(
  buildSyntheticTokenValidationEvaluationProof({
    acceptedScenarioEvaluationVerified:
      scenarioProof.acceptedScenarioEvaluationVerified,
    authorizationHeaderInputMapsToPassthroughAttempt:
      scenarioProof.authorizationHeaderInputMapsToPassthroughAttempt,
    audienceResourceScenarioEvaluationVerified:
      scenarioProof.audienceResourceScenarioEvaluationVerified,
    bearerInputMapsToPassthroughAttempt:
      scenarioProof.bearerInputMapsToPassthroughAttempt,
    failureTaxonomyEvaluationVerified:
      scenarioProof.failureTaxonomyEvaluationVerified,
    fp0100PublicSecurityBoundaryStillVerified:
      priorBoundaries.fp0100PublicSecurityBoundaryStillVerified,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      priorBoundaries.fp0106ProtocolEnvelopeBoundaryStillVerified,
    fp0107RouteAdapterBoundaryStillVerified:
      priorBoundaries.fp0107RouteAdapterBoundaryStillVerified,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
      priorBoundaries.fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified,
    fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified:
      priorBoundaries.fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified,
    fp0128TokenValidationReadinessBoundaryStillVerified:
      priorBoundaries.fp0128TokenValidationReadinessBoundaryStillVerified,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      priorBoundaries.fp0130MissingTokenChallengeBoundaryStillVerified,
    fp0131TokenValidationRuntimeSequencingBoundaryStillVerified:
      priorBoundaries.fp0131TokenValidationRuntimeSequencingBoundaryStillVerified,
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified:
      priorBoundaries.fp0132TokenValidationRuntimeContractsBoundaryStillVerified,
    fp0133TokenValidationTestDoubleContractsBoundaryStillVerified:
      verifyFp0133TokenValidationTestDoubleContractsBoundary({
        planText: fp0133PlanText,
        repoPaths,
      }) && verifyMcpTokenValidationTestDoubleContractBoundaries(),
    fp0134BoundaryVerified:
      verifyFp0134TokenValidationTestDoubleImplementationBoundary({
        planText: fp0134PlanText,
        repoPaths,
      }),
    fp0135AbsentOrDocsOnlyInvalidTokenChallengeSequencingPlanVerified:
      verifyFp0135AbsentOrDocsOnlyInvalidTokenChallengeSequencingPlan({
        planText: fp0135PlanText,
        repoPaths,
      }),
    fp0136AbsentOrLocalInvalidTokenChallengeContractsVerified:
      verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts({
        planText: fp0136PlanText,
        repoPaths,
      }),
    fp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlanVerified:
      verifyFp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlan(
        {
          planText: fp0137PlanText,
          repoPaths,
        },
      ),
    fp0138Absent: verifyFp0138Compatibility(),
    invalidTokenChallengeContractsFoundationVerified:
      verifyFp0136InvalidTokenChallengeContractsBoundary({
        planText: fp0136PlanText,
        repoPaths,
      }),
    issuerScenarioEvaluationVerified:
      scenarioProof.issuerScenarioEvaluationVerified,
    jwtLikeInputMapsToPassthroughAttempt:
      scenarioProof.jwtLikeInputMapsToPassthroughAttempt,
    localSyntheticTestDoubleOnly:
      sourceScope.localSyntheticTestDoubleOnly &&
      repositoryInventory.tokenValidationTestDoubleRepositoryInventoryVerified,
    malformedNonTokenInputMapsToMalformed:
      scenarioProof.malformedNonTokenInputMapsToMalformed,
    noAuthMiddlewareImplementation: sourceScope.noAuthMiddlewareImplementation,
    noBearerTokenMaterial:
      repositoryInventory.noBearerTokenMaterialRepositoryInventoryVerified,
    noDbQueriesAdded: sourceScope.noDbQueriesAdded,
    noExternalCommunications: sourceScope.noExternalCommunications,
    noFinanceWrite: sourceScope.noFinanceWrite,
    noInvalidTokenChallengeRuntime:
      sourceScope.noInvalidTokenChallengeRuntime &&
      repositoryInventory.noInvalidTokenChallengeRuntimeRepositoryInventoryVerified,
    noJwtDecoder:
      sourceScope.noJwtDecoder &&
      repositoryInventory.noJwtDecodingRuntimeRepositoryInventoryVerified,
    noJwtLikeExamples:
      repositoryInventory.noJwtLikeExampleRepositoryInventoryVerified,
    noMcpRouteBehaviorChange:
      sourceScope.noMcpRouteBehaviorChange && localMcpRouteShapeStillVerified(),
    noMissingTokenChallengeBehaviorChange:
      sourceScope.noMissingTokenChallengeBehaviorChange,
    noModelCalls: sourceScope.noModelCalls,
    noOauthImplementation:
      sourceScope.noOauthImplementation &&
      repositoryInventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
    noOpenAiApiCalls:
      sourceScope.noOpenAiApiCalls &&
      repositoryInventory.noOpenAiApiSourceScanVerified,
    noPackageScriptsAdded: sourceScope.noPackageScriptsAdded,
    noProtectedResourceMetadataRouteBehaviorChange:
      sourceScope.noProtectedResourceMetadataRouteBehaviorChange &&
      metadataRouteShapeStillVerified(),
    noProviderCalls: sourceScope.noProviderCalls,
    noRealTokenExamples:
      repositoryInventory.noRealTokenExampleRepositoryInventoryVerified,
    noRouteConsumesTestDouble:
      sourceScope.noRouteConsumesTestDouble &&
      repositoryInventory.noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified,
    noSchemaMigrationsAdded: sourceScope.noSchemaMigrationsAdded,
    noSourceMutation: sourceScope.noSourceMutation,
    noTokenIntrospection:
      sourceScope.noTokenIntrospection &&
      repositoryInventory.noTokenIntrospectionRuntimeRepositoryInventoryVerified,
    noTokenMaterialInputAccepted: scenarioProof.noTokenMaterialInputAccepted,
    noTokenParser:
      sourceScope.noTokenParser &&
      repositoryInventory.noTokenParsingRuntimeRepositoryInventoryVerified,
    noTokenSessionStorage: sourceScope.noTokenSessionStorage,
    noTokenValidationRuntime:
      sourceScope.noTokenValidationRuntime &&
      repositoryInventory.noTokenValidationRuntimeRepositoryInventoryVerified,
    oauthCredentialInputMapsToPassthroughAttempt:
      scenarioProof.oauthCredentialInputMapsToPassthroughAttempt,
    providerCredentialInputMapsToPassthroughAttempt:
      scenarioProof.providerCredentialInputMapsToPassthroughAttempt,
    rejectedScenarioEvaluationVerified:
      scenarioProof.rejectedScenarioEvaluationVerified,
    rejectedInputNeverEchoesTokenMaterial:
      scenarioProof.rejectedInputNeverEchoesTokenMaterial,
    revocationReplayScenarioEvaluationVerified:
      scenarioProof.revocationReplayScenarioEvaluationVerified,
    scopeScenarioEvaluationVerified:
      scenarioProof.scopeScenarioEvaluationVerified,
    selectorOnlyCompanyKeyPreserved:
      scenarioProof.selectorOnlyCompanyKeyPreserved,
    sessionCookieInputMapsToPassthroughAttempt:
      scenarioProof.sessionCookieInputMapsToPassthroughAttempt,
    subjectOrgCompanyScenarioEvaluationVerified:
      scenarioProof.subjectOrgCompanyScenarioEvaluationVerified,
    syntheticDescriptorOnlyInputVerified:
      scenarioProof.syntheticDescriptorOnlyInputVerified,
    temporalScenarioEvaluationVerified:
      scenarioProof.temporalScenarioEvaluationVerified,
    tokenLikeInputMapsToPassthroughAttempt:
      scenarioProof.tokenLikeInputMapsToPassthroughAttempt,
    tokenValidationTestDoubleLocalImplementationVerified:
      scenarioProof.tokenValidationTestDoubleLocalImplementationVerified,
  }),
);

for (const [key, value] of Object.entries(proof)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0134 synthetic token-validation test-double local proof failed: ${key}`,
    );
  }
}

console.log(
  JSON.stringify(
    {
      ...proof,
      proofDetails: {
        changedPathScope,
        priorBoundaries,
        repositoryInventory,
        scenarioProof,
        sourceScope,
      },
    },
    null,
    2,
  ),
);

function verifyScenarioEvaluation() {
  const acceptedScenario = buildSyntheticTokenValidationScenario({
    companyKey: "synthetic-selector-company",
    family: "subject_org_company",
    outcome: SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME,
    syntheticBinding: {
      companyRef: "synthetic-company-ref",
      orgRef: "synthetic-org-ref",
      subjectRef: "synthetic-subject-ref",
    },
    syntheticScenarioId: "synthetic-accepted-subject-org-company",
  });
  const rejectedScenario = buildSyntheticTokenValidationScenario({
    companyKey: "synthetic-selector-company",
    family: "subject_org_company",
    outcome: "wrong-company",
    syntheticScenarioId: "synthetic-rejected-wrong-company",
  });
  const acceptedEnvelope =
    evaluateSyntheticTokenValidationScenario(acceptedScenario);
  const rejectedEnvelope =
    evaluateSyntheticTokenValidationScenario(rejectedScenario);
  const familyOutcomes = syntheticFailureModesByFamily();
  const evaluatedFamilies = Object.fromEntries(
    MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES.map((family) => {
      const outcome =
        familyOutcomes[family][0] ??
        SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME;
      const scenario = buildSyntheticTokenValidationScenario({
        companyKey: "synthetic-selector-company",
        family,
        outcome,
        syntheticScenarioId: `synthetic-${family}-${outcome}`,
      });
      const envelope = evaluateSyntheticTokenValidationScenario(scenario);
      return [
        family,
        outcome === SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME
          ? envelope.accepted === true
          : envelope.accepted === false && envelope.failureMode === outcome,
      ];
    }),
  );
  const evaluatedTaxonomy =
    MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY.map((failureMode) => {
      const scenario = buildSyntheticTokenValidationScenario({
        companyKey: "synthetic-selector-company",
        outcome: failureMode,
        syntheticScenarioId: `synthetic-failure-${failureMode}`,
      });
      const envelope = evaluateSyntheticTokenValidationScenario(scenario);
      return (
        envelope.accepted === false && envelope.failureMode === failureMode
      );
    });
  const jwtLikeInput = [
    "jwtlikeheader".padEnd(16, "x"),
    "jwtlikepayload".padEnd(16, "x"),
    "jwtlikesig".padEnd(16, "x"),
  ].join(".");
  const forbiddenInputs = [
    {
      family: "authorization_header",
      input: ["Authorization", "synthetic-header-material"].join("="),
    },
    {
      family: "bearer",
      input: ["Bearer", "synthetic-token-material"].join(" "),
    },
    {
      family: "jwt_like",
      input: jwtLikeInput,
    },
    {
      family: "oauth_credential",
      input: ["access_token", "synthetic-token-material"].join("="),
    },
    {
      family: "oauth_credential",
      input: ["refresh_token", "synthetic-token-material"].join("="),
    },
    {
      family: "oauth_credential",
      input: ["client_secret", "synthetic-token-material"].join("="),
    },
    {
      family: "session_cookie",
      input: ["session", "synthetic-token-material"].join("="),
    },
    {
      family: "session_cookie",
      input: ["cookie", "synthetic-token-material"].join("="),
    },
    {
      family: "provider_credential",
      input: ["provider_credential", "synthetic-token-material"].join("="),
    },
  ];
  const malformedNonTokenInput = {
    descriptorKind: "synthetic_non_token_descriptor",
    note: "plain malformed descriptor shape without token material",
    syntheticScenarioId: "synthetic-malformed-non-token-descriptor",
  };
  const rejectedTokenLikeInputs = forbiddenInputs.map(({ family, input }) => {
    const envelope = evaluateSyntheticTokenValidationScenario(input);
    return {
      family,
      input,
      rejectedAsTokenPassthrough: rejectedWithoutEcho(input, envelope),
    };
  });
  const tokenLikeInputProofByFamily = Object.fromEntries(
    [
      "authorization_header",
      "bearer",
      "jwt_like",
      "oauth_credential",
      "session_cookie",
      "provider_credential",
    ].map((family) => [
      family,
      rejectedTokenLikeInputs
        .filter((proof) => proof.family === family)
        .every((proof) => proof.rejectedAsTokenPassthrough),
    ]),
  );
  const malformedNonTokenEnvelope = evaluateSyntheticTokenValidationScenario(
    malformedNonTokenInput,
  );
  const descriptorOnlyInput =
    SyntheticTokenValidationScenarioDescriptorSchema.safeParse(acceptedScenario)
      .success &&
    forbiddenInputs.every(({ input }) => {
      try {
        assertSyntheticScenarioContainsNoTokenMaterial(input);
        return false;
      } catch {
        return true;
      }
    });
  const outputText = JSON.stringify([
    acceptedEnvelope,
    rejectedEnvelope,
    malformedNonTokenEnvelope,
    ...forbiddenInputs.map(({ input }) =>
      evaluateSyntheticTokenValidationScenario(input),
    ),
  ]);
  const outputNoLeakage = scanTokenValidationNoLeakage(outputText).accepted;

  return {
    acceptedScenarioEvaluationVerified:
      acceptedEnvelope.accepted === true &&
      acceptedEnvelope.resultKind === "accepted_test_double" &&
      acceptedEnvelope.carriesRawToken === false,
    audienceResourceScenarioEvaluationVerified:
      evaluatedFamilies.audience_resource === true,
    failureTaxonomyEvaluationVerified: evaluatedTaxonomy.every(Boolean),
    authorizationHeaderInputMapsToPassthroughAttempt:
      tokenLikeInputProofByFamily.authorization_header === true,
    bearerInputMapsToPassthroughAttempt:
      tokenLikeInputProofByFamily.bearer === true,
    issuerScenarioEvaluationVerified: evaluatedFamilies.issuer === true,
    jwtLikeInputMapsToPassthroughAttempt:
      tokenLikeInputProofByFamily.jwt_like === true,
    malformedNonTokenInputMapsToMalformed:
      malformedNonTokenEnvelope.accepted === false &&
      malformedNonTokenEnvelope.failureMode === "malformed" &&
      malformedNonTokenEnvelope.carriesRawToken === false &&
      malformedNonTokenEnvelope.carriesAuthorizationHeader === false &&
      malformedNonTokenEnvelope.carriesJwtClaims === false,
    noTokenMaterialInputAccepted: rejectedTokenLikeInputs.every(
      (proof) => proof.rejectedAsTokenPassthrough,
    ),
    oauthCredentialInputMapsToPassthroughAttempt:
      tokenLikeInputProofByFamily.oauth_credential === true,
    providerCredentialInputMapsToPassthroughAttempt:
      tokenLikeInputProofByFamily.provider_credential === true,
    rejectedScenarioEvaluationVerified:
      rejectedEnvelope.accepted === false &&
      rejectedEnvelope.resultKind === "rejected_test_double" &&
      rejectedEnvelope.failureMode === "wrong-company" &&
      rejectedEnvelope.carriesRawToken === false,
    rejectedInputNeverEchoesTokenMaterial:
      rejectedTokenLikeInputs.every(
        (proof) => proof.rejectedAsTokenPassthrough,
      ) && outputNoLeakage,
    revocationReplayScenarioEvaluationVerified:
      evaluatedFamilies.revocation_replay === true,
    scopeScenarioEvaluationVerified: evaluatedFamilies.scope === true,
    selectorOnlyCompanyKeyPreserved:
      acceptedEnvelope.subjectOrgCompanyBinding.companyKeySelectorOnly ===
        true && !outputText.includes("synthetic-selector-company"),
    sessionCookieInputMapsToPassthroughAttempt:
      tokenLikeInputProofByFamily.session_cookie === true,
    subjectOrgCompanyScenarioEvaluationVerified:
      evaluatedFamilies.subject_org_company === true,
    syntheticDescriptorOnlyInputVerified: descriptorOnlyInput,
    temporalScenarioEvaluationVerified: evaluatedFamilies.temporal === true,
    tokenLikeInputMapsToPassthroughAttempt: rejectedTokenLikeInputs.every(
      (proof) => proof.rejectedAsTokenPassthrough,
    ),
    tokenValidationTestDoubleLocalImplementationVerified:
      outputNoLeakage && verifyMcpTokenValidationTestDoubleNoTokenExamples(),
  };
}

function rejectedWithoutEcho(input, envelope) {
  const outputText = JSON.stringify(envelope);
  return (
    envelope.accepted === false &&
    envelope.failureMode === "token-passthrough-attempt" &&
    envelope.carriesRawToken === false &&
    envelope.carriesAuthorizationHeader === false &&
    envelope.carriesJwtClaims === false &&
    !outputText.includes(input) &&
    scanTokenValidationNoLeakage(outputText).accepted
  );
}

function verifySourceScope() {
  const modelCallPattern = ["call", "Model"].join("");
  const modelCallRegex = new RegExp(
    `\\b(?:responses\\.create|chat\\.completions|model\\s*\\.\\s*create|models\\s*\\.\\s*create|${modelCallPattern})\\s*\\(`,
    "u",
  );

  return {
    localSyntheticTestDoubleOnly:
      !changedPaths.includes(MCP_ROUTE_PATH) &&
      !changedPaths.includes(METADATA_ROUTE_PATH),
    noAuthMiddlewareImplementation:
      !/\b(?:authMiddleware|authorizationMiddleware|routeGuard|verifyBearer|requireAuth|authenticateRequest|setCookie)\s*\(/u.test(
        changedExecutableSource,
      ),
    noDbQueriesAdded:
      !changedPaths.some((path) => /^packages\/db\//u.test(path)) &&
      !/\b(?:from\s+["']drizzle|drizzle\s*\(|select\s*\(|insert\s*\(|update\s*\(|delete\s*\(|sql`)\b/u.test(
        changedExecutableSource,
      ),
    noExternalCommunications:
      !/\b(?:sendEmail|sendReport|contactCustomer|externalMessage)\s*\(/u.test(
        changedExecutableSource,
      ),
    noFinanceWrite:
      !/\b(?:writeFinanceTwin|updateLedger|financeWrite|postLedger|createJournalEntry)\s*\(/u.test(
        changedExecutableSource,
      ),
    noInvalidTokenChallengeRuntime:
      !/\b(?:invalidTokenChallenge|malformedToken|expiredToken|wrongAudience|wrongResource|wrongScope|wrongOrg|wrongCompany|revokedToken|replayedToken)\s*\(/u.test(
        changedExecutableSource,
      ),
    noJwtDecoder:
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
    noProviderCalls:
      !/\b(?:providerConnect|callProvider|createProviderJob|deploy|fetch)\s*\(/u.test(
        changedExecutableSource,
      ),
    noRouteConsumesTestDouble:
      !/\b(?:consumeTestDouble|runTestDouble|testDoubleRuntime|routeTestDouble)\s*\(/u.test(
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
    noTokenValidationRuntime:
      !/\b(?:validateToken|verifyToken|tokenValidator|jwtVerify|verifyJwt|validateBearer|verifyBearer)\s*\(/u.test(
        changedExecutableSource,
      ),
  };
}

function verifyRepositoryInventory() {
  return verifyMcpTokenValidationTestDoubleRepositoryInventory({
    branchDiffPaths: changedPathScope.committedBranchDiffPaths,
    dirtyPaths: changedPathScope.dirtyQaTargetFiles,
    repoPaths,
    sourceTextByPath: readProofSourceTextByPath(repoPaths),
  });
}

function verifyFp0138Compatibility() {
  return (
    verifyFp0138Absent(repoPaths) ||
    (verifyFp0138AbsentOrDocsOnlyTokenValidationRuntimeImplementationPlanning({
      planText: safeReadIfExists(
        FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH,
      ),
      repoPaths,
    }) &&
      verifyFp0139Absent(repoPaths))
  );
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
    fp0120CanonicalResourceAuthServerBoundaryStillVerified:
      verifyFp0120CanonicalResourceAuthServerPlanBoundary({
        planText: safeRead(FP0120_CANONICAL_RESOURCE_AUTH_SERVER_PLAN_PATH),
        repoPaths,
      }),
    fp0122ProtectedResourceMetadataBuilderBoundaryStillVerified:
      verifyFp0122ProtectedResourceMetadataBuilderContractsBoundary({
        planText: safeRead(
          FP0122_PROTECTED_RESOURCE_METADATA_BUILDER_PLAN_PATH,
        ),
        repoPaths,
      }),
    fp0123ProtectedResourceMetadataRouteInputBoundaryStillVerified:
      verifyFp0123ProtectedResourceMetadataRouteInputContractsBoundary({
        planText: safeRead(
          FP0123_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_PLAN_PATH,
        ),
        repoPaths,
      }),
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
  };
}

function localMcpRouteShapeStillVerified() {
  const source = safeRead(MCP_ROUTE_PATH);
  return (
    countMatches(source, /app\.post\("\/mcp"/gu) === 1 &&
    countMatches(source, /app\.get\("\/mcp"/gu) === 1 &&
    !/read-only-app-mcp-token-validation-test-double/u.test(source)
  );
}

function metadataRouteShapeStillVerified() {
  const source = safeRead(METADATA_ROUTE_PATH);
  return (
    countMatches(source, /app\.get\(/gu) === 1 &&
    (source.includes("/.well-known/oauth-protected-resource/mcp") ||
      source.includes("MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH")) &&
    !/WWW-Authenticate/iu.test(source) &&
    !/app\.post|app\.put|app\.patch|app\.delete/iu.test(source)
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

  function walk(directory, prefix = "") {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && skipped.has(entry.name)) continue;
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolutePath = `${directory}/${entry.name}`;
      if (entry.isDirectory()) walk(absolutePath, relativePath);
      else results.push(relativePath);
    }
  }

  walk(process.cwd());
  return results.sort();
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function safeRead(path) {
  return readFileSync(path, "utf8");
}

function safeReadIfExists(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : undefined;
}

function normalize(text) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
