# Plan F6S external delivery human-confirmation boundary foundation

## Purpose / Big Picture

This is the active Finance Plan for the Pocket CFO F6S implementation contract.
The target phase is `F6`, and the first implementation slice is exactly `F6S-external-delivery-human-confirmation-boundary-foundation`.

The user-visible goal is narrow: after shipped F6A through F6R, Pocket CFO should be able to show one deterministic internal external-delivery safety gate / human-confirmation readiness posture that a human operator can review before any future plan considers actual external delivery.
This is not actual external delivery.
It is not email, Slack, SMS, webhook, notification-provider work, provider integration, provider credential storage, provider job creation, outbox send behavior, scheduled delivery, auto-send, report delivery, report release, report circulation, approval, certification, close completion, sign-off, attestation, legal opinion, audit opinion, payment behavior, customer contact, or autonomous action.

Repo truth supports F6S only in this reduced shape.
F6M already ships deterministic internal delivery-readiness over shipped F6J operator-readiness and F6K acknowledgement-readiness posture, with explicit no-send, no-provider, no-outbox, no-report, no-approval, no-runtime-Codex, no-monitor-rerun, no-source-mutation, no-finance-action, and no-autonomous-action boundaries.
F6P already ships deterministic internal external-provider-boundary/readiness over shipped F6M and F6N posture only, with explicit no-provider-call, no-provider-credential, no-provider-job, no-delivery, no-outbox-send, no-report, no-approval, no-generated-prose, no-runtime-Codex, and no-finance-action posture.
F6Q already ships deterministic internal close/control certification-boundary/readiness over shipped F6N and F6P posture only, with explicit no-certification, no-close-complete, no-sign-off, no-attestation, no-legal-opinion, no-audit-opinion, no-assurance, no-approval, no-report-release, no-report-circulation, no-delivery, no-provider, no-outbox, no-runtime-Codex, and no-finance-action posture.
F6N already ships deterministic internal close/control review-summary posture over shipped F6H/F6J/F6K/F6M state, with source/freshness/proof posture and human-review next steps.
F6L, F6O, and F6R source-pack proofs are the required source-backed proof guardrails for the first F6S implementation.

Actual external delivery is not safe yet.
The safe next slice is a deterministic internal human-confirmation / delivery-preflight boundary that can say whether a future external delivery might be considered, why, what evidence supports or blocks that consideration, what is stale or limited, and what human-review step remains.
It must also prove that no send, provider call, provider credential, provider job, outbox send, approval, report release, certification, mission creation, monitor rerun, source mutation, generated prose, runtime-Codex work, finance write, advice, instruction, or autonomous action occurred.

GitHub connector work is explicitly out of scope.
Do not invoke GitHub Connector Guard for F6S.

## Progress

- [x] 2026-04-29T22:43:44Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-04-29T22:43:44Z Ran preflight against fetched `origin/main`, confirmed the branch is `codex/f6s-master-plan-and-doc-refresh-local-v1`, confirmed the worktree was clean, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-04-29T22:43:44Z Read the requested active docs, shipped FP-0063/FP-0065/FP-0066/FP-0067 records, package scripts, F6M/F6P/F6Q/F6N domain contracts, F6M/F6P/F6Q/F6N control-plane modules, outbox placeholder, approvals/reporting boundaries, and shipped proof tools.
- [x] 2026-04-29T22:43:44Z Decided repo truth does not support actual external delivery as F6S; repo truth supports only a deterministic internal external-delivery human-confirmation / delivery-preflight boundary with no send behavior.
- [x] 2026-04-29T22:43:44Z Created this FP-0068 implementation-ready planning contract and refreshed active docs without adding code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, implementation scaffolding, runtime behavior, provider calls, delivery, reports, approvals, certification, close-complete status, sign-off, attestation, legal/audit opinion, source mutation, monitor/discovery families, or finance actions.
- [x] 2026-04-29T22:43:44Z Ran the requested docs-and-plan validation ladder through `pnpm ci:repro:current`; all commands passed before commit.

## Surprises & Discoveries

The roadmap label `F6S - actual external delivery` is too broad if read literally.
The repository is not ready to send, schedule, deliver, publish, or call providers.
It is ready to plan a safety gate around any future external delivery because shipped F6M, F6P, F6Q, and F6N already prove internal readiness and absence-boundary posture.

