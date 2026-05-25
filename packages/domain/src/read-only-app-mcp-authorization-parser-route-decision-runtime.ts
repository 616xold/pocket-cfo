import {
  FP0146_FAILURE_MAPPINGS,
  type Fp0146AuthorizationPresence,
  type Fp0146AuthorizationSchemeClassification,
  type Fp0146FailureState,
  type Fp0146ParserFailureMapping,
} from "./read-only-app-mcp-authorization-parser-contracts";

export const MCP_AUTHORIZATION_PARSER_ROUTE_DECISION_RUNTIME_SCHEMA_VERSION =
  "v2bx.read-only-app-mcp-authorization-parser-route-decision-runtime.v1";

export const MCP_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_SCHEMA_VERSION =
  "v2bs.read-only-app-mcp-authorization-parser-route-integration-readiness.v1";

export const READ_ONLY_MCP_AUTHORIZATION_PARSER_ROUTE_SAFE_DECISION_FIELDS = [
  "parser_route_decision_contract_version",
  "authorization_presence",
  "authorization_scheme_classification",
  "credential_material_observed",
  "parser_failure_state",
  "envelope_failure",
  "maps_to_fp0130_missing_token_lane",
  "maps_to_fp0139_result_envelope",
  "invalid_token_challenge_downstream_only",
  "no_raw_header_retained",
  "no_raw_token_retained",
  "no_token_derived_fingerprint_retained",
  "no_token_prefix_suffix_length_hash_digest_claims_decoded_output",
  "no_route_response_exposure",
  "no_logging_echo_storage_forwarding",
] as const;

export type ReadOnlyMcpAuthorizationParserRouteDecisionReadinessInput = {
  authorization_presence: Fp0146AuthorizationPresence;
  authorization_scheme_classification: Fp0146AuthorizationSchemeClassification;
  credential_material_observed: boolean;
  failure_state: Fp0146FailureState | null;
};

export type ReadOnlyMcpAuthorizationParserRouteDecisionReadiness = {
  authorization_presence: Fp0146AuthorizationPresence;
  authorization_scheme_classification: Fp0146AuthorizationSchemeClassification;
  credential_material_observed: boolean;
  envelope_failure: Fp0146ParserFailureMapping["envelopeFailure"] | null;
  invalid_token_challenge_downstream_only: true;
  maps_to_fp0130_missing_token_lane: boolean;
  maps_to_fp0139_result_envelope: boolean;
  no_logging_echo_storage_forwarding: true;
  no_raw_header_retained: true;
  no_raw_token_retained: true;
  no_route_response_exposure: true;
  no_token_derived_fingerprint_retained: true;
  no_token_prefix_suffix_length_hash_digest_claims_decoded_output: true;
  parser_failure_state: Fp0146FailureState | null;
  parser_route_decision_contract_version: typeof MCP_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_SCHEMA_VERSION;
};

export type ReadOnlyMcpAuthorizationParserRouteDecisionDependencyInput = {
  authorizationHeader?: string | readonly string[] | null;
};

export type ReadOnlyMcpAuthorizationParserRouteDecisionDependency = (
  input: ReadOnlyMcpAuthorizationParserRouteDecisionDependencyInput,
) => ReadOnlyMcpAuthorizationParserRouteDecisionReadiness;

export function deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness(
  input: ReadOnlyMcpAuthorizationParserRouteDecisionReadinessInput,
): ReadOnlyMcpAuthorizationParserRouteDecisionReadiness {
  const failureMapping = findFailureMapping(input.failure_state);
  const mapsToMissingLane = input.failure_state === "missing_authorization";
  const mapsToEnvelope =
    input.failure_state !== null &&
    input.failure_state !== "missing_authorization";

  return {
    parser_route_decision_contract_version:
      MCP_AUTHORIZATION_PARSER_ROUTE_INTEGRATION_READINESS_SCHEMA_VERSION,
    authorization_presence: input.authorization_presence,
    authorization_scheme_classification:
      input.authorization_scheme_classification,
    credential_material_observed: input.credential_material_observed,
    parser_failure_state: input.failure_state,
    envelope_failure: mapsToEnvelope
      ? (failureMapping?.envelopeFailure ?? null)
      : null,
    maps_to_fp0130_missing_token_lane: mapsToMissingLane,
    maps_to_fp0139_result_envelope: mapsToEnvelope,
    invalid_token_challenge_downstream_only: true,
    no_raw_header_retained: true,
    no_raw_token_retained: true,
    no_token_derived_fingerprint_retained: true,
    no_token_prefix_suffix_length_hash_digest_claims_decoded_output: true,
    no_route_response_exposure: true,
    no_logging_echo_storage_forwarding: true,
  };
}

function findFailureMapping(failureState: Fp0146FailureState | null) {
  if (failureState === null) return null;
  return FP0146_FAILURE_MAPPINGS.find(
    (mapping) => mapping.failureState === failureState,
  );
}
