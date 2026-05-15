import type { z } from "zod";
import type {
  McpAdminConsentBoundarySchema,
  McpAuthMiddlewareDeferredBoundarySchema,
  McpClientCompanyKeySelectorBoundarySchema,
  McpCompanyBindingBoundarySchema,
  McpNoRealFinanceDataBoundarySchema,
  McpNoTokenLeakageBoundarySchema,
  McpOauthImplementationDeferredBoundarySchema,
  McpOauthSecurityProofContractSchema,
  McpOrgRbacBoundarySchema,
  McpPublicExposureBlockedBoundarySchema,
  McpRefreshTokenOfflineAccessBoundarySchema,
  McpRemoteDeploymentDeferredBoundarySchema,
  McpScopeMinimizationBoundarySchema,
  McpTokenAudienceValidationBoundarySchema,
  McpTokenFailureModeBoundarySchema,
  McpTokenPassthroughForbiddenBoundarySchema,
  McpTokenRevocationRotationBoundarySchema,
  McpTokenSessionDeferredBoundarySchema,
  McpTokenStorageRedactionBoundarySchema,
  McpUserIdentityBoundarySchema,
} from "./read-only-app-mcp-oauth-security-contracts";

export type McpOauthSecurityProofContract = z.infer<
  typeof McpOauthSecurityProofContractSchema
>;
export type McpOauthImplementationDeferredBoundary = z.infer<
  typeof McpOauthImplementationDeferredBoundarySchema
>;
export type McpTokenSessionDeferredBoundary = z.infer<
  typeof McpTokenSessionDeferredBoundarySchema
>;
export type McpAuthMiddlewareDeferredBoundary = z.infer<
  typeof McpAuthMiddlewareDeferredBoundarySchema
>;
export type McpRemoteDeploymentDeferredBoundary = z.infer<
  typeof McpRemoteDeploymentDeferredBoundarySchema
>;
export type McpUserIdentityBoundary = z.infer<
  typeof McpUserIdentityBoundarySchema
>;
export type McpAdminConsentBoundary = z.infer<
  typeof McpAdminConsentBoundarySchema
>;
export type McpOrgRbacBoundary = z.infer<typeof McpOrgRbacBoundarySchema>;
export type McpCompanyBindingBoundary = z.infer<
  typeof McpCompanyBindingBoundarySchema
>;
export type McpClientCompanyKeySelectorBoundary = z.infer<
  typeof McpClientCompanyKeySelectorBoundarySchema
>;
export type McpScopeMinimizationBoundary = z.infer<
  typeof McpScopeMinimizationBoundarySchema
>;
export type McpTokenAudienceValidationBoundary = z.infer<
  typeof McpTokenAudienceValidationBoundarySchema
>;
export type McpTokenPassthroughForbiddenBoundary = z.infer<
  typeof McpTokenPassthroughForbiddenBoundarySchema
>;
export type McpTokenFailureModeBoundary = z.infer<
  typeof McpTokenFailureModeBoundarySchema
>;
export type McpRefreshTokenOfflineAccessBoundary = z.infer<
  typeof McpRefreshTokenOfflineAccessBoundarySchema
>;
export type McpTokenStorageRedactionBoundary = z.infer<
  typeof McpTokenStorageRedactionBoundarySchema
>;
export type McpTokenRevocationRotationBoundary = z.infer<
  typeof McpTokenRevocationRotationBoundarySchema
>;
export type McpNoTokenLeakageBoundary = z.infer<
  typeof McpNoTokenLeakageBoundarySchema
>;
export type McpPublicExposureBlockedBoundary = z.infer<
  typeof McpPublicExposureBlockedBoundarySchema
>;
export type McpNoRealFinanceDataBoundary = z.infer<
  typeof McpNoRealFinanceDataBoundarySchema
>;
