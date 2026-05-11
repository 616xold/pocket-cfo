import { z } from "zod";
import {
  MCP_FORBIDDEN_TOOL_NAMES,
  MCP_TOOL_ALLOWLIST,
  McpForbiddenToolSchema,
  McpToolAllowlistSchema,
} from "./read-only-app-mcp-boundaries";
import {
  MCP_PROTOCOL_ACCEPTED_METHODS,
  MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  MCP_PROTOCOL_PUBLIC_PATH,
  MCP_PROTOCOL_REJECTED_METHODS,
  RejectedMethodSchema,
  sameMcpProtocolList,
} from "./read-only-app-mcp-protocol-envelope-constants";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const McpProtocolEnvelopeProofContractSchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolEnvelopeProofContract"),
    localProofOnly: trueLiteral,
    readOnly: trueLiteral,
    protocolEnvelopeContractsOnly: trueLiteral,
    endpointImplementationAuthorized: falseLiteral,
    routeImplementationAuthorized: falseLiteral,
    remoteMcpServerImplementationAuthorized: falseLiteral,
    oauthTokenSessionImplementationAuthorized: falseLiteral,
    appsSdkResourceImplementationAuthorized: falseLiteral,
    publicChatGptAppImplementationAuthorized: falseLiteral,
    appSubmissionAuthorized: falseLiteral,
    openAiApiModelCallsAuthorized: falseLiteral,
    fp0107Created: falseLiteral,
    priorBoundariesPreserved: trueLiteral,
  })
  .strict();

export const McpProtocolPathBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolPathBoundary"),
    futurePublicChatGptFacingEndpointPath: z.literal(MCP_PROTOCOL_PUBLIC_PATH),
    onlyFuturePublicChatGptFacingEndpointPath: trueLiteral,
    pathFutureOnly: trueLiteral,
    pathImplemented: falseLiteral,
    routeFileCreated: falseLiteral,
    noRouteFileMayBeCreatedInFp0106: trueLiteral,
  })
  .strict();

export const McpProtocolTransportBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolTransportBoundary"),
    postMcpOnlyRequiredPublicMethod: trueLiteral,
    getMcpFutureOnlyBlockedUnlessLaterOfficialProtocolRequires: trueLiteral,
    streamableHttpRequestFutureOnly: trueLiteral,
    transportImplemented: falseLiteral,
    noLocalOrRemoteMcpServerRuntimeAdded: trueLiteral,
  })
  .strict();

export const McpProtocolAcceptedMethodsBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolAcceptedMethodsBoundary"),
    acceptedMethods: z.tuple([
      z.literal(MCP_PROTOCOL_ACCEPTED_METHODS[0]),
      z.literal(MCP_PROTOCOL_ACCEPTED_METHODS[1]),
      z.literal(MCP_PROTOCOL_ACCEPTED_METHODS[2]),
      z.literal(MCP_PROTOCOL_ACCEPTED_METHODS[3]),
    ]),
    acceptedMethodsFutureOnly: trueLiteral,
    healthMetadataMethodFutureOnly: trueLiteral,
    dynamicMethodsAllowed: falseLiteral,
  })
  .strict();

export const McpProtocolRejectedMethodsBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolRejectedMethodsBoundary"),
    rejectedMethods: z.array(RejectedMethodSchema).min(1),
    allOtherMethodsFailClosed: trueLiteral,
    noBestEffortUnknownMethodHandling: trueLiteral,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!sameMcpProtocolList(value.rejectedMethods, MCP_PROTOCOL_REJECTED_METHODS)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Rejected MCP methods must match the fail-closed contract.",
        path: ["rejectedMethods"],
      });
    }
  });

export const McpProtocolInitializeBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolInitializeBoundary"),
    methodName: z.literal("initialize"),
    acceptedFutureOnly: trueLiteral,
    implementationAdded: falseLiteral,
    capabilitiesMustStayReadOnly: trueLiteral,
    noDynamicToolsFromInitialize: trueLiteral,
  })
  .strict();

export const McpProtocolToolsListBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolToolsListBoundary"),
    methodName: z.literal("tools/list"),
    acceptedFutureOnly: trueLiteral,
    toolAllowlist: McpToolAllowlistSchema,
    dynamicToolsAllowed: falseLiteral,
    toolDriftAllowed: falseLiteral,
  })
  .strict();

export const McpProtocolToolsCallBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolToolsCallBoundary"),
    methodName: z.literal("tools/call"),
    acceptedFutureOnly: trueLiteral,
    dispatchesToReadOnlyServicesOnly: trueLiteral,
    invalidToolNamesFailClosed: trueLiteral,
    invalidArgumentsFailClosed: trueLiteral,
    missingUnsupportedStaleConflictingEvidenceFailsClosed: trueLiteral,
    missingCitationEvidenceFailsClosed: trueLiteral,
    rawFullFileDumpsAllowed: falseLiteral,
    generatedFinanceAdviceAllowed: falseLiteral,
    modelOutputCanBecomeSourceTruth: falseLiteral,
  })
  .strict();

export const McpProtocolReadOnlyToolAllowlistBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolReadOnlyToolAllowlistBoundary"),
    allowedTools: McpToolAllowlistSchema,
    forbiddenTools: z.array(McpForbiddenToolSchema).min(1),
    exactV2gReadOnlyAllowlistRequired: trueLiteral,
    dynamicToolsAllowed: falseLiteral,
    writeActionToolsAllowed: falseLiteral,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!sameMcpProtocolList(value.allowedTools, MCP_TOOL_ALLOWLIST)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Allowed tools must match the exact V2G allowlist.",
        path: ["allowedTools"],
      });
    }
    if (!sameMcpProtocolList(value.forbiddenTools, MCP_FORBIDDEN_TOOL_NAMES)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Forbidden tools must match the exact read-only boundary.",
        path: ["forbiddenTools"],
      });
    }
  });
