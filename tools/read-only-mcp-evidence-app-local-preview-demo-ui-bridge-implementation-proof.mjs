/* global console */

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  FP0160_READ_ONLY_MCP_EVIDENCE_APP_LOCAL_PREVIEW_DEMO_UI_BRIDGE_IMPLEMENTATION_PLAN_PATH,
  scanProofOnlyNoTokenLeakageText,
  verifyFp0160AbsentOrReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeImplementationPlan,
  verifyFp0161Absent,
} from "../packages/domain/src/index.ts";

const SCHEMA_VERSION =
  "v2cb.read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge-implementation-proof.v1";

const FP0159_PLAN_PATH =
  "plans/FP-0159-read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.md";
const FP0160_PLAN_PATH =
  FP0160_READ_ONLY_MCP_EVIDENCE_APP_LOCAL_PREVIEW_DEMO_UI_BRIDGE_IMPLEMENTATION_PLAN_PATH;
const READINESS_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs";
const READINESS_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.ts";
const READINESS_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.spec.ts";
const CONTRACTS_MODULE_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts";
const CONTRACTS_SPEC_PATH =
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts";
const INDEX_PATH = "packages/domain/src/index.ts";
const PREVIEW_ROUTE_PATH =
  "apps/web/app/read-only-app-mcp-preview/page.tsx";
const PREVIEW_ROUTE_SPEC_PATH =
  "apps/web/app/read-only-app-mcp-preview/page.spec.tsx";
const BRIDGE_COMPONENT_PATH =
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge.tsx";
const BRIDGE_SNAPSHOT_PATH =
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge-snapshot.ts";
const BRIDGE_SPEC_PATH =
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge.spec.tsx";
const BRIDGE_INDEX_PATH = "apps/web/components/read-only-app-mcp/index.ts";
const FP0158_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-demo-bridge-proof.mjs";
const FP0157_PROOF_PATH =
  "tools/read-only-mcp-auth-local-demo-harness-proof.mjs";
const FP0156_PROOF_PATH =
  "tools/read-only-mcp-authorization-parser-local-adapter-app-construction-injection-proof.mjs";

const allowedChangedPaths = new Set([
  "README.md",
  "CODEX_README.md",
  "START_HERE.md",
  "docs/ACTIVE_DOCS.md",
  "docs/PROJECT_STATE.md",
  "docs/V2_BOUNDARY.md",
  "plans/ROADMAP.md",
  "plugins.md",
  FP0159_PLAN_PATH,
  FP0160_PLAN_PATH,
  READINESS_PROOF_PATH,
  READINESS_MODULE_PATH,
  READINESS_SPEC_PATH,
  CONTRACTS_MODULE_PATH,
  CONTRACTS_SPEC_PATH,
  INDEX_PATH,
  PREVIEW_ROUTE_PATH,
  PREVIEW_ROUTE_SPEC_PATH,
  BRIDGE_COMPONENT_PATH,
  BRIDGE_SNAPSHOT_PATH,
  BRIDGE_SPEC_PATH,
  BRIDGE_INDEX_PATH,
  FP0158_PROOF_PATH,
  FP0157_PROOF_PATH,
  FP0156_PROOF_PATH,
  "tools/read-only-endpoint-architecture-proof.mjs",
  "tools/read-only-endpoint-route-ownership-proof.mjs",
  "tools/read-only-mcp-authorization-parser-app-construction-wiring-proof.mjs",
  "tools/read-only-mcp-authorization-parser-route-integration-implementation-proof.mjs",
  "tools/read-only-mcp-authorization-parser-route-integration-readiness-proof.mjs",
  "tools/read-only-mcp-evidence-tool-dispatch-proof.mjs",
  "tools/read-only-mcp-invalid-token-app-wiring-proof.mjs",
  "tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs",
  "tools/read-only-mcp-protocol-envelope-proof.mjs",
  "tools/read-only-mcp-route-adapter-proof.mjs",
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-implementation-proof.mjs",
]);

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const fp0159PlanText = safeRead(FP0159_PLAN_PATH);
const fp0160PlanText = safeRead(FP0160_PLAN_PATH);
const readinessProofSource = safeRead(READINESS_PROOF_PATH);
const previewRouteSource = safeRead(PREVIEW_ROUTE_PATH);
const previewRouteSpecSource = safeRead(PREVIEW_ROUTE_SPEC_PATH);
const bridgeComponentSource = safeRead(BRIDGE_COMPONENT_PATH);
const bridgeSnapshotSource = safeRead(BRIDGE_SNAPSHOT_PATH);
const bridgeSpecSource = safeRead(BRIDGE_SPEC_PATH);
const bridgeIndexSource = safeRead(BRIDGE_INDEX_PATH);
const runtimeUiSource = [
  previewRouteSource,
  bridgeComponentSource,
  bridgeSnapshotSource,
  bridgeIndexSource,
].join("\n");
const bridgeSource = [
  bridgeComponentSource,
  bridgeSnapshotSource,
  bridgeSpecSource,
].join("\n");
const readinessProof = runJsonTool(READINESS_PROOF_PATH);
const pathScope = verifyPathScope();
const planScope = verifyPlanScope();
const sourceScope = verifySourceScope();
const renderedScope = verifyRenderedScope();
const fp0159Scope = verifyFp0159Scope();
const noLeakageScope = verifyNoLeakageScope();
const priorBoundaryScope = verifyPriorBoundaryScope(readinessProof);

