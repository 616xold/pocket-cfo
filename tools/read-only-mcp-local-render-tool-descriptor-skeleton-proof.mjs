/* global console */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_NAME,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI,
  buildReadOnlyMcpLocalRenderToolDescriptorSkeleton,
  buildReadOnlyMcpLocalRenderToolDescriptorSkeletonProof,
  scanProofOnlyNoTokenLeakageText,
  verifyFp0165CloseoutFreshnessForFp0166,
  verifyReadOnlyMcpLocalRenderToolDescriptorSkeletonBoundary,
} from "../packages/domain/src/index.ts";

const SCHEMA_VERSION =
  "v2ch.read-only-chatgpt-app-mcp-local-render-tool-descriptor-skeleton-proof.v1";

const FP0165_PLAN_PATH =
  "plans/FP-0165-read-only-chatgpt-app-mcp-local-render-tool-descriptor-readiness.md";
const FP0166_PLAN_PATH =
  "plans/FP-0166-read-only-chatgpt-app-mcp-local-render-tool-descriptor-skeleton.md";
const FP0167_PREFIX = "plans/FP-0167";
const RUNTIME_PATH =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton-runtime.ts";
const MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton.ts";
const SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton.spec.ts";
const PROOF_PATH =
  "tools/read-only-mcp-local-render-tool-descriptor-skeleton-proof.mjs";
const READINESS_PROOF_PATH =
  "tools/read-only-mcp-local-render-tool-descriptor-readiness-proof.mjs";
const DESCRIPTOR_PATH = "packages/domain/src/read-only-app-mcp-descriptor.ts";
const PREVIEW_RUNTIME_PATHS = [
  "apps/web/app/read-only-app-mcp-preview/page.tsx",
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge.tsx",
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge-snapshot.ts",
];
const DEFAULT_RUNTIME_PATHS = [
  "apps/control-plane/src/app.ts",
  "apps/control-plane/src/container.ts",
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts",
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts",
];

const allowedChangedPaths = new Set([
  "README.md",
  "CODEX_README.md",
  "START_HERE.md",
  "docs/ACTIVE_DOCS.md",
  "docs/PROJECT_STATE.md",
  "docs/V2_BOUNDARY.md",
  "plans/ROADMAP.md",
  "plugins.md",
  FP0165_PLAN_PATH,
  FP0166_PLAN_PATH,
  RUNTIME_PATH,
  MODULE_PATH,
  SPEC_PATH,
  PROOF_PATH,
  "packages/domain/src/benchmark-community.spec.ts",
  "packages/domain/src/index.ts",
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts",
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts",
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-readiness.ts",
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-readiness.spec.ts",
  READINESS_PROOF_PATH,
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.spec.ts",
  "tools/read-only-mcp-local-apps-sdk-resource-registration-proof.mjs",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts",
  "tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.ts",
  "tools/read-only-mcp-local-apps-sdk-resource-readiness-proof.mjs",
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs",
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-implementation-proof.mjs",
  "tools/read-only-mcp-evidence-app-local-preview-demo-visual-qa-accessibility-proof.mjs",
  "tools/benchmark-community-pack-proof.mjs",
  "tools/read-only-chatgpt-app-mcp-proof.mjs",
  "tools/read-only-endpoint-architecture-proof.mjs",
  "tools/read-only-endpoint-route-ownership-proof.mjs",
  "tools/read-only-mcp-evidence-tool-dispatch-proof.mjs",
  "tools/read-only-mcp-invalid-token-app-wiring-proof.mjs",
  "tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs",
  "tools/read-only-mcp-protocol-envelope-proof.mjs",
  "tools/read-only-mcp-route-adapter-proof.mjs",
  "tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs",
  "tools/read-only-public-app-security-boundary-proof.mjs",
]);

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const fp0165PlanText = safeRead(FP0165_PLAN_PATH);
const fp0166PlanText = safeRead(FP0166_PLAN_PATH);
const descriptorRuntimeSource = safeRead(RUNTIME_PATH);
const descriptorSource = safeRead(DESCRIPTOR_PATH);
const previewRuntimeSource = PREVIEW_RUNTIME_PATHS.map(safeRead).join("\n");
const defaultRuntimeSource = DEFAULT_RUNTIME_PATHS.map(safeRead).join("\n");
const readinessProof = runJsonTool(READINESS_PROOF_PATH);
const descriptor = buildReadOnlyMcpLocalRenderToolDescriptorSkeleton();
const pathScope = verifyPathScope();
const sourceScope = verifySourceScope();
const proofBridgeScope = verifyProofBridgeScope();
const priorBoundaryOverrides = buildPriorBoundaryOverrides(readinessProof);
const domainProofInput = {
  changedPathScopeAccepted: pathScope.changedPathScopeAccepted,
  dataToolTemplateFree: sourceScope.dataToolTemplateFree,
  defaultRuntimeUnchanged: sourceScope.defaultRuntimeUnchanged,
  descriptorRuntimeSource,
  fp0165CloseoutFresh: verifyFp0165CloseoutFreshnessForFp0166(fp0165PlanText),
  fp0165PlanText,
  fp0166PlanText,
  noNewRouteOrApiRouteAdded: pathScope.newRouteOrApiRouteAdded,
  noPreviewRuntimeBridgeUsage: sourceScope.noPreviewRuntimeBridgeUsage,
  priorBoundaryOverrides,
  repoPaths,
};
const domainProof =
  buildReadOnlyMcpLocalRenderToolDescriptorSkeletonProof(domainProofInput);

