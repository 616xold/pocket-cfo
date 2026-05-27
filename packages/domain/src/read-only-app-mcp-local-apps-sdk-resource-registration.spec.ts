import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0164_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_PLAN_PATH,
  FP0165_READ_ONLY_MCP_LOCAL_RENDER_TOOL_DESCRIPTOR_READINESS_PLAN_PATH,
  verifyFp0164AbsentOrReadOnlyMcpLocalAppsSdkResourceRegistrationPlan,
  verifyFp0165AbsentOrReadOnlyMcpLocalRenderToolDescriptorReadinessPlan,
  verifyFp0166Absent,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
  LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
  LOCAL_APPS_SDK_RESOURCE_WIDGET_DESCRIPTION,
  buildReadOnlyMcpLocalAppsSdkResourceSkeleton,
} from "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime";
import {
  READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_NAME,
  buildReadOnlyMcpLocalAppsSdkResourceRegistrationProof,
  registerReadOnlyMcpLocalAppsSdkResourceSkeleton,
  verifyFp0163CloseoutFreshnessForFp0164,
  verifyReadOnlyMcpLocalAppsSdkResourceRegistrationBoundary,
  type ReadOnlyMcpLocalAppsSdkResourceRegistrationHandler,
  type ReadOnlyMcpLocalAppsSdkResourceRegistry,
} from "./read-only-app-mcp-local-apps-sdk-resource-registration";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const fp0163PlanPath =
  "plans/FP-0163-read-only-chatgpt-app-mcp-local-apps-sdk-resource-skeleton.md";
const runtimeModulePath =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime.ts";
const proofHeavySkeletonModulePath =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts";
const registrationModulePath =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.ts";
const controlPlaneAppPath = "apps/control-plane/src/app.ts";
const controlPlaneContainerPath = "apps/control-plane/src/container.ts";
const controlPlaneRoutesPath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const previewRoutePath = "apps/web/app/read-only-app-mcp-preview/page.tsx";

