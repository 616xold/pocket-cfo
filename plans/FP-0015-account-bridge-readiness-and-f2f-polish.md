# Add the F2G matched-period account-bridge readiness read model and F2F truthfulness polish

## Purpose / Big Picture

This plan implements the next narrow **F2G Finance Twin** slice for Pocket CFO.

The user-visible goal is to add one backend-first matched-period account-bridge-readiness read model on top of the shipped F2A through F2F work, while fixing the remaining F2F truthfulness and merged-doc lag now visible on fetched `origin/main`.
Operators should be able to tell whether the latest successful trial-balance and general-ledger slices are bridge-ready at matched-period account scope, see explicit account overlap and unmatched diagnostics only when the persisted state supports them, understand how chart-of-accounts context sharpens those diagnostics, and still avoid any fake direct balance bridge or reconciliation variance claim.

This slice stays intentionally narrow and additive.
It does not add another extractor family, does not redesign sync history, does not widen into wiki, finance discovery-answer UX, reports, monitoring, controls, connector APIs, AR or AP aging, bank or card feeds, contracts, or any F3 through F6 implementation.

## Progress

- [x] 2026-04-11T23:23:45Z Complete preflight against fetched `origin/main`, confirm `HEAD` matches fetched `origin/main`, confirm the exact branch name, confirm a clean worktree, verify `gh` auth, and verify local Postgres plus object storage availability.
- [x] 2026-04-11T23:23:45Z Read the active repo guidance, roadmap, shipped F2A through F2F Finance Plans, scoped AGENTS files, and required ops docs; inspect the finance-twin, source, schema, route, service, smoke, and test seams before planning.
- [x] 2026-04-11T23:23:45Z Create the active F2G Finance Plan in `plans/FP-0015-account-bridge-readiness-and-f2f-polish.md` before code changes.
- [x] 2026-04-11T23:34:31Z Implement the additive account-bridge-readiness route and assembler using only persisted latest-successful F2 state from raw-source-backed syncs.
- [x] 2026-04-11T23:34:31Z Fix the confirmed F2F truthfulness lag in docs, limitations copy, and ambiguous general-ledger source-declared period resolution.
- [x] 2026-04-11T23:34:31Z Run the focused finance-twin, domain, and DB validation pass for the new route, contract, and period-context fix.
- [x] 2026-04-11T23:40:15Z Run the required validation ladder in the requested order, fix only in-scope failures, and confirm the full requested ladder stayed green, including `pnpm ci:repro:current`, without needing any schema change.

## Surprises & Discoveries

The current F2F general-ledger period-context resolver still silently drops `period_start` when a file carries `period_start` plus `as_of` without `period_end`.
That is an explicit truthfulness gap for this slice because it downgrades ambiguous source-declared metadata into a plain `as_of` classification.

The current latest-slice finance reads appear sufficient for the narrow F2G goal.
`FinanceTwinService.readCompanyState()` already materializes the latest successful chart-of-accounts entries, trial-balance lines, general-ledger entries, freshness, slice alignment inputs, and general-ledger period context needed for an additive account-bridge assembler.

The slice has stayed schema-free through implementation and the focused finance-twin test pass.
No persisted query gap has appeared yet that would justify a DB migration for F2G.

The full requested validation ladder also stayed green without any schema change.
That confirms the additive account-bridge read model can be assembled entirely from the existing persisted F2 state and route seams.

The root active docs are stale after the F2F merge.
`README.md`, `START_HERE.md`, and `docs/ops/local-dev.md` still describe F2F as the active next slice rather than merged baseline plus active F2G work.

The current slice-alignment wording already treats `sameSyncRun` and `sameSourceSnapshot` as diagnostic under the per-file upload model.
F2G should preserve those fields because they remain useful facts, but it should not treat them as positive prerequisites for matched-period bridge readiness.

## Decision Log

Decision: treat F2G as a backend-first finance-twin read-model and truthfulness slice rather than another extractor or reporting slice.
Rationale: the user explicitly wants stricter matched-period account-bridge readiness on top of shipped persisted slice state, not broader finance surface area.

Decision: build the new account-bridge view only from persisted latest-successful Finance Twin state plus explicit source metadata.
Rationale: the acceptance bar explicitly forbids using ingest receipt previews or sample rows and requires F1 raw-source ingest to remain authoritative and immutable.

Decision: prefer no DB migration.
Rationale: the current F2 state already persists the latest successful chart-of-accounts, trial-balance, and general-ledger facts needed for this company-level read model, so the narrowest truthful implementation is likely schema-free.

