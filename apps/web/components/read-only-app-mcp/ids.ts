export type ReadOnlyAppMcpHeadingLevel = 2 | 3 | 4 | 5 | 6;

export const DEFAULT_READ_ONLY_APP_MCP_SCOPE = "foundation";

export function createReadOnlyAppMcpSectionId({
  scope = DEFAULT_READ_ONLY_APP_MCP_SCOPE,
  section,
  suffix,
}: {
  scope?: string;
  section: string;
  suffix?: number | string;
}) {
  return ["read-only-app-mcp", scope, section, suffix]
    .filter((part) => part !== undefined && String(part).trim().length > 0)
    .map((part) => slugify(String(part)))
    .join("-");
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");

  return slug.length > 0 ? slug : "section";
}
