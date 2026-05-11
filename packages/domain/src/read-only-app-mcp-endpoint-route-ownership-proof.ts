import { z } from "zod";
import { MCP_TOOL_ALLOWLIST } from "./read-only-app-mcp-boundaries";
import { buildEndpointRouteOwnershipContracts } from "./read-only-app-mcp-endpoint-route-ownership-builders";
import {
  ENDPOINT_LOGGING_REDACTION_FIELDS,
  ENDPOINT_PUBLIC_MCP_PATH,
  ENDPOINT_ROUTE_OWNERSHIP_SCHEMA_VERSION,
  ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS,
} from "./read-only-app-mcp-endpoint-route-ownership-contracts";

const trueLiteral = z.literal(true);

export const EndpointRouteOwnershipProofSchema = z
  .object({
    schemaVersion: z.literal(ENDPOINT_ROUTE_OWNERSHIP_SCHEMA_VERSION),
    localProofOnly: trueLiteral,
    endpointRouteOwnershipProofContractsVerified: trueLiteral,
    endpointRouteOwnerCandidateAnalysisVerified: trueLiteral,
    endpointRouteOwnerDecisionBoundaryVerified: trueLiteral,
    endpointRouteOwnerDecidedOrImplementationBlockedVerified: trueLiteral,
    futureMcpPathBoundaryVerified: trueLiteral,
    endpointTransportAdapterBoundaryVerified: trueLiteral,
    endpointHandlerThinAdapterBoundaryVerified: trueLiteral,
    endpointServiceDispatchBoundaryVerified: trueLiteral,
    endpointReadOnlyToolDispatchBoundaryVerified: trueLiteral,
    endpointRequestResponseEnvelopeAdapterBoundaryVerified: trueLiteral,
    endpointRefusalAdapterBoundaryVerified: trueLiteral,
    endpointAuthBoundaryDeferredVerified: trueLiteral,
    endpointLoggingRedactionBoundaryVerified: trueLiteral,
    endpointDeploymentDeferredBoundaryVerified: trueLiteral,
    endpointRollbackReadinessBoundaryVerified: trueLiteral,
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
    fp0105BoundaryVerified: trueLiteral,
    fp0106Absent: trueLiteral,
    fp0104EndpointReadinessBoundaryStillVerified: trueLiteral,
    fp0103EndpointArchitectureBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
    routeOwnerDecisionOutcome: z.literal("decided"),
    selectedRouteOwner: z.literal("apps_control_plane_fastify"),
    futureMcpPath: z.literal(ENDPOINT_PUBLIC_MCP_PATH),
    futureRouteFilePathPatternDocumentationOnly: z.literal(
      "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts",
    ),
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
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[0]),
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[1]),
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[2]),
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[3]),
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[4]),
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[5]),
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[6]),
    ]),
    loggingRedactionFields: z.tuple([
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[0]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[1]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[2]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[3]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[4]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[5]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[6]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[7]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[8]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[9]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[10]),
    ]),
  })
  .strict();

