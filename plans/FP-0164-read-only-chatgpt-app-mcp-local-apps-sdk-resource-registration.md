# FP-0164 - Add Read-only ChatGPT App/MCP Local Apps SDK Resource Registration

## Purpose / Big Picture

FP-0164 is the V2CF read-only ChatGPT App/MCP local Apps SDK component-resource registration slice after merged FP-0163.

The purpose is intentionally narrow: isolate the already-shipped inert local component-resource skeleton behind a runtime-safe builder import path, then add an explicit local helper that registers that skeleton through a caller-provided registry/server-like object. The helper is opt-in only. It does not wire resource registration into default MCP server construction, does not attach the resource URI to any tool descriptor, and does not add a render tool.

This is local-only, read-only, deterministic, and synthetic. It is not default MCP server resource registration, `/mcp` route behavior change, tool descriptor/outputTemplate implementation, render tool implementation, data-tool template ownership, component bundle config, Apps SDK public iframe/resource runtime, public ChatGPT App implementation, app submission, public OAuth, production token validation, authorized evidence-tool execution, default auth adapter wiring, default evidence dispatch wiring, real finance data, public demo data, screenshots, public assets, listing copy, deployment config, DB query implementation, schema or migration work, package script work, OpenAI API/model integration, provider integration, provider calls, source mutation, finance write, external communication, or autonomous action.

Target phase: V2CF read-only ChatGPT App/MCP local Apps SDK component-resource registration, explicit-only, local-only, and default-registration-blocking.

## Progress

