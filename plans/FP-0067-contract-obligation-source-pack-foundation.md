# Plan F6R contract/obligation source-pack foundation

## Purpose / Big Picture

This is the active Finance Plan for the Pocket CFO F6R implementation contract.
The target phase is `F6`, and the implementation slice is exactly `F6R-contract-obligation-source-pack-foundation`.

The user-visible goal is narrow: after shipped F6A through F6Q, Pocket CFO should be able to prove one checked-in contract/obligation source-pack family through the existing source registry and Finance Twin contract/obligation routes only.
The source-pack family is limited to `contract_metadata`, the extractor key is limited to `contract_metadata_csv`, and the proof surface is limited to existing source registration/upload plus Finance Twin contract inventory and obligation-calendar sync/read routes.

Repo truth supports F6R in this reduced shape.
The shipped F6L bank/card source-pack proof is green and source-backed.
The shipped F6O receivables/payables source-pack proof is green and source-backed.
The existing contract-metadata Finance Twin sync is source-backed and green.
The obligation-calendar read posture is deterministic and green.
The shipped `obligation_calendar_review` discovery family remains supported without adding a new discovery family.
The source-pack expansion can stay fixture/manifest/proof-oriented and does not require product runtime behavior.

This plan is docs-and-plan only.
It does not implement the source pack.
It does not create FP-0068.
It does not start F6S external delivery, F6T actual certification, or later work.

GitHub connector work is explicitly out of scope.
Do not invoke GitHub Connector Guard for F6R.

## Progress

- [x] 2026-04-29T20:49:27Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-04-29T20:49:27Z Ran preflight against fetched `origin/main`, confirmed the branch is `codex/f6r-master-plan-and-doc-refresh-local-v1`, confirmed the worktree was clean, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-04-29T20:49:27Z Read the requested active docs, shipped FP-0066 record, package scripts, source-pack manifests, F6L/F6O proof tools, contract-metadata smoke, discovery supported-family smoke, source registry, Finance Twin contract/obligation surfaces, close/control certification-boundary, provider-boundary, review-summary, delivery-readiness, and monitoring boundaries.
- [x] 2026-04-29T20:49:27Z Ran decisive pre-plan checks: `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`, `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`, `pnpm smoke:finance-twin-contract-metadata:local`, and `pnpm smoke:finance-discovery-supported-families:local`; all passed.
- [x] 2026-04-29T20:49:27Z Decided repo truth supports F6R only as a contract/obligation source-pack foundation over existing source registry and Finance Twin routes.
- [x] 2026-04-29T20:59:20Z Refreshed active docs and the tiny stale FP-0066 target-family wording without adding code, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, implementation scaffolding, runtime behavior, delivery, approvals, reports, certification, monitor families, discovery families, mission behavior, or source-pack implementation.
- [x] 2026-04-29T20:59:20Z Ran the full requested docs-and-plan validation ladder through `pnpm ci:repro:current`; all commands passed.

## Surprises & Discoveries

The shipped F6Q implementation already uses the target-family vocabulary `review_summary_boundary`, `provider_boundary`, `evidence_and_source_boundary`, `proof_and_limitation_boundary`, `human_review_gate_boundary`, and `certification_absence_boundary`.
The shipped FP-0066 record still had a small stale planning line that could be read as if F6Q implementation had not happened, so this slice includes the requested tiny polish while preserving FP-0066 as the shipped F6Q record.

The contract-metadata smoke proves more than a parser happy path.
It registers source evidence, uploads a CSV, syncs through `contract_metadata_csv`, reads `/contracts` and `/obligation-calendar`, and shows fresh source-backed contract and contract-obligation lineage.

The existing `obligation_calendar_review` discovery family is already supported by stored contract/obligation state plus CFO Wiki pages.
F6R does not need a new discovery family, monitor family, mission behavior, or runtime-Codex drafting to prove a contract/obligation source pack.

## Decision Log

Decision: proceed with `F6R-contract-obligation-source-pack-foundation` instead of F6S actual external delivery or F6T actual certification.
Rationale: existing source-pack and contract/obligation proof surfaces are green and can support one more source-pack foundation safely. External delivery and actual certification remain riskier and require future plans with provider, compliance, legal, and human-review boundaries.

Decision: keep F6R to one source-pack family only.
Rationale: the first F6R contract should prove `contract_metadata` source posture, not create a broad source-pack platform or multiple fixture families.

