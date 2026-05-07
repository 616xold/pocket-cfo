# Plan public repo hygiene and V2 transition

## Purpose / Big Picture

This is the active Finance Plan contract for the Pocket CFO F11 public repo hygiene and V2 transition slice.
The target phase is `F11`, and the slice is exactly `F11-public-repo-hygiene-and-v2-transition`.

The user-visible goal is narrow: after shipped F10/v1 public launch handoff, Pocket CFO needs one public repo hygiene and V2 transition plan that makes the repository easier for humans and future Codex threads to understand without changing product runtime behavior.
F11 is not V2 feature implementation.
F11 is public repo hygiene, README split planning, V2 transition framing, active-doc freshness, and public-facing stale wording cleanup only.

This plan was created because repo truth supports it: FP-0077 is the shipped F10/v1 public launch handoff record, FP-0076 is the shipped F9 read-only product UI launch-polish record, FP-0075 is the shipped F8 future-scope triage record, FP-0074 is the shipped F7 launch-readiness record, FP-0073 is the shipped F6Z final F6/v1 exit audit and handoff record, FP-0050 through FP-0073 remain shipped F6 records, shipped monitor and finance-discovery family lists remain fixed, and no FP-0078 existed before this slice.

This planning slice does not start F11 implementation.
It creates the implementation-ready F11 contract, refreshes only directly adjacent active docs, updates the roadmap, and keeps all runtime/product behavior unchanged.

GitHub connector work is explicitly out of scope.
Do not invoke GitHub Connector Guard for F11 unless a later task explicitly touches GitHub connector behavior.

## Progress

- [x] 2026-05-07T13:26:18Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-05-07T13:26:18Z Ran preflight against fetched `origin/main`, confirmed branch `codex/f11-public-repo-hygiene-and-v2-transition-master-plan-local-v1`, confirmed local `HEAD` matched `origin/main`, confirmed a clean worktree before edits, confirmed GitHub auth/repo access, confirmed Docker Postgres plus object storage were up, confirmed FP-0077 exists on `origin/main`, and confirmed FP-0078 was absent.
- [x] 2026-05-07T13:26:18Z Read the active doc spine, AGENTS, PLANS, WORKFLOW, ROADMAP, shipped FP-0077/F10, shipped FP-0076/F9, shipped FP-0075/F8, shipped FP-0074/F7, shipped FP-0073/F6Z, package scripts, local-dev/source-ingest/Codex App Server/benchmark/eval docs, app/web surfaces, and the source, CFO Wiki, Finance Twin, monitoring, close/control, delivery-readiness, provider-boundary, certification-boundary, human-confirmation, certification-safety, reporting, approvals, outbox, and proof-boundary modules.
- [x] 2026-05-07T13:26:18Z Ran the required pre-write search for FP-0078, CODEX_README, CODEX_OPERATING_MANUAL, PROJECT_STATE, SHIPPED_RECORDS, V2_BOUNDARY, Pocket CTO, pocket-cto, @pocket-cto, GitHub-first, engineering-first, public launch implementation, provider integration, actual certification, PDF/OCR/vector implementation, ChatGPT App, MCP, iOS, and OpenClaw.
- [x] 2026-05-07T13:26:18Z Decided repo truth supports creating this FP-0078 F11 public repo hygiene and V2 transition plan now, because the work can stay docs-and-plan only and does not require runtime/product behavior, package-scope rename, GitHub module deletion, engineering-twin deletion, provider integration, certification, PDF/OCR/vector implementation, EvidenceIndex implementation, ChatGPT App, MCP server, iOS, OpenClaw, deployment, or external communications.
- [x] 2026-05-07T13:26:18Z Created this FP-0078 active plan and refreshed only directly adjacent active docs plus ROADMAP without creating CODEX_README.md, docs/PROJECT_STATE.md, docs/V2_BOUNDARY.md, FP-0079, implementation scaffolding, code, UI, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, product runtime behavior, source mutation, finance writes, generated prose, or autonomous action.
- [x] 2026-05-07T13:40:21Z Ran the full required validation ladder serially after preparing local DB state with existing repo commands. The first validation attempt found the local default database schema missing, and the second found the test database missing; after `pnpm db:migrate`, `pnpm db:prepare:ci`, and `pnpm run db:migrate:ci`, the full 36-command ladder passed with logs under `/tmp/pocket-cfo-f11-validation.20260507T133716Z.54658`.
- [ ] Future F11 implementation: rewrite the root README into a human-facing public OSS landing page, create root CODEX_README.md, create docs/PROJECT_STATE.md, create docs/V2_BOUNDARY.md, refresh active-doc pointers, and clean only allowed public-facing stale Pocket CTO wording.
- [ ] Future F11 closeout: update this Progress section, Surprises & Discoveries, Decision Log, Validation and Acceptance, Artifacts and Notes, and Outcomes & Retrospective; run the required validation ladder; then decide whether F12 manual UI/demo-readiness audit or another narrower docs correction should happen before V2A planning.

