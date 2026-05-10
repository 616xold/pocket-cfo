import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ArchitectureMapSchema,
  BENCHMARK_AUTHORITY_LAYERS,
  BENCHMARK_COMMUNITY_SCHEMA_VERSION,
  BENCHMARK_TASK_KINDS,
  BenchmarkCaseSchema,
  BenchmarkNoRuntimeBoundarySchema,
  BenchmarkProofSchema,
  COMMUNITY_PACK_MANIFEST_FORBIDDEN_DATA_FIELDS,
  BenchmarkTaskKindSchema,
  BenchmarkTaskTaxonomySchema,
  CommunityPackManifestSchema,
  ContributorChallengeSchema,
  EvidenceFaithfulnessTaskSchema,
  EvidenceRecallTaskSchema,
  MissingCitationTaskSchema,
  PolicyLookupTaskSchema,
  ReportTraceabilityTaskSchema,
  SafeDemoDataPolicySchema,
  SourceCoverageTaskSchema,
  SyntheticFinanceSourcePolicySchema,
  UnsafeActionRefusalTaskSchema,
  MonitorBoundaryTaskSchema,
} from "./benchmark-community";
import {
  AppProofSchema,
  buildReadOnlyChatGptAppMcpProof,
} from "./read-only-app-mcp";

const checkedAt = "2026-05-09T00:30:00.000Z";
const FP0088_PLAN_FILE =
  "FP-0088-read-only-chatgpt-app-mcp-premium-ui-security-master-plan.md";
const FP0089_PLAN_FILE =
  "FP-0089-read-only-chatgpt-app-mcp-premium-ui-design-system-master-plan.md";
const FP0090_PLAN_FILE =
  "FP-0090-read-only-chatgpt-app-mcp-premium-ui-implementation-master-plan.md";
const FP0091_PLAN_FILE =
  "FP-0091-read-only-chatgpt-app-mcp-premium-ui-component-foundation.md";
const FP0092_PLAN_FILE =
  "FP-0092-read-only-chatgpt-app-mcp-premium-ui-composition-accessibility-foundation.md";
const FP0093_PLAN_FILE =
  "FP-0093-read-only-chatgpt-app-mcp-premium-ui-preview-route-master-plan.md";
const FP0094_PLAN_FILE =
  "FP-0094-read-only-chatgpt-app-mcp-premium-ui-preview-route-foundation.md";

function safeDemoDataPolicy() {
  return {
    firstGate: true,
    forbiddenFinanceData: [
      "customer_data",
      "vendor_data",
      "payroll_data",
      "tax_data",
      "bank_data",
      "legal_data",
      "board_data",
      "lender_data",
    ],
    forbiddenPrivateArtifacts: [
      "credentials",
      "tokens",
      "secrets",
      "oauth_material",
      "provider_credentials",
      "api_keys",
      "object_store_dumps",
      "database_dumps",
      "private_screenshots",
      "private_finance_source_text",
    ],
    forbidsCheckedInSensitiveFinanceData: true,
    forbidsLightlyAnonymizedRealFinanceData: true,
    forbidsRealCompanyData: true,
    noDataFilesCreatedByPolicy: true,
    policyName: "SafeDemoDataPolicy",
    requiresClearSyntheticLabel: true,
    requiresReviewBeforeAnyFutureDataFile: true,
    requiresSyntheticOnlyBeforeFutureCase: true,
    schemaVersion: BENCHMARK_COMMUNITY_SCHEMA_VERSION,
  };
}

function syntheticFinanceSourcePolicy() {
  return {
    forbidsLightlyAnonymizedRealFinanceData: true,
    forbidsRealCompanyDerivedData: true,
    forbidsSourcePackDerivedPrivateData: true,
    gatedBySafeDemoDataPolicyFirst: true,
    noFutureSampleDemoBenchmarkCaseWithoutPolicy: true,
    policyName: "SyntheticFinanceSourcePolicy",
    requiresClearSyntheticLabeling: true,
    requiresInventedCompanyFacts: true,
    requiresInventedSourceFacts: true,
    schemaVersion: BENCHMARK_COMMUNITY_SCHEMA_VERSION,
  };
}

function privacyBoundary() {
  return {
    benchmarkArtifactsAreNotSourceTruth: true,
    noCredentialsTokensSecretsOauthProviderKeys: true,
    noLightlyAnonymizedRealFinanceData: true,
    noObjectStoreOrDatabaseDumps: true,
    noPrivateCustomerVendorPayrollTaxBankLegalBoardLenderData: true,
    noPrivateFinanceSourceText: true,
    noPrivateScreenshots: true,
    noRealCompanyData: true,
    schemaVersion: BENCHMARK_COMMUNITY_SCHEMA_VERSION,
  };
}

function noRuntimeBoundary() {
  return {
    localProofOnly: true,
    noAppSubmission: true,
    noAppsSdkUi: true,
    noAutonomousAction: true,
    noCertification: true,
    noDelivery: true,
    noDeployment: true,
    noEvalDatasetsAdded: true,
    noExternalCommunications: true,
    noFinanceWrite: true,
    noFixturesAdded: true,
    noGeneratedAdvice: true,
    noGeneratedProductProse: true,
    noModelCalls: true,
    noOauth: true,
    noOcr: true,
    noOpenAiApiCalls: true,
    noPackageScriptsAdded: true,
    noPageIndex: true,
    noProductRuntime: true,
    noProviderCalls: true,
    noPublicChatGptApp: true,
    noPublicDemoDataAdded: true,
    noPublicSourcePacksAdded: true,
    noRemoteMcpDeployment: true,
    noRoutesAdded: true,
    noRuntimeCodex: true,
    noSampleDataAdded: true,
    noSchemaMigrationsAdded: true,
    noSmokeAliasesAdded: true,
    noSourceMutation: true,
    noSourcePackMutation: true,
    noUiAdded: true,
    noVectorFileSearch: true,
    schemaVersion: BENCHMARK_COMMUNITY_SCHEMA_VERSION,
  };
}

function benchmarkCase() {
  return {
    futureCaseRequiresSafeDemoDataPolicy: true,
    futureCaseRequiresSyntheticFinanceSourcePolicy: true,
    noBenchmarkCasesCheckedIn: true,
    noDatasetFile: true,
    noFixtureFile: true,
    noSampleDataFile: true,
    placeholderOnly: true,
    schemaVersion: BENCHMARK_COMMUNITY_SCHEMA_VERSION,
  };
}

function contributorChallenge() {
  return {
    challengeName: "Synthetic read-only evidence challenge",
    noAutonomousActionImplied: true,
    noCertificationImplied: true,
    noFinanceWritesImplied: true,
    noLegalAuditTaxAdviceImplied: true,
    noProviderIntegrationImplied: true,
    noPublicLaunchImplied: true,
    noSaasDeploymentImplied: true,
    readOnlyProofOnly: true,
    schemaVersion: BENCHMARK_COMMUNITY_SCHEMA_VERSION,
    syntheticOnlyRequiredBeforeAnyFutureData: true,
  };
}

function architectureMap() {
  return {
    authorityLayers: [...BENCHMARK_AUTHORITY_LAYERS],
    benchmarkArtifactsNotProductRuntime: true,
    cfoWikiCompiledDerived: true,
    evidenceIndexReadOnlyAnchorTraceCardCoverageLimitationLayer: true,
    financeTwinAuthoritativeForStructuredFacts: true,
    rawSourcesAuthoritativeForDocumentClaims: true,
    schemaVersion: BENCHMARK_COMMUNITY_SCHEMA_VERSION,
    v2cToolsLocalInternalReadOnlyContract: true,
    v2dAtlasVisualizationOnly: true,
    v2eBoundedOrchestrationLocalInternalProofOnly: true,
    v2fContractsNotTruthRuntimeOrData: true,
  };
}

function baseTask(
  taskKind: (typeof BENCHMARK_TASK_KINDS)[number],
  expectedRefusalKind:
    | "none"
    | "missing_citation_refusal"
    | "unsupported_evidence_refusal"
    | "unsafe_action_refusal" = "unsupported_evidence_refusal",
) {
  return {
    citationRequirements: {
      acceptedDerivedRefKinds: ["evidence_card", "document_map"],
      missingCitationFailsClosed: true,
      positiveClaimsRequireCitation: true,
      sourceAnchorOrAcceptedDerivedRefRequired: true,
    },
    companyContext: { companyKey: "synthetic-company", syntheticOnly: true },
    contractPlaceholderOnly: true,
    evidenceRequirements: {
      cfoWikiCompiledDerived: true,
      evidenceIndexAllowed: true,
      financeTwinStructuredFactsRemainAuthoritative: true,
      noFullFileDumps: true,
      rawSourcesRemainAuthoritative: true,
      v2cEvidenceToolsAllowedReadOnly: true,
    },
    expectedRefusalPosture: {
      expectedRefusalKind,
      whenCitationMissing: "missing_citation_refusal",
      whenEvidenceConflicting: "unsupported_evidence_refusal",
      whenEvidenceMissing: "unsupported_evidence_refusal",
      whenEvidenceStale: "unsupported_evidence_refusal",
      whenEvidenceUnsupported: "unsupported_evidence_refusal",
      whenUnsafeActionRequested: "unsafe_action_refusal",
    },
    forbiddenActions: [
      "upload_source",
      "report_release",
      "provider_call",
      "finance_write",
      "generated_advice",
      "autonomous_action",
      "openai_api_call",
      "model_call",
    ],
    freshnessPosture: {
      checkedAt,
      compiledAt: checkedAt,
      extractedAt: checkedAt,
      sourceCapturedAt: checkedAt,
      state: "fresh" as const,
      summary: "Fresh synthetic benchmark contract posture.",
    },
    limitationPosture: [
      {
        affectedAnchorIds: [],
        affectedSourceIds: [],
        code: "not_source_truth" as const,
        severity: "blocking" as const,
        summary: "V2F benchmark contracts are not source truth.",
      },
    ],
    noRuntimeBoundary: noRuntimeBoundary(),
    permittedNextActions: [
      {
        action: "request_human_review" as const,
        label: "Review benchmark contract posture.",
        targetId: "synthetic-company",
      },
    ],
    privacyBoundary: privacyBoundary(),
    proofExpectations: {
      localProofOnly: true,
      machineReadable: true,
      noDatasetRequired: true,
      noRuntimeBehavior: true,
    },
    readOnlyDefinitionOnly: true,
    schemaVersion: BENCHMARK_COMMUNITY_SCHEMA_VERSION,
    taskKind,
    taskName: `Synthetic ${taskKind} task contract`,
  };
}

