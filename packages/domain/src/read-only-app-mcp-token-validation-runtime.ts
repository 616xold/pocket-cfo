import {
  FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH,
  MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES,
  MCP_TOKEN_VALIDATION_RUNTIME_FP0132_PLAN_PREFIX,
  MCP_TOKEN_VALIDATION_RUNTIME_FP0133_PLAN_PREFIX,
  MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES,
  MCP_TOKEN_VALIDATION_RUNTIME_READ_ONLY_SCOPES,
  MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS,
  MCP_TOKEN_VALIDATION_RUNTIME_CONTRACTS_SCHEMA_VERSION,
  McpAudienceResourceValidationContractBoundarySchema,
  McpAuthenticatedCompanyBindingBoundarySchema,
  McpAuthenticatedSubjectBindingBoundarySchema,
  McpCanonicalResourceUriDependencyBoundarySchema,
  McpIssuerValidationContractBoundarySchema,
  McpNoTokenLeakageRuntimeBoundarySchema,
  McpNoTokenPassthroughBoundarySchema,
  McpOpaqueBearerTokenCandidateBoundarySchema,
  McpRevocationReplayValidationContractBoundarySchema,
  McpScopeValidationContractBoundarySchema,
  McpTokenFailureTaxonomyBoundarySchema,
  McpTokenMaterialNonRetentionBoundarySchema,
  McpTokenTemporalValidationContractBoundarySchema,
  McpTokenValidationResultEnvelopeBoundarySchema,
  McpTokenValidationRuntimeDeferredBoundarySchema,
  McpTokenValidationRuntimeProofContractSchema,
  McpTokenValidationRuntimeProofSchema,
  type McpTokenValidationRuntimeProof,
} from "./read-only-app-mcp-token-validation-runtime-contracts";
import { scanTokenValidationNoLeakage } from "./read-only-app-mcp-token-validation";

export * from "./read-only-app-mcp-token-validation-runtime-contracts";

export type McpTokenValidationRuntimeContracts = ReturnType<
  typeof buildMcpTokenValidationRuntimeContracts
>;

export type McpTokenValidationRuntimeProofInput = Partial<
  Omit<McpTokenValidationRuntimeProof, "schemaVersion" | "localProofOnly">
>;

type Fp0132BoundaryInput =
  | readonly string[]
  | {
      planText?: string;
      repoPaths: readonly string[];
    };

const baseContract = {
  contractOnly: true,
  implementationAdded: false,
  localProofOnly: true,
  readOnly: true,
  schemaVersion: MCP_TOKEN_VALIDATION_RUNTIME_CONTRACTS_SCHEMA_VERSION,
} as const;

