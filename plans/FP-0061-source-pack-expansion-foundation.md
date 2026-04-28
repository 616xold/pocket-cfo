# Define F6L source-pack expansion foundation

## Purpose / Big Picture

This file is the active Finance Plan for the Pocket CFO F6L implementation contract.
The target phase is `F6`, and the intended implementation slice is exactly `F6L-bank-card-source-pack-foundation`.

The user-visible goal is narrow: after shipped F6A through F6K, Pocket CFO should prove that one additional checked-in source-pack family can be registered and synced through the existing source registry and Finance Twin without widening product runtime behavior.
The first F6L source-pack family is `bank-card-source-pack-foundation`.
It covers bank/cash source posture and card-expense source posture only.

Repo truth supports this F6L planning contract now.
The shipped `pocket-cfo-monitor-demo` stack-pack remains green and source-backed.
The source registry already preserves uploaded raw bytes with checksums, snapshots, provenance records, and immutable fixture checks.
The Finance Twin already supports deterministic `bank_account_summary_csv` and `card_expense_csv` syncs, plus cash-posture, bank-account inventory, spend-item inventory, and spend-posture reads.
The shipped monitor replay, close/control checklist, operator-readiness, and close/control acknowledgement-readiness proofs already act as guardrails for source/freshness posture, proof posture, runtime absence, delivery absence, monitor-family absence, and discovery-family absence.

F6L is not a monitor family.
It must not add `spend_posture`, `obligation_calendar_review`, `covenant_risk`, or any other monitor family.
It must not add a discovery family.
The shipped monitor families remain exactly:

- `cash_posture`
- `collections_pressure`
- `payables_pressure`
- `policy_covenant_threshold`

The shipped discovery families remain exactly:

- `cash_posture`
- `collections_pressure`
- `payables_pressure`
- `spend_posture`
- `obligation_calendar_review`
- `policy_lookup`

F6L is not external delivery.
It must not add email, Slack, SMS, webhooks, notification provider calls, outbox send behavior, report delivery, external publish behavior, runtime-Codex, reports, approvals, payment behavior, accounting writes, bank writes, tax filings, legal advice, policy advice, collection instructions, customer-contact instructions, or autonomous finance action.

This docs-and-plan thread creates the implementation-ready contract only.
It does not start F6L implementation and does not add code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, or implementation scaffolding.
GitHub connector work is explicitly out of scope.

## Progress

- [x] 2026-04-28T21:28:45Z Invoked the requested Pocket CFO operator plugin guards, fetched `origin/main`, confirmed the branch, GitHub access, Docker services, and clean worktree, then read the required active docs and shipped F6F/F6I/F6K records.
- [x] 2026-04-28T21:28:45Z Inspected the source registry, Finance Twin, stack-pack manifest, demo fixture, monitor replay, close/control checklist, operator-readiness, and acknowledgement-readiness guardrails.
- [x] 2026-04-28T21:28:45Z Ran the core pre-plan guardrail smokes for monitor demo replay, close/control checklist, operator readiness, close/control acknowledgement readiness, bank-account-summary sync, and card-expense sync; all passed.
- [x] 2026-04-28T21:28:45Z Decided F6L is safe now as a source-pack expansion contract, and narrowed the first source-pack family to `bank-card-source-pack-foundation`.
- [x] 2026-04-28T21:28:45Z Created FP-0061 as the single active implementation-ready F6L contract while preserving FP-0050 through FP-0060 as shipped F6A through F6K records.
- [x] 2026-04-28T21:36:28Z Ran the requested docs-and-plan validation ladder, including the DB-backed F6 guardrail smokes, targeted twin specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed.
- [ ] Implement the first bank/card source-pack fixture or manifest family in a later implementation thread, after this plan is reviewed.
- [ ] Run the full F6L implementation validation ladder in the implementation thread and update this plan with shipped outcomes.

## Surprises & Discoveries

