# FP-0113 read-only ChatGPT App MCP OAuth token/session security contracts foundation

## Purpose / Big Picture

FP-0113 is a local/proof-only/read-only OAuth, token/session, user/org/company binding, and public MCP security contract foundation for the future remote/public read-only ChatGPT App/MCP path.

This slice exists because FP-0112 shipped remote/public MCP deployment and OAuth readiness planning and explicitly decided that the current local `/mcp` route must not be exposed remotely as-is. FP-0112 also decided that FP-0111 local explicit dispatch wiring is not enough for public exposure. Before any OAuth implementation, token/session implementation, auth middleware, remote MCP deployment, Apps SDK resources, public ChatGPT App behavior, or app submission can start, this repo needs local proof contracts for authenticated identity, org/admin consent, read-only RBAC, authenticated company binding, OAuth scope/audience posture, token lifecycle boundaries, token leak prevention, and fail-closed token refusal.

FP-0113 is contract/proof work only. It is not OAuth implementation. It is not token/session implementation. It is not auth middleware. It is not remote MCP deployment. It is not route expansion. It is not a new endpoint. It does not change `/mcp` route behavior. It does not add Apps SDK iframe/resource implementation, public ChatGPT App implementation, app submission, DB queries, schema or migration work, package scripts, OpenAI API/model integration, provider/certification/deployment execution, external communications, source mutation, finance writes, generated finance advice, runtime-Codex finance output, public assets, sample data, source packs, or autonomous action. FP-0114 remains absent.

The proof point is not that Pocket CFO can authenticate public users yet. The proof point is that the repo now has exact local contracts for what must be true before customer-specific evidence can ever be exposed through a public MCP surface.

## Progress

- 2026-05-15T14:56:33Z: Invoked the repo-local pocket-cfo-codex-operator skills requested for this slice: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor.
- 2026-05-15T14:56:33Z: Confirmed work is on `codex/v2ag-read-only-chatgpt-app-mcp-oauth-token-session-security-contracts-foundation-local-v1`.
- 2026-05-15T14:56:33Z: Confirmed PR #279 is merged, FP-0112 exists and is shipped, FP-0113 and FP-0114 were absent before this slice, and baseline proof tools passed before edits.
- 2026-05-15T14:56:33Z: Tool discovery exposed OpenAI Platform key-setup tools but no read-only OpenAI Developers docs tool; used official OpenAI Apps SDK web docs and official MCP web docs only as read-only protocol/security context.
- 2026-05-15T14:56:33Z: Created this FP-0113 plan as the single allowed OAuth/token/session security contract foundation artifact.
- 2026-05-15T15:27:42Z: Added pure domain OAuth/security contracts, focused specs, direct machine-readable proof tooling, proof-gate bridge compatibility, durable no-OpenAI/API/model/key proof-source hardening, and directly stale active docs/plugin refresh.
- 2026-05-15T15:27:42Z: Validation passed for `git diff --check`, all required proof tools including `tools/read-only-mcp-oauth-security-boundary-proof.mjs`, focused domain specs, focused control-plane route/service/app-wiring specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- 2026-05-15T15:27:42Z: Closeout note added before the required post-closeout rerun. Remaining work is repository operations only: final rerun, one commit, push, and PR creation if auth allows.

## Surprises & Discoveries

- OpenAI Apps SDK docs say apps that expose customer-specific data should authenticate users. That confirms Pocket CFO must bind identity before returning public/customer-specific evidence.
- Official MCP authorization docs require token validation for the intended audience/resource and secure token handling. That confirms client-supplied `companyKey` or user/model text cannot become authority.
- Official MCP security docs explicitly warn against token passthrough and broad scopes. That confirms FP-0113 should prove token passthrough is forbidden and scope minimization remains exact and reviewed before implementation.
- No route or runtime code needs to change for this slice. Any route, middleware, OAuth flow, token store, session store, DB, deployment, Apps SDK resource, app-submission, public asset, provider, source, or finance-write change would be a scope violation.

## Decision Log

