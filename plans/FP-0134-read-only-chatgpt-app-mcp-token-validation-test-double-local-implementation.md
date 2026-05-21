# FP-0134 add read-only ChatGPT App MCP synthetic token-validation test-double evaluator

## Purpose / Big Picture

FP-0134 is the first local-only, proof-backed synthetic token-validation test-double evaluator for future authenticated `/mcp` validation tests. The target phase is V2BB read-only ChatGPT App/MCP token-validation test-double local implementation.

FP-0132 shipped token-validation runtime contracts. FP-0133 shipped token-validation test-double contracts for fixtureless, synthetic, non-token scenarios and then hardened the proof with durable repository-inventory scans. FP-0134 now implements the first evaluator that turns explicit synthetic non-token scenario descriptors into accepted or rejected validation result envelopes.

This is local-only, read-only, proof-backed, and synthetic-scenario-only. It consumes scenario descriptors, not tokens. It returns validation result envelopes, not HTTP route responses. It is not token validation runtime, token parsing runtime, JWT decoding, OAuth implementation, token introspection, token/session storage, auth middleware, invalid-token `WWW-Authenticate` route behavior, missing-token behavior change, protected-resource metadata route behavior change, `/mcp` route behavior change, route expansion, endpoint work, DB/schema/package work, deployment, OpenAI API/model integration, provider execution, source mutation, finance write, external communication, public app submission, public asset generation, or autonomous action. It preserves no route consumption and no `/mcp` route behavior change as explicit proof boundaries.

Boundary phrasing for proof gates: FP-0134 is not token parsing runtime, not JWT decoding, not OAuth implementation, not token introspection, not token/session storage, not auth middleware, and not invalid-token `WWW-Authenticate` route behavior.

The proof point is narrow: predefined synthetic scenario descriptors can be evaluated into tokenless accepted/rejected envelopes across issuer, audience/resource, scope, temporal, revocation/replay, and subject/org/company binding scenario families, including the required rejection taxonomy, while rejecting token-like input and preserving all FP-0133/FP-0132/FP-0131/FP-0130 route/auth boundaries.

## Progress

- [x] 2026-05-21T14:35:52Z: Invoked the repo-local `pocket-cfo-codex-operator` skills requested for this slice: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-21T14:35:52Z: Confirmed branch `codex/v2bb-read-only-chatgpt-app-mcp-token-validation-test-double-local-implementation-local-v1`, clean worktree before edits, PR #309 merged to `main` at 2026-05-20T17:42:47Z, PR #310 proof-durability hardening merged, FP-0133 present, FP-0134 absent, FP-0135 absent, and active docs support FP-0133 as shipped local/proof-only/read-only test-double contracts.
- [x] 2026-05-21T14:35:52Z: Ran the pre-edit proof gate set. `git diff --check` and all existing requested read-only MCP/public/evidence/document proof tools passed before FP-0134 edits.
- [x] 2026-05-21T14:35:52Z: Reviewed current official source context. OpenAI Developers exposed only OpenAI Platform API-key setup tools, not a read-only docs tool, so official web docs were used read-only. No OpenAI key setup, OpenAI API call, model call, provider call, deployment, connector product behavior, or external communication was used.
- [x] 2026-05-21T15:00:12Z: Implemented the local synthetic descriptor evaluator, focused specs, direct proof command, and minimum proof-gate bridge.
- [x] 2026-05-21T15:00:12Z: Refreshed directly stale active docs/plugin notes so FP-0134 is recorded as the local-only/read-only synthetic evaluator boundary while FP-0135 remains absent/future-only.
- [x] 2026-05-21T15:00:12Z: Ran strict same-branch QA and the full requested validation ladder through `pnpm ci:repro:current`; all commands passed. Commit, push, and PR creation remain as repository operations after this closeout.
- [x] 2026-05-21T16:01:25Z: Started the targeted post-merge hardening correction on branch `codex/v2bb-read-only-chatgpt-app-mcp-token-validation-test-double-evaluator-taxonomy-hardening-local-v1`; confirmed PR #311 merged, FP-0134 present, FP-0135 absent, correct branch, clean worktree, GitHub auth, local Postgres/MinIO availability, and required proof-tool presence.
- [x] 2026-05-21T16:01:25Z: Ran the requested pre-edit baseline validation. The FP-0134 local proof, FP-0133 contract proof, FP-0132 runtime contract proof, FP-0131 runtime sequencing proof, FP-0130 missing-token challenge proof, FP-0128 readiness proof, focused domain spec, and focused control-plane `/mcp`/metadata/app specs passed before edits.
- [x] 2026-05-21T16:01:25Z: Hardened evaluator classification so token-material-like rejected input maps to `token-passthrough-attempt`, while malformed non-token descriptor failures remain `malformed`; added focused family coverage, proof fields, and a focused local proof/spec rerun. Final full validation is pending.
- [x] 2026-05-21T16:08:29Z: Ran the full requested post-correction validation ladder through `pnpm ci:repro:current`; all commands passed before this closeout edit. Because this closeout is a post-validation doc edit, the required minimum rerun set is due immediately after this note before commit.

