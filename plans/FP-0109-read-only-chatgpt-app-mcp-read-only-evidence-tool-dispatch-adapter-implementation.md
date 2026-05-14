# FP-0109 read-only ChatGPT App MCP evidence tool dispatch adapter implementation

## Purpose / Big Picture

FP-0109 implements the first local-only, read-only evidence tool dispatch adapter for the existing `/mcp` `tools/call` path.

The user-visible purpose is to let the already-shipped local `/mcp` route shell dispatch the exact V2G read-only evidence tools only when a dispatcher is explicitly injected, while preserving the default fail-closed posture when no dispatcher is provided.

Target phase: V2AC read-only ChatGPT App/MCP read-only evidence tool dispatch adapter implementation.

This is local-only, read-only, dependency-injected evidence/source-envelope implementation. It maps the exact FP-0108 V2G tool allowlist to the existing `ReadOnlyEvidenceToolService` methods through a thin control-plane adapter. It does not add route paths, change GET `/mcp`, add DB queries, schemas, migrations, package scripts, fixtures, sample data, source packs, public assets, OpenAI API/model calls, provider calls, external communications, source mutation, finance writes, generated finance advice, OAuth/token/session handling, remote MCP deployment, Apps SDK resources, public ChatGPT App behavior, app submission, or autonomous action.

## Progress

- [x] 2026-05-14T21:23:23Z - Started the targeted post-merge FP-0109 hardening correction on `codex/v2ac-read-only-chatgpt-app-mcp-evidence-dispatch-adapter-context-envelope-hardening-local-v1`; re-invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard remained out of scope.
- [x] 2026-05-14T21:23:23Z - Confirmed PR #275 is merged, FP-0109 exists and is shipped, FP-0110 is absent, the required adapter/service files exist, default `tools/call` remains fail-closed without an injected dispatcher, and all required baseline proof tools passed before edits.
- [x] 2026-05-14T21:23:23Z - Hardened the local adapter so expected `companyKey` is enforced before service dispatch, mismatches fail closed before service calls, `fetch_source_coverage` passes `sourceId` into a store-only service shim, unsupported `periodKey` fails closed, and every `structuredContent` result has a bounded JSON text mirror without raw dumps or secrets.
- [x] 2026-05-14T21:23:23Z - Updated focused dispatcher/service/domain specs and `tools/read-only-mcp-evidence-tool-dispatch-adapter-proof.mjs`; focused specs and the adapter proof passed with the new machine-readable hardening fields.
- [x] 2026-05-14T21:23:23Z - Refreshed directly stale active docs and `plugins.md` to describe FP-0109 context/envelope hardening while keeping default evidence dispatch enablement, FP-0110, public app behavior, OAuth/session, remote MCP, Apps SDK resources, app submission, source mutation, and finance writes future-only.
- [x] 2026-05-14T21:34:34Z - Tightened legacy proof-gate compatibility for the exact FP-0109 source-coverage shim, reran all required proof tools and focused domain/control-plane specs successfully, and completed same-branch QA scans confirming no FP-0110, no route expansion, no DB/schema/migration/package/data/asset changes, and no forbidden runtime API/provider/write/source-mutation surfaces.
- [x] 2026-05-14T19:12:47Z - Invoked the repo-local Pocket CFO operator skills requested for this slice: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-14T19:12:47Z - Confirmed the working branch is `codex/v2ac-read-only-chatgpt-app-mcp-read-only-evidence-tool-dispatch-adapter-implementation-local-v1` and the worktree starts clean.
- [x] 2026-05-14T19:12:47Z - Confirmed PR #273 and PR #274 are merged, FP-0108 exists and is shipped, FP-0109 and FP-0110 are absent, the FP-0107 `/mcp` route shell exists, and `ReadOnlyEvidenceToolService` exists under `apps/control-plane/src/modules/evidence-index/tools/service.ts`.
- [x] 2026-05-14T19:12:47Z - Ran all required baseline proof tools before edits; all passed.
- [x] 2026-05-14T19:43:59Z - Created the local `evidence-dispatcher.ts` adapter, optional `ReadOnlyAppMcpEndpointService` dispatcher injection, exact FP-0108 argument-schema reuse, focused dispatcher/service tests, and the direct adapter proof command.
- [x] 2026-05-14T19:43:59Z - Applied the minimum proof-gate bridge so exact FP-0109 is accepted, FP-0110 remains absent, and the older public-app/descriptor/benchmark inventory gates recognize the new dispatcher file as part of the existing local `/mcp` adapter family rather than a new endpoint.
- [x] 2026-05-14T19:43:59Z - Refreshed directly stale active docs, threat/demo policy docs, roadmap, and `plugins.md` to record FP-0109 as shipped local injected adapter work while keeping default/public/remote evidence dispatch enablement future-only.
- [x] 2026-05-14T19:43:59Z - Ran same-branch QA and final validation through `git diff --check`, all required proof tools, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed before this closeout edit.
- [x] 2026-05-14T19:52:38Z - Completed the required post-closeout validation rerun, committed `d2c4faa01f369b8793d1c604a3890a0640a7a94a`, pushed the requested branch, and opened PR #275.

