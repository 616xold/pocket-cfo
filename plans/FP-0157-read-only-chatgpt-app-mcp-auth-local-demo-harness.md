# FP-0157 - Read-only ChatGPT App/MCP Auth Local Demo Harness

## Purpose / Big Picture

FP-0157 is the V2BY read-only ChatGPT App/MCP local auth demo and smoke-harness slice after merged FP-0156.

This slice does two things only:

- adds a local-only deterministic smoke harness for the already explicit FP-0156 app-construction helper path
- hardens that explicit helper so it refuses to overwrite an already supplied Authorization parser route-decision dependency

This is not public ChatGPT App implementation, public app submission, default adapter wiring, default parser wiring, production token validation, token parser implementation, JWT decoder implementation, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider selection/integration/calls, token/session storage, auth middleware, DB/schema/package work, deployment work, OpenAI API/model integration, source mutation, finance write, external communication, or autonomous action.

Target phase: V2BY read-only ChatGPT App/MCP Authorization parser local auth demo harness, local-only and explicit-helper-only.

## Progress

- [x] 2026-05-25T10:18:54Z - Preflight confirmed work on `codex/v2by-read-only-chatgpt-app-mcp-auth-local-demo-harness-local-v1`, clean worktree, authenticated `gh`, PR #335 merged to `main`, current `HEAD` and `origin/main` at merge commit `08e33b0f665606dee68a03c15ca766b76bc7b4bb`, PR #335 head SHA `61c7fa6d07fcb47ff4a4b05db3b870c92b7f715a`, GitHub `static` and `integration-db` checks green, local Postgres/object storage services available, FP-0156 present, FP-0157 absent before this plan, FP-0158 absent, and required proof tools present.
- [x] 2026-05-25T10:18:54Z - Baseline proof gates for FP-0156, FP-0155, FP-0154, FP-0153, FP-0152, FP-0151, FP-0150, FP-0149, FP-0148, FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100 passed before FP-0157 edits.
- [x] 2026-05-25T10:18:54Z - Repo-local `pocket-cfo-codex-operator` skills were invoked for Finance Plan orchestration, modular architecture, source provenance, CFO Wiki/doc freshness, evidence bundles, F6 monitoring semantics, validation ladder composition, and handoff auditing. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-25T10:18:54Z - OpenAI Developers exposed only API-key setup surfaces, not read-only docs. ChatGPT Apps and Codex Security exposed no separate read-only local validation/security tool for this slice. Official MCP, RFC, and OpenAI Apps SDK documentation was used read-only as local auth/demo boundary context only. No API-key setup, OpenAI API/model call, provider call, deployment action, public asset, app submission action, source mutation, finance write, or external communication was used.
- [x] 2026-05-25T10:33:05Z - FP-0156 closeout freshness was patched with PR #335 merge facts, merge commit, validated head SHA, green GitHub `static` and `integration-db` checks, same-branch QA correction scope, and no-post-merge-QA posture.
- [x] 2026-05-25T10:33:05Z - The explicit local adapter app-construction helper now fails closed before construction when `readOnlyAppMcpAuthorizationParserRouteDecision` is already present, while preserving the existing co-registration error and non-mutating clone behavior.
- [x] 2026-05-25T10:33:05Z - Added the local in-memory auth demo/smoke harness and proof bridge. The harness uses only the explicit helper path, verifies missing-token, sanitized invalid-token, protected-resource metadata, default behavior preservation, and no parser/credential exposure, then prints only a sanitized boolean summary.
- [x] 2026-05-25T10:33:05Z - Added exact FP-0157/FP-0158 plan bridge coverage and focused specs for helper double-injection rejection, default behavior preservation, local harness summary, and no-token-leakage posture.
- [x] 2026-05-25T10:33:05Z - Directly stale README, CODEX_README, START_HERE, ACTIVE_DOCS, PROJECT_STATE, V2_BOUNDARY, ROADMAP, and `plugins.md` entries were refreshed so FP-0157 is recorded as a local-only helper smoke-harness slice rather than public/default auth behavior.
- [x] 2026-05-25T10:45:22Z - Strict same-branch QA found only predecessor proof allowlists that still treated any FP-0157 artifact as out of scope. The exact FP-0157 plan, local harness, and proof files were added to those proof bridges without changing runtime, route, container, provider, token, DB, source, finance, public app, or deployment behavior.
- [x] 2026-05-25T10:45:22Z - Final validation passed, including the FP-0157 local harness proof, the local harness command, predecessor proof ladder, focused domain and control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-05-25T11:49:00Z - Post-merge freshness was patched from PR #336: GitHub confirms PR #336 merged with head SHA `86268a8882f3c404ba4666b868a576c401d4ce61` and merge commit `2d02b692dac61bb02b22a78ce824ff87c107e01f`, GitHub `static` and `integration-db` checks were green, same-branch QA found no issues and made no correction, and no post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.

