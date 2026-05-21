import {
  MCP_INVALID_TOKEN_CHALLENGE_SCHEMA_VERSION,
  McpInvalidTokenChallengeProofSchema,
} from "./read-only-app-mcp-invalid-token-challenge-contracts";
import { buildMcpInvalidTokenChallengeContracts } from "./read-only-app-mcp-invalid-token-challenge-builders";
import type { McpInvalidTokenChallengeProof } from "./read-only-app-mcp-invalid-token-challenge-types";

export type McpInvalidTokenChallengeProofInput = Partial<
  Omit<McpInvalidTokenChallengeProof, "schemaVersion" | "localProofOnly">
>;

export function buildMcpInvalidTokenChallengeProof(
  input: McpInvalidTokenChallengeProofInput = {},
): McpInvalidTokenChallengeProof {
  const contracts = buildMcpInvalidTokenChallengeContracts();

  return McpInvalidTokenChallengeProofSchema.parse({
    schemaVersion: MCP_INVALID_TOKEN_CHALLENGE_SCHEMA_VERSION,
    localProofOnly: true,
    invalidTokenChallengeContractsVerified:
      input.invalidTokenChallengeContractsVerified ??
      contracts.proofContract.invalidTokenChallengeContractsVerified,
    invalidTokenFailureTaxonomyBoundaryVerified:
      input.invalidTokenFailureTaxonomyBoundaryVerified ??
      contracts.failureTaxonomyBoundary.modeledWithoutTokenMaterial,
    invalidTokenStatusMappingBoundaryVerified:
      input.invalidTokenStatusMappingBoundaryVerified ??
      contracts.statusMappingBoundary.statusMappingContractOnly,
    invalidTokenWwwAuthenticateBoundaryVerified:
      input.invalidTokenWwwAuthenticateBoundaryVerified ??
      !contracts.wwwAuthenticateBoundary.challengeHeaderEmittedNow,
    invalidTokenResourceMetadataAlignmentBoundaryVerified:
      input.invalidTokenResourceMetadataAlignmentBoundaryVerified ??
      contracts.resourceMetadataAlignmentBoundary
        .protectedResourceMetadataRouteContractAligned,
    invalidTokenScopeChallengeBoundaryVerified:
      input.invalidTokenScopeChallengeBoundaryVerified ??
      contracts.scopeChallengeBoundary
        .challengedScopesAreAuthoritativeForRequest,
    invalidTokenJsonRpcRefusalBoundaryVerified:
      input.invalidTokenJsonRpcRefusalBoundaryVerified ??
      contracts.jsonRpcRefusalBoundary
        .httpChallengeHeadersSeparateFromJsonRpcRefusal,
    invalidTokenNoTokenEchoBoundaryVerified:
      input.invalidTokenNoTokenEchoBoundaryVerified ??
      contracts.noTokenEchoBoundary.noTokenValueInAnySurface,
    invalidTokenNoRouteRuntimeBoundaryVerified:
      input.invalidTokenNoRouteRuntimeBoundaryVerified ??
      contracts.noRouteRuntimeBoundary.noInvalidTokenChallengeRuntime,
    invalidTokenTestDoubleNoRouteConsumptionBoundaryVerified:
      input.invalidTokenTestDoubleNoRouteConsumptionBoundaryVerified ??
      contracts.testDoubleNoRouteConsumptionBoundary
        .noRouteConsumesSyntheticTestDoubles,
    invalidTokenMissingTokenPostureBoundaryVerified:
      input.invalidTokenMissingTokenPostureBoundaryVerified ??
      !contracts.missingTokenPostureBoundary
        .missingTokenChallengeBehaviorChanged,
    invalidTokenProtectedMetadataPostureBoundaryVerified:
      input.invalidTokenProtectedMetadataPostureBoundaryVerified ??
      !contracts.protectedMetadataPostureBoundary
        .protectedMetadataRouteBehaviorChanged,
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
    noTokenIntrospectionRuntime: input.noTokenIntrospectionRuntime ?? true,
    noRouteConsumesTestDouble: input.noRouteConsumesTestDouble ?? true,
    noOauthImplementation: input.noOauthImplementation ?? true,
    noTokenSessionStorage: input.noTokenSessionStorage ?? true,
    noAuthMiddlewareImplementation:
      input.noAuthMiddlewareImplementation ?? true,
    noRealTokenExamples: input.noRealTokenExamples ?? true,
    noJwtLikeExamples: input.noJwtLikeExamples ?? true,
    noBearerTokenMaterial: input.noBearerTokenMaterial ?? true,
    noDbQueriesAdded: input.noDbQueriesAdded ?? true,
    noSchemaMigrationsAdded: input.noSchemaMigrationsAdded ?? true,
    noPackageScriptsAdded: input.noPackageScriptsAdded ?? true,
    noOpenAiApiCalls: input.noOpenAiApiCalls ?? true,
    noProviderExternalCalls: input.noProviderExternalCalls ?? true,
    noSourceMutationFinanceWrite: input.noSourceMutationFinanceWrite ?? true,
    fp0136BoundaryVerified: input.fp0136BoundaryVerified ?? true,
    fp0136AbsentOrLocalInvalidTokenChallengeContractsVerified:
      input.fp0136AbsentOrLocalInvalidTokenChallengeContractsVerified ?? true,
    invalidTokenChallengeContractsFoundationVerified:
      input.invalidTokenChallengeContractsFoundationVerified ?? true,
    noMcpRouteBehaviorChangeFromFp0136:
      input.noMcpRouteBehaviorChangeFromFp0136 ?? true,
    noProtectedResourceMetadataRouteBehaviorChangeFromFp0136:
      input.noProtectedResourceMetadataRouteBehaviorChangeFromFp0136 ?? true,
    noMissingTokenChallengeBehaviorChangeFromFp0136:
      input.noMissingTokenChallengeBehaviorChangeFromFp0136 ?? true,
    noInvalidTokenChallengeRuntimeFromFp0136:
      input.noInvalidTokenChallengeRuntimeFromFp0136 ?? true,
    noTokenParsingRuntimeFromFp0136:
      input.noTokenParsingRuntimeFromFp0136 ?? true,
    noTokenValidationRuntimeFromFp0136:
      input.noTokenValidationRuntimeFromFp0136 ?? true,
    noJwtDecodingRuntimeFromFp0136:
      input.noJwtDecodingRuntimeFromFp0136 ?? true,
    noTokenIntrospectionRuntimeFromFp0136:
      input.noTokenIntrospectionRuntimeFromFp0136 ?? true,
    noRouteConsumesTestDoubleFromFp0136:
      input.noRouteConsumesTestDoubleFromFp0136 ?? true,
    noOauthImplementationFromFp0136:
      input.noOauthImplementationFromFp0136 ?? true,
    noTokenSessionStorageFromFp0136:
      input.noTokenSessionStorageFromFp0136 ?? true,
    noAuthMiddlewareImplementationFromFp0136:
      input.noAuthMiddlewareImplementationFromFp0136 ?? true,
    noRealTokenExamplesFromFp0136: input.noRealTokenExamplesFromFp0136 ?? true,
    noJwtLikeExamplesFromFp0136: input.noJwtLikeExamplesFromFp0136 ?? true,
    noBearerTokenMaterialFromFp0136:
      input.noBearerTokenMaterialFromFp0136 ?? true,
    noDbQueriesFromFp0136: input.noDbQueriesFromFp0136 ?? true,
    noSchemaMigrationsFromFp0136: input.noSchemaMigrationsFromFp0136 ?? true,
    noPackageScriptsFromFp0136: input.noPackageScriptsFromFp0136 ?? true,
    noOpenAiApiCallsFromFp0136: input.noOpenAiApiCallsFromFp0136 ?? true,
    noProviderExternalCallsFromFp0136:
      input.noProviderExternalCallsFromFp0136 ?? true,
    noSourceMutationFinanceWriteFromFp0136:
      input.noSourceMutationFinanceWriteFromFp0136 ?? true,
    fp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlanVerified:
      input.fp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlanVerified ??
      true,
    fp0138Absent: input.fp0138Absent ?? true,
    fp0135InvalidTokenChallengeSequencingBoundaryStillVerified:
      input.fp0135InvalidTokenChallengeSequencingBoundaryStillVerified ?? true,
    fp0134SyntheticTestDoubleEvaluatorBoundaryStillVerified:
      input.fp0134SyntheticTestDoubleEvaluatorBoundaryStillVerified ?? true,
    fp0133TokenValidationTestDoubleContractsBoundaryStillVerified:
      input.fp0133TokenValidationTestDoubleContractsBoundaryStillVerified ??
      true,
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified:
      input.fp0132TokenValidationRuntimeContractsBoundaryStillVerified ?? true,
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
