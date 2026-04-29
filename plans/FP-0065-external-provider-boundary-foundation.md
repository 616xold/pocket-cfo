# Plan F6P external provider boundary foundation

## Purpose / Big Picture

This is the active Finance Plan for the Pocket CFO F6P planning and implementation contract.
The target phase is `F6`, and the first implementation slice is exactly `F6P-external-provider-boundary-foundation`.

The user-visible goal is deliberately narrow: after shipped F6A through F6O, Pocket CFO should be able to show one deterministic internal provider-boundary/readiness posture that a human operator can review before any future plan considers external provider integration.
This is not external delivery.
It is not notification delivery.
It is not a send workflow.
It is not provider integration.
It is not provider credential storage.
It is not report release, approval, certification, close completion, legal attestation, policy advice, payment behavior, customer contact, or autonomous action.

Repo truth supports F6P only in this reduced shape.
F6M already ships one deterministic internal delivery-readiness read model over shipped F6J operator-readiness and F6K acknowledgement-readiness posture, with explicit absence boundaries for no provider calls, no outbox sends, no email, no Slack, no SMS, no webhooks, no scheduled delivery, no auto-send, no generated notification prose, no reports, no approvals, no mission creation, no monitor reruns, no source mutation, no runtime-Codex, no finance writes, no advice, no customer-contact instruction, and no autonomous action.
F6N already ships one deterministic internal close/control review-summary read model over shipped F6H/F6J/F6K/F6M posture, with explicit no-certification, no-close-complete, no-sign-off, no-attestation, no-approval, no-report-release, no-report-circulation, no-provider-call, no-outbox-send, and no-external-delivery posture.
F6O already ships one receivables/payables source-pack proof and leaves F6P unstarted.
The outbox bounded context remains only a placeholder README, which is a safety boundary for F6P rather than an implementation surface to fill.

This plan therefore narrows F6P to an internal external-provider-boundary/readiness contract.
The first implementation may define one read-only result or read model with bounded provider-boundary targets.
Those targets are internal gates for future provider review, not channel targets, not recipient targets, not provider jobs, and not send records.
Each target must include evidence basis, freshness or missing-source posture, limitations, proof posture, status, and a human-review next step.
Each result must explicitly state that no provider call, external delivery, outbox send, approval, report, mission, monitor rerun, runtime-Codex drafting, generated prose, source mutation, finance write, advice/instruction, customer contact, or autonomous action occurred.

GitHub connector work is explicitly out of scope.
Do not invoke GitHub Connector Guard for F6P.

## Progress

- [x] 2026-04-29T17:37:23Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-04-29T17:37:23Z Ran preflight against fetched `origin/main`, confirmed the branch is `codex/f6p-master-plan-and-doc-refresh-local-v1`, confirmed the worktree was clean, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-04-29T17:37:23Z Read the requested active docs, shipped FP-0062 through FP-0064 records, package scripts, F6M delivery-readiness contract and service, F6N close/control review-summary contract and service, outbox placeholder, shipped F6 proof tools, and F6O source-pack proof posture.
- [x] 2026-04-29T17:37:23Z Decided repo truth supports F6P only as `F6P-external-provider-boundary-foundation`, not actual external provider integration, not actual delivery, not F6Q certification planning, and not F6R source-pack expansion.
- [x] 2026-04-29T17:37:23Z Created this FP-0065 implementation-ready planning contract and refreshed active docs without adding code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, implementation scaffolding, runtime behavior, provider calls, delivery, reports, approvals, or finance actions.
- [x] 2026-04-29T17:43:55Z Ran the requested docs-and-plan validation ladder through `pnpm ci:repro:current`; all commands passed before commit.

## Surprises & Discoveries

F6P is safer now than it was during F6O planning, but only because F6P can be narrowed to a provider-boundary/readiness result.
The shipped F6M delivery-readiness service already derives from F6J/F6K and encodes no-provider/no-send/no-outbox absence fields.
The shipped F6N review summary can carry that boundary into close/control posture without certification or release language.
Those facts justify a planning contract for an internal boundary, not a provider integration.

