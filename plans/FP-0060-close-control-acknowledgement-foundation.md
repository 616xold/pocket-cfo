# Define F6K close/control acknowledgement foundation

## Purpose / Big Picture

This file is the active Finance Plan for the Pocket CFO F6K implementation contract.
The target phase is `F6`, and the next implementation slice is exactly `F6K-close-control-acknowledgement-foundation`.

The user-visible goal is narrow: after shipped F6A through F6J, Pocket CFO should be able to show an internal operator whether a close/control posture is ready to be acknowledged as reviewed.
The first F6K slice is an internal close/control acknowledgement-readiness foundation only.
It is not an approval workflow, not a close-complete assertion, not report release, not external delivery, not a notification workflow, not runtime-Codex, not mission creation, and not a finance action.

Repo truth supports F6K in this bounded shape.
The shipped F6H checklist already produces one deterministic close/control read model from stored Finance Twin source posture, stored CFO Wiki policy/source posture, and latest persisted monitor results as context only.
The shipped F6J readiness result already derives internal operator attention/readiness from latest persisted monitor results and close/control checklist posture.
Those surfaces carry source lineage or proof references, freshness or missing-source posture, limitations, proof posture, status, human-review next steps, and explicit runtime/action absence boundaries.

F6K should therefore start from existing stored/read posture and define one deterministic acknowledgement-readiness contract for internal operator review.
It must not persist an acknowledgement record in the first implementation unless the implementation thread proves that read-only acknowledgement readiness cannot satisfy the operator need.
If a future persisted acknowledgement record is justified, it must be additive, idempotent, company-scoped, evidence-linked, and explicitly not an approval, not sign-off, not certification, not report release, and not close complete.

This master-plan-and-doc-refresh thread is docs-and-plan only.
It creates this active implementation-ready contract and refreshes active guidance, but it does not start F6K implementation.
GitHub connector work is explicitly out of scope.

## Progress

- [x] 2026-04-28T17:13:34Z Invoke the requested Pocket CFO operator plugin guards, run preflight, confirm the branch, GitHub access, Docker services, clean worktree, and fetched `origin/main`.
- [x] 2026-04-28T17:13:34Z Read active docs, shipped FP-0050 through FP-0059 records, package scripts, close/control, operator-readiness, approvals, missions, evidence, and shipped smoke/proof posture.
- [x] 2026-04-28T17:13:34Z Decide that F6K is safe as a close/control acknowledgement foundation, rather than switching next to F6L source-pack expansion, because acknowledgement can remain internal, review-only, and grounded in shipped checklist/readiness posture.
- [x] 2026-04-28T17:13:34Z Create FP-0060 as the single active F6K implementation-ready contract while preserving FP-0050 through FP-0059 as shipped F6A through F6J records.
- [x] 2026-04-28T17:13:34Z Keep this thread docs-and-plan only: no code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, or implementation scaffolding were added.
- [x] 2026-04-28T17:22:37Z Run the full requested validation ladder, including the serial DB-backed smokes, targeted twin specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed for the docs-and-plan-only F6K contract.
- [ ] Future implementation thread: add only the first deterministic internal acknowledgement-readiness contract if validation confirms the shipped F6H/F6J baseline remains green.
- [ ] Future implementation thread: prefer read-only/no-schema acknowledgement readiness unless persistence is justified in this plan before code changes.
- [ ] Future implementation thread: refresh active docs only after behavior lands and record final validation in this plan.

## Surprises & Discoveries

Repo truth supports F6K more safely than a source-pack expansion right now, but only because the first acknowledgement slice can be read-only and internal.
F6H already separates close/control checklist posture from close completion, and F6J already separates operator readiness from delivery, notifications, approvals, mission creation, and monitor reruns.
That means F6K can define an acknowledgement-readiness posture over existing evidence without inventing a new source of truth.

The existing approvals bounded context is deliberately report/runtime oriented.
It owns runtime approvals plus the shipped `report_release` and `report_circulation` finance-facing report seams.
F6K must not reuse those semantics for close/control acknowledgement, because doing so would imply sign-off, report release, circulation, or a broader approval inbox.

