import type { FastifyInstance } from "fastify";
import type { OperatorReadinessServicePort } from "../../lib/types";
import { operatorReadinessCompanyKeyParamsSchema } from "./schema";

export async function registerOperatorReadinessRoutes(
  app: FastifyInstance,
  deps: { operatorReadinessService: OperatorReadinessServicePort },
) {
  app.get("/operator-readiness/companies/:companyKey", async (request) => {
    const params = operatorReadinessCompanyKeyParamsSchema.parse(
      request.params,
    );

    return deps.operatorReadinessService.getReadiness(params.companyKey);
  });
}
