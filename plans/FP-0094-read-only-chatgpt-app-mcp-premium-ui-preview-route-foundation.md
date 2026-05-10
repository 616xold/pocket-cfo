# FP-0094 - Read-only ChatGPT App MCP Premium UI Preview Route Foundation

## Purpose / Big Picture

Target phase: `V2N`.

Exact slice: `V2N-read-only-chatgpt-app-mcp-premium-ui-preview-route-foundation-local-v1`.

Status: shipped local/proof-only/read-only premium UI preview route foundation slice, created and closed 2026-05-09.

FP-0094 is the first route implementation slice after shipped FP-0093. It adds exactly one local read-only web page at `apps/web/app/read-only-app-mcp-preview/page.tsx` so a human can view the shipped FP-0091/FP-0092 premium read-only app/MCP UI composition in a local browser route.

This slice writes actual route code. This slice still does not implement a public ChatGPT App. This slice does not implement Apps SDK iframe/UI resources. This slice does not add API endpoints. This slice does not add backend/control-plane routes. This slice does not add remote MCP. This slice does not add OAuth. This slice does not add app submission. This slice does not add OpenAI API/model calls. This slice does not deploy anything.

FP-0094 authorizes only this plan, one local read-only preview page route, focused route tests, and the minimum proof-gate bridge needed to accept exactly this route foundation while keeping FP-0095 absent. It does not authorize web API routes, backend routes, endpoints, remote MCP, Apps SDK iframe/resource registration, OAuth, app submission, provider/certification/deployment, OpenAI API/model calls, source mutation, finance writes, generated product prose, runtime-Codex finance output, autonomous action, public app implementation, screenshots, generated images, public listing assets, public app assets, sample data, fixtures, eval datasets, public source packs, or package scripts.

The user-visible purpose is local observability only: the shipped local premium UI component/composition foundation can be rendered through one explicit preview route using in-memory synthetic contract-shaped examples. The route does not fetch data, call APIs, POST, render forms, render buttons, create upload controls, use server actions, or expose mutation controls.

Authority model remains unchanged:

- raw sources remain authoritative for document claims
- the Finance Twin remains authoritative for structured finance facts
- the CFO Wiki remains compiled and derived
- EvidenceIndex remains the source anchor, document map, evidence card, source coverage, freshness, and limitation layer
- V2C tools remain local/internal read-only evidence contracts
- V2D Evidence Atlas remains the shipped read-only local operator UI foundation
- V2E remains local/internal proof-only bounded orchestration
- V2F remains docs/proof-only benchmark/community contracts with no datasets or real finance data
- V2G remains local proof-only read-only ChatGPT App/MCP contracts, descriptors, and response envelopes
- FP-0088, FP-0089, and FP-0090 remain shipped docs-only UI/security/readiness records
- FP-0091 remains the shipped local/proof-only/read-only component foundation
- FP-0092 remains the shipped local/proof-only/read-only composition/accessibility foundation
- FP-0093 remains the shipped docs-only preview route master-plan

GitHub connector product behavior is explicitly out of scope. Routine `git`, `gh`, push, and PR operations for this repository do not invoke GitHub Connector Guard.

Replay and evidence-bundle implications: this slice creates no mission state transition, ingest action, report action, approval, durable product finance output, source mutation, Finance Twin write, CFO Wiki write, evidence bundle, provider job, certification record, delivery record, endpoint, backend route, or app/MCP runtime behavior. The route displays synthetic in-memory proof objects only and is not source truth.

## Progress

