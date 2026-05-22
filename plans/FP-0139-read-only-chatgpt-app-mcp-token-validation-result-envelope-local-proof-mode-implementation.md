# FP-0139 add read-only ChatGPT App MCP token-validation result envelopes

## Purpose / Big Picture

FP-0139 is the V2BG local proof-mode implementation slice for read-only ChatGPT App/MCP token-validation result envelopes after FP-0138.

The user-visible purpose is a deterministic, token-free result envelope builder/evaluator that future invalid-token challenge mapping can depend on without touching routes or validating real tokens. This slice accepts sanitized descriptor inputs only and emits structured token-validation result envelopes only.

This is local-only, proof-mode only, read-only, deterministic, and evidence-free. It is not production token validation, token parsing, JWT decoding, token introspection, OAuth implementation, token/session storage, auth middleware, invalid-token WWW-Authenticate route behavior, missing-token behavior change, protected-resource metadata route behavior change, `/mcp` route behavior change, route expansion, database work, package-script work, OpenAI API/model integration, provider/certification/deployment execution, external communication, source mutation, finance write, or autonomous action.

Boundary wording for proof gates: FP-0139 is not production token validation, not token parsing, not JWT decoding, not token introspection, not OAuth implementation, not auth middleware, not invalid-token WWW-Authenticate route behavior, not route expansion, and not DB query implementation. It also means no production token validation, no token parsing, no JWT decoding, no token introspection, no invalid-token WWW-Authenticate route behavior, no missing-token behavior change, no protected-resource metadata route behavior change, and no `/mcp` behavior change.

## Progress

- [x] 2026-05-21T22:03:58Z: Invoked the requested `pocket-cfo-codex-operator` skills: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-21T22:03:58Z: Confirmed the branch is `codex/v2bg-read-only-chatgpt-app-mcp-token-validation-result-envelope-local-proof-mode-implementation-local-v1`, the worktree was clean, `origin/main` is at merge commit `245f0582` for PR #317 / FP-0138, FP-0138 exists and is shipped, FP-0139 and FP-0140 are absent, and active docs support FP-0138 as shipped docs-and-plan/proof-gate token-validation runtime implementation planning.
- [x] 2026-05-21T22:03:58Z: Ran pre-edit proof gates and focused specs. `git diff --check`, the FP-0138 through FP-0100 relevant proof commands, focused domain specs, and focused control-plane `/mcp` plus protected-resource metadata specs passed before edits. Logs are under `/tmp/fp0139-baseline.BZBKm1`.
- [x] 2026-05-21T22:03:58Z: Reviewed only official sources. OpenAI Developers exposed only API-key setup surfaces, not read-only docs, so official web docs were used for current MCP Authorization, MCP Security Best Practices, RFC 6750, RFC 8707, RFC 9728, and OpenAI Apps SDK Authentication, Security & Privacy, Deploy, Connect, Test, Submit, and App submission guideline pages. No API-key setup, OpenAI API call, model call, provider call, deployment action, upload, public asset, app-submission action, source mutation, finance write, or external communication was used.
- [x] 2026-05-21T22:45:54Z: Implemented the pure local proof-mode token-validation result envelope contracts, builder/evaluator, focused specs, direct proof command, and minimum proof-gate bridge updates. The implementation accepts sanitized descriptors only, emits deterministic envelopes only, rejects raw token/Bearer/JWT-like material, keeps FP-0140 absent, and preserves `/mcp`, protected-resource metadata, missing-token, and invalid-token runtime behavior unchanged.
- [x] 2026-05-21T22:45:54Z: Refreshed directly stale active docs, roadmap, security/demo docs, and `plugins.md` wording to name FP-0139 as a shipped local proof-mode result-envelope slice without claiming production validation or route behavior.
- [x] 2026-05-21T22:45:54Z: Final validation rerun passed after scoped QA corrections to historical proof allowlists and one type-only spec fixture. Logs are under `/tmp/fp0139-final-validation-rerun`, including `git diff --check`, all requested proof tools, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

## Surprises & Discoveries

- The pre-edit proof ladder was green on the requested branch, so FP-0139 can proceed as the first narrow local proof-mode token-validation result envelope implementation rather than as a correction to FP-0138, FP-0137, FP-0136, FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, or FP-0100.
- OpenAI Developers tooling in this thread exposes API-key setup surfaces only. Official OpenAI web docs are therefore the safe read-only documentation source for Apps SDK authentication/security/deploy/connect/test/submission context.

## Decision Log

