# FP-0155 - Implement Read-only ChatGPT App/MCP Authorization Parser Local Adapter

## Purpose / Big Picture

FP-0155 is the V2BW read-only ChatGPT App/MCP Authorization parser local route-decision adapter implementation slice after merged FP-0154 construction-readiness.

This is the pure-domain/local-only explicit factory implementation for the local adapter. It creates an explicit factory that composes the existing pure parser/classifier with the existing route-safe decision derivation helper. It does not make the adapter a default, does not construct the adapter in app construction, does not construct the adapter in route code, and does not change `buildApp()` or `/mcp` behavior.

Target phase: V2BW read-only ChatGPT App/MCP Authorization parser local adapter implementation/factory.

## Progress

- [x] 2026-05-24T23:44:10Z - Preflight confirmed work on `codex/v2bw-read-only-chatgpt-app-mcp-authorization-parser-local-adapter-implementation-local-v1`, clean worktree, authenticated `gh`, PR #333 merged to `main`, current `HEAD` and `origin/main` at `dd5a72223179347f328d71da94f142fe82c2d25e`, local Postgres/object storage services available, FP-0154 present, FP-0155 absent before this plan, FP-0156 absent, and required proof tools present.
- [x] 2026-05-24T23:44:10Z - Baseline proof gates for FP-0154, FP-0153, FP-0152, FP-0151, FP-0150, FP-0149, FP-0148, FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100 passed before FP-0155 edits.
- [x] 2026-05-24T23:44:10Z - Official MCP Authorization, MCP Security Best Practices, OpenAI Apps SDK authentication/security guidance, and OpenAI MCP docs were used read-only as adapter context only. OpenAI Developers exposed no read-only docs surface beyond API-key setup, so no key setup, OpenAI API/model call, provider call, deployment action, public asset, app submission action, or external communication was used.
- [x] 2026-05-24T23:44:10Z - Patched FP-0154 stale closeout freshness to record PR #333 merge facts, GitHub `static` and `integration-db` green checks, same-branch QA freshness, and the no post-merge QA requirement while current main matches the validated PR posture.
- [x] 2026-05-24T23:44:10Z - Added the pure-domain local adapter implementation, explicit factory, focused spec, proof builder, and direct FP-0155 proof command without app construction, route construction, default wiring, runtime validation, provider, OAuth/session/auth, DB/schema/package, public app, or source/finance write scope.
- [x] 2026-05-25T00:10:11Z - Same-branch QA corrected exact successor proof bridges only: FP-0155/FP-0156 bridge fields, new direct proof command recognition, invalid-token predecessor allowlists, and FP-0107 route-adapter changed-file recognition. No app construction, route behavior, provider, token-validation runtime, DB/schema/package, source, or finance-write behavior changed.
- [x] 2026-05-25T00:10:11Z - Final pre-closeout validation passed: `git diff --check`; the full FP-0155 through FP-0100 proof ladder listed below; focused domain and control-plane specs; `pnpm lint`; `pnpm typecheck`; `pnpm test`; and `pnpm ci:repro:current`.
- [x] 2026-05-25T00:10:11Z - Closeout records no remaining adapter implementation correction, app-construction correction, route integration correction, provider-selection evidence correction, or proof-gate correction before PR. Post-closeout validation must rerun the required diff/lint/typecheck/test/repro commands before commit.
- [x] 2026-05-25T08:46:09Z - FP-0156 same-branch freshness polish confirmed PR #334 merged to `main`; `gh` reported head SHA `8d05bbaa5fa19c80e630dea317f148cd81b85f97`, merge commit `a291881c0853ddb56af6a56cbad9e71184a75742`, and green GitHub `static` plus `integration-db` checks. Post-merge same-branch QA found no FP-0155 release/check issues and made no correction. No post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.

## Surprises & Discoveries

FP-0154 already made the adapter boundary precise enough to implement without touching the app or route layers. The factory can remain explicit-only and can return the existing `ReadOnlyMcpAuthorizationParserRouteDecisionDependency` by passing only sanitized classification fields into the route-safe derivation helper.

