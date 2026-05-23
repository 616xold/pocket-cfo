# Plan read-only ChatGPT App MCP invalid-token route integration sequencing

## Purpose / Big Picture

Target phase: V2BJ read-only ChatGPT App/MCP invalid-token route integration sequencing.

FP-0142 is a docs-and-plan plus proof-gate compatibility only slice after FP-0141. The goal is to decide the next safe sequencing rules for invalid-token challenge route integration, app-construction wiring readiness, dependency co-registration, and Authorization-present semantics before any broader runtime work starts.

FP-0142 does not implement route integration. FP-0142 does not change `/mcp` route behavior. FP-0142 does not add buildApp wiring. FP-0142 does not parse Authorization headers or tokens, decode JWTs, introspect tokens, implement OAuth, add token/session storage, add auth middleware, change protected-resource metadata route behavior, change missing-token behavior, add DB queries, add schemas, add migrations, add package scripts, call OpenAI APIs or models, call providers, mutate sources, or write finance state.

The proof point is narrow: FP-0141 remains a local-only invalid-token challenge runtime mapping from sanitized FP-0139 result envelopes, while FP-0142 records the compatibility gates that must be green before a future implementation plan can wire that behavior through app construction.

## Progress

- [x] 2026-05-23T00:58:24Z - Confirmed PR #320 / FP-0141 is merged to `main`, the worktree starts clean on `codex/v2bj-read-only-chatgpt-app-mcp-invalid-token-route-integration-sequencing-master-plan-local-v1`, FP-0142 is absent, FP-0143 is absent, and baseline proof gates/specs pass before edits.
- [x] 2026-05-23T00:58:24Z - Invoked the repo-local `pocket-cfo-codex-operator` Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-23T00:58:24Z - Reviewed official read-only protocol/platform references for sequencing context: MCP Authorization, MCP Security Best Practices, RFC 6750, RFC 8707, RFC 9728, OpenAI Apps SDK Authentication, and OpenAI Apps SDK Security & Privacy. OpenAI Developers exposed no read-only docs tool in this thread, so official web docs were used instead.
- [x] 2026-05-23T00:58:24Z - Created the FP-0142 plan boundary, proof-gate bridge, focused specs, direct proof command, and directly stale active-doc/plugin refresh.
- [x] 2026-05-23T02:30:20Z - Closed out FP-0142 after green focused specs, full proof ladder, `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

## Surprises & Discoveries

FP-0141 already keeps default `buildApp()` behavior unchanged because app construction does not pass `readOnlyAppMcpInvalidTokenChallengeResultEnvelope`. The current route-registration seam can still be exercised in focused tests through explicit dependency injection, but default app wiring remains absent.

FP-0141 already rejects `missing_token` and accepted FP-0139 envelopes for invalid-token challenge mapping. FP-0142 adds proof-gate wording and machine-readable checks so the failure taxonomy, HTTP posture, symbolic `WWW-Authenticate` error, and emitted header error must remain mutually consistent before future route wiring expands.

OpenAI Developers tooling was available only as plugin family context in this thread; tool discovery exposed API-key setup surfaces rather than read-only docs. Because key setup and API/model calls are out of scope, FP-0142 uses official web documentation only.

Several older proof gates classify changed paths with `route`, `token`, or `endpoint` in their names as suspicious until the exact artifact is registered as proof-only. FP-0142 therefore added narrow allowlist bridges for the exact FP-0142 plan/proof paths in the affected proof inventories without changing runtime route behavior.

## Decision Log

- 2026-05-23T00:58:24Z - Invalid-token route integration can start from current repo truth only as planning and proof-gate compatibility. Route integration implementation remains blocked.
- 2026-05-23T00:58:24Z - Future invalid-token route integration must be app-construction explicit only. App-construction wiring implementation remains blocked, buildApp wiring remains future-only, and hidden/default wiring is not allowed.
- 2026-05-23T00:58:24Z - Future invalid-token challenge activation requires an Authorization header to be present. Missing credentials stay in the FP-0130 missing-token lane.
- 2026-05-23T00:58:24Z - Future invalid-token wiring must be co-registered with the missing-token challenge dependency so missing-token challenge must take precedence when the Authorization header is absent.
- 2026-05-23T00:58:24Z - Future invalid-token wiring must also be co-registered with accepted protected-resource metadata route-input evidence before it can advertise `resource_metadata`.
- 2026-05-23T00:58:24Z - Malformed Authorization can be represented without parsing raw Authorization headers only as a sanitized FP-0139 `malformed_authorization` result envelope produced by a separately planned validation layer.
- 2026-05-23T00:58:24Z - Protected-resource metadata route behavior remains separate and unchanged. FP-0142 does not change GET `/.well-known/oauth-protected-resource/mcp`.
- 2026-05-23T00:58:24Z - FP-0141 result-envelope dependency may be surfaced through buildApp only in a future explicit app-construction plan after co-registration and Authorization-present gates are proven; route-registration-only remains the current state.
- 2026-05-23T00:58:24Z - FP-0139 result envelopes are the only permitted source for invalid-token challenge behavior. FP-0134 synthetic evaluator output remains proof/test-only and token-validation test-double output remains out of routes.
- 2026-05-23T00:58:24Z - Failure taxonomy / HTTP posture / symbolic WWW-Authenticate error values must be cross-validated with the emitted header error before FP-0143 may implement route integration.
- 2026-05-23T00:58:24Z - Future FP-0143 remains absent in this slice.

## Context and Orientation

FP-0141 shipped local invalid-token challenge runtime mapping from sanitized FP-0139 token-validation result envelopes on the existing explicit-dependency `/mcp` route-registration seam. It intentionally did not ship production token validation, token parsing, JWT decoding, token introspection, OAuth, token/session storage, auth middleware, missing-token behavior changes, protected-resource metadata route changes, or default app-construction wiring.

FP-0142 exists because wiring an invalid-token challenge through app construction is not just a transport question. It must preserve the RFC 6750 distinction between missing credentials and failed credentials, the MCP Authorization expectation that invalid or expired tokens challenge with `WWW-Authenticate`, the MCP protected resource metadata discovery posture, the RFC 8707 resource-indicator/audience posture, and the RFC 9728 protected resource metadata reference model. It must also preserve Pocket CFO’s local-only no-token-echo and evidence-first boundaries.

Official research used for this plan:

- MCP Authorization spec - invalid/expired token challenge behavior, insufficient-scope posture, protected-resource metadata discovery, resource indicators, and token-passthrough prohibition.
- MCP Security Best Practices: token passthrough prohibition, audience/resource validation, confused-deputy posture, and resource metadata URL handling.
- RFC 6750: `invalid_request`, `invalid_token`, `insufficient_scope`, and the distinction between missing credentials and failed credentials.
- RFC 8707: resource indicators and audience/resource binding context.
- RFC 9728: protected resource metadata and `WWW-Authenticate` metadata discovery.
- OpenAI Apps SDK Authentication: MCP challenge plumbing, `_meta["mcp/www_authenticate"]` context, and protected resource metadata references.
- OpenAI Apps SDK Security & Privacy: no secret leakage, least-privilege, and privacy/security posture for future public app planning.

GitHub connector product behavior is out of scope. Figma/design-generation plugins, OpenAI Platform key setup, OpenAI API/model calls, dependency installation, artifact uploads, generated screenshots, public assets, listing copy, app-submission materials, provider/certification/deployment execution, external communications, source mutation, finance writes, and autonomous action are out of scope.

## Plan of Work

Create exactly one active Finance Plan at `plans/FP-0142-read-only-chatgpt-app-mcp-invalid-token-route-integration-sequencing-master-plan.md`.

Add one direct proof command at `tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs` that prints machine-readable JSON and proves FP-0142 is docs-and-plan/proof-gate only, the exact FP-0142 path is accepted, FP-0143 remains absent, future route integration and buildApp wiring remain blocked, Authorization-present semantics are recorded, missing-token precedence is explicit, protected-resource metadata separation is preserved, FP-0139 result-envelope-only dependency is preserved, failure taxonomy / HTTP posture / symbolic WWW-Authenticate error values must be cross-validated, and prior FP-0141/0140/0139/0138/0137/0136/0134/0130/0125/0107/0106/0100 boundaries remain intact.

Bridge the minimum domain/spec surface so prior proof gates accept exactly this FP-0142 plan while rejecting extra FP-0142 files and any FP-0143 file. Add proof-only hardening for FP-0141 consistency checks if the existing local-runtime proof does not already name them explicitly.

Refresh directly stale active docs and plugin notes only where they still say FP-0142 is absent/future-only.

## Concrete Steps

1. Keep the branch on `codex/v2bj-read-only-chatgpt-app-mcp-invalid-token-route-integration-sequencing-master-plan-local-v1`.
2. Add FP-0142 domain proof helpers/specs under `packages/domain/src/read-only-app-mcp-invalid-token-challenge*`.
3. Add `tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs`.
4. Harden `tools/read-only-mcp-invalid-token-challenge-local-runtime-proof.mjs` only in proof output/checks so it explicitly proves taxonomy/status/header consistency, `missing_token` rejection, accepted-envelope rejection, default route behavior unchanged when the invalid-token dependency is absent, local-only no-header/no-token parsing behavior, and no token examples/JWT-like/Bearer material in plan/docs/proof outputs.
5. Update `docs/ACTIVE_DOCS.md`, `docs/PROJECT_STATE.md`, `docs/V2_BOUNDARY.md`, `plans/ROADMAP.md`, `README.md`, `START_HERE.md`, and `plugins.md` only if their current FP-0142/FP-0143 boundary wording is directly stale.
6. Run the validation ladder listed below and patch only same-branch proof/doc issues if needed.
7. Close out this plan after validation and rerun the required post-closeout validation subset.
8. Commit exactly once, push the branch, and open the PR.

## Validation and Acceptance

Acceptance is observable when:

- `plans/FP-0142-read-only-chatgpt-app-mcp-invalid-token-route-integration-sequencing-master-plan.md` exists and is the only FP-0142 plan.
- FP-0143 remains absent.
- The direct proof command prints JSON with the required FP-0142 fields all `true`.
- Future route integration implementation remains blocked.
- Future buildApp wiring implementation remains blocked.
- Authorization-present activation, missing-token precedence, dependency co-registration, protected-resource metadata separation, and FP-0139 result-envelope-only source decisions are explicitly recorded.
- No `/mcp` route behavior, metadata route behavior, or missing-token behavior changes are introduced by FP-0142.
- No production token validation, token parser, JWT decoder, token introspection, OAuth/session/auth middleware, evaluator/test-double route consumption, real token examples, JWT-like examples, Bearer material, token echo, token logging, DB queries, schema migrations, package scripts, OpenAI API/model calls, provider calls, source mutation, or finance writes are introduced.
- Prior FP-0141, FP-0140, FP-0139, FP-0138, FP-0137, FP-0136, FP-0134, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100 boundaries remain green.

Validation commands:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-local-runtime-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-implementation-planning-proof.mjs
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

If a post-validation closeout edit is made, rerun:

```bash
git diff --check
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

