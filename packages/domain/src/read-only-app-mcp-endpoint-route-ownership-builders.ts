import type { z } from "zod";
import type {
  EndpointRouteOwnerCandidateSchema,
  EndpointRouteOwnershipContractKindSchema,
} from "./read-only-app-mcp-endpoint-route-ownership-contracts";
import {
  APP_REFUSAL_REASONS,
  MCP_FORBIDDEN_TOOL_NAMES,
  MCP_TOOL_ALLOWLIST,
} from "./read-only-app-mcp-boundaries";
import {
  EndpointAuthBoundaryDeferredBoundarySchema,
  EndpointDeploymentDeferredBoundarySchema,
  EndpointLoggingRedactionBoundarySchema,
  EndpointNoAppsSdkResourceBoundarySchema,
  EndpointNoOauthTokenSessionBoundarySchema,
  EndpointNoOpenAiApiModelCallsBoundarySchema,
  EndpointNoRemoteMcpServerBoundarySchema,
  EndpointNoRouteImplementationBoundarySchema,
  EndpointNoRuntimeImplementationBoundarySchema,
  EndpointRefusalAdapterBoundarySchema,
  EndpointRequestResponseEnvelopeAdapterBoundarySchema,
  EndpointRollbackReadinessBoundarySchema,
} from "./read-only-app-mcp-endpoint-route-ownership-adapter-contracts";
import {
  ENDPOINT_LOGGING_REDACTION_FIELDS,
  ENDPOINT_PUBLIC_MCP_PATH,
  ENDPOINT_ROUTE_OWNERSHIP_SCHEMA_VERSION,
  ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS,
  EndpointHandlerThinAdapterBoundarySchema,
  EndpointMcpPathContractBoundarySchema,
  EndpointReadOnlyToolDispatchBoundarySchema,
  EndpointRouteOwnerCandidateAnalysisBoundarySchema,
  EndpointRouteOwnerDecisionBoundarySchema,
  EndpointRouteOwnershipProofContractSchema,
  EndpointServiceDispatchBoundarySchema,
  EndpointTransportAdapterBoundarySchema,
} from "./read-only-app-mcp-endpoint-route-ownership-contracts";

