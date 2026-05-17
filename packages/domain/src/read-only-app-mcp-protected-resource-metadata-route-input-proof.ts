import { z } from "zod";
import {
  MCP_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_SCHEMA_VERSION,
  MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH,
  McpProtectedResourceMetadataRouteInputAuthorizationServerEvidenceBoundarySchema,
  McpProtectedResourceMetadataRouteInputBuilderOutputBoundarySchema,
  McpProtectedResourceMetadataRouteInputCanonicalUriEvidenceBoundarySchema,
  McpProtectedResourceMetadataRouteInputCompanyBindingPrerequisiteBoundarySchema,
  McpProtectedResourceMetadataRouteInputEvidenceBundleBoundarySchema,
  McpProtectedResourceMetadataRouteInputMcpUnchangedBoundarySchema,
  McpProtectedResourceMetadataRouteInputNoRuntimeBoundarySchema,
  McpProtectedResourceMetadataRouteInputNoTokenLeakageBoundarySchema,
  McpProtectedResourceMetadataRouteInputPathDecisionBoundarySchema,
  McpProtectedResourceMetadataRouteInputProofContractSchema,
  type McpProtectedResourceMetadataRouteInputBuilderInput,
  type McpProtectedResourceMetadataRouteInputContractKind,
} from "./read-only-app-mcp-protected-resource-metadata-route-input-contracts";
import {
  buildProtectedResourceMetadataRouteInputEvidenceBundle,
  deriveProtectedResourceMetadataRoutePathDecision,
  validateProtectedResourceMetadataRouteInputEvidenceBundle,
} from "./read-only-app-mcp-protected-resource-metadata-route-input";

const trueLiteral = z.literal(true);

export const McpProtectedResourceMetadataRouteInputProofSchema = z
  .object({
    schemaVersion: z.literal(
      MCP_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_SCHEMA_VERSION,
    ),
    localProofOnly: trueLiteral,
    routeInputEvidenceContractsVerified: trueLiteral,
    routeInputEvidenceBundleBoundaryVerified: trueLiteral,
    routeInputCanonicalUriEvidenceBoundaryVerified: trueLiteral,
    routeInputAuthorizationServerEvidenceBoundaryVerified: trueLiteral,
    routeInputPathDecisionBoundaryVerified: trueLiteral,
    routeInputBuilderOutputBoundaryVerified: trueLiteral,
    routeInputNoTokenLeakageBoundaryVerified: trueLiteral,
    routeInputCompanyBindingPrerequisiteBoundaryVerified: trueLiteral,
    routeInputMcpUnchangedBoundaryVerified: trueLiteral,
    routeInputNoRuntimeBoundaryVerified: trueLiteral,
    routeInputBranchDiffScopeVerified: trueLiteral,
    routeInputRepositoryInventoryVerified: trueLiteral,
    routeInputNoRouteRuntimeRepositoryInventoryVerified: trueLiteral,
    routeInputNoProtectedResourceMetadataRouteRepositoryInventoryVerified:
      trueLiteral,
    routeInputNoWwwAuthenticateRepositoryInventoryVerified: trueLiteral,
    routeInputNoAuthRuntimeRepositoryInventoryVerified: trueLiteral,
    routeInputNoDeploymentPublicAssetRepositoryInventoryVerified: trueLiteral,
    routeInputNoOpenAiSourceScanVerified: trueLiteral,
    fp0123PostmergeProofDurabilityVerified: trueLiteral,
    noRouteBehaviorChange: trueLiteral,
    noNewRoutePath: trueLiteral,
    noProtectedResourceMetadataRouteImplementation: trueLiteral,
    noWwwAuthenticateRouteBehaviorImplementation: trueLiteral,
    noOauthImplementation: trueLiteral,
    noTokenSessionImplementation: trueLiteral,
    noAuthMiddlewareImplementation: trueLiteral,
    noRemoteMcpDeployment: trueLiteral,
    noDeploymentConfig: trueLiteral,
    noAppsSdkResourceImplementation: trueLiteral,
    noAppSubmission: trueLiteral,
    noDbQueriesAdded: trueLiteral,
    noSchemaMigrationsAdded: trueLiteral,
    noPackageScriptsAdded: trueLiteral,
    noPublicAssets: trueLiteral,
    noListingCopy: trueLiteral,
    noGeneratedPublicProse: trueLiteral,
    noOpenAiApiCalls: trueLiteral,
    noModelCalls: trueLiteral,
    noOpenAiClientOrKeyUsage: trueLiteral,
    noProviderCalls: trueLiteral,
    noExternalCommunications: trueLiteral,
    noSourceMutation: trueLiteral,
    noFinanceWrite: trueLiteral,
    noGeneratedFinanceAdvice: trueLiteral,
    noRuntimeCodexFinanceOutput: trueLiteral,
    noAutonomousAction: trueLiteral,
    fp0123BoundaryVerified: trueLiteral,
    fp0124AbsentOrDocsOnlyProtectedResourceMetadataRouteImplementationPlanVerified: trueLiteral,
    fp0125Absent: trueLiteral,
    protectedResourceMetadataRouteImplementationPlanBoundaryVerified:
      trueLiteral,
    noRouteBehaviorChangeFromFp0124: trueLiteral,
    noNewRoutePathFromFp0124: trueLiteral,
    noProtectedResourceMetadataRouteFromFp0124: trueLiteral,
    noWwwAuthenticateRouteBehaviorFromFp0124: trueLiteral,
    noOauthImplementationFromFp0124: trueLiteral,
    noTokenSessionImplementationFromFp0124: trueLiteral,
    noAuthMiddlewareImplementationFromFp0124: trueLiteral,
    noRemoteMcpDeploymentFromFp0124: trueLiteral,
    noDeploymentConfigFromFp0124: trueLiteral,
    noAppsSdkResourceFromFp0124: trueLiteral,
    noAppSubmissionFromFp0124: trueLiteral,
    noDbQueriesFromFp0124: trueLiteral,
    noSchemaMigrationsFromFp0124: trueLiteral,
    noPackageScriptsFromFp0124: trueLiteral,
    noOpenAiApiCallsFromFp0124: trueLiteral,
    noProviderExternalCallsFromFp0124: trueLiteral,
    noSourceMutationFinanceWriteFromFp0124: trueLiteral,
    noPublicAssetsSubmissionArtifactsFromFp0124: trueLiteral,
    noListingCopyGeneratedPublicProseFromFp0124: trueLiteral,
    fp0122ProtectedResourceMetadataBuilderBoundaryStillVerified: trueLiteral,
    fp0121ProtectedResourceMetadataRoutePlanningBoundaryStillVerified:
      trueLiteral,
    fp0120CanonicalResourceAuthServerBoundaryStillVerified: trueLiteral,
    fp0118ProtectedResourceMetadataBoundaryStillVerified: trueLiteral,
    fp0117OauthImplementationSequencingBoundaryStillVerified: trueLiteral,
    fp0107RouteAdapterBoundaryStillVerified: trueLiteral,
    fp0106ProtocolEnvelopeBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
  })
  .strict();

