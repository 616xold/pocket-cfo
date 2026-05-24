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
  verifyFp0142RouteIntegrationSequencingPlanBoundary,
  verifyFp0143AbsentOrInvalidTokenAppConstructionWiring,
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
  FP0146_FAILURE_MAPPINGS,
  FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
  FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS,
  FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
  FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
  verifyFp0146ParserContractProviderSelectionProofPlanBoundary,
  verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan,
  verifyFp0149Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import { verifyFp0147ProviderSelectionEvidenceHardeningPlanBoundary } from "./read-only-app-mcp-provider-selection-evidence-hardening";
import {
  MCP_PROOF_ONLY_NO_TOKEN_RETENTION_TERMS,
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";
import {
  FP0148_FUTURE_FP0149_ALLOWED_SCOPE,
  FP0148_FUTURE_PARSER_INPUT_BOUNDARY,
  FP0148_FUTURE_PARSER_OUTPUT_BOUNDARY,
  FP0148_PARSER_READINESS_TEST_MATRIX,
  buildFp0148AuthorizationParserImplementationReadinessProof,
  verifyFp0147CloseoutFreshnessForFp0148,
  verifyFp0148AuthorizationParserImplementationReadinessPlanBoundary,
  verifyFp0148AuthorizationParserImplementationReadinessProof,
  verifyFp0148ParserFailureMapping,
  verifyFp0148PlanningTextRequiredTopics,
  verifyFp0148ReadinessTestMatrixWithoutTokenMaterial,
  verifyFp0148SharedProofOnlyLeakageSanitizer,
} from "./read-only-app-mcp-authorization-parser-implementation-readiness";

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

describe("FP-0148 Authorization parser implementation readiness", () => {
  it("accepts exactly one FP-0148 readiness plan while FP-0149 remains absent", () => {
    const repoPaths = repoFilePaths();
    const planText = safeRead(
      FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0148/u.test(path))).toEqual([
      FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
    ]);
    expect(
      verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(verifyFp0149Absent(repoPaths)).toBe(true);
    expect(
      verifyFp0148AuthorizationParserImplementationReadinessPlanBoundary({
        planText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan([
        ...repoPaths,
        "plans/FP-0148-runtime.md",
      ]),
    ).toBe(false);
    expect(verifyFp0149Absent([...repoPaths, "plans/FP-0149-parser.md"])).toBe(
      false,
    );
  });

  it("keeps parser implementation, runtime validation, provider selection, OAuth, and public submission blocked", () => {
    const proof = buildFp0148AuthorizationParserImplementationReadinessProof();

    expect(proof.fp0148ImplementationReadinessAndProofHardeningOnly).toBe(true);
    expect(proof.authorizationParserImplementationCanStartAfterFp0148).toBe(
      false,
    );
    expect(proof.productionTokenValidationRuntimeCanStartAfterFp0148).toBe(
      false,
    );
    expect(proof.providerSelectionCanStartAfterFp0148).toBe(false);
    expect(proof.oauthSessionAuthMiddlewareCanStartAfterFp0148).toBe(false);
    expect(proof.publicChatGptAppDemoSubmissionCanStartAfterFp0148).toBe(false);
    expect(proof.futureFp0149MayOpenOnly).toEqual([
      ...FP0148_FUTURE_FP0149_ALLOWED_SCOPE,
    ]);
    expect(proof.noTokenParserImplementation).toBe(true);
    expect(proof.noJwtDecoderImplementation).toBe(true);
    expect(proof.noJwksFetchImplementation).toBe(true);
    expect(proof.noTokenIntrospectionImplementation).toBe(true);
    expect(proof.noRouteBehaviorChange).toBe(true);
    expect(verifyFp0148AuthorizationParserImplementationReadinessProof()).toBe(
      true,
    );
  });

  it("records parser input and output boundaries without retaining raw header, token material, or token-derived fields", () => {
    const proof = buildFp0148AuthorizationParserImplementationReadinessProof();

    expect(proof.futureParserInputBoundaryTerms).toEqual([
      ...FP0148_FUTURE_PARSER_INPUT_BOUNDARY,
    ]);
    expect(
      proof.futureParserInputBoundary
        .mayInspectInjectedRawRequestHeaderOnlyInsideFuturePureParserFunction,
    ).toBe(true);
    expect(
      proof.futureParserInputBoundary.rawHeaderRetainedOutsideParserStack,
    ).toBe(false);
    expect(proof.futureParserInputBoundary.rawTokenMaterialRetained).toBe(
      false,
    );
    expect(
      proof.futureParserInputBoundary
        .tokenDerivedPrefixSuffixLengthHashDigestClaimsDecodedHeaderPayloadEmitted,
    ).toBe(false);
    expect(proof.futureParserOutputBoundary.allowedSanitizedFields).toEqual([
      ...FP0148_FUTURE_PARSER_OUTPUT_BOUNDARY,
    ]);
    expect(FP0148_FUTURE_PARSER_OUTPUT_BOUNDARY).toEqual([
      ...FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS,
    ]);
    expect(
      FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS.every(
        (field) =>
          !proof.futureParserOutputBoundary.allowedSanitizedFields.includes(
            field as (typeof FP0148_FUTURE_PARSER_OUTPUT_BOUNDARY)[number],
          ),
      ),
    ).toBe(true);
  });

  it("maps parser failure states to FP-0139 envelopes or the FP-0130 missing-token lane", () => {
    const proof = buildFp0148AuthorizationParserImplementationReadinessProof();

    expect(proof.parserFailureMappings).toHaveLength(
      FP0146_FAILURE_MAPPINGS.length,
    );
    expect(
      proof.parserFailureMappings.find(
        ({ failureState }) => failureState === "missing_authorization",
      ),
    ).toMatchObject({
      envelopeFailure: "missing_token",
      mapsToFp0130MissingTokenLane: true,
    });
    expect(
      proof.parserFailureMappings.find(
        ({ failureState }) => failureState === "unsupported_scheme",
      ),
    ).toMatchObject({ envelopeFailure: "unsupported_validation_mode" });
    expect(
      proof.parserFailureMappings.find(
        ({ failureState }) =>
          failureState === "token_material_passthrough_attempt",
      ),
    ).toMatchObject({ envelopeFailure: "invalid_token" });
    expect(verifyFp0148ParserFailureMapping()).toBe(true);
  });

  it("keeps the readiness test matrix token-free and centralizes proof-only no-token-leakage fixture sanitization", () => {
    const absenceFixture = [
      "request.headers.",
      "authorization",
      " === undefined",
    ].join("");
    const emptyFixture = ["authorization", ": ", '""'].join("");
    const generatedCredential = ["alpha", "numeric", "fixture"].join("");
    const unsafeBearerLine = [
      "authorization",
      ": ",
      "bearer",
      " ",
      generatedCredential,
    ].join("");

    expect(FP0148_PARSER_READINESS_TEST_MATRIX).toContain(
      "multiple_header_values_structural_only",
    );
    expect(FP0148_PARSER_READINESS_TEST_MATRIX).toContain(
      "bearer_present_classification_with_sentinel_non_token_placeholder",
    );
    expect(verifyFp0148ReadinessTestMatrixWithoutTokenMaterial()).toBe(true);
    expect(
      scanProofOnlyNoTokenLeakageText(
        MCP_PROOF_ONLY_NO_TOKEN_RETENTION_TERMS.join("\n"),
      ).accepted,
    ).toBe(true);
    expect(scanProofOnlyNoTokenLeakageText(absenceFixture).accepted).toBe(true);
    expect(scanProofOnlyNoTokenLeakageText(emptyFixture).accepted).toBe(true);
    expect(scanTokenValidationNoLeakage(emptyFixture).accepted).toBe(false);
    expect(scanProofOnlyNoTokenLeakageText(unsafeBearerLine).accepted).toBe(
      false,
    );
    expect(verifyFp0148SharedProofOnlyLeakageSanitizer()).toBe(true);
  });

  it("preserves FP-0147 freshness, route behavior, and earlier boundary proofs", () => {
    const repoPaths = repoFilePaths();
    const fp0148PlanText = safeRead(
      FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
    );

    expect(
      Object.values(
        verifyFp0148PlanningTextRequiredTopics(fp0148PlanText),
      ).every(Boolean),
    ).toBe(true);
    expect(
      verifyFp0147CloseoutFreshnessForFp0148(
        safeRead(FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH),
      ),
    ).toBe(true);
    expect(routePosturePreserved()).toEqual({
      invalidTokenChallengeBehaviorUnchanged: true,
      metadataRouteBehaviorUnchanged: true,
      missingTokenBehaviorUnchanged: true,
      mcpRouteBehaviorUnchanged: true,
    });
    expect(
      verifyFp0147ProviderSelectionEvidenceHardeningPlanBoundary({
        planText: safeRead(
          FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0146ParserContractProviderSelectionProofPlanBoundary({
        planText: safeRead(
          FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
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
        planText: safeRead(
          FP0144_PRODUCTION_TOKEN_VALIDATION_SEQUENCING_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0143AbsentOrInvalidTokenAppConstructionWiring({
        planText: safeRead(
          FP0143_INVALID_TOKEN_APP_CONSTRUCTION_WIRING_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0142RouteIntegrationSequencingPlanBoundary({
        planText: safeRead(
          FP0142_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
        ),
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
    expect(
      docsBoundary(fp0107PlanPath, ["local/control-plane", "post /mcp"]),
    ).toBe(true);
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
      countMatches(
        routeSource,
        /readOnlyAppMcpInvalidTokenChallengeResultEnvelope/gu,
      ) === 3,
    metadataRouteBehaviorUnchanged:
      countMatches(metadataRouteSource, /app\.get\(/gu) === 1 &&
      metadataRouteSource.includes(
        "READ_ONLY_APP_MCP_PROTECTED_RESOURCE_METADATA_ROUTE_PATH",
      ),
    missingTokenBehaviorUnchanged:
      countMatches(
        routeSource,
        /readOnlyAppMcpLocalProofGatedMissingTokenChallenge/gu,
      ) === 3 &&
      routeSource.includes(
        "buildMcpWwwAuthenticateMissingTokenChallengeResponse",
      ),
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
    const absolutePath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return repoFilePaths(absolutePath, path);
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
