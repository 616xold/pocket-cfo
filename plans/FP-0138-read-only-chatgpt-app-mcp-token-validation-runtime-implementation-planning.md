# FP-0138 plan read-only ChatGPT App MCP token-validation runtime implementation planning

## Purpose / Big Picture

FP-0138 is the V2BF docs-and-plan plus proof-gate compatibility master plan for token-validation runtime implementation planning after FP-0137.

This is planning plus proof-gate compatibility only. It does not implement token validation runtime, does not parse tokens, does not decode JWTs, does not introspect tokens, does not store, forward, log, echo, parse, decode, validate, introspect, or replay token material, does not consume synthetic test doubles from any route, does not implement invalid-token challenge behavior, does not change `/mcp`, does not change protected-resource metadata route behavior, does not change missing-token challenge behavior, does not add OAuth, does not add token/session storage, does not add auth middleware, does not add routes, does not add endpoints, does not add database, schema, migration, package-script, deployment, OpenAI API/model, provider, source-mutation, finance-write, public-submission, or external-communication scope, and does not create FP-0139.

The user-visible proof point is a conservative sequencing verdict: token-validation runtime implementation can start from current repo truth only as local proof-mode validation result envelope implementation planning. Real production token validation remains blocked until issuer/audience/resource/scope, user-org-company, revocation/replay, provider trust gates, provider/auth-server selection, and no-token-leakage proof are concrete enough to bind runtime adapters.

## Progress

- [x] 2026-05-21T20:53:12Z: Invoked the requested `pocket-cfo-codex-operator` skills: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-21T20:53:12Z: Confirmed PR #316 is merged to `main`, the branch is `codex/v2bf-read-only-chatgpt-app-mcp-token-validation-runtime-implementation-planning-local-v1` at merge commit `489a8623`, FP-0137 exists and is shipped, FP-0138 and FP-0139 are absent, `/mcp` route adapter exists, protected-resource metadata route exists, missing-token challenge proof exists, FP-0134 evaluator remains proof/test-only, and the worktree was clean before edits.
- [x] 2026-05-21T20:53:12Z: Ran pre-edit gates: `git diff --check`, FP-0137 through FP-0100 relevant proof tools, focused domain specs, and focused control-plane `/mcp` plus protected-resource metadata specs passed before edits.
- [x] 2026-05-21T20:53:12Z: Reviewed official sources only. OpenAI Developers tooling exposed only API-key setup surfaces, not read-only docs, so official web docs were used for MCP Authorization, MCP Security Best Practices, RFC 6750, RFC 8707, RFC 9728, OpenAI Apps SDK Authentication, Security & Privacy, Deploy your app, Connect from ChatGPT, Test your integration, and Submit and maintain your app. No API-key setup, OpenAI API call, model call, provider call, deployment action, external communication, source mutation, finance write, upload, public asset, or app-submission action was used.
- [x] 2026-05-21T20:53:12Z: Created the FP-0138 plan and proof-only bridge artifacts. Runtime route, token parser, JWT decoder, token introspection, token validation, OAuth, session, auth middleware, DB/schema/package/deployment/source/finance-write, provider/OpenAI call, app-submission, and FP-0139 scope remain absent.
- [x] 2026-05-21T21:19:02Z: Refreshed directly stale README, CODEX/START, ACTIVE_DOCS, PROJECT_STATE, V2_BOUNDARY, roadmap, security/demo, and `plugins.md` wording so FP-0138 is represented as shipped docs-and-plan/proof-gate planning while FP-0139 remains absent.
- [x] 2026-05-21T21:19:02Z: Added the minimum FP-0138 compatibility bridge to older proof gates that still treated any FP-0138 planning/proof artifact as drift, while preserving route/runtime/token/OAuth/auth/schema/package/provider/source/finance-write rejection.
- [x] 2026-05-21T21:19:02Z: Validation passed before this closeout edit: `git diff --check`, all requested read-only MCP/proof commands including the new FP-0138 readiness proof, focused domain specs, focused control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. Post-closeout rerun is required before commit.

## Surprises & Discoveries

