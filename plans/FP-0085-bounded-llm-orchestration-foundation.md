# FP-0085 - Bounded LLM Orchestration Foundation

## Purpose / Big Picture

Status: active implementation-ready V2E bounded LLM orchestration foundation plan, created 2026-05-08T19:28:41Z. Implementation has not started.

Target phase: `V2E`.

Exact slice: `V2E-bounded-llm-orchestration-foundation`.

This master-plan thread is docs-and-plan only. It creates the first V2E implementation-ready Finance Plan after the shipped FP-0084 read-only Evidence Atlas UI foundation. It does not add code, UI, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, sample data, source-pack fixture edits, OpenAI API calls, vector/file-search integration, OCR, PageIndex, public ChatGPT App, remote MCP deployment, Apps SDK UI, OAuth, app submission, provider integration, certification, delivery, deployment, external communications, generated product prose, runtime-Codex finance output, source mutation, finance writes, or autonomous action.

The user-visible purpose of V2E is not to make Pocket CFO sound like a generic AI CFO. The purpose is to plan one bounded orchestration layer that can help a future local/internal proof choose read-only evidence tools, hand deterministic evidence selection to a schema-constrained summary/refusal step, and fail closed when evidence, citations, freshness, limitations, or safety boundaries are insufficient.

V2E may plan only these LLM-adjacent behaviors:

- query planning over a fixed taxonomy of read-only V2C evidence tools
- deterministic evidence selection handoff
- schema-constrained summary drafting after evidence selection
- refusal or unsupported-state generation
- missing-citation detection
- unsafe-action refusal

V2E must not plan generic finance advice, freeform answers, autonomous action, provider work, public app behavior, source mutation, or any finance write.

Authority model remains unchanged:

- raw sources remain authoritative for document claims
- Finance Twin remains authoritative for structured finance facts
- CFO Wiki remains compiled and derived
- EvidenceIndex remains the read-only anchor, trace, card, coverage, and limitation layer
- V2C evidence tools remain the local/internal read-only search, fetch, and inspect contract over EvidenceIndex/TextPdfAdapter artifacts
- V2D Evidence Atlas remains visualization only
- LLM output must never become raw source authority, Finance Twin authority, CFO Wiki authority, EvidenceIndex authority, V2C tool authority, or product source truth

GitHub connector product behavior is explicitly out of scope. Routine `git`, `gh`, push, and PR operations for this repository do not invoke GitHub Connector Guard.

No external web or browser research was used for FP-0085. No official OpenAI docs were opened in this thread. Repo source truth came from current code, current active docs, shipped Finance Plans, fetched `origin/main`, PR #235 metadata, local Docker service posture, and the direct V2 proof commands.

## Progress

