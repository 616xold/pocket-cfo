import { z } from "zod";
import {
  APP_REFUSAL_REASONS,
  MCP_FORBIDDEN_TOOL_NAMES,
  MCP_TOOL_ALLOWLIST,
  McpForbiddenToolSchema,
  McpToolAllowlistSchema,
} from "./read-only-app-mcp-boundaries";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const ENDPOINT_ARCHITECTURE_SCHEMA_VERSION =
  "v2w.endpoint-architecture.v1";

export const ENDPOINT_FUTURE_INVENTORY_FIELDS = [
  "path",
  "method",
  "transport",
  "requestEnvelope",
  "responseEnvelope",
  "authRequirement",
  "healthPathIfAny",
  "refusalFailureBehavior",
  "loggingPosture",
] as const;

export const ENDPOINT_RESPONSE_ENVELOPE_FIELDS = [
  "evidence",
  "sourceAnchors",
  "freshness",
  "limitations",
  "refusals",
  "permittedNextActions",
] as const;

export const ENDPOINT_FAIL_CLOSED_REQUESTS = [
  "unsupported",
  "stale",
  "conflicting",
  "missing_citation",
  "data_exfiltration",
  "raw_dump",
  "write_action",
  "prompt_injection",
] as const;

export const EndpointArchitectureContractKindSchema = z.enum([
  "EndpointArchitectureProofContract",
  "EndpointInventoryDeferredBoundary",
  "EndpointPathInventoryPreconditions",
  "EndpointTrustModelBoundary",
  "EndpointTransportChoiceBoundary",
  "EndpointTlsHttpsFutureRequirementBoundary",
  "EndpointRequestResponseEnvelopeBoundary",
  "EndpointEvidenceFreshnessLimitationsBoundary",
  "EndpointRefusalFailureModeBoundary",
  "EndpointReadOnlyToolAllowlistBoundary",
  "EndpointNoRouteImplementationBoundary",
  "EndpointNoWebApiBackendRouteBoundary",
  "EndpointNoOauthTokenSessionBoundary",
  "EndpointNoRemoteMcpDeploymentBoundary",
  "EndpointNoAppsSdkResourceBoundary",
  "EndpointNoAppSubmissionBoundary",
  "EndpointNoOpenAiApiModelCallsBoundary",
  "EndpointNoSourceMutationFinanceWriteBoundary",
  "EndpointNoWriteActionToolsBoundary",
]);

const EndpointArchitectureBaseSchema = z
  .object({
    schemaVersion: z.literal(ENDPOINT_ARCHITECTURE_SCHEMA_VERSION),
    contractKind: EndpointArchitectureContractKindSchema,
    localProofOnly: trueLiteral,
    publicAppImplemented: falseLiteral,
  })
  .strict();

export const EndpointArchitectureProofContractSchema =
  EndpointArchitectureBaseSchema.extend({
    contractKind: z.literal("EndpointArchitectureProofContract"),
    endpointArchitectureProofContractsOnly: trueLiteral,
    endpointImplementationAuthorized: falseLiteral,
    routeImplementationAuthorized: falseLiteral,
    oauthTokenSessionImplementationAuthorized: falseLiteral,
    remoteMcpDeploymentAuthorized: falseLiteral,
    appsSdkResourceImplementationAuthorized: falseLiteral,
    publicAppImplementationAuthorized: falseLiteral,
    appSubmissionAuthorized: falseLiteral,
    openAiApiModelCallsAuthorized: falseLiteral,
    fp0104Created: falseLiteral,
  }).strict();

export const EndpointInventoryDeferredBoundarySchema =
  EndpointArchitectureBaseSchema.extend({
    contractKind: z.literal("EndpointInventoryDeferredBoundary"),
    endpointInventoryFutureOnly: trueLiteral,
    endpointInventoryImplemented: falseLiteral,
    requiresLaterFinancePlan: trueLiteral,
    requiresLaterSecurityReview: trueLiteral,
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
  }).strict();

export const EndpointPathInventoryPreconditionsSchema =
  EndpointArchitectureBaseSchema.extend({
    contractKind: z.literal("EndpointPathInventoryPreconditions"),
    noEndpointPathImplemented: trueLiteral,
    noHealthPathImplemented: trueLiteral,
    futureEndpointInventoryMustNameAllFields: trueLiteral,
    implementationRequiresLaterAcceptedInventory: trueLiteral,
  }).strict();

export const EndpointTrustModelBoundarySchema =
  EndpointArchitectureBaseSchema.extend({
    contractKind: z.literal("EndpointTrustModelBoundary"),
    trustModelFutureOnly: trueLiteral,
    callerTrustMustBeNamedLater: trueLiteral,
    modelVisibleDataMustBeNamedLater: trueLiteral,
    rawSourcesRemainDocumentTruth: trueLiteral,
    financeTwinRemainsStructuredTruth: trueLiteral,
    cfoWikiRemainsDerived: trueLiteral,
    evidenceIndexRemainsReadOnlyAnchorLayer: trueLiteral,
  }).strict();

export const EndpointTransportChoiceBoundarySchema =
  EndpointArchitectureBaseSchema.extend({
    contractKind: z.literal("EndpointTransportChoiceBoundary"),
    transportChoiceIsArchitectureInputOnly: trueLiteral,
    transportImplemented: falseLiteral,
    laterJustificationAgainstOfficialDocsRequired: trueLiteral,
    supportedFutureTransportFamilies: z.tuple([
      z.literal("streamable_http"),
      z.literal("http_sse"),
    ]),
  }).strict();