- Baseline proof gates were green from shipped FP-0137 and PR #316, so FP-0138 can proceed as a docs-and-plan/proof-gate compatibility master plan rather than as a correction to FP-0137, FP-0136, FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, or FP-0100.
- The current MCP Authorization specification reinforces that a protected MCP server is the OAuth resource server, must validate tokens for its own resource, must reject invalid or expired tokens with HTTP 401, and must handle insufficient scope with HTTP 403 plus scoped challenge parameters. This makes a token-free runtime result envelope the safe next proof boundary before route behavior consumes any validation decision.
- The OpenAI Apps SDK Authentication docs reinforce that ChatGPT acts as client while the MCP server verifies access tokens on each request, expects protected resource metadata, echoes the `resource` parameter through the flow, and rejects tokens without expected audience or scopes. This is planning context only; it does not open OAuth, session, auth middleware, or production token validation in FP-0138.
- Several older proof gates had exact changed-path allowlists from FP-0122, FP-0123, and FP-0128. They needed narrow FP-0138 compatibility entries so docs/proof planning can coexist with their prior boundaries without relaxing runtime/auth/token/source/finance-write guards.

## Decision Log

- Decision: Token-validation runtime implementation can start from current repo truth only as local proof-mode validation result envelope implementation planning. It cannot start as real production token validation in this slice.
- Decision: Real production token validation remains blocked until issuer/audience/resource/scope, user-org-company, revocation/replay, provider trust gates, provider/auth-server selection, canonical public resource URI, and no-token-leakage proof are concrete runtime adapter prerequisites.
- Decision: Token parsing remains blocked until parser no-leak/no-echo contracts exist.
- Decision: JWT decoding remains blocked until issuer/JWKS/provider trust is proven.
- Decision: Token introspection remains blocked until provider/auth-server selection is proven.
- Decision: Local proof-mode validation result envelope implementation can be planned without real token material if the future slice uses token-free inputs, no raw token examples, no JWT-like examples, no Bearer token material, and no route consumption.
- Decision: Synthetic test-double evaluator output may not be consumed by routes.
- Decision: Invalid-token route behavior remains blocked until validation result envelopes exist.
- Decision: A future validation result envelope must emit these exact fields: accepted / rejected, failure taxonomy, httpStatus recommendation, wwwAuthenticateError, requiredScopes, issuer / audience / resource validation posture, subject / org / company binding posture, revocation/replay posture, no raw token / no token echo markers, and evidence-free security decision boundary.
- Decision: Future FP-0139 should be local proof-only validation result envelope implementation planning, not production token-validation runtime planning. If the FP-0138 gates cannot stay green, FP-0139 should remain blocked.
- Decision: Public ChatGPT App submission remains future-only.

## Context and Orientation

FP-0137 shipped invalid-token challenge implementation readiness and decided invalid-token route behavior cannot start from current repo truth. It specifically recommended token-validation runtime result envelopes before 401/403/400 route mapping, while keeping HTTP challenge headers and JSON-RPC refusal envelopes separate.

FP-0136 shipped invalid-token challenge contracts. FP-0135 shipped invalid-token challenge sequencing. FP-0134 shipped a local synthetic token-validation test-double evaluator for proof/test use only and not route use. FP-0133 shipped token-validation test-double contracts. FP-0132 shipped token-validation runtime contracts and result-envelope posture without runtime validation. FP-0131 shipped token-validation and invalid-token runtime sequencing. FP-0130 shipped missing-token WWW-Authenticate challenge behavior with protected-resource metadata coupling. FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 remain prior shipped safety boundaries.

Official source context used by FP-0138:

- Model Context Protocol Authorization specification, current draft: used for protected MCP servers as OAuth resource servers, protected-resource metadata discovery, resource indicators, token requirements, per-request token validation, invalid/expired token behavior, insufficient-scope behavior, scope challenge handling, audience/resource validation, and token passthrough prohibition.
- Model Context Protocol Security Best Practices, current version: used for token passthrough risks, audience validation, resource-server validation expectations, least privilege, and defense-in-depth posture.
- RFC 6750, OAuth 2.0 Bearer Token Usage: used for WWW-Authenticate error semantics, `invalid_token`, `insufficient_scope`, and 400/401/403 mapping context.
- RFC 8707, Resource Indicators for OAuth 2.0: used for the `resource` parameter, target resource identity, audience restriction, and multi-tenant resource specificity posture.
- RFC 9728, OAuth 2.0 Protected Resource Metadata: used for protected-resource metadata fields, `resource`, `authorization_servers`, metadata validation, and WWW-Authenticate `resource_metadata` context.
- OpenAI Apps SDK Authentication: used only as platform context for authenticated MCP servers, ChatGPT as OAuth client, protected resource metadata, authorization server metadata, resource parameter echoing, and per-request token verification.
- OpenAI Apps SDK Security & Privacy: used only as platform context for least privilege, explicit user consent, input validation, audit logs, and data minimization.
- OpenAI Apps SDK Deploy your app, Connect from ChatGPT, Test your integration, and Submit and maintain your app: used only as future-readiness context for why deployment, developer-mode connection, integration testing, and public submission remain out of FP-0138 scope.

GitHub connector product behavior is out of scope. Routine `git`, `gh`, push, and PR operations are repository operations, not product GitHub connector behavior.

## Plan of Work

This slice creates exactly one FP-0138 plan, adds the minimum proof-gate bridge accepting that one docs-only token-validation runtime implementation planning file while keeping FP-0139 absent, and refreshes directly stale active docs/plugins wording where the repo still says FP-0138 is absent or future-only.

Allowed source changes are proof-gate helpers/specs under the read-only MCP token-validation, token-validation test-double, invalid-token challenge, WWW-Authenticate, and protected-resource metadata domain families, the new direct proof command `tools/read-only-mcp-token-validation-runtime-implementation-readiness-proof.mjs`, and existing proof tools only where they must accept FP-0138 docs-only planning while rejecting FP-0139 or runtime/auth/token/route drift.

Forbidden scope remains: no token validation runtime, no token parser, no JWT decoder, no token introspection, no invalid-token WWW-Authenticate behavior, no missing-token behavior change, no `/mcp` behavior change, no protected-resource metadata route behavior change, no OAuth/session/auth middleware, no route expansion, no new endpoint, no synthetic test-double route consumption, no real token examples, no JWT-like examples, no Bearer token material, no DB/schema/migration/package/data/source-pack/public-asset/OpenAI/provider/deployment/source/finance-write/external-communication/autonomous-action scope, and no FP-0139.

## Concrete Steps

1. Create `plans/FP-0138-read-only-chatgpt-app-mcp-token-validation-runtime-implementation-planning.md`.
2. Add proof-gate helper contracts for exactly one FP-0138 docs-only token-validation runtime implementation planning plan and FP-0139 absence.
3. Add `tools/read-only-mcp-token-validation-runtime-implementation-readiness-proof.mjs`.
4. Update existing minimum proof tools so FP-0137/0136/0135/0134/0133 proof posture accepts FP-0138 docs-only planning while FP-0139 remains absent.
5. Add focused specs proving the FP-0138 path, boundary, no route/runtime/auth/token widening, local proof-mode envelope recommendation, production runtime blockers, parser/JWT/introspection blockers, invalid-token route blocker, test-double route-consumption blocker, required result envelope fields, and prior boundary preservation.
6. Refresh directly stale active docs/plugins wording only where FP-0138 existence changes the truth.
7. Run focused validation, strict same-branch QA, final validation, closeout updates, one commit, push, and PR creation.

## Validation and Acceptance

Acceptance requires:

- exactly one FP-0138 path exists at `plans/FP-0138-read-only-chatgpt-app-mcp-token-validation-runtime-implementation-planning.md`
- FP-0139 remains absent
- FP-0138 is docs-and-plan/proof-gate compatibility only
- token-validation runtime remains unimplemented
- token parser, JWT decoder, token introspection, token/session storage, OAuth implementation, and auth middleware remain absent
- invalid-token route behavior remains unimplemented
- `/mcp`, protected-resource metadata route behavior, and missing-token behavior remain unchanged
- synthetic test doubles remain proof/test-only and are not consumed by routes
- no real token examples, JWT-like examples, or Bearer token material are added
- planning text explicitly requires validation result envelopes before invalid-token route behavior
- planning text explicitly blocks real production token validation until issuer/audience/resource/scope, user-org-company, revocation/replay, and provider trust gates are proven
- FP-0137, FP-0136, FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 boundaries remain intact

