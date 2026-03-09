# DB package instructions

Keep schema changes additive first.
Prefer explicit table and column names over hidden abstractions.

## Rules

- Schema files live under `src/schema/`
- Split tables by bounded context
- Use helper columns from `src/schema/shared.ts`
- If a change impacts mission lifecycle or replay, update the architecture docs
- Do not hide important SQL shape behind giant utility factories
- Add tests for any domain-critical query helper
