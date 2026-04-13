import { afterEach, describe, expect, it, vi } from "vitest";
import type { FastifyInstance } from "fastify";
import type {
  CfoWikiCompanySourceListView,
  CfoWikiCompanySummary,
  CfoWikiCompileResult,
  CfoWikiCompileRunRecord,
  CfoWikiSourceBindingView,
  CfoWikiPageView,
} from "@pocket-cto/domain";
import { buildApp } from "../../app";
import { createInMemoryContainer } from "../../bootstrap";
import type { CfoWikiServicePort } from "../../lib/types";

describe("CFO Wiki routes", () => {
  const apps: FastifyInstance[] = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("POST /cfo-wiki/companies/:companyKey/compile defaults the compile request and returns 201", async () => {
    const compileCompanyWiki = vi.fn(async () => buildCompileResult());
    const app = await createTestApp(apps, {
      compileCompanyWiki,
    });

    const response = await app.inject({
      method: "POST",
      url: "/cfo-wiki/companies/acme/compile",
      payload: {},
    });

    expect(response.statusCode).toBe(201);
    expect(compileCompanyWiki).toHaveBeenCalledWith("acme", {
      triggeredBy: "operator",
    });
    expect(response.json()).toMatchObject({
      companyKey: "acme",
      pageCount: 4,
      compileRun: {
        status: "succeeded",
      },
    });
  });

  it("GET /cfo-wiki/companies/:companyKey/pages/* decodes canonical slash-delimited page keys", async () => {
    const getPage = vi.fn(async () => buildPageView());
    const app = await createTestApp(apps, {
      getPage,
    });

    const response = await app.inject({
      method: "GET",
      url: "/cfo-wiki/companies/acme/pages/periods%2F2026-03%2Findex",
    });

    expect(response.statusCode).toBe(200);
    expect(getPage).toHaveBeenCalledWith("acme", "periods/2026-03/index");
    expect(response.json()).toMatchObject({
      page: {
        pageKey: "periods/2026-03/index",
      },
    });
  });

  it("POST /cfo-wiki/companies/:companyKey/sources/:sourceId/bind defaults the binding body and returns 201", async () => {
    const bindCompanySource = vi.fn(async () => buildSourceBindingView());
    const app = await createTestApp(apps, {
      bindCompanySource,
    });

    const response = await app.inject({
      method: "POST",
      url: "/cfo-wiki/companies/acme/sources/11111111-1111-4111-8111-111111111111/bind",
      payload: {},
    });

    expect(response.statusCode).toBe(201);
    expect(bindCompanySource).toHaveBeenCalledWith(
      "acme",
      "11111111-1111-4111-8111-111111111111",
      {
        boundBy: "operator",
        includeInCompile: true,
      },
    );
    expect(response.json()).toMatchObject({
      companyKey: "acme",
      source: {
        binding: {
          includeInCompile: true,
        },
      },
    });
  });

  it("GET /cfo-wiki/companies/:companyKey/sources returns bound-source summaries", async () => {
    const listCompanySources = vi.fn(async () => buildCompanySourcesView());
    const app = await createTestApp(apps, {
      listCompanySources,
    });

    const response = await app.inject({
      method: "GET",
      url: "/cfo-wiki/companies/acme/sources",
    });

    expect(response.statusCode).toBe(200);
    expect(listCompanySources).toHaveBeenCalledWith("acme");
    expect(response.json()).toMatchObject({
      companyKey: "acme",
      sourceCount: 1,
    });
  });

  it("returns 400 when the wildcard page key is not a valid canonical F3A key", async () => {
    const getPage = vi.fn(async () => buildPageView());
    const app = await createTestApp(apps, {
      getPage,
    });

    const response = await app.inject({
      method: "GET",
      url: "/cfo-wiki/companies/acme/pages/not-a-valid-page",
    });

    expect(response.statusCode).toBe(400);
    expect(getPage).not.toHaveBeenCalled();
    expect(response.json()).toMatchObject({
      error: {
        code: "invalid_request",
      },
    });
  });
});

async function createTestApp(
  apps: FastifyInstance[],
  overrides: Partial<CfoWikiServicePort>,
) {
  const baseContainer = createInMemoryContainer();
  const cfoWikiService = {
    ...createWikiServiceMock(),
    ...overrides,
  };
  const app = await buildApp({
    container: {
      ...baseContainer,
      cfoWikiService,
    },
  });

  apps.push(app);
  return app;
}

function createWikiServiceMock() {
  return {
    bindCompanySource: vi.fn(async () => buildSourceBindingView()),
    compileCompanyWiki: vi.fn(async () => buildCompileResult()),
    getCompanySummary: vi.fn(async () => buildCompanySummary()),
    getIndexPage: vi.fn(async () => buildPageView()),
    getLogPage: vi.fn(async () => buildPageView()),
    getPage: vi.fn(async () => buildPageView()),
    listCompanySources: vi.fn(async () => buildCompanySourcesView()),
  } satisfies CfoWikiServicePort;
}

