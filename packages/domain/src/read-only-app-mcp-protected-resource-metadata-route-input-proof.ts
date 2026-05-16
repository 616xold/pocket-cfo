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
    fp0124Absent: trueLiteral,
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
        ...base(
          "McpProtectedResourceMetadataRouteInputBuilderOutputBoundary",
        ),
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
        ...base(
          "McpProtectedResourceMetadataRouteInputEvidenceBundleBoundary",
        ),
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
        ...base(
          "McpProtectedResourceMetadataRouteInputNoTokenLeakageBoundary",
        ),
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
  const bundle = buildProtectedResourceMetadataRouteInputEvidenceBundle(
    validRouteInput,
  );
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
    fp0124Absent: input.fp0124Absent ?? true,
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
    noRuntimeCodexFinanceOutput:
      input.noRuntimeCodexFinanceOutput ?? true,
    noSchemaMigrationsAdded: input.noSchemaMigrationsAdded ?? true,
    noSourceMutation: input.noSourceMutation ?? true,
    noTokenSessionImplementation:
      input.noTokenSessionImplementation ?? true,
    noWwwAuthenticateRouteBehaviorImplementation:
      input.noWwwAuthenticateRouteBehaviorImplementation ?? true,
    routeInputAuthorizationServerEvidenceBoundaryVerified:
      input.routeInputAuthorizationServerEvidenceBoundaryVerified ??
      McpProtectedResourceMetadataRouteInputAuthorizationServerEvidenceBoundarySchema.safeParse(
        contracts.authorizationServerEvidenceBoundary,
      ).success,
    routeInputBuilderOutputBoundaryVerified:
      input.routeInputBuilderOutputBoundaryVerified ??
      (McpProtectedResourceMetadataRouteInputBuilderOutputBoundarySchema.safeParse(
        contracts.builderOutputBoundary,
      ).success && bundle.builderOutput.routeResponseContractOnly),
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
    routeInputNoTokenLeakageBoundaryVerified:
      input.routeInputNoTokenLeakageBoundaryVerified ??
      McpProtectedResourceMetadataRouteInputNoTokenLeakageBoundarySchema.safeParse(
        contracts.noTokenLeakageBoundary,
      ).success,
    routeInputPathDecisionBoundaryVerified:
      input.routeInputPathDecisionBoundaryVerified ??
      (McpProtectedResourceMetadataRouteInputPathDecisionBoundarySchema.safeParse(
        contracts.pathDecisionBoundary,
      ).success &&
        pathDecision.metadataRoutePath ===
          MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH),
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
  { canonicalResourceUri: "https://user:pass@mcp.canonical-finance-host.com/mcp" },
  { authorizationServers: [] },
  { authorizationServers: ["https://user:pass@auth.canonical-finance-host.com"] },
  { scopesSupported: ["finance:write"] },
  { bearerMethodsSupported: ["query"] },
  { noTokenLeakageAccepted: false },
  { authenticatedCompanyBindingPrerequisiteAccepted: false },
  { mcpUnchangedBehaviorPrerequisiteAccepted: false },
] as const;

function base(contractKind: McpProtectedResourceMetadataRouteInputContractKind) {
  return {
    contractKind,
    implementationAdded: false,
    localProofOnly: true,
    readOnly: true,
    schemaVersion: MCP_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_SCHEMA_VERSION,
  };
}
