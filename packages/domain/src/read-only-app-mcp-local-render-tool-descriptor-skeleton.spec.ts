import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0166_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_PLAN_PATH,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_DESCRIPTION,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_INVOCATION_DONE,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_INVOCATION_STARTED,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_NAME,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SAMPLE_STRUCTURED_CONTENT,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_FIELD_CASING,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_REQUIRED_FIELDS,
  READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_TITLE,
  buildReadOnlyMcpLocalRenderToolDescriptorSkeleton,
  buildReadOnlyMcpLocalRenderToolDescriptorSkeletonProof,
  sanitizeReadOnlyMcpLocalRenderToolDescriptorStructuredContent,
  verifyFp0165CloseoutFreshnessForFp0166,
  verifyReadOnlyMcpLocalRenderToolDescriptorSkeletonBoundary,
} from "./read-only-app-mcp-local-render-tool-descriptor-skeleton";
import {
  FP0166_READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_PLAN_PATH,
  verifyFp0166AbsentOrReadOnlyMcpLocalRenderToolDescriptorSkeletonPlan,
  verifyFp0167Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import { LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI } from "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime";
import { scanProofOnlyNoTokenLeakageText } from "./read-only-app-mcp-token-validation";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const fp0165PlanPath =
  "plans/FP-0165-read-only-chatgpt-app-mcp-local-render-tool-descriptor-readiness.md";
const fp0166PlanPath = FP0166_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_PLAN_PATH;
const runtimePath =
  "packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton-runtime.ts";
const descriptorPath = "packages/domain/src/read-only-app-mcp-descriptor.ts";
const appRuntimePaths = [
  "apps/control-plane/src/app.ts",
  "apps/control-plane/src/container.ts",
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts",
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts",
];
const previewRuntimePaths = [
  "apps/web/app/read-only-app-mcp-preview/page.tsx",
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge.tsx",
  "apps/web/components/read-only-app-mcp/local-preview-demo-bridge-snapshot.ts",
];

describe("FP-0166 local render tool descriptor skeleton", () => {
  it("accepts exactly one FP-0166 skeleton plan and keeps FP-0167 absent", () => {
    const repoPaths = repoFilePaths();
    const repoPathsWithoutFp0166 = repoPaths.filter(
      (path) => !/(^|\/)FP-0166/u.test(path),
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0166/u.test(path))).toEqual([
      FP0166_READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_PLAN_PATH,
    ]);
    expect(
      verifyFp0166AbsentOrReadOnlyMcpLocalRenderToolDescriptorSkeletonPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0166AbsentOrReadOnlyMcpLocalRenderToolDescriptorSkeletonPlan([
        ...repoPathsWithoutFp0166,
        FP0166_READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SKELETON_PLAN_PATH,
      ]),
    ).toBe(true);
    expect(
      verifyFp0166AbsentOrReadOnlyMcpLocalRenderToolDescriptorSkeletonPlan([
        ...repoPathsWithoutFp0166,
        "plans/FP-0166-public-render-tool-runtime.md",
      ]),
    ).toBe(false);
    expect(verifyFp0167Absent(repoPaths)).toBe(true);
  });

  it("builds a deterministic inert local descriptor with read-only metadata", () => {
    const first = buildReadOnlyMcpLocalRenderToolDescriptorSkeleton();
    const second = buildReadOnlyMcpLocalRenderToolDescriptorSkeleton();

    expect(first).toEqual(second);
    expect(first.name).toBe(READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_NAME);
    expect(first.title).toBe(READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_TITLE);
    expect(first.description).toBe(
      READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_DESCRIPTION,
    );
    expect(first.description).toContain(
      "prepared sanitized local preview structuredContent",
    );
    expect(first.annotations).toEqual({
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
      readOnlyHint: true,
    });
    expect(first._meta.ui.resourceUri).toBe(
      LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    );
    expect(first._meta["openai/outputTemplate"]).toBe(
      READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_RESOURCE_URI,
    );
    expect(first._meta["openai/toolInvocation/invoking"]).toBe(
      READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_INVOCATION_STARTED,
    );
    expect(first._meta["openai/toolInvocation/invoked"]).toBe(
      READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_INVOCATION_DONE,
    );
  });

  it("uses canonical camelCase structuredContent input and output envelopes", () => {
    const descriptor = buildReadOnlyMcpLocalRenderToolDescriptorSkeleton();
    const inputSchema = descriptor.inputSchema as {
      properties: {
        structuredContent: {
          properties: Record<string, unknown>;
          required: readonly string[];
        };
      };
    };

    expect(
      READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_FIELD_CASING,
    ).toBe("camelCase");
    expect(inputSchema.properties.structuredContent.required).toEqual([
      ...READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_STRUCTURED_CONTENT_REQUIRED_FIELDS,
    ]);
    expect(
      inputSchema.properties.structuredContent.required.every((field) =>
        /^[a-z][A-Za-z0-9]*$/u.test(field),
      ),
    ).toBe(true);
    expect(descriptor.outputSchema).toEqual(descriptor.inputSchema);
  });

  it("accepts only sanitized local preview structuredContent-shaped input", () => {
    const sanitized =
      sanitizeReadOnlyMcpLocalRenderToolDescriptorStructuredContent(
        READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SAMPLE_STRUCTURED_CONTENT,
      );

    expect(sanitized.localOnly).toBe(true);
    expect(sanitized.noRuntime).toBe(true);
    expect(sanitized.noRealFinanceData).toBe(true);
    expect(sanitized.productionTokenValidationImplemented).toBe(false);
    expect(sanitized.publicChatGptAppImplemented).toBe(false);
    expect(() =>
      sanitizeReadOnlyMcpLocalRenderToolDescriptorStructuredContent({
        ...READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SAMPLE_STRUCTURED_CONTENT,
        extraField: "not allowed",
      }),
    ).toThrow(/Unsupported/u);
    expect(() =>
      sanitizeReadOnlyMcpLocalRenderToolDescriptorStructuredContent({
        ...READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SAMPLE_STRUCTURED_CONTENT,
        noRuntime: false,
      }),
    ).toThrow(/noRuntime/u);
  });

  it("rejects credential, parser, source, real-data, provider, model, and public-output leakage", () => {
    const unsafe = [
      ["Authori", "zation", ":", " fixture"].join(""),
      ["Be", "arer ", "fixture"].join(""),
      "parser decision retained",
      "token material",
      "raw source body dump",
      "private field",
      "real bank revenue",
      "provider data",
      "model output",
      "write output",
      "public demo data",
      "source pack",
      "https://example.invalid",
      "<b>unsafe</b>",
      "window.openai.callTool",
    ];

    for (const evidenceCardSummary of unsafe) {
      expect(() =>
        sanitizeReadOnlyMcpLocalRenderToolDescriptorStructuredContent({
          ...READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_SAMPLE_STRUCTURED_CONTENT,
          evidenceCardSummary,
        }),
      ).toThrow(/Unsafe|Unsupported|Invalid/u);
    }
  });

  it("keeps the runtime-safe descriptor skeleton builder isolated", () => {
    const source = safeRead(runtimePath);

    expect(source).toContain(
      "read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime",
    );
    expect(source).not.toMatch(
      /node:(?:fs|child_process|http|https|net|tls|crypto|os|path|url)|from\s+["']react["']|from\s+["']next|fetch\s*\(|XMLHttpRequest|WebSocket|registerResource\s*\(|registerTool\s*\(|buildApp\s*\(|createContainer\s*\(|createInMemoryContainer\s*\(|from\s+["']openai["']|new\s+OpenAI\s*\(|process\.env|Date\.now\s*\(|Math\.random\s*\(|pino|logger|decodeJwt\s*\(|jwtDecode\s*\(|fetchJwks\s*\(|introspectToken\s*\(|oauthCallback\s*\(|sessionStore|setCookie/u,
    );
  });

  it("keeps reusable data tools and runtime surfaces template-free", () => {
    const descriptorSource = safeRead(descriptorPath);
    const defaultRuntimeSource = appRuntimePaths.map(safeRead).join("\n");
    const previewRuntimeSource = previewRuntimePaths.map(safeRead).join("\n");

    expect(descriptorSource).toContain("search_evidence");
    expect(descriptorSource).toContain("fetch_evidence_card");
    expect(descriptorSource).not.toMatch(
      /openai\/outputTemplate|_meta\s*:\s*\{\s*ui\s*:\s*\{\s*resourceUri|resourceUri\s*:/u,
    );
    expect(defaultRuntimeSource).not.toMatch(
      /registerTool\s*\(|registerResource\s*\(|openai\/outputTemplate|resources\/(?:list|read)/u,
    );
    expect(previewRuntimeSource).not.toMatch(
      /\bfetch\s*\(|["']\/mcp["']|window\.openai|callTool|uploadFile|selectFiles|openExternal|requestModal|requestDisplayMode|setWidgetState/u,
    );
  });

  it("proves FP-0165 closeout freshness and the FP-0166 skeleton boundary", () => {
    const fp0165PlanText = safeRead(fp0165PlanPath);
    const fp0166PlanText = safeRead(fp0166PlanPath);
    const proof = buildReadOnlyMcpLocalRenderToolDescriptorSkeletonProof({
      changedPathScopeAccepted: true,
      dataToolTemplateFree: true,
      defaultRuntimeUnchanged: true,
      descriptorRuntimeSource: safeRead(runtimePath),
      fp0165PlanText,
      fp0166PlanText,
      noNewRouteOrApiRouteAdded: false,
      noPreviewRuntimeBridgeUsage: true,
      repoPaths: repoFilePaths(),
    });

    expect(verifyFp0165CloseoutFreshnessForFp0166(fp0165PlanText)).toBe(true);
    expect(
      verifyReadOnlyMcpLocalRenderToolDescriptorSkeletonBoundary({
        changedPathScopeAccepted: true,
        dataToolTemplateFree: true,
        defaultRuntimeUnchanged: true,
        descriptorRuntimeSource: safeRead(runtimePath),
        fp0165PlanText,
        fp0166PlanText,
        noNewRouteOrApiRouteAdded: false,
        noPreviewRuntimeBridgeUsage: true,
        repoPaths: repoFilePaths(),
      }),
    ).toBe(true);
    expect(proof.renderToolDescriptorSkeletonImplemented).toBe(true);
    expect(proof.renderToolRuntimeStillBlocked).toBe(true);
    expect(proof.registerToolWiringStillBlocked).toBe(true);
    expect(proof.dataToolOutputTemplatesStillBlocked).toBe(true);
    expect(proof.descriptorReadOnlyHintVerified).toBe(true);
    expect(proof.descriptorResourceUriVerified).toBe(true);
    expect(proof.descriptorOpenAiOutputTemplateAliasVerified).toBe(true);
    expect(proof.fp0167Absent).toBe(true);
    expect(
      scanProofOnlyNoTokenLeakageText([fp0165PlanText, fp0166PlanText].join("\n"))
        .accepted,
    ).toBe(true);
  });
});

function safeRead(path: string) {
  const fileUrl = new URL(`../../../${path}`, import.meta.url);
  return existsSync(fileUrl) ? readFileSync(fileUrl, "utf8") : "";
}

function repoFilePaths(dir = repoRoot, prefix = ""): string[] {
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
    return existsSync(fullPath) ? [relativePath] : [];
  });
}