function communityPackManifest() {
  return {
    allowedTaskKinds: [...BENCHMARK_TASK_KINDS],
    architectureMap: architectureMap(),
    benchmarkCase: benchmarkCase(),
    containsNoDataOrSourcePackReferences: true,
    contributorChallenge: contributorChallenge(),
    describesFutureCommunityPackOnly: true,
    manifestKind: "CommunityPackManifest",
    noRuntimeBoundary: noRuntimeBoundary(),
    owningFinancePlan: "FP-0086",
    privacyBoundary: privacyBoundary(),
    safeDemoDataPolicy: safeDemoDataPolicy(),
    schemaVersion: BENCHMARK_COMMUNITY_SCHEMA_VERSION,
    syntheticFinanceSourcePolicy: syntheticFinanceSourcePolicy(),
    validationPosture: {
      directProofCommandOnly: true,
      inMemorySyntheticExamplesOnly: true,
      noDataFileAliasesAllowed: true,
      noPackageScriptOrSmokeAlias: true,
    },
  };
}

function fp0087AbsentOrDocsOnlyBoundaryVerified() {
  const plansPath = existsSync("plans") ? "plans" : "../../plans";
  const fp0087Files = readdirSync(plansPath).filter((name) =>
    /^FP-0087/u.test(name),
  );

  if (fp0087Files.length === 0) {
    return true;
  }

  if (
    fp0087Files.length !== 1 ||
    fp0087Files[0] !== "FP-0087-read-only-chatgpt-app-mcp-master-plan.md"
  ) {
    return false;
  }

  const planText = readFileSync(`${plansPath}/${fp0087Files[0]}`, "utf8");
  const lowerPlanText = planText.toLowerCase();
  const planBoundaryVerified = [
    "v2g",
    "read-only",
    "chatgpt app/mcp",
    "no app submission",
    "no openai api/model calls",
    "source mutation",
    "finance writes",
    "autonomous action",
  ].every((requiredText) => lowerPlanText.includes(requiredText));
  const typedProof = AppProofSchema.safeParse(
    buildReadOnlyChatGptAppMcpProof({
      fp0087DocsOnlyBoundaryVerified: planBoundaryVerified,
      fp0088AbsentOrDocsOnlyBoundaryVerified:
        fp0088DocsOnlyBoundary().absentOrDocsOnlyBoundaryVerified,
      fp0089AbsentOrDocsOnlyBoundaryVerified:
        fp0089DocsOnlyBoundary().absentOrDocsOnlyBoundaryVerified,
      fp0090AbsentOrDocsOnlyBoundaryVerified:
        fp0090DocsOnlyBoundary().absentOrDocsOnlyBoundaryVerified,
      fp0091AbsentOrLocalUiComponentBoundaryVerified:
        fp0091LocalUiComponentBoundary()
          .absentOrLocalUiComponentBoundaryVerified,
      fp0092AbsentOrLocalUiCompositionAccessibilityBoundaryVerified:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .absentOrLocalUiCompositionAccessibilityBoundaryVerified,
      fp0093AbsentOrDocsOnlyPreviewRouteBoundaryVerified:
        fp0093LocalUiPreviewRouteBoundary()
          .absentOrDocsOnlyPreviewRouteBoundaryVerified,
      fp0094AbsentOrLocalPreviewRouteBoundaryVerified:
        fp0094LocalPreviewRouteBoundary()
          .absentOrLocalPreviewRouteBoundaryVerified,
      fp0095Absent: fp0095Absent(),
      premiumUiSecurityPlanBoundaryVerified:
        fp0088DocsOnlyBoundary().premiumUiSecurityPlanBoundaryVerified,
      premiumUiDesignSystemPlanBoundaryVerified:
        fp0089DocsOnlyBoundary().premiumUiDesignSystemPlanBoundaryVerified,
      premiumUiImplementationPlanBoundaryVerified:
        fp0090DocsOnlyBoundary().premiumUiImplementationPlanBoundaryVerified,
      premiumUiComponentFoundationVerified:
        fp0091LocalUiComponentBoundary().premiumUiComponentFoundationVerified,
      premiumUiCompositionAccessibilityFoundationVerified:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .premiumUiCompositionAccessibilityFoundationVerified,
      localUiPreviewRoutePlanBoundaryVerified:
        fp0093LocalUiPreviewRouteBoundary()
          .localUiPreviewRoutePlanBoundaryVerified,
      localPreviewRouteFoundationVerified:
        fp0094LocalPreviewRouteBoundary().localPreviewRouteFoundationVerified,
      noUiImplementationFromFp0088:
        fp0088DocsOnlyBoundary().noUiImplementationFromFp0088,
      noUiImplementationFromFp0089:
        fp0089DocsOnlyBoundary().noUiImplementationFromFp0089,
      noAppsSdkIframeFromFp0089:
        fp0089DocsOnlyBoundary().noAppsSdkIframeFromFp0089,
      noUiCodeFromFp0090: fp0090DocsOnlyBoundary().noUiCodeFromFp0090,
      noAppsSdkIframeFromFp0090:
        fp0090DocsOnlyBoundary().noAppsSdkIframeFromFp0090,
      noEndpointOauthSubmissionFromFp0088:
        fp0088DocsOnlyBoundary().noEndpointOauthSubmissionFromFp0088,
      noEndpointOauthSubmissionFromFp0089:
        fp0089DocsOnlyBoundary().noEndpointOauthSubmissionFromFp0089,
      noEndpointOauthSubmissionFromFp0090:
        fp0090DocsOnlyBoundary().noEndpointOauthSubmissionFromFp0090,
      noPublicAppImplementationFromFp0090:
        fp0090DocsOnlyBoundary().noPublicAppImplementationFromFp0090,
      noRoutesFromFp0091: fp0091LocalUiComponentBoundary().noRoutesFromFp0091,
      noEndpointsFromFp0091:
        fp0091LocalUiComponentBoundary().noEndpointsFromFp0091,
      noAppsSdkIframeFromFp0091:
        fp0091LocalUiComponentBoundary().noAppsSdkIframeFromFp0091,
      noOauthSubmissionFromFp0091:
        fp0091LocalUiComponentBoundary().noOauthSubmissionFromFp0091,
      noPublicAppImplementationFromFp0091:
        fp0091LocalUiComponentBoundary().noPublicAppImplementationFromFp0091,
      noOpenAiApiCallsFromFp0091:
        fp0091LocalUiComponentBoundary().noOpenAiApiCallsFromFp0091,
      noSourceMutationFinanceWriteFromFp0091:
        fp0091LocalUiComponentBoundary().noSourceMutationFinanceWriteFromFp0091,
      noRoutesFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary().noRoutesFromFp0092,
      noEndpointsFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary().noEndpointsFromFp0092,
      noAppsSdkIframeFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .noAppsSdkIframeFromFp0092,
      noOauthSubmissionFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .noOauthSubmissionFromFp0092,
      noPublicAppImplementationFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .noPublicAppImplementationFromFp0092,
      noOpenAiApiCallsFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .noOpenAiApiCallsFromFp0092,
      noSourceMutationFinanceWriteFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .noSourceMutationFinanceWriteFromFp0092,
      noRouteImplementationFromFp0093:
        fp0093LocalUiPreviewRouteBoundary().noRouteImplementationFromFp0093,
      noEndpointOauthSubmissionFromFp0093:
        fp0093LocalUiPreviewRouteBoundary()
          .noEndpointOauthSubmissionFromFp0093,
      noPublicAppImplementationFromFp0093:
        fp0093LocalUiPreviewRouteBoundary()
          .noPublicAppImplementationFromFp0093,
      noAppsSdkIframeFromFp0093:
        fp0093LocalUiPreviewRouteBoundary().noAppsSdkIframeFromFp0093,
      noOpenAiApiModelCallsFromFp0093:
        fp0093LocalUiPreviewRouteBoundary()
          .noOpenAiApiModelCallsFromFp0093,
      noSourceMutationFinanceWriteFromFp0093:
        fp0093LocalUiPreviewRouteBoundary()
          .noSourceMutationFinanceWriteFromFp0093,
      noGeneratedProductProseRuntimeCodexFromFp0093:
        fp0093LocalUiPreviewRouteBoundary()
          .noGeneratedProductProseRuntimeCodexFromFp0093,
      noApiRoutesFromFp0094:
        fp0094LocalPreviewRouteBoundary().noApiRoutesFromFp0094,
      noBackendRoutesFromFp0094:
        fp0094LocalPreviewRouteBoundary().noBackendRoutesFromFp0094,
      noEndpointsFromFp0094:
        fp0094LocalPreviewRouteBoundary().noEndpointsFromFp0094,
      noAppsSdkIframeFromFp0094:
        fp0094LocalPreviewRouteBoundary().noAppsSdkIframeFromFp0094,
      noOauthSubmissionFromFp0094:
        fp0094LocalPreviewRouteBoundary().noOauthSubmissionFromFp0094,
      noPublicAppImplementationFromFp0094:
        fp0094LocalPreviewRouteBoundary()
          .noPublicAppImplementationFromFp0094,
      noOpenAiApiCallsFromFp0094:
        fp0094LocalPreviewRouteBoundary().noOpenAiApiCallsFromFp0094,
      noSourceMutationFinanceWriteFromFp0094:
        fp0094LocalPreviewRouteBoundary()
          .noSourceMutationFinanceWriteFromFp0094,
    }),
  );

  return (
    typedProof.success &&
    typedProof.data.fp0087DocsOnlyBoundaryVerified &&
    typedProof.data.noPublicChatGptApp &&
    typedProof.data.noRemoteMcpDeployment &&
    typedProof.data.noOpenAiApiCalls
  );
}