The existing outbox module is intentionally not a delivery implementation.
It is only `apps/control-plane/src/modules/outbox/README.md`.
F6P must keep that absence visible instead of filling the outbox seam or treating the placeholder as permission to send.

F5 release, circulation, correction, and approval records exist, but they are unsafe primary inputs for F6P.
They carry report-specific semantics and must not be reused as a generic external provider release gate, delivery authority, or approval workflow.

F6O source-pack proof strengthens source posture, but it does not create a need for another source-pack slice before F6P.
F6R can wait if the receivables/payables proof remains green and F6P stays read-only and delivery-free.

## Decision Log

Decision: proceed with `F6P-external-provider-boundary-foundation` rather than switch to F6Q close/control certification planning or F6R additional source-pack expansion.
Rationale: shipped F6M and F6N provide enough internal no-send posture to plan one deterministic provider-boundary/readiness result now. Certification remains riskier because it could imply sign-off, legal attestation, audit opinion, or close completion. Another source-pack expansion is useful later, but less urgent than locking the external-provider boundary before any provider-adjacent implementation.

Decision: F6P is not actual delivery and not provider integration.
Rationale: F6P must not add email sends, Slack sends, SMS sends, webhook calls, notification provider calls, provider credential flows, outbox send behavior, report delivery, external publish behavior, scheduled delivery, auto-send, retry delivery, or provider job state.

Decision: F6P is not an approval workflow.
Rationale: no new approval kind belongs in F6P. Do not reuse F5 `report_release` or `report_circulation` approval semantics without a later named plan proving it safe. F6P must not imply sign-off, certification, close complete, external release, board circulation, lender release, diligence release, legal attestation, provider authorization, or send permission.

Decision: the first F6P output should be internal and operator-visible.
Rationale: the useful first surface is one deterministic provider-boundary/readiness result or read model that explains why a future provider boundary might be reviewed, what shipped evidence supports or blocks that review, what is stale or limited, and what human review step remains. It is not a send workflow and should not expose send controls.

Decision: first F6P target kinds are internal boundary gates, not provider/channel/recipient targets.
Rationale: target names should avoid implying provider availability or a valid recipient path. A safe implementation can use bounded internal target kinds such as `delivery_readiness_boundary`, `review_summary_boundary`, `source_freshness_boundary`, `proof_and_limitation_boundary`, `human_review_gate_boundary`, and `outbox_absence_boundary`.

Decision: first F6P statuses must remain review-oriented.
Rationale: acceptable status vocabulary is internal, such as `ready_for_provider_boundary_review`, `needs_human_review_before_provider_boundary`, and `blocked_by_evidence`. Do not add `provider_ready`, `send_ready`, `approved`, `release_ready`, `delivered`, `certified`, `close_complete`, or similar external-action statuses.

Decision: F6P starts only from shipped stored/read state.
Rationale: primary inputs are F6M delivery-readiness posture and F6N close/control review-summary posture. F6J/F6K/F6H posture, latest persisted monitor results, and source/CFO Wiki freshness posture may be used only through existing read services if needed for context. F6P must not use generic chat, report artifacts as primary input, runtime-Codex output, mission-generated prose, monitor reruns, demo replay runtime execution, provider state, provider credentials, generated notification prose, or any external communication state.

Decision: the first output contract is one deterministic internal provider-boundary/readiness result or read model.
Rationale: each provider-boundary target must include evidence basis, freshness or missing-source posture, limitations, proof posture, status, and a human-review next step. The result must also expose explicit absence boundaries showing no provider call, external delivery, send action, outbox send, approval, report, mission creation, monitor rerun, runtime-Codex work, generated prose, source mutation, finance write, advice/instruction, customer-contact instruction, or autonomous action occurred.

