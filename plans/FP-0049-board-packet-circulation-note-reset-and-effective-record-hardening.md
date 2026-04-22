# Define F5C4I board-packet circulation note reset and effective-record hardening

## Purpose / Big Picture

This file is the active F5C4I implementation contract created by a docs-and-plan-only master-plan slice.
`plans/FP-0048-board-packet-circulation-actor-correction-and-chronology-hardening.md` remains the shipped F5C4H record that precedes it.
The target phase is `F5`, and the next execution slice is `F5C4I-board-packet-circulation-note-reset-and-effective-record-hardening`.
The user-visible goal is narrow and concrete: after the shipped F5A through F5C4H baseline already creates one draft `board_packet`, resolves one internal `report_circulation` approval, records one immutable original circulation record, appends correction history on that same seam, and supports corrected actor attribution, Pocket CFO should next let an operator explicitly clear a previously non-null effective `circulationNote` back to truthful absence while keeping the original record immutable, the correction history append-only, and the derived effective chronology honest.

This matters now because the current correction contract already supports append-only correction for `circulatedAt`, `circulatedBy`, `circulationChannel`, and note replacement, but it still cannot distinguish unchanged from explicit clear for `circulationNote`.
`null` still means "no change" in the correction input contract and in the effective chronology fallback logic, so a mistakenly recorded non-null note cannot currently be corrected back to absent.
That is a real operator-facing truthfulness gap on an already-shipped board circulation seam, and it is the only later-F5 continuation justified by current repo truth.

GitHub connector work is explicitly out of scope.
This master-plan slice is docs-only: do not add runtime code, routes, schema migrations, replay-event migrations, package scripts, smoke commands, eval datasets, implementation scaffolding, actual send or distribute behavior, bounded runtime-codex drafting, or any rename from `modules/reporting/**` to `modules/reports/**` here.

## Progress

- [x] 2026-04-22T19:21:55Z Audit the shipped F5C4H chain, active docs, reporting and approvals seams, proof-bundle posture, runtime-codex boundary, and current board-circulation truth to decide whether explicit clear-to-absent note semantics are truly required.
- [x] 2026-04-22T19:21:55Z Confirm from current code that `circulationNote` correction still uses `null` as "no change", so a previously non-null effective note cannot be corrected back to absent on the existing `report_circulation` seam.
- [x] 2026-04-22T19:21:55Z Create `plans/FP-0049-board-packet-circulation-note-reset-and-effective-record-hardening.md` and refresh only the smallest truthful active-doc set so FP-0048 remains the shipped F5C4H record while this file becomes the single active later-F5 implementation contract.
- [x] 2026-04-22T19:21:55Z Run the docs-and-plan validation ladder for this handoff, including the preserved smoke stack through `pnpm smoke:board-packet-circulation-actor-correction:local`, the twin guardrails, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [ ] Next implementation thread: land explicit note-reset semantics on the existing `report_circulation` correction seam, keep the original `circulationRecord` immutable, keep correction history append-only, reuse `approval.circulation_log_corrected`, and harden the derived effective note plus chronology without widening scope.
- [ ] Next implementation thread: run the narrow targeted suites near the touched seams plus the preserved full confidence ladder, then commit, push, and open or update the PR only if every required validation is green.

## Surprises & Discoveries

- Observation: the current correction input contract still treats `circulationNote: null` as "no change", not as an explicit clear instruction.
  Evidence: `packages/domain/src/reporting-mission.ts` defines `RecordReportingCirculationLogCorrectionInputSchema` with `circulationNote` defaulting to `null`, and the schema only checks whether at least one nullable field is non-null.

- Observation: the current correction preparation logic collapses note clear and note unchanged into the same branch.
  Evidence: `apps/control-plane/src/modules/reporting/service.ts` uses `readChangedCorrectionValue(request.circulationNote, currentEffectiveRecord.circulationNote)`, so `null` cannot mean "clear the current note" and instead always means "preserve the current effective note".

- Observation: the current derived effective chronology falls back to the prior effective note whenever a correction entry carries `circulationNote: null`.
  Evidence: `apps/control-plane/src/modules/reporting/circulation-chronology.ts` derives the effective note with `input.correction.circulationNote ?? input.currentEffective.circulationNote`.

