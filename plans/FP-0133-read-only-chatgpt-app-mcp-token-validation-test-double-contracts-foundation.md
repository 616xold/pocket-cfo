# FP-0133 add read-only ChatGPT App MCP token-validation test-double contracts

## Purpose / Big Picture

FP-0133 is the local/proof-only/read-only token-validation test-double contract foundation for future authenticated `/mcp` validation tests. The target phase is V2BA read-only ChatGPT App/MCP token-validation test-double contract foundations.

This is contract/proof work only. FP-0132 shipped token-validation runtime contract foundations for opaque candidate boundaries, non-retention, issuer/audience/resource/scope/temporal/revocation/replay/user/org/company prerequisites, selector-only `companyKey`, no-token-passthrough, no-token-leakage, failure taxonomy, and validation-result envelopes. FP-0133 now defines how future local validation behavior may be tested with synthetic, fixtureless, non-token descriptors before any real validation implementation exists.

FP-0133 does not implement a test-double runtime. FP-0133 does not implement token validation runtime. FP-0133 does not parse, decode, introspect, store, forward, or log tokens. FP-0133 does not add token parsing, JWT decoding, OAuth, token/session storage, auth middleware, invalid-token challenge runtime, route behavior, protected-resource metadata route behavior, missing-token challenge behavior, `/mcp` behavior, routes, DB queries, schemas, migrations, package scripts, source packs, public assets, OpenAI API/model calls, provider calls, source mutation, finance writes, external communications, generated finance advice, runtime-Codex finance output, autonomous action, or public ChatGPT App submission. FP-0134 remains absent.

For proof-gate exactness, FP-0133 does not change `/mcp`, does not change protected-resource metadata route behavior, and does not change missing-token challenge behavior. Accepted/rejected validation result envelopes are modeled without raw token values, and companyKey remains selector-only.

The proof point is narrow: synthetic scenario descriptors, non-token test inputs, accepted/rejected validation result envelopes, issuer/audience/resource/scope/temporal/revocation/replay/subject/org/company scenario contracts, failure taxonomy, selector-only `companyKey`, no-token-passthrough, no-token-leakage, no real token examples, no JWT-like strings, no bearer token material, and no runtime consumption are all represented as pure domain contracts and proof tooling.

## Progress

