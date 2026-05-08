# FP-0084 - Evidence Atlas UI Foundation

## Purpose / Big Picture

Status: active implementation-ready Finance Plan, created 2026-05-08T17:26:48Z. Implementation has not started.

Target phase: `V2D`.

Exact slice: `V2D-evidence-atlas-ui-foundation`.

This Finance Plan defines the next safe slice after shipped FP-0083. It is a plan for one read-only Evidence Atlas UI foundation. This master-plan thread is docs-and-plan only: it creates this plan and refreshes only directly stale active docs. It does not implement V2D.

The user-visible purpose of V2D is to make existing source evidence, EvidenceIndex artifacts, V2C evidence-tool posture, Finance Twin references, CFO Wiki references, mission-answer references, proof-bundle references, freshness, limitations, and capability boundaries easier for a human operator to inspect. The Evidence Atlas must help the operator see what is supported, stale, missing, unsupported, cited, redacted, and permitted next. It must not become a new source of truth or a generated-answer layer.

Authority model remains unchanged:

- raw sources remain authoritative for document claims
- Finance Twin remains authoritative for structured finance facts
- CFO Wiki remains compiled and derived
- EvidenceIndex remains the read-only anchor, trace, card, coverage, and limitation layer
- V2C evidence tools remain the local/internal read-only search/fetch/inspect contract over EvidenceIndex/TextPdfAdapter artifacts
- the Evidence Atlas UI is only a visualization and inspection layer
- model output, UI copy, ChatGPT App output, MCP output, runtime-Codex output, and documentation prose must not become finance source truth

GitHub connector product behavior is explicitly out of scope. Routine `git`, `gh`, push, and PR operations for this repository do not invoke GitHub Connector Guard.

No external web or browser research was used for FP-0084. Repo source truth came from current code, current active docs, shipped Finance Plans, fetched `origin/main`, and the direct V2 proof commands.

## Progress

