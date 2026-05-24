# FP-0153 - Wire Read-only ChatGPT App/MCP Authorization Parser App Construction

## Purpose / Big Picture

FP-0153 implements the narrow post-FP-0152 app-construction wiring slice for the read-only ChatGPT App/MCP Authorization parser route-decision dependency. The goal is to let `buildApp({ container })` pass an explicitly supplied, route-safe parser decision dependency from the `AppContainer` into the existing local `/mcp` route registration while preserving default behavior when the dependency is absent.

This slice also hardens the route registration boundary so the parser route-decision dependency cannot be partially registered without the existing sanitized invalid-token challenge lane. The parser dependency remains explicit, optional, local-only, and externally supplied. FP-0153 does not construct the parser by default, does not construct the parser in `buildApp`, does not construct the parser inside `/mcp` routes, and does not add production token validation, token parser implementation, JWT decoding, JWKS fetching or caching, token introspection, OAuth, token or session storage, auth middleware, provider selection, provider integration, provider calls, DB queries, schema changes, package scripts, OpenAI API or model calls, public app behavior, Apps SDK iframe or resource implementation, app submission, source mutation, finance writes, external communications, public assets, generated public prose, or autonomous action.

Target phase: V2BU read-only ChatGPT App/MCP Authorization parser app-construction wiring and route-decision co-registration hardening.

## Progress

- [x] 2026-05-24T20:08:45Z - Preflight confirmed work on `codex/v2bu-read-only-chatgpt-app-mcp-authorization-parser-app-construction-wiring-local-v1`, clean worktree, authenticated `gh`, PR #331 merged to `main`, current `HEAD` and `origin/main` at `867544bda1f3cd7c44fc8103fa8579e80ef7103f`, local Postgres/object storage services available, FP-0152 present, FP-0153 absent before this plan, FP-0154 absent, and required proof tools present.
- [x] 2026-05-24T20:08:45Z - Baseline proof gates for FP-0152, FP-0151, FP-0150, FP-0149, FP-0148, FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0136, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100 passed before FP-0153 edits.
- [x] 2026-05-24T20:08:45Z - Official MCP Authorization, MCP Security Best Practices, and OpenAI Apps SDK Security & Privacy docs were used read-only as route-auth boundary context. No token-looking examples were copied into repository files, and no OpenAI API key setup, OpenAI API/model call, provider call, deployment action, public asset, app-submission action, or external communication was used.
- [x] 2026-05-24T20:08:45Z - Patched stale FP-0152 closeout wording to record PR #331 merge facts, green GitHub `static` and `integration-db` checks, same-branch QA freshness, and no post-merge QA requirement while current `main` matches the validated merge posture.
- [x] 2026-05-24T20:34:58Z - Added the optional `AppContainer` parser route-decision dependency port and `buildApp({ container })` pass-through. Default containers still leave the dependency absent.
- [x] 2026-05-24T20:34:58Z - Hardened `/mcp` route registration so a parser route-decision dependency requires the existing invalid-token challenge lane, which already requires missing-token challenge and protected-resource metadata evidence.
- [x] 2026-05-24T20:34:58Z - Added focused app/route specs for explicit pass-through, default preservation, registration fail-closed behavior, origin and missing-token precedence, no decision exposure, and protected-resource metadata preservation.
- [x] 2026-05-24T20:34:58Z - Added the direct FP-0153 proof bridge and exact FP-0153/FP-0154 plan acceptance helpers while preserving prior proof gates.
- [x] 2026-05-24T20:34:58Z - Refreshed directly stale active docs and `plugins.md` entries for FP-0153/V2BU posture and FP-0152 PR #331 closeout freshness.
- [x] 2026-05-24T20:34:58Z - Focused same-branch QA passed: `git diff --check`, FP-0153 and predecessor proof gates, domain MCP/auth Vitest suite (224 tests), and control-plane app/route Vitest suite (135 tests).
- [x] 2026-05-24T20:44:33Z - Full validation passed before final closeout edit: all required proof gates, focused domain/control-plane suites, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-05-24T20:49:45Z - Required post-closeout validation passed after the final closeout edit: `git diff --check`, FP-0153 direct proof, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [ ] Commit once, push, and open the PR.

## Surprises & Discoveries

