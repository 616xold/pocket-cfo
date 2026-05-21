import { z } from "zod";
import {
  MCP_WWW_AUTHENTICATE_ALLOWED_SCOPE_CHALLENGES,
  MCP_WWW_AUTHENTICATE_CHALLENGE_SCHEME,
  MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE,
  MCP_WWW_AUTHENTICATE_RESOURCE_METADATA_PARAMETER,
} from "./read-only-app-mcp-www-authenticate-contracts";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const MCP_INVALID_TOKEN_CHALLENGE_SCHEMA_VERSION =
  "v2bd.read-only-app-mcp-invalid-token-challenge-contracts.v1";

export const FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH =
  "plans/FP-0136-read-only-chatgpt-app-mcp-invalid-token-challenge-contracts-foundation.md";

export const MCP_INVALID_TOKEN_CHALLENGE_FP0136_PLAN_PREFIX = "FP-0136";
export const MCP_INVALID_TOKEN_CHALLENGE_FP0137_PLAN_PREFIX = "FP-0137";

export const MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY = [
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

export const MCP_INVALID_TOKEN_CHALLENGE_FUTURE_401_FAILURES = [
  "malformed",
  "expired",
  "wrong-issuer",
  "wrong-audience",
  "wrong-resource",
  "wrong-org",
  "wrong-company",
  "revoked",
  "replayed",
  "token-passthrough-attempt",
] as const;

export const MCP_INVALID_TOKEN_CHALLENGE_FUTURE_403_FAILURES = [
  "wrong-scope",
] as const;

export const MCP_INVALID_TOKEN_CHALLENGE_FUTURE_400_FAILURES = [
  "malformed-authorization-request-shape",
] as const;

export const MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES = [
  "logs",
  "proof_output",
  "docs_examples",
  "headers",
  "route_bodies",
  "metadata_examples",
  "evidence",
  "structured_content",
  "json_rpc_refusal_envelopes",
  "app_metadata",
] as const;

export const McpInvalidTokenFailureModeSchema = z.enum(
  MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY,
);

export const McpInvalidTokenMalformedRequestShapeSchema = z.enum(
  MCP_INVALID_TOKEN_CHALLENGE_FUTURE_400_FAILURES,
);

export const McpInvalidTokenChallengeContractKindSchema = z.enum([
  "McpInvalidTokenChallengeProofContract",
  "McpInvalidTokenFailureTaxonomyBoundary",
  "McpInvalidTokenStatusMappingBoundary",
  "McpInvalidTokenWwwAuthenticateBoundary",
  "McpInvalidTokenResourceMetadataAlignmentBoundary",
  "McpInvalidTokenScopeChallengeBoundary",
  "McpInvalidTokenJsonRpcRefusalBoundary",
  "McpInvalidTokenNoTokenEchoBoundary",
  "McpInvalidTokenNoRouteRuntimeBoundary",
  "McpInvalidTokenTestDoubleNoRouteConsumptionBoundary",
  "McpInvalidTokenMissingTokenPostureBoundary",
  "McpInvalidTokenProtectedMetadataPostureBoundary",
]);

const BaseInvalidTokenChallengeBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_INVALID_TOKEN_CHALLENGE_SCHEMA_VERSION),
    contractKind: McpInvalidTokenChallengeContractKindSchema,
    contractOnly: trueLiteral,
    implementationAdded: falseLiteral,
    localProofOnly: trueLiteral,
    readOnly: trueLiteral,
  })
  .strict();

export const McpInvalidTokenChallengeProofContractSchema =
  BaseInvalidTokenChallengeBoundarySchema.extend({
    contractKind: z.literal("McpInvalidTokenChallengeProofContract"),
    invalidTokenChallengeContractsVerified: trueLiteral,
    noChallengeHeaderEmission: trueLiteral,
    noRuntimeImplementation: trueLiteral,
  }).strict();

export const McpInvalidTokenFailureTaxonomyBoundarySchema =
  BaseInvalidTokenChallengeBoundarySchema.extend({
    contractKind: z.literal("McpInvalidTokenFailureTaxonomyBoundary"),
    failureModes: z.tuple([
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY[0]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY[1]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY[2]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY[3]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY[4]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY[5]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY[6]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY[7]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY[8]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY[9]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY[10]),
    ]),
    modeledWithoutTokenMaterial: trueLiteral,
    routeRuntimeImplemented: falseLiteral,
    taxonomyProofOnly: trueLiteral,
  }).strict();

export const McpInvalidTokenStatusMappingBoundarySchema =
  BaseInvalidTokenChallengeBoundarySchema.extend({
    contractKind: z.literal("McpInvalidTokenStatusMappingBoundary"),
    future400StatusFailures: z.tuple([
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FUTURE_400_FAILURES[0]),
    ]),
    future401StatusFailures: z.array(McpInvalidTokenFailureModeSchema).min(1),
    future403StatusFailures: z.tuple([
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_FUTURE_403_FAILURES[0]),
    ]),
    statusEmittedNow: falseLiteral,
    statusMappingContractOnly: trueLiteral,
  }).strict();

