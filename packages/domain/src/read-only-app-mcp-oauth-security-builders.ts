import type { z } from "zod";
import { MCP_TOOL_ALLOWLIST } from "./read-only-app-mcp-boundaries";
import type { McpOauthSecurityContractKindSchema } from "./read-only-app-mcp-oauth-security-contracts";
import {
  MCP_COMPANY_BINDING_REJECTED_AUTHORITIES,
  MCP_OAUTH_SECURITY_SCHEMA_VERSION,
  MCP_SCOPE_MINIMIZATION_REQUIRED_SCOPES,
  MCP_TOKEN_FAILURE_MODES,
  MCP_TOKEN_LEAKAGE_SURFACES,
  McpAdminConsentBoundarySchema,
  McpAuthMiddlewareDeferredBoundarySchema,
  McpClientCompanyKeySelectorBoundarySchema,
  McpCompanyBindingBoundarySchema,
  McpNoRealFinanceDataBoundarySchema,
  McpNoTokenLeakageBoundarySchema,
  McpOauthImplementationDeferredBoundarySchema,
  McpOauthSecurityProofContractSchema,
  McpOrgRbacBoundarySchema,
  McpPublicExposureBlockedBoundarySchema,
  McpRefreshTokenOfflineAccessBoundarySchema,
  McpRemoteDeploymentDeferredBoundarySchema,
  McpScopeMinimizationBoundarySchema,
  McpTokenAudienceValidationBoundarySchema,
  McpTokenFailureModeBoundarySchema,
  McpTokenPassthroughForbiddenBoundarySchema,
  McpTokenRevocationRotationBoundarySchema,
  McpTokenSessionDeferredBoundarySchema,
  McpTokenStorageRedactionBoundarySchema,
  McpUserIdentityBoundarySchema,
} from "./read-only-app-mcp-oauth-security-contracts";