- [x] 2026-05-20T16:46:13Z: Invoked the repo-local `pocket-cfo-codex-operator` skills requested for this slice: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-20T16:46:13Z: Confirmed branch `codex/v2ba-read-only-chatgpt-app-mcp-token-validation-test-double-contracts-foundation-local-v1`, clean worktree before edits, PR #308 merged to `main` at 2026-05-18T16:16:56Z, FP-0132 present, FP-0133 absent, FP-0134 absent, and FP-0132 proof durability correction present.
- [x] 2026-05-20T16:46:13Z: Ran baseline proof/spec gates before FP-0133 edits. The FP-0132 runtime contract proof, FP-0131 runtime sequencing proof, FP-0130 missing-token challenge proof, FP-0128 readiness proof, FP-0127 challenge proof, FP-0125 metadata route proof, FP-0123 route-input proof, FP-0122 builder proof, FP-0120 canonical resource/auth-server proof, FP-0107 route adapter proof, broader read-only MCP/public/evidence/document proof tools, focused domain specs, and focused control-plane `/mcp` plus metadata route specs all passed.
- [x] 2026-05-20T16:46:13Z: Checked tool exposure. OpenAI Developers exposed only OpenAI Platform API-key setup tools, not a read-only docs tool; no key setup, OpenAI API call, model call, provider call, deployment, or connector product behavior was used.
- [x] 2026-05-20T18:00:14Z: Created pure domain test-double contract schemas, builders, proof helpers, and focused specs for synthetic non-token scenarios, accepted/rejected tokenless envelopes, scenario families, failure taxonomy, selector-only `companyKey`, no-token-passthrough, no-token-leakage, and no runtime consumption.
- [x] 2026-05-20T18:00:14Z: Added the direct FP-0133 proof command with committed branch diff plus dirty same-branch QA target scans.
- [x] 2026-05-20T18:08:45Z: Updated the minimum proof-gate bridge so exactly one FP-0133 local/proof-only test-double contract plan is accepted while FP-0134 remains absent. The FP-0132 runtime contract, FP-0128 readiness, FP-0127 challenge, protected-resource metadata, missing-token, and OAuth sequencing gates now carry the FP-0133 accepted-or-absent bridge plus FP-0134 absence where applicable.
- [x] 2026-05-20T18:12:20Z: Refreshed directly stale active docs/plugin notes where FP-0133 shifted from future-only to this contract boundary.
- [x] 2026-05-20T18:15:00+01:00: Ran focused FP-0133 validation after implementation. The direct proof, token-validation runtime/sequence/readiness proofs, WWW-Authenticate challenge proofs, protected-resource metadata proofs, OAuth sequencing proof, route adapter proof, public security proof, endpoint/protocol proof gates, evidence/document proof tools, focused domain specs, and focused control-plane `/mcp` plus metadata route specs passed after narrow proof-bridge compatibility patches.
- [x] 2026-05-20T18:24:11+01:00: Ran final full validation after implementation and closeout updates. `git diff --check`, every requested proof command, focused domain specs, focused control-plane `/mcp` plus metadata route specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed.
- [x] 2026-05-21T13:41:28Z: Ran targeted post-merge hardening preflight on branch `codex/v2ba-read-only-chatgpt-app-mcp-token-validation-test-double-proof-durability-hardening-local-v1`; confirmed PR #309 merged, FP-0133 exists as shipped local/proof-only/read-only test-double contracts, FP-0134 remains absent, active docs support the FP-0133 boundary, the worktree started clean, and all required baseline proof tools passed before edits.
- [x] 2026-05-21T13:41:28Z: Added durable repository-inventory proof scanning on top of the existing `origin/main...HEAD` plus dirty same-branch QA target scan. The direct proof now emits machine-readable FP-0133 post-merge durability fields for no test-double runtime, no token parser/JWT decoder/token validation runtime/introspection, no invalid-token challenge runtime, no route consumption, no token material examples, no OAuth/token/session/auth runtime, no OpenAI executable/API/key source usage, and repository inventory verification.
- [x] 2026-05-21T13:41:28Z: Added focused domain coverage for current-repo inventory success and simulated failure paths for token-validation test-double runtime files, token parser/JWT decoder/introspection files, token validation runtime files, invalid-token challenge runtime files, route consumption, real-token, JWT-like, and bearer-material examples, OpenAI import/API/model/key source patterns, safe absence wording, exactly one FP-0133 plan, and FP-0134 absence.
- [x] 2026-05-21T13:52:58Z: Ran the full post-hardening validation ladder. `git diff --check`, every requested proof command, focused domain specs, focused control-plane `/mcp` plus protected-resource metadata route specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed. This closeout edit records the final validation and requires the minimum post-closeout rerun set before commit.
- [x] 2026-05-21T13:59:31Z: Reran the minimum post-closeout gates after the closeout edit, plus the direct FP-0133 proof. `git diff --check`, `tools/read-only-mcp-token-validation-test-double-contract-proof.mjs`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed.
- [ ] Create the single commit, push this branch, and open the PR.

## Surprises & Discoveries

- PR #308 is merged into `main`, and the current branch starts at the merge commit.
- The existing OpenAI Developers plugin exposure in this local thread did not provide read-only documentation search; it exposed API-key setup tools only. Those tools were not used.
- The FP-0132 proof durability correction is present: relevant proof tools inspect committed branch diff paths from `origin/main...HEAD` plus dirty same-branch QA target files.
- The first baseline validation wrapper failed because of a local `mktemp` suffix pattern, not product code. The ladder was rerun with a portable pattern and passed.
- The FP-0128 readiness proof inventory needed to recognize the FP-0133 plan and direct proof command as allowed proof-gate bridge targets. The direct FP-0133 proof command also had to avoid a self-matching model-call regex literal so older no-OpenAI/model-call scanners continued proving absence rather than flagging proof code text.
- The older metadata-builder, route-adapter, protocol-envelope, and endpoint proof tools also needed exact FP-0133 plan/proof allowlist entries so their path scanners treat this slice as proof/doc/domain contract work instead of token/session or endpoint implementation.
- The post-merge hardening correction confirmed the direct FP-0133 proof needed durable repository-inventory checks in addition to changed-path scans. The correction stayed in proof/domain/docs scope and did not require route, runtime, package, schema, migration, data, source-pack, public-asset, OpenAI API/model, provider, source mutation, or finance-write changes.

## Decision Log

