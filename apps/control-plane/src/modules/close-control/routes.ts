import type { FastifyInstance } from "fastify";
import type { CloseControlServicePort } from "../../lib/types";
import { closeControlCompanyKeyParamsSchema } from "./schema";

export async function registerCloseControlRoutes(
  app: FastifyInstance,
  deps: { closeControlService: CloseControlServicePort },
) {
  app.get("/close-control/companies/:companyKey/checklist", async (request) => {
    const params = closeControlCompanyKeyParamsSchema.parse(request.params);
    return deps.closeControlService.getChecklist(params.companyKey);
  });
}