The outbox bounded context is intentionally still only `apps/control-plane/src/modules/outbox/README.md`.
That absence is a safety fact for F6S, not a subsystem to fill.
F6S must not create outbox send events, provider jobs, retry queues, delivery records, or scheduled sends.

F5 release, circulation, correction, and approval records exist, but they are unsafe primary inputs for F6S.
Those seams carry report-specific approval, release, and circulation semantics and must not become a general delivery approval, human confirmation, provider authorization, certification, sign-off, or external communication workflow.

F6R strengthens contract/obligation source-pack proof, but it does not authorize external delivery.
The first F6S implementation should depend on existing source/freshness/proof posture and should rerun source-pack proofs in validation, not treat source-pack existence as send permission.

No persistence is justified for the first F6S slice.
A derived read model is enough for the first safety gate, while persistence would risk implying a send record, approval, provider job, report release, certification, close-complete status, sign-off, attestation, legal/audit opinion, or delivery log.

## Decision Log

Decision: proceed with `F6S-external-delivery-human-confirmation-boundary-foundation`, not actual external delivery.
Rationale: shipped F6M/F6P/F6Q/F6N posture can support one internal safety gate, but it does not prove provider security, compliance posture, credentials, retry behavior, observability, safe failure modes, or permission to send.

Decision: F6S is not actual send in the first implementation.
Rationale: do not add email sends, Slack sends, SMS sends, webhook calls, provider API calls, provider credential storage, provider jobs, outbox send behavior, scheduled delivery, auto-send, report delivery, external publish behavior, or any delivery execution surface.

Decision: F6S is not an approval workflow.
Rationale: no new approval kind belongs in F6S. Do not reuse F5 `report_release` or `report_circulation` semantics without a later named plan proving it safe. F6S must not imply sign-off, certification, close complete, report release, report circulation, legal attestation, audit opinion, provider authorization, or send permission.

Decision: F6S is not a report-release slice.
Rationale: do not create report artifacts, release reports, circulate reports, convert F6N/F6Q review posture into external communications, or rely on report artifacts as primary input.

Decision: first F6S is internal and operator-visible only.
Rationale: the useful first surface is one deterministic human-confirmation / delivery-preflight readiness result or read model that explains evidence basis, source/freshness posture, limitations, proof posture, status, and human-review next step for a bounded list of delivery-gate targets.

Decision: first F6S inputs are shipped stored/read state only.
Rationale: primary inputs are F6M delivery-readiness posture, F6P provider-boundary posture, F6Q certification-boundary posture, and F6N review-summary posture. F6J/F6K/F6H posture, latest persisted monitor results, and source/CFO Wiki freshness posture may be used only as context through shipped read services if needed. Generic chat, report artifacts as primary input, runtime-Codex output, mission-generated prose, monitor reruns, demo replay runtime execution, provider state, provider credentials, outbox jobs, external communications, generated notification prose, and source mutation are out of scope.

Decision: first output contract is one deterministic internal external-delivery human-confirmation readiness result or read model.
Rationale: each delivery-gate target must include evidence basis, source/freshness posture, limitations, proof posture, status, and human-review next step. The result must include explicit absence boundaries showing no external delivery, no provider call, no provider credential, no provider job, no send action, no outbox send, no scheduled delivery, no auto-send, no approval, no report release/circulation, no mission creation, no legal/policy/payment/collection/customer-contact instruction, and no generated prose.

Decision: first F6S should be read-only and no-schema.
Rationale: F6M/F6P/F6Q/F6N already expose enough stored/read posture. If persistence is needed later, a future plan must justify why and keep it additive, idempotent, company-scoped, evidence-linked, and explicitly not a send record, provider call record, outbox-send record, delivery log, approval, report-release record, certification, close-complete record, sign-off, attestation, legal opinion, or audit opinion.

Decision: likely first target families are internal delivery-gate targets, not channels, recipients, providers, or jobs.
Rationale: safe target families are `delivery_readiness_confirmation_boundary`, `provider_boundary_confirmation_boundary`, `certification_boundary_confirmation_boundary`, `review_summary_confirmation_boundary`, `source_freshness_and_proof_boundary`, and `human_confirmation_absence_boundary`.

