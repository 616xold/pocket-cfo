# Plan F6U ledger reconciliation source-pack foundation

## Purpose / Big Picture

This is the shipped Finance Plan for the Pocket CFO F6U implementation contract.
The target phase is `F6`, and the implementation slice is exactly `F6U-ledger-reconciliation-source-pack-foundation`.

The user-visible goal is narrow: after shipped F6A through F6S, Pocket CFO can prove one additional checked-in source-pack family for ledger/reconciliation posture using the existing source registry and Finance Twin routes only.
The source-pack family is limited to chart-of-accounts, trial-balance, and general-ledger CSV inputs.
It is a fixture, manifest, normalized expected-output, and deterministic direct-proof slice.
It is not product runtime behavior.

Repo truth supports F6U in this reduced shape because shipped F6L bank/card, F6O receivables/payables, and F6R contract/obligation source-pack proofs are green and source-backed, while the existing Finance Twin already ships source-backed `chart_of_accounts_csv`, `trial_balance_csv`, and `general_ledger_csv` sync/read posture plus reconciliation, account bridge, balance bridge prerequisites, balance-proof lineage, period-context, and source-backed balance-proof smokes.
F6U did not become actual certification, actual provider integration, actual external delivery, report release, approval, runtime-Codex behavior, monitor expansion, discovery expansion, or a broad source-pack platform.

GitHub connector work is explicitly out of scope.
Do not invoke GitHub Connector Guard for F6U.

## Progress

- [x] 2026-04-30T12:22:48Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-04-30T12:22:48Z Ran preflight against fetched `origin/main`, confirmed the branch is `codex/f6u-master-plan-and-doc-refresh-local-v1`, confirmed the worktree was clean before edits, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-04-30T12:22:48Z Read the active doc spine, shipped FP-0068 F6S record, package scripts, shipped F6L/F6O/F6R source-pack manifests and proofs, existing Finance Twin ledger/reconciliation proof smokes, source registry routes/services, Finance Twin routes/services, F6S/F6Q/F6P/F6N/F6M boundaries, and monitoring-family/discovery-family contracts.
- [x] 2026-04-30T12:22:48Z Ran the F6U readiness gate before writing this plan: `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`, `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`, `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`, `pnpm smoke:finance-twin-account-catalog:local`, `pnpm smoke:finance-twin-general-ledger:local`, `pnpm smoke:finance-twin:local`, `pnpm smoke:finance-twin-reconciliation:local`, `pnpm smoke:finance-twin-account-bridge:local`, `pnpm smoke:finance-twin-balance-bridge-prerequisites:local`, `pnpm smoke:finance-twin-balance-proof-lineage:local`, `pnpm smoke:finance-twin-period-context:local`, and `pnpm smoke:finance-twin-source-backed-balance-proof:local`; all passed.
- [x] 2026-04-30T12:22:48Z Decided F6U is the safest next planning slice, ahead of F6T actual certification or F6V actual provider integration, because it can stay source-pack-only and proof-oriented on already shipped ledger/reconciliation surfaces.
- [x] 2026-04-30T12:22:48Z Created this FP-0069 planning contract and refreshed active docs without adding code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, implementation scaffolding, provider integrations, credential scaffolding, outbox send behavior, UI, or product runtime behavior.
- [x] 2026-04-30T12:37:18Z Ran the requested docs-and-plan validation ladder, including all listed DB-backed smokes, source-pack proofs, targeted domain/control-plane/twin specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed.
- [x] 2026-04-30T22:06:20Z Started the implementation slice on `codex/f6u-ledger-reconciliation-source-pack-foundation-local-v1`, reloaded the required Pocket CFO operator skills, reran preflight against fetched `origin/main`, confirmed a clean worktree before edits, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-04-30T22:06:20Z Added one `pocket-cfo-ledger-reconciliation-source-pack` manifest family with source roles limited to `chart_of_accounts`, `trial_balance`, and `general_ledger`, extractor keys limited to `chart_of_accounts_csv`, `trial_balance_csv`, and `general_ledger_csv`, and explicit runtime/delivery/action absence boundaries.
- [x] 2026-04-30T22:06:20Z Added one immutable checked-in F6U fixture family under `packages/testkit/fixtures/f6u-ledger-reconciliation-source-pack/` with chart-of-accounts, trial-balance, and general-ledger CSV sources plus normalized expected source/twin/reconciliation posture.
- [x] 2026-04-30T22:06:20Z Added focused stack-pack and testkit specs that assert source roles/extractor keys are limited, manifest source files are the operational source of truth, expected posture descriptors match the manifest, expected posture excludes volatile generated fields, source files are non-empty, and raw fixture hashes remain unchanged.
- [x] 2026-04-30T22:06:20Z Added direct proof `pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs`, using existing source registry upload routes and existing Finance Twin sync/read/reconciliation routes only; the proof verified normalized source/twin/reconciliation posture and raw fixture immutability without adding routes, schema, package scripts, smoke aliases, monitor/discovery families, runtime-Codex, delivery, provider, report, approval, certification, generated prose, finance write, or autonomous-action behavior.
- [x] 2026-04-30T22:17:25Z Completed the full requested validation ladder on the final F6U tree, including narrow manifest/fixture specs, targeted domain/control-plane/twin specs, the new F6U proof, all shipped source-pack and Finance Twin smokes, delivery/readiness/acknowledgement/checklist/provider/certification/human-confirmation guardrails, monitor/discovery smokes, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed.

