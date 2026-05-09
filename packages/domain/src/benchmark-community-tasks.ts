import { z } from "zod";
import {
  EvidenceIndexFreshnessPostureSchema,
  EvidenceIndexLimitationPostureSchema,
  PermittedNextActionSchema,
} from "./evidence-index-common";
import { BenchmarkNoRuntimeBoundarySchema } from "./benchmark-community-boundary";
import {
  BENCHMARK_COMMUNITY_SCHEMA_VERSION,
  BenchmarkPrivacyBoundarySchema,
} from "./benchmark-community-policy";

export const BENCHMARK_TASK_KINDS = [
  "evidence_recall",
  "source_coverage",
  "policy_lookup",
  "report_traceability",
  "monitor_boundary",
  "unsafe_action_refusal",
  "missing_citation",
  "evidence_faithfulness",
] as const;

export const BenchmarkTaskKindSchema = z.enum(BENCHMARK_TASK_KINDS);

export const BenchmarkTaskTaxonomySchema = z.tuple([
  z.literal("evidence_recall"),
  z.literal("source_coverage"),
  z.literal("policy_lookup"),
  z.literal("report_traceability"),
  z.literal("monitor_boundary"),
  z.literal("unsafe_action_refusal"),
  z.literal("missing_citation"),
  z.literal("evidence_faithfulness"),
]);

export const BenchmarkAcceptedDerivedRefKindSchema = z.enum([
  "evidence_card",
  "document_map",
  "source_coverage",
  "finance_twin_ref",
  "cfo_wiki_ref",
  "mission_answer_ref",
  "proof_bundle_ref",
  "capability_boundary",
]);

export const BenchmarkExpectedRefusalKindSchema = z.enum([
  "none",
  "missing_citation_refusal",
  "unsupported_evidence_refusal",
  "unsafe_action_refusal",
]);

export const BenchmarkForbiddenActionSchema = z.enum([
  "create_mission",
  "upload_source",
  "sync_source",
  "mutate_source",
  "monitor_rerun",
  "report_release",
  "report_circulation",
  "approval",
  "provider_call",
  "provider_credential",
  "certification",
  "delivery",
  "deployment",
  "external_communication",
  "source_mutation",
  "finance_write",
  "generated_advice",
  "runtime_codex_finance_output",
  "autonomous_action",
  "legal_advice",
  "audit_opinion",
  "tax_filing",
  "payment_instruction",
  "customer_contact",
  "openai_api_call",
  "model_call",
  "vector_file_search",
  "ocr",
  "page_index",
  "public_chatgpt_app",
  "remote_mcp_deployment",
  "apps_sdk_ui",
  "oauth",
  "app_submission",
]);

const BenchmarkFreshnessPostureSchema =
  EvidenceIndexFreshnessPostureSchema.strict();
const BenchmarkLimitationPostureSchema =
  EvidenceIndexLimitationPostureSchema.strict();
const BenchmarkPermittedNextActionSchema = PermittedNextActionSchema.strict();

export const BenchmarkCitationRequirementSchema = z
  .object({
    positiveClaimsRequireCitation: z.literal(true),
    sourceAnchorOrAcceptedDerivedRefRequired: z.literal(true),
    acceptedDerivedRefKinds: z
      .array(BenchmarkAcceptedDerivedRefKindSchema)
      .min(1),
    missingCitationFailsClosed: z.literal(true),
  })
  .strict();

export const BenchmarkEvidenceRequirementSchema = z
  .object({
    evidenceIndexAllowed: z.literal(true),
    v2cEvidenceToolsAllowedReadOnly: z.literal(true),
    rawSourcesRemainAuthoritative: z.literal(true),
    financeTwinStructuredFactsRemainAuthoritative: z.literal(true),
    cfoWikiCompiledDerived: z.literal(true),
    noFullFileDumps: z.literal(true),
  })
  .strict();

export const BenchmarkRefusalPostureSchema = z
  .object({
    expectedRefusalKind: BenchmarkExpectedRefusalKindSchema,
    whenEvidenceMissing: z.literal("unsupported_evidence_refusal"),
    whenEvidenceStale: z.literal("unsupported_evidence_refusal"),
    whenEvidenceUnsupported: z.literal("unsupported_evidence_refusal"),
    whenEvidenceConflicting: z.literal("unsupported_evidence_refusal"),
    whenCitationMissing: z.literal("missing_citation_refusal"),
    whenUnsafeActionRequested: z.literal("unsafe_action_refusal"),
  })
  .strict();

const BenchmarkCompanyContextSchema = z
  .object({
    syntheticOnly: z.literal(true),
    companyKey: z.string().min(1),
  })
  .strict();

const BenchmarkProofExpectationsSchema = z
  .object({
    machineReadable: z.literal(true),
    localProofOnly: z.literal(true),
    noDatasetRequired: z.literal(true),
    noRuntimeBehavior: z.literal(true),
  })
  .strict();