- [x] 2026-05-09T23:32:41Z - Invoked the requested Pocket CFO operator skills: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor.
- [x] 2026-05-09T23:32:41Z - Confirmed GitHub Connector Guard is out of scope because GitHub connector product behavior is not part of this slice.
- [x] 2026-05-09T23:32:41Z - Ran preflight against fetched `origin/main` on branch `codex/v2n-read-only-chatgpt-app-mcp-premium-ui-preview-route-foundation-local-v1`; the repo started clean, `HEAD` matched `origin/main`, GitHub auth/repo access worked, PR #254 was merged, Docker Postgres/MinIO were available, FP-0093 existed and shipped, FP-0094 was absent, FP-0095 was absent, and required V2 proof tools existed.
- [x] 2026-05-09T23:32:41Z - Read required active docs, shipped FP-0092 and FP-0093 records, plugin inventory, package metadata, existing read-only app/MCP components, app/web route and lib inventory, V2F/V2G domain contracts, proof tools, and active boundary docs before edits.
- [x] 2026-05-09T23:32:41Z - Ran baseline V2A/V2B/V2C/V2E/V2F/V2G proof gates before edits; all passed.
- [x] 2026-05-09T23:32:41Z - Confirmed baseline V2F/V2G gates proved `fp0094Absent: true`, which is expected pre-edit state before this local preview-route successor.
- [x] 2026-05-09T23:32:41Z - Created this FP-0094 plan as the only allowed FP-0094 file.
- [x] 2026-05-09T23:41:55Z - Added exactly one local preview route at `apps/web/app/read-only-app-mcp-preview/page.tsx` and a focused route spec at `apps/web/app/read-only-app-mcp-preview/page.spec.tsx`.
- [x] 2026-05-09T23:41:55Z - Updated V2F/V2G proof schemas, builders, direct proof tools, and focused specs so FP-0094 can authorize exactly this local preview route while FP-0095 remains absent.
- [x] 2026-05-09T23:41:55Z - Ran the route spec and the three FP-0094 bridge-heavy proof tools after correcting the page React import and the older FP-0091/FP-0092 route scans; all passed.
- [x] 2026-05-09T23:42:59Z - Ran focused validation through all seven proof tools, full web vitest, web typecheck, and focused V2F/V2G domain specs; all passed.
- [x] 2026-05-09T23:42:59Z - Ran same-branch QA for route count, API/backend route absence, FP-0095 absence, forbidden route source patterns, raw/private rendered fields, advice-like CTA copy, public assets, screenshots, app-submission artifacts, fixtures, samples, evals, source packs, OpenAI API/model calls, OAuth, and app submission; no out-of-scope route/runtime artifacts were found.
- [x] 2026-05-10T00:47:00Z - Ran final validation before closeout through `git diff --check`, all seven proof tools, full web vitest, web typecheck, focused V2F/V2G domain specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed.
- [x] 2026-05-10T00:47:00Z - Refreshed only directly stale active docs and `plugins.md` so FP-0094 is recorded as shipped local preview route foundation while public ChatGPT App/MCP submission and runtime expansion remain future-only.
- [x] 2026-05-10T01:00:52Z - Ran post-closeout validation through `git diff --check`, all seven proof tools, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed.

## Surprises & Discoveries

Baseline proof gates still prove FP-0094 absence after shipped FP-0093. That is correct pre-edit behavior. This slice must replace the hard FP-0094 absence posture with an exact FP-0094 local preview route foundation boundary while keeping FP-0095 absent.

The default path `apps/web/app/read-only-app-mcp-preview/page.tsx` does not conflict with current app route conventions and is explicit enough to avoid implying public ChatGPT App publication or remote MCP deployment.

No real finance data, public sample pack, eval dataset, fixture, sample data, source-pack mutation, write tools, OAuth implementation, app submission, remote endpoint implementation, OpenAI API/model calls, provider/certification/deployment/external communications work, package-scope rename, GitHub module deletion, engineering-twin module deletion, finance write, or source mutation is required.

Initial focused validation found that the route spec needed an explicit React import for server rendering, and the older FP-0091/FP-0092 proof scans treated `apps/web/app/read-only-app-mcp-preview/**` as though it were an unauthorized earlier route. The fix was narrow: add the route page React import and make FP-0094 the exact owner of the preview-route exception while FP-0091 and FP-0092 continue to reject their own route expansion.

## Decision Log

Decision: FP-0094 is safe to create as the first local preview route implementation slice.
Rationale: PR #254 is merged, FP-0093 is shipped as preview route readiness, FP-0092 local composition/accessibility proof gates passed, and the implementation can stay one local read-only page plus focused tests and proof-gate compatibility.

Decision: use `apps/web/app/read-only-app-mcp-preview/page.tsx` as the route path.
Rationale: FP-0093 named this as the likely local-only path, the path is not occupied, and it is clearly scoped to a preview route rather than a public app or remote MCP runtime.

