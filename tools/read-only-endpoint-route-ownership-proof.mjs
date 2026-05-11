import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  EndpointRouteOwnershipProofSchema,
  FP0105_ENDPOINT_ROUTE_OWNERSHIP_PLAN_PATH,
  buildEndpointRouteOwnershipProof,
  inspectEndpointRouteOwnershipRepositoryInventory,
} from "../packages/domain/src/index.ts";

const FP0104_PLAN =
  "plans/FP-0104-read-only-chatgpt-app-mcp-endpoint-implementation-readiness-and-inventory-master-plan.md";
const FP0103_PLAN =
  "plans/FP-0103-read-only-chatgpt-app-mcp-endpoint-architecture-proof-contracts-foundation.md";
const FP0100_PLAN =
  "plans/FP-0100-read-only-chatgpt-app-mcp-public-app-security-boundary-contracts-foundation.md";

const repoPaths = repoFilePaths();
const changedPaths = changedFilePaths();
const changedRuntime = changedRuntimeSurfaceBoundary();
const publicAssets = publicAssetSubmissionBoundary();
const sourceText = readChangedCodeSourceText();
const noOpenAiApiCalls = !hasCodeLevelOpenAiIntegration(sourceText);
const noModelCalls = !hasCodeLevelModelIntegration(sourceText);
const noOpenAiClientOrKeyUsage =
  noOpenAiApiCalls && !hasCodeLevelOpenAiClientOrKeyUsage(sourceText);
const fp0105 = fp0105RouteOwnershipBoundary();
const endpointRuntimeInventory = endpointRuntimeRepositoryInventory();

const proof = EndpointRouteOwnershipProofSchema.parse(
  buildEndpointRouteOwnershipProof({
    endpointRuntimeRepositoryInventoryVerified:
      endpointRuntimeInventory.endpointRuntimeRepositoryInventoryVerified,
    fp0100PublicSecurityBoundaryStillVerified: docsOnlyPlanBoundary(
      FP0100_PLAN,
      [
        "public-app security boundary contract",
        "local/proof-only",
        "no endpoints",
      ],
    ),
    fp0103EndpointArchitectureBoundaryStillVerified: docsOnlyPlanBoundary(
      FP0103_PLAN,
      [
        "endpoint architecture proof contracts",
        "local/proof-only",
        "does not authorize endpoint implementation",
      ],
    ),
    fp0104EndpointReadinessBoundaryStillVerified: docsOnlyPlanBoundary(
      FP0104_PLAN,
      [
        "endpoint implementation readiness",
        "exact future endpoint inventory",
        "| /mcp |",
      ],
    ),
    fp0105BoundaryVerified: fp0105.fp0105BoundaryVerified,
    fp0106Absent: fp0106Absent(),
    noAppSubmission: publicAssets.noAppSubmission,
    noAppsSdkResourceImplementation:
      changedRuntime.noAppsSdkResourceImplementation,
    noEndpointImplementation: changedRuntime.noEndpointImplementation,
    noFinanceWrite: fp0105.noSourceMutationFinanceWriteFromFp0105,
    noListingCopy: publicAssets.noListingCopy,
    noModelCalls,
    noOauthTokenSessionImplementation:
      changedRuntime.noOauthTokenSessionImplementation,
    noOpenAiApiCalls,
    noOpenAiClientOrKeyUsage,
    noPublicAssets: publicAssets.noPublicAssets,
    noPublicChatGptAppImplementation:
      fp0105.noPublicAppImplementationFromFp0105,
    noRemoteMcpServerImplementation:
      changedRuntime.noRemoteMcpServerImplementation,
    noRouteImplementation: changedRuntime.noRouteImplementation,
    noSourceMutation: fp0105.noSourceMutationFinanceWriteFromFp0105,
    noWebApiBackendControlPlaneRouteImplementation:
      changedRuntime.noWebApiBackendControlPlaneRouteImplementation,
    noWriteActionTools: fp0105.noWriteActionToolsFromFp0105,
  }),
);

