# Add deterministic parser dispatch and durable ingest receipts on top of F1B

## Purpose / Big Picture

This plan implements the next additive **F1 parser dispatch and ingest receipt** slice for Pocket CFO.

The user-visible goal is to move from immutable raw-file registration to truthful deterministic ingest runs that can be re-run, inspected, and reviewed without widening into Finance Twin writes, CFO Wiki compilation, reports, monitoring, or the web upload UI.
After this slice, an operator should be able to trigger ingest for a stored `source_file`, have the control plane choose a deterministic parser from source metadata, persist a durable ingest-run receipt in Postgres, and inspect the resulting status, warnings, errors, and compact summary or inventory through minimal control-plane routes.

This matters now because later F2 and F3 slices need a trustworthy parser-dispatch seam and durable ingest history before they can write twin facts or compile operator-facing knowledge.

## Progress

- [x] 2026-04-08T22:26:17Z Complete the required preflight: confirm fetched `origin/main`, clean branch state, GitHub auth, F1A/F1B path presence on `origin/main`, and local Postgres plus object storage reachability through the repo-standard local-dev path.
- [x] 2026-04-08T22:26:17Z Read the active repo guidance, F0/F1A/F1B plans, scoped AGENTS files, Finance Plan rules, and source-provenance guidance; inspect the current source-registry, raw-file ingest, schema, storage, and test surfaces.
- [x] 2026-04-08T22:26:17Z Define the smallest truthful F1C shape: one additive `source_ingest_runs` persistence seam with DB-backed compact receipt fields, deterministic parser dispatch from stored `source_file` metadata, synchronous execution, and explicit replay deferral.
- [x] 2026-04-08T22:43:09Z Implement additive domain contracts, DB schema and migration, source ingest services, parser registry, routes, and deterministic tests for CSV, markdown text, ZIP inventory, and metadata fallback coverage.
- [x] 2026-04-08T22:43:09Z Run the required validation sequence, update this plan with results, and publish exactly one commit, push, and PR only if everything is green.

## Surprises & Discoveries

- Observation: F1B already established `source_files` as the immutable raw-file truth layer while `source_snapshots` remain the backward-compatible summary surface for existing list and detail routes.
  Evidence: `packages/domain/src/source-registry.ts`, `packages/db/src/schema/sources.ts`, and `apps/control-plane/src/modules/sources/service.ts` mirror registered file metadata into snapshots and keep current read models pointed at snapshots.

- Observation: no parser library is already available in the repo for CSV, ZIP, PDF, or XLSX work.
  Evidence: `apps/control-plane/package.json`, the root `package.json`, and repo searches show no existing CSV or ZIP parser dependency beyond the AWS S3 client and current monorepo packages.

- Observation: the current replay seam is still mission-scoped and would widen materially if source ingest were added to it in this slice.
  Evidence: `packages/domain/src/replay-event.ts` and the surrounding replay implementation model only mission and task events today, with no generic source-domain ledger.

- Observation: the repo-level `pnpm db:migrate` path prepares only the primary database, while the control-plane DB-backed test surface needs both the primary and test databases migrated.
  Evidence: the new DB-backed ingest tests failed against a missing `source_ingest_runs` relation until the repo-standard `pnpm run db:migrate:ci` command migrated both `DATABASE_URL` and `TEST_DATABASE_URL`.

## Decision Log

- Decision: add one new `source_ingest_runs` persistence seam instead of separate ingest-run and receipt tables.
  Rationale: one row per ingest attempt is the smallest truthful model that can persist status, parser choice, warnings, errors, timestamps, and compact DB-backed receipt summaries without introducing a second artifact lifecycle in F1.

- Decision: preserve `source_snapshots` as the backward-compatible source summary surface and update their ingest status during F1C runs.
  Rationale: the existing F1A/F1B routes already expose snapshot summaries, so keeping those records current preserves compatibility while the new ingest-run surface lands beneath them.

- Decision: keep parser coverage to deterministic `csv_tabular`, `markdown_text`, `zip_inventory`, and `metadata_fallback`.
  Rationale: those formats are clean to support with the current dependency set, while PDF and XLSX parsing would widen the slice or force new parsing libraries. Unsupported receipts for PDF, XLSX, and images remain acceptable if they are explicit and durable.

- Decision: execute ingest synchronously in the request path while still persisting `processing` and terminal run states.
  Rationale: the user requested a small additive slice and prefers synchronous execution unless a wrapper is clearly cleaner. The sync path keeps the design simple while still producing durable status records.

- Decision: defer replay integration for source ingest.
  Rationale: adding generic source-domain replay now would widen the event model beyond the clean F1C scope. This limitation will remain explicit in code and plan notes.

- Decision: GitHub connector work remains explicitly out of scope.
  Rationale: the source-registry and ingest path must land beside the legacy GitHub connector, not through it and not by deleting it.

## Context and Orientation

Pocket CFO is in the F1 source-registry and raw-ingest phase.
F1A shipped the generic source-registry foundation and F1B added immutable object-store-backed `source_files` plus provenance records.
This slice starts from the freshly fetched `origin/main` state where the current branch tip matched `origin/main` before implementation began.

