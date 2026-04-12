# Add the F2J balance-proof lineage drill read model and F2I doc polish

## Purpose / Big Picture

This plan implements the next narrow **F2J Finance Twin** slice for Pocket CFO.

The user-visible goal is to add one truthful backend-first balance-proof lineage drill and read model on top of the shipped F2A through F2I work, while fixing the merged-doc lag now visible after the F2I merge. Operators should be able to move from a proof-bearing account row to the actual persisted general-ledger balance-proof row and its source lineage without guessing target IDs manually, while the repo continues to refuse fake balance bridges, fake reconciliation variance, and any proof invented from activity totals alone.

This slice stays intentionally narrow and additive. It does not add another extractor family, does not redesign sync history, does not widen into wiki, discovery UX, reports, monitoring, controls, connector APIs, AR or AP aging, bank or card feeds, contracts, or any F3 through F6 implementation.

## Progress

- [x] 2026-04-12T15:36:48Z Complete preflight against fetched `origin/main`, confirm the exact branch name, confirm a clean worktree, verify `gh` auth, and verify local Postgres plus object storage availability.
- [x] 2026-04-12T15:36:48Z Read the active repo guidance, roadmap, shipped F2A through F2I Finance Plans, scoped AGENTS files, required ops docs, and the current finance-twin implementation surfaces before planning.
- [x] 2026-04-12T15:36:48Z Create the active F2J Finance Plan in `plans/FP-0018-balance-proof-lineage-and-f2i-polish.md` before code changes.
- [x] 2026-04-12T15:54:21Z Implement the additive balance-proof lineage drill route, a dedicated proof-view assembler, and proof-lineage row refs using only persisted F2 state plus existing finance lineage records.
- [x] 2026-04-12T15:54:21Z Update `README.md`, `START_HERE.md`, `docs/ops/local-dev.md`, and the finance-twin limitations copy so merged F2I reality and active F2J guidance are truthful again.
- [x] 2026-04-12T15:54:21Z Run the full requested validation ladder, including the new packaged balance-proof-lineage smoke and `pnpm ci:repro:current`, with no in-scope failures remaining.

## Surprises & Discoveries

The current repo already persists `finance_general_ledger_balance_proofs` rows and creates generic finance lineage rows with target kind `general_ledger_balance_proof`, so the likely F2J path is schema-free and can reuse the existing provenance spine instead of adding a new proof table or proof-target semantic.

The current balance-bridge-prerequisites account rows expose proof state and wording, but they do not expose a direct proof-row lineage ref. That forces operators to infer or guess the persisted proof target ID even though the proof row and lineage already exist.

The current generic lineage drill route is already sufficient for proof provenance if the new read model can surface the persisted proof row ID and sync context truthfully. That means F2J can likely stay additive by composing one dedicated balance-proof route plus route-visible lineage refs rather than broadening the lineage API.

The current root docs are stale after the F2I merge. `README.md`, `START_HERE.md`, and `docs/ops/local-dev.md` still describe F2I as the active next slice rather than merged baseline plus active F2J work.

The new route can reuse the existing latest-successful general-ledger read state for the default path and only fall back to direct repository reads when an explicit `syncRunId` is requested. That kept the implementation schema-free and preserved the latest-slice semantics already used elsewhere in the finance-twin module.

## Decision Log

Decision: treat F2J as a backend-first finance-twin read-model and truthfulness slice rather than another extractor or reporting slice.
Rationale: the user explicitly wants proof-provenance drill behavior on top of shipped persisted state, not broader product surface area.

Decision: prefer no DB migration.
Rationale: the current persisted proof table and lineage table already appear sufficient to answer the F2J questions truthfully.

Decision: add one dedicated balance-proof drill route at `GET /finance-twin/companies/:companyKey/general-ledger/accounts/:ledgerAccountId/balance-proof` with optional `syncRunId`.
Rationale: this gives operators a stable non-guessing drill path from an account to the persisted proof row while keeping routes narrow and reviewable.

Decision: add `balanceProofLineageRef` to `FinanceBalanceBridgePrerequisitesAccountRow` only when a persisted proof row actually exists.
Rationale: this keeps the existing account row stable while giving route-visible proof-bearing rows a direct lineage target that can be reused by the generic lineage drill.

Decision: keep `general_ledger_balance_proof` as the existing lineage target kind instead of inventing a second proof-target semantic.
Rationale: the repo already persists proof lineage under that target kind, and F2J only needs a more drillable read model, not a second provenance system.

Decision: return both the persisted proof row and route-visible lineage records from the new balance-proof drill route, while also exposing a reusable `balanceProofLineageRef` on proof-bearing balance-bridge-prerequisites rows.
Rationale: this satisfies the backend-first direct-drill goal without forcing operators to infer IDs, and it keeps the generic lineage route as the durable provenance backbone.

