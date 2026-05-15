import { z } from "zod";
import {
  FP0117_OAUTH_IMPLEMENTATION_SEQUENCING_PLAN_PATH,
  FP0116_REMOTE_HOST_RESOURCE_PLAN_PATH,
  MCP_CANONICAL_RESOURCE_URI_REJECTED_SELECTOR_TOKENS,
  MCP_PUBLIC_MCP_ENDPOINT_PATH,
  MCP_REMOTE_HOST_OWNER_FAMILIES,
  MCP_REMOTE_HOST_PREFERRED_OWNER_FAMILIES,
  MCP_REMOTE_HOST_RESOURCE_SCHEMA_VERSION,
  MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS,
  McpAudienceResourceValidationPrerequisiteBoundarySchema,
  McpAuthenticatedCompanyBindingPrerequisiteBoundarySchema,
  McpAuthorizationServerDiscoveryBoundarySchema,
  McpCanonicalResourceUriContractBoundarySchema,
  McpLocalTunnelPreviewOnlyBoundarySchema,
  McpProtectedResourceMetadataBoundarySchema,
  McpPublicMcpEndpointPathBoundarySchema,
  McpRemoteHostNoRuntimeBoundarySchema,
  McpRemoteHostOwnerCandidateAnalysisBoundarySchema,
  McpRemoteHostOwnerDecisionBoundarySchema,
  McpRemoteHostProviderNeutralBoundarySchema,
  McpRemoteHostResourceProofContractSchema,
  McpScopeChallengeBoundarySchema,
  McpWorkspaceTenantUrlRejectedBoundarySchema,
  McpWwwAuthenticateResourceMetadataBoundarySchema,
  type McpRemoteHostResourceContractKindSchema,
} from "./read-only-app-mcp-remote-host-resource-contracts";

const trueLiteral = z.literal(true);

export const McpRemoteHostResourceProofSchema = z
  .object({
    schemaVersion: z.literal(MCP_REMOTE_HOST_RESOURCE_SCHEMA_VERSION),
    localProofOnly: trueLiteral,
    remoteHostResourceContractsVerified: trueLiteral,
    remoteHostOwnerDecisionBoundaryVerified: trueLiteral,
    remoteHostOwnerCandidateAnalysisBoundaryVerified: trueLiteral,
    remoteHostProviderNeutralBoundaryVerified: trueLiteral,
    canonicalResourceUriContractBoundaryVerified: trueLiteral,
    publicMcpEndpointPathBoundaryVerified: trueLiteral,
    protectedResourceMetadataBoundaryVerified: trueLiteral,
    wwwAuthenticateResourceMetadataBoundaryVerified: trueLiteral,
    authorizationServerDiscoveryBoundaryVerified: trueLiteral,
    scopeChallengeBoundaryVerified: trueLiteral,
    audienceResourceValidationPrerequisiteBoundaryVerified: trueLiteral,
    authenticatedCompanyBindingPrerequisiteBoundaryVerified: trueLiteral,
    workspaceTenantUrlRejectedBoundaryVerified: trueLiteral,
    localTunnelPreviewOnlyBoundaryVerified: trueLiteral,
    remoteHostNoRuntimeBoundaryVerified: trueLiteral,
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
    fp0116BoundaryVerified: trueLiteral,
    fp0116AbsentOrLocalRemoteHostResourceContractsVerified: trueLiteral,
    remoteHostResourceContractsFoundationVerified: trueLiteral,
    fp0117Absent: trueLiteral,
    fp0115RemoteHostImplementationSequencingBoundaryStillVerified: trueLiteral,
    fp0114RemoteHostReadinessBoundaryStillVerified: trueLiteral,
    fp0113OauthSecurityBoundaryStillVerified: trueLiteral,
    fp0112RemotePublicOauthReadinessBoundaryStillVerified: trueLiteral,
    fp0111DefaultLocalDispatchWiringStillVerified: trueLiteral,
    fp0109AdapterBoundaryStillVerified: trueLiteral,
    fp0108DispatchContractsStillVerified: trueLiteral,
    fp0107RouteAdapterBoundaryStillVerified: trueLiteral,
    fp0106ProtocolEnvelopeBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
    hostOwnerDecisionStatus: z.literal("unresolved_hold"),
    currentLocalRouteOwner: z.literal("apps/control-plane"),
    futureHostOwnerFamily: z.literal("unresolved_hold"),
    preferredFutureHostOwnerFamilies: z.tuple([
      z.literal(MCP_REMOTE_HOST_PREFERRED_OWNER_FAMILIES[0]),
      z.literal(MCP_REMOTE_HOST_PREFERRED_OWNER_FAMILIES[1]),
    ]),
    publicMcpEndpointPath: z.literal(MCP_PUBLIC_MCP_ENDPOINT_PATH),
  })
  .strict();

