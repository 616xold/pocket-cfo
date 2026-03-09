# Pocket CTO ExecPlans

This file defines the required standard for executable plans in this repository.

Use an ExecPlan whenever work spans multiple files, more than one package, or more than 45 minutes of implementation time.

An ExecPlan is a living design and implementation document that a coding agent or human can follow without prior memory.

## Rules

1. Every ExecPlan must be self-contained.
2. Every ExecPlan must explain the user-visible purpose first.
3. Every ExecPlan must define exact files, modules, commands, and acceptance checks.
4. Every ExecPlan must be updated as work proceeds.
5. Every ExecPlan must keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` up to date.
6. Every ExecPlan must prefer additive, testable changes.
7. Every ExecPlan must state rollback or retry guidance for risky steps.
8. Every ExecPlan must include validation commands.
9. Every ExecPlan must describe evidence of success, not just code changes.

## Required sections

Every ExecPlan must contain these sections, in this order:

1. `# <Short action-oriented title>`
2. `## Purpose / Big Picture`
3. `## Progress`
4. `## Surprises & Discoveries`
5. `## Decision Log`
6. `## Context and Orientation`
7. `## Plan of Work`
8. `## Concrete Steps`
9. `## Validation and Acceptance`
10. `## Idempotence and Recovery`
11. `## Artifacts and Notes`
12. `## Interfaces and Dependencies`
13. `## Outcomes & Retrospective`

## Formatting rules

- Write in plain prose.
- Prefer sentences over giant bullet farms.
- Be concrete about files and commands.
- Use checkboxes only in `Progress`.
- Use UTC timestamps in `Progress` entries.
- Do not rely on "as discussed previously".
- Repeat assumptions if they matter.

## Repository-specific requirements

For Pocket CTO ExecPlans:

- name the target milestone and submilestones explicitly
- preserve architecture boundaries from `AGENTS.md`
- mention replay events and proof-bundle implications
- mention any impact on `WORKFLOW.md` or stack packs
- mention any new GitHub App permissions or webhook expectations
- mention any new environment variables and where they are documented

## When you are implementing an ExecPlan

- proceed milestone by milestone
- do not ask for "next steps" after every small change
- keep the plan updated after meaningful progress
- if scope changes, record the reason in the `Decision Log`
- if a safer or simpler design emerges, prefer it and document the change

## Template

Use `plans/templates/execplan-template.md` as the starting point for new ExecPlans.
