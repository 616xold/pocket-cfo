import type { FastifyInstance } from "fastify";
import type { CfoWikiServicePort } from "../../lib/types";
import {
  cfoWikiBindSourceBodySchema,
  cfoWikiCompanyKeyParamsSchema,
  cfoWikiCompileBodySchema,
  cfoWikiSourceParamsSchema,
  cfoWikiWildcardPageParamsSchema,
  parseWildcardPageKey,
} from "./schema";

export async function registerCfoWikiRoutes(
  app: FastifyInstance,
  deps: { cfoWikiService: CfoWikiServicePort },
) {
  app.post("/cfo-wiki/companies/:companyKey/compile", async (request, reply) => {
    const params = cfoWikiCompanyKeyParamsSchema.parse(request.params);
    const body = cfoWikiCompileBodySchema.parse(request.body ?? {});
    const compiled = await deps.cfoWikiService.compileCompanyWiki(
      params.companyKey,
      body,
    );

    reply.code(201);
    return compiled;
  });

  app.get("/cfo-wiki/companies/:companyKey", async (request) => {
    const params = cfoWikiCompanyKeyParamsSchema.parse(request.params);
    return deps.cfoWikiService.getCompanySummary(params.companyKey);
  });

  app.post(
    "/cfo-wiki/companies/:companyKey/sources/:sourceId/bind",
    async (request, reply) => {
      const params = cfoWikiSourceParamsSchema.parse(request.params);
      const body = cfoWikiBindSourceBodySchema.parse(request.body ?? {});
      const binding = await deps.cfoWikiService.bindCompanySource(
        params.companyKey,
        params.sourceId,
        body,
      );

      reply.code(201);
      return binding;
    },
  );

  app.get("/cfo-wiki/companies/:companyKey/sources", async (request) => {
    const params = cfoWikiCompanyKeyParamsSchema.parse(request.params);
    return deps.cfoWikiService.listCompanySources(params.companyKey);
  });

  app.get("/cfo-wiki/companies/:companyKey/index", async (request) => {
    const params = cfoWikiCompanyKeyParamsSchema.parse(request.params);
    return deps.cfoWikiService.getIndexPage(params.companyKey);
  });

  app.get("/cfo-wiki/companies/:companyKey/log", async (request) => {
    const params = cfoWikiCompanyKeyParamsSchema.parse(request.params);
    return deps.cfoWikiService.getLogPage(params.companyKey);
  });

  app.get("/cfo-wiki/companies/:companyKey/pages/*", async (request) => {
    const params = cfoWikiWildcardPageParamsSchema.parse(request.params);
    return deps.cfoWikiService.getPage(
      params.companyKey,
      parseWildcardPageKey(params["*"]),
    );
  });
}
