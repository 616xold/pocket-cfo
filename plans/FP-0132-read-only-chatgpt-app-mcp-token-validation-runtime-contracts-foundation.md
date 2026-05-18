# FP-0132 add read-only ChatGPT App MCP token-validation runtime contracts

## Purpose / Big Picture

FP-0132 is the local/proof-only/read-only token-validation runtime contract foundation for the future remote/public read-only ChatGPT App/MCP path. The target phase is V2AZ read-only ChatGPT App/MCP token-validation runtime contract foundations.

The user-visible proof point is contract clarity before any runtime token validation starts. FP-0131 shipped the docs-and-plan plus proof-gate compatibility master plan for token-validation and invalid-token runtime sequencing after FP-0130. FP-0132 now adds pure domain contracts and proof tooling for the future validation boundary: opaque bearer-token candidate handling, no raw token value retention, issuer and audience/resource prerequisites, canonical resource URI dependency, scope minimization, temporal checks, revocation/replay posture, authenticated user/org/company binding, no-token-passthrough, no-token-leakage, and result envelope shape.

This is not token validation runtime implementation. This is not token parsing runtime implementation. This is not JWT decoding. This is not OAuth implementation. This is not token/session storage. This is not auth middleware implementation. This is not invalid-token `WWW-Authenticate` route behavior implementation. FP-0132 does not parse, decode, validate, introspect, store, forward, or log any real token. FP-0132 does not change `/mcp`, does not change protected-resource metadata route behavior, does not change missing-token challenge behavior, and does not change default `buildApp()`, routes, schemas, migrations, package scripts, deployment config, public app behavior, OpenAI/provider integration, source truth, finance outputs, or autonomous action. FP-0133 remains absent.

## Progress

