import { z } from "zod";
import {
  CloseControlReviewSummaryResultSchema,
  FinanceCompanyKeySchema,
} from "@pocket-cto/domain";

export const closeControlReviewSummaryCompanyKeyParamsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
  })
  .strict();

export { CloseControlReviewSummaryResultSchema };