GitHub PR #333 was already merged, and its checks were green. The only same-branch freshness correction needed before FP-0155 was to record those facts in the FP-0154 closeout.

Older predecessor proof gates intentionally keep tight changed-file allowlists. FP-0155 needed exact successor bridge entries so those gates could distinguish a pure-domain adapter implementation/proof slice from route/app behavior changes. These bridge edits were proof durability corrections only.

## Decision Log

- 2026-05-24T23:44:10Z - Local adapter implementation/factory is included as a pure-domain/local-only explicit factory implementation.
- 2026-05-24T23:44:10Z - Default adapter construction is not included.
- 2026-05-24T23:44:10Z - App construction may not construct the adapter after FP-0155. A future FP-0156 may plan explicit app-construction injection of the already-implemented factory only if FP-0155 proof remains green.
- 2026-05-24T23:44:10Z - Route code may not construct the adapter after FP-0155.
- 2026-05-24T23:44:10Z - Default `buildApp()` behavior remains unchanged after FP-0155, and FP-0155 does not change `buildApp()` or `/mcp` behavior.
- 2026-05-24T23:44:10Z - Production token-validation runtime cannot start after FP-0155.
- 2026-05-24T23:44:10Z - Provider selection cannot start after FP-0155; provider remains provider-neutral/deferred unless separate complete provider evidence exists.
- 2026-05-24T23:44:10Z - OAuth/session/auth middleware cannot start after FP-0155.
- 2026-05-24T23:44:10Z - Public ChatGPT App demo/submission cannot start after FP-0155.
- 2026-05-24T23:44:10Z - Implemented adapter input boundary: accepts only `{ authorizationHeader?: string | readonly string[] | null }`; passes input into the existing pure parser/classifier only inside the local adapter stack; never returns, retains, stores, logs, echoes, normalizes, hashes, digests, fingerprints, or forwards raw header/token material.
- 2026-05-24T23:44:10Z - Implemented adapter output boundary: returns exactly `ReadOnlyMcpAuthorizationParserRouteDecisionReadiness`; output includes only route-safe decision fields from FP-0151/FP-0153; output never includes raw header/token material, token-derived prefix/suffix/length/hash/digest/claims/decoded header/decoded payload/fingerprint, or parser internals.
- 2026-05-24T23:44:10Z - Implemented adapter composition: may call `classifyReadOnlyMcpAuthorizationHeader`; may call `deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness`; may not call routes; may not call app construction; may not call DB/provider/OpenAI/network/time/random/crypto/env/logger APIs; may not call token validation/JWT/JWKS/introspection/OAuth/session APIs.
- 2026-05-24T23:44:10Z - Implemented adapter failure mapping: missing authorization maps to FP-0130 missing-token lane; malformed authorization maps to FP-0139 malformed_authorization; unsupported scheme maps to unsupported_validation_mode; bearer without material maps to malformed_authorization; unsafe whitespace/control maps to malformed_authorization; passthrough attempt maps to invalid_token; credential-observed/bearer-present remains invalid-token challenge lane only until production validation exists.
- 2026-05-24T23:44:10Z - Implemented adapter test matrix uses safe sentinels only: absent header, empty header, unsupported scheme safe sentinel, malformed scheme safe sentinel, structural multiple values, safe Bearer-scheme credential-present sentinel, unsafe whitespace/control safe sentinel, and passthrough-attempt sentinel. No realistic token/JWT or bearer-scheme credential examples are allowed.
- 2026-05-24T23:44:10Z - Future FP-0156 may open only explicit app-construction injection of the already-implemented local adapter factory, adapter implementation correction, or proof-gate correction. It must not implement default app construction and must not implement production token validation, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, or app submission.
- 2026-05-24T23:44:10Z - Preserve FP-0154 local adapter readiness, FP-0153 app-construction wiring, FP-0152 route integration, FP-0151 route readiness, FP-0150 route sequencing, FP-0149 parser implementation, FP-0148 readiness, FP-0147 provider-selection evidence, FP-0146 parser contracts, FP-0145 runtime contracts, FP-0144 production token-validation sequencing, FP-0143 app wiring, FP-0142 route sequencing, FP-0141 invalid-token local runtime, FP-0139 result envelopes, FP-0130 missing-token challenge, FP-0125 protected-resource metadata route, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 security boundary.

