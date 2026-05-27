/* global console */

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  buildReadOnlyMcpLocalRenderToolDescriptorReadinessProof,
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
  verifyFp0164CloseoutFreshnessForFp0165,
  verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan,
  verifyFp0166Absent,
  verifyReadOnlyMcpLocalRenderToolDescriptorReadinessBoundary,
} from "../packages/domain/src/index.ts";

const SCHEMA_VERSION =
  "v2cg.read-only-chatgpt-app-mcp-local-render-tool-descriptor-readiness-proof.v1";

const FP0164_PLAN_PATH =
  "plans/FP-0164-read-only-chatgpt-app-mcp-local-apps-sdk-resource-registration.md";
const FP0165_PLAN_PATH =
  "plans/FP-0165-read-only-chatgpt-app-mcp-local-render-tool-descriptor-readiness.md";
const READINESS_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-readiness.ts";
const READINESS_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-readiness.spec.ts";
const READINESS_PROOF_PATH =
  "tools/read-only-mcp-local-render-tool-descriptor-readiness-proof.mjs";
const REGISTRATION_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.ts";
const REGISTRATION_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.spec.ts";
const REGISTRATION_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-registration-proof.mjs";
const SKELETON_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts";
const SKELETON_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts";
const SKELETON_RUNTIME_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime.ts";
const SKELETON_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs";
const RESOURCE_READINESS_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.ts";
const RESOURCE_READINESS_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.ts";
const RESOURCE_READINESS_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-readiness-proof.mjs";
const VISUAL_QA_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-visual-qa-accessibility-proof.mjs";
const UI_BRIDGE_IMPLEMENTATION_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-implementation-proof.mjs";
const UI_BRIDGE_READINESS_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs";
const PREVIEW_ROUTE_PATH =
  "apps/web/app/read-only-app-mcp-preview/page.tsx";
const PREVIEW_BRIDGE_PATH =
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge.tsx";
const PREVIEW_SNAPSHOT_PATH =
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge-snapshot.ts";
const DESCRIPTOR_MODULE_PATH = "packages/domain/src/read-only-app-mcp-descriptor.ts";
const DEFAULT_APP_PATH = "apps/control-plane/src/app.ts";
const DEFAULT_CONTAINER_PATH = "apps/control-plane/src/container.ts";
const MCP_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const PROTECTED_RESOURCE_METADATA_ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";