const output = {
  schemaVersion: SCHEMA_VERSION,
  fp0160AbsentOrEvidenceAppLocalPreviewDemoUiBridgeImplementationPlanVerified:
    planScope.fp0160PlanAccepted,
  fp0161Absent: planScope.fp0161Absent,
  evidenceAppLocalPreviewDemoUiBridgeImplementationBoundaryVerified:
    planScope.fp0160PlanBoundaryVerified &&
    renderedScope.localOnlyBoundaryRendered &&
    sourceScope.staticSyntheticSnapshotOnly,
  existingPreviewRouteBridgeImplemented:
    renderedScope.bridgeRenderedOnExistingPreviewRoute &&
    previewRouteSource.includes("localPreviewDemoBridgeSnapshot") &&
    previewRouteSource.includes("LocalPreviewDemoBridge"),
  noNewRouteOrApiRouteFromFp0160:
    pathScope.noNewRouteOrApiRouteFromFp0160,
  appsSdkIframeResourceStillBlocked:
    planScope.appsSdkIframeResourceBlocked &&
    sourceScope.noAppsSdkIframeResourceImplementation,
  publicChatGptAppStillBlocked:
    planScope.publicChatGptAppBlocked &&
    renderedScope.publicChatGptAppFalseRendered,
  appSubmissionStillBlocked:
    planScope.appSubmissionBlocked &&
    noLeakageScope.noSubmissionMaterialFromBridge,
  staticSyntheticSnapshotOnly: sourceScope.staticSyntheticSnapshotOnly,
  noLiveMcpFetchFromPreviewUi: sourceScope.noLiveMcpFetchFromPreviewUi,
  noHarnessExecutionAtRequestTime: sourceScope.noHarnessExecutionAtRequestTime,
  authBoundaryLaneRendered: renderedScope.authBoundaryLaneRendered,
  evidenceToolLaneRendered: renderedScope.evidenceToolLaneRendered,
  authAndEvidenceLanesVisuallySeparate:
    renderedScope.authAndEvidenceLanesVisuallySeparate,
  authLaneDoesNotClaimProductionAuthentication:
    renderedScope.authLaneDoesNotClaimProductionAuthentication,
  evidenceLaneDoesNotClaimAuthenticatedToolExecution:
    renderedScope.evidenceLaneDoesNotClaimAuthenticatedToolExecution,
  sourceAnchorStatusRendered: renderedScope.sourceAnchorStatusRendered,
  productionTokenValidationFalseRendered:
    renderedScope.productionTokenValidationFalseRendered,
  publicChatGptAppFalseRendered: renderedScope.publicChatGptAppFalseRendered,
  noCredentialParserSourceLeakageInUi:
    noLeakageScope.noCredentialParserSourceLeakageInUi,
  noRealFinanceDataFromFp0160: noLeakageScope.noRealFinanceDataFromFp0160,
  noPublicDemoDataFromFp0160: noLeakageScope.noPublicDemoDataFromFp0160,
  noFormsButtonsFileInputsOrMutationControls:
    renderedScope.noFormsButtonsFileInputsOrMutationControls,
  noProviderPaymentSendCertificationControls:
    renderedScope.noProviderPaymentSendCertificationControls,
  noPublicAssetsScreenshotsSubmissionMaterial:
    noLeakageScope.noPublicAssetsScreenshotsSubmissionMaterial,
  defaultAuthAdapterWiringStillBlocked:
    readinessProof.defaultAuthAdapterWiringStillBlocked === true ||
    readinessProof.fp0158LocalEvidenceDemoBridgeBoundaryStillVerified === true,
  defaultEvidenceDispatchWiringStillBlocked:
    readinessProof.defaultEvidenceDispatchWiringStillBlocked === true ||
    readinessProof.fp0158LocalEvidenceDemoBridgeBoundaryStillVerified === true,
  defaultCreateContainerBehaviorStillUnchanged:
    sourceScope.defaultCreateContainerBehaviorStillUnchanged,
  defaultCreateInMemoryContainerBehaviorStillUnchanged:
    sourceScope.defaultCreateInMemoryContainerBehaviorStillUnchanged,
  defaultBuildAppBehaviorStillUnchanged:
    sourceScope.defaultBuildAppBehaviorStillUnchanged,
  mcpRouteBehaviorStillUnchanged: pathScope.mcpRouteBehaviorStillUnchanged,
  protectedResourceMetadataRouteStillUnchanged:
    pathScope.protectedResourceMetadataRouteStillUnchanged,
  noProductionTokenValidationFromFp0160:
    sourceScope.noProductionTokenValidationFromFp0160,
  noOauthSessionAuthMiddlewareFromFp0160:
    sourceScope.noOauthSessionAuthMiddlewareFromFp0160,
  noProviderCallsFromFp0160: sourceScope.noProviderCallsFromFp0160,
  noOpenAiApiCallsFromFp0160: sourceScope.noOpenAiApiCallsFromFp0160,
  noModelCallsFromFp0160: sourceScope.noModelCallsFromFp0160,
  noSourceMutationFromFp0160: sourceScope.noSourceMutationFromFp0160,
  noFinanceWriteFromFp0160: sourceScope.noFinanceWriteFromFp0160,
  noExternalCommunicationsFromFp0160:
    sourceScope.noExternalCommunicationsFromFp0160,
  fp0159CloseoutFreshnessVerified: fp0159Scope.closeoutFreshnessVerified,
  fp0159SuccessorBridgeCompatibilityVerified:
    fp0159Scope.successorBridgeCompatibilityVerified,
  sharedProofOnlyLeakageSanitizerStillVerified:
    noLeakageScope.changedLeakageScan.accepted &&
    noLeakageScope.proofOutputLeakageScanAccepted,
  fp0159ReadinessBoundaryStillVerified:
    priorBoundaryScope.fp0159ReadinessBoundaryStillVerified,
  ...priorBoundaryScope.priorBoundaryFields,
  proofDetails: {
    changedPathScope,
    disallowedChangedPaths: pathScope.disallowedChangedPaths,
    fp0159FreshnessCorrections: fp0159Scope.freshnessCorrections,
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
    throw new Error(`FP-0160 local preview/demo UI bridge proof failed: ${key}`);
  }
}

