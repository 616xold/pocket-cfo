import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0159_READINESS_PLAN_PATH,
  FUTURE_UI_BRIDGE_ALLOWED_INPUT_FIELDS,
  FUTURE_UI_BRIDGE_ALLOWED_OUTPUT_FIELDS,
  FUTURE_UI_BRIDGE_FORBIDDEN_INPUT_FIELDS,
  FUTURE_UI_BRIDGE_FORBIDDEN_OUTPUT_FIELDS,
  FUTURE_UI_BRIDGE_IMPLEMENTATION_SEQUENCE,
  buildReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessProof,
  verifyFp0158CloseoutFreshnessForFp0159,
  verifyFp0159ReadinessPlanTextRequiredTopics,
  verifyReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessBoundary,
} from "./read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness";
import {
  scanProofOnlyNoTokenLeakageText,
  scanTokenValidationNoLeakage,
} from "./read-only-app-mcp-token-validation";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const fp0158PlanPath =
  "plans/FP-0158-read-only-chatgpt-app-mcp-evidence-app-local-demo-bridge.md";
const harnessPath =
  "tools/read-only-mcp-evidence-app-local-demo-bridge.mjs";
const harnessProofPath =
  "tools/read-only-mcp-evidence-app-local-demo-bridge-proof.mjs";
const readinessModulePath =
  "packages/domain/src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.ts";

