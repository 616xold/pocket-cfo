import { z } from "zod";
import {
  DeliveryReadinessResultSchema,
  FinanceCompanyKeySchema,
} from "@pocket-cto/domain";

export const deliveryReadinessCompanyKeyParamsSchema = z
  .object({
    companyKey: FinanceCompanyKeySchema,
  })
  .strict();

export { DeliveryReadinessResultSchema };
