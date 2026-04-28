# Define F6I stack-pack expansion and close/control demo foundation

## Purpose / Big Picture

This file is the active Finance Plan for the Pocket CFO F6I implementation slice.
The target phase is `F6`, and the implementation slice is exactly `F6I-stack-pack-expansion-and-close-control-demo-foundation`.

The user-visible goal is narrow: after shipped F6A through F6H, a new operator should be able to replay the existing Pocket CFO demo stack and see one deterministic proof that the source-backed monitor stack and the source-backed close/control checklist agree on the same checked-in evidence posture.
F6I should expand the existing `pocket-cfo-monitor-demo` stack-pack foundation, not create a second broad demo platform.
The next implementation thread should add normalized close/control checklist expectations to the existing demo pack and extend the existing replay proof to verify them after the shipped monitor and handoff replay.

F6I is not a monitor family.
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

This plan is implementation-ready, but no F6I implementation has started in this docs-and-plan thread.
F6I must remain deterministic, runtime-free, delivery-free, report-free, approval-free, payment-free, legal-advice-free, policy-advice-free, collection-instruction-free, customer-contact-instruction-free, and non-autonomous.
GitHub connector work is explicitly out of scope.

## Progress

- [x] 2026-04-28T13:01:26Z Invoke the requested Pocket CFO operator plugin guards, run preflight, confirm the branch, GitHub access, Docker services, and clean worktree, then read the required active docs, shipped F6A through F6H records, stack-pack fixture, expected monitor manifest, replay smoke, checklist smoke, and package scripts.
- [x] 2026-04-28T13:01:26Z Decide that F6I is ready and should expand the existing `pocket-cfo-monitor-demo` stack-pack with normalized close/control checklist expected output rather than start a different stack-pack expansion.
- [x] 2026-04-28T13:01:26Z Create FP-0058 as the single active implementation-ready F6I contract while preserving FP-0050 through FP-0057 as shipped F6A through F6H records.
- [x] 2026-04-28T13:01:26Z Refresh the active-doc spine so the next implementation thread starts from this F6I contract and does not reopen shipped monitor, investigation, report, approval, runtime, delivery, or checklist behavior.
- [x] 2026-04-28T13:13:10Z Run the requested docs-and-plan validation ladder and confirm the docs-and-plan-only contract stays green.
- [ ] Implement the first F6I slice in a later thread by extending the existing demo stack-pack expected outputs and replay proof only.

## Surprises & Discoveries

The F6F replay and F6H checklist smoke already share the same checked-in source-backed demo fixture.
`pnpm smoke:monitor-demo-replay:local` bootstraps `demo-monitor-stack` from immutable bank/cash, receivables-aging, payables-aging, and policy-threshold sources, verifies the four shipped monitor families, proves cash plus collections investigation handoffs where alerting, proves payables and policy/covenant investigations absent, and verifies fixture source immutability.

The F6H checklist smoke already proves the close/control read over stored source, wiki, and latest monitor-result posture.
`pnpm smoke:close-control-checklist:local` registers the same fixture source set, syncs the Finance Twin, compiles CFO Wiki policy posture, runs the shipped monitor stack, reads `GET /close-control/companies/:companyKey/checklist`, verifies checklist item posture and aggregate status, asserts no checklist-triggered monitor runs or side effects, and verifies fixture source immutability.

The close/control checklist output is normalizable without changing F6H behavior.
The read model contains generated `generatedAt` plus generated source, snapshot, source-file, sync-run, and monitor-result ids inside evidence refs.
Those fields can be normalized away while preserving item families, item statuses, aggregate status, source posture states, evidence-basis kinds, freshness states, proof posture states, limitation presence, human-review next-step presence, runtime/action boundary fields, and monitor-family coverage.

The current `pocket-cfo-monitor-demo` stack-pack contract points at a monitor-only expected manifest.
F6I should not rename the shipped monitor fixture or mutate raw source files.
The safer implementation shape is an adjacent expected close/control checklist file plus a small stack-pack manifest extension, so monitor expectations remain stable while the demo pack grows one proof surface.