Decision: first F6P should be read-only and no-schema.
Rationale: F6M/F6N already expose enough stored/read posture for a derived provider-boundary result. If persistence is needed later, a future plan must justify why and keep it additive, idempotent, company-scoped, evidence-linked, actor-attributed where needed, and explicitly not a send record, not a provider job, not an outbox send, not a delivery log, not an approval, not a report release, not a certification, and not close complete.

Decision: F6P must preserve shipped F5 and F6 behavior.
Rationale: no F5 report/release/circulation/correction changes, no monitor evaluator changes, no F6B/F6G mission changes, no F6H checklist behavior changes, no F6J readiness behavior changes, no F6K acknowledgement behavior changes, no F6L bank/card source-pack behavior changes, no F6M delivery-readiness behavior changes, no F6N review-summary behavior changes, no F6O receivables/payables source-pack behavior changes, no new approval kind, no report conversion, and no monitor-family or discovery-family expansion belongs in F6P.

Decision: likely later slices are named but not created here.
Rationale: `F6Q-close/control-certification` should happen only if operator need, evidence boundaries, legal boundaries, and review gates are proven. `F6R-additional-source-pack-expansion` should happen only after the receivables/payables source pack remains green. `F6S-actual-external-delivery` should happen only if a future plan proves provider security, compliance posture, explicit human confirmation, observability, retry behavior, safe failure modes, and no autonomous send. Do not create FP-0066, F6Q, F6R, F6S, or later plans in this slice.

## Context and Orientation

Pocket CFO has shipped F6A through F6O:

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

The relevant implementation seams for F6P are:

- `packages/domain/src/delivery-readiness.ts` for F6M internal review-before-delivery posture and explicit no-provider/no-send/no-outbox absence boundaries
- `packages/domain/src/close-control-review-summary.ts` for F6N internal review-summary posture and explicit no-certification/no-release/no-provider/no-outbox boundaries
- `packages/domain/src/operator-readiness.ts` for F6J source/freshness/proof posture when carried through existing reads
- `packages/domain/src/close-control-acknowledgement.ts` for F6K acknowledgement-readiness posture when carried through existing reads
- `packages/domain/src/close-control.ts` for F6H checklist posture when carried through existing reads
- `packages/domain/src/monitoring.ts` for the fixed shipped monitor-family vocabulary and latest persisted monitor-result posture
- `packages/domain/src/discovery-mission.ts` for the fixed shipped finance-discovery vocabulary
- `packages/domain/src/proof-bundle.ts` for proof vocabulary and F5 release/circulation facts that F6P must not use as primary inputs
- `apps/control-plane/src/modules/delivery-readiness/**` for the shipped F6M read-only service and route
- `apps/control-plane/src/modules/close-control-review-summary/**` for the shipped F6N read-only service and route
- `apps/control-plane/src/modules/outbox/README.md` as an explicit placeholder boundary proving no send pipeline exists in the first F6P slice
- `tools/delivery-readiness-smoke.mjs`, `tools/bank-card-source-pack-proof.mjs`, and `tools/receivables-payables-source-pack-proof.mjs` for shipped proof and absence-boundary patterns

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No source mutation is expected.
No database schema migration, eval dataset, fixture family, package script, smoke alias, monitor family, discovery family, report, approval, delivery behavior, provider integration, provider credential storage, outbox send, payment behavior, finance write, legal/policy advice, collection/customer-contact instruction, certification, close-complete status, sign-off, attestation, or autonomous action belongs in F6P.

## Plan of Work

First, the future implementation should add one pure domain contract for provider-boundary/readiness posture.
The likely contract name is `ExternalProviderBoundaryResult` with bounded `ExternalProviderBoundaryTarget` entries.
The contract should include company scope, generated time, aggregate internal boundary-review status, target list, evidence summary, limitations, and runtime/action absence boundary.
The contract must avoid provider-ready, send-ready, approved, release-ready, certified, close-complete, delivered, or scheduled statuses.

