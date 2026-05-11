import {
  MCP_FORBIDDEN_TOOL_NAMES,
  MCP_TOOL_ALLOWLIST,
  type McpToolName,
} from "./read-only-app-mcp-boundaries";
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
  McpProtocolAcceptedMethodsBoundarySchema,
  McpProtocolArgumentValidationBoundarySchema,
  McpProtocolAuthDeferredBoundarySchema,
  McpProtocolEnvelopeProofContractSchema,
  McpProtocolEvidenceEnvelopeBoundarySchema,
  McpProtocolInitializeBoundarySchema,
  McpProtocolInvalidToolFailClosedBoundarySchema,
  McpProtocolLoggingRedactionBoundarySchema,
  McpProtocolMethodCompatibilityWithOfficialSpecBoundarySchema,
  McpProtocolNoOpenAiApiModelCallsBoundarySchema,
  McpProtocolNoRouteImplementationBoundarySchema,
  McpProtocolNoRuntimeImplementationBoundarySchema,
  McpProtocolPathBoundarySchema,
  McpProtocolPingBoundarySchema,
  McpProtocolReadOnlyToolAllowlistBoundarySchema,
  McpProtocolRefusalEnvelopeBoundarySchema,
  McpProtocolRejectedMethodsBoundarySchema,
  McpProtocolStructuredContentBoundarySchema,
  McpProtocolToolSchemaBoundarySchema,
  McpProtocolToolsCallBoundarySchema,
  McpProtocolToolsListBoundarySchema,
  McpProtocolTransportBoundarySchema,
  descriptorOutputFieldsForProtocol,
} from "./read-only-app-mcp-protocol-envelope-contracts";

export function buildMcpProtocolEnvelopeProofContract() {
  return McpProtocolEnvelopeProofContractSchema.parse({
    appSubmissionAuthorized: false,
    appsSdkResourceImplementationAuthorized: false,
    contractKind: "McpProtocolEnvelopeProofContract",
    endpointImplementationAuthorized: false,
    fp0107Created: false,
    localProofOnly: true,
    oauthTokenSessionImplementationAuthorized: false,
    openAiApiModelCallsAuthorized: false,
    priorBoundariesPreserved: true,
    protocolEnvelopeContractsOnly: true,
    publicChatGptAppImplementationAuthorized: false,
    readOnly: true,
    remoteMcpServerImplementationAuthorized: false,
    routeImplementationAuthorized: false,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  });
}

export function buildMcpProtocolPathBoundary() {
  return McpProtocolPathBoundarySchema.parse({
    contractKind: "McpProtocolPathBoundary",
    futurePublicChatGptFacingEndpointPath: MCP_PROTOCOL_PUBLIC_PATH,
    noRouteFileMayBeCreatedInFp0106: true,
    onlyFuturePublicChatGptFacingEndpointPath: true,
    pathFutureOnly: true,
    pathImplemented: false,
    routeFileCreated: false,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  });
}

export function buildMcpProtocolTransportBoundary() {
  return McpProtocolTransportBoundarySchema.parse({
    contractKind: "McpProtocolTransportBoundary",
    getMcpFutureOnlyBlockedUnlessLaterOfficialProtocolRequires: true,
    noLocalOrRemoteMcpServerRuntimeAdded: true,
    postMcpOnlyRequiredPublicMethod: true,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
    streamableHttpRequestFutureOnly: true,
    transportImplemented: false,
  });
}

export function buildMcpProtocolAcceptedMethodsBoundary() {
  return McpProtocolAcceptedMethodsBoundarySchema.parse({
    acceptedMethods: [...MCP_PROTOCOL_ACCEPTED_METHODS],
    acceptedMethodsFutureOnly: true,
    contractKind: "McpProtocolAcceptedMethodsBoundary",
    dynamicMethodsAllowed: false,
    healthMetadataMethodFutureOnly: true,
    livenessUtilityMethods: [...MCP_PROTOCOL_LIVENESS_METHODS],
    requiredFutureMethods: [...MCP_PROTOCOL_ACCEPTED_METHODS],
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  });
}

