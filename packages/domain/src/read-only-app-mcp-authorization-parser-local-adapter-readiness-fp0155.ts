import {
  READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS,
} from "./read-only-app-mcp-authorization-parser";
import { FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS } from "./read-only-app-mcp-authorization-parser-contracts";
import { READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_TEST_MATRIX } from "./read-only-app-mcp-authorization-parser-local-adapter-readiness";
import {
  READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS,
  type ReadOnlyMcpAuthorizationParserRouteDecisionDependency,
  type ReadOnlyMcpAuthorizationParserRouteDecisionReadiness,
} from "./read-only-app-mcp-authorization-parser-route-integration-readiness";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";

export const READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_FORBIDDEN_OUTPUT_FIELDS =
  [
    "authorization_header",
    "raw_authorization_header",
    "raw_header",
    "raw_token",
    "token",
    "token_fingerprint",
    ...FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
  ] as const;

export function buildReadOnlyMcpAuthorizationParserLocalAdapterFixtureDecisions(
  dependency: ReadOnlyMcpAuthorizationParserRouteDecisionDependency,
) {
  return {
    absentHeader: dependency({}),
    emptyHeader: dependency({ authorizationHeader: "" }),
    unsupportedScheme: dependency({
      authorizationHeader: "Digest [not-a-token]",
    }),
    malformedScheme: dependency({ authorizationHeader: "??? [not-a-token]" }),
    structuralMultipleValues: dependency({
      authorizationHeader: ["Digest [not-a-token]", "Digest [not-a-token]"],
    }),
    safeBearerCredentialPresent: dependency({
      authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent}`,
    }),
    unsafeWhitespaceOrControl: dependency({
      authorizationHeader: `Bearer  ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent}`,
    }),
    passthroughAttempt: dependency({
      authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.passthroughAttempt}`,
    }),
  } as const satisfies Record<
    string,
    ReadOnlyMcpAuthorizationParserRouteDecisionReadiness
  >;
}

export function readOnlyMcpAuthorizationParserLocalAdapterOutputFieldsMatchRouteSafeDecision(
  fields: readonly string[],
) {
  return (
    fields.length === READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS.length &&
    READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS.every(
      (field) => fields.includes(field),
    ) &&
    READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_FORBIDDEN_OUTPUT_FIELDS.every(
      (field) => !fields.includes(field),
    )
  );
}

export function readOnlyMcpAuthorizationParserLocalAdapterOutputFieldsContainNoForbiddenFields(
  fields: readonly string[],
) {
  return READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_FORBIDDEN_OUTPUT_FIELDS.every(
    (field) => !fields.includes(field),
  );
}

export function verifyReadOnlyMcpAuthorizationParserLocalAdapterSharedSanitizerStillStrict() {
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

  return (
    scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted === false &&
    scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted === false
  );
}

export function verifyFp0155LocalAdapterImplementationPlanningTextRequiredTopics(
  planText: string,
) {
  const normalized = normalizePlanText(planText);

  return {
    fp0155Scope: includesAll(normalized, [
      "fp-0155 is the v2bw read-only chatgpt app/mcp authorization parser local route-decision adapter implementation slice",
      "pure-domain/local-only explicit factory implementation",
    ]),
    defaultConstructionBlocked: includesAll(normalized, [
      "default adapter construction is not included",
      "app construction may not construct the adapter",
      "route code may not construct the adapter",
    ]),
    buildAppRouteBehaviorUnchanged: includesAll(normalized, [
      "default `buildapp()` behavior remains unchanged",
      "does not change `buildapp()` or `/mcp` behavior",
    ]),
    runtimeProviderOauthBlocked: includesAll(normalized, [
      "production token-validation runtime cannot start",
      "provider selection cannot start",
      "oauth/session/auth middleware cannot start",
      "public chatgpt app demo/submission cannot start",
    ]),
    inputBoundary: includesAll(normalized, [
      "{ authorizationheader?: string | readonly string[] | null }",
      "never returns, retains, stores, logs, echoes",
      "hashes, digests, fingerprints, or forwards",
    ]),
    outputBoundary: includesAll(normalized, [
      "returns exactly `readonlymcpauthorizationparserroutedecisionreadiness`",
      "route-safe decision fields",
      "token-derived prefix/suffix/length/hash/digest",
    ]),
    composition: includesAll(normalized, [
      "may call `classifyreadonlymcpauthorizationheader`",
      "may call `derivereadonlymcpauthorizationparserroutedecisionreadiness`",
      "may not call routes",
      "may not call app construction",
      "db/provider/openai/network/time/random/crypto/env/logger",
    ]),
    failureMapping: includesAll(normalized, [
      "missing authorization maps to fp-0130",
      "malformed authorization maps to fp-0139",
      "unsupported scheme maps to unsupported_validation_mode",
      "bearer without material maps to malformed_authorization",
      "unsafe whitespace/control maps to malformed_authorization",
      "passthrough attempt maps to invalid_token",
      "credential-observed/bearer-present remains",
    ]),
    testMatrix:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_TEST_MATRIX.every(
        (entry) => includesTestMatrixEntry(normalized, entry),
      ) &&
      normalized.includes(
        "no realistic token/jwt or bearer-scheme credential examples",
      ),
    futureFp0156Boundary: includesAll(normalized, [
      "future fp-0156 may open only",
      "explicit app-construction injection",
      "adapter implementation correction",
      "proof-gate correction",
      "must not implement default app construction",
      "must not implement production token validation",
    ]),
    priorBoundaries: includesAll(normalized, [
      "preserve fp-0154 local adapter readiness",
      "fp-0153 app-construction wiring",
      "fp-0152 route integration",
      "fp-0151 route readiness",
      "fp-0150 route sequencing",
      "fp-0149 parser implementation",
      "fp-0148 readiness",
      "fp-0147 provider-selection evidence",
      "fp-0146 parser contracts",
      "fp-0145 runtime contracts",
      "fp-0144 production token-validation sequencing",
      "fp-0143 app wiring",
      "fp-0142 route sequencing",
      "fp-0141 invalid-token local runtime",
      "fp-0139 result envelopes",
      "fp-0130 missing-token challenge",
      "fp-0125 protected-resource metadata route",
      "fp-0107 route adapter",
      "fp-0106 protocol envelope",
      "fp-0100 security boundary",
    ]),
  };
}

function includesTestMatrixEntry(normalized: string, entry: string) {
  return (
    normalized.includes(entry.replaceAll("_", " ")) ||
    (entry === "safe_bearer_credential_present_sentinel" &&
      normalized.includes("safe bearer-scheme credential-present sentinel")) ||
    (entry === "unsafe_whitespace_or_control_safe_sentinel" &&
      normalized.includes("unsafe whitespace/control safe sentinel")) ||
    (entry === "passthrough_attempt_sentinel" &&
      normalized.includes("passthrough-attempt sentinel"))
  );
}

function includesAll(text: string, values: readonly string[]) {
  return values.every((value) => text.includes(value));
}

function normalizePlanText(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
