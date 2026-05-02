# Plan F6W policy/covenant document source-pack foundation

## Purpose / Big Picture

This is now the shipped Finance Plan record for the Pocket CFO F6W implementation contract.
The target phase is `F6`, and the implementation slice is exactly `F6W-policy-covenant-document-source-pack-foundation`.

The user-visible goal was narrow: after shipped F6A through F6T and F6U, Pocket CFO can prove one additional checked-in source-pack family for policy/covenant documents using the existing source registry and CFO Wiki bind, compile, and read routes only.
The source-pack family is limited to deterministic markdown or plain-text `policy_document` sources.
It is a fixture, manifest, normalized expected-output, and deterministic direct-proof slice.
It is not product runtime behavior.

Repo truth supports F6W in this reduced shape because the shipped F6L, F6O, F6R, and F6U source-pack proofs are green; the shipped F6T certification-safety posture is green and non-certifying; existing CFO Wiki policy-document compile/read surfaces are green; existing source-scoped finance policy lookup is green; existing policy/covenant threshold monitoring is green; and existing close/control checklist policy-source freshness posture is green.
F6W must preserve that posture rather than widening it.

GitHub connector work is explicitly out of scope.
Do not invoke GitHub Connector Guard for F6W.

## Progress

- [x] 2026-05-01T17:42:38Z Invoked Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor; did not invoke GitHub Connector Guard.
- [x] 2026-05-01T17:42:38Z Ran preflight against fetched `origin/main`, confirmed the branch is `codex/f6w-master-plan-and-doc-refresh-local-v1`, confirmed local `HEAD` matched fetched `origin/main`, confirmed the worktree was clean before edits, confirmed GitHub auth/repo access, and confirmed Docker Postgres plus object storage were up.
- [x] 2026-05-01T17:42:38Z Read the active doc spine, shipped FP-0070 F6T record, shipped FP-0069 F6U record, package scripts, CFO Wiki/source registry/monitoring/close-control/Finance Twin domain contracts, shipped source-pack manifests and proofs, CFO Wiki policy-document compile/read tooling, policy lookup smoke, policy/covenant monitor smoke, close/control checklist smoke, and relevant control-plane modules.
- [x] 2026-05-01T17:42:38Z Ran the F6W readiness gate before writing this plan: CFO Wiki foundation, document pages, lint/export, concept/metric/policy, finance policy lookup, policy/covenant threshold monitor, close/control checklist, delivery-readiness, operator-readiness, acknowledgement-readiness, all shipped source-pack proofs, and focused F6T/CFO Wiki/source/monitoring/close-control domain specs passed.
- [x] 2026-05-01T17:42:38Z Decided F6W is the safest next planning slice, ahead of F6V actual provider integration and F6X actual certification, because it can stay source-pack-only and proof-oriented on already shipped policy-document, policy lookup, policy/covenant monitor, and close/control policy-source surfaces.
- [x] 2026-05-01T17:42:38Z Created this FP-0071 planning contract without adding code, routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, implementation scaffolding, provider integrations, credential scaffolding, outbox send behavior, UI, approval workflow, report-release behavior, certification behavior, or product runtime behavior.
- [x] 2026-05-01T17:42:38Z Updated the active docs spine to point F6W at this FP-0071 contract while preserving FP-0050 through FP-0070 as shipped records.
- [x] 2026-05-01T17:42:38Z Ran the full docs-and-plan validation ladder through `pnpm ci:repro:current`; all requested smokes, source-pack proofs, focused specs, lint, typecheck, test, and CI reproduction passed.
- [x] 2026-05-01T17:59:29Z QA corrected stale local-dev guidance that still said not to create FP-0071; `docs/ops/local-dev.md` now keeps FP-0070 shipped and points F6W planning at this active contract without starting implementation.
- [x] 2026-05-02T00:21:54Z Ran F6W implementation preflight against fetched `origin/main`, confirmed branch `codex/f6w-policy-covenant-document-source-pack-foundation-local-v1`, clean worktree before edits, GitHub auth/repo access, and local Docker Postgres/object storage availability.
- [x] 2026-05-02T00:21:54Z Added the `pocket-cfo-policy-covenant-document-source-pack` manifest, document source-pack descriptor type, exports, and stack-pack assertions without changing shipped F6L/F6O/F6R/F6U manifest semantics.
- [x] 2026-05-02T00:21:54Z Added one immutable F6W fixture family with markdown and plain-text `policy_document` sources, normalized expected source/wiki/policy posture, raw fixture immutability assertions, and forbidden-content boundary checks.
- [x] 2026-05-02T00:21:54Z Added direct deterministic proof `pnpm exec tsx tools/policy-covenant-document-source-pack-proof.mjs`, driven by the manifest source files and existing source registry plus CFO Wiki bind/compile/read routes.
- [x] 2026-05-02T00:21:54Z Ran focused narrow validation: `pnpm --filter @pocket-cto/stack-packs exec vitest run src/stack-pack.spec.ts`, `pnpm --filter @pocket-cto/testkit exec vitest run src/f6w-policy-covenant-document-source-pack.spec.ts`, and `pnpm exec tsx tools/policy-covenant-document-source-pack-proof.mjs` passed.
- [x] 2026-05-02T00:31:28Z Ran the full F6W implementation validation ladder through `pnpm ci:repro:current`; all requested narrow specs, DB-backed smokes/proofs, twin guardrails, lint, typecheck, test, and CI reproduction passed.

