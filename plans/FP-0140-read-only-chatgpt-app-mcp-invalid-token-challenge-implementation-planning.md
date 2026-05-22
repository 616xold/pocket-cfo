# Plan read-only ChatGPT App MCP invalid-token challenge implementation

## Purpose / Big Picture

Target phase: V2B local read-only ChatGPT App MCP safety planning.

FP-0140 is a docs-and-plan plus proof-gate compatibility only slice after FP-0139. It decides whether invalid-token challenge runtime implementation can start from current repo truth, and it creates the proof bridge that allows exactly one FP-0140 planning file while FP-0141 remains absent.

This plan does not implement invalid-token challenge behavior. It does not emit WWW-Authenticate headers. It does not change /mcp route behavior, does not change protected-resource metadata route behavior, and does not change missing-token behavior. It does not implement token validation runtime, token parsing, JWT decoding, token introspection, OAuth, token/session storage, auth middleware, DB queries, schemas, migrations, package scripts, provider calls, OpenAI API/model calls, source mutation, finance writes, public app-submission assets, listing copy, or autonomous action.

For proof wording, FP-0140 also records the exact negative boundary: it does not parse tokens, does not decode JWTs, does not introspect tokens, does not implement OAuth, does not add token/session storage, does not add auth middleware, and does not consume synthetic evaluator output from routes.

The proof point is not a route response. The proof point is that the repository can now state, test, and preserve the exact next-runtime gates: future invalid-token route behavior may consume FP-0139 result envelopes only, while all token/OAuth/header/runtime work remains blocked until a later plan opens it.

## Progress

- [x] 2026-05-22T21:19:04Z - Created FP-0140 as the active planning/proof-gate compatibility slice after confirming PR #318 was merged, FP-0139 exists and is shipped, FP-0140 was absent before this slice, FP-0141 remains absent, and baseline proof gates passed before edits.
- [x] 2026-05-22T21:19:04Z - Scoped the slice to plan text, proof-gate helpers/specs, a direct proof command, and directly stale docs/plugin wording only.
- [x] 2026-05-22T21:19:04Z - Recorded that GitHub connector product behavior is out of scope; normal git and `gh` CLI publication are allowed by repository workflow.
- [x] 2026-05-22T21:52:37Z - Added FP-0140 proof-only helpers, the direct implementation-planning proof command, focused domain specs, prior-proof bridge compatibility, and directly stale active-doc/plugin wording refreshes.
- [x] 2026-05-22T21:52:37Z - QA found older FP-0123/FP-0122/FP-0107/FP-0106/FP-0105/FP-0103 proof gates that still treated the new FP-0140 plan/proof paths as out-of-scope because their filenames contain token/auth words. Patched only those proof-gate allowlists so FP-0140 docs/proof paths are accepted while route/runtime/OAuth/token/session checks remain true.
- [x] 2026-05-22T21:52:37Z - Final validation passed through the full proof ladder, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

## Surprises & Discoveries

FP-0139 supplied deterministic local proof-mode result envelopes but intentionally left every production runtime behavior absent. That makes FP-0140 a compatibility gate rather than a behavior gate: it must prove the route remains unchanged while planning a future mapping from result-envelope failures to HTTP posture.

The official MCP Authorization material requires MCP servers that support HTTP authorization to use protected resource metadata, resource indicators, audience/resource validation, and authorization error status posture. It also points to resource metadata in future `WWW-Authenticate` handling. FP-0140 treats those requirements as planning context only; no runtime header is emitted in this slice.

RFC 6750 supplies the planning vocabulary for future `invalid_request`, `invalid_token`, and `insufficient_scope` challenge semantics. RFC 8707 supplies the resource-indicator/audience context. RFC 9728 supplies protected resource metadata and future `WWW-Authenticate` resource metadata context. OpenAI Apps SDK Authentication docs supply ChatGPT App authentication context only. None of these sources is used to introduce runtime behavior or examples.

Same-branch QA surfaced stale historical proof allowlists that were intentionally conservative around token/auth filenames. The correction was proof-gate compatibility only: accept the exact FP-0140 plan/proof paths and the already-allowed proof helper/spec files, while keeping `/mcp`, protected-resource metadata, missing-token, WWW-Authenticate runtime, token parsing, JWT decoding, token validation runtime, introspection, OAuth, token/session storage, auth middleware, DB/schema/package, provider, OpenAI API/model, source mutation, finance write, and public submission checks green.

## Decision Log

