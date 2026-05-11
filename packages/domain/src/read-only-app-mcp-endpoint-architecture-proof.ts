import { z } from "zod";
import { MCP_TOOL_ALLOWLIST } from "./read-only-app-mcp-boundaries";
import { buildEndpointArchitectureContracts } from "./read-only-app-mcp-endpoint-architecture-builders";
import {
  ENDPOINT_ARCHITECTURE_SCHEMA_VERSION,
  ENDPOINT_FAIL_CLOSED_REQUESTS,
  ENDPOINT_FUTURE_INVENTORY_FIELDS,
  ENDPOINT_RESPONSE_ENVELOPE_FIELDS,
} from "./read-only-app-mcp-endpoint-architecture-contracts";

const trueLiteral = z.literal(true);

export const EndpointArchitectureProofSchema = z
  .object({
    schemaVersion: z.literal(ENDPOINT_ARCHITECTURE_SCHEMA_VERSION),
    localProofOnly: trueLiteral,
    endpointArchitectureProofContractsVerified: trueLiteral,
    endpointInventoryDeferredBoundaryVerified: trueLiteral,
    endpointPathInventoryPreconditionsVerified: trueLiteral,
    endpointTrustModelBoundaryVerified: trueLiteral,
    endpointTransportChoiceBoundaryVerified: trueLiteral,
    endpointTlsHttpsFutureRequirementBoundaryVerified: trueLiteral,
    endpointRequestResponseEnvelopeBoundaryVerified: trueLiteral,
    endpointEvidenceFreshnessLimitationsBoundaryVerified: trueLiteral,
    endpointRefusalFailureModeBoundaryVerified: trueLiteral,
    endpointReadOnlyToolAllowlistBoundaryVerified: trueLiteral,
    noEndpointImplementation: trueLiteral,
    noRouteImplementation: trueLiteral,
    noAppRoutesAdded: trueLiteral,
    noWebApiRoutesAdded: trueLiteral,
    noBackendControlPlaneRoutesAdded: trueLiteral,
    noMcpServerRuntime: trueLiteral,
    noOauthTokenSessionImplementation: trueLiteral,
    noRemoteMcpImplementationOrDeployment: trueLiteral,
    noAppsSdkResourceImplementation: trueLiteral,
    noPublicChatGptAppImplementation: trueLiteral,
    noAppSubmission: trueLiteral,
    noPublicAssets: trueLiteral,
    noListingCopy: trueLiteral,
    noOpenAiApiCalls: trueLiteral,
    noModelCalls: trueLiteral,
    noOpenAiClientOrKeyUsage: trueLiteral,
    noSourceMutation: trueLiteral,
    noFinanceWrite: trueLiteral,
    noWriteActionTools: trueLiteral,
    noExternalCommunications: trueLiteral,
    noGeneratedFinanceAdvice: trueLiteral,
    noProviderCertificationDeliveryDeployment: trueLiteral,
    noPublicAssetsSubmissionArtifacts: trueLiteral,
    noRuntimeCodexFinanceOutput: trueLiteral,
    noAutonomousAction: trueLiteral,
    readOnlyToolAllowlistExactVerified: trueLiteral,
    requiredFutureInventoryFieldsVerified: trueLiteral,
    responseEnvelopeRequiredFieldsVerified: trueLiteral,
    refusalFailureModesVerified: trueLiteral,
    fp0102ArchitectureBoundaryStillVerified: trueLiteral,
    fp0101ImplementationSequencingBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
    fp0099PublicSecurityThreatModelBoundaryStillVerified: trueLiteral,
    fp0098PublicAppReadinessBoundaryStillVerified: trueLiteral,
    fp0087DescriptorEnvelopeBoundaryStillVerified: trueLiteral,
    publicAppImplementationSubmissionFutureOnly: trueLiteral,
    endpointArchitectureProofPlanAccepted: trueLiteral,
    exactlyOneFp0103PlanVerified: trueLiteral,
    fp0104Absent: trueLiteral,
    allowedTools: z.tuple([
      z.literal(MCP_TOOL_ALLOWLIST[0]),
      z.literal(MCP_TOOL_ALLOWLIST[1]),
      z.literal(MCP_TOOL_ALLOWLIST[2]),
      z.literal(MCP_TOOL_ALLOWLIST[3]),
      z.literal(MCP_TOOL_ALLOWLIST[4]),
      z.literal(MCP_TOOL_ALLOWLIST[5]),
      z.literal(MCP_TOOL_ALLOWLIST[6]),
    ]),
    requiredFutureInventoryFields: z.tuple([
      z.literal(ENDPOINT_FUTURE_INVENTORY_FIELDS[0]),
      z.literal(ENDPOINT_FUTURE_INVENTORY_FIELDS[1]),
      z.literal(ENDPOINT_FUTURE_INVENTORY_FIELDS[2]),
      z.literal(ENDPOINT_FUTURE_INVENTORY_FIELDS[3]),
      z.literal(ENDPOINT_FUTURE_INVENTORY_FIELDS[4]),
      z.literal(ENDPOINT_FUTURE_INVENTORY_FIELDS[5]),
      z.literal(ENDPOINT_FUTURE_INVENTORY_FIELDS[6]),
      z.literal(ENDPOINT_FUTURE_INVENTORY_FIELDS[7]),
      z.literal(ENDPOINT_FUTURE_INVENTORY_FIELDS[8]),
    ]),
    responseEnvelopeRequiredFields: z.tuple([
      z.literal(ENDPOINT_RESPONSE_ENVELOPE_FIELDS[0]),
      z.literal(ENDPOINT_RESPONSE_ENVELOPE_FIELDS[1]),
      z.literal(ENDPOINT_RESPONSE_ENVELOPE_FIELDS[2]),
      z.literal(ENDPOINT_RESPONSE_ENVELOPE_FIELDS[3]),
      z.literal(ENDPOINT_RESPONSE_ENVELOPE_FIELDS[4]),
      z.literal(ENDPOINT_RESPONSE_ENVELOPE_FIELDS[5]),
    ]),
    failClosedRequests: z.tuple([
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[0]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[1]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[2]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[3]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[4]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[5]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[6]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[7]),
    ]),
  })
  .strict();

