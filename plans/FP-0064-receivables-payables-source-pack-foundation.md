# Plan F6O receivables/payables source-pack foundation

## Purpose / Big Picture

This is the shipped Finance Plan record for the Pocket CFO F6O implementation slice.
The target phase is `F6`, and the shipped slice is exactly `F6O-receivables-payables-source-pack-foundation`.

The user-visible goal is narrow: after shipped F6A through F6N, Pocket CFO should prove one additional checked-in source-pack family for receivables-aging and payables-aging source posture through existing source registry and Finance Twin routes only.
This is a source-pack expansion contract.
It is not a monitor, not a discovery family, not delivery, not a report, not an approval, not runtime-Codex behavior, and not product runtime behavior.

Repo truth supported F6O in this reduced shape.
The shipped F6L bank/card source pack remains green and source-backed through `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`.
Existing receivables-aging and payables-aging Finance Twin syncs remain source-backed and green through their packaged local smokes.
Existing `collections_pressure` and `payables_pressure` monitors remain green, source-backed where source exists, and fixed to the shipped monitor-family list.
The source-pack expansion remains fixture/manifest/proof-oriented without requiring route, schema, migration, monitor evaluator, mission behavior, runtime-Codex, delivery, report, approval, or external-action changes.

F6O must create only one source-pack family.
The planned source roles are exactly:

- `receivables_aging`
- `payables_aging`

The planned extractor keys are exactly:

- `receivables_aging_csv`
- `payables_aging_csv`

F6O is not a monitor family.
The shipped monitor families remain exactly:

- `cash_posture`
- `collections_pressure`
- `payables_pressure`
- `policy_covenant_threshold`

F6O must not add `spend_posture`, `obligation_calendar_review`, `covenant_risk`, `receivables_aging_review`, `payables_aging_review`, or any other monitor family.

F6O is not a discovery-family expansion.
The shipped discovery families remain exactly:

- `cash_posture`
- `collections_pressure`
- `payables_pressure`
- `spend_posture`
- `obligation_calendar_review`
- `policy_lookup`

F6O is not external delivery.
It must not add email, Slack, SMS, webhooks, notification provider calls, outbox send behavior, report delivery, external publish behavior, generated notification prose, provider integration, scheduled sends, or auto-send behavior.

F6O expands source packs, not product runtime behavior.
The shipped implementation defines one checked-in receivables/payables source-pack fixture and manifest family with source file list, source roles, parser/sync expectations, normalized expected source/twin posture, source/freshness posture, proof posture, and limitations.
It proves raw fixture source immutability and compares normalized expected output while excluding generated ids, timestamps, storage refs, source ids, snapshot ids, source-file ids, sync-run ids, and other volatile values.

No GitHub connector work is in scope.
Do not invoke GitHub Connector Guard for F6O.

## Progress

- [x] 2026-04-29T13:48:05Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-04-29T13:48:05Z Ran preflight against fetched `origin/main`, confirmed the branch is `codex/f6o-master-plan-and-doc-refresh-local-v1`, confirmed the worktree was clean, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-04-29T13:48:05Z Read the requested active docs, shipped FP-0061 and FP-0063 records, package scripts, stack-pack contracts, F6L bank/card source-pack proof, receivables/payables Finance Twin smokes, collections/payables monitor smokes, and the source, Finance Twin, close/control, readiness, delivery-readiness, and review-summary module boundaries.
- [x] 2026-04-29T13:48:05Z Ran the pre-plan safety gates: `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`, `pnpm smoke:finance-twin-receivables-aging:local`, `pnpm smoke:finance-twin-payables-aging:local`, `pnpm smoke:collections-pressure-monitor:local`, and `pnpm smoke:payables-pressure-monitor:local`; all passed.
- [x] 2026-04-29T13:48:05Z Decided repo truth supports F6O as one receivables/payables source-pack planning contract rather than jumping to F6P external provider integration planning.
- [x] 2026-04-29T13:48:05Z Created this FP-0064 implementation-ready planning contract without adding code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, runtime behavior, or implementation scaffolding.
- [x] 2026-04-29T13:58:42Z Ran the full docs-and-plan validation ladder, including the DB-backed F6 readiness/checklist/source-pack/monitor/discovery smokes, targeted twin vitest checks, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed.
- [x] 2026-04-29T14:17:16Z Re-entered FP-0064 for implementation on branch `codex/f6o-receivables-payables-source-pack-foundation-local-v1`, fetched `origin/main`, confirmed the worktree was clean before edits, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-04-29T14:17:16Z Added one F6O manifest family, one immutable receivables/payables fixture set, one normalized expected source/twin posture file, one focused testkit fixture spec, and one direct deterministic proof tool.
- [x] 2026-04-29T14:17:16Z Ran focused manifest and fixture specs plus `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`; all passed after tightening proof comparison to stable normalized JSON rather than incidental object key order.
- [x] 2026-04-29T14:17:16Z Refreshed active docs to mark FP-0064 as the shipped F6O record and to state that F6P planning should start next only as a new Finance Plan.
- [x] 2026-04-29T14:30:44Z Ran the full implementation validation ladder, including the new direct F6O proof, shipped F6 guardrail smokes, twin guardrails, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed.

