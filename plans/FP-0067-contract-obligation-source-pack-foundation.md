# Plan F6R contract/obligation source-pack foundation

## Purpose / Big Picture

This is the shipped Finance Plan record for the Pocket CFO F6R implementation contract.
The target phase is `F6`, and the implementation slice is exactly `F6R-contract-obligation-source-pack-foundation`.

The user-visible goal is narrow: after shipped F6A through F6Q, Pocket CFO can prove one checked-in contract/obligation source-pack family through the existing source registry and Finance Twin contract/obligation routes only.
The source-pack family is limited to `contract_metadata`, the extractor key is limited to `contract_metadata_csv`, and the proof surface is limited to existing source registration/upload plus Finance Twin contract inventory and obligation-calendar sync/read routes.

Repo truth supports F6R in this reduced shape.
The shipped F6L bank/card source-pack proof is green and source-backed.
The shipped F6O receivables/payables source-pack proof is green and source-backed.
The existing contract-metadata Finance Twin sync is source-backed and green.
The obligation-calendar read posture is deterministic and green.
The shipped `obligation_calendar_review` discovery family remains supported without adding a new discovery family.
The source-pack expansion can stay fixture/manifest/proof-oriented and does not require product runtime behavior.

This plan now records the F6R implementation.
It adds one source-pack manifest, one immutable checked-in contract-metadata CSV fixture, one normalized expected source/twin posture file, one fixture spec, and one direct deterministic proof path.
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
- [x] 2026-04-29T21:28:52Z In the implementation thread, invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-04-29T21:28:52Z Ran clean preflight on branch `codex/f6r-contract-obligation-source-pack-foundation-local-v1` against fetched `origin/main` at `42e6bec898ec19bfd504a14ce0d8b5a3cc9fb262`, confirmed GitHub auth/repo access, confirmed Docker Postgres and object storage were up, and confirmed the repo was clean before implementation.
- [x] 2026-04-29T21:28:52Z Added `pocket-cfo-contract-obligation-source-pack`, one immutable contract-metadata CSV fixture, normalized expected source/twin posture, manifest/fixture specs, and direct proof `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`.
- [x] 2026-04-29T21:28:52Z Ran narrow manifest spec, F6R fixture spec, and the new direct proof; all passed before docs closeout.
- [x] 2026-04-29T21:38:49Z Ran the full requested F6R validation ladder, shipped proof suite, twin guardrails, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed.

## Surprises & Discoveries

The shipped F6Q implementation already uses the target-family vocabulary `review_summary_boundary`, `provider_boundary`, `evidence_and_source_boundary`, `proof_and_limitation_boundary`, `human_review_gate_boundary`, and `certification_absence_boundary`.
The shipped FP-0066 record still had a small stale planning line that could be read as if F6Q implementation had not happened, so this slice includes the requested tiny polish while preserving FP-0066 as the shipped F6Q record.

The contract-metadata smoke proves more than a parser happy path.
It registers source evidence, uploads a CSV, syncs through `contract_metadata_csv`, reads `/contracts` and `/obligation-calendar`, and shows fresh source-backed contract and contract-obligation lineage.

The existing `obligation_calendar_review` discovery family is already supported by stored contract/obligation state plus CFO Wiki pages.
F6R does not need a new discovery family, monitor family, mission behavior, or runtime-Codex drafting to prove a contract/obligation source pack.

The F6O post-merge proof-alignment lesson applied cleanly.
The F6R proof reads source-file descriptors from the stack-pack manifest, treats expected posture `sourceFiles` as assertion data only, and rejects volatile generated fields in the expected posture.

The checked-in contract-metadata fixture produces four contract inventory rows and seven explicit obligation-calendar rows through existing `contract_metadata_csv` sync.
The normalized proof compares source-backed freshness, lineage presence, limitation and diagnostic presence, contract inventory posture, obligation-calendar coverage, and stable currency buckets without comparing generated ids, timestamps, storage refs, source ids, source-file ids, snapshot ids, or sync-run ids.

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
Rationale: the implementation slice adds one checked-in fixture/manifest family and one deterministic direct proof path. It does not add new DB tables, routes, monitor evaluators, mission behavior, runtime-Codex, package scripts, root smoke aliases, eval datasets, or product UI behavior.

