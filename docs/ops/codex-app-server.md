# Codex App Server integration notes

Pocket CTO uses Codex App Server as the worker runtime.

## Mental model

- a mission contains one or more tasks
- each task can own a Codex thread
- each task runs inside a single isolated workspace
- progress comes back as item and turn events
- approvals can interrupt execution and must be reflected in Pocket CTO state

## Initial integration goal

Do not implement the entire protocol at once.

Implement these pieces first:

1. process bootstrap and initialize handshake
2. `thread/start`
3. `turn/start`
4. streaming event capture
5. `turn/interrupt`
6. approval request handling for commands and file changes

## Mapping rules

- Codex thread id belongs on the mission task record
- streamed item events become replay events
- approval requests become Pocket CTO approval records
- final turn completion updates task status and artifact placeholders

## Package map

- protocol types: `packages/codex-runtime/src/protocol.ts`
- client wrapper: `packages/codex-runtime/src/client.ts`
- control-plane adapter: `apps/control-plane/src/modules/runtime-codex/`
