/* global console */

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  buildReadOnlyMcpLocalAppsSdkResourceReadinessProof,
  scanProofOnlyNoTokenLeakageText,
  verifyReadOnlyMcpLocalAppsSdkResourceReadinessBoundary,
} from "../packages/domain/src/index.ts";

const SCHEMA_VERSION =
  "v2cd.read-only-chatgpt-app-mcp-local-apps-sdk-resource-readiness-proof.v1";

const FP0161_PLAN_PATH =
  "plans/FP-0161-read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-visual-qa-accessibility.md";
const FP0162_PLAN_PATH =
  "plans/FP-0162-read-only-chatgpt-app-mcp-local-apps-sdk-resource-readiness.md";
const FP0163_PLAN_PATH =
  "plans/FP-0163-read-only-chatgpt-app-mcp-local-apps-sdk-resource-skeleton.md";
const FP0164_PLAN_PATH =
  "plans/FP-0164-read-only-chatgpt-app-mcp-local-apps-sdk-resource-registration.md";
const FP0165_PLAN_PATH =
  "plans/FP-0165-read-only-chatgpt-app-mcp-local-render-tool-descriptor-readiness.md";
const FP0161_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-visual-qa-accessibility-proof.mjs";
const FP0160_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-implementation-proof.mjs";
const FP0159_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs";
const READINESS_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.ts";
const SKELETON_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts";
const SKELETON_RUNTIME_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime.ts";
const REGISTRATION_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.ts";
const REGISTRATION_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.spec.ts";
const RENDER_TOOL_DESCRIPTOR_READINESS_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-readiness.ts";
const RENDER_TOOL_DESCRIPTOR_READINESS_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-readiness.spec.ts";
const RENDER_TOOL_DESCRIPTOR_READINESS_PROOF_PATH =
  "tools/read-only-mcp-local-render-tool-descriptor-readiness-proof.mjs";
const REGISTRATION_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-registration-proof.mjs";
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
  FP0161_PLAN_PATH,
  FP0162_PLAN_PATH,
  FP0163_PLAN_PATH,
  FP0164_PLAN_PATH,
  FP0165_PLAN_PATH,
  FP0161_PROOF_PATH,
  FP0160_PROOF_PATH,
  FP0159_PROOF_PATH,
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
  "tools/read-only-public-app-security-boundary-proof.mjs",
  "tools/read-only-mcp-local-apps-sdk-resource-readiness-proof.mjs",
  "tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs",
  REGISTRATION_PROOF_PATH,
  READINESS_MODULE_PATH,
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.ts",
  SKELETON_MODULE_PATH,
  SKELETON_RUNTIME_MODULE_PATH,
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts",
  REGISTRATION_MODULE_PATH,
  REGISTRATION_SPEC_PATH,
  RENDER_TOOL_DESCRIPTOR_READINESS_MODULE_PATH,
  RENDER_TOOL_DESCRIPTOR_READINESS_SPEC_PATH,
  RENDER_TOOL_DESCRIPTOR_READINESS_PROOF_PATH,
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts",
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts",
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
const fp0161PlanText = safeRead(FP0161_PLAN_PATH);
const fp0162PlanText = safeRead(FP0162_PLAN_PATH);
const readinessModuleSource = safeRead(READINESS_MODULE_PATH);
const runtimePreviewSource = [
  safeRead(PREVIEW_ROUTE_PATH),
  safeRead(BRIDGE_COMPONENT_PATH),
  safeRead(BRIDGE_SNAPSHOT_PATH),
].join("\n");
const fp0161ProofSource = safeRead(FP0161_PROOF_PATH);
const fp0161Proof = runJsonTool(FP0161_PROOF_PATH);
const fp0160Proof = runJsonTool(FP0160_PROOF_PATH);
const fp0159Proof = runJsonTool(FP0159_PROOF_PATH);
const pathScope = verifyPathScope();
const sourceScope = verifySourceScope();
const proofDurabilityScope = verifyProofDurabilityScope();
const priorBoundaryOverrides = buildPriorBoundaryOverrides();
const readinessProof = buildReadOnlyMcpLocalAppsSdkResourceReadinessProof({
  changedPathScopeAccepted: pathScope.changedPathScopeAccepted,
  fp0161PlanText,
  fp0161SuccessorPathScopeHardened:
    proofDurabilityScope.fp0161SuccessorPathScopeHardened,
  fp0162PlanText,
  noNewRouteOrApiRouteAdded: pathScope.newRouteOrApiRouteAdded,
  priorBoundaryOverrides,
  repoPaths,
});

