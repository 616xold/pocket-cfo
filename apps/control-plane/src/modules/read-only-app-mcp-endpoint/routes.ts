import type { FastifyInstance, FastifyReply } from "fastify";
import {
  assertMcpWwwAuthenticateMissingTokenChallengeMetadataRouteCoRegistration,
  assertProtectedResourceMetadataRouteInputEvidenceBundleAcceptedForLocalRouteRegistration,
  buildMcpWwwAuthenticateAuthorizationHeaderNoValidationResponse,
  buildMcpWwwAuthenticateMissingTokenChallengeResponse,
  type McpProtectedResourceMetadataRouteInputEvidenceBundle,
  type McpWwwAuthenticateLocalProofGatedMissingTokenChallengeDependency,
  type ReadOnlyMcpAuthorizationParserRouteDecisionDependency,
  type ReadOnlyMcpAuthorizationParserRouteDecisionReadiness,
} from "@pocket-cto/domain";
import {
  ReadOnlyAppMcpEndpointService,
  type ReadOnlyAppMcpEndpointResult,
} from "./service";
import {
  validateLocalMcpOriginHeader,
  type McpOriginValidationResult,
} from "./schema";
import { buildReadOnlyAppMcpInvalidTokenChallengeResponse } from "./invalid-token-challenge";

export async function registerReadOnlyAppMcpEndpointRoutes(
  app: FastifyInstance,
  deps: {
    readOnlyAppMcpEndpointService?: Pick<
      ReadOnlyAppMcpEndpointService,
      "handle"
    >;
    readOnlyAppMcpLocalProofGatedMissingTokenChallenge?: McpWwwAuthenticateLocalProofGatedMissingTokenChallengeDependency;
    readOnlyAppMcpProtectedResourceMetadataRouteInputEvidenceBundle?: McpProtectedResourceMetadataRouteInputEvidenceBundle;
    readOnlyAppMcpInvalidTokenChallengeResultEnvelope?: unknown;
    readOnlyAppMcpAuthorizationParserRouteDecision?: ReadOnlyMcpAuthorizationParserRouteDecisionDependency;
  } = {},
) {
  const service =
    deps.readOnlyAppMcpEndpointService ?? new ReadOnlyAppMcpEndpointService();
  const missingTokenChallenge =
    deps.readOnlyAppMcpLocalProofGatedMissingTokenChallenge === undefined
      ? null
      : assertMcpWwwAuthenticateMissingTokenChallengeMetadataRouteCoRegistration(
          {
            missingTokenChallenge:
              deps.readOnlyAppMcpLocalProofGatedMissingTokenChallenge,
            protectedResourceMetadataRouteInputEvidenceBundle:
              deps.readOnlyAppMcpProtectedResourceMetadataRouteInputEvidenceBundle,
          },
        ).missingTokenChallenge;
  const invalidTokenChallenge =
    deps.readOnlyAppMcpInvalidTokenChallengeResultEnvelope === undefined
      ? null
      : assertInvalidTokenChallengeCoRegistration({
          invalidTokenChallengeResultEnvelope:
            deps.readOnlyAppMcpInvalidTokenChallengeResultEnvelope,
          missingTokenChallenge,
          protectedResourceMetadataRouteInputEvidenceBundle:
            deps.readOnlyAppMcpProtectedResourceMetadataRouteInputEvidenceBundle,
        });

  app.get("/mcp", async (request, reply) => {
    const originValidation = validateLocalMcpOriginHeader(
      request.headers.origin,
    );
    if (!originValidation.allowed) {
      return sendOriginRejected(reply, originValidation);
    }

    return reply.header("Allow", "POST").code(405).send();
  });

  app.post("/mcp", async (request, reply) => {
    const originValidation = validateLocalMcpOriginHeader(
      request.headers.origin,
    );
    if (!originValidation.allowed) {
      return sendOriginRejected(reply, originValidation);
    }

    if (missingTokenChallenge && request.headers.authorization === undefined) {
      const challenge = buildMcpWwwAuthenticateMissingTokenChallengeResponse(
        missingTokenChallenge,
      );
      return reply
        .header("WWW-Authenticate", challenge.wwwAuthenticate)
        .code(challenge.statusCode)
        .send(challenge.body);
    }

    const parserRouteDecision =
      deps.readOnlyAppMcpAuthorizationParserRouteDecision === undefined
        ? null
        : deps.readOnlyAppMcpAuthorizationParserRouteDecision({
            authorizationHeader: request.headers.authorization,
          });

    if (
      invalidTokenChallenge &&
      parserRouteDecision !== null &&
      routesToExistingInvalidTokenChallenge(parserRouteDecision)
    ) {
      return reply
        .header("WWW-Authenticate", invalidTokenChallenge.wwwAuthenticate)
        .code(invalidTokenChallenge.statusCode)
        .send(invalidTokenChallenge.body);
    }

    if (invalidTokenChallenge && request.headers.authorization !== undefined) {
      return reply
        .header("WWW-Authenticate", invalidTokenChallenge.wwwAuthenticate)
        .code(invalidTokenChallenge.statusCode)
        .send(invalidTokenChallenge.body);
    }

    if (missingTokenChallenge) {
      const failClosed =
        buildMcpWwwAuthenticateAuthorizationHeaderNoValidationResponse();
      return reply.code(failClosed.statusCode).send(failClosed.body);
    }

    const response: ReadOnlyAppMcpEndpointResult = service.handle(request.body);

    if (response === null) {
      return reply.code(202).send();
    }

    return response;
  });
}

function routesToExistingInvalidTokenChallenge(
  decision: ReadOnlyMcpAuthorizationParserRouteDecisionReadiness,
) {
  return (
    decision.authorization_presence === "present" &&
    decision.invalid_token_challenge_downstream_only &&
    !decision.maps_to_fp0130_missing_token_lane &&
    (decision.maps_to_fp0139_result_envelope ||
      decision.credential_material_observed)
  );
}

function assertInvalidTokenChallengeCoRegistration(input: {
  invalidTokenChallengeResultEnvelope: unknown;
  missingTokenChallenge: McpWwwAuthenticateLocalProofGatedMissingTokenChallengeDependency | null;
  protectedResourceMetadataRouteInputEvidenceBundle?: McpProtectedResourceMetadataRouteInputEvidenceBundle;
}) {
  if (input.missingTokenChallenge === null) {
    throw new Error(
      "Invalid-token challenge requires missing-token challenge co-registration",
    );
  }

  if (input.protectedResourceMetadataRouteInputEvidenceBundle === undefined) {
    throw new Error(
      "Invalid-token challenge requires protected-resource metadata route evidence dependency",
    );
  }

  assertProtectedResourceMetadataRouteInputEvidenceBundleAcceptedForLocalRouteRegistration(
    input.protectedResourceMetadataRouteInputEvidenceBundle,
  );

  return buildReadOnlyAppMcpInvalidTokenChallengeResponse(
    input.invalidTokenChallengeResultEnvelope,
  );
}

function sendOriginRejected(
  reply: FastifyReply,
  validation: Extract<McpOriginValidationResult, { allowed: false }>,
) {
  return reply.code(403).send({
    error: "Forbidden Origin header",
    failClosed: true,
    localRouteAdapterOnly: true,
    reason: validation.reason,
  });
}
