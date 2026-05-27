/* global console */

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  FP0159_READINESS_PLAN_PATH,
  buildReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessProof,
  scanProofOnlyNoTokenLeakageText,
  verifyFp0158CloseoutFreshnessForFp0159,
} from "../packages/domain/src/index.ts";

const SCHEMA_VERSION =
  "v2ca.read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.v1";

const FP0158_PLAN_PATH =
  "plans/FP-0158-read-only-chatgpt-app-mcp-evidence-app-local-demo-bridge.md";
const FP0159_PLAN_PATH =
  "plans/FP-0159-read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.md";
const FP0160_PLAN_PATH =
  "plans/FP-0160-read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge-implementation.md";
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
const FP0166_PLAN_PATH =
  "plans/FP-0166-read-only-chatgpt-app-mcp-local-render-tool-descriptor-skeleton.md";
const FP0158_HARNESS_PATH =
  "tools/read-only-mcp-evidence-app-local-demo-bridge.mjs";
const FP0158_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-demo-bridge-proof.mjs";
const FP0157_PROOF_PATH =
  "tools/read-only-mcp-auth-local-demo-harness-proof.mjs";
const FP0156_PROOF_PATH =
  "tools/read-only-mcp-authorization-parser-local-adapter-app-construction-injection-proof.mjs";
const PREVIEW_ROUTE_PATH =
  "apps/web/app/read-only-app-mcp-preview/page.tsx";
const PREVIEW_ROUTE_SPEC_PATH =
  "apps/web/app/read-only-app-mcp-preview/page.spec.tsx";
const READINESS_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.ts";
const READINESS_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.spec.ts";
const CONTRACTS_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts";
const CONTRACTS_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts";
const INDEX_PATH = "packages/domain/src/index.ts";
const IMPLEMENTATION_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-implementation-proof.mjs";
const VISUAL_QA_ACCESSIBILITY_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-visual-qa-accessibility-proof.mjs";
const LOCAL_APPS_SDK_RESOURCE_READINESS_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-readiness-proof.mjs";
const LOCAL_APPS_SDK_RESOURCE_READINESS_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.ts";
const LOCAL_APPS_SDK_RESOURCE_READINESS_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.ts";
const LOCAL_APPS_SDK_RESOURCE_SKELETON_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs";
const LOCAL_APPS_SDK_RESOURCE_SKELETON_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts";
const LOCAL_APPS_SDK_RESOURCE_SKELETON_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts";
const LOCAL_APPS_SDK_RESOURCE_SKELETON_RUNTIME_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime.ts";
const LOCAL_APPS_SDK_RESOURCE_REGISTRATION_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-registration-proof.mjs";
const LOCAL_APPS_SDK_RESOURCE_REGISTRATION_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.ts";
const LOCAL_APPS_SDK_RESOURCE_REGISTRATION_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.spec.ts";
const LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_PROOF_PATH =
  "tools/read-only-mcp-local-render-tool-descriptor-readiness-proof.mjs";
const LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-readiness.ts";
const LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-readiness.spec.ts";
const LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_PROOF_PATH =
  "tools/read-only-mcp-local-render-tool-descriptor-skeleton-proof.mjs";
const LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_RUNTIME_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton-runtime.ts";
const LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton.ts";
const LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton.spec.ts";
const FP0097_PLAN_PATH =
  "plans/FP-0097-read-only-chatgpt-app-mcp-premium-ui-preview-route-visual-qa-foundation.md";
const FP0096_PLAN_PATH =
  "plans/FP-0096-read-only-chatgpt-app-mcp-premium-ui-preview-route-state-matrix-foundation.md";
const FP0094_PLAN_PATH =
  "plans/FP-0094-read-only-chatgpt-app-mcp-premium-ui-preview-route-foundation.md";

