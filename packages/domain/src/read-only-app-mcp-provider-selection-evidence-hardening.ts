import type { TokenValidationFailureTaxonomy } from "./read-only-app-mcp-token-validation-result-envelope-contracts";
import {
  FP0146_PROVIDER_MODE,
  FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH,
  verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan,
} from "./read-only-app-mcp-authorization-parser-contracts";

export const MCP_PROVIDER_SELECTION_EVIDENCE_HARDENING_SCHEMA_VERSION =
  "v2bo.read-only-app-mcp-provider-selection-evidence-hardening.v1";

export const FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PREFIX =
  "FP-0147";

export const FP0148_AUTHORIZATION_PARSER_IMPLEMENTATION_READINESS_PLAN_PREFIX =
  "FP-0148";

export const FP0147_PROVIDER_MODE = FP0146_PROVIDER_MODE;

export const FP0147_PROVIDER_EVIDENCE_MATRIX = [
  {
    evidenceComplete: false,
    mode: "jwt_jwks_candidate",
    providerSelected: false,
  },
  {
    evidenceComplete: false,
    mode: "opaque_introspection_candidate",
    providerSelected: false,
  },
  {
    evidenceComplete: true,
    mode: "provider_neutral_deferred",
    providerSelected: false,
  },
] as const;

export const FP0147_CANONICAL_RESOURCE_EVIDENCE_REQUIREMENTS = [
  "https_required_for_public_remote_future",
  "resource_uri_matches_protected_resource_metadata_resource",
  "resource_indicator_binds_authorization_and_token_requests",
  "local_only_route_not_confused_with_public_canonical_resource",
  "no_route_behavior_change_in_this_slice",
] as const;

export const FP0147_PROTECTED_RESOURCE_METADATA_EVIDENCE_REQUIREMENTS = [
  "resource_field_posture",
  "authorization_servers_field_posture",
  "scopes_supported_posture",
  "www_authenticate_metadata_url_posture",
  "no_real_public_metadata_publication_in_this_slice",
] as const;

export const FP0147_AUTHORIZATION_SERVER_DISCOVERY_EVIDENCE_REQUIREMENTS = [
  "oauth_authorization_server_metadata",
  "oidc_discovery_if_applicable",
  "issuer_source",
  "authorization_endpoint",
  "token_endpoint",
  "jwks_uri_if_jwt_jwks",
  "introspection_endpoint_if_opaque",
  "token_endpoint_auth_method_posture",
  "pkce_support",
  "client_registration_posture_cimd_dcr_or_predefined_client",
] as const;

export const FP0147_RESOURCE_INDICATOR_EVIDENCE_REQUIREMENTS = [
  "authorization_request_resource_parameter",
  "token_request_resource_parameter",
  "canonical_resource_equality",
] as const;

export const FP0147_AUDIENCE_RESOURCE_BINDING_EVIDENCE_REQUIREMENTS = [
  "aud_or_resource_claim_or_equivalent",
  "canonical_resource_equality",
  "wrong_audience_failure_mapping",
  "wrong_resource_failure_mapping",
] as const;

export const FP0147_SCOPE_RBAC_ORG_COMPANY_EVIDENCE_REQUIREMENTS = [
  "least_privilege_scopes",
  "read_only_scope_naming_posture",
  "org_binding_source",
  "company_binding_source",
  "company_selector_fail_closed_posture",
  "insufficient_scope_challenge_posture",
] as const;

export const FP0147_NO_TOKEN_PASSTHROUGH_EVIDENCE_REQUIREMENTS = [
  "inbound_tokens_issued_for_this_mcp_server",
  "no_forwarding_of_chatgpt_or_oauth_user_token",
  "no_token_echo_logging_or_fingerprinting",
] as const;

export const FP0147_NO_CREDENTIAL_FORWARDING_EVIDENCE_REQUIREMENTS = [
  "downstream_provider_credentials_are_separate_future_only_tokens",
  "no_reuse_of_inbound_mcp_token_for_downstream_provider",
] as const;

