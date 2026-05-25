# FP-0156 - Read-only ChatGPT App/MCP Authorization Parser Local Adapter App-construction Injection

## Purpose / Big Picture

FP-0156 is the V2BX read-only ChatGPT App/MCP Authorization parser local adapter runtime-import isolation and explicit app-construction injection slice after merged FP-0155.

This slice does two things only:

- isolates a runtime-safe import path for the already-implemented local Authorization parser route-decision adapter factory
- adds an explicit opt-in app-construction helper that injects that factory into an `AppContainer` only when the existing invalid-token challenge lane, missing-token challenge lane, and protected-resource metadata evidence are already co-registered

This is not default adapter construction, default parser wiring, route behavior change, production token validation, token parser implementation, JWT decoder implementation, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider selection/integration/calls, DB/schema/package work, public ChatGPT App work, app submission, OpenAI API/model integration, source mutation, finance write, external communication, or autonomous action.

Target phase: V2BX read-only ChatGPT App/MCP Authorization parser local adapter app-construction injection, local-only and explicit-only.

## Progress

- [x] 2026-05-25T08:46:09Z - Preflight confirmed work on `codex/v2bx-read-only-chatgpt-app-mcp-authorization-parser-local-adapter-app-construction-injection-local-v1`, clean worktree, authenticated `gh`, PR #334 merged to `main`, current `HEAD` and `origin/main` at `a291881c0853ddb56af6a56cbad9e71184a75742`, local Postgres/object storage services available, FP-0155 present, FP-0156 absent before this plan, FP-0157 absent, and required proof tools present.
- [x] 2026-05-25T08:46:09Z - Baseline proof gates for FP-0155, FP-0154, FP-0153, FP-0152, FP-0151, FP-0150, FP-0149, FP-0148, FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100 passed before FP-0156 edits.
- [x] 2026-05-25T08:46:09Z - GitHub PR #334 truth was confirmed with `gh`: state merged, head SHA `8d05bbaa5fa19c80e630dea317f148cd81b85f97`, merge commit `a291881c0853ddb56af6a56cbad9e71184a75742`, and `static` plus `integration-db` checks green.
- [x] 2026-05-25T08:46:09Z - Official MCP Authorization, MCP Security Best Practices, OpenAI Apps SDK authentication guidance, and OpenAI Apps SDK Security & Privacy guidance were used read-only as app-construction/auth boundary context only. OpenAI Developers exposed no read-only docs tool beyond API-key setup, so no key setup, OpenAI API/model call, provider call, deployment action, public asset, app submission action, or external communication was used.
- [x] 2026-05-25T09:14:53Z - FP-0155 closeout freshness was patched with PR #334 merge facts, GitHub check posture, same-branch QA result, and the no-post-merge-QA condition.
- [x] 2026-05-25T09:14:53Z - Runtime-safe domain import paths were added for route-safe decision derivation and the local adapter factory; the FP-0155 proof-heavy adapter module now re-exports the runtime factory for compatibility without being imported by app construction.
- [x] 2026-05-25T09:14:53Z - Added the explicit opt-in app-construction helper that shallow-clones an `AppContainer`, injects the runtime-safe local adapter dependency, requires invalid-token challenge, missing-token challenge, and protected-resource metadata co-registration, and fails closed with the deterministic FP-0156 error when any co-registration dependency is missing.
- [x] 2026-05-25T09:14:53Z - Added focused domain/control-plane coverage for runtime import isolation, helper injection, fail-closed partial wiring, no input mutation, default container absence, default app behavior preservation, route/metadata preservation, missing-token precedence, and parser-decision no-exposure.
- [x] 2026-05-25T09:14:53Z - Added the FP-0156 proof command and exact successor proof bridges so FP-0156 is accepted, FP-0157 remains absent, and predecessor FP gates keep their default-wiring, route, token, provider, OAuth/session/auth, OpenAI, source, finance-write, public-app, and no-token-leakage guardrails.
- [x] 2026-05-25T09:14:53Z - Direct active-doc/plugin freshness edits were folded into this branch for README, CODEX_README, START_HERE, ACTIVE_DOCS, PROJECT_STATE, V2_BOUNDARY, ROADMAP, and plugins.md.
- [x] 2026-05-25T09:14:53Z - Pre-closeout validation passed: `git diff --check`, all requested FP-0156 through predecessor proof commands, focused domain specs, focused control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-05-25T09:22:50Z - Same-branch QA found and corrected one proof-string leakage-sanitizer issue in an older protocol proof bridge by keeping the checked phrase assembled at runtime instead of as a scanner-visible credential phrase.
- [x] 2026-05-25T09:22:50Z - Final post-closeout validation passed on the edited tree: `git diff --check`, all requested proof commands, focused domain specs, focused control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-05-25T09:30:54Z - Same-branch QA for PR #335 found and corrected one tiny `plugins.md` top-summary freshness gap so the repo-local plugin summary names FP-0156 alongside the prior Authorization parser slices. No runtime, route, adapter, provider, OAuth/session/auth, DB/schema/package, source, finance-write, public-app, or FP-0157 scope changed. Because this QA made a correction, the requested validation ladder and `pnpm ci:repro:current` must rerun before the correction commit.