Decision: the F6R source-pack manifest is the operational source of truth for source-file descriptors.
Rationale: proof tooling and specs use manifest `sourceFiles` for role, fixture path, source kind, media type, and expected extractor key. The expected posture file keeps `sourceFiles` only as assertion data, matching the F6O proof-alignment lesson.

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

The relevant shipped implementation seams for F6R are:

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

The shipped implementation defines one contract/obligation source-pack manifest family.
The pack id is `pocket-cfo-contract-obligation-source-pack`.
The fixture directory is `packages/testkit/fixtures/f6r-contract-obligation-source-pack`.
The single source role is `contract_metadata`.
The single source kind is `dataset`.
The single media type is `text/csv`.
The single expected extractor key is `contract_metadata_csv`.

The shipped implementation adds one immutable checked-in source fixture and one normalized expected source/twin posture file.
The fixture is `sources/contract-metadata.csv`.
The normalized expected posture covers source registration, file upload, snapshot/checksum posture, sync status, extractor key, contract inventory posture, obligation-calendar posture, lineage refs, freshness state, diagnostics, limitations, fixed family boundaries, and runtime/action absence boundaries.
Expected posture avoids volatile generated ids, timestamps, storage refs, and other values that would force mutation.

The shipped implementation adds one direct deterministic proof path.
The command is `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`.
The proof uses existing `/sources`, `/sources/:sourceId/files`, `/finance-twin/companies/:companyKey/source-files/:sourceFileId/sync`, `/finance-twin/companies/:companyKey/contracts`, and `/finance-twin/companies/:companyKey/obligation-calendar` routes only.
It verifies raw fixture source immutability by hashing fixture bytes before and after proof execution.
It asserts that no monitor family, discovery family, route, schema, package script, root smoke alias, eval dataset, mission behavior, report, approval, delivery, runtime-Codex behavior, provider call, provider credential, source mutation outside proof upload/sync setup, finance action, generated prose, certification, close-complete, sign-off, attestation, legal/audit opinion, assurance, or autonomous action was added or triggered.

The shipped implementation refreshed active docs after behavior landed.
It did not mutate existing F6F, F6L, or F6O fixture semantics.
It did not add product runtime behavior.

## Concrete Steps

1. Added the source-pack manifest contract for one family only.
   Files:
   - `packages/stack-packs/src/stack-pack.ts`
   - `packages/stack-packs/src/packs/pocket-cfo-contract-obligation-source-pack.ts`
   - `packages/stack-packs/src/index.ts`

   Acceptance:
   - source role is exactly `contract_metadata`
   - extractor key is exactly `contract_metadata_csv`
   - manifest does not declare monitor families or discovery families
   - limitations say this is one deterministic local fixture family, not a broad source-pack platform
   - runtime/delivery/action boundary says the proof is route-driven only and remains runtime-free, delivery-free, report-free, approval-free, certification-free, provider-free, finance-write-free, advice-free, and non-autonomous

2. Added one immutable fixture family and normalized expected posture.
   Files:
   - `packages/testkit/fixtures/f6r-contract-obligation-source-pack/README.md`
   - `packages/testkit/fixtures/f6r-contract-obligation-source-pack/sources/contract-metadata.csv`
   - `packages/testkit/fixtures/f6r-contract-obligation-source-pack/expected-source-twin-posture.json`
   - `packages/testkit/src/f6r-contract-obligation-source-pack.spec.ts`

   Acceptance:
   - fixture rows include deterministic contract metadata only
   - expected posture includes source registration, uploaded source file, snapshot/checksum posture, `contract_metadata_csv` sync, contract inventory, obligation calendar, source/twin lineage, freshness, diagnostics, limitations, and absence boundaries
   - manifest source-file descriptors drive fixture spec assertions and proof tooling
   - raw fixture source is immutable during tests and proof execution
   - expected posture contains no volatile generated fields
   - no existing F6F, F6L, or F6O fixture semantics changed