- [x] 2026-05-26T21:22:00Z - Repo-local `pocket-cfo-codex-operator` skills were invoked for Finance Plan orchestration, modular architecture, source provenance, CFO Wiki/doc freshness, evidence bundles, F6 monitoring semantics, validation ladder composition, and handoff auditing. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-26T21:25:00Z - Preflight passed on branch `codex/v2cf-read-only-chatgpt-app-mcp-local-apps-sdk-resource-registration-local-v1`: worktree was clean, `HEAD` and `origin/main` were PR #342 merge commit `e5daeb6e80001e5aa460aaead96b4d4b6f1a8310`, GitHub auth was live, PR #342 was merged with head SHA `dd6c3797cdd31428ca9eee1336c811240654507c`, GitHub `static` and `integration-db` checks were green, and local Postgres/object storage were running.
- [x] 2026-05-26T21:37:00Z - Baseline proof gates passed before edits, including FP-0163, FP-0162, FP-0161, FP-0160, FP-0159, FP-0158, FP-0157, FP-0156, FP-0155, FP-0154, FP-0153, FP-0152, FP-0151, FP-0150, FP-0149, FP-0148, FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0109, FP-0108, FP-0086, FP-0085, FP-0082, FP-0081, FP-0080, FP-0107, FP-0106, and FP-0100 proof gates.
- [x] 2026-05-26T22:16:00Z - Created `read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime.ts` as the runtime-safe skeleton builder path and kept the FP-0163 proof-heavy module as a compatibility re-export/proof layer.
- [x] 2026-05-26T22:22:00Z - Added explicit caller-provided `registerResource` helper for the inert local skeleton with deterministic name/URI, empty registration metadata, and handler-returned skeleton contents.
- [x] 2026-05-26T22:28:00Z - Patched FP-0163 closeout freshness with PR #342 merge facts and exact successor proof compatibility for FP-0164 registration files.
- [x] 2026-05-26T22:38:00Z - Added focused specs and direct FP-0164 proof command, then patched exact predecessor proof bridges for FP-0163, FP-0162, FP-0161, and FP-0160 local preview/demo proof gates.
- [x] 2026-05-26T22:52:00Z - Refreshed only directly stale active docs and `plugins.md` to move the active boundary from FP-0163 skeleton-only to FP-0164 explicit local registration.
- [x] 2026-05-26T22:55:00Z - Focused validation passed for the FP-0164 domain specs and the direct FP-0164/FP-0163/FP-0162/FP-0161/FP-0160 proof bridge commands before full validation.
- [x] 2026-05-26T23:24:00Z - Strict same-branch QA and final validation passed. The full proof ladder, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` were green before closeout. `pnpm ci:repro:current` reproduced the current worktree from PR #342 merge commit `e5daeb6e80001e5aa460aaead96b4d4b6f1a8310` in a temp worktree and passed static build, DB migration, test, and clean-tree gates.
- [x] 2026-05-26T23:43:00Z - PR #343 merged with head SHA `3e8edb6a67d4eb8675325dfa27f601bd661e9eda` and merge commit `8f9485d1861e0215c808ee5c623add85aaf70116`.
- [x] 2026-05-26T23:44:00Z - PR #343 was accidentally merged before same-branch QA fully completed, so same-branch QA continued post-merge-aware on the audited branch/head.
- [x] 2026-05-26T23:45:00Z - Same-branch QA found no issues and made no correction. Local QA passed including `pnpm ci:repro:current`; GitHub static and integration-db checks were green.
- [x] 2026-05-26T23:46:00Z - Git and GitHub confirmed origin/main contains the audited branch commit. No standalone post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.

## Surprises & Discoveries

The FP-0163 skeleton builder currently lives in a proof-heavy module that also imports plan verifiers and token-leakage scanners. That was acceptable for FP-0163, but FP-0164 needs a runtime-safe builder import path before explicit registration code can exist.

OpenAI Developers tooling exposed only API-key setup surfaces, not read-only Apps SDK docs tooling. Official OpenAI Apps SDK web documentation was used read-only for local resource-registration context only. No API-key setup, OpenAI API call, model call, provider call, deployment, screenshot, public asset, source mutation, finance write, app-submission action, or external communication was used.

Same-branch proof work found token-leakage scanner false positives in proof/spec source text around literal key-name and source-dump phrases. The correction stayed proof-only by keeping blocked-posture assertions without embedding token-like or source-dump literals in committed source text.

Final QA found one older FP-0123 protected-resource metadata route-input inventory gate that accepted FP-0162/FP-0163 exact local Apps SDK resource artifacts but not the FP-0164 runtime-safe builder and registration artifacts. The correction was an exact proof/inventory bridge only; it changed no runtime/app/web/route/MCP/registerResource/outputTemplate/provider/OAuth/token-validation/source/finance/public-app behavior.

## Decision Log

- 2026-05-26T21:37:00Z - Runtime-safe skeleton builder isolation is included.
- 2026-05-26T21:37:00Z - Explicit local `registerResource` wiring is included, opt-in only through a caller-provided structural registry/server-like object.
- 2026-05-26T21:37:00Z - Default MCP server resource registration is not included.
- 2026-05-26T21:37:00Z - Tool descriptor/outputTemplate implementation is not included.
- 2026-05-26T21:37:00Z - A render tool is not included.
- 2026-05-26T21:37:00Z - Component bundle config is not included.
- 2026-05-26T21:37:00Z - `apps/web` runtime is not edited.
- 2026-05-26T21:37:00Z - A new route, API route, or backend route is not included.
- 2026-05-26T21:37:00Z - Public app behavior or public app submission is not included.
- 2026-05-26T21:37:00Z - Production token-validation runtime cannot start after FP-0164.
- 2026-05-26T21:37:00Z - Provider selection cannot start after FP-0164.
- 2026-05-26T21:37:00Z - OAuth/session/auth middleware cannot start after FP-0164.
- 2026-05-26T21:37:00Z - Public ChatGPT App demo/submission cannot start after FP-0164.
- 2026-05-26T21:37:00Z - The runtime-safe skeleton builder may build only the inert local skeleton object from sanitized static synthetic snapshot input. It must not import proof helpers, no-token-leakage scanners, repo scanners, filesystem APIs, React, Next, app routes, control-plane code, DB, providers, OpenAI, network, time, random, crypto, env, logger, tools, proofs, or harnesses.
- 2026-05-26T21:37:00Z - The runtime-safe skeleton builder must remain deterministic, synchronous, side-effect free, and local-only.
- 2026-05-26T21:37:00Z - The explicit registration helper may accept only a caller-provided structural registry/server-like object with a `registerResource` function.
- 2026-05-26T21:37:00Z - The explicit registration helper may call the caller-provided registration function exactly once with deterministic name `pocket-cfo-local-preview-demo`, URI `ui://pocket-cfo/local-preview-demo.html`, an empty metadata object, and a handler returning `{ contents: [skeleton] }`.
- 2026-05-26T21:37:00Z - The explicit registration helper returns only a sanitized registration summary with no registry internals and no handler output.
- 2026-05-26T21:37:00Z - The helper must not import the MCP SDK directly, mutate global state, touch routes/app construction/default containers, or register by default.
- 2026-05-26T21:37:00Z - The resource handler returns exactly one content entry for the deterministic local skeleton URI with static sanitized HTML and local metadata. It does not read files, call network, access env, call `/mcp`, or run harness/proof code.
- 2026-05-26T21:37:00Z - Resource metadata keeps `_meta.ui.prefersBorder: true`, empty `_meta.ui.csp.connectDomains`, `resourceDomains`, and `frameDomains`, no `_meta.ui.domain`, no `openai/widgetCSP.redirect_domains`, and a concise widget description that says read-only, synthetic, local, no production authentication, no real finance data, and no public app submission.
- 2026-05-26T21:37:00Z - Future FP-0165 may open only local render tool descriptor readiness planning, explicit local resource registration correction, or proof-gate correction. It must not attach output templates to data tools, implement public app behavior, production auth, OAuth/session/auth middleware, provider calls, DB/schema/package work, real demo data, public assets, screenshots, app submission, external deployment, or default registration.
- 2026-05-26T21:37:00Z - Preserve FP-0163 skeleton, FP-0162 readiness, FP-0161 visual QA/accessibility hardening, FP-0160 local preview/demo UI bridge implementation, FP-0159 readiness, FP-0158 local evidence demo bridge, FP-0157 local auth demo harness, FP-0156 app-construction injection, FP-0155 local adapter implementation, FP-0154 local adapter readiness, FP-0153 app-construction wiring, FP-0152 route integration, FP-0151 route readiness, FP-0150 route sequencing, FP-0149 parser implementation, FP-0148 readiness, FP-0147 provider-selection evidence, FP-0146 parser contracts, FP-0145 runtime contracts, FP-0144 production sequencing, FP-0143 app wiring, FP-0142 route sequencing, FP-0141 invalid-token challenge mapping, FP-0139 result envelopes, FP-0130 missing-token challenge, FP-0125 metadata route, FP-0109 evidence dispatch adapter, FP-0108 evidence dispatch contracts, FP-0097/0096/0094 preview route posture, FP-0086 benchmark/community contracts, FP-0085 bounded orchestration, FP-0082 evidence app alpha, FP-0081 document precision, FP-0080 evidence index, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 security boundary.