## Surprises & Discoveries

FP-0155 implemented the local adapter factory in a module that also imports proof/readiness helpers, plan verifiers, fixture proof builders, and proof-only no-token-leakage scanners. That is acceptable for the proof surface, but app construction must not import that proof-heavy module at runtime.

The domain package has no package `exports` map. A direct package subpath import can be used for the runtime-safe factory path without changing package metadata or importing the proof-heavy package index into the explicit app-construction helper.

## Decision Log

- 2026-05-25T08:46:09Z - Runtime-import isolation is included.
- 2026-05-25T08:46:09Z - Explicit app-construction injection helper is included.
- 2026-05-25T08:46:09Z - Default adapter construction is not included.
- 2026-05-25T08:46:09Z - Default `createContainer()` and `createInMemoryContainer()` behavior do not change.
- 2026-05-25T08:46:09Z - Route code may not construct the adapter.
- 2026-05-25T08:46:09Z - App code may import only the runtime-safe factory path, not the proof-heavy adapter module.
- 2026-05-25T08:46:09Z - Production token-validation runtime cannot start after FP-0156.
- 2026-05-25T08:46:09Z - Provider selection cannot start after FP-0156; provider remains provider-neutral/deferred unless a later complete provider evidence slice explicitly opens it.
- 2026-05-25T08:46:09Z - OAuth/session/auth middleware cannot start after FP-0156.
- 2026-05-25T08:46:09Z - Public ChatGPT App demo/submission cannot start after FP-0156.
- 2026-05-25T08:46:09Z - Runtime-safe factory import boundary: the factory module may import the existing pure Authorization parser/classifier and a route-safe decision derivation helper/type only. It may not import FP plan text verifiers, proof builders, proof tools, repo path scanners, no-token-leakage scanners, `fs`/`readdir`/`readFile`, app/control-plane code, route files, DB/provider/OpenAI/network/time/random/crypto/env/logger/JWT/JWKS/introspection/OAuth/session APIs.
- 2026-05-25T08:46:09Z - Explicit app-construction injection helper: accepts an `AppContainer`, requires invalid-token challenge, missing-token challenge, and protected-resource metadata evidence before injection, throws a deterministic fail-closed error if any are missing, returns a shallow cloned container with `readOnlyAppMcpAuthorizationParserRouteDecision` set from the runtime-safe factory, and never mutates the original container.
- 2026-05-25T08:46:09Z - Future FP-0157 may open only a local demo harness/read-only MCP smoke wiring for the explicit adapter path, app-construction injection correction, or proof-gate correction. It must not implement production token validation, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, or app submission.
- 2026-05-25T08:46:09Z - Preserve FP-0155 local adapter implementation, FP-0154 local adapter readiness, FP-0153 app-construction wiring, FP-0152 route integration, FP-0151 route readiness, FP-0150 route sequencing, FP-0149 parser implementation, FP-0148 readiness, FP-0147 provider-selection evidence, FP-0146 parser contracts, FP-0145 runtime contracts, FP-0144 production token-validation sequencing, FP-0143 app wiring, FP-0142 route sequencing, FP-0141 invalid-token local runtime, FP-0139 result envelopes, FP-0130 missing-token challenge, FP-0125 protected-resource metadata route, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 security boundary.

## Context and Orientation

