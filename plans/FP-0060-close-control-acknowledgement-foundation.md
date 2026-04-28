# Ship F6K close/control acknowledgement foundation

## Purpose / Big Picture

This file is the shipped Finance Plan record for the Pocket CFO F6K implementation contract.
The target phase is `F6`, and the shipped implementation slice is exactly `F6K-close-control-acknowledgement-foundation`.

The user-visible goal is narrow: after shipped F6A through F6J, Pocket CFO should be able to show an internal operator whether a close/control posture is ready to be acknowledged as reviewed.
The first F6K slice is an internal close/control acknowledgement-readiness foundation only.
It is not an approval workflow, not a close-complete assertion, not report release, not external delivery, not a notification workflow, not runtime-Codex, not mission creation, and not a finance action.

Repo truth supports F6K in this bounded shape.
The shipped F6H checklist already produces one deterministic close/control read model from stored Finance Twin source posture, stored CFO Wiki policy/source posture, and latest persisted monitor results as context only.
The shipped F6J readiness result already derives internal operator attention/readiness from latest persisted monitor results and close/control checklist posture.
Those surfaces carry source lineage or proof references, freshness or missing-source posture, limitations, proof posture, status, human-review next steps, and explicit runtime/action absence boundaries.

F6K starts from existing stored/read posture and defines one deterministic acknowledgement-readiness contract for internal operator review.
It does not persist an acknowledgement record in the first implementation.
If a future persisted acknowledgement record is justified, it must be additive, idempotent, company-scoped, evidence-linked, and explicitly not an approval, not sign-off, not certification, not report release, and not close complete.

This implementation thread ships the first read-only/no-schema F6K slice and refreshes active guidance after behavior lands.
GitHub connector work is explicitly out of scope.

## Progress

- [x] 2026-04-28T17:13:34Z Invoke the requested Pocket CFO operator plugin guards, run preflight, confirm the branch, GitHub access, Docker services, clean worktree, and fetched `origin/main`.
- [x] 2026-04-28T17:13:34Z Read active docs, shipped FP-0050 through FP-0059 records, package scripts, close/control, operator-readiness, approvals, missions, evidence, and shipped smoke/proof posture.
- [x] 2026-04-28T17:13:34Z Decide that F6K is safe as a close/control acknowledgement foundation, rather than switching next to F6L source-pack expansion, because acknowledgement can remain internal, review-only, and grounded in shipped checklist/readiness posture.
- [x] 2026-04-28T17:13:34Z Create FP-0060 initially as the single F6K implementation-ready contract while preserving FP-0050 through FP-0059 as shipped F6A through F6J records.
- [x] 2026-04-28T17:13:34Z Keep the initial planning pass docs-only: no code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, or implementation scaffolding were added.
- [x] 2026-04-28T17:22:37Z Run the full requested validation ladder, including the serial DB-backed smokes, targeted twin specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed for the initial planning-only F6K contract.
- [x] 2026-04-28T17:56:28Z Add the first deterministic internal acknowledgement-readiness contract in `packages/domain` with checklist aggregate and item-family targets, narrow acknowledgement status vocabulary, evidence/freshness/proof/limitation posture, human-review next steps, and runtime/action absence boundary fields.
- [x] 2026-04-28T17:56:28Z Add a read-only/no-schema control-plane bounded context and thin `GET /close-control/companies/:companyKey/acknowledgement-readiness` route that reads only shipped close/control checklist and operator-readiness posture.
- [x] 2026-04-28T17:56:28Z Add the smallest operator UI read surface, the packaged `pnpm smoke:close-control-acknowledgement:local` proof, and active-doc updates identifying FP-0060 as the shipped F6K record.
- [x] 2026-04-28T18:14:09Z Run the full requested validation ladder for the implementation slice, including shipped F6A through F6J smokes, the new F6K smoke, twin guardrails, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed.
- [x] 2026-04-28T18:23:26Z Run the strict F6K QA pass and narrow the service/smoke summary wording so operator-visible output stays focused on internal acknowledgement-readiness and avoids extra report/delivery wording while preserving required absence-boundary fields.

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

