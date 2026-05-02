# Plan final F6/v1 exit audit and handoff

## Purpose / Big Picture

This is the active Finance Plan contract for the Pocket CFO F6Z final F6/v1 exit audit and handoff slice.
The target phase is `F6`, and the slice is exactly `F6Z-final-f6-v1-exit-audit-and-handoff`.

The user-visible goal is one final deterministic audit and handoff contract for shipped F6A through F6Y before any later provider, certification, launch-polish, or deeper document-precision work is considered.
F6Z is a docs-and-validation-only final audit slice.
It must not add product runtime behavior.

F6Z does not implement F6V actual provider integration.
F6V may be named only as a future plan if provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send are proven.

F6Z does not implement F6X actual certification.
F6X may be named only as a future plan if operator need, legal boundaries, evidence boundaries, review gates, assurance constraints, and non-advice constraints are proven.

Repo truth supports planning F6Z now because shipped F6L/F6O/F6R/F6U/F6W/F6Y source-pack proofs remain green, shipped F6Y truthfully labels source-coverage links to current source digests, shipped F6T certification-safety remains green and non-certifying, shipped F6S human-confirmation remains no-send/no-provider/no-outbox, shipped F6P and F6Q remain internal boundary reads only, shipped close/control surfaces remain green, monitor families remain exactly four, discovery families remain exactly six, and active docs can describe FP-0050 through FP-0072 as shipped records without starting provider or certification behavior.

GitHub connector work is explicitly out of scope.
Do not invoke GitHub Connector Guard for F6Z.

## Progress

- [x] 2026-05-02T13:03:47Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-05-02T13:03:47Z Ran preflight against fetched `origin/main`, confirmed the branch is `codex/f6z-master-plan-and-doc-refresh-local-v1`, confirmed local `HEAD` matched fetched `origin/main`, confirmed the worktree was clean before edits, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-05-02T13:03:47Z Read the active doc spine, shipped FP-0072 F6Y record, shipped FP-0071 F6W record, shipped FP-0070 F6T record, shipped FP-0069 F6U record, package scripts, shipped source-pack manifests and proofs, monitoring and discovery family contracts, source/wiki/finance-twin modules, close/control safety-boundary modules, reporting/approval/outbox boundaries, and Codex runtime guidance.
- [x] 2026-05-02T13:03:47Z Ran the F6Z readiness gate before creating this plan: all six shipped source-pack proofs passed, close/control checklist, delivery-readiness, operator-readiness, close/control acknowledgement, monitor demo replay, supported discovery families, focused domain specs, and focused control-plane specs passed.
- [x] 2026-05-02T13:03:47Z Decided F6Z is safe to plan now as one final F6/v1 exit audit and handoff slice, not one more source/evidence/certification-safety polish slice.
- [x] 2026-05-02T13:03:47Z Created this FP-0073 implementation-ready contract without adding code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, implementation scaffolding, provider integrations, credential scaffolding, outbox send behavior, UI, approval workflow, report-release behavior, certification behavior, or product runtime behavior.
- [x] 2026-05-02T13:18:15Z Refreshed only directly adjacent active docs and the FP-0072 handoff note so FP-0073 is the active F6Z final audit/handoff contract, FP-0072 remains the shipped F6Y record, F6V/F6X remain future-only, and F6Y source-digest proof posture stays attributed to source coverage rather than index posture.
- [x] 2026-05-02T13:22:44Z Ran the full final validation ladder on the docs-and-plan tree: all six source-pack proofs, DB-backed smokes, focused domain/control-plane/twin specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed.
- [ ] During F6Z implementation, perform the final F6/v1 exit audit and update this Progress section, Decision Log, and Outcomes & Retrospective without widening into runtime behavior.

## Surprises & Discoveries

The repo truth favors F6Z now rather than one more narrow source/evidence/certification-safety polish slice.
F6Y already shipped the board/lender document source-pack proof and the proof-posture polish that names `sourceCoverageLinksToCurrentSourceDigests` truthfully while keeping `indexLinksToSourceCoverage` as the index-page assertion.
Board/lender documents still create no policy pages.

