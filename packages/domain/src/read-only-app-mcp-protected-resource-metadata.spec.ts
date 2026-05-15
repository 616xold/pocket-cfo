import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0118_PROTECTED_RESOURCE_METADATA_PLAN_PATH,
  MCP_PROTECTED_RESOURCE_METADATA_BEARER_METHODS,
  MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES,
  MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES,
  McpNoTokenLeakageMetadataBoundarySchema,
  McpProtectedResourceAuthorizationServersBoundarySchema,
  McpProtectedResourceBearerMethodsBoundarySchema,
  McpProtectedResourceCanonicalUriDependencyBoundarySchema,
  McpProtectedResourceMetadataDocumentBoundarySchema,
  McpProtectedResourceMetadataProofSchema,
  McpProtectedResourceNoRuntimeBoundarySchema,
  McpProtectedResourceRouteDeferredBoundarySchema,
  McpProtectedResourceScopesBoundarySchema,
  McpScopeChallengeReadinessBoundarySchema,
  McpTokenFailureChallengeBoundarySchema,
  McpWwwAuthenticateChallengeBoundarySchema,
  McpWwwAuthenticateRouteDeferredBoundarySchema,
  buildMcpProtectedResourceMetadataContracts,
  buildMcpProtectedResourceMetadataProof,
  isFp0118ProtectedResourceMetadataNoOpenAiProofSourcePath,
  textHasProtectedResourceTokenLeakage,
  validateMcpProtectedResourceCanonicalUriCandidate,
  validateMcpProtectedResourceMetadataDocumentCandidate,
  validateMcpProtectedResourceScopes,
  verifyFp0118AbsentOrLocalProtectedResourceMetadataContracts,
  verifyFp0118ProtectedResourceMetadataPlanBoundary,
  verifyFp0119Absent,
  verifyMcpProtectedResourceMetadataNoOpenAiApiSourceScan,
  verifyMcpProtectedResourceMetadataRepositoryInventory,
} from "./read-only-app-mcp-protected-resource-metadata";
import {
  FP0117_OAUTH_IMPLEMENTATION_SEQUENCING_PLAN_PATH,
  verifyFp0117AbsentOrDocsOnlyOauthImplementationSequencingPlan,
  verifyFp0117OauthImplementationSequencingPlanBoundary,
} from "./read-only-app-mcp-remote-host-resource";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));

function verified(value: boolean): true {
  expect(value).toBe(true);
  return true;
}