The implementation confirmed that read-only F6K is enough for the first slice.
No schema, migration, replay event, persisted acknowledgement record, monitor rerun, mission, report, approval, delivery/outbox send, runtime-Codex thread, finance write, advice output, collection/customer-contact instruction, autonomous action, monitor family, or discovery family was needed.

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

Decision: F6K shipped as a separate `close-control-acknowledgement` bounded context.
Rationale: the new module reads the shipped F6H checklist service and the shipped F6J operator-readiness service without changing either behavior. It keeps acknowledgement-readiness orchestration, formatting, route parsing, and tests modular and avoids bloating the existing close/control checklist module.

Decision: F6K includes one aggregate target plus deterministic checklist item-family targets.
Rationale: always including item-family targets makes ready and non-ready posture observable and testable. Aggregate posture maps `ready_for_review` to `ready_for_acknowledgement`, `needs_review` to `needs_review_before_acknowledgement`, and `blocked_by_evidence` to `blocked_by_evidence`, with operator-readiness blocked/needs-review context surfaced rather than hidden.

Decision: F6K includes a small UI read surface and a packaged smoke.
Rationale: a human can observe the read model without any action buttons, and `pnpm smoke:close-control-acknowledgement:local` proves the internal posture plus absence boundaries alongside the shipped F6A through F6J smokes.

Decision: F6K QA keeps proof fields but narrows prose output.
Rationale: the acknowledgement-readiness result still carries the required runtime/action absence boundary booleans, but the service summary and packaged smoke output should not add extra delivery/report-style wording beyond the bounded proof posture.

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

The relevant implementation seams for shipped F6K are:

- `packages/domain/src/close-control.ts` for the checklist item families, review statuses, source posture, evidence refs, proof posture, and runtime/action absence boundary
- `packages/domain/src/operator-readiness.ts` for internal operator readiness posture, evidence basis, freshness, limitations, proof posture, and runtime/action absence boundary
- `packages/domain/src/close-control-acknowledgement.ts` for the F6K acknowledgement-readiness contract
- `packages/domain/src/approval.ts` as a boundary to avoid, not as the first F6K implementation seam
- `packages/domain/src/proof-bundle.ts` and `packages/domain/src/mission-detail.ts` for proof and mission vocabulary that F6K should not widen
- `apps/control-plane/src/modules/close-control/**` for the shipped deterministic checklist read
- `apps/control-plane/src/modules/operator-readiness/**` for the shipped deterministic readiness read
- `apps/control-plane/src/modules/close-control-acknowledgement/**` for the shipped read-only acknowledgement-readiness formatter, service, schema, route, and specs
- `apps/control-plane/src/modules/approvals/**` for report/runtime approvals that F6K must not reuse
- `apps/control-plane/src/modules/missions/**` for shipped alert handoffs that F6K must not widen
- `apps/control-plane/src/modules/evidence/**` for proof-language conventions only, not report conversion
- `apps/web/app/close-control/acknowledgement-readiness/**` and `apps/web/components/close-control-acknowledgement-card.tsx` for the smallest shipped operator read surface
- `tools/close-control-checklist-smoke.mjs`, `tools/operator-readiness-smoke.mjs`, and `tools/monitor-demo-replay-smoke.mjs` for shipped proof and absence-boundary patterns
- `tools/close-control-acknowledgement-smoke.mjs` for the shipped F6K proof

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No source mutation is expected.
No database schema migration, eval dataset, demo fixture, persisted acknowledgement record, monitor family, or discovery family was added by this implementation slice.

## Plan of Work

The shipped implementation adds a pure domain acknowledgement-readiness contract that remains read-only.
The result is company-scoped, includes one checklist aggregate target plus deterministic checklist item-family targets, and uses only the acknowledgement statuses `ready_for_acknowledgement`, `needs_review_before_acknowledgement`, and `blocked_by_evidence`.

The shipped control-plane service reads only existing posture.
It depends on the close/control checklist read and operator-readiness read, and it does not rerun monitors, create monitor results, create or open missions, read generic chat, invoke runtime-Codex, or use report artifacts as primary input.

