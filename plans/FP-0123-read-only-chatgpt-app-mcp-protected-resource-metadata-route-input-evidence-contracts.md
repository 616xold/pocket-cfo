# FP-0123 read-only ChatGPT App MCP protected-resource metadata route-input evidence contracts

## Purpose / Big Picture

FP-0123 is a local/proof-only/read-only contract foundation for protected-resource metadata route-input evidence bundles and route-path decision contracts.

The target phase is V2AQ. This slice exists because FP-0121 planned protected-resource metadata route implementation readiness without implementing routes, FP-0122 shipped a pure protected-resource metadata document builder and deferred route-response contract, and the FP-0122 post-merge credential/userinfo hardening proved canonical resource URI and `authorization_servers` credential material fail closed.

The next safe step is still not route implementation. FP-0123 implements only pure domain contracts and proof tooling for the evidence bundle a later route implementation plan may consume. It does not add a route. It does not register a protected-resource metadata endpoint. It does not implement `WWW-Authenticate` route behavior. It does not implement OAuth. It does not implement token/session. It does not implement auth middleware. It does not deploy remote MCP. It does not add deployment config. It does not add Apps SDK resources. It does not add public ChatGPT App behavior, app submission, DB queries, schemas, migrations, package scripts, fixtures, sample data, source packs, public assets, listing copy, generated public prose, OpenAI API/model calls, provider calls, external communications, source mutation, finance writes, generated finance advice, runtime-Codex finance output, or autonomous action. It does not create FP-0124.

## Progress

- [x] 2026-05-16T22:47:00Z: Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor from the repo-local Pocket CFO operator bundle. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-16T22:47:00Z: Confirmed work is on `codex/v2aq-read-only-chatgpt-app-mcp-protected-resource-metadata-route-input-evidence-contracts-local-v1`, FP-0120 through FP-0122 are present as shipped records, FP-0123 and FP-0124 were absent before this slice, and branch work should stay on this same branch.
- [x] 2026-05-16T22:56:00Z: Implemented pure route-input evidence bundle contracts, helpers, focused specs, direct proof tooling, and proof-gate bridge.
- [x] 2026-05-16T22:56:00Z: Refreshed only directly stale active docs and `plugins.md` for FP-0123 shipped-state posture.
- [x] 2026-05-16T23:01:00Z: Ran focused validation, full validation, closeout validation, and post-closeout reproducible CI through `pnpm ci:repro:current`; commit, push, and PR remain.
- [x] 2026-05-17T00:02:52Z: Started targeted post-merge FP-0123 proof-durability hardening correction on `codex/v2aq-read-only-chatgpt-app-mcp-protected-resource-metadata-route-input-evidence-contracts-proof-hardening-local-v1` after confirming PR #294 is merged, FP-0123 exists, FP-0124 is absent, required proof tools exist, local Postgres/MinIO are available, GitHub auth is valid, and the requested baseline proof ladder passed before edits.
- [x] 2026-05-17T00:02:52Z: Hardened `tools/read-only-mcp-protected-resource-metadata-route-input-proof.mjs` and the route-input proof contract so scope verification now combines dirty worktree paths, `origin/main...HEAD` branch-diff paths, and durable current repository inventory scans instead of relying only on dirty worktree paths.
- [x] 2026-05-17T00:02:52Z: Added focused route-input durability tests for current repo truth, simulated committed protected-resource metadata route paths, simulated committed `WWW-Authenticate` source/path drift, OAuth/token/session/auth middleware drift, deployment/public asset/listing/submission/package-script drift, OpenAI executable usage drift, safe absence language, and FP-0124 absence.
- [x] 2026-05-17T00:24:45Z: Completed the requested post-merge proof-durability validation ladder before closeout, including all proof commands, focused domain/control-plane Vitest slices, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

## Surprises & Discoveries

- Existing route-adapter and evidence-dispatch proof gates still treated any FP-0123 file as absent-only planning scope. The bridge was narrowed to accept exactly the FP-0123 route-input contract plan and direct proof tool while keeping FP-0124 absent and preserving all route/no-runtime boundaries.
- The direct proof scanner needed to avoid embedding literal OpenAI API key text in a way legacy source-scope checks would flag. The proof now constructs that environment-key marker without introducing API usage.
- The active docs correctly marked FP-0122 as shipped and FP-0123 absent before this slice.
- Post-merge QA found the original FP-0123 route-input proof was too dependent on dirty-worktree paths for forbidden-scope absence checks. A committed or merged branch with a clean worktree could hide route/runtime/auth/deployment/package/OpenAI/provider/source/finance drift unless the proof also used branch-diff paths and current repository inventory.

