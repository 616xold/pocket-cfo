# FP-0131 plan token-validation and invalid-token runtime sequencing

## Purpose / Big Picture

FP-0131 is a docs-and-plan plus proof-gate compatibility master plan for token-validation and invalid-token runtime sequencing after FP-0130. The target phase is V2AY read-only ChatGPT App/MCP token-validation runtime sequencing.

The user-visible proof point is a safe sequencing decision before any runtime token work starts. FP-0130 shipped a local-only/read-only explicit-dependency missing-token `WWW-Authenticate: Bearer` challenge seam for existing `POST /mcp`, and FP-0131 decides what must happen before token-validation runtime, token parsing, invalid-token challenge behavior, OAuth/token/session implementation, auth middleware, remote MCP, public app behavior, or app submission can open.

This is not token validation runtime implementation. This is not token parsing runtime implementation. This is not OAuth implementation. This is not token/session storage. This is not auth middleware implementation. This is not invalid-token `WWW-Authenticate` route behavior implementation. FP-0131 does not parse tokens, does not validate tokens, does not decode JWTs, does not store tokens, does not implement OAuth, does not implement sessions, does not add auth middleware, does not implement invalid-token challenge behavior, does not change `/mcp`, does not change protected-resource metadata route behavior, does not add routes, and does not create FP-0132.

## Progress

- [x] 2026-05-18T09:12:55Z: Invoked the requested repo-local `pocket-cfo-codex-operator` skills: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-18T09:12:55Z: Confirmed branch `codex/v2ay-read-only-chatgpt-app-mcp-token-validation-invalid-token-runtime-sequencing-master-plan-local-v1`, clean worktree before edits, PR #305 merged to `main` on 2026-05-18T01:03:46Z, FP-0130 present, FP-0131 absent, and FP-0132 absent.
- [x] 2026-05-18T09:12:55Z: Ran pre-edit gates for token-validation readiness, missing-token challenge, WWW-Authenticate auth challenge, protected-resource metadata local route, protected-resource metadata route input, and route adapter proof; all passed before FP-0131 edits.
- [x] 2026-05-18T09:12:55Z: Reviewed current official MCP Authorization, MCP Security Best Practices, RFC 9728, and OpenAI Apps SDK authentication/security/deploy/submission docs as read-only planning context. No OpenAI API call, model call, provider call, or connector product behavior was used.
- [x] 2026-05-18T09:12:55Z: Opened FP-0131 as the one active docs-and-plan/proof-gate compatibility plan.
- [x] 2026-05-18T09:36:08Z: Added proof-gate bridge and focused tests that accept exactly FP-0131 as docs-only while FP-0132 remains absent.
- [x] 2026-05-18T09:36:08Z: Refreshed directly stale active docs/plugin notes where FP-0131 shifted from absent to docs-and-plan/proof-gate compatibility only.
- [x] 2026-05-18T09:36:08Z: Ran the required validation ladder on this branch and patched proof-bridge compatibility defects in the same branch.
- [x] 2026-05-18T09:36:08Z: Closed FP-0131 as PR-ready pending the final post-closeout validation pass, one commit, push, and PR publication.

## Surprises & Discoveries

- PR #305 is merged and the FP-0130 metadata-route co-registration hardening is present. The missing-token challenge dependency requires accepted protected-resource metadata route-input evidence before it can advertise `/.well-known/oauth-protected-resource/mcp`.
- Current official MCP Authorization docs state that authenticated HTTP MCP servers act as OAuth resource servers, must validate access tokens for their own resources, and must not accept or transit unrelated tokens. This reinforces the FP-0131 decision that token passthrough and generic invalid-token challenges without validation remain blocked.
- OpenAI Apps SDK authentication docs expect authenticated MCP servers to implement OAuth 2.1 conforming to the MCP authorization spec and to verify access tokens on each request. This reinforces that local FP-0130 proof-mode behavior is not public ChatGPT App auth.

## Decision Log

- Decision: Token-validation runtime cannot start from current repo truth. The repo has missing-token challenge proof, route-input metadata proof, and token-validation readiness contracts, but it still lacks issuer/audience/resource/scope validation contracts, an exact public canonical resource URI, authorization-server/provider decision, authenticated user/org/company binding runtime, token redaction/logging runtime proof, and invalid-token semantic proof gates.
- Decision: Invalid-token challenge behavior cannot be implemented before token-validation runtime. A generic invalid-token no-validation challenge would imply token interpretation without validation and is blocked.
- Decision: Token parsing cannot start before issuer/audience/resource/scope validation contracts exist. Parsing or decoding authorization credentials without validation contracts creates leakage and passthrough risk.
- Decision: Malformed, expired, wrong-audience, wrong-resource, wrong-scope, wrong-org, revoked, replayed, and token-passthrough-attempt handling remains later runtime-only after token-validation runtime contracts exist.
- Decision: No token material may be inspected in FP-0131. Future runtime interfaces may inspect only the minimum authorization envelope needed to validate issuer, audience, resource, scope, expiry, revocation, replay, org/user/company binding, and no-token-passthrough posture; raw token values must never enter logs, docs examples, headers, bodies, proof output, evidence, structured results, UI props, or route responses.
- Decision: Authenticated company binding gates `companyKey`. Client-supplied `companyKey` remains a selector only and cannot create authority without authenticated user/org/company binding.
- Decision: Local-only proof-mode token validation without remote/public host remains blocked until a future FP proves it can operate on synthetic/non-token test doubles without parsing, storing, forwarding, or logging real token material.
- Decision: Future FP-0132 may open only if it remains narrow and starts with contracts/proofs, not runtime route behavior. Public ChatGPT App submission should wait.