## Surprises & Discoveries

The FP-0156 plan closeout still had same-branch QA wording that described PR #335 correction work as needing a validation rerun before commit, but GitHub now confirms PR #335 is merged with green `static` and `integration-db` checks. FP-0157 includes a same-branch freshness patch for that historical plan record.

The existing helper already shallow-clones its input container and requires invalid-token challenge, missing-token challenge, and protected-resource metadata co-registration before injection. The only hardening needed is a deterministic refusal when a parser route-decision dependency is already present.

Strict same-branch QA surfaced three predecessor proof scripts whose path allowlists still rejected exact FP-0157 local-harness artifacts. Those proof bridges were updated narrowly to recognize this one local demo/proof slice while preserving all earlier route, runtime, default-wiring, provider, token-validation, and public-boundary assertions.

## Decision Log

- 2026-05-25T10:18:54Z - A local read-only MCP auth demo/smoke harness is included. It is local-only and uses the explicit helper only.
- 2026-05-25T10:18:54Z - Helper double-injection fail-closed hardening is included.
- 2026-05-25T10:18:54Z - Default adapter construction is not included.
- 2026-05-25T10:18:54Z - Default `createContainer()` and `createInMemoryContainer()` behavior do not change.
- 2026-05-25T10:18:54Z - Default `buildApp()` behavior does not change when the helper is not used.
- 2026-05-25T10:18:54Z - Production token-validation runtime cannot start after FP-0157.
- 2026-05-25T10:18:54Z - Provider selection cannot start after FP-0157; provider remains provider-neutral/deferred unless a later complete provider evidence slice explicitly opens it.
- 2026-05-25T10:18:54Z - OAuth/session/auth middleware cannot start after FP-0157.
- 2026-05-25T10:18:54Z - Public ChatGPT App demo/submission cannot start after FP-0157.
- 2026-05-25T10:18:54Z - The local smoke harness builds in-memory apps only, uses `withReadOnlyAppMcpAuthorizationParserLocalAdapter(...)`, co-registers invalid-token challenge, missing-token challenge, and protected-resource metadata evidence, verifies missing Authorization, Authorization-present safe sentinel routing to the existing sanitized invalid-token challenge, protected-resource metadata output, default behavior preservation without the helper, and no parser decision or credential material in response bodies, then emits only a sanitized boolean summary.
- 2026-05-25T10:18:54Z - The helper refuses to overwrite an existing parser route-decision dependency, still refuses incomplete co-registration, and still does not mutate its input container.
- 2026-05-25T10:18:54Z - Future FP-0158 may open only a read-only evidence-app local demo bridge, local auth smoke harness correction, or proof-gate correction. It must not implement production token validation, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, or app submission.
- 2026-05-25T10:18:54Z - Preserve FP-0156 app-construction injection, FP-0155 local adapter implementation, FP-0154 local adapter readiness, FP-0153 app-construction wiring, FP-0152 route integration, FP-0151 route readiness, FP-0150 route sequencing, FP-0149 parser implementation, FP-0148 readiness, FP-0147 provider-selection evidence, FP-0146 parser contracts, FP-0145 runtime contracts, FP-0144 production token-validation sequencing, FP-0143 app wiring, FP-0142 route sequencing, FP-0141 invalid-token local runtime, FP-0139 result envelopes, FP-0130 missing-token challenge, FP-0125 protected-resource metadata route, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 security boundary.

## Context and Orientation

FP-0156 shipped runtime-safe adapter factory import isolation and an explicit app-construction helper. The helper can inject the already implemented local Authorization parser route-decision adapter into an `AppContainer`, but only after invalid-token challenge, missing-token challenge, and protected-resource metadata evidence are co-registered.

