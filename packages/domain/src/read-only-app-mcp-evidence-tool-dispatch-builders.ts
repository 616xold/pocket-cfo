import {
  MCP_FORBIDDEN_TOOL_NAMES,
  MCP_TOOL_ALLOWLIST,
  type McpToolName,
} from "./read-only-app-mcp-boundaries";
import {
  EVIDENCE_TOOL_DISPATCH_REFUSAL_REASONS,
  EVIDENCE_TOOL_DISPATCH_RESPONSE_REQUIRED_FIELDS,
  EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
  EvidenceToolArgumentSchemaBoundarySchema,
  EvidenceToolDispatchAllowlistBoundarySchema,
  EvidenceToolDispatchProofContractSchema,
  EvidenceToolFreshnessBoundarySchema,
  EvidenceToolNoFinanceWriteBoundarySchema,
  EvidenceToolNoMutationBoundarySchema,
  EvidenceToolNoOpenAiModelBoundarySchema,
  EvidenceToolNoProviderExternalCallBoundarySchema,
  EvidenceToolNoRawDumpBoundarySchema,
  EvidenceToolRefusalEnvelopeBoundarySchema,
  EvidenceToolResponseEnvelopeBoundarySchema,
  EvidenceToolServiceDependencyBoundarySchema,
  EvidenceToolSourceAnchorBoundarySchema,
  FetchCapabilityBoundariesDispatchContractSchema,
  FetchCompanyPostureDispatchContractSchema,
  FetchDocumentMapDispatchContractSchema,
  FetchEvidenceCardDispatchContractSchema,
  FetchSourceAnchorDispatchContractSchema,
  FetchSourceCoverageDispatchContractSchema,
  SearchEvidenceDispatchContractSchema,
  argumentFields,
  optionalArguments,
  requiredArguments,
  serviceForTool,
  serviceLanesForTool,
} from "./read-only-app-mcp-evidence-tool-dispatch-contracts";

export function buildEvidenceToolDispatchProofContract() {
  return EvidenceToolDispatchProofContractSchema.parse({
    contractKind: "EvidenceToolDispatchProofContract",
    contractOnly: true,
    fp0109Created: false,
    localProofOnly: true,
    noDispatchRuntimeImplemented: true,
    publicAppSubmissionAssetsListingScopeOpened: false,
    readOnly: true,
    routeAdapterToolsCallStillFailClosed: true,
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
  });
}

export function buildEvidenceToolDispatchAllowlistBoundary() {
  return EvidenceToolDispatchAllowlistBoundarySchema.parse({
    contractKind: "EvidenceToolDispatchAllowlistBoundary",
    dynamicToolsAllowed: false,
    exactV2gToolAllowlist: [...MCP_TOOL_ALLOWLIST],
    forbiddenTools: [...MCP_FORBIDDEN_TOOL_NAMES],
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
    writeActionToolsAllowed: false,
  });
}

export function buildEvidenceToolArgumentSchemaBoundary(toolName: McpToolName) {
  return EvidenceToolArgumentSchemaBoundarySchema.parse({
    acceptsFinanceWrites: false,
    acceptsOauthTokenSession: false,
    acceptsOnlyDeclaredArguments: true,
    acceptsProviderCredentials: false,
    acceptsSourceMutation: false,
    acceptsUploads: false,
    additionalPropertiesAllowed: false,
    contractKind: "EvidenceToolArgumentSchemaBoundary",
    exactArgumentFields: argumentFields(toolName),
    invalidArgumentTypesFailClosed: true,
    missingRequiredArgumentsFailClosed: true,
    noBestEffortArgumentInference: true,
    optionalArguments: optionalArguments(toolName),
    requiredArguments: requiredArguments(toolName),
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
    toolName,
    unknownArgumentsFailClosed: true,
  });
}

export function buildEvidenceToolServiceDependencyBoundary(
  toolName: McpToolName,
) {
  return EvidenceToolServiceDependencyBoundarySchema.parse({
    addsDatabaseQueries: false,
    addsSchemasOrMigrations: false,
    callsOpenAiApiOrModels: false,
    callsProviders: false,
    contractKind: "EvidenceToolServiceDependencyBoundary",
    createsNewControlPlaneService: false,
    financeWriteAllowed: false,
    futureDispatchOnly: true,
    futureServiceDependency: serviceForTool(toolName),
    futureServiceLanes: serviceLanesForTool(toolName),
    readOnly: true,
    resolvesThroughExistingEvidenceSourceAuthorityLanesOnly: true,
    runtimeImplementedInFp0108: false,
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
    sourceMutationAllowed: false,
    toolName,
  });
}