The shipped safety boundary stack is strong enough for a final audit.
F6P is provider-boundary readiness, not provider integration.
F6Q is certification-boundary readiness, not certification.
F6S is human-confirmation/delivery-preflight readiness, not send, provider, outbox, approval, report release, or certification.
F6T is certification-safety/readiness, not actual certification, certified status, close complete, sign-off, attestation, assurance, legal opinion, audit opinion, approval, report release, report circulation, provider integration, delivery, runtime-Codex, generated prose, source mutation, finance write, or autonomous action.

The F6Y shipped plan still correctly says not to create FP-0073 in the F6Y implementation slice.
This F6Z planning thread is the later named Finance Plan candidate that FP-0072 deferred to; FP-0072 should remain the shipped F6Y record and should receive only a tiny handoff clarification if needed.

## Decision Log

Decision: proceed with `F6Z-final-f6-v1-exit-audit-and-handoff`.
Rationale: the readiness gate passed and no route, schema, migration, monitor evaluator, mission behavior, runtime-Codex, provider, delivery, report, approval, certification, source-pack behavior, source mutation, finance write, or autonomous action is required to define the final F6/v1 audit and handoff contract.

Decision: F6Z is a final audit/handoff slice, not a product feature slice.
Rationale: this plan is docs-and-validation only. It may update active docs and this plan, and it may run deterministic validation, but it must not add product runtime behavior.

Decision: F6Z does not implement F6V provider integration.
Rationale: F6V remains future-only until provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send are proven in a new plan.

Decision: F6Z does not implement F6X actual certification.
Rationale: F6X remains future-only until operator need, legal boundaries, evidence boundaries, review gates, assurance constraints, and non-advice constraints are proven in a new plan.

Decision: F6Z preserves shipped F6 behavior.
Rationale: no F6A/F6C/F6D/F6E monitor evaluator changes, no F6B/F6G mission handoff changes, no F6H checklist changes, no F6J readiness changes, no F6K acknowledgement changes, no F6L/F6O/F6R/F6U/F6W/F6Y source-pack behavior changes, no F6M delivery-readiness changes, no F6N review-summary changes, no F6P provider-boundary changes, no F6Q certification-boundary changes, no F6S human-confirmation changes, and no F6T certification-safety changes belong in F6Z.

Decision: later slices are named but not created here.
Rationale: likely post-F6/v1 slices include F6V actual provider integration, F6X actual certification, F7 or v1 launch polish only if a new roadmap or Finance Plan names concrete scope, and deeper document precision, PDF, OCR, or vector search only if a future plan proves a source/evidence gap. Do not create FP-0074 in this slice.

## Context and Orientation

Pocket CFO has shipped F6A through F6Y.
FP-0050 through FP-0072 are shipped F6 records.
FP-0072 is the shipped F6Y board/lender document source-pack record and must remain a historical shipped record.

The shipped source-pack foundation records and direct proofs are:

- FP-0061 / F6L: bank/card source-pack proof with `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`.
- FP-0064 / F6O: receivables/payables source-pack proof with `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`.
- FP-0067 / F6R: contract/obligation source-pack proof with `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`.
- FP-0069 / F6U: ledger/reconciliation source-pack proof with `pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs`.
- FP-0071 / F6W: policy/covenant document source-pack proof with `pnpm exec tsx tools/policy-covenant-document-source-pack-proof.mjs`.
- FP-0072 / F6Y: board/lender document source-pack proof with `pnpm exec tsx tools/board-lender-document-source-pack-proof.mjs`.

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

Relevant shipped modules for F6Z audit context are:

