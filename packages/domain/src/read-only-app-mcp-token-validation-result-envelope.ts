import {
  FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH,
  MCP_TOKEN_VALIDATION_RESULT_ENVELOPE_FP0139_PLAN_PREFIX,
  TOKEN_VALIDATION_FAILURE_TAXONOMY,
  TOKEN_VALIDATION_REQUIRED_SCOPE_ALLOWLIST,
  TOKEN_VALIDATION_RESULT_ENVELOPE_SCHEMA_VERSION,
  TokenValidationFailureTaxonomySchema,
  TokenValidationResultEnvelopeInputDescriptorSchema,
  TokenValidationResultEnvelopeProofSchema,
  TokenValidationResultEnvelopeSchema,
  type TokenValidationFailureTaxonomy,
  type TokenValidationHttpPostureRecommendation,
  type TokenValidationIssuerAudienceResourcePosture,
  type TokenValidationResultEnvelope,
  type TokenValidationResultEnvelopeInputDescriptor,
  type TokenValidationResultEnvelopeProof,
  type TokenValidationRevocationReplayPosture,
  type TokenValidationSubjectOrgCompanyBindingPosture,
  type TokenValidationWwwAuthenticateErrorSymbol,
} from "./read-only-app-mcp-token-validation-result-envelope-contracts";
import { scanTokenValidationNoLeakage } from "./read-only-app-mcp-token-validation";

export * from "./read-only-app-mcp-token-validation-result-envelope-contracts";

type Fp0139BoundaryInput =
  | readonly string[]
  | {
      planText?: string;
      repoPaths: readonly string[];
    };

export type TokenValidationResultEnvelopeDescriptorMaterialAssessment = {
  accepted: boolean;
  rejectionReasons: readonly string[];
};

export type TokenValidationResultEnvelopeInputDescriptorInput =
  Partial<TokenValidationResultEnvelopeInputDescriptor>;

export type TokenValidationResultEnvelopeProofInput = Partial<
  Omit<TokenValidationResultEnvelopeProof, "schemaVersion" | "localProofOnly">
>;

export class TokenValidationResultEnvelopeDescriptorError extends Error {
  constructor(readonly rejectionReasons: readonly string[]) {
    super(rejectionReasons.join(", "));
    this.name = "TokenValidationResultEnvelopeDescriptorError";
  }
}

export function buildTokenValidationResultEnvelopeInputDescriptor(
  input: TokenValidationResultEnvelopeInputDescriptorInput = {},
): TokenValidationResultEnvelopeInputDescriptor {
  const outcome = input.outcome ?? "accepted";
  const requiredScopes =
    input.requiredScopes ??
    (outcome === "insufficient_scope" ? ["mcp:read"] : []);

  return TokenValidationResultEnvelopeInputDescriptorSchema.parse({
    schemaVersion: TOKEN_VALIDATION_RESULT_ENVELOPE_SCHEMA_VERSION,
    descriptorKind: "token_validation_result_envelope_input_descriptor",
    descriptorId:
      input.descriptorId ?? `local-proof-${outcome.replace(/_/gu, "-")}`,
    descriptorMode: "local_proof",
    outcome,
    requiredScopes,
    issuerAudienceResourcePosture: input.issuerAudienceResourcePosture,
    revocationReplayPosture: input.revocationReplayPosture,
    subjectOrgCompanyBindingPosture: input.subjectOrgCompanyBindingPosture,
  });
}

export function buildTokenValidationResultEnvelope(
  input: unknown,
): TokenValidationResultEnvelope {
  assertTokenValidationResultEnvelopeDescriptorIsSanitized(input);
  const descriptor =
    TokenValidationResultEnvelopeInputDescriptorSchema.parse(input);
  const failure = descriptor.outcome === "accepted" ? null : descriptor.outcome;
  const accepted = failure === null;
  const requiredScopes = [...descriptor.requiredScopes];

  return TokenValidationResultEnvelopeSchema.parse({
    schemaVersion: TOKEN_VALIDATION_RESULT_ENVELOPE_SCHEMA_VERSION,
    envelopeKind: "token_validation_result_envelope",
    accepted,
    descriptorId: descriptor.descriptorId,
    evidenceFreeSecurityDecisionBoundary:
      buildEvidenceFreeSecurityDecisionBoundary(),
    failure,
    httpPosture: buildHttpPosture(failure),
    issuerAudienceResourcePosture: buildIssuerAudienceResourcePosture(
      descriptor,
      failure,
    ),
    noTokenEchoBoundary: buildNoTokenEchoBoundary(),
    proofModeOnlyBoundary: buildProofModeOnlyBoundary(),
    requiredScopes,
    requiredScopesBoundary: buildRequiredScopesBoundary(requiredScopes),
    revocationReplayPosture: buildRevocationReplayPosture(descriptor, failure),
    routeResponseEmitted: false,
    subjectOrgCompanyBindingPosture: buildSubjectOrgCompanyBindingPosture(
      descriptor,
      failure,
    ),
    wwwAuthenticateError: wwwAuthenticateErrorFor(failure),
    wwwAuthenticateHeaderEmitted: false,
  });
}

