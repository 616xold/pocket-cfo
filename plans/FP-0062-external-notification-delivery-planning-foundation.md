# Plan F6M external notification delivery readiness boundary

## Purpose / Big Picture

This file is the shipped Finance Plan record for the Pocket CFO F6M implementation slice.
The target phase is `F6`, and the shipped implementation slice is exactly `F6M-external-notification-delivery-planning-foundation`.

The user-visible goal is deliberately narrow: after shipped F6A through F6L, Pocket CFO should be able to show an internal operator whether an existing source-backed monitoring, close/control, readiness, and acknowledgement posture is ready for a future human review of possible external notification or delivery.
The first F6M implementation must therefore be delivery-readiness only.
It must not send, schedule, publish, release, circulate, call a provider, create an outbox send event, create an approval, create a report, create a mission, rerun a monitor, invoke runtime-Codex, generate notification prose, mutate sources, or take finance action.

Repo truth supports F6M only in this bounded shape.
F6J already ships one deterministic internal operator attention/readiness read model over latest persisted monitor results, close/control checklist posture, source/freshness posture, and proof posture.
F6K already ships one deterministic internal close/control acknowledgement-readiness read model over shipped checklist and operator-readiness posture, with explicit no-approval, no-close-complete, no-delivery, no-outbox-send, no-report, no-mission, no-monitor-rerun, no-runtime-Codex, and no-finance-action boundaries.
F6L already proves the bank/card source-pack path through existing source registry and Finance Twin routes without widening runtime behavior.
The outbox module remains only a placeholder README, and there is no checked-in email, Slack, SMS, webhook, or notification-provider send path for F6M to invoke.

F6M shipped an internal delivery-readiness read model, but not external delivery itself.
The implementation makes the human-review gate explicit and preserves source lineage, freshness posture, limitations, proof posture, and absence boundaries.
GitHub connector work is explicitly out of scope.

## Progress

- [x] 2026-04-28T23:04:46Z Invoked the requested Pocket CFO operator plugin guards, fetched `origin/main`, confirmed the branch, GitHub access, Docker services, and clean worktree.
- [x] 2026-04-28T23:04:46Z Read the active docs, shipped FP-0059 through FP-0061 records, package scripts, domain monitoring/close-control/readiness/acknowledgement/proof contracts, control-plane F6 modules, outbox placeholder, evidence seams, and shipped smoke/proof tools.
- [x] 2026-04-28T23:04:46Z Decided repo truth supports F6M only as deterministic internal delivery-readiness planning, rather than actual external delivery, F6N reporting/certification planning, or F6O source-pack expansion.
- [x] 2026-04-28T23:04:46Z Created FP-0062 as the single active implementation-ready F6M contract while preserving FP-0050 through FP-0061 as shipped F6A through F6L records.
- [x] 2026-04-28T23:15:09Z Ran the requested docs-and-plan validation ladder, including the serial DB-backed smokes, twin guardrail specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-04-28T23:33:34Z Polished F6M handoff wording so implementation may start only from FP-0062 as deterministic internal delivery-readiness, and removed duplicate future-acceptance wording.
- [x] 2026-04-28T23:59:35Z Implemented the first real F6M slice: pure domain delivery-readiness contract, read-only control-plane service and route, smallest web read surface, packaged `pnpm smoke:delivery-readiness:local`, and active-doc refresh.
- [x] 2026-04-28T23:59:35Z Confirmed narrow domain, control-plane, web, and delivery-readiness smoke checks pass before the full validation ladder.
- [x] 2026-04-29T00:10:50Z Ran the full F6M validation ladder, fixed the local formatter type/lint polish issues inside the F6M slice, reran the affected delivery-readiness checks, and confirmed `pnpm ci:repro:current` succeeds.

## Surprises & Discoveries

F6M is safe to plan now only because the first implementation can be delivery-readiness rather than delivery.
F6J and F6K together provide enough internal review posture to derive a readiness boundary, while still proving that no approval, report, delivery, outbox send, mission creation, monitor rerun, runtime-Codex work, or finance action occurred.

