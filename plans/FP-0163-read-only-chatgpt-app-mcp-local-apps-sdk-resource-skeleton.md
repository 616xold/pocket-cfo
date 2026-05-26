# FP-0163 - Add Read-only ChatGPT App/MCP Local Apps SDK Resource Skeleton

## Purpose / Big Picture

FP-0163 is the V2CE read-only ChatGPT App/MCP local Apps SDK component-resource skeleton slice after merged FP-0162.

The purpose is intentionally narrow: add a pure-domain helper that builds one deterministic, inert, local-only component-resource skeleton object for future Apps SDK/MCP resource work. The skeleton is not registered with the MCP server and is not attached to any tool descriptor. It exists only so future work can prove the exact resource object, URI, MIME type, static HTML, and resource metadata boundary before any server registration slice opens.

This is a local-only, read-only, inert component-resource skeleton implementation. This is not `registerResource` wiring, MCP server resource registration, tool descriptor/outputTemplate implementation, render tool implementation, component bundle config, a new app route, a web API route, backend route behavior, `/mcp` route behavior change, Apps SDK public iframe/resource runtime, public ChatGPT App implementation, public app submission, public OAuth, production token validation, authorized evidence-tool execution, default auth adapter wiring, default evidence dispatch wiring, real finance data, public demo data, screenshot generation, public asset generation, listing copy, deployment config, DB query implementation, schema or migration work, package script work, OpenAI API/model integration, provider integration, provider calls, source mutation, finance write, external communication, or autonomous action.

Target phase: V2CE read-only ChatGPT App/MCP local Apps SDK component-resource skeleton, local-only, pure-domain, synthetic, and registration-blocking.

## Progress

