# Close public repo hygiene and V2 transition

## Purpose / Big Picture

This is the shipped Finance Plan record for the Pocket CFO F11 public repo hygiene and V2 transition slice.
The target phase is `F11`, and the slice is exactly `F11-public-repo-hygiene-and-v2-transition`.

F11 is docs-only public repo hygiene.
It rewrites the root README as a human-facing public OSS landing page, creates a Codex/operator guide, moves shipped-state detail into a project-state doc, frames the V2 boundary, refreshes active-doc pointers, and cleans stale public-facing Pocket CTO wording where it could confuse Pocket CFO direction.

F11 is not V2 feature implementation.
It adds no product runtime behavior, code, UI, backend route, web API route, schema, migration, package script, smoke alias, eval dataset, fixture, implementation scaffold, monitor family, discovery family, provider integration, certification, deployment, external communication, source mutation, finance write, generated product prose, or autonomous action.

GitHub connector work is explicitly out of scope.
Do not invoke GitHub Connector Guard for F11 unless a later task explicitly touches GitHub connector behavior.

## Progress

- [x] 2026-05-07T13:26:18Z Created FP-0078 as the active implementation-ready F11 contract and refreshed adjacent active docs/roadmap only, without code, runtime behavior, package-scope rename, provider integration, certification, deployment, external communications, or FP-0079.
- [x] 2026-05-07T14:44:31Z Re-invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-05-07T14:44:31Z Ran preflight against fetched `origin/main`, confirmed branch `codex/f11-public-repo-hygiene-and-v2-transition-implementation-local-v1`, confirmed local `HEAD` matched `origin/main`, confirmed a clean worktree before edits, confirmed GitHub auth/repo access, confirmed Docker Postgres and object storage were up, confirmed FP-0078 existed on `origin/main`, and confirmed no FP-0079 existed.
- [x] 2026-05-07T14:44:31Z Read FP-0078, README, START_HERE, ACTIVE_DOCS, AGENTS, PLANS, WORKFLOW, ROADMAP, shipped FP-0077/F10, package scripts, local-dev, source-ingest/CFO Wiki, Codex App Server, benchmark, and eval docs.
- [x] 2026-05-07T14:44:31Z Inventoried active/public docs for stale Pocket CTO, `pocket-cto`, `@pocket-cto`, GitHub-first, engineering-first, PR/diff/test-report product-center, engineering blast-radius, FP-0078, V2, provider, certification, PDF/OCR/vector, ChatGPT App, MCP, iOS, OpenClaw, deployment, external communications, and generated-prose wording.
- [x] 2026-05-07T14:44:31Z Rewrote `README.md` as a human-facing landing page that can be read quickly and no longer carries the full shipped FP ledger.
- [x] 2026-05-07T14:44:31Z Created root `CODEX_README.md` for Codex/operator workflow, guard usage, Finance Plan lifecycle, validation ladder rules, package-scope handling, stale-doc handling, and final handoff expectations.
- [x] 2026-05-07T14:44:31Z Created `docs/PROJECT_STATE.md` for shipped-state summary, fixed monitor/discovery families, source-pack proof commands, future-only tracks, and internal scaffolding truth.
- [x] 2026-05-07T14:44:31Z Created `docs/V2_BOUNDARY.md` for V2 north star, allowed/forbidden boundaries, LLM rule, agent rule, phase sequence, distribution decisions, and transition acceptance criteria.
- [x] 2026-05-07T14:44:31Z Refreshed `START_HERE.md`, `docs/ACTIVE_DOCS.md`, `PLANS.md`, `plans/ROADMAP.md`, `docs/ops/local-dev.md`, `docs/ops/source-ingest-and-cfo-wiki.md`, `docs/ops/codex-app-server.md`, `docs/benchmarks/seeded-missions.md`, and `evals/README.md` only where directly stale for F11/V2 transition, public/Codex doc split, or active-vs-historical wording.
- [x] 2026-05-07T14:44:31Z Preserved internal `@pocket-cto/*` package scope, root package name `pocket-cto`, GitHub modules, engineering-twin modules, package scripts, source-pack fixtures, proof tools, runtime code, routes, schema, migrations, UI, eval datasets, and smoke aliases.
- [x] 2026-05-07T14:44:31Z First validation attempt passed commands 1 through 30, then failed command 31 because `docs/ACTIVE_DOCS.md` no longer named the archived M3 exit report path expected by `src/modules/missions/m3-closeout-docs.spec.ts`; corrected the active-doc archive boundary.
- [x] 2026-05-07T14:44:31Z Second validation attempt passed commands 1 through 30, then failed command 31 because the same guard spec expected the exact phrase `reference-only`; corrected the active-doc archive boundary wording.
- [x] 2026-05-07T14:44:31Z Final full 36-command validation ladder passed serially with logs under `/tmp/pocket-cfo-f11-validation.20260507T144117Z.86576`.
- [x] 2026-05-07T14:44:31Z Closed this FP-0078 record after validation as the shipped F11 public repo hygiene and V2 transition record. F12 manual UI/demo-readiness audit, V2A EvidenceIndex, F6V provider integration, F6X certification, deeper PDF/OCR/vector search, ChatGPT App/MCP, iOS, OpenClaw, deployment, external communications, and later work remain future-plan-only.

