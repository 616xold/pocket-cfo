# Add source-backed general-ledger balance proof and snapshot truthfulness polish for F2I

## Purpose / Big Picture

This plan implements the next narrow **F2I Finance Twin** slice for Pocket CFO.

The user-visible goal is to add truthful source-backed general-ledger opening-balance and ending-balance proof on top of the shipped F2A through F2H work, while fixing the remaining snapshot diagnostic-versus-limitation mismatch and the merged-doc lag now visible on fetched `origin/main`.
Operators should be able to see when the latest successful general-ledger slice really carries explicit source-backed balance-proof fields for an account, when matched-period account overlap plus persisted proof lets the existing F2H balance-bridge-prerequisites route light up, and when the route must stay blocked because only activity totals exist.

This slice stays intentionally narrow and additive.
It does not add another extractor family, does not widen into wiki, finance discovery-answer UX, reports, monitoring, controls, connector APIs, AR or AP aging, bank or card feeds, contracts, or any F3 through F6 implementation.

## Progress

- [x] 2026-04-12T14:19:48Z Complete preflight against fetched `origin/main`, confirm the exact branch name, confirm a clean worktree, verify `gh` auth, and verify local Postgres plus object storage availability.
- [x] 2026-04-12T14:19:48Z Read the active repo guidance, roadmap, shipped F2A through F2H Finance Plans, scoped AGENTS files, and required ops docs; inspect the finance-twin, source, route, service, schema, smoke, and test seams before planning.
- [x] 2026-04-12T14:19:48Z Create the active F2I Finance Plan in `plans/FP-0017-source-backed-balance-proof-and-snapshot-polish.md` before code changes.
- [x] 2026-04-12T15:47:00Z Implement additive source-backed balance-proof persistence, extractor hardening, snapshot diagnostic polish, docs truthfulness cleanup, and the full requested validation ladder.

## Surprises & Discoveries

The current persisted F2 shape does not yet have a truthful account-level place to store general-ledger opening-balance or ending-balance proof.
`finance_twin_sync_runs.stats` currently carries slice-level metadata such as general-ledger period context, while `finance_journal_entries` and `finance_journal_lines` only represent activity rows.
That makes the current `general-ledger-balance-proof.ts` helper correctly stay blocked, but it also means F2I likely needs one small additive persisted proof seam rather than another read-time inference.

The current snapshot still pushes shared-source diagnostic wording into blocking limitations when the slice-alignment helper already says `sameSourceSnapshot` and `sameSyncRun` are diagnostic-only under the per-file upload model.
`snapshot.ts` currently adds `sliceAlignment.reasonSummary` to `limitations` for the `shared_source` case whenever those booleans differ, which is the exact mismatch the user called out.

The existing general-ledger extractor is already large and should not absorb another broad chunk of logic inline.
`general-ledger-csv.ts` is already well past the repo’s preferred size threshold, so F2I should split any new proof-header parsing into a dedicated helper module instead of further growing the extractor into a god file.

The current balance-bridge-prerequisites route and route-visible diagnostics are already good narrow seams for F2I.
The additive move is to enrich the existing route with persisted proof rather than add route sprawl, while keeping shared-source notes as diagnostics and preserving the no-fake-variance boundary.

The DB-backed finance-twin tests needed the new migration in the test database as well as the local development database.
Running `pnpm db:migrate` was enough for the local app database, but the repo’s DB-backed vitest coverage also needed `pnpm db:migrate:ci` so `pocket_cto_test` picked up the new proof table before the repository-backed assertions could pass.

## Decision Log

Decision: implement F2I as a backend-first finance-twin truthfulness slice on top of the shipped F2A through F2H state.
Rationale: the user explicitly wants narrow additive balance-proof support and snapshot truthfulness polish, not broader product surface area.

Decision: prefer one new additive persisted table for account-level general-ledger balance proof instead of overloading sync-run stats or journal-line semantics.
Rationale: account-level proof needs to be persisted, queryable, and reviewable without pretending that activity rows or slice-level JSON can stand in for per-account proof state.

Decision: create lineage for persisted balance-proof rows rather than burying proof provenance inside opaque JSON.
Rationale: derived facts in Pocket CFO should remain traceable back to source, snapshot, and source-file evidence, and the user explicitly warned against storing proof in a way that makes later lineage harder to reason about.

Decision: only explicit opening-balance or ending-balance header families count as proof in this slice.
Rationale: the user explicitly forbids treating trial-balance ending balances, activity totals, or ambiguous generic balance headers as opening-balance or ending-balance proof.

