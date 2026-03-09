# Outbox module placeholder

This bounded context is intentionally reserved for a later milestone.
Keep its logic separate from routes, mission orchestration, and unrelated integrations.

Expected responsibilities:

- publish async events and projection jobs from Postgres outbox rows
- support retry, backoff, and dead-letter handling later
- keep side-effect delivery separate from core writes