## Surprises & Discoveries

The safest additional source-pack expansion is receivables/payables, not external provider integration.
The repo already has deterministic `receivables_aging_csv` and `payables_aging_csv` extraction, source-backed Finance Twin reads, and shipped monitor proof over collections/payables posture.
That lets F6O stay source-pack-only.

F6L is a useful template but should not be copied into a broad source-pack platform.
The F6O implementation should mirror the F6L shape only where it preserves the narrow contract: one manifest or fixture family, checked-in static sources, normalized expected posture, direct proof, family-boundary assertions, and raw fixture immutability.

The existing `pocket-cfo-monitor-demo` stack-pack already contains receivables and payables sources for monitor replay.
F6O should not mutate those fixture semantics.
The safer first implementation is a separate receivables/payables source-pack fixture family.
Integration with the existing demo replay should remain absent unless this plan is explicitly amended and the integration does not change existing fixture semantics.

The current source registry and Finance Twin routes are sufficient for the proof path.
No new database table, route, schema, migration, extractor, monitor evaluator, mission behavior, checklist behavior, readiness behavior, acknowledgement behavior, delivery-readiness behavior, review-summary behavior, report behavior, approval behavior, runtime-Codex behavior, notification provider, or external action is needed.

The implementation matched that route-only proof path.
The only proof polish needed was making the JSON comparison stable by object key rather than depending on runtime insertion order; the normalized posture itself already matched the existing source registry and Finance Twin route output.

## Decision Log

Decision: proceed with `F6O-receivables-payables-source-pack-foundation` rather than switch to F6P external provider integration planning.
Rationale: F6L bank/card source-pack proof, receivables-aging sync, payables-aging sync, collections-pressure monitoring, and payables-pressure monitoring are green and source-backed.
F6P would require human-review gates, provider boundaries, compliance posture, observability, retry behavior, safe failure modes, and no autonomous send semantics that are not ready to implement from the current repo truth.

Decision: F6O is one source-pack family only.
Rationale: the pack proves exactly receivables-aging and payables-aging source/twin posture.
Adding bank/card, contract, card-expense, policy, report, or monitor-demo concerns would dilute the slice and risk mutating shipped proof semantics.

Decision: source roles are limited to `receivables_aging` and `payables_aging`.
Rationale: those roles align with shipped F2L/F2M Finance Twin support and shipped F6C/F6D monitor dependencies.
They are source posture roles, not monitor families or discovery families.

Decision: extractor keys are limited to `receivables_aging_csv` and `payables_aging_csv`.
Rationale: those extractors already exist and are green.
F6O must not introduce new extractors or generic parser dispatch behavior.

