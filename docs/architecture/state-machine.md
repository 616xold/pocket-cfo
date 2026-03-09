# Mission and task state machine

Pocket CTO uses a mission-level state and a task-level state.

The mission state tells the operator the overall situation.
The task state tells the orchestrator what is safe to do next.

## Mission states

- `draft`
- `planned`
- `queued`
- `running`
- `awaiting_approval`
- `succeeded`
- `failed`
- `cancelled`
- `paused`

## Task roles

- `planner`
- `scout`
- `executor`
- `reviewer`
- `sre`

## Task states

- `pending`
- `claimed`
- `running`
- `blocked`
- `awaiting_approval`
- `succeeded`
- `failed`
- `cancelled`

## Transition rules

### Mission transitions

- `draft -> planned` when the compiler output is complete and valid
- `planned -> queued` when tasks are materialized
- `queued -> running` when the first task starts
- `running -> awaiting_approval` when an approval gate blocks progress
- `awaiting_approval -> running` when approval is granted
- `running -> succeeded` when required tasks succeed and the proof bundle is complete
- `running -> failed` when a terminal failure occurs
- any non-terminal state -> `cancelled` when the operator cancels
- `running -> paused` when the operator pauses a long mission

### Task transitions

- `pending -> claimed` when a worker acquires a lease
- `claimed -> running` when runtime execution starts
- `running -> blocked` when prerequisites or context are missing
- `running -> awaiting_approval` when the runtime requests a gated action
- `awaiting_approval -> running` when approved
- `running -> succeeded` when outputs are valid
- `running -> failed` when retries are exhausted or a fatal error occurs
- `claimed` or `running -> cancelled` on operator cancellation

## Replay requirements

Every state transition must emit a replay event with:

- mission id
- task id if relevant
- old state
- new state
- timestamp
- actor or system source
- reason code if available

During M0 text intake, mission creation stops at `queued`.
The control plane emits `mission.status_changed` with
`from = "planned"`, `to = "queued"`, and
`reason = "tasks_materialized"` after the initial `task.created` events.
The worker spine will later own task `pending -> claimed`, and runtime bootstrap
will later own the mission `queued -> running` execution transition.

## Repository implementation map

- Domain enums: `packages/domain/src/mission.ts`, `packages/domain/src/mission-task.ts`
- DB schema: `packages/db/src/schema/missions.ts`
- Orchestrator logic: `apps/control-plane/src/modules/orchestrator/task-state-machine.ts`