The first shipped implementation remains read-only/no-schema.
If persistence becomes necessary later, a new plan must name the record shape, idempotency key, replay implications, actor metadata, evidence links, recovery behavior, and explicit non-approval/non-close-complete boundary before code changes.

The shipped route and UI expose only internal operator-visible posture.
They do not present action controls for approvals, close-complete posture, sending, report release, notifications, monitor runs, mission creation, payments, legal/policy advice, collection/customer-contact instructions, runtime-Codex, or autonomous remediation.

The shipped proof uses focused tests plus `pnpm smoke:close-control-acknowledgement:local` and the existing F6A through F6J smokes to prove absence boundaries.

## Concrete Steps

1. Add a pure acknowledgement-readiness contract in the domain package.
   Shipped files:
   - `packages/domain/src/close-control-acknowledgement.ts`
   - `packages/domain/src/close-control-acknowledgement.spec.ts`

   Shipped behavior:
   - one company-scoped acknowledgement-readiness result
   - one checklist aggregate target plus deterministic checklist item-family targets
   - source/evidence basis
   - freshness or missing-source posture
   - limitations
   - proof posture
   - human-review next step
   - runtime/action absence boundary proving no runtime-Codex, delivery, outbox send, report, approval, mission creation, monitor rerun, monitor result creation, accounting write, bank write, tax filing, legal advice, policy advice, payment instruction, collection instruction, customer-contact instruction, or autonomous action
   - no approval kind
   - no close-complete status
   - no report or delivery semantics

2. Add a control-plane read model.
   Shipped files:
   - `apps/control-plane/src/modules/close-control-acknowledgement/schema.ts`
   - `apps/control-plane/src/modules/close-control-acknowledgement/service.ts`
   - `apps/control-plane/src/modules/close-control-acknowledgement/formatter.ts`
   - `apps/control-plane/src/modules/close-control-acknowledgement/routes.ts`
   - focused service and route specs

   The service:
   - accept exactly one `companyKey`
   - read the shipped close/control checklist posture
   - read the shipped operator-readiness posture as context only
   - avoids direct SQL and persistence
   - never creates missions, reports, approvals, outbox events, monitor results, monitor runs, runtime-Codex work, payments, bank/accounting/tax/legal actions, policy advice, collection instructions, customer-contact instructions, or autonomous actions

3. Keep the shipped route read-only and thin.
   Shipped route:
   - `GET /close-control/companies/:companyKey/acknowledgement-readiness`

   The route parses input, calls the service, and serializes output.
   It contains no SQL, prompt assembly, source ingest logic, finance math, report conversion, approval behavior, delivery logic, notification provider logic, monitor rerun logic, or action execution.

4. Do not persist a record in the first implementation.
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
   Shipped absence checks:
   - no F5 report/release/circulation/correction changes
   - no monitor evaluator changes
   - no F6B/F6G mission changes
   - no F6H checklist behavior changes
   - no F6J readiness behavior changes
   - no approval kind
   - no report conversion
   - no delivery, notification provider, outbox send, or external publish behavior
   - no monitor-family or discovery-family expansion

6. Refresh docs after behavior lands.
   Updated docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - `docs/ops/local-dev.md`
   - `docs/ops/source-ingest-and-cfo-wiki.md`
   - `docs/ops/codex-app-server.md`
   - `evals/README.md`
   - `docs/benchmarks/seeded-missions.md`

## Validation and Acceptance

This implementation thread must run the requested validation ladder, with DB-backed smokes serially and the cash/collections alert handoff smokes not run in parallel:

- `pnpm --filter @pocket-cto/domain exec vitest run src/close-control-acknowledgement.spec.ts src/operator-readiness.spec.ts src/close-control.spec.ts src/monitoring.spec.ts src/finance-twin.spec.ts src/proof-bundle.spec.ts`
- `cd apps/control-plane && pnpm exec vitest run src/modules/close-control-acknowledgement/**/*.spec.ts src/modules/operator-readiness/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/finance-twin/**/*.spec.ts src/modules/wiki/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/app.spec.ts`
- `cd apps/web && pnpm exec vitest run app/close-control/acknowledgement-readiness/**/*.spec.ts* components/close-control-acknowledgement-card.spec.tsx lib/api.spec.ts`
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
- `pnpm smoke:close-control-acknowledgement:local`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Final F6K implementation validation passed on 2026-04-28T18:14:09Z.
The validation included the focused domain/control-plane/web tests, all shipped F6 proof smokes, the new close/control acknowledgement-readiness smoke, twin guardrail specs, lint, typecheck, full test, and reproducibility check.

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