There is no checked-in F6K contract or acknowledgement module.
That absence is useful: the first contract can avoid inheriting report approval, release, delivery, or close-complete vocabulary.

The safest first persistence decision is no persistence.
The shipped monitor results are durable, while F6H and F6J are deterministic read models over stored state.
An acknowledgement-readiness view can preserve truthfulness without adding a table, replay event, or idempotency contract until a real operator need for retained acknowledgements is proven.

## Decision Log

Decision: proceed with `F6K-close-control-acknowledgement-foundation` rather than switching next to `F6L-source-pack-expansion`.
Rationale: repo truth already has source-backed close/control checklist posture and operator readiness posture. F6K can remain a read-only internal acknowledgement-readiness contract, while F6L would expand source packs before the operator review loop has a bounded acknowledgement vocabulary.

Decision: F6K is not an approval workflow.
Rationale: no approval kind belongs in F6K. The implementation must not add to `ApprovalKindSchema`, must not reuse `report_release` or `report_circulation`, and must not imply sign-off, certification, close completion, report release, or external communication release.
Use wording such as internal acknowledgement, reviewed posture, operator review acknowledgement, and acknowledgement readiness.

Decision: F6K is not a monitor family or discovery-family expansion.
Rationale: shipped monitor families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`.
Shipped discovery families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, `spend_posture`, `obligation_calendar_review`, and `policy_lookup`.
F6K must not add `spend_posture`, `obligation_calendar_review`, `covenant_risk`, or any other monitor or discovery family.

Decision: F6K is not external delivery.
Rationale: no email, Slack, SMS, webhook, notification provider call, outbox send behavior, report delivery, external publish behavior, or operator delivery workflow belongs in F6K.

Decision: F6K starts only from shipped stored/read state.
Rationale: allowed inputs are the close/control checklist result or read posture, the operator-readiness result or read posture, latest persisted monitor results only as context if needed, and source/CFO Wiki freshness posture already exposed through those reads.
F6K must not use generic chat, report artifacts as primary input, runtime-Codex output, mission-generated prose, monitor reruns, or demo replay runtime execution.

Decision: the first F6K output contract is acknowledgement readiness, not a persisted acknowledgement record.
Rationale: the first operator value is a deterministic view that says whether an internal acknowledgement target can be reviewed, what evidence supports it, what is stale/missing/limited, and what human-review step remains.
The bounded acknowledgement target should be the current close/control checklist aggregate and, when needed, the specific checklist item families that prevent acknowledgement readiness.

Decision: F6K must preserve source, freshness, proof, limitations, and human-review posture.
Rationale: every acknowledgement-readiness target must carry source/evidence basis, freshness or missing-source posture, limitations, proof posture, and a human-review next step.
Acknowledgement readiness must never hide stale, partial, inferred, conflicting, unsupported, or missing evidence.

Decision: F6K should ship read-only and no-schema first.
Rationale: persistence is not needed to show acknowledgement readiness. If a future implementation proves an internal acknowledgement record is required, that record must be additive, idempotent, company-scoped, evidence-linked, actor-attributed, and explicitly not an approval, not sign-off, not certification, not close complete, not report release, and not external delivery.
Do not add schema casually.

Decision: F6K preserves shipped F5 and F6 behavior.
Rationale: F6K must not change F5 report/release/circulation/correction behavior, monitor evaluators, F6B/F6G mission handoffs, F6H checklist behavior, F6J readiness behavior, approval kinds, report conversion, or release/circulation logging unless a later implementation thread proves a direct truthfulness gap and updates this plan first.

Decision: later slices are named but not created here.
Rationale: likely later slices are `F6L-source-pack-expansion` only if one demo pack remains green and source-backed, `F6M-external-notification-delivery-planning` only if a future plan proves safety and review gates, and `F6N-close-control-reporting-or-certification` only if operator need and evidence boundaries are proven.
Do not create FP-0061 in this slice.

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
- F6I one normalized close/control expected-output expansion on the existing monitor demo stack-pack replay proof
- F6J one deterministic internal operator attention/readiness read model over shipped stored state only

The current shipped monitor families remain exactly:

- `cash_posture`
- `collections_pressure`
- `payables_pressure`
- `policy_covenant_threshold`

The current shipped finance-discovery families remain exactly:

- `cash_posture`
- `collections_pressure`
- `payables_pressure`
- `spend_posture`
- `obligation_calendar_review`
- `policy_lookup`

The relevant existing implementation seams for a future F6K implementation are:

- `packages/domain/src/close-control.ts` for the checklist item families, review statuses, source posture, evidence refs, proof posture, and runtime/action absence boundary
- `packages/domain/src/operator-readiness.ts` for internal operator readiness posture, evidence basis, freshness, limitations, proof posture, and runtime/action absence boundary
- `packages/domain/src/approval.ts` as a boundary to avoid, not as the first F6K implementation seam
- `packages/domain/src/proof-bundle.ts` and `packages/domain/src/mission-detail.ts` for proof and mission vocabulary that F6K should not widen
- `apps/control-plane/src/modules/close-control/**` for the shipped deterministic checklist read
- `apps/control-plane/src/modules/operator-readiness/**` for the shipped deterministic readiness read
- `apps/control-plane/src/modules/approvals/**` for report/runtime approvals that F6K must not reuse
- `apps/control-plane/src/modules/missions/**` for shipped alert handoffs that F6K must not widen
- `apps/control-plane/src/modules/evidence/**` for proof-language conventions only, not report conversion
- `tools/close-control-checklist-smoke.mjs`, `tools/operator-readiness-smoke.mjs`, and `tools/monitor-demo-replay-smoke.mjs` for shipped proof and absence-boundary patterns

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No source mutation is expected.
No route, schema, migration, package script, smoke command, eval dataset, fixture, or implementation scaffold was added by this planning slice.

## Plan of Work

First, the future implementation should add a pure domain acknowledgement-readiness contract only if it can remain read-only.
The preferred shape is a deterministic result over one company and one bounded acknowledgement target.
The target vocabulary should be narrow, such as `close_control_checklist_aggregate` and explicit F6H checklist item families when they block aggregate acknowledgement readiness.
The status vocabulary should stay review-oriented, such as `ready_for_review`, `needs_review`, and `blocked_by_evidence`, rather than `approved`, `signed_off`, `certified`, or `close_complete`.

Second, the future implementation should read only existing posture.
It should depend on the close/control checklist read and operator-readiness read, plus latest persisted monitor results only if needed for evidence context already present in those reads.
It must not rerun monitors, create monitor results, create or open missions, read generic chat, invoke runtime-Codex, or use report artifacts as primary input.

Third, the future implementation should decide persistence before code.
The first implementation should remain read-only/no-schema unless a concrete operator need proves that an internal acknowledgement record must be retained.
If persistence becomes necessary, amend this plan before code to name the record shape, idempotency key, replay implications, actor metadata, evidence links, and recovery behavior.

Fourth, the future implementation should expose only internal operator-visible posture.
If a route or UI is needed, it should be read-only and thin.
It must not present approval buttons, close-complete actions, send controls, report-release controls, notification controls, monitor-run controls, mission-creation controls, payment controls, legal/policy advice controls, collection/customer-contact controls, or autonomous remediation controls.

Fifth, the future implementation should prove absence boundaries using existing shipped smokes and focused tests.
No new package script is created by this plan.
If implementation later adds a new proof command, this plan must be updated first with the exact reason and boundary.

## Concrete Steps

1. Add a pure acknowledgement-readiness contract in the domain package only in the implementation thread.
   Expected future file if implementation proceeds:
   - `packages/domain/src/close-control-acknowledgement.ts`

   Required behavior:
   - one company-scoped acknowledgement-readiness result
   - one bounded acknowledgement target: current close/control checklist aggregate, with item-family blockers when relevant
   - source/evidence basis
   - freshness or missing-source posture
   - limitations
   - proof posture
   - human-review next step
   - runtime/action absence boundary proving no runtime-Codex, delivery, outbox send, report, approval, mission creation, monitor rerun, monitor result creation, accounting write, bank write, tax filing, legal advice, policy advice, payment instruction, collection instruction, customer-contact instruction, or autonomous action
   - no approval kind
   - no close-complete status
   - no report or delivery semantics

2. Add a control-plane read model only if the domain contract exists.
   Preferred future shape:
   - `apps/control-plane/src/modules/close-control/acknowledgement-readiness.ts`
   - adjacent focused specs

   The service must:
   - accept exactly one `companyKey`
   - read the shipped close/control checklist posture
   - read the shipped operator-readiness posture only if needed to preserve review context
   - avoid direct SQL unless a future persisted acknowledgement record is explicitly justified
   - never create missions, reports, approvals, outbox events, monitor results, monitor runs, runtime-Codex work, payments, bank/accounting/tax/legal actions, policy advice, collection instructions, customer-contact instructions, or autonomous actions

3. If a route is needed, keep it read-only and thin.
   Possible future route:
   - `GET /close-control/companies/:companyKey/acknowledgement-readiness`

   The route must parse input, call the service, and serialize output.
   It must not contain SQL, prompt assembly, source ingest logic, finance math, report conversion, approval behavior, delivery logic, notification provider logic, monitor rerun logic, or action execution.

4. Do not persist a record in the first implementation.
   If the implementation thread proves persistence is required, amend this plan before adding schema.
   Any future persisted acknowledgement must include:
   - `companyKey`
   - bounded acknowledgement target
   - source/evidence basis links
   - freshness and limitations snapshot
   - proof posture snapshot
   - actor/requester metadata such as requestedBy or acknowledgedBy only as internal metadata
   - idempotency key or equivalent duplicate-prevention posture
   - explicit fields or wording that it is not an approval and not close complete

5. Preserve shipped F5 and F6 behavior.
   Required absence checks:
   - no F5 report/release/circulation/correction changes
   - no monitor evaluator changes
   - no F6B/F6G mission changes
   - no F6H checklist behavior changes unless a direct truthfulness gap is proven first
   - no F6J readiness behavior changes unless a direct truthfulness gap is proven first
   - no approval kind
   - no report conversion
   - no delivery, notification provider, outbox send, or external publish behavior
   - no monitor-family or discovery-family expansion

6. Refresh docs after behavior lands.
   Expected docs if future implementation changes behavior:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - `docs/ops/local-dev.md`
   - `docs/ops/source-ingest-and-cfo-wiki.md` only if source/freshness wording becomes stale
   - `docs/ops/codex-app-server.md` only if runtime-boundary wording becomes stale
   - `evals/README.md` and `docs/benchmarks/seeded-missions.md` only if validation or proof wording becomes stale

## Validation and Acceptance

This docs-and-plan thread must run the requested validation ladder, with DB-backed smokes serially and the cash/collections alert handoff smokes not run in parallel:

- `pnpm smoke:operator-readiness:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm smoke:monitor-demo-replay:local`
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

F6K implementation acceptance is observable only if all of the following are true:

- one deterministic internal acknowledgement-readiness result exists
- the result is derived only from shipped stored state or shipped deterministic read posture
- the bounded acknowledgement target is the close/control checklist aggregate or explicit checklist item family posture
- source/evidence basis, freshness or missing-source posture, limitations, proof posture, and human-review next step are visible
- stale, partial, inferred, conflicting, unsupported, or missing evidence remains visible
- no approval workflow, approval kind, sign-off, certification, close-complete status, report release, report delivery, external delivery, notification provider call, outbox send, runtime-Codex, mission creation, monitor rerun, monitor result creation, payment behavior, accounting write, bank write, tax filing, legal advice, policy advice, collection instruction, customer-contact instruction, or autonomous action is added
- no new monitor family or discovery family is added
- shipped F5 and F6 behavior remains unchanged
- shipped monitor, handoff, close/control checklist, demo replay, operator-readiness, and finance-discovery supported-family smokes remain green

## Idempotence and Recovery

The preferred F6K implementation is retry-safe because it is read-only.
Repeated reads over the same stored posture should produce the same acknowledgement-readiness status except for explicitly labeled read timestamps.

Raw sources, source snapshots, source files, deterministic extracts, CFO Wiki pages, Finance Twin facts, monitor results, close/control checklist posture, operator-readiness posture, missions, reports, approvals, release/circulation records, and demo fixtures must not be mutated to make acknowledgement readiness pass.

If source state is missing, stale, failed, unsupported, partial, conflicting, or insufficient, F6K should report that posture instead of inventing acknowledgement readiness, approval, sign-off, or close completion.

Rollback for a future implementation should revert only the additive F6K contract/read-model/UI/proof/doc changes.
Rollback must leave FP-0050 through FP-0059, shipped monitor behavior, shipped alert handoff behavior, shipped checklist behavior, shipped demo replay behavior, shipped operator-readiness behavior, F5 reporting/approval behavior, raw sources, CFO Wiki state, Finance Twin state, and GitHub/engineering-twin modules intact.
No destructive database migration belongs in F6K.

## Artifacts and Notes

This docs-and-plan slice produces:

- `plans/FP-0060-close-control-acknowledgement-foundation.md`
- active-doc updates that identify FP-0060 as the active F6K implementation-ready contract
- no code
- no routes
- no schema or migrations
- no package scripts
- no smoke commands
- no eval datasets
- no fixtures
- no implementation scaffolding
- no monitor families
- no discovery families
- no runtime-Codex
- no delivery, notification provider, outbox send, email, Slack, SMS, webhook, report, approval, mission creation, monitor rerun, payment, accounting write, bank write, tax filing, legal/policy advice, collection/customer-contact instruction, or autonomous action behavior

Do not create FP-0061 in this slice.
Do not start F6L, F6M, F6N, or later implementation here.

## Interfaces and Dependencies

Package boundaries must remain unchanged:

- `packages/domain` owns the pure future acknowledgement-readiness contract if implementation proceeds
- `packages/db` remains untouched for the first implementation unless this plan is amended to justify a persisted acknowledgement record
- `apps/control-plane/src/modules/close-control` owns the shipped checklist read and is the preferred bounded context for acknowledgement readiness
- `apps/control-plane/src/modules/operator-readiness` owns the shipped internal readiness read and may be read as posture, not mutated
- `apps/control-plane/src/modules/approvals` owns runtime and report approvals and must not become the F6K acknowledgement system
- `apps/control-plane/src/modules/missions` owns shipped cash plus collections alert investigation handoffs and must not be widened by F6K
- `apps/control-plane/src/modules/evidence` may be referenced for proof language but must not turn acknowledgements into reports
- `apps/web` may expose internal read posture only if implementation needs an operator surface

Runtime-Codex stays out of scope:

- no runtime-Codex drafting
- no runtime-Codex close/control prose
- no runtime-Codex acknowledgement text
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

- `F6L-source-pack-expansion`, only if one demo pack remains green and source-backed
- `F6M-external-notification-delivery-planning`, only if a future plan proves safety, review gates, delivery controls, and a human-approved release path
- `F6N-close-control-reporting-or-certification`, only if operator need and evidence boundaries are proven

Current module vocabulary stays stable.
Do not rename `modules/twin/**`, `modules/reporting/**`, or `@pocket-cto/*`.
Do not delete GitHub or engineering-twin modules as part of F6K.

## Outcomes & Retrospective

This docs-and-plan thread created FP-0060 after confirming that the shipped F6A through F6J baseline supports a safe internal close/control acknowledgement foundation.
No F6K implementation started.
No F6L, F6M, F6N, or later plan was created.
The full requested validation ladder passed for this docs-and-plan-only slice, including `pnpm ci:repro:current`.

What remains:

- start F6K implementation next from this active FP-0060 contract, keeping the first slice internal, read-only/no-schema unless persistence is newly justified, approval-free, close-complete-free, delivery-free, runtime-Codex-free, report-free, and action-free
- keep F6L source-pack expansion, F6M external notification/delivery planning, and F6N close/control reporting or certification uncreated until later named plans prove the need
