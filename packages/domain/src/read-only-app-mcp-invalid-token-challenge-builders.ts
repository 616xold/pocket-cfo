import {
  MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY,
  MCP_INVALID_TOKEN_CHALLENGE_FUTURE_400_FAILURES,
  MCP_INVALID_TOKEN_CHALLENGE_FUTURE_401_FAILURES,
  MCP_INVALID_TOKEN_CHALLENGE_FUTURE_403_FAILURES,
  MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES,
  MCP_INVALID_TOKEN_CHALLENGE_SCHEMA_VERSION,
  McpInvalidTokenChallengeProofContractSchema,
  McpInvalidTokenFailureTaxonomyBoundarySchema,
  McpInvalidTokenJsonRpcRefusalBoundarySchema,
  McpInvalidTokenMissingTokenPostureBoundarySchema,
  McpInvalidTokenNoRouteRuntimeBoundarySchema,
  McpInvalidTokenNoTokenEchoBoundarySchema,
  McpInvalidTokenProtectedMetadataPostureBoundarySchema,
  McpInvalidTokenResourceMetadataAlignmentBoundarySchema,
  McpInvalidTokenScopeChallengeBoundarySchema,
  McpInvalidTokenStatusMappingBoundarySchema,
  McpInvalidTokenTestDoubleNoRouteConsumptionBoundarySchema,
  McpInvalidTokenWwwAuthenticateBoundarySchema,
} from "./read-only-app-mcp-invalid-token-challenge-contracts";
import {
  MCP_WWW_AUTHENTICATE_ALLOWED_SCOPE_CHALLENGES,
  MCP_WWW_AUTHENTICATE_CHALLENGE_SCHEME,
  MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE,
  MCP_WWW_AUTHENTICATE_RESOURCE_METADATA_PARAMETER,
} from "./read-only-app-mcp-www-authenticate-contracts";

const baseContract = {
  contractOnly: true,
  implementationAdded: false,
  localProofOnly: true,
  readOnly: true,
  schemaVersion: MCP_INVALID_TOKEN_CHALLENGE_SCHEMA_VERSION,
} as const;

