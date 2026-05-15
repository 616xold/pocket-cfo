import { z } from "zod";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const MCP_REMOTE_HOST_RESOURCE_SCHEMA_VERSION =
  "v2aj.read-only-app-mcp-remote-host-resource.v1";

export const FP0116_REMOTE_HOST_RESOURCE_PLAN_PATH =
  "plans/FP-0116-read-only-chatgpt-app-mcp-remote-host-owner-canonical-uri-resource-metadata-contracts.md";

export const MCP_PUBLIC_MCP_ENDPOINT_PATH = "/mcp";

export const MCP_REMOTE_HOST_OWNER_FAMILIES = [
  "apps_control_plane_fastify_host",
  "separate_future_mcp_server_package",
  "gateway_wrapper_around_existing_local_service_contracts",
  "unresolved_hold",
] as const;

export const MCP_REMOTE_HOST_PREFERRED_OWNER_FAMILIES = [
  "separate_future_mcp_server_package",
  "gateway_wrapper_around_existing_local_service_contracts",
] as const;

export const MCP_CANONICAL_RESOURCE_URI_REJECTED_SELECTOR_TOKENS = [
  "companykey",
  "company-key",
  "company_key",
  "workspace",
  "tenant",
  "org",
  "user",
] as const;

export const MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS = [
  "resource",
  "authorization_servers",
  "scopes_supported",
  "bearer_methods_supported",
] as const;

export const McpRemoteHostResourceContractKindSchema = z.enum([
  "McpRemoteHostResourceProofContract",
  "McpRemoteHostOwnerDecisionBoundary",
  "McpRemoteHostOwnerCandidateAnalysisBoundary",
  "McpRemoteHostProviderNeutralBoundary",
  "McpCanonicalResourceUriContractBoundary",
  "McpPublicMcpEndpointPathBoundary",
  "McpProtectedResourceMetadataBoundary",
  "McpWwwAuthenticateResourceMetadataBoundary",
  "McpAuthorizationServerDiscoveryBoundary",
  "McpScopeChallengeBoundary",
  "McpAudienceResourceValidationPrerequisiteBoundary",
  "McpAuthenticatedCompanyBindingPrerequisiteBoundary",
  "McpWorkspaceTenantUrlRejectedBoundary",
  "McpLocalTunnelPreviewOnlyBoundary",
  "McpRemoteHostNoRuntimeBoundary",
]);

const BaseRemoteHostResourceContractSchema = z
  .object({
    schemaVersion: z.literal(MCP_REMOTE_HOST_RESOURCE_SCHEMA_VERSION),
    contractKind: McpRemoteHostResourceContractKindSchema,
    localProofOnly: trueLiteral,
    readOnly: trueLiteral,
    implementationAdded: falseLiteral,
  })
  .strict();

export const McpRemoteHostResourceProofContractSchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpRemoteHostResourceProofContract"),
    contractOnly: trueLiteral,
    noRouteBehaviorChange: trueLiteral,
    noNewRoutePath: trueLiteral,
    noRemoteMcpDeployment: trueLiteral,
    noDeploymentConfig: trueLiteral,
    noOauthImplementation: trueLiteral,
    noTokenSessionImplementation: trueLiteral,
    noAuthMiddlewareImplementation: trueLiteral,
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
  }).strict();

export const McpRemoteHostOwnerDecisionBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpRemoteHostOwnerDecisionBoundary"),
    currentLocalRouteOwner: z.literal("apps/control-plane"),
    currentLocalRouteRemoteExposeableAsIs: falseLiteral,
    hostOwnerDecisionStatus: z.literal("unresolved_hold"),
    futureHostOwnerFamily: z.literal("unresolved_hold"),
    implementationBlockedUntilOwnerNamed: trueLiteral,
    laterPlanMayNameOwnerAfterProof: trueLiteral,
  }).strict();