The safest next F6L source-pack is bank/card, not receivables/payables or policy.
Bank/cash and card-expense source posture already has shipped deterministic sync support, route-backed reads, source-lineage posture, freshness posture, and packaged smoke coverage.
That lets F6L expand source-pack proof without adding monitor semantics, checklist item families, acknowledgement behavior, report behavior, or delivery behavior.

The existing `pocket-cfo-monitor-demo` pack should remain stable.
It already owns the F6F/F6I demo proof for bank/cash, receivables, payables, and policy threshold sources.
The F6L implementation should not mutate that fixture's semantics to prove a new bank/card pack.
If the later implementation needs to compare against the existing demo pack, it should do so as a guardrail only.

The source registry and Finance Twin are strong enough for a fixture/manifest/proof slice.
No new table, route, schema, extractor, monitor evaluator, mission behavior, runtime-Codex behavior, notification path, approval path, report path, or external action is needed for the first F6L pack.

The current `packages/stack-packs` contract is still narrow and partly demo-shaped.
A later F6L implementation may add a small source-pack manifest contract beside the existing demo stack-pack contract, but it must not broaden old engineering stack-pack vocabulary or create a second product runtime system.

## Decision Log

Decision: proceed with `F6L-bank-card-source-pack-foundation` rather than switching next to F6M external notification or delivery planning.
Rationale: the shipped F6A through F6K guardrails are green and source-backed, while delivery still requires future safety, review gates, provider boundaries, and human-approved release semantics.
F6L can remain fixture/manifest/proof-oriented and internal.

Decision: choose one source-pack family only: `bank-card-source-pack-foundation`.
Rationale: shipped F2K and F2O already support deterministic bank-account-summary and card-expense source ingestion, cash posture, bank-account inventory, spend-item inventory, and spend posture.
The bank/card pack complements existing monitor/checklist/readiness surfaces without adding monitor or discovery semantics.

