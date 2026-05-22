import { describe, expect, it } from "vitest";
import {
  MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE,
  buildTokenValidationResultEnvelope,
  buildTokenValidationResultEnvelopeInputDescriptor,
  scanTokenValidationNoLeakage,
  type TokenValidationFailureTaxonomy,
} from "@pocket-cto/domain";
import {
  ReadOnlyAppMcpInvalidTokenChallengeEnvelopeError,
  assessReadOnlyAppMcpInvalidTokenChallengeEnvelope,
  buildReadOnlyAppMcpInvalidTokenChallengeResponse,
} from "./invalid-token-challenge";

describe("read-only app MCP invalid-token challenge adapter", () => {
  it("accepts sanitized FP-0139 result envelopes only", () => {
    const envelope = envelopeFor("invalid_token");
    const response = buildReadOnlyAppMcpInvalidTokenChallengeResponse(envelope);

    expect(
      assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(envelope).accepted,
    ).toBe(true);
    expect(response.statusCode).toBe(401);
    expect(response.descriptor.consumesFp0139ResultEnvelopeOnly).toBe(true);
    expect(response.descriptor.localInvalidTokenChallengeRuntimeOnly).toBe(
      true,
    );
    expect(response.body.noTokenEcho).toBe(true);
  });

  it("rejects raw descriptors, raw token material, bearer material, and JWT-like strings", () => {
    const rawDescriptor = buildTokenValidationResultEnvelopeInputDescriptor({
      outcome: "invalid_token",
    });
    const rawMaterial = { rawToken: ["proof", "token", "material"].join("-") };
    const bearerMaterial = [
      "Bearer",
      ["proof", "token", "material"].join("-"),
    ].join(" ");
    const jwtLikeMaterial = [
      ["jwtlikeheader"].join("").padEnd(12, "x"),
      ["jwtlikepayload"].join("").padEnd(12, "x"),
      ["jwtlikesignature"].join("").padEnd(12, "x"),
    ].join(".");

    for (const input of [
      rawDescriptor,
      rawMaterial,
      bearerMaterial,
      jwtLikeMaterial,
    ]) {
      const assessment =
        assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(input);
      expect(assessment.accepted).toBe(false);
      expect(() =>
        buildReadOnlyAppMcpInvalidTokenChallengeResponse(input),
      ).toThrow(ReadOnlyAppMcpInvalidTokenChallengeEnvelopeError);
    }
  });

  it("maps malformed authorization to 400 invalid_request posture", () => {
    const response = buildReadOnlyAppMcpInvalidTokenChallengeResponse(
      envelopeFor("malformed_authorization"),
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("invalid_request");
    expect(response.wwwAuthenticate).toContain('error="invalid_request"');
    expect(response.wwwAuthenticate).toContain(
      `resource_metadata="${MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE}"`,
    );
  });

  it("maps invalid, expired, and revoked token failures to 401 invalid_token posture", () => {
    for (const failure of [
      "invalid_token",
      "expired_token",
      "revoked_token",
    ] as const) {
      const response = buildReadOnlyAppMcpInvalidTokenChallengeResponse(
        envelopeFor(failure),
      );

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("invalid_token");
      expect(response.wwwAuthenticate).toContain('error="invalid_token"');
      expect(response.descriptor.symbolicWwwAuthenticateError).toBe(
        "invalid_token",
      );
    }
  });

  it("maps insufficient scope to 403 and preserves required scope guidance", () => {
    const envelope = buildTokenValidationResultEnvelope(
      buildTokenValidationResultEnvelopeInputDescriptor({
        outcome: "insufficient_scope",
        requiredScopes: ["mcp:read", "evidence:read"],
      }),
    );
    const response = buildReadOnlyAppMcpInvalidTokenChallengeResponse(envelope);

    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe("insufficient_scope");
    expect(response.body.requiredScopes).toEqual([
      "mcp:read",
      "evidence:read",
    ]);
    expect(response.wwwAuthenticate).toContain(
      'scope="mcp:read evidence:read"',
    );
    expect(response.descriptor.symbolicWwwAuthenticateError).toBe(
      "insufficient_scope",
    );
  });

  it("preserves resource metadata dependency and JSON-RPC separation without token echo", () => {
    const response = buildReadOnlyAppMcpInvalidTokenChallengeResponse(
      envelopeFor("wrong_org"),
    );
    const serialized = JSON.stringify(response);

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("invalid_token");
    expect(response.body.symbolicWwwAuthenticateError).toBe(
      "fail_closed_non_leaking",
    );
    expect(response.descriptor.resourceMetadata).toBe(
      MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE,
    );
    expect(response.descriptor.jsonRpcRefusalEnvelopeStillSeparate).toBe(true);
    expect(response.body).not.toHaveProperty("jsonrpc");
    expect(scanTokenValidationNoLeakage(serialized).accepted).toBe(true);
  });

  it("keeps accepted and missing-token envelopes separate", () => {
    for (const input of [acceptedEnvelope(), envelopeFor("missing_token")]) {
      const assessment =
        assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(input);
      expect(assessment.accepted).toBe(false);
      expect(assessment.rejectionReasons).toEqual(
        expect.arrayContaining([
          input.failure === "missing_token"
            ? "missing_token_behavior_separate"
            : "accepted_envelope_rejected",
        ]),
      );
    }
  });
});

function acceptedEnvelope() {
  return buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor(),
  );
}

function envelopeFor(failure: TokenValidationFailureTaxonomy) {
  return buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor({
      outcome: failure,
    }),
  );
}