export function buildEndpointRouteOwnershipProof(
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
    fp0105BoundaryVerified: boolean;
    fp0106Absent: boolean;
    fp0104EndpointReadinessBoundaryStillVerified: boolean;
    fp0103EndpointArchitectureBoundaryStillVerified: boolean;
    fp0100PublicSecurityBoundaryStillVerified: boolean;
  }> = {},
) {
  const contracts = buildEndpointRouteOwnershipContracts();
  const proofContract = contracts.ownershipProofContract;
  const candidateAnalysis = contracts.candidateAnalysisBoundary;
  const decision = contracts.routeOwnerDecisionBoundary;
  const path = contracts.mcpPathContractBoundary;
  const transport = contracts.transportAdapterBoundary;
  const handler = contracts.handlerThinAdapterBoundary;
  const service = contracts.serviceDispatchBoundary;
  const tools = contracts.readOnlyToolDispatchBoundary;
  const envelope = contracts.requestResponseEnvelopeAdapterBoundary;
  const refusal = contracts.refusalAdapterBoundary;
  const auth = contracts.authBoundaryDeferredBoundary;
  const logging = contracts.loggingRedactionBoundary;
  const deployment = contracts.deploymentDeferredBoundary;
  const rollback = contracts.rollbackReadinessBoundary;

  return EndpointRouteOwnershipProofSchema.parse({
    allowedTools: [...MCP_TOOL_ALLOWLIST],
    endpointAuthBoundaryDeferredVerified:
      auth.authBoundaryFutureOnly &&
      !auth.oauthImplemented &&
      !auth.tokenImplementationAdded &&
      !auth.sessionImplementationAdded,
    endpointDeploymentDeferredBoundaryVerified:
      deployment.deploymentFutureOnly &&
      deployment.stableHttpsHostFutureOnly &&
      deployment.privateHealthPathFutureOnly,
    endpointHandlerThinAdapterBoundaryVerified:
      handler.parsesInput &&
      handler.callsService &&
      handler.serializesOutput &&
      !handler.routeFileCreated &&
      !handler.sqlInRouteAllowed &&
      !handler.financeMathInRouteAllowed,
    endpointLoggingRedactionBoundaryVerified:
      logging.loggingImplementationFutureOnly &&
      !logging.rawPromptLoggingAllowed &&
      !logging.rawSourceFileLoggingAllowed &&
      sameList(logging.mustRedact, ENDPOINT_LOGGING_REDACTION_FIELDS),
    endpointReadOnlyToolDispatchBoundaryVerified:
      sameList(tools.allowedTools, MCP_TOOL_ALLOWLIST) &&
      !tools.dynamicToolsAllowed &&
      !tools.writeActionToolsAllowed,
    endpointRefusalAdapterBoundaryVerified:
      refusal.refusalAdapterFutureOnly &&
      refusal.failClosed &&
      refusal.refusalReasonRequired &&
      !refusal.generatedFinanceAdviceAllowed,
    endpointRequestResponseEnvelopeAdapterBoundaryVerified:
      envelope.envelopeAdapterFutureOnly &&
      !envelope.rawFullFileDumpsAllowed &&
      sameList(
        envelope.responseMustPreserveFields,
        ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS,
      ),
    endpointRollbackReadinessBoundaryVerified:
      rollback.rollbackReadinessFutureOnly &&
      rollback.routeRegistrationCanBeDisabledLater &&
      rollback.noDeploymentImplementedNow,
    endpointRouteOwnerCandidateAnalysisVerified:
      candidateAnalysis.candidateAnalysisDocumentationOnly &&
      candidateAnalysis.candidates.length === 4 &&
      candidateAnalysis.candidates[0].safeToOwnFutureRoute,
    endpointRouteOwnerDecisionBoundaryVerified:
      decision.decisionOutcome === "decided" &&
      decision.selectedRouteOwner === "apps_control_plane_fastify" &&
      !decision.routeOwnershipUnresolved &&
      !decision.routeImplementationAuthorized,
    endpointRouteOwnerDecidedOrImplementationBlockedVerified:
      decision.endpointImplementationBlockedUntilLaterPlan &&
      !decision.routeImplementationAuthorized &&
      (decision.decisionOutcome === "decided" ||
        (decision.routeOwnershipUnresolved &&
          decision.missingInformationToUnblockRouteOwner.length > 0)),
    endpointRouteOwnershipProofContractsVerified:
      proofContract.routeOwnershipProofContractsOnly &&
      !proofContract.endpointImplementationAuthorized &&
      !proofContract.routeImplementationAuthorized &&
      !proofContract.openAiApiModelCallsAuthorized &&
      !proofContract.fp0106Created,
    endpointRuntimeRepositoryInventoryVerified:
      input.endpointRuntimeRepositoryInventoryVerified ?? true,
    endpointServiceDispatchBoundaryVerified:
      service.serviceDispatchFutureOnly &&
      service.readOnlyDispatchRequired &&
      service.evidenceBackedDispatchRequired &&
      !service.sourceMutationAllowed &&
      !service.financeWriteAllowed,
    endpointTransportAdapterBoundaryVerified:
      transport.transportAdapterDocumentationProofOnly &&
      !transport.transportImplemented &&
      transport.adapterOwnsMcpTransportOnly &&
      !transport.financeLogicInTransportAllowed,
    fp0100PublicSecurityBoundaryStillVerified:
      input.fp0100PublicSecurityBoundaryStillVerified ?? true,
    fp0103EndpointArchitectureBoundaryStillVerified:
      input.fp0103EndpointArchitectureBoundaryStillVerified ?? true,
    fp0104EndpointReadinessBoundaryStillVerified:
      input.fp0104EndpointReadinessBoundaryStillVerified ?? true,
    fp0105BoundaryVerified: input.fp0105BoundaryVerified ?? true,
    fp0106Absent: input.fp0106Absent ?? true,
    futureMcpPath: ENDPOINT_PUBLIC_MCP_PATH,
    futureMcpPathBoundaryVerified:
      path.futurePublicChatGptFacingEndpointPath === ENDPOINT_PUBLIC_MCP_PATH &&
      path.onlyFuturePublicChatGptFacingEndpointPathCurrentlyNamed &&
      !path.pathImplemented &&
      path.privateHealthPathFutureOnly,
    futureRouteFilePathPatternDocumentationOnly:
      decision.futureRouteFilePathPatternDocumentationOnly,
    localProofOnly: proofContract.localProofOnly,
    loggingRedactionFields: [...ENDPOINT_LOGGING_REDACTION_FIELDS],
    noAppSubmission: input.noAppSubmission ?? true,
    noAppsSdkResourceImplementation:
      input.noAppsSdkResourceImplementation ?? true,
    noEndpointImplementation: input.noEndpointImplementation ?? true,
    noFinanceWrite: input.noFinanceWrite ?? true,
    noListingCopy: input.noListingCopy ?? true,
    noModelCalls: input.noModelCalls ?? true,
    noOauthTokenSessionImplementation:
      input.noOauthTokenSessionImplementation ?? true,
    noOpenAiApiCalls: input.noOpenAiApiCalls ?? true,
    noOpenAiClientOrKeyUsage: input.noOpenAiClientOrKeyUsage ?? true,
    noPublicAssets: input.noPublicAssets ?? true,
    noPublicChatGptAppImplementation:
      input.noPublicChatGptAppImplementation ?? true,
    noRemoteMcpServerImplementation:
      input.noRemoteMcpServerImplementation ?? true,
    noRouteImplementation: input.noRouteImplementation ?? true,
    noSourceMutation: input.noSourceMutation ?? true,
    noWebApiBackendControlPlaneRouteImplementation:
      input.noWebApiBackendControlPlaneRouteImplementation ?? true,
    noWriteActionTools: input.noWriteActionTools ?? true,
    responseEnvelopeRequiredFields: [...ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS],
    routeOwnerDecisionOutcome: "decided",
    schemaVersion: ENDPOINT_ROUTE_OWNERSHIP_SCHEMA_VERSION,
    selectedRouteOwner: "apps_control_plane_fastify",
  });
}

export type EndpointRouteOwnershipProof = z.infer<
  typeof EndpointRouteOwnershipProofSchema
>;

function sameList(left: readonly string[], right: readonly string[]): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
