# FP-0152 - Read-only ChatGPT App/MCP Authorization Parser Route Integration

## Purpose / Big Picture

FP-0152 implements the narrow route-integration slice after merged FP-0151. The goal is to let the existing local `POST /mcp` route consume an explicitly injected, route-safe Authorization parser decision dependency, and only use that sanitized decision to choose already-existing challenge or fail-closed branches.

This is route-integration implementation only through explicit dependency injection. It is not default parser wiring, parser construction inside routes, production token validation, token parser implementation, JWT decoding, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider selection, provider integration, provider calls, token/session storage, DB/schema/package work, OpenAI API/model integration, Apps SDK iframe/resource implementation, public ChatGPT App implementation, app submission, remote deployment, source mutation, finance write, external communication, or autonomous action.

Target phase: V2BT read-only ChatGPT App/MCP Authorization parser route-integration implementation.

## Progress

- [x] 2026-05-24T18:18:03Z - Preflight confirmed work on `codex/v2bt-read-only-chatgpt-app-mcp-authorization-parser-route-integration-implementation-local-v1`, clean worktree, authenticated `gh`, PR #330 merged to `main`, current `HEAD` and `origin/main` at `11bff71bc24970e2ca629ddc7320a5b41221cde6`, local Postgres/object storage services available, FP-0151 present, FP-0152 absent before this plan, FP-0153 absent, and required proof tools present.
- [x] 2026-05-24T18:18:03Z - Baseline proof gates for FP-0151, FP-0150, FP-0149, FP-0148, FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0136, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100 passed before FP-0152 edits.
- [x] 2026-05-24T18:18:03Z - Official MCP Authorization, MCP Security Best Practices, RFC 6750, and OpenAI Apps SDK Authentication, Security & Privacy, testing, and submission docs were used read-only as route-integration context. OpenAI Developers exposed only API-key setup tooling in this local thread, so no API-key setup, OpenAI API/model call, provider call, deployment action, public asset, app-submission action, or external communication was used.
- [x] 2026-05-24T18:36:53Z - Implemented optional explicit `readOnlyAppMcpAuthorizationParserRouteDecision` route dependency without constructing or importing the pure parser inside `/mcp` routes.
- [x] 2026-05-24T18:36:53Z - Added focused route/domain specs, FP-0152 exact-plan/FP-0153-absence helpers, direct FP-0152 proof tooling, and exact successor proof-gate bridge compatibility.
- [x] 2026-05-24T18:36:53Z - Refreshed directly stale active docs/plugins where they still presented FP-0152 as absent or FP-0151 as the active boundary after this slice.
- [x] 2026-05-24T18:54:10Z - Focused validation, strict same-branch QA, proof ladder, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed before this closeout edit. Same-branch QA found one stale protected-resource metadata builder assertion about `WWW-Authenticate` header-write count after FP-0152 proof bridge expansion; it was corrected in scope and rerun. This closeout edit requires the mandated post-closeout rerun before the single commit, push, and PR creation.
- [x] 2026-05-24T20:08:45Z - Post-merge freshness polish confirmed PR #331 merged to `main` with head SHA `ade9c5c63487505bc3698a5bec51161cfeb358dd` and merge commit `867544bda1f3cd7c44fc8103fa8579e80ef7103f`. GitHub PR and push `static` and `integration-db` checks were green. Post-merge same-branch QA found no issues and made no correction. No post-merge QA is required when current `main` matches the validated PR head/merge posture and CI remains green.

## Surprises & Discoveries

PR #330 merge truth matched the prompt: `gh pr view 330` confirmed merged state, head SHA `9521cdc0db6138cf0d43d63fd62b983fb0748eaf`, and merge commit `11bff71bc24970e2ca629ddc7320a5b41221cde6`. `gh pr checks 330` confirmed static and integration-db checks green. The FP-0151 closeout needed freshness polish to record those facts.

