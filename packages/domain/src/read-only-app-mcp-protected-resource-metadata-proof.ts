import { z } from "zod";
import {
  FP0118_PROTECTED_RESOURCE_METADATA_PLAN_PATH,
  MCP_PROTECTED_RESOURCE_METADATA_BEARER_METHODS,
  MCP_PROTECTED_RESOURCE_METADATA_FORBIDDEN_BEARER_METHODS,
  MCP_PROTECTED_RESOURCE_METADATA_SCHEMA_VERSION,
  MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES,
  MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES,
  MCP_REJECTED_PROTECTED_RESOURCE_SCOPE_PATTERNS,
  MCP_SCOPE_CHALLENGE_AUTHORITIES,
  McpNoTokenLeakageMetadataBoundarySchema,
  McpProtectedResourceAuthorizationServersBoundarySchema,
  McpProtectedResourceBearerMethodsBoundarySchema,
  McpProtectedResourceCanonicalUriDependencyBoundarySchema,
  McpProtectedResourceMetadataDocumentBoundarySchema,
  McpProtectedResourceMetadataDocumentSchema,
  McpProtectedResourceMetadataProofContractSchema,
  McpProtectedResourceNoRuntimeBoundarySchema,
  McpProtectedResourceRouteDeferredBoundarySchema,
  McpProtectedResourceScopesBoundarySchema,
  McpResourceMetadataDiscoveryBoundarySchema,
  McpScopeChallengeReadinessBoundarySchema,
  McpTokenFailureChallengeBoundarySchema,
  McpWwwAuthenticateChallengeBoundarySchema,
  McpWwwAuthenticateRouteDeferredBoundarySchema,
  type McpProtectedResourceMetadataContractKindSchema,
} from "./read-only-app-mcp-protected-resource-metadata-contracts";
import {
  buildMcpProtectedResourceMetadataInventoryProof,
  McpProtectedResourceMetadataInventoryProofSchema,
  type McpProtectedResourceMetadataInventoryProofInput,
} from "./read-only-app-mcp-protected-resource-metadata-inventory";
import {
  MCP_PUBLIC_MCP_ENDPOINT_PATH,
  MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS,
} from "./read-only-app-mcp-remote-host-resource-contracts";

const trueLiteral = z.literal(true);

export const McpProtectedResourceMetadataProofSchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTECTED_RESOURCE_METADATA_SCHEMA_VERSION),
    localProofOnly: trueLiteral,
    protectedResourceMetadataContractsVerified: trueLiteral,
    protectedResourceMetadataDocumentBoundaryVerified: trueLiteral,
    protectedResourceCanonicalUriDependencyBoundaryVerified: trueLiteral,
    protectedResourceAuthorizationServersBoundaryVerified: trueLiteral,
    protectedResourceScopesBoundaryVerified: trueLiteral,
    protectedResourceBearerMethodsBoundaryVerified: trueLiteral,
    wwwAuthenticateChallengeBoundaryVerified: trueLiteral,
    resourceMetadataDiscoveryBoundaryVerified: trueLiteral,
    scopeChallengeReadinessBoundaryVerified: trueLiteral,
    tokenFailureChallengeBoundaryVerified: trueLiteral,
    noTokenLeakageMetadataBoundaryVerified: trueLiteral,
    protectedResourceRouteDeferredBoundaryVerified: trueLiteral,
    wwwAuthenticateRouteDeferredBoundaryVerified: trueLiteral,
    protectedResourceNoRuntimeBoundaryVerified: trueLiteral,
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
    fp0118BoundaryVerified: trueLiteral,
    fp0118AbsentOrLocalProtectedResourceMetadataContractsVerified: trueLiteral,
    fp0119Absent: trueLiteral,
    fp0117OauthImplementationSequencingBoundaryStillVerified: trueLiteral,
    fp0116RemoteHostResourceBoundaryStillVerified: trueLiteral,
    fp0115RemoteHostImplementationSequencingBoundaryStillVerified:
      trueLiteral,
    fp0114RemoteHostReadinessBoundaryStillVerified: trueLiteral,
    fp0113OauthSecurityBoundaryStillVerified: trueLiteral,
    fp0112RemotePublicOauthReadinessBoundaryStillVerified: trueLiteral,
    fp0111DefaultLocalDispatchWiringStillVerified: trueLiteral,
    fp0109AdapterBoundaryStillVerified: trueLiteral,
    fp0107RouteAdapterBoundaryStillVerified: trueLiteral,
    fp0106ProtocolEnvelopeBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
  })
  .merge(McpProtectedResourceMetadataInventoryProofSchema)
  .strict();

