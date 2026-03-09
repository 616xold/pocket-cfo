# Pocket CTO architecture overview

Pocket CTO is a GitHub-first, evidence-native engineering mission control system.

A user sends a text request, issue reference, or alert.
Pocket CTO compiles that input into a typed mission.
The control plane decides how to execute that mission, starts isolated workspaces, invokes Codex App Server threads, collects proof, and returns concise approval-ready outputs.

## Product boundary

This project is intentionally narrow in v1.

In scope:

- single operator
- one trust boundary
- GitHub App integration
- build and discovery missions first
- PWA-based operator surface
- replay events and proof bundles
- engineering twin focused on code, ownership, CI, tests, runbooks, and dashboards

Out of scope for v1:

- multi-tenant SaaS
- generic consumer chat assistant
- autonomous production deploys
- uncontrolled internet access by default
- multi-channel messaging integrations in the critical path
- tracker abstractions beyond GitHub in the first milestone set

## Layers

1. **Intent compiler**
   Converts messy input into a typed mission contract.

2. **Mission IR**
   The canonical system contract shared by orchestrator, runtime, replay, UI, and evaluation.

3. **Run graph orchestrator**
   Decides task order, retries, approvals, and lifecycle transitions.

4. **Workspaces and Codex runtime**
   Each task runs in an isolated workspace or worktree through Codex App Server.

5. **Policy fabric**
   Applies sandbox posture, approval rules, tool access, and risk budgets.

6. **Engineering twin**
   Maintains a freshness-aware model of repositories, services, tests, CI, runbooks, dashboards, and ownership.

7. **Evidence ledger**
   Stores artifacts, proof bundle manifests, approval records, and replay events.

8. **Pocket interface**
   Presents missions, progress, evidence, and approval actions on a mobile-friendly web surface.

## Architectural choices

- **GitHub App** for repo access and webhook ingress
- **Postgres** for canonical state
- **Drizzle** for explicit schema-as-code
- **Fastify** for control-plane APIs
- **Next.js** for operator UI
- **Codex App Server** for the coding runtime
- **S3-compatible artifact store** for evidence assets
- **Outbox pattern** for async notifications and projections
- **Event-assisted orchestration** using GitHub webhooks plus periodic reconciliation
- **PWA first** instead of a messaging bot in the critical path

## Why this shape

The goal is not to make an agent chat inside a phone.
The goal is to make software work reviewable, governable, and replayable from a phone.

That requires durable contracts, auditable execution, and strong architecture boundaries.
