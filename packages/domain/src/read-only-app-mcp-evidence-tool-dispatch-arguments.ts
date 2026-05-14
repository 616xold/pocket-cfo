import { z } from "zod";
import { FinanceCompanyKeySchema } from "./finance-twin";
import type { McpToolName } from "./read-only-app-mcp-boundaries";
import {
  EVIDENCE_TOOL_DISPATCH_ARGUMENT_FIELDS_BY_TOOL,
  EVIDENCE_TOOL_DISPATCH_OPTIONAL_ARGUMENTS_BY_TOOL,
  EVIDENCE_TOOL_DISPATCH_REQUIRED_ARGUMENTS_BY_TOOL,
} from "./read-only-app-mcp-evidence-tool-dispatch-constants";

export const EvidenceToolDispatchArgumentSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    documentMapId: z.string().min(1).optional(),
    evidenceCardId: z.string().min(1).optional(),
    limit: z.number().int().positive().max(25).optional(),
    periodKey: z.string().min(1).optional(),
    query: z.string().min(1).optional(),
    sourceAnchorId: z.string().min(1).optional(),
    sourceId: z.string().min(1).optional(),
  })
  .strict();

export const SearchEvidenceDispatchArgumentsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    limit: z.number().int().positive().max(25).optional(),
    query: z.string().min(1),
  })
  .strict();

export const FetchEvidenceCardDispatchArgumentsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    evidenceCardId: z.string().min(1),
  })
  .strict();

export const FetchSourceAnchorDispatchArgumentsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    sourceAnchorId: z.string().min(1),
  })
  .strict();

export const FetchDocumentMapDispatchArgumentsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    documentMapId: z.string().min(1),
  })
  .strict();

export const FetchSourceCoverageDispatchArgumentsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    sourceId: z.string().min(1),
  })
  .strict();

export const FetchCompanyPostureDispatchArgumentsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
    periodKey: z.string().min(1).optional(),
  })
  .strict();

export const FetchCapabilityBoundariesDispatchArgumentsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
  })
  .strict();

export const EVIDENCE_TOOL_DISPATCH_ARGUMENT_SCHEMAS_BY_TOOL = {
  fetch_capability_boundaries: FetchCapabilityBoundariesDispatchArgumentsSchema,
  fetch_company_posture: FetchCompanyPostureDispatchArgumentsSchema,
  fetch_document_map: FetchDocumentMapDispatchArgumentsSchema,
  fetch_evidence_card: FetchEvidenceCardDispatchArgumentsSchema,
  fetch_source_anchor: FetchSourceAnchorDispatchArgumentsSchema,
  fetch_source_coverage: FetchSourceCoverageDispatchArgumentsSchema,
  search_evidence: SearchEvidenceDispatchArgumentsSchema,
} as const satisfies Record<McpToolName, z.ZodType<Record<string, unknown>>>;

export function argumentFields(toolName: McpToolName) {
  return [...EVIDENCE_TOOL_DISPATCH_ARGUMENT_FIELDS_BY_TOOL[toolName]];
}

export function requiredArguments(toolName: McpToolName) {
  return [...EVIDENCE_TOOL_DISPATCH_REQUIRED_ARGUMENTS_BY_TOOL[toolName]];
}

export function optionalArguments(toolName: McpToolName) {
  return [...EVIDENCE_TOOL_DISPATCH_OPTIONAL_ARGUMENTS_BY_TOOL[toolName]];
}
