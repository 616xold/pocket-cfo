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

const FP0162_LOCAL_APPS_SDK_RESOURCE_READINESS_ALLOWED_PATHS = [
  "plans/FP-0162-read-only-chatgpt-app-mcp-local-apps-sdk-resource-readiness.md",
  "plans/FP-0163-read-only-chatgpt-app-mcp-local-apps-sdk-resource-skeleton.md",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts",
  "packages/domain/dist/read-only-app-mcp-local-apps-sdk-resource-readiness.js",
  "packages/domain/dist/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.js",
  "packages/domain/dist/read-only-app-mcp-local-apps-sdk-resource-readiness.d.ts",
  "packages/domain/dist/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.d.ts",
  "packages/domain/dist/read-only-app-mcp-local-apps-sdk-resource-skeleton.js",
  "packages/domain/dist/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.js",
  "packages/domain/dist/read-only-app-mcp-local-apps-sdk-resource-skeleton.d.ts",
  "packages/domain/dist/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.d.ts",
  "tools/read-only-mcp-local-apps-sdk-resource-readiness-proof.mjs",
  "tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs",
] as const;

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
  const deploymentGuardChangedPaths =
    withoutFp0162LocalAppsSdkResourceReadinessPaths(combinedChangedPaths);
  const deploymentGuardRepoPaths =
    withoutFp0162LocalAppsSdkResourceReadinessPaths(repoPaths);
  const routeSourceText =
    input.routeSourceText ??
    Object.entries(input.sourceTextByPath ?? {})
      .filter(([path]) => isRouteLikeRuntimePath(normalizePath(path)))
      .map(([, sourceText]) => sourceText)
      .join("\n");
  const sourceTextByPath = normalizeSourceTextByPath(
    input.sourceTextByPath ?? {},
  );
  const executableSourceText = Object.entries(sourceTextByPath)
    .filter(([path]) => !isLocalAppsSdkProofOnlyAllowedPath(path))
    .map(([, sourceText]) => sourceText)
    .join("\n");
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
    noDeploymentConfigChanges(deploymentGuardChangedPaths) &&
    noPublicAssetPathChanges(deploymentGuardChangedPaths) &&
    noAppsSdkPathChanges(deploymentGuardChangedPaths) &&
    noAppSubmissionPathChanges(deploymentGuardChangedPaths);
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
    noDeploymentPublicAssetRepositoryPaths(deploymentGuardRepoPaths) &&
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

function withoutFp0162LocalAppsSdkResourceReadinessPaths(
  paths: readonly string[],
) {
  return paths.filter((path) => !isLocalAppsSdkProofOnlyAllowedPath(path));
}

function isLocalAppsSdkProofOnlyAllowedPath(path: string) {
  return FP0162_LOCAL_APPS_SDK_RESOURCE_READINESS_ALLOWED_PATHS.includes(
    normalizePath(
      path,
    ) as (typeof FP0162_LOCAL_APPS_SDK_RESOURCE_READINESS_ALLOWED_PATHS)[number],
  );
}