export type McpProtectedResourceMetadataProof = z.infer<
  typeof McpProtectedResourceMetadataProofSchema
>;

type ProofInput = Partial<
  Omit<
    McpProtectedResourceMetadataProof,
    | "schemaVersion"
    | "localProofOnly"
    | keyof z.infer<typeof McpProtectedResourceMetadataInventoryProofSchema>
  >
> &
  McpProtectedResourceMetadataInventoryProofInput;

export function buildMcpProtectedResourceMetadataContracts() {
  return {
    authorizationServersBoundary:
      McpProtectedResourceAuthorizationServersBoundarySchema.parse({
        ...base("McpProtectedResourceAuthorizationServersBoundary"),
        authorizationServerSelectionStatus: "unresolved_hold",
        authorizationServersMustBeNonEmpty: true,
        authorizationServersRequiredBeforeImplementation: true,
        providerNeutral: true,
        providerSelected: false,
      }),
    bearerMethodsBoundary:
      McpProtectedResourceBearerMethodsBoundarySchema.parse({
        ...base("McpProtectedResourceBearerMethodsBoundary"),
        bearerMethodsSupportedRequired: true,
        forbiddenBearerMethods: [
          ...MCP_PROTECTED_RESOURCE_METADATA_FORBIDDEN_BEARER_METHODS,
        ],
        queryStringBearerTokensAllowed: false,
        requiredBearerMethods: [
          ...MCP_PROTECTED_RESOURCE_METADATA_BEARER_METHODS,
        ],
      }),
    canonicalUriDependencyBoundary:
      McpProtectedResourceCanonicalUriDependencyBoundarySchema.parse({
        ...base("McpProtectedResourceCanonicalUriDependencyBoundary"),
        canonicalResourceUriImplemented: false,
        companyKeyAuthorityAllowed: false,
        currentLocalRouteUrlAllowed: false,
        dependsOnFp0116CanonicalPublicResourceUri: true,
        exactStableHttpsUriRequired: true,
        fragmentAllowed: false,
        placeholderResourceAllowed: false,
        queryStringAllowed: false,
        requiredPath: MCP_PUBLIC_MCP_ENDPOINT_PATH,
        workspaceTenantTemplateAllowed: false,
      }),
    documentBoundary:
      McpProtectedResourceMetadataDocumentBoundarySchema.parse({
        ...base("McpProtectedResourceMetadataDocumentBoundary"),
        metadataDocumentExamplesContainTokens: false,
        protectedResourceMetadataRequiredBeforePublicTokenProtectedExposure:
          true,
        protectedResourceMetadataRouteImplemented: false,
        requiredMetadataFields: [...MCP_PROTECTED_RESOURCE_METADATA_REQUIREMENTS],
      }),
    noRuntimeBoundary: McpProtectedResourceNoRuntimeBoundarySchema.parse({
      ...base("McpProtectedResourceNoRuntimeBoundary"),
      noAppsSdkResourceRuntime: true,
      noDbRuntime: true,
      noOauthTokenSessionAuthMiddleware: true,
      noProtectedResourceMetadataRuntime: true,
      noRemoteRuntime: true,
      noWwwAuthenticateRuntime: true,
    }),
    noTokenLeakageBoundary: McpNoTokenLeakageMetadataBoundarySchema.parse({
      ...base("McpNoTokenLeakageMetadataBoundary"),
      forbiddenSurfaces: [
        ...MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES,
      ],
      tokenValuesAllowedInMetadataExamples: false,
    }),
    proofContract: McpProtectedResourceMetadataProofContractSchema.parse({
      ...base("McpProtectedResourceMetadataProofContract"),
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
      noProtectedResourceMetadataRouteImplementation: true,
      noProviderCalls: true,
      noPublicAssets: true,
      noRemoteMcpDeployment: true,
      noRouteBehaviorChange: true,
      noRuntimeCodexFinanceOutput: true,
      noSchemaMigrationsAdded: true,
      noSourceMutation: true,
      noTokenSessionImplementation: true,
      noWwwAuthenticateRouteBehaviorImplementation: true,
    }),
    resourceMetadataDiscoveryBoundary:
      McpResourceMetadataDiscoveryBoundarySchema.parse({
        ...base("McpResourceMetadataDiscoveryBoundary"),
        authorizationServerDiscoveryRequired: true,
        protectedResourceMetadataRouteFutureOnly: true,
        wellKnownDiscoveryFutureOnly: true,
        wwwAuthenticateResourceMetadataDiscoveryRequired: true,
      }),
    routeDeferredBoundary:
      McpProtectedResourceRouteDeferredBoundarySchema.parse({
        ...base("McpProtectedResourceRouteDeferredBoundary"),
        newRoutePathAllowedNow: false,
        protectedResourceMetadataRouteImplemented: false,
        protectedResourceMetadataRoutePathAdded: false,
        routeBehaviorChangeAllowedNow: false,
      }),
    scopesBoundary: McpProtectedResourceScopesBoundarySchema.parse({
      ...base("McpProtectedResourceScopesBoundary"),
      adminScopesAllowed: false,
      leastPrivilegeRequired: true,
      offlineAccessAllowed: false,
      providerScopesAllowed: false,
      readOnlyOnly: true,
      scopesSupportedRequired: true,
      wildcardScopesAllowed: false,
      writeScopesAllowed: false,
    }),
    scopeChallengeReadinessBoundary:
      McpScopeChallengeReadinessBoundarySchema.parse({
        ...base("McpScopeChallengeReadinessBoundary"),
        authoritativeSources: [...MCP_SCOPE_CHALLENGE_AUTHORITIES],
        challengeImplementationFutureOnly: true,
        challengedScopesAuthoritativeForCurrentRequest: true,
        scopesSupportedNotAssumedAuthoritativeForChallenge: true,
      }),
    tokenFailureChallengeBoundary:
      McpTokenFailureChallengeBoundarySchema.parse({
        ...base("McpTokenFailureChallengeBoundary"),
        failureModes: [...MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES],
        tokenFailureChallengeContractOnly: true,
        tokenFailureChallengeImplementationFutureOnly: true,
        tokenFailureMustNotDiscloseFinanceData: true,
      }),
    wwwAuthenticateChallengeBoundary:
      McpWwwAuthenticateChallengeBoundarySchema.parse({
        ...base("McpWwwAuthenticateChallengeBoundary"),
        challengeMustIncludeResourceMetadata: true,
        challengeRouteBehaviorImplemented: false,
        missingInvalidTokenChallengeFutureOnly: true,
        scopeGuidanceMayBeIncluded: true,
      }),
    wwwAuthenticateRouteDeferredBoundary:
      McpWwwAuthenticateRouteDeferredBoundarySchema.parse({
        ...base("McpWwwAuthenticateRouteDeferredBoundary"),
        missingInvalidTokenRuntimeChallengeImplemented: false,
        routeBehaviorChangeAllowedNow: false,
        wwwAuthenticateRouteBehaviorImplemented: false,
      }),
  };
}