Second, the future implementation should add one read-only control-plane bounded context only if implementation begins.
The likely folder is `apps/control-plane/src/modules/external-provider-boundary/**`.
The route may be a thin read route such as `GET /external-provider-boundary/companies/:companyKey`.
The route must parse `companyKey`, call the service, and serialize the result.
It must not contain SQL, prompt assembly, source ingest logic, finance math, report conversion, approval behavior, notification-provider logic, outbox send logic, provider credential logic, delivery scheduling, monitor rerun logic, mission creation, source mutation, or external action execution.

Third, the service should depend only on shipped read services.
Allowed direct reads are F6M delivery-readiness and F6N close/control review-summary.
F6H/F6J/F6K and latest persisted monitor posture may be used only through existing read services if a target needs context that F6M/F6N do not already carry.
The service must not read report artifacts as primary input, generic chat, mission-generated prose, runtime-Codex output, release/circulation records, provider state, provider credentials, outbox jobs, external communications, or demo replay runtime output.

Fourth, output targets should be bounded internal gates.
The expected first target families are:

- `delivery_readiness_boundary`
- `review_summary_boundary`
- `source_freshness_boundary`
- `proof_and_limitation_boundary`
- `human_review_gate_boundary`
- `outbox_absence_boundary`

Each target must include:

- evidence basis with refs back to shipped F6M/F6N read posture
- freshness or missing-source posture
- limitations
- proof posture
- internal provider-boundary review status
- human-review next step
- explicit absence facts proving no provider call, external delivery, send action, outbox send, approval, report, mission, monitor rerun, runtime-Codex work, generated prose, source mutation, finance write, advice/instruction, customer-contact instruction, or autonomous action occurred

Fifth, persistence remains absent in the first implementation.
No database schema, migration, provider-boundary table, provider credential table, send record, delivery log, approval record, report artifact, outbox event, source mutation record, replay event, provider job, or runtime-Codex artifact should be added.

## Concrete Steps

1. Add the pure domain contract if implementation begins.
   Likely files:
   - `packages/domain/src/external-provider-boundary.ts`
   - `packages/domain/src/external-provider-boundary.spec.ts`
   - `packages/domain/src/index.ts`

   Acceptance:
   - one company-scoped provider-boundary/readiness result
   - bounded internal target families
   - internal-only statuses such as `ready_for_provider_boundary_review`, `needs_human_review_before_provider_boundary`, and `blocked_by_evidence`
   - evidence basis, freshness or missing-source posture, limitations, proof posture, status, and human-review next step on every target
   - explicit absence boundary for provider calls, external delivery, send action, outbox send, approval, report, mission creation, monitor rerun, runtime-Codex, generated prose, source mutation, finance writes, legal/policy/payment/collection/customer-contact instruction, and autonomous action

2. Add a read-only control-plane bounded context only if implementation begins.
   Likely files:
   - `apps/control-plane/src/modules/external-provider-boundary/schema.ts`
   - `apps/control-plane/src/modules/external-provider-boundary/service.ts`
   - `apps/control-plane/src/modules/external-provider-boundary/formatter.ts`
   - `apps/control-plane/src/modules/external-provider-boundary/routes.ts`
   - `apps/control-plane/src/modules/external-provider-boundary/service.spec.ts`
   - `apps/control-plane/src/modules/external-provider-boundary/routes.spec.ts`

   Likely route:
   - `GET /external-provider-boundary/companies/:companyKey`

   Acceptance:
   - service reads shipped F6M/F6N posture only, with F6H/F6J/F6K/latest monitor context only through existing reads if needed
   - route stays thin
   - company-scope mismatches fail closed
   - no direct DB writes or schema changes
   - no monitor reruns
   - no report, approval, delivery, provider, outbox, runtime, source mutation, generated prose, credential, or finance-action behavior
   - no changes to shipped F6H/F6J/F6K/F6L/F6M/F6N/F6O behavior