Implementation confirmed no persistence was needed.
The F6M result is derived on read from F6J operator-readiness and F6K acknowledgement-readiness only; it does not add DB schema, migrations, delivery records, approval records, report artifacts, outbox events, source mutations, or replay events.

The outbox bounded context is intentionally not a delivery system today.
It is only `apps/control-plane/src/modules/outbox/README.md`, which reserves the bounded context for later async event and projection jobs.
F6M must treat that absence as a hard safety boundary, not as a gap to fill in the first implementation.

F5 release and circulation records exist, but they are not safe primary inputs for F6M.
They carry report release or circulation semantics on existing approval seams.
F6M must not reuse those semantics as a generic external delivery gate, and it must not create a new approval kind.

The word "external notification/delivery" is intentionally dangerous.
F6M should use operator-facing wording such as "delivery readiness", "review-before-delivery posture", and "future delivery review target" while every output states that no external send or release occurred.

## Decision Log

Decision: proceed with `F6M-external-notification-delivery-planning-foundation` rather than switching next to F6N close/control reporting/certification planning or F6O additional source-pack expansion.
Rationale: F6J internal operator readiness and F6K acknowledgement-readiness provide enough review posture to plan one deterministic delivery-readiness boundary now. F6L source-pack proof remains a guardrail, but another source-pack expansion is less urgent than explicitly locking the delivery boundary before anyone implements notification-adjacent work.

Decision: the first F6M implementation is delivery-readiness only.
Rationale: F6M must not add email sends, Slack sends, SMS sends, webhook calls, notification provider calls, outbox send behavior, report delivery, external publish behavior, scheduled delivery, or auto-send.

Decision: F6M is not an approval workflow.
Rationale: no new approval kind belongs in F6M. Do not reuse F5 `report_release` or `report_circulation` approval semantics without a later named plan proving it safe. F6M must not imply sign-off, certification, close complete, external release, legal attestation, board circulation, lender release, diligence release, or any other release authority.

Decision: F6M should be internal and operator-visible first.
Rationale: the useful first surface is one deterministic delivery-readiness result or read model that explains why a future delivery might be reviewed, what evidence supports that posture, what is stale or limited, and what human review step remains. It is not a send workflow.

Decision: F6M starts only from shipped stored/read state.
Rationale: allowed inputs are the operator-readiness result or read posture, close/control acknowledgement-readiness result or read posture, close/control checklist result, latest persisted monitor results only as context, and source/CFO Wiki freshness posture already surfaced through those reads. F6M must not read generic chat, report artifacts as primary input, runtime-Codex output, mission-generated prose, monitor reruns, or demo replay runtime execution.

Decision: the output contract is one internal delivery-readiness result with bounded targets.
Rationale: each target must include evidence basis, source lineage or proof reference, freshness or missing-source posture, limitations, proof posture, status, human-review next step, and explicit absence boundaries showing no send occurred.

Decision: F6M must be read-only and no-schema first unless a concrete blocker appears during implementation.
Rationale: F6J, F6K, F6H, and monitor results already expose enough stored/read posture for a derived read model. If persistence is needed later, a future plan must justify why and keep it additive, idempotent, company-scoped, evidence-linked, actor-attributed where needed, and explicitly not a send record, not a delivery log, not an approval, not a report release, and not close complete.

Decision: implement the F6M service with only F6J and F6K read dependencies.
Rationale: F6K already carries the necessary checklist context and F6J already carries monitor/source/freshness/proof posture, so the delivery-readiness service does not need a direct close/control, monitoring, mission, outbox, approval, reporting, source, or runtime dependency.

Decision: use delivery-readiness statuses `ready_for_delivery_review`, `needs_review_before_delivery`, and `blocked_by_evidence`.
Rationale: these statuses match the implementation request and avoid send-ready, provider-ready, approval, release, certification, close-complete, or delivered semantics.

