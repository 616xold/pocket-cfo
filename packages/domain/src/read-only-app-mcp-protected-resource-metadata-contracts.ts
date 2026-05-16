import { z } from "zod";
import {
  MCP_PUBLIC_MCP_ENDPOINT_PATH,
  MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS,
} from "./read-only-app-mcp-remote-host-resource-contracts";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const MCP_PROTECTED_RESOURCE_METADATA_SCHEMA_VERSION =
  "v2al.read-only-app-mcp-protected-resource-metadata.v1";

export const FP0118_PROTECTED_RESOURCE_METADATA_PLAN_PATH =
  "plans/FP-0118-read-only-chatgpt-app-mcp-protected-resource-metadata-auth-challenge-readiness-contracts.md";

export const FP0119_PROTECTED_RESOURCE_METADATA_ROUTE_SEQUENCING_PLAN_PATH =
  "plans/FP-0119-read-only-chatgpt-app-mcp-protected-resource-metadata-route-implementation-sequencing-master-plan.md";

export const MCP_PROTECTED_RESOURCE_METADATA_BEARER_METHODS = [
  "header",
] as const;

export const MCP_PROTECTED_RESOURCE_METADATA_FORBIDDEN_BEARER_METHODS = [
  "query",
] as const;

export const MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES = [
  "logs",
  "ui_props",
  "metadata_examples",
  "evidence",
  "structured_tool_results",
  "docs_examples",
  "proof_outputs",
] as const;

export const MCP_SCOPE_CHALLENGE_AUTHORITIES = [
  "www_authenticate_scope_parameter",
] as const;

export const MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES = [
  "missing_token",
  "invalid_token",
  "expired_token",
  "malformed_token",
  "wrong_audience",
  "wrong_scope",
  "wrong_org",
  "revoked_token",
  "replayed_token",
] as const;

export const MCP_REJECTED_PROTECTED_RESOURCE_SCOPE_PATTERNS = [
  "wildcard",
  "write",
  "admin",
  "provider",
  "offline_access",
  "finance_broad",
] as const;

export const McpProtectedResourceMetadataContractKindSchema = z.enum([
  "McpProtectedResourceMetadataProofContract",
  "McpProtectedResourceMetadataDocumentBoundary",
  "McpProtectedResourceCanonicalUriDependencyBoundary",
  "McpProtectedResourceAuthorizationServersBoundary",
  "McpProtectedResourceScopesBoundary",
  "McpProtectedResourceBearerMethodsBoundary",
  "McpWwwAuthenticateChallengeBoundary",
  "McpResourceMetadataDiscoveryBoundary",
  "McpScopeChallengeReadinessBoundary",
  "McpTokenFailureChallengeBoundary",
  "McpNoTokenLeakageMetadataBoundary",
  "McpProtectedResourceRouteDeferredBoundary",
  "McpWwwAuthenticateRouteDeferredBoundary",
  "McpProtectedResourceNoRuntimeBoundary",
]);

const BaseProtectedResourceMetadataContractSchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTECTED_RESOURCE_METADATA_SCHEMA_VERSION),
    contractKind: McpProtectedResourceMetadataContractKindSchema,
    localProofOnly: trueLiteral,
    readOnly: trueLiteral,
    implementationAdded: falseLiteral,
  })
  .strict();

export const McpProtectedResourceMetadataProofContractSchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal("McpProtectedResourceMetadataProofContract"),
    contractOnly: trueLiteral,
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
  }).strict();

export const McpProtectedResourceMetadataDocumentBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal("McpProtectedResourceMetadataDocumentBoundary"),
    protectedResourceMetadataRequiredBeforePublicTokenProtectedExposure:
      trueLiteral,
    protectedResourceMetadataRouteImplemented: falseLiteral,
    requiredMetadataFields: z.tuple([
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS[0]),
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS[1]),
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS[2]),
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS[3]),
    ]),
    metadataDocumentExamplesContainTokens: falseLiteral,
  }).strict();

export const McpProtectedResourceCanonicalUriDependencyBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal(
      "McpProtectedResourceCanonicalUriDependencyBoundary",
    ),
    dependsOnFp0116CanonicalPublicResourceUri: trueLiteral,
    canonicalResourceUriImplemented: falseLiteral,
    exactStableHttpsUriRequired: trueLiteral,
    placeholderResourceAllowed: falseLiteral,
    currentLocalRouteUrlAllowed: falseLiteral,
    workspaceTenantTemplateAllowed: falseLiteral,
    queryStringAllowed: falseLiteral,
    fragmentAllowed: falseLiteral,
    companyKeyAuthorityAllowed: falseLiteral,
    requiredPath: z.literal(MCP_PUBLIC_MCP_ENDPOINT_PATH),
  }).strict();

export const McpProtectedResourceAuthorizationServersBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal(
      "McpProtectedResourceAuthorizationServersBoundary",
    ),
    authorizationServersRequiredBeforeImplementation: trueLiteral,
    authorizationServersMustBeNonEmpty: trueLiteral,
    providerSelected: falseLiteral,
    providerNeutral: trueLiteral,
    authorizationServerSelectionStatus: z.literal("unresolved_hold"),
  }).strict();

export const McpProtectedResourceScopesBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal("McpProtectedResourceScopesBoundary"),
    scopesSupportedRequired: trueLiteral,
    leastPrivilegeRequired: trueLiteral,
    readOnlyOnly: trueLiteral,
    wildcardScopesAllowed: falseLiteral,
    writeScopesAllowed: falseLiteral,
    adminScopesAllowed: falseLiteral,
    providerScopesAllowed: falseLiteral,
    offlineAccessAllowed: falseLiteral,
  }).strict();

export const McpProtectedResourceBearerMethodsBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal("McpProtectedResourceBearerMethodsBoundary"),
    bearerMethodsSupportedRequired: trueLiteral,
    requiredBearerMethods: z.tuple([
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_BEARER_METHODS[0]),
    ]),
    queryStringBearerTokensAllowed: falseLiteral,
    forbiddenBearerMethods: z.tuple([
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_FORBIDDEN_BEARER_METHODS[0]),
    ]),
  }).strict();

export const McpWwwAuthenticateChallengeBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal("McpWwwAuthenticateChallengeBoundary"),
    challengeMustIncludeResourceMetadata: trueLiteral,
    scopeGuidanceMayBeIncluded: trueLiteral,
    challengeRouteBehaviorImplemented: falseLiteral,
    missingInvalidTokenChallengeFutureOnly: trueLiteral,
  }).strict();

export const McpResourceMetadataDiscoveryBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal("McpResourceMetadataDiscoveryBoundary"),
    wwwAuthenticateResourceMetadataDiscoveryRequired: trueLiteral,
    wellKnownDiscoveryFutureOnly: trueLiteral,
    authorizationServerDiscoveryRequired: trueLiteral,
    protectedResourceMetadataRouteFutureOnly: trueLiteral,
  }).strict();

export const McpScopeChallengeReadinessBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal("McpScopeChallengeReadinessBoundary"),
    challengedScopesAuthoritativeForCurrentRequest: trueLiteral,
    scopesSupportedNotAssumedAuthoritativeForChallenge: trueLiteral,
    authoritativeSources: z.tuple([
      z.literal(MCP_SCOPE_CHALLENGE_AUTHORITIES[0]),
    ]),
    challengeImplementationFutureOnly: trueLiteral,
  }).strict();

export const McpTokenFailureChallengeBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal("McpTokenFailureChallengeBoundary"),
    failureModes: z.tuple([
      z.literal(MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES[0]),
      z.literal(MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES[1]),
      z.literal(MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES[2]),
      z.literal(MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES[3]),
      z.literal(MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES[4]),
      z.literal(MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES[5]),
      z.literal(MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES[6]),
      z.literal(MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES[7]),
      z.literal(MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES[8]),
    ]),
    tokenFailureChallengeContractOnly: trueLiteral,
    tokenFailureChallengeImplementationFutureOnly: trueLiteral,
    tokenFailureMustNotDiscloseFinanceData: trueLiteral,
  }).strict();

export const McpNoTokenLeakageMetadataBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal("McpNoTokenLeakageMetadataBoundary"),
    tokenValuesAllowedInMetadataExamples: falseLiteral,
    forbiddenSurfaces: z.tuple([
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES[0]),
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES[1]),
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES[2]),
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES[3]),
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES[4]),
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES[5]),
      z.literal(MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES[6]),
    ]),
  }).strict();

export const McpProtectedResourceRouteDeferredBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal("McpProtectedResourceRouteDeferredBoundary"),
    protectedResourceMetadataRouteImplemented: falseLiteral,
    protectedResourceMetadataRoutePathAdded: falseLiteral,
    routeBehaviorChangeAllowedNow: falseLiteral,
    newRoutePathAllowedNow: falseLiteral,
  }).strict();

export const McpWwwAuthenticateRouteDeferredBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal("McpWwwAuthenticateRouteDeferredBoundary"),
    wwwAuthenticateRouteBehaviorImplemented: falseLiteral,
    routeBehaviorChangeAllowedNow: falseLiteral,
    missingInvalidTokenRuntimeChallengeImplemented: falseLiteral,
  }).strict();

export const McpProtectedResourceNoRuntimeBoundarySchema =
  BaseProtectedResourceMetadataContractSchema.extend({
    contractKind: z.literal("McpProtectedResourceNoRuntimeBoundary"),
    noProtectedResourceMetadataRuntime: trueLiteral,
    noWwwAuthenticateRuntime: trueLiteral,
    noOauthTokenSessionAuthMiddleware: trueLiteral,
    noRemoteRuntime: trueLiteral,
    noAppsSdkResourceRuntime: trueLiteral,
    noDbRuntime: trueLiteral,
  }).strict();

export const McpProtectedResourceMetadataDocumentSchema = z
  .object({
    resource: z.string(),
    authorization_servers: z.array(z.string()).min(1),
    scopes_supported: z.array(z.string()).min(1),
    bearer_methods_supported: z.array(z.enum(["header", "body", "query"])),
  })
  .strict();

export type McpProtectedResourceMetadataDocument = z.infer<
  typeof McpProtectedResourceMetadataDocumentSchema
>;