Decision: the route must render `ReadOnlyAppMcpEnvelopePreview` with in-memory synthetic contract-shaped examples.
Rationale: FP-0091 and FP-0092 already own the component/composition foundation. The route should make that surface observable without adding data fetching, API calls, fixtures, source packs, sample data, or new component behavior.

Decision: route tests must assert forbidden runtime and action posture directly.
Rationale: this is the first route implementation after docs-only route readiness, so the test must prove no forms, buttons, submit controls, POST, fetch, server actions, uploads, raw/private fields, advice-like CTA copy, OpenAI API/model calls, API route, backend route, OAuth, app submission, screenshot/image assets, or public app assets were added.

Decision: no replay event is added.
Rationale: this slice changes a local read-only preview page, tests, docs, and proof-gate validation only. It does not change product runtime finance state, mission state, source state, reports, approvals, or evidence artifacts.

## Context and Orientation

FP-0091 shipped the first local/proof-only/read-only premium UI component foundation under `apps/web/components/read-only-app-mcp/**`. FP-0092 shipped the local/proof-only/read-only composition/accessibility hardening layer over those components. FP-0093 shipped the docs-only local preview-route master-plan. FP-0094 implements the first local route foundation and keeps public app behavior future-only.

This plan preserves the premium, calm, Apple/OpenAI-style, evidence-first quality bar recorded by FP-0088 through FP-0093. It does not create new design assets, Figma exports, screenshots, images, public listing assets, app-submission assets, sample data, fixtures, eval datasets, source packs, endpoints, OAuth, remote MCP, Apps SDK resources, or deployment artifacts.

Official web/plugin research used in this slice:

- No new official web research was used.
- No OpenAI Developers tool was used to create API keys, call OpenAI APIs, call models, or widen app/runtime scope.
- No OpenAI API key was created or used.
- No OpenAI API/model call was made.
- No Build Web Apps, Codex Security, Figma, app-submission, design-generation, artifact-upload, dependency-installation, screenshot-generation, image-generation, public-asset, or upload plugin workflow was used.

## Plan of Work

Allowed files for this slice:

- `plans/FP-0094-read-only-chatgpt-app-mcp-premium-ui-preview-route-foundation.md`
- `apps/web/app/read-only-app-mcp-preview/page.tsx`
- `apps/web/app/read-only-app-mcp-preview/page.spec.tsx`
- `apps/web/components/read-only-app-mcp/**` only if a narrow route-facing compatibility fix is required
- `apps/web/components/read-only-app-mcp/**/*.spec.tsx` only if a narrow route-facing compatibility test is required
- `apps/web/lib/read-only-app-mcp-ui.ts` only if a tiny pure helper is required
- `packages/domain/src/read-only-app-mcp*.ts` only for proof-gate fields or direct proof compatibility
- `packages/domain/src/benchmark-community*.ts` only for proof-gate fields or direct proof compatibility
- `packages/domain/src/read-only-app-mcp*.spec.ts` only for proof-gate tests
- `packages/domain/src/benchmark-community*.spec.ts` only for proof-gate tests
- `tools/read-only-mcp-descriptor-response-envelope-proof.mjs`
- `tools/read-only-chatgpt-app-mcp-proof.mjs`
- `tools/benchmark-community-pack-proof.mjs`
- `plugins.md` only if directly stale
- `README.md` only if directly stale
- `CODEX_README.md` only if directly stale
- `START_HERE.md` only if directly stale
- `docs/ACTIVE_DOCS.md` only if directly stale
- `docs/PROJECT_STATE.md` only if directly stale
- `docs/V2_BOUNDARY.md` only if directly stale
- `plans/ROADMAP.md` only if directly stale
- `plans/FP-0093-read-only-chatgpt-app-mcp-premium-ui-preview-route-master-plan.md` only for tiny shipped-state wording polish if directly stale

Forbidden behavior:

- no web API routes
- no backend/control-plane routes
- no endpoints
- no remote MCP server
- no Apps SDK iframe/UI resource registration
- no OAuth
- no app submission
- no schema or migrations
- no package scripts or smoke aliases
- no eval datasets, fixtures, sample data, public demo data, or source packs
- no source-pack fixture edits
- no FP-0095
- no public app implementation
- no OpenAI API/model calls
- no provider/certification/deployment/external communications
- no source mutation
- no finance writes
- no generated product prose or runtime-Codex finance output
- no autonomous action
- no screenshot binaries, generated images, public listing assets, app-submission assets, or public app assets

Implementation goals:

- add exactly one local preview route at `apps/web/app/read-only-app-mcp-preview/page.tsx`
- render `ReadOnlyAppMcpEnvelopePreview` or the current FP-0092 composed preview
- use in-memory synthetic contract-shaped examples only
- preserve evidence hierarchy, freshness posture, source anchors, citations, limitations, privacy boundary, no-runtime boundary, and forbidden-action posture
- preserve accessibility hardening from FP-0092
- prove no forms, buttons, submit controls, POST, fetch, server actions, uploads, action-looking forbidden controls, raw/private field rendering, advice-like CTA copy, OpenAI API/model calls, API/backend routes, OAuth, app submission, screenshots, generated images, or public assets
- update proof-gate contracts/tools/specs so exactly one FP-0094 local preview route foundation is accepted while FP-0095 remains absent

Proof-gate bridge fields must prove:

- `fp0094AbsentOrLocalPreviewRouteBoundaryVerified`
- `fp0095Absent`
- `localPreviewRouteFoundationVerified`
- `noApiRoutesFromFp0094`
- `noBackendRoutesFromFp0094`
- `noEndpointsFromFp0094`
- `noAppsSdkIframeFromFp0094`
- `noOauthSubmissionFromFp0094`
- `noPublicAppImplementationFromFp0094`
- `noOpenAiApiCallsFromFp0094`
- `noSourceMutationFinanceWriteFromFp0094`
- existing FP-0093 preview-route plan boundary remains intact
- existing FP-0092 and FP-0091 local UI boundaries remain intact
- public app implementation and public app submission remain future-only

## Concrete Steps

1. Run preflight and baseline proof gates.
2. Confirm baseline proof gates prove FP-0094 absence and treat that as expected pre-edit state.
3. Create this plan as the only FP-0094 file.
4. Add exactly one local preview page route.
5. Add focused route tests.
6. Update minimal V2F/V2G proof schemas, builders, proof tools, and focused specs so the exact FP-0094 local preview route foundation is accepted while FP-0095 remains absent.
7. Refresh only directly stale active docs and `plugins.md` if required.
8. Run focused validation.
9. Run strict same-branch QA over changed files and patch only this slice if needed.
10. Run final validation.
11. Mark this FP-0094 route foundation shipped and update directly stale active docs.
12. If closeout docs are edited after validation, rerun the minimum post-closeout validation.
13. Commit exactly once, push the requested branch, and open the requested PR.

## Validation and Acceptance

Baseline proof gates run before edits:

```bash
pnpm exec tsx tools/read-only-mcp-descriptor-response-envelope-proof.mjs
pnpm exec tsx tools/read-only-chatgpt-app-mcp-proof.mjs
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
```

Required focused validation after edits:

```bash
pnpm exec tsx tools/read-only-mcp-descriptor-response-envelope-proof.mjs
pnpm exec tsx tools/read-only-chatgpt-app-mcp-proof.mjs
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
pnpm --filter @pocket-cto/web exec vitest run
pnpm --filter @pocket-cto/web typecheck
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts
```

Strict same-branch QA:

- Confirm exactly one app route was added and no API/backend route was added.
- Confirm no forms, buttons, POST, fetch, server actions, uploads, forbidden action controls, raw-dump panels, advice-like CTA copy, screenshots, images, app-submission assets, public assets, OpenAI API/model calls, OAuth, or app submission.
- Confirm no FP-0095.
- Patch on this same branch if QA finds a defect, then rerun required validation.

Required final validation:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-descriptor-response-envelope-proof.mjs
pnpm exec tsx tools/read-only-chatgpt-app-mcp-proof.mjs
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
pnpm --filter @pocket-cto/web exec vitest run
pnpm --filter @pocket-cto/web typecheck
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance evidence:

- exactly one FP-0094 file exists at `plans/FP-0094-read-only-chatgpt-app-mcp-premium-ui-preview-route-foundation.md`
- FP-0095 remains absent
- exactly one local preview route exists at `apps/web/app/read-only-app-mcp-preview/page.tsx`
- FP-0094 proof gates accept only this local read-only preview route foundation
- route renders shipped FP-0091/FP-0092 components only
- route uses in-memory synthetic contract-shaped examples only
- route fetches no data and calls no APIs
- route renders no forms, buttons, submit controls, upload controls, or action-looking forbidden controls
- route uses no server actions and contains no POST
- no API route, backend route, endpoint, remote MCP server, Apps SDK iframe/resource registration, OAuth, app submission, OpenAI API/model call, source mutation, finance write, generated product prose, runtime-Codex finance output, autonomous action, screenshot, generated image, public app asset, fixture, sample data, eval dataset, public source pack, schema, migration, package script, or smoke alias is added
- existing FP-0093 preview-route master-plan boundary remains intact
- existing FP-0092 local composition/accessibility boundary remains intact
- existing FP-0091 local component boundary remains intact
- existing FP-0090, FP-0089, and FP-0088 docs-only boundaries remain intact
- existing FP-0087 typed boundary remains intact
- public app implementation and public app submission remain future-only

## Idempotence and Recovery

Rerunning this slice should find this exact FP-0094 file and update it rather than creating another FP-0094 or FP-0095.

If proof gates fail because FP-0094 is present, patch only the proof-gate bridge so the exact local preview route foundation boundary is accepted. Do not widen into API routes, backend routes, endpoint implementation, public app, Apps SDK iframe/UI resources, OAuth, submission, remote MCP, provider, deployment, OpenAI API/model, source mutation, or finance-write behavior.

If route validation fails, patch only `apps/web/app/read-only-app-mcp-preview/page.tsx`, `apps/web/app/read-only-app-mcp-preview/page.spec.tsx`, or the minimal proof/spec bridge that owns the failure.

If validation fails after a correction, report the exact failing command and recommend the smallest safer corrective slice:

- FP-0094 route boundary correction
- FP-0093 proof-boundary correction
- FP-0092 composition/accessibility correction
- FP-0091 component correction
- hold preview route until local UI boundaries can be proven

## Artifacts and Notes

This plan records no source files, sample data, fixtures, eval datasets, screenshots, generated images, public listing assets, app submission materials, app metadata, OAuth material, endpoints, backend routes, provider credentials, deployment artifacts, real finance data, or public source packs.

Route tests use in-memory examples only. Those examples are synthetic proof objects and not finance source truth.

## Interfaces and Dependencies

The route depends only on the existing local FP-0091 and FP-0092 component exports under `apps/web/components/read-only-app-mcp/**` and React/Next route conventions already present in `apps/web`. It must not import `apps/web/lib/api`, call `fetch`, create route handlers, add API/backend routes, use server actions, invoke OpenAI APIs, read `OPENAI_API_KEY`, create OAuth material, or register app submission assets.

The route has no environment variables, no package scripts, no DB dependency, no object-storage dependency, no control-plane dependency, and no source-pack dependency.

## Outcomes & Retrospective

Outcome: shipped exactly one local/proof-only/read-only premium UI preview route foundation at `apps/web/app/read-only-app-mcp-preview/page.tsx`, backed by focused route tests and the FP-0094 proof-gate bridge.

Validation outcome: pre-closeout validation passed through `git diff --check`, all seven proof tools, full web vitest, web typecheck, focused V2F/V2G domain specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. Post-closeout validation passed through `git diff --check`, all seven proof tools, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

Scope outcome remained: one local/proof-only/read-only preview route foundation only; no web API routes, backend routes, endpoints, remote MCP server, Apps SDK iframe/UI resource registration, OAuth, app submission, schema, migration, package script, smoke alias, eval dataset, fixture, sample data, public demo data, source pack, OpenAI API/model call, vector/file-search, OCR, PageIndex, provider/certification/delivery/deployment, external communication, source mutation, finance write, generated product prose, runtime-Codex finance output, autonomous action, FP-0095, screenshots, generated images, public assets, or public app implementation.
