import {
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_LEAKAGE_SURFACES,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCHEMA_VERSION,
  McpAcceptedValidationResultTestDoubleBoundarySchema,
  McpAudienceResourceScenarioTestDoubleBoundarySchema,
  McpFailureTaxonomyTestDoubleBoundarySchema,
  McpIssuerScenarioTestDoubleBoundarySchema,
  McpNoJwtLikeExampleBoundarySchema,
  McpNoRealTokenExampleBoundarySchema,
  McpNoRuntimeConsumptionBoundarySchema,
  McpNoTokenLeakageTestDoubleBoundarySchema,
  McpNoTokenPassthroughTestDoubleBoundarySchema,
  McpRejectedValidationResultTestDoubleBoundarySchema,
  McpRevocationReplayScenarioTestDoubleBoundarySchema,
  McpScopeScenarioTestDoubleBoundarySchema,
  McpSelectorOnlyCompanyKeyTestDoubleBoundarySchema,
  McpSubjectOrgCompanyScenarioTestDoubleBoundarySchema,
  McpSyntheticNonTokenInputBoundarySchema,
  McpSyntheticValidationScenarioBoundarySchema,
  McpTemporalScenarioTestDoubleBoundarySchema,
  McpTokenValidationTestDoubleProofContractSchema,
} from "./read-only-app-mcp-token-validation-test-double-contracts";
import { McpTokenValidationTestDoubleResultEnvelopeSchema } from "./read-only-app-mcp-token-validation-test-double-result-envelope";

const baseContract = {
  contractOnly: true,
  implementationAdded: false,
  localProofOnly: true,
  readOnly: true,
  schemaVersion: MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCHEMA_VERSION,
} as const;

export function buildMcpTokenValidationTestDoubleContracts() {
  return {
    proofContract: McpTokenValidationTestDoubleProofContractSchema.parse({
      ...baseContract,
      contractKind: "McpTokenValidationTestDoubleProofContract",
      noRuntimeImplementation: true,
      scenarioFamilies: [...MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES],
      tokenValidationTestDoubleContractsVerified: true,
    }),
    syntheticValidationScenarioBoundary:
      McpSyntheticValidationScenarioBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpSyntheticValidationScenarioBoundary",
        fixtureFilesRequired: false,
        realTokenMaterialAccepted: false,
        syntheticScenarioDescriptorsOnly: true,
        tokenLikeInputAccepted: false,
      }),
    syntheticNonTokenInputBoundary:
      McpSyntheticNonTokenInputBoundarySchema.parse({
        ...baseContract,
        authorizationHeaderAccepted: false,
        bearerValueAccepted: false,
        contractKind: "McpSyntheticNonTokenInputBoundary",
        inputKind: "fixtureless_non_token_descriptor",
        jwtLikeValueAccepted: false,
        tokenStringAccepted: false,
      }),
    noRealTokenExampleBoundary: McpNoRealTokenExampleBoundarySchema.parse({
      ...baseContract,
      accessTokenFieldsAllowed: false,
      bearerTokenMaterialExamplesAllowed: false,
      contractKind: "McpNoRealTokenExampleBoundary",
      credentialExamplesAllowed: false,
      realTokenExamplesAllowed: false,
      refreshTokenFieldsAllowed: false,
    }),
    noJwtLikeExampleBoundary: McpNoJwtLikeExampleBoundarySchema.parse({
      ...baseContract,
      contractKind: "McpNoJwtLikeExampleBoundary",
      decodedJwtClaimsAllowed: false,
      jwtDecodingPerformed: false,
      jwtLikeStringsAllowed: false,
    }),
    acceptedValidationResultTestDoubleBoundary:
      McpAcceptedValidationResultTestDoubleBoundarySchema.parse({
        ...baseContract,
        acceptedResultCanBeModeled: true,
        carriesAuthorizationHeader: false,
        carriesDecodedClaims: false,
        carriesRawToken: false,
        contractKind: "McpAcceptedValidationResultTestDoubleBoundary",
        requiresSyntheticSubjectOrgCompanyBinding: true,
      }),
    rejectedValidationResultTestDoubleBoundary:
      McpRejectedValidationResultTestDoubleBoundarySchema.parse({
        ...baseContract,
        carriesAuthorizationHeader: false,
        carriesRawToken: false,
        contractKind: "McpRejectedValidationResultTestDoubleBoundary",
        mapsToRouteChallengeRuntime: false,
        rejectedResultCanBeModeled: true,
        usesFailureTaxonomy: true,
      }),
    issuerScenarioTestDoubleBoundary:
      McpIssuerScenarioTestDoubleBoundarySchema.parse(scenario("issuer")),
    audienceResourceScenarioTestDoubleBoundary:
      McpAudienceResourceScenarioTestDoubleBoundarySchema.parse(
        scenario("audience_resource"),
      ),
    scopeScenarioTestDoubleBoundary:
      McpScopeScenarioTestDoubleBoundarySchema.parse(scenario("scope")),
    temporalScenarioTestDoubleBoundary:
      McpTemporalScenarioTestDoubleBoundarySchema.parse(scenario("temporal")),
    revocationReplayScenarioTestDoubleBoundary:
      McpRevocationReplayScenarioTestDoubleBoundarySchema.parse(
        scenario("revocation_replay"),
      ),
    subjectOrgCompanyScenarioTestDoubleBoundary:
      McpSubjectOrgCompanyScenarioTestDoubleBoundarySchema.parse(
        scenario("subject_org_company"),
      ),
    failureTaxonomyTestDoubleBoundary:
      McpFailureTaxonomyTestDoubleBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpFailureTaxonomyTestDoubleBoundary",
        failureModes: [...MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY],
        routeStatusMappingImplemented: false,
        taxonomyProofOnly: true,
      }),
    selectorOnlyCompanyKeyTestDoubleBoundary:
      McpSelectorOnlyCompanyKeyTestDoubleBoundarySchema.parse({
        ...baseContract,
        authenticatedBindingRequiredForAuthority: true,
        clientCompanyKeyAuthorityAllowed: false,
        clientCompanyKeySelectorOnly: true,
        contractKind: "McpSelectorOnlyCompanyKeyTestDoubleBoundary",
      }),
    noTokenPassthroughTestDoubleBoundary:
      McpNoTokenPassthroughTestDoubleBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpNoTokenPassthroughTestDoubleBoundary",
        downstreamTokenTransitAllowed: false,
        resultEnvelopeMayCarryToken: false,
        tokenPassthroughForbidden: true,
      }),
    noTokenLeakageTestDoubleBoundary:
      McpNoTokenLeakageTestDoubleBoundarySchema.parse({
        ...baseContract,
        contractKind: "McpNoTokenLeakageTestDoubleBoundary",
        leakageSurfaces: [...MCP_TOKEN_VALIDATION_TEST_DOUBLE_LEAKAGE_SURFACES],
        noBearerTokenMaterialExamples: true,
        noJwtLikeExamples: true,
        noRealTokenExamples: true,
      }),
    noRuntimeConsumptionBoundary: McpNoRuntimeConsumptionBoundarySchema.parse({
      ...baseContract,
      contractKind: "McpNoRuntimeConsumptionBoundary",
      noAuthMiddlewareImplementation: true,
      noInvalidTokenChallengeRuntime: true,
      noMcpRouteBehaviorChange: true,
      noMissingTokenChallengeBehaviorChange: true,
      noProtectedResourceMetadataRouteBehaviorChange: true,
      noRouteConsumesTestDoubles: true,
      noTestDoubleRuntimeImplemented: true,
      noTokenParsingRuntime: true,
      noTokenValidationRuntime: true,
    }),
  };
}

