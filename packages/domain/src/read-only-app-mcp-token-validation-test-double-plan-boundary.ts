import {
  FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH,
  FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0133_PLAN_PREFIX,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0134_PLAN_PREFIX,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0135_PLAN_PREFIX,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0136_PLAN_PREFIX,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES,
  FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
} from "./read-only-app-mcp-token-validation-test-double-contracts";

type Fp0133BoundaryInput =
  | readonly string[]
  | {
      planText?: string;
      repoPaths: readonly string[];
    };

export function verifyFp0133AbsentOrLocalTokenValidationTestDoubleContracts(
  input: Fp0133BoundaryInput,
) {
  const { planText, repoPaths } = normalizeFp0133BoundaryInput(input);
  const fp0133Hits = fpPlanHits(
    repoPaths,
    MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0133_PLAN_PREFIX,
  );
  if (fp0133Hits.length === 0) return true;

  return (
    fp0133Hits.length === 1 &&
    fp0133Hits[0] === FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH &&
    (typeof planText !== "string" || fp0133PlanTextBoundaryVerified(planText))
  );
}

export function verifyFp0133TokenValidationTestDoubleContractsBoundary(
  input: Fp0133BoundaryInput,
) {
  const { planText, repoPaths } = normalizeFp0133BoundaryInput(input);
  const fp0133Hits = fpPlanHits(
    repoPaths,
    MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0133_PLAN_PREFIX,
  );
  return (
    fp0133Hits.length === 1 &&
    fp0133Hits[0] === FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH &&
    typeof planText === "string" &&
    fp0133PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0134Absent(repoPaths: readonly string[]) {
  return (
    fpPlanHits(repoPaths, MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0134_PLAN_PREFIX)
      .length === 0
  );
}

export function verifyFp0134AbsentOrLocalTokenValidationTestDoubleImplementation(
  input: Fp0133BoundaryInput,
) {
  const { planText, repoPaths } = normalizeFp0133BoundaryInput(input);
  const fp0134Hits = fpPlanHits(
    repoPaths,
    MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0134_PLAN_PREFIX,
  );
  if (fp0134Hits.length === 0) return true;

  return (
    fp0134Hits.length === 1 &&
    fp0134Hits[0] ===
      FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH &&
    (typeof planText !== "string" || fp0134PlanTextBoundaryVerified(planText))
  );
}

export function verifyFp0134TokenValidationTestDoubleImplementationBoundary(
  input: Fp0133BoundaryInput,
) {
  const { planText, repoPaths } = normalizeFp0133BoundaryInput(input);
  const fp0134Hits = fpPlanHits(
    repoPaths,
    MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0134_PLAN_PREFIX,
  );
  return (
    fp0134Hits.length === 1 &&
    fp0134Hits[0] ===
      FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH &&
    typeof planText === "string" &&
    fp0134PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0135Absent(repoPaths: readonly string[]) {
  return (
    fpPlanHits(repoPaths, MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0135_PLAN_PREFIX)
      .length === 0
  );
}

export function verifyFp0135AbsentOrDocsOnlyInvalidTokenChallengeSequencingPlan(
  input: Fp0133BoundaryInput,
) {
  const { planText, repoPaths } = normalizeFp0133BoundaryInput(input);
  const fp0135Hits = fpPlanHits(
    repoPaths,
    MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0135_PLAN_PREFIX,
  );
  if (fp0135Hits.length === 0) return true;

  return (
    fp0135Hits.length === 1 &&
    fp0135Hits[0] === FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH &&
    (typeof planText !== "string" || fp0135PlanTextBoundaryVerified(planText))
  );
}

export function verifyFp0135InvalidTokenChallengeSequencingPlanBoundary(
  input: Fp0133BoundaryInput,
) {
  const { planText, repoPaths } = normalizeFp0133BoundaryInput(input);
  const fp0135Hits = fpPlanHits(
    repoPaths,
    MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0135_PLAN_PREFIX,
  );
  return (
    fp0135Hits.length === 1 &&
    fp0135Hits[0] === FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH &&
    typeof planText === "string" &&
    fp0135PlanTextBoundaryVerified(planText)
  );
}

export function verifyFp0136Absent(repoPaths: readonly string[]) {
  return (
    fpPlanHits(repoPaths, MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0136_PLAN_PREFIX)
      .length === 0
  );
}

export function verifyFp0133PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    acceptedRejectedEnvelopes:
      normalized.includes("accepted/rejected validation result envelopes") &&
      normalized.includes("without raw token values"),
    failureTaxonomy: MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY.every(
      (failureMode) => normalized.includes(failureMode),
    ),
    localProofOnly:
      normalized.includes("local/proof-only/read-only") &&
      normalized.includes("pure domain contracts"),
    noRuntimeConsumption:
      normalized.includes("does not implement a test-double runtime") &&
      normalized.includes("does not change `/mcp`") &&
      normalized.includes(
        "does not change protected-resource metadata route behavior",
      ) &&
      normalized.includes("does not change missing-token challenge behavior"),
    noTokenExamples:
      normalized.includes("no real token examples") &&
      normalized.includes("no jwt-like strings") &&
      normalized.includes("no bearer token material"),
    proofSourceHardening:
      normalized.includes("origin/main...head") &&
      normalized.includes("dirty same-branch qa target files"),
    scenarioFamilies: MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES.every(
      (family) => normalized.includes(family.replace(/_/gu, "/")),
    ),
    selectorOnlyCompanyKey: normalized.includes(
      "companykey remains selector-only",
    ),
  };
}

export function verifyFp0135PlanningTextRequiredTopics(planText: string) {
  const normalized = normalize(planText);
  return {
    failureTaxonomy: MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY.every(
      (failureMode) => normalized.includes(failureMode),
    ),
    futureFp0136Gate:
      normalized.includes("future fp-0136 gate") &&
      normalized.includes("fp-0136 remains absent"),
    jsonRpcRefusalSeparation: normalized.includes(
      "json-rpc refusal separation",
    ),
    noRouteRuntime:
      normalized.includes("does not change `/mcp`") &&
      normalized.includes(
        "does not change protected-resource metadata route behavior",
      ) &&
      normalized.includes("does not change missing-token challenge behavior") &&
      normalized.includes("does not emit invalid-token www-authenticate"),
    noRuntimeConsumption:
      normalized.includes("does not consume synthetic test doubles") &&
      normalized.includes("no route consumption of test doubles"),
    noTokenRuntime:
      normalized.includes("does not implement token validation runtime") &&
      normalized.includes("does not parse, decode, validate, introspect") &&
      normalized.includes("does not implement oauth") &&
      normalized.includes("does not add auth middleware"),
    noTokenSamples:
      normalized.includes("no real token examples") &&
      normalized.includes("no jwt-like examples") &&
      normalized.includes("no bearer token material") &&
      normalized.includes("no token echo"),
    resourceAndScopeAlignment:
      normalized.includes("resource_metadata") &&
      normalized.includes("scope challenge") &&
      normalized.includes("protected-resource metadata") &&
      normalized.includes("fp-0130 missing-token"),
    statusMapping: normalized.includes("401/403 mapping"),
  };
}

function fp0133PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return (
    [
      "local/proof-only/read-only token-validation test-double contract foundation",
      "this is contract/proof work only",
      "does not implement a test-double runtime",
      "does not implement token validation runtime",
      "does not parse, decode, introspect, store, forward, or log tokens",
      "does not change `/mcp`",
      "does not change protected-resource metadata route behavior",
      "does not change missing-token challenge behavior",
      "no real token examples",
      "no jwt-like strings",
      "no bearer token material",
      "fp-0134 remains absent",
    ].every((requiredText) => normalized.includes(requiredText)) &&
    Object.values(verifyFp0133PlanningTextRequiredTopics(planText)).every(
      Boolean,
    )
  );
}

function fp0134PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return (
    [
      "first local-only, proof-backed synthetic token-validation test-double evaluator",
      "consumes scenario descriptors, not tokens",
      "returns validation result envelopes, not http route responses",
      "not token validation runtime",
      "not token parsing runtime",
      "not jwt decoding",
      "not oauth implementation",
      "not token introspection",
      "not token/session storage",
      "not auth middleware",
      "not invalid-token `www-authenticate` route behavior",
      "no route consumption",
      "no `/mcp` route behavior change",
      "fp-0135 remains absent",
    ].every((requiredText) => normalized.includes(requiredText)) &&
    MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES.every((family) =>
      normalized.includes(family.replace(/_/gu, "/")),
    ) &&
    MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY.every((failureMode) =>
      normalized.includes(failureMode),
    ) &&
    normalized.includes("companykey remains selector-only") &&
    normalized.includes("origin/main...head") &&
    normalized.includes("dirty same-branch qa target")
  );
}

function fp0135PlanTextBoundaryVerified(planText: string) {
  const normalized = normalize(planText);
  return (
    [
      "docs-and-plan plus proof-gate compatibility only",
      "invalid-token www-authenticate challenge sequencing only",
      "does not emit invalid-token www-authenticate",
      "does not change `/mcp`",
      "does not change protected-resource metadata route behavior",
      "does not change missing-token challenge behavior",
      "does not implement token validation runtime",
      "does not parse, decode, validate, introspect",
      "does not implement oauth",
      "does not add token/session storage",
      "does not add auth middleware",
      "does not consume synthetic test doubles",
      "no route consumption of test doubles",
      "no real token examples",
      "no jwt-like examples",
      "no bearer token material",
      "future fp-0136 gate",
      "fp-0136 remains absent",
      "public chatgpt app submission remains future-only",
    ].every((requiredText) => normalized.includes(requiredText)) &&
    Object.values(verifyFp0135PlanningTextRequiredTopics(planText)).every(
      Boolean,
    )
  );
}

function normalizeFp0133BoundaryInput(input: Fp0133BoundaryInput) {
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