export const McpInvalidTokenWwwAuthenticateBoundarySchema =
  BaseInvalidTokenChallengeBoundarySchema.extend({
    contractKind: z.literal("McpInvalidTokenWwwAuthenticateBoundary"),
    challengeHeaderEmittedNow: falseLiteral,
    challengeParametersCarryTokenMaterial: falseLiteral,
    futureBearerScheme: z.literal(MCP_WWW_AUTHENTICATE_CHALLENGE_SCHEME),
    futureErrorParametersAlignWithRfc6750: trueLiteral,
    futureResourceMetadataParameter: z.literal(
      MCP_WWW_AUTHENTICATE_RESOURCE_METADATA_PARAMETER,
    ),
  }).strict();

export const McpInvalidTokenResourceMetadataAlignmentBoundarySchema =
  BaseInvalidTokenChallengeBoundarySchema.extend({
    contractKind: z.literal("McpInvalidTokenResourceMetadataAlignmentBoundary"),
    protectedResourceMetadataRouteBehaviorChanged: falseLiteral,
    protectedResourceMetadataRouteContractAligned: trueLiteral,
    resourceMetadataReference: z.literal(
      MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE,
    ),
    resourceMetadataRuntimeEmittedNow: falseLiteral,
  }).strict();

export const McpInvalidTokenScopeChallengeBoundarySchema =
  BaseInvalidTokenChallengeBoundarySchema.extend({
    challengedScopesAreAuthoritativeForRequest: trueLiteral,
    challengedScopesReadOnlyLeastPrivilege: trueLiteral,
    contractKind: z.literal("McpInvalidTokenScopeChallengeBoundary"),
    futureAllowedReadOnlyScopes: z.tuple([
      z.literal(MCP_WWW_AUTHENTICATE_ALLOWED_SCOPE_CHALLENGES[0]),
      z.literal(MCP_WWW_AUTHENTICATE_ALLOWED_SCOPE_CHALLENGES[1]),
    ]),
    scopeChallengeRuntimeImplemented: falseLiteral,
  }).strict();

export const McpInvalidTokenJsonRpcRefusalBoundarySchema =
  BaseInvalidTokenChallengeBoundarySchema.extend({
    contractKind: z.literal("McpInvalidTokenJsonRpcRefusalBoundary"),
    httpChallengeHeadersSeparateFromJsonRpcRefusal: trueLiteral,
    jsonRpcEnvelopeCarriesChallengeHeader: falseLiteral,
    jsonRpcRefusalRuntimeChanged: falseLiteral,
  }).strict();

export const McpInvalidTokenNoTokenEchoBoundarySchema =
  BaseInvalidTokenChallengeBoundarySchema.extend({
    contractKind: z.literal("McpInvalidTokenNoTokenEchoBoundary"),
    leakageSurfaces: z.tuple([
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES[0]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES[1]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES[2]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES[3]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES[4]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES[5]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES[6]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES[7]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES[8]),
      z.literal(MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES[9]),
    ]),
    noBearerTokenMaterial: trueLiteral,
    noJwtLikeExamples: trueLiteral,
    noRealTokenExamples: trueLiteral,
    noTokenValueInAnySurface: trueLiteral,
  }).strict();

export const McpInvalidTokenNoRouteRuntimeBoundarySchema =
  BaseInvalidTokenChallengeBoundarySchema.extend({
    contractKind: z.literal("McpInvalidTokenNoRouteRuntimeBoundary"),
    noAuthMiddlewareImplementation: trueLiteral,
    noInvalidTokenChallengeRuntime: trueLiteral,
    noJwtDecodingRuntime: trueLiteral,
    noMcpRouteBehaviorChange: trueLiteral,
    noOauthImplementation: trueLiteral,
    noTokenIntrospectionRuntime: trueLiteral,
    noTokenParsingRuntime: trueLiteral,
    noTokenSessionStorage: trueLiteral,
    noTokenValidationRuntime: trueLiteral,
  }).strict();

export const McpInvalidTokenTestDoubleNoRouteConsumptionBoundarySchema =
  BaseInvalidTokenChallengeBoundarySchema.extend({
    contractKind: z.literal(
      "McpInvalidTokenTestDoubleNoRouteConsumptionBoundary",
    ),
    noRouteConsumesSyntheticTestDoubles: trueLiteral,
    routesMayImportSyntheticEvaluator: falseLiteral,
    syntheticEvaluatorProofOnly: trueLiteral,
  }).strict();

export const McpInvalidTokenMissingTokenPostureBoundarySchema =
  BaseInvalidTokenChallengeBoundarySchema.extend({
    contractKind: z.literal("McpInvalidTokenMissingTokenPostureBoundary"),
    fp0130StillOnlyMissingTokenChallengeBehavior: trueLiteral,
    missingTokenChallengeBehaviorChanged: falseLiteral,
  }).strict();

