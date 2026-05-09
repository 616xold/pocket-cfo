import { z } from "zod";
import {
  ArchitectureMapSchema,
  BenchmarkNoRuntimeBoundarySchema,
  ContributorChallengeSchema,
} from "./benchmark-community-boundary";
import {
  BENCHMARK_COMMUNITY_SCHEMA_VERSION,
  BenchmarkPrivacyBoundarySchema,
  SafeDemoDataPolicySchema,
  SyntheticFinanceSourcePolicySchema,
} from "./benchmark-community-policy";
import { BenchmarkTaskTaxonomySchema } from "./benchmark-community-tasks";

export const COMMUNITY_PACK_MANIFEST_FORBIDDEN_DATA_FIELDS = [
  "dataFiles",
  "sourcePackFiles",
  "evalDatasetFiles",
  "fixtureFiles",
  "datasetFiles",
  "sampleDataFiles",
  "publicDemoDataFiles",
  "publicSourcePacks",
  "sourcePacks",
  "sourcePackPaths",
  "fixturePaths",
  "evalDatasetUris",
  "benchmarkCases",
  "caseFiles",
  "examples",
  "records",
  "externalUrls",
  "sourceText",
  "rawFullText",
  "rawMarkdown",
  "documentText",
  "pageTextDump",
] as const;

export const BenchmarkCaseSchema = z
  .object({
    schemaVersion: z.literal(BENCHMARK_COMMUNITY_SCHEMA_VERSION),
    placeholderOnly: z.literal(true),
    noBenchmarkCasesCheckedIn: z.literal(true),
    noDatasetFile: z.literal(true),
    noFixtureFile: z.literal(true),
    noSampleDataFile: z.literal(true),
    futureCaseRequiresSafeDemoDataPolicy: z.literal(true),
    futureCaseRequiresSyntheticFinanceSourcePolicy: z.literal(true),
  })
  .strict();

export const CommunityPackManifestValidationPostureSchema = z
  .object({
    directProofCommandOnly: z.literal(true),
    noPackageScriptOrSmokeAlias: z.literal(true),
    inMemorySyntheticExamplesOnly: z.literal(true),
    noDataFileAliasesAllowed: z.literal(true),
  })
  .strict();

export const CommunityPackManifestSchema = z
  .object({
    schemaVersion: z.literal(BENCHMARK_COMMUNITY_SCHEMA_VERSION),
    manifestKind: z.literal("CommunityPackManifest"),
    owningFinancePlan: z.literal("FP-0086"),
    describesFutureCommunityPackOnly: z.literal(true),
    containsNoDataOrSourcePackReferences: z.literal(true),
    safeDemoDataPolicy: SafeDemoDataPolicySchema,
    syntheticFinanceSourcePolicy: SyntheticFinanceSourcePolicySchema,
    allowedTaskKinds: BenchmarkTaskTaxonomySchema,
    benchmarkCase: BenchmarkCaseSchema,
    privacyBoundary: BenchmarkPrivacyBoundarySchema,
    noRuntimeBoundary: BenchmarkNoRuntimeBoundarySchema,
    contributorChallenge: ContributorChallengeSchema,
    architectureMap: ArchitectureMapSchema,
    validationPosture: CommunityPackManifestValidationPostureSchema,
  })
  .strict();

export type BenchmarkCase = z.infer<typeof BenchmarkCaseSchema>;
export type CommunityPackManifest = z.infer<typeof CommunityPackManifestSchema>;
export type CommunityPackManifestForbiddenDataField =
  (typeof COMMUNITY_PACK_MANIFEST_FORBIDDEN_DATA_FIELDS)[number];
