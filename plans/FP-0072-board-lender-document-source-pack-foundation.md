# Plan F6Y board/lender document source-pack foundation

## Purpose / Big Picture

This is the shipped Finance Plan record for the Pocket CFO F6Y implementation slice.
The target phase is `F6`, and the implementation slice is exactly `F6Y-board-lender-document-source-pack-foundation`.

The user-visible goal is narrow: after shipped F6A through F6W, F6Y shipped one additional checked-in document source-pack family for board and lender documents using existing source registry and CFO Wiki bind, compile, and read routes only.
F6Y shipped source-pack proof posture only.
It did not implement product runtime behavior.

Repo truth supports this reduced F6Y shape because the shipped F6L, F6O, F6R, F6U, F6W, and F6Y source-pack proofs are green; the shipped F6T certification-safety posture is green and non-certifying; the CFO Wiki source binding, compile, source-list, source-digest, source-coverage, index/log, and page-read surfaces are green; and `board_material` plus `lender_document` are already domain-supported CFO Wiki document roles on the generic document bind/extract/source-digest path.
Future slices must preserve that posture rather than widening it.

GitHub connector work is explicitly out of scope.
Do not invoke GitHub Connector Guard for F6Y.

## Progress

- [x] 2026-05-02T10:20:46Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-05-02T10:20:46Z Ran preflight against fetched `origin/main`, confirmed the branch is `codex/f6y-master-plan-and-doc-refresh-local-v1`, confirmed local `HEAD` matched fetched `origin/main`, confirmed the worktree was clean before edits, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-05-02T11:30:20Z Re-ran implementation preflight against fetched `origin/main`, confirmed the implementation branch is `codex/f6y-board-lender-document-source-pack-foundation-local-v1`, confirmed the worktree was clean before edits, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-05-02T10:20:46Z Read the active doc spine, shipped FP-0071 F6W record, shipped FP-0070 F6T record, shipped FP-0069 F6U record, package scripts, CFO Wiki/source registry/monitoring/close-control/Finance Twin domain contracts, shipped source-pack manifests and proofs, CFO Wiki document compile/read tooling, and relevant control-plane modules across sources, wiki, discovery, monitoring, close/control, delivery, provider, reporting, approvals, and outbox.
- [x] 2026-05-02T10:20:46Z Ran the F6Y readiness gate before writing this plan: all shipped source-pack proofs, CFO Wiki smokes, policy lookup, policy/covenant monitor, close/control/delivery/operator/acknowledgement smokes, monitor replay, supported discovery families, focused domain and control-plane specs, lint, typecheck, test, and `pnpm ci:repro:current` passed.
- [x] 2026-05-02T10:20:46Z Decided F6Y is the safest next planning slice, ahead of F6V actual provider integration and F6X actual certification, because it can remain one deterministic source-pack family using already shipped document-source and CFO Wiki surfaces.
- [x] 2026-05-02T10:20:46Z Created this FP-0072 planning contract without adding code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, implementation scaffolding, provider integrations, credential scaffolding, outbox send behavior, UI, approval workflow, report-release behavior, certification behavior, or product runtime behavior.
- [x] 2026-05-02T10:37:11Z Ran the final docs-and-plan validation ladder after active-doc updates: all requested source-pack proofs, DB-backed smokes, focused vitest suites, lint, typecheck, test, and `pnpm ci:repro:current` passed.
- [x] 2026-05-02T11:30:20Z Added `pocket-cfo-board-lender-document-source-pack`, immutable F6Y board/lender markdown/plain-text fixtures, normalized expected source/wiki posture, focused manifest/fixture specs, and `tools/board-lender-document-source-pack-proof.mjs`.
- [x] 2026-05-02T11:30:20Z Ran the new direct proof `pnpm exec tsx tools/board-lender-document-source-pack-proof.mjs`; it proved existing source registry upload/registration, CFO Wiki bind/compile/read posture, raw fixture immutability, fixed monitor/discovery family boundaries, and runtime/report/action absence boundaries.
- [x] 2026-05-02T11:48:23Z Completed the full F6Y validation ladder through focused specs, all requested shipped proofs and DB-backed smokes, reporting/approval safety specs, twin guardrails, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed, with no outbox specs present in the current checkout.
- [x] 2026-05-02T12:17:00Z Applied post-merge proof-posture polish by renaming the normalized F6Y source-digest-link field from an index-attributed name to `sourceCoverageLinksToCurrentSourceDigests`, reflecting that the proof checks current source digest links on the source coverage page while leaving F6Y behavior unchanged.