describe("FP-0118 protected-resource metadata auth challenge readiness contracts", () => {
  it("accepts exactly one FP-0118 path while FP-0119 remains absent", () => {
    const repoPaths = repoFilePaths();
    const fp0118Hits = repoPaths.filter((path) => /(^|\/)FP-0118/u.test(path));
    const fp0119Hits = repoPaths.filter((path) => /(^|\/)FP-0119/u.test(path));
    const planText = safeRead(FP0118_PROTECTED_RESOURCE_METADATA_PLAN_PATH);
    const proof = buildMcpProtectedResourceMetadataProof({
      fp0118AbsentOrLocalProtectedResourceMetadataContractsVerified:
        verified(
          verifyFp0118AbsentOrLocalProtectedResourceMetadataContracts({
            planText,
            repoPaths,
          }),
        ),
      fp0118BoundaryVerified: verified(
        verifyFp0118ProtectedResourceMetadataPlanBoundary({
          planText,
          repoPaths,
        }),
      ),
      fp0119Absent: verified(verifyFp0119Absent(repoPaths)),
    });

    expect(fp0118Hits).toEqual([
      FP0118_PROTECTED_RESOURCE_METADATA_PLAN_PATH,
    ]);
    expect(fp0119Hits).toEqual([]);
    expect(proof.fp0118BoundaryVerified).toBe(true);
    expect(
      proof.fp0118AbsentOrLocalProtectedResourceMetadataContractsVerified,
    ).toBe(true);
    expect(proof.fp0119Absent).toBe(true);
    expect(
      McpProtectedResourceMetadataProofSchema.safeParse({
        ...proof,
        fp0119Absent: false,
      }).success,
    ).toBe(false);
  });

  it("keeps FP-0118 local/proof-only and rejects route/runtime implementation scope", () => {
    const contracts = buildMcpProtectedResourceMetadataContracts();
    const proof = buildMcpProtectedResourceMetadataProof();

    expect(McpProtectedResourceMetadataProofSchema.safeParse(proof).success).toBe(
      true,
    );
    expect(proof.localProofOnly).toBe(true);
    expect(proof.noRouteBehaviorChange).toBe(true);
    expect(proof.noNewRoutePath).toBe(true);
    expect(proof.noProtectedResourceMetadataRouteImplementation).toBe(true);
    expect(proof.noWwwAuthenticateRouteBehaviorImplementation).toBe(true);
    expect(proof.noOauthImplementation).toBe(true);
    expect(proof.noTokenSessionImplementation).toBe(true);
    expect(proof.noAuthMiddlewareImplementation).toBe(true);
    expect(proof.noRemoteMcpDeployment).toBe(true);
    expect(proof.noDeploymentConfig).toBe(true);
    expect(proof.noAppsSdkResourceImplementation).toBe(true);
    expect(proof.noAppSubmission).toBe(true);
    expect(proof.noDbQueriesAdded).toBe(true);
    expect(proof.noSchemaMigrationsAdded).toBe(true);
    expect(proof.noPackageScriptsAdded).toBe(true);
    expect(proof.noPublicAssets).toBe(true);
    expect(proof.noListingCopy).toBe(true);
    expect(proof.noGeneratedPublicProse).toBe(true);
    expect(proof.noOpenAiApiCalls).toBe(true);
    expect(proof.noModelCalls).toBe(true);
    expect(proof.noOpenAiClientOrKeyUsage).toBe(true);
    expect(proof.noProviderCalls).toBe(true);
    expect(proof.noExternalCommunications).toBe(true);
    expect(proof.noSourceMutation).toBe(true);
    expect(proof.noFinanceWrite).toBe(true);
    expect(
      McpProtectedResourceNoRuntimeBoundarySchema.safeParse(
        contracts.noRuntimeBoundary,
      ).success,
    ).toBe(true);
  });

  it("requires the protected-resource metadata document fields and canonical public resource URI dependency", () => {
    const contracts = buildMcpProtectedResourceMetadataContracts();
    const validDocument = {
      authorization_servers: ["https://auth.pocket-cfo.test"],
      bearer_methods_supported: ["header"],
      resource: "https://mcp.pocket-cfo.test/mcp",
      scopes_supported: ["pocket-cfo:evidence.read"],
    };

    expect(
      McpProtectedResourceMetadataDocumentBoundarySchema.safeParse(
        contracts.documentBoundary,
      ).success,
    ).toBe(true);
    expect(contracts.documentBoundary.requiredMetadataFields).toEqual([
      "resource",
      "authorization_servers",
      "scopes_supported",
      "bearer_methods_supported",
    ]);
    expect(
      validateMcpProtectedResourceMetadataDocumentCandidate(validDocument)
        .metadataDocumentVerified,
    ).toBe(true);
    expect(
      validateMcpProtectedResourceMetadataDocumentCandidate({
        ...validDocument,
        bearer_methods_supported: ["header", "query"],
      }).bearerMethodsHeaderNoQueryVerified,
    ).toBe(false);
    expect(
      validateMcpProtectedResourceMetadataDocumentCandidate({
        ...validDocument,
        authorization_servers: [],
      }).authorizationServersNonEmptyVerified,
    ).toBe(false);
    expect(
      validateMcpProtectedResourceMetadataDocumentCandidate({
        ...validDocument,
        resource: "http://127.0.0.1:3000/mcp",
      }).resourceCanonicalUriDependencyVerified,
    ).toBe(false);
  });

  it("rejects placeholder, local, selector, query, fragment, and non-/mcp resource URI candidates", () => {
    expect(
      validateMcpProtectedResourceCanonicalUriCandidate(
        "https://mcp.pocket-cfo.test/mcp",
      ).canonicalResourceUriCandidateVerified,
    ).toBe(true);

    for (const resource of [
      "https://example.com/mcp",
      "http://mcp.pocket-cfo.test/mcp",
      "https://localhost:3000/mcp",
      "https://mcp.pocket-cfo.test/mcp?companyKey=acme",
      "https://mcp.pocket-cfo.test/mcp#fragment",
      "https://mcp.pocket-cfo.test/{tenant}/mcp",
      "https://mcp.pocket-cfo.test/other",
    ]) {
      expect(
        validateMcpProtectedResourceCanonicalUriCandidate(resource)
          .canonicalResourceUriCandidateVerified,
      ).toBe(false);
    }

    expect(
      McpProtectedResourceCanonicalUriDependencyBoundarySchema.safeParse({
        ...buildMcpProtectedResourceMetadataContracts()
          .canonicalUriDependencyBoundary,
        placeholderResourceAllowed: true,
      }).success,
    ).toBe(false);
  });

  it("keeps authorization server selection unresolved but required before implementation", () => {
    const contracts = buildMcpProtectedResourceMetadataContracts();

    expect(
      contracts.authorizationServersBoundary.authorizationServersMustBeNonEmpty,
    ).toBe(true);
    expect(contracts.authorizationServersBoundary.providerSelected).toBe(false);
    expect(
      contracts.authorizationServersBoundary.authorizationServerSelectionStatus,
    ).toBe("unresolved_hold");
    expect(
      McpProtectedResourceAuthorizationServersBoundarySchema.safeParse({
        ...contracts.authorizationServersBoundary,
        providerSelected: true,
      }).success,
    ).toBe(false);
  });

  it("requires least-privilege read-only scopes and treats challenged scopes as authoritative", () => {
    const contracts = buildMcpProtectedResourceMetadataContracts();

    expect(validateMcpProtectedResourceScopes(["evidence:read"])).toMatchObject(
      {
        rejectedScopePatterns: [],
        scopesLeastPrivilegeReadOnlyVerified: true,
      },
    );
    for (const scopes of [
      ["*"],
      ["finance:write"],
      ["provider:read"],
      ["admin:read"],
      ["offline_access"],
      ["finance"],
    ]) {
      expect(
        validateMcpProtectedResourceScopes(scopes)
          .scopesLeastPrivilegeReadOnlyVerified,
      ).toBe(false);
    }
    expect(
      McpProtectedResourceScopesBoundarySchema.safeParse(
        contracts.scopesBoundary,
      ).success,
    ).toBe(true);
    expect(
      McpScopeChallengeReadinessBoundarySchema.safeParse(
        contracts.scopeChallengeReadinessBoundary,
      ).success,
    ).toBe(true);
    expect(
      contracts.scopeChallengeReadinessBoundary
        .challengedScopesAuthoritativeForCurrentRequest,
    ).toBe(true);
    expect(
      contracts.scopeChallengeReadinessBoundary
        .scopesSupportedNotAssumedAuthoritativeForChallenge,
    ).toBe(true);
  });

  it("requires header bearer method posture and rejects query-string token usage", () => {
    const contracts = buildMcpProtectedResourceMetadataContracts();

    expect(contracts.bearerMethodsBoundary.requiredBearerMethods).toEqual([
      ...MCP_PROTECTED_RESOURCE_METADATA_BEARER_METHODS,
    ]);
    expect(contracts.bearerMethodsBoundary.queryStringBearerTokensAllowed).toBe(
      false,
    );
    expect(
      McpProtectedResourceBearerMethodsBoundarySchema.safeParse({
        ...contracts.bearerMethodsBoundary,
        queryStringBearerTokensAllowed: true,
      }).success,
    ).toBe(false);
  });

  it("keeps WWW-Authenticate, discovery, and token-failure challenge behavior contract-only", () => {
    const contracts = buildMcpProtectedResourceMetadataContracts();

    expect(
      McpWwwAuthenticateChallengeBoundarySchema.safeParse(
        contracts.wwwAuthenticateChallengeBoundary,
      ).success,
    ).toBe(true);
    expect(
      contracts.wwwAuthenticateChallengeBoundary
        .challengeMustIncludeResourceMetadata,
    ).toBe(true);
    expect(
      contracts.wwwAuthenticateChallengeBoundary
        .challengeRouteBehaviorImplemented,
    ).toBe(false);
    expect(
      McpTokenFailureChallengeBoundarySchema.safeParse(
        contracts.tokenFailureChallengeBoundary,
      ).success,
    ).toBe(true);
    expect(contracts.tokenFailureChallengeBoundary.failureModes).toEqual([
      ...MCP_PROTECTED_RESOURCE_TOKEN_FAILURE_MODES,
    ]);
    expect(
      McpTokenFailureChallengeBoundarySchema.safeParse({
        ...contracts.tokenFailureChallengeBoundary,
        tokenFailureChallengeImplementationFutureOnly: false,
      }).success,
    ).toBe(false);
  });

  it("covers no-token-leakage surfaces for metadata, evidence, docs, and proof output", () => {
    const contracts = buildMcpProtectedResourceMetadataContracts();

    expect(contracts.noTokenLeakageBoundary.forbiddenSurfaces).toEqual([
      ...MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES,
    ]);
    expect(
      McpNoTokenLeakageMetadataBoundarySchema.safeParse({
        ...contracts.noTokenLeakageBoundary,
        forbiddenSurfaces: MCP_PROTECTED_RESOURCE_METADATA_TOKEN_LEAKAGE_SURFACES.slice(
          1,
        ),
      }).success,
    ).toBe(false);
    expect(textHasProtectedResourceTokenLeakage("Bearer abc.def.ghi")).toBe(
      false,
    );
    expect(
      textHasProtectedResourceTokenLeakage(
        `Authorization: Bearer ${"x".repeat(24)}`,
      ),
    ).toBe(true);
  });

  it("proves local route posture and repository inventory remain unchanged", () => {
    const inventory = verifyMcpProtectedResourceMetadataRepositoryInventory({
      repoPaths: repoFilePaths(),
      routeSourceText: safeRead(
        "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts",
      ),
    });
    const contracts = buildMcpProtectedResourceMetadataContracts();

    expect(inventory.protectedResourceRouteRepositoryInventoryVerified).toBe(
      true,
    );
    expect(inventory.wwwAuthenticateRouteRepositoryInventoryVerified).toBe(
      true,
    );
    expect(inventory.oauthRuntimeRepositoryInventoryVerified).toBe(true);
    expect(inventory.tokenSessionRepositoryInventoryVerified).toBe(true);
    expect(inventory.authMiddlewareRepositoryInventoryVerified).toBe(true);
    expect(inventory.remoteMcpDeploymentRepositoryInventoryVerified).toBe(true);
    expect(
      McpProtectedResourceRouteDeferredBoundarySchema.safeParse(
        contracts.routeDeferredBoundary,
      ).success,
    ).toBe(true);
    expect(
      McpWwwAuthenticateRouteDeferredBoundarySchema.safeParse(
        contracts.wwwAuthenticateRouteDeferredBoundary,
      ).success,
    ).toBe(true);
  });

  it("rejects simulated protected-resource metadata routes, WWW-Authenticate route behavior, OAuth, token/session, and auth middleware", () => {
    expect(
      verifyMcpProtectedResourceMetadataRepositoryInventory({
        repoPaths: [
          "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata.ts",
        ],
      }).protectedResourceRouteRepositoryInventoryVerified,
    ).toBe(false);
    expect(
      verifyMcpProtectedResourceMetadataRepositoryInventory({
        repoPaths: [
          "apps/control-plane/src/modules/read-only-app-mcp-endpoint/www-authenticate.ts",
        ],
      }).wwwAuthenticateRouteRepositoryInventoryVerified,
    ).toBe(false);
    expect(
      verifyMcpProtectedResourceMetadataRepositoryInventory({
        repoPaths: [
          "apps/control-plane/src/modules/read-only-app-mcp-endpoint/oauth.ts",
          "apps/control-plane/src/modules/read-only-app-mcp-endpoint/token-session-store.ts",
          "apps/control-plane/src/modules/read-only-app-mcp-endpoint/auth-middleware.ts",
        ],
      }),
    ).toMatchObject({
      authMiddlewareRepositoryInventoryVerified: false,
      oauthRuntimeRepositoryInventoryVerified: false,
      tokenSessionRepositoryInventoryVerified: false,
    });
    expect(
      verifyMcpProtectedResourceMetadataRepositoryInventory({
        repoPaths: [],
        routeSourceText:
          'reply.header("WWW-Authenticate", "Bearer resource_metadata=...")',
      }).wwwAuthenticateRouteRepositoryInventoryVerified,
    ).toBe(false);
  });

  it("preserves prior FP-0117, FP-0116, FP-0113, FP-0107, FP-0106, and FP-0100 boundaries", () => {
    const repoPaths = repoFilePaths();
    const fp0117Text = safeRead(FP0117_OAUTH_IMPLEMENTATION_SEQUENCING_PLAN_PATH);
    const proof = buildMcpProtectedResourceMetadataProof({
      fp0100PublicSecurityBoundaryStillVerified: verified(
        docsBoundary(
          "plans/FP-0100-read-only-chatgpt-app-mcp-public-app-security-boundary-contracts-foundation.md",
          ["public-app security boundary", "local/proof-only"],
        ),
      ),
      fp0106ProtocolEnvelopeBoundaryStillVerified: verified(
        docsBoundary(
          "plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md",
          ["protocol envelope", "tools/call"],
        ),
      ),
      fp0107RouteAdapterBoundaryStillVerified: verified(
        docsBoundary(
          "plans/FP-0107-read-only-chatgpt-app-mcp-local-fastify-mcp-route-adapter-foundation.md",
          ["local/control-plane", "post /mcp"],
        ),
      ),
      fp0113OauthSecurityBoundaryStillVerified: verified(
        docsBoundary(
          "plans/FP-0113-read-only-chatgpt-app-mcp-oauth-token-session-security-contracts-foundation.md",
          ["token passthrough is forbidden", "companykey"],
        ),
      ),
      fp0116RemoteHostResourceBoundaryStillVerified: verified(
        docsBoundary(
          "plans/FP-0116-read-only-chatgpt-app-mcp-remote-host-owner-canonical-uri-resource-metadata-contracts.md",
          ["canonical resource uri", "protected-resource metadata"],
        ),
      ),
      fp0117OauthImplementationSequencingBoundaryStillVerified:
        verified(
          verifyFp0117AbsentOrDocsOnlyOauthImplementationSequencingPlan({
            planText: fp0117Text,
            repoPaths,
          }) &&
            verifyFp0117OauthImplementationSequencingPlanBoundary({
              planText: fp0117Text,
              repoPaths,
            }),
        ),
    });

    expect(proof.fp0117OauthImplementationSequencingBoundaryStillVerified).toBe(
      true,
    );
    expect(proof.fp0116RemoteHostResourceBoundaryStillVerified).toBe(true);
    expect(proof.fp0113OauthSecurityBoundaryStillVerified).toBe(true);
    expect(proof.fp0107RouteAdapterBoundaryStillVerified).toBe(true);
    expect(proof.fp0106ProtocolEnvelopeBoundaryStillVerified).toBe(true);
    expect(proof.fp0100PublicSecurityBoundaryStillVerified).toBe(true);
  });

  it("scans FP-0118 proof sources for executable OpenAI/API/model/key usage", () => {
    const sourceText = repoFilePaths()
      .filter(isFp0118ProtectedResourceMetadataNoOpenAiProofSourcePath)
      .map((path) => safeRead(path))
      .join("\n");
    const scan = verifyMcpProtectedResourceMetadataNoOpenAiApiSourceScan({
      sourceText,
    });

    expect(scan.forbiddenExecutableMatches).toEqual([]);
    expect(scan.protectedResourceMetadataNoOpenAiApiSourceScanVerified).toBe(
      true,
    );
  });
});

function repoFilePaths() {
  const paths: string[] = [];
  const visit = (relativeDir: string) => {
    for (const entry of readdirSync(join(repoRoot, relativeDir), {
      withFileTypes: true,
    })) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) visit(relativePath);
      else paths.push(relativePath);
    }
  };
  visit("");
  return paths.sort();
}

function safeRead(relativePath: string) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

function docsBoundary(relativePath: string, requiredText: readonly string[]) {
  const normalized = safeRead(relativePath).toLowerCase().replace(/`/gu, "");
  return requiredText.every((text) => normalized.includes(text));
}
