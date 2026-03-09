import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const heavyDirs = new Set([
  ".cache",
  ".git",
  ".next",
  ".pnpm-store",
  ".turbo",
  ".vite",
  ".workspaces",
  "artifacts-local",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "playwright-report",
  "temp",
  "test-results",
  "tmp",
]);
const junkFileNames = new Set([".DS_Store"]);
const junkDirNames = new Set(["__MACOSX"]);

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

function walkDirectory(rootDir, rootRel, visit) {
  if (!existsSync(rootDir)) {
    return;
  }

  const entries = readdirSync(rootDir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  for (const entry of entries) {
    const nextAbs = path.join(rootDir, entry.name);
    const nextRel = rootRel ? `${rootRel}/${entry.name}` : entry.name;

    visit(nextRel, entry);

    if (!entry.isDirectory()) {
      continue;
    }

    if (heavyDirs.has(entry.name) || junkDirNames.has(entry.name)) {
      continue;
    }

    walkDirectory(nextAbs, nextRel, visit);
  }
}

function collectJunkPaths() {
  const matches = [];

  walkDirectory(repoRoot, "", (relativePath, entry) => {
    if (entry.isFile() && junkFileNames.has(entry.name)) {
      matches.push(relativePath);
      return;
    }

    if (entry.isDirectory() && junkDirNames.has(entry.name)) {
      matches.push(relativePath);
    }
  });

  return matches.sort();
}

function isSourceCompanion(relativePath) {
  if (relativePath.startsWith("packages/") && relativePath.includes("/src/")) {
    return relativePath.endsWith(".js") || relativePath.endsWith(".d.ts");
  }

  if (relativePath.startsWith("apps/control-plane/src/")) {
    return relativePath.endsWith(".js") || relativePath.endsWith(".d.ts");
  }

  return false;
}

function collectSourceCompanions() {
  const matches = [];

  walkDirectory(path.join(repoRoot, "packages"), "packages", (relativePath, entry) => {
    if (entry.isFile() && isSourceCompanion(relativePath)) {
      matches.push(relativePath);
    }
  });

  walkDirectory(
    path.join(repoRoot, "apps/control-plane/src"),
    "apps/control-plane/src",
    (relativePath, entry) => {
      if (entry.isFile() && isSourceCompanion(relativePath)) {
        matches.push(relativePath);
      }
    },
  );

  return matches.sort();
}

function isGitRepo() {
  try {
    const output = execFileSync("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    return output === "true";
  } catch {
    return false;
  }
}

function collectTrackedIgnoredPaths() {
  if (!isGitRepo()) {
    return [];
  }

  try {
    const output = execFileSync(
      "git",
      ["ls-files", "-ci", "--exclude-standard", "-z"],
      { cwd: repoRoot, encoding: "buffer", stdio: ["ignore", "pipe", "ignore"] },
    )
      .toString("utf8")
      .split("\0")
      .filter(Boolean)
      .map(toPosixPath)
      .sort();

    return output;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to inspect tracked ignored files with git: ${message}`);
  }
}

function printSection(title, paths) {
  console.error(title);

  for (const entry of paths) {
    console.error(` - ${entry}`);
  }
}

function main() {
  const junkPaths = collectJunkPaths();
  const sourceCompanions = collectSourceCompanions();
  const trackedIgnoredPaths = collectTrackedIgnoredPaths();
  const failures = [];

  if (junkPaths.length > 0) {
    failures.push({
      title: "Obvious junk files or directories are present in the repository tree:",
      paths: junkPaths,
    });
  }

  if (sourceCompanions.length > 0) {
    failures.push({
      title: "Generated JavaScript or declaration companions exist inside TypeScript source roots:",
      paths: sourceCompanions,
    });
  }

  if (trackedIgnoredPaths.length > 0) {
    failures.push({
      title: "Tracked files still match the current ignore rules:",
      paths: trackedIgnoredPaths,
    });
  }

  if (failures.length > 0) {
    console.error("repo hygiene check failed");

    for (const failure of failures) {
      printSection(failure.title, failure.paths);
    }

    process.exit(1);
  }

  if (isGitRepo()) {
    console.log("repo hygiene check passed");
    return;
  }

  console.log("repo hygiene check passed (git not initialized; skipped tracked-file check)");
}

main();
