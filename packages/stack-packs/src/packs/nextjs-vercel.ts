import type { StackPack } from "../stack-pack";

export const nextjsVercelPack: StackPack = {
  id: "nextjs-vercel",
  name: "Next.js + Vercel",
  description:
    "Seed pack for GitHub-hosted web apps with Next.js, CI, and Vercel-style release concerns.",
  supportedMissionTypes: ["build", "discovery", "release"],
  defaultRepos: ["web"],
  twinExtractors: [
    "package-json",
    "codeowners",
    "github-actions",
    "next-config",
    "runbooks",
  ],
  benchmarkMissionIds: ["build-passkeys", "discovery-auth-blast-radius"],
  promptFragments: {
    build:
      "Prefer additive UI changes, keep server and client component boundaries clear, and attach screenshots for user-visible flows.",
    discovery:
      "Map impacted routes, packages, tests, workflows, and ownership before proposing action.",
    release:
      "Include canary, rollback, and config drift checks in the plan.",
  },
};