export type McpRemoteHostResourceProof = z.infer<
  typeof McpRemoteHostResourceProofSchema
>;

export function buildMcpRemoteHostResourceContracts() {
  return {
    authenticatedCompanyBindingPrerequisiteBoundary:
      McpAuthenticatedCompanyBindingPrerequisiteBoundarySchema.parse({
        ...base("McpAuthenticatedCompanyBindingPrerequisiteBoundary"),
        authenticatedSecurityBoundaryRequired: true,
        companyBindingFromMetaAllowed: false,
        companyBindingFromModelTextAllowed: false,
        companyBindingFromPromptTextAllowed: false,
        companyBindingFromUrlAllowed: false,
        unauthenticatedCompanyKeyAuthorityAllowed: false,
      }),
    audienceResourceValidationPrerequisiteBoundary:
      McpAudienceResourceValidationPrerequisiteBoundarySchema.parse({
        ...base("McpAudienceResourceValidationPrerequisiteBoundary"),
        audienceResourceValidationRequired: true,
        resourceIndicatorRequired: true,
        tokenPassthroughAllowed: false,
        validationImplementationAdded: false,
      }),
    authorizationServerDiscoveryBoundary:
      McpAuthorizationServerDiscoveryBoundarySchema.parse({
        ...base("McpAuthorizationServerDiscoveryBoundary"),
        authorizationServerDiscoveryRequired: true,
        discoveryImplementationAdded: false,
        protectedResourceMetadataMustIdentifyAuthorizationServers: true,
      }),
    canonicalResourceUriContractBoundary:
      McpCanonicalResourceUriContractBoundarySchema.parse({
        ...base("McpCanonicalResourceUriContractBoundary"),
        canonicalResourceUriImplemented: false,
        canonicalResourceUriRequiredBeforeRemoteImplementation: true,
        companyKeyInUrlAllowed: false,
        exactStableUriRequired: true,
        fragmentAllowed: false,
        httpsRequired: true,
        placeholderUriAllowed: false,
        queryStringAllowed: false,
        requiredPath: MCP_PUBLIC_MCP_ENDPOINT_PATH,
        userControlledSelectorInUrlAllowed: false,
      }),
    localTunnelPreviewOnlyBoundary:
      McpLocalTunnelPreviewOnlyBoundarySchema.parse({
        ...base("McpLocalTunnelPreviewOnlyBoundary"),
        localTunnelCountsAsPublicDeploymentProof: false,
        localTunnelCountsAsSubmissionProof: false,
        localTunnelPreviewDevelopmentOnly: true,
      }),
    protectedResourceMetadataBoundary:
      McpProtectedResourceMetadataBoundarySchema.parse({
        ...base("McpProtectedResourceMetadataBoundary"),
        metadataMustUseCanonicalResourceUri: true,
        protectedResourceMetadataImplemented: false,
        protectedResourceMetadataRequiredBeforePublicExposure: true,
        requiredMetadataFields: [
          ...MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS,
        ],
      }),
    proofContract: McpRemoteHostResourceProofContractSchema.parse({
      ...base("McpRemoteHostResourceProofContract"),
      contractOnly: true,
      noAppSubmission: true,
      noAppsSdkResourceImplementation: true,
      noAuthMiddlewareImplementation: true,
      noAutonomousAction: true,
      noDbQueriesAdded: true,
      noDeploymentConfig: true,
      noExternalCommunications: true,
      noFinanceWrite: true,
      noGeneratedFinanceAdvice: true,
      noGeneratedPublicProse: true,
      noListingCopy: true,
      noModelCalls: true,
      noNewRoutePath: true,
      noOauthImplementation: true,
      noOpenAiApiCalls: true,
      noOpenAiClientOrKeyUsage: true,
      noPackageScriptsAdded: true,
      noProviderCalls: true,
      noPublicAssets: true,
      noRemoteMcpDeployment: true,
      noRouteBehaviorChange: true,
      noRuntimeCodexFinanceOutput: true,
      noSchemaMigrationsAdded: true,
      noSourceMutation: true,
      noTokenSessionImplementation: true,
    }),
    publicMcpEndpointPathBoundary: McpPublicMcpEndpointPathBoundarySchema.parse(
      {
        ...base("McpPublicMcpEndpointPathBoundary"),
        getMcpBehaviorChangeAllowed: false,
        newRoutePathAllowed: false,
        onlyFuturePublicMcpEndpointPath: MCP_PUBLIC_MCP_ENDPOINT_PATH,
        postMcpBehaviorChangeAllowed: false,
        routePathAdded: false,
      },
    ),
    remoteHostNoRuntimeBoundary: McpRemoteHostNoRuntimeBoundarySchema.parse({
      ...base("McpRemoteHostNoRuntimeBoundary"),
      noAppsSdkResourceRuntime: true,
      noDeploymentConfig: true,
      noOauthTokenSessionAuthMiddleware: true,
      noProviderRuntime: true,
      noPublicAppRuntime: true,
      noRemoteRuntime: true,
    }),
    remoteHostOwnerCandidateAnalysisBoundary:
      McpRemoteHostOwnerCandidateAnalysisBoundarySchema.parse({
        ...base("McpRemoteHostOwnerCandidateAnalysisBoundary"),
        allowedFutureHostFamilies: [...MCP_REMOTE_HOST_OWNER_FAMILIES],
        appsControlPlaneRequiresLaterPublicHostingProof: true,
        currentDecisionIsHold: true,
        preferredCandidateFamilies: [
          ...MCP_REMOTE_HOST_PREFERRED_OWNER_FAMILIES,
        ],
      }),
    remoteHostOwnerDecisionBoundary:
      McpRemoteHostOwnerDecisionBoundarySchema.parse({
        ...base("McpRemoteHostOwnerDecisionBoundary"),
        currentLocalRouteOwner: "apps/control-plane",
        currentLocalRouteRemoteExposeableAsIs: false,
        futureHostOwnerFamily: "unresolved_hold",
        hostOwnerDecisionStatus: "unresolved_hold",
        implementationBlockedUntilOwnerNamed: true,
        laterPlanMayNameOwnerAfterProof: true,
      }),
    remoteHostProviderNeutralBoundary:
      McpRemoteHostProviderNeutralBoundarySchema.parse({
        ...base("McpRemoteHostProviderNeutralBoundary"),
        deploymentProviderConfigAllowed: false,
        providerCallsAllowed: false,
        providerNeutral: true,
        providerSelected: false,
      }),
    scopeChallengeBoundary: McpScopeChallengeBoundarySchema.parse({
      ...base("McpScopeChallengeBoundary"),
      insufficientScopeMustFailClosed: true,
      scopeChallengeHandlingRequired: true,
      scopeChallengeImplementationAdded: false,
      wildcardScopesAllowed: false,
    }),
    workspaceTenantUrlRejectedBoundary:
      McpWorkspaceTenantUrlRejectedBoundarySchema.parse({
        ...base("McpWorkspaceTenantUrlRejectedBoundary"),
        multiCompanyV2ScopeProven: false,
        singleCompanyV2BoundaryPreserved: true,
        workspaceTenantTemplateUrlAllowed: false,
      }),
    wwwAuthenticateResourceMetadataBoundary:
      McpWwwAuthenticateResourceMetadataBoundarySchema.parse({
        ...base("McpWwwAuthenticateResourceMetadataBoundary"),
        missingInvalidTokenMustChallengeWithResourceMetadata: true,
        routeBehaviorChangeAllowedNow: false,
        wwwAuthenticateBehaviorImplemented: false,
        wwwAuthenticateResourceMetadataRequired: true,
      }),
  };
}

