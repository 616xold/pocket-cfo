# Plan F6T close/control certification safety foundation

## Purpose / Big Picture

This is the active Finance Plan for the Pocket CFO F6T implementation contract.
The target phase is `F6`, and the next implementation slice is exactly `F6T-close-control-certification-safety-foundation`.

The user-visible goal is narrow: after shipped F6A through F6U, Pocket CFO should be able to show one deterministic internal close/control certification-safety/readiness posture that a human operator can review before any later plan considers actual certification.
This is not actual certification.
It is not close complete, sign-off, attestation, legal opinion, audit opinion, assurance, approval, report release, report circulation, external delivery, provider authorization, or a legal/audit validation workflow.

Repo truth supports F6T only in this reduced shape.
F6Q already ships one deterministic internal close/control certification-boundary/readiness result over shipped F6N review-summary and F6P provider-boundary posture, with explicit no-certification, no-close-complete, no-sign-off, no-attestation, no-legal-opinion, no-audit-opinion, no-assurance, no-approval, no-report-release, no-report-circulation, no-provider, no-delivery, no-outbox, no-generated-prose, no-runtime-Codex, and no-finance-action posture.
F6S already ships one deterministic internal external-delivery human-confirmation / delivery-preflight result over shipped F6M, F6P, F6Q, and F6N posture, with explicit no-send, no-provider, no-outbox, no-report-release, no-approval, no-certification, no-close-complete, no-sign-off, no-attestation, no-legal/audit-opinion, no-generated-prose, no-runtime-Codex, and no-finance-action posture.
F6N already ships one deterministic internal close/control review-summary result over F6H, F6J, F6K, and F6M posture only.
F6L, F6O, F6R, and F6U direct source-pack proofs remain the proof guardrails for bank/card, receivables/payables, contract/obligation, and ledger/reconciliation source posture.

Actual certification remains unsafe.
The first F6T implementation must therefore be a certification-safety/readiness result that can say whether a future certification might be considered, why it remains blocked or review-only, what evidence supports the posture, what is stale or limited, and what human-review step remains.
It must also prove that no certification, close complete, sign-off, attestation, legal opinion, audit opinion, assurance, approval, report release, report circulation, external delivery, provider call, provider credential, provider job, outbox send, mission creation, monitor rerun, source mutation, generated prose, runtime-Codex work, finance write, advice, instruction, or autonomous action occurred.

GitHub connector work is explicitly out of scope.
Do not invoke GitHub Connector Guard for F6T.

## Progress

- [x] 2026-04-30T22:51:09Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-04-30T22:51:09Z Ran preflight against fetched `origin/main`, confirmed the branch is `codex/f6t-master-plan-and-doc-refresh-local-v1`, confirmed local `HEAD` matches fetched `origin/main`, confirmed the worktree was clean before edits, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-04-30T22:51:09Z Read the active doc spine, shipped FP-0066 F6Q record, shipped FP-0068 F6S record, shipped FP-0069 F6U record, package scripts, F6Q/F6S/F6P/F6N/F6M domain contracts, F6Q/F6S/F6P/F6N/F6M control-plane services and routes, approvals/reporting/outbox boundaries, and shipped source-pack proof tools.
- [x] 2026-04-30T22:51:09Z Decided actual close/control certification is still unsafe; repo truth supports only one deterministic internal certification-safety/readiness planning contract for F6T.
- [x] 2026-04-30T22:51:09Z Created this FP-0070 implementation-ready planning contract and refreshed active docs without adding code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, implementation scaffolding, provider integrations, credential scaffolding, outbox send behavior, UI, approval workflow, report-release behavior, certification behavior, or product runtime behavior.
- [x] 2026-04-30T23:07:39Z Ran the requested docs-and-plan validation ladder through `pnpm ci:repro:current`; all commands passed.

## Surprises & Discoveries