const allowedChangedPaths = new Set([
  "README.md",
  "CODEX_README.md",
  "START_HERE.md",
  "docs/ACTIVE_DOCS.md",
  "docs/PROJECT_STATE.md",
  "docs/V2_BOUNDARY.md",
  "plans/ROADMAP.md",
  "plugins.md",
  FP0164_PLAN_PATH,
  FP0165_PLAN_PATH,
  READINESS_MODULE_PATH,
  READINESS_SPEC_PATH,
  READINESS_PROOF_PATH,
  REGISTRATION_MODULE_PATH,
  REGISTRATION_SPEC_PATH,
  REGISTRATION_PROOF_PATH,
  SKELETON_MODULE_PATH,
  SKELETON_SPEC_PATH,
  SKELETON_RUNTIME_PATH,
  SKELETON_PROOF_PATH,
  RESOURCE_READINESS_MODULE_PATH,
  RESOURCE_READINESS_SPEC_PATH,
  RESOURCE_READINESS_PROOF_PATH,
  VISUAL_QA_PROOF_PATH,
  UI_BRIDGE_IMPLEMENTATION_PROOF_PATH,
  UI_BRIDGE_READINESS_PROOF_PATH,
  "tools/read-only-mcp-invalid-token-app-wiring-proof.mjs",
  "tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs",
  "tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs",
  "tools/read-only-mcp-protected-resource-metadata-local-route-proof.mjs",
  "tools/read-only-mcp-route-adapter-proof.mjs",
  "tools/read-only-mcp-protocol-envelope-proof.mjs",
  "tools/read-only-endpoint-route-ownership-proof.mjs",
  "tools/read-only-endpoint-architecture-proof.mjs",
  "tools/read-only-mcp-evidence-tool-dispatch-proof.mjs",
  "tools/read-only-mcp-default-local-evidence-dispatch-proof.mjs",
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts",
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts",
  "packages/domain/src/read-only-app-mcp-token-validation-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input-inventory-rules.ts",
  "packages/domain/src/index.ts",
]);

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const fp0164PlanText = safeRead(FP0164_PLAN_PATH);
const fp0165PlanText = safeRead(FP0165_PLAN_PATH);
const readinessModuleSource = safeRead(READINESS_MODULE_PATH);
const descriptorSource = safeRead(DESCRIPTOR_MODULE_PATH);
const previewRuntimeSource = [
  safeRead(PREVIEW_ROUTE_PATH),
  safeRead(PREVIEW_BRIDGE_PATH),
  safeRead(PREVIEW_SNAPSHOT_PATH),
].join("\n");
const defaultRuntimeSource = [
  safeRead(DEFAULT_APP_PATH),
  safeRead(DEFAULT_CONTAINER_PATH),
  safeRead(MCP_ROUTE_PATH),
  safeRead(PROTECTED_RESOURCE_METADATA_ROUTE_PATH),
].join("\n");
const registrationProof = runJsonTool(REGISTRATION_PROOF_PATH);
const pathScope = verifyPathScope();
const planScope = verifyPlanScope();
const sourceScope = verifySourceScope();
const proofBridgeScope = verifyProofBridgeScope();
const priorBoundaryOverrides = buildPriorBoundaryOverrides(registrationProof);
const domainProofInput = {
  changedPathScopeAccepted: pathScope.changedPathScopeAccepted,
  fp0164CloseoutFresh: planScope.fp0164CloseoutFreshnessVerified,
  fp0164SuccessorBridgeCompatible:
    proofBridgeScope.fp0164SuccessorBridgeCompatibilityVerified,
  fp0165PlanText,
  noNewRouteOrApiRouteAdded: pathScope.newRouteOrApiRouteAdded,
  priorBoundaryOverrides,
  repoPaths,
};
const readinessProof =
  buildReadOnlyMcpLocalRenderToolDescriptorReadinessProof(domainProofInput);

