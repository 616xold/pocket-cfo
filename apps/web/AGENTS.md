# Pocket CTO web app instructions for Codex

This app is the operator surface.
It renders mission read models, replay timelines, approval cards, and mobile-safe summaries.

## Boundaries

- Do not import from `@pocket-cto/db` directly.
- Do not add orchestration logic here.
- Do not embed GitHub credentials or webhook handling here.
- Fetch through control-plane HTTP APIs or dedicated client modules in `lib/`.
- Keep presentational components small and focused.

## Preferred split

- `app/` for routes and layout
- `components/` for UI pieces
- `lib/` for API clients and formatters

## Definition of done

A UI change is complete when:

- it preserves mobile readability
- it does not leak backend concerns into route files
- the fetching logic is reusable
- states like loading, empty, stale, and error are explicit
- the touched routes still reflect the evidence-first product thesis
