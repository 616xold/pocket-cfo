# FP-0092 - Read-only ChatGPT App MCP Premium UI Composition Accessibility Foundation

## Purpose / Big Picture

Target phase: `V2L`.

Exact slice: `V2L-read-only-chatgpt-app-mcp-premium-ui-composition-accessibility-foundation-local-v1`.

Status: shipped local/proof-only/read-only UI composition and accessibility hardening slice, created and closed 2026-05-09.

This Finance Plan implements the next local premium UI composition and accessibility hardening foundation after shipped FP-0091. This slice writes actual UI component/composition code. It is still strictly local, proof-only, read-only, and limited to component composition and accessibility hardening.

This slice does not add app routes. This slice does not implement a public ChatGPT App. This slice does not implement Apps SDK iframe/UI resources. This slice does not add endpoints. This slice does not add remote MCP. This slice does not add OAuth. This slice does not add app submission. This slice does not add OpenAI API/model calls. This slice does not deploy anything.

FP-0092 authorizes only local read-only UI composition/accessibility hardening under `apps/web/components/read-only-app-mcp/**`, focused component tests, this plan, and the minimum proof-gate bridge needed to accept exactly this file. It does not authorize routes, endpoints, remote MCP, Apps SDK iframe/resource registration, OAuth, app submission, provider/certification/deployment, OpenAI API/model calls, source mutation, finance writes, generated product prose, runtime-Codex finance output, or autonomous action.

The user-visible purpose is to compose the shipped FP-0091 component foundation into a coherent evidence hierarchy with stable scoped section IDs, heading-level control for nested panels, accessibility assertions, contrast/token proof, refusal-state text labels, responsive DOM/style assertions, raw/private field rejection, and copy boundaries. The components are not wired into a route and do not become product runtime behavior by themselves.

Authority model remains unchanged:

- raw sources remain authoritative for document claims
- the Finance Twin remains authoritative for structured finance facts
- the CFO Wiki remains compiled and derived
- EvidenceIndex remains the source anchor, document map, evidence card, source coverage, freshness, and limitation layer
- V2C tools remain local/internal read-only evidence contracts
- V2D Evidence Atlas remains the shipped read-only local operator UI foundation
- V2E remains local/internal proof-only bounded orchestration
- V2F remains docs/proof-only benchmark/community posture with no datasets or real finance data
- V2G remains local proof-only read-only ChatGPT App/MCP contracts, descriptors, and response envelopes
- FP-0088, FP-0089, FP-0090, and FP-0091 remain shipped records

GitHub connector product behavior is explicitly out of scope. Routine `git`, `gh`, push, and PR operations for this repository do not invoke GitHub Connector Guard.

Replay and evidence-bundle implications: this slice creates no mission state transition, ingest action, report action, approval, durable product runtime output, source mutation, Finance Twin write, CFO Wiki write, evidence bundle, provider job, certification record, delivery record, endpoint, route, or app runtime behavior. The component tests use in-memory contract-shaped examples only.

## Progress

