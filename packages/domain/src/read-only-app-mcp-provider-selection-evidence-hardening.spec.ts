import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { TOKEN_VALIDATION_FAILURE_TAXONOMY } from "./read-only-app-mcp-token-validation-result-envelope";
import { scanTokenValidationNoLeakage } from "./read-only-app-mcp-token-validation";
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
  FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
  FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
  verifyFp0146ParserContractProviderSelectionProofPlanBoundary,
  verifyFp0147AbsentOrProviderSelectionEvidenceHardeningPlan,
  verifyFp0148Absent,
  verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  FP0147_AUTHORIZATION_SERVER_DISCOVERY_EVIDENCE_REQUIREMENTS,
  FP0147_AUDIENCE_RESOURCE_BINDING_EVIDENCE_REQUIREMENTS,
  FP0147_CANONICAL_RESOURCE_EVIDENCE_REQUIREMENTS,
  FP0147_DEV_TEST_TENANT_REQUIREMENTS,
  FP0147_METADATA_URL_SSRF_SAFETY_REQUIREMENTS,
  FP0147_MTLS_EGRESS_ALLOWLIST_FUTURE_REQUIREMENTS,
  FP0147_NO_CREDENTIAL_FORWARDING_EVIDENCE_REQUIREMENTS,
  FP0147_NO_TOKEN_PASSTHROUGH_EVIDENCE_REQUIREMENTS,
  FP0147_PROTECTED_RESOURCE_METADATA_EVIDENCE_REQUIREMENTS,
  FP0147_PROVIDER_EVIDENCE_FAILURE_MAPPINGS,
  FP0147_PROVIDER_EVIDENCE_FAILURE_STATES,
  FP0147_PROVIDER_EVIDENCE_MATRIX,
  FP0147_PROVIDER_MODE,
  FP0147_REPLAY_REVOCATION_SERVICE_UNAVAILABLE_REQUIREMENTS,
  FP0147_RESOURCE_INDICATOR_EVIDENCE_REQUIREMENTS,
  FP0147_SCOPE_RBAC_ORG_COMPANY_EVIDENCE_REQUIREMENTS,
  buildFp0147ProviderSelectionEvidenceHardeningProof,
  verifyFp0147PlanningTextRequiredTopics,
  verifyFp0147ProviderEvidenceFailureStateMapping,
  verifyFp0147ProviderSelectionEvidenceHardeningPlanBoundary,
  verifyFp0147ProviderSelectionEvidenceHardeningProof,
} from "./read-only-app-mcp-provider-selection-evidence-hardening";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const mcpRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const metadataRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";

