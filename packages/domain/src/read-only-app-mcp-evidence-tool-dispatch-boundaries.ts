import { z } from "zod";
import {
  EvidenceIndexFreshnessPostureSchema,
  EvidenceIndexLimitationPostureSchema,
} from "./evidence-index-common";
import {
  MCP_FORBIDDEN_TOOL_NAMES,
  MCP_TOOL_ALLOWLIST,
  McpForbiddenToolSchema,
  McpToolAllowlistSchema,
  McpToolNameSchema,
  type McpToolName,
} from "./read-only-app-mcp-boundaries";
import {
  argumentFields,
  optionalArguments,
  requiredArguments,
} from "./read-only-app-mcp-evidence-tool-dispatch-arguments";
import {
  EVIDENCE_TOOL_DISPATCH_REFUSAL_REASONS,
  EVIDENCE_TOOL_DISPATCH_RESPONSE_REQUIRED_FIELDS,
  EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION,
  EVIDENCE_TOOL_DISPATCH_SERVICE_BY_TOOL,
  EVIDENCE_TOOL_DISPATCH_SERVICE_LANES,
  EVIDENCE_TOOL_DISPATCH_SERVICE_LANES_BY_TOOL,
} from "./read-only-app-mcp-evidence-tool-dispatch-constants";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const EvidenceToolDispatchResponseRequiredFieldsSchema = z.tuple([
  z.literal("structuredContent"),
  z.literal("evidence"),
  z.literal("sourceAnchors"),
  z.literal("freshness"),
  z.literal("limitations"),
  z.literal("permittedNextActions"),
  z.literal("refusalReason"),
  z.literal("capabilityBoundary"),
]);

export const EvidenceToolDispatchAllowlistBoundarySchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolDispatchAllowlistBoundary"),
    exactV2gToolAllowlist: McpToolAllowlistSchema,
    dynamicToolsAllowed: falseLiteral,
    writeActionToolsAllowed: falseLiteral,
    forbiddenTools: z.array(McpForbiddenToolSchema).min(1),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!sameList(value.exactV2gToolAllowlist, MCP_TOOL_ALLOWLIST)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Evidence dispatch allowlist must match exact V2G tools.",
        path: ["exactV2gToolAllowlist"],
      });
    }
    if (!sameList(value.forbiddenTools, MCP_FORBIDDEN_TOOL_NAMES)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Evidence dispatch forbidden tools must match base boundary.",
        path: ["forbiddenTools"],
      });
    }
  });

export const EvidenceToolArgumentSchemaBoundarySchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolArgumentSchemaBoundary"),
    toolName: McpToolNameSchema,
    exactArgumentFields: z.array(z.string().min(1)).min(1),
    requiredArguments: z.array(z.string().min(1)).min(1),
    optionalArguments: z.array(z.string().min(1)),
    additionalPropertiesAllowed: falseLiteral,
    unknownArgumentsFailClosed: trueLiteral,
    missingRequiredArgumentsFailClosed: trueLiteral,
    invalidArgumentTypesFailClosed: trueLiteral,
    noBestEffortArgumentInference: trueLiteral,
    acceptsOnlyDeclaredArguments: trueLiteral,
    acceptsUploads: falseLiteral,
    acceptsSourceMutation: falseLiteral,
    acceptsFinanceWrites: falseLiteral,
    acceptsProviderCredentials: falseLiteral,
    acceptsOauthTokenSession: falseLiteral,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!sameList(value.exactArgumentFields, argumentFields(value.toolName))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tool argument fields must match the exact dispatch contract.",
        path: ["exactArgumentFields"],
      });
    }
    if (!sameList(value.requiredArguments, requiredArguments(value.toolName))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required arguments must match the exact dispatch contract.",
        path: ["requiredArguments"],
      });
    }
    if (!sameList(value.optionalArguments, optionalArguments(value.toolName))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Optional arguments must match the exact dispatch contract.",
        path: ["optionalArguments"],
      });
    }
  });

export const EvidenceToolServiceLaneSchema = z.enum(
  EVIDENCE_TOOL_DISPATCH_SERVICE_LANES,
);

export const EvidenceToolServiceDependencyBoundarySchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolServiceDependencyBoundary"),
    toolName: McpToolNameSchema,
    futureServiceDependency: z.string().min(1),
    futureServiceLanes: z.array(EvidenceToolServiceLaneSchema).min(1),
    readOnly: trueLiteral,
    futureDispatchOnly: trueLiteral,
    runtimeImplementedInFp0108: falseLiteral,
    resolvesThroughExistingEvidenceSourceAuthorityLanesOnly: trueLiteral,
    createsNewControlPlaneService: falseLiteral,
    addsDatabaseQueries: falseLiteral,
    addsSchemasOrMigrations: falseLiteral,
    callsProviders: falseLiteral,
    callsOpenAiApiOrModels: falseLiteral,
    sourceMutationAllowed: falseLiteral,
    financeWriteAllowed: falseLiteral,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.futureServiceDependency !== serviceForTool(value.toolName)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Future service dependency must match the exact tool mapping.",
        path: ["futureServiceDependency"],
      });
    }
    if (
      !sameList(value.futureServiceLanes, serviceLanesForTool(value.toolName))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Future service lanes must match the exact tool contract.",
        path: ["futureServiceLanes"],
      });
    }
  });