The old roadmap label `F6T - actual certification` is too broad if read literally.
The repository is not ready to certify, close the books, sign off, attest, offer legal/audit assurance, or validate actual certification.
It is ready to plan a safety/readiness layer around any later certification because F6Q already proves the certification boundary, F6S proves the external-delivery human-confirmation boundary, F6N proves internal review-summary posture, and the source-pack proof family now covers bank/card, receivables/payables, contract/obligation, and ledger/reconciliation posture.

F5 report release, report circulation, release records, circulation records, correction history, and approval records exist, but they are unsafe primary inputs for F6T.
Those seams carry report-specific approval/release/circulation semantics and must not become close/control certification, sign-off, attestation, assurance, close-complete, or legal/audit opinion semantics.

The outbox bounded context remains a placeholder.
That absence remains a safety fact for F6T and must not be filled by this slice.

The first F6T implementation does not need persistence unless a concrete blocker appears.
A derived read model is safer than a table because a persisted record could be mistaken for a certification record, approval record, close-complete record, sign-off record, attestation, assurance, legal opinion, audit opinion, report-release record, or external representation.

The tiny stale FP-0069 wording gap was only a shipped-record freshness issue.
It should be polished in this docs slice without reopening F6U or creating a separate F6U docs-only PR.

## Decision Log

Decision: proceed with `F6T-close-control-certification-safety-foundation`, not actual certification.
Rationale: shipped F6Q, F6S, F6N, and source-pack proofs give enough evidence to plan one internal safety/readiness result, but they do not prove operator need, legal boundaries, evidence boundaries, review gates, assurance constraints, or non-advice constraints for actual certification.

Decision: F6T is not actual certification in the first implementation.
Rationale: do not add certification records, certified status, certification complete, close-complete status, sign-off, attestation, assurance, legal opinion, audit opinion, legal/audit validation, or external representation.

Decision: F6T is not an approval workflow.
Rationale: no new approval kind belongs in F6T. Do not reuse F5 `report_release` or `report_circulation` semantics. The first F6T result must not imply approval, certification, close complete, sign-off, attestation, legal opinion, audit opinion, assurance, report release, report circulation, or send permission.

Decision: F6T is not report release or external delivery.
Rationale: do not add report artifact creation, report release, report circulation, external publish, email, Slack, SMS, webhook, provider calls, provider credentials, provider jobs, outbox sends, scheduled delivery, or auto-send.

Decision: F6T inputs are shipped stored/read state only.
Rationale: primary inputs may include F6Q certification-boundary posture, F6S human-confirmation posture, and F6N close/control review-summary posture. F6M delivery-readiness, F6P provider-boundary, F6H/F6J/F6K posture, latest persisted monitor results, and source/CFO Wiki freshness posture may be used only as context through shipped read services if needed. Generic chat, report artifacts as primary input, runtime-Codex, mission-generated prose, generated prose, monitor reruns, source mutation, demo replay runtime execution, provider state, provider credentials, outbox jobs, and external communications are out of scope.

Decision: the first output contract is one deterministic internal certification-safety/readiness result or read model.
Rationale: each bounded target must include evidence basis, source/freshness posture, limitations, proof posture, status, and human-review next step. The output must explicitly state that no actual certification, close complete, sign-off, attestation, assurance, legal/audit opinion, approval, report release, report circulation, delivery/send action, mission creation, legal/policy/payment/collection/customer-contact instruction, generated prose, or autonomous action occurred.

Decision: first F6T should be read-only and no-schema.
Rationale: shipped F6Q/F6S/F6N posture already exposes the necessary stored/read safety boundaries. If persistence is needed later, a future plan must justify why and keep it additive, idempotent, company-scoped, evidence-linked, and explicitly not a certification record, approval record, close-complete record, sign-off, attestation, assurance, legal opinion, audit opinion, report-release record, delivery record, provider job, outbox send, or external representation.

