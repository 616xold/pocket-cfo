import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0162_LOCAL_APPS_SDK_RESOURCE_READINESS_PLAN_PATH,
  FUTURE_APPS_SDK_RESOURCE_ALLOWED_INPUT_FIELDS,
  FUTURE_APPS_SDK_RESOURCE_ALLOWED_OUTPUT_FIELDS,
  FUTURE_APPS_SDK_RESOURCE_FORBIDDEN_INPUT_FIELDS,
  FUTURE_APPS_SDK_RESOURCE_FORBIDDEN_OUTPUT_FIELDS,
  FUTURE_APPS_SDK_RESOURCE_IMPLEMENTATION_SEQUENCE,
  FUTURE_APPS_SDK_RESOURCE_METADATA_READINESS,
  FUTURE_APPS_SDK_TOOL_DESCRIPTOR_READINESS,
  buildReadOnlyMcpLocalAppsSdkResourceReadinessProof,
  verifyFp0161CloseoutFreshnessForFp0162,
  verifyFp0162ReadinessPlanTextRequiredTopics,
  verifyReadOnlyMcpLocalAppsSdkResourceReadinessBoundary,
} from "./read-only-app-mcp-local-apps-sdk-resource-readiness";
import {
  FP0163_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_PLAN_PATH,
  FP0164_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_PLAN_PATH,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const fp0161PlanPath =
  "plans/FP-0161-read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-visual-qa-accessibility.md";
const fp0161ProofPath =
  "tools/read-only-mcp-evidence-app-local-preview-demo-visual-qa-accessibility-proof.mjs";
const readinessModulePath =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-readiness.ts";
const previewRoutePath = "apps/web/app/read-only-app-mcp-preview/page.tsx";
const bridgeComponentPath =
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge.tsx";

describe("FP-0162 local Apps SDK resource readiness boundary", () => {
  it("accepts exactly one FP-0162 readiness path and exact FP-0163/FP-0164 successors", () => {
    const repoPaths = repoFilePaths();
    const repoPathsWithoutFp0163 = repoPaths.filter(
      (path) => !/(^|\/)FP-0163/u.test(path),
    );
    const repoPathsWithoutFp0164 = repoPaths.filter(
      (path) => !/(^|\/)FP-0164/u.test(path),
    );
    const fp0162Hits = repoPaths.filter((path) => /(^|\/)FP-0162/u.test(path));
    const fp0162PlanText = safeRead(FP0162_LOCAL_APPS_SDK_RESOURCE_READINESS_PLAN_PATH);

    expect(fp0162Hits).toEqual([FP0162_LOCAL_APPS_SDK_RESOURCE_READINESS_PLAN_PATH]);
    expect(
      verifyReadOnlyMcpLocalAppsSdkResourceReadinessBoundary({
        fp0161PlanText: safeRead(fp0161PlanPath),
        fp0161SuccessorPathScopeHardened: fp0161ProofPathScopeHardened(),
        fp0162PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyReadOnlyMcpLocalAppsSdkResourceReadinessBoundary({
        fp0161PlanText: safeRead(fp0161PlanPath),
        fp0161SuccessorPathScopeHardened: true,
        fp0162PlanText,
        repoPaths: [...repoPaths, "plans/FP-0162-runtime.md"],
      }),
    ).toBe(false);
    expect(
      verifyReadOnlyMcpLocalAppsSdkResourceReadinessBoundary({
        fp0161PlanText: safeRead(fp0161PlanPath),
        fp0161SuccessorPathScopeHardened: true,
        fp0162PlanText,
        repoPaths: [
          ...repoPathsWithoutFp0163,
          FP0163_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_PLAN_PATH,
        ],
      }),
    ).toBe(true);
    expect(
      verifyReadOnlyMcpLocalAppsSdkResourceReadinessBoundary({
        fp0161PlanText: safeRead(fp0161PlanPath),
        fp0161SuccessorPathScopeHardened: true,
        fp0162PlanText,
        repoPaths: [...repoPathsWithoutFp0163, "plans/FP-0163-runtime.md"],
      }),
    ).toBe(false);
    expect(
      verifyReadOnlyMcpLocalAppsSdkResourceReadinessBoundary({
        fp0161PlanText: safeRead(fp0161PlanPath),
        fp0161SuccessorPathScopeHardened: true,
        fp0162PlanText,
        repoPaths: [
          ...repoPathsWithoutFp0164,
          FP0164_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_PLAN_PATH,
        ],
      }),
    ).toBe(true);
    expect(
      verifyReadOnlyMcpLocalAppsSdkResourceReadinessBoundary({
        fp0161PlanText: safeRead(fp0161PlanPath),
        fp0161SuccessorPathScopeHardened: true,
        fp0162PlanText,
        repoPaths: [...repoPathsWithoutFp0164, "plans/FP-0164-runtime.md"],
      }),
    ).toBe(false);
  });

  it("records future resource input, output, metadata, CSP, domain, and descriptor posture without implementation", () => {
    const fp0162PlanText = safeRead(FP0162_LOCAL_APPS_SDK_RESOURCE_READINESS_PLAN_PATH);
    const topics = verifyFp0162ReadinessPlanTextRequiredTopics(fp0162PlanText);
    const moduleSource = safeRead(readinessModulePath);

    expect(Object.values(topics).every(Boolean)).toBe(true);
    expect(FUTURE_APPS_SDK_RESOURCE_ALLOWED_INPUT_FIELDS).toContain(
      "static_synthetic_local_preview_bridge_snapshot",
    );
    expect(FUTURE_APPS_SDK_RESOURCE_ALLOWED_INPUT_FIELDS).toContain(
      "future_sanitized_structured_content_from_local_render_tool",
    );
    expect(FUTURE_APPS_SDK_RESOURCE_FORBIDDEN_INPUT_FIELDS).toEqual(
      expect.arrayContaining([
        "raw_authorization_values",
        "parser_decisions",
        "token_material",
        "token_derived_fields",
        "raw_source_dumps",
        "private_fields",
        "real_finance_data",
        "provider_data",
        "model_output",
        "write_outputs",
        "public_demo_data",
      ]),
    );
    expect(FUTURE_APPS_SDK_RESOURCE_ALLOWED_OUTPUT_FIELDS).toContain(
      "inert_local_read_only_component_resource",
    );
    expect(FUTURE_APPS_SDK_RESOURCE_FORBIDDEN_OUTPUT_FIELDS).toEqual(
      expect.arrayContaining([
        "forms",
        "buttons",
        "file_inputs",
        "mutation_controls",
        "upload_or_select_files_flows",
        "external_navigation",
        "listing_copy",
        "screenshots",
        "public_assets",
      ]),
    );
    expect(FUTURE_APPS_SDK_RESOURCE_METADATA_READINESS).toEqual(
      expect.arrayContaining([
        "deterministic_local_template_uri",
        "no_external_connect_domains",
        "no_broad_resource_domains",
        "empty_frame_domains_unless_separately_justified",
        "csp_blocks_external_calls_by_default",
      ]),
    );
    expect(FUTURE_APPS_SDK_TOOL_DESCRIPTOR_READINESS).toEqual(
      expect.arrayContaining([
        "data_tools_remain_reusable_and_do_not_own_ui_template",
        "future_render_tool_depends_on_prepared_sanitized_structured_content",
        "evidence_tools_retain_read_only_hint",
        "no_output_template_attached_to_search_fetch_data_tools_in_fp0162",
      ]),
    );
    expect(FUTURE_APPS_SDK_RESOURCE_IMPLEMENTATION_SEQUENCE).toEqual(
      expect.arrayContaining([
        "future implementation must not fetch /mcp from the UI",
        "future implementation must not call ChatGPT bridge mutation or file helpers unless separately proven",
      ]),
    );
    expect(moduleSource).not.toMatch(
      /from "react"|from "next|node:fs|readdir|readFile|fetch\(|buildApp\(|createContainer\(|registerResource\(|new OpenAI|providerClient|jwksClient|introspectToken|oauthCallback|sessionStore/u,
    );
  });

  it("proves FP-0161 closeout freshness and successor path-scope hardening", () => {
    const fp0161PlanText = safeRead(fp0161PlanPath);

    expect(verifyFp0161CloseoutFreshnessForFp0162(fp0161PlanText)).toBe(true);
    expect(fp0161ProofPathScopeHardened()).toBe(true);
  });

  it("keeps default app, route, metadata, runtime, provider, auth, and public-app guardrails blocked", () => {
    const proof = buildReadOnlyMcpLocalAppsSdkResourceReadinessProof({
      fp0161PlanText: safeRead(fp0161PlanPath),
      fp0161SuccessorPathScopeHardened: fp0161ProofPathScopeHardened(),
      fp0162PlanText: safeRead(FP0162_LOCAL_APPS_SDK_RESOURCE_READINESS_PLAN_PATH),
      repoPaths: repoFilePaths(),
    });

    expect(proof.localAppsSdkResourceReadinessBoundaryVerified).toBe(true);
    expect(
      proof.fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified,
    ).toBe(true);
    expect(proof.fp0165Absent).toBe(true);
    expect(proof.appsSdkResourceImplementationStillBlocked).toBe(true);
    expect(proof.registerResourceImplementationStillBlocked).toBe(true);
    expect(proof.mcpResourceTemplateImplementationStillBlocked).toBe(true);
    expect(proof.toolDescriptorImplementationStillBlocked).toBe(true);
    expect(proof.componentBundleImplementationStillBlocked).toBe(true);
    expect(proof.noNewRouteOrApiRouteFromFp0162).toBe(true);
    expect(proof.defaultAuthAdapterWiringStillBlocked).toBe(true);
    expect(proof.defaultEvidenceDispatchWiringStillBlocked).toBe(true);
    expect(proof.defaultBuildAppBehaviorStillUnchanged).toBe(true);
    expect(proof.mcpRouteBehaviorStillUnchanged).toBe(true);
    expect(proof.protectedResourceMetadataRouteStillUnchanged).toBe(true);
    expect(proof.noProductionTokenValidationFromFp0162).toBe(true);
    expect(proof.noOauthSessionAuthMiddlewareFromFp0162).toBe(true);
    expect(proof.noProviderCallsFromFp0162).toBe(true);
    expect(proof.noOpenAiApiCallsFromFp0162).toBe(true);
    expect(proof.noModelCallsFromFp0162).toBe(true);
    expect(proof.noSourceMutationFromFp0162).toBe(true);
    expect(proof.noFinanceWriteFromFp0162).toBe(true);
    expect(proof.noAppSubmissionFromFp0162).toBe(true);
    expect(proof.fp0161VisualQaAccessibilityBoundaryStillVerified).toBe(true);
    expect(proof.fp0100PublicSecurityBoundaryStillVerified).toBe(true);
  });

  it("keeps the existing preview route/component runtime unchanged and leakage fixtures strict", () => {
    const previewRouteSource = safeRead(previewRoutePath);
    const bridgeSource = safeRead(bridgeComponentPath);
    const unsafeCredentialLine = ["authorization", ": ", "bearer", " ", ["local", "fixture", "material"].join("")].join("");
    const unsafeJwtLikeLine = ["ey", "J", "headerpart", ".", "payloadpart", ".", "signaturepart"].join("");

    expect(previewRouteSource).toContain("localPreviewDemoBridgeSnapshot");
    expect(bridgeSource).toContain("data-lanes=\"auth-boundary evidence-tool\"");
    expect([previewRouteSource, bridgeSource].join("\n")).not.toMatch(
      /window\.openai|fetch\(|registerResource|ui:\/\/|openExternal|uploadFile|selectFiles|callTool/u,
    );
    expect(
      scanProofOnlyNoTokenLeakageText(
        safeRead(FP0162_LOCAL_APPS_SDK_RESOURCE_READINESS_PLAN_PATH),
      ).accepted,
    ).toBe(true);
    expect(scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted).toBe(
      false,
    );
    expect(scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted).toBe(
      false,
    );
  });
});

function fp0161ProofPathScopeHardened() {
  const source = safeRead(fp0161ProofPath);

  return (
    source.includes("origin/main...HEAD") &&
    source.includes("committedBranchDiffPaths") &&
    source.includes("unstaged") &&
    source.includes("staged") &&
    source.includes("untracked")
  );
}

function repoFilePaths(dir = repoRoot, prefix = ""): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if ([".git", ".next", ".turbo", "coverage", "dist", "node_modules"].includes(entry.name)) {
      return [];
    }
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolutePath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return repoFilePaths(absolutePath, path);
    return [path];
  });
}

function safeRead(path: string) {
  return readFileSync(`${repoRoot}/${path}`, "utf8");
}