const output = {
  schemaVersion: SCHEMA_VERSION,
  fp0166AbsentOrLocalRenderToolDescriptorSkeletonPlanVerified:
    domainProof.fp0166AbsentOrLocalRenderToolDescriptorSkeletonPlanVerified,
  fp0167Absent: domainProof.fp0167Absent,
  localRenderToolDescriptorSkeletonBoundaryVerified:
    domainProof.localRenderToolDescriptorSkeletonBoundaryVerified &&
    pathScope.changedPathScopeAccepted &&
    sourceScope.dataToolTemplateFree,
  renderToolDescriptorSkeletonImplemented:
    domainProof.renderToolDescriptorSkeletonImplemented,
  renderToolRuntimeStillBlocked:
    domainProof.renderToolRuntimeStillBlocked &&
    sourceScope.renderToolRuntimeStillBlocked,
  registerToolWiringStillBlocked:
    domainProof.registerToolWiringStillBlocked &&
    sourceScope.registerToolWiringStillBlocked,
  serverToolRegistrationStillBlocked:
    domainProof.serverToolRegistrationStillBlocked &&
    sourceScope.serverToolRegistrationStillBlocked,
  dataToolTemplateOwnershipStillBlocked:
    domainProof.dataToolTemplateOwnershipStillBlocked,
  dataToolOutputTemplatesStillBlocked:
    domainProof.dataToolOutputTemplatesStillBlocked,
  defaultResourceRegistrationStillBlocked:
    domainProof.defaultResourceRegistrationStillBlocked &&
    sourceScope.defaultResourceRegistrationStillBlocked,
  componentBundleImplementationStillBlocked:
    domainProof.componentBundleImplementationStillBlocked &&
    sourceScope.componentBundleImplementationStillBlocked,
  noNewRouteOrApiRouteFromFp0166:
    domainProof.noNewRouteOrApiRouteFromFp0166 &&
    pathScope.noNewRouteOrApiRouteFromFp0166,
  deterministicLocalRenderToolNameVerified:
    descriptor.name === READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_NAME,
  deterministicLocalDescriptorTitleVerified:
    domainProof.deterministicLocalDescriptorTitleVerified,
  deterministicLocalDescriptorDescriptionVerified:
    domainProof.deterministicLocalDescriptorDescriptionVerified,
  descriptorStructuredContentSchemaCanonicalized:
    domainProof.descriptorStructuredContentSchemaCanonicalized,
  descriptorInputForbidsCredentialParserSourceLeakage:
    domainProof.descriptorInputForbidsCredentialParserSourceLeakage,
  descriptorOutputForbidsCredentialParserSourceLeakage:
    domainProof.descriptorOutputForbidsCredentialParserSourceLeakage,
  descriptorForbidsRealFinanceData: domainProof.descriptorForbidsRealFinanceData,
  descriptorForbidsPublicDemoData:
    domainProof.descriptorForbidsPublicDemoData,
  descriptorForbidsPublicAssetsScreenshotsSubmission:
    domainProof.descriptorForbidsPublicAssetsScreenshotsSubmission,
  descriptorReadOnlyHintVerified: domainProof.descriptorReadOnlyHintVerified,
  descriptorResourceUriVerified:
    descriptor._meta.ui.resourceUri ===
    READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI,
  descriptorOpenAiOutputTemplateAliasVerified:
    domainProof.descriptorOpenAiOutputTemplateAliasVerified,
  descriptorTemplateUriNotAttachedToDataTools:
    sourceScope.dataToolTemplateFree,
  descriptorStatusTextLocalNonMarketing:
    domainProof.descriptorStatusTextLocalNonMarketing,
  runtimeSafeDescriptorSkeletonBuilderIsolated:
    domainProof.runtimeSafeDescriptorSkeletonBuilderIsolated,
  noLiveMcpFetchFromPreviewUi: domainProof.noLiveMcpFetchFromPreviewUi,
  noWindowOpenAiUsageFromFp0166: domainProof.noWindowOpenAiUsageFromFp0166,
  noHarnessExecutionAtRequestTime: domainProof.noHarnessExecutionAtRequestTime,
  defaultAuthAdapterWiringStillBlocked:
    domainProof.defaultAuthAdapterWiringStillBlocked,
  defaultEvidenceDispatchWiringStillBlocked:
    domainProof.defaultEvidenceDispatchWiringStillBlocked,
  defaultCreateContainerBehaviorStillUnchanged:
    domainProof.defaultCreateContainerBehaviorStillUnchanged,
  defaultCreateInMemoryContainerBehaviorStillUnchanged:
    domainProof.defaultCreateInMemoryContainerBehaviorStillUnchanged,
  defaultBuildAppBehaviorStillUnchanged:
    domainProof.defaultBuildAppBehaviorStillUnchanged,
  mcpRouteBehaviorStillUnchanged: domainProof.mcpRouteBehaviorStillUnchanged,
  protectedResourceMetadataRouteStillUnchanged:
    domainProof.protectedResourceMetadataRouteStillUnchanged,
  noProductionTokenValidationFromFp0166:
    domainProof.noProductionTokenValidationFromFp0166,
  noOauthSessionAuthMiddlewareFromFp0166:
    domainProof.noOauthSessionAuthMiddlewareFromFp0166,
  noProviderCallsFromFp0166: domainProof.noProviderCallsFromFp0166,
  noOpenAiApiCallsFromFp0166: domainProof.noOpenAiApiCallsFromFp0166,
  noModelCallsFromFp0166: domainProof.noModelCallsFromFp0166,
  noSourceMutationFromFp0166: domainProof.noSourceMutationFromFp0166,
  noFinanceWriteFromFp0166: domainProof.noFinanceWriteFromFp0166,
  noExternalCommunicationsFromFp0166:
    domainProof.noExternalCommunicationsFromFp0166,
  noPublicAssetsFromFp0166: domainProof.noPublicAssetsFromFp0166,
  noGeneratedPublicProseFromFp0166:
    domainProof.noGeneratedPublicProseFromFp0166,
  noAppSubmissionFromFp0166: domainProof.noAppSubmissionFromFp0166,
  fp0165CloseoutFreshnessVerified:
    domainProof.fp0165CloseoutFreshnessVerified,
  fp0165SuccessorBridgeCompatibilityVerified:
    proofBridgeScope.fp0165SuccessorBridgeCompatibilityVerified,
  sharedProofOnlyLeakageSanitizerStillVerified:
    scanProofOnlyNoTokenLeakageText([fp0165PlanText, fp0166PlanText].join("\n"))
      .accepted,
  fp0165LocalRenderToolDescriptorReadinessBoundaryStillVerified:
    readinessProof.localRenderToolDescriptorReadinessBoundaryVerified === true,
  fp0164LocalAppsSdkResourceRegistrationBoundaryStillVerified:
    readinessProof.fp0164LocalAppsSdkResourceRegistrationBoundaryStillVerified ===
    true,
  ...priorBoundaryOverrides,
  proofDetails: {
    changedPaths,
    descriptorName: descriptor.name,
    resourceUri: descriptor._meta.ui.resourceUri,
  },
};

