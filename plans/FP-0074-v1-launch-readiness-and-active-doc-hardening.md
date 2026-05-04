# Plan v1 launch-readiness and active-doc hardening

## Purpose / Big Picture

This is the active Finance Plan contract for the Pocket CFO F7/v1 launch-readiness planning slice.
The target phase is `F7`, and the slice is exactly `F7-v1-launch-readiness-and-active-doc-hardening`.

The user-visible goal is narrow: after shipped F6A through F6Z, Pocket CFO needs one implementation-ready contract that hardens the active docs and validation posture before any v1 launch-readiness implementation starts.
F7 is not a product feature slice.
It is docs-and-validation only.
It must not add product runtime behavior.

Repo truth supports this F7 planning contract because FP-0050 through FP-0073 are shipped F6 records, FP-0073 is the shipped final F6/v1 exit audit and handoff record, the pre-plan readiness gate passed on 2026-05-04, all six shipped source-pack proofs remain green, shipped F6T/F6S/F6P/F6Q safety boundaries remain green and correctly non-certifying/non-provider/non-sending, shipped close/control surfaces remain green, shipped monitor families remain exactly four, shipped discovery families remain exactly six, and F6V provider integration plus F6X actual certification can remain future-plan-only.

GitHub connector work is explicitly out of scope.
Do not invoke GitHub Connector Guard for F7.

## Progress

- [x] 2026-05-04T13:01:44Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-05-04T13:01:44Z Ran preflight against fetched `origin/main`, confirmed the branch is `codex/f7-v1-launch-readiness-master-plan-local-v1`, confirmed local `HEAD` matched fetched `origin/main`, confirmed the worktree was clean before edits, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-05-04T13:01:44Z Read the active doc spine, shipped FP-0073 F6Z record, shipped FP-0072 F6Y record, shipped FP-0071 F6W record, shipped FP-0070 F6T record, package scripts, shipped source-pack manifests and proof tools, and the source, wiki, Finance Twin, monitoring, close/control, safety-boundary, reporting, approval, and outbox modules as repo-truth context.
- [x] 2026-05-04T13:01:44Z Ran the pre-plan F7 readiness gate: all six shipped source-pack proofs, policy/covenant monitor, close/control checklist, delivery-readiness, operator-readiness, close/control acknowledgement, monitor demo replay, supported discovery families, focused domain safety specs, and focused control-plane safety specs passed.
- [x] 2026-05-04T13:01:44Z Decided the safest next slice is F7/v1 launch-readiness and active-doc hardening, not a narrow F6 closeout correction, not F6V provider integration planning, and not F6X actual certification planning.
- [x] 2026-05-04T13:01:44Z Created this FP-0074 planning contract without adding code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, implementation scaffolding, provider integrations, credential scaffolding, outbox send behavior, UI, approval workflow, report-release behavior, certification behavior, or product runtime behavior.
- [x] 2026-05-04T13:13:56Z Refreshed only directly adjacent active docs so README, START_HERE, ACTIVE_DOCS, PLANS, ROADMAP, local-dev, source-ingest/CFO Wiki, Codex App Server, seeded-missions, evals, and the FP-0073 handoff clarification agree that FP-0074 is the active F7/v1 launch-readiness contract while F6V/F6X remain future-plan-only.
- [x] 2026-05-04T13:20:20Z Ran the full final validation ladder serially, including all six source-pack proofs, all required CFO Wiki, Finance Twin, monitoring, close/control, delivery-readiness, operator-readiness, acknowledgement, discovery-family, domain, control-plane, twin-sync, lint, typecheck, test, and `pnpm ci:repro:current` commands; validation passed with logs under `/tmp/pocket-cfo-f7-full-validation.HKPycD`.
- [ ] Future F7 implementation thread reviewed this plan after merge and executed only the docs-and-validation hardening steps explicitly allowed below.

## Surprises & Discoveries

