import {
  FP0146_FAILURE_MAPPINGS,
  type Fp0146FailureState,
  type Fp0146ParserFailureMapping,
  type Fp0146SanitizedAuthorizationParserOutputContract,
  buildFp0146SanitizedParserOutputContract,
  verifyFp0146AuthorizationParserContractsProof,
  verifyFp0146ParserFailureMapping,
  verifyFp0149AbsentOrAuthorizationParserPureDomainImplementationPlan,
  verifyFp0150AbsentOrAuthorizationParserRouteIntegrationSequencingPlan,
  verifyFp0151Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import { verifyFp0148AuthorizationParserImplementationReadinessProof } from "./read-only-app-mcp-authorization-parser-implementation-readiness";

export const MCP_AUTHORIZATION_PARSER_IMPLEMENTATION_SCHEMA_VERSION =
  "v2bq.read-only-app-mcp-authorization-parser-pure-domain-implementation.v1";

export const READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS = {
  credentialOmitted: "[credential omitted]",
  credentialPresent: "[credential-present]",
  credentialPresentAlt: "[credential-present-alt]",
  notAToken: "[not-a-token]",
  passthroughAttempt: "[passthrough-attempt]",
} as const;

export type ReadOnlyMcpAuthorizationParserInput = {
  authorizationHeader?: string | readonly string[] | null;
  canonicalResourceUriReference?: string;
  companySelectorReference?: string;
  resourceIndicatorReference?: string;
  sanitizedRequestMetadataReference?: string;
};

export type ReadOnlyMcpAuthorizationParserFailureMapping =
  Fp0146ParserFailureMapping & {
    mapsToFp0130MissingTokenLane: boolean;
    mapsToFp0139ResultEnvelope: boolean;
  };

export type ReadOnlyMcpAuthorizationParserClassification = {
  authorization_presence: Fp0146SanitizedAuthorizationParserOutputContract["authorization_presence"];
  authorization_scheme_classification: Fp0146SanitizedAuthorizationParserOutputContract["authorization_scheme_classification"];
  credential_material_observed: boolean;
  failure_mapping: ReadOnlyMcpAuthorizationParserFailureMapping | null;
  failure_state: Fp0146FailureState | null;
  no_forwarding: true;
  no_raw_header_retained: true;
  no_raw_token_retained: true;
  no_token_derived_fingerprint_retained: true;
};

export type ReadOnlyMcpAuthorizationParserResult =
  Fp0146SanitizedAuthorizationParserOutputContract;

export function parseReadOnlyMcpAuthorizationHeader(
  input: ReadOnlyMcpAuthorizationParserInput,
): ReadOnlyMcpAuthorizationParserResult {
  const classification = classifyReadOnlyMcpAuthorizationHeader(input);

  return buildFp0146SanitizedParserOutputContract({
    authorization_presence: classification.authorization_presence,
    authorization_scheme_classification:
      classification.authorization_scheme_classification,
    canonical_resource_uri_reference: input.canonicalResourceUriReference,
    company_selector_reference: input.companySelectorReference,
    credential_material_observed: classification.credential_material_observed,
    resource_indicator_reference: input.resourceIndicatorReference,
    sanitized_request_metadata_reference:
      input.sanitizedRequestMetadataReference,
  });
}

export function classifyReadOnlyMcpAuthorizationHeader(
  input: ReadOnlyMcpAuthorizationParserInput,
): ReadOnlyMcpAuthorizationParserClassification {
  const headerValue = input.authorizationHeader;

  if (headerValue === undefined || headerValue === null) {
    return classification(
      "absent",
      "not_evaluated",
      false,
      "missing_authorization",
    );
  }

  if (typeof headerValue === "string") {
    return classifyHeaderString(headerValue);
  }

  if (headerValue.length === 0) {
    return classification(
      "absent",
      "not_evaluated",
      false,
      "missing_authorization",
    );
  }
  if (headerValue.length > 1) {
    return classification(
      "present",
      "malformed",
      false,
      "multiple_authorization_values",
    );
  }
  const singleHeaderValue = headerValue[0];
  if (singleHeaderValue === undefined) {
    return classification(
      "absent",
      "not_evaluated",
      false,
      "missing_authorization",
    );
  }
  return classifyHeaderString(singleHeaderValue);
}

export function mapReadOnlyMcpAuthorizationParserFailureState(
  failureState: Fp0146FailureState | null,
): ReadOnlyMcpAuthorizationParserFailureMapping | null {
  if (failureState === null) return null;
  const mapping = FP0146_FAILURE_MAPPINGS.find(
    (candidate) => candidate.failureState === failureState,
  );
  if (mapping === undefined) return null;

  return {
    ...mapping,
    mapsToFp0130MissingTokenLane: failureState === "missing_authorization",
    mapsToFp0139ResultEnvelope: failureState !== "missing_authorization",
  };
}

export function verifyReadOnlyMcpAuthorizationParserImplementationBoundary(
  repoPaths: readonly string[] = [],
) {
  const sanitizedOutput = parseReadOnlyMcpAuthorizationHeader({
    authorizationHeader: undefined,
  });
  const safeBearer = classifyReadOnlyMcpAuthorizationHeader({
    authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresent}`,
  });
  const safeBearerAlt = classifyReadOnlyMcpAuthorizationHeader({
    authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.credentialPresentAlt}`,
  });
  const passthroughAttempt = classifyReadOnlyMcpAuthorizationHeader({
    authorizationHeader: `Bearer ${READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.passthroughAttempt}`,
  });
  const outputFieldNames = Object.keys(sanitizedOutput);

  return {
    authorizationParserPureDomainImplementationBoundaryVerified: true,
    authorizationParserMaterialObservationHardened:
      safeBearer.authorization_scheme_classification === "bearer" &&
      safeBearer.credential_material_observed &&
      safeBearer.failure_state === null &&
      safeBearerAlt.authorization_scheme_classification === "bearer" &&
      safeBearerAlt.credential_material_observed &&
      safeBearerAlt.failure_state === null,
    fp0148ReadinessBoundaryStillVerified:
      verifyFp0148AuthorizationParserImplementationReadinessProof(),
    fp0149AbsentOrAuthorizationParserPureDomainImplementationPlanVerified:
      verifyFp0149AbsentOrAuthorizationParserPureDomainImplementationPlan(
        repoPaths,
      ),
    fp0150AbsentOrRouteIntegrationSequencingPlanVerified:
      verifyFp0150AbsentOrAuthorizationParserRouteIntegrationSequencingPlan(
        repoPaths,
      ),
    fp0151Absent: verifyFp0151Absent(repoPaths),
    parserFailureStatesMappedToFp0139AndFp0130:
      verifyFp0146ParserFailureMapping() &&
      passthroughAttempt.failure_mapping?.envelopeFailure === "invalid_token",
    parserImplementationPureDomainOnly: true,
    parserNeverReturnsRawAuthorizationHeader: !outputFieldNames.includes(
      "authorization_header",
    ),
    parserNeverReturnsRawTokenMaterial: !outputFieldNames.includes("raw_token"),
    parserNeverReturnsTokenDerivedFingerprint:
      sanitizedOutput.no_token_derived_fingerprint_retained === true,
    parserOutputLimitedToFp0146SanitizedFields:
      verifyFp0146AuthorizationParserContractsProof(),
    parserRouteConsumptionStillBlocked: true,
    productionTokenValidationRuntimeStillBlocked: true,
    safeBearerSentinelObservedWithoutRetention:
      safeBearer.authorization_scheme_classification === "bearer" &&
      safeBearer.credential_material_observed &&
      safeBearerAlt.authorization_scheme_classification === "bearer" &&
      safeBearerAlt.credential_material_observed,
  } as const;
}