Decision: F6L is not a monitor-family expansion.
Rationale: monitor families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`.
F6L must not add `spend_posture`, `obligation_calendar_review`, `covenant_risk`, `spend_exceptions`, or any new monitor result semantics.

Decision: F6L is not a discovery-family expansion.
Rationale: discovery families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, `spend_posture`, `obligation_calendar_review`, and `policy_lookup`.
F6L must not add `receivables_aging_review`, `payables_aging_review`, `runway`, `burn_variance`, `concentration`, `covenant_risk`, `anomaly_review`, `spend_exceptions`, or generic chat.

Decision: F6L is not external delivery.
Rationale: email, Slack, SMS, webhooks, notification provider calls, outbox sends, report delivery, external publish behavior, and operator delivery workflow belong only in a future F6M plan if safety and review gates are proven.

Decision: F6L should expand source packs, not product runtime behavior.
Rationale: the first implementation should define one checked-in source-pack fixture or manifest family with source file list, source roles, parser/sync expectations, normalized expected source/twin posture, limitations, and raw-fixture immutability proof.
It should not add DB tables, routes, schema, migrations, package scripts, monitor evaluators, mission behavior, checklist behavior, readiness behavior, acknowledgement behavior, reports, approvals, runtime-Codex, or delivery.

Decision: the later implementation should not mutate raw fixture files to make proof pass.
Rationale: raw source fixture immutability is part of the product contract.
If a fixture is stale, partial, ambiguous, unsupported, or conflicting, the normalized expected posture must expose that posture instead of hiding it.

Decision: the later proof path should use existing source registration/upload and Finance Twin sync routes only.
Rationale: the source-pack proof is allowed to register static checked-in source files, upload them through the existing source registry, sync them through the existing Finance Twin source-file route, and read existing Finance Twin views.
It must not use generic chat, report artifacts as primary input, runtime-Codex, mission-generated prose, monitor reruns from checklist/readiness/acknowledgement paths, or new product routes.

Decision: no new package script is required by the first F6L implementation contract.
Rationale: a later implementation can use targeted package specs and, if DB-backed route proof is necessary, a direct `pnpm exec tsx tools/<f6l-proof>.mjs` invocation without adding a new root script.
Adding a packaged smoke alias should require amending this plan first.

Decision: define likely later slices without creating them.
Rationale: `F6M-external-notification-delivery-planning` should happen only if a future plan proves safety and review gates, `F6N-close-control-reporting-or-certification` should happen only if operator need and evidence boundaries are proven, and `F6O-additional-source-pack-expansion` should happen only after this first bank/card source pack is green.
Do not create FP-0062 in this slice.

## Context and Orientation

Pocket CFO has shipped F6A through F6K:

- F6A deterministic `cash_posture` monitor result and alert card
- F6B manual taskless investigation handoff from one persisted alerting `cash_posture` monitor result
- F6C deterministic `collections_pressure` monitor result and alert card
- F6D deterministic `payables_pressure` monitor result and alert card
- F6E deterministic `policy_covenant_threshold` monitor result and alert card
- F6F one deterministic monitor demo replay and one Pocket CFO demo stack-pack foundation
- F6G manual taskless investigation handoff from one persisted alerting `collections_pressure` monitor result while preserving cash and rejecting payables and policy/covenant investigations
- F6H one deterministic close/control checklist foundation from stored Finance Twin source posture, stored CFO Wiki policy/source posture, and latest persisted monitor results as context only
- F6I one normalized close/control expected-output expansion on the existing monitor demo stack-pack replay proof
- F6J one deterministic internal operator attention/readiness read model over shipped stored state only
- F6K one deterministic internal close/control acknowledgement-readiness read model over shipped checklist and operator-readiness posture only

The relevant implementation seams for F6L are:

- `packages/domain/src/source-registry.ts` for source, snapshot, source-file, checksum, storage, and provenance contracts
- `packages/domain/src/finance-twin.ts` for Finance Twin source, freshness, lineage, cash posture, spend posture, and limitation contracts
- `packages/stack-packs/src/stack-pack.ts` for any future narrow source-pack manifest contract
- `packages/stack-packs/src/packs/**` for any future bank/card source-pack manifest
- `packages/testkit/fixtures/**` for any future checked-in source-pack fixture files and expected posture files
- `apps/control-plane/src/modules/sources/**` for existing source registration and immutable file upload behavior
- `apps/control-plane/src/modules/finance-twin/**` for existing bank-account-summary and card-expense syncs and reads
- `tools/finance-twin-bank-account-summary-smoke.mjs` and `tools/finance-twin-card-expense-smoke.mjs` for existing bank/card proof patterns
- `tools/monitor-demo-replay-smoke.mjs`, `tools/close-control-checklist-smoke.mjs`, `tools/operator-readiness-smoke.mjs`, and `tools/close-control-acknowledgement-smoke.mjs` for existing guardrail absence-boundary patterns

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No source mutation is expected.
No database schema migration, package script, route, eval dataset, monitor family, discovery family, report, approval, delivery behavior, or external action belongs in F6L.

## Plan of Work

First, the later implementation should add exactly one bank/card source-pack fixture or manifest family.
The pack should describe source file roles, checked-in source file paths, source kinds, media types, expected parser or extractor keys, required sync routes, normalized expected source posture, normalized expected Finance Twin posture, and limitations.

Second, the later implementation should keep the pack fixture-oriented and proof-oriented.
It should use existing source registration/upload routes and existing Finance Twin sync/read routes.
It should not add product runtime behavior, a new source registry API, a new Finance Twin extractor, a new monitor evaluator, a new checklist item family, a new readiness or acknowledgement behavior, or a new mission type.

Third, the later implementation should prove raw fixture immutability.
The proof must compute checked-in source checksums before and after registration/sync, compare normalized posture against expected output, and expose limitations for partial, missing, ambiguous, or unsupported evidence.

Fourth, the later implementation should preserve shipped F5 and F6 behavior.
The proof ladder must run the shipped monitor, handoff, demo replay, checklist, readiness, acknowledgement, source/twin, and discovery-family guardrails so a source-pack expansion cannot silently widen monitor/discovery families, delivery posture, approval posture, report posture, or runtime-Codex posture.

Fifth, docs should be refreshed only where behavior changes after implementation.
The implementation thread must not claim the new pack is shipped until code, fixture, manifest, proof, active docs, and validation have landed.

## Concrete Steps

1. Add a narrow bank/card source-pack manifest in the implementation thread.
   Expected future files may include:
   - `packages/stack-packs/src/stack-pack.ts`
   - `packages/stack-packs/src/packs/pocket-cfo-bank-card-source-pack.ts`
   - `packages/stack-packs/src/index.ts`
   - focused stack-pack specs

   Required behavior:
   - one source-pack id such as `pocket-cfo-bank-card-source-pack`
   - source roles limited to bank-account-summary and card-expense
   - expected extractor keys limited to `bank_account_summary_csv` and `card_expense_csv`
   - no monitor families
   - no discovery families
   - no mission types
   - no report kinds
   - no approval kinds
   - no runtime-Codex semantics
   - no delivery semantics

2. Add one checked-in source-pack fixture set in the implementation thread.
   Expected future files may include:
   - `packages/testkit/fixtures/f6l-bank-card-source-pack/README.md`
   - `packages/testkit/fixtures/f6l-bank-card-source-pack/sources/bank-account-summary.csv`
   - `packages/testkit/fixtures/f6l-bank-card-source-pack/sources/card-expense.csv`
   - `packages/testkit/fixtures/f6l-bank-card-source-pack/expected-source-twin-posture.json`
   - focused testkit fixture specs

   Required fixture contract:
   - raw source files are immutable
   - source file list is explicit
   - source roles are explicit
   - checksums are recorded or asserted
   - parser/sync expectations are explicit
   - normalized expected source/twin posture excludes generated ids and timestamps
   - limitations expose ambiguous, missing, partial, or unsupported evidence

3. Add one deterministic proof path in the implementation thread only if needed.
   Preferred shape:
   - targeted stack-pack/testkit specs for manifest and expected-posture shape
   - existing `pnpm smoke:finance-twin-bank-account-summary:local`
   - existing `pnpm smoke:finance-twin-card-expense:local`
   - optionally one direct DB-backed proof tool invoked with `pnpm exec tsx tools/<f6l-proof>.mjs`

   Required proof behavior:
   - register the checked-in bank/card fixture files through existing source routes
   - upload the checked-in source files without rewriting them
   - sync source files through existing Finance Twin routes
   - read existing bank-account inventory, cash posture, spend-item inventory, and spend posture views
   - compare normalized source/twin posture to expected output
   - prove fixture source checksums remain unchanged
   - assert no monitors are run by the source-pack proof unless a future amendment explicitly scopes that guardrail
   - assert no checklist, readiness, acknowledgement, mission, report, approval, delivery, runtime-Codex, finance-action, monitor-family, or discovery-family behavior is added
   - do not add a root package script unless this plan is amended first

4. Preserve existing shipped demo pack semantics.
   The implementation must not mutate:
   - `packages/testkit/fixtures/f6f-monitor-demo-stack/sources/**`
   - `packages/testkit/fixtures/f6f-monitor-demo-stack/expected-monitor-results.json`
   - `packages/testkit/fixtures/f6f-monitor-demo-stack/expected-close-control-checklist.json`

   The existing `pocket-cfo-monitor-demo` pack can remain a guardrail, but F6L should not turn it into the bank/card source-pack proof by changing its source meaning.

5. Preserve shipped F5 and F6 behavior.
   The implementation must not change:
   - F5 report/release/circulation/correction behavior
   - monitor evaluators
   - F6B/F6G mission handoffs
   - F6H checklist behavior
   - F6J readiness behavior
   - F6K acknowledgement behavior
   - approval kinds
   - report conversion
   - runtime-Codex, delivery, notification, payment, legal/policy-advice, collection/customer-contact, or autonomous-action posture

6. Refresh active docs after implementation.
   Expected docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - `docs/ops/local-dev.md`
   - `docs/ops/source-ingest-and-cfo-wiki.md` only if source/freshness wording becomes stale
   - `docs/ops/codex-app-server.md` only if runtime-boundary wording becomes stale
   - `evals/README.md` and `docs/benchmarks/seeded-missions.md` only if proof/eval wording becomes stale

## Validation and Acceptance

This docs-and-plan thread must run the requested validation ladder after edits:

- `pnpm smoke:close-control-acknowledgement:local`
- `pnpm smoke:operator-readiness:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:finance-twin-bank-account-summary:local`
- `pnpm smoke:finance-twin-card-expense:local`
- `pnpm smoke:cash-posture-monitor:local`
- `pnpm smoke:collections-pressure-monitor:local`
- `pnpm smoke:payables-pressure-monitor:local`
- `pnpm smoke:policy-covenant-threshold-monitor:local`
- `pnpm smoke:cash-posture-alert-investigation:local`
- `pnpm smoke:collections-pressure-alert-investigation:local`
- `pnpm smoke:finance-discovery-supported-families:local`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

The later F6L implementation thread should run at least:

- targeted stack-pack and testkit specs added for the bank/card source-pack fixture and manifest
- `pnpm smoke:finance-twin-bank-account-summary:local`
- `pnpm smoke:finance-twin-card-expense:local`
- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm smoke:operator-readiness:local`
- `pnpm smoke:close-control-acknowledgement:local`
- `pnpm smoke:cash-posture-monitor:local`
- `pnpm smoke:collections-pressure-monitor:local`
- `pnpm smoke:payables-pressure-monitor:local`
- `pnpm smoke:policy-covenant-threshold-monitor:local`
- `pnpm smoke:cash-posture-alert-investigation:local`
- `pnpm smoke:collections-pressure-alert-investigation:local`
- `pnpm smoke:finance-discovery-supported-families:local`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

F6L implementation acceptance is observable only if all of the following are true:

- one bank/card source-pack fixture or manifest family exists
- it has checked-in static source files for bank-account-summary and card-expense only
- raw fixture source files remain immutable
- source roles, source kinds, media types, parser/sync expectations, and limitations are explicit
- normalized expected source/twin posture exists and excludes generated ids and timestamps
- existing source registration/upload routes and Finance Twin sync/read routes prove the pack
- bank-account-summary sync remains source-backed
- card-expense sync remains source-backed
- proof exposes provenance, freshness posture, and limitations
- no new monitor family or discovery family is added
- no new monitor result semantics, checklist item family, readiness behavior, acknowledgement behavior, investigation behavior, report behavior, approval behavior, delivery behavior, runtime-Codex behavior, finance write, legal/policy advice, payment behavior, collection/customer-contact instruction, or autonomous action is added
- shipped F5 and F6 guardrail smokes remain green

## Idempotence and Recovery

The later F6L implementation should be retry-safe.
It should use deterministic source-pack fixture names, stable checked-in file paths, normalized expected output, and generated company keys or run tags where DB-backed proof needs isolation.
Generated ids, generated timestamps, source ids, snapshot ids, source-file ids, and sync-run ids must not be treated as fixture truth.

Raw source fixtures must not be rewritten to make a proof pass.
If source evidence is stale, partial, conflicting, unsupported, or insufficient, expected output should expose that posture rather than hiding it.

Rollback for the later implementation should remove only the additive bank/card source-pack manifest, fixture, expected-posture file, focused specs, optional proof tool, and docs.
Rollback must leave shipped F6A through F6K monitor, handoff, demo replay, checklist, readiness, acknowledgement, F5 reporting behavior, raw source registry semantics, Finance Twin sync semantics, CFO Wiki posture, GitHub modules, and engineering-twin modules intact.
No destructive database migration belongs in F6L.

## Artifacts and Notes

This docs-and-plan slice produces:

- `plans/FP-0061-source-pack-expansion-foundation.md`
- active-doc updates that identify FP-0061 as the active F6L implementation-ready contract
- no code
- no routes
- no schema or migrations
- no package scripts
- no smoke commands
- no eval datasets
- no fixtures
- no implementation scaffolding
- no runtime-Codex
- no delivery
- no reports
- no approvals
- no monitor-family or discovery-family expansion

The later implementation slice should produce:

- one bank/card source-pack fixture or manifest family
- one normalized expected source/twin posture contract
- one deterministic proof path
- source/freshness/provenance/limitation posture visible in proof output
- active-doc updates that identify the implementation result only after validation passes

Do not create FP-0062 in this slice.
Do not start F6M, F6N, F6O, or later implementation here.

## Interfaces and Dependencies

Package boundaries must remain unchanged:

- `packages/domain` owns pure contracts for source registry, Finance Twin, monitors, close/control, readiness, acknowledgement, proof, mission, and reporting vocabulary
- `packages/db` remains untouched unless a later plan explicitly justifies additive persistence, which F6L does not currently need
- `packages/stack-packs` may own the future source-pack manifest contract
- `packages/testkit` may own future checked-in source-pack fixtures and expected posture files
- `apps/control-plane/src/modules/sources` owns source registration and raw file upload behavior
- `apps/control-plane/src/modules/finance-twin` owns bank-account-summary and card-expense sync/read behavior
- `apps/control-plane/src/modules/monitoring` owns shipped monitor behavior and must not be changed for F6L
- `apps/control-plane/src/modules/close-control`, `apps/control-plane/src/modules/operator-readiness`, and `apps/control-plane/src/modules/close-control-acknowledgement` own shipped read models and must not be changed for F6L
- `apps/control-plane/src/modules/missions`, `apps/control-plane/src/modules/reporting`, and `apps/control-plane/src/modules/approvals` must not be widened by F6L
- `apps/web` is not required for the first source-pack proof

Runtime-Codex stays out of scope:

- no runtime-Codex source interpretation
- no runtime-Codex monitoring findings
- no runtime-Codex checklist, readiness, or acknowledgement prose
- no runtime-Codex report drafting
- no runtime-owned finance facts

Delivery and autonomous action stay out of scope:

- no email
- no Slack
- no SMS
- no webhooks
- no notification providers
- no outbox sends
- no send, distribute, publish, release, report delivery, pay, book, file, tax filing, legal advice, policy advice, payment instruction, vendor-payment recommendation, collection instruction, customer-contact instruction, or external action

Later slices are named but not created here:

- `F6M-external-notification-delivery-planning`, only if a future plan proves safety, review gates, delivery controls, and a human-approved release path
- `F6N-close-control-reporting-or-certification`, only if operator need and evidence boundaries are proven
- `F6O-additional-source-pack-expansion`, only after the bank/card source pack is green and source-backed

Current module vocabulary stays stable.
Do not rename `modules/twin/**`, `modules/reporting/**`, or `@pocket-cto/*`.
Do not delete GitHub or engineering-twin modules as part of F6L.

## Outcomes & Retrospective

This docs-and-plan thread created FP-0061 after confirming that shipped F6A through F6K guardrails support a safe source-pack expansion contract.
The first F6L implementation target is narrowed to `bank-card-source-pack-foundation`.
No F6L implementation has started yet.
No F6M, F6N, F6O, FP-0062, or later plan was created.
The docs-and-plan validation ladder passed on 2026-04-28, including `pnpm ci:repro:current`.

What remains:

- implement the bank/card source-pack fixture or manifest family through this plan
- keep F6M external notification or delivery planning uncreated until a future named plan proves safety and review gates
- keep F6N close/control reporting or certification uncreated until operator need and evidence boundaries are proven
- consider F6O additional source-pack expansion only after this first bank/card pack is green and source-backed
