# FP-0166 - Add Read-only ChatGPT App/MCP Local Render Tool Descriptor Skeleton

## Purpose / Big Picture

FP-0166 is the V2CH read-only ChatGPT App/MCP local render tool descriptor skeleton slice after merged FP-0165 local render tool descriptor readiness.

The purpose is intentionally narrow: add an inert, deterministic, local-only descriptor-shaped object for a future render tool. The skeleton records the future render descriptor name, title, description, sanitized structuredContent input/output boundary, read-only annotation posture, and local resource URI metadata boundary without registering or executing a render tool.

This is not render tool runtime implementation, registerTool wiring, MCP server tool registration, attaching output templates to search/fetch data tools, data-tool template ownership, default Apps SDK resource registration, default MCP server resource registration, component bundle config, Apps SDK public iframe/resource runtime, a new app route, a web API route, backend route behavior, `/mcp` route behavior change, public ChatGPT App implementation, public app submission, public OAuth, production token validation, authorized evidence-tool execution, default auth adapter wiring, default evidence dispatch wiring, real finance data, public demo data, screenshot generation, public asset generation, listing copy, deployment config, DB query implementation, schema or migration work, package script work, OpenAI API/model integration, provider integration, provider calls, source mutation, finance write, external communication, or autonomous action.

Target phase: V2CH read-only ChatGPT App/MCP local render tool descriptor skeleton, local-only and inert.

## Progress

- [x] 2026-05-27T07:02:00Z - Repo-local `pocket-cfo-codex-operator` skills were invoked for Finance Plan orchestration, modular architecture, source provenance, CFO Wiki/doc freshness, evidence bundles, F6 monitoring semantics, validation ladder composition, and handoff auditing. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-27T07:04:00Z - Preflight passed on branch `codex/v2ch-read-only-chatgpt-app-mcp-local-render-tool-descriptor-skeleton-local-v1`: `HEAD` and `origin/main` matched PR #344 merge commit `bf025e120d2fea74f8615eb7546da44686a90c35`, current branch matched the requested branch, GitHub auth was live, no open PR existed for this branch, PR #344 was merged with head SHA `f5bd30467170493b87cbe8ee477a4453d6375e81`, GitHub `static` and `integration-db` checks were green, local Postgres/object storage were running, FP-0165 existed, FP-0166 was absent, FP-0167 was absent, and required proof/source files existed.
- [x] 2026-05-27T07:10:00Z - Baseline proof gates passed before edits, including FP-0165, FP-0164, FP-0163, FP-0162, FP-0161, FP-0160, FP-0159, FP-0158, FP-0157, FP-0156, FP-0155, FP-0154, FP-0153, FP-0152, FP-0151, FP-0150, FP-0149, FP-0148, FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0109, FP-0108, FP-0086, FP-0085, FP-0082, FP-0081, FP-0080, FP-0107, FP-0106, and FP-0100 proof gates.
- [x] 2026-05-27T07:13:00Z - Official OpenAI Apps SDK documentation was reviewed read-only for Apps SDK tool descriptors, annotations/readOnlyHint, component resource registration, `_meta.ui.resourceUri`, `openai/outputTemplate`, component resource metadata, security/privacy posture, testing, and submission context. No OpenAI API key setup, OpenAI API call, model call, provider call, screenshot, public asset, deployment, app submission, or generated public material was used.
- [x] 2026-05-27T07:16:00Z - Patched stale FP-0165 closeout freshness with PR #344 merge facts, same-branch QA posture, local QA including `pnpm ci:repro:current`, green GitHub `static` and `integration-db` checks, and the no-standalone-post-merge-QA conclusion.
- [x] 2026-05-27T07:20:00Z - Patched FP-0165 predecessor proof compatibility so the exact FP-0166 plan, domain descriptor skeleton helper/spec, proof command, FP-0165 freshness correction, and exact predecessor bridge edits are accepted while unrelated runtime/public/default-registration/data-tool-template changes remain blocked.
- [x] 2026-05-27T07:24:00Z - Added the runtime-safe local render tool descriptor skeleton helper, proof-heavy bridge helper, focused spec, direct proof command, and domain export. The runtime helper imports only the local Apps SDK resource URI constant and remains deterministic, synchronous, side-effect free, and local-only.
- [x] 2026-05-27T07:33:00Z - Focused validation and strict same-branch QA passed after exact proof-gate compatibility corrections. Local QA included all required proof commands, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-05-27T07:34:00Z - Same-branch QA corrections stayed in scope: exact FP-0166 metadata-source exclusions for older broad OpenAI API/model scans, exact predecessor allowlists for FP-0166 plan/helper/spec/proof artifacts, one lint-only unused import cleanup, and no product runtime correction.
- [x] 2026-05-27T07:35:00Z - Plan closeout recorded. Commit, push, and PR creation remain the final same-branch publishing steps after the required post-closeout validation subset reruns.
- [x] 2026-05-27T07:48:00Z - Post-closeout proof QA found exact inherited FP-0162/FP-0163/FP-0164/FP-0165 path-scope compatibility gaps for the already-touched FP-0166 benchmark/community, ChatGPT app, public-security, and predecessor proof files. Patched only those exact allowlists; no runtime, route, registration, provider, source, or finance behavior changed.
- [x] 2026-05-27T08:01:12Z - Post-closeout validation subset passed after the exact path-scope compatibility corrections: `git diff --check`, FP-0166 skeleton proof, FP-0165 readiness proof, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