- [x] 2026-05-08T17:26:48Z - Invoked the requested Pocket CFO operator skills before work: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor.
- [x] 2026-05-08T17:26:48Z - Confirmed GitHub Connector Guard is not in scope because this slice does not touch GitHub connector product behavior.
- [x] 2026-05-08T17:26:48Z - Ran preflight against fetched `origin/main`; current branch was `codex/v2d-evidence-atlas-ui-master-plan-local-v1`, the worktree started clean, `HEAD` matched `origin/main`, GitHub auth/repo access worked, PR #232 was merged, Docker Postgres/MinIO were available, FP-0083 existed on `origin/main`, no FP-0084 or FP-0085 existed, and the required V2 proof commands existed.
- [x] 2026-05-08T17:26:48Z - Ran direct V2 proofs before writing: `pnpm exec tsx tools/read-only-evidence-app-proof.mjs`, `pnpm exec tsx tools/document-precision-foundation-proof.mjs`, and `pnpm exec tsx tools/evidence-index-foundation-proof.mjs`; all passed.
- [x] 2026-05-08T17:26:48Z - Read the active documentation spine, FP-0083/FP-0082/FP-0081/FP-0080 shipped records, package metadata, app/web route surface, EvidenceIndex/V2C implementation, source/wiki/Finance Twin/evidence/reporting/approval/outbox module inventory, and direct proof tooling.
- [x] 2026-05-08T17:26:48Z - Completed the required search pass for FP-0084, FP-0085, V2D/Evidence Atlas terms, high-liability boundaries, future platform terms, route/schema/migration/script/fixture/sample-data terms, internal package scaffolding, GitHub-first wording, and engineering-first wording.
- [x] 2026-05-08T17:26:48Z - Decided V2D is safe to plan now as `V2D-evidence-atlas-ui-foundation` because FP-0083 is shipped, active docs support FP-0083 as shipped, V2A/V2B/V2C proofs pass, EvidenceIndex/TextPdfAdapter/V2C local read-only contracts exist, and the next slice can remain read-only UI visualization over existing artifacts.
- [x] 2026-05-08T17:26:48Z - Created this FP-0084 active implementation-ready plan and refreshed only directly stale active-doc/roadmap wording.
- [x] 2026-05-08T17:38:16Z - Ran the required docs-and-plan validation ladder, including direct V2 proofs, source-pack proofs, CFO Wiki/Finance Twin/monitoring/delivery/operator smokes, focused web/domain/control-plane specs, `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed. Log root: `/tmp/pocket-cfo-fp0084-validation-20260508T173251Z`.

## Surprises & Discoveries

- FP-0083 is present locally and on fetched `origin/main` as the shipped OSS demo/self-host/security baseline documentation record.
- No FP-0084 or FP-0085 existed before this slice.
- PR #232 is merged into `main`, and local `HEAD` matched fetched `origin/main` at preflight.
- `tools/read-only-evidence-app-proof.mjs`, `tools/document-precision-foundation-proof.mjs`, and `tools/evidence-index-foundation-proof.mjs` all exist and passed before this plan was created.
- EvidenceIndex and TextPdfAdapter are implemented under `apps/control-plane/src/modules/evidence-index/**`; V2C read-only tool service is implemented under `apps/control-plane/src/modules/evidence-index/tools/**`.
- `apps/control-plane/src/app.ts` does not register an EvidenceIndex or V2C HTTP route today, and `apps/web/lib/api.ts` has no Evidence Atlas or evidence-tool fetch method. The first operator UI implementation cannot consume live EvidenceIndex/V2C data through an existing web API unless it uses only component-level in-memory test data or adds a future narrow read-only control-plane route.
- Existing app/web pages are source, mission, monitoring, close/control, operator-readiness, acknowledgement-readiness, and delivery-readiness surfaces. There is no existing Evidence Atlas route.
- Existing app/web surfaces include action-bearing controls for shipped source upload/ingest, mission creation, monitor investigation handoff, approvals, release/circulation logging, and readiness navigation. V2D must not reuse or clone those controls into the atlas.
- The F12 audit recorded a Codex Browser screenshot-capture limitation. First V2D proof should rely on DOM/component/page specs and direct machine-readable proof before any manual screenshot artifact is claimed.
- Search hits for V2D and Evidence Atlas were future-only roadmap language, shipped-plan next recommendations, or V2C consumption guidance. No existing V2D implementation was found.
- Search hits for provider, certification, delivery, report release, payment, legal advice, audit opinion, source mutation, finance writes, generated prose, runtime-Codex, and autonomous action were active safety boundaries, shipped absence assertions, existing internal boundary/readiness modules, or reference-only history. No behavior leak requires a smaller corrective slice before FP-0084.
- Search hits for route, schema, migration, package script, smoke alias, eval dataset, fixture, sample data, `pocket-cto`, and `@pocket-cto` are valid shipped code, active guardrails, source-pack proof posture, or internal scaffolding. They must not be renamed or mutated in V2D planning.
- No external web/search research was used. If a later implementation needs official/current accessibility/security/OpenAI platform docs, that plan or implementation record must name the official sources and state exactly what they were used for.

## Decision Log

Decision: FP-0084 is safe to create now.
Rationale: FP-0083 is merged and shipped, active docs identify FP-0083 as shipped, V2A/V2B/V2C direct proof commands exist and pass, EvidenceIndex/TextPdfAdapter/V2C local read-only contracts exist, README/CODEX_README/PROJECT_STATE/V2_BOUNDARY exist and are linked, and the next scope can remain read-only UI planning without starting public app, MCP, OpenAI API, provider, certification, deployment, source mutation, finance write, or autonomous behavior.

Decision: V2D is exactly `V2D-evidence-atlas-ui-foundation`.
Rationale: one read-only Evidence Atlas UI foundation is safer than mixing UI, LLM orchestration, benchmark/community packs, public ChatGPT App/MCP, Apps SDK, OAuth, provider integrations, certification, OCR/vector/PageIndex adapters, package renames, deployment, or external communications.

Decision: V2D is a read-only UI visualization layer.
Rationale: it may visualize and inspect existing EvidenceIndex, TextPdfAdapter, V2C evidence-tool, Finance Twin, CFO Wiki, mission answer, proof bundle, and source coverage artifacts. It must not create, mutate, approve, send, release, certify, summarize with an LLM, or answer finance questions as a new authority layer.

Decision: V2D is not source truth.
Rationale: raw sources, source snapshots, source files, checksums, storage refs, provenance, Finance Twin state, CFO Wiki pages, EvidenceIndex artifacts, V2C responses, mission answers, and proof bundles remain the source-backed contracts. The atlas only renders those contracts.

Decision: first UI surface should be the Source Coverage Matrix UI.
Rationale: SourceCoverageMatrix is already a shipped V2A/V2C concept, it naturally exposes supported, unsupported, missing, stale, failed, and not-indexed posture, and it gives the operator a safe map before drilling into timeline, document map, evidence card detail, or answer anatomy.

Decision: first implementation should add one narrow app/web Evidence Atlas route only if the implementation plan keeps it read-only.
Rationale: no existing app/web route is semantically correct for the atlas. A future `/evidence-atlas` page or equivalent can follow existing app/web patterns while avoiding source upload, mission creation, monitor rerun, approval, release, certification, delivery, or finance-action controls.

Decision: first implementation may add one narrow read-only control-plane read route only if final implementation inspection confirms the web app still cannot consume EvidenceIndex/V2C artifacts through an existing route.
Rationale: current inspection found no registered EvidenceIndex/V2C HTTP route in `apps/control-plane/src/app.ts` and no Evidence Atlas API client in `apps/web/lib/api.ts`. The preferred implementation is no backend change, but if live operator data is required, the only acceptable backend addition is a thin GET route that wraps existing read-only EvidenceIndex/V2C artifacts and returns existing contracts without persistence, migrations, writes, or action controls.

Decision: no schema/migration is planned for the first V2D implementation.
Rationale: Evidence Atlas state should be derived from existing EvidenceIndex/V2C/Finance Twin/CFO Wiki/mission/proof artifacts. Durable UI artifacts are not needed for the first proof.

Decision: no package script, smoke alias, eval dataset, fixture, sample data, or source-pack change is planned.
Rationale: first V2D proof should use focused specs and existing direct proofs. It must not create new data or hide behind screenshots.

Decision: F12 screenshot limitation does not block first V2D implementation.
Rationale: first implementation can be proven with DOM/component/page specs and a direct proof of read-only absence boundaries before any manual screenshot artifact is claimed.

Decision: public demo/docs screenshots are not updated in this planning slice.
Rationale: V2D implementation has not started. Demo docs may be updated only after implementation proves a safe route and screenshot/data posture.

Decision: V2E bounded LLM orchestration must wait.
Rationale: V2D should first make the evidence contract navigable and visible without LLM summarization. Prompt-injection text and private finance data remain source data only.

Decision: public ChatGPT App planning must wait.
Rationale: public app/MCP work needs a separate plan for auth, privacy, public threat model, deployment, Apps SDK/OAuth/app submission, and no-write/no-exfiltration posture after local UI and read-only evidence boundaries are proven.

Decision: V2F benchmark/community pack must wait.
Rationale: benchmark/community packs require a later sample-data/community-pack plan proving synthetic non-private data and no source-pack behavior leak.

## Context and Orientation

Current shipped plan truth:

- FP-0083 is the shipped OSS demo/self-host/security baseline documentation record.
- FP-0082 is the shipped V2C local/internal read-only evidence-tool contract record.
- FP-0081 is the shipped V2B document precision adapter foundation record.
- FP-0080 is the shipped V2A EvidenceIndex/document-map foundation record.
- FP-0079 is the shipped F12 manual UI/demo-readiness audit record.
- FP-0078 is the shipped F11 public repo hygiene and V2 transition record.
- FP-0077 is the shipped F10/v1 public launch handoff record.
- FP-0076 is the shipped F9 read-only product UI truthfulness polish record.
- FP-0075 is the shipped F8 future-scope triage record.
- FP-0074 is the shipped F7 launch-readiness record.
- FP-0050 through FP-0073 remain shipped F6 records.

The gap from V2A/V2B/V2C/FP-0083 is an operator inspection gap. V2A created deterministic EvidenceIndex artifacts. V2B added one TextPdfAdapter candidate with provenance and fail-closed limitations. V2C exposed local/internal read-only evidence-tool responses over those artifacts. FP-0083 added OSS/security/privacy/self-host/demo policy. But a human operator still has no first-class UI for seeing the coverage matrix, stale/missing/unsupported regions, citations, capability boundaries, evidence card detail, document-map posture, or answer anatomy in one place.

V2D is safe before public ChatGPT App/MCP deployment because it stays local/operator-facing and read-only. It should reduce public app risk by making evidence/freshness/limitation boundaries visible before any LLM or public app wrapper is added.

The first V2D implementation should start from the shipped V2A/V2B/V2C artifacts:

- `SourceCoverageMatrix`
- `DocumentMap`
- `SourceAnchor`
- `EvidenceCard`
- `EvidenceTrace`
- `CapabilityBoundary`
- `FreshnessPosture`
- `LimitationPosture`
- `PermittedNextAction`
- V2C `EvidenceToolResponse`
- V2C safe excerpts, citations, redactions, audit fields, unsupported reasons, and forbidden actions
- read-only Finance Twin refs
- compiled/derived CFO Wiki refs
- mission answer refs and proof-bundle refs

Concept definitions for FP-0084:

- `EvidenceAtlas`: a read-only operator UI composition that visualizes existing source coverage, evidence artifacts, citations, freshness, limitations, boundaries, and read-only next actions without creating source truth, finance facts, or generated answers.
- `SourceCoverageMatrixView`: the first UI surface. It renders SourceCoverageMatrix entries by source, document role, media type, coverage status, supported methods, unsupported methods, freshness, limitations, and citations.
- `EvidenceTimeline`: a later read-only ordering of source capture, extraction, compile, mission answer, proof-bundle, and adapter provenance timestamps. It is a chronology, not a release log or action queue.
- `DocumentMapView`: a read-only section/page/anchor map for one DocumentMap or PrecisionDocumentMap with bounded/redacted source excerpts and unsupported-region markers.
- `EvidenceCardDetailView`: a read-only detail view for one EvidenceCard, showing claim, source anchors, traces, freshness, limitations, permitted next actions, and forbidden actions.
- `AnswerAnatomyView`: a read-only inspection of how a stored mission answer or report output points to Finance Twin refs, CFO Wiki refs, EvidenceCards, proof bundles, related routes, limitations, and freshness posture.
- `CapabilityBoundaryPanel`: a persistent UI panel that shows read-only-only posture, no write tools, forbidden actions, unsupported methods, and blocked requests.
- `UnsupportedEvidenceRegion`: a located table, figure, scan, image-only file, no-text PDF, encrypted PDF, OCR-only region, vector-only hit, PageIndex-only hit, ambiguous layout, or unsupported source area that must be visible as a limitation instead of interpreted as a claim.
- `MissingEvidenceState`: a UI state for missing source snapshot, source file, deterministic extract, EvidenceIndex artifact, Finance Twin ref, CFO Wiki ref, mission answer, proof bundle, or coverage entry.
- `StaleEvidenceState`: a UI state for stale source or derived artifact posture, including captured/extracted/compiled/checked timestamps and human-review guidance.
- `EvidenceAtlasFilter`: read-only filters by company key, source id, document role, coverage status, freshness state, limitation code, extraction method, evidence-card id, or citation kind.
- `EvidenceAtlasCitationLink`: a bounded link or route target to the registered source, SourceAnchor, DocumentMap, Finance Twin route, CFO Wiki page, mission answer, or proof bundle that preserves source id, snapshot id, checksum, locator, and derived-ref type.
- `EvidenceAtlasReadOnlyAction`: an allowed navigation or inspection action such as open source, inspect source anchor, open CFO Wiki page, open Finance Twin ref, inspect proof bundle, apply filter, clear filter, or request human review.
- `EvidenceAtlasForbiddenAction`: any upload, ingest, mission creation, monitor rerun, approval, release, circulation, delivery, provider, certification, payment, accounting, bank, tax, legal, audit, source mutation, finance write, LLM generation, public app, MCP, OAuth, deployment, or autonomous action control.
- `EvidenceAtlasProof`: focused specs and, if needed, one direct proof command that prove the atlas renders existing artifacts, preserves citations/freshness/limitations, bounds/redacts excerpts, treats prompt-injection strings as data, and exposes no forbidden controls.
- `EvidenceAtlasUiBoundary`: the rule that the atlas is app/web visualization only and cannot become a backend source authority, write API, mission engine, report engine, or answer generator.
- `EvidenceAtlasPrivacyBoundary`: the rule that source excerpts stay bounded, redacted where V2C policy applies, cited, local-first, and safe for review; screenshots or demos must use synthetic/approved data only.

Required planning answers:

- What exact gap from V2A/V2B/V2C/FP-0083 justifies V2D now? The missing human inspection UI over already-shipped evidence contracts.
- Is V2D safe before public ChatGPT App/MCP deployment? Yes, if it remains local/operator-facing, read-only, and no-write. It should precede public app/MCP because it proves human-visible boundaries first.
- Which UI surface should be first? Source Coverage Matrix UI.
- Should first implementation reuse existing app/web routes or add one new narrow read-only route? Add one new app/web route only for the atlas. Reuse existing app/web layout/components where truthful. Add no backend route unless implementation re-confirms current lack of an existing EvidenceIndex/V2C read route blocks live data.
- Can first implementation consume existing EvidenceIndex/V2C artifacts without backend changes? Component specs and direct proof can consume existing contracts without backend changes. Live app/web operator data cannot currently consume V2C artifacts through an existing HTTP route because no EvidenceIndex/V2C route is registered. If live data is required, a single thin read-only route is justified.
- Are schema/migrations needed? No. First V2D should stay derived/in-memory/read-only over existing artifacts.
- How will UI expose evidence/freshness/limitations/permitted-next-action fields? Every row/detail panel must render citations or unsupported reason, freshness state/summary/timestamps, limitation codes/summaries/severity, and permitted read-only next actions.
- How will UI expose forbidden actions and capability boundaries? The Capability Boundary Panel must render V2C forbidden actions and no-write posture, and specs must assert forbidden controls are absent.
- How will unsupported/missing/stale evidence be shown? As first-class visual states in the matrix and detail panels, with blocking/warning posture and human-review next steps.
- How will source excerpts remain bounded/redacted/cited? Reuse V2C safe excerpt policy: small excerpts, citation required, full-file dumps disallowed, obvious secrets/credentials/tokens/private finance identifiers redacted, source text treated as untrusted data.
- How will prompt-injection text remain source data only? Render source text/excerpts only as cited evidence strings. Do not execute URLs, instructions, tool calls, or action text from excerpts. Specs must include prompt-injection-like source text and assert it is displayed only as data.
- How will proof commands/specs prove no high-liability behavior? Specs must assert absence of upload, ingest, mission creation, monitor rerun, approval, release, circulation, provider, delivery, certification, payment, legal/audit, source mutation, finance write, LLM generation, public app, MCP, OAuth, and autonomous controls. A direct proof may render normalized atlas props and boundary flags if implementation adds one.
- What active-doc updates are needed after planning? Active docs and roadmap should point to FP-0084 as the active implementation-ready V2D plan while making implementation unstarted and later tracks future-only.
- What should V2E bounded LLM orchestration wait for? A shipped V2D route/spec/proof showing evidence/freshness/limitations/citations/boundaries are navigable without LLM-generated truth.
- What should public ChatGPT App planning wait for? Shipped V2D read-only UI proof plus separate public app/MCP/auth/privacy/deployment threat model.
- What should V2F benchmark/community pack wait for? Shipped atlas/evidence UX plus a future sample-data/community-pack plan proving synthetic non-private data and no fixture/source-pack behavior leak.

## Plan of Work

This master-plan thread may touch only:

- `plans/FP-0084-evidence-atlas-ui-foundation.md`
- directly stale active docs/roadmap files needed to mark FP-0084 active and implementation unstarted

The future implementation thread should stay narrow:

1. Keep this FP-0084 as the active plan. Do not create FP-0085.
2. Re-run preflight and direct V2 proofs before code.
3. Re-confirm no existing EvidenceIndex/V2C route can satisfy live app/web data before adding any backend route.
4. Implement the first UI surface as Source Coverage Matrix UI, with enough detail-panel support to inspect coverage, citations, limitations, freshness, and capability boundaries.
5. Prefer app/web components and focused specs first.
6. Add a single app/web route only if needed for the operator to navigate the atlas.
7. Add a single thin control-plane read route only if required to expose existing V2C/EvidenceIndex artifacts to app/web, with no SQL in route handlers and no schema/migration.
8. Keep all actions as read-only navigation/filter/inspection. No upload, sync, mission creation, monitor rerun, report release, approval, certification, delivery, provider, payment, source mutation, finance write, generated advice, LLM summarization, or autonomous action.
9. Add focused specs and, if justified, one direct proof command for UI absence boundaries. Do not add package scripts or smoke aliases.
10. Update active docs only after implementation ships.

Potential future implementation files, subject to re-confirmation before code:

- `apps/web/app/evidence-atlas/page.tsx`
- `apps/web/app/evidence-atlas/page.spec.tsx`
- `apps/web/components/evidence-atlas/*`
- `apps/web/lib/api.ts` only for read-only fetch helpers if a control-plane read route exists
- `apps/control-plane/src/modules/evidence-index/routes.ts` only if a thin read route is required and no existing route can serve V2D
- `apps/control-plane/src/app.ts` only to register that thin read route if approved by implementation inspection
- focused specs under `apps/control-plane/src/modules/evidence-index/**/*.spec.ts` only if a control-plane route/read service is added

Files intentionally not planned for first implementation:

- `packages/db/**`
- migration folders
- package scripts
- smoke aliases
- eval datasets
- fixture files
- source-pack fixture files
- public ChatGPT App/MCP/Apps SDK/OAuth/app submission files
- OpenAI vector/file-search/OCR/PageIndex integration files
- provider/certification/deployment/external communication modules

## Concrete Steps

The future implementation thread should:

1. Re-run the preflight from this prompt, including clean worktree, branch, PR #232 merged status, Docker services, FP-0084 present, FP-0085 absent, and V2 proof tools present.
2. Run direct V2 proofs first:

```bash
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
```

3. Re-read this FP-0084, active docs, `apps/control-plane/src/app.ts`, `apps/web/lib/api.ts`, and EvidenceIndex/V2C service contracts.
4. If no existing read route exists, decide whether the first implementation can be component/spec-only or needs one thin read-only control-plane GET route.
5. Build Source Coverage Matrix UI as the first surface.
6. Include Capability Boundary Panel and Unsupported/Missing/Stale Evidence states in that first surface.
7. Include narrow detail affordances for SourceAnchor/DocumentMap/EvidenceCard only as read-only drilldowns when data is already present.
8. Ensure rendered source excerpts are bounded, cited, and redacted through V2C policy.
9. Ensure prompt-injection-like source text is displayed only as data.
10. Add focused specs for rendering, filtering, stale/missing/unsupported posture, citation links, redaction, prompt-injection-as-data, and absence of forbidden controls.
11. Run the validation ladder in this plan and update Progress, Decision Log, Validation and Acceptance, Artifacts and Notes, and Outcomes & Retrospective.

## Validation and Acceptance

This master-plan thread is accepted only if:

- `plans/FP-0084-evidence-atlas-ui-foundation.md` exists as the single new active Finance Plan.
- FP-0085 does not exist.
- Active docs are refreshed only where directly stale because FP-0084 now exists.
- No code, UI, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, sample data, source-pack changes, public ChatGPT App, MCP, Apps SDK UI, OAuth, app submission, provider integration, certification, deployment, external communications, OCR, vector search, PageIndex, OpenAI vector/file-search, LLM orchestration, runtime-Codex finance output, generated product prose, source mutation, finance write, or autonomous action is added.
- Required validation passes before commit.

Required validation commands for this master-plan slice:

```bash
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
pnpm exec tsx tools/board-lender-document-source-pack-proof.mjs
pnpm exec tsx tools/policy-covenant-document-source-pack-proof.mjs
pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs
pnpm exec tsx tools/bank-card-source-pack-proof.mjs
pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs
pnpm exec tsx tools/contract-obligation-source-pack-proof.mjs
pnpm smoke:cfo-wiki-foundation:local
pnpm smoke:cfo-wiki-document-pages:local
pnpm smoke:cfo-wiki-lint-export:local
pnpm smoke:cfo-wiki-concept-metric-policy:local
pnpm smoke:finance-twin-account-catalog:local
pnpm smoke:finance-twin-general-ledger:local
pnpm smoke:finance-twin:local
pnpm smoke:finance-twin-reconciliation:local
pnpm smoke:finance-twin-account-bridge:local
pnpm smoke:finance-twin-balance-bridge-prerequisites:local
pnpm smoke:finance-twin-balance-proof-lineage:local
pnpm smoke:finance-twin-period-context:local
pnpm smoke:finance-twin-source-backed-balance-proof:local
pnpm smoke:finance-policy-lookup:local
pnpm smoke:policy-covenant-threshold-monitor:local
pnpm smoke:close-control-checklist:local
pnpm smoke:delivery-readiness:local
pnpm smoke:operator-readiness:local
pnpm smoke:close-control-acknowledgement:local
pnpm smoke:monitor-demo-replay:local
pnpm smoke:finance-discovery-supported-families:local
pnpm --filter @pocket-cto/web exec vitest run
pnpm --filter @pocket-cto/web typecheck
pnpm --filter @pocket-cto/domain exec vitest run src/cfo-wiki.spec.ts src/source-registry.spec.ts src/finance-twin.spec.ts src/monitoring.spec.ts src/close-control.spec.ts src/close-control-certification-safety.spec.ts src/external-delivery-human-confirmation-boundary.spec.ts src/close-control-certification-boundary.spec.ts src/external-provider-boundary.spec.ts src/close-control-review-summary.spec.ts src/delivery-readiness.spec.ts src/proof-bundle.spec.ts src/evidence-index.spec.ts src/evidence-tool.spec.ts
zsh -lc "cd apps/control-plane && pnpm exec vitest run src/modules/evidence-index/**/*.spec.ts src/modules/wiki/**/*.spec.ts src/modules/sources/**/*.spec.ts src/modules/finance-twin/**/*.spec.ts src/modules/finance-discovery/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/close-control-certification-safety/**/*.spec.ts src/modules/external-delivery-human-confirmation-boundary/**/*.spec.ts src/modules/close-control-certification-boundary/**/*.spec.ts src/modules/external-provider-boundary/**/*.spec.ts src/modules/close-control-review-summary/**/*.spec.ts src/modules/delivery-readiness/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/modules/reporting/**/*.spec.ts src/app.spec.ts"
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Future implementation acceptance requires:

- Source Coverage Matrix UI renders coverage statuses, methods, freshness, limitations, citations, and capability boundaries from existing artifacts.
- Unsupported, missing, and stale evidence states are visible and cannot be mistaken for supported claims.
- Evidence Atlas UI exposes no upload, sync, mission creation, monitor rerun, approval, release, circulation, provider, delivery, certification, payment, legal/audit, source mutation, finance write, LLM generation, runtime-Codex, public app, MCP, OAuth, deployment, or autonomous controls.
- No schema/migration is added unless this plan is amended with explicit proof and recovery guidance.
- No package script, smoke alias, eval dataset, fixture, sample data, source-pack change, or public demo artifact is added.
- Proof does not rely on screenshots alone.

## Idempotence and Recovery

This master-plan slice is idempotent:

- rerunning the thread should find FP-0084 and update it instead of creating a duplicate
- rerunning direct V2 proofs should not mutate raw source fixtures
- rerunning DB-backed smokes should use existing local proof patterns and should not create new source-pack behavior
- FP-0085 must not be created
- raw source files must not be rewritten
- active docs should only receive directly stale handoff updates

Recovery paths:

- If FP-0083 is missing or not shipped, stop V2D and recommend a narrow FP-0083 docs correction.
- If V2C proof fails, stop V2D and recommend a narrow V2C evidence-tool correction.
- If V2B or V2A proof fails, stop V2D and recommend the narrowest EvidenceIndex/TextPdfAdapter correction.
- If implementation cannot remain read-only without schema, routes, or data changes, narrow the implementation to component/spec-only or amend this plan before coding.
- If any proposed V2D feature requires write controls, generated advice, public app/MCP, provider work, certification, deployment, source mutation, finance writes, or autonomous action, stop and defer that feature to a future named plan.

