import type { FastifyInstance } from "fastify";
import type { CloseControlCertificationBoundaryServicePort } from "../../lib/types";
import { closeControlCertificationBoundaryCompanyKeyParamsSchema } from "./schema";

export async function registerCloseControlCertificationBoundaryRoutes(
  app: FastifyInstance,
  deps: {
    closeControlCertificationBoundaryService: CloseControlCertificationBoundaryServicePort;
  },
) {
  app.get(
    "/close-control/companies/:companyKey/certification-boundary",
    async (request) => {
      const params =
        closeControlCertificationBoundaryCompanyKeyParamsSchema.parse(
          request.params,
        );

      return deps.closeControlCertificationBoundaryService.getCertificationBoundary(
        params.companyKey,
      );
    },
  );
}
