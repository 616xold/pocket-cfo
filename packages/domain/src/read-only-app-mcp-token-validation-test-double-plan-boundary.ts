import {
  FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0133_PLAN_PREFIX,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FP0134_PLAN_PREFIX,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES,
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