export function buildMcpOauthSecurityContracts() {
  return {
    adminConsentBoundary: McpAdminConsentBoundarySchema.parse({
      ...base("McpAdminConsentBoundary"),
      adminOrgConsentReviewRequired: true,
      consentImplementationAdded: false,
      publicAppUsageRequiresApprovedOrg: true,
    }),
    authMiddlewareDeferredBoundary:
      McpAuthMiddlewareDeferredBoundarySchema.parse({
        ...deferred("McpAuthMiddlewareDeferredBoundary"),
        authMiddlewareAdded: false,
        routeGuardAdded: false,
      }),
    clientCompanyKeySelectorBoundary:
      McpClientCompanyKeySelectorBoundarySchema.parse({
        ...base("McpClientCompanyKeySelectorBoundary"),
        mismatchFailsClosed: true,
        missingAuthenticatedBindingFailsClosed: true,
        requestedSelectorOnly: true,
        selectorIsAuthority: false,
      }),
    companyBindingBoundary: McpCompanyBindingBoundarySchema.parse({
      ...base("McpCompanyBindingBoundary"),
      authenticatedUserOrgMembershipRequired: true,
      clientCompanyKeyAuthorityAllowed: false,
      companyBindingDerivedServerSide: true,
      rejectedAuthoritySources: [...MCP_COMPANY_BINDING_REJECTED_AUTHORITIES],
    }),
    noRealFinanceDataBoundary: McpNoRealFinanceDataBoundarySchema.parse({
      ...base("McpNoRealFinanceDataBoundary"),
      noPrivateFinanceDataExposure: true,
      noPublicDemoData: true,
      noRawDumps: true,
      noRealFinanceData: true,
      noSourcePacks: true,
    }),
    noTokenLeakageBoundary: McpNoTokenLeakageBoundarySchema.parse({
      ...base("McpNoTokenLeakageBoundary"),
      forbiddenSurfaces: [...MCP_TOKEN_LEAKAGE_SURFACES],
      tokenValuesForbiddenEverywhere: true,
    }),
    oauthImplementationDeferredBoundary:
      McpOauthImplementationDeferredBoundarySchema.parse({
        ...deferred("McpOauthImplementationDeferredBoundary"),
        authorizationFlowImplemented: false,
        callbackImplemented: false,
        tokenExchangeImplemented: false,
      }),
    orgRbacBoundary: McpOrgRbacBoundarySchema.parse({
      ...base("McpOrgRbacBoundary"),
      allowedTools: [...MCP_TOOL_ALLOWLIST],
      dynamicToolsAllowed: false,
      providerActionToolsAllowed: false,
      readOnlyRbacRequired: true,
      writeActionToolsAllowed: false,
    }),
    proofContract: McpOauthSecurityProofContractSchema.parse({
      ...base("McpOauthSecurityProofContract"),
      contractOnly: true,
      fp0114Created: false,
      noAppSubmission: true,
      noAppsSdkResourceImplementation: true,
      noAuthMiddlewareImplementation: true,
      noDbQueriesAdded: true,
      noExternalCommunications: true,
      noFinanceWrite: true,
      noModelCalls: true,
      noOauthImplementation: true,
      noOpenAiApiCalls: true,
      noOpenAiClientOrKeyUsage: true,
      noProviderCalls: true,
      noPublicAppImplementation: true,
      noPublicAssets: true,
      noRemoteMcpDeployment: true,
      noRouteBehaviorChange: true,
      noSchemaMigrationsAdded: true,
      noSourceMutation: true,
      noTokenSessionImplementation: true,
      readOnly: true,
    }),
    publicExposureBlockedBoundary: McpPublicExposureBlockedBoundarySchema.parse(
      {
        ...base("McpPublicExposureBlockedBoundary"),
        localRouteExposeableAsIs: false,
        publicExposureBlocked: true,
        remotePublicAccessAllowed: false,
        routeBehaviorChangeAllowed: false,
      },
    ),
    refreshTokenOfflineAccessBoundary:
      McpRefreshTokenOfflineAccessBoundarySchema.parse({
        ...base("McpRefreshTokenOfflineAccessBoundary"),
        offlineAccessGranted: false,
        offlineAccessPolicyReviewRequired: true,
        refreshTokenPolicyReviewRequired: true,
        refreshTokenStorageImplemented: false,
      }),
    remoteDeploymentDeferredBoundary:
      McpRemoteDeploymentDeferredBoundarySchema.parse({
        ...deferred("McpRemoteDeploymentDeferredBoundary"),
        currentLocalRouteExposeableAsIs: false,
        publicHostConfigured: false,
        remoteServerStarted: false,
      }),
    scopeMinimizationBoundary: McpScopeMinimizationBoundarySchema.parse({
      ...base("McpScopeMinimizationBoundary"),
      exactScopesRequiredBeforeImplementation: true,
      leastPrivilegeRequired: true,
      requiredReadOnlyScopes: [...MCP_SCOPE_MINIMIZATION_REQUIRED_SCOPES],
      wildcardScopesAllowed: false,
    }),
    tokenAudienceValidationBoundary:
      McpTokenAudienceValidationBoundarySchema.parse({
        ...base("McpTokenAudienceValidationBoundary"),
        audienceValidationRequired: true,
        resourceValidationRequired: true,
        tokenWithoutIntendedAudienceAccepted: false,
      }),
    tokenFailureModeBoundary: McpTokenFailureModeBoundarySchema.parse({
      ...base("McpTokenFailureModeBoundary"),
      failClosed: true,
      failureModes: [...MCP_TOKEN_FAILURE_MODES],
    }),
    tokenPassthroughForbiddenBoundary:
      McpTokenPassthroughForbiddenBoundarySchema.parse({
        ...base("McpTokenPassthroughForbiddenBoundary"),
        downstreamApiTokenForwardingAllowed: false,
        tokenPassthroughForbidden: true,
        unvalidatedClientTokenAccepted: false,
      }),
    tokenRevocationRotationBoundary:
      McpTokenRevocationRotationBoundarySchema.parse({
        ...base("McpTokenRevocationRotationBoundary"),
        replayProtectionImplemented: false,
        replayProtectionRequired: true,
        revocationImplemented: false,
        revocationPolicyRequired: true,
        rotationImplemented: false,
        rotationPolicyRequired: true,
      }),
    tokenSessionDeferredBoundary: McpTokenSessionDeferredBoundarySchema.parse({
      ...deferred("McpTokenSessionDeferredBoundary"),
      cookieSessionImplemented: false,
      sessionStoreImplemented: false,
      tokenStoreImplemented: false,
    }),
    tokenStorageRedactionBoundary: McpTokenStorageRedactionBoundarySchema.parse(
      {
        ...base("McpTokenStorageRedactionBoundary"),
        rawTokenLoggingAllowed: false,
        redactionRequired: true,
        tokenInMetadataAllowed: false,
        tokenInUiPropsAllowed: false,
        tokenStorageContractOnly: true,
        tokenStorageImplemented: false,
      },
    ),
    userIdentityBoundary: McpUserIdentityBoundarySchema.parse({
      ...base("McpUserIdentityBoundary"),
      anonymousCustomerEvidenceAllowed: false,
      authenticatedIdentityRequired: true,
      identityFromClientMetadataAllowed: false,
      identityFromModelTextAllowed: false,
      identityFromPromptTextAllowed: false,
    }),
  };
}

function base(
  contractKind: z.infer<typeof McpOauthSecurityContractKindSchema>,
) {
  return {
    contractKind,
    implementationAdded: false,
    localProofOnly: true,
    schemaVersion: MCP_OAUTH_SECURITY_SCHEMA_VERSION,
  };
}

function deferred(
  contractKind: z.infer<typeof McpOauthSecurityContractKindSchema>,
) {
  return {
    ...base(contractKind),
    deferred: true,
    implemented: false,
    requiresLaterFinancePlan: true,
    requiresLaterSecurityReview: true,
  };
}
