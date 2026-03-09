# Mission IR

Mission IR is the typed contract that Pocket CTO uses after intake.

Do not allow raw prompt text to become the internal contract.
Every intake path must compile into this structure or an explicit draft variant of it.

## Core principles

- explicit mission type
- explicit objective
- explicit scope
- explicit acceptance criteria
- explicit risk budget
- explicit evidence expectations
- explicit outputs
- explicit approvals

## Mission types

- `build`
- `incident`
- `release`
- `discovery`

## Example shape

```json
{
  "type": "build",
  "title": "Implement passkeys for sign-in",
  "objective": "Add passkey sign-in without breaking existing email login",
  "repos": ["web", "auth-service"],
  "constraints": {
    "mustNot": ["disable email login", "touch billing flows"],
    "targetBranch": "main"
  },
  "acceptance": [
    "users can register and sign in with passkeys",
    "existing email login still works",
    "tests and screenshots are attached"
  ],
  "riskBudget": {
    "sandboxMode": "patch-only",
    "maxWallClockMinutes": 60,
    "maxCostUsd": 12,
    "allowNetwork": false,
    "requiresHumanApprovalFor": ["merge"]
  },
  "deliverables": [
    "plan",
    "pull_request",
    "proof_bundle",
    "approval_card"
  ],
  "evidenceRequirements": [
    "test report",
    "screenshot",
    "rollback note"
  ]
}
```

## Lifecycle

A mission begins as either:

- a `draft`, if the compiler confidence is low or required fields are missing
- a `planned` mission, if the contract is valid enough to schedule tasks

## Compiler notes

Use structured output generation for the compiler.
The output must map to the Mission IR schema exactly.
Do not parse free-form JSON with ad hoc regexes.

## Repository implementation map

- Domain schema: `packages/domain/src/mission.ts`
- Mission creation service: `apps/control-plane/src/modules/missions/service.ts`
- Compiler interface: `apps/control-plane/src/modules/missions/compiler.ts`
- Persistence: `packages/db/src/schema/missions.ts`
