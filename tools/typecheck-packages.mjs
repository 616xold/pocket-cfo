import { execFileSync } from "node:child_process";
import path from "node:path";

const packages = [
  "packages/domain",
  "packages/config",
  "packages/db",
  "packages/codex-runtime",
  "packages/stack-packs",
  "packages/testkit",
];

for (const packagePath of packages) {
  const tsconfigPath = path.join(packagePath, "tsconfig.json");
  const distPath = path.join(packagePath, "dist");
  const tsBuildInfoPath = path.join(distPath, "tsconfig.tsbuildinfo");

  console.log(`Bootstrapping declarations for ${packagePath}`);

  execFileSync(
    "pnpm",
    [
      "exec",
      "tsc",
      "-p",
      tsconfigPath,
      "--emitDeclarationOnly",
      "--declaration",
      "--outDir",
      distPath,
      "--declarationDir",
      distPath,
      "--tsBuildInfoFile",
      tsBuildInfoPath,
      "--pretty",
      "false",
    ],
    {
      stdio: "inherit",
    },
  );
}