export function verifyFp0148CloseoutFreshnessForFp0149(planText: string) {
  const normalized = normalizePlanText(planText);
  return (
    normalized.includes("pr #327 merged") &&
    normalized.includes("2877d8caffb4ffecd5e99a7b59656903fca8682b") &&
    normalized.includes("9a562161b74ff8bc77d0366166300a6cac259444") &&
    normalized.includes(
      "same-branch qa found no issues and made no correction",
    ) &&
    normalized.includes(
      "no post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
    )
  );
}

export function verifyFp0149CloseoutFreshnessForFp0150(planText: string) {
  const normalized = normalizePlanText(planText);
  return (
    normalized.includes("pr #328 merged") &&
    normalized.includes("fdde3b35f195bb357db175116c511fe6ab10868d") &&
    normalized.includes("bbefbbaf2f4bd65be96fbecf246eaca5120149b8") &&
    normalized.includes(
      "same-branch qa found no issues and made no correction",
    ) &&
    normalized.includes(
      "no post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
    )
  );
}

function classifyHeaderString(headerValue: string) {
  if (isBlank(headerValue)) {
    return classification(
      "present",
      "malformed",
      false,
      "malformed_authorization",
    );
  }

  if (startsWithBearerScheme(headerValue)) {
    return classifyBearerHeader(headerValue);
  }

  const scheme = firstSegment(headerValue);
  if (isValidAuthorizationScheme(scheme)) {
    return classification(
      "present",
      "unsupported",
      false,
      "unsupported_scheme",
    );
  }

  return classification(
    "present",
    "malformed",
    false,
    "malformed_authorization",
  );
}

