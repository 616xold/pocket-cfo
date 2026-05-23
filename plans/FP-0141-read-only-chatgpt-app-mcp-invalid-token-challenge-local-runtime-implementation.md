# Add read-only ChatGPT App MCP invalid-token challenge local runtime

## Purpose / Big Picture

Target phase: V2BI local read-only ChatGPT App MCP invalid-token challenge runtime implementation.

FP-0141 is the first narrow local runtime slice after FP-0140 and FP-0139. It implements local invalid-token challenge mapping for the existing `/mcp` path from sanitized FP-0139 token-validation result envelopes only. It does not implement production token validation, token parsing, JWT decoding, token introspection, OAuth, token/session storage, auth middleware, DB queries, schemas, migrations, package scripts, remote MCP deployment, Apps SDK resources, app submission, OpenAI API/model calls, provider calls, source mutation, finance writes, generated finance advice, external communications, or autonomous action.

The proof point is a deterministic local adapter and explicit dependency-injected route behavior that can map sanitized rejected result envelopes to HTTP challenge posture without reading, parsing, validating, storing, echoing, or logging token material. Missing-token behavior remains the FP-0130 seam. Protected-resource metadata route behavior remains the FP-0125 seam. JSON-RPC refusal envelopes remain separate from HTTP challenge behavior.

## Progress

- [x] 2026-05-22T22:46:09Z - Invoked the repo-local Pocket CFO operator guards requested for this slice and confirmed GitHub Connector Guard is out of scope.
- [x] 2026-05-22T22:46:09Z - Confirmed PR #319 is merged to `main`, this branch starts at the merge commit, FP-0140 exists and is shipped, FP-0141 was absent, FP-0142 was absent, and the worktree was clean before edits.
- [x] 2026-05-22T22:46:09Z - Ran the pre-edit proof ladder and focused domain/control-plane specs; all baseline gates passed before code changes.
- [x] 2026-05-22T22:46:09Z - Used official read-only MCP, RFC, and OpenAI Apps SDK web documentation for protocol context; OpenAI Developers tooling exposed only API-key setup surfaces and was not used.
- [x] 2026-05-22T23:44:16Z - Implemented the local invalid-token challenge adapter, dependency-injected `/mcp` route path, focused specs, and direct proof command.
- [x] 2026-05-22T23:44:16Z - Bridged prior proof gates so exactly one FP-0141 file is accepted while FP-0142 absent was the FP-0141 closeout state; later FP-0142 records route integration sequencing only.
- [x] 2026-05-22T23:44:16Z - Refreshed directly stale active docs/plugin wording for the FP-0141 local invalid-token challenge seam.
- [x] 2026-05-22T23:44:16Z - Ran focused validation, the full proof ladder, repo-wide validation, and `pnpm ci:repro:current`; all passed before this closeout edit. The required post-closeout rerun remains the last validation step before commit.

## Surprises & Discoveries

Preflight found the repository exactly at the expected FP-0140 merge commit. The FP-0140 proof bridge still treats FP-0141 as absent, so FP-0141 must update the minimum prior gates that scan plan paths and runtime files.

OpenAI Developers tool discovery in this local thread exposed API-key setup actions only, not callable read-only documentation tools. Per the slice policy, those actions were not used. Official web documentation was used read-only instead.

Proof-gate bridge work was broader than the adapter itself because older FP-0100, FP-0103, FP-0122, FP-0128, FP-0130, FP-0132, FP-0135, FP-0136, FP-0137, FP-0138, FP-0139, and FP-0140 guards intentionally treated new `/mcp` `WWW-Authenticate` runtime surfaces as forbidden. The bridge now permits only the FP-0141 local sanitized-envelope adapter path, its focused specs, the exact FP-0141 plan, and the exact route dependency hook while FP-0142 absent was the FP-0141 closeout state; later FP-0142 remains docs/proof route integration sequencing only.

The direct FP-0141 proof initially overmatched machine-readable proof output as token logging because older proof JSON field names include token-validation words. The detector was narrowed to distinguish structured proof output from runtime logging of token-bearing names; no application token logging was added.

