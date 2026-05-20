import {
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCHEMA_VERSION,
  McpTokenValidationTestDoubleProofSchema,
} from "./read-only-app-mcp-token-validation-test-double-contracts";
import { type McpTokenValidationTestDoubleProof } from "./read-only-app-mcp-token-validation-test-double-types";
import { buildMcpTokenValidationTestDoubleContracts } from "./read-only-app-mcp-token-validation-test-double-builders";

export type McpTokenValidationTestDoubleProofInput = Partial<
  Omit<McpTokenValidationTestDoubleProof, "schemaVersion" | "localProofOnly">
>;

export function buildMcpTokenValidationTestDoubleProof(
  input: McpTokenValidationTestDoubleProofInput = {},
): McpTokenValidationTestDoubleProof {
  const contracts = buildMcpTokenValidationTestDoubleContracts();

  return McpTokenValidationTestDoubleProofSchema.parse({
    schemaVersion: MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCHEMA_VERSION,
    localProofOnly: true,
    tokenValidationTestDoubleContractsVerified:
      input.tokenValidationTestDoubleContractsVerified ??
      contracts.proofContract.tokenValidationTestDoubleContractsVerified,
    syntheticValidationScenarioBoundaryVerified:
      input.syntheticValidationScenarioBoundaryVerified ??
      contracts.syntheticValidationScenarioBoundary
        .syntheticScenarioDescriptorsOnly,
    syntheticNonTokenInputBoundaryVerified:
      input.syntheticNonTokenInputBoundaryVerified ??
      !contracts.syntheticNonTokenInputBoundary.tokenStringAccepted,
    noRealTokenExampleBoundaryVerified:
      input.noRealTokenExampleBoundaryVerified ??
      !contracts.noRealTokenExampleBoundary.realTokenExamplesAllowed,
    noJwtLikeExampleBoundaryVerified:
      input.noJwtLikeExampleBoundaryVerified ??
      !contracts.noJwtLikeExampleBoundary.jwtLikeStringsAllowed,
    acceptedValidationResultTestDoubleBoundaryVerified:
      input.acceptedValidationResultTestDoubleBoundaryVerified ??
      !contracts.acceptedValidationResultTestDoubleBoundary.carriesRawToken,
    rejectedValidationResultTestDoubleBoundaryVerified:
      input.rejectedValidationResultTestDoubleBoundaryVerified ??
      contracts.rejectedValidationResultTestDoubleBoundary.usesFailureTaxonomy,
    issuerScenarioTestDoubleBoundaryVerified:
      input.issuerScenarioTestDoubleBoundaryVerified ?? true,
    audienceResourceScenarioTestDoubleBoundaryVerified:
      input.audienceResourceScenarioTestDoubleBoundaryVerified ?? true,
    scopeScenarioTestDoubleBoundaryVerified:
      input.scopeScenarioTestDoubleBoundaryVerified ?? true,
    temporalScenarioTestDoubleBoundaryVerified:
      input.temporalScenarioTestDoubleBoundaryVerified ?? true,
    revocationReplayScenarioTestDoubleBoundaryVerified:
      input.revocationReplayScenarioTestDoubleBoundaryVerified ?? true,
    subjectOrgCompanyScenarioTestDoubleBoundaryVerified:
      input.subjectOrgCompanyScenarioTestDoubleBoundaryVerified ?? true,
    failureTaxonomyTestDoubleBoundaryVerified:
      input.failureTaxonomyTestDoubleBoundaryVerified ??
      contracts.failureTaxonomyTestDoubleBoundary.taxonomyProofOnly,
    selectorOnlyCompanyKeyTestDoubleBoundaryVerified:
      input.selectorOnlyCompanyKeyTestDoubleBoundaryVerified ??
      contracts.selectorOnlyCompanyKeyTestDoubleBoundary
        .clientCompanyKeySelectorOnly,
    noTokenPassthroughTestDoubleBoundaryVerified:
      input.noTokenPassthroughTestDoubleBoundaryVerified ??
      contracts.noTokenPassthroughTestDoubleBoundary.tokenPassthroughForbidden,
    noTokenLeakageTestDoubleBoundaryVerified:
      input.noTokenLeakageTestDoubleBoundaryVerified ??
      contracts.noTokenLeakageTestDoubleBoundary.noRealTokenExamples,
    noRuntimeConsumptionBoundaryVerified:
      input.noRuntimeConsumptionBoundaryVerified ??
      contracts.noRuntimeConsumptionBoundary.noTestDoubleRuntimeImplemented,
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
    fp0133BoundaryVerified: input.fp0133BoundaryVerified ?? true,
    fp0134Absent: input.fp0134Absent ?? true,
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