Decision: first statuses must remain review-oriented.
Rationale: acceptable status vocabulary is internal, such as `ready_for_human_confirmation_review`, `needs_human_review_before_confirmation`, and `blocked_by_evidence`. Do not add `confirmed`, `approved`, `send_ready`, `provider_ready`, `release_ready`, `delivered`, `sent`, `scheduled`, `certified`, `signed_off`, `attested`, or `close_complete`.

Decision: F6S must preserve shipped F5 and F6 behavior.
Rationale: no F5 report/release/circulation/correction changes, no monitor evaluator changes, no F6B/F6G mission changes, no F6H checklist behavior changes, no F6J readiness behavior changes, no F6K acknowledgement behavior changes, no F6L bank/card source-pack behavior changes, no F6M delivery-readiness behavior changes, no F6N review-summary behavior changes, no F6O receivables/payables source-pack behavior changes, no F6P provider-boundary behavior changes, no F6Q certification-boundary behavior changes, no F6R contract/obligation source-pack behavior changes, no new approval kind, no report conversion, and no monitor-family or discovery-family expansion belongs in F6S.

Decision: later slices are named but not created here.
Rationale: F6T actual certification should happen only if operator need, legal boundaries, evidence boundaries, review gates, and non-advice constraints are proven. F6U additional source-pack expansion should happen only after existing source packs remain green. F6V actual provider integration should happen only if a future plan proves provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send. Do not create FP-0069, F6T, F6U, F6V, or later plans in this slice.

## Context and Orientation

Pocket CFO has shipped F6A through F6R:

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
- F6P deterministic internal external-provider-boundary/readiness read model over shipped delivery-readiness and review-summary posture only
- F6Q deterministic internal close/control certification-boundary/readiness read model over shipped review-summary and provider-boundary posture only
- F6R checked-in contract/obligation source-pack foundation with normalized source/twin posture and direct proof through existing source registry and Finance Twin contract/obligation routes only

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

The relevant shipped implementation seams for F6S are:

- `packages/domain/src/delivery-readiness.ts` for F6M internal delivery-readiness posture and no-send/no-provider/no-outbox absence boundaries
- `packages/domain/src/external-provider-boundary.ts` for F6P internal provider-boundary posture and no-provider/no-send/no-outbox boundaries
- `packages/domain/src/close-control-certification-boundary.ts` for F6Q internal certification-boundary posture and no-certification/no-release/no-delivery boundaries
- `packages/domain/src/close-control-review-summary.ts` for F6N internal review-summary posture and source/freshness/proof/absence posture
- `packages/domain/src/monitoring.ts` for the fixed shipped monitor-family vocabulary and latest persisted monitor-result posture
- `packages/domain/src/discovery-mission.ts` for the fixed shipped finance-discovery vocabulary
- `packages/domain/src/proof-bundle.ts` for proof vocabulary and F5 release/circulation facts that F6S must not use as primary inputs
- `packages/domain/src/approval.ts` for the existing approval kinds that F6S must not widen
- `apps/control-plane/src/modules/delivery-readiness/**` for the shipped F6M read-only service and route
- `apps/control-plane/src/modules/external-provider-boundary/**` for the shipped F6P read-only service and route
- `apps/control-plane/src/modules/close-control-certification-boundary/**` for the shipped F6Q read-only service and route
- `apps/control-plane/src/modules/close-control-review-summary/**` for the shipped F6N read-only service and route
- `apps/control-plane/src/modules/outbox/README.md` as an explicit placeholder boundary proving no send pipeline exists in the first F6S slice
- `apps/control-plane/src/modules/approvals/**` and `apps/control-plane/src/modules/reporting/**` as explicit safety boundaries, not inputs to confirm delivery
- `tools/bank-card-source-pack-proof.mjs`, `tools/receivables-payables-source-pack-proof.mjs`, and `tools/contract-obligation-source-pack-proof.mjs` for source-pack proof posture that must stay green

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No source mutation is expected.
No database schema migration, eval dataset, fixture family, package script, smoke alias, monitor family, discovery family, report, approval, delivery behavior, provider integration, provider credential storage, provider job, outbox send, payment behavior, finance write, legal/policy advice, collection/customer-contact instruction, actual certification, close-complete status, sign-off, attestation, legal opinion, audit opinion, assurance, generated prose, or autonomous action belongs in F6S.

