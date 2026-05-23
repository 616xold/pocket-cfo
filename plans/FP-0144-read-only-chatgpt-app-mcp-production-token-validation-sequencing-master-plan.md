# Plan read-only ChatGPT App MCP production token-validation sequencing

## Purpose / Big Picture

Target phase: V2BL read-only ChatGPT App/MCP production token-validation sequencing.

FP-0144 is a docs-and-plan plus proof-gate compatibility only slice after shipped FP-0143. The goal is to decide whether and how future production token-validation runtime work can be sequenced without breaking the local-only FP-0143 invalid-token app-construction wiring, FP-0141 invalid-token challenge mapping, FP-0139 token-validation result envelopes, FP-0130 missing-token challenge, FP-0125 protected-resource metadata route, FP-0107 route adapter, FP-0106 protocol envelope, or FP-0100 public security boundaries.

FP-0144 plans future production token-validation sequencing only. FP-0144 does not implement production token validation. FP-0144 does not parse Authorization headers. FP-0144 does not parse tokens, decode JWTs, introspect tokens, fetch JWKS, implement OAuth, add token/session storage, add auth middleware, change `/mcp` route behavior, change missing-token behavior, change invalid-token challenge behavior, change protected-resource metadata route behavior, add DB queries, add schemas, add migrations, add package scripts, call OpenAI APIs or models, call providers, mutate sources, write finance state, create public assets, generate public prose, or prepare app submission material.

Production token-validation runtime cannot start from current repo truth. The next implementation slice should be runtime contracts and proof-hardening only, because provider/auth-server selection, canonical resource posture, issuer/audience/resource/scope requirements, org/company binding, and no-token-leakage gates are not yet proven at runtime depth.

## Progress

- [x] 2026-05-23T12:30:29Z - Invoked the repo-local `pocket-cfo-codex-operator` Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-23T12:30:29Z - Confirmed work is on `codex/v2bl-read-only-chatgpt-app-mcp-production-token-validation-sequencing-master-plan-local-v1`, PR #322 is merged, FP-0143 exists and is shipped, FP-0144 is absent, FP-0145 is absent, and the worktree started clean.
- [x] 2026-05-23T12:30:29Z - Ran the pre-edit planning gate: `/mcp` route adapter proof, protected-resource metadata route proof, missing-token challenge proof, FP-0143 app-wiring proof, FP-0141 invalid-token local-runtime proof, FP-0139 result-envelope proof, relevant proof tools, and focused domain/control-plane specs all passed before edits.
- [x] 2026-05-23T12:36:49Z - Reviewed official read-only protocol/platform context for planning only. OpenAI Developers read-only docs tooling was not exposed for this slice, and OpenAI Platform key setup was not used; official web docs were used instead.
- [x] 2026-05-23T12:36:49Z - Created the exact FP-0144 plan, direct production token-validation sequencing proof command, proof-gate bridge helpers/specs, and directly stale active docs refresh. `plugins.md` was checked and did not need a direct refresh.
- [x] 2026-05-23T12:56:09Z - Ran final validation through `git diff --check`, all required proof tools, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed before this closeout edit.

## Surprises & Discoveries

The pre-edit proof gate is green, but current repo truth intentionally stops at local preview behavior. FP-0143 proves explicit app-construction wiring for a sanitized invalid-token result-envelope dependency; it does not prove any production validation source, parser, decoder, introspection client, JWKS cache, issuer/audience/resource validator, scope checker, subject/org/company lookup, revocation store, replay store, OAuth flow, token/session store, auth middleware, route behavior change, DB backing, remote host, public app, or submission path.

Some older proof fields still use historical successor names such as "absent" while accepting exact shipped successor plans. FP-0144 should keep those proofs green by adding an explicit docs-only bridge instead of changing runtime behavior.

## Decision Log