Decision: F6M preserves shipped F5 and F6 behavior.
Rationale: no F5 report, release, circulation, correction, or publication behavior changes belong in F6M. No monitor evaluator changes, F6B/F6G mission changes, F6H checklist behavior changes, F6J readiness behavior changes, F6K acknowledgement behavior changes, F6L source-pack behavior changes, new approval kind, report conversion, or runtime-Codex behavior belongs in F6M.

Decision: likely later slices are named but not created here.
Rationale: `F6N-close-control-reporting-or-certification-planning` should happen only if operator need and evidence boundaries are proven; `F6O-additional-source-pack-expansion` should happen only after the first bank/card source pack remains green; `F6P-external-provider-integration` should happen only if a future plan proves human-review gates, provider boundaries, compliance posture, and safe failure modes. Do not create FP-0063 in this slice.

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

The relevant implementation seams for shipped F6M and future guarded work are:

- `packages/domain/src/delivery-readiness.ts` for the F6M internal delivery-readiness contract, target kinds, delivery-review status vocabulary, evidence refs, source/freshness/proof posture, limitations, human-review next steps, and runtime/action absence boundary
- `packages/domain/src/operator-readiness.ts` for F6J internal attention items, evidence basis, freshness, limitations, proof posture, human-review next steps, and absence boundaries
- `packages/domain/src/close-control-acknowledgement.ts` for F6K acknowledgement-readiness targets, acknowledgement status vocabulary, readiness context, and absence boundaries
- `packages/domain/src/close-control.ts` for F6H checklist item families, source/evidence/freshness/proof posture, and close-control absence boundaries
- `packages/domain/src/monitoring.ts` for shipped monitor families, latest persisted monitor result posture, alert cards, source lineage, freshness, limitations, proof posture, and runtime boundaries
- `packages/domain/src/proof-bundle.ts` for existing proof vocabulary and F5 report publication/readiness facts that F6M must not use as primary delivery-readiness inputs
- `apps/control-plane/src/modules/operator-readiness/**` for the shipped F6J read-only service and route
- `apps/control-plane/src/modules/close-control-acknowledgement/**` for the shipped F6K read-only service and route
- `apps/control-plane/src/modules/delivery-readiness/**` for the shipped F6M read-only service, formatter, route, and specs
- `apps/control-plane/src/modules/close-control/**` for the shipped F6H checklist service and route
- `apps/control-plane/src/modules/monitoring/**` for latest persisted monitor result reads and monitor-result persistence, not new F6M monitor runs
- `apps/control-plane/src/modules/evidence/**` for proof-language conventions only, not report conversion
- `apps/control-plane/src/modules/outbox/README.md` as a boundary proving no send pipeline exists in the first F6M slice
- `apps/web/app/delivery-readiness/page.tsx` and `apps/web/components/delivery-readiness-card.tsx` for the smallest read-only operator surface
- `tools/operator-readiness-smoke.mjs`, `tools/close-control-acknowledgement-smoke.mjs`, `tools/close-control-checklist-smoke.mjs`, `tools/monitor-demo-replay-smoke.mjs`, `tools/bank-card-source-pack-proof.mjs`, and `tools/delivery-readiness-smoke.mjs` for shipped proof and absence-boundary patterns

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No source mutation is expected.
No database schema migration, eval dataset, new fixture family, monitor family, discovery family, report, approval, delivery behavior, provider integration, outbox send, payment behavior, finance write, legal/policy advice, collection/customer-contact instruction, or autonomous action belongs in this F6M slice.

## Plan of Work

First, the implementation added one pure delivery-readiness domain contract.
The contract defines one company-scoped `DeliveryReadinessResult` internal read model with bounded delivery-readiness targets.
Targets are derived from F6J operator-readiness and F6K acknowledgement-readiness posture only, with monitor/source/checklist context carried through those existing read models.

