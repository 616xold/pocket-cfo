import type { FastifyInstance } from "fastify";
import type { CloseControlReviewSummaryServicePort } from "../../lib/types";
import { closeControlReviewSummaryCompanyKeyParamsSchema } from "./schema";

export async function registerCloseControlReviewSummaryRoutes(
  app: FastifyInstance,
  deps: {
    closeControlReviewSummaryService: CloseControlReviewSummaryServicePort;
  },
) {
  app.get(
    "/close-control/companies/:companyKey/review-summary",
    async (request) => {
      const params = closeControlReviewSummaryCompanyKeyParamsSchema.parse(
        request.params,
      );

      return deps.closeControlReviewSummaryService.getReviewSummary(
        params.companyKey,
      );
    },
  );
}