## Idempotence and Recovery

The slice is idempotent because it adds one exact plan path, one direct proof command, proof-only domain helpers/specs, and directly stale documentation refresh. Rerunning the proof command should continue to accept exactly this FP-0142 path and reject extra FP-0142 or any FP-0143 path.

If validation fails, do not widen scope. Do not implement route integration, app wiring, production token validation, token parsing, JWT decoding, introspection, OAuth/session/auth middleware, missing-token behavior changes, metadata route changes, DB/schema/package/data/OpenAI/provider/source/finance-write scope, or public app behavior. Patch only the failing FP-0142 proof/doc compatibility issue on this branch, or stop and recommend the smallest corrective slice named by the failing boundary.

Rollback is documentation/proof-only: remove the FP-0142 plan/proof bridge and restore directly stale docs to the FP-0141 state. No raw source file, uploaded evidence, persisted finance state, database schema, route behavior, app construction, or package script is mutated by this plan.

## Artifacts and Notes

Primary artifacts:

- `plans/FP-0142-read-only-chatgpt-app-mcp-invalid-token-route-integration-sequencing-master-plan.md`
- `tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs`
- proof-gate helpers/specs under `packages/domain/src/read-only-app-mcp-invalid-token-challenge*`
- directly stale active-doc/plugin refresh if needed

