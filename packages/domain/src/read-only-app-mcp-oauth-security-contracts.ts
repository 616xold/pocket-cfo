import { z } from "zod";
import { McpToolAllowlistSchema } from "./read-only-app-mcp-boundaries";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const MCP_OAUTH_SECURITY_SCHEMA_VERSION =
  "v2ag.read-only-app-mcp-oauth-security.v1";

export const FP0113_OAUTH_SECURITY_PLAN_PATH =
  "plans/FP-0113-read-only-chatgpt-app-mcp-oauth-token-session-security-contracts-foundation.md";

export const MCP_TOKEN_FAILURE_MODES = [
  "missing_token",
  "expired_token",
  "malformed_token",
  "wrong_audience",
  "wrong_scope",
  "wrong_org",
] as const;

export const MCP_TOKEN_LEAKAGE_SURFACES = [
  "logs",
  "ui_props",
  "component_metadata",
  "evidence_cards",
  "proof_output",
  "docs_examples",
  "structured_tool_results",
] as const;

export const MCP_COMPANY_BINDING_REJECTED_AUTHORITIES = [
  "model_text",
  "user_prompt_text",
  "_meta",
  "client_company_key",
  "unauthenticated_request_parameters",
] as const;

export const MCP_SCOPE_MINIMIZATION_REQUIRED_SCOPES = [
  "mcp:tools.read",
  "pocket-cfo:evidence.read",
] as const;

export const McpOauthSecurityContractKindSchema = z.enum([
  "McpOauthSecurityProofContract",
  "McpOauthImplementationDeferredBoundary",
  "McpTokenSessionDeferredBoundary",
  "McpAuthMiddlewareDeferredBoundary",
  "McpRemoteDeploymentDeferredBoundary",
  "McpUserIdentityBoundary",
  "McpAdminConsentBoundary",
  "McpOrgRbacBoundary",
  "McpCompanyBindingBoundary",
  "McpClientCompanyKeySelectorBoundary",
  "McpScopeMinimizationBoundary",
  "McpTokenAudienceValidationBoundary",
  "McpTokenPassthroughForbiddenBoundary",
  "McpTokenFailureModeBoundary",
  "McpRefreshTokenOfflineAccessBoundary",
  "McpTokenStorageRedactionBoundary",
  "McpTokenRevocationRotationBoundary",
  "McpNoTokenLeakageBoundary",
  "McpPublicExposureBlockedBoundary",
  "McpNoRealFinanceDataBoundary",
]);

const BaseSecurityContractSchema = z
  .object({
    schemaVersion: z.literal(MCP_OAUTH_SECURITY_SCHEMA_VERSION),
    contractKind: McpOauthSecurityContractKindSchema,
    localProofOnly: trueLiteral,
    implementationAdded: falseLiteral,
  })
  .strict();

export const McpOauthSecurityProofContractSchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpOauthSecurityProofContract"),
    contractOnly: trueLiteral,
    readOnly: trueLiteral,
    noRouteBehaviorChange: trueLiteral,
    noOauthImplementation: trueLiteral,
    noTokenSessionImplementation: trueLiteral,
    noAuthMiddlewareImplementation: trueLiteral,
    noRemoteMcpDeployment: trueLiteral,
    noAppsSdkResourceImplementation: trueLiteral,
    noPublicAppImplementation: trueLiteral,
    noAppSubmission: trueLiteral,
    noDbQueriesAdded: trueLiteral,
    noSchemaMigrationsAdded: trueLiteral,
    noOpenAiApiCalls: trueLiteral,
    noModelCalls: trueLiteral,
    noOpenAiClientOrKeyUsage: trueLiteral,
    noProviderCalls: trueLiteral,
    noExternalCommunications: trueLiteral,
    noSourceMutation: trueLiteral,
    noFinanceWrite: trueLiteral,
    noPublicAssets: trueLiteral,
    fp0114Created: falseLiteral,
  }).strict();

function deferredBoundarySchema(
  kind: z.infer<typeof McpOauthSecurityContractKindSchema>,
) {
  return BaseSecurityContractSchema.extend({
    contractKind: z.literal(kind),
    deferred: trueLiteral,
    implemented: falseLiteral,
    requiresLaterFinancePlan: trueLiteral,
    requiresLaterSecurityReview: trueLiteral,
  }).strict();
}

