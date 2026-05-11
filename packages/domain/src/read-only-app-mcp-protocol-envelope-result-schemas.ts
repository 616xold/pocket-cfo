import { z } from "zod";
import { McpToolNameSchema } from "./read-only-app-mcp-boundaries";
import {
  LoggingRedactionFieldSchema,
  MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION,
  MCP_PROTOCOL_LOGGING_REDACTION_FIELDS,
  MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS,
  MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS,
  ResponseEnvelopeFieldSchema,
  StructuredContentFieldSchema,
  sameMcpProtocolList,
} from "./read-only-app-mcp-protocol-envelope-constants";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const McpProtocolToolSchemaBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolToolSchemaBoundary"),
    toolName: McpToolNameSchema,
    readOnlyAnnotationsRequired: trueLiteral,
    destructiveHintAllowed: falseLiteral,
    openWorldHintAllowed: falseLiteral,
    schemaRequiresEvidenceFreshnessLimitations: trueLiteral,
    schemaRequiresCapabilityBoundary: trueLiteral,
    schemaAllowsSourceMutation: falseLiteral,
    schemaAllowsFinanceWrites: falseLiteral,
  })
  .strict();

export const McpProtocolStructuredContentBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolStructuredContentBoundary"),
    requiredStructuredContentFields: z.array(StructuredContentFieldSchema).min(1),
    freeformFinanceProseCanBeSourceTruth: falseLiteral,
    structuredContentRequiredForToolResults: trueLiteral,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (
      !sameMcpProtocolList(
        value.requiredStructuredContentFields,
        MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS,
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Structured content fields must match the protocol contract.",
        path: ["requiredStructuredContentFields"],
      });
    }
  });

export const McpProtocolEvidenceEnvelopeBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolEvidenceEnvelopeBoundary"),
    responseMustPreserveFields: z.array(ResponseEnvelopeFieldSchema).min(1),
    descriptorOutputFields: z.array(z.string()).min(1),
    rawFullFileDumpsAllowed: falseLiteral,
    privateFinanceDataDumpsAllowed: falseLiteral,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (
      !sameMcpProtocolList(
        value.responseMustPreserveFields,
        MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS,
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Evidence envelope fields must match the protocol contract.",
        path: ["responseMustPreserveFields"],
      });
    }
    const descriptorCompatible = MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS.every(
      (field) =>
        value.descriptorOutputFields.includes(field) ||
        field === "sourceAnchors" ||
        field === "refusalReason" ||
        field === "capabilityBoundary",
    );
    if (!descriptorCompatible) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Descriptor envelope must remain compatible with protocol fields.",
        path: ["descriptorOutputFields"],
      });
    }
  });

export const McpProtocolRefusalEnvelopeBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolRefusalEnvelopeBoundary"),
    responseMustPreserveFields: z.array(ResponseEnvelopeFieldSchema).min(1),
    refusalReasonRequired: trueLiteral,
    permittedNextActionsRequired: trueLiteral,
    capabilityBoundaryRequired: trueLiteral,
    failClosed: trueLiteral,
    leaksRawSourcesOrSecrets: falseLiteral,
  })
  .strict();

export const McpProtocolArgumentValidationBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolArgumentValidationBoundary"),
    invalidArgumentsFailClosed: trueLiteral,
    unknownArgumentsRejected: trueLiteral,
    missingRequiredArgumentsFailClosed: trueLiteral,
    noBestEffortArgumentInference: trueLiteral,
  })
  .strict();

export const McpProtocolInvalidToolFailClosedBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolInvalidToolFailClosedBoundary"),
    invalidToolNamesFailClosed: trueLiteral,
    renamedWriteActionEquivalentsFailClosed: trueLiteral,
    noProviderCalls: trueLiteral,
    noExternalCommunications: trueLiteral,
    noLegalAuditTaxAdvice: trueLiteral,
  })
  .strict();

export const McpProtocolAuthDeferredBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolAuthDeferredBoundary"),
    authPolicyQuestionsOnly: trueLiteral,
    oauthFutureOnly: trueLiteral,
    tokenFutureOnly: trueLiteral,
    sessionFutureOnly: trueLiteral,
    authFlowImplemented: falseLiteral,
    callbackImplemented: falseLiteral,
    tokenExchangeImplemented: falseLiteral,
    sessionHandlerImplemented: falseLiteral,
    middlewareImplemented: falseLiteral,
    cookieHandlingImplemented: falseLiteral,
    secretHandlingImplemented: falseLiteral,
  })
  .strict();

export const McpProtocolLoggingRedactionBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolLoggingRedactionBoundary"),
    loggingImplementationAuthorized: falseLiteral,
    mustRedact: z.array(LoggingRedactionFieldSchema).min(1),
    telemetryImplementationAuthorized: falseLiteral,
    rawPromptLoggingAllowed: falseLiteral,
    rawSourceFileLoggingAllowed: falseLiteral,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!sameMcpProtocolList(value.mustRedact, MCP_PROTOCOL_LOGGING_REDACTION_FIELDS)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Logging redaction fields must match the protocol contract.",
        path: ["mustRedact"],
      });
    }
  });

export const McpProtocolNoRouteImplementationBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolNoRouteImplementationBoundary"),
    routeFileCreated: falseLiteral,
    routeImplementationAuthorized: falseLiteral,
    webApiBackendControlPlaneRouteImplementationAuthorized: falseLiteral,
  })
  .strict();

export const McpProtocolNoRuntimeImplementationBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolNoRuntimeImplementationBoundary"),
    localMcpServerRuntimeAdded: falseLiteral,
    remoteMcpServerRuntimeAdded: falseLiteral,
    endpointRuntimeAdded: falseLiteral,
    appsSdkResourceRuntimeAdded: falseLiteral,
  })
  .strict();

export const McpProtocolNoOpenAiApiModelCallsBoundarySchema = z
  .object({
    schemaVersion: z.literal(MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION),
    contractKind: z.literal("McpProtocolNoOpenAiApiModelCallsBoundary"),
    apiCallsAuthorized: falseLiteral,
    modelCallsAuthorized: falseLiteral,
    clientOrKeyUsageAuthorized: falseLiteral,
    hostedToolsAuthorized: falseLiteral,
  })
  .strict();