describe("FP-0147 provider-selection evidence hardening", () => {
  it("accepts exactly one FP-0147 evidence-hardening plan while the exact FP-0148 readiness follow-up may exist", () => {
    const repoPaths = repoFilePaths();
    const repoPathsWithoutFp0148 = repoPaths.filter(
      (path) =>
        path !== FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
    );
    const planText = safeRead(
      FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0147/u.test(path))).toEqual([
      FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
    ]);
    expect(
      verifyFp0147AbsentOrProviderSelectionEvidenceHardeningPlan(repoPaths),
    ).toBe(true);
    expect(verifyFp0148Absent(repoPathsWithoutFp0148)).toBe(true);
    expect(
      verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0147ProviderSelectionEvidenceHardeningPlanBoundary({
        planText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0147AbsentOrProviderSelectionEvidenceHardeningPlan([
        ...repoPaths,
        "plans/FP-0147-runtime.md",
      ]),
    ).toBe(false);
    expect(
      verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan([
        ...repoPaths,
        "plans/FP-0148-runtime.md",
      ]),
    ).toBe(false);
  });

  it("keeps provider mode deferred and blocks provider, parser, runtime, OAuth, route, DB, and public-submission scope", () => {
    const proof = buildFp0147ProviderSelectionEvidenceHardeningProof();

    expect(proof.fp0147ProviderSelectionEvidenceHardeningProofOnly).toBe(true);
    expect(proof.providerMode).toBe(FP0147_PROVIDER_MODE);
    expect(proof.providerEvidenceMatrix).toEqual([
      ...FP0147_PROVIDER_EVIDENCE_MATRIX,
    ]);
    expect(
      proof.providerEvidenceMatrix.every(
        ({ providerSelected }) => !providerSelected,
      ),
    ).toBe(true);
    expect(proof.providerModeCanBeSelectedAfterFp0147).toBe(false);
    expect(proof.noProviderCalls).toBe(true);
    expect(proof.noProviderIntegration).toBe(true);
    expect(proof.noAuthorizationParserImplementation).toBe(true);
    expect(proof.noProductionTokenValidationRuntime).toBe(true);
    expect(proof.noTokenParserImplementation).toBe(true);
    expect(proof.noJwtDecoderImplementation).toBe(true);
    expect(proof.noJwksFetchImplementation).toBe(true);
    expect(proof.noTokenIntrospectionImplementation).toBe(true);
    expect(proof.noOauthImplementation).toBe(true);
    expect(proof.noTokenSessionStorage).toBe(true);
    expect(proof.noAuthMiddleware).toBe(true);
    expect(proof.noRouteBehaviorChange).toBe(true);
    expect(proof.noDbSchemaPackageWork).toBe(true);
    expect(proof.noOpenAiApiOrModelCalls).toBe(true);
    expect(
      proof.noPublicAssetsGeneratedPublicProseSubmissionExternalCommsOrAutonomousAction,
    ).toBe(true);
    expect(verifyFp0147ProviderSelectionEvidenceHardeningProof()).toBe(true);
  });

  it("records canonical resource, metadata, discovery, binding, no-passthrough, URL-safety, outage, tenant, and mTLS evidence", () => {
    const proof = buildFp0147ProviderSelectionEvidenceHardeningProof();

    expect(proof.canonicalResourceEvidenceRequirements).toEqual([
      ...FP0147_CANONICAL_RESOURCE_EVIDENCE_REQUIREMENTS,
    ]);
    expect(proof.protectedResourceMetadataEvidenceRequirements).toEqual([
      ...FP0147_PROTECTED_RESOURCE_METADATA_EVIDENCE_REQUIREMENTS,
    ]);
    expect(proof.authorizationServerDiscoveryEvidenceRequirements).toEqual([
      ...FP0147_AUTHORIZATION_SERVER_DISCOVERY_EVIDENCE_REQUIREMENTS,
    ]);
    expect(proof.resourceIndicatorEvidenceRequirements).toEqual([
      ...FP0147_RESOURCE_INDICATOR_EVIDENCE_REQUIREMENTS,
    ]);
    expect(proof.audienceResourceBindingEvidenceRequirements).toEqual([
      ...FP0147_AUDIENCE_RESOURCE_BINDING_EVIDENCE_REQUIREMENTS,
    ]);
    expect(proof.scopeRbacOrgCompanyEvidenceRequirements).toEqual([
      ...FP0147_SCOPE_RBAC_ORG_COMPANY_EVIDENCE_REQUIREMENTS,
    ]);
    expect(proof.noTokenPassthroughEvidenceRequirements).toEqual([
      ...FP0147_NO_TOKEN_PASSTHROUGH_EVIDENCE_REQUIREMENTS,
    ]);
    expect(proof.noCredentialForwardingEvidenceRequirements).toEqual([
      ...FP0147_NO_CREDENTIAL_FORWARDING_EVIDENCE_REQUIREMENTS,
    ]);
    expect(proof.metadataUrlSsrfSafetyRequirements).toEqual([
      ...FP0147_METADATA_URL_SSRF_SAFETY_REQUIREMENTS,
    ]);
    expect(proof.replayRevocationServiceUnavailableRequirements).toEqual([
      ...FP0147_REPLAY_REVOCATION_SERVICE_UNAVAILABLE_REQUIREMENTS,
    ]);
    expect(proof.devTestTenantRequirements).toEqual([
      ...FP0147_DEV_TEST_TENANT_REQUIREMENTS,
    ]);
    expect(proof.mtlsEgressAllowlistFutureRequirements).toEqual([
      ...FP0147_MTLS_EGRESS_ALLOWLIST_FUTURE_REQUIREMENTS,
    ]);
  });

  it("maps provider evidence failures to FP-0139 envelopes or a named future-only refusal state", () => {
    const allowedFailures = [
      ...TOKEN_VALIDATION_FAILURE_TAXONOMY,
      "future_only_provider_evidence_refusal",
    ];

    expect(
      FP0147_PROVIDER_EVIDENCE_FAILURE_MAPPINGS.map(
        ({ failureState }) => failureState,
      ),
    ).toEqual([...FP0147_PROVIDER_EVIDENCE_FAILURE_STATES]);
    expect(
      FP0147_PROVIDER_EVIDENCE_FAILURE_MAPPINGS.every(
        ({ envelopeFailure, futureRuntimeOnly, noTokenEcho }) =>
          allowedFailures.includes(envelopeFailure) &&
          futureRuntimeOnly &&
          noTokenEcho,
      ),
    ).toBe(true);
    expect(
      FP0147_PROVIDER_EVIDENCE_FAILURE_MAPPINGS.find(
        ({ failureState }) => failureState === "metadata_url_unsafe",
      ),
    ).toMatchObject({
      envelopeFailure: "future_only_provider_evidence_refusal",
    });
    expect(verifyFp0147ProviderEvidenceFailureStateMapping()).toBe(true);
  });

  it("proves FP-0146 closeout freshness, route posture, and earlier boundaries remain intact", () => {
    const repoPaths = repoFilePaths();
    const fp0147PlanText = safeRead(
      FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
    );

    expect(
      Object.values(
        verifyFp0147PlanningTextRequiredTopics(fp0147PlanText),
      ).every(Boolean),
    ).toBe(true);
    expect(fp0146CloseoutFreshnessVerified()).toBe(true);
    expect(routePosturePreserved()).toEqual({
      invalidTokenChallengeBehaviorUnchanged: true,
      metadataRouteBehaviorUnchanged: true,
      missingTokenBehaviorUnchanged: true,
      mcpRouteBehaviorUnchanged: true,
    });
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
    expect(noForbiddenNewScopeText(fp0147PlanText)).toBe(true);
  });
});

function fp0146CloseoutFreshnessVerified() {
  const normalized = normalize(
    safeRead(
      FP0146_AUTHORIZATION_PARSER_CONTRACTS_PROVIDER_SELECTION_PLAN_PATH,
    ),
  );
  return (
    normalized.includes("pr #325 merged") &&
    normalized.includes("a14f7f75475b56147891446bc3d514247d6b9360") &&
    normalized.includes("273d690c6897bad703df6bf59605ec28e120d633") &&
    normalized.includes(
      "same-branch qa found no issues and made no correction",
    ) &&
    normalized.includes("no post-merge qa is required")
  );
}

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
      routeSource.includes(
        "readOnlyAppMcpLocalProofGatedMissingTokenChallenge",
      ) &&
      routeSource.includes(
        "buildMcpWwwAuthenticateMissingTokenChallengeResponse",
      ),
    mcpRouteBehaviorUnchanged:
      countMatches(routeSource, /app\.post\("\/mcp"/gu) === 1 &&
      countMatches(routeSource, /app\.get\("\/mcp"/gu) === 1,
  };
}

function noForbiddenNewScopeText(text: string) {
  const leakage = scanTokenValidationNoLeakage(text);
  return (
    leakage.accepted &&
    !/\b(?:db:migrate|db:generate|create table|alter table|api\.openai\.com|submit app)\b/iu.test(
      text,
    )
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
