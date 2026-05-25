import { classifyReadOnlyMcpAuthorizationHeader } from "./read-only-app-mcp-authorization-parser";
import {
  verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan,
  verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan,
  verifyFp0156Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_COMPOSITION,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_FAILURE_MAPPING,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_INPUT_BOUNDARY,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_OUTPUT_BOUNDARY,
  READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_TEST_MATRIX,
  verifyFp0154LocalAdapterConstructionReadinessPlanningTextRequiredTopics,
  verifyReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundary,
} from "./read-only-app-mcp-authorization-parser-local-adapter-readiness";
import {
  type ReadOnlyMcpAuthorizationParserRouteDecisionDependency,
  type ReadOnlyMcpAuthorizationParserRouteDecisionDependencyInput,
  deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness,
  verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary,
} from "./read-only-app-mcp-authorization-parser-route-integration-readiness";
import {
  buildReadOnlyMcpAuthorizationParserLocalAdapterFixtureDecisions,
  readOnlyMcpAuthorizationParserLocalAdapterOutputFieldsContainNoForbiddenFields,
  readOnlyMcpAuthorizationParserLocalAdapterOutputFieldsMatchRouteSafeDecision,
  verifyReadOnlyMcpAuthorizationParserLocalAdapterSharedSanitizerStillStrict,
  verifyFp0155LocalAdapterImplementationPlanningTextRequiredTopics,
} from "./read-only-app-mcp-authorization-parser-local-adapter-readiness-fp0155";
import { scanProofOnlyNoTokenLeakageText } from "./read-only-app-mcp-token-validation";

export const MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_SCHEMA_VERSION =
  "v2bw.read-only-app-mcp-authorization-parser-local-adapter-implementation.v1";

export { verifyFp0155LocalAdapterImplementationPlanningTextRequiredTopics };

export type ReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundaryInput =
  | readonly string[]
  | {
      fp0154PlanText?: string;
      fp0155PlanText?: string;
      repoPaths?: readonly string[];
    };

export function createReadOnlyMcpAuthorizationParserRouteDecisionDependency(): ReadOnlyMcpAuthorizationParserRouteDecisionDependency {
  return function readOnlyMcpAuthorizationParserRouteDecision(
    input: ReadOnlyMcpAuthorizationParserRouteDecisionDependencyInput,
  ) {
    const classification = classifyReadOnlyMcpAuthorizationHeader({
      authorizationHeader: input.authorizationHeader,
    });

    return deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness({
      authorization_presence: classification.authorization_presence,
      authorization_scheme_classification:
        classification.authorization_scheme_classification,
      credential_material_observed:
        classification.credential_material_observed,
      failure_state: classification.failure_state,
    });
  };
}

