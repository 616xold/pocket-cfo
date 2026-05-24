import type { TokenValidationFailureTaxonomy } from "./read-only-app-mcp-token-validation-result-envelope-contracts";
import {
  FP0146_FAILURE_MAPPINGS,
  FP0146_FAILURE_STATES,
  FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
  FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS,
  FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
  FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH,
  verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan,
  verifyFp0149Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  MCP_PROOF_ONLY_NO_TOKEN_RETENTION_TERMS,
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";

export const MCP_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_SCHEMA_VERSION =
  "v2bp.read-only-app-mcp-authorization-parser-implementation-readiness.v1";

const FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PREFIX =
  "FP-0148";

export const FP0149_AUTHORIZATION_PARSER_IMPLEMENTATION_PLAN_PREFIX = "FP-0149";

export const FP0148_FUTURE_PARSER_INPUT_BOUNDARY = [
  "injected_raw_request_header_future_pure_parser_only",
  "no_raw_header_retained_outside_parser_stack",
  "no_raw_token_material_retained",
  "no_token_prefix_suffix_length_hash_digest_claims_or_decoded_payload",
  "no_logging_echo_storage_hashing_fingerprinting_or_forwarding",
] as const;

export const FP0148_FUTURE_PARSER_OUTPUT_BOUNDARY = [
  ...FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS,
] as const;

export const FP0148_PARSER_READINESS_TEST_MATRIX = [
  "absent_header",
  "empty_header",
  "unsupported_scheme_without_token_like_material",
  "malformed_scheme_text_without_token_like_material",
  "multiple_header_values_structural_only",
  "bearer_present_classification_with_sentinel_non_token_placeholder",
  "unsafe_whitespace_control_character_posture_without_token_material",
] as const;

export const FP0148_FUTURE_FP0149_ALLOWED_SCOPE = [
  "authorization_parser_implementation_only",
  "pure_domain_local_only",
  "no_route_consumption",
  "no_token_validation",
  "no_jwt_jwks_introspection_oauth_session_auth_middleware",
  "no_db_schema_package_work",
  "no_provider_calls",
  "no_openai_or_model_calls",
  "no_public_app_or_submission",
] as const;

export type Fp0148BoundaryInput = {
  planText: string;
  repoPaths: readonly string[];
};

export type Fp0148ParserFailureMapping = {
  envelopeFailure: TokenValidationFailureTaxonomy;
  failureState: (typeof FP0146_FAILURE_STATES)[number];
  mapsToFp0130MissingTokenLane: boolean;
  mapsToFp0139ResultEnvelope: boolean;
  noTokenEcho: true;
};

export type Fp0148AuthorizationParserImplementationReadinessProof = ReturnType<
  typeof buildFp0148AuthorizationParserImplementationReadinessProof
>;

export function buildFp0148AuthorizationParserImplementationReadinessProof() {
  return {
    schemaVersion:
      MCP_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_SCHEMA_VERSION,
    fp0148ImplementationReadinessAndProofHardeningOnly: true,
    authorizationParserImplementationCanStartAfterFp0148: false,
    futureParserImplementationMayOpenOnlyAfterReadiness: true,
    futureFp0149MayOpenOnly: [...FP0148_FUTURE_FP0149_ALLOWED_SCOPE],
    productionTokenValidationRuntimeCanStartAfterFp0148: false,
    providerSelectionCanStartAfterFp0148: false,
    oauthSessionAuthMiddlewareCanStartAfterFp0148: false,
    publicChatGptAppDemoSubmissionCanStartAfterFp0148: false,
    futureParserInputBoundary: {
      mayInspectInjectedRawRequestHeaderOnlyInsideFuturePureParserFunction: true,
      rawHeaderRetainedOutsideParserStack: false,
      rawTokenMaterialRetained: false,
      tokenDerivedPrefixSuffixLengthHashDigestClaimsDecodedHeaderPayloadEmitted: false,
      tokenLoggedEchoedStoredHashedFingerprintedOrForwarded: false,
    },
    futureParserInputBoundaryTerms: [...FP0148_FUTURE_PARSER_INPUT_BOUNDARY],
    futureParserOutputBoundary: {
      allowedSanitizedFields: [...FP0148_FUTURE_PARSER_OUTPUT_BOUNDARY],
      forbiddenTokenDerivedFields: [
        ...FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS,
      ],
      onlyFp0146SanitizedOutputFieldsPermitted: true,
    },
    parserFailureMappings: buildFp0148ParserFailureMappings(),
    parserReadinessTestMatrix: [...FP0148_PARSER_READINESS_TEST_MATRIX],
    parserReadinessTestMatrixUsesTokenMaterial: false,
    sharedProofOnlyNoTokenLeakageSanitizerVerified:
      verifyFp0148SharedProofOnlyLeakageSanitizer(),
    providerModeRemainsProviderNeutralDeferred: true,
    noProviderSelectionImplementation: true,
    noProviderCalls: true,
    noProviderIntegration: true,
    noAuthorizationParserImplementation: true,
    noProductionTokenValidationRuntime: true,
    noTokenParserImplementation: true,
    noJwtDecoderImplementation: true,
    noJwksFetchImplementation: true,
    noTokenIntrospectionImplementation: true,
    noOauthImplementation: true,
    noTokenSessionStorage: true,
    noAuthMiddleware: true,
    noRouteBehaviorChange: true,
    noMissingTokenBehaviorChange: true,
    noInvalidTokenChallengeBehaviorChange: true,
    noProtectedResourceMetadataRouteBehaviorChange: true,
    noDbSchemaPackageWork: true,
    noOpenAiApiOrModelCalls: true,
    noSourceMutation: true,
    noFinanceWrite: true,
    noPublicAssetsGeneratedPublicProseSubmissionExternalCommsOrAutonomousAction: true,
    preservesFp0147ProviderSelectionEvidenceBoundary: true,
    preservesFp0146ParserContractsBoundary: true,
    preservesFp0145RuntimeContractsBoundary: true,
    preservesFp0144ProductionTokenValidationSequencingBoundary: true,
    preservesFp0143InvalidTokenAppWiringBoundary: true,
    preservesFp0142RouteIntegrationSequencingBoundary: true,
    preservesFp0141InvalidTokenLocalRuntimeBoundary: true,
    preservesFp0139ResultEnvelopeBoundary: true,
    preservesFp0130MissingTokenChallengeBoundary: true,
    preservesFp0125ProtectedResourceMetadataRouteBoundary: true,
    preservesFp0107RouteAdapterBoundary: true,
    preservesFp0106ProtocolEnvelopeBoundary: true,
    preservesFp0100PublicSecurityBoundary: true,
  } as const;
}

export function verifyFp0148AuthorizationParserImplementationReadinessPlanBoundary(
  input: Fp0148BoundaryInput,
) {
  return (
    verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan(
      input.repoPaths,
    ) &&
    exactlyOneFp0148Plan(input.repoPaths) &&
    verifyFp0149Absent(input.repoPaths) &&
    Object.values(verifyFp0148PlanningTextRequiredTopics(input.planText)).every(
      Boolean,
    ) &&
    verifyFp0148AuthorizationParserImplementationReadinessProof()
  );
}

export function verifyFp0148AuthorizationParserImplementationReadinessProof() {
  const proof = buildFp0148AuthorizationParserImplementationReadinessProof();

  return (
    proof.fp0148ImplementationReadinessAndProofHardeningOnly &&
    proof.authorizationParserImplementationCanStartAfterFp0148 === false &&
    proof.productionTokenValidationRuntimeCanStartAfterFp0148 === false &&
    proof.providerSelectionCanStartAfterFp0148 === false &&
    proof.oauthSessionAuthMiddlewareCanStartAfterFp0148 === false &&
    proof.publicChatGptAppDemoSubmissionCanStartAfterFp0148 === false &&
    proof.futureParserOutputBoundary.onlyFp0146SanitizedOutputFieldsPermitted &&
    proof.futureParserOutputBoundary.allowedSanitizedFields.join("\n") ===
      FP0146_SANITIZED_AUTHORIZATION_PARSER_OUTPUT_FIELDS.join("\n") &&
    proof.futureParserOutputBoundary.forbiddenTokenDerivedFields.every(
      (field) =>
        !proof.futureParserOutputBoundary.allowedSanitizedFields.includes(
          field as (typeof FP0148_FUTURE_PARSER_OUTPUT_BOUNDARY)[number],
        ),
    ) &&
    verifyFp0148ParserFailureMapping() &&
    verifyFp0148ReadinessTestMatrixWithoutTokenMaterial() &&
    proof.sharedProofOnlyNoTokenLeakageSanitizerVerified &&
    proof.noRouteBehaviorChange &&
    proof.noMissingTokenBehaviorChange &&
    proof.noInvalidTokenChallengeBehaviorChange &&
    proof.noProtectedResourceMetadataRouteBehaviorChange
  );
}

export function verifyFp0148ParserFailureMapping() {
  const mappings = buildFp0148ParserFailureMappings();
  const states = mappings.map(({ failureState }) => failureState);

  return (
    FP0146_FAILURE_STATES.every((state) => states.includes(state)) &&
    mappings.length === FP0146_FAILURE_STATES.length &&
    mappings.find(
      ({ failureState }) => failureState === "missing_authorization",
    )?.mapsToFp0130MissingTokenLane === true &&
    mappings.find(({ failureState }) => failureState === "unsupported_scheme")
      ?.envelopeFailure === "unsupported_validation_mode" &&
    mappings.find(
      ({ failureState }) =>
        failureState === "token_material_passthrough_attempt",
    )?.envelopeFailure === "invalid_token" &&
    mappings.every(({ noTokenEcho }) => noTokenEcho)
  );
}

export function verifyFp0148ReadinessTestMatrixWithoutTokenMaterial() {
  const scan = scanProofOnlyNoTokenLeakageText(
    FP0148_PARSER_READINESS_TEST_MATRIX.join("\n"),
  );
  return (
    scan.accepted &&
    FP0148_PARSER_READINESS_TEST_MATRIX.includes(
      "multiple_header_values_structural_only",
    ) &&
    FP0148_PARSER_READINESS_TEST_MATRIX.includes(
      "bearer_present_classification_with_sentinel_non_token_placeholder",
    )
  );
}

export function verifyFp0148SharedProofOnlyLeakageSanitizer() {
  const allowedProofTerms = MCP_PROOF_ONLY_NO_TOKEN_RETENTION_TERMS.join("\n");
  const exactAbsenceFixture = [
    "request.headers.",
    "authorization",
    " === undefined",
  ].join("");
  const emptyHeaderFixture = ["authorization", ": ", '""'].join("");
  const generatedCredential = ["alpha", "numeric", "fixture"].join("");
  const unsafeBearerLine = [
    "authorization",
    ": ",
    "bearer",
    " ",
    generatedCredential,
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
    scanProofOnlyNoTokenLeakageText(allowedProofTerms).accepted &&
    scanProofOnlyNoTokenLeakageText(exactAbsenceFixture).accepted &&
    scanProofOnlyNoTokenLeakageText(emptyHeaderFixture).accepted &&
    !scanTokenValidationNoLeakage(emptyHeaderFixture).accepted &&
    !scanProofOnlyNoTokenLeakageText(unsafeBearerLine).accepted &&
    !scanProofOnlyNoTokenLeakageText(unsafeJwtLikeLine).accepted
  );
}

export function verifyFp0147CloseoutFreshnessForFp0148(planText: string) {
  const normalized = normalize(planText);
  return (
    normalized.includes("pr #326 merged") &&
    normalized.includes("464fb3f7fb57b5a28ba282eedbfd087cd079114f") &&
    normalized.includes("a0b8439084ecb52e146b5111960d53ae76e13053") &&
    normalized.includes(
      "same-branch qa found no issues and made no correction",
    ) &&
    normalized.includes("no post-merge qa is required") &&
    normalized.includes(
      "no post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
    )
  );
}

export function verifyFp0148PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    implementationReadinessOnly:
      normalized.includes(
        "fp-0148 is implementation-readiness and proof hardening only",
      ) && normalized.includes("fp-0148 does not implement parsing"),
    parserImplementationStillBlocked:
      normalized.includes("authorization parser implementation cannot start") &&
      normalized.includes("future fp-0149 may implement only if"),
    productionRuntimeProviderOauthPublicBlocked:
      normalized.includes("production token-validation runtime cannot start") &&
      normalized.includes("provider selection cannot start") &&
      normalized.includes("oauth/session/auth middleware cannot start") &&
      normalized.includes("public chatgpt app demo/submission cannot start"),
    inputBoundary: FP0148_FUTURE_PARSER_INPUT_BOUNDARY.every((term) =>
      normalized.includes(term),
    ),
    outputBoundary: FP0148_FUTURE_PARSER_OUTPUT_BOUNDARY.every((field) =>
      normalized.includes(field),
    ),
    forbiddenTokenDerivedFields:
      FP0146_FORBIDDEN_TOKEN_DERIVED_OBSERVABILITY_FIELDS.every((field) =>
        normalized.includes(field),
      ),
    failureMapping:
      FP0146_FAILURE_STATES.every((state) => normalized.includes(state)) &&
      normalized.includes(
        "unsupported scheme maps to unsupported_validation_mode",
      ) &&
      normalized.includes(
        "token material passthrough attempt maps to invalid_token",
      ),
    testMatrix: FP0148_PARSER_READINESS_TEST_MATRIX.every((item) =>
      normalized.includes(item),
    ),
    futureFp0149Boundary: FP0148_FUTURE_FP0149_ALLOWED_SCOPE.every((item) =>
      normalized.includes(item),
    ),
    priorBoundaries:
      normalized.includes("fp-0147 provider-selection evidence") &&
      normalized.includes("fp-0146 parser contracts") &&
      normalized.includes("fp-0139 result envelopes") &&
      normalized.includes("fp-0130 missing-token lane") &&
      normalized.includes(
        "protected-resource metadata route behavior unchanged",
      ) &&
      normalized.includes("/mcp route behavior unchanged"),
  };
}

function buildFp0148ParserFailureMappings() {
  return FP0146_FAILURE_MAPPINGS.map((mapping) => ({
    envelopeFailure: mapping.envelopeFailure,
    failureState: mapping.failureState,
    mapsToFp0130MissingTokenLane:
      mapping.failureState === "missing_authorization",
    mapsToFp0139ResultEnvelope:
      mapping.failureState !== "missing_authorization",
    noTokenEcho: true,
  })) as readonly Fp0148ParserFailureMapping[];
}

function exactlyOneFp0148Plan(repoPaths: readonly string[]) {
  const hits = repoPaths
    .map((path) => path.replace(/\\/gu, "/"))
    .filter((path) =>
      path.includes(
        FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PREFIX,
      ),
    );
  return (
    hits.length === 1 &&
    hits[0] === FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PATH
  );
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}

export const FP0148_PREREQUISITE_PROVIDER_SELECTION_PLAN_PATH =
  FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH;