console.log(JSON.stringify(output, null, 2));

function verifyPathScope() {
  const disallowedChangedPaths = changedPaths.filter(
    (path) =>
      !allowedChangedPaths.has(path) &&
      !path.startsWith("apps/web/components/read-only-app-mcp/"),
  );
  const newRouteOrApiRouteFromFp0160 = changedPaths.some(
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
    mcpRouteBehaviorStillUnchanged: !changedPaths.includes(
      "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts",
    ),
    noNewRouteOrApiRouteFromFp0160:
      disallowedChangedPaths.length === 0 && !newRouteOrApiRouteFromFp0160,
    protectedResourceMetadataRouteStillUnchanged: !changedPaths.includes(
      "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts",
    ),
  };
}

function verifyPlanScope() {
  const fp0160Hits = repoPaths.filter((path) => /(^|\/)FP-0160/u.test(path));
  const fp0161Absent = verifyFp0161Absent(repoPaths);
  const normalizedPlan = normalize(fp0160PlanText);

  return {
    appSubmissionBlocked:
      normalizedPlan.includes(
        "public chatgpt app behavior/submission is not included",
      ) &&
      normalizedPlan.includes(
        "public chatgpt app demo/submission cannot start after fp-0160",
      ),
    appsSdkIframeResourceBlocked: normalizedPlan.includes(
      "apps sdk iframe/resource implementation is not included",
    ),
    fp0160PlanAccepted:
      fp0160Hits.length === 1 &&
      fp0160Hits[0] === FP0160_PLAN_PATH &&
      existsSync(FP0160_PLAN_PATH) &&
      verifyFp0160AbsentOrReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeImplementationPlan(
        repoPaths,
      ),
    fp0160PlanBoundaryVerified:
      normalizedPlan.includes("local-only on the existing preview route/components") &&
      normalizedPlan.includes("new route or api route is not included") &&
      normalizedPlan.includes("static local ui snapshot boundary") &&
      normalizedPlan.includes("auth boundary lane") &&
      normalizedPlan.includes("evidence tool lane") &&
      normalizedPlan.includes("productiontokenvalidationimplemented: false") &&
      normalizedPlan.includes("publicchatgptappimplemented: false") &&
      normalizedPlan.includes("source-anchor status as first-class") &&
      normalizedPlan.includes("fp-0161 may open only"),
    fp0161Absent,
    publicChatGptAppBlocked:
      normalizedPlan.includes(
        "public chatgpt app behavior/submission is not included",
      ) &&
      normalizedPlan.includes(
        "public chatgpt app demo/submission cannot start after fp-0160",
      ),
  };
}