- Decision: FP-0133 implements local/proof-only/read-only token-validation test-double contracts only. It does not implement a test-double runtime and does not implement token validation runtime.
- Decision: Synthetic validation scenarios are descriptors, not token material. Fixtureless test inputs are non-token descriptors only.
- Decision: Accepted/rejected validation result envelopes may be modeled only with synthetic binding refs, failure posture, selector-only `companyKey`, and limitation posture. They carry no raw token values, authorization header values, decoded JWT claims, passthrough token values, session values, cookies, or credential examples.
- Decision: Issuer, audience/resource, scope, temporal, revocation/replay, and subject/org/company cases are scenario-contract families only. They do not perform runtime checks.
- Decision: The failure taxonomy for this slice is `malformed`, `expired`, `wrong-issuer`, `wrong-audience`, `wrong-resource`, `wrong-scope`, `wrong-org`, `wrong-company`, `revoked`, `replayed`, and `token-passthrough-attempt`.
- Decision: Client `companyKey` remains selector-only. It cannot create authority without future authenticated user/org/company binding.
- Decision: Proof source scans must include both the committed branch diff from `origin/main...HEAD` and dirty same-branch QA target files. Clean committed branches must not make no-route/no-runtime/no-schema/no-provider checks vacuous.
- Decision: Existing bridge proofs accept exactly the FP-0133 local/proof-only contract plan or no FP-0133 plan, and separately prove FP-0134 absence.
- Decision: The direct FP-0133 proof must keep the committed branch diff plus dirty same-branch QA target scan and must also verify repository inventory across the relevant `/mcp`, evidence-index tool, domain token-validation/WWW-Authenticate/protected-resource metadata, and proof-tool source families so clean post-merge worktrees still prove absence of runtime/token/auth/OpenAI/source/finance drift.
- Decision: The durable proof-source scan may allow safe docs/proof absence wording and proof rejection-fixture scaffolding, but it rejects executable token parser/JWT decoder/token validation/introspection/OpenAI patterns, route consumption, and token material examples in non-fixture proof source.
- Decision: Public ChatGPT App submission, remote MCP deployment, OAuth/token/session/auth middleware, invalid-token challenge runtime, route expansion, Apps SDK resources, OpenAI API/model calls, provider calls, source mutation, finance writes, and FP-0134 remain blocked.

## Context and Orientation

FP-0130 shipped only a local-only/read-only explicit-dependency missing-token `WWW-Authenticate` challenge seam for existing `POST /mcp`. Default `buildApp()` and default `/mcp` behavior remain unchanged, and Authorization-present requests still fail closed without token parsing or validation.

FP-0131 shipped token-validation and invalid-token runtime sequencing. It held token-validation runtime, token parsing, JWT decoding, invalid-token challenge behavior, OAuth/token/session/auth middleware, remote MCP, public app behavior, and app submission until future contracts and proof gates exist.

FP-0132 shipped the local/proof-only token-validation runtime contract foundation. It proved opaque candidate, no-retention, issuer/audience/resource/scope/temporal/revocation/replay/user/org/company prerequisites, selector-only `companyKey`, no-token-passthrough, no-token-leakage, failure taxonomy, and result-envelope posture without adding runtime behavior.

Official read-only source context used by FP-0133:

- Model Context Protocol Authorization specification, version 2025-11-25: protocol context for protected-resource metadata, resource indicators, canonical resource URI, access token validation obligations, audience/resource validation, error posture, scope challenge posture, and token passthrough prohibition.
- Model Context Protocol Security Best Practices: security context for token passthrough risk, audience separation, confused-deputy risk, scope minimization, server-side validation, sessions not being authentication, and local server exposure risk.
- RFC 8707 Resource Indicators for OAuth 2.0: standards context for the `resource` parameter, absolute resource URI posture, audience restriction, tenant/resource specificity, and why test scenarios must distinguish audience/resource cases.
- RFC 9728 OAuth 2.0 Protected Resource Metadata: standards context for protected-resource metadata, authorization server association, `resource_metadata` discovery, scopes, TLS, and protected-resource identity.
- OpenAI Apps SDK Authentication: platform context for authenticated MCP servers, protected-resource metadata, OAuth 2.1 conformance, resource parameter echoing, and future per-request token checks for issuer, audience, expiration, and scopes.
- OpenAI Apps SDK Security & Privacy: platform context for least privilege, explicit consent, server-side validation, audit/log posture, and avoiding secrets or token material in structured content, component props, metadata, and logs.
- OpenAI Apps SDK Deploy, Connect from ChatGPT, Test your integration, Submit your app, and App submission guidelines: platform context for future stable HTTPS `/mcp`, developer-mode testing, public submission prerequisites, review credentials, screenshots/listing assets, and why deployment/submission remain out of scope.

GitHub connector product behavior is out of scope. Routine `git`, `gh`, push, and PR operations are repository operations, not product GitHub connector work.

## Plan of Work

This slice creates one Finance Plan, pure domain contracts/builders/proof schemas under `packages/domain`, focused domain specs, one direct proof command under `tools`, and minimal proof-gate bridge updates so exactly this FP-0133 local/proof-only token-validation test-double contract foundation is accepted while FP-0134 remains absent.

