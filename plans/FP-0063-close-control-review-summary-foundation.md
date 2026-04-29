# Plan F6N close/control review summary foundation

## Purpose / Big Picture

This is the shipped Finance Plan record for the Pocket CFO F6N implementation slice.
The target phase is `F6`, and the implemented slice is exactly `F6N-close-control-review-summary-foundation`.

The user-visible goal is narrow: after shipped F6A through F6M, Pocket CFO should be able to show one deterministic internal close/control review summary that a human operator can review before deciding what, if anything, should happen next.
This is not certification.
It is not a close-complete assertion.
It is not sign-off, attestation, legal or audit opinion, report release, report circulation, external delivery, or an approval workflow.

Repo truth supports F6N only in this reduced shape.
F6H already ships a deterministic close/control checklist over stored Finance Twin posture, stored CFO Wiki policy/source posture, and latest persisted monitor results as context only.
F6J already ships a deterministic internal operator attention/readiness read model over latest persisted monitor results, close/control checklist posture, source/freshness posture, and proof posture.
F6K already ships deterministic internal acknowledgement-readiness over F6H and F6J, with explicit no-approval, no-close-complete, no-delivery, no-report, no-mission, no-monitor-rerun, no-runtime-Codex, and no-finance-action boundaries.
F6M already ships deterministic internal delivery-readiness over F6J and F6K only, with explicit no-send/no-provider/no-outbox boundaries.
Those shipped read models justify a first internal review-summary contract because F6N can summarize their stored/read posture without mutating them.

The first F6N implementation remained read-only and no-schema.
If persistence is needed later, a future plan must justify why and keep it additive, idempotent, company-scoped, evidence-linked, and explicitly not a certification, approval, close-complete, release, circulation, or delivery record.
GitHub connector work is explicitly out of scope.

## Progress

- [x] 2026-04-29T01:13:45Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-04-29T01:13:45Z Ran preflight against fetched `origin/main`, confirmed the branch is `codex/f6n-master-plan-and-doc-refresh-local-v1`, confirmed the worktree was clean, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-04-29T01:13:45Z Read the active docs, shipped FP-0062 record, package scripts, F6 domain contracts, F6 control-plane modules, evidence/approval boundaries, and shipped F6 smoke/proof tools requested for this docs-and-plan slice.
- [x] 2026-04-29T01:13:45Z Decided repo truth supports F6N only as a deterministic internal close/control review summary, not certification or external reporting; F6O source-pack expansion is not the safer immediate next plan when F6N is kept in this reduced shape.
- [x] 2026-04-29T01:13:45Z Created this FP-0063 implementation-ready planning contract and updated active docs to point at it without adding code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, runtime behavior, or implementation scaffolding.
- [x] 2026-04-29T01:23:32Z Ran the requested docs-and-plan validation ladder through `pnpm ci:repro:current`; all commands passed before commit.
- [x] 2026-04-29T12:12:35Z Ran local closeout-polish preflight on `codex/f6n-plan-progress-closeout-polish-local-v1`, read the active FP/docs, and scoped the correction to stale FP-0063 implementation-handoff wording only; no code, routes, schema, package scripts, smoke commands, eval datasets, fixtures, FP-0064, F6N implementation, or F6O planning started.
- [x] 2026-04-29T12:44:26Z Ran implementation-thread preflight on `codex/f6n-close-control-review-summary-foundation-local-v1`, confirmed fetched `origin/main`, clean worktree, GitHub auth/repo access, and Docker Postgres/object storage availability.
- [x] 2026-04-29T12:44:26Z Implemented the F6N domain contract, read-only control-plane bounded context, thin `GET /close-control/companies/:companyKey/review-summary` route, company-scope guard, and focused domain/service/route specs without schema, migrations, package scripts, smoke aliases, fixtures, runtime-Codex, delivery, reports, approvals, monitor reruns, source mutation, generated prose, or F6O work.
- [x] 2026-04-29T12:44:26Z Ran the new narrow F6N specs and direct domain/control-plane typechecks; all passed before docs closeout.
- [x] 2026-04-29T12:59:52Z Ran the full requested F6N validation ladder, including narrow domain/control-plane regression specs, shipped F6 smokes, twin guardrails, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed before commit.
- [x] 2026-04-29T13:04:38Z Split the new review-summary section builders to keep implementation files under the modular soft cap, then reran the affected review-summary specs, control-plane typecheck, and `pnpm lint`; all passed before final reproducibility validation.
- [x] 2026-04-29T13:07:06Z Reran `pnpm ci:repro:current` after the modular split; final reproducibility validation passed before commit.

