import { z } from "zod";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const MCP_TOKEN_VALIDATION_RUNTIME_CONTRACTS_SCHEMA_VERSION =
  "v2az.read-only-app-mcp-token-validation-runtime-contracts.v1";

export const FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH =
  "plans/FP-0132-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-foundation.md";

export const MCP_TOKEN_VALIDATION_RUNTIME_FP0132_PLAN_PREFIX = "FP-0132";
export const MCP_TOKEN_VALIDATION_RUNTIME_FP0133_PLAN_PREFIX = "FP-0133";

export const MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS = [
  "issuer_validation",
  "audience_resource_validation",
  "canonical_resource_uri_dependency",
  "scope_validation",
  "expiry_validation",
  "not_before_validation",
  "time_skew_validation",
  "revocation_validation",
  "replay_validation",
  "authenticated_subject_binding",
  "authenticated_company_binding",
  "no_token_passthrough",
  "no_token_leakage",
] as const;

export const MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES = [
  "invalid_token",
  "malformed_token",
  "expired_token",
  "not_yet_valid_token",
  "wrong_issuer",
  "wrong_audience",
  "wrong_resource",
  "wrong_scope",
  "wrong_org",
  "wrong_company",
  "revoked_token",
  "replayed_token",
  "token_passthrough_attempt",
] as const;

export const MCP_TOKEN_VALIDATION_RUNTIME_READ_ONLY_SCOPES = [
  "mcp:read",
  "evidence:read",
] as const;

export const MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES = [
  "logs",
  "proof_outputs",
  "docs_examples",
  "route_bodies",
  "route_headers",
  "route_responses",
  "metadata",
  "evidence",
  "structured_tool_results",
  "ui_props",
  "app_metadata",
  "challenge_headers",
] as const;

export const McpTokenValidationRuntimeContractKindSchema = z.enum([
  "McpTokenValidationRuntimeProofContract",
  "McpOpaqueBearerTokenCandidateBoundary",
  "McpTokenMaterialNonRetentionBoundary",
  "McpIssuerValidationContractBoundary",
  "McpAudienceResourceValidationContractBoundary",
  "McpCanonicalResourceUriDependencyBoundary",
  "McpScopeValidationContractBoundary",
  "McpTokenTemporalValidationContractBoundary",
  "McpRevocationReplayValidationContractBoundary",
  "McpAuthenticatedSubjectBindingBoundary",
  "McpAuthenticatedCompanyBindingBoundary",
  "McpTokenFailureTaxonomyBoundary",
  "McpNoTokenPassthroughBoundary",
  "McpNoTokenLeakageRuntimeBoundary",
  "McpTokenValidationResultEnvelopeBoundary",
  "McpTokenValidationRuntimeDeferredBoundary",
]);

export type McpTokenValidationRuntimeContractKind = z.infer<
  typeof McpTokenValidationRuntimeContractKindSchema
>;

const BaseRuntimeContractSchema = z
  .object({
    schemaVersion: z.literal(
      MCP_TOKEN_VALIDATION_RUNTIME_CONTRACTS_SCHEMA_VERSION,
    ),
    contractKind: McpTokenValidationRuntimeContractKindSchema,
    localProofOnly: trueLiteral,
    readOnly: trueLiteral,
    contractOnly: trueLiteral,
    implementationAdded: falseLiteral,
  })
  .strict();

export const McpTokenValidationRuntimeProofContractSchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpTokenValidationRuntimeProofContract"),
    tokenValidationRuntimeContractsVerified: trueLiteral,
    requiredChecks: z.tuple([
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[0]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[1]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[2]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[3]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[4]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[5]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[6]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[7]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[8]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[9]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[10]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[11]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS[12]),
    ]),
    noRuntimeImplementation: trueLiteral,
  }).strict();

export const McpOpaqueBearerTokenCandidateBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpOpaqueBearerTokenCandidateBoundary"),
    opaqueCandidateOnly: trueLiteral,
    bearerCandidateMayBePresent: trueLiteral,
    rawTokenValueRetained: falseLiteral,
    rawAuthorizationHeaderRetained: falseLiteral,
    tokenParsingPerformed: falseLiteral,
    jwtDecodingPerformed: falseLiteral,
    tokenIntrospectionPerformed: falseLiteral,
  }).strict();

export const McpTokenMaterialNonRetentionBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpTokenMaterialNonRetentionBoundary"),
    rawTokenStored: falseLiteral,
    rawTokenLogged: falseLiteral,
    rawTokenEchoed: falseLiteral,
    rawTokenForwarded: falseLiteral,
    rawTokenInProofOutput: falseLiteral,
    rawTokenInDocsExamples: falseLiteral,
    rawTokenInStructuredToolResults: falseLiteral,
    rawTokenInUiProps: falseLiteral,
    rawTokenInRouteBodies: falseLiteral,
    rawTokenInRouteHeaders: falseLiteral,
    rawTokenInMetadata: falseLiteral,
  }).strict();