for (const [key, value] of Object.entries(proof)) {
  if (typeof value === "boolean" && value !== true) {
    throw new Error(`FP-0105 endpoint route ownership proof failed: ${key}`);
  }
}

console.log(JSON.stringify(proof, null, 2));

function fp0105RouteOwnershipBoundary() {
  const fp0105Hits = repoPaths.filter((path) => /(^|\/)FP-0105/u.test(path));
  const failed = {
    endpointRouteOwnerCandidateAnalysisVerified: false,
    endpointRouteOwnerDecisionOrImplementationBlockedVerified: false,
    endpointRouteOwnershipProofContractsFoundationVerified: false,
    endpointTransportAdapterContractVerified: false,
    fp0105BoundaryVerified: false,
    noApiBackendRoutesFromFp0105: false,
    noAppSubmissionFromFp0105: false,
    noAppsSdkResourceFromFp0105: false,
    noEndpointImplementationFromFp0105: false,
    noOauthTokenSessionImplementationFromFp0105: false,
    noOpenAiApiCallsFromFp0105: false,
    noPublicAppImplementationFromFp0105: false,
    noPublicAssetsSubmissionArtifactsFromFp0105: false,
    noRemoteMcpImplementationOrDeploymentFromFp0105: false,
    noRouteImplementationFromFp0105: false,
    noSourceMutationFinanceWriteFromFp0105: false,
    noWriteActionToolsFromFp0105: false,
  };

  if (
    fp0105Hits.length !== 1 ||
    fp0105Hits[0] !== FP0105_ENDPOINT_ROUTE_OWNERSHIP_PLAN_PATH ||
    !existsSync(FP0105_ENDPOINT_ROUTE_OWNERSHIP_PLAN_PATH)
  ) {
    return failed;
  }

  const normalized = normalize(
    readFileSync(FP0105_ENDPOINT_ROUTE_OWNERSHIP_PLAN_PATH, "utf8"),
  );
  const changedRuntimeClear = changedRuntimeSurfaceBoundary();
  const publicAssetsClear = publicAssetSubmissionBoundary();
  const endpointRouteOwnershipProofContractsFoundationVerified = [
    "fp-0105 is not implementation",
    "fp-0105 is local/proof-only/read-only endpoint route ownership and transport-adapter contract work",
    "fp-0105 defines future endpoint route ownership and transport-adapter proof contracts only",
    "fp-0105 keeps fp-0106 absent",
    "endpointrouteownershipproofcontract",
    "endpointrouteownercandidateanalysisboundary",
    "endpointrouteownerdecisionboundary",
    "endpointtransportadapterboundary",
    "endpointmcppathcontractboundary",
    "endpointhandlerthinadapterboundary",
    "endpointservicedispatchboundary",
    "endpointreadonlytooldispatchboundary",
    "endpointrequestresponseenvelopeadapterboundary",
    "endpointrefusaladapterboundary",
    "endpointauthboundarydeferredboundary",
    "endpointloggingredactionboundary",
    "endpointdeploymentdeferredboundary",
    "endpointrollbackreadinessboundary",
    "endpointrouteownershipproof",
  ].every((requiredText) => normalized.includes(requiredText));
  const endpointRouteOwnerCandidateAnalysisVerified = [
    "apps/control-plane fastify route family candidate",
    "apps/web / next.js route family candidate",
    "separate future mcp server package candidate",
    "keeping route ownership unresolved",
    "authority boundary",
    "source/evidence access boundary",
    "finance twin/cfo wiki/evidenceindex access boundary",
    "request/response envelope boundary",
    "auth/token/session boundary",
    "logging/redaction boundary",
    "route thinness",
    "deployment boundary",
    "rollback boundary",
    "proofability",
    "why no route may be added in fp-0105",
  ].every((requiredText) => normalized.includes(requiredText));
  const endpointRouteOwnerDecisionOrImplementationBlockedVerified =
    [
      "decision: outcome a - route owner can be safely named",
      "future /mcp route owner family is exactly apps/control-plane fastify route family",
      "future route family is documentation-only",
      "future route file/path pattern is documentation-only",
      "implementation remains blocked until a later implementation finance plan",
    ].every((requiredText) => normalized.includes(requiredText)) ||
    [
      "route ownership remains unresolved",
      "endpoint implementation must not start",
      "missing information required to unblock route owner selection",
    ].every((requiredText) => normalized.includes(requiredText));
  const endpointTransportAdapterContractVerified = [
    "future transport adapter remains documentation/proof-only",
    "future handler must be a thin adapter",
    "future service dispatch must stay read-only and evidence-backed",
    "future tool dispatch must use the exact v2g read-only allowlist",
  ].every((requiredText) => normalized.includes(requiredText));
  const noEndpointImplementationFromFp0105 =
    normalized.includes("fp-0105 does not authorize endpoint implementation") &&
    normalized.includes("no endpoints") &&
    changedRuntimeClear.noEndpointImplementation;
  const noRouteImplementationFromFp0105 =
    normalized.includes("fp-0105 does not authorize route implementation") &&
    normalized.includes("no route code") &&
    changedRuntimeClear.noRouteImplementation;
  const noApiBackendRoutesFromFp0105 =
    normalized.includes(
      "fp-0105 does not authorize web api/backend/control-plane route implementation",
    ) &&
    normalized.includes("no web api routes") &&
    normalized.includes("no backend/control-plane routes") &&
    changedRuntimeClear.noWebApiBackendControlPlaneRouteImplementation;
  const noOauthTokenSessionImplementationFromFp0105 =
    normalized.includes(
      "fp-0105 does not authorize oauth/token/session implementation",
    ) && changedRuntimeClear.noOauthTokenSessionImplementation;
  const noRemoteMcpImplementationOrDeploymentFromFp0105 =
    normalized.includes(
      "fp-0105 does not authorize remote mcp server implementation or deployment",
    ) && changedRuntimeClear.noRemoteMcpServerImplementation;
  const noAppsSdkResourceFromFp0105 =
    normalized.includes(
      "fp-0105 does not authorize apps sdk iframe/resource implementation",
    ) && changedRuntimeClear.noAppsSdkResourceImplementation;
  const noAppSubmissionFromFp0105 =
    normalized.includes("fp-0105 does not authorize app submission") &&
    publicAssetsClear.noAppSubmission;
  const noOpenAiApiCallsFromFp0105 =
    normalized.includes("fp-0105 does not authorize openai api/model calls") &&
    noOpenAiApiCalls &&
    noModelCalls &&
    noOpenAiClientOrKeyUsage;
  const noSourceMutationFinanceWriteFromFp0105 =
    normalized.includes("no source mutation") &&
    normalized.includes("no finance write");
  const noPublicAppImplementationFromFp0105 = normalized.includes(
    "fp-0105 does not authorize public chatgpt app implementation",
  );
  const noWriteActionToolsFromFp0105 =
    normalized.includes("no write-action tool exposure is added") ||
    normalized.includes("no write-action tool");
  const noPublicAssetsSubmissionArtifactsFromFp0105 =
    normalized.includes("no screenshots") &&
    normalized.includes("no generated images") &&
    normalized.includes("no public assets") &&
    normalized.includes("no listing copy") &&
    normalized.includes("no app-submission artifacts") &&
    publicAssetsClear.allClear;

  const fp0105BoundaryVerified =
    endpointRouteOwnershipProofContractsFoundationVerified &&
    endpointRouteOwnerCandidateAnalysisVerified &&
    endpointRouteOwnerDecisionOrImplementationBlockedVerified &&
    endpointTransportAdapterContractVerified &&
    noEndpointImplementationFromFp0105 &&
    noRouteImplementationFromFp0105 &&
    noApiBackendRoutesFromFp0105 &&
    noOauthTokenSessionImplementationFromFp0105 &&
    noRemoteMcpImplementationOrDeploymentFromFp0105 &&
    noAppsSdkResourceFromFp0105 &&
    noAppSubmissionFromFp0105 &&
    noOpenAiApiCallsFromFp0105 &&
    noSourceMutationFinanceWriteFromFp0105 &&
    noPublicAssetsSubmissionArtifactsFromFp0105 &&
    noPublicAppImplementationFromFp0105 &&
    noWriteActionToolsFromFp0105;

  return {
    endpointRouteOwnerCandidateAnalysisVerified,
    endpointRouteOwnerDecisionOrImplementationBlockedVerified,
    endpointRouteOwnershipProofContractsFoundationVerified,
    endpointTransportAdapterContractVerified,
    fp0105BoundaryVerified,
    noApiBackendRoutesFromFp0105,
    noAppSubmissionFromFp0105,
    noAppsSdkResourceFromFp0105,
    noEndpointImplementationFromFp0105,
    noOauthTokenSessionImplementationFromFp0105,
    noOpenAiApiCallsFromFp0105,
    noPublicAppImplementationFromFp0105,
    noPublicAssetsSubmissionArtifactsFromFp0105,
    noRemoteMcpImplementationOrDeploymentFromFp0105,
    noRouteImplementationFromFp0105,
    noSourceMutationFinanceWriteFromFp0105,
    noWriteActionToolsFromFp0105,
  };
}