- Decision: FP-0139 implements only sanitized-descriptor to token-validation result-envelope building/evaluation. The descriptor is not token material and cannot include raw token, Bearer, authorization header, JWT-like, OAuth credential, session, cookie, provider credential, or OpenAI key material.
- Decision: The failure taxonomy is closed for this slice: `missing_token`, `malformed_authorization`, `invalid_token`, `expired_token`, `revoked_token`, `wrong_audience`, `wrong_resource`, `insufficient_scope`, `wrong_org`, `company_binding_mismatch`, `replay_or_nonce_failure`, `unsupported_validation_mode`, and `production_validation_unavailable`.
- Decision: HTTP posture is only a recommendation in the envelope, never a route response. Malformed authorization maps to explicit 400 posture; insufficient scope maps to 403 posture; missing, invalid, expired, revoked, wrong audience, wrong resource, replay/nonce, unsupported proof mode, and production-unavailable failures map fail-closed to 401 posture; wrong org and company binding mismatch fail closed without leaking identity or token material.
- Decision: `wwwAuthenticateError` values are symbolic only. FP-0139 does not produce WWW-Authenticate headers or Bearer challenge strings.
- Decision: Required scopes must be sanitized identifiers from the read-only allowlist. The envelope never emits broad wildcard, write, admin, or hidden provider scopes.
- Decision: Issuer/audience/resource, subject/org/company, revocation/replay, no-token-echo, proof-mode-only, and evidence-free decision fields are structured posture boundaries only. No real issuer, JWKS, provider, user, org, company, revocation, nonce, DB, or route lookup is performed.
- Decision: FP-0134 synthetic test-double evaluator output remains proof/test-only and is not route-consumed. FP-0139 may preserve compatibility with FP-0134 boundaries, but it does not make FP-0134 a route input.
- Decision: FP-0140 is now a docs-and-plan plus proof-gate compatibility slice after FP-0139. Public ChatGPT App submission and production token-validation runtime should wait.

## Context and Orientation

FP-0138 shipped token-validation runtime implementation planning and decided that real production token validation remains blocked. It named local proof-mode validation result envelope work as the next safe lane and kept invalid-token route behavior blocked until validation result envelopes exist.

FP-0132 shipped token-validation runtime contracts. FP-0133 shipped token-validation test-double contracts. FP-0134 shipped a proof-only synthetic token-validation evaluator that is not consumed by routes. FP-0135 through FP-0137 sequenced and planned invalid-token challenge readiness, but route behavior remains blocked. FP-0130 missing-token challenge behavior, FP-0125 protected-resource metadata route behavior, and FP-0107 `/mcp` route adapter behavior must remain unchanged.

Official source context used by FP-0139:

- Model Context Protocol Authorization specification, current draft: used for protected MCP server token requirements, per-request token validation expectations, invalid/expired token 401 posture, malformed authorization 400 posture, insufficient scope 403 posture, resource/audience validation, and token passthrough prohibition.
- Model Context Protocol Security Best Practices: used for token passthrough, audience validation, least-privilege scope challenge posture, local server safety, and scope minimization.
- RFC 6750, OAuth 2.0 Bearer Token Usage: used for symbolic error semantics and 400/401/403 posture mapping for malformed, invalid, expired, revoked, and insufficient-scope categories.
- RFC 8707, Resource Indicators for OAuth 2.0: used for resource indicator and audience restriction posture.
- RFC 9728, OAuth 2.0 Protected Resource Metadata: used for protected-resource metadata context, authorization server/resource consistency, and resource metadata challenge context without implementing headers.
- OpenAI Apps SDK Authentication: used for ChatGPT/MCP OAuth context, protected resource metadata, resource parameter echoing, expected token audience/scope verification, and why this slice must remain token-free.
- OpenAI Apps SDK Security & Privacy: used for least privilege, data minimization, token/secret avoidance, scope enforcement expectations, and why this slice emits no public app behavior.
- OpenAI Apps SDK Deploy, Connect from ChatGPT, Test your integration, Submit your app, and App submission guidelines: used only to keep deployment, developer-mode connection, public testing, submission, listing, and app-review behavior out of scope.

GitHub connector product behavior is out of scope. Routine `git`, `gh`, push, and PR operations are repository operations, not product GitHub connector behavior.

## Plan of Work

This slice creates exactly one FP-0139 plan and adds pure domain result-envelope contracts/builders/evaluator logic under `packages/domain/src/read-only-app-mcp-token-validation-result-envelope*.ts`. It adds one direct proof command at `tools/read-only-mcp-token-validation-result-envelope-proof.mjs`, focused domain specs, and the minimum proof-gate bridge so prior proof tools accept exactly one local proof-mode FP-0139 implementation. FP-0140 is now a docs-and-plan plus proof-gate compatibility slice that consumes FP-0139 only as future planning input.