const output = {
  schemaVersion: SCHEMA_VERSION,
  fp0162AbsentOrLocalAppsSdkResourceReadinessPlanVerified:
    readinessProof.fp0162AbsentOrLocalAppsSdkResourceReadinessPlanVerified,
  fp0163AbsentOrLocalAppsSdkResourceSkeletonPlanVerified:
    readinessProof.fp0163AbsentOrLocalAppsSdkResourceSkeletonPlanVerified,
  fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified:
    readinessProof.fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified,
  fp0165Absent: readinessProof.fp0165Absent,
  fp0165AbsentOrLocalRenderToolDescriptorReadinessPlanVerified:
    readinessProof.fp0165AbsentOrLocalRenderToolDescriptorReadinessPlanVerified,
  fp0166Absent: readinessProof.fp0166Absent,
  localAppsSdkResourceReadinessBoundaryVerified:
    verifyReadOnlyMcpLocalAppsSdkResourceReadinessBoundary({
      changedPathScopeAccepted: pathScope.changedPathScopeAccepted,
      fp0161PlanText,
      fp0161SuccessorPathScopeHardened:
        proofDurabilityScope.fp0161SuccessorPathScopeHardened,
      fp0162PlanText,
      noNewRouteOrApiRouteAdded: pathScope.newRouteOrApiRouteAdded,
      priorBoundaryOverrides,
      repoPaths,
    }),
  appsSdkResourceImplementationStillBlocked:
    readinessProof.appsSdkResourceImplementationStillBlocked &&
    sourceScope.noAppsSdkResourceRuntime,
  registerResourceImplementationStillBlocked:
    readinessProof.registerResourceImplementationStillBlocked &&
    sourceScope.noDefaultRegisterResourceWiring,
  toolDescriptorImplementationStillBlocked:
    readinessProof.toolDescriptorImplementationStillBlocked &&
    sourceScope.noToolDescriptorImplementation,
  componentBundleImplementationStillBlocked:
    readinessProof.componentBundleImplementationStillBlocked &&
    sourceScope.noComponentBundleImplementation,
  noNewRouteOrApiRouteFromFp0162: pathScope.noNewRouteOrApiRouteFromFp0162,
  futureResourceInputBoundaryRecorded:
    readinessProof.futureResourceInputBoundaryRecorded,
  futureResourceOutputBoundaryRecorded:
    readinessProof.futureResourceOutputBoundaryRecorded,
  futureResourceMetadataBoundaryRecorded:
    readinessProof.futureResourceMetadataBoundaryRecorded,
  futureToolDescriptorReadinessRecorded:
    readinessProof.futureToolDescriptorReadinessRecorded,
  futureResourceImplementationSequenceRecorded:
    readinessProof.futureResourceImplementationSequenceRecorded,
  futureResourceTwoLaneSeparationRecorded:
    readinessProof.futureResourceTwoLaneSeparationRecorded,
  futureResourceForbidsCredentialParserSourceLeakage:
    readinessProof.futureResourceForbidsCredentialParserSourceLeakage,
  futureResourceForbidsRealFinanceData:
    readinessProof.futureResourceForbidsRealFinanceData,
  futureResourceForbidsPublicAssetsScreenshotsSubmission:
    readinessProof.futureResourceForbidsPublicAssetsScreenshotsSubmission,
  noLiveMcpFetchFromPreviewUi: sourceScope.noLiveMcpFetchFromPreviewUi,
  noWindowOpenAiUsageFromFp0162: sourceScope.noWindowOpenAiUsageFromFp0162,
  noHarnessExecutionAtRequestTime: sourceScope.noHarnessExecutionAtRequestTime,
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
  noProductionTokenValidationFromFp0162:
    readinessProof.noProductionTokenValidationFromFp0162,
  noOauthSessionAuthMiddlewareFromFp0162:
    readinessProof.noOauthSessionAuthMiddlewareFromFp0162,
  noProviderCallsFromFp0162: readinessProof.noProviderCallsFromFp0162,
  noOpenAiApiCallsFromFp0162: readinessProof.noOpenAiApiCallsFromFp0162,
  noModelCallsFromFp0162: readinessProof.noModelCallsFromFp0162,
  noSourceMutationFromFp0162: readinessProof.noSourceMutationFromFp0162,
  noFinanceWriteFromFp0162: readinessProof.noFinanceWriteFromFp0162,
  noExternalCommunicationsFromFp0162:
    readinessProof.noExternalCommunicationsFromFp0162,
  noPublicAssetsFromFp0162: readinessProof.noPublicAssetsFromFp0162,
  noGeneratedPublicProseFromFp0162:
    readinessProof.noGeneratedPublicProseFromFp0162,
  noAppSubmissionFromFp0162: readinessProof.noAppSubmissionFromFp0162,
  fp0161CloseoutFreshnessVerified:
    readinessProof.fp0161CloseoutFreshnessVerified,
  fp0161SuccessorPathScopeHardened:
    readinessProof.fp0161SuccessorPathScopeHardened,
  sharedProofOnlyLeakageSanitizerStillVerified:
    readinessProof.sharedProofOnlyLeakageSanitizerStillVerified &&
    sourceScope.changedTextNoLeakage,
  ...priorBoundaryOverrides,
  proofDetails: {
    changedPathScope,
    disallowedChangedPaths: pathScope.disallowedChangedPaths,
    fp0162PlanPath: FP0162_PLAN_PATH,
    proofDurabilityScope,
    readinessProofDetails: readinessProof.proofDetails,
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
      `FP-0162 local Apps SDK resource readiness proof failed: ${key}`,
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
      (/^apps\/web\/app\//u.test(path) && path !== PREVIEW_ROUTE_PATH) ||
      /\/api\//u.test(path) ||
      /\/route\.tsx?$/u.test(path) ||
      path.endsWith("/routes.ts"),
  );

  return {
    changedPathScopeAccepted:
      disallowedChangedPaths.length === 0 && !newRouteOrApiRouteAdded,
    disallowedChangedPaths,
    newRouteOrApiRouteAdded,
    noNewRouteOrApiRouteFromFp0162:
      disallowedChangedPaths.length === 0 && !newRouteOrApiRouteAdded,
  };
}

function verifySourceScope() {
  const changedText = readChangedLeakageText(changedPaths);
  const changedTextNoLeakage = scanProofOnlyNoTokenLeakageText(changedText).accepted;
  const runtimeSource = normalize(runtimePreviewSource);
  const routeRuntimeSource = [
    safeRead("apps/control-plane/src/app.ts"),
    safeRead("apps/control-plane/src/container.ts"),
    safeRead("apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts"),
  ].join("\n");
  const nonPlanChangedPaths = changedPaths.filter(
    (path) =>
      !path.endsWith(".md") &&
      path !== FP0161_PROOF_PATH &&
      path !== REGISTRATION_PROOF_PATH &&
      path !== REGISTRATION_MODULE_PATH &&
      path !== REGISTRATION_SPEC_PATH &&
      path !== SKELETON_RUNTIME_MODULE_PATH &&
      path !== SKELETON_MODULE_PATH &&
      path !== "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts",
  );

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
    noAppsSdkResourceRuntime:
      !nonPlanChangedPaths.some((path) => path.startsWith("apps/")) &&
      !/registerResource\(|ui:\/\/|window\.openai/u.test(runtimePreviewSource),
    noComponentBundleImplementation:
      !changedPaths.some((path) =>
        /(?:vite|webpack|rollup|next)\.config|component-bundle|widget\.html|\.css$/iu.test(path),
      ),
    noHarnessExecutionAtRequestTime:
      !/child_process|spawnSync|execFileSync|read-only-mcp-[^"']*proof|read-only-mcp-[^"']*harness/u.test(runtimePreviewSource),
    noLiveMcpFetchFromPreviewUi:
      !/\bfetch\s*\(/u.test(runtimePreviewSource) &&
      !/["']\/mcp["']/u.test(runtimePreviewSource),
    noDefaultRegisterResourceWiring:
      !/registerResource\s*\(/u.test(routeRuntimeSource + runtimePreviewSource),
    noToolDescriptorImplementation:
      !/openai\/outputTemplate|_meta\s*:\s*\{\s*ui|annotations\s*:\s*\{\s*readOnlyHint/u.test(readinessModuleSource),
    noWindowOpenAiUsageFromFp0162:
      !/window\.openai|callTool|uploadFile|selectFiles|openExternal|sendFollowUpMessage|requestModal|requestDisplayMode|setWidgetState/u.test(runtimePreviewSource),
    protectedResourceMetadataRouteStillUnchanged:
      !changedPaths.includes("apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts"),
  };
}

function verifyProofDurabilityScope() {
  return {
    fp0161SuccessorPathScopeHardened:
      fp0161ProofSource.includes("origin/main...HEAD") &&
      fp0161ProofSource.includes("committedBranchDiffPaths") &&
      fp0161ProofSource.includes("unstaged") &&
      fp0161ProofSource.includes("staged") &&
      fp0161ProofSource.includes("untracked") &&
      fp0161ProofSource.includes(FP0162_PLAN_PATH) &&
      fp0161ProofSource.includes("read-only-mcp-local-apps-sdk-resource-readiness-proof.mjs"),
  };
}

function buildPriorBoundaryOverrides() {
  return {
    fp0161VisualQaAccessibilityBoundaryStillVerified:
      fp0161Proof.localPreviewDemoVisualQaAccessibilityBoundaryVerified === true,
    fp0160LocalPreviewDemoUiBridgeBoundaryStillVerified:
      fp0161Proof.fp0160LocalPreviewDemoUiBridgeBoundaryStillVerified === true &&
      fp0160Proof.evidenceAppLocalPreviewDemoUiBridgeImplementationBoundaryVerified === true,
    fp0159ReadinessBoundaryStillVerified:
      fp0161Proof.fp0159ReadinessBoundaryStillVerified === true &&
      fp0159Proof.evidenceAppLocalPreviewDemoUiBridgeReadinessBoundaryVerified === true,
    fp0158LocalEvidenceDemoBridgeBoundaryStillVerified:
      fp0161Proof.fp0158LocalEvidenceDemoBridgeBoundaryStillVerified === true,
    fp0157LocalAuthDemoHarnessBoundaryStillVerified:
      fp0161Proof.fp0157LocalAuthDemoHarnessBoundaryStillVerified === true,
    fp0156AppConstructionInjectionBoundaryStillVerified:
      fp0161Proof.fp0156AppConstructionInjectionBoundaryStillVerified === true,
    fp0155LocalAdapterImplementationBoundaryStillVerified:
      fp0161Proof.fp0155LocalAdapterImplementationBoundaryStillVerified === true,
    fp0154LocalAdapterReadinessBoundaryStillVerified:
      fp0161Proof.fp0154LocalAdapterReadinessBoundaryStillVerified === true,
    fp0153AppConstructionWiringBoundaryStillVerified:
      fp0161Proof.fp0153AppConstructionWiringBoundaryStillVerified === true,
    fp0152RouteIntegrationBoundaryStillVerified:
      fp0161Proof.fp0152RouteIntegrationBoundaryStillVerified === true,
    fp0151RouteReadinessBoundaryStillVerified:
      fp0161Proof.fp0151RouteReadinessBoundaryStillVerified === true,
    fp0150RouteIntegrationSequencingBoundaryStillVerified:
      fp0161Proof.fp0150RouteIntegrationSequencingBoundaryStillVerified === true,
    fp0149ParserImplementationBoundaryStillVerified:
      fp0161Proof.fp0149ParserImplementationBoundaryStillVerified === true,
    fp0148ReadinessBoundaryStillVerified:
      fp0161Proof.fp0148ReadinessBoundaryStillVerified === true,
    fp0147ProviderSelectionEvidenceBoundaryStillVerified:
      fp0161Proof.fp0147ProviderSelectionEvidenceBoundaryStillVerified === true,
    fp0146ParserContractsBoundaryStillVerified:
      fp0161Proof.fp0146ParserContractsBoundaryStillVerified === true,
    fp0145RuntimeContractsBoundaryStillVerified:
      fp0161Proof.fp0145RuntimeContractsBoundaryStillVerified === true,
    fp0144ProductionTokenValidationSequencingBoundaryStillVerified:
      fp0161Proof.fp0144ProductionTokenValidationSequencingBoundaryStillVerified === true,
    fp0143InvalidTokenAppWiringBoundaryStillVerified:
      fp0161Proof.fp0143InvalidTokenAppWiringBoundaryStillVerified === true,
    fp0142RouteIntegrationSequencingBoundaryStillVerified:
      fp0161Proof.fp0142RouteIntegrationSequencingBoundaryStillVerified === true,
    fp0141InvalidTokenLocalRuntimeBoundaryStillVerified:
      fp0161Proof.fp0141InvalidTokenLocalRuntimeBoundaryStillVerified === true,
    fp0139ResultEnvelopeBoundaryStillVerified:
      fp0161Proof.fp0139ResultEnvelopeBoundaryStillVerified === true,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      fp0161Proof.fp0130MissingTokenChallengeBoundaryStillVerified === true,
    fp0125ProtectedResourceMetadataRouteBoundaryStillVerified:
      fp0161Proof.fp0125ProtectedResourceMetadataRouteBoundaryStillVerified === true,
    fp0109EvidenceDispatchAdapterBoundaryStillVerified:
      fp0161Proof.fp0109EvidenceDispatchAdapterBoundaryStillVerified === true,
    fp0108EvidenceDispatchContractBoundaryStillVerified:
      fp0161Proof.fp0108EvidenceDispatchContractBoundaryStillVerified === true,
    fp0097PreviewVisualQaBoundaryStillVerified:
      fp0161Proof.fp0097PreviewVisualQaBoundaryStillVerified === true,
    fp0096PreviewStateMatrixBoundaryStillVerified:
      fp0161Proof.fp0096PreviewStateMatrixBoundaryStillVerified === true,
    fp0094PreviewRouteBoundaryStillVerified:
      fp0161Proof.fp0094PreviewRouteBoundaryStillVerified === true,
    fp0086BenchmarkCommunityBoundaryStillVerified:
      fp0161Proof.fp0086BenchmarkCommunityBoundaryStillVerified === true,
    fp0085BoundedOrchestrationBoundaryStillVerified:
      fp0161Proof.fp0085BoundedOrchestrationBoundaryStillVerified === true,
    fp0082EvidenceAppAlphaBoundaryStillVerified:
      fp0161Proof.fp0082EvidenceAppAlphaBoundaryStillVerified === true,
    fp0081DocumentPrecisionBoundaryStillVerified:
      fp0161Proof.fp0081DocumentPrecisionBoundaryStillVerified === true,
    fp0080EvidenceIndexBoundaryStillVerified:
      fp0161Proof.fp0080EvidenceIndexBoundaryStillVerified === true,
    fp0107RouteAdapterBoundaryStillVerified:
      fp0161Proof.fp0107RouteAdapterBoundaryStillVerified === true,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      fp0161Proof.fp0106ProtocolEnvelopeBoundaryStillVerified === true,
    fp0100PublicSecurityBoundaryStillVerified:
      fp0161Proof.fp0100PublicSecurityBoundaryStillVerified === true,
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

function normalize(value) {
  return value.toLowerCase().replace(/\s+/gu, " ").trim();
}