Decision: update the shared finance-twin limitation copy to mention balance-proof lineage drill behavior explicitly.
Rationale: the new route is now a truthful shipped read model, so the limitation text should acknowledge it without implying any numeric bridge or reconciliation math.

Decision: keep GitHub connector work explicitly out of scope, and keep the engineering-twin module intact.
Rationale: this slice is about truthful finance-twin proof lineage and doc cleanup, not connector or engineering-twin redesign.

## Context and Orientation

Pocket CFO has already shipped F1 raw-source ingest plus F2A trial-balance sync, F2B chart-of-accounts sync, F2C general-ledger sync, F2D snapshot and lineage reads, F2E reconciliation readiness plus activity-lineage drill behavior, F2F reporting-window truth hardening, F2G matched-period account-bridge readiness, F2H balance-bridge-prerequisites reads, and F2I persisted source-backed general-ledger balance proof.

The repo now has immutable source registration, stored raw-file reads, deterministic CSV extraction for `trial_balance_csv`, `chart_of_accounts_csv`, and `general_ledger_csv`, persisted finance companies and slice state, sync runs with persisted stats, lineage, summary, snapshot, account-catalog, general-ledger, reconciliation, activity-lineage, account-bridge, and balance-bridge-prerequisites routes, plus persisted `general_ledger_balance_proof` rows and their lineage.

The relevant bounded contexts for this slice are:

- `plans/` for the active F2J plan and a tiny merged-status note in `FP-0017` only if strictly necessary
- `packages/domain` for additive balance-proof drill contracts and the row-level proof-lineage ref
- `packages/db` only if implementation proves a real persisted query gap that cannot be solved through the existing proof and lineage state
- `apps/control-plane/src/modules/finance-twin/` for the new read-model assembler, service method, route wiring, row-shape enrichment, and focused tests
- `apps/control-plane/src/bootstrap.ts`, `apps/control-plane/src/lib/types.ts`, `apps/control-plane/src/app.ts`, and `apps/control-plane/src/test/database.ts` for wiring and regression coverage
- `tools/finance-twin-balance-proof-lineage-smoke.mjs` plus the touched finance smokes and `package.json` for packaged local proof
- `README.md`, `START_HERE.md`, and `docs/ops/local-dev.md` for truthful active guidance

GitHub connector work is out of scope. The engineering twin remains in place and must keep its reproducibility tests green unchanged. Replay behavior is unchanged in this slice, but provenance, freshness, limitations, and route-visible evidence wording remain first-class because this work changes how operators drill to persisted proof state.

## Plan of Work

Implement this slice in five bounded passes.

First, extend the finance-twin domain contracts so the repo can name one dedicated balance-proof read model and an additive `balanceProofLineageRef` on balance-bridge-prerequisites account rows when explicit persisted proof exists.

Second, extend the finance-twin repository and service seams with the smallest additive proof-read helpers needed to resolve a proof row by company, ledger account, and optional sync run, while reusing the existing generic lineage drill path for provenance records.

Third, expose the new backend route with thin transport code and a focused assembler that returns the persisted proof row, proof basis, explicit proof source evidence, a route-visible lineage ref or lineage records, diagnostics, and limitations without inventing any numeric bridge or variance.

Fourth, update focused tests and add one packaged local balance-proof-lineage smoke that prove positive proof drill behavior, blocked no-proof behavior, row-level proof refs, and non-regression for the existing F1 through F2I routes.

Fifth, update the stale active docs so fresh Codex runs start from merged F2I state and active F2J guidance without reviving GitHub or engineering-twin work as the operator path.

## Concrete Steps

1. Keep `plans/FP-0018-balance-proof-lineage-and-f2i-polish.md` current throughout the slice, updating `Progress`, `Decision Log`, `Surprises & Discoveries`, and `Outcomes & Retrospective` after meaningful milestones.

2. Extend `packages/domain/src/finance-twin.ts` and `packages/domain/src/index.ts` to cover:
   - one additive `FinanceGeneralLedgerBalanceProofLineageRef`
   - one additive `FinanceGeneralLedgerBalanceProofView`
   - one additive route target contract for `companyKey + ledgerAccountId + optional syncRunId`
   - `balanceProofLineageRef` on `FinanceBalanceBridgePrerequisitesAccountRow`

3. Prefer no DB migration.
   Only extend `packages/db/src/schema/finance-twin.ts`, `packages/db/src/schema/index.ts`, and `packages/db/drizzle/**` if implementation proves the current persisted proof table or lineage table cannot answer the route truthfully.

