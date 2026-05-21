import { z } from "zod";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCHEMA_VERSION =
  "v2ba.read-only-app-mcp-token-validation-test-double-contracts.v1";

export const FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH =
  "plans/FP-0133-read-only-chatgpt-app-mcp-token-validation-test-double-contracts-foundation.md";

export const MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0133_PLAN_PREFIX = "FP-0133";
export const MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0134_PLAN_PREFIX = "FP-0134";

export const MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES = [
  "issuer",
  "audience_resource",
  "scope",
  "temporal",
  "revocation_replay",
  "subject_org_company",
] as const;

export const MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY = [
  "malformed",
  "expired",
  "wrong-issuer",
  "wrong-audience",
  "wrong-resource",
  "wrong-scope",
  "wrong-org",
  "wrong-company",
  "revoked",
  "replayed",
  "token-passthrough-attempt",
] as const;

export const MCP_TOKEN_VALIDATION_TEST_DOUBLE_LEAKAGE_SURFACES = [
  "logs",
  "proof_output",
  "docs_examples",
  "headers",
  "route_bodies",
  "metadata_examples",
  "evidence",
  "structured_results",
  "ui_props",
  "challenge_examples",
  "app_metadata",
] as const;

export const McpTokenValidationTestDoubleFailureModeSchema = z.enum(
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY,
);

export const McpTokenValidationTestDoubleContractKindSchema = z.enum([
  "McpTokenValidationTestDoubleProofContract",
  "McpSyntheticValidationScenarioBoundary",
  "McpSyntheticNonTokenInputBoundary",
  "McpNoRealTokenExampleBoundary",
  "McpNoJwtLikeExampleBoundary",
  "McpAcceptedValidationResultTestDoubleBoundary",
  "McpRejectedValidationResultTestDoubleBoundary",
  "McpIssuerScenarioTestDoubleBoundary",
  "McpAudienceResourceScenarioTestDoubleBoundary",
  "McpScopeScenarioTestDoubleBoundary",
  "McpTemporalScenarioTestDoubleBoundary",
  "McpRevocationReplayScenarioTestDoubleBoundary",
  "McpSubjectOrgCompanyScenarioTestDoubleBoundary",
  "McpFailureTaxonomyTestDoubleBoundary",
  "McpSelectorOnlyCompanyKeyTestDoubleBoundary",
  "McpNoTokenPassthroughTestDoubleBoundary",
  "McpNoTokenLeakageTestDoubleBoundary",
  "McpNoRuntimeConsumptionBoundary",
]);

const BaseTestDoubleContractSchema = z
  .object({
    schemaVersion: z.literal(MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCHEMA_VERSION),
    contractKind: McpTokenValidationTestDoubleContractKindSchema,
    localProofOnly: trueLiteral,
    readOnly: trueLiteral,
    contractOnly: trueLiteral,
    implementationAdded: falseLiteral,
  })
  .strict();

export const McpTokenValidationTestDoubleProofContractSchema =
  BaseTestDoubleContractSchema.extend({
    contractKind: z.literal("McpTokenValidationTestDoubleProofContract"),
    tokenValidationTestDoubleContractsVerified: trueLiteral,
    scenarioFamilies: z.array(
      z.enum(MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES),
    ),
    noRuntimeImplementation: trueLiteral,
  }).strict();

export const McpSyntheticValidationScenarioBoundarySchema =
  BaseTestDoubleContractSchema.extend({
    contractKind: z.literal("McpSyntheticValidationScenarioBoundary"),
    syntheticScenarioDescriptorsOnly: trueLiteral,
    fixtureFilesRequired: falseLiteral,
    realTokenMaterialAccepted: falseLiteral,
    tokenLikeInputAccepted: falseLiteral,
  }).strict();

export const McpSyntheticNonTokenInputBoundarySchema =
  BaseTestDoubleContractSchema.extend({
    contractKind: z.literal("McpSyntheticNonTokenInputBoundary"),
    inputKind: z.literal("fixtureless_non_token_descriptor"),
    authorizationHeaderAccepted: falseLiteral,
    bearerValueAccepted: falseLiteral,
    jwtLikeValueAccepted: falseLiteral,
    tokenStringAccepted: falseLiteral,
  }).strict();