- [x] 2026-05-18T15:02:17Z: Invoked the repo-local `pocket-cfo-codex-operator` skills requested for this slice: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-18T15:02:17Z: Confirmed branch `codex/v2az-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-foundation-local-v1`, clean worktree before edits, PR #307 merged to `main` at 2026-05-18T09:45:45Z, FP-0131 present, FP-0132 absent, and FP-0133 absent.
- [x] 2026-05-18T15:02:17Z: Ran pre-edit proof gates for FP-0131 token-validation runtime sequencing, FP-0128 token-validation readiness, FP-0130 missing-token challenge, FP-0127 WWW-Authenticate auth challenge, FP-0125 protected-resource metadata local route, FP-0123 route-input evidence, FP-0107 route adapter, and focused control-plane `/mcp` plus metadata-route specs; all passed before FP-0132 edits.
- [x] 2026-05-18T15:02:17Z: Reviewed current official MCP/OpenAI/RFC source context. Tool discovery exposed OpenAI Platform key setup only, not a read-only OpenAI Developers docs tool; no OpenAI API key setup, OpenAI API call, model call, provider call, deployment, or connector product behavior was used.
- [x] 2026-05-18T15:25:59Z: Created pure domain runtime-contract foundations and focused specs for opaque auth candidates, non-retention, issuer/audience/resource/scope/temporal/revocation/replay/user/org/company prerequisites, no-token-passthrough, no-token-leakage, result envelopes, and deferred runtime posture.
- [x] 2026-05-18T15:25:59Z: Added the direct FP-0132 proof command and proof-gate bridge so exactly this local/proof-only FP-0132 contract plan is accepted while FP-0133 remains absent.
- [x] 2026-05-18T15:25:59Z: Refreshed directly stale active docs/plugin notes and polished the FP-0131 closeout freshness wording on this same branch.
- [x] 2026-05-18T15:25:59Z: Ran focused bridge validation for the new direct proof, FP-0131 runtime sequencing proof, FP-0128 token-validation readiness proof, FP-0127 WWW-Authenticate auth challenge proof, FP-0130 missing-token challenge proof, FP-0125 protected-resource metadata local route proof, protected-resource metadata proof, OAuth sequencing proof, domain typecheck, and the new FP-0132 domain spec; all passed after same-branch proof-filter corrections.
- [x] 2026-05-18T15:52:22Z: Ran the full proof replay, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed. Closing this plan before the one requested commit, push, and PR.
- [x] 2026-05-18T16:05:15Z: Same-branch QA found and patched a proof durability gap: the direct FP-0132 proof and adjacent FP-0131/FP-0127/FP-0117 bridge tools now audit committed branch diff paths from `origin/main...HEAD` plus dirty QA target files instead of relying only on the clean worktree/HEAD diff.
- [x] 2026-05-18T16:11:13Z: Same-branch QA validation passed after the proof durability correction: all requested proof tools, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` were green on the corrected branch.

## Surprises & Discoveries

- PR #307 is merged into `main`, and this branch starts at that merge commit.
- FP-0131 is shipped but still has one stale closeout sentence saying final post-closeout validation must rerun before commit. That wording will be polished in this branch because the prior PR has already merged and FP-0132 will run its own pre-edit and final gates.
- The current MCP Authorization specification is the 2025-11-25 version. It keeps token validation, resource indicators, protected-resource metadata, `WWW-Authenticate` discovery, insufficient-scope handling, and token passthrough prohibition squarely in the future runtime boundary. FP-0132 should encode those as prerequisites only.
- Tool discovery found OpenAI Platform API-key setup tools, not read-only OpenAI Developers docs tools. Official web docs were used instead.
- Existing post-merge inventory scans needed narrow FP-0132 bridge updates so they accepted the new contract plan and proof command as proof-only scope without treating proof regex text as OpenAI/model usage.
- Older proof inventories also needed exact FP-0132 bridge allowances for the new contract plan and direct proof command. The fixes stayed in proof-gate compatibility paths and did not change route, metadata, missing-token, auth, OAuth, token parsing, token validation, DB, schema, package, deployment, OpenAI, provider, source, or finance-write behavior.
- Same-branch QA found that several proof tools could pass with an empty changed-path set after the FP-0132 branch was committed because they only inspected worktree or `HEAD` diffs. The correction keeps the proof local and read-only while making committed PR changes visible to the no-route/no-runtime/no-schema/no-package/no-provider assertions.

## Decision Log

- Decision: FP-0132 implements local/proof-only contract foundations only. It may name future validation inputs and outputs, but it must not inspect, parse, decode, validate, introspect, store, forward, log, or echo real token material.
- Decision: The future opaque bearer-token candidate boundary may record only redacted presence, source, and structural posture. It must not retain raw token values, authorization header values, JWT-like material, session material, cookie material, OpenAI keys, provider credentials, raw finance examples, raw source dumps, structured tool result token values, UI props token values, route-body token values, metadata token values, proof-output token values, challenge-header token values, or app metadata token values.
- Decision: Issuer validation, audience/resource validation, canonical resource URI dependency, read-only scope validation, expiry/not-before/time-skew validation, revocation/replay validation, authenticated subject binding, and authenticated company binding are required future contract prerequisites, not runtime checks in this slice.
- Decision: `companyKey` remains selector-only; companyKey remains selector-only in the plain-text proof wording too. It cannot create authority without authenticated user/org/company binding.
- Decision: Future audience/resource validation requires an exact stable HTTPS canonical resource URI; localhost, query strings, fragments, and selector values such as `companyKey` cannot become authority.
- Decision: The future failure taxonomy must cover wrong-issuer, wrong-audience, wrong-resource, wrong-scope, wrong-org, wrong-company, revoked, and replayed token postures, but FP-0132 maps none of them to route status or `WWW-Authenticate` behavior.
- Decision: Token passthrough is forbidden. A future validation result must never carry a token value or allow downstream token transit.
- Decision: Invalid-token challenge runtime remains deferred. FP-0132 does not add `WWW-Authenticate` invalid-token behavior, route status behavior, route paths, route imports, or middleware.
- Decision: OAuth, sessions, auth middleware, remote MCP, public ChatGPT App behavior, Apps SDK resources, app submission, DB/schema/package/deployment/provider/OpenAI/source/finance-write scope, public assets, generated public prose, and FP-0133 remain blocked.
- Decision: FP-0132 QA proof scope detection must include committed branch changes and dirty same-branch QA target files. Clean committed branches must not make scope proofs vacuously pass with an empty changed-path inventory.

## Context and Orientation

FP-0130 shipped a local-only/read-only explicit-dependency missing-token `WWW-Authenticate` challenge seam for existing `POST /mcp`. Default `buildApp()` and default `/mcp` behavior remain unchanged, and challenge behavior is enabled only when explicit app construction co-supplies the accepted protected-resource metadata route-input evidence bundle. Authorization-present requests still fail closed without token parsing or validation.

FP-0131 shipped a docs-and-plan/proof-gate compatibility master plan that says token-validation runtime, token parsing, invalid-token challenge behavior, OAuth/token/session/auth middleware, remote MCP, public app behavior, and app submission remain blocked until future contracts and proof gates exist. FP-0132 is that next contract foundation, not the runtime implementation.

Official source context used by FP-0132:

- Model Context Protocol Authorization specification, version 2025-11-25: current protocol context for protected-resource metadata, resource parameter use, canonical resource URI, access token placement, token validation prerequisites, invalid/expired token status posture, insufficient-scope challenge posture, audience/resource validation, and token passthrough prohibition.
- Model Context Protocol Security Best Practices: current security context for token passthrough risks, audience separation, confused-deputy risk, scope minimization, server-side validation, and local server compromise posture.
- RFC 8707 Resource Indicators for OAuth 2.0: standards context for the `resource` parameter, absolute URI requirements, audience-restricted access tokens, and why a protected resource needs a precise canonical resource identity.
- RFC 9728 OAuth 2.0 Protected Resource Metadata: standards context for protected-resource metadata fields, `resource_metadata` discovery via `WWW-Authenticate`, scopes, TLS, authorization-server association, and audience-restricted access token recommendations.
- OpenAI Apps SDK Authentication: platform context for authenticated MCP servers, protected-resource metadata, OAuth 2.1 conformance, resource parameter echoing, and future per-request token checks for issuer, audience, expiration, and scopes.
- OpenAI Apps SDK Security & Privacy: platform context for least privilege, explicit consent, server-side validation, audit logs, and avoiding secrets or tokens in structured content/component props/logs.
- OpenAI MCP/Apps SDK connect/deploy/test/submission docs: platform context for future HTTPS `/mcp`, testing, and public submission readiness. These remain future-only in FP-0132.

GitHub connector product behavior is out of scope. Routine `git`, `gh`, push, and PR operations are repository operations, not product GitHub connector work.

## Plan of Work

This slice adds one Finance Plan, pure domain contracts/builders/proof schemas under `packages/domain`, one direct proof command under `tools`, focused domain specs, and the minimum proof-gate bridge so the repo accepts exactly this FP-0132 local/proof-only token-validation runtime contract foundation while FP-0133 remains absent.

No route file, app construction file, metadata route file, missing-token challenge helper, database schema, migration, package script, deployment config, public asset, Apps SDK resource, app-submission artifact, source pack, fixture, OpenAI/provider integration, source mutation, finance write, external communication, generated finance advice, runtime-Codex finance output, or autonomous action may be added.

## Concrete Steps

1. Add this plan at `plans/FP-0132-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-foundation.md`.
2. Patch the stale FP-0131 closeout line that still describes pre-merge validation as pending.
3. Add pure token-validation runtime contract schemas and builders under `packages/domain/src/read-only-app-mcp-token-validation-runtime*.ts`.
4. Export the new domain contracts from `packages/domain/src/index.ts` only as needed by proof tools and specs.
5. Add focused specs proving the exact FP-0132 path is accepted, FP-0133 remains absent, no runtime scope exists, validation prerequisites are required, raw token material is rejected from all named surfaces, token passthrough is forbidden, and prior boundaries remain intact.
6. Add `tools/read-only-mcp-token-validation-runtime-contract-proof.mjs` with machine-readable JSON output.
7. Update minimal proof gates from FP-0132-absent-only to FP-0132-absent-or-local-token-validation-runtime-contracts while keeping FP-0133 absent.
8. Refresh directly stale active docs/plugins notes only where they still call FP-0132 absent after this plan exists.
9. Run focused validation, strict same-branch QA, final validation, close this plan, commit once, push, and open the PR.

## Validation and Acceptance

Acceptance requires:

- exactly one FP-0132 file exists at `plans/FP-0132-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-foundation.md`
- FP-0133 remains absent
- FP-0132 is local/proof-only/read-only contract work
- pure contracts exist for all required FP-0132 boundaries and the future result envelope
- issuer, audience/resource, canonical resource URI, scope, expiry, not-before/time-skew, revocation/replay, user/org/company binding, no-token-passthrough, no-token-leakage, and no-token-retention prerequisites are proven
- raw token values cannot appear in logs, proof output, docs examples, route responses, evidence, structured tool results, UI props, metadata examples, challenge headers, route bodies, route headers, app metadata, or public examples
- client `companyKey` remains selector-only and cannot create authority
- no `/mcp` behavior changes
- no protected-resource metadata route behavior changes
- no missing-token challenge behavior changes
- no invalid-token challenge runtime, token parsing runtime, token validation runtime, JWT decoding, token/session storage, OAuth implementation, auth middleware, route paths, DB/schema/package/data/source-pack/OpenAI/provider/source/finance-write/public-asset/autonomous-action scope
- FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0123, FP-0122, FP-0120, FP-0107, FP-0106, and FP-0100 boundaries remain proven

Validation command set:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-www-authenticate.spec.ts src/read-only-app-mcp-www-authenticate-boundary-hardening.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-protected-resource-metadata-route-input.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/service.spec.ts src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/app.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

If a validation correction changes code or docs after closeout, rerun `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` on the same branch.

## Idempotence and Recovery

This slice is idempotent because it creates exactly one FP-0132 plan, exactly one new direct proof command, and pure contract files. Re-running the slice should continue accepting the same FP-0132 path and continue rejecting any FP-0133 path.

If a proof rejects FP-0132, patch only the contract proof, proof-gate bridge, or plan wording required to preserve local/proof-only truth. If a proof detects runtime/auth/route scope, remove that scope and rerun the full ladder. If unrelated dirty files, missing services, missing proof tools, or auth failures appear, stop and report the narrow blocker.

Rollback is straightforward: remove the FP-0132 plan, FP-0132 domain contract files/specs, the direct FP-0132 proof command, proof-gate bridge edits, focused spec edits, direct stale-doc refreshes, and the FP-0131 closeout polish. Do not revert FP-0130 or FP-0131 shipped records.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0132-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-foundation.md`
- `packages/domain/src/read-only-app-mcp-token-validation-runtime*.ts`
- `packages/domain/src/read-only-app-mcp-token-validation-runtime*.spec.ts`
- proof-gate compatibility helpers under existing read-only app MCP token-validation/WWW-Authenticate proof files
- `tools/read-only-mcp-token-validation-runtime-contract-proof.mjs`
- direct active-doc/plugin freshness updates only if stale after FP-0132 exists

