# FP-0154 - Prove Read-only ChatGPT App/MCP Authorization Parser Local Adapter Readiness

## Purpose / Big Picture

FP-0154 is the V2BV read-only ChatGPT App/MCP Authorization parser local route-decision adapter construction-readiness slice after the merged FP-0153 app-construction pass-through and parser-dependency co-registration hardening slice.

This is adapter construction-readiness and proof planning only. It defines the future local adapter boundary that may later connect the existing pure-domain Authorization parser/classifier to the existing route-safe parser decision dependency shape. It does not implement the local adapter, does not export an adapter factory, does not construct an adapter in app construction, does not construct an adapter in routes, does not wire an adapter by default, and does not change `buildApp()` or `/mcp` behavior.

Target phase: V2BV read-only ChatGPT App/MCP Authorization parser local adapter construction-readiness.

## Progress

- [x] 2026-05-24T21:53:30Z - Preflight confirmed work on `codex/v2bv-read-only-chatgpt-app-mcp-authorization-parser-local-adapter-construction-readiness-local-v1`, clean worktree, authenticated `gh`, PR #332 merged to `main`, current `HEAD` and `origin/main` at `637905efa76e032827a2e7fa6185f2c3f84de169`, local Postgres/object storage services available, FP-0153 present, FP-0154 absent before this plan, FP-0155 absent, and required proof tools present.
- [x] 2026-05-24T21:53:30Z - Baseline proof gates for FP-0153, FP-0152, FP-0151, FP-0150, FP-0149, FP-0148, FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100 passed before FP-0154 edits.
- [x] 2026-05-24T21:53:30Z - Official MCP Authorization, MCP Security Best Practices, RFC 6750, RFC 8707, RFC 9728, OpenAI Apps SDK, OpenAI Developer Mode/MCP, and OpenAI MCP docs were used read-only as adapter construction-readiness context. OpenAI Developers tooling exposed only API-key setup surfaces, so no OpenAI API-key setup, OpenAI API/model call, provider call, deployment action, public asset, app-submission action, or external communication was used.
- [x] 2026-05-24T21:53:30Z - Patched stale FP-0153 closeout wording to record PR #332 merge facts, green GitHub `static` and `integration-db` checks, same-branch QA freshness, and no post-merge QA requirement while current `main` matches the validated merge posture.
- [x] 2026-05-24T22:24:42Z - Added the readiness-only domain helper, focused spec, and export without adding an adapter implementation or factory export.
- [x] 2026-05-24T22:24:42Z - Added the direct FP-0154 proof command and exact FP-0154/FP-0155 proof bridge across the FP-0153 app-construction and FP-0152 route-integration proof lanes.
- [x] 2026-05-24T22:24:42Z - Refreshed directly stale active docs and `plugins.md` entries so FP-0154 is no longer presented as absent/future-only; no separate polish branch or post-merge QA branch was created.
- [x] 2026-05-24T22:27:37Z - Focused proof ladder, focused domain/control-plane Vitest suites, `pnpm lint`, `pnpm typecheck`, and `pnpm test` passed.
- [x] 2026-05-24T22:27:37Z - First `pnpm ci:repro:current` attempt failed on a transient DB-backed orchestrator spec timeout after local `pnpm test` had passed; same-branch rerun passed cleanly with the timed-out spec completing in 3057ms and full CI reproduction succeeding.
- [x] 2026-05-24T22:27:37Z - Closeout recorded no adapter implementation, no factory export, no app/route/default construction, no route behavior change, no token validation/provider/OAuth/session/auth middleware, no DB/schema/package/source/finance/public-app/submission scope, and no FP-0155.
- [x] 2026-05-24T22:43:13Z - Same-branch QA corrected residual FP-0153 narrative/acceptance wording that still implied FP-0154 should remain absent after the FP-0154 successor exists. The correction is documentation freshness only and does not widen adapter/runtime/provider/auth scope.

## Surprises & Discoveries

FP-0153 made app construction capable of passing an explicitly supplied route-safe parser route-decision dependency, while default containers still leave the dependency absent. That means the missing piece is not more route or app wiring. The missing piece is a proofable future adapter construction contract: what input a local adapter may receive, what output it may emit, which helper calls it may compose, and which token-retention, token-derived observability, provider, OAuth, session, DB, network, crypto, time, random, env, and logging behaviors remain blocked.