export const EndpointTlsHttpsFutureRequirementBoundarySchema =
  EndpointArchitectureBaseSchema.extend({
    contractKind: z.literal("EndpointTlsHttpsFutureRequirementBoundary"),
    tlsHttpsFutureRequirement: trueLiteral,
    tlsConfiguredNow: falseLiteral,
    stableHttpsHostFutureOnly: trueLiteral,
    deploymentFutureOnly: trueLiteral,
  }).strict();

export const EndpointRequestResponseEnvelopeBoundarySchema =
  EndpointArchitectureBaseSchema.extend({
    contractKind: z.literal("EndpointRequestResponseEnvelopeBoundary"),
    envelopeFutureOnly: trueLiteral,
    rawFullFileDumpsAllowed: falseLiteral,
    responseMustPreserveFields: z.tuple([
      z.literal(ENDPOINT_RESPONSE_ENVELOPE_FIELDS[0]),
      z.literal(ENDPOINT_RESPONSE_ENVELOPE_FIELDS[1]),
      z.literal(ENDPOINT_RESPONSE_ENVELOPE_FIELDS[2]),
      z.literal(ENDPOINT_RESPONSE_ENVELOPE_FIELDS[3]),
      z.literal(ENDPOINT_RESPONSE_ENVELOPE_FIELDS[4]),
      z.literal(ENDPOINT_RESPONSE_ENVELOPE_FIELDS[5]),
    ]),
  }).strict();

export const EndpointEvidenceFreshnessLimitationsBoundarySchema =
  EndpointArchitectureBaseSchema.extend({
    contractKind: z.literal("EndpointEvidenceFreshnessLimitationsBoundary"),
    evidenceRequired: trueLiteral,
    sourceAnchorsRequired: trueLiteral,
    freshnessRequired: trueLiteral,
    limitationsRequired: trueLiteral,
    permittedNextActionsRequired: trueLiteral,
    missingEvidenceFailsClosed: trueLiteral,
  }).strict();

export const EndpointRefusalFailureModeBoundarySchema =
  EndpointArchitectureBaseSchema.extend({
    contractKind: z.literal("EndpointRefusalFailureModeBoundary"),
    failClosed: trueLiteral,
    generatedFinanceAdviceAllowed: falseLiteral,
    requiredFailClosedRequests: z.tuple([
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[0]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[1]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[2]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[3]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[4]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[5]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[6]),
      z.literal(ENDPOINT_FAIL_CLOSED_REQUESTS[7]),
    ]),
    existingRefusalReasonsPreserved: z.tuple([
      z.literal(APP_REFUSAL_REASONS[0]),
      z.literal(APP_REFUSAL_REASONS[1]),
      z.literal(APP_REFUSAL_REASONS[2]),
      z.literal(APP_REFUSAL_REASONS[3]),
      z.literal(APP_REFUSAL_REASONS[4]),
      z.literal(APP_REFUSAL_REASONS[5]),
      z.literal(APP_REFUSAL_REASONS[6]),
      z.literal(APP_REFUSAL_REASONS[7]),
      z.literal(APP_REFUSAL_REASONS[8]),
    ]),
  }).strict();

export const EndpointReadOnlyToolAllowlistBoundarySchema =
  EndpointArchitectureBaseSchema.extend({
    contractKind: z.literal("EndpointReadOnlyToolAllowlistBoundary"),
    allowedTools: McpToolAllowlistSchema,
    forbiddenTools: z.array(McpForbiddenToolSchema).min(1),
    dynamicToolsAllowed: falseLiteral,
    writeModifyActionToolsAllowed: falseLiteral,
    existingV2gDescriptorAllowlistRemainsReadOnly: trueLiteral,
  })
    .strict()
    .superRefine((value, ctx) => {
      if (!sameList(value.allowedTools, MCP_TOOL_ALLOWLIST)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Allowed tools must match the exact V2G contract.",
          path: ["allowedTools"],
        });
      }
      if (!sameList(value.forbiddenTools, MCP_FORBIDDEN_TOOL_NAMES)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Forbidden tools must match the exact V2G contract.",
          path: ["forbiddenTools"],
        });
      }
    });

function noImplementationBoundary(
  kind: z.infer<typeof EndpointArchitectureContractKindSchema>,
) {
  return EndpointArchitectureBaseSchema.extend({
    contractKind: z.literal(kind),
    implemented: falseLiteral,
    futureOnly: trueLiteral,
    requiresLaterFinancePlan: trueLiteral,
    failIfChangedRuntimeSurfaceAppears: trueLiteral,
  }).strict();
}

export const EndpointNoRouteImplementationBoundarySchema =
  noImplementationBoundary("EndpointNoRouteImplementationBoundary");
export const EndpointNoWebApiBackendRouteBoundarySchema =
  noImplementationBoundary("EndpointNoWebApiBackendRouteBoundary");
export const EndpointNoOauthTokenSessionBoundarySchema =
  noImplementationBoundary("EndpointNoOauthTokenSessionBoundary");
export const EndpointNoRemoteMcpDeploymentBoundarySchema =
  noImplementationBoundary("EndpointNoRemoteMcpDeploymentBoundary");
export const EndpointNoAppsSdkResourceBoundarySchema =
  noImplementationBoundary("EndpointNoAppsSdkResourceBoundary");
export const EndpointNoAppSubmissionBoundarySchema = noImplementationBoundary(
  "EndpointNoAppSubmissionBoundary",
);
export const EndpointNoOpenAiApiModelCallsBoundarySchema =
  noImplementationBoundary("EndpointNoOpenAiApiModelCallsBoundary");
export const EndpointNoSourceMutationFinanceWriteBoundarySchema =
  noImplementationBoundary("EndpointNoSourceMutationFinanceWriteBoundary");
export const EndpointNoWriteActionToolsBoundarySchema =
  noImplementationBoundary("EndpointNoWriteActionToolsBoundary");

function sameList(
  left: readonly string[],
  right: readonly string[],
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
