# Define F6J operator notification readiness foundation

## Purpose / Big Picture

This file is the active Finance Plan for the Pocket CFO F6J implementation contract.
The target phase is `F6`, and the next implementation slice is exactly `F6J-operator-notification-readiness-foundation`.

The user-visible goal is deliberately narrow: after shipped F6A through F6I, Pocket CFO should be able to show an internal operator what source-backed monitor, handoff, close/control, and demo-proof posture needs attention, without sending anything outside the product.
The first F6J slice is therefore an operator attention/readiness foundation, not external delivery.

Repo truth supports F6J only in this bounded shape.
The shipped monitor results already persist source freshness or missing-source posture, lineage, limitations, proof posture, deterministic severity rationale, alert status, and human-review next steps for exactly four monitor families.
The shipped alert handoff path already proves cash and collections alert review can remain taskless, manual, source-backed, and delivery-free.
The shipped close/control checklist already provides one read-only checklist result from stored Finance Twin source posture, stored CFO Wiki policy/source posture, and latest persisted monitor results as context only.
The shipped demo replay already proves those surfaces together without adding delivery, reports, approvals, runtime-Codex, or new families.

F6J must use that existing proof spine to plan one deterministic internal readiness read model only.
It must not add email, Slack, SMS, webhooks, notification provider calls, outbox send behavior, report delivery, external publish behavior, approval workflow, report conversion, runtime-Codex drafting, mission generation, payment behavior, legal or policy advice, collection instructions, customer-contact instructions, or autonomous actions.
GitHub connector work is explicitly out of scope.

## Progress

- [x] 2026-04-28T15:02:43Z Invoke the requested Pocket CFO operator plugin guards, run preflight, confirm the branch, GitHub access, Docker services, clean worktree, and fetched `origin/main`.
- [x] 2026-04-28T15:02:43Z Read active docs, shipped FP-0050 through FP-0058 records, package scripts, domain monitoring/close-control/proof contracts, control-plane monitoring/mission/close-control/evidence/outbox seams, and shipped F6 smoke proof posture.
- [x] 2026-04-28T15:02:43Z Decide that F6J is safe only as an internal operator notification/readiness planning contract because it can remain delivery-free by default and grounded in shipped stored state.
- [x] 2026-04-28T15:02:43Z Create FP-0059 as the single active implementation-ready F6J contract while preserving FP-0050 through FP-0058 as shipped F6A through F6I records.
- [x] 2026-04-28T15:02:43Z Refresh the active-doc spine so the next thread starts from this F6J contract and does not reopen shipped monitor, investigation, report, approval, runtime, delivery, or checklist behavior.
- [x] 2026-04-28T15:11:54Z Run the requested docs-and-plan validation ladder through `pnpm ci:repro:current`; all required smokes, targeted twin specs, lint, typecheck, tests, and repro validation passed.

## Surprises & Discoveries

Repo truth supports a safe F6J planning contract without first switching to F6K close/control acknowledgement.
The reason is not that Pocket CFO is ready to deliver notifications; it is that the existing monitor/checklist/demo proof surfaces already expose enough internal, source-backed review posture to derive operator attention readiness without delivery.

The outbox bounded context exists only as a placeholder README.
There is no current notification provider, email, Slack, SMS, webhook, or send pipeline that F6J must reuse or invoke.
That absence is a safety feature for this slice.

The strongest existing F6J inputs are persisted monitor results and the read-only close/control checklist route.
Monitor results are stored durable records; the checklist is deterministic but read-only and explicitly records that no checklist table or mission replay event is appended.
The first implementation must decide whether the readiness read model is also read-only or whether a derived result should be persisted additively; either choice must keep replay implications explicit.

The word "notification" is delivery-adjacent.
F6J should use operator-facing wording such as "operator attention readiness" or "notification readiness posture" and state in every output that it is not a send, not an approval, not a report, and not an external communication.

## Decision Log

Decision: proceed with F6J rather than switching to F6K close/control acknowledgement.
Rationale: repo truth supports one internal readiness/read-model slice now. It can be grounded in latest persisted monitor results, close/control checklist posture, demo replay proof posture, source freshness posture, and CFO Wiki freshness posture without requiring acknowledgement, approval, delivery, or external action behavior.