## Decision Log

- Decision: FP-0123 is contract/proof work only. Route-input evidence bundles may describe prerequisites and derived route-path decisions, but they must not register or implement any protected-resource metadata route.
- Decision: Accepted canonical public MCP resource URI evidence must come from the FP-0120 validator posture and must remain credential-free, query-free, fragment-free, selector-free, and exact HTTPS.
- Decision: `authorization_servers` evidence must remain non-empty, HTTPS, provider-neutral, credential-free, and compatible with the FP-0122 builder guardrails.
- Decision: The route path decision is derived from the accepted canonical resource URI. For a canonical resource ending in `/mcp`, the expected RFC 9728 metadata route path is `/.well-known/oauth-protected-resource/mcp`.
- Decision: A route-input bundle may consume either valid FP-0122 builder output or builder-valid input; invalid builder output fails closed.
- Decision: Authenticated company binding is a prerequisite flag only. FP-0123 proves it remains required and unimplemented.
- Decision: `/mcp` unchanged behavior is a prerequisite flag only. FP-0123 proves `/mcp` behavior remains unchanged and no route is registered.
- Decision: Public ChatGPT App submission must wait. FP-0123 adds no public app behavior, app-submission artifact, listing copy, screenshot, public asset, external communication, deployment, OAuth runtime, or provider call.
- Decision: Proof-gate compatibility is allowed only for the exact FP-0123 local/proof-only route-input contract artifacts. FP-0124 remains absent and route behavior remains unauthorized.
- Decision: The route-input proof must be durable after commit and merge. It now verifies dirty paths, `origin/main...HEAD` branch-diff paths, their combined changed-path set, current route-like repository inventory, protected-resource metadata route absence, `WWW-Authenticate` route-behavior absence, OAuth/token/session/auth runtime absence, deployment/public-asset/submission/App SDK absence, package/DB/schema/migration absence from changed paths, OpenAI executable-source absence, provider/external-call absence, source-mutation absence, and finance-write absence.

## Context and Orientation

FP-0122 is shipped as local/proof-only/read-only protected-resource metadata document-builder and deferred route-response contract work with credential/userinfo hardening. It requires accepted canonical public MCP resource URI input, provider-neutral non-empty `authorization_servers`, read-only `scopes_supported`, header-only `bearer_methods_supported`, no token leakage, credential-bearing URL rejection, secret-like URI material rejection, and deferred route response.

FP-0121 is shipped as protected-resource metadata route implementation readiness planning. It keeps route implementation blocked until canonical URI/auth-server evidence, route path decision, route tests, metadata document tests, no-token-leakage proof, local `/mcp` unchanged-behavior proof, and authenticated company binding are proven.

FP-0120 is shipped as canonical resource/auth-server readiness contracts. It proves RFC 9728 route-path derivation and validation-gated metadata URL derivation without implementing routes.

FP-0118, FP-0117, FP-0107, FP-0106, and FP-0100 remain shipped boundaries and must stay intact.

Official research posture: this slice may use repo-local plugin guidance plus official MCP/RFC/OpenAI docs as read-only context only. No OpenAI API key setup, OpenAI API call, model call, provider call, deployment, app submission, upload, or external communication is in scope.

GitHub connector product behavior is out of scope. Routine `git`, push, and PR publication may happen after validation.

## Plan of Work

Add pure route-input evidence contracts under `packages/domain/src/read-only-app-mcp-protected-resource-metadata-route-input*.ts`. The contracts cover proof contract, evidence bundle boundary, canonical URI evidence boundary, authorization-server evidence boundary, path decision boundary, builder output boundary, no-token-leakage boundary, authenticated company-binding prerequisite boundary, `/mcp` unchanged prerequisite boundary, no-runtime boundary, and proof schema.

Add helpers:

- `validateProtectedResourceMetadataRouteInputEvidenceBundle(input)`
- `deriveProtectedResourceMetadataRoutePathDecision(input)`
- `buildProtectedResourceMetadataRouteInputEvidenceBundle(input)`