## Surprises & Discoveries

The roadmap phrase "close/control reporting or certification" is too broad for repo truth.
The safe contract is a close/control review summary, not certification, because shipped F6H/F6J/F6K/F6M posture can support an internal evidence summary but does not prove legal, audit, sign-off, close-complete, or external reporting authority.

F5 report release and circulation state exists, but it is unsafe as a primary input for F6N.
Those seams carry `report_release` and `report_circulation` approval/release/circulation semantics and must not be reused as close/control certification, sign-off, or release posture.

F6M delivery-readiness exists, but it is not external delivery.
F6N may summarize the F6M boundary only as an internal "no-send / review-before-delivery" posture, not as a delivery plan or provider-readiness signal.

No persistence is justified for the first F6N slice.
The useful first behavior can be derived on read from shipped F6H/F6J/F6K/F6M posture and latest persisted monitor context, so a schema or replay event would create a stronger record than the repo truth currently needs.

The control-plane typecheck reads the domain package through package references, so the new domain contract had to be buildable before the control-plane package could see the new export during local verification.

## Decision Log

Decision: proceed with `F6N-close-control-review-summary-foundation` rather than switch immediately to F6O source-pack expansion.
Rationale: repo truth supports a safe F6N only because it can be narrowed to one deterministic internal review summary over shipped stored/read posture. F6L remains green as a source-pack guardrail, but another source-pack expansion is less urgent than locking the close/control review-summary boundary before anyone reaches for certification language.

Decision: F6N is not certification in the first implementation.
Rationale: the plan must not add certification status, close-complete status, sign-off, attestation, legal opinion, audit opinion, or legal/policy advice. Use "close/control review summary" or "internal review summary" in operator-facing naming.

Decision: F6N is not report release or external delivery.
Rationale: the plan must not add report release, report circulation, external publish, email, Slack, SMS, webhook, provider calls, outbox sends, scheduled sends, generated notification prose, or any delivery action.

Decision: F6N is not an approval workflow.
Rationale: no new approval kind belongs in F6N, and F6N must not reuse F5 `report_release` or `report_circulation` semantics. The first summary must not imply sign-off, certification, close complete, external release, board circulation, lender release, diligence release, or legal attestation.

Decision: F6N starts only from shipped stored/read state.
Rationale: allowed inputs are F6H close/control checklist posture, F6J operator-readiness posture, F6K acknowledgement-readiness posture, F6M delivery-readiness posture, latest persisted monitor results only as context if needed, and source/CFO Wiki freshness posture already surfaced through those reads. Generic chat, report artifacts as primary input, runtime-Codex output, mission-generated prose, monitor reruns, source mutation, and demo replay runtime execution are out of scope.

Decision: the output contract is one deterministic internal close/control review summary result or read model.
Rationale: the result should contain a bounded list of review sections. Each section must include evidence basis, freshness/limitations, proof posture, status, and a human-review next step. The result must state the absence of certification, close complete, approval, report release, delivery/send action, mission creation, legal/policy/payment/collection/customer-contact instruction, and autonomous action.

Decision: the first F6N implementation should be read-only and no-schema.
Rationale: F6H/F6J/F6K/F6M already expose enough read posture. If persistence is needed later, a future plan must justify why and keep it additive, idempotent, company-scoped, evidence-linked, and explicitly not a certification, approval, close-complete, release, circulation, or delivery record.

