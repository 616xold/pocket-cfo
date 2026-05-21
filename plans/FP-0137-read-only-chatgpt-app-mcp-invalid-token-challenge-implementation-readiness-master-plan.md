# FP-0137 plan read-only ChatGPT App MCP invalid-token challenge implementation readiness

## Purpose / Big Picture

FP-0137 is the V2BE docs-and-plan plus proof-gate compatibility master plan for invalid-token WWW-Authenticate challenge route-behavior implementation readiness after FP-0136.

This slice decides readiness only. It does not implement invalid-token WWW-Authenticate route behavior, does not add invalid-token challenge headers, does not change `/mcp`, does not change protected-resource metadata route behavior, does not change missing-token behavior, does not implement token validation runtime, does not parse tokens, does not decode JWTs, does not introspect tokens, does not add OAuth, does not add token/session storage, does not add auth middleware, does not consume synthetic test doubles from routes, does not add routes or endpoints, does not add database, schema, migration, package-script, OpenAI API/model, provider, deployment, source-mutation, finance-write, public-submission, or external-communication scope, and does not create FP-0138.

Proof guardrails for this slice are intentionally explicit: no token parser, no JWT decoder, no token validation runtime, no token introspection, no OAuth, no auth middleware, no real token examples, no JWT-like examples, and no Bearer token material.

The user-visible proof point is a conservative implementation-readiness decision: invalid-token route behavior should not start from current repo truth until production token-validation result envelopes exist, or until a later Finance Plan proves an equally safe narrow route lane. FP-0136 contracts stay useful, but they are not a runtime validator.

## Progress

