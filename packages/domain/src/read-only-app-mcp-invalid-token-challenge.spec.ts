import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0127_WWW_AUTHENTICATE_AUTH_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0128_TOKEN_VALIDATION_READINESS_CONTRACTS_PLAN_PATH,
  FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0131_TOKEN_VALIDATION_RUNTIME_SEQUENCING_PLAN_PATH,
  FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH,
  FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
  FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH,
  FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
  MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY,
  MCP_INVALID_TOKEN_CHALLENGE_FUTURE_400_FAILURES,
  MCP_INVALID_TOKEN_CHALLENGE_FUTURE_401_FAILURES,
  MCP_INVALID_TOKEN_CHALLENGE_FUTURE_403_FAILURES,
  MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES,
  McpInvalidTokenChallengeProofSchema,
  buildMcpInvalidTokenChallengeContracts,
  buildMcpInvalidTokenChallengeProof,
  scanTokenValidationNoLeakage,
  verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary,
  verifyFp0128TokenValidationReadinessContractsBoundary,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0131TokenValidationRuntimeSequencingPlanBoundary,
  verifyFp0132TokenValidationRuntimeContractsBoundary,
  verifyFp0133TokenValidationTestDoubleContractsBoundary,
  verifyFp0134TokenValidationTestDoubleImplementationBoundary,
  verifyFp0135InvalidTokenChallengeSequencingPlanBoundary,
  verifyFp0136Absent,
  verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts,
  verifyFp0136InvalidTokenChallengeContractsBoundary,
  verifyFp0136PlanningTextRequiredTopics,
  verifyFp0137Absent,
  verifyMcpInvalidTokenChallengeContractBoundaries,
} from "./index";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const mcpRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const metadataRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const directProofCommandPath =
  "tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs";
const sequencingProofCommandPath =
  "tools/read-only-mcp-invalid-token-challenge-sequencing-proof.mjs";
const localProofCommandPath =
  "tools/read-only-mcp-token-validation-test-double-local-proof.mjs";
const contractProofCommandPath =
  "tools/read-only-mcp-token-validation-test-double-contract-proof.mjs";
const fp0125PlanPath =
  "plans/FP-0125-read-only-chatgpt-app-mcp-protected-resource-metadata-local-route-implementation.md";
const fp0107PlanPath =
  "plans/FP-0107-read-only-chatgpt-app-mcp-local-fastify-mcp-route-adapter-foundation.md";
const fp0106PlanPath =
  "plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md";
const fp0100PlanPath =
  "plans/FP-0100-read-only-chatgpt-app-mcp-public-app-security-boundary-contracts-foundation.md";