3. Keep the operator surface backend-first unless a future implementation prompt explicitly asks for a UI.
   A read-only route plus specs is sufficient for first acceptance.
   Do not add send buttons, scheduling controls, provider setup screens, credential forms, approval controls, report-release controls, generated message previews, customer-contact surfaces, payment controls, or autonomous action controls.

4. Do not add a new package script or root smoke alias in the first implementation unless this plan is explicitly amended.
   Prefer focused domain/control-plane specs plus the existing shipped F6 smoke/proof ladder.

5. Refresh active docs after implementation, and only after implementation behavior exists.
   Expected docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - this FP-0065 record

## Validation and Acceptance

This docs-and-plan thread must run the user-requested validation ladder after docs edits:

- `pnpm smoke:delivery-readiness:local`
- `pnpm smoke:operator-readiness:local`
- `pnpm smoke:close-control-acknowledgement:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
- `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`
- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:finance-twin-receivables-aging:local`
- `pnpm smoke:finance-twin-payables-aging:local`
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

The future implementation slice should add focused domain and control-plane specs for the new provider-boundary contract, then rerun the same shipped F6 guardrail ladder.
Do not add a new smoke alias or package script unless this plan is amended.

Implementation acceptance requires all of the following:

- one deterministic internal provider-boundary/readiness result or read model exists
- the result is derived only from shipped stored/read state
- targets are bounded internal gates, not provider jobs, channel sends, recipient targets, or credential records
- every target carries evidence basis, freshness or missing-source posture, limitations, proof posture, status, and human-review next step
- output exposes explicit absence boundaries showing no provider call, external delivery, send action, outbox send, approval, report, mission creation, monitor rerun, runtime-Codex work, generated prose, source mutation, finance write, legal/policy/payment/collection/customer-contact instruction, or autonomous action occurred
- no external provider integration is added
- no email, Slack, SMS, webhook, notification provider call, provider credential flow, outbox send, scheduled notification, auto-send, report delivery, external publish behavior, approval, report, mission creation, monitor rerun, runtime-Codex drafting, generated prose, source mutation, payment behavior, accounting write, bank write, tax filing, legal advice, policy advice, collection instruction, customer-contact instruction, or autonomous action is added
- no report conversion or F5 release/circulation semantics are reused as F6P approval/provider authorization semantics
- no new monitor family or discovery family is added
- shipped F5 and F6 behavior remains unchanged

## Idempotence and Recovery

The preferred first F6P implementation is retry-safe because it is read-only.
Repeated reads over the same shipped stored/read posture should produce the same provider-boundary status except for explicitly labeled read timestamps.

Raw sources, source snapshots, source files, deterministic extracts, CFO Wiki pages, Finance Twin facts, monitor results, close/control checklist posture, operator-readiness posture, acknowledgement-readiness posture, delivery-readiness posture, review-summary posture, missions, reports, approvals, release/circulation records, source-pack fixtures, demo fixtures, outbox state, and provider state must not be mutated to make provider-boundary readiness pass.

If source state is missing, stale, failed, unsupported, partial, conflicting, or insufficient, F6P should report that posture instead of inventing provider readiness, send readiness, approval, release, certification, legal attestation, close completion, external delivery permission, recipient instructions, or provider authorization.

Rollback for the future implementation should remove only additive F6P provider-boundary domain/read-model/docs changes.
Rollback must leave FP-0050 through FP-0064, shipped monitor behavior, shipped alert handoff behavior, shipped checklist behavior, shipped demo replay behavior, shipped operator-readiness behavior, shipped acknowledgement-readiness behavior, shipped bank/card source-pack behavior, shipped delivery-readiness behavior, shipped review-summary behavior, shipped receivables/payables source-pack behavior, F5 reporting/approval/release/circulation behavior, raw sources, CFO Wiki state, Finance Twin state, and GitHub/engineering-twin modules intact.
No destructive database migration belongs in F6P.