export function buildMcpRemoteHostResourceProof(
  input: Partial<{
    noRouteBehaviorChange: boolean;
    noNewRoutePath: boolean;
    noRemoteMcpDeployment: boolean;
    noDeploymentConfig: boolean;
    noOauthImplementation: boolean;
    noTokenSessionImplementation: boolean;
    noAuthMiddlewareImplementation: boolean;
    noAppsSdkResourceImplementation: boolean;
    noAppSubmission: boolean;
    noDbQueriesAdded: boolean;
    noSchemaMigrationsAdded: boolean;
    noPackageScriptsAdded: boolean;
    noPublicAssets: boolean;
    noListingCopy: boolean;
    noGeneratedPublicProse: boolean;
    noOpenAiApiCalls: boolean;
    noModelCalls: boolean;
    noOpenAiClientOrKeyUsage: boolean;
    noProviderCalls: boolean;
    noExternalCommunications: boolean;
    noSourceMutation: boolean;
    noFinanceWrite: boolean;
    fp0116BoundaryVerified: boolean;
    fp0116AbsentOrLocalRemoteHostResourceContractsVerified: boolean;
    fp0117Absent: boolean;
    fp0115RemoteHostImplementationSequencingBoundaryStillVerified: boolean;
    fp0114RemoteHostReadinessBoundaryStillVerified: boolean;
    fp0113OauthSecurityBoundaryStillVerified: boolean;
    fp0112RemotePublicOauthReadinessBoundaryStillVerified: boolean;
    fp0111DefaultLocalDispatchWiringStillVerified: boolean;
    fp0109AdapterBoundaryStillVerified: boolean;
    fp0108DispatchContractsStillVerified: boolean;
    fp0107RouteAdapterBoundaryStillVerified: boolean;
    fp0106ProtocolEnvelopeBoundaryStillVerified: boolean;
    fp0100PublicSecurityBoundaryStillVerified: boolean;
  }> = {},
): McpRemoteHostResourceProof {
  const contracts = buildMcpRemoteHostResourceContracts();
  const proof = contracts.proofContract;
  const owner = contracts.remoteHostOwnerDecisionBoundary;
  const candidates = contracts.remoteHostOwnerCandidateAnalysisBoundary;
  const provider = contracts.remoteHostProviderNeutralBoundary;
  const canonical = contracts.canonicalResourceUriContractBoundary;
  const path = contracts.publicMcpEndpointPathBoundary;
  const metadata = contracts.protectedResourceMetadataBoundary;
  const challenge = contracts.wwwAuthenticateResourceMetadataBoundary;
  const discovery = contracts.authorizationServerDiscoveryBoundary;
  const scope = contracts.scopeChallengeBoundary;
  const audience = contracts.audienceResourceValidationPrerequisiteBoundary;
  const company = contracts.authenticatedCompanyBindingPrerequisiteBoundary;
  const workspace = contracts.workspaceTenantUrlRejectedBoundary;
  const tunnel = contracts.localTunnelPreviewOnlyBoundary;
  const runtime = contracts.remoteHostNoRuntimeBoundary;

  return McpRemoteHostResourceProofSchema.parse({
    authenticatedCompanyBindingPrerequisiteBoundaryVerified:
      company.authenticatedSecurityBoundaryRequired &&
      !company.companyBindingFromUrlAllowed &&
      !company.companyBindingFromPromptTextAllowed &&
      !company.companyBindingFromModelTextAllowed &&
      !company.companyBindingFromMetaAllowed &&
      !company.unauthenticatedCompanyKeyAuthorityAllowed,
    audienceResourceValidationPrerequisiteBoundaryVerified:
      audience.audienceResourceValidationRequired &&
      audience.resourceIndicatorRequired &&
      !audience.validationImplementationAdded &&
      !audience.tokenPassthroughAllowed,
    authorizationServerDiscoveryBoundaryVerified:
      discovery.authorizationServerDiscoveryRequired &&
      discovery.protectedResourceMetadataMustIdentifyAuthorizationServers &&
      !discovery.discoveryImplementationAdded,
    canonicalResourceUriContractBoundaryVerified:
      canonical.canonicalResourceUriRequiredBeforeRemoteImplementation &&
      !canonical.canonicalResourceUriImplemented &&
      canonical.httpsRequired &&
      canonical.exactStableUriRequired &&
      !canonical.queryStringAllowed &&
      !canonical.fragmentAllowed &&
      !canonical.placeholderUriAllowed &&
      !canonical.companyKeyInUrlAllowed &&
      !canonical.userControlledSelectorInUrlAllowed &&
      canonical.requiredPath === MCP_PUBLIC_MCP_ENDPOINT_PATH,
    currentLocalRouteOwner: owner.currentLocalRouteOwner,
    fp0100PublicSecurityBoundaryStillVerified:
      input.fp0100PublicSecurityBoundaryStillVerified ?? true,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      input.fp0106ProtocolEnvelopeBoundaryStillVerified ?? true,
    fp0107RouteAdapterBoundaryStillVerified:
      input.fp0107RouteAdapterBoundaryStillVerified ?? true,
    fp0108DispatchContractsStillVerified:
      input.fp0108DispatchContractsStillVerified ?? true,
    fp0109AdapterBoundaryStillVerified:
      input.fp0109AdapterBoundaryStillVerified ?? true,
    fp0111DefaultLocalDispatchWiringStillVerified:
      input.fp0111DefaultLocalDispatchWiringStillVerified ?? true,
    fp0112RemotePublicOauthReadinessBoundaryStillVerified:
      input.fp0112RemotePublicOauthReadinessBoundaryStillVerified ?? true,
    fp0113OauthSecurityBoundaryStillVerified:
      input.fp0113OauthSecurityBoundaryStillVerified ?? true,
    fp0114RemoteHostReadinessBoundaryStillVerified:
      input.fp0114RemoteHostReadinessBoundaryStillVerified ?? true,
    fp0115RemoteHostImplementationSequencingBoundaryStillVerified:
      input.fp0115RemoteHostImplementationSequencingBoundaryStillVerified ??
      true,
    fp0116AbsentOrLocalRemoteHostResourceContractsVerified:
      input.fp0116AbsentOrLocalRemoteHostResourceContractsVerified ?? true,
    fp0116BoundaryVerified: input.fp0116BoundaryVerified ?? true,
    fp0117Absent: input.fp0117Absent ?? true,
    futureHostOwnerFamily: owner.futureHostOwnerFamily,
    hostOwnerDecisionStatus: owner.hostOwnerDecisionStatus,
    localProofOnly: proof.localProofOnly,
    localTunnelPreviewOnlyBoundaryVerified:
      tunnel.localTunnelPreviewDevelopmentOnly &&
      !tunnel.localTunnelCountsAsPublicDeploymentProof &&
      !tunnel.localTunnelCountsAsSubmissionProof,
    noAppSubmission: (input.noAppSubmission ?? true) && proof.noAppSubmission,
    noAppsSdkResourceImplementation:
      (input.noAppsSdkResourceImplementation ?? true) &&
      proof.noAppsSdkResourceImplementation,
    noAuthMiddlewareImplementation:
      (input.noAuthMiddlewareImplementation ?? true) &&
      proof.noAuthMiddlewareImplementation,
    noDbQueriesAdded:
      (input.noDbQueriesAdded ?? true) && proof.noDbQueriesAdded,
    noDeploymentConfig:
      (input.noDeploymentConfig ?? true) && proof.noDeploymentConfig,
    noExternalCommunications:
      (input.noExternalCommunications ?? true) &&
      proof.noExternalCommunications,
    noFinanceWrite: (input.noFinanceWrite ?? true) && proof.noFinanceWrite,
    noGeneratedPublicProse:
      (input.noGeneratedPublicProse ?? true) && proof.noGeneratedPublicProse,
    noListingCopy: (input.noListingCopy ?? true) && proof.noListingCopy,
    noModelCalls: (input.noModelCalls ?? true) && proof.noModelCalls,
    noNewRoutePath: (input.noNewRoutePath ?? true) && proof.noNewRoutePath,
    noOauthImplementation:
      (input.noOauthImplementation ?? true) && proof.noOauthImplementation,
    noOpenAiApiCalls:
      (input.noOpenAiApiCalls ?? true) && proof.noOpenAiApiCalls,
    noOpenAiClientOrKeyUsage:
      (input.noOpenAiClientOrKeyUsage ?? true) &&
      proof.noOpenAiClientOrKeyUsage,
    noPackageScriptsAdded:
      (input.noPackageScriptsAdded ?? true) && proof.noPackageScriptsAdded,
    noProviderCalls: (input.noProviderCalls ?? true) && proof.noProviderCalls,
    noPublicAssets: (input.noPublicAssets ?? true) && proof.noPublicAssets,
    noRemoteMcpDeployment:
      (input.noRemoteMcpDeployment ?? true) && proof.noRemoteMcpDeployment,
    noRouteBehaviorChange:
      (input.noRouteBehaviorChange ?? true) && proof.noRouteBehaviorChange,
    noSchemaMigrationsAdded:
      (input.noSchemaMigrationsAdded ?? true) && proof.noSchemaMigrationsAdded,
    noSourceMutation:
      (input.noSourceMutation ?? true) && proof.noSourceMutation,
    noTokenSessionImplementation:
      (input.noTokenSessionImplementation ?? true) &&
      proof.noTokenSessionImplementation,
    preferredFutureHostOwnerFamilies: [
      ...MCP_REMOTE_HOST_PREFERRED_OWNER_FAMILIES,
    ],
    protectedResourceMetadataBoundaryVerified:
      metadata.protectedResourceMetadataRequiredBeforePublicExposure &&
      !metadata.protectedResourceMetadataImplemented &&
      metadata.metadataMustUseCanonicalResourceUri &&
      sameList(
        metadata.requiredMetadataFields,
        MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS,
      ),
    publicMcpEndpointPath: path.onlyFuturePublicMcpEndpointPath,
    publicMcpEndpointPathBoundaryVerified:
      path.onlyFuturePublicMcpEndpointPath === MCP_PUBLIC_MCP_ENDPOINT_PATH &&
      !path.routePathAdded &&
      !path.newRoutePathAllowed &&
      !path.getMcpBehaviorChangeAllowed &&
      !path.postMcpBehaviorChangeAllowed,
    remoteHostNoRuntimeBoundaryVerified:
      runtime.noRemoteRuntime &&
      runtime.noDeploymentConfig &&
      runtime.noOauthTokenSessionAuthMiddleware &&
      runtime.noAppsSdkResourceRuntime &&
      runtime.noPublicAppRuntime &&
      runtime.noProviderRuntime,
    remoteHostOwnerCandidateAnalysisBoundaryVerified:
      sameList(
        candidates.allowedFutureHostFamilies,
        MCP_REMOTE_HOST_OWNER_FAMILIES,
      ) &&
      sameList(
        candidates.preferredCandidateFamilies,
        MCP_REMOTE_HOST_PREFERRED_OWNER_FAMILIES,
      ) &&
      candidates.appsControlPlaneRequiresLaterPublicHostingProof &&
      candidates.currentDecisionIsHold,
    remoteHostOwnerDecisionBoundaryVerified:
      owner.currentLocalRouteOwner === "apps/control-plane" &&
      !owner.currentLocalRouteRemoteExposeableAsIs &&
      owner.hostOwnerDecisionStatus === "unresolved_hold" &&
      owner.futureHostOwnerFamily === "unresolved_hold" &&
      owner.implementationBlockedUntilOwnerNamed,
    remoteHostProviderNeutralBoundaryVerified:
      provider.providerNeutral &&
      !provider.providerSelected &&
      !provider.deploymentProviderConfigAllowed &&
      !provider.providerCallsAllowed,
    remoteHostResourceContractsFoundationVerified:
      proof.contractOnly && proof.readOnly && proof.localProofOnly,
    remoteHostResourceContractsVerified:
      proof.contractOnly && proof.readOnly && proof.localProofOnly,
    schemaVersion: proof.schemaVersion,
    scopeChallengeBoundaryVerified:
      scope.scopeChallengeHandlingRequired &&
      !scope.scopeChallengeImplementationAdded &&
      scope.insufficientScopeMustFailClosed &&
      !scope.wildcardScopesAllowed,
    workspaceTenantUrlRejectedBoundaryVerified:
      !workspace.workspaceTenantTemplateUrlAllowed &&
      !workspace.multiCompanyV2ScopeProven &&
      workspace.singleCompanyV2BoundaryPreserved,
    wwwAuthenticateResourceMetadataBoundaryVerified:
      challenge.wwwAuthenticateResourceMetadataRequired &&
      challenge.missingInvalidTokenMustChallengeWithResourceMetadata &&
      !challenge.wwwAuthenticateBehaviorImplemented &&
      !challenge.routeBehaviorChangeAllowedNow,
  });
}