Decision: the first F6J scope is `F6J-operator-notification-readiness-foundation`.
Rationale: the safest first notification-adjacent work is to show why an operator should review something, not to send a message.

Decision: F6J is not a monitor family.
Rationale: shipped monitor families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`.
F6J must not add `spend_posture`, `obligation_calendar_review`, `covenant_risk`, or any new monitor family.

Decision: F6J is not a discovery-family expansion.
Rationale: shipped discovery families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, `spend_posture`, `obligation_calendar_review`, and `policy_lookup`.
F6J must not add discovery families.

Decision: F6J is not external delivery.
Rationale: no email, Slack, SMS, webhook, notification provider integration, outbox send behavior, report delivery, external publish behavior, or operator delivery workflow belongs in the first slice.

Decision: F6J should be internal and operator-visible only.
Rationale: the first useful output is one deterministic operator attention/readiness result or read model that shows which existing source-backed posture needs human review, with evidence basis, freshness, limitations, proof posture, status, and a human-review next step.

Decision: F6J starts from shipped stored state only.
Rationale: allowed inputs are latest persisted monitor results, close/control checklist result or checklist read posture, monitor demo replay proof posture only as stored/expected proof context, and source/CFO Wiki freshness posture.
F6J must not use generic chat, report artifacts as primary inputs, runtime-Codex, mission-generated prose, or monitor reruns.

Decision: F6J preserves shipped F5 and F6 behavior.
Rationale: no F5 report/release/circulation/correction changes, no monitor evaluator changes, no F6B/F6G mission changes, no F6H checklist behavior changes, no F6I replay proof changes, no new approval kind, and no report conversion belong in F6J unless a future implementation thread proves a direct truthfulness gap and updates this plan first.

Decision: later slices are named but not created here.
Rationale: likely later slices are `F6K-close-control-acknowledgement` only if operator need is proven, `F6L-source-pack-expansion` only if one demo pack remains green and source-backed, and `F6M-external-notification-delivery-planning` only if a future plan proves safety and review gates.
Do not create FP-0060 in this slice.

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

The relevant existing implementation seams for F6J planning are:

- `packages/domain/src/monitoring.ts` for shipped monitor kinds, monitor results, alert cards, source freshness, lineage, proof posture, runtime boundaries, and monitor-investigation seed posture
- `packages/domain/src/close-control.ts` for the read-only close/control checklist result, item statuses, evidence refs, proof posture, and runtime/action absence boundary
- `packages/domain/src/proof-bundle.ts` and `packages/domain/src/mission-detail.ts` for existing proof and mission read-model posture, not for new report or approval work
- `apps/control-plane/src/modules/monitoring/**` for latest persisted monitor result reads
- `apps/control-plane/src/modules/close-control/**` for the deterministic checklist read
- `apps/control-plane/src/modules/missions/**` for the shipped cash plus collections manual alert handoff boundary that F6J must not widen
- `apps/control-plane/src/modules/evidence/**` for proof-summary conventions only, not report conversion
- `apps/control-plane/src/modules/outbox/README.md`, which is only a reserved placeholder and must not become a send/delivery path in F6J
- `tools/monitor-demo-replay-smoke.mjs` and `tools/close-control-checklist-smoke.mjs` for existing proof and absence-boundary patterns

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No package script, smoke alias, fixture, route, schema, migration, or eval dataset is created by this docs-and-plan slice.

## Plan of Work

First, keep the F6J product contract delivery-free.
The implementation thread should introduce at most one deterministic internal operator attention/readiness result or read model.
The result should answer a narrow question: which stored source-backed posture should a finance operator review now, and why?

Second, decide the implementation boundary before coding.
The preferred bounded context is a small `operator-readiness` or `operator-attention` module under the control plane, paired with a pure domain contract only if a reusable schema is needed.
If implementation can safely live inside an existing read-model bounded context without creating a second alert system, record that decision first.
Do not put SQL, prompt assembly, delivery logic, notification provider code, or finance math inside routes.

Third, use only shipped stored/read posture as inputs.
The service may read:

- latest persisted monitor results for `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`
- the close/control checklist result/read posture from the shipped checklist service
- source and CFO Wiki freshness posture needed to explain limitations
- monitor demo replay proof posture only as checked-in/stored expected proof context, not as a runtime requirement

The service must not read generic chat, report artifacts as primary input, mission-generated prose, runtime-Codex output, or rerun monitors.

Fourth, define one output contract.
The result should include one bounded list of operator attention items.
Each item should include:

- stable item id or key
- source family or posture family
- status such as `ready_for_review`, `needs_review`, or `blocked_by_evidence`
- evidence basis and source lineage/proof reference
- freshness or missing-source posture
- limitations
- proof posture
- human-review next step
- explicit absence boundary showing no send, no delivery, no report, no approval, no mission creation, no runtime-Codex, and no autonomous action

Fifth, add implementation proof only in the implementation thread.
The proof should reuse the shipped monitor, handoff, checklist, demo replay, and discovery-family smokes and add one narrow F6J proof only after code exists.
This docs-and-plan slice must not add that proof command.

## Concrete Steps

1. In the future implementation thread, add a pure contract only if needed.
   Expected future files if a domain contract is needed:
   - `packages/domain/src/operator-readiness.ts` or an equivalently named narrow domain file
   - `packages/domain/src/operator-readiness.spec.ts`
   - `packages/domain/src/index.ts`

   Required behavior:
   - no new monitor family
   - no new discovery family
   - one internal readiness result or read model
   - bounded operator attention items
   - source lineage, freshness, limitations, proof posture, status, and human-review next step on every item
   - runtime/action boundary fields proving no runtime-Codex, delivery, report, approval, mission creation, payment, legal/policy advice, collection/customer-contact instruction, or autonomous action

2. In the future implementation thread, add a control-plane bounded context only after the contract is clear.
   Expected future files if a new module is needed:
   - `apps/control-plane/src/modules/operator-readiness/schema.ts`
   - `apps/control-plane/src/modules/operator-readiness/service.ts`
   - `apps/control-plane/src/modules/operator-readiness/formatter.ts`
   - `apps/control-plane/src/modules/operator-readiness/routes.ts` only if an HTTP read surface is required
   - adjacent specs

   The route, if added later, must be read-only and thin.
   It must not contain SQL, prompt assembly, monitor math, source ingest logic, report conversion, approval behavior, delivery logic, notification provider logic, or external actions.

3. In the future implementation thread, decide persistence explicitly.
   A read-only generated readiness result may be enough for F6J if it is deterministic and observable.
   If persistence is needed, it must be additive and scoped to derived readiness results only.
   Raw sources, monitor results, missions, reports, approvals, release/circulation records, and close/control checklist posture must not be rewritten to make readiness pass.
   Replay implications must be either represented in persisted derived state or explicitly recorded as read-only posture.

4. In the future implementation thread, wire only internal operator UI/read-model posture if needed.
   Expected future files if UI is needed:
   - `apps/web/lib/api.ts`
   - a narrow internal operator readiness component or page
   - adjacent specs

   The UI must not show email, Slack, SMS, webhook, send, publish, delivery, report release, approval, payment, legal, policy-advice, collection-action, customer-contact, or remediation controls.

5. In the future implementation thread, add one narrow F6J proof only after implementation exists.
   Expected future proof:
   - a new local smoke only if the implementation adds behavior that needs a packaged proof

   Required proof:
   - latest persisted monitor results can produce bounded internal attention items
   - close/control checklist posture can contribute review/blocking posture without rerunning monitors
   - every attention item exposes evidence basis, freshness or missing-source posture, limitations, proof posture, status, and human-review next step
   - no report artifacts, approvals, outbox events, notification provider calls, runtime-Codex threads, missions, payment instructions, accounting writes, bank writes, tax filings, legal/policy advice, collection instructions, customer-contact instructions, or autonomous actions are created
   - existing monitor and discovery family lists stay unchanged

6. Refresh docs after implementation only where behavior actually changes.
   Expected docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - `docs/ops/local-dev.md`
   - `docs/ops/source-ingest-and-cfo-wiki.md` only if source/freshness wording becomes stale
   - `docs/ops/codex-app-server.md` only if runtime or delivery boundary wording becomes stale
   - `evals/README.md` and `docs/benchmarks/seeded-missions.md` only if a proof/eval statement changes

## Validation and Acceptance

This docs-and-plan thread must run the requested validation ladder, with DB-backed smokes serially:

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

F6J implementation acceptance will be observable only if all of the following are true:

- one deterministic internal operator notification/readiness result or read model exists
- the result is derived only from shipped stored state or shipped deterministic read posture
- each attention item includes evidence basis, source lineage or proof reference, freshness or missing-source posture, limitations, proof posture, status, and a human-review next step
- no external delivery path exists
- no email, Slack, SMS, webhook, notification provider call, outbox send behavior, report delivery, external publish behavior, or operator delivery workflow is added
- no approval, report conversion, mission creation, runtime-Codex drafting, payment behavior, accounting write, bank write, tax filing, legal advice, policy advice, collection instruction, customer-contact instruction, or autonomous action is added
- no new monitor family or discovery family is added
- shipped F5 and F6 behavior remains unchanged
- shipped monitor, handoff, close/control checklist, demo replay, and discovery-family smokes remain green

## Idempotence and Recovery

The F6J implementation must be retry-safe.
If the first readiness result is read-only, repeated reads over the same stored posture should produce the same item statuses except for explicit read timestamps.
If the first readiness result is persisted, repeated runs with the same input posture and idempotency key should avoid duplicate operator attention items.

Raw sources, source snapshots, source files, Finance Twin facts, CFO Wiki pages, monitor results, monitor investigation missions, close/control checklist behavior, report artifacts, approvals, release/circulation records, and demo fixtures must not be mutated to make F6J pass.

Rollback for implementation should remove only the additive F6J readiness contract, read-model service, optional UI, optional persistence, optional route, and optional proof files.
Rollback must leave FP-0050 through FP-0058, shipped monitor behavior, shipped alert handoff behavior, shipped checklist behavior, shipped replay proof, raw sources, CFO Wiki state, Finance Twin state, F5 reporting/approval behavior, and GitHub/engineering-twin modules intact.

## Artifacts and Notes

This docs-and-plan slice produces:

- `plans/FP-0059-operator-notification-readiness-foundation.md`
- active-doc updates that identify FP-0059 as the active F6J implementation-ready contract
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
- no delivery, notification provider, outbox send, email, Slack, SMS, webhook, report, approval, payment, legal/policy advice, collection/customer-contact instruction, or autonomous action behavior

Do not create FP-0060 in this slice.
Do not start F6J implementation in this docs-and-plan thread.
Do not start F6K, F6L, F6M, or later.

## Interfaces and Dependencies

Package boundaries must remain unchanged:

- `packages/domain` owns pure contracts only if the future implementation needs a shared readiness schema
- `packages/db` may be touched only in a future implementation plan if derived readiness persistence is explicitly chosen; no destructive schema change is allowed
- `apps/control-plane/src/modules/monitoring` owns monitor run/latest behavior and must not be changed by F6J unless a direct truthfulness gap is proven first
- `apps/control-plane/src/modules/missions` owns the shipped cash plus collections alert investigation handoff boundary and must not be widened by F6J
- `apps/control-plane/src/modules/close-control` owns the shipped read-only checklist route and must not gain acknowledgements, approvals, or monitor reruns in F6J
- `apps/control-plane/src/modules/outbox` remains a reserved placeholder and must not gain send/delivery behavior in F6J
- `apps/web` may show internal read posture only if the future implementation needs an operator surface

Runtime-Codex stays out of scope:

- no runtime-Codex drafting
- no runtime-Codex monitoring findings
- no runtime-Codex investigation writeups
- no runtime-Codex notification drafts
- no runtime-Codex close/control prose
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

- `F6K-close-control-acknowledgement`, only if operator need is proven
- `F6L-source-pack-expansion`, only if one demo pack remains green and source-backed
- `F6M-external-notification-delivery-planning`, only if a future plan proves safety, review gates, and delivery controls

Current module vocabulary stays stable.
Do not rename `modules/twin/**`, `modules/reporting/**`, or `@pocket-cto/*`.
Do not delete GitHub or engineering-twin modules as part of F6J.

## Outcomes & Retrospective

This docs-and-plan thread created the FP-0059 F6J contract after confirming that the shipped F6A through F6I baseline supports only an internal operator attention/readiness foundation, not delivery.
No F6J implementation started.
No F6K, F6L, F6M, or later plan was created.

What remains:

- start F6J implementation next only from this plan, and only as a deterministic internal readiness/read-model slice
- keep F6K acknowledgement, F6L source-pack expansion, and F6M external notification/delivery planning uncreated until a later named plan proves the need
