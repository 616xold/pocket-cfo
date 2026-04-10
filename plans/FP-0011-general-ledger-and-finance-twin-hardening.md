# Extend the F2C finance twin with general ledger sync and truthfulness hardening

## Purpose / Big Picture

This plan implements the next narrow **F2C Finance Twin** slice for Pocket CFO.

The user-visible goal is to add a real deterministic `general_ledger_csv` extractor family that syncs from immutable stored raw bytes, persist truthful journal-entry and journal-line state with explicit lineage, harden company and account-master truthfulness so later slices do not silently degrade finance state, and close the remaining active-doc gaps that still lag the merged F2B repo state.

This slice stays intentionally narrow and additive.
It extends the shipped F2A and F2B finance-twin work, but it does not begin AR or AP aging, bank summaries, card or expense feeds, contracts, CFO Wiki compilation, finance discovery answers, memo or report generation, monitoring, close or control work, connector APIs, package-scope rename work, or any F3 through F6 implementation.

## Progress

- [x] 2026-04-10T23:13:59Z Complete preflight against fetched `origin/main`, confirm `HEAD` matches fetched `origin/main`, confirm the exact branch name, confirm a clean worktree, verify `gh` auth, and verify local Postgres plus object storage availability.
- [x] 2026-04-10T23:13:59Z Read the active repo guidance, roadmap, the shipped F2A and F2B Finance Plans, scoped AGENTS files, and the required ops docs; inspect the finance-twin, source-storage, schema, bootstrap, route, test, and smoke seams before planning.
- [x] 2026-04-10T23:13:59Z Create the active F2C Finance Plan in `plans/FP-0011-general-ledger-and-finance-twin-hardening.md` before code changes.
- [x] 2026-04-11T00:41:00Z Implement additive finance-twin contracts, schema, persistence, extractor dispatch, tests, and smoke support for `general_ledger_csv`, while preserving the F1 and engineering-twin paths.
- [x] 2026-04-11T00:41:00Z Fix the company display-name preservation path, harden ledger-account authority semantics, and make attempted-versus-successful slice semantics explicit enough for a third finance slice.
- [x] 2026-04-11T00:41:00Z Update `README.md` and `docs/ops/local-dev.md`, and make the smallest additional active-doc touch in `START_HERE.md` so the suggested slice list stays truthful through F2C.
- [x] 2026-04-11T00:37:40Z Run the required validation ladder in the requested order, fix only in-slice failures, and proceed to one commit, push, and PR because every required validation is green.

## Surprises & Discoveries

The current F2A and F2B implementation already uses `SourceFileStorage.read()` against stored raw source bytes, so the raw-source authority seam required for F2C is present and should be reused instead of redesigned.

The company display-name regression path is real in the current service flow.
`FinanceTwinService.syncCompanySourceFile()` always supplies either a trimmed `companyName` or a generated fallback name to `upsertCompany()`, which means a later sync with no `companyName` can overwrite a previously truthful display name.

The ledger-account master merge problem is also real in both repository implementations.
`upsertLedgerAccount()` is unconditional last-writer-wins today, so trial-balance or any later slice can overwrite richer chart-of-accounts name or type data.

The current summary contract is still workable after F2B, but a third slice will make per-slice attempted-versus-successful semantics harder to read unless the summary exposes that distinction explicitly instead of relying only on overall latest-run fields and freshness state.

The current extractor dispatch checks `trial_balance_csv` before `chart_of_accounts_csv`, and there are no dispatch-collision tests yet.
F2C should harden detection so a general-ledger CSV with explicit journal identity cannot accidentally fall through to a less specific extractor family.

The additive schema change for persisted journal lines required the local CI test database to be migrated before the Drizzle-backed finance-twin suite would pass again.
That is an environment follow-through step rather than a design flaw, but it is worth recording because the first focused DB-backed run failed until `pnpm run db:migrate:ci` caught the test database up to the new schema.

