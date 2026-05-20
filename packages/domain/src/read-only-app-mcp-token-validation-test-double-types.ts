import type { z } from "zod";
import type {
  McpAcceptedValidationResultTestDoubleBoundarySchema,
  McpAudienceResourceScenarioTestDoubleBoundarySchema,
  McpFailureTaxonomyTestDoubleBoundarySchema,
  McpIssuerScenarioTestDoubleBoundarySchema,
  McpNoJwtLikeExampleBoundarySchema,
  McpNoRealTokenExampleBoundarySchema,
  McpNoRuntimeConsumptionBoundarySchema,
  McpNoTokenLeakageTestDoubleBoundarySchema,
  McpNoTokenPassthroughTestDoubleBoundarySchema,
  McpRejectedValidationResultTestDoubleBoundarySchema,
  McpRevocationReplayScenarioTestDoubleBoundarySchema,
  McpScopeScenarioTestDoubleBoundarySchema,
  McpSelectorOnlyCompanyKeyTestDoubleBoundarySchema,
  McpSubjectOrgCompanyScenarioTestDoubleBoundarySchema,
  McpSyntheticNonTokenInputBoundarySchema,
  McpSyntheticValidationScenarioBoundarySchema,
  McpTemporalScenarioTestDoubleBoundarySchema,
  McpTokenValidationTestDoubleProofContractSchema,
  McpTokenValidationTestDoubleProofSchema,
} from "./read-only-app-mcp-token-validation-test-double-contracts";

export type McpTokenValidationTestDoubleProof = z.infer<
  typeof McpTokenValidationTestDoubleProofSchema
>;
export type McpTokenValidationTestDoubleProofContract = z.infer<
  typeof McpTokenValidationTestDoubleProofContractSchema
>;
export type McpSyntheticValidationScenarioBoundary = z.infer<
  typeof McpSyntheticValidationScenarioBoundarySchema
>;
export type McpSyntheticNonTokenInputBoundary = z.infer<
  typeof McpSyntheticNonTokenInputBoundarySchema
>;
export type McpNoRealTokenExampleBoundary = z.infer<
  typeof McpNoRealTokenExampleBoundarySchema
>;
export type McpNoJwtLikeExampleBoundary = z.infer<
  typeof McpNoJwtLikeExampleBoundarySchema
>;
export type McpAcceptedValidationResultTestDoubleBoundary = z.infer<
  typeof McpAcceptedValidationResultTestDoubleBoundarySchema
>;
export type McpRejectedValidationResultTestDoubleBoundary = z.infer<
  typeof McpRejectedValidationResultTestDoubleBoundarySchema
>;
export type McpIssuerScenarioTestDoubleBoundary = z.infer<
  typeof McpIssuerScenarioTestDoubleBoundarySchema
>;
export type McpAudienceResourceScenarioTestDoubleBoundary = z.infer<
  typeof McpAudienceResourceScenarioTestDoubleBoundarySchema
>;
export type McpScopeScenarioTestDoubleBoundary = z.infer<
  typeof McpScopeScenarioTestDoubleBoundarySchema
>;
export type McpTemporalScenarioTestDoubleBoundary = z.infer<
  typeof McpTemporalScenarioTestDoubleBoundarySchema
>;
export type McpRevocationReplayScenarioTestDoubleBoundary = z.infer<
  typeof McpRevocationReplayScenarioTestDoubleBoundarySchema
>;
export type McpSubjectOrgCompanyScenarioTestDoubleBoundary = z.infer<
  typeof McpSubjectOrgCompanyScenarioTestDoubleBoundarySchema
>;
export type McpFailureTaxonomyTestDoubleBoundary = z.infer<
  typeof McpFailureTaxonomyTestDoubleBoundarySchema
>;
export type McpSelectorOnlyCompanyKeyTestDoubleBoundary = z.infer<
  typeof McpSelectorOnlyCompanyKeyTestDoubleBoundarySchema
>;
export type McpNoTokenPassthroughTestDoubleBoundary = z.infer<
  typeof McpNoTokenPassthroughTestDoubleBoundarySchema
>;
export type McpNoTokenLeakageTestDoubleBoundary = z.infer<
  typeof McpNoTokenLeakageTestDoubleBoundarySchema
>;
export type McpNoRuntimeConsumptionBoundary = z.infer<
  typeof McpNoRuntimeConsumptionBoundarySchema
>;