Full repo tests found one older protected-resource metadata builder assertion that still counted only the FP-0130 missing-token `WWW-Authenticate` seam. The assertion now explicitly counts the two authorized explicit local challenge seams: FP-0130 missing-token and FP-0141 invalid-token.

Official protocol context used:

- MCP Authorization specification, 2025-06-18: protected resource metadata, `WWW-Authenticate` resource metadata discovery on 401, resource indicators, invalid or expired token posture, insufficient-scope posture, and token-passthrough prohibition.
- MCP Security Best Practices: `resource_metadata` URL handling, confused-deputy posture, and metadata discovery safety context.
- RFC 6750: Bearer challenge error names and status posture for `invalid_request`, `invalid_token`, and `insufficient_scope`.
- RFC 8707: `resource` parameter and audience/resource indicator context.
- RFC 9728: protected resource metadata, deterministic well-known metadata location, resource identifier posture, and `WWW-Authenticate` metadata discovery.
- OpenAI Apps SDK Authentication: ChatGPT Apps protected-resource metadata and challenge context.
- OpenAI Apps SDK Security & Privacy, Deploy your app, Connect from ChatGPT, Test your integration, Submit and maintain your app, and App submission guidelines: public app, testing, and submission context only; no public implementation or submission action is in scope.

## Decision Log

- Decision: FP-0141 consumes only sanitized FP-0139 token-validation result envelopes. Route/service code must not consume raw token material, Authorization header contents, JWT-like strings, token parser output, token introspection output, OAuth client output, session state, DB state, provider output, or FP-0134 synthetic evaluator output.
- Decision: The local adapter maps `malformed_authorization` and symbolic `invalid_request` posture to HTTP 400.
- Decision: The local adapter maps `invalid_token`, `expired_token`, and `revoked_token` posture to HTTP 401.
- Decision: The local adapter maps `insufficient_scope` posture to HTTP 403 and preserves sanitized read-only required-scope guidance when present.
- Decision: Missing-token result envelopes are not valid input for this invalid-token adapter; missing-token challenge behavior remains the FP-0130 route seam.
- Decision: Protected-resource metadata route behavior remains separate and unchanged. FP-0141 preserves the existing local `resource_metadata` dependency but does not construct or alter metadata routes.
- Decision: JSON-RPC refusal remains separate from HTTP challenge behavior. The injected invalid-token path returns an HTTP challenge response before JSON-RPC service dispatch.
- Decision: Default `buildApp()` and default `/mcp` behavior remain unchanged unless the explicit local invalid-token challenge dependency is supplied.
- Decision: Public ChatGPT App submission should wait after this slice.

## Context and Orientation

FP-0139 shipped deterministic local/proof-mode token-validation result envelopes. Those envelopes accept sanitized descriptors only and emit accepted/rejected posture, closed failure taxonomy, HTTP posture recommendation, symbolic `wwwAuthenticateError`, required scopes, issuer/audience/resource posture, subject/org/company binding posture, revocation/replay posture, no-token-echo markers, and an evidence-free security decision boundary.

FP-0140 shipped the implementation-planning bridge. It decided invalid-token runtime may start next only as a narrow later FP-0141 that consumes FP-0139 result envelopes only, preserves missing-token and protected-resource metadata behavior, and keeps FP-0134 synthetic evaluator output out of routes.

This slice is local-only and route-driven but explicit-dependency-only. It is not production authentication. Replay implications are limited to proof output and plan/docs state because no mission state, ingest action, report action, finance artifact, source registry action, or durable business output changes.

Provenance, freshness, and limitations posture: no finance evidence is read, interpreted, mutated, or emitted. The adapter output must disclose local-only, read-only, no-token-echo, no-token-parsing, no-production-validation, and no-auth-middleware limitations in deterministic fields where relevant.

GitHub connector product behavior is explicitly out of scope. Normal `git` and `gh` CLI publication may be used after validation.