export const evaluateTokenValidationResultEnvelopeDescriptor =
  buildTokenValidationResultEnvelope;

export function assessTokenValidationResultEnvelopeDescriptorNoTokenMaterial(
  input: unknown,
): TokenValidationResultEnvelopeDescriptorMaterialAssessment {
  const text = stringifyUnknown(input);
  const leakageScan = scanTokenValidationNoLeakage(text);
  const rejectionReasons = [
    ...leakageScan.rejectionReasons,
    ...forbiddenDescriptorKeyReasons(input),
    ...forbiddenDescriptorValueReasons(text),
  ];

  return {
    accepted: rejectionReasons.length === 0,
    rejectionReasons: [...new Set(rejectionReasons)],
  };
}

export function assertTokenValidationResultEnvelopeDescriptorIsSanitized(
  input: unknown,
): asserts input is TokenValidationResultEnvelopeInputDescriptor {
  const assessment =
    assessTokenValidationResultEnvelopeDescriptorNoTokenMaterial(input);
  if (!assessment.accepted) {
    throw new TokenValidationResultEnvelopeDescriptorError(
      assessment.rejectionReasons,
    );
  }
}

export function buildTokenValidationResultEnvelopeProof(
  input: TokenValidationResultEnvelopeProofInput = {},
): TokenValidationResultEnvelopeProof {
  return TokenValidationResultEnvelopeProofSchema.parse({
    schemaVersion:
      "v2bg.read-only-app-mcp-token-validation-result-envelope-proof.v1",
    localProofOnly: true,
    resultEnvelopeBuilderImplemented:
      input.resultEnvelopeBuilderImplemented ?? true,
    acceptsSanitizedDescriptorOnly:
      input.acceptsSanitizedDescriptorOnly ?? true,
    noRawTokenInputAccepted: input.noRawTokenInputAccepted ?? true,
    noBearerMaterialAccepted: input.noBearerMaterialAccepted ?? true,
    noJwtLikeMaterialAccepted: input.noJwtLikeMaterialAccepted ?? true,
    exactFailureTaxonomyVerified: input.exactFailureTaxonomyVerified ?? true,
    httpPostureRecommendationVerified:
      input.httpPostureRecommendationVerified ?? true,
    wwwAuthenticateErrorSymbolBoundaryVerified:
      input.wwwAuthenticateErrorSymbolBoundaryVerified ?? true,
    requiredScopesSanitizedVerified:
      input.requiredScopesSanitizedVerified ?? true,
    issuerAudienceResourcePostureVerified:
      input.issuerAudienceResourcePostureVerified ?? true,
    subjectOrgCompanyBindingPostureVerified:
      input.subjectOrgCompanyBindingPostureVerified ?? true,
    revocationReplayPostureVerified:
      input.revocationReplayPostureVerified ?? true,
    noTokenEchoBoundaryVerified: input.noTokenEchoBoundaryVerified ?? true,
    evidenceFreeSecurityDecisionBoundaryVerified:
      input.evidenceFreeSecurityDecisionBoundaryVerified ?? true,
    proofModeOnlyBoundaryVerified: input.proofModeOnlyBoundaryVerified ?? true,
    noRouteBehaviorChange: input.noRouteBehaviorChange ?? true,
    noProtectedResourceMetadataRouteBehaviorChange:
      input.noProtectedResourceMetadataRouteBehaviorChange ?? true,
    noMissingTokenChallengeBehaviorChange:
      input.noMissingTokenChallengeBehaviorChange ?? true,
    noInvalidTokenChallengeRuntime:
      input.noInvalidTokenChallengeRuntime ?? true,
    noWwwAuthenticateHeaderEmission:
      input.noWwwAuthenticateHeaderEmission ?? true,
    noTokenParsingRuntime: input.noTokenParsingRuntime ?? true,
    noJwtDecodingRuntime: input.noJwtDecodingRuntime ?? true,
    noTokenValidationRuntime: input.noTokenValidationRuntime ?? true,
    noTokenIntrospectionRuntime: input.noTokenIntrospectionRuntime ?? true,
    noRouteConsumesTestDouble: input.noRouteConsumesTestDouble ?? true,
    noOauthImplementation: input.noOauthImplementation ?? true,
    noTokenSessionStorage: input.noTokenSessionStorage ?? true,
    noAuthMiddlewareImplementation:
      input.noAuthMiddlewareImplementation ?? true,
    noRealTokenExamples: input.noRealTokenExamples ?? true,
    noJwtLikeExamples: input.noJwtLikeExamples ?? true,
    noBearerTokenMaterial: input.noBearerTokenMaterial ?? true,
    noDbQueriesAdded: input.noDbQueriesAdded ?? true,
    noSchemaMigrationsAdded: input.noSchemaMigrationsAdded ?? true,
    noPackageScriptsAdded: input.noPackageScriptsAdded ?? true,
    noOpenAiApiCalls: input.noOpenAiApiCalls ?? true,
    noProviderExternalCalls: input.noProviderExternalCalls ?? true,
    noSourceMutationFinanceWrite: input.noSourceMutationFinanceWrite ?? true,
    fp0139BoundaryVerified: input.fp0139BoundaryVerified ?? true,
    fp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanningVerified:
      input.fp0140AbsentOrDocsOnlyInvalidTokenChallengeImplementationPlanningVerified ??
      true,
    fp0141Absent: input.fp0141Absent ?? true,
    fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified:
      input.fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified ??
      true,
    fp0137InvalidTokenChallengeReadinessBoundaryStillVerified:
      input.fp0137InvalidTokenChallengeReadinessBoundaryStillVerified ?? true,
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified:
      input.fp0136InvalidTokenChallengeContractsBoundaryStillVerified ?? true,
    fp0134SyntheticEvaluatorBoundaryStillVerified:
      input.fp0134SyntheticEvaluatorBoundaryStillVerified ?? true,
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified:
      input.fp0132TokenValidationRuntimeContractsBoundaryStillVerified ?? true,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      input.fp0130MissingTokenChallengeBoundaryStillVerified ?? true,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
      input.fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified ??
      true,
    fp0107RouteAdapterBoundaryStillVerified:
      input.fp0107RouteAdapterBoundaryStillVerified ?? true,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      input.fp0106ProtocolEnvelopeBoundaryStillVerified ?? true,
    fp0100PublicSecurityBoundaryStillVerified:
      input.fp0100PublicSecurityBoundaryStillVerified ?? true,
  });
}

