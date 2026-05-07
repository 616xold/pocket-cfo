import { z } from "zod";
import { CfoWikiPageKeySchema, CfoWikiRefKindSchema } from "./cfo-wiki";
import { FinanceCompanyKeySchema } from "./finance-twin";
import {
  EvidenceIndexExtractionMethodSchema,
  EvidenceIndexFreshnessPostureSchema,
  EvidenceIndexIdSchema,
  EvidenceIndexLimitationPostureSchema,
  PermittedNextActionSchema,
} from "./evidence-index-common";
import { SourceAnchorSchema } from "./evidence-index-document";

export const EvidenceIndexFinanceTwinRefSchema = z.object({
  targetKind: z.string().min(1),
  targetId: z.string().min(1),
  routePath: z.string().min(1).optional(),
  summary: z.string().min(1),
});

export const EvidenceIndexWikiRefSchema = z.object({
  pageKey: CfoWikiPageKeySchema,
  refKind: CfoWikiRefKindSchema.optional(),
  locator: z.string().min(1).nullable().optional(),
  summary: z.string().min(1),
});

export const EvidenceTraceSchema = z.object({
  id: EvidenceIndexIdSchema,
  companyKey: FinanceCompanyKeySchema,
  relationshipKind: z.enum([
    "raw_source_to_anchor",
    "anchor_to_document_map",
    "anchor_to_evidence_claim",
    "finance_twin_ref_to_claim",
    "cfo_wiki_ref_to_claim",
    "claim_to_evidence_card",
  ]),
  fromKind: z.string().min(1),
  fromId: z.string().min(1),
  toKind: z.string().min(1),
  toId: z.string().min(1),
  sourceDocumentId: EvidenceIndexIdSchema.nullable(),
  sourceAnchorId: EvidenceIndexIdSchema.nullable(),
  claimId: EvidenceIndexIdSchema.nullable(),
  summary: z.string().min(1),
  limitations: z.array(EvidenceIndexLimitationPostureSchema),
});

export const EvidenceClaimSchema = z.object({
  id: EvidenceIndexIdSchema,
  companyKey: FinanceCompanyKeySchema,
  claimType: z.string().min(1),
  claimText: z.string().min(1),
  authorityBasis: z.enum([
    "raw_source_anchor",
    "finance_twin_ref",
    "cfo_wiki_ref",
    "limitation_boundary",
    "mixed_refs",
  ]),
  extractionMethod: EvidenceIndexExtractionMethodSchema,
  sourceAnchorIds: z.array(EvidenceIndexIdSchema),
  financeTwinRefs: z.array(EvidenceIndexFinanceTwinRefSchema),
  wikiRefs: z.array(EvidenceIndexWikiRefSchema),
  freshness: EvidenceIndexFreshnessPostureSchema,
  limitations: z.array(EvidenceIndexLimitationPostureSchema),
  confidence: z.object({
    method: EvidenceIndexExtractionMethodSchema,
    summary: z.string().min(1),
  }),
});

const EvidenceConfidenceSchema = z.object({
  method: EvidenceIndexExtractionMethodSchema,
  summary: z.string().min(1),
});

export const EvidenceCardSchema = z.object({
  id: EvidenceIndexIdSchema,
  companyKey: FinanceCompanyKeySchema,
  claimType: z.string().min(1),
  claimText: z.string().min(1),
  evidence: z.object({
    sourceAnchors: z.array(SourceAnchorSchema),
    financeTwinRefs: z.array(EvidenceIndexFinanceTwinRefSchema),
    wikiRefs: z.array(EvidenceIndexWikiRefSchema),
    evidenceTraces: z.array(EvidenceTraceSchema),
  }),
  sourceAnchors: z.array(SourceAnchorSchema),
  financeTwinRefs: z.array(EvidenceIndexFinanceTwinRefSchema),
  wikiRefs: z.array(EvidenceIndexWikiRefSchema),
  freshness: EvidenceIndexFreshnessPostureSchema,
  confidence: EvidenceConfidenceSchema,
  extractionMethod: EvidenceIndexExtractionMethodSchema,
  limitations: z.array(EvidenceIndexLimitationPostureSchema),
  permittedNextActions: z.array(PermittedNextActionSchema),
  forbiddenActions: z.array(z.string().min(1)),
});

export type EvidenceIndexFinanceTwinRef = z.infer<
  typeof EvidenceIndexFinanceTwinRefSchema
>;
export type EvidenceIndexWikiRef = z.infer<typeof EvidenceIndexWikiRefSchema>;
export type EvidenceClaim = z.infer<typeof EvidenceClaimSchema>;
export type EvidenceTrace = z.infer<typeof EvidenceTraceSchema>;
export type EvidenceCard = z.infer<typeof EvidenceCardSchema>;