- 2026-05-23T12:36:49Z - Production token-validation runtime cannot start from current repo truth. FP-0144 authorizes planning and proof-gate compatibility only.
- 2026-05-23T12:36:49Z - JWT/JWKS versus opaque-token introspection remains unresolved. Provider-neutral sequencing is the FP-0144 decision until provider, authorization-server, issuer, audience/resource, scope, revocation, and org/company binding evidence is selected and proven.
- 2026-05-23T12:36:49Z - Authorization header parsing cannot start before provider, authorization-server, canonical resource, and no-token-leakage gates are proven. A future parser contract may be planned, but no parser implementation opens here.
- 2026-05-23T12:36:49Z - Canonical resource URI, protected-resource metadata, resource indicators, authorization server discovery, issuer, audience, scope, org/company binding, and company selector posture are not sufficient yet. Future work must prove them before runtime validation.
- 2026-05-23T12:36:49Z - JWKS fetching/caching, introspection, revocation, replay detection, clock skew, key rotation, issuer validation, audience/resource validation, and scope minimization are prerequisites, not implementation in this plan.
- 2026-05-23T12:36:49Z - One more local proof-hardening and runtime-contract slice is required before runtime validation can open.
- 2026-05-23T12:36:49Z - FP-0139 result envelopes remain the only runtime output contract for future validation decisions. Invalid-token challenge emission remains downstream of FP-0139 sanitized envelopes.
- 2026-05-23T12:36:49Z - Missing-token behavior stays separate. `missing_token` remains the FP-0130 lane; missing_token remains the FP-0130 lane and must not be converted into invalid-token behavior.
- 2026-05-23T12:36:49Z - No-token-leakage remains enforced in logs, docs, proof output, examples, error bodies, structured tool results, and any future challenge payload.
- 2026-05-23T12:36:49Z - FP-0145 remains absent. FP-0145 should not open production runtime implementation; if opened later, it should be another narrow runtime-contract and proof-hardening slice unless FP-0144 follow-up proof says otherwise.
- 2026-05-23T12:36:49Z - GitHub connector product behavior, provider/certification/deployment execution, public ChatGPT App behavior, public app submission, OpenAI API/model use, source mutation, finance writes, external communications, and autonomous action remain out of scope.

## Context and Orientation

FP-0139 shipped local/proof-only sanitized token-validation result envelopes. FP-0141 shipped local invalid-token challenge mapping from those envelopes. FP-0142 planned invalid-token route integration sequencing. FP-0143 shipped explicit app-construction wiring so `buildApp({ container })` can pass the sanitized invalid-token result-envelope dependency into existing `/mcp` route registration while preserving default behavior when absent.

Current repo truth after FP-0143:

- `POST /mcp` remains the existing local MCP JSON-RPC route.
- GET `/mcp` remains unchanged.
- GET `/.well-known/oauth-protected-resource/mcp` remains the existing local explicit-dependency protected-resource metadata route.
- Missing-token challenge behavior remains separate and has precedence when Authorization is absent.
- Invalid-token challenge behavior activates only from an explicit sanitized FP-0139 result-envelope dependency when Authorization is present.
- JSON-RPC refusal behavior remains separate from HTTP challenge behavior.
- There is no production token validation, Authorization parser, token parser, JWT decoder, token introspection, JWKS fetch/cache, OAuth/session/auth middleware, route expansion, DB work, provider call, OpenAI call, public app behavior, or submission path.

Official research used for this plan:

- MCP Authorization - protected-resource metadata discovery, `WWW-Authenticate` metadata reference posture, resource indicators, audience/resource binding, invalid or expired token challenge posture, and insufficient-scope context.
- MCP Security Best Practices: token passthrough prohibition, audience/resource validation, confused-deputy prevention, least-privilege posture, and metadata URL trust boundaries.
- RFC 6750: bearer challenge error vocabulary for `invalid_request`, `invalid_token`, and `insufficient_scope`; missing-credential versus failed-credential separation; and 400/401/403 posture.
- RFC 8707: resource indicators and audience restriction context for future token requests and validation.
- RFC 9728: OAuth protected resource metadata and challenge-driven metadata discovery context.
- OpenAI Apps SDK Authentication: MCP authentication challenge plumbing, protected-resource metadata references, and future Apps SDK auth context.
- OpenAI Apps SDK Security & Privacy: least privilege, server-side checks, privacy posture, and no secret or token leakage in surfaced data.

