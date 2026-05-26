/* global console */

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  buildReadOnlyMcpLocalAppsSdkResourceSkeleton,
  buildReadOnlyMcpLocalAppsSdkResourceSkeletonProof,
  scanProofOnlyNoTokenLeakageText,
  verifyFp0162CloseoutFreshnessForFp0163,
  verifyReadOnlyMcpLocalAppsSdkResourceSkeletonBoundary,
} from "../packages/domain/src/index.ts";

const SCHEMA_VERSION =
  "v2ce.read-only-chatgpt-app-mcp-local-apps-sdk-resource-skeleton-proof.v1";

const FP0162_PLAN_PATH =
  "plans/FP-0162-read-only-chatgpt-app-mcp-local-apps-sdk-resource-readiness.md";
const FP0163_PLAN_PATH =
  "plans/FP-0163-read-only-chatgpt-app-mcp-local-apps-sdk-resource-skeleton.md";
const FP0164_PLAN_PATH =
  "plans/FP-0164-read-only-chatgpt-app-mcp-local-apps-sdk-resource-registration.md";
const READINESS_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-readiness-proof.mjs";
const REGISTRATION_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-registration-proof.mjs";
const VISUAL_QA_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-visual-qa-accessibility-proof.mjs";
const UI_BRIDGE_IMPLEMENTATION_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-implementation-proof.mjs";
const UI_BRIDGE_READINESS_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs";
const SKELETON_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts";
const SKELETON_RUNTIME_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime.ts";
const REGISTRATION_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.ts";
const REGISTRATION_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.spec.ts";
const PREVIEW_ROUTE_PATH =
  "apps/web/app/read-only-app-mcp-preview/page.tsx";
const BRIDGE_COMPONENT_PATH =
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge.tsx";
const BRIDGE_SNAPSHOT_PATH =
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge-snapshot.ts";

const allowedChangedPaths = new Set([
  "README.md",
  "CODEX_README.md",
  "START_HERE.md",
  "docs/ACTIVE_DOCS.md",
  "docs/PROJECT_STATE.md",
  "docs/V2_BOUNDARY.md",
  "plans/ROADMAP.md",
  "plugins.md",
  FP0162_PLAN_PATH,
  FP0163_PLAN_PATH,
  FP0164_PLAN_PATH,
  READINESS_PROOF_PATH,
  REGISTRATION_PROOF_PATH,
  VISUAL_QA_PROOF_PATH,
  UI_BRIDGE_IMPLEMENTATION_PROOF_PATH,
  UI_BRIDGE_READINESS_PROOF_PATH,
  "tools/read-only-endpoint-architecture-proof.mjs",
  "tools/read-only-endpoint-route-ownership-proof.mjs",
  "tools/read-only-mcp-default-local-evidence-dispatch-proof.mjs",
  "tools/read-only-mcp-evidence-tool-dispatch-proof.mjs",
  "tools/read-only-mcp-invalid-token-app-wiring-proof.mjs",
  "tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs",
  "tools/read-only-mcp-protected-resource-metadata-local-route-proof.mjs",
  "tools/read-only-mcp-protocol-envelope-proof.mjs",
  "tools/read-only-mcp-route-adapter-proof.mjs",
  "tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs",
  "tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs",
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts",
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.ts",
  SKELETON_MODULE_PATH,
  SKELETON_RUNTIME_MODULE_PATH,
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts",
  REGISTRATION_MODULE_PATH,
  REGISTRATION_SPEC_PATH,
  "packages/domain/src/read-only-app-mcp-oauth-implementation-sequencing-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input-inventory-rules.ts",
  "packages/domain/src/read-only-app-mcp-token-validation-inventory.ts",
  "packages/domain/src/index.ts",
]);

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const fp0162PlanText = safeRead(FP0162_PLAN_PATH);
const skeletonSource = safeRead(SKELETON_MODULE_PATH);
const skeletonRuntimeSource = safeRead(SKELETON_RUNTIME_MODULE_PATH);
const registrationSource = safeRead(REGISTRATION_MODULE_PATH);
const runtimePreviewSource = [
  safeRead(PREVIEW_ROUTE_PATH),
  safeRead(BRIDGE_COMPONENT_PATH),
  safeRead(BRIDGE_SNAPSHOT_PATH),
].join("\n");
const readinessProof = runJsonTool(READINESS_PROOF_PATH);
const visualQaProof = runJsonTool(VISUAL_QA_PROOF_PATH);
const uiBridgeImplementationProof = runJsonTool(
  UI_BRIDGE_IMPLEMENTATION_PROOF_PATH,
);
const uiBridgeReadinessProof = runJsonTool(UI_BRIDGE_READINESS_PROOF_PATH);
const pathScope = verifyPathScope();
const sourceScope = verifySourceScope();
const resourceScope = verifyResourceScope();
const proofBridgeScope = verifyProofBridgeScope();
const priorBoundaryOverrides = buildPriorBoundaryOverrides();
const skeletonProof = buildReadOnlyMcpLocalAppsSdkResourceSkeletonProof({
  changedPathScopeAccepted: pathScope.changedPathScopeAccepted,
  fp0162CloseoutFresh: proofBridgeScope.fp0162CloseoutFreshnessVerified,
  fp0162SuccessorBridgeCompatible:
    proofBridgeScope.fp0162SuccessorBridgeCompatibilityVerified,
  priorBoundaryOverrides,
  repoPaths,
  runtimeSafeBuilderIsolated: sourceScope.runtimeSafeSkeletonBuilderIsolated,
});