export function validateMcpCanonicalResourceUriCandidate(input: {
  uri: string;
  rejectedSelectorTokens?: readonly string[];
}) {
  const rejectedSelectorTokens = [
    ...MCP_CANONICAL_RESOURCE_URI_REJECTED_SELECTOR_TOKENS,
    ...(input.rejectedSelectorTokens ?? []),
  ].map((token) => normalizeToken(token));
  const trimmed = input.uri.trim();

  try {
    const parsed = new URL(trimmed);
    const normalizedHost = parsed.hostname.toLowerCase();
    const normalizedPath = parsed.pathname.toLowerCase();
    const authorityAndPath = normalizeToken(
      `${normalizedHost}${normalizedPath}`,
    );
    const placeholderUri =
      /[{}<>]/u.test(trimmed) ||
      normalizedHost === "localhost" ||
      normalizedHost.endsWith(".localhost") ||
      normalizedHost === "example.com" ||
      normalizedHost.endsWith(".example.com") ||
      normalizedHost.startsWith("127.") ||
      normalizedHost === "0.0.0.0" ||
      normalizedHost === "::1" ||
      authorityAndPath.includes("placeholder");
    const selectorInUrl = rejectedSelectorTokens.some((token) =>
      authorityAndPath.includes(token),
    );

    return {
      accepted:
        parsed.protocol === "https:" &&
        normalizedPath === MCP_PUBLIC_MCP_ENDPOINT_PATH &&
        parsed.search === "" &&
        parsed.hash === "" &&
        !placeholderUri &&
        !selectorInUrl,
      fragmentFree: parsed.hash === "",
      https: parsed.protocol === "https:",
      noCompanyKeyOrUserSelector: !selectorInUrl,
      noPlaceholder: !placeholderUri,
      pathIsPublicMcp: normalizedPath === MCP_PUBLIC_MCP_ENDPOINT_PATH,
      queryFree: parsed.search === "",
    };
  } catch {
    return {
      accepted: false,
      fragmentFree: false,
      https: false,
      noCompanyKeyOrUserSelector: false,
      noPlaceholder: false,
      pathIsPublicMcp: false,
      queryFree: false,
    };
  }
}

