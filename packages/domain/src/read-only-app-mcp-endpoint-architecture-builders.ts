import type { z } from "zod";
import {
  APP_REFUSAL_REASONS,
  MCP_FORBIDDEN_TOOL_NAMES,
  MCP_TOOL_ALLOWLIST,
} from "./read-only-app-mcp-boundaries";
import type { EndpointArchitectureContractKindSchema } from "./read-only-app-mcp-endpoint-architecture-contracts";
import {
  ENDPOINT_ARCHITECTURE_SCHEMA_VERSION,
  ENDPOINT_FAIL_CLOSED_REQUESTS,
  ENDPOINT_FUTURE_INVENTORY_FIELDS,
  ENDPOINT_RESPONSE_ENVELOPE_FIELDS,
  EndpointArchitectureProofContractSchema,
  EndpointEvidenceFreshnessLimitationsBoundarySchema,
  EndpointInventoryDeferredBoundarySchema,
  EndpointNoAppSubmissionBoundarySchema,
  EndpointNoAppsSdkResourceBoundarySchema,
  EndpointNoOauthTokenSessionBoundarySchema,
  EndpointNoOpenAiApiModelCallsBoundarySchema,
  EndpointNoRemoteMcpDeploymentBoundarySchema,
  EndpointNoRouteImplementationBoundarySchema,
  EndpointNoSourceMutationFinanceWriteBoundarySchema,
  EndpointNoWebApiBackendRouteBoundarySchema,
  EndpointNoWriteActionToolsBoundarySchema,
  EndpointPathInventoryPreconditionsSchema,
  EndpointReadOnlyToolAllowlistBoundarySchema,
  EndpointRefusalFailureModeBoundarySchema,
  EndpointRequestResponseEnvelopeBoundarySchema,
  EndpointTlsHttpsFutureRequirementBoundarySchema,
  EndpointTransportChoiceBoundarySchema,
  EndpointTrustModelBoundarySchema,
} from "./read-only-app-mcp-endpoint-architecture-contracts";