## Surprises & Discoveries

- The current branch starts at `origin/main`, which includes PR #309 and PR #310. PR #309 merged the FP-0133 contract foundation, and PR #310 merged the FP-0133 post-merge proof-durability hardening.
- OpenAI Developers is available only through API-key setup tools in this local thread. Those tools are intentionally unused.
- The FP-0133 direct proof already verifies committed branch diff paths from `origin/main...HEAD`, dirty same-branch QA targets, and durable repository inventory for no test-double runtime, no token parser/JWT decoder/token validation runtime/introspection, no invalid-token runtime, no route consumption, and no token material examples.
- Moving the FP-0134 plan-path constant into the test-double contract boundary avoided an evaluator-to-token-validation inventory import cycle while keeping the evaluator local and pure.
- Existing proof gates needed only bridge allowlist updates and FP-0134 boundary predicates; no route, metadata route, missing-token helper, DB, schema, package script, source, provider, OpenAI, or finance-write scope was required.
- The post-merge correction found the evaluator's non-descriptor catch path was too literal: only rejection reasons containing `credential` mapped to `token-passthrough-attempt`, so Authorization/Bearer/JWT-like rejected strings could be over-classified as generic `malformed`.

## Decision Log

- Decision: FP-0134 implements a synthetic descriptor evaluator, not a token validation runtime. The evaluator accepts only explicit synthetic scenario descriptors created by the FP-0133 contract boundary.
- Decision: The evaluator returns tokenless validation result envelopes. It does not return HTTP status, `WWW-Authenticate` headers, route bodies, JSON-RPC errors, or challenge decisions.
- Decision: Token-like string input, authorization header-like input, `Bearer`-scheme-like input, JWT-like strings, OAuth credential-like strings, session/cookie strings, and provider credential-like strings must be rejected before any scenario evaluation.
- Decision: Any rejection reason representing token material or token-material-like syntax maps to `token-passthrough-attempt`; only descriptor-shape rejection without token material remains `malformed`.
- Decision: Client `companyKey` remains selector-only. For proof wording, companyKey remains selector-only. Accepted envelopes may carry synthetic subject/org/company refs, but client `companyKey` never creates authority.
- Decision: The required rejection taxonomy is `malformed`, `expired`, `wrong-issuer`, `wrong-audience`, `wrong-resource`, `wrong-scope`, `wrong-org`, `wrong-company`, `revoked`, `replayed`, and `token-passthrough-attempt`.
- Decision: Existing `/mcp`, missing-token challenge, invalid-token challenge, and protected-resource metadata behavior must remain unmodified and must not import or consume the evaluator.
- Decision: Proof source scans for the new direct proof must include committed branch diff from `origin/main...HEAD`, dirty same-branch QA target files, and durable repository inventory for no route consumption, no token runtime, and no token material examples.
- Decision: Public ChatGPT App submission, invalid-token route behavior, token validation runtime, OAuth/token/session/auth middleware, remote MCP deployment, Apps SDK resources, DB/schema/package changes, OpenAI API/model/provider calls, source mutation, finance writes, public assets, generated public prose, external communications, autonomous action, and FP-0135 remain blocked.

## Context and Orientation

FP-0130 shipped only a local-only/read-only explicit-dependency missing-token `WWW-Authenticate` challenge seam for existing `POST /mcp`. Default `buildApp()` and default `/mcp` behavior remain unchanged, and Authorization-present requests still fail closed without token parsing or validation.

