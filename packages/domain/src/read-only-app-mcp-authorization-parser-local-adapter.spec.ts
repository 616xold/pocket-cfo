import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS,
} from "./read-only-app-mcp-authorization-parser";
import {
  FP0155_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_PLAN_PATH,
  verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan,
  verifyFp0156Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS,
} from "./read-only-app-mcp-authorization-parser-route-integration-readiness";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";
import {
  MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_SCHEMA_VERSION,
  buildReadOnlyMcpAuthorizationParserLocalAdapterImplementationProof,
  createReadOnlyMcpAuthorizationParserRouteDecisionDependency,
  verifyFp0154CloseoutFreshnessForFp0155,
  verifyFp0155LocalAdapterImplementationPlanningTextRequiredTopics,
  verifyReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundary,
} from "./read-only-app-mcp-authorization-parser-local-adapter";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const adapterPath =
  "packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter.ts";
const adapterSpecPath =
  "packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter.spec.ts";
const appPath = "apps/control-plane/src/app.ts";
const bootstrapPath = "apps/control-plane/src/bootstrap.ts";
const routePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const fp0154Path =
  "plans/FP-0154-read-only-chatgpt-app-mcp-authorization-parser-local-adapter-construction-readiness.md";

describe("FP-0155 Authorization parser local adapter implementation", () => {
  it("accepts exactly one FP-0155 implementation plan while FP-0156 remains absent", () => {
    const repoPaths = repoFilePaths();
    const fp0155PlanText = safeRead(
      FP0155_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_PLAN_PATH,
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0155/u.test(path))).toEqual([
      FP0155_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_PLAN_PATH,
    ]);
    expect(
      verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan([
        ...repoPaths,
        "plans/FP-0155-next.md",
      ]),
    ).toBe(false);
    expect(verifyFp0156Absent(repoPaths)).toBe(true);
    expect(
      verifyFp0156Absent([...repoPaths, "plans/FP-0156-next.md"]),
    ).toBe(false);
    expect(
      Object.values(
        verifyFp0155LocalAdapterImplementationPlanningTextRequiredTopics(
          fp0155PlanText,
        ),
      ).every(Boolean),
    ).toBe(true);
  });

  it("creates an explicit route-decision dependency and maps safe sentinel inputs", () => {
    const dependency =
      createReadOnlyMcpAuthorizationParserRouteDecisionDependency();

    expect(typeof dependency).toBe("function");
    expect(dependency({})).toMatchObject({
      authorization_presence: "absent",
      authorization_scheme_classification: "not_evaluated",
      envelope_failure: null,
      maps_to_fp0130_missing_token_lane: true,
      maps_to_fp0139_result_envelope: false,
      parser_failure_state: "missing_authorization",
    });
    expect(dependency({ authorizationHeader: "" })).toMatchObject({
      envelope_failure: "malformed_authorization",
      maps_to_fp0139_result_envelope: true,
      parser_failure_state: "malformed_authorization",
    });
    expect(
      dependency({ authorizationHeader: "Digest [not-a-token]" }),
    ).toMatchObject({
      envelope_failure: "unsupported_validation_mode",
      parser_failure_state: "unsupported_scheme",
    });
    expect(
      dependency({ authorizationHeader: "??? [not-a-token]" }),
    ).toMatchObject({
      envelope_failure: "malformed_authorization",
      parser_failure_state: "malformed_authorization",
    });
    expect(
      dependency({
        authorizationHeader: [
          "Digest [not-a-token]",
          "Digest [not-a-token]",
        ],
      }),
    ).toMatchObject({
      envelope_failure: "malformed_authorization",
      parser_failure_state: "multiple_authorization_values",
    });
    expect(
      dependency({
        authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent}`,
      }),
    ).toMatchObject({
      authorization_scheme_classification: "bearer",
      credential_material_observed: true,
      envelope_failure: null,
      invalid_token_challenge_downstream_only: true,
      parser_failure_state: null,
    });
    expect(
      dependency({
        authorizationHeader: `Bearer  ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent}`,
      }),
    ).toMatchObject({
      envelope_failure: "malformed_authorization",
      parser_failure_state:
        "bearer_with_unsafe_whitespace_or_control_characters",
    });
    expect(
      dependency({
        authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.passthroughAttempt}`,
      }),
    ).toMatchObject({
      envelope_failure: "invalid_token",
      parser_failure_state: "token_material_passthrough_attempt",
    });
  });

  it("limits adapter output to route-safe fields and no credential-derived fields", () => {
    const dependency =
      createReadOnlyMcpAuthorizationParserRouteDecisionDependency();
    const decision = dependency({
      authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent}`,
    });
    const decisionFields = Object.keys(decision);

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
      "token_prefix",
      "token_suffix",
      "token_length",
      "token_hash",
      "token_digest",
      "token_claims",
      "decoded_header",
      "decoded_payload",
    ]) {
      expect(decisionFields).not.toContain(forbiddenField);
    }
  });

  it("does not throw on malformed safe-sentinel inputs", () => {
    const dependency =
      createReadOnlyMcpAuthorizationParserRouteDecisionDependency();

    for (const authorizationHeader of [
      "",
      "??? [not-a-token]",
      `Bearer  ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent}`,
      `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.passthroughAttempt}`,
      ["Digest [not-a-token]", "Digest [not-a-token]"],
    ]) {
      expect(() => dependency({ authorizationHeader })).not.toThrow();
    }
  });

  it("keeps the adapter pure-domain and out of app construction and routes", () => {
    const adapterSource = safeRead(adapterPath);
    const appSource = safeRead(appPath);
    const bootstrapSource = safeRead(bootstrapPath);
    const routeSource = safeRead(routePath);

    expect(adapterSource).not.toMatch(
      /from ["'](?:node:|.*apps\/|.*control-plane|.*\/routes|.*packages\/db|openai|jsonwebtoken|jose)/u,
    );
    expect(adapterSource).not.toMatch(
      /\b(?:fetch|setTimeout|setInterval|crypto|process\.env|console\.|logger\.|jwtDecode|jwtVerify|introspectToken|oauthCallback|tokenExchange|setCookie)\b/u,
    );
    expect(appSource).not.toContain(
      "read-only-app-mcp-authorization-parser-local-adapter",
    );
    expect(bootstrapSource).not.toContain(
      "readOnlyAppMcpAuthorizationParserRouteDecision:",
    );
    expect(routeSource).not.toContain(
      "read-only-app-mcp-authorization-parser-local-adapter",
    );
    expect(routeSource).not.toContain(
      "createReadOnlyMcpAuthorizationParserRouteDecisionDependency",
    );
  });

  it("keeps fixtures token-clean and verifies the implementation proof", () => {
    const repoPaths = repoFilePaths();
    const fp0154PlanText = safeRead(fp0154Path);
    const fp0155PlanText = safeRead(
      FP0155_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_PLAN_PATH,
    );
    const safeFixtureText = [
      safeRead(adapterPath),
      safeRead(adapterSpecPath),
      fp0155PlanText,
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
    const proof =
      buildReadOnlyMcpAuthorizationParserLocalAdapterImplementationProof({
        fp0154PlanText,
        fp0155PlanText,
        repoPaths,
      });

    expect(proof.schemaVersion).toBe(
      MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_SCHEMA_VERSION,
    );
    expect(Object.values(proof).every((value) => value !== false)).toBe(true);
    expect(scanProofOnlyNoTokenLeakageText(safeFixtureText).accepted).toBe(
      true,
    );
    expect(scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted).toBe(
      false,
    );
    expect(scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted).toBe(
      false,
    );
    expect(verifyFp0154CloseoutFreshnessForFp0155(fp0154PlanText)).toBe(true);
    expect(
      verifyReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundary({
        fp0154PlanText,
        fp0155PlanText,
        repoPaths,
      }),
    ).toBe(true);
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