Allowed changes are limited to the FP-0139 plan, the token-validation result-envelope domain files/specs, proof-gate helpers/specs in the existing read-only app MCP token-validation/test-double/invalid-token/WWW-Authenticate/protected-resource-metadata families when needed for compatibility, `packages/domain/src/index.ts` exports if needed, the new direct proof command, existing proof tools only for bridge compatibility, and directly stale docs/plugins wording if the new FP-0139 truth makes them stale.

Forbidden scope remains: no production token validation, Authorization header parsing, token parsing, JWT decoding, signature verification, token introspection, OAuth implementation, token/session storage, auth middleware, invalid-token WWW-Authenticate headers, missing-token behavior change, `/mcp` behavior change, protected-resource metadata route behavior change, synthetic test-double route consumption, raw token examples, JWT-like examples, Bearer token material, route paths, DB/schema/migration/package/data/source-pack/OpenAI/provider/deployment/source-mutation/finance-write/public-asset/listing-copy/generated-public-prose/external-communication/autonomous-action scope, and no FP-0140.

## Concrete Steps

1. Create this FP-0139 Finance Plan.
2. Add pure result-envelope schemas/types/builders/evaluator in `packages/domain/src/read-only-app-mcp-token-validation-result-envelope*.ts`.
3. Add focused specs proving sanitized descriptor acceptance, raw token/Bearer/JWT-like rejection, closed failure taxonomy, deterministic HTTP posture recommendations, symbolic WWW-Authenticate error boundaries, sanitized required scopes, issuer/audience/resource posture, subject/org/company binding posture, revocation/replay posture, no-token-echo markers, evidence-free security decision boundary, proof-mode-only boundary, and the later FP-0140 docs-only planning bridge.
4. Add `tools/read-only-mcp-token-validation-result-envelope-proof.mjs` with machine-readable JSON proof fields.
5. Update minimum proof-gate bridges so FP-0138 through FP-0100 relevant tools accept exactly one FP-0139 local proof-mode result-envelope implementation and still reject FP-0140 plus runtime/token/OAuth/auth/route/DB/provider/source/finance widening.
6. Refresh only directly stale active docs and `plugins.md` wording if necessary.
7. Run focused validation, strict same-branch QA, final validation, closeout updates, one commit, push, and PR creation.

## Validation and Acceptance

Acceptance requires:

- exactly one FP-0139 plan path exists at `plans/FP-0139-read-only-chatgpt-app-mcp-token-validation-result-envelope-local-proof-mode-implementation.md`
- FP-0140 remains docs-and-plan plus proof-gate compatibility only after this slice
- result-envelope builder/evaluator accepts sanitized descriptors only and does not accept raw token, Bearer, Authorization header, JWT-like, OAuth credential, session, cookie, provider credential, or OpenAI key material
- failure taxonomy is closed and exact
- HTTP posture recommendation is deterministic and does not emit a route response
- insufficient scope maps to 403 posture
- invalid, expired, and revoked token-family failures map to 401 posture
- malformed authorization maps to 400 posture
- wrong audience/resource/org/company binding fail closed without token or identity leakage
- no WWW-Authenticate headers are emitted
- `wwwAuthenticateError` is symbolic only
- required scopes are sanitized read-only identifiers only
- issuer/audience/resource, subject/org/company, revocation/replay, no-token-echo, evidence-free, and proof-mode-only boundaries are explicit
- no parser, JWT decoder, token validation runtime, token introspection runtime, OAuth implementation, token/session storage, auth middleware, DB query, schema/migration, package script, provider call, OpenAI call, source mutation, finance write, public asset, route response, route behavior change, or route consumption of FP-0134 output is added
- FP-0138, FP-0137, FP-0136, FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 boundaries remain intact

Validation command set:

```bash
git diff --check
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

If a post-validation closeout edit is made, rerun `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. If a correction changes proof logic or docs scanned by direct proof tools, rerun the focused proof ladder too.

## Idempotence and Recovery

FP-0139 is idempotent because the proof bridge accepts exactly one FP-0139 path and rejects FP-0140 or runtime/auth/token/route widening. Re-running the proof should keep the same deterministic envelope fields, taxonomy, and boundary booleans.

If proof rejects the slice, patch only the FP-0139 plan text, result-envelope domain files/specs, direct proof command, existing proof-gate bridge compatibility, or directly stale doc/plugin wording needed to restore truth. If proof detects route/auth/runtime/token material scope, remove that scope and rerun the full ladder. If unrelated dirty files, missing services, missing proof tools, or auth failures appear, stop and report the smallest blocker.