export function buildMcpTokenValidationRuntimeContracts() {
  return {
    proofContract: McpTokenValidationRuntimeProofContractSchema.parse({
      ...baseContract,
      contractKind: "McpTokenValidationRuntimeProofContract",
      noRuntimeImplementation: true,
      requiredChecks: [...MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS],
      tokenValidationRuntimeContractsVerified: true,
    }),
    opaqueBearerTokenCandidateBoundary:
      McpOpaqueBearerTokenCandidateBoundarySchema.parse({
        ...baseContract,
        bearerCandidateMayBePresent: true,
        contractKind: "McpOpaqueBearerTokenCandidateBoundary",
        jwtDecodingPerformed: false,
        opaqueCandidateOnly: true,
        rawAuthorizationHeaderRetained: false,
        rawTokenValueRetained: false,
        tokenIntrospectionPerformed: false,
        tokenParsingPerformed: false,
      }),
    tokenMaterialNonRetentionBoundary:
      McpTokenMaterialNonRetentionBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpTokenMaterialNonRetentionBoundary",
        rawTokenEchoed: false,
        rawTokenForwarded: false,
        rawTokenInDocsExamples: false,
        rawTokenInMetadata: false,
        rawTokenInProofOutput: false,
        rawTokenInRouteBodies: false,
        rawTokenInRouteHeaders: false,
        rawTokenInStructuredToolResults: false,
        rawTokenInUiProps: false,
        rawTokenLogged: false,
        rawTokenStored: false,
      }),
    issuerValidationContractBoundary:
      McpIssuerValidationContractBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpIssuerValidationContractBoundary",
        issuerAllowlistOrDiscoveryRequired: true,
        issuerValidationRequired: true,
        issuerValidationRuntimeImplemented: false,
        wrongIssuerFailsClosedFutureOnly: true,
      }),
    audienceResourceValidationContractBoundary:
      McpAudienceResourceValidationContractBoundarySchema.parse({
        ...baseContract,
        audienceResourceValidationRuntimeImplemented: false,
        audienceValidationRequired: true,
        canonicalResourceUriRequired: true,
        clientCompanyKeyIsResourceAuthority: false,
        contractKind: "McpAudienceResourceValidationContractBoundary",
        resourceIndicatorRequired: true,
        resourceValidationRequired: true,
        wrongAudienceFailsClosedFutureOnly: true,
        wrongResourceFailsClosedFutureOnly: true,
      }),
    canonicalResourceUriDependencyBoundary:
      McpCanonicalResourceUriDependencyBoundarySchema.parse({
        ...baseContract,
        canonicalResourceUriImplemented: false,
        contractKind: "McpCanonicalResourceUriDependencyBoundary",
        currentLocalhostUriAuthorityAllowed: false,
        exactStableHttpsCanonicalResourceUriRequired: true,
        fragmentAuthorityAllowed: false,
        futurePublicMcpPathRequired: "/mcp",
        queryStringAuthorityAllowed: false,
        selectorAuthorityAllowed: false,
      }),
    scopeValidationContractBoundary:
      McpScopeValidationContractBoundarySchema.parse({
        ...baseContract,
        allowedReadOnlyScopes: [...MCP_TOKEN_VALIDATION_RUNTIME_READ_ONLY_SCOPES],
        challengedScopesAreOperationMinimum: true,
        challengedScopesCannotWidenBeyondReadOnly: true,
        contractKind: "McpScopeValidationContractBoundary",
        readOnlyScopesOnly: true,
        scopeValidationRequired: true,
        scopeValidationRuntimeImplemented: false,
      }),
    tokenTemporalValidationContractBoundary:
      McpTokenTemporalValidationContractBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpTokenTemporalValidationContractBoundary",
        expiryValidationRequired: true,
        notBeforeValidationRequired: true,
        temporalValidationRuntimeImplemented: false,
        timeSkewLeewayContractRequired: true,
        trustedClockSourceRequired: true,
      }),
    revocationReplayValidationContractBoundary:
      McpRevocationReplayValidationContractBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpRevocationReplayValidationContractBoundary",
        replayValidationRequired: true,
        replayedTokenFailsClosedFutureOnly: true,
        revocationReplayRuntimeImplemented: false,
        revocationValidationRequired: true,
        revokedTokenFailsClosedFutureOnly: true,
      }),
    authenticatedSubjectBindingBoundary:
      McpAuthenticatedSubjectBindingBoundarySchema.parse({
        ...baseContract,
        authenticatedOrgRequired: true,
        authenticatedSubjectRuntimeImplemented: false,
        authenticatedUserRequired: true,
        contractKind: "McpAuthenticatedSubjectBindingBoundary",
        subjectBindingCarriesTokenMaterial: false,
      }),
    authenticatedCompanyBindingBoundary:
      McpAuthenticatedCompanyBindingBoundarySchema.parse({
        ...baseContract,
        authenticatedCompanyRequired: true,
        authenticatedUserOrgCompanyBindingRequired: true,
        clientCompanyKeyAuthorityAllowed: false,
        clientCompanyKeySelectorOnly: true,
        companyBindingRuntimeImplemented: false,
        contractKind: "McpAuthenticatedCompanyBindingBoundary",
        selectorCannotCreateCompanyAuthority: true,
        wrongCompanyFailsClosedFutureOnly: true,
        wrongOrgFailsClosedFutureOnly: true,
      }),
    tokenFailureTaxonomyBoundary: McpTokenFailureTaxonomyBoundarySchema.parse({
      ...baseContract,
      contractKind: "McpTokenFailureTaxonomyBoundary",
      failureModes: [...MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES],
      runtimeStatusMappingImplemented: false,
      taxonomyProofOnly: true,
    }),
    noTokenPassthroughBoundary: McpNoTokenPassthroughBoundarySchema.parse({
      ...baseContract,
      contractKind: "McpNoTokenPassthroughBoundary",
      downstreamTokenTransitAllowed: false,
      inboundClientTokenTransitAllowed: false,
      resultEnvelopeMayCarryToken: false,
      tokenPassthroughForbidden: true,
      upstreamTokenReuseAllowed: false,
    }),
    noTokenLeakageRuntimeBoundary:
      McpNoTokenLeakageRuntimeBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpNoTokenLeakageRuntimeBoundary",
        leakageSurfaces: [...MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES],
        realTokenExamplesAllowed: false,
        tokenMaterialInAppMetadata: false,
        tokenMaterialInChallengeHeaders: false,
        tokenMaterialInDocsExamples: false,
        tokenMaterialInEvidence: false,
        tokenMaterialInLogs: false,
        tokenMaterialInMetadata: false,
        tokenMaterialInProofOutputs: false,
        tokenMaterialInRouteBodies: false,
        tokenMaterialInRouteHeaders: false,
        tokenMaterialInStructuredToolResults: false,
        tokenMaterialInUiProps: false,
      }),
    tokenValidationResultEnvelopeBoundary:
      McpTokenValidationResultEnvelopeBoundarySchema.parse({
        ...baseContract,
        acceptedEnvelopeRequiresCompanyBinding: true,
        acceptedEnvelopeRequiresSubjectBinding: true,
        contractKind: "McpTokenValidationResultEnvelopeBoundary",
        envelopeCarriesAuthorizationHeader: false,
        envelopeCarriesDecodedJwtClaims: false,
        envelopeCarriesPassthroughToken: false,
        envelopeCarriesRawToken: false,
        envelopeMayDriveRouteBehaviorNow: false,
        rejectedEnvelopeUsesFailureTaxonomy: true,
      }),
    tokenValidationRuntimeDeferredBoundary:
      McpTokenValidationRuntimeDeferredBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpTokenValidationRuntimeDeferredBoundary",
        fp0133Created: false,
        noAuthMiddlewareImplementation: true,
        noDbQueriesAdded: true,
        noExternalCommunications: true,
        noFinanceWrite: true,
        noInvalidTokenChallengeRuntime: true,
        noJwtDecodingRuntime: true,
        noMcpRouteBehaviorChange: true,
        noMissingTokenChallengeBehaviorChange: true,
        noModelCalls: true,
        noOauthImplementation: true,
        noOpenAiApiCalls: true,
        noPackageScriptsAdded: true,
        noProtectedResourceMetadataRouteBehaviorChange: true,
        noProviderCalls: true,
        noPublicAssets: true,
        noSchemaMigrationsAdded: true,
        noSourceMutation: true,
        noTokenParsingRuntime: true,
        noTokenSessionStorage: true,
        noTokenValidationRuntime: true,
        noAutonomousAction: true,
      }),
  };
}

