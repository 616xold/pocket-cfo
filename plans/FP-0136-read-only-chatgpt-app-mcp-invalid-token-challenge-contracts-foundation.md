# FP-0136 add read-only ChatGPT App MCP invalid-token challenge contracts

## Purpose / Big Picture

FP-0136 is the V2BD local/proof-only/read-only invalid-token WWW-Authenticate challenge contract foundation for the future authenticated `/mcp` path.

This is contract/proof work only. It defines invalid-token challenge contracts, but it does not emit WWW-Authenticate headers, does not attach challenge behavior to `/mcp`, does not change the protected-resource metadata route, does not change missing-token behavior, does not implement token validation runtime, does not parse, decode, validate, introspect, store, forward, log, or replay token material, does not implement OAuth, does not add token/session storage, does not add auth middleware, does not consume synthetic test doubles from routes, and does not create FP-0137.

FP-0130 shipped the local explicit-dependency missing-token challenge seam. FP-0131 planned token-validation and invalid-token runtime sequencing. FP-0132 shipped token-validation runtime contracts. FP-0133 shipped token-validation test-double contracts. FP-0134 shipped the local synthetic evaluator and token-material rejection hardening. FP-0135 shipped docs-and-plan plus proof-gate sequencing for invalid-token challenge work. FP-0136 now opens the next narrow foundation: pure domain/proof contracts for invalid-token challenge taxonomy, future status mapping, challenge parameter posture, resource metadata alignment, challenged-scope authority, JSON-RPC refusal separation, no-token-echo, no route runtime, and no test-double route consumption.

The user-visible proof point is not invalid-token route behavior. It is durable evidence that the repository can model the future invalid-token challenge contract without changing runtime behavior or weakening any shipped `/mcp`, metadata route, missing-token, token-validation, test-double, public security, protocol-envelope, or route-adapter boundary.

## Progress

- [x] 2026-05-21T17:19:24Z: Invoked the repo-local `pocket-cfo-codex-operator` skills requested for this slice: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-21T17:19:24Z: Confirmed branch `codex/v2bd-read-only-chatgpt-app-mcp-invalid-token-challenge-contracts-foundation-local-v1`, clean worktree before edits, PR #313 merged to `main`, FP-0135 present and shipped, FP-0136 absent, FP-0137 absent, active docs supporting FP-0135 as docs/proof-only invalid-token challenge sequencing, `/mcp` route adapter present, protected-resource metadata route present, missing-token challenge proof available, and FP-0134 evaluator proof available.
- [x] 2026-05-21T17:19:24Z: Ran the pre-edit proof gate set. `git diff --check`, FP-0135 through FP-0100 proof tools, focused domain specs, and focused control-plane `/mcp` plus protected-resource metadata specs passed before FP-0136 edits.
- [x] 2026-05-21T17:19:24Z: Reviewed source context read-only. OpenAI Developers tooling exposed only API-key setup tools, not read-only docs, so official web docs were used instead. No API-key setup, OpenAI API call, model call, provider call, deployment, external communication, connector product behavior, source mutation, or finance write was used.
- [x] 2026-05-21T18:36:40Z: Added pure domain invalid-token challenge contracts, focused specs, direct proof tooling, and minimal proof-gate bridge compatibility accepting exactly this FP-0136 contract plan while preserving FP-0137 absence.
- [x] 2026-05-21T18:36:40Z: Refreshed directly stale active docs, security/demo docs, roadmap, and `plugins.md` where they still described FP-0136 as absent or future-only after this contract foundation exists.
- [x] 2026-05-21T18:36:40Z: Focused bridge validation passed for the new FP-0136 direct proof, FP-0135 sequencing proof, FP-0134 local proof, FP-0133 contract proof, and focused invalid-token/test-double domain specs.
- [x] 2026-05-21T17:53:02Z: Full requested proof ladder, focused domain/control-plane specs, lint, typecheck, test, and `pnpm ci:repro:current` passed; strict same-branch QA confirmed FP-0136 stayed domain/proof/docs-only with no route/runtime/auth/token/DB/source/finance/public-asset drift. Commit, push, and PR creation remain repository delivery steps after closeout validation.
- [x] 2026-05-21T18:30:48Z: Started the targeted post-merge FP-0136 proof-source durability correction on branch `codex/v2bd-read-only-chatgpt-app-mcp-invalid-token-challenge-contract-proof-doc-leakage-hardening-local-v1` from shipped PR #314 / merge commit `a1a1fe5b0f6a35aaa6bdac4731ab1a63667a050e`. Baseline found the target FP-0136 direct proof red because the full required plan scan false-rejected safe absence wording; the remaining 24 requested baseline proof tools passed.
- [x] 2026-05-21T18:30:48Z: Hardened `tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs` so doc leakage scanning reads committed Markdown/text additions from `origin/main...HEAD`, staged and unstaged dirty tracked doc additions, untracked dirty doc text, and the full FP-0136 plan text. Added focused proof/spec coverage for current repo truth, simulated committed doc Bearer-like material rejection, simulated dirty doc JWT-like material rejection, safe docs/proof absence text acceptance, exact FP-0136 acceptance, and FP-0137 absence.
- [x] 2026-05-21T18:40:48Z: Post-merge correction validation passed on the patched tree: focused validation, the full requested proof ladder, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. A compatibility correction was applied after the first final ladder attempt so older protocol-envelope proof scanners would not treat safe absence self-test strings as code-level OpenAI/model integration.