## Surprises & Discoveries

The repo truth favors F6U over F6T and F6V right now.
F6T would require proof of operator need, legal boundaries, evidence boundaries, review gates, and non-advice constraints for actual certification.
F6V would require provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send.
Those boundaries are not proven enough for implementation planning.

The existing Finance Twin smokes already prove the exact ledger/reconciliation surfaces F6U needs, but they are smoke fixtures, not a checked-in source-pack family.
The F6U implementation therefore added one checked-in static fixture/manifest family and normalized expected posture rather than changing the shipped runtime surfaces.

The balance-bridge and reconciliation routes are intentionally truth-limited.
They expose readiness, account overlap, period context, and source-backed balance proof when explicit persisted fields exist.
They do not compute fake variance or claim a direct balance bridge from general-ledger activity totals.
F6U must preserve that posture.

## Decision Log

Decision: proceed with `F6U-ledger-reconciliation-source-pack-foundation`, not F6T actual certification and not F6V actual provider integration.
Rationale: F6U can be one source-pack family over already shipped ledger/reconciliation source-backed surfaces, while F6T and F6V need later proof of boundaries that are not currently safe to implement.

Decision: F6U is not a monitor family.
Rationale: do not add monitor families, discovery families, or monitor evaluator semantics. The shipped monitor families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`.

Decision: F6U is not a discovery expansion.
Rationale: the shipped discovery families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, `spend_posture`, `obligation_calendar_review`, and `policy_lookup`. Ledger/reconciliation proof must not create a new question family or investigation behavior.

Decision: F6U is not external delivery.
Rationale: do not add email, Slack, SMS, webhook, notification provider calls, provider calls, provider credentials, provider jobs, outbox send behavior, scheduled delivery, auto-send, report delivery, report release, report circulation, or external publish behavior.

Decision: F6U is not certification, legal advice, audit opinion, approval, or report release.
Rationale: do not add actual certification, close-complete status, sign-off, attestation, legal opinion, audit opinion, assurance, approval workflow, report release, or report circulation.

Decision: F6U expands source packs, not product runtime behavior.
Rationale: the implementation defines one checked-in ledger/reconciliation source-pack fixture and manifest family, expected normalized posture, and one deterministic proof path. It does not add DB tables, routes, monitor evaluators, mission behavior, UI, package scripts, root smoke aliases, eval datasets, provider integrations, outbox behavior, or runtime-Codex.

Decision: F6U source roles are limited to `chart_of_accounts`, `trial_balance`, and `general_ledger`.
Rationale: these map to existing shipped extractor keys `chart_of_accounts_csv`, `trial_balance_csv`, and `general_ledger_csv`, and they are sufficient to prove the ledger/reconciliation source-pack family without adding new extractors.

Decision: F6U inputs are fixture and proof inputs only.
Rationale: allowed inputs for the implementation are checked-in static source-pack fixture files, expected normalized source/twin/reconciliation posture, existing source registration/upload routes in proof tooling only, and existing Finance Twin sync/read/reconciliation routes in proof tooling only. Generic chat, report artifacts as primary input, runtime-Codex, mission-generated prose, generated prose, monitor reruns, provider state, provider credentials, outbox jobs, external communications, and source mutation outside proof upload/sync setup are out of scope.

Decision: F6U output contract is one source-pack manifest/fixture contract plus one deterministic direct proof path.
Rationale: expected posture should include source file list, source roles, parser/sync expectations, normalized source/twin posture, reconciliation posture, account bridge posture, balance bridge posture, balance-proof lineage posture, period-context posture, raw fixture immutability, fixed monitor/discovery family boundaries, and limitations. It should add no new monitor result semantics, checklist item families, readiness behavior, acknowledgement behavior, delivery-readiness behavior, review-summary behavior, provider-boundary behavior, certification-boundary behavior, human-confirmation behavior, or investigation behavior.

Decision: F6U preserves shipped F5 and F6 behavior.
Rationale: no F5 report/release/circulation/correction changes, no monitor evaluator changes, no F6B/F6G mission changes, no F6H checklist behavior changes, no F6J readiness behavior changes, no F6K acknowledgement behavior changes, no F6L bank/card source-pack behavior changes, no F6M delivery-readiness behavior changes, no F6N review-summary behavior changes, no F6O receivables/payables source-pack behavior changes, no F6P provider-boundary behavior changes, no F6Q certification-boundary behavior changes, no F6R contract/obligation source-pack behavior changes, no F6S human-confirmation behavior changes, no new approval kind, and no report conversion belong in F6U.

Decision: later slices are named but not created here.
Rationale: F6T actual certification should happen only if operator need, legal boundaries, evidence boundaries, review gates, and non-advice constraints are proven. F6V actual provider integration should happen only if a future plan proves provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send. F6W additional source-pack expansion should happen only after existing source packs remain green. Do not create FP-0070 in this slice.

## Context and Orientation

Pocket CFO has shipped F6A through F6S.
FP-0050 through FP-0068 are shipped records.
FP-0068 is the shipped F6S record for one deterministic internal external-delivery human-confirmation / delivery-preflight boundary through `GET /external-delivery/companies/:companyKey/human-confirmation-boundary`.
F6S is not actual delivery, provider integration, outbox work, approval, report release, certification, or F6U implementation.

The shipped source-pack foundation records are:

- FP-0061 / F6L: one bank/card source-pack foundation with source roles `bank_account_summary` and `card_expense`, extractor keys `bank_account_summary_csv` and `card_expense_csv`, and direct proof `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`.
- FP-0064 / F6O: one receivables/payables source-pack foundation with source roles `receivables_aging` and `payables_aging`, extractor keys `receivables_aging_csv` and `payables_aging_csv`, and direct proof `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`.
- FP-0067 / F6R: one contract/obligation source-pack foundation with source role `contract_metadata`, extractor key `contract_metadata_csv`, and direct proof `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`.

The relevant shipped Finance Twin source and proof surfaces for F6U are:

- `packages/domain/src/finance-twin.ts` includes `chart_of_accounts_csv`, `trial_balance_csv`, and `general_ledger_csv` extractor keys, ledger-account, account-catalog, trial-balance-line, journal-entry, journal-line, and general-ledger-balance-proof lineage target kinds.
- `apps/control-plane/src/modules/finance-twin/extractor-dispatch.ts` dispatches existing chart-of-accounts, trial-balance, and general-ledger CSV extraction.
- `apps/control-plane/src/modules/finance-twin/routes.ts` exposes existing source-file sync, account catalog, general ledger, reconciliation, account bridge, balance bridge prerequisites, balance proof, activity lineage, and lineage drill routes.
- `apps/control-plane/src/modules/finance-twin/reconciliation.ts` exposes readiness and truth-limited comparability without fake variance.
- `apps/control-plane/src/modules/finance-twin/account-bridge.ts` exposes matched-period account-bridge readiness without inventing a numeric bridge.
- `apps/control-plane/src/modules/finance-twin/balance-bridge-prerequisites.ts` and related helpers expose source-backed balance-proof prerequisites without fake bridge numbers.
- `apps/control-plane/src/modules/finance-twin/general-ledger-period-context.ts` preserves explicit source-declared period context and limitations.
- `tools/finance-twin-account-catalog-smoke.mjs`, `tools/finance-twin-general-ledger-smoke.mjs`, `tools/finance-twin-smoke.mjs`, `tools/finance-twin-reconciliation-smoke.mjs`, `tools/finance-twin-account-bridge-smoke.mjs`, `tools/finance-twin-balance-bridge-prerequisites-smoke.mjs`, `tools/finance-twin-balance-proof-lineage-smoke.mjs`, `tools/finance-twin-period-context-smoke.mjs`, and `tools/finance-twin-source-backed-balance-proof-smoke.mjs` are the existing proof surface.

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No database schema migration, eval dataset, package script, smoke alias, provider integration, credential scaffold, outbox behavior, report, approval, delivery behavior, certification, close-complete status, sign-off, attestation, legal/audit opinion, assurance, generated prose, finance write, payment behavior, legal/policy advice, collection/customer-contact instruction, or autonomous action belongs in F6U.

## Plan of Work

First, the implementation adds one ledger/reconciliation source-pack manifest contract beside the shipped F6L/F6O/F6R manifests.
The source-pack family should be named `pocket-cfo-ledger-reconciliation-source-pack`.
It includes exactly three source roles: `chart_of_accounts`, `trial_balance`, and `general_ledger`.
It includes exactly three extractor keys: `chart_of_accounts_csv`, `trial_balance_csv`, and `general_ledger_csv`.

Second, the implementation adds one checked-in immutable fixture directory for F6U.
The fixture should contain three CSV source files and one normalized expected posture file.
The CSV files should be static source-pack fixtures, not generated at runtime and not mutated by proof tooling.
The expected posture should avoid generated IDs, timestamps, storage refs, or any other volatile fields.

Third, the implementation adds one direct deterministic proof tool.
The proof should use only existing `/sources`, `/sources/:sourceId/files`, and `/finance-twin/companies/:companyKey/source-files/:sourceFileId/sync` routes to register/upload/sync the three fixture files.
It should then read existing Finance Twin account-catalog, general-ledger, reconciliation, account-bridge, balance-bridge-prerequisites, balance-proof, period-context, and lineage routes to normalize actual source/twin/reconciliation posture and compare it to the expected posture.

Fourth, the proof asserts absence boundaries.
It should verify raw fixture source immutability, no monitor or discovery family expansion, no monitor reruns, no mission creation, no report artifacts, no approvals, no delivery/outbox/provider behavior, no certification/sign-off/attestation/legal/audit opinion/assurance artifacts, no generated prose, no runtime-Codex threads, no finance writes, and no autonomous action.

Fifth, active docs are refreshed after the implementation exists and passes validation.
The implementation does not add a package script, root smoke alias, eval dataset, route, schema, migration, UI, provider integration, credential scaffold, or product runtime behavior.

## Concrete Steps

1. Add the source-pack manifest and type.
   Likely files:
   - `packages/stack-packs/src/stack-pack.ts`
   - `packages/stack-packs/src/packs/pocket-cfo-ledger-reconciliation-source-pack.ts`
   - `packages/stack-packs/src/index.ts`

   Acceptance:
   - source roles are exactly `chart_of_accounts`, `trial_balance`, and `general_ledger`
   - extractor keys are exactly `chart_of_accounts_csv`, `trial_balance_csv`, and `general_ledger_csv`
   - the manifest does not declare monitor families or discovery families
   - limitations state that the pack is one local deterministic source-pack fixture family, not a broad platform and not product runtime behavior

2. Add the checked-in fixture family.
   Likely files:
   - `packages/testkit/fixtures/f6u-ledger-reconciliation-source-pack/README.md`
   - `packages/testkit/fixtures/f6u-ledger-reconciliation-source-pack/sources/chart-of-accounts.csv`
   - `packages/testkit/fixtures/f6u-ledger-reconciliation-source-pack/sources/trial-balance.csv`
   - `packages/testkit/fixtures/f6u-ledger-reconciliation-source-pack/sources/general-ledger.csv`
   - `packages/testkit/fixtures/f6u-ledger-reconciliation-source-pack/expected-source-twin-posture.json`

   Acceptance:
   - raw fixture sources are immutable and non-empty
   - the general-ledger fixture includes explicit source-declared period window fields and explicit source-backed opening/ending balance proof fields for at least one account
   - expected posture includes no volatile IDs, timestamps, generated values, or storage refs
   - expected posture includes source roles, extractor keys, source file descriptors, per-role source posture, account catalog posture, trial-balance posture, general-ledger posture, reconciliation posture, account bridge posture, balance bridge prerequisites posture, balance-proof lineage posture, period-context posture, family boundary, runtime/action absence boundary, and limitations

3. Add the deterministic proof tool.
   Likely file:
   - `tools/ledger-reconciliation-source-pack-proof.mjs`

   Acceptance:
   - proof registers one source or one source-pack-appropriate source grouping through existing source routes only
   - proof uploads the three fixture files through existing source-file registration only
   - proof syncs through existing Finance Twin sync route only
   - proof reads existing account catalog, general ledger, reconciliation, account bridge, balance bridge prerequisites, balance proof, period context, and lineage routes only
   - proof compares normalized actual posture to checked-in expected posture
   - proof asserts raw fixture source hashes are unchanged after execution
   - proof asserts no runtime/delivery/provider/report/approval/certification/mission/monitor/generated-prose/source-mutation/finance-action side effects beyond proof upload/sync setup

4. Add focused specs only if the manifest/type shape changes require them.
   Keep tests scoped to the new source-pack contract and proof behavior.
   Do not widen unrelated modules.

5. Refresh active docs after implementation.
   Expected docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - this FP-0069 record

## Validation and Acceptance

This implementation thread must run the user-requested validation ladder on the final tree.

The F6U implementation validation must run at least:

- `pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs`
- `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
- `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`
- `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`
- `pnpm smoke:finance-twin-account-catalog:local`
- `pnpm smoke:finance-twin-general-ledger:local`
- `pnpm smoke:finance-twin:local`
- `pnpm smoke:finance-twin-reconciliation:local`
- `pnpm smoke:finance-twin-account-bridge:local`
- `pnpm smoke:finance-twin-balance-bridge-prerequisites:local`
- `pnpm smoke:finance-twin-balance-proof-lineage:local`
- `pnpm smoke:finance-twin-period-context:local`
- `pnpm smoke:finance-twin-source-backed-balance-proof:local`
- `pnpm smoke:delivery-readiness:local`
- `pnpm smoke:operator-readiness:local`
- `pnpm smoke:close-control-acknowledgement:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:finance-twin-contract-metadata:local`
- `pnpm smoke:finance-twin-receivables-aging:local`
- `pnpm smoke:finance-twin-payables-aging:local`
- `pnpm smoke:finance-twin-bank-account-summary:local`
- `pnpm smoke:finance-twin-card-expense:local`
- `pnpm smoke:cash-posture-monitor:local`
- `pnpm smoke:collections-pressure-monitor:local`
- `pnpm smoke:payables-pressure-monitor:local`
- `pnpm smoke:policy-covenant-threshold-monitor:local`
- `pnpm smoke:cash-posture-alert-investigation:local`
- `pnpm smoke:collections-pressure-alert-investigation:local`
- `pnpm smoke:finance-discovery-supported-families:local`
- `pnpm --filter @pocket-cto/domain exec vitest run src/external-delivery-human-confirmation-boundary.spec.ts src/close-control-certification-boundary.spec.ts src/external-provider-boundary.spec.ts src/close-control-review-summary.spec.ts src/delivery-readiness.spec.ts src/close-control-acknowledgement.spec.ts src/operator-readiness.spec.ts src/close-control.spec.ts src/monitoring.spec.ts src/finance-twin.spec.ts src/proof-bundle.spec.ts`
- `zsh -lc "cd apps/control-plane && pnpm exec vitest run src/modules/external-delivery-human-confirmation-boundary/**/*.spec.ts src/modules/close-control-certification-boundary/**/*.spec.ts src/modules/external-provider-boundary/**/*.spec.ts src/modules/close-control-review-summary/**/*.spec.ts src/modules/delivery-readiness/**/*.spec.ts src/modules/close-control-acknowledgement/**/*.spec.ts src/modules/operator-readiness/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/finance-twin/**/*.spec.ts src/modules/wiki/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/app.spec.ts"`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Implementation acceptance requires all of the following:

- one `pocket-cfo-ledger-reconciliation-source-pack` manifest exists
- one immutable checked-in ledger/reconciliation fixture family exists
- one normalized expected posture exists and is stable
- one direct deterministic proof path exists
- proof uses only existing source registry and Finance Twin sync/read/reconciliation routes
- proof verifies chart-of-accounts, trial-balance, and general-ledger source/twin posture
- proof verifies reconciliation, account bridge, balance bridge prerequisites, source-backed balance proof, balance-proof lineage, and period-context posture
- proof verifies raw fixture source immutability
- proof verifies no new monitor or discovery families
- proof verifies no route, schema, migration, package script, root smoke alias, eval dataset, mission behavior, checklist/readiness/acknowledgement/delivery-readiness/review-summary/provider-boundary/certification-boundary/human-confirmation behavior, report, approval, delivery, provider call, provider credential, provider job, outbox send, runtime-Codex, generated prose, source mutation outside proof upload/sync setup, finance write, advice/instruction, payment behavior, tax filing, legal/audit opinion, certification, close-complete status, sign-off, attestation, assurance, autonomous action, or UI is added

Human-observable acceptance for this implementation slice:

- `plans/FP-0069-ledger-reconciliation-source-pack-foundation.md` exists as the shipped F6U record
- active docs point future Codex threads at FP-0069 as the shipped one-source-pack F6U record
- FP-0050 through FP-0068 remain shipped F6A through F6S records
- F6T, F6V, F6W, and later plans are named only as likely later slices and are not created