The relevant bounded contexts are:

- `packages/domain` for parser-selection, ingest-run, and receipt contracts
- `packages/db` for additive ingest-run persistence and forward-only migrations
- `apps/control-plane/src/modules/sources/` for parser dispatch, object-store reads, ingest orchestration, repository access, and thin routes
- `apps/control-plane/src/app.ts`, `apps/control-plane/src/bootstrap.ts`, `apps/control-plane/src/lib/types.ts`, and `apps/control-plane/src/lib/http-errors.ts` for runtime wiring and route exposure

GitHub connector work is out of scope.
Finance Twin writes, CFO Wiki compilation, reports, monitoring, and web UI work are out of scope.
No active-doc boundary changes are intended in this slice unless implementation reveals a direct conflict.

## Plan of Work

Implement this F1C slice in four bounded passes.

First, extend the pure domain and database layers with additive contracts and one `source_ingest_runs` persistence seam that can hold parser selection, run status, warnings, errors, timestamps, and compact receipt summaries in Postgres.
Second, add a parser registry plus deterministic parser modules under `apps/control-plane/src/modules/sources/`, along with object-store read support so stored `source_file` rows can be ingested from their immutable bytes.
Third, extend the sources repository, service, and routes so `POST /sources/files/:sourceFileId/ingest` creates a durable run, executes the chosen parser synchronously, updates the linked snapshot ingest status, and returns the resulting run detail, while `GET /sources/files/:sourceFileId/ingest-runs` and `GET /sources/ingest-runs/:ingestRunId` expose the durable run history.
Fourth, add deterministic parser, service, repository, and HTTP tests, then run the exact required validation order before publishing.

Keep module boundaries explicit.
Routes stay thin, parsers stay deterministic and side-effect free, storage interaction stays in `storage.ts`, and repository access stays outside the route layer.

## Concrete Steps

1. Create and keep this active Finance Plan current through implementation and publication.

2. Extend `packages/domain/src/source-registry.ts` and `packages/domain/src/index.ts` with additive schemas and types for:
   - parser keys and parser-selection metadata
   - ingest-run statuses
   - ingest warnings and errors
   - compact receipt summary shapes for CSV tabular, markdown text, ZIP inventory, and metadata fallback outputs
   - ingest-run list and detail views

3. Extend `packages/db/src/schema/sources.ts`, `packages/db/src/schema/index.ts`, and `packages/db/src/schema.spec.ts` with additive enums and one new table for `source_ingest_runs`.
   The table should keep `source_file_id`, `source_id`, `source_snapshot_id`, parser key, checksum, storage ref, status, timestamps, warnings, errors, and compact summary data explicit.

4. Generate or author the forward-only Drizzle migration under `packages/db/drizzle/` and update `packages/db/drizzle/meta/` as needed.

5. Extend `apps/control-plane/src/modules/sources/` with the F1C implementation, likely including:
   - `schema.ts` updates for ingest route params
   - `routes.ts` updates for `POST /sources/files/:sourceFileId/ingest`, `GET /sources/files/:sourceFileId/ingest-runs`, and `GET /sources/ingest-runs/:ingestRunId`
   - `service.ts` updates or service-helper extraction for ingest orchestration
   - `repository.ts`, `drizzle-repository.ts`, and `repository-mappers.ts` updates for ingest-run persistence
   - `storage.ts` read support for immutable object-store bytes
   - new deterministic parser and dispatch helpers such as `dispatch.ts`, `parser-registry.ts`, `parser-types.ts`, and parser-specific modules as needed
   - `errors.ts` plus `apps/control-plane/src/lib/http-errors.ts` updates only as needed for ingest-run not-found or unsupported-storage cases

6. Update `apps/control-plane/src/bootstrap.ts`, `apps/control-plane/src/app.ts`, and `apps/control-plane/src/lib/types.ts` only as needed to wire the new ingest capabilities into the existing source-service surface.

7. Add deterministic tests covering:
   - parser dispatch selection rules
   - CSV receipt summaries
   - markdown text or heading receipt summaries
   - ZIP inventory receipt summaries
   - metadata-fallback receipts for unsupported binary or image types
   - service-level ingest-run persistence and snapshot status updates
   - DB-backed repository persistence for ingest runs
   - HTTP route behavior through the app container

8. Run validation in this exact order using the repo-default local env:

   ```bash
   pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/sources/*.spec.ts src/app.spec.ts
   pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm ci:repro:current
   ```

   If the new ingest-run persistence needs direct DB integration proof beyond the existing targeted spec set, also run:

   ```bash
   pnpm ci:integration-db
   ```

9. If and only if every required validation is green, create exactly one local commit:

   ```bash
   git commit -m "feat: add parser dispatch and ingest receipts"
   ```

10. If green, confirm the branch name, show the requested git status and log commands, push `codex/f1c-parser-dispatch-and-ingest-receipts-local-v1`, verify the remote head, and create or report the PR into `main` with the requested title and body.

## Validation and Acceptance