## Surprises & Discoveries

The root README remains truthful but too ledger-heavy for a public repository landing page.
It currently carries a giant shipped-state record that is better suited for `docs/PROJECT_STATE.md` once F11 implementation starts.

No CODEX_README.md, docs/PROJECT_STATE.md, docs/V2_BOUNDARY.md, or SHIPPED_RECORDS.md exists yet.
That supports an F11 implementation focused on splitting human-facing and Codex-facing documentation instead of changing product runtime behavior.

The required search found active/product-surface stale wording candidates, most notably `apps/web/components/mission-card.tsx` still saying "GitHub-first evidence package" in one proof-bundle fallback.
Because this plan-and-doc slice must not touch UI or product runtime files, that hit is classified as active product-facing stale wording for a later UI/demo-readiness or explicitly scoped docs/copy slice, not as a behavior leak blocking FP-0078.

The many `@pocket-cto`, `pocket-cto`, and root package-name hits are valid internal scaffolding.
They include package scopes, import paths, internal URIs, S3 test refs, service names, and legacy engineering-twin/GitHub modules.
F11 must not rename them.

Pocket CTO, GitHub-first, and engineering-first hits in archive, architecture, ADR, and historical plan files are historical/reference-only or future inventory inputs.
F11 must clarify active-vs-archive boundaries instead of broadly rewriting history.

The required search found no active ChatGPT App, MCP, iOS, or OpenClaw implementation.
Those may be named only as later candidate tracks and must stay future-only in F11.

The first validation attempts exposed local database setup gaps rather than product regressions.
The default database was missing migrated tables, and the test database did not exist.
Running the existing repo setup commands `pnpm db:migrate`, `pnpm db:prepare:ci`, and `pnpm run db:migrate:ci` restored local validation posture before the final full ladder passed.

## Decision Log

Decision: create `plans/FP-0078-public-repo-hygiene-and-v2-transition.md` as the active F11 contract.
Rationale: FP-0077 is shipped, no FP-0078 or later active plan exists, current docs support F10 as shipped, and the next safe slice can remain docs-and-plan only.

Decision: F11 is not V2 feature implementation.
Rationale: F11 exists to clean public repo comprehension, split README/Codex guidance, document V2 boundaries, update the roadmap, and plan stale wording cleanup. It must not add EvidenceIndex, document-map, document precision, agent, MCP, ChatGPT App, iOS, OpenClaw, provider, certification, deployment, or product runtime behavior.

Decision: F11 is not provider integration.
Rationale: F6V remains future-plan-only until a later plan proves provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, credential boundaries, provider-job boundaries, outbox boundaries, and no autonomous send.

Decision: F11 is not certification.
Rationale: F6X remains future-plan-only until a later plan proves operator need, legal boundaries, evidence boundaries, review gates, assurance constraints, non-advice constraints, and non-legal-opinion boundaries.

Decision: F11 is not PDF/OCR/vector or EvidenceIndex implementation.
Rationale: deeper document precision, EvidenceIndex, and document maps may be planned as the next V2A candidate only after F11 and a manual UI/demo-readiness audit demonstrate the exact evidence gap. No EvidenceIndex schema, route, adapter, dataset, fixture, or implementation scaffold belongs in F11.

Decision: F11 is not ChatGPT App, MCP, iOS, or OpenClaw.
Rationale: those may be later candidate tracks only. F11 must not add ChatGPT App implementation, MCP server implementation, iOS implementation, OpenClaw integration, deployment, or external communications.