export function verifyExactTokenValidationResultEnvelopeFailureTaxonomy() {
  return (
    TOKEN_VALIDATION_FAILURE_TAXONOMY.length === 13 &&
    TOKEN_VALIDATION_FAILURE_TAXONOMY.every(
      (failureMode) =>
        TokenValidationFailureTaxonomySchema.safeParse(failureMode).success,
    )
  );
}

export function verifyTokenValidationResultEnvelopeHttpPostureMapping() {
  return (
    buildEnvelopeForFailure("malformed_authorization").httpPosture
      .statusCode === 400 &&
    buildEnvelopeForFailure("invalid_token").httpPosture.statusCode === 401 &&
    buildEnvelopeForFailure("expired_token").httpPosture.statusCode === 401 &&
    buildEnvelopeForFailure("revoked_token").httpPosture.statusCode === 401 &&
    buildEnvelopeForFailure("insufficient_scope").httpPosture.statusCode ===
      403 &&
    buildEnvelopeForFailure("wrong_org").subjectOrgCompanyBindingPosture
      .failClosedNonLeaking &&
    buildEnvelopeForFailure("company_binding_mismatch")
      .subjectOrgCompanyBindingPosture.failClosedNonLeaking
  );
}

export function verifyTokenValidationResultEnvelopeRequiredScopesSanitized() {
  const accepted = buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor({
      outcome: "insufficient_scope",
      requiredScopes: [...TOKEN_VALIDATION_REQUIRED_SCOPE_ALLOWLIST],
    }),
  );
  const rejectedBroadScope =
    TokenValidationResultEnvelopeInputDescriptorSchema.safeParse({
      ...buildTokenValidationResultEnvelopeInputDescriptor(),
      requiredScopes: ["admin:write"],
    }).success === false;

  return (
    accepted.requiredScopesBoundary.sanitizedScopeIdentifiersOnly &&
    accepted.requiredScopesBoundary.readOnlyScopesOnly &&
    accepted.requiredScopes.length ===
      TOKEN_VALIDATION_REQUIRED_SCOPE_ALLOWLIST.length &&
    rejectedBroadScope
  );
}