## Artifacts and Notes

This docs-and-plan slice creates:

- `plans/FP-0065-external-provider-boundary-foundation.md`
- active-doc updates that identify FP-0065 as the active F6P implementation-ready contract
- no code
- no routes
- no schema or migrations
- no package scripts
- no smoke commands
- no eval datasets
- no fixtures
- no monitor-family or discovery-family expansion
- no runtime-Codex
- no external provider integration
- no provider credential flow
- no delivery, notification provider, outbox send, email, Slack, SMS, webhook, report, approval, mission creation, monitor rerun, monitor-result creation, source mutation, payment behavior, accounting write, bank write, tax filing, legal/policy advice, collection/customer-contact instruction, certification, sign-off, close-complete status, attestation, report release, report circulation, generated prose, or autonomous action behavior

Do not create FP-0066 in this slice.
Do not start F6P implementation in this slice.
Do not start F6Q, F6R, F6S, or later work here.

Likely later slices, not created here:

- `F6Q-close/control-certification`, only if operator need, evidence boundaries, legal boundaries, review gates, and non-autonomous safety posture are proven
- `F6R-additional-source-pack-expansion`, only after the receivables/payables source pack remains green and source-backed
- `F6S-actual-external-delivery`, only if a future plan proves provider security, compliance posture, explicit human confirmation, observability, retry behavior, safe failure modes, and no autonomous send

## Interfaces and Dependencies

Package boundaries must remain unchanged:

- `packages/domain` owns pure contracts for monitors, Finance Twin source/freshness/lineage vocabulary, discovery families, close/control, readiness, acknowledgement, delivery-readiness, review-summary, provider-boundary vocabulary, proof, mission, reporting, and approval vocabulary
- `packages/db` remains untouched unless a later plan explicitly justifies additive persistence, which this F6P plan does not need
- `apps/control-plane/src/modules/delivery-readiness` owns shipped F6M posture and must not be changed for F6P unless implementation discovers a direct truthfulness bug
- `apps/control-plane/src/modules/close-control-review-summary` owns shipped F6N posture and must not be changed for F6P unless implementation discovers a direct truthfulness bug
- `apps/control-plane/src/modules/close-control`, `operator-readiness`, and `close-control-acknowledgement` remain upstream read contexts only unless a direct truthfulness bug is proven
- `apps/control-plane/src/modules/monitoring` owns shipped monitor behavior and must not be changed for provider-boundary readiness
- `apps/control-plane/src/modules/reporting` and `apps/control-plane/src/modules/approvals` remain out of scope except as explicit boundaries F6P must not reuse
- `apps/control-plane/src/modules/outbox` remains a placeholder boundary and must not become a send pipeline in F6P
- `apps/web` remains out of scope for the first F6P implementation unless a future implementation prompt explicitly requests an operator UI

Runtime-Codex stays out of scope.
Provider credentials stay out of scope.
Provider SDKs stay out of scope.
External network calls stay out of scope.
No new environment variables are expected.
No Codex App Server boundary changes are expected.

## Outcomes & Retrospective

This docs-and-plan slice creates FP-0065 as the only active F6P implementation-ready contract after repo-truth inspection supported F6P only as an internal provider-boundary/readiness foundation.
The slice did not start F6P implementation.
It did not create FP-0066.
It kept FP-0050 through FP-0064 as shipped records.

The final validation ladder passed on 2026-04-29T17:43:55Z, including the requested DB-backed smokes, direct bank/card and receivables/payables source-pack proofs, targeted twin vitest guardrails, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
The exact next recommendation is to start F6P implementation next only if it remains exactly the internal provider-boundary/readiness foundation described here; otherwise start F6Q planning only after a separate prompt proves certification need, legal boundaries, and review gates.