export function verifyFp0116RemoteHostResourcePlanBoundary(input: {
  repoPaths: readonly string[];
  planText: string;
}) {
  const fp0116Hits = input.repoPaths.filter((path) =>
    /(^|\/)FP-0116/u.test(path),
  );
  return (
    fp0116Hits.length === 1 &&
    fp0116Hits[0] === FP0116_REMOTE_HOST_RESOURCE_PLAN_PATH &&
    fp0116PlanTextBoundaryVerified(input.planText)
  );
}

export function verifyFp0116AbsentOrLocalRemoteHostResourceContracts(input: {
  repoPaths: readonly string[];
  planText?: string;
}) {
  const fp0116Hits = input.repoPaths.filter((path) =>
    /(^|\/)FP-0116/u.test(path),
  );
  if (fp0116Hits.length === 0) return true;
  return (
    fp0116Hits.length === 1 &&
    fp0116Hits[0] === FP0116_REMOTE_HOST_RESOURCE_PLAN_PATH &&
    fp0116PlanTextBoundaryVerified(input.planText ?? "")
  );
}

export function verifyFp0117Absent(repoPaths: readonly string[]) {
  const fp0117Hits = repoPaths.filter((path) => /(^|\/)FP-0117/u.test(path));
  return (
    fp0117Hits.length === 0 ||
    (fp0117Hits.length === 1 &&
      fp0117Hits[0] === FP0117_OAUTH_IMPLEMENTATION_SEQUENCING_PLAN_PATH)
  );
}

