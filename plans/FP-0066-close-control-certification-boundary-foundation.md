# Plan F6Q close/control certification boundary foundation

## Purpose / Big Picture

This is the shipped Finance Plan for the Pocket CFO F6Q implementation contract.
The target phase is `F6`, and the first implementation slice is exactly `F6Q-close-control-certification-boundary-foundation`.

The user-visible goal is narrow: after shipped F6A through F6P, Pocket CFO should be able to show one deterministic internal close/control certification-boundary/readiness posture that a human operator can review before any later plan considers actual certification.
This is not certification.
It is not a close-complete assertion.
It is not sign-off, attestation, legal opinion, audit opinion, legal assurance, audit assurance, report release, report circulation, external delivery, provider authorization, or an approval workflow.

Repo truth supports F6Q only in this reduced shape.
F6N already ships one deterministic internal close/control review-summary read model over shipped F6H checklist, F6J operator-readiness, F6K acknowledgement-readiness, and F6M delivery-readiness posture, with explicit no-certification, no-close-complete, no-sign-off, no-attestation, no-approval, no-report-release, no-report-circulation, no-provider-call, no-outbox-send, no-external-delivery, no-generated-prose, no-runtime-Codex, and no-finance-action boundaries.
F6P already ships one deterministic internal external-provider-boundary/readiness read model over shipped F6M/F6N posture only, with explicit no-provider-call, no-provider-credential, no-provider-job, no-outbox-send, no-delivery, no-report, no-approval, no-generated-prose, no-source-mutation, no-runtime-Codex, and no-finance-action posture.
Together, F6N and F6P provide enough internal review and absence-boundary posture to plan a first certification-boundary result safely.
They do not prove actual certification, close completion, sign-off, attestation, legal opinion, audit opinion, assurance, release, or delivery.

The plan keeps the preferred `certification-boundary` name because the slice is about drawing and proving the boundary around certification, not emitting certification.
The safer `certification-readiness-boundary` filename is not needed as long as the implementation vocabulary, statuses, output fields, docs, and tests all keep the boundary/readiness posture explicit and forbid actual certification semantics.

The first F6Q implementation should be read-only and no-schema unless a concrete blocker appears.
If persistence is needed later, a future Finance Plan must justify why and keep it additive, idempotent, company-scoped, evidence-linked, and explicitly not a certification record, approval record, close-complete record, attestation record, report-release record, legal opinion, audit opinion, or assurance record.

GitHub connector work is explicitly out of scope.
Do not invoke GitHub Connector Guard for F6Q.

## Progress

- [x] 2026-04-29T19:38:05Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-04-29T19:38:05Z Ran preflight against fetched `origin/main`, confirmed the branch is `codex/f6q-master-plan-and-doc-refresh-local-v1`, confirmed the worktree was clean, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-04-29T19:38:05Z Read the requested active docs, shipped FP-0063 and FP-0065 records, package scripts, F6N/F6P/F6M/F6K/F6J/F6H/F6 monitoring domain contracts, F6N/F6P/F6M/F6K/F6J/F6H/monitoring control-plane modules, evidence and approval boundaries, and shipped proof tools.
- [x] 2026-04-29T19:38:05Z Decided repo truth supports F6Q only as an internal close/control certification-boundary/readiness foundation, not actual certification and not F6R source-pack expansion as the safer immediate next slice.
- [x] 2026-04-29T19:38:05Z Created this FP-0066 implementation-ready planning contract and refreshed active docs without adding code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, implementation scaffolding, runtime behavior, reports, approvals, provider calls, delivery, certification, close-complete status, sign-off, attestation, legal/audit opinion, source mutation, monitor/discovery families, or finance actions.
- [x] 2026-04-29T19:45:49Z Ran the requested docs-and-plan validation ladder through `pnpm ci:repro:current`; all repo validation commands passed.
- [x] 2026-04-29T20:10:03Z Implemented the first F6Q slice as a read-only/no-schema close/control certification-boundary route over shipped F6N review-summary and F6P provider-boundary posture only.
- [x] 2026-04-29T20:10:03Z Added focused domain and control-plane specs for target/status vocabulary, absence boundaries, ready/needs-review/blocked mappings, company-scope guardrails, and forbidden side-effect methods.
- [x] 2026-04-29T20:10:03Z Refreshed active docs and stale secondary-doc lines so FP-0066 is the shipped F6Q record and F6R planning waits for a new Finance Plan.
- [x] 2026-04-29T20:24:17Z Ran the full requested implementation validation ladder, including narrow F6Q specs, domain/control-plane guardrail specs, shipped F6 proof smokes, twin guardrails, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed.