export function buildEndpointRouteOwnershipContracts() {
  return {
    authBoundaryDeferredBoundary:
      EndpointAuthBoundaryDeferredBoundarySchema.parse({
        ...base("EndpointAuthBoundaryDeferredBoundary"),
        authBoundaryFutureOnly: true,
        authMiddlewareImplemented: false,
        cookiesImplemented: false,
        futureTokenRejectionRequired: true,
        oauthImplemented: false,
        requiresLaterFinancePlan: true,
        sessionImplementationAdded: false,
        tokenImplementationAdded: false,
      }),
    candidateAnalysisBoundary:
      EndpointRouteOwnerCandidateAnalysisBoundarySchema.parse({
        ...base("EndpointRouteOwnerCandidateAnalysisBoundary"),
        candidateAnalysisDocumentationOnly: true,
        candidates: [
          candidate("apps_control_plane_fastify", true),
          candidate("apps_web_nextjs", false),
          candidate("future_separate_mcp_server_package", false),
          candidate("unresolved", false),
        ],
      }),
    deploymentDeferredBoundary: EndpointDeploymentDeferredBoundarySchema.parse({
      ...base("EndpointDeploymentDeferredBoundary"),
      deploymentFutureOnly: true,
      privateHealthPathFutureOnly: true,
      providerDeploymentImplemented: false,
      remoteMcpDeploymentImplemented: false,
      stableHttpsHostFutureOnly: true,
      tlsFutureOnly: true,
    }),
    handlerThinAdapterBoundary:
      EndpointHandlerThinAdapterBoundarySchema.parse({
        ...base("EndpointHandlerThinAdapterBoundary"),
        callsService: true,
        financeMathInRouteAllowed: false,
        ingestLogicInRouteAllowed: false,
        parsesInput: true,
        promptAssemblyInRouteAllowed: false,
        routeFileCreated: false,
        serializesOutput: true,
        sqlInRouteAllowed: false,
      }),
    loggingRedactionBoundary: EndpointLoggingRedactionBoundarySchema.parse({
      ...base("EndpointLoggingRedactionBoundary"),
      evidenceDumpLoggingAllowed: false,
      loggingImplementationFutureOnly: true,
      mustRedact: [...ENDPOINT_LOGGING_REDACTION_FIELDS],
      privateFinanceDataLoggingAllowed: false,
      rawPromptLoggingAllowed: false,
      rawSourceFileLoggingAllowed: false,
    }),
    mcpPathContractBoundary: EndpointMcpPathContractBoundarySchema.parse({
      ...base("EndpointMcpPathContractBoundary"),
      futurePublicChatGptFacingEndpointPath: ENDPOINT_PUBLIC_MCP_PATH,
      onlyFuturePublicChatGptFacingEndpointPathCurrentlyNamed: true,
      pathImplemented: false,
      privateHealthPathFutureOnly: true,
      publicChatGptFacingEndpointPathsCurrentlyNamed: [ENDPOINT_PUBLIC_MCP_PATH],
    }),
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
    noRemoteMcpServerBoundary: EndpointNoRemoteMcpServerBoundarySchema.parse(
      noImplementation("EndpointNoRemoteMcpServerBoundary"),
    ),
    noRouteImplementationBoundary:
      EndpointNoRouteImplementationBoundarySchema.parse(
        noImplementation("EndpointNoRouteImplementationBoundary"),
      ),
    noRuntimeImplementationBoundary:
      EndpointNoRuntimeImplementationBoundarySchema.parse(
        noImplementation("EndpointNoRuntimeImplementationBoundary"),
      ),
    ownershipProofContract: EndpointRouteOwnershipProofContractSchema.parse({
      ...base("EndpointRouteOwnershipProofContract"),
      appSubmissionAuthorized: false,
      appsSdkResourceImplementationAuthorized: false,
      endpointImplementationAuthorized: false,
      fp0106Created: false,
      oauthTokenSessionImplementationAuthorized: false,
      openAiApiModelCallsAuthorized: false,
      publicAppImplementationAuthorized: false,
      remoteMcpServerImplementationAuthorized: false,
      routeImplementationAuthorized: false,
      routeOwnershipProofContractsOnly: true,
      webApiBackendControlPlaneRouteImplementationAuthorized: false,
    }),
    readOnlyToolDispatchBoundary:
      EndpointReadOnlyToolDispatchBoundarySchema.parse({
        ...base("EndpointReadOnlyToolDispatchBoundary"),
        allowedTools: [...MCP_TOOL_ALLOWLIST],
        dynamicToolsAllowed: false,
        exactV2gReadOnlyAllowlistRequired: true,
        forbiddenTools: [...MCP_FORBIDDEN_TOOL_NAMES],
        writeActionToolsAllowed: false,
      }),
    refusalAdapterBoundary: EndpointRefusalAdapterBoundarySchema.parse({
      ...base("EndpointRefusalAdapterBoundary"),
      existingRefusalReasonsPreserved: [...APP_REFUSAL_REASONS],
      failClosed: true,
      generatedFinanceAdviceAllowed: false,
      permittedNextActionsRequired: true,
      refusalAdapterFutureOnly: true,
      refusalReasonRequired: true,
    }),
    requestResponseEnvelopeAdapterBoundary:
      EndpointRequestResponseEnvelopeAdapterBoundarySchema.parse({
        ...base("EndpointRequestResponseEnvelopeAdapterBoundary"),
        envelopeAdapterFutureOnly: true,
        privateFinanceDataDumpsAllowed: false,
        rawFullFileDumpsAllowed: false,
        responseMustPreserveFields: [...ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS],
      }),
    rollbackReadinessBoundary: EndpointRollbackReadinessBoundarySchema.parse({
      ...base("EndpointRollbackReadinessBoundary"),
      noDeploymentImplementedNow: true,
      noRollbackRuntimeImplementedNow: true,
      rollbackReadinessFutureOnly: true,
      routeRegistrationCanBeDisabledLater: true,
      transportAdapterCanBeRolledBackLater: true,
    }),
    routeOwnerDecisionBoundary: EndpointRouteOwnerDecisionBoundarySchema.parse({
      ...base("EndpointRouteOwnerDecisionBoundary"),
      decisionOutcome: "decided",
      endpointImplementationBlockedUntilLaterPlan: true,
      futureRouteFamilyDocumentationOnly:
        "apps/control-plane Fastify route family",
      futureRouteFilePathPatternDocumentationOnly:
        "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts",
      missingInformationToUnblockRouteOwner: [],
      routeImplementationAuthorized: false,
      routeOwnerFamilyDocumentationOnly:
        "apps/control-plane Fastify route family",
      routeOwnershipUnresolved: false,
      selectedRouteOwner: "apps_control_plane_fastify",
    }),
    serviceDispatchBoundary: EndpointServiceDispatchBoundarySchema.parse({
      ...base("EndpointServiceDispatchBoundary"),
      evidenceBackedDispatchRequired: true,
      financeWriteAllowed: false,
      generatedFinanceAdviceAllowed: false,
      readOnlyDispatchRequired: true,
      serviceDispatchFutureOnly: true,
      sourceMutationAllowed: false,
    }),
    transportAdapterBoundary: EndpointTransportAdapterBoundarySchema.parse({
      ...base("EndpointTransportAdapterBoundary"),
      adapterOwnsMcpTransportOnly: true,
      financeLogicInTransportAllowed: false,
      handlerOwnsThinHttpAdapterOnly: true,
      serviceOwnsReadOnlyDispatch: true,
      supportedFutureTransportFamilies: ["streamable_http", "http_sse"],
      transportAdapterDocumentationProofOnly: true,
      transportImplemented: false,
    }),
  };
}

