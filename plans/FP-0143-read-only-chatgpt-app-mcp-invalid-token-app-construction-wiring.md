# Wire read-only ChatGPT App MCP invalid-token app construction

## Purpose / Big Picture

Target phase: V2BK read-only ChatGPT App/MCP invalid-token app-construction wiring.

FP-0143 is a narrow local-only/read-only implementation slice after shipped FP-0142 and FP-0141. The purpose is to add explicit app/container construction wiring for the existing invalid-token challenge dependency that already exists on the existing `/mcp` route-registration seam. The only runtime path opened by this plan is passing a pre-sanitized FP-0139 token-validation result envelope from `buildApp({ container })` into `registerReadOnlyAppMcpEndpointRoutes`.

This is not production token validation. It does not parse Authorization headers, parse token strings, decode JWTs, introspect tokens, implement OAuth, add token/session storage, add auth middleware, add routes, change GET `/mcp`, change protected-resource metadata route behavior, change missing-token behavior, add DB queries, add schema or migrations, add package scripts, call OpenAI APIs or models, call providers, mutate sources, write finance state, create public assets, or prepare app submission material.

## Progress

- [x] 2026-05-23T10:30:34Z - Invoked the repo-local `pocket-cfo-codex-operator` Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-23T10:30:34Z - Confirmed work is on `codex/v2bk-read-only-chatgpt-app-mcp-invalid-token-app-construction-wiring-local-v1`, PR #321 is merged, FP-0142 exists and is shipped, and FP-0143/FP-0144 are absent before this plan.
- [x] 2026-05-23T10:30:34Z - Ran baseline proof gates and focused domain/control-plane specs before edits; all required existing gates passed.
- [x] 2026-05-23T10:30:34Z - Reviewed official read-only protocol/platform context: MCP Authorization, MCP Security Best Practices, RFC 6750, OpenAI Apps SDK Authentication, and OpenAI Apps SDK Security & Privacy. OpenAI Developers exposed only API-key setup tooling, so official web docs were used.
- [x] 2026-05-23T10:30:34Z - Implemented explicit optional `AppContainer` dependency and `buildApp` forwarding into existing `/mcp` route registration.
- [x] 2026-05-23T10:30:34Z - Added route co-registration and Authorization-present guardrails without parsing or validating Authorization header material.
- [x] 2026-05-23T10:30:34Z - Added direct FP-0143 proof command, focused app/route specs, and proof-gate bridge compatibility for prior FP boundaries.
- [x] 2026-05-23T10:30:34Z - Refreshed directly stale active docs/plugin notes that still described FP-0143 as absent or future-only.
- [x] 2026-05-23T11:15:35Z - Ran final validation through the full proof ladder, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed before plan closeout.

## Surprises & Discoveries

The pre-edit local runtime proof still reports `fp0142Absent` as true while FP-0142 is present because the underlying helper treats the shipped FP-0142 sequencing plan as an allowed successor boundary. This is historical naming, not a failing gate.

The current `/mcp` route-registration seam already accepts `readOnlyAppMcpInvalidTokenChallengeResultEnvelope`, but default `buildApp()` does not pass it from the app container. FP-0143 therefore does not need a new route or a new adapter; it only needs an explicit construction path plus tighter co-registration and Authorization-present behavior around the existing seam.

OpenAI Developers tool discovery exposed only OpenAI Platform API-key setup actions. Those were not used. Official web docs were used read-only only for protocol/security context, with no OpenAI API/model call and no key setup.

Some older proof commands used "absent" or "blocked" field names for successor boundaries. FP-0143 kept those historical schema names green by proving the only successor behavior is exact local app-construction wiring and not production token validation, route expansion, or auth middleware.

## Decision Log

- 2026-05-23T10:30:34Z - FP-0143 will expose one optional container dependency named `readOnlyAppMcpInvalidTokenChallengeResultEnvelope` and will forward it from `buildApp({ container })` into `registerReadOnlyAppMcpEndpointRoutes`.
- 2026-05-23T10:30:34Z - Default `buildApp()` and default `/mcp` behavior must remain unchanged when the dependency is absent.
- 2026-05-23T10:30:34Z - Invalid-token challenge behavior remains explicit dependency only and consumes sanitized FP-0139 result envelopes only.
- 2026-05-23T10:30:34Z - Invalid-token challenge activation requires Authorization header presence, but the route must not parse, validate, store, log, echo, or treat that header as authentication.
- 2026-05-23T10:30:34Z - Missing-token challenge keeps precedence when Authorization is absent.
- 2026-05-23T10:30:34Z - Invalid-token wiring must be co-registered with missing-token challenge dependency and protected-resource metadata route-input evidence; missing either dependency fails closed during route registration.
- 2026-05-23T10:30:34Z - Protected-resource metadata route behavior remains separate and unchanged.
- 2026-05-23T10:30:34Z - GitHub connector product behavior, Figma/design generation, OpenAI Platform key setup, OpenAI APIs/models, provider/deployment/certification, public assets, source mutation, finance writes, and autonomous action are out of scope.
- 2026-05-23T10:30:34Z - Directly stale `START_HERE.md`, `docs/ACTIVE_DOCS.md`, `docs/PROJECT_STATE.md`, `plans/ROADMAP.md`, and `plugins.md` were refreshed only to record the FP-0143 local wiring boundary and keep FP-0144/production validation/public submission future-only.