FP-0131 shipped token-validation and invalid-token runtime sequencing. It held token-validation runtime, token parsing, JWT decoding, invalid-token challenge behavior, OAuth/token/session/auth middleware, remote MCP, public app behavior, and app submission until future contracts and proof gates exist.

FP-0132 shipped the local/proof-only token-validation runtime contract foundation. It proved opaque candidate, no-retention, issuer/audience/resource/scope/temporal/revocation/replay/user/org/company prerequisites, selector-only `companyKey`, no-token-passthrough, no-token-leakage, failure taxonomy, and result-envelope posture without adding runtime behavior.

FP-0133 shipped the local/proof-only token-validation test-double contract foundation. It proved synthetic non-token scenario descriptors, tokenless accepted/rejected envelopes, scenario families, failure taxonomy, selector-only `companyKey`, no-token-passthrough, no-token-leakage, no token material examples, and no runtime consumption. The shipped hardening now makes those proof claims durable in clean post-merge checkouts.

Official read-only source context used by FP-0134:

- Model Context Protocol Authorization specification, current 2025-11-25 page: protocol context for protected-resource metadata, `WWW-Authenticate`, resource indicators, bearer token placement, audience/resource validation, error posture, scope step-up, and token passthrough prohibition.
- Model Context Protocol Security Best Practices: security context for token passthrough risk, audience separation, confused-deputy risk, scope minimization, server-side validation, sessions not being authentication, and local server exposure risk.
- RFC 8707 Resource Indicators for OAuth 2.0: standards context for the `resource` parameter, absolute resource URI posture, and audience restriction.
- RFC 9728 OAuth 2.0 Protected Resource Metadata: standards context for protected-resource metadata, authorization server association, scopes, bearer methods, metadata validation, and `WWW-Authenticate` discovery.
- OpenAI Apps SDK Authentication: platform context for authenticated MCP servers, protected-resource metadata, OAuth 2.1 conformance, resource parameter echoing, and future per-request token checks.
- OpenAI Apps SDK Security & Privacy: platform context for least privilege, explicit consent, server-side validation, audit/log posture, and avoiding secrets or token material in structured content, component props, metadata, and logs.
- OpenAI Apps SDK Build your MCP server, Connect from ChatGPT, and Test your integration: platform context for clean MCP server/tool boundaries, future HTTPS `/mcp` connection, and why this local synthetic evaluator does not implement deployment or public testing behavior.

GitHub connector product behavior is out of scope. Routine `git`, `gh`, push, and PR operations are repository operations, not product GitHub connector work.

## Plan of Work

This slice creates pure domain evaluator code under the existing token-validation test-double bounded context, focused domain specs, one direct proof command, and minimum proof-gate bridge updates so existing proof tools accept exactly this FP-0134 local synthetic evaluator while continuing to reject route/auth/runtime expansion and FP-0135.

No route file, app construction file, metadata route file, missing-token challenge helper, invalid-token challenge helper, database schema, migration, package script, deployment config, public asset, Apps SDK resource, app-submission artifact, fixture, source pack, OpenAI/provider integration, source mutation, finance write, external communication, generated finance advice, runtime-Codex finance output, or autonomous action may be added.

## Concrete Steps

1. Add this plan at `plans/FP-0134-read-only-chatgpt-app-mcp-token-validation-test-double-local-implementation.md`.
2. Add a modular evaluator file under `packages/domain/src/read-only-app-mcp-token-validation-test-double-evaluator.ts` with synthetic scenario descriptor schemas, `buildSyntheticTokenValidationScenario`, `evaluateSyntheticTokenValidationScenario`, and `assertSyntheticScenarioContainsNoTokenMaterial`.
3. Keep the evaluator exported through the existing test-double barrel only if needed by specs and proof commands.
4. Add focused specs proving accepted/rejected envelopes, every required scenario family and failure mode, token-like input rejection, no raw token/JWT/bearer output, no route consumption, missing-token behavior unchanged, invalid-token route behavior absent, FP-0135 absence, and prior FP boundaries.
5. Add `tools/read-only-mcp-token-validation-test-double-local-proof.mjs` with machine-readable JSON output and committed branch diff plus dirty QA source scanning.
6. Patch only existing proof tools needed for exact FP-0134 bridge compatibility while preserving prior no-route/no-runtime/no-token/no-schema/no-package/no-provider assertions.
7. Refresh directly stale active docs/plugin notes only where they still call FP-0134 absent/future-only after this implementation exists.
8. Run focused validation, strict same-branch QA, final validation, close this plan, commit once, push, and open the PR.