- Observation: the narrowest truthful continuation can stay on the existing approvals seam and replay event.
  Evidence: `apps/control-plane/src/modules/approvals/service.ts` already appends correction entries to `payload.circulationCorrections` and replays `approval.circulation_log_corrected`; no second subsystem is needed.

- Observation: the current actor-correction smoke is already the right proof seam for the next slice.
  Evidence: `pnpm smoke:board-packet-circulation-actor-correction:local` already exercises the append-only correction path on the existing board seam, so the next implementation can extend that proof instead of inventing a new smoke alias.

## Decision Log

- Decision: the first real F5C4I scope is `F5C4I-board-packet-circulation-note-reset-and-effective-record-hardening`.
  Rationale: the repo needs one implementation-ready successor contract, not another broad later-F5 umbrella.

- Decision: the artifact family in F5C4I remains exactly `board_packet`.
  Rationale: the board packet is still the only reporting artifact that owns internal circulation posture, circulation logging, correction history, and effective chronology in repo truth.

- Decision: F5C4I must start only from one completed `reporting` mission with `reportKind = "board_packet"`, one stored `board_packet` artifact, derived circulation readiness already at `approved_for_circulation`, one existing immutable `circulationRecord`, and zero or more existing append-only `circulationCorrections`.
  Rationale: the note-reset slice should consume one stored board-packet circulation history, not generic chat intake, not `finance_memo` directly, not `lender_update`, and not `diligence_packet`.

- Decision: F5C4I keeps `mission.type = "reporting"` and `reportKind = "board_packet"`.
  Rationale: reporting already owns the correct mission, replay, artifact, and proof semantics, so a second top-level correction mission family would widen the product boundary unnecessarily.

- Decision: F5C4I adds note-reset semantics only.
  Rationale: the shipped actor-correction widening already covers `circulatedBy`, and the current correction contract already handles replacement for time, actor, channel, and note text. The remaining gap is explicit clear-to-absent behavior for `circulationNote`, so the next slice should not widen actor, channel, or time reset behavior unless a concrete operator need appears later.

- Decision: distinguish unchanged versus replace versus clear for `circulationNote` with one explicit note-reset indicator on the existing correction contract.
  Rationale: the implementation needs an unambiguous tri-state contract for note correction only. The preferred narrow design is to keep `circulationNote` as the replacement payload when present and add one explicit boolean or equivalent discriminator for "clear the effective note", while leaving absence of both as "unchanged".

- Decision: keep the original `circulationRecord` immutable and the correction history append-only.
  Rationale: the first logged circulation event remains a reviewable historical fact and should stay visible exactly as originally recorded.

- Decision: reuse the existing `report_circulation` approval seam, existing `POST /missions/:missionId/reporting/circulation-log-correction` route, and existing `approval.circulation_log_corrected` replay event.
  Rationale: the narrowest truthful continuation is to widen the existing correction payload and derived views rather than inventing a new subsystem, a new route family, a new approval kind, or a new replay event by default.

- Decision: do not plan a database migration, replay-event migration, or new package script by default.
  Rationale: the current board circulation correction path is JSON-payload-backed, the replay event already exists, and the current actor-correction smoke is a reusable proof seam for note-reset hardening.

- Decision: F5C4I stays deterministic, runtime-free, and delivery-free.
  Rationale: stored reporting artifacts plus the existing approvals seam are sufficient for note-reset hardening, so runtime-codex behavior, actual send or distribute behavior, and broader export widening remain out of scope.

- Decision: preserve the current `modules/reporting/**` vocabulary and do not reopen a `modules/reports/**` rename wave.
  Rationale: this slice is about truthfulness and sequencing, not namespace churn.

- Decision: after FP-0049, the repo should reevaluate whether any later-F5 work is still justified before F6.
  Rationale: current evidence points to exactly one remaining board-specific operator gap, not a broader later-F5 program.

## Context and Orientation

