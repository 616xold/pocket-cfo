/* global console */

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
  LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
  READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_NAME,
  buildReadOnlyMcpLocalAppsSdkResourceRegistrationProof,
  registerReadOnlyMcpLocalAppsSdkResourceSkeleton,
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
  verifyFp0163CloseoutFreshnessForFp0164,
  verifyFp0164AbsentOrReadOnlyMcpLocalAppsSdkResourceRegistrationPlan,
  verifyFp0165Absent,
  verifyReadOnlyMcpLocalAppsSdkResourceRegistrationBoundary,
} from "../packages/domain/src/index.ts";

const SCHEMA_VERSION =
  "v2cf.read-only-chatgpt-app-mcp-local-apps-sdk-resource-registration-proof.v1";

const FP0163_PLAN_PATH =
  "plans/FP-0163-read-only-chatgpt-app-mcp-local-apps-sdk-resource-skeleton.md";
const FP0164_PLAN_PATH =
  "plans/FP-0164-read-only-chatgpt-app-mcp-local-apps-sdk-resource-registration.md";
const SKELETON_RUNTIME_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime.ts";
const SKELETON_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts";
const REGISTRATION_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.ts";
const REGISTRATION_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.spec.ts";
const REGISTRATION_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-registration-proof.mjs";
const SKELETON_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs";
const READINESS_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-readiness-proof.mjs";
const VISUAL_QA_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-visual-qa-accessibility-proof.mjs";
const UI_BRIDGE_IMPLEMENTATION_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-implementation-proof.mjs";
const UI_BRIDGE_READINESS_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs";
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
  FP0163_PLAN_PATH,
  FP0164_PLAN_PATH,
  SKELETON_RUNTIME_MODULE_PATH,
  SKELETON_MODULE_PATH,
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.ts",
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts",
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts",
  "packages/domain/src/read-only-app-mcp-token-validation-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input-inventory-rules.ts",
  REGISTRATION_MODULE_PATH,
  REGISTRATION_SPEC_PATH,
  "packages/domain/src/index.ts",
  REGISTRATION_PROOF_PATH,
  SKELETON_PROOF_PATH,
  READINESS_PROOF_PATH,
  VISUAL_QA_PROOF_PATH,
  UI_BRIDGE_IMPLEMENTATION_PROOF_PATH,
  UI_BRIDGE_READINESS_PROOF_PATH,
  "tools/read-only-mcp-evidence-app-local-demo-bridge-proof.mjs",
  "tools/read-only-mcp-auth-local-demo-harness-proof.mjs",
  "tools/read-only-mcp-authorization-parser-local-adapter-app-construction-injection-proof.mjs",
  "tools/read-only-mcp-authorization-parser-local-adapter-implementation-proof.mjs",
  "tools/read-only-mcp-authorization-parser-local-adapter-construction-readiness-proof.mjs",
  "tools/read-only-mcp-authorization-parser-app-construction-wiring-proof.mjs",
  "tools/read-only-mcp-authorization-parser-route-integration-implementation-proof.mjs",
  "tools/read-only-mcp-authorization-parser-route-integration-readiness-proof.mjs",
  "tools/read-only-mcp-authorization-parser-route-integration-sequencing-proof.mjs",
  "tools/read-only-mcp-authorization-parser-pure-domain-implementation-proof.mjs",
  "tools/read-only-mcp-authorization-parser-implementation-readiness-proof.mjs",
  "tools/read-only-mcp-provider-selection-evidence-hardening-proof.mjs",
  "tools/read-only-mcp-authorization-parser-contracts-provider-selection-proof.mjs",
  "tools/read-only-mcp-token-validation-runtime-contracts-proof-hardening-proof.mjs",
  "tools/read-only-mcp-production-token-validation-sequencing-proof.mjs",
  "tools/read-only-mcp-invalid-token-app-wiring-proof.mjs",
  "tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs",
  "tools/read-only-mcp-invalid-token-challenge-local-runtime-proof.mjs",
  "tools/read-only-mcp-token-validation-result-envelope-proof.mjs",
  "tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs",
  "tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs",
  "tools/read-only-mcp-protected-resource-metadata-local-route-proof.mjs",
  "tools/read-only-mcp-route-adapter-proof.mjs",
  "tools/read-only-public-app-security-boundary-proof.mjs",
  "tools/read-only-mcp-protocol-envelope-proof.mjs",
  "tools/read-only-endpoint-route-ownership-proof.mjs",
  "tools/read-only-endpoint-architecture-proof.mjs",
  "tools/read-only-chatgpt-app-mcp-proof.mjs",
  "tools/read-only-mcp-evidence-tool-dispatch-proof.mjs",
  "tools/read-only-mcp-default-local-evidence-dispatch-proof.mjs",
  "tools/benchmark-community-pack-proof.mjs",
  "tools/bounded-llm-orchestration-proof.mjs",
  "tools/read-only-evidence-app-proof.mjs",
  "tools/document-precision-foundation-proof.mjs",
  "tools/evidence-index-foundation-proof.mjs",
]);

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const fp0163PlanText = safeRead(FP0163_PLAN_PATH);
const skeletonRuntimeSource = safeRead(SKELETON_RUNTIME_MODULE_PATH);
const skeletonSource = safeRead(SKELETON_MODULE_PATH);
const registrationSource = safeRead(REGISTRATION_MODULE_PATH);
const defaultRuntimeSource = [
  safeRead("apps/control-plane/src/app.ts"),
  safeRead("apps/control-plane/src/container.ts"),
  safeRead("apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts"),
].join("\n");
const previewRuntimeSource = [
  safeRead(PREVIEW_ROUTE_PATH),
  safeRead(BRIDGE_COMPONENT_PATH),
  safeRead(BRIDGE_SNAPSHOT_PATH),
].join("\n");
const skeletonProof = runJsonTool(SKELETON_PROOF_PATH);
const readinessProof = runJsonTool(READINESS_PROOF_PATH);
const visualQaProof = runJsonTool(VISUAL_QA_PROOF_PATH);
const uiBridgeImplementationProof = runJsonTool(
  UI_BRIDGE_IMPLEMENTATION_PROOF_PATH,
);
const uiBridgeReadinessProof = runJsonTool(UI_BRIDGE_READINESS_PROOF_PATH);
const pathScope = verifyPathScope();
const planScope = verifyPlanScope();
const sourceScope = verifySourceScope();
const registrationCallScope = verifyRegistrationCallScope();
const resourceScope = verifyResourceScope(registrationCallScope.content);
const proofBridgeScope = verifyProofBridgeScope();
const domainProofInput = {
  defaultRegistrationStillBlocked:
    sourceScope.defaultResourceRegistrationStillBlocked,
  fp0163CloseoutFresh: planScope.fp0163CloseoutFreshnessVerified,
  fp0163SuccessorBridgeCompatible:
    proofBridgeScope.fp0163SuccessorBridgeCompatibilityVerified,
  fp0164PlanVerified:
    planScope.fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified,
  fp0165Absent: planScope.fp0165Absent,
  noAppRuntimeOrRouteWiring:
    pathScope.noNewRouteOrApiRouteFromFp0164 &&
    pathScope.noAppWebRuntimeEditFromFp0164,
  noToolDescriptorOrRenderTool:
    sourceScope.toolDescriptorImplementationStillBlocked &&
    sourceScope.outputTemplateImplementationStillBlocked &&
    sourceScope.renderToolImplementationStillBlocked,
  registrationHelperImportsRuntimeSafeBuilder:
    sourceScope.explicitRegisterResourceHelperImportsRuntimeSafeBuilder,
  registrationHelperNotProofHeavy:
    sourceScope.proofHeavySkeletonModuleNotImportedByRegistration,
  registerResourceCalledExactlyOnce:
    registrationCallScope.registerResourceCalledExactlyOnce,
  runtimeSafeSkeletonBuilderIsolated:
    sourceScope.runtimeSafeSkeletonBuilderIsolated,
};
const registrationProof =
  buildReadOnlyMcpLocalAppsSdkResourceRegistrationProof(domainProofInput);