Decision: F6T must preserve shipped F5 and F6 behavior.
Rationale: no F5 report/release/circulation/correction changes, no monitor evaluator changes, no F6B/F6G mission changes, no F6H checklist behavior changes, no F6J readiness behavior changes, no F6K acknowledgement behavior changes, no F6L bank/card source-pack behavior changes, no F6M delivery-readiness behavior changes, no F6N review-summary behavior changes, no F6O receivables/payables source-pack behavior changes, no F6P provider-boundary behavior changes, no F6Q certification-boundary behavior changes, no F6R contract/obligation source-pack behavior changes, no F6S human-confirmation behavior changes, no F6U ledger/reconciliation source-pack behavior changes, no new approval kind, and no report conversion belong in F6T.

Decision: likely later slices are named but not created here.
Rationale: F6V actual provider integration should happen only if a future plan proves provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send. F6W additional source-pack expansion should happen only after existing source packs remain green. F6X actual certification should happen only if operator need, legal boundaries, evidence boundaries, review gates, assurance constraints, and non-advice constraints are proven. Do not create FP-0071, F6V, F6W, F6X, or later plans in this slice.

## Context and Orientation

Pocket CFO has shipped F6A through F6U.
FP-0050 through FP-0069 are shipped records.
FP-0066 is the shipped F6Q record for one deterministic internal close/control certification-boundary/readiness result only.
FP-0068 is the shipped F6S record for one deterministic internal external-delivery human-confirmation / delivery-preflight result only.
FP-0069 is the shipped F6U record for one ledger/reconciliation source-pack foundation only.

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

The relevant shipped implementation seams for F6T are:

- `packages/domain/src/close-control-certification-boundary.ts` for F6Q certification-boundary/readiness posture and no-certification/no-approval/no-release/no-delivery absence boundaries
- `packages/domain/src/external-delivery-human-confirmation-boundary.ts` for F6S human-confirmation / delivery-preflight posture and no-send/no-provider/no-outbox/no-report-release absence boundaries
- `packages/domain/src/close-control-review-summary.ts` for F6N internal close/control review posture
- `packages/domain/src/delivery-readiness.ts` for F6M delivery-readiness posture when carried through shipped reads
- `packages/domain/src/external-provider-boundary.ts` for F6P provider-boundary posture when carried through shipped reads
- `packages/domain/src/proof-bundle.ts` for proof vocabulary and F5 release/circulation facts that F6T must not use as primary inputs
- `packages/domain/src/approval.ts` for the existing approval kinds that F6T must not widen
- `apps/control-plane/src/modules/close-control-certification-boundary/**` for the shipped F6Q read-only service and route
- `apps/control-plane/src/modules/external-delivery-human-confirmation-boundary/**` for the shipped F6S read-only service and route
- `apps/control-plane/src/modules/close-control-review-summary/**`, `delivery-readiness/**`, and `external-provider-boundary/**` as upstream read seams
- `apps/control-plane/src/modules/approvals/**` and `apps/control-plane/src/modules/reporting/**` as explicit safety boundaries, not inputs to certify or approve anything
- `apps/control-plane/src/modules/outbox/README.md` as the intentionally empty send-pipeline boundary
- `tools/bank-card-source-pack-proof.mjs`, `tools/receivables-payables-source-pack-proof.mjs`, `tools/contract-obligation-source-pack-proof.mjs`, and `tools/ledger-reconciliation-source-pack-proof.mjs` as shipped source-pack validation guardrails

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No source mutation is expected.
No database schema migration, eval dataset, fixture family, package script, smoke alias, monitor family, discovery family, report, approval, delivery behavior, provider integration, provider credential storage, provider job, outbox send, payment behavior, finance write, legal/policy advice, collection/customer-contact instruction, actual certification, close-complete status, sign-off, attestation, legal opinion, audit opinion, assurance, generated prose, or autonomous action belongs in F6T.

## Plan of Work

First, the future implementation should add one pure domain contract for close/control certification-safety readiness posture.
The likely contract name is `CloseControlCertificationSafetyResult` with bounded `CloseControlCertificationSafetyTarget` entries.
The contract should include company scope, generated time, aggregate internal certification-safety review status, target list, evidence summary, limitations, and runtime/action absence boundary.
The contract must avoid `certified`, `certification_complete`, `close_complete`, `signed_off`, `attested`, `approved`, `release_ready`, `delivered`, `sent`, `assured`, `audit_opinion`, or `legal_opinion` statuses.