OpenAI Developers tooling was not used for API-key setup. Official public docs were used only for read-only protocol and security context. The active code remains the source of implementation truth, and finance evidence remains the source of finance truth.

## Decision Log

- 2026-05-24T21:53:30Z - Local parser route-decision adapter construction-readiness is included in FP-0154.
- 2026-05-24T21:53:30Z - Local adapter implementation is not included.
- 2026-05-24T21:53:30Z - Default adapter construction is not included.
- 2026-05-24T21:53:30Z - App construction may not construct the adapter after FP-0154. A future FP-0155 may implement a local adapter factory only if FP-0154 proof remains green and FP-0155 explicitly authorizes that narrow implementation.
- 2026-05-24T21:53:30Z - Route code may not construct the adapter after FP-0154.
- 2026-05-24T21:53:30Z - Default `buildApp()` behavior does not change after FP-0154.
- 2026-05-24T21:53:30Z - Production token-validation runtime cannot start after FP-0154.
- 2026-05-24T21:53:30Z - Provider selection cannot start after FP-0154; provider mode remains provider-neutral/deferred unless a separate complete provider-evidence plan exists.
- 2026-05-24T21:53:30Z - OAuth/session/auth middleware cannot start after FP-0154.
- 2026-05-24T21:53:30Z - Public ChatGPT App demo/submission cannot start after FP-0154.
- 2026-05-24T21:53:30Z - Future adapter input boundary: adapter may receive only `{ authorizationHeader?: string | readonly string[] | null }`; adapter may pass this input into the existing pure parser/classifier only inside the local adapter stack; adapter must not retain, store, log, echo, normalize, hash, digest, fingerprint, or forward the raw header or token material.
- 2026-05-24T21:53:30Z - Future adapter output boundary: output must be exactly `ReadOnlyMcpAuthorizationParserRouteDecisionReadiness`; output may include only route-safe decision fields from FP-0151/FP-0153; output must never include raw header/token material, token-derived prefix/suffix/length/hash/digest/claims/decoded header/decoded payload/fingerprint, or parser internals.
- 2026-05-24T21:53:30Z - Future adapter composition: adapter may call the existing pure parser/classifier and the existing route-decision readiness derivation helper; adapter may not call routes, app construction, DB/provider/OpenAI/network/time/random/crypto/env/logger APIs.
- 2026-05-24T21:53:30Z - Future adapter failure mapping: missing authorization maps to FP-0130 missing-token lane; malformed authorization maps to FP-0139 `malformed_authorization`; unsupported scheme maps to `unsupported_validation_mode`; bearer without material maps to `malformed_authorization`; unsafe whitespace/control maps to `malformed_authorization`; token material passthrough attempt maps to `invalid_token`; credential-observed/bearer-present remains invalid-token challenge lane only until production validation exists.
- 2026-05-24T21:53:30Z - Future adapter test matrix uses safe sentinels only: absent header, empty header, unsupported scheme safe sentinel, malformed scheme safe sentinel, structural multiple values, safe Bearer-scheme credential-present sentinel, unsafe whitespace/control safe sentinel, and passthrough-attempt sentinel. No realistic token examples, JWT-like examples, or Bearer token material are allowed.
- 2026-05-24T21:53:30Z - Future FP-0155 may open only local adapter implementation/factory that remains explicit-only, adapter-readiness correction, or proof-gate correction. It must not implement default app construction, production token validation, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, or app submission.
- 2026-05-24T21:53:30Z - Preserve FP-0153 app-construction wiring, FP-0152 route integration, FP-0151 route readiness, FP-0150 route sequencing, FP-0149 parser implementation, FP-0148 readiness, FP-0147 provider-selection evidence, FP-0146 parser contracts, FP-0145 runtime contracts, FP-0144 production token-validation sequencing, FP-0143 app wiring, FP-0142 route sequencing, FP-0141 invalid-token local runtime, FP-0139 result envelopes, FP-0130 missing-token challenge, FP-0125 protected-resource metadata route, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 security boundary.

## Context and Orientation

The repo already has a pure-domain Authorization parser/classifier in `packages/domain`, a route-safe parser decision readiness contract, `/mcp` route integration that can consume an explicitly injected route-safe parser decision dependency, and app construction that can pass an explicitly supplied dependency through.