export const FP0147_METADATA_URL_SSRF_SAFETY_REQUIREMENTS = [
  "protected_resource_metadata_url_not_localhost_private_or_internal_in_public_mode",
  "authorization_server_metadata_urls_https_and_explicit",
  "no_automatic_fetching_implementation_in_this_slice",
  "future_fetchers_must_prove_allowlist_denylist_and_timeout_posture",
] as const;

export const FP0147_REPLAY_REVOCATION_SERVICE_UNAVAILABLE_REQUIREMENTS = [
  "replay_nonce_future_posture",
  "revocation_future_posture",
  "validation_service_unavailable_fail_closed_mapping",
  "introspection_unavailable_fail_closed_mapping",
  "jwks_unavailable_key_rotation_fail_closed_mapping",
] as const;

export const FP0147_DEV_TEST_TENANT_REQUIREMENTS = [
  "dev_tenant_or_test_tenant_required_before_runtime_implementation",
  "no_real_production_credential_examples",
  "no_real_token_examples",
] as const;

export const FP0147_MTLS_EGRESS_ALLOWLIST_FUTURE_REQUIREMENTS = [
  "mtls_future_public_remote_hardening_only",
  "egress_ip_allowlist_future_public_remote_hardening_only",
  "no_deployment_or_network_configuration_in_this_slice",
] as const;

export const FP0147_PROVIDER_EVIDENCE_FAILURE_STATES = [
  "provider_metadata_missing",
  "authorization_server_metadata_missing",
  "issuer_unproven",
  "audience_unproven",
  "resource_unproven",
  "scope_unproven",
  "org_binding_unproven",
  "company_binding_unproven",
  "jwks_unavailable",
  "introspection_unavailable",
  "revocation_unavailable",
  "replay_unproven",
  "provider_selection_incomplete",
  "token_passthrough_risk",
  "metadata_url_unsafe",
  "validation_service_unavailable",
] as const;

export type Fp0147ProviderEvidenceFailureState =
  (typeof FP0147_PROVIDER_EVIDENCE_FAILURE_STATES)[number];

export type Fp0147ProviderEvidenceFailureEnvelope =
  | TokenValidationFailureTaxonomy
  | "future_only_provider_evidence_refusal";

export type Fp0147ProviderEvidenceFailureMapping = {
  envelopeFailure: Fp0147ProviderEvidenceFailureEnvelope;
  failureState: Fp0147ProviderEvidenceFailureState;
  futureRuntimeOnly: boolean;
  invalidTokenChallengeDownstreamOfFp0139: boolean;
  noTokenEcho: true;
};

type Fp0147BoundaryInput = {
  planText: string;
  repoPaths: readonly string[];
};

export const FP0147_PROVIDER_EVIDENCE_FAILURE_MAPPINGS = [
  failureMapping("provider_metadata_missing", "unsupported_validation_mode"),
  failureMapping(
    "authorization_server_metadata_missing",
    "unsupported_validation_mode",
  ),
  failureMapping("issuer_unproven", "unsupported_validation_mode"),
  failureMapping("audience_unproven", "wrong_audience"),
  failureMapping("resource_unproven", "wrong_resource"),
  failureMapping("scope_unproven", "insufficient_scope"),
  failureMapping("org_binding_unproven", "wrong_org"),
  failureMapping("company_binding_unproven", "company_binding_mismatch"),
  failureMapping("jwks_unavailable", "production_validation_unavailable"),
  failureMapping(
    "introspection_unavailable",
    "production_validation_unavailable",
  ),
  failureMapping("revocation_unavailable", "production_validation_unavailable"),
  failureMapping("replay_unproven", "replay_or_nonce_failure"),
  failureMapping(
    "provider_selection_incomplete",
    "unsupported_validation_mode",
  ),
  failureMapping("token_passthrough_risk", "invalid_token"),
  failureMapping(
    "metadata_url_unsafe",
    "future_only_provider_evidence_refusal",
  ),
  failureMapping(
    "validation_service_unavailable",
    "production_validation_unavailable",
  ),
] as const satisfies readonly Fp0147ProviderEvidenceFailureMapping[];

export type Fp0147ProviderSelectionEvidenceHardeningProof = ReturnType<
  typeof buildFp0147ProviderSelectionEvidenceHardeningProof
>;