export function buildEvidenceToolResponseEnvelopeBoundary() {
  return EvidenceToolResponseEnvelopeBoundarySchema.parse({
    capabilityBoundaryRequired: true,
    contractKind: "EvidenceToolResponseEnvelopeBoundary",
    evidenceRequiredForSuccess: true,
    freshnessRequiredForSuccess: true,
    generatedFinanceAdviceAllowed: false,
    limitationsRequiredForSuccess: true,
    mcpTextContentMirrorRequired: true,
    modelOutputCanBecomeSourceTruth: false,
    permittedNextActionsRequired: true,
    rawFullFileDumpsAllowed: false,
    refusalReasonPresentAndNullable: true,
    requiredFields: [...EVIDENCE_TOOL_DISPATCH_RESPONSE_REQUIRED_FIELDS],
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
    sourceAnchorsRequiredForSuccess: true,
    structuredContentRequired: true,
  });
}

export function buildEvidenceToolRefusalEnvelopeBoundary() {
  return EvidenceToolRefusalEnvelopeBoundarySchema.parse({
    capabilityBoundaryRequired: true,
    contractKind: "EvidenceToolRefusalEnvelopeBoundary",
    evidenceEmptyWhenMissingOrUnsupported: true,
    failClosed: true,
    leaksRawSourcesOrSecrets: false,
    permittedNextActionsRequired: true,
    refusalReasonRequired: true,
    refusalReasons: [...EVIDENCE_TOOL_DISPATCH_REFUSAL_REASONS],
    requiredFields: [...EVIDENCE_TOOL_DISPATCH_RESPONSE_REQUIRED_FIELDS],
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
    sourceAnchorsEmptyWhenMissingCitation: true,
    structuredContentRequiredForErrors: true,
  });
}

export function buildEvidenceToolFreshnessBoundary() {
  return EvidenceToolFreshnessBoundarySchema.parse({
    conflictingEvidenceFailsClosed: true,
    contractKind: "EvidenceToolFreshnessBoundary",
    freshness: freshness(),
    freshnessPostureSchemaRequired: true,
    limitations: [limitation("not_source_truth")],
    missingCitationFailsClosed: true,
    missingEvidenceFailsClosed: true,
    promptInjectionContentRemainsUntrusted: true,
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
    staleEvidenceFailsClosed: true,
    unsupportedEvidenceFailsClosed: true,
  });
}

export function buildEvidenceToolSourceAnchorBoundary() {
  return EvidenceToolSourceAnchorBoundarySchema.parse({
    boundedExcerptsOnly: true,
    contractKind: "EvidenceToolSourceAnchorBoundary",
    evidenceRequiredForSuccess: true,
    modelOutputCannotBecomeSourceTruth: true,
    noRawFullFileDump: true,
    rawSourcesImmutable: true,
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
    sourceAnchorCitationRequired: true,
    sourceAnchorsRequiredForSuccess: true,
    sourceSnapshotsAndChecksumsRemainAuthority: true,
  });
}

export function buildEvidenceToolNoRawDumpBoundary() {
  return EvidenceToolNoRawDumpBoundarySchema.parse({
    boundedCitedExcerptsOnly: true,
    contractKind: "EvidenceToolNoRawDumpBoundary",
    fullSourceTextAllowed: false,
    privateFinanceDataDumpAllowed: false,
    rawFullFileDumpAllowed: false,
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
  });
}

export function buildEvidenceToolNoMutationBoundary() {
  return EvidenceToolNoMutationBoundarySchema.parse({
    contractKind: "EvidenceToolNoMutationBoundary",
    rawSourceRewriteAllowed: false,
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
    sourceMutationAllowed: false,
    sourcePackMutationAllowed: false,
    sourceRegistrationAllowed: false,
  });
}

export function buildEvidenceToolNoFinanceWriteBoundary() {
  return EvidenceToolNoFinanceWriteBoundarySchema.parse({
    bankWriteAllowed: false,
    contractKind: "EvidenceToolNoFinanceWriteBoundary",
    financeWriteAllowed: false,
    generatedFinanceAdviceAllowed: false,
    ledgerWriteAllowed: false,
    reportReleaseAllowed: false,
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
  });
}