- [x] 2026-05-21T18:53:59Z: Invoked the requested `pocket-cfo-codex-operator` skills: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-21T18:53:59Z: Confirmed branch `codex/v2be-read-only-chatgpt-app-mcp-invalid-token-challenge-implementation-readiness-master-plan-local-v1` is at `origin/main` after PR #315, FP-0136 and its proof-source hardening are shipped, FP-0137 and FP-0138 are absent, `/mcp` route adapter exists, protected-resource metadata route exists, missing-token challenge proof exists, and FP-0134 evaluator remains proof/test-only.
- [x] 2026-05-21T18:53:59Z: Ran pre-edit gates: `git diff --check`, FP-0136 through FP-0100 relevant proof tools, focused domain specs, and focused control-plane `/mcp` plus protected-resource metadata specs passed before edits.
- [x] 2026-05-21T18:53:59Z: Reviewed official sources only: MCP Authorization, MCP Security Best Practices, RFC 6750, RFC 8707, RFC 9728, OpenAI Apps SDK Authentication, and OpenAI Apps SDK Security & Privacy. No OpenAI API/model, provider, deployment, app-submission, external communication, source mutation, or finance write was used.
- [x] 2026-05-21T19:15:26Z: Created the FP-0137 docs-and-plan readiness record, proof-only domain helper, direct proof command, proof-gate bridge compatibility updates, focused specs, and directly stale active-doc/plugin refreshes. No route behavior, invalid-token header emission, token parser, JWT decoder, token validation runtime, token introspection, OAuth/session/auth middleware, DB/schema/package/source/finance-write, provider/OpenAI call, or FP-0138 scope was added.
- [x] 2026-05-21T19:15:26Z: Ran focused validation before closeout: FP-0137 direct proof passed; the FP-0136/0135/0134/0133/0132/0131/0130/0128/0127/0125/0107/0106/0100 proof ladder passed; focused domain specs passed with 98 tests; focused control-plane `/mcp`, protected-resource metadata route, and app specs passed with 107 tests.
- [x] 2026-05-21T19:15:26Z: Ran repository validation before closeout: `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed. A post-closeout validation rerun is required because this closeout edits the scanned FP-0137 plan text.

## Surprises & Discoveries

- Baseline proof gates were green from shipped FP-0136 and PR #315, so this slice can proceed as the requested FP-0137 readiness master plan rather than as a correction to FP-0136, FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, or FP-0100.
- The official MCP authorization spec reinforces the conservative default: invalid or expired tokens are an HTTP 401 concern, insufficient scope is an HTTP 403 concern, malformed authorization requests are an HTTP 400 concern, and protected MCP servers must only accept tokens valid for their own resources. That makes runtime validation result envelopes the safe source for route mapping.
- OpenAI Apps SDK authentication docs frame ChatGPT as the OAuth client and the MCP server as the resource server that verifies access tokens on each request. This is platform context only; it does not make OAuth/session/auth middleware in scope.

## Decision Log

- Decision: Invalid-token route behavior cannot start from current repo truth. FP-0136 proves contracts, not runtime validation.
- Decision: Invalid-token behavior cannot start before token-validation runtime implementation by default. A later plan may override only if it proves an equally safe route lane without parsing, decoding, introspecting, storing, forwarding, logging, or validating token material in this slice.
- Decision: Protected-resource metadata route behavior must remain unchanged.
- Decision: Missing-token challenge behavior must remain unchanged.
- Decision: Synthetic evaluator and test doubles may not be consumed by route behavior.
- Decision: Invalid-token 401/403/400 mapping may not be implemented without runtime validation result envelopes.
- Decision: Invalid-token HTTP challenge headers and JSON-RPC refusal envelopes remain separate.
- Decision: Future runtime inputs allowed for invalid-token challenge mapping are limited to a typed validation result envelope from a production token-validation runtime, a route-local request classification that carries no raw token material, the existing protected-resource metadata route-input evidence acceptance, the operation-specific read-only scope requirements, and the existing missing-token challenge dependency posture.
- Decision: Future proof tools must exist before route behavior can open: token-validation runtime proof, no-token-echo proof over committed and dirty docs/source, invalid-token challenge route proof, unchanged `/mcp` behavior proof, unchanged protected-resource metadata route proof, unchanged missing-token behavior proof, no route consumption of test doubles proof, 401/403/400 mapping proof from result envelopes, JSON-RPC refusal separation proof, and no OAuth/session/auth middleware widening proof.
- Decision: FP-0138 remains absent. The recommended next plan should be token-validation runtime implementation planning, not invalid-token challenge implementation. Public ChatGPT App submission remains future-only.

## Context and Orientation

FP-0136 shipped local/proof-only invalid-token challenge contracts: failure taxonomy, future 401/403/400 mapping posture, future WWW-Authenticate Bearer parameter posture, `resource_metadata` alignment, challenged-scope authority, JSON-RPC refusal separation, no-token-echo, no route consumption of synthetic test doubles, no-runtime posture, and FP-0137 absence. It did not implement route behavior or token validation runtime.

Official source context used by FP-0137:

- Model Context Protocol Authorization specification, `draft/basic/authorization`: used for HTTP authorization transport posture, protected-resource metadata discovery through `resource_metadata`, invalid/expired token 401 behavior, insufficient-scope 403 behavior, malformed authorization request 400 behavior, scope challenge authority, resource indicators, and token passthrough prohibition.
- Model Context Protocol Security Best Practices: used for token passthrough risks, resource-server validation expectations, session/auth separation, least privilege, and defense-in-depth posture.
- RFC 6750, OAuth 2.0 Bearer Token Usage: used for WWW-Authenticate challenge parameters, `invalid_request`, `invalid_token`, `insufficient_scope`, and 400/401/403 response mapping.
- RFC 8707, Resource Indicators for OAuth 2.0: used for the `resource` parameter as the target service/resource and audience/resource restriction posture.
- RFC 9728, OAuth 2.0 Protected Resource Metadata: used for protected-resource metadata fields, metadata well-known retrieval, metadata validation, and WWW-Authenticate `resource_metadata`.
- OpenAI Apps SDK Authentication: used only as platform context for authenticated MCP servers, OAuth 2.1 conformance to the MCP authorization spec, protected-resource metadata hosting, ChatGPT as client, and per-request token verification expectations.
- OpenAI Apps SDK Security & Privacy: used only as platform context for least privilege, explicit user consent, input validation, audit logs, and data minimization.

GitHub connector product behavior is out of scope. Routine `git`, `gh`, push, and PR operations are repository operations, not product GitHub connector behavior.

## Plan of Work

This slice creates exactly one FP-0137 plan, adds the minimum proof-gate bridge accepting that one docs-only readiness plan while keeping FP-0138 absent, and refreshes directly stale active docs/plugins wording where the repo still says FP-0137 is absent or future-only.

Allowed source changes are proof-gate helpers/specs under the read-only MCP invalid-token/token-validation/WWW-Authenticate/protected-resource metadata domain families, the new direct proof command `tools/read-only-mcp-invalid-token-challenge-implementation-readiness-proof.mjs`, and existing proof tools only where they must accept FP-0137 docs-only readiness while rejecting route/runtime/auth/token drift.

Forbidden scope remains: no invalid-token WWW-Authenticate headers, no `/mcp` behavior change, no protected-resource metadata route behavior change, no missing-token behavior change, no token parser, no JWT decoder, no token validation runtime, no token introspection, no OAuth/session/auth middleware, no route consumption of test doubles, no route expansion, no new endpoint, no DB/schema/migration/package/data/source-pack/public-asset/OpenAI/provider/deployment/source/finance-write/external-communication/autonomous-action scope, and no FP-0138.

## Concrete Steps

1. Create `plans/FP-0137-read-only-chatgpt-app-mcp-invalid-token-challenge-implementation-readiness-master-plan.md`.
2. Add proof-gate helper contracts for exactly one FP-0137 docs-only implementation-readiness plan and FP-0138 absence.
3. Add `tools/read-only-mcp-invalid-token-challenge-implementation-readiness-proof.mjs`.
4. Update existing minimum proof tools so FP-0136/0135/0134/0133 proof posture accepts FP-0137 docs-only readiness while FP-0138 remains absent.
5. Add focused specs proving the FP-0137 path, boundary, no route/runtime/auth/token widening, planning blocker until runtime validation result envelopes exist, and prior boundary preservation.
6. Refresh directly stale active docs/plugins wording only where FP-0137 existence changes the truth.
7. Run focused validation, strict same-branch QA, final validation, closeout updates, one commit, push, and PR creation.

## Validation and Acceptance

Acceptance requires:

- exactly one FP-0137 path exists at `plans/FP-0137-read-only-chatgpt-app-mcp-invalid-token-challenge-implementation-readiness-master-plan.md`
- FP-0138 remains absent
- FP-0137 is docs-and-plan/proof-gate compatibility only
- invalid-token route behavior remains unimplemented
- `/mcp`, protected-resource metadata route behavior, and missing-token behavior remain unchanged
- token parser, JWT decoder, token validation runtime, token introspection, token/session storage, OAuth implementation, and auth middleware remain absent
- synthetic test doubles remain proof/test-only and are not consumed by routes
- no real token examples, JWT-like examples, or Bearer token material are added
- planning text explicitly blocks invalid-token route behavior until runtime validation result envelopes exist or a later plan proves otherwise
- FP-0136, FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 boundaries remain intact

Validation command set:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-www-authenticate.spec.ts src/read-only-app-mcp-www-authenticate-boundary-hardening.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-protected-resource-metadata-route-input.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/app.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

If a post-validation closeout edit is made, rerun `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. If a correction changes proof logic or docs scanned by the direct proof, rerun the focused proof ladder too.