export function verifyTokenValidationResultEnvelopeNoTokenMaterialRejection() {
  return [
    { rawToken: ["proof", "token", "material"].join("-") },
    ["Bearer", "proof-token-material"].join(" "),
    [["jwtlikeheader"], ["jwtlikepayload"], ["jwtlikesignature"]]
      .map((part) => part.join("").padEnd(12, "x"))
      .join("."),
  ].every(
    (input) =>
      !assessTokenValidationResultEnvelopeDescriptorNoTokenMaterial(input)
        .accepted,
  );
}

export function verifyTokenValidationResultEnvelopeBoundaryFields() {
  const accepted = buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor(),
  );
  const rejected = buildEnvelopeForFailure("wrong_resource");

  return (
    accepted.accepted &&
    accepted.failure === null &&
    accepted.httpPosture.statusCode === null &&
    !accepted.routeResponseEmitted &&
    !accepted.wwwAuthenticateHeaderEmitted &&
    accepted.noTokenEchoBoundary.carriesRawToken === false &&
    accepted.proofModeOnlyBoundary.localProofOnly &&
    accepted.evidenceFreeSecurityDecisionBoundary.decisionSource ===
      "sanitized_descriptor_only" &&
    rejected.issuerAudienceResourcePosture.resource === "rejected_descriptor" &&
    rejected.revocationReplayPosture.revocation === "not_evaluated"
  );
}

export function verifyFp0139AbsentOrLocalProofModeTokenValidationResultEnvelope(
  input: Fp0139BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0139Hits = fpPlanHits(
    repoPaths,
    MCP_TOKEN_VALIDATION_RESULT_ENVELOPE_FP0139_PLAN_PREFIX,
  );
  if (fp0139Hits.length === 0) return true;

  return (
    fp0139Hits.length === 1 &&
    fp0139Hits[0] === FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH &&
    (typeof planText !== "string" || fp0139PlanTextBoundaryVerified(planText))
  );
}

export function verifyFp0139LocalProofModeTokenValidationResultEnvelopeBoundary(
  input: Fp0139BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0139Hits = fpPlanHits(
    repoPaths,
    MCP_TOKEN_VALIDATION_RESULT_ENVELOPE_FP0139_PLAN_PREFIX,
  );
  return (
    fp0139Hits.length === 1 &&
    fp0139Hits[0] === FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH &&
    typeof planText === "string" &&
    fp0139PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0139PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    localProofOnlyResultEnvelope:
      normalized.includes("local proof-mode implementation slice") &&
      normalized.includes("sanitized descriptor inputs only") &&
      normalized.includes("structured token-validation result envelopes only"),
    noProductionTokenRuntime:
      normalized.includes("not production token validation") &&
      normalized.includes("no production token validation") &&
      normalized.includes("no token parsing") &&
      normalized.includes("no jwt decoding") &&
      normalized.includes("no token introspection"),
    routeBehaviorPreserved:
      normalized.includes("no invalid-token www-authenticate route behavior") &&
      normalized.includes("no missing-token behavior change") &&
      normalized.includes(
        "no protected-resource metadata route behavior change",
      ) &&
      normalized.includes("no `/mcp` behavior change"),
    exactFailureTaxonomy: TOKEN_VALIDATION_FAILURE_TAXONOMY.every(
      (failureMode) => normalized.includes(failureMode),
    ),
    symbolicChallengeOnly:
      normalized.includes("wwwauthenticateerror") &&
      normalized.includes("symbolic only") &&
      normalized.includes("does not produce www-authenticate headers"),
    noTokenLeakage:
      normalized.includes("raw token") &&
      normalized.includes("bearer token material") &&
      normalized.includes("jwt-like examples") &&
      normalized.includes("no-token-echo"),
    fp0140AbsentOrDocsOnlyPlanningBridge:
      normalized.includes("fp-0140 remains absent") ||
      normalized.includes("fp-0140 is now a docs-and-plan plus proof-gate compatibility slice"),
  };
}

