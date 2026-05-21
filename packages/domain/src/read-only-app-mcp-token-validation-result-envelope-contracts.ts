import { z } from "zod";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const TOKEN_VALIDATION_RESULT_ENVELOPE_SCHEMA_VERSION =
  "v2bg.read-only-app-mcp-token-validation-result-envelope.v1";

export const TOKEN_VALIDATION_RESULT_ENVELOPE_PROOF_SCHEMA_VERSION =
  "v2bg.read-only-app-mcp-token-validation-result-envelope-proof.v1";

export const FP0139_TOKEN_VALIDATION_RESULT_ENVELOPE_PLAN_PATH =
  "plans/FP-0139-read-only-chatgpt-app-mcp-token-validation-result-envelope-local-proof-mode-implementation.md";

export const MCP_TOKEN_VALIDATION_RESULT_ENVELOPE_FP0139_PLAN_PREFIX =
  "FP-0139";

export const MCP_TOKEN_VALIDATION_RESULT_ENVELOPE_FP0140_PLAN_PREFIX =
  "FP-0140";

export const TOKEN_VALIDATION_FAILURE_TAXONOMY = [
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
] as const;

export const TOKEN_VALIDATION_REQUIRED_SCOPE_ALLOWLIST = [
  "mcp:read",
  "evidence:read",
] as const;

export const TOKEN_VALIDATION_WWW_AUTHENTICATE_ERROR_SYMBOLS = [
  "none",
  "invalid_request",
  "invalid_token",
  "insufficient_scope",
  "fail_closed_non_leaking",
] as const;

export const TokenValidationFailureTaxonomySchema = z.enum(
  TOKEN_VALIDATION_FAILURE_TAXONOMY,
);

export const TokenValidationRequiredScopeSchema = z.enum(
  TOKEN_VALIDATION_REQUIRED_SCOPE_ALLOWLIST,
);

export const TokenValidationWwwAuthenticateErrorSymbolSchema = z.enum(
  TOKEN_VALIDATION_WWW_AUTHENTICATE_ERROR_SYMBOLS,
);

