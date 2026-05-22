import {
  MCP_WWW_AUTHENTICATE_CHALLENGE_SCHEME,
  MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE,
  TokenValidationResultEnvelopeSchema,
  scanTokenValidationNoLeakage,
  type TokenValidationFailureTaxonomy,
  type TokenValidationResultEnvelope,
  type TokenValidationWwwAuthenticateErrorSymbol,
} from "@pocket-cto/domain";

type TokenValidationRequiredScope =
  TokenValidationResultEnvelope["requiredScopes"][number];

export type ReadOnlyAppMcpInvalidTokenChallengeStatus = 400 | 401 | 403;

export type ReadOnlyAppMcpInvalidTokenChallengeHeaderError =
  | "invalid_request"
  | "invalid_token"
  | "insufficient_scope";

export type ReadOnlyAppMcpInvalidTokenChallengeResponse = {
  readonly statusCode: ReadOnlyAppMcpInvalidTokenChallengeStatus;
  readonly wwwAuthenticate: string;
  readonly body: {
    readonly error: ReadOnlyAppMcpInvalidTokenChallengeHeaderError;
    readonly invalidTokenChallengeOnly: true;
    readonly localOnly: true;
    readonly message: string;
    readonly noAuthMiddlewareImplementation: true;
    readonly noJwtDecodingRuntime: true;
    readonly noOauthImplementation: true;
    readonly noProductionTokenValidationRuntime: true;
    readonly noTokenEcho: true;
    readonly noTokenIntrospectionRuntime: true;
    readonly noTokenParsingRuntime: true;
    readonly noTokenSessionStorage: true;
    readonly readOnly: true;
    readonly requiredScopes?: readonly TokenValidationRequiredScope[];
    readonly resourceMetadata: typeof MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE;
    readonly symbolicWwwAuthenticateError: TokenValidationWwwAuthenticateErrorSymbol;
  };
  readonly descriptor: {
    readonly consumesFp0139ResultEnvelopeOnly: true;
    readonly failure: TokenValidationFailureTaxonomy;
    readonly invalidTokenChallengeRuntimeImplemented: true;
    readonly jsonRpcRefusalEnvelopeStillSeparate: true;
    readonly localInvalidTokenChallengeRuntimeOnly: true;
    readonly missingTokenBehaviorStillSeparate: true;
    readonly noTokenEcho: true;
    readonly protectedResourceMetadataRouteBehaviorStillSeparate: true;
    readonly requiredScopes: readonly TokenValidationRequiredScope[];
    readonly resourceMetadata: typeof MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE;
    readonly statusCode: ReadOnlyAppMcpInvalidTokenChallengeStatus;
    readonly symbolicWwwAuthenticateError: TokenValidationWwwAuthenticateErrorSymbol;
    readonly wwwAuthenticateHeaderError: ReadOnlyAppMcpInvalidTokenChallengeHeaderError;
  };
};

export class ReadOnlyAppMcpInvalidTokenChallengeEnvelopeError extends Error {
  constructor(readonly rejectionReasons: readonly string[]) {
    super(rejectionReasons.join(", "));
    this.name = "ReadOnlyAppMcpInvalidTokenChallengeEnvelopeError";
  }
}

export function buildReadOnlyAppMcpInvalidTokenChallengeResponse(
  input: unknown,
): ReadOnlyAppMcpInvalidTokenChallengeResponse {
  const envelope = parseInvalidTokenChallengeEnvelope(input);
  const statusCode = statusCodeForFailure(envelope.failure);
  const headerError = headerErrorForEnvelope(envelope);
  const requiredScopes =
    envelope.failure === "insufficient_scope" ? envelope.requiredScopes : [];
  const wwwAuthenticate = buildWwwAuthenticateHeader({
    headerError,
    requiredScopes,
  });

  return {
    statusCode,
    wwwAuthenticate,
    body: {
      error: headerError,
      invalidTokenChallengeOnly: true,
      localOnly: true,
      message: messageForStatus(statusCode),
      noAuthMiddlewareImplementation: true,
      noJwtDecodingRuntime: true,
      noOauthImplementation: true,
      noProductionTokenValidationRuntime: true,
      noTokenEcho: true,
      noTokenIntrospectionRuntime: true,
      noTokenParsingRuntime: true,
      noTokenSessionStorage: true,
      readOnly: true,
      ...(requiredScopes.length > 0 ? { requiredScopes } : {}),
      resourceMetadata: MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE,
      symbolicWwwAuthenticateError: envelope.wwwAuthenticateError,
    },
    descriptor: {
      consumesFp0139ResultEnvelopeOnly: true,
      failure: envelope.failure,
      invalidTokenChallengeRuntimeImplemented: true,
      jsonRpcRefusalEnvelopeStillSeparate: true,
      localInvalidTokenChallengeRuntimeOnly: true,
      missingTokenBehaviorStillSeparate: true,
      noTokenEcho: true,
      protectedResourceMetadataRouteBehaviorStillSeparate: true,
      requiredScopes,
      resourceMetadata: MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE,
      statusCode,
      symbolicWwwAuthenticateError: envelope.wwwAuthenticateError,
      wwwAuthenticateHeaderError: headerError,
    },
  };
}

