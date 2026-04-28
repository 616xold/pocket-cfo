# Define F6H close/control checklist foundation

## Purpose / Big Picture

This file is the shipped Finance Plan for the Pocket CFO F6H implementation record.
The target phase is `F6`, and the first implementation slice is exactly `F6H-close-control-checklist-foundation`.

The user-visible goal is narrow: after shipped F6A through F6G, Pocket CFO should introduce one deterministic close/control checklist foundation that helps a finance operator review whether the recurring finance evidence spine is ready for human close/control work.
This is not a new monitor family, not a discovery-family expansion, not an accounting close automation system, and not a report or delivery workflow.

Repo truth supports F6H now, but only in a human-review posture.
The shipped Finance Twin already exposes source-backed freshness, coverage, lineage, diagnostics, and limitations for cash, receivables-aging, payables-aging, and broader company posture.
The shipped CFO Wiki already exposes policy-document bindings, deterministic extract posture, policy pages, policy-corpus posture, freshness, and limitations.
The shipped F6 monitor stack already persists latest monitor results and alert cards for `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`.
Those are enough to create deterministic checklist items about source coverage, freshness, and replay readiness without inventing finance facts.

F6H must stay deterministic, runtime-free, delivery-free, non-autonomous, and review-only.
It must not add another monitor family, add `spend_posture` or `obligation_calendar_review` monitoring, generalize payables or policy/covenant investigations, add runtime-Codex writeups, create approvals, produce reports, convert reports, send notifications, deliver messages, book journals, write to banks or ledgers, file taxes, provide legal or policy advice, create payment instructions, create collection instructions, or mark a close as complete unless all required source posture is explicitly present and fresh.
GitHub connector work is explicitly out of scope.

## Progress

- [x] 2026-04-28T00:13:45Z Invoke the requested Pocket CFO operator plugin guards, run preflight, confirm branch, GitHub access, and Docker services, and read the active docs, shipped F6A through F6G records, ops docs, package scripts, domain contracts, monitor/mission/evidence/wiki/finance-twin seams, and shipped monitor smokes.
- [x] 2026-04-28T00:13:45Z Decide that F6H is ready as a deterministic close/control checklist foundation rather than deferring to F6I stack-pack expansion, because the first checklist can be source/freshness/replay review posture only.
- [x] 2026-04-28T00:13:45Z Create FP-0057 as the single active implementation-ready F6H contract while preserving FP-0050 through FP-0056 as shipped F6A through F6G records.
- [x] 2026-04-28T00:17:13Z Refresh the active-doc spine so the next implementation thread starts from this F6H checklist contract and does not reopen shipped monitor, investigation, report, approval, runtime, delivery, or stack-pack work.
- [x] 2026-04-28T00:23:03Z Run the docs-and-plan validation ladder requested for this slice through `pnpm ci:repro:current`; all required commands passed.
- [x] 2026-04-28T11:48:02Z Polish the F6H monitor replay readiness boundary so the first checklist implementation reads latest persisted monitor results only as context and cannot add automatic or manual monitor reruns or monitor-run controls inside the checklist path.
- [x] 2026-04-28T12:12:47Z Implement `F6H-close-control-checklist-foundation` as one deterministic, read-only close/control checklist read model with no persistence table, monitor rerun, mission creation, report creation, approval creation, delivery/outbox send, runtime-Codex invocation, or external finance action.
- [x] 2026-04-28T12:12:47Z Add the packaged `pnpm smoke:close-control-checklist:local` proof showing source-backed checklist items, missing-source blocked/review posture, limited posture review posture, latest persisted monitor results as context only, no checklist-triggered side effects, and no new monitor or discovery family.
- [x] 2026-04-28T12:12:47Z Close FP-0057 as the shipped F6H record. F6I planning must start only as a new Finance Plan; no F6I implementation started here.
- [x] 2026-04-28T12:43:09Z Apply a narrow post-merge F6H truthfulness polish so policy-source checklist posture treats conflicting exact threshold facts for the same metric as a data-quality gap while keeping duplicate identical threshold facts non-conflicting.
- [x] 2026-04-28T12:48:41Z Validate the F6H threshold-conflict polish through the requested narrow specs, package specs, shipped Docker-backed smokes, twin guardrails, lint, typecheck, full tests, and `pnpm ci:repro:current`.