Second, the future implementation should add one read-only control-plane bounded context only when implementation begins.
The likely folder is `apps/control-plane/src/modules/close-control-certification-safety/**`.
The likely route is `GET /close-control/companies/:companyKey/certification-safety`.
The route should parse `companyKey`, call the service, and serialize the result.
It must contain no SQL, prompt assembly, source ingest logic, finance math, report conversion, approval behavior, notification-provider logic, provider credential logic, provider job logic, outbox send logic, delivery scheduling, monitor rerun logic, mission creation, source mutation, generated prose, certification creation, sign-off creation, attestation creation, legal/audit opinion generation, assurance creation, or external action execution.

Third, the service should depend only on shipped read services.
Primary reads should be F6Q certification-boundary, F6S human-confirmation boundary, and F6N review-summary.
F6M delivery-readiness, F6P provider-boundary, F6H checklist, F6J operator-readiness, F6K acknowledgement-readiness, and latest persisted monitor posture may be carried only through existing read services if needed for context.
The service must not read report artifacts as primary input, generic chat, mission-generated prose, runtime-Codex output, release/circulation records, approval records, provider state, provider credentials, outbox jobs, external communications, demo replay runtime output, generated prose, or source mutation output.

Fourth, output targets should be bounded internal safety targets.
The expected first target families are:

- `certification_boundary_safety`
- `human_confirmation_boundary_safety`
- `review_summary_safety`
- `source_freshness_and_lineage_safety`
- `proof_and_limitation_safety`
- `human_review_next_step_safety`
- `certification_absence_safety`

Each target must include:

- evidence basis with refs back to shipped F6Q/F6S/F6N read posture
- source lineage and freshness or missing-source posture when available
- limitations
- proof posture
- internal certification-safety review status
- human-review next step
- explicit absence facts proving no certification, close complete, sign-off, attestation, assurance, legal/audit opinion, approval, report release/circulation, provider call, external delivery, send action, outbox send, mission, monitor rerun, runtime-Codex work, generated prose, source mutation, finance write, advice/instruction, customer-contact instruction, or autonomous action occurred

Fifth, persistence remains absent.
No database schema, migration, certification-safety table, certification record, close-complete record, sign-off record, attestation record, assurance record, legal/audit opinion record, approval record, report artifact, report release record, outbox event, source mutation record, replay event, provider job, delivery record, or runtime-Codex artifact should be added.

## Concrete Steps

1. Add the pure domain contract in the future implementation slice.
   Likely files:
   - `packages/domain/src/close-control-certification-safety.ts`
   - `packages/domain/src/close-control-certification-safety.spec.ts`
   - `packages/domain/src/index.ts`

   Acceptance:
   - one company-scoped certification-safety/readiness result
   - bounded internal target families
   - internal-only statuses such as `ready_for_certification_safety_review`, `needs_human_review_before_certification_safety`, and `blocked_by_evidence`
   - evidence basis, source/freshness posture, limitations, proof posture, status, and human-review next step on every target
   - explicit absence boundary for certification, close-complete status, sign-off, attestation, assurance, legal opinion, audit opinion, approval, report release, report circulation, provider calls, external delivery, send action, outbox send, mission creation, monitor rerun, runtime-Codex, generated prose, source mutation, finance writes, legal/policy/payment/collection/customer-contact instruction, and autonomous action