function buildEnvelopeForFailure(failure: TokenValidationFailureTaxonomy) {
  return buildTokenValidationResultEnvelope(
    buildTokenValidationResultEnvelopeInputDescriptor({
      outcome: failure,
    }),
  );
}

function buildHttpPosture(
  failure: TokenValidationFailureTaxonomy | null,
): TokenValidationHttpPostureRecommendation {
  if (failure === null) {
    return {
      posture: "no_http_response",
      routeResponseEmitted: false,
      statusCode: null,
    };
  }
  if (failure === "malformed_authorization") {
    return {
      posture: "recommend_400_bad_request",
      routeResponseEmitted: false,
      statusCode: 400,
    };
  }
  if (failure === "insufficient_scope") {
    return {
      posture: "recommend_403_forbidden",
      routeResponseEmitted: false,
      statusCode: 403,
    };
  }
  return {
    posture: "recommend_401_unauthorized",
    routeResponseEmitted: false,
    statusCode: 401,
  };
}

function wwwAuthenticateErrorFor(
  failure: TokenValidationFailureTaxonomy | null,
): TokenValidationWwwAuthenticateErrorSymbol {
  if (failure === null || failure === "missing_token") return "none";
  if (failure === "malformed_authorization") return "invalid_request";
  if (failure === "insufficient_scope") return "insufficient_scope";
  if (failure === "wrong_org" || failure === "company_binding_mismatch") {
    return "fail_closed_non_leaking";
  }
  return "invalid_token";
}

function buildRequiredScopesBoundary(requiredScopes: readonly string[]) {
  return {
    broadScopeRequested: false,
    readOnlyScopesOnly: true,
    requiredScopes,
    sanitizedScopeIdentifiersOnly: true,
  };
}

function buildIssuerAudienceResourcePosture(
  descriptor: TokenValidationResultEnvelopeInputDescriptor,
  failure: TokenValidationFailureTaxonomy | null,
): TokenValidationIssuerAudienceResourcePosture {
  const defaultPosture =
    failure === null ? "accepted_descriptor" : "not_evaluated";
  return {
    audience:
      descriptor.issuerAudienceResourcePosture?.audience ??
      (failure === "wrong_audience" ? "rejected_descriptor" : defaultPosture),
    issuer: descriptor.issuerAudienceResourcePosture?.issuer ?? defaultPosture,
    jwksLookupPerformed: false,
    providerCallPerformed: false,
    resource:
      descriptor.issuerAudienceResourcePosture?.resource ??
      (failure === "wrong_resource" ? "rejected_descriptor" : defaultPosture),
  };
}

function buildSubjectOrgCompanyBindingPosture(
  descriptor: TokenValidationResultEnvelopeInputDescriptor,
  failure: TokenValidationFailureTaxonomy | null,
): TokenValidationSubjectOrgCompanyBindingPosture {
  const defaultPosture =
    failure === null ? "bound_descriptor" : "not_evaluated";
  return {
    company:
      descriptor.subjectOrgCompanyBindingPosture?.company ??
      (failure === "company_binding_mismatch"
        ? "mismatch_descriptor"
        : defaultPosture),
    failClosedNonLeaking:
      failure === "wrong_org" || failure === "company_binding_mismatch",
    lookupPerformed: false,
    org:
      descriptor.subjectOrgCompanyBindingPosture?.org ??
      (failure === "wrong_org" ? "mismatch_descriptor" : defaultPosture),
    subject:
      descriptor.subjectOrgCompanyBindingPosture?.subject ?? defaultPosture,
    subjectIdentifierEmitted: false,
  };
}