export function buildMcpTokenValidationRuntimeProof(
  input: McpTokenValidationRuntimeProofInput = {},
): McpTokenValidationRuntimeProof {
  const contracts = buildMcpTokenValidationRuntimeContracts();

  return McpTokenValidationRuntimeProofSchema.parse({
    schemaVersion: MCP_TOKEN_VALIDATION_RUNTIME_CONTRACTS_SCHEMA_VERSION,
    localProofOnly: true,
    tokenValidationRuntimeContractsVerified:
      input.tokenValidationRuntimeContractsVerified ??
      contracts.proofContract.tokenValidationRuntimeContractsVerified,
    opaqueBearerTokenCandidateBoundaryVerified:
      input.opaqueBearerTokenCandidateBoundaryVerified ??
      contracts.opaqueBearerTokenCandidateBoundary.opaqueCandidateOnly,
    tokenMaterialNonRetentionBoundaryVerified:
      input.tokenMaterialNonRetentionBoundaryVerified ??
      !contracts.tokenMaterialNonRetentionBoundary.rawTokenStored,
    issuerValidationContractBoundaryVerified:
      input.issuerValidationContractBoundaryVerified ??
      contracts.issuerValidationContractBoundary.issuerValidationRequired,
    audienceResourceValidationContractBoundaryVerified:
      input.audienceResourceValidationContractBoundaryVerified ??
      contracts.audienceResourceValidationContractBoundary
        .audienceValidationRequired,
    canonicalResourceUriDependencyBoundaryVerified:
      input.canonicalResourceUriDependencyBoundaryVerified ??
      contracts.canonicalResourceUriDependencyBoundary
        .exactStableHttpsCanonicalResourceUriRequired,
    scopeValidationContractBoundaryVerified:
      input.scopeValidationContractBoundaryVerified ??
      contracts.scopeValidationContractBoundary.readOnlyScopesOnly,
    tokenTemporalValidationContractBoundaryVerified:
      input.tokenTemporalValidationContractBoundaryVerified ??
      contracts.tokenTemporalValidationContractBoundary
        .expiryValidationRequired,
    revocationReplayValidationContractBoundaryVerified:
      input.revocationReplayValidationContractBoundaryVerified ??
      contracts.revocationReplayValidationContractBoundary
        .revocationValidationRequired,
    authenticatedSubjectBindingBoundaryVerified:
      input.authenticatedSubjectBindingBoundaryVerified ??
      contracts.authenticatedSubjectBindingBoundary.authenticatedUserRequired,
    authenticatedCompanyBindingBoundaryVerified:
      input.authenticatedCompanyBindingBoundaryVerified ??
      contracts.authenticatedCompanyBindingBoundary.authenticatedCompanyRequired,
    tokenFailureTaxonomyBoundaryVerified:
      input.tokenFailureTaxonomyBoundaryVerified ??
      contracts.tokenFailureTaxonomyBoundary.taxonomyProofOnly,
    noTokenPassthroughBoundaryVerified:
      input.noTokenPassthroughBoundaryVerified ??
      contracts.noTokenPassthroughBoundary.tokenPassthroughForbidden,
    noTokenLeakageRuntimeBoundaryVerified:
      input.noTokenLeakageRuntimeBoundaryVerified ??
      !contracts.noTokenLeakageRuntimeBoundary.realTokenExamplesAllowed,
    tokenValidationResultEnvelopeBoundaryVerified:
      input.tokenValidationResultEnvelopeBoundaryVerified ??
      !contracts.tokenValidationResultEnvelopeBoundary.envelopeCarriesRawToken,
    tokenValidationRuntimeDeferredBoundaryVerified:
      input.tokenValidationRuntimeDeferredBoundaryVerified ??
      contracts.tokenValidationRuntimeDeferredBoundary.noTokenValidationRuntime,
    noMcpRouteBehaviorChange: input.noMcpRouteBehaviorChange ?? true,
    noProtectedResourceMetadataRouteBehaviorChange:
      input.noProtectedResourceMetadataRouteBehaviorChange ?? true,
    noMissingTokenChallengeBehaviorChange:
      input.noMissingTokenChallengeBehaviorChange ?? true,
    noInvalidTokenChallengeRuntime:
      input.noInvalidTokenChallengeRuntime ?? true,
    noTokenParsingRuntime: input.noTokenParsingRuntime ?? true,
    noTokenValidationRuntime: input.noTokenValidationRuntime ?? true,
    noJwtDecodingRuntime: input.noJwtDecodingRuntime ?? true,
    noTokenSessionStorage: input.noTokenSessionStorage ?? true,
    noOauthImplementation: input.noOauthImplementation ?? true,
    noAuthMiddlewareImplementation:
      input.noAuthMiddlewareImplementation ?? true,
    noDbQueriesAdded: input.noDbQueriesAdded ?? true,
    noSchemaMigrationsAdded: input.noSchemaMigrationsAdded ?? true,
    noPackageScriptsAdded: input.noPackageScriptsAdded ?? true,
    noPublicAssets: input.noPublicAssets ?? true,
    noOpenAiApiCalls: input.noOpenAiApiCalls ?? true,
    noModelCalls: input.noModelCalls ?? true,
    noProviderCalls: input.noProviderCalls ?? true,
    noExternalCommunications: input.noExternalCommunications ?? true,
    noSourceMutation: input.noSourceMutation ?? true,
    noFinanceWrite: input.noFinanceWrite ?? true,
    fp0132BoundaryVerified: input.fp0132BoundaryVerified ?? true,
    fp0133Absent: input.fp0133Absent ?? true,
    fp0131TokenValidationRuntimeSequencingBoundaryStillVerified:
      input.fp0131TokenValidationRuntimeSequencingBoundaryStillVerified ?? true,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      input.fp0130MissingTokenChallengeBoundaryStillVerified ?? true,
    fp0128TokenValidationReadinessBoundaryStillVerified:
      input.fp0128TokenValidationReadinessBoundaryStillVerified ?? true,
    fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified:
      input.fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified ?? true,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
      input.fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified ??
      true,
    fp0107RouteAdapterBoundaryStillVerified:
      input.fp0107RouteAdapterBoundaryStillVerified ?? true,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      input.fp0106ProtocolEnvelopeBoundaryStillVerified ?? true,
    fp0100PublicSecurityBoundaryStillVerified:
      input.fp0100PublicSecurityBoundaryStillVerified ?? true,
  });
}