## Surprises & Discoveries

The roadmap phrase `F6Q - close/control certification` is too broad if read literally.
The repository is not ready to certify, sign off, attest, close the books, or offer legal/audit assurance.
It is ready to plan a certification-boundary/readiness read model because shipped F6N and F6P already prove internal review posture and external/provider absence posture.

F5 report release, report circulation, release logs, circulation logs, correction history, and approval records exist, but they are unsafe primary inputs for F6Q.
Those seams carry report-specific approval/release/circulation semantics and must not become close/control certification, sign-off, approval, attestation, assurance, or close-complete semantics.

F6P provider-boundary posture is useful for F6Q only as an absence-boundary input.
It does not authorize provider calls, provider credentials, provider jobs, delivery, outbox sends, report release, approvals, generated prose, or external communication.

The first implementation did not require persistence.
The route can derive certification-boundary readiness deterministically from F6N/F6P read posture, so adding a table or replay event would have risked implying a certification record, approval record, close-complete record, legal/audit opinion, or release artifact before the product boundary exists.

F6R source-pack expansion remains useful later, but it is not safer than F6Q when F6Q is kept read-only, no-schema, internal, and certification-free.
The existing bank/card and receivables/payables source-pack proofs provide enough source-pack guardrails for the first certification-boundary planning slice.

## Decision Log

Decision: proceed with `F6Q-close-control-certification-boundary-foundation` rather than switch immediately to F6R source-pack expansion.
Rationale: shipped F6N internal review-summary posture and shipped F6P provider-boundary absence posture provide enough repo truth for one deterministic internal certification-boundary/readiness result. The result must remain a boundary review, not certification.

Decision: use the preferred `FP-0066-close-control-certification-boundary-foundation.md` filename.
Rationale: `certification-boundary` is safe because the plan is about proving what must remain outside the first implementation. The implementation must use boundary/readiness language and must not emit certification language or status values.

Decision: F6Q is not actual certification in the first implementation.
Rationale: F6Q must not add certification status, close-complete status, sign-off, attestation, legal opinion, audit opinion, legal assurance, audit assurance, representation, external release, or legal/audit validation.
Prefer language such as internal certification-boundary readiness, certification-boundary review posture, and close/control certification boundary.

Decision: F6Q is not report release or external delivery.
Rationale: F6Q must not add report release, report circulation, external publish, email, Slack, SMS, webhook, provider calls, outbox sends, provider credentials, provider jobs, scheduled delivery, auto-send, or any delivery action.

Decision: F6Q is not an approval workflow.
Rationale: no new approval kind belongs in F6Q, and F6Q must not reuse F5 `report_release` or `report_circulation` semantics. The first certification-boundary result must not imply approval, sign-off, certification, close complete, external release, legal attestation, audit opinion, or assurance.

Decision: first F6Q inputs are shipped stored/read state only.
Rationale: primary inputs may include F6N close/control review-summary posture and F6P external-provider-boundary posture. F6M delivery-readiness, F6K acknowledgement-readiness, F6H checklist, F6J operator-readiness, latest persisted monitor results, and source/CFO Wiki freshness posture may be used only as context through shipped read services if needed. Generic chat, report artifacts as primary input, runtime-Codex output, mission-generated prose, monitor reruns, source mutation, demo replay runtime execution, provider state, provider credentials, outbox jobs, external communications, and generated prose are out of scope.

Decision: the first output contract is one deterministic internal certification-boundary/readiness result or read model.
Rationale: the output should contain bounded certification-boundary targets. Each target must include evidence basis, freshness or missing-source posture, limitations, proof posture, status, and a human-review next step. The output must explicitly state that no certification, close complete, sign-off, attestation, legal/audit opinion, approval, report release, report circulation, delivery/send action, mission creation, legal/policy/payment/collection/customer-contact instruction, generated prose, or autonomous action occurred.

Decision: first F6Q should be read-only and no-schema.
Rationale: F6N/F6P already expose enough stored/read posture. Persistence would risk creating a certification record, approval record, close-complete record, attestation, report-release record, assurance record, or legal/audit opinion before the product boundary is proven.