## Surprises & Discoveries

- The pre-edit proof ladder was already green, so FP-0136 can proceed as a narrow successor rather than a correction to FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, or FP-0107.
- OpenAI Developers plugin discovery exposed API-key setup surfaces only. That tooling was intentionally unused. Official Apps SDK Markdown docs were available from the public docs map and full Markdown export.
- FP-0135 proof tooling currently requires FP-0136 absence. This slice must bridge that to exactly one FP-0136 local/proof-only contract plan while keeping FP-0137 absent.
- Direct active docs, roadmap, security/demo docs, and `plugins.md` were stale on FP-0136 absence and were refreshed in the same slice after the proof-only contract boundary existed.
- Legacy proof scanners for earlier read-only MCP boundaries needed exact FP-0136 proof-only path awareness because their conservative token/session path heuristics intentionally reject unknown `token` filenames. The correction stayed limited to proof-gate compatibility and did not weaken runtime scans.

## Decision Log

- Decision: FP-0136 defines invalid-token challenge contracts only. It does not implement invalid-token WWW-Authenticate route behavior, token validation runtime, token parsing runtime, JWT decoding, token introspection, OAuth, token/session storage, auth middleware, or route consumption of synthetic test doubles.
- Decision: Missing-token behavior remains unchanged. FP-0130 stays the only shipped WWW-Authenticate behavior, and only under its explicit dependency gate.
- Decision: Protected-resource metadata route behavior remains unchanged. FP-0136 only proves alignment with the existing FP-0125/FP-0130 metadata posture.
- Decision: `/mcp` route behavior remains unchanged. Future HTTP challenge behavior and JSON-RPC refusal envelopes remain separate layers.
- Decision: Invalid-token categories are modeled without token material: `malformed`, `expired`, `wrong-issuer`, `wrong-audience`, `wrong-resource`, `wrong-scope`, `wrong-org`, `wrong-company`, `revoked`, `replayed`, and `token-passthrough-attempt`.
- Decision: Future 401 mapping covers invalid, expired, malformed, revoked, replayed, wrong-audience, wrong-resource, and wrong-issuer-style invalid-token cases. Future 403 mapping covers insufficient-scope or wrong-scope-style cases. Future 400 mapping is limited to malformed authorization request shape. No status mapping is emitted at runtime in this slice.
- Decision: The future WWW-Authenticate Bearer parameter contract must align with RFC 6750 and MCP/RFC 9728 `resource_metadata`, but FP-0136 records no token values and emits no challenge headers.
- Decision: Scope challenge contracts treat challenged scopes as authoritative for the current request and preserve read-only least-privilege posture.
- Decision: Public ChatGPT App submission remains future-only. App SDK auth/security context is used only to keep future authentication posture honest.
- Decision: FP-0137 remains absent.
- Decision: The proof-source hardening remains based on both `origin/main...HEAD` and dirty same-branch QA target files, plus repository-inventory scans that treat FP-0136 contract/proof files as proof sources rather than runtime challenge code.
- Decision: Legacy proof-gate compatibility recognizes only the exact FP-0136 plan/proof path and invalid-token contract source family as proof-only surfaces. Route/runtime inventories continue rejecting token/session/OAuth/JWT/introspection/auth middleware drift.
- Decision: Post-merge proof-source durability hardening must not rely on plain working-tree `git diff` for tracked docs. FP-0136 direct proof now scans committed branch-diff doc additions, dirty same-branch QA doc additions, and the full FP-0136 plan text before accepting no-token-leakage booleans.
- Decision: Safe absence labels such as no Bearer material remain allowed, but actual Bearer-like material, JWT-like material, token examples, token echo, and leakage claims in committed or dirty doc additions remain fail-closed proof violations.

