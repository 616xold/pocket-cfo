import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH,
  FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH,
  FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
  FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
  TOKEN_VALIDATION_FAILURE_TAXONOMY,
  TokenValidationResultEnvelopeProofSchema,
  TokenValidationResultEnvelopeSchema,
  assessTokenValidationResultEnvelopeDescriptorNoTokenMaterial,
  buildTokenValidationResultEnvelope,
  buildTokenValidationResultEnvelopeInputDescriptor,
  buildTokenValidationResultEnvelopeProof,
  scanTokenValidationNoLeakage,
  verifyExactTokenValidationResultEnvelopeFailureTaxonomy,
  verifyFp0138TokenValidationRuntimeImplementationPlanningBoundary,
  verifyFp0139AbsentOrLocalProofModeTokenValidationResultEnvelope,
  verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary,
  verifyFp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanning,
  verifyFp0141Absent,
  verifyFp0141AbsentOrLocalInvalidTokenChallengeRuntime,
  verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary,
  verifyFp0142Absent,
  verifyTokenValidationResultEnvelopeBoundaryFields,
  verifyTokenValidationResultEnvelopeHttpPostureMapping,
  verifyTokenValidationResultEnvelopeNoTokenMaterialRejection,
  verifyTokenValidationResultEnvelopeRequiredScopesSanitized,
} from "./index";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const mcpRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const metadataRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";