Second, the control-plane implementation added one read-only bounded context under `apps/control-plane/src/modules/delivery-readiness/**`.
The route is thin and read-only.
It parses `companyKey`, calls the delivery-readiness service, and serializes the result.
It contains no SQL, prompt assembly, source ingest logic, finance math, report conversion, approval behavior, notification-provider logic, outbox send logic, delivery scheduling, monitor rerun logic, or external action execution.

Third, the service depends only on existing read services.
It calls the shipped operator-readiness service and close/control acknowledgement-readiness service.
It does not rerun monitors, create monitor results, create/open missions, read report artifacts as primary input, read generic chat, invoke runtime-Codex, draft prose, create approvals, create reports, create outbox rows, mutate sources, or call external providers.

Fourth, persistence remains absent.
No database schema, migration, delivery record, approval record, report artifact, outbox event, source mutation record, replay event, or runtime-Codex artifact was added.

Fifth, the operator-visible output shows absence boundaries as first-class facts.
Every result states that no email, Slack, SMS, webhook, notification provider call, outbox send, scheduled notification, auto-send, report delivery, external publish behavior, approval, report, mission, monitor rerun, runtime-Codex work, generated notification prose, source mutation, finance write, legal/policy/payment/collection/customer-contact instruction, or autonomous action occurred.

## Concrete Steps

1. Added a pure domain contract.
   Files:
   - `packages/domain/src/delivery-readiness.ts`
   - `packages/domain/src/delivery-readiness.spec.ts`
   - `packages/domain/src/index.ts`

   Shipped behavior:
   - one deterministic internal delivery-readiness result
   - bounded target kinds that map to shipped readiness/acknowledgement/checklist/monitor posture
   - target statuses `ready_for_delivery_review`, `needs_review_before_delivery`, and `blocked_by_evidence`
   - evidence basis and source lineage or proof references on every target
   - freshness or missing-source posture on every target
   - limitations on every target
   - proof posture on every target
   - human-review next step on every target
   - absence boundary fields proving no send, provider call, outbox send, approval, report, mission, monitor rerun, runtime-Codex, generated notification prose, source mutation, finance write, legal/policy/payment/collection/customer-contact instruction, or autonomous action

2. Added a read-only control-plane bounded context.
   Files:
   - `apps/control-plane/src/modules/delivery-readiness/schema.ts`
   - `apps/control-plane/src/modules/delivery-readiness/service.ts`
   - `apps/control-plane/src/modules/delivery-readiness/formatter.ts`
   - `apps/control-plane/src/modules/delivery-readiness/routes.ts`
   - `apps/control-plane/src/modules/delivery-readiness/service.spec.ts`
   - `apps/control-plane/src/modules/delivery-readiness/routes.spec.ts`

   Route:
   - `GET /delivery-readiness/companies/:companyKey`

   The implementation remains transport-thin and service-owned.

3. Added the smallest internal operator read surface for human acceptance.
   Files:
   - `apps/web/lib/api.ts`
   - `apps/web/app/delivery-readiness/page.tsx`
   - `apps/web/components/delivery-readiness-card.tsx`
   - `apps/web/app/delivery-readiness/page.spec.tsx`
   - `apps/web/components/delivery-readiness-card.spec.tsx`
   - `apps/web/lib/api.spec.ts`

   The UI must show no send, schedule, publish, approve, release, report, mission, monitor-run, runtime-Codex, payment, legal, policy-advice, collection-action, customer-contact, or remediation controls.

4. Added one packaged F6M proof.
   Proof:
   - `tools/delivery-readiness-smoke.mjs`
   - `pnpm smoke:delivery-readiness:local`

   Proof coverage:
   - F6J operator-readiness and F6K acknowledgement-readiness can produce bounded delivery-readiness targets
   - every target exposes evidence basis, source lineage or proof reference, freshness posture, limitations, proof posture, status, and human-review next step
   - absence boundaries prove no provider call, email, Slack, SMS, webhook, outbox send, scheduled notification, auto-send, report, approval, mission, monitor rerun, runtime-Codex, generated notification prose, source mutation, finance write, legal/policy/payment/collection/customer-contact instruction, or autonomous action
   - monitor families and discovery families remain unchanged
   - shipped F5 and F6 smokes remain green

