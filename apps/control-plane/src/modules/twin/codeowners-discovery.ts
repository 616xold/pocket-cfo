import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import type { TwinCodeownersPrecedenceSlot } from "@pocket-cto/domain";

const codeownersDiscoveryOrder = [
  {
    path: ".github/CODEOWNERS",
    precedenceSlot: "github_dotgithub",
  },
  {
    path: "CODEOWNERS",
    precedenceSlot: "repository_root",
  },
  {
    path: "docs/CODEOWNERS",
    precedenceSlot: "docs",
  },
] as const satisfies ReadonlyArray<{
  path: string;
  precedenceSlot: TwinCodeownersPrecedenceSlot;
}>;

export type DiscoveredCodeownersFile = {
  content: string;
  lineCount: number;
  path: string;
  precedenceSlot: TwinCodeownersPrecedenceSlot;
  sizeBytes: number;
};

export async function discoverCodeownersFile(
  repoRoot: string,
): Promise<DiscoveredCodeownersFile | null> {
  for (const candidate of codeownersDiscoveryOrder) {
    try {
      const absolutePath = join(repoRoot, candidate.path);
      const [content, fileStats] = await Promise.all([
        readFile(absolutePath, "utf8"),
        stat(absolutePath),
      ]);

      if (!fileStats.isFile()) {
        continue;
      }

      return {
        content,
        lineCount: countLines(content),
        path: candidate.path,
        precedenceSlot: candidate.precedenceSlot,
        sizeBytes: fileStats.size,
      };
    } catch (error) {
      if (isMissingCodeownersCandidate(error)) {
        continue;
      }

      throw error;
    }
  }

  return null;
}

function countLines(content: string) {
  if (content.length === 0) {
    return 0;
  }

  return content.split(/\r?\n/).length;
}

function isMissingCodeownersCandidate(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? error.code : null;
  return code === "ENOENT" || code === "ENOTDIR" || code === "EISDIR";
}