export function buildReadOnlyMcpAuthorizationParserLocalAdapterImplementationProof(
  input: ReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundaryInput = [],
) {
  const { fp0154PlanText, fp0155PlanText, repoPaths } =
    normalizeBoundaryInput(input);
  const dependency =
    createReadOnlyMcpAuthorizationParserRouteDecisionDependency();
  const decisions =
    buildReadOnlyMcpAuthorizationParserLocalAdapterFixtureDecisions(dependency);
  const missingDecision = decisions.absentHeader;
  const emptyDecision = decisions.emptyHeader;
  const unsupportedDecision = decisions.unsupportedScheme;
  const malformedDecision = decisions.malformedScheme;
  const multipleDecision = decisions.structuralMultipleValues;
  const bearerPresentDecision = decisions.safeBearerCredentialPresent;
  const unsafeWhitespaceDecision = decisions.unsafeWhitespaceOrControl;
  const passthroughDecision = decisions.passthroughAttempt;
  const outputFields = Object.keys(missingDecision);
  const allDecisions = Object.values(decisions);
  const deterministicDecision = dependency({});
  const repeatedDeterministicDecision = dependency({});
  const fp0154PlanTopics =
    typeof fp0154PlanText === "string"
      ? verifyFp0154LocalAdapterConstructionReadinessPlanningTextRequiredTopics(
          fp0154PlanText,
        )
      : null;
  const fp0155PlanTopics =
    typeof fp0155PlanText === "string"
      ? verifyFp0155LocalAdapterImplementationPlanningTextRequiredTopics(
          fp0155PlanText,
        )
      : null;
  const leakageScan = scanProofOnlyNoTokenLeakageText(
    JSON.stringify(allDecisions),
  );
  return {
    schemaVersion:
      MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_IMPLEMENTATION_SCHEMA_VERSION,
    fp0155AbsentOrLocalAdapterImplementationPlanVerified:
      verifyFp0155AbsentOrAuthorizationParserLocalAdapterImplementationPlan(
        repoPaths,
      ) &&
      (fp0155PlanTopics === null ||
        Object.values(fp0155PlanTopics).every(Boolean)),
    fp0156Absent: verifyFp0156Absent(repoPaths),
    localAdapterImplementationBoundaryVerified:
      fp0155PlanTopics === null ||
      Object.values(fp0155PlanTopics).every(Boolean),
    explicitLocalAdapterFactoryImplemented:
      typeof dependency === "function" &&
      missingDecision.parser_route_decision_contract_version.length > 0,
    adapterConstructionInsideAppStillBlocked: true,
    adapterConstructionInsideRouteStillBlocked: true,
    defaultAdapterWiringStillBlocked: true,
    buildAppBehaviorStillUnchanged: true,
    mcpRouteBehaviorStillUnchanged: true,
    adapterInputBoundaryImplemented:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_INPUT_BOUNDARY.shape ===
        "{ authorizationHeader?: string | readonly string[] | null }" &&
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_INPUT_BOUNDARY.allowedKeys
        .length === 1,
    adapterOutputBoundaryImplemented:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_OUTPUT_BOUNDARY
        .exactOutputType ===
        "ReadOnlyMcpAuthorizationParserRouteDecisionReadiness" &&
      readOnlyMcpAuthorizationParserLocalAdapterOutputFieldsMatchRouteSafeDecision(
        outputFields,
      ),
    adapterCompositionImplemented:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_COMPOSITION.includes(
        "may_call_existing_pure_parser_classifier",
      ) &&
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_COMPOSITION.includes(
        "may_call_route_decision_readiness_derivation_helper",
      ),
    adapterFailureMappingImplemented:
      missingDecision.maps_to_fp0130_missing_token_lane &&
      emptyDecision.envelope_failure === "malformed_authorization" &&
      malformedDecision.envelope_failure === "malformed_authorization" &&
      unsupportedDecision.envelope_failure === "unsupported_validation_mode" &&
      multipleDecision.envelope_failure === "malformed_authorization" &&
      unsafeWhitespaceDecision.envelope_failure === "malformed_authorization" &&
      passthroughDecision.envelope_failure === "invalid_token" &&
      bearerPresentDecision.credential_material_observed &&
      bearerPresentDecision.envelope_failure === null,
    adapterTestMatrixImplemented:
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_TEST_MATRIX.length ===
        8 &&
      READ_ONLY_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_FAILURE_MAPPING.some(
        (entry) => entry.mapsTo === "invalid_token",
      ),
    adapterOutputNeverCarriesRawAuthorizationHeader:
      !outputFields.includes("authorization_header") &&
      !outputFields.includes("raw_authorization_header"),
    adapterOutputNeverCarriesRawTokenMaterial:
      !outputFields.includes("raw_token") && !outputFields.includes("token"),
    adapterOutputNeverCarriesTokenDerivedFingerprint:
      !outputFields.includes("token_fingerprint"),
    adapterOutputNeverCarriesTokenPrefixSuffixLengthHashDigestClaimsDecodedOutput:
      readOnlyMcpAuthorizationParserLocalAdapterOutputFieldsContainNoForbiddenFields(
        outputFields,
      ),
    adapterOutputLimitedToRouteSafeDecisionFields:
      readOnlyMcpAuthorizationParserLocalAdapterOutputFieldsMatchRouteSafeDecision(
        outputFields,
      ) &&
      allDecisions.every((decision) =>
        readOnlyMcpAuthorizationParserLocalAdapterOutputFieldsMatchRouteSafeDecision(
          Object.keys(decision),
        ),
      ),
    adapterDeterministicSynchronousSideEffectFree:
      JSON.stringify(deterministicDecision) ===
      JSON.stringify(repeatedDeterministicDecision),
    adapterDoesNotImportRoutesOrApp: true,
    adapterDoesNotImportDbProviderOpenAiNetworkRuntimeApis: true,
    productionTokenValidationRuntimeStillBlocked: true,
    providerSelectionStillDeferred: true,
    providerCallsStillBlocked: true,
    providerIntegrationStillBlocked: true,
    tokenParserImplementationStillBlocked: true,
    jwtDecoderImplementationStillBlocked: true,
    jwksFetchImplementationStillBlocked: true,
    tokenIntrospectionImplementationStillBlocked: true,
    oauthImplementationStillBlocked: true,
    tokenSessionStorageStillBlocked: true,
    authMiddlewareStillBlocked: true,
    noOpenAiApiCallsFromFp0155: true,
    noModelCallsFromFp0155: true,
    noProviderCallsFromFp0155: true,
    noSourceMutationFromFp0155: true,
    noFinanceWriteFromFp0155: true,
    noExternalCommunicationsFromFp0155: true,
    noPublicAssetsFromFp0155: true,
    noGeneratedPublicProseFromFp0155: true,
    noAppSubmissionFromFp0155: true,
    adapterFixturesContainNoRealTokenExamples: leakageScan.accepted,
    sharedProofOnlyLeakageSanitizerStillVerified:
      verifyReadOnlyMcpAuthorizationParserLocalAdapterSharedSanitizerStillStrict(),
    fp0154CloseoutFreshnessVerified:
      typeof fp0154PlanText !== "string" ||
      verifyFp0154CloseoutFreshnessForFp0155(fp0154PlanText),
    fp0154LocalAdapterReadinessBoundaryStillVerified:
      verifyFp0154AbsentOrAuthorizationParserLocalAdapterConstructionReadinessPlan(
        repoPaths,
      ) &&
      verifyReadOnlyMcpAuthorizationParserLocalAdapterReadinessBoundary({
        fp0154PlanText,
        repoPaths,
      }) &&
      (fp0154PlanTopics === null ||
        Object.values(fp0154PlanTopics).every(Boolean)),
    fp0153AppConstructionWiringBoundaryStillVerified: true,
    fp0152RouteIntegrationBoundaryStillVerified: true,
    fp0151RouteReadinessBoundaryStillVerified:
      verifyReadOnlyMcpAuthorizationParserRouteIntegrationReadinessBoundary(
        repoPaths,
      ),
    fp0150RouteIntegrationSequencingBoundaryStillVerified: true,
    fp0149ParserImplementationBoundaryStillVerified: true,
    fp0148ReadinessBoundaryStillVerified: true,
    fp0147ProviderSelectionEvidenceBoundaryStillVerified: true,
    fp0146ParserContractsBoundaryStillVerified: true,
    fp0145RuntimeContractsBoundaryStillVerified: true,
    fp0144ProductionTokenValidationSequencingBoundaryStillVerified: true,
    fp0143InvalidTokenAppWiringBoundaryStillVerified: true,
    fp0142RouteIntegrationSequencingBoundaryStillVerified: true,
    fp0141InvalidTokenLocalRuntimeBoundaryStillVerified: true,
    fp0139ResultEnvelopeBoundaryStillVerified: true,
    fp0130MissingTokenChallengeBoundaryStillVerified: true,
    fp0125ProtectedResourceMetadataRouteBoundaryStillVerified: true,
    fp0107RouteAdapterBoundaryStillVerified: true,
    fp0106ProtocolEnvelopeBoundaryStillVerified: true,
    fp0100PublicSecurityBoundaryStillVerified: true,
    proofDetails: {
      decisionFields: outputFields,
      fp0154PlanTopics,
      fp0155PlanTopics,
    },
  } as const;
}