const allowedChangedPaths = new Set([
  "README.md",
  "CODEX_README.md",
  "START_HERE.md",
  "docs/ACTIVE_DOCS.md",
  "docs/PROJECT_STATE.md",
  "docs/V2_BOUNDARY.md",
  "plans/ROADMAP.md",
  "plugins.md",
  FP0158_PLAN_PATH,
  FP0159_PLAN_PATH,
  FP0160_PLAN_PATH,
  FP0161_PLAN_PATH,
  FP0162_PLAN_PATH,
  FP0163_PLAN_PATH,
  FP0164_PLAN_PATH,
  FP0165_PLAN_PATH,
  FP0166_PLAN_PATH,
  FP0158_HARNESS_PATH,
  FP0158_PROOF_PATH,
  FP0157_PROOF_PATH,
  FP0156_PROOF_PATH,
  "tools/read-only-endpoint-architecture-proof.mjs",
  "tools/read-only-endpoint-route-ownership-proof.mjs",
  "tools/read-only-mcp-authorization-parser-app-construction-wiring-proof.mjs",
  "tools/read-only-mcp-authorization-parser-route-integration-implementation-proof.mjs",
  "tools/read-only-mcp-authorization-parser-route-integration-readiness-proof.mjs",
  "tools/read-only-mcp-default-local-evidence-dispatch-proof.mjs",
  "tools/read-only-mcp-evidence-tool-dispatch-proof.mjs",
  "tools/read-only-mcp-invalid-token-app-wiring-proof.mjs",
  "tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs",
  "tools/read-only-mcp-protected-resource-metadata-local-route-proof.mjs",
  "tools/read-only-mcp-protocol-envelope-proof.mjs",
  "tools/read-only-mcp-route-adapter-proof.mjs",
  "tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs",
  "tools/read-only-public-app-security-boundary-proof.mjs",
  "tools/read-only-chatgpt-app-mcp-proof.mjs",
  "tools/benchmark-community-pack-proof.mjs",
  "packages/domain/src/benchmark-community.spec.ts",
  PREVIEW_ROUTE_PATH,
  PREVIEW_ROUTE_SPEC_PATH,
  READINESS_MODULE_PATH,
  READINESS_SPEC_PATH,
  CONTRACTS_MODULE_PATH,
  CONTRACTS_SPEC_PATH,
  INDEX_PATH,
  IMPLEMENTATION_PROOF_PATH,
  VISUAL_QA_ACCESSIBILITY_PROOF_PATH,
  LOCAL_APPS_SDK_RESOURCE_READINESS_PROOF_PATH,
  LOCAL_APPS_SDK_RESOURCE_READINESS_MODULE_PATH,
  LOCAL_APPS_SDK_RESOURCE_READINESS_SPEC_PATH,
  LOCAL_APPS_SDK_RESOURCE_SKELETON_PROOF_PATH,
  LOCAL_APPS_SDK_RESOURCE_SKELETON_MODULE_PATH,
  LOCAL_APPS_SDK_RESOURCE_SKELETON_SPEC_PATH,
  LOCAL_APPS_SDK_RESOURCE_SKELETON_RUNTIME_MODULE_PATH,
  LOCAL_APPS_SDK_RESOURCE_REGISTRATION_PROOF_PATH,
  LOCAL_APPS_SDK_RESOURCE_REGISTRATION_MODULE_PATH,
  LOCAL_APPS_SDK_RESOURCE_REGISTRATION_SPEC_PATH,
  LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_PROOF_PATH,
  LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_MODULE_PATH,
  LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_SPEC_PATH,
  LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_PROOF_PATH,
  LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_RUNTIME_MODULE_PATH,
  LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_MODULE_PATH,
  LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_SPEC_PATH,
  "packages/domain/src/read-only-app-mcp-oauth-implementation-sequencing-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input-inventory-rules.ts",
  "packages/domain/src/read-only-app-mcp-token-validation-inventory.ts",
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs",
]);

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const changedLeakageText = readChangedLeakageText(changedPaths);
const fp0159PlanText = safeRead(FP0159_READINESS_PLAN_PATH);
const fp0158PlanText = safeRead(FP0158_PLAN_PATH);
const readinessModuleSource = safeRead(READINESS_MODULE_PATH);
const fp0158HarnessOutput = runJsonTool(FP0158_HARNESS_PATH);
const fp0158ProofOutput = runJsonTool(FP0158_PROOF_PATH);
const fp0158SourceAnchorSummaryVerified =
  fp0158HarnessOutput.fetchSourceAnchorVerified === true &&
  fp0158ProofOutput.sourceAnchorFetchVerified === true;
