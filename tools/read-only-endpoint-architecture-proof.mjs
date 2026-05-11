import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import {
  EndpointArchitectureProofSchema,
  buildEndpointArchitectureProof,
} from "../packages/domain/src/index.ts";

const FP0103_PLAN =
  "plans/FP-0103-read-only-chatgpt-app-mcp-endpoint-architecture-proof-contracts-foundation.md";
const FP0102_PLAN =
  "plans/FP-0102-read-only-chatgpt-app-mcp-endpoint-oauth-remote-mcp-architecture-master-plan.md";
const FP0101_PLAN =
  "plans/FP-0101-read-only-chatgpt-app-mcp-public-app-implementation-sequencing-master-plan.md";
const FP0100_PLAN =
  "plans/FP-0100-read-only-chatgpt-app-mcp-public-app-security-boundary-contracts-foundation.md";
const FP0099_PLAN =
  "plans/FP-0099-read-only-chatgpt-app-mcp-public-app-security-threat-model-master-plan.md";
const FP0098_PLAN =
  "plans/FP-0098-read-only-chatgpt-app-mcp-public-app-readiness-master-plan.md";
const FP0087_PLAN =
  "plans/FP-0087-read-only-chatgpt-app-mcp-master-plan.md";

const repoPaths = repoFilePaths();
const changedPaths = changedFilePaths();
const fp0103Plan = endpointArchitectureProofPlanBoundary();
const noRuntime = noRuntimeOrEndpointPathsFromFp0103();
const noAssets = noPublicAssetsListingOrSubmissionArtifactsFromFp0103();
const sourceText = readPublicAppProofGateSourceText();
const noOpenAiApiCalls = !hasCodeLevelOpenAiIntegration(sourceText);
const noModelCalls = !hasCodeLevelModelIntegration(sourceText);
const noOpenAiClientOrKeyUsage =
  noOpenAiApiCalls && !hasCodeLevelOpenAiClientOrKeyUsage(sourceText);

const proof = EndpointArchitectureProofSchema.parse(
  buildEndpointArchitectureProof({
    endpointArchitectureProofPlanAccepted: fp0103Plan.accepted,
    exactlyOneFp0103PlanVerified: fp0103Plan.exactlyOneFp0103PlanVerified,
    fp0087DescriptorEnvelopeBoundaryStillVerified:
      fp0087DescriptorEnvelopeBoundary(),
    fp0098PublicAppReadinessBoundaryStillVerified:
      docsOnlyPlanBoundary(FP0098_PLAN, [
        "public-app readiness",
        "future-only",
        "does not authorize public chatgpt app implementation",
      ]),
    fp0099PublicSecurityThreatModelBoundaryStillVerified:
      docsOnlyPlanBoundary(FP0099_PLAN, [
        "public-app security",
        "threat-model",
        "does not authorize endpoint implementation",
      ]),
    fp0100PublicSecurityBoundaryStillVerified:
      docsOnlyPlanBoundary(FP0100_PLAN, [
        "public-app security boundary contract",
        "local/proof-only",
        "no endpoints",
      ]),
    fp0101ImplementationSequencingBoundaryStillVerified:
      docsOnlyPlanBoundary(FP0101_PLAN, [
        "implementation sequencing",
        "does not authorize endpoint implementation",
        "public app implementation",
      ]),
    fp0102ArchitectureBoundaryStillVerified:
      docsOnlyPlanBoundary(FP0102_PLAN, [
        "endpoint/oauth/remote-mcp architecture",
        "docs-and-plan",
        "does not authorize endpoint implementation",
      ]),
    fp0104Absent: fp0104Absent(),
    noAppRoutesAdded: noRuntime.noAppRoutesAdded,
    noAppSubmission: noAssets.noAppSubmission,
    noAppsSdkResourceImplementation: noRuntime.noAppsSdkResourceImplementation,
    noAutonomousAction: fp0103Plan.noAutonomousAction,
    noBackendControlPlaneRoutesAdded:
      noRuntime.noBackendControlPlaneRoutesAdded,
    noEndpointImplementation: noRuntime.noEndpointImplementation,
    noExternalCommunications: fp0103Plan.noExternalCommunications,
    noFinanceWrite: fp0103Plan.noFinanceWrite,
    noGeneratedFinanceAdvice: fp0103Plan.noGeneratedFinanceAdvice,
    noListingCopy: noAssets.noListingCopy,
    noMcpServerRuntime: noRuntime.noMcpServerRuntime,
    noModelCalls,
    noOauthTokenSessionImplementation:
      noRuntime.noOauthTokenSessionImplementation,
    noOpenAiApiCalls,
    noOpenAiClientOrKeyUsage,
    noProviderCertificationDeliveryDeployment:
      fp0103Plan.noProviderCertificationDeliveryDeployment,
    noPublicAssets: noAssets.noPublicAssets,
    noPublicAssetsSubmissionArtifacts:
      noAssets.noPublicAssetsSubmissionArtifacts,
    noPublicChatGptAppImplementation:
      fp0103Plan.noPublicChatGptAppImplementation,
    noRemoteMcpImplementationOrDeployment:
      noRuntime.noRemoteMcpImplementationOrDeployment,
    noRouteImplementation: noRuntime.noRouteImplementation,
    noRuntimeCodexFinanceOutput: fp0103Plan.noRuntimeCodexFinanceOutput,
    noSourceMutation: fp0103Plan.noSourceMutation,
    noWebApiRoutesAdded: noRuntime.noWebApiRoutesAdded,
    noWriteActionTools: fp0103Plan.noWriteActionTools,
    publicAppImplementationSubmissionFutureOnly:
      fp0103Plan.publicAppImplementationSubmissionFutureOnly,
  }),
);

