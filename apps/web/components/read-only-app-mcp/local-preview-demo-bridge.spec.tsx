import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LocalPreviewDemoBridge } from "./local-preview-demo-bridge";
import { localPreviewDemoBridgeSnapshot } from "./local-preview-demo-bridge-snapshot";

describe("LocalPreviewDemoBridge", () => {
  it("renders a static local-only bridge with separated auth and evidence lanes", () => {
    const html = renderBridge();

    expect(html).toContain("Local demo bridge");
    expect(html).toContain('data-layout="local-preview-demo-bridge"');
    expect(html).toContain('data-lane="auth-boundary"');
    expect(html).toContain('data-lane="evidence-tool"');
    expect(html).toContain("Local challenge-boundary smoke");
    expect(html).toContain("not production authentication");
    expect(html).toContain("Synthetic read-only evidence dispatch smoke");
    expect(html).toContain("not authenticated tool execution");
    expect(html).toContain("Local-only synthetic preview");
    expect(html).toContain("No production token validation");
    expect(html).toContain("No public ChatGPT App release");
    expect(html).toContain("No real finance data");
  });

  it("renders local auth and read-only evidence smoke status without live transport", () => {
    const html = renderBridge();

    for (const expectedStatus of [
      "Missing-token challenge verified",
      "Authorization-present sanitized invalid-token challenge verified",
      "Protected-resource metadata verified",
      "No credential/parser exposure verified",
      "Production token validation implemented: false",
      "Exact read-only MCP tool allowlist verified",
      "search_evidence verified",
      "fetch_evidence_card verified",
      "fetch_source_anchor verified",
      "fetch_document_map verified",
      "fetch_source_coverage verified",
      "fetch_company_posture verified",
      "fetch_capability_boundaries verified",
      "companyKey mismatch fails closed",
      "invalid tool/arguments fail closed",
    ]) {
      expect(html).toContain(expectedStatus);
    }

    expect(html).toContain("productionTokenValidationImplemented: false");
    expect(html).toContain("publicChatGptAppImplemented: false");
    expect(html).toContain(
      'data-production-token-validation-implemented="false"',
    );
    expect(html).toContain('data-public-chatgpt-app-implemented="false"');
  });

  it("renders only a synthetic evidence snapshot with source-anchor status first-class", () => {
    const html = renderBridge();

    expect(html).toContain("Static synthetic evidence snapshot");
    expect(html).toContain("Evidence card");
    expect(html).toContain("Bounded citation");
    expect(html).toContain("Source anchor");
    expect(html).toContain("Document map");
    expect(html).toContain("Source coverage");
    expect(html).toContain("Company posture");
    expect(html).toContain("Capability boundary");
    expect(html).toContain(
      "fetch_source_anchor verified and displayed as a first-class bridge status",
    );
    expect(localPreviewDemoBridgeSnapshot.localOnly).toBe(true);
    expect(localPreviewDemoBridgeSnapshot.noRuntime).toBe(true);
    expect(localPreviewDemoBridgeSnapshot.noPublicApp).toBe(true);
    expect(localPreviewDemoBridgeSnapshot.noRealFinanceData).toBe(true);
    expect(
      localPreviewDemoBridgeSnapshot.productionTokenValidationImplemented,
    ).toBe(false);
    expect(localPreviewDemoBridgeSnapshot.publicChatGptAppImplemented).toBe(
      false,
    );
  });

  it("does not add controls, source dumps, provider output, model output, or write-action posture", () => {
    const html = renderBridge();
    const visibleText = stripTags(html).toLowerCase();

    for (const forbiddenMarkup of [
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
    ]) {
      expect(html).not.toContain(forbiddenMarkup);
    }

    for (const forbiddenPhrase of [
      "raw authorization value",
      "parser decision object",
      "token material",
      "token-derived field",
      ["raw", "source", "dump"].join(" "),
      "source body text",
      "private field",
      "provider response",
      "model output",
      "generated advice",
      "write output",
      ["real", "bank"].join(" "),
      ["real", "finance", "record"].join(" "),
      "public demo data",
      "submit for review",
      "listing copy",
      "submission material",
    ]) {
      expect(visibleText).not.toContain(forbiddenPhrase);
    }

    for (const forbiddenWord of [
      "approve",
      "send",
      "pay",
      "certify",
      "connect",
      "upload",
      "submit",
    ]) {
      expect(visibleText).not.toMatch(new RegExp(`\\b${forbiddenWord}\\b`, "u"));
    }
  });
});

function renderBridge() {
  return renderToStaticMarkup(
    <LocalPreviewDemoBridge snapshot={localPreviewDemoBridgeSnapshot} />,
  );
}

function stripTags(html: string) {
  return html.replace(/<[^>]+>/gu, "").replace(/\s+/gu, " ").trim();
}