## Context and Orientation

Official source context used by FP-0136:

- Model Context Protocol Authorization specification, 2025-11-25: context for protected-resource metadata discovery, `resource_metadata` in WWW-Authenticate, token handling, invalid/expired token response posture, 401/403/400 authorization error taxonomy, resource indicators, and challenged-scope authority.
- Model Context Protocol Security Best Practices: context for token passthrough prohibition, audience separation, server-side validation, confused-deputy risk, least privilege, and session/auth boundaries.
- RFC 6750 Bearer Token Usage: context for WWW-Authenticate error parameters, `invalid_request`, `invalid_token`, `insufficient_scope`, and the 400/401/403 mapping.
- RFC 8707 Resource Indicators for OAuth 2.0: context for resource identifiers, audience restriction, and resource-specific token requests.
- RFC 9728 OAuth 2.0 Protected Resource Metadata: context for protected-resource metadata fields, metadata validation, and using WWW-Authenticate to advertise the protected-resource metadata location.
- OpenAI Apps SDK Authentication docs: platform context for authenticated MCP servers, protected-resource metadata discovery, per-request token checks, scope enforcement, and future WWW-Authenticate challenge posture.
- OpenAI Apps SDK Security & Privacy docs: platform context for data minimization, credential/secret restrictions, safe tool behavior, read-only action labeling, and avoiding sensitive material in tool inputs and outputs.

GitHub connector product behavior is out of scope. Routine `git`, `gh`, push, and PR operations are repository operations, not product GitHub connector behavior.

## Plan of Work

This slice creates exactly one FP-0136 plan, adds pure domain invalid-token challenge contracts and focused specs, adds one direct proof command, and updates the minimum proof-gate bridge so FP-0135 remains valid once FP-0136 exists while FP-0137 remains absent.

Allowed code lives in `packages/domain/src/read-only-app-mcp-invalid-token-challenge*.ts`, focused proof-gate helpers in existing read-only MCP token-validation and WWW-Authenticate/protected-resource modules only when needed, and `tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs`. Directly stale active docs and `plugins.md` may be refreshed only where they describe this exact FP-0136 boundary.

Forbidden scope remains broad: no route behavior change, no protected-resource metadata route behavior change, no missing-token behavior change, no invalid-token challenge runtime, no token parser, no JWT decoder, no token validation runtime, no token introspection, no OAuth/token/session/auth middleware implementation, no route consumption of synthetic test doubles, no real token examples, no JWT-like examples, no Bearer token material, no DB/schema/migration/package/data/source-pack/public-asset/provider/OpenAI/source/finance-write scope, no external communications, no autonomous action, and no FP-0137.

