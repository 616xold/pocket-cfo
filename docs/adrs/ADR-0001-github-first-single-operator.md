# ADR-0001: GitHub-first and single-operator first

- Status: Accepted
- Date: 2026-03-08

## Context

Pocket CTO could try to support many trackers, many channels, and many users from the start.
That would slow down the core systems work and dilute the trust model.

## Decision

Pocket CTO v1 is GitHub-first and single-operator first.

## Consequences

Good:

- strong initial distribution surface
- webhook-driven architecture
- simpler trust model
- easier dogfooding

Trade-offs:

- no immediate multi-tracker portability
- narrower initial audience