## Surprises & Discoveries

- Post-merge hardening found three adapter-level weaknesses after PR #275 merged: `companyKey` was schema-validated but not semantically enforced, `fetch_source_coverage` validated `sourceId` but did not pass it to `ReadOnlyEvidenceToolService`, and `structuredContent` returned only a prose text block instead of a bounded JSON text mirror.
- `fetch_company_posture.periodKey` is a declared optional argument but the existing read-only service has no period-scoped posture method. The safer FP-0109 correction is to fail closed when `periodKey` is present rather than silently ignoring it.
- The source-coverage correction can be handled as a store-only filter in `ReadOnlyEvidenceToolService.fetchSourceCoverage({ sourceId })`; no DB query, new loading path, schema change, or migration is needed.
- The current official Model Context Protocol Tools and Schema Reference pages explicitly keep `content`, `structuredContent`, and `isError` in the tool result shape and say structured content should also be mirrored as serialized JSON text for backwards compatibility. OpenAI Apps SDK Security & Privacy docs reinforce server-side validation and minimizing structured content without secrets.
- One validation wrapper initially failed because it used zsh array syntax before any repo command executed. The same focused ladder was rerun under bash; focused specs passed and the adapter proof passed after removing a literal key-name string from the proof source scan.
- No blocker was found in preflight. The repository already has the shipped FP-0107 local route shell, the FP-0107 transport/status hardening merge, and the shipped FP-0108 evidence dispatch contracts.
- Official OpenAI Developers was present as an installed plugin family, but no separate read-only docs tool was needed. Official web docs were used as read-only protocol/security context only.
- Older public-app, descriptor, and benchmark proof gates carried their own endpoint-path scans. They needed narrow allowlist updates for `apps/control-plane/src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.ts` and its focused spec so FP-0109 could add the injected adapter without being mistaken for route expansion.
- TypeScript caught one synthetic test-fixture snapshot missing `sourceId`; the fixture was corrected without changing runtime behavior.

## Decision Log

- This post-merge correction remains inside FP-0109. It does not create FP-0110 and does not enable default local evidence dispatch.
- The adapter now requires an explicit expected company context at construction. Every parsed tool `companyKey` must match that context, and mismatches fail closed before any evidence service call.
- `fetch_source_coverage` now passes the declared `sourceId` to the read-only service. The service filters the already-loaded source coverage matrix by exact `sourceId` and returns a structured unsupported/missing response when the source id cannot be found.
- The optional `fetch_company_posture.periodKey` argument fails closed with `unsupported_argument` until a later plan adds a service method that can semantically honor period-scoped posture.
- MCP tool result `content[0].text` is now a bounded JSON summary mirror of `structuredContent`. It intentionally mirrors envelope counts, freshness, refusal, and capability posture rather than raw result payloads, full files, tokens, credentials, cookies, sessions, OAuth material, object-store dumps, database dumps, provider credentials, OpenAI keys, or private raw finance data.
- Domain refusal reasons were extended only to record the new adapter fail-closed states: `company_key_mismatch` and `unsupported_argument`.
- FP-0109 will add a local `evidence-dispatcher.ts` adapter in the existing `apps/control-plane/src/modules/read-only-app-mcp-endpoint/` bounded context rather than modifying `ReadOnlyEvidenceToolService` or adding a new route subsystem.
- `ReadOnlyAppMcpEndpointService` will accept an optional dispatcher dependency. When absent, the FP-0107 fail-closed `tools/call` result remains the default behavior. When present, the service validates tool name and exact FP-0108 arguments first, then calls the dispatcher.
- The adapter will return MCP tool results with `content`, `structuredContent`, and `isError`. It will preserve evidence, source anchors, freshness, limitations, permitted next actions, refusal reason, and capability boundary from the existing evidence service.
- Unsupported, missing, stale, or conflicting evidence postures from the existing read-only service will be mapped into structured refusal envelopes instead of raw protocol crashes or raw dumps.
- Proof-source hardening will keep changed-file scanning and add durable repository/proof-source scanning for no OpenAI API/model/client/key usage across the route adapter, evidence tool service, domain dispatch contracts, and dispatch proof tools.
- Public app implementation and public app submission remain future-only. FP-0110 must remain absent.
- Default route registration stays fail-closed. FP-0109 proves injected dispatch only; enabling default local evidence dispatch without explicit service construction remains a future named plan.
- No replay event is required because FP-0109 performs no mission state change, ingest, report action, source mutation, finance write, external action, or durable finance output.