## Surprises & Discoveries

The repo already has the document boundary F6Y needs.
`board_material` and `lender_document` are existing CFO Wiki document roles, `document` is an existing source kind, and deterministic CFO Wiki document extraction already supports markdown and plain text while keeping unsupported documents visible as gaps.

The current source-digest compiler is generic across bound document sources.
It does not require a policy page for board or lender documents, and F6Y must not create one unless a future plan explicitly changes CFO Wiki semantics.

The shipped CFO Wiki document-pages smoke and specs already exercise board-material posture, and the same domain schema plus generic bind/extract/source-digest path supports lender-document bindings.
F6Y closed the proof gap with a deterministic source-pack proof that covers both roles, rather than by adding routes or schema.

The shipped F5 board-packet and lender-update paths are report artifact paths.
F6Y must not treat those report artifacts as primary inputs or create new board packets, lender updates, release records, circulation records, approvals, or delivery artifacts.

The existing CFO Wiki bind route requires a persisted finance company.
The F6Y proof may seed a deterministic demo finance company row as proof setup only if needed by that existing route; this would not be product runtime behavior, a new route, or source-pack behavior beyond setup.

## Decision Log

Decision: proceed with `F6Y-board-lender-document-source-pack-foundation`, not F6V provider integration and not F6X actual certification.
Rationale: F6Y can be one deterministic source-pack family using existing source registry and CFO Wiki routes. F6V still needs future proof of provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send. F6X still needs future proof of operator need, legal boundaries, evidence boundaries, review gates, assurance constraints, and non-advice constraints.