Decision: F11 must split public-facing and Codex-facing docs.
Rationale: the current README mixes a human public landing page with a shipped-plan ledger and Codex operating instructions. F11 implementation should plan and create a human-facing `README.md`, root `CODEX_README.md`, `docs/PROJECT_STATE.md`, and `docs/V2_BOUNDARY.md`.

Decision: F11 must move the giant shipped-state ledger out of README.
Rationale: public OSS readers need product definition, proof posture, setup, validation, architecture, safety boundaries, roadmap, and privacy warnings. The full FP ledger belongs in `docs/PROJECT_STATE.md` with links to plan records, not in the root README.

Decision: F11 must preserve internal package scaffolding.
Rationale: `package.json`, `@pocket-cto/*` package scopes, imports, database names, internal URIs, service names, and scripts are working scaffolding. A future dedicated rename plan must prove safety before touching them.

Decision: F11 must clean only product-facing stale Pocket CTO wording inside allowed docs and public-facing product text.
Rationale: stale product direction should not confuse Pocket CFO public comprehension, but archived history, ADRs, historical plans, GitHub modules, and engineering-twin modules must not be broadly rewritten or deleted.

Decision: F11 must update the roadmap with post-F10 and V2 transition sequencing.
Rationale: future Codex threads need a named order: F11, F12, V2A, V2B, V2C, V2D, V2E, V2F, and V2G, without creating FP-0079 or implementing later phases.

Decision: likely later candidate slices are named but not created here.
Rationale: likely next records are F11 implementation/public repo hygiene closeout, F12 manual UI/demo-readiness audit, and V2A EvidenceIndex and document-map master plan. No FP-0079 is created in this slice.

## Context and Orientation

Pocket CFO has shipped through F10.
FP-0077 is the shipped F10/v1 public launch handoff record and is docs-and-validation-only.
FP-0076 is the shipped F9 product UI launch-polish record, limited to read-only app/web navigation, copy, warning, and status-surface truthfulness.
FP-0075 is the shipped F8/v1 future-scope triage and roadmap-hardening record.
FP-0074 is the shipped F7/v1 launch-readiness and active-doc hardening record.
FP-0073 is the shipped F6Z final F6/v1 exit audit and handoff record.
FP-0050 through FP-0073 remain shipped F6 records.

The shipped monitor families remain exactly:

- `cash_posture`
- `collections_pressure`
- `payables_pressure`
- `policy_covenant_threshold`

The shipped finance-discovery families remain exactly:

- `cash_posture`
- `collections_pressure`
- `payables_pressure`
- `spend_posture`
- `obligation_calendar_review`
- `policy_lookup`

The authority model remains fixed:

- raw sources are authoritative for document claims
- the Finance Twin is authoritative for structured finance facts
- the CFO Wiki is compiled and derived from raw-source metadata, deterministic document extracts, and Finance Twin state
- mission outputs, reports, approvals, readiness surfaces, and proof bundles must expose provenance, freshness posture, limitations, and absence boundaries where relevant

F11 depends on existing source registry, Finance Twin, CFO Wiki, monitoring, close/control, delivery-readiness, provider-boundary, certification-boundary, human-confirmation, certification-safety, reporting, approvals, evidence, outbox, Codex runtime boundary, source-pack proofs, and F9 read-only UI posture as context only.
It must not change any of those runtime surfaces.

No GitHub connector work is in scope.
No new environment variables are expected.
No route, schema, migration, package script, smoke alias, eval dataset, fixture, implementation scaffold, monitor family, discovery family, product runtime behavior, provider integration, credential storage, provider job, outbox send, delivery behavior, approval workflow, report-release behavior, report-circulation behavior, payment behavior, accounting write, bank write, tax filing, legal/policy advice, collection/customer-contact instruction, actual certification, close-complete status, sign-off, attestation, legal opinion, audit opinion, assurance, generated prose, source mutation, runtime-Codex output, deployment, external communication, or autonomous action belongs in F11.

## Plan of Work

First, preserve shipped F10/v1 truth.
Keep FP-0077 as the shipped F10 record and do not rewrite shipped F6/F7/F8/F9 records except for tiny active-doc handoff clarifications if directly required.

Second, split the public and Codex documentation contracts in the future F11 implementation.
The root README should become the human-facing public repository landing page.
CODEX_README.md should become the root Codex operator guide.
docs/PROJECT_STATE.md should carry the maintainable shipped-plan/state ledger.
docs/V2_BOUNDARY.md should define the V2 safety and authority boundary.