OpenAI Developers tooling exposed API-key setup surfaces rather than read-only docs. Official MCP, RFC, and OpenAI web docs were used read-only instead.

The existing proof-only no-token-leakage scanner treated whole-file dirty route specs with the established safe `authorization-present-local-only` placeholder as suspicious once FP-0152 changed that route spec. The shared proof-only sanitizer now normalizes that exact safe placeholder while still leaving credential-shaped material unsanitized and rejected.

Strict same-branch QA found no route behavior defect. It found one stale protected-resource metadata builder proof assertion that counted `WWW-Authenticate` header writes too narrowly after route proof bridge expansion. The correction now asserts the exact bounded challenge header writes and keeps protected-resource metadata route behavior unchanged.

PR #331 merge truth matched the FP-0152 closeout posture: `gh pr view 331` confirmed merged state, head SHA `ade9c5c63487505bc3698a5bec51161cfeb358dd`, and merge commit `867544bda1f3cd7c44fc8103fa8579e80ef7103f`. `gh pr checks 331` confirmed GitHub `static` and `integration-db` checks green for both pull request and push events. Post-merge same-branch QA found no issues and made no correction, so no post-merge QA branch is required while current `main` remains at the validated merge commit and CI remains green.

## Decision Log

- 2026-05-24T18:18:03Z - Route integration is included in FP-0152, but only as explicit dependency-injection route integration.
- 2026-05-24T18:18:03Z - Parser construction inside the route is not included. The route must not import or call `parseReadOnlyMcpAuthorizationHeader`.
- 2026-05-24T18:18:03Z - Default `/mcp` behavior remains unchanged when the parser decision dependency is absent.
- 2026-05-24T18:18:03Z - The route may consume only route-safe parser decision output from FP-0151 readiness. It must not consume raw parser internals, evaluator/test-double output, provider output, decoded tokens, token claims, token fingerprints, or raw Authorization material.
- 2026-05-24T18:18:03Z - Production token-validation runtime cannot start after FP-0152.
- 2026-05-24T18:18:03Z - Provider selection cannot start after FP-0152; provider mode remains provider-neutral/deferred unless a later complete provider-evidence plan exists.
- 2026-05-24T18:18:03Z - OAuth/session/auth middleware cannot start after FP-0152.
- 2026-05-24T18:18:03Z - Public ChatGPT App demo/submission cannot start after FP-0152.
- 2026-05-24T18:18:03Z - Proof-gate wording: FP-0152 is explicit-dependency-injection route integration only; parser construction inside the route is excluded; default `/mcp` behavior remains unchanged when the dependency is absent; route may consume only route-safe parser decision outputs; raw parser internals are excluded; local origin validation runs first; missing-token challenge for undefined Authorization remains before the parser dependency call; malformed and unsupported parser decisions route to the existing sanitized invalid-token challenge; production token-validation runtime remains blocked; provider selection remains blocked; provider calls remain blocked; provider integration remains blocked; token parser implementation remains blocked; JWT decoder implementation remains blocked; JWKS fetching/caching remains blocked; token introspection remains blocked; OAuth/session/auth middleware remains blocked; token/session storage remains blocked; auth middleware remains blocked; protected-resource metadata route behavior remains unchanged.
- 2026-05-24T18:18:03Z - Future FP-0153 may open only app-construction wiring for injecting the already-implemented route decision dependency, route-integration correction, or proof-gate correction. FP-0152 preserves FP-0151 route readiness, FP-0150 route sequencing, FP-0149 parser implementation, FP-0148 readiness, FP-0147 provider-selection evidence, FP-0146 parser contracts, FP-0145 runtime contracts, FP-0144 production token-validation sequencing, FP-0143 app wiring, FP-0142 route sequencing, FP-0141 invalid-token local runtime, FP-0139 result envelopes, FP-0130 missing-token challenge, FP-0125 protected-resource metadata route, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 security boundary.
- 2026-05-24T18:36:53Z - Route integration consumes only injected route-safe decision booleans and maps parser decision failures to existing challenge/fail-closed branches; it never returns or logs the decision object.
- 2026-05-24T18:36:53Z - Successor proof-gate bridge compatibility is limited to the exact FP-0152 route-integration plan while FP-0153 remains absent.
- 2026-05-24T18:54:10Z - Closeout recommendation: app-construction wiring for injecting the already-implemented parser route-decision dependency may start next only as a narrow FP-0153. Route-integration correction, parser material-observation correction, provider-selection evidence correction, and one-off proof-gate correction are not needed from this FP-0152 validation posture. Public ChatGPT App submission must wait.
- 2026-05-24T20:08:45Z - Post-merge closeout correction records PR #331 as merged and current `main` as matching the validated merge posture. No separate polish branch or post-merge QA branch is required.