export function buildEndpointArchitectureContracts() {
  return {
    architectureProofContract: EndpointArchitectureProofContractSchema.parse({
      ...base("EndpointArchitectureProofContract"),
      appSubmissionAuthorized: false,
      appsSdkResourceImplementationAuthorized: false,
      endpointArchitectureProofContractsOnly: true,
      endpointImplementationAuthorized: false,
      fp0104Created: false,
      oauthTokenSessionImplementationAuthorized: false,
      openAiApiModelCallsAuthorized: false,
      publicAppImplementationAuthorized: false,
      remoteMcpDeploymentAuthorized: false,
      routeImplementationAuthorized: false,
    }),
    evidenceFreshnessLimitationsBoundary:
      EndpointEvidenceFreshnessLimitationsBoundarySchema.parse({
        ...base("EndpointEvidenceFreshnessLimitationsBoundary"),
        evidenceRequired: true,
        freshnessRequired: true,
        limitationsRequired: true,
        missingEvidenceFailsClosed: true,
        permittedNextActionsRequired: true,
        sourceAnchorsRequired: true,
      }),
    inventoryDeferredBoundary: EndpointInventoryDeferredBoundarySchema.parse({
      ...base("EndpointInventoryDeferredBoundary"),
      endpointInventoryFutureOnly: true,
      endpointInventoryImplemented: false,
      requiredFutureInventoryFields: [...ENDPOINT_FUTURE_INVENTORY_FIELDS],
      requiresLaterFinancePlan: true,
      requiresLaterSecurityReview: true,
    }),
    noAppSubmissionBoundary: EndpointNoAppSubmissionBoundarySchema.parse(
      noImplementation("EndpointNoAppSubmissionBoundary"),
    ),
    noAppsSdkResourceBoundary: EndpointNoAppsSdkResourceBoundarySchema.parse(
      noImplementation("EndpointNoAppsSdkResourceBoundary"),
    ),
    noOauthTokenSessionBoundary:
      EndpointNoOauthTokenSessionBoundarySchema.parse(
        noImplementation("EndpointNoOauthTokenSessionBoundary"),
      ),
    noOpenAiApiModelCallsBoundary:
      EndpointNoOpenAiApiModelCallsBoundarySchema.parse(
        noImplementation("EndpointNoOpenAiApiModelCallsBoundary"),
      ),
    noRemoteMcpDeploymentBoundary:
      EndpointNoRemoteMcpDeploymentBoundarySchema.parse(
        noImplementation("EndpointNoRemoteMcpDeploymentBoundary"),
      ),
    noRouteImplementationBoundary:
      EndpointNoRouteImplementationBoundarySchema.parse(
        noImplementation("EndpointNoRouteImplementationBoundary"),
      ),
    noSourceMutationFinanceWriteBoundary:
      EndpointNoSourceMutationFinanceWriteBoundarySchema.parse(
        noImplementation("EndpointNoSourceMutationFinanceWriteBoundary"),
      ),
    noWebApiBackendRouteBoundary:
      EndpointNoWebApiBackendRouteBoundarySchema.parse(
        noImplementation("EndpointNoWebApiBackendRouteBoundary"),
      ),
    noWriteActionToolsBoundary:
      EndpointNoWriteActionToolsBoundarySchema.parse(
        noImplementation("EndpointNoWriteActionToolsBoundary"),
      ),
    pathInventoryPreconditions:
      EndpointPathInventoryPreconditionsSchema.parse({
        ...base("EndpointPathInventoryPreconditions"),
        futureEndpointInventoryMustNameAllFields: true,
        implementationRequiresLaterAcceptedInventory: true,
        noEndpointPathImplemented: true,
        noHealthPathImplemented: true,
      }),
    readOnlyToolAllowlistBoundary:
      EndpointReadOnlyToolAllowlistBoundarySchema.parse({
        ...base("EndpointReadOnlyToolAllowlistBoundary"),
        allowedTools: [...MCP_TOOL_ALLOWLIST],
        dynamicToolsAllowed: false,
        existingV2gDescriptorAllowlistRemainsReadOnly: true,
        forbiddenTools: [...MCP_FORBIDDEN_TOOL_NAMES],
        writeModifyActionToolsAllowed: false,
      }),
    refusalFailureModeBoundary: EndpointRefusalFailureModeBoundarySchema.parse({
      ...base("EndpointRefusalFailureModeBoundary"),
      existingRefusalReasonsPreserved: [...APP_REFUSAL_REASONS],
      failClosed: true,
      generatedFinanceAdviceAllowed: false,
      requiredFailClosedRequests: [...ENDPOINT_FAIL_CLOSED_REQUESTS],
    }),
    requestResponseEnvelopeBoundary:
      EndpointRequestResponseEnvelopeBoundarySchema.parse({
        ...base("EndpointRequestResponseEnvelopeBoundary"),
        envelopeFutureOnly: true,
        rawFullFileDumpsAllowed: false,
        responseMustPreserveFields: [...ENDPOINT_RESPONSE_ENVELOPE_FIELDS],
      }),
    tlsHttpsFutureRequirementBoundary:
      EndpointTlsHttpsFutureRequirementBoundarySchema.parse({
        ...base("EndpointTlsHttpsFutureRequirementBoundary"),
        deploymentFutureOnly: true,
        stableHttpsHostFutureOnly: true,
        tlsConfiguredNow: false,
        tlsHttpsFutureRequirement: true,
      }),
    transportChoiceBoundary: EndpointTransportChoiceBoundarySchema.parse({
      ...base("EndpointTransportChoiceBoundary"),
      laterJustificationAgainstOfficialDocsRequired: true,
      supportedFutureTransportFamilies: ["streamable_http", "http_sse"],
      transportChoiceIsArchitectureInputOnly: true,
      transportImplemented: false,
    }),
    trustModelBoundary: EndpointTrustModelBoundarySchema.parse({
      ...base("EndpointTrustModelBoundary"),
      callerTrustMustBeNamedLater: true,
      cfoWikiRemainsDerived: true,
      evidenceIndexRemainsReadOnlyAnchorLayer: true,
      financeTwinRemainsStructuredTruth: true,
      modelVisibleDataMustBeNamedLater: true,
      rawSourcesRemainDocumentTruth: true,
      trustModelFutureOnly: true,
    }),
  };
}

function base(
  contractKind: z.infer<typeof EndpointArchitectureContractKindSchema>,
) {
  return {
    contractKind,
    localProofOnly: true,
    publicAppImplemented: false,
    schemaVersion: ENDPOINT_ARCHITECTURE_SCHEMA_VERSION,
  };
}

function noImplementation(
  contractKind: z.infer<typeof EndpointArchitectureContractKindSchema>,
) {
  return {
    ...base(contractKind),
    failIfChangedRuntimeSurfaceAppears: true,
    futureOnly: true,
    implemented: false,
    requiresLaterFinancePlan: true,
  };
}