export const McpOauthImplementationDeferredBoundarySchema =
  deferredBoundarySchema("McpOauthImplementationDeferredBoundary").extend({
    authorizationFlowImplemented: falseLiteral,
    callbackImplemented: falseLiteral,
    tokenExchangeImplemented: falseLiteral,
  });

export const McpTokenSessionDeferredBoundarySchema = deferredBoundarySchema(
  "McpTokenSessionDeferredBoundary",
).extend({
  tokenStoreImplemented: falseLiteral,
  sessionStoreImplemented: falseLiteral,
  cookieSessionImplemented: falseLiteral,
});

export const McpAuthMiddlewareDeferredBoundarySchema = deferredBoundarySchema(
  "McpAuthMiddlewareDeferredBoundary",
).extend({
  authMiddlewareAdded: falseLiteral,
  routeGuardAdded: falseLiteral,
});

export const McpRemoteDeploymentDeferredBoundarySchema = deferredBoundarySchema(
  "McpRemoteDeploymentDeferredBoundary",
).extend({
  publicHostConfigured: falseLiteral,
  remoteServerStarted: falseLiteral,
  currentLocalRouteExposeableAsIs: falseLiteral,
});

export const McpUserIdentityBoundarySchema = BaseSecurityContractSchema.extend({
  contractKind: z.literal("McpUserIdentityBoundary"),
  authenticatedIdentityRequired: trueLiteral,
  anonymousCustomerEvidenceAllowed: falseLiteral,
  identityFromModelTextAllowed: falseLiteral,
  identityFromPromptTextAllowed: falseLiteral,
  identityFromClientMetadataAllowed: falseLiteral,
}).strict();

export const McpAdminConsentBoundarySchema = BaseSecurityContractSchema.extend({
  contractKind: z.literal("McpAdminConsentBoundary"),
  adminOrgConsentReviewRequired: trueLiteral,
  publicAppUsageRequiresApprovedOrg: trueLiteral,
  consentImplementationAdded: falseLiteral,
}).strict();

export const McpOrgRbacBoundarySchema = BaseSecurityContractSchema.extend({
  contractKind: z.literal("McpOrgRbacBoundary"),
  readOnlyRbacRequired: trueLiteral,
  allowedTools: McpToolAllowlistSchema,
  dynamicToolsAllowed: falseLiteral,
  writeActionToolsAllowed: falseLiteral,
  providerActionToolsAllowed: falseLiteral,
}).strict();

export const McpCompanyBindingBoundarySchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpCompanyBindingBoundary"),
    authenticatedUserOrgMembershipRequired: trueLiteral,
    companyBindingDerivedServerSide: trueLiteral,
    clientCompanyKeyAuthorityAllowed: falseLiteral,
    rejectedAuthoritySources: z.tuple([
      z.literal(MCP_COMPANY_BINDING_REJECTED_AUTHORITIES[0]),
      z.literal(MCP_COMPANY_BINDING_REJECTED_AUTHORITIES[1]),
      z.literal(MCP_COMPANY_BINDING_REJECTED_AUTHORITIES[2]),
      z.literal(MCP_COMPANY_BINDING_REJECTED_AUTHORITIES[3]),
      z.literal(MCP_COMPANY_BINDING_REJECTED_AUTHORITIES[4]),
    ]),
  }).strict();

export const McpClientCompanyKeySelectorBoundarySchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpClientCompanyKeySelectorBoundary"),
    requestedSelectorOnly: trueLiteral,
    selectorIsAuthority: falseLiteral,
    mismatchFailsClosed: trueLiteral,
    missingAuthenticatedBindingFailsClosed: trueLiteral,
  }).strict();

export const McpScopeMinimizationBoundarySchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpScopeMinimizationBoundary"),
    exactScopesRequiredBeforeImplementation: trueLiteral,
    leastPrivilegeRequired: trueLiteral,
    wildcardScopesAllowed: falseLiteral,
    requiredReadOnlyScopes: z.tuple([
      z.literal(MCP_SCOPE_MINIMIZATION_REQUIRED_SCOPES[0]),
      z.literal(MCP_SCOPE_MINIMIZATION_REQUIRED_SCOPES[1]),
    ]),
  }).strict();

export const McpTokenAudienceValidationBoundarySchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpTokenAudienceValidationBoundary"),
    audienceValidationRequired: trueLiteral,
    resourceValidationRequired: trueLiteral,
    tokenWithoutIntendedAudienceAccepted: falseLiteral,
  }).strict();

export const McpTokenPassthroughForbiddenBoundarySchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpTokenPassthroughForbiddenBoundary"),
    tokenPassthroughForbidden: trueLiteral,
    downstreamApiTokenForwardingAllowed: falseLiteral,
    unvalidatedClientTokenAccepted: falseLiteral,
  }).strict();

export const McpTokenFailureModeBoundarySchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpTokenFailureModeBoundary"),
    failClosed: trueLiteral,
    failureModes: z.tuple([
      z.literal(MCP_TOKEN_FAILURE_MODES[0]),
      z.literal(MCP_TOKEN_FAILURE_MODES[1]),
      z.literal(MCP_TOKEN_FAILURE_MODES[2]),
      z.literal(MCP_TOKEN_FAILURE_MODES[3]),
      z.literal(MCP_TOKEN_FAILURE_MODES[4]),
      z.literal(MCP_TOKEN_FAILURE_MODES[5]),
    ]),
  }).strict();

export const McpRefreshTokenOfflineAccessBoundarySchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpRefreshTokenOfflineAccessBoundary"),
    refreshTokenPolicyReviewRequired: trueLiteral,
    offlineAccessPolicyReviewRequired: trueLiteral,
    refreshTokenStorageImplemented: falseLiteral,
    offlineAccessGranted: falseLiteral,
  }).strict();

export const McpTokenStorageRedactionBoundarySchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpTokenStorageRedactionBoundary"),
    tokenStorageContractOnly: trueLiteral,
    tokenStorageImplemented: falseLiteral,
    redactionRequired: trueLiteral,
    rawTokenLoggingAllowed: falseLiteral,
    tokenInUiPropsAllowed: falseLiteral,
    tokenInMetadataAllowed: falseLiteral,
  }).strict();

export const McpTokenRevocationRotationBoundarySchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpTokenRevocationRotationBoundary"),
    revocationPolicyRequired: trueLiteral,
    rotationPolicyRequired: trueLiteral,
    replayProtectionRequired: trueLiteral,
    revocationImplemented: falseLiteral,
    rotationImplemented: falseLiteral,
    replayProtectionImplemented: falseLiteral,
  }).strict();

export const McpNoTokenLeakageBoundarySchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpNoTokenLeakageBoundary"),
    tokenValuesForbiddenEverywhere: trueLiteral,
    forbiddenSurfaces: z.tuple([
      z.literal(MCP_TOKEN_LEAKAGE_SURFACES[0]),
      z.literal(MCP_TOKEN_LEAKAGE_SURFACES[1]),
      z.literal(MCP_TOKEN_LEAKAGE_SURFACES[2]),
      z.literal(MCP_TOKEN_LEAKAGE_SURFACES[3]),
      z.literal(MCP_TOKEN_LEAKAGE_SURFACES[4]),
      z.literal(MCP_TOKEN_LEAKAGE_SURFACES[5]),
      z.literal(MCP_TOKEN_LEAKAGE_SURFACES[6]),
    ]),
  }).strict();

export const McpPublicExposureBlockedBoundarySchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpPublicExposureBlockedBoundary"),
    publicExposureBlocked: trueLiteral,
    localRouteExposeableAsIs: falseLiteral,
    remotePublicAccessAllowed: falseLiteral,
    routeBehaviorChangeAllowed: falseLiteral,
  }).strict();

export const McpNoRealFinanceDataBoundarySchema =
  BaseSecurityContractSchema.extend({
    contractKind: z.literal("McpNoRealFinanceDataBoundary"),
    noRealFinanceData: trueLiteral,
    noPublicDemoData: trueLiteral,
    noRawDumps: trueLiteral,
    noSourcePacks: trueLiteral,
    noPrivateFinanceDataExposure: trueLiteral,
  }).strict();
