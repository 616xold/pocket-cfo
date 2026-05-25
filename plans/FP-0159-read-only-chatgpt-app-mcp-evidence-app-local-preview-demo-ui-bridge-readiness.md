# FP-0159 - Read-only ChatGPT App/MCP Evidence App Local Preview Demo UI Bridge Readiness

## Purpose / Big Picture

FP-0159 is the V2CA read-only ChatGPT App/MCP Evidence App local preview/demo UI bridge readiness slice after merged FP-0158.

This slice is readiness/proof only. Evidence-app local preview/demo UI bridge readiness is included. UI bridge implementation is not included, and this is not UI bridge implementation.

FP-0158 shipped a local-only Evidence App demo bridge with two separate lanes: an explicit-helper auth boundary lane and an explicit local synthetic/stub evidence tool lane. FP-0159 records the future local preview/demo UI bridge input, output, composition, and acceptance boundaries so a later local-only implementation can show those lanes without changing route behavior or pretending the auth helper validates evidence tool calls.

This is not a new app route. This is not a web API route. This is not backend route work. This is not Apps SDK iframe/resource implementation. This is not public ChatGPT App implementation, public app submission, public OAuth, production token validation, authorized evidence-tool execution, default auth adapter wiring, default evidence dispatch wiring, real finance data, public demo data, screenshot generation, public asset generation, listing copy, deployment config, DB query implementation, schema or migration work, package script work, OpenAI API/model integration, provider integration, provider calls, source mutation, finance write, external communication, or autonomous action.

Target phase: V2CA read-only ChatGPT App/MCP Evidence App local preview/demo UI bridge readiness, local-only, proof-only, and future-implementation-gating only.

## Progress

- [x] 2026-05-25T13:58:04Z - Preflight confirmed work on `codex/v2ca-read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-local-v1`, clean worktree, authenticated `gh`, PR #337 merged to `main`, current `HEAD` and `origin/main` at merge commit `28285cc43bc3090db5b2b640348990f6f911037c`, PR #337 head SHA `d945528cae1d39d871fc804895ef0e075c2a5794`, GitHub `static` and `integration-db` checks green, local Postgres/object storage services available, FP-0158 present, FP-0159 absent before this plan, FP-0160 absent, and required proof tools present.
- [x] 2026-05-25T13:58:04Z - Baseline proof gates for FP-0158, FP-0157, FP-0156, FP-0155, FP-0154, FP-0153, FP-0152, FP-0151, FP-0150, FP-0149, FP-0148, FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0109, FP-0108, FP-0086, FP-0085, FP-0082, FP-0081, and FP-0080 passed before FP-0159 edits. Optional FP-0108/FP-0109 evidence dispatch proof tools were present and passed.
- [x] 2026-05-25T13:58:04Z - Repo-local `pocket-cfo-codex-operator` skills were invoked for Finance Plan orchestration, modular architecture, source provenance, CFO Wiki/doc freshness, evidence bundles, F6 monitoring semantics, validation ladder composition, and handoff auditing. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-25T13:58:04Z - GitHub CLI was used as repository and PR state truth. OpenAI Developers exposed only API-key setup surfaces, not read-only docs. ChatGPT Apps and Codex Security exposed no separate callable read-only local validation/security tool for this slice. Official MCP/OpenAI web documentation was checked only as local preview/auth/evidence boundary context. No API-key setup, OpenAI API/model call, provider call, deployment action, public asset, app submission action, source mutation, finance write, or external communication was used.
- [x] 2026-05-25T13:58:04Z - FP-0158 closeout freshness was patched with PR #337 merge facts, green GitHub check state, same-branch QA no-issue posture, no-post-merge-QA posture, and direct source-anchor summary/proof polish wording.
- [x] 2026-05-25T14:33:18Z - Added the FP-0159 readiness helper, focused specs, direct proof command, exact FP-0159/FP-0160 successor bridge compatibility, and direct active-doc/plugin freshness edits without changing preview route, route runtime, default app construction, default auth adapter wiring, default evidence dispatch wiring, provider behavior, database behavior, package scripts, source evidence, or finance state.
- [x] 2026-05-25T14:33:18Z - Patched proof-gate compatibility where older successor and changed-file guards still treated FP-0159 as absent-only. The patches remain proof-only and preserve the existing runtime boundaries.
- [x] 2026-05-25T14:33:18Z - Final validation passed, including the FP-0159 readiness proof, FP-0158 bridge proof and harness, predecessor proof ladder, focused domain and control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. One full-suite `pnpm test` attempt hit the existing FP-0128 simulated route-source test timeout at 5107ms; rerunning `pnpm test` unchanged passed, so no correction was made.
- [x] 2026-05-25T14:45:52Z - Same-branch QA found and corrected a proof-only added-line scan defect in the FP-0159 readiness proof. The real-finance-data scanner now honors the caller's non-tool path filter instead of scanning every branch addition, so it no longer trips on its own sentinel strings while still scanning the intended non-tool plan/domain/doc additions.
- [x] 2026-05-25T18:38:52Z - PR #338 merged to `main` with head SHA `5e83ea4696a8beda416336cbc17c6660343374db` and merge commit `fc976b4379bae23d64a01e52ec324d1ea85ce762`. GitHub `static` and `integration-db` checks were green. FP-0160 same-branch freshness polish records that the only same-branch QA correction was a proof-only added-line scanner defect and that the correction changed only `tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs` and `plans/FP-0159-read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.md`. No standalone proof-correction branch, post-merge QA branch, or separate polish branch is required when current `main` matches the validated PR head/merge posture and CI remains green.

