import { z } from "zod";
import {
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY,
  MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES,
  McpTokenValidationTestDoubleFailureModeSchema,
} from "./read-only-app-mcp-token-validation-test-double-contracts";
import {
  MCP_SYNTHETIC_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_EVALUATOR_SCHEMA_VERSION,
  SyntheticTokenValidationEvaluationProofSchema,
  buildSyntheticTokenValidationEvaluationProof,
  type SyntheticTokenValidationEvaluationProof,
} from "./read-only-app-mcp-token-validation-test-double-evaluator-proof";
import { McpTokenValidationTestDoubleResultEnvelopeSchema } from "./read-only-app-mcp-token-validation-test-double-result-envelope";
import { scanTokenValidationNoLeakage } from "./read-only-app-mcp-token-validation";

export {
  MCP_SYNTHETIC_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_EVALUATOR_SCHEMA_VERSION,
  SyntheticTokenValidationEvaluationProofSchema,
  buildSyntheticTokenValidationEvaluationProof,
  type SyntheticTokenValidationEvaluationProof,
};

export const SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME = "accepted";

const SyntheticScenarioOutcomeSchema = z.union([
  z.literal(SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME),
  McpTokenValidationTestDoubleFailureModeSchema,
]);

export const SyntheticTokenValidationScenarioDescriptorSchema = z
  .object({
    schemaVersion: z.literal(
      MCP_SYNTHETIC_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_EVALUATOR_SCHEMA_VERSION,
    ),
    descriptorKind: z.literal("synthetic_token_validation_scenario_descriptor"),
    syntheticScenarioId: z.string().min(1),
    family: z.enum(MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES),
    outcome: SyntheticScenarioOutcomeSchema,
    companyKey: z.string().min(1),
    companyKeyRole: z.literal("selector_only"),
    syntheticBinding: z
      .object({
        companyRef: z.string().min(1).optional(),
        orgRef: z.string().min(1).optional(),
        subjectRef: z.string().min(1).optional(),
      })
      .strict()
      .optional(),
    syntheticReason: z.string().min(1).optional(),
  })
  .strict();

export type SyntheticTokenValidationScenarioDescriptor = z.infer<
  typeof SyntheticTokenValidationScenarioDescriptorSchema
>;
export type SyntheticTokenValidationScenarioFamily =
  (typeof MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES)[number];
export type SyntheticTokenValidationScenarioOutcome = z.infer<
  typeof SyntheticScenarioOutcomeSchema
>;

export class SyntheticTokenValidationScenarioError extends Error {
  constructor(readonly rejectionReasons: readonly string[]) {
    super(rejectionReasons.join(", "));
    this.name = "SyntheticTokenValidationScenarioError";
  }
}

export function buildSyntheticTokenValidationScenario(
  input: Partial<SyntheticTokenValidationScenarioDescriptor> = {},
): SyntheticTokenValidationScenarioDescriptor {
  const outcome = input.outcome ?? SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME;
  const family = input.family ?? familyForOutcome(outcome);
  const scenario = SyntheticTokenValidationScenarioDescriptorSchema.parse({
    schemaVersion:
      MCP_SYNTHETIC_TOKEN_VALIDATION_TEST_DOUBLE_LOCAL_EVALUATOR_SCHEMA_VERSION,
    descriptorKind: "synthetic_token_validation_scenario_descriptor",
    syntheticScenarioId:
      input.syntheticScenarioId ?? `synthetic-${family}-${outcome}`,
    family,
    outcome,
    companyKey: input.companyKey ?? "synthetic-company-key",
    companyKeyRole: "selector_only",
    syntheticBinding:
      input.syntheticBinding ??
      (outcome === SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME
        ? {
            companyRef: "synthetic-company-ref",
            orgRef: "synthetic-org-ref",
            subjectRef: "synthetic-subject-ref",
          }
        : undefined),
    syntheticReason:
      input.syntheticReason ??
      `${family} synthetic ${outcome} descriptor with no credential material`,
  });
  assertSyntheticScenarioContainsNoTokenMaterial(scenario);
  return scenario;
}

export function evaluateSyntheticTokenValidationScenario(input: unknown) {
  try {
    assertSyntheticScenarioContainsNoTokenMaterial(input);
    const scenario =
      SyntheticTokenValidationScenarioDescriptorSchema.parse(input);
    if (scenario.outcome === SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME) {
      return buildAcceptedEnvelope(scenario);
    }
    return buildRejectedEnvelope(scenario, scenario.outcome);
  } catch (error) {
    const failureMode =
      error instanceof SyntheticTokenValidationScenarioError &&
      error.rejectionReasons.some(isTokenMaterialRejectionReason)
        ? "token-passthrough-attempt"
        : "malformed";
    return buildRejectedEnvelope(
      buildSyntheticTokenValidationScenario({
        family: familyForOutcome(failureMode),
        outcome: failureMode,
        syntheticReason: "synthetic evaluator rejected non-descriptor input",
        syntheticScenarioId: `synthetic-rejected-${failureMode}`,
      }),
      failureMode,
    );
  }
}