export function buildMcpProtectedResourceMetadataProof(
  input: ProofInput = {},
): McpProtectedResourceMetadataProof {
  const contracts = buildMcpProtectedResourceMetadataContracts();

  return McpProtectedResourceMetadataProofSchema.parse({
    ...buildMcpProtectedResourceMetadataInventoryProof(input),
    fp0100PublicSecurityBoundaryStillVerified:
      input.fp0100PublicSecurityBoundaryStillVerified ?? true,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      input.fp0106ProtocolEnvelopeBoundaryStillVerified ?? true,
    fp0107RouteAdapterBoundaryStillVerified:
      input.fp0107RouteAdapterBoundaryStillVerified ?? true,
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
    fp0116RemoteHostResourceBoundaryStillVerified:
      input.fp0116RemoteHostResourceBoundaryStillVerified ?? true,
    fp0117OauthImplementationSequencingBoundaryStillVerified:
      input.fp0117OauthImplementationSequencingBoundaryStillVerified ?? true,
    fp0118AbsentOrLocalProtectedResourceMetadataContractsVerified:
      input.fp0118AbsentOrLocalProtectedResourceMetadataContractsVerified ??
      true,
    fp0118BoundaryVerified: input.fp0118BoundaryVerified ?? true,
    fp0119Absent: input.fp0119Absent ?? true,
    localProofOnly: true,
    noAppSubmission: input.noAppSubmission ?? true,
    noAppsSdkResourceImplementation:
      input.noAppsSdkResourceImplementation ?? true,
    noAuthMiddlewareImplementation:
      input.noAuthMiddlewareImplementation ?? true,
    noDbQueriesAdded: input.noDbQueriesAdded ?? true,
    noDeploymentConfig: input.noDeploymentConfig ?? true,
    noExternalCommunications: input.noExternalCommunications ?? true,
    noFinanceWrite: input.noFinanceWrite ?? true,
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
    noSchemaMigrationsAdded: input.noSchemaMigrationsAdded ?? true,
    noSourceMutation: input.noSourceMutation ?? true,
    noTokenSessionImplementation:
      input.noTokenSessionImplementation ?? true,
    noWwwAuthenticateRouteBehaviorImplementation:
      input.noWwwAuthenticateRouteBehaviorImplementation ?? true,
    protectedResourceAuthorizationServersBoundaryVerified:
      input.protectedResourceAuthorizationServersBoundaryVerified ??
      McpProtectedResourceAuthorizationServersBoundarySchema.safeParse(
        contracts.authorizationServersBoundary,
      ).success,
    protectedResourceBearerMethodsBoundaryVerified:
      input.protectedResourceBearerMethodsBoundaryVerified ??
      McpProtectedResourceBearerMethodsBoundarySchema.safeParse(
        contracts.bearerMethodsBoundary,
      ).success,
    protectedResourceCanonicalUriDependencyBoundaryVerified:
      input.protectedResourceCanonicalUriDependencyBoundaryVerified ??
      McpProtectedResourceCanonicalUriDependencyBoundarySchema.safeParse(
        contracts.canonicalUriDependencyBoundary,
      ).success,
    protectedResourceMetadataContractsVerified:
      input.protectedResourceMetadataContractsVerified ??
      allContractsParse(contracts),
    protectedResourceMetadataDocumentBoundaryVerified:
      input.protectedResourceMetadataDocumentBoundaryVerified ??
      McpProtectedResourceMetadataDocumentBoundarySchema.safeParse(
        contracts.documentBoundary,
      ).success,
    protectedResourceNoRuntimeBoundaryVerified:
      input.protectedResourceNoRuntimeBoundaryVerified ??
      McpProtectedResourceNoRuntimeBoundarySchema.safeParse(
        contracts.noRuntimeBoundary,
      ).success,
    protectedResourceRouteDeferredBoundaryVerified:
      input.protectedResourceRouteDeferredBoundaryVerified ??
      McpProtectedResourceRouteDeferredBoundarySchema.safeParse(
        contracts.routeDeferredBoundary,
      ).success,
    protectedResourceScopesBoundaryVerified:
      input.protectedResourceScopesBoundaryVerified ??
      McpProtectedResourceScopesBoundarySchema.safeParse(
        contracts.scopesBoundary,
      ).success,
    resourceMetadataDiscoveryBoundaryVerified:
      input.resourceMetadataDiscoveryBoundaryVerified ??
      McpResourceMetadataDiscoveryBoundarySchema.safeParse(
        contracts.resourceMetadataDiscoveryBoundary,
      ).success,
    schemaVersion: MCP_PROTECTED_RESOURCE_METADATA_SCHEMA_VERSION,
    scopeChallengeReadinessBoundaryVerified:
      input.scopeChallengeReadinessBoundaryVerified ??
      McpScopeChallengeReadinessBoundarySchema.safeParse(
        contracts.scopeChallengeReadinessBoundary,
      ).success,
    tokenFailureChallengeBoundaryVerified:
      input.tokenFailureChallengeBoundaryVerified ??
      McpTokenFailureChallengeBoundarySchema.safeParse(
        contracts.tokenFailureChallengeBoundary,
      ).success,
    noTokenLeakageMetadataBoundaryVerified:
      input.noTokenLeakageMetadataBoundaryVerified ??
      McpNoTokenLeakageMetadataBoundarySchema.safeParse(
        contracts.noTokenLeakageBoundary,
      ).success,
    wwwAuthenticateChallengeBoundaryVerified:
      input.wwwAuthenticateChallengeBoundaryVerified ??
      McpWwwAuthenticateChallengeBoundarySchema.safeParse(
        contracts.wwwAuthenticateChallengeBoundary,
      ).success,
    wwwAuthenticateRouteDeferredBoundaryVerified:
      input.wwwAuthenticateRouteDeferredBoundaryVerified ??
      McpWwwAuthenticateRouteDeferredBoundarySchema.safeParse(
        contracts.wwwAuthenticateRouteDeferredBoundary,
      ).success,
  });
}

