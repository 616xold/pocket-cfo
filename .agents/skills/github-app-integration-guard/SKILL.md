---
name: github-app-integration-guard
description: Use when implementing GitHub webhooks, repository sync, installation auth, pull request operations, or token management. Enforces GitHub App-first integration, least privilege, webhook signature verification, installation-token caching, and modular adapter design. Do not use for unrelated UI or domain work.
---

# GitHub App Integration Guard

Pocket CTO is GitHub-first, but it must not become PAT-first.
This skill keeps the integration secure, modular, and production-shaped.

## Trigger when

Use this skill when touching:

- webhook ingestion
- GitHub App authentication
- installation token generation or caching
- repository registry sync
- branch, commit, pull request, or check-run integration
- GitHub-specific env vars or permissions

Do not use this skill when touching:

- unrelated UI work
- generic mission domain types
- purely local fixtures with no GitHub surface

## Rules

1. Prefer a GitHub App over PAT-based flows.
2. Verify webhook signatures before processing payloads.
3. Scope installation tokens to the minimum repositories and permissions needed.
4. Cache installation tokens until expiry and refresh on demand.
5. Keep transport, auth, and repository operations in separate modules.
6. Make webhook handling idempotent.
7. Persist installation metadata and external ids explicitly.
8. Emit replay or outbox events for user-visible GitHub side effects.
9. Document any new app permissions and webhook subscriptions.
10. Mark any local PAT fallback as dev-only and temporary.

## Suggested module split

- `webhook-routes.ts` for Fastify transport only
- `signature.ts` for webhook verification
- `auth.ts` for JWT and installation-token logic
- `client.ts` for GitHub API operations
- `repository.ts` for local persistence
- `service.ts` for orchestration-facing behavior

## Final checks

Before finishing, verify:

- no webhook path performs business logic inline
- app permissions are documented
- installation tokens are not stored as long-lived secrets
- repo access is installation-scoped
- the ExecPlan mentions token expiry and retry behavior
