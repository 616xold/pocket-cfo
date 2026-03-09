# Control-plane app instructions

The control plane is the heart of Pocket CTO.
Keep it boring, modular, and auditable.

## Local rules

- Keep route files thin.
- Put validation in `schema.ts` or domain schemas.
- Put orchestration logic in services or worker modules.
- Put replay logic in the replay module, not scattered across routes.
- Avoid direct DB calls from route handlers.
- If a module grows, split by responsibility before it becomes a god file.
- Favor explicit names like `MissionService`, `ReplayService`, `WorkspaceManager`.

## Priority order

1. mission spine
2. replay and evidence
3. runtime integration
4. GitHub webhooks
5. twin extraction
6. pocket UX adapters
