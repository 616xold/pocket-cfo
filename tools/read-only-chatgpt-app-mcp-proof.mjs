import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  AppProofSchema,
  buildReadOnlyChatGptAppMcpProof,
} from "../packages/domain/src/index.ts";

const scriptNames = Object.keys(
  JSON.parse(readFileSync("package.json", "utf8")).scripts ?? {},
);

const noPackageScriptsAdded = !scriptNames.some((name) =>
  /v2g|read-only.*app.*mcp|chatgpt.*app.*mcp|app-mcp/u.test(name),
);
const noSmokeAliasesAdded = !scriptNames.some((name) =>
  /^smoke:.*(v2g|chatgpt|app.*mcp|mcp.*app)/u.test(name),
);
const FP0088_PLAN =
  "plans/FP-0088-read-only-chatgpt-app-mcp-premium-ui-security-master-plan.md";
const fp0088Boundary = fp0088DocsOnlyBoundary();
const fp0089Absent = !repoFilePaths().some((path) =>
  /(^|\/)FP-0089/u.test(path),
);

function fp0087DocsOnlyBoundaryVerified() {
  const fp0087Files = readdirSync("plans").filter((name) =>
    /^FP-0087/u.test(name),
  );
  if (
    fp0087Files.length !== 1 ||
    fp0087Files[0] !== "FP-0087-read-only-chatgpt-app-mcp-master-plan.md"
  ) {
    return false;
  }

  const planText = readFileSync(`plans/${fp0087Files[0]}`, "utf8");
  const lower = planText.toLowerCase();
  return [
    "v2g",
    "read-only",
    "chatgpt app/mcp",
    "no app submission",
    "no openai api/model calls",
    "source mutation",
    "finance writes",
    "autonomous action",
  ].every((requiredText) => lower.includes(requiredText));
}

const proof = AppProofSchema.parse(
  buildReadOnlyChatGptAppMcpProof({
    fp0087DocsOnlyBoundaryVerified: fp0087DocsOnlyBoundaryVerified(),
    fp0088AbsentOrDocsOnlyBoundaryVerified:
      fp0088Boundary.absentOrDocsOnlyBoundaryVerified,
    fp0089Absent,
    premiumUiSecurityPlanBoundaryVerified:
      fp0088Boundary.premiumUiSecurityPlanBoundaryVerified,
    noUiImplementationFromFp0088:
      fp0088Boundary.noUiImplementationFromFp0088,
    noEndpointOauthSubmissionFromFp0088:
      fp0088Boundary.noEndpointOauthSubmissionFromFp0088,
    noPackageScriptsAdded,
    noSmokeAliasesAdded,
  }),
);

console.log(JSON.stringify(proof, null, 2));

function fp0088DocsOnlyBoundary() {
  const fp0088PathHits = repoFilePaths().filter((path) =>
    /(^|\/)FP-0088/u.test(path),
  );

  if (fp0088PathHits.length === 0) {
    return {
      absentOrDocsOnlyBoundaryVerified: true,
      noEndpointOauthSubmissionFromFp0088: true,
      noUiImplementationFromFp0088: true,
      premiumUiSecurityPlanBoundaryVerified: true,
    };
  }

  if (fp0088PathHits.length !== 1 || fp0088PathHits[0] !== FP0088_PLAN) {
    return {
      absentOrDocsOnlyBoundaryVerified: false,
      noEndpointOauthSubmissionFromFp0088: false,
      noUiImplementationFromFp0088: false,
      premiumUiSecurityPlanBoundaryVerified: false,
    };
  }

  const lower = readFileSync(FP0088_PLAN, "utf8").toLowerCase();
  const docsOnlyBoundaryVerified = [
    "fp-0088 is not implementation",
    "docs-and-plan plus proof-gate compatibility",
    "creates no product code",
    "no product code",
    "no ui implementation",
    "no routes or endpoints",
    "no remote mcp server",
    "no apps sdk iframe/ui",
    "no oauth",
    "no app submission",
    "no openai api/model call",
    "no package scripts or smoke aliases",
    "no eval datasets, fixtures, sample data",
    "no source mutation",
    "no finance writes",
    "no autonomous action",
  ].every((requiredText) => lower.includes(requiredText));
  const premiumUiSecurityPlanBoundaryVerified = [
    "premium ui readiness requirements only",
    "app/mcp security readiness requirements only",
    "premium apple/openai-style visual standard",
    "appshell",
    "evidenceanswerpanel",
    "refusalpanel",
    "citationrail",
    "privacyboundarypanel",
    "noruntimeboundarypanel",
  ].every((requiredText) => lower.includes(requiredText));
  const noUiImplementationFromFp0088 = [
    "does not authorize apps sdk iframe/ui code",
    "future ui polish/design-system implementation plan",
    "before ui code",
    "do not implement ui",
  ].every((requiredText) => lower.includes(requiredText));
  const noEndpointOauthSubmissionFromFp0088 = [
    "does not authorize remote mcp deployment",
    "does not authorize oauth implementation",
    "does not authorize public app submission",
    "threat-model/security implementation plan before endpoint",
    "app-submission plan before submission",
  ].every((requiredText) => lower.includes(requiredText));

  return {
    absentOrDocsOnlyBoundaryVerified: docsOnlyBoundaryVerified,
    noEndpointOauthSubmissionFromFp0088,
    noUiImplementationFromFp0088,
    premiumUiSecurityPlanBoundaryVerified,
  };
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
  return results;
}