## Context and Orientation

FP-0139 shipped sanitized local token-validation result envelopes. FP-0141 consumes those envelopes to build a local invalid-token challenge mapping on the existing `/mcp` route-registration seam. FP-0142 recorded the sequencing rules that must be preserved before app-construction wiring can start: Authorization-present activation, missing-token precedence, protected-resource metadata separation, FP-0139 result-envelope-only source posture, and dependency co-registration.

Official protocol context used for FP-0143:

- MCP authorization specification context covers protected-resource metadata discovery, `WWW-Authenticate` `resource_metadata`, scope challenge guidance, resource indicators, and invalid/expired token posture.
- MCP Security Best Practices: no token passthrough and audience/resource trust-boundary posture.
- RFC 6750: `invalid_request`, `invalid_token`, `insufficient_scope`, HTTP 400/401/403 posture, and missing-credentials challenge behavior without error detail.
- OpenAI Apps SDK Authentication: Apps SDK auth should conform to MCP authorization, host protected-resource metadata, and return `WWW-Authenticate` challenges for unauthenticated requests.
- OpenAI Apps SDK Security & Privacy: least privilege, server-side validation, no secrets or tokens in surfaced data, and rejecting expired or malformed tokens with 401 responses as future production context.

Replay implications are limited to checked-in plan/proof/spec/doc state. This slice does not change mission state, ingest state, finance answers, source registry state, reports, monitor results, approvals, or durable finance artifacts.

## Plan of Work

Create exactly one active plan at `plans/FP-0143-read-only-chatgpt-app-mcp-invalid-token-app-construction-wiring.md`.

Add a typed optional container dependency in `apps/control-plane/src/lib/types.ts`, forward it in `apps/control-plane/src/app.ts`, and keep `buildApp()` default behavior unchanged when absent.

Harden `apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts` so an invalid-token result envelope supplied without missing-token challenge co-registration or protected-resource metadata route-input evidence fails closed during route registration. The route must only emit the invalid-token challenge when Authorization is present; missing Authorization remains the missing-token lane.

Add focused tests in `apps/control-plane/src/app.spec.ts`, `routes.spec.ts`, and the invalid-token adapter specs as needed. Add one direct proof command at `tools/read-only-mcp-invalid-token-app-wiring-proof.mjs` with machine-readable JSON that proves the explicit dependency, forwarding, default unchanged posture, co-registration, Authorization-present activation, prior boundary preservation, and forbidden-scope absences.

Patch directly stale active docs/plugin notes only if they still claim FP-0143 is absent/future-only after this implementation.

## Concrete Steps

1. Add the optional `readOnlyAppMcpInvalidTokenChallengeResultEnvelope` app container dependency.
2. Forward the dependency from `buildApp({ container })` into existing `/mcp` route registration.
3. Apply route-registration co-registration checks for invalid-token envelope plus missing-token challenge plus protected-resource metadata route-input evidence.
4. Gate invalid-token emission on Authorization header presence without parsing the header.
5. Add app and route specs for default behavior, explicit forwarding, missing-token precedence, co-registration failures, Authorization-present activation, no new route paths, and no token/OAuth/auth widening.
6. Add `tools/read-only-mcp-invalid-token-app-wiring-proof.mjs`.
7. Update proof-gate bridges and directly stale docs/plugin wording only where required.
8. Run focused validation, full validation, closeout, and commit exactly once.

## Validation and Acceptance

Acceptance is observable when:

- FP-0143 exists and FP-0144 remains absent.
- `buildApp()` default `/mcp` behavior remains unchanged when no invalid-token dependency is supplied.
- `buildApp({ container })` forwards the explicit invalid-token result-envelope dependency into existing `/mcp` route registration.
- Invalid-token challenge emission requires Authorization header presence and explicit dependencies.
- Authorization-present requests are not treated as authenticated.
- Missing-token challenge wins when Authorization is absent.
- Invalid-token dependency without protected-resource metadata evidence fails closed during route registration.
- Invalid-token dependency without missing-token challenge co-registration fails closed during route registration.
- The invalid-token challenge consumes only sanitized FP-0139 result envelopes and rejects accepted and `missing_token` envelopes.
- GET `/mcp` 405, notification 202, Origin boundary, protected-resource metadata route behavior, missing-token challenge behavior, JSON-RPC refusal separation, and no-token-leakage posture are preserved.
- No production token validation, token parser, Authorization parser, JWT decoder, token introspection, OAuth implementation, token/session storage, auth middleware, evaluator/test-double route consumption, real token examples, JWT-like examples, Bearer material, token echo, token logging, DB query, schema migration, package script, OpenAI API/model call, provider external call, source mutation, or finance write is added.

Required validation commands:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-invalid-token-app-wiring-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-local-runtime-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-implementation-planning-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-result-envelope-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs
pnpm exec tsx tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs
pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-local-route-proof.mjs
pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-route-input-proof.mjs
pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-builder-proof.mjs
pnpm exec tsx tools/read-only-mcp-canonical-resource-auth-server-proof.mjs
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-readiness.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts src/app.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