Rollback is straightforward: remove the FP-0139 plan, result-envelope domain files/specs/exports, the direct proof command, proof-gate bridge edits, and directly stale docs/plugin refreshes. Do not revert FP-0138 or earlier shipped records.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0139-read-only-chatgpt-app-mcp-token-validation-result-envelope-local-proof-mode-implementation.md`
- `packages/domain/src/read-only-app-mcp-token-validation-result-envelope*.ts`
- `packages/domain/src/read-only-app-mcp-token-validation-result-envelope*.spec.ts`
- `tools/read-only-mcp-token-validation-result-envelope-proof.mjs`
- minimum proof-gate bridge updates in existing read-only MCP proof helpers/tools as needed
- directly stale active docs and `plugins.md` refreshes only if necessary

Replay implication: FP-0139 creates no mission state changes, ingest actions, reports, approvals, monitoring outputs, external communications, source mutations, finance writes, or durable finance answers. No replay event is required.

Evidence/provenance/freshness implication: FP-0139 creates no raw source, source snapshot, Finance Twin state, CFO Wiki output, evidence bundle, freshness posture change, or finance limitation output. Its envelope explicitly marks the security decision as evidence-free and proof-mode-only so future route behavior cannot mistake it for source-backed finance evidence or production authentication.

No new environment variables, package scripts, migrations, fixtures, datasets, source packs, public assets, screenshots, images, app-submission assets, provider calls, OpenAI API/model calls, deployment config, external artifacts, or FP-0141 are added.

## Interfaces and Dependencies

FP-0139 adds one pure domain interface: sanitized descriptor input to `TokenValidationResultEnvelope`. This interface is local proof-mode only and has no route, DB, provider, OpenAI, OAuth, token/session, or auth middleware dependency.

Future invalid-token route behavior may depend on these envelopes only after a later Finance Plan proves route consumption, header construction, JSON-RPC refusal separation, canonical resource metadata references, no-token-echo, and production validation trust gates. Future production token-validation runtime remains blocked until issuer/audience/resource/scope, user-org-company, revocation/replay, provider/auth-server, canonical public resource URI, and no-token-leakage gates are concrete.

Upstream proof dependencies: FP-0138, FP-0137, FP-0136, FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 must remain proven. FP-0140 is now a docs-and-plan plus proof-gate compatibility slice only; FP-0141 remains absent.

## Outcomes & Retrospective

FP-0139 implementation verdict: completed and locally proven. The slice adds a deterministic local proof-mode token-validation result envelope builder/evaluator for future invalid-token challenge mapping while staying sanitized-descriptor-only, read-only, evidence-free, and route-disconnected.

Implemented artifacts:

- `packages/domain/src/read-only-app-mcp-token-validation-result-envelope-contracts.ts`
- `packages/domain/src/read-only-app-mcp-token-validation-result-envelope.ts`
- `packages/domain/src/read-only-app-mcp-token-validation-result-envelope.spec.ts`
- `tools/read-only-mcp-token-validation-result-envelope-proof.mjs`
- `packages/domain/src/index.ts` export
- proof-gate bridge updates in the token-validation, test-double, invalid-token, metadata, route-adapter, protocol-envelope, endpoint-route-ownership, and endpoint-architecture proof families
- directly stale README/CODEX/START/ACTIVE_DOCS/PROJECT_STATE/V2_BOUNDARY/ROADMAP/security/demo/plugin wording refreshes

Result-envelope decisions made: closed taxonomy, deterministic HTTP posture recommendations, symbolic WWW-Authenticate error values only, sanitized read-only required scopes, issuer/audience/resource posture without provider calls, subject/org/company posture without lookup, revocation/replay posture without stores, no-token-echo markers, proof-mode-only boundary, and evidence-free security decision boundary.

Posture preserved: FP-0138, FP-0137, FP-0136, FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 remain proven. FP-0134 synthetic evaluator output remains proof/test-only and is not route-consumed. FP-0140 is now a docs-and-plan plus proof-gate compatibility slice only, and FP-0141 remains absent.

Guardrails preserved: no production token validation, Authorization header parsing, token parsing, JWT decoding, signature verification, token introspection, OAuth implementation, token/session storage, auth middleware, invalid-token WWW-Authenticate header emission, route response emission, `/mcp` behavior change, protected-resource metadata route behavior change, missing-token behavior change, invalid-token challenge runtime, DB query, schema/migration, package-script change, provider call, OpenAI API/model call, source mutation, finance write, public asset, listing copy, generated public prose, external communication, or autonomous action was added.

Validation results: final rerun passed with logs under `/tmp/fp0139-final-validation-rerun`: `git diff --check`, the direct FP-0139 proof, the requested FP-0138 through FP-0100 proof ladder, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

Recommendation: next work should be one narrow invalid-token challenge implementation-planning FP that consumes FP-0139 envelopes only at the plan/proof-boundary level. Production token-validation runtime should not start yet, and public ChatGPT App submission should wait.