export function assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(
  input: unknown,
): { accepted: boolean; rejectionReasons: readonly string[] } {
  const text = stringifyUnknown(input);
  const leakageScan = scanTokenValidationNoLeakage(text);
  const schema = TokenValidationResultEnvelopeSchema.safeParse(input);
  const rejectionReasons = [...leakageScan.rejectionReasons];

  if (!schema.success) {
    rejectionReasons.push("fp0139_result_envelope_required");
    return {
      accepted: false,
      rejectionReasons: [...new Set(rejectionReasons)],
    };
  }

  rejectionReasons.push(...envelopeBoundaryRejections(schema.data));

  return {
    accepted: rejectionReasons.length === 0,
    rejectionReasons: [...new Set(rejectionReasons)],
  };
}

function parseInvalidTokenChallengeEnvelope(
  input: unknown,
): TokenValidationResultEnvelope & {
  failure: Exclude<TokenValidationFailureTaxonomy, "missing_token">;
} {
  const assessment = assessReadOnlyAppMcpInvalidTokenChallengeEnvelope(input);
  if (!assessment.accepted) {
    throw new ReadOnlyAppMcpInvalidTokenChallengeEnvelopeError(
      assessment.rejectionReasons,
    );
  }

  return TokenValidationResultEnvelopeSchema.parse(input) as TokenValidationResultEnvelope & {
    failure: Exclude<TokenValidationFailureTaxonomy, "missing_token">;
  };
}

function envelopeBoundaryRejections(
  envelope: TokenValidationResultEnvelope,
): readonly string[] {
  const rejectionReasons: string[] = [];

  if (envelope.accepted) rejectionReasons.push("accepted_envelope_rejected");
  if (envelope.failure === null) rejectionReasons.push("failure_required");
  if (envelope.failure === "missing_token") {
    rejectionReasons.push("missing_token_behavior_separate");
  }
  if (envelope.httpPosture.statusCode === null) {
    rejectionReasons.push("http_challenge_status_required");
  }
  if (
    envelope.failure !== null &&
    envelope.failure !== "missing_token" &&
    envelope.httpPosture.statusCode !== statusCodeForFailure(envelope.failure)
  ) {
    rejectionReasons.push("http_posture_mismatch");
  }
  if (envelope.routeResponseEmitted || envelope.httpPosture.routeResponseEmitted) {
    rejectionReasons.push("route_response_must_not_be_pre_emitted");
  }
  if (envelope.wwwAuthenticateHeaderEmitted) {
    rejectionReasons.push("www_authenticate_header_must_not_be_pre_emitted");
  }
  if (!envelope.noTokenEchoBoundary || envelope.noTokenEchoBoundary.rawTokenEchoed) {
    rejectionReasons.push("no_token_echo_boundary_required");
  }
  if (
    envelope.proofModeOnlyBoundary.tokenParsingPerformed ||
    envelope.proofModeOnlyBoundary.tokenIntrospectionPerformed ||
    envelope.proofModeOnlyBoundary.productionValidationPerformed ||
    envelope.proofModeOnlyBoundary.authMiddlewareImplemented
  ) {
    rejectionReasons.push("proof_mode_runtime_boundary_required");
  }

  return rejectionReasons;
}

function statusCodeForFailure(
  failure: Exclude<TokenValidationFailureTaxonomy, "missing_token">,
): ReadOnlyAppMcpInvalidTokenChallengeStatus {
  if (failure === "malformed_authorization") return 400;
  if (failure === "insufficient_scope") return 403;
  return 401;
}

function headerErrorForEnvelope(
  envelope: TokenValidationResultEnvelope & {
    failure: Exclude<TokenValidationFailureTaxonomy, "missing_token">;
  },
): ReadOnlyAppMcpInvalidTokenChallengeHeaderError {
  if (envelope.wwwAuthenticateError === "invalid_request") {
    return "invalid_request";
  }
  if (envelope.wwwAuthenticateError === "insufficient_scope") {
    return "insufficient_scope";
  }
  return "invalid_token";
}

function buildWwwAuthenticateHeader(input: {
  headerError: ReadOnlyAppMcpInvalidTokenChallengeHeaderError;
  requiredScopes: readonly TokenValidationRequiredScope[];
}) {
  const parameters = [
    `error="${input.headerError}"`,
    `resource_metadata="${MCP_WWW_AUTHENTICATE_LOCAL_RESOURCE_METADATA_REFERENCE}"`,
  ];
  if (input.headerError === "insufficient_scope" && input.requiredScopes.length > 0) {
    parameters.push(`scope="${input.requiredScopes.join(" ")}"`);
  }

  return `${MCP_WWW_AUTHENTICATE_CHALLENGE_SCHEME} ${parameters.join(", ")}`;
}

function messageForStatus(statusCode: ReadOnlyAppMcpInvalidTokenChallengeStatus) {
  if (statusCode === 400) {
    return "The supplied credential shape is invalid for this local read-only MCP preview.";
  }
  if (statusCode === 403) {
    return "The supplied credential envelope lacks the required read-only scope for this local MCP preview.";
  }
  return "The supplied credential envelope is invalid for this local read-only MCP preview.";
}

function stringifyUnknown(input: unknown) {
  try {
    return typeof input === "string" ? input : JSON.stringify(input);
  } catch {
    return "";
  }
}