3. Added one direct deterministic proof path.
   File:
   - `tools/contract-obligation-source-pack-proof.mjs`

   Command:
   - `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`

   Acceptance:
   - registers and uploads the checked-in contract metadata fixture through existing source registry routes
   - syncs through existing Finance Twin sync route
   - verifies `syncRun.extractorKey === "contract_metadata_csv"`
   - reads existing contract inventory and obligation-calendar routes
   - verifies source-backed freshness, contract count, obligation count, lineage target kinds, limitations, and diagnostics
   - verifies discovery family list remains exactly `cash_posture`, `collections_pressure`, `payables_pressure`, `spend_posture`, `obligation_calendar_review`, and `policy_lookup`
   - verifies monitor family list remains exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`
   - verifies no monitor run, mission, report, approval, delivery, provider call, provider credential, provider job, generated prose, runtime-Codex use, source mutation outside proof upload/sync setup, finance write, certification, close complete, sign-off, attestation, legal/audit opinion, assurance, or autonomous action occurred

4. Did not add a package script, root smoke alias, eval dataset, DB table, migration, route, monitor evaluator, mission behavior, or UI.

5. Refreshed active docs after implementation behavior existed.
   Docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - `docs/ops/local-dev.md`
   - `docs/ops/source-ingest-and-cfo-wiki.md`
   - `docs/ops/codex-app-server.md`
   - `evals/README.md`
   - `docs/benchmarks/seeded-missions.md`
   - this FP-0067 record

## Validation and Acceptance

This implementation thread ran the user-requested validation ladder after source-pack and docs edits:

- `pnpm --filter @pocket-cto/stack-packs exec vitest run src/stack-pack.spec.ts`
- `pnpm --filter @pocket-cto/testkit exec vitest run src/f6r-contract-obligation-source-pack.spec.ts`
- `pnpm --filter @pocket-cto/stack-packs exec vitest run`
- `pnpm --filter @pocket-cto/testkit exec vitest run`
- `pnpm --filter @pocket-cto/domain exec vitest run src/finance-twin.spec.ts src/monitoring.spec.ts src/close-control.spec.ts src/operator-readiness.spec.ts src/close-control-acknowledgement.spec.ts src/delivery-readiness.spec.ts src/close-control-review-summary.spec.ts src/external-provider-boundary.spec.ts src/close-control-certification-boundary.spec.ts src/proof-bundle.spec.ts`
- `zsh -lc "cd apps/control-plane && pnpm exec vitest run src/modules/finance-twin/**/*.spec.ts src/modules/sources/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/operator-readiness/**/*.spec.ts src/modules/close-control-acknowledgement/**/*.spec.ts src/modules/delivery-readiness/**/*.spec.ts src/modules/close-control-review-summary/**/*.spec.ts src/modules/external-provider-boundary/**/*.spec.ts src/modules/close-control-certification-boundary/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/app.spec.ts"`
- `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`

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
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

F6R implementation acceptance requires all of the following:

- one `pocket-cfo-contract-obligation-source-pack` manifest exists
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
- no route, schema, migration, eval dataset, monitor evaluator, mission behavior, report, approval, delivery, runtime-Codex, provider call, provider credential, provider job, generated prose, source mutation outside proof upload/sync setup, finance action, certification, close-complete status, sign-off, attestation, legal/audit opinion, assurance, or autonomous action is added
- shipped F5 and F6 behavior remains unchanged

Human-observable acceptance for this implementation slice:

- `pocket-cfo-contract-obligation-source-pack` exists as one source-pack manifest family
- `packages/testkit/fixtures/f6r-contract-obligation-source-pack/sources/contract-metadata.csv` exists as an immutable raw source fixture
- `tools/contract-obligation-source-pack-proof.mjs` proves normalized source/twin posture through existing source registry and Finance Twin contract/obligation routes only
- active docs point future Codex threads at shipped FP-0067 for F6R and keep F6S/F6T/F6U as future planning only
- validation passes on the final tree

## Idempotence and Recovery

This implementation slice is retry-safe.
Repeated proof runs may create local source and sync rows for proof companies, but they must not mutate checked-in raw fixture files or expected posture semantics.
If source state is missing, stale, failed, unsupported, partial, conflicting, or insufficient, the proof should fail or report limitations instead of inventing contract/obligation posture.

Rollback should remove the F6R source-pack manifest, fixture, proof, spec, and active-doc closeout edits, leaving FP-0050 through FP-0066, shipped F6 behavior, F6F/F6L/F6O raw fixture sources, Finance Twin state, CFO Wiki state, GitHub modules, and engineering-twin modules intact.

Replay implication for F6R is explicit absence.
The direct proof is a source registry and Finance Twin route proof, not a mission-state change and not a durable product replay event.
If a future plan wants persisted source-pack proof history, it must name that replay behavior explicitly and must not create monitor, mission, report, approval, delivery, provider, certification, close-complete, sign-off, attestation, legal/audit opinion, assurance, finance-write, or autonomous-action semantics.

## Artifacts and Notes

This implementation slice creates or updates:

- `plans/FP-0067-contract-obligation-source-pack-foundation.md`
- `packages/stack-packs/src/stack-pack.ts`
- `packages/stack-packs/src/packs/pocket-cfo-contract-obligation-source-pack.ts`
- `packages/stack-packs/src/index.ts`
- `packages/stack-packs/src/stack-pack.spec.ts`
- `packages/testkit/fixtures/f6r-contract-obligation-source-pack/README.md`
- `packages/testkit/fixtures/f6r-contract-obligation-source-pack/sources/contract-metadata.csv`
- `packages/testkit/fixtures/f6r-contract-obligation-source-pack/expected-source-twin-posture.json`
- `packages/testkit/src/f6r-contract-obligation-source-pack.spec.ts`
- `tools/contract-obligation-source-pack-proof.mjs`
- `README.md`
- `START_HERE.md`
- `docs/ACTIVE_DOCS.md`
- `plans/ROADMAP.md`
- `docs/ops/local-dev.md`
- `docs/ops/source-ingest-and-cfo-wiki.md`
- `docs/ops/codex-app-server.md`
- `evals/README.md`
- `docs/benchmarks/seeded-missions.md`

This F6R slice did not create FP-0068.
A later docs-and-plan slice may create FP-0068 only as a separate active plan; F6R itself still did not start F6S, F6T, F6U, or later work.

## Interfaces and Dependencies

The implementation belongs in stack-pack, testkit fixture, and proof-tool surfaces only.
The source registry and Finance Twin route surfaces are dependencies for proof tooling, not new product behavior.
The web UI is out of scope.
The database schema is out of scope.
Approvals, reporting, evidence, delivery, provider, outbox, runtime-Codex, mission, monitoring, close/control checklist, operator-readiness, acknowledgement-readiness, delivery-readiness, review-summary, provider-boundary, certification-boundary, and source-ingest parser internals are dependencies only as safety boundaries unless a future named plan explicitly changes scope.

Runtime-Codex remains absent.
No new environment variables are expected.
No GitHub connector work is expected.

## Outcomes & Retrospective

FP-0067 is now the shipped F6R record for one contract/obligation source-pack foundation, while FP-0050 through FP-0066 remain shipped F6A through F6Q records.
F6R shipped one checked-in contract/obligation source-pack fixture and manifest family only.

Validation passed through the full requested ladder, including the new F6R proof, the F6L and F6O source-pack proofs, contract-metadata and supported-family smokes, monitor/discovery boundary smokes, targeted domain and control-plane tests, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
No schema, route, package-script, smoke alias, eval dataset, runtime, delivery, approval, report, certification, monitor-family, discovery-family, mission, close/control behavior, provider-boundary behavior, certification-boundary behavior, F6S implementation, or autonomous behavior was added.

Subsequent handoff note: `plans/FP-0068-external-delivery-human-confirmation-boundary-foundation.md` now exists as the active F6S planning contract for a non-sending internal human-confirmation boundary only.
No F6S implementation should start from FP-0067.