assertProof(output);
console.log(JSON.stringify(output, null, 2));

function verifyPathScope() {
  const outOfScope = changedPaths.filter((path) => !allowedChangedPaths.has(path));
  const fp0166Plans = repoPaths.filter((path) => /(^|\/)FP-0166/u.test(path));
  const newRouteOrApiRouteAdded = changedPaths.some(
    (path) =>
      /^(apps\/web\/app\/.*\/(?:page|route)\.tsx?|apps\/web\/app\/api\/|apps\/control-plane\/src\/.*routes?\.ts)/u.test(
        path,
      ) && !allowedChangedPaths.has(path),
  );

  return {
    changedPathScopeAccepted: outOfScope.length === 0,
    fp0166PlanVerified:
      fp0166Plans.length === 1 && fp0166Plans[0] === FP0166_PLAN_PATH,
    noFp0167Plan: !repoPaths.some((path) => path.startsWith(FP0167_PREFIX)),
    noNewRouteOrApiRouteFromFp0166: !newRouteOrApiRouteAdded,
    newRouteOrApiRouteAdded,
    outOfScope,
  };
}

function verifySourceScope() {
  const changedSource = changedPaths.map(safeRead).join("\n");
  const templateTerms = /openai\/outputTemplate|_meta\s*:\s*\{\s*ui\s*:\s*\{\s*resourceUri|resourceUri\s*:/u;
  const allowedTemplatePaths = new Set([
    FP0166_PLAN_PATH,
    RUNTIME_PATH,
    MODULE_PATH,
    SPEC_PATH,
    PROOF_PATH,
  ]);
  const templateUseOutsideSkeleton = changedPaths
    .filter((path) => !allowedTemplatePaths.has(path))
    .some((path) => templateTerms.test(readChangedAddedText([path])));

  return {
    componentBundleImplementationStillBlocked:
      !/(?:webpack\.config|vite\.config|rollup\.config|next\.config|public\/.*\.(?:png|jpg|svg|html|js))/iu.test(
        changedSource,
      ),
    dataToolTemplateFree: !templateTerms.test(descriptorSource),
    defaultResourceRegistrationStillBlocked:
      !/registerResource\s*\(|resources\/(?:list|read)|resource template/iu.test(
        defaultRuntimeSource,
      ),
    defaultRuntimeUnchanged:
      !/registerTool\s*\(|registerResource\s*\(|openai\/outputTemplate|oauthCallback|sessionStore|setCookie|providerCall|new\s+OpenAI/u.test(
        defaultRuntimeSource,
      ),
    localRenderToolDescriptorSkeletonBoundaryVerified:
      !templateUseOutsideSkeleton &&
      descriptor.name === READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_NAME,
    noPreviewRuntimeBridgeUsage:
      !/\bfetch\s*\(|["']\/mcp["']|window\.openai|callTool|uploadFile|selectFiles|openExternal|requestModal|requestDisplayMode|setWidgetState/u.test(
        previewRuntimeSource,
      ),
    registerToolWiringStillBlocked: !/registerTool\s*\(/u.test(changedSource),
    renderToolRuntimeStillBlocked:
      !/handler\s*[:=]|execute\s*[:=]|structuredContentToResource/u.test(
        descriptorRuntimeSource,
      ),
    serverToolRegistrationStillBlocked:
      !/registerTool\s*\(|tools\/(?:list|call)|server\.tool/u.test(
        defaultRuntimeSource,
      ),
  };
}

function verifyProofBridgeScope() {
  return {
    fp0165SuccessorBridgeCompatibilityVerified:
      readinessProof.fp0166AbsentOrLocalRenderToolDescriptorSkeletonPlanVerified ===
        true && readinessProof.fp0167Absent === true,
  };
}

function buildPriorBoundaryOverrides(proof) {
  const prior = {
    fp0165LocalRenderToolDescriptorReadinessBoundaryStillVerified:
      proof.localRenderToolDescriptorReadinessBoundaryVerified === true,
  };

  for (const [key, value] of Object.entries(proof)) {
    if (/^fp\d{4}.+BoundaryStillVerified$/u.test(key)) {
      prior[key] = value === true;
    }
  }

  return prior;
}

function assertProof(proof) {
  const failed = Object.entries(proof).filter(
    ([key, value]) =>
      key !== "schemaVersion" && key !== "proofDetails" && value !== true,
  );
  if (failed.length > 0) {
    throw new Error(
      `FP-0166 render tool descriptor skeleton proof failed: ${failed
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join(", ")}`,
    );
  }
}

function changedFilePathScope() {
  const tracked = execFileSync("git", ["diff", "--name-only", "HEAD", "--"], {
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
  const untracked = execFileSync("git", [
    "ls-files",
    "--others",
    "--exclude-standard",
  ], {
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
  return {
    combinedChangedPaths: [...new Set([...tracked, ...untracked])].sort(),
  };
}

function runJsonTool(path) {
  const stdout = execFileSync("pnpm", ["exec", "tsx", path], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(stdout);
}

function readChangedAddedText(paths) {
  return execFileSync("git", ["diff", "--unified=0", "--", ...paths], {
    encoding: "utf8",
  })
    .split("\n")
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .join("\n");
}

function safeRead(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

function repoFilePaths(dir = ".", prefix = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (
      entry.name === ".git" ||
      entry.name === "node_modules" ||
      entry.name === ".next" ||
      entry.name === "dist"
    ) {
      return [];
    }
    const fullPath = `${dir}/${entry.name}`;
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return repoFilePaths(fullPath, relativePath);
    return [relativePath];
  });
}
