import type { FastifyInstance } from "fastify";
import type { ExternalProviderBoundaryServicePort } from "../../lib/types";
import { externalProviderBoundaryCompanyKeyParamsSchema } from "./schema";

export async function registerExternalProviderBoundaryRoutes(
  app: FastifyInstance,
  deps: {
    externalProviderBoundaryService: ExternalProviderBoundaryServicePort;
  },
) {
  app.get(
    "/external-provider-boundary/companies/:companyKey",
    async (request) => {
      const params = externalProviderBoundaryCompanyKeyParamsSchema.parse(
        request.params,
      );

      return deps.externalProviderBoundaryService.getExternalProviderBoundary(
        params.companyKey,
      );
    },
  );
}