Rollback for this implementation should revert only the additive F6K contract/read-model/UI/proof/doc changes.
Rollback must leave FP-0050 through FP-0059, shipped monitor behavior, shipped alert handoff behavior, shipped checklist behavior, shipped demo replay behavior, shipped operator-readiness behavior, F5 reporting/approval behavior, raw sources, CFO Wiki state, Finance Twin state, and GitHub/engineering-twin modules intact.
No destructive database migration belongs in F6K.

## Artifacts and Notes

This implementation slice produces:

- `plans/FP-0060-close-control-acknowledgement-foundation.md`
- `packages/domain/src/close-control-acknowledgement.ts`
- `packages/domain/src/close-control-acknowledgement.spec.ts`
- `apps/control-plane/src/modules/close-control-acknowledgement/**`
- `apps/web/app/close-control/acknowledgement-readiness/**`
- `apps/web/components/close-control-acknowledgement-card.tsx`
- `tools/close-control-acknowledgement-smoke.mjs`
- package script `pnpm smoke:close-control-acknowledgement:local`
- active-doc updates that identify FP-0060 as the shipped F6K record
- no persisted acknowledgement records
- no schema or migrations
- no eval datasets
- no monitor families
- no discovery families
- no runtime-Codex
- no delivery, notification provider, outbox send, email, Slack, SMS, webhook, report, approval, mission creation, monitor rerun, payment, accounting write, bank write, tax filing, legal/policy advice, collection/customer-contact instruction, or autonomous action behavior

Do not create FP-0061 in this slice.
Do not start F6L, F6M, F6N, or later implementation here.

## Interfaces and Dependencies

Package boundaries must remain unchanged:

- `packages/domain` owns the shipped pure acknowledgement-readiness contract
- `packages/db` remains untouched for the first implementation unless a later plan justifies a persisted acknowledgement record
- `apps/control-plane/src/modules/close-control` owns the shipped checklist read
- `apps/control-plane/src/modules/close-control-acknowledgement` owns the shipped read-only acknowledgement-readiness service, formatter, schema, route, and specs
- `apps/control-plane/src/modules/operator-readiness` owns the shipped internal readiness read and may be read as posture, not mutated
- `apps/control-plane/src/modules/approvals` owns runtime and report approvals and must not become the F6K acknowledgement system
- `apps/control-plane/src/modules/missions` owns shipped cash plus collections alert investigation handoffs and must not be widened by F6K
- `apps/control-plane/src/modules/evidence` may be referenced for proof language but must not turn acknowledgements into reports
- `apps/web` exposes internal acknowledgement-readiness posture only, without action buttons

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

- `F6L-source-pack-expansion`, only if the shipped F6A through F6K proofs remain green and a new Finance Plan names scope
- `F6M-external-notification-delivery-planning`, only if a future plan proves safety, review gates, delivery controls, and a human-approved release path
- `F6N-close-control-reporting-or-certification`, only if operator need and evidence boundaries are proven

Current module vocabulary stays stable.
Do not rename `modules/twin/**`, `modules/reporting/**`, or `@pocket-cto/*`.
Do not delete GitHub or engineering-twin modules as part of F6K.

## Outcomes & Retrospective

This implementation thread shipped FP-0060 after confirming that the shipped F6A through F6J baseline supports a safe internal close/control acknowledgement foundation.
F6K now has a deterministic read-only acknowledgement-readiness contract, route, UI surface, and packaged proof command.
No F6L, F6M, F6N, or later plan was created.
Final implementation validation passed in this thread, including `pnpm ci:repro:current`.

What remains:

- start F6L source-pack expansion planning next only through a new Finance Plan if the operator-review path still needs broader source coverage
- keep F6M external notification/delivery planning and F6N close/control reporting or certification uncreated until later named plans prove the need