Add a direct proof command at `tools/read-only-mcp-protected-resource-metadata-route-input-proof.mjs` that prints machine-readable JSON and proves FP-0123 is the only accepted FP-0123 file while FP-0124 remains absent.

Bridge existing proof gates so FP-0123 local/proof-only route-input evidence contracts are accepted while FP-0124 remains absent and FP-0122, FP-0121, FP-0120, FP-0118, FP-0117, FP-0107, FP-0106, and FP-0100 boundaries remain intact.

Refresh only directly stale active docs and `plugins.md` after the code/proof behavior is green.

## Concrete Steps

1. Keep work on `codex/v2aq-read-only-chatgpt-app-mcp-protected-resource-metadata-route-input-evidence-contracts-local-v1`.
2. Add this exact FP-0123 plan and no FP-0124 file.
3. Add route-input contract schemas, validation helpers, path-decision helper, bundle builder, proof builder, and focused specs.
4. Add `tools/read-only-mcp-protected-resource-metadata-route-input-proof.mjs`.
5. Update proof-gate bridge helpers, existing proof tools, and focused specs so FP-0123 is accepted and FP-0124 remains absent.
6. Refresh directly stale active docs and `plugins.md` only.
7. Run focused validation, full validation, closeout updates, final reruns if needed, exactly one commit, push, and PR.

## Validation and Acceptance

Validation commands:

- `git diff --check`
- `pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-route-input-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-builder-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-canonical-resource-auth-server-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-oauth-implementation-sequencing-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-remote-host-resource-boundary-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-remote-host-readiness-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-oauth-security-boundary-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-default-local-evidence-dispatch-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-evidence-tool-dispatch-adapter-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-evidence-tool-dispatch-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-route-adapter-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-protocol-envelope-proof.mjs`
- `pnpm exec tsx tools/read-only-endpoint-route-ownership-proof.mjs`
- `pnpm exec tsx tools/read-only-endpoint-architecture-proof.mjs`
- `pnpm exec tsx tools/read-only-public-app-security-boundary-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-descriptor-response-envelope-proof.mjs`
- `pnpm exec tsx tools/read-only-chatgpt-app-mcp-proof.mjs`
- `pnpm exec tsx tools/benchmark-community-pack-proof.mjs`
- `pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs`
- `pnpm exec tsx tools/read-only-evidence-app-proof.mjs`
- `pnpm exec tsx tools/document-precision-foundation-proof.mjs`
- `pnpm exec tsx tools/evidence-index-foundation-proof.mjs`
- `pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-readiness.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-protected-resource-metadata-builder.spec.ts src/read-only-app-mcp-protected-resource-metadata-route-input.spec.ts src/read-only-app-mcp-canonical-resource-proof.spec.ts src/read-only-app-mcp-canonical-resource-validation.spec.ts`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/service.spec.ts src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts src/app.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Acceptance requires exactly one FP-0123 file, FP-0124 absent, pure local/proof-only/read-only route-input evidence bundle contracts, accepted canonical URI evidence, credential-free authorization-server evidence, valid FP-0122 builder output or builder-valid input, derived route path decision for `/mcp`, no-token-leakage proof, authenticated company-binding prerequisite proof, `/mcp` unchanged-behavior prerequisite proof, route implementation deferred, `WWW-Authenticate` behavior deferred, no route behavior change, no new route path, no protected-resource metadata route, no OAuth/token/session/auth middleware, no remote deployment/config, no Apps SDK resource, no public app/submission/public asset/listing/generated public prose, no DB/schema/package/data/source-pack changes, no OpenAI/model/provider calls, no source mutation, no finance write, no autonomous action, and preserved prior boundaries.

The post-merge proof-durability correction additionally requires `tools/read-only-mcp-protected-resource-metadata-route-input-proof.mjs` to verify `routeInputBranchDiffScopeVerified`, `routeInputRepositoryInventoryVerified`, `routeInputNoRouteRuntimeRepositoryInventoryVerified`, `routeInputNoProtectedResourceMetadataRouteRepositoryInventoryVerified`, `routeInputNoWwwAuthenticateRepositoryInventoryVerified`, `routeInputNoAuthRuntimeRepositoryInventoryVerified`, `routeInputNoDeploymentPublicAssetRepositoryInventoryVerified`, `routeInputNoOpenAiSourceScanVerified`, and `fp0123PostmergeProofDurabilityVerified` from dirty paths, `origin/main...HEAD`, and current repository inventory.

