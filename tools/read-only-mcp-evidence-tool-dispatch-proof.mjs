import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  EvidenceToolDispatchProofSchema,
  FP0108_EVIDENCE_TOOL_DISPATCH_PLAN_PATH,
  MCP_TOOL_ALLOWLIST,
  buildEvidenceToolDispatchProof,
} from "../packages/domain/src/index.ts";
import { ReadOnlyAppMcpEndpointService } from "../apps/control-plane/src/modules/read-only-app-mcp-endpoint/service.ts";

const FP0107_PLAN =
  "plans/FP-0107-read-only-chatgpt-app-mcp-local-fastify-mcp-route-adapter-foundation.md";
const FP0106_PLAN =
  "plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md";
const FP0100_PLAN =
  "plans/FP-0100-read-only-chatgpt-app-mcp-public-app-security-boundary-contracts-foundation.md";

const repoPaths = repoFilePaths();
const changedPaths = changedFilePaths();
const sourceText = readChangedCodeSourceText();
const sourceScan = noApiModelClientKeyUsage(sourceText);
const proof = EvidenceToolDispatchProofSchema.parse(
  buildEvidenceToolDispatchProof({
    fp0100PublicSecurityBoundaryStillVerified: docsBoundary(FP0100_PLAN, [
      "public-app security boundary contract",
      "local/proof-only",
      "no endpoints",
    ]),
    fp0106ProtocolEnvelopeBoundaryStillVerified: docsBoundary(FP0106_PLAN, [
      "mcp protocol envelope and tool-dispatch proof-contract",
      "tools/call",
      "no openai api/model calls",
    ]),
    fp0107RouteAdapterBoundaryStillVerified:
      fp0107RouteAdapterBoundaryStillVerified(),
    fp0108BoundaryVerified: fp0108BoundaryVerified(),
    fp0109Absent: fp0109Absent(),
    noDispatchRuntimeImplemented: noDispatchRuntimeImplemented(),
    noModelCalls: sourceScan.noModelCalls,
    noOpenAiApiCalls: sourceScan.noOpenAiApiCalls,
    noOpenAiClientOrKeyUsage: sourceScan.noOpenAiClientOrKeyUsage,
    routeAdapterToolsCallStillFailClosed:
      routeAdapterToolsCallStillFailClosed(),
  }),
);

for (const [key, value] of Object.entries(proof)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(`FP-0108 evidence tool dispatch proof failed: ${key}`);
  }
}

console.log(JSON.stringify(proof, null, 2));

function fp0108BoundaryVerified() {
  const fp0108Hits = repoPaths.filter((path) => /(^|\/)FP-0108/u.test(path));
  if (
    fp0108Hits.length !== 1 ||
    fp0108Hits[0] !== FP0108_EVIDENCE_TOOL_DISPATCH_PLAN_PATH ||
    !existsSync(FP0108_EVIDENCE_TOOL_DISPATCH_PLAN_PATH)
  ) {
    return false;
  }

  const normalized = normalize(
    readFileSync(FP0108_EVIDENCE_TOOL_DISPATCH_PLAN_PATH, "utf8"),
  );
  return [
    "local/proof-only/read-only contract foundation",
    "does not change route behavior",
    "does not implement dispatch",
    "tools/call",
    "fail-closed",
    "evidencetooldispatchproofcontract",
    "evidencetooldispatchallowlistboundary",
    "evidencetoolargumentschemaboundary",
    "evidencetoolservicedependencyboundary",
    "evidencetoolresponseenvelopeboundary",
    "evidencetoolrefusalenvelopeboundary",
    "evidencetoolfreshnessboundary",
    "evidencetoolsourceanchorboundary",
    "evidencetoolnorawdumpboundary",
    "evidencetoolnomutationboundary",
    "evidencetoolnofinancewriteboundary",
    "evidencetoolnoproviderexternalcallboundary",
    "evidencetoolnoopenaimodelboundary",
    "evidencetooldispatchproof",
    "no dispatch runtime",
    "no route behavior",
    "no db query",
    "no openai api/model call",
    "no source mutation",
    "no finance write",
    "no generated finance advice",
    "no autonomous action",
  ].every((requiredText) => normalized.includes(requiredText));
}

function fp0109Absent() {
  return !repoPaths.some((path) => /(^|\/)FP-0109/u.test(path));
}

function fp0107RouteAdapterBoundaryStillVerified() {
  return (
    existsSync(FP0107_PLAN) &&
    docsBoundary(FP0107_PLAN, [
      "local-only fastify",
      "tools/call",
      "fail-closed",
    ]) &&
    routeAdapterToolsCallStillFailClosed()
  );
}

function routeAdapterToolsCallStillFailClosed() {
  const service = new ReadOnlyAppMcpEndpointService();

  return MCP_TOOL_ALLOWLIST.every((toolName) => {
    const response = service.handle({
      id: `fp0108-${toolName}`,
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        arguments: validArgumentsFor(toolName),
        name: toolName,
      },
    });
    const structuredContent = response?.result?.structuredContent;
    return (
      response?.result?.isError === true &&
      structuredContent?.toolName === toolName &&
      structuredContent?.capabilityBoundary?.toolDispatchImplemented ===
        false &&
      structuredContent?.refusalReason ===
        "tool_dispatch_not_implemented_until_later_finance_plan"
    );
  });
}