Pocket CFO has already shipped F4A through F4C2, with `plans/FP-0035-finance-policy-lookup-and-discovery-quality-hardening.md` as the shipped final F4 record.
Pocket CFO has also already shipped the full reporting chain through F5C4H:

- `plans/FP-0036-reporting-mission-foundation-and-first-finance-memo.md` as the shipped F5A record
- `plans/FP-0037-draft-report-body-filed-artifact-and-markdown-export-hardening.md` as the shipped F5B record
- `plans/FP-0038-board-packet-specialization-and-draft-review-foundation.md` as the shipped F5C1 record
- `plans/FP-0039-lender-update-specialization-and-draft-review-foundation.md` as the shipped F5C2 record
- `plans/FP-0040-diligence-packet-specialization-and-draft-review-foundation.md` as the shipped F5C3 record
- `plans/FP-0041-approval-review-and-first-lender-update-release-readiness.md` as the shipped F5C4A record
- `plans/FP-0042-release-log-and-first-lender-update-release-record-foundation.md` as the shipped F5C4B record
- `plans/FP-0043-diligence-packet-approval-review-and-release-readiness.md` as the shipped F5C4C record
- `plans/FP-0044-release-log-and-first-diligence-packet-release-record-foundation.md` as the shipped F5C4D record
- `plans/FP-0045-board-packet-review-or-circulation-readiness-foundation.md` as the shipped F5C4E record
- `plans/FP-0046-circulation-log-and-first-board-packet-circulation-record-foundation.md` as the shipped F5C4F record
- `plans/FP-0047-board-packet-circulation-record-correction-and-chronology-foundation.md` as the shipped F5C4G record
- `plans/FP-0048-board-packet-circulation-actor-correction-and-chronology-hardening.md` as the shipped F5C4H record

That shipped baseline already means all of the following are repo truth today:

- `mission.type = "reporting"` and `sourceKind = "manual_reporting"`
- one deterministic `POST /missions/reporting` path from completed discovery work
- one draft `finance_memo`
- one linked `evidence_appendix`
- one draft `board_packet`
- one draft `lender_update`
- one draft `diligence_packet`
- one finance-facing `report_release` approval path plus release-ready and release-record posture for `lender_update`
- one finance-facing `report_release` approval path plus release-ready and release-record posture for `diligence_packet`
- one finance-facing `report_circulation` approval path plus circulation-ready posture for `board_packet`
- one immutable original board-packet `circulationRecord` on that seam
- append-only `circulationCorrections` on that same seam
- truthful effective actor chronology from shipped F5C4H

The current remaining gap is narrower: a previously non-null effective `circulationNote` cannot be corrected back to absent because the current contract still interprets `null` as "no change".
The active F5C4I successor must therefore stay board-specific, approval-payload-backed, additive, deterministic, runtime-free, and delivery-free.

The active-doc boundary for this handoff is:

- `README.md`
- `START_HERE.md`
- `docs/ACTIVE_DOCS.md`
- `PLANS.md`
- `plans/ROADMAP.md`
- `plans/FP-0048-board-packet-circulation-actor-correction-and-chronology-hardening.md`
- this active contract, `plans/FP-0049-board-packet-circulation-note-reset-and-effective-record-hardening.md`
- `docs/ops/local-dev.md`
- `docs/ops/source-ingest-and-cfo-wiki.md`
- `docs/ops/codex-app-server.md`
- `docs/benchmarks/seeded-missions.md`
- `evals/README.md`
- `apps/control-plane/src/modules/approvals/README.md`

GitHub connector work is out of scope.
The internal `@pocket-cto/*` package scope remains unchanged.
This thread is docs-only, but the next implementation thread is expected to stay inside the existing approvals, reporting, evidence, and web read-model seams.

## Plan of Work

First, keep the already-shipped F5C4H actor-correction record untouched and create one explicit active successor contract only because the current repo truth still leaves a note-reset gap.

Second, widen the pure correction contract just enough to express note-clear intent explicitly on the existing board circulation correction seam.
The preferred design is to preserve the existing nullable replacement fields for `circulatedAt`, `circulatedBy`, and `circulationChannel`, keep `circulationNote` as the replacement value when one is provided, and add one explicit flag or equivalent discriminator that means "clear the current effective note back to absent".