## Artifacts and Notes

Artifacts created by this master-plan thread:

- `plans/FP-0084-evidence-atlas-ui-foundation.md`
- directly stale active-doc/roadmap refreshes that point to FP-0084 as the active implementation-ready V2D plan
- validation logs under `/tmp/pocket-cfo-fp0084-validation-20260508T173251Z`

Artifacts intentionally not created:

- FP-0085
- code
- UI
- routes
- schema or migrations
- package scripts or smoke aliases
- eval datasets
- fixtures or sample data
- source-pack fixture edits
- public ChatGPT App, MCP, Apps SDK UI, OAuth, or app submission artifacts
- OpenAI API/vector/file-search, OCR, vector search, or PageIndex artifacts
- provider, certification, deployment, or external communication artifacts
- LLM orchestration, runtime-Codex finance output, generated product prose, source mutation, finance write, or autonomous action

Search-hit classification:

- shipped V2A/V2B/V2C/FP-0083 foundation language: EvidenceIndex, DocumentMap, SourceAnchor, EvidenceCard, SourceCoverageMatrix, TextPdfAdapter, V2C tool names, OSS/security/privacy/demo/self-host references, and direct proof outputs.
- active public-facing stale wording requiring future V2D planning correction: active docs and roadmap lines that said V2D was future-only before FP-0084 existed; these are refreshed in this slice.
- valid internal scaffolding that must not be renamed: `pocket-cto`, `@pocket-cto/*`, GitHub modules, engineering-twin/twin modules, existing route/schema/migration/test fixture vocabulary, and source-pack proof fixtures.
- archived history that must stay reference-only: Pocket CTO-era docs, engineering-first milestones, GitHub-first historical wording, and older EP material.
- future-only planning language: public ChatGPT App, remote MCP, Apps SDK UI, OAuth, app submission, V2E, V2F, V2G, F6V, F6X, OCR/vector/PageIndex/OpenAI file-search adapters, iOS, OpenClaw, deployment, external communications, package rename, GitHub deletion, and engineering-twin deletion.
- behavior leak requiring a smaller corrective slice instead of FP-0084: none found.

