import { z } from "zod";
import { FinanceCompanyKeySchema } from "@pocket-cto/domain";

export const closeControlCertificationBoundaryCompanyKeyParamsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
  })
  .strict();