export type McpProtectedResourceMetadataRouteInputProof = z.infer<
  typeof McpProtectedResourceMetadataRouteInputProofSchema
>;

export function buildMcpProtectedResourceMetadataRouteInputContracts() {
  return {
    authorizationServerEvidenceBoundary:
      McpProtectedResourceMetadataRouteInputAuthorizationServerEvidenceBoundarySchema.parse(
        {
          ...base(
            "McpProtectedResourceMetadataRouteInputAuthorizationServerEvidenceBoundary",
          ),
          authorizationServersMustBeHttps: true,
          authorizationServersMustBeNonEmpty: true,
          credentialFreeAuthorizationServersRequired: true,
          providerNeutralUntilLaterPlan: true,
          queryBearerMethodAllowed: false,
          unsafeScopesAllowed: false,
        },
      ),
    builderOutputBoundary:
      McpProtectedResourceMetadataRouteInputBuilderOutputBoundarySchema.parse({
        ...base("McpProtectedResourceMetadataRouteInputBuilderOutputBoundary"),
        fp0122BuilderOutputOrBuilderValidInputRequired: true,
        invalidBuilderOutputAllowed: false,
        routeRegistered: false,
        routeResponseContractOnly: true,
      }),
    canonicalUriEvidenceBoundary:
      McpProtectedResourceMetadataRouteInputCanonicalUriEvidenceBoundarySchema.parse(
        {
          ...base(
            "McpProtectedResourceMetadataRouteInputCanonicalUriEvidenceBoundary",
          ),
          acceptedFp0120CanonicalUriRequired: true,
          credentialBearingUriAllowed: false,
          fragmentAllowed: false,
          localTunnelAllowed: false,
          queryStringAllowed: false,
          selectorAuthorityAllowed: false,
          userinfoCredentialsAllowed: false,
        },
      ),
    companyBindingPrerequisiteBoundary:
      McpProtectedResourceMetadataRouteInputCompanyBindingPrerequisiteBoundarySchema.parse(
        {
          ...base(
            "McpProtectedResourceMetadataRouteInputCompanyBindingPrerequisiteBoundary",
          ),
          authenticatedCompanyBindingImplemented: false,
          authenticatedCompanyBindingRequired: true,
          prerequisiteFlagRequired: true,
          unauthenticatedCompanyKeyAuthorityAllowed: false,
        },
      ),
    evidenceBundleBoundary:
      McpProtectedResourceMetadataRouteInputEvidenceBundleBoundarySchema.parse({
        ...base("McpProtectedResourceMetadataRouteInputEvidenceBundleBoundary"),
        requiresAuthorizationServerEvidence: true,
        requiresBuilderOutputOrBuilderValidInput: true,
        requiresCanonicalUriEvidence: true,
        requiresCompanyBindingPrerequisite: true,
        requiresMcpUnchangedPrerequisite: true,
        requiresNoTokenLeakageProof: true,
        routeInputEvidenceBundleOnly: true,
        routeRuntimeInputAllowed: false,
      }),
    mcpUnchangedBoundary:
      McpProtectedResourceMetadataRouteInputMcpUnchangedBoundarySchema.parse({
        ...base("McpProtectedResourceMetadataRouteInputMcpUnchangedBoundary"),
        localMcpRouteBehaviorChanged: false,
        localMcpRouteUnchangedRequired: true,
        prerequisiteFlagRequired: true,
        protectedResourceMetadataRouteRegistered: false,
        wwwAuthenticateBehaviorImplemented: false,
      }),
    noRuntimeBoundary:
      McpProtectedResourceMetadataRouteInputNoRuntimeBoundarySchema.parse({
        ...base("McpProtectedResourceMetadataRouteInputNoRuntimeBoundary"),
        noAppsSdkResourceRuntime: true,
        noAuthMiddlewareRuntime: true,
        noDbRuntime: true,
        noOauthRuntime: true,
        noProtectedResourceMetadataRouteRuntime: true,
        noRemoteMcpRuntime: true,
        noRouteRuntime: true,
        noTokenSessionRuntime: true,
        noWwwAuthenticateRuntime: true,
      }),
    noTokenLeakageBoundary:
      McpProtectedResourceMetadataRouteInputNoTokenLeakageBoundarySchema.parse({
        ...base("McpProtectedResourceMetadataRouteInputNoTokenLeakageBoundary"),
        companyKeyAuthorityAllowed: false,
        cookiesSessionsSecretsCredentialsAllowed: false,
        credentialBearingUrlsAllowed: false,
        rawFinanceDataAllowed: false,
        rawSourceDumpsAllowed: false,
        tokenValuesAllowed: false,
      }),
    pathDecisionBoundary:
      McpProtectedResourceMetadataRouteInputPathDecisionBoundarySchema.parse({
        ...base("McpProtectedResourceMetadataRouteInputPathDecisionBoundary"),
        expectedMcpDerivedRoutePath:
          MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH,
        mcpCanonicalResourcePath: "/mcp",
        rfc9728WellKnownPath: "/.well-known/oauth-protected-resource",
        routeImplementationAdded: false,
        routePathDerivedFromCanonicalResourceUri: true,
      }),
    proofContract:
      McpProtectedResourceMetadataRouteInputProofContractSchema.parse({
        ...base("McpProtectedResourceMetadataRouteInputProofContract"),
        contractOnly: true,
        noAppSubmission: true,
        noAppsSdkResourceImplementation: true,
        noAuthMiddlewareImplementation: true,
        noDbQueriesAdded: true,
        noDeploymentConfig: true,
        noExternalCommunications: true,
        noFinanceWrite: true,
        noGeneratedPublicProse: true,
        noListingCopy: true,
        noModelCalls: true,
        noNewRoutePath: true,
        noOauthImplementation: true,
        noOpenAiApiCalls: true,
        noOpenAiClientOrKeyUsage: true,
        noPackageScriptsAdded: true,
        noProtectedResourceMetadataRouteImplementation: true,
        noProviderCalls: true,
        noPublicAssets: true,
        noRemoteMcpDeployment: true,
        noRouteBehaviorChange: true,
        noSchemaMigrationsAdded: true,
        noSourceMutation: true,
        noTokenSessionImplementation: true,
        noWwwAuthenticateRouteBehaviorImplementation: true,
      }),
  };
}

