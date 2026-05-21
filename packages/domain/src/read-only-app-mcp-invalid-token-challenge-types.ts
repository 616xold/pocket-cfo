import type { z } from "zod";
import type {
  McpInvalidTokenChallengeProofContractSchema,
  McpInvalidTokenChallengeProofSchema,
  McpInvalidTokenFailureTaxonomyBoundarySchema,
  McpInvalidTokenJsonRpcRefusalBoundarySchema,
  McpInvalidTokenMissingTokenPostureBoundarySchema,
  McpInvalidTokenNoRouteRuntimeBoundarySchema,
  McpInvalidTokenNoTokenEchoBoundarySchema,
  McpInvalidTokenProtectedMetadataPostureBoundarySchema,
  McpInvalidTokenResourceMetadataAlignmentBoundarySchema,
  McpInvalidTokenScopeChallengeBoundarySchema,
  McpInvalidTokenStatusMappingBoundarySchema,
  McpInvalidTokenTestDoubleNoRouteConsumptionBoundarySchema,
  McpInvalidTokenWwwAuthenticateBoundarySchema,
} from "./read-only-app-mcp-invalid-token-challenge-contracts";

export type McpInvalidTokenChallengeProofContract = z.infer<
  typeof McpInvalidTokenChallengeProofContractSchema
>;
export type McpInvalidTokenFailureTaxonomyBoundary = z.infer<
  typeof McpInvalidTokenFailureTaxonomyBoundarySchema
>;
export type McpInvalidTokenStatusMappingBoundary = z.infer<
  typeof McpInvalidTokenStatusMappingBoundarySchema
>;
export type McpInvalidTokenWwwAuthenticateBoundary = z.infer<
  typeof McpInvalidTokenWwwAuthenticateBoundarySchema
>;
export type McpInvalidTokenResourceMetadataAlignmentBoundary = z.infer<
  typeof McpInvalidTokenResourceMetadataAlignmentBoundarySchema
>;
export type McpInvalidTokenScopeChallengeBoundary = z.infer<
  typeof McpInvalidTokenScopeChallengeBoundarySchema
>;
export type McpInvalidTokenJsonRpcRefusalBoundary = z.infer<
  typeof McpInvalidTokenJsonRpcRefusalBoundarySchema
>;
export type McpInvalidTokenNoTokenEchoBoundary = z.infer<
  typeof McpInvalidTokenNoTokenEchoBoundarySchema
>;
export type McpInvalidTokenNoRouteRuntimeBoundary = z.infer<
  typeof McpInvalidTokenNoRouteRuntimeBoundarySchema
>;
export type McpInvalidTokenTestDoubleNoRouteConsumptionBoundary = z.infer<
  typeof McpInvalidTokenTestDoubleNoRouteConsumptionBoundarySchema
>;
export type McpInvalidTokenMissingTokenPostureBoundary = z.infer<
  typeof McpInvalidTokenMissingTokenPostureBoundarySchema
>;
export type McpInvalidTokenProtectedMetadataPostureBoundary = z.infer<
  typeof McpInvalidTokenProtectedMetadataPostureBoundarySchema
>;
export type McpInvalidTokenChallengeProof = z.infer<
  typeof McpInvalidTokenChallengeProofSchema
>;