Decision: first F6Q reads exactly the shipped F6N review-summary service and shipped F6P provider-boundary service.
Rationale: those read models already carry the upstream checklist, readiness, acknowledgement, delivery, source/freshness, proof, and provider absence posture that F6Q needs. Direct F6M/F6K/F6H/F6J reads were unnecessary for the first slice and would widen the dependency surface.

Decision: F6Q must preserve shipped F5 and F6 behavior.
Rationale: no F5 report/release/circulation/correction changes, monitor evaluator changes, F6B/F6G mission changes, F6H checklist behavior changes, F6J readiness behavior changes, F6K acknowledgement behavior changes, F6L bank/card source-pack behavior changes, F6M delivery-readiness behavior changes, F6N review-summary behavior changes, F6O receivables/payables source-pack behavior changes, F6P provider-boundary behavior changes, new approval kind, report conversion, monitor-family expansion, or discovery-family expansion belongs in F6Q.

Decision: likely later slices are named but not created here.
Rationale: F6R additional source-pack expansion should happen only after the existing source packs remain green. F6S actual external delivery should happen only if a future plan proves provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send. F6T actual certification should happen only if operator need, legal boundaries, evidence boundaries, review gates, and non-advice constraints are proven. Do not create FP-0067, F6R, F6S, F6T, or later plans in this slice.

## Context and Orientation

Pocket CFO has shipped F6A through F6P:

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

The relevant implementation seams for F6Q are:

- `packages/domain/src/close-control-review-summary.ts` for F6N internal review-summary posture and explicit no-certification/no-release/no-delivery boundaries
- `packages/domain/src/external-provider-boundary.ts` for F6P internal provider-boundary posture and explicit no-provider/no-send/no-outbox boundaries
- `packages/domain/src/delivery-readiness.ts` for F6M internal review-before-delivery posture when carried through shipped reads
- `packages/domain/src/close-control-acknowledgement.ts` for F6K acknowledgement-readiness posture when carried through shipped reads
- `packages/domain/src/operator-readiness.ts` for F6J source/freshness/proof posture when carried through shipped reads
- `packages/domain/src/close-control.ts` for F6H checklist posture when carried through shipped reads
- `packages/domain/src/monitoring.ts` for the fixed shipped monitor-family vocabulary and latest persisted monitor-result posture
- `packages/domain/src/proof-bundle.ts` for proof vocabulary and F5 release/circulation facts that F6Q must not use as primary inputs
- `packages/domain/src/approval.ts` for the existing approval kinds that F6Q must not widen
- `apps/control-plane/src/modules/close-control-review-summary/**` for the shipped F6N read-only service and route
- `apps/control-plane/src/modules/external-provider-boundary/**` for the shipped F6P read-only service and route
- `apps/control-plane/src/modules/delivery-readiness/**`, `close-control-acknowledgement/**`, `operator-readiness/**`, `close-control/**`, and `monitoring/**` as context-only upstream read seams
- `apps/control-plane/src/modules/approvals/**` and `apps/control-plane/src/modules/evidence/**` as explicit safety boundaries, not inputs to certify or release anything

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No source mutation is expected.
No database schema migration, eval dataset, fixture family, package script, smoke alias, monitor family, discovery family, report, approval, delivery behavior, provider integration, provider credential storage, outbox send, payment behavior, finance write, legal/policy advice, collection/customer-contact instruction, actual certification, close-complete status, sign-off, attestation, legal opinion, audit opinion, assurance, or autonomous action belongs in F6Q.

## Plan of Work

First, the implementation should add one pure domain contract for certification-boundary/readiness posture.
The likely contract name is `CloseControlCertificationBoundaryResult` with bounded `CloseControlCertificationBoundaryTarget` entries.
The contract should include company scope, generated time, aggregate internal boundary-review status, target list, evidence summary, limitations, and runtime/action absence boundary.
The contract must avoid `certified`, `certification_complete`, `close_complete`, `signed_off`, `attested`, `approved`, `release_ready`, `delivered`, `assured`, `audit_opinion`, or `legal_opinion` statuses.

Second, the implementation should add one read-only control-plane bounded context only when an implementation prompt starts F6Q.
The likely folder is `apps/control-plane/src/modules/close-control-certification-boundary/**`.
The likely route is `GET /close-control/companies/:companyKey/certification-boundary`.
The route should parse `companyKey`, call the service, and serialize the result.
It must contain no SQL, prompt assembly, source ingest logic, finance math, report conversion, approval behavior, notification-provider logic, outbox send logic, provider credential logic, delivery scheduling, monitor rerun logic, mission creation, source mutation, certification creation, sign-off creation, attestation creation, legal/audit opinion generation, or external action execution.