5. Refreshed docs after implementation landed.
   Docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - `docs/ops/local-dev.md`
   - this FP-0062 record

## Validation and Acceptance

This implementation thread must run the requested validation ladder after edits:

- `pnpm --filter @pocket-cto/domain exec vitest run src/delivery-readiness.spec.ts src/operator-readiness.spec.ts src/close-control-acknowledgement.spec.ts src/close-control.spec.ts src/monitoring.spec.ts src/finance-twin.spec.ts src/proof-bundle.spec.ts`
- `cd apps/control-plane && pnpm exec vitest run src/modules/delivery-readiness/**/*.spec.ts src/modules/operator-readiness/**/*.spec.ts src/modules/close-control-acknowledgement/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/finance-twin/**/*.spec.ts src/modules/wiki/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/app.spec.ts`
- `cd apps/web && pnpm exec vitest run app/delivery-readiness/**/*.spec.ts* components/delivery-readiness-card.spec.tsx lib/api.spec.ts`
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
- `pnpm smoke:delivery-readiness:local`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Implementation acceptance requires all of the following:

- one deterministic internal delivery-readiness result or read model exists
- the result is derived only from shipped stored/read state
- targets are bounded and carry evidence basis, freshness/limitations, proof posture, status, and human-review next step
- every result exposes explicit absence boundaries showing no external delivery or send occurred
- no external provider integration is added
- no email, Slack, SMS, webhook, notification provider call, outbox send, scheduled notification, auto-send, report delivery, external publish behavior, approval, report, mission creation, monitor rerun, runtime-Codex drafting, generated notification prose, source mutation, payment behavior, accounting write, bank write, tax filing, legal advice, policy advice, collection instruction, customer-contact instruction, or autonomous action is added
- no report conversion or F5 release/circulation semantics are reused as F6M approval semantics
- no new monitor family or discovery family is added
- shipped F5 and F6 behavior remains unchanged

## Idempotence and Recovery

The preferred F6M implementation is retry-safe because it is read-only.
Repeated reads over the same stored/read posture should produce the same delivery-readiness status except for explicitly labeled read timestamps.

Raw sources, source snapshots, source files, deterministic extracts, CFO Wiki pages, Finance Twin facts, monitor results, close/control checklist posture, operator-readiness posture, acknowledgement-readiness posture, missions, reports, approvals, release/circulation records, source-pack fixtures, and demo fixtures must not be mutated to make delivery readiness pass.

If source state is missing, stale, failed, unsupported, partial, conflicting, or insufficient, F6M should report that posture instead of inventing delivery readiness, approval, release, certification, legal attestation, close completion, or external delivery permission.

Rollback for this implementation should remove only additive F6M delivery-readiness domain/read-model/UI/proof/doc changes.
Rollback must leave FP-0050 through FP-0061, shipped monitor behavior, shipped alert handoff behavior, shipped checklist behavior, shipped demo replay behavior, shipped operator-readiness behavior, shipped acknowledgement-readiness behavior, shipped source-pack proof, F5 reporting/approval/release/circulation behavior, raw sources, CFO Wiki state, Finance Twin state, and GitHub/engineering-twin modules intact.
No destructive database migration belongs in F6M.

## Artifacts and Notes

This F6M implementation slice produces:

- `plans/FP-0062-external-notification-delivery-planning-foundation.md`
- active-doc updates that identify FP-0062 as the shipped F6M implementation record
- `packages/domain/src/delivery-readiness.ts`
- `packages/domain/src/delivery-readiness.spec.ts`
- `apps/control-plane/src/modules/delivery-readiness/**`
- `apps/web/app/delivery-readiness/**`
- `apps/web/components/delivery-readiness-card.tsx`
- `apps/web/components/delivery-readiness-card.spec.tsx`
- `tools/delivery-readiness-smoke.mjs`
- `pnpm smoke:delivery-readiness:local`
- no schema or migrations
- no eval datasets
- no monitor-family or discovery-family expansion
- no runtime-Codex
- no external provider integration
- no delivery, notification provider, outbox send, email, Slack, SMS, webhook, report, approval, mission creation, monitor rerun, source mutation, payment behavior, accounting write, bank write, tax filing, legal/policy advice, collection/customer-contact instruction, generated notification prose, or autonomous action behavior

