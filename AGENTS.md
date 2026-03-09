# Pocket CTO repository instructions for Codex

You are working on Pocket CTO, a GitHub-first, evidence-native engineering mission control system.

Read this file before doing any work. For non-trivial work, also read `PLANS.md`, `plans/ROADMAP.md`, and the current ExecPlan in `plans/`.

## Non-negotiable working rules

1. **Prefer modular code.**
   Do not collapse unrelated responsibilities into one file.
   Use small modules, public package entrypoints, and explicit interfaces.
   Soft cap: keep most source files below 300 logical lines.
   If a file starts mixing transport, business logic, persistence, and formatting, split it.

2. **Use an ExecPlan for meaningful work.**
   If the task spans multiple files, more than one package, or is likely to take more than 45 minutes, create or update an ExecPlan in `plans/` before coding.
   Follow `PLANS.md` exactly.

3. **Preserve architecture boundaries.**
   - `packages/domain`: pure contracts, schemas, shared domain types
   - `packages/db`: persistence schema and DB helpers only
   - `packages/codex-runtime`: Codex App Server protocol wrapper only
   - `packages/config`: env parsing and runtime config
   - `packages/stack-packs`: pack interfaces and manifests
   - `packages/testkit`: fixtures and reusable test helpers
   - `apps/control-plane`: orchestration, APIs, webhooks, evidence, twin, workers
   - `apps/web`: read models and operator UI only

4. **Routes stay thin.**
   HTTP route files should parse input, call a service, and serialize output.
   They should not contain SQL, orchestration logic, or prompt-building.

5. **Database changes are additive first.**
   Avoid destructive schema changes unless the ExecPlan explicitly calls for them and includes a rollback path.

6. **Replay and evidence are mandatory.**
   Any mission state change or task lifecycle change must have a replay event or an explicit reason why it does not.

7. **No hidden policy.**
   If a workflow rule matters, encode it in code, config, `WORKFLOW.md`, or a checked-in doc.
   Do not rely on ephemeral prompt memory.

8. **Do not default to PAT-based GitHub access.**
   Use the GitHub App model unless a local dev-only shortcut is explicitly marked as temporary.

9. **Ship the spine before magic.**
   The mission contract, replay events, workspaces, approvals, and evidence layers are more important than voice intake, pretty UI, or multi-channel integrations.

10. **When uncertain, narrow scope instead of diluting the design.**
    Prefer one strong vertical slice over three half-built surfaces.

11. **Keep repo hygiene explicit.**
    - Never commit local env files; `.env.example` is the only env file that stays tracked.
    - Never commit generated outputs like `node_modules`, `dist`, `.next`, `coverage`, local runtime artifacts, or `*.tsbuildinfo`.
    - If a new toolchain creates new generated files, update `.gitignore` and `pnpm repo:hygiene` in the same change.
    - Keep TypeScript `src/` trees source-only; do not keep generated `.js` or `.d.ts` companions there.

## Definition of done for any milestone

A milestone is not done until all of the following are true:

- code exists in the right module boundaries
- tests exist for the touched behavior
- `README` or architecture docs are updated if behavior changed
- the relevant ExecPlan progress section is updated
- there is an explicit acceptance check a human can run
- any new mission/task state emits replay events
- any new user-visible action has clear evidence outputs

## Modular code preferences

Use these patterns by default:

- `controller.ts` or `routes.ts` for transport
- `service.ts` for business logic
- `repository.ts` for persistence
- `schema.ts` or `types.ts` for validation and contracts
- `formatter.ts` for approval cards or summaries
- `events.ts` for replay/outbox event definitions

If a bounded context grows, create a folder with those modules instead of extending one file.

## Default implementation preferences

- TypeScript strict mode
- Zod for external input validation
- Drizzle ORM for database schema and queries
- Fastify for control-plane HTTP endpoints
- Next.js App Router for the web UI
- Pino for logs
- OpenTelemetry hooks from the beginning
- GitHub App authentication for repo integrations
- Postgres outbox pattern for async notifications and projections
- MinIO or S3-compatible artifact store
- PWA first, Telegram later
- event-assisted orchestration using webhooks plus periodic reconciliation

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm check
pnpm db:generate
pnpm db:migrate
docker compose up -d
```

## Skills in this repo

Skills live in `.agents/skills`.

Use them deliberately:

- `$execplan-orchestrator` for any complex milestone or refactor
- `$modular-architecture-guard` when implementing or refactoring code
- `$evidence-bundle-auditor` when shipping replay, evidence, or approval card behavior
- `$github-app-integration-guard` when implementing GitHub auth, webhooks, or PR flows

## Files you should usually read before large changes

- `README.md`
- `PLANS.md`
- `plans/ROADMAP.md`
- current ExecPlan in `plans/`
- `docs/architecture/overview.md`
- `docs/architecture/repo-map.md`
- `docs/architecture/mission-ir.md`
- `docs/architecture/state-machine.md`
- `docs/architecture/replay-and-evidence.md`
- `docs/architecture/security-model.md`

## Forbidden shortcuts

Avoid these unless an ExecPlan explicitly approves them:

- one giant `index.ts` with all logic
- route handlers talking directly to the database
- embedding giant workflow rules in code comments instead of checked-in policy files
- using a shared workspace for multiple missions
- skipping replay events "for now"
- using uncontrolled network access by default
- auto-merging PRs
- treating local host access as the security boundary for future multi-user designs

## Reporting progress

At each stopping point:

- update the active ExecPlan `Progress` section
- record any design changes in the ExecPlan `Decision Log`
- if you discovered a better boundary, update the relevant architecture doc
- mention exactly what remains

## Repo-specific north star

The first compelling proof point is not a fancy UI.
It is a text request that becomes a persisted mission, queues tasks, starts an isolated Codex runtime, records replay events, and returns a decision-ready proof bundle.