Replay implication: this plan creates no mission state changes, ingest actions, reports, approvals, monitoring outputs, external communications, source mutations, finance writes, or durable finance answers. No replay event is required.

Evidence/provenance/freshness implication: this plan creates no raw sources, source snapshots, raw-source mutations, Finance Twin state, CFO Wiki output, evidence bundle, freshness posture change, or finance limitation output. Its proof output is limited to plan/proof boundary booleans and no-token-leakage checks.

No new environment variables, package scripts, migrations, fixtures, source packs, public assets, screenshots, images, app-submission assets, provider calls, OpenAI API/model calls, or external artifacts are added.

## Interfaces and Dependencies

The new contract interface is proof-only and local:

- `McpOpaqueBearerTokenCandidateBoundary` records that future validation may receive an opaque candidate boundary without storing token values.
- `McpTokenMaterialNonRetentionBoundary` proves raw token material is not retained in any current contract.
- `McpIssuerValidationContractBoundary` requires future issuer allowlist/discovery proof before validation can be accepted.
- `McpAudienceResourceValidationContractBoundary` requires audience and resource binding to the future canonical MCP resource URI.
- `McpCanonicalResourceUriDependencyBoundary` keeps the canonical public resource URI unresolved as a dependency.
- `McpScopeValidationContractBoundary` limits future scopes to the read-only minimum and treats challenged scopes as operation-specific, not permission widening.
- `McpTokenTemporalValidationContractBoundary` requires expiry, not-before, and time-skew posture.
- `McpRevocationReplayValidationContractBoundary` requires revoked/replayed-token failure posture.
- `McpAuthenticatedSubjectBindingBoundary` and `McpAuthenticatedCompanyBindingBoundary` require authenticated user/org/company binding before `companyKey` can select company data.
- `McpNoTokenPassthroughBoundary` forbids forwarding inbound client tokens to downstream services.
- `McpNoTokenLeakageRuntimeBoundary` forbids token material in logs, proofs, docs examples, route bodies, route headers, metadata, evidence, structured tool results, UI props, app metadata, or challenge headers.
- `McpTokenValidationResultEnvelopeBoundary` defines a future accepted/rejected result envelope with no token material.
- `McpTokenValidationRuntimeDeferredBoundary` proves token parsing, JWT decoding, validation runtime, invalid-token challenge runtime, OAuth/session/auth middleware, DB/schema/package/deployment/public-app/OpenAI/provider/source/finance-write behavior remains absent.