Replay and evidence implications:

- This master-plan slice is docs-only and creates no mission state changes, ingest actions, report actions, approvals, replay events, evidence bundles, source mutations, or finance writes.
- Future V2D implementation should create no replay events if it remains derived/read-only UI. If any future action mutates mission/source/report/approval state, it is out of FP-0084 and must stop for a new plan.

External web/browser research:

- No external web or browser research was used.
- No web/search result was used to override repo source truth.

## Interfaces and Dependencies

FP-0084 depends on:

- shipped FP-0083 OSS demo/self-host/security baseline
- shipped FP-0082 local/internal read-only evidence-tool contract and direct proof
- shipped FP-0081 TextPdfAdapter foundation and direct proof
- shipped FP-0080 EvidenceIndex/document-map foundation and direct proof
- existing app/web read-only UI patterns
- existing control-plane source, Finance Twin, CFO Wiki, mission, evidence, proof, reporting, approval, monitoring, close/control, and readiness read surfaces only as references
- local Docker Postgres and S3-compatible object storage for validation
- existing package scripts and proof commands only

FP-0084 does not depend on:

- public ChatGPT App
- remote MCP deployment
- Apps SDK UI
- OAuth
- app submission
- OpenAI API/vector/file-search integration
- OCR/vector/PageIndex implementation
- provider integrations
- certification
- deployment
- external communications
- package-scope rename
- GitHub module deletion
- engineering-twin deletion
- LLM orchestration
- runtime-Codex finance output
- generated product prose
- source mutation
- finance writes
- autonomous action