const output = {
  schemaVersion: SCHEMA_VERSION,
  fp0163AbsentOrLocalAppsSdkResourceSkeletonPlanVerified:
    skeletonProof.fp0163AbsentOrLocalAppsSdkResourceSkeletonPlanVerified,
  fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified:
    skeletonProof.fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified,
  fp0165Absent: skeletonProof.fp0165Absent,
  runtimeSafeSkeletonBuilderIsolated:
    skeletonProof.runtimeSafeSkeletonBuilderIsolated &&
    sourceScope.runtimeSafeSkeletonBuilderIsolated,
  localAppsSdkResourceSkeletonBoundaryVerified:
    verifyReadOnlyMcpLocalAppsSdkResourceSkeletonBoundary({
      changedPathScopeAccepted: pathScope.changedPathScopeAccepted,
      fp0162CloseoutFresh: proofBridgeScope.fp0162CloseoutFreshnessVerified,
      fp0162SuccessorBridgeCompatible:
        proofBridgeScope.fp0162SuccessorBridgeCompatibilityVerified,
      priorBoundaryOverrides,
      repoPaths,
      runtimeSafeBuilderIsolated: sourceScope.runtimeSafeSkeletonBuilderIsolated,
    }) && resourceScope.localAppsSdkResourceSkeletonBoundaryVerified,
  appsSdkResourceSkeletonImplemented:
    skeletonProof.appsSdkResourceSkeletonImplemented,
  registerResourceImplementationStillBlocked:
    skeletonProof.registerResourceImplementationStillBlocked &&
    sourceScope.defaultResourceRegistrationStillBlocked,
  resourceRegistrationStillBlocked:
    skeletonProof.resourceRegistrationStillBlocked &&
    sourceScope.defaultResourceRegistrationStillBlocked &&
    sourceScope.serverResourceRegistrationStillBlocked,
  registerResourceImplementationStillExplicitOnly:
    skeletonProof.registerResourceImplementationStillExplicitOnly &&
    sourceScope.explicitRegisterResourceHelperImportsRuntimeSafeBuilder &&
    sourceScope.proofHeavySkeletonModuleNotImportedByRegistration,
  resourceRegistrationStillExplicitOnly:
    skeletonProof.resourceRegistrationStillExplicitOnly &&
    sourceScope.defaultResourceRegistrationStillBlocked &&
    sourceScope.serverResourceRegistrationStillBlocked,
  defaultResourceRegistrationStillBlocked:
    skeletonProof.defaultResourceRegistrationStillBlocked &&
    sourceScope.defaultResourceRegistrationStillBlocked,
  serverResourceRegistrationStillBlocked:
    skeletonProof.serverResourceRegistrationStillBlocked &&
    sourceScope.serverResourceRegistrationStillBlocked,
  toolDescriptorImplementationStillBlocked:
    skeletonProof.toolDescriptorImplementationStillBlocked &&
    sourceScope.noToolDescriptorImplementation,
  outputTemplateImplementationStillBlocked:
    skeletonProof.outputTemplateImplementationStillBlocked &&
    sourceScope.noOutputTemplateImplementation,
  renderToolImplementationStillBlocked:
    skeletonProof.renderToolImplementationStillBlocked &&
    sourceScope.noRenderToolImplementation,
  componentBundleImplementationStillBlocked:
    skeletonProof.componentBundleImplementationStillBlocked &&
    sourceScope.noComponentBundleImplementation,
  noNewRouteOrApiRouteFromFp0163: pathScope.noNewRouteOrApiRouteFromFp0163,
  deterministicLocalResourceUriVerified:
    skeletonProof.deterministicLocalResourceUriVerified,
  localResourceMimeTypeVerified: skeletonProof.localResourceMimeTypeVerified,
  staticSanitizedHtmlVerified: skeletonProof.staticSanitizedHtmlVerified,
  scriptFreeResourceHtmlVerified:
    skeletonProof.scriptFreeResourceHtmlVerified,
  noExternalLinksInResourceHtml: skeletonProof.noExternalLinksInResourceHtml,
  resourceCspHasNoExternalConnectDomains:
    skeletonProof.resourceCspHasNoExternalConnectDomains,
  resourceCspHasNoExternalResourceDomains:
    skeletonProof.resourceCspHasNoExternalResourceDomains,
  resourceCspHasNoFrameDomains: skeletonProof.resourceCspHasNoFrameDomains,
  resourceMetadataHasNoPublicWidgetDomain:
    skeletonProof.resourceMetadataHasNoPublicWidgetDomain,
  resourceMetadataHasNoRedirectDomains:
    skeletonProof.resourceMetadataHasNoRedirectDomains,
  widgetDescriptionReadOnlySyntheticNonMarketing:
    skeletonProof.widgetDescriptionReadOnlySyntheticNonMarketing,
  widgetDescriptionReadOnlySyntheticLocalNoSubmission:
    skeletonProof.widgetDescriptionReadOnlySyntheticLocalNoSubmission,
  resourceSkeletonTwoLaneSeparationVerified:
    skeletonProof.resourceSkeletonTwoLaneSeparationVerified,
  resourceSkeletonDoesNotClaimProductionAuthentication:
    skeletonProof.resourceSkeletonDoesNotClaimProductionAuthentication,
  resourceSkeletonDoesNotClaimAuthenticatedEvidenceExecution:
    skeletonProof.resourceSkeletonDoesNotClaimAuthenticatedEvidenceExecution,
  productionTokenValidationFalseStillRendered:
    skeletonProof.productionTokenValidationFalseStillRendered,
  publicChatGptAppFalseStillRendered:
    skeletonProof.publicChatGptAppFalseStillRendered,
  futureRegisterResourceStillExplicitOnly:
    skeletonProof.futureRegisterResourceStillExplicitOnly,
  noLiveMcpFetchFromPreviewUi: sourceScope.noLiveMcpFetchFromPreviewUi,
  noWindowOpenAiUsageFromFp0163: sourceScope.noWindowOpenAiUsageFromFp0163,
  noHarnessExecutionAtRequestTime: sourceScope.noHarnessExecutionAtRequestTime,
  defaultAuthAdapterWiringStillBlocked:
    sourceScope.defaultAuthAdapterWiringStillBlocked,
  defaultEvidenceDispatchWiringStillBlocked:
    sourceScope.defaultEvidenceDispatchWiringStillBlocked,
  defaultCreateContainerBehaviorStillUnchanged:
    sourceScope.defaultCreateContainerBehaviorStillUnchanged,
  defaultCreateInMemoryContainerBehaviorStillUnchanged:
    sourceScope.defaultCreateInMemoryContainerBehaviorStillUnchanged,
  defaultBuildAppBehaviorStillUnchanged:
    sourceScope.defaultBuildAppBehaviorStillUnchanged,
  mcpRouteBehaviorStillUnchanged: sourceScope.mcpRouteBehaviorStillUnchanged,
  protectedResourceMetadataRouteStillUnchanged:
    sourceScope.protectedResourceMetadataRouteStillUnchanged,
  noProductionTokenValidationFromFp0163:
    skeletonProof.noProductionTokenValidationFromFp0163 &&
    sourceScope.noProductionTokenValidationRuntime,
  noOauthSessionAuthMiddlewareFromFp0163:
    skeletonProof.noOauthSessionAuthMiddlewareFromFp0163 &&
    sourceScope.noOauthSessionAuthMiddleware,
  noProviderCallsFromFp0163:
    skeletonProof.noProviderCallsFromFp0163 && sourceScope.noProviderCalls,
  noOpenAiApiCallsFromFp0163:
    skeletonProof.noOpenAiApiCallsFromFp0163 && sourceScope.noOpenAiApiCalls,
  noModelCallsFromFp0163:
    skeletonProof.noModelCallsFromFp0163 && sourceScope.noModelCalls,
  noSourceMutationFromFp0163:
    skeletonProof.noSourceMutationFromFp0163 && sourceScope.noSourceMutation,
  noFinanceWriteFromFp0163:
    skeletonProof.noFinanceWriteFromFp0163 && sourceScope.noFinanceWrite,
  noExternalCommunicationsFromFp0163:
    skeletonProof.noExternalCommunicationsFromFp0163 &&
    sourceScope.noExternalCommunications,
  noPublicAssetsFromFp0163:
    skeletonProof.noPublicAssetsFromFp0163 && pathScope.noPublicAssetsFromFp0163,
  noGeneratedPublicProseFromFp0163:
    skeletonProof.noGeneratedPublicProseFromFp0163,
  noAppSubmissionFromFp0163:
    skeletonProof.noAppSubmissionFromFp0163 && pathScope.noAppSubmissionFromFp0163,
  fp0162CloseoutFreshnessVerified:
    proofBridgeScope.fp0162CloseoutFreshnessVerified,
  fp0162SuccessorBridgeCompatibilityVerified:
    proofBridgeScope.fp0162SuccessorBridgeCompatibilityVerified,
  sharedProofOnlyLeakageSanitizerStillVerified:
    skeletonProof.sharedProofOnlyLeakageSanitizerStillVerified &&
    sourceScope.changedTextNoLeakage,
  ...priorBoundaryOverrides,
  proofDetails: {
    changedPathScope,
    disallowedChangedPaths: pathScope.disallowedChangedPaths,
    resource: resourceScope.resourceDetails,
    sourceScope,
  },
};