Do not create FP-0063 in this slice.
Do not start F6N, F6O, F6P, or later work here.

## Interfaces and Dependencies

Package boundaries must remain unchanged:

- `packages/domain` owns pure contracts for monitors, close/control, readiness, acknowledgement, proof, mission, reporting, and delivery-readiness vocabulary
- `packages/db` remains untouched unless a later plan explicitly justifies additive persistence, which first F6M should not need
- `apps/control-plane/src/modules/operator-readiness` owns shipped F6J readiness and must not be changed unless implementation discovers a direct truthfulness bug
- `apps/control-plane/src/modules/close-control-acknowledgement` owns shipped F6K acknowledgement-readiness and must not be changed unless implementation discovers a direct truthfulness bug
- `apps/control-plane/src/modules/close-control` owns shipped F6H checklist posture and must not be changed for delivery readiness
- `apps/control-plane/src/modules/monitoring` owns shipped monitor behavior and must not be changed for delivery readiness
- `apps/control-plane/src/modules/outbox` remains a placeholder and must not become a send path in first F6M
- `apps/control-plane/src/modules/missions`, `apps/control-plane/src/modules/reporting`, and `apps/control-plane/src/modules/approvals` must not be widened by F6M
- `apps/web` exposes a read-only operator delivery-readiness surface only after the domain/control-plane contract is implemented

Runtime-Codex stays out of scope:

- no runtime-Codex drafting
- no runtime-Codex notification prose
- no runtime-Codex delivery text
- no runtime-Codex monitoring findings
- no runtime-Codex investigation writeups
- no runtime-Codex checklist, readiness, acknowledgement, or certification prose
- no runtime-owned finance facts

Delivery and autonomous action stay out of scope:

- no email
- no Slack
- no SMS
- no webhooks
- no notification providers
- no outbox sends
- no scheduled notifications
- no auto-send
- no send, distribute, publish, release, report delivery, pay, book, file, tax filing, legal advice, policy advice, payment instruction, vendor-payment recommendation, collection instruction, customer-contact instruction, generated notification prose, or external action

Later slices are named but not created here:

- `F6N-close-control-reporting-or-certification-planning`, only if operator need and evidence boundaries are proven
- `F6O-additional-source-pack-expansion`, only after the bank/card source pack remains green and source-backed and a new Finance Plan proves the next narrow source-pack need
- `F6P-external-provider-integration`, only if a future plan proves human-review gates, provider boundaries, compliance posture, observability, retry behavior, failure handling, and no autonomous send

Current module vocabulary stays stable.
Do not rename `modules/twin/**`, `modules/reporting/**`, or `@pocket-cto/*`.
Do not delete GitHub or engineering-twin modules as part of F6M.

## Outcomes & Retrospective

The docs-and-plan validation ladder passed on 2026-04-28T23:15:09Z before implementation.
The implementation validation ladder passed on 2026-04-29T00:10:50Z, including the new F6M smoke, shipped F6 smokes/proofs, twin guardrails, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
This implementation thread added the first real F6M slice after confirming that shipped F6J and F6K review posture supports a safe F6M implementation only when narrowed to internal delivery-readiness.
No F6N, F6O, F6P, FP-0063, or later plan was created.

What remains:

- keep FP-0062 as the shipped F6M record
- keep actual provider integration, external sends, approvals, report release/circulation reuse, runtime-Codex drafting, close/control reporting/certification, and additional source-pack expansion out of scope until later named Finance Plans prove safety
