import {
  APP_REFUSAL_REASONS,
  APP_RESPONSE_REQUIRED_FIELDS,
  APP_THREAT_MODEL_QUESTIONS,
  MCP_TOOL_ALLOWLIST,
  buildAppAuthorityBoundary,
} from "./read-only-app-mcp";

export const schemaVersion = "v2g.read-only-app-mcp.v1";
export const responseRequiredFields = [...APP_RESPONSE_REQUIRED_FIELDS];

export function appPlanInput(noRuntimeBoundary: unknown) {
  return {
    allowedTools: [...MCP_TOOL_ALLOWLIST],
    appSubmissionStarted: false,
    appsSdkUiImplemented: false,
    authorityBoundary: buildAppAuthorityBoundary(),
    contractOnly: true,
    forbiddenTools: ["send_report", "provider_call", "submit_app"],
    hostedToolsAllowed: false,
    localProofOnly: true,
    modelCallsAllowed: false,
    noRuntimeBoundary,
    oauthImplemented: false,
    openAiApiCallsAllowed: false,
    planKind: "ReadOnlyChatGptAppPlan",
    publicChatGptAppImplemented: false,
    responseRequiredFields,
    schemaVersion,
  };
}

export function evidenceQueryInput() {
  return {
    boundedExcerptsOnly: true,
    maxExcerptCharacters: 240,
    modelCallsAllowed: false,
    openAiApiCallsAllowed: false,
    queryKind: "AppEvidenceQuery",
    queryText: "synthetic evidence posture",
    rawFullFileDumpsAllowed: false,
    readsEvidenceMetadataOnly: true,
    requiresCitations: true,
    responseRequiredFields,
    schemaVersion,
    vectorFileSearchAllowed: false,
  };
}

export function evidenceFetchInput() {
  return {
    artifactId: "synthetic-evidence-card",
    boundedExcerptsOnly: true,
    existingArtifactOnly: true,
    fetchKind: "evidence_card",
    rawFullFileDumpsAllowed: false,
    requiresCitations: true,
    responseRequiredFields,
    schemaVersion,
    sourceMutationAllowed: false,
  };
}

export function sourceCoverageInput() {
  return {
    createsSourceCoverage: false,
    existingCoverageOnly: true,
    fetchKind: "source_coverage",
    freshness: freshness(),
    limitations: [limitation()],
    mutatesSourcePacks: false,
    responseRequiredFields,
    returnsFreshnessPosture: true,
    returnsUnsupportedMissingStalePosture: true,
    schemaVersion,
  };
}

export function capabilityBoundaryInput() {
  return {
    allowedTools: [...MCP_TOOL_ALLOWLIST],
    fetchKind: "capability_boundaries",
    forbiddenTools: ["send_report", "provider_call", "submit_app"],
    noWriteOrActionTools: true,
    permittedNextActions: [humanReviewAction()],
    responseRequiredFields,
    returnsForbiddenActions: true,
    returnsLimitations: true,
    returnsPermittedNextActions: true,
    schemaVersion,
  };
}

export function refusalPostureInput() {
  return {
    conflictingEvidenceRefuses: true,
    dataExfiltrationRefuses: true,
    failClosed: true,
    missingCitationRefuses: true,
    promptInjectionRefuses: true,
    rawFullFileDumpRequestRefuses: true,
    realFinanceDataPublicDemoBoundaryRefuses: true,
    requiredFailClosedReasons: [...APP_REFUSAL_REASONS],
    schemaVersion,
    staleEvidenceRefuses: true,
    unsafeActionRefuses: true,
    unsupportedEvidenceRefuses: true,
  };
}

export function oauthBoundaryInput() {
  return {
    oauthDeferred: true,
    oauthImplemented: false,
    requiresLaterFinancePlan: true,
    requiresLaterThreatModel: true,
    schemaVersion,
  };
}

export function submissionBoundaryInput() {
  return {
    appSubmissionDeferred: true,
    appSubmissionStarted: false,
    requiresLaterAppSubmissionFinancePlan: true,
    requiresLocalProofGreen: true,
    requiresPrivacyDocsGreen: true,
    requiresSecurityDocsGreen: true,
    requiresV2fBenchmarkPostureGreen: true,
    schemaVersion,
  };
}

export function providerCertificationBoundaryInput() {
  return {
    certificationDeferred: true,
    customerContactDeferred: true,
    deliveryDeferred: true,
    externalCommunicationsDeferred: true,
    legalAuditTaxAdviceDeferred: true,
    paymentDeferred: true,
    providerIntegrationDeferred: true,
    schemaVersion,
  };
}

export function proofPlanInput() {
  return {
    directProofCommand: "tools/read-only-chatgpt-app-mcp-proof.mjs",
    inMemorySyntheticExamplesOnly: true,
    machineReadableJson: true,
    noPackageScriptOrSmokeAlias: true,
    proofKind: "AppProofPlan",
    provesExactAllowlist: true,
    provesForbiddenTools: true,
    provesNoFixturesDatasetsSampleDataOrSourcePacks: true,
    provesNoOpenAiApiOrModelCalls: true,
    provesRefusalPrivacyNoRuntimeBoundaries: true,
    schemaVersion,
  };
}

export function threatModelQuestionsInput() {
  return {
    contractOnlyQuestionList: true,
    implementationStarted: false,
    questions: [...APP_THREAT_MODEL_QUESTIONS],
    schemaVersion,
  };
}

export function freshness() {
  const checkedAt = "2026-05-09T00:00:00.000Z";
  return {
    checkedAt,
    compiledAt: checkedAt,
    extractedAt: checkedAt,
    sourceCapturedAt: checkedAt,
    state: "fresh" as const,
    summary: "Fresh synthetic V2G contract posture.",
  };
}

export function limitation() {
  return {
    affectedAnchorIds: [],
    affectedSourceIds: [],
    code: "not_source_truth" as const,
    severity: "blocking" as const,
    summary: "V2G app/MCP contracts are future wrappers, not source truth.",
  };
}

export function humanReviewAction() {
  return {
    action: "request_human_review" as const,
    label: "Review V2G read-only app/MCP contract posture.",
    targetId: "v2g-read-only-app-mcp",
  };
}
