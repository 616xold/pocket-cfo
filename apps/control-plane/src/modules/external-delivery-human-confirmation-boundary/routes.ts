import type { FastifyInstance } from "fastify";
import type { ExternalDeliveryHumanConfirmationBoundaryServicePort } from "../../lib/types";
import { externalDeliveryHumanConfirmationBoundaryCompanyKeyParamsSchema } from "./schema";

export async function registerExternalDeliveryHumanConfirmationBoundaryRoutes(
  app: FastifyInstance,
  deps: {
    externalDeliveryHumanConfirmationBoundaryService: ExternalDeliveryHumanConfirmationBoundaryServicePort;
  },
) {
  app.get(
    "/external-delivery/companies/:companyKey/human-confirmation-boundary",
    async (request) => {
      const params =
        externalDeliveryHumanConfirmationBoundaryCompanyKeyParamsSchema.parse(
          request.params,
        );

      return deps.externalDeliveryHumanConfirmationBoundaryService.getHumanConfirmationBoundary(
        params.companyKey,
      );
    },
  );
}