If a post-validation closeout edit is made, rerun:

```bash
git diff --check
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

## Idempotence and Recovery

This slice is idempotent because it adds one optional container field, forwards that field once into existing route registration, and hardens existing explicit dependency checks. Rerunning registration with no invalid-token dependency preserves default route behavior.

If validation fails, do not widen scope. Do not add production token validation, token parsing, JWT decoding, introspection, OAuth/session/auth middleware, missing-token behavior changes, protected-resource metadata route changes, routes, DB/schema/package/data/OpenAI/provider/source/finance-write scope, or public app behavior. Patch only FP-0143 wiring/proof/spec issues on this branch or stop and recommend the smallest corrective slice.

Rollback is code-local: remove the optional container field, the buildApp forwarding line, the invalid-token co-registration guard, FP-0143 proof command, focused spec additions, and direct stale-doc refresh. No raw source file, uploaded evidence, persisted finance state, database schema, mission state, route path, or package script is changed by this plan.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0143-read-only-chatgpt-app-mcp-invalid-token-app-construction-wiring.md`
- `apps/control-plane/src/lib/types.ts`
- `apps/control-plane/src/app.ts`
- `apps/control-plane/src/app.spec.ts`
- `apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts`
- `apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.spec.ts`
- `apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts` if needed
- `tools/read-only-mcp-invalid-token-app-wiring-proof.mjs`
- proof-gate bridge helpers/specs only if required
- directly stale active docs/plugin notes only if required

Evidence and replay posture: this slice does not create finance evidence, source snapshots, finance answers, reports, approvals, monitor findings, or mission events. The proof artifact is a repository validation artifact only.

Provenance, freshness, and limitations: no finance source or CFO Wiki truth is read or changed. The invalid-token challenge source remains the sanitized FP-0139 result envelope and exposes local-only limitations.

Monitoring posture: F6 monitoring semantics are unchanged. No stored-state input contract, alert semantics, delivery path, or human-review boundary changes.

Workflow and environment posture: no `WORKFLOW.md`, stack-pack, package script, dependency, or environment variable change is expected.

## Interfaces and Dependencies

The new optional app construction dependency is:

```ts
readOnlyAppMcpInvalidTokenChallengeResultEnvelope?: unknown
```

It is intentionally `unknown` at the app container boundary so route registration and the FP-0141 adapter remain the only place that validates the sanitized FP-0139 envelope shape. This avoids importing or constructing token validators, parsers, JWT decoders, introspection clients, OAuth clients, session stores, DB clients, provider clients, OpenAI clients, source loaders, evidence stores, or auth middleware.

Runtime interfaces remain unchanged:

- `POST /mcp` remains the existing MCP JSON-RPC request entrypoint.
- `GET /mcp` remains HTTP 405 with `Allow: POST`.
- GET `/.well-known/oauth-protected-resource/mcp` remains the existing explicit-dependency protected-resource metadata route.
- FP-0130 missing-token challenge remains separate.
- FP-0141 invalid-token challenge adapter remains the sanitized FP-0139 envelope mapper.
- JSON-RPC refusal envelopes remain separate from HTTP challenge behavior.

## Outcomes & Retrospective

FP-0143 implemented local-only explicit app-construction wiring for the invalid-token challenge dependency. `AppContainer` now exposes an optional `readOnlyAppMcpInvalidTokenChallengeResultEnvelope`, `buildApp({ container })` forwards it into the existing `/mcp` route registration, and default `buildApp()` behavior remains unchanged when the dependency is absent.

The route registration now fails closed if the invalid-token envelope is provided without missing-token challenge co-registration or protected-resource metadata route-input evidence. Missing-token behavior keeps precedence when Authorization is absent, and invalid-token challenge emission requires Authorization header presence without parsing, validating, storing, logging, echoing, or treating that header as authentication.

The direct FP-0143 proof command and proof-gate bridge updates preserve FP-0142 sequencing, FP-0141 local runtime mapping, FP-0139 sanitized result-envelope source posture, FP-0130 missing-token challenge behavior, FP-0125 protected-resource metadata route behavior, FP-0107 route adapter posture, FP-0106 protocol envelope posture, and FP-0100 public security boundaries. FP-0144 remains absent.

Directly stale active docs/plugin notes were refreshed only to record that FP-0143 is now the shipped local app-construction wiring slice. No production token validation, token parser, Authorization parser, JWT decoder, introspection, OAuth/session/auth middleware, route expansion, new endpoint, DB query, schema/migration, package script, OpenAI API/model call, provider call, source mutation, finance write, public asset, listing copy, or submission material was added.

All required validation passed before closeout, including the full proof ladder, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. Because this closeout text was edited after validation, the required post-closeout subset remains to rerun: `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

Exactly what remains: production token-validation planning may start next only as a separate named Finance Plan. Public ChatGPT App submission should wait until production token validation, OAuth/session/auth middleware, provider readiness, and submission-specific security evidence are planned and implemented in later explicit slices.
