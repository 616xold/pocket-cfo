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
  FP0149_AUTHORIZATION_PARSER_PURE_DOMAIN_IMPLEMENTATION_PLAN_PATH,
  verifyFp0146ParserContractProviderSelectionProofPlanBoundary,
  verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan,
  verifyFp0149Absent,
  verifyFp0149AbsentOrAuthorizationParserPureDomainImplementationPlan,
  verifyFp0150Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import { verifyFp0147ProviderSelectionEvidenceHardeningPlanBoundary } from "./read-only-app-mcp-provider-selection-evidence-hardening";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";
import {
  READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS,
  classifyReadOnlyMcpAuthorizationHeader,
  mapReadOnlyMcpAuthorizationParserFailureState,
  parseReadOnlyMcpAuthorizationHeader,
  verifyFp0148CloseoutFreshnessForFp0149,
  verifyReadOnlyMcpAuthorizationParserImplementationBoundary,
} from "./read-only-app-mcp-authorization-parser";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const parserPath =
  "packages/domain/src/read-only-app-mcp-authorization-parser.ts";
const parserSpecPath =
  "packages/domain/src/read-only-app-mcp-authorization-parser.spec.ts";
const mcpRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const metadataRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const invalidTokenChallengePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts";

describe("FP-0149 pure-domain Authorization parser implementation", () => {
  it("accepts exactly one FP-0149 parser implementation plan while FP-0150 remains absent", () => {
    const repoPaths = repoFilePaths();

    expect(repoPaths.filter((path) => /(^|\/)FP-0149/u.test(path))).toEqual([
      FP0149_AUTHORIZATION_PARSER_PURE_DOMAIN_IMPLEMENTATION_PLAN_PATH,
    ]);
    expect(verifyFp0149Absent(repoPaths)).toBe(true);
    expect(
      verifyFp0149AbsentOrAuthorizationParserPureDomainImplementationPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(verifyFp0150Absent(repoPaths)).toBe(true);
    expect(
      verifyFp0149AbsentOrAuthorizationParserPureDomainImplementationPlan([
        ...repoPaths,
        "plans/FP-0149-route-runtime.md",
      ]),
    ).toBe(false);
    expect(verifyFp0150Absent([...repoPaths, "plans/FP-0150-next.md"])).toBe(
      false,
    );
  });

  it("keeps the parser module pure-domain and local-only", () => {
    const parserSource = safeRead(parserPath);

    expect(parserSource).not.toMatch(/from ["']node:/u);
    expect(parserSource).not.toMatch(/\b(?:fetch|setTimeout|setInterval)\s*\(/u);
    expect(parserSource).not.toMatch(/\b(?:Date|Math\.random|crypto|process\.env)\b/u);
    expect(parserSource).not.toMatch(/\b(?:console|logger)\s*\./u);
    expect(parserSource).not.toMatch(/apps\/control-plane|routes|fastify/iu);
    expect(parserSource).not.toMatch(/packages\/db|drizzle|sql`/iu);
    expect(parserSource).not.toMatch(/openai|api\.openai\.com/iu);
    expect(parserSource).not.toMatch(/jwks|introspect|oauthCallback|sessionStore/iu);
    expect(parserSource).not.toMatch(/callProvider|providerConnect|deploy/iu);
  });

  it("returns absent missing-token posture for undefined, null, and empty structural arrays", () => {
    for (const authorizationHeader of [undefined, null, []] as const) {
      const parsed = parseReadOnlyMcpAuthorizationHeader({
        authorizationHeader,
      });
      const classification = classifyReadOnlyMcpAuthorizationHeader({
        authorizationHeader,
      });

      expect(parsed).toMatchObject({
        authorization_presence: "absent",
        authorization_scheme_classification: "not_evaluated",
        credential_material_observed: false,
      });
      expect(classification.failure_state).toBe("missing_authorization");
      expect(classification.failure_mapping).toMatchObject({
        envelopeFailure: "missing_token",
        mapsToFp0130MissingTokenLane: true,
      });
    }
  });

  it("classifies malformed and unsupported structural inputs without retaining material", () => {
    expect(
      classifyReadOnlyMcpAuthorizationHeader({
        authorizationHeader: ["Digest [not-a-token]", "Digest [not-a-token]"],
      }),
    ).toMatchObject({
      authorization_scheme_classification: "malformed",
      credential_material_observed: false,
      failure_state: "multiple_authorization_values",
    });
    expect(
      classifyReadOnlyMcpAuthorizationHeader({ authorizationHeader: " \t " }),
    ).toMatchObject({
      authorization_scheme_classification: "malformed",
      failure_state: "malformed_authorization",
    });
    expect(
      classifyReadOnlyMcpAuthorizationHeader({
        authorizationHeader: "Digest [not-a-token]",
      }),
    ).toMatchObject({
      authorization_scheme_classification: "unsupported",
      failure_state: "unsupported_scheme",
    });
    expect(
      classifyReadOnlyMcpAuthorizationHeader({
        authorizationHeader: "??? [not-a-token]",
      }),
    ).toMatchObject({
      authorization_scheme_classification: "malformed",
      failure_state: "malformed_authorization",
    });
  });

  it("classifies scheme sentinel presence and malformed scheme inputs without echoing credential material", () => {
    const safeBearerHeader = `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent}`;

    expect(
      classifyReadOnlyMcpAuthorizationHeader({
        authorizationHeader: safeBearerHeader,
      }),
    ).toMatchObject({
      authorization_presence: "present",
      authorization_scheme_classification: "bearer",
      credential_material_observed: true,
      failure_state: null,
    });
    expect(
      classifyReadOnlyMcpAuthorizationHeader({ authorizationHeader: "Bearer" }),
    ).toMatchObject({
      authorization_scheme_classification: "malformed",
      credential_material_observed: false,
      failure_state: "bearer_without_material",
    });
    expect(
      classifyReadOnlyMcpAuthorizationHeader({
        authorizationHeader: "Bearer  [credential-present]",
      }),
    ).toMatchObject({
      authorization_scheme_classification: "malformed",
      failure_state: "bearer_with_unsafe_whitespace_or_control_characters",
    });
    expect(
      classifyReadOnlyMcpAuthorizationHeader({
        authorizationHeader: "Bearer\t[credential-present]",
      }),
    ).toMatchObject({
      authorization_scheme_classification: "malformed",
      failure_state: "bearer_with_unsafe_whitespace_or_control_characters",
    });
    expect(
      classifyReadOnlyMcpAuthorizationHeader({
        authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.passthroughAttempt}`,
      }),
    ).toMatchObject({
      authorization_scheme_classification: "malformed",
      credential_material_observed: false,
      failure_state: "token_material_passthrough_attempt",
    });
  });

  it("limits parser output to FP-0146 sanitized fields and never emits raw or token-derived fields", () => {
    const parsed = parseReadOnlyMcpAuthorizationHeader({
      authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent}`,
    });
    const outputFields = Object.keys(parsed);

    expect(outputFields).toEqual([
      ...FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS,
    ]);
    expect(parsed.no_raw_header_retained).toBe(true);
    expect(parsed.no_raw_token_retained).toBe(true);
    expect(parsed.no_token_derived_fingerprint_retained).toBe(true);
    expect(
      FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS.every(
        (field) => !outputFields.includes(field),
      ),
    ).toBe(true);
    for (const forbiddenField of [
      "authorization_header",
      "raw_authorization",
      "raw_header",
      "raw_token",
      "token",
      "token_fingerprint",
      "token_prefix",
      "token_suffix",
      "token_length",
      "token_hash",
      "token_digest",
      "token_claims",
      "decoded_header",
      "decoded_payload",
    ]) {
      expect(outputFields).not.toContain(forbiddenField);
    }
  });

  it("maps failure states to FP-0139 envelopes or the FP-0130 missing-token lane", () => {
    for (const mapping of FP0146_FAILURE_MAPPINGS) {
      expect(
        mapReadOnlyMcpAuthorizationParserFailureState(mapping.failureState),
      ).toMatchObject({
        envelopeFailure: mapping.envelopeFailure,
        failureState: mapping.failureState,
        noForwarding: true,
        noTokenEcho: true,
      });
    }
    expect(
      mapReadOnlyMcpAuthorizationParserFailureState("missing_authorization"),
    ).toMatchObject({
      envelopeFailure: "missing_token",
      mapsToFp0130MissingTokenLane: true,
    });
    expect(
      mapReadOnlyMcpAuthorizationParserFailureState(
        "token_material_passthrough_attempt",
      ),
    ).toMatchObject({ envelopeFailure: "invalid_token" });
  });

  it("keeps fixtures proof-only and the shared sanitizer strict for credential-shaped material", () => {
    const safeFixtureText = [
      READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialOmitted,
      READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent,
      READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.notAToken,
      READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.passthroughAttempt,
      safeRead(parserPath),
      safeRead(parserSpecPath),
    ].join("\n");
    const generatedCredential = ["alpha", "numeric", "fixture"].join("");
    const unsafeBearerLine = [
      "authorization",
      ": ",
      "bearer",
      " ",
      generatedCredential,
    ].join("");
    const unsafeJwtLikeLine = [
      "ey",
      "J",
      "headerpart",
      ".",
      "payloadpart",
      ".",
      "signaturepart",
    ].join("");

    expect(scanProofOnlyNoTokenLeakageText(safeFixtureText).accepted).toBe(
      true,
    );
    expect(scanProofOnlyNoTokenLeakageText(unsafeBearerLine).accepted).toBe(
      false,
    );
    expect(scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted).toBe(
      false,
    );
  });

  it("preserves route behavior and prior FP boundaries", () => {
    const repoPaths = repoFilePaths();
    const boundary =
      verifyReadOnlyMcpAuthorizationParserImplementationBoundary(repoPaths);

    expect(routePosturePreserved()).toEqual({
      invalidTokenChallengeBehaviorUnchanged: true,
      metadataRouteBehaviorUnchanged: true,
      missingTokenBehaviorUnchanged: true,
      mcpRouteBehaviorUnchanged: true,
      noRouteImportsParser: true,
    });
    expect(Object.values(boundary).every(Boolean)).toBe(true);
    expect(
      verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan(
        repoPaths,
      ),
    ).toBe(true);
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
      verifyFp0148CloseoutFreshnessForFp0149(
        safeRead(FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH),
      ),
    ).toBe(true);
  });
});

function routePosturePreserved() {
  const routeSource = safeRead(mcpRoutePath);
  const metadataRouteSource = safeRead(metadataRoutePath);
  const invalidTokenChallengeSource = safeRead(invalidTokenChallengePath);

  return {
    invalidTokenChallengeBehaviorUnchanged:
      countMatches(
        routeSource,
        /readOnlyAppMcpInvalidTokenChallengeResultEnvelope/gu,
      ) === 3 &&
      invalidTokenChallengeSource.includes(
        "buildReadOnlyAppMcpInvalidTokenChallengeResponse",
      ),
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
    noRouteImportsParser:
      !routeSource.includes("read-only-app-mcp-authorization-parser") &&
      !metadataRouteSource.includes("read-only-app-mcp-authorization-parser"),
  };
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