## Context and Orientation

FP-0125 shipped the local protected-resource metadata route at `/.well-known/oauth-protected-resource/mcp`, registered only when app construction supplies valid FP-0123 route-input evidence. Default `buildApp()` leaves that route absent.

FP-0127 shipped proof-only WWW-Authenticate contract helpers. FP-0128 shipped proof-only token-validation failure readiness contracts. FP-0129 decided missing-token challenge behavior may precede token-validation runtime, but invalid-token semantics must stay in the later token-validation lane. FP-0130 then implemented only a local-only/read-only missing-token challenge seam for existing `POST /mcp`, explicitly dependency-gated and co-registered with accepted metadata route-input evidence. Authorization-present requests fail closed without token parsing or validation.

Official read-only protocol and platform context used by this plan:

- Model Context Protocol Authorization specification: current context for protected-resource metadata, Bearer scheme placement, access token validation, audience/resource binding, error handling, scope challenges, and token-passthrough prohibition.
- Model Context Protocol Security Best Practices: current context for token passthrough, least privilege, sessions not being authentication, local server risk, and server-side validation.
- RFC 9728 OAuth 2.0 Protected Resource Metadata: standards context for protected-resource metadata and the `resource_metadata` `WWW-Authenticate` parameter.
- OpenAI Apps SDK Authentication, Security & Privacy, Deploy your app, and App submission guidelines: platform context for OAuth 2.1 expectations, verifying scopes/tokens on tool calls, stable HTTPS `/mcp`, data handling, and why public app behavior/submission remain future-only.

GitHub connector product behavior is out of scope. Routine `git`, `gh`, push, and PR operations are repository operations, not product GitHub connector work.

## Plan of Work

This slice is docs-and-plan plus proof-gate compatibility only. It creates the FP-0131 plan, updates proof-gate helpers to accept exactly one FP-0131 docs-only token-validation runtime sequencing plan while FP-0132 remains absent, and refreshes directly stale active docs/plugin notes if they still call FP-0131 absent or future-only after the plan exists.

No route file, app construction file, metadata route file, database schema, migration, package script, deployment config, public asset, Apps SDK resource, app-submission artifact, source pack, fixture, OpenAI/provider integration, source mutation, finance write, external communication, or autonomous action may be added.

## Concrete Steps

1. Add this plan at `plans/FP-0131-read-only-chatgpt-app-mcp-token-validation-invalid-token-runtime-sequencing-master-plan.md`.
2. Add proof-gate compatibility helpers under the existing read-only app MCP WWW-Authenticate/token-validation proof boundary so exactly this FP-0131 path is accepted and any FP-0132 path is rejected.
3. Add `tools/read-only-mcp-token-validation-runtime-sequencing-proof.mjs` to prove the FP-0131 docs-only boundary, no route behavior change, no invalid-token runtime, no token parsing/validation/session/auth/OAuth runtime, no DB/schema/package/deployment/public/provider/source/finance scope, no-token-passthrough, no-token-leakage, authenticated company binding, and prior boundary preservation.
4. Update focused domain specs for token-validation and WWW-Authenticate proof-gate compatibility.
5. Update existing proof tools only as a proof bridge from FP-0131 absent to FP-0131 absent-or-docs-only plus FP-0132 absent.
6. Patch directly stale active docs/plugin notes only where they still say FP-0131 remains absent or blocked.
7. Run validation, update this plan closeout, commit once, push, and open the PR.

## Validation and Acceptance

Acceptance requires:

- exactly one FP-0131 file exists at `plans/FP-0131-read-only-chatgpt-app-mcp-token-validation-invalid-token-runtime-sequencing-master-plan.md`
- FP-0132 remains absent
- FP-0131 is docs-and-plan/proof-gate only
- no `/mcp` behavior changed
- no protected-resource metadata route behavior changed
- no missing-token challenge behavior changed
- no invalid-token challenge runtime exists
- no token parsing runtime, token validation runtime, token/session storage, OAuth implementation, auth middleware, DB query, schema migration, package script, deployment config, remote MCP, Apps SDK resource, public app behavior, app submission, fixture, source pack, public asset, OpenAI API/model call, provider call, source mutation, finance write, external communication, generated finance advice, runtime-Codex finance output, or autonomous action was added
- planning text covers invalid-token sequencing, semantic failure cases, no-token-passthrough, no-token-leakage, authenticated company binding, future runtime interfaces, local-only proof-mode token validation, and the future FP-0132 gate
- FP-0130, FP-0128, FP-0127, FP-0125, FP-0123, FP-0122, FP-0120, FP-0107, FP-0106, and FP-0100 boundaries remain proven