## Plan of Work

First, the implementation should add one pure domain contract for external-delivery human-confirmation readiness posture.
The likely contract name is `ExternalDeliveryHumanConfirmationBoundaryResult` with bounded `ExternalDeliveryHumanConfirmationTarget` entries.
The contract should include company scope, generated time, aggregate internal human-confirmation review status, target list, evidence summary, limitations, and runtime/action absence boundary.
The contract must avoid send-ready, provider-ready, approved, confirmed, release-ready, certified, close-complete, delivered, sent, scheduled, signed-off, attested, legal-opinion, or audit-opinion statuses.

Second, the implementation should add one read-only control-plane bounded context.
The likely folder is `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/**`.
The likely route is `GET /external-delivery/companies/:companyKey/human-confirmation-boundary`.
The route should parse `companyKey`, call the service, and serialize the result.
It must contain no SQL, prompt assembly, source ingest logic, finance math, report conversion, approval behavior, notification-provider logic, provider credential logic, provider job logic, outbox send logic, delivery scheduling, monitor rerun logic, mission creation, source mutation, generated prose, or external action execution.

Third, the service should depend only on shipped read services.
Primary reads should be F6M delivery-readiness, F6P external-provider-boundary, F6Q close/control certification-boundary, and F6N close/control review-summary.
F6J/F6K/F6H and latest persisted monitor posture may be carried only through existing read services if needed for context.
The service must not read report artifacts as primary input, generic chat, mission-generated prose, runtime-Codex output, release/circulation records, approval records, provider state, provider credentials, outbox jobs, external communications, demo replay runtime output, or generated prose.

Fourth, output targets should be bounded internal gates.
The expected first target families are:

- `delivery_readiness_confirmation_boundary`
- `provider_boundary_confirmation_boundary`
- `certification_boundary_confirmation_boundary`
- `review_summary_confirmation_boundary`
- `source_freshness_and_proof_boundary`
- `human_confirmation_absence_boundary`

Each target must include:

- evidence basis with refs back to shipped F6M/F6P/F6Q/F6N read posture
- source lineage and freshness or missing-source posture when available
- limitations
- proof posture
- internal human-confirmation review status
- human-review next step
- explicit absence facts proving no external delivery, provider call, provider credential, provider job, send action, outbox send, scheduled delivery, auto-send, approval, report release/circulation, certification, close completion, sign-off, attestation, legal/audit opinion, mission, monitor rerun, runtime-Codex work, generated prose, source mutation, finance write, advice/instruction, customer-contact instruction, or autonomous action occurred

Fifth, persistence remains absent.
No database schema, migration, human-confirmation table, send record, delivery log, provider call record, provider credential record, provider job, approval record, report artifact, report release record, outbox event, source mutation record, replay event, certification record, close-complete record, sign-off record, attestation record, legal/audit opinion record, assurance record, or runtime-Codex artifact should be added.

## Concrete Steps

1. Add the pure domain contract only when F6S implementation begins.
   Likely files:
   - `packages/domain/src/external-delivery-human-confirmation-boundary.ts`
   - `packages/domain/src/external-delivery-human-confirmation-boundary.spec.ts`
   - `packages/domain/src/index.ts`

   Acceptance:
   - one company-scoped external-delivery human-confirmation readiness result
   - bounded internal target families
   - internal-only statuses such as `ready_for_human_confirmation_review`, `needs_human_review_before_confirmation`, and `blocked_by_evidence`
   - evidence basis, freshness or missing-source posture, limitations, proof posture, status, and human-review next step on every target
   - explicit absence boundary for external delivery, provider calls, provider credentials, provider jobs, send action, outbox send, scheduled delivery, auto-send, approval, report release/circulation, certification, close-complete status, sign-off, attestation, legal opinion, audit opinion, assurance, mission creation, monitor rerun, runtime-Codex, generated prose, source mutation, finance writes, legal/policy/payment/collection/customer-contact instruction, and autonomous action