export function buildFp0147ProviderSelectionEvidenceHardeningProof() {
  return {
    schemaVersion: MCP_PROVIDER_SELECTION_EVIDENCE_HARDENING_SCHEMA_VERSION,
    fp0147ProviderSelectionEvidenceHardeningProofOnly: true,
    providerMode: FP0147_PROVIDER_MODE,
    providerEvidenceMatrix: [...FP0147_PROVIDER_EVIDENCE_MATRIX],
    providerModeCanBeSelectedAfterFp0147: false,
    parserImplementationReadinessMayBePlannedNextConditionally: true,
    productionTokenValidationRuntimeCanStartAfterFp0147: false,
    oauthSessionAuthMiddlewareCanStartAfterFp0147: false,
    publicChatGptAppDemoSubmissionCanStartAfterFp0147: false,
    futureFp0148MayOpenOnly: [
      "parser_implementation_readiness",
      "provider_evidence_correction",
    ],
    futureFp0148CannotOpenParserImplementationOrProductionValidationRuntime: true,
    canonicalResourceEvidenceRequirements: [
      ...FP0147_CANONICAL_RESOURCE_EVIDENCE_REQUIREMENTS,
    ],
    protectedResourceMetadataEvidenceRequirements: [
      ...FP0147_PROTECTED_RESOURCE_METADATA_EVIDENCE_REQUIREMENTS,
    ],
    authorizationServerDiscoveryEvidenceRequirements: [
      ...FP0147_AUTHORIZATION_SERVER_DISCOVERY_EVIDENCE_REQUIREMENTS,
    ],
    resourceIndicatorEvidenceRequirements: [
      ...FP0147_RESOURCE_INDICATOR_EVIDENCE_REQUIREMENTS,
    ],
    audienceResourceBindingEvidenceRequirements: [
      ...FP0147_AUDIENCE_RESOURCE_BINDING_EVIDENCE_REQUIREMENTS,
    ],
    scopeRbacOrgCompanyEvidenceRequirements: [
      ...FP0147_SCOPE_RBAC_ORG_COMPANY_EVIDENCE_REQUIREMENTS,
    ],
    noTokenPassthroughEvidenceRequirements: [
      ...FP0147_NO_TOKEN_PASSTHROUGH_EVIDENCE_REQUIREMENTS,
    ],
    noCredentialForwardingEvidenceRequirements: [
      ...FP0147_NO_CREDENTIAL_FORWARDING_EVIDENCE_REQUIREMENTS,
    ],
    metadataUrlSsrfSafetyRequirements: [
      ...FP0147_METADATA_URL_SSRF_SAFETY_REQUIREMENTS,
    ],
    replayRevocationServiceUnavailableRequirements: [
      ...FP0147_REPLAY_REVOCATION_SERVICE_UNAVAILABLE_REQUIREMENTS,
    ],
    devTestTenantRequirements: [...FP0147_DEV_TEST_TENANT_REQUIREMENTS],
    mtlsEgressAllowlistFutureRequirements: [
      ...FP0147_MTLS_EGRESS_ALLOWLIST_FUTURE_REQUIREMENTS,
    ],
    providerEvidenceFailureMappings: [
      ...FP0147_PROVIDER_EVIDENCE_FAILURE_MAPPINGS,
    ],
    preservesFp0139ResultEnvelopesAsOnlyFutureValidationOutputContract: true,
    preservesFp0130MissingTokenLane: true,
    preservesInvalidTokenChallengeDownstreamOfFp0139: true,
    preservesFp0146ParserContracts: true,
    preservesFp0145RuntimeContracts: true,
    preservesFp0144ProductionSequencing: true,
    preservesFp0143AppWiring: true,
    preservesFp0142RouteIntegrationSequencing: true,
    preservesFp0141InvalidTokenChallengeMapping: true,
    preservesFp0125ProtectedResourceMetadataRoute: true,
    preservesFp0107RouteAdapter: true,
    preservesFp0106ProtocolEnvelope: true,
    preservesFp0100PublicSecurityBoundary: true,
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
  } as const;
}