The shipped F6Z record is fresh enough to support this planning slice.
It already records FP-0050 through FP-0073 as shipped F6 records, explicitly keeps FP-0074 absent from the F6Z closeout, and says later launch work must wait for a future roadmap or Finance Plan.
This FP-0074 file is that future-plan candidate, but it still does not start F7 implementation.

The six source-pack proofs are the strongest current evidence spine for launch-readiness truthfulness.
They verify raw fixture immutability, normalized expected-output posture, fixed monitor/discovery family boundaries, and no product runtime behavior from source-pack proofs.

The safety-boundary stack remains correctly internal and review-oriented.
F6S is human-confirmation/delivery-preflight only, F6P is provider-boundary/readiness only, F6Q is certification-boundary/readiness only, and F6T is certification-safety/readiness only.
None of those surfaces is actual delivery, provider integration, approval, report release, certification, close complete, sign-off, attestation, legal/audit opinion, assurance, runtime-Codex behavior, source mutation, finance write, or autonomous action.

No new runtime behavior is required to make F7 implementation-ready.
The next implementation slice can be limited to active-doc hardening and deterministic validation if review accepts this plan.

## Decision Log

Decision: proceed with `F7-v1-launch-readiness-and-active-doc-hardening`.
Rationale: shipped F6Z is merged and fresh, the pre-plan readiness gate passed, and F7 can remain one docs-and-validation-only launch-readiness contract without product runtime behavior.

Decision: F7 is not a product feature slice.
Rationale: F7 must harden current shipped product truth in active docs and validation posture only. It must not add routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, monitor families, discovery families, UI, runtime-Codex, source mutation, finance writes, generated product prose, or autonomous actions.

Decision: F7 does not implement F6V provider integration.
Rationale: F6V remains future-plan-only until a future plan proves provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, credential boundaries, provider-job boundaries, outbox boundaries, and no autonomous send.

Decision: F7 does not implement F6X actual certification.
Rationale: F6X remains future-plan-only until a future plan proves operator need, legal boundaries, evidence boundaries, review gates, assurance constraints, non-advice constraints, and non-legal-opinion boundaries.

Decision: F7 preserves shipped F6 behavior.
Rationale: no F6A/F6C/F6D/F6E monitor evaluator changes, no F6B/F6G mission handoff changes, no F6H checklist changes, no F6J readiness changes, no F6K acknowledgement changes, no F6L/F6O/F6R/F6U/F6W/F6Y source-pack behavior changes, no F6M delivery-readiness changes, no F6N review-summary changes, no F6P provider-boundary changes, no F6Q certification-boundary changes, no F6S human-confirmation changes, no F6T certification-safety changes, and no broad FP-0073 rewrite belong in F7.

Decision: F7 launch-readiness outputs are docs and validation posture only.
Rationale: active docs must agree on shipped F6 and future work, local-dev must list direct proof/smoke commands without adding scripts, source-ingest/CFO Wiki docs must not imply provider or delivery behavior, Codex App Server docs must not imply runtime-Codex finance actions or drafting, seeded-missions/evals docs must not imply generated prose or product-runtime eval behavior, and no report artifact, board packet, lender update, certification artifact, close-complete artifact, provider setup, delivery artifact, approval workflow, or product artifact is created.

Decision: post-v1 future slices are named but not created here.
Rationale: likely later work may include F6V actual provider integration, F6X actual certification, deeper document precision/PDF/OCR/vector search only after a source/evidence gap is proven, and product UI launch polish only after a future plan names exact UX scope and avoids provider/certification/delivery behavior. Do not create FP-0075 in this slice.

## Context and Orientation

Pocket CFO has shipped F6A through F6Z.
FP-0050 through FP-0073 are shipped F6 records.
FP-0073 is the shipped F6Z final F6/v1 exit audit and handoff record.
This FP-0074 file is the active F7/v1 launch-readiness planning contract.

The shipped source-pack proof spine is:

- F6L bank/card source-pack proof: `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
- F6O receivables/payables source-pack proof: `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`
- F6R contract/obligation source-pack proof: `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`
- F6U ledger/reconciliation source-pack proof: `pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs`
- F6W policy/covenant document source-pack proof: `pnpm exec tsx tools/policy-covenant-document-source-pack-proof.mjs`
- F6Y board/lender document source-pack proof: `pnpm exec tsx tools/board-lender-document-source-pack-proof.mjs`

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

The current safety-boundary posture is:

- F6M delivery-readiness is not actual delivery.
- F6P provider-boundary is not provider integration.
- F6Q certification-boundary is not actual certification.
- F6S human-confirmation is not send, approval, provider, outbox, report release, or certification behavior.
- F6T certification-safety is not actual certification, legal/audit opinion, assurance, attestation, sign-off, or close complete.

No GitHub connector work is in scope.
No new environment variables are expected.
No code changes are expected for F7.

## Plan of Work

First, preserve the shipped F6/v1 truth.
The F7 implementation thread must start by rereading README.md, START_HERE.md, docs/ACTIVE_DOCS.md, PLANS.md, plans/ROADMAP.md, this FP-0074 file, and the shipped FP-0073 record.
If repo truth no longer supports docs-and-validation-only launch-readiness, stop and recommend the smallest corrective closeout slice instead of widening this plan.

Second, harden the active docs only where they are stale or ambiguous.
Allowed docs are README.md, START_HERE.md, docs/ACTIVE_DOCS.md, PLANS.md if needed, plans/ROADMAP.md, docs/ops/local-dev.md, docs/ops/source-ingest-and-cfo-wiki.md, docs/ops/codex-app-server.md, docs/benchmarks/seeded-missions.md, evals/README.md, and one tiny FP-0073 handoff clarification only if needed.
Do not rewrite historical records broadly.

Third, verify shipped direct proof posture.
The implementation thread must run all six direct source-pack proofs and confirm raw fixture immutability, normalized expected-output posture, source lineage/freshness/limitations posture, fixed monitor/discovery family boundaries, and no product runtime behavior from proof paths.

Fourth, verify shipped safety-boundary posture.
The implementation thread must run the close/control, delivery-readiness, operator-readiness, acknowledgement, monitor demo, supported-family, domain, and control-plane validation ladder listed below.
The result must continue to show delivery-readiness is not actual delivery, provider-boundary is not provider integration, certification-boundary is not actual certification, human-confirmation is no-send/no-provider/no-outbox, and certification-safety is non-certifying.

Fifth, close the F7 implementation thread as docs-and-validation-only.
The closeout must state what changed, what remained absent, what commands passed, whether any docs were intentionally left untouched, and whether F7 implementation is safe to consider complete.
It must not recommend F6V or F6X implementation unless a new future plan proves the needed boundaries.

## Concrete Steps

1. Confirm this active Finance Plan remains the only FP-0074 file.
   Do not create FP-0075.

2. Refresh active docs only where they directly misstate current shipped truth.
   Required truths:
   - FP-0050 through FP-0073 are shipped F6A through F6Z records.
   - FP-0073 is the shipped F6Z final audit/handoff record.
   - FP-0074 is the active F7/v1 launch-readiness and active-doc hardening contract.
   - F7 implementation must be docs-and-validation-only and must not start until this plan is reviewed and merged.
   - F6V provider integration and F6X actual certification remain future-plan-only.
   - F6T is non-certifying certification-safety/readiness only.
   - F6S is no-send/no-provider/no-outbox human-confirmation/delivery-preflight only.
   - F6P is provider-boundary/readiness only.
   - F6Q is certification-boundary/readiness only.
   - F6Y source-digest links are source-coverage posture, not index posture.
   - Source packs do not imply provider integration, delivery, report release, certification, approval, or autonomous action.

3. Preserve shipped F6 behavior.
   Do not edit monitor evaluators, mission handoffs, checklist/readiness/acknowledgement/delivery-readiness/review-summary/provider-boundary/certification-boundary/human-confirmation/certification-safety services, source-pack manifests, proof tools, routes, schema, migrations, package scripts, eval datasets, fixtures, reporting behavior, approval behavior, outbox behavior, runtime-Codex behavior, or UI.

4. Keep local-dev validation as direct commands.
   Do not add a package script, smoke alias, eval dataset, fixture, or wrapper command for F7.

5. Record the implementation closeout in this Progress section, Surprises & Discoveries, Decision Log if a decision changed, and Outcomes & Retrospective.

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

- exactly one new active Finance Plan exists: `plans/FP-0074-v1-launch-readiness-and-active-doc-hardening.md`
- no FP-0075 exists
- F7 remains narrowed to docs-and-validation-only launch-readiness planning
- no code, route, schema, migration, package script, smoke alias, eval dataset, fixture, UI, monitor family, discovery family, runtime-Codex, delivery, provider, outbox, approval, report, certification, close-complete, source mutation, finance write, generated product prose, or autonomous action is added
- active docs agree that FP-0050 through FP-0073 are shipped F6 records and FP-0074 is the active F7 plan
- F6V provider integration and F6X actual certification remain future-plan-only
- shipped source-pack proofs and safety-boundary smokes/specs pass on the final tree

## Idempotence and Recovery

This plan is retry-safe because the intended implementation is docs-and-validation-only.
If validation fails before any docs edit, do not create product behavior to make it pass.
Report the failing command, keep the relevant log path, and recommend the smallest corrective closeout slice.

If a docs edit proves too broad, revert only that docs edit and keep this FP-0074 scope intact.
Do not delete shipped FP-0050 through FP-0073 records, GitHub modules, engineering-twin modules, source-pack fixtures, proof tools, reporting modules, approval modules, outbox placeholders, or runtime-Codex transport code.

Replay implication for F7 is explicit absence.
The validation ladder may create local proof setup state in the development database, but F7 must not add mission replay events, monitor results, report artifacts, approvals, release/circulation records, delivery/outbox/provider records, certification records, generated product prose, source mutation behavior, finance writes, or autonomous-action records.

## Artifacts and Notes

Expected artifacts for this planning slice are:

- this active Finance Plan
- minimal active-doc freshness edits
- validation logs
- a final human handoff that names the branch, commit, PR, changed files, validation results, gaps, and next recommendation

This slice must not create code artifacts, migration artifacts, package scripts, smoke aliases, eval datasets, fixtures, provider configuration, outbox behavior, UI screens, approval workflows, report-release behavior, certification artifacts, close-complete artifacts, generated product prose artifacts, source mutations, finance writes, or autonomous actions.

## Interfaces and Dependencies

F7 depends on shipped source registry, Finance Twin, CFO Wiki, monitoring, close/control, delivery-readiness, provider-boundary, certification-boundary, human-confirmation, certification-safety, reporting, approvals, evidence, and outbox boundary posture as validation context only.

The Codex App Server remains a narrow runtime seam.
F7 must not add runtime-Codex monitoring behavior, acknowledgement drafting, review-summary drafting, source-pack drafting, provider-boundary drafting, certification-boundary drafting, certification-safety drafting, launch-readiness drafting, notification prose, external communication prose, or finance-action instructions.

Internal package scope remains `@pocket-cto/*`.
No new environment variables are expected.
No GitHub connector work is expected.

## Outcomes & Retrospective

This planning slice created FP-0074 as the active F7/v1 launch-readiness and active-doc hardening contract only.
No F7 implementation has started.
F7 implementation should start next only after this plan is reviewed and merged, and it must remain docs-and-validation-only unless a future plan explicitly changes scope.

FP-0050 through FP-0073 remain shipped F6 records.
F6V provider integration and F6X actual certification remain future-plan-only.
The final validation ladder passed, including the six direct source-pack proofs and `pnpm ci:repro:current`.
No additional F6 closeout correction is currently required by the pre-plan readiness gate.
