import type { FastifyInstance } from "fastify";
import type { DeliveryReadinessServicePort } from "../../lib/types";
import { deliveryReadinessCompanyKeyParamsSchema } from "./schema";

export async function registerDeliveryReadinessRoutes(
  app: FastifyInstance,
  deps: { deliveryReadinessService: DeliveryReadinessServicePort },
) {
  app.get("/delivery-readiness/companies/:companyKey", async (request) => {
    const params = deliveryReadinessCompanyKeyParamsSchema.parse(
      request.params,
    );

    return deps.deliveryReadinessService.getDeliveryReadiness(
      params.companyKey,
    );
  });
}