The default construction path remains clean: `createContainer`, `createInMemoryContainer`, default `buildApp`, `/mcp`, and protected-resource metadata behavior do not construct or wire the adapter unless a caller supplies the dependency explicitly or uses the explicit helper.

Replay and evidence posture: FP-0157 changes planning docs, control-plane helper/tests, proof tooling, and a local smoke harness only. It does not change mission state, ingest state, source registry state, CFO Wiki facts, finance answers, approvals, monitor findings, reports, durable finance artifacts, or source evidence. No replay event is required because no mission-facing state transition or finance artifact mutation occurs. Proof output and the sanitized harness summary are the durable acceptance evidence for this technical slice.

Provenance, freshness, and limitations: official protocol/security docs are context only. Finance evidence remains the source of truth for product answers. FP-0157 produces no finance answer, no report, no public listing copy, no generated advice, no external communication, and no source mutation.

## Plan of Work

Patch the FP-0156 closeout freshness record with PR #335 merge facts and no-post-merge-QA posture.

Harden `withReadOnlyAppMcpAuthorizationParserLocalAdapter(...)` so it checks for an existing `readOnlyAppMcpAuthorizationParserRouteDecision` dependency before constructing a new dependency. The new failure is deterministic and occurs before mutation or construction.

Add a local-only smoke harness under `tools/` that builds an in-memory default app and an in-memory helper-injected app. The harness verifies the missing-token challenge, sanitized invalid-token challenge for a safe Authorization-present sentinel, protected-resource metadata route, default behavior preservation when the helper is not used, and response no-leakage. The harness prints only a sanitized summary.

Add a proof command that accepts exactly one FP-0157 plan at `plans/FP-0157-read-only-chatgpt-app-mcp-auth-local-demo-harness.md`, keeps FP-0158 absent, proves the helper hardening and local harness boundary, proves no default adapter wiring or route behavior change, proves no parser/credential exposure, proves FP-0156 closeout freshness, and preserves prior FP boundaries.

Refresh only directly stale active docs and `plugins.md` lines that still treat local demo harness wiring or FP-0157 as future/blocked after this slice.

## Concrete Steps

1. Patch stale FP-0156 closeout freshness with PR #335 merge facts, GitHub check state, same-branch QA correction scope, and no-post-merge-QA posture.
2. Create this exact FP-0157 plan before implementation.
3. Add exact FP-0157/FP-0158 plan bridge helpers in the domain contracts.
4. Harden the explicit app-construction helper against ambiguous double injection.
5. Add focused control-plane/domain specs for exact FP-0157 path acceptance, FP-0158 absence, helper double-injection rejection, required co-registration preservation, non-mutation, default container absence, default `buildApp` and `/mcp` preservation, local harness behavior, and no-token-leakage posture.
6. Add `tools/read-only-mcp-auth-local-demo-harness.mjs`.
7. Add `tools/read-only-mcp-auth-local-demo-harness-proof.mjs`.
8. Update exact successor proof bridges so FP-0157 is accepted and FP-0158 remains absent.
9. Refresh directly stale README, CODEX_README, START_HERE, docs/ACTIVE_DOCS.md, docs/PROJECT_STATE.md, docs/V2_BOUNDARY.md, plans/ROADMAP.md, and `plugins.md` entries only if they still present FP-0156/FP-0157 inaccurately after this slice.
10. Run focused validation, strict same-branch QA, final validation, closeout, commit, push, and open the PR.

## Validation and Acceptance

Required validation:

```bash
git diff --check
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

Acceptance is observable when exactly one FP-0157 plan exists, FP-0158 remains absent, the helper refuses to overwrite an existing parser route-decision dependency with the deterministic error `read-only MCP authorization parser local adapter refuses to overwrite an existing parser route-decision dependency`, the helper still refuses incomplete co-registration with the existing FP-0156 error, the helper still does not mutate input, the local harness emits only a sanitized summary, missing Authorization returns the missing-token challenge, Authorization-present safe sentinel returns the existing sanitized invalid-token challenge, the protected-resource metadata route returns the explicit metadata document, default app behavior remains unchanged without the helper, parser decision objects and credential material never appear in response bodies or harness output, no realistic token/JWT or bearer-scheme credential examples are introduced, no default adapter construction or route construction appears, and predecessor FP proof gates remain green.

## Idempotence and Recovery

This slice is additive and explicit-only. Re-running the local harness is deterministic and should leave no persistent state. Re-running the helper on a container that already has a parser route-decision dependency intentionally fails closed; callers must choose the existing dependency or build a fresh container.

If validation finds a defect, patch this same branch and rerun the required checks. If a proof bridge still treats FP-0157 as absent-only, patch only the exact successor bridge and rerun the proof ladder. If any failure requires default adapter construction, route behavior change, production token validation, token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, app submission, source mutation, or finance writes, stop and narrow scope instead of implementing that behavior.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0157-read-only-chatgpt-app-mcp-auth-local-demo-harness.md`
- FP-0156 closeout freshness patch if stale
- helper double-injection fail-closed hardening
- focused control-plane/domain specs
- `tools/read-only-mcp-auth-local-demo-harness.mjs`
- `tools/read-only-mcp-auth-local-demo-harness-proof.mjs`
- direct FP-0157/FP-0158 proof-gate bridge compatibility
- directly stale active-doc/plugin freshness edits only if needed

No new route, migration, package script, fixture data file, public asset, screenshot, app-submission artifact, OpenAI API integration, provider integration, DB query, source mutation, finance write, or external communication is expected.

## Interfaces and Dependencies

Explicit helper interface:

`withReadOnlyAppMcpAuthorizationParserLocalAdapter(container: AppContainer): AppContainer`

Existing co-registration fail-closed error:

`read-only MCP authorization parser local adapter requires invalid-token challenge, missing-token challenge, and protected-resource metadata co-registration`

New double-injection fail-closed error:

`read-only MCP authorization parser local adapter refuses to overwrite an existing parser route-decision dependency`

Local harness command:

`pnpm exec tsx tools/read-only-mcp-auth-local-demo-harness.mjs`

Proof command:

`pnpm exec tsx tools/read-only-mcp-auth-local-demo-harness-proof.mjs`

GitHub connector product behavior is out of scope. Routine `git` and `gh` CLI operations are allowed for repository and PR truth. Codex Security, Vercel project/deployment tooling, OpenAI Platform key setup, OpenAI API/model calls, provider calls, public assets, screenshots, and app submission tooling are not used in this slice.

## Outcomes & Retrospective

FP-0157 is complete as a local-only read-only ChatGPT App/MCP auth demo and smoke-harness slice. The explicit helper now fails closed before constructing a new parser route-decision dependency when the container already supplies one, using the deterministic error `read-only MCP authorization parser local adapter refuses to overwrite an existing parser route-decision dependency`.

The local harness builds in-memory apps only, uses the explicit helper path only, co-registers invalid-token challenge, missing-token challenge, and protected-resource metadata evidence, verifies missing Authorization, Authorization-present safe sentinel routing to the existing sanitized invalid-token challenge, protected-resource metadata output, default behavior preservation without the helper, and no parser decision or credential material in response bodies or harness output. It emits only the sanitized boolean summary.

FP-0156 closeout freshness is corrected with PR #335 merge facts, validated head SHA, merge commit, green GitHub `static` and `integration-db` checks, same-branch QA correction scope, and no-post-merge-QA posture for the already merged branch. No replay event is required because FP-0157 mutates no mission state, finance source, source snapshot, CFO Wiki fact, report, approval, monitor result, or finance artifact.

Final validation passed on 2026-05-25, including the FP-0157 harness proof and command, the full predecessor proof ladder named in this plan, focused domain and control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. Public ChatGPT App behavior, app submission, default adapter wiring, production token validation, token parser/JWT/JWKS/introspection/OAuth/session/auth middleware, provider selection/integration/calls, DB/schema/package work, OpenAI API/model calls, source mutation, finance writes, public assets, generated public prose, external communications, and FP-0158 remain blocked.

Post-merge freshness was corrected on 2026-05-25 after FP-0157 merged. GitHub confirms PR #336 merged with head SHA `86268a8882f3c404ba4666b868a576c401d4ce61` and merge commit `2d02b692dac61bb02b22a78ce824ff87c107e01f`; GitHub `static` and `integration-db` checks were green. Same-branch QA found no issues and made no correction, and no post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.