## Surprises & Discoveries

The root README was truthful but too ledger-heavy for a public repository landing page.
It mixed product definition, shipped-state history, operator instructions, and detailed plan records in one place.
F11 moved the detailed shipped-state role to `docs/PROJECT_STATE.md` and kept README focused on product comprehension.

No root `CODEX_README.md`, `docs/PROJECT_STATE.md`, or `docs/V2_BOUNDARY.md` existed before F11 implementation.
Creating those files was the cleanest way to split human, operator, state, and V2-boundary concerns without touching runtime code.

Active docs still needed explicit historical Pocket CTO archive references for existing guard specs.
The first two validation failures were caused by over-compressing `docs/ACTIVE_DOCS.md`; the narrow correction restored explicit `docs/archive/pocket-cto/ops/m3-exit-report.md`, `docs/archive/pocket-cto/plans/EP-*.md`, `reference-only`, and `archived` wording.

The stale wording inventory found that many `pocket-cto` and `@pocket-cto` hits are valid internal scaffolding.
F11 documents those names as internal scaffolding and leaves the package scope and root `package.json` unchanged.

F11 found no need to start F12, V2A EvidenceIndex, F6V provider integration, F6X actual certification, deeper PDF/OCR/vector search, ChatGPT App, MCP server, iOS, OpenClaw, deployment, external communications, package renaming, or product runtime work.

## Decision Log

Decision: ship F11 as docs-only public repo hygiene and V2 transition.
Rationale: the active FP-0078 contract names README split, active-doc freshness, V2 boundary framing, and stale public wording cleanup only.

Decision: make `README.md` human-facing and move detailed shipped-state truth to `docs/PROJECT_STATE.md`.
Rationale: public readers need product definition, problem/niche, demo story, setup, validation summary, architecture, boundaries, roadmap, privacy, and license first. The full FP ledger belongs in a maintainable state doc with links to plan records.

Decision: create root `CODEX_README.md`.
Rationale: Codex/operator workflow needs active-doc order, Finance Plan lifecycle, guard selection, validation discipline, stale-doc handling, package-scope rules, and final handoff expectations without overloading the public README.

Decision: create `docs/V2_BOUNDARY.md`.
Rationale: V2 needs a durable authority and safety contract before any EvidenceIndex, agent, MCP, ChatGPT App, UI, LLM orchestration, or distribution work starts.

Decision: keep `@pocket-cto/*` and root `pocket-cto` unchanged.
Rationale: those names remain internal scaffolding. Renaming package scopes, imports, service names, database names, or root `package.json` requires a dedicated future plan.

Decision: keep GitHub and engineering-twin modules in place.
Rationale: F11 is public documentation hygiene, not a module deletion or product-boundary migration.

Decision: do not create FP-0079.
Rationale: F11 closes FP-0078 only. The recommended next slice is F12 manual UI/demo-readiness audit, but it must wait for a future Finance Plan.

Decision: fix validation failures only by restoring active-doc archive-boundary wording.
Rationale: the failures were docs assertions and the correction stayed inside already-allowed docs. No code or test changes were needed.

## Context and Orientation

Pocket CFO has shipped through F10 and now closes F11.
FP-0077 is the shipped F10/v1 public launch handoff record.
FP-0076 is the shipped F9 read-only product UI launch-polish record.
FP-0075 is the shipped F8 future-scope triage record.
FP-0074 is the shipped F7 launch-readiness record.
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

## Plan of Work

F11 was executed as a docs-only closeout:

1. Preserve shipped F10/v1 truth.
2. Rewrite README as a human-facing landing page.
3. Create Codex/operator, project-state, and V2-boundary docs.
4. Refresh active-doc pointers and roadmap sequencing.
5. Clean public-facing stale Pocket CTO wording only where allowed.
6. Validate the final docs-only tree.
7. Close this FP after validation.

No runtime implementation work was part of this plan.

## Concrete Steps

Files created:

- `CODEX_README.md`
- `docs/PROJECT_STATE.md`
- `docs/V2_BOUNDARY.md`

Files updated:

- `README.md`
- `START_HERE.md`
- `docs/ACTIVE_DOCS.md`
- `PLANS.md`
- `plans/ROADMAP.md`
- `plans/FP-0078-public-repo-hygiene-and-v2-transition.md`
- `docs/ops/local-dev.md`
- `docs/ops/source-ingest-and-cfo-wiki.md`
- `docs/ops/codex-app-server.md`
- `docs/benchmarks/seeded-missions.md`
- `evals/README.md`

