---
name: evidence-bundle-auditor
description: Use when a feature creates or modifies missions, approvals, artifacts, summaries, replay, or proof bundles. Checks that the output includes objective, change summary, verification evidence, risk and rollback notes, and decision trace. Do not use for unrelated infrastructure changes.
---

# Evidence Bundle Auditor

Pocket CTO wins on trust, not on chat polish.
Any mission-facing feature must produce audit-worthy evidence.

## Trigger when

Use this skill when the task touches:

- mission completion flows
- proof bundle creation
- replay event capture
- approval cards
- mission summaries
- artifacts or artifact manifests
- reviewer or operator-facing evidence

Do not use this skill when the change is only about:

- package manager setup
- CSS-only changes
- isolated internal refactors with no operator-visible evidence impact

## Required checks

1. The mission objective is preserved in the output.
2. The change summary is explicit.
3. Verification evidence exists.
4. Risks are stated plainly.
5. Rollback or safe fallback guidance exists when relevant.
6. Decision trace or approval trace exists.
7. Replay events are sufficient to reconstruct the milestone or mission behavior.
8. Artifact metadata includes source, timestamp, and task linkage when relevant.

## Output expectation

If the feature is incomplete, add a clearly marked placeholder that keeps the evidence contract visible instead of silently omitting it.

## Final audit questions

- Could a human approve or reject this mission from the produced evidence?
- Could another engineer understand what happened without rereading the whole thread?
- Could this mission be replayed later for evaluation or a public demo?