## Surprises & Discoveries

The current OpenAI Developers plugin surface exposed API-key setup capabilities, not a read-only Apps SDK documentation connector. Official OpenAI web documentation was used read-only instead. No key setup, OpenAI API call, model call, provider call, deployment, screenshot, public asset, or app-submission tooling was used.

FP-0165 intentionally blocked FP-0166 until an exact successor bridge existed. FP-0166 therefore patches only exact successor compatibility: the single FP-0166 plan, runtime-safe descriptor skeleton helper, proof-heavy helper/spec, direct proof command, FP-0165 closeout freshness correction, exact predecessor proof bridge edits, and directly stale active docs/plugins refreshes if needed.

The existing preview/demo bridge and local resource skeleton use camelCase fields such as `authBoundaryLaneStatus`, `evidenceToolLaneStatus`, `sourceAnchorStatus`, `freshnessPosture`, and `productionTokenValidationImplemented`. FP-0166 reuses camelCase structuredContent field casing rather than creating a second schema dialect.

Older FP-0100 through FP-0108-era proof gates treated the literal Apps SDK metadata key family as possible OpenAI API/client usage. FP-0166 patched only exact descriptor metadata source exclusions for the inert FP-0166 skeleton files, preserving those scans for all other code paths.

Post-closeout QA found that inherited FP-0162, FP-0163, FP-0164, and FP-0165 path-scope allowlists needed the exact FP-0166 proof-compatibility files already touched by this slice. Those corrections are proof-gate compatibility only and do not widen product runtime scope.

## Decision Log