export function verifyFp0147ProviderSelectionEvidenceHardeningPlanBoundary(
  input: Fp0147BoundaryInput,
) {
  return (
    exactlyOneFp0147Plan(input.repoPaths) &&
    verifyFp0148AbsentOrAuthorizationParserImplementationReadinessPlan(
      input.repoPaths,
    ) &&
    Object.values(verifyFp0147PlanningTextRequiredTopics(input.planText)).every(
      Boolean,
    ) &&
    verifyFp0147ProviderSelectionEvidenceHardeningProof()
  );
}

export function verifyFp0147ProviderSelectionEvidenceHardeningProof() {
  const proof = buildFp0147ProviderSelectionEvidenceHardeningProof();

  return (
    proof.fp0147ProviderSelectionEvidenceHardeningProofOnly &&
    proof.providerMode === "provider_neutral_deferred" &&
    proof.providerModeCanBeSelectedAfterFp0147 === false &&
    proof.productionTokenValidationRuntimeCanStartAfterFp0147 === false &&
    proof.oauthSessionAuthMiddlewareCanStartAfterFp0147 === false &&
    proof.publicChatGptAppDemoSubmissionCanStartAfterFp0147 === false &&
    proof.noProviderCalls &&
    proof.noProviderIntegration &&
    proof.noAuthorizationParserImplementation &&
    proof.noProductionTokenValidationRuntime &&
    proof.noTokenParserImplementation &&
    proof.noJwtDecoderImplementation &&
    proof.noJwksFetchImplementation &&
    proof.noTokenIntrospectionImplementation &&
    proof.noOauthImplementation &&
    proof.noTokenSessionStorage &&
    proof.noAuthMiddleware &&
    proof.noRouteBehaviorChange &&
    proof.noMissingTokenBehaviorChange &&
    proof.noInvalidTokenChallengeBehaviorChange &&
    proof.noProtectedResourceMetadataRouteBehaviorChange &&
    proof.noDbSchemaPackageWork &&
    proof.noOpenAiApiOrModelCalls &&
    proof.noSourceMutation &&
    proof.noFinanceWrite &&
    proof.noPublicAssetsGeneratedPublicProseSubmissionExternalCommsOrAutonomousAction &&
    evidenceMatrixDefersProviderSelection() &&
    verifyFp0147ProviderEvidenceFailureStateMapping()
  );
}

export function verifyFp0147ProviderEvidenceFailureStateMapping() {
  const mappedStates = FP0147_PROVIDER_EVIDENCE_FAILURE_MAPPINGS.map(
    ({ failureState }) => failureState,
  );
  return (
    FP0147_PROVIDER_EVIDENCE_FAILURE_STATES.every((state) =>
      mappedStates.includes(state),
    ) &&
    mappedStates.length === FP0147_PROVIDER_EVIDENCE_FAILURE_STATES.length &&
    FP0147_PROVIDER_EVIDENCE_FAILURE_MAPPINGS.every(
      ({ envelopeFailure, noTokenEcho }) =>
        typeof envelopeFailure === "string" && noTokenEcho,
    )
  );
}