FP-0154 fills the gap between those pieces without joining them at runtime. It records a safe construction-readiness contract for a future local adapter that may later compose the pure parser/classifier with the route-safe decision derivation helper. The adapter is future-only because the current branch must not add default construction, route construction, provider selection, token validation, OAuth/session/auth middleware, or public ChatGPT App behavior.

Replay and evidence posture: FP-0154 changes planning docs, readiness contracts, tests, and proof outputs only. It does not change mission state, ingest state, source registry state, CFO Wiki facts, finance answers, approvals, monitor findings, reports, or durable finance artifacts. No replay event is required because no mission-facing state transition or finance artifact mutation occurs. Proof output is the durable acceptance evidence for this technical slice.

Provenance, freshness, and limitations: official protocol/security docs are context only. Finance evidence remains the source of truth for product answers. FP-0154 produces no finance answer, no report, no public listing copy, no generated advice, no external communication, and no source mutation.

## Plan of Work

The implementation will create a readiness-only domain helper in `packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter-readiness.ts`. The helper will export schema/version constants, future adapter input/output/composition/failure-mapping/test-matrix constants, a proof builder, a boundary verifier, and an FP-0153 closeout freshness verifier. It will not export a constructed adapter factory.

The proof command will accept exactly one FP-0154 plan at `plans/FP-0154-read-only-chatgpt-app-mcp-authorization-parser-local-adapter-construction-readiness.md`, require FP-0155 absence, prove the local adapter boundary is readiness/proof-only, prove no adapter implementation/factory/default construction was added, prove app and route behavior remain unchanged, prove parser decision no-retention fields remain route-safe, prove fixtures remain token-clean through the shared sanitizer, prove stale FP-0153 closeout freshness is corrected, and prove prior FP-0153 through FP-0100 boundaries remain intact.

Direct active docs and `plugins.md` will be updated only where directly stale after FP-0154 exists. Historical shipped plan records stay historical except for the explicit FP-0153 closeout freshness patch.

## Concrete Steps

1. Patch stale FP-0153 closeout freshness with PR #332 merge facts and GitHub check state.
2. Create this exact FP-0154 plan before readiness helper changes.
3. Add `packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter-readiness.ts` with readiness-only constants, proof builder, boundary verifier, and FP-0153 freshness verifier.
4. Add `packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter-readiness.spec.ts` with focused tests for exact FP-0154 acceptance, FP-0155 absence, readiness-only posture, no adapter implementation/factory export, app/route/default behavior preservation, input/output/composition/failure/test-matrix recording, no raw/token-derived fields, no production token validation/provider/OAuth/auth widening, shared sanitizer strictness, and prior FP boundary preservation.
5. Export the readiness helper from `packages/domain/src/index.ts` only because the proof command consumes domain helpers.
6. Add `tools/read-only-mcp-authorization-parser-local-adapter-construction-readiness-proof.mjs`.
7. Update the FP-0153 app-construction proof bridge only for exact FP-0154 successor compatibility.
8. Refresh directly stale README, CODEX_README, START_HERE, docs/ACTIVE_DOCS.md, docs/PROJECT_STATE.md, docs/V2_BOUNDARY.md, plans/ROADMAP.md, and `plugins.md` entries only if they still present FP-0154 as absent/future-only after this slice.
9. Run focused validation, strict same-branch QA, final validation, closeout, commit, push, and open the PR.

## Validation and Acceptance

Required validation:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-authorization-parser-local-adapter-construction-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-app-construction-wiring-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-route-integration-implementation-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-route-integration-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-route-integration-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-pure-domain-implementation-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-implementation-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-provider-selection-evidence-hardening-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-contracts-provider-selection-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-runtime-contracts-proof-hardening-proof.mjs
pnpm exec tsx tools/read-only-mcp-production-token-validation-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-app-wiring-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-local-runtime-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-result-envelope-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs
pnpm exec tsx tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs
pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-local-route-proof.mjs
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts src/read-only-app-mcp-authorization-parser-contracts.spec.ts src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts src/read-only-app-mcp-authorization-parser.spec.ts src/read-only-app-mcp-authorization-parser-route-integration-readiness.spec.ts src/read-only-app-mcp-authorization-parser-local-adapter-readiness.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/app.spec.ts src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is observable when exactly one FP-0154 file exists, FP-0155 remains absent, the new readiness helper proves future adapter input/output/composition/failure-mapping/test-matrix requirements, no adapter implementation or adapter factory is exported, app construction and route code do not construct an adapter, default `buildApp()` and `/mcp` behavior remain unchanged, route-safe parser decisions still carry no raw header/token material or token-derived fields, fixtures contain no real token examples or JWT-like examples, the shared proof-only leakage sanitizer remains strict, FP-0153 closeout freshness is corrected, and predecessor FP proof gates remain green.