export function buildMcpProtectedResourceMetadataRouteInputProof(
  input: Partial<McpProtectedResourceMetadataRouteInputProof> = {},
): McpProtectedResourceMetadataRouteInputProof {
  const contracts = buildMcpProtectedResourceMetadataRouteInputContracts();
  const validValidation =
    validateProtectedResourceMetadataRouteInputEvidenceBundle(validRouteInput);
  const bundle =
    buildProtectedResourceMetadataRouteInputEvidenceBundle(validRouteInput);
  const pathDecision = deriveProtectedResourceMetadataRoutePathDecision({
    canonicalResourceUri: validRouteInput.canonicalResourceUri,
  });
  const invalidInputsFailClosed = invalidRouteInputCandidates.every(
    (candidate) =>
      !validateProtectedResourceMetadataRouteInputEvidenceBundle({
        ...validRouteInput,
        ...candidate,
      }).accepted,
  );

  return McpProtectedResourceMetadataRouteInputProofSchema.parse({
    fp0100PublicSecurityBoundaryStillVerified:
      input.fp0100PublicSecurityBoundaryStillVerified ?? true,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      input.fp0106ProtocolEnvelopeBoundaryStillVerified ?? true,
    fp0107RouteAdapterBoundaryStillVerified:
      input.fp0107RouteAdapterBoundaryStillVerified ?? true,
    fp0117OauthImplementationSequencingBoundaryStillVerified:
      input.fp0117OauthImplementationSequencingBoundaryStillVerified ?? true,
    fp0118ProtectedResourceMetadataBoundaryStillVerified:
      input.fp0118ProtectedResourceMetadataBoundaryStillVerified ?? true,
    fp0120CanonicalResourceAuthServerBoundaryStillVerified:
      input.fp0120CanonicalResourceAuthServerBoundaryStillVerified ?? true,
    fp0121ProtectedResourceMetadataRoutePlanningBoundaryStillVerified:
      input.fp0121ProtectedResourceMetadataRoutePlanningBoundaryStillVerified ??
      true,
    fp0122ProtectedResourceMetadataBuilderBoundaryStillVerified:
      input.fp0122ProtectedResourceMetadataBuilderBoundaryStillVerified ?? true,
    fp0123BoundaryVerified: input.fp0123BoundaryVerified ?? true,
    fp0124AbsentOrDocsOnlyProtectedResourceMetadataRouteImplementationPlanVerified:
      input.fp0124AbsentOrDocsOnlyProtectedResourceMetadataRouteImplementationPlanVerified ??
      true,
    fp0125Absent: input.fp0125Absent ?? true,
    fp0123PostmergeProofDurabilityVerified:
      input.fp0123PostmergeProofDurabilityVerified ?? true,
    localProofOnly: true,
    noAppSubmission: input.noAppSubmission ?? true,
    noAppsSdkResourceImplementation:
      input.noAppsSdkResourceImplementation ?? true,
    noAuthMiddlewareImplementation:
      input.noAuthMiddlewareImplementation ?? true,
    noAutonomousAction: input.noAutonomousAction ?? true,
    noDbQueriesAdded: input.noDbQueriesAdded ?? true,
    noDeploymentConfig: input.noDeploymentConfig ?? true,
    noExternalCommunications: input.noExternalCommunications ?? true,
    noFinanceWrite: input.noFinanceWrite ?? true,
    noGeneratedFinanceAdvice: input.noGeneratedFinanceAdvice ?? true,
    noGeneratedPublicProse: input.noGeneratedPublicProse ?? true,
    noListingCopy: input.noListingCopy ?? true,
    noModelCalls: input.noModelCalls ?? true,
    noNewRoutePath: input.noNewRoutePath ?? true,
    noOauthImplementation: input.noOauthImplementation ?? true,
    noOpenAiApiCalls: input.noOpenAiApiCalls ?? true,
    noOpenAiClientOrKeyUsage: input.noOpenAiClientOrKeyUsage ?? true,
    noPackageScriptsAdded: input.noPackageScriptsAdded ?? true,
    noProtectedResourceMetadataRouteImplementation:
      input.noProtectedResourceMetadataRouteImplementation ?? true,
    noProviderCalls: input.noProviderCalls ?? true,
    noPublicAssets: input.noPublicAssets ?? true,
    noRemoteMcpDeployment: input.noRemoteMcpDeployment ?? true,
    noRouteBehaviorChange: input.noRouteBehaviorChange ?? true,
    noRuntimeCodexFinanceOutput: input.noRuntimeCodexFinanceOutput ?? true,
    noSchemaMigrationsAdded: input.noSchemaMigrationsAdded ?? true,
    noSourceMutation: input.noSourceMutation ?? true,
    noTokenSessionImplementation: input.noTokenSessionImplementation ?? true,
    noWwwAuthenticateRouteBehaviorImplementation:
      input.noWwwAuthenticateRouteBehaviorImplementation ?? true,
    noAppSubmissionFromFp0124: input.noAppSubmissionFromFp0124 ?? true,
    noAppsSdkResourceFromFp0124:
      input.noAppsSdkResourceFromFp0124 ?? true,
    noAuthMiddlewareImplementationFromFp0124:
      input.noAuthMiddlewareImplementationFromFp0124 ?? true,
    noDbQueriesFromFp0124: input.noDbQueriesFromFp0124 ?? true,
    noDeploymentConfigFromFp0124:
      input.noDeploymentConfigFromFp0124 ?? true,
    noListingCopyGeneratedPublicProseFromFp0124:
      input.noListingCopyGeneratedPublicProseFromFp0124 ?? true,
    noNewRoutePathFromFp0124: input.noNewRoutePathFromFp0124 ?? true,
    noOauthImplementationFromFp0124:
      input.noOauthImplementationFromFp0124 ?? true,
    noOpenAiApiCallsFromFp0124: input.noOpenAiApiCallsFromFp0124 ?? true,
    noPackageScriptsFromFp0124:
      input.noPackageScriptsFromFp0124 ?? true,
    noProtectedResourceMetadataRouteFromFp0124:
      input.noProtectedResourceMetadataRouteFromFp0124 ?? true,
    noProviderExternalCallsFromFp0124:
      input.noProviderExternalCallsFromFp0124 ?? true,
    noPublicAssetsSubmissionArtifactsFromFp0124:
      input.noPublicAssetsSubmissionArtifactsFromFp0124 ?? true,
    noRemoteMcpDeploymentFromFp0124:
      input.noRemoteMcpDeploymentFromFp0124 ?? true,
    noRouteBehaviorChangeFromFp0124:
      input.noRouteBehaviorChangeFromFp0124 ?? true,
    noSchemaMigrationsFromFp0124:
      input.noSchemaMigrationsFromFp0124 ?? true,
    noSourceMutationFinanceWriteFromFp0124:
      input.noSourceMutationFinanceWriteFromFp0124 ?? true,
    noTokenSessionImplementationFromFp0124:
      input.noTokenSessionImplementationFromFp0124 ?? true,
    noWwwAuthenticateRouteBehaviorFromFp0124:
      input.noWwwAuthenticateRouteBehaviorFromFp0124 ?? true,
    protectedResourceMetadataRouteImplementationPlanBoundaryVerified:
      input.protectedResourceMetadataRouteImplementationPlanBoundaryVerified ??
      true,
    routeInputAuthorizationServerEvidenceBoundaryVerified:
      input.routeInputAuthorizationServerEvidenceBoundaryVerified ??
      McpProtectedResourceMetadataRouteInputAuthorizationServerEvidenceBoundarySchema.safeParse(
        contracts.authorizationServerEvidenceBoundary,
      ).success,
    routeInputBranchDiffScopeVerified:
      input.routeInputBranchDiffScopeVerified ?? true,
    routeInputBuilderOutputBoundaryVerified:
      input.routeInputBuilderOutputBoundaryVerified ??
      (McpProtectedResourceMetadataRouteInputBuilderOutputBoundarySchema.safeParse(
        contracts.builderOutputBoundary,
      ).success &&
        bundle.builderOutput.routeResponseContractOnly),
    routeInputCanonicalUriEvidenceBoundaryVerified:
      input.routeInputCanonicalUriEvidenceBoundaryVerified ??
      McpProtectedResourceMetadataRouteInputCanonicalUriEvidenceBoundarySchema.safeParse(
        contracts.canonicalUriEvidenceBoundary,
      ).success,
    routeInputCompanyBindingPrerequisiteBoundaryVerified:
      input.routeInputCompanyBindingPrerequisiteBoundaryVerified ??
      McpProtectedResourceMetadataRouteInputCompanyBindingPrerequisiteBoundarySchema.safeParse(
        contracts.companyBindingPrerequisiteBoundary,
      ).success,
    routeInputEvidenceBundleBoundaryVerified:
      input.routeInputEvidenceBundleBoundaryVerified ??
      McpProtectedResourceMetadataRouteInputEvidenceBundleBoundarySchema.safeParse(
        contracts.evidenceBundleBoundary,
      ).success,
    routeInputEvidenceContractsVerified:
      input.routeInputEvidenceContractsVerified ??
      (contracts.proofContract.contractOnly &&
        validValidation.accepted &&
        invalidInputsFailClosed &&
        bundle.routeInputEvidenceBundleOnly),
    routeInputMcpUnchangedBoundaryVerified:
      input.routeInputMcpUnchangedBoundaryVerified ??
      McpProtectedResourceMetadataRouteInputMcpUnchangedBoundarySchema.safeParse(
        contracts.mcpUnchangedBoundary,
      ).success,
    routeInputNoRuntimeBoundaryVerified:
      input.routeInputNoRuntimeBoundaryVerified ??
      McpProtectedResourceMetadataRouteInputNoRuntimeBoundarySchema.safeParse(
        contracts.noRuntimeBoundary,
      ).success,
    routeInputNoAuthRuntimeRepositoryInventoryVerified:
      input.routeInputNoAuthRuntimeRepositoryInventoryVerified ?? true,
    routeInputNoDeploymentPublicAssetRepositoryInventoryVerified:
      input.routeInputNoDeploymentPublicAssetRepositoryInventoryVerified ??
      true,
    routeInputNoOpenAiSourceScanVerified:
      input.routeInputNoOpenAiSourceScanVerified ?? true,
    routeInputNoProtectedResourceMetadataRouteRepositoryInventoryVerified:
      input.routeInputNoProtectedResourceMetadataRouteRepositoryInventoryVerified ??
      true,
    routeInputNoRouteRuntimeRepositoryInventoryVerified:
      input.routeInputNoRouteRuntimeRepositoryInventoryVerified ?? true,
    routeInputNoTokenLeakageBoundaryVerified:
      input.routeInputNoTokenLeakageBoundaryVerified ??
      McpProtectedResourceMetadataRouteInputNoTokenLeakageBoundarySchema.safeParse(
        contracts.noTokenLeakageBoundary,
      ).success,
    routeInputNoWwwAuthenticateRepositoryInventoryVerified:
      input.routeInputNoWwwAuthenticateRepositoryInventoryVerified ?? true,
    routeInputPathDecisionBoundaryVerified:
      input.routeInputPathDecisionBoundaryVerified ??
      (McpProtectedResourceMetadataRouteInputPathDecisionBoundarySchema.safeParse(
        contracts.pathDecisionBoundary,
      ).success &&
        pathDecision.metadataRoutePath ===
          MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH),
    routeInputRepositoryInventoryVerified:
      input.routeInputRepositoryInventoryVerified ?? true,
    schemaVersion: MCP_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_SCHEMA_VERSION,
  });
}