const output = {
  schemaVersion: SCHEMA_VERSION,
  fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified:
    registrationProof.fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified,
  fp0165Absent: registrationProof.fp0165Absent,
  localAppsSdkResourceRegistrationBoundaryVerified:
    verifyReadOnlyMcpLocalAppsSdkResourceRegistrationBoundary(
      domainProofInput,
    ) &&
    pathScope.changedPathScopeAccepted &&
    sourceScope.registrationHelperBoundaryVerified &&
    registrationCallScope.registrationCallBoundaryVerified &&
    resourceScope.resourceBoundaryVerified,
  runtimeSafeSkeletonBuilderIsolated:
    registrationProof.runtimeSafeSkeletonBuilderIsolated &&
    sourceScope.runtimeSafeSkeletonBuilderIsolated,
  proofHeavySkeletonModuleNotImportedByRegistration:
    registrationProof.proofHeavySkeletonModuleNotImportedByRegistration &&
    sourceScope.proofHeavySkeletonModuleNotImportedByRegistration,
  explicitRegisterResourceHelperImplemented:
    registrationProof.explicitRegisterResourceHelperImplemented &&
    sourceScope.explicitRegisterResourceHelperImplemented,
  explicitRegisterResourceHelperRequiresCallerProvidedRegistry:
    registrationProof.explicitRegisterResourceHelperRequiresCallerProvidedRegistry &&
    registrationCallScope.invalidRegistryRejected,
  registerResourceCalledExactlyOnceInHelperSpec:
    registrationProof.registerResourceCalledExactlyOnceInHelperSpec &&
    registrationCallScope.registerResourceCalledExactlyOnce,
  deterministicLocalResourceNameVerified:
    registrationProof.deterministicLocalResourceNameVerified &&
    registrationCallScope.deterministicLocalResourceNameVerified,
  deterministicLocalResourceUriVerified:
    registrationProof.deterministicLocalResourceUriVerified &&
    registrationCallScope.deterministicLocalResourceUriVerified,
  registeredResourceContentsShapeVerified:
    registrationProof.registeredResourceContentsShapeVerified &&
    resourceScope.registeredResourceContentsShapeVerified,
  defaultResourceRegistrationStillBlocked:
    registrationProof.defaultResourceRegistrationStillBlocked &&
    sourceScope.defaultResourceRegistrationStillBlocked,
  serverResourceRegistrationStillBlocked:
    registrationProof.serverResourceRegistrationStillBlocked &&
    sourceScope.serverResourceRegistrationStillBlocked,
  toolDescriptorImplementationStillBlocked:
    registrationProof.toolDescriptorImplementationStillBlocked &&
    sourceScope.toolDescriptorImplementationStillBlocked,
  outputTemplateImplementationStillBlocked:
    registrationProof.outputTemplateImplementationStillBlocked &&
    sourceScope.outputTemplateImplementationStillBlocked,
  renderToolImplementationStillBlocked:
    registrationProof.renderToolImplementationStillBlocked &&
    sourceScope.renderToolImplementationStillBlocked,
  componentBundleImplementationStillBlocked:
    registrationProof.componentBundleImplementationStillBlocked &&
    sourceScope.componentBundleImplementationStillBlocked,
  noNewRouteOrApiRouteFromFp0164: pathScope.noNewRouteOrApiRouteFromFp0164,
  noAppWebRuntimeEditFromFp0164: pathScope.noAppWebRuntimeEditFromFp0164,
  noLiveMcpFetchFromPreviewUi: sourceScope.noLiveMcpFetchFromPreviewUi,
  noWindowOpenAiUsageFromFp0164: sourceScope.noWindowOpenAiUsageFromFp0164,
  noHarnessExecutionAtRequestTime: sourceScope.noHarnessExecutionAtRequestTime,
  resourceCspHasNoExternalConnectDomains:
    resourceScope.resourceCspHasNoExternalConnectDomains,
  resourceCspHasNoExternalResourceDomains:
    resourceScope.resourceCspHasNoExternalResourceDomains,
  resourceCspHasNoFrameDomains: resourceScope.resourceCspHasNoFrameDomains,
  resourceMetadataHasNoPublicWidgetDomain:
    resourceScope.resourceMetadataHasNoPublicWidgetDomain,
  resourceMetadataHasNoRedirectDomains:
    resourceScope.resourceMetadataHasNoRedirectDomains,
  widgetDescriptionReadOnlySyntheticLocalNoSubmission:
    resourceScope.widgetDescriptionReadOnlySyntheticLocalNoSubmission,
  resourceRegistrationTwoLanePosturePreserved:
    resourceScope.resourceRegistrationTwoLanePosturePreserved,
  productionTokenValidationFalseStillRendered:
    resourceScope.productionTokenValidationFalseStillRendered,
  publicChatGptAppFalseStillRendered:
    resourceScope.publicChatGptAppFalseStillRendered,
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
  noProductionTokenValidationFromFp0164:
    sourceScope.noProductionTokenValidationFromFp0164,
  noOauthSessionAuthMiddlewareFromFp0164:
    sourceScope.noOauthSessionAuthMiddlewareFromFp0164,
  noProviderCallsFromFp0164: sourceScope.noProviderCallsFromFp0164,
  noOpenAiApiCallsFromFp0164: sourceScope.noOpenAiApiCallsFromFp0164,
  noModelCallsFromFp0164: sourceScope.noModelCallsFromFp0164,
  noSourceMutationFromFp0164: sourceScope.noSourceMutationFromFp0164,
  noFinanceWriteFromFp0164: sourceScope.noFinanceWriteFromFp0164,
  noExternalCommunicationsFromFp0164:
    sourceScope.noExternalCommunicationsFromFp0164,
  noPublicAssetsFromFp0164: pathScope.noPublicAssetsFromFp0164,
  noGeneratedPublicProseFromFp0164:
    pathScope.noGeneratedPublicProseFromFp0164,
  noAppSubmissionFromFp0164: pathScope.noAppSubmissionFromFp0164,
  fp0163CloseoutFreshnessVerified:
    registrationProof.fp0163CloseoutFreshnessVerified &&
    planScope.fp0163CloseoutFreshnessVerified,
  fp0163SuccessorBridgeCompatibilityVerified:
    registrationProof.fp0163SuccessorBridgeCompatibilityVerified &&
    proofBridgeScope.fp0163SuccessorBridgeCompatibilityVerified,
  sharedProofOnlyLeakageSanitizerStillVerified:
    sourceScope.changedTextNoLeakage &&
    sourceScope.syntheticLeakageFixturesRejected,
  fp0163SkeletonBoundaryStillVerified:
    skeletonProof.localAppsSdkResourceSkeletonBoundaryVerified === true,
  fp0162LocalAppsSdkResourceReadinessBoundaryStillVerified:
    readinessProof.localAppsSdkResourceReadinessBoundaryVerified === true,
  fp0161VisualQaAccessibilityBoundaryStillVerified:
    visualQaProof.localPreviewDemoVisualQaAccessibilityBoundaryVerified === true,
  fp0160LocalPreviewDemoUiBridgeBoundaryStillVerified:
    uiBridgeImplementationProof.evidenceAppLocalPreviewDemoUiBridgeImplementationBoundaryVerified === true,
  fp0159ReadinessBoundaryStillVerified:
    uiBridgeReadinessProof.evidenceAppLocalPreviewDemoUiBridgeReadinessBoundaryVerified === true,
  ...priorBoundaryFieldsFromSkeletonProof(skeletonProof),
  proofDetails: {
    changedPathScope,
    disallowedChangedPaths: pathScope.disallowedChangedPaths,
    registration: registrationCallScope.details,
    resource: resourceScope.details,
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
      `FP-0164 local Apps SDK resource registration proof failed: ${key}`,
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
    noAppSubmissionFromFp0164: !changedPaths.some((path) =>
      appSubmissionPattern.test(path),
    ),
    noAppWebRuntimeEditFromFp0164: !changedPaths.some((path) =>
      path.startsWith("apps/web/"),
    ),
    noGeneratedPublicProseFromFp0164: !changedPaths.some((path) =>
      /(?:listing-copy|public-listing|store-listing|app-submission)/iu.test(
        path,
      ),
    ),
    noNewRouteOrApiRouteFromFp0164:
      disallowedChangedPaths.length === 0 && !newRouteOrApiRouteAdded,
    noPublicAssetsFromFp0164: !changedPaths.some((path) =>
      publicAssetPattern.test(path),
    ),
  };
}