export const McpNoRealTokenExampleBoundarySchema =
  BaseTestDoubleContractSchema.extend({
    contractKind: z.literal("McpNoRealTokenExampleBoundary"),
    realTokenExamplesAllowed: falseLiteral,
    accessTokenFieldsAllowed: falseLiteral,
    bearerTokenMaterialExamplesAllowed: falseLiteral,
    credentialExamplesAllowed: falseLiteral,
    refreshTokenFieldsAllowed: falseLiteral,
  }).strict();

export const McpNoJwtLikeExampleBoundarySchema =
  BaseTestDoubleContractSchema.extend({
    contractKind: z.literal("McpNoJwtLikeExampleBoundary"),
    decodedJwtClaimsAllowed: falseLiteral,
    jwtDecodingPerformed: falseLiteral,
    jwtLikeStringsAllowed: falseLiteral,
  }).strict();

export const McpAcceptedValidationResultTestDoubleBoundarySchema =
  BaseTestDoubleContractSchema.extend({
    contractKind: z.literal("McpAcceptedValidationResultTestDoubleBoundary"),
    acceptedResultCanBeModeled: trueLiteral,
    carriesAuthorizationHeader: falseLiteral,
    carriesDecodedClaims: falseLiteral,
    carriesRawToken: falseLiteral,
    requiresSyntheticSubjectOrgCompanyBinding: trueLiteral,
  }).strict();

export const McpRejectedValidationResultTestDoubleBoundarySchema =
  BaseTestDoubleContractSchema.extend({
    contractKind: z.literal("McpRejectedValidationResultTestDoubleBoundary"),
    rejectedResultCanBeModeled: trueLiteral,
    carriesAuthorizationHeader: falseLiteral,
    carriesRawToken: falseLiteral,
    mapsToRouteChallengeRuntime: falseLiteral,
    usesFailureTaxonomy: trueLiteral,
  }).strict();

function scenarioBoundary(
  kind: z.infer<typeof McpTokenValidationTestDoubleContractKindSchema>,
) {
  return BaseTestDoubleContractSchema.extend({
    contractKind: z.literal(kind),
    modeledAsScenarioDescriptor: trueLiteral,
    runtimeCheckImplemented: falseLiteral,
    tokenMaterialRequired: falseLiteral,
  }).strict();
}

export const McpIssuerScenarioTestDoubleBoundarySchema = scenarioBoundary(
  "McpIssuerScenarioTestDoubleBoundary",
);
export const McpAudienceResourceScenarioTestDoubleBoundarySchema =
  scenarioBoundary("McpAudienceResourceScenarioTestDoubleBoundary");
export const McpScopeScenarioTestDoubleBoundarySchema = scenarioBoundary(
  "McpScopeScenarioTestDoubleBoundary",
);
export const McpTemporalScenarioTestDoubleBoundarySchema = scenarioBoundary(
  "McpTemporalScenarioTestDoubleBoundary",
);
export const McpRevocationReplayScenarioTestDoubleBoundarySchema =
  scenarioBoundary("McpRevocationReplayScenarioTestDoubleBoundary");
export const McpSubjectOrgCompanyScenarioTestDoubleBoundarySchema =
  scenarioBoundary("McpSubjectOrgCompanyScenarioTestDoubleBoundary");

export const McpFailureTaxonomyTestDoubleBoundarySchema =
  BaseTestDoubleContractSchema.extend({
    contractKind: z.literal("McpFailureTaxonomyTestDoubleBoundary"),
    failureModes: z.array(McpTokenValidationTestDoubleFailureModeSchema),
    routeStatusMappingImplemented: falseLiteral,
    taxonomyProofOnly: trueLiteral,
  }).strict();

export const McpSelectorOnlyCompanyKeyTestDoubleBoundarySchema =
  BaseTestDoubleContractSchema.extend({
    contractKind: z.literal("McpSelectorOnlyCompanyKeyTestDoubleBoundary"),
    authenticatedBindingRequiredForAuthority: trueLiteral,
    clientCompanyKeyAuthorityAllowed: falseLiteral,
    clientCompanyKeySelectorOnly: trueLiteral,
  }).strict();

export const McpNoTokenPassthroughTestDoubleBoundarySchema =
  BaseTestDoubleContractSchema.extend({
    contractKind: z.literal("McpNoTokenPassthroughTestDoubleBoundary"),
    downstreamTokenTransitAllowed: falseLiteral,
    resultEnvelopeMayCarryToken: falseLiteral,
    tokenPassthroughForbidden: trueLiteral,
  }).strict();

