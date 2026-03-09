# Repository map

This is the intended package and app decomposition for Pocket CTO.

## Applications

### `apps/control-plane`

Owns orchestration, APIs, webhook ingress, replay appends, evidence assembly, worker lifecycle, and runtime adapters.

Submodules:

- `modules/missions/` for mission intake, validation, service, and persistence boundary
- `modules/replay/` for append and query of replay events
- `modules/evidence/` for proof-bundle and artifact-facing logic
- `modules/runtime-codex/` for Codex App Server adapter glue
- `modules/github/` for GitHub App ingress and repo operations
- `modules/workspaces/` for isolated workspace lifecycle
- `modules/approvals/` for approval records and actions
- `modules/twin/` for engineering-twin sync and query
- `modules/outbox/` for async delivery and projections

### `apps/web`

Owns operator-facing read models and mobile-safe mission presentation.
It should not talk directly to the database.

## Packages

### `packages/domain`

Pure domain contracts shared across the repo.
No persistence or runtime side effects.

### `packages/db`

Drizzle schema and DB helpers only.

### `packages/codex-runtime`

Codex App Server protocol types and client wrapper.

### `packages/config`

Environment parsing and runtime configuration.

### `packages/stack-packs`

Reusable stack-specific policy and workflow hints.

### `packages/testkit`

Fixtures and test helpers shared across packages.

## Planning and workflow files

- `AGENTS.md` is the root coding contract for Codex
- `PLANS.md` defines the ExecPlan standard
- `WORKFLOW.md` is the repository-owned workflow contract
- `plans/ROADMAP.md` is the milestone map
- `plans/EP-0001-mission-spine.md` is the first active ExecPlan