Third, update roadmap sequencing now.
The roadmap should name the post-F10 / V2 transition track and keep all later phases future-only.
It must not create FP-0079 or implement any later phase.

Fourth, define stale-wording cleanup boundaries.
F11 implementation may inventory public/active docs and clean product-facing stale Pocket CTO wording where it confuses Pocket CFO direction.
It must not broadly rewrite archived history, delete historical docs, delete GitHub modules, delete engineering-twin modules, rename packages, rename imports, or revive Pocket CTO product assumptions as active truth.

Fifth, validate with the full docs-and-plan ladder.
Because F11 planning and future implementation are docs-focused, validation proves docs remain aligned with shipped runtime truth and fixed source/proof boundaries.

## Concrete Steps

1. Keep exactly one active F11 Finance Plan:
   - `plans/FP-0078-public-repo-hygiene-and-v2-transition.md`

2. Refresh only directly adjacent active docs in this planning slice:
   - `README.md` only for the minimal active-plan handoff note
   - `START_HERE.md` only for the minimal F11 thread/plan pointer
   - `docs/ACTIVE_DOCS.md` only for the active FP-0078 boundary
   - `plans/ROADMAP.md` for the post-F10 / V2 transition section

3. In the future F11 implementation, create or update only allowed docs:
   - `README.md`
   - `CODEX_README.md`
   - `docs/PROJECT_STATE.md`
   - `docs/V2_BOUNDARY.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `PLANS.md` only if directly stale
   - `plans/ROADMAP.md`
   - `docs/ops/local-dev.md` only if directly stale
   - `docs/ops/source-ingest-and-cfo-wiki.md` only if directly stale
   - `docs/ops/codex-app-server.md` only if directly stale
   - `docs/benchmarks/seeded-missions.md` only if directly stale
   - `evals/README.md` only if directly stale

4. Human-facing README.md strategy:
   - one-sentence product definition
   - problem/niche
   - hero demo story
   - shipped capability summary
   - what Pocket CFO is not
   - quick local setup
   - validation command summary
   - architecture overview
   - screenshots placeholder or screenshot/audit link placeholder
   - V2 roadmap summary
   - contribution/security/privacy links
   - license
   - finance-data privacy warning
   - no full shipped FP ledger

5. CODEX_README.md strategy:
   - active docs order
   - branch naming
   - Finance Plan lifecycle
   - validation ladder discipline
   - forbidden scopes
   - how to treat `@pocket-cto` internal package names
   - how to handle stale docs
   - how to avoid broad rewrites
   - how to use the repo with the Codex app

6. docs/PROJECT_STATE.md strategy:
   - move the giant shipped-plan ledger out of the root README
   - preserve current repo truth in a maintainable place
   - list shipped F1 through F10 at summary level
   - link to FP records rather than pasting every detail into README
   - preserve fixed monitor/discovery family truth
   - preserve future-only tracks

7. docs/V2_BOUNDARY.md strategy:
   - V2 north star
   - single-company / single-trust-boundary
   - finance evidence first
   - raw sources authoritative for document claims
   - Finance Twin authoritative for structured finance facts
   - CFO Wiki compiled/derived
   - no autonomous bank/accounting/tax/legal/provider/delivery/certification actions
   - LLM may navigate/summarize under evidence contracts only
   - agents get read-only structured tools first
   - provider/certification/PDF/OCR/vector/ChatGPT App/iOS/OpenClaw/deployment remain future-only

8. Product-facing stale Pocket CTO cleanup strategy:
   - inventory public/active docs only
   - clarify Pocket CTO history as archived/reference-only
   - do not rewrite archived historical plans except active-doc boundary notes if directly needed
   - do not delete historical docs
   - do not delete GitHub modules or engineering-twin modules
   - do not rename `package.json`, `@pocket-cto` scopes, imports, database names, service names, scripts, or internal URIs
   - do not revive Pocket CTO product assumptions as active truth

9. Roadmap update requirements:
   - F11 public repo hygiene and V2 transition
   - F12 manual UI and demo-readiness audit
   - V2A EvidenceIndex and document-map foundation
   - V2B document precision adapters
   - V2C read-only agent/MCP/ChatGPT Evidence App alpha
   - V2D Evidence Atlas UI
   - V2E bounded LLM orchestration
   - V2F benchmark/community pack
   - V2G optional distribution tracks

10. Do not edit product runtime code.
    Specifically do not add or change code, UI, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, implementation scaffolding, source-pack manifests, proof tools, monitor evaluators, discovery families, monitor families, mission behavior, runtime-Codex behavior, provider integrations, credentials, provider jobs, outbox send behavior, approval workflows, report-release behavior, report-circulation behavior, certification behavior, close-complete behavior, source mutation behavior, finance writes, generated product prose, deployment behavior, external communications, or autonomous actions.

11. Do not create FP-0079 in this slice.
    Later candidate slices may be named only as candidates.

## Validation and Acceptance

Run DB-backed smokes serially:

- `pnpm exec tsx tools/board-lender-document-source-pack-proof.mjs`
- `pnpm exec tsx tools/policy-covenant-document-source-pack-proof.mjs`
- `pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs`
- `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
- `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`
- `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`
- `pnpm smoke:cfo-wiki-foundation:local`
- `pnpm smoke:cfo-wiki-document-pages:local`
- `pnpm smoke:cfo-wiki-lint-export:local`
- `pnpm smoke:cfo-wiki-concept-metric-policy:local`
- `pnpm smoke:finance-twin-account-catalog:local`
- `pnpm smoke:finance-twin-general-ledger:local`
- `pnpm smoke:finance-twin:local`
- `pnpm smoke:finance-twin-reconciliation:local`
- `pnpm smoke:finance-twin-account-bridge:local`
- `pnpm smoke:finance-twin-balance-bridge-prerequisites:local`
- `pnpm smoke:finance-twin-balance-proof-lineage:local`
- `pnpm smoke:finance-twin-period-context:local`
- `pnpm smoke:finance-twin-source-backed-balance-proof:local`
- `pnpm smoke:finance-policy-lookup:local`
- `pnpm smoke:policy-covenant-threshold-monitor:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm smoke:delivery-readiness:local`
- `pnpm smoke:operator-readiness:local`
- `pnpm smoke:close-control-acknowledgement:local`
- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:finance-discovery-supported-families:local`
- `pnpm --filter @pocket-cto/web exec vitest run`
- `pnpm --filter @pocket-cto/web typecheck`
- `pnpm --filter @pocket-cto/domain exec vitest run src/cfo-wiki.spec.ts src/source-registry.spec.ts src/finance-twin.spec.ts src/monitoring.spec.ts src/close-control.spec.ts src/close-control-certification-safety.spec.ts src/external-delivery-human-confirmation-boundary.spec.ts src/close-control-certification-boundary.spec.ts src/external-provider-boundary.spec.ts src/close-control-review-summary.spec.ts src/delivery-readiness.spec.ts src/proof-bundle.spec.ts`
- `zsh -lc "cd apps/control-plane && pnpm exec vitest run src/modules/wiki/**/*.spec.ts src/modules/sources/**/*.spec.ts src/modules/finance-twin/**/*.spec.ts src/modules/finance-discovery/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/close-control-certification-safety/**/*.spec.ts src/modules/external-delivery-human-confirmation-boundary/**/*.spec.ts src/modules/close-control-certification-boundary/**/*.spec.ts src/modules/external-provider-boundary/**/*.spec.ts src/modules/close-control-review-summary/**/*.spec.ts src/modules/delivery-readiness/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/modules/reporting/**/*.spec.ts src/app.spec.ts"`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Acceptance for this planning slice requires:

- exactly one FP-0078 file exists: `plans/FP-0078-public-repo-hygiene-and-v2-transition.md`
- no FP-0079 exists
- FP-0078 is active and implementation-ready, not shipped
- FP-0077 remains the shipped F10/v1 public launch handoff record
- FP-0076 remains the shipped F9 read-only product UI launch-polish record
- FP-0075 remains the shipped F8/v1 future-scope triage record
- FP-0074 remains the shipped F7 record
- FP-0050 through FP-0073 remain shipped F6 records
- F11 remains docs-and-plan only in this thread
- no CODEX_README.md, docs/PROJECT_STATE.md, docs/V2_BOUNDARY.md, code, UI, route, schema, migration, package script, smoke alias, eval dataset, fixture, implementation scaffold, monitor family, discovery family, runtime behavior, provider behavior, certification behavior, deployment behavior, external communication, source mutation, finance write, generated prose, or autonomous action is created in this planning slice
- roadmap names the post-F10 / V2 transition order without implementing later phases
- shipped monitor families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`
- shipped discovery families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, `spend_posture`, `obligation_calendar_review`, and `policy_lookup`
- F6V provider integration, F6X actual certification, deeper PDF/OCR/vector search, EvidenceIndex implementation, ChatGPT App/MCP, iOS, OpenClaw, deployment/external communications, and later work remain future-plan-only
- full validation passes on the final docs-and-plan tree