export function buildMcpProtocolPingBoundary() {
  return McpProtocolPingBoundarySchema.parse({
    contractKind: "McpProtocolPingBoundary",
    dispatchesToCfoWiki: false,
    dispatchesToEvidenceServices: false,
    dispatchesToFinanceTwin: false,
    dispatchesToTools: false,
    emptyJsonRpcResultRequiredForFutureRoute: true,
    establishedSessionRequestOnlyFuture: true,
    externalCommunicationsAllowed: false,
    financeWritesAllowed: false,
    futureProtocolLivenessRequest: true,
    implementedInFp0106: false,
    methodName: MCP_PROTOCOL_LIVENESS_METHOD,
    openAiApiModelCallsAllowed: false,
    providerCallsAllowed: false,
    routeImplementationExists: false,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
    sourceMutationAllowed: false,
  });
}

export function buildMcpProtocolMethodCompatibilityWithOfficialSpecBoundary() {
  return McpProtocolMethodCompatibilityWithOfficialSpecBoundarySchema.parse({
    contractKind: "McpProtocolMethodCompatibilityWithOfficialSpecBoundary",
    livenessUtilityMethod: MCP_PROTOCOL_LIVENESS_METHOD,
    officialMcpPingEmptyResultRequiredFutureRoute: true,
    officialMcpPingLivenessSemanticsRecorded: true,
    pingExcludedFromRejectedMethods: true,
    pingExcludedFromToolDispatchMethods: true,
    rejectedMethods: [...MCP_PROTOCOL_REJECTED_METHODS],
    requiredFutureMethods: [...MCP_PROTOCOL_ACCEPTED_METHODS],
    routeImplementationStillBlocked: true,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
    unknownNonPingMethodsFailClosed: true,
  });
}

export function buildMcpProtocolRejectedMethodsBoundary() {
  return McpProtocolRejectedMethodsBoundarySchema.parse({
    allOtherMethodsFailClosed: true,
    contractKind: "McpProtocolRejectedMethodsBoundary",
    noBestEffortUnknownMethodHandling: true,
    rejectedMethods: [...MCP_PROTOCOL_REJECTED_METHODS],
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  });
}

export function buildMcpProtocolInitializeBoundary() {
  return McpProtocolInitializeBoundarySchema.parse({
    acceptedFutureOnly: true,
    capabilitiesMustStayReadOnly: true,
    contractKind: "McpProtocolInitializeBoundary",
    implementationAdded: false,
    methodName: "initialize",
    noDynamicToolsFromInitialize: true,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  });
}

export function buildMcpProtocolToolsListBoundary() {
  return McpProtocolToolsListBoundarySchema.parse({
    acceptedFutureOnly: true,
    contractKind: "McpProtocolToolsListBoundary",
    dynamicToolsAllowed: false,
    methodName: "tools/list",
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
    toolAllowlist: [...MCP_TOOL_ALLOWLIST],
    toolDriftAllowed: false,
  });
}

export function buildMcpProtocolToolsCallBoundary() {
  return McpProtocolToolsCallBoundarySchema.parse({
    acceptedFutureOnly: true,
    contractKind: "McpProtocolToolsCallBoundary",
    dispatchesToReadOnlyServicesOnly: true,
    generatedFinanceAdviceAllowed: false,
    invalidArgumentsFailClosed: true,
    invalidToolNamesFailClosed: true,
    methodName: "tools/call",
    missingCitationEvidenceFailsClosed: true,
    missingUnsupportedStaleConflictingEvidenceFailsClosed: true,
    modelOutputCanBecomeSourceTruth: false,
    rawFullFileDumpsAllowed: false,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  });
}