- [x] 2026-05-26T19:24:04Z - Preflight and baseline proof ladder were confirmed from the handoff: current branch is `codex/v2ce-read-only-chatgpt-app-mcp-local-apps-sdk-resource-skeleton-local-v1`, current `HEAD` and `origin/main` are PR #341 merge commit `08aaadd19a8505b89b1143c2311089a7dbdd2252`, worktree was clean, local services were up, required files were present, FP-0163/FP-0164 were absent, and PR #341 was merged with head SHA `9589a8fc9c4df6b81fbcb75a6b94d8b343f07cd0`.
- [x] 2026-05-26T19:24:04Z - Repo-local `pocket-cfo-codex-operator` skills were invoked for Finance Plan orchestration, modular architecture, source provenance, CFO Wiki/doc freshness, evidence bundles, F6 monitoring semantics, validation ladder composition, and handoff auditing. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-26T19:24:04Z - Official OpenAI Apps SDK documentation was used read-only for component resource, MIME, metadata, CSP, output-template, UI bridge, and security/privacy context. No OpenAI API key, OpenAI API call, model call, provider call, screenshot, public asset, or deployment tool was used.
- [x] 2026-05-26T19:24:04Z - FP-0162 closeout freshness was patched with PR #341 merge facts, green GitHub `static` and `integration-db` checks, same-branch QA no-correction posture, and no standalone post-merge QA requirement when current main matches validated PR/CI posture.
- [x] 2026-05-26T19:24:04Z - FP-0162 and FP-0161 predecessor proof bridges were patched to accept exactly this FP-0163 skeleton successor while keeping FP-0164 absent and continuing to reject runtime/public/resource-registration widening.
- [x] 2026-05-26T19:24:04Z - Added the pure-domain local Apps SDK resource skeleton helper, focused spec, and direct proof command without app/web runtime edits, route edits, resource registration, output template wiring, component bundle config, token validation runtime, OAuth/session/auth middleware, provider calls, DB/schema work, package scripts, OpenAI API/model calls, real data, public assets, screenshots, or app submission material.
- [x] 2026-05-26T20:07:41Z - Same-branch QA found predecessor proof and inventory scanners that overmatched exact FP-0163 skeleton paths or proof-regex text as runtime Apps SDK resource/API/model work. The correction stayed in proof/inventory compatibility only: exact FP-0163 path allowlists were added and executable API/model-call scanners were tightened to call-shaped matches.
- [x] 2026-05-26T20:07:41Z - Validation passed: the full proof ladder, focused domain/control-plane suites, `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-05-26T20:50:24Z - Strict same-branch QA found stale predecessor proof allowlists that missed exact FP-0163 inventory compatibility files. The correction stayed proof-gate-only and added exact path compatibility without app/runtime/backend behavior changes.

## Surprises & Discoveries

FP-0162 was merged, but its closeout still carried pre-merge wording. This slice corrected that same-branch freshness rather than creating a separate polish or post-merge QA branch.

The FP-0162 proof and the FP-0161 visual QA/accessibility proof both intentionally treated any FP-0163 plan as blocked. FP-0163 needed exact successor compatibility before adding the skeleton plan, helper, spec, and proof.

Official Apps SDK docs confirm the relevant local skeleton shape: component resources can use `text/html;profile=mcp-app`, resource metadata can carry CSP/domain information, and tool descriptors can later reference resource templates through output-template metadata. FP-0163 uses that context only to shape an inert local skeleton and does not implement descriptor wiring.

Several older proof gates and source scanners used broad path/text heuristics that were correct before a resource-skeleton slice existed. They were updated only to recognize the exact FP-0163 local skeleton successor and to distinguish executable OpenAI/API/model calls from proof-regex text such as scanner patterns.

## Decision Log

- 2026-05-26T19:24:04Z - Local Apps SDK component-resource skeleton implementation is included, inert and local-only.
- 2026-05-26T19:24:04Z - `registerResource` wiring is not included.
- 2026-05-26T19:24:04Z - MCP server resource registration is not included.
- 2026-05-26T19:24:04Z - Tool descriptor/outputTemplate implementation is not included.
- 2026-05-26T19:24:04Z - A render tool is not included.
- 2026-05-26T19:24:04Z - Component bundle config is not included.
- 2026-05-26T19:24:04Z - A new route, API route, or backend route is not included.
- 2026-05-26T19:24:04Z - Public app behavior/submission is not included.
- 2026-05-26T19:24:04Z - Production token-validation runtime cannot start after FP-0163.
- 2026-05-26T19:24:04Z - Provider selection cannot start after FP-0163.
- 2026-05-26T19:24:04Z - OAuth/session/auth middleware cannot start after FP-0163.
- 2026-05-26T19:24:04Z - Public ChatGPT App demo/submission cannot start after FP-0163.
- 2026-05-26T19:24:04Z - Resource skeleton input may consume only a static synthetic local preview bridge snapshot or a future sanitized `structuredContent`-shaped object. It must not consume raw Authorization values, parser decisions, token material, token-derived fields, raw source dumps, private fields, real finance data, provider data, model output, write outputs, public demo data, source packs, or external URLs.
- 2026-05-26T19:24:04Z - Resource skeleton input preserves auth boundary lane and evidence tool lane separation and must not claim production authentication or authenticated evidence execution.
- 2026-05-26T19:24:04Z - Resource skeleton output returns a deterministic local resource skeleton object only. The URI is `ui://pocket-cfo/local-preview-demo.html`, the MIME type is `text/html;profile=mcp-app`, and HTML is static, sanitized, and script-free.
- 2026-05-26T19:24:04Z - Resource HTML must not include forms, buttons, file inputs, mutation controls, upload/select-files flows, provider/payment/send/report/certification controls, external links/navigation, listing copy, screenshots, public assets, source body text, raw source dumps, or real data.
- 2026-05-26T19:24:04Z - If statuses are shown, the resource must show `productionTokenValidationImplemented: false` and `publicChatGptAppImplemented: false`.
- 2026-05-26T19:24:04Z - Resource metadata may set `_meta.ui.prefersBorder` to `true`, must set empty `_meta.ui.csp.connectDomains`, `resourceDomains`, and `frameDomains`, must omit `_meta.ui.domain`, must not include `openai/widgetCSP.redirect_domains`, and may include only concise read-only synthetic non-marketing widget description text.
- 2026-05-26T19:24:04Z - The helper belongs in `packages/domain`, is deterministic, synchronous, side-effect free, and local-only. It must not import React, Next.js, app routes, control-plane, DB, provider, OpenAI, network, time, random, crypto, env, logger, tools, proofs, harnesses, or call filesystem APIs at runtime.
- 2026-05-26T19:24:04Z - The helper must not register the resource.
- 2026-05-26T19:24:04Z - Future FP-0164 may open only explicit local `registerResource` wiring for the already-built skeleton, FP-0163 skeleton correction, or proof-gate correction. It must not implement public app behavior, production auth, OAuth/session/auth middleware, provider calls, DB/schema/package work, real demo data, public assets, screenshots, app submission, external deployment, or default registration.
- 2026-05-26T19:24:04Z - Preserve FP-0162 readiness, FP-0161 visual QA/accessibility hardening, FP-0160 local preview/demo UI bridge implementation, FP-0159 readiness, FP-0158 local evidence demo bridge, FP-0157 local auth demo harness, FP-0156 app-construction injection, FP-0155 local adapter implementation, FP-0154 local adapter readiness, FP-0153 app-construction wiring, FP-0152 route integration, FP-0151 route readiness, FP-0150 route sequencing, FP-0149 parser implementation, FP-0148 readiness, FP-0147 provider-selection evidence, FP-0146 parser contracts, FP-0145 runtime contracts, FP-0144 production sequencing, FP-0143 app wiring, FP-0142 route sequencing, FP-0141 invalid-token challenge mapping, FP-0139 result envelopes, FP-0130 missing-token challenge, FP-0125 metadata route, FP-0109 evidence dispatch adapter, FP-0108 evidence dispatch contracts, FP-0097/0096/0094 preview route posture, FP-0086 benchmark/community contracts, FP-0085 bounded orchestration, FP-0082 evidence app alpha, FP-0081 document precision, FP-0080 evidence index, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 security boundary.
- 2026-05-26T20:07:41Z - Proof-gate compatibility patches may allow only exact FP-0163 skeleton plan/helper/spec/proof paths and exact generated-artifact inventory exceptions where needed. They must continue to reject registerResource, server resource registration, outputTemplate/tool-descriptor wiring, routes, runtime Apps SDK UI, provider/OAuth/token/model behavior, source mutation, finance writes, public assets, screenshots, listing/submission material, and FP-0164.