Decision: F6Y is not a monitor family.
Rationale: do not add monitor families, discovery families, or monitor evaluator semantics. The shipped monitor families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`. The shipped discovery families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, `spend_posture`, `obligation_calendar_review`, and `policy_lookup`. F6Y must not create monitor results as part of checklist, readiness, acknowledgement, delivery-readiness, review-summary, provider-boundary, certification-boundary, human-confirmation, certification-safety, or source-pack proof paths.

Decision: F6Y is not external delivery.
Rationale: do not add email, Slack, SMS, webhook, notification provider calls, provider calls, provider credentials, provider jobs, outbox send behavior, scheduled delivery, auto-send, report delivery, report release, report circulation, or external publish behavior.

Decision: F6Y is not reporting, approval, certification, legal advice, audit opinion, or report release.
Rationale: do not add report artifact creation, board packet creation, lender update creation, actual certification, certified status, close-complete status, sign-off, attestation, assurance, legal opinion, audit opinion, approval workflow, report release, report circulation, legal advice, or policy advice.

Decision: F6Y expands source packs, not product runtime behavior.
Rationale: the implementation defines one checked-in board/lender document source-pack manifest and fixture family with source file list, source roles/descriptors, document role, source kind, media type, expected CFO Wiki document extract posture, expected source digest posture, expected source coverage posture, expected limitations, and absence boundaries. It proves raw fixture source immutability and adds no DB tables, routes, monitor evaluators, mission behavior, UI, package scripts, root smoke aliases, eval datasets, provider integrations, outbox behavior, runtime-Codex, delivery, reports, approvals, certification, close-complete, sign-off, attestation, legal/audit opinion, finance-action behavior, or source mutation outside proof upload/bind/compile setup.

Decision: F6Y source scope is intentionally narrow.
Rationale: source-pack family count is exactly one, source kind is exactly `document`, document roles are exactly `board_material` and `lender_document`, and media types are limited to `text/markdown` and `text/plain` unless this plan is explicitly amended after repo truth proves another deterministic document path. The current `application/pdf` posture remains unsupported-document visibility, not a F6Y proof target.

Decision: F6Y inputs are fixture and proof inputs only.
Rationale: allowed inputs for the implementation are checked-in static board/lender document fixture files, expected normalized source/wiki posture, existing source registration/upload routes in proof tooling only, existing CFO Wiki bind/compile/read routes in proof tooling only, and existing reporting, close/control, provider-boundary, certification-boundary, human-confirmation, certification-safety, source-list, source-digest, source-coverage, index/log, and page-read surfaces as validation context only. Generic chat, report artifacts as primary input, runtime-Codex, mission-generated prose, generated prose, monitor reruns, provider state, provider credentials, outbox jobs, external communications, and source mutation beyond proof upload/bind/compile setup are out of scope.

Decision: F6Y output contract is one source-pack manifest/fixture contract plus one deterministic direct proof path.
Rationale: the expected posture includes source file list, source roles/descriptors, document role, source kind, media type, expected CFO Wiki document extract posture, expected source digest posture, expected source coverage posture, source-list posture, freshness posture, limitations, absence boundaries, raw fixture immutability, and fixed monitor/discovery family boundaries. It adds no new monitor result semantics, checklist item families, readiness behavior, acknowledgement behavior, delivery-readiness behavior, review-summary behavior, provider-boundary behavior, certification-boundary behavior, human-confirmation behavior, certification-safety behavior, investigation behavior, reporting behavior, legal advice, or policy advice.

Decision: F6Y board/lender documents are raw source roles, not report outputs.
Rationale: `board_material` and `lender_document` describe the source document role bound into the CFO Wiki. They must not imply creation of a `board_packet`, `lender_update`, report release, report circulation, approval, delivery, generated prose, legal interpretation, or policy recommendation.

Decision: F6Y preserves shipped F5 and F6 behavior.
Rationale: no F5 report/release/circulation/correction changes, no monitor evaluator changes, no F6B/F6G mission changes, no F6H checklist behavior changes, no F6J readiness behavior changes, no F6K acknowledgement behavior changes, no F6L/F6O/F6R/F6U/F6W source-pack behavior changes, no F6M delivery-readiness behavior changes, no F6N review-summary behavior changes, no F6P provider-boundary behavior changes, no F6Q certification-boundary behavior changes, no F6S human-confirmation behavior changes, no F6T certification-safety behavior changes, no new approval kind, and no report conversion belong in F6Y.

Decision: later slices are named but not created here.
Rationale: F6V actual provider integration should happen only if a future plan proves provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send. F6X actual certification should happen only if a future plan proves operator need, legal boundaries, evidence boundaries, review gates, assurance constraints, and non-advice constraints. F6Z final F6/v1 exit audit should happen only after source-pack and safety-boundary docs are fresh. Do not create FP-0073 in this slice.

## Context and Orientation

Pocket CFO has shipped F6A through F6Y.
FP-0050 through FP-0072 are shipped records.
This FP-0072 file is the shipped F6Y source-pack implementation record.

The shipped source-pack foundation records are:

- FP-0061 / F6L: one bank/card source-pack foundation with direct proof `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`.
- FP-0064 / F6O: one receivables/payables source-pack foundation with direct proof `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`.
- FP-0067 / F6R: one contract/obligation source-pack foundation with direct proof `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`.
- FP-0069 / F6U: one ledger/reconciliation source-pack foundation with direct proof `pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs`.
- FP-0071 / F6W: one policy/covenant document source-pack foundation with direct proof `pnpm exec tsx tools/policy-covenant-document-source-pack-proof.mjs`.
- FP-0072 / F6Y: one board/lender document source-pack foundation with direct proof `pnpm exec tsx tools/board-lender-document-source-pack-proof.mjs`.

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

The existing CFO Wiki document roles are:

- `general_document`
- `policy_document`
- `board_material`
- `lender_document`

The existing CFO Wiki document extract kinds are:

- `markdown_text`
- `plain_text`
- `pdf_text`
- `unsupported_document`

The relevant shipped source and wiki seams for F6Y are:

- `packages/domain/src/source-registry.ts` for `document` source kind, snapshots, source files, checksums, provenance, and immutable raw source posture.
- `packages/domain/src/cfo-wiki.ts` for `board_material`, `lender_document`, `markdown_text`, `plain_text`, source-list views, source digest pages, source coverage, freshness, and limitations.
- `apps/control-plane/src/modules/sources/**` for existing source registration and raw source-file upload routes used by proof tooling only.
- `apps/control-plane/src/modules/wiki/**` for existing source binding, deterministic markdown/plain-text extract, compile, source-list, source-digest, source-coverage, index/log, and page-read routes used by proof tooling only.
- `apps/control-plane/src/modules/reporting/**`, `apps/control-plane/src/modules/approvals/**`, `apps/control-plane/src/modules/delivery-readiness/**`, `apps/control-plane/src/modules/external-provider-boundary/**`, `apps/control-plane/src/modules/close-control-certification-safety/**`, and related close/control boundary modules for validation context only.

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No database schema migration, eval dataset, package script, smoke alias, provider integration, credential scaffold, outbox behavior, report, approval, delivery behavior, certification, close-complete status, sign-off, attestation, legal/audit opinion, assurance, generated prose, finance write, payment behavior, legal/policy advice, collection/customer-contact instruction, or autonomous action belongs in F6Y.

## Plan of Work

This implementation slice shipped F6Y.
The implementation stayed within this contract after a clean preflight and readiness review.

First, F6Y adds one board/lender document source-pack manifest contract beside the shipped source-pack manifests.
The source-pack family is named `pocket-cfo-board-lender-document-source-pack`.
It includes exactly two document source roles: `board_material` and `lender_document`.
It includes source kind `document`, document roles `board_material` and `lender_document`, media types `text/markdown` and `text/plain`, and expected document kinds `markdown_text` and `plain_text`.
It does not declare monitor families, discovery families, extractor keys, provider targets, delivery targets, approval targets, report targets, certification targets, runtime-Codex targets, or action targets.

Second, F6Y adds one checked-in immutable fixture directory.
The fixture contains static markdown and/or plain-text board and lender document source files plus one normalized expected source/wiki posture file.
The fixture content describes finance document posture only as source-pack evidence, not as board advice, lender advice, legal advice, policy advice, report prose, certification language, approval language, or delivery text.
The expected posture avoids generated IDs, timestamps, storage refs, or any other volatile fields.

Third, F6Y adds one direct deterministic proof tool.
The proof uses only existing `/sources`, `/sources/:sourceId/files`, `/cfo-wiki/companies/:companyKey/sources/:sourceId/bind`, `/cfo-wiki/companies/:companyKey/compile`, `/cfo-wiki/companies/:companyKey/sources`, and `/cfo-wiki/companies/:companyKey/pages/*` routes to register/upload/bind/compile/read the fixture documents.
It verifies source-list, source-digest, source-coverage, index/log, and page-read posture.
It reads shipped reporting, close/control, delivery-readiness, provider-boundary, certification-boundary, human-confirmation, and certification-safety surfaces as validation context only.
It does not create reports, approvals, delivery records, provider records, certification records, missions, monitor results, generated prose, runtime-Codex threads, or finance actions.

Fourth, the proof asserts absence boundaries.
It verifies raw fixture source immutability, no monitor or discovery family expansion, no monitor evaluator changes, no mission creation, no report artifacts, no board packets, no lender updates, no approvals, no delivery/outbox/provider behavior, no certification/sign-off/attestation/legal/audit opinion/assurance artifacts, no generated prose, no runtime-Codex threads, no source mutation outside proof upload/bind/compile setup, no finance writes, and no autonomous action.

Fifth, active docs were refreshed after implementation existed and the direct proof passed.
The implementation did not add a package script, root smoke alias, eval dataset, route, schema, migration, UI, provider integration, credential scaffold, report release, report circulation, approval workflow, or product runtime behavior unless this plan is explicitly amended before code changes.

## Concrete Steps

1. Add the source-pack manifest and type.

   Files:
   - `packages/stack-packs/src/stack-pack.ts`
   - `packages/stack-packs/src/packs/pocket-cfo-board-lender-document-source-pack.ts`
   - `packages/stack-packs/src/index.ts`

   Acceptance:
   - source-pack id is `pocket-cfo-board-lender-document-source-pack`
   - source roles are exactly `board_material` and `lender_document`
   - document roles are exactly `board_material` and `lender_document`
   - source kind is exactly `document`
   - media types are exactly `text/markdown` and `text/plain`
   - no extractor keys are required or declared
   - no monitor families or discovery families are declared
   - limitations state that the pack is one deterministic local fixture family, not a board-packet or lender-update system and not product runtime behavior

2. Add the checked-in fixture family.

   Files:
   - `packages/testkit/fixtures/f6y-board-lender-document-source-pack/README.md`
   - `packages/testkit/fixtures/f6y-board-lender-document-source-pack/sources/board-material.md`
   - `packages/testkit/fixtures/f6y-board-lender-document-source-pack/sources/lender-document.txt`
   - `packages/testkit/fixtures/f6y-board-lender-document-source-pack/expected-source-wiki-posture.json`

   Acceptance:
   - raw fixture sources are immutable and non-empty
   - expected posture includes no volatile IDs, timestamps, generated values, or storage refs
   - expected posture includes source file descriptors, source kind, document roles, media types, bound-source posture, deterministic extract posture, source digest posture, source coverage posture, source-list posture, limitations, family boundary, runtime/action absence boundary, and proof boundaries
   - fixture text stays evidence posture only and does not provide legal advice, policy advice, certification language, approval language, external delivery text, generated prose, collection/customer-contact instructions, payment instructions, board packet prose, lender update prose, or autonomous action instructions

3. Add the deterministic proof tool.

   File:
   - `tools/board-lender-document-source-pack-proof.mjs`

   Acceptance:
   - proof registers source documents through existing source routes only
   - proof uploads markdown/plain-text fixture files through existing source-file registration only
   - proof binds each source through the existing CFO Wiki bind route only
   - proof compiles and reads existing CFO Wiki pages only
   - proof compares normalized actual source/wiki posture to checked-in expected posture
   - proof asserts raw fixture source hashes are unchanged after execution
   - proof asserts fixed monitor/discovery family boundaries
   - proof asserts no runtime/delivery/provider/report/approval/certification/mission/monitor/generated-prose/source-mutation/finance-action side effects beyond proof upload/bind/compile setup

4. Add focused specs only if the manifest/type shape changes require them.
   Keep tests scoped to the new source-pack contract and proof behavior.
   Do not widen unrelated modules.

5. Refresh active docs after implementation.

   Expected docs:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - `docs/ops/source-ingest-and-cfo-wiki.md`
   - `docs/ops/local-dev.md`
   - `docs/ops/codex-app-server.md`
   - this FP-0072 record

## Validation and Acceptance

This plan ran the readiness gate before implementation and now records the shipped F6Y proof path:

- `pnpm exec tsx tools/policy-covenant-document-source-pack-proof.mjs`
- `pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs`
- `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
- `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`
- `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`
- `pnpm smoke:cfo-wiki-foundation:local`
- `pnpm smoke:cfo-wiki-document-pages:local`
- `pnpm smoke:cfo-wiki-lint-export:local`
- `pnpm smoke:cfo-wiki-concept-metric-policy:local`
- `pnpm smoke:finance-policy-lookup:local`
- `pnpm smoke:policy-covenant-threshold-monitor:local`
- `pnpm smoke:close-control-checklist:local`
- `pnpm smoke:delivery-readiness:local`
- `pnpm smoke:operator-readiness:local`
- `pnpm smoke:close-control-acknowledgement:local`
- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:finance-discovery-supported-families:local`
- `pnpm --filter @pocket-cto/domain exec vitest run src/cfo-wiki.spec.ts src/source-registry.spec.ts src/monitoring.spec.ts src/close-control.spec.ts src/close-control-certification-safety.spec.ts src/external-delivery-human-confirmation-boundary.spec.ts src/close-control-certification-boundary.spec.ts src/external-provider-boundary.spec.ts src/close-control-review-summary.spec.ts src/delivery-readiness.spec.ts src/proof-bundle.spec.ts`
- `zsh -lc "cd apps/control-plane && pnpm exec vitest run src/modules/wiki/**/*.spec.ts src/modules/sources/**/*.spec.ts src/modules/finance-discovery/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/close-control-certification-safety/**/*.spec.ts src/modules/external-delivery-human-confirmation-boundary/**/*.spec.ts src/modules/close-control-certification-boundary/**/*.spec.ts src/modules/external-provider-boundary/**/*.spec.ts src/modules/close-control-review-summary/**/*.spec.ts src/modules/delivery-readiness/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/app.spec.ts"`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

