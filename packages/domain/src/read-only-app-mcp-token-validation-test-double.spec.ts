import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FP0120_CANONICAL_RESOURCE_AUTH_SERVER_PLAN_PATH,
  FP0122_PROTECTED_RESOURCE_METADATA_BUILDER_PLAN_PATH,
  FP0123_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_PLAN_PATH,
  FP0127_WWW_AUTHENTICATE_AUTH_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0128_TOKEN_VALIDATION_READINESS_CONTRACTS_PLAN_PATH,
  FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0131_TOKEN_VALIDATION_RUNTIME_SEQUENCING_PLAN_PATH,
  FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH,
  FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
  FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
  FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH,
  FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
  FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH,
  FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH,
  MCP_SYNTHETIC_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_EVALUATOR_SCHEMA_VERSION,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_LEAKAGE_SURFACES,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES,
  McpTokenValidationTestDoubleProofSchema,
  SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME,
  SyntheticTokenValidationEvaluationProofSchema,
  assessMcpSyntheticNonTokenInput,
  assessMcpTokenValidationTestDoubleEnvelopeNoTokenMaterial,
  assertSyntheticScenarioContainsNoTokenMaterial,
  buildMcpAcceptedValidationResultTestDoubleEnvelope,
  buildMcpRejectedValidationResultTestDoubleEnvelope,
  buildMcpTokenValidationTestDoubleContracts,
  buildMcpTokenValidationTestDoubleProof,
  buildSyntheticTokenValidationEvaluationProof,
  buildSyntheticTokenValidationScenario,
  evaluateSyntheticTokenValidationScenario,
  isMcpTokenValidationTestDoubleProofSourcePath,
  scanTokenValidationNoLeakage,
  syntheticFailureModesByFamily,
  verifyFp0120CanonicalResourceAuthServerPlanBoundary,
  verifyFp0122ProtectedResourceMetadataBuilderContractsBoundary,
  verifyFp0123ProtectedResourceMetadataRouteInputContractsBoundary,
  verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary,
  verifyFp0128TokenValidationReadinessContractsBoundary,
  verifyFp0130LocalMissingTokenChallengeImplementationBoundary,
  verifyFp0131TokenValidationRuntimeSequencingPlanBoundary,
  verifyFp0132TokenValidationRuntimeContractsBoundary,
  verifyFp0133AbsentOrLocalTokenValidationTestDoubleContracts,
  verifyFp0133PlanningTextRequiredTopics,
  verifyFp0133TokenValidationTestDoubleContractsBoundary,
  verifyFp0134Absent,
  verifyFp0134AbsentOrLocalTokenValidationTestDoubleImplementation,
  verifyFp0134TokenValidationTestDoubleImplementationBoundary,
  verifyFp0135Absent,
  verifyFp0135AbsentOrDocsOnlyInvalidTokenChallengeSequencingPlan,
  verifyFp0135InvalidTokenChallengeSequencingPlanBoundary,
  verifyFp0135PlanningTextRequiredTopics,
  verifyFp0136Absent,
  verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts,
  verifyFp0136InvalidTokenChallengeContractsBoundary,
  verifyFp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlan,
  verifyFp0137InvalidTokenChallengeImplementationReadinessPlanBoundary,
  verifyFp0138Absent,
  verifyFp0138AbsentOrDocsOnlyTokenValidationRuntimeImplementationPlanning,
  verifyFp0138TokenValidationRuntimeImplementationPlanningBoundary,
  verifyFp0139Absent,
  verifyMcpTokenValidationTestDoubleContractBoundaries,
  verifyMcpTokenValidationTestDoubleNoTokenExamples,
  verifyMcpTokenValidationTestDoubleRepositoryInventory,
} from "./index";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const mcpRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts";
const metadataRoutePath =
  "apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
const proofCommandPath =
  "tools/read-only-mcp-token-validation-test-double-contract-proof.mjs";
const localProofCommandPath =
  "tools/read-only-mcp-token-validation-test-double-local-proof.mjs";
const invalidTokenChallengeSequencingProofCommandPath =
  "tools/read-only-mcp-invalid-token-challenge-sequencing-proof.mjs";
const fp0125PlanPath =
  "plans/FP-0125-read-only-chatgpt-app-mcp-protected-resource-metadata-local-route-implementation.md";
const fp0107PlanPath =
  "plans/FP-0107-read-only-chatgpt-app-mcp-local-fastify-mcp-route-adapter-foundation.md";
const fp0106PlanPath =
  "plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md";
const fp0100PlanPath =
  "plans/FP-0100-read-only-chatgpt-app-mcp-public-app-security-boundary-contracts-foundation.md";