export const McpInvalidTokenProtectedMetadataPostureBoundarySchema =
  BaseInvalidTokenChallengeBoundarySchema.extend({
    contractKind: z.literal("McpInvalidTokenProtectedMetadataPostureBoundary"),
    protectedMetadataRouteBehaviorChanged: falseLiteral,
    protectedMetadataRouteContractUnchanged: trueLiteral,
  }).strict();

export const McpInvalidTokenChallengeProofSchema = z
  .object({
    schemaVersion: z.literal(MCP_INVALID_TOKEN_CHALLENGE_SCHEMA_VERSION),
    localProofOnly: trueLiteral,
    invalidTokenChallengeContractsVerified: trueLiteral,
    invalidTokenFailureTaxonomyBoundaryVerified: trueLiteral,
    invalidTokenStatusMappingBoundaryVerified: trueLiteral,
    invalidTokenWwwAuthenticateBoundaryVerified: trueLiteral,
    invalidTokenResourceMetadataAlignmentBoundaryVerified: trueLiteral,
    invalidTokenScopeChallengeBoundaryVerified: trueLiteral,
    invalidTokenJsonRpcRefusalBoundaryVerified: trueLiteral,
    invalidTokenNoTokenEchoBoundaryVerified: trueLiteral,
    invalidTokenNoRouteRuntimeBoundaryVerified: trueLiteral,
    invalidTokenTestDoubleNoRouteConsumptionBoundaryVerified: trueLiteral,
    invalidTokenMissingTokenPostureBoundaryVerified: trueLiteral,
    invalidTokenProtectedMetadataPostureBoundaryVerified: trueLiteral,
    noMcpRouteBehaviorChange: trueLiteral,
    noProtectedResourceMetadataRouteBehaviorChange: trueLiteral,
    noMissingTokenChallengeBehaviorChange: trueLiteral,
    noInvalidTokenChallengeRuntime: trueLiteral,
    noTokenParsingRuntime: trueLiteral,
    noTokenValidationRuntime: trueLiteral,
    noJwtDecodingRuntime: trueLiteral,
    noTokenIntrospectionRuntime: trueLiteral,
    noRouteConsumesTestDouble: trueLiteral,
    noOauthImplementation: trueLiteral,
    noTokenSessionStorage: trueLiteral,
    noAuthMiddlewareImplementation: trueLiteral,
    noRealTokenExamples: trueLiteral,
    noJwtLikeExamples: trueLiteral,
    noBearerTokenMaterial: trueLiteral,
    noDbQueriesAdded: trueLiteral,
    noSchemaMigrationsAdded: trueLiteral,
    noPackageScriptsAdded: trueLiteral,
    noOpenAiApiCalls: trueLiteral,
    noProviderExternalCalls: trueLiteral,
    noSourceMutationFinanceWrite: trueLiteral,
    fp0136BoundaryVerified: trueLiteral,
    fp0136AbsentOrLocalInvalidTokenChallengeContractsVerified: trueLiteral,
    invalidTokenChallengeContractsFoundationVerified: trueLiteral,
    noMcpRouteBehaviorChangeFromFp0136: trueLiteral,
    noProtectedResourceMetadataRouteBehaviorChangeFromFp0136: trueLiteral,
    noMissingTokenChallengeBehaviorChangeFromFp0136: trueLiteral,
    noInvalidTokenChallengeRuntimeFromFp0136: trueLiteral,
    noTokenParsingRuntimeFromFp0136: trueLiteral,
    noTokenValidationRuntimeFromFp0136: trueLiteral,
    noJwtDecodingRuntimeFromFp0136: trueLiteral,
    noTokenIntrospectionRuntimeFromFp0136: trueLiteral,
    noRouteConsumesTestDoubleFromFp0136: trueLiteral,
    noOauthImplementationFromFp0136: trueLiteral,
    noTokenSessionStorageFromFp0136: trueLiteral,
    noAuthMiddlewareImplementationFromFp0136: trueLiteral,
    noRealTokenExamplesFromFp0136: trueLiteral,
    noJwtLikeExamplesFromFp0136: trueLiteral,
    noBearerTokenMaterialFromFp0136: trueLiteral,
    noDbQueriesFromFp0136: trueLiteral,
    noSchemaMigrationsFromFp0136: trueLiteral,
    noPackageScriptsFromFp0136: trueLiteral,
    noOpenAiApiCallsFromFp0136: trueLiteral,
    noProviderExternalCallsFromFp0136: trueLiteral,
    noSourceMutationFinanceWriteFromFp0136: trueLiteral,
    fp0137Absent: trueLiteral,
    fp0135InvalidTokenChallengeSequencingBoundaryStillVerified: trueLiteral,
    fp0134SyntheticTestDoubleEvaluatorBoundaryStillVerified: trueLiteral,
    fp0133TokenValidationTestDoubleContractsBoundaryStillVerified: trueLiteral,
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