Decision: matched-period bridge readiness must be stricter than F2E reconciliation readiness.
Rationale: the new route may surface account overlap and unmatched diagnostics, but it must only become bridge-ready when persisted source-declared period evidence truthfully supports matched-period account scope.

Decision: keep `sameSyncRun` and `sameSourceSnapshot` diagnostic-only.
Rationale: under the current per-file source and sync model those fields are usually false even for healthy shared-source finance flows, so they should not be treated as expected positive bridge-readiness signals.

Decision: fix ambiguous `period_start + as_of` general-ledger metadata in the smallest truthful way, with a preference for rejecting ambiguous source-declared combinations instead of silently dropping `period_start`.
Rationale: silently collapsing ambiguous source-declared metadata into a narrower context kind misrepresents persisted finance evidence.

Decision: GitHub connector work remains explicitly out of scope, and the engineering-twin module remains intact.
Rationale: this slice is about truthful finance-twin reads and active-doc cleanup, not connector or engineering-twin redesign.

## Context and Orientation

Pocket CFO has already shipped F1 raw-source ingest plus F2A trial-balance sync, F2B chart-of-accounts sync, F2C general-ledger sync, F2D snapshot and lineage reads, F2E reconciliation readiness plus general-ledger activity lineage drill behavior, and F2F reporting-window truth hardening.
The repo now has immutable source registration, stored raw file reads, deterministic CSV extraction for `trial_balance_csv`, `chart_of_accounts_csv`, and `general_ledger_csv`, persisted finance companies and slice state, sync runs with persisted stats, lineage, summary, snapshot, account-catalog, general-ledger, reconciliation, and activity-lineage routes.

The relevant bounded contexts for this slice are:

- `plans/` for the active F2G plan and a tiny merged-status note in `FP-0014` only if strictly necessary
- `packages/domain` for additive account-bridge-readiness contracts
- `packages/db` only if implementation proves a real persisted query gap that cannot be handled through existing sync-run-backed state
- `apps/control-plane/src/modules/finance-twin/` for the new account-bridge assembler, route wiring, service method, truthfulness fixes, and focused tests
- `apps/control-plane/src/modules/sources/**` only if one tiny metadata helper is truly required
- `apps/control-plane/src/bootstrap.ts`, `apps/control-plane/src/lib/types.ts`, `apps/control-plane/src/lib/http-errors.ts`, `apps/control-plane/src/app.ts`, and `apps/control-plane/src/test/database.ts` for wiring and regression coverage
- `tools/finance-twin-reconciliation-smoke.mjs`, `tools/finance-twin-period-context-smoke.mjs`, `tools/finance-twin-account-bridge-smoke.mjs`, and `package.json` for packaged local proof
- `README.md`, `START_HERE.md`, and `docs/ops/local-dev.md` for truthful active guidance

GitHub connector work is out of scope.
The engineering twin remains in place and must keep its reproducibility tests green unchanged.
Replay and evidence behavior should stay unchanged unless this slice needs a tiny note clarifying that persisted finance sync plus lineage state remains the current finance evidence spine for these reads.

## Plan of Work

Implement this slice in five bounded passes.

First, extend the finance-twin domain contracts so the repo can name a dedicated matched-period account-bridge-readiness view, a small bridge-readiness state block, coverage counts, and per-account diagnostics that include chart-of-accounts enrichment without implying a numeric balance bridge.

Second, add one bounded finance-twin assembler for the new view that joins the latest successful chart-of-accounts, trial-balance, and general-ledger state already materialized by the service, computes stricter matched-period bridge readiness, and keeps `sameSyncRun` and `sameSourceSnapshot` as diagnostics instead of positive prerequisites.

Third, expose the new backend route with thin transport code and a small service method, preserving the existing F2E reconciliation route rather than widening or redefining it.

Fourth, fix the confirmed F2F truthfulness lag by updating the stale finance-twin limitations copy, root docs, and the ambiguous general-ledger source-declared period resolver so ambiguous metadata is no longer silently misrepresented.

Fifth, add focused tests plus one packaged local account-bridge smoke that prove matched-period gating, no-fake-bridge behavior, account-level overlap and unmatched diagnostics, chart-of-accounts enrichment, and the period-context ambiguity behavior while keeping F1, F2A through F2F, and engineering-twin reproducibility coverage green.

## Concrete Steps

1. Keep `plans/FP-0015-account-bridge-readiness-and-f2f-polish.md` current throughout the slice, updating `Progress`, `Decision Log`, `Surprises & Discoveries`, and `Outcomes & Retrospective` after meaningful milestones.