- Decision: OAuth is future-only and not implemented by FP-0113.
- Decision: Token/session storage is future-only and not implemented by FP-0113.
- Decision: Auth middleware is future-only and not implemented by FP-0113.
- Decision: Remote MCP deployment remains future-only and blocked.
- Decision: The local `/mcp` route behavior is unchanged and still must not be exposed remotely as-is.
- Decision: Public exposure remains blocked until later host, auth, org/RBAC, company-binding, abuse-control, logging, and rollback contracts are accepted.
- Decision: User identity must be authenticated before public/customer-specific evidence is returned.
- Decision: Admin/org consent must be reviewed before public app usage.
- Decision: Company binding must come from authenticated user/org membership, not model text, user prompt text, `_meta`, client-provided `companyKey`, or unauthenticated request parameters.
- Decision: Client-supplied `companyKey` is only a requested selector and must fail closed when it does not match authenticated binding.
- Decision: RBAC/action control must preserve the exact read-only tool allowlist and reject write/action/provider/deployment equivalents.
- Decision: OAuth scopes must be minimized, exact, and reviewed before implementation.
- Decision: Audience/resource validation is required before accepting any token.
- Decision: Token passthrough is forbidden.
- Decision: Missing, expired, malformed, wrong-audience, wrong-scope, and wrong-org token requests must fail closed by contract.
- Decision: Refresh-token/offline-access policy requires explicit review before implementation.
- Decision: Token storage, redaction, revocation, rotation, and replay protection remain contract-only.
- Decision: Token values may not appear in logs, UI props, component metadata, evidence cards, proof output, docs examples, or structured tool results.
- Decision: Origin, CORS, CSP, rate-limit, logging, rollback, and abuse-control are future host-readiness topics.
- Decision: No real finance data, no public demo data, no raw dumps, no source packs, and no private finance-data exposure are allowed.
- Decision: No provider calls, external communications, source mutation, finance writes, generated finance advice, app submission artifacts, or autonomous action are authorized.
- Decision: FP-0114 remains absent.

## Context and Orientation

The shipped local stack remains:

- FP-0100: local proof-only public-app security boundaries.
- FP-0106: local proof-only MCP protocol envelope and tool-dispatch proof contracts.
- FP-0107: local Fastify `/mcp` route shell with POST-only JSON-RPC entrypoint, GET 405 SSE-unavailable boundary, local Origin fail-closed posture, and default fail-closed `tools/call`.
- FP-0108: local proof-only evidence tool dispatch contracts.
- FP-0109: local injected read-only evidence dispatch adapter.
- FP-0110: docs-and-plan proof-gate compatibility for future default local dispatch enablement.
- FP-0111: explicit app-construction wiring where default `buildApp()` remains fail-closed without an explicit MCP endpoint dependency.
- FP-0112: docs-and-plan proof-gate compatibility for remote/public MCP deployment and OAuth readiness, with the current local route not safe for remote exposure.

FP-0113 adds only pure domain contracts, focused specs, one direct proof command, proof-source scans, and minimal proof-gate bridge compatibility so that FP-0113 is accepted while FP-0114 remains absent.

Official read-only research used:

- OpenAI Apps SDK, "Authentication": used to confirm that customer-specific data should authenticate users and authenticated MCP servers are expected to implement OAuth 2.1 conforming to the MCP authorization specification.
- OpenAI Apps SDK, "Security & Privacy": used to confirm least privilege, explicit consent, validation/audit logs, data minimization, and no secrets/tokens in component props.
- OpenAI Apps SDK, "Deploy your app": used only as future host context for stable HTTPS `/mcp`, TLS, logs, and metrics. No deployment tool or action was used.
- OpenAI Apps SDK, "Connect from ChatGPT": used only as future developer/public connector context requiring a reachable HTTPS MCP server. No connector was created.
- OpenAI Apps SDK, "Test your integration": used only as future validation context for tool correctness, schema validation, auth flow tests, and MCP Inspector-style local testing. No inspector dependency was installed or run.
- OpenAI Apps SDK, "Submit and maintain your app": used only to confirm app submission/public distribution remains a later review flow. No submission material was created.
- MCP specification, "Authorization": used to confirm OAuth 2.1, protected resource metadata, bearer token usage, audience/resource validation, secure token storage, short-lived access tokens, refresh-token rotation, HTTPS, PKCE, scope challenges, and fail-closed token posture.
- MCP specification, "Transports": used to confirm Streamable HTTP, `/mcp` transport shape, Origin validation, localhost binding, proper authentication, and POST/GET transport semantics for future host readiness.
- MCP specification, "Tools": used as read-only tool context for `tools/list`, `tools/call`, structured content, error handling, input validation, access controls, rate limiting, output sanitization, and audit logging.
- MCP docs, "Security Best Practices": used to confirm token passthrough prohibition, confused-deputy/session risks, scope minimization, SSRF considerations, and server-side authorization logic.