const proofOutputLeakageScan = scanProofOnlyNoTokenLeakageText(
  JSON.stringify(output),
);
output.sharedProofOnlyLeakageSanitizerStillVerified =
  output.sharedProofOnlyLeakageSanitizerStillVerified &&
  proofOutputLeakageScan.accepted;

for (const [key, value] of Object.entries(output)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0163 local Apps SDK resource skeleton proof failed: ${key}`,
    );
  }
}

console.log(JSON.stringify(output, null, 2));

function verifyPathScope() {
  const disallowedChangedPaths = changedPaths.filter(
    (path) => !allowedChangedPaths.has(path),
  );
  const newRouteOrApiRouteAdded = changedPaths.some(
    (path) =>
      /^apps\/web\/app\//u.test(path) ||
      /^apps\/web\/pages\/api\//u.test(path) ||
      /\/api\//u.test(path) ||
      /\/route\.tsx?$/u.test(path) ||
      path.endsWith("/routes.ts") ||
      path.startsWith("apps/control-plane/"),
  );
  const publicAssetPattern = /\.(?:png|jpe?g|gif|webp|svg|ico|avif|mp4|mov|pdf)$/iu;
  const appSubmissionPattern =
    /(?:app-submission|submission-assets|public-listing|store-listing|listing-copy|screenshots)/iu;

  return {
    changedPathScopeAccepted:
      disallowedChangedPaths.length === 0 && !newRouteOrApiRouteAdded,
    disallowedChangedPaths,
    noAppSubmissionFromFp0163: !changedPaths.some((path) =>
      appSubmissionPattern.test(path),
    ),
    noNewRouteOrApiRouteFromFp0163:
      disallowedChangedPaths.length === 0 && !newRouteOrApiRouteAdded,
    noPublicAssetsFromFp0163: !changedPaths.some((path) =>
      publicAssetPattern.test(path),
    ),
  };
}

function verifySourceScope() {
  const changedText = readChangedLeakageText(changedPaths);
  const changedTextNoLeakage = scanProofOnlyNoTokenLeakageText(changedText).accepted;
  const implementationSource = [
    skeletonSource,
    skeletonRuntimeSource,
    registrationSource,
  ].join("\n");
  const routeRuntimeSource = [
    safeRead("apps/control-plane/src/app.ts"),
    safeRead("apps/control-plane/src/container.ts"),
    safeRead("apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts"),
  ].join("\n");
  const runtimeSafeForbiddenImports = [
    /from\s+["'][^"']*(?:proof|scanner|repo-path|readiness|token-validation|app\/|apps\/|control-plane|db|provider|openai|next|react)[^"']*["']/iu,
    /node:(?:fs|child_process|crypto|http|https|net|tls|os|path|url)/iu,
    /from\s+["'](?:fs|child_process|crypto|http|https|net|tls|os|path|url)["']/iu,
  ];
  const runtimeSafeForbiddenApis = [
    /\b(?:readdirSync|readFileSync|writeFileSync|fetch|XMLHttpRequest|WebSocket|Date\.now|Math\.random|crypto|process\.env|logger|pino)\b/iu,
    /\b(?:decodeJwt|jwtDecode|fetchJwks|introspectToken|oauthCallback|sessionStore|setCookie|validateToken|verifyToken)\b/iu,
    new RegExp(
      [
        "from\\s+[\"']openai[\"']",
        "new\\s+OpenAI",
        ["OPENAI", "API", "KEY"].join("_"),
      ].join("|"),
      "iu",
    ),
    /window\.openai/iu,
  ];
  const proofHeavySkeletonModuleImportPattern =
    /from\s+["']\.\/read-only-app-mcp-local-apps-sdk-resource-skeleton["']/u;
  const defaultRegistrationSource = [
    routeRuntimeSource,
    safeRead("apps/control-plane/src/app.ts"),
    safeRead("apps/control-plane/src/container.ts"),
  ].join("\n");

  return {
    changedTextNoLeakage,
    defaultAuthAdapterWiringStillBlocked:
      !changedPaths.includes("apps/control-plane/src/container.ts"),
    defaultBuildAppBehaviorStillUnchanged:
      !changedPaths.includes("apps/control-plane/src/app.ts"),
    defaultCreateContainerBehaviorStillUnchanged:
      !changedPaths.includes("apps/control-plane/src/container.ts"),
    defaultCreateInMemoryContainerBehaviorStillUnchanged:
      !changedPaths.includes("apps/control-plane/src/container.ts"),
    defaultEvidenceDispatchWiringStillBlocked: !changedPaths.some((path) =>
      path.startsWith("apps/control-plane/"),
    ),
    mcpRouteBehaviorStillUnchanged:
      !changedPaths.includes("apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts"),
    noComponentBundleImplementation:
      !changedPaths.some((path) =>
        /(?:vite|webpack|rollup|next)\.config|component-bundle|widget\.html|\.css$/iu.test(
          path,
        ),
      ),
    defaultResourceRegistrationStillBlocked:
      !/registerResource\s*\(/u.test(defaultRegistrationSource) &&
      !/resources\/(?:list|read)|resource template/iu.test(routeRuntimeSource),
    explicitRegisterResourceHelperImportsRuntimeSafeBuilder:
      registrationSource.includes(
        "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime",
      ),
    noExternalCommunications:
      !/sendEmail\s*\(|sendReport\s*\(|webhook\s*\(|externalMessage\s*\(/u.test(
        implementationSource,
      ),
    noFinanceWrite:
      !/writeFinanceTwin\s*\(|updateLedger\s*\(|financeWrite\s*\(|postLedger\s*\(/u.test(
        implementationSource,
      ),
    noHarnessExecutionAtRequestTime:
      !/child_process|spawnSync|execFileSync|read-only-mcp-[^"']*proof|read-only-mcp-[^"']*harness/u.test(
        runtimePreviewSource,
      ),
    noLiveMcpFetchFromPreviewUi:
      !/\bfetch\s*\(/u.test(runtimePreviewSource) &&
      !/["']\/mcp["']/u.test(runtimePreviewSource),
    noModelCalls:
      !/responses\s*\.\s*create|chat\s*\.\s*completions|modelClient|callModel\s*\(/iu.test(
        implementationSource,
      ),
    noOauthSessionAuthMiddleware:
      !/authMiddleware\s*[:=(]|decodeJwt\s*\(|jwtDecode\s*\(|fetchJwks\s*\(|introspectToken\s*\(|oauthCallback\s*\(|sessionStore\s*[:=(]|setCookie\s*\(/u.test(
        implementationSource,
      ),
    noOpenAiApiCalls:
      !new RegExp(
        [
          "from\\s+[\"']openai[\"']",
          "new\\s+OpenAI",
          ["OPENAI", "API", "KEY"].join("_"),
        ].join("|"),
        "iu",
      ).test(implementationSource),
    noOutputTemplateImplementation:
      !/openai\/outputTemplate|_meta\s*:\s*\{\s*ui\s*:\s*\{\s*resourceUri|["']?outputTemplate["']?\s*:/u.test(
        implementationSource + routeRuntimeSource,
      ),
    noProductionTokenValidationRuntime:
      !/validateToken\s*\(|verifyToken\s*\(/u.test(
        implementationSource,
      ),
    noProviderCalls:
      !/providerClient\s*[:=(]|providerCall\s*\(|callProvider\s*\(|selectProvider\s*\(/u.test(
        implementationSource,
      ),
    proofHeavySkeletonModuleNotImportedByRegistration:
      !proofHeavySkeletonModuleImportPattern.test(registrationSource),
    noRenderToolImplementation:
      !/\brenderTool\s*[:=(]|render_resource|structuredContentToResource/u.test(
        implementationSource,
      ),
    noSourceMutation:
      !/uploadSource\s*\(|mutateSource\s*\(|rewriteSource\s*\(|deleteSource\s*\(/u.test(
        implementationSource,
      ),
    runtimeSafeSkeletonBuilderIsolated:
      skeletonRuntimeSource.includes(
        "buildReadOnlyMcpLocalAppsSdkResourceSkeleton",
      ) &&
      runtimeSafeForbiddenImports.every(
        (pattern) => !pattern.test(skeletonRuntimeSource),
      ) &&
      runtimeSafeForbiddenApis.every(
        (pattern) => !pattern.test(skeletonRuntimeSource),
      ),
    serverResourceRegistrationStillBlocked:
      !/registerResource\s*\(/u.test(routeRuntimeSource) &&
      !/resources\/(?:list|read)|resource template/iu.test(routeRuntimeSource),
    noToolDescriptorImplementation:
      !/openai\/outputTemplate|_meta\s*:\s*\{\s*ui\s*:\s*\{\s*resourceUri|annotations\s*:\s*\{\s*readOnlyHint/u.test(
        implementationSource,
      ),
    noWindowOpenAiUsageFromFp0163:
      !/window\.openai|callTool|uploadFile|selectFiles|openExternal|sendFollowUpMessage|requestModal|requestDisplayMode|setWidgetState/u.test(
        implementationSource + runtimePreviewSource,
      ),
    protectedResourceMetadataRouteStillUnchanged:
      !changedPaths.includes("apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts"),
  };
}

function verifyResourceScope() {
  const resource = buildReadOnlyMcpLocalAppsSdkResourceSkeleton();
  const html = resource.text;

  return {
    localAppsSdkResourceSkeletonBoundaryVerified:
      resource.uri === "ui://pocket-cfo/local-preview-demo.html" &&
      resource.mimeType === "text/html;profile=mcp-app" &&
      html.startsWith("<!doctype html>") &&
      !/<script\b|<\/script>|<a\b|<button\b|<form\b|<input\b|<select\b|<textarea\b|https?:\/\/|\bwww\./iu.test(
        html,
      ) &&
      resource._meta.ui.prefersBorder === true &&
      resource._meta.ui.csp.connectDomains.length === 0 &&
      resource._meta.ui.csp.resourceDomains.length === 0 &&
      resource._meta.ui.csp.frameDomains.length === 0 &&
      !("domain" in resource._meta.ui) &&
      !("openai/widgetCSP" in resource._meta),
    resourceDetails: {
      mimeType: resource.mimeType,
      textLength: html.length,
      uri: resource.uri,
    },
  };
}

function verifyProofBridgeScope() {
  return {
    fp0162CloseoutFreshnessVerified:
      verifyFp0162CloseoutFreshnessForFp0163(fp0162PlanText),
    fp0162SuccessorBridgeCompatibilityVerified:
      readinessProof.fp0163AbsentOrLocalAppsSdkResourceSkeletonPlanVerified ===
        true &&
      readinessProof.fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified ===
        true &&
      readinessProof.fp0165Absent === true &&
      visualQaProof.fp0163AbsentOrLocalAppsSdkResourceSkeletonPlanVerified ===
        true &&
      visualQaProof.fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified ===
        true &&
      visualQaProof.fp0165Absent === true,
  };
}

function buildPriorBoundaryOverrides() {
  return {
    fp0162LocalAppsSdkResourceReadinessBoundaryStillVerified:
      readinessProof.localAppsSdkResourceReadinessBoundaryVerified === true,
    fp0161VisualQaAccessibilityBoundaryStillVerified:
      readinessProof.fp0161VisualQaAccessibilityBoundaryStillVerified === true &&
      visualQaProof.localPreviewDemoVisualQaAccessibilityBoundaryVerified === true,
    fp0160LocalPreviewDemoUiBridgeBoundaryStillVerified:
      readinessProof.fp0160LocalPreviewDemoUiBridgeBoundaryStillVerified === true &&
      uiBridgeImplementationProof.evidenceAppLocalPreviewDemoUiBridgeImplementationBoundaryVerified === true,
    fp0159ReadinessBoundaryStillVerified:
      readinessProof.fp0159ReadinessBoundaryStillVerified === true &&
      uiBridgeReadinessProof.evidenceAppLocalPreviewDemoUiBridgeReadinessBoundaryVerified === true,
    fp0158LocalEvidenceDemoBridgeBoundaryStillVerified:
      readinessProof.fp0158LocalEvidenceDemoBridgeBoundaryStillVerified === true,
    fp0157LocalAuthDemoHarnessBoundaryStillVerified:
      readinessProof.fp0157LocalAuthDemoHarnessBoundaryStillVerified === true,
    fp0156AppConstructionInjectionBoundaryStillVerified:
      readinessProof.fp0156AppConstructionInjectionBoundaryStillVerified === true,
    fp0155LocalAdapterImplementationBoundaryStillVerified:
      readinessProof.fp0155LocalAdapterImplementationBoundaryStillVerified === true,
    fp0154LocalAdapterReadinessBoundaryStillVerified:
      readinessProof.fp0154LocalAdapterReadinessBoundaryStillVerified === true,
    fp0153AppConstructionWiringBoundaryStillVerified:
      readinessProof.fp0153AppConstructionWiringBoundaryStillVerified === true,
    fp0152RouteIntegrationBoundaryStillVerified:
      readinessProof.fp0152RouteIntegrationBoundaryStillVerified === true,
    fp0151RouteReadinessBoundaryStillVerified:
      readinessProof.fp0151RouteReadinessBoundaryStillVerified === true,
    fp0150RouteIntegrationSequencingBoundaryStillVerified:
      readinessProof.fp0150RouteIntegrationSequencingBoundaryStillVerified === true,
    fp0149ParserImplementationBoundaryStillVerified:
      readinessProof.fp0149ParserImplementationBoundaryStillVerified === true,
    fp0148ReadinessBoundaryStillVerified:
      readinessProof.fp0148ReadinessBoundaryStillVerified === true,
    fp0147ProviderSelectionEvidenceBoundaryStillVerified:
      readinessProof.fp0147ProviderSelectionEvidenceBoundaryStillVerified === true,
    fp0146ParserContractsBoundaryStillVerified:
      readinessProof.fp0146ParserContractsBoundaryStillVerified === true,
    fp0145RuntimeContractsBoundaryStillVerified:
      readinessProof.fp0145RuntimeContractsBoundaryStillVerified === true,
    fp0144ProductionTokenValidationSequencingBoundaryStillVerified:
      readinessProof.fp0144ProductionTokenValidationSequencingBoundaryStillVerified === true,
    fp0143InvalidTokenAppWiringBoundaryStillVerified:
      readinessProof.fp0143InvalidTokenAppWiringBoundaryStillVerified === true,
    fp0142RouteIntegrationSequencingBoundaryStillVerified:
      readinessProof.fp0142RouteIntegrationSequencingBoundaryStillVerified === true,
    fp0141InvalidTokenLocalRuntimeBoundaryStillVerified:
      readinessProof.fp0141InvalidTokenLocalRuntimeBoundaryStillVerified === true,
    fp0139ResultEnvelopeBoundaryStillVerified:
      readinessProof.fp0139ResultEnvelopeBoundaryStillVerified === true,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      readinessProof.fp0130MissingTokenChallengeBoundaryStillVerified === true,
    fp0125ProtectedResourceMetadataRouteBoundaryStillVerified:
      readinessProof.fp0125ProtectedResourceMetadataRouteBoundaryStillVerified === true,
    fp0109EvidenceDispatchAdapterBoundaryStillVerified:
      readinessProof.fp0109EvidenceDispatchAdapterBoundaryStillVerified === true,
    fp0108EvidenceDispatchContractBoundaryStillVerified:
      readinessProof.fp0108EvidenceDispatchContractBoundaryStillVerified === true,
    fp0097PreviewVisualQaBoundaryStillVerified:
      readinessProof.fp0097PreviewVisualQaBoundaryStillVerified === true,
    fp0096PreviewStateMatrixBoundaryStillVerified:
      readinessProof.fp0096PreviewStateMatrixBoundaryStillVerified === true,
    fp0094PreviewRouteBoundaryStillVerified:
      readinessProof.fp0094PreviewRouteBoundaryStillVerified === true,
    fp0086BenchmarkCommunityBoundaryStillVerified:
      readinessProof.fp0086BenchmarkCommunityBoundaryStillVerified === true,
    fp0085BoundedOrchestrationBoundaryStillVerified:
      readinessProof.fp0085BoundedOrchestrationBoundaryStillVerified === true,
    fp0082EvidenceAppAlphaBoundaryStillVerified:
      readinessProof.fp0082EvidenceAppAlphaBoundaryStillVerified === true,
    fp0081DocumentPrecisionBoundaryStillVerified:
      readinessProof.fp0081DocumentPrecisionBoundaryStillVerified === true,
    fp0080EvidenceIndexBoundaryStillVerified:
      readinessProof.fp0080EvidenceIndexBoundaryStillVerified === true,
    fp0107RouteAdapterBoundaryStillVerified:
      readinessProof.fp0107RouteAdapterBoundaryStillVerified === true,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      readinessProof.fp0106ProtocolEnvelopeBoundaryStillVerified === true,
    fp0100PublicSecurityBoundaryStillVerified:
      readinessProof.fp0100PublicSecurityBoundaryStillVerified === true,
  };
}

function runJsonTool(path) {
  const output = execFileSync("pnpm", ["exec", "tsx", path], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 20,
  });

  return JSON.parse(output);
}

function changedFilePathScope() {
  const committedBranchDiffPaths = gitLines([
    "diff",
    "--name-only",
    "origin/main...HEAD",
  ]);
  const unstaged = gitLines(["diff", "--name-only"]);
  const staged = gitLines(["diff", "--name-only", "--cached"]);
  const untracked = gitLines(["ls-files", "--others", "--exclude-standard"]);
  const combinedChangedPaths = [
    ...new Set([...committedBranchDiffPaths, ...unstaged, ...staged, ...untracked]),
  ].sort();

  return { combinedChangedPaths, committedBranchDiffPaths, unstaged, staged, untracked };
}

function gitLines(args) {
  const result = spawnSync("git", args, {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10,
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr || result.stdout}`);
  }

  return result.stdout.split("\n").map((line) => line.trim()).filter(Boolean);
}

function readChangedLeakageText(paths) {
  return paths
    .filter((path) => existsSync(path) && !path.endsWith(".log"))
    .map((path) => safeRead(path))
    .join("\n");
}

function repoFilePaths(root = new URL("../", import.meta.url)) {
  const paths = [];

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if ([".git", ".next", ".turbo", "coverage", "dist", "node_modules"].includes(entry.name)) {
      continue;
    }

    const child = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, root);
    if (entry.isDirectory()) {
      paths.push(...repoFilePaths(child));
    } else {
      paths.push(child.pathname.replace(/^.*\/pocket-cto-starter\//u, ""));
    }
  }

  return paths.sort();
}

function safeRead(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}