## Context and Orientation

FP-0163 shipped a pure-domain inert local component-resource skeleton with URI `ui://pocket-cfo/local-preview-demo.html`, MIME type `text/html;profile=mcp-app`, static sanitized script-free HTML, local metadata, empty CSP domain arrays, no public widget domain, and no resource registration.

Official OpenAI Apps SDK reference material says component resource `_meta` fields are set on resource contents served through `registerResource`, including `_meta.ui.prefersBorder`, `_meta.ui.csp`, optional `_meta.ui.domain`, and `openai/widgetDescription`. The same docs describe `openai/widgetCSP` as legacy compatibility metadata and say `redirect_domains` is for trusted external-open destinations. FP-0164 uses this only as context for an explicit local helper and keeps external domains/redirects empty or absent.

Replay and evidence posture: FP-0164 changes only domain helper/spec/proof code and active documentation/proof freshness. It does not change mission state, ingest state, source registry state, Finance Twin facts, CFO Wiki facts, finance answers, reports, approvals, monitor findings, durable finance artifacts, source evidence, route behavior, or production runtime. No replay event is required.

Provenance, freshness, and limitations: GitHub CLI is used for PR #342 merge truth and check freshness. Official OpenAI Apps SDK docs are context only. Finance evidence remains source of truth for product answers. FP-0164 uses no real finance data, public demo data, source pack, provider call, model call, generated advice, screenshot, source mutation, finance write, or external communication.

## Plan of Work

Patch FP-0163 closeout freshness with PR #342 merge facts, green GitHub checks, exact same-branch proof-gate correction posture, and no standalone post-merge QA requirement when current main matches validated PR/CI posture.

Split the skeleton builder into `packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime.ts` and make `packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts` re-export that runtime-safe builder while retaining proof helpers.

Add `packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.ts` as a runtime-safe explicit helper over a structural registry object. It imports the runtime-safe skeleton builder path, not the proof-heavy module.

Add focused specs for runtime-safe import boundaries, invalid registry rejection, exact registration call shape, handler contents shape, skeleton URI/MIME/HTML/metadata preservation, no default registration, no route/runtime/provider/auth/public-app widening, and no token/source/real-data leakage.

Add `tools/read-only-mcp-local-apps-sdk-resource-registration-proof.mjs` and patch exact predecessor proof bridge compatibility so FP-0164 registration files are accepted while unrelated runtime/public/default-registration changes remain blocked.

Refresh only directly stale active docs and `plugins.md` entries to move the active ChatGPT App/MCP boundary from FP-0163 skeleton to FP-0164 explicit local resource registration.

## Concrete Steps