No OpenAI API, OpenAI model, OpenAI client, OpenAI API key setup, Vercel deployment/project tool, GitHub Connector Guard, Figma/design-generation workflow, provider call, upload, dependency install, screenshot, image, public asset, app-submission artifact, or external communication was used.

## Plan of Work

1. Preserve the shipped local `/mcp` route and FP-0111 explicit app-construction dispatch posture.
2. Add pure domain OAuth/security contracts under `packages/domain/src/read-only-app-mcp-oauth-security*.ts`.
3. Add focused domain specs proving deferral, identity/admin/org/RBAC/company-binding, scope/audience, token passthrough, token failure modes, redaction/no-leakage, public exposure block, no-real-finance-data, and prior-boundary preservation.
4. Add `tools/read-only-mcp-oauth-security-boundary-proof.mjs` to print machine-readable JSON with the FP-0113 proof fields.
5. Update minimal proof-gate bridges so exactly this FP-0113 plan is accepted and FP-0114 remains absent.
6. Keep or extend durable no-OpenAI/API/model/key scans across the requested proof-source set.
7. Refresh only directly stale active docs/plugin notes after validation.
8. Run focused validation, strict same-branch QA, final validation, commit exactly once, push the requested branch, and create the requested PR if auth and validation allow it.

## Concrete Steps

- Add `packages/domain/src/read-only-app-mcp-oauth-security-contracts.ts`.
- Add `packages/domain/src/read-only-app-mcp-oauth-security-builders.ts`.
- Add `packages/domain/src/read-only-app-mcp-oauth-security-proof.ts`.
- Add `packages/domain/src/read-only-app-mcp-oauth-security.ts`.
- Add `packages/domain/src/read-only-app-mcp-oauth-security.spec.ts`.
- Export the new module from `packages/domain/src/index.ts`.
- Add `tools/read-only-mcp-oauth-security-boundary-proof.mjs`.
- Patch only the minimal existing proof scripts/domain proof fields needed to accept FP-0113 while proving FP-0114 absent and preserving FP-0112/0111/0110/0109/0108/0107/0106/0100 boundaries.
- Patch directly stale docs and `plugins.md` if the implementation makes shipped-state docs stale.

## Validation and Acceptance

Acceptance requires:

- Exactly one FP-0113 plan exists at `plans/FP-0113-read-only-chatgpt-app-mcp-oauth-token-session-security-contracts-foundation.md`.
- FP-0114 remains absent.
- FP-0113 proves local/proof-only OAuth/token/session/security contracts only.
- OAuth implementation remains absent.
- Token/session implementation remains absent.
- Auth middleware remains absent.
- Remote MCP deployment remains absent.
- `/mcp` route behavior is unchanged.
- Public exposure remains blocked.
- Apps SDK resources, public app implementation, app submission, DB queries, schemas, migrations, package scripts, fixtures, sample data, source packs, public assets, OpenAI API/model/client/key usage, provider calls, external communications, source mutation, finance writes, generated finance advice, and autonomous action remain absent.
- Prior FP-0112/0111/0110/0109/0108/0107/0106/0100 boundaries remain verified.

Commands to run:

- `git diff --check`
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
- `pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/service.spec.ts src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts src/app.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

## Idempotence and Recovery

This slice is idempotent because it adds one plan path, pure domain contracts, focused specs, direct proof tooling, proof-source scans, and proof-gate bridge compatibility only. If validation fails, do not widen scope. Patch only the FP-0113 contracts, proof bridge, focused specs, or directly stale docs on this same branch, then rerun the required validation.

Do not recover by adding routes, route behavior changes, OAuth implementation, token/session implementation, auth middleware, DB queries, schemas, migrations, package scripts, remote MCP deployment, Apps SDK resources, public app behavior, app submission assets, public assets, data files, source packs, OpenAI API/model calls, provider calls, external communications, source mutation, finance writes, generated finance advice, autonomous action, or FP-0114.

If a blocker is outside this scope, stop and recommend the smallest safer corrective slice: FP-0113 OAuth/security proof-contract correction, FP-0112 readiness proof-gate bridge correction, FP-0111 local wiring correction, FP-0109 adapter correction, FP-0107 route adapter correction, or hold OAuth/security work until local dispatch wiring and readiness plans can be proven.

## Artifacts and Notes

- Plan artifact: `plans/FP-0113-read-only-chatgpt-app-mcp-oauth-token-session-security-contracts-foundation.md`.
- Domain/proof artifacts stay under `packages/domain/src/read-only-app-mcp-oauth-security*.ts` and `tools/read-only-mcp-oauth-security-boundary-proof.mjs`.
- Proof-gate bridge changes are limited to existing proof helpers/scripts that already guard the read-only ChatGPT App/MCP sequence.
- No raw source file, source snapshot, source pack, finance twin state, CFO Wiki compiled artifact, evidence bundle, report, provider artifact, public asset, screenshot, listing copy, app-submission artifact, or external artifact is created or mutated.
- Replay implication: no mission state, ingest, report, monitor, source registry, finance twin, or user-facing finance output changes occur, so no replay event is created. The recorded reason is that FP-0113 is local proof-contract work only.
- Provenance/freshness/limitations implication: no finance answer changes occur. The contracts require any future public/customer-specific evidence output to preserve provenance, freshness posture, and limitations after authenticated identity/company binding is implemented by a later plan.

## Interfaces and Dependencies

FP-0113 depends on shipped FP-0112, FP-0111, FP-0110, FP-0109, FP-0108, FP-0107, FP-0106, and FP-0100 boundaries plus official OpenAI Apps SDK and MCP protocol/security docs as read-only context.

No new runtime interface is introduced. No route, endpoint, auth middleware, OAuth provider, token store, session store, DB schema, migration, package script, deployment host, Apps SDK iframe/resource, OpenAI API/model integration, provider integration, public asset, or app-submission interface is added.

GitHub connector product behavior is explicitly out of scope. Routine `git`, `gh`, commit, push, and PR operations are repository operations only and do not make GitHub the Pocket CFO product center.

## Outcomes & Retrospective

FP-0113 shipped the local/proof-only/read-only OAuth/token/session/auth middleware and public MCP security contract foundation. The slice added no OAuth implementation, token/session implementation, auth middleware, route behavior change, route expansion, remote MCP deployment, Apps SDK resource, public app behavior, app submission, DB query, schema, migration, package script, fixture, sample data, source pack, public asset, OpenAI API/model/client/key usage, provider call, external communication, source mutation, finance write, generated finance advice, runtime-Codex finance output, autonomous action, or FP-0114.

The proof-gate bridge now accepts exactly one FP-0113 plan path while FP-0114 remains absent. Prior FP-0112, FP-0111, FP-0110, FP-0109, FP-0108, FP-0107, FP-0106, and FP-0100 boundaries remain verified.

Validation passed for the direct FP-0113 proof, all existing required proof tools, focused domain specs, focused control-plane route/service/app-wiring specs, repo-wide lint/typecheck/test, and `pnpm ci:repro:current`.

No replay event was created because no mission state, ingest, report, monitor, source registry, Finance Twin, CFO Wiki compiled artifact, or user-facing finance output changed. The recorded reason remains that FP-0113 is local proof-contract work only.