2. Extend `packages/domain/src/finance-twin.ts` and `packages/domain/src/index.ts` to cover:
   - `FinanceAccountBridgeReadinessView`
   - a small `bridgeReadiness` block with `state`, `reasonCode`, `reasonSummary`, and the explicit basis or alignment facts needed for interpretation
   - a coverage summary that includes trial-balance/general-ledger overlap plus chart-of-accounts diagnostics
   - per-account rows that carry chart-of-accounts entry or null, trial-balance line or null, general-ledger activity or null, deterministic presence flags, unmatched flags, optional inactive-with-activity truth, and `activityLineageRef`

3. Prefer no DB migration.
   Only extend `packages/db/src/schema/finance-twin.ts`, `packages/db/src/schema/index.ts`, and `packages/db/drizzle/**` if implementation proves the current persisted state cannot support the new route truthfully.

4. Extend `apps/control-plane/src/modules/finance-twin/` with bounded modules that keep routes thin, likely including:
   - a dedicated `account-bridge.ts` or equivalently scoped assembler
   - small service extensions for `getAccountBridgeReadiness()`
   - additive schema and route support for `GET /finance-twin/companies/:companyKey/reconciliation/trial-balance-vs-general-ledger/account-bridge`

5. Preserve the raw-source authority seam by building the new view only from persisted Finance Twin slice state plus explicit source metadata.
   Do not derive account diagnostics, readiness, or bridge claims from source-ingest receipt previews, sample rows, or filename heuristics.

6. Make matched-period bridge readiness stricter than F2E reconciliation readiness.
   The preferred readiness gate is:
   - successful trial-balance slice exists
   - successful general-ledger slice exists
   - reconciliation basis is `source_declared_period`
   - general-ledger source-declared context kind is `period_window`
   - reconciliation `windowRelation` is `exact_match`
   - slice alignment state is `shared_source`

7. Keep `sameSyncRun` and `sameSourceSnapshot` diagnostic-only in the new route.
   Preserve them in the contract if useful, but do not require them to be true for bridge readiness and do not let limitations imply they are expected positive signals.

8. Surface explicit account coverage and unmatched diagnostics in the new route at minimum:
   - present in chart of accounts
   - present in trial balance
   - present in general ledger
   - overlap count between trial balance and general ledger
   - trial-balance-only count
   - general-ledger-only count
   - missing-from-chart-of-accounts count
   - inactive-with-general-ledger-activity count when chart-of-accounts state makes that claim truthful

9. Fix the general-ledger period-context ambiguity in `apps/control-plane/src/modules/finance-twin/general-ledger-csv.ts`.
   If `period_start` appears without `period_end`, including the `period_start + as_of` case, prefer rejecting the source-declared context as ambiguous rather than silently collapsing it to `as_of`.

10. Update the stale active docs and limitations copy in:
    - `README.md`
    - `START_HERE.md`
    - `docs/ops/local-dev.md`
    - `apps/control-plane/src/modules/finance-twin/summary.ts`
    - `plans/FP-0014-reporting-window-truth-and-period-scoped-reconciliation.md` only if a tiny merged-status note is strictly necessary

11. Add or update focused tests covering:
    - domain schema parsing for the new account-bridge contracts
    - service-level matched-period bridge-readiness gating
    - explicit no-fake-balance-bridge behavior
    - account overlap and unmatched diagnostics
    - chart-of-accounts enrichment for missing and inactive diagnostics
    - ambiguous general-ledger source-declared period behavior if this slice changes it
    - route-level contract behavior in `src/app.spec.ts`

12. Add `tools/finance-twin-account-bridge-smoke.mjs` and wire the root script in `package.json`.
    Update existing smokes only where truthfulness wording or the period-context ambiguity fix requires it.
    The packaged proof should show that:
    - finance reads still depend on persisted state from raw-source-backed syncs
    - matched-period account-bridge readiness is stricter than reconciliation readiness
    - the route surfaces account overlap and unmatched diagnostics without inventing a numeric bridge or variance
    - general-ledger activity drill-through still lands on journal-entry or journal-line evidence

13. Run validation in this exact order:

   ```bash
   pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/finance-twin/service.spec.ts src/app.spec.ts src/modules/finance-twin/general-ledger-csv.spec.ts
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
   pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm ci:repro:current
   ```

14. If and only if every required validation command is green, create exactly one local commit:

   ```bash
   git commit -m "feat: add finance twin account bridge readiness"
   ```