const output = {
  schemaVersion: SCHEMA_VERSION,
  fp0165AbsentOrLocalRenderToolDescriptorReadinessPlanVerified:
    readinessProof.fp0165AbsentOrLocalRenderToolDescriptorReadinessPlanVerified,
  fp0166Absent: readinessProof.fp0166Absent,
  localRenderToolDescriptorReadinessBoundaryVerified:
    verifyReadOnlyMcpLocalRenderToolDescriptorReadinessBoundary(
      domainProofInput,
    ) &&
    pathScope.changedPathScopeAccepted &&
    sourceScope.localRenderToolDescriptorReadinessBoundaryVerified,
  renderToolImplementationStillBlocked:
    readinessProof.renderToolImplementationStillBlocked &&
    sourceScope.renderToolImplementationStillBlocked,
  toolDescriptorImplementationStillBlocked:
    readinessProof.toolDescriptorImplementationStillBlocked &&
    sourceScope.toolDescriptorImplementationStillBlocked,
  outputTemplateImplementationStillBlocked:
    readinessProof.outputTemplateImplementationStillBlocked &&
    sourceScope.outputTemplateImplementationStillBlocked,
  dataToolTemplateOwnershipStillBlocked:
    readinessProof.dataToolTemplateOwnershipStillBlocked &&
    sourceScope.dataToolTemplateOwnershipStillBlocked,
  componentBundleImplementationStillBlocked:
    readinessProof.componentBundleImplementationStillBlocked &&
    sourceScope.componentBundleImplementationStillBlocked,
  defaultResourceRegistrationStillBlocked:
    readinessProof.defaultResourceRegistrationStillBlocked &&
    sourceScope.defaultResourceRegistrationStillBlocked,
  noNewRouteOrApiRouteFromFp0165:
    readinessProof.noNewRouteOrApiRouteFromFp0165 &&
    pathScope.noNewRouteOrApiRouteFromFp0165,
  futureRenderToolInputBoundaryRecorded:
    readinessProof.futureRenderToolInputBoundaryRecorded,
  futureRenderToolOutputBoundaryRecorded:
    readinessProof.futureRenderToolOutputBoundaryRecorded,
  futureRenderToolDescriptorMetadataRecorded:
    readinessProof.futureRenderToolDescriptorMetadataRecorded,
  futureRenderToolImplementationSequenceRecorded:
    readinessProof.futureRenderToolImplementationSequenceRecorded,
  futureRenderToolTwoLaneSeparationRecorded:
    readinessProof.futureRenderToolTwoLaneSeparationRecorded,
  futureDataToolsRemainReusable: readinessProof.futureDataToolsRemainReusable,
  futureRenderToolForbidsCredentialParserSourceLeakage:
    readinessProof.futureRenderToolForbidsCredentialParserSourceLeakage,
  futureRenderToolForbidsRealFinanceData:
    readinessProof.futureRenderToolForbidsRealFinanceData,
  futureRenderToolForbidsPublicAssetsScreenshotsSubmission:
    readinessProof.futureRenderToolForbidsPublicAssetsScreenshotsSubmission,
  noLiveMcpFetchFromPreviewUi:
    readinessProof.noLiveMcpFetchFromPreviewUi &&
    sourceScope.noLiveMcpFetchFromPreviewUi,
  noWindowOpenAiUsageFromFp0165:
    readinessProof.noWindowOpenAiUsageFromFp0165 &&
    sourceScope.noWindowOpenAiUsageFromFp0165,
  noHarnessExecutionAtRequestTime:
    readinessProof.noHarnessExecutionAtRequestTime &&
    sourceScope.noHarnessExecutionAtRequestTime,
  defaultAuthAdapterWiringStillBlocked:
    readinessProof.defaultAuthAdapterWiringStillBlocked &&
    sourceScope.defaultAuthAdapterWiringStillBlocked,
  defaultEvidenceDispatchWiringStillBlocked:
    readinessProof.defaultEvidenceDispatchWiringStillBlocked &&
    sourceScope.defaultEvidenceDispatchWiringStillBlocked,
  defaultCreateContainerBehaviorStillUnchanged:
    readinessProof.defaultCreateContainerBehaviorStillUnchanged &&
    sourceScope.defaultCreateContainerBehaviorStillUnchanged,
  defaultCreateInMemoryContainerBehaviorStillUnchanged:
    readinessProof.defaultCreateInMemoryContainerBehaviorStillUnchanged &&
    sourceScope.defaultCreateInMemoryContainerBehaviorStillUnchanged,
  defaultBuildAppBehaviorStillUnchanged:
    readinessProof.defaultBuildAppBehaviorStillUnchanged &&
    sourceScope.defaultBuildAppBehaviorStillUnchanged,
  mcpRouteBehaviorStillUnchanged:
    readinessProof.mcpRouteBehaviorStillUnchanged &&
    sourceScope.mcpRouteBehaviorStillUnchanged,
  protectedResourceMetadataRouteStillUnchanged:
    readinessProof.protectedResourceMetadataRouteStillUnchanged &&
    sourceScope.protectedResourceMetadataRouteStillUnchanged,
  noProductionTokenValidationFromFp0165:
    readinessProof.noProductionTokenValidationFromFp0165 &&
    sourceScope.noProductionTokenValidationFromFp0165,
  noOauthSessionAuthMiddlewareFromFp0165:
    readinessProof.noOauthSessionAuthMiddlewareFromFp0165 &&
    sourceScope.noOauthSessionAuthMiddlewareFromFp0165,
  noProviderCallsFromFp0165:
    readinessProof.noProviderCallsFromFp0165 &&
    sourceScope.noProviderCallsFromFp0165,
  noOpenAiApiCallsFromFp0165:
    readinessProof.noOpenAiApiCallsFromFp0165 &&
    sourceScope.noOpenAiApiCallsFromFp0165,
  noModelCallsFromFp0165:
    readinessProof.noModelCallsFromFp0165 &&
    sourceScope.noModelCallsFromFp0165,
  noSourceMutationFromFp0165:
    readinessProof.noSourceMutationFromFp0165 &&
    sourceScope.noSourceMutationFromFp0165,
  noFinanceWriteFromFp0165:
    readinessProof.noFinanceWriteFromFp0165 &&
    sourceScope.noFinanceWriteFromFp0165,
  noExternalCommunicationsFromFp0165:
    readinessProof.noExternalCommunicationsFromFp0165 &&
    sourceScope.noExternalCommunicationsFromFp0165,
  noPublicAssetsFromFp0165:
    readinessProof.noPublicAssetsFromFp0165 && pathScope.noPublicAssetsFromFp0165,
  noGeneratedPublicProseFromFp0165:
    readinessProof.noGeneratedPublicProseFromFp0165 &&
    pathScope.noGeneratedPublicProseFromFp0165,
  noAppSubmissionFromFp0165:
    readinessProof.noAppSubmissionFromFp0165 &&
    pathScope.noAppSubmissionFromFp0165,
  fp0164CloseoutFreshnessVerified:
    readinessProof.fp0164CloseoutFreshnessVerified &&
    planScope.fp0164CloseoutFreshnessVerified,
  fp0164SuccessorBridgeCompatibilityVerified:
    readinessProof.fp0164SuccessorBridgeCompatibilityVerified &&
    proofBridgeScope.fp0164SuccessorBridgeCompatibilityVerified,
  sharedProofOnlyLeakageSanitizerStillVerified:
    readinessProof.sharedProofOnlyLeakageSanitizerStillVerified &&
    sourceScope.changedTextNoLeakage &&
    sourceScope.syntheticLeakageFixturesRejected,
  ...priorBoundaryOverrides,
  proofDetails: {
    changedPathScope,
    disallowedChangedPaths: pathScope.disallowedChangedPaths,
    planScope,
    proofBridgeScope,
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
      `FP-0165 local render tool descriptor readiness proof failed: ${key}`,
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
    newRouteOrApiRouteAdded,
    noAppSubmissionFromFp0165: !changedPaths.some((path) =>
      appSubmissionPattern.test(path),
    ),
    noGeneratedPublicProseFromFp0165: !changedPaths.some((path) =>
      /(?:listing-copy|public-listing|store-listing|app-submission)/iu.test(
        path,
      ),
    ),
    noNewRouteOrApiRouteFromFp0165:
      disallowedChangedPaths.length === 0 && !newRouteOrApiRouteAdded,
    noPublicAssetsFromFp0165: !changedPaths.some((path) =>
      publicAssetPattern.test(path),
    ),
  };
}