## Surprises & Discoveries

The repo already has the exact safe document boundary F6W needs.
`policy_document` is an existing CFO Wiki document role, `document` is an existing source kind, and deterministic CFO Wiki document extraction already supports markdown and plain text while keeping PDFs and unsupported sources visible as gaps.

The current policy/covenant threshold monitor and close/control policy-source item already read from stored CFO Wiki policy-document posture, deterministic extracts, policy pages, and policy-corpus posture.
That means F6W does not need a new monitor family, discovery family, evaluator, checklist item family, route, schema, or mission behavior.

The tiny F6T local-dev freshness line already includes FP-0070 as the shipped certification-safety record, so no `docs/ops/local-dev.md` edit is needed for that correction.

The CFO Wiki source-list route returns bound-source summaries directly, while the bind route returns a source binding view under `source`.
F6W proof normalization now respects those two existing response shapes rather than changing routes.

The existing CFO Wiki bind route requires a persisted finance company.
The proof may seed the deterministic demo finance company row as proof setup only because that route requires an existing finance company.
This is not product runtime behavior, not a new route, and not source-pack behavior beyond proof setup.
All source registration, raw source upload, CFO Wiki binding, compile, source-list, source-digest, policy-page, policy-corpus, and source-coverage behavior remains exercised through existing routes only.

Repeated local proof runs can leave older bound sources for the deterministic demo company.
The normalized posture therefore compares the manifest-driven current proof source IDs inside source-list and policy-corpus reads, while still checking company-level minimum posture and raw fixture immutability.

## Decision Log

Decision: proceed with `F6W-policy-covenant-document-source-pack-foundation`, not F6V provider integration and not F6X actual certification.
Rationale: F6W can be one deterministic source-pack family using existing source registry and CFO Wiki routes. F6V still needs future proof of provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send. F6X still needs future proof of operator need, legal boundaries, evidence boundaries, review gates, assurance constraints, and non-advice constraints.

Decision: F6W is not a monitor family.
Rationale: do not add monitor families, discovery families, or monitor evaluator semantics. The shipped monitor families remain exactly `cash_posture`, `collections_pressure`, `payables_pressure`, and `policy_covenant_threshold`. F6W must not create monitor results as part of checklist, readiness, review, provider-boundary, certification-boundary, human-confirmation, certification-safety, or source-pack proof paths.

Decision: F6W is not external delivery.
Rationale: do not add email, Slack, SMS, webhook, notification provider calls, provider calls, provider credentials, provider jobs, outbox send behavior, scheduled delivery, auto-send, report delivery, report release, report circulation, or external publish behavior.

Decision: F6W is not certification, legal advice, audit opinion, approval, or report release.
Rationale: do not add actual certification, certified status, close-complete status, sign-off, attestation, assurance, legal opinion, audit opinion, approval workflow, report release, report circulation, legal advice, or policy advice.

Decision: F6W expands source packs, not product runtime behavior.
Rationale: the implementation defines one checked-in policy/covenant document source-pack manifest and fixture family, one normalized expected source/wiki/policy posture file, and one deterministic direct proof path. It does not add DB tables, routes, monitor evaluators, mission behavior, UI, package scripts, root smoke aliases, eval datasets, provider integrations, outbox behavior, runtime-Codex, delivery, report, approval, certification, close-complete, sign-off, attestation, legal/audit opinion, or finance-action behavior.