## Context and Orientation

FP-0107 shipped exactly one local/control-plane Fastify `/mcp` route-adapter shell. `POST /mcp` is the JSON-RPC request entrypoint. `GET /mcp` is handled only as SSE unavailable with HTTP 405 and `Allow: POST`. Accepted notifications return HTTP 202 with no body. Non-local `Origin` headers fail closed. `initialize`, `ping`, `notifications/initialized`, `tools/list`, structured JSON-RPC errors, and fail-closed `tools/call` are handled.

FP-0108 shipped local/proof-only/read-only domain contracts and proof tooling for exact V2G evidence tool dispatch mappings, strict argument schemas, evidence/refusal envelopes, freshness/source-anchor requirements, and no raw dump/no advice/no mutation/no write/no provider/no external/no OpenAI/model boundaries. It intentionally did not implement runtime dispatch.

FP-0109 is the next narrow implementation slice. It keeps route registration default-safe and injects dispatch only through an explicit service dependency.

Official docs used as read-only context:

- Model Context Protocol specification 2025-11-25, "Tools" page, purpose: confirm `tools/list`, `tools/call`, `inputSchema`, optional output schema, structured results, and the backwards-compatible serialized JSON TextContent mirror for `structuredContent`.
- Model Context Protocol specification 2025-11-25, "Schema Reference" page, purpose: confirm `CallToolRequest`, `CallToolResult`, `content`, `structuredContent`, and `isError` shape, including tool-originated errors inside result objects.
- Model Context Protocol specification, "Transports" page, purpose: confirm Streamable HTTP `/mcp` GET may return HTTP 405 when SSE is unavailable. FP-0109 does not change GET behavior.
- OpenAI Apps SDK, "Reference" page, purpose: confirm ChatGPT Apps SDK tool-result UI bridge visibility for `structuredContent`, `content`, and `_meta`. FP-0109 does not add Apps SDK resources.
- OpenAI Apps SDK, "Security & Privacy" page, purpose: confirm least privilege, explicit server-side validation, prompt-injection assumptions, structured-content minimization, secret avoidance, and logging redaction context. FP-0109 does not implement OAuth, public app behavior, or external calls.

GitHub connector work is explicitly out of scope. Routine `git`, `gh pr view`, `git push`, and `gh pr create` CLI actions are repository workflow actions, not product connector behavior.

## Plan of Work

Create a local evidence dispatch adapter that depends on a read-only service interface compatible with `ReadOnlyEvidenceToolService`. Wire it into `ReadOnlyAppMcpEndpointService` as an optional dependency only. Keep `registerReadOnlyAppMcpEndpointRoutes` thin and safe: it may continue accepting a service dependency, but it must not construct evidence data, DB connections, providers, OpenAI clients, OAuth handlers, or sessions.

Add focused specs for the dispatcher, service injection, and unchanged route behavior. Add `tools/read-only-mcp-evidence-tool-dispatch-adapter-proof.mjs`, then update only the minimum proof-gate surfaces so exact FP-0109 is accepted while FP-0110 remains absent and FP-0108/0107/0106/0105/0104/0103/0100 boundaries remain intact.