Final validation passed on 2026-05-07 after local DB preparation.
The passing log directory is `/tmp/pocket-cfo-f11-validation.20260507T133716Z.54658`.
Earlier setup failures are recorded under `/tmp/pocket-cfo-f11-validation.20260507T133525Z.52601` and `/tmp/pocket-cfo-f11-validation.20260507T133554Z.52825`; both failed before product assertions because local database state was not prepared.

## Idempotence and Recovery

This slice is retry-safe because it is docs-and-plan only.
If validation fails, do not create product behavior to make it pass.
Record the failing command, keep the log path, and recommend the smallest corrective planning slice.

If a docs edit proves too broad, revert only that docs edit and keep this FP-0078 contract focused.
Do not delete shipped FP-0050 through FP-0077 records.
Do not delete GitHub modules, engineering-twin modules, source-pack fixtures, proof tools, reporting modules, approval modules, outbox placeholders, runtime-Codex transport code, package scopes, imports, or historical Pocket CTO records.

Replay implication for F11 planning is explicit absence.
Docs-and-plan edits create no mission replay events.
The validation ladder may create local proof setup state in the development database, but F11 planning must not add mission replay events, monitor result semantics, report artifacts, approvals, release/circulation records, delivery/outbox/provider records, certification records, generated product prose, source mutation behavior, finance writes, or autonomous-action records.

