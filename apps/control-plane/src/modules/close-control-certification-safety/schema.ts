import { z } from "zod";
import {
  CloseControlCertificationSafetyResultSchema,
  FinanceCompanyKeySchema,
} from "@pocket-cto/domain";

export const closeControlCertificationSafetyCompanyKeyParamsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
  })
  .strict();

export { CloseControlCertificationSafetyResultSchema };