export function verifyFp0147PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    providerSelectionEvidenceHardeningOnly:
      normalized.includes(
        "fp-0147 is provider-selection evidence-hardening/proof only",
      ) &&
      normalized.includes("not provider selection implementation") &&
      normalized.includes("not authorization parser implementation"),
    providerNeutralDeferred:
      normalized.includes("provider-neutral/deferred") &&
      normalized.includes("no provider is selected after fp-0147"),
    canonicalResourceEvidence:
      FP0147_CANONICAL_RESOURCE_EVIDENCE_REQUIREMENTS.every((requirement) =>
        normalized.includes(requirement),
      ),
    protectedResourceMetadataEvidence:
      FP0147_PROTECTED_RESOURCE_METADATA_EVIDENCE_REQUIREMENTS.every(
        (requirement) => normalized.includes(requirement),
      ),
    authorizationServerDiscoveryEvidence:
      FP0147_AUTHORIZATION_SERVER_DISCOVERY_EVIDENCE_REQUIREMENTS.every(
        (requirement) => normalized.includes(requirement),
      ),
    resourceIndicatorEvidence:
      FP0147_RESOURCE_INDICATOR_EVIDENCE_REQUIREMENTS.every((requirement) =>
        normalized.includes(requirement),
      ),
    audienceResourceBindingEvidence:
      FP0147_AUDIENCE_RESOURCE_BINDING_EVIDENCE_REQUIREMENTS.every(
        (requirement) => normalized.includes(requirement),
      ),
    scopeRbacOrgCompanyEvidence:
      FP0147_SCOPE_RBAC_ORG_COMPANY_EVIDENCE_REQUIREMENTS.every((requirement) =>
        normalized.includes(requirement),
      ),
    tokenPassthroughAndCredentialForwarding:
      FP0147_NO_TOKEN_PASSTHROUGH_EVIDENCE_REQUIREMENTS.every((requirement) =>
        normalized.includes(requirement),
      ) &&
      FP0147_NO_CREDENTIAL_FORWARDING_EVIDENCE_REQUIREMENTS.every(
        (requirement) => normalized.includes(requirement),
      ),
    metadataUrlSsrfSafety: FP0147_METADATA_URL_SSRF_SAFETY_REQUIREMENTS.every(
      (requirement) => normalized.includes(requirement),
    ),
    replayRevocationServiceUnavailable:
      FP0147_REPLAY_REVOCATION_SERVICE_UNAVAILABLE_REQUIREMENTS.every(
        (requirement) => normalized.includes(requirement),
      ),
    devTestTenantAndMtlsegress:
      FP0147_DEV_TEST_TENANT_REQUIREMENTS.every((requirement) =>
        normalized.includes(requirement),
      ) &&
      FP0147_MTLS_EGRESS_ALLOWLIST_FUTURE_REQUIREMENTS.every((requirement) =>
        normalized.includes(requirement),
      ),
    failureStatesMapped:
      FP0147_PROVIDER_EVIDENCE_FAILURE_STATES.every((state) =>
        normalized.includes(state),
      ) &&
      normalized.includes("mapped to fp-0139 envelopes") &&
      normalized.includes("future_only_provider_evidence_refusal"),
    priorPosturePreserved:
      normalized.includes("fp-0146 parser contracts remain intact") &&
      normalized.includes(
        "fp-0139 result envelopes remain the only future validation output contract",
      ) &&
      normalized.includes("fp-0130 missing-token lane remains separate") &&
      normalized.includes("invalid-token challenge remains downstream") &&
      normalized.includes(
        "protected-resource metadata route behavior unchanged",
      ) &&
      normalized.includes("/mcp route behavior unchanged"),
    futureFp0148Boundary:
      normalized.includes("future fp-0148 may open only") &&
      normalized.includes("parser-implementation-readiness") &&
      normalized.includes("provider-evidence correction") &&
      normalized.includes("not parser implementation") &&
      normalized.includes("not production token-validation runtime"),
  };
}

function evidenceMatrixDefersProviderSelection() {
  return (
    FP0147_PROVIDER_EVIDENCE_MATRIX.length === 3 &&
    FP0147_PROVIDER_EVIDENCE_MATRIX.every(
      ({ providerSelected }) => !providerSelected,
    ) &&
    FP0147_PROVIDER_EVIDENCE_MATRIX.find(
      ({ mode }) => mode === "provider_neutral_deferred",
    )?.evidenceComplete === true
  );
}

function exactlyOneFp0147Plan(repoPaths: readonly string[]) {
  const hits = fpPlanHits(
    repoPaths,
    FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PREFIX,
  );
  return (
    hits.length === 1 &&
    hits[0] === FP0147_PROVIDER_SELECTION_EVIDENCE_HARDENING_PLAN_PATH
  );
}

function failureMapping(
  failureState: Fp0147ProviderEvidenceFailureState,
  envelopeFailure: Fp0147ProviderEvidenceFailureEnvelope,
): Fp0147ProviderEvidenceFailureMapping {
  return {
    envelopeFailure,
    failureState,
    futureRuntimeOnly: true,
    invalidTokenChallengeDownstreamOfFp0139: true,
    noTokenEcho: true,
  };
}

function fpPlanHits(repoPaths: readonly string[], planPrefix: string) {
  return repoPaths
    .map((path) => path.replace(/\\/gu, "/"))
    .filter((path) => path.includes(planPrefix));
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