FP-0152 route behavior was intentionally explicit-dependency-only, but it allowed the parser decision dependency to be supplied without a full invalid-token challenge lane. That was acceptable for the FP-0152 route-integration demo but is unsafe for FP-0153 app construction because it could invoke a parser route-decision dependency when there is no sanitized downstream invalid-token challenge lane to consume the result. FP-0153 narrows the registration boundary instead of changing runtime challenge semantics.

OpenAI Developers tooling was not used for API-key setup. Official web docs were used only for read-only protocol and security context. The active code remains the source of implementation truth.

Older proof gates used absence-only or direct-call pattern checks for route integration and app construction successor boundaries. FP-0153 updated those proof bridges narrowly to accept the exact FP-0153 plan and the hardened local `parserRouteDecisionDependency` gate while keeping FP-0154 absent and all production auth/provider/runtime work blocked.

## Decision Log

- 2026-05-24T20:08:45Z - App-construction wiring is included, but only as explicit container dependency pass-through from `AppContainer` into `registerReadOnlyAppMcpEndpointRoutes`.
- 2026-05-24T20:08:45Z - Route co-registration hardening is included. A parser route-decision dependency may be supplied only when the existing invalid-token challenge lane is fully registered.
- 2026-05-24T20:08:45Z - Parser construction inside `buildApp` is not included.
- 2026-05-24T20:08:45Z - Parser construction inside `/mcp` routes is not included.
- 2026-05-24T20:08:45Z - Default `buildApp()` behavior remains unchanged when the container dependency is absent.
- 2026-05-24T20:08:45Z - Production token-validation runtime cannot start after FP-0153.
- 2026-05-24T20:08:45Z - Provider selection cannot start after FP-0153; provider mode remains provider-neutral/deferred unless a separate complete provider-evidence plan exists.
- 2026-05-24T20:08:45Z - OAuth/session/auth middleware cannot start after FP-0153.
- 2026-05-24T20:08:45Z - Public ChatGPT App demo/submission cannot start after FP-0153.
- 2026-05-24T20:08:45Z - The app container dependency shape is `readOnlyAppMcpAuthorizationParserRouteDecision?: ReadOnlyMcpAuthorizationParserRouteDecisionDependency`; it is an explicit container field only, optional, and has no default construction, no env-based construction, and no provider, OpenAI, DB, network, time, random, or crypto construction path.
- 2026-05-24T20:08:45Z - `buildApp({ container })` may pass `container.readOnlyAppMcpAuthorizationParserRouteDecision` into route registration. `createContainer()` and `createInMemoryContainer()` do not construct or populate this field.
- 2026-05-24T20:08:45Z - If parser route-decision dependency is supplied without invalid-token challenge, route registration fails closed before `/mcp` routes are registered.
- 2026-05-24T20:08:45Z - The invalid-token challenge co-registration owner remains `assertInvalidTokenChallengeCoRegistration`; invalid-token challenge co-registration still requires missing-token challenge and protected-resource metadata evidence, and parser co-registration inherits those requirements.
- 2026-05-24T20:08:45Z - Parser route-decision objects must never be returned, logged, stored, echoed, hashed, digested, forwarded, fingerprinted, or exposed.
- 2026-05-24T20:08:45Z - Future FP-0154 may open only local parser route-decision adapter construction readiness, app-construction correction, or proof-gate correction. It must not implement production token validation, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, or app submission.
- 2026-05-24T20:34:58Z - Same-branch QA found proof-bridge drift in older predecessor gates. Corrections stayed in proof tooling only and did not change parser construction, parser route-decision semantics, default route behavior, protected-resource metadata behavior, token validation, provider, OAuth, DB, source, finance, or public app behavior.

## Context and Orientation

FP-0152 shipped explicit-dependency-injection route integration only. The `/mcp` route accepts an optional `readOnlyAppMcpAuthorizationParserRouteDecision` dependency and consumes only FP-0151 route-safe decision booleans. Routes do not construct or import the pure parser implementation. Default `/mcp` behavior remains unchanged when the dependency is absent. Parser decisions may influence only existing challenge or fail-closed lanes, missing-token precedence stays upstream, invalid-token challenge remains downstream of sanitized FP-0139 envelopes, and protected-resource metadata route behavior remains unchanged.

Before FP-0153, `AppContainer` does not expose the parser route-decision dependency port and `buildApp` does not pass the dependency from app construction into route registration. Also before FP-0153, route registration can receive a parser route-decision dependency without the invalid-token challenge lane. FP-0153 fixes both points without adding default parser construction or production auth behavior.