Validation command set:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-readiness.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/app.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

If a post-validation closeout edit is made, rerun `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. If a correction changes proof logic or docs scanned by the direct proof, rerun the focused proof ladder too.

## Idempotence and Recovery

This slice is idempotent because it accepts exactly one FP-0138 docs-only token-validation runtime implementation planning file and rejects FP-0139 or runtime/auth/token/route widening. Re-running the proof should continue to accept the same plan path and absence boundaries.

If proof rejects the slice, patch only the FP-0138 plan text, proof-gate helper, direct proof tool, existing proof-gate bridge compatibility, or directly stale active-doc wording needed to restore truth. If proof detects route/auth/runtime/token material scope, remove that scope and rerun the full ladder. If unrelated dirty files or service failures appear, stop and report the smallest blocker.

Rollback is straightforward: remove this FP-0138 plan, the FP-0138 proof-gate helper/spec additions, the direct FP-0138 proof command, proof-gate bridge edits, and directly stale doc/plugin refreshes. Do not revert FP-0137 or earlier shipped records.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0138-read-only-chatgpt-app-mcp-token-validation-runtime-implementation-planning.md`
- proof-gate helpers/specs under `packages/domain/src/read-only-app-mcp-token-validation*.ts`
- proof-gate compatibility updates in existing read-only MCP proof helpers/tools only as required
- `tools/read-only-mcp-token-validation-runtime-implementation-readiness-proof.mjs`
- directly stale active-doc and `plugins.md` refreshes

Replay implication: FP-0138 creates no mission state changes, ingest actions, reports, approvals, monitoring outputs, external communications, source mutations, finance writes, or durable finance answers. No replay event is required.

Evidence/provenance/freshness implication: FP-0138 creates no raw source, source snapshot, Finance Twin state, CFO Wiki output, evidence bundle, freshness posture change, or finance limitation output. Its proof output is limited to plan/proof boundary booleans and prior-boundary preservation.

No new environment variables, package scripts, migrations, fixtures, datasets, source packs, public assets, screenshots, images, app-submission assets, provider calls, OpenAI API/model calls, deployment config, external artifacts, or FP-0139 are added.

## Interfaces and Dependencies

FP-0138 adds no runtime interface. The only new interface is proof-only: `tools/read-only-mcp-token-validation-runtime-implementation-readiness-proof.mjs` reports booleans proving the FP-0138 planning boundary and prior FP posture.

Future local proof-mode validation result envelope implementation planning may open only after this proof remains green. That future lane must stay token-free and route-free until a later plan explicitly proves route consumption, no-token-echo, invalid-token challenge mapping, and production provider trust.

Upstream proof dependencies: FP-0137, FP-0136, FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 must remain proven. FP-0139 remains absent.

## Outcomes & Retrospective

FP-0138 completed as a docs-and-plan plus proof-gate compatibility planning slice. The verdict is conservative: local proof-mode validation result envelope implementation planning may be the next narrow FP-0139 candidate, production token-validation runtime should wait, invalid-token WWW-Authenticate route behavior remains blocked until validation result envelopes exist, no FP-0138 correction is currently known, and public ChatGPT App submission should wait.

The proof bridge accepts exactly one FP-0138 planning file and keeps FP-0139 absent. It preserves FP-0137 invalid-token implementation readiness, FP-0136 invalid-token contracts, FP-0135 sequencing, FP-0134 synthetic evaluator, FP-0133 test-double contracts, FP-0132 runtime contracts, FP-0131 sequencing, FP-0130 missing-token behavior, and the earlier FP-0128/0127/0125/0107/0106/0100 boundaries.

Commit, push, and PR creation are intentionally pending until the required post-closeout validation rerun completes on this same branch.