No route file, app construction file, metadata route file, missing-token challenge helper, invalid-token challenge helper, database schema, migration, package script, deployment config, public asset, Apps SDK resource, app-submission artifact, fixture, source pack, OpenAI/provider integration, source mutation, finance write, external communication, generated public prose, generated finance advice, runtime-Codex finance output, or autonomous action may be added.

## Concrete Steps

1. Add this plan at `plans/FP-0133-read-only-chatgpt-app-mcp-token-validation-test-double-contracts-foundation.md`.
2. Add pure test-double contract schemas, builders, proof helpers, no-token scanners, and FP-0133/FP-0134 plan-boundary helpers under `packages/domain/src/read-only-app-mcp-token-validation-test-double*.ts`.
3. Export the new domain contracts from `packages/domain/src/index.ts`.
4. Add focused specs proving the exact FP-0133 path is accepted, FP-0134 remains absent, synthetic scenarios are non-token descriptors, token-like and JWT-like inputs are rejected, accepted/rejected result envelopes contain no token material, scenario families are token-free, `companyKey` remains selector-only, no-token-passthrough/no-token-leakage are enforced, no runtime or route consumption exists, proof source scans include committed branch diff plus dirty QA targets, and prior boundaries remain intact.
5. Add `tools/read-only-mcp-token-validation-test-double-contract-proof.mjs` with machine-readable JSON output and committed diff plus dirty QA source scanning.
6. Update minimal proof gates from FP-0133 absent to FP-0133 absent-or-local-token-validation-test-double-contracts plus FP-0134 absent.
7. Refresh directly stale active docs/plugin notes only where they still call FP-0133 future-only after this plan exists.
8. Run focused validation, strict same-branch QA, final validation, close this plan, commit once, push, and open the PR.

## Validation and Acceptance

Acceptance requires:

- exactly one FP-0133 file exists at `plans/FP-0133-read-only-chatgpt-app-mcp-token-validation-test-double-contracts-foundation.md`
- FP-0134 remains absent
- FP-0133 is local/proof-only/read-only contract work
- all required test-double contract names exist with schemas/builders/proof coverage
- synthetic scenarios and fixtureless inputs are not token material
- accepted/rejected validation result envelopes contain no token material
- issuer, audience/resource, scope, temporal, revocation/replay, and subject/org/company scenarios are modeled without tokens
- failure taxonomy includes malformed, expired, wrong-issuer, wrong-audience, wrong-resource, wrong-scope, wrong-org, wrong-company, revoked, replayed, and token-passthrough-attempt
- `companyKey` remains selector-only
- token passthrough remains forbidden
- no token values or token-like examples appear in logs, proof output, docs examples, headers, route bodies, metadata examples, evidence, structured results, UI props, challenge examples, or app metadata
- the direct proof emits `tokenValidationTestDoubleRepositoryInventoryVerified`, all no-runtime/no-token-material repository-inventory fields, `noOpenAiApiSourceScanVerified`, and `fp0133PostmergeProofDurabilityVerified`
- no test-double runtime is implemented
- no route consumes test doubles
- no `/mcp` behavior, protected-resource metadata route behavior, or missing-token challenge behavior changes
- no invalid-token challenge runtime, token parsing runtime, token validation runtime, JWT decoding, token/session storage, OAuth implementation, auth middleware, DB query, schema migration, package script, deployment config, public asset, source pack, OpenAI API/model call, provider call, source mutation, finance write, external communication, generated advice, runtime-Codex finance output, or autonomous action is added
- FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0123, FP-0122, FP-0120, FP-0107, FP-0106, and FP-0100 boundaries remain proven

Validation command set:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-www-authenticate.spec.ts src/read-only-app-mcp-www-authenticate-boundary-hardening.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-protected-resource-metadata-route-input.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/service.spec.ts src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/app.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

If a correction changes code or docs after closeout, rerun `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` on the same branch.

## Idempotence and Recovery

This slice is idempotent because it creates exactly one FP-0133 plan, exactly one new direct proof command, and pure contract files. Re-running the slice should continue accepting the same FP-0133 path and continue rejecting any FP-0134 path.

If a proof rejects FP-0133, patch only the test-double contract proof, proof-gate bridge, or plan wording required to preserve local/proof-only truth. If a proof detects runtime/auth/route scope or token material examples, remove that scope and rerun the full ladder. If unrelated dirty files, missing services, missing proof tools, or auth failures appear, stop and report the narrow blocker.

