# FP-0135 plan read-only ChatGPT App MCP invalid-token challenge sequencing

## Purpose / Big Picture

FP-0135 is the V2BC docs-and-plan plus proof-gate compatibility master plan for invalid-token WWW-Authenticate challenge sequencing after FP-0134.

This slice is docs-and-plan plus proof-gate compatibility only. It plans invalid-token WWW-Authenticate challenge sequencing only. It does not emit invalid-token WWW-Authenticate headers, does not change `/mcp`, does not change protected-resource metadata route behavior, does not change missing-token challenge behavior, does not implement token validation runtime, does not parse, decode, validate, introspect, store, forward, or log tokens, does not implement OAuth, does not add token/session storage, does not add auth middleware, does not consume synthetic test doubles, and keeps no route consumption of test doubles as a proof boundary.

FP-0130 shipped the local explicit-dependency missing-token challenge seam. FP-0131 planned token-validation and invalid-token runtime sequencing. FP-0132 shipped token-validation runtime contracts. FP-0133 shipped token-validation test-double contracts. FP-0134 shipped the local synthetic token-validation test-double evaluator and the hardening that classifies token-like input as `token-passthrough-attempt` without echoing token material. FP-0135 decides how those records must sequence before any future runtime challenge work can start.

The proof point is narrow: the repository can accept exactly one FP-0135 docs-only sequencing plan while FP-0136 remains absent, and the proof gates still reject route behavior changes, metadata route behavior changes, missing-token behavior changes, invalid-token runtime behavior, token parser/JWT decoder/token-validation runtime/introspection/session/OAuth/auth middleware work, test-double route consumption, real token examples, JWT-like examples, Bearer token material, DB/schema/package work, OpenAI API/model calls, provider calls, source mutation, finance writes, public assets, public app submission, and autonomous action.

## Progress

- [x] 2026-05-21T16:24:58Z: Invoked the repo-local `pocket-cfo-codex-operator` skills requested for this slice: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-21T16:24:58Z: Confirmed branch `codex/v2bc-read-only-chatgpt-app-mcp-invalid-token-challenge-sequencing-master-plan-local-v1`, clean worktree before edits, FP-0134 present and shipped, FP-0135 absent, FP-0136 absent, active docs supporting FP-0134 as local-only/read-only synthetic evaluator with no route consumption, `/mcp` route adapter present, protected-resource metadata route present, and missing-token challenge proof available.
- [x] 2026-05-21T16:24:58Z: Ran the pre-edit proof gate set. `git diff --check`, the existing read-only MCP/token-validation/protected-resource/public security proof tools, the focused domain specs, and the focused control-plane `/mcp` plus protected-resource metadata specs passed before FP-0135 edits.
- [x] 2026-05-21T16:24:58Z: Reviewed source context read-only. OpenAI Developers tooling exposed only API-key setup tools, not read-only docs, so official web docs were used instead. No API-key setup, OpenAI API call, model call, provider call, deployment, external communication, connector product behavior, source mutation, or finance write was used.
- [x] 2026-05-21T16:24:58Z: Added this FP-0135 plan, proof-gate bridge helpers, direct proof command, and focused specs so one FP-0135 docs-only sequencing plan is accepted while FP-0136 remains absent.
- [x] 2026-05-21T16:45:59Z: Ran the full requested validation ladder after the plan, proof bridge, focused specs, and directly stale docs refresh. `git diff --check`, the FP-0135 proof, all existing relevant proof tools, focused domain specs, focused control-plane `/mcp` and protected-resource metadata specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed.
- [ ] Commit exactly once, push the requested branch, and create the PR after the required post-closeout validation rerun. Repository operation results are recorded in the final response rather than edited back into this committed plan artifact.

## Surprises & Discoveries

- The current proof spine already had the important safety shape: FP-0134 evaluates synthetic scenario descriptors only, rejects token-material-like input as `token-passthrough-attempt`, and does not import into route code.
- The existing FP-0134 proof had to be bridged from "FP-0135 absent" to "FP-0135 absent or exactly this docs-only sequencing plan"; otherwise the new plan would intentionally break the shipped FP-0134 local proof.
- Official OpenAI docs were accessible through the web, while local OpenAI Developers tooling exposed API-key setup surfaces that were intentionally unused.
- Directly stale docs existed because the repo was still stating FP-0135 as absent/future-only after FP-0134. Those docs are refreshed only where they describe this exact FP-0135 boundary.