export function verifyMcpTokenValidationRuntimeRequiredContractBoundaries() {
  const contracts = buildMcpTokenValidationRuntimeContracts();

  return (
    contracts.proofContract.requiredChecks.length ===
      MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS.length &&
    contracts.opaqueBearerTokenCandidateBoundary.opaqueCandidateOnly &&
    !contracts.tokenMaterialNonRetentionBoundary.rawTokenStored &&
    contracts.issuerValidationContractBoundary.issuerValidationRequired &&
    contracts.audienceResourceValidationContractBoundary
      .audienceValidationRequired &&
    contracts.canonicalResourceUriDependencyBoundary
      .exactStableHttpsCanonicalResourceUriRequired &&
    contracts.scopeValidationContractBoundary.readOnlyScopesOnly &&
    contracts.tokenTemporalValidationContractBoundary
      .notBeforeValidationRequired &&
    contracts.revocationReplayValidationContractBoundary
      .replayValidationRequired &&
    contracts.authenticatedSubjectBindingBoundary.authenticatedUserRequired &&
    contracts.authenticatedCompanyBindingBoundary.clientCompanyKeySelectorOnly &&
    contracts.noTokenPassthroughBoundary.tokenPassthroughForbidden &&
    !contracts.noTokenLeakageRuntimeBoundary.realTokenExamplesAllowed &&
    !contracts.tokenValidationResultEnvelopeBoundary.envelopeCarriesRawToken &&
    contracts.tokenValidationRuntimeDeferredBoundary.noTokenValidationRuntime
  );
}

