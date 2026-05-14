import { z } from "zod";
import { PermittedNextActionSchema } from "./evidence-index-common";
import {
  McpToolNameSchema,
  type McpToolName,
} from "./read-only-app-mcp-boundaries";
import {
  EvidenceToolArgumentSchemaBoundarySchema,
  EvidenceToolFreshnessBoundarySchema,
  EvidenceToolRefusalEnvelopeBoundarySchema,
  EvidenceToolResponseEnvelopeBoundarySchema,
  EvidenceToolServiceDependencyBoundarySchema,
  EvidenceToolSourceAnchorBoundarySchema,
} from "./read-only-app-mcp-evidence-tool-dispatch-boundaries";
import { EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION } from "./read-only-app-mcp-evidence-tool-dispatch-constants";
import {
  EvidenceToolNoFinanceWriteBoundarySchema,
  EvidenceToolNoMutationBoundarySchema,
  EvidenceToolNoOpenAiModelBoundarySchema,
  EvidenceToolNoProviderExternalCallBoundarySchema,
  EvidenceToolNoRawDumpBoundarySchema,
} from "./read-only-app-mcp-evidence-tool-dispatch-guardrails";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

const EvidenceToolDispatchContractBaseObjectSchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    toolName: McpToolNameSchema,
    localProofOnly: trueLiteral,
    dispatchRuntimeImplemented: falseLiteral,
    routeAdapterDispatchEnabled: falseLiteral,
    argumentSchemaBoundary: EvidenceToolArgumentSchemaBoundarySchema,
    serviceDependencyBoundary: EvidenceToolServiceDependencyBoundarySchema,
    responseEnvelopeBoundary: EvidenceToolResponseEnvelopeBoundarySchema,
    refusalEnvelopeBoundary: EvidenceToolRefusalEnvelopeBoundarySchema,
    freshnessBoundary: EvidenceToolFreshnessBoundarySchema,
    sourceAnchorBoundary: EvidenceToolSourceAnchorBoundarySchema,
    noRawDumpBoundary: EvidenceToolNoRawDumpBoundarySchema,
    noMutationBoundary: EvidenceToolNoMutationBoundarySchema,
    noFinanceWriteBoundary: EvidenceToolNoFinanceWriteBoundarySchema,
    noProviderExternalCallBoundary:
      EvidenceToolNoProviderExternalCallBoundarySchema,
    noOpenAiModelBoundary: EvidenceToolNoOpenAiModelBoundarySchema,
    permittedNextActions: z.array(PermittedNextActionSchema).min(1),
  })
  .strict();

export const EvidenceToolDispatchContractBaseSchema =
  EvidenceToolDispatchContractBaseObjectSchema.superRefine((value, ctx) => {
    if (
      value.argumentSchemaBoundary.toolName !== value.toolName ||
      value.serviceDependencyBoundary.toolName !== value.toolName
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nested dispatch boundaries must describe the same tool.",
        path: ["toolName"],
      });
    }
  });

export function dispatchContractSchemaFor<
  ContractKind extends string,
  ToolName extends McpToolName,
>(contractKind: ContractKind, toolName: ToolName) {
  return EvidenceToolDispatchContractBaseObjectSchema.extend({
    contractKind: z.literal(contractKind),
    toolName: z.literal(toolName),
  })
    .strict()
    .superRefine((value, ctx) => {
      if (
        value.argumentSchemaBoundary.toolName !== value.toolName ||
        value.serviceDependencyBoundary.toolName !== value.toolName
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nested dispatch boundaries must describe the same tool.",
          path: ["toolName"],
        });
      }
    });
}

export const SearchEvidenceDispatchContractSchema = dispatchContractSchemaFor(
  "SearchEvidenceDispatchContract",
  "search_evidence",
);
export const FetchEvidenceCardDispatchContractSchema =
  dispatchContractSchemaFor(
    "FetchEvidenceCardDispatchContract",
    "fetch_evidence_card",
  );
export const FetchSourceAnchorDispatchContractSchema =
  dispatchContractSchemaFor(
    "FetchSourceAnchorDispatchContract",
    "fetch_source_anchor",
  );
export const FetchDocumentMapDispatchContractSchema = dispatchContractSchemaFor(
  "FetchDocumentMapDispatchContract",
  "fetch_document_map",
);
export const FetchSourceCoverageDispatchContractSchema =
  dispatchContractSchemaFor(
    "FetchSourceCoverageDispatchContract",
    "fetch_source_coverage",
  );
export const FetchCompanyPostureDispatchContractSchema =
  dispatchContractSchemaFor(
    "FetchCompanyPostureDispatchContract",
    "fetch_company_posture",
  );
export const FetchCapabilityBoundariesDispatchContractSchema =
  dispatchContractSchemaFor(
    "FetchCapabilityBoundariesDispatchContract",
    "fetch_capability_boundaries",
  );

export type SearchEvidenceDispatchContract = z.infer<
  typeof SearchEvidenceDispatchContractSchema
>;
export type FetchEvidenceCardDispatchContract = z.infer<
  typeof FetchEvidenceCardDispatchContractSchema
>;
export type FetchSourceAnchorDispatchContract = z.infer<
  typeof FetchSourceAnchorDispatchContractSchema
>;
export type FetchDocumentMapDispatchContract = z.infer<
  typeof FetchDocumentMapDispatchContractSchema
>;
export type FetchSourceCoverageDispatchContract = z.infer<
  typeof FetchSourceCoverageDispatchContractSchema
>;
export type FetchCompanyPostureDispatchContract = z.infer<
  typeof FetchCompanyPostureDispatchContractSchema
>;
export type FetchCapabilityBoundariesDispatchContract = z.infer<
  typeof FetchCapabilityBoundariesDispatchContractSchema
>;