function buildCompileRun(): CfoWikiCompileRunRecord {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    companyId: "22222222-2222-4222-8222-222222222222",
    status: "succeeded",
    startedAt: "2026-04-13T12:00:00.000Z",
    completedAt: "2026-04-13T12:00:01.000Z",
    triggeredBy: "operator",
    triggerKind: "manual",
    compilerVersion: "test",
    stats: {
      pageCount: 4,
    },
    errorSummary: null,
    createdAt: "2026-04-13T12:00:00.000Z",
    updatedAt: "2026-04-13T12:00:01.000Z",
  };
}

function buildCompanySummary(): CfoWikiCompanySummary {
  return {
    companyId: "22222222-2222-4222-8222-222222222222",
    companyKey: "acme",
    companyDisplayName: "Acme Holdings",
    latestSuccessfulCompileRun: buildCompileRun(),
    pageCount: 4,
    pageCountsByKind: {
      index: 1,
      log: 1,
      company_overview: 1,
      period_index: 0,
      source_coverage: 1,
      source_digest: 0,
    },
    pages: [],
    freshnessSummary: {
      state: "missing",
      summary: "Missing",
    },
    limitations: [],
  };
}

function buildCompileResult(): CfoWikiCompileResult {
  return {
    companyId: "22222222-2222-4222-8222-222222222222",
    companyKey: "acme",
    companyDisplayName: "Acme Holdings",
    compileRun: buildCompileRun(),
    changedPageKeys: ["company/overview", "index", "log", "sources/coverage"],
    pageInventory: [],
    pageCount: 4,
    pageCountsByKind: {
      index: 1,
      log: 1,
      company_overview: 1,
      period_index: 0,
      source_coverage: 1,
      source_digest: 0,
    },
    freshnessSummary: {
      state: "missing",
      summary: "Missing",
    },
    limitations: [],
  };
}

function buildPageView(): CfoWikiPageView {
  return {
    companyId: "22222222-2222-4222-8222-222222222222",
    companyKey: "acme",
    companyDisplayName: "Acme Holdings",
    page: {
      id: "33333333-3333-4333-8333-333333333333",
      companyId: "22222222-2222-4222-8222-222222222222",
      compileRunId: "11111111-1111-4111-8111-111111111111",
      pageKey: "periods/2026-03/index",
      pageKind: "period_index",
      ownershipKind: "compiler_owned",
      temporalStatus: "current",
      title: "Acme March 2026",
      summary: "Deterministic period page",
      markdownBody: "# Acme March 2026",
      freshnessSummary: {
        state: "fresh",
        summary: "Fresh",
      },
      limitations: [],
      lastCompiledAt: "2026-04-13T12:00:01.000Z",
      createdAt: "2026-04-13T12:00:01.000Z",
      updatedAt: "2026-04-13T12:00:01.000Z",
      markdownPath: "periods/2026-03/index.md",
    },
    links: [],
    backlinks: [],
    refs: [],
    latestCompileRun: buildCompileRun(),
    freshnessSummary: {
      state: "fresh",
      summary: "Fresh",
    },
    limitations: [],
  };
}

function buildSourceBindingView(): CfoWikiSourceBindingView {
  return {
    companyId: "22222222-2222-4222-8222-222222222222",
    companyKey: "acme",
    companyDisplayName: "Acme Holdings",
    source: {
      binding: {
        id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        companyId: "22222222-2222-4222-8222-222222222222",
        sourceId: "11111111-1111-4111-8111-111111111111",
        includeInCompile: true,
        documentRole: null,
        boundBy: "operator",
        createdAt: "2026-04-13T12:00:01.000Z",
        updatedAt: "2026-04-13T12:00:01.000Z",
      },
      source: {
        id: "11111111-1111-4111-8111-111111111111",
        kind: "document",
        originKind: "manual",
        name: "Board deck",
        description: null,
        createdBy: "finance-operator",
        createdAt: "2026-04-13T12:00:00.000Z",
        updatedAt: "2026-04-13T12:00:01.000Z",
      },
      latestSnapshot: null,
      latestSourceFile: null,
      latestExtract: null,
      limitations: [],
    },
  };
}

function buildCompanySourcesView(): CfoWikiCompanySourceListView {
  return {
    companyId: "22222222-2222-4222-8222-222222222222",
    companyKey: "acme",
    companyDisplayName: "Acme Holdings",
    sourceCount: 1,
    sources: [buildSourceBindingView().source],
    limitations: [],
  };
}