export const EvidenceToolResponseEnvelopeBoundarySchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolResponseEnvelopeBoundary"),
    requiredFields: EvidenceToolDispatchResponseRequiredFieldsSchema,
    structuredContentRequired: trueLiteral,
    mcpTextContentMirrorRequired: trueLiteral,
    evidenceRequiredForSuccess: trueLiteral,
    sourceAnchorsRequiredForSuccess: trueLiteral,
    freshnessRequiredForSuccess: trueLiteral,
    limitationsRequiredForSuccess: trueLiteral,
    permittedNextActionsRequired: trueLiteral,
    refusalReasonPresentAndNullable: trueLiteral,
    capabilityBoundaryRequired: trueLiteral,
    rawFullFileDumpsAllowed: falseLiteral,
    generatedFinanceAdviceAllowed: falseLiteral,
    modelOutputCanBecomeSourceTruth: falseLiteral,
  })
  .strict();

export const EvidenceToolDispatchRefusalReasonSchema = z.enum(
  EVIDENCE_TOOL_DISPATCH_REFUSAL_REASONS,
);

export const EvidenceToolRefusalEnvelopeBoundarySchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolRefusalEnvelopeBoundary"),
    requiredFields: EvidenceToolDispatchResponseRequiredFieldsSchema,
    refusalReasons: z.array(EvidenceToolDispatchRefusalReasonSchema).min(1),
    failClosed: trueLiteral,
    structuredContentRequiredForErrors: trueLiteral,
    refusalReasonRequired: trueLiteral,
    permittedNextActionsRequired: trueLiteral,
    capabilityBoundaryRequired: trueLiteral,
    evidenceEmptyWhenMissingOrUnsupported: trueLiteral,
    sourceAnchorsEmptyWhenMissingCitation: trueLiteral,
    leaksRawSourcesOrSecrets: falseLiteral,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (
      !sameList(value.refusalReasons, EVIDENCE_TOOL_DISPATCH_REFUSAL_REASONS)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Refusal reasons must match the exact FP-0108 contract.",
        path: ["refusalReasons"],
      });
    }
  });

export const EvidenceToolFreshnessBoundarySchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolFreshnessBoundary"),
    freshnessPostureSchemaRequired: trueLiteral,
    missingEvidenceFailsClosed: trueLiteral,
    missingCitationFailsClosed: trueLiteral,
    unsupportedEvidenceFailsClosed: trueLiteral,
    staleEvidenceFailsClosed: trueLiteral,
    conflictingEvidenceFailsClosed: trueLiteral,
    promptInjectionContentRemainsUntrusted: trueLiteral,
    freshness: EvidenceIndexFreshnessPostureSchema,
    limitations: z.array(EvidenceIndexLimitationPostureSchema).min(1),
  })
  .strict();

export const EvidenceToolSourceAnchorBoundarySchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolSourceAnchorBoundary"),
    evidenceRequiredForSuccess: trueLiteral,
    sourceAnchorsRequiredForSuccess: trueLiteral,
    sourceAnchorCitationRequired: trueLiteral,
    boundedExcerptsOnly: trueLiteral,
    sourceSnapshotsAndChecksumsRemainAuthority: trueLiteral,
    rawSourcesImmutable: trueLiteral,
    modelOutputCannotBecomeSourceTruth: trueLiteral,
    noRawFullFileDump: trueLiteral,
  })
  .strict();

export type EvidenceToolDispatchAllowlistBoundary = z.infer<
  typeof EvidenceToolDispatchAllowlistBoundarySchema
>;
export type EvidenceToolArgumentSchemaBoundary = z.infer<
  typeof EvidenceToolArgumentSchemaBoundarySchema
>;
export type EvidenceToolServiceDependencyBoundary = z.infer<
  typeof EvidenceToolServiceDependencyBoundarySchema
>;
export type EvidenceToolResponseEnvelopeBoundary = z.infer<
  typeof EvidenceToolResponseEnvelopeBoundarySchema
>;
export type EvidenceToolRefusalEnvelopeBoundary = z.infer<
  typeof EvidenceToolRefusalEnvelopeBoundarySchema
>;
export type EvidenceToolFreshnessBoundary = z.infer<
  typeof EvidenceToolFreshnessBoundarySchema
>;
export type EvidenceToolSourceAnchorBoundary = z.infer<
  typeof EvidenceToolSourceAnchorBoundarySchema
>;

export function serviceForTool(toolName: McpToolName) {
  return EVIDENCE_TOOL_DISPATCH_SERVICE_BY_TOOL[toolName];
}

export function serviceLanesForTool(toolName: McpToolName) {
  return [...EVIDENCE_TOOL_DISPATCH_SERVICE_LANES_BY_TOOL[toolName]];
}

export function responseRequiredFields() {
  return [...EVIDENCE_TOOL_DISPATCH_RESPONSE_REQUIRED_FIELDS];
}

function sameList(
  actual: readonly string[],
  expected: readonly string[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((item, index) => item === expected[index])
  );
}