- 2026-05-27T07:22:00Z - Local render tool descriptor skeleton implementation is included. It is inert and local-only.
- 2026-05-27T07:22:00Z - Render tool runtime implementation is not included.
- 2026-05-27T07:22:00Z - registerTool wiring is not included.
- 2026-05-27T07:22:00Z - MCP server tool registration is not included.
- 2026-05-27T07:22:00Z - Output templates are not attached to search/fetch data tools. No outputTemplate/resourceUri on search/fetch data tools. Data tools remain reusable and do not own the UI template.
- 2026-05-27T07:22:00Z - Default registerResource wiring is not included.
- 2026-05-27T07:22:00Z - Component bundle config is not included.
- 2026-05-27T07:22:00Z - App/web runtime is not edited.
- 2026-05-27T07:22:00Z - A new route, API route, or backend route is not included.
- 2026-05-27T07:22:00Z - Public app behavior/submission is not included.
- 2026-05-27T07:22:00Z - Production token-validation runtime cannot start after FP-0166. Production token validation is not included.
- 2026-05-27T07:22:00Z - Provider selection cannot start after FP-0166. Provider calls are not included.
- 2026-05-27T07:22:00Z - OAuth/session/auth middleware cannot start after FP-0166.
- 2026-05-27T07:22:00Z - Public ChatGPT App submission cannot start after FP-0166.
- 2026-05-27T07:22:00Z - The descriptor skeleton name is `render_pocket_cfo_local_preview_demo`, the title is `Render Pocket CFO local preview`, and the description says it renders only prepared sanitized local preview structuredContent from prior local read-only evidence preview/demo bridge output. The wording is deterministic, local, concise, and non-marketing.
- 2026-05-27T07:22:00Z - The input boundary accepts only sanitized local preview structuredContent-shaped input using canonical camelCase repo conventions. Accepted fields are `schemaVersion`, `localOnly`, `noRuntime`, `noRealFinanceData`, `noPublicApp`, `authBoundaryLaneStatus`, `evidenceToolLaneStatus`, `sourceAnchorStatus`, `freshnessPosture`, `evidenceCardSummary`, `citationSummary`, `documentMapSummary`, `sourceCoverageSummary`, `companyPostureSummary`, `capabilityBoundarySummary`, `limitations`, `productionTokenValidationImplemented`, and `publicChatGptAppImplemented`.
- 2026-05-27T07:22:00Z - The input boundary forbids raw Authorization values, parser decisions, token material, token-derived fields, raw source body dumps, private fields, real finance data, provider data, model output, write output, public demo data, source packs, external URLs, unsanitized HTML, and ChatGPT bridge tool-call exposure.
- 2026-05-27T07:22:00Z - The descriptor skeleton is metadata only and has no handler/runtime. If output schema is represented, it is the same sanitized local preview structuredContent envelope. The output boundary forbids raw source body text, real finance data, public demo data, public assets, listing copy, screenshots, app submission material, external links, forms, file inputs, mutation controls, provider/payment/send/report/certification controls, and model-generated advice.
- 2026-05-27T07:22:00Z - Descriptor metadata uses `annotations.readOnlyHint: true`. Existing descriptor conventions already use read-only/destructive/idempotent/open-world hints, so the skeleton includes `destructiveHint: false`, `idempotentHint: true`, and `openWorldHint: false` rather than inventing unsupported metadata. `_meta.ui.resourceUri` points to `ui://pocket-cfo/local-preview-demo.html`, and `_meta["openai/outputTemplate"]` is included only as a compatibility alias for that same local URI. No public domains, widget domain, CSP mutation, public asset references, or data-tool output templates are included.
- 2026-05-27T07:22:00Z - The runtime-safe descriptor skeleton builder may build only the inert descriptor skeleton object and may import only runtime-safe local resource URI constants. It must not import proof helpers, scanners, repo scanners, fs, React, Next, app routes, control-plane code, DB, provider, OpenAI, network, time, random, crypto, env, logger, tools, proofs, harnesses, SDK server runtime, registerResource, or registerTool.
- 2026-05-27T07:22:00Z - Future FP-0167 may open only an explicit local render tool registration helper for this descriptor skeleton, an FP-0166 skeleton correction, or one narrow proof-gate correction. It must not implement default tool registration, public app behavior, production auth, OAuth/session/auth middleware, provider calls, DB/schema/package work, real demo data, public assets, screenshots, app submission, external deployment, attaching templates to data tools, or authenticated evidence execution.
- 2026-05-27T07:22:00Z - Preserve FP-0165 readiness, FP-0164 explicit local resource registration, FP-0163 skeleton, FP-0162 readiness, FP-0161 visual QA/accessibility hardening, FP-0160 local preview/demo UI bridge implementation, FP-0159 readiness, FP-0158 local evidence demo bridge, FP-0157 local auth demo harness, FP-0156 app-construction injection, FP-0155 local adapter implementation, FP-0154 local adapter readiness, FP-0153 app-construction wiring, FP-0152 route integration, FP-0151 route readiness, FP-0150 route sequencing, FP-0149 parser implementation, FP-0148 readiness, FP-0147 provider-selection evidence, FP-0146 parser contracts, FP-0145 runtime contracts, FP-0144 production sequencing, FP-0143 app wiring, FP-0142 route sequencing, FP-0141 invalid-token challenge mapping, FP-0139 result envelopes, FP-0130 missing-token challenge, FP-0125 metadata route, FP-0109 evidence dispatch adapter, FP-0108 evidence dispatch contracts, FP-0097/0096/0094 preview route posture, FP-0086 benchmark/community contracts, FP-0085 bounded orchestration, FP-0082 evidence app alpha, FP-0081 document precision, FP-0080 evidence index, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 security boundary.
- 2026-05-27T07:22:00Z - Default auth adapter wiring is not included. Default evidence dispatch wiring is not included. Harness execution at request/render time is not included. OpenAI API calls are not included. Model calls are not included. Public assets are not included. Screenshots are not included. App submission material is not included. Source mutation is not included. Finance writes are not included. Generated public prose is not included. External communications are not included.
- 2026-05-27T07:35:00Z - No post-merge QA is required if this branch merges without substantive correction after final validation and GitHub checks remain green, because current main already matches the validated PR #344 merge posture and FP-0166 changes are local inert descriptor/proof/doc compatibility only.

## Context and Orientation

FP-0165 shipped local render tool descriptor readiness only. It recorded that a future descriptor may accept only prepared sanitized structuredContent from the local evidence preview/demo bridge, may use read-only descriptor metadata, may use `_meta.ui.resourceUri` and `openai/outputTemplate` in a later implementation slice, must not attach templates to search/fetch data tools, and must keep auth boundary and evidence tool lanes separate.

