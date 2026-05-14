import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  FP0108_EVIDENCE_TOOL_DISPATCH_PLAN_PATH,
  FP0109_EVIDENCE_DISPATCH_ADAPTER_PLAN_PATH,
  MCP_TOOL_ALLOWLIST,
  buildEvidenceToolDispatchProof,
} from "../packages/domain/src/index.ts";
import {
  LocalReadOnlyEvidenceToolDispatchAdapter,
  exactEvidenceDispatchAdapterToolNames,
} from "../apps/control-plane/src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.ts";
import { ReadOnlyAppMcpEndpointService } from "../apps/control-plane/src/modules/read-only-app-mcp-endpoint/service.ts";

const SCHEMA_VERSION =
  "v2ac.read-only-app-mcp-evidence-dispatch-adapter-proof.v1";
const FP0107_PLAN =
  "plans/FP-0107-read-only-chatgpt-app-mcp-local-fastify-mcp-route-adapter-foundation.md";
const FP0106_PLAN =
  "plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md";
const FP0100_PLAN =
  "plans/FP-0100-read-only-chatgpt-app-mcp-public-app-security-boundary-contracts-foundation.md";
const ROUTE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const SERVICE_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/service.ts";
const FORMATTER_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/formatter.ts";
const SCHEMA_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/schema.ts";
const DISPATCHER_PATH =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.ts";

const repoPaths = repoFilePaths();
const changedPaths = changedFilePaths();
const routeRuntimeSource = [
  ROUTE_PATH,
  SERVICE_PATH,
  FORMATTER_PATH,
  SCHEMA_PATH,
  DISPATCHER_PATH,
]
  .map(safeRead)
  .join("\n");
const proofSourceScan = durableNoApiModelKeyScan();
const runtimeScopeScan = runtimeForbiddenScopeScan();
const changedScopeScan = changedFileScopeScan();

const dispatcherService = trackingService();
const adapter = new LocalReadOnlyEvidenceToolDispatchAdapter(dispatcherService);
const dispatchResults = Object.fromEntries(
  MCP_TOOL_ALLOWLIST.map((toolName) => [
    toolName,
    adapter.dispatchTool({
      arguments: validArgumentsFor(toolName),
      toolName,
    }),
  ]),
);
const defaultFailClosedResponse = new ReadOnlyAppMcpEndpointService().handle({
  id: "default-call",
  jsonrpc: "2.0",
  method: "tools/call",
  params: {
    arguments: validArgumentsFor("search_evidence"),
    name: "search_evidence",
  },
});
const injectedResponse = new ReadOnlyAppMcpEndpointService({
  evidenceToolDispatcher: adapter,
}).handle({
  id: "injected-call",
  jsonrpc: "2.0",
  method: "tools/call",
  params: {
    arguments: validArgumentsFor("search_evidence"),
    name: "search_evidence",
  },
});