## Surprises & Discoveries

FP-0158 already verified every tool in `MCP_TOOL_ALLOWLIST`, including `fetch_source_anchor`, but the compact summary did not name that check directly. FP-0159 includes a narrow same-branch polish to add `fetchSourceAnchorVerified` and `sourceAnchorFetchVerified` without changing the exact allowlist, source data, route behavior, or evidence dispatch behavior.

The existing preview route at `apps/web/app/read-only-app-mcp-preview/page.tsx` and the read-only app/MCP UI components remain sufficient inspection targets for a future local preview/demo UI bridge. FP-0159 does not edit that route.

OpenAI Developers tooling in this local thread exposed API-key setup surfaces only, so it was not used. Official MCP authorization/security and OpenAI Apps SDK authentication, security/privacy, UI/resource, testing, and submission documentation was used only as read-only boundary context. No token-looking examples, public app copy, screenshots, generated assets, or app-submission material are copied into this repository.

Several older proof gates had exact successor or changed-file allowlists that still assumed FP-0159 must be absent. FP-0159 patched only those proof bridges to accept this exact readiness plan while keeping FP-0160 absent and leaving app, route, and dispatch behavior unchanged.

A single `pnpm test` run timed out in the pre-existing FP-0128 simulated committed helper route-source test, then passed unchanged on rerun. This was recorded as validation noise rather than a slice defect because no route source, token-validation runtime, or default wiring was changed.

Same-branch QA exposed that the FP-0159 proof's added-line scanner accepted a path filter but did not pass that filter through to tracked git diffs. The defect was proof-only and could not change app/runtime behavior, but it made the proof fail against its own sentinel strings after the branch was committed.

Post-merge freshness check in the FP-0160 branch confirmed PR #338 merged with head SHA `5e83ea4696a8beda416336cbc17c6660343374db`, merge commit `fc976b4379bae23d64a01e52ec324d1ea85ce762`, and green GitHub `static` plus `integration-db` checks. Because current `main` matches that validated posture and the same-branch QA correction was already included in PR #338, no standalone post-merge QA branch is required.

## Decision Log