For the post-merge correction, harden only the adapter/proof/docs slice: enforce expected company context, honor or fail closed on declared arguments, add a source-coverage `sourceId` shim over the already-loaded artifact store, and mirror structured content with bounded JSON text. Do not add routes, DB queries, schemas, migrations, package scripts, OAuth/session, remote MCP, Apps SDK resources, public app behavior, app submission, public assets, source mutation, finance writes, providers, external communications, OpenAI API/model calls, or FP-0110.

Refresh only directly stale active docs and `plugins.md`.

## Concrete Steps

1. Keep this plan current as implementation proceeds.
2. Add `apps/control-plane/src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.ts`.
3. Update `apps/control-plane/src/modules/read-only-app-mcp-endpoint/service.ts` for optional dispatcher injection after existing tool-name and argument validation.
4. Update `formatter.ts` only if needed to preserve the default fail-closed result and structured dispatch result shape.
5. Add focused `evidence-dispatcher.spec.ts` and update `service.spec.ts` and `routes.spec.ts` only for dependency-injection and unchanged-route behavior.
6. Add `tools/read-only-mcp-evidence-tool-dispatch-adapter-proof.mjs`.
7. Update the minimum existing proof-gate bridge surfaces needed for exact FP-0109 acceptance and FP-0110 rejection.
8. Add durable no-OpenAI/API/model/key proof-source scanning over the route adapter, evidence tool service, domain dispatch/protocol contracts, and dispatch proof tools.
9. Refresh directly stale active docs and plugin inventory if they still stop at FP-0108.
10. Run focused validation, same-branch QA, final validation, closeout, one commit, push, and PR creation.
11. Post-merge hardening correction: keep the same FP-0109 plan, enforce adapter `companyKey` context, pass source-coverage `sourceId` through a store-only service shim, fail closed on unsupported `periodKey`, add bounded JSON text mirrors for `structuredContent`, update focused specs/proof fields, refresh directly stale docs, rerun strict same-branch validation, and commit once.

## Validation and Acceptance

Required final validation:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-evidence-tool-dispatch-adapter-proof.mjs
pnpm exec tsx tools/read-only-mcp-evidence-tool-dispatch-proof.mjs
pnpm exec tsx tools/read-only-mcp-route-adapter-proof.mjs
pnpm exec tsx tools/read-only-mcp-protocol-envelope-proof.mjs
pnpm exec tsx tools/read-only-endpoint-route-ownership-proof.mjs
pnpm exec tsx tools/read-only-endpoint-architecture-proof.mjs
pnpm exec tsx tools/read-only-public-app-security-boundary-proof.mjs
pnpm exec tsx tools/read-only-mcp-descriptor-response-envelope-proof.mjs
pnpm exec tsx tools/read-only-chatgpt-app-mcp-proof.mjs
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/service.spec.ts src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is observable when the new proof command prints machine-readable JSON with the FP-0109 adapter fields, default route/service `tools/call` remains fail-closed with no dispatcher, injected dispatch handles every exact V2G tool through `ReadOnlyEvidenceToolService`, invalid names/arguments fail closed, unsupported/missing/stale/conflicting evidence maps to structured refusals, structured content preserves evidence/source/freshness/limitations/permitted next actions/refusal/capability boundary, and strict QA proves no route expansion, DB query, schema/migration/package script, fixture/data/source-pack/public asset, OpenAI API/model/client/key usage, provider call, external communication, source mutation, finance write, generated finance advice, public app behavior, app submission, remote MCP, OAuth/token/session, Apps SDK resource, autonomous action, or FP-0110.

Post-merge hardening acceptance additionally requires machine-readable proof fields for `companyContextBoundaryVerified`, `companyKeyMismatchFailsClosed`, `declaredToolArgumentsUsedOrFailClosed`, `sourceCoverageSourceIdHonoredOrFailsClosed`, `optionalArgumentsHonoredOrFailClosed`, `structuredContentTextMirrorVerified`, `boundedTextMirrorNoRawDumpVerified`, unchanged default fail-closed route behavior, injected dispatch enablement, FP-0109 boundary preservation, FP-0110 absence, and unchanged no-OpenAI/API/model/key posture.