Decision: F6W source scope is intentionally narrow.
Rationale: document role is exactly `policy_document`, source kind is exactly `document`, source-pack family count is one, and media types are limited to `text/markdown` and `text/plain` unless this plan is explicitly amended after repo truth proves another deterministic document path.

Decision: F6W inputs are fixture and proof inputs only.
Rationale: allowed inputs for the implementation are checked-in static policy/covenant document fixture files, expected normalized source/wiki/policy posture, existing source registration/upload routes in proof tooling only, existing CFO Wiki bind/compile/read routes in proof tooling only, and existing policy/covenant plus close/control read surfaces as validation context only. Generic chat, report artifacts as primary input, runtime-Codex, mission-generated prose, generated prose, monitor reruns, provider state, provider credentials, outbox jobs, external communications, and source mutation beyond proof upload/bind/compile setup are out of scope.

Decision: F6W output contract is one source-pack manifest/fixture contract plus one deterministic direct proof path.
Rationale: the expected posture should include source file list, source role/descriptors, document role, source kind, media type, expected CFO Wiki document extract posture, expected policy page posture, expected policy-corpus posture, expected source coverage posture, expected limitations, absence boundaries, raw fixture immutability, and fixed monitor/discovery family boundaries. It should add no new monitor result semantics, checklist item families, readiness behavior, acknowledgement behavior, delivery-readiness behavior, review-summary behavior, provider-boundary behavior, certification-boundary behavior, human-confirmation behavior, certification-safety behavior, investigation behavior, legal/policy advice, or product runtime behavior.

Decision: F6W policy documents do not use Finance Twin extractor keys.
Rationale: the shipped F6L/F6O/F6R/F6U source packs remain dataset/extractor-key packs, while F6W is a document/CFO-Wiki source pack. F6W uses a separate document descriptor with `documentRole` and `expectedDocumentKind` and does not force `expectedExtractorKey`.

Decision: the manifest drives proof operation.
Rationale: proof tooling reads the source-pack manifest source files as the operational source of truth; the expected posture source files are assertion data only. This preserves one manifest family and avoids generated IDs, timestamps, storage refs, or source IDs in expected outputs.

Decision: F6W preserves shipped F5 and F6 behavior.
Rationale: no F5 report/release/circulation/correction changes, no monitor evaluator changes, no F6B/F6G mission changes, no F6H checklist behavior changes, no F6J readiness behavior changes, no F6K acknowledgement behavior changes, no F6L/F6O/F6R/F6U source-pack behavior changes, no F6M delivery-readiness behavior changes, no F6N review-summary behavior changes, no F6P provider-boundary behavior changes, no F6Q certification-boundary behavior changes, no F6S human-confirmation behavior changes, no F6T certification-safety behavior changes, no new approval kind, and no report conversion belong in F6W.

Decision: later slices are named but not created here.
Rationale: F6V actual provider integration should happen only if a future plan proves provider security, compliance posture, human confirmation, observability, retry behavior, safe failure modes, and no autonomous send. F6X actual certification should happen only if a future plan proves operator need, legal boundaries, evidence boundaries, review gates, assurance constraints, and non-advice constraints. F6Y additional source-pack expansion should happen only after existing source packs remain green. Do not create FP-0072 in this slice.

## Context and Orientation

Pocket CFO has shipped F6A through F6T and F6U.
FP-0050 through FP-0070 are shipped records.
FP-0070 is the shipped F6T record for one deterministic internal close/control certification-safety/readiness foundation through `GET /close-control/companies/:companyKey/certification-safety`; it is not actual certification.
FP-0069 is the shipped F6U record for one ledger/reconciliation source-pack foundation only.

The shipped source-pack foundation records are:

- FP-0061 / F6L: one bank/card source-pack foundation with direct proof `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`.
- FP-0064 / F6O: one receivables/payables source-pack foundation with direct proof `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`.
- FP-0067 / F6R: one contract/obligation source-pack foundation with direct proof `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`.
- FP-0069 / F6U: one ledger/reconciliation source-pack foundation with direct proof `pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs`.

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

The relevant shipped source, wiki, policy, and close/control seams for F6W are:

- `packages/domain/src/source-registry.ts` for `document` source kind, snapshots, source files, checksums, provenance, and immutable raw source posture.
- `packages/domain/src/cfo-wiki.ts` for `policy_document` role, `markdown_text` and `plain_text` document extract kinds, policy pages, policy-corpus pages, freshness, limitations, and bound-source views.
- `apps/control-plane/src/modules/sources/**` for existing source registration and raw source-file upload routes used by proof tooling only.
- `apps/control-plane/src/modules/wiki/**` for existing source binding, deterministic markdown/plain-text extract, compile, source-list, and page-read routes used by proof tooling only.
- `apps/control-plane/src/modules/finance-discovery/policy-lookup.ts` and `tools/finance-policy-lookup-smoke.mjs` for source-scoped `policy_lookup` validation.
- `apps/control-plane/src/modules/monitoring/policy-covenant-*` and `tools/policy-covenant-threshold-monitor-smoke.mjs` for policy/covenant threshold validation only.
- `apps/control-plane/src/modules/close-control/**` and `tools/close-control-checklist-smoke.mjs` for policy-source freshness validation only.
- `apps/control-plane/src/modules/close-control-certification-safety/**` for preserving the shipped non-certifying F6T posture.

No GitHub connector work is in scope.
No new environment variables are expected.
No runtime-Codex behavior is expected.
No database schema migration, eval dataset, package script, smoke alias, provider integration, credential scaffold, outbox behavior, report, approval, delivery behavior, certification, close-complete status, sign-off, attestation, legal/audit opinion, assurance, generated prose, finance write, payment behavior, legal/policy advice, collection/customer-contact instruction, or autonomous action belongs in F6W.

## Plan of Work

First, the implementation added one policy/covenant document source-pack manifest contract beside the shipped F6L/F6O/F6R/F6U manifests.
The source-pack family should be named `pocket-cfo-policy-covenant-document-source-pack`.
It should include exactly one source role: `policy_document`.
It should include source kind `document`, document role `policy_document`, and media types `text/markdown` and `text/plain`.
It should not declare monitor families, discovery families, extractor keys, provider targets, delivery targets, approval targets, report targets, certification targets, runtime-Codex targets, or action targets.

Second, the implementation added one checked-in immutable fixture directory for F6W.
The fixture should contain static markdown and/or plain-text policy/covenant document source files plus one normalized expected source/wiki/policy posture file.
The fixture content may include exact deterministic threshold lines such as `Pocket CFO threshold: collections_past_due_share <= 50 percent` only as proof posture, not as legal advice or policy advice.
The expected posture should avoid generated IDs, timestamps, storage refs, or any other volatile fields.

Third, the implementation added one direct deterministic proof tool.
The proof should use only existing `/sources`, `/sources/:sourceId/files`, `/cfo-wiki/companies/:companyKey/sources/:sourceId/bind`, `/cfo-wiki/companies/:companyKey/compile`, `/cfo-wiki/companies/:companyKey/sources`, and `/cfo-wiki/companies/:companyKey/pages/*` routes to register/upload/bind/compile/read the fixture documents.
It should then validate existing policy/covenant and close/control read surfaces as context only, without rerunning monitors as part of checklist, readiness, acknowledgement, delivery-readiness, review-summary, provider-boundary, certification-boundary, human-confirmation, certification-safety, or source-pack proof paths.

Fourth, the proof asserts absence boundaries.
It verifies raw fixture source immutability, no monitor or discovery family expansion, no monitor evaluator changes, no mission creation, no report artifacts, no approvals, no delivery/outbox/provider behavior, no certification/sign-off/attestation/legal/audit opinion/assurance artifacts, no generated prose, no runtime-Codex threads, no source mutation outside proof upload/bind/compile setup, no finance writes, and no autonomous action.

Fifth, active docs were refreshed after implementation existed and the direct proof passed.
The implementation did not add a package script, root smoke alias, eval dataset, route, schema, migration, UI, provider integration, credential scaffold, or product runtime behavior.

## Concrete Steps

1. Add the source-pack manifest and type.
   Likely files:
   - `packages/stack-packs/src/stack-pack.ts`
   - `packages/stack-packs/src/packs/pocket-cfo-policy-covenant-document-source-pack.ts`
   - `packages/stack-packs/src/index.ts`

   Acceptance:
   - source-pack id is `pocket-cfo-policy-covenant-document-source-pack`
   - source role is exactly `policy_document`
   - document role is exactly `policy_document`
   - source kind is exactly `document`
   - media types are exactly `text/markdown` and `text/plain`
   - no extractor keys are required or declared
   - no monitor families or discovery families are declared
   - limitations state that the pack is one deterministic local fixture family, not a broad source-pack platform and not product runtime behavior

