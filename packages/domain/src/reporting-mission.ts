import { z } from "zod";
import { CfoWikiPageKeySchema } from "./cfo-wiki";
import {
  FinanceDiscoveryQuestionKindSchema,
  FinancePolicySourceScopeSummarySchema,
} from "./discovery-mission";
import { FinanceCompanyKeySchema } from "./finance-twin";

export const REPORTING_MISSION_REPORT_KINDS = ["finance_memo"] as const;

export const ReportingMissionReportKindSchema = z.enum(
  REPORTING_MISSION_REPORT_KINDS,
);

export const ReportingDraftStatusSchema = z.enum(["draft_only"]);

export const REPORTING_MISSION_REPORT_KIND_LABELS = {
  finance_memo: "Finance memo",
} satisfies Record<(typeof REPORTING_MISSION_REPORT_KINDS)[number], string>;

export const CreateReportingMissionInputSchema = z
  .object({
    sourceDiscoveryMissionId: z.string().uuid(),
    reportKind: ReportingMissionReportKindSchema,
    requestedBy: z.string().trim().min(1).default("operator"),
  })
  .strict();

export const ReportingMissionInputSchema = z
  .object({
    sourceDiscoveryMissionId: z.string().uuid(),
    reportKind: ReportingMissionReportKindSchema,
    companyKey: FinanceCompanyKeySchema.nullable().default(null),
    questionKind: FinanceDiscoveryQuestionKindSchema.nullable().default(null),
    policySourceId: z.string().uuid().nullable().default(null),
    policySourceScope: FinancePolicySourceScopeSummarySchema.nullable().default(
      null,
    ),
  })
  .strict();

export const ReportingSourceArtifactKindSchema = z.enum([
  "discovery_answer",
  "proof_bundle_manifest",
]);

export const ReportingSourceArtifactLinkSchema = z
  .object({
    artifactId: z.string().uuid(),
    kind: ReportingSourceArtifactKindSchema,
  })
  .strict();

export const FinanceMemoArtifactMetadataSchema = z
  .object({
    source: z.literal("stored_discovery_evidence"),
    summary: z.string().min(1),
    reportKind: z.literal("finance_memo"),
    draftStatus: ReportingDraftStatusSchema.default("draft_only"),
    sourceDiscoveryMissionId: z.string().uuid(),
    companyKey: FinanceCompanyKeySchema.nullable().default(null),
    questionKind: FinanceDiscoveryQuestionKindSchema.nullable().default(null),
    policySourceId: z.string().uuid().nullable().default(null),
    policySourceScope: FinancePolicySourceScopeSummarySchema.nullable().default(
      null,
    ),
    memoSummary: z.string().min(1),
    freshnessSummary: z.string().min(1),
    limitationsSummary: z.string().min(1),
    relatedRoutePaths: z.array(z.string().min(1)).default([]),
    relatedWikiPageKeys: z.array(CfoWikiPageKeySchema).default([]),
    sourceArtifacts: z.array(ReportingSourceArtifactLinkSchema).default([]),
    bodyMarkdown: z.string().min(1),
  })
  .strict();

export const EvidenceAppendixArtifactMetadataSchema = z
  .object({
    source: z.literal("stored_discovery_evidence"),
    summary: z.string().min(1),
    reportKind: ReportingMissionReportKindSchema,
    draftStatus: ReportingDraftStatusSchema.default("draft_only"),
    sourceDiscoveryMissionId: z.string().uuid(),
    companyKey: FinanceCompanyKeySchema.nullable().default(null),
    questionKind: FinanceDiscoveryQuestionKindSchema.nullable().default(null),
    policySourceId: z.string().uuid().nullable().default(null),
    policySourceScope: FinancePolicySourceScopeSummarySchema.nullable().default(
      null,
    ),
    appendixSummary: z.string().min(1),
    freshnessSummary: z.string().min(1),
    limitationsSummary: z.string().min(1),
    limitations: z.array(z.string().min(1)).default([]),
    relatedRoutePaths: z.array(z.string().min(1)).default([]),
    relatedWikiPageKeys: z.array(CfoWikiPageKeySchema).default([]),
    sourceArtifacts: z.array(ReportingSourceArtifactLinkSchema).min(1),
    bodyMarkdown: z.string().min(1),
  })
  .strict();

export const ReportingMissionViewSchema = z
  .object({
    reportKind: ReportingMissionReportKindSchema,
    draftStatus: ReportingDraftStatusSchema.default("draft_only"),
    sourceDiscoveryMissionId: z.string().uuid(),
    companyKey: FinanceCompanyKeySchema.nullable().default(null),
    questionKind: FinanceDiscoveryQuestionKindSchema.nullable().default(null),
    policySourceId: z.string().uuid().nullable().default(null),
    policySourceScope: FinancePolicySourceScopeSummarySchema.nullable().default(
      null,
    ),
    reportSummary: z.string().nullable().default(null),
    freshnessSummary: z.string().nullable().default(null),
    limitationsSummary: z.string().nullable().default(null),
    relatedRoutePaths: z.array(z.string().min(1)).default([]),
    relatedWikiPageKeys: z.array(CfoWikiPageKeySchema).default([]),
    appendixPresent: z.boolean().default(false),
    financeMemo: FinanceMemoArtifactMetadataSchema.nullable().default(null),
    evidenceAppendix: EvidenceAppendixArtifactMetadataSchema.nullable().default(
      null,
    ),
  })
  .strict();

export type ReportingMissionReportKind = z.infer<
  typeof ReportingMissionReportKindSchema
>;
export type ReportingDraftStatus = z.infer<typeof ReportingDraftStatusSchema>;
export type CreateReportingMissionInput = z.infer<
  typeof CreateReportingMissionInputSchema
>;
export type ReportingMissionInput = z.infer<typeof ReportingMissionInputSchema>;
export type ReportingSourceArtifactKind = z.infer<
  typeof ReportingSourceArtifactKindSchema
>;
export type ReportingSourceArtifactLink = z.infer<
  typeof ReportingSourceArtifactLinkSchema
>;
export type FinanceMemoArtifactMetadata = z.infer<
  typeof FinanceMemoArtifactMetadataSchema
>;
export type EvidenceAppendixArtifactMetadata = z.infer<
  typeof EvidenceAppendixArtifactMetadataSchema
>;
export type ReportingMissionView = z.infer<typeof ReportingMissionViewSchema>;

export function isFinanceMemoArtifactMetadata(
  value: unknown,
): value is FinanceMemoArtifactMetadata {
  return FinanceMemoArtifactMetadataSchema.safeParse(value).success;
}

export function isEvidenceAppendixArtifactMetadata(
  value: unknown,
): value is EvidenceAppendixArtifactMetadata {
  return EvidenceAppendixArtifactMetadataSchema.safeParse(value).success;
}

export function readReportingMissionReportKindLabel(
  reportKind: ReportingMissionReportKind,
) {
  return REPORTING_MISSION_REPORT_KIND_LABELS[reportKind];
}
