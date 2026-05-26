/* global console */

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  scanProofOnlyNoTokenLeakageText,
  verifyFp0161AbsentOrReadOnlyMcpEvidenceAppLocalPreviewDemoVisualQaAccessibilityPlan,
  verifyFp0162AbsentOrReadOnlyMcpLocalAppsSdkResourceReadinessPlan,
  verifyFp0163AbsentOrReadOnlyMcpLocalAppsSdkResourceSkeletonPlan,
  verifyFp0164AbsentOrReadOnlyMcpLocalAppsSdkResourceRegistrationPlan,
  verifyFp0165Absent,
} from "../packages/domain/src/index.ts";

const SCHEMA_VERSION =
  "v2cc.read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-visual-qa-accessibility-proof.v1";

const FP0160_PLAN_PATH =
  "plans/FP-0160-read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge-implementation.md";
const FP0161_PLAN_PATH =
  "plans/FP-0161-read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-visual-qa-accessibility.md";
const FP0160_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-implementation-proof.mjs";
const FP0159_PROOF_PATH =
  "tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs";
const FP0162_PLAN_PATH =
  "plans/FP-0162-read-only-chatgpt-app-mcp-local-apps-sdk-resource-readiness.md";
const FP0163_PLAN_PATH =
  "plans/FP-0163-read-only-chatgpt-app-mcp-local-apps-sdk-resource-skeleton.md";
const FP0164_PLAN_PATH =
  "plans/FP-0164-read-only-chatgpt-app-mcp-local-apps-sdk-resource-registration.md";
const FP0162_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-readiness-proof.mjs";
const FP0163_PROOF_PATH =
  "tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs";
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
const BRIDGE_STYLES_PATH =
  "apps/web/components/read-only-app-mcp/styles.ts";
const BRIDGE_UI_PATH = "apps/web/components/read-only-app-mcp/ui.tsx";
const BRIDGE_INDEX_PATH = "apps/web/components/read-only-app-mcp/index.ts";

const allowedChangedPaths = new Set([
  "README.md",
  "CODEX_README.md",
  "START_HERE.md",
  "docs/ACTIVE_DOCS.md",
  "docs/PROJECT_STATE.md",
  "docs/V2_BOUNDARY.md",
  "plans/ROADMAP.md",
  "plugins.md",
  FP0160_PLAN_PATH,
  FP0161_PLAN_PATH,
  PREVIEW_ROUTE_PATH,
  PREVIEW_ROUTE_SPEC_PATH,
  BRIDGE_COMPONENT_PATH,
  BRIDGE_SNAPSHOT_PATH,
  BRIDGE_SPEC_PATH,
  BRIDGE_STYLES_PATH,
  BRIDGE_UI_PATH,
  BRIDGE_INDEX_PATH,
  FP0160_PROOF_PATH,
  FP0159_PROOF_PATH,
  "tools/read-only-mcp-invalid-token-app-wiring-proof.mjs",
  "tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs",
  "tools/read-only-mcp-default-local-evidence-dispatch-proof.mjs",
  "tools/read-only-mcp-evidence-tool-dispatch-proof.mjs",
  "tools/read-only-mcp-protected-resource-metadata-local-route-proof.mjs",
  "tools/read-only-mcp-protocol-envelope-proof.mjs",
  "tools/read-only-mcp-route-adapter-proof.mjs",
  "tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs",
  "tools/read-only-endpoint-architecture-proof.mjs",
  "tools/read-only-endpoint-route-ownership-proof.mjs",
  "tools/read-only-public-app-security-boundary-proof.mjs",
  "tools/read-only-chatgpt-app-mcp-proof.mjs",
  "tools/benchmark-community-pack-proof.mjs",
  "packages/domain/src/benchmark-community.spec.ts",
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts",
  "packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts",
  "packages/domain/src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.ts",
  "packages/domain/src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.spec.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.spec.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts",
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime.ts",
  "packages/domain/src/read-only-app-mcp-oauth-implementation-sequencing-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input-inventory.ts",
  "packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input-inventory-rules.ts",
  "packages/domain/src/read-only-app-mcp-token-validation-inventory.ts",
  "packages/domain/src/index.ts",
  "tools/read-only-mcp-evidence-app-local-preview-demo-visual-qa-accessibility-proof.mjs",
  FP0162_PROOF_PATH,
  FP0163_PROOF_PATH,
  FP0162_PLAN_PATH,
  FP0163_PLAN_PATH,
  FP0164_PLAN_PATH,
  "tools/read-only-mcp-local-apps-sdk-resource-registration-proof.mjs",
]);

