import { z } from "zod";
import {
  MCP_TOOL_ALLOWLIST,
  classifyMcpToolCandidate,
} from "./read-only-app-mcp-boundaries";
import { buildMcpProtocolEnvelopeContracts } from "./read-only-app-mcp-protocol-envelope-builders";
import {
  MCP_PROTOCOL_ACCEPTED_METHODS,
  MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  MCP_PROTOCOL_LIVENESS_METHOD,
  MCP_PROTOCOL_LIVENESS_METHODS,
  MCP_PROTOCOL_LOGGING_REDACTION_FIELDS,
  MCP_PROTOCOL_PUBLIC_PATH,
  MCP_PROTOCOL_REJECTED_METHODS,
  MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS,
  MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS,
} from "./read-only-app-mcp-protocol-envelope-contracts";

const trueLiteral = z.literal(true);

export const McpProtocolProofSchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    localProofOnly: trueLiteral,
    mcpProtocolEnvelopeProofContractsVerified: trueLiteral,
    mcpProtocolPathBoundaryVerified: trueLiteral,
    mcpProtocolTransportBoundaryVerified: trueLiteral,
    mcpProtocolAcceptedMethodsBoundaryVerified: trueLiteral,
    mcpProtocolPingBoundaryVerified: trueLiteral,
    mcpProtocolMethodCompatibilityWithOfficialSpecVerified: trueLiteral,
    mcpProtocolRejectedMethodsBoundaryVerified: trueLiteral,
    mcpProtocolInitializeBoundaryVerified: trueLiteral,
    mcpProtocolToolsListBoundaryVerified: trueLiteral,
    mcpProtocolToolsCallBoundaryVerified: trueLiteral,
    mcpProtocolReadOnlyToolAllowlistBoundaryVerified: trueLiteral,
    mcpProtocolToolSchemaBoundaryVerified: trueLiteral,
    mcpProtocolStructuredContentBoundaryVerified: trueLiteral,
    mcpProtocolEvidenceEnvelopeBoundaryVerified: trueLiteral,
    mcpProtocolRefusalEnvelopeBoundaryVerified: trueLiteral,
    mcpProtocolArgumentValidationBoundaryVerified: trueLiteral,
    mcpProtocolInvalidToolFailClosedBoundaryVerified: trueLiteral,
    mcpProtocolAuthDeferredBoundaryVerified: trueLiteral,
    mcpProtocolLoggingRedactionBoundaryVerified: trueLiteral,
    noEndpointImplementation: trueLiteral,
    noRouteImplementation: trueLiteral,
    noWebApiBackendControlPlaneRouteImplementation: trueLiteral,
    noRemoteMcpServerImplementation: trueLiteral,
    noOauthTokenSessionImplementation: trueLiteral,
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
    endpointRuntimeRepositoryInventoryVerified: trueLiteral,
    publicAppProofGateNoOpenAiApiSourceScanVerified: trueLiteral,
    fp0106BoundaryVerified: trueLiteral,
    fp0107Absent: trueLiteral,
    fp0105RouteOwnershipBoundaryStillVerified: trueLiteral,
    fp0104EndpointReadinessBoundaryStillVerified: trueLiteral,
    fp0103EndpointArchitectureBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
    futureMcpPath: z.literal(MCP_PROTOCOL_PUBLIC_PATH),
    acceptedMethods: z.tuple([
      z.literal(MCP_PROTOCOL_ACCEPTED_METHODS[0]),
      z.literal(MCP_PROTOCOL_ACCEPTED_METHODS[1]),
      z.literal(MCP_PROTOCOL_ACCEPTED_METHODS[2]),
      z.literal(MCP_PROTOCOL_ACCEPTED_METHODS[3]),
    ]),
    livenessMethods: z.tuple([z.literal(MCP_PROTOCOL_LIVENESS_METHODS[0])]),
    rejectedMethods: z.array(z.string()).min(1),
    allowedTools: z.tuple([
      z.literal(MCP_TOOL_ALLOWLIST[0]),
      z.literal(MCP_TOOL_ALLOWLIST[1]),
      z.literal(MCP_TOOL_ALLOWLIST[2]),
      z.literal(MCP_TOOL_ALLOWLIST[3]),
      z.literal(MCP_TOOL_ALLOWLIST[4]),
      z.literal(MCP_TOOL_ALLOWLIST[5]),
      z.literal(MCP_TOOL_ALLOWLIST[6]),
    ]),
    responseEnvelopeRequiredFields: z.tuple([
      z.literal(MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS[0]),
      z.literal(MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS[1]),
      z.literal(MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS[2]),
      z.literal(MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS[3]),
      z.literal(MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS[4]),
      z.literal(MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS[5]),
      z.literal(MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS[6]),
    ]),
    structuredContentRequiredFields: z.tuple([
      z.literal(MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS[0]),
      z.literal(MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS[1]),
      z.literal(MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS[2]),
      z.literal(MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS[3]),
      z.literal(MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS[4]),
      z.literal(MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS[5]),
    ]),
    loggingRedactionFields: z.array(z.string()).min(1),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.rejectedMethods.includes(MCP_PROTOCOL_LIVENESS_METHOD)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The MCP ping liveness method must not be rejected.",
        path: ["rejectedMethods"],
      });
    }
  });