## Idempotence and Recovery

This implementation slice is retry-safe because it uses static fixture files, object-store source uploads, additive source snapshots, and existing idempotent read routes.
If a proof run creates additional source uploads or sync runs, rerunning should still normalize away volatile IDs and timestamps and compare only stable posture.
Raw checked-in fixture files must never be rewritten by proof tooling.

Rollback for this implementation should be simple: remove only the F6U manifest, fixture family, proof tool, focused tests, and docs changes from this implementation branch.
Do not remove shipped F6L/F6O/F6R source packs, shipped Finance Twin ledger/reconciliation routes, or historical F5/F6 modules.

Replay implication for F6U is explicit absence.
The implementation proof may create source upload/sync records as proof setup, but it must not create mission replay events, monitor results, report artifacts, approvals, delivery/outbox/provider records, certification records, generated prose, finance writes, or autonomous-action records.
If a future plan wants persisted source-pack proof history, it must name that behavior explicitly and keep it separate from runtime product behavior.

## Artifacts and Notes

This F6U implementation slice creates or updates:

- `plans/FP-0069-ledger-reconciliation-source-pack-foundation.md`
- `README.md`
- `START_HERE.md`
- `docs/ACTIVE_DOCS.md`
- `plans/ROADMAP.md`
- `docs/ops/local-dev.md`
- `docs/ops/source-ingest-and-cfo-wiki.md`
- `docs/ops/codex-app-server.md`
- `evals/README.md`
- `docs/benchmarks/seeded-missions.md`
- `packages/stack-packs/src/stack-pack.ts`
- `packages/stack-packs/src/packs/pocket-cfo-ledger-reconciliation-source-pack.ts`
- `packages/stack-packs/src/index.ts`
- `packages/stack-packs/src/stack-pack.spec.ts`
- `packages/testkit/fixtures/f6u-ledger-reconciliation-source-pack/**`
- `packages/testkit/src/f6u-ledger-reconciliation-source-pack.spec.ts`
- `tools/ledger-reconciliation-source-pack-proof.mjs`