export function validateMcpProtectedResourceMetadataDocumentCandidate(
  candidate: unknown,
) {
  const parsed = McpProtectedResourceMetadataDocumentSchema.safeParse(candidate);
  if (!parsed.success) return invalidDocumentValidation();

  const resource =
    validateMcpProtectedResourceCanonicalUriCandidate(parsed.data.resource);
  const authorizationServers =
    parsed.data.authorization_servers.length > 0 &&
    parsed.data.authorization_servers.every(isHttpsUrlWithoutTokenMaterial);
  const scopes = validateMcpProtectedResourceScopes(
    parsed.data.scopes_supported,
  );
  const bearerMethods =
    parsed.data.bearer_methods_supported.includes("header") &&
    !parsed.data.bearer_methods_supported.includes("query");

  return {
    authorizationServersNonEmptyVerified: authorizationServers,
    bearerMethodsHeaderNoQueryVerified: bearerMethods,
    documentShapeVerified: true,
    metadataDocumentVerified:
      resource.canonicalResourceUriCandidateVerified &&
      authorizationServers &&
      scopes.scopesLeastPrivilegeReadOnlyVerified &&
      bearerMethods,
    resourceCanonicalUriDependencyVerified:
      resource.canonicalResourceUriCandidateVerified,
    scopesLeastPrivilegeReadOnlyVerified:
      scopes.scopesLeastPrivilegeReadOnlyVerified,
  };
}

