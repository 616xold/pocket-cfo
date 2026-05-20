import { MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY } from "./read-only-app-mcp-token-validation-test-double-contracts";
import { buildMcpTokenValidationTestDoubleContracts } from "./read-only-app-mcp-token-validation-test-double-builders";
import { McpTokenValidationTestDoubleResultEnvelopeSchema } from "./read-only-app-mcp-token-validation-test-double-result-envelope";
import { scanTokenValidationNoLeakage } from "./read-only-app-mcp-token-validation";

export function assessMcpSyntheticNonTokenInput(text: string) {
  const leakageScan = scanTokenValidationNoLeakage(text);
  const jwtLikeMatch =
    /\b[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/u.test(text);
  const accepted = leakageScan.accepted && !jwtLikeMatch;
  return {
    accepted,
    rejectionReasons: [
      ...leakageScan.rejectionReasons,
      jwtLikeMatch ? "jwt_like_string_rejected" : "",
    ].filter(Boolean),
  };
}

export function assessMcpTokenValidationTestDoubleEnvelopeNoTokenMaterial(
  envelope: unknown,
) {
  const parsed =
    McpTokenValidationTestDoubleResultEnvelopeSchema.safeParse(envelope);
  const text = JSON.stringify(envelope);
  const leakageScan = scanTokenValidationNoLeakage(text);
  return {
    accepted: parsed.success && leakageScan.accepted,
    leakageAccepted: leakageScan.accepted,
    rejectionReasons: parsed.success
      ? leakageScan.rejectionReasons
      : ["invalid_test_double_envelope", ...leakageScan.rejectionReasons],
    schemaAccepted: parsed.success,
  };
}

export function verifyMcpTokenValidationTestDoubleContractBoundaries() {
  const contracts = buildMcpTokenValidationTestDoubleContracts();
  return (
    contracts.proofContract.noRuntimeImplementation &&
    contracts.syntheticValidationScenarioBoundary
      .syntheticScenarioDescriptorsOnly &&
    !contracts.syntheticNonTokenInputBoundary.tokenStringAccepted &&
    !contracts.noRealTokenExampleBoundary.realTokenExamplesAllowed &&
    !contracts.noJwtLikeExampleBoundary.jwtLikeStringsAllowed &&
    !contracts.acceptedValidationResultTestDoubleBoundary.carriesRawToken &&
    contracts.rejectedValidationResultTestDoubleBoundary.usesFailureTaxonomy &&
    contracts.failureTaxonomyTestDoubleBoundary.failureModes.length ===
      MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY.length &&
    contracts.selectorOnlyCompanyKeyTestDoubleBoundary
      .clientCompanyKeySelectorOnly &&
    contracts.noTokenPassthroughTestDoubleBoundary.tokenPassthroughForbidden &&
    contracts.noTokenLeakageTestDoubleBoundary.noBearerTokenMaterialExamples &&
    contracts.noRuntimeConsumptionBoundary.noRouteConsumesTestDoubles
  );
}

export function verifyMcpTokenValidationTestDoubleNoTokenExamples() {
  const safeInputs = [
    "synthetic scenario descriptor: issuer mismatch posture only",
    "fixtureless non-token input with companyKey as selector only",
    "accepted result envelope carries synthetic binding refs only",
  ];
  const forbiddenInputs = [
    ["Bearer", "synthetic-token-material"].join(" "),
    ["access_token", "=", "synthetic-token-material"].join(""),
    ["refresh_token", "=", "synthetic-token-material"].join(""),
    [["jwtlikeheader"], ["jwtlikepayload"], ["jwtlikesignature"]]
      .map((part) => part.join("").padEnd(12, "x"))
      .join("."),
  ];

  return (
    safeInputs.every(
      (input) => assessMcpSyntheticNonTokenInput(input).accepted,
    ) &&
    forbiddenInputs.every(
      (input) => !assessMcpSyntheticNonTokenInput(input).accepted,
    )
  );
}