2. Add the checked-in fixture family.
   Likely files:
   - `packages/testkit/fixtures/f6w-policy-covenant-document-source-pack/README.md`
   - `packages/testkit/fixtures/f6w-policy-covenant-document-source-pack/sources/policy-covenant-threshold.md`
   - `packages/testkit/fixtures/f6w-policy-covenant-document-source-pack/sources/policy-covenant-control.txt`
   - `packages/testkit/fixtures/f6w-policy-covenant-document-source-pack/expected-source-wiki-policy-posture.json`

   Acceptance:
   - raw fixture sources are immutable and non-empty
   - expected posture includes no volatile IDs, timestamps, generated values, or storage refs
   - expected posture includes source file descriptors, source kind, document role, media type, bound-source posture, deterministic extract posture, policy page posture, policy-corpus posture, source coverage posture, limitations, family boundary, runtime/action absence boundary, and proof boundaries
   - fixture text stays evidence posture only and does not provide legal advice, policy advice, certification language, approval language, external delivery text, generated prose, collection/customer-contact instructions, payment instructions, or autonomous action instructions

3. Add the deterministic proof tool.
   Likely file:
   - `tools/policy-covenant-document-source-pack-proof.mjs`

   Acceptance:
   - proof registers source documents through existing source routes only
   - proof uploads markdown/plain-text fixture files through existing source-file registration only
   - proof binds each source as `policy_document` through existing CFO Wiki bind route only
   - proof compiles and reads existing CFO Wiki pages only
   - proof compares normalized actual source/wiki/policy posture to checked-in expected posture
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
   - this FP-0071 record

## Validation and Acceptance

