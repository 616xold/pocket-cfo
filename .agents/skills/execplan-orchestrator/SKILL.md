---
name: execplan-orchestrator
description: Use when a task is complex, spans multiple files or packages, or needs a step-by-step execution document. Do not use for trivial one-file fixes. Create or update a plan in plans/ that follows PLANS.md exactly, includes milestones, validation, and living progress notes, then implement against that plan.
---

# ExecPlan Orchestrator

Follow this workflow strictly.

## When to trigger

Use this skill when:

- the task spans multiple files
- the task touches more than one package
- the task is likely to take more than 45 minutes
- the task changes architecture, schemas, workflows, or integration surfaces
- the user asks for a roadmap, implementation plan, or milestone breakdown

Do not use this skill for:

- typo fixes
- tiny styling tweaks
- isolated test updates
- one-function bug fixes with no boundary changes

## Required steps

1. Read `AGENTS.md`, `PLANS.md`, `plans/ROADMAP.md`, and any active ExecPlan.
2. If no plan exists, create a new ExecPlan in `plans/`.
3. Use the repository template in `plans/templates/execplan-template.md`.
4. Make the plan self-contained.
5. Explicitly name:
   - the milestone and submilestones
   - the files and modules to edit
   - the validation commands
   - the proof or replay implications
6. Start implementation only after the plan is concrete enough that a new contributor could continue from it.
7. Update `Progress`, `Decision Log`, and `Surprises & Discoveries` at every meaningful stopping point.

## Quality bar

A valid Pocket CTO ExecPlan must:

- explain why the change matters in user-visible terms
- preserve modular boundaries
- define acceptance as observable behavior
- mention replay events and evidence when relevant
- include safe retry and rollback guidance
- be implementable by a novice with only this repo and the plan

## Output behavior

When invoked, either:

- create or update an ExecPlan, or
- confirm the active ExecPlan is sufficient and proceed against it

Do not produce a vague checklist.
Write a real execution document.