## Decision Log

- Decision: Invalid-token challenge behavior cannot start from current repo truth as implementation. Planning can start because FP-0134 and the prior boundary proofs are present, but runtime behavior remains blocked.
- Decision: Invalid-token challenge behavior cannot start before production token validation runtime. The default and explicit answer is no.
- Decision: Synthetic test-double evaluator results cannot be used in route behavior. The default and explicit answer is no; test doubles remain tests/proofs only.
- Decision: The categories `malformed`, `expired`, `wrong-issuer`, `wrong-audience`, `wrong-resource`, `wrong-scope`, `wrong-org`, `wrong-company`, `revoked`, `replayed`, and `token-passthrough-attempt` are future-only for route behavior until token-validation runtime exists.
- Decision: 401/403 mapping is docs/proof-only in FP-0135. RFC 6750 context can guide future mapping, but this slice does not encode runtime status selection.
- Decision: JSON-RPC refusal separation is mandatory. Future HTTP auth challenge headers and JSON-RPC error/refusal envelopes must be planned as separate layers; FP-0135 does not implement either layer.
- Decision: `resource_metadata` and scope challenge posture must remain aligned with the FP-0125 protected-resource metadata route and FP-0130 missing-token challenge behavior. No metadata route or missing-token change is authorized here.
- Decision: No token echo is a proof boundary. Future work must prove no raw token, Authorization value, token-like material, JWT-like material, or Bearer token material appears in logs, headers, JSON-RPC envelopes, proofs, docs examples, reports, or operator output.
- Decision: Public ChatGPT App submission remains future-only. App SDK auth context is used only as planning context.
- Decision: Future FP-0136 gate may open only a narrow next slice after all FP-0135 gates pass. FP-0136 remains absent in this slice.

## Context and Orientation

FP-0130 is the shipped local-only/read-only explicit-dependency missing-token WWW-Authenticate challenge seam for existing `POST /mcp`. The protected-resource metadata route evidence dependency must be co-supplied and accepted before the FP-0130 missing-token challenge can advertise metadata. Authorization-present requests still fail closed without token parsing or validation.

FP-0131 is the shipped docs-and-plan/proof-gate compatibility plan for token-validation and invalid-token runtime sequencing. It preserved token validation runtime, token parsing, JWT decoding, invalid-token challenge behavior, OAuth/token/session/auth middleware, remote MCP, public app behavior, and app submission as future-only.

FP-0132 is the shipped local/proof-only/read-only token-validation runtime contract foundation. FP-0133 is the shipped local/proof-only/read-only token-validation test-double contract foundation. FP-0134 is the shipped local-only/read-only synthetic token-validation test-double evaluator. None of those records authorize route consumption of synthetic evaluator output.

Official source context used by FP-0135:

- Model Context Protocol Authorization specification, version 2025-11-25: context for protected-resource metadata, `resource_metadata`, WWW-Authenticate discovery, resource indicators, scope challenge handling, audience/resource validation, and token passthrough prohibition.
- Model Context Protocol Security Best Practices: context for token passthrough risk, audience separation, confused-deputy risk, server-side validation, least privilege, and session/auth boundaries.
- RFC 6750 Bearer Token Usage: context for WWW-Authenticate error attributes, invalid token posture, insufficient scope posture, and 401/403 mapping.
- RFC 8707 Resource Indicators for OAuth 2.0: context for resource identifiers, audience restriction, and resource-specific token requests.
- RFC 9728 OAuth 2.0 Protected Resource Metadata: context for protected-resource metadata, the `resource_metadata` WWW-Authenticate parameter, and authorization server association.
- OpenAI Apps SDK Authentication: context for authenticated MCP servers, protected-resource metadata discovery, future per-request token checks, and WWW-Authenticate challenge posture.
- OpenAI Apps SDK Security & Privacy: context for server-side token checks, scope enforcement, avoiding secrets or tokens in structured content, operational readiness, and launch security review.