## Validation and Acceptance

Acceptance requires:

- exactly one FP-0134 file exists at `plans/FP-0134-read-only-chatgpt-app-mcp-token-validation-test-double-local-implementation.md`
- FP-0135 remains absent
- FP-0134 is local-only/read-only synthetic scenario evaluation only
- evaluator accepts only explicit synthetic scenario descriptors
- evaluator must reject string token input, authorization header-like input, `Bearer`-scheme-like input, JWT-like strings, OAuth credential-like strings, session/cookie strings, and provider credential-like strings
- token-material-like rejected input must map to `token-passthrough-attempt`, while malformed non-token descriptor failures still map to `malformed`
- proof output must include explicit booleans for authorization header, Bearer, JWT-like, OAuth credential, session/cookie, provider credential, malformed non-token descriptor, and no-echo rejection coverage
- accepted synthetic scenario descriptors map to accepted validation result envelopes
- rejected synthetic scenario descriptors map to rejected validation result envelopes
- issuer, audience/resource, scope, temporal, revocation/replay, and subject/org/company binding scenario families are supported
- malformed, expired, wrong-issuer, wrong-audience, wrong-resource, wrong-scope, wrong-org, wrong-company, revoked, replayed, and token-passthrough-attempt outcomes are supported synthetically
- client `companyKey` remains selector-only
- no real token examples, JWT-like examples, `Bearer`-scheme credential content, raw Authorization values, OAuth credential examples, session/cookie examples, provider credential examples, token parser, JWT decoder, token validation runtime, token introspection, token/session storage, OAuth implementation, auth middleware, invalid-token challenge runtime, route consumption, `/mcp` behavior change, metadata route behavior change, missing-token challenge behavior change, DB/schema/package/data/source-pack/OpenAI/provider/source/finance-write/public-asset/autonomous-action scope is added
- FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 boundaries remain proven

Validation command set:

```bash
git diff --check
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
pnpm exec tsx tools/read-only-mcp-oauth-implementation-sequencing-proof.mjs
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
pnpm --filter @pocket-cto/domain exec vitest run src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-www-authenticate.spec.ts src/read-only-app-mcp-www-authenticate-boundary-hardening.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-protected-resource-metadata-route-input.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/service.spec.ts src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/app.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

If a post-validation doc closeout edit is made, rerun `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

## Idempotence and Recovery

This slice is idempotent because it creates exactly one FP-0134 plan, one local evaluator, focused specs, and one direct proof command. Re-running the slice should continue accepting the same synthetic descriptors and continue rejecting token-like input and FP-0135.

If a proof rejects FP-0134, patch only the evaluator proof, proof-gate bridge, or plan wording required to preserve local-only synthetic descriptor truth. If a proof detects runtime/auth/route/token material scope, remove that scope and rerun the full ladder. If unrelated dirty files, missing services, missing proof tools, or auth failures appear, stop and report the narrow blocker.