export function buildMcpInvalidTokenChallengeContracts() {
  return {
    proofContract: McpInvalidTokenChallengeProofContractSchema.parse({
      ...baseContract,
      contractKind: "McpInvalidTokenChallengeProofContract",
      invalidTokenChallengeContractsVerified: true,
      noChallengeHeaderEmission: true,
      noRuntimeImplementation: true,
    }),
    failureTaxonomyBoundary: McpInvalidTokenFailureTaxonomyBoundarySchema.parse(
      {
        ...baseContract,
        contractKind: "McpInvalidTokenFailureTaxonomyBoundary",
        failureModes: [...MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY],
        modeledWithoutTokenMaterial: true,
        routeRuntimeImplemented: false,
        taxonomyProofOnly: true,
      },
    ),
    statusMappingBoundary: McpInvalidTokenStatusMappingBoundarySchema.parse({
      ...baseContract,
      contractKind: "McpInvalidTokenStatusMappingBoundary",
      future400StatusFailures: [
        ...MCP_INVALID_TOKEN_CHALLENGE_FUTURE_400_FAILURES,
      ],
      future401StatusFailures: [
        ...MCP_INVALID_TOKEN_CHALLENGE_FUTURE_401_FAILURES,
      ],
      future403StatusFailures: [
        ...MCP_INVALID_TOKEN_CHALLENGE_FUTURE_403_FAILURES,
      ],
      statusEmittedNow: false,
      statusMappingContractOnly: true,
    }),
    wwwAuthenticateBoundary: McpInvalidTokenWwwAuthenticateBoundarySchema.parse(
      {
        ...baseContract,
        challengeHeaderEmittedNow: false,
        challengeParametersCarryTokenMaterial: false,
        contractKind: "McpInvalidTokenWwwAuthenticateBoundary",
        futureBearerScheme: MCP_WWW_AUTHENTICATE_CHALLENGE_SCHEME,
        futureErrorParametersAlignWithRfc6750: true,
        futureResourceMetadataParameter:
          MCP_WWW_AUTHENTICATE_RESOURCE_METADATA_PARAMETER,
      },
    ),
    resourceMetadataAlignmentBoundary:
      McpInvalidTokenResourceMetadataAlignmentBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpInvalidTokenResourceMetadataAlignmentBoundary",
        protectedResourceMetadataRouteBehaviorChanged: false,
        protectedResourceMetadataRouteContractAligned: true,
        resourceMetadataReference:
          MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE,
        resourceMetadataRuntimeEmittedNow: false,
      }),
    scopeChallengeBoundary: McpInvalidTokenScopeChallengeBoundarySchema.parse({
      ...baseContract,
      challengedScopesAreAuthoritativeForRequest: true,
      challengedScopesReadOnlyLeastPrivilege: true,
      contractKind: "McpInvalidTokenScopeChallengeBoundary",
      futureAllowedReadOnlyScopes: [
        ...MCP_WWW_AUTHENTICATE_ALLOWED_SCOPE_CHALLENGES,
      ],
      scopeChallengeRuntimeImplemented: false,
    }),
    jsonRpcRefusalBoundary: McpInvalidTokenJsonRpcRefusalBoundarySchema.parse({
      ...baseContract,
      contractKind: "McpInvalidTokenJsonRpcRefusalBoundary",
      httpChallengeHeadersSeparateFromJsonRpcRefusal: true,
      jsonRpcEnvelopeCarriesChallengeHeader: false,
      jsonRpcRefusalRuntimeChanged: false,
    }),
    noTokenEchoBoundary: McpInvalidTokenNoTokenEchoBoundarySchema.parse({
      ...baseContract,
      contractKind: "McpInvalidTokenNoTokenEchoBoundary",
      leakageSurfaces: [...MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES],
      noBearerTokenMaterial: true,
      noJwtLikeExamples: true,
      noRealTokenExamples: true,
      noTokenValueInAnySurface: true,
    }),
    noRouteRuntimeBoundary: McpInvalidTokenNoRouteRuntimeBoundarySchema.parse({
      ...baseContract,
      contractKind: "McpInvalidTokenNoRouteRuntimeBoundary",
      noAuthMiddlewareImplementation: true,
      noInvalidTokenChallengeRuntime: true,
      noJwtDecodingRuntime: true,
      noMcpRouteBehaviorChange: true,
      noOauthImplementation: true,
      noTokenIntrospectionRuntime: true,
      noTokenParsingRuntime: true,
      noTokenSessionStorage: true,
      noTokenValidationRuntime: true,
    }),
    testDoubleNoRouteConsumptionBoundary:
      McpInvalidTokenTestDoubleNoRouteConsumptionBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpInvalidTokenTestDoubleNoRouteConsumptionBoundary",
        noRouteConsumesSyntheticTestDoubles: true,
        routesMayImportSyntheticEvaluator: false,
        syntheticEvaluatorProofOnly: true,
      }),
    missingTokenPostureBoundary:
      McpInvalidTokenMissingTokenPostureBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpInvalidTokenMissingTokenPostureBoundary",
        fp0130StillOnlyMissingTokenChallengeBehavior: true,
        missingTokenChallengeBehaviorChanged: false,
      }),
    protectedMetadataPostureBoundary:
      McpInvalidTokenProtectedMetadataPostureBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpInvalidTokenProtectedMetadataPostureBoundary",
        protectedMetadataRouteBehaviorChanged: false,
        protectedMetadataRouteContractUnchanged: true,
      }),
  };
}

export function verifyMcpInvalidTokenChallengeContractBoundaries() {
  const contracts = buildMcpInvalidTokenChallengeContracts();
  return (
    contracts.proofContract.invalidTokenChallengeContractsVerified &&
    contracts.failureTaxonomyBoundary.modeledWithoutTokenMaterial &&
    contracts.statusMappingBoundary.statusMappingContractOnly &&
    !contracts.statusMappingBoundary.statusEmittedNow &&
    !contracts.wwwAuthenticateBoundary.challengeHeaderEmittedNow &&
    contracts.resourceMetadataAlignmentBoundary
      .protectedResourceMetadataRouteContractAligned &&
    contracts.scopeChallengeBoundary
      .challengedScopesAreAuthoritativeForRequest &&
    contracts.jsonRpcRefusalBoundary
      .httpChallengeHeadersSeparateFromJsonRpcRefusal &&
    contracts.noTokenEchoBoundary.noTokenValueInAnySurface &&
    contracts.noRouteRuntimeBoundary.noMcpRouteBehaviorChange &&
    contracts.testDoubleNoRouteConsumptionBoundary
      .noRouteConsumesSyntheticTestDoubles &&
    !contracts.missingTokenPostureBoundary
      .missingTokenChallengeBehaviorChanged &&
    !contracts.protectedMetadataPostureBoundary
      .protectedMetadataRouteBehaviorChanged
  );
}