- 2026-05-25T13:58:04Z - Evidence-app local preview/demo UI bridge readiness is included. The slice is readiness/proof only.
- 2026-05-25T13:58:04Z - UI bridge implementation is not included. This is not UI bridge implementation.
- 2026-05-25T13:58:04Z - Existing preview route changes are not included. Do not edit `apps/web/app/read-only-app-mcp-preview/page.tsx` in this slice.
- 2026-05-25T13:58:04Z - A new route or API route is not included. This is not a new app route. This is not a web API route.
- 2026-05-25T13:58:04Z - Default auth adapter construction is not included.
- 2026-05-25T13:58:04Z - Default evidence dispatch wiring is not included.
- 2026-05-25T13:58:04Z - Default `createContainer()`, `createInMemoryContainer()`, and `buildApp()` behavior do not change.
- 2026-05-25T13:58:04Z - Route behavior change is not included. Protected-resource metadata route behavior does not change.
- 2026-05-25T13:58:04Z - Production token-validation runtime cannot start after FP-0159. Production token validation is not included.
- 2026-05-25T13:58:04Z - Provider selection cannot start after FP-0159; provider remains provider-neutral/deferred unless a separate complete provider evidence slice opens it. Provider calls are not included.
- 2026-05-25T13:58:04Z - OAuth/session/auth middleware cannot start after FP-0159. OAuth/session/auth middleware is not included.
- 2026-05-25T13:58:04Z - Public ChatGPT App demo/submission cannot start after FP-0159. Public ChatGPT App implementation is not included.
- 2026-05-25T13:58:04Z - Future UI bridge input boundary: input may consume only a sanitized local demo summary and synthetic evidence snapshot. Input may include auth boundary status, evidence tool lane status, freshness posture, evidence cards, citations, source anchors, document map, source coverage, company posture, capability boundaries, default behavior posture, and limitation/refusal states. It must not include raw Authorization values, parser decision objects, raw source dumps, private fields, real finance data, token material, token-derived fields, provider data, model output, or write-action outputs.
- 2026-05-25T13:58:04Z - Future UI bridge output boundary: output may render only existing read-only app/MCP component props or a static synthetic preview matrix. It must preserve noindex/noarchive/local-only/no-runtime posture. If those statuses are shown, output must display `productionTokenValidationImplemented: false` and `publicChatGptAppImplemented: false`. It must not add forms, buttons, file inputs, mutation controls, provider controls, public app assets, listing copy, or submission material.
- 2026-05-25T13:58:04Z - Future implementation sequence: future FP-0160 may implement a local preview/demo UI bridge on the existing preview route or proof-only component story; it must remain synthetic/local-only and must not fetch from `/mcp`; it must not run the harness at request time; it must use static/in-memory contract-shaped snapshots; and it must keep auth boundary lane and evidence tool lane visually separate.
- 2026-05-25T13:58:04Z - Future UI bridge must keep auth boundary lane and evidence tool lane visually separate without claiming auth validates evidence tool calls.
- 2026-05-25T13:58:04Z - Future FP-0160 may open only local preview/demo UI bridge implementation on existing local preview route/components, FP-0159 readiness correction, or proof-gate correction. It must not implement public app behavior, production auth, OAuth/session/auth middleware, provider calls, DB/schema/package work, real demo data, public assets, screenshots, app submission, or external deployment.
- 2026-05-25T13:58:04Z - Source mutation is not included. Finance write is not included. External communication is not included. Public assets are not included. Generated public prose is not included. App submission is not included. OpenAI API/model call is not included. OpenAI API/model integration is not included.
- 2026-05-25T13:58:04Z - Preserve FP-0158 local evidence demo bridge, FP-0157 local auth demo harness, FP-0156 app-construction injection, FP-0155 local adapter implementation, FP-0154 local adapter readiness, FP-0153 app-construction wiring, FP-0152 route integration, FP-0151 route readiness, FP-0150 route sequencing, FP-0149 parser implementation, FP-0148 readiness, FP-0147 provider-selection evidence, FP-0146 parser contracts, FP-0145 runtime contracts, FP-0144 production token-validation sequencing, FP-0143 app wiring, FP-0142 route sequencing, FP-0141 invalid-token local runtime, FP-0139 result envelopes, FP-0130 missing-token challenge, FP-0125 protected-resource metadata route, FP-0109 evidence dispatch adapter, FP-0108 evidence dispatch contracts, FP-0097 preview visual QA, FP-0096 preview state matrix, FP-0094 preview route, FP-0086 benchmark/community contracts, FP-0085 bounded orchestration, FP-0082 evidence app alpha, FP-0081 document precision, FP-0080 evidence index, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 public security boundary.
- 2026-05-25T14:33:18Z - Exact FP-0159 successor bridge compatibility is proof-only. It allows this readiness plan and new proof command while continuing to block FP-0160 and unrelated route/runtime/provider/auth/schema/package/public-app changes.
- 2026-05-25T14:45:52Z - Same-branch QA correction remains proof-gate only. It changes no preview route, UI bridge runtime, route behavior, default app construction, auth adapter wiring, evidence dispatch wiring, provider/auth/token runtime, source data, finance state, DB/schema/package surface, public assets, or app-submission material.
- 2026-05-25T18:38:52Z - FP-0159 post-merge freshness correction is folded into the FP-0160 branch. It records PR #338 merge truth and the already-shipped same-branch QA correction without creating a standalone proof-correction branch or post-merge QA branch.

## Context and Orientation

FP-0158 shipped a local-only proof bridge. The auth boundary lane verifies missing-token challenge, sanitized invalid-token challenge, protected-resource metadata, and no parser/credential exposure. The evidence tool lane verifies exact V2G read-only tool allowlist behavior over explicit local evidence dispatch and a synthetic/stub evidence service.