2. Add a read-only control-plane bounded context only when F6S implementation begins.
   Likely files:
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/schema.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/service.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/formatter.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/delivery-targets.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/provider-targets.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/certification-targets.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/review-summary-targets.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/source-proof-target.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/static-boundary-targets.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/evidence.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/helpers.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/routes.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/service.spec.ts`
   - `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/routes.spec.ts`

   Likely route:
   - `GET /external-delivery/companies/:companyKey/human-confirmation-boundary`

   Acceptance:
   - service reads shipped F6M/F6P/F6Q/F6N posture only, with F6J/F6K/F6H/latest monitor context only through existing reads if needed
   - route stays thin
   - company-scope mismatches fail closed
   - no direct DB writes or schema changes
   - no monitor reruns
   - no report, approval, delivery, provider, credential, provider job, outbox, runtime, source mutation, generated prose, certification, close-complete, sign-off, attestation, legal/audit opinion, assurance, or finance-action behavior
   - no changes to shipped F5, F6H, F6J, F6K, F6L, F6M, F6N, F6O, F6P, F6Q, or F6R behavior

3. Keep the operator surface backend-first unless a future implementation prompt explicitly asks for a UI.
   A read-only route plus focused specs is sufficient for first acceptance.
   Do not add send buttons, scheduling controls, provider setup screens, credential forms, approval controls, report-release controls, certification controls, close-complete controls, sign-off controls, generated message previews, customer-contact surfaces, payment controls, or autonomous action controls.

4. Do not add a new package script, root smoke alias, eval dataset, fixture, provider integration, credential scaffold, outbox worker, or smoke command in the first implementation unless this plan is explicitly amended.
   Prefer focused domain/control-plane specs plus the existing shipped F6 smoke/proof ladder.

5. Refresh active docs after implementation, and only after implementation behavior exists.
   Expected docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - this FP-0068 record

## Validation and Acceptance

This docs-and-plan thread must run the user-requested validation ladder after docs edits:

- `pnpm smoke:delivery-readiness:local`
- `pnpm smoke:operator-readiness:local`
- `pnpm smoke:close-control-acknowledgement:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
- `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`
- `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`
- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:finance-twin-contract-metadata:local`
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
- `pnpm --filter @pocket-cto/domain exec vitest run src/close-control-certification-boundary.spec.ts src/external-provider-boundary.spec.ts src/close-control-review-summary.spec.ts src/delivery-readiness.spec.ts src/close-control-acknowledgement.spec.ts src/operator-readiness.spec.ts src/close-control.spec.ts src/monitoring.spec.ts src/finance-twin.spec.ts src/proof-bundle.spec.ts`
- `zsh -lc "cd apps/control-plane && pnpm exec vitest run src/modules/close-control-certification-boundary/**/*.spec.ts src/modules/external-provider-boundary/**/*.spec.ts src/modules/close-control-review-summary/**/*.spec.ts src/modules/delivery-readiness/**/*.spec.ts src/modules/close-control-acknowledgement/**/*.spec.ts src/modules/operator-readiness/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/finance-twin/**/*.spec.ts src/modules/wiki/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/app.spec.ts"`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Docs-and-plan validation outcome: passed on 2026-04-29 before commit, including the shipped F6M/F6P/F6Q/F6N boundary suites, F6L/F6O/F6R source-pack proofs, existing monitor and discovery-family smokes, lint, typecheck, full tests, and `pnpm ci:repro:current`.

First F6S implementation acceptance requires all of the following:

- one deterministic internal external-delivery human-confirmation readiness result or read model exists
- one bounded list of delivery-gate targets exists
- each target includes evidence basis, source/freshness posture, limitations, proof posture, status, and human-review next step
- output exposes explicit absence boundaries proving no external delivery, provider call, provider credential, provider job, send action, outbox send, scheduled delivery, auto-send, approval, report release/circulation, certification, close complete, sign-off, attestation, legal/audit opinion, mission creation, monitor rerun, runtime-Codex work, generated prose, source mutation, finance write, advice/instruction, customer-contact instruction, or autonomous action occurred
- implementation reads only shipped F6M/F6P/F6Q/F6N posture as primary input
- source-pack proofs F6L/F6O/F6R remain green and source-backed
- monitor families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`
- discovery families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, `spend_posture`, `obligation_calendar_review`, and `policy_lookup`
- no code in the docs-and-plan slice
- no schema, route, package script, smoke alias, eval dataset, fixture, provider integration, credential scaffold, outbox send behavior, report, approval, delivery, certification, source mutation, monitor family, discovery family, or autonomous behavior is added by this docs-and-plan slice

