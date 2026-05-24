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
  FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
  FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
  FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
  FP0149_AUTHORIZATION_PARSER_PURE_DOMAIN_IMPLEMENTATION_PLAN_PATH,
  FP0150_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
  FP0151_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_PLAN_PATH,
  FP0152_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_IMPLEMENTATION_PLAN_PATH,
  FP0153_AUTHORIZATION_PARSER_APP_CONSTRUCTION_WIRING_PLAN_PATH,
  verifyFp0146ParserContractProviderSelectionProofPlanBoundary,
  verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan,
  verifyFp0149AbsentOrAuthorizationParserPureDomainImplementationPlan,
  verifyFp0150AbsentOrAuthorizationParserRouteIntegrationSequencingPlan,
  verifyFp0150AuthorizationParserRouteIntegrationSequencingPlanBoundary,
  verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan,
  verifyFp0152AbsentOrAuthorizationParserRouteIntegrationImplementationPlan,
  verifyFp0153AbsentOrAuthorizationParserAppConstructionWiringPlan,
  verifyFp0154Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import { verifyFp0147ProviderSelectionEvidenceHardeningPlanBoundary } from "./read-only-app-mcp-provider-selection-evidence-hardening";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";
import {
  READ_ONLY_MCP_AUTHORIZATION_PARSER_FUTURE_IMPLEMENTATION_PROOF_PREREQUISITES,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_FUTURE_ROUTE_SEQUENCE,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_DEPENDENCY_INJECTION_REQUIREMENTS,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS,
  buildReadOnlyMcpAuthorizationParserRouteDecisionReadinessProof,
  deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness,
  verifyFp0150CloseoutFreshnessForFp0151,
  verifyFp0151RouteIntegrationReadinessPlanningTextRequiredTopics,
  verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary,
} from "./read-only-app-mcp-authorization-parser-route-integration-readiness";
import { verifyReadOnlyMcpAuthorizationParserImplementationBoundary } from "./read-only-app-mcp-authorization-parser";
import { verifyFp0148AuthorizationParserImplementationReadinessPlanBoundary } from "./read-only-app-mcp-authorization-parser-implementation-readiness";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const readinessPath =
  "packages/domain/src/read-only-app-mcp-authorization-parser-route-integration-readiness.ts";
const readinessSpecPath =
  "packages/domain/src/read-only-app-mcp-authorization-parser-route-integration-readiness.spec.ts";
const readinessProofPath =
  "tools/read-only-mcp-authorization-parser-route-integration-readiness-proof.mjs";
const mcpRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const metadataRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const invalidTokenChallengePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts";