- Decision: Invalid-token challenge runtime implementation can start next only as a narrow future FP-0141 after FP-0140 merges and the FP-0140 proof bridge remains green.
- Decision: Future invalid-token route behavior must consume FP-0139 result envelopes only. It must not consume FP-0134 synthetic evaluator output from routes; FP-0134 synthetic evaluator output remains proof/test-only.
- Decision: Missing-token behavior remains separate and unchanged.
- Decision: Protected-resource metadata route behavior remains separate and unchanged.
- Decision: `/mcp` route behavior remains unchanged.
- Decision: Production token validation remains blocked. There is no token parser, no JWT decoder, no token validation runtime, no token introspection, no OAuth, no token/session storage, and no auth middleware in FP-0140.
- Decision: Result-envelope failure modes may map to future HTTP posture only: `malformed_authorization` may map to future 400, `invalid_token`, `expired_token`, and `revoked_token` may map to future 401, and `insufficient_scope` may map to future 403 with scope challenge behavior.
- Decision: Symbolic `wwwAuthenticateError` values may map to future WWW-Authenticate error values without emitting headers now. This mapping is symbolic only; the set remains `none`, `invalid_request`, `invalid_token`, `insufficient_scope`, and `fail_closed_non_leaking`.
- Decision: `wrong_audience`, `wrong_resource`, `wrong_org`, and `company_binding_mismatch` remain fail-closed and non-leaking; route output must not disclose binding details.
- Decision: The future route test ladder must prove no-token-echo, no real token examples, no JWT-like examples, no Bearer token material, no route consumption of FP-0134, no `/mcp` route expansion, no protected-resource metadata route behavior change, no missing-token behavior change, no DB/schema/package drift, no provider calls, no OpenAI API/model calls, and no finance/source writes before FP-0141 may open.
- Decision: Public ChatGPT App submission should wait.

## Context and Orientation

FP-0139 shipped local proof-mode token-validation result envelopes. FP-0139 accepts sanitized descriptors and emits deterministic result envelopes. It did not implement production token validation runtime, a token parser, a JWT decoder, token introspection, OAuth, token/session storage, auth middleware, route behavior, or WWW-Authenticate headers.

FP-0138 remains shipped token-validation runtime implementation planning. FP-0137 remains shipped invalid-token challenge implementation readiness planning and kept invalid-token challenge behavior blocked until validation result envelopes existed or a later plan proved a narrower safe path. FP-0136 remains shipped invalid-token challenge contract foundation. FP-0135 remains shipped sequencing. FP-0134 remains a proof-only synthetic token-validation evaluator and is not consumed by routes.

The active code boundary remains evidence-native and local/proof-first. Raw sources are immutable. This plan has no finance write, source mutation, generated finance advice, uncited model output, or autonomous action. Replay implications are limited to proof output and plan/docs state because no mission state, ingest action, report action, route behavior, or finance artifact changes.

Official research used for planning context:

- MCP Authorization specification, 2025-06-18: invalid/expired token status posture, insufficient-scope posture, protected-resource metadata, resource indicators, audience/resource validation, and token passthrough prohibition.
- MCP Security Best Practices: token passthrough prohibition, confused deputy risk, audience/resource validation posture, and scope minimization context.
- RFC 6750: future Bearer challenge error taxonomy and status posture for `invalid_request`, `invalid_token`, and `insufficient_scope`.
- RFC 8707: resource indicators and audience/resource binding context.
- RFC 9728: protected resource metadata and future WWW-Authenticate resource metadata context.
- OpenAI Apps SDK Authentication: ChatGPT App authentication planning context only.

## Plan of Work

Create the FP-0140 planning file, add a pure domain proof-gate helper for FP-0140/FP-0141 boundaries, add focused specs, add a direct `tools/read-only-mcp-invalid-token-challenge-implementation-planning-proof.mjs` command, and update the minimum prior proof gates so FP-0139-era checks accept exactly one FP-0140 docs-only invalid-token challenge implementation planning file while FP-0141 remains absent.

Refresh only directly stale active docs/plugin wording that still says FP-0140 is absent. Do not create FP-0141. Do not modify routes, metadata route behavior, missing-token behavior, DB, schema, packages, deployment config, source packs, providers, OpenAI API/model integration, or public submission material.

## Concrete Steps

1. Keep the active branch as `codex/v2bh-read-only-chatgpt-app-mcp-invalid-token-challenge-implementation-planning-local-v1`.
2. Add `packages/domain/src/read-only-app-mcp-invalid-token-challenge-implementation-planning.ts` with proof-only schema/builders and FP-0140/FP-0141 boundary helpers.
3. Bridge FP-0139, FP-0138, FP-0137, FP-0136, FP-0135, FP-0134, FP-0133, FP-0132, FP-0131, FP-0130, FP-0128, FP-0127, FP-0125, FP-0107, FP-0106, and FP-0100 proof gates so they preserve their boundaries while allowing exactly one FP-0140 docs-only plan.
4. Add focused domain specs proving FP-0140 is docs-and-plan plus proof-gate compatibility only and that FP-0141 remains absent.
5. Add `tools/read-only-mcp-invalid-token-challenge-implementation-planning-proof.mjs` with machine-readable JSON proof output.
6. Refresh directly stale active docs/plugins wording if needed.
7. Run focused validation and strict same-branch QA. Patch this same branch if QA finds a defect.
8. Run final validation, update this plan closeout, rerun final validation if the closeout edit changes docs, then commit exactly once.