export const McpNoTokenLeakageTestDoubleBoundarySchema =
  BaseTestDoubleContractSchema.extend({
    contractKind: z.literal("McpNoTokenLeakageTestDoubleBoundary"),
    leakageSurfaces: z.array(
      z.enum(MCP_TOKEN_VALIDATION_TEST_DOUBLE_LEAKAGE_SURFACES),
    ),
    noBearerTokenMaterialExamples: trueLiteral,
    noJwtLikeExamples: trueLiteral,
    noRealTokenExamples: trueLiteral,
  }).strict();

export const McpNoRuntimeConsumptionBoundarySchema =
  BaseTestDoubleContractSchema.extend({
    contractKind: z.literal("McpNoRuntimeConsumptionBoundary"),
    noAuthMiddlewareImplementation: trueLiteral,
    noInvalidTokenChallengeRuntime: trueLiteral,
    noMcpRouteBehaviorChange: trueLiteral,
    noMissingTokenChallengeBehaviorChange: trueLiteral,
    noProtectedResourceMetadataRouteBehaviorChange: trueLiteral,
    noRouteConsumesTestDoubles: trueLiteral,
    noTestDoubleRuntimeImplemented: trueLiteral,
    noTokenParsingRuntime: trueLiteral,
    noTokenValidationRuntime: trueLiteral,
  }).strict();

export const McpTokenValidationTestDoubleProofSchema = z
  .object({
    schemaVersion: z.literal(MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCHEMA_VERSION),
    localProofOnly: trueLiteral,
    tokenValidationTestDoubleContractsVerified: trueLiteral,
    syntheticValidationScenarioBoundaryVerified: trueLiteral,
    syntheticNonTokenInputBoundaryVerified: trueLiteral,
    noRealTokenExampleBoundaryVerified: trueLiteral,
    noJwtLikeExampleBoundaryVerified: trueLiteral,
    acceptedValidationResultTestDoubleBoundaryVerified: trueLiteral,
    rejectedValidationResultTestDoubleBoundaryVerified: trueLiteral,
    issuerScenarioTestDoubleBoundaryVerified: trueLiteral,
    audienceResourceScenarioTestDoubleBoundaryVerified: trueLiteral,
    scopeScenarioTestDoubleBoundaryVerified: trueLiteral,
    temporalScenarioTestDoubleBoundaryVerified: trueLiteral,
    revocationReplayScenarioTestDoubleBoundaryVerified: trueLiteral,
    subjectOrgCompanyScenarioTestDoubleBoundaryVerified: trueLiteral,
    failureTaxonomyTestDoubleBoundaryVerified: trueLiteral,
    selectorOnlyCompanyKeyTestDoubleBoundaryVerified: trueLiteral,
    noTokenPassthroughTestDoubleBoundaryVerified: trueLiteral,
    noTokenLeakageTestDoubleBoundaryVerified: trueLiteral,
    noRuntimeConsumptionBoundaryVerified: trueLiteral,
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
    tokenValidationTestDoubleRepositoryInventoryVerified: trueLiteral,
    noTokenValidationTestDoubleRuntimeRepositoryInventoryVerified: trueLiteral,
    noTokenParsingRuntimeRepositoryInventoryVerified: trueLiteral,
    noTokenValidationRuntimeRepositoryInventoryVerified: trueLiteral,
    noJwtDecodingRuntimeRepositoryInventoryVerified: trueLiteral,
    noTokenIntrospectionRuntimeRepositoryInventoryVerified: trueLiteral,
    noInvalidTokenChallengeRuntimeRepositoryInventoryVerified: trueLiteral,
    noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified:
      trueLiteral,
    noRealTokenExampleRepositoryInventoryVerified: trueLiteral,
    noJwtLikeExampleRepositoryInventoryVerified: trueLiteral,
    noBearerTokenMaterialRepositoryInventoryVerified: trueLiteral,
    noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified: trueLiteral,
    noOpenAiApiSourceScanVerified: trueLiteral,
    fp0133PostmergeProofDurabilityVerified: trueLiteral,
    fp0133BoundaryVerified: trueLiteral,
    fp0134Absent: trueLiteral,
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified: trueLiteral,
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
