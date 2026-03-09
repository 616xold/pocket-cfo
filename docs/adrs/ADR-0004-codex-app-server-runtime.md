# ADR-0004: Codex App Server is the runtime contract

- Status: Accepted
- Date: 2026-03-08

## Context

Pocket CTO needs a durable coding runtime with thread lifecycle, streaming events, and approvals.

## Decision

Use Codex App Server as the worker runtime contract for mission tasks.

## Consequences

Good:

- aligns with long-horizon coding workflows
- gives thread persistence and approval flows
- keeps Pocket CTO focused on control-plane concerns

Trade-offs:

- runtime integration requires protocol work
- product is partially coupled to Codex semantics