## Context and Orientation

FP-0162 shipped local Apps SDK component-resource readiness planning only. It recorded future input, output, metadata, CSP/domain, tool descriptor, readOnlyHint, outputTemplate, and implementation-sequence boundaries without implementing the resource.

The existing local preview route remains local/proof-only/read-only and renders a static synthetic bridge. It does not fetch `/mcp`, does not call the ChatGPT bridge, does not import proof tools or harnesses, and does not claim production authentication or authenticated evidence execution.

Replay and evidence posture: FP-0163 changes only pure domain helper/spec/proof, exact proof-bridge compatibility, and active-doc freshness. It does not change mission state, ingest state, source registry state, Finance Twin facts, CFO Wiki facts, finance answers, reports, approvals, monitor findings, durable finance artifacts, source evidence, route behavior, or production runtime. No replay event is required.

Provenance, freshness, and limitations: GitHub CLI is used for PR #341 merge truth and check freshness. Official OpenAI Apps SDK docs are context only. Finance evidence remains source of truth for product answers. FP-0163 uses no real finance data, public demo data, source pack, provider call, model call, generated advice, screenshot, source mutation, finance write, or external communication.

## Plan of Work

Patch FP-0162 closeout freshness with PR #341 merge facts and no-standalone-post-merge-QA posture.

Patch FP-0162 and exact predecessor bridge helpers/proofs so the exact FP-0163 skeleton plan, helper, spec, proof command, and generated artifact allowances are accepted while FP-0164 remains absent and runtime/public/resource-registration changes remain blocked.

Add `packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts` as a pure-domain helper that builds a deterministic component-resource skeleton object. The helper will accept only a narrow sanitized synthetic snapshot shape, escape HTML, reject unsafe fields/text, return static script-free HTML, and emit metadata with empty CSP domains and no public widget domain.

Add focused specs for the exact FP-0163 path, FP-0164 absence, URI/MIME/HTML, metadata/CSP/domain, two-lane posture, no leakage, and no runtime registration/tool/route/provider/auth/source/write behavior.

Add `tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs` to prove the FP-0163 skeleton and bridge prior proof outputs.

Refresh only directly stale active docs and `plugins.md` entries to mark FP-0163 as the current local skeleton slice while keeping public/runtime/auth/provider/registerResource work blocked.

## Concrete Steps

1. Confirm preflight and baseline proof gates are green before edits.
2. Patch FP-0162 closeout freshness if stale.
3. Patch exact FP-0162/FP-0161 successor bridge compatibility.
4. Create this exact FP-0163 Finance Plan.
5. Add `packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts`.
6. Add `packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts`.
7. Add `tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs`.
8. Add exact helper/export/inventory updates only where needed.
9. Refresh directly stale active docs and `plugins.md` only where needed.
10. Run focused validation, strict same-branch QA, final validation, closeout, commit, push, and open the PR.

## Validation and Acceptance