describe("FP-0136 invalid-token challenge contract foundations", () => {
  it("accepts exactly one FP-0136 contract plan while FP-0137 remains absent", () => {
    const repoPaths = repoFilePaths();
    const planText = safeRead(
      FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0136/u.test(path))).toEqual([
      FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
    ]);
    expect(verifyFp0136Absent(repoPaths)).toBe(false);
    expect(
      verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts({
        planText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0136InvalidTokenChallengeContractsBoundary({
        planText,
        repoPaths,
      }),
    ).toBe(true);
    expect(verifyFp0137Absent(repoPaths)).toBe(true);
    expect(
      verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts({
        planText,
        repoPaths: [...repoPaths, "plans/FP-0136-extra-contract.md"],
      }),
    ).toBe(false);
    expect(
      verifyFp0137Absent([...repoPaths, "plans/FP-0137-future-runtime.md"]),
    ).toBe(false);
  });

  it("keeps FP-0136 local, proof-only, and contract-only", () => {
    const planText = safeRead(
      FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
    );
    const topics = verifyFp0136PlanningTextRequiredTopics(planText);
    const proof = buildMcpInvalidTokenChallengeProof();

    expect(Object.values(topics).every(Boolean)).toBe(true);
    expect(McpInvalidTokenChallengeProofSchema.safeParse(proof).success).toBe(
      true,
    );
    expect(proof.localProofOnly).toBe(true);
    expect(proof.invalidTokenChallengeContractsVerified).toBe(true);
    expect(proof.noInvalidTokenChallengeRuntime).toBe(true);
    expect(proof.noTokenParsingRuntime).toBe(true);
    expect(proof.noTokenValidationRuntime).toBe(true);
    expect(proof.noJwtDecodingRuntime).toBe(true);
    expect(proof.noTokenIntrospectionRuntime).toBe(true);
    expect(proof.noOauthImplementation).toBe(true);
    expect(proof.noTokenSessionStorage).toBe(true);
    expect(proof.noAuthMiddlewareImplementation).toBe(true);
    expect(
      McpInvalidTokenChallengeProofSchema.safeParse({
        ...proof,
        noInvalidTokenChallengeRuntime: false,
      }).success,
    ).toBe(false);
  });

  it("models failure taxonomy and future status mapping without token material", () => {
    const contracts = buildMcpInvalidTokenChallengeContracts();

    expect(MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY).toEqual([
      "malformed",
      "expired",
      "wrong-issuer",
      "wrong-audience",
      "wrong-resource",
      "wrong-scope",
      "wrong-org",
      "wrong-company",
      "revoked",
      "replayed",
      "token-passthrough-attempt",
    ]);
    expect(MCP_INVALID_TOKEN_CHALLENGE_FUTURE_401_FAILURES).toEqual([
      "malformed",
      "expired",
      "wrong-issuer",
      "wrong-audience",
      "wrong-resource",
      "wrong-org",
      "wrong-company",
      "revoked",
      "replayed",
      "token-passthrough-attempt",
    ]);
    expect(MCP_INVALID_TOKEN_CHALLENGE_FUTURE_403_FAILURES).toEqual([
      "wrong-scope",
    ]);
    expect(MCP_INVALID_TOKEN_CHALLENGE_FUTURE_400_FAILURES).toEqual([
      "malformed-authorization-request-shape",
    ]);
    expect(contracts.failureTaxonomyBoundary.modeledWithoutTokenMaterial).toBe(
      true,
    );
    expect(contracts.failureTaxonomyBoundary.routeRuntimeImplemented).toBe(
      false,
    );
    expect(contracts.statusMappingBoundary.statusMappingContractOnly).toBe(
      true,
    );
    expect(contracts.statusMappingBoundary.statusEmittedNow).toBe(false);
  });

  it("keeps WWW-Authenticate, resource metadata, scope, and JSON-RPC boundaries future-only", () => {
    const contracts = buildMcpInvalidTokenChallengeContracts();

    expect(contracts.wwwAuthenticateBoundary.futureBearerScheme).toBe("Bearer");
    expect(
      contracts.wwwAuthenticateBoundary.futureResourceMetadataParameter,
    ).toBe("resource_metadata");
    expect(contracts.wwwAuthenticateBoundary.challengeHeaderEmittedNow).toBe(
      false,
    );
    expect(
      contracts.resourceMetadataAlignmentBoundary
        .protectedResourceMetadataRouteContractAligned,
    ).toBe(true);
    expect(
      contracts.resourceMetadataAlignmentBoundary
        .protectedResourceMetadataRouteBehaviorChanged,
    ).toBe(false);
    expect(
      contracts.scopeChallengeBoundary
        .challengedScopesAreAuthoritativeForRequest,
    ).toBe(true);
    expect(
      contracts.scopeChallengeBoundary.scopeChallengeRuntimeImplemented,
    ).toBe(false);
    expect(
      contracts.jsonRpcRefusalBoundary
        .httpChallengeHeadersSeparateFromJsonRpcRefusal,
    ).toBe(true);
    expect(
      contracts.jsonRpcRefusalBoundary.jsonRpcEnvelopeCarriesChallengeHeader,
    ).toBe(false);
  });

  it("proves no token echo and no route consumption of synthetic test doubles", () => {
    const contracts = buildMcpInvalidTokenChallengeContracts();
    const proof = buildMcpInvalidTokenChallengeProof();
    const routeSource = safeRead(mcpRoutePath);
    const metadataRouteSource = safeRead(metadataRoutePath);

    expect(MCP_INVALID_TOKEN_CHALLENGE_NO_LEAKAGE_SURFACES).toEqual([
      "logs",
      "proof_output",
      "docs_examples",
      "headers",
      "route_bodies",
      "metadata_examples",
      "evidence",
      "structured_content",
      "json_rpc_refusal_envelopes",
      "app_metadata",
    ]);
    expect(scanTokenValidationNoLeakage(JSON.stringify(proof)).accepted).toBe(
      true,
    );
    expect(contracts.noTokenEchoBoundary.noTokenValueInAnySurface).toBe(true);
    expect(contracts.noTokenEchoBoundary.noRealTokenExamples).toBe(true);
    expect(contracts.noTokenEchoBoundary.noJwtLikeExamples).toBe(true);
    expect(contracts.noTokenEchoBoundary.noBearerTokenMaterial).toBe(true);
    expect(
      contracts.testDoubleNoRouteConsumptionBoundary
        .noRouteConsumesSyntheticTestDoubles,
    ).toBe(true);
    expect(routeSource).not.toContain(
      "evaluateSyntheticTokenValidationScenario",
    );
    expect(metadataRouteSource).not.toContain(
      "evaluateSyntheticTokenValidationScenario",
    );
  });

  it("keeps /mcp, metadata route, and missing-token behavior unchanged", () => {
    const routeSource = safeRead(mcpRoutePath);
    const metadataRouteSource = safeRead(metadataRoutePath);
    const proof = buildMcpInvalidTokenChallengeProof();

    expect(countMatches(routeSource, /app\.post\("\/mcp"/gu)).toBe(1);
    expect(countMatches(routeSource, /app\.get\("\/mcp"/gu)).toBe(1);
    expect(metadataRouteSource).not.toMatch(/WWW-Authenticate/iu);
    expect(countMatches(metadataRouteSource, /app\.get\(/gu)).toBe(1);
    expect(proof.noMcpRouteBehaviorChange).toBe(true);
    expect(proof.noProtectedResourceMetadataRouteBehaviorChange).toBe(true);
    expect(proof.noMissingTokenChallengeBehaviorChange).toBe(true);
  });

  it("requires hardened proof-source scans over branch diff and dirty QA targets", () => {
    const directProofSource = safeRead(directProofCommandPath);
    const sequencingProofSource = safeRead(sequencingProofCommandPath);
    const localProofSource = safeRead(localProofCommandPath);
    const contractProofSource = safeRead(contractProofCommandPath);

    for (const source of [
      directProofSource,
      sequencingProofSource,
      localProofSource,
      contractProofSource,
    ]) {
      expect(source).toContain("origin/main...HEAD");
      expect(source).toContain("dirtyQaTargetFiles");
      expect(source).toContain("combinedChangedPaths");
      expect(source).toContain("committedBranchDiffPaths");
    }
    expect(directProofSource).toContain(
      "verifyMcpTokenValidationTestDoubleRepositoryInventory",
    );
    expect(directProofSource).toContain("readCommittedBranchDiffDocText");
    expect(directProofSource).toContain("readDirtyQaDocText");
    expect(directProofSource).toContain("buildDocLeakageScanText");
    expect(directProofSource).toContain("docLeakageScannerContract");
    expect(directProofSource).toContain("required-fp0136-plan-full-text");
    expect(directProofSource).toContain("committed-branch-diff-additions");
    expect(directProofSource).toContain("dirty-qa-additions");
    expect(directProofSource).toContain("--cached");
    expect(directProofSource).not.toContain("readChangedDocText(changedPaths)");
    expect(directProofSource).toContain("noMcpRouteBehaviorChangeFromFp0136");
    expect(directProofSource).toContain("fp0137Absent");
    expect(sequencingProofSource).toContain(
      "fp0136AbsentOrLocalInvalidTokenChallengeContractsVerified",
    );
    expect(localProofSource).toContain(
      "fp0136AbsentOrLocalInvalidTokenChallengeContractsVerified",
    );
    expect(contractProofSource).toContain(
      "invalidTokenChallengeContractsFoundationVerified",
    );
  });

  it("rejects simulated committed and dirty doc leakage while accepting safe absence text", () => {
    const planText = safeRead(
      FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
    );
    const committedBearerMaterial = ["Bearer", "x".repeat(24)].join(" ");
    const dirtyJwtLikeMaterial = [
      ["eyJ", "dirty"].join("").padEnd(16, "x"),
      "jwtlikepayload".padEnd(16, "x"),
      "jwtlikesignature".padEnd(16, "x"),
    ].join(".");
    const safeAbsenceText = [
      "No token validation runtime, no token parser, no JWT decoder, no token introspection runtime, and no Bearer material examples are present.",
      "Do not use OPENAI_API_KEY, from openai imports, responses.create, chat.completions, or api.openai.com calls.",
      "Proof output records absence only and does not include credential, cookie, session, Authorization, or token values.",
    ].join("\n");

    expect(scanTokenValidationNoLeakage(planText).accepted).toBe(true);
    expect(
      scanTokenValidationNoLeakage(
        `# committed-branch-diff-additions: README.md\n${committedBearerMaterial}`,
      ),
    ).toMatchObject({
      accepted: false,
      rejectionReasons: ["bearer-token-material"],
    });
    expect(
      scanTokenValidationNoLeakage(
        `# dirty-qa-additions: docs/security/read-only-agent-threat-model.md\n${dirtyJwtLikeMaterial}`,
      ),
    ).toMatchObject({
      accepted: false,
      rejectionReasons: ["jwt-like-material"],
    });
    expect(scanTokenValidationNoLeakage(safeAbsenceText).accepted).toBe(true);
  });

  it("keeps FP-0135 through FP-0100 prior boundaries intact", () => {
    const repoPaths = repoFilePaths();

    expect(verifyMcpInvalidTokenChallengeContractBoundaries()).toBe(true);
    expect(
      verifyFp0135InvalidTokenChallengeSequencingPlanBoundary({
        planText: safeRead(FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0134TokenValidationTestDoubleImplementationBoundary({
        planText: safeRead(
          FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0133TokenValidationTestDoubleContractsBoundary({
        planText: safeRead(
          FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0132TokenValidationRuntimeContractsBoundary({
        planText: safeRead(FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH),
        repoPaths,
      }),
    ).toBe(true);
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
      docsBoundary(fp0125PlanPath, [
        "local-only/read-only",
        "/.well-known/oauth-protected-resource/mcp",
      ]),
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