## Validation and Acceptance

Acceptance requires all of these to be true:

- FP-0140 exists exactly once at `plans/FP-0140-read-only-chatgpt-app-mcp-invalid-token-challenge-implementation-planning.md`.
- FP-0141 remains absent.
- FP-0140 is docs-and-plan plus proof-gate compatibility only.
- FP-0140 does not implement invalid-token challenge behavior and does not emit WWW-Authenticate headers.
- FP-0140 does not change `/mcp` route behavior, protected-resource metadata route behavior, or missing-token behavior.
- FP-0140 does not add token parser, JWT decoder, token validation runtime, token introspection, OAuth, token/session storage, auth middleware, DB queries, schema migrations, package scripts, provider calls, OpenAI API/model calls, source mutation, finance writes, public assets, listing copy, generated public prose, or autonomous action.
- FP-0140 preserves no real token examples, no JWT-like examples, no Bearer token material, and no-token-echo proof posture.
- FP-0140 names FP-0139 result envelopes as the future dependency only.
- FP-0140 keeps FP-0134 synthetic evaluator output proof/test-only and rejects route consumption.

Required validation commands:

```bash
git diff --check
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

## Idempotence and Recovery

If validation fails because a prior proof gate still requires FP-0140 absence, patch only the proof-gate bridge to accept the exact FP-0140 path and to keep FP-0141 absent. If validation fails because a route or runtime file changed, revert the FP-0140 change in that file and keep this slice planning-only. If validation fails because a stale doc mentions FP-0140 absence, update only directly stale wording and rerun the required validation.

Do not recover by implementing runtime behavior, adding a token parser, adding JWT decoding, adding introspection, adding OAuth/session/auth middleware, adding a route, adding headers, mutating sources, writing finance state, or creating FP-0141.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0140-read-only-chatgpt-app-mcp-invalid-token-challenge-implementation-planning.md`
- `packages/domain/src/read-only-app-mcp-invalid-token-challenge-implementation-planning.ts`
- Focused specs under the existing read-only MCP domain spec files.
- `tools/read-only-mcp-invalid-token-challenge-implementation-planning-proof.mjs`
- Directly stale active-doc/plugin wording updates if needed.

No screenshots, generated assets, public submission material, uploads, source documents, provider calls, OpenAI API/model calls, or deployment artifacts are part of this plan.

## Interfaces and Dependencies

Future FP-0141 may open only after FP-0140 is merged, the FP-0140 direct proof remains green, the bridge proofs remain green, and route tests exist for invalid-token behavior without changing missing-token or metadata route behavior.

Future route input dependency is FP-0139 result envelopes only. FP-0134 synthetic evaluator output remains proof/test-only and must not be consumed by routes. The future result-envelope-to-route mapping must keep `malformed_authorization`, `invalid_token`, `expired_token`, `revoked_token`, `insufficient_scope`, `wrong_audience`, `wrong_resource`, `wrong_org`, and `company_binding_mismatch` in a closed taxonomy with no token echo.

There are no new environment variables. There is no WORKFLOW.md change. There is no stack-pack change. There is no repo-local plugin runtime change beyond directly stale `plugins.md` wording if needed. F6 monitoring semantics are unaffected because no monitoring stored-state input, alert semantics, source lineage, delivery, or proof-bundle semantics change in this slice.

## Outcomes & Retrospective

Outcome: FP-0140 concludes that invalid-token challenge runtime implementation may start next only as a narrow FP-0141 after this docs/proof-gate slice merges and the gates remain green. No one-slice FP-0140 correction is currently required because FP-0139 result envelopes, FP-0138 runtime-planning, FP-0137 readiness, FP-0136 contracts, FP-0135 sequencing, FP-0134 evaluator, FP-0133 test-double contracts, FP-0132 runtime contracts, FP-0131 sequencing, FP-0130 missing-token challenge, FP-0128 readiness, FP-0127 auth-challenge contracts, FP-0125 metadata route, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 public-security boundaries were proven.

Public ChatGPT App submission should wait until a later plan implements and proves runtime auth behavior, protected resource metadata, token validation, no-token-echo, review posture, and deployment/submission gates.

No runtime behavior was implemented. FP-0141 remains absent. Remaining work is a future narrow invalid-token challenge runtime implementation plan that consumes FP-0139 result envelopes only and keeps missing-token and protected-resource metadata route behavior separate.