export function assertSyntheticScenarioContainsNoTokenMaterial(
  input: unknown,
): asserts input is SyntheticTokenValidationScenarioDescriptor {
  const rejectionReasons = tokenMaterialRejectionReasons(input);
  if (rejectionReasons.length > 0) {
    throw new SyntheticTokenValidationScenarioError(rejectionReasons);
  }
}

export function syntheticFailureModesByFamily() {
  return Object.fromEntries(
    MCP_TOKEN_VALIDATION_TEST_DOUBLE_SCENARIO_FAMILIES.map((family) => [
      family,
      MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY.filter(
        (failureMode) => familyForOutcome(failureMode) === family,
      ),
    ]),
  ) as Record<
    SyntheticTokenValidationScenarioFamily,
    (typeof MCP_TOKEN_VALIDATION_TEST_DOUBLE_FAILURE_TAXONOMY)[number][]
  >;
}

function buildAcceptedEnvelope(
  scenario: SyntheticTokenValidationScenarioDescriptor,
) {
  return McpTokenValidationTestDoubleResultEnvelopeSchema.parse({
    accepted: true,
    carriesAuthorizationHeader: false,
    carriesJwtClaims: false,
    carriesRawToken: false,
    resultKind: "accepted_test_double",
    subjectOrgCompanyBinding: {
      companyKeySelectorOnly: true,
      companyRef:
        scenario.syntheticBinding?.companyRef ?? "synthetic-company-ref",
      orgRef: scenario.syntheticBinding?.orgRef ?? "synthetic-org-ref",
      subjectRef:
        scenario.syntheticBinding?.subjectRef ?? "synthetic-subject-ref",
    },
    syntheticScenarioId: scenario.syntheticScenarioId,
  });
}

function buildRejectedEnvelope(
  scenario: SyntheticTokenValidationScenarioDescriptor,
  failureMode: Exclude<
    SyntheticTokenValidationScenarioOutcome,
    typeof SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME
  >,
) {
  return McpTokenValidationTestDoubleResultEnvelopeSchema.parse({
    accepted: false,
    carriesAuthorizationHeader: false,
    carriesJwtClaims: false,
    carriesRawToken: false,
    failureMode,
    resultKind: "rejected_test_double",
    subjectOrgCompanyBinding: {
      companyKeySelectorOnly: true,
    },
    syntheticScenarioId: scenario.syntheticScenarioId,
  });
}

function tokenMaterialRejectionReasons(input: unknown) {
  const text =
    typeof input === "string" ? input : (JSON.stringify(input) ?? "");
  const parsedDescriptor =
    SyntheticTokenValidationScenarioDescriptorSchema.safeParse(input);
  const leakageScan = scanTokenValidationNoLeakage(text);
  const credentialLikePatterns = [
    ["authorization_header_like", /\bauthorization\s*[:=]/iu],
    ["bearer_material_like", /\bbearer\b/iu],
    [
      "jwt_like_string",
      /\b[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/u,
    ],
    [
      "oauth_credential_like",
      /\b(?:access|refresh|client)[_-](?:token|secret)\s*[:=]/iu,
    ],
    ["session_cookie_like", /\b(?:session|cookie)\s*[:=]/iu],
    [
      "provider_credential_like",
      /\bprovider[_-](?:credential|secret|key)\s*[:=]/iu,
    ],
  ] as const;
  return [
    ...(parsedDescriptor.success ? [] : ["synthetic_descriptor_required"]),
    ...leakageScan.rejectionReasons,
    ...credentialLikePatterns
      .filter(([, pattern]) => pattern.test(text))
      .map(([reason]) => reason),
  ];
}

function isTokenMaterialRejectionReason(reason: string) {
  return reason !== "synthetic_descriptor_required";
}

function familyForOutcome(
  outcome: SyntheticTokenValidationScenarioOutcome,
): SyntheticTokenValidationScenarioFamily {
  const familyByFailure = {
    expired: "temporal",
    malformed: "issuer",
    replayed: "revocation_replay",
    revoked: "revocation_replay",
    "token-passthrough-attempt": "revocation_replay",
    "wrong-audience": "audience_resource",
    "wrong-company": "subject_org_company",
    "wrong-issuer": "issuer",
    "wrong-org": "subject_org_company",
    "wrong-resource": "audience_resource",
    "wrong-scope": "scope",
  } as const satisfies Record<
    Exclude<
      SyntheticTokenValidationScenarioOutcome,
      typeof SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME
    >,
    SyntheticTokenValidationScenarioFamily
  >;

  if (outcome === SYNTHETIC_TOKEN_VALIDATION_ACCEPTED_OUTCOME) {
    return "subject_org_company";
  }
  return familyByFailure[outcome];
}