## Concrete Steps

1. Add `plans/FP-0136-read-only-chatgpt-app-mcp-invalid-token-challenge-contracts-foundation.md`.
2. Add pure domain contracts/builders/proof schemas for the required FP-0136 invalid-token challenge proof contract and boundary types.
3. Add focused domain specs proving exactly one FP-0136 path is accepted, FP-0137 remains absent, contract-only posture, taxonomy coverage, future 401/403/400 mapping, `resource_metadata` alignment, challenged-scope authority, JSON-RPC separation, no token echo, no route runtime, and prior boundary preservation.
4. Add `tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs` with machine-readable JSON fields required by the slice.
5. Update minimum proof gates so FP-0136 is accepted only at the exact plan path and only as local/proof-only/read-only contracts, while FP-0137 remains absent.
6. Refresh directly stale active docs and `plugins.md` only where necessary.
7. Run focused validation, strict same-branch QA, final validation, post-closeout reruns if needed, one commit, push, and PR creation.

## Validation and Acceptance

Acceptance requires:

- exactly one FP-0136 plan exists at `plans/FP-0136-read-only-chatgpt-app-mcp-invalid-token-challenge-contracts-foundation.md`
- FP-0137 remains absent
- FP-0136 is local/proof-only/read-only contract work
- invalid-token challenge behavior remains contract-only and not implemented
- missing-token behavior remains unchanged
- protected-resource metadata route behavior remains unchanged
- `/mcp` route behavior remains unchanged
- token validation runtime remains future-only
- token parser, JWT decoder, token introspection, OAuth/session/auth middleware, and token/session storage remain absent
- synthetic test doubles remain test/proof-only and may not be route input
- invalid-token categories are represented without token material
- future 401/403/400 status mapping is contract-only and correct
- WWW-Authenticate Bearer parameter posture and `resource_metadata` alignment are future-only
- challenged scopes are treated as authoritative for the current request
- JSON-RPC refusal envelope separation remains separate from HTTP challenge headers
- no token value appears in contract examples, proof output, logs, docs examples, structuredContent, evidence, or metadata examples
- no DB queries, schemas, migrations, package scripts, source packs, fixtures, public assets, OpenAI API/model calls, provider calls, source mutation, finance writes, generated finance advice, runtime-Codex finance output, external communications, autonomous action, or FP-0137 are added
- FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 boundaries remain proven

Validation command set:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-test-double-local-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-test-double-contract-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-runtime-contract-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-runtime-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-www-authenticate-auth-challenge-proof.mjs
pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-local-route-proof.mjs
pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-route-input-proof.mjs
pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-builder-proof.mjs
pnpm exec tsx tools/read-only-mcp-canonical-resource-auth-server-proof.mjs
pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-proof.mjs
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
pnpm --filter @pocket-cto/domain exec vitest run src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-www-authenticate.spec.ts src/read-only-app-mcp-www-authenticate-boundary-hardening.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-protected-resource-metadata-route-input.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/app.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

If a post-validation doc closeout edit is made, rerun `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

## Idempotence and Recovery

This slice is idempotent because it creates exactly one FP-0136 contract plan, one pure domain contract family, one direct proof command, focused specs, proof-gate bridge edits, and directly stale doc/plugin refreshes. Re-running the proof should continue accepting the same FP-0136 path and rejecting FP-0137 or any runtime/auth/route/token expansion.

If a proof rejects FP-0136, patch only the contract text, proof-gate bridge, or proof scanner needed to preserve the contract-only truth. If a proof detects route/auth/runtime/token material scope, remove that scope and rerun the full ladder. If unrelated dirty files, missing services, missing proof tools, or auth failures appear, stop and report the narrow blocker.

Rollback is straightforward: remove this FP-0136 plan, the FP-0136 invalid-token challenge contract files, the direct FP-0136 proof command, proof-gate bridge edits, focused spec edits, and directly stale doc/plugin refreshes. Do not revert FP-0135 or earlier shipped records.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0136-read-only-chatgpt-app-mcp-invalid-token-challenge-contracts-foundation.md`
- `packages/domain/src/read-only-app-mcp-invalid-token-challenge*.ts`
- `packages/domain/src/read-only-app-mcp-invalid-token-challenge*.spec.ts`
- `tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs`
- focused proof-gate helper changes in existing read-only MCP token-validation/test-double modules only where needed
- directly stale active-doc and `plugins.md` refreshes only where needed

