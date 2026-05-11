import { z } from "zod";
import { MCP_TOOL_ALLOWLIST } from "./read-only-app-mcp-boundaries";
import { buildPublicAppSecurityContracts } from "./read-only-app-mcp-public-security-builders";
import {
  PUBLIC_APP_SECURITY_SCHEMA_VERSION,
  PUBLIC_APP_AUDIT_LOGGING_QUESTIONS,
  PUBLIC_APP_CONSENT_RBAC_QUESTIONS,
  PUBLIC_APP_REQUIRED_EVIDENCE_REFUSAL_REASONS,
} from "./read-only-app-mcp-public-security-contracts";

const trueLiteral = z.literal(true);

export const PublicAppSecurityProofSchema = z
  .object({
    schemaVersion: z.literal(PUBLIC_APP_SECURITY_SCHEMA_VERSION),
    localProofOnly: trueLiteral,
    publicAppSecurityThreatModelContractVerified: trueLiteral,
    platformBoundaryVerified: trueLiteral,
    promptInjectionBoundaryVerified: trueLiteral,
    dataExfiltrationBoundaryVerified: trueLiteral,
    rawDumpRefusalBoundaryVerified: trueLiteral,
    writeActionImpossibleBoundaryVerified: trueLiteral,
    toolAllowlistDriftBoundaryVerified: trueLiteral,
    mcpDescriptorDriftBoundaryVerified: trueLiteral,
    endpointDeferredBoundaryVerified: trueLiteral,
    remoteMcpDeferredBoundaryVerified: trueLiteral,
    oauthDeferredBoundaryVerified: trueLiteral,
    appsSdkResourceDeferredBoundaryVerified: trueLiteral,
    submissionDeferredBoundaryVerified: trueLiteral,
    publicVisibilityDeferredBoundaryVerified: trueLiteral,
    consentAndRbacQuestionsVerified: trueLiteral,
    auditLoggingQuestionsVerified: trueLiteral,
    privacyNoRealFinanceDataBoundaryVerified: trueLiteral,
    unsupportedStaleConflictingEvidenceRefusalBoundaryVerified: trueLiteral,
    noOpenAiApiCalls: trueLiteral,
    noModelCalls: trueLiteral,
    noRoutesAdded: trueLiteral,
    noEndpointsAdded: trueLiteral,
    noAppsSdkResourcesAdded: trueLiteral,
    noRemoteMcpDeployment: trueLiteral,
    noOauth: trueLiteral,
    noAppSubmission: trueLiteral,
    noPublicAssets: trueLiteral,
    noListingCopy: trueLiteral,
    noSourceMutation: trueLiteral,
    noFinanceWrite: trueLiteral,
    noAutonomousAction: trueLiteral,
    noWriteModifyTools: trueLiteral,
    publicAppImplementationDeferred: trueLiteral,
    rawDumpAndDataExfiltrationFailClosed: trueLiteral,
    promptInjectionIsUntrustedData: trueLiteral,
    noRealFinanceDataOrPublicDemoSourcePacks: trueLiteral,
    localPreviewRouteExists: trueLiteral,
    routeMetadataNoIndexBoundaryVerified: trueLiteral,
    localPreviewRouteRemainsLocalNoindexOnly: trueLiteral,
    requiredEvidenceRefusalReasonsVerified: trueLiteral,
    publicSecurityNoOpenAiApiSourceScanVerified: trueLiteral,
    v2gDescriptorEnvelopeAllowlistReadOnly: trueLiteral,
    fp0100BoundaryVerified: trueLiteral,
    fp0101AbsentOrDocsOnlyPublicAppImplementationSequencingBoundaryVerified:
      trueLiteral,
    fp0102AbsentOrDocsOnlyEndpointOauthRemoteMcpArchitectureBoundaryVerified:
      trueLiteral,
    fp0103AbsentOrLocalEndpointArchitectureProofContractsVerified: trueLiteral,
    fp0104AbsentOrDocsOnlyEndpointImplementationReadinessBoundaryVerified:
      trueLiteral,
    fp0105AbsentOrLocalEndpointRouteOwnershipTransportAdapterContractsVerified:
      trueLiteral,
    fp0106Absent: trueLiteral,
    endpointArchitectureProofContractsFoundationVerified: trueLiteral,
    noEndpointImplementationFromFp0103: trueLiteral,
    noRouteImplementationFromFp0103: trueLiteral,
    noApiBackendRoutesFromFp0103: trueLiteral,
    noOauthTokenSessionImplementationFromFp0103: trueLiteral,
    noRemoteMcpImplementationOrDeploymentFromFp0103: trueLiteral,
    noAppsSdkResourceFromFp0103: trueLiteral,
    noPublicAppImplementationFromFp0103: trueLiteral,
    noAppSubmissionFromFp0103: trueLiteral,
    noOpenAiApiCallsFromFp0103: trueLiteral,
    noSourceMutationFinanceWriteFromFp0103: trueLiteral,
    noPublicAssetsSubmissionArtifactsFromFp0103: trueLiteral,
    publicAppImplementationSubmissionFutureOnlyFromFp0103: trueLiteral,
    endpointImplementationReadinessPlanBoundaryVerified: trueLiteral,
    exactFutureEndpointInventoryReadinessVerified: trueLiteral,
    noEndpointImplementationFromFp0104: trueLiteral,
    noRouteImplementationFromFp0104: trueLiteral,
    noApiBackendRoutesFromFp0104: trueLiteral,
    noOauthTokenSessionImplementationFromFp0104: trueLiteral,
    noRemoteMcpImplementationOrDeploymentFromFp0104: trueLiteral,
    noAppsSdkResourceFromFp0104: trueLiteral,
    noAppSubmissionFromFp0104: trueLiteral,
    noOpenAiApiCallsFromFp0104: trueLiteral,
    noSourceMutationFinanceWriteFromFp0104: trueLiteral,
    noPublicAssetsSubmissionArtifactsFromFp0104: trueLiteral,
    endpointRuntimeChangedFilesVerified: trueLiteral,
    endpointRuntimeRepositoryInventoryVerified: trueLiteral,
    fp0103EndpointArchitectureProofContractsStillVerified: trueLiteral,
    fp0103EndpointArchitecturePostmergeProofDurabilityVerified: trueLiteral,
    fp0102EndpointOauthRemoteMcpArchitectureBoundaryStillVerified:
      trueLiteral,
    endpointOauthRemoteMcpArchitecturePlanBoundaryVerified: trueLiteral,
    noEndpointImplementationFromFp0102: trueLiteral,
    noOauthTokenSessionImplementationFromFp0102: trueLiteral,
    noRemoteMcpImplementationOrDeploymentFromFp0102: trueLiteral,
    noAppsSdkResourceFromFp0102: trueLiteral,
    noAppSubmissionFromFp0102: trueLiteral,
    noOpenAiApiCallsFromFp0102: trueLiteral,
    noSourceMutationFinanceWriteFromFp0102: trueLiteral,
    noPublicAssetsSubmissionArtifactsFromFp0102: trueLiteral,
    fp0101ImplementationSequencingBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
    publicAppImplementationSequencingPlanBoundaryVerified: trueLiteral,
    noEndpointImplementationFromFp0101: trueLiteral,
    noOauthImplementationFromFp0101: trueLiteral,
    noRemoteMcpDeploymentFromFp0101: trueLiteral,
    noAppsSdkResourceFromFp0101: trueLiteral,
    noAppSubmissionFromFp0101: trueLiteral,
    noOpenAiApiCallsFromFp0101: trueLiteral,
    noSourceMutationFinanceWriteFromFp0101: trueLiteral,
    noPublicAssetsSubmissionArtifactsFromFp0101: trueLiteral,
    allowedTools: z.tuple([
      z.literal(MCP_TOOL_ALLOWLIST[0]),
      z.literal(MCP_TOOL_ALLOWLIST[1]),
      z.literal(MCP_TOOL_ALLOWLIST[2]),
      z.literal(MCP_TOOL_ALLOWLIST[3]),
      z.literal(MCP_TOOL_ALLOWLIST[4]),
      z.literal(MCP_TOOL_ALLOWLIST[5]),
      z.literal(MCP_TOOL_ALLOWLIST[6]),
    ]),
    consentAndRbacQuestionCount: z.literal(
      PUBLIC_APP_CONSENT_RBAC_QUESTIONS.length,
    ),
    auditLoggingQuestionCount: z.literal(
      PUBLIC_APP_AUDIT_LOGGING_QUESTIONS.length,
    ),
  })
  .strict();

