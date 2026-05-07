# FP-0080 - Plan EvidenceIndex and Document-Map Foundation

## Purpose / Big Picture

The target phase is `V2A`, and the exact slice is `V2A-evidence-index-and-document-map-foundation`.

The user-visible goal is narrow: after shipped F12, Pocket CFO needs an implementation-ready contract for a native read-only EvidenceIndex and document-map foundation. The foundation should make raw evidence, derived Finance Twin facts, and compiled CFO Wiki context easier for a human or future read-only agent to inspect without weakening the authority model.

This master-plan thread is docs-and-plan only. It creates this FP-0080 contract and refreshes directly stale active docs. It does not implement EvidenceIndex, document maps, product runtime behavior, code, UI, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, source-pack behavior, provider integration, certification, PDF/OCR/vector/PageIndex integration, OpenAI vector store/file-search integration, MCP, ChatGPT App, iOS, OpenClaw, deployment, external communications, package-scope renames, GitHub module deletion, engineering-twin deletion, source mutation, finance writes, generated product prose, or autonomous finance action.

The future implementation under this plan should start from deterministic markdown/plain-text and already-supported source text only. Unsupported PDFs, scans, image-only files, ambiguous layout, OCR-only content, vector-only hits, tables, figures, and graphics must fail closed with explicit limitations rather than fake precision.

GitHub connector product work is explicitly out of scope. Routine git, `gh`, push, and PR operations for this repository do not invoke GitHub Connector Guard.

## Progress

- [x] 2026-05-07T17:30:07Z - Invoked the Pocket CFO operator skills required for this slice: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor.
- [x] 2026-05-07T17:30:07Z - Completed preflight against fetched `origin/main`; branch, clean worktree, GitHub auth/repo access, Docker Postgres/MinIO availability, FP-0079 on `origin/main`, local FP-0079, no FP-0080, and no FP-0081 all supported V2A planning.
- [x] 2026-05-07T17:30:07Z - Read the active documentation spine, shipped FP-0076 through FP-0079 records, roadmap, package metadata, ops/eval docs, web surface inventory, source registry, CFO Wiki, Finance Twin, finance discovery, monitoring, close/control, evidence, reporting, domain, db, and source-pack proof boundaries needed for a docs-only V2A plan.
- [x] 2026-05-07T17:30:07Z - Completed the required repository search pass for FP-0080/FP-0081, V2A, EvidenceIndex, document-map, source-anchor, evidence-card, evidence-trace, source-coverage-matrix, PageIndex, vector, file-search, OCR, PDF, MCP, ChatGPT App, provider integration, actual certification, deployment, external communications, generated prose, source mutation, finance write, autonomous behavior, `pocket-cto`, `@pocket-cto`, GitHub-first, and engineering-first wording.
- [x] 2026-05-07T17:30:07Z - Decided V2A is safe to plan as an EvidenceIndex/document-map foundation because repo truth supports a read-only native anchor/trace layer and does not require provider/certification/PDF/OCR/vector/PageIndex/MCP/ChatGPT App/iOS/OpenClaw/deployment/external-communications work.
- [x] 2026-05-07T17:30:07Z - Created this FP-0080 active implementation-ready contract for the next V2A implementation thread, while keeping this master-plan thread docs-and-plan only.
- [x] 2026-05-07T17:30:07Z - Refreshed directly stale active docs so they point to FP-0080 as the active V2A implementation-ready plan rather than saying FP-0080 does not exist.
- [x] 2026-05-07T17:36:49Z - Ran the full 36-command docs-and-plan validation ladder serially; all commands passed, including `pnpm ci:repro:current`, with logs under `/tmp/pocket-cfo-v2a-planning-validation.FkMA5cLX44`.
- [x] 2026-05-07T17:36:49Z - Prepared the final docs-and-plan tree for the requested commit, push, PR, and final handoff after validation passed.
- [ ] In a later implementation thread, implement only the first narrow V2A foundation slice described here.

## Surprises & Discoveries

FP-0079 is present locally and on fetched `origin/main`, and the current branch started clean at the same commit as `origin/main`.

The F12 audit report exists at `docs/qa/v1-ui-demo-readiness-audit.md`. It records the local browser screenshot-capture limitation, deferred demo seed/self-host baseline, and the verdict that one more F12 corrective slice is not required before V2A planning.

