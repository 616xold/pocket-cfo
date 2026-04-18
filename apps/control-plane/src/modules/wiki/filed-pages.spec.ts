import { describe, expect, it } from "vitest";
import { buildFiledPageInput } from "./filed-pages";

describe("buildFiledPageInput", () => {
  it("creates a filed artifact page with explicit provenance metadata", () => {
    const page = buildFiledPageInput({
      existingPages: [],
      filedAt: "2026-04-13T12:10:00.000Z",
      request: {
        title: "Board Deck Notes",
        markdownBody: "Collections remain tight.",
        filedBy: "finance-operator",
        provenanceSummary: "Filed after board review.",
      },
    });

    expect(page.pageKey).toBe("filed/board-deck-notes");
    expect(page.pageKind).toBe("filed_artifact");
    expect(page.ownershipKind).toBe("filed_artifact");
    expect(page.filedMetadata).toMatchObject({
      filedBy: "finance-operator",
      provenanceSummary: "Filed after board review.",
    });
    expect(page.markdownBody).toContain("## Filed Markdown Body");
  });

  it("preserves an explicit filed page key when the caller provides one", () => {
    const page = buildFiledPageInput({
      existingPages: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          companyId: "22222222-2222-4222-8222-222222222222",
          compileRunId: null,
          pageKey: "filed/board-deck-notes",
          pageKind: "filed_artifact",
          ownershipKind: "filed_artifact",
          temporalStatus: "current",
          title: "Board Deck Notes",
          summary: "Existing page.",
          markdownBody: "# Board Deck Notes",
          freshnessSummary: {
            state: "missing",
            summary: "Filed artifact pages are manually persisted.",
          },
          limitations: [],
          lastCompiledAt: "2026-04-13T12:10:00.000Z",
          filedMetadata: {
            filedAt: "2026-04-13T12:10:00.000Z",
            filedBy: "finance-operator",
            provenanceKind: "manual_markdown_artifact",
            provenanceSummary: "Existing file.",
          },
          createdAt: "2026-04-13T12:10:00.000Z",
          updatedAt: "2026-04-13T12:10:00.000Z",
        },
      ],
      filedAt: "2026-04-18T12:10:00.000Z",
      request: {
        title: "Draft Finance Memo",
        markdownBody: "Cash posture remains constrained.",
        filedBy: "finance-operator",
        pageKey: "filed/reporting-11111111-1111-4111-8111-111111111111-finance_memo",
        provenanceSummary: "Draft-only reporting artifact filed into the CFO Wiki.",
      },
    });

    expect(page.pageKey).toBe(
      "filed/reporting-11111111-1111-4111-8111-111111111111-finance_memo",
    );
  });
});