describe("FP-0164 local Apps SDK resource registration", () => {
  it("accepts exactly one FP-0164 registration plan, exact FP-0165 readiness, and keeps FP-0166 absent", () => {
    const repoPaths = repoFilePaths();
    const repoPathsWithoutFp0164 = repoPaths.filter(
      (path) => !/(^|\/)FP-0164/u.test(path),
    );
    const repoPathsWithoutFp0165 = repoPaths.filter(
      (path) => !/(^|\/)FP-0165/u.test(path),
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0164/u.test(path))).toEqual([
      FP0164_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_PLAN_PATH,
    ]);
    expect(
      verifyFp0164AbsentOrReadOnlyMcpLocalAppsSdkResourceRegistrationPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0164AbsentOrReadOnlyMcpLocalAppsSdkResourceRegistrationPlan([
        ...repoPathsWithoutFp0164,
        FP0164_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_PLAN_PATH,
      ]),
    ).toBe(true);
    expect(
      verifyFp0164AbsentOrReadOnlyMcpLocalAppsSdkResourceRegistrationPlan([
        ...repoPathsWithoutFp0164,
        "plans/FP-0164-default-registration.md",
      ]),
    ).toBe(false);
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
        "plans/FP-0165-render-tool.md",
      ]),
    ).toBe(false);
    expect(verifyFp0166Absent(repoPaths)).toBe(true);
  });

  it("keeps the runtime-safe skeleton builder isolated from proof and app runtime imports", () => {
    const runtimeSource = safeRead(runtimeModulePath);
    const proofHeavySkeletonSource = safeRead(proofHeavySkeletonModulePath);

    expect(runtimeSource).toContain(
      "buildReadOnlyMcpLocalAppsSdkResourceSkeleton",
    );
    expect(runtimeSource).not.toMatch(/^import\s/u);
    expect(runtimeSource).not.toMatch(
      /from\s+["'][^"']*(?:proof|scanner|readiness|token-validation|app\/|apps\/|control-plane|db|provider|openai|next|react)[^"']*["']/iu,
    );
    expect(runtimeSource).not.toMatch(
      /node:(?:fs|child_process|crypto|http|https|net|tls|os|path|url)|readFile|readdir|fetch\(|Date\.now|Math\.random|process\.env|from\s+["']openai["']|new\s+OpenAI|decodeJwt|jwtDecode|fetchJwks|introspectToken|oauthCallback|sessionStore/u,
    );
    expect(proofHeavySkeletonSource).toContain(
      "read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime",
    );
    expect(proofHeavySkeletonSource).toContain(
      "buildReadOnlyMcpLocalAppsSdkResourceSkeleton",
    );
  });

  it("imports the runtime-safe builder path instead of the proof-heavy skeleton module", () => {
    const registrationSource = safeRead(registrationModulePath);

    expect(registrationSource).toContain(
      "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime",
    );
    expect(registrationSource).not.toMatch(
      /from\s+["']\.\/read-only-app-mcp-local-apps-sdk-resource-skeleton["']/u,
    );
    expect(registrationSource).not.toMatch(
      /read-only-mcp-[^"']*proof|repoFilePaths|readdirSync|readFileSync|node:fs|from\s+["']react["']|from\s+["']next|apps\/control-plane|packages\/db|from\s+["']openai["']|new\s+OpenAI/u,
    );
  });

  it("requires a caller-provided registry with registerResource", () => {
    expect(() =>
      registerReadOnlyMcpLocalAppsSdkResourceSkeleton(
        undefined as unknown as ReadOnlyMcpLocalAppsSdkResourceRegistry,
      ),
    ).toThrow(/caller-provided registerResource/u);
    expect(() =>
      registerReadOnlyMcpLocalAppsSdkResourceSkeleton(
        {} as ReadOnlyMcpLocalAppsSdkResourceRegistry,
      ),
    ).toThrow(/caller-provided registerResource/u);
  });

  it("calls caller-provided registerResource exactly once with deterministic resource details", () => {
    const calls: Array<{
      handler: ReadOnlyMcpLocalAppsSdkResourceRegistrationHandler;
      metadata: Record<string, never>;
      name: string;
      uri: string;
    }> = [];
    const registry: ReadOnlyMcpLocalAppsSdkResourceRegistry = {
      registerResource: (name, uri, metadata, handler) => {
        calls.push({ handler, metadata, name, uri });
      },
    };

    const summary = registerReadOnlyMcpLocalAppsSdkResourceSkeleton(registry);

    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({
      metadata: {},
      name: READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_NAME,
      uri: LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    });
    expect(Object.keys(calls[0]?.metadata ?? {})).toHaveLength(0);
    expect(summary).toEqual({
      registered: true,
      name: READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_NAME,
      uri: LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
      mimeType: LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
      localOnly: true,
      defaultRegistration: false,
      serverResourceRegistration: false,
    });
    expect(summary).not.toHaveProperty("registry");
    expect(summary).not.toHaveProperty("handler");
  });

  it("returns exactly one static local skeleton content entry from the resource handler", () => {
    let handler: ReadOnlyMcpLocalAppsSdkResourceRegistrationHandler | undefined;
    const registry: ReadOnlyMcpLocalAppsSdkResourceRegistry = {
      registerResource: (_name, _uri, _metadata, registeredHandler) => {
        handler = registeredHandler;
      },
    };

    registerReadOnlyMcpLocalAppsSdkResourceSkeleton(registry);

    const result = handler?.();
    const expectedSkeleton = buildReadOnlyMcpLocalAppsSdkResourceSkeleton();

    expect(result?.contents).toEqual([expectedSkeleton]);
    expect(result?.contents).toHaveLength(1);
    expect(result?.contents[0]?.uri).toBe(LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI);
    expect(result?.contents[0]?.mimeType).toBe(
      LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
    );
    expect(result?.contents[0]?.text).toContain("<!doctype html>");
    expect(result?.contents[0]?.text).not.toMatch(
      /<script\b|<\/script>|<a\b|<button\b|<form\b|<input\b|<select\b|<textarea\b|https?:\/\/|\bwww\.|window\.openai|["']\/mcp["']/iu,
    );
  });

  it("preserves resource metadata, empty CSP domains, and no public widget domain or redirects", () => {
    const resource = buildReadOnlyMcpLocalAppsSdkResourceSkeleton();

    expect(resource._meta.ui.prefersBorder).toBe(true);
    expect(resource._meta.ui.csp).toEqual({
      connectDomains: [],
      resourceDomains: [],
      frameDomains: [],
    });
    expect(resource._meta.ui).not.toHaveProperty("domain");
    expect(resource._meta).not.toHaveProperty("openai/widgetCSP");
    expect(resource._meta["openai/widgetDescription"]).toBe(
      LOCAL_APPS_SDK_RESOURCE_WIDGET_DESCRIPTION,
    );
    expect(resource._meta["openai/widgetDescription"]).toContain(
      "No public app submission",
    );
    expect(resource._meta["openai/widgetDescription"]).not.toMatch(
      /market|launch|install|try now|sign up/iu,
    );
  });

  it("does not wire default server registration, routes, output templates, render tools, or app/web runtime behavior", () => {
    const registrationSource = safeRead(registrationModulePath);
    const runtimeSource = safeRead(runtimeModulePath);
    const defaultRuntimeSource = [
      safeRead(controlPlaneAppPath),
      safeRead(controlPlaneContainerPath),
      safeRead(controlPlaneRoutesPath),
    ].join("\n");
    const previewRouteSource = safeRead(previewRoutePath);

    expect(defaultRuntimeSource).not.toMatch(/registerResource\s*\(/u);
    expect(defaultRuntimeSource).not.toMatch(/resources\/(?:list|read)/iu);
    expect(registrationSource + runtimeSource).not.toMatch(
      /openai\/outputTemplate|["']?outputTemplate["']?\s*:|_meta\s*:\s*\{\s*ui\s*:\s*\{\s*resourceUri|\brenderTool\b|render_resource|structuredContentToResource|component-bundle|widget\.html/u,
    );
    expect(previewRouteSource).not.toMatch(/\bfetch\s*\(|["']\/mcp["']/u);
    expect(previewRouteSource).not.toMatch(/window\.openai|callTool/u);
    expect(registrationSource + runtimeSource).not.toMatch(
      /providerCall|callProvider|responses\.create|chat\.completions|authMiddleware|decodeJwt|jwtDecode|fetchJwks|introspectToken|oauthCallback|sessionStore|setCookie|uploadSource|mutateSource|financeWrite|updateLedger/u,
    );
  });

  it("keeps token-like material and source-like material rejected by shared sanitizers", () => {
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

    expect(scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted).toBe(
      false,
    );
    expect(scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted).toBe(
      false,
    );
    expect(() =>
      buildReadOnlyMcpLocalAppsSdkResourceSkeleton({
        freshnessPosture: ["raw", "source", "dump"].join(" "),
      }),
    ).toThrow();
  });

  it("verifies FP-0163 closeout freshness for the FP-0164 successor and registration proof boundary", () => {
    const proof = buildReadOnlyMcpLocalAppsSdkResourceRegistrationProof({
      defaultRegistrationStillBlocked: true,
      fp0163CloseoutFresh: true,
      fp0163SuccessorBridgeCompatible: true,
      fp0164PlanVerified: true,
      fp0165Absent: true,
      fp0165PlanVerified: true,
      fp0166Absent: true,
      noAppRuntimeOrRouteWiring: true,
      noToolDescriptorOrRenderTool: true,
      registrationHelperImportsRuntimeSafeBuilder: true,
      registrationHelperNotProofHeavy: true,
      registerResourceCalledExactlyOnce: true,
      runtimeSafeSkeletonBuilderIsolated: true,
    });

    expect(verifyFp0163CloseoutFreshnessForFp0164(safeRead(fp0163PlanPath))).toBe(
      true,
    );
    expect(proof.localAppsSdkResourceRegistrationBoundaryVerified).toBe(true);
    expect(proof.fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified).toBe(
      true,
    );
    expect(proof.fp0165Absent).toBe(true);
    expect(
      proof.fp0165AbsentOrLocalRenderToolDescriptorReadinessPlanVerified,
    ).toBe(true);
    expect(proof.fp0166Absent).toBe(true);
    expect(proof.explicitRegisterResourceHelperImplemented).toBe(true);
    expect(proof.registerResourceCalledExactlyOnceInHelperSpec).toBe(true);
    expect(proof.deterministicLocalResourceNameVerified).toBe(true);
    expect(proof.deterministicLocalResourceUriVerified).toBe(true);
    expect(proof.registeredResourceContentsShapeVerified).toBe(true);
    expect(proof.defaultResourceRegistrationStillBlocked).toBe(true);
    expect(proof.serverResourceRegistrationStillBlocked).toBe(true);
    expect(proof.outputTemplateImplementationStillBlocked).toBe(true);
    expect(proof.renderToolImplementationStillBlocked).toBe(true);
    expect(proof.fp0163CloseoutFreshnessVerified).toBe(true);
    expect(
      verifyReadOnlyMcpLocalAppsSdkResourceRegistrationBoundary({
        defaultRegistrationStillBlocked: true,
        fp0163CloseoutFresh: true,
        fp0163SuccessorBridgeCompatible: true,
        fp0164PlanVerified: true,
        fp0165Absent: true,
        fp0165PlanVerified: true,
        fp0166Absent: true,
        noAppRuntimeOrRouteWiring: true,
        noToolDescriptorOrRenderTool: true,
        registrationHelperImportsRuntimeSafeBuilder: true,
        registrationHelperNotProofHeavy: true,
        registerResourceCalledExactlyOnce: true,
        runtimeSafeSkeletonBuilderIsolated: true,
      }),
    ).toBe(true);
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
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolutePath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return repoFilePaths(absolutePath, path);
    return [path];
  });
}

function safeRead(path: string) {
  const absolutePath = `${repoRoot}/${path}`;
  return existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : "";
}
