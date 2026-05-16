import {
  buildProtectedResourceMetadataDocument,
  deriveProtectedResourceMetadataRouteResponseContract,
  textHasProtectedResourceMetadataBuilderTokenLeakage,
  validateProtectedResourceMetadataBuilderInput,
} from "./read-only-app-mcp-protected-resource-metadata-builder";
import {
  tryDeriveMcpProtectedResourceMetadataUrlFromCanonicalUri,
  validateMcpCanonicalPublicResourceUriCandidate,
} from "./read-only-app-mcp-canonical-resource-validator";
import {
  MCP_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_SCHEMA_VERSION,
  MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH,
  McpProtectedResourceMetadataRouteInputBuilderInputSchema,
  McpProtectedResourceMetadataRouteInputEvidenceBundleSchema,
  McpProtectedResourceMetadataRoutePathDecisionSchema,
  type McpProtectedResourceMetadataRouteInputBuilderInput,
  type McpProtectedResourceMetadataRouteInputEvidenceBundle,
  type McpProtectedResourceMetadataRoutePathDecision,
} from "./read-only-app-mcp-protected-resource-metadata-route-input-contracts";
import type { McpProtectedResourceMetadataBuilderDocument } from "./read-only-app-mcp-protected-resource-metadata-builder-contracts";

export type McpProtectedResourceMetadataRouteInputEvidenceBundleValidation = {
  accepted: boolean;
  canonicalUriEvidenceAccepted: boolean;
  authorizationServerEvidenceAccepted: boolean;
  routePathDecisionAccepted: boolean;
  builderOutputBoundaryAccepted: boolean;
  noTokenLeakageAccepted: boolean;
  companyBindingPrerequisiteAccepted: boolean;
  mcpUnchangedPrerequisiteAccepted: boolean;
  noRuntimeAccepted: boolean;
  rejectionReasons: readonly string[];
};

export function validateProtectedResourceMetadataRouteInputEvidenceBundle(
  input: unknown,
): McpProtectedResourceMetadataRouteInputEvidenceBundleValidation {
  const parsed =
    McpProtectedResourceMetadataRouteInputBuilderInputSchema.safeParse(input);
  if (!parsed.success) {
    return rejected(["input_shape_invalid"]);
  }

  const builderInput = toBuilderInput(parsed.data);
  const canonicalValidation = validateMcpCanonicalPublicResourceUriCandidate(
    parsed.data.canonicalResourceUri,
  );
  const builderValidation =
    validateProtectedResourceMetadataBuilderInput(builderInput);
  const routePathDecisionAccepted = routePathDecisionCanBeDerived(
    parsed.data.canonicalResourceUri,
  );
  const builderOutputBoundaryAccepted = builderOutputAccepted(parsed.data);
  const noTokenLeakageAccepted =
    parsed.data.noTokenLeakageAccepted &&
    builderValidation.noTokenLeakageAccepted &&
    !textHasProtectedResourceMetadataBuilderTokenLeakage(
      JSON.stringify(parsed.data),
    );
  const canonicalUriEvidenceAccepted =
    parsed.data.canonicalUriEvidenceAccepted &&
    canonicalValidation.accepted &&
    canonicalValidation.noUserinfoCredentials &&
    canonicalValidation.noCredentialLikeAuthorityOrPath;
  const authorizationServerEvidenceAccepted =
    parsed.data.authorizationServerEvidenceAccepted &&
    builderValidation.authorizationServersAccepted &&
    builderValidation.scopesAccepted &&
    builderValidation.bearerMethodsAccepted;
  const companyBindingPrerequisiteAccepted =
    parsed.data.authenticatedCompanyBindingPrerequisiteAccepted;
  const mcpUnchangedPrerequisiteAccepted =
    parsed.data.mcpUnchangedBehaviorPrerequisiteAccepted;
  const noRuntimeAccepted =
    parsed.data.routeImplementationDeferred &&
    parsed.data.wwwAuthenticateBehaviorDeferred;

  const rejectionReasons = [
    canonicalUriEvidenceAccepted ? "" : "canonical_uri_evidence_unaccepted",
    authorizationServerEvidenceAccepted
      ? ""
      : "authorization_server_evidence_unaccepted",
    routePathDecisionAccepted ? "" : "route_path_decision_unaccepted",
    builderOutputBoundaryAccepted ? "" : "builder_output_unaccepted",
    noTokenLeakageAccepted ? "" : "token_or_private_material_detected",
    companyBindingPrerequisiteAccepted
      ? ""
      : "company_binding_prerequisite_missing",
    mcpUnchangedPrerequisiteAccepted
      ? ""
      : "mcp_unchanged_prerequisite_missing",
    noRuntimeAccepted ? "" : "route_or_www_authenticate_runtime_not_deferred",
  ].filter(Boolean);

  return {
    accepted: rejectionReasons.length === 0,
    authorizationServerEvidenceAccepted,
    builderOutputBoundaryAccepted,
    canonicalUriEvidenceAccepted,
    companyBindingPrerequisiteAccepted,
    mcpUnchangedPrerequisiteAccepted,
    noRuntimeAccepted,
    noTokenLeakageAccepted,
    rejectionReasons,
    routePathDecisionAccepted,
  };
}

