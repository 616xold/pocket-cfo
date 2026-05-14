import { z } from "zod";
import { EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION } from "./read-only-app-mcp-evidence-tool-dispatch-constants";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const EvidenceToolNoRawDumpBoundarySchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolNoRawDumpBoundary"),
    rawFullFileDumpAllowed: falseLiteral,
    fullSourceTextAllowed: falseLiteral,
    boundedCitedExcerptsOnly: trueLiteral,
    privateFinanceDataDumpAllowed: falseLiteral,
  })
  .strict();

export const EvidenceToolNoMutationBoundarySchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolNoMutationBoundary"),
    sourceMutationAllowed: falseLiteral,
    rawSourceRewriteAllowed: falseLiteral,
    sourcePackMutationAllowed: falseLiteral,
    sourceRegistrationAllowed: falseLiteral,
  })
  .strict();

export const EvidenceToolNoFinanceWriteBoundarySchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolNoFinanceWriteBoundary"),
    financeWriteAllowed: falseLiteral,
    ledgerWriteAllowed: falseLiteral,
    bankWriteAllowed: falseLiteral,
    reportReleaseAllowed: falseLiteral,
    generatedFinanceAdviceAllowed: falseLiteral,
  })
  .strict();

export const EvidenceToolNoProviderExternalCallBoundarySchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolNoProviderExternalCallBoundary"),
    providerCallsAllowed: falseLiteral,
    externalCommunicationsAllowed: falseLiteral,
    customerVendorContactAllowed: falseLiteral,
    paymentInstructionAllowed: falseLiteral,
    deploymentOrCertificationAllowed: falseLiteral,
  })
  .strict();

export const EvidenceToolNoOpenAiModelBoundarySchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolNoOpenAiModelBoundary"),
    openAiApiCallsAllowed: falseLiteral,
    modelCallsAllowed: falseLiteral,
    openAiClientOrKeyUsageAllowed: falseLiteral,
    hostedToolsAllowed: falseLiteral,
    modelOutputCanBecomeSourceTruth: falseLiteral,
  })
  .strict();

export const EvidenceToolDispatchProofContractSchema = z
  .object({
    schemaVersion: z.literal(EVIDENCE_TOOL_DISPATCH_SCHEMA_VERSION),
    contractKind: z.literal("EvidenceToolDispatchProofContract"),
    localProofOnly: trueLiteral,
    readOnly: trueLiteral,
    contractOnly: trueLiteral,
    noDispatchRuntimeImplemented: trueLiteral,
    routeAdapterToolsCallStillFailClosed: trueLiteral,
    publicAppSubmissionAssetsListingScopeOpened: falseLiteral,
    fp0109Created: falseLiteral,
  })
  .strict();

export type EvidenceToolDispatchProofContract = z.infer<
  typeof EvidenceToolDispatchProofContractSchema
>;
export type EvidenceToolNoRawDumpBoundary = z.infer<
  typeof EvidenceToolNoRawDumpBoundarySchema
>;
export type EvidenceToolNoMutationBoundary = z.infer<
  typeof EvidenceToolNoMutationBoundarySchema
>;
export type EvidenceToolNoFinanceWriteBoundary = z.infer<
  typeof EvidenceToolNoFinanceWriteBoundarySchema
>;
export type EvidenceToolNoProviderExternalCallBoundary = z.infer<
  typeof EvidenceToolNoProviderExternalCallBoundarySchema
>;
export type EvidenceToolNoOpenAiModelBoundary = z.infer<
  typeof EvidenceToolNoOpenAiModelBoundarySchema
>;
