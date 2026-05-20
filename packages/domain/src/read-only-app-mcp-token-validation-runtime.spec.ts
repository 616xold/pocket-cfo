import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0117_OAUTH_IMPLEMENTATION_SEQUENCING_PLAN_PATH,
  verifyFp0117OauthImplementationSequencingPlanBoundary,
} from "./read-only-app-mcp-remote-host-resource";
import {
  FP0118_PROTECTED_RESOURCE_METADATA_PLAN_PATH,
  FP0122_PROTECTED_RESOURCE_METADATA_BUILDER_PLAN_PATH,
  FP0123_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_PLAN_PATH,
  FP0125_PROTECTED_RESOURCE_METADATA_LOCAL_ROUTE_IMPLEMENTATION_PLAN_PATH,
  verifyFp0118ProtectedResourceMetadataPlanBoundary,
  verifyFp0122ProtectedResourceMetadataBuilderContractsBoundary,
  verifyFp0123ProtectedResourceMetadataRouteInputContractsBoundary,
} from "./read-only-app-mcp-protected-resource-metadata";
import {
  FP0120_CANONICAL_RESOURCE_AUTH_SERVER_PLAN_PATH,
  verifyFp0120CanonicalResourceAuthServerPlanBoundary,
} from "./read-only-app-mcp-canonical-resource";
import {
  FP0127_WWW_AUTHENTICATE_AUTH_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0129_WWW_AUTHENTICATE_CHALLENGE_IMPLEMENTATION_SEQUENCING_PLAN_PATH,
  FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0131_TOKEN_VALIDATION_RUNTIME_SEQUENCING_PLAN_PATH,
  verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary,
  verifyFp0129WwwAuthenticateChallengeImplementationSequencingPlanBoundary,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0131TokenValidationRuntimeSequencingPlanBoundary,
} from "./read-only-app-mcp-www-authenticate";
import {
  FP0128_TOKEN_VALIDATION_READINESS_CONTRACTS_PLAN_PATH,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";
import { verifyFp0128TokenValidationReadinessContractsBoundary } from "./read-only-app-mcp-token-validation-proof";
import {
  FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH,
  MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES,
  MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES,
  MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS,
  McpTokenValidationRuntimeProofSchema,
  buildMcpTokenValidationRuntimeContracts,
  buildMcpTokenValidationRuntimeProof,
  verifyFp0132AbsentOrLocalTokenValidationRuntimeContracts,
  verifyFp0132PlanningTextRequiredTopics,
  verifyFp0132TokenValidationRuntimeContractsBoundary,
  verifyMcpTokenValidationRuntimeNoLeakageExamples,
  verifyMcpTokenValidationRuntimeRequiredContractBoundaries,
  verifyMcpTokenValidationRuntimeResultEnvelopeBoundary,
} from "./read-only-app-mcp-token-validation-runtime";
import { verifyFp0133AbsentOrLocalTokenValidationTestDoubleContracts } from "./read-only-app-mcp-token-validation-test-double";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const mcpRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const metadataRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const fp0107PlanPath =
  "plans/FP-0107-read-only-chatgpt-app-mcp-local-fastify-mcp-route-adapter-foundation.md";
const fp0106PlanPath =
  "plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md";
const fp0100PlanPath =
  "plans/FP-0100-read-only-chatgpt-app-mcp-public-app-security-boundary-contracts-foundation.md";

describe("FP-0132 token-validation runtime contract foundations", () => {
  it("accepts exactly one FP-0132 contract plan while FP-0133 remains absent", () => {
    const repoPaths = repoFilePaths();
    const planText = safeRead(
      FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH,
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0132/u.test(path))).toEqual([
      FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH,
    ]);
    expect(
      verifyFp0132AbsentOrLocalTokenValidationRuntimeContracts({
        planText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0132TokenValidationRuntimeContractsBoundary({
        planText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      Object.values(verifyFp0132PlanningTextRequiredTopics(planText)).every(
        Boolean,
      ),
    ).toBe(true);
    expect(
      verifyFp0133AbsentOrLocalTokenValidationTestDoubleContracts(repoPaths),
    ).toBe(true);
    expect(
      verifyFp0132AbsentOrLocalTokenValidationRuntimeContracts({
        planText,
        repoPaths: [...repoPaths, "plans/FP-0132-token-runtime.md"],
      }),
    ).toBe(false);
    expect(
      verifyFp0132TokenValidationRuntimeContractsBoundary({
        planText,
        repoPaths: [
          ...repoPaths.filter((path) => !/(^|\/)FP-0132/u.test(path)),
          "plans/FP-0132-token-runtime.md",
        ],
      }),
    ).toBe(false);
    expect(
      verifyFp0133AbsentOrLocalTokenValidationTestDoubleContracts([
        ...repoPaths,
        "plans/FP-0133-invalid-token.md",
      ]),
    ).toBe(false);
  });

  it("requires future issuer, audience, resource, scope, temporal, replay, subject, and company checks without runtime implementation", () => {
    const contracts = buildMcpTokenValidationRuntimeContracts();
    const proof = buildMcpTokenValidationRuntimeProof();

    expect(verifyMcpTokenValidationRuntimeRequiredContractBoundaries()).toBe(
      true,
    );
    expect(verifyMcpTokenValidationRuntimeResultEnvelopeBoundary()).toBe(true);
    expect(MCP_TOKEN_VALIDATION_RUNTIME_REQUIRED_CHECKS).toEqual([
      "issuer_validation",
      "audience_resource_validation",
      "canonical_resource_uri_dependency",
      "scope_validation",
      "expiry_validation",
      "not_before_validation",
      "time_skew_validation",
      "revocation_validation",
      "replay_validation",
      "authenticated_subject_binding",
      "authenticated_company_binding",
      "no_token_passthrough",
      "no_token_leakage",
    ]);
    expect(MCP_TOKEN_VALIDATION_RUNTIME_FAILURE_MODES).toEqual([
      "invalid_token",
      "malformed_token",
      "expired_token",
      "not_yet_valid_token",
      "wrong_issuer",
      "wrong_audience",
      "wrong_resource",
      "wrong_scope",
      "wrong_org",
      "wrong_company",
      "revoked_token",
      "replayed_token",
      "token_passthrough_attempt",
    ]);
    expect(
      contracts.authenticatedCompanyBindingBoundary
        .clientCompanyKeySelectorOnly,
    ).toBe(true);
    expect(
      contracts.authenticatedCompanyBindingBoundary
        .clientCompanyKeyAuthorityAllowed,
    ).toBe(false);
    expect(contracts.noTokenPassthroughBoundary.tokenPassthroughForbidden).toBe(
      true,
    );
    expect(
      contracts.tokenValidationRuntimeDeferredBoundary.noTokenParsingRuntime,
    ).toBe(true);
    expect(
      contracts.tokenValidationRuntimeDeferredBoundary.noTokenValidationRuntime,
    ).toBe(true);
    expect(
      contracts.tokenValidationRuntimeDeferredBoundary.noJwtDecodingRuntime,
    ).toBe(true);
    expect(
      contracts.tokenValidationRuntimeDeferredBoundary
        .noAuthMiddlewareImplementation,
    ).toBe(true);
    expect(
      contracts.tokenValidationRuntimeDeferredBoundary.noOauthImplementation,
    ).toBe(true);
    expect(McpTokenValidationRuntimeProofSchema.safeParse(proof).success).toBe(
      true,
    );
    expect(
      McpTokenValidationRuntimeProofSchema.safeParse({
        ...proof,
        noTokenValidationRuntime: false,
      }).success,
    ).toBe(false);
  });

  it("forbids token material in every named leakage surface and proof output", () => {
    const proofText = JSON.stringify(buildMcpTokenValidationRuntimeProof());
    const tokenValue = ["synthetic", "token", "material"].join("-");
    const authorizationValue = ["Bearer", tokenValue].join(" ");
    const jwtLikeValue = [
      "eyJsyntheticHeaderxxxxxxxx",
      "eyJsyntheticPayloadxxxxxxxx",
      "syntheticSignaturexxxxxxxx",
    ].join(".");

    expect(MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES).toEqual([
      "logs",
      "proof_outputs",
      "docs_examples",
      "route_bodies",
      "route_headers",
      "route_responses",
      "metadata",
      "evidence",
      "structured_tool_results",
      "ui_props",
      "app_metadata",
      "challenge_headers",
    ]);
    expect(scanTokenValidationNoLeakage(proofText).accepted).toBe(true);
    expect(verifyMcpTokenValidationRuntimeNoLeakageExamples()).toBe(true);
    for (const surface of MCP_TOKEN_VALIDATION_RUNTIME_NO_LEAKAGE_SURFACES) {
      expect(
        scanTokenValidationNoLeakage(`${surface}: ${authorizationValue}`)
          .accepted,
      ).toBe(false);
    }
    expect(
      scanTokenValidationNoLeakage(`access_token=${tokenValue}`).accepted,
    ).toBe(false);
    expect(scanTokenValidationNoLeakage(jwtLikeValue).accepted).toBe(false);
    expect(
      scanTokenValidationNoLeakage(
        "No token values, authorization material, cookies, sessions, provider credentials, raw finance data, or raw source dumps are retained.",
      ).accepted,
    ).toBe(true);
  });

  it("keeps /mcp, metadata route, missing-token, DB, package, source, provider, and finance-write scope out", () => {
    const proof = buildMcpTokenValidationRuntimeProof();
    const routeSource = safeRead(mcpRoutePath);
    const metadataRouteSource = safeRead(metadataRoutePath);

    expect(countMatches(routeSource, /app\.post\("\/mcp"/gu)).toBe(1);
    expect(countMatches(routeSource, /app\.get\("\/mcp"/gu)).toBe(1);
    expect(routeSource).not.toContain(
      "read-only-app-mcp-token-validation-runtime",
    );
    expect(metadataRouteSource).not.toMatch(/WWW-Authenticate/iu);
    expect(proof.noMcpRouteBehaviorChange).toBe(true);
    expect(proof.noProtectedResourceMetadataRouteBehaviorChange).toBe(true);
    expect(proof.noMissingTokenChallengeBehaviorChange).toBe(true);
    expect(proof.noInvalidTokenChallengeRuntime).toBe(true);
    expect(proof.noDbQueriesAdded).toBe(true);
    expect(proof.noSchemaMigrationsAdded).toBe(true);
    expect(proof.noPackageScriptsAdded).toBe(true);
    expect(proof.noPublicAssets).toBe(true);
    expect(proof.noOpenAiApiCalls).toBe(true);
    expect(proof.noModelCalls).toBe(true);
    expect(proof.noProviderCalls).toBe(true);
    expect(proof.noExternalCommunications).toBe(true);
    expect(proof.noSourceMutation).toBe(true);
    expect(proof.noFinanceWrite).toBe(true);
  });

  it("keeps FP-0131 through FP-0100 prior boundaries intact", () => {
    const repoPaths = repoFilePaths();

    expect(
      verifyFp0131TokenValidationRuntimeSequencingPlanBoundary({
        planText: safeRead(
          FP0131_TOKEN_VALIDATION_RUNTIME_SEQUENCING_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0130LocalMissingTokenChallengeImplementationBoundary({
        planText: safeRead(
          FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0128TokenValidationReadinessContractsBoundary({
        planText: safeRead(
          FP0128_TOKEN_VALIDATION_READINESS_CONTRACTS_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary({
        planText: safeRead(
          FP0127_WWW_AUTHENTICATE_AUTH_CHALLENGE_CONTRACTS_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      docsBoundary(
        FP0125_PROTECTED_RESOURCE_METADATA_LOCAL_ROUTE_IMPLEMENTATION_PLAN_PATH,
        ["local-only/read-only", "/.well-known/oauth-protected-resource/mcp"],
      ),
    ).toBe(true);
    expect(
      verifyFp0123ProtectedResourceMetadataRouteInputContractsBoundary({
        planText: safeRead(
          FP0123_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0122ProtectedResourceMetadataBuilderContractsBoundary({
        planText: safeRead(
          FP0122_PROTECTED_RESOURCE_METADATA_BUILDER_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0120CanonicalResourceAuthServerPlanBoundary({
        planText: safeRead(FP0120_CANONICAL_RESOURCE_AUTH_SERVER_PLAN_PATH),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0118ProtectedResourceMetadataPlanBoundary({
        planText: safeRead(FP0118_PROTECTED_RESOURCE_METADATA_PLAN_PATH),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0117OauthImplementationSequencingPlanBoundary({
        planText: safeRead(FP0117_OAUTH_IMPLEMENTATION_SEQUENCING_PLAN_PATH),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      docsBoundary(fp0107PlanPath, ["local/control-plane", "post /mcp"]),
    ).toBe(true);
    expect(
      docsBoundary(fp0106PlanPath, ["mcp protocol envelope", "tools/call"]),
    ).toBe(true);
    expect(
      docsBoundary(fp0100PlanPath, [
        "public-app security boundary",
        "local/proof-only",
      ]),
    ).toBe(true);
    expect(
      verifyFp0129WwwAuthenticateChallengeImplementationSequencingPlanBoundary({
        planText: safeRead(
          FP0129_WWW_AUTHENTICATE_CHALLENGE_IMPLEMENTATION_SEQUENCING_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
  });
});

function docsBoundary(path: string, requiredTexts: readonly string[]) {
  const normalized = normalize(safeRead(path));
  return requiredTexts.every((requiredText) =>
    normalized.includes(normalize(requiredText)),
  );
}

function countMatches(text: string, pattern: RegExp) {
  return [...text.matchAll(pattern)].length;
}

function repoFilePaths() {
  const results: string[] = [];
  const skipped = new Set([
    ".git",
    ".next",
    ".turbo",
    "coverage",
    "dist",
    "node_modules",
  ]);

  function walk(directory: string, prefix = "") {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && skipped.has(entry.name)) continue;
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) walk(absolutePath, relativePath);
      else results.push(relativePath);
    }
  }

  walk(repoRoot);
  return results.sort();
}

function safeRead(path: string) {
  return readFileSync(join(repoRoot, path), "utf8");
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