const refusalAdapter = new LocalReadOnlyEvidenceToolDispatchAdapter(
  refusalService(),
);
const proof = {
  schemaVersion: SCHEMA_VERSION,
  localDispatchAdapterOnly: true,
  evidenceDispatchAdapterImplemented:
    existsSync(DISPATCHER_PATH) &&
    safeRead(DISPATCHER_PATH).includes(
      "LocalReadOnlyEvidenceToolDispatchAdapter",
    ),
  exactlyV2gToolAllowlist: sameList(
    exactEvidenceDispatchAdapterToolNames(),
    MCP_TOOL_ALLOWLIST,
  ),
  exactArgumentSchemasPreserved:
    safeRead(SCHEMA_PATH).includes(
      "EVIDENCE_TOOL_DISPATCH_ARGUMENT_SCHEMAS_BY_TOOL",
    ) &&
    safeRead(DISPATCHER_PATH).includes(
      "EVIDENCE_TOOL_DISPATCH_ARGUMENT_SCHEMAS_BY_TOOL",
    ),
  defaultRouteToolsCallStillFailClosed:
    defaultFailClosedResponse?.result?.isError === true &&
    defaultFailClosedResponse.result.structuredContent?.refusalReason ===
      "tool_dispatch_not_implemented_until_later_finance_plan",
  injectedDispatcherToolsCallEnabled:
    injectedResponse?.result?.isError === false &&
    injectedResponse.result.structuredContent?.refusalReason === null,
  searchEvidenceDispatchAdapterVerified:
    dispatcherService.calls.searchEvidence === 2 &&
    dispatchResults.search_evidence.isError === false,
  fetchEvidenceCardDispatchAdapterVerified:
    dispatcherService.calls.fetchEvidenceCard === 1 &&
    dispatchResults.fetch_evidence_card.isError === false,
  fetchSourceAnchorDispatchAdapterVerified:
    dispatcherService.calls.fetchSourceAnchor === 1 &&
    dispatchResults.fetch_source_anchor.isError === false,
  fetchDocumentMapDispatchAdapterVerified:
    dispatcherService.calls.fetchDocumentMap === 1 &&
    dispatchResults.fetch_document_map.isError === false,
  fetchSourceCoverageDispatchAdapterVerified:
    dispatcherService.calls.fetchSourceCoverage === 1 &&
    dispatchResults.fetch_source_coverage.isError === false,
  fetchCompanyPostureDispatchAdapterVerified:
    dispatcherService.calls.fetchCompanyPosture === 1 &&
    dispatchResults.fetch_company_posture.isError === false,
  fetchCapabilityBoundariesDispatchAdapterVerified:
    dispatcherService.calls.fetchCapabilityBoundaries === 1 &&
    dispatchResults.fetch_capability_boundaries.isError === false,
  structuredContentEnvelopeVerified: Object.values(dispatchResults).every(
    (result) =>
      Array.isArray(result.content) &&
      typeof result.structuredContent === "object" &&
      result.structuredContent !== null &&
      Object.hasOwn(result.structuredContent, "evidence") &&
      Object.hasOwn(result.structuredContent, "sourceAnchors") &&
      Object.hasOwn(result.structuredContent, "freshness") &&
      Object.hasOwn(result.structuredContent, "limitations") &&
      Object.hasOwn(result.structuredContent, "permittedNextActions") &&
      Object.hasOwn(result.structuredContent, "refusalReason") &&
      Object.hasOwn(result.structuredContent, "capabilityBoundary") &&
      typeof result.isError === "boolean",
  ),
  evidenceFreshnessLimitationsVerified: Object.values(dispatchResults).every(
    (result) =>
      result.structuredContent.evidence.length > 0 &&
      result.structuredContent.freshness.state === "fresh" &&
      Array.isArray(result.structuredContent.limitations),
  ),
  refusalEnvelopeVerified:
    refusalFor("missing").isError === true &&
    refusalFor("unsupported").structuredContent.evidence.length === 0,
  missingEvidenceFailsClosed:
    refusalFor("missing").structuredContent.refusalReason ===
    "missing_evidence",
  missingCitationFailsClosed:
    refusalFor("missingCitation").structuredContent.refusalReason ===
    "missing_citation",
  unsupportedEvidenceFailsClosed:
    refusalFor("unsupported").structuredContent.refusalReason ===
    "unsupported_evidence",
  staleEvidenceFailsClosed:
    refusalFor("stale").structuredContent.refusalReason === "stale_evidence",
  conflictingEvidenceFailsClosed:
    refusalFor("conflicting").structuredContent.refusalReason ===
    "conflicting_evidence",
  invalidToolFailsClosed:
    adapter.dispatchTool({ arguments: {}, toolName: "send_report" })
      .structuredContent.refusalReason === "invalid_tool",
  invalidArgumentsFailClosed:
    adapter.dispatchTool({
      arguments: { companyKey: "acme" },
      toolName: "search_evidence",
    }).structuredContent.refusalReason === "invalid_arguments",
  noRawFullFileDump:
    !/rawFullText|rawFileText|fullFileText|fileContents/u.test(
      routeRuntimeSource,
    ) && !JSON.stringify(dispatchResults).includes("sk-test-secret"),
  noGeneratedFinanceAdvice:
    runtimeScopeScan.noGeneratedFinanceAdvice &&
    Object.values(dispatchResults).every(
      (result) =>
        result.structuredContent.capabilityBoundary
          .generatedFinanceAdviceEmitted === false,
    ),
  noSourceMutation: runtimeScopeScan.noSourceMutation,
  noFinanceWrite: runtimeScopeScan.noFinanceWrite,
  noProviderCalls: runtimeScopeScan.noProviderCalls,
  noExternalCommunications: runtimeScopeScan.noExternalCommunications,
  noOpenAiApiCalls: proofSourceScan.noOpenAiApiCalls,
  noModelCalls: proofSourceScan.noModelCalls,
  noOpenAiClientOrKeyUsage: proofSourceScan.noOpenAiClientOrKeyUsage,
  noDbQueriesAdded: changedScopeScan.noDbQueriesAdded,
  noSchemaMigrationsAdded: changedScopeScan.noSchemaMigrationsAdded,
  noRouteExpansion:
    countMatches(safeRead(ROUTE_PATH), /app\.post\("\/mcp"/gu) === 1 &&
    countMatches(safeRead(ROUTE_PATH), /app\.get\("\/mcp"/gu) === 1,
  noOauthTokenSessionImplementation:
    runtimeScopeScan.noOauthTokenSessionImplementation,
  noRemoteMcpDeployment: runtimeScopeScan.noRemoteMcpDeployment,
  noAppsSdkResourceImplementation:
    runtimeScopeScan.noAppsSdkResourceImplementation,
  noAppSubmission: changedScopeScan.noAppSubmission,
  noPublicAssets: changedScopeScan.noPublicAssets,
  fp0109BoundaryVerified: fp0109BoundaryVerified(),
  fp0110Absent: !repoPaths.some((path) => /(^|\/)FP-0110/u.test(path)),
  fp0108EvidenceToolDispatchContractsStillVerified:
    buildEvidenceToolDispatchProof({
      fp0109BoundaryVerified: true,
      fp0110Absent: true,
      noDispatchRuntimeImplemented: true,
    }).evidenceToolDispatchContractsVerified === true,
  fp0107RouteAdapterBoundaryStillVerified: fp0107BoundaryVerified(),
  fp0106ProtocolEnvelopeBoundaryStillVerified: docsBoundary(FP0106_PLAN, [
    "mcp protocol envelope",
    "tools/call",
    "no openai api/model calls",
  ]),
  fp0100PublicSecurityBoundaryStillVerified: docsBoundary(FP0100_PLAN, [
    "public-app security boundary contract",
    "local/proof-only",
    "no endpoints",
  ]),
};

for (const [key, value] of Object.entries(proof)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(`FP-0109 evidence dispatch adapter proof failed: ${key}`);
  }
}

console.log(JSON.stringify(proof, null, 2));

function refusalFor(kind) {
  return refusalAdapter.dispatchTool({
    arguments: { companyKey: "acme", query: kind },
    toolName: "search_evidence",
  });
}

function trackingService() {
  const calls = {
    fetchCapabilityBoundaries: 0,
    fetchCompanyPosture: 0,
    fetchDocumentMap: 0,
    fetchEvidenceCard: 0,
    fetchSourceAnchor: 0,
    fetchSourceCoverage: 0,
    searchEvidence: 0,
  };

  return {
    calls,
    fetchCapabilityBoundaries() {
      calls.fetchCapabilityBoundaries += 1;
      return responseFor("fetch_capability_boundaries");
    },
    fetchCompanyPosture() {
      calls.fetchCompanyPosture += 1;
      return responseFor("fetch_company_posture");
    },
    fetchDocumentMap() {
      calls.fetchDocumentMap += 1;
      return responseFor("fetch_document_map");
    },
    fetchEvidenceCard() {
      calls.fetchEvidenceCard += 1;
      return responseFor("fetch_evidence_card");
    },
    fetchSourceAnchor() {
      calls.fetchSourceAnchor += 1;
      return responseFor("fetch_source_anchor");
    },
    fetchSourceCoverage() {
      calls.fetchSourceCoverage += 1;
      return responseFor("fetch_source_coverage");
    },
    searchEvidence() {
      calls.searchEvidence += 1;
      return responseFor("search_evidence");
    },
  };
}

function refusalService() {
  return {
    fetchCapabilityBoundaries: () => responseFor("fetch_capability_boundaries"),
    fetchCompanyPosture: () => responseFor("fetch_company_posture"),
    fetchDocumentMap: () => responseFor("fetch_document_map"),
    fetchEvidenceCard: () => responseFor("fetch_evidence_card"),
    fetchSourceAnchor: () => responseFor("fetch_source_anchor"),
    fetchSourceCoverage: () => responseFor("fetch_source_coverage"),
    searchEvidence(input) {
      switch (input.query) {
        case "missing":
          return responseFor("search_evidence", {
            citations: [],
            evidence: [],
            freshness: { ...freshness(), state: "missing" },
            limitations: [limitation("source_not_indexed")],
            ok: false,
            result: null,
            unsupportedReason: "Missing evidence.",
          });
        case "missingCitation":
          return responseFor("search_evidence", { citations: [] });
        case "unsupported":
          return responseFor("search_evidence", {
            limitations: [limitation("unsupported_pdf")],
            ok: false,
            result: null,
            unsupportedReason: "Unsupported evidence.",
          });
        case "stale":
          return responseFor("search_evidence", {
            freshness: { ...freshness(), state: "stale" },
          });
        case "conflicting":
          return responseFor("search_evidence", {
            freshness: { ...freshness(), state: "mixed" },
          });
        default:
          return responseFor("search_evidence");
      }
    },
  };
}

function responseFor(toolName, overrides = {}) {
  const citation = {
    checksumSha256: "a".repeat(64),
    citationType: "source_anchor",
    id: "source-anchor-1",
    locator: "line 1",
    sourceAnchorId: "source-anchor-1",
    sourceId: "11111111-1111-4111-8111-111111111111",
    sourceSnapshotId: "22222222-2222-4222-8222-222222222222",
    summary: "Synthetic proof citation.",
  };
  const base = {
    appMode: "local_proof",
    audit: {
      appMode: "local_proof",
      artifactIds: ["artifact-1"],
      companyKey: "acme",
      excerptCharacterCount: 24,
      forbiddenRequestBlocked: false,
      id: `audit:${toolName}`,
      normalizedQuery: toolName === "search_evidence" ? "deterministic" : null,
      redactionCount: 0,
      sourceAnchorIds: ["source-anchor-1"],
      timestamp: "2026-05-14T00:00:00.000Z",
      toolName,
      unsupportedReason: null,
    },
    capabilityBoundaries: [limitation("not_source_truth", "warning")],
    citations: [citation],
    companyKey: "acme",
    evidence: [citation],
    forbiddenActions: ["write_finance_twin_fact", "send_report"],
    freshness: freshness(),
    limitations: [],
    ok: true,
    permittedNextActions: [
      {
        action: "request_human_review",
        label: "Review the source-backed structured result.",
        targetId: "artifact-1",
      },
    ],
    redactions: [],
    result: { id: `${toolName}:result`, safeExcerpt: "bounded excerpt" },
    schemaVersion: "v2c.evidence-tool.v1",
    toolName,
    unsupportedReason: null,
  };

  return { ...base, ...overrides };
}

function freshness() {
  return {
    checkedAt: "2026-05-14T00:00:00.000Z",
    compiledAt: null,
    extractedAt: null,
    sourceCapturedAt: "2026-05-14T00:00:00.000Z",
    state: "fresh",
    summary: "Synthetic proof freshness.",
  };
}

function limitation(code, severity = "blocking") {
  return {
    affectedAnchorIds: [],
    affectedSourceIds: [],
    code,
    severity,
    summary: `Synthetic ${code} proof limitation.`,
  };
}

function validArgumentsFor(toolName) {
  switch (toolName) {
    case "search_evidence":
      return { companyKey: "acme", limit: 3, query: "deterministic" };
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

function fp0109BoundaryVerified() {
  const fp0109Hits = repoPaths.filter((path) => /(^|\/)FP-0109/u.test(path));
  if (
    fp0109Hits.length !== 1 ||
    fp0109Hits[0] !== FP0109_EVIDENCE_DISPATCH_ADAPTER_PLAN_PATH ||
    !existsSync(FP0109_EVIDENCE_DISPATCH_ADAPTER_PLAN_PATH)
  ) {
    return false;
  }

  const normalized = normalize(
    safeRead(FP0109_EVIDENCE_DISPATCH_ADAPTER_PLAN_PATH),
  );
  return [
    "local-only",
    "read-only",
    "dependency-injected",
    "evidence/source-envelope implementation",
    "default fail-closed",
    "does not add route paths",
    "db query",
    "openai api/model",
    "source mutation",
    "finance write",
    "no generated finance advice",
    "autonomous action",
    "public app implementation and public app submission remain future-only",
  ].every((text) => normalized.includes(text));
}

function fp0107BoundaryVerified() {
  return (
    docsBoundary(FP0107_PLAN, [
      "local-only fastify",
      "tools/call",
      "fail-closed",
    ]) &&
    defaultFailClosedResponse?.result?.isError === true
  );
}

function docsBoundary(path, requiredTexts) {
  if (!repoPaths.includes(path) || !existsSync(path)) return false;
  const normalized = normalize(safeRead(path));
  return requiredTexts.every((requiredText) =>
    normalized.includes(requiredText),
  );
}

function changedFileScopeScan() {
  const allowed = new Set([
    FP0108_EVIDENCE_TOOL_DISPATCH_PLAN_PATH,
    FP0109_EVIDENCE_DISPATCH_ADAPTER_PLAN_PATH,
    ROUTE_PATH,
    SERVICE_PATH,
    FORMATTER_PATH,
    SCHEMA_PATH,
    DISPATCHER_PATH,
    "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.spec.ts",
    "apps/control-plane/src/modules/read-only-app-mcp-endpoint/service.spec.ts",
    "apps/control-plane/src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts",
    "packages/domain/src/read-only-app-mcp-evidence-tool-dispatch-constants.ts",
    "packages/domain/src/read-only-app-mcp-evidence-tool-dispatch-proof.ts",
    "packages/domain/src/read-only-app-mcp-evidence-tool-dispatch.spec.ts",
    "tools/read-only-mcp-evidence-tool-dispatch-adapter-proof.mjs",
    "tools/read-only-mcp-evidence-tool-dispatch-proof.mjs",
    "tools/read-only-mcp-route-adapter-proof.mjs",
    "tools/read-only-mcp-protocol-envelope-proof.mjs",
    "tools/read-only-endpoint-route-ownership-proof.mjs",
    "tools/read-only-endpoint-architecture-proof.mjs",
    "tools/read-only-public-app-security-boundary-proof.mjs",
    "tools/read-only-mcp-descriptor-response-envelope-proof.mjs",
    "tools/read-only-chatgpt-app-mcp-proof.mjs",
    "tools/benchmark-community-pack-proof.mjs",
    "README.md",
    "CODEX_README.md",
    "START_HERE.md",
    "docs/ACTIVE_DOCS.md",
    "docs/PROJECT_STATE.md",
    "docs/V2_BOUNDARY.md",
    "docs/security/read-only-agent-threat-model.md",
    "docs/security/finance-data-threat-model.md",
    "docs/demo/demo-data-policy.md",
    "plans/ROADMAP.md",
    "plugins.md",
  ]);
  const publicAssetPattern =
    /\.(?:png|jpe?g|gif|webp|svg|ico|avif|mp4|mov|pdf)$/iu;
  const changedFilesAllowed = changedPaths.every(
    (path) =>
      allowed.has(path) ||
      /^packages\/domain\/src\/read-only-app-mcp.*\.ts$/u.test(path) ||
      /^packages\/domain\/src\/benchmark-community.*\.ts$/u.test(path),
  );
  const noPublicArtifacts = !changedPaths.some(
    (path) =>
      publicAssetPattern.test(path) ||
      /app-submission|submission-assets|public-listing|store-listing|listing-copy|screenshots/iu.test(
        path,
      ),
  );

  return {
    noAppSubmission: noPublicArtifacts && changedFilesAllowed,
    noDbQueriesAdded:
      changedFilesAllowed &&
      !changedPaths.some((path) => /^packages\/db\//u.test(path)),
    noPublicAssets: noPublicArtifacts && changedFilesAllowed,
    noSchemaMigrationsAdded:
      changedFilesAllowed &&
      !changedPaths.some((path) =>
        /(?:^|\/)(?:migrations?|drizzle|schema)\//iu.test(path),
      ),
  };
}

function runtimeForbiddenScopeScan() {
  return {
    noAppsSdkResourceImplementation:
      !/\b(?:registerResource|ui:\/\/|resource registration)\b/u.test(
        routeRuntimeSource,
      ),
    noExternalCommunications:
      !/\b(?:sendEmail|sendReport|contactCustomer|externalMessage)\s*\(/u.test(
        routeRuntimeSource,
      ),
    noFinanceWrite:
      !/\b(?:updateLedger|writeFinanceTwin|writeAccountingRecord)\s*\(/u.test(
        routeRuntimeSource,
      ),
    noGeneratedFinanceAdvice:
      !/\b(?:generateFinanceAdvice|generatedFinanceAdviceAllowed:\s*true)\b/u.test(
        routeRuntimeSource,
      ),
    noOauthTokenSessionImplementation:
      !/\b(?:oauthCallback|tokenExchange|sessionHandler|setCookie)\b/u.test(
        routeRuntimeSource,
      ),
    noProviderCalls:
      !/\b(?:providerConnect|callProvider|createProviderJob)\s*\(/u.test(
        routeRuntimeSource,
      ),
    noRemoteMcpDeployment:
      !/\b(?:listen\s*\(|deploy|remoteMcp|mcpServerRuntime)\b/u.test(
        routeRuntimeSource,
      ),
    noSourceMutation:
      !/\b(?:uploadSource|mutateSource|rewriteSource|deleteSource)\s*\(/u.test(
        routeRuntimeSource,
      ),
  };
}

function durableNoApiModelKeyScan() {
  const text = repoPaths.filter(isDurableScanPath).map(safeRead).join("\n");
  const packageName = ["open", "ai"].join("");
  const clientName = ["Open", "AI"].join("");
  const keyName = ["OPENAI", "API", "KEY"].join("_");
  const hostName = ["api", packageName, "com"].join(".");
  const callModelName = ["call", "Model"].join("");
  const noOpenAiApiCalls = ![
    new RegExp(`\\bfrom\\s+["']${packageName}["']`, "u"),
    new RegExp(`\\bimport\\s*\\(\\s*["']${packageName}["']\\s*\\)`, "u"),
    new RegExp(`\\brequire\\s*\\(\\s*["']${packageName}["']\\s*\\)`, "u"),
    new RegExp(`\\bnew\\s+${clientName}\\b`, "u"),
    new RegExp(`\\b${packageName}\\s*\\.`, "u"),
    new RegExp(`\\b${escapeRegExp(hostName)}\\b`, "u"),
  ].some((pattern) => pattern.test(text));
  const noModelCalls = ![
    new RegExp(`\\b${callModelName}\\s*\\(`, "u"),
    dottedPattern("model", "create"),
    dottedPattern("models", "create"),
    dottedPattern("chat", "completions"),
    dottedPattern("responses", "create"),
  ].some((pattern) => pattern.test(text));
  const noOpenAiClientOrKeyUsage =
    noOpenAiApiCalls &&
    ![
      new RegExp(`\\bnew\\s+${clientName}\\b`, "u"),
      new RegExp(`\\bprocess\\s*\\.\\s*env\\s*\\.\\s*${keyName}\\b`, "u"),
      new RegExp(`\\b${keyName}\\b`, "u"),
    ].some((pattern) => pattern.test(text));

  return {
    noModelCalls,
    noOpenAiApiCalls,
    noOpenAiClientOrKeyUsage,
  };
}

function isDurableScanPath(path) {
  return (
    /^apps\/control-plane\/src\/modules\/read-only-app-mcp-endpoint\/.*\.ts$/u.test(
      path,
    ) ||
    /^apps\/control-plane\/src\/modules\/evidence-index\/tools\/.*\.ts$/u.test(
      path,
    ) ||
    /^packages\/domain\/src\/read-only-app-mcp-evidence-tool-dispatch.*\.ts$/u.test(
      path,
    ) ||
    /^packages\/domain\/src\/read-only-app-mcp-protocol-envelope.*\.ts$/u.test(
      path,
    ) ||
    /^tools\/read-only-mcp-evidence-tool-dispatch.*\.mjs$/u.test(path) ||
    path === "tools/read-only-mcp-route-adapter-proof.mjs" ||
    path === "tools/read-only-mcp-protocol-envelope-proof.mjs"
  );
}

function dottedPattern(left, right) {
  return new RegExp(`\\b${left}\\s*\\.\\s*${right}\\b`, "u");
}

function changedFilePaths() {
  const tracked = runGit(["diff", "--name-only", "origin/main", "--"]);
  const untracked = runGit(["ls-files", "--others", "--exclude-standard"]);
  return [...new Set([...tracked, ...untracked].filter(Boolean))].sort();
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

function runGit(args) {
  return execFileSync("git", args, { encoding: "utf8" })
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
}

function safeRead(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function sameList(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function normalize(value) {
  return value.toLowerCase().replace(/`/gu, "");
}