export function buildMcpAcceptedValidationResultTestDoubleEnvelope() {
  return McpTokenValidationTestDoubleResultEnvelopeSchema.parse({
    accepted: true,
    carriesAuthorizationHeader: false,
    carriesJwtClaims: false,
    carriesRawToken: false,
    resultKind: "accepted_test_double",
    subjectOrgCompanyBinding: {
      companyKeySelectorOnly: true,
      companyRef: "synthetic-company-ref",
      orgRef: "synthetic-org-ref",
      subjectRef: "synthetic-subject-ref",
    },
    syntheticScenarioId: "synthetic-accepted-scenario",
  });
}

export function buildMcpRejectedValidationResultTestDoubleEnvelope() {
  return McpTokenValidationTestDoubleResultEnvelopeSchema.parse({
    accepted: false,
    carriesAuthorizationHeader: false,
    carriesJwtClaims: false,
    carriesRawToken: false,
    failureMode: "wrong-company",
    resultKind: "rejected_test_double",
    subjectOrgCompanyBinding: {
      companyKeySelectorOnly: true,
    },
    syntheticScenarioId: "synthetic-rejected-scenario",
  });
}

function scenario(family: string) {
  const contractKindByFamily = {
    audience_resource: "McpAudienceResourceScenarioTestDoubleBoundary",
    issuer: "McpIssuerScenarioTestDoubleBoundary",
    revocation_replay: "McpRevocationReplayScenarioTestDoubleBoundary",
    scope: "McpScopeScenarioTestDoubleBoundary",
    subject_org_company: "McpSubjectOrgCompanyScenarioTestDoubleBoundary",
    temporal: "McpTemporalScenarioTestDoubleBoundary",
  } as const;
  return {
    ...baseContract,
    contractKind:
      contractKindByFamily[family as keyof typeof contractKindByFamily],
    modeledAsScenarioDescriptor: true,
    runtimeCheckImplemented: false,
    tokenMaterialRequired: false,
  };
}