Decision: keep ambiguous generic balance columns non-proof and preserve existing general-ledger sync success where possible.
Rationale: F2I should harden truth without breaking valid F2C general-ledger ingest just because a source also carries ambiguous columns like `balance`, `running_balance`, or `current_balance`.

Decision: move shared-source snapshot or sync-run wording into additive snapshot diagnostics instead of blocking limitations.
Rationale: under the current per-file upload model, `sameSourceSnapshot` and `sameSyncRun` remain useful facts but not positive prerequisites, and the operator-facing wording should match that contract.

Decision: GitHub connector work remains explicitly out of scope, and the engineering-twin module remains intact.
Rationale: this slice is about finance-twin proof truth and doc cleanup, not connector or engineering-twin redesign.

Decision: route-visible proof should only light up from persisted proof rows loaded alongside the latest successful general-ledger slice.
Rationale: this keeps the finance-twin read model tied to raw-source-backed sync output rather than ad hoc route-time inference, and it preserves the repo’s evidence-first boundary.

## Context and Orientation

Pocket CFO has already shipped F1 raw-source ingest plus F2A trial-balance sync, F2B chart-of-accounts sync, F2C general-ledger sync, F2D snapshot and lineage reads, F2E reconciliation readiness plus activity-lineage drill behavior, F2F reporting-window truth hardening, F2G matched-period account-bridge readiness, and F2H balance-bridge-prerequisites reads.
The repo now has immutable source registration, stored raw-file reads, deterministic CSV extraction for `trial_balance_csv`, `chart_of_accounts_csv`, and `general_ledger_csv`, persisted finance companies and slice state, sync runs with persisted stats, lineage, summary, snapshot, account-catalog, general-ledger, reconciliation, activity-lineage, account-bridge, and balance-bridge-prerequisites routes.

The relevant bounded contexts for this slice are:

- `plans/` for the active F2I plan and a tiny merged-status note in `FP-0016` only if strictly necessary
- `packages/domain` for additive balance-proof records and read-model contracts plus snapshot diagnostics
- `packages/db` for one additive persisted proof table and any required enum or export changes
- `apps/control-plane/src/modules/finance-twin/` for explicit proof-header extraction, proof persistence, route assembly, snapshot diagnostic polish, and focused tests
- `apps/control-plane/src/modules/sources/**` only if one tiny metadata helper is strictly required
- `apps/control-plane/src/bootstrap.ts`, `apps/control-plane/src/lib/types.ts`, `apps/control-plane/src/lib/http-errors.ts`, `apps/control-plane/src/app.ts`, and `apps/control-plane/src/test/database.ts` for wiring and regression coverage
- `tools/finance-twin-balance-bridge-prerequisites-smoke.mjs`, `tools/finance-twin-account-bridge-smoke.mjs`, `tools/finance-twin-period-context-smoke.mjs`, and one new source-backed-balance-proof smoke for packaged local proof
- `README.md`, `START_HERE.md`, and `docs/ops/local-dev.md` for truthful active guidance

GitHub connector work is out of scope.
The engineering twin remains in place and must keep its reproducibility tests green unchanged.
Replay behavior is unchanged in this slice, but evidence and provenance remain relevant because this work changes route-visible proof wording and persisted proof state.

## Plan of Work

Implement this slice in six bounded passes.

First, extend the finance-twin domain contracts so the repo can name a persisted general-ledger balance-proof record, a richer proof source description for route-visible diagnostics, and additive snapshot diagnostics without widening the current route set.

Second, add one small forward-only persisted proof seam in `packages/db` plus any required lineage target expansion so account-level balance proof is stored additively and queryably by `syncRunId + ledgerAccountId`.

Third, split explicit balance-proof extraction into a dedicated helper module and extend `general_ledger_csv` so it can deterministically parse accepted opening-balance and ending-balance header families, ignore ambiguous generic balance headers as non-proof, and fail truthfully when one slice contains conflicting explicit proof values for the same account.

Fourth, extend the finance-twin repository and service seams so successful general-ledger syncs persist proof rows and proof lineage, the latest successful general-ledger slice can read them back, and the existing balance-bridge-prerequisites assembler can light up only when explicit persisted proof exists.

Fifth, fix the remaining snapshot diagnostic-versus-limitation mismatch by adding additive snapshot diagnostics and keeping shared-source snapshot or sync-run notes out of blocking limitations when they are diagnostic-only.

