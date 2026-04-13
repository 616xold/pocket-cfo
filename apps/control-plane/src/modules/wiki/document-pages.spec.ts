import { describe, expect, it } from "vitest";
import { InMemoryFinanceTwinRepository } from "../finance-twin/repository";
import { InMemorySourceRepository } from "../sources/repository";
import { SourceRegistryService } from "../sources/service";
import { InMemorySourceFileStorage } from "../sources/storage";
import { InMemoryCfoWikiRepository } from "./repository";
import { CfoWikiService } from "./service";

describe("F3B document pages", () => {
  it("binds a document source and compiles current plus superseded source digest pages", async () => {
    const context = createDocumentPageTestContext();

    await context.financeRepository.upsertCompany({
      companyKey: "acme",
      displayName: "Acme Holdings",
    });
    const document = await seedMarkdownDocumentSource(context, {
      companyKey: "acme",
      createdBy: "finance-operator",
      sourceName: "April board deck",
    });

    await context.wikiService.bindCompanySource("acme", document.sourceId, {
      boundBy: "finance-operator",
      documentRole: "board_material",
      includeInCompile: true,
    });

    const compiled = await context.wikiService.compileCompanyWiki("acme", {
      triggeredBy: "finance-operator",
    });
    const currentPage = await context.wikiService.getPage(
      "acme",
      `sources/${document.sourceId}/snapshots/2`,
    );
    const supersededPage = await context.wikiService.getPage(
      "acme",
      `sources/${document.sourceId}/snapshots/1`,
    );

    expect(compiled.pageCountsByKind.source_digest).toBe(2);
    expect(compiled.changedPageKeys).toEqual(
      expect.arrayContaining([
        `sources/${document.sourceId}/snapshots/1`,
        `sources/${document.sourceId}/snapshots/2`,
      ]),
    );
    expect(currentPage.page.temporalStatus).toBe("current");
    expect(currentPage.page.markdownBody).toContain("## Source Snapshot");
    expect(currentPage.page.markdownBody).toContain("## Heading Outline");
    expect(currentPage.links.some((link) => link.toPageKey === "sources/coverage")).toBe(
      true,
    );
    expect(currentPage.backlinks.length).toBeGreaterThan(0);
    expect(currentPage.refs.some((ref) => ref.refKind === "source_excerpt")).toBe(
      true,
    );
    expect(supersededPage.page.temporalStatus).toBe("superseded");
    expect(
      supersededPage.links.some(
        (link) => link.toPageKey === `sources/${document.sourceId}/snapshots/2`,
      ),
    ).toBe(true);
  });

  it("surfaces unsupported snapshots as visible gaps instead of fake document digests", async () => {
    const context = createDocumentPageTestContext();

    await context.financeRepository.upsertCompany({
      companyKey: "acme",
      displayName: "Acme Holdings",
    });
    const document = await seedMarkdownDocumentSource(context, {
      companyKey: "acme",
      createdBy: "finance-operator",
      sourceName: "April board deck",
    });

    await context.wikiService.bindCompanySource("acme", document.sourceId, {
      boundBy: "finance-operator",
      includeInCompile: true,
    });
    await context.wikiService.compileCompanyWiki("acme", {
      triggeredBy: "finance-operator",
    });

    const unsupportedPage = await context.wikiService.getPage(
      "acme",
      `sources/${document.sourceId}/snapshots/1`,
    );

    expect(unsupportedPage.freshnessSummary.state).toBe("missing");
    expect(unsupportedPage.page.markdownBody).toContain(
      "Extraction support status: `unsupported`",
    );
    expect(unsupportedPage.limitations.some((limitation) => limitation.includes("No stored raw source file"))).toBe(
      true,
    );
  });

  it("reuses cached document extracts when the source snapshot checksum is unchanged", async () => {
    const context = createDocumentPageTestContext();

    await context.financeRepository.upsertCompany({
      companyKey: "acme",
      displayName: "Acme Holdings",
    });
    const document = await seedMarkdownDocumentSource(context, {
      companyKey: "acme",
      createdBy: "finance-operator",
      sourceName: "April board deck",
    });

    await context.wikiService.bindCompanySource("acme", document.sourceId, {
      boundBy: "finance-operator",
      includeInCompile: true,
    });
    await context.wikiService.compileCompanyWiki("acme", {
      triggeredBy: "finance-operator",
    });
    const firstExtracts = await context.wikiRepository.listDocumentExtractsByCompanyId(
      document.companyId,
    );

    await context.wikiService.compileCompanyWiki("acme", {
      triggeredBy: "finance-operator",
    });
    const secondExtracts = await context.wikiRepository.listDocumentExtractsByCompanyId(
      document.companyId,
    );

    expect(secondExtracts).toHaveLength(firstExtracts.length);
    expect(secondExtracts).toEqual(
      expect.arrayContaining(
        firstExtracts.map((extract) =>
          expect.objectContaining({
            sourceSnapshotId: extract.sourceSnapshotId,
            extractedAt: extract.extractedAt,
          }),
        ),
      ),
    );
  });

  it("lists bound company sources with latest snapshot and extract status", async () => {
    const context = createDocumentPageTestContext();

    const company = await context.financeRepository.upsertCompany({
      companyKey: "acme",
      displayName: "Acme Holdings",
    });
    const document = await seedMarkdownDocumentSource(context, {
      companyKey: "acme",
      createdBy: "finance-operator",
      sourceName: "April board deck",
    });

    await context.wikiService.bindCompanySource("acme", document.sourceId, {
      boundBy: "finance-operator",
      includeInCompile: true,
      documentRole: "board_material",
    });
    await context.wikiService.compileCompanyWiki("acme", {
      triggeredBy: "finance-operator",
    });

    const sources = await context.wikiService.listCompanySources("acme");

    expect(sources).toMatchObject({
      companyId: company.id,
      companyKey: "acme",
      sourceCount: 1,
      sources: [
        {
          binding: {
            includeInCompile: true,
            documentRole: "board_material",
          },
          latestSnapshot: {
            version: 2,
          },
          latestExtract: {
            extractStatus: "extracted",
            documentKind: "markdown_text",
          },
        },
      ],
    });
  });
});