function verifyPlanScope() {
  const fp0165Hits = repoPaths.filter((path) => /(^|\/)FP-0165/u.test(path));
  const fp0166Hits = repoPaths.filter((path) => /(^|\/)FP-0166/u.test(path));

  return {
    exactlyOneFp0165Plan:
      fp0165Hits.length === 1 && fp0165Hits[0] === FP0165_PLAN_PATH,
    fp0164CloseoutFreshnessVerified:
      verifyFp0164CloseoutFreshnessForFp0165(fp0164PlanText),
    fp0165AbsentOrLocalRenderToolDescriptorReadinessPlanVerified:
      fp0165Hits.length === 1 &&
      fp0165Hits[0] === FP0165_PLAN_PATH &&
      verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan(
        repoPaths,
      ),
    fp0166Absent: fp0166Hits.length === 0 && verifyFp0166Absent(repoPaths),
  };
}

function verifySourceScope() {
  const changedText = readChangedLeakageText(changedPaths);
  const changedTextNoLeakage = scanProofOnlyNoTokenLeakageText(changedText).accepted;
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
  const readinessForbiddenImports = [
    /from\s+["']react["']/iu,
    /from\s+["']next/iu,
    /node:(?:fs|child_process|http|https|net|tls|crypto|os|path|url)/iu,
    /from\s+["'][^"']*(?:app\/|apps\/|control-plane|packages\/db|provider|openai)[^"']*["']/iu,
  ];
  const readinessForbiddenApis = [
    /\b(?:readFile|readdir|writeFile|XMLHttpRequest|WebSocket|Date\.now|Math\.random|process\.env|logger|pino)\b|fetch\s*\(/iu,
    /\b(?:registerResource|registerTool|buildApp|createContainer|createInMemoryContainer)\s*\(/u,
    /\b(?:decodeJwt|jwtDecode|fetchJwks|introspectToken|oauthCallback|sessionStore|setCookie|validateToken|verifyToken)\b/u,
    /from\s+["']openai["']|new\s+OpenAI|responses\.create|chat\.completions/iu,
  ];
  const dataToolDescriptorSource = descriptorSource;

  return {
    changedTextNoLeakage,
    componentBundleImplementationStillBlocked: !changedPaths.some((path) =>
      /(?:vite|webpack|rollup|next)\.config|component-bundle|widget\.html|\.css$/iu.test(
        path,
      ),
    ),
    dataToolTemplateOwnershipStillBlocked:
      !/openai\/outputTemplate|_meta\s*:\s*\{\s*ui\s*:\s*\{\s*resourceUri|resourceUri\s*:/u.test(
        dataToolDescriptorSource,
      ) &&
      dataToolDescriptorSource.includes("search_evidence") &&
      dataToolDescriptorSource.includes("fetch_evidence_card"),
    defaultAuthAdapterWiringStillBlocked:
      !changedPaths.includes(DEFAULT_CONTAINER_PATH),
    defaultBuildAppBehaviorStillUnchanged:
      !changedPaths.includes(DEFAULT_APP_PATH),
    defaultCreateContainerBehaviorStillUnchanged:
      !changedPaths.includes(DEFAULT_CONTAINER_PATH),
    defaultCreateInMemoryContainerBehaviorStillUnchanged:
      !changedPaths.includes(DEFAULT_CONTAINER_PATH),
    defaultEvidenceDispatchWiringStillBlocked: !changedPaths.some((path) =>
      path.startsWith("apps/control-plane/"),
    ),
    defaultResourceRegistrationStillBlocked:
      !/registerResource\s*\(/u.test(defaultRuntimeSource),
    localRenderToolDescriptorReadinessBoundaryVerified:
      readinessForbiddenImports.every(
        (pattern) => !pattern.test(readinessModuleSource),
      ) &&
      readinessForbiddenApis.every(
        (pattern) => !pattern.test(readinessModuleSource),
      ),
    mcpRouteBehaviorStillUnchanged: !changedPaths.includes(MCP_ROUTE_PATH),
    noExternalCommunicationsFromFp0165:
      !/sendEmail\s*\(|sendReport\s*\(|webhook\s*\(|externalMessage\s*\(/u.test(
        readinessModuleSource,
      ),
    noFinanceWriteFromFp0165:
      !/writeFinanceTwin\s*\(|updateLedger\s*\(|financeWrite\s*\(|postLedger\s*\(/u.test(
        readinessModuleSource,
      ),
    noHarnessExecutionAtRequestTime:
      !/child_process|spawnSync|execFileSync|read-only-mcp-[^"']*proof|read-only-mcp-[^"']*harness/u.test(
        previewRuntimeSource + defaultRuntimeSource,
      ),
    noLiveMcpFetchFromPreviewUi:
      !/\bfetch\s*\(/u.test(previewRuntimeSource) &&
      !/["']\/mcp["']/u.test(previewRuntimeSource),
    noModelCallsFromFp0165:
      !/responses\s*\.\s*create|chat\s*\.\s*completions|modelClient|callModel\s*\(/iu.test(
        readinessModuleSource,
      ),
    noOauthSessionAuthMiddlewareFromFp0165:
      !/authMiddleware\s*[:=(]|decodeJwt\s*\(|jwtDecode\s*\(|fetchJwks\s*\(|introspectToken\s*\(|oauthCallback\s*\(|sessionStore\s*[:=(]|setCookie\s*\(/u.test(
        readinessModuleSource,
      ),
    noOpenAiApiCallsFromFp0165:
      !new RegExp(
        [
          "from\\s+[\"']openai[\"']",
          "new\\s+OpenAI",
          ["OPENAI", "API", "KEY"].join("_"),
        ].join("|"),
        "iu",
      ).test(readinessModuleSource),
    noProductionTokenValidationFromFp0165:
      !/validateToken\s*\(|verifyToken\s*\(/u.test(readinessModuleSource),
    noProviderCallsFromFp0165:
      !/providerClient\s*[:=(]|providerCall\s*\(|callProvider\s*\(|selectProvider\s*\(/u.test(
        readinessModuleSource,
      ),
    noSourceMutationFromFp0165:
      !/uploadSource\s*\(|mutateSource\s*\(|rewriteSource\s*\(|deleteSource\s*\(/u.test(
        readinessModuleSource,
      ),
    noWindowOpenAiUsageFromFp0165:
      !/window\.openai|callTool|uploadFile|selectFiles|openExternal|sendFollowUpMessage|requestModal|requestDisplayMode|setWidgetState/u.test(
        previewRuntimeSource,
      ),
    outputTemplateImplementationStillBlocked:
      !/_meta\s*:\s*\{\s*ui\s*:\s*\{\s*resourceUri|["']openai\/outputTemplate["']\s*:|["']?outputTemplate["']?\s*:/u.test(
        readinessModuleSource + defaultRuntimeSource + dataToolDescriptorSource,
      ),
    protectedResourceMetadataRouteStillUnchanged:
      !changedPaths.includes(PROTECTED_RESOURCE_METADATA_ROUTE_PATH),
    renderToolImplementationStillBlocked:
      !/\brenderTool\s*[:=(]|structuredContentToResource|registerTool\s*\(/u.test(
        readinessModuleSource,
      ),
    serverResourceRegistrationStillBlocked:
      !/registerResource\s*\(/u.test(defaultRuntimeSource) &&
      !/resources\/(?:list|read)|resource template/iu.test(defaultRuntimeSource),
    syntheticLeakageFixturesRejected:
      scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted === false &&
      scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted === false,
    toolDescriptorImplementationStillBlocked:
      !/registerTool\s*\(|tools\s*:\s*\[|inputSchema\s*:|annotations\s*:\s*\{\s*readOnlyHint/u.test(
        readinessModuleSource,
      ),
  };
}

function verifyProofBridgeScope() {
  return {
    fp0164SuccessorBridgeCompatibilityVerified:
      registrationProof.fp0165AbsentOrLocalRenderToolDescriptorReadinessPlanVerified ===
        true &&
      registrationProof.fp0166Absent === true &&
      registrationProof.renderToolImplementationStillBlocked === true &&
      registrationProof.toolDescriptorImplementationStillBlocked === true &&
      registrationProof.outputTemplateImplementationStillBlocked === true &&
      registrationProof.defaultResourceRegistrationStillBlocked === true &&
      registrationProof.serverResourceRegistrationStillBlocked === true &&
      registrationProof.componentBundleImplementationStillBlocked === true &&
      registrationProof.noNewRouteOrApiRouteFromFp0164 === true &&
      registrationProof.noLiveMcpFetchFromPreviewUi === true &&
      registrationProof.noWindowOpenAiUsageFromFp0164 === true,
  };
}

function buildPriorBoundaryOverrides(proof) {
  return {
    fp0164LocalAppsSdkResourceRegistrationBoundaryStillVerified:
      proof.localAppsSdkResourceRegistrationBoundaryVerified === true,
    fp0163SkeletonBoundaryStillVerified:
      proof.fp0163SkeletonBoundaryStillVerified === true,
    fp0162LocalAppsSdkResourceReadinessBoundaryStillVerified:
      proof.fp0162LocalAppsSdkResourceReadinessBoundaryStillVerified === true,
    fp0161VisualQaAccessibilityBoundaryStillVerified:
      proof.fp0161VisualQaAccessibilityBoundaryStillVerified === true,
    fp0160LocalPreviewDemoUiBridgeBoundaryStillVerified:
      proof.fp0160LocalPreviewDemoUiBridgeBoundaryStillVerified === true,
    fp0159ReadinessBoundaryStillVerified:
      proof.fp0159ReadinessBoundaryStillVerified === true,
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
      proof.fp0144ProductionTokenValidationSequencingBoundaryStillVerified ===
      true,
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
  const untracked = gitLines([
    "ls-files",
    "--others",
    "--exclude-standard",
  ]);
  const dirtyQaTargetFiles = [...new Set([...unstaged, ...staged, ...untracked])];

  return {
    combinedChangedPaths: [
      ...new Set([...committedBranchDiffPaths, ...dirtyQaTargetFiles]),
    ].sort(),
    committedBranchDiffPaths,
    dirtyQaTargetFiles,
  };
}

function repoFilePaths(dir = ".", prefix = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (
      [".git", ".next", ".turbo", "coverage", "dist", "node_modules"].includes(
        entry.name,
      )
    ) {
      return [];
    }

    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const fullPath = `${dir}/${entry.name}`;

    if (entry.isDirectory()) return repoFilePaths(fullPath, relativePath);

    return [relativePath];
  });
}

function readChangedLeakageText(paths) {
  return paths.map((path) => safeRead(path)).join("\n");
}

function safeRead(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function gitLines(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(
      `git ${args.join(" ")} failed: ${result.stderr || result.stdout}`,
    );
  }

  return result.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
