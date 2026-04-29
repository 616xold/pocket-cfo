import { z } from "zod";
import { FinanceCompanyKeySchema } from "@pocket-cto/domain";

export const externalProviderBoundaryCompanyKeyParamsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
  })
  .strict();