function verifyPlanScope() {
  const fp0164Hits = repoPaths.filter((path) => /(^|\/)FP-0164/u.test(path));

  return {
    fp0163CloseoutFreshnessVerified:
      verifyFp0163CloseoutFreshnessForFp0164(fp0163PlanText),
    fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified:
      fp0164Hits.length === 1 &&
      fp0164Hits[0] === FP0164_PLAN_PATH &&
      verifyFp0164AbsentOrReadOnlyMcpLocalAppsSdkResourceRegistrationPlan(
        repoPaths,
      ),
    fp0165Absent: verifyFp0165Absent(repoPaths),
  };
}

function verifySourceScope() {
  const changedText = readChangedLeakageText(changedPaths);
  const changedTextNoLeakage = scanProofOnlyNoTokenLeakageText(changedText).accepted;
  const implementationSource = [
    skeletonRuntimeSource,
    registrationSource,
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
  const unsafeCredentialLine = [
    "authorization",
    ": ",
    "bearer",
    " ",
    ["local", "fixture", "material"].join(""),
  ].join("");
  const unsafeJwtLikeLine = [
    "ey",
    "J",
    "headerpart",
    ".",
    "payloadpart",
    ".",
    "signaturepart",
  ].join("");

  return {
    changedTextNoLeakage,
    componentBundleImplementationStillBlocked:
      !changedPaths.some((path) =>
        /(?:vite|webpack|rollup|next)\.config|component-bundle|widget\.html|\.css$/iu.test(
          path,
        ),
      ),
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
    defaultResourceRegistrationStillBlocked:
      !/registerResource\s*\(/u.test(defaultRuntimeSource),
    explicitRegisterResourceHelperImplemented:
      registrationSource.includes(
        "registerReadOnlyMcpLocalAppsSdkResourceSkeleton",
      ),
    explicitRegisterResourceHelperImportsRuntimeSafeBuilder:
      registrationSource.includes(
        "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime",
      ),
    mcpRouteBehaviorStillUnchanged:
      !changedPaths.includes("apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts"),
    noExternalCommunicationsFromFp0164:
      !/sendEmail\s*\(|sendReport\s*\(|webhook\s*\(|externalMessage\s*\(/u.test(
        implementationSource,
      ),
    noFinanceWriteFromFp0164:
      !/writeFinanceTwin\s*\(|updateLedger\s*\(|financeWrite\s*\(|postLedger\s*\(/u.test(
        implementationSource,
      ),
    noHarnessExecutionAtRequestTime:
      !/child_process|spawnSync|execFileSync|read-only-mcp-[^"']*proof|read-only-mcp-[^"']*harness/u.test(
        previewRuntimeSource + defaultRuntimeSource,
      ),
    noLiveMcpFetchFromPreviewUi:
      !/\bfetch\s*\(/u.test(previewRuntimeSource) &&
      !/["']\/mcp["']/u.test(previewRuntimeSource),
    noModelCallsFromFp0164:
      !/responses\s*\.\s*create|chat\s*\.\s*completions|modelClient|callModel\s*\(/iu.test(
        implementationSource,
      ),
    noOauthSessionAuthMiddlewareFromFp0164:
      !/authMiddleware\s*[:=(]|decodeJwt\s*\(|jwtDecode\s*\(|fetchJwks\s*\(|introspectToken\s*\(|oauthCallback\s*\(|sessionStore\s*[:=(]|setCookie\s*\(/u.test(
        implementationSource,
      ),
    noOpenAiApiCallsFromFp0164:
      !new RegExp(
        [
          "from\\s+[\"']openai[\"']",
          "new\\s+OpenAI",
          ["OPENAI", "API", "KEY"].join("_"),
        ].join("|"),
        "iu",
      ).test(implementationSource),
    noProductionTokenValidationFromFp0164:
      !/validateToken\s*\(|verifyToken\s*\(/u.test(implementationSource),
    noProviderCallsFromFp0164:
      !/providerClient\s*[:=(]|providerCall\s*\(|callProvider\s*\(|selectProvider\s*\(/u.test(
        implementationSource,
      ),
    noSourceMutationFromFp0164:
      !/uploadSource\s*\(|mutateSource\s*\(|rewriteSource\s*\(|deleteSource\s*\(/u.test(
        implementationSource,
      ),
    noWindowOpenAiUsageFromFp0164:
      !/window\.openai|callTool|uploadFile|selectFiles|openExternal|sendFollowUpMessage|requestModal|requestDisplayMode|setWidgetState/u.test(
        implementationSource + previewRuntimeSource,
      ),
    outputTemplateImplementationStillBlocked:
      !/openai\/outputTemplate|_meta\s*:\s*\{\s*ui\s*:\s*\{\s*resourceUri|["']?outputTemplate["']?\s*:/u.test(
        implementationSource + defaultRuntimeSource,
      ),
    proofHeavySkeletonModuleNotImportedByRegistration:
      !proofHeavySkeletonModuleImportPattern.test(registrationSource),
    protectedResourceMetadataRouteStillUnchanged:
      !changedPaths.includes("apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts"),
    registrationHelperBoundaryVerified:
      registrationSource.includes("caller-provided registerResource") &&
      registrationSource.includes("bind(registry)") &&
      !proofHeavySkeletonModuleImportPattern.test(registrationSource),
    renderToolImplementationStillBlocked:
      !/\brenderTool\s*[:=(]|render_resource|structuredContentToResource/u.test(
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
      !/registerResource\s*\(/u.test(defaultRuntimeSource) &&
      !/resources\/(?:list|read)|resource template/iu.test(defaultRuntimeSource),
    syntheticLeakageFixturesRejected:
      scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted === false &&
      scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted === false,
    toolDescriptorImplementationStillBlocked:
      !/openai\/outputTemplate|_meta\s*:\s*\{\s*ui\s*:\s*\{\s*resourceUri|annotations\s*:\s*\{\s*readOnlyHint/u.test(
        implementationSource + defaultRuntimeSource,
      ),
  };
}

function verifyRegistrationCallScope() {
  const calls = [];
  const registry = {
    registerResource(name, uri, metadata, handler) {
      calls.push({ handler, metadata, name, uri });
    },
  };
  let invalidRegistryRejected = false;
  try {
    registerReadOnlyMcpLocalAppsSdkResourceSkeleton({});
  } catch {
    invalidRegistryRejected = true;
  }

  const summary = registerReadOnlyMcpLocalAppsSdkResourceSkeleton(registry);
  const call = calls[0];
  const handlerResult = call?.handler();
  const content = handlerResult?.contents[0];

  return {
    content,
    deterministicLocalResourceNameVerified:
      call?.name === READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_NAME,
    deterministicLocalResourceUriVerified:
      call?.uri === LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    details: {
      callCount: calls.length,
      metadataKeys: Object.keys(call?.metadata ?? {}),
      mimeType: summary.mimeType,
      name: summary.name,
      uri: summary.uri,
    },
    invalidRegistryRejected,
    registerResourceCalledExactlyOnce: calls.length === 1,
    registrationCallBoundaryVerified:
      calls.length === 1 &&
      call?.name === READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_NAME &&
      call?.uri === LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI &&
      Object.keys(call.metadata).length === 0 &&
      typeof call.handler === "function" &&
      summary.registered === true &&
      summary.localOnly === true &&
      summary.defaultRegistration === false &&
      summary.serverResourceRegistration === false &&
      !("registry" in summary) &&
      !("handler" in summary),
  };
}

function verifyResourceScope(content) {
  const html = content?.text ?? "";
  const meta = content?._meta ?? {};
  const widgetDescription =
    typeof meta["openai/widgetDescription"] === "string"
      ? meta["openai/widgetDescription"].toLowerCase()
      : "";

  return {
    details: {
      mimeType: content?.mimeType,
      textLength: html.length,
      uri: content?.uri,
      widgetDescription: meta["openai/widgetDescription"],
    },
    productionTokenValidationFalseStillRendered:
      html.includes("productionTokenValidationImplemented: false"),
    publicChatGptAppFalseStillRendered:
      html.includes("publicChatGptAppImplemented: false"),
    registeredResourceContentsShapeVerified:
      content?.uri === LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI &&
      content.mimeType === LOCAL_APPS_SDK_RESOURCE_MIME_TYPE &&
      html.startsWith("<!doctype html>") &&
      !/<script\b|<\/script>|<a\b|<button\b|<form\b|<input\b|<select\b|<textarea\b|https?:\/\/|\bwww\.|window\.openai|["']\/mcp["']/iu.test(
        html,
      ),
    resourceBoundaryVerified:
      content?.uri === LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI &&
      content.mimeType === LOCAL_APPS_SDK_RESOURCE_MIME_TYPE &&
      html.startsWith("<!doctype html>") &&
      meta.ui?.prefersBorder === true &&
      meta.ui?.csp?.connectDomains?.length === 0 &&
      meta.ui?.csp?.resourceDomains?.length === 0 &&
      meta.ui?.csp?.frameDomains?.length === 0 &&
      !("domain" in meta.ui) &&
      !("openai/widgetCSP" in meta),
    resourceCspHasNoExternalConnectDomains:
      meta.ui?.csp?.connectDomains?.length === 0,
    resourceCspHasNoExternalResourceDomains:
      meta.ui?.csp?.resourceDomains?.length === 0,
    resourceCspHasNoFrameDomains: meta.ui?.csp?.frameDomains?.length === 0,
    resourceMetadataHasNoPublicWidgetDomain:
      meta.ui !== undefined && !("domain" in meta.ui),
    resourceMetadataHasNoRedirectDomains: !("openai/widgetCSP" in meta),
    resourceRegistrationTwoLanePosturePreserved:
      html.includes('data-lane-id="auth-boundary"') &&
      html.includes('data-lane-id="evidence-tool"') &&
      html.includes('data-lanes="auth-boundary evidence-tool"'),
    widgetDescriptionReadOnlySyntheticLocalNoSubmission:
      widgetDescription.includes("read-only") &&
      widgetDescription.includes("synthetic") &&
      widgetDescription.includes("local") &&
      widgetDescription.includes("no production authentication") &&
      widgetDescription.includes("no real finance data") &&
      widgetDescription.includes("no public app submission") &&
      !/market|launch|install|try now|sign up/iu.test(widgetDescription),
  };
}

function verifyProofBridgeScope() {
  return {
    fp0163SuccessorBridgeCompatibilityVerified:
      skeletonProof.fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified === true &&
      skeletonProof.fp0165Absent === true &&
      skeletonProof.runtimeSafeSkeletonBuilderIsolated === true &&
      skeletonProof.registerResourceImplementationStillExplicitOnly === true &&
      skeletonProof.defaultResourceRegistrationStillBlocked === true &&
      skeletonProof.serverResourceRegistrationStillBlocked === true &&
      readinessProof.fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified === true &&
      readinessProof.fp0165Absent === true &&
      visualQaProof.fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified === true &&
      visualQaProof.fp0165Absent === true,
  };
}

function priorBoundaryFieldsFromSkeletonProof(proof) {
  return {
    fp0158LocalEvidenceDemoBridgeBoundaryStillVerified:
      proof.fp0158LocalEvidenceDemoBridgeBoundaryStillVerified === true,
    fp0157LocalAuthDemoHarnessBoundaryStillVerified:
      proof.fp0157LocalAuthDemoHarnessBoundaryStillVerified === true,
    fp0156AppConstructionInjectionBoundaryStillVerified:
      proof.fp0156AppConstructionInjectionBoundaryStillVerified === true,
    fp0155LocalAdapterImplementationBoundaryStillVerified:
      proof.fp0155LocalAdapterImplementationBoundaryStillVerified === true,
    fp0154LocalAdapterReadinessBoundaryStillVerified:
      proof.fp0154LocalAdapterReadinessBoundaryStillVerified === true,
    fp0153AppConstructionWiringBoundaryStillVerified:
      proof.fp0153AppConstructionWiringBoundaryStillVerified === true,
    fp0152RouteIntegrationBoundaryStillVerified:
      proof.fp0152RouteIntegrationBoundaryStillVerified === true,
    fp0151RouteReadinessBoundaryStillVerified:
      proof.fp0151RouteReadinessBoundaryStillVerified === true,
    fp0150RouteIntegrationSequencingBoundaryStillVerified:
      proof.fp0150RouteIntegrationSequencingBoundaryStillVerified === true,
    fp0149ParserImplementationBoundaryStillVerified:
      proof.fp0149ParserImplementationBoundaryStillVerified === true,
    fp0148ReadinessBoundaryStillVerified:
      proof.fp0148ReadinessBoundaryStillVerified === true,
    fp0147ProviderSelectionEvidenceBoundaryStillVerified:
      proof.fp0147ProviderSelectionEvidenceBoundaryStillVerified === true,
    fp0146ParserContractsBoundaryStillVerified:
      proof.fp0146ParserContractsBoundaryStillVerified === true,
    fp0145RuntimeContractsBoundaryStillVerified:
      proof.fp0145RuntimeContractsBoundaryStillVerified === true,
    fp0144ProductionTokenValidationSequencingBoundaryStillVerified:
      proof.fp0144ProductionTokenValidationSequencingBoundaryStillVerified === true,
    fp0143AppWiringBoundaryStillVerified:
      proof.fp0143InvalidTokenAppWiringBoundaryStillVerified === true,
    fp0143InvalidTokenAppWiringBoundaryStillVerified:
      proof.fp0143InvalidTokenAppWiringBoundaryStillVerified === true,
    fp0142RouteIntegrationSequencingBoundaryStillVerified:
      proof.fp0142RouteIntegrationSequencingBoundaryStillVerified === true,
    fp0141InvalidTokenLocalRuntimeBoundaryStillVerified:
      proof.fp0141InvalidTokenLocalRuntimeBoundaryStillVerified === true,
    fp0139ResultEnvelopeBoundaryStillVerified:
      proof.fp0139ResultEnvelopeBoundaryStillVerified === true,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      proof.fp0130MissingTokenChallengeBoundaryStillVerified === true,
    fp0125ProtectedResourceMetadataRouteBoundaryStillVerified:
      proof.fp0125ProtectedResourceMetadataRouteBoundaryStillVerified === true,
    fp0109EvidenceDispatchAdapterBoundaryStillVerified:
      proof.fp0109EvidenceDispatchAdapterBoundaryStillVerified === true,
    fp0108EvidenceDispatchContractBoundaryStillVerified:
      proof.fp0108EvidenceDispatchContractBoundaryStillVerified === true,
    fp0097PreviewVisualQaBoundaryStillVerified:
      proof.fp0097PreviewVisualQaBoundaryStillVerified === true,
    fp0096PreviewStateMatrixBoundaryStillVerified:
      proof.fp0096PreviewStateMatrixBoundaryStillVerified === true,
    fp0094PreviewRouteBoundaryStillVerified:
      proof.fp0094PreviewRouteBoundaryStillVerified === true,
    fp0086BenchmarkCommunityBoundaryStillVerified:
      proof.fp0086BenchmarkCommunityBoundaryStillVerified === true,
    fp0085BoundedOrchestrationBoundaryStillVerified:
      proof.fp0085BoundedOrchestrationBoundaryStillVerified === true,
    fp0082EvidenceAppAlphaBoundaryStillVerified:
      proof.fp0082EvidenceAppAlphaBoundaryStillVerified === true,
    fp0081DocumentPrecisionBoundaryStillVerified:
      proof.fp0081DocumentPrecisionBoundaryStillVerified === true,
    fp0080EvidenceIndexBoundaryStillVerified:
      proof.fp0080EvidenceIndexBoundaryStillVerified === true,
    fp0107RouteAdapterBoundaryStillVerified:
      proof.fp0107RouteAdapterBoundaryStillVerified === true,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      proof.fp0106ProtocolEnvelopeBoundaryStillVerified === true,
    fp0100PublicSecurityBoundaryStillVerified:
      proof.fp0100PublicSecurityBoundaryStillVerified === true,
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

  return { combinedChangedPaths, committedBranchDiffPaths, staged, unstaged, untracked };
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