Decision: source role is exactly `contract_metadata`, and extractor key is exactly `contract_metadata_csv`.
Rationale: these are the existing source-backed Finance Twin semantics for contract inventory and obligation-calendar state. No new extractor is needed.

Decision: F6R is not a monitor family.
Rationale: do not add `spend_posture`, `obligation_calendar_review`, or any new monitor family. The shipped monitor families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`.

Decision: F6R is not a discovery-family expansion.
Rationale: the shipped discovery families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, `spend_posture`, `obligation_calendar_review`, and `policy_lookup`. Existing `obligation_calendar_review` support is sufficient.

Decision: F6R is not external delivery.
Rationale: do not add email, Slack, SMS, webhook, notification provider calls, provider calls, provider credentials, provider jobs, outbox send behavior, report delivery, report release, report circulation, external publish behavior, or any autonomous send path.

Decision: F6R is not certification, legal advice, or an audit opinion.
Rationale: do not add actual certification, close-complete status, sign-off, attestation, legal opinion, audit opinion, assurance, approval workflow, report release, report circulation, or any legal/audit assertion.

Decision: F6R should expand source packs, not product runtime behavior.
Rationale: the later implementation slice should add one checked-in fixture/manifest family and one deterministic direct proof path. It should not add new DB tables, routes, monitor evaluators, mission behavior, runtime-Codex, package scripts, root smoke aliases, eval datasets, or product UI behavior.

Decision: likely later slices are named but not created here.
Rationale: F6S actual external delivery should happen only if a future plan proves provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send. F6T actual certification should happen only if operator need, legal boundaries, evidence boundaries, review gates, and non-advice constraints are proven. F6U additional source-pack expansion should happen only after existing source packs remain green.

## Context and Orientation

Pocket CFO has shipped F6A through F6Q:

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

The relevant implementation seams for the later F6R implementation are:

- `packages/stack-packs/src/stack-pack.ts` for the source-pack manifest contract
- `packages/stack-packs/src/packs/**` and `packages/stack-packs/src/index.ts` for a new source-pack export
- `packages/testkit/fixtures/f6r-contract-obligation-source-pack/**` for one immutable fixture family and normalized expected source/twin posture
- `tools/contract-obligation-source-pack-proof.mjs` for one direct deterministic proof path
- `apps/control-plane/src/modules/sources/**` for existing source registration and upload routes used by proof tooling only
- `apps/control-plane/src/modules/finance-twin/**` for existing `contract_metadata_csv` sync plus `/contracts` and `/obligation-calendar` reads used by proof tooling only
- `packages/domain/src/finance-twin.ts` for existing contract, contract-obligation, lineage, freshness, and extractor-key contracts
- `packages/domain/src/discovery-mission.ts` for the fixed shipped discovery family list
- `packages/domain/src/monitoring.ts` for the fixed shipped monitor family list

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No database schema migration, route, package script, smoke alias, eval dataset, product UI, monitor evaluator, mission behavior, report, approval, delivery behavior, provider integration, provider credential storage, outbox send, payment behavior, finance write, legal/policy advice, collection/customer-contact instruction, actual certification, close-complete status, sign-off, attestation, legal opinion, audit opinion, assurance, or autonomous action belongs in F6R.

## Plan of Work

First, the later implementation slice should define one contract/obligation source-pack manifest family.
The likely pack id is `pocket-cfo-contract-obligation-source-pack`.
The likely fixture directory is `packages/testkit/fixtures/f6r-contract-obligation-source-pack`.
The single source role is `contract_metadata`.
The single source kind is `dataset`.
The single media type is `text/csv`.
The single expected extractor key is `contract_metadata_csv`.

Second, the later implementation slice should add one immutable checked-in source fixture and one normalized expected source/twin posture file.
The fixture should be a static CSV such as `sources/contract-metadata.csv`.
The normalized expected posture should cover source registration, file upload, snapshot/checksum posture, sync status, extractor key, contract inventory posture, obligation-calendar posture, lineage refs, freshness state, diagnostics, limitations, fixed family boundaries, and runtime/action absence boundaries.
Expected posture must avoid volatile generated ids, timestamps, storage refs, and other values that would force mutation.

Third, the later implementation slice should add one direct deterministic proof path.
The likely command is `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`.
The proof should use existing `/sources`, `/sources/:sourceId/files`, `/finance-twin/companies/:companyKey/source-files/:sourceFileId/sync`, `/finance-twin/companies/:companyKey/contracts`, and `/finance-twin/companies/:companyKey/obligation-calendar` routes only.
It should verify raw fixture source immutability by hashing fixture bytes before and after proof execution.
It should assert that no monitor family, discovery family, route, schema, package script, root smoke alias, eval dataset, mission behavior, report, approval, delivery, runtime-Codex behavior, provider call, provider credential, source mutation outside proof upload/sync setup, finance action, generated prose, or autonomous action was added or triggered.

Fourth, the later implementation slice should update only source-pack documentation if needed.
Do not mutate existing F6L or F6O fixture semantics.
Do not add product runtime behavior.

## Concrete Steps

1. Add the source-pack manifest contract for one family only.
   Likely files:
   - `packages/stack-packs/src/stack-pack.ts`
   - `packages/stack-packs/src/packs/pocket-cfo-contract-obligation-source-pack.ts`
   - `packages/stack-packs/src/index.ts`

   Acceptance:
   - source role is exactly `contract_metadata`
   - extractor key is exactly `contract_metadata_csv`
   - manifest does not declare monitor families or discovery families
   - limitations say this is one deterministic local fixture family, not a broad source-pack platform
   - runtime/delivery/action boundary says the proof is route-driven only and remains runtime-free, delivery-free, report-free, approval-free, certification-free, provider-free, finance-write-free, advice-free, and non-autonomous

2. Add one immutable fixture family and normalized expected posture.
   Likely files:
   - `packages/testkit/fixtures/f6r-contract-obligation-source-pack/sources/contract-metadata.csv`
   - `packages/testkit/fixtures/f6r-contract-obligation-source-pack/expected-source-twin-posture.json`

   Acceptance:
   - fixture rows include deterministic contract metadata only
   - expected posture includes source registration, uploaded source file, snapshot/checksum posture, `contract_metadata_csv` sync, contract inventory, obligation calendar, source/twin lineage, freshness, diagnostics, limitations, and absence boundaries
   - raw fixture source is immutable during proof execution
   - expected posture contains no volatile generated fields
   - no existing F6L or F6O fixture semantics change

3. Add one direct deterministic proof path.
   Likely file:
   - `tools/contract-obligation-source-pack-proof.mjs`

   Expected command:
   - `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`

   Acceptance:
   - registers and uploads the checked-in contract metadata fixture through existing source registry routes
   - syncs through existing Finance Twin sync route
   - verifies `syncRun.extractorKey === "contract_metadata_csv"`
   - reads existing contract inventory and obligation-calendar routes
   - verifies source-backed freshness, contract count, obligation count, lineage target kinds, limitations, and diagnostics
   - verifies discovery family list remains exactly `cash_posture`, `collections_pressure`, `payables_pressure`, `spend_posture`, `obligation_calendar_review`, and `policy_lookup`
   - verifies monitor family list remains exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`
   - verifies no monitor run, mission, report, approval, delivery, provider call, provider credential, generated prose, runtime-Codex use, source mutation outside proof upload/sync setup, finance write, certification, close complete, sign-off, attestation, legal/audit opinion, assurance, or autonomous action occurred

4. Do not add a package script, root smoke alias, eval dataset, DB table, migration, route, monitor evaluator, mission behavior, or UI unless this plan is explicitly amended.

5. Refresh active docs after implementation, and only after implementation behavior exists.
   Expected docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - this FP-0067 record

## Validation and Acceptance

This docs-and-plan thread must run the user-requested validation ladder after docs edits:

- `pnpm smoke:delivery-readiness:local`
- `pnpm smoke:operator-readiness:local`
- `pnpm smoke:close-control-acknowledgement:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
- `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`
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

Future F6R implementation acceptance requires all of the following:

- one `pocket-cfo-contract-obligation-source-pack` manifest or equivalent source-pack contract exists
- one immutable checked-in contract metadata fixture exists
- one normalized expected source/twin posture exists
- one direct deterministic proof path exists
- proof uses existing source registry and Finance Twin contract/obligation routes only
- source role remains exactly `contract_metadata`
- extractor key remains exactly `contract_metadata_csv`
- raw fixture source immutability is proven
- normalized expected posture covers contracts, obligations, obligation-calendar freshness, lineage, limitations, and diagnostics
- no new monitor family or discovery family is added
- no product runtime behavior is added
- no package script or root smoke alias is added unless this plan is explicitly amended
- no route, schema, migration, eval dataset, monitor evaluator, mission behavior, report, approval, delivery, runtime-Codex, provider call, provider credential, generated prose, source mutation outside proof upload/sync setup, finance action, certification, close-complete status, sign-off, attestation, legal/audit opinion, assurance, or autonomous action is added
- shipped F5 and F6 behavior remains unchanged

Human-observable acceptance for this docs slice:

- `plans/FP-0067-contract-obligation-source-pack-foundation.md` exists as the one active F6R implementation-ready contract
- FP-0066 remains the shipped F6Q record with tiny stale wording corrected
- active docs point future Codex threads at FP-0067 for F6R and keep F6S/F6T/F6U as future planning only
- validation passes on the final tree

## Idempotence and Recovery

This docs-and-plan slice is retry-safe.
It changes only plan and active-doc text.
Rollback should remove this FP-0067 document and restore the touched active-doc lines, leaving FP-0050 through FP-0066, shipped F6 behavior, raw sources, source-pack fixtures, Finance Twin state, CFO Wiki state, GitHub modules, and engineering-twin modules intact.

The future F6R implementation should also be retry-safe.
Repeated proof runs may create local source and sync rows for proof companies, but they must not mutate checked-in raw fixture files or expected posture semantics.
If source state is missing, stale, failed, unsupported, partial, conflicting, or insufficient, the proof should fail or report limitations instead of inventing contract/obligation posture.

Replay implication for the future implementation is explicit absence.
The direct proof is a source registry and Finance Twin route proof, not a mission-state change and not a durable product replay event.
If a future plan wants persisted source-pack proof history, it must name that replay behavior explicitly and must not create monitor, mission, report, approval, delivery, provider, certification, close-complete, sign-off, attestation, legal/audit opinion, assurance, finance-write, or autonomous-action semantics.

## Artifacts and Notes

This docs-and-plan slice creates or updates:

- `plans/FP-0067-contract-obligation-source-pack-foundation.md`
- `plans/FP-0066-close-control-certification-boundary-foundation.md`
- `README.md`
- `START_HERE.md`
- `docs/ACTIVE_DOCS.md`
- `plans/ROADMAP.md`

The future implementation slice should create or update:

- `packages/stack-packs/src/stack-pack.ts`
- `packages/stack-packs/src/packs/pocket-cfo-contract-obligation-source-pack.ts`
- `packages/stack-packs/src/index.ts`
- `packages/testkit/fixtures/f6r-contract-obligation-source-pack/sources/contract-metadata.csv`
- `packages/testkit/fixtures/f6r-contract-obligation-source-pack/expected-source-twin-posture.json`
- `tools/contract-obligation-source-pack-proof.mjs`
- focused source-pack docs only if needed

Do not create FP-0068.
Do not start F6S, F6T, F6U, or later work in this slice.

## Interfaces and Dependencies

The future implementation belongs in stack-pack, testkit fixture, and proof-tool surfaces only.
The source registry and Finance Twin route surfaces are dependencies for proof tooling, not new product behavior.
The web UI is out of scope.
The database schema is out of scope.
Approvals, reporting, evidence, delivery, provider, outbox, runtime-Codex, mission, monitoring, close/control checklist, operator-readiness, acknowledgement-readiness, delivery-readiness, review-summary, provider-boundary, certification-boundary, and source-ingest parser internals are dependencies only as safety boundaries unless a future named plan explicitly changes scope.

Runtime-Codex remains absent.
No new environment variables are expected.
No GitHub connector work is expected.

## Outcomes & Retrospective

FP-0067 is now the active implementation-ready F6R contract for one contract/obligation source-pack foundation, while FP-0050 through FP-0066 remain shipped F6A through F6Q records.
The tiny FP-0066 polish preserves FP-0066 as the shipped F6Q record and aligns its target-family wording with the shipped F6Q domain contract.

Validation passed through the full requested ladder, including the F6L and F6O source-pack proofs, contract-metadata and supported-family smokes, monitor/discovery boundary smokes, targeted domain and control-plane tests, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
No code, schema, route, package-script, smoke, eval, fixture, runtime, delivery, approval, report, certification, monitor-family, discovery-family, mission, close/control, provider-boundary, certification-boundary, or source-pack implementation changes were made.

Recommendation: start F6R implementation next, not F6S planning, because current repo truth supports the narrow contract/obligation source-pack foundation and external delivery remains a future provider/compliance/human-confirmation planning problem.