export const McpIssuerValidationContractBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpIssuerValidationContractBoundary"),
    issuerValidationRequired: trueLiteral,
    issuerAllowlistOrDiscoveryRequired: trueLiteral,
    issuerValidationRuntimeImplemented: falseLiteral,
    wrongIssuerFailsClosedFutureOnly: trueLiteral,
  }).strict();

export const McpAudienceResourceValidationContractBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpAudienceResourceValidationContractBoundary"),
    audienceValidationRequired: trueLiteral,
    resourceValidationRequired: trueLiteral,
    resourceIndicatorRequired: trueLiteral,
    canonicalResourceUriRequired: trueLiteral,
    audienceResourceValidationRuntimeImplemented: falseLiteral,
    clientCompanyKeyIsResourceAuthority: falseLiteral,
    wrongAudienceFailsClosedFutureOnly: trueLiteral,
    wrongResourceFailsClosedFutureOnly: trueLiteral,
  }).strict();

export const McpCanonicalResourceUriDependencyBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpCanonicalResourceUriDependencyBoundary"),
    exactStableHttpsCanonicalResourceUriRequired: trueLiteral,
    canonicalResourceUriImplemented: falseLiteral,
    currentLocalhostUriAuthorityAllowed: falseLiteral,
    queryStringAuthorityAllowed: falseLiteral,
    fragmentAuthorityAllowed: falseLiteral,
    selectorAuthorityAllowed: falseLiteral,
    futurePublicMcpPathRequired: z.literal("/mcp"),
  }).strict();

export const McpScopeValidationContractBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpScopeValidationContractBoundary"),
    scopeValidationRequired: trueLiteral,
    scopeValidationRuntimeImplemented: falseLiteral,
    readOnlyScopesOnly: trueLiteral,
    challengedScopesAreOperationMinimum: trueLiteral,
    challengedScopesCannotWidenBeyondReadOnly: trueLiteral,
    allowedReadOnlyScopes: z.tuple([
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_READ_ONLY_SCOPES[0]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_READ_ONLY_SCOPES[1]),
    ]),
  }).strict();

export const McpTokenTemporalValidationContractBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpTokenTemporalValidationContractBoundary"),
    expiryValidationRequired: trueLiteral,
    notBeforeValidationRequired: trueLiteral,
    timeSkewLeewayContractRequired: trueLiteral,
    trustedClockSourceRequired: trueLiteral,
    temporalValidationRuntimeImplemented: falseLiteral,
  }).strict();

export const McpRevocationReplayValidationContractBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpRevocationReplayValidationContractBoundary"),
    revocationValidationRequired: trueLiteral,
    replayValidationRequired: trueLiteral,
    revokedTokenFailsClosedFutureOnly: trueLiteral,
    replayedTokenFailsClosedFutureOnly: trueLiteral,
    revocationReplayRuntimeImplemented: falseLiteral,
  }).strict();

export const McpAuthenticatedSubjectBindingBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpAuthenticatedSubjectBindingBoundary"),
    authenticatedUserRequired: trueLiteral,
    authenticatedOrgRequired: trueLiteral,
    authenticatedSubjectRuntimeImplemented: falseLiteral,
    subjectBindingCarriesTokenMaterial: falseLiteral,
  }).strict();

export const McpAuthenticatedCompanyBindingBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpAuthenticatedCompanyBindingBoundary"),
    authenticatedCompanyRequired: trueLiteral,
    authenticatedUserOrgCompanyBindingRequired: trueLiteral,
    clientCompanyKeySelectorOnly: trueLiteral,
    clientCompanyKeyAuthorityAllowed: falseLiteral,
    selectorCannotCreateCompanyAuthority: trueLiteral,
    wrongOrgFailsClosedFutureOnly: trueLiteral,
    wrongCompanyFailsClosedFutureOnly: trueLiteral,
    companyBindingRuntimeImplemented: falseLiteral,
  }).strict();

export const McpTokenFailureTaxonomyBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpTokenFailureTaxonomyBoundary"),
    failureModes: z.tuple([
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[0]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[1]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[2]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[3]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[4]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[5]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[6]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[7]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[8]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[9]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[10]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[11]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES[12]),
    ]),
    taxonomyProofOnly: trueLiteral,
    runtimeStatusMappingImplemented: falseLiteral,
  }).strict();

export const McpNoTokenPassthroughBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpNoTokenPassthroughBoundary"),
    tokenPassthroughForbidden: trueLiteral,
    inboundClientTokenTransitAllowed: falseLiteral,
    downstreamTokenTransitAllowed: falseLiteral,
    upstreamTokenReuseAllowed: falseLiteral,
    resultEnvelopeMayCarryToken: falseLiteral,
  }).strict();

export const McpNoTokenLeakageRuntimeBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpNoTokenLeakageRuntimeBoundary"),
    leakageSurfaces: z.tuple([
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES[0]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES[1]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES[2]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES[3]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES[4]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES[5]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES[6]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES[7]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES[8]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES[9]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES[10]),
      z.literal(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES[11]),
    ]),
    realTokenExamplesAllowed: falseLiteral,
    tokenMaterialInLogs: falseLiteral,
    tokenMaterialInProofOutputs: falseLiteral,
    tokenMaterialInDocsExamples: falseLiteral,
    tokenMaterialInRouteBodies: falseLiteral,
    tokenMaterialInRouteHeaders: falseLiteral,
    tokenMaterialInMetadata: falseLiteral,
    tokenMaterialInEvidence: falseLiteral,
    tokenMaterialInStructuredToolResults: falseLiteral,
    tokenMaterialInUiProps: falseLiteral,
    tokenMaterialInAppMetadata: falseLiteral,
    tokenMaterialInChallengeHeaders: falseLiteral,
  }).strict();

export const McpTokenValidationResultEnvelopeBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpTokenValidationResultEnvelopeBoundary"),
    acceptedEnvelopeRequiresSubjectBinding: trueLiteral,
    acceptedEnvelopeRequiresCompanyBinding: trueLiteral,
    rejectedEnvelopeUsesFailureTaxonomy: trueLiteral,
    envelopeCarriesRawToken: falseLiteral,
    envelopeCarriesAuthorizationHeader: falseLiteral,
    envelopeCarriesDecodedJwtClaims: falseLiteral,
    envelopeCarriesPassthroughToken: falseLiteral,
    envelopeMayDriveRouteBehaviorNow: falseLiteral,
  }).strict();

export const McpTokenValidationRuntimeDeferredBoundarySchema =
  BaseRuntimeContractSchema.extend({
    contractKind: z.literal("McpTokenValidationRuntimeDeferredBoundary"),
    noMcpRouteBehaviorChange: trueLiteral,
    noProtectedResourceMetadataRouteBehaviorChange: trueLiteral,
    noMissingTokenChallengeBehaviorChange: trueLiteral,
    noInvalidTokenChallengeRuntime: trueLiteral,
    noTokenParsingRuntime: trueLiteral,
    noTokenValidationRuntime: trueLiteral,
    noJwtDecodingRuntime: trueLiteral,
    noTokenSessionStorage: trueLiteral,
    noOauthImplementation: trueLiteral,
    noAuthMiddlewareImplementation: trueLiteral,
    noDbQueriesAdded: trueLiteral,
    noSchemaMigrationsAdded: trueLiteral,
    noPackageScriptsAdded: trueLiteral,
    noPublicAssets: trueLiteral,
    noOpenAiApiCalls: trueLiteral,
    noModelCalls: trueLiteral,
    noProviderCalls: trueLiteral,
    noExternalCommunications: trueLiteral,
    noSourceMutation: trueLiteral,
    noFinanceWrite: trueLiteral,
    noAutonomousAction: trueLiteral,
    fp0133Created: falseLiteral,
  }).strict();

