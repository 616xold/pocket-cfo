import { existsSync, readdirSync, readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

describe("ReadOnlyAppMcpPreviewPage", () => {
  it("renders the shipped read-only app/MCP preview composition from synthetic props", async () => {
    const html = await renderPreviewPage();

    expect(html).toContain("Pocket CFO read-only app/MCP preview");
    expect(html).toContain("Local read-only premium UI preview");
    expect(html).toContain("Read-only preview status");
    expect(html).toContain("Synthetic preview evidence card");
    expect(html).toContain("Citation rail");
    expect(html).toContain("Source anchor panel");
    expect(html).toContain("Freshness: Fresh");
    expect(html).toContain("Privacy boundary");
    expect(html).toContain("No-runtime boundary");
    expect(html).toContain("Synthetic contract-shaped examples only.");
    expect(html).toContain("No web API route, backend route, endpoint, or remote MCP server.");
    expect(html).toContain("No Apps SDK resource, OAuth, app submission asset, OpenAI API call, or model call.");
    expect(html).not.toContain("not checked-in sample company data");
  });

  it("declares local-preview robots metadata without runtime behavior", async () => {
    const mod = await import("./page");

    expect(mod.metadata).toEqual({
      title: "Pocket CFO local read-only app/MCP preview",
      robots: {
        follow: false,
        index: false,
        noarchive: true,
      },
    });
  });

  it("keeps the route free of controls, POST transport, server actions, and fetches", async () => {
    const html = await renderPreviewPage();
    const source = readRouteSource();

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

    for (const forbiddenSource of [
      "fetch(",
      "getControlPlane",
      "getSourceList",
      "getMissionList",
      "use server",
      "export async function POST",
      "NextResponse",
      "FormData",
      "OPENAI_API_KEY",
      "process.env",
      "openai.",
      "from \"openai\"",
      "from 'openai'",
    ]) {
      expect(source).not.toContain(forbiddenSource);
    }
  });

  it("does not render raw/private field names, advice-like CTA copy, or public assets", async () => {
    const html = await renderPreviewPage();
    const visibleText = stripTags(html).toLowerCase();

    for (const fieldName of forbiddenRenderedFieldNames) {
      expect(html).not.toContain(fieldName);
    }

    for (const forbiddenPhrase of [
      "you should",
      "financial advice",
      "finance advice",
      "recommended action",
      "take action now",
      "generated finance advice",
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

    expect(html).not.toContain(".png");
    expect(html).not.toContain(".jpg");
    expect(html).not.toContain(".jpeg");
    expect(html).not.toContain(".webp");
    expect(html).not.toContain("screenshot");
    expect(routeDirectoryAssets()).toEqual([]);
  });

  it("keeps the local route boundary to one page and no adjacent API route", () => {
    const routeFiles = readdirSync(new URL("./", import.meta.url)).filter(
      (name) => !name.endsWith(".spec.tsx"),
    );

    expect(routeFiles).toEqual(["page.tsx"]);
    expect(
      existsSync(new URL("../api/read-only-app-mcp-preview", import.meta.url)),
    ).toBe(false);
  });
});

async function renderPreviewPage() {
  const mod = await import("./page");

  return renderToStaticMarkup(<mod.default />);
}

function readRouteSource() {
  return readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
}

function routeDirectoryAssets() {
  return readdirSync(new URL("./", import.meta.url)).filter((name) =>
    /\.(png|jpe?g|webp|gif|svg)$/iu.test(name),
  );
}

function stripTags(html: string) {
  return html.replace(/<[^>]+>/gu, "").replace(/\s+/gu, " ").trim();
}

const forbiddenRenderedFieldNames = [
  "rawFullText",
  "rawFileText",
  "fullText",
  "fullFileText",
  "fileContents",
  "unboundedText",
  "originalFullText",
  "sourceText",
  "rawMarkdown",
  "documentText",
  "pageTextDump",
  "privateSourceText",
  "private_source_text",
  "credentials",
  "tokens",
  "oauthMaterial",
  "oauth_material",
  "apiKeys",
  "api_keys",
  "objectStoreDumps",
  "object_store_dumps",
  "databaseDumps",
  "database_dumps",
  "providerCredentials",
  "provider_credentials",
];