1. Confirm preflight and baseline proof gates are green before edits.
2. Create this exact FP-0164 Finance Plan.
3. Patch FP-0163 closeout freshness if stale.
4. Add runtime-safe skeleton builder module and make the FP-0163 module re-export it for compatibility.
5. Add explicit local register-resource helper and focused specs.
6. Patch exact FP-0163/FP-0162/FP-0161 successor bridge compatibility.
7. Add direct FP-0164 proof command.
8. Refresh directly stale active docs and `plugins.md` only where needed.
9. Run focused validation, strict same-branch QA, final validation, closeout, commit, push, and open the PR.

## Validation and Acceptance

Required validation:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-local-apps-sdk-resource-registration-proof.mjs
pnpm exec tsx tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs
pnpm exec tsx tools/read-only-mcp-local-apps-sdk-resource-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-evidence-app-local-preview-demo-visual-qa-accessibility-proof.mjs
pnpm exec tsx tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-implementation-proof.mjs
pnpm exec tsx tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-evidence-app-local-demo-bridge-proof.mjs
pnpm exec tsx tools/read-only-mcp-evidence-app-local-demo-bridge.mjs
pnpm exec tsx tools/read-only-mcp-auth-local-demo-harness-proof.mjs
pnpm exec tsx tools/read-only-mcp-auth-local-demo-harness.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-local-adapter-app-construction-injection-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-local-adapter-implementation-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-local-adapter-construction-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-app-construction-wiring-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-route-integration-implementation-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-route-integration-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-route-integration-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-pure-domain-implementation-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-implementation-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-provider-selection-evidence-hardening-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-contracts-provider-selection-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-runtime-contracts-proof-hardening-proof.mjs
pnpm exec tsx tools/read-only-mcp-production-token-validation-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-app-wiring-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-local-runtime-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-result-envelope-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs
pnpm exec tsx tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs
pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-local-route-proof.mjs
pnpm exec tsx tools/read-only-mcp-route-adapter-proof.mjs
pnpm exec tsx tools/read-only-public-app-security-boundary-proof.mjs
pnpm exec tsx tools/read-only-mcp-protocol-envelope-proof.mjs
pnpm exec tsx tools/read-only-endpoint-route-ownership-proof.mjs
pnpm exec tsx tools/read-only-endpoint-architecture-proof.mjs
pnpm exec tsx tools/read-only-chatgpt-app-mcp-proof.mjs
pnpm exec tsx tools/read-only-mcp-evidence-tool-dispatch-proof.mjs || true
pnpm exec tsx tools/read-only-mcp-default-local-evidence-dispatch-proof.mjs || true
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
find apps/web -name '*.spec.*' -o -name '*.test.*'
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts src/read-only-app-mcp-authorization-parser-contracts.spec.ts src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts src/read-only-app-mcp-authorization-parser.spec.ts src/read-only-app-mcp-authorization-parser-route-integration-readiness.spec.ts src/read-only-app-mcp-authorization-parser-local-adapter-readiness.spec.ts src/read-only-app-mcp-authorization-parser-local-adapter.spec.ts src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.spec.ts src/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.ts src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts src/read-only-app-mcp-local-apps-sdk-resource-registration.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/app.spec.ts src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is observable when exactly one FP-0164 plan exists, FP-0165 remains absent, the registration helper imports the runtime-safe skeleton path and not the proof-heavy skeleton module, the runtime-safe builder imports no proof/scanner/fs/app/control-plane/network/runtime APIs, the helper rejects invalid registries, the helper calls a caller-provided registration function exactly once with deterministic name/URI/empty metadata/handler, the handler returns `{ contents: [skeleton] }`, the skeleton URI/MIME/static script-free HTML/CSP/metadata remain intact, widget description says "No public app submission", no default server registration or route/app construction change exists, no tool descriptor/outputTemplate/render tool/component bundle exists, no app/web runtime edit exists, no live `/mcp` fetch or `window.openai` usage exists, and all predecessor proof boundaries remain green.

## Idempotence and Recovery

The runtime builder and registration helper are deterministic, synchronous except for supporting a caller's handler consumption, side-effect free except for the explicit caller-provided registration call, and local-only. Re-running specs and proof commands should leave no persistent state.