const repoPaths = repoFilePaths();
const changedPathScope = changedFilePathScope();
const changedPaths = changedPathScope.combinedChangedPaths;
const fp0160PlanText = safeRead(FP0160_PLAN_PATH);
const fp0161PlanText = safeRead(FP0161_PLAN_PATH);
const previewRouteSource = safeRead(PREVIEW_ROUTE_PATH);
const previewRouteSpecSource = safeRead(PREVIEW_ROUTE_SPEC_PATH);
const bridgeComponentSource = safeRead(BRIDGE_COMPONENT_PATH);
const bridgeSnapshotSource = safeRead(BRIDGE_SNAPSHOT_PATH);
const bridgeSpecSource = safeRead(BRIDGE_SPEC_PATH);
const stylesSource = safeRead(BRIDGE_STYLES_PATH);
const uiSource = safeRead(BRIDGE_UI_PATH);
const runtimeUiSource = [
  previewRouteSource,
  bridgeComponentSource,
  bridgeSnapshotSource,
  uiSource,
].join("\n");
const specSource = [previewRouteSpecSource, bridgeSpecSource].join("\n");
const fp0160Proof = runJsonTool(FP0160_PROOF_PATH);
const fp0159Proof = runJsonTool(FP0159_PROOF_PATH);
const pathScope = verifyPathScope();
const planScope = verifyPlanScope();
const sourceScope = verifySourceScope();
const accessibilityScope = verifyAccessibilityScope();
const copyScope = verifyCopyScope();
const contrastScope = verifyContrastScope();
const noLeakageScope = verifyNoLeakageScope();
const priorBoundaryScope = verifyPriorBoundaryScope();