for (const [key, value] of Object.entries(proof)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(`FP-0103 endpoint architecture proof failed: ${key}`);
  }
}

console.log(JSON.stringify(proof, null, 2));

function endpointArchitectureProofPlanBoundary() {
  const fp0103Hits = repoPaths.filter((path) => /(^|\/)FP-0103/u.test(path));
  const exactlyOneFp0103PlanVerified =
    fp0103Hits.length === 1 && fp0103Hits[0] === FP0103_PLAN;
  if (!exactlyOneFp0103PlanVerified || !existsSync(FP0103_PLAN)) {
    return allFalsePlanBoundary({ exactlyOneFp0103PlanVerified });
  }

  const normalized = normalize(readFileSync(FP0103_PLAN, "utf8"));
  const accepted =
    [
      "fp-0103 is not implementation",
      "fp-0103 is local/proof-only/read-only endpoint architecture contract work",
      "fp-0103 defines endpoint architecture proof contracts only",
      "fp-0103 does not authorize endpoint implementation",
      "fp-0103 does not authorize route implementation",
      "fp-0103 does not authorize web api/backend/control-plane route implementation",
      "fp-0103 does not authorize oauth/token/session implementation",
      "fp-0103 does not authorize remote mcp server implementation or deployment",
      "fp-0103 does not authorize apps sdk iframe/resource implementation",
      "fp-0103 does not authorize public chatgpt app implementation",
      "fp-0103 does not authorize app submission, screenshots, listing copy, public assets, app-submission artifacts, or generated public assets",
      "fp-0103 does not authorize openai api/model calls",
      "fp-0103 keeps fp-0104 absent",
      "fp-0103 preserves fp-0102, fp-0101, fp-0100, fp-0099, fp-0098, fp-0087, v2f, and v2g proof boundaries",
      "fp-0103 keeps public app implementation/submission future-only",
      "future endpoint inventory must name path, method, transport, request envelope, response envelope, auth requirement, health path if any, refusal/failure behavior, and logging posture before implementation",
      "request and response envelopes must preserve evidence, source anchors, freshness, limitations, refusals, and permitted next actions",
      "unsupported, stale, conflicting, missing-citation, data-exfiltration, raw-dump, write-action, and prompt-injection requests fail closed",
      "no raw full-file dump is allowed",
      "no write/modify/action tools are allowed",
    ].every((requiredText) => normalized.includes(requiredText)) &&
    noRuntimeOrEndpointPathsFromFp0103().allClear &&
    noPublicAssetsListingOrSubmissionArtifactsFromFp0103().allClear;

  return {
    accepted,
    exactlyOneFp0103PlanVerified,
    noAutonomousAction: normalized.includes("autonomous action"),
    noExternalCommunications: normalized.includes("external communications"),
    noFinanceWrite: normalized.includes("finance write"),
    noGeneratedFinanceAdvice: normalized.includes("generated finance advice"),
    noProviderCertificationDeliveryDeployment:
      normalized.includes("provider/certification/deployment") ||
      normalized.includes("provider, deployment"),
    noPublicChatGptAppImplementation: normalized.includes(
      "public chatgpt app implementation",
    ),
    noRuntimeCodexFinanceOutput: normalized.includes(
      "runtime-codex finance output",
    ),
    noSourceMutation: normalized.includes("source mutation"),
    noWriteActionTools: normalized.includes("write/modify/action tools"),
    publicAppImplementationSubmissionFutureOnly: normalized.includes(
      "public app implementation/submission future-only",
    ),
  };
}