This docs-and-plan slice ran the readiness gate before creating this plan:

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
- `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
- `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`
- `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`
- `pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs`
- `pnpm --filter @pocket-cto/domain exec vitest run src/close-control-certification-safety.spec.ts src/external-delivery-human-confirmation-boundary.spec.ts src/close-control-certification-boundary.spec.ts src/close-control-review-summary.spec.ts src/monitoring.spec.ts src/close-control.spec.ts src/cfo-wiki.spec.ts src/source-registry.spec.ts`

The F6W implementation validation must run at least:

- `pnpm exec tsx tools/policy-covenant-document-source-pack-proof.mjs`
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
- `pnpm exec tsx tools/bank-card-source-pack-proof.mjs`
- `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`
- `pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs`
- `pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs`
- `pnpm smoke:monitor-demo-replay:local`
- `pnpm smoke:finance-discovery-supported-families:local`
- `pnpm --filter @pocket-cto/domain exec vitest run src/cfo-wiki.spec.ts src/source-registry.spec.ts src/monitoring.spec.ts src/close-control.spec.ts src/close-control-certification-safety.spec.ts src/external-delivery-human-confirmation-boundary.spec.ts src/close-control-certification-boundary.spec.ts src/external-provider-boundary.spec.ts src/close-control-review-summary.spec.ts src/delivery-readiness.spec.ts src/proof-bundle.spec.ts`
- `zsh -lc "cd apps/control-plane && pnpm exec vitest run src/modules/wiki/**/*.spec.ts src/modules/sources/**/*.spec.ts src/modules/finance-discovery/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/close-control-certification-safety/**/*.spec.ts src/modules/external-delivery-human-confirmation-boundary/**/*.spec.ts src/modules/close-control-certification-boundary/**/*.spec.ts src/modules/external-provider-boundary/**/*.spec.ts src/modules/close-control-review-summary/**/*.spec.ts src/modules/delivery-readiness/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/app.spec.ts"`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Implementation acceptance requires all of the following:

- one `pocket-cfo-policy-covenant-document-source-pack` manifest exists
- one immutable checked-in policy/covenant document fixture family exists
- one normalized expected source/wiki/policy posture exists and is stable
- one direct deterministic proof path exists
- proof uses only existing source registry and CFO Wiki bind/compile/read routes
- proof verifies markdown/plain-text policy-document extract posture
- proof verifies policy page posture, policy-corpus posture, source coverage posture, freshness posture, limitations, and absence boundaries
- proof verifies raw fixture source immutability
- proof verifies no new monitor or discovery families
- proof verifies no route, schema, migration, package script, root smoke alias, eval dataset, mission behavior, checklist/readiness/acknowledgement/delivery-readiness/review-summary/provider-boundary/certification-boundary/human-confirmation/certification-safety behavior, report, approval, delivery, provider call, provider credential, provider job, outbox send, runtime-Codex, generated prose, source mutation outside proof upload/bind/compile setup, finance write, advice/instruction, payment behavior, tax filing, legal/audit opinion, certification, close-complete status, sign-off, attestation, assurance, autonomous action, or UI is added

Human-observable acceptance for this implementation slice:

- `plans/FP-0071-policy-covenant-document-source-pack-foundation.md` is the shipped F6W record after implementation
- active docs point future Codex threads at FP-0071 as the shipped F6W record
- FP-0050 through FP-0070 remain shipped F6A through F6T/F6U records
- F6V, F6X, F6Y, and later plans are named only as likely later slices and are not created
- F6W shipped one policy/covenant document source-pack foundation only
- the direct F6W proof command is `pnpm exec tsx tools/policy-covenant-document-source-pack-proof.mjs`

## Idempotence and Recovery

This implementation slice should be retry-safe because it will use static fixture files, object-store source uploads, CFO Wiki source bindings, deterministic compile/read routes, and normalized expected-output comparison.
If a proof run creates additional source uploads, source bindings, or compile runs, rerunning should still normalize away volatile IDs and timestamps and compare only stable posture.
Raw checked-in fixture files must never be rewritten by proof tooling.

Rollback for this implementation should be simple: remove only the F6W manifest, fixture family, proof tool, focused tests, and docs changes from this implementation branch.
Do not remove shipped F6L/F6O/F6R/F6U source packs, shipped CFO Wiki routes, shipped policy lookup, shipped policy/covenant monitor, shipped close/control checklist, shipped F6T certification-safety, GitHub modules, engineering-twin modules, or historical F5/F6 records.

Replay implication for F6W is explicit absence.
The implementation proof may seed the deterministic demo finance company row as proof setup only because the existing CFO Wiki bind route requires an existing company.
It may create source upload, source binding, and CFO Wiki compile records as proof setup, but it must not create mission replay events, monitor results, report artifacts, approvals, delivery/outbox/provider records, certification records, generated prose, finance writes, or autonomous-action records.
If a future plan wants persisted source-pack proof history, it must name that behavior explicitly and keep it separate from runtime product behavior.

## Artifacts and Notes

This implementation slice creates or updates:

- `plans/FP-0071-policy-covenant-document-source-pack-foundation.md`
- `packages/stack-packs/src/stack-pack.ts`
- `packages/stack-packs/src/packs/pocket-cfo-policy-covenant-document-source-pack.ts`
- `packages/stack-packs/src/index.ts`
- `packages/stack-packs/src/stack-pack.spec.ts`
- `packages/testkit/fixtures/f6w-policy-covenant-document-source-pack/**`
- `packages/testkit/src/f6w-policy-covenant-document-source-pack.spec.ts`
- `tools/policy-covenant-document-source-pack-proof.mjs`
- `README.md`
- `START_HERE.md`
- `docs/ACTIVE_DOCS.md`
- `plans/ROADMAP.md`
- `docs/ops/local-dev.md`
- `docs/ops/source-ingest-and-cfo-wiki.md`
- `docs/ops/codex-app-server.md`
- `evals/README.md`

Do not create FP-0072.
Do not start F6V, F6X, F6Y, or later work in this slice.

## Interfaces and Dependencies

F6W depends on the existing source registry, source-file object storage, CFO Wiki source binding, deterministic markdown/plain-text document extraction, policy page compilation, policy-corpus compilation, policy lookup, policy/covenant threshold monitor, close/control checklist, and shipped source-pack proof conventions.
It does not depend on GitHub, runtime-Codex, reports, approvals, outbox, providers, delivery, actual certification, legal/audit opinion, assurance, payment behavior, tax filing, UI, new database schema, new routes, new package scripts, new root smoke aliases, or new environment variables.

Route files must remain unchanged unless this plan is explicitly amended.
If a future continuation finds it cannot extend this source-pack posture using only named existing source registry and CFO Wiki routes, stop and create or amend a Finance Plan instead of adding runtime behavior.

## Outcomes & Retrospective

This implementation slice shipped F6W as one fixture/manifest/proof-only policy/covenant document source-pack expansion.
F6W remains one deterministic source-pack slice and keeps provider integration, actual certification, external delivery, approvals, reports, runtime-Codex, monitor families, discovery families, and autonomous actions out of scope.

Recommendation: after this implementation is reviewed and merged, do not start F6V, F6X, F6Y, or later work without a new Finance Plan. A future planning slice may choose F6V provider integration or F6X certification only after it proves the named safety and evidence boundaries; no FP-0072 is created here.