const output = {
  schemaVersion: SCHEMA_VERSION,
  fp0161AbsentOrLocalPreviewDemoVisualQaAccessibilityPlanVerified:
    planScope.fp0161PlanAccepted,
  fp0162AbsentOrLocalAppsSdkResourceReadinessPlanVerified:
    planScope.fp0162PlanAccepted,
  fp0163AbsentOrLocalAppsSdkResourceSkeletonPlanVerified:
    planScope.fp0163PlanAccepted,
  fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified:
    planScope.fp0164PlanAccepted,
  fp0165Absent: planScope.fp0165Absent,
  localPreviewDemoVisualQaAccessibilityBoundaryVerified:
    planScope.visualQaAccessibilityOnly &&
    accessibilityScope.bridgeSectionLabelledByStableHeading &&
    contrastScope.contrastRatiosVerified,
  appsSdkResourceReadinessStillBlocked: planScope.appsSdkResourceReadinessBlocked,
  appsSdkIframeResourceStillBlocked: planScope.appsSdkIframeResourceBlocked,
  noNewRouteOrApiRouteFromFp0161: pathScope.noNewRouteOrApiRouteFromFp0161,
  existingPreviewRouteStillLocalOnly: sourceScope.existingPreviewRouteStillLocalOnly,
  staticSyntheticSnapshotStillUsed: sourceScope.staticSyntheticSnapshotStillUsed,
  noLiveMcpFetchFromPreviewUi: sourceScope.noLiveMcpFetchFromPreviewUi,
  noHarnessExecutionAtRequestTime: sourceScope.noHarnessExecutionAtRequestTime,
  authBoundaryLaneStillRendered: accessibilityScope.authBoundaryLaneStillRendered,
  evidenceToolLaneStillRendered: accessibilityScope.evidenceToolLaneStillRendered,
  authAndEvidenceLanesStillSeparate:
    accessibilityScope.authAndEvidenceLanesStillSeparate,
  sourceAnchorStatusStillRendered: sourceScope.sourceAnchorStatusStillRendered,
  productionTokenValidationFalseStillRendered:
    sourceScope.productionTokenValidationFalseStillRendered,
  publicChatGptAppFalseStillRendered:
    sourceScope.publicChatGptAppFalseStillRendered,
  publicSubmissionBlockedCopyVerified: copyScope.publicSubmissionBlockedCopyVerified,
  bridgeSectionLabelledByStableHeading:
    accessibilityScope.bridgeSectionLabelledByStableHeading,
  bridgeLaneLabelsStable: accessibilityScope.bridgeLaneLabelsStable,
  bridgeStatusRowsAccessible: accessibilityScope.bridgeStatusRowsAccessible,
  bridgeStatusRowsNotColorOnly: accessibilityScope.bridgeStatusRowsNotColorOnly,
  bridgeBoundaryBadgesAccessible:
    accessibilityScope.bridgeBoundaryBadgesAccessible,
  headingHierarchyStillCoherent: accessibilityScope.headingHierarchyStillCoherent,
  exactlyOnePageH1StillRendered: accessibilityScope.exactlyOnePageH1StillRendered,
  noFormsButtonsFileInputsOrMutationControls:
    sourceScope.noFormsButtonsFileInputsOrMutationControls,
  noProviderPaymentSendCertificationControls:
    sourceScope.noProviderPaymentSendCertificationControls,
  noPublicAssetsScreenshotsSubmissionMaterial:
    noLeakageScope.noPublicAssetsScreenshotsSubmissionMaterial,
  contrastRatiosVerified: contrastScope.contrastRatiosVerified,
  badgeContrastFreshVerified: contrastScope.badgeContrastFreshVerified,
  badgeContrastProofVerified: contrastScope.badgeContrastProofVerified,
  badgeContrastWarningVerified: contrastScope.badgeContrastWarningVerified,
  badgeContrastDangerVerified: contrastScope.badgeContrastDangerVerified,
  noCredentialParserSourceLeakageInUi:
    noLeakageScope.noCredentialParserSourceLeakageInUi,
  noRealFinanceDataFromFp0161: noLeakageScope.noRealFinanceDataFromFp0161,
  noPublicDemoDataFromFp0161: noLeakageScope.noPublicDemoDataFromFp0161,
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
  noProductionTokenValidationFromFp0161:
    sourceScope.noProductionTokenValidationFromFp0161,
  noOauthSessionAuthMiddlewareFromFp0161:
    sourceScope.noOauthSessionAuthMiddlewareFromFp0161,
  noProviderCallsFromFp0161: sourceScope.noProviderCallsFromFp0161,
  noOpenAiApiCallsFromFp0161: sourceScope.noOpenAiApiCallsFromFp0161,
  noModelCallsFromFp0161: sourceScope.noModelCallsFromFp0161,
  noSourceMutationFromFp0161: sourceScope.noSourceMutationFromFp0161,
  noFinanceWriteFromFp0161: sourceScope.noFinanceWriteFromFp0161,
  noExternalCommunicationsFromFp0161:
    sourceScope.noExternalCommunicationsFromFp0161,
  fp0160CloseoutFreshnessVerified: planScope.fp0160CloseoutFreshnessVerified,
  ...priorBoundaryScope,
  proofDetails: {
    changedPathScope,
    contrastRatios: contrastScope.ratios,
    disallowedChangedPaths: pathScope.disallowedChangedPaths,
  },
};

const proofOutputLeakageScan = scanProofOnlyNoTokenLeakageText(
  JSON.stringify(output),
);
output.noCredentialParserSourceLeakageInUi =
  output.noCredentialParserSourceLeakageInUi &&
  proofOutputLeakageScan.accepted;

for (const [key, value] of Object.entries(output)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(
      `FP-0161 local preview/demo visual QA accessibility proof failed: ${key}`,
    );
  }
}

console.log(JSON.stringify(output, null, 2));

function verifyPathScope() {
  const disallowedChangedPaths = changedPaths.filter(
    (path) =>
      !allowedChangedPaths.has(path) &&
      !path.startsWith("apps/web/components/read-only-app-mcp/"),
  );
  const newRouteOrApiRouteFromFp0161 = changedPaths.some(
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
    noNewRouteOrApiRouteFromFp0161:
      disallowedChangedPaths.length === 0 && !newRouteOrApiRouteFromFp0161,
  };
}