- [x] 2026-05-09T21:21:00Z - Invoked the requested Pocket CFO operator skills: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor.
- [x] 2026-05-09T21:21:00Z - Confirmed GitHub Connector Guard is out of scope because GitHub connector product behavior is not part of this slice.
- [x] 2026-05-09T21:21:00Z - Ran preflight against fetched `origin/main` on branch `codex/v2l-read-only-chatgpt-app-mcp-premium-ui-composition-accessibility-foundation-local-v1`; the repo started clean, `HEAD` matched `origin/main`, GitHub auth/repo access worked, PR #251 was merged, Docker Postgres/MinIO were available, FP-0091 existed and shipped, FP-0092 was absent, FP-0093 was absent, and required V2 proof tools existed.
- [x] 2026-05-09T21:21:00Z - Read required active docs, shipped FP-0089 through FP-0091 records, plugin inventory, package metadata, existing read-only app/MCP components, V2F/V2G domain contracts, proof tools, and app/web route/lib file inventory before edits.
- [x] 2026-05-09T21:21:00Z - Ran baseline V2A/V2B/V2C/V2E/V2F/V2G proof gates before edits; all passed.
- [x] 2026-05-09T21:21:00Z - Confirmed baseline V2F/V2G gates proved `fp0092Absent: true`, which is expected pre-edit state before this local composition/accessibility successor.
- [x] 2026-05-09T21:21:00Z - Created this FP-0092 plan as the only allowed FP-0092 file.
- [x] 2026-05-09T22:30:00Z - Added scoped section ID helpers, heading-level controls, and a composed `ReadOnlyAppMcpEnvelopePreview` / `ReadOnlyAppMcpExperienceFrame` over the shipped FP-0091 components.
- [x] 2026-05-09T22:30:00Z - Added component tests for AppShell-only main landmarks, unique section names, logical heading order, refusal text labels, `aria-busy`, no forbidden controls, contrast/token posture, responsive structure, raw/private field rejection, and no advice-like/action copy.
- [x] 2026-05-09T22:30:00Z - Updated the V2F/V2G proof-gate bridge so exactly this FP-0092 local composition/accessibility foundation is accepted, FP-0093 remains absent, FP-0091 stays component-only, and public/runtime/app-submission scope remains rejected.
- [x] 2026-05-09T22:30:00Z - Ran strict same-branch QA for routes, endpoints, schema, migrations, package scripts, eval datasets, fixtures, sample data, source packs, OpenAI API/model calls, OAuth, app submission, provider/deployment work, finance/source writes, autonomous actions, forbidden controls, raw full-text/page-dump panels, advice-like CTAs, screenshot binaries, generated image assets, and FP-0093; no out-of-scope artifacts remained.
- [x] 2026-05-09T22:30:00Z - Final validation passed before closeout docs: `git diff --check`, all seven direct proof gates, full web vitest, web typecheck, focused V2F/V2G domain specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-05-09T22:30:00Z - Closed FP-0092 as shipped and refreshed only directly stale active boundary docs to point at the new local composition/accessibility foundation.

## Surprises & Discoveries

Baseline V2F/V2G gates still prove FP-0092 absence after shipped FP-0091. That is correct pre-edit behavior. This slice must replace the hard FP-0092 absence posture with an exact FP-0092 local UI composition/accessibility boundary while keeping FP-0093 absent.

No new official web research was needed before implementation. FP-0092 inherits the official OpenAI and Apple source context recorded in shipped FP-0090 for app/UI/security/accessibility posture. Repo truth, shipped Finance Plans, current code, and local proof gates remain the implementation authority.

## Decision Log

Decision: FP-0092 is a real UI implementation slice, but only for local component composition and accessibility hardening.
Rationale: PR #251 is merged, FP-0091 shipped the local component foundation, required proof gates passed before edits, and the next work can stay inside `apps/web/components/read-only-app-mcp/**` without adding routes, endpoints, data files, app runtime, Apps SDK resources, OAuth, submission, model calls, source mutation, or finance writes.

Decision: FP-0092 must add heading-level control and scoped section IDs.
Rationale: shipped FP-0091 components are reusable, but nested composition needs coherent heading hierarchy and repeated panels need non-colliding accessible names.

Decision: FP-0092 uses component tests and DOM/style assertions only.
Rationale: this slice must not generate screenshot binaries, public assets, fixtures, sample data, eval datasets, public source packs, or app-submission artifacts.

Decision: no replay event is added.
Rationale: this slice changes local components, tests, docs, and proof-gate validation only. It does not change product runtime state, mission state, source state, reports, approvals, or evidence artifacts.

## Context and Orientation

FP-0091 shipped the first local/proof-only/read-only premium UI component foundation under `apps/web/components/read-only-app-mcp/**`. FP-0092 composes and hardens that surface. It does not open a public app, Apps SDK iframe/UI resources, route wiring, endpoint wiring, OAuth, submission, OpenAI API/model use, provider/certification/deployment work, external communications, source mutation, finance writes, generated product prose, runtime-Codex finance output, or autonomous action.

Official web/plugin research used in this slice:

- No new official web research was used.
- No OpenAI API key was created or used.
- No OpenAI API/model call was made.
- No Build Web Apps, Figma, app-submission, design-generation, artifact-upload, dependency-installation, or public-asset plugin workflow was used.

## Plan of Work

Allowed files for this slice:

- `plans/FP-0092-read-only-chatgpt-app-mcp-premium-ui-composition-accessibility-foundation.md`
- `apps/web/components/read-only-app-mcp/**`
- `apps/web/components/read-only-app-mcp/**/*.spec.tsx`
- `apps/web/components/read-only-app-mcp/**/*.test.tsx`
- `apps/web/lib/read-only-app-mcp-ui.ts` only if a tiny pure helper is required
- `packages/domain/src/read-only-app-mcp*.ts` only for proof-gate fields or direct proof compatibility
- `packages/domain/src/benchmark-community*.ts` only for proof-gate fields or direct proof compatibility
- `packages/domain/src/read-only-app-mcp*.spec.ts` only for proof-gate tests
- `packages/domain/src/benchmark-community*.spec.ts` only for proof-gate tests
- `tools/read-only-mcp-descriptor-response-envelope-proof.mjs`
- `tools/read-only-chatgpt-app-mcp-proof.mjs`
- `tools/benchmark-community-pack-proof.mjs`
- directly stale active docs and tiny FP-0091 shipped-state wording if required

Forbidden behavior:

- no app routes
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
- no FP-0093
- no public app implementation
- no OpenAI API/model calls
- no provider/certification/deployment/external communications
- no source mutation
- no finance writes
- no generated product prose or runtime-Codex finance output
- no autonomous action
- no screenshot binaries, generated images, public listing assets, or app-submission assets

Implementation goals:

- add a composed local preview component such as `ReadOnlyAppMcpEnvelopePreview` or `ReadOnlyAppMcpExperienceFrame`
- add heading-level control for nested panels
- add stable section IDs or a scoped ID helper so repeated panels cannot collide
- add accessibility tests for landmarks, unique accessible names, heading order, refusal labels, loading `aria-busy`, and absence of forbidden controls
- add design token/contrast tests for normal-text foreground/background pairs where feasible
- add responsive narrow/wide structure tests using DOM/style assertions only
- add raw/private field negative tests for raw full text and page-dump aliases
- add copy review assertions that avoid advice-like CTAs, generated finance advice, and forbidden action prompts
- update the proof-gate bridge so exactly one FP-0092 local composition/accessibility foundation file is accepted while FP-0093 remains absent

## Validation and Acceptance

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

- exactly one FP-0092 file exists at `plans/FP-0092-read-only-chatgpt-app-mcp-premium-ui-composition-accessibility-foundation.md`
- FP-0093 remains absent
- FP-0092 proof gates accept only local read-only UI composition/accessibility hardening
- existing FP-0091 local component boundary remains intact
- existing FP-0090/FP-0089/FP-0088 docs-only boundaries remain intact
- existing FP-0087 typed boundary remains intact
- public app implementation and public app submission remain future-only

## Idempotence and Recovery

Rerunning this slice should find this exact FP-0092 file and update it rather than creating another FP-0092 or FP-0093.

If proof gates fail because FP-0092 is present, patch only the proof-gate bridge so the exact local composition/accessibility plan is accepted. Do not widen into route, endpoint, public app, Apps SDK iframe/UI, OAuth, submission, remote MCP, provider, deployment, OpenAI API/model, source mutation, or finance-write behavior.

If component validation fails, patch only `apps/web/components/read-only-app-mcp/**` or the minimal proof/spec bridge that owns the failure.

If validation fails after a correction, report the exact failing command and recommend the smallest safer corrective slice:

- FP-0092 local UI composition/accessibility correction
- FP-0091 local UI component correction
- FP-0090 proof-boundary correction
- V2G descriptor/envelope proof correction
- hold route/public app work until local UI accessibility can be proven

## Artifacts and Notes

This plan records no new source files, sample data, fixtures, eval datasets, screenshots, generated images, public listing assets, app submission materials, app metadata, OAuth material, endpoints, routes, provider credentials, deployment artifacts, real finance data, or public source packs.

Component tests use in-memory examples only. Those examples are synthetic proof objects and not finance source truth.

## Outcomes & Retrospective

Outcome: shipped.

Validation outcome: green through final validation, clean-worktree reproduction, and the post-document minimum gate (`git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm ci:repro:current`) before merge.

Scope outcome must remain: local UI composition/accessibility hardening only; no app routes, API routes, backend routes, endpoints, remote MCP server, Apps SDK iframe/UI resource registration, OAuth, app submission, schema, migration, package script, smoke alias, eval dataset, fixture, sample data, public demo data, source pack, OpenAI API/model call, vector/file-search, OCR, PageIndex, provider/certification/delivery/deployment, external communication, source mutation, finance write, generated product prose, runtime-Codex finance output, autonomous action, FP-0093, or public app implementation.