const sourceScope = verifyReadinessSourceScope();
const pathScope = verifyChangedPathScope();
const priorBoundaryOverrides = buildPriorBoundaryOverrides(fp0158ProofOutput);
const readinessProof =
  buildReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessProof({
    changedPathScopeAccepted: pathScope.onlyAllowedChangedPaths,
    existingPreviewRouteChanged: pathScope.previewRouteChanged,
    fp0158PlanText,
    fp0158SourceAnchorSummaryVerified,
    fp0159PlanText,
    newRouteOrApiRouteAdded: pathScope.newRouteOrApiRouteAdded,
    priorBoundaryOverrides,
    repoPaths,
  });
const noLeakageScope = verifyNoLeakageScope();

const output = {
  schemaVersion: SCHEMA_VERSION,
  ...Object.fromEntries(
    Object.entries(readinessProof).filter(([key]) => key !== "proofDetails"),
  ),
  fp0159ReadinessPlanPathExact:
    repoPaths.filter((path) => /(^|\/)FP-0159/u.test(path)).length === 1 &&
    existsSync(FP0159_READINESS_PLAN_PATH),
  fp0160AbsentOrExactImplementationPlanAccepted:
    readinessProof
      .fp0160AbsentOrEvidenceAppLocalPreviewDemoUiBridgeImplementationPlanVerified ===
    true,
  fp0161AbsentOrExactVisualQaAccessibilityPlanAccepted:
    readinessProof
      .fp0161AbsentOrExactVisualQaAccessibilityPlanAccepted === true,
  fp0159PlanTextRequiredTopicsVerified:
    readinessProof.evidenceAppLocalPreviewDemoUiBridgeReadinessBoundaryVerified,
  changedPathScopeAccepted: pathScope.onlyAllowedChangedPaths,
  existingPreviewRouteStillUnchanged:
    (readinessProof.existingPreviewRouteStillUnchanged ||
      pathScope.previewRouteChangedOnlyForExactFp0160Bridge) &&
    (!pathScope.previewRouteChanged ||
      pathScope.previewRouteChangedOnlyForExactFp0160Bridge) &&
    existsSync(PREVIEW_ROUTE_PATH),
  noNewRouteOrApiRouteFromFp0159:
    readinessProof.noNewRouteOrApiRouteFromFp0159 &&
    !pathScope.newRouteOrApiRouteAdded,
  readinessHelperPureDomainOnly:
    sourceScope.noReactOrNext &&
    sourceScope.noFileNetworkDbOrRuntimeCalls &&
    sourceScope.noAuthProviderModelOrTokenRuntimeCalls,
  noTokenParserJwtJwksIntrospectionOauthMiddlewareFromFp0159:
    sourceScope.noAuthProviderModelOrTokenRuntimeCalls,
  noRouteRuntimeProviderOauthPublicAppFilesChanged:
    pathScope.noForbiddenRuntimePathsChanged,
  fp0158CloseoutFreshnessVerified:
    verifyFp0158CloseoutFreshnessForFp0159(fp0158PlanText),
  fp0158SourceAnchorSummaryVerified,
  sharedProofOnlyLeakageSanitizerStillVerified:
    readinessProof.sharedProofOnlyLeakageSanitizerStillVerified &&
    noLeakageScope.changedLeakageScan.accepted &&
    noLeakageScope.proofOutputLeakageScanAccepted,
  noSourceBodyTextOrRawSourceDumpFromFp0159:
    noLeakageScope.noSourceBodyTextOrRawSourceDump,
  noRealFinanceDataFromFp0159: noLeakageScope.noRealFinanceData,
  proofDetails: {
    changedPathScope,
    pathScope,
    readinessProofDetails: readinessProof.proofDetails,
    sourceScope,
  },
};

const proofOutputLeakageScan = scanProofOnlyNoTokenLeakageText(
  JSON.stringify(output),
);

for (const [key, value] of Object.entries(output)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(`FP-0159 local preview/demo UI readiness proof failed: ${key}`);
  }
}
if (!proofOutputLeakageScan.accepted) {
  throw new Error(
    `FP-0159 proof output leaked credential material: ${proofOutputLeakageScan.rejectionReasons.join(", ")}`,
  );
}