No blocking F6I readiness gap was found.
The readiness checks passed locally before this plan was written:

- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:close-control-checklist:local`

## Decision Log

Decision: proceed with F6I as `F6I-stack-pack-expansion-and-close-control-demo-foundation`.
Rationale: repo truth already has a deterministic source-backed demo company, shipped monitor expectations, shipped cash plus collections handoff boundaries, and a shipped close/control checklist read over the same stored source/wiki/monitor-result posture.

Decision: F6I expands the existing `pocket-cfo-monitor-demo` stack-pack.
Rationale: the existing pack already owns the checked-in fixture set and deterministic monitor replay proof. A second demo platform would duplicate source registration, freshness, and replay semantics without adding truth.

Decision: add expected close/control checklist output as an adjacent expected file.
Rationale: `expected-monitor-results.json` is already the shipped monitor-output contract. An adjacent file such as `expected-close-control-checklist.json` can carry normalized checklist expectations without renaming or broadening the monitor manifest.

Decision: update the existing replay proof rather than adding a new package script.
Rationale: F6I should make `pnpm smoke:monitor-demo-replay:local` prove the combined demo contract after existing monitor and handoff replay. `pnpm smoke:close-control-checklist:local` remains the shipped F6H standalone proof and should stay green.

Decision: the F6I input contract is one checked-in demo stack-pack fixture set.
Rationale: inputs are the existing immutable source files for bank/cash, receivables aging, payables aging, and policy thresholds; the existing expected monitor results; one new normalized expected close/control checklist result; the existing source registration and replay route flow; no generic chat; no report artifact input; no runtime-Codex; and no monitor reruns from the checklist path.

Decision: the F6I output contract is one deterministic replay proof.
Rationale: the proof should verify the four shipped monitor families, cash and collections handoffs where alerting, payables and policy/covenant investigations absent, close/control checklist items, close/control aggregate status, close/control absence boundary, fixture source immutability, and no new monitor or discovery families.

Decision: F6I must not add product runtime semantics.
Rationale: the slice is fixture/replay/proof-oriented. It must not add routes, schema, migrations, monitor evaluators, mission behavior, runtime-Codex behavior, delivery, reports, approvals, accounting writes, bank writes, tax filings, payment behavior, legal or policy advice, collection/customer-contact instructions, or autonomous actions.

Decision: F6I should not add checklist item families unless a direct F6H truthfulness gap is proven first.
Rationale: the shipped F6H item families already cover source coverage, cash freshness, receivables-aging freshness, payables-aging freshness, policy-source freshness, and monitor replay readiness. F6I is an expected-output proof extension, not checklist behavior expansion.

Decision: preserve shipped F5 and F6 behavior.
Rationale: no F5 reporting approval/release/circulation/correction changes, no monitor evaluator changes, no F6B/F6G mission changes, no F6H checklist behavior changes beyond direct replay expectation proof, no new approval kind, and no report conversion belong in F6I.

Decision: define later slices without creating them.
Rationale: likely later work is `F6J-notification/delivery planning` only if a future operator need is proven safe, `F6K-close/control acknowledgement` only if operator need is proven, and `F6L-source-pack expansion` only after this one demo pack is green and source-backed. Do not create those plans in F6I.

## Context and Orientation

Pocket CFO has shipped:

- F6A deterministic `cash_posture` monitor result and alert card
- F6B manual taskless investigation handoff from one persisted alerting `cash_posture` monitor result
- F6C deterministic `collections_pressure` monitor result and alert card
- F6D deterministic `payables_pressure` monitor result and alert card
- F6E deterministic `policy_covenant_threshold` monitor result and alert card
- F6F one deterministic monitor demo replay and one Pocket CFO demo stack-pack foundation
- F6G manual taskless investigation handoff from one persisted alerting `collections_pressure` monitor result while preserving cash and rejecting payables and policy/covenant investigations
- F6H one deterministic close/control checklist foundation from stored Finance Twin source posture, stored CFO Wiki policy/source posture, and latest persisted monitor results as context only

The relevant implementation seams for F6I are:

- `packages/stack-packs/src/stack-pack.ts` for the finance demo stack-pack contract
- `packages/stack-packs/src/packs/pocket-cfo-monitor-demo.ts` for the existing demo pack manifest
- `packages/stack-packs/src/stack-pack.spec.ts` for stack-pack expectations
- `packages/testkit/fixtures/f6f-monitor-demo-stack/README.md` for fixture ownership and raw-source immutability guidance
- `packages/testkit/fixtures/f6f-monitor-demo-stack/sources/**` for immutable demo source files
- `packages/testkit/fixtures/f6f-monitor-demo-stack/expected-monitor-results.json` for shipped normalized monitor expectations
- a new adjacent expected checklist file under `packages/testkit/fixtures/f6f-monitor-demo-stack/`
- `tools/monitor-demo-replay-smoke.mjs` for the combined replay proof
- `tools/close-control-checklist-smoke.mjs` for the shipped standalone F6H checklist proof, which should remain unchanged except for validation if the F6I implementation discovers a direct truthfulness gap
- `apps/control-plane/src/modules/close-control/**` for the read-only checklist route and service that F6I should consume but not modify unless a direct F6H truthfulness gap is proven

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No new package script is expected.

## Plan of Work

First, extend the existing demo stack-pack contract with a close/control expected-output reference.
The preferred shape is a small additive field such as `expectedCloseControlChecklistPath` on the finance demo pack contract, plus an update to `pocketCfoMonitorDemoPack`.
This should not change the legacy `StackPack` interface used by the old engineering-shaped pack.

Second, add one adjacent normalized expected close/control checklist file.
The expected file should be generated from the current demo checklist posture but must exclude generated ids and timestamps.
It should preserve deterministic posture fields that a human can review: aggregate status, each checklist item family and status, source-posture state, evidence-basis kind, freshness state, proof-posture state, limitation presence, human-review next-step presence, runtime/action boundary fields, and monitor-family coverage for monitor replay readiness.

Third, update the existing monitor demo replay smoke to verify close/control output after existing monitor and handoff replay.
The replay should call `GET /close-control/companies/demo-monitor-stack/checklist`, normalize the response, compare it to the new expected checklist output, and assert that the checklist read creates no monitor results, missions, reports, approvals, outbox events, runtime-Codex threads, payment instructions, or other forbidden side effects.
It should continue to verify fixture source immutability and no new monitor or discovery families.

Fourth, preserve the standalone F6H checklist smoke.
`pnpm smoke:close-control-checklist:local` remains the narrow checklist proof and should keep asserting missing-source posture, limited posture, context-only monitor results, and no side effects.
F6I should not make the checklist smoke depend on the monitor demo replay.

Fifth, refresh docs only where behavior actually changes.
Docs should say that F6I extends expected replay proof for the existing demo pack; they should not claim a new monitor family, discovery family, route, schema, runtime behavior, delivery workflow, report workflow, approval workflow, or autonomous action exists.

## Concrete Steps

1. Extend the finance demo stack-pack manifest in the implementation thread.
   Expected files:
   - `packages/stack-packs/src/stack-pack.ts`
   - `packages/stack-packs/src/packs/pocket-cfo-monitor-demo.ts`
   - `packages/stack-packs/src/stack-pack.spec.ts`

   Required behavior:
   - keep `id = "pocket-cfo-monitor-demo"`
   - keep the same fixture directory
   - keep the same four source files
   - keep the same four monitor families
   - add only a close/control expected-output path or equivalent manifest pointer
   - do not add monitor families, discovery families, mission types, report kinds, approval kinds, or runtime-Codex semantics

2. Add the normalized close/control expected output.
   Expected file:
   - `packages/testkit/fixtures/f6f-monitor-demo-stack/expected-close-control-checklist.json`

   Required normalized fields:
   - `companyKey`
   - `aggregateStatus`
   - each checklist item `family`
   - each checklist item `status`
   - each item source-posture state
   - each item evidence-basis kind
   - each item freshness state
   - each item proof-posture state
   - whether limitations and human-review next steps are present
   - runtime/action boundary fields, all false
   - monitor replay readiness covers exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`

   Generated fields to exclude:
   - `generatedAt`
   - source ids
   - source snapshot ids
   - source file ids
   - sync run ids
   - monitor result ids
   - mission ids
   - raw timestamps that are generated during replay

3. Update the fixture README.
   Expected file:
   - `packages/testkit/fixtures/f6f-monitor-demo-stack/README.md`

   Required docs:
   - the fixture now has expected monitor output plus expected close/control checklist output
   - raw source files remain immutable
   - checklist expectations normalize generated ids and timestamps
   - the close/control checklist is read-only review posture, not close completion
   - the pack remains runtime-free, delivery-free, report-free, approval-free, payment-free, legal/policy-advice-free, collection/customer-contact-instruction-free, and non-autonomous

4. Extend the replay smoke without adding a new script.
   Expected file:
   - `tools/monitor-demo-replay-smoke.mjs`

   Required behavior:
   - keep existing source registration, upload, sync, policy binding, wiki compile, monitor run, latest monitor read, handoff, absence, family, and source immutability assertions
   - after existing monitor and handoff replay, read the close/control checklist for `demo-monitor-stack`
   - normalize the checklist response and compare it to the expected close/control file
   - assert the checklist read creates no new monitor result, mission, report artifact, approval, outbox delivery event, runtime-Codex thread, payment instruction, accounting write, bank write, tax filing, legal advice, policy advice, collection instruction, customer-contact instruction, or autonomous action
   - keep payables and policy/covenant investigations absent
   - keep no new monitor or discovery family assertions

5. Add or update narrow specs only for the changed fixture and stack-pack proof.
   Expected files:
   - `packages/stack-packs/src/stack-pack.spec.ts`
   - `packages/testkit/src/f6f-monitor-demo-fixture.spec.ts` or the current adjacent fixture spec

   Required behavior:
   - stack-pack spec sees the close/control expected-output path
   - fixture spec validates both expected monitor results and expected checklist output shape
   - no eval dataset or new smoke alias is added

6. Refresh active docs after behavior changes.
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

This docs-and-plan thread must run the requested validation ladder:

- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:close-control-checklist:local`
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

The F6I implementation thread should run at least:

- `pnpm --filter @pocket-cto/stack-packs exec vitest run`
- `pnpm --filter @pocket-cto/testkit exec vitest run`
- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:close-control-checklist:local`
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

F6I implementation acceptance is observable only if all of the following are true:

- one existing demo stack-pack fixture set remains the source of truth for the demo
- raw fixture source files are unchanged
- the existing monitor expected output still verifies `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`
- the new normalized close/control expected output verifies the shipped checklist item families and aggregate status
- the replay verifies cash and collections handoffs where alerting
- the replay verifies payables and policy/covenant investigations remain absent
- the close/control checklist read remains context-only and does not rerun monitors
- no new monitor family or discovery family is added
- no new monitor condition kind is added
- no new investigation behavior is added
- no new route, schema, migration, package script, eval dataset, runtime-Codex behavior, delivery behavior, report behavior, approval behavior, payment behavior, legal or policy advice, collection/customer-contact instruction, or autonomous action is added
- F5 reporting and shipped F6 monitor, handoff, demo replay, and checklist behavior remain green

## Idempotence and Recovery

F6I implementation must be retry-safe.
The existing replay uses a fixed demo company key and timestamped monitor run keys; expected output comparison must continue to normalize generated ids and timestamps so retries do not look like product changes.

Raw fixture source files must not be rewritten.
If the expected close/control checklist output does not match the current route response, first determine whether the mismatch is generated identity/timestamp noise, an expected-output fixture gap, or a real F6H truthfulness bug.
Only real F6H truthfulness bugs should touch checklist behavior, and they must be recorded in this plan before implementation.

Rollback should revert only the additive stack-pack manifest field, expected checklist output file, replay-smoke expectation checks, fixture docs, and active-doc updates.
Rollback must leave FP-0050 through FP-0057, shipped monitor behavior, shipped alert handoff behavior, shipped checklist behavior, raw sources, CFO Wiki state, Finance Twin state, F5 reporting/approval behavior, and GitHub/engineering-twin modules intact.

## Artifacts and Notes

Expected F6I implementation artifacts:

- `plans/FP-0058-stack-pack-expansion-and-close-control-demo-foundation.md`
- active-doc updates that identify FP-0058 as the active F6I contract and later shipped record only after implementation lands
- one adjacent normalized close/control expected-output file
- one additive `pocket-cfo-monitor-demo` stack-pack manifest pointer for that expected output
- one extended deterministic replay proof through the existing `pnpm smoke:monitor-demo-replay:local`
- no route, schema, migration, package script, eval dataset, fixture raw-source rewrite, runtime behavior, delivery behavior, report behavior, approval behavior, accounting behavior, bank behavior, tax behavior, legal behavior, payment behavior, monitor-family behavior, discovery-family behavior, payables investigation, policy/covenant investigation, or later-F6 implementation

Do not create FP-0059 in this slice.
Do not start F6J, F6K, F6L, or later implementation here.

## Interfaces and Dependencies

Package boundaries must remain unchanged:

- `packages/stack-packs` owns the additive demo pack manifest and expected-output pointers
- `packages/testkit` owns checked-in demo fixtures and expected output files
- `apps/control-plane/src/modules/sources` owns source registration and raw file ingest
- `apps/control-plane/src/modules/finance-twin` owns deterministic source sync and stored Finance Twin reads
- `apps/control-plane/src/modules/wiki` owns policy binding, deterministic extracts, and CFO Wiki compile posture
- `apps/control-plane/src/modules/monitoring` owns monitor run/latest behavior and must not be changed by F6I unless a direct replay proof gap is proven
- `apps/control-plane/src/modules/missions` owns the shipped cash plus collections alert investigation handoff boundary and must not be widened by F6I
- `apps/control-plane/src/modules/close-control` owns the shipped read-only checklist route and should be consumed by F6I, not expanded, unless a direct F6H truthfulness bug is proven
- `apps/web` is not required for the first F6I replay proof

Runtime-Codex stays out of scope:

- no runtime-Codex drafting
- no runtime-Codex monitoring findings
- no runtime-Codex investigation writeups
- no runtime-Codex close/control prose
- no runtime-owned finance facts

Delivery and autonomous action stay out of scope:

- no email
- no Slack
- no webhooks
- no notifications
- no send, distribute, publish, pay, book, file, release, tax filing, legal advice, policy advice, payment instruction, vendor-payment recommendation, collection instruction, customer-contact instruction, or external action

Later slices are named but not created here:

- `F6J-notification/delivery planning`, only if future operator need is proven safe
- `F6K-close/control acknowledgement`, only if operator need is proven
- `F6L-source-pack expansion`, only if one demo pack is green and source-backed

Current module vocabulary stays stable.
Do not rename `modules/twin/**`, `modules/reporting/**`, or `@pocket-cto/*`.
Do not delete GitHub or engineering-twin modules as part of F6I.

## Outcomes & Retrospective

This docs-and-plan thread created the active FP-0058 F6I contract after confirming that the shipped F6F monitor demo replay and shipped F6H close/control checklist smoke are both green and source-backed.
No F6I implementation has started yet.
The next implementation thread should extend the existing `pocket-cfo-monitor-demo` stack-pack with normalized close/control checklist expected output and update the existing replay proof only.

What remains:

- start F6I implementation next only from this plan
- keep F6J notification/delivery planning, F6K acknowledgement, and F6L source-pack expansion uncreated until a later named plan proves the need