FP-0159 does not connect those lanes. It records how a future local preview/demo UI bridge may display them side-by-side using static, synthetic, in-memory, contract-shaped snapshots. The future UI bridge must not fetch from `/mcp`, run the harness during request rendering, consume live route state, or infer production auth posture from the local demo.

Replay and evidence posture: FP-0159 changes planning docs, proof-only domain contracts, proof tooling, and direct doc freshness only. It does not change mission state, ingest state, source registry state, CFO Wiki facts, finance answers, approvals, monitor findings, reports, durable finance artifacts, source evidence, or UI runtime behavior. No replay event is required because no mission-facing state transition or finance artifact mutation occurs. The proof output is the durable acceptance evidence for this technical readiness slice.

Provenance, freshness, and limitations: GitHub CLI is used for PR #337 merge truth and check freshness. Official protocol and Apps SDK docs are context only. Finance evidence remains the source of truth for product answers. FP-0159 uses no real finance data, no public demo data, no source pack, no provider calls, no model calls, no generated advice, no screenshots, and no source mutation.

## Plan of Work

Patch stale FP-0158 closeout freshness if present, including PR #337 merge facts, head SHA, merge commit, green GitHub check state, same-branch QA no-issue posture, and no-post-merge-QA posture.

Add narrow FP-0158 source-anchor proof polish if absent: `fetchSourceAnchorVerified` in the compact sanitized harness summary and `sourceAnchorFetchVerified` in the proof output. This must not add real source data, source body text, route behavior, or evidence dispatch behavior.

Create a proof-only/readiness domain helper under `packages/domain/src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.ts`. The helper records the future UI bridge input boundary, output boundary, forbidden fields, implementation sequence, and acceptance checklist. It must not render UI, import React, import Next.js, import app routes, call harnesses, call network, call DB, call OpenAI/model APIs, call providers, read files at runtime, or mutate state.

Add a direct proof command at `tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs`. The proof accepts exactly one FP-0159 readiness plan, keeps FP-0160 absent, verifies the future UI bridge boundaries, verifies FP-0158 closeout freshness and source-anchor polish, verifies no preview route or runtime route changes from FP-0159, and preserves prior FP proof boundaries.

Refresh only directly stale active docs and `plugins.md` entries that still treat FP-0158 as active/current implementation scope or FP-0159 as forbidden/future-only after this readiness slice.

## Concrete Steps

1. Confirm preflight and baseline proof gates are green before edits.
2. Patch FP-0158 closeout freshness if stale.
3. Patch FP-0158 source-anchor direct summary/proof fields if absent.
4. Create this exact FP-0159 readiness plan.
5. Add exact FP-0159/FP-0160 bridge helpers in domain contracts and focused specs.
6. Add the FP-0159 readiness helper and focused domain specs.
7. Add `tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs`.
8. Update existing FP-0158/FP-0157/FP-0156 proof bridges so exact FP-0159 readiness is accepted and FP-0160 remains absent.
9. Refresh directly stale README, CODEX_README, START_HERE, docs/ACTIVE_DOCS.md, docs/PROJECT_STATE.md, docs/V2_BOUNDARY.md, plans/ROADMAP.md, and `plugins.md` entries only if directly stale.
10. Run focused validation, strict same-branch QA, final validation, closeout, commit, push, and open the PR.

## Validation and Acceptance

Required validation:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-evidence-app-local-demo-bridge-proof.mjs
pnpm exec tsx tools/read-only-mcp-evidence-app-local-demo-bridge.mjs
pnpm exec tsx tools/read-only-mcp-auth-local-demo-harness-proof.mjs
pnpm exec tsx tools/read-only-mcp-auth-local-demo-harness.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-local-adapter-app-construction-injection-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-local-adapter-implementation-proof.mjs
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
pnpm exec tsx tools/read-only-mcp-evidence-tool-dispatch-proof.mjs || true
pnpm exec tsx tools/read-only-mcp-default-local-evidence-dispatch-proof.mjs || true
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
find apps/web -name '*.spec.*' -o -name '*.test.*'
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts src/read-only-app-mcp-authorization-parser-contracts.spec.ts src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts src/read-only-app-mcp-authorization-parser.spec.ts src/read-only-app-mcp-authorization-parser-route-integration-readiness.spec.ts src/read-only-app-mcp-authorization-parser-local-adapter-readiness.spec.ts src/read-only-app-mcp-authorization-parser-local-adapter.spec.ts src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/app.spec.ts src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is observable when exactly one FP-0159 plan exists at `plans/FP-0159-read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.md`, FP-0160 remains absent, FP-0159 is readiness/proof only, no UI bridge runtime is implemented, the existing preview route is unchanged, no new route or API route is added, future input/output/composition boundaries are recorded, auth boundary lane and evidence tool lane remain separate, credential/parser/source leakage is forbidden, real finance data and public demo data are forbidden, screenshots/public assets/listing copy/app submission are forbidden, FP-0158 closeout freshness is corrected, FP-0158 source-anchor summary/proof fields exist, default app and route behavior remain unchanged, no production token validation or provider/OAuth/auth runtime is added, no OpenAI API/model calls are added, no source mutation or finance write is added, and predecessor FP proof gates remain green.