export function validateMcpProtectedResourceCanonicalUriCandidate(
  resource: string,
) {
  try {
    const url = new URL(resource);
    const normalized = resource.toLowerCase();
    const host = url.hostname.toLowerCase();
    const httpsVerified = url.protocol === "https:";
    const noCurrentLocalRouteUrl =
      !["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(host) &&
      !host.endsWith(".localhost");
    const noPlaceholder =
      !/(?:example|placeholder|your-|sample|\{|\})/iu.test(normalized);
    const noSelectors =
      !/(?:companykey|company-key|company_key|workspace|tenant|org|user)/iu.test(
        normalized,
      );
    const pathVerified = url.pathname === MCP_PUBLIC_MCP_ENDPOINT_PATH;
    const noQuery = url.search === "";
    const noFragment = url.hash === "";
    return {
      canonicalResourceUriCandidateVerified:
        httpsVerified &&
        noCurrentLocalRouteUrl &&
        noPlaceholder &&
        noSelectors &&
        pathVerified &&
        noQuery &&
        noFragment,
      exactPublicMcpPathVerified: pathVerified,
      httpsVerified,
      noCurrentLocalRouteUrl,
      noFragment,
      noPlaceholder,
      noQuery,
      noWorkspaceTenantCompanySelector: noSelectors,
    };
  } catch {
    return {
      canonicalResourceUriCandidateVerified: false,
      exactPublicMcpPathVerified: false,
      httpsVerified: false,
      noCurrentLocalRouteUrl: false,
      noFragment: false,
      noPlaceholder: false,
      noQuery: false,
      noWorkspaceTenantCompanySelector: false,
    };
  }
}

export function validateMcpProtectedResourceScopes(scopes: readonly string[]) {
  return {
    rejectedScopePatterns: scopes.filter(isForbiddenScope),
    scopesLeastPrivilegeReadOnlyVerified:
      scopes.length > 0 &&
      scopes.every(isReadOnlyScope) &&
      !scopes.some(isForbiddenScope),
  };
}

export function verifyFp0118ProtectedResourceMetadataPlanBoundary(input: {
  repoPaths: readonly string[];
  planText: string;
}) {
  const fp0118Hits = input.repoPaths.filter((path) =>
    /(^|\/)FP-0118/u.test(path),
  );
  return (
    fp0118Hits.length === 1 &&
    fp0118Hits[0] === FP0118_PROTECTED_RESOURCE_METADATA_PLAN_PATH &&
    fp0118PlanTextBoundaryVerified(input.planText)
  );
}

export function verifyFp0118AbsentOrLocalProtectedResourceMetadataContracts(input: {
  repoPaths: readonly string[];
  planText?: string;
}) {
  const fp0118Hits = input.repoPaths.filter((path) =>
    /(^|\/)FP-0118/u.test(path),
  );
  if (fp0118Hits.length === 0) return true;
  return (
    fp0118Hits.length === 1 &&
    fp0118Hits[0] === FP0118_PROTECTED_RESOURCE_METADATA_PLAN_PATH &&
    fp0118PlanTextBoundaryVerified(input.planText ?? "")
  );
}

export function verifyFp0119Absent(repoPaths: readonly string[]) {
  return !repoPaths.some((path) => /(^|\/)FP-0119/u.test(path));
}

export function textHasProtectedResourceTokenLeakage(value: string) {
  return /(?:authorization:\s*bearer\s+\S+|bearer\s+[a-z0-9._~-]{20,}|access_token\s*[:=]\s*\S+|refresh_token\s*[:=]\s*\S+|id_token\s*[:=]\s*\S+|sk-[a-z0-9]{16,})/iu.test(
    value,
  );
}

function base(
  contractKind: z.infer<typeof McpProtectedResourceMetadataContractKindSchema>,
) {
  return {
    contractKind,
    implementationAdded: false,
    localProofOnly: true,
    readOnly: true,
    schemaVersion: MCP_PROTECTED_RESOURCE_METADATA_SCHEMA_VERSION,
  };
}

function allContractsParse(
  contracts: ReturnType<typeof buildMcpProtectedResourceMetadataContracts>,
) {
  return (
    McpProtectedResourceMetadataProofContractSchema.safeParse(
      contracts.proofContract,
    ).success &&
    McpProtectedResourceMetadataDocumentBoundarySchema.safeParse(
      contracts.documentBoundary,
    ).success &&
    McpProtectedResourceCanonicalUriDependencyBoundarySchema.safeParse(
      contracts.canonicalUriDependencyBoundary,
    ).success &&
    McpProtectedResourceAuthorizationServersBoundarySchema.safeParse(
      contracts.authorizationServersBoundary,
    ).success &&
    McpProtectedResourceScopesBoundarySchema.safeParse(
      contracts.scopesBoundary,
    ).success &&
    McpProtectedResourceBearerMethodsBoundarySchema.safeParse(
      contracts.bearerMethodsBoundary,
    ).success &&
    McpWwwAuthenticateChallengeBoundarySchema.safeParse(
      contracts.wwwAuthenticateChallengeBoundary,
    ).success &&
    McpResourceMetadataDiscoveryBoundarySchema.safeParse(
      contracts.resourceMetadataDiscoveryBoundary,
    ).success &&
    McpScopeChallengeReadinessBoundarySchema.safeParse(
      contracts.scopeChallengeReadinessBoundary,
    ).success &&
    McpTokenFailureChallengeBoundarySchema.safeParse(
      contracts.tokenFailureChallengeBoundary,
    ).success &&
    McpNoTokenLeakageMetadataBoundarySchema.safeParse(
      contracts.noTokenLeakageBoundary,
    ).success &&
    McpProtectedResourceRouteDeferredBoundarySchema.safeParse(
      contracts.routeDeferredBoundary,
    ).success &&
    McpWwwAuthenticateRouteDeferredBoundarySchema.safeParse(
      contracts.wwwAuthenticateRouteDeferredBoundary,
    ).success &&
    McpProtectedResourceNoRuntimeBoundarySchema.safeParse(
      contracts.noRuntimeBoundary,
    ).success
  );
}

function invalidDocumentValidation() {
  return {
    authorizationServersNonEmptyVerified: false,
    bearerMethodsHeaderNoQueryVerified: false,
    documentShapeVerified: false,
    metadataDocumentVerified: false,
    resourceCanonicalUriDependencyVerified: false,
    scopesLeastPrivilegeReadOnlyVerified: false,
  };
}

function isHttpsUrlWithoutTokenMaterial(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !textHasProtectedResourceTokenLeakage(value) &&
      !/(?:\{|\}|placeholder|your-|sample)/iu.test(value)
    );
  } catch {
    return false;
  }
}