These references are planning context only. They are not runtime source of truth, no external call was made by product code, and no token examples from those docs are copied into this repository.

## Plan of Work

Create exactly one active Finance Plan at `plans/FP-0144-read-only-chatgpt-app-mcp-production-token-validation-sequencing-master-plan.md`.

Add one direct proof command at `tools/read-only-mcp-production-token-validation-sequencing-proof.mjs` that prints machine-readable JSON and proves FP-0144 is docs-and-plan/proof-gate only, accepts exactly one FP-0144 path, keeps FP-0145 absent, records JWT/JWKS versus introspection/provider-neutral decisions, records Authorization parser deferral, records issuer/audience/resource/scope/org/company binding prerequisites, maps future failure states to FP-0139 envelopes, preserves missing-token separation, preserves invalid-token challenge downstream posture, proves no-token-leakage, and preserves prior FP-0143/0142/0141/0140/0139/0136/0130/0125/0107/0106/0100 boundaries.

Bridge minimum proof helpers/specs under `packages/domain/src/read-only-app-mcp-token-validation*.ts` so the repository accepts exactly this FP-0144 docs-only sequencing plan while still rejecting duplicate FP-0144 paths and any FP-0145 path.

Refresh directly stale active docs or plugin notes only if they still state FP-0144 is absent/future-only in a way that conflicts with this shipped planning record. Do not update runtime modules, routes, metadata behavior, DB schema, package scripts, or token/OAuth/auth implementation code.

## Concrete Steps

1. Keep work on `codex/v2bl-read-only-chatgpt-app-mcp-production-token-validation-sequencing-master-plan-local-v1`.
2. Create the exact FP-0144 plan file.
3. Add proof-only domain helpers/specs for exact FP-0144 path acceptance, FP-0145 absence, required planning topics, and FP-0139 failure-state mapping.
4. Add `tools/read-only-mcp-production-token-validation-sequencing-proof.mjs`.
5. Update existing proof-gate bridge allowlists/tools only where needed so prior shipped proofs remain green with this docs-only FP-0144 slice.
6. Refresh directly stale `START_HERE.md`, `docs/ACTIVE_DOCS.md`, `docs/PROJECT_STATE.md`, `docs/V2_BOUNDARY.md`, `plans/ROADMAP.md`, and `plugins.md` only if needed.
7. Run focused validation and patch same-branch proof/doc issues only.
8. Run full final validation, close out this plan, rerun the required post-closeout subset if the closeout changes files, commit exactly once, push, and create the PR.

## Validation and Acceptance

Acceptance is observable when:

- Exactly one FP-0144 file exists: `plans/FP-0144-read-only-chatgpt-app-mcp-production-token-validation-sequencing-master-plan.md`.
- FP-0145 remains absent.
- FP-0144 is docs-and-plan/proof-gate only.
- Planning text includes JWT/JWKS versus opaque-token introspection deferral and provider-neutral sequencing.
- Planning text includes canonical resource URI, protected-resource metadata, resource indicators, authorization server discovery, issuer, audience, scope, org/company binding, JWKS fetching/caching, introspection, revocation, replay detection, clock skew, key rotation, issuer validation, audience/resource validation, and scope minimization prerequisites.
- Planning text maps `missing_token`, `malformed_authorization`, `malformed_token`, `invalid_token`, `expired_token`, `revoked_token`, `wrong_audience`, `wrong_resource`, `wrong_scope`, `insufficient_scope`, `wrong_org`, `wrong_company`, `replayed_token`, `token_passthrough_attempt`, `unsupported_token_type`, and `validation_service_unavailable` states to FP-0139 result envelopes.
- FP-0139 result envelopes remain the only runtime output contract.
- Missing-token behavior stays separate.
- Invalid-token challenge emission remains downstream of FP-0139 sanitized envelopes.
- Production token validation remains unimplemented.
- Authorization parser, token parser, JWT decoder, token introspection, JWKS fetch, OAuth implementation, token/session storage, and auth middleware remain unimplemented.
- `/mcp` route behavior, missing-token behavior, invalid-token challenge behavior, and protected-resource metadata route behavior remain unchanged.
- No missing-token behavior change, invalid-token challenge behavior change, or protected-resource metadata route behavior change is authorized.
- No real token examples, JWT-like examples, Bearer material, token echo, token logging, DB queries, schema migrations, package scripts, OpenAI API/model calls, provider calls, source mutation, finance writes, public assets, generated public prose, app submission, or autonomous action are added.
- Prior FP-0143, FP-0142, FP-0141, FP-0140, FP-0139, FP-0136, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100 boundaries remain green.