The F6Y implementation validation includes the same ladder plus `pnpm exec tsx tools/board-lender-document-source-pack-proof.mjs`.

Implementation acceptance requires all of the following:

- one `pocket-cfo-board-lender-document-source-pack` manifest exists
- one immutable checked-in board/lender document fixture family exists
- one normalized expected source/wiki posture exists and is stable
- one direct deterministic proof path exists
- proof uses only existing source registry and CFO Wiki bind/compile/read routes
- proof verifies markdown/plain-text `board_material` and `lender_document` extract posture
- proof verifies source digest posture, source-list posture, source coverage posture, freshness posture, limitations, and absence boundaries
- proof verifies raw fixture source immutability
- proof verifies no new monitor or discovery families
- proof verifies no route, schema, migration, package script, root smoke alias, eval dataset, mission behavior, checklist/readiness/acknowledgement/delivery-readiness/review-summary/provider-boundary/certification-boundary/human-confirmation/certification-safety behavior, report, board packet, lender update, approval, report release, report circulation, delivery, provider call, provider credential, provider job, outbox send, runtime-Codex, generated prose, source mutation outside proof upload/bind/compile setup, finance write, advice/instruction, payment behavior, tax filing, legal/audit opinion, certification, close-complete status, sign-off, attestation, assurance, autonomous action, or UI is added