Third, the service should depend only on shipped read services.
Primary reads should be F6N close/control review-summary and F6P external-provider-boundary.
F6M/F6K/F6H/F6J and latest persisted monitor posture may be carried only through existing read services if needed for context.
The service must not read report artifacts as primary input, generic chat, mission-generated prose, runtime-Codex output, release/circulation records, approval records, provider state, provider credentials, outbox jobs, external communications, demo replay runtime output, or generated prose.

Fourth, output targets should be bounded internal gates.
The expected first target families are:

- `review_summary_boundary`
- `provider_absence_boundary`
- `delivery_absence_boundary`
- `source_freshness_boundary`
- `proof_and_limitation_boundary`
- `human_review_next_step_boundary`
- `certification_absence_boundary`

Each target must include:

- evidence basis with refs back to shipped F6N/F6P read posture
- freshness or missing-source posture
- limitations
- proof posture
- internal certification-boundary review status
- human-review next step
- explicit absence facts proving no certification, close complete, sign-off, attestation, legal/audit opinion, approval, report release, report circulation, provider call, external delivery, send action, outbox send, mission, monitor rerun, runtime-Codex work, generated prose, source mutation, finance write, advice/instruction, customer-contact instruction, or autonomous action occurred

Fifth, persistence remains absent.
No database schema, migration, certification-boundary table, certification record, close-complete record, sign-off record, attestation record, legal/audit opinion record, approval record, report artifact, outbox event, source mutation record, replay event, provider job, delivery record, assurance record, or runtime-Codex artifact should be added.

## Concrete Steps

1. Add the pure domain contract in the future implementation slice.
   Likely files:
   - `packages/domain/src/close-control-certification-boundary.ts`
   - `packages/domain/src/close-control-certification-boundary.spec.ts`
   - `packages/domain/src/index.ts`

   Acceptance:
   - one company-scoped certification-boundary/readiness result
   - bounded internal target families
   - internal-only statuses such as `ready_for_certification_boundary_review`, `needs_human_review_before_certification_boundary`, and `blocked_by_evidence`
   - evidence basis, freshness or missing-source posture, limitations, proof posture, status, and human-review next step on every target
   - explicit absence boundary for certification, close-complete status, sign-off, attestation, legal opinion, audit opinion, assurance, approval, report release, report circulation, provider calls, external delivery, send action, outbox send, mission creation, monitor rerun, runtime-Codex, generated prose, source mutation, finance writes, legal/policy/payment/collection/customer-contact instruction, and autonomous action

2. Add a read-only control-plane bounded context only when implementation begins.
   Likely files:
   - `apps/control-plane/src/modules/close-control-certification-boundary/schema.ts`
   - `apps/control-plane/src/modules/close-control-certification-boundary/service.ts`
   - `apps/control-plane/src/modules/close-control-certification-boundary/formatter.ts`
   - `apps/control-plane/src/modules/close-control-certification-boundary/review-summary-targets.ts`
   - `apps/control-plane/src/modules/close-control-certification-boundary/provider-boundary-targets.ts`
   - `apps/control-plane/src/modules/close-control-certification-boundary/evidence-source-target.ts`
   - `apps/control-plane/src/modules/close-control-certification-boundary/proof-target.ts`
   - `apps/control-plane/src/modules/close-control-certification-boundary/static-boundary-targets.ts`
   - `apps/control-plane/src/modules/close-control-certification-boundary/evidence.ts`
   - `apps/control-plane/src/modules/close-control-certification-boundary/helpers.ts`
   - `apps/control-plane/src/modules/close-control-certification-boundary/routes.ts`
   - `apps/control-plane/src/modules/close-control-certification-boundary/service.spec.ts`
   - `apps/control-plane/src/modules/close-control-certification-boundary/routes.spec.ts`

   Likely route:
   - `GET /close-control/companies/:companyKey/certification-boundary`

   Acceptance:
   - service reads shipped F6N/F6P posture only, with F6M/F6K/F6H/F6J/latest monitor context only through existing reads if needed
   - route stays thin
   - company-scope mismatches fail closed
   - no direct DB writes or schema changes
   - no monitor reruns
   - no report, approval, delivery, provider, outbox, runtime, source mutation, generated prose, credential, certification, close-complete, sign-off, attestation, legal/audit opinion, assurance, or finance-action behavior
   - no changes to shipped F5, F6H, F6J, F6K, F6L, F6M, F6N, F6O, or F6P behavior