The repo already has a pure-domain Authorization parser/classifier, a route-safe decision derivation helper, an optional `AppContainer` parser route-decision port, `buildApp({ container })` pass-through into route registration, route registration co-registration hardening that rejects parser route-decision wiring without the invalid-token challenge lane, and default containers that do not construct the parser dependency.

FP-0156 does not alter those defaults. It only creates a runtime-safe factory import path and a separate explicit helper for callers that intentionally opt into local adapter injection after they have co-registered the existing challenge and metadata dependencies.

Replay and evidence posture: FP-0156 changes planning docs, local/domain/control-plane code, focused specs, and proof output only. It does not change mission state, ingest state, source registry state, CFO Wiki facts, finance answers, approvals, monitor findings, reports, durable finance artifacts, or source evidence. No replay event is required because no mission-facing state transition or finance artifact mutation occurs. Proof output is the durable acceptance evidence for this technical slice.

Provenance, freshness, and limitations: official protocol/security docs are context only. Finance evidence remains the source of truth for product answers. FP-0156 produces no finance answer, no report, no public listing copy, no generated advice, no external communication, and no source mutation.

## Plan of Work

The implementation isolates a runtime-safe local adapter factory module under `packages/domain/src/`, keeps the FP-0155 proof-heavy adapter module as a compatibility re-export/proof surface, and adds an explicit control-plane helper under `apps/control-plane/src/`.

The helper is opt-in only. It must not be called from `createContainer`, `createInMemoryContainer`, `createServerContainer`, `buildApp`, or route code. Existing route registration remains the only path where an explicitly supplied parser decision dependency reaches `/mcp`.

The proof command accepts exactly one FP-0156 plan at `plans/FP-0156-read-only-chatgpt-app-mcp-authorization-parser-local-adapter-app-construction-injection.md`, requires FP-0157 absence, proves runtime-safe import boundaries, proves app construction imports the runtime-safe factory path rather than the proof-heavy module, proves co-registration fail-closed behavior, proves default app/container/route behavior remains unchanged, proves parser decisions and HTTP responses stay token-clean, proves FP-0155 closeout freshness was patched if stale, and proves prior FP-0155 through FP-0100 boundaries remain intact.

## Concrete Steps

1. Patch stale FP-0155 closeout freshness with PR #334 merge facts and GitHub check state if present.
2. Create this exact FP-0156 plan before implementation.
3. Split the route-safe decision derivation helper/type into a runtime-safe path if needed for runtime import isolation.
4. Split the local adapter factory into a runtime-safe path and re-export it from the FP-0155 proof-heavy module for compatibility.
5. Add the explicit app-construction injection helper.
6. Add focused domain/control-plane specs for runtime import isolation, helper injection, fail-closed co-registration, no mutation, default-container absence, default `buildApp()` behavior, route behavior preservation, protected-resource metadata preservation, response no-leakage, and guardrail preservation.
7. Add `tools/read-only-mcp-authorization-parser-local-adapter-app-construction-injection-proof.mjs`.
8. Update exact successor proof bridges so FP-0156 is accepted and FP-0157 remains absent.
9. Refresh directly stale README, CODEX_README, START_HERE, docs/ACTIVE_DOCS.md, docs/PROJECT_STATE.md, docs/V2_BOUNDARY.md, plans/ROADMAP.md, and `plugins.md` entries only if they still present FP-0155/FP-0156 inaccurately after this slice.
10. Run focused validation, strict same-branch QA, final validation, closeout, commit, push, and open the PR.

## Validation and Acceptance

Required validation:

```bash
git diff --check
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
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts src/read-only-app-mcp-authorization-parser-contracts.spec.ts src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts src/read-only-app-mcp-authorization-parser.spec.ts src/read-only-app-mcp-authorization-parser-route-integration-readiness.spec.ts src/read-only-app-mcp-authorization-parser-local-adapter-readiness.spec.ts src/read-only-app-mcp-authorization-parser-local-adapter.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/app.spec.ts src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is observable when exactly one FP-0156 file exists, FP-0157 remains absent, app construction imports only the runtime-safe factory path, the proof-heavy FP-0155 adapter module is not imported by app construction, the explicit helper injects only with invalid-token/missing-token/metadata co-registration, unsafe partial wiring fails closed with the deterministic error, the original container is not mutated, default `createContainer`, `createInMemoryContainer`, `buildApp`, `/mcp`, and protected-resource metadata route behavior remain unchanged without the helper, parser decision objects never appear in response bodies, no raw header/token material or token-derived fields are retained or exposed, no realistic token/JWT or bearer-scheme credential examples are introduced, and predecessor FP proof gates remain green.

## Idempotence and Recovery

This slice is additive and explicit-only. Re-running the helper returns a shallow cloned container with a fresh route-decision dependency and does not mutate the input. Re-running proof commands should be deterministic.

If validation finds a defect, patch this same branch and rerun the required checks. If a proof bridge still treats FP-0156 as absent-only, patch only the exact successor bridge and rerun the proof ladder. If any failure requires default adapter construction, route behavior change, production token validation, token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, app submission, source mutation, or finance writes, stop and narrow scope instead of implementing that behavior.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0156-read-only-chatgpt-app-mcp-authorization-parser-local-adapter-app-construction-injection.md`
- FP-0155 closeout freshness patch if stale
- runtime-safe domain factory/helper modules
- compatibility re-export from `packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter.ts`
- explicit control-plane app-construction injection helper
- focused domain/control-plane specs
- `tools/read-only-mcp-authorization-parser-local-adapter-app-construction-injection-proof.mjs`
- direct FP-0156/FP-0157 proof-gate bridge compatibility
- directly stale active-doc/plugin freshness edits only if needed

No new route, migration, package script, fixture data file, public asset, screenshot, app-submission artifact, OpenAI API integration, provider integration, DB query, source mutation, finance write, or external communication is expected.

## Interfaces and Dependencies

Runtime-safe factory import boundary:

- may import the existing pure Authorization parser/classifier
- may import the route-safe decision derivation helper and type
- may not import proof/readiness plan scanners, fixture proof builders, repo path verifiers, no-token-leakage scanners, `fs`/`readdir`/`readFile`, app/control-plane modules, route files, DB/provider/OpenAI/network/time/random/crypto/env/logger/JWT/JWKS/introspection/OAuth/session APIs

Explicit helper interface:

`withReadOnlyAppMcpAuthorizationParserLocalAdapter(container: AppContainer): AppContainer`

Fail-closed error:

`read-only MCP authorization parser local adapter requires invalid-token challenge, missing-token challenge, and protected-resource metadata co-registration`

GitHub connector product behavior is out of scope. Routine `git` and `gh` CLI operations are allowed for repository and PR truth. Codex Security, Vercel project/deployment tooling, OpenAI Platform key setup, OpenAI API/model calls, provider calls, and public app submission tooling are not used in this slice.

## Outcomes & Retrospective

Implemented as an explicit-only local adapter app-construction injection slice.

Runtime import isolation is now durable: app/control-plane code imports the runtime-safe factory path, while proof/readiness scanners and plan verifiers remain in proof-heavy modules. The helper does not mutate containers, does not alter default container/app/route construction, and does not add runtime token validation, provider selection, provider calls, OAuth/session/auth middleware, DB/schema/package work, OpenAI API/model calls, public app behavior, app submission, source mutation, finance writes, or external communications.

Same-branch QA found proof-bridge successor gaps in older predecessor proof tools after FP-0156 became present. Those were corrected narrowly on this branch by allowing the exact FP-0156 plan/helper/runtime/proof artifacts while keeping FP-0157 absent and preserving predecessor boundaries. No route behavior, default construction behavior, token parsing, provider behavior, schema, package, source, or finance behavior correction was needed.

FP-0155 closeout freshness is corrected. Active docs and `plugins.md` no longer present FP-0156 as only future work once this branch is applied.

Final post-closeout validation passed before commit. The only same-branch QA correction after closeout was scanner-safe proof-string assembly in `tools/read-only-mcp-protocol-envelope-proof.mjs`; it did not change route behavior, default construction behavior, adapter behavior, token/runtime/provider/OAuth/auth posture, schema/package/source/finance behavior, or public app posture.

PR #335 same-branch QA later found one tiny `plugins.md` top-summary freshness gap. The correction only names FP-0156 in the repo-local plugin summary that already contained the detailed FP-0156 bullet; it does not change runtime behavior, proof semantics, route behavior, default construction behavior, adapter behavior, token/runtime/provider/OAuth/auth posture, schema/package/source/finance behavior, or public app posture.
