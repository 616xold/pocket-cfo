import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0165_LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_PLAN_PATH,
  FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_ALLOWED_INPUT_FIELDS,
  FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_ALLOWED_OUTPUT_FIELDS,
  FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_FORBIDDEN_INPUT_FIELDS,
  FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_FORBIDDEN_OUTPUT_FIELDS,
  FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_IMPLEMENTATION_SEQUENCE,
  FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_METADATA_READINESS,
  LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_RESOURCE_URI,
  buildReadOnlyMcpLocalRenderToolDescriptorReadinessProof,
  verifyFp0164CloseoutFreshnessForFp0165,
  verifyFp0165ReadinessPlanTextRequiredTopics,
  verifyReadOnlyMcpLocalRenderToolDescriptorReadinessBoundary,
} from "./read-only-app-mcp-local-render-tool-descriptor-readiness";
import {
  FP0165_READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_PLAN_PATH,
  verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan,
  verifyFp0166Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import { LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI } from "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const fp0164PlanPath =
  "plans/FP-0164-read-only-chatgpt-app-mcp-local-apps-sdk-resource-registration.md";
const fp0165PlanPath =
  FP0165_LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_PLAN_PATH;
const readinessModulePath =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-readiness.ts";
const descriptorModulePath =
  "packages/domain/src/read-only-app-mcp-descriptor.ts";
const previewRoutePath = "apps/web/app/read-only-app-mcp-preview/page.tsx";
const previewBridgePath =
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge.tsx";
const previewSnapshotPath =
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge-snapshot.ts";
const controlPlaneAppPath = "apps/control-plane/src/app.ts";
const controlPlaneContainerPath = "apps/control-plane/src/container.ts";
const controlPlaneRoutesPath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const protectedResourceMetadataRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";

describe("FP-0165 local render tool descriptor readiness", () => {
  it("accepts exactly one FP-0165 readiness plan and keeps FP-0166 absent", () => {
    const repoPaths = repoFilePaths();
    const repoPathsWithoutFp0165 = repoPaths.filter(
      (path) => !/(^|\/)FP-0165/u.test(path),
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0165/u.test(path))).toEqual([
      FP0165_READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_PLAN_PATH,
    ]);
    expect(
      verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan([
        ...repoPathsWithoutFp0165,
        FP0165_READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_PLAN_PATH,
      ]),
    ).toBe(true);
    expect(
      verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan([
        ...repoPathsWithoutFp0165,
        "plans/FP-0165-render-tool-runtime.md",
      ]),
    ).toBe(false);
    expect(verifyFp0166Absent(repoPaths)).toBe(true);
    expect(verifyFp0166Absent([...repoPaths, "plans/FP-0166-runtime.md"])).toBe(
      false,
    );
  });

  it("records readiness-only input, output, metadata, and implementation boundaries", () => {
    const fp0165PlanText = safeRead(fp0165PlanPath);
    const topics = verifyFp0165ReadinessPlanTextRequiredTopics(fp0165PlanText);

    expect(Object.values(topics).every(Boolean)).toBe(true);
    expect(LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_RESOURCE_URI).toBe(
      LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    );
    expect(FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_ALLOWED_INPUT_FIELDS).toEqual(
      expect.arrayContaining([
        "prepared_sanitized_structured_content",
        "auth_boundary_status",
        "evidence_tool_lane_status",
        "freshness_posture",
        "public_chatgpt_app_implemented_false",
      ]),
    );
    expect(FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_FORBIDDEN_INPUT_FIELDS).toEqual(
      expect.arrayContaining([
        "raw_authorization_values",
        "parser_decisions",
        "token_material",
        "token_derived_fields",
        "real_finance_data",
        "public_demo_data",
        "unsanitized_html",
      ]),
    );
    expect(FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_ALLOWED_OUTPUT_FIELDS).toContain(
      "sanitized_local_preview_structured_content",
    );
    expect(FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_FORBIDDEN_OUTPUT_FIELDS).toEqual(
      expect.arrayContaining([
        "raw_source_body_text",
        "screenshots",
        "app_submission_material",
        "model_generated_advice",
      ]),
    );
    expect(FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_METADATA_READINESS).toEqual(
      expect.arrayContaining([
        "annotations_read_only_hint_true_future_only",
        "_meta_ui_resource_uri_future_only",
        "openai_output_template_compatibility_alias_future_only",
        "not_attached_to_search_fetch_data_tools",
      ]),
    );
    expect(FUTURE_LOCAL_RENDER_TOOL_DESCRIPTOR_IMPLEMENTATION_SEQUENCE).toEqual(
      expect.arrayContaining([
        "future implementation must not attach output templates to search/fetch data tools",
        "future implementation must not implement authenticated evidence execution",
      ]),
    );
  });

  it("keeps descriptor readiness proof-only and free of runtime implementation imports", () => {
    const moduleSource = safeRead(readinessModulePath);

    expect(moduleSource).toContain(
      "buildReadOnlyMcpLocalRenderToolDescriptorReadinessProof",
    );
    expect(moduleSource).not.toMatch(
      /from\s+["']react["']|from\s+["']next|node:(?:fs|child_process|http|https|net|tls|crypto|os|path|url)|readFile|readdir|writeFile|fetch\s*\(|XMLHttpRequest|WebSocket|registerResource\s*\(|registerTool\s*\(|buildApp\s*\(|createContainer\s*\(|createInMemoryContainer\s*\(/u,
    );
    expect(moduleSource).not.toMatch(
      /from\s+["']openai["']|new\s+OpenAI\s*\(|responses\.create\s*\(|chat\.completions\s*\(|providerClient\s*[:=(]|providerCall\s*\(|selectProvider\s*\(|decodeJwt\s*\(|jwtDecode\s*\(|fetchJwks\s*\(|introspectToken\s*\(|oauthCallback\s*\(|sessionStore\s*[:=(]|setCookie\s*\(/u,
    );
    expect(moduleSource).not.toMatch(
      /\brenderTool\s*[:=(]|structuredContentToResource|registerResource\s*\(/u,
    );
  });

  it("does not attach templates or resource URIs to reusable search/fetch data tools", () => {
    const descriptorSource = safeRead(descriptorModulePath);

    expect(descriptorSource).toContain("search_evidence");
    expect(descriptorSource).toContain("fetch_evidence_card");
    expect(descriptorSource).not.toMatch(
      /openai\/outputTemplate|_meta\s*:\s*\{\s*ui\s*:\s*\{\s*resourceUri|resourceUri\s*:/u,
    );
    expect(descriptorSource).toMatch(/readOnlyHint:\s*true/u);
  });

  it("preserves preview, default app, route, and protected-resource metadata behavior", () => {
    const previewSource = [
      safeRead(previewRoutePath),
      safeRead(previewBridgePath),
      safeRead(previewSnapshotPath),
    ].join("\n");
    const appSource = safeRead(controlPlaneAppPath);
    const containerSource = safeRead(controlPlaneContainerPath);
    const routesSource = safeRead(controlPlaneRoutesPath);
    const metadataRouteSource = safeRead(protectedResourceMetadataRoutePath);

    expect(previewSource).not.toMatch(
      /\bfetch\s*\(|["']\/mcp["']|window\.openai|callTool|uploadFile|selectFiles|openExternal|requestModal|requestDisplayMode|setWidgetState/u,
    );
    expect(appSource + containerSource + routesSource).not.toMatch(
      /registerResource\s*\(|resources\/(?:list|read)|resource template/iu,
    );
    expect(metadataRouteSource).toMatch(/protected-resource/iu);
  });

  it("proves FP-0164 closeout freshness and readiness boundary output", () => {
    const fp0164PlanText = safeRead(fp0164PlanPath);
    const fp0165PlanText = safeRead(fp0165PlanPath);
    const proof = buildReadOnlyMcpLocalRenderToolDescriptorReadinessProof({
      changedPathScopeAccepted: true,
      fp0164CloseoutFresh: verifyFp0164CloseoutFreshnessForFp0165(
        fp0164PlanText,
      ),
      fp0164SuccessorBridgeCompatible: true,
      fp0165PlanText,
      repoPaths: repoFilePaths(),
    });

    expect(verifyFp0164CloseoutFreshnessForFp0165(fp0164PlanText)).toBe(true);
    expect(proof.localRenderToolDescriptorReadinessBoundaryVerified).toBe(true);
    expect(
      proof.fp0165AbsentOrLocalRenderToolDescriptorReadinessPlanVerified,
    ).toBe(true);
    expect(proof.fp0166Absent).toBe(true);
    expect(proof.renderToolImplementationStillBlocked).toBe(true);
    expect(proof.toolDescriptorImplementationStillBlocked).toBe(true);
    expect(proof.outputTemplateImplementationStillBlocked).toBe(true);
    expect(proof.dataToolTemplateOwnershipStillBlocked).toBe(true);
    expect(proof.futureRenderToolTwoLaneSeparationRecorded).toBe(true);
    expect(proof.futureDataToolsRemainReusable).toBe(true);
    expect(
      proof.futureRenderToolForbidsCredentialParserSourceLeakage,
    ).toBe(true);
    expect(proof.futureRenderToolForbidsRealFinanceData).toBe(true);
    expect(
      proof.futureRenderToolForbidsPublicAssetsScreenshotsSubmission,
    ).toBe(true);
    expect(
      verifyReadOnlyMcpLocalRenderToolDescriptorReadinessBoundary({
        changedPathScopeAccepted: true,
        fp0164CloseoutFresh: true,
        fp0164SuccessorBridgeCompatible: true,
        fp0165PlanText,
        repoPaths: repoFilePaths(),
      }),
    ).toBe(true);
  });

  it("keeps proof fixtures synthetic and rejects credential-like material", () => {
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

    expect(scanProofOnlyNoTokenLeakageText(safeRead(fp0165PlanPath)).accepted).toBe(
      true,
    );
    expect(scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted).toBe(
      false,
    );
    expect(scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted).toBe(
      false,
    );
    expect(safeRead(fp0165PlanPath)).not.toMatch(
      /\bauthorization\s*:\s*bearer\s+\S+|\beyJ[A-Za-z0-9_-]+\./u,
    );
  });
});

function repoFilePaths(dir = repoRoot, prefix = ""): string[] {
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

function safeRead(path: string) {
  const fullPath = `${repoRoot}/${path}`;

  if (!existsSync(fullPath)) return "";

  return readFileSync(fullPath, "utf8");
}