Sixth, update the stale active docs and run the full requested validation ladder in the user-specified order, fixing only in-scope failures before the one required commit, push, and PR flow.

## Concrete Steps

1. Keep `plans/FP-0017-source-backed-balance-proof-and-snapshot-polish.md` current throughout the slice, updating `Progress`, `Decision Log`, `Surprises & Discoveries`, and `Outcomes & Retrospective` after meaningful milestones.

2. Extend `packages/domain/src/finance-twin.ts` and `packages/domain/src/index.ts` to cover:
   - one additive `FinanceGeneralLedgerBalanceProofRecord`
   - any additive `FinanceGeneralLedgerBalanceProofSource` detail needed to make proof source explicit and reviewable
   - additive snapshot diagnostics fields
   - any small coverage or proof-source contract refinements needed by the existing balance-bridge-prerequisites view

3. Extend `packages/db/src/schema/finance-twin.ts`, `packages/db/src/schema/index.ts`, and `packages/db/drizzle/**` with additive support for:
   - `finance_general_ledger_balance_proofs`
   - any required supporting indexes and unique keys
   - a new lineage target kind only if it is needed to keep proof provenance queryable

4. Extend `apps/control-plane/src/modules/finance-twin/` with bounded modules that keep routes thin, likely including:
   - a dedicated general-ledger balance-proof extraction helper used by `general-ledger-csv.ts`
   - repository methods for upserting and listing persisted balance proofs
   - service or slice-read helpers so the latest successful general-ledger slice carries proof rows without changing raw-source authority
   - the smallest additive assembler changes in `general-ledger-balance-proof.ts`, `balance-bridge-prerequisites-accounts.ts`, `balance-bridge-prerequisites-status.ts`, and `snapshot.ts`

5. Preserve the raw-source authority seam by deriving proof only from stored raw general-ledger source bytes processed through deterministic sync.
   Do not use ingest receipt previews, sample rows, or shallow parser summaries for proof.

6. Implement balance-proof extraction with these rules:
   - accepted explicit opening-balance headers: `opening_balance`, `opening_balance_amount`, `beginning_balance`, `beginning_balance_amount`, `start_balance`, `start_balance_amount`
   - accepted explicit ending-balance headers: `ending_balance`, `ending_balance_amount`, `closing_balance`, `closing_balance_amount`, `end_balance`, `end_balance_amount`
   - ambiguous generic headers such as `balance`, `running_balance`, and `current_balance` remain non-proof in this slice
   - repeated identical proof values for one account are acceptable
   - conflicting explicit proof values for one account in one slice must fail truthfully

7. Enrich the existing balance-bridge-prerequisites route rather than adding route sprawl.
   At minimum the route should expose:
   - truthful per-account `generalLedgerBalanceProof`
   - explicit proof basis
   - explicit proof source
   - explicit blocked reason when proof is absent
   - unchanged no-fake-variance and no-fake-numeric-bridge behavior

8. Fix the snapshot diagnostic-versus-limitation mismatch in `apps/control-plane/src/modules/finance-twin/snapshot.ts`.
   Prefer adding a `diagnostics` field to the snapshot contract.
   If no real blocker depends on `sameSourceSnapshot` or `sameSyncRun`, do not keep their shared-source explanatory text in `limitations`.

9. Check `apps/control-plane/src/modules/finance-twin/summary.ts` and update the finance-twin limitations copy if the merged F2H baseline plus active F2I slice makes the existing copy stale or misleading.

10. Add or update focused tests covering:

- explicit source-backed opening-balance and ending-balance proof extraction behavior
- no-fake-balance-proof fallback behavior
- conflicting proof-value behavior
- ambiguous generic-balance-column non-proof behavior
- snapshot diagnostic-versus-limitation truthfulness behavior
- general-ledger period-context ambiguity behavior if touched
- route-level balance-bridge-prerequisites behavior with a positive proof case

11. Add `tools/finance-twin-source-backed-balance-proof-smoke.mjs` and wire the root script in `package.json`.
    Update existing finance-twin smokes only where route truthfulness or new proof output requires it.

12. Update the stale active docs in:

- `README.md`
- `START_HERE.md`
- `docs/ops/local-dev.md`
- `plans/FP-0016-balance-bridge-prerequisites-and-diagnostic-hardening.md` only if a tiny merged-status note is strictly necessary

13. Run validation in this exact order:

```bash
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/finance-twin/general-ledger-csv.spec.ts src/modules/finance-twin/service.spec.ts src/app.spec.ts
pnpm --filter @pocket-cto/domain exec vitest run src/finance-twin.spec.ts
pnpm --filter @pocket-cto/db exec vitest run src/schema.spec.ts
pnpm smoke:source-ingest:local
pnpm smoke:finance-twin:local
pnpm smoke:finance-twin-account-catalog:local
pnpm smoke:finance-twin-general-ledger:local
pnpm smoke:finance-twin-snapshot:local
pnpm smoke:finance-twin-reconciliation:local
pnpm smoke:finance-twin-period-context:local
pnpm smoke:finance-twin-account-bridge:local
pnpm smoke:finance-twin-balance-bridge-prerequisites:local
pnpm run smoke:finance-twin-source-backed-balance-proof:local
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

14. If and only if every required validation command is green, create exactly one local commit:

```bash
git commit -m "feat: add finance twin source-backed balance proof"
```

15. If fully green and edits were made, confirm the branch remains `codex/f2i-source-backed-balance-proof-and-snapshot-polish-local-v1`, show `git branch --show-current`, `git log --oneline -3`, and `git status --short --untracked-files=all`, push that exact branch, verify the remote head, and create or report the PR into `main` with the requested title and body.

## Validation and Acceptance

Required validation order:

```bash
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/finance-twin/general-ledger-csv.spec.ts src/modules/finance-twin/service.spec.ts src/app.spec.ts
pnpm --filter @pocket-cto/domain exec vitest run src/finance-twin.spec.ts
pnpm --filter @pocket-cto/db exec vitest run src/schema.spec.ts
pnpm smoke:source-ingest:local
pnpm smoke:finance-twin:local
pnpm smoke:finance-twin-account-catalog:local
pnpm smoke:finance-twin-general-ledger:local
pnpm smoke:finance-twin-snapshot:local
pnpm smoke:finance-twin-reconciliation:local
pnpm smoke:finance-twin-period-context:local
pnpm smoke:finance-twin-account-bridge:local
pnpm smoke:finance-twin-balance-bridge-prerequisites:local
pnpm run smoke:finance-twin-source-backed-balance-proof:local
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is met when all of the following are true:

- the repo gains truthful source-backed general-ledger opening-balance or ending-balance proof support without adding a new extractor family
- the balance-bridge-prerequisites route can light up a positive per-account proof state only when explicit source-backed balance fields really exist in persisted state
- the route still does not emit a direct balance variance, a fake reconciliation number, or a numeric balance bridge
- activity totals alone still do not count as proof
- only explicit accepted proof headers count as proof, while ambiguous generic balance headers remain non-proof
- conflicting explicit proof values for one account in one slice fail truthfully rather than being silently collapsed
- the company snapshot no longer presents diagnostic-only shared-source snapshot or sync-run notes as blocking limitations
- `sameSyncRun` and `sameSourceSnapshot` remain diagnostic-only and are not used as required positive prerequisites
- the current general-ledger period-context ambiguity behavior stays explicit and tested
- existing summary, snapshot, period-context, reconciliation, account-bridge, and balance-bridge-prerequisites semantics remain explicit and understandable after the slice
- F1 source-ingest behavior still works
- F2A trial-balance behavior still works
- F2B chart-of-accounts and account-catalog behavior still works
- F2C general-ledger behavior still works
- F2D snapshot and lineage behavior still works except for the intentional diagnostic-versus-limitation correction
- F2E reconciliation and activity-lineage behavior still works
- F2F period-context behavior still works
- F2G account-bridge behavior still works
- F2H balance-bridge-prerequisites behavior still works except for the intentional proof light-up and limitation-copy corrections
- engineering-twin reproducibility tests still pass unchanged
- `README.md`, `START_HERE.md`, and `docs/ops/local-dev.md` describe merged F2H state and active F2I guidance truthfully

Provenance, freshness, replay, and limitation posture:
this slice must keep raw sources immutable, keep proof provenance queryable back to source-backed evidence, surface missing or blocked proof plainly, and avoid implying that trial-balance ending balances, general-ledger activity totals, generic balance fields, and source-declared balance-proof fields are interchangeable.

## Outcomes & Retrospective

Implemented F2I as a narrow additive finance-twin truthfulness slice.
The repo now persists source-backed general-ledger balance-proof rows from explicit opening-balance and ending-balance columns, exposes that persisted proof through the existing balance-bridge-prerequisites view, keeps activity-only accounts blocked, and refuses conflicting explicit proof values within one slice.