describe("FP-0139 token-validation result envelopes", () => {
  it("accepts FP-0139 result envelopes, FP-0140 planning, and exactly one FP-0141 runtime plan while FP-0142 remains absent", () => {
    const repoPaths = repoFilePaths();
    const planText = safeRead(
      FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH,
    );
    const fp0138PlanText = safeRead(
      FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH,
    );
    const fp0140PlanText = safeRead(
      FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
    );
    const fp0141PlanText = safeRead(
      FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0139/u.test(path))).toEqual([
      FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH,
    ]);
    expect(repoPaths.filter((path) => /(^|\/)FP-0140/u.test(path))).toEqual([
      FP0140_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_PLANNING_PLAN_PATH,
    ]);
    expect(repoPaths.filter((path) => /(^|\/)FP-0141/u.test(path))).toEqual([
      FP0141_INVALID_TOKEN_CHALLENGE_LOCAL_RUNTIME_IMPLEMENTATION_PLAN_PATH,
    ]);
    expect(
      verifyFp0139AbsentOrLocalProofModeTokenValidationResultEnvelope({
        planText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary({
        planText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanning({
        planText: fp0140PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(verifyFp0141Absent(repoPaths)).toBe(true);
    expect(
      verifyFp0141AbsentOrLocalInvalidTokenChallengeRuntime({
        planText: fp0141PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0141LocalInvalidTokenChallengeRuntimeBoundary({
        planText: fp0141PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(verifyFp0142Absent(repoPaths)).toBe(true);
    expect(
      verifyFp0138TokenValidationRuntimeImplementationPlanningBoundary({
        planText: fp0138PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0139AbsentOrLocalProofModeTokenValidationResultEnvelope({
        planText,
        repoPaths: [...repoPaths, "plans/FP-0139-extra-runtime.md"],
      }),
    ).toBe(false);
    expect(
      verifyFp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanning({
        planText: fp0140PlanText,
        repoPaths: [...repoPaths, "plans/FP-0140-next.md"],
      }),
    ).toBe(false);
    expect(
      verifyFp0141AbsentOrLocalInvalidTokenChallengeRuntime({
        planText: fp0141PlanText,
        repoPaths: [...repoPaths, "plans/FP-0141-next.md"],
      }),
    ).toBe(false);
    expect(verifyFp0142Absent([...repoPaths, "plans/FP-0142-next.md"])).toBe(
      false,
    );
  });

  it("builds accepted and rejected result envelopes from sanitized descriptors only", () => {
    const accepted = buildTokenValidationResultEnvelope(
      buildTokenValidationResultEnvelopeInputDescriptor(),
    );
    const rejected = buildTokenValidationResultEnvelope(
      buildTokenValidationResultEnvelopeInputDescriptor({
        outcome: "wrong_resource",
      }),
    );

    expect(
      TokenValidationResultEnvelopeSchema.safeParse(accepted).success,
    ).toBe(true);
    expect(accepted.accepted).toBe(true);
    expect(accepted.failure).toBeNull();
    expect(accepted.routeResponseEmitted).toBe(false);
    expect(accepted.wwwAuthenticateHeaderEmitted).toBe(false);
    expect(rejected.accepted).toBe(false);
    expect(rejected.failure).toBe("wrong_resource");
    expect(rejected.issuerAudienceResourcePosture.resource).toBe(
      "rejected_descriptor",
    );
    expect(rejected.noTokenEchoBoundary.carriesRawToken).toBe(false);
  });

  it("rejects raw token, Bearer, and JWT-like descriptor material", () => {
    const jwtLikeInput = [
      ["jwtlikeheader"],
      ["jwtlikepayload"],
      ["jwtlikesignature"],
    ]
      .map((part) => part.join("").padEnd(12, "x"))
      .join(".");
    const forbiddenInputs = [
      { rawToken: ["proof", "token", "material"].join("-") },
      ["Bearer", "proof-token-material"].join(" "),
      jwtLikeInput,
    ];

    for (const input of forbiddenInputs) {
      expect(
        assessTokenValidationResultEnvelopeDescriptorNoTokenMaterial(input)
          .accepted,
      ).toBe(false);
      expect(() => buildTokenValidationResultEnvelope(input)).toThrow();
    }
    expect(verifyTokenValidationResultEnvelopeNoTokenMaterialRejection()).toBe(
      true,
    );
  });

  it("keeps the failure taxonomy closed and exact", () => {
    expect(TOKEN_VALIDATION_FAILURE_TAXONOMY).toEqual([
      "missing_token",
      "malformed_authorization",
      "invalid_token",
      "expired_token",
      "revoked_token",
      "wrong_audience",
      "wrong_resource",
      "insufficient_scope",
      "wrong_org",
      "company_binding_mismatch",
      "replay_or_nonce_failure",
      "unsupported_validation_mode",
      "production_validation_unavailable",
    ]);
    expect(verifyExactTokenValidationResultEnvelopeFailureTaxonomy()).toBe(
      true,
    );
  });

  it("maps HTTP posture deterministically without emitting route responses", () => {
    const malformed = envelopeFor("malformed_authorization");
    const insufficientScope = envelopeFor("insufficient_scope");
    const invalid = envelopeFor("invalid_token");
    const expired = envelopeFor("expired_token");
    const revoked = envelopeFor("revoked_token");

    expect(malformed.httpPosture.statusCode).toBe(400);
    expect(malformed.wwwAuthenticateError).toBe("invalid_request");
    expect(insufficientScope.httpPosture.statusCode).toBe(403);
    expect(insufficientScope.wwwAuthenticateError).toBe("insufficient_scope");
    expect(invalid.httpPosture.statusCode).toBe(401);
    expect(expired.httpPosture.statusCode).toBe(401);
    expect(revoked.httpPosture.statusCode).toBe(401);
    for (const envelope of [
      malformed,
      insufficientScope,
      invalid,
      expired,
      revoked,
    ]) {
      expect(envelope.routeResponseEmitted).toBe(false);
      expect(envelope.httpPosture.routeResponseEmitted).toBe(false);
      expect(envelope.wwwAuthenticateHeaderEmitted).toBe(false);
    }
    expect(verifyTokenValidationResultEnvelopeHttpPostureMapping()).toBe(true);
  });

  it("fails audience, resource, org, and company binding closed without leakage", () => {
    const wrongAudience = envelopeFor("wrong_audience");
    const wrongResource = envelopeFor("wrong_resource");
    const wrongOrg = envelopeFor("wrong_org");
    const companyMismatch = envelopeFor("company_binding_mismatch");

    expect(wrongAudience.issuerAudienceResourcePosture.audience).toBe(
      "rejected_descriptor",
    );
    expect(wrongResource.issuerAudienceResourcePosture.resource).toBe(
      "rejected_descriptor",
    );
    expect(wrongOrg.subjectOrgCompanyBindingPosture.failClosedNonLeaking).toBe(
      true,
    );
    expect(wrongOrg.subjectOrgCompanyBindingPosture.org).toBe(
      "mismatch_descriptor",
    );
    expect(
      companyMismatch.subjectOrgCompanyBindingPosture.failClosedNonLeaking,
    ).toBe(true);
    expect(companyMismatch.subjectOrgCompanyBindingPosture.company).toBe(
      "mismatch_descriptor",
    );
    expect(
      scanTokenValidationNoLeakage(JSON.stringify(companyMismatch)).accepted,
    ).toBe(true);
  });

  it("keeps symbolic WWW-Authenticate errors and sanitized required scopes only", () => {
    const insufficientScope = buildTokenValidationResultEnvelope(
      buildTokenValidationResultEnvelopeInputDescriptor({
        outcome: "insufficient_scope",
        requiredScopes: ["mcp:read", "evidence:read"],
      }),
    );

    expect(insufficientScope.wwwAuthenticateError).toBe("insufficient_scope");
    expect(insufficientScope.wwwAuthenticateHeaderEmitted).toBe(false);
    expect(insufficientScope.requiredScopes).toEqual([
      "mcp:read",
      "evidence:read",
    ]);
    expect(
      insufficientScope.requiredScopesBoundary.sanitizedScopeIdentifiersOnly,
    ).toBe(true);
    expect(verifyTokenValidationResultEnvelopeRequiredScopesSanitized()).toBe(
      true,
    );
    const unapprovedScopeDescriptor = {
      outcome: "insufficient_scope",
      requiredScopes: ["mcp:read", "unapproved:scope"],
    } as unknown as Parameters<
      typeof buildTokenValidationResultEnvelopeInputDescriptor
    >[0];
    expect(() =>
      buildTokenValidationResultEnvelopeInputDescriptor(
        unapprovedScopeDescriptor,
      ),
    ).toThrow();
  });

  it("keeps proof-mode, evidence-free, revocation/replay, and no-token-echo boundaries explicit", () => {
    const accepted = buildTokenValidationResultEnvelope(
      buildTokenValidationResultEnvelopeInputDescriptor(),
    );
    const revoked = envelopeFor("revoked_token");
    const replay = envelopeFor("replay_or_nonce_failure");

    expect(accepted.proofModeOnlyBoundary.localProofOnly).toBe(true);
    expect(accepted.proofModeOnlyBoundary.routeRequestRead).toBe(false);
    expect(accepted.proofModeOnlyBoundary.productionValidationPerformed).toBe(
      false,
    );
    expect(
      accepted.evidenceFreeSecurityDecisionBoundary.evidenceInputsUsed,
    ).toBe(false);
    expect(accepted.noTokenEchoBoundary.rawTokenEchoed).toBe(false);
    expect(revoked.revocationReplayPosture.revocation).toBe(
      "revoked_descriptor",
    );
    expect(replay.revocationReplayPosture.replay).toBe(
      "replay_or_nonce_failure_descriptor",
    );
    expect(verifyTokenValidationResultEnvelopeBoundaryFields()).toBe(true);
  });

  it("keeps routes, metadata route, missing-token behavior, and runtime token/OAuth scope untouched", () => {
    const routeSource = safeRead(mcpRoutePath);
    const metadataRouteSource = safeRead(metadataRoutePath);
    const proof = buildTokenValidationResultEnvelopeProof();

    expect(routeSource).not.toContain(
      "read-only-app-mcp-token-validation-result-envelope",
    );
    expect(routeSource).not.toContain(
      "read-only-app-mcp-token-validation-test-double",
    );
    expect(metadataRouteSource).not.toContain(
      "read-only-app-mcp-token-validation-result-envelope",
    );
    expect(metadataRouteSource).not.toMatch(/WWW-Authenticate/iu);
    expect(
      TokenValidationResultEnvelopeProofSchema.safeParse(proof).success,
    ).toBe(true);
    expect(proof.noTokenParsingRuntime).toBe(true);
    expect(proof.noJwtDecodingRuntime).toBe(true);
    expect(proof.noTokenValidationRuntime).toBe(true);
    expect(proof.noTokenIntrospectionRuntime).toBe(true);
    expect(proof.noOauthImplementation).toBe(true);
    expect(proof.noRouteConsumesTestDouble).toBe(true);
  });
});

function envelopeFor(
  outcome: (typeof TOKEN_VALIDATION_FAILURE_TAXONOMY)[number],
) {
  return buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor({ outcome }),
  );
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
      const absolutePath = `${directory}/${entry.name}`;
      if (entry.isDirectory()) walk(absolutePath, relativePath);
      else results.push(relativePath);
    }
  }

  walk(repoRoot);
  return results.sort();
}

function safeRead(path: string) {
  return readFileSync(`${repoRoot}/${path}`, "utf8");
}