function verifyPlanScope() {
  const normalizedPlan = normalize(fp0161PlanText);
  const normalizedFp0160Plan = normalize(fp0160PlanText);
  const fp0161Hits = repoPaths.filter((path) => /(^|\/)FP-0161/u.test(path));

  return {
    appsSdkIframeResourceBlocked: includesAll(normalizedPlan, [
      "apps sdk iframe/resource implementation is not included",
      "apps sdk resource readiness planning is not included",
    ]),
    appsSdkResourceReadinessBlocked: includesAll(normalizedPlan, [
      "local apps sdk resource readiness planning is not included",
      "may open later as fp-0162 planning-only",
    ]),
    fp0160CloseoutFreshnessVerified: includesAll(normalizedFp0160Plan, [
      "pr #339 merged",
      "1c903f3b7d8283ae41a3494fb732145ff08d6804",
      "c9ea5a16ad0004ed495abc830e04e7e530394935",
      "same-branch qa found one proof-gate compatibility defect only",
      "tools/read-only-mcp-invalid-token-app-wiring-proof.mjs",
      "tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs",
      "github static and integration-db checks were green",
      "no standalone post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
    ]),
    fp0161PlanAccepted:
      fp0161Hits.length === 1 &&
      fp0161Hits[0] === FP0161_PLAN_PATH &&
      existsSync(FP0161_PLAN_PATH) &&
      verifyFp0161AbsentOrReadOnlyMcpEvidenceAppLocalPreviewDemoVisualQaAccessibilityPlan(
        repoPaths,
      ),
    fp0162PlanAccepted:
      verifyFp0162AbsentOrReadOnlyMcpLocalAppsSdkResourceReadinessPlan(
        repoPaths,
      ),
    fp0163PlanAccepted:
      verifyFp0163AbsentOrReadOnlyMcpLocalAppsSdkResourceSkeletonPlan(repoPaths),
    fp0164PlanAccepted:
      verifyFp0164AbsentOrReadOnlyMcpLocalAppsSdkResourceRegistrationPlan(
        repoPaths,
      ),
    fp0165Absent: verifyFp0165Absent(repoPaths),
    visualQaAccessibilityOnly: includesAll(normalizedPlan, [
      "visual qa/accessibility hardening is included",
      "local-only and screenshotless",
      "a new route or api route is not included",
      "screenshots, images, and public assets are not included",
      "public chatgpt app behavior/submission is not included",
      "production token-validation runtime cannot start after fp-0161",
      "provider selection cannot start after fp-0161",
      "oauth/session/auth middleware cannot start after fp-0161",
      "public chatgpt app demo/submission cannot start after fp-0161",
    ]),
  };
}

