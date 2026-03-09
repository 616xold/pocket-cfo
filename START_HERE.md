# Start here

This repository is already opinionated so that you can open it in the Codex app and start building immediately.

## First run in Codex

Open the repository root in the Codex app.

Then start a fresh thread and give Codex this prompt:

```text
Read README.md, AGENTS.md, PLANS.md, plans/ROADMAP.md, and plans/EP-0001-mission-spine.md.
Summarize the active milestone, then implement only Milestone 1 of EP-0001.
Keep the code modular, follow package boundaries, and update the ExecPlan Progress and Decision Log as you work.
Run the narrowest useful tests after each meaningful step and report the exact commands and results.
```

## Recommended operating pattern

Use one Codex thread per submilestone.

Suggested naming:

- `M0.1-repo-bootstrap`
- `M0.2-domain-and-db`
- `M0.3-api-and-worker-spine`
- `M0.4-replay-event-pipeline`
- `M1.1-mission-compiler`
- `M1.2-github-webhooks`
- `M1.3-codex-runtime-integration`

## Review ritual

After each submilestone:

1. review the diff
2. confirm the touched files respect module boundaries
3. confirm the ExecPlan was updated
4. run the specified validation commands
5. only then move to the next submilestone

## Use the repo skills

You should explicitly mention these when useful:

- `$execplan-orchestrator`
- `$modular-architecture-guard`
- `$evidence-bundle-auditor`
- `$github-app-integration-guard`

Example:

```text
$modular-architecture-guard Implement the replay event repository and service for the mission spine milestone. Keep routes thin and add focused tests.
```

## What not to do first

Do not start with:

- Telegram or WhatsApp integrations
- voice note transcription
- screenshot OCR
- multi-tenant auth
- deploy orchestration
- auto-merge flows
- generic "AI assistant" features

## The correct first success

The first success is simple and valuable:

> A text request becomes a persisted mission with tasks, replay events, and a visible proof-bundle placeholder.

If that flow is solid, everything else compounds on top of it.
