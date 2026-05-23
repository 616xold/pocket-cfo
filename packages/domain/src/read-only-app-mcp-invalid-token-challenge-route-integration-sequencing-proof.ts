import { z } from "zod";
import { MCP_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_SCHEMA_VERSION } from "./read-only-app-mcp-invalid-token-challenge-route-integration-sequencing";

const trueLiteral = z.literal(true);

export const McpInvalidTokenRouteIntegrationSequencingProofSchema = z
  .object({
    schemaVersion: z.literal(
      MCP_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_SCHEMA_VERSION,
    ),
    docsAndPlanOnly: trueLiteral,
    invalidTokenRouteIntegrationSequencingPlanVerified: trueLiteral,
    exactFp0142PlanPathVerified: trueLiteral,
    fp0143Absent: trueLiteral,
    routeIntegrationImplementationBlocked: trueLiteral,
    appConstructionWiringImplementationBlocked: trueLiteral,
    authorizationHeaderPresenceDecisionRecorded: trueLiteral,
    missingTokenPrecedenceDecisionRecorded: trueLiteral,
    protectedResourceMetadataSeparationPreserved: trueLiteral,
    fp0139ResultEnvelopeOnlyDependencyPreserved: trueLiteral,
    failureTaxonomyHttpWwwAuthenticateConsistencyRequired: trueLiteral,
    noMcpRouteBehaviorChangeFromFp0142: trueLiteral,
    noProtectedResourceMetadataRouteBehaviorChangeFromFp0142: trueLiteral,
    noMissingTokenBehaviorChangeFromFp0142: trueLiteral,
    noProductionTokenValidationFromFp0142: trueLiteral,
    noTokenParserJwtDecoderIntrospectionFromFp0142: trueLiteral,
    noOauthSessionAuthMiddlewareFromFp0142: trueLiteral,
    noEvaluatorOrTestDoubleRouteConsumptionFromFp0142: trueLiteral,
    noRealTokenExamples: trueLiteral,
    noJwtLikeExamples: trueLiteral,
    noBearerTokenMaterial: trueLiteral,
    noTokenEcho: trueLiteral,
    noTokenLogging: trueLiteral,
    noDbQueriesAdded: trueLiteral,
    noSchemaMigrationsAdded: trueLiteral,
    noPackageScriptsAdded: trueLiteral,
    noOpenAiApiCalls: trueLiteral,
    noProviderExternalCalls: trueLiteral,
    noSourceMutationFinanceWrite: trueLiteral,
    fp0141LocalRuntimeBoundaryStillVerified: trueLiteral,
    fp0140ImplementationPlanningBoundaryStillVerified: trueLiteral,
    fp0139ResultEnvelopeBoundaryStillVerified: trueLiteral,
    fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified:
      trueLiteral,
    fp0137InvalidTokenChallengeReadinessBoundaryStillVerified: trueLiteral,
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified: trueLiteral,
    fp0134SyntheticEvaluatorBoundaryStillVerified: trueLiteral,
    fp0130MissingTokenChallengeBoundaryStillVerified: trueLiteral,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified: trueLiteral,
    fp0107RouteAdapterBoundaryStillVerified: trueLiteral,
    fp0106ProtocolEnvelopeBoundaryStillVerified: trueLiteral,
    fp0100PublicSecurityBoundaryStillVerified: trueLiteral,
  })
  .strict();

export type McpInvalidTokenRouteIntegrationSequencingProof = z.infer<
  typeof McpInvalidTokenRouteIntegrationSequencingProofSchema
>;

export type McpInvalidTokenRouteIntegrationSequencingProofInput = Partial<
  Omit<
    McpInvalidTokenRouteIntegrationSequencingProof,
    "schemaVersion" | "docsAndPlanOnly"
  >
>;