function changedRuntimeSurfaceBoundary() {
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
  const allClear = forbiddenChangedPaths.length === 0;

  return {
    allClear,
    noAppsSdkResourceImplementation:
      allClear && !changedPaths.some((path) => /apps-sdk|resource/iu.test(path)),
    noEndpointImplementation:
      allClear &&
      !changedPaths.some(
        (path) =>
          !isAllowedEndpointRouteOwnershipProofPath(path) &&
          endpointRuntimePath(path),
      ),
    noOauthTokenSessionImplementation:
      allClear && !changedPaths.some((path) => /oauth|token|session/iu.test(path)),
    noRemoteMcpServerImplementation:
      allClear &&
      !changedPaths.some((path) => /remote-mcp|mcp-server|deploy|deployment/iu.test(path)),
    noRouteImplementation:
      allClear && !changedPaths.some((path) => /(^|\/)route\.ts$/u.test(path)),
    noWebApiBackendControlPlaneRouteImplementation: allClear,
  };
}

function isAllowedEndpointRouteOwnershipProofPath(path) {
  return (
    path === FP0105_ENDPOINT_ROUTE_OWNERSHIP_PLAN_PATH ||
    path === FP0104_PLAN ||
    path === FP0103_PLAN ||
    path === "tools/read-only-endpoint-route-ownership-proof.mjs" ||
    path === "tools/read-only-endpoint-architecture-proof.mjs" ||
    /^packages\/domain\/src\/read-only-app-mcp-endpoint-route-ownership.*\.ts$/u.test(
      path,
    ) ||
    /^packages\/domain\/src\/read-only-app-mcp-endpoint-architecture.*\.ts$/u.test(
      path,
    )
  );
}

function publicAssetSubmissionBoundary() {
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
  };
}

function docsOnlyPlanBoundary(path, requiredTexts) {
  if (!repoPaths.includes(path) || !existsSync(path)) return false;
  const normalized = normalize(readFileSync(path, "utf8"));
  return requiredTexts.every((requiredText) => normalized.includes(requiredText));
}

function fp0106Absent() {
  return !repoPaths.some((path) => /(^|\/)FP-0106/u.test(path));
}

function endpointRuntimeRepositoryInventory() {
  const files = repoPaths
    .filter((path) => /\.(?:ts|tsx|js|mjs|json)$/u.test(path))
    .map((path) => ({ path, source: safeRead(path) }));
  return inspectEndpointRouteOwnershipRepositoryInventory(files);
}

function safeRead(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function readChangedCodeSourceText() {
  return changedPaths
    .filter((path) => /\.(?:ts|tsx|js|mjs|cjs)$/u.test(path))
    .map((path) => safeRead(path))
    .join("\n");
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

function endpointRuntimePath(path) {
  return (
    /(^|\/)route\.ts$/u.test(path) ||
    /endpoint|mcp-server|remote-mcp|oauth|session|token/iu.test(path)
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