Validation commands:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts
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

This slice is idempotent because it adds one exact plan path, one direct proof command, proof-only domain helpers/specs, narrow proof-gate allowlist bridges, and directly stale docs refresh only if needed. Re-running the proof command should continue to accept exactly this FP-0144 file, reject duplicate FP-0144 files, and reject any FP-0145 file.

If validation fails, do not widen scope. Do not implement production token validation, Authorization parser, token parser, JWT decoder, token introspection, JWKS fetch/cache, OAuth/session/auth middleware, DB/storage, route behavior, missing-token behavior, invalid-token behavior, protected-resource metadata route behavior, remote deployment, public app behavior, submission, provider calls, OpenAI calls, source mutation, or finance writes. Patch only the FP-0144 docs/proof bridge on this branch, or stop and recommend the smallest corrective slice named by the failed gate.

Rollback is documentation/proof-only: remove the FP-0144 plan, direct proof command, proof-only helpers/spec additions, allowlist bridge entries, and active docs/plugin wording refresh. No raw source file, uploaded evidence, persisted finance state, database schema, route behavior, app construction, package script, provider state, OpenAI state, or public asset is mutated by this plan.

## Artifacts and Notes

Primary artifacts:

- `plans/FP-0144-read-only-chatgpt-app-mcp-production-token-validation-sequencing-master-plan.md`
- `tools/read-only-mcp-production-token-validation-sequencing-proof.mjs`
- proof-gate helpers/specs under `packages/domain/src/read-only-app-mcp-token-validation*.ts`
- existing proof tool bridge compatibility edits only where required
- directly stale active docs/plugin refresh only where required

Failure-mode mapping to FP-0139 result envelopes:

| Future state | FP-0139 envelope failure | Posture |
| --- | --- | --- |
| `missing_token` | `missing_token` | Separate FP-0130 missing-token lane; no invalid-token challenge. |
| `malformed_authorization` | `malformed_authorization` | Future failed-credential lane after a separately planned parser contract. |
| `malformed_token` | `malformed_authorization` | Future malformed credential lane without token echo. |
| `invalid_token` | `invalid_token` | Downstream invalid-token challenge after sanitized envelope only. |
| `expired_token` | `expired_token` | Downstream invalid-token challenge after sanitized envelope only. |
| `revoked_token` | `revoked_token` | Downstream invalid-token challenge after sanitized envelope only. |
| `wrong_audience` | `wrong_audience` | Fail closed after audience/resource proof. |
| `wrong_resource` | `wrong_resource` | Fail closed after canonical resource proof. |
| `wrong_scope` | `insufficient_scope` | Future least-privilege scope challenge posture. |
| `insufficient_scope` | `insufficient_scope` | Future least-privilege scope challenge posture. |
| `wrong_org` | `wrong_org` | Fail closed after authenticated org binding proof. |
| `wrong_company` | `company_binding_mismatch` | Fail closed after authenticated company binding proof. |
| `replayed_token` | `replay_or_nonce_failure` | Fail closed after replay store proof. |
| `token_passthrough_attempt` | `invalid_token` | Fail closed and do not forward raw credential material. |
| `unsupported_token_type` | `unsupported_validation_mode` | Fail closed until selected provider/token mode is proven. |
| `validation_service_unavailable` | `production_validation_unavailable` | Fail closed and expose limitation without provider detail. |