3. Keep the operator surface backend-first unless a future implementation prompt explicitly asks for a UI.
   A read-only route plus focused specs is sufficient for first acceptance.
   Do not add certification controls, sign-off controls, approval controls, close-complete controls, report-release controls, delivery controls, send buttons, scheduling controls, provider setup screens, credential forms, generated message previews, customer-contact surfaces, payment controls, or autonomous action controls.

4. Do not add a new package script, root smoke alias, eval dataset, or fixture in the first implementation unless this plan is explicitly amended.
   Prefer focused domain/control-plane specs plus the existing shipped F6 smoke/proof ladder.

5. Refresh active docs after implementation, and only after implementation behavior exists.
   Expected docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - this FP-0066 record

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
- `pnpm --filter @pocket-cto/domain exec vitest run src/external-provider-boundary.spec.ts src/close-control-review-summary.spec.ts src/delivery-readiness.spec.ts src/close-control-acknowledgement.spec.ts src/operator-readiness.spec.ts src/close-control.spec.ts src/monitoring.spec.ts src/finance-twin.spec.ts src/proof-bundle.spec.ts`
- `zsh -lc "cd apps/control-plane && pnpm exec vitest run src/modules/external-provider-boundary/**/*.spec.ts src/modules/close-control-review-summary/**/*.spec.ts src/modules/delivery-readiness/**/*.spec.ts src/modules/close-control-acknowledgement/**/*.spec.ts src/modules/operator-readiness/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/finance-twin/**/*.spec.ts src/modules/wiki/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/app.spec.ts"`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

The future implementation slice should add focused domain and control-plane specs for the new certification-boundary contract, then rerun the same shipped F6 guardrail ladder.
Do not add a new smoke alias or package script unless this plan is amended.

Implementation acceptance requires all of the following:

- one deterministic internal certification-boundary/readiness result or read model exists
- the result is derived only from shipped stored/read state
- targets are bounded internal gates, not certifications, approvals, sign-offs, attestations, report releases, provider jobs, channel sends, recipient targets, credential records, send records, delivery logs, legal opinions, audit opinions, or assurance records
- every target carries evidence basis, freshness or missing-source posture, limitations, proof posture, status, and human-review next step
- output exposes explicit absence boundaries showing no certification, close complete, sign-off, attestation, legal/audit opinion, approval, report release, report circulation, provider call, external delivery, send action, outbox send, mission creation, monitor rerun, runtime-Codex work, generated prose, source mutation, finance write, legal/policy/payment/collection/customer-contact instruction, or autonomous action occurred
- no external provider integration is added
- no email, Slack, SMS, webhook, notification provider call, provider credential flow, provider job, outbox send, scheduled notification, auto-send, report delivery, external publish behavior, approval, report, mission creation, monitor rerun, runtime-Codex drafting, generated prose, source mutation, payment behavior, accounting write, bank write, tax filing, legal advice, policy advice, collection instruction, customer-contact instruction, or autonomous action is added
- no report conversion or F5 release/circulation semantics are reused as F6Q approval/certification/sign-off semantics
- no new monitor family or discovery family is added
- shipped F5 and F6 behavior remains unchanged

## Idempotence and Recovery

The preferred F6Q implementation is retry-safe because it is read-only.
Repeated reads over the same shipped stored/read posture should produce the same certification-boundary status except for explicitly labeled read timestamps.

Raw sources, source snapshots, source files, deterministic extracts, CFO Wiki pages, Finance Twin facts, monitor results, close/control checklist posture, operator-readiness posture, acknowledgement-readiness posture, delivery-readiness posture, review-summary posture, provider-boundary posture, missions, reports, approvals, release/circulation records, source-pack fixtures, demo fixtures, outbox state, and provider state must not be mutated to make certification-boundary readiness pass.

If source state is missing, stale, failed, unsupported, partial, conflicting, or insufficient, F6Q should report that posture instead of inventing certification readiness, certification, approval, release, sign-off, legal attestation, audit opinion, assurance, close completion, external delivery permission, recipient instructions, provider authorization, or legal/audit validation.