## Context and Orientation

FP-0151 shipped route-integration implementation-readiness and proof planning only. It explicitly left `/mcp` parser consumption absent, defined the route-safe decision contract, and allowed a later FP-0152 implementation slice only if explicit dependency injection preserved missing-token precedence, downstream invalid-token challenge posture, no-token-leakage posture, and protected-resource metadata separation.

Current route truth before FP-0152: `apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts` validates local origin first, emits the injected FP-0130 missing-token challenge when `Authorization` is undefined and the missing-token dependency is present, emits the injected FP-0141/FP-0143 invalid-token challenge when `Authorization` is present and the invalid-token dependency is present, fails closed with the existing no-validation response when explicit missing-token mode sees `Authorization` but no invalid-token dependency, and otherwise dispatches to the service. GET `/mcp` remains 405 with `Allow: POST`.

## Plan of Work

The implementation will add a pure-domain dependency type:

`ReadOnlyMcpAuthorizationParserRouteDecisionDependency`

The dependency input is `{ authorizationHeader?: string | readonly string[] | null }`. The output is the FP-0151 route-safe `ReadOnlyMcpAuthorizationParserRouteDecisionReadiness` object. The route may pass the request header value already in route scope to the injected dependency, must not retain or log it, and must never return the decision object in HTTP responses.

The route sequence is:

1. Validate local Origin first.
2. If `Authorization` is undefined and the missing-token dependency exists, emit the existing missing-token challenge before calling the parser dependency.
3. Only after those gates, call the optional parser route-decision dependency when `Authorization` is present.
4. If the parser decision indicates malformed/unsupported parser output or credential material observed and the invalid-token challenge dependency is present, emit the existing sanitized invalid-token challenge response.
5. If `Authorization` is present, missing-token mode is active, and no invalid-token challenge dependency is present, return the existing fail-closed no-validation response.
6. Otherwise keep the existing `service.handle` path.
7. GET `/mcp` and protected-resource metadata route behavior remain unchanged.

## Concrete Steps

1. Patch FP-0151 closeout freshness with PR #330 merge facts and GitHub check state.
2. Create this FP-0152 plan before code changes.
3. Add the route decision dependency type in the domain route-integration readiness module.
4. Add the optional `readOnlyAppMcpAuthorizationParserRouteDecision` dependency to `registerReadOnlyAppMcpEndpointRoutes`.
5. Use the injected route-safe decision only to choose existing invalid-token challenge or fail-closed lanes.
6. Add route specs for dependency-absent behavior, origin precedence, missing-token precedence, sanitized invalid-token challenge routing, fail-closed no-validation, service path preservation, GET preservation, metadata preservation, and response no-leakage.
7. Add exact FP-0152/FP-0153 proof-gate helpers and a direct FP-0152 proof command.
8. Update existing proof bridges only where needed for exact FP-0152 successor compatibility.
9. Refresh directly stale active docs/plugins only where they still call FP-0151 active or FP-0152 absent.
10. Run validation, same-branch QA, final validation, closeout, commit, push, and open the PR.