## Plan of Work

The implementation will add an optional app/container port:

`readOnlyAppMcpAuthorizationParserRouteDecision?: ReadOnlyMcpAuthorizationParserRouteDecisionDependency`

`buildApp({ container })` will pass that field into `registerReadOnlyAppMcpEndpointRoutes`. Default containers leave the field absent, so default `buildApp()` behavior and default `/mcp` behavior remain unchanged.

Route registration will compute a local parser dependency value only after co-registration checks. If the parser dependency is supplied while the invalid-token challenge lane is unavailable, registration throws a deterministic error before registering `/mcp`. If invalid-token challenge wiring is partially supplied, the existing invalid-token co-registration assertion remains the owner of the missing-token challenge and protected-resource metadata evidence requirements.

The route call sequence remains origin validation first, missing-token precedence second, parser dependency call only for Authorization-present requests after those gates, and sanitized invalid-token challenge output only through the existing invalid-token challenge response. Protected-resource metadata route behavior remains separate and unchanged.

## Concrete Steps

1. Patch stale FP-0152 closeout freshness with PR #331 merge facts and GitHub check state.
2. Create this exact FP-0153 plan before runtime code changes.
3. Add the optional parser route-decision dependency port type to `apps/control-plane/src/lib/types.ts`.
4. Pass `container.readOnlyAppMcpAuthorizationParserRouteDecision` through from `apps/control-plane/src/app.ts` into `registerReadOnlyAppMcpEndpointRoutes`.
5. Harden `apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts` so parser dependency registration requires the invalid-token challenge lane.
6. Add/adjust focused `app.spec.ts` and `routes.spec.ts` coverage for default preservation, explicit pass-through, unsafe partial registration failure, origin precedence, missing-token precedence, invalid-token downstream behavior, no decision exposure, and protected-resource metadata preservation.
7. Add exact FP-0153/FP-0154 helper fields in domain only as needed for proof bridge compatibility.
8. Add `tools/read-only-mcp-authorization-parser-app-construction-wiring-proof.mjs`.
9. Update existing proof bridges only for exact FP-0153 successor compatibility.
10. Refresh directly stale README, CODEX_README, START_HERE, ACTIVE_DOCS, PROJECT_STATE, V2_BOUNDARY, ROADMAP, or `plugins.md` entries only where they still present FP-0153 as absent/future-only after this implementation.
11. Run validation, same-branch QA, final validation, closeout, commit, push, and open the PR.

## Validation and Acceptance

Required validation:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts src/read-only-app-mcp-authorization-parser-contracts.spec.ts src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts src/read-only-app-mcp-authorization-parser.spec.ts src/read-only-app-mcp-authorization-parser-route-integration-readiness.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/app.spec.ts src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is observable when `AppContainer` exposes the optional dependency port, `buildApp({ container })` passes an explicitly supplied dependency through, default containers do not construct or populate it, route registration rejects parser dependency without the invalid-token challenge lane, existing invalid-token co-registration still requires missing-token challenge and protected-resource metadata evidence, origin rejection and missing-token precedence happen before any parser dependency call, present Authorization with full co-registration uses the existing sanitized invalid-token response, parser decision objects never appear in HTTP response bodies or logs, protected-resource metadata route behavior is unchanged, FP-0154 is absent, and the prior FP proof ladder remains green.

## Idempotence and Recovery

