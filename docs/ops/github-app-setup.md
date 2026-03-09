# GitHub App setup

Pocket CTO should use a GitHub App, not a long-lived PAT.

## Why

GitHub Apps are the right default for this project because they offer fine-grained permissions, short-lived installation tokens, and centralized webhooks.
That matches Pocket CTO's need for least privilege, repo-scoped automation, and long-lived orchestration.

## Initial permissions for v1

Repository permissions:

- Metadata: Read-only
- Contents: Read and write
- Pull requests: Read and write
- Issues: Read and write
- Commit statuses: Read-only
- Checks: Read-only
- Actions: Read-only

Optional later:

- Workflows: Read and write, only if Pocket CTO must edit workflow files
- Deployments: Read-only or read-write, only if release automation becomes a real milestone

## Initial webhook events

- `issues`
- `issue_comment`
- `pull_request`
- `pull_request_review`
- `push`
- `check_run`
- `check_suite`
- `workflow_run`
- `installation`
- `installation_repositories`

## Implementation notes

- store installation identity separately from repository metadata
- verify webhook signatures before processing payloads
- treat webhook handling as idempotent
- cache installation tokens until expiry
- use periodic reconciliation as a safety net for missed events
- scope installation tokens to the repositories and permissions actually needed

## Token model

Use the standard GitHub App flow:

1. create a JWT with the app private key
2. exchange the JWT for an installation access token
3. cache the installation token until it expires
4. refresh on demand

Installation access tokens are intentionally short-lived.
Build the client so token refresh is ordinary, not exceptional.