export function buildMcpProtocolReadOnlyToolAllowlistBoundary() {
  return McpProtocolReadOnlyToolAllowlistBoundarySchema.parse({
    allowedTools: [...MCP_TOOL_ALLOWLIST],
    contractKind: "McpProtocolReadOnlyToolAllowlistBoundary",
    dynamicToolsAllowed: false,
    exactV2gReadOnlyAllowlistRequired: true,
    forbiddenTools: [...MCP_FORBIDDEN_TOOL_NAMES],
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
    writeActionToolsAllowed: false,
  });
}

export function buildMcpProtocolToolSchemaBoundary(toolName: McpToolName) {
  return McpProtocolToolSchemaBoundarySchema.parse({
    contractKind: "McpProtocolToolSchemaBoundary",
    destructiveHintAllowed: false,
    openWorldHintAllowed: false,
    readOnlyAnnotationsRequired: true,
    schemaAllowsFinanceWrites: false,
    schemaAllowsSourceMutation: false,
    schemaRequiresCapabilityBoundary: true,
    schemaRequiresEvidenceFreshnessLimitations: true,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
    toolName,
  });
}

export function buildMcpProtocolStructuredContentBoundary() {
  return McpProtocolStructuredContentBoundarySchema.parse({
    contractKind: "McpProtocolStructuredContentBoundary",
    freeformFinanceProseCanBeSourceTruth: false,
    requiredStructuredContentFields: [
      ...MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS,
    ],
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
    structuredContentRequiredForToolResults: true,
  });
}

export function buildMcpProtocolEvidenceEnvelopeBoundary() {
  return McpProtocolEvidenceEnvelopeBoundarySchema.parse({
    contractKind: "McpProtocolEvidenceEnvelopeBoundary",
    descriptorOutputFields: [...descriptorOutputFieldsForProtocol()],
    privateFinanceDataDumpsAllowed: false,
    rawFullFileDumpsAllowed: false,
    responseMustPreserveFields: [...MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS],
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  });
}

export function buildMcpProtocolRefusalEnvelopeBoundary() {
  return McpProtocolRefusalEnvelopeBoundarySchema.parse({
    capabilityBoundaryRequired: true,
    contractKind: "McpProtocolRefusalEnvelopeBoundary",
    failClosed: true,
    leaksRawSourcesOrSecrets: false,
    permittedNextActionsRequired: true,
    refusalReasonRequired: true,
    responseMustPreserveFields: [...MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS],
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  });
}

export function buildMcpProtocolArgumentValidationBoundary() {
  return McpProtocolArgumentValidationBoundarySchema.parse({
    contractKind: "McpProtocolArgumentValidationBoundary",
    invalidArgumentsFailClosed: true,
    missingRequiredArgumentsFailClosed: true,
    noBestEffortArgumentInference: true,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
    unknownArgumentsRejected: true,
  });
}

export function buildMcpProtocolInvalidToolFailClosedBoundary() {
  return McpProtocolInvalidToolFailClosedBoundarySchema.parse({
    contractKind: "McpProtocolInvalidToolFailClosedBoundary",
    invalidToolNamesFailClosed: true,
    noExternalCommunications: true,
    noLegalAuditTaxAdvice: true,
    noProviderCalls: true,
    renamedWriteActionEquivalentsFailClosed: true,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  });
}

export function buildMcpProtocolAuthDeferredBoundary() {
  return McpProtocolAuthDeferredBoundarySchema.parse({
    authFlowImplemented: false,
    authPolicyQuestionsOnly: true,
    callbackImplemented: false,
    contractKind: "McpProtocolAuthDeferredBoundary",
    cookieHandlingImplemented: false,
    middlewareImplemented: false,
    oauthFutureOnly: true,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
    secretHandlingImplemented: false,
    sessionFutureOnly: true,
    sessionHandlerImplemented: false,
    tokenExchangeImplemented: false,
    tokenFutureOnly: true,
  });
}