No FP-0080 or FP-0081 plan file existed before this slice. `FP-0080` hits in active docs were references saying it was not created during F12; those lines become directly stale when this plan is created. `FP-0081` had no hits.

Active docs and roadmap already support V2A as the next future master-plan candidate after shipped F12. They also consistently keep V2B document precision, V2C MCP/ChatGPT App, F6V provider integration, F6X actual certification, deeper PDF/OCR/vector search, PageIndex, OpenAI vector store/file search, iOS, OpenClaw, deployment, external communications, package-scope rename, GitHub module deletion, engineering-twin deletion, source mutation, finance writes, generated prose, and autonomous action future-only.

The existing source/CFO Wiki substrate already has useful deterministic document pieces: source records, snapshots, source files, checksums, provenance records, markdown/plain-text ingest receipts, company-scoped wiki source bindings, document extracts, source digest pages, page refs, page links, freshness summaries, and limitations. It does not have a native EvidenceIndex, source anchors, evidence traces, evidence cards, source coverage matrix, PageIndex, vector store, file-search adapter, OCR adapter, table extractor, figure extractor, MCP server, or ChatGPT App.

The existing CFO Wiki document extractor supports deterministic markdown and plain text from stored raw source bytes and explicitly marks unsupported PDFs, scans, unreadable files, and snapshots without stored bytes as gaps. That is the correct first V2A implementation boundary.

The source-pack proof tools already prove immutable fixture posture, fixed monitor/discovery family boundaries, no runtime-Codex usage, no provider calls, no delivery, no certification, no generated prose, no source mutation outside proof setup, no finance writes, and no autonomous action. The V2A proof should copy that style rather than adding a UI-first proof.

`pocket-cto` and `@pocket-cto` hits are valid internal scaffolding. They must not be renamed in V2A planning or implementation.

GitHub-first and engineering-first hits are either historical/architecture references, active docs that explicitly demote them, or isolated existing connector/twin scaffolding. No product behavior leak requires a smaller corrective slice.

No external web research was used in this planning pass. Repo source truth was current code, current active docs, shipped Finance Plans, and this active Finance Plan.

## Decision Log

Decision: V2A is safe to plan now.
Rationale: FP-0079/F12 is shipped, active docs support FP-0079 as shipped, `docs/qa/v1-ui-demo-readiness-audit.md` exists, README/CODEX_README/PROJECT_STATE/V2_BOUNDARY exist and are linked, no FP-0080 or FP-0081 existed, and this master-plan slice can remain docs-and-plan only.

Decision: V2A is exactly `V2A-evidence-index-and-document-map-foundation`.
Rationale: one narrow foundation is safer than mixing EvidenceIndex with precision adapters, UI, LLM orchestration, MCP/ChatGPT App, provider work, certification, or deployment.

Decision: V2A is not OCR/vector/PageIndex.
Rationale: OpenAI vector stores, OpenAI file search, PageIndex, OCR, PDF parsers, table extractors, graphics extractors, and vector databases may be named only as future adapters or platform context. They are not canonical source truth in V2A.

Decision: V2A is not ChatGPT App/MCP.
Rationale: MCP and ChatGPT App remain V2C or later. They must wait for EvidenceIndex proof and must expose read-only structured evidence tools only.

Decision: V2A is not LLM orchestration.
Rationale: no runtime LLM classification, summarization, generated answers, generated advice, generated product prose, or runtime-Codex finance output belongs in V2A.

Decision: V2A is not provider integration or certification.
Rationale: F6V actual provider integration and F6X actual certification remain future-only. V2A must not add provider calls, provider credentials, provider jobs, outbox sends, delivery, certification, certified status, close-complete status, sign-off, attestation, assurance, legal/audit opinion, or external release behavior.

Decision: preserve the EvidenceIndex authority model.
Rationale: raw sources remain authoritative for document claims, the Finance Twin remains authoritative for structured finance facts, and the CFO Wiki remains compiled/derived. EvidenceIndex is a canonical read-only anchor/trace layer, not source truth and not a second Finance Twin.

Decision: every future EvidenceCard must preserve the four-field output posture.
Rationale: humans and future agents must see `evidence`, `freshness`, `limitations`, and `permitted next action` together. Cards that cannot populate those fields truthfully must fail closed.

Decision: the first implementation starts with markdown/plain-text and already-supported deterministic source text only.
Rationale: current code already proves deterministic markdown/plain-text extraction. Unsupported PDFs, scans, image-only files, ambiguous layout, OCR-only content, vector-only hits, tables, figures, and graphics must produce unsupported CapabilityBoundary and LimitationPosture records instead of claims.

