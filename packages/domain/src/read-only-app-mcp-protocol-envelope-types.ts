import type { z } from "zod";
import type {
  McpProtocolAcceptedMethodsBoundarySchema,
  McpProtocolEnvelopeProofContractSchema,
  McpProtocolInitializeBoundarySchema,
  McpProtocolPathBoundarySchema,
  McpProtocolReadOnlyToolAllowlistBoundarySchema,
  McpProtocolRejectedMethodsBoundarySchema,
  McpProtocolToolsCallBoundarySchema,
  McpProtocolToolsListBoundarySchema,
  McpProtocolTransportBoundarySchema,
} from "./read-only-app-mcp-protocol-envelope-core-schemas";
import type {
  McpProtocolArgumentValidationBoundarySchema,
  McpProtocolAuthDeferredBoundarySchema,
  McpProtocolEvidenceEnvelopeBoundarySchema,
  McpProtocolInvalidToolFailClosedBoundarySchema,
  McpProtocolLoggingRedactionBoundarySchema,
  McpProtocolNoOpenAiApiModelCallsBoundarySchema,
  McpProtocolNoRouteImplementationBoundarySchema,
  McpProtocolNoRuntimeImplementationBoundarySchema,
  McpProtocolRefusalEnvelopeBoundarySchema,
  McpProtocolStructuredContentBoundarySchema,
  McpProtocolToolSchemaBoundarySchema,
} from "./read-only-app-mcp-protocol-envelope-result-schemas";

export type McpProtocolEnvelopeProofContract = z.infer<
  typeof McpProtocolEnvelopeProofContractSchema
>;
export type McpProtocolPathBoundary = z.infer<
  typeof McpProtocolPathBoundarySchema
>;
export type McpProtocolTransportBoundary = z.infer<
  typeof McpProtocolTransportBoundarySchema
>;
export type McpProtocolAcceptedMethodsBoundary = z.infer<
  typeof McpProtocolAcceptedMethodsBoundarySchema
>;
export type McpProtocolRejectedMethodsBoundary = z.infer<
  typeof McpProtocolRejectedMethodsBoundarySchema
>;
export type McpProtocolInitializeBoundary = z.infer<
  typeof McpProtocolInitializeBoundarySchema
>;
export type McpProtocolToolsListBoundary = z.infer<
  typeof McpProtocolToolsListBoundarySchema
>;
export type McpProtocolToolsCallBoundary = z.infer<
  typeof McpProtocolToolsCallBoundarySchema
>;
export type McpProtocolReadOnlyToolAllowlistBoundary = z.infer<
  typeof McpProtocolReadOnlyToolAllowlistBoundarySchema
>;
export type McpProtocolToolSchemaBoundary = z.infer<
  typeof McpProtocolToolSchemaBoundarySchema
>;
export type McpProtocolStructuredContentBoundary = z.infer<
  typeof McpProtocolStructuredContentBoundarySchema
>;
export type McpProtocolEvidenceEnvelopeBoundary = z.infer<
  typeof McpProtocolEvidenceEnvelopeBoundarySchema
>;
export type McpProtocolRefusalEnvelopeBoundary = z.infer<
  typeof McpProtocolRefusalEnvelopeBoundarySchema
>;
export type McpProtocolArgumentValidationBoundary = z.infer<
  typeof McpProtocolArgumentValidationBoundarySchema
>;
export type McpProtocolInvalidToolFailClosedBoundary = z.infer<
  typeof McpProtocolInvalidToolFailClosedBoundarySchema
>;
export type McpProtocolAuthDeferredBoundary = z.infer<
  typeof McpProtocolAuthDeferredBoundarySchema
>;
export type McpProtocolLoggingRedactionBoundary = z.infer<
  typeof McpProtocolLoggingRedactionBoundarySchema
>;
export type McpProtocolNoRouteImplementationBoundary = z.infer<
  typeof McpProtocolNoRouteImplementationBoundarySchema
>;
export type McpProtocolNoRuntimeImplementationBoundary = z.infer<
  typeof McpProtocolNoRuntimeImplementationBoundarySchema
>;
export type McpProtocolNoOpenAiApiModelCallsBoundary = z.infer<
  typeof McpProtocolNoOpenAiApiModelCallsBoundarySchema
>;