function createDocumentPageTestContext() {
  let tick = 0;
  const baseTime = new Date("2026-04-13T12:00:00.000Z");
  const now = () => new Date(baseTime.getTime() + tick++ * 1000);
  const sourceRepository = new InMemorySourceRepository();
  const sourceStorage = new InMemorySourceFileStorage();
  const sourceService = new SourceRegistryService(
    sourceRepository,
    sourceStorage,
    now,
  );
  const financeRepository = new InMemoryFinanceTwinRepository();
  const wikiRepository = new InMemoryCfoWikiRepository();
  const wikiService = new CfoWikiService({
    financeTwinRepository: financeRepository,
    sourceFileStorage: sourceStorage,
    sourceRepository,
    wikiRepository,
    now,
    compilerVersion: "test",
  });

  return {
    financeRepository,
    now,
    sourceService,
    sourceStorage,
    wikiRepository,
    wikiService,
  };
}

async function seedMarkdownDocumentSource(
  context: ReturnType<typeof createDocumentPageTestContext>,
  input: {
    companyKey: string;
    createdBy: string;
    sourceName: string;
  },
) {
  const created = await context.sourceService.createSource({
    kind: "document",
    name: input.sourceName,
    createdBy: input.createdBy,
    originKind: "manual",
    snapshot: {
      originalFileName: `${input.companyKey}-board-deck-link.txt`,
      mediaType: "text/plain",
      sizeBytes: 20,
      checksumSha256:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      storageKind: "external_url",
      storageRef: `https://example.com/${input.companyKey}/board-deck`,
      ingestStatus: "registered",
    },
  });
  const registered = await context.sourceService.registerSourceFile(
    created.source.id,
    {
      originalFileName: `${input.companyKey}-board-deck.md`,
      mediaType: "text/markdown",
      createdBy: input.createdBy,
    },
    Buffer.from(
      [
        "# April Board Deck",
        "",
        "Revenue grew 20%.",
        "",
        "## Risks",
        "",
        "Collections remain slow.",
      ].join("\n"),
    ),
  );

  return {
    companyId: (
      await context.financeRepository.getCompanyByKey(input.companyKey)
    )!.id,
    sourceId: created.source.id,
    sourceFileId: registered.sourceFile.id,
  };
}