export function buildEvidenceToolNoProviderExternalCallBoundary() {
  return EvidenceToolNoProviderExternalCallBoundarySchema.parse({
    contractKind: "EvidenceToolNoProviderExternalCallBoundary",
    customerVendorContactAllowed: false,
    deploymentOrCertificationAllowed: false,
    externalCommunicationsAllowed: false,
    paymentInstructionAllowed: false,
    providerCallsAllowed: false,
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
  });
}

export function buildEvidenceToolNoOpenAiModelBoundary() {
  return EvidenceToolNoOpenAiModelBoundarySchema.parse({
    contractKind: "EvidenceToolNoOpenAiModelBoundary",
    hostedToolsAllowed: false,
    modelCallsAllowed: false,
    modelOutputCanBecomeSourceTruth: false,
    openAiApiCallsAllowed: false,
    openAiClientOrKeyUsageAllowed: false,
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
  });
}

export function buildEvidenceToolDispatchContract(toolName: McpToolName) {
  const base = {
    argumentSchemaBoundary: buildEvidenceToolArgumentSchemaBoundary(toolName),
    dispatchRuntimeImplemented: false,
    freshnessBoundary: buildEvidenceToolFreshnessBoundary(),
    localProofOnly: true,
    noFinanceWriteBoundary: buildEvidenceToolNoFinanceWriteBoundary(),
    noMutationBoundary: buildEvidenceToolNoMutationBoundary(),
    noOpenAiModelBoundary: buildEvidenceToolNoOpenAiModelBoundary(),
    noProviderExternalCallBoundary:
      buildEvidenceToolNoProviderExternalCallBoundary(),
    noRawDumpBoundary: buildEvidenceToolNoRawDumpBoundary(),
    permittedNextActions: [
      {
        action: "request_human_review",
        label: "Review FP-0108 proof-only evidence dispatch contracts.",
        targetId: toolName,
      },
    ],
    refusalEnvelopeBoundary: buildEvidenceToolRefusalEnvelopeBoundary(),
    responseEnvelopeBoundary: buildEvidenceToolResponseEnvelopeBoundary(),
    routeAdapterDispatchEnabled: false,
    schemaVersion: EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
    serviceDependencyBoundary:
      buildEvidenceToolServiceDependencyBoundary(toolName),
    sourceAnchorBoundary: buildEvidenceToolSourceAnchorBoundary(),
    toolName,
  };

  switch (toolName) {
    case "search_evidence":
      return SearchEvidenceDispatchContractSchema.parse({
        ...base,
        contractKind: "SearchEvidenceDispatchContract",
      });
    case "fetch_evidence_card":
      return FetchEvidenceCardDispatchContractSchema.parse({
        ...base,
        contractKind: "FetchEvidenceCardDispatchContract",
      });
    case "fetch_source_anchor":
      return FetchSourceAnchorDispatchContractSchema.parse({
        ...base,
        contractKind: "FetchSourceAnchorDispatchContract",
      });
    case "fetch_document_map":
      return FetchDocumentMapDispatchContractSchema.parse({
        ...base,
        contractKind: "FetchDocumentMapDispatchContract",
      });
    case "fetch_source_coverage":
      return FetchSourceCoverageDispatchContractSchema.parse({
        ...base,
        contractKind: "FetchSourceCoverageDispatchContract",
      });
    case "fetch_company_posture":
      return FetchCompanyPostureDispatchContractSchema.parse({
        ...base,
        contractKind: "FetchCompanyPostureDispatchContract",
      });
    case "fetch_capability_boundaries":
      return FetchCapabilityBoundariesDispatchContractSchema.parse({
        ...base,
        contractKind: "FetchCapabilityBoundariesDispatchContract",
      });
  }
}

export function buildEvidenceToolDispatchContracts() {
  return MCP_TOOL_ALLOWLIST.map((toolName) =>
    buildEvidenceToolDispatchContract(toolName),
  );
}

function freshness() {
  return {
    checkedAt: "2026-05-14T00:00:00.000Z",
    compiledAt: null,
    extractedAt: null,
    sourceCapturedAt: null,
    state: "fresh",
    summary: "FP-0108 synthetic contract proof freshness posture.",
  };
}

function limitation(code: "not_source_truth") {
  return {
    affectedAnchorIds: [],
    affectedSourceIds: [],
    code,
    severity: "blocking",
    summary:
      "FP-0108 is local proof-only and cannot become finance source truth.",
  };
}