## Artifacts and Notes

Artifacts for this planning slice are:

- this active FP-0078 public repo hygiene and V2 transition plan
- minimal active-doc handoff notes
- a post-F10 / V2 transition roadmap section
- validation logs
- a final human handoff that names the branch, commit, PR, changed files, validation results, gaps, and next recommendation

Future F11 implementation artifacts are expected to be:

- human-facing `README.md`
- root `CODEX_README.md`
- `docs/PROJECT_STATE.md`
- `docs/V2_BOUNDARY.md`
- minimal active-doc freshness edits
- no full shipped FP ledger in README

This slice must not create code artifacts, migration artifacts, package scripts, smoke aliases, eval datasets, fixtures, provider configuration, outbox behavior, UI screens, approval workflows, report-release behavior, certification artifacts, close-complete artifacts, generated product prose artifacts, source mutations, finance writes, deployment artifacts, external communication artifacts, or autonomous actions.

## Interfaces and Dependencies

F11 is docs-and-plan only.
It depends on existing runtime surfaces only as shipped-truth context.

Internal package scope remains `@pocket-cto/*`.
The root package name remains `pocket-cto`.
Those names are implementation scaffolding and must not be renamed in F11.

The Codex App Server remains a narrow runtime seam.
F11 must not add runtime-Codex finance actions, public launch drafting, launch announcements, generated launch copy, notification prose, external communication prose, generated report prose, generated advice, generated customer-contact instructions, generated finance actions, or product runtime behavior.

No new environment variables are expected.
No GitHub connector work is expected.
GitHub remains an optional connector path, not the product center.

## Outcomes & Retrospective

This section is not a shipped closeout yet.
The planning slice created FP-0078 as the active implementation-ready F11 contract and updated adjacent active docs/roadmap only.
The full validation ladder passed after local DB preparation, with final logs under `/tmp/pocket-cfo-f11-validation.20260507T133716Z.54658`.

F11 implementation has not started.
V2A EvidenceIndex implementation has not started.
F12 manual UI/demo-readiness audit has not started.
F6V provider integration, F6X actual certification, deeper PDF/OCR/vector search, ChatGPT App, MCP server, iOS, OpenClaw, deployment, and external communications remain future-plan-only.

No FP-0079 was created.