Upstream proof dependencies: FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0123, FP-0122, FP-0120, FP-0107, FP-0106, and FP-0100 must remain proven. FP-0133 remains absent.

## Outcomes & Retrospective

FP-0132 is implemented as local/proof-only/read-only contract work. The slice added pure domain contracts and direct proof tooling for future token-validation runtime boundaries, including issuer, audience/resource, canonical resource URI, scope, temporal, revocation/replay, authenticated subject/company binding, no-token-passthrough, no-token-leakage, no-token-retention, failure taxonomy, and result-envelope posture.

The proof-gate bridge now accepts exactly one FP-0132 local token-validation runtime contract foundation while FP-0133 remains absent. The bridge also preserves FP-0131 runtime sequencing, FP-0130 explicit missing-token challenge behavior, FP-0128 readiness, FP-0127 auth challenge contracts, FP-0125 protected-resource metadata local route/evidence posture, FP-0123 route input, FP-0122 builder, FP-0120 canonical resource/auth-server readiness, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 public security boundaries.

Final validation passed:

- `git diff --check`
- all requested read-only MCP/public-app/evidence/document proof tools, including the new `tools/read-only-mcp-token-validation-runtime-contract-proof.mjs`
- focused domain specs, including `src/read-only-app-mcp-token-validation-runtime.spec.ts`
- focused control-plane `/mcp` and protected-resource metadata route specs
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Posture preserved: no `/mcp` behavior change, no protected-resource metadata route behavior change, no missing-token challenge behavior change, no invalid-token challenge runtime, no token parsing runtime, no token validation runtime, no JWT decoding, no token/session storage, no OAuth implementation, no auth middleware, no route expansion, no DB/schema/package/data/source-pack/OpenAI/provider/source/finance-write/public-asset/app-submission/autonomous-action scope, and no FP-0133.

Same-branch QA correction: the direct FP-0132 proof command, FP-0131 runtime sequencing proof, FP-0127 WWW-Authenticate auth challenge proof, and FP-0117 OAuth implementation sequencing proof now include `origin/main...HEAD` committed branch diff paths plus dirty same-branch QA target files in their scope scans. This preserves the local/proof-only contract and prevents clean committed PR validation from bypassing no-route/no-runtime/no-schema/no-package/no-provider checks through an empty changed-path set.

Remaining work: future local token-validation test-double contracts or invalid-token challenge sequencing may start only under a new narrow Finance Plan after this branch lands. Public ChatGPT App submission remains blocked until token-validation runtime, invalid-token challenge sequencing, OAuth/session/auth middleware, remote MCP deployment, Apps SDK resources, provider readiness, and human review paths are separately planned and proven.

Replay and evidence: no replay event is required because this slice does not change mission state, ingest sources, reports, approvals, monitoring output, external communications, source truth, or finance write state. Active-doc boundary changes were limited to directly stale FP-0132/plugin/security/demo/roadmap notes and the tiny FP-0131 closeout freshness polish.
