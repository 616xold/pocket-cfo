import { verifyMcpProtectedResourceMetadataRepositoryInventory } from "./read-only-app-mcp-protected-resource-metadata-inventory";
import {
  collectForbiddenOpenAiExecutableMatches,
  hasAppsSdkRuntimeSource,
  hasAuthRuntimeSource,
  hasFinanceWriteSource,
  hasProviderExternalSource,
  hasSourceMutationSource,
  isFp0123RouteInputAllowedChangedPath,
  isRouteLikeRuntimePath,
  noAppSubmissionPathChanges,
  noAppsSdkPathChanges,
  noDbSchemaMigrationChanges,
  noDeploymentConfigChanges,
  noDeploymentPublicAssetRepositoryPaths,
  noPackageScriptChanges,
  noPublicAssetPathChanges,
  normalizePath,
  normalizeSourceTextByPath,
  sortUnique,
} from "./read-only-app-mcp-protected-resource-metadata-route-input-inventory-rules";

export { FP0123_ROUTE_INPUT_ALLOWED_CHANGED_PATHS } from "./read-only-app-mcp-protected-resource-metadata-route-input-inventory-rules";

export type McpProtectedResourceMetadataRouteInputDurabilityScanInput = {
  repoPaths: readonly string[];
  dirtyPaths?: readonly string[];
  branchDiffPaths?: readonly string[];
  routeSourceText?: string;
  sourceTextByPath?: Readonly<Record<string, string>>;
};

export function verifyMcpProtectedResourceMetadataRouteInputDurabilityScan(
  input: McpProtectedResourceMetadataRouteInputDurabilityScanInput,
) {
  const dirtyPaths = sortUnique((input.dirtyPaths ?? []).map(normalizePath));
  const branchDiffPaths = sortUnique(
    (input.branchDiffPaths ?? []).map(normalizePath),
  );
  const combinedChangedPaths = sortUnique([...branchDiffPaths, ...dirtyPaths]);
  const repoPaths = sortUnique(input.repoPaths.map(normalizePath));
  const routeSourceText =
    input.routeSourceText ??
    Object.entries(input.sourceTextByPath ?? {})
      .filter(([path]) => isRouteLikeRuntimePath(normalizePath(path)))
      .map(([, sourceText]) => sourceText)
      .join("\n");
  const sourceTextByPath = normalizeSourceTextByPath(
    input.sourceTextByPath ?? {},
  );
  const executableSourceText = Object.values(sourceTextByPath).join("\n");
  const routeSourceInventoryText = Object.entries(sourceTextByPath)
    .filter(([path]) => isRouteLikeRuntimePath(path))
    .map(([, sourceText]) => sourceText)
    .join("\n");
  const repositoryInventory =
    verifyMcpProtectedResourceMetadataRepositoryInventory({
      changedPaths: combinedChangedPaths,
      repoPaths,
      routeSourceText: [routeSourceText, routeSourceInventoryText].join("\n"),
    });
  const forbiddenOpenAiSourceMatches =
    collectForbiddenOpenAiExecutableMatches(executableSourceText);
  const routeInputNoOpenAiSourceScanVerified =
    forbiddenOpenAiSourceMatches.length === 0;
  const branchDiffScopeVerified =
    combinedChangedPaths.every(isFp0123RouteInputAllowedChangedPath) &&
    noPackageScriptChanges(combinedChangedPaths) &&
    noDbSchemaMigrationChanges(combinedChangedPaths) &&
    noDeploymentConfigChanges(combinedChangedPaths) &&
    noPublicAssetPathChanges(combinedChangedPaths) &&
    noAppsSdkPathChanges(combinedChangedPaths) &&
    noAppSubmissionPathChanges(combinedChangedPaths);
  const routeInputNoProtectedResourceMetadataRouteRepositoryInventoryVerified =
    repositoryInventory.protectedResourceRouteRepositoryInventoryVerified;
  const routeInputNoWwwAuthenticateRepositoryInventoryVerified =
    repositoryInventory.wwwAuthenticateRouteRepositoryInventoryVerified;
  const routeInputNoAuthRuntimeRepositoryInventoryVerified =
    repositoryInventory.oauthRuntimeRepositoryInventoryVerified &&
    repositoryInventory.tokenSessionRepositoryInventoryVerified &&
    repositoryInventory.authMiddlewareRepositoryInventoryVerified &&
    !hasAuthRuntimeSource(executableSourceText);
  const routeInputNoRouteRuntimeRepositoryInventoryVerified =
    repositoryInventory.noNewRoutePathRepositoryInventoryVerified &&
    repositoryInventory.knownSafeRouteInventoryVerified;
  const routeInputNoDeploymentPublicAssetRepositoryInventoryVerified =
    repositoryInventory.remoteMcpDeploymentRepositoryInventoryVerified &&
    noDeploymentPublicAssetRepositoryPaths(repoPaths) &&
    !hasAppsSdkRuntimeSource(executableSourceText);
  const noProviderExternalSourceVerified =
    !hasProviderExternalSource(executableSourceText);
  const noSourceMutationVerified =
    !hasSourceMutationSource(executableSourceText);
  const noFinanceWriteVerified = !hasFinanceWriteSource(executableSourceText);
  const routeInputRepositoryInventoryVerified =
    routeInputNoRouteRuntimeRepositoryInventoryVerified &&
    routeInputNoProtectedResourceMetadataRouteRepositoryInventoryVerified &&
    routeInputNoWwwAuthenticateRepositoryInventoryVerified &&
    routeInputNoAuthRuntimeRepositoryInventoryVerified &&
    routeInputNoDeploymentPublicAssetRepositoryInventoryVerified &&
    noProviderExternalSourceVerified &&
    noSourceMutationVerified &&
    noFinanceWriteVerified;
  const fp0123PostmergeProofDurabilityVerified =
    branchDiffScopeVerified &&
    routeInputRepositoryInventoryVerified &&
    routeInputNoOpenAiSourceScanVerified;

  return {
    branchDiffPaths,
    combinedChangedPaths,
    dirtyPaths,
    forbiddenOpenAiSourceMatches,
    fp0123PostmergeProofDurabilityVerified,
    noDbSchemaMigrationChangesVerified:
      noDbSchemaMigrationChanges(combinedChangedPaths),
    noFinanceWriteVerified,
    noPackageScriptsAdded: noPackageScriptChanges(combinedChangedPaths),
    noProviderExternalSourceVerified,
    noSourceMutationVerified,
    routeInputBranchDiffScopeVerified: branchDiffScopeVerified,
    routeInputNoAuthRuntimeRepositoryInventoryVerified,
    routeInputNoDeploymentPublicAssetRepositoryInventoryVerified,
    routeInputNoOpenAiSourceScanVerified,
    routeInputNoProtectedResourceMetadataRouteRepositoryInventoryVerified,
    routeInputNoRouteRuntimeRepositoryInventoryVerified,
    routeInputNoWwwAuthenticateRepositoryInventoryVerified,
    routeInputRepositoryInventoryVerified,
  };
}