Third, retarget the existing correction write path rather than inventing a new subsystem.
The current `POST /missions/:missionId/reporting/circulation-log-correction` seam should continue to own this work, but it should reject ambiguous note-reset combinations, preserve idempotent retries by `correctionKey`, and append one correction entry on the same resolved `report_circulation` approval payload.

Fourth, harden the derived effective record and chronology summary so the system stops falling back to an old note after an explicit clear.
Reporting detail, mission detail, mission list, proof bundles, and operator surfaces should show whether the effective note remains present, was replaced, or was explicitly cleared, while keeping the original immutable record visible.

Finally, preserve the current proof seam and validation posture.
The next thread should extend the existing actor-correction proof and targeted tests rather than adding a new subsystem or a new smoke alias, then rerun the preserved confidence ladder end to end before publication.

## Concrete Steps

1. Widen the pure approval and reporting contracts for explicit note-reset semantics only.
   Update:
   - `packages/domain/src/reporting-mission.ts`
   - `packages/domain/src/approval.ts`
   - `packages/domain/src/proof-bundle.ts`
   - `packages/domain/src/mission-detail.ts`
   - `packages/domain/src/mission-list.ts`
   - `packages/domain/src/index.ts` only if exported types change

   F5C4I should:
   - keep `report_circulation` as the only finance-facing approval kind for the board path
   - keep `mission.type = "reporting"` and `reportKind = "board_packet"`
   - keep the original `circulationRecord` immutable
   - add one explicit note-reset indicator on the correction input and the persisted correction entry
   - keep `circulationNote` itself as the replacement payload when the operator is replacing the note rather than clearing it
   - leave `circulatedAt`, `circulatedBy`, and `circulationChannel` on their current semantics
   - reject ambiguous combinations such as "replace note" and "clear note" in the same correction
   - avoid new artifact kinds, new mission families, new approval kinds, and new environment variables

2. Retarget the existing board-circulation correction write seam without inventing a second subsystem.
   Update:
   - `apps/control-plane/src/modules/reporting/service.ts`
   - `apps/control-plane/src/modules/approvals/service.ts`
   - `apps/control-plane/src/modules/approvals/payload.ts`
   - `apps/control-plane/src/modules/missions/routes.ts`
   - `apps/control-plane/src/modules/missions/service.ts`

   F5C4I should:
   - keep `POST /missions/:missionId/reporting/circulation-log-correction` as the operator seam
   - require one completed `reporting` mission with `reportKind = "board_packet"`
   - require one stored `board_packet` artifact
   - require derived circulation readiness already at `approved_for_circulation`
   - require one existing immutable original circulation record already logged
   - append one correction entry on the existing `report_circulation` approval payload instead of mutating the original record
   - reuse `approval.circulation_log_corrected` rather than inventing a new replay event by default
   - preserve idempotent retries by `correctionKey`

3. Harden the derived effective record and chronology summary so explicit note clear stops falling back to stale text.
   Update:
   - `apps/control-plane/src/modules/reporting/circulation-chronology.ts`
   - `apps/control-plane/src/modules/reporting/circulation-record.ts`
   - `apps/control-plane/src/modules/reporting/artifact.ts`
   - `apps/control-plane/src/modules/evidence/proof-bundle-summary.ts`
   - `apps/control-plane/src/modules/evidence/proof-bundle-assembly.ts`
   - `apps/control-plane/src/modules/missions/detail-view.ts`

   F5C4I should:
   - derive the effective note as absent after an explicit clear
   - preserve the original immutable note on the original record
   - keep actor, time, and channel chronology unchanged except where already supported by shipped behavior
   - render chronology so operators can tell whether a correction replaced the note text or cleared the note entirely
   - keep freshness, reviewer trace, provenance posture, and limitations explicit