function verifySourceScope() {
  const forbiddenRuntimePatterns = [
    /\bfetch\s*\(/u,
    /["']\/mcp["']/u,
    /from\s+["'][^"']*tools\//u,
    /child_process|spawnSync|execFileSync/u,
    /read-only-mcp-[^"']*proof/u,
    /read-only-mcp-[^"']*harness/u,
    /\bbuildApp\b/u,
    /\bcreateContainer\b/u,
    /\bcreateInMemoryContainer\b/u,
    /apps\/control-plane/u,
    /packages\/db/u,
    /from\s+["']openai["']/iu,
    /new\s+OpenAI|responses\.create|chat\.completions/iu,
    /decodeJwt|jwtDecode|fetchJwks|jwks|introspectToken/iu,
    /oauthCallback|sessionStore|authMiddleware/iu,
    /providerClient|providerCall|selectProvider/iu,
  ];
  const visibleRuntime = normalize(runtimeUiSource);

  return {
    defaultAuthAdapterWiringStillBlocked: !changedPaths.some((path) =>
      path.startsWith("apps/control-plane/"),
    ),
    defaultBuildAppBehaviorStillUnchanged: !changedPaths.includes(
      "apps/control-plane/src/app.ts",
    ),
    defaultCreateContainerBehaviorStillUnchanged: !changedPaths.includes(
      "apps/control-plane/src/container.ts",
    ),
    defaultCreateInMemoryContainerBehaviorStillUnchanged:
      !changedPaths.includes("apps/control-plane/src/container.ts"),
    defaultEvidenceDispatchWiringStillBlocked: !changedPaths.some((path) =>
      path.startsWith("apps/control-plane/"),
    ),
    existingPreviewRouteStillLocalOnly:
      previewRouteSource.includes("robots") &&
      previewRouteSource.includes("noarchive") &&
      previewRouteSource.includes("localPreviewDemoBridgeSnapshot"),
    mcpRouteBehaviorStillUnchanged: !changedPaths.includes(
      "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts",
    ),
    noExternalCommunicationsFromFp0161:
      !/email|slack|webhook|sendReport|publish|externalCommunication/iu.test(
        runtimeUiSource,
      ),
    noFinanceWriteFromFp0161:
      !/financeWrite|ledgerWrite|executePayment|createPayment|updateLedger|writeResult/iu.test(
        runtimeUiSource,
      ),
    noFormsButtonsFileInputsOrMutationControls:
      !/<(a|button|form|input|select|textarea)\b/iu.test(runtimeUiSource) &&
      !/role=["']button["']|type=["']submit["']|use server/iu.test(
        runtimeUiSource,
      ),
    noHarnessExecutionAtRequestTime: forbiddenRuntimePatterns.every(
      (pattern) => !pattern.test(runtimeUiSource),
    ),
    noLiveMcpFetchFromPreviewUi:
      !/\bfetch\s*\(/u.test(runtimeUiSource) &&
      !/["']\/mcp["']/u.test(runtimeUiSource),
    noModelCallsFromFp0161:
      !/responses\.create|chat\.completions|model output/iu.test(
        runtimeUiSource,
      ),
    noOauthSessionAuthMiddlewareFromFp0161:
      !/authMiddleware|decodeJwt|jwtDecode|fetchJwks|introspectToken|oauthCallback|sessionStore|createSession|setCookie/iu.test(
        runtimeUiSource,
      ),
    noOpenAiApiCallsFromFp0161:
      !new RegExp(
        [
          "from\\s+[\"']openai[\"']",
          "new\\s+OpenAI",
          ["OPENAI", "API", "KEY"].join("_"),
        ].join("|"),
        "iu",
      ).test(runtimeUiSource),
    noProductionTokenValidationFromFp0161:
      visibleRuntime.includes("productiontokenvalidationimplemented: false") &&
      !/validateToken|verifyToken|productionTokenValidationImplemented:\s*true/u.test(
        runtimeUiSource,
      ),
    noProviderCallsFromFp0161:
      !/providerClient|providerCall|selectProvider|provider response/iu.test(
        runtimeUiSource,
      ),
    noProviderPaymentSendCertificationControls:
      !/provider control|payment control|send control|report control|certification control|approve control|submit control|connect provider|make payment|send report|submit app/iu.test(
        runtimeUiSource,
      ),
    noSourceMutationFromFp0161:
      !new RegExp(
        [
          "sourceMutation",
          "rewrite source",
          "mutate source",
          ["raw", "source", "dump"].join(" "),
        ].join("|"),
        "iu",
      ).test(runtimeUiSource),
    productionTokenValidationFalseStillRendered:
      bridgeSnapshotSource.includes("productionTokenValidationImplemented: false") &&
      bridgeComponentSource.includes(
        "data-production-token-validation-implemented",
      ),
    protectedResourceMetadataRouteStillUnchanged: !changedPaths.includes(
      "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts",
    ),
    publicChatGptAppFalseStillRendered:
      bridgeSnapshotSource.includes("publicChatGptAppImplemented: false") &&
      bridgeComponentSource.includes("data-public-chatgpt-app-implemented"),
    sourceAnchorStatusStillRendered:
      bridgeSnapshotSource.includes("fetch_source_anchor verified") &&
      bridgeSnapshotSource.includes("first-class bridge status"),
    staticSyntheticSnapshotStillUsed:
      previewRouteSource.includes("localPreviewDemoBridgeSnapshot") &&
      bridgeSnapshotSource.includes("localPreviewDemoBridgeSnapshot") &&
      bridgeSnapshotSource.includes("Synthetic source-anchor status"),
  };
}

function verifyAccessibilityScope() {
  return {
    authAndEvidenceLanesStillSeparate:
      bridgeComponentSource.includes('data-lanes="auth-boundary evidence-tool"') &&
      bridgeComponentSource.includes('laneId="auth-boundary"') &&
      bridgeComponentSource.includes('laneId="evidence-tool"'),
    authBoundaryLaneStillRendered:
      bridgeSnapshotSource.includes("Local challenge-boundary smoke") &&
      bridgeSnapshotSource.includes("not production authentication"),
    bridgeBoundaryBadgesAccessible:
      bridgeComponentSource.includes("data-boundary-badge") &&
      bridgeComponentSource.includes("data-status-outcome") &&
      bridgeSpecSource.includes("No public ChatGPT App submission"),
    bridgeLaneLabelsStable:
      bridgeComponentSource.includes("data-lane-label") &&
      bridgeComponentSource.includes("local-preview-demo-bridge-${laneId}-title") &&
      bridgeSpecSource.includes('data-lane-label="Auth boundary lane"') &&
      bridgeSpecSource.includes('data-lane-label="Evidence tool lane"'),
    bridgeSectionLabelledByStableHeading:
      bridgeComponentSource.includes(
        'aria-labelledby="local-preview-demo-bridge-title"',
      ) &&
      bridgeComponentSource.includes('id="local-preview-demo-bridge-title"'),
    bridgeStatusRowsAccessible:
      bridgeComponentSource.includes("data-status-label") &&
      bridgeComponentSource.includes("data-status-id") &&
      bridgeComponentSource.includes("aria-label={`${status.label}. Status"),
    bridgeStatusRowsNotColorOnly:
      bridgeComponentSource.includes("data-status-tone") &&
      bridgeComponentSource.includes("data-status-outcome") &&
      bridgeSpecSource.includes("non-color-only status posture"),
    evidenceToolLaneStillRendered:
      bridgeSnapshotSource.includes(
        "Synthetic read-only evidence dispatch smoke",
      ) &&
      bridgeSnapshotSource.includes("not authenticated tool execution"),
    exactlyOnePageH1StillRendered:
      previewRouteSpecSource.includes(
        "headings.filter((heading) => heading.level === 1)",
      ) && previewRouteSpecSource.includes("toHaveLength(1)"),
    headingHierarchyStillCoherent:
      previewRouteSpecSource.includes("headings[index]?.level") &&
      previewRouteSpecSource.includes("toBeLessThanOrEqual"),
  };
}

function verifyCopyScope() {
  const normalizedBridgeSource = normalize(bridgeSnapshotSource);
  const normalizedSpecs = normalize(specSource);

  return {
    publicSubmissionBlockedCopyVerified:
      normalizedBridgeSource.includes("no public chatgpt app submission") &&
      !normalizedBridgeSource.includes("no public chatgpt app release") &&
      normalizedSpecs.includes("no public chatgpt app submission") &&
      !normalizedBridgeSource.includes("publicchatgptappimplemented: true"),
  };
}

function verifyContrastScope() {
  const colors = readColors(stylesSource);
  const pairs = {
    bodyOnPanel: [colors.muted, colors.panel],
    bodyOnSoft: [colors.muted, colors.soft],
    danger: [colors.danger, colors.dangerSoft],
    fresh: [colors.fresh, colors.freshSoft],
    proof: [colors.proof, colors.proofSoft],
    warning: [colors.warning, colors.warningSoft],
  };
  const ratios = Object.fromEntries(
    Object.entries(pairs).map(([name, [text, background]]) => [
      name,
      roundContrast(contrastRatio(text, background)),
    ]),
  );
  const ratioPasses = (name) => ratios[name] >= 4.5;

  return {
    badgeContrastDangerVerified: ratioPasses("danger"),
    badgeContrastFreshVerified: ratioPasses("fresh"),
    badgeContrastProofVerified: ratioPasses("proof"),
    badgeContrastWarningVerified: ratioPasses("warning"),
    contrastRatiosVerified:
      ratioPasses("bodyOnPanel") &&
      ratioPasses("bodyOnSoft") &&
      ratioPasses("danger") &&
      ratioPasses("fresh") &&
      ratioPasses("proof") &&
      ratioPasses("warning"),
    ratios,
  };
}

function verifyNoLeakageScope() {
  const changedText = readChangedLeakageText(changedPaths);
  const changedLeakageScan = scanProofOnlyNoTokenLeakageText(changedText);
  const runtimeLeakageScan = scanProofOnlyNoTokenLeakageText(runtimeUiSource);
  const normalizedRuntime = normalize(runtimeUiSource);
  const runtimeWithoutScreenshotlessLabel = runtimeUiSource.replace(
    /screenshotless/giu,
    "",
  );
  const publicAssetPattern =
    /\.(png|jpe?g|webp|gif|svg)$/iu;

  return {
    noCredentialParserSourceLeakageInUi:
      changedLeakageScan.accepted &&
      runtimeLeakageScan.accepted &&
      !includesAny(normalizedRuntime, [
        "raw authorization value",
        "parser decision object",
        "token material",
        "token-derived field",
        ["raw", "source", "dump"].join(" "),
        "private field",
        "source body text",
      ]),
    noPublicAssetsScreenshotsSubmissionMaterial:
      !changedPaths.some((path) => publicAssetPattern.test(path)) &&
      !/<img|<picture|next\/image|screenshot|listing copy|submission material/iu.test(
        runtimeWithoutScreenshotlessLabel,
      ),
    noPublicDemoDataFromFp0161:
      !/public demo data|sample company data|source pack/iu.test(
        runtimeUiSource,
      ),
    noRealFinanceDataFromFp0161:
      !/real finance record|real bank|customer list|vendor list|payroll/iu.test(
        runtimeUiSource,
      ),
  };
}

function verifyPriorBoundaryScope() {
  return {
    fp0160LocalPreviewDemoUiBridgeBoundaryStillVerified:
      fp0160Proof
        .evidenceAppLocalPreviewDemoUiBridgeImplementationBoundaryVerified ===
        true &&
      fp0160Proof.existingPreviewRouteBridgeImplemented === true,
    fp0159ReadinessBoundaryStillVerified:
      fp0160Proof.fp0159ReadinessBoundaryStillVerified === true &&
      fp0159Proof.evidenceAppLocalPreviewDemoUiBridgeReadinessBoundaryVerified ===
        true,
    fp0158LocalEvidenceDemoBridgeBoundaryStillVerified:
      fp0160Proof.fp0158LocalEvidenceDemoBridgeBoundaryStillVerified === true,
    fp0157LocalAuthDemoHarnessBoundaryStillVerified:
      fp0160Proof.fp0157LocalAuthDemoHarnessBoundaryStillVerified === true,
    fp0156AppConstructionInjectionBoundaryStillVerified:
      fp0160Proof.fp0156AppConstructionInjectionBoundaryStillVerified === true,
    fp0155LocalAdapterImplementationBoundaryStillVerified:
      fp0160Proof.fp0155LocalAdapterImplementationBoundaryStillVerified === true,
    fp0154LocalAdapterReadinessBoundaryStillVerified:
      fp0160Proof.fp0154LocalAdapterReadinessBoundaryStillVerified === true,
    fp0153AppConstructionWiringBoundaryStillVerified:
      fp0160Proof.fp0153AppConstructionWiringBoundaryStillVerified === true,
    fp0152RouteIntegrationBoundaryStillVerified:
      fp0160Proof.fp0152RouteIntegrationBoundaryStillVerified === true,
    fp0151RouteReadinessBoundaryStillVerified:
      fp0160Proof.fp0151RouteReadinessBoundaryStillVerified === true,
    fp0150RouteIntegrationSequencingBoundaryStillVerified:
      fp0160Proof.fp0150RouteIntegrationSequencingBoundaryStillVerified === true,
    fp0149ParserImplementationBoundaryStillVerified:
      fp0160Proof.fp0149ParserImplementationBoundaryStillVerified === true,
    fp0148ReadinessBoundaryStillVerified:
      fp0160Proof.fp0148ReadinessBoundaryStillVerified === true,
    fp0147ProviderSelectionEvidenceBoundaryStillVerified:
      fp0160Proof.fp0147ProviderSelectionEvidenceBoundaryStillVerified === true,
    fp0146ParserContractsBoundaryStillVerified:
      fp0160Proof.fp0146ParserContractsBoundaryStillVerified === true,
    fp0145RuntimeContractsBoundaryStillVerified:
      fp0160Proof.fp0145RuntimeContractsBoundaryStillVerified === true,
    fp0144ProductionTokenValidationSequencingBoundaryStillVerified:
      fp0160Proof
        .fp0144ProductionTokenValidationSequencingBoundaryStillVerified === true,
    fp0143InvalidTokenAppWiringBoundaryStillVerified:
      fp0160Proof.fp0143InvalidTokenAppWiringBoundaryStillVerified === true,
    fp0142RouteIntegrationSequencingBoundaryStillVerified:
      fp0160Proof.fp0142RouteIntegrationSequencingBoundaryStillVerified === true,
    fp0141InvalidTokenLocalRuntimeBoundaryStillVerified:
      fp0160Proof.fp0141InvalidTokenLocalRuntimeBoundaryStillVerified === true,
    fp0139ResultEnvelopeBoundaryStillVerified:
      fp0160Proof.fp0139ResultEnvelopeBoundaryStillVerified === true,
    fp0130MissingTokenChallengeBoundaryStillVerified:
      fp0160Proof.fp0130MissingTokenChallengeBoundaryStillVerified === true,
    fp0125ProtectedResourceMetadataRouteBoundaryStillVerified:
      fp0160Proof.fp0125ProtectedResourceMetadataRouteBoundaryStillVerified ===
      true,
    fp0109EvidenceDispatchAdapterBoundaryStillVerified:
      fp0160Proof.fp0109EvidenceDispatchAdapterBoundaryStillVerified === true,
    fp0108EvidenceDispatchContractBoundaryStillVerified:
      fp0160Proof.fp0108EvidenceDispatchContractBoundaryStillVerified === true,
    fp0097PreviewVisualQaBoundaryStillVerified:
      fp0160Proof.fp0097PreviewVisualQaBoundaryStillVerified === true,
    fp0096PreviewStateMatrixBoundaryStillVerified:
      fp0160Proof.fp0096PreviewStateMatrixBoundaryStillVerified === true,
    fp0094PreviewRouteBoundaryStillVerified:
      fp0160Proof.fp0094PreviewRouteBoundaryStillVerified === true,
    fp0086BenchmarkCommunityBoundaryStillVerified:
      fp0160Proof.fp0086BenchmarkCommunityBoundaryStillVerified === true,
    fp0085BoundedOrchestrationBoundaryStillVerified:
      fp0160Proof.fp0085BoundedOrchestrationBoundaryStillVerified === true,
    fp0082EvidenceAppAlphaBoundaryStillVerified:
      fp0160Proof.fp0082EvidenceAppAlphaBoundaryStillVerified === true,
    fp0081DocumentPrecisionBoundaryStillVerified:
      fp0160Proof.fp0081DocumentPrecisionBoundaryStillVerified === true,
    fp0080EvidenceIndexBoundaryStillVerified:
      fp0160Proof.fp0080EvidenceIndexBoundaryStillVerified === true,
    fp0107RouteAdapterBoundaryStillVerified:
      fp0160Proof.fp0107RouteAdapterBoundaryStillVerified === true,
    fp0106ProtocolEnvelopeBoundaryStillVerified:
      fp0160Proof.fp0106ProtocolEnvelopeBoundaryStillVerified === true,
    fp0100PublicSecurityBoundaryStillVerified:
      fp0160Proof.fp0100PublicSecurityBoundaryStillVerified === true,
  };
}

function readColors(source) {
  const colors = Object.fromEntries(
    [...source.matchAll(/^\s*([a-zA-Z]+):\s*"(#[0-9a-fA-F]{6})"/gmu)].map(
      ([, name, value]) => [name, value],
    ),
  );
  for (const name of [
    "danger",
    "dangerSoft",
    "fresh",
    "freshSoft",
    "muted",
    "panel",
    "proof",
    "proofSoft",
    "soft",
    "warning",
    "warningSoft",
  ]) {
    if (!colors[name]) {
      throw new Error(`Missing color token for contrast proof: ${name}`);
    }
  }
  return colors;
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(hexColor) {
  const [red, green, blue] = hexToRgb(hexColor).map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.03928
      ? srgb / 12.92
      : ((srgb + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function hexToRgb(hexColor) {
  const value = Number.parseInt(hexColor.slice(1), 16);

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function roundContrast(value) {
  return Math.round(value * 100) / 100;
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
    throw new Error(
      `git ${args.join(" ")} failed: ${result.stderr || result.stdout}`,
    );
  }

  return result.stdout.split("\n").map((line) => line.trim()).filter(Boolean);
}

function readChangedLeakageText(paths) {
  return paths
    .filter((path) => existsSync(path))
    .map((path) => safeRead(path))
    .join("\n");
}

function repoFilePaths(root = new URL("../", import.meta.url)) {
  const paths = [];

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (
      entry.name === ".git" ||
      entry.name === ".next" ||
      entry.name === ".turbo" ||
      entry.name === "coverage" ||
      entry.name === "dist" ||
      entry.name === "node_modules"
    ) {
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

function includesAll(value, parts) {
  return parts.every((part) => value.includes(normalize(part)));
}

function includesAny(value, parts) {
  return parts.some((part) => value.includes(normalize(part)));
}