Rollback is straightforward: remove the FP-0134 plan, evaluator files/specs, direct proof command, proof-gate bridge edits, and directly stale doc/plugin refreshes. Do not revert FP-0133 or earlier shipped records.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0134-read-only-chatgpt-app-mcp-token-validation-test-double-local-implementation.md`
- `packages/domain/src/read-only-app-mcp-token-validation-test-double-evaluator.ts`
- focused test additions in `packages/domain/src/read-only-app-mcp-token-validation-test-double.spec.ts`
- `tools/read-only-mcp-token-validation-test-double-local-proof.mjs`
- proof-gate compatibility edits under existing token-validation/WWW-Authenticate/protected-resource metadata proof files only if needed
- direct active-doc/plugin freshness updates only if stale after FP-0134 exists

Replay implication: this plan creates no mission state changes, ingest actions, reports, approvals, monitoring outputs, external communications, source mutations, finance writes, or durable finance answers. No replay event is required.

Evidence/provenance/freshness implication: this plan creates no raw sources, source snapshots, raw-source mutations, Finance Twin state, CFO Wiki output, evidence bundle, freshness posture change, or finance limitation output. Its proof output is limited to plan/proof boundary booleans and synthetic no-token evaluator checks.

No new environment variables, package scripts, migrations, fixtures, datasets, source packs, public assets, screenshots, images, app-submission assets, provider calls, OpenAI API/model calls, deployment config, external artifacts, or FP-0135 are added.

## Interfaces and Dependencies

The evaluator interface is proof/local-only and synthetic:

- `SyntheticTokenValidationScenarioDescriptor` names a scenario family, scenario outcome, synthetic scenario ID, selector-only `companyKey`, and tokenless synthetic binding refs or rejection details.
- `buildSyntheticTokenValidationScenario` creates predefined descriptor-shaped test doubles without token material.
- `evaluateSyntheticTokenValidationScenario` maps accepted descriptors to accepted envelopes and rejected descriptors to rejected envelopes.
- `assertSyntheticScenarioContainsNoTokenMaterial` must reject token-like strings, header-like strings, `Bearer`-scheme/JWT-like/OAuth/session/cookie/provider credential-like content, or envelope token leakage.

Upstream proof dependencies: FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 must remain proven. FP-0135 remains absent.

## Outcomes & Retrospective

Closed for implementation and validation on 2026-05-21T15:00:12Z.

Implemented:

- local synthetic descriptor evaluator in `packages/domain/src/read-only-app-mcp-token-validation-test-double-evaluator.ts`
- focused domain tests in `packages/domain/src/read-only-app-mcp-token-validation-test-double.spec.ts`
- direct machine-readable proof in `tools/read-only-mcp-token-validation-test-double-local-proof.mjs`
- proof-gate bridge compatibility for FP-0134 while preserving FP-0133/FP-0132/FP-0131/FP-0130 and older boundaries
- direct active-doc/plugin freshness updates for FP-0134 shipped-state wording

Validation passed:

- `git diff --check`
- every requested read-only MCP/public/security/evidence/document proof command, including the new FP-0134 local proof
- focused domain and control-plane spec ladders
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Posture retained:

- no token parser, JWT decoder, token validation runtime, token introspection, token/session storage, OAuth implementation, auth middleware, invalid-token challenge runtime, route consumption, `/mcp` route behavior change, protected-resource metadata route behavior change, missing-token behavior change, DB/schema/package/data/source-pack/OpenAI/provider/source/finance-write/public-asset/autonomous-action scope
- no real token examples, JWT-like examples, `Bearer`-scheme credential content, raw Authorization values, OAuth credential examples, session/cookie examples, or provider credential examples accepted or emitted by the evaluator
- FP-0135 remains absent

Recommendation: invalid-token challenge sequencing may start next only as a new narrow Finance Plan after this branch is merged; public ChatGPT App submission should continue to wait.

Post-merge evaluator-taxonomy hardening correction closed on 2026-05-21T16:08:29Z before the required post-closeout rerun set. The correction keeps FP-0134 as a local-only/read-only synthetic descriptor evaluator and changes only evaluator classification, focused domain coverage, proof fields, the direct local proof, this plan, and the directly stale plugin usage note.

Corrected:

- token-material-like rejected input now maps to `token-passthrough-attempt`
- Authorization header-like, Bearer token-like, JWT-like, OAuth access/refresh/client credential-like, session/cookie-like, and provider credential-like rejected inputs are each covered by focused tests and proof booleans
- rejected token-material-like input is not echoed and does not carry raw token, Authorization header, or JWT claim flags
- malformed non-token descriptor input remains classified as `malformed`

Validation passed before this closeout edit:

- the full requested proof ladder from `git diff --check` through `pnpm ci:repro:current`
- the focused domain and control-plane spec ladders
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Posture retained: no route behavior change, protected-resource metadata route behavior change, missing-token behavior change, invalid-token runtime, route consumption, token parser, JWT decoder, token validation runtime, token introspection, token/session storage, OAuth implementation, auth middleware, DB/schema/package/data/source-pack drift, OpenAI API/model call, provider call, deployment, source mutation, finance write, public asset, app-submission artifact, autonomous action, or FP-0135.