Evidence and replay posture: this is a planning/proof-gate compatibility slice. It does not change mission state, ingest sources, produce finance answers, issue reports, or create runtime evidence bundles. Replay implications are covered by the explicit no-runtime/no-mission-state posture and machine-readable proof output. Any future runtime route integration must record replay or an explicit reason why replay is not applicable in its own plan.

Provenance, freshness, and limitations: official MCP/RFC/OpenAI docs were used only as read-only planning context. Finance evidence remains the source of truth for product answers. FP-0142 creates no source-derived answer, no report, no public prose artifact, no generated advice, and no external communication.

Monitoring posture: F6 monitoring semantics are unchanged. No monitoring stored-state input contract, alert semantics, proof-bundle delivery path, or human-review boundary changes in this slice.

Workflow and environment posture: no `WORKFLOW.md` change is needed. No stack-pack change is needed. No new environment variable is added.

## Interfaces and Dependencies

Current runtime interfaces remain unchanged:

- `POST /mcp` remains the existing local route.
- GET `/.well-known/oauth-protected-resource/mcp` remains the existing protected-resource metadata route.
- FP-0130 missing-token challenge behavior remains separate.
- FP-0141 invalid-token challenge behavior remains available only through explicit route-registration dependency injection of sanitized FP-0139 result envelopes.
- Default `buildApp()` does not wire invalid-token challenge behavior.