Evidence and replay posture: this is planning plus proof-gate compatibility. It does not change mission state, ingest sources, source registry state, CFO Wiki finance facts, finance answers, reports, approvals, monitor findings, or durable finance artifacts. Replay implications are covered by the explicit no-runtime/no-mission-state posture and machine-readable proof output. Any future runtime slice must record replay behavior or a named reason why replay is not applicable.

Provenance, freshness, and limitations: official MCP/RFC/OpenAI docs were used only as read-only planning context. Finance evidence remains the source of truth for product answers. FP-0144 creates no finance answer, no source-derived report, no public prose artifact, no generated advice, and no external communication.

Monitoring posture: F6 monitoring semantics are unchanged. No monitoring stored-state input contract, alert semantics, proof-bundle delivery path, freshness posture, missing-source posture, or human-review boundary changes in this slice.

Workflow and environment posture: no `WORKFLOW.md`, stack-pack, package script, dependency, deployment config, or environment variable change is needed.

## Interfaces and Dependencies

No runtime interface changes in FP-0144:

- `POST /mcp` remains the existing local route.
- GET `/mcp` remains unchanged.
- GET `/.well-known/oauth-protected-resource/mcp` remains unchanged.
- FP-0130 missing-token challenge behavior remains separate.
- FP-0141/FP-0143 invalid-token challenge behavior remains explicit local sanitized-envelope dependency behavior only.
- FP-0139 result envelopes remain proof/local envelopes, not production authentication decisions.
- No route consumes evaluator/test-double outputs.

Future-only dependencies before runtime validation can open:

- canonical resource URI proof
- protected-resource metadata proof
- authorization server discovery and issuer proof
- audience/resource and RFC 8707 resource-indicator posture
- scope minimization and challenged-scope authority
- org/company binding source and fail-closed posture
- JWT/JWKS or opaque-token introspection provider decision
- JWKS fetch/cache, key rotation, and clock skew posture if JWT/JWKS is selected
- token introspection, revocation, and service-unavailable posture if opaque-token introspection is selected
- replay detection and nonce/store posture if applicable
- no-token-leakage proof for logs, docs, proof output, examples, error bodies, and structured tool results
- FP-0139 result-envelope-only output contract proof

Future-only scope remains: actual validation, parser/JWT/introspection, OAuth/session/auth middleware, DB/storage, route behavior, remote deployment, public app, submission, provider/certification/deployment execution, OpenAI API/model integration, source mutation, finance writes, external communications, and autonomous action.

## Outcomes & Retrospective

FP-0144 is closed as a docs-and-plan plus proof-gate compatibility record. It created the exact FP-0144 plan, added `tools/read-only-mcp-production-token-validation-sequencing-proof.mjs`, added proof-only FP-0144 domain helpers/spec coverage, bridged existing proof gates, and refreshed directly stale `START_HERE.md`, `docs/ACTIVE_DOCS.md`, `docs/PROJECT_STATE.md`, `docs/V2_BOUNDARY.md`, and `plans/ROADMAP.md`. `plugins.md` was inspected and did not contain directly stale FP-0144 wording.

The planning verdict is that production token-validation runtime cannot start from current repo truth. The next safe slice should be a narrow runtime-contract and proof-hardening plan, not production runtime implementation. JWT/JWKS versus opaque-token introspection remains unresolved/provider-neutral, Authorization header parsing remains deferred, FP-0139 result envelopes remain the output contract, missing-token behavior remains separate, invalid-token challenge emission remains downstream of sanitized FP-0139 envelopes, and FP-0145 remains absent.

The final validation ladder passed before this closeout edit: `git diff --check`, the direct FP-0144 proof, all required predecessor proof tools, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. Because this closeout text is an after-validation edit, the required post-closeout subset must pass before commit: `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

Public ChatGPT App submission should wait. Production token-validation runtime contracts may be considered next only as a separate named plan that proves the FP-0144 prerequisite gates without opening runtime validation, parser, JWT decoder, introspection, OAuth/session/auth middleware, route behavior, DB/storage, remote deployment, provider calls, OpenAI calls, public assets, source mutation, finance writes, external communications, or autonomous action.