Decision: F6N must preserve shipped F5 and F6 behavior.
Rationale: no F5 report/release/circulation/correction changes, monitor evaluator changes, F6B/F6G mission changes, F6H checklist behavior changes, F6J readiness behavior changes, F6K acknowledgement behavior changes, F6L source-pack behavior changes, F6M delivery-readiness behavior changes, new approval kind, report conversion, monitor-family expansion, or discovery-family expansion belongs in F6N.

Decision: later slices are named but not created here.
Rationale: `F6O-additional-source-pack-expansion` should happen only after the bank/card source pack remains green and a future plan proves the next narrow source-pack need. `F6P-external-provider-integration` should happen only if a future plan proves human-review gates, provider boundaries, compliance posture, observability, retry behavior, safe failure modes, and no autonomous send. `F6Q-close-control-certification` should happen only if operator need, evidence boundaries, legal boundaries, and review gates are proven. Do not create FP-0064, F6O, F6P, or F6Q in this slice.

Decision: polish only the stale FP-0063 retrospective handoff wording.
Rationale: the prior planning-thread validation, commit, push, and PR work was already complete before this implementation thread, so FP-0063 handed implementation to this F6N slice only if it followed this plan, remained read-only/no-schema unless a concrete blocker was proven, and stayed limited to deterministic internal close/control review-summary posture. F6O and later work require a future Finance Plan.

Decision: implement company-scope guards for all four upstream read models before formatting the review summary.
Rationale: F6N summarizes posture across F6H/F6J/F6K/F6M, so any upstream `companyKey` mismatch must fail closed with the existing `invalid_request` error shape instead of summarizing cross-company posture.

Decision: keep F6N proof at domain/control-plane specs plus the shipped F6 smoke ladder, not a new package smoke alias.
Rationale: FP-0063 did not authorize a new smoke alias. The first read-only route is small enough for focused unit/route specs, while the shipped smokes continue to prove the upstream F6H/F6J/F6K/F6M source, freshness, proof, and action-absence posture.

## Context and Orientation

Pocket CFO has shipped F6A through F6M:

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
- F6L one checked-in bank/card source-pack foundation with normalized source/twin posture and direct proof through existing source registry and Finance Twin routes only
- F6M one deterministic internal delivery-readiness boundary read model over shipped operator-readiness and acknowledgement-readiness posture only
- F6N one deterministic internal close/control review-summary read model over shipped checklist, operator-readiness, acknowledgement-readiness, and delivery-readiness posture only

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

The relevant implementation seams for F6N are:

- `packages/domain/src/close-control.ts` for F6H checklist item families, statuses, source/evidence/freshness/proof posture, limitations, human-review next steps, and absence boundaries
- `packages/domain/src/operator-readiness.ts` for F6J attention/readiness posture, evidence basis, freshness, limitations, proof posture, human-review next steps, and absence boundaries
- `packages/domain/src/close-control-acknowledgement.ts` for F6K acknowledgement-readiness targets, internal acknowledgement statuses, readiness context, and absence boundaries
- `packages/domain/src/delivery-readiness.ts` for F6M delivery-readiness targets, internal review-before-delivery statuses, no-send/no-provider/no-outbox posture, and absence boundaries
- `packages/domain/src/monitoring.ts` for shipped monitor families, latest persisted monitor results, alert cards, source lineage, freshness, limitations, proof posture, and runtime boundaries
- `packages/domain/src/proof-bundle.ts` for existing proof vocabulary and F5 report release/circulation facts that F6N must not use as primary inputs
- `packages/domain/src/approval.ts` for the existing approval kinds that F6N must not widen
- `apps/control-plane/src/modules/close-control/**` for the shipped F6H checklist service and route
- `apps/control-plane/src/modules/operator-readiness/**` for the shipped F6J read-only service and route
- `apps/control-plane/src/modules/close-control-acknowledgement/**` for the shipped F6K read-only service and route
- `apps/control-plane/src/modules/delivery-readiness/**` for the shipped F6M read-only service and route
- `apps/control-plane/src/modules/monitoring/**` for latest persisted monitor result reads and monitor-result persistence, not F6N monitor reruns
- `apps/control-plane/src/modules/evidence/**` for proof-language conventions only, not report conversion
- `apps/control-plane/src/modules/approvals/**` as an explicit out-of-scope boundary except for proving no new approval kind or approval record is created

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No source mutation is expected.
No database schema migration, eval dataset, fixture family, package script, smoke alias, monitor family, discovery family, report, approval, delivery behavior, provider integration, outbox send, payment behavior, finance write, legal/policy advice, collection/customer-contact instruction, certification, close-complete status, sign-off, attestation, or autonomous action belongs in F6N.