describe("FP-0159 local preview/demo UI bridge readiness boundary", () => {
  it("accepts exactly one FP-0159 readiness path and exact FP-0160 implementation path while FP-0161 remains absent", () => {
    const repoPaths = repoFilePaths();
    const fp0159Hits = repoPaths.filter((path) =>
      /(^|\/)FP-0159/u.test(path),
    );
    const fp0159PlanText = safeRead(FP0159_READINESS_PLAN_PATH);
    const fp0158PlanText = safeRead(fp0158PlanPath);

    expect(fp0159Hits).toEqual([FP0159_READINESS_PLAN_PATH]);
    expect(
      verifyReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessBoundary({
        fp0158PlanText,
        fp0158SourceAnchorSummaryVerified:
          fp0158SourceAnchorSummaryVerified(),
        fp0159PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessBoundary({
        fp0158PlanText,
        fp0158SourceAnchorSummaryVerified:
          fp0158SourceAnchorSummaryVerified(),
        fp0159PlanText,
        repoPaths: [...repoPaths, "plans/FP-0159-runtime.md"],
      }),
    ).toBe(false);
    expect(
      verifyReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessBoundary({
        fp0158PlanText,
        fp0158SourceAnchorSummaryVerified:
          fp0158SourceAnchorSummaryVerified(),
        fp0159PlanText,
        repoPaths: [...repoPaths, "plans/FP-0160-runtime.md"],
      }),
    ).toBe(false);
    expect(
      verifyReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessBoundary({
        fp0158PlanText,
        fp0158SourceAnchorSummaryVerified:
          fp0158SourceAnchorSummaryVerified(),
        fp0159PlanText,
        repoPaths: [...repoPaths, "plans/FP-0161-runtime.md"],
      }),
    ).toBe(false);
  });

  it("records future UI bridge input, output, composition, and forbidden data boundaries without implementing the bridge", () => {
    const fp0159PlanText = safeRead(FP0159_READINESS_PLAN_PATH);
    const topics = verifyFp0159ReadinessPlanTextRequiredTopics(fp0159PlanText);
    const readinessModuleSource = safeRead(readinessModulePath);

    expect(Object.values(topics).every(Boolean)).toBe(true);
    expect(FUTURE_UI_BRIDGE_ALLOWED_INPUT_FIELDS).toContain(
      "sanitized_local_demo_summary",
    );
    expect(FUTURE_UI_BRIDGE_ALLOWED_INPUT_FIELDS).toContain(
      "synthetic_evidence_snapshot",
    );
    expect(FUTURE_UI_BRIDGE_ALLOWED_INPUT_FIELDS).toContain(
      "auth_boundary_status",
    );
    expect(FUTURE_UI_BRIDGE_ALLOWED_INPUT_FIELDS).toContain(
      "evidence_tool_lane_status",
    );
    expect(FUTURE_UI_BRIDGE_ALLOWED_INPUT_FIELDS).toContain("source_anchors");
    expect(FUTURE_UI_BRIDGE_FORBIDDEN_INPUT_FIELDS).toEqual(
      expect.arrayContaining([
        "raw_authorization_values",
        "parser_decision_objects",
        "raw_source_dump_exposure_forbidden",
        "real_finance_data",
        "token_derived_fields",
        "model_output",
        "write_action_outputs",
      ]),
    );
    expect(FUTURE_UI_BRIDGE_ALLOWED_OUTPUT_FIELDS).toContain(
      "existing_read_only_app_mcp_component_props",
    );
    expect(FUTURE_UI_BRIDGE_ALLOWED_OUTPUT_FIELDS).toContain(
      "static_synthetic_preview_matrix",
    );
    expect(FUTURE_UI_BRIDGE_FORBIDDEN_OUTPUT_FIELDS).toEqual(
      expect.arrayContaining([
        "forms",
        "buttons",
        "file_inputs",
        "mutation_controls",
        "provider_controls",
        "public_app_assets",
        "listing_copy",
        "app_submission_material",
      ]),
    );
    expect(FUTURE_UI_BRIDGE_IMPLEMENTATION_SEQUENCE).toEqual(
      expect.arrayContaining([
        "future implementation must remain synthetic/local-only and must not fetch from /mcp",
        "future implementation must not run the harness at request time",
        "future implementation must use static/in-memory contract-shaped snapshots",
        "future implementation must keep auth boundary lane and evidence tool lane visually separate",
      ]),
    );
    expect(readinessModuleSource).not.toMatch(
      /from "react"|from "next|node:fs|readdir|readFile|fetch\(|buildApp\(|createContainer\(|new OpenAI|providerClient|jwksClient|introspectToken|oauthCallback|sessionStore/u,
    );
  });

  it("proves FP-0158 closeout freshness and direct source-anchor summary/proof polish", () => {
    const fp0158PlanText = safeRead(fp0158PlanPath);
    const harnessSource = safeRead(harnessPath);
    const proofSource = safeRead(harnessProofPath);

    expect(verifyFp0158CloseoutFreshnessForFp0159(fp0158PlanText)).toBe(true);
    expect(harnessSource).toContain("fetchSourceAnchorVerified");
    expect(proofSource).toContain("sourceAnchorFetchVerified");
    expect(fp0158SourceAnchorSummaryVerified()).toBe(true);
  });

  it("keeps default behavior and runtime/provider/auth/public-app guardrails blocked in the readiness proof", () => {
    const proof =
      buildReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessProof({
        fp0158PlanText: safeRead(fp0158PlanPath),
        fp0158SourceAnchorSummaryVerified:
          fp0158SourceAnchorSummaryVerified(),
        fp0159PlanText: safeRead(FP0159_READINESS_PLAN_PATH),
        repoPaths: repoFilePaths(),
      });

    expect(proof.evidenceAppLocalPreviewDemoUiBridgeReadinessBoundaryVerified).toBe(
      true,
    );
    expect(proof.uiBridgeImplementationStillBlocked).toBe(true);
    expect(proof.existingPreviewRouteStillUnchanged).toBe(true);
    expect(proof.noNewRouteOrApiRouteFromFp0159).toBe(true);
    expect(proof.defaultAuthAdapterWiringStillBlocked).toBe(true);
    expect(proof.defaultEvidenceDispatchWiringStillBlocked).toBe(true);
    expect(proof.defaultBuildAppBehaviorStillUnchanged).toBe(true);
    expect(proof.mcpRouteBehaviorStillUnchanged).toBe(true);
    expect(proof.protectedResourceMetadataRouteStillUnchanged).toBe(true);
    expect(proof.noProductionTokenValidationFromFp0159).toBe(true);
    expect(proof.noOauthSessionAuthMiddlewareFromFp0159).toBe(true);
    expect(proof.noProviderCallsFromFp0159).toBe(true);
    expect(proof.noOpenAiApiCallsFromFp0159).toBe(true);
    expect(proof.noModelCallsFromFp0159).toBe(true);
    expect(proof.noSourceMutationFromFp0159).toBe(true);
    expect(proof.noFinanceWriteFromFp0159).toBe(true);
    expect(proof.noExternalCommunicationsFromFp0159).toBe(true);
    expect(proof.noPublicAssetsFromFp0159).toBe(true);
    expect(proof.noGeneratedPublicProseFromFp0159).toBe(true);
    expect(proof.noAppSubmissionFromFp0159).toBe(true);
    expect(proof.fp0158LocalEvidenceDemoBridgeBoundaryStillVerified).toBe(true);
    expect(proof.fp0100PublicSecurityBoundaryStillVerified).toBe(true);
  });

  it("keeps no-token and no-source-leakage fixture posture strict", () => {
    const safeReadinessText = [
      "raw authorization values are forbidden",
      "token material is blocked and never echoed",
      "raw source dumps are forbidden",
      "source body text is not included",
    ].join("\n");
    const unsafeCredentialLine = [
      "authorization",
      ": ",
      "bearer",
      " ",
      ["alpha", "numeric", "fixture"].join(""),
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

    expect(scanProofOnlyNoTokenLeakageText(safeReadinessText).accepted).toBe(
      true,
    );
    expect(scanProofOnlyNoTokenLeakageText(unsafeCredentialLine).accepted).toBe(
      false,
    );
    expect(scanTokenValidationNoLeakage(unsafeJwtLikeLine).accepted).toBe(
      false,
    );
  });
});

function fp0158SourceAnchorSummaryVerified() {
  const harnessSource = safeRead(harnessPath);
  const proofSource = safeRead(harnessProofPath);

  return (
    harnessSource.includes("fetchSourceAnchorVerified") &&
    proofSource.includes("sourceAnchorFetchVerified")
  );
}

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