export const McpTokenValidationRuntimeProofSchema = z
  .object({
    schemaVersion: z.literal(
      MCP_TOKEN_VALIDATION_RUNTIME_CONTRACTS_SCHEMA_VERSION,
    ),
    localProofOnly: trueLiteral,
    tokenValidationRuntimeContractsVerified: trueLiteral,
    opaqueBearerTokenCandidateBoundaryVerified: trueLiteral,
    tokenMaterialNonRetentionBoundaryVerified: trueLiteral,
    issuerValidationContractBoundaryVerified: trueLiteral,
    audienceResourceValidationContractBoundaryVerified: trueLiteral,
    canonicalResourceUriDependencyBoundaryVerified: trueLiteral,
    scopeValidationContractBoundaryVerified: trueLiteral,
    tokenTemporalValidationContractBoundaryVerified: trueLiteral,
    revocationReplayValidationContractBoundaryVerified: trueLiteral,
    authenticatedSubjectBindingBoundaryVerified: trueLiteral,
    authenticatedCompanyBindingBoundaryVerified: trueLiteral,
    tokenFailureTaxonomyBoundaryVerified: trueLiteral,
    noTokenPassthroughBoundaryVerified: trueLiteral,
    noTokenLeakageRuntimeBoundaryVerified: trueLiteral,
    tokenValidationResultEnvelopeBoundaryVerified: trueLiteral,
    tokenValidationRuntimeDeferredBoundaryVerified: trueLiteral,
    noMcpRouteBehaviorChange: trueLiteral,
    noProtectedResourceMetadataRouteBehaviorChange: trueLiteral,
    noMissingTokenChallengeBehaviorChange: trueLiteral,
    noInvalidTokenChallengeRuntime: trueLiteral,
    noTokenParsingRuntime: trueLiteral,
    noTokenValidationRuntime: trueLiteral,
    noJwtDecodingRuntime: trueLiteral,
    noTokenSessionStorage: trueLiteral,
    noOauthImplementation: trueLiteral,
    noAuthMiddlewareImplementation: trueLiteral,
    noDbQueriesAdded: trueLiteral,
    noSchemaMigrationsAdded: trueLiteral,
    noPackageScriptsAdded: trueLiteral,
    noPublicAssets: trueLiteral,
    noOpenAiApiCalls: trueLiteral,
    noModelCalls: trueLiteral,
    noProviderCalls: trueLiteral,
    noExternalCommunications: trueLiteral,
    noSourceMutation: trueLiteral,
    noFinanceWrite: trueLiteral,
    fp0132BoundaryVerified: trueLiteral,
    fp0133AbsentOrLocalTokenValidationTestDoubleContractsVerified: trueLiteral,
    fp0134BoundaryVerified: trueLiteral,
    fp0131TokenValidationRuntimeSequencingBoundaryStillVerified: trueLiteral,
    fp0130MissingTokenChallengeBoundaryStillVerified: trueLiteral,
    fp0128TokenValidationReadinessBoundaryStillVerified: trueLiteral,
    fp0127WwwAuthenticateAuthChallengeBoundaryStillVerified: trueLiteral,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified: trueLiteral,
    fp0107RouteAdapterBoundaryStillVerified: trueLiteral,
    fp0106ProtocolEnvelopeBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
  })
  .strict();

export type McpTokenValidationRuntimeProofContract = z.infer<
  typeof McpTokenValidationRuntimeProofContractSchema
>;
export type McpOpaqueBearerTokenCandidateBoundary = z.infer<
  typeof McpOpaqueBearerTokenCandidateBoundarySchema
>;
export type McpTokenMaterialNonRetentionBoundary = z.infer<
  typeof McpTokenMaterialNonRetentionBoundarySchema
>;
export type McpIssuerValidationContractBoundary = z.infer<
  typeof McpIssuerValidationContractBoundarySchema
>;
export type McpAudienceResourceValidationContractBoundary = z.infer<
  typeof McpAudienceResourceValidationContractBoundarySchema
>;
export type McpCanonicalResourceUriDependencyBoundary = z.infer<
  typeof McpCanonicalResourceUriDependencyBoundarySchema
>;
export type McpScopeValidationContractBoundary = z.infer<
  typeof McpScopeValidationContractBoundarySchema
>;
export type McpTokenTemporalValidationContractBoundary = z.infer<
  typeof McpTokenTemporalValidationContractBoundarySchema
>;
export type McpRevocationReplayValidationContractBoundary = z.infer<
  typeof McpRevocationReplayValidationContractBoundarySchema
>;
export type McpAuthenticatedSubjectBindingBoundary = z.infer<
  typeof McpAuthenticatedSubjectBindingBoundarySchema
>;
export type McpAuthenticatedCompanyBindingBoundary = z.infer<
  typeof McpAuthenticatedCompanyBindingBoundarySchema
>;
export type McpTokenFailureTaxonomyBoundary = z.infer<
  typeof McpTokenFailureTaxonomyBoundarySchema
>;
export type McpNoTokenPassthroughBoundary = z.infer<
  typeof McpNoTokenPassthroughBoundarySchema
>;
export type McpNoTokenLeakageRuntimeBoundary = z.infer<
  typeof McpNoTokenLeakageRuntimeBoundarySchema
>;
export type McpTokenValidationResultEnvelopeBoundary = z.infer<
  typeof McpTokenValidationResultEnvelopeBoundarySchema
>;
export type McpTokenValidationRuntimeDeferredBoundary = z.infer<
  typeof McpTokenValidationRuntimeDeferredBoundarySchema
>;
export type McpTokenValidationRuntimeProof = z.infer<
  typeof McpTokenValidationRuntimeProofSchema
>;