## Plan of Work

First, implement one pure domain contract for the review summary.
The implemented contract name is `CloseControlReviewSummaryResult` with bounded `CloseControlReviewSection` entries.
The contract should include company scope, generated time, aggregate internal-review status, evidence summary, limitations, runtime/action absence boundary, and review sections.
Status naming must stay internal, such as `ready_for_review_summary`, `needs_human_review`, and `blocked_by_evidence`.
Do not add `certified`, `signed_off`, `approved`, `close_complete`, `release_ready`, `delivered`, or provider-ready statuses.

Second, implement one read-only control-plane bounded context.
The folder is `apps/control-plane/src/modules/close-control-review-summary/**`.
The route is a thin read route at `GET /close-control/companies/:companyKey/review-summary`.
The route must parse `companyKey`, call the service, and serialize the result.
It must not contain SQL, prompt assembly, source ingest logic, finance math, report conversion, approval behavior, notification-provider logic, outbox logic, monitor rerun logic, mission creation, source mutation, or external action execution.

Third, the service should depend only on shipped read services.
Allowed direct reads are F6H checklist, F6J operator-readiness, F6K acknowledgement-readiness, and F6M delivery-readiness.
Latest persisted monitor results may be used only as context if the section contract needs to expose monitor posture directly, but monitor reruns must remain out of scope.
The service must not read report artifacts as primary input, generic chat, mission-generated prose, runtime-Codex output, release/circulation records, or demo replay runtime output.

Fourth, output sections should be bounded.
The expected first section families are:

- `close_control_checklist_posture`
- `operator_readiness_posture`
- `acknowledgement_readiness_posture`
- `delivery_boundary_posture`
- `monitor_context_posture`
- `source_and_wiki_freshness_posture`

Each section must include:

- evidence basis with refs back to shipped read posture
- freshness or missing-source posture
- limitations
- proof posture
- internal review status
- human-review next step

Fifth, persistence remains absent in the first implementation.
No database schema, migration, review-summary table, certification record, acknowledgement record, approval record, report artifact, outbox event, source mutation record, replay event, or runtime-Codex artifact should be added.

## Concrete Steps

1. Add the pure domain contract in the implementation slice.
   Likely files:
   - `packages/domain/src/close-control-review-summary.ts`
   - `packages/domain/src/close-control-review-summary.spec.ts`
   - `packages/domain/src/index.ts`

   Acceptance:
   - one company-scoped review summary result
   - bounded section families
   - internal-only statuses
   - evidence basis, freshness/limitations, proof posture, status, and human-review next step on every section
   - explicit absence boundary for certification, close-complete status, sign-off, attestation, approval, report release, delivery/send action, mission creation, monitor rerun, runtime-Codex, source mutation, finance writes, legal/policy/payment/collection/customer-contact instruction, and autonomous action

2. Add a read-only control-plane bounded context only if implementation begins.
   Likely files:
   - `apps/control-plane/src/modules/close-control-review-summary/schema.ts`
   - `apps/control-plane/src/modules/close-control-review-summary/service.ts`
   - `apps/control-plane/src/modules/close-control-review-summary/formatter.ts`
   - `apps/control-plane/src/modules/close-control-review-summary/routes.ts`
   - `apps/control-plane/src/modules/close-control-review-summary/service.spec.ts`
   - `apps/control-plane/src/modules/close-control-review-summary/routes.spec.ts`

   Acceptance:
   - service reads shipped F6H/F6J/F6K/F6M posture only
   - route stays thin
   - no direct DB writes or schema changes
   - no monitor reruns
   - no report/approval/delivery/runtime/source mutation behavior
   - no changes to shipped F6H/F6J/F6K/F6M behavior