export function buildEndpointArchitectureProof(
  input: Partial<{
    noEndpointImplementation: boolean;
    noRouteImplementation: boolean;
    noAppRoutesAdded: boolean;
    noWebApiRoutesAdded: boolean;
    noBackendControlPlaneRoutesAdded: boolean;
    noMcpServerRuntime: boolean;
    noOauthTokenSessionImplementation: boolean;
    noRemoteMcpImplementationOrDeployment: boolean;
    noAppsSdkResourceImplementation: boolean;
    noPublicChatGptAppImplementation: boolean;
    noAppSubmission: boolean;
    noPublicAssets: boolean;
    noListingCopy: boolean;
    noOpenAiApiCalls: boolean;
    noModelCalls: boolean;
    noOpenAiClientOrKeyUsage: boolean;
    noSourceMutation: boolean;
    noFinanceWrite: boolean;
    noWriteActionTools: boolean;
    noExternalCommunications: boolean;
    noGeneratedFinanceAdvice: boolean;
    noProviderCertificationDeliveryDeployment: boolean;
    noPublicAssetsSubmissionArtifacts: boolean;
    noRuntimeCodexFinanceOutput: boolean;
    noAutonomousAction: boolean;
    fp0102ArchitectureBoundaryStillVerified: boolean;
    fp0101ImplementationSequencingBoundaryStillVerified: boolean;
    fp0100PublicSecurityBoundaryStillVerified: boolean;
    fp0099PublicSecurityThreatModelBoundaryStillVerified: boolean;
    fp0098PublicAppReadinessBoundaryStillVerified: boolean;
    fp0087DescriptorEnvelopeBoundaryStillVerified: boolean;
    publicAppImplementationSubmissionFutureOnly: boolean;
    endpointArchitectureProofPlanAccepted: boolean;
    exactlyOneFp0103PlanVerified: boolean;
    fp0104Absent: boolean;
  }> = {},
) {
  const contracts = buildEndpointArchitectureContracts();
  const proofContract = contracts.architectureProofContract;
  const inventory = contracts.inventoryDeferredBoundary;
  const pathPreconditions = contracts.pathInventoryPreconditions;
  const trustModel = contracts.trustModelBoundary;
  const transport = contracts.transportChoiceBoundary;
  const tls = contracts.tlsHttpsFutureRequirementBoundary;
  const envelope = contracts.requestResponseEnvelopeBoundary;
  const evidence = contracts.evidenceFreshnessLimitationsBoundary;
  const refusal = contracts.refusalFailureModeBoundary;
  const allowlist = contracts.readOnlyToolAllowlistBoundary;

  return EndpointArchitectureProofSchema.parse({
    allowedTools: [...MCP_TOOL_ALLOWLIST],
    endpointArchitectureProofContractsVerified:
      proofContract.endpointArchitectureProofContractsOnly &&
      !proofContract.endpointImplementationAuthorized &&
      !proofContract.routeImplementationAuthorized &&
      !proofContract.openAiApiModelCallsAuthorized,
    endpointArchitectureProofPlanAccepted:
      input.endpointArchitectureProofPlanAccepted ?? true,
    endpointEvidenceFreshnessLimitationsBoundaryVerified:
      evidence.evidenceRequired &&
      evidence.sourceAnchorsRequired &&
      evidence.freshnessRequired &&
      evidence.limitationsRequired &&
      evidence.permittedNextActionsRequired &&
      evidence.missingEvidenceFailsClosed,
    endpointInventoryDeferredBoundaryVerified:
      inventory.endpointInventoryFutureOnly &&
      !inventory.endpointInventoryImplemented &&
      inventory.requiresLaterFinancePlan,
    endpointPathInventoryPreconditionsVerified:
      pathPreconditions.noEndpointPathImplemented &&
      pathPreconditions.noHealthPathImplemented &&
      pathPreconditions.futureEndpointInventoryMustNameAllFields,
    endpointReadOnlyToolAllowlistBoundaryVerified:
      JSON.stringify(allowlist.allowedTools) ===
        JSON.stringify(MCP_TOOL_ALLOWLIST) &&
      !allowlist.dynamicToolsAllowed &&
      !allowlist.writeModifyActionToolsAllowed &&
      allowlist.existingV2gDescriptorAllowlistRemainsReadOnly,
    endpointRefusalFailureModeBoundaryVerified:
      refusal.failClosed &&
      !refusal.generatedFinanceAdviceAllowed &&
      sameList(refusal.requiredFailClosedRequests, ENDPOINT_FAIL_CLOSED_REQUESTS),
    endpointRequestResponseEnvelopeBoundaryVerified:
      envelope.envelopeFutureOnly &&
      !envelope.rawFullFileDumpsAllowed &&
      sameList(envelope.responseMustPreserveFields, ENDPOINT_RESPONSE_ENVELOPE_FIELDS),
    endpointTlsHttpsFutureRequirementBoundaryVerified:
      tls.tlsHttpsFutureRequirement &&
      !tls.tlsConfiguredNow &&
      tls.stableHttpsHostFutureOnly &&
      tls.deploymentFutureOnly,
    endpointTransportChoiceBoundaryVerified:
      transport.transportChoiceIsArchitectureInputOnly &&
      !transport.transportImplemented &&
      transport.laterJustificationAgainstOfficialDocsRequired,
    endpointTrustModelBoundaryVerified:
      trustModel.trustModelFutureOnly &&
      trustModel.rawSourcesRemainDocumentTruth &&
      trustModel.financeTwinRemainsStructuredTruth &&
      trustModel.evidenceIndexRemainsReadOnlyAnchorLayer,
    exactlyOneFp0103PlanVerified: input.exactlyOneFp0103PlanVerified ?? true,
    failClosedRequests: [...ENDPOINT_FAIL_CLOSED_REQUESTS],
    fp0087DescriptorEnvelopeBoundaryStillVerified:
      input.fp0087DescriptorEnvelopeBoundaryStillVerified ?? true,
    fp0098PublicAppReadinessBoundaryStillVerified:
      input.fp0098PublicAppReadinessBoundaryStillVerified ?? true,
    fp0099PublicSecurityThreatModelBoundaryStillVerified:
      input.fp0099PublicSecurityThreatModelBoundaryStillVerified ?? true,
    fp0100PublicSecurityBoundaryStillVerified:
      input.fp0100PublicSecurityBoundaryStillVerified ?? true,
    fp0101ImplementationSequencingBoundaryStillVerified:
      input.fp0101ImplementationSequencingBoundaryStillVerified ?? true,
    fp0102ArchitectureBoundaryStillVerified:
      input.fp0102ArchitectureBoundaryStillVerified ?? true,
    fp0104Absent: input.fp0104Absent ?? true,
    localProofOnly: proofContract.localProofOnly,
    noAppSubmission: input.noAppSubmission ?? true,
    noAppRoutesAdded: input.noAppRoutesAdded ?? true,
    noAppsSdkResourceImplementation:
      input.noAppsSdkResourceImplementation ?? true,
    noAutonomousAction: input.noAutonomousAction ?? true,
    noBackendControlPlaneRoutesAdded:
      input.noBackendControlPlaneRoutesAdded ?? true,
    noEndpointImplementation: input.noEndpointImplementation ?? true,
    noExternalCommunications: input.noExternalCommunications ?? true,
    noFinanceWrite: input.noFinanceWrite ?? true,
    noGeneratedFinanceAdvice: input.noGeneratedFinanceAdvice ?? true,
    noListingCopy: input.noListingCopy ?? true,
    noMcpServerRuntime: input.noMcpServerRuntime ?? true,
    noModelCalls: input.noModelCalls ?? true,
    noOauthTokenSessionImplementation:
      input.noOauthTokenSessionImplementation ?? true,
    noOpenAiApiCalls: input.noOpenAiApiCalls ?? true,
    noOpenAiClientOrKeyUsage: input.noOpenAiClientOrKeyUsage ?? true,
    noProviderCertificationDeliveryDeployment:
      input.noProviderCertificationDeliveryDeployment ?? true,
    noPublicAssets: input.noPublicAssets ?? true,
    noPublicAssetsSubmissionArtifacts:
      input.noPublicAssetsSubmissionArtifacts ?? true,
    noPublicChatGptAppImplementation:
      input.noPublicChatGptAppImplementation ?? true,
    noRemoteMcpImplementationOrDeployment:
      input.noRemoteMcpImplementationOrDeployment ?? true,
    noRouteImplementation: input.noRouteImplementation ?? true,
    noRuntimeCodexFinanceOutput: input.noRuntimeCodexFinanceOutput ?? true,
    noSourceMutation: input.noSourceMutation ?? true,
    noWebApiRoutesAdded: input.noWebApiRoutesAdded ?? true,
    noWriteActionTools: input.noWriteActionTools ?? true,
    publicAppImplementationSubmissionFutureOnly:
      input.publicAppImplementationSubmissionFutureOnly ?? true,
    readOnlyToolAllowlistExactVerified:
      sameList(allowlist.allowedTools, MCP_TOOL_ALLOWLIST),
    refusalFailureModesVerified:
      sameList(refusal.requiredFailClosedRequests, ENDPOINT_FAIL_CLOSED_REQUESTS),
    requiredFutureInventoryFields: [...ENDPOINT_FUTURE_INVENTORY_FIELDS],
    requiredFutureInventoryFieldsVerified: sameList(
      inventory.requiredFutureInventoryFields,
      ENDPOINT_FUTURE_INVENTORY_FIELDS,
    ),
    responseEnvelopeRequiredFields: [...ENDPOINT_RESPONSE_ENVELOPE_FIELDS],
    responseEnvelopeRequiredFieldsVerified: sameList(
      envelope.responseMustPreserveFields,
      ENDPOINT_RESPONSE_ENVELOPE_FIELDS,
    ),
    schemaVersion: ENDPOINT_ARCHITECTURE_SCHEMA_VERSION,
  });
}

function sameList(
  left: readonly string[],
  right: readonly string[],
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export type EndpointArchitectureProof = z.infer<
  typeof EndpointArchitectureProofSchema
>;