## Idempotence and Recovery

This slice is additive and proof-only. The readiness helper is pure domain code. The proof command is deterministic and reads repository files only as proof input. Re-running it should leave no persistent state.

If validation finds a defect, patch this same branch and rerun the required checks. If a proof bridge still treats FP-0159 as absent-only, patch only the exact successor bridge and rerun the proof ladder. If any failure requires UI bridge implementation, preview route changes, a new route, API route, backend route behavior, default auth adapter construction, default evidence dispatch wiring, route behavior change, production token validation, token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, app submission, source mutation, or finance writes, stop and narrow scope instead of implementing that behavior.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0159-read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.md`
- FP-0158 closeout freshness patch if stale
- FP-0158 direct source-anchor summary/proof polish if absent
- `packages/domain/src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.ts`
- `packages/domain/src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.spec.ts`
- `tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs`
- exact FP-0159/FP-0160 proof-gate bridge compatibility
- directly stale active-doc/plugin freshness edits only if needed

No preview route edit, new route, API route, backend route behavior, migration, package script, fixture data file, public asset, screenshot, app-submission artifact, OpenAI API integration, provider integration, DB query, source mutation, finance write, or external communication is expected.

## Interfaces and Dependencies

Readiness helper API:

`MCP_EVIDENCE_APP_LOCAL_PREVIEW_DEMO_UI_BRIDGE_READINESS_SCHEMA_VERSION`

`buildReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessProof(input?)`

`verifyReadOnlyMcpEvidenceAppLocalPreviewDemoUiBridgeReadinessBoundary(input?)`

`verifyFp0158CloseoutFreshnessForFp0159(planText)`

Proof command:

`pnpm exec tsx tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs`

GitHub connector product behavior is out of scope. Routine `git` and `gh` CLI operations are allowed for repository and PR truth. Codex Security, Vercel project/deployment tooling, OpenAI Platform key setup, OpenAI API/model calls, provider calls, public assets, screenshots, and app submission tooling are not used in this slice.

## Outcomes & Retrospective

FP-0159 is complete as a readiness/proof-only slice: the plan, readiness helper, proof command, FP-0158 closeout/source-anchor polish, direct active-doc/plugin refresh, successor proof bridge compatibility, and strict same-branch validation passed without implementing a UI bridge runtime or changing app/route/default wiring behavior.

Replay and evidence implications remain unchanged from the plan: no mission-facing state transition, finance artifact mutation, source mutation, ingest action, approval, report, or monitor output changed, so no replay event is required. The proof output is the durable acceptance evidence for this technical readiness slice.

Next recommendation after green final validation: local preview/demo UI bridge implementation may start next only under a separate FP-0160 local-only plan on the existing local preview route/components or a proof-only component story. FP-0159 readiness correction, local evidence demo correction, local auth demo correction, app-construction injection correction, provider-selection evidence correction, and narrow proof-gate correction are not needed from this slice. Post-merge QA is not required if the merge matches this validated branch posture and GitHub checks remain green. Public ChatGPT App submission, production token validation, OAuth/session/auth middleware, provider calls, real demo data, public assets, screenshots, listing copy, app submission, external deployment, source mutation, finance writes, external communications, and autonomous action should continue to wait.

Post-merge freshness was corrected in the FP-0160 branch using GitHub PR #338 truth: PR #338 merged with head SHA `5e83ea4696a8beda416336cbc17c6660343374db`, merge commit `fc976b4379bae23d64a01e52ec324d1ea85ce762`, and green `static` plus `integration-db` checks. Same-branch QA found one proof-only added-line scanner defect and corrected it before PR #338 merged; that correction changed only `tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-readiness-proof.mjs` and `plans/FP-0159-read-only-chatgpt-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.md`. No standalone proof-correction branch, polish branch, post-merge QA branch, or separate post-merge QA is required when current `main` matches the validated PR head/merge posture and CI remains green.