export function verifyMcpTokenValidationRuntimeNoLeakageExamples() {
  const safeExamples = [
    "No token values, cookies, sessions, authorization material, raw finance data, raw source dumps, provider credentials, app submission copy, or public assets are retained.",
    "Bearer is used only as an auth scheme label in proof text.",
    "The future result envelope carries binding posture and failure taxonomy only.",
  ];
  const leakingExamples = [
    ["Authorization", ":", "Bearer", "synthetic-token-material"].join(" "),
    ["Bearer", "synthetic-token-material"].join(" "),
    ["access_token", "=", "synthetic-token-material"].join(""),
    ["refresh_token", "=", "synthetic-token-material"].join(""),
    ["client_secret", "=", "synthetic-secret-material"].join(""),
    ["session", "=", "synthetic-session-material"].join(""),
    ["cookie", ":", "synthetic-cookie-material"].join(" "),
    ["x-api-key", ":", "synthetic-key-material"].join(" "),
    ["eyJsyntheticHeader", "eyJsyntheticPayload", "syntheticSignature"].join(
      ".",
    ),
    "raw finance data",
    "raw source dump",
    "provider credential",
    "app submission copy",
  ];

  return (
    safeExamples.every(
      (example) => scanTokenValidationNoLeakage(example).accepted,
    ) &&
    leakingExamples.every(
      (example) => !scanTokenValidationNoLeakage(example).accepted,
    )
  );
}

export function verifyMcpTokenValidationRuntimeResultEnvelopeBoundary() {
  const contracts = buildMcpTokenValidationRuntimeContracts();
  return (
    contracts.tokenValidationResultEnvelopeBoundary
      .acceptedEnvelopeRequiresSubjectBinding &&
    contracts.tokenValidationResultEnvelopeBoundary
      .acceptedEnvelopeRequiresCompanyBinding &&
    contracts.tokenValidationResultEnvelopeBoundary
      .rejectedEnvelopeUsesFailureTaxonomy &&
    !contracts.tokenValidationResultEnvelopeBoundary.envelopeCarriesRawToken &&
    !contracts.tokenValidationResultEnvelopeBoundary
      .envelopeCarriesAuthorizationHeader &&
    !contracts.tokenValidationResultEnvelopeBoundary
      .envelopeCarriesDecodedJwtClaims &&
    !contracts.tokenValidationResultEnvelopeBoundary.envelopeMayDriveRouteBehaviorNow
  );
}