## Idempotence and Recovery

This slice is additive and readiness-only. Re-running the proof command should be deterministic. If validation finds a defect, patch this same branch and rerun required checks. If a proof bridge still treats FP-0154 as absent-only, patch only the exact successor bridge and rerun the proof ladder. If any failure requires adapter implementation, default construction, route behavior change, production token validation, token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, app submission, source mutation, or finance writes, stop and narrow scope instead of implementing that behavior.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0154-read-only-chatgpt-app-mcp-authorization-parser-local-adapter-construction-readiness.md`
- FP-0153 closeout freshness patch
- `packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter-readiness.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser-local-adapter-readiness.spec.ts`
- `tools/read-only-mcp-authorization-parser-local-adapter-construction-readiness-proof.mjs`
- direct FP-0154 proof-gate bridge compatibility in the FP-0153 proof command
- directly stale active-doc/plugin freshness edits only if needed

No new route, migration, package script, fixture data file, public asset, screenshot, app-submission artifact, OpenAI API integration, provider integration, DB query, source mutation, finance write, or external communication is expected.

## Interfaces and Dependencies

Future adapter input boundary:

`{ authorizationHeader?: string | readonly string[] | null }`

Future adapter output boundary:

`ReadOnlyMcpAuthorizationParserRouteDecisionReadiness`

Permitted future composition:

The adapter may call `classifyReadOnlyMcpAuthorizationHeader`, `parseReadOnlyMcpAuthorizationHeader`, and `deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness` inside the local adapter stack only. The adapter may not call routes, app construction, DB, provider, OpenAI, network, time, random, crypto, env, or logger APIs.

GitHub connector product behavior is out of scope. Routine `git` and `gh` CLI operations are allowed for repository and PR truth. Codex Security, ChatGPT Apps, OpenAI Developers, Browser, and Vercel project/deployment tooling are not needed for runtime action in this slice; official web docs are read-only context only.

## Outcomes & Retrospective

FP-0154 shipped the local parser route-decision adapter construction-readiness contract and proof gate only. The future adapter boundary is now explicit: it may receive only the authorization-header wrapper input, may compose only the existing pure parser/classifier and route-decision readiness helper inside a local adapter stack, and must emit exactly the existing route-safe readiness output without raw credential material, token-derived observability, parser internals, or runtime side effects.

The slice did not implement a local adapter, did not export an adapter factory, did not construct an adapter in app construction or routes, did not add default wiring, and did not change `buildApp()` or `/mcp` behavior. Production token validation, provider selection/calls/integration, JWT/JWKS/introspection, OAuth/session/auth middleware, token/session storage, DB/schema/package work, public app behavior, app submission, source mutation, finance writes, external communications, OpenAI API/model calls, and generated public assets/prose remain blocked.

FP-0153 closeout freshness was corrected in this branch using GitHub PR #332 truth: PR #332 merged with head SHA `a43d0f9d1437d0370db2da108f1cc197868f64aa`, merge commit `637905efa76e032827a2e7fa6185f2c3f84de169`, and green `static` plus `integration-db` checks. Same-branch QA corrected only FP-0153 plan freshness; no separate polish or post-merge QA branch was created.

Validation passed after one transient `pnpm ci:repro:current` retry. The initial repro attempt timed out in `src/modules/orchestrator/drizzle-service.spec.ts` on the pending file-change approval resume test, while the local full `pnpm test` had already passed. The immediate repro rerun passed fully, including that same test in 3057ms, so the timeout is recorded as a transient validation observation rather than an FP-0154 code defect.

Replay/evidence posture remains unchanged: this slice changed docs, domain readiness contracts, focused specs, and proof commands only. No mission state, source snapshot, finance evidence, CFO Wiki fact, report, approval, monitor result, or durable finance artifact was mutated, so no replay event is required. Proof output and this plan closeout are the durable acceptance evidence.
