import { z } from "zod";
import {
  FinanceCompanyKeySchema,
  OperatorReadinessResultSchema,
} from "@pocket-cto/domain";

export const operatorReadinessCompanyKeyParamsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
  })
  .strict();

export { OperatorReadinessResultSchema };