Decision: F6O is not a monitor-family expansion.
Rationale: monitor families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`.
F6O must not add `spend_posture`, `obligation_calendar_review`, `receivables_aging_review`, `payables_aging_review`, `covenant_risk`, or any new monitor result semantics.

Decision: F6O is not a discovery-family expansion.
Rationale: discovery families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, `spend_posture`, `obligation_calendar_review`, and `policy_lookup`.
F6O must not add generic chat, receivables-aging review, payables-aging review, runway, burn variance, concentration, covenant risk, anomaly review, or spend exceptions.

Decision: F6O is not external delivery.
Rationale: email, Slack, SMS, webhooks, notification provider calls, outbox sends, report delivery, external publish behavior, and provider integration belong only to a future plan that proves safety and review gates.

Decision: F6O expands source packs, not product runtime behavior.
Rationale: the implementation should define checked-in static source-pack posture and prove it through existing routes only.
It must not add DB tables, routes, schema, migrations, package scripts, root smoke aliases, monitor evaluators, missions, checklist/readiness/acknowledgement/delivery-readiness/review-summary behavior, reports, approvals, runtime-Codex, delivery, payment behavior, finance writes, legal advice, policy advice, collection instructions, customer-contact instructions, or autonomous actions.

Decision: no package script or root smoke alias is authorized by this plan.
Rationale: the first implementation should use focused package specs plus one direct proof tool invocation, mirroring F6L's direct proof posture.
If a packaged smoke alias becomes necessary, FP-0064 must be explicitly amended first.

Decision: create exactly one checked-in source-pack fixture family and no eval dataset.
Rationale: F6O needs immutable raw receivables/payables source files to prove normalized source/twin posture, but FP-0064 forbids broad eval datasets.
The shipped fixture family is `packages/testkit/fixtures/f6o-receivables-payables-source-pack/**`.

Decision: the proof path uses existing source registration/upload routes and existing Finance Twin sync/read routes only.
Rationale: allowed proof inputs are checked-in static source-pack files, expected normalized source/twin posture, existing source registration/upload routes, and existing Finance Twin receivables-aging/payables-aging sync and read routes.
Generic chat, report artifacts as primary input, runtime-Codex, mission-generated prose, monitor reruns, checklist/readiness/acknowledgement/delivery-readiness/review-summary paths, and external communications are out of scope.

Decision: likely later slices are named but not created here.
Rationale: `F6P-external-provider-integration` should happen only if a future plan proves human-review gates, provider boundaries, compliance posture, observability, retry behavior, safe failure modes, and no autonomous send.
`F6Q-close/control-certification` should happen only if operator need, evidence boundaries, legal boundaries, and review gates are proven.
`F6R-additional-source-pack-expansion` should happen only after the receivables/payables source pack remains green.
Do not create FP-0065, F6P, F6Q, or F6R in this slice.

Decision: ship F6O with a direct proof command rather than a root package script or smoke alias.
Rationale: FP-0064 explicitly prohibited package-script and smoke-alias additions unless amended.
The direct proof command is `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`.

Decision: keep F6O separate from the F6F monitor demo pack and F6L bank/card source pack.
Rationale: a separate `pocket-cfo-receivables-payables-source-pack` manifest and fixture family proves receivables/payables source posture without mutating shipped demo or bank/card raw fixtures.

Decision: F6P planning should start next only through a new Finance Plan.
Rationale: FP-0064 is now the shipped F6O implementation record and did not start F6P implementation or create FP-0065.

## Context and Orientation

Pocket CFO has shipped F6A through F6N:

- F6A deterministic `cash_posture` monitor result and alert card
- F6B manual taskless investigation handoff from one persisted alerting `cash_posture` monitor result
- F6C deterministic `collections_pressure` monitor result and alert card
- F6D deterministic `payables_pressure` monitor result and alert card
- F6E deterministic `policy_covenant_threshold` monitor result and alert card
- F6F deterministic monitor demo replay and Pocket CFO demo stack-pack foundation
- F6G manual taskless investigation handoff from one persisted alerting `collections_pressure` monitor result while preserving cash and rejecting payables and policy/covenant investigations
- F6H deterministic close/control checklist foundation from stored Finance Twin source posture, stored CFO Wiki policy/source posture, and latest persisted monitor results as context only
- F6I normalized close/control expected-output expansion on the existing monitor demo stack-pack replay proof
- F6J deterministic internal operator attention/readiness read model over shipped stored state only
- F6K deterministic internal close/control acknowledgement-readiness read model over shipped checklist and operator-readiness posture only
- F6L checked-in bank/card source-pack foundation with normalized source/twin posture and direct proof through existing source registry and Finance Twin routes only
- F6M deterministic internal delivery-readiness boundary read model over shipped operator-readiness and acknowledgement-readiness posture only
- F6N deterministic internal close/control review-summary read model over shipped checklist, operator-readiness, acknowledgement-readiness, and delivery-readiness posture only
- F6O checked-in receivables/payables source-pack foundation with normalized source/twin posture and direct proof through existing source registry and Finance Twin routes only

The F6O implementation started from these shipped facts:

- F6L direct proof command: `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
- receivables-aging sync proof: `pnpm smoke:finance-twin-receivables-aging:local`
- payables-aging sync proof: `pnpm smoke:finance-twin-payables-aging:local`
- collections monitor proof: `pnpm smoke:collections-pressure-monitor:local`
- payables monitor proof: `pnpm smoke:payables-pressure-monitor:local`
- fixed monitor family enum in `packages/domain/src/monitoring.ts`
- fixed discovery-family list in the finance-discovery domain contract
- existing source routes in `apps/control-plane/src/modules/sources/**`
- existing Finance Twin sync and read routes in `apps/control-plane/src/modules/finance-twin/**`
- existing stack-pack source-pack contract in `packages/stack-packs/src/stack-pack.ts`
- existing F6L fixture/proof pattern in `packages/testkit/fixtures/f6l-bank-card-source-pack/**` and `tools/bank-card-source-pack-proof.mjs`

Implemented F6O seams:

- `packages/stack-packs/src/stack-pack.ts`
- `packages/stack-packs/src/packs/pocket-cfo-receivables-payables-source-pack.ts`
- `packages/stack-packs/src/index.ts`
- `packages/stack-packs/src/stack-pack.spec.ts`
- `packages/testkit/fixtures/f6o-receivables-payables-source-pack/README.md`
- `packages/testkit/fixtures/f6o-receivables-payables-source-pack/sources/receivables-aging.csv`
- `packages/testkit/fixtures/f6o-receivables-payables-source-pack/sources/payables-aging.csv`
- `packages/testkit/fixtures/f6o-receivables-payables-source-pack/expected-source-twin-posture.json`
- `packages/testkit/src/f6o-receivables-payables-source-pack.spec.ts`
- `tools/receivables-payables-source-pack-proof.mjs`

These implementation targets now exist for F6O except `packages/stack-packs/src/stack-pack.ts`, which was extended narrowly only because the existing bank/card-specific source-pack type did not support receivables/payables roles.

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No source mutation outside the existing proof upload/sync setup occurred.
No database schema migration, package script, smoke alias, route, eval dataset, monitor family, discovery family, report, approval, delivery behavior, provider integration, outbox send, payment behavior, finance write, legal/policy advice, collection/customer-contact instruction, certification, close-complete status, sign-off, attestation, or autonomous action belongs in F6O.

## Plan of Work

First, the implementation adds one narrow receivables/payables source-pack manifest.
The manifest should describe source file roles, checked-in source file paths, source kinds, media types, expected extractor keys, normalized expected source posture, normalized expected Finance Twin posture, limitations, and the runtime/delivery/action boundary.
The manifest must not include monitor-family or discovery-family fields.

Second, the implementation adds one checked-in static fixture family.
The fixture family should include exactly one receivables-aging CSV and one payables-aging CSV, plus one normalized expected source/twin posture file.
The raw source files must remain immutable.
The normalized expected posture must exclude generated ids, timestamps, source ids, snapshot ids, source-file ids, sync-run ids, storage refs, and other volatile values.

Third, the implementation adds one deterministic direct proof path.
The proof should register the checked-in source files through existing source routes, upload them without rewriting the files, sync each source file through existing Finance Twin routes, read existing receivables-aging, collections-posture, payables-aging, and payables-posture views, compare normalized source/twin posture against the expected file, prove raw fixture checksums remain unchanged, and assert family/runtime/action absence boundaries.

Fourth, the implementation preserves shipped F5 and F6 behavior.
It must not change monitor evaluators, F6B/F6G mission handoffs, F6H checklist behavior, F6J readiness behavior, F6K acknowledgement behavior, F6L bank/card source-pack behavior, F6M delivery-readiness behavior, F6N review-summary behavior, F5 reporting/release/circulation/correction behavior, approval kinds, report conversion, monitor families, or discovery families.

Fifth, active docs are refreshed after implementation behavior exists.
This implementation marks FP-0064 as shipped after the fixture, manifest, proof, docs, and validation land.

## Concrete Steps

1. Add the source-pack manifest.
   Files:
   - `packages/stack-packs/src/stack-pack.ts`
   - `packages/stack-packs/src/packs/pocket-cfo-receivables-payables-source-pack.ts`
   - `packages/stack-packs/src/index.ts`
   - `packages/stack-packs/src/stack-pack.spec.ts`

   Required behavior:
   - source-pack id is `pocket-cfo-receivables-payables-source-pack`
   - source roles must be exactly `receivables_aging` and `payables_aging`
   - expected extractor keys must be exactly `receivables_aging_csv` and `payables_aging_csv`
   - source kinds should remain checked-in static dataset posture
   - media types should remain CSV-oriented, likely `text/csv`
   - no monitor-family fields
   - no discovery-family fields
   - no mission types
   - no report kinds
   - no approval kinds
   - no runtime-Codex semantics
   - no delivery semantics

2. Add one checked-in receivables/payables source-pack fixture family.
   Files:
   - `packages/testkit/fixtures/f6o-receivables-payables-source-pack/README.md`
   - `packages/testkit/fixtures/f6o-receivables-payables-source-pack/sources/receivables-aging.csv`
   - `packages/testkit/fixtures/f6o-receivables-payables-source-pack/sources/payables-aging.csv`
   - `packages/testkit/fixtures/f6o-receivables-payables-source-pack/expected-source-twin-posture.json`
   - `packages/testkit/src/f6o-receivables-payables-source-pack.spec.ts`

   Required fixture contract:
   - raw source files are immutable
   - source file list is explicit
   - source roles are explicit
   - parser/sync expectations are explicit
   - normalized source posture is explicit
   - normalized Finance Twin receivables/payables posture is explicit
   - limitations expose ambiguous, missing, partial, unsupported, stale, or conflicting evidence instead of hiding it
   - generated ids, timestamps, source ids, snapshot ids, source-file ids, sync-run ids, and storage refs are excluded from expected comparison

3. Add one deterministic direct proof path.
   File:
   - `tools/receivables-payables-source-pack-proof.mjs`

   Required proof behavior:
   - register the checked-in receivables/payables source files through existing source routes
   - upload the checked-in source files without rewriting them
   - sync source files through existing Finance Twin routes
   - read existing receivables-aging and collections-posture views
   - read existing payables-aging and payables-posture views
   - compare normalized source/twin posture to expected output
   - prove fixture source checksums remain unchanged
   - assert no monitors are run by the source-pack proof
   - assert no checklist, readiness, acknowledgement, delivery-readiness, review-summary, mission, report, approval, delivery, runtime-Codex, finance-action, monitor-family, or discovery-family behavior is added
   - do not add a root package script or smoke alias unless FP-0064 is amended first

4. Preserve existing shipped demo and bank/card pack semantics.
   The implementation must not mutate:
   - `packages/testkit/fixtures/f6f-monitor-demo-stack/sources/**`
   - `packages/testkit/fixtures/f6f-monitor-demo-stack/expected-monitor-results.json`
   - `packages/testkit/fixtures/f6f-monitor-demo-stack/expected-close-control-checklist.json`
   - `packages/testkit/fixtures/f6l-bank-card-source-pack/**`
   - `tools/bank-card-source-pack-proof.mjs`

   The existing demo pack and bank/card pack can remain guardrails, but F6O should not prove itself by changing their source meaning.

5. Preserve shipped F5 and F6 behavior.
   The implementation must not change:
   - F5 report/release/circulation/correction behavior
   - monitor evaluators
   - F6B/F6G mission handoffs
   - F6H checklist behavior
   - F6J readiness behavior
   - F6K acknowledgement behavior
   - F6L bank/card source-pack behavior
   - F6M delivery-readiness behavior
   - F6N review-summary behavior
   - approval kinds
   - report conversion
   - runtime-Codex, delivery, notification, payment, legal/policy-advice, collection/customer-contact, or autonomous-action posture

6. Refresh active docs after implementation.
   Expected docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - `docs/ops/local-dev.md` only if validation commands or source-pack proof instructions change
   - `docs/ops/source-ingest-and-cfo-wiki.md` only if source/freshness/source-pack wording changes
   - `docs/ops/codex-app-server.md` only if runtime-boundary wording changes
   - `evals/README.md` and `docs/benchmarks/seeded-missions.md` only if proof/eval wording changes

## Validation and Acceptance

This implementation slice must run the requested DB-backed smokes and repo checks after docs edits:

- `pnpm smoke:delivery-readiness:local`
- `pnpm smoke:operator-readiness:local`
- `pnpm smoke:close-control-acknowledgement:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
- `pnpm smoke:monitor-demo-replay:local`
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
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

F6O implementation acceptance requires all of the following:

- one receivables/payables source-pack manifest or fixture contract exists
- source roles are exactly `receivables_aging` and `payables_aging`
- extractor keys are exactly `receivables_aging_csv` and `payables_aging_csv`
- checked-in static source files exist for receivables-aging and payables-aging only
- raw fixture source files remain immutable
- source roles, source kinds, media types, parser/sync expectations, and limitations are explicit
- normalized expected source/twin posture exists and excludes generated ids and timestamps
- existing source registration/upload routes and Finance Twin sync/read routes prove the pack
- receivables-aging sync remains source-backed
- payables-aging sync remains source-backed
- collections-posture and payables-posture proof exposes provenance, freshness posture, lineage, diagnostics, and limitations
- proof asserts no new monitor family or discovery family is added
- proof asserts no new monitor result semantics, checklist item family, readiness behavior, acknowledgement behavior, delivery-readiness behavior, review-summary behavior, investigation behavior, report behavior, approval behavior, delivery behavior, runtime-Codex behavior, finance write, legal/policy advice, payment behavior, collection/customer-contact instruction, or autonomous action is added
- shipped F5 and F6 behavior remains unchanged

The implementation validation ladder includes the focused stack-pack/testkit specs and direct proof command in addition to the shipped F6 guardrail ladder.
Do not add a packaged root smoke alias unless this plan is amended first.

## Idempotence and Recovery

This implementation slice is retry-safe because all runtime behavior uses existing source registration/upload and Finance Twin sync routes, while normalized proof output excludes generated ids and timestamps.
No route, schema, migration, package script, smoke alias, eval dataset, monitor family, discovery family, runtime-Codex behavior, delivery behavior, report behavior, approval behavior, finance write, advice/instruction, generated prose, or autonomous action is changed.

The implementation is retry-safe by using deterministic source registration/upload and Finance Twin sync behavior, normalized expected output, and idempotent proof assertions over generated ids and timestamps.
If repeated proof runs create new source ids or sync-run ids, those values must remain excluded from normalized expected posture.

Raw source fixtures must never be rewritten to make proof pass.
If a future continuation finds the fixture stale, partial, ambiguous, unsupported, conflicting, or insufficient, the expected posture and proof output should expose that limitation rather than normalizing it away.

Rollback for this implementation should remove only additive F6O manifest, fixture, proof, and docs changes.
Rollback must leave FP-0050 through FP-0063, shipped monitor behavior, shipped alert handoff behavior, shipped checklist behavior, shipped demo replay behavior, shipped operator-readiness behavior, shipped acknowledgement-readiness behavior, shipped bank/card source-pack behavior, shipped delivery-readiness behavior, shipped review-summary behavior, F5 reporting/approval/release/circulation behavior, raw sources, CFO Wiki state, Finance Twin state, and GitHub/engineering-twin modules intact.
No destructive database migration belongs in F6O.

## Artifacts and Notes

This implementation slice creates:

- `packages/stack-packs/src/packs/pocket-cfo-receivables-payables-source-pack.ts`
- `packages/testkit/fixtures/f6o-receivables-payables-source-pack/**`
- `packages/testkit/src/f6o-receivables-payables-source-pack.spec.ts`
- `tools/receivables-payables-source-pack-proof.mjs`
- active-doc updates that identify FP-0064 as the shipped F6O record
- one narrow source-pack type extension for receivables/payables roles in `packages/stack-packs/src/stack-pack.ts`
- one direct deterministic proof command: `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`
- no routes
- no schema
- no migrations
- no package scripts
- no root smoke aliases
- no eval datasets
- no monitor-family or discovery-family expansion
- no runtime-Codex
- no external provider integration
- no delivery, notification provider, outbox send, email, Slack, SMS, webhook, report, approval, mission creation, monitor rerun, monitor-result creation, source mutation outside proof upload/sync setup, payment behavior, accounting write, bank write, tax filing, legal/policy advice, collection/customer-contact instruction, certification, sign-off, close-complete status, attestation, report release, report circulation, generated prose, or autonomous action behavior

No FP-0065 is created in this slice.
No F6P, F6Q, F6R, or later implementation work starts here.

Likely later slices, not created here:

- `F6P-external-provider-integration`, only if a future plan proves human-review gates, provider boundaries, compliance posture, observability, retry behavior, safe failure modes, and no autonomous send
- `F6Q-close/control-certification`, only if operator need, evidence boundaries, legal boundaries, and review gates are proven
- `F6R-additional-source-pack-expansion`, only after the receivables/payables source pack remains green and source-backed

## Interfaces and Dependencies

Package boundaries must remain unchanged:

- `packages/domain` owns pure contracts for monitors, Finance Twin source/freshness/lineage vocabulary, discovery families, close/control, readiness, acknowledgement, delivery-readiness, review-summary, proof, mission, reporting, and approval vocabulary
- `packages/db` remains untouched because F6O does not need schema, migrations, tables, or persistence beyond existing source and Finance Twin state
- `packages/stack-packs` owns source-pack manifest contracts and should avoid leaking monitor/discovery/runtime semantics into a source-pack manifest
- `packages/testkit` owns checked-in static fixtures and expected normalized posture files
- `apps/control-plane/src/modules/sources` owns existing source registration/upload/provenance behavior and must not be changed unless a direct truthfulness bug is found
- `apps/control-plane/src/modules/finance-twin` owns existing receivables-aging and payables-aging sync/read behavior and must not be changed unless a direct truthfulness bug is found
- `apps/control-plane/src/modules/monitoring` owns shipped monitor behavior and must not be changed for F6O
- `apps/control-plane/src/modules/close-control`, `operator-readiness`, `close-control-acknowledgement`, `delivery-readiness`, and `close-control-review-summary` remain out of scope except as guardrails proving no behavior changed
- `apps/control-plane/src/modules/reporting` and `apps/control-plane/src/modules/approvals` remain out of scope

Runtime-Codex stays out of scope:

- no runtime-Codex source-pack generation
- no runtime-Codex finance fact extraction
- no runtime-Codex monitoring findings
- no runtime-Codex delivery text
- no runtime-Codex investigation writeups
- no runtime-owned finance facts

Delivery, reporting, approval, certification, and autonomous action stay out of scope:

- no certification
- no close-complete status
- no sign-off
- no attestation
- no legal or audit opinion
- no report release
- no report circulation
- no external publish
- no email
- no Slack
- no SMS
- no webhooks
- no notification providers
- no outbox sends
- no scheduled notifications
- no auto-send
- no payment instruction
- no vendor-payment recommendation
- no collection instruction
- no customer-contact instruction
- no accounting write
- no bank write
- no tax filing
- no legal advice
- no policy advice
- no generated prose
- no external action
- no autonomous action

Current module vocabulary stays stable.
Do not rename `modules/twin/**`, `modules/reporting/**`, or `@pocket-cto/*`.
Do not delete GitHub or engineering-twin modules as part of F6O.

## Outcomes & Retrospective

This implementation slice ships FP-0064 as the F6O receivables/payables source-pack foundation after repo-truth inspection proved the safe next slice was source-pack proof, not external provider integration implementation.
It adds exactly one receivables/payables source-pack manifest family, one immutable checked-in fixture set, one normalized expected source/twin posture file, and one direct proof command.
It does not start F6P implementation.
Final validation status is recorded in the Progress section.

What remains next:

- F6P planning should start next only as a new Finance Plan.
- Do not create FP-0065, start F6P implementation, add package scripts, smoke aliases, eval datasets, routes, schema, migrations, runtime-Codex, delivery, notifications, outbox sends, reports, approvals, finance writes, advice/instructions, autonomous action, new monitor families, or new discovery families from this shipped F6O record alone.