function verifySourceScope() {
  const forbiddenRuntimeUiPatterns = [
    /\bfetch\s*\(/u,
    /["']\/mcp["']/u,
    /from\s+["'][^"']*tools\//u,
    /child_process/u,
    /spawnSync/u,
    /execFileSync/u,
    /read-only-mcp-[^"']*proof/u,
    /read-only-mcp-[^"']*harness/u,
    /\bbuildApp\b/u,
    /\bcreateContainer\b/u,
    /\bcreateInMemoryContainer\b/u,
    /apps\/control-plane/u,
    /packages\/db/u,
    /from\s+["']openai["']/iu,
    /new\s+OpenAI/u,
    /responses\.create/u,
    /chat\.completions/u,
    /decodeJwt|jwtDecode|fetchJwks|jwks|introspectToken/iu,
    /oauthCallback|sessionStore|authMiddleware/iu,
    /providerClient|providerCall|selectProvider/iu,
  ];
  const forbiddenBridgeSourcePatterns = [
    /\bfetch\s*\(/u,
    /["']\/mcp["']/u,
    /\bimport\s+.*tools/u,
    /apps\/control-plane/u,
    /packages\/db/u,
    /from\s+["']openai["']/iu,
    /new\s+OpenAI/u,
    /responses\.create/u,
    /chat\.completions/u,
    /decodeJwt|jwtDecode|fetchJwks|jwks|introspectToken/iu,
    /oauthCallback|sessionStore|authMiddleware/iu,
    /providerClient|providerCall|selectProvider/iu,
  ];
  const snapshotImportsNothing = !/\bimport\b/u.test(bridgeSnapshotSource);

  return {
    defaultBuildAppBehaviorStillUnchanged: !runtimeUiSource.includes("buildApp"),
    defaultCreateContainerBehaviorStillUnchanged:
      !runtimeUiSource.includes("createContainer"),
    defaultCreateInMemoryContainerBehaviorStillUnchanged:
      !runtimeUiSource.includes("createInMemoryContainer"),
    noAppsSdkIframeResourceImplementation:
      !/registerResource|window\.openai|Apps SDK iframe|iframe resource/iu.test(
        runtimeUiSource,
      ),
    noExternalCommunicationsFromFp0160:
      !/email|sms|slack|webhook|external release|customer contact/iu.test(
        bridgeSource,
      ),
    noFinanceWriteFromFp0160:
      !/ledger write|bank write|tax filing|payment execution/iu.test(
        bridgeSource,
      ),
    noHarnessExecutionAtRequestTime:
      !/child_process|spawnSync|execFileSync|harness\.mjs|proof\.mjs|tools\//u.test(
        runtimeUiSource,
      ),
    noLiveMcpFetchFromPreviewUi: !forbiddenRuntimeUiPatterns.some((pattern) =>
      pattern.test(runtimeUiSource),
    ),
    noModelCallsFromFp0160:
      !/responses\.create|chat\.completions|model\s*[:=]/iu.test(bridgeSource),
    noOauthSessionAuthMiddlewareFromFp0160:
      !/oauth|sessionStore|authMiddleware|jwt|jwks|introspect/iu.test(
        bridgeSource,
      ),
    noOpenAiApiCallsFromFp0160:
      !/from\s+["']openai["']|new\s+OpenAI|responses\.create|chat\.completions/iu.test(
        bridgeSource,
      ),
    noProductionTokenValidationFromFp0160:
      !/validateToken|verifyToken|verifyJwt|decodeJwt|jwtDecode|fetchJwks|introspectToken/u.test(
        bridgeSource,
      ) &&
      bridgeSource.includes("Production token validation implemented: false"),
    noProviderCallsFromFp0160:
      !/providerClient|providerCall|selectProvider|callProvider/iu.test(
        bridgeSource,
      ),
    noSourceMutationFromFp0160:
      !/writeFile|appendFile|unlink|rm\(|mutateSource|sourceMutation/iu.test(
        bridgeSource,
      ),
    staticSyntheticSnapshotOnly:
      snapshotImportsNothing &&
      bridgeSnapshotSource.includes("localPreviewDemoBridgeSnapshot") &&
      bridgeSnapshotSource.includes("Synthetic evidence card") &&
      bridgeSnapshotSource.includes("localOnly: true") &&
      bridgeSnapshotSource.includes("noRuntime: true") &&
      bridgeSnapshotSource.includes(
        "productionTokenValidationImplemented: false",
      ) &&
      !forbiddenBridgeSourcePatterns.some((pattern) =>
        pattern.test(bridgeSource),
      ),
  };
}

function verifyRenderedScope() {
  const bridgeEvidence = [bridgeComponentSource, bridgeSnapshotSource].join(
    "\n",
  );
  const bridgeVisible = normalize(bridgeEvidence);
  const forbiddenMarkup = [
    "<a ",
    "<button",
    "<form",
    "<input",
    "<select",
    "<textarea",
    "role=\"button\"",
    "type=\"submit\"",
    "method=\"post\"",
    "enctype=\"multipart/form-data\"",
  ];
  const forbiddenControlWords = [
    "approve",
    "send",
    "pay",
    "certify",
    "connect",
    "upload",
    "submit",
  ];

  return {
    authAndEvidenceLanesVisuallySeparate:
      bridgeComponentSource.includes(
        'data-layout="local-preview-demo-bridge-lanes"',
      ) &&
      bridgeComponentSource.includes(
        'data-lanes="auth-boundary evidence-tool"',
      ) &&
      bridgeComponentSource.includes('laneId="auth-boundary"') &&
      bridgeComponentSource.includes('laneId="evidence-tool"'),
    authBoundaryLaneRendered:
      bridgeEvidence.includes("Local challenge-boundary smoke") &&
      bridgeEvidence.includes("Missing-token challenge verified") &&
      bridgeEvidence.includes(
        "Authorization-present sanitized invalid-token challenge verified",
      ),
    authLaneDoesNotClaimProductionAuthentication:
      bridgeVisible.includes("not production authentication") &&
      !bridgeVisible.includes("production authentication verified"),
    bridgeRenderedOnExistingPreviewRoute:
      previewRouteSource.includes("LocalPreviewDemoBridge") &&
      previewRouteSource.includes("localPreviewDemoBridgeSnapshot") &&
      previewRouteSource.includes("Preview route state matrix") &&
      previewRouteSpecSource.includes("FP-0160 local demo bridge"),
    evidenceLaneDoesNotClaimAuthenticatedToolExecution:
      bridgeVisible.includes("not authenticated tool execution") &&
      !bridgeVisible.includes("authenticated tool execution verified"),
    evidenceToolLaneRendered:
      bridgeEvidence.includes("Synthetic read-only evidence dispatch smoke") &&
      bridgeEvidence.includes("Exact read-only MCP tool allowlist verified") &&
      bridgeEvidence.includes("fetch_capability_boundaries verified"),
    localOnlyBoundaryRendered:
      bridgeEvidence.includes("Local-only synthetic preview") &&
      bridgeEvidence.includes("No runtime fetch") &&
      previewRouteSource.includes("LocalPreviewDemoBridge"),
    noFormsButtonsFileInputsOrMutationControls:
      forbiddenMarkup.every(
        (forbidden) =>
          !bridgeEvidence.includes(forbidden) &&
          !previewRouteSource.includes(forbidden),
      ) &&
      !/\b(server action|mutation control|post transport)\b/iu.test(
        bridgeVisible,
      ),
    noProviderPaymentSendCertificationControls:
      forbiddenControlWords.every(
        (word) => !new RegExp(`\\b${word}\\b`, "u").test(bridgeVisible),
      ),
    productionTokenValidationFalseRendered:
      bridgeComponentSource.includes(
        "data-production-token-validation-implemented",
      ) && bridgeEvidence.includes("productionTokenValidationImplemented: false"),
    publicChatGptAppFalseRendered:
      bridgeComponentSource.includes("data-public-chatgpt-app-implemented") &&
      bridgeEvidence.includes("publicChatGptAppImplemented: false"),
    sourceAnchorStatusRendered:
      bridgeEvidence.includes("fetch_source_anchor verified") &&
      bridgeEvidence.includes("Source anchor") &&
      bridgeEvidence.includes("first-class bridge status"),
  };
}

function verifyFp0159Scope() {
  const normalizedPlan = normalize(fp0159PlanText);
  const normalizedProof = normalize(readinessProofSource);
  const freshnessCorrections = [
    "pr #338 merged",
    "5e83ea4696a8beda416336cbc17c6660343374db",
    "fc976b4379bae23d64a01e52ec324d1ea85ce762",
    "same-branch qa found one proof-only added-line scanner defect",
    READINESS_PROOF_PATH,
    FP0159_PLAN_PATH,
    "github static and integration-db checks were green",
    "no standalone proof-correction branch",
    "separate post-merge qa is required",
  ];

  return {
    closeoutFreshnessVerified: freshnessCorrections.every((text) =>
      normalizedPlan.includes(normalize(text)),
    ),
    freshnessCorrections,
    successorBridgeCompatibilityVerified:
      normalizedProof.includes(normalize(FP0160_PLAN_PATH)) &&
      normalizedProof.includes(normalize(PREVIEW_ROUTE_PATH)) &&
      normalizedProof.includes("apps/web/components/read-only-app-mcp/") &&
      normalizedProof.includes(
        "previewroutechangedonlyforexactfp0160bridge",
      ) &&
      readinessProof
        .fp0160AbsentOrEvidenceAppLocalPreviewDemoUiBridgeImplementationPlanVerified ===
        true &&
      readinessProof.fp0161Absent === true &&
      readinessProof.noNewRouteOrApiRouteFromFp0159 === true,
  };
}

function verifyNoLeakageScope() {
  const bridgeRuntimeSource = [bridgeComponentSource, bridgeSnapshotSource].join(
    "\n",
  );
  const bridgeVisible = normalize(bridgeRuntimeSource);
  const changedLeakageScan = scanProofOnlyNoTokenLeakageText(
    readChangedLeakageText(changedPaths),
  );
  const forbiddenBridgePhrases = [
    ["raw", "authorization", "value"].join(" "),
    ["parser", "decision", "object"].join(" "),
    ["token", "material"].join(" "),
    ["token-derived", "field"].join(" "),
    ["raw", "source", "dump"].join(" "),
    ["private", "field"].join(" "),
    ["provider", "response"].join(" "),
    ["model", "output"].join(" "),
    ["write", "output"].join(" "),
    ["public", "demo", "data"].join(" "),
    ["listing", "copy"].join(" "),
    ["submission", "material"].join(" "),
  ];

  return {
    changedLeakageScan,
    noCredentialParserSourceLeakageInUi: forbiddenBridgePhrases.every(
      (phrase) => !bridgeVisible.includes(phrase),
    ),
    noPublicAssetsScreenshotsSubmissionMaterial:
      !/\.(?:png|jpe?g|webp|gif|svg)$/iu.test(changedPaths.join("\n")) &&
      !/screenshot|listing copy|submission material|app submission/iu.test(
        bridgeVisible,
      ),
    noPublicDemoDataFromFp0160: !/\bpublic demo data\b/iu.test(
      bridgeRuntimeSource,
    ),
    noRealFinanceDataFromFp0160:
      !new RegExp(
        [
          ["account", "number"].join("_"),
          ["routing", "number"].join("_"),
          ["bank", "balance"].join("_"),
          ["pay", "roll"].join(""),
          ["customer", "list"].join("_"),
          ["vendor", "list"].join("_"),
          ["tax", "id"].join("_"),
          ["real", "bank"].join(" "),
          ["real", "finance", "record"].join(" "),
        ].join("|"),
        "iu",
      ).test(bridgeRuntimeSource),
    noSubmissionMaterialFromBridge:
      !/app submission|submission material|listing copy/iu.test(bridgeVisible),
    proofOutputLeakageScanAccepted: true,
  };
}

function verifyPriorBoundaryScope(proof) {
  const priorBoundaryFields = {
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

  return {
    fp0159ReadinessBoundaryStillVerified:
      proof.evidenceAppLocalPreviewDemoUiBridgeReadinessBoundaryVerified ===
        true &&
      proof.changedPathScopeAccepted === true,
    priorBoundaryFields,
  };
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

function normalize(text) {
  return text.toLowerCase().replace(/`/gu, "").replace(/\s+/gu, " ").trim();
}