Required validation:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts src/read-only-app-mcp-authorization-parser-contracts.spec.ts src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts src/read-only-app-mcp-authorization-parser.spec.ts src/read-only-app-mcp-authorization-parser-route-integration-readiness.spec.ts src/read-only-app-mcp-authorization-parser-local-adapter-readiness.spec.ts src/read-only-app-mcp-authorization-parser-local-adapter.spec.ts src/read-only-app-mcp-evidence-app-local-preview-demo-ui-bridge-readiness.spec.ts src/read-only-app-mcp-local-apps-sdk-resource-readiness.spec.ts src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/app.spec.ts src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is observable when exactly one FP-0163 plan exists, FP-0164 remains absent, the skeleton helper returns deterministic `ui://pocket-cfo/local-preview-demo.html` and `text/html;profile=mcp-app`, the HTML is static/sanitized/script-free/no-external-link/no-control, metadata uses empty CSP domain arrays and no public widget domain, auth/evidence lanes remain separate, production/public statuses remain false, FP-0162 closeout freshness is patched, FP-0162 predecessor proof accepts exact FP-0163 successor files, and all prior proof boundaries remain green.

## Idempotence and Recovery

The helper is deterministic, synchronous, side-effect free, and local-only. Re-running the direct proof command and specs should leave no persistent state.

If validation finds a defect, patch this same branch and rerun the failed check plus the required ladder. If a proof bridge treats exact FP-0163 skeleton artifacts as out of scope, patch only the exact successor bridge and rerun. If generated declaration, JavaScript, or map artifacts make inventory proofs fail, patch only exact FP-0163 skeleton generated-artifact allowances and rerun. If any failure requires `registerResource`, MCP server resource registration, tool descriptor/outputTemplate implementation, render tool implementation, component bundle config, a new route/API/backend route, `/mcp` behavior change, protected-resource metadata route behavior change, live `/mcp` UI fetch, request-time harness execution, default auth adapter construction, default evidence dispatch wiring, production token validation, token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider calls, DB/schema/package work, public app behavior, app submission, source mutation, or finance writes, stop and narrow scope instead of implementing that behavior.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0163-read-only-chatgpt-app-mcp-local-apps-sdk-resource-skeleton.md`
- FP-0162 closeout freshness patch
- FP-0162 and exact predecessor proof-gate compatibility patches
- `packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts`
- `packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.spec.ts`
- `tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs`
- exact plan-path helper/export/inventory updates only where needed
- directly stale active-doc/plugin freshness edits only if needed

No app/web runtime file, new route, API route, backend route behavior, `/mcp` behavior change, protected-resource metadata behavior change, migration, package script, fixture data file, public asset, screenshot, app-submission artifact, OpenAI API integration, provider integration, DB query, source mutation, finance write, or external communication is expected.

## Interfaces and Dependencies

Direct proof command:

`pnpm exec tsx tools/read-only-mcp-local-apps-sdk-resource-skeleton-proof.mjs`

Pure domain helper:

`packages/domain/src/read-only-app-mcp-local-apps-sdk-resource-skeleton.ts`

GitHub connector product behavior is out of scope. Routine `git` and `gh` CLI operations are allowed for repository and PR truth. OpenAI Developers exposed only API-key setup surfaces and was not used. Official OpenAI Apps SDK web docs were used read-only as planning context. Codex Security, Vercel project/deployment tooling, OpenAI Platform key setup, OpenAI API/model calls, provider calls, public assets, screenshots, and app submission tooling are not used in this slice.

## Outcomes & Retrospective

FP-0163 is complete as a local-only, read-only, inert Apps SDK component-resource skeleton slice. It adds a deterministic pure-domain skeleton object without registering the resource or attaching it to any tool descriptor.

The skeleton returns `ui://pocket-cfo/local-preview-demo.html` with `text/html;profile=mcp-app`, static sanitized script-free HTML, no external links or action controls, false production/public statuses, `_meta.ui.prefersBorder: true`, empty `_meta.ui.csp.connectDomains`, `resourceDomains`, and `frameDomains`, no `_meta.ui.domain`, and no `openai/widgetCSP.redirect_domains`.

The auth-boundary lane and evidence-tool lane remain separate. The skeleton does not claim production authentication, authenticated evidence execution, provider readiness, public app behavior, real data, public demo data, source packs, finance writes, source mutation, screenshots, public assets, listing copy, app submission, OAuth/session/auth middleware, production token validation, OpenAI API/model usage, or route/runtime behavior.

Same-branch QA made only proof/inventory compatibility corrections for exact FP-0163 successor paths and scanner false positives. No app/runtime/backend behavior correction was needed.

No replay event is required because no mission state, ingest state, source registry state, Finance Twin facts, CFO Wiki facts, finance answers, reports, approvals, monitoring outputs, durable finance artifacts, route behavior, `/mcp` behavior, protected-resource metadata route behavior, app construction behavior, or production runtime behavior changed.

Validation passed with the direct FP-0163 proof, predecessor proof ladder, focused specs, `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. Remaining work after this plan closeout is commit once, push, open the PR, and rely on PR checks; no standalone post-merge QA is recommended if GitHub checks remain green and main matches the validated branch posture.