function noDispatchRuntimeImplemented() {
  const runtimeSource = [
    "apps/control-plane/src/modules/read-only-app-mcp-endpoint/service.ts",
    "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts",
    "apps/control-plane/src/modules/read-only-app-mcp-endpoint/formatter.ts",
    "apps/control-plane/src/modules/read-only-app-mcp-endpoint/schema.ts",
  ]
    .map(safeRead)
    .join("\n");

  return (
    !runtimeSource.includes("ReadOnlyEvidenceToolService") &&
    !runtimeSource.includes("buildEvidenceToolDispatch") &&
    !runtimeSource.includes("evidence-index/tools/service") &&
    !changedPaths.some((path) =>
      /^apps\/control-plane\/src\/modules\/evidence-index\/tools\//u.test(path),
    )
  );
}

function validArgumentsFor(toolName) {
  switch (toolName) {
    case "search_evidence":
      return { companyKey: "acme", limit: 3, query: "cash posture" };
    case "fetch_evidence_card":
      return { companyKey: "acme", evidenceCardId: "evidence-card-1" };
    case "fetch_source_anchor":
      return { companyKey: "acme", sourceAnchorId: "source-anchor-1" };
    case "fetch_document_map":
      return { companyKey: "acme", documentMapId: "document-map-1" };
    case "fetch_source_coverage":
      return { companyKey: "acme", sourceId: "source-1" };
    case "fetch_company_posture":
      return { companyKey: "acme", periodKey: "2026-04" };
    case "fetch_capability_boundaries":
      return { companyKey: "acme" };
  }
}

function docsBoundary(path, requiredTexts) {
  if (!repoPaths.includes(path) || !existsSync(path)) return false;
  const normalized = normalize(readFileSync(path, "utf8"));
  return requiredTexts.every((requiredText) =>
    normalized.includes(requiredText),
  );
}

function readChangedCodeSourceText() {
  return changedPaths
    .filter((path) => /\.(?:ts|tsx|js|mjs|cjs)$/u.test(path))
    .map(safeRead)
    .join("\n");
}

function noApiModelClientKeyUsage(text) {
  const packageName = ["open", "ai"].join("");
  const clientName = ["Open", "AI"].join("");
  const keyName = ["OPENAI", "API", "KEY"].join("_");
  const hostName = ["api", packageName, "com"].join(".");
  const apiPatterns = [
    new RegExp(`\\bfrom\\s+["']${packageName}["']`, "u"),
    new RegExp(`\\bimport\\s*\\(\\s*["']${packageName}["']\\s*\\)`, "u"),
    new RegExp(`\\brequire\\s*\\(\\s*["']${packageName}["']\\s*\\)`, "u"),
    new RegExp(`\\bnew\\s+${clientName}\\b`, "u"),
    new RegExp(`\\b${packageName}\\s*\\.`, "u"),
    new RegExp(`\\b${hostName}\\b`, "u"),
  ];
  const modelPatterns = [
    /\bcallModel\b/u,
    /\bmodel\s*\.\s*create\b/u,
    /\bmodels\s*\.\s*create\b/u,
    /\bchat\s*\.\s*completions\b/u,
    /\bresponses\s*\.\s*create\b/u,
  ];
  const keyPatterns = [
    new RegExp(`\\bprocess\\s*\\.\\s*env\\s*\\.\\s*${keyName}\\b`, "u"),
    new RegExp(`\\b${keyName}\\b`, "u"),
  ];
  const noOpenAiApiCalls = !apiPatterns.some((pattern) => pattern.test(text));
  const noModelCalls = !modelPatterns.some((pattern) => pattern.test(text));
  const noOpenAiClientOrKeyUsage =
    noOpenAiApiCalls && !keyPatterns.some((pattern) => pattern.test(text));

  return {
    noModelCalls,
    noOpenAiApiCalls,
    noOpenAiClientOrKeyUsage,
  };
}

function safeRead(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function normalize(value) {
  return value.toLowerCase().replace(/`/gu, "");
}

function changedFilePaths() {
  const tracked = runGit(["diff", "--name-only", "origin/main", "--"]);
  const untracked = runGit(["ls-files", "--others", "--exclude-standard"]);
  return [...new Set([...tracked, ...untracked].filter(Boolean))].sort();
}

function runGit(args) {
  return execFileSync("git", args, { encoding: "utf8" })
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
}

function repoFilePaths() {
  const skippedDirectories = new Set([
    ".git",
    ".next",
    ".turbo",
    "coverage",
    "dist",
    "node_modules",
  ]);
  const results = [];

  function walk(directory, prefix = "") {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && skippedDirectories.has(entry.name)) continue;
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(`${directory}/${entry.name}`, relativePath);
      } else {
        results.push(relativePath);
      }
    }
  }

  walk(".");
  return results.sort();
}
