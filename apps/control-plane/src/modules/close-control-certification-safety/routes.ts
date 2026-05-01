import type { FastifyInstance } from "fastify";
import type { CloseControlCertificationSafetyServicePort } from "../../lib/types";
import { closeControlCertificationSafetyCompanyKeyParamsSchema } from "./schema";

export async function registerCloseControlCertificationSafetyRoutes(
  app: FastifyInstance,
  deps: {
    closeControlCertificationSafetyService: CloseControlCertificationSafetyServicePort;
  },
) {
  app.get(
    "/close-control/companies/:companyKey/certification-safety",
    async (request) => {
      const params =
        closeControlCertificationSafetyCompanyKeyParamsSchema.parse(
          request.params,
        );

      return deps.closeControlCertificationSafetyService.getCertificationSafety(
        params.companyKey,
      );
    },
  );
}