function base(
  contractKind: z.infer<typeof EndpointRouteOwnershipContractKindSchema>,
) {
  return {
    contractKind,
    localProofOnly: true,
    publicAppImplemented: false,
    readOnly: true,
    schemaVersion: ENDPOINT_ROUTE_OWNERSHIP_SCHEMA_VERSION,
  };
}

function candidate(
  candidateName: z.infer<typeof EndpointRouteOwnerCandidateSchema>,
  safeToOwnFutureRoute: boolean,
) {
  return {
    authTokenSessionBoundaryCovered: true,
    authorityBoundaryCovered: true,
    candidate: candidateName,
    deploymentBoundaryCovered: true,
    financeTwinCfoWikiEvidenceIndexBoundaryCovered: true,
    loggingRedactionBoundaryCovered: true,
    noRouteMayBeAddedInFp0105: true,
    proofabilityCovered: true,
    requestResponseEnvelopeBoundaryCovered: true,
    rollbackBoundaryCovered: true,
    routeThinnessCovered: true,
    safeToOwnFutureRoute,
    sourceEvidenceAccessBoundaryCovered: true,
  };
}

function noImplementation(
  contractKind:
    | "EndpointNoRouteImplementationBoundary"
    | "EndpointNoRuntimeImplementationBoundary"
    | "EndpointNoOauthTokenSessionBoundary"
    | "EndpointNoRemoteMcpServerBoundary"
    | "EndpointNoAppsSdkResourceBoundary"
    | "EndpointNoOpenAiApiModelCallsBoundary",
) {
  return {
    ...base(contractKind),
    failIfChangedRuntimeSurfaceAppears: true,
    futureOnly: true,
    implemented: false,
    requiresLaterFinancePlan: true,
  };
}