15. If fully green and edits were made, confirm the branch remains `codex/f2g-account-bridge-readiness-and-f2f-polish-local-v1`, show `git branch --show-current`, `git log --oneline -3`, and `git status --short --untracked-files=all`, push that exact branch, verify the remote head, and create or report the PR into `main` with the requested title and body.

## Validation and Acceptance

Required validation order:

```bash
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/finance-twin/service.spec.ts src/app.spec.ts src/modules/finance-twin/general-ledger-csv.spec.ts
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
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is met when all of the following are true:

- a new route-backed matched-period account-bridge-readiness view exists for one company
- the new view is built only from persisted Finance Twin state associated with the latest successful implemented slices
- the route does not compute a direct balance variance or any fake bridge number
- matched-period bridge readiness only becomes positive when source-declared period evidence and shared-source alignment truthfully support it
- `sameSyncRun` and `sameSourceSnapshot` remain diagnostic-only and are not used as required positive bridge-readiness conditions
- the new view surfaces explicit account coverage and unmatched diagnostics, including chart-of-accounts enrichment where truthful
- general-ledger account activity drill-through still reaches journal-entry or journal-line lineage
- ambiguous general-ledger source-declared period combinations are no longer silently misrepresented
- summary, snapshot, period-context, and reconciliation semantics remain explicit and understandable after the slice
- F1 source-ingest behavior still works
- F2A trial-balance behavior still works
- F2B chart-of-accounts and account-catalog behavior still works
- F2C general-ledger behavior still works
- F2D snapshot and lineage behavior still works
- F2E reconciliation and activity-lineage behavior still works except for any intentional truthfulness correction
- F2F period-context behavior still works except for any intentional truthfulness correction
- engineering-twin reproducibility tests still pass unchanged
- the root active docs describe merged F2F state and active F2G guidance truthfully

Provenance, freshness, replay, and limitation posture:
this slice must keep raw sources immutable, keep source lineage queryable, surface missing, stale, mixed, ambiguous, or non-bridge-ready conditions plainly, and avoid implying direct balance reconciliation or period equivalence when the persisted evidence does not support it.
No new CFO Wiki, report, approval, mission-output, monitoring, or connector behavior is in scope here.

## Idempotence and Recovery

This slice is additive-first and safe to retry when followed carefully.

- Re-running targeted tests, smokes, and sync operations should be safe because the test DB reset truncates finance-twin state between cases.
- Re-running a finance sync for the same uploaded source should update derived slice state deterministically without mutating the raw source bytes.
- If the general-ledger period-context fix proves too broad, revert the uncommitted extractor and test changes, tighten the ambiguity rule, and rerun the focused finance validations before expanding to the full ladder.
- If validation fails outside this slice or outside the known narrow engineering-twin reproducibility surface, stop and report the blocker instead of widening scope.

## Artifacts and Notes

Expected artifacts from this slice:

- one active F2G Finance Plan
- additive account-bridge-readiness contracts in `packages/domain`
- one additive finance-twin route plus assembler in `apps/control-plane/src/modules/finance-twin/`
- focused tests for service, route, domain, and general-ledger period-context behavior
- one packaged local account-bridge smoke
- truthful updates to the affected root docs and finance-twin limitations copy

Replay and evidence note:
this slice continues to rely on persisted finance sync runs and lineage as the evidence spine for backend reads, but it does not add new replay events, evidence bundles, CFO Wiki compilation, or report-generation behavior.

Freshness and limitation note:
the new route must expose freshness, comparability, and limitations in a way that stops at readiness and diagnostics when matched-period account scope is not truthfully supported.

## Interfaces and Dependencies

Package and runtime boundaries:

- `@pocket-cto/domain` remains the source of truth for additive account-bridge-readiness contracts
- `@pocket-cto/db` remains limited to schema and DB helpers, and is expected to stay unchanged unless a real persisted query gap appears
- `apps/control-plane` owns the read-model assembler, service orchestration, route transport, and the general-ledger period-context truthfulness fix
- the new route should reuse the existing latest-successful read state and general-ledger activity-lineage seam instead of re-querying raw source or adding broad query APIs

Configuration expectations:
no new environment variables are expected for this slice.

Upstream and downstream dependencies:

- upstream source authority remains `apps/control-plane/src/modules/sources/**` plus immutable stored source files
- downstream packaged proofs include the existing source-ingest, finance-twin, reconciliation, and period-context smokes plus the new account-bridge smoke
- GitHub connector and engineering-twin modules remain outside the active operator path and must not be deleted in this slice

## Outcomes & Retrospective

This section will be filled in as implementation and validation complete.