- [x] 2026-05-08T19:28:41Z - Invoked the requested Pocket CFO operator skills before work: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor.
- [x] 2026-05-08T19:28:41Z - Confirmed GitHub Connector Guard is not in scope because this slice does not touch GitHub connector product behavior.
- [x] 2026-05-08T19:28:41Z - Ran preflight against fetched `origin/main`; current branch was `codex/v2e-bounded-llm-orchestration-master-plan-local-v1`, the worktree started clean, local `HEAD` matched `origin/main`, GitHub auth/repo access worked, PR #235 was merged, Docker Postgres/MinIO were available, FP-0084 existed locally and on `origin/main`, FP-0085 was absent, FP-0086 was absent, and the required V2 proof commands existed.
- [x] 2026-05-08T19:28:41Z - Ran direct V2 proofs before writing: `pnpm exec tsx tools/read-only-evidence-app-proof.mjs`, `pnpm exec tsx tools/document-precision-foundation-proof.mjs`, and `pnpm exec tsx tools/evidence-index-foundation-proof.mjs`; all passed.
- [x] 2026-05-08T19:28:41Z - Read the active documentation spine, shipped FP-0084/FP-0083/FP-0082/FP-0081/FP-0080 records, package metadata, V2D Evidence Atlas UI files, V2A EvidenceIndex implementation, V2B TextPdfAdapter implementation, V2C evidence-tool contracts/services, domain exports, and direct proof tooling.
- [x] 2026-05-08T19:28:41Z - Completed the required search pass for FP-0085, FP-0086, V2E, bounded LLM terms, proposed orchestration surface names, platform terms, high-liability terms, route/schema/migration/script/fixture/sample-data terms, internal package scaffolding, GitHub-first wording, and engineering-first wording.
- [x] 2026-05-08T19:28:41Z - Decided V2E is safe to plan now as `V2E-bounded-llm-orchestration-foundation` because FP-0084 is merged and shipped, active docs support FP-0084 as shipped, direct V2 proofs pass, EvidenceIndex/TextPdfAdapter/V2C/V2D implementations exist, and this master-plan slice can remain docs-and-plan only.
- [x] 2026-05-08T19:28:41Z - Created this FP-0085 active implementation-ready plan and refreshed only directly stale active-doc/roadmap wording.
- [x] 2026-05-08T19:37:30Z - Ran the required docs-and-plan validation ladder; all requested proof, smoke, focused spec, lint, typecheck, root test, and `pnpm ci:repro:current` commands passed.
- [x] 2026-05-08T19:41:33Z - Ran final post-closeout sanity on the docs-only tree: `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed.
- [x] 2026-05-08T19:41:33Z - Prepared the docs-only tree for the requested commit, push, and PR workflow.

## Surprises & Discoveries

- FP-0084 is present locally and on fetched `origin/main` as the shipped V2D read-only Evidence Atlas UI foundation record.
- PR #235 is merged into `main`, and local `HEAD` matched fetched `origin/main` at preflight.
- No FP-0085 file existed before this slice, and no FP-0086 file exists.
- `tools/read-only-evidence-app-proof.mjs`, `tools/document-precision-foundation-proof.mjs`, and `tools/evidence-index-foundation-proof.mjs` all exist and passed before this plan was created.
- EvidenceIndex is implemented under `apps/control-plane/src/modules/evidence-index/**` and exported through `packages/domain/src/evidence-index*.ts`.
- TextPdfAdapter is implemented under `apps/control-plane/src/modules/evidence-index/adapters/text-pdf/**` with deterministic embedded-text PDF support only for narrow policy/covenant text-PDF inputs and fail-closed unsupported posture for OCR, vector, PageIndex, tables, figures, scans, image-only PDFs, no-text PDFs, and ambiguous layout.
- V2C read-only evidence tools are implemented under `apps/control-plane/src/modules/evidence-index/tools/**` and exported through `packages/domain/src/evidence-tool*.ts`.
- The shipped V2C tool taxonomy is exactly `search_evidence`, `fetch_evidence_card`, `fetch_source_anchor`, `fetch_document_map`, `fetch_source_coverage`, `fetch_company_posture`, and `fetch_capability_boundaries`.
- V2D Evidence Atlas is implemented as a local read-only `apps/web` route at `/evidence-atlas`. It deliberately has no backend EvidenceIndex/V2C read route and renders live-artifact absence as a limitation.
- The proposed V2E surface names `QueryPlanner`, `EvidenceToolPlan`, `BoundedEvidenceSummary`, `CitationRequirement`, `MissingCitationRefusal`, `UnsupportedEvidenceRefusal`, `UnsafeActionRefusal`, `LlmOrchestrationAuditEvent`, `LlmPromptInjectionBoundary`, `LlmToolAllowlist`, `LlmForbiddenAction`, `LlmOutputSchema`, `EvidenceFaithfulnessGrade`, `MissingCitationGrade`, and `UnsafeActionRefusalGrade` do not exist in current source.
- Search hits for V2E and bounded LLM terms were active guardrails, shipped plan records, future-only roadmap language, or the user-requested terms in this prompt. No V2E implementation exists.
- Search hits for OpenAI, vector, file-search, OCR, PageIndex, public ChatGPT App, remote MCP, Apps SDK, OAuth, and app submission were active safety boundaries, shipped V2B/V2C/V2D future-only language, historical FP-0082 official-doc context, or existing eval/runtime scaffolding outside V2E. No V2E implementation depends on them.
- Search hits for provider, certification, delivery, report release, payment, legal advice, audit opinion, source mutation, finance write, runtime-Codex, generated advice, and autonomous action were active safety boundaries, shipped absence assertions, existing internal boundary/readiness modules, or archived history. No behavior leak requires a smaller corrective slice before FP-0085.
- Search hits for route, schema, migration, package script, smoke alias, eval dataset, fixture, sample data, `pocket-cto`, and `@pocket-cto` are valid shipped code, active guardrails, source-pack proof posture, DB migration history, or internal scaffolding. They must not be renamed or mutated in V2E planning.
- No external web/search research was used. If a later implementation needs official/current OpenAI Structured Outputs, Agents SDK guardrails, MCP/Apps SDK/Developer Mode, evals/graders, or security/privacy docs, that implementation record must name the official source and state exactly what it was used for.

## Decision Log

Decision: FP-0085 is safe to create now.
Rationale: FP-0084 is merged and shipped, active docs identify FP-0084 as shipped, V2A/V2B/V2C direct proof commands exist and pass, EvidenceIndex/TextPdfAdapter/V2C local read-only contracts exist, V2D Evidence Atlas exists, README/CODEX_README/PROJECT_STATE/V2_BOUNDARY exist and are linked, and this master-plan thread remains docs-and-plan only.

Decision: V2E is exactly `V2E-bounded-llm-orchestration-foundation`.
Rationale: one bounded LLM orchestration foundation is safer than mixing LLM planning with V2F benchmark/community packs, public ChatGPT App/MCP, Apps SDK, OAuth, app submission, OpenAI vector/file-search, OCR, PageIndex, provider integrations, certification, delivery, deployment, package renames, GitHub deletion, engineering-twin deletion, source mutation, finance writes, generated advice, or autonomous action.

Decision: V2E is not generic AI CFO.
Rationale: V2E may plan only query planning over a fixed read-only tool taxonomy, deterministic evidence selection handoff, schema-constrained summary drafting after evidence selection, refusal generation, missing-citation detection, and unsafe-action refusal. It must not emit freeform finance advice or create product authority.

Decision: V2E is not source truth.
Rationale: LLM output must never override raw sources, source snapshots, checksums, provenance, freshness posture, Finance Twin facts, CFO Wiki pages, EvidenceIndex artifacts, V2C tool responses, mission answers, proof bundles, limitations, or permitted-next-action posture.

Decision: QueryPlanner should be the first orchestration primitive.
Rationale: a `QueryPlanner` over a fixed V2C tool allowlist proves the narrowest useful boundary before any summary drafting. `BoundedEvidenceSummary`, `MissingCitationRefusal`, and `UnsafeActionRefusal` still belong in the first contract/proof posture, but the first implementation primitive should prove tool planning and fail-closed validation before summary text.

Decision: first implementation should be local proof-only over synthetic in-memory V2C tool responses.
Rationale: this allows contract validation, refusal behavior, prompt-injection handling, citation checks, and evidence-faithfulness grading without real provider calls, public app behavior, fixtures, sample data, source-pack mutation, schema, routes, or finance product output.

Decision: first implementation can avoid OpenAI API calls entirely.
Rationale: V2E can model schemas, validation, deterministic orchestration boundaries, and proof outputs before choosing a model provider. No OpenAI client, key, API call, model selection, pricing assumption, vector/file-search integration, or Apps SDK implementation belongs in this planning thread.

Decision: V2E implementation is safe before V2F benchmark/community pack only if the first implementation is local/internal proof-only.
Rationale: a public benchmark/community pack is not required to prove the first local contract boundary. V2F should consume the V2E schemas, grade definitions, and proof cases later, after V2E has a narrow local contract to benchmark. If implementation pressure shifts toward public claims, real model calls, sample packs, or community distribution, stop and plan V2F first.

Decision: no schema/migration is planned for first V2E.
Rationale: query/audit posture can start as structured in-memory proof output. Additive persistence may be considered only in a later plan after privacy, retention, replay, and product-behavior boundaries are proven.

Decision: no route, UI, package script, smoke alias, eval dataset, fixture, sample data, or source-pack change is planned for first V2E.
Rationale: first proof can use focused specs and a direct proof command over synthetic in-memory V2C responses. It must not create new product surfaces, checked-in data, or source-pack behavior.

Decision: no replay event is added in this master-plan thread.
Rationale: this thread changes docs only. It creates no mission state transition, ingest action, report action, approval, source mutation, finance write, durable output, or product runtime behavior.

Decision: public ChatGPT App planning must wait.
Rationale: public app/MCP work needs V2E local proof, V2F benchmark/community-pack decisions, auth/privacy/security threat modeling, public no-write/no-exfiltration posture, deployment posture, Apps SDK/OAuth/app submission scope, and a dedicated future Finance Plan.

## Context and Orientation

Current shipped plan truth:

- FP-0084 is the shipped V2D read-only Evidence Atlas UI foundation record.
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

The exact gap from V2A/V2B/V2C/V2D that justifies V2E now is bounded navigation over existing evidence contracts. V2A created SourceAnchors, DocumentMaps, EvidenceCards, SourceCoverageMatrix, freshness, limitations, and permitted next actions. V2B added one deterministic TextPdfAdapter candidate. V2C created local/internal read-only search/fetch/inspect tools. V2D made the evidence contract human-visible in a read-only atlas. The remaining safe next gap is not evidence creation. It is a bounded planner/refusal layer that can decide which read-only evidence tools are relevant, require citations, refuse unsupported or unsafe states, and prepare a schema-constrained summary only after deterministic evidence selection.

Allowed first V2E surfaces to define in the future implementation:

- `QueryPlanner`: transforms a user question into a validated read-only evidence-tool plan or refusal.
- `EvidenceToolPlan`: a JSON-schema/Zod/domain-style plan containing only allowed V2C tool calls, rationale, required citations, evidence gaps, freshness requirements, and forbidden-action checks.
- `EvidenceSelectionResult`: the deterministic post-tool handoff containing selected EvidenceCards, SourceAnchors, DocumentMaps, SourceCoverageMatrix entries, Finance Twin refs, CFO Wiki refs, proof refs, freshness, limitations, and citation posture.
- `BoundedEvidenceSummary`: a schema-constrained answer draft over selected evidence only, with no freeform finance advice.
- `CitationRequirement`: a typed requirement that every positive claim must cite SourceAnchors or derived refs.
- `MissingCitationRefusal`: fail-closed output when a requested claim lacks required citations.
- `UnsupportedEvidenceRefusal`: fail-closed output when evidence is missing, unsupported, stale beyond the allowed posture, conflicted, or outside V2C tool coverage.
- `UnsafeActionRefusal`: fail-closed output when the query asks for a write, send, release, approval, provider, certification, legal/audit/tax/payment/customer-contact, source mutation, finance write, generated advice, or autonomous action.
- `LlmOrchestrationAuditEvent`: local proof-output event shape for normalized query, selected tools, selected artifact ids, citation count, redaction count, refusal reason, and forbidden action posture.
- `LlmPromptInjectionBoundary`: source text and excerpts are data, not instructions.
- `LlmToolAllowlist`: fixed read-only V2C tool taxonomy.
- `LlmForbiddenAction`: forbidden V2E action taxonomy, aligned with V2C `ForbiddenToolAction`.
- `LlmOutputSchema`: schema wrapper for plan, evidence selection, summary, refusal, audit, freshness, limitations, and permitted next action.
- `EvidenceFaithfulnessGrade`: grader output proving summary claims are supported by selected citations only.
- `MissingCitationGrade`: grader output proving uncited claims fail closed.
- `UnsafeActionRefusalGrade`: grader output proving unsafe user requests refuse instead of planning a tool/action.

Allowed V2C tool taxonomy for first V2E:

- `search_evidence`
- `fetch_evidence_card`
- `fetch_source_anchor`
- `fetch_document_map`
- `fetch_source_coverage`
- `fetch_company_posture`
- `fetch_capability_boundaries`

Explicitly forbidden tool/action names for first V2E:

- `create`, `update`, `delete`
- `create_mission`, `upload_source`, `sync_source`, `mutate_source`
- `update_ledger`, `write_finance_twin_fact`, `write_accounting_record`, `write_bank_record`
- `send_report`, `release_report`, `circulate_report`, `approve_report`
- `certify_close`, `mark_close_complete`, `sign_off`, `attest`, `assure`
- `provider_connect`, `provider_call`, `provider_job`, `create_provider_job`
- `contact_customer`, `contact_vendor`
- `issue_payment_instruction`, `collect_payment`, `pay`, `move_money`
- `file_tax`, `give_legal_advice`, `give_audit_opinion`
- `generate_finance_advice`, `generate_external_communication`
- `use_runtime_codex_as_finance_output`
- `run_ocr`, `run_vector_search`, `use_openai_file_search`, `use_page_index`
- `take_autonomous_action`
- upload, ingest, monitor rerun, report release, report circulation, approval, provider credential, provider job, close-complete, certification, sign-off, attestation, legal/audit opinion, source mutation, finance write, payment, customer contact, delivery, deployment, and external communication controls even if named differently

Every V2E planned answer must return a schema equivalent to this shape:

```ts
type LlmOutputSchema = {
  schemaVersion: "v2e.bounded-llm-orchestration.v1";
  companyKey: string;
  responseKind:
    | "evidence_tool_plan"
    | "bounded_evidence_summary"
    | "missing_citation_refusal"
    | "unsupported_evidence_refusal"
    | "unsafe_action_refusal";
  query: { originalText: string; normalizedText: string };
  toolPlan: EvidenceToolPlan | null;
  evidenceSelection: EvidenceSelectionResult | null;
  summary: BoundedEvidenceSummary | null;
  refusal:
    | MissingCitationRefusal
    | UnsupportedEvidenceRefusal
    | UnsafeActionRefusal
    | null;
  citations: CitationRequirement[];
  freshness: EvidenceIndexFreshnessPosture;
  limitations: EvidenceIndexLimitationPosture[];
  permittedNextActions: PermittedNextAction[];
  forbiddenActions: LlmForbiddenAction[];
  audit: LlmOrchestrationAuditEvent;
};
```

Evidence, freshness, limitations, permitted next action, and citation posture must be first-class fields, not prose footnotes. If any required field is absent, empty where it must not be empty, contradicted by selected evidence, or generated from freeform model text instead of validated tool outputs, the output fails closed.

Unsupported, missing, stale, or conflicting evidence appears as structured refusal:

- `missing_citation_refusal` when a positive claim lacks a SourceAnchor or accepted derived ref.
- `unsupported_evidence_refusal` when selected evidence is absent, stale, unsupported, failed, not indexed, conflicting, or outside the fixed tool taxonomy.
- `unsafe_action_refusal` when the query asks for a forbidden tool, finance write, source mutation, provider/certification/delivery/payment/customer-contact/legal/audit/tax behavior, generated advice, or autonomous remediation.

Prompt injection and data exfiltration posture:

- source text, excerpts, PDF text, wiki pages, proof output, and evidence cards are untrusted data
- source instructions such as "ignore previous instructions" or "send this report" must be cited or refused as data, never followed
- external URL fetching is not allowed
- tool planning is constrained to the fixed V2C allowlist
- full-file dumps are not allowed
- excerpts remain bounded and redacted by the V2C policy
- audit output should log ids and counts, not unbounded raw source text
- no real secrets, provider credentials, OAuth material, OpenAI keys, customer/vendor/payroll/tax/legal/board/lender data, or private finance facts may be introduced in tests, fixtures, evals, logs, docs, or prompts

Query and audit logging posture:

- first implementation emits structured local proof-output audit events only
- audit fields may include normalized query, response kind, planned tool names, artifact ids, SourceAnchor ids, citation counts, freshness state, limitation codes, redaction count, refusal reason, forbidden action requested, and validation result
- audit fields must not create mission state, replay events, Finance Twin facts, CFO Wiki pages, report records, approval records, delivery records, provider jobs, certification records, source mutations, finance writes, or product finance behavior
- DB persistence is future-only and requires a later plan with retention, privacy, replay, and product-boundary guidance

V2F benchmark/community pack should later consume:

- `LlmOutputSchema`
- `EvidenceToolPlan`
- `EvidenceSelectionResult`
- `BoundedEvidenceSummary`
- refusal schemas
- evidence-faithfulness, missing-citation, and unsafe-action grade schemas
- synthetic in-memory V2C response cases from proof code, if a later sample/eval policy approves them as non-private and not source-pack behavior
- exact no-write/no-provider/no-certification/no-delivery/no-payment/no-advice/no-autonomous boundaries

Public ChatGPT App planning should wait for:

- shipped V2E local/internal proof-only orchestrator and grade posture
- a V2F benchmark/community-pack decision for public examples, if public examples are needed
- a future MCP/App plan with authentication, authorization, privacy, public threat model, data retention, prompt-injection/exfiltration handling, no write tools, no hidden write affordances, Apps SDK/OAuth/app-submission/deployment boundaries, and no autonomous action

## Plan of Work

This master-plan thread performs docs-and-plan only:

1. Verify shipped FP-0084 and V2A/V2B/V2C/V2D repo truth.
2. Run direct V2 proofs before writing.
3. Search and classify V2E, platform, high-liability, route/schema/script/data, and scaffolding terms.
4. Create exactly one new active Finance Plan: `plans/FP-0085-bounded-llm-orchestration-foundation.md`.
5. Refresh only directly stale active docs that still say FP-0085 does not exist or that V2E is only future-plan text.
6. Record no external web research was used.
7. Run the required docs-and-plan validation ladder.
8. Commit, push, and open the requested PR if validation passes.

The future implementation should stay modular:

- `packages/domain`: pure V2E schema contracts and grade contracts only.
- `apps/control-plane/src/modules/llm-orchestration/**` or equivalent bounded context: local/internal proof-only orchestration service over synthetic in-memory V2C tool responses.
- `tools/bounded-llm-orchestration-proof.mjs`: direct proof command if implementation adds it, with no package script or smoke alias.
- focused specs beside touched domain/control-plane modules.

The future implementation must not add HTTP routes, web API routes, app/web UI, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, sample data, source-pack changes, public app code, MCP server code, Apps SDK code, OAuth, app submission, OpenAI API code, OpenAI vector/file-search code, OCR/vector/PageIndex code, provider code, certification code, delivery code, deployment code, external communications, source mutation, finance writes, generated product prose, runtime-Codex finance output, or autonomous action.

## Concrete Steps

Master-plan steps for this thread:

1. Keep current branch `codex/v2e-bounded-llm-orchestration-master-plan-local-v1`.
2. Do not switch worktrees and do not create FP-0086.
3. Create `plans/FP-0085-bounded-llm-orchestration-foundation.md`.
4. Update directly stale active docs only where needed:
   - `README.md`
   - `CODEX_README.md`
   - `START_HERE.md`
   - `docs/ACTIVE_DOCS.md`
   - `docs/PROJECT_STATE.md`
   - `docs/V2_BOUNDARY.md`
   - `plans/ROADMAP.md`
5. Do not edit source-pack fixtures, code, UI, routes, schema, migrations, package scripts, smoke aliases, evals, fixtures, sample data, or source truth.
6. Run the validation ladder.
7. Update this plan's Progress, Surprises & Discoveries, Decision Log, Validation and Acceptance, Artifacts and Notes, and Outcomes & Retrospective before closeout.

Future implementation steps, not performed in this thread:

1. Add pure domain contracts for `QueryPlanner`, `EvidenceToolPlan`, `EvidenceSelectionResult`, `BoundedEvidenceSummary`, refusal schemas, audit schema, prompt-injection boundary, tool allowlist, forbidden actions, output schema, and grade schemas.
2. Add a local/internal proof-only service that validates a query into a read-only V2C `EvidenceToolPlan` or refusal.
3. Add deterministic in-memory synthetic V2C responses inside specs/proof code only, not checked-in fixtures or sample packs.
4. Add schema validation that fails closed when evidence, freshness, limitations, citations, permitted next action, or refusal fields are missing.
5. Add a direct proof command if needed, without a package script or smoke alias.
6. Run focused specs plus the existing V2 proof and repo validation ladders.

## Validation and Acceptance

Master-plan acceptance:

- FP-0085 exists exactly at `plans/FP-0085-bounded-llm-orchestration-foundation.md`.
- FP-0086 does not exist.
- FP-0084 remains the shipped V2D read-only Evidence Atlas UI foundation record.
- FP-0083 remains shipped OSS demo/self-host/security baseline.
- FP-0082 remains shipped V2C local/internal read-only evidence-tool contract.
- FP-0081 remains shipped V2B TextPdfAdapter foundation.
- FP-0080 remains shipped V2A EvidenceIndex/document-map foundation.
- This thread adds docs/plan changes only.
- No code, UI, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, sample data, source-pack changes, OpenAI API/vector/file-search, OCR, PageIndex, public app/MCP, Apps SDK, OAuth, app submission, provider work, certification, delivery, deployment, external communications, generated product prose, runtime-Codex finance output, source mutation, finance write, or autonomous action is added.
- No external web/search research was used, unless this section is later updated with official source names and exact use.

Future implementation acceptance:

- `QueryPlanner` accepts only the fixed V2C read-only tool taxonomy.
- No write/action tools are registered or planned.
- Prompt-injection source text is treated as data.
- Unsupported, missing, stale, conflicted, or uncited evidence fails closed.
- Every positive claim requires SourceAnchor or accepted derived-ref citation posture.
- No finance advice, provider, certification, delivery, payment, legal/audit/tax, customer/vendor contact, source mutation, finance write, report release, or autonomous action can be planned or summarized.
- Output schema validation fails closed when evidence, freshness, limitations, permitted next action, citations, or refusal posture is missing.
- Evidence-faithfulness, missing-citation, and unsafe-action refusal grades are defined and exercised.
- Query/audit output is local/proof-only and does not create product finance behavior.

Validation commands for this docs-and-plan thread:

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

Validation result: passed on 2026-05-08T19:37:30Z. The full requested validation ladder completed successfully, including direct V2 proofs, DB-backed source-pack proofs, CFO Wiki/Finance Twin/monitoring/close-control/delivery/operator/discovery smokes, focused web/domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. Validation log root: `/tmp/pocket-cfo-fp0085-validation-20260508T193311Z`.

Final post-closeout sanity also passed on 2026-05-08T19:41:33Z: `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. Final sanity log root: `/tmp/pocket-cfo-fp0085-final-sanity-20260508T193803Z`.

## Idempotence and Recovery

This master-plan slice is idempotent:

- rerunning should find FP-0085 and update it instead of creating FP-0086
- rerunning direct V2 proofs should not mutate raw source fixtures
- rerunning DB-backed smokes should use existing local proof patterns and should not create new source-pack behavior
- raw source files must not be rewritten
- package scope remains `@pocket-cto/*` and root package name remains `pocket-cto`
- GitHub modules and engineering-twin modules remain in place

Recovery paths:

- If FP-0084 is missing or not shipped, stop V2E and recommend a narrow V2D correction.
- If V2D QA is not clean, stop V2E and recommend a narrow V2D QA correction.
- If V2C proof fails, stop V2E and recommend a narrow V2C evidence-tool correction.
- If V2B or V2A proof fails, stop V2E and recommend the narrowest EvidenceIndex/TextPdfAdapter correction.
- If implementation cannot remain local/internal proof-only without model calls, routes, persistence, fixtures, sample data, public app/MCP, provider/certification/delivery behavior, source mutation, finance writes, generated advice, or autonomous action, stop and plan V2F benchmark/community pack or a narrower corrective slice first.
- If validation fails in this docs-only thread, record the exact failing command and recommend the smallest corrective slice instead of widening scope.

## Artifacts and Notes

Artifacts created or refreshed by this master-plan thread:

- `plans/FP-0085-bounded-llm-orchestration-foundation.md`
- directly stale active-doc/roadmap refreshes that point to FP-0085 as the active implementation-ready V2E plan

Artifacts intentionally not created:

- FP-0086
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
- provider, certification, delivery, deployment, or external communication artifacts
- LLM orchestration implementation
- runtime-Codex finance output
- generated product prose
- source mutation
- finance writes
- autonomous action

Search-hit classification:

- shipped V2A/V2B/V2C/V2D foundation language: EvidenceIndex, DocumentMap, SourceAnchor, EvidenceCard, SourceCoverageMatrix, TextPdfAdapter, V2C tool names, V2D atlas components, and direct proof outputs.
- active public-facing stale wording requiring FP-0085 planning correction: active docs and roadmap lines that said FP-0085 did not exist or V2E was only future-plan text before this plan was created.
- valid internal scaffolding that must not be renamed: `pocket-cto`, `@pocket-cto/*`, GitHub modules, engineering-twin/twin modules, runtime-codex modules, eval modules, existing route/schema/migration/test fixture vocabulary, and source-pack proof fixtures.
- archived history that must stay reference-only: Pocket CTO-era docs, engineering-first milestones, GitHub-first historical wording, and older EP material.
- future-only planning language: V2F, V2G, public ChatGPT App, remote MCP, Apps SDK UI, OAuth, app submission, F6V, F6X, OCR/vector/PageIndex/OpenAI file-search adapters, iOS, OpenClaw, deployment, external communications, package rename, GitHub deletion, and engineering-twin deletion.
- behavior leak requiring a smaller corrective slice instead of FP-0085: none found.

Replay and evidence implications:

- This master-plan slice is docs-only and creates no mission state changes, ingest actions, report actions, approvals, replay events, evidence bundles, source mutations, finance writes, or product runtime behavior.
- Future V2E implementation must keep first audit/query output local and proof-only. Any durable event, replay integration, persistence, mission output, report output, approval, or Finance Twin/CFO Wiki/source mutation requires a later plan or explicit plan amendment.

External web/browser research:

- No external web or browser research was used.
- No web/search result was used to override repo source truth.
- Official OpenAI docs used: none in this FP-0085 thread.

## Interfaces and Dependencies

FP-0085 depends on:

- shipped FP-0084 read-only Evidence Atlas UI foundation
- shipped FP-0083 OSS demo/self-host/security baseline
- shipped FP-0082 local/internal read-only evidence-tool contract and direct proof
- shipped FP-0081 TextPdfAdapter foundation and direct proof
- shipped FP-0080 EvidenceIndex/document-map foundation and direct proof
- existing domain EvidenceIndex and EvidenceTool schemas
- existing control-plane EvidenceIndex, TextPdfAdapter, and read-only evidence-tool services
- existing package scripts and proof commands only
- local Docker Postgres and S3-compatible object storage for validation

FP-0085 does not depend on:

- OpenAI API calls
- model selection
- model pricing assumptions
- OpenAI vector/file-search integration
- OCR/vector/PageIndex implementation
- public ChatGPT App
- remote MCP deployment
- Apps SDK UI
- OAuth
- app submission
- provider integrations
- certification
- delivery
- deployment
- external communications
- package-scope rename
- GitHub module deletion
- engineering-twin deletion
- runtime-Codex finance output
- generated product prose
- source mutation
- finance writes
- autonomous action

No new environment variables are planned for first V2E. If a later implementation introduces model-provider configuration, that is outside this first local proof-only contract and requires a future named plan or explicit amendment.

## Outcomes & Retrospective

Master-plan outcome:

- FP-0085 is the active implementation-ready V2E bounded LLM orchestration foundation plan.
- V2E implementation has not started.
- FP-0084 remains shipped V2D.
- FP-0083 remains shipped OSS baseline, FP-0082 remains shipped V2C, FP-0081 remains shipped V2B, FP-0080 remains shipped V2A, FP-0079 remains shipped F12, FP-0078 remains shipped F11, FP-0077 remains shipped F10, FP-0076 remains shipped F9, FP-0075 remains shipped F8, FP-0074 remains shipped F7, and FP-0050 through FP-0073 remain shipped F6 records.
- No FP-0086 is created.
- No code, UI, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, sample data, source-pack changes, public app/MCP, Apps SDK, OAuth, app submission, OpenAI API/vector/file-search, OCR, PageIndex, provider work, certification, delivery, deployment, external communications, runtime-Codex finance output, generated prose, source mutation, finance write, or autonomous action is added.
- Validation passed, including `pnpm ci:repro:current`.
- Exact next recommendation: after this docs-only plan ships, start V2E implementation next as a local/internal proof-only QueryPlanner and schema/refusal contract over synthetic in-memory V2C tool responses, without OpenAI API calls. V2F benchmark/community pack should wait unless V2E implementation pressure shifts toward public examples, real model calls, community distribution, or public claims.