## Idempotence and Recovery

This slice is idempotent because it accepts exactly one FP-0137 docs-only readiness plan and rejects FP-0138 or runtime/auth/token/route widening. Re-running the proof should continue to accept the same plan path and the same absence boundaries.

If proof rejects the slice, patch only the FP-0137 plan text, proof-gate helper, direct proof tool, or directly stale active-doc wording needed to restore truth. If proof detects route/auth/runtime/token material scope, remove that scope and rerun the full ladder. If unrelated dirty files or service failures appear, stop and report the smallest blocker.

Rollback is straightforward: remove this FP-0137 plan, the FP-0137 proof-gate helper/spec additions, the direct FP-0137 proof command, proof-gate bridge edits, and directly stale doc/plugin refreshes. Do not revert FP-0136 or earlier shipped records.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0137-read-only-chatgpt-app-mcp-invalid-token-challenge-implementation-readiness-master-plan.md`
- proof-gate helpers/specs under `packages/domain/src/read-only-app-mcp-invalid-token-challenge*.ts`
- proof-gate compatibility updates in existing read-only MCP proof helpers/tools only as required
- `tools/read-only-mcp-invalid-token-challenge-implementation-readiness-proof.mjs`
- directly stale active-doc and `plugins.md` refreshes

Replay implication: FP-0137 creates no mission state changes, ingest actions, reports, approvals, monitoring outputs, external communications, source mutations, finance writes, or durable finance answers. No replay event is required.

Evidence/provenance/freshness implication: FP-0137 creates no raw source, source snapshot, Finance Twin state, CFO Wiki output, evidence bundle, freshness posture change, or finance limitation output. Its proof output is limited to plan/proof boundary booleans and prior-boundary preservation.

No new environment variables, package scripts, migrations, fixtures, datasets, source packs, public assets, screenshots, images, app-submission assets, provider calls, OpenAI API/model calls, deployment config, external artifacts, or FP-0138 are added.

## Interfaces and Dependencies

FP-0137 adds no runtime interface. The only new interface is proof-only: `tools/read-only-mcp-invalid-token-challenge-implementation-readiness-proof.mjs` reports booleans proving the FP-0137 readiness boundary and prior FP posture.

Invalid-token challenge route behavior remains blocked. A future implementation plan may open only after a production token-validation runtime or a later proven equivalent provides typed, token-free validation result envelopes that can drive 401/403/400 mapping without consuming test doubles or echoing token material.

Upstream proof dependencies: FP-0136, FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 must remain proven. FP-0138 remains absent.

## Outcomes & Retrospective

FP-0137 closed as a docs-and-plan plus proof-gate compatibility readiness slice. The readiness verdict is conservative: invalid-token route behavior should not start from current repo truth; token-validation runtime result envelopes should be planned first unless a later Finance Plan proves an equally safe narrow route lane. FP-0138 remains absent.

Files changed:

- `plans/FP-0137-read-only-chatgpt-app-mcp-invalid-token-challenge-implementation-readiness-master-plan.md`
- read-only MCP invalid-token/token-validation/protected-resource proof helpers and focused specs under `packages/domain/src/`
- `tools/read-only-mcp-invalid-token-challenge-implementation-readiness-proof.mjs`
- existing read-only MCP proof tools that needed FP-0137 docs-only compatibility
- directly stale active docs and plugin inventory: `README.md`, `START_HERE.md`, `CODEX_README.md`, `docs/ACTIVE_DOCS.md`, `docs/PROJECT_STATE.md`, `docs/V2_BOUNDARY.md`, `docs/security/finance-data-threat-model.md`, `docs/security/read-only-agent-threat-model.md`, `docs/demo/demo-data-policy.md`, `plans/ROADMAP.md`, and `plugins.md`

Validation before closeout passed:

- `git diff --check`
- FP-0137 direct proof plus the relevant FP-0136 through FP-0100 proof ladder
- focused domain specs: 98 tests
- focused control-plane specs: 107 tests
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Commit, push, and PR creation are intentionally pending until the required post-closeout validation rerun completes on this same branch. The next recommended slice is token-validation runtime implementation planning. Invalid-token WWW-Authenticate route behavior remains blocked, no FP-0137 correction is currently needed, and public ChatGPT App submission should wait.