console.log(JSON.stringify(output, null, 2));

function verifyChangedPathScope() {
  const disallowedChangedPaths = changedPaths.filter(
    (path) =>
      !allowedChangedPaths.has(path) &&
      !path.startsWith("apps/web/components/read-only-app-mcp/"),
  );
  const previewRouteChanged = changedPaths.includes(PREVIEW_ROUTE_PATH);
  const previewRouteChangedOnlyForExactFp0160Bridge =
    previewRouteChanged && existsSync(FP0160_PLAN_PATH);
  const newRouteOrApiRouteAdded = changedPaths.some(
    (path) =>
      (/^apps\/web\/app\//u.test(path) &&
        path !== PREVIEW_ROUTE_PATH &&
        path !== PREVIEW_ROUTE_SPEC_PATH) ||
      /\/api\//u.test(path) ||
      /\/route\.tsx?$/u.test(path) ||
      path.endsWith("/routes.ts"),
  );

  return {
    disallowedChangedPaths,
    newRouteOrApiRouteAdded,
    noForbiddenRuntimePathsChanged:
      !changedPaths.some((path) => /^apps\/control-plane\//u.test(path)) &&
      !changedPaths.some(
        (path) =>
          /^apps\/web\//u.test(path) &&
          path !== PREVIEW_ROUTE_PATH &&
          path !== PREVIEW_ROUTE_SPEC_PATH &&
          !path.startsWith("apps/web/components/read-only-app-mcp/"),
      ),
    onlyAllowedChangedPaths: disallowedChangedPaths.length === 0,
    previewRouteChanged,
    previewRouteChangedOnlyForExactFp0160Bridge,
  };
}

function verifyReadinessSourceScope() {
  const runtimeCallPattern =
    /from "react"|from "next|node:fs|readdir|readFile|fetch\(|buildApp\(|createContainer\(|createInMemoryContainer\(|new\s+OpenAI|providerClient|jwksClient|introspectToken|oauthCallback|sessionStore/u;
  const authProviderModelTokenPattern =
    /decodeJwt\(|verifyJwt\(|jwtDecode\(|parseToken\(|decodeToken\(|validateToken\(|verifyToken\(|fetchJwks\(|introspectToken\(|oauthCallback\(|sessionStore\(|providerClient\(|new\s+OpenAI|responses\.create|chat\.completions/u;

  return {
    noAuthProviderModelOrTokenRuntimeCalls:
      !authProviderModelTokenPattern.test(readinessModuleSource),
    noFileNetworkDbOrRuntimeCalls:
      !runtimeCallPattern.test(readinessModuleSource) &&
      !readinessModuleSource.includes("packages/db") &&
      !readinessModuleSource.includes("process.env"),
    noReactOrNext:
      !/from "react"|from "next/u.test(readinessModuleSource),
  };
}

function verifyNoLeakageScope() {
  const changedLeakageScan = scanProofOnlyNoTokenLeakageText(changedLeakageText);
  const nonToolChangedAddedText = readChangedAddedText(
    changedPaths.filter((path) => !path.startsWith("tools/")),
  );
  const sourceExposurePattern = new RegExp(
    [
      ["raw", "Full", "Text"].join(""),
      ["raw", "File", "Text"].join(""),
      ["full", "File", "Text"].join(""),
      ["file", "Contents"].join(""),
      ["raw", "Source", "Dump"].join(""),
      ["source", "Body", "Text"].join(""),
      ["private", "Field"].join(""),
      ["provider", "Response"].join(""),
      ["generated", "Advice"].join(""),
      ["model", "Generated", "Advice"].join(""),
      ["write", "Action"].join(""),
      ["send", "report"].join("_"),
      ["update", "ledger"].join("_"),
    ].join("|"),
    "u",
  );
  const realFinancePattern =
    /\b(?:account_number|routing_number|bank_balance|payroll|customer_list|vendor_list|tax_id)\b/iu;

  return {
    changedLeakageScan,
    noRealFinanceData: !realFinancePattern.test(nonToolChangedAddedText),
    noSourceBodyTextOrRawSourceDump:
      !sourceExposurePattern.test(nonToolChangedAddedText),
    proofOutputLeakageScanAccepted: true,
  };
}

function buildPriorBoundaryOverrides(fp0158Proof) {
  return {
    fp0158LocalEvidenceDemoBridgeBoundaryStillVerified:
      fp0158Proof.evidenceAppLocalDemoBridgeBoundaryVerified === true &&
      fp0158Proof.evidenceToolLaneVerified === true,
    fp0157LocalAuthDemoHarnessBoundaryStillVerified:
      fp0158Proof.fp0157LocalAuthDemoHarnessBoundaryStillVerified === true,
    fp0156AppConstructionInjectionBoundaryStillVerified:
      fp0158Proof.fp0156AppConstructionInjectionBoundaryStillVerified === true,
    fp0155LocalAdapterImplementationBoundaryStillVerified:
      fp0158Proof.fp0155LocalAdapterImplementationBoundaryStillVerified === true,
    fp0154LocalAdapterReadinessBoundaryStillVerified:
      fp0158Proof.fp0154LocalAdapterReadinessBoundaryStillVerified === true,
    fp0153AppConstructionWiringBoundaryStillVerified:
      fp0158Proof.fp0153AppConstructionWiringBoundaryStillVerified === true,
    fp0152RouteIntegrationBoundaryStillVerified:
      fp0158Proof.fp0152RouteIntegrationBoundaryStillVerified === true,
    fp0151RouteReadinessBoundaryStillVerified:
      fp0158Proof.fp0151RouteReadinessBoundaryStillVerified === true,
    fp0150RouteIntegrationSequencingBoundaryStillVerified:
      fp0158Proof.fp0150RouteIntegrationSequencingBoundaryStillVerified === true,
    fp0149ParserImplementationBoundaryStillVerified:
      fp0158Proof.fp0149ParserImplementationBoundaryStillVerified === true,
    fp0148ReadinessBoundaryStillVerified:
      fp0158Proof.fp0148ReadinessBoundaryStillVerified === true,
    fp0147ProviderSelectionEvidenceBoundaryStillVerified:
      fp0158Proof.fp0147ProviderSelectionEvidenceBoundaryStillVerified === true,
    fp0146ParserContractsBoundaryStillVerified:
      fp0158Proof.fp0146ParserContractsBoundaryStillVerified === true,
    fp0145RuntimeContractsBoundaryStillVerified:
      fp0158Proof.fp0145RuntimeContractsBoundaryStillVerified === true,
    fp0144ProductionTokenValidationSequencingBoundaryStillVerified:
      fp0158Proof.fp0144ProductionTokenValidationSequencingBoundaryStillVerified ===
      true,
    fp0143InvalidTokenAppWiringBoundaryStillVerified:
      fp0158Proof.fp0143InvalidTokenAppWiringBoundaryStillVerified === true,
    fp0142RouteIntegrationSequencingBoundaryStillVerified:
      fp0158Proof.fp0142RouteIntegrationSequencingBoundaryStillVerified === true,
    fp0141InvalidTokenLocalRuntimeBoundaryStillVerified:
      fp0158Proof.fp0141InvalidTokenLocalRuntimeBoundaryStillVerified === true,
    fp0139ResultEnvelopeBoundaryStillVerified:
      fp0158Proof.fp0139ResultEnvelopeBoundaryStillVerified === true,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      fp0158Proof.fp0130MissingTokenChallengeBoundaryStillVerified === true,
    fp0125ProtectedResourceMetadataRouteBoundaryStillVerified:
      fp0158Proof.fp0125ProtectedResourceMetadataRouteBoundaryStillVerified ===
      true,
    fp0109EvidenceDispatchAdapterBoundaryStillVerified:
      fp0158Proof.fp0109EvidenceDispatchAdapterBoundaryStillVerified === true,
    fp0108EvidenceDispatchContractBoundaryStillVerified:
      fp0158Proof.fp0108EvidenceDispatchContractBoundaryStillVerified === true,
    fp0097PreviewVisualQaBoundaryStillVerified: docsBoundary(FP0097_PLAN_PATH, [
      "visual qa",
      "preview route",
    ]),
    fp0096PreviewStateMatrixBoundaryStillVerified: docsBoundary(
      FP0096_PLAN_PATH,
      ["state matrix", "preview route"],
    ),
    fp0094PreviewRouteBoundaryStillVerified: docsBoundary(FP0094_PLAN_PATH, [
      "preview route",
      "local",
    ]),
    fp0086BenchmarkCommunityBoundaryStillVerified:
      fp0158Proof.fp0086BenchmarkCommunityBoundaryStillVerified === true,
    fp0085BoundedOrchestrationBoundaryStillVerified:
      fp0158Proof.fp0085BoundedOrchestrationBoundaryStillVerified === true,
    fp0082EvidenceAppAlphaBoundaryStillVerified:
      fp0158Proof.fp0082EvidenceAppAlphaBoundaryStillVerified === true,
    fp0081DocumentPrecisionBoundaryStillVerified:
      fp0158Proof.fp0081DocumentPrecisionBoundaryStillVerified === true,
    fp0080EvidenceIndexBoundaryStillVerified:
      fp0158Proof.fp0080EvidenceIndexBoundaryStillVerified === true,
    fp0107RouteAdapterBoundaryStillVerified:
      fp0158Proof.fp0107RouteAdapterBoundaryStillVerified === true,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      fp0158Proof.fp0106ProtocolEnvelopeBoundaryStillVerified === true,
    fp0100PublicSecurityBoundaryStillVerified:
      fp0158Proof.fp0100PublicSecurityBoundaryStillVerified === true,
  };
}

function docsBoundary(path, requiredTexts) {
  const normalized = normalizePlanText(safeRead(path));
  return requiredTexts.every((requiredText) =>
    normalized.includes(normalizePlanText(requiredText)),
  );
}

function runJsonTool(path) {
  const result = spawnSync("pnpm", ["exec", "tsx", path], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`${path} failed: ${result.stderr || result.stdout}`);
  }
  return JSON.parse(result.stdout);
}

function changedFilePathScope() {
  const committedBranchDiffPaths = gitLines([
    "diff",
    "--name-only",
    "origin/main...HEAD",
  ]);
  const dirtyPaths = [
    ...gitLines(["diff", "--name-only"]),
    ...gitLines(["diff", "--name-only", "--cached"]),
    ...gitLines(["ls-files", "--others", "--exclude-standard"]),
  ];
  const combinedChangedPaths = [
    ...new Set([...committedBranchDiffPaths, ...dirtyPaths]),
  ].sort();

  return {
    combinedChangedPaths,
    dirtyQaTargetFiles: dirtyPaths.filter(Boolean).sort(),
  };
}

function readChangedLeakageText(paths) {
  return paths
    .filter((path) => /\.(?:md|mjs|ts|tsx)$/u.test(path))
    .map((path) => safeRead(path))
    .join("\n");
}

function readChangedAddedText(paths) {
  const textPaths = paths.filter((path) => /\.(?:md|mjs|ts|tsx)$/u.test(path));
  const trackedAdditionText = [
    diffAddedLinesForPaths(
      ["diff", "--unified=0", "origin/main...HEAD"],
      textPaths,
    ),
    diffAddedLinesForPaths(["diff", "--unified=0"], textPaths),
    diffAddedLinesForPaths(["diff", "--cached", "--unified=0"], textPaths),
  ].join("\n");
  const untrackedText = gitLines(["ls-files", "--others", "--exclude-standard"])
    .filter((path) => paths.includes(path))
    .filter((path) => textPaths.includes(path))
    .map((path) => safeRead(path))
    .join("\n");

  return `${trackedAdditionText}\n${untrackedText}`;
}

function diffAddedLinesForPaths(args, paths) {
  if (paths.length === 0) return "";
  return diffAddedLines([...args, "--", ...paths]);
}

function diffAddedLines(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" })
      .split(/\r?\n/u)
      .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
      .map((line) => line.slice(1))
      .join("\n");
  } catch {
    return "";
  }
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
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolutePath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return repoFilePaths(absolutePath, path);
    return [path];
  });
}

function safeRead(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function gitLines(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" })
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function normalizePlanText(text) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
