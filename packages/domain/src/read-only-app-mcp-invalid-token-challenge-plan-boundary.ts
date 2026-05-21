import {
  FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
  MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY,
  MCP_INVALID_TOKEN_CHALLENGE_FP0136_PLAN_PREFIX,
  MCP_INVALID_TOKEN_CHALLENGE_FP0137_PLAN_PREFIX,
} from "./read-only-app-mcp-invalid-token-challenge-contracts";

type Fp0136BoundaryInput =
  | readonly string[]
  | {
      planText?: string;
      repoPaths: readonly string[];
    };

export function verifyFp0136InvalidTokenChallengeContractsAbsent(
  repoPaths: readonly string[],
) {
  return (
    fpPlanHits(repoPaths, MCP_INVALID_TOKEN_CHALLENGE_FP0136_PLAN_PREFIX)
      .length === 0
  );
}

export function verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts(
  input: Fp0136BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0136Hits = fpPlanHits(
    repoPaths,
    MCP_INVALID_TOKEN_CHALLENGE_FP0136_PLAN_PREFIX,
  );
  if (fp0136Hits.length === 0) return true;

  return (
    fp0136Hits.length === 1 &&
    fp0136Hits[0] === FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH &&
    (typeof planText !== "string" || fp0136PlanTextBoundaryVerified(planText))
  );
}

export function verifyFp0136InvalidTokenChallengeContractsBoundary(
  input: Fp0136BoundaryInput,
) {
  const { planText, repoPaths } = normalizeBoundaryInput(input);
  const fp0136Hits = fpPlanHits(
    repoPaths,
    MCP_INVALID_TOKEN_CHALLENGE_FP0136_PLAN_PREFIX,
  );
  return (
    fp0136Hits.length === 1 &&
    fp0136Hits[0] === FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH &&
    typeof planText === "string" &&
    fp0136PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0137Absent(repoPaths: readonly string[]) {
  return (
    fpPlanHits(repoPaths, MCP_INVALID_TOKEN_CHALLENGE_FP0137_PLAN_PREFIX)
      .length === 0
  );
}

export function verifyFp0136PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    challengeContractOnly:
      normalized.includes("invalid-token challenge contracts only") &&
      normalized.includes("does not emit www-authenticate headers") &&
      normalized.includes("does not attach challenge behavior to `/mcp`"),
    failureTaxonomy: MCP_INVALID_TOKEN_CHALLENGE_FAILURE_TAXONOMY.every(
      (failureMode) => normalized.includes(failureMode),
    ),
    fp0137Absent: normalized.includes("fp-0137 remains absent"),
    jsonRpcRefusalSeparation:
      normalized.includes("json-rpc refusal separation") &&
      normalized.includes("http challenge") &&
      normalized.includes("separate"),
    noRouteRuntime:
      normalized.includes("no route behavior change") &&
      normalized.includes(
        "no protected-resource metadata route behavior change",
      ) &&
      normalized.includes("no missing-token behavior change") &&
      normalized.includes("no invalid-token challenge runtime"),
    noTokenRuntime:
      normalized.includes("no token parser") &&
      normalized.includes("no jwt decoder") &&
      normalized.includes("no token validation runtime") &&
      normalized.includes("no token introspection") &&
      normalized.includes("no oauth") &&
      (normalized.includes("no token/session storage") ||
        normalized.includes("does not add token/session storage")) &&
      (normalized.includes("no auth middleware") ||
        normalized.includes("does not add auth middleware")),
    noTokenSamples:
      normalized.includes("no real token examples") &&
      normalized.includes("no jwt-like examples") &&
      normalized.includes("no bearer token material") &&
      normalized.includes("no token value appears"),
    resourceAndScopeAlignment:
      normalized.includes("resource_metadata") &&
      normalized.includes("protected-resource metadata") &&
      normalized.includes("challenged scopes") &&
      normalized.includes("read-only least-privilege"),
    statusMapping:
      normalized.includes("401") &&
      normalized.includes("403") &&
      normalized.includes("400") &&
      normalized.includes("contract-only"),
    testDoubleNoRouteConsumption:
      normalized.includes("synthetic test doubles") &&
      normalized.includes("may not be route input"),
  };
}

function fp0136PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return (
    [
      "local/proof-only/read-only invalid-token www-authenticate challenge contract foundation",
      "this is contract/proof work only",
      "does not emit www-authenticate headers",
      "does not attach challenge behavior to `/mcp`",
      "does not change the protected-resource metadata route",
      "does not change missing-token behavior",
      "does not implement token validation runtime",
      "does not implement oauth",
      "does not add token/session storage",
      "does not add auth middleware",
      "does not consume synthetic test doubles from routes",
      "fp-0137 remains absent",
    ].every((requiredText) => normalized.includes(requiredText)) &&
    Object.values(verifyFp0136PlanningTextRequiredTopics(planText)).every(
      Boolean,
    )
  );
}

function normalizeBoundaryInput(input: Fp0136BoundaryInput) {
  if ("repoPaths" in input) return input;
  return { repoPaths: input };
}

function fpPlanHits(repoPaths: readonly string[], planPrefix: string) {
  return repoPaths
    .map((path) => path.replace(/\\/gu, "/"))
    .filter((path) => path.includes(planPrefix));
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