F11 did not edit code, UI, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, proof tools, source-pack manifests, package scopes, root `package.json`, GitHub modules, engineering-twin modules, or runtime-Codex behavior.

## Validation and Acceptance

Final validation passed on 2026-05-07 with logs under `/tmp/pocket-cfo-f11-validation.20260507T144117Z.86576`.

The full serial ladder passed:

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

Earlier validation attempts failed at command 31 only:

- `/tmp/pocket-cfo-f11-validation.20260507T143839Z.82203`: missing explicit archived M3 exit-report path in `docs/ACTIVE_DOCS.md`.
- `/tmp/pocket-cfo-f11-validation.20260507T144005Z.84479`: missing exact `reference-only` wording in `docs/ACTIVE_DOCS.md`.

Both failures were corrected with narrow active-doc boundary wording only. No code or test files were changed.

Acceptance is met:

- README is human-facing and no longer carries the full FP ledger.
- `CODEX_README.md`, `docs/PROJECT_STATE.md`, and `docs/V2_BOUNDARY.md` exist and are linked from active docs.
- active docs and roadmap keep F12/V2A/later tracks future-plan-only.
- stale Pocket CTO wording in active/public docs is clarified as historical or internal scaffolding.
- `@pocket-cto/*` and root `pocket-cto` remain unchanged.
- GitHub modules and engineering-twin modules remain in place.
- no FP-0079 exists.
- final validation passed.

## Idempotence and Recovery

F11 is retry-safe because it is docs-only.
If a future docs correction is needed, patch only the directly stale active doc and rerun the relevant validation ladder.

Do not use F11 as permission to add product runtime behavior, routes, schema, UI, package scripts, smoke aliases, eval datasets, fixtures, provider integration, certification, deployment, external communications, package-scope renames, source mutation, finance writes, generated product prose, or autonomous action.

Replay implication for F11 is explicit absence.
Docs-only edits create no mission replay events.
Validation may create local proof setup state in the development database, but F11 adds no mission replay events, monitor result semantics, report artifacts, approvals, release/circulation records, delivery/outbox/provider records, certification records, source mutation behavior, finance writes, or autonomous-action records.

## Artifacts and Notes

Artifacts created by F11:

- human-facing `README.md`
- root `CODEX_README.md`
- `docs/PROJECT_STATE.md`
- `docs/V2_BOUNDARY.md`
- refreshed active docs and roadmap
- final validation logs under `/tmp/pocket-cfo-f11-validation.20260507T144117Z.86576`

Artifacts intentionally not created:

- code artifacts
- migration artifacts
- package scripts
- smoke aliases
- eval datasets
- fixtures
- provider configuration
- outbox behavior
- UI screens or action controls
- approval workflows
- report-release or report-circulation behavior
- certification artifacts
- close-complete artifacts
- deployment artifacts
- external communication artifacts
- source mutations
- finance writes
- autonomous actions

## Interfaces and Dependencies

F11 depends on existing runtime surfaces only as shipped-truth context.
It changes documentation only.

Internal package scope remains `@pocket-cto/*`.
The root package name remains `pocket-cto`.
Those names are implementation scaffolding and must not be renamed without a dedicated future plan.

The Codex App Server remains a narrow runtime seam.
F11 does not add runtime-Codex finance actions, ChatGPT App implementation, MCP server implementation, public launch drafting, launch announcements, generated launch copy, notification prose, external communication prose, generated report prose, generated advice, or finance-action instructions.

No new environment variables are added.
No GitHub connector behavior is changed.
GitHub remains an optional connector path, not the product center.

## Outcomes & Retrospective

F11 shipped the public repo hygiene and V2 transition closeout.
FP-0078 is now the shipped F11 record.

The repo now has a clear split:

- `README.md` for humans
- `CODEX_README.md` for Codex/operator workflow
- `docs/PROJECT_STATE.md` for shipped-state truth
- `docs/V2_BOUNDARY.md` for V2 authority and safety boundaries

The full validation ladder passed after two narrow active-doc boundary corrections.
The final passing log directory is `/tmp/pocket-cfo-f11-validation.20260507T144117Z.86576`.

No product runtime behavior, code, UI, route, schema, migration, package script, smoke alias, eval dataset, fixture, monitor family, discovery family, provider integration, certification, delivery, deployment, external communication, package-scope rename, GitHub module deletion, engineering-twin module deletion, source mutation, finance write, generated product prose, or autonomous action was added.

No FP-0079 was created.

The exact next recommendation is F12 manual UI/demo-readiness audit, but only after a new Finance Plan is created for that slice.
Do not start V2A EvidenceIndex, F6V provider integration, F6X certification, deeper PDF/OCR/vector search, ChatGPT App/MCP, iOS, OpenClaw, deployment, or external communications before future plans name exact scope.