Replay implication: FP-0136 creates no mission state changes, ingest actions, reports, approvals, monitoring outputs, external communications, source mutations, finance writes, or durable finance answers. No replay event is required.

Evidence/provenance/freshness implication: FP-0136 creates no raw sources, source snapshots, raw-source mutations, Finance Twin state, CFO Wiki output, evidence bundle, freshness posture change, or finance limitation output. Its proof output is limited to contract/proof boundary booleans and prior-boundary preservation.

No new environment variables, package scripts, migrations, fixtures, datasets, source packs, public assets, screenshots, images, app-submission assets, provider calls, OpenAI API/model calls, deployment config, external artifacts, or FP-0137 are added.

## Interfaces and Dependencies

FP-0136 adds no runtime interface. The only new interface is proof-only: `tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs` reports booleans proving the FP-0136 contract boundary and prior FP posture.

Invalid-token challenge implementation may start only after this plan is merged and a later named Finance Plan opens that implementation explicitly. That future plan must prove production token-validation runtime readiness, no raw token echo, no token examples, no token passthrough, no route consumption of test doubles, metadata route alignment, challenged-scope correctness, HTTP challenge and JSON-RPC refusal separation, and unchanged missing-token behavior.

Upstream proof dependencies: FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 must remain proven. FP-0137 remains absent.

## Outcomes & Retrospective

FP-0136 closed green on the same branch. The slice added pure domain invalid-token challenge contracts, focused specs, direct proof tooling, and proof-gate bridge compatibility accepting exactly one FP-0136 plan while keeping FP-0137 absent.

Validation passed: full requested proof ladder, focused domain specs, focused control-plane route/metadata specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

Strict same-branch QA found no `/mcp` route behavior change, no protected-resource metadata route behavior change, no missing-token behavior change, no invalid-token runtime, no token parser, no JWT decoder, no token validation runtime, no token introspection, no route consumption of synthetic test doubles, no OAuth/session/auth middleware or token/session storage, no real token/JWT-like/Bearer material, no DB/schema/package/data/source-pack/public-asset/OpenAI/provider/source/finance-write drift, and no FP-0137.

Recommendation: invalid-token challenge implementation planning may start next only as a new narrow Finance Plan after this branch merges. Public ChatGPT App submission should wait until the future authenticated `/mcp` runtime and challenge behavior are implemented and proven.

Post-merge proof-hardening correction closeout: the correction stayed limited to `tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs`, focused domain proof/spec compatibility, this plan note, and direct `plugins.md` refresh. It preserved `/mcp` route behavior, protected-resource metadata route behavior, missing-token behavior, FP-0135 sequencing, FP-0134 evaluator, FP-0133 test-double contracts, FP-0132 runtime contracts, FP-0131 sequencing, FP-0130 missing-token challenge, FP-0128 readiness, FP-0127 auth challenge contracts, FP-0125 metadata route, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 public security boundaries. No route behavior, metadata route behavior, missing-token behavior, invalid-token runtime, token parser, JWT decoder, token validation runtime, token introspection, OAuth/session/auth middleware, DB/schema/package/source/data/provider/OpenAI/source-mutation/finance-write scope, public asset, external communication, autonomous action, or FP-0137 was added.

Validation closeout for the post-merge correction: `git diff --check`, the full requested proof ladder, focused domain specs, focused control-plane route/metadata specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed before this closeout note. Because this note edits proof-source text after validation, rerun `git diff --check`, the FP-0136 target proof, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` before commit.