4. Extend `apps/control-plane/src/modules/finance-twin/` with bounded modules that keep routes thin, likely including:
   - a dedicated balance-proof read-model helper
   - small repository additions for proof lookup if the existing list-by-sync helper is insufficient
   - service extensions for `getGeneralLedgerAccountBalanceProof()`
   - additive schema and route support for `GET /finance-twin/companies/:companyKey/general-ledger/accounts/:ledgerAccountId/balance-proof`

5. Preserve the raw-source authority seam by building the new read model only from persisted Finance Twin proof rows, sync runs, source metadata, and finance lineage.
   Do not derive proof lineage from journal activity lineage, ingest receipt previews, sample rows, or filename heuristics.

6. Return at minimum these route-visible fields in the new balance-proof drill surface:
   - `company`
   - `target`
   - `latestSuccessfulGeneralLedgerSlice`
   - `proof` or `null`
   - `lineage` or `lineageRef`
   - `diagnostics`
   - `limitations`

7. Add `balanceProofLineageRef` to `FinanceBalanceBridgePrerequisitesAccountRow` only when explicit persisted proof exists.
   The ref should reuse `targetKind: "general_ledger_balance_proof"` and the actual persisted proof row ID, with sync scope when truthful.

8. Keep the current balance-bridge-prerequisites route stable except for additive proof-lineage convenience fields.
   Do not add fake proof refs when proof is absent.

9. Add or update focused tests covering:
   - balance-proof lineage read behavior with persisted proof
   - no-proof no-lineage behavior
   - proof-ref exposure on balance-bridge-prerequisites account rows
   - no-fake-proof-from-activity behavior
   - generic balance-column non-proof behavior if touched
   - diagnostic-only alignment behavior if touched
   - route-level contract behavior in `src/app.spec.ts`

10. Add `tools/finance-twin-balance-proof-lineage-smoke.mjs` and wire the root script in `package.json`.
    Update existing finance smokes only where truthful proof-lineage output or route-visible refs require it.
    The packaged proof should show that:
    - finance reads still depend on persisted state from raw-source-backed syncs
    - proof-bearing account rows expose direct proof provenance without guessing target IDs
    - the new route returns the persisted proof row and its lineage without inventing variance
    - accounts with only activity totals remain blocked and explicit

11. Update the stale active docs in:
    - `README.md`
    - `START_HERE.md`
    - `docs/ops/local-dev.md`
    - `plans/FP-0017-source-backed-balance-proof-and-snapshot-polish.md` only if a tiny merged-status note is strictly necessary
    - `apps/control-plane/src/modules/finance-twin/summary.ts` only if the route-visible limitations copy needs a truthful small addition for balance-proof lineage drill behavior

12. Run validation in this exact order:

```bash
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/finance-twin/service.spec.ts src/app.spec.ts src/modules/finance-twin/general-ledger-balance-proof.spec.ts src/modules/finance-twin/general-ledger-csv.spec.ts
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
pnpm smoke:finance-twin-source-backed-balance-proof:local
pnpm run smoke:finance-twin-balance-proof-lineage:local
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

13. If and only if every required validation command is green, create exactly one local commit:

```bash
git commit -m "feat: add finance twin balance proof lineage"
```

14. If fully green and edits were made, confirm the branch remains `codex/f2j-balance-proof-lineage-and-f2i-polish-local-v1`, show `git branch --show-current`, `git log --oneline -3`, and `git status --short --untracked-files=all`, push that exact branch, verify the remote head, and create or report the PR into `main` with the requested title and body.

## Validation and Acceptance

Required validation order:

```bash
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/finance-twin/service.spec.ts src/app.spec.ts src/modules/finance-twin/general-ledger-balance-proof.spec.ts src/modules/finance-twin/general-ledger-csv.spec.ts
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
pnpm smoke:finance-twin-source-backed-balance-proof:local
pnpm run smoke:finance-twin-balance-proof-lineage:local
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is met when all of the following are true:

- a new route-backed balance-proof lineage and read model exists for one company
- the new surface is built only from persisted Finance Twin state associated with the latest successful implemented slices
- the new surface does not emit a direct balance variance, a fake reconciliation number, or a numeric balance bridge
- the new surface only lights up when explicit source-backed balance proof actually exists
- operators can move from a proof-bearing account row to the actual persisted proof row and its lineage without manually guessing a target ID
- the current balance-bridge-prerequisites route remains stable except for additive proof-lineage refs or proof-drill fields
- activity totals alone still do not count as proof
- only explicit accepted opening-balance or ending-balance headers count as proof, and ambiguous generic balance fields remain non-proof
- snapshot, reconciliation, and account-bridge semantics remain explicit and understandable after the slice
- F1 source-ingest behavior still works
- F2A trial-balance behavior still works
- F2B chart-of-accounts and account-catalog behavior still works
- F2C general-ledger behavior still works
- F2D snapshot and lineage behavior still works except for any intentional proof-lineage convenience improvement
- F2E reconciliation and activity-lineage behavior still works
- F2F period-context behavior still works
- F2G account-bridge behavior still works
- F2H balance-bridge-prerequisites behavior still works
- F2I source-backed-balance-proof behavior still works
- engineering-twin reproducibility tests still pass unchanged
- `README.md`, `START_HERE.md`, and `docs/ops/local-dev.md` describe merged F2I state and active F2J guidance truthfully