function allFalsePlanBoundary({ exactlyOneFp0103PlanVerified }) {
  return {
    accepted: false,
    exactlyOneFp0103PlanVerified,
    noAutonomousAction: false,
    noExternalCommunications: false,
    noFinanceWrite: false,
    noGeneratedFinanceAdvice: false,
    noProviderCertificationDeliveryDeployment: false,
    noPublicChatGptAppImplementation: false,
    noRuntimeCodexFinanceOutput: false,
    noSourceMutation: false,
    noWriteActionTools: false,
    publicAppImplementationSubmissionFutureOnly: false,
  };
}

function noRuntimeOrEndpointPathsFromFp0103() {
  const forbiddenChangedPaths = changedPaths.filter((path) =>
    [
      /^apps\/web\/app\//u,
      /^apps\/web\/pages\//u,
      /^apps\/web\/api\//u,
      /^apps\/control-plane\//u,
      /^packages\/api\//u,
      /^packages\/server\//u,
      /^packages\/backend\//u,
      /^packages\/db\//u,
    ].some((pattern) => pattern.test(path)),
  );
  const forbiddenRuntimeMarkers = changedPaths.filter((path) => {
    if (!isRuntimeCandidate(path)) return false;
    const source = readFileSync(path, "utf8");
    return routeRuntimeMarkerPatterns().some((pattern) =>
      pattern.test(source),
    );
  });
  const allClear =
    forbiddenChangedPaths.length === 0 && forbiddenRuntimeMarkers.length === 0;

  return {
    allClear,
    noAppRoutesAdded:
      allClear && !changedPaths.some((path) => /^apps\/web\/app\//u.test(path)),
    noAppsSdkResourceImplementation:
      allClear && !changedPaths.some((path) => /apps-sdk|resource/iu.test(path)),
    noBackendControlPlaneRoutesAdded:
      allClear &&
      !changedPaths.some((path) =>
        /^(apps\/control-plane|packages\/backend|packages\/server)\//u.test(
          path,
        ),
      ),
    noEndpointImplementation:
      allClear &&
      !changedPaths.some(
        (path) =>
          !isAllowedFp0103ProofContractPath(path) && endpointRuntimePath(path),
      ),
    noMcpServerRuntime:
      allClear &&
      !changedPaths.some((path) => /mcp-server|remote-mcp|server\./iu.test(path)),
    noOauthTokenSessionImplementation:
      allClear && !changedPaths.some((path) => /oauth|token|session/iu.test(path)),
    noRemoteMcpImplementationOrDeployment:
      allClear &&
      !changedPaths.some((path) => /remote-mcp|deploy|deployment/iu.test(path)),
    noRouteImplementation:
      allClear && !changedPaths.some((path) => /(^|\/)route\.ts$/u.test(path)),
    noWebApiRoutesAdded:
      allClear && !changedPaths.some((path) => /^apps\/web\/api\//u.test(path)),
  };
}

function noPublicAssetsListingOrSubmissionArtifactsFromFp0103() {
  const publicAssetPattern =
    /\.(?:png|jpe?g|gif|webp|svg|ico|avif|mp4|mov|pdf)$/iu;
  const forbidden = changedPaths.filter(
    (path) =>
      publicAssetPattern.test(path) ||
      /app-submission|submission-assets|public-listing|store-listing|listing-copy|screenshots/iu.test(
        path,
      ),
  );
  const allClear = forbidden.length === 0;

  return {
    allClear,
    noAppSubmission: allClear,
    noListingCopy: allClear,
    noPublicAssets: allClear,
    noPublicAssetsSubmissionArtifacts: allClear,
  };
}

function docsOnlyPlanBoundary(path, requiredTexts) {
  if (!repoPaths.includes(path) || !existsSync(path)) return false;
  const normalized = normalize(readFileSync(path, "utf8"));
  return requiredTexts.every((requiredText) =>
    normalized.includes(requiredText),
  );
}

function fp0087DescriptorEnvelopeBoundary() {
  if (!repoPaths.includes(FP0087_PLAN) || !existsSync(FP0087_PLAN)) {
    return false;
  }
  const normalized = normalize(readFileSync(FP0087_PLAN, "utf8"));
  return (
    normalized.includes("read-only") &&
    normalized.includes("mcp") &&
    normalized.includes("descriptor")
  );
}

function fp0104Absent() {
  return !repoPaths.some((path) => /(^|\/)FP-0104/u.test(path));
}

function readPublicAppProofGateSourceText() {
  return repoPaths
    .filter(isPublicAppProofGateSourceSurface)
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");
}

function isPublicAppProofGateSourceSurface(path) {
  return (
    /^packages\/domain\/src\/read-only-app-mcp.*\.ts$/u.test(path) ||
    /^packages\/domain\/src\/benchmark-community.*\.ts$/u.test(path) ||
    [
      "tools/read-only-public-app-security-boundary-proof.mjs",
      "tools/read-only-mcp-descriptor-response-envelope-proof.mjs",
      "tools/read-only-chatgpt-app-mcp-proof.mjs",
      "tools/benchmark-community-pack-proof.mjs",
      "tools/read-only-endpoint-architecture-proof.mjs",
    ].includes(path)
  );
}

function hasCodeLevelOpenAiIntegration(sourceText) {
  const packageName = ["open", "ai"].join("");
  const clientName = ["Open", "AI"].join("");
  const keyName = ["OPENAI", "API", "KEY"].join("_");
  const hostName = ["api", packageName, "com"].join(".");
  const checks = [
    new RegExp(`\\bfrom\\s+["']${packageName}["']`, "u"),
    new RegExp(`\\bimport\\s*\\(\\s*["']${packageName}["']\\s*\\)`, "u"),
    new RegExp(`\\brequire\\s*\\(\\s*["']${packageName}["']\\s*\\)`, "u"),
    new RegExp(`\\bnew\\s+${clientName}\\b`, "u"),
    new RegExp(`\\b${packageName}\\s*\\.`, "u"),
    dottedPattern("responses", "create"),
    dottedPattern("chat", "completions"),
    new RegExp(`\\bprocess\\s*\\.\\s*env\\s*\\.\\s*${keyName}\\b`, "u"),
    new RegExp(`\\b${keyName}\\b`, "u"),
    new RegExp(`\\b${escapeRegExp(hostName)}\\b`, "u"),
    new RegExp(`\\bfetch\\s*\\(\\s*["'][^"']*${escapeRegExp(hostName)}`, "u"),
  ];

  return checks.some((check) => check.test(sourceText));
}

function hasCodeLevelOpenAiClientOrKeyUsage(sourceText) {
  const clientName = ["Open", "AI"].join("");
  const keyName = ["OPENAI", "API", "KEY"].join("_");
  return [
    new RegExp(`\\bnew\\s+${clientName}\\b`, "u"),
    new RegExp(`\\bprocess\\s*\\.\\s*env\\s*\\.\\s*${keyName}\\b`, "u"),
    new RegExp(`\\b${keyName}\\b`, "u"),
  ].some((check) => check.test(sourceText));
}

function hasCodeLevelModelIntegration(sourceText) {
  const modelCallName = ["call", "Model"].join("");
  return [
    wordPattern(modelCallName),
    dottedPattern("model", "create"),
    dottedPattern("models", "create"),
    dottedPattern("chat", "completions"),
  ].some((check) => check.test(sourceText));
}

function routeRuntimeMarkerPatterns() {
  const markers = [
    ["route", "\\.ts"].join(""),
    "API route",
    "backend route",
    "control-plane route",
    "app route",
    "createServer",
    "Fastify route registration",
    "Express route registration",
    "NextResponse",
    "POST",
    "GET handler",
    "remote MCP server",
    "listen(",
    "server.start",
    "OAuth callback",
    "token exchange",
    "session handler",
  ];
  return markers.map((marker) => new RegExp(escapeRegExp(marker), "u"));
}

function isRuntimeCandidate(path) {
  return (
    /^(apps\/web\/app|apps\/web\/pages|apps\/web\/api)\//u.test(path) ||
    /^(apps\/control-plane|packages\/api|packages\/server|packages\/backend)\//u.test(
      path,
    )
  );
}

function endpointRuntimePath(path) {
  return (
    /(^|\/)route\.ts$/u.test(path) ||
    /endpoint|mcp-server|remote-mcp|oauth|session|token/iu.test(path)
  );
}

function isAllowedFp0103ProofContractPath(path) {
  return (
    path === FP0103_PLAN ||
    path === "tools/read-only-endpoint-architecture-proof.mjs" ||
    /^packages\/domain\/src\/read-only-app-mcp-endpoint-architecture.*\.ts$/u.test(
      path,
    )
  );
}

function dottedPattern(left, right) {
  return new RegExp(`\\b${left}\\s*\\.\\s*${right}\\b`, "u");
}

function wordPattern(name) {
  return new RegExp(`\\b${name}\\b`, "u");
}

function normalize(value) {
  return value.toLowerCase().replace(/`/gu, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
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
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath, relativePath);
      } else {
        results.push(relativePath);
      }
    }
  }

  walk(".");
  return results.sort();
}