4. Extend the operator surfaces just enough to expose explicit note-clear behavior and its derived result.
   Update:
   - `apps/control-plane/src/modules/approvals/card-formatter.ts`
   - `apps/web/lib/api.ts`
   - `apps/web/components/reporting-output-card.tsx`
   - `apps/web/components/mission-card.tsx`
   - `apps/web/components/mission-list-card.tsx`
   - `apps/web/app/missions/[missionId]/mission-actions.tsx`
   - `apps/web/app/missions/[missionId]/mission-action-forms.tsx`
   - `apps/web/app/missions/[missionId]/actions.ts`

   F5C4I should:
   - keep the existing circulation-approval, circulation-log, and correction actions intact
   - add one explicit note-clear control on the existing correction action rather than a new action family
   - reject a clear request when the current effective note is already absent
   - show "no effective note" or equivalent truthful absence after an explicit clear instead of silently showing the old note
   - keep send, distribute, publish, PDF export, slide export, and runtime-codex drafting out of scope

5. Extend the existing proof coverage without adding a new smoke alias by default.
   Update:
   - `tools/board-packet-circulation-actor-correction-smoke.mjs`
   - `apps/control-plane/src/modules/reporting/service.spec.ts`
   - `apps/control-plane/src/modules/approvals/service.spec.ts`
   - `apps/control-plane/src/modules/evidence/proof-bundle-assembly.spec.ts`
   - `apps/web/lib/api.spec.ts`
   - `apps/web/components/reporting-output-card.spec.tsx`
   - the narrowest domain specs adjacent to the widened contracts

   F5C4I should:
   - preserve `pnpm smoke:board-packet-circulation-log-correction:local` as the shipped F5C4G baseline proof
   - preserve `pnpm smoke:board-packet-circulation-actor-correction:local` as the active correction proof seam and extend it to cover explicit note clear
   - avoid adding a new package script or a new smoke command by default
   - assert that the original `circulationRecord` stays unchanged while the derived effective note becomes absent after a clear correction
   - keep the proof deterministic, runtime-free, and delivery-free