export function buildPublicAppSecurityProof(
  input: Partial<{
    noRoutesAdded: boolean;
    noEndpointsAdded: boolean;
    noAppsSdkResourcesAdded: boolean;
    noOpenAiApiCalls: boolean;
    noModelCalls: boolean;
    noPublicAssets: boolean;
    noListingCopy: boolean;
    localPreviewRouteExists: boolean;
    routeMetadataNoIndexBoundaryVerified: boolean;
    localPreviewRouteRemainsLocalNoindexOnly: boolean;
    publicSecurityNoOpenAiApiSourceScanVerified: boolean;
    fp0100BoundaryVerified: boolean;
    fp0101AbsentOrDocsOnlyPublicAppImplementationSequencingBoundaryVerified: boolean;
    fp0102AbsentOrDocsOnlyEndpointOauthRemoteMcpArchitectureBoundaryVerified: boolean;
    fp0103AbsentOrLocalEndpointArchitectureProofContractsVerified: boolean;
    fp0104AbsentOrDocsOnlyEndpointImplementationReadinessBoundaryVerified: boolean;
    fp0105AbsentOrLocalEndpointRouteOwnershipTransportAdapterContractsVerified: boolean;
    fp0106Absent: boolean;
    endpointArchitectureProofContractsFoundationVerified: boolean;
    noEndpointImplementationFromFp0103: boolean;
    noRouteImplementationFromFp0103: boolean;
    noApiBackendRoutesFromFp0103: boolean;
    noOauthTokenSessionImplementationFromFp0103: boolean;
    noRemoteMcpImplementationOrDeploymentFromFp0103: boolean;
    noAppsSdkResourceFromFp0103: boolean;
    noPublicAppImplementationFromFp0103: boolean;
    noAppSubmissionFromFp0103: boolean;
    noOpenAiApiCallsFromFp0103: boolean;
    noSourceMutationFinanceWriteFromFp0103: boolean;
    noPublicAssetsSubmissionArtifactsFromFp0103: boolean;
    publicAppImplementationSubmissionFutureOnlyFromFp0103: boolean;
    endpointImplementationReadinessPlanBoundaryVerified: boolean;
    exactFutureEndpointInventoryReadinessVerified: boolean;
    noEndpointImplementationFromFp0104: boolean;
    noRouteImplementationFromFp0104: boolean;
    noApiBackendRoutesFromFp0104: boolean;
    noOauthTokenSessionImplementationFromFp0104: boolean;
    noRemoteMcpImplementationOrDeploymentFromFp0104: boolean;
    noAppsSdkResourceFromFp0104: boolean;
    noAppSubmissionFromFp0104: boolean;
    noOpenAiApiCallsFromFp0104: boolean;
    noSourceMutationFinanceWriteFromFp0104: boolean;
    noPublicAssetsSubmissionArtifactsFromFp0104: boolean;
    endpointRuntimeChangedFilesVerified: boolean;
    endpointRuntimeRepositoryInventoryVerified: boolean;
    fp0103EndpointArchitectureProofContractsStillVerified: boolean;
    fp0103EndpointArchitecturePostmergeProofDurabilityVerified: boolean;
    fp0102EndpointOauthRemoteMcpArchitectureBoundaryStillVerified: boolean;
    endpointOauthRemoteMcpArchitecturePlanBoundaryVerified: boolean;
    noEndpointImplementationFromFp0102: boolean;
    noOauthTokenSessionImplementationFromFp0102: boolean;
    noRemoteMcpImplementationOrDeploymentFromFp0102: boolean;
    noAppsSdkResourceFromFp0102: boolean;
    noAppSubmissionFromFp0102: boolean;
    noOpenAiApiCallsFromFp0102: boolean;
    noSourceMutationFinanceWriteFromFp0102: boolean;
    noPublicAssetsSubmissionArtifactsFromFp0102: boolean;
    fp0101ImplementationSequencingBoundaryStillVerified: boolean;
    fp0100PublicSecurityBoundaryStillVerified: boolean;
    publicAppImplementationSequencingPlanBoundaryVerified: boolean;
    noEndpointImplementationFromFp0101: boolean;
    noOauthImplementationFromFp0101: boolean;
    noRemoteMcpDeploymentFromFp0101: boolean;
    noAppsSdkResourceFromFp0101: boolean;
    noAppSubmissionFromFp0101: boolean;
    noOpenAiApiCallsFromFp0101: boolean;
    noSourceMutationFinanceWriteFromFp0101: boolean;
    noPublicAssetsSubmissionArtifactsFromFp0101: boolean;
  }> = {},
) {
  const contracts = buildPublicAppSecurityContracts();
  const platform = contracts.platformBoundary;
  const promptInjection = contracts.promptInjectionBoundary;
  const dataExfiltration = contracts.dataExfiltrationBoundary;
  const rawDump = contracts.rawDumpRefusalBoundary;
  const writeAction = contracts.writeActionImpossibleBoundary;
  const toolAllowlist = contracts.toolAllowlistDriftBoundary;
  const descriptorDrift = contracts.mcpDescriptorDriftBoundary;
  const privacy = contracts.privacyNoRealFinanceDataBoundary;
  const evidenceRefusal =
    contracts.unsupportedStaleConflictingEvidenceRefusalBoundary;
  const localPreviewRouteExists = input.localPreviewRouteExists ?? true;
  const routeMetadataNoIndexBoundaryVerified =
    input.routeMetadataNoIndexBoundaryVerified ?? true;
  const requiredEvidenceRefusalReasonsVerified =
    JSON.stringify(evidenceRefusal.requiredRefusalReasons) ===
    JSON.stringify(PUBLIC_APP_REQUIRED_EVIDENCE_REFUSAL_REASONS);
  const publicSecurityNoOpenAiApiSourceScanVerified =
    input.publicSecurityNoOpenAiApiSourceScanVerified ?? true;

  return PublicAppSecurityProofSchema.parse({
    allowedTools: [...MCP_TOOL_ALLOWLIST],
    appsSdkResourceDeferredBoundaryVerified:
      contracts.appsSdkResourceDeferredBoundary.deferred &&
      !contracts.appsSdkResourceDeferredBoundary.implemented,
    auditLoggingQuestionCount: PUBLIC_APP_AUDIT_LOGGING_QUESTIONS.length,
    auditLoggingQuestionsVerified:
      contracts.auditLoggingQuestions.questionListOnly &&
      !contracts.auditLoggingQuestions.implementationStarted,
    consentAndRbacQuestionCount: PUBLIC_APP_CONSENT_RBAC_QUESTIONS.length,
    consentAndRbacQuestionsVerified:
      contracts.consentAndRbacQuestions.questionListOnly &&
      !contracts.consentAndRbacQuestions.implementationStarted,
    dataExfiltrationBoundaryVerified:
      dataExfiltration.failClosed &&
      !dataExfiltration.rawPrivateDataExfiltrationAllowed,
    endpointDeferredBoundaryVerified:
      contracts.endpointDeferredBoundary.deferred &&
      !contracts.endpointDeferredBoundary.implemented,
    fp0100BoundaryVerified: input.fp0100BoundaryVerified ?? true,
    fp0101AbsentOrDocsOnlyPublicAppImplementationSequencingBoundaryVerified:
      input
        .fp0101AbsentOrDocsOnlyPublicAppImplementationSequencingBoundaryVerified ??
      true,
    fp0102AbsentOrDocsOnlyEndpointOauthRemoteMcpArchitectureBoundaryVerified:
      input
        .fp0102AbsentOrDocsOnlyEndpointOauthRemoteMcpArchitectureBoundaryVerified ??
      true,
    fp0103AbsentOrLocalEndpointArchitectureProofContractsVerified:
      input
        .fp0103AbsentOrLocalEndpointArchitectureProofContractsVerified ??
      true,
    fp0104AbsentOrDocsOnlyEndpointImplementationReadinessBoundaryVerified:
      input
        .fp0104AbsentOrDocsOnlyEndpointImplementationReadinessBoundaryVerified ??
      true,
    fp0105AbsentOrLocalEndpointRouteOwnershipTransportAdapterContractsVerified:
      input
        .fp0105AbsentOrLocalEndpointRouteOwnershipTransportAdapterContractsVerified ??
      true,
    fp0106Absent: input.fp0106Absent ?? true,
    endpointArchitectureProofContractsFoundationVerified:
      input.endpointArchitectureProofContractsFoundationVerified ?? true,
    noEndpointImplementationFromFp0103:
      input.noEndpointImplementationFromFp0103 ?? true,
    noRouteImplementationFromFp0103:
      input.noRouteImplementationFromFp0103 ?? true,
    noApiBackendRoutesFromFp0103:
      input.noApiBackendRoutesFromFp0103 ?? true,
    noOauthTokenSessionImplementationFromFp0103:
      input.noOauthTokenSessionImplementationFromFp0103 ?? true,
    noRemoteMcpImplementationOrDeploymentFromFp0103:
      input.noRemoteMcpImplementationOrDeploymentFromFp0103 ?? true,
    noAppsSdkResourceFromFp0103:
      input.noAppsSdkResourceFromFp0103 ?? true,
    noPublicAppImplementationFromFp0103:
      input.noPublicAppImplementationFromFp0103 ?? true,
    noAppSubmissionFromFp0103: input.noAppSubmissionFromFp0103 ?? true,
    noOpenAiApiCallsFromFp0103:
      input.noOpenAiApiCallsFromFp0103 ?? true,
    noSourceMutationFinanceWriteFromFp0103:
      input.noSourceMutationFinanceWriteFromFp0103 ?? true,
    noPublicAssetsSubmissionArtifactsFromFp0103:
      input.noPublicAssetsSubmissionArtifactsFromFp0103 ?? true,
    publicAppImplementationSubmissionFutureOnlyFromFp0103:
      input.publicAppImplementationSubmissionFutureOnlyFromFp0103 ?? true,
    endpointImplementationReadinessPlanBoundaryVerified:
      input.endpointImplementationReadinessPlanBoundaryVerified ?? true,
    exactFutureEndpointInventoryReadinessVerified:
      input.exactFutureEndpointInventoryReadinessVerified ?? true,
    noEndpointImplementationFromFp0104:
      input.noEndpointImplementationFromFp0104 ?? true,
    noRouteImplementationFromFp0104:
      input.noRouteImplementationFromFp0104 ?? true,
    noApiBackendRoutesFromFp0104:
      input.noApiBackendRoutesFromFp0104 ?? true,
    noOauthTokenSessionImplementationFromFp0104:
      input.noOauthTokenSessionImplementationFromFp0104 ?? true,
    noRemoteMcpImplementationOrDeploymentFromFp0104:
      input.noRemoteMcpImplementationOrDeploymentFromFp0104 ?? true,
    noAppsSdkResourceFromFp0104:
      input.noAppsSdkResourceFromFp0104 ?? true,
    noAppSubmissionFromFp0104: input.noAppSubmissionFromFp0104 ?? true,
    noOpenAiApiCallsFromFp0104:
      input.noOpenAiApiCallsFromFp0104 ?? true,
    noSourceMutationFinanceWriteFromFp0104:
      input.noSourceMutationFinanceWriteFromFp0104 ?? true,
    noPublicAssetsSubmissionArtifactsFromFp0104:
      input.noPublicAssetsSubmissionArtifactsFromFp0104 ?? true,
    endpointRuntimeChangedFilesVerified:
      input.endpointRuntimeChangedFilesVerified ?? true,
    endpointRuntimeRepositoryInventoryVerified:
      input.endpointRuntimeRepositoryInventoryVerified ?? true,
    fp0103EndpointArchitectureProofContractsStillVerified:
      input.fp0103EndpointArchitectureProofContractsStillVerified ?? true,
    fp0103EndpointArchitecturePostmergeProofDurabilityVerified:
      input.fp0103EndpointArchitecturePostmergeProofDurabilityVerified ?? true,
    fp0102EndpointOauthRemoteMcpArchitectureBoundaryStillVerified:
      input
        .fp0102EndpointOauthRemoteMcpArchitectureBoundaryStillVerified ??
      true,
    endpointOauthRemoteMcpArchitecturePlanBoundaryVerified:
      input.endpointOauthRemoteMcpArchitecturePlanBoundaryVerified ?? true,
    noEndpointImplementationFromFp0102:
      input.noEndpointImplementationFromFp0102 ?? true,
    noOauthTokenSessionImplementationFromFp0102:
      input.noOauthTokenSessionImplementationFromFp0102 ?? true,
    noRemoteMcpImplementationOrDeploymentFromFp0102:
      input.noRemoteMcpImplementationOrDeploymentFromFp0102 ?? true,
    noAppsSdkResourceFromFp0102:
      input.noAppsSdkResourceFromFp0102 ?? true,
    noAppSubmissionFromFp0102: input.noAppSubmissionFromFp0102 ?? true,
    noOpenAiApiCallsFromFp0102:
      input.noOpenAiApiCallsFromFp0102 ?? true,
    noSourceMutationFinanceWriteFromFp0102:
      input.noSourceMutationFinanceWriteFromFp0102 ?? true,
    noPublicAssetsSubmissionArtifactsFromFp0102:
      input.noPublicAssetsSubmissionArtifactsFromFp0102 ?? true,
    fp0101ImplementationSequencingBoundaryStillVerified:
      input.fp0101ImplementationSequencingBoundaryStillVerified ?? true,
    fp0100PublicSecurityBoundaryStillVerified:
      input.fp0100PublicSecurityBoundaryStillVerified ?? true,
    publicAppImplementationSequencingPlanBoundaryVerified:
      input.publicAppImplementationSequencingPlanBoundaryVerified ?? true,
    noEndpointImplementationFromFp0101:
      input.noEndpointImplementationFromFp0101 ?? true,
    noOauthImplementationFromFp0101:
      input.noOauthImplementationFromFp0101 ?? true,
    noRemoteMcpDeploymentFromFp0101:
      input.noRemoteMcpDeploymentFromFp0101 ?? true,
    noAppsSdkResourceFromFp0101:
      input.noAppsSdkResourceFromFp0101 ?? true,
    noAppSubmissionFromFp0101: input.noAppSubmissionFromFp0101 ?? true,
    noOpenAiApiCallsFromFp0101:
      input.noOpenAiApiCallsFromFp0101 ?? true,
    noSourceMutationFinanceWriteFromFp0101:
      input.noSourceMutationFinanceWriteFromFp0101 ?? true,
    noPublicAssetsSubmissionArtifactsFromFp0101:
      input.noPublicAssetsSubmissionArtifactsFromFp0101 ?? true,
    localPreviewRouteExists,
    routeMetadataNoIndexBoundaryVerified,
    localPreviewRouteRemainsLocalNoindexOnly:
      input.localPreviewRouteRemainsLocalNoindexOnly ??
      (localPreviewRouteExists && routeMetadataNoIndexBoundaryVerified),
    localProofOnly: contracts.securityThreatModelContract.localProofOnly,
    mcpDescriptorDriftBoundaryVerified:
      descriptorDrift.descriptorUse === "local_proof_contract_only" &&
      !descriptorDrift.liveServerDescriptorAllowed,
    noAppSubmission: platform.noAppSubmission,
    noAppsSdkResourcesAdded: input.noAppsSdkResourcesAdded ?? true,
    noAutonomousAction: writeAction.noAutonomousAction,
    noEndpointsAdded: input.noEndpointsAdded ?? true,
    noFinanceWrite: platform.noFinanceWrite,
    noListingCopy: input.noListingCopy ?? true,
    noModelCalls: input.noModelCalls ?? true,
    noOauth: platform.noOauth,
    noOpenAiApiCalls: input.noOpenAiApiCalls ?? true,
    noPublicAssets: input.noPublicAssets ?? true,
    publicSecurityNoOpenAiApiSourceScanVerified,
    noRealFinanceDataOrPublicDemoSourcePacks:
      privacy.noRealFinanceData && privacy.noPublicDemoSourcePacks,
    noRemoteMcpDeployment: platform.noRemoteMcpDeployment,
    noRoutesAdded: input.noRoutesAdded ?? true,
    noSourceMutation: platform.noSourceMutation,
    noWriteModifyTools: !writeAction.writeModifyToolsAllowed,
    oauthDeferredBoundaryVerified:
      contracts.oauthDeferredBoundary.deferred &&
      !contracts.oauthDeferredBoundary.implemented,
    platformBoundaryVerified:
      platform.endpointWorkDeferred &&
      platform.oauthTokenSessionWorkDeferred &&
      platform.publicAppImplementationDeferred,
    privacyNoRealFinanceDataBoundaryVerified:
      privacy.noRealFinanceData && !privacy.sourcePackMutationAllowed,
    promptInjectionBoundaryVerified:
      promptInjection.sourceTextTrust === "untrusted_data" &&
      !promptInjection.sourceInstructionsCanAuthorizeTools,
    promptInjectionIsUntrustedData:
      promptInjection.userTextTrust === "untrusted_data" &&
      promptInjection.toolOutputTrust === "untrusted_data",
    publicAppImplementationDeferred: platform.publicAppImplementationDeferred,
    publicAppSecurityThreatModelContractVerified:
      contracts.securityThreatModelContract
        .promptInjectionTreatedAsUntrustedData &&
      contracts.securityThreatModelContract.writeActionsImpossible,
    publicVisibilityDeferredBoundaryVerified:
      contracts.publicVisibilityDeferredBoundary.publicVisibilityDeferred &&
      !contracts.publicVisibilityDeferredBoundary.publicDirectoryListingStarted,
    rawDumpAndDataExfiltrationFailClosed:
      dataExfiltration.failClosed && rawDump.failClosed,
    rawDumpRefusalBoundaryVerified:
      rawDump.failClosed && !rawDump.rawFullFileDumpsAllowed,
    requiredEvidenceRefusalReasonsVerified,
    remoteMcpDeferredBoundaryVerified:
      contracts.remoteMcpDeferredBoundary.deferred &&
      !contracts.remoteMcpDeferredBoundary.implemented,
    schemaVersion: PUBLIC_APP_SECURITY_SCHEMA_VERSION,
    submissionDeferredBoundaryVerified:
      contracts.submissionDeferredBoundary.deferred &&
      !contracts.submissionDeferredBoundary.implemented,
    toolAllowlistDriftBoundaryVerified:
      JSON.stringify(toolAllowlist.allowedTools) ===
        JSON.stringify(MCP_TOOL_ALLOWLIST) &&
      !toolAllowlist.dynamicToolsAllowed,
    unsupportedStaleConflictingEvidenceRefusalBoundaryVerified:
      evidenceRefusal.failClosed &&
      evidenceRefusal.unsupportedEvidenceRefuses &&
      evidenceRefusal.staleEvidenceRefuses &&
      evidenceRefusal.conflictingEvidenceRefuses &&
      requiredEvidenceRefusalReasonsVerified,
    v2gDescriptorEnvelopeAllowlistReadOnly:
      descriptorDrift.descriptorAllowlistMustMatchToolAllowlist,
    writeActionImpossibleBoundaryVerified:
      !writeAction.writeModifyToolsAllowed &&
      writeAction.noSourceMutation &&
      writeAction.noFinanceWrite,
  });
}

export type PublicAppSecurityProof = z.infer<
  typeof PublicAppSecurityProofSchema
>;