## Outcomes & Retrospective

Implementation has not started.

Master-plan outcome:

- FP-0084 exists as the active implementation-ready V2D Evidence Atlas UI foundation plan.
- FP-0083 remains the shipped OSS demo/self-host/security baseline record.
- FP-0082 remains shipped V2C, FP-0081 remains shipped V2B, FP-0080 remains shipped V2A, FP-0079 remains shipped F12, FP-0078 remains shipped F11, FP-0077 remains shipped F10, FP-0076 remains shipped F9, FP-0075 remains shipped F8, FP-0074 remains shipped F7, and FP-0050 through FP-0073 remain shipped F6 records.
- No FP-0085 is created.
- No code, UI, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, sample data, source-pack changes, public app/MCP, Apps SDK, OAuth, app submission, provider work, certification, deployment, external communications, OCR/vector/PageIndex/OpenAI file-search, LLM orchestration, runtime-Codex finance output, generated prose, source mutation, finance write, or autonomous action is added.
- Required validation passed, including `pnpm ci:repro:current`.
- Exact next recommendation after this plan ships: start one V2D implementation slice for the Source Coverage Matrix UI only, with a read-only capability boundary panel and unsupported/missing/stale states. Do not start V2E, V2F, public ChatGPT App/MCP, provider integration, certification, OCR/vector/PageIndex/OpenAI file-search, deployment, external communications, package-scope rename, FP-0085, or any high-liability action track.