## Plan of Work

Create one FP-0141 plan file. Add a local invalid-token challenge adapter near the existing read-only app MCP endpoint. Wire the existing `/mcp` POST route behind a new explicit dependency that accepts sanitized FP-0139 rejected result envelopes only; default behavior remains unchanged when the dependency is absent. Add focused control-plane and domain specs. Add a direct machine-readable proof command. Bridge the minimum prior proof gates so exactly one FP-0141 implementation plan is allowed while FP-0142 absent remains true for the FP-0141 historical closeout.

Patch only directly stale docs/plugin wording if validation proves it is stale. Do not add routes, metadata route behavior, missing-token behavior, DB/schema/package changes, production auth runtime, token examples, public assets, source packs, providers, OpenAI calls, source mutation, finance writes, generated finance advice, or external communications.

## Concrete Steps

1. Keep the branch as `codex/v2bi-read-only-chatgpt-app-mcp-invalid-token-challenge-local-runtime-implementation-local-v1`.
2. Add the local adapter under `apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts`.
3. Add a dependency-injected route hook in `routes.ts` only if it can accept sanitized FP-0139 result envelopes or an explicit adapter without parsing or validating token material.
4. Add focused specs for adapter mapping, route DI behavior, default unchanged behavior, missing-token separation, metadata route separation, raw-token rejection, JWT-like rejection, challenge header/body no-token-echo, and no FP-0134/test-double route consumption.
5. Add domain compatibility helpers/specs for exact FP-0141 plan-path acceptance and FP-0142 absence.
6. Add `tools/read-only-mcp-invalid-token-challenge-local-runtime-proof.mjs` with the required machine-readable JSON fields.
7. Bridge existing proof tools so prior boundaries accept exactly this FP-0141 file and no FP-0142.
8. Refresh directly stale docs/plugin wording if needed.
9. Run focused validation, strict same-branch QA, final validation, close out this plan, rerun required gates after closeout, commit exactly once, push, and create the PR.

## Validation and Acceptance

Acceptance requires:

- exactly one FP-0141 file at `plans/FP-0141-read-only-chatgpt-app-mcp-invalid-token-challenge-local-runtime-implementation.md`
- FP-0142 absent at FP-0141 closeout; later FP-0142 records route integration sequencing only
- sanitized FP-0139 result envelopes accepted as the only adapter input
- raw token material, Authorization header material, Bearer token material, JWT-like strings, and raw descriptors rejected
- malformed authorization / `invalid_request` mapped to 400
- invalid, expired, and revoked token posture mapped to 401
- insufficient scope mapped to 403 with sanitized required scope guidance preserved
- symbolic WWW-Authenticate error values deterministic
- `resource_metadata` dependency preserved without metadata route behavior changes
- missing-token behavior unchanged and separate
- default `/mcp` behavior unchanged unless the explicit invalid-token dependency is supplied
- JSON-RPC refusal envelopes remain separate from HTTP challenge behavior
- no production token validation, token parser, JWT decoder, token introspection, OAuth, token/session storage, auth middleware, DB queries, schema/migrations, package scripts, OpenAI calls, provider calls, source mutation, finance writes, public assets, generated public prose, or autonomous action
- FP-0140/0139/0138/0137/0136/0135/0134/0133/0132/0131/0130/0128/0127/0125/0107/0106/0100 boundaries remain intact

Required validation commands:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-local-runtime-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-implementation-planning-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-result-envelope-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-runtime-implementation-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-implementation-readiness-proof.mjs
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-readiness.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/app.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

## Idempotence and Recovery

If a prior proof gate rejects FP-0141 path presence, patch only the proof-gate bridge so it accepts exactly `plans/FP-0141-read-only-chatgpt-app-mcp-invalid-token-challenge-local-runtime-implementation.md` and keeps FP-0142 absent as the FP-0141 closeout state.

If route tests show default `/mcp`, missing-token challenge, protected-resource metadata route, or JSON-RPC refusal behavior changed outside the injected invalid-token dependency path, revert the route hook and keep only the local adapter until a correction plan can narrow the path.