If a post-validation doc closeout edit is made, rerun:

- `git diff --check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

## Idempotence and Recovery

This slice has no migrations, provider resources, OAuth registrations, tokens, sessions, source artifacts, finance writes, deployment configs, route files, public assets, Apps SDK resources, or runtime state to roll back.

If validation fails, patch only the FP-0123 contracts/proof/docs files and proof-gate bridge on this same branch. If validation reveals a broader shipped-boundary defect, stop and recommend the smallest safer corrective slice rather than widening FP-0123.

## Artifacts and Notes

Expected artifacts are this FP-0123 plan, pure route-input domain contracts/functions/specs, direct proof tooling, proof-gate bridge updates, directly stale active-doc/plugin refresh, and validation evidence.

Replay implication: FP-0123 does not ingest sources, mutate raw source files, create mission outputs, change mission state, release communications, write finance state, or create runtime-Codex finance output. No mission replay event is required beyond plan progress, decision log, proof output, and final validation evidence.

Provenance/freshness/limitations implication: FP-0123 does not answer finance questions or compile reports. It preserves the future requirement that route/tool outputs expose provenance, freshness posture, and limitations when relevant, and that route-input evidence bundles, metadata, auth challenges, logs, proof output, public docs, and app-submission artifacts must not contain token material, private finance data, raw source dumps, generated finance advice, or unauthenticated company authority.

## Interfaces and Dependencies

Primary module touch is `packages/domain`. The route-input contracts reuse the FP-0120 canonical URI validator and FP-0122 metadata builder guardrails and remain pure TypeScript. Direct proof tooling under `tools/` may change only for proof-gate bridge compatibility. `apps/control-plane` route files are validation context only and must not change.

No new environment variables, package scripts, route paths, schemas, migrations, DB queries, fixtures, datasets, sample data, source packs, public assets, provider configs, OpenAI API/model integrations, Apps SDK resources, OAuth/session/auth middleware, deployment files, public app behavior, app submission assets, or external communications are introduced.

## Outcomes & Retrospective

Implemented FP-0123 as local/proof-only/read-only contract work. The domain layer now has pure schemas, helpers, proof schema, focused specs, and a direct proof command for route-input evidence bundles, canonical URI evidence, authorization-server evidence, derived route path decisions, FP-0122 builder dependency, no-token-leakage, authenticated company-binding prerequisite, `/mcp` unchanged prerequisite, and no-runtime posture.

Post-merge proof-durability hardening now keeps the same product boundary while strengthening the direct route-input proof against clean-worktree blind spots after commit or merge. The proof continues to preserve the exact FP-0123 allowed changed-file scope, but it now verifies both committed branch-diff paths and dirty paths, plus current repository inventory/source scans for forbidden route/runtime/auth/deployment/public-asset/package/DB/OpenAI/provider/source/finance drift.

Proof-gate bridge updates accept exactly one FP-0123 plan path, prove FP-0124 absent, and preserve FP-0122, FP-0121, FP-0120, FP-0118, FP-0117, FP-0107, FP-0106, and FP-0100 boundaries. No route files were changed, no protected-resource metadata route was registered, no `WWW-Authenticate` route behavior was added, and no OAuth/token/session/auth middleware, deployment config, Apps SDK resource, app submission, DB/schema/package/data/source-pack/public-asset/OpenAI/provider/source/finance-write/autonomous-action scope was introduced.

Validation completed before the 2026-05-17 post-merge proof-durability closeout:

- `git diff --check`
- all requested proof commands from route-input through evidence-index foundation
- requested focused domain Vitest slice
- requested focused control-plane Vitest slice
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Because this closeout included post-validation doc edits, the required final rerun passed: `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

Exact next recommendation: protected-resource metadata route implementation may start next only in a new narrow plan after confirming FP-0123 validation remains green and after carrying forward authenticated company-binding, `/mcp` unchanged behavior, route-path decision, no-token-leakage, and `WWW-Authenticate` deferral guardrails. Public ChatGPT App submission should wait.