export function deriveProtectedResourceMetadataRoutePathDecision(
  input: string | { canonicalResourceUri: string },
): McpProtectedResourceMetadataRoutePathDecision {
  const canonicalResourceUri =
    typeof input === "string" ? input : input.canonicalResourceUri;
  const derivation =
    tryDeriveMcpProtectedResourceMetadataUrlFromCanonicalUri(
      canonicalResourceUri,
    );

  if (!derivation.derived) {
    throw new Error(
      "Cannot derive protected-resource metadata route path from unaccepted canonical MCP resource URI evidence",
    );
  }

  return McpProtectedResourceMetadataRoutePathDecisionSchema.parse({
    canonicalResourceUri,
    expectedForMcpCanonicalResource:
      MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH,
    metadataRoutePath: derivation.derivation.metadataRoutePath,
    metadataUrl: derivation.derivation.metadataUrl,
    rfc9728WellKnownPath: derivation.derivation.rfc9728WellKnownPath,
    routeImplementationDeferred: true,
    routePathDerivedFromCanonicalResourceUri: true,
  });
}

export function buildProtectedResourceMetadataRouteInputEvidenceBundle(
  input: McpProtectedResourceMetadataRouteInputBuilderInput,
): McpProtectedResourceMetadataRouteInputEvidenceBundle {
  const validation =
    validateProtectedResourceMetadataRouteInputEvidenceBundle(input);
  if (!validation.accepted) {
    throw new Error(
      `Protected-resource metadata route-input evidence bundle rejected: ${validation.rejectionReasons.join(", ")}`,
    );
  }

  const builderInput = toBuilderInput(input);
  const document = buildProtectedResourceMetadataDocument(builderInput);
  const routeContract =
    deriveProtectedResourceMetadataRouteResponseContract(builderInput);
  const pathDecision = deriveProtectedResourceMetadataRoutePathDecision({
    canonicalResourceUri: input.canonicalResourceUri,
  });

  return McpProtectedResourceMetadataRouteInputEvidenceBundleSchema.parse({
    authorizationServerEvidence: {
      accepted: true,
      authorizationServers: [...input.authorizationServers],
      credentialFree: true,
      providerNeutralUntilLaterPlan: true,
    },
    builderOutput: {
      accepted: true,
      builderInputAccepted: true,
      builderOutputValid: true,
      document,
      routeRegistered: routeContract.routeRegistered,
      routeResponseContractOnly: routeContract.routeResponseContractOnly,
    },
    canonicalUriEvidence: {
      accepted: true,
      canonicalResourceUri: input.canonicalResourceUri,
      credentialFree: true,
      metadataUrl: pathDecision.metadataUrl,
    },
    companyBindingPrerequisite: {
      accepted: true,
      authenticatedCompanyBindingImplemented: false,
      authenticatedCompanyBindingRequired: true,
      unauthenticatedCompanyKeyAuthorityAllowed: false,
    },
    localProofOnly: true,
    mcpUnchanged: {
      accepted: true,
      localMcpRouteBehaviorChanged: false,
      localMcpRouteUnchangedRequired: true,
      protectedResourceMetadataRouteRegistered: false,
      wwwAuthenticateBehaviorImplemented: false,
    },
    noRuntime: {
      accepted: true,
      noAppsSdkResourceRuntime: true,
      noAuthMiddlewareRuntime: true,
      noDbRuntime: true,
      noOauthRuntime: true,
      noProtectedResourceMetadataRouteRuntime: true,
      noRemoteMcpRuntime: true,
      noRouteRuntime: true,
      noTokenSessionRuntime: true,
      noWwwAuthenticateRuntime: true,
    },
    noTokenLeakage: {
      accepted: true,
      companyKeyAuthorityDetected: false,
      cookiesSessionsSecretsCredentialsDetected: false,
      credentialBearingUrlsDetected: false,
      rawFinanceDataDetected: false,
      rawSourceDumpsDetected: false,
      tokenValuesDetected: false,
    },
    pathDecision,
    readOnly: true,
    routeImplementationStillDeferred: true,
    routeInputEvidenceBundleOnly: true,
    schemaVersion: MCP_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_SCHEMA_VERSION,
    wwwAuthenticateBehaviorStillDeferred: true,
  });
}

function rejected(
  rejectionReasons: readonly string[],
): McpProtectedResourceMetadataRouteInputEvidenceBundleValidation {
  return {
    accepted: false,
    authorizationServerEvidenceAccepted: false,
    builderOutputBoundaryAccepted: false,
    canonicalUriEvidenceAccepted: false,
    companyBindingPrerequisiteAccepted: false,
    mcpUnchangedPrerequisiteAccepted: false,
    noRuntimeAccepted: false,
    noTokenLeakageAccepted: false,
    rejectionReasons,
    routePathDecisionAccepted: false,
  };
}

function toBuilderInput(
  input: McpProtectedResourceMetadataRouteInputBuilderInput,
) {
  return {
    authorizationServers: [...input.authorizationServers],
    bearerMethodsSupported: [...input.bearerMethodsSupported],
    canonicalResourceUri: input.canonicalResourceUri,
    scopesSupported: [...input.scopesSupported],
  };
}

function routePathDecisionCanBeDerived(canonicalResourceUri: string) {
  const derivation =
    tryDeriveMcpProtectedResourceMetadataUrlFromCanonicalUri(
      canonicalResourceUri,
    );
  return derivation.derived && derivation.validation.accepted;
}

function builderOutputAccepted(
  input: McpProtectedResourceMetadataRouteInputBuilderInput,
) {
  const builderInput = toBuilderInput(input);
  const builderValidation =
    validateProtectedResourceMetadataBuilderInput(builderInput);
  if (!builderValidation.accepted) return false;

  const expectedDocument = safeBuildDocument(builderInput);
  if (!expectedDocument) return false;
  if (!input.builderOutput) return true;

  return (
    JSON.stringify(input.builderOutput) === JSON.stringify(expectedDocument)
  );
}

function safeBuildDocument(
  input: ReturnType<typeof toBuilderInput>,
): McpProtectedResourceMetadataBuilderDocument | null {
  try {
    return buildProtectedResourceMetadataDocument(input);
  } catch {
    return null;
  }
}