Human-observable acceptance for this docs-and-plan slice:

- `plans/FP-0068-external-delivery-human-confirmation-boundary-foundation.md` exists as the active F6S implementation-ready contract
- active docs point future Codex threads at FP-0068 as a non-sending F6S contract
- FP-0050 through FP-0067 remain shipped F6A through F6R records
- validation passes on the final tree

## Idempotence and Recovery

This docs-and-plan slice is retry-safe.
It changes active docs and creates one plan only.
Rollback should remove FP-0068 and revert the active-doc references, leaving FP-0050 through FP-0067, shipped F6 behavior, source-pack fixtures/proofs, Finance Twin state, CFO Wiki state, GitHub modules, and engineering-twin modules intact.

The first F6S implementation should also be retry-safe because it should be derived read-only posture with no schema.
If source state is missing, stale, failed, unsupported, partial, conflicting, or insufficient, F6S should report blocked or needs-review posture and limitations instead of inventing readiness or creating delivery artifacts.

Replay implication for the first F6S implementation is explicit absence.
The first result should be derived from current stored/read posture and not persisted as a mission replay event.
If a future plan wants persisted human-confirmation history, it must name that replay behavior explicitly and must not create send, provider, outbox, report-release, approval, certification, close-complete, sign-off, attestation, legal/audit opinion, assurance, finance-write, customer-contact, or autonomous-action semantics.

## Artifacts and Notes

This docs-and-plan slice creates or updates:

- `plans/FP-0068-external-delivery-human-confirmation-boundary-foundation.md`
- `README.md`
- `START_HERE.md`
- `docs/ACTIVE_DOCS.md`
- `plans/ROADMAP.md`
- `plans/FP-0067-contract-obligation-source-pack-foundation.md` with a tiny shipped-record handoff note only if needed

Do not create FP-0069.
Do not start F6S implementation in this docs-and-plan slice.
Do not start F6T, F6U, F6V, or later work in this slice.

Expected future implementation artifacts are listed in `Concrete Steps`, but they must not be created by this docs-and-plan slice.

## Interfaces and Dependencies

The first F6S implementation belongs in a new read-only human-confirmation boundary context and a pure domain contract only if implementation begins.
It should depend on shipped F6M/F6P/F6Q/F6N read services, not reports, approvals, outbox, provider state, runtime-Codex, or generic chat.
The web UI is out of scope for the first implementation unless a future prompt explicitly changes the plan.
The database schema is out of scope.
Approvals, reporting, evidence, delivery, provider, outbox, runtime-Codex, mission, monitoring, close/control checklist, operator-readiness, acknowledgement-readiness, delivery-readiness, review-summary, provider-boundary, certification-boundary, and source-pack proof surfaces are dependencies only as safety boundaries unless a future named plan explicitly changes scope.

Runtime-Codex remains absent.
No new environment variables are expected.
No GitHub connector work is expected.

## Outcomes & Retrospective

This docs-and-plan slice creates the active F6S implementation-ready contract only.
It intentionally narrows F6S away from actual external delivery and toward one deterministic internal delivery safety gate / human-confirmation boundary.
It adds no implementation code, route, schema, migration, package script, smoke alias, eval dataset, fixture, provider integration, credential scaffold, outbox behavior, report, approval, delivery, certification, close-complete, sign-off, attestation, legal/audit opinion, monitor family, discovery family, source mutation, generated prose, runtime-Codex behavior, finance write, or autonomous action.

Recommendation: start F6S implementation next only from this FP-0068 contract and keep it read-only/no-schema unless a concrete blocker is recorded in this plan.
Do not start F6T/F6U planning next unless F6S implementation is deferred by a specific human decision or a validation blocker proves the F6S safety gate is not implementable.