export const McpRemoteHostOwnerCandidateAnalysisBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpRemoteHostOwnerCandidateAnalysisBoundary"),
    allowedFutureHostFamilies: z.tuple([
      z.literal(MCP_REMOTE_HOST_OWNER_FAMILIES[0]),
      z.literal(MCP_REMOTE_HOST_OWNER_FAMILIES[1]),
      z.literal(MCP_REMOTE_HOST_OWNER_FAMILIES[2]),
      z.literal(MCP_REMOTE_HOST_OWNER_FAMILIES[3]),
    ]),
    preferredCandidateFamilies: z.tuple([
      z.literal(MCP_REMOTE_HOST_PREFERRED_OWNER_FAMILIES[0]),
      z.literal(MCP_REMOTE_HOST_PREFERRED_OWNER_FAMILIES[1]),
    ]),
    appsControlPlaneRequiresLaterPublicHostingProof: trueLiteral,
    currentDecisionIsHold: trueLiteral,
  }).strict();

export const McpRemoteHostProviderNeutralBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpRemoteHostProviderNeutralBoundary"),
    providerSelected: falseLiteral,
    providerNeutral: trueLiteral,
    deploymentProviderConfigAllowed: falseLiteral,
    providerCallsAllowed: falseLiteral,
  }).strict();

export const McpCanonicalResourceUriContractBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpCanonicalResourceUriContractBoundary"),
    canonicalResourceUriRequiredBeforeRemoteImplementation: trueLiteral,
    canonicalResourceUriImplemented: falseLiteral,
    httpsRequired: trueLiteral,
    exactStableUriRequired: trueLiteral,
    queryStringAllowed: falseLiteral,
    fragmentAllowed: falseLiteral,
    placeholderUriAllowed: falseLiteral,
    companyKeyInUrlAllowed: falseLiteral,
    userControlledSelectorInUrlAllowed: falseLiteral,
    requiredPath: z.literal(MCP_PUBLIC_MCP_ENDPOINT_PATH),
  }).strict();

export const McpPublicMcpEndpointPathBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpPublicMcpEndpointPathBoundary"),
    onlyFuturePublicMcpEndpointPath: z.literal(MCP_PUBLIC_MCP_ENDPOINT_PATH),
    routePathAdded: falseLiteral,
    newRoutePathAllowed: falseLiteral,
    getMcpBehaviorChangeAllowed: falseLiteral,
    postMcpBehaviorChangeAllowed: falseLiteral,
  }).strict();

export const McpProtectedResourceMetadataBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpProtectedResourceMetadataBoundary"),
    protectedResourceMetadataRequiredBeforePublicExposure: trueLiteral,
    protectedResourceMetadataImplemented: falseLiteral,
    metadataMustUseCanonicalResourceUri: trueLiteral,
    requiredMetadataFields: z.tuple([
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS[0]),
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS[1]),
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS[2]),
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS[3]),
    ]),
  }).strict();

export const McpWwwAuthenticateResourceMetadataBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpWwwAuthenticateResourceMetadataBoundary"),
    wwwAuthenticateResourceMetadataRequired: trueLiteral,
    wwwAuthenticateBehaviorImplemented: falseLiteral,
    missingInvalidTokenMustChallengeWithResourceMetadata: trueLiteral,
    routeBehaviorChangeAllowedNow: falseLiteral,
  }).strict();

export const McpAuthorizationServerDiscoveryBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpAuthorizationServerDiscoveryBoundary"),
    authorizationServerDiscoveryRequired: trueLiteral,
    discoveryImplementationAdded: falseLiteral,
    protectedResourceMetadataMustIdentifyAuthorizationServers: trueLiteral,
  }).strict();

export const McpScopeChallengeBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpScopeChallengeBoundary"),
    scopeChallengeHandlingRequired: trueLiteral,
    scopeChallengeImplementationAdded: falseLiteral,
    insufficientScopeMustFailClosed: trueLiteral,
    wildcardScopesAllowed: falseLiteral,
  }).strict();

export const McpAudienceResourceValidationPrerequisiteBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal(
      "McpAudienceResourceValidationPrerequisiteBoundary",
    ),
    audienceResourceValidationRequired: trueLiteral,
    validationImplementationAdded: falseLiteral,
    resourceIndicatorRequired: trueLiteral,
    tokenPassthroughAllowed: falseLiteral,
  }).strict();