Human-observable acceptance for this shipped F6Y slice:

- `plans/FP-0072-board-lender-document-source-pack-foundation.md` is the shipped F6Y record
- `plans/FP-0071-policy-covenant-document-source-pack-foundation.md` remains the shipped F6W record
- active docs record FP-0072 as shipped F6Y truth and FP-0071 as shipped F6W truth
- FP-0050 through FP-0072 remain shipped F6A through F6Y records
- no FP-0073 is created
- F6Y shipped as one board/lender document source-pack foundation only
- F6V, F6X, F6Z, and later plans are named only as likely later slices and are not created

## Idempotence and Recovery

This implementation slice is retry-safe because it uses static fixture files, object-store source uploads, CFO Wiki source bindings, deterministic compile/read routes, and normalized expected-output comparison.
If a proof run creates additional source uploads, source bindings, or compile runs, rerunning should still normalize away volatile IDs and timestamps and compare only stable posture.
Raw checked-in fixture files must never be rewritten by proof tooling.

If needed, the proof may seed the deterministic demo finance company row as proof setup only because the existing CFO Wiki bind route requires an existing company.
That seed is not product runtime behavior, not a new route, and not source-pack behavior beyond proof setup.

Rollback for the implementation is simple: remove only the F6Y manifest, fixture family, proof tool, focused tests, and docs changes from the implementation branch.
Do not remove shipped F6L/F6O/F6R/F6U/F6W source packs, shipped CFO Wiki routes, shipped F5 reporting paths, shipped F6 boundary reads, GitHub modules, engineering-twin modules, or historical F5/F6 records.