If validation finds a defect, patch this same branch and rerun the failed check plus the required ladder. If a predecessor proof treats exact FP-0164 registration artifacts as out of scope, patch only the exact successor bridge and rerun. If generated declaration, JavaScript, or map artifacts make inventory proofs fail, patch only exact FP-0164 registration generated-artifact allowances and rerun. If any failure requires default registration, route behavior change, tool descriptor/outputTemplate implementation, render tool implementation, component bundle config, `/mcp` behavior change, protected-resource metadata route behavior change, live `/mcp` UI fetch, request-time harness execution, default auth adapter construction, default evidence dispatch wiring, production token validation, token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, app submission, source mutation, or finance writes, stop and narrow scope instead of implementing that behavior.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0164-read-only-chatgpt-app-mcp-local-apps-sdk-resource-registration.md`
- FP-0163 closeout freshness patch
- `packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime.ts`
- `packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts` compatibility re-export/proof layer
- `packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.ts`
- `packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.spec.ts`
- `tools/read-only-mcp-local-apps-sdk-resource-registration-proof.mjs`
- exact predecessor proof-gate compatibility patches
- exact plan-path helper/export/inventory updates only where needed
- directly stale active-doc/plugin freshness edits only if needed

No app/web runtime file, control-plane route/app/server file, new route, API route, backend route behavior, `/mcp` behavior change, protected-resource metadata behavior change, migration, package script, fixture data file, public asset, screenshot, app-submission artifact, OpenAI API integration, provider integration, DB query, source mutation, finance write, or external communication is expected.

## Interfaces and Dependencies

Direct proof command:

`pnpm exec tsx tools/read-only-mcp-local-apps-sdk-resource-registration-proof.mjs`

Runtime-safe skeleton builder:

`packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime.ts`

Explicit local registration helper:

`packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-registration.ts`

GitHub connector product behavior is out of scope. Routine `git` and `gh` CLI operations are allowed for repository and PR truth. OpenAI Developers exposed only API-key setup surfaces and was not used. Official OpenAI Apps SDK web docs were used read-only as local registration context. Codex Security, Vercel project/deployment tooling, OpenAI Platform key setup, OpenAI API/model calls, provider calls, public assets, screenshots, and app submission tooling are not used in this slice.

## Outcomes & Retrospective

FP-0164 implemented the intended narrow slice. The FP-0163 proof-heavy skeleton module now re-exports a runtime-safe skeleton builder path, and the explicit local registration helper imports that runtime-safe path rather than proof/readiness/scanner modules. The helper accepts only a caller-provided structural registry with `registerResource`, calls it exactly once with deterministic local name `pocket-cfo-local-preview-demo`, URI `ui://pocket-cfo/local-preview-demo.html`, empty registration metadata, and a handler returning `{ contents: [skeleton] }`, then returns a sanitized summary without registry internals.

The deterministic local skeleton still returns static sanitized script-free HTML with MIME type `text/html;profile=mcp-app`, `_meta.ui.prefersBorder: true`, empty `_meta.ui.csp.connectDomains`, `resourceDomains`, and `frameDomains`, no public widget domain, no redirect domains, and widget description wording that says read-only, synthetic, local, no production authentication, no real finance data, and no public app submission.

FP-0163 closeout freshness was corrected with PR #342 merge facts, green GitHub checks, and same-branch proof-gate-only compatibility notes. Exact predecessor proof bridges now accept the FP-0164 registration artifacts while continuing to block unrelated runtime/public/default-registration changes.

PR #343 merged with head SHA `3e8edb6a67d4eb8675325dfa27f601bd661e9eda` and merge commit `8f9485d1861e0215c808ee5c623add85aaf70116`. The PR was accidentally merged before same-branch QA fully completed; same-branch QA continued post-merge-aware on the audited branch/head, found no issues, and made no correction. Local QA passed including `pnpm ci:repro:current`. GitHub static and integration-db checks were green. Git and GitHub confirmed origin/main contains the audited branch commit, so no standalone post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green. FP-0165 may now open only as the separate local render tool descriptor readiness, explicit local resource registration correction, or proof-gate correction successor described above.

No replay event is required because this slice changes only domain helpers, specs, proofs, and documentation/proof freshness. It changes no mission state, source registry state, Finance Twin facts, CFO Wiki facts, finance outputs, reports, approvals, monitor findings, routes, `/mcp` behavior, protected-resource metadata behavior, default containers, DB schema, migrations, package scripts, provider calls, OpenAI API/model calls, source evidence, source files, finance writes, public assets, screenshots, listing copy, app-submission material, external communication, or autonomous action.

Final validation passed before closeout: full proof ladder, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. Because this closeout changes the plan document after validation, the required post-closeout subset will be rerun before commit.

Recommended next step is a narrow FP-0165 for local render tool descriptor readiness planning only. Public ChatGPT App demo/submission, production auth, OAuth/session/auth middleware, provider calls, real demo data, public assets, screenshots, external deployment, default registration, data-tool output templates, and app submission should continue to wait.
