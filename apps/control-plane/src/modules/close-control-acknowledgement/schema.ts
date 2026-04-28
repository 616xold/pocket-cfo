import { z } from "zod";
import {
  CloseControlAcknowledgementReadinessResultSchema,
  FinanceCompanyKeySchema,
} from "@pocket-cto/domain";

export const closeControlAcknowledgementCompanyKeyParamsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
  })
  .strict();

export { CloseControlAcknowledgementReadinessResultSchema };