FP-0164 shipped explicit local Apps SDK resource registration helper behavior without default registration. FP-0163 shipped the inert resource skeleton and static synthetic local URI. FP-0162 and FP-0161 kept the local preview/demo bridge and visual QA posture read-only, local, noindex/noarchive, and free of live `/mcp` fetches or `window.openai`.

Replay and evidence posture: FP-0166 changes only domain descriptor skeleton helpers, specs, proof commands, Finance Plan/docs freshness, and proof bridge compatibility. It does not change mission state, source registry state, Finance Twin facts, CFO Wiki facts, finance answers, reports, approvals, monitor findings, durable finance artifacts, routes, `/mcp` behavior, default containers, protected-resource metadata route behavior, source evidence, raw source files, or finance data. No replay event is required.

Provenance, freshness, and limitations: GitHub CLI is used for PR #344 merge truth and CI freshness. Official OpenAI Apps SDK docs are read-only context only. Finance evidence remains the source of truth for product answers. FP-0166 uses no real finance data, public demo data, source pack, provider call, model call, generated advice, screenshot, source mutation, finance write, or external communication.

## Plan of Work

Patch stale FP-0165 closeout freshness with PR #344 merge facts, same-branch QA posture, local `pnpm ci:repro:current` success, green GitHub static/integration-db checks, origin/main merge posture, and no standalone post-merge QA requirement.

Patch exact FP-0165 predecessor proof bridge compatibility so the exact FP-0166 plan/helper/spec/proof files are accepted, FP-0167 remains absent, and unrelated runtime/public/default-registration/data-tool-template changes remain blocked.

Add `packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton-runtime.ts` as the runtime-safe descriptor skeleton builder. It builds only an inert descriptor-shaped object and a sanitizer for prepared local preview structuredContent-shaped input.

Add `packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton.ts` as the proof-heavy bridge for plan topics, FP-0165 freshness, successor compatibility, no-leakage posture, and predecessor boundary fields.

Add focused specs and `tools/read-only-mcp-local-render-tool-descriptor-skeleton-proof.mjs` to prove the FP-0166 plan, helper, predecessor bridge, data-tool no-template posture, no runtime route/provider/auth/public-app widening, and preserved predecessor boundaries.

Refresh only directly stale active docs and `plugins.md` entries if they still describe FP-0165 as the active terminal boundary after FP-0166 is implemented.

## Concrete Steps

1. Confirm preflight and baseline proof gates are green before edits.
2. Patch stale FP-0165 closeout freshness.
3. Patch exact FP-0165 predecessor proof compatibility.
4. Create this exact FP-0166 Finance Plan.
5. Add the runtime-safe local render tool descriptor skeleton helper.
6. Add the proof-heavy local render tool descriptor skeleton bridge and focused spec.
7. Add the direct FP-0166 proof command.
8. Refresh directly stale active docs and `plugins.md` only where needed.
9. Run focused validation and strict same-branch QA.
10. Patch this same branch if QA finds a real in-scope defect.
11. Run final validation, close out this plan, commit once, push, and open the PR.

## Validation and Acceptance

Required validation:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-local-render-tool-descriptor-skeleton-proof.mjs
pnpm exec tsx tools/read-only-mcp-local-render-tool-descriptor-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-local-apps-sdk-resource-registration-proof.mjs
pnpm exec tsx tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs
pnpm exec tsx tools/read-only-mcp-local-apps-sdk-resource-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-evidence-app-local-preview-demo-visual-qa-accessibility-proof.mjs
pnpm exec tsx tools/read-only-mcp-evidence-app-local-preview-demo-ui-bridge-implementation-proof.mjs
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts src/read-only-app-mcp-authorization-parser-contracts.spec.ts src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts src/read-only-app-mcp-authorization-parser.spec.ts src/read-only-app-mcp-authorization-parser-route-integration-readiness.spec.ts src/read-only-app-mcp-authorization-parser-local-adapter-readiness.spec.ts src/read-only-app-mcp-authorization-parser-local-adapter.spec.ts src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.spec.ts src/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.ts src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts src/read-only-app-mcp-local-apps-sdk-resource-registration.spec.ts src/read-only-app-mcp-local-render-tool-descriptor-readiness.spec.ts src/read-only-app-mcp-local-render-tool-descriptor-skeleton.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/app.spec.ts src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is observable when exactly one FP-0166 skeleton plan exists, FP-0167 remains absent, the direct proof command passes, the skeleton helper exports the deterministic descriptor, the sanitizer accepts only canonical camelCase local preview structuredContent, FP-0165 closeout freshness is verified, FP-0165 predecessor proof bridge accepts the exact FP-0166 successor files and rejects unrelated behavior, no render tool runtime exists, no registerTool or MCP server tool registration exists, no `_meta.ui.resourceUri` or `openai/outputTemplate` is attached to search/fetch data tools, data tools remain reusable, no component bundle config is added, no route/API/backend behavior is added, default registerResource/auth adapter/evidence dispatch wiring remains blocked, default `createContainer()`, `createInMemoryContainer()`, and `buildApp()` behavior do not change, `/mcp` behavior does not change, protected-resource metadata route behavior does not change, shared leakage scanners still reject credential-like material, no real finance data/public demo data/source packs/screenshots/public assets/listing copy/app submission material exist, and all predecessor proof boundaries remain green.