6. Refresh only the active docs that landed F5C4I code would make stale.
   Update only where the landed code changes active wording:
   - `README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `plans/ROADMAP.md`
   - `docs/ops/local-dev.md`
   - `docs/ops/source-ingest-and-cfo-wiki.md`
   - `docs/ops/codex-app-server.md`
   - `evals/README.md`
   - `docs/benchmarks/seeded-missions.md`
   - `apps/control-plane/src/modules/approvals/README.md`

## Validation and Acceptance

This master-plan slice is docs-only, but it should still finish on the preserved docs-and-plan validation ladder, and the next implementation thread should keep that ladder intact while adding only the narrowest targeted suites near the touched seams.

Required docs-and-plan confidence ladder:

- `pnpm smoke:source-ingest:local`
- `pnpm smoke:finance-twin:local`
- `pnpm smoke:finance-twin-account-catalog:local`
- `pnpm smoke:finance-twin-general-ledger:local`
- `pnpm smoke:finance-twin-snapshot:local`
- `pnpm smoke:finance-twin-reconciliation:local`
- `pnpm smoke:finance-twin-period-context:local`
- `pnpm smoke:finance-twin-account-bridge:local`
- `pnpm smoke:finance-twin-balance-bridge-prerequisites:local`
- `pnpm smoke:finance-twin-source-backed-balance-proof:local`
- `pnpm smoke:finance-twin-balance-proof-lineage:local`
- `pnpm smoke:finance-twin-bank-account-summary:local`
- `pnpm smoke:finance-twin-receivables-aging:local`
- `pnpm smoke:finance-twin-payables-aging:local`
- `pnpm smoke:finance-twin-contract-metadata:local`
- `pnpm smoke:finance-twin-card-expense:local`
- `pnpm smoke:cfo-wiki-foundation:local`
- `pnpm smoke:cfo-wiki-document-pages:local`
- `pnpm smoke:cfo-wiki-lint-export:local`
- `pnpm smoke:cfo-wiki-concept-metric-policy:local`
- `pnpm smoke:finance-discovery-answer:local`
- `pnpm smoke:finance-discovery-supported-families:local`
- `pnpm smoke:finance-policy-lookup:local`
- `pnpm smoke:finance-discovery-quality:local`
- `pnpm eval:finance-discovery-quality`
- `pnpm smoke:finance-memo:local`
- `pnpm smoke:finance-report-filed-artifact:local`
- `pnpm smoke:board-packet:local`
- `pnpm smoke:board-packet-circulation-approval:local`
- `pnpm smoke:board-packet-circulation-log:local`
- `pnpm smoke:board-packet-circulation-log-correction:local`
- `pnpm smoke:board-packet-circulation-actor-correction:local`
- `pnpm smoke:lender-update:local`
- `pnpm smoke:diligence-packet:local`
- `pnpm smoke:lender-update-release-approval:local`
- `pnpm smoke:lender-update-release-log:local`
- `pnpm smoke:diligence-packet-release-approval:local`
- `pnpm smoke:diligence-packet-release-log:local`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

Acceptance for the future F5C4I code thread is observable only if all of the following are true:

- one completed approved-and-logged `board_packet` reporting mission can append one correction that explicitly clears the effective `circulationNote`
- the original immutable `circulationRecord` stays unchanged and remains visible
- the effective note becomes absent after the clear correction rather than falling back to the old note
- chronology, reporting, mission, proof-bundle, and approval surfaces make the clear-versus-replace distinction visible
- note-reset semantics do not widen actor, channel, time, delivery, PDF export, slide export, or runtime-codex behavior
- mission-facing outputs remain explicit about provenance, freshness posture, reviewer trace, assumptions, and limitations when relevant

## Idempotence and Recovery

This docs-and-plan slice is retry-safe because it only adds one active Finance Plan and refreshes active guidance.
The future F5C4I implementation should stay additive by never mutating or deleting the original `circulationRecord`, by keeping correction history append-only, and by preserving `correctionKey` as the retry boundary.
If note-reset persistence fails, the write should roll back transactionally so no partial correction becomes visible.
Rollback should consist of reverting the additive domain, reporting, proof, and UI changes while leaving the shipped F5C4H baseline intact.
No database or replay-event migration is planned by default, so recovery should not depend on a destructive schema rollback.

## Artifacts and Notes

This master-plan thread should end with:

- `plans/FP-0049-board-packet-circulation-note-reset-and-effective-record-hardening.md` as the single active later-F5 implementation contract
- the smallest truthful active-doc refresh that points readers to FP-0049 where needed
- green docs-and-plan validation results on the preserved confidence ladder

The next implementation thread should end with:

- additive contract, service, proof, and UI changes on the existing board correction seam
- extended targeted tests near the touched seams
- an updated `tools/board-packet-circulation-actor-correction-smoke.mjs` proof rather than a new smoke alias by default

## Interfaces and Dependencies

Package boundaries remain unchanged:

- `packages/domain` owns pure approval, reporting, proof-bundle, mission-detail, and mission-list contracts
- `apps/control-plane/src/modules/approvals` remains the persistence anchor for `report_circulation`
- `apps/control-plane/src/modules/reporting` should own correction preparation plus derived effective-note and chronology logic
- `apps/control-plane/src/modules/evidence` should surface note-reset truth in proof bundles without redefining proof readiness
- `apps/web` stays read-model and operator-action only and must not import database logic

The runtime seam stays stable:

- no runtime-codex drafting
- no runtime-codex circulation behavior
- no new environment variables are expected
- no GitHub connector work is in scope

The central dependency for F5C4I is the existing resolved `report_circulation` approval payload plus the shipped correction history and chronology view seams.
The slice should extend that seam additively rather than creating a second circulation subsystem or a second mission family.

## Outcomes & Retrospective

This thread did not start F5C4I code.
It confirmed that explicit clear-to-absent semantics for `circulationNote` are still a real operator-facing truthfulness gap after shipped F5C4H, created exactly one active successor contract for that narrow gap, and refreshed the smallest truthful active-doc set so the next Codex thread can start one implementation-ready board-packet note-reset slice cleanly.

FP-0048 remains the shipped F5C4H record.
What remains is one narrow code slice only: add explicit note-reset semantics on the existing board correction seam, harden the derived effective note plus chronology, preserve deterministic delivery-free posture, and then reevaluate whether anything later in F5 is still justified before F6.
