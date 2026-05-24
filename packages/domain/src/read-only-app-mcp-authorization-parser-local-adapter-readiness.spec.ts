import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH,
  FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
  FP0153_AUTHORIZATION_PARSER_APP_CONSTRUCTION_WIRING_PLAN_PATH,
  verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan,
  verifyFp0155Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS,
  deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness,
} from "./read-only-app-mcp-authorization-parser-route-integration-readiness";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";
import {
  MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_READINESS_SCHEMA_VERSION,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_COMPOSITION,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_FAILURE_MAPPING,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_INPUT_BOUNDARY,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_OUTPUT_BOUNDARY,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_TEST_MATRIX,
  buildReadOnlyMcpAuthorizationParserLocalAdapterReadinessProof,
  verifyFp0153CloseoutFreshnessForFp0154,
  verifyFp0154LocalAdapterConstructionReadinessPlanningTextRequiredTopics,
  verifyReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundary,
} from "./read-only-app-mcp-authorization-parser-local-adapter-readiness";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const readinessPath =
  "packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter-readiness.ts";
const readinessSpecPath =
  "packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter-readiness.spec.ts";
const readinessProofPath =
  "tools/read-only-mcp-authorization-parser-local-adapter-construction-readiness-proof.mjs";
const appPath = "apps/control-plane/src/app.ts";
const appSpecPath = "apps/control-plane/src/app.spec.ts";
const bootstrapPath = "apps/control-plane/src/bootstrap.ts";
const routePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const routeSpecPath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.spec.ts";