Replay implication for F6Y is explicit absence.
The implementation proof may create source upload, source binding, and CFO Wiki compile records as proof setup, but it must not create mission replay events, monitor results, report artifacts, board packets, lender updates, approvals, report release/circulation records, delivery/outbox/provider records, certification records, generated prose, finance writes, or autonomous-action records.
If a later plan wants persisted source-pack proof history, it must name that behavior explicitly and keep it separate from runtime product behavior.

## Artifacts and Notes

This implementation slice creates or updates only:

- `plans/FP-0072-board-lender-document-source-pack-foundation.md`
- `packages/stack-packs/src/stack-pack.ts`
- `packages/stack-packs/src/packs/pocket-cfo-board-lender-document-source-pack.ts`
- `packages/stack-packs/src/index.ts`
- `packages/stack-packs/src/stack-pack.spec.ts`
- `packages/testkit/fixtures/f6y-board-lender-document-source-pack/README.md`
- `packages/testkit/fixtures/f6y-board-lender-document-source-pack/sources/board-material.md`
- `packages/testkit/fixtures/f6y-board-lender-document-source-pack/sources/lender-document.txt`
- `packages/testkit/fixtures/f6y-board-lender-document-source-pack/expected-source-wiki-posture.json`
- `packages/testkit/src/f6y-board-lender-document-source-pack.spec.ts`
- `tools/board-lender-document-source-pack-proof.mjs`
- `README.md`
- `START_HERE.md`
- `docs/ACTIVE_DOCS.md`
- `plans/ROADMAP.md`
- `docs/ops/local-dev.md`
- `docs/ops/source-ingest-and-cfo-wiki.md`
- `docs/ops/codex-app-server.md`
- `evals/README.md`
- `docs/benchmarks/seeded-missions.md`