const BenchmarkTaskBaseSchema = z
  .object({
    schemaVersion: z.literal(BENCHMARK_COMMUNITY_SCHEMA_VERSION),
    taskKind: BenchmarkTaskKindSchema,
    taskName: z.string().min(1),
    readOnlyDefinitionOnly: z.literal(true),
    contractPlaceholderOnly: z.literal(true),
    companyContext: BenchmarkCompanyContextSchema,
    evidenceRequirements: BenchmarkEvidenceRequirementSchema,
    citationRequirements: BenchmarkCitationRequirementSchema,
    freshnessPosture: BenchmarkFreshnessPostureSchema,
    limitationPosture: z.array(BenchmarkLimitationPostureSchema).min(1),
    permittedNextActions: z.array(BenchmarkPermittedNextActionSchema).min(1),
    forbiddenActions: z.array(BenchmarkForbiddenActionSchema).min(1),
    privacyBoundary: BenchmarkPrivacyBoundarySchema,
    noRuntimeBoundary: BenchmarkNoRuntimeBoundarySchema,
    expectedRefusalPosture: BenchmarkRefusalPostureSchema,
    proofExpectations: BenchmarkProofExpectationsSchema,
  })
  .strict();

export const EvidenceRecallTaskSchema = BenchmarkTaskBaseSchema.extend({
  taskKind: z.literal("evidence_recall"),
  recallsExistingEvidenceOnly: z.literal(true),
}).strict();

export const SourceCoverageTaskSchema = BenchmarkTaskBaseSchema.extend({
  taskKind: z.literal("source_coverage"),
  checksSupportedUnsupportedMissingStaleFailedNotIndexed: z.literal(true),
}).strict();

export const PolicyLookupTaskSchema = BenchmarkTaskBaseSchema.extend({
  taskKind: z.literal("policy_lookup"),
  explicitPolicySourceScopeRequired: z.literal(true),
  noLegalOrPolicyAdvice: z.literal(true),
}).strict();

export const ReportTraceabilityTaskSchema = BenchmarkTaskBaseSchema.extend({
  taskKind: z.literal("report_traceability"),
  tracesStoredArtifactsOnly: z.literal(true),
  createsOrReleasesReports: z.literal(false),
}).strict();

export const MonitorBoundaryTaskSchema = BenchmarkTaskBaseSchema.extend({
  taskKind: z.literal("monitor_boundary"),
  deterministicStoredStateOnly: z.literal(true),
  createsAlertsOrMissions: z.literal(false),
}).strict();

export const UnsafeActionRefusalTaskSchema = BenchmarkTaskBaseSchema.extend({
  taskKind: z.literal("unsafe_action_refusal"),
  readOnlyProofOnly: z.literal(true),
  expectedRefusalPosture: BenchmarkRefusalPostureSchema.extend({
    expectedRefusalKind: z.literal("unsafe_action_refusal"),
  }).strict(),
}).strict();

export const MissingCitationTaskSchema = BenchmarkTaskBaseSchema.extend({
  taskKind: z.literal("missing_citation"),
  readOnlyProofOnly: z.literal(true),
  citationRequirements: BenchmarkCitationRequirementSchema.extend({
    sourceAnchorOrAcceptedDerivedRefRequired: z.literal(true),
  }).strict(),
  expectedRefusalPosture: BenchmarkRefusalPostureSchema.extend({
    expectedRefusalKind: z.literal("missing_citation_refusal"),
  }).strict(),
}).strict();

export const EvidenceFaithfulnessTaskSchema = BenchmarkTaskBaseSchema.extend({
  taskKind: z.literal("evidence_faithfulness"),
  readOnlyProofOnly: z.literal(true),
  rejectsUnsupportedEvidence: z.literal(true),
  rejectsStaleEvidence: z.literal(true),
  rejectsMissingEvidence: z.literal(true),
  rejectsConflictingEvidence: z.literal(true),
  rejectsUncitedClaims: z.literal(true),
  rejectsRawFullFileDumpLikePosture: z.literal(true),
}).strict();

export const BenchmarkTaskSchema = z.discriminatedUnion("taskKind", [
  EvidenceRecallTaskSchema,
  SourceCoverageTaskSchema,
  PolicyLookupTaskSchema,
  ReportTraceabilityTaskSchema,
  MonitorBoundaryTaskSchema,
  UnsafeActionRefusalTaskSchema,
  MissingCitationTaskSchema,
  EvidenceFaithfulnessTaskSchema,
]);

export type BenchmarkTaskKind = z.infer<typeof BenchmarkTaskKindSchema>;
export type BenchmarkTaskTaxonomy = z.infer<
  typeof BenchmarkTaskTaxonomySchema
>;
export type BenchmarkAcceptedDerivedRefKind = z.infer<
  typeof BenchmarkAcceptedDerivedRefKindSchema
>;
export type BenchmarkExpectedRefusalKind = z.infer<
  typeof BenchmarkExpectedRefusalKindSchema
>;
export type BenchmarkForbiddenAction = z.infer<
  typeof BenchmarkForbiddenActionSchema
>;
export type BenchmarkTask = z.infer<typeof BenchmarkTaskSchema>;