## Validation and Acceptance

Required validation:

```bash
git diff --check
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
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts src/app.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is observable when route specs show parser dependency absence preserves existing behavior, parser dependency is not called before origin or missing-token precedence, malformed/unsupported and credential-observed decisions route only to the existing injected invalid-token challenge, present Authorization with missing-token mode but no invalid-token dependency stays fail-closed, and no response/log/proof output exposes parser decisions or credential material.

## Idempotence and Recovery

The route dependency is optional. Re-running route registration without the dependency preserves default behavior. If validation finds a defect, patch this same branch and rerun the required checks. If proof-gate bridge compatibility fails because a prior proof still treats FP-0152 as absent-only, patch only the exact successor bridge and rerun the proof ladder. If any proof failure requires production token validation, provider calls, OAuth/session/auth middleware, schema/package work, public app behavior, or token parsing, stop and narrow scope instead of implementing that behavior.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0152-read-only-chatgpt-app-mcp-authorization-parser-route-integration-implementation.md`
- FP-0151 closeout freshness patch
- optional route dependency in `apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts`
- focused route specs in `apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.spec.ts`
- route decision dependency type and proof helpers in domain
- `tools/read-only-mcp-authorization-parser-route-integration-implementation-proof.mjs`
- directly stale active-doc/plugin freshness edits only if needed

Replay and evidence posture: FP-0152 changes local route control flow and proof outputs only. It does not change mission state, ingest state, source registry state, CFO Wiki facts, finance answers, approvals, monitor findings, reports, or durable finance artifacts. No replay event is required because no mission-facing state transition or finance artifact mutation occurs. Proof output is the durable acceptance evidence for this technical slice.

Provenance, freshness, and limitations: official protocol/security docs are context only. Finance evidence remains the source of truth for product answers. FP-0152 produces no finance answer, no report, no public listing copy, no generated advice, no external communication, and no source mutation.

## Interfaces and Dependencies

`registerReadOnlyAppMcpEndpointRoutes` accepts:

`readOnlyAppMcpAuthorizationParserRouteDecision?: ReadOnlyMcpAuthorizationParserRouteDecisionDependency`

The dependency is explicit, optional, synchronous, local-only, and deterministic. It receives only `{ authorizationHeader }` from route scope and returns the FP-0151 route-safe decision. It is not constructed by the route, not wired into default app construction, and not passed to protected-resource metadata route code.

GitHub connector product behavior is out of scope. Routine `git` and `gh` CLI operations are allowed for repository and PR truth.

## Outcomes & Retrospective

FP-0152 implemented the read-only ChatGPT App/MCP Authorization parser route-integration slice through explicit dependency injection. The route accepts an optional `readOnlyAppMcpAuthorizationParserRouteDecision` dependency, never constructs or imports the pure parser implementation, preserves default `/mcp` behavior when the dependency is absent, keeps local origin validation and missing-token precedence upstream, maps parser failure/credential-observed decisions only to the existing sanitized invalid-token challenge lane when that dependency is injected, and leaves protected-resource metadata behavior unchanged.

No production token validation, provider selection, provider integration, provider calls, token parser, JWT decoder, JWKS fetch/cache, token introspection, OAuth/session/auth middleware, token/session storage, DB/schema/package work, OpenAI API/model call, public asset, listing copy, generated public prose, app submission, source mutation, finance write, external communication, or autonomous action was added. FP-0153 remained absent at FP-0152 closeout and may start only as the narrow app-construction wiring and route co-registration hardening slice named by a separate Finance Plan.

Validation passed for PR #331 before merge, including the direct FP-0152 proof, successor proof bridges, prior boundary proof ladder, focused route/domain specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. GitHub `static` and `integration-db` checks were green, PR #331 merged, and no post-merge QA is required when current `main` matches the validated PR head/merge posture and CI remains green.