export function buildMcpProtocolLoggingRedactionBoundary() {
  return McpProtocolLoggingRedactionBoundarySchema.parse({
    contractKind: "McpProtocolLoggingRedactionBoundary",
    loggingImplementationAuthorized: false,
    mustRedact: [...MCP_PROTOCOL_LOGGING_REDACTION_FIELDS],
    rawPromptLoggingAllowed: false,
    rawSourceFileLoggingAllowed: false,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
    telemetryImplementationAuthorized: false,
  });
}

export function buildMcpProtocolNoRouteImplementationBoundary() {
  return McpProtocolNoRouteImplementationBoundarySchema.parse({
    contractKind: "McpProtocolNoRouteImplementationBoundary",
    routeFileCreated: false,
    routeImplementationAuthorized: false,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
    webApiBackendControlPlaneRouteImplementationAuthorized: false,
  });
}

export function buildMcpProtocolNoRuntimeImplementationBoundary() {
  return McpProtocolNoRuntimeImplementationBoundarySchema.parse({
    appsSdkResourceRuntimeAdded: false,
    contractKind: "McpProtocolNoRuntimeImplementationBoundary",
    endpointRuntimeAdded: false,
    localMcpServerRuntimeAdded: false,
    remoteMcpServerRuntimeAdded: false,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  });
}

export function buildMcpProtocolNoOpenAiApiModelCallsBoundary() {
  return McpProtocolNoOpenAiApiModelCallsBoundarySchema.parse({
    apiCallsAuthorized: false,
    clientOrKeyUsageAuthorized: false,
    contractKind: "McpProtocolNoOpenAiApiModelCallsBoundary",
    hostedToolsAuthorized: false,
    modelCallsAuthorized: false,
    schemaVersion: MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  });
}

export function buildMcpProtocolEnvelopeContracts() {
  return {
    acceptedMethodsBoundary: buildMcpProtocolAcceptedMethodsBoundary(),
    argumentValidationBoundary: buildMcpProtocolArgumentValidationBoundary(),
    authDeferredBoundary: buildMcpProtocolAuthDeferredBoundary(),
    envelopeProofContract: buildMcpProtocolEnvelopeProofContract(),
    evidenceEnvelopeBoundary: buildMcpProtocolEvidenceEnvelopeBoundary(),
    initializeBoundary: buildMcpProtocolInitializeBoundary(),
    invalidToolFailClosedBoundary:
      buildMcpProtocolInvalidToolFailClosedBoundary(),
    loggingRedactionBoundary: buildMcpProtocolLoggingRedactionBoundary(),
    methodCompatibilityWithOfficialSpecBoundary:
      buildMcpProtocolMethodCompatibilityWithOfficialSpecBoundary(),
    noOpenAiApiModelCallsBoundary:
      buildMcpProtocolNoOpenAiApiModelCallsBoundary(),
    noRouteImplementationBoundary:
      buildMcpProtocolNoRouteImplementationBoundary(),
    noRuntimeImplementationBoundary:
      buildMcpProtocolNoRuntimeImplementationBoundary(),
    pathBoundary: buildMcpProtocolPathBoundary(),
    pingBoundary: buildMcpProtocolPingBoundary(),
    readOnlyToolAllowlistBoundary:
      buildMcpProtocolReadOnlyToolAllowlistBoundary(),
    refusalEnvelopeBoundary: buildMcpProtocolRefusalEnvelopeBoundary(),
    rejectedMethodsBoundary: buildMcpProtocolRejectedMethodsBoundary(),
    structuredContentBoundary: buildMcpProtocolStructuredContentBoundary(),
    toolSchemaBoundaries: MCP_TOOL_ALLOWLIST.map((toolName) =>
      buildMcpProtocolToolSchemaBoundary(toolName),
    ),
    toolsCallBoundary: buildMcpProtocolToolsCallBoundary(),
    toolsListBoundary: buildMcpProtocolToolsListBoundary(),
    transportBoundary: buildMcpProtocolTransportBoundary(),
  };
}
