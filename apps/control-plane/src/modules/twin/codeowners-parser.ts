import type {
  TwinOwnerPrincipalKind,
  TwinOwnershipPatternShape,
} from "@pocket-cto/domain";

export type ParsedCodeownersRule = {
  lineNumber: number;
  normalizedOwners: string[];
  ordinal: number;
  patternShape: TwinOwnershipPatternShape;
  rawOwners: string[];
  rawPattern: string;
  sourceFilePath: string;
};

export type ParsedOwnerPrincipal = {
  handle: string;
  principalKind: TwinOwnerPrincipalKind;
};

export type ParsedCodeownersFile = {
  owners: ParsedOwnerPrincipal[];
  rules: ParsedCodeownersRule[];
  skippedBlankOrCommentLineCount: number;
  skippedMalformedLineCount: number;
};

export function parseCodeownersFile(input: {
  content: string;
  sourceFilePath: string;
}): ParsedCodeownersFile {
  const principals = new Map<string, ParsedOwnerPrincipal>();
  const rules: ParsedCodeownersRule[] = [];
  let skippedBlankOrCommentLineCount = 0;
  let skippedMalformedLineCount = 0;

  for (const [index, rawLine] of input.content.split(/\r?\n/).entries()) {
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      skippedBlankOrCommentLineCount += 1;
      continue;
    }

    const tokens = trimmed.match(/\S+/g) ?? [];
    const rawPattern = tokens[0] ?? null;

    if (!rawPattern) {
      skippedMalformedLineCount += 1;
      continue;
    }

    const rawOwners: string[] = [];

    for (const token of tokens.slice(1)) {
      if (token.startsWith("#")) {
        break;
      }

      rawOwners.push(token);
    }
    const normalizedOwners = dedupe(
      rawOwners
        .map((owner) => normalizeOwnerPrincipal(owner))
        .filter(
          (principal): principal is ParsedOwnerPrincipal => principal !== null,
        ),
    );

    if (normalizedOwners.length === 0) {
      skippedMalformedLineCount += 1;
      continue;
    }

    for (const owner of normalizedOwners) {
      principals.set(owner.handle, owner);
    }

    rules.push({
      lineNumber: index + 1,
      normalizedOwners: normalizedOwners.map((owner) => owner.handle),
      ordinal: rules.length + 1,
      patternShape: inferOwnershipPatternShape(rawPattern),
      rawOwners,
      rawPattern,
      sourceFilePath: input.sourceFilePath,
    });
  }

  return {
    owners: [...principals.values()].sort((left, right) =>
      left.handle.localeCompare(right.handle),
    ),
    rules,
    skippedBlankOrCommentLineCount,
    skippedMalformedLineCount,
  };
}

function dedupe(owners: ParsedOwnerPrincipal[]) {
  const seen = new Set<string>();
  const deduped: ParsedOwnerPrincipal[] = [];

  for (const owner of owners) {
    if (seen.has(owner.handle)) {
      continue;
    }

    seen.add(owner.handle);
    deduped.push(owner);
  }

  return deduped;
}

function inferOwnershipPatternShape(
  rawPattern: string,
): TwinOwnershipPatternShape {
  if (rawPattern.endsWith("/")) {
    return "directory_like";
  }

  const hasWildcard = ["*", "?", "[", "]", "!"].some((token) =>
    rawPattern.includes(token),
  );
  const basename = rawPattern.split("/").at(-1) ?? rawPattern;

  if (!hasWildcard && basename.includes(".")) {
    return "file_like";
  }

  return "ambiguous";
}

function normalizeOwnerPrincipal(rawOwner: string): ParsedOwnerPrincipal | null {
  const normalized = rawOwner.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  return {
    handle: normalized,
    principalKind: classifyOwnerPrincipal(normalized),
  };
}

function classifyOwnerPrincipal(
  normalizedOwner: string,
): TwinOwnerPrincipalKind {
  if (normalizedOwner.startsWith("@") && normalizedOwner.includes("/")) {
    return "github_team";
  }

  if (normalizedOwner.startsWith("@")) {
    return "github_user_or_org";
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(normalizedOwner)) {
    return "email";
  }

  return "unknown";
}