`finance_ledger_accounts.account_name` needed to become nullable in the schema so the general-ledger path could store truthful blanks instead of synthetic placeholders when a source omits account names.

## Decision Log

Decision: keep this slice inside the additive `finance-twin` bounded context rather than widening or mutating the engineering twin.
Rationale: the user explicitly requires the engineering-twin path to remain intact, and the existing finance-twin seams are already the correct product center.

Decision: implement `general_ledger_csv` as the third real extractor family and reject files that lack a truthful stable journal identity instead of inventing grouping heuristics.
Rationale: the acceptance bar explicitly forbids synthesizing multi-line journal grouping from row order, descriptions, or other weak heuristics.

Decision: persist real journal-entry and journal-line tables rather than storing general-ledger parsing output inside sync-run stats or summary JSON.
Rationale: F2C must add real persisted transactional finance state, not scaffolding or transient parsing theater.

Decision: keep `finance_ledger_accounts` as the shared account dimension, but harden ledger-account master merges by extractor authority.
Rationale: `chart_of_accounts_csv` is the authoritative account-master slice, while `trial_balance_csv` and `general_ledger_csv` should only fill blanks when better data does not exist.

Decision: make per-slice attempted-versus-successful semantics explicit in the summary contract if a third slice would otherwise make the read model ambiguous.
Rationale: the user explicitly called out this truthfulness risk for F2C.

Decision: store nullable ledger-account names instead of inventing placeholders when a lower-fidelity extractor omits them.
Rationale: truthful blanks are safer than synthetic account-master data, especially once general-ledger rows begin populating the shared account dimension.

Decision: GitHub connector work remains explicitly out of scope.
Rationale: this slice extends finance-twin extraction and truthfulness on top of F1 file-first ingest and must not move GitHub back toward the product center.

## Context and Orientation

Pocket CFO has already shipped F1 raw-source ingest, F2A trial-balance sync, and F2B chart-of-accounts sync.
The current repo state includes immutable source registration, raw file storage, deterministic parser dispatch for source ingest, additive finance-twin tables and routes, packaged local smokes for source ingest and account-catalog sync, and preserved engineering-twin reproducibility coverage.

The relevant bounded contexts for this slice are:

- `plans/` for the active F2C plan and any tiny closeout note in `FP-0010` only if strictly necessary
- `packages/domain` for finance-twin contracts, general-ledger read models, extractor keys, lineage target kinds, and slice-level freshness or attempted-versus-successful summary semantics
- `packages/db` for additive finance-twin schema changes and the forward-only migration
- `apps/control-plane/src/modules/finance-twin/` for extractor selection, raw-byte CSV parsing, persistence orchestration, per-slice freshness, summary assembly, routes, and tests
- `apps/control-plane/src/bootstrap.ts`, `apps/control-plane/src/lib/types.ts`, `apps/control-plane/src/app.ts`, and `apps/control-plane/src/test/database.ts` for container, route, and test wiring
- `tools/finance-twin-smoke.mjs`, `tools/finance-twin-account-catalog-smoke.mjs`, `tools/finance-twin-general-ledger-smoke.mjs`, and root `package.json` for packaged local proof
- `README.md` and `docs/ops/local-dev.md` for truthful active guidance

GitHub connector work is out of scope.
The engineering twin remains in place and must keep passing its reproducibility tests unchanged.
Replay and evidence behavior should stay unchanged unless implementation reveals a tiny documentation note is needed that the persisted finance sync-run plus lineage model remains the current finance evidence spine.

## Plan of Work

Implement this slice in six bounded passes.

First, extend the domain contracts so the finance twin can name `general_ledger_csv`, persist journal-entry and journal-line state, expose separate freshness for `trialBalance`, `chartOfAccounts`, and `generalLedger`, and make per-slice attempted-versus-successful state explicit enough for summary interpretation to stay truthful after the third slice lands.

Second, add additive database support for persisted journals and journal lines, plus the smallest schema hardening needed for truthful account-master merges and lineage target kinds, while keeping the F1 raw-source tables and the engineering-twin tables untouched.