Rollback should remove only additive F6Q certification-boundary domain/read-model/docs changes.
Rollback must leave FP-0050 through FP-0065, shipped monitor behavior, shipped alert handoff behavior, shipped checklist behavior, shipped demo replay behavior, shipped operator-readiness behavior, shipped acknowledgement-readiness behavior, shipped bank/card source-pack behavior, shipped delivery-readiness behavior, shipped review-summary behavior, shipped receivables/payables source-pack behavior, shipped provider-boundary behavior, F5 reporting/approval/release/circulation behavior, raw sources, CFO Wiki state, Finance Twin state, and GitHub/engineering-twin modules intact.
No destructive database migration belongs in F6Q.

## Artifacts and Notes

This implementation slice creates or updates:

- `plans/FP-0066-close-control-certification-boundary-foundation.md`
- `packages/domain/src/close-control-certification-boundary.ts`
- `packages/domain/src/close-control-certification-boundary.spec.ts`
- `packages/domain/src/index.ts`
- `apps/control-plane/src/modules/close-control-certification-boundary/**`
- `apps/control-plane/src/app.ts`
- `apps/control-plane/src/bootstrap.ts`
- `apps/control-plane/src/lib/types.ts`
- `README.md`
- `START_HERE.md`
- `docs/ACTIVE_DOCS.md`
- `plans/ROADMAP.md`
- `docs/ops/local-dev.md`
- `docs/ops/source-ingest-and-cfo-wiki.md`
- `docs/ops/codex-app-server.md`
- `docs/benchmarks/seeded-missions.md`
- `evals/README.md`
- one read-only route: `GET /close-control/companies/:companyKey/certification-boundary`
- no schema or migrations
- no package scripts
- no smoke commands
- no eval datasets
- no fixtures
- no implementation scaffolding
- no monitor-family or discovery-family expansion
- no runtime-Codex
- no external provider integration
- no provider credential flow
- no delivery, notification provider, outbox send, email, Slack, SMS, webhook, report, approval, mission creation, monitor rerun, monitor-result creation, source mutation, payment behavior, accounting write, bank write, tax filing, legal/policy advice, collection/customer-contact instruction, certification, sign-off, close-complete status, attestation, report release, report circulation, generated prose, legal opinion, audit opinion, assurance, or autonomous action behavior

Do not create FP-0067 in this slice.
Do not start F6R, F6S, F6T, or later plans in this slice.

## Interfaces and Dependencies

The future implementation belongs in the domain package and control-plane close/control bounded contexts only.
The web UI is out of scope for the first implementation unless a later prompt amends this plan.
The database schema is out of scope for the first implementation.
Approvals, reporting, evidence, delivery, provider, outbox, runtime-Codex, mission, monitoring, source-ingest, and Finance Twin write surfaces are dependencies only as safety boundaries unless a future plan explicitly changes scope.

Runtime-Codex remains absent.
No new environment variables are expected.
No GitHub connector work is expected.
Replay implication for the first implementation is explicit absence: the read model is derived from current stored/read posture and is not persisted as a mission replay event.
If a future plan proves persistence is needed, that plan must name replay behavior explicitly and must not create certification, approval, close-complete, sign-off, attestation, legal/audit opinion, assurance, report-release, delivery, provider-job, or outbox-send semantics.

## Outcomes & Retrospective

This plan is now the shipped F6Q implementation record.
The shipped slice adds one deterministic internal close/control certification-boundary/readiness foundation only, derived from shipped F6N/F6P read posture and exposed through `GET /close-control/companies/:companyKey/certification-boundary`.
It stayed read-only, no-schema, certification-free, close-complete-free, sign-off-free, attestation-free, legal-opinion-free, audit-opinion-free, assurance-free, approval-free, report-release-free, report-circulation-free, delivery-free, provider-call-free, provider-credential-free, provider-job-free, outbox-send-free, generated-prose-free, runtime-Codex-free, source-mutation-free, monitor-rerun-free, mission-free, finance-write-free, advice/instruction-free, non-autonomous, and monitor/discovery-family-free.

F6R additional source-pack expansion remains a later planning candidate after the existing source packs stay green and only after a new Finance Plan.
F6S actual external delivery remains later and requires a future plan proving provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send.
F6T actual certification remains later and requires a future plan proving operator need, legal boundaries, evidence boundaries, review gates, and non-advice constraints.