export function buildMcpInvalidTokenRouteIntegrationSequencingProof(
  input: McpInvalidTokenRouteIntegrationSequencingProofInput = {},
): McpInvalidTokenRouteIntegrationSequencingProof {
  return McpInvalidTokenRouteIntegrationSequencingProofSchema.parse({
    schemaVersion:
      MCP_INVALID_TOKEN_ROUTE_INTEGRATION_SEQUENCING_SCHEMA_VERSION,
    docsAndPlanOnly: true,
    invalidTokenRouteIntegrationSequencingPlanVerified:
      input.invalidTokenRouteIntegrationSequencingPlanVerified ?? true,
    exactFp0142PlanPathVerified: input.exactFp0142PlanPathVerified ?? true,
    fp0143Absent: input.fp0143Absent ?? true,
    routeIntegrationImplementationBlocked:
      input.routeIntegrationImplementationBlocked ?? true,
    appConstructionWiringImplementationBlocked:
      input.appConstructionWiringImplementationBlocked ?? true,
    authorizationHeaderPresenceDecisionRecorded:
      input.authorizationHeaderPresenceDecisionRecorded ?? true,
    missingTokenPrecedenceDecisionRecorded:
      input.missingTokenPrecedenceDecisionRecorded ?? true,
    protectedResourceMetadataSeparationPreserved:
      input.protectedResourceMetadataSeparationPreserved ?? true,
    fp0139ResultEnvelopeOnlyDependencyPreserved:
      input.fp0139ResultEnvelopeOnlyDependencyPreserved ?? true,
    failureTaxonomyHttpWwwAuthenticateConsistencyRequired:
      input.failureTaxonomyHttpWwwAuthenticateConsistencyRequired ?? true,
    noMcpRouteBehaviorChangeFromFp0142:
      input.noMcpRouteBehaviorChangeFromFp0142 ?? true,
    noProtectedResourceMetadataRouteBehaviorChangeFromFp0142:
      input.noProtectedResourceMetadataRouteBehaviorChangeFromFp0142 ?? true,
    noMissingTokenBehaviorChangeFromFp0142:
      input.noMissingTokenBehaviorChangeFromFp0142 ?? true,
    noProductionTokenValidationFromFp0142:
      input.noProductionTokenValidationFromFp0142 ?? true,
    noTokenParserJwtDecoderIntrospectionFromFp0142:
      input.noTokenParserJwtDecoderIntrospectionFromFp0142 ?? true,
    noOauthSessionAuthMiddlewareFromFp0142:
      input.noOauthSessionAuthMiddlewareFromFp0142 ?? true,
    noEvaluatorOrTestDoubleRouteConsumptionFromFp0142:
      input.noEvaluatorOrTestDoubleRouteConsumptionFromFp0142 ?? true,
    noRealTokenExamples: input.noRealTokenExamples ?? true,
    noJwtLikeExamples: input.noJwtLikeExamples ?? true,
    noBearerTokenMaterial: input.noBearerTokenMaterial ?? true,
    noTokenEcho: input.noTokenEcho ?? true,
    noTokenLogging: input.noTokenLogging ?? true,
    noDbQueriesAdded: input.noDbQueriesAdded ?? true,
    noSchemaMigrationsAdded: input.noSchemaMigrationsAdded ?? true,
    noPackageScriptsAdded: input.noPackageScriptsAdded ?? true,
    noOpenAiApiCalls: input.noOpenAiApiCalls ?? true,
    noProviderExternalCalls: input.noProviderExternalCalls ?? true,
    noSourceMutationFinanceWrite:
      input.noSourceMutationFinanceWrite ?? true,
    fp0141LocalRuntimeBoundaryStillVerified:
      input.fp0141LocalRuntimeBoundaryStillVerified ?? true,
    fp0140ImplementationPlanningBoundaryStillVerified:
      input.fp0140ImplementationPlanningBoundaryStillVerified ?? true,
    fp0139ResultEnvelopeBoundaryStillVerified:
      input.fp0139ResultEnvelopeBoundaryStillVerified ?? true,
    fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified:
      input.fp0138TokenValidationRuntimeImplementationPlanningBoundaryStillVerified ??
      true,
    fp0137InvalidTokenChallengeReadinessBoundaryStillVerified:
      input.fp0137InvalidTokenChallengeReadinessBoundaryStillVerified ?? true,
    fp0136InvalidTokenChallengeContractsBoundaryStillVerified:
      input.fp0136InvalidTokenChallengeContractsBoundaryStillVerified ?? true,
    fp0134SyntheticEvaluatorBoundaryStillVerified:
      input.fp0134SyntheticEvaluatorBoundaryStillVerified ?? true,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      input.fp0130MissingTokenChallengeBoundaryStillVerified ?? true,
    fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified:
      input.fp0125ProtectedResourceMetadataLocalRouteBoundaryStillVerified ??
      true,
    fp0107RouteAdapterBoundaryStillVerified:
      input.fp0107RouteAdapterBoundaryStillVerified ?? true,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      input.fp0106ProtocolEnvelopeBoundaryStillVerified ?? true,
    fp0100PublicSecurityBoundaryStillVerified:
      input.fp0100PublicSecurityBoundaryStillVerified ?? true,
  });
}