describe("FP-0154 Authorization parser local adapter construction readiness", () => {
  it("accepts exactly one FP-0154 readiness path while FP-0155 remains absent", () => {
    const repoPaths = repoFilePaths();
    const fp0154PlanText = safeRead(
      FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH,
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0154/u.test(path))).toEqual([
      FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH,
    ]);
    expect(
      verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan([
        ...repoPaths,
        "plans/FP-0154-runtime-adapter.md",
      ]),
    ).toBe(false);
    expect(repoPaths.filter((path) => /(^|\/)FP-0155/u.test(path))).toEqual(
      [],
    );
    expect(verifyFp0155Absent(repoPaths)).toBe(true);
    expect(verifyFp0155Absent([...repoPaths, "plans/FP-0155-next.md"])).toBe(
      false,
    );
    expect(
      Object.values(
        verifyFp0154LocalAdapterConstructionReadinessPlanningTextRequiredTopics(
          fp0154PlanText,
        ),
      ).every(Boolean),
    ).toBe(true);
  });

  it("records readiness-only input, output, composition, failure mapping, and test matrix", () => {
    const repoPaths = repoFilePaths();
    const fp0153PlanText = safeRead(
      FP0153_AUTHORIZATION_PARSER_APP_CONSTRUCTION_WIRING_PLAN_PATH,
    );
    const fp0154PlanText = safeRead(
      FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH,
    );
    const proof =
      buildReadOnlyMcpAuthorizationParserLocalAdapterReadinessProof({
        fp0153PlanText,
        fp0154PlanText,
        repoPaths,
      });

    expect(proof.schemaVersion).toBe(
      MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_READINESS_SCHEMA_VERSION,
    );
    expect(Object.values(proof).every((value) => value !== false)).toBe(true);
    expect(READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_INPUT_BOUNDARY).toMatchObject(
      {
        allowedKeys: ["authorizationHeader"],
        mustNotRetainStoreLogEchoNormalizeHashDigestFingerprintOrForward: true,
      },
    );
    expect(
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_OUTPUT_BOUNDARY
        .routeSafeDecisionFields,
    ).toEqual([...READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS]);
    expect(READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_COMPOSITION).toEqual(
      [
        "may_call_existing_pure_parser_classifier",
        "may_call_route_decision_readiness_derivation_helper",
        "must_not_call_routes",
        "must_not_call_app_construction",
        "must_not_call_db_provider_openai_network_time_random_crypto_env_logger_apis",
      ],
    );
    expect(
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_FAILURE_MAPPING.map(
        ({ mapsTo }) => mapsTo,
      ),
    ).toContain("invalid_token");
    expect(READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_TEST_MATRIX).toEqual(
      [
        "absent_header",
        "empty_header",
        "unsupported_scheme_safe_sentinel",
        "malformed_scheme_safe_sentinel",
        "structural_multiple_values",
        "safe_bearer_credential_present_sentinel",
        "unsafe_whitespace_or_control_safe_sentinel",
        "passthrough_attempt_sentinel",
      ],
    );
    expect(
      verifyReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundary({
        fp0153PlanText,
        fp0154PlanText,
        repoPaths,
      }),
    ).toBe(true);
  });

  it("constrains future adapter output to route-safe decision fields only", () => {
    const missingDecision =
      deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness({
        authorization_presence: "absent",
        authorization_scheme_classification: "not_evaluated",
        credential_material_observed: false,
        failure_state: "missing_authorization",
      });
    const decisionFields = Object.keys(missingDecision);

    expect(decisionFields).toEqual([
      ...READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS,
    ]);
    for (const forbiddenField of [
      "authorization_header",
      "raw_authorization_header",
      "raw_header",
      "raw_token",
      "token",
      "token_fingerprint",
      ...FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
    ]) {
      expect(decisionFields).not.toContain(forbiddenField);
    }
  });

  it("adds no adapter implementation, adapter factory export, app construction, or route construction", () => {
    const readinessSource = safeRead(readinessPath);
    const appSource = safeRead(appPath);
    const appSpecSource = safeRead(appSpecPath);
    const bootstrapSource = safeRead(bootstrapPath);
    const routeSource = safeRead(routePath);
    const routeSpecSource = safeRead(routeSpecPath);

    expect(readinessSource).not.toMatch(
      /\b(?:create|build|make)ReadOnlyMcpAuthorizationParserLocalAdapter\b/u,
    );
    expect(readinessSource).not.toMatch(/\bLocalAdapterFactory\b/u);
    expect(appSource).not.toContain(
      "read-only-app-mcp-authorization-parser-local-adapter-readiness",
    );
    expect(bootstrapSource).not.toContain(
      "readOnlyAppMcpAuthorizationParserRouteDecision:",
    );
    expect(routeSource).not.toContain(
      "read-only-app-mcp-authorization-parser-local-adapter-readiness",
    );
    expect(routeSource).not.toContain(
      "read-only-app-mcp-authorization-parser\"",
    );
    expect(appSpecSource).toContain(
      "does not construct a parser route-decision dependency in default containers or app construction",
    );
    expect(routeSpecSource).toContain(
      "fails closed before /mcp route registration when parser dependency lacks the invalid-token challenge lane",
    );
  });

  it("keeps readiness files token-clean and the shared sanitizer strict", () => {
    const safeFixtureText = [
      safeRead(readinessPath),
      safeRead(readinessSpecPath),
      safeRead(readinessProofPath),
      safeRead(
        FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH,
      ),
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

  it("preserves FP-0153 freshness and runtime/provider/OAuth/auth guardrails", () => {
    const readinessSource = safeRead(readinessPath);
    const fp0153PlanText = safeRead(
      FP0153_AUTHORIZATION_PARSER_APP_CONSTRUCTION_WIRING_PLAN_PATH,
    );
    const proof =
      buildReadOnlyMcpAuthorizationParserLocalAdapterReadinessProof({
        fp0153PlanText,
        fp0154PlanText: safeRead(
          FP0154_AUTHORIZATION_PARSER_LOCAL_ADAPTER_CONSTRUCTION_READINESS_PLAN_PATH,
        ),
        repoPaths: repoFilePaths(),
      });

    expect(verifyFp0153CloseoutFreshnessForFp0154(fp0153PlanText)).toBe(true);
    expect(readinessSource).not.toMatch(/from ["']node:/u);
    expect(readinessSource).not.toMatch(
      /\b(?:fetch|setTimeout|setInterval)\s*\(/u,
    );
    expect(readinessSource).not.toMatch(
      /\b(?:Date|Math\.random|crypto|process\.env)\s*(?:\.|\()/u,
    );
    expect(readinessSource).not.toMatch(/\b(?:console|logger)\s*\./u);
    expect(readinessSource).not.toMatch(/apps\/control-plane|fastify/iu);
    expect(readinessSource).not.toMatch(/packages\/db|drizzle|sql`/iu);
    expect(readinessSource).not.toMatch(/api\.openai\.com/iu);
    expect(readinessSource).not.toMatch(
      /\b(?:parseJwt|decodeJwt|jwtDecode|jwksClient|introspectToken|oauthCallback|sessionStore|providerConnect)\s*\(/iu,
    );
    expect(proof).toMatchObject({
      authMiddlewareStillBlocked: true,
      fp0100PublicSecurityBoundaryStillVerified: true,
      fp0106ProtocolEnvelopeBoundaryStillVerified: true,
      fp0107RouteAdapterBoundaryStillVerified: true,
      fp0125ProtectedResourceMetadataRouteBoundaryStillVerified: true,
      fp0130MissingTokenChallengeBoundaryStillVerified: true,
      fp0139ResultEnvelopeBoundaryStillVerified: true,
      fp0141InvalidTokenLocalRuntimeBoundaryStillVerified: true,
      fp0143InvalidTokenAppWiringBoundaryStillVerified: true,
      fp0149ParserImplementationBoundaryStillVerified: true,
      fp0151RouteReadinessBoundaryStillVerified: true,
      fp0152RouteIntegrationBoundaryStillVerified: true,
      fp0153AppConstructionWiringBoundaryStillVerified: true,
      jwtDecoderImplementationStillBlocked: true,
      oauthImplementationStillBlocked: true,
      productionTokenValidationRuntimeStillBlocked: true,
      providerCallsStillBlocked: true,
      tokenParserImplementationStillBlocked: true,
    });
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