export function verifyFp0132AbsentOrLocalTokenValidationRuntimeContracts(
  input: Fp0132BoundaryInput,
) {
  const { planText, repoPaths } = normalizeFp0132BoundaryInput(input);
  const fp0132Hits = fpPlanHits(
    repoPaths,
    MCP_TOKEN_VALIDATION_RUNTIME_FP0132_PLAN_PREFIX,
  );
  if (fp0132Hits.length === 0) return true;

  return (
    fp0132Hits.length === 1 &&
    fp0132Hits[0] ===
      FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH &&
    typeof planText === "string" &&
    fp0132PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0132TokenValidationRuntimeContractsBoundary(
  input: Fp0132BoundaryInput,
) {
  const { planText, repoPaths } = normalizeFp0132BoundaryInput(input);
  const fp0132Hits = fpPlanHits(
    repoPaths,
    MCP_TOKEN_VALIDATION_RUNTIME_FP0132_PLAN_PREFIX,
  );

  return (
    fp0132Hits.length === 1 &&
    fp0132Hits[0] ===
      FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH &&
    typeof planText === "string" &&
    fp0132PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0133Absent(repoPaths: readonly string[]) {
  return (
    fpPlanHits(repoPaths, MCP_TOKEN_VALIDATION_RUNTIME_FP0133_PLAN_PREFIX)
      .length === 0
  );
}

export function verifyFp0132PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    authenticatedBinding:
      normalized.includes("authenticated user/org/company binding") &&
      normalized.includes("companykey remains selector-only"),
    canonicalResourceUriDependency:
      normalized.includes("canonical resource uri") &&
      normalized.includes("exact stable https canonical resource uri"),
    failureTaxonomy: [
      "wrong-issuer",
      "wrong-audience",
      "wrong-resource",
      "wrong-scope",
      "wrong-org",
      "wrong-company",
      "revoked",
      "replayed",
    ].every((text) => normalized.includes(text)),
    fp0133Absent: normalized.includes("fp-0133 remains absent"),
    issuerAudienceScopeTemporal:
      normalized.includes("issuer") &&
      normalized.includes("audience/resource") &&
      normalized.includes("expiry") &&
      normalized.includes("not-before") &&
      normalized.includes("time-skew"),
    localProofOnly:
      normalized.includes("local/proof-only/read-only") &&
      normalized.includes("pure domain contracts"),
    noRuntimeScope:
      normalized.includes("does not parse, decode, validate, introspect, store, forward, or log any real token") &&
      normalized.includes("does not change `/mcp`") &&
      normalized.includes("does not change protected-resource metadata route behavior") &&
      normalized.includes("does not change missing-token challenge behavior"),
    noTokenLeakage:
      normalized.includes("logs") &&
      normalized.includes("proof output") &&
      normalized.includes("docs examples") &&
      normalized.includes("structured tool results") &&
      normalized.includes("ui props") &&
      normalized.includes("challenge headers"),
    noTokenPassthrough: normalized.includes("token passthrough is forbidden"),
    resultEnvelope:
      normalized.includes("future validation result") ||
      normalized.includes("result envelope"),
    scopeMinimization:
      normalized.includes("read-only scope") &&
      normalized.includes("challenged scopes"),
  };
}

function fp0132PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return (
    [
      "local/proof-only/read-only token-validation runtime contract foundation",
      "pure domain contracts",
      "this is not token validation runtime implementation",
      "not token parsing runtime implementation",
      "not jwt decoding",
      "not oauth implementation",
      "not token/session storage",
      "not auth middleware implementation",
      "not invalid-token `www-authenticate` route behavior implementation",
      "does not parse, decode, validate, introspect, store, forward, or log any real token",
      "does not change `/mcp`",
      "does not change protected-resource metadata route behavior",
      "does not change missing-token challenge behavior",
      "no raw sources, source snapshots",
      "no mission state changes",
      "fp-0133 remains absent",
    ].every((requiredText) => normalized.includes(requiredText)) &&
    Object.values(verifyFp0132PlanningTextRequiredTopics(planText)).every(
      Boolean,
    )
  );
}

function normalizeFp0132BoundaryInput(input: Fp0132BoundaryInput): {
  planText?: string;
  repoPaths: readonly string[];
} {
  if ("repoPaths" in input) {
    return input;
  }
  return { repoPaths: input };
}

function fpPlanHits(repoPaths: readonly string[], planPrefix: string) {
  return repoPaths
    .map((path) => path.replace(/\\/gu, "/"))
    .filter((path) => path.includes(planPrefix));
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