Do not create FP-0070.
Do not start F6T, F6V, F6W, or later work in this slice.

## Interfaces and Dependencies

F6U depends on the existing source registry, source-file object storage, Finance Twin CSV extractors, Finance Twin sync/read routes, and shipped proof conventions.
It does not depend on GitHub, runtime-Codex, reports, approvals, outbox, providers, delivery, certification, legal/audit opinion, payment behavior, tax filing, UI, new database schema, new routes, new package scripts, new root smoke aliases, or new environment variables.

The control-plane route files must remain unchanged unless a later plan explicitly amends this contract.
If a later continuation finds it cannot extend F6U using only existing source registry and Finance Twin routes, stop and report the blocker instead of adding runtime behavior.

## Outcomes & Retrospective

This implementation slice ships the first F6U ledger/reconciliation source-pack foundation.
F6U remains one deterministic fixture/manifest/normalized-posture/proof slice and keeps certification, provider integration, external delivery, approvals, reports, runtime-Codex, monitor families, discovery families, and autonomous actions out of scope.

Recommendation: after review, treat FP-0069 as the shipped F6U record only. FP-0070 later selected non-certifying F6T certification-safety/readiness planning; F6V, F6W, F6X, any F6U hardening, and any actual-certification path require their own future Finance Plan.