Future implementation prerequisites before FP-0143 may implement route integration:

- The exact FP-0142 proof command is green.
- FP-0141 local-runtime proof is green.
- FP-0140 implementation-planning proof is green.
- FP-0139 result-envelope proof is green.
- FP-0138, FP-0137, FP-0136, FP-0134, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100 boundary proofs are green.
- Future buildApp wiring is explicit and co-registers missing-token challenge dependency, accepted protected-resource metadata route-input evidence, and invalid-token result-envelope dependency.
- Invalid-token challenge activation is gated to Authorization-present requests.
- Missing-token challenge takes precedence when the Authorization header is absent.
- Malformed Authorization is represented only by a sanitized FP-0139 envelope and not by parsing raw headers in the route.
- Failure taxonomy / HTTP posture / symbolic WWW-Authenticate error values and emitted header error are cross-validated.

Permanently forbidden in FP-0142 and not authorized for automatic follow-on work: production token validation, token parser, JWT decoder, token introspection, OAuth, token/session storage, auth middleware, real token examples, JWT-like examples, Bearer material, token echo, token logging, evaluator/test-double route consumption, DB queries, schemas, migrations, package scripts, OpenAI API/model calls, provider calls, source mutation, finance writes, public app submission, public assets, generated listing copy, external communications, and autonomous action.

## Outcomes & Retrospective

FP-0142 is closed as a docs-and-plan plus proof-gate compatibility record. It created the exact FP-0142 plan, added the direct machine-readable route-integration sequencing proof, refreshed directly stale active docs/plugin notes, and hardened the FP-0141 local-runtime proof output so invalid-token failure taxonomy, HTTP posture, symbolic `WWW-Authenticate` error, and emitted header error consistency are explicit.

Validation before closeout was green for the focused domain/control specs, the full proof ladder listed in this plan, `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

No `/mcp` route behavior, protected-resource metadata route behavior, missing-token behavior, default app wiring, production token validation, token parser, JWT decoder, token introspection, OAuth/session/auth middleware, DB/schema/package script scope, OpenAI API/model call, provider call, source mutation, finance write, public asset, listing copy, public submission material, or autonomous action was added.

Public ChatGPT App submission should wait. Invalid-token app-construction wiring should start only after this FP-0142 proof gate is merged and a narrow future implementation plan is opened.