Validation command set:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-www-authenticate.spec.ts src/read-only-app-mcp-www-authenticate-boundary-hardening.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-protected-resource-metadata-route-input.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/service.spec.ts src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/app.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

If a validation correction changes code or docs after closeout, rerun the affected proof/spec and the final full validation ladder on the same branch.

## Idempotence and Recovery

This slice is idempotent because it creates exactly one plan and proof-gate bridge. Re-running the slice should keep the same FP-0131 path and continue rejecting FP-0132.

If a proof rejects FP-0131, patch only the proof-gate bridge or the plan wording required to preserve docs-only truth. If a proof detects runtime/auth/route scope, remove that scope and rerun the full ladder. If unrelated dirty files, missing services, missing proof tools, or auth failures appear, stop and report the narrow blocker.

Rollback is straightforward: remove the FP-0131 plan, the FP-0131 proof command, proof-gate bridge edits, focused spec edits, and direct stale-doc refreshes. Do not revert FP-0130.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0131-read-only-chatgpt-app-mcp-token-validation-invalid-token-runtime-sequencing-master-plan.md`
- proof-gate compatibility helpers under existing read-only app MCP token-validation/WWW-Authenticate proof files
- `tools/read-only-mcp-token-validation-runtime-sequencing-proof.mjs`
- focused domain proof-gate tests
- direct active-doc/plugin freshness updates only if stale after FP-0131 exists

Replay implication: this plan does not create mission state changes, ingest actions, reports, approvals, monitoring outputs, external communications, source mutations, finance writes, or durable finance answers. No replay event is required.

Evidence/provenance/freshness implication: this plan creates no raw sources, source snapshots, raw-source mutations, Finance Twin state, CFO Wiki output, evidence bundle, freshness posture change, or finance limitation output. Its proof output is limited to plan/proof boundary booleans and no-token-leakage checks.

No new environment variables, package scripts, migrations, fixtures, source packs, public assets, screenshots, images, app-submission assets, provider calls, OpenAI API/model calls, or external artifacts are added.

## Interfaces and Dependencies

Future runtime interfaces may be allowed only in a later plan after FP-0131 proof gates pass. The allowed future shape is contract-first and names only data flow, not implementation:

- `TokenValidationRuntimeCandidate`: an opaque bearer-envelope candidate captured from a request without logging or forwarding raw token material.
- `TokenValidationResult`: an accepted or rejected validation result with issuer, audience, resource, scopes, expiry, revocation/replay, authenticated user/org/company binding, and limitation posture, with no raw token value.
- `TokenFailureChallengeDecision`: a post-validation decision for missing, invalid, malformed, expired, wrong-audience, wrong-resource, wrong-scope, wrong-org, revoked, replayed, and token-passthrough-attempt cases, separated from JSON-RPC refusal semantics.
- `AuthenticatedCompanyBinding`: the only future authority for binding an authenticated user/org/company to a `companyKey`; the client `companyKey` remains selector-only.
- `NoTokenLeakageProof`: proof that logs, headers, body, proof output, docs examples, metadata, challenge headers, route responses, evidence, structured results, and UI props contain no token values, sessions, cookies, credentials, raw finance data, raw source dumps, provider credentials, OpenAI keys, or app-submission copy.

These names are future-interface planning labels only. No package export, runtime helper, route import, middleware, parser, validator, storage layer, DB query, schema, migration, package script, deployment config, public asset, Apps SDK resource, OpenAI/provider call, source mutation, finance write, or autonomous action is implemented in FP-0131.

Upstream proof dependencies: FP-0130, FP-0128, FP-0127, FP-0125, FP-0123, FP-0122, FP-0120, FP-0107, FP-0106, and FP-0100 must remain proven. FP-0132 remains absent.

## Outcomes & Retrospective

FP-0131 closes as a docs-and-plan plus proof-gate compatibility slice. The branch added the single FP-0131 plan, proof-gate bridge fields, focused domain coverage, and the `read-only-mcp-token-validation-runtime-sequencing-proof` command while keeping FP-0132 absent.

The plan decision is deliberately conservative: token-validation runtime contracts may be planned next, but token parsing, token validation runtime, invalid-token route behavior, OAuth/token/session implementation, auth middleware, remote/public deployment, Apps SDK resources, public app submission, DB/schema/package changes, OpenAI/provider calls, source mutation, finance writes, and autonomous action remain blocked.

Same-branch validation passed before this closeout edit: `git diff --check`; all required read-only MCP/proof tools including the new FP-0131 runtime sequencing proof; focused domain token-validation, WWW-Authenticate, protected-resource metadata, and route-input specs; focused control-plane `/mcp` and metadata route specs; `pnpm lint`; `pnpm typecheck`; `pnpm test`; and `pnpm ci:repro:current`. Final post-closeout validation must rerun before commit.

No replay event is required because FP-0131 creates no mission state change, ingest action, report, approval, monitoring output, external communication, source mutation, finance write, or durable finance answer. No archive or active-doc boundary was moved beyond marking FP-0131 as the closed docs-only plan and keeping FP-0132/runtime/public submission future-only.
