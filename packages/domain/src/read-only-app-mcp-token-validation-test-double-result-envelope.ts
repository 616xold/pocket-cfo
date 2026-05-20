import { z } from "zod";
import { McpTokenValidationTestDoubleFailureModeSchema } from "./read-only-app-mcp-token-validation-test-double-contracts";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const McpTokenValidationTestDoubleResultEnvelopeSchema = z
  .object({
    resultKind: z.enum(["accepted_test_double", "rejected_test_double"]),
    accepted: z.boolean(),
    syntheticScenarioId: z.string().min(1),
    subjectOrgCompanyBinding: z
      .object({
        subjectRef: z.string().min(1).optional(),
        orgRef: z.string().min(1).optional(),
        companyRef: z.string().min(1).optional(),
        companyKeySelectorOnly: trueLiteral,
      })
      .strict(),
    failureMode: McpTokenValidationTestDoubleFailureModeSchema.optional(),
    carriesRawToken: falseLiteral,
    carriesAuthorizationHeader: falseLiteral,
    carriesJwtClaims: falseLiteral,
  })
  .strict();