Decision: the F12 public demo/self-host baseline is not a blocker for V2A implementation.
Rationale: F12 recorded that a one-command demo seed/self-host baseline and reliable screenshot capture remain missing, but those are deferred demo-packaging work. V2A can be proven by a direct read-only proof command without claiming public demo polish.

Decision: the first implementation shape should be native, read-only, and proof-command first.
Rationale: the later implementation slice may add only a native EvidenceIndex bounded context, deterministic document maps for supported documents, source anchors, evidence claims, evidence traces, evidence cards, source coverage matrix, a read-only proof command, tests/specs, and active-doc refresh. It should not add UI or routes in the first implementation unless this plan is explicitly amended with exact route scope.

Decision: use one machine-readable humans-and-agents contract.
Rationale: EvidenceCard and related schemas should be shared by humans, CLI proof output, future UI, and future agents. The contract must not expose write tools.

Decision: do not invoke GitHub Connector Guard.
Rationale: this slice does not touch GitHub connector product behavior. Routine repository PR work stays outside the product connector boundary.

## Context and Orientation

Current shipped plan truth:

- FP-0079 is the shipped F12 manual UI/demo-readiness audit record.
- FP-0078 is the shipped F11 public repo hygiene and V2 transition record.
- FP-0077 is the shipped F10/v1 public launch handoff record.
- FP-0076 is the shipped F9 read-only product UI truthfulness polish record.
- FP-0075 is the shipped F8 future-scope triage record.
- FP-0074 is the shipped F7 launch-readiness record.
- FP-0050 through FP-0073 remain shipped F6 records.

Shipped monitor families remain exactly:

- `cash_posture`
- `collections_pressure`
- `payables_pressure`
- `policy_covenant_threshold`

Shipped finance-discovery families remain exactly:

- `cash_posture`
- `collections_pressure`
- `payables_pressure`
- `spend_posture`
- `obligation_calendar_review`
- `policy_lookup`

Internal package scope remains `@pocket-cto/*`, and the root package name remains `pocket-cto`. V2A must preserve those names.

GitHub modules and engineering-twin modules remain valid internal/historical scaffolding. V2A must not delete them.

The current authority model is:

- raw sources, source files, source snapshots, checksums, and provenance are authoritative for document claims
- Finance Twin persisted state is authoritative for structured finance facts
- CFO Wiki pages, source digest pages, filed pages, and exports are compiled or filed derived artifacts
- mission outputs, reports, readiness, monitoring, and proof bundles are derived and must show provenance, freshness, limitations, and absence boundaries

The current source families that can provide deterministic text/markdown evidence first are:

- F6W policy/covenant document source-pack sources with document role `policy_document` and media types `text/markdown` or `text/plain`
- F6Y board/lender document source-pack sources with document roles `board_material` and `lender_document` and media types `text/markdown` or `text/plain`
- any existing company-scoped CFO Wiki source binding with document role `general_document`, `policy_document`, `board_material`, or `lender_document`, source kind `document`, stored raw bytes, and deterministic markdown/plain-text extraction status `extracted`

The existing CSV source-pack families can provide structured anchors through Finance Twin lineage but should not be treated as document-map body text in the first implementation:

- F6L bank/card source-pack
- F6O receivables/payables source-pack
- F6R contract/obligation source-pack
- F6U ledger/reconciliation source-pack

Safe first document roles are:

- `general_document`
- `policy_document`
- `board_material`
- `lender_document`

Safe first source roles are the current shipped source-pack roles and explicitly bound document roles only. V2A must not infer company scope, document role, source role, or source authority from filenames or natural-language guesses.

## Plan of Work

This master-plan thread creates the active FP-0080 plan and refreshes directly stale active docs only. It creates no product runtime behavior.

The later V2A implementation thread should follow this sequence:

1. Add shared domain contracts for EvidenceIndex concepts and EvidenceCard schemas, keeping them pure and package-boundary safe.
2. Add a native control-plane bounded context only if needed under `apps/control-plane/src/modules/evidence-index/**`.
3. Build deterministic document maps from existing supported markdown/plain-text CFO Wiki document extracts and source metadata.
4. Build source anchors that point back to source id, snapshot id, source file id, checksum, extraction method, and deterministic section or line locators.
5. Build evidence claims and evidence traces that reference SourceAnchor records plus optional Finance Twin refs and CFO Wiki refs.
6. Build EvidenceCards that expose evidence, freshness, limitations, permitted next action, and forbidden actions.
7. Build a SourceCoverageMatrix that states supported, unsupported, stale, failed, missing, and ambiguous coverage by source/document role.
8. Add `tools/evidence-index-foundation-proof.mjs` as a direct read-only proof command.
9. Add focused specs for schemas, mapping, fail-closed unsupported cases, and proof output.
10. Run the validation ladder and update this plan before closeout.

The first implementation should not add UI. Evidence Atlas UI belongs to a later V2D plan after the substrate exists.

The first implementation should not add read-only routes. If a later amendment under this plan proves that routes are required before UI, the only allowed route scope to consider is read-only company-scoped EvidenceIndex fetch/list surfaces that return the same EvidenceCard contract as the proof command. No write route, POST action, external tool, source mutation, finance write, or agent write tool is allowed.

## Concrete Steps

This master-plan thread may touch only:

- `plans/FP-0080-evidence-index-and-document-map-foundation.md`
- `README.md` if stale after FP-0080 creation
- `CODEX_README.md` if stale after FP-0080 creation
- `START_HERE.md` if stale after FP-0080 creation
- `docs/ACTIVE_DOCS.md` if stale after FP-0080 creation
- `docs/PROJECT_STATE.md` if stale after FP-0080 creation
- `docs/V2_BOUNDARY.md` if stale after FP-0080 creation
- `PLANS.md` only if directly stale
- `plans/ROADMAP.md` if stale after FP-0080 creation
- `docs/ops/local-dev.md`, `docs/ops/source-ingest-and-cfo-wiki.md`, `docs/ops/codex-app-server.md`, `docs/benchmarks/seeded-missions.md`, and `evals/README.md` only if directly stale

The future implementation thread may add, but must not add in this master-plan thread:

- possible new bounded context: `apps/control-plane/src/modules/evidence-index/**`
- possible domain package additions: `packages/domain/src/evidence-index*.ts` or equivalent
- possible DB schema/migration only if derived read models cannot satisfy the proof
- possible read-only routes only if this plan is amended with exact route scope
- direct proof command: `tools/evidence-index-foundation-proof.mjs`
- focused tests/specs
- active-doc refresh

The future implementation thread must not add:

- UI
- write routes
- schema/migration unless proven necessary and additive
- package scripts or smoke aliases
- eval datasets
- fixtures
- monitor families
- discovery families
- provider integration
- certification
- PDF/OCR/vector/PageIndex/OpenAI vector store/file-search implementation
- ChatGPT App or MCP implementation
- iOS or OpenClaw implementation
- deployment or external communications
- package-scope rename
- GitHub module deletion
- engineering-twin deletion
- runtime LLM orchestration
- runtime-Codex finance answers
- generated advice or generated product prose
- source mutation
- finance writes
- autonomous action
- FP-0081

Concept definitions for V2A:

- `SourceDocument`: a registered source/snapshot/file tuple with source id, snapshot id, source file id when available, source kind, document role when bound, media type, checksum, storage ref, captured timestamp, provenance, and extraction support posture.
- `SourceAnchor`: a stable read-only locator into a SourceDocument. It must include source id, snapshot id, source file id when available, checksum, extraction method, locator kind, locator value, and limitation posture. It is an anchor to authority, not the authority itself.
- `DocumentMap`: a deterministic map of supported SourceDocument structure. For V2A it may include sections and text spans for markdown/plain-text only, plus unsupported placeholders for pages, tables, figures, PDFs, scans, graphics, and ambiguous layout.
- `SourcePage`: a logical page or page-like segment. In V2A markdown/plain-text, this may be a synthetic page/segment with explicit `not_pdf_page` or equivalent limitation rather than a PDF page claim.
- `SourceSection`: a heading, paragraph group, or deterministic text section with stable ordering and line/span locators.
- `SourceTable`: a table placeholder in V2A unless a deterministic table extractor is later planned. It must fail closed for markdown tables if semantic table claims cannot be proven.
- `SourceFigure`: a figure/graphic placeholder in V2A. It must never claim visual facts without a later figure/graphics extractor plan.
- `EvidenceClaim`: a machine-readable claim extracted or derived from stored evidence. It must state claim type, claim text, authority basis, extraction method, source anchors, optional Finance Twin refs, optional Wiki refs, freshness, limitations, and confidence or method posture.
- `EvidenceTrace`: the read-only path from EvidenceClaim back to SourceAnchor, SourceDocument, Finance Twin refs, CFO Wiki refs, proof-bundle refs, and limitations. It must be inspectable by humans and future agents.
- `EvidenceCard`: the shared human/agent output contract. It packages claim, evidence, freshness, limitations, permitted next actions, and forbidden actions without becoming source truth.
- `SourceCoverageMatrix`: a company-scoped coverage read model that shows source roles, document roles, supported extraction methods, unsupported capability gaps, freshness, missing-source posture, failed extraction posture, and limitation posture.
- `CapabilityBoundary`: a structured statement of what V2A can and cannot do for a source or claim, including unsupported PDF, OCR, vector, PageIndex, table, figure, and LLM limitations.
- `ExtractionMethod`: an explicit enum-like method posture such as `source_metadata`, `markdown_text_deterministic`, `plain_text_deterministic`, `cfo_wiki_document_extract`, `finance_twin_lineage`, `cfo_wiki_ref`, `unsupported_pdf`, `unsupported_scan`, `unsupported_table`, `unsupported_figure`, `unsupported_vector_only`, or `unsupported_ocr_only`.
- `FreshnessPosture`: a structured freshness state that reuses existing fresh/stale/missing/failed/mixed semantics where possible and carries source captured time, extract time, compile time, sync time, or proof time as applicable.
- `LimitationPosture`: a structured list of limitations with codes, severity or blocking posture, human-readable summary, and affected anchors/claims.
- `PermittedNextAction`: a structured next-step posture such as `inspect_source`, `open_cfo_wiki_page`, `open_finance_twin_ref`, `rerun_existing_compile`, `run_existing_source_pack_proof`, or `request_human_review`. It must exclude writes, sends, provider calls, certification, and autonomous action.

First EvidenceCard shape:

```ts
type EvidenceCard = {
  id: string;
  companyKey: string;
  claimType: string;
  claimText: string;
  evidence: {
    sourceAnchors: SourceAnchor[];
    financeTwinRefs: Array<{
      targetKind: string;
      targetId: string;
      routePath?: string;
      summary: string;
    }>;
    wikiRefs: Array<{
      pageKey: string;
      refKind?: string;
      locator?: string | null;
      summary: string;
    }>;
    evidenceTraces: EvidenceTrace[];
  };
  sourceAnchors: SourceAnchor[];
  financeTwinRefs: Array<{ targetKind: string; targetId: string; summary: string }>;
  wikiRefs: Array<{ pageKey: string; summary: string }>;
  freshness: FreshnessPosture;
  confidence: {
    method: ExtractionMethod;
    summary: string;
  };
  extractionMethod: ExtractionMethod;
  limitations: LimitationPosture[];
  permittedNextActions: PermittedNextAction[];
  forbiddenActions: string[];
};
```

Required planning answers:

- Which shipped source families can provide deterministic text/markdown evidence first? F6W policy/covenant documents and F6Y board/lender documents, plus existing company-scoped CFO Wiki source bindings for document sources with markdown/plain-text extraction. CSV source packs can provide structured Finance Twin lineage refs but not document-body maps in the first implementation.
- Which current source roles and document roles are safe for V2A foundation? Explicitly bound document roles `general_document`, `policy_document`, `board_material`, and `lender_document`; shipped source-pack source roles may contribute structured lineage only where already supported by deterministic proof paths.
- Should the first implementation index raw source bytes, CFO Wiki pages, source digest pages, Finance Twin refs, or a constrained subset? Use a constrained subset: source metadata/snapshots/files/checksums, existing deterministic markdown/plain-text document extracts and source digest posture, Finance Twin lineage refs, and CFO Wiki page refs. Do not index generated wiki text as source truth, and do not ingest raw bytes wholesale beyond deterministic anchor construction for supported text.
- What is the minimum schema or storage model needed? Start with domain schemas and derived read models. Stable ids can be deterministic from company key, source/snapshot/file ids, checksums, claim type, and locator. Additive DB persistence is optional later only if the implementation proves durable EvidenceCard storage is needed.
- Are schema/migrations needed for implementation, or can V2A foundation start with derived read models? Start with derived read models and no migration. A migration must be additive, plan-amended, and justified by proof needs.
- What read-only routes, if any, are justified in the first implementation? None for the first implementation. The direct proof command is the first human-observable acceptance path.
- What direct proof command should prove EvidenceIndex without relying on UI? `tools/evidence-index-foundation-proof.mjs`.
- How will the proof command show no OCR/vector/PageIndex/LLM/provider/certification/delivery/source mutation/finance write behavior? It should assert before/after counts for missions, reports, approvals, monitor results, delivery/provider/certification/outbox-related tables where available, fixed monitor/discovery family lists, raw fixture checksums, no new source-pack files, no runtime-Codex calls, and explicit booleans in normalized output.
- How will unsupported PDFs/scans/figures/tables fail closed? They should create SourceDocument/CapabilityBoundary/SourceCoverageMatrix unsupported entries and EvidenceCards only for the limitation, not for unproven content claims.
- How will EvidenceIndex avoid duplicating CFO Wiki or Finance Twin authority? EvidenceIndex stores or derives anchors and traces to those authorities. It does not rewrite raw sources, replace Finance Twin facts, or regenerate CFO Wiki pages as truth.
- How will future MCP/ChatGPT App search/fetch use the EvidenceIndex without exposing write tools? V2C may expose read-only search/fetch over EvidenceCard ids, SourceAnchor ids, and SourceCoverageMatrix entries. It must not expose source mutation, finance write, report release, provider, certification, or external communication tools.