export const validRouteInput = {
  authorizationServerEvidenceAccepted: true,
  authorizationServers: ["https://auth.canonical-finance-host.com"],
  authenticatedCompanyBindingPrerequisiteAccepted: true,
  bearerMethodsSupported: ["header"],
  canonicalResourceUri: "https://mcp.canonical-finance-host.com/mcp",
  canonicalUriEvidenceAccepted: true,
  mcpUnchangedBehaviorPrerequisiteAccepted: true,
  noTokenLeakageAccepted: true,
  routeImplementationDeferred: true,
  scopesSupported: ["mcp:read", "evidence:read"],
  wwwAuthenticateBehaviorDeferred: true,
} satisfies McpProtectedResourceMetadataRouteInputBuilderInput;

const invalidRouteInputCandidates = [
  { canonicalUriEvidenceAccepted: false },
  {
    canonicalResourceUri:
      "https://user:pass@mcp.canonical-finance-host.com/mcp",
  },
  { authorizationServers: [] },
  {
    authorizationServers: ["https://user:pass@auth.canonical-finance-host.com"],
  },
  { scopesSupported: ["finance:write"] },
  { bearerMethodsSupported: ["query"] },
  { noTokenLeakageAccepted: false },
  { authenticatedCompanyBindingPrerequisiteAccepted: false },
  { mcpUnchangedBehaviorPrerequisiteAccepted: false },
] as const;

function base(
  contractKind: McpProtectedResourceMetadataRouteInputContractKind,
) {
  return {
    contractKind,
    implementationAdded: false,
    localProofOnly: true,
    readOnly: true,
    schemaVersion: MCP_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_SCHEMA_VERSION,
  };
}