## Surprises & Discoveries

The repo has no existing close/control checklist domain, route, read model, table, smoke, or UI.
That is good for this planning slice: F6H can define the contract cleanly without preserving half-built checklist behavior.

The first safe checklist should be evidence-readiness oriented, not accounting-action oriented.
The shipped Finance Twin and CFO Wiki can support review items such as source coverage, cash source freshness, receivables-aging source freshness, payables-aging source freshness, policy-source freshness, and monitor replay readiness.
They do not support a truthful autonomous close-complete assertion, journal booking, reconciliation signoff, tax filing, legal conclusion, or payment/remediation workflow.

The shipped monitor stack is useful context but should not become the trigger.
Latest monitor results can help the operator see whether the evidence spine has recently replayed, but F6H must not automatically create checklist items from alerts, rerun monitor handoffs, or treat alert state as a close-control approval.

The shipped policy/covenant monitor proves useful CFO Wiki policy posture exists, but the first checklist should stay at policy-source freshness and coverage.
It should not interpret policy, create policy advice, generalize policy investigations, or assert covenant compliance.

The shipped F6G collections investigation handoff remains deliberately narrower than all non-cash monitors.
F6H must not use close/control planning as a back door to add payables or policy/covenant investigations.

## Decision Log

Decision: proceed with F6H rather than switching to F6I stack-pack expansion.
Rationale: the existing source/CFO Wiki/Finance Twin posture can support deterministic checklist items without inventing finance facts, and the first output can stay a human-review read model rather than an accounting action.

Decision: the first real F6H scope is `F6H-close-control-checklist-foundation`.
Rationale: the next slice should make Pocket CFO more like a recurring finance operating system without adding alert semantics or broad workflow automation.