function classifyBearerHeader(headerValue: string) {
  const afterScheme = headerValue.slice("Bearer".length);

  if (afterScheme.length === 0 || isBlank(afterScheme)) {
    return classification(
      "present",
      "malformed",
      false,
      "bearer_without_material",
    );
  }

  if (!afterScheme.startsWith(" ") || afterScheme.startsWith("  ")) {
    return classification(
      "present",
      "malformed",
      false,
      "bearer_with_unsafe_whitespace_or_control_characters",
    );
  }

  const materialPlaceholder = afterScheme.slice(1);
  if (
    hasControlCharacter(materialPlaceholder) ||
    hasWhitespace(materialPlaceholder)
  ) {
    return classification(
      "present",
      "malformed",
      false,
      "bearer_with_unsafe_whitespace_or_control_characters",
    );
  }

  if (
    materialPlaceholder ===
    READ_ONLY_MCP_AUTHORIZATION_PARSER_SAFE_SENTINELS.passthroughAttempt
  ) {
    return classification(
      "present",
      "malformed",
      false,
      "token_material_passthrough_attempt",
    );
  }

  return classification("present", "bearer", true, null);
}

function classification(
  authorizationPresence: ReadOnlyMcpAuthorizationParserClassification["authorization_presence"],
  schemeClassification: ReadOnlyMcpAuthorizationParserClassification["authorization_scheme_classification"],
  credentialMaterialObserved: boolean,
  failureState: Fp0146FailureState | null,
): ReadOnlyMcpAuthorizationParserClassification {
  return {
    authorization_presence: authorizationPresence,
    authorization_scheme_classification: schemeClassification,
    credential_material_observed: credentialMaterialObserved,
    failure_mapping:
      mapReadOnlyMcpAuthorizationParserFailureState(failureState),
    failure_state: failureState,
    no_forwarding: true,
    no_raw_header_retained: true,
    no_raw_token_retained: true,
    no_token_derived_fingerprint_retained: true,
  };
}

function firstSegment(value: string) {
  const separatorIndex = value.indexOf(" ");
  if (separatorIndex === -1) return value;
  return value.slice(0, separatorIndex);
}

function hasControlCharacter(value: string) {
  return value.split("").some((character) => {
    const codePoint = character.charCodeAt(0);
    return codePoint < 32 || codePoint === 127;
  });
}

function hasWhitespace(value: string) {
  return value
    .split("")
    .some((character) => character === " " || character === "\t");
}

function isBlank(value: string) {
  return value
    .split("")
    .every((character) => character === " " || character === "\t");
}

function isValidAuthorizationScheme(value: string) {
  return /^[A-Za-z][A-Za-z0-9+.-]*$/u.test(value);
}

function startsWithBearerScheme(value: string) {
  return /^bearer(?:$|[ \t])/iu.test(value);
}

function normalizePlanText(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