Required validation commands, in order:

```bash
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/sources/*.spec.ts src/app.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Run `pnpm ci:integration-db` too if the new ingest-run persistence or object-store read path needs direct full-stack validation.

Validation results for this slice:

- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/sources/*.spec.ts src/app.spec.ts` passed after running the repo-standard dual-database migrate path for the test database.
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts` passed.
- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm test` passed.
- `pnpm ci:repro:current` passed and reported `CI reproduction succeeded`.

Acceptance is met when all of the following are true:

- `packages/domain` defines additive parser-selection, ingest-run, and receipt-summary contracts without deleting F1A/F1B source, snapshot, file, or provenance contracts
- `packages/db` persists additive ingest-run rows through a forward-only migration
- the control plane deterministically selects a parser from stored `source_file` metadata using media type, file extension, and source kind
- `POST /sources/files/:sourceFileId/ingest` creates a durable ingest run, records parser choice plus timestamps, and returns a truthful receipt summary
- `GET /sources/files/:sourceFileId/ingest-runs` and `GET /sources/ingest-runs/:ingestRunId` expose the durable run history
- supported coverage includes CSV tabular, markdown text, ZIP inventory, and metadata fallback receipts
- unsupported formats such as PDF, XLSX, and binary images are handled truthfully through deterministic metadata fallback rather than fake extraction
- F1A/F1B source list, detail, and file-registration behavior remain backward compatible
- limitations remain explicit: no Finance Twin writes, no CFO Wiki, no reports, no monitoring, no web upload UI, and no source-domain replay yet

## Idempotence and Recovery

This slice is additive-first and safe to retry when followed carefully.

- Re-running tests is safe because the existing control-plane test reset truncates the relevant persisted tables between cases and will be extended to cover the new ingest-run table.
- Re-running `POST /sources/files/:sourceFileId/ingest` should create a new ingest-run row rather than mutating a historical run in place, which keeps retries reviewable and auditable.
- The sync ingest path should update the current run row and linked snapshot status transactionally where possible; if a failure occurs after the run row is created, the terminal row should still record the error truthfully instead of disappearing.
- If the migration or repository shape is wrong, restore uncommitted files, regenerate the migration cleanly, and rerun the targeted validations before proceeding.
- The slice does not mutate legacy GitHub state, twin state, wiki state, reports, or monitoring data, so rollback scope stays isolated to additive source-ingest code and schema.

## Artifacts and Notes

Expected artifacts from this slice:

- one active F1C Finance Plan
- additive domain contracts for parser selection and durable ingest receipts
- additive schema and migration for `source_ingest_runs`
- deterministic parser and dispatch modules under `apps/control-plane/src/modules/sources/`
- deterministic tests for parser behavior, ingest persistence, and HTTP routes
- one clean commit, push, and PR if validation is fully green

Replay and evidence note:
this slice records durable ingest runs and receipt summaries, but it does not yet append source-domain replay events or produce evidence bundles.
That limitation remains explicit and is the main deliberate deferral from this slice.

Freshness and limitation note:
receipt summaries must say when coverage is structured, inventory-only, or metadata-only, and unsupported extraction must remain visible rather than implied as complete parsing.

## Interfaces and Dependencies

Package and runtime boundaries:

- `@pocket-cto/domain` remains the contract source of truth
- `@pocket-cto/db` remains limited to schema and DB helpers
- `apps/control-plane` owns parser dispatch, object-store reads, repository orchestration, and HTTP transport

Configuration expectations:

- reuse the existing object-store configuration from F1B
- do not add new environment variables unless implementation proves one is strictly unavoidable
- keep internal `@pocket-cto/*` package names unchanged

Dependency posture:

- prefer no new dependencies in this slice
- support CSV, markdown text, ZIP inventory, and metadata fallback with deterministic local code
- explicitly defer PDF and XLSX extraction rather than widening the slice through new parser libraries

No active-doc, stack-pack, or skill changes are expected from this slice.

## Outcomes & Retrospective

This slice shipped the planned additive F1C outcome.

What now exists:
the repo now supports deterministic parser dispatch and durable ingest receipts on top of F1B raw source files while preserving the existing source-registry and snapshot summary surfaces.
An operator can trigger ingest for a stored `source_file`, have the control plane choose a deterministic parser from stored metadata, persist a durable `source_ingest_runs` record, and inspect run history plus compact receipt summaries through dedicated control-plane routes.

Implemented coverage:

- CSV files produce compact tabular receipt summaries.
- Markdown files produce compact text-and-heading receipt summaries.
- ZIP files produce deterministic inventory receipts.
- Unsupported binary and image files produce explicit metadata-fallback receipts instead of implied extraction.

Deliberate deferrals kept explicit:

- no Finance Twin writes
- no CFO Wiki compilation
- no reports or monitoring work
- no web UI upload flow
- no source-domain replay event integration yet
- no PDF or XLSX structured extraction in this slice

Active-doc boundary changes:
none beyond this active Finance Plan. The shipped behavior stays within the existing F1 source-ingest operating boundary without changing broader product direction or milestone sequencing.