Third, extend the finance-twin control-plane module with a deterministic raw-byte `general_ledger_csv` extractor, hardened extractor dispatch, repository operations for journal persistence, and a dedicated latest-snapshot general-ledger read route that lets an operator inspect the stored transactional state without building a broad query API.

Fourth, fix the company display-name preservation path and the ledger-account authority merge rules so later syncs cannot silently degrade previously stored finance state.

Fifth, add focused tests and a packaged general-ledger smoke that prove general-ledger extraction, persisted transactional state, lineage, and summary semantics while keeping F1 ingest, F2A trial-balance, F2B account-catalog, and engineering-twin reproducibility behavior green.

Sixth, update the stale active docs so the root guidance matches the merged F2B baseline plus the shipped F2C branch state honestly.

## Concrete Steps

1. Keep `plans/FP-0011-general-ledger-and-finance-twin-hardening.md` current throughout the slice, updating `Progress`, `Decision Log`, `Surprises & Discoveries`, and `Outcomes & Retrospective` after meaningful milestones.

2. Extend `packages/domain/src/finance-twin.ts` and `packages/domain/src/index.ts` to cover:
   - extractor keys for `trial_balance_csv`, `chart_of_accounts_csv`, and `general_ledger_csv`
   - lineage target kinds for persisted journal entries and journal lines
   - separate freshness slices for `trialBalance`, `chartOfAccounts`, and `generalLedger`
   - explicit latest-attempted versus latest-successful slice read models if needed to keep the summary legible
   - persisted journal-entry and journal-line contracts plus a dedicated general-ledger latest-snapshot view

3. Extend `packages/db/src/schema/finance-twin.ts`, `packages/db/src/schema/index.ts`, and `packages/db/drizzle/**` with additive support for:
   - `finance_journal_entries`
   - `finance_journal_lines`
   - new extractor enum values and lineage target kinds
   - any small schema hardening needed so ledger-account master data can truthfully preserve blanks or avoid lower-authority overwrites

4. Extend `apps/control-plane/src/modules/finance-twin/` with bounded modules that keep routes thin and extraction deterministic, likely including:
   - `general-ledger-csv.ts`
   - `general-ledger-csv.spec.ts`
   - `extractor-dispatch.spec.ts`
   - repository and service extensions for journal persistence and latest-snapshot reads
   - a tiny dedicated general-ledger read route only for the latest successful slice

5. Preserve the raw-source authority seam by reading stored source bytes through `SourceFileStorage.read()` for all implemented finance extractor families.
   Do not derive general-ledger state from ingest receipt summaries or any shallow parser samples.

6. Implement the general-ledger extractor with these rules:
   - require a stable journal or entry identity column such as `journal_id`, `entry_id`, `transaction_id`, or `entry_number`
   - require posting or transaction date
   - require account code
   - require debit and or credit columns
   - accept optional account name, account type, currency, and line-description fields
   - reject files that lack a stable journal identity instead of inventing grouping
   - do not invent reporting periods from journal dates alone

7. Fix the company display-name regression path so later syncs with no `companyName` preserve an already-good display name, while explicit non-empty `companyName` updates still rename the company truthfully.

8. Harden ledger-account master merges so:
   - `chart_of_accounts_csv` is authoritative for account name and account type when it provides values
   - `trial_balance_csv` and `general_ledger_csv` only fill blanks when no better data exists
   - lower-authority slices cannot overwrite richer existing account-master data
   - focused tests prove the policy in both the in-memory and Drizzle-backed paths

9. Add or update focused tests covering:
   - domain schema parsing for the new general-ledger and summary contracts
   - DB schema export coverage for the new journal tables
   - `general_ledger_csv` extractor behavior from raw bytes
   - extractor-dispatch non-collision behavior across the implemented CSV families
   - service-level sync behavior for general ledger, display-name preservation, and account-master authority semantics
   - repository persistence for journal entries, journal lines, and ledger-account merge rules
   - app-level sync and latest general-ledger read-route behavior if the route is added

