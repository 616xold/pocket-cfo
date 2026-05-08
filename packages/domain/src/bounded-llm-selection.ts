import { z } from "zod";
import {
  EvidenceIndexFreshnessPostureSchema,
  EvidenceIndexLimitationPostureSchema,
  PermittedNextActionSchema,
} from "./evidence-index-common";
import { FinanceCompanyKeySchema } from "./finance-twin";
import {
  EvidenceToolCitationSchema,
  EvidenceToolResponseSchema,
} from "./evidence-tool-common";
import { SafeSourceExcerptSchema } from "./evidence-tool-results";
import {
  BOUNDED_LLM_ORCHESTRATION_SCHEMA_VERSION,
  BoundedLlmAuditEventSchema,
} from "./bounded-llm-common";

export const BOUNDED_LLM_RAW_FULL_FILE_DUMP_FIELD_NAMES = [
  "rawFullText",
  "rawFileText",
  "fullText",
  "fullFileText",
  "fileContents",
  "unboundedText",
  "originalFullText",
  "sourceText",
  "rawMarkdown",
  "documentText",
  "pageTextDump",
] as const;

const RAW_FULL_FILE_DUMP_FIELD_NAMES = new Set<string>(
  BOUNDED_LLM_RAW_FULL_FILE_DUMP_FIELD_NAMES,
);

export const EvidenceSelectionResultSchema = z
  .object({
    schemaVersion: z.literal(BOUNDED_LLM_ORCHESTRATION_SCHEMA_VERSION),
    companyKey: FinanceCompanyKeySchema,
    normalizedQuery: z.string().min(1),
    toolResponses: z.array(EvidenceToolResponseSchema).min(1),
    selectedEvidenceCardIds: z.array(z.string().min(1)),
    selectedSourceAnchorIds: z.array(z.string().min(1)),
    selectedDocumentMapIds: z.array(z.string().min(1)),
    selectedCoverageSourceIds: z.array(z.string().min(1)),
    selectedCitations: z.array(EvidenceToolCitationSchema).min(1),
    safeExcerpts: z.array(SafeSourceExcerptSchema),
    freshness: EvidenceIndexFreshnessPostureSchema,
    limitations: z.array(EvidenceIndexLimitationPostureSchema).min(1),
    permittedNextActions: z.array(PermittedNextActionSchema).min(1),
    unsupportedReasons: z.array(z.string().min(1)),
    conflictingEvidenceDetected: z.literal(false),
    selectedEvidenceOnly: z.literal(true),
    promptInjectionTextTreatedAsData: z.literal(true),
    fullFileDumpsReturned: z.literal(false),
    audit: BoundedLlmAuditEventSchema,
  })
  .superRefine((selection, ctx) => {
    for (const [index, response] of selection.toolResponses.entries()) {
      if (containsBoundedLlmRawFullFileDumpField(response.result)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Evidence selection cannot carry raw full-file-dump-like response fields.",
          path: ["toolResponses", index, "result"],
        });
      }
    }
  });

export type EvidenceSelectionResult = z.infer<
  typeof EvidenceSelectionResultSchema
>;
export type BoundedLlmRawFullFileDumpField =
  (typeof BOUNDED_LLM_RAW_FULL_FILE_DUMP_FIELD_NAMES)[number];

export function containsBoundedLlmRawFullFileDumpField(
  value: unknown,
): boolean {
  return containsRawFullFileDumpField(value, new WeakSet<object>());
}

function containsRawFullFileDumpField(
  value: unknown,
  seen: WeakSet<object>,
): boolean {
  if (Array.isArray(value)) {
    return value.some((entry) => containsRawFullFileDumpField(entry, seen));
  }
  if (!value || typeof value !== "object") return false;
  if (seen.has(value)) return false;
  seen.add(value);

  const record = value as Record<string, unknown>;
  if (
    Object.keys(record).some((key) => RAW_FULL_FILE_DUMP_FIELD_NAMES.has(key))
  ) {
    return true;
  }

  return Object.values(record).some((entry) =>
    containsRawFullFileDumpField(entry, seen),
  );
}