Provenance, freshness, replay, and limitation posture:
this slice must keep raw sources immutable, keep proof provenance queryable back to source-backed evidence, surface missing or blocked proof plainly, and avoid implying that trial-balance ending balances, general-ledger activity totals, generic balance fields, and explicit source-backed balance-proof rows are interchangeable.

## Idempotence and Recovery

This slice is additive-first and safe to retry when followed carefully.

- Re-running targeted tests, smokes, and read-only finance-twin routes should be safe because the test DB reset truncates finance-twin state between cases.
- Re-running a finance sync for the same uploaded source should keep producing persisted derived state deterministically without mutating the raw source bytes.
- If the balance-proof drill contract proves awkward, revert the uncommitted proof-lineage files, keep the plan updates, and retry with the next-smallest schema-free route and row-ref design.
- If a schema change becomes truly necessary, make it additive, migrate the local databases before DB-backed tests, and rerun the validation ladder from the requested order.
- If validation fails outside this slice or outside the known narrow engineering-twin reproducibility surface, stop and report the blocker instead of widening scope.

## Artifacts and Notes

Expected artifacts from this slice:

- one active F2J Finance Plan
- additive finance-twin domain and control-plane changes for proof-row drill and lineage refs
- focused service, route, domain, and smoke coverage for balance-proof lineage behavior
- truthful root-doc updates for merged F2I plus active F2J guidance
- one clean commit, push, and PR only if the full validation ladder is green

Replay and evidence note:
this slice continues to rely on persisted finance sync runs and finance lineage as the evidence spine for backend reads, but it does not add new replay event categories, evidence bundles, CFO Wiki compilation, or report-generation behavior.

## Interfaces and Dependencies

Package and runtime boundaries:

- `@pocket-cto/domain` remains the source of truth for additive balance-proof drill and lineage-ref contracts
- `@pocket-cto/db` remains limited to schema and DB helpers and is expected to stay unchanged unless a real persisted query gap appears
- `apps/control-plane` owns proof-read assembly, service orchestration, lineage composition, and thin HTTP transport
- the new route should reuse the existing latest-successful read state, persisted proof table, sync metadata, and generic lineage drill seam instead of re-querying raw source or adding a broad query API

Configuration expectations:
no new environment variables are expected for this slice.

Upstream and downstream dependencies:
this slice should become the truthful base for any later F2 proof-inspection or operator drill behavior, but it must not begin F3, F4, F5, or F6 work.

## Outcomes & Retrospective

Shipped outcome:
the repo now has a backend-first F2J balance-proof lineage drill at `GET /finance-twin/companies/:companyKey/general-ledger/accounts/:ledgerAccountId/balance-proof`, built entirely from persisted finance-twin proof rows, sync metadata, and finance lineage. The route returns the persisted proof row when explicit source-backed proof exists, exposes its proof basis and source evidence, and returns route-visible lineage records plus a reusable lineage ref without inventing a balance bridge, reconciliation variance, or proof from activity totals.

Additive surface outcome:
`FinanceBalanceBridgePrerequisitesAccountRow` now exposes `balanceProofLineageRef` only when a persisted `general_ledger_balance_proof` row exists. That lets operators move from a proof-bearing account row to the exact persisted proof target and then through the existing generic lineage route without guessing target IDs manually.

Truthfulness outcome:
accounts that only have general-ledger activity totals still remain blocked, generic or ambiguous balance fields still do not count as proof, and the balance-bridge-prerequisites route remains stable apart from additive proof-lineage convenience fields.

Documentation outcome:
`README.md`, `START_HERE.md`, and `docs/ops/local-dev.md` now describe F2I as merged baseline work, name F2J as the active next slice, include the new packaged smoke, and keep GitHub plus engineering-twin modules out of the active operator finance path.

Validation outcome:
all required commands were green in the requested order, including focused finance-twin tests, domain and DB schema tests, all requested local smokes, the engineering-twin regression checks, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` from a clean reproduced worktree.

Remaining work after this checkpoint:
create the single local commit, push `codex/f2j-balance-proof-lineage-and-f2i-polish-local-v1`, verify the remote branch head, and create or report the pull request into `main`.