Snapshot truthfulness is now aligned with the shipped per-file upload model.
Shared-source snapshot and sync-run alignment notes moved into additive diagnostics instead of blocking limitations, while real blockers remain visible in limitations.

Docs now reflect the merged F2H state and the active F2I slice.
`README.md`, `START_HERE.md`, and `docs/ops/local-dev.md` now point operators and contributors at the current finance-twin scope, including the added source-backed balance-proof smoke.

Validation completed successfully in the requested ladder:

- focused finance-twin vitest coverage for extractor hardening, proof rendering, repository persistence, service reads, and route-level behavior
- `pnpm --filter @pocket-cto/domain exec vitest run src/finance-twin.spec.ts`
- `pnpm --filter @pocket-cto/db exec vitest run src/schema.spec.ts`
- `pnpm smoke:source-ingest:local`
- `pnpm smoke:finance-twin:local`
- `pnpm smoke:finance-twin-account-catalog:local`
- `pnpm smoke:finance-twin-general-ledger:local`
- `pnpm smoke:finance-twin-snapshot:local`
- `pnpm smoke:finance-twin-reconciliation:local`
- `pnpm smoke:finance-twin-period-context:local`
- `pnpm smoke:finance-twin-account-bridge:local`
- `pnpm smoke:finance-twin-balance-bridge-prerequisites:local`
- `pnpm smoke:finance-twin-source-backed-balance-proof:local`
- unchanged engineering-twin reproducibility coverage in `workflow-sync.spec.ts`, `test-suite-sync.spec.ts`, and `codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Remaining work:
none inside the scoped F2I slice.
The next step should stay in F2 and build on this persisted proof seam rather than widening into discovery UX, reporting, connectors, or later roadmap phases.
No new CFO Wiki, report, approval, mission-output, monitoring, or connector behavior is in scope here.

## Idempotence and Recovery

This slice is additive-first and safe to retry when followed carefully.

- Re-running targeted tests, smokes, and sync operations should be safe because the test DB reset truncates finance-twin state between cases.
- Re-running a finance sync for the same uploaded source should update derived slice state deterministically without mutating the raw source bytes.
- If the persisted proof shape proves awkward, keep the plan updates, revert the uncommitted proof-specific files, and replace the design with the next-smallest additive persisted seam before restarting the focused validations.
- If the migration is wrong, regenerate or rewrite it forward-only, migrate the local databases, and rerun the requested validation ladder from the start.
- If validation fails outside this slice or outside the known narrow engineering-twin reproducibility surface, stop and report the blocker instead of widening scope.

## Artifacts and Notes

Expected artifacts from this slice:

- one active F2I Finance Plan
- additive finance-twin domain and DB changes for persisted general-ledger balance proof
- focused extractor, repository, service, route, and smoke coverage for source-backed balance proof
- additive snapshot diagnostics and truthful limitation wording
- truthful root-doc updates for merged F2H plus active F2I guidance
- one clean commit, push, and PR only if the full validation ladder is green

Replay and evidence note:
this slice continues to rely on persisted finance sync runs and lineage as the evidence spine for backend reads, but it does not add new replay event categories, evidence bundles, CFO Wiki compilation, or report-generation behavior.

## Interfaces and Dependencies

Package and runtime boundaries:

- `@pocket-cto/domain` remains the source of truth for additive balance-proof and snapshot contracts
- `@pocket-cto/db` remains limited to schema and DB helpers
- `apps/control-plane` owns deterministic proof extraction, sync persistence, read-model assembly, and thin HTTP transport
- the new proof seam should reuse the existing latest-successful read state, source metadata, and lineage model instead of re-querying raw source from routes or widening into a broad query layer

Configuration expectations:
no new environment variables are expected for this slice.

Upstream and downstream dependencies:

- upstream source authority remains `apps/control-plane/src/modules/sources/**` plus immutable stored source files
- downstream packaged proofs include the existing source-ingest and finance-twin smokes plus one new source-backed-balance-proof smoke
- GitHub connector and engineering-twin modules remain outside the active operator path and must not be deleted in this slice

## Outcomes & Retrospective

This section will be completed as implementation and validation progress.
The intended shipped outcome is an additive F2I slice that persists explicit per-account general-ledger balance proof when the source really provides it, keeps the balance-bridge-prerequisites route truthful when proof is absent, moves shared-source snapshot notes into diagnostics instead of blocking limitations, and restores root-doc truth now that F2H is merged and F2I is the active next slice.
