import { z } from "zod";
import {
  ExternalDeliveryHumanConfirmationBoundaryResultSchema,
  FinanceCompanyKeySchema,
} from "@pocket-cto/domain";

export const externalDeliveryHumanConfirmationBoundaryCompanyKeyParamsSchema =
  z
    .object({
      companyKey: FinanceCompanyKeySchema,
    })
    .strict();

export { ExternalDeliveryHumanConfirmationBoundaryResultSchema };