This implementation slice adds source-pack code, fixtures, tests, proof tooling, and docs only; it does not add routes, schema, migrations, package scripts, smoke commands, eval datasets, provider integrations, credential scaffolding, outbox send behavior, UI, approval workflow, report-release behavior, certification behavior, or product runtime behavior.

Do not create FP-0073.
Do not start F6V, F6X, F6Z, or later work in this slice.

## Interfaces and Dependencies

F6Y depends on the existing source registry, source-file object storage, CFO Wiki source binding, deterministic markdown/plain-text document extraction, source digest page compilation, source coverage, source-list reads, index/log reads, shipped source-pack proof conventions, and shipped F5/F6 boundary reads as validation context only.
It does not depend on GitHub, runtime-Codex, reports, approvals, outbox, providers, delivery, actual certification, legal/audit opinion, assurance, payment behavior, tax filing, UI, new database schema, new routes, new package scripts, new root smoke aliases, or new environment variables.

Route files must remain unchanged unless this plan is explicitly amended.
If a later continuation finds it cannot extend this source-pack posture using only named existing source registry and CFO Wiki routes, stop and create or amend a Finance Plan instead of adding runtime behavior.

## Outcomes & Retrospective

This implementation slice ships F6Y because repo truth supports a safe board/lender document source-pack foundation through existing source and CFO Wiki routes.
F6Y remains one deterministic source-pack implementation slice and keeps provider integration, actual certification, external delivery, approvals, reports, runtime-Codex, monitor families, discovery families, generated prose, and autonomous actions out of scope.

Recommendation: do not start F6V provider integration, F6X actual certification, F6Z exit audit, or later work until a new Finance Plan names that scope. If review finds another F6Y truthfulness gap, continue with one more narrow F6Y follow-up instead of widening into provider, certification, or delivery behavior.