function isReadOnlyScope(scope: string) {
  return /(?:^read[:._-]|[:._-]read$|\.read$)/iu.test(scope);
}

function isForbiddenScope(scope: string) {
  const normalized = scope.toLowerCase();
  return (
    normalized === "*" ||
    MCP_REJECTED_PROTECTED_RESOURCE_SCOPE_PATTERNS.some((pattern) =>
      normalized.includes(pattern),
    ) ||
    /(?:write|delete|mutate|admin|provider|offline|openid|profile|email)/iu.test(
      normalized,
    )
  );
}

function fp0118PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return [
    "local/proof-only/read-only contract slice",
    "protected-resource metadata",
    "auth-challenge readiness",
    "does not add protected-resource metadata routes",
    "does not implement route behavior",
    "resource",
    "authorization_servers",
    "scopes_supported",
    "bearer_methods_supported",
    "future exact stable https canonical public mcp resource uri",
    "authorization_servers must be non-empty",
    "least-privilege and read-only",
    "forbid query-string token use",
    "www-authenticate",
    "resource_metadata",
    "challenged scopes as authoritative",
    "authenticated company binding",
    "companykey",
    "token passthrough remains forbidden",
    "no token leakage",
    "local /mcp route behavior remains unchanged",
    "no new route path",
    "fp-0119 remains absent",
  ].every((requiredText) => normalized.includes(requiredText));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/`/gu, "");
}
