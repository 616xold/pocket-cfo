import type { FastifyInstance } from "fastify";
import type { CloseControlAcknowledgementServicePort } from "../../lib/types";
import { closeControlAcknowledgementCompanyKeyParamsSchema } from "./schema";

export async function registerCloseControlAcknowledgementRoutes(
  app: FastifyInstance,
  deps: {
    closeControlAcknowledgementService: CloseControlAcknowledgementServicePort;
  },
) {
  app.get(
    "/close-control/companies/:companyKey/acknowledgement-readiness",
    async (request) => {
      const params = closeControlAcknowledgementCompanyKeyParamsSchema.parse(
        request.params,
      );

      return deps.closeControlAcknowledgementService.getAcknowledgementReadiness(
        params.companyKey,
      );
    },
  );
}