- `apps/control-plane/src/modules/sources/**` for source registry and immutable raw-source proof setup.
- `apps/control-plane/src/modules/wiki/**` for CFO Wiki source binding, source digest, source coverage, policy pages, board/lender document posture, and filed pages.
- `apps/control-plane/src/modules/finance-twin/**` for source-backed structured finance posture and ledger/reconciliation proof reads.
- `apps/control-plane/src/modules/monitoring/**` for the four monitor families and alert-card posture.
- `apps/control-plane/src/modules/close-control/**` for checklist posture.
- `apps/control-plane/src/modules/delivery-readiness/**`, `external-provider-boundary/**`, `close-control-certification-boundary/**`, `external-delivery-human-confirmation-boundary/**`, and `close-control-certification-safety/**` for safety-boundary posture.
- `apps/control-plane/src/modules/reporting/**`, `approvals/**`, and `outbox/**` as validation boundaries only, not F6Z implementation targets.

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No database schema migration, eval dataset, fixture, package script, smoke alias, monitor family, discovery family, report, approval, delivery behavior, provider integration, provider credential storage, provider job, outbox send, payment behavior, finance write, legal/policy advice, collection/customer-contact instruction, actual certification, close-complete status, sign-off, attestation, legal opinion, audit opinion, assurance, generated prose, or autonomous action belongs in F6Z.

## Plan of Work

First, confirm repo truth on the final F6/v1 boundary.
Run the source-pack proofs, close/control and safety-boundary smokes, focused specs, and family-boundary checks.
If any required proof fails, stop and recommend one narrow corrective slice instead of creating or executing F6Z.

Second, perform a docs-only final F6/v1 audit.
Update only directly adjacent active docs if they still imply F6Z cannot be planned after shipped FP-0072, that FP-0073 already existed before this slice, that F6V or F6X should start before the final audit, that F6T is actual certification, or that F6Y source-digest links are index posture rather than source-coverage posture.
Preserve FP-0072 as the shipped F6Y record and preserve the F6Y proof-posture polish.

Third, produce the handoff contract.
The handoff must state what shipped through F6Y, what remains absent, what proof commands passed, what future slices are allowed to consider, and what future slices remain blocked without a new plan.
The handoff must be suitable for a human to decide whether to start F6Z final audit implementation next, not F6V or F6X.

Fourth, run the full validation ladder on the final tree.
Because F6Z is docs-and-validation-only, validation proves that the documentation and plan did not drift away from shipped runtime truth.

## Concrete Steps

1. Keep the active plan as exactly this file:
   - `plans/FP-0073-final-f6-v1-exit-audit-and-handoff.md`

2. Refresh only directly adjacent active docs if needed:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - `docs/ops/local-dev.md` only if stale wording remains directly adjacent
   - `docs/ops/source-ingest-and-cfo-wiki.md` only if stale wording remains directly adjacent
   - `docs/ops/codex-app-server.md` only if stale wording remains directly adjacent
   - `docs/benchmarks/seeded-missions.md` only if stale wording remains directly adjacent
   - `evals/README.md` only if stale wording remains directly adjacent
   - `plans/FP-0072-board-lender-document-source-pack-foundation.md` only for one tiny handoff clarification if needed

3. Do not edit product runtime code.
   Specifically do not add or change routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, source-pack manifests, proof tools, monitor evaluators, mission behavior, runtime-Codex behavior, provider integrations, credentials, provider jobs, outbox send behavior, UI, approval workflows, report-release behavior, report-circulation behavior, certification behavior, close-complete behavior, source mutation behavior, finance writes, or autonomous actions.

4. Record final F6/v1 handoff facts:
   - FP-0050 through FP-0072 are shipped F6A through F6Y records.
   - F6L/F6O/F6R/F6U/F6W/F6Y direct proofs are the source-pack proof spine.
   - F6T is internal certification-safety/readiness only and non-certifying.
   - F6S is human-confirmation/delivery-preflight only and no-send/no-provider/no-outbox.
   - F6P is provider-boundary/readiness only and non-provider.
   - F6Q is certification-boundary/readiness only and non-certifying.
   - F6V provider integration and F6X actual certification remain future-only.
   - No FP-0074 is created.

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
- `pnpm --filter @pocket-cto/domain exec vitest run src/cfo-wiki.spec.ts src/source-registry.spec.ts src/finance-twin.spec.ts src/monitoring.spec.ts src/close-control.spec.ts src/close-control-certification-safety.spec.ts src/external-delivery-human-confirmation-boundary.spec.ts src/close-control-certification-boundary.spec.ts src/external-provider-boundary.spec.ts src/close-control-review-summary.spec.ts src/delivery-readiness.spec.ts src/proof-bundle.spec.ts`
- `zsh -lc "cd apps/control-plane && pnpm exec vitest run src/modules/wiki/**/*.spec.ts src/modules/sources/**/*.spec.ts src/modules/finance-twin/**/*.spec.ts src/modules/finance-discovery/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/close-control-certification-safety/**/*.spec.ts src/modules/external-delivery-human-confirmation-boundary/**/*.spec.ts src/modules/close-control-certification-boundary/**/*.spec.ts src/modules/external-provider-boundary/**/*.spec.ts src/modules/close-control-review-summary/**/*.spec.ts src/modules/delivery-readiness/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/modules/reporting/**/*.spec.ts src/app.spec.ts"`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Acceptance requires:

- exactly one new active Finance Plan exists: `plans/FP-0073-final-f6-v1-exit-audit-and-handoff.md`
- no FP-0074 exists
- F6Z is narrowed to final F6/v1 exit audit and handoff only
- active docs state FP-0050 through FP-0072 are shipped F6A through F6Y records
- active docs state FP-0073 is the implementation-ready F6Z final audit/handoff contract, not F6Z implementation
- active docs do not imply F6V provider integration or F6X actual certification should start before F6Z
- active docs do not imply F6T is actual certification
- active docs do not attribute F6Y current source-digest links to index posture
- shipped monitor families remain exactly four
- shipped discovery families remain exactly six
- validation passes on the final tree

## Idempotence and Recovery

This slice is retry-safe because it is docs-and-validation-only.
If validation fails, do not widen F6Z.
Record the failing command, keep any logs, and recommend the smallest corrective slice that restores shipped truth.

If a docs edit proves too broad, revert only that docs edit and keep FP-0073 focused.
Do not remove shipped FP-0050 through FP-0072 records.
Do not delete GitHub modules, engineering-twin modules, reporting modules, approval modules, outbox placeholders, source-pack fixtures, or proof tools.

Replay implication for F6Z is explicit absence.
The audit may run proof and smoke commands that create local proof setup state in the development database, but F6Z must not add mission replay events, monitor result semantics, report artifacts, approvals, release/circulation records, delivery/outbox/provider records, certification records, generated prose, source mutation behavior, finance writes, or autonomous-action records.

## Artifacts and Notes

Expected artifacts are:

- this active Finance Plan
- tiny active-doc freshness edits if needed
- validation logs from the readiness gate and final validation ladder
- a final human handoff that names the branch, commit, PR, changed files, validation results, gaps, and next recommendation

This slice must not create code artifacts, migration artifacts, package scripts, smoke aliases, eval datasets, fixtures, provider configuration, outbox behavior, UI screens, approval workflows, report-release behavior, certification artifacts, close-complete artifacts, generated prose artifacts, source mutations, finance writes, or autonomous actions.

## Interfaces and Dependencies

F6Z depends on shipped source registry, Finance Twin, CFO Wiki, monitoring, close/control, delivery-readiness, provider-boundary, certification-boundary, human-confirmation, certification-safety, reporting, approvals, evidence, and outbox boundary posture as validation context only.

The Codex App Server remains a narrow runtime seam.
F6Z must not add runtime-Codex monitoring behavior, acknowledgement drafting, review-summary drafting, source-pack drafting, provider-boundary drafting, certification-boundary drafting, certification-safety drafting, notification prose, external communication prose, or finance-action instructions.

Internal package scope remains `@pocket-cto/*`.
No new environment variables are expected.
No GitHub connector work is expected.

## Outcomes & Retrospective

This section will be completed when the F6Z final audit/handoff implementation slice finishes.
For this master-plan thread, the outcome is that repo truth supports creating FP-0073 as the active implementation-ready F6Z final F6/v1 exit audit and handoff contract, with final validation green and no code/runtime scope added.

Recommendation for the next thread: start F6Z final audit implementation from this plan after reviewing the final PR, not F6V provider integration and not F6X actual certification.