10. Add `tools/finance-twin-general-ledger-smoke.mjs` and wire the root script in `package.json`.
    The packaged proof should show that:
    - F1 source ingest still stores raw files immutably
    - finance sync still reads from stored raw bytes directly
    - the latest successful general-ledger slice is persisted and queryable
    - summary freshness and slice semantics stay explicit after the third slice lands

11. Update the stale active docs in:
    - `README.md`
    - `docs/ops/local-dev.md`
    - one additional active doc only if implementation proves the active guidance would otherwise remain misleading

12. Run validation in this exact order:

   ```bash
   pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/finance-twin/general-ledger-csv.spec.ts src/modules/finance-twin/extractor-dispatch.spec.ts src/modules/finance-twin/service.spec.ts src/modules/finance-twin/drizzle-repository.spec.ts src/app.spec.ts
   pnpm --filter @pocket-cto/domain exec vitest run src/finance-twin.spec.ts
   pnpm --filter @pocket-cto/db exec vitest run src/schema.spec.ts
   pnpm smoke:source-ingest:local
   pnpm smoke:finance-twin:local
   pnpm smoke:finance-twin-account-catalog:local
   pnpm smoke:finance-twin-general-ledger:local
   pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm ci:repro:current
   ```

13. If and only if every required validation command is green, create exactly one local commit:

   ```bash
   git commit -m "feat: extend finance twin with general ledger"
   ```

14. If fully green and edits were made, confirm the branch remains `codex/f2c-general-ledger-and-finance-twin-hardening-local-v1`, show the requested git status or log commands, push that exact branch, verify the remote head, and create or report the PR into `main` with the requested title and body.

## Validation and Acceptance

Required validation order:

```bash
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/finance-twin/general-ledger-csv.spec.ts src/modules/finance-twin/extractor-dispatch.spec.ts src/modules/finance-twin/service.spec.ts src/modules/finance-twin/drizzle-repository.spec.ts src/app.spec.ts
pnpm --filter @pocket-cto/domain exec vitest run src/finance-twin.spec.ts
pnpm --filter @pocket-cto/db exec vitest run src/schema.spec.ts
pnpm smoke:source-ingest:local
pnpm smoke:finance-twin:local
pnpm smoke:finance-twin-account-catalog:local
pnpm smoke:finance-twin-general-ledger:local
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is met when all of the following are true:

- a deterministic `general_ledger_csv` extractor exists and syncs from stored raw source bytes rather than ingest receipt summaries
- the Finance Twin persists explicit journal-entry and journal-line state rather than transient parsing output
- journal identity is explicit and truthful, with no synthetic multi-line grouping from weak heuristics
- source lineage for the new path remains explicit through source, snapshot, and source-file IDs
- freshness is separate and truthful for `trialBalance`, `chartOfAccounts`, and `generalLedger`
- the finance summary remains legible after the third slice lands and keeps attempted-versus-successful slice semantics explicit
- later syncs with no `companyName` preserve a previously truthful company display name
- lower-authority extractor runs can no longer degrade richer ledger-account master data
- `README.md` and `docs/ops/local-dev.md` reflect the shipped repo state truthfully
- F1 source-ingest behavior still works
- F2A trial-balance sync still works
- F2B account-catalog sync still works
- engineering-twin reproducibility tests still pass unchanged

Provenance, freshness, replay, and limitation posture:
this slice must keep raw sources immutable, keep source lineage queryable, surface missing, stale, or failed slice coverage plainly, and avoid implying broader finance completeness than the implemented `trialBalance`, `chartOfAccounts`, and `generalLedger` slices actually support.
No new CFO Wiki, report, approval, or mission-output behavior is in scope here.

## Idempotence and Recovery

This slice is additive-first and safe to retry when followed carefully.

- Re-running targeted tests, smokes, and sync operations should be safe because the test DB reset truncates finance-twin state between cases.
- Re-running a finance sync for the same uploaded source should update or replace the derived finance slice state deterministically without mutating raw source bytes.
- If the schema or migration shape is wrong, revert the uncommitted finance-twin files, regenerate or rewrite the migration cleanly, and rerun the focused finance validations before expanding to the full ladder.
- If validation fails outside this slice or outside the known narrow engineering-twin reproducibility surface, stop and report the blocker instead of widening scope.

## Artifacts and Notes

Expected artifacts from this slice:

- one active F2C Finance Plan
- additive finance-twin domain and DB changes for general-ledger persistence
- deterministic `general_ledger_csv` extractor support
- focused tests for extractor, dispatch, repository, service, route, and smoke behavior
- packaged local smoke evidence for persisted general-ledger state
- truthful doc updates for the stale root guidance
- one clean commit, push, and PR only if the full validation ladder is green

Documentation boundary note:
the active-doc boundary itself is unchanged, but the listed active docs need truthfulness updates so new Codex runs start from the current shipped F2 state rather than stale F0 or F2A framing.

## Interfaces and Dependencies

Package and runtime boundaries:

- `@pocket-cto/domain` remains the source of truth for finance-twin contracts
- `@pocket-cto/db` remains limited to schema and DB helpers
- `apps/control-plane` owns raw-byte extraction, repository orchestration, freshness rollup, and HTTP transport
- `apps/web` remains out of scope unless one tiny read-only surface becomes strictly necessary, which is not currently planned

Runtime expectations:

- reuse the existing Postgres and S3-compatible object-store configuration from F1 and the shipped F2 slices
- keep internal `@pocket-cto/*` package names unchanged
- add no new environment variables unless a truly unavoidable need emerges and is documented in the same slice

Downstream dependency note:
this slice should become the truthful base for later F2 finance-summary and transaction-level work, but it must not begin F3, F4, F5, or F6 behavior.

## Outcomes & Retrospective

F2C now ships a deterministic `general_ledger_csv` path that reads stored raw source bytes, rejects files without explicit journal identity, persists `finance_journal_entries` and `finance_journal_lines`, records source-to-entry and source-to-line lineage, and exposes the latest stored journal state through a dedicated finance-twin read route and packaged local smoke.

The truthfulness hardening goals also landed in this slice.
Company display names now preserve the last truthful explicit name when later syncs omit `companyName`, and ledger-account master data now merges by extractor authority so chart-of-accounts remains authoritative while trial-balance and general-ledger slices only fill blanks.
The finance summary contract now exposes `latestAttemptedSlices` separately from `latestSuccessfulSlices`, and freshness stays explicit for `trialBalance`, `chartOfAccounts`, and `generalLedger`.

Active-doc truthfulness is updated in `README.md`, `docs/ops/local-dev.md`, and the minimal `START_HERE.md` touch so the repo guidance no longer implies the branch is still only at F0 or F2A.

Validation passed in the requested ladder with one in-slice correction during `typecheck`:

- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/finance-twin/general-ledger-csv.spec.ts src/modules/finance-twin/extractor-dispatch.spec.ts src/modules/finance-twin/service.spec.ts src/modules/finance-twin/drizzle-repository.spec.ts src/app.spec.ts`
- `pnpm --filter @pocket-cto/domain exec vitest run src/finance-twin.spec.ts`
- `pnpm --filter @pocket-cto/db exec vitest run src/schema.spec.ts`
- `pnpm smoke:source-ingest:local`
- `pnpm smoke:finance-twin:local`
- `pnpm smoke:finance-twin-account-catalog:local`
- `pnpm smoke:finance-twin-general-ledger:local`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

The `typecheck` pass initially caught two stale finance-twin service stubs in existing control-plane specs plus two small strict-mode nits in the new finance-twin code; all four were inside the F2C slice and were fixed before re-running the ladder from the top.

Deferred follow-up for the next F2 slice:
keep the additive transactional base intact and extend finance-twin read clarity around cross-slice state, but do not widen into CFO Wiki, answer UX, reports, or non-ledger finance feeds yet.