describe("FP-0151 Authorization parser route-integration readiness", () => {
  it("accepts exactly one FP-0151 readiness path, exact FP-0152 implementation path, exact FP-0153 app wiring path, and FP-0154 absence", () => {
    const repoPaths = repoFilePaths();
    const fp0151PlanText = safeRead(
      FP0151_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_PLAN_PATH,
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0151/u.test(path))).toEqual([
      FP0151_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_PLAN_PATH,
    ]);
    expect(
      verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0151AbsentOrAuthorizationParserRouteIntegrationReadinessPlan([
        ...repoPaths,
        "plans/FP-0151-route-runtime.md",
      ]),
    ).toBe(false);
    expect(repoPaths.filter((path) => /(^|\/)FP-0152/u.test(path))).toEqual([
      FP0152_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_IMPLEMENTATION_PLAN_PATH,
    ]);
    expect(
      verifyFp0152AbsentOrAuthorizationParserRouteIntegrationImplementationPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0152AbsentOrAuthorizationParserRouteIntegrationImplementationPlan([
        ...repoPaths,
        "plans/FP-0152-next.md",
      ]),
    ).toBe(false);
    expect(repoPaths.filter((path) => /(^|\/)FP-0153/u.test(path))).toEqual([
      FP0153_AUTHORIZATION_PARSER_APP_CONSTRUCTION_WIRING_PLAN_PATH,
    ]);
    expect(
      verifyFp0153AbsentOrAuthorizationParserAppConstructionWiringPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0153AbsentOrAuthorizationParserAppConstructionWiringPlan([
        ...repoPaths,
        "plans/FP-0153-next.md",
      ]),
    ).toBe(false);
    expect(verifyFp0154Absent(repoPaths)).toBe(true);
    expect(verifyFp0154Absent([...repoPaths, "plans/FP-0154-next.md"])).toBe(
      false,
    );
    expect(
      Object.values(
        verifyFp0151RouteIntegrationReadinessPlanningTextRequiredTopics(
          fp0151PlanText,
        ),
      ).every(Boolean),
    ).toBe(true);
  });

  it("derives route-safe parser decisions without raw or token-derived fields", () => {
    const missingDecision =
      deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness({
        authorization_presence: "absent",
        authorization_scheme_classification: "not_evaluated",
        credential_material_observed: false,
        failure_state: "missing_authorization",
      });
    const unsupportedDecision =
      deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness({
        authorization_presence: "present",
        authorization_scheme_classification: "unsupported",
        credential_material_observed: false,
        failure_state: "unsupported_scheme",
      });
    const observedDecision =
      deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness({
        authorization_presence: "present",
        authorization_scheme_classification: "bearer",
        credential_material_observed: true,
        failure_state: null,
      });
    const decisionFields = Object.keys(missingDecision);

    expect(decisionFields).toEqual([
      ...READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS,
    ]);
    expect(missingDecision).toMatchObject({
      envelope_failure: null,
      maps_to_fp0130_missing_token_lane: true,
      maps_to_fp0139_result_envelope: false,
    });
    expect(unsupportedDecision).toMatchObject({
      envelope_failure: "unsupported_validation_mode",
      maps_to_fp0130_missing_token_lane: false,
      maps_to_fp0139_result_envelope: true,
    });
    expect(observedDecision).toMatchObject({
      credential_material_observed: true,
      envelope_failure: null,
      parser_failure_state: null,
    });
    for (const forbiddenField of [
      "authorization_header",
      "raw_authorization",
      "raw_header",
      "raw_token",
      "token",
      "token_fingerprint",
      ...FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
    ]) {
      expect(decisionFields).not.toContain(forbiddenField);
    }
  });

  it("records dependency injection, route sequencing, and future proof prerequisites", () => {
    const repoPaths = repoFilePaths();
    const fp0150PlanText = safeRead(
      FP0150_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
    );
    const fp0151PlanText = safeRead(
      FP0151_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_PLAN_PATH,
    );
    const proof =
      buildReadOnlyMcpAuthorizationParserRouteDecisionReadinessProof({
        fp0150PlanText,
        fp0151PlanText,
        repoPaths,
      });

    expect(Object.values(proof).filter(Boolean).length).toBeGreaterThan(40);
    expect(Object.values(proof).every((value) => value !== false)).toBe(true);
    expect(
      READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_DEPENDENCY_INJECTION_REQUIREMENTS,
    ).toContain("route_parser_dependency_optional_and_explicitly_injected");
    expect(READ_ONLY_MCP_AUTHORIZATION_PARSER_FUTURE_ROUTE_SEQUENCE).toContain(
      "missing_token_precedence_before_parser_invalid_malformed_route_decision",
    );
    expect(
      READ_ONLY_MCP_AUTHORIZATION_PARSER_FUTURE_IMPLEMENTATION_PROOF_PREREQUISITES,
    ).toContain("app_construction_dependency_injection_proof_green");
    expect(
      verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary({
        fp0150PlanText,
        fp0151PlanText,
        repoPaths,
      }),
    ).toBe(true);
  });

  it("preserves missing-token precedence, downstream invalid-token challenge, and metadata route posture", () => {
    const routeSource = safeRead(mcpRoutePath);
    const metadataRouteSource = safeRead(metadataRoutePath);
    const invalidTokenChallengeSource = safeRead(invalidTokenChallengePath);

    expect(routeSource).not.toContain(
      "read-only-app-mcp-authorization-parser-route-integration-readiness",
    );
    expect(routeSource).not.toContain("read-only-app-mcp-authorization-parser");
    expect(metadataRouteSource).not.toContain(
      "read-only-app-mcp-authorization-parser",
    );
    expect(countMatches(routeSource, /app\.post\("\/mcp"/gu)).toBe(1);
    expect(countMatches(routeSource, /app\.get\("\/mcp"/gu)).toBe(1);
    expect(
      countMatches(
        routeSource,
        /readOnlyAppMcpLocalProofGatedMissingTokenChallenge/gu,
      ),
    ).toBe(3);
    expect(
      countMatches(
        routeSource,
        /readOnlyAppMcpInvalidTokenChallengeResultEnvelope/gu,
      ),
    ).toBe(3);
    expect(countMatches(metadataRouteSource, /app\.get\(/gu)).toBe(1);
    expect(invalidTokenChallengeSource).toContain(
      "buildReadOnlyAppMcpInvalidTokenChallengeResponse",
    );
  });

  it("keeps readiness fixtures token-clean and the shared sanitizer strict", () => {
    const safeFixtureText = [
      safeRead(readinessPath),
      safeRead(readinessSpecPath),
      safeRead(readinessProofPath),
    ].join("\n");
    const unsafeCredentialLine = [
      "authorization",
      ": ",
      "bearer",
      " ",
      ["alpha", "numeric", "fixture"].join(""),
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
    expect(scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted).toBe(
      false,
    );
    expect(scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted).toBe(
      false,
    );
  });

  it("keeps parser readiness local-only and prior boundaries intact", () => {
    const repoPaths = repoFilePaths();
    const readinessSource = safeRead(readinessPath);

    expect(readinessSource).not.toMatch(/from ["']node:/u);
    expect(readinessSource).not.toMatch(
      /\b(?:fetch|setTimeout|setInterval)\s*\(/u,
    );
    expect(readinessSource).not.toMatch(/\b(?:Date|Math\.random)\b/u);
    expect(readinessSource).not.toMatch(/\b(?:console|logger)\s*\./u);
    expect(readinessSource).not.toMatch(/apps\/control-plane|fastify/iu);
    expect(readinessSource).not.toMatch(/packages\/db|drizzle|sql`/iu);
    expect(readinessSource).not.toMatch(/api\.openai\.com/iu);
    expect(readinessSource).not.toMatch(
      /\b(?:parseJwt|decodeJwt|jwtDecode|jwksClient|introspectToken|oauthCallback|sessionStore|providerConnect)\s*\(/iu,
    );
    expect(
      verifyReadOnlyMcpAuthorizationParserImplementationBoundary(repoPaths),
    ).toMatchObject({
      authorizationParserPureDomainImplementationBoundaryVerified: true,
      fp0151AbsentOrRouteIntegrationReadinessPlanVerified: true,
      parserRouteConsumptionStillBlocked: true,
      productionTokenValidationRuntimeStillBlocked: true,
    });
    expect(
      verifyFp0149AbsentOrAuthorizationParserPureDomainImplementationPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0150AbsentOrAuthorizationParserRouteIntegrationSequencingPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0148AuthorizationParserImplementationReadinessPlanBoundary({
        planText: safeRead(
          FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
        ),
        repoPaths,
      }),
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
      verifyFp0150AuthorizationParserRouteIntegrationSequencingPlanBoundary({
        planText: safeRead(
          FP0150_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0150CloseoutFreshnessForFp0151(
        safeRead(
          FP0150_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_SEQUENCING_PLAN_PATH,
        ),
      ),
    ).toBe(true);
    expect(
      safeRead(
        FP0149_AUTHORIZATION_PARSER_PURE_DOMAIN_IMPLEMENTATION_PLAN_PATH,
      ),
    ).toContain("PR #328 merged");
  });
});

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