The parser route-decision dependency remains optional. Re-running `buildApp()` without it preserves existing default behavior. If validation finds a defect, patch this same branch and rerun the required checks. If a proof bridge still treats FP-0153 as absent-only, patch only the exact successor bridge and rerun the proof ladder. If any failure requires parser default construction, production token validation, token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, app submission, source mutation, or finance writes, stop and narrow scope instead of implementing that behavior.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0153-read-only-chatgpt-app-mcp-authorization-parser-app-construction-wiring.md`
- FP-0152 closeout freshness patch
- optional app container dependency type in `apps/control-plane/src/lib/types.ts`
- explicit pass-through in `apps/control-plane/src/app.ts`
- route co-registration hardening in `apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts`
- focused specs in `apps/control-plane/src/app.spec.ts` and `apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.spec.ts`
- exact FP-0153/FP-0154 proof helpers if needed
- `tools/read-only-mcp-authorization-parser-app-construction-wiring-proof.mjs`
- directly stale active-doc/plugin freshness edits only if needed

Replay and evidence posture: FP-0153 changes local app-construction wiring, route registration validation, tests, proof outputs, and docs only. It does not change mission state, ingest state, source registry state, CFO Wiki facts, finance answers, approvals, monitor findings, reports, or durable finance artifacts. No replay event is required because no mission-facing state transition or finance artifact mutation occurs. Proof output is the durable acceptance evidence for this technical slice.

Provenance, freshness, and limitations: official protocol/security docs are context only. Finance evidence remains the source of truth for product answers. FP-0153 produces no finance answer, no report, no public listing copy, no generated advice, no external communication, and no source mutation.

## Interfaces and Dependencies

`AppContainer` accepts:

`readOnlyAppMcpAuthorizationParserRouteDecision?: ReadOnlyMcpAuthorizationParserRouteDecisionDependency`

`buildApp({ container })` passes that optional field into `registerReadOnlyAppMcpEndpointRoutes`. The dependency is explicit, optional, synchronous, local-only, externally supplied, and route-safe. It is not constructed by `createContainer()`, `createInMemoryContainer()`, `buildApp`, or route code. It is not passed to protected-resource metadata route code.

GitHub connector product behavior is out of scope. Routine `git` and `gh` CLI operations are allowed for repository and PR truth.

## Outcomes & Retrospective

FP-0153 implemented the intended narrow app-construction pass-through and co-registration hardening slice. The optional app container port is present, `buildApp({ container })` forwards only an explicitly supplied route-safe parser decision dependency, and default `buildApp()` and `/mcp` behavior remain unchanged when the dependency is absent.

Route registration now fails closed if a parser route-decision dependency is supplied without the invalid-token challenge lane. Because invalid-token challenge co-registration still requires the missing-token challenge and protected-resource metadata evidence dependencies, parser co-registration inherits the full sanitized challenge lane. Origin rejection and missing-token precedence still happen before any parser dependency call. Present Authorization with full co-registration still maps through the existing sanitized invalid-token challenge response, and parser decision objects are not returned, logged, stored, echoed, hashed, digested, forwarded, fingerprinted, or exposed.

FP-0152 closeout freshness was corrected for PR #331 merge facts, including head SHA `ade9c5c63487505bc3698a5bec51161cfeb358dd`, merge commit `867544bda1f3cd7c44fc8103fa8579e80ef7103f`, green GitHub `static` and `integration-db` checks, same-branch QA no-issue/no-correction posture, and no post-merge QA requirement while current `main` matches the validated PR head/merge posture and CI remains green.

No parser construction, default parser wiring, production token validation, token parser implementation, JWT decoder, JWKS fetch/cache, token introspection, OAuth/session/auth middleware, provider selection implementation, provider integration, provider calls, DB query/schema/migration/package work, OpenAI API/model call, source mutation, finance write, public asset, generated public prose, app submission, external communication, or autonomous action was added. FP-0154 remains absent.

Focused validation before final closeout pass:

- `git diff --check` passed.
- FP-0153 direct proof and predecessor FP-0152 through FP-0100 proof ladder passed after exact successor bridge corrections.
- Domain focused Vitest suite passed: 21 files, 224 tests.
- Control-plane focused Vitest suite passed: 4 files, 135 tests.

Final full validation, commit, push, and PR creation remain pending at this checkpoint.

Full validation before the final closeout edit passed:

- `git diff --check` passed.
- All required FP-0153, predecessor FP, architecture, ChatGPT App/MCP, benchmark, bounded LLM, evidence app, document precision, and evidence index proof gates passed.
- Domain focused Vitest suite passed: 21 files, 224 tests.
- Control-plane focused Vitest suite passed: 4 files, 135 tests.
- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm test` passed: 8 tasks successful, including domain 52 files/470 tests, control-plane 138 files/807 tests, web 31 files/165 tests, and all other package suites.
- `pnpm ci:repro:current` passed, including temp-worktree install, static validation, build, integration DB test suite, and clean-tree checks.

Required post-closeout validation passed after the final closeout edit:

- `git diff --check` passed.
- `pnpm exec tsx tools/read-only-mcp-authorization-parser-app-construction-wiring-proof.mjs` passed.
- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm test` passed.
- `pnpm ci:repro:current` passed, including temp-worktree install, static validation, build, integration DB test suite, and clean-tree checks.

Commit, push, and PR creation remain pending at this checkpoint.