2. Add a read-only control-plane bounded context only when implementation begins.
   Likely files:
   - `apps/control-plane/src/modules/close-control-certification-safety/schema.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/service.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/formatter.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/certification-boundary-targets.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/human-confirmation-targets.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/review-summary-targets.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/source-lineage-target.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/proof-target.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/static-boundary-targets.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/evidence.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/helpers.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/routes.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/service.spec.ts`
   - `apps/control-plane/src/modules/close-control-certification-safety/routes.spec.ts`

   Likely route:
   - `GET /close-control/companies/:companyKey/certification-safety`

   Acceptance:
   - service reads shipped F6Q/F6S/F6N posture only, with F6M/F6P/F6H/F6J/F6K/latest monitor context only through existing reads if needed
   - route stays thin
   - company-scope mismatches fail closed
   - no direct DB writes or schema changes
   - no monitor reruns
   - no report, approval, delivery, provider, credential, provider job, outbox, runtime, source mutation, generated prose, certification, close-complete, sign-off, attestation, legal/audit opinion, assurance, or finance-action behavior
   - no changes to shipped F5, F6H, F6J, F6K, F6L, F6M, F6N, F6O, F6P, F6Q, F6R, F6S, or F6U behavior

3. Keep the operator surface backend-first unless a future implementation prompt explicitly asks for a UI.
   A read-only route plus focused specs is sufficient for first acceptance.
   Do not add certification controls, sign-off controls, approval controls, close-complete controls, report-release controls, delivery controls, send buttons, scheduling controls, provider setup screens, credential forms, generated message previews, customer-contact surfaces, payment controls, or autonomous action controls.

4. Do not add a new package script, root smoke alias, eval dataset, fixture, provider integration, credential scaffold, outbox worker, approval workflow, report-release behavior, or certification behavior in the first implementation unless this plan is explicitly amended.
   Prefer focused domain/control-plane specs plus the existing shipped F6 smoke/proof ladder.

5. Refresh active docs after implementation, and only after implementation behavior exists.
   Expected docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - `docs/ops/codex-app-server.md`
   - this FP-0070 record

## Validation and Acceptance

This docs-and-plan thread must run the user-requested validation ladder after docs edits:

- `pnpm smoke:delivery-readiness:local`
- `pnpm smoke:operator-readiness:local`
- `pnpm smoke:close-control-acknowledgement:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
- `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`
- `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`
- `pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs`
- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:finance-twin-account-catalog:local`
- `pnpm smoke:finance-twin-general-ledger:local`
- `pnpm smoke:finance-twin:local`
- `pnpm smoke:finance-twin-reconciliation:local`
- `pnpm smoke:finance-twin-account-bridge:local`
- `pnpm smoke:finance-twin-balance-bridge-prerequisites:local`
- `pnpm smoke:finance-twin-balance-proof-lineage:local`
- `pnpm smoke:finance-twin-period-context:local`
- `pnpm smoke:finance-twin-source-backed-balance-proof:local`
- `pnpm smoke:finance-discovery-supported-families:local`
- `pnpm --filter @pocket-cto/domain exec vitest run src/external-delivery-human-confirmation-boundary.spec.ts src/close-control-certification-boundary.spec.ts src/external-provider-boundary.spec.ts src/close-control-review-summary.spec.ts src/delivery-readiness.spec.ts src/close-control-acknowledgement.spec.ts src/operator-readiness.spec.ts src/close-control.spec.ts src/monitoring.spec.ts src/finance-twin.spec.ts src/proof-bundle.spec.ts`
- `zsh -lc "cd apps/control-plane && pnpm exec vitest run src/modules/external-delivery-human-confirmation-boundary/**/*.spec.ts src/modules/close-control-certification-boundary/**/*.spec.ts src/modules/external-provider-boundary/**/*.spec.ts src/modules/close-control-review-summary/**/*.spec.ts src/modules/delivery-readiness/**/*.spec.ts src/modules/close-control-acknowledgement/**/*.spec.ts src/modules/operator-readiness/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/finance-twin/**/*.spec.ts src/modules/wiki/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/app.spec.ts"`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Future implementation acceptance requires all of the following:

- one deterministic internal certification-safety/readiness result or read model exists
- the result is derived only from shipped stored/read posture
- each bounded target includes evidence basis, source/freshness posture, limitations, proof posture, status, and human-review next step
- statuses remain review-only and do not include certified, certification complete, close complete, approved, release ready, signed off, attested, legal opinion, audit opinion, assurance, delivered, sent, or scheduled semantics
- runtime/action absence boundary proves no actual certification, close complete, sign-off, attestation, assurance, legal/audit opinion, approval, report release, report circulation, external delivery, provider call, provider credential, provider job, outbox send, generated prose, mission creation, monitor rerun/result creation, source mutation, runtime-Codex, finance write, advice/instruction, autonomous action, new monitor family, or new discovery family
- no schema, migration, package script, smoke alias, eval dataset, fixture family, UI, provider integration, credential scaffold, outbox worker, approval workflow, report-release behavior, or certification behavior is added

Human-observable acceptance for this docs-and-plan slice:

- `plans/FP-0070-close-control-certification-safety-foundation.md` exists as the active implementation-ready F6T contract
- `plans/FP-0069-ledger-reconciliation-source-pack-foundation.md` remains the shipped F6U record and no longer implies F6U implementation is pending
- active docs point future Codex threads at FP-0070 for F6T implementation only
- FP-0050 through FP-0069 remain shipped F6A through F6U records
- FP-0071 is not created
- F6V, F6W, F6X, and later plans are named only as likely later slices and are not created

## Idempotence and Recovery

This docs-and-plan slice is retry-safe because it edits only checked-in markdown.
If validation fails because of local service state, rerun the failing DB-backed smoke serially before calling it a product regression.
If a validation wrapper fails before repo commands execute, record it as a wrapper failure rather than a Pocket CFO failure.

Rollback for this docs slice should remove only FP-0070 and the active-doc references to it, plus revert the tiny FP-0069 shipped-record wording polish.
Do not remove shipped F6Q, F6S, F6U, source-pack proofs, GitHub modules, engineering-twin modules, or historical F5/F6 records.

Replay implication for F6T is explicit absence.
The future first implementation should derive a read model from current stored/read posture and should not create mission replay events, monitor results, report artifacts, approvals, delivery/outbox/provider records, certification records, generated prose, finance writes, or autonomous-action records.
If a future plan wants persisted certification-safety history, it must name that behavior explicitly and keep it separate from certification, approval, close-complete, sign-off, attestation, assurance, legal/audit opinion, report release, external delivery, and provider/outbox behavior.

## Artifacts and Notes

This docs-and-plan slice creates or updates:

- `plans/FP-0070-close-control-certification-safety-foundation.md`
- `plans/FP-0069-ledger-reconciliation-source-pack-foundation.md`
- `README.md`
- `START_HERE.md`
- `docs/ACTIVE_DOCS.md`
- `plans/ROADMAP.md`
- `docs/ops/local-dev.md`
- `docs/ops/source-ingest-and-cfo-wiki.md`
- `docs/ops/codex-app-server.md`
- `evals/README.md`
- `docs/benchmarks/seeded-missions.md`

Do not create FP-0071.
Do not start F6T implementation in this docs-and-plan slice.
Do not start F6V, F6W, F6X, or later work in this slice.

## Interfaces and Dependencies

F6T depends on the shipped internal close/control and external-delivery safety read models, source/freshness/proof posture, and source-pack proof guardrails.
It does not depend on GitHub, runtime-Codex, reports, approvals, outbox, providers, delivery, actual certification, legal/audit opinion, assurance, payment behavior, tax filing, UI, new database schema, new routes during this docs slice, new package scripts, new root smoke aliases, or new environment variables.

The control-plane route files must remain unchanged until a future implementation prompt starts F6T implementation.
If a future continuation finds it cannot derive certification-safety posture from shipped read services without persistence or side effects, stop and report the blocker instead of adding certification, approval, report-release, provider, delivery, outbox, runtime-Codex, or finance-action behavior.

## Outcomes & Retrospective

This docs-and-plan slice passed the requested validation ladder and is ready for one commit, push, and PR from `codex/f6t-master-plan-and-doc-refresh-local-v1`.
The outcome is an implementation-ready but explicitly non-certifying F6T contract.
Actual certification remains deferred to a future F6X plan only if operator need, legal boundaries, evidence boundaries, review gates, assurance constraints, and non-advice constraints are proven.
