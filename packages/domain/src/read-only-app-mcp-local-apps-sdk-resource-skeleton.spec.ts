import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0163_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_PLAN_PATH,
  FP0164_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_PLAN_PATH,
  verifyFp0164AbsentOrReadOnlyMcpLocalAppsSdkResourceRegistrationPlan,
  verifyFp0165Absent,
  verifyFp0163AbsentOrReadOnlyMcpLocalAppsSdkResourceSkeletonPlan,
} from "./read-only-app-mcp-authorization-parser-contracts";
import {
  LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
  LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
  buildReadOnlyMcpLocalAppsSdkResourceSkeleton,
  buildReadOnlyMcpLocalAppsSdkResourceSkeletonProof,
  verifyReadOnlyMcpLocalAppsSdkResourceSkeletonBoundary,
} from "./read-only-app-mcp-local-apps-sdk-resource-skeleton";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const skeletonModulePath =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts";
const skeletonRuntimeModulePath =
  "packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime.ts";
const readinessProofPath =
  "tools/read-only-mcp-local-apps-sdk-resource-readiness-proof.mjs";
const skeletonProofPath =
  "tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs";
const controlPlaneMcpRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const previewRoutePath = "apps/web/app/read-only-app-mcp-preview/page.tsx";

describe("FP-0163 local Apps SDK resource skeleton", () => {
  it("accepts exactly one FP-0163 skeleton plan, the exact FP-0164 registration successor, and keeps FP-0165 absent", () => {
    const repoPaths = repoFilePaths();
    const repoPathsWithoutFp0163 = repoPaths.filter(
      (path) => !/(^|\/)FP-0163/u.test(path),
    );
    const repoPathsWithoutFp0164 = repoPaths.filter(
      (path) => !/(^|\/)FP-0164/u.test(path),
    );

    expect(
      repoPaths.filter((path) => /(^|\/)FP-0163/u.test(path)),
    ).toEqual([FP0163_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_PLAN_PATH]);
    expect(
      verifyFp0163AbsentOrReadOnlyMcpLocalAppsSdkResourceSkeletonPlan(
        repoPaths,
      ),
    ).toBe(true);
    expect(
      verifyFp0163AbsentOrReadOnlyMcpLocalAppsSdkResourceSkeletonPlan([
        ...repoPathsWithoutFp0163,
        FP0163_READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_SKELETON_PLAN_PATH,
      ]),
    ).toBe(true);
    expect(
      verifyFp0163AbsentOrReadOnlyMcpLocalAppsSdkResourceSkeletonPlan([
        ...repoPathsWithoutFp0163,
        "plans/FP-0163-register-resource.md",
      ]),
    ).toBe(false);
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
        "plans/FP-0164-runtime.md",
      ]),
    ).toBe(false);
    expect(verifyFp0165Absent(repoPaths)).toBe(true);
    expect(verifyFp0165Absent([...repoPaths, "plans/FP-0165-runtime.md"])).toBe(
      false,
    );
  });

  it("returns a deterministic local resource URI, Apps SDK resource mime type, and static sanitized HTML", () => {
    const first = buildReadOnlyMcpLocalAppsSdkResourceSkeleton();
    const second = buildReadOnlyMcpLocalAppsSdkResourceSkeleton();

    expect(first).toEqual(second);
    expect(first.uri).toBe(LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI);
    expect(first.mimeType).toBe(LOCAL_APPS_SDK_RESOURCE_MIME_TYPE);
    expect(first.text).toContain("<!doctype html>");
    expect(first.text).toContain("productionTokenValidationImplemented: false");
    expect(first.text).toContain("publicChatGptAppImplemented: false");
    expect(first.text).toContain('data-lane-id="auth-boundary"');
    expect(first.text).toContain('data-lane-id="evidence-tool"');
    expect(first.text).not.toMatch(
      /<script\b|<\/script>|<a\b|<button\b|<form\b|<input\b|<select\b|<textarea\b|https?:\/\/|\bwww\.|window\.openai|["']\/mcp["']/iu,
    );
    expect(first.text).not.toMatch(
      /\b(upload|select files|provider call|payment|send report|certification control|source pack|public demo data)\b/iu,
    );
  });

  it("emits local read-only metadata with empty CSP domains and no public widget domain", () => {
    const resource = buildReadOnlyMcpLocalAppsSdkResourceSkeleton();

    expect(resource._meta.ui.prefersBorder).toBe(true);
    expect(resource._meta.ui.csp).toEqual({
      connectDomains: [],
      resourceDomains: [],
      frameDomains: [],
    });
    expect(resource._meta.ui).not.toHaveProperty("domain");
    expect(resource._meta).not.toHaveProperty("openai/widgetCSP");
    expect(resource._meta["openai/widgetDescription"]).toContain("Read-only");
    expect(resource._meta["openai/widgetDescription"]).toContain("synthetic");
    expect(resource._meta["openai/widgetDescription"]).toContain("local");
    expect(resource._meta["openai/widgetDescription"]).toContain(
      "No public app submission",
    );
    expect(resource._meta["openai/widgetDescription"]).not.toMatch(
      /market|launch|install|try now|sign up/iu,
    );
  });

  it("keeps auth and evidence lanes separate without production auth or authenticated execution claims", () => {
    const resource = buildReadOnlyMcpLocalAppsSdkResourceSkeleton({
      authBoundaryLaneStatus: "Synthetic local challenge boundary only.",
      evidenceToolLaneStatus: "Synthetic read-only evidence lane only.",
      freshnessPosture: "Static local snapshot.",
      sourceAnchorStatus: "Synthetic source-anchor status only.",
    });

    expect(resource.text).toContain('data-lanes="auth-boundary evidence-tool"');
    expect(resource.text).not.toContain("production authentication implemented");
    expect(resource.text).not.toContain("authenticated evidence execution");
    expect(resource.text).toContain("productionTokenValidationImplemented: false");
    expect(resource.text).toContain("publicChatGptAppImplemented: false");
  });

  it("rejects unsafe snapshot fields and token-like source material", () => {
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

    expect(() =>
      buildReadOnlyMcpLocalAppsSdkResourceSkeleton({
        authBoundaryLaneStatus: "raw authorization value",
      }),
    ).toThrow();
    expect(() =>
      buildReadOnlyMcpLocalAppsSdkResourceSkeleton({
        limitations: ["source dump"],
      }),
    ).toThrow();
    expect(scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted).toBe(
      false,
    );
    expect(scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted).toBe(
      false,
    );
  });

  it("does not add runtime registration, route, output template, render tool, component bundle, public asset, provider, OpenAI, auth, or write behavior", () => {
    const skeletonSource = safeRead(skeletonModulePath);
    const runtimeSource = safeRead(skeletonRuntimeModulePath);
    const routeSource = safeRead(controlPlaneMcpRoutePath);
    const previewRouteSource = safeRead(previewRoutePath);
    const proofSource = [safeRead(readinessProofPath), safeRead(skeletonProofPath)]
      .join("\n")
      .toLowerCase();

    expect(runtimeSource).not.toMatch(
      /from "react"|from "next|node:fs|readFile|readdir|fetch\(|buildApp\(|createContainer\(|new OpenAI|providerClient|decodeJwt|jwtDecode|fetchJwks|introspectToken|oauthCallback|sessionStore/u,
    );
    expect(skeletonSource).toContain(
      "read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime",
    );
    expect(routeSource).not.toMatch(/registerResource\s*\(/u);
    expect(runtimeSource).not.toMatch(/registerResource\s*\(/u);
    expect(runtimeSource).not.toMatch(/openai\/outputTemplate/u);
    expect(runtimeSource).not.toMatch(/\bcallTool\b|uploadFile|selectFiles/u);
    expect(previewRouteSource).not.toMatch(/\bfetch\s*\(|["']\/mcp["']/u);
    expect(proofSource).toContain("registerresource");
    expect(proofSource).toContain("componentbundle");
    expect(proofSource).toContain("tooldescriptor");
  });

  it("builds a proof with preserved predecessor and FP-0163 guardrail fields", () => {
    const proof = buildReadOnlyMcpLocalAppsSdkResourceSkeletonProof({
      changedPathScopeAccepted: true,
      fp0162CloseoutFresh: true,
      fp0162SuccessorBridgeCompatible: true,
      repoPaths: repoFilePaths(),
    });

    expect(proof.appsSdkResourceSkeletonImplemented).toBe(true);
    expect(proof.registerResourceImplementationStillBlocked).toBe(true);
    expect(
      proof.fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified,
    ).toBe(true);
    expect(proof.fp0165Absent).toBe(true);
    expect(proof.runtimeSafeSkeletonBuilderIsolated).toBe(true);
    expect(proof.resourceRegistrationStillBlocked).toBe(true);
    expect(proof.outputTemplateImplementationStillBlocked).toBe(true);
    expect(proof.noProductionTokenValidationFromFp0163).toBe(true);
    expect(proof.noOauthSessionAuthMiddlewareFromFp0163).toBe(true);
    expect(proof.noProviderCallsFromFp0163).toBe(true);
    expect(proof.noOpenAiApiCallsFromFp0163).toBe(true);
    expect(proof.noSourceMutationFromFp0163).toBe(true);
    expect(proof.noFinanceWriteFromFp0163).toBe(true);
    expect(proof.noPublicAssetsFromFp0163).toBe(true);
    expect(proof.fp0162LocalAppsSdkResourceReadinessBoundaryStillVerified).toBe(
      true,
    );
    expect(proof.fp0100PublicSecurityBoundaryStillVerified).toBe(true);
    expect(
      verifyReadOnlyMcpLocalAppsSdkResourceSkeletonBoundary({
        changedPathScopeAccepted: true,
        fp0162CloseoutFresh: true,
        fp0162SuccessorBridgeCompatible: true,
        repoPaths: repoFilePaths(),
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
  return readFileSync(`${repoRoot}/${path}`, "utf8");
}
