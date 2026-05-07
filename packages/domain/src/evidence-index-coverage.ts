import { z } from "zod";
import { CfoWikiDocumentRoleSchema } from "./cfo-wiki";
import { FinanceCompanyKeySchema } from "./finance-twin";
import { SourceKindSchema } from "./source-registry";
import {
  EvidenceIndexCoverageStatusSchema,
  EvidenceIndexExtractionMethodSchema,
  EvidenceIndexFreshnessPostureSchema,
  EvidenceIndexLimitationPostureSchema,
} from "./evidence-index-common";

export const SourceCoverageMatrixEntrySchema = z.object({
  sourceId: z.string().uuid(),
  sourceSnapshotId: z.string().uuid().nullable(),
  sourceFileId: z.string().uuid().nullable(),
  sourceKind: SourceKindSchema,
  documentRole: CfoWikiDocumentRoleSchema.nullable(),
  mediaType: z.string().min(1).nullable(),
  coverageStatus: EvidenceIndexCoverageStatusSchema,
  supportedMethods: z.array(EvidenceIndexExtractionMethodSchema),
  unsupportedMethods: z.array(EvidenceIndexExtractionMethodSchema),
  freshness: EvidenceIndexFreshnessPostureSchema,
  limitations: z.array(EvidenceIndexLimitationPostureSchema),
});

export const SourceCoverageMatrixSchema = z.object({
  companyKey: FinanceCompanyKeySchema,
  generatedAt: z.string().datetime({ offset: true }),
  entries: z.array(SourceCoverageMatrixEntrySchema),
  capabilityBoundaries: z.array(EvidenceIndexLimitationPostureSchema),
});

export type SourceCoverageMatrixEntry = z.infer<
  typeof SourceCoverageMatrixEntrySchema
>;
export type SourceCoverageMatrix = z.infer<typeof SourceCoverageMatrixSchema>;