3. Keep the operator surface out of the first implementation unless a future implementation prompt explicitly asks for it.
   A backend-first read is sufficient for first acceptance.
   Do not add a dashboard, generated prose, report view, release view, or certification surface in F6N.

4. Do not add a new package smoke alias in the first implementation unless a later prompt explicitly changes this plan.
   Prefer direct unit/route specs plus the existing shipped F6 smoke ladder.
   The existing smokes already prove source/freshness/proof/readiness boundaries.

5. Refresh only the active docs needed by the implementation slice.
   Keep FP-0050 through FP-0062 as shipped records.
   Mark FP-0063 as the shipped F6N record once validation is green.

## Validation and Acceptance

This docs-and-plan thread must run the user-requested validation ladder after docs edits:

- `pnpm smoke:delivery-readiness:local`
- `pnpm smoke:operator-readiness:local`
- `pnpm smoke:close-control-acknowledgement:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
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

The implementation slice adds narrow domain and control-plane specs for the new review summary contract and then reruns the same shipped F6 guardrail ladder.

Implementation validation completed on `2026-04-29T12:59:52Z` and passed the full requested ladder, including:

- narrow F6N domain, service, and route specs
- shipped F6H/F6J/F6K/F6M and monitor/source/freshness smokes
- twin guardrail specs
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Implementation acceptance requires all of the following:

- one deterministic internal close/control review summary result or read model exists
- the result is derived only from shipped stored/read state
- sections are bounded and carry evidence basis, freshness/limitations, proof posture, status, and human-review next step
- output exposes explicit absence boundaries showing no certification, close complete, sign-off, attestation, approval, report release, external delivery, send, provider call, mission creation, monitor rerun, runtime-Codex work, generated prose, source mutation, finance write, legal/policy/payment/collection/customer-contact instruction, or autonomous action occurred
- no external provider integration is added
- no email, Slack, SMS, webhook, notification provider call, outbox send, scheduled notification, auto-send, report delivery, external publish behavior, approval, report, mission creation, monitor rerun, runtime-Codex drafting, generated prose, source mutation, payment behavior, accounting write, bank write, tax filing, legal advice, policy advice, collection instruction, customer-contact instruction, or autonomous action is added
- no report conversion or F5 release/circulation semantics are reused as F6N approval/certification semantics
- no new monitor family or discovery family is added
- shipped F5 and F6 behavior remains unchanged

## Idempotence and Recovery

The preferred F6N implementation is retry-safe because it is read-only.
Repeated reads over the same shipped stored/read posture should produce the same review-summary status except for explicitly labeled read timestamps.

Raw sources, source snapshots, source files, deterministic extracts, CFO Wiki pages, Finance Twin facts, monitor results, close/control checklist posture, operator-readiness posture, acknowledgement-readiness posture, delivery-readiness posture, missions, reports, approvals, release/circulation records, source-pack fixtures, and demo fixtures must not be mutated to make the review summary pass.

If source state is missing, stale, failed, unsupported, partial, conflicting, or insufficient, F6N should report that posture instead of inventing certification readiness, approval, release, sign-off, legal attestation, close completion, or external delivery permission.

Rollback for the future implementation should remove only additive F6N review-summary domain/read-model/docs changes.
Rollback must leave FP-0050 through FP-0062, shipped monitor behavior, shipped alert handoff behavior, shipped checklist behavior, shipped demo replay behavior, shipped operator-readiness behavior, shipped acknowledgement-readiness behavior, shipped source-pack proof, shipped delivery-readiness behavior, F5 reporting/approval/release/circulation behavior, raw sources, CFO Wiki state, Finance Twin state, and GitHub/engineering-twin modules intact.
No destructive database migration belongs in F6N.

## Artifacts and Notes

This F6N implementation slice creates:

- `packages/domain/src/close-control-review-summary.ts`
- `packages/domain/src/close-control-review-summary.spec.ts`
- `apps/control-plane/src/modules/close-control-review-summary/**`
- `GET /close-control/companies/:companyKey/review-summary`
- active-doc updates that identify FP-0063 as the shipped F6N record
- no database schema or migrations
- no package scripts
- no smoke commands
- no eval datasets
- no fixtures
- no monitor-family or discovery-family expansion
- no runtime-Codex
- no external provider integration
- no delivery, notification provider, outbox send, email, Slack, SMS, webhook, report, approval, mission creation, monitor rerun, monitor-result creation, source mutation, payment behavior, accounting write, bank write, tax filing, legal/policy advice, collection/customer-contact instruction, certification, sign-off, close-complete status, attestation, report release, report circulation, generated prose, or autonomous action behavior

No FP-0064 was created in this slice.
No F6O, F6P, F6Q, or later implementation work started here.

Likely later slices, not created here:

- `F6O-additional-source-pack-expansion`, only after the bank/card source pack remains green and source-backed
- `F6P-external-provider-integration`, only if a future plan proves human-review gates, provider boundaries, compliance posture, observability, retry behavior, safe failure modes, and no autonomous send
- `F6Q-close-control-certification`, only if operator need, evidence boundaries, legal boundaries, review gates, and non-autonomous safety posture are proven

## Interfaces and Dependencies

Package boundaries must remain unchanged:

- `packages/domain` owns pure contracts for monitors, close/control, readiness, acknowledgement, delivery-readiness, review-summary vocabulary, proof, mission, reporting, and approval vocabulary
- `packages/db` remains untouched unless a later plan explicitly justifies additive persistence, which this F6N plan does not need
- `apps/control-plane/src/modules/close-control` owns shipped F6H checklist posture and must not be changed for F6N unless implementation discovers a direct truthfulness bug
- `apps/control-plane/src/modules/operator-readiness` owns shipped F6J readiness and must not be changed for F6N unless implementation discovers a direct truthfulness bug
- `apps/control-plane/src/modules/close-control-acknowledgement` owns shipped F6K acknowledgement-readiness and must not be changed for F6N unless implementation discovers a direct truthfulness bug
- `apps/control-plane/src/modules/delivery-readiness` owns shipped F6M delivery-readiness and must not be changed for F6N unless implementation discovers a direct truthfulness bug
- `apps/control-plane/src/modules/monitoring` owns shipped monitor behavior and must not be changed for review summary
- `apps/control-plane/src/modules/reporting` and `apps/control-plane/src/modules/approvals` remain out of scope except as explicit boundaries F6N must not reuse

Runtime-Codex stays out of scope:

- no runtime-Codex close/control summary drafting
- no runtime-Codex certification prose
- no runtime-Codex acknowledgement prose
- no runtime-Codex notification prose
- no runtime-Codex delivery text
- no runtime-Codex monitoring findings
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
- no send, distribute, publish, release, report delivery, pay, book, file, tax filing, legal advice, policy advice, payment instruction, vendor-payment recommendation, collection instruction, customer-contact instruction, generated prose, or external action

Current module vocabulary stays stable.
Do not rename `modules/twin/**`, `modules/reporting/**`, or `@pocket-cto/*`.
Do not delete GitHub or engineering-twin modules as part of F6N.

## Outcomes & Retrospective

This implementation slice ships FP-0063 as the F6N record after adding one deterministic internal close/control review-summary foundation.
The implementation stays read-only and no-schema, adds one thin backend route, derives only from shipped F6H/F6J/F6K/F6M posture, and explicitly rejects certification, close-complete status, sign-off, attestation, report release, report circulation, external delivery, approval semantics, runtime-Codex drafting, generated prose, mission creation, monitor reruns, monitor-result creation, source mutation, finance writes, advice/instructions, and autonomous action.

What remains next:

- F6O planning may start next only through a new Finance Plan.
- If operators need more F6N proof before F6O, the next continuation should stay narrow, likely adding a packaged proof only if a future plan explicitly justifies one.
- Do not start certification, close complete, report release, report circulation, external delivery, approval workflows, runtime-Codex drafting, generated prose, monitor reruns, missions, source mutation, finance writes, legal/policy/payment/collection/customer-contact advice or instructions, autonomous action, new monitor families, or new discovery families from this record alone.