export const TokenValidationResultEnvelopeInputDescriptorSchema = z
  .object({
    schemaVersion: z.literal(TOKEN_VALIDATION_RESULT_ENVELOPE_SCHEMA_VERSION),
    descriptorKind: z.literal(
      "token_validation_result_envelope_input_descriptor",
    ),
    descriptorId: z.string().min(1),
    descriptorMode: z.literal("local_proof"),
    outcome: z.union([
      z.literal("accepted"),
      TokenValidationFailureTaxonomySchema,
    ]),
    requiredScopes: z.array(TokenValidationRequiredScopeSchema).max(2),
    issuerAudienceResourcePosture: z
      .object({
        audience: z
          .enum(["not_evaluated", "accepted_descriptor", "rejected_descriptor"])
          .optional(),
        issuer: z
          .enum(["not_evaluated", "accepted_descriptor", "rejected_descriptor"])
          .optional(),
        resource: z
          .enum(["not_evaluated", "accepted_descriptor", "rejected_descriptor"])
          .optional(),
      })
      .strict()
      .optional(),
    subjectOrgCompanyBindingPosture: z
      .object({
        company: z
          .enum(["not_evaluated", "bound_descriptor", "mismatch_descriptor"])
          .optional(),
        org: z
          .enum(["not_evaluated", "bound_descriptor", "mismatch_descriptor"])
          .optional(),
        subject: z
          .enum(["not_evaluated", "bound_descriptor", "mismatch_descriptor"])
          .optional(),
      })
      .strict()
      .optional(),
    revocationReplayPosture: z
      .object({
        replay: z
          .enum([
            "not_evaluated",
            "replay_nonce_clear_descriptor",
            "replay_or_nonce_failure_descriptor",
          ])
          .optional(),
        revocation: z
          .enum([
            "not_evaluated",
            "not_revoked_descriptor",
            "revoked_descriptor",
          ])
          .optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const TokenValidationHttpPostureRecommendationSchema = z
  .object({
    posture: z.enum([
      "no_http_response",
      "recommend_400_bad_request",
      "recommend_401_unauthorized",
      "recommend_403_forbidden",
    ]),
    routeResponseEmitted: falseLiteral,
    statusCode: z.union([
      z.literal(400),
      z.literal(401),
      z.literal(403),
      z.null(),
    ]),
  })
  .strict();

export const TokenValidationRequiredScopesBoundarySchema = z
  .object({
    broadScopeRequested: falseLiteral,
    readOnlyScopesOnly: trueLiteral,
    requiredScopes: z.array(TokenValidationRequiredScopeSchema).max(2),
    sanitizedScopeIdentifiersOnly: trueLiteral,
  })
  .strict();

export const TokenValidationIssuerAudienceResourcePostureSchema = z
  .object({
    audience: z.enum([
      "not_evaluated",
      "accepted_descriptor",
      "rejected_descriptor",
    ]),
    issuer: z.enum([
      "not_evaluated",
      "accepted_descriptor",
      "rejected_descriptor",
    ]),
    jwksLookupPerformed: falseLiteral,
    providerCallPerformed: falseLiteral,
    resource: z.enum([
      "not_evaluated",
      "accepted_descriptor",
      "rejected_descriptor",
    ]),
  })
  .strict();

export const TokenValidationSubjectOrgCompanyBindingPostureSchema = z
  .object({
    company: z.enum([
      "not_evaluated",
      "bound_descriptor",
      "mismatch_descriptor",
    ]),
    failClosedNonLeaking: z.boolean(),
    lookupPerformed: falseLiteral,
    org: z.enum(["not_evaluated", "bound_descriptor", "mismatch_descriptor"]),
    subject: z.enum([
      "not_evaluated",
      "bound_descriptor",
      "mismatch_descriptor",
    ]),
    subjectIdentifierEmitted: falseLiteral,
  })
  .strict();

export const TokenValidationRevocationReplayPostureSchema = z
  .object({
    nonceStoreChecked: falseLiteral,
    replay: z.enum([
      "not_evaluated",
      "replay_nonce_clear_descriptor",
      "replay_or_nonce_failure_descriptor",
    ]),
    revocation: z.enum([
      "not_evaluated",
      "not_revoked_descriptor",
      "revoked_descriptor",
    ]),
    revocationStoreChecked: falseLiteral,
  })
  .strict();

export const TokenValidationNoTokenEchoBoundarySchema = z
  .object({
    carriesAuthorizationHeader: falseLiteral,
    carriesDecodedClaims: falseLiteral,
    carriesRawToken: falseLiteral,
    rawTokenEchoed: falseLiteral,
    rawTokenForwarded: falseLiteral,
    rawTokenLogged: falseLiteral,
    rawTokenStored: falseLiteral,
  })
  .strict();

export const TokenValidationEvidenceFreeSecurityDecisionBoundarySchema = z
  .object({
    decisionSource: z.literal("sanitized_descriptor_only"),
    evidenceInputsUsed: falseLiteral,
    financeEvidenceUsed: falseLiteral,
    limitation: z.literal(
      "local proof-mode envelope only; not production authentication",
    ),
    productionAuthDecision: falseLiteral,
  })
  .strict();

export const TokenValidationProofModeOnlyBoundarySchema = z
  .object({
    authMiddlewareImplemented: falseLiteral,
    localProofOnly: trueLiteral,
    productionValidationPerformed: falseLiteral,
    routeRequestRead: falseLiteral,
    routeResponseEmitted: falseLiteral,
    tokenIntrospectionPerformed: falseLiteral,
    tokenParsingPerformed: falseLiteral,
  })
  .strict();

export const TokenValidationResultEnvelopeSchema = z
  .object({
    schemaVersion: z.literal(TOKEN_VALIDATION_RESULT_ENVELOPE_SCHEMA_VERSION),
    envelopeKind: z.literal("token_validation_result_envelope"),
    accepted: z.boolean(),
    descriptorId: z.string().min(1),
    evidenceFreeSecurityDecisionBoundary:
      TokenValidationEvidenceFreeSecurityDecisionBoundarySchema,
    failure: TokenValidationFailureTaxonomySchema.nullable(),
    httpPosture: TokenValidationHttpPostureRecommendationSchema,
    issuerAudienceResourcePosture:
      TokenValidationIssuerAudienceResourcePostureSchema,
    noTokenEchoBoundary: TokenValidationNoTokenEchoBoundarySchema,
    proofModeOnlyBoundary: TokenValidationProofModeOnlyBoundarySchema,
    requiredScopes: z.array(TokenValidationRequiredScopeSchema).max(2),
    requiredScopesBoundary: TokenValidationRequiredScopesBoundarySchema,
    revocationReplayPosture: TokenValidationRevocationReplayPostureSchema,
    routeResponseEmitted: falseLiteral,
    subjectOrgCompanyBindingPosture:
      TokenValidationSubjectOrgCompanyBindingPostureSchema,
    wwwAuthenticateError: TokenValidationWwwAuthenticateErrorSymbolSchema,
    wwwAuthenticateHeaderEmitted: falseLiteral,
  })
  .strict();

export const TokenValidationResultEnvelopeProofSchema = z
  .object({
    schemaVersion: z.literal(
      TOKEN_VALIDATION_RESULT_ENVELOPE_PROOF_SCHEMA_VERSION,
    ),
    localProofOnly: trueLiteral,
    resultEnvelopeBuilderImplemented: trueLiteral,
    acceptsSanitizedDescriptorOnly: trueLiteral,
    noRawTokenInputAccepted: trueLiteral,
    noBearerMaterialAccepted: trueLiteral,
    noJwtLikeMaterialAccepted: trueLiteral,
    exactFailureTaxonomyVerified: trueLiteral,
    httpPostureRecommendationVerified: trueLiteral,
    wwwAuthenticateErrorSymbolBoundaryVerified: trueLiteral,
    requiredScopesSanitizedVerified: trueLiteral,
    issuerAudienceResourcePostureVerified: trueLiteral,
    subjectOrgCompanyBindingPostureVerified: trueLiteral,
    revocationReplayPostureVerified: trueLiteral,
    noTokenEchoBoundaryVerified: trueLiteral,
    evidenceFreeSecurityDecisionBoundaryVerified: trueLiteral,
    proofModeOnlyBoundaryVerified: trueLiteral,
    noRouteBehaviorChange: trueLiteral,
    noProtectedResourceMetadataRouteBehaviorChange: trueLiteral,
    noMissingTokenChallengeBehaviorChange: trueLiteral,
    noInvalidTokenChallengeRuntime: trueLiteral,
    noWwwAuthenticateHeaderEmission: trueLiteral,
    noTokenParsingRuntime: trueLiteral,
    noJwtDecodingRuntime: trueLiteral,
    noTokenValidationRuntime: trueLiteral,
    noTokenIntrospectionRuntime: trueLiteral,
    noRouteConsumesTestDouble: trueLiteral,
    noOauthImplementation: trueLiteral,
    noTokenSessionStorage: trueLiteral,
    noAuthMiddlewareImplementation: trueLiteral,
    noRealTokenExamples: trueLiteral,
    noJwtLikeExamples: trueLiteral,
    noBearerTokenMaterial: trueLiteral,
    noDbQueriesAdded: trueLiteral,
    noSchemaMigrationsAdded: trueLiteral,
    noPackageScriptsAdded: trueLiteral,
    noOpenAiApiCalls: trueLiteral,
    noProviderExternalCalls: trueLiteral,
    noSourceMutationFinanceWrite: trueLiteral,
    fp0139BoundaryVerified: trueLiteral,
    fp0140Absent: trueLiteral,
    fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified:
      trueLiteral,
    fp0137InvalidTokenChallengeReadinessBoundaryStillVerified: trueLiteral,
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified: trueLiteral,
    fp0134SyntheticEvaluatorBoundaryStillVerified: trueLiteral,
    fp0132TokenValidationRuntimeContractsBoundaryStillVerified: trueLiteral,
    fp0130MissingTokenChallengeBoundaryStillVerified: trueLiteral,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified: trueLiteral,
    fp0107RouteAdapterBoundaryStillVerified: trueLiteral,
    fp0106ProtocolEnvelopeBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
  })
  .strict();

export type TokenValidationFailureTaxonomy = z.infer<
  typeof TokenValidationFailureTaxonomySchema
>;
export type TokenValidationHttpPostureRecommendation = z.infer<
  typeof TokenValidationHttpPostureRecommendationSchema
>;
export type TokenValidationIssuerAudienceResourcePosture = z.infer<
  typeof TokenValidationIssuerAudienceResourcePostureSchema
>;
export type TokenValidationNoTokenEchoBoundary = z.infer<
  typeof TokenValidationNoTokenEchoBoundarySchema
>;
export type TokenValidationProofModeOnlyBoundary = z.infer<
  typeof TokenValidationProofModeOnlyBoundarySchema
>;
export type TokenValidationRequiredScopesBoundary = z.infer<
  typeof TokenValidationRequiredScopesBoundarySchema
>;
export type TokenValidationResultEnvelope = z.infer<
  typeof TokenValidationResultEnvelopeSchema
>;
export type TokenValidationResultEnvelopeInputDescriptor = z.infer<
  typeof TokenValidationResultEnvelopeInputDescriptorSchema
>;
export type TokenValidationResultEnvelopeProof = z.infer<
  typeof TokenValidationResultEnvelopeProofSchema
>;
export type TokenValidationRevocationReplayPosture = z.infer<
  typeof TokenValidationRevocationReplayPostureSchema
>;
export type TokenValidationSubjectOrgCompanyBindingPosture = z.infer<
  typeof TokenValidationSubjectOrgCompanyBindingPostureSchema
>;
export type TokenValidationWwwAuthenticateErrorSymbol = z.infer<
  typeof TokenValidationWwwAuthenticateErrorSymbolSchema
>;
