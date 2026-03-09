# ADR-0002: Postgres plus outbox, no Redis in v1

- Status: Accepted
- Date: 2026-03-08

## Context

The original concept allowed Postgres plus Redis.
For a solo first build, Redis adds operational surface area that the core mission spine does not strictly need.

## Decision

Use Postgres as the canonical state store plus a Postgres outbox pattern for async delivery.
Defer Redis until scale or latency proves it necessary.

## Consequences

Good:

- simpler local development
- fewer moving parts
- easier reasoning about state

Trade-offs:

- less headroom for high-throughput queue fanout
- some lease patterns require more care