## Context and Orientation

The repo already has:

- a pure-domain Authorization parser/classifier in `packages/domain`
- a route-safe parser decision readiness derivation helper
- `/mcp` route registration that can consume an explicitly injected route-safe parser decision dependency while preserving default behavior when absent
- app construction that can pass an explicitly supplied dependency through while default containers do not construct it

FP-0155 joins only the pure-domain parser and route-safe derivation helper behind an explicit local factory. It does not join that factory to app construction or routes. The adapter has no production validation authority and no provider authority.

Replay and evidence posture: FP-0155 changes planning docs, domain code, focused specs, and proof output only. It does not change mission state, ingest state, source registry state, CFO Wiki facts, finance answers, approvals, monitor findings, reports, or durable finance artifacts. No replay event is required because no mission-facing state transition or finance artifact mutation occurs. Proof output is the durable acceptance evidence for this technical slice.

Provenance, freshness, and limitations: official protocol/security docs are context only. Finance evidence remains the source of truth for product answers. FP-0155 produces no finance answer, no report, no public listing copy, no generated advice, no external communication, and no source mutation.

## Plan of Work

The implementation adds `packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter.ts`. The factory returns a `ReadOnlyMcpAuthorizationParserRouteDecisionDependency`, calls `classifyReadOnlyMcpAuthorizationHeader(input)`, passes only `authorization_presence`, `authorization_scheme_classification`, `credential_material_observed`, and `failure_state` into `deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness(...)`, and returns exactly the route-safe decision object.

The proof command accepts exactly one FP-0155 plan at `plans/FP-0155-read-only-chatgpt-app-mcp-authorization-parser-local-adapter-implementation.md`, requires FP-0156 absence, proves the adapter is explicit-only and pure-domain/local-only, proves app and route construction remain blocked, proves default wiring and route behavior remain unchanged, proves output is route-safe and token-clean, proves fixtures contain no real token examples or JWT-like examples, proves FP-0154 closeout freshness is corrected, and proves prior FP-0154 through FP-0100 boundaries remain intact.

Direct active docs and `plugins.md` will be updated only where directly stale after FP-0155 exists. Historical shipped plan records stay historical except for the explicit FP-0154 closeout freshness patch.

## Concrete Steps

1. Patch stale FP-0154 closeout freshness with PR #333 merge facts and GitHub check state.
2. Create this exact FP-0155 plan before final implementation closeout.
3. Add `packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter.ts` with the explicit local adapter factory, proof builder, boundary verifier, FP-0154 freshness verifier, and FP-0155 planning text verifier.
4. Add `packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter.spec.ts` with focused safe-sentinel tests, output-field tests, source-scope tests, no-token-leakage tests, and proof-boundary tests.
5. Export the adapter helper from `packages/domain/src/index.ts` only because specs and proof commands consume domain helpers.
6. Add `tools/read-only-mcp-authorization-parser-local-adapter-implementation-proof.mjs`.
7. Update exact successor proof bridges so FP-0155 is accepted and FP-0156 remains absent.
8. Refresh directly stale README, CODEX_README, START_HERE, docs/ACTIVE_DOCS.md, docs/PROJECT_STATE.md, docs/V2_BOUNDARY.md, plans/ROADMAP.md, and `plugins.md` entries only if they still present FP-0155 as absent/future-only after this slice.
9. Run focused validation, strict same-branch QA, final validation, closeout, commit, push, and open the PR.

## Validation and Acceptance

Required validation:

```bash
git diff --check
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

Acceptance is observable when exactly one FP-0155 file exists, FP-0156 remains absent, the explicit local adapter factory returns a `ReadOnlyMcpAuthorizationParserRouteDecisionDependency`, safe sentinels map into FP-0130/FP-0139/invalid-token challenge lanes as planned, output contains only route-safe fields, output contains no raw header/token material or token-derived fields, fixtures contain no real token examples or JWT-like examples, the shared proof-only leakage sanitizer remains strict, app construction and route code do not import or construct the adapter, default `buildApp()` and `/mcp` behavior remain unchanged, FP-0154 closeout freshness is corrected, and predecessor FP proof gates remain green.

## Idempotence and Recovery

This slice is additive and pure-domain. Re-running the factory and proof command should be deterministic. If validation finds a defect, patch this same branch and rerun required checks. If a proof bridge still treats FP-0155 as absent-only, patch only the exact successor bridge and rerun the proof ladder. If any failure requires default adapter construction, route behavior change, production token validation, token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, app submission, source mutation, or finance writes, stop and narrow scope instead of implementing that behavior.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0155-read-only-chatgpt-app-mcp-authorization-parser-local-adapter-implementation.md`
- FP-0154 closeout freshness patch
- `packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter.spec.ts`
- `tools/read-only-mcp-authorization-parser-local-adapter-implementation-proof.mjs`
- direct FP-0155/FP-0156 proof-gate bridge compatibility in prior parser proof commands
- directly stale active-doc/plugin freshness edits only if needed

No new route, migration, package script, fixture data file, public asset, screenshot, app-submission artifact, OpenAI API integration, provider integration, DB query, source mutation, finance write, or external communication is expected.

## Interfaces and Dependencies

Implemented adapter input boundary:

`{ authorizationHeader?: string | readonly string[] | null }`

Implemented adapter output boundary:

`ReadOnlyMcpAuthorizationParserRouteDecisionReadiness`

Permitted composition:

The adapter may call `classifyReadOnlyMcpAuthorizationHeader` and `deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness` inside the local adapter stack only. The adapter may not call routes, app construction, DB, provider, OpenAI, network, time, random, crypto, env, logger, token validation, JWT, JWKS, introspection, OAuth, or session APIs.

GitHub connector product behavior is out of scope. Routine `git` and `gh` CLI operations are allowed for repository and PR truth. Codex Security, ChatGPT Apps, OpenAI Developers, Browser, and Vercel project/deployment tooling are not needed for runtime action in this slice; official web docs are read-only context only.

## Outcomes & Retrospective

FP-0155 implemented the explicit pure-domain/local-only Authorization parser route-decision adapter factory. The adapter accepts only `{ authorizationHeader?: string | readonly string[] | null }`, composes the existing pure classifier with the existing route-safe decision derivation helper, passes only sanitized classification fields, returns exactly `ReadOnlyMcpAuthorizationParserRouteDecisionReadiness`, and exposes no raw header/token material, parser internals, or token-derived prefix/suffix/length/hash/digest/claims/decoded/fingerprint fields.

The implementation remains explicit-only. It is not constructed by `createContainer`, `createInMemoryContainer`, `buildApp`, app construction, or route registration. Default `/mcp` behavior, missing-token behavior, invalid-token challenge behavior outside the existing sanitized lane, and protected-resource metadata route behavior remain unchanged.

Proof and specs cover safe sentinel inputs only: absent header, empty header, unsupported scheme sentinel, malformed scheme sentinel, structural multiple values, safe Bearer-scheme credential-present sentinel, unsafe whitespace/control sentinel, and passthrough-attempt sentinel. Fixtures contain no real token examples, JWT-like examples, bearer-scheme credential examples, token echo/logging, or token-derived fingerprints.

Validation passed before this closeout entry. Because this closeout entry is a post-validation doc edit, the required post-closeout checks are `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` before the single commit.

Future FP-0156 may start only explicit app-construction injection of the already-implemented local adapter factory, adapter implementation correction, or proof-gate correction if this proof posture remains green. Public ChatGPT App submission, default adapter wiring, production token validation, OAuth/session/auth middleware, provider calls/integration, DB/schema/package work, source mutation, finance writes, and external communications remain blocked.

FP-0156 follow-up freshness confirmed PR #334 merged after this closeout: head SHA `8d05bbaa5fa19c80e630dea317f148cd81b85f97`, merge commit `a291881c0853ddb56af6a56cbad9e71184a75742`, GitHub `static` and `integration-db` checks green, and no post-merge QA required while current main matches the validated PR head/merge posture and CI remains green.
