import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
} from "./read-only-app-mcp-www-authenticate";
import {
  FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH,
  verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary,
} from "./read-only-app-mcp-token-validation-result-envelope";
import {
  FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
  verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary,
} from "./read-only-app-mcp-invalid-token-challenge-implementation-planning";
import {
  FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
  FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH,
  verifyFp0143AbsentOrInvalidTokenAppConstructionWiring,
  verifyFp0142RouteIntegrationSequencingPlanBoundary,
} from "./read-only-app-mcp-invalid-token-challenge-route-integration-sequencing";
import {
  FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PATH,
  verifyFp0144ProductionTokenValidationSequencingPlanBoundary,
} from "./read-only-app-mcp-token-validation-production-sequencing";
import {
  FP0145_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_PLAN_PATH,
  verifyFp0145TokenValidationRuntimeProofHardeningPlanBoundary,
} from "./read-only-app-mcp-token-validation-runtime";
import {
  FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PATH,
  FP0146_CANDIDATE_PROVIDER_MODES,
  FP0146_FAILURE_MAPPINGS,
  FP0146_FAILURE_STATES,
  FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
  FP0146_PROVIDER_MODE,
  FP0146_PROVIDER_SELECTION_CRITERIA,
  FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS,
  buildFp0146AuthorizationParserContractsProviderSelectionProof,
  buildFp0146SanitizedParserOutputContract,
  verifyFp0146AbsentOrParserContractProviderSelectionProofPlan,
  verifyFp0146AuthorizationParserContractsProof,
  verifyFp0146ParserContractProviderSelectionProofPlanBoundary,
  verifyFp0146ParserFailureMapping,
  verifyFp0146PlanningTextRequiredTopics,
  verifyFp0147Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";

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

describe("FP-0146 Authorization parser contract and provider-selection proof", () => {
  it("accepts exactly one FP-0146 parser-contract/provider-selection-proof plan while FP-0147 remains absent", () => {
    const repoPaths = repoFilePaths();
    const planText = safeRead(
      FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PATH,
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0146/u.test(path))).toEqual([
      FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PATH,
    ]);
    expect(
      verifyFp0146AbsentOrParserContractProviderSelectionProofPlan({
        planText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0146ParserContractProviderSelectionProofPlanBoundary({
        planText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      Object.values(verifyFp0146PlanningTextRequiredTopics(planText)).every(
        Boolean,
      ),
    ).toBe(true);
    expect(verifyFp0147Absent(repoPaths)).toBe(true);
    expect(
      verifyFp0146AbsentOrParserContractProviderSelectionProofPlan({
        planText,
        repoPaths: [...repoPaths, "plans/FP-0146-runtime.md"],
      }),
    ).toBe(false);
    expect(
      verifyFp0146AbsentOrParserContractProviderSelectionProofPlan({
        planText,
        repoPaths: [...repoPaths, "plans/FP-0147-runtime.md"],
      }),
    ).toBe(true);
    expect(verifyFp0147Absent([...repoPaths, "plans/FP-0147-runtime.md"])).toBe(
      false,
    );
  });

  it("models sanitized parser output without raw credential material or token-derived fingerprints", () => {
    const proof = buildFp0146AuthorizationParserContractsProviderSelectionProof();
    const outputContract = buildFp0146SanitizedParserOutputContract();
    const outputFields = Object.keys(outputContract);

    expect(proof.parserContractAndProviderSelectionProofOnly).toBe(true);
    expect(proof.authorizationParserImplementationCanStartAfterFp0146).toBe(
      false,
    );
    expect(proof.productionTokenValidationRuntimeCanStartAfterFp0146).toBe(
      false,
    );
    expect(proof.tokenParserImplementationCanStartAfterFp0146).toBe(false);
    expect(proof.jwtDecoderImplementationCanStartAfterFp0146).toBe(false);
    expect(proof.jwksFetchingCachingImplementationCanStartAfterFp0146).toBe(
      false,
    );
    expect(proof.tokenIntrospectionImplementationCanStartAfterFp0146).toBe(
      false,
    );
    expect(proof.oauthSessionAuthMiddlewareCanStartAfterFp0146).toBe(false);
    expect(proof.routeBehaviorMayChangeAfterFp0146).toBe(false);
    expect(outputContract.no_raw_header_retained).toBe(true);
    expect(outputContract.no_raw_token_retained).toBe(true);
    expect(outputContract.no_token_derived_fingerprint_retained).toBe(true);
    expect(FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS).toEqual(
      outputFields,
    );
    expect(
      FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS.every(
        (field) => !outputFields.includes(field),
      ),
    ).toBe(true);
    expect(verifyFp0146AuthorizationParserContractsProof()).toBe(true);
  });

  it("maps parser failure states to FP-0139 envelopes or the FP-0130 missing-token lane", () => {
    expect(FP0146_FAILURE_MAPPINGS.map(({ failureState }) => failureState)).toEqual(
      [...FP0146_FAILURE_STATES],
    );
    expect(
      FP0146_FAILURE_MAPPINGS.find(
        ({ failureState }) => failureState === "missing_authorization",
      ),
    ).toMatchObject({
      envelopeFailure: "missing_token",
      missingTokenLaneSeparate: true,
    });
    expect(
      FP0146_FAILURE_MAPPINGS.find(
        ({ failureState }) => failureState === "unsupported_scheme",
      ),
    ).toMatchObject({ envelopeFailure: "unsupported_validation_mode" });
    expect(
      FP0146_FAILURE_MAPPINGS.find(
        ({ failureState }) => failureState === "token_material_passthrough_attempt",
      ),
    ).toMatchObject({
      envelopeFailure: "invalid_token",
      noForwarding: true,
      noTokenEcho: true,
    });
    expect(
      FP0146_FAILURE_MAPPINGS.every(
        ({ failureState, invalidTokenChallengeDownstreamOfFp0139 }) =>
          failureState === "missing_authorization" ||
          invalidTokenChallengeDownstreamOfFp0139,
      ),
    ).toBe(true);
    expect(verifyFp0146ParserFailureMapping()).toBe(true);
  });

  it("records provider-selection criteria without choosing a provider or calling one", () => {
    const proof = buildFp0146AuthorizationParserContractsProviderSelectionProof();

    expect(proof.providerMode).toBe(FP0146_PROVIDER_MODE);
    expect(proof.candidateProviderModes).toEqual([
      ...FP0146_CANDIDATE_PROVIDER_MODES,
    ]);
    expect(proof.providerSelectionCriteria).toEqual([
      ...FP0146_PROVIDER_SELECTION_CRITERIA,
    ]);
    expect(proof.noProviderCallsInThisSlice).toBe(true);
    expect(proof.noCredentialForwardingInThisSlice).toBe(true);
    expect(proof.noTokenPassthroughInThisSlice).toBe(true);
  });

  it("preserves route, missing-token, invalid-token, metadata, and earlier proof boundaries", () => {
    const repoPaths = repoFilePaths();

    expect(routePosturePreserved()).toEqual({
      invalidTokenChallengeBehaviorUnchanged: true,
      metadataRouteBehaviorUnchanged: true,
      missingTokenBehaviorUnchanged: true,
      mcpRouteBehaviorUnchanged: true,
    });
    expect(
      verifyFp0145TokenValidationRuntimeProofHardeningPlanBoundary({
        planText: safeRead(
          FP0145_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PROOF_HARDENING_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0144ProductionTokenValidationSequencingPlanBoundary({
        planText: safeRead(FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PATH),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0143AbsentOrInvalidTokenAppConstructionWiring({
        planText: safeRead(FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0142RouteIntegrationSequencingPlanBoundary({
        planText: safeRead(FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary({
        planText: safeRead(
          FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary({
        planText: safeRead(FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH),
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
    expect(docsBoundary(fp0107PlanPath, ["local/control-plane", "post /mcp"])).toBe(
      true,
    );
    expect(
      docsBoundary(fp0106PlanPath, [
        "mcp protocol envelope",
        "tools/call",
        "no openai api/model calls",
      ]),
    ).toBe(true);
    expect(
      docsBoundary(fp0100PlanPath, [
        "public-app security boundary",
        "local/proof-only",
        "no endpoints",
      ]),
    ).toBe(true);
  });
});

function routePosturePreserved() {
  const routeSource = safeRead(mcpRoutePath);
  const metadataRouteSource = safeRead(metadataRoutePath);

  return {
    invalidTokenChallengeBehaviorUnchanged:
      countMatches(routeSource, /readOnlyAppMcpInvalidTokenChallengeResultEnvelope/gu) ===
      3,
    metadataRouteBehaviorUnchanged:
      countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
      (metadataRouteSource.includes(
        '"/.well-known/oauth-protected-resource/mcp"',
      ) ||
        metadataRouteSource.includes(
          "MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH",
        )),
    missingTokenBehaviorUnchanged:
      routeSource.includes("readOnlyAppMcpLocalProofGatedMissingTokenChallenge") &&
      routeSource.includes("buildMcpWwwAuthenticateMissingTokenChallengeResponse"),
    mcpRouteBehaviorUnchanged:
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1,
  };
}

function docsBoundary(path: string, requiredTexts: readonly string[]) {
  const normalized = normalize(safeRead(path));
  return requiredTexts.every((requiredText) =>
    normalized.includes(normalize(requiredText)),
  );
}

function repoFilePaths(dir = repoRoot, prefix = ""): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (
      [".git", ".next", ".turbo", "coverage", "dist", "node_modules"].includes(
        entry.name,
      )
    ) {
      return [];
    }
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return repoFilePaths(`${dir}/${entry.name}`, path);
    return [path];
  });
}

function safeRead(path: string) {
  return readFileSync(`${repoRoot}/${path}`, "utf8");
}

function countMatches(value: string, pattern: RegExp) {
  return value.match(pattern)?.length ?? 0;
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