## Idempotence and Recovery

The runtime helper is deterministic, synchronous, side-effect free, and local-only. The proof-heavy helper and proof command read repository files for validation only. Re-running specs and proof commands should leave no persistent state.

If validation finds a defect, patch this same branch and rerun the failed check plus the required ladder. If a predecessor proof treats exact FP-0166 skeleton artifacts as out of scope, patch only the exact successor bridge and rerun. If generated declaration, JavaScript, or map artifacts make inventory proofs fail, patch only exact FP-0166 descriptor skeleton generated-artifact allowances and rerun. If any failure requires render tool runtime, registerTool wiring, MCP server registration, output templates attached to data tools, default resource registration, component bundle config, route behavior change, `/mcp` behavior change, protected-resource metadata route behavior change, live `/mcp` UI fetch, request-time harness execution, default auth adapter construction, default evidence dispatch wiring, production token validation, token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, app submission, real/public demo data, public assets, screenshots, source mutation, or finance writes, stop and narrow scope instead of implementing that behavior.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0166-read-only-chatgpt-app-mcp-local-render-tool-descriptor-skeleton.md`
- FP-0165 closeout freshness patch
- exact FP-0165 predecessor proof compatibility patch
- `packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton-runtime.ts`
- `packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton.ts`
- `packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton.spec.ts`
- `tools/read-only-mcp-local-render-tool-descriptor-skeleton-proof.mjs`
- exact plan-path helper/export updates only where needed
- directly stale active-doc/plugin freshness edits only if needed

No app/web runtime file, control-plane route/app/server file, new route, API route, backend route behavior, `/mcp` behavior change, protected-resource metadata behavior change, migration, package script, fixture data file, public asset, screenshot, app-submission artifact, OpenAI API integration, provider integration, DB query, source mutation, finance write, or external communication is expected.

## Interfaces and Dependencies

Direct proof command:

`pnpm exec tsx tools/read-only-mcp-local-render-tool-descriptor-skeleton-proof.mjs`

Runtime-safe descriptor skeleton helper:

`packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton-runtime.ts`

Proof-heavy bridge helper:

`packages/domain/src/read-only-app-mcp-local-render-tool-descriptor-skeleton.ts`

Existing data tools remain:

`packages/domain/src/read-only-app-mcp-descriptor.ts`

GitHub connector product behavior is out of scope. Routine `git` and `gh` CLI operations are allowed for repository and PR truth. OpenAI Developers exposed only API-key setup surfaces and was not used. Official OpenAI Apps SDK web docs were used read-only as descriptor/resource context. Codex Security, Vercel project/deployment tooling, OpenAI Platform key setup, OpenAI API/model calls, provider calls, public assets, screenshots, and app submission tooling are not used in this slice.

## Outcomes & Retrospective

FP-0166 is implemented and locally validated as a deterministic, inert, local-only render tool descriptor skeleton with a sanitized local preview structuredContent boundary, read-only metadata, and local resource URI/outputTemplate alias only on the skeleton descriptor.

The exact FP-0165 predecessor bridge should accept this FP-0166 skeleton successor while preserving the FP-0165 readiness boundary, FP-0164 explicit local resource registration boundary, FP-0163 skeleton, FP-0162 readiness, FP-0161 visual QA/accessibility hardening, FP-0160 preview/demo UI bridge, and earlier read-only app/MCP, token-validation, route, preview, evidence, document, benchmark/community, protocol, and public-security boundaries.

No replay event is required because this slice changes only plans/docs/proof helpers/specs/proof commands and does not change mission state, finance evidence, sources, the Finance Twin, reports, approvals, monitor findings, routes, runtime behavior, or durable finance artifacts.

Final local validation passed before closeout, including all required proof commands, focused domain/control-plane specs, `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. Post-closeout proof QA patched only exact inherited path-scope compatibility gaps; the required post-closeout validation subset then passed again before commit.