## Validation and Acceptance

This master-plan thread is accepted only if:

- `plans/FP-0080-evidence-index-and-document-map-foundation.md` exists as the single new active Finance Plan.
- FP-0081 does not exist.
- Active docs are refreshed only where directly stale because FP-0080 now exists.
- No code, UI, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, implementation scaffolding, package-scope rename, GitHub module deletion, engineering-twin deletion, source-pack behavior, runtime behavior, delivery, provider integration, certification, PDF/OCR/vector/PageIndex/OpenAI file-search implementation, MCP, ChatGPT App, iOS, OpenClaw, source mutation, finance write, generated prose, or autonomous action is added.
- Validation is green before commit.

Future V2A implementation is accepted only if:

- EvidenceIndex concepts are represented in the right module boundaries.
- EvidenceCard output exposes evidence, freshness, limitations, and permitted next action.
- Document maps are limited to markdown/plain-text and already-supported deterministic source text.
- Unsupported PDFs, scans, image-only files, ambiguous layout, OCR-only content, vector-only hits, tables, figures, and graphics fail closed with limitations.
- Raw sources remain authoritative for document claims, Finance Twin remains authoritative for structured facts, and CFO Wiki remains compiled/derived.
- The direct proof command proves the behavior without UI.
- Replay implications are explicit. The expected first implementation is read-only derived indexing and should create no mission replay events unless a later plan-amended design adds a replay-worthy persisted state change.

Run DB-backed smokes serially for this master-plan thread:

```bash
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
pnpm --filter @pocket-cto/domain exec vitest run src/cfo-wiki.spec.ts src/source-registry.spec.ts src/finance-twin.spec.ts src/monitoring.spec.ts src/close-control.spec.ts src/close-control-certification-safety.spec.ts src/external-delivery-human-confirmation-boundary.spec.ts src/close-control-certification-boundary.spec.ts src/external-provider-boundary.spec.ts src/close-control-review-summary.spec.ts src/delivery-readiness.spec.ts src/proof-bundle.spec.ts
zsh -lc "cd apps/control-plane && pnpm exec vitest run src/modules/wiki/**/*.spec.ts src/modules/sources/**/*.spec.ts src/modules/finance-twin/**/*.spec.ts src/modules/finance-discovery/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/close-control-certification-safety/**/*.spec.ts src/modules/external-delivery-human-confirmation-boundary/**/*.spec.ts src/modules/close-control-certification-boundary/**/*.spec.ts src/modules/external-provider-boundary/**/*.spec.ts src/modules/close-control-review-summary/**/*.spec.ts src/modules/delivery-readiness/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/modules/reporting/**/*.spec.ts src/app.spec.ts"
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Master-plan validation status on 2026-05-07:

- Passed. All 36 required commands passed serially.
- Passing log root: `/tmp/pocket-cfo-v2a-planning-validation.FkMA5cLX44`
- No validation reruns were required.

## Idempotence and Recovery

This master-plan slice is retry-safe because it is docs-and-plan only. It creates no mission replay events, monitor results, report artifacts, approvals, delivery records, provider records, certification records, source mutations, finance writes, runtime-Codex outputs, generated product prose, or autonomous actions.

Validation commands may create local database/object-storage test state. They must not mutate repository source truth or raw checked-in fixtures.

If validation fails, record the exact failing command and failure summary in this plan before stopping or applying a docs-only correction. If a failure points to runtime behavior, source-pack behavior, family drift, provider/certification/delivery behavior, package-scope rename, source mutation, finance write, generated prose, or autonomous action, do not broaden V2A. Recommend the smallest corrective slice instead.

If the future V2A implementation discovers that durable storage is required, stop and amend this plan before adding schema or migrations. The default first implementation path is derived read models plus a direct proof command.

If the future V2A implementation discovers that read-only routes are required before UI, stop and amend this plan with exact route scope before adding routes. The default first implementation path is no routes.

Do not create FP-0081 from this plan or its first implementation closeout.

## Artifacts and Notes

Artifacts created by this master-plan thread:

- `plans/FP-0080-evidence-index-and-document-map-foundation.md`
- directly stale active-doc refreshes in `README.md`, `START_HERE.md`, `docs/ACTIVE_DOCS.md`, `docs/PROJECT_STATE.md`, `docs/V2_BOUNDARY.md`, and `plans/ROADMAP.md`
- validation logs under `/tmp/pocket-cfo-v2a-planning-validation.FkMA5cLX44`

Artifacts intentionally not created by this master-plan thread:

- code
- UI
- routes
- schema or migrations
- package scripts or smoke aliases
- eval datasets
- fixtures
- implementation scaffolding
- source-pack changes
- proof tools
- product runtime behavior
- provider integration
- certification
- PDF/OCR/vector/PageIndex/OpenAI vector store/file-search implementation
- MCP or ChatGPT App
- iOS or OpenClaw
- deployment or external communications
- generated product prose
- source mutation
- finance writes
- autonomous actions
- FP-0081

Future implementation artifacts planned but not implemented here:

- `packages/domain/src/evidence-index*.ts` or equivalent
- `apps/control-plane/src/modules/evidence-index/**` if needed
- `tools/evidence-index-foundation-proof.mjs`
- focused specs for EvidenceCard schemas, source anchors, document maps, fail-closed unsupported cases, coverage matrix, and proof output
- optional additive DB schema/migration only if derived read models are proven insufficient
- optional exact read-only routes only if this plan is amended first

External web/browser research used:

- none in this master-plan pass

## Interfaces and Dependencies

V2A depends on:

- Source Registry records, snapshots, source files, checksums, provenance, ingest posture, and storage reads for supported text
- CFO Wiki source bindings, deterministic document extracts, source digest pages, page refs, page links, freshness summaries, and limitations
- Finance Twin read models and lineage refs for structured finance facts
- Evidence/proof bundle conventions for freshness, limitations, absence boundaries, and durable output posture
- existing fixed monitor/discovery family lists as guardrails
- local Docker Postgres and object storage for validation

V2A must preserve package boundaries:

- `packages/domain`: pure EvidenceIndex contracts and schemas only
- `packages/db`: persistence schema and DB helpers only if proven necessary
- `apps/control-plane`: native EvidenceIndex service/repository/formatter/proof integration only if implemented later
- `apps/web`: no first V2A UI
- `packages/codex-runtime`: no V2A runtime-Codex finance behavior
- `packages/stack-packs` and `packages/testkit`: no first V2A source-pack fixture/eval expansion unless a later plan names it

No new environment variables are expected for the first implementation. If storage or adapter configuration becomes necessary, it belongs to a later adapter plan, not V2A foundation.

Future adapters remain out of scope:

- PageIndex
- OCR
- PDF precision parsers
- table extractors
- figure/graphics extractors
- OpenAI vector stores
- OpenAI file search
- generic vector databases
- MCP
- ChatGPT App
- runtime LLM orchestration

## Outcomes & Retrospective

This section is intentionally open while FP-0080 is active.

Master-plan outcome so far: FP-0080 exists as the active V2A implementation-ready contract, directly stale active docs point to it, and the full validation ladder passed. The final handoff will record repository publication state. The master-plan thread added no product runtime behavior.

Expected next recommendation if validation passes: start V2A implementation next under this FP-0080, limited to the read-only EvidenceIndex/document-map foundation and direct proof command described above. One more narrow F12 correction is not required. OSS demo/self-host baseline remains deferred demo-packaging work rather than a blocker for V2A implementation.