If validation fails because the adapter requires token parsing, JWT decoding, introspection, OAuth, session state, DB state, provider calls, OpenAI calls, or raw token material, stop and recommend the smallest FP-0141 correction rather than widening scope.

Do not recover by adding production validation, token parser/JWT decoder/introspection, OAuth/session/auth middleware, DB/schema/package work, source/data fixtures, provider calls, OpenAI calls, source mutation, finance writes, public app behavior, app submission material, route integration implementation, default app wiring, or FP-0143.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0141-read-only-chatgpt-app-mcp-invalid-token-challenge-local-runtime-implementation.md`
- `apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.ts`
- `apps/control-plane/src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts`
- targeted updates to `routes.ts`, `routes.spec.ts`, `service.spec.ts`, and domain proof/spec files only if required
- `tools/read-only-mcp-invalid-token-challenge-local-runtime-proof.mjs`
- direct stale docs/plugin wording updates only if required by proof gates

No screenshots, generated images, public assets, listing copy, app-submission artifacts, uploads, source documents, provider calls, OpenAI API/model calls, deployment artifacts, finance writes, source mutation, or external communications are part of this plan.

## Interfaces and Dependencies

The only runtime input dependency is a sanitized FP-0139 `TokenValidationResultEnvelope`. The route may receive an explicit invalid-token challenge dependency. It must not construct token validators, parsers, JWT decoders, introspection clients, OAuth clients, DB clients, provider clients, OpenAI clients, or auth middleware.

The existing `/mcp` POST and GET paths remain the only MCP route paths. The protected-resource metadata route remains the existing explicit-dependency FP-0125 route. The FP-0130 missing-token challenge remains a separate explicit-dependency route behavior. If no invalid-token dependency is supplied, existing behavior remains unchanged.

There are no new environment variables. There is no WORKFLOW.md change expected. There is no stack-pack change. The repo-local Pocket CFO plugin is used for guardrails only; no plugin runtime or connector product behavior is changed. F6 monitoring semantics are unaffected because no monitor stored-state input, alert semantics, source lineage, delivery, or proof-bundle semantics change in this slice.

## Outcomes & Retrospective

FP-0141 shipped the first local invalid-token challenge runtime adapter for existing `POST /mcp`. The adapter consumes sanitized FP-0139 token-validation result envelopes only, rejects raw descriptors and token-like material, maps malformed authorization / `invalid_request` to 400, invalid / expired / revoked token posture to 401, and insufficient scope to 403 with sanitized scope guidance, and emits deterministic local `WWW-Authenticate` challenge descriptors without token echo, token parsing, JWT decoding, introspection, OAuth, token/session storage, auth middleware, DB access, provider calls, OpenAI calls, source mutation, finance writes, public assets, external communications, or autonomous action.

The route integration is explicit-dependency-only. Default `buildApp()` and default `/mcp` behavior remain unchanged when no invalid-token dependency is supplied. Missing-token behavior still belongs to FP-0130 and runs before invalid-token challenge handling. Protected-resource metadata route behavior still belongs to FP-0125 and was not changed. JSON-RPC refusal envelopes remain separate from HTTP challenge behavior.

Validation before closeout passed:

- full FP-0141 and prior-boundary proof ladder
- focused domain specs: 17 files, 196 tests
- focused control-plane specs including the new adapter spec: 4 files, 117 tests
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Replay implications remain limited to checked-in proof output, tests, docs, and this plan because no mission state, ingest action, report action, finance artifact, source registry action, or durable business output changes. F6 monitoring semantics remain unaffected because no monitor stored-state input, alert semantics, source lineage, delivery, or proof-bundle semantics changed.

What remains after FP-0141: commit once, push this branch, and create the PR after the required post-closeout validation rerun. Public ChatGPT App submission should wait. Further invalid-token work should not widen to production validation until a new narrow plan names a real sanitized validation-result provider path and preserves the same route/auth boundaries.
