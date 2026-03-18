import { describe, expect, it } from "vitest";
import { parseCodeownersFile } from "./codeowners-parser";

describe("parseCodeownersFile", () => {
  it("ignores blank or comment lines and normalizes or deduplicates owners", () => {
    const parsed = parseCodeownersFile({
      sourceFilePath: ".github/CODEOWNERS",
      content: [
        "# Root ownership",
        "",
        "* @Platform @platform",
        "docs/ @Docs-Team # inline note",
        "apps/web/package.json OWNER@example.com owner@example.com",
      ].join("\n"),
    });

    expect(parsed.rules).toEqual([
      {
        sourceFilePath: ".github/CODEOWNERS",
        ordinal: 1,
        lineNumber: 3,
        rawPattern: "*",
        rawOwners: ["@Platform", "@platform"],
        normalizedOwners: ["@platform"],
        patternShape: "ambiguous",
      },
      {
        sourceFilePath: ".github/CODEOWNERS",
        ordinal: 2,
        lineNumber: 4,
        rawPattern: "docs/",
        rawOwners: ["@Docs-Team"],
        normalizedOwners: ["@docs-team"],
        patternShape: "directory_like",
      },
      {
        sourceFilePath: ".github/CODEOWNERS",
        ordinal: 3,
        lineNumber: 5,
        rawPattern: "apps/web/package.json",
        rawOwners: ["OWNER@example.com", "owner@example.com"],
        normalizedOwners: ["owner@example.com"],
        patternShape: "file_like",
      },
    ]);
    expect(parsed.owners).toEqual([
      {
        handle: "@docs-team",
        principalKind: "github_user_or_org",
      },
      {
        handle: "@platform",
        principalKind: "github_user_or_org",
      },
      {
        handle: "owner@example.com",
        principalKind: "email",
      },
    ]);
    expect(parsed.skippedBlankOrCommentLineCount).toBe(2);
    expect(parsed.skippedMalformedLineCount).toBe(0);
  });
});