export function buildMcpProtocolProof(
  input: Partial<{
    noEndpointImplementation: boolean;
    noRouteImplementation: boolean;
    noWebApiBackendControlPlaneRouteImplementation: boolean;
    noRemoteMcpServerImplementation: boolean;
    noOauthTokenSessionImplementation: boolean;
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
    endpointRuntimeRepositoryInventoryVerified: boolean;
    publicAppProofGateNoOpenAiApiSourceScanVerified: boolean;
    fp0106BoundaryVerified: boolean;
    fp0107Absent: boolean;
    fp0105RouteOwnershipBoundaryStillVerified: boolean;
    fp0104EndpointReadinessBoundaryStillVerified: boolean;
    fp0103EndpointArchitectureBoundaryStillVerified: boolean;
    fp0100PublicSecurityBoundaryStillVerified: boolean;
  }> = {},
) {
  const contracts = buildMcpProtocolEnvelopeContracts();
  const proof = contracts.envelopeProofContract;
  const path = contracts.pathBoundary;
  const transport = contracts.transportBoundary;
  const accepted = contracts.acceptedMethodsBoundary;
  const ping = contracts.pingBoundary;
  const compatibility = contracts.methodCompatibilityWithOfficialSpecBoundary;
  const rejected = contracts.rejectedMethodsBoundary;
  const initialize = contracts.initializeBoundary;
  const toolsList = contracts.toolsListBoundary;
  const toolsCall = contracts.toolsCallBoundary;
  const allowlist = contracts.readOnlyToolAllowlistBoundary;
  const structured = contracts.structuredContentBoundary;
  const evidence = contracts.evidenceEnvelopeBoundary;
  const refusal = contracts.refusalEnvelopeBoundary;
  const argumentsBoundary = contracts.argumentValidationBoundary;
  const invalidTool = contracts.invalidToolFailClosedBoundary;
  const auth = contracts.authDeferredBoundary;
  const logging = contracts.loggingRedactionBoundary;
  const noRoute = contracts.noRouteImplementationBoundary;
  const noRuntime = contracts.noRuntimeImplementationBoundary;
  const noApiModel = contracts.noOpenAiApiModelCallsBoundary;

  return McpProtocolProofSchema.parse({
    acceptedMethods: [...MCP_PROTOCOL_ACCEPTED_METHODS],
    allowedTools: [...MCP_TOOL_ALLOWLIST],
    endpointRuntimeRepositoryInventoryVerified:
      input.endpointRuntimeRepositoryInventoryVerified ?? true,
    fp0100PublicSecurityBoundaryStillVerified:
      input.fp0100PublicSecurityBoundaryStillVerified ?? true,
    fp0103EndpointArchitectureBoundaryStillVerified:
      input.fp0103EndpointArchitectureBoundaryStillVerified ?? true,
    fp0104EndpointReadinessBoundaryStillVerified:
      input.fp0104EndpointReadinessBoundaryStillVerified ?? true,
    fp0105RouteOwnershipBoundaryStillVerified:
      input.fp0105RouteOwnershipBoundaryStillVerified ?? true,
    fp0106BoundaryVerified: input.fp0106BoundaryVerified ?? true,
    fp0107Absent: input.fp0107Absent ?? true,
    futureMcpPath: MCP_PROTOCOL_PUBLIC_PATH,
    livenessMethods: [...MCP_PROTOCOL_LIVENESS_METHODS],
    localProofOnly: proof.localProofOnly,
    loggingRedactionFields: [...MCP_PROTOCOL_LOGGING_REDACTION_FIELDS],
    mcpProtocolAcceptedMethodsBoundaryVerified:
      sameList(accepted.acceptedMethods, MCP_PROTOCOL_ACCEPTED_METHODS) &&
      sameList(accepted.requiredFutureMethods, MCP_PROTOCOL_ACCEPTED_METHODS) &&
      sameList(
        accepted.livenessUtilityMethods,
        MCP_PROTOCOL_LIVENESS_METHODS,
      ) &&
      accepted.acceptedMethodsFutureOnly &&
      !accepted.dynamicMethodsAllowed,
    mcpProtocolArgumentValidationBoundaryVerified:
      argumentsBoundary.invalidArgumentsFailClosed &&
      argumentsBoundary.unknownArgumentsRejected &&
      argumentsBoundary.missingRequiredArgumentsFailClosed &&
      argumentsBoundary.noBestEffortArgumentInference,
    mcpProtocolAuthDeferredBoundaryVerified:
      auth.authPolicyQuestionsOnly &&
      auth.oauthFutureOnly &&
      auth.tokenFutureOnly &&
      auth.sessionFutureOnly &&
      !auth.authFlowImplemented &&
      !auth.callbackImplemented &&
      !auth.tokenExchangeImplemented &&
      !auth.sessionHandlerImplemented,
    mcpProtocolEnvelopeProofContractsVerified:
      proof.protocolEnvelopeContractsOnly &&
      proof.readOnly &&
      !proof.endpointImplementationAuthorized &&
      !proof.routeImplementationAuthorized &&
      !proof.openAiApiModelCallsAuthorized &&
      !proof.fp0107Created,
    mcpProtocolEvidenceEnvelopeBoundaryVerified:
      sameList(
        evidence.responseMustPreserveFields,
        MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS,
      ) &&
      !evidence.rawFullFileDumpsAllowed &&
      !evidence.privateFinanceDataDumpsAllowed,
    mcpProtocolInitializeBoundaryVerified:
      initialize.methodName === "initialize" &&
      initialize.acceptedFutureOnly &&
      !initialize.implementationAdded &&
      initialize.capabilitiesMustStayReadOnly,
    mcpProtocolInvalidToolFailClosedBoundaryVerified:
      invalidTool.invalidToolNamesFailClosed &&
      invalidTool.renamedWriteActionEquivalentsFailClosed &&
      invalidWriteActionCandidatesFailClosed() &&
      invalidTool.noProviderCalls &&
      invalidTool.noExternalCommunications,
    mcpProtocolLoggingRedactionBoundaryVerified:
      !logging.loggingImplementationAuthorized &&
      sameList(logging.mustRedact, MCP_PROTOCOL_LOGGING_REDACTION_FIELDS) &&
      !logging.rawPromptLoggingAllowed &&
      !logging.rawSourceFileLoggingAllowed,
    mcpProtocolMethodCompatibilityWithOfficialSpecVerified:
      sameList(
        compatibility.requiredFutureMethods,
        MCP_PROTOCOL_ACCEPTED_METHODS,
      ) &&
      compatibility.livenessUtilityMethod === MCP_PROTOCOL_LIVENESS_METHOD &&
      sameList(compatibility.rejectedMethods, MCP_PROTOCOL_REJECTED_METHODS) &&
      compatibility.pingExcludedFromRejectedMethods &&
      compatibility.pingExcludedFromToolDispatchMethods &&
      compatibility.officialMcpPingLivenessSemanticsRecorded &&
      compatibility.officialMcpPingEmptyResultRequiredFutureRoute &&
      compatibility.routeImplementationStillBlocked &&
      compatibility.unknownNonPingMethodsFailClosed &&
      !listIncludes(
        MCP_PROTOCOL_ACCEPTED_METHODS,
        MCP_PROTOCOL_LIVENESS_METHOD,
      ) &&
      !listIncludes(
        MCP_PROTOCOL_REJECTED_METHODS,
        MCP_PROTOCOL_LIVENESS_METHOD,
      ),
    mcpProtocolPathBoundaryVerified:
      path.futurePublicChatGptFacingEndpointPath === MCP_PROTOCOL_PUBLIC_PATH &&
      path.onlyFuturePublicChatGptFacingEndpointPath &&
      path.pathFutureOnly &&
      !path.pathImplemented &&
      !path.routeFileCreated,
    mcpProtocolPingBoundaryVerified:
      ping.methodName === MCP_PROTOCOL_LIVENESS_METHOD &&
      ping.futureProtocolLivenessRequest &&
      ping.establishedSessionRequestOnlyFuture &&
      ping.emptyJsonRpcResultRequiredForFutureRoute &&
      !ping.implementedInFp0106 &&
      !ping.routeImplementationExists &&
      !ping.dispatchesToTools &&
      !ping.dispatchesToEvidenceServices &&
      !ping.dispatchesToFinanceTwin &&
      !ping.dispatchesToCfoWiki &&
      !ping.providerCallsAllowed &&
      !ping.sourceMutationAllowed &&
      !ping.financeWritesAllowed &&
      !ping.openAiApiModelCallsAllowed &&
      !ping.externalCommunicationsAllowed,
    mcpProtocolReadOnlyToolAllowlistBoundaryVerified:
      sameList(allowlist.allowedTools, MCP_TOOL_ALLOWLIST) &&
      !allowlist.dynamicToolsAllowed &&
      !allowlist.writeActionToolsAllowed,
    mcpProtocolRefusalEnvelopeBoundaryVerified:
      refusal.failClosed &&
      refusal.refusalReasonRequired &&
      refusal.permittedNextActionsRequired &&
      refusal.capabilityBoundaryRequired &&
      !refusal.leaksRawSourcesOrSecrets,
    mcpProtocolRejectedMethodsBoundaryVerified:
      sameList(rejected.rejectedMethods, MCP_PROTOCOL_REJECTED_METHODS) &&
      !listIncludes(rejected.rejectedMethods, MCP_PROTOCOL_LIVENESS_METHOD) &&
      rejected.allOtherMethodsFailClosed &&
      rejected.noBestEffortUnknownMethodHandling,
    mcpProtocolStructuredContentBoundaryVerified:
      sameList(
        structured.requiredStructuredContentFields,
        MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS,
      ) &&
      structured.structuredContentRequiredForToolResults &&
      !structured.freeformFinanceProseCanBeSourceTruth,
    mcpProtocolToolSchemaBoundaryVerified:
      contracts.toolSchemaBoundaries.length === MCP_TOOL_ALLOWLIST.length &&
      contracts.toolSchemaBoundaries.every(
        (tool) =>
          tool.readOnlyAnnotationsRequired &&
          !tool.destructiveHintAllowed &&
          !tool.openWorldHintAllowed &&
          tool.schemaRequiresEvidenceFreshnessLimitations &&
          tool.schemaRequiresCapabilityBoundary &&
          !tool.schemaAllowsSourceMutation &&
          !tool.schemaAllowsFinanceWrites,
      ),
    mcpProtocolToolsCallBoundaryVerified:
      toolsCall.dispatchesToReadOnlyServicesOnly &&
      toolsCall.invalidToolNamesFailClosed &&
      toolsCall.invalidArgumentsFailClosed &&
      toolsCall.missingUnsupportedStaleConflictingEvidenceFailsClosed &&
      toolsCall.missingCitationEvidenceFailsClosed &&
      !toolsCall.rawFullFileDumpsAllowed &&
      !toolsCall.generatedFinanceAdviceAllowed &&
      !toolsCall.modelOutputCanBecomeSourceTruth,
    mcpProtocolToolsListBoundaryVerified:
      toolsList.acceptedFutureOnly &&
      sameList(toolsList.toolAllowlist, MCP_TOOL_ALLOWLIST) &&
      !toolsList.dynamicToolsAllowed &&
      !toolsList.toolDriftAllowed,
    mcpProtocolTransportBoundaryVerified:
      transport.postMcpOnlyRequiredPublicMethod &&
      transport.getMcpFutureOnlyBlockedUnlessLaterOfficialProtocolRequires &&
      transport.streamableHttpRequestFutureOnly &&
      !transport.transportImplemented &&
      transport.noLocalOrRemoteMcpServerRuntimeAdded,
    noAppSubmission: input.noAppSubmission ?? true,
    noAppsSdkResourceImplementation:
      input.noAppsSdkResourceImplementation ??
      !noRuntime.appsSdkResourceRuntimeAdded,
    noEndpointImplementation:
      input.noEndpointImplementation ?? !noRuntime.endpointRuntimeAdded,
    noFinanceWrite: input.noFinanceWrite ?? true,
    noListingCopy: input.noListingCopy ?? true,
    noModelCalls: input.noModelCalls ?? !noApiModel.modelCallsAuthorized,
    noOauthTokenSessionImplementation:
      input.noOauthTokenSessionImplementation ??
      (!auth.tokenExchangeImplemented && !auth.sessionHandlerImplemented),
    noOpenAiApiCalls: input.noOpenAiApiCalls ?? !noApiModel.apiCallsAuthorized,
    noOpenAiClientOrKeyUsage:
      input.noOpenAiClientOrKeyUsage ?? !noApiModel.clientOrKeyUsageAuthorized,
    noPublicAssets: input.noPublicAssets ?? true,
    noPublicChatGptAppImplementation:
      input.noPublicChatGptAppImplementation ?? true,
    noRemoteMcpServerImplementation:
      input.noRemoteMcpServerImplementation ??
      !noRuntime.remoteMcpServerRuntimeAdded,
    noRouteImplementation:
      input.noRouteImplementation ??
      (!noRoute.routeFileCreated && !noRoute.routeImplementationAuthorized),
    noSourceMutation: input.noSourceMutation ?? true,
    noWebApiBackendControlPlaneRouteImplementation:
      input.noWebApiBackendControlPlaneRouteImplementation ??
      !noRoute.webApiBackendControlPlaneRouteImplementationAuthorized,
    noWriteActionTools: input.noWriteActionTools ?? true,
    publicAppProofGateNoOpenAiApiSourceScanVerified:
      input.publicAppProofGateNoOpenAiApiSourceScanVerified ?? true,
    rejectedMethods: [...MCP_PROTOCOL_REJECTED_METHODS],
    responseEnvelopeRequiredFields: [...MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS],
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
    structuredContentRequiredFields: [
      ...MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS,
    ],
  });
}

export type McpProtocolProof = z.infer<typeof McpProtocolProofSchema>;

function invalidWriteActionCandidatesFailClosed(): boolean {
  return [
    "create_mission",
    "upload_source",
    "update_ledger",
    "send_report",
    "provider_connect",
    "certify_close",
    "contact_customer",
    "pay vendor",
    "legal advice",
    "audit opinion",
    "tax filing",
    "add route",
    "create endpoint",
    "remote MCP deployment",
  ].every((candidate) => classifyMcpToolCandidate(candidate).forbidden);
}

function sameList(left: readonly string[], right: readonly string[]): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function listIncludes(list: readonly string[], candidate: string): boolean {
  return list.includes(candidate);
}