Rollback is straightforward: remove the FP-0133 plan, FP-0133 domain contract files/specs, the direct FP-0133 proof command, proof-gate bridge edits, focused spec edits, and directly stale doc/plugin refreshes. Do not revert FP-0132 or earlier shipped records.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0133-read-only-chatgpt-app-mcp-token-validation-test-double-contracts-foundation.md`
- `packages/domain/src/read-only-app-mcp-token-validation-test-double*.ts`
- `packages/domain/src/read-only-app-mcp-token-validation-test-double*.spec.ts`
- `packages/domain/src/read-only-app-mcp-token-validation-test-double-inventory.ts`
- `tools/read-only-mcp-token-validation-test-double-contract-proof.mjs`
- proof-gate compatibility edits under existing read-only app MCP token-validation, WWW-Authenticate, OAuth, and protected-resource proof files only as needed
- direct active-doc/plugin freshness updates only if stale after FP-0133 exists

Replay implication: this plan creates no mission state changes, ingest actions, reports, approvals, monitoring outputs, external communications, source mutations, finance writes, or durable finance answers. No replay event is required.

Evidence/provenance/freshness implication: this plan creates no raw sources, source snapshots, raw-source mutations, Finance Twin state, CFO Wiki output, evidence bundle, freshness posture change, or finance limitation output. Its proof output is limited to plan/proof boundary booleans and no-token/no-runtime checks.

No new environment variables, package scripts, migrations, fixtures, source packs, public assets, screenshots, images, app-submission assets, provider calls, OpenAI API/model calls, or external artifacts are added.

## Interfaces and Dependencies

The new proof-only interface defines:

- `McpTokenValidationTestDoubleProofContract`
- `McpSyntheticValidationScenarioBoundary`
- `McpSyntheticNonTokenInputBoundary`
- `McpNoRealTokenExampleBoundary`
- `McpNoJwtLikeExampleBoundary`
- `McpAcceptedValidationResultTestDoubleBoundary`
- `McpRejectedValidationResultTestDoubleBoundary`
- `McpIssuerScenarioTestDoubleBoundary`
- `McpAudienceResourceScenarioTestDoubleBoundary`
- `McpScopeScenarioTestDoubleBoundary`
- `McpTemporalScenarioTestDoubleBoundary`
- `McpRevocationReplayScenarioTestDoubleBoundary`
- `McpSubjectOrgCompanyScenarioTestDoubleBoundary`
- `McpFailureTaxonomyTestDoubleBoundary`
- `McpSelectorOnlyCompanyKeyTestDoubleBoundary`
- `McpNoTokenPassthroughTestDoubleBoundary`
- `McpNoTokenLeakageTestDoubleBoundary`
- `McpNoRuntimeConsumptionBoundary`
- `McpTokenValidationTestDoubleProof`
- `verifyMcpTokenValidationTestDoubleRepositoryInventory`
- `isMcpTokenValidationTestDoubleProofSourcePath`

Upstream proof dependencies: FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0123, FP-0122, FP-0120, FP-0107, FP-0106, and FP-0100 must remain proven. FP-0134 remains absent.

## Outcomes & Retrospective

Implementation, proof bridge, focused QA, post-merge proof durability hardening, and final full validation are complete. The FP-0133 direct proof now keeps the committed branch diff plus dirty same-branch QA target scan and adds durable repository-inventory verification for no test-double runtime, no token parser/JWT decoder/token validation runtime/introspection, no invalid-token challenge runtime, no route consumption of token-validation test doubles, no real-token/JWT-like/bearer-material examples, no OAuth/token/session/auth runtime, no OpenAI executable/API/key source usage, and no DB/schema/package/data/public-asset/provider/source/finance-write drift in this correction scope.

The correction preserved FP-0133 as local/proof-only/read-only token-validation test-double contract work. It added no route behavior change, missing-token behavior change, protected-resource metadata route behavior change, token parser, token validation runtime, JWT decoder, token introspection, token/session storage, OAuth implementation, auth middleware, invalid-token route behavior, test-double runtime implementation, real token examples, JWT-like examples, bearer-material examples, DB queries, schemas, migrations, package scripts, fixtures, source packs, OpenAI API/model calls, provider calls, source mutation, finance writes, public assets, listing copy, generated public prose, autonomous action, or FP-0134.

Final full validation passed before this closeout edit: `git diff --check`; all requested proof tools including `tools/read-only-mcp-token-validation-test-double-contract-proof.mjs`; focused domain specs; focused control-plane `/mcp` and protected-resource metadata route specs; `pnpm lint`; `pnpm typecheck`; `pnpm test`; and `pnpm ci:repro:current`. The slice remains open only for the minimum post-closeout rerun set, the single commit, branch push, and PR creation.