describe("FP-0133 token-validation test-double contract foundations", () => {
  it("accepts FP-0136 invalid-token challenge contracts, FP-0137 readiness, and FP-0138 planning while FP-0139 remains absent", () => {
    const repoPaths = repoFilePaths();
    const planText = safeRead(
      FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
    );
    const fp0134PlanText = safeRead(
      FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
    );
    const fp0135PlanText = safeRead(
      FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH,
    );
    const fp0136PlanText = safeRead(
      FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
    );
    const fp0137PlanText = safeRead(
      FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH,
    );
    const fp0138PlanText = safeRead(
      FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH,
    );

    expect(repoPaths.filter((path) => /(^|\/)FP-0133/u.test(path))).toEqual([
      FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
    ]);
    expect(repoPaths.filter((path) => /(^|\/)FP-0134/u.test(path))).toEqual([
      FP0134_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_IMPLEMENTATION_PLAN_PATH,
    ]);
    expect(repoPaths.filter((path) => /(^|\/)FP-0135/u.test(path))).toEqual([
      FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH,
    ]);
    expect(repoPaths.filter((path) => /(^|\/)FP-0136/u.test(path))).toEqual([
      FP0136_INVALID_TOKEN_CHALLENGE_CONTRACTS_PLAN_PATH,
    ]);
    expect(repoPaths.filter((path) => /(^|\/)FP-0137/u.test(path))).toEqual([
      FP0137_INVALID_TOKEN_CHALLENGE_IMPLEMENTATION_READINESS_PLAN_PATH,
    ]);
    expect(repoPaths.filter((path) => /(^|\/)FP-0138/u.test(path))).toEqual([
      FP0138_TOKEN_VALIDATION_RUNTIME_IMPLEMENTATION_PLANNING_PLAN_PATH,
    ]);
    expect(
      verifyFp0133AbsentOrLocalTokenValidationTestDoubleContracts({
        planText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0133TokenValidationTestDoubleContractsBoundary({
        planText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      Object.values(verifyFp0133PlanningTextRequiredTopics(planText)).every(
        Boolean,
      ),
    ).toBe(true);
    expect(verifyFp0134Absent(repoPaths)).toBe(false);
    expect(
      verifyFp0134AbsentOrLocalTokenValidationTestDoubleImplementation({
        planText: fp0134PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0134TokenValidationTestDoubleImplementationBoundary({
        planText: fp0134PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(verifyFp0135Absent(repoPaths)).toBe(false);
    expect(
      verifyFp0135AbsentOrDocsOnlyInvalidTokenChallengeSequencingPlan({
        planText: fp0135PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0135InvalidTokenChallengeSequencingPlanBoundary({
        planText: fp0135PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      Object.values(
        verifyFp0135PlanningTextRequiredTopics(fp0135PlanText),
      ).every(Boolean),
    ).toBe(true);
    expect(verifyFp0136Absent(repoPaths)).toBe(false);
    expect(
      verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts({
        planText: fp0136PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0136InvalidTokenChallengeContractsBoundary({
        planText: fp0136PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlan(
        {
          planText: fp0137PlanText,
          repoPaths,
        },
      ),
    ).toBe(true);
    expect(
      verifyFp0137InvalidTokenChallengeImplementationReadinessPlanBoundary({
        planText: fp0137PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(verifyFp0138Absent(repoPaths)).toBe(false);
    expect(
      verifyFp0138AbsentOrDocsOnlyTokenValidationRuntimeImplementationPlanning({
        planText: fp0138PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0138TokenValidationRuntimeImplementationPlanningBoundary({
        planText: fp0138PlanText,
        repoPaths,
      }),
    ).toBe(true);
    expect(verifyFp0139Absent(repoPaths)).toBe(true);
    expect(
      verifyFp0133TokenValidationTestDoubleContractsBoundary({
        planText,
        repoPaths: [...repoPaths, "plans/FP-0133-second-contract.md"],
      }),
    ).toBe(false);
    expect(
      verifyFp0134Absent([...repoPaths, "plans/FP-0134-next-runtime.md"]),
    ).toBe(false);
    expect(
      verifyFp0134AbsentOrLocalTokenValidationTestDoubleImplementation({
        planText: fp0134PlanText,
        repoPaths: [...repoPaths, "plans/FP-0134-next-runtime.md"],
      }),
    ).toBe(false);
    expect(
      verifyFp0135Absent([...repoPaths, "plans/FP-0135-invalid-token.md"]),
    ).toBe(false);
    expect(
      verifyFp0135AbsentOrDocsOnlyInvalidTokenChallengeSequencingPlan({
        planText: fp0135PlanText,
        repoPaths: [...repoPaths, "plans/FP-0135-invalid-token.md"],
      }),
    ).toBe(false);
    expect(
      verifyFp0136Absent([...repoPaths, "plans/FP-0136-invalid-token.md"]),
    ).toBe(false);
    expect(
      verifyFp0136AbsentOrLocalInvalidTokenChallengeContracts({
        planText: fp0136PlanText,
        repoPaths: [...repoPaths, "plans/FP-0136-invalid-token.md"],
      }),
    ).toBe(false);
    expect(
      verifyFp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlan(
        {
          planText: fp0137PlanText,
          repoPaths: [...repoPaths, "plans/FP-0137-invalid-token.md"],
        },
      ),
    ).toBe(false);
    expect(
      verifyFp0138Absent([...repoPaths, "plans/FP-0138-invalid-token.md"]),
    ).toBe(false);
    expect(
      verifyFp0138AbsentOrDocsOnlyTokenValidationRuntimeImplementationPlanning({
        planText: fp0138PlanText,
        repoPaths: [...repoPaths, "plans/FP-0138-invalid-token.md"],
      }),
    ).toBe(false);
    expect(
      verifyFp0139Absent([...repoPaths, "plans/FP-0139-invalid-token.md"]),
    ).toBe(false);
  });

  it("keeps FP-0135 planning text docs-and-plan proof-gate only", () => {
    const planText = safeRead(
      FP0135_INVALID_TOKEN_CHALLENGE_SEQUENCING_PLAN_PATH,
    );
    const normalized = normalize(planText);
    const routeSource = safeRead(mcpRoutePath);
    const metadataRouteSource = safeRead(metadataRoutePath);

    expect(scanTokenValidationNoLeakage(planText).accepted).toBe(true);
    expect(normalized).toContain("401/403 mapping");
    expect(normalized).toContain("resource_metadata");
    expect(normalized).toContain("scope challenge");
    expect(normalized).toContain("json-rpc refusal separation");
    expect(normalized).toContain("future fp-0136 gate");
    expect(normalized).toContain("fp-0136 remains absent");
    for (const failureMode of MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY) {
      expect(normalized).toContain(failureMode);
    }
    expect(normalized).toContain("no token echo");
    expect(normalized).toContain("no route consumption of test doubles");
    expect(normalized).toContain(
      "does not emit invalid-token www-authenticate",
    );
    expect(normalized).toContain("does not implement token validation runtime");
    expect(normalized).toContain(
      "does not parse, decode, validate, introspect",
    );
    expect(normalized).toContain("does not implement oauth");
    expect(normalized).toContain("does not add token/session storage");
    expect(normalized).toContain("does not add auth middleware");
    expect(routeSource).not.toContain(
      "evaluateSyntheticTokenValidationScenario",
    );
    expect(metadataRouteSource).not.toContain(
      "evaluateSyntheticTokenValidationScenario",
    );
    expect(countMatches(routeSource, /app\.post\("\/mcp"/gu)).toBe(1);
    expect(countMatches(routeSource, /app\.get\("\/mcp"/gu)).toBe(1);
    expect(metadataRouteSource).not.toMatch(/WWW-Authenticate/iu);
  });

  it("builds all required proof-only contracts without runtime consumption", () => {
    const contracts = buildMcpTokenValidationTestDoubleContracts();
    const proof = buildMcpTokenValidationTestDoubleProof();

    expect(verifyMcpTokenValidationTestDoubleContractBoundaries()).toBe(true);
    expect(MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES).toEqual([
      "issuer",
      "audience_resource",
      "scope",
      "temporal",
      "revocation_replay",
      "subject_org_company",
    ]);
    expect(MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY).toEqual([
      "malformed",
      "expired",
      "wrong-issuer",
      "wrong-audience",
      "wrong-resource",
      "wrong-scope",
      "wrong-org",
      "wrong-company",
      "revoked",
      "replayed",
      "token-passthrough-attempt",
    ]);
    expect(contracts.proofContract.noRuntimeImplementation).toBe(true);
    expect(
      contracts.noRuntimeConsumptionBoundary.noTestDoubleRuntimeImplemented,
    ).toBe(true);
    expect(
      contracts.noRuntimeConsumptionBoundary.noRouteConsumesTestDoubles,
    ).toBe(true);
    expect(
      contracts.selectorOnlyCompanyKeyTestDoubleBoundary
        .clientCompanyKeySelectorOnly,
    ).toBe(true);
    expect(
      contracts.selectorOnlyCompanyKeyTestDoubleBoundary
        .clientCompanyKeyAuthorityAllowed,
    ).toBe(false);
    expect(
      McpTokenValidationTestDoubleProofSchema.safeParse(proof).success,
    ).toBe(true);
    expect(
      McpTokenValidationTestDoubleProofSchema.safeParse({
        ...proof,
        noTokenValidationRuntime: false,
      }).success,
    ).toBe(false);
  });

  it("rejects token-like inputs while accepting fixtureless non-token descriptors", () => {
    const bearerMaterial = ["Bearer", "synthetic-token-material"].join(" ");
    const jwtLikeString = [
      ["jwtlikeheader"],
      ["jwtlikepayload"],
      ["jwtlikesig"],
    ]
      .map((part) => part.join("").padEnd(12, "x"))
      .join(".");

    expect(
      assessMcpSyntheticNonTokenInput(
        "synthetic issuer scenario descriptor with no token material",
      ).accepted,
    ).toBe(true);
    expect(assessMcpSyntheticNonTokenInput(bearerMaterial).accepted).toBe(
      false,
    );
    expect(assessMcpSyntheticNonTokenInput(jwtLikeString).accepted).toBe(false);
    expect(verifyMcpTokenValidationTestDoubleNoTokenExamples()).toBe(true);
  });

  it("models accepted and rejected result envelopes without token material", () => {
    const acceptedEnvelope =
      buildMcpAcceptedValidationResultTestDoubleEnvelope();
    const rejectedEnvelope =
      buildMcpRejectedValidationResultTestDoubleEnvelope();

    expect(
      assessMcpTokenValidationTestDoubleEnvelopeNoTokenMaterial(
        acceptedEnvelope,
      ).accepted,
    ).toBe(true);
    expect(
      assessMcpTokenValidationTestDoubleEnvelopeNoTokenMaterial(
        rejectedEnvelope,
      ).accepted,
    ).toBe(true);
    expect(
      acceptedEnvelope.subjectOrgCompanyBinding.companyKeySelectorOnly,
    ).toBe(true);
    expect(rejectedEnvelope.failureMode).toBe("wrong-company");
    expect(
      assessMcpTokenValidationTestDoubleEnvelopeNoTokenMaterial({
        ...acceptedEnvelope,
        carriesRawToken: true,
      }).accepted,
    ).toBe(false);
  });

  it("evaluates local synthetic descriptors into accepted and rejected envelopes", () => {
    const acceptedScenario = buildSyntheticTokenValidationScenario({
      companyKey: "synthetic-selector-company",
      family: "subject_org_company",
      outcome: SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME,
      syntheticBinding: {
        companyRef: "synthetic-company-ref",
        orgRef: "synthetic-org-ref",
        subjectRef: "synthetic-subject-ref",
      },
      syntheticScenarioId: "synthetic-accepted-subject-org-company",
    });
    const rejectedScenario = buildSyntheticTokenValidationScenario({
      companyKey: "synthetic-selector-company",
      family: "subject_org_company",
      outcome: "wrong-company",
      syntheticScenarioId: "synthetic-rejected-wrong-company",
    });
    const acceptedEnvelope =
      evaluateSyntheticTokenValidationScenario(acceptedScenario);
    const rejectedEnvelope =
      evaluateSyntheticTokenValidationScenario(rejectedScenario);
    const proof = buildSyntheticTokenValidationEvaluationProof();

    expect(acceptedScenario.schemaVersion).toBe(
      MCP_SYNTHETIC_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_EVALUATOR_SCHEMA_VERSION,
    );
    expect(acceptedEnvelope).toMatchObject({
      accepted: true,
      carriesAuthorizationHeader: false,
      carriesJwtClaims: false,
      carriesRawToken: false,
      resultKind: "accepted_test_double",
    });
    expect(rejectedEnvelope).toMatchObject({
      accepted: false,
      carriesAuthorizationHeader: false,
      carriesJwtClaims: false,
      carriesRawToken: false,
      failureMode: "wrong-company",
      resultKind: "rejected_test_double",
    });
    expect(
      acceptedEnvelope.subjectOrgCompanyBinding.companyKeySelectorOnly,
    ).toBe(true);
    expect(JSON.stringify(acceptedEnvelope)).not.toContain(
      "synthetic-selector-company",
    );
    expect(
      scanTokenValidationNoLeakage(JSON.stringify(acceptedEnvelope)),
    ).toMatchObject({
      accepted: true,
    });
    expect(
      SyntheticTokenValidationEvaluationProofSchema.safeParse(proof).success,
    ).toBe(true);
    expect(proof.tokenLikeInputMapsToPassthroughAttempt).toBe(true);
    expect(proof.malformedNonTokenInputMapsToMalformed).toBe(true);
    expect(proof.rejectedInputNeverEchoesTokenMaterial).toBe(true);
  });

  it("supports every synthetic scenario family and failure taxonomy outcome", () => {
    const failuresByFamily = syntheticFailureModesByFamily();

    expect(Object.keys(failuresByFamily).sort()).toEqual(
      [...MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES].sort(),
    );
    for (const family of MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES) {
      const outcome =
        failuresByFamily[family][0] ??
        SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME;
      const envelope = evaluateSyntheticTokenValidationScenario(
        buildSyntheticTokenValidationScenario({
          family,
          outcome,
          syntheticScenarioId: `synthetic-${family}-${outcome}`,
        }),
      );

      expect(envelope.accepted).toBe(
        outcome === SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME,
      );
      if (outcome !== SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME) {
        expect(envelope.failureMode).toBe(outcome);
      }
    }
    for (const failureMode of MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY) {
      const envelope = evaluateSyntheticTokenValidationScenario(
        buildSyntheticTokenValidationScenario({
          outcome: failureMode,
          syntheticScenarioId: `synthetic-failure-${failureMode}`,
        }),
      );

      expect(envelope).toMatchObject({
        accepted: false,
        carriesAuthorizationHeader: false,
        carriesJwtClaims: false,
        carriesRawToken: false,
        failureMode,
        resultKind: "rejected_test_double",
      });
    }
  });

  it("maps token-material-like rejected inputs to token passthrough attempts without echoing material", () => {
    const jwtLikeString = [
      "jwtlikeheader".padEnd(16, "x"),
      "jwtlikepayload".padEnd(16, "x"),
      "jwtlikesig".padEnd(16, "x"),
    ].join(".");
    const forbiddenInputs = [
      {
        family: "authorization header-like input",
        input: ["Authorization", "synthetic-header-material"].join("="),
      },
      {
        family: "Bearer token-like input",
        input: ["Bearer", "synthetic-token-material"].join(" "),
      },
      {
        family: "JWT-like string",
        input: jwtLikeString,
      },
      {
        family: "OAuth access_token-like input",
        input: ["access_token", "synthetic-token-material"].join("="),
      },
      {
        family: "OAuth refresh_token-like input",
        input: ["refresh_token", "synthetic-token-material"].join("="),
      },
      {
        family: "OAuth client_secret-like input",
        input: ["client_secret", "synthetic-token-material"].join("="),
      },
      {
        family: "session-like input",
        input: ["session", "synthetic-token-material"].join("="),
      },
      {
        family: "cookie-like input",
        input: ["cookie", "synthetic-token-material"].join("="),
      },
      {
        family: "provider credential-like input",
        input: ["provider_credential", "synthetic-token-material"].join("="),
      },
    ];

    for (const { family, input } of forbiddenInputs) {
      expect(() =>
        assertSyntheticScenarioContainsNoTokenMaterial(input),
      ).toThrow();
      const envelope = evaluateSyntheticTokenValidationScenario(input);
      expect(envelope.accepted).toBe(false);
      expect(envelope.failureMode, family).toBe("token-passthrough-attempt");
      expect(envelope.carriesRawToken).toBe(false);
      expect(envelope.carriesAuthorizationHeader).toBe(false);
      expect(envelope.carriesJwtClaims).toBe(false);
      expect(JSON.stringify(envelope)).not.toContain(input);
      expect(
        scanTokenValidationNoLeakage(JSON.stringify(envelope)),
      ).toMatchObject({
        accepted: true,
      });
    }
  });

  it("keeps malformed non-token descriptor failures classified as malformed", () => {
    const malformedNonTokenInput = {
      descriptorKind: "synthetic_non_token_descriptor",
      note: "plain malformed descriptor shape without token material",
      syntheticScenarioId: "synthetic-malformed-non-token-descriptor",
    };
    const envelope = evaluateSyntheticTokenValidationScenario(
      malformedNonTokenInput,
    );

    expect(envelope).toMatchObject({
      accepted: false,
      carriesAuthorizationHeader: false,
      carriesJwtClaims: false,
      carriesRawToken: false,
      failureMode: "malformed",
      resultKind: "rejected_test_double",
    });
    expect(JSON.stringify(envelope)).not.toContain(
      "synthetic-malformed-non-token-descriptor",
    );
    expect(
      scanTokenValidationNoLeakage(JSON.stringify(envelope)),
    ).toMatchObject({
      accepted: true,
    });
  });

  it("proves no-token-leakage surfaces and no route/runtime expansion", () => {
    const proof = buildMcpTokenValidationTestDoubleProof();
    const proofText = JSON.stringify(proof);
    const routeSource = safeRead(mcpRoutePath);
    const metadataRouteSource = safeRead(metadataRoutePath);

    expect(MCP_TOKEN_VALIDATION_TEST_DOUBLE_LEAKAGE_SURFACES).toEqual([
      "logs",
      "proof_output",
      "docs_examples",
      "headers",
      "route_bodies",
      "metadata_examples",
      "evidence",
      "structured_results",
      "ui_props",
      "challenge_examples",
      "app_metadata",
    ]);
    expect(scanTokenValidationNoLeakage(proofText).accepted).toBe(true);
    expect(countMatches(routeSource, /app\.post\("\/mcp"/gu)).toBe(1);
    expect(countMatches(routeSource, /app\.get\("\/mcp"/gu)).toBe(1);
    expect(routeSource).not.toContain(
      "read-only-app-mcp-token-validation-test-double",
    );
    expect(routeSource).not.toContain(
      "evaluateSyntheticTokenValidationScenario",
    );
    expect(metadataRouteSource).not.toContain(
      "evaluateSyntheticTokenValidationScenario",
    );
    expect(metadataRouteSource).not.toMatch(/WWW-Authenticate/iu);
    expect(proof.noMcpRouteBehaviorChange).toBe(true);
    expect(proof.noProtectedResourceMetadataRouteBehaviorChange).toBe(true);
    expect(proof.noMissingTokenChallengeBehaviorChange).toBe(true);
    expect(proof.noInvalidTokenChallengeRuntime).toBe(true);
    expect(proof.noTokenParsingRuntime).toBe(true);
    expect(proof.noTokenValidationRuntime).toBe(true);
    expect(proof.noJwtDecodingRuntime).toBe(true);
    expect(proof.noTokenSessionStorage).toBe(true);
    expect(proof.noOauthImplementation).toBe(true);
    expect(proof.noAuthMiddlewareImplementation).toBe(true);
    expect(proof.noDbQueriesAdded).toBe(true);
    expect(proof.noSchemaMigrationsAdded).toBe(true);
    expect(proof.noPackageScriptsAdded).toBe(true);
    expect(proof.noPublicAssets).toBe(true);
    expect(proof.noOpenAiApiCalls).toBe(true);
    expect(proof.noModelCalls).toBe(true);
    expect(proof.noProviderCalls).toBe(true);
    expect(proof.noSourceMutation).toBe(true);
    expect(proof.noFinanceWrite).toBe(true);
  });

  it("requires direct proof source scans over branch diff and dirty QA targets", () => {
    const proofSource = safeRead(proofCommandPath);
    const localProofSource = safeRead(localProofCommandPath);
    const sequencingProofSource = safeRead(
      invalidTokenChallengeSequencingProofCommandPath,
    );

    expect(proofSource).toContain("origin/main...HEAD");
    expect(proofSource).toContain("dirtyQaTargetFiles");
    expect(proofSource).toContain("combinedChangedPaths");
    expect(proofSource).toContain("committedBranchDiffPaths");
    expect(proofSource).toContain(
      "verifyMcpTokenValidationTestDoubleRepositoryInventory",
    );
    expect(proofSource).toContain(
      "tokenValidationTestDoubleRepositoryInventoryVerified",
    );
    expect(localProofSource).toContain("origin/main...HEAD");
    expect(localProofSource).toContain("dirtyQaTargetFiles");
    expect(localProofSource).toContain("combinedChangedPaths");
    expect(localProofSource).toContain("committedBranchDiffPaths");
    expect(localProofSource).toContain(
      "verifyMcpTokenValidationTestDoubleRepositoryInventory",
    );
    expect(sequencingProofSource).toContain("origin/main...HEAD");
    expect(sequencingProofSource).toContain("dirtyQaTargetFiles");
    expect(sequencingProofSource).toContain("combinedChangedPaths");
    expect(sequencingProofSource).toContain("committedBranchDiffPaths");
    expect(sequencingProofSource).toContain(
      "invalidTokenChallengeSequencingPlanBoundaryVerified",
    );
    expect(sequencingProofSource).toContain(
      "fp0136AbsentOrLocalInvalidTokenChallengeContractsVerified",
    );
    expect(sequencingProofSource).toContain(
      "fp0137AbsentOrDocsOnlyInvalidTokenChallengeImplementationReadinessPlanVerified",
    );
  });

  it("passes durable repository inventory on current repo truth", () => {
    const inventory = verifyMcpTokenValidationTestDoubleRepositoryInventory({
      repoPaths: repoFilePaths(),
      sourceTextByPath: proofSourceTextByPath(),
    });
    const proof = buildMcpTokenValidationTestDoubleProof();

    expect(inventory.proofSourceInventoryVerified).toBe(true);
    expect(inventory.proofSourcePaths).toContain(proofCommandPath);
    expect(inventory.proofSourcePaths).toContain(
      invalidTokenChallengeSequencingProofCommandPath,
    );
    expect(inventory.fp0133PostmergeProofDurabilityVerified).toBe(true);
    expect(inventory.noBearerTokenMaterialRepositoryInventoryVerified).toBe(
      true,
    );
    expect(
      inventory.noInvalidTokenChallengeRuntimeRepositoryInventoryVerified,
    ).toBe(true);
    expect(inventory.noJwtDecodingRuntimeRepositoryInventoryVerified).toBe(
      true,
    );
    expect(inventory.noJwtLikeExampleRepositoryInventoryVerified).toBe(true);
    expect(
      inventory.noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
    ).toBe(true);
    expect(inventory.noOpenAiApiSourceScanVerified).toBe(true);
    expect(inventory.noRealTokenExampleRepositoryInventoryVerified).toBe(true);
    expect(
      inventory.noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified,
    ).toBe(true);
    expect(
      inventory.noTokenIntrospectionRuntimeRepositoryInventoryVerified,
    ).toBe(true);
    expect(inventory.noTokenParsingRuntimeRepositoryInventoryVerified).toBe(
      true,
    );
    expect(inventory.noTokenValidationRuntimeRepositoryInventoryVerified).toBe(
      true,
    );
    expect(
      inventory.noTokenValidationTestDoubleRuntimeRepositoryInventoryVerified,
    ).toBe(true);
    expect(inventory.tokenValidationTestDoubleRepositoryInventoryVerified).toBe(
      true,
    );
    expect(proof.tokenValidationTestDoubleRepositoryInventoryVerified).toBe(
      true,
    );
    expect(proof.fp0133PostmergeProofDurabilityVerified).toBe(true);
    expect(
      McpTokenValidationTestDoubleProofSchema.safeParse(proof).success,
    ).toBe(true);
  });

  it("fails durable inventory for simulated runtime, parser, decoder, validation, introspection, invalid-token, route-consumption, token-material, and OpenAI drift", () => {
    const base = {
      repoPaths: [
        FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
        proofCommandPath,
      ],
      sourceTextByPath: {
        [proofCommandPath]:
          "No token runtime, no token examples, and no OpenAI API calls.",
      },
    };
    const bearerMaterial = ["Authorization:", "Bearer", "x".repeat(24)].join(
      " ",
    );
    const jwtLikeMaterial = [
      "eyJjwtlikeheader1".padEnd(18, "x"),
      "jwtlikepayload2".padEnd(18, "x"),
      "jwtlikesignature3".padEnd(18, "x"),
    ].join(".");
    const openAiSource = [
      `import ${["Open", "AI"].join("")} from "openai";`,
      `const client = new ${["Open", "AI"].join("")}();`,
      `client.${["responses", "create"].join(".")}({ input: "x" });`,
      `process.env.${["OPENAI", "API", "KEY"].join("_")};`,
      ["api", "openai", "com"].join("."),
    ].join("\n");

    expect(
      inventoryWith({
        ...base,
        repoPaths: [
          ...base.repoPaths,
          "packages/domain/src/read-only-app-mcp-token-validation-test-double-runtime.ts",
        ],
      }).noTokenValidationTestDoubleRuntimeRepositoryInventoryVerified,
    ).toBe(false);
    expect(
      inventoryWith({
        ...base,
        repoPaths: [
          ...base.repoPaths,
          "packages/domain/src/read-only-app-mcp-token-parser.ts",
          "packages/domain/src/read-only-app-mcp-jwt-decoder.ts",
          "packages/domain/src/read-only-app-mcp-token-introspection.ts",
        ],
        sourceTextByPath: {
          ...base.sourceTextByPath,
          "packages/domain/src/read-only-app-mcp-token-parser.ts": `${[
            "decode",
            "Jwt",
          ].join("")}(candidate);\n${["introspect", "Token"].join("")}();`,
        },
      }).noTokenParsingRuntimeRepositoryInventoryVerified,
    ).toBe(false);
    expect(
      inventoryWith({
        ...base,
        repoPaths: [
          ...base.repoPaths,
          "packages/domain/src/read-only-app-mcp-token-validation-runtime-implementation.ts",
        ],
        sourceTextByPath: {
          ...base.sourceTextByPath,
          "packages/domain/src/read-only-app-mcp-token-validation-runtime-implementation.ts": `${[
            "validate",
            "Token",
          ].join("")}(candidate);`,
        },
      }).noTokenValidationRuntimeRepositoryInventoryVerified,
    ).toBe(false);
    expect(
      inventoryWith({
        ...base,
        repoPaths: [
          ...base.repoPaths,
          "packages/domain/src/read-only-app-mcp-invalid-token-challenge-runtime.ts",
        ],
        sourceTextByPath: {
          ...base.sourceTextByPath,
          "packages/domain/src/read-only-app-mcp-invalid-token-challenge-runtime.ts": `${[
            "invalid",
            "Token",
            "Challenge",
          ].join("")}();`,
        },
      }).noInvalidTokenChallengeRuntimeRepositoryInventoryVerified,
    ).toBe(false);
    expect(
      inventoryWith({
        ...base,
        sourceTextByPath: {
          ...base.sourceTextByPath,
          [mcpRoutePath]: `import { testDouble } from "${[
            "read-only-app-mcp-token-validation",
            "test-double",
          ].join("-")}";`,
        },
      }).noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified,
    ).toBe(false);
    expect(
      inventoryWith({
        ...base,
        repoPaths: [
          ...base.repoPaths,
          "docs/examples/real-token-example.md",
          "docs/examples/jwt-like-example.md",
          "docs/examples/bearer-token-material.md",
        ],
        sourceTextByPath: {
          ...base.sourceTextByPath,
          "tools/read-only-mcp-token-validation-test-double-contract-proof.mjs": `${bearerMaterial}\n${jwtLikeMaterial}`,
        },
      }).noBearerTokenMaterialRepositoryInventoryVerified,
    ).toBe(false);
    expect(
      inventoryWith({
        ...base,
        sourceTextByPath: {
          ...base.sourceTextByPath,
          "tools/read-only-mcp-token-validation-test-double-contract-proof.mjs":
            openAiSource,
        },
      }).noOpenAiApiSourceScanVerified,
    ).toBe(false);
  });

  it("allows safe docs and proof absence text in durable inventory scans", () => {
    const safeAbsenceText = [
      "No token validation runtime, no token parser, no JWT decoder, no introspection runtime, and no bearer token material examples are present.",
      "Do not use OPENAI_API_KEY, from openai imports, responses.create, chat.completions, or api.openai.com calls.",
      "WWW-Authenticate examples prohibit token material and describe absence only.",
    ].join("\n");
    const inventory = verifyMcpTokenValidationTestDoubleRepositoryInventory({
      repoPaths: [
        FP0133_TOKEN_VALIDATION_TEST_DOUBLE_CONTRACTS_PLAN_PATH,
        proofCommandPath,
      ],
      sourceTextByPath: {
        [proofCommandPath]: safeAbsenceText,
      },
    });

    expect(inventory.tokenValidationTestDoubleRepositoryInventoryVerified).toBe(
      true,
    );
  });

  it("keeps FP-0132 through FP-0100 prior boundaries intact", () => {
    const repoPaths = repoFilePaths();

    expect(
      verifyFp0132TokenValidationRuntimeContractsBoundary({
        planText: safeRead(FP0132_TOKEN_VALIDATION_RUNTIME_CONTRACTS_PLAN_PATH),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0131TokenValidationRuntimeSequencingPlanBoundary({
        planText: safeRead(
          FP0131_TOKEN_VALIDATION_RUNTIME_SEQUENCING_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0130LocalMissingTokenChallengeImplementationBoundary({
        planText: safeRead(
          FP0130_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_LOCAL_IMPLEMENTATION_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0128TokenValidationReadinessContractsBoundary({
        planText: safeRead(
          FP0128_TOKEN_VALIDATION_READINESS_CONTRACTS_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0127WwwAuthenticateAuthChallengeContractsBoundary({
        planText: safeRead(
          FP0127_WWW_AUTHENTICATE_AUTH_CHALLENGE_CONTRACTS_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      docsBoundary(fp0125PlanPath, [
        "local-only/read-only",
        "/.well-known/oauth-protected-resource/mcp",
      ]),
    ).toBe(true);
    expect(
      verifyFp0123ProtectedResourceMetadataRouteInputContractsBoundary({
        planText: safeRead(
          FP0123_PROTECTED_RESOURCE_METADATA_ROUTE_INPUT_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0122ProtectedResourceMetadataBuilderContractsBoundary({
        planText: safeRead(
          FP0122_PROTECTED_RESOURCE_METADATA_BUILDER_PLAN_PATH,
        ),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      verifyFp0120CanonicalResourceAuthServerPlanBoundary({
        planText: safeRead(FP0120_CANONICAL_RESOURCE_AUTH_SERVER_PLAN_PATH),
        repoPaths,
      }),
    ).toBe(true);
    expect(
      docsBoundary(fp0107PlanPath, ["local/control-plane", "post /mcp"]),
    ).toBe(true);
    expect(
      docsBoundary(fp0106PlanPath, ["mcp protocol envelope", "tools/call"]),
    ).toBe(true);
    expect(
      docsBoundary(fp0100PlanPath, [
        "public-app security boundary",
        "local/proof-only",
      ]),
    ).toBe(true);
  });
});

function docsBoundary(path: string, requiredTexts: readonly string[]) {
  const normalized = normalize(safeRead(path));
  return requiredTexts.every((requiredText) =>
    normalized.includes(normalize(requiredText)),
  );
}

function countMatches(text: string, pattern: RegExp) {
  return [...text.matchAll(pattern)].length;
}

function repoFilePaths() {
  const results: string[] = [];
  const skipped = new Set([
    ".git",
    ".next",
    ".turbo",
    "coverage",
    "dist",
    "node_modules",
  ]);

  function walk(directory: string, prefix = "") {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && skipped.has(entry.name)) continue;
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) walk(absolutePath, relativePath);
      else results.push(relativePath);
    }
  }

  walk(repoRoot);
  return results.sort();
}

function proofSourceTextByPath() {
  return Object.fromEntries(
    repoFilePaths()
      .filter(isMcpTokenValidationTestDoubleProofSourcePath)
      .map((path) => [path, safeRead(path)]),
  );
}

function inventoryWith(
  input: Parameters<
    typeof verifyMcpTokenValidationTestDoubleRepositoryInventory
  >[0],
) {
  return verifyMcpTokenValidationTestDoubleRepositoryInventory(input);
}

function safeRead(path: string) {
  return readFileSync(join(repoRoot, path), "utf8");
}

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}
