import { z } from "zod";
import {
  CloseControlChecklistResultSchema,
  FinanceCompanyKeySchema,
} from "@pocket-cto/domain";

export const closeControlCompanyKeyParamsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
  })
  .strict();

export { CloseControlChecklistResultSchema };