Decision: F6H is not a monitor family.
Rationale: shipped monitor families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`.
F6H must not add `spend_posture`, `obligation_calendar_review`, `covenant_risk`, or any new monitor or discovery family.

Decision: F6H starts from one `companyKey` plus stored Finance Twin and CFO Wiki source posture.
Rationale: source coverage and freshness already exist as stored posture.
Generic chat, report artifacts, runtime-Codex writeups, and F6B/F6G investigation missions are not primary checklist inputs.

Decision: latest monitor results are optional context only.
Rationale: monitor replay readiness can cite latest persisted monitor results, but alerts must not become automated checklist triggers, approvals, delivery actions, or close-complete assertions.

Decision: the F6H output is one deterministic checklist result or read model.
Rationale: the first proof point should be a bounded set of checklist items with source posture, evidence basis, freshness/limitations, status, and human-review next step.

Decision: the first checklist item families are source coverage review, cash source freshness review, receivables-aging source freshness review, payables-aging source freshness review, policy-source freshness review, and monitor replay readiness.
Rationale: those families are grounded in shipped source, Finance Twin, CFO Wiki, and monitoring posture without requiring new extractors or external actions.

Decision: no "close complete" assertion should appear unless all required sources are present and fresh.
Rationale: missing, stale, failed, partial, unsupported, or conflicting evidence should produce a review-needed or blocked posture, not a close-complete claim.

Decision: F6H remains deterministic, runtime-free, delivery-free, approval-free, and non-autonomous.
Rationale: the checklist is a review contract over stored posture; it must not invoke runtime-Codex, send notifications, create approvals, generate reports, write to accounting or banking systems, create payment instructions, create collection instructions, file taxes, provide legal advice, or remediate anything automatically.

Decision: F6H preserves shipped F5 and F6 behavior.
Rationale: no F5 reporting approval/release/circulation/correction changes, no monitor evaluator changes, no F6B/F6G mission changes, no new approval kind, no report conversion, and no delivery path belong in this slice.

Decision: likely later slices are named but not created here.
Rationale: `F6I-stack-pack-expansion` should start only after one close/control checklist is green; `F6J-notification-delivery-planning` should start only if a future plan proves safe; `F6K-close-control-approval-or-acknowledgement` should start only if operator need is proven.
Do not create FP-0058, FP-0059, or FP-0060 in this slice.

Decision: ship the first F6H checklist as a read-only derived result, not a new table.
Rationale: the first useful close/control proof is current evidence posture over stored Finance Twin, CFO Wiki, and latest monitor-result context. Persisting a separate checklist table would add replay and migration surface before there is an operator need for retained checklist snapshots.

Decision: use `ready_for_review`, `needs_review`, and `blocked_by_evidence` only.
Rationale: the first F6H slice deliberately avoids a `close_complete` state. Completeness, stale posture, unsupported policy lines, existing CFO Wiki limitations, alerting monitor context, and missing evidence remain human-review posture, not close signoff.

Decision: keep monitor replay readiness context-only.
Rationale: the checklist cites latest persisted `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold` results; it does not rerun monitors, create monitor results, create investigations, or treat alerts as approvals.

Decision: conflicting exact policy threshold facts for the same metric are a data-quality gap in F6H policy-source checklist posture.
Rationale: each line can satisfy the exact grammar while the combined stored CFO Wiki posture is still conflicting, so F6H must not infer which threshold controls or mark policy-source posture as ready for review.

## Context and Orientation

Pocket CFO has shipped:

- F6A deterministic `cash_posture` monitor result and alert card
- F6B manual taskless investigation handoff from one persisted alerting `cash_posture` monitor result
- F6C deterministic `collections_pressure` monitor result and alert card
- F6D deterministic `payables_pressure` monitor result and alert card
- F6E deterministic `policy_covenant_threshold` monitor result and alert card
- F6F one deterministic monitor demo replay and one Pocket CFO demo stack-pack foundation
- F6G manual taskless investigation handoff from one persisted alerting `collections_pressure` monitor result while preserving cash and rejecting payables and policy/covenant investigations

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

The relevant implementation seams for the shipped F6H implementation are:

- `packages/domain/src/finance-twin.ts` for source-backed cash, receivables-aging, payables-aging, company summary, freshness, lineage, coverage, diagnostics, and limitations schemas
- `packages/domain/src/cfo-wiki.ts` for CFO Wiki page/source binding, document extract, policy page, freshness, and limitations schemas
- `packages/domain/src/monitoring.ts` for latest monitor result, source freshness, lineage, proof posture, runtime boundary, and alert-card contracts
- `packages/domain/src/proof-bundle.ts` for proof vocabulary only if the implementation needs a proof-facing summary; F6H should not pretend checklist items are reports or monitor investigations
- `apps/control-plane/src/modules/finance-twin/**` for stored Finance Twin reads such as `getCashPosture`, `getCollectionsPosture`, `getPayablesPosture`, company summary, source freshness, and lineage
- `apps/control-plane/src/modules/wiki/**` for policy-document binding lists, policy pages, deterministic extract posture, policy-corpus posture, compile runs, freshness, and limitations
- `apps/control-plane/src/modules/monitoring/**` for latest persisted monitor results used only as optional context
- `apps/control-plane/src/modules/missions/**` for the existing alert investigation boundary that F6H must not widen
- `apps/control-plane/src/modules/evidence/**` for proof-summary conventions if needed, not report conversion
- `apps/web` for the minimal operator read model

No GitHub connector work is in scope.
No new environment variables are expected.
No stack-pack expansion is expected in F6H.
No runtime-Codex behavior is expected.

## Plan of Work

First, add a small pure close/control checklist contract in the domain package.
The contract should represent one company-scoped checklist result or read model, a bounded set of deterministic checklist items, finite item family/status vocabulary, evidence basis, source posture, freshness/limitations, and a human-review next step.
It should not add monitor kinds, discovery families, report kinds, approval kinds, payment instruction kinds, or delivery semantics.
Status: shipped in `packages/domain/src/close-control.ts`.

Second, add one control-plane close/control bounded context after the contract is clear.
The preferred shape is a folder such as `apps/control-plane/src/modules/close-control/**` with `schema.ts`, `service.ts`, `routes.ts`, `repository.ts` only if persistence is used, `formatter.ts`, and adjacent specs.
Routes must stay thin: parse input, call the service, and serialize output.
Checklist evaluation belongs in service or small helpers, not in routes.
Status: shipped as a read-only bounded context with no repository or persistence table.

Third, assemble checklist items only from stored state.
The service should read one `companyKey`, stored Finance Twin source posture for cash, receivables-aging, and payables-aging, stored CFO Wiki policy-source posture when relevant, and optionally the latest persisted monitor results for replay-readiness context only.
It must not read generic chat, report artifacts as primary input, runtime-Codex output, or F6B/F6G investigation missions as primary input.

Fourth, decide whether the first implementation needs persistence.
A read-only generated checklist read model may be enough for the first slice if it is deterministic and observable through a route and smoke.
If persistence is needed, it must be additive and scoped to derived checklist results only; raw sources remain immutable.
If the implementation stays read-only, record the replay reason explicitly in this plan and in the output posture.
Status: shipped read-only; the result boundary records that no checklist table or mission replay event is appended.

Fifth, expose the smallest operator read model.
The UI or API should show each checklist item, status, source posture, evidence basis, freshness/limitations, and human-review next step.
It should not show send, Slack, email, webhook, approval, report conversion, payment, booking, filing, legal, policy-advice, collection-action, or remediation controls.

Sixth, add one narrow implementation proof.
The proof should cover complete source posture, missing or stale source posture, policy-source gaps, optional monitor replay readiness, absence of forbidden side effects, and no new monitor/discovery family.
Status: shipped as `pnpm smoke:close-control-checklist:local`.

## Concrete Steps

1. Add the pure F6H checklist contract.
   Shipped files:
   - `packages/domain/src/close-control.ts`
   - `packages/domain/src/close-control.spec.ts`
   - `packages/domain/src/index.ts`

   The contract should define:
   - one company-scoped checklist result or read model
   - item families:
     - `source_coverage_review`
     - `cash_source_freshness_review`
     - `receivables_aging_source_freshness_review`
     - `payables_aging_source_freshness_review`
     - `policy_source_freshness_review`
     - `monitor_replay_readiness`
   - item statuses such as `ready_for_review`, `needs_review`, and `blocked_by_evidence`
   - source posture and evidence basis for each item
   - freshness summary and limitations for each item
   - a human-review next step for each item
   - runtime and action boundary fields proving no runtime-Codex, delivery, approvals, reports, accounting writes, bank writes, tax filings, legal advice, payment instructions, collection instructions, or autonomous remediation were used

2. Add the control-plane close/control bounded context.
   Shipped files:
   - `apps/control-plane/src/modules/close-control/schema.ts`
   - `apps/control-plane/src/modules/close-control/service.ts`
   - `apps/control-plane/src/modules/close-control/formatter.ts`
   - `apps/control-plane/src/modules/close-control/routes.ts`
   - adjacent specs

   No `repository.ts`, `drizzle-repository.ts`, DB schema, or migration was added.

   The service must:
   - accept exactly one `companyKey`
   - read stored Finance Twin source posture, not raw files directly
   - read stored CFO Wiki policy-source posture where relevant
   - optionally read latest persisted monitor results as context only
   - produce deterministic item statuses from stored posture
   - never invoke runtime-Codex
   - never create missions, reports, approvals, delivery, payment, bank, accounting, tax, legal, or autonomous actions

3. Add an HTTP read surface only if needed for the operator UI and smoke.
   Preferred first route:
   - `GET /close-control/companies/:companyKey/checklist`

   The route must not contain SQL, prompt assembly, source ingest logic, finance math, report conversion, approvals, delivery logic, or action execution.

4. Define deterministic item behavior.
   Required first behavior:
   - source coverage review checks whether required source-backed posture exists for cash, receivables-aging, payables-aging, and policy sources where policy review is expected
   - cash source freshness review reads stored cash-posture or bank-account-summary freshness and limitations
   - receivables-aging source freshness review reads stored receivables-aging or collections-posture freshness and limitations
   - payables-aging source freshness review reads stored payables-aging or payables-posture freshness and limitations
   - policy-source freshness review reads stored CFO Wiki policy-document binding, extract, policy page, and policy-corpus posture
   - monitor replay readiness reads latest persisted monitor results only as context
   - the first F6H implementation must not rerun monitors automatically or manually
   - the first F6H implementation must not add monitor-run controls
   - rerunning monitors remains available only through already shipped monitor routes and smokes, outside the checklist path
   - a close-complete or close-ready aggregate may appear only when all required items are present and fresh; otherwise the aggregate must state review-needed or blocked posture with limitations

5. Preserve shipped F5 and F6 behavior.
   Required absence checks:
   - no new monitor family
   - no new discovery family
   - no payables investigation
   - no policy/covenant investigation
   - no automatic mission creation
   - no scheduled monitor automation
   - no notification, email, Slack, webhook, send, publish, or delivery path
   - no runtime-Codex thread or writeup
   - no report artifact or report conversion
   - no approval kind or approval record
   - no accounting, bank, tax, legal, journal, payment, collection, customer-contact, or remediation action

6. Add one narrow implementation smoke.
   Shipped files:
   - `tools/close-control-checklist-smoke.mjs`
   - `pnpm smoke:close-control-checklist:local`

   The smoke should prove:
   - one company with complete fresh source posture yields review-ready checklist items without asserting close complete unless every required source is present and fresh
   - missing, failed, stale, unsupported, partial, or conflicting source posture yields `needs_review` or `blocked_by_evidence`
   - each checklist item includes source posture, evidence basis, freshness or limitations, status, and human-review next step
   - latest monitor results are context only and do not trigger autonomous actions
   - no runtime-Codex thread, mission, report artifact, approval, outbox event, notification, delivery action, bank/accounting/tax/legal write, journal entry, payment instruction, collection instruction, customer-contact instruction, policy/legal advice, or autonomous remediation is created
   - shipped F6A through F6G smokes remain green

7. Refresh docs after implementation only where behavior actually changes.
   Expected docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - `docs/ops/local-dev.md`
   - `docs/ops/source-ingest-and-cfo-wiki.md` only if source/freshness wording becomes stale
   - `docs/ops/codex-app-server.md` only if runtime-boundary wording becomes stale
   - `evals/README.md` and `docs/benchmarks/seeded-missions.md` only if a new smoke or benchmark statement is added

## Validation and Acceptance

This implementation thread must run the requested F6H validation ladder:

- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:cash-posture-monitor:local`
- `pnpm smoke:collections-pressure-monitor:local`
- `pnpm smoke:payables-pressure-monitor:local`
- `pnpm smoke:policy-covenant-threshold-monitor:local`
- `pnpm smoke:cash-posture-alert-investigation:local`
- `pnpm smoke:collections-pressure-alert-investigation:local`
- `pnpm smoke:finance-discovery-supported-families:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

F6H implementation acceptance is observable only if all of the following are true:

- one `companyKey` can produce one deterministic close/control checklist result or read model
- the checklist reads stored Finance Twin source posture and stored CFO Wiki policy/source posture only
- latest monitor results are optional context only, not automated triggers
- the checklist has a bounded set of items, each with source posture, evidence basis, freshness or limitations, status, and human-review next step
- no checklist item invents finance facts or hides stale, missing, failed, partial, unsupported, or conflicting evidence
- no "close complete" assertion appears unless all required sources are present and fresh
- no new monitor family or discovery family is added
- no `finance_memo`, `board_packet`, `lender_update`, or `diligence_packet` is used as primary checklist input
- no F6B or F6G investigation mission is used as primary checklist input
- no payables or policy/covenant investigation support is added
- no monitor evaluator changes are made
- no F5 reporting approval/release/circulation/correction semantics are changed
- no runtime-Codex, email, Slack, webhook, notification delivery, send, publish, report conversion, approval kind, payment instruction, journal booking, accounting write, bank write, tax filing, legal advice, policy advice, collection instruction, customer-contact instruction, autonomous remediation, or external action is added
- replay implications are covered by persistence or by an explicit recorded reason if the first result is read-only
- shipped F6 monitor, handoff, demo replay, and supported finance-discovery smokes remain green

## Idempotence and Recovery

F6H implementation must be retry-safe.
If the checklist is read-only, repeated reads for the same stored posture should produce the same statuses except for timestamp fields that are explicitly labeled as read timestamps.
If checklist results are persisted, repeated runs with the same source posture and run key should avoid misleading duplicate checklist results.

Raw sources, source snapshots, source files, deterministic extracts, CFO Wiki pages, Finance Twin facts, monitor results, missions, report artifacts, approvals, and delivery records must not be mutated to make the checklist pass.
If source state is missing, stale, failed, unsupported, partial, conflicting, or insufficient, the checklist should report that posture instead of inventing readiness or close-complete status.

Rollback for this implementation should revert only the additive F6H domain, control-plane, web, smoke, and doc changes while leaving FP-0050 through FP-0056, shipped monitor behavior, shipped alert handoff behavior, shipped demo replay behavior, F5 reporting/approval behavior, raw sources, CFO Wiki state, and Finance Twin state intact.
No destructive database migration belongs in F6H.

## Artifacts and Notes

This F6H implementation slice produces:

- `plans/FP-0057-close-control-checklist-foundation.md`
- one pure domain close/control checklist contract
- one read-only control-plane close/control bounded context and route
- one minimal operator checklist read surface
- one packaged checklist smoke alias
- active-doc updates that identify FP-0057 as the shipped F6H record
- no DB schema or migration, runtime behavior, delivery behavior, report behavior, approval behavior, accounting behavior, bank behavior, tax behavior, legal behavior, payment behavior, monitor-family behavior, discovery-family behavior, payables investigation, policy/covenant investigation, or F6I implementation

Do not create FP-0058 in this slice.
Do not start F6I, F6J, or F6K implementation here.

## Interfaces and Dependencies

Package boundaries must remain unchanged:

- `packages/domain` owns pure close/control checklist contracts and shared schemas
- `packages/db` owns additive persistence only if checklist results are stored
- `apps/control-plane/src/modules/finance-twin` owns stored Finance Twin source, freshness, coverage, lineage, diagnostics, and limitations reads
- `apps/control-plane/src/modules/wiki` owns stored CFO Wiki policy/source posture, deterministic extracts, policy pages, compile runs, freshness, and limitations
- `apps/control-plane/src/modules/monitoring` owns monitor result reads and must not be changed into a checklist engine
- `apps/control-plane/src/modules/missions` remains untouched by F6H; it must not create close/control missions
- `apps/control-plane/src/modules/evidence` may be referenced for proof posture language but must not turn checklists into reports
- `apps/web` owns operator read models only

Runtime-Codex stays out of scope:

- no runtime-Codex drafting
- no runtime-Codex close/control writeups
- no natural-language autonomous monitoring
- no runtime-owned finance facts

Delivery and autonomous action stay out of scope:

- no email
- no Slack
- no webhooks
- no notifications
- no send, distribute, publish, pay, book, file, release, tax filing, legal advice, policy advice, payment instruction, vendor-payment recommendation, collection instruction, customer-contact instruction, or external action

Later slices are named but not created here:

- `F6I-stack-pack-expansion`, only after one close/control checklist is green
- `F6J-notification-delivery-planning`, only if a future plan proves safe
- `F6K-close-control-approval-or-acknowledgement`, only if operator need is proven

Current module vocabulary stays stable.
Do not rename `modules/twin/**`, `modules/reporting/**`, or `@pocket-cto/*`.
Do not delete GitHub or engineering-twin modules as part of F6H.
No new environment variables are expected.
GitHub connector work is out of scope.

## Outcomes & Retrospective

This section is completed by the F6H implementation closeout.

Current implementation outcome:
FP-0057 is the shipped F6H record.
F6H shipped one deterministic close/control checklist foundation from stored Finance Twin source posture, stored CFO Wiki policy/source posture, and latest persisted monitor-result context only.
The checklist is read-only and does not persist a checklist table; its replay posture is explicit in the runtime/action boundary.
No F6I implementation started, and no monitor family, discovery family, monitor rerun, investigation, runtime-Codex behavior, delivery/send behavior, report behavior, approval behavior, accounting write, bank write, tax filing, legal advice, policy advice, payment behavior, collection instruction, customer-contact instruction, or autonomous action was added.
The exact next recommendation is to start F6I planning only as a new Finance Plan if the product wants stack-pack expansion; otherwise use a narrow F6H continuation only for polish discovered by validation.
