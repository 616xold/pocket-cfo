import { describe, expect, it } from "vitest";
import type { FinanceCompanyRecord, FinanceReportingPeriodRecord } from "@pocket-cto/domain";
import { buildPeriodPageKey, buildWikiPageRegistry } from "./page-registry";
import type { WikiDocumentSourceState } from "./document-state";

describe("buildWikiPageRegistry", () => {
  const company: FinanceCompanyRecord = {
    id: "11111111-1111-4111-8111-111111111111",
    companyKey: "acme",
    displayName: "Acme Holdings",
    createdAt: "2026-04-13T10:00:00.000Z",
    updatedAt: "2026-04-13T10:00:00.000Z",
  };

  it("returns the deterministic F3A registry with canonical page keys", () => {
    const periods: FinanceReportingPeriodRecord[] = [
      {
        id: "22222222-2222-4222-8222-222222222222",
        companyId: company.id,
        periodKey: "2026-03",
        label: "March 2026",
        periodStart: "2026-03-01",
        periodEnd: "2026-03-31",
        createdAt: "2026-04-13T10:00:00.000Z",
        updatedAt: "2026-04-13T10:00:00.000Z",
      },
      {
        id: "33333333-3333-4333-8333-333333333333",
        companyId: company.id,
        periodKey: "2026-02",
        label: "February 2026",
        periodStart: "2026-02-01",
        periodEnd: "2026-02-28",
        createdAt: "2026-04-13T10:00:00.000Z",
        updatedAt: "2026-04-13T10:00:00.000Z",
      },
    ];

    expect(buildPeriodPageKey("2026-03")).toBe("periods/2026-03/index");
    expect(buildWikiPageRegistry(company, periods, [])).toEqual([
      expect.objectContaining({ pageKey: "company/overview", pageKind: "company_overview" }),
      expect.objectContaining({ pageKey: "index", pageKind: "index" }),
      expect.objectContaining({ pageKey: "log", pageKind: "log" }),
      expect.objectContaining({
        pageKey: "periods/2026-02/index",
        pageKind: "period_index",
        temporalStatus: "historical",
      }),
      expect.objectContaining({
        pageKey: "periods/2026-03/index",
        pageKind: "period_index",
        temporalStatus: "current",
      }),
      expect.objectContaining({ pageKey: "sources/coverage", pageKind: "source_coverage" }),
    ]);
  });

  it("adds source digest pages for compiled bound document snapshots", () => {
    const documentSources: WikiDocumentSourceState[] = [
      {
        binding: {
          id: "77777777-7777-4777-8777-777777777777",
          companyId: company.id,
          sourceId: "88888888-8888-4888-8888-888888888888",
          includeInCompile: true,
          documentRole: "board_material",
          boundBy: "finance-operator",
          createdAt: "2026-04-13T10:00:00.000Z",
          updatedAt: "2026-04-13T10:00:00.000Z",
        },
        source: {
          id: "88888888-8888-4888-8888-888888888888",
          kind: "document",
          originKind: "manual",
          name: "April board deck",
          description: null,
          createdBy: "finance-operator",
          createdAt: "2026-04-13T10:00:00.000Z",
          updatedAt: "2026-04-13T10:00:00.000Z",
        },
        snapshots: [
          {
            extract: {
              sourceId: "88888888-8888-4888-8888-888888888888",
              sourceSnapshotId: "99999999-9999-4999-8999-999999999999",
              sourceFileId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
              extractStatus: "extracted",
              documentKind: "markdown_text",
              title: "April board deck",
              headingOutline: [],
              excerptBlocks: [],
              extractedText: "# April board deck",
              renderedMarkdown: "# April board deck",
              warnings: [],
              errorSummary: null,
              parserVersion: "f3b-document-extract-v1",
              inputChecksumSha256:
                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
              extractedAt: "2026-04-13T10:00:00.000Z",
            },
            snapshot: {
              id: "99999999-9999-4999-8999-999999999999",
              sourceId: "88888888-8888-4888-8888-888888888888",
              version: 2,
              originalFileName: "april-board-deck.md",
              mediaType: "text/markdown",
              sizeBytes: 128,
              checksumSha256:
                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
              storageKind: "object_store",
              storageRef: "s3://bucket/april-board-deck.md",
              capturedAt: "2026-04-13T10:00:00.000Z",
              ingestStatus: "ready",
              ingestErrorSummary: null,
              createdAt: "2026-04-13T10:00:00.000Z",
              updatedAt: "2026-04-13T10:00:00.000Z",
            },
            sourceFile: {
              id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
              sourceId: "88888888-8888-4888-8888-888888888888",
              sourceSnapshotId: "99999999-9999-4999-8999-999999999999",
              originalFileName: "april-board-deck.md",
              mediaType: "text/markdown",
              sizeBytes: 128,
              checksumSha256:
                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
              storageKind: "object_store",
              storageRef: "s3://bucket/april-board-deck.md",
              createdBy: "finance-operator",
              capturedAt: "2026-04-13T10:00:00.000Z",
              createdAt: "2026-04-13T10:00:00.000Z",
            },
            temporalStatus: "current",
          },
        ],
      },
    ];

    expect(buildWikiPageRegistry(company, [], documentSources)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          pageKey: "sources/88888888-8888-4888-8888-888888888888/snapshots/2",
          pageKind: "source_digest",
          temporalStatus: "current",
        }),
      ]),
    );
  });
});