GitHub connector product behavior is out of scope. Routine `git`, `gh`, push, and PR operations are repository operations, not product GitHub connector work.

## Plan of Work

This slice creates exactly one FP-0135 plan and proof-gate bridge compatibility so the repo accepts this docs-only sequencing plan while preserving every shipped route/auth/token boundary.

Allowed work is limited to this plan, proof-gate helper code under the existing domain proof modules, one direct proof command, focused specs, existing proof-tool compatibility updates, and directly stale docs/plugin refreshes. The slice must not touch route behavior, protected-resource metadata route behavior, missing-token behavior, token parser/runtime code, JWT decoding, token introspection, OAuth, token/session storage, auth middleware, DB/schema/migration code, package scripts, source packs, fixtures, data sets, OpenAI API/model integration, provider calls, deployment config, external communications, source mutation, finance writes, public assets, app-submission assets, or FP-0136.

## Concrete Steps

1. Add `plans/FP-0135-read-only-chatgpt-app-mcp-invalid-token-challenge-sequencing-master-plan.md`.
2. Add proof-gate helpers that accept FP-0135 only at the exact plan path and only when its text proves docs-and-plan plus proof-gate compatibility boundaries.
3. Update the FP-0134 local proof bridge so FP-0134 remains valid after FP-0135 exists, while FP-0136 remains absent.
4. Add `tools/read-only-mcp-invalid-token-challenge-sequencing-proof.mjs` with machine-readable proof fields for FP-0135 scope, prior FP boundaries, no route changes, no runtime/auth/token work, no token examples, and no source/finance/provider drift.
5. Add focused specs proving exactly one FP-0135 path is accepted, FP-0136 remains absent, planning text covers 401/403 mapping, `resource_metadata`, scope challenge, JSON-RPC refusal separation, failure taxonomy, no token echo, no route consumption of test doubles, and future FP-0136 gate.
6. Refresh directly stale docs/plugin records only where they still say FP-0135 is absent/future-only after this plan exists.
7. Run the full requested validation ladder, close out this plan, rerun the required post-closeout validation set if the closeout edit is made, commit once, push, and create the PR.

## Validation and Acceptance

Acceptance requires:

- exactly one FP-0135 plan exists at `plans/FP-0135-read-only-chatgpt-app-mcp-invalid-token-challenge-sequencing-master-plan.md`
- FP-0136 remains absent
- FP-0135 is docs-and-plan/proof-gate only
- FP-0135 does not emit invalid-token WWW-Authenticate headers
- FP-0135 does not change `/mcp`, protected-resource metadata route behavior, or missing-token challenge behavior
- FP-0135 does not implement invalid-token runtime behavior, token parser, JWT decoder, token validation runtime, token introspection, token/session storage, OAuth, or auth middleware
- FP-0135 does not consume synthetic test doubles from any route
- no real token examples, no JWT-like examples, no Bearer token material, and no token echo are introduced
- planning text covers 401/403 mapping, `resource_metadata`, scope challenge, JSON-RPC refusal separation, failure taxonomy, no token echo, no route consumption of test doubles, and the future FP-0136 gate
- FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 boundaries remain proven
- no DB queries, schemas, migrations, package scripts, OpenAI API/model calls, provider/external calls, source mutation, finance writes, public assets, listing copy, generated public prose, external communication, or autonomous action are added

Validation command set:

```bash
git diff --check
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

This slice is idempotent because it creates exactly one FP-0135 docs-only plan, one direct proof command, focused proof-gate helper changes, focused specs, and directly stale docs refreshes. Re-running the proof should continue accepting the same FP-0135 path and rejecting FP-0136 or any runtime/auth/route/token expansion.

If a proof rejects FP-0135, patch only the plan wording or proof-gate bridge needed to preserve the docs-only truth. If a proof detects route/auth/runtime/token material scope, remove that scope and rerun the full ladder. If unrelated dirty files, missing services, missing proof tools, or auth failures appear, stop and report the narrow blocker.

Rollback is straightforward: remove this FP-0135 plan, the direct FP-0135 proof command, proof-gate bridge edits, focused spec edits, and directly stale doc/plugin refreshes. Do not revert FP-0134 or earlier shipped records.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0135-read-only-chatgpt-app-mcp-invalid-token-challenge-sequencing-master-plan.md`
- `tools/read-only-mcp-invalid-token-challenge-sequencing-proof.mjs`
- proof-gate compatibility helpers under `packages/domain/src/read-only-app-mcp-token-validation-test-double*.ts`
- focused spec additions in `packages/domain/src/read-only-app-mcp-token-validation-test-double.spec.ts`
- directly stale README/CODEX/START/ACTIVE_DOCS/PROJECT_STATE/V2_BOUNDARY/ROADMAP/security-doc/demo-doc/plugin refreshes only where needed

Replay implication: FP-0135 creates no mission state changes, ingest actions, reports, approvals, monitoring outputs, external communications, source mutations, finance writes, or durable finance answers. No replay event is required.

Evidence/provenance/freshness implication: FP-0135 creates no raw sources, source snapshots, raw-source mutations, Finance Twin state, CFO Wiki output, evidence bundle, freshness posture change, or finance limitation output. Its proof output is limited to plan/proof boundary booleans and prior-boundary preservation.

No new environment variables, package scripts, migrations, fixtures, datasets, source packs, public assets, screenshots, images, app-submission assets, provider calls, OpenAI API/model calls, deployment config, external artifacts, or FP-0136 are added.

## Interfaces and Dependencies

FP-0135 adds no runtime interface. The only new interface is proof-only: `tools/read-only-mcp-invalid-token-challenge-sequencing-proof.mjs` reports booleans that prove the FP-0135 plan boundary and prior FP posture.

Invalid-token challenge contracts or implementation may start only after this plan is merged and the future FP-0136 gate is satisfied. That future gate requires, at minimum, unchanged missing-token behavior, invalid-token categories that fail closed, no raw token echo, no token/JWT examples, no token passthrough, no route consumption of test doubles, no metadata route drift, and an explicit named plan that decides whether it is still contracts-only or begins narrowly scoped runtime work.

Upstream proof dependencies: FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 must remain proven. FP-0136 remains absent.

## Outcomes & Retrospective

Closed for artifact work at 2026-05-21T16:45:59Z.

Implemented outcomes:

- FP-0135 exists as exactly one docs-and-plan plus proof-gate compatibility plan for invalid-token WWW-Authenticate challenge sequencing.
- FP-0136 remains absent.
- The proof-gate bridge accepts only the exact FP-0135 docs-only plan path and continues to require FP-0136 absence.
- The new FP-0135 proof covers invalid-token sequencing boundaries, 401/403 posture, `resource_metadata`, scope challenge alignment, JSON-RPC refusal separation, failure taxonomy, no token echo, no route consumption of test doubles, no token examples, and future FP-0136 gates.
- Existing FP-0134/FP-0133/FP-0132/FP-0131/FP-0130/FP-0128/FP-0127/FP-0125/FP-0107/FP-0106/FP-0100 boundaries remain proven.
- Directly stale README/CODEX/START/ACTIVE_DOCS/PROJECT_STATE/V2_BOUNDARY/ROADMAP/security-doc/demo-doc/plugin references were refreshed only where they described this FP-0135 boundary.

Validation passed before this closeout edit:

- `git diff --check`
- `pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-sequencing-proof.mjs`
- all existing relevant read-only MCP/token-validation/protected-resource/public security proof tools listed above
- focused domain token-validation, token-validation runtime, token-validation test-double, WWW-Authenticate, and protected-resource metadata specs
- focused control-plane `/mcp` and protected-resource metadata route specs
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Remaining work after this closeout edit:

- Rerun `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- Commit once, push the requested branch, and create the requested PR if repository auth permits.

Recommendation: do not start invalid-token challenge implementation next. The next safe slice is either no correction if post-closeout validation remains green, or one narrow FP-0135 proof/wording correction if a compatibility proof exposes drift. Runtime invalid-token challenge contracts may be planned only in a future FP-0136-style slice after the gates remain green; public ChatGPT App submission should continue to wait.