export const McpAuthenticatedCompanyBindingPrerequisiteBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal(
      "McpAuthenticatedCompanyBindingPrerequisiteBoundary",
    ),
    authenticatedSecurityBoundaryRequired: trueLiteral,
    companyBindingFromUrlAllowed: falseLiteral,
    companyBindingFromPromptTextAllowed: falseLiteral,
    companyBindingFromModelTextAllowed: falseLiteral,
    companyBindingFromMetaAllowed: falseLiteral,
    unauthenticatedCompanyKeyAuthorityAllowed: falseLiteral,
  }).strict();

export const McpWorkspaceTenantUrlRejectedBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpWorkspaceTenantUrlRejectedBoundary"),
    workspaceTenantTemplateUrlAllowed: falseLiteral,
    multiCompanyV2ScopeProven: falseLiteral,
    singleCompanyV2BoundaryPreserved: trueLiteral,
  }).strict();

export const McpLocalTunnelPreviewOnlyBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpLocalTunnelPreviewOnlyBoundary"),
    localTunnelPreviewDevelopmentOnly: trueLiteral,
    localTunnelCountsAsPublicDeploymentProof: falseLiteral,
    localTunnelCountsAsSubmissionProof: falseLiteral,
  }).strict();

export const McpRemoteHostNoRuntimeBoundarySchema =
  BaseRemoteHostResourceContractSchema.extend({
    contractKind: z.literal("McpRemoteHostNoRuntimeBoundary"),
    noRemoteRuntime: trueLiteral,
    noDeploymentConfig: trueLiteral,
    noOauthTokenSessionAuthMiddleware: trueLiteral,
    noAppsSdkResourceRuntime: trueLiteral,
    noPublicAppRuntime: trueLiteral,
    noProviderRuntime: trueLiteral,
  }).strict();

export type McpRemoteHostResourceProofContract = z.infer<
  typeof McpRemoteHostResourceProofContractSchema
>;
export type McpRemoteHostOwnerDecisionBoundary = z.infer<
  typeof McpRemoteHostOwnerDecisionBoundarySchema
>;
export type McpRemoteHostOwnerCandidateAnalysisBoundary = z.infer<
  typeof McpRemoteHostOwnerCandidateAnalysisBoundarySchema
>;
export type McpRemoteHostProviderNeutralBoundary = z.infer<
  typeof McpRemoteHostProviderNeutralBoundarySchema
>;
export type McpCanonicalResourceUriContractBoundary = z.infer<
  typeof McpCanonicalResourceUriContractBoundarySchema
>;
export type McpPublicMcpEndpointPathBoundary = z.infer<
  typeof McpPublicMcpEndpointPathBoundarySchema
>;
export type McpProtectedResourceMetadataBoundary = z.infer<
  typeof McpProtectedResourceMetadataBoundarySchema
>;
export type McpWwwAuthenticateResourceMetadataBoundary = z.infer<
  typeof McpWwwAuthenticateResourceMetadataBoundarySchema
>;
export type McpAuthorizationServerDiscoveryBoundary = z.infer<
  typeof McpAuthorizationServerDiscoveryBoundarySchema
>;
export type McpScopeChallengeBoundary = z.infer<
  typeof McpScopeChallengeBoundarySchema
>;
export type McpAudienceResourceValidationPrerequisiteBoundary = z.infer<
  typeof McpAudienceResourceValidationPrerequisiteBoundarySchema
>;
export type McpAuthenticatedCompanyBindingPrerequisiteBoundary = z.infer<
  typeof McpAuthenticatedCompanyBindingPrerequisiteBoundarySchema
>;
export type McpWorkspaceTenantUrlRejectedBoundary = z.infer<
  typeof McpWorkspaceTenantUrlRejectedBoundarySchema
>;
export type McpLocalTunnelPreviewOnlyBoundary = z.infer<
  typeof McpLocalTunnelPreviewOnlyBoundarySchema
>;
export type McpRemoteHostNoRuntimeBoundary = z.infer<
  typeof McpRemoteHostNoRuntimeBoundarySchema
>;