function buildRevocationReplayPosture(
  descriptor: TokenValidationResultEnvelopeInputDescriptor,
  failure: TokenValidationFailureTaxonomy | null,
): TokenValidationRevocationReplayPosture {
  return {
    nonceStoreChecked: false,
    replay:
      descriptor.revocationReplayPosture?.replay ??
      (failure === "replay_or_nonce_failure"
        ? "replay_or_nonce_failure_descriptor"
        : failure === null
          ? "replay_nonce_clear_descriptor"
          : "not_evaluated"),
    revocation:
      descriptor.revocationReplayPosture?.revocation ??
      (failure === "revoked_token"
        ? "revoked_descriptor"
        : failure === null
          ? "not_revoked_descriptor"
          : "not_evaluated"),
    revocationStoreChecked: false,
  };
}

function buildNoTokenEchoBoundary() {
  return {
    carriesAuthorizationHeader: false,
    carriesDecodedClaims: false,
    carriesRawToken: false,
    rawTokenEchoed: false,
    rawTokenForwarded: false,
    rawTokenLogged: false,
    rawTokenStored: false,
  };
}

function buildEvidenceFreeSecurityDecisionBoundary() {
  return {
    decisionSource: "sanitized_descriptor_only",
    evidenceInputsUsed: false,
    financeEvidenceUsed: false,
    limitation: "local proof-mode envelope only; not production authentication",
    productionAuthDecision: false,
  };
}

function buildProofModeOnlyBoundary() {
  return {
    authMiddlewareImplemented: false,
    localProofOnly: true,
    productionValidationPerformed: false,
    routeRequestRead: false,
    routeResponseEmitted: false,
    tokenIntrospectionPerformed: false,
    tokenParsingPerformed: false,
  };
}

function forbiddenDescriptorValueReasons(text: string) {
  const checks = [
    ["bearer_material_rejected", /\bbearer\b/iu],
    [
      "jwt_like_string_rejected",
      /\b[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/u,
    ],
    ["authorization_header_rejected", /\bauthorization\s*[:=]/iu],
    [
      "oauth_credential_rejected",
      /\b(?:access|refresh|client)[_-](?:token|secret)\s*[:=]/iu,
    ],
    ["session_or_cookie_rejected", /\b(?:session|cookie)\s*[:=]/iu],
    [
      "provider_credential_rejected",
      /\bprovider[_-](?:credential|secret|key)\s*[:=]/iu,
    ],
  ] as const;

  return checks
    .filter(([, pattern]) => pattern.test(text))
    .map(([reason]) => reason);
}

function forbiddenDescriptorKeyReasons(input: unknown) {
  const matches: string[] = [];

  function visit(value: unknown) {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (value === null || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (
        /(?:rawtoken|tokenvalue|authorization|bearer|jwt|accesstoken|access_token|refreshtoken|refresh_token|clientsecret|client_secret|session|cookie|providercredential|openaiapikey)/iu.test(
          key,
        )
      ) {
        matches.push(`forbidden_descriptor_key:${key}`);
      }
      visit(child);
    }
  }

  visit(input);
  return matches;
}

function stringifyUnknown(input: unknown) {
  try {
    return typeof input === "string" ? input : JSON.stringify(input);
  } catch {
    return "";
  }
}

function fp0139PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return (
    [
      "local proof-mode implementation slice",
      "sanitized descriptor inputs only",
      "structured token-validation result envelopes only",
      "not production token validation",
      "not token parsing",
      "not jwt decoding",
      "not token introspection",
      "not oauth implementation",
      "not auth middleware",
      "not invalid-token www-authenticate route behavior",
      "not route expansion",
      "not db query implementation",
    ].every((requiredText) => normalized.includes(requiredText)) &&
    (normalized.includes("fp-0140 remains absent") ||
      normalized.includes(
        "fp-0140 is now a docs-and-plan plus proof-gate compatibility slice",
      )) &&
    Object.values(verifyFp0139PlanningTextRequiredTopics(planText)).every(
      Boolean,
    )
  );
}

function normalizeBoundaryInput(input: Fp0139BoundaryInput) {
  if ("repoPaths" in input) return input;
  return { repoPaths: input };
}

function fpPlanHits(repoPaths: readonly string[], planPrefix: string) {
  return repoPaths
    .map((path) => path.replace(/\\/gu, "/"))
    .filter((path) => path.includes(planPrefix));
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