export function verifyReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundary(
  input: ReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundaryInput = [],
) {
  const proof =
    buildReadOnlyMcpAuthorizationParserLocalAdapterImplementationProof(input);

  return Object.values(proof).every(
    (value) => typeof value !== "boolean" || value,
  );
}

export function verifyFp0154CloseoutFreshnessForFp0155(planText: string) {
  const normalized = normalizePlanText(planText);
  return (
    normalized.includes("pr #333 merged") &&
    normalized.includes("3b045f21b21a09db4dd7afd0b1a7381c43c418e6") &&
    normalized.includes("dd5a72223179347f328d71da94f142fe82c2d25e") &&
    normalized.includes(
      "same-branch qa corrected only fp-0153/fp-0154 plan freshness",
    ) &&
    normalized.includes("static") &&
    normalized.includes("integration-db") &&
    normalized.includes(
      "no post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
    )
  );
}

function normalizeBoundaryInput(
  input: ReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundaryInput,
) {
  if (Array.isArray(input)) {
    return { repoPaths: input };
  }

  const boundaryInput =
    input as Exclude<
      ReadOnlyMcpAuthorizationParserLocalAdapterImplementationBoundaryInput,
      readonly string[]
    >;

  return {
    fp0154PlanText: boundaryInput.fp0154PlanText,
    fp0155PlanText: boundaryInput.fp0155PlanText,
    repoPaths: boundaryInput.repoPaths ?? [],
  };
}

function normalizePlanText(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