Replay implications: FP-0109 does not perform mission state changes, ingest actions, report actions, source mutations, or finance writes. No replay event is emitted by this slice. The adapter returns read-only evidence/source envelopes only.

Evidence, provenance, freshness, and limitations: successful and refusal tool results must carry evidence/source anchors, freshness posture, limitations, permitted next actions, refusal reason when applicable, and capability boundary. Raw full-file dumps and model output as source truth remain forbidden.

## Idempotence and Recovery

The slice is additive and dependency-injected. If validation fails, patch this same branch inside the FP-0109 allowed files and rerun the failing focused checks plus required final validation. If the implementation accidentally opens route expansion, DB access, schema/migration/package script changes, provider/OpenAI/model calls, source mutation, finance writes, public assets, app submission, OAuth/session, remote MCP, or Apps SDK resources, revert only the FP-0109 changes that opened that boundary and narrow back to the adapter.

If the plan file is accidentally duplicated, delete the duplicate and keep only `plans/FP-0109-read-only-chatgpt-app-mcp-read-only-evidence-tool-dispatch-adapter-implementation.md`. Do not create FP-0110 in this slice.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0109-read-only-chatgpt-app-mcp-read-only-evidence-tool-dispatch-adapter-implementation.md`
- `apps/control-plane/src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.ts`
- Focused control-plane service/route/dispatcher specs
- `tools/read-only-mcp-evidence-tool-dispatch-adapter-proof.mjs`
- Minimum proof-gate bridge edits
- Durable no-OpenAI/API/model/key proof-source hardening
- Directly stale active-doc and `plugins.md` refreshes, if needed
- Post-merge hardening updates for expected-company enforcement, declared-argument fail-closed behavior, source-coverage `sourceId` filtering, bounded structured-content text mirrors, and the adapter proof JSON fields named in the correction prompt

No raw source files are changed. No generated finance advice, source mutation, finance write, provider call, external communication, OpenAI API/model call, public asset, screenshot, listing copy, app submission artifact, fixture, sample data, dataset, source pack, migration, DB query, package script, or autonomous action is created.

## Interfaces and Dependencies

The adapter depends on the existing `ReadOnlyEvidenceToolService` method shape, an explicit expected company context, and the domain FP-0108 argument schemas. It returns MCP tool result objects for the existing `/mcp` service path only when explicitly injected. `ReadOnlyEvidenceToolService.fetchSourceCoverage({ sourceId })` remains a read-only store-filter shim over already-loaded artifacts and does not add DB queries or new loading behavior.

`apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts` stays transport-only and does not construct evidence data, DB connections, providers, OAuth/session handlers, OpenAI clients, or model clients. Default app registration remains safe/local.

No new environment variables are introduced. Internal `@pocket-cto/*` package scope remains unchanged.

## Outcomes & Retrospective

FP-0109 shipped the first narrow local read-only evidence dispatch adapter for the existing `/mcp` `tools/call` service path. The adapter maps the exact V2G tool allowlist to `ReadOnlyEvidenceToolService`, validates exact FP-0108 arguments before dispatch, returns MCP tool results with `content`, `structuredContent`, and `isError`, and preserves evidence, source anchors, freshness, limitations, permitted next actions, refusal reason, and capability boundary.

Default `ReadOnlyAppMcpEndpointService` behavior remains FP-0107 fail-closed when no dispatcher is injected. Route registration remains thin and safe; no new route path, GET `/mcp` behavior change, DB query, schema/migration, package script, fixture/data/source-pack/public asset, OAuth/token/session, remote MCP deployment, Apps SDK resource, public app behavior, app submission, provider/external/OpenAI/model call, source mutation, finance write, generated finance advice, or autonomous action was added.

Final implementation validation passed before the FP-0109 implementation commit:

- `git diff --check`
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
- Focused domain specs for benchmark/community, app/MCP, descriptor, public security, endpoint architecture, endpoint ownership, protocol envelope, and evidence tool dispatch
- Focused control-plane route/service/dispatcher specs
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Post-closeout validation reran `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` before the single implementation commit. PR #275 was opened from `d2c4faa01f369b8793d1c604a3890a0640a7a94a` on the requested branch. Same-branch QA may patch only defects inside the FP-0109 slice and must keep FP-0110 absent.