function fp0088DocsOnlyBoundary() {
  const plansPath = existsSync("plans") ? "plans" : "../../plans";
  const fp0088Files = readdirSync(plansPath).filter((name) =>
    /^FP-0088/u.test(name),
  );

  if (fp0088Files.length === 0) {
    return {
      absentOrDocsOnlyBoundaryVerified: true,
      noEndpointOauthSubmissionFromFp0088: true,
      noUiImplementationFromFp0088: true,
      premiumUiSecurityPlanBoundaryVerified: true,
    };
  }

  if (fp0088Files.length !== 1 || fp0088Files[0] !== FP0088_PLAN_FILE) {
    return {
      absentOrDocsOnlyBoundaryVerified: false,
      noEndpointOauthSubmissionFromFp0088: false,
      noUiImplementationFromFp0088: false,
      premiumUiSecurityPlanBoundaryVerified: false,
    };
  }

  const lowerPlanText = readFileSync(
    `${plansPath}/${FP0088_PLAN_FILE}`,
    "utf8",
  ).toLowerCase();

  return {
    absentOrDocsOnlyBoundaryVerified: [
      "fp-0088 is not implementation",
      "docs-and-plan plus proof-gate compatibility",
      "no product code",
      "no ui implementation",
      "no routes or endpoints",
      "no oauth",
      "no app submission",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
    noEndpointOauthSubmissionFromFp0088: [
      "does not authorize remote mcp deployment",
      "does not authorize oauth implementation",
      "does not authorize public app submission",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
    noUiImplementationFromFp0088: [
      "does not authorize apps sdk iframe/ui code",
      "future ui polish/design-system implementation plan",
      "do not implement ui",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
    premiumUiSecurityPlanBoundaryVerified: [
      "premium ui readiness requirements only",
      "app/mcp security readiness requirements only",
      "evidenceanswerpanel",
      "privacyboundarypanel",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
  };
}

function fp0089DocsOnlyBoundary() {
  const plansPath = existsSync("plans") ? "plans" : "../../plans";
  const fp0089Files = readdirSync(plansPath).filter((name) =>
    /^FP-0089/u.test(name),
  );

  if (fp0089Files.length === 0) {
    return {
      absentOrDocsOnlyBoundaryVerified: true,
      noAppsSdkIframeFromFp0089: true,
      noEndpointOauthSubmissionFromFp0089: true,
      noUiImplementationFromFp0089: true,
      premiumUiDesignSystemPlanBoundaryVerified: true,
    };
  }

  if (fp0089Files.length !== 1 || fp0089Files[0] !== FP0089_PLAN_FILE) {
    return {
      absentOrDocsOnlyBoundaryVerified: false,
      noAppsSdkIframeFromFp0089: false,
      noEndpointOauthSubmissionFromFp0089: false,
      noUiImplementationFromFp0089: false,
      premiumUiDesignSystemPlanBoundaryVerified: false,
    };
  }

  const lowerPlanText = readFileSync(
    `${plansPath}/${FP0089_PLAN_FILE}`,
    "utf8",
  ).toLowerCase();

  return {
    absentOrDocsOnlyBoundaryVerified: [
      "fp-0089 is not implementation",
      "docs-and-plan plus proof-gate compatibility",
      "premium ui design-system readiness plan only",
      "no product code",
      "no ui implementation",
      "no routes or endpoints",
      "no oauth",
      "no app submission",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
    noAppsSdkIframeFromFp0089: [
      "does not authorize apps sdk iframe/ui code",
      "does not authorize public app implementation",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
    noEndpointOauthSubmissionFromFp0089: [
      "does not authorize remote mcp deployment",
      "does not authorize oauth implementation",
      "does not authorize endpoint implementation",
      "does not authorize public app submission",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
    noUiImplementationFromFp0089: [
      "does not authorize ui code",
      "later ui implementation finance plan before any component code",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
    premiumUiDesignSystemPlanBoundaryVerified: [
      "premium ui design-system readiness plan only",
      "design tokens",
      "semantic color tokens",
      "evidence-card hierarchy",
      "citation/source-anchor affordances",
      "refusal-state visual grammar",
      "keyboard/focus behavior",
      "evidenceanswerpanel",
      "privacyboundarypanel",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
  };
}

function fp0090DocsOnlyBoundary() {
  const plansPath = existsSync("plans") ? "plans" : "../../plans";
  const fp0090Files = readdirSync(plansPath).filter((name) =>
    /^FP-0090/u.test(name),
  );

  if (fp0090Files.length === 0) {
    return {
      absentOrDocsOnlyBoundaryVerified: true,
      noAppsSdkIframeFromFp0090: true,
      noEndpointOauthSubmissionFromFp0090: true,
      noPublicAppImplementationFromFp0090: true,
      noUiCodeFromFp0090: true,
      premiumUiImplementationPlanBoundaryVerified: true,
    };
  }

  if (fp0090Files.length !== 1 || fp0090Files[0] !== FP0090_PLAN_FILE) {
    return {
      absentOrDocsOnlyBoundaryVerified: false,
      noAppsSdkIframeFromFp0090: false,
      noEndpointOauthSubmissionFromFp0090: false,
      noPublicAppImplementationFromFp0090: false,
      noUiCodeFromFp0090: false,
      premiumUiImplementationPlanBoundaryVerified: false,
    };
  }

  const lowerPlanText = readFileSync(
    `${plansPath}/${FP0090_PLAN_FILE}`,
    "utf8",
  ).toLowerCase();

  return {
    absentOrDocsOnlyBoundaryVerified: [
      "fp-0090 is not implementation",
      "docs-and-plan plus proof-gate compatibility",
      "premium ui implementation master-plan only",
      "no product code",
      "no ui implementation",
      "no routes or endpoints",
      "no oauth",
      "no app submission",
      "no public app implementation",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
    noAppsSdkIframeFromFp0090: [
      "does not authorize apps sdk iframe/ui code yet",
      "apps sdk iframe/ui implementation remains future-only",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
    noEndpointOauthSubmissionFromFp0090: [
      "does not authorize remote mcp deployment",
      "does not authorize oauth implementation",
      "does not authorize endpoint implementation",
      "does not authorize public app submission",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
    noPublicAppImplementationFromFp0090: [
      "does not authorize public app implementation",
      "public chatgpt app implementation remains future-only",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
    noUiCodeFromFp0090: [
      "does not authorize ui code yet",
      "this is not ui implementation",
      "future implementation slice may add ui components only if it remains local/proof-only/read-only",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
    premiumUiImplementationPlanBoundaryVerified: [
      "future ui implementation boundary",
      "screenshot review before merge",
      "accessibility acceptance criteria",
      "evidence hierarchy acceptance",
      "appshell",
      "evidenceanswerpanel",
      "citationrail",
      "apps/web/components/read-only-app-mcp",
    ].every((requiredText) => lowerPlanText.includes(requiredText)),
  };
}

function fp0091LocalUiComponentBoundary() {
  const plansPath = existsSync("plans") ? "plans" : "../../plans";
  const fp0091Files = readdirSync(plansPath).filter((name) =>
    /^FP-0091/u.test(name),
  );
  const absentBoundary = {
    absentOrLocalUiComponentBoundaryVerified: true,
    noAppsSdkIframeFromFp0091: true,
    noEndpointsFromFp0091: true,
    noOauthSubmissionFromFp0091: true,
    noOpenAiApiCallsFromFp0091: true,
    noPublicAppImplementationFromFp0091: true,
    noRoutesFromFp0091: true,
    noSourceMutationFinanceWriteFromFp0091: true,
    premiumUiComponentFoundationVerified: true,
  };
  const failedBoundary = {
    absentOrLocalUiComponentBoundaryVerified: false,
    noAppsSdkIframeFromFp0091: false,
    noEndpointsFromFp0091: false,
    noOauthSubmissionFromFp0091: false,
    noOpenAiApiCallsFromFp0091: false,
    noPublicAppImplementationFromFp0091: false,
    noRoutesFromFp0091: false,
    noSourceMutationFinanceWriteFromFp0091: false,
    premiumUiComponentFoundationVerified: false,
  };

  if (fp0091Files.length === 0) return absentBoundary;
  if (fp0091Files.length !== 1 || fp0091Files[0] !== FP0091_PLAN_FILE) {
    return failedBoundary;
  }

  const repoRoot = existsSync("plans") ? "." : "../..";
  const lowerPlanText = readFileSync(
    `${plansPath}/${FP0091_PLAN_FILE}`,
    "utf8",
  ).toLowerCase();
  const componentSource = readComponentSource(
    `${repoRoot}/apps/web/components/read-only-app-mcp`,
  ).toLowerCase();
  const normalizedComponentSource = componentSource.replace(/[^a-z0-9]+/gu, "");
  const componentFilesVerified =
    componentSource.length > 0 &&
    [
      "appshell",
      "evidenceanswerpanel",
      "refusalpanel",
      "evidencecardstack",
      "citationrail",
      "sourceanchorpanel",
      "freshnessbadge",
      "freshnesssummarypanel",
      "limitationcallout",
      "permittednextactionspanel",
      "forbiddenactionspanel",
      "privacyboundarypanel",
      "noruntimeboundarypanel",
      "promptinjectionwarningstate",
      "rawfullfiledumprefusalstate",
      "emptyevidencestate",
      "loadingevidencestate",
      "errorandunsupportedstate",
    ].every((name) => normalizedComponentSource.includes(name));
  const premiumUiComponentFoundationVerified =
    componentFilesVerified &&
    [
      "this slice writes actual ui component code",
      "strictly local, proof-only, read-only, and component-only",
      "local react components",
      "apps/web/components/read-only-app-mcp",
      "appshell",
      "evidenceanswerpanel",
      "refusalpanel",
      "citationrail",
      "sourceanchorpanel",
      "errorandunsupportedstate",
    ].every((requiredText) => lowerPlanText.includes(requiredText));
  const noRoutesFromFp0091 =
    ["does not add routes", "no app routes"].every((requiredText) =>
      lowerPlanText.includes(requiredText),
    ) && !existsSync(`${repoRoot}/apps/web/app/read-only-app-mcp`);
  const noEndpointsFromFp0091 =
    ["does not add endpoints", "no endpoints"].every((requiredText) =>
      lowerPlanText.includes(requiredText),
    ) && !existsSync(`${repoRoot}/apps/web/app/api/read-only-app-mcp`);
  const noAppsSdkIframeFromFp0091 =
    [
      "does not implement apps sdk iframe/ui resources",
      "no apps sdk iframe/ui resource registration",
    ].every((requiredText) => lowerPlanText.includes(requiredText)) &&
    !/(apps-sdk|iframe|postmessage)/u.test(componentSource);
  const noOauthSubmissionFromFp0091 =
    ["does not add oauth", "does not add app submission"].every(
      (requiredText) => lowerPlanText.includes(requiredText),
    ) && !/(oauth|submitapp|appsubmission)/u.test(normalizedComponentSource);
  const noPublicAppImplementationFromFp0091 =
    [
      "does not implement a public chatgpt app",
      "no public app implementation",
    ].every((requiredText) => lowerPlanText.includes(requiredText));
  const noOpenAiApiCallsFromFp0091 =
    ["does not add openai api/model calls", "no openai api/model calls"].every(
      (requiredText) => lowerPlanText.includes(requiredText),
    ) &&
    !/(openaiapikey|fromopenai|openai\.)/u.test(normalizedComponentSource);
  const noSourceMutationFinanceWriteFromFp0091 =
    ["no source mutation", "no finance writes"].every((requiredText) =>
      lowerPlanText.includes(requiredText),
    );

  return {
    absentOrLocalUiComponentBoundaryVerified:
      premiumUiComponentFoundationVerified &&
      noRoutesFromFp0091 &&
      noEndpointsFromFp0091 &&
      noAppsSdkIframeFromFp0091 &&
      noOauthSubmissionFromFp0091 &&
      noPublicAppImplementationFromFp0091 &&
      noOpenAiApiCallsFromFp0091 &&
      noSourceMutationFinanceWriteFromFp0091,
    noAppsSdkIframeFromFp0091,
    noEndpointsFromFp0091,
    noOauthSubmissionFromFp0091,
    noOpenAiApiCallsFromFp0091,
    noPublicAppImplementationFromFp0091,
    noRoutesFromFp0091,
    noSourceMutationFinanceWriteFromFp0091,
    premiumUiComponentFoundationVerified,
  };
}

function fp0092LocalUiCompositionAccessibilityBoundary() {
  const plansPath = existsSync("plans") ? "plans" : "../../plans";
  const fp0092Files = readdirSync(plansPath).filter((name) =>
    /^FP-0092/u.test(name),
  );
  const absentBoundary = {
    absentOrLocalUiCompositionAccessibilityBoundaryVerified: true,
    noAppsSdkIframeFromFp0092: true,
    noEndpointsFromFp0092: true,
    noOauthSubmissionFromFp0092: true,
    noOpenAiApiCallsFromFp0092: true,
    noPublicAppImplementationFromFp0092: true,
    noRoutesFromFp0092: true,
    noSourceMutationFinanceWriteFromFp0092: true,
    premiumUiCompositionAccessibilityFoundationVerified: true,
  };
  const failedBoundary = {
    absentOrLocalUiCompositionAccessibilityBoundaryVerified: false,
    noAppsSdkIframeFromFp0092: false,
    noEndpointsFromFp0092: false,
    noOauthSubmissionFromFp0092: false,
    noOpenAiApiCallsFromFp0092: false,
    noPublicAppImplementationFromFp0092: false,
    noRoutesFromFp0092: false,
    noSourceMutationFinanceWriteFromFp0092: false,
    premiumUiCompositionAccessibilityFoundationVerified: false,
  };

  if (fp0092Files.length === 0) return absentBoundary;
  if (fp0092Files.length !== 1 || fp0092Files[0] !== FP0092_PLAN_FILE) {
    return failedBoundary;
  }

  const repoRoot = existsSync("plans") ? "." : "../..";
  const lowerPlanText = readFileSync(
    `${plansPath}/${FP0092_PLAN_FILE}`,
    "utf8",
  ).toLowerCase();
  const componentSource = readComponentSource(
    `${repoRoot}/apps/web/components/read-only-app-mcp`,
  ).toLowerCase();
  const componentAndTestSource = readComponentAndTestSource(
    `${repoRoot}/apps/web/components/read-only-app-mcp`,
  ).toLowerCase();
  const normalizedComponentSource = componentSource.replace(/[^a-z0-9]+/gu, "");
  const normalizedComponentAndTestSource = componentAndTestSource.replace(
    /[^a-z0-9]+/gu,
    "",
  );
  const componentCompositionAccessibilityVerified = [
    "readonlyappmcpenvelopepreview",
    "readonlyappmcpexperienceframe",
    "createreadonlyappmcpsectionid",
    "headinglevel",
    "ariabusy",
    "forbiddenrawprivatefieldnames",
    "contrastratio",
    "dataresponsive",
  ].every((name) => normalizedComponentAndTestSource.includes(name));
  const premiumUiCompositionAccessibilityFoundationVerified =
    componentCompositionAccessibilityVerified &&
    [
      "this slice writes actual ui component/composition code",
      "limited to component composition and accessibility hardening",
      "local read-only ui composition/accessibility hardening",
      "apps/web/components/read-only-app-mcp",
      "readonlyappmcpenvelopepreview",
      "heading-level control",
      "scoped section ids",
      "accessibility tests",
      "contrast/token proof",
    ].every((requiredText) =>
      lowerPlanText.replace(/`/gu, "").includes(requiredText),
    );
  const noRoutesFromFp0092 =
    ["does not add app routes", "no app routes"].every((requiredText) =>
      lowerPlanText.includes(requiredText),
    ) && !existsSync(`${repoRoot}/apps/web/app/read-only-app-mcp`);
  const noEndpointsFromFp0092 =
    ["does not add endpoints", "no endpoints"].every((requiredText) =>
      lowerPlanText.includes(requiredText),
    ) && !existsSync(`${repoRoot}/apps/web/app/api/read-only-app-mcp`);
  const noAppsSdkIframeFromFp0092 =
    [
      "does not implement apps sdk iframe/ui resources",
      "no apps sdk iframe/ui resource registration",
    ].every((requiredText) => lowerPlanText.includes(requiredText)) &&
    !/(apps-sdk|iframe|postmessage)/u.test(componentSource);
  const noOauthSubmissionFromFp0092 =
    ["does not add oauth", "does not add app submission"].every(
      (requiredText) => lowerPlanText.includes(requiredText),
    ) && !/(oauth|submitapp|appsubmission)/u.test(normalizedComponentSource);
  const noPublicAppImplementationFromFp0092 =
    [
      "does not implement a public chatgpt app",
      "no public app implementation",
    ].every((requiredText) => lowerPlanText.includes(requiredText));
  const noOpenAiApiCallsFromFp0092 =
    ["does not add openai api/model calls", "no openai api/model calls"].every(
      (requiredText) => lowerPlanText.includes(requiredText),
    ) &&
    !/(openaiapikey|fromopenai|openai\.)/u.test(normalizedComponentSource);
  const noSourceMutationFinanceWriteFromFp0092 =
    ["no source mutation", "no finance writes"].every((requiredText) =>
      lowerPlanText.includes(requiredText),
    );

  return {
    absentOrLocalUiCompositionAccessibilityBoundaryVerified:
      premiumUiCompositionAccessibilityFoundationVerified &&
      noRoutesFromFp0092 &&
      noEndpointsFromFp0092 &&
      noAppsSdkIframeFromFp0092 &&
      noOauthSubmissionFromFp0092 &&
      noPublicAppImplementationFromFp0092 &&
      noOpenAiApiCallsFromFp0092 &&
      noSourceMutationFinanceWriteFromFp0092,
    noAppsSdkIframeFromFp0092,
    noEndpointsFromFp0092,
    noOauthSubmissionFromFp0092,
    noOpenAiApiCallsFromFp0092,
    noPublicAppImplementationFromFp0092,
    noRoutesFromFp0092,
    noSourceMutationFinanceWriteFromFp0092,
    premiumUiCompositionAccessibilityFoundationVerified,
  };
}

function fp0093LocalUiPreviewRouteBoundary() {
  const plansPath = existsSync("plans") ? "plans" : "../../plans";
  const fp0093Files = readdirSync(plansPath).filter((name) =>
    /^FP-0093/u.test(name),
  );
  const absentBoundary = {
    absentOrDocsOnlyPreviewRouteBoundaryVerified: true,
    localUiPreviewRoutePlanBoundaryVerified: true,
    noAppsSdkIframeFromFp0093: true,
    noEndpointOauthSubmissionFromFp0093: true,
    noGeneratedProductProseRuntimeCodexFromFp0093: true,
    noOpenAiApiModelCallsFromFp0093: true,
    noPublicAppImplementationFromFp0093: true,
    noRouteImplementationFromFp0093: true,
    noSourceMutationFinanceWriteFromFp0093: true,
  };
  const failedBoundary = {
    absentOrDocsOnlyPreviewRouteBoundaryVerified: false,
    localUiPreviewRoutePlanBoundaryVerified: false,
    noAppsSdkIframeFromFp0093: false,
    noEndpointOauthSubmissionFromFp0093: false,
    noGeneratedProductProseRuntimeCodexFromFp0093: false,
    noOpenAiApiModelCallsFromFp0093: false,
    noPublicAppImplementationFromFp0093: false,
    noRouteImplementationFromFp0093: false,
    noSourceMutationFinanceWriteFromFp0093: false,
  };

  if (fp0093Files.length === 0) return absentBoundary;
  if (fp0093Files.length !== 1 || fp0093Files[0] !== FP0093_PLAN_FILE) {
    return failedBoundary;
  }

  const lowerPlanText = readFileSync(
    `${plansPath}/${FP0093_PLAN_FILE}`,
    "utf8",
  )
    .toLowerCase()
    .replace(/[`_*]+/gu, "");
  const docsOnlyBoundaryVerified = [
    "fp-0093 is not implementation",
    "docs-and-plan plus proof-gate compatibility",
    "local ui preview route master-plan only",
    "creates no product code",
    "no route code",
    "no app route",
    "no api route",
    "backend routes",
    "no endpoint implementation",
    "no remote mcp server",
    "no apps sdk iframe/ui resource registration",
    "no oauth",
    "no app submission",
    "no public app implementation",
    "no openai api/model calls",
    "no source mutation",
    "no finance writes",
    "no generated product prose",
    "no runtime-codex finance output",
    "no autonomous action",
  ].every((requiredText) => lowerPlanText.includes(requiredText));
  const localUiPreviewRoutePlanBoundaryVerified = [
    "future local preview route boundary",
    "apps/web/app/read-only-app-mcp-preview/page.tsx",
    "future route implementation slice may add one local read-only web page only",
    "existing fp-0091 and fp-0092 components only",
    "no fetch",
    "no post",
    "no form",
    "no buttons or action-looking forbidden controls",
    "no server action",
    "no api route",
    "backend routes",
    "no raw full-file dump panels",
    "no advice-like cta copy",
  ].every((requiredText) => lowerPlanText.includes(requiredText));
  const noRouteImplementationFromFp0093 =
    [
      "does not authorize route code yet",
      "this is not route implementation",
      "no route code",
      "no app route",
    ].every((requiredText) => lowerPlanText.includes(requiredText));
  const noEndpointOauthSubmissionFromFp0093 =
    [
      "does not authorize endpoint implementation",
      "does not authorize remote mcp deployment",
      "does not authorize oauth implementation",
      "does not authorize app submission",
      "no endpoint implementation",
      "no oauth",
      "no app submission",
    ].every((requiredText) => lowerPlanText.includes(requiredText));
  const noPublicAppImplementationFromFp0093 = [
    "does not authorize public app implementation",
    "public chatgpt app implementation must still wait",
    "public app implementation",
  ].every((requiredText) => lowerPlanText.includes(requiredText));
  const noAppsSdkIframeFromFp0093 = [
    "does not authorize apps sdk iframe/ui resources",
    "no apps sdk iframe/ui resource registration",
    "apps sdk iframe/ui resource implementation",
  ].every((requiredText) => lowerPlanText.includes(requiredText));
  const noOpenAiApiModelCallsFromFp0093 = [
    "no openai api/model calls",
    "no openai api key was created or used",
  ].every((requiredText) => lowerPlanText.includes(requiredText));
  const noSourceMutationFinanceWriteFromFp0093 =
    ["no source mutation", "no finance writes"].every((requiredText) =>
      lowerPlanText.includes(requiredText),
    );
  const noGeneratedProductProseRuntimeCodexFromFp0093 =
    [
      "no generated product prose",
      "no runtime-codex finance output",
      "no mission-facing output was generated",
    ].every((requiredText) => lowerPlanText.includes(requiredText));

  return {
    absentOrDocsOnlyPreviewRouteBoundaryVerified:
      docsOnlyBoundaryVerified &&
      localUiPreviewRoutePlanBoundaryVerified &&
      noRouteImplementationFromFp0093 &&
      noEndpointOauthSubmissionFromFp0093 &&
      noPublicAppImplementationFromFp0093 &&
      noAppsSdkIframeFromFp0093 &&
      noOpenAiApiModelCallsFromFp0093 &&
      noSourceMutationFinanceWriteFromFp0093 &&
      noGeneratedProductProseRuntimeCodexFromFp0093,
    localUiPreviewRoutePlanBoundaryVerified,
    noAppsSdkIframeFromFp0093,
    noEndpointOauthSubmissionFromFp0093,
    noGeneratedProductProseRuntimeCodexFromFp0093,
    noOpenAiApiModelCallsFromFp0093,
    noPublicAppImplementationFromFp0093,
    noRouteImplementationFromFp0093,
    noSourceMutationFinanceWriteFromFp0093,
  };
}

function fp0094LocalPreviewRouteBoundary() {
  const plansPath = existsSync("plans") ? "plans" : "../../plans";
  const repoRoot = existsSync("plans") ? "." : "../..";
  const fp0094Files = readdirSync(plansPath).filter((name) =>
    /^FP-0094/u.test(name),
  );
  const routeDirectory = `${repoRoot}/apps/web/app/read-only-app-mcp-preview`;
  const routePagePath = `${routeDirectory}/page.tsx`;
  const routeSpecPath = `${routeDirectory}/page.spec.tsx`;
  const routePaths = existsSync(routeDirectory)
    ? readdirSync(routeDirectory).map((name) => `${routeDirectory}/${name}`)
    : [];
  const routeExists = existsSync(routePagePath);
  const allowedRouteFilesOnly =
    routePaths.length === 2 &&
    routePaths.includes(routePagePath) &&
    routePaths.includes(routeSpecPath);
  const absentBoundary = {
    absentOrLocalPreviewRouteBoundaryVerified: routePaths.length === 0,
    localPreviewRouteFoundationVerified: routePaths.length === 0,
    noApiRoutesFromFp0094: routePaths.length === 0,
    noAppsSdkIframeFromFp0094: routePaths.length === 0,
    noBackendRoutesFromFp0094: routePaths.length === 0,
    noEndpointsFromFp0094: routePaths.length === 0,
    noOauthSubmissionFromFp0094: routePaths.length === 0,
    noOpenAiApiCallsFromFp0094: routePaths.length === 0,
    noPublicAppImplementationFromFp0094: routePaths.length === 0,
    noSourceMutationFinanceWriteFromFp0094: routePaths.length === 0,
  };
  const failedBoundary = {
    absentOrLocalPreviewRouteBoundaryVerified: false,
    localPreviewRouteFoundationVerified: false,
    noApiRoutesFromFp0094: false,
    noAppsSdkIframeFromFp0094: false,
    noBackendRoutesFromFp0094: false,
    noEndpointsFromFp0094: false,
    noOauthSubmissionFromFp0094: false,
    noOpenAiApiCallsFromFp0094: false,
    noPublicAppImplementationFromFp0094: false,
    noSourceMutationFinanceWriteFromFp0094: false,
  };

  if (fp0094Files.length === 0) return absentBoundary;
  if (fp0094Files.length !== 1 || fp0094Files[0] !== FP0094_PLAN_FILE) {
    return failedBoundary;
  }

  const lowerPlanText = readFileSync(
    `${plansPath}/${FP0094_PLAN_FILE}`,
    "utf8",
  )
    .toLowerCase()
    .replace(/[`_*]+/gu, "");
  const routeSource = routeExists ? readFileSync(routePagePath, "utf8") : "";
  const routeSpecSource = existsSync(routeSpecPath)
    ? readFileSync(routeSpecPath, "utf8")
    : "";
  const routeAndSpecNormalized = `${routeSource}\n${routeSpecSource}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "");
  const apiRouteExists =
    existsSync(`${repoRoot}/apps/web/app/api/read-only-app-mcp-preview`) ||
    existsSync(`${routeDirectory}/route.ts`) ||
    existsSync(`${routeDirectory}/route.tsx`);
  const backendRouteExists = readComponentSource(
    `${repoRoot}/apps/control-plane`,
  )
    .toLowerCase()
    .includes("read-only-app-mcp-preview");
  const endpointImplementationExists =
    apiRouteExists ||
    backendRouteExists ||
    /export\s+async\s+function\s+(get|post|put|patch|delete)|nextresponse|fastify\./iu.test(
      routeSource,
    );
  const localPreviewRouteFoundationVerified =
    routeExists &&
    allowedRouteFilesOnly &&
    [
      "fp-0094 is the first route implementation slice",
      "adds exactly one local read-only web page",
      "apps/web/app/read-only-app-mcp-preview/page.tsx",
      "this slice writes actual route code",
      "in-memory synthetic contract-shaped examples",
      "does not fetch data",
      "does not add api endpoints",
      "does not add backend/control-plane routes",
      "does not add remote mcp",
      "does not add oauth",
      "does not add app submission",
      "does not add openai api/model calls",
      "no source mutation",
      "no finance writes",
    ].every((requiredText) => lowerPlanText.includes(requiredText)) &&
    [
      "readonlyappmcpenvelopepreview",
      "previewfreshness",
      "syntheticcontractshapedexamplesonly",
      "nodatafetchapicallorpost",
      "noformbuttonfileinputcontrolorserveraction",
    ].every((requiredText) =>
      routeAndSpecNormalized.includes(requiredText),
    );
  const noApiRoutesFromFp0094 =
    ["no web api routes", "does not add api endpoints"].every((requiredText) =>
      lowerPlanText.includes(requiredText),
    ) && !apiRouteExists;
  const noBackendRoutesFromFp0094 =
    ["no backend/control-plane routes", "backend routes"].every(
      (requiredText) => lowerPlanText.includes(requiredText),
    ) && !backendRouteExists;
  const noEndpointsFromFp0094 =
    ["no endpoints", "no endpoint"].every((requiredText) =>
      lowerPlanText.includes(requiredText),
    ) && !endpointImplementationExists;
  const noAppsSdkIframeFromFp0094 =
    [
      "does not implement apps sdk iframe/ui resources",
      "no apps sdk iframe/ui resource registration",
    ].every((requiredText) => lowerPlanText.includes(requiredText)) &&
    !/(iframe|postmessage|registerresource|apps-sdk)/iu.test(routeSource);
  const noOauthSubmissionFromFp0094 =
    ["does not add oauth", "does not add app submission"].every(
      (requiredText) => lowerPlanText.includes(requiredText),
    );
  const noPublicAppImplementationFromFp0094 = [
    "does not implement a public chatgpt app",
    "no public app implementation",
    "public app implementation",
  ].every((requiredText) => lowerPlanText.includes(requiredText));
  const noOpenAiApiCallsFromFp0094 =
    [
      "does not add openai api/model calls",
      "no openai api key was created or used",
    ].every((requiredText) => lowerPlanText.includes(requiredText)) &&
    !/(openai_api_key|from\s+["']openai["']|openai\.|responses\.create|chat\.completions)/iu.test(
      routeSource,
    );
  const noSourceMutationFinanceWriteFromFp0094 =
    ["no source mutation", "no finance writes"].every((requiredText) =>
      lowerPlanText.includes(requiredText),
    );

  return {
    absentOrLocalPreviewRouteBoundaryVerified:
      localPreviewRouteFoundationVerified &&
      noApiRoutesFromFp0094 &&
      noBackendRoutesFromFp0094 &&
      noEndpointsFromFp0094 &&
      noAppsSdkIframeFromFp0094 &&
      noOauthSubmissionFromFp0094 &&
      noPublicAppImplementationFromFp0094 &&
      noOpenAiApiCallsFromFp0094 &&
      noSourceMutationFinanceWriteFromFp0094,
    localPreviewRouteFoundationVerified,
    noApiRoutesFromFp0094,
    noAppsSdkIframeFromFp0094,
    noBackendRoutesFromFp0094,
    noEndpointsFromFp0094,
    noOauthSubmissionFromFp0094,
    noOpenAiApiCallsFromFp0094,
    noPublicAppImplementationFromFp0094,
    noSourceMutationFinanceWriteFromFp0094,
  };
}

function fp0095Absent() {
  const plansPath = existsSync("plans") ? "plans" : "../../plans";
  return !readdirSync(plansPath).some((name) => /^FP-0095/u.test(name));
}

function readComponentSource(directory: string): string {
  if (!existsSync(directory)) return "";

  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = `${directory}/${entry.name}`;
      if (entry.isDirectory()) return [readComponentSource(entryPath)];
      if (!/\.(ts|tsx)$/u.test(entry.name)) return [];
      if (/\.(spec|test)\.tsx?$/u.test(entry.name)) return [];
      return [readFileSync(entryPath, "utf8")];
    })
    .join("\n");
}

function readComponentAndTestSource(directory: string): string {
  if (!existsSync(directory)) return "";

  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = `${directory}/${entry.name}`;
      if (entry.isDirectory()) return [readComponentAndTestSource(entryPath)];
      if (!/\.(ts|tsx)$/u.test(entry.name)) return [];
      return [readFileSync(entryPath, "utf8")];
    })
    .join("\n");
}

describe("benchmark community pack foundation contracts", () => {
  it("puts SafeDemoDataPolicy first and forbids real or lightly anonymized finance data", () => {
    const safe = SafeDemoDataPolicySchema.parse(safeDemoDataPolicy());
    const synthetic = SyntheticFinanceSourcePolicySchema.parse(
      syntheticFinanceSourcePolicy(),
    );

    expect(safe.firstGate).toBe(true);
    expect(safe.forbidsRealCompanyData).toBe(true);
    expect(safe.forbidsLightlyAnonymizedRealFinanceData).toBe(true);
    expect(safe.forbiddenFinanceData).toEqual(
      expect.arrayContaining([
        "customer_data",
        "vendor_data",
        "payroll_data",
        "tax_data",
        "bank_data",
        "legal_data",
        "board_data",
        "lender_data",
      ]),
    );
    expect(safe.forbiddenPrivateArtifacts).toEqual(
      expect.arrayContaining([
        "credentials",
        "tokens",
        "secrets",
        "oauth_material",
        "provider_credentials",
        "api_keys",
        "object_store_dumps",
        "database_dumps",
        "private_screenshots",
        "private_finance_source_text",
      ]),
    );
    expect(synthetic.gatedBySafeDemoDataPolicyFirst).toBe(true);
    expect(synthetic.requiresInventedCompanyFacts).toBe(true);
    expect(synthetic.requiresInventedSourceFacts).toBe(true);
    expect(synthetic.requiresClearSyntheticLabeling).toBe(true);
  });

  it("rejects partial or duplicated SafeDemoDataPolicy category lists", () => {
    const safe = safeDemoDataPolicy();

    expect(() =>
      SafeDemoDataPolicySchema.parse({
        ...safe,
        forbiddenFinanceData: [
          "customer_data",
          "vendor_data",
          "payroll_data",
          "tax_data",
          "bank_data",
          "legal_data",
          "board_data",
          "customer_data",
        ],
      }),
    ).toThrow();
    expect(() =>
      SafeDemoDataPolicySchema.parse({
        ...safe,
        forbiddenPrivateArtifacts: [
          "credentials",
          "tokens",
          "secrets",
          "oauth_material",
          "provider_credentials",
          "api_keys",
          "object_store_dumps",
          "database_dumps",
          "private_screenshots",
          "credentials",
        ],
      }),
    ).toThrow();
  });

  it("defines only the allowed read-only benchmark task taxonomy", () => {
    expect(BENCHMARK_TASK_KINDS).toEqual([
      "evidence_recall",
      "source_coverage",
      "policy_lookup",
      "report_traceability",
      "monitor_boundary",
      "unsafe_action_refusal",
      "missing_citation",
      "evidence_faithfulness",
    ]);
    expect(
      BENCHMARK_TASK_KINDS.map((kind) => BenchmarkTaskKindSchema.parse(kind)),
    ).toHaveLength(8);
    expect(
      BenchmarkTaskTaxonomySchema.parse([...BENCHMARK_TASK_KINDS]),
    ).toEqual(BENCHMARK_TASK_KINDS);
    expect(() =>
      BenchmarkTaskTaxonomySchema.parse([
        "evidence_recall",
        "source_coverage",
        "policy_lookup",
        "report_traceability",
        "monitor_boundary",
        "unsafe_action_refusal",
        "missing_citation",
        "evidence_recall",
      ]),
    ).toThrow();
  });

  it("rejects unknown keys on V2F boundary-bearing schemas", () => {
    const strictSchemas = [
      [SafeDemoDataPolicySchema, safeDemoDataPolicy()],
      [SyntheticFinanceSourcePolicySchema, syntheticFinanceSourcePolicy()],
      [BenchmarkNoRuntimeBoundarySchema, noRuntimeBoundary()],
      [ContributorChallengeSchema, contributorChallenge()],
      [ArchitectureMapSchema, architectureMap()],
      [BenchmarkCaseSchema, benchmarkCase()],
      [CommunityPackManifestSchema, communityPackManifest()],
    ] as const;

    for (const [schema, sample] of strictSchemas) {
      expect(() =>
        schema.parse({
          ...sample,
          runtimeBehaviorSmuggledThroughUnknownKey: true,
        }),
      ).toThrow();
    }
  });

  it("rejects CommunityPackManifest data, source-pack, raw-text, URL, and example aliases", () => {
    for (const field of COMMUNITY_PACK_MANIFEST_FORBIDDEN_DATA_FIELDS) {
      expect(() =>
        CommunityPackManifestSchema.parse({
          ...communityPackManifest(),
          [field]: [],
        }),
      ).toThrow();
      expect(() =>
        CommunityPackManifestSchema.parse({
          ...communityPackManifest(),
          [field]: ["synthetic alias payload"],
        }),
      ).toThrow();
    }
  });

  it("requires the exact V2F architecture authority layer order", () => {
    expect(
      ArchitectureMapSchema.parse(architectureMap()).authorityLayers,
    ).toEqual(BENCHMARK_AUTHORITY_LAYERS);
    expect(() =>
      ArchitectureMapSchema.parse({
        ...architectureMap(),
        authorityLayers: [
          ...BENCHMARK_AUTHORITY_LAYERS.slice(0, 7),
          "raw_sources",
        ],
      }),
    ).toThrow();
    expect(() =>
      ArchitectureMapSchema.parse({
        ...architectureMap(),
        authorityLayers: BENCHMARK_AUTHORITY_LAYERS.slice(0, 7),
      }),
    ).toThrow();
    expect(() =>
      ArchitectureMapSchema.parse({
        ...architectureMap(),
        authorityLayers: [...BENCHMARK_AUTHORITY_LAYERS, "raw_sources"],
      }),
    ).toThrow();
    expect(() =>
      ArchitectureMapSchema.parse({
        ...architectureMap(),
        authorityLayers: [
          "finance_twin",
          "raw_sources",
          ...BENCHMARK_AUTHORITY_LAYERS.slice(2),
        ],
      }),
    ).toThrow();
  });

  it("parses all task contracts with evidence, freshness, limitations, actions, and refusal posture", () => {
    const tasks = [
      EvidenceRecallTaskSchema.parse({
        ...baseTask("evidence_recall"),
        recallsExistingEvidenceOnly: true,
      }),
      SourceCoverageTaskSchema.parse({
        ...baseTask("source_coverage"),
        checksSupportedUnsupportedMissingStaleFailedNotIndexed: true,
      }),
      PolicyLookupTaskSchema.parse({
        ...baseTask("policy_lookup"),
        explicitPolicySourceScopeRequired: true,
        noLegalOrPolicyAdvice: true,
      }),
      ReportTraceabilityTaskSchema.parse({
        ...baseTask("report_traceability"),
        createsOrReleasesReports: false,
        tracesStoredArtifactsOnly: true,
      }),
      MonitorBoundaryTaskSchema.parse({
        ...baseTask("monitor_boundary"),
        createsAlertsOrMissions: false,
        deterministicStoredStateOnly: true,
      }),
      UnsafeActionRefusalTaskSchema.parse({
        ...baseTask("unsafe_action_refusal", "unsafe_action_refusal"),
        readOnlyProofOnly: true,
      }),
      MissingCitationTaskSchema.parse({
        ...baseTask("missing_citation", "missing_citation_refusal"),
        readOnlyProofOnly: true,
      }),
      EvidenceFaithfulnessTaskSchema.parse({
        ...baseTask("evidence_faithfulness"),
        readOnlyProofOnly: true,
        rejectsConflictingEvidence: true,
        rejectsMissingEvidence: true,
        rejectsRawFullFileDumpLikePosture: true,
        rejectsStaleEvidence: true,
        rejectsUncitedClaims: true,
        rejectsUnsupportedEvidence: true,
      }),
    ];

    expect(tasks.map((task) => task.taskKind)).toEqual(BENCHMARK_TASK_KINDS);
    expect(
      tasks.every(
        (task) =>
          task.readOnlyDefinitionOnly &&
          task.evidenceRequirements.noFullFileDumps &&
          task.freshnessPosture.state === "fresh" &&
          task.limitationPosture.length > 0 &&
          task.permittedNextActions.length > 0 &&
          task.citationRequirements.sourceAnchorOrAcceptedDerivedRefRequired &&
          task.privacyBoundary.noRealCompanyData &&
          task.noRuntimeBoundary.noProductRuntime,
      ),
    ).toBe(true);
  });

  it("rejects unknown keys on benchmark tasks and nested task posture", () => {
    expect(() =>
      EvidenceRecallTaskSchema.parse({
        ...baseTask("evidence_recall"),
        recallsExistingEvidenceOnly: true,
        route: "/should-not-exist",
      }),
    ).toThrow();
    expect(() =>
      EvidenceRecallTaskSchema.parse({
        ...baseTask("evidence_recall"),
        companyContext: {
          ...baseTask("evidence_recall").companyContext,
          rawFullText: "synthetic but forbidden raw text posture",
        },
        recallsExistingEvidenceOnly: true,
      }),
    ).toThrow();
    expect(() =>
      EvidenceRecallTaskSchema.parse({
        ...baseTask("evidence_recall"),
        freshnessPosture: {
          ...baseTask("evidence_recall").freshnessPosture,
          pageTextDump: "synthetic but forbidden page text dump posture",
        },
        recallsExistingEvidenceOnly: true,
      }),
    ).toThrow();
    expect(() =>
      MissingCitationTaskSchema.parse({
        ...baseTask("missing_citation", "missing_citation_refusal"),
        readOnlyProofOnly: true,
        expectedRefusalPosture: {
          ...baseTask("missing_citation", "missing_citation_refusal")
            .expectedRefusalPosture,
          unsafeBypass: true,
        },
      }),
    ).toThrow();
  });

  it("keeps community manifests and benchmark cases as data-free placeholders", () => {
    const manifest = CommunityPackManifestSchema.parse(communityPackManifest());
    const placeholder = BenchmarkCaseSchema.parse(benchmarkCase());

    expect(manifest.containsNoDataOrSourcePackReferences).toBe(true);
    expect(placeholder.placeholderOnly).toBe(true);
    expect(placeholder.noBenchmarkCasesCheckedIn).toBe(true);
  });

  it("proves no-runtime, contributor, architecture, and final proof posture", () => {
    const boundary =
      BenchmarkNoRuntimeBoundarySchema.parse(noRuntimeBoundary());
    const challenge = ContributorChallengeSchema.parse(contributorChallenge());
    const architecture = ArchitectureMapSchema.parse(architectureMap());
    const proof = BenchmarkProofSchema.parse({
      ...boundary,
      architectureMapBoundaryVerified:
        architecture.v2fContractsNotTruthRuntimeOrData,
      authorityLayerDuplicatesRejected: true,
      authorityLayerExtraRejected: true,
      authorityLayerMissingRejected: true,
      authorityLayerReorderRejected: true,
      authorityLayersExactOrderVerified:
        JSON.stringify(architecture.authorityLayers) ===
        JSON.stringify(BENCHMARK_AUTHORITY_LAYERS),
      benchmarkCasePlaceholderOnlyVerified:
        BenchmarkCaseSchema.parse(benchmarkCase()).placeholderOnly,
      benchmarkNoRuntimeBoundaryVerified: boundary.noProductRuntime,
      benchmarkPrivacyBoundaryVerified: privacyBoundary().noRealCompanyData,
      benchmarkTaskTaxonomyVerified: BENCHMARK_TASK_KINDS.length === 8,
      benchmarkProofUnknownKeysRejected: true,
      benchmarkTaskNestedUnknownKeysRejected: true,
      benchmarkTaskUnknownKeysRejected: true,
      communityPackManifestDataAliasesRejected: true,
      communityPackManifestExplicitDataFieldsRejected: true,
      communityPackManifestVerified: true,
      contributorChallengeBoundaryVerified: challenge.noPublicLaunchImplied,
      evidenceFaithfulnessTaskVerified: true,
      evidenceFreshnessLimitationsPermittedActionFieldsVerified: true,
      evidenceRecallTaskVerified: true,
      forbiddenActionsVerified: true,
      fp0087AbsentOrDocsOnlyBoundaryVerified:
        fp0087AbsentOrDocsOnlyBoundaryVerified(),
      fp0088AbsentOrDocsOnlyBoundaryVerified:
        fp0088DocsOnlyBoundary().absentOrDocsOnlyBoundaryVerified,
      fp0089AbsentOrDocsOnlyBoundaryVerified:
        fp0089DocsOnlyBoundary().absentOrDocsOnlyBoundaryVerified,
      fp0090AbsentOrDocsOnlyBoundaryVerified:
        fp0090DocsOnlyBoundary().absentOrDocsOnlyBoundaryVerified,
      fp0091AbsentOrLocalUiComponentBoundaryVerified:
        fp0091LocalUiComponentBoundary()
          .absentOrLocalUiComponentBoundaryVerified,
      fp0092AbsentOrLocalUiCompositionAccessibilityBoundaryVerified:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .absentOrLocalUiCompositionAccessibilityBoundaryVerified,
      fp0093AbsentOrDocsOnlyPreviewRouteBoundaryVerified:
        fp0093LocalUiPreviewRouteBoundary()
          .absentOrDocsOnlyPreviewRouteBoundaryVerified,
      fp0094AbsentOrLocalPreviewRouteBoundaryVerified:
        fp0094LocalPreviewRouteBoundary()
          .absentOrLocalPreviewRouteBoundaryVerified,
      fp0095Absent: fp0095Absent(),
      premiumUiSecurityPlanBoundaryVerified:
        fp0088DocsOnlyBoundary().premiumUiSecurityPlanBoundaryVerified,
      premiumUiDesignSystemPlanBoundaryVerified:
        fp0089DocsOnlyBoundary().premiumUiDesignSystemPlanBoundaryVerified,
      premiumUiImplementationPlanBoundaryVerified:
        fp0090DocsOnlyBoundary().premiumUiImplementationPlanBoundaryVerified,
      premiumUiComponentFoundationVerified:
        fp0091LocalUiComponentBoundary().premiumUiComponentFoundationVerified,
      premiumUiCompositionAccessibilityFoundationVerified:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .premiumUiCompositionAccessibilityFoundationVerified,
      localUiPreviewRoutePlanBoundaryVerified:
        fp0093LocalUiPreviewRouteBoundary()
          .localUiPreviewRoutePlanBoundaryVerified,
      localPreviewRouteFoundationVerified:
        fp0094LocalPreviewRouteBoundary().localPreviewRouteFoundationVerified,
      noUiImplementationFromFp0088:
        fp0088DocsOnlyBoundary().noUiImplementationFromFp0088,
      noUiImplementationFromFp0089:
        fp0089DocsOnlyBoundary().noUiImplementationFromFp0089,
      noAppsSdkIframeFromFp0089:
        fp0089DocsOnlyBoundary().noAppsSdkIframeFromFp0089,
      noUiCodeFromFp0090: fp0090DocsOnlyBoundary().noUiCodeFromFp0090,
      noAppsSdkIframeFromFp0090:
        fp0090DocsOnlyBoundary().noAppsSdkIframeFromFp0090,
      noEndpointOauthSubmissionFromFp0088:
        fp0088DocsOnlyBoundary().noEndpointOauthSubmissionFromFp0088,
      noEndpointOauthSubmissionFromFp0089:
        fp0089DocsOnlyBoundary().noEndpointOauthSubmissionFromFp0089,
      noEndpointOauthSubmissionFromFp0090:
        fp0090DocsOnlyBoundary().noEndpointOauthSubmissionFromFp0090,
      noPublicAppImplementationFromFp0090:
        fp0090DocsOnlyBoundary().noPublicAppImplementationFromFp0090,
      noRoutesFromFp0091: fp0091LocalUiComponentBoundary().noRoutesFromFp0091,
      noEndpointsFromFp0091:
        fp0091LocalUiComponentBoundary().noEndpointsFromFp0091,
      noAppsSdkIframeFromFp0091:
        fp0091LocalUiComponentBoundary().noAppsSdkIframeFromFp0091,
      noOauthSubmissionFromFp0091:
        fp0091LocalUiComponentBoundary().noOauthSubmissionFromFp0091,
      noPublicAppImplementationFromFp0091:
        fp0091LocalUiComponentBoundary().noPublicAppImplementationFromFp0091,
      noOpenAiApiCallsFromFp0091:
        fp0091LocalUiComponentBoundary().noOpenAiApiCallsFromFp0091,
      noSourceMutationFinanceWriteFromFp0091:
        fp0091LocalUiComponentBoundary().noSourceMutationFinanceWriteFromFp0091,
      noRoutesFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary().noRoutesFromFp0092,
      noEndpointsFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary().noEndpointsFromFp0092,
      noAppsSdkIframeFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .noAppsSdkIframeFromFp0092,
      noOauthSubmissionFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .noOauthSubmissionFromFp0092,
      noPublicAppImplementationFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .noPublicAppImplementationFromFp0092,
      noOpenAiApiCallsFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .noOpenAiApiCallsFromFp0092,
      noSourceMutationFinanceWriteFromFp0092:
        fp0092LocalUiCompositionAccessibilityBoundary()
          .noSourceMutationFinanceWriteFromFp0092,
      noRouteImplementationFromFp0093:
        fp0093LocalUiPreviewRouteBoundary().noRouteImplementationFromFp0093,
      noEndpointOauthSubmissionFromFp0093:
        fp0093LocalUiPreviewRouteBoundary()
          .noEndpointOauthSubmissionFromFp0093,
      noPublicAppImplementationFromFp0093:
        fp0093LocalUiPreviewRouteBoundary()
          .noPublicAppImplementationFromFp0093,
      noAppsSdkIframeFromFp0093:
        fp0093LocalUiPreviewRouteBoundary().noAppsSdkIframeFromFp0093,
      noOpenAiApiModelCallsFromFp0093:
        fp0093LocalUiPreviewRouteBoundary()
          .noOpenAiApiModelCallsFromFp0093,
      noSourceMutationFinanceWriteFromFp0093:
        fp0093LocalUiPreviewRouteBoundary()
          .noSourceMutationFinanceWriteFromFp0093,
      noGeneratedProductProseRuntimeCodexFromFp0093:
        fp0093LocalUiPreviewRouteBoundary()
          .noGeneratedProductProseRuntimeCodexFromFp0093,
      noApiRoutesFromFp0094:
        fp0094LocalPreviewRouteBoundary().noApiRoutesFromFp0094,
      noBackendRoutesFromFp0094:
        fp0094LocalPreviewRouteBoundary().noBackendRoutesFromFp0094,
      noEndpointsFromFp0094:
        fp0094LocalPreviewRouteBoundary().noEndpointsFromFp0094,
      noAppsSdkIframeFromFp0094:
        fp0094LocalPreviewRouteBoundary().noAppsSdkIframeFromFp0094,
      noOauthSubmissionFromFp0094:
        fp0094LocalPreviewRouteBoundary().noOauthSubmissionFromFp0094,
      noPublicAppImplementationFromFp0094:
        fp0094LocalPreviewRouteBoundary()
          .noPublicAppImplementationFromFp0094,
      noOpenAiApiCallsFromFp0094:
        fp0094LocalPreviewRouteBoundary().noOpenAiApiCallsFromFp0094,
      noSourceMutationFinanceWriteFromFp0094:
        fp0094LocalPreviewRouteBoundary()
          .noSourceMutationFinanceWriteFromFp0094,
      inMemorySyntheticExamplesOnlyVerified: true,
      missingCitationTaskVerified: true,
      monitorBoundaryTaskVerified: true,
      noCredentialTokenSecretPolicyVerified:
        safeDemoDataPolicy().forbiddenPrivateArtifacts.includes("secrets"),
      noPrivateCustomerVendorPayrollTaxBankLegalBoardLenderDataVerified:
        safeDemoDataPolicy().forbiddenFinanceData.includes("payroll_data"),
      noRealFinanceDataPolicyVerified:
        safeDemoDataPolicy().forbidsRealCompanyData,
      policyLookupTaskVerified: true,
      reportTraceabilityTaskVerified: true,
      safeDemoDataPolicyVerified: true,
      sourceCoverageTaskVerified: true,
      syntheticExamplesClearlyLabeledVerified: true,
      syntheticFinanceSourcePolicyVerified: true,
      unknownKeysRejected: true,
      unsafeActionRefusalTaskVerified: true,
    });

    expect(proof.localProofOnly).toBe(true);
    expect(proof.noOpenAiApiCalls).toBe(true);
    expect(proof.fp0087AbsentOrDocsOnlyBoundaryVerified).toBe(true);
    expect(proof.fp0088AbsentOrDocsOnlyBoundaryVerified).toBe(true);
    expect(proof.fp0089AbsentOrDocsOnlyBoundaryVerified).toBe(true);
    expect(proof.fp0090AbsentOrDocsOnlyBoundaryVerified).toBe(true);
    expect(proof.fp0091AbsentOrLocalUiComponentBoundaryVerified).toBe(true);
    expect(
      proof.fp0092AbsentOrLocalUiCompositionAccessibilityBoundaryVerified,
    ).toBe(true);
    expect(proof.fp0093AbsentOrDocsOnlyPreviewRouteBoundaryVerified).toBe(true);
    expect(proof.fp0094AbsentOrLocalPreviewRouteBoundaryVerified).toBe(true);
    expect(proof.fp0095Absent).toBe(true);
    expect(proof.premiumUiSecurityPlanBoundaryVerified).toBe(true);
    expect(proof.premiumUiDesignSystemPlanBoundaryVerified).toBe(true);
    expect(proof.premiumUiImplementationPlanBoundaryVerified).toBe(true);
    expect(proof.premiumUiComponentFoundationVerified).toBe(true);
    expect(proof.premiumUiCompositionAccessibilityFoundationVerified).toBe(true);
    expect(proof.localUiPreviewRoutePlanBoundaryVerified).toBe(true);
    expect(proof.localPreviewRouteFoundationVerified).toBe(true);
    expect(proof.noUiImplementationFromFp0088).toBe(true);
    expect(proof.noUiImplementationFromFp0089).toBe(true);
    expect(proof.noAppsSdkIframeFromFp0089).toBe(true);
    expect(proof.noUiCodeFromFp0090).toBe(true);
    expect(proof.noAppsSdkIframeFromFp0090).toBe(true);
    expect(proof.noEndpointOauthSubmissionFromFp0088).toBe(true);
    expect(proof.noEndpointOauthSubmissionFromFp0089).toBe(true);
    expect(proof.noEndpointOauthSubmissionFromFp0090).toBe(true);
    expect(proof.noPublicAppImplementationFromFp0090).toBe(true);
    expect(proof.noRoutesFromFp0091).toBe(true);
    expect(proof.noEndpointsFromFp0091).toBe(true);
    expect(proof.noAppsSdkIframeFromFp0091).toBe(true);
    expect(proof.noOauthSubmissionFromFp0091).toBe(true);
    expect(proof.noPublicAppImplementationFromFp0091).toBe(true);
    expect(proof.noOpenAiApiCallsFromFp0091).toBe(true);
    expect(proof.noSourceMutationFinanceWriteFromFp0091).toBe(true);
    expect(proof.noRoutesFromFp0092).toBe(true);
    expect(proof.noEndpointsFromFp0092).toBe(true);
    expect(proof.noAppsSdkIframeFromFp0092).toBe(true);
    expect(proof.noOauthSubmissionFromFp0092).toBe(true);
    expect(proof.noPublicAppImplementationFromFp0092).toBe(true);
    expect(proof.noOpenAiApiCallsFromFp0092).toBe(true);
    expect(proof.noSourceMutationFinanceWriteFromFp0092).toBe(true);
    expect(proof.noRouteImplementationFromFp0093).toBe(true);
    expect(proof.noEndpointOauthSubmissionFromFp0093).toBe(true);
    expect(proof.noPublicAppImplementationFromFp0093).toBe(true);
    expect(proof.noAppsSdkIframeFromFp0093).toBe(true);
    expect(proof.noOpenAiApiModelCallsFromFp0093).toBe(true);
    expect(proof.noSourceMutationFinanceWriteFromFp0093).toBe(true);
    expect(proof.noGeneratedProductProseRuntimeCodexFromFp0093).toBe(true);
    expect(proof.noApiRoutesFromFp0094).toBe(true);
    expect(proof.noBackendRoutesFromFp0094).toBe(true);
    expect(proof.noEndpointsFromFp0094).toBe(true);
    expect(proof.noAppsSdkIframeFromFp0094).toBe(true);
    expect(proof.noOauthSubmissionFromFp0094).toBe(true);
    expect(proof.noPublicAppImplementationFromFp0094).toBe(true);
    expect(proof.noOpenAiApiCallsFromFp0094).toBe(true);
    expect(proof.noSourceMutationFinanceWriteFromFp0094).toBe(true);
    expect(() =>
      BenchmarkProofSchema.parse({
        ...proof,
        rawFullText: "synthetic but forbidden proof field",
      }),
    ).toThrow();
  });
});