function base(
  contractKind: z.infer<typeof McpRemoteHostResourceContractKindSchema>,
) {
  return {
    contractKind,
    implementationAdded: false,
    localProofOnly: true,
    readOnly: true,
    schemaVersion: MCP_REMOTE_HOST_RESOURCE_SCHEMA_VERSION,
  };
}

function fp0116PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return [
    "local/proof-only/read-only contract slice",
    "future remote host owner remains unresolved",
    "implementation stays blocked",
    "current apps/control-plane fastify /mcp route owner remains local-only",
    "provider remains provider-neutral",
    "canonical mcp resource uri is required before remote implementation",
    "must be https, exact, stable, query-free, fragment-free",
    "public /mcp remains the only future public mcp endpoint path",
    "oauth protected-resource metadata",
    "www-authenticate resource_metadata",
    "authorization-server discovery",
    "scope challenge handling",
    "audience/resource validation",
    "user/org/company binding must come from the authenticated security boundary",
    "workspace/tenant template urls are rejected",
    "local tunnels such as ngrok are development-only",
    "remote host implementation, deployment config",
    "fp-0117 remains absent",
  ].every((requiredText) => normalized.includes(requiredText));
}

function sameList(left: readonly string[], right: readonly string[]) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function normalize(value: string) {
  return value.toLowerCase().replace(/`/gu, "");
}

function normalizeToken(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/gu, "");
}
