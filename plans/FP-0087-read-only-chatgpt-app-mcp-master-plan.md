# FP-0087 - Read-only ChatGPT App MCP Master Plan

## Purpose / Big Picture

Target phase: V2G.

Exact slice: `V2G-read-only-chatgpt-app-mcp-master-plan`.

This Finance Plan opens exactly one docs-and-plan-only V2G planning slice for a future read-only ChatGPT App/MCP path. It does not implement the app, an MCP server, an Apps SDK iframe, OAuth, app submission, deployment, provider integration, certification, OpenAI API/model calls, vector/file-search, OCR, PageIndex, source-pack behavior, source mutation, finance writes, generated product prose, runtime-Codex finance output, or autonomous action.

The user-visible purpose is to decide whether public ChatGPT App/MCP planning is safe after the shipped V2F benchmark/community foundation, then define the first read-only app/MCP concepts, authority boundaries, forbidden actions, proof posture, and wait conditions without adding product behavior.

The north star remains unchanged: raw finance evidence becomes a persisted, freshness-aware decision system that can answer a question, explain limitations, and produce a durable artifact another human can review outside chat. ChatGPT App/MCP artifacts are never source truth.

## Progress

- [x] 2026-05-09T12:30:23Z - Loaded the required `pocket-cfo-codex-operator` skills before planning: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor.
- [x] 2026-05-09T12:30:23Z - Confirmed GitHub Connector Guard is out of scope because GitHub connector product behavior is not part of this slice.
- [x] 2026-05-09T12:30:23Z - Completed preflight against fetched `origin/main`: clean repo, branch `codex/v2g-read-only-chatgpt-app-mcp-master-plan-local-v1`, PR #241 merged, Docker services available, FP-0086 present, FP-0087/FP-0088 absent, and required V2 proof tools present.
- [x] 2026-05-09T12:30:23Z - Read the active docs, shipped V2A/V2B/V2C/V2D/V2E/V2F Finance Plans, package contracts, control-plane evidence modules, web Evidence Atlas modules, and direct proof tools named by the task.
- [x] 2026-05-09T12:30:23Z - Ran required direct V2/V2F proof commands before creating FP-0087; they passed while FP-0087 was absent, including `tools/benchmark-community-pack-proof.mjs`, which intentionally checks that FP-0087 does not already exist before this planning handoff.
- [x] 2026-05-09T12:30:23Z - Used official OpenAI docs only as current platform, security, schema, and benchmark context; no external web research was used to override repo truth.
- [x] 2026-05-09T12:30:23Z - Searched required repo terms and classified hits as shipped V2A/V2B/V2C/V2D/V2E/V2F/FP-0083 foundation language, active stale V2G planning wording, valid internal scaffolding, archived reference-only history, future-only planning language, or safety-boundary terms; no behavior leak was found that requires a smaller corrective slice instead of FP-0087.
- [x] 2026-05-09T12:30:23Z - Created this active FP-0087 plan as docs-and-plan only.
- [x] 2026-05-09T12:30:23Z - Refreshed directly stale active docs so they point to FP-0087 as an active master-plan-only record while keeping implementation blocked.
- [x] 2026-05-09T13:34:28Z - Ran the narrow post-edit V2F proof/spec blocker check. `pnpm exec tsx tools/benchmark-community-pack-proof.mjs` and `pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts` fail only because the shipped FP-0086 `fp0087Absent` literal is now false after creating this plan.
- [x] 2026-05-09T13:02:30Z - QA correction applied after explicit dirty-tree authorization: replaced the V2F `fp0087Absent` gate with a proof that FP-0087 is either absent or exactly this docs-and-plan-only master plan, and that FP-0088 remains absent.
- [x] 2026-05-09T13:02:59Z - Ran the full 42-command post-edit validation ladder after the QA correction; all requested direct proofs, DB-backed source-pack proofs, CFO Wiki/Finance Twin/monitor/readiness smokes, web/domain/control-plane/twin specs, `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed. Log root: `/tmp/pocket-cfo-v2g-qa-full-20260509T130259Z-13834`.
- [x] 2026-05-09T13:09:48Z - Reran final root tail after plan closeout edits; `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed. Log root: `/tmp/pocket-cfo-v2g-qa-final-tail-20260509T130948Z-30172`.
- [x] 2026-05-09T13:09:48Z - Validation is green; prepare the branch for commit, push, and a ready PR.

## Surprises & Discoveries

The V2F benchmark/community proof intentionally checks that FP-0087 is absent before the next planning handoff. That makes it a pre-creation readiness gate for this slice, not a post-creation invariant. After this file exists, rerunning that exact proof without changing code would fail the old absence assertion even though the V2G planning action succeeded. This plan records the proof as passed before FP-0087 creation.

Post-edit validation confirmed this is not theoretical: `tools/benchmark-community-pack-proof.mjs` and `packages/domain/src/benchmark-community.spec.ts` both rejected the final docs-only tree because `fp0087Absent` was false. The QA correction replaced that stale absence invariant with an FP-0087 docs-only boundary assertion plus an FP-0088 absence assertion, without adding product runtime behavior.

Official OpenAI Developer Mode documentation reinforces the need for a stricter local/read-only posture: Developer Mode is powerful because it can expose read and write MCP tools, so FP-0087 must not rely on host settings alone for safety. The future design must define an explicit allowlist and forbidden-tool taxonomy in Pocket CFO itself.

Official OpenAI Apps SDK documentation treats the MCP server as required for an app and the web component as optional. That supports keeping a future first V2G implementation local and contract/proof-only, with no Apps SDK iframe or public UI until a later plan names that scope.

The repo already contains strong V2C and V2E read-only/refusal contracts. V2G does not need new finance authority. Its gap is distribution planning: mapping the existing evidence spine to future app/MCP concepts without letting platform wrappers become product truth.

No repo search hit showed public app, remote MCP, OAuth, provider, certification, deployment, source-pack, package-scope, GitHub-first, engineering-first, source mutation, finance write, or autonomous-action behavior leaking into active product implementation.

## Decision Log

- Proceed with FP-0087 because FP-0086 is merged and shipped, the repo is clean, direct V2/V2F proofs passed before plan creation, active docs support FP-0086 as shipped, and the work can stay docs-and-plan only.
- V2G is not implementation. This thread may create this Finance Plan and directly stale doc refreshes only.
- V2G is not public app submission. No app registration, app submission, Apps SDK UI, OAuth, endpoint, remote MCP server, deployment, external communications, or launch artifact is allowed in this slice.
- V2G must be read-only first. Future implementation may only plan read/search/fetch behavior over existing read-only evidence surfaces: EvidenceIndex, V2C read-only evidence tools, V2D Evidence Atlas links, V2E bounded planning/refusal/validation posture, and V2F benchmark/no-real-finance-data boundaries.
- The first future implementation should be a local proof-only MCP/app contract planning artifact, not a remote endpoint, OAuth flow, Apps SDK iframe, app submission, OpenAI API integration, model call, vector/file-search integration, or public deployment. The app threat model questions in this plan must be answered before any public or remote surface opens.
- ChatGPT App/MCP artifacts must not become raw source truth, Finance Twin truth, CFO Wiki truth, EvidenceIndex truth, V2C tool truth, V2E truth, V2F truth, product runtime truth, public finance advice, source-pack behavior, sample/demo data, generated advice, or autonomous finance behavior.
- The V2G tool taxonomy must start from the fixed V2C read-only tool posture and narrow it further for app/MCP planning. Allowed concepts are evidence query/fetch, evidence-card fetch, source-anchor/document-map fetch, source-coverage fetch, and capability-boundary fetch. Write/action tools are forbidden.
- GitHub Connector Guard remains out of scope. GitHub modules remain internal scaffolding only, and the product path must not become GitHub-first.
- Internal packages remain `@pocket-cto/*`, and root `package.json` remains `pocket-cto`. No package-scope rename is authorized.
- No replay event is produced by this docs-only planning slice. Future implementation must explicitly decide whether local proof audit events are sufficient, following V2E, or whether a later replay record is needed.

## Context and Orientation

Shipped V2 truth now provides the evidence spine needed to plan a read-only app/MCP distribution path without building it:

- FP-0080 shipped V2A EvidenceIndex/document-map contracts and a native read-only evidence anchor/trace/card/coverage layer.
- FP-0081 shipped V2B TextPdfAdapter precision proof for one deterministic policy/covenant PDF path over EvidenceIndex.
- FP-0082 shipped V2C local/internal read-only evidence-tool contracts and direct proof over EvidenceIndex/TextPdfAdapter outputs.
- FP-0083 shipped OSS demo, self-host, security, privacy, finance-data threat model, read-only-agent threat model, and demo-data policy docs before public app or deployment work.
- FP-0084 shipped V2D Evidence Atlas UI as a local read-only visualization surface over existing evidence contracts.
- FP-0085 shipped V2E local/internal proof-only bounded orchestration: a fixed read-only V2C tool plan, deterministic evidence selection handoff, bounded summary/refusal contracts, local proof audit posture, and deterministic grades.
- FP-0086 shipped V2F benchmark/community manifest contracts and SafeDemoDataPolicy-first proof posture without datasets, fixtures, sample data, source packs, OpenAI API/model calls, public app/MCP work, or runtime behavior.

The gap that justifies V2G planning now is not missing evidence infrastructure. The gap is that future public ChatGPT App/MCP work needs a master plan that translates the shipped evidence spine into app/MCP concepts while preserving authority, privacy, prompt-injection, no-real-finance-data, and no-write boundaries.

Public ChatGPT App/MCP planning is safe before public implementation only because this slice stays documentation-only, names no runtime endpoint, avoids OAuth and submission, uses official OpenAI docs only as current platform context, and refuses to treat app/MCP wrappers as finance truth.

## Plan of Work

Create exactly one active Finance Plan:

- `plans/FP-0087-read-only-chatgpt-app-mcp-master-plan.md`

Refresh only directly stale docs that would otherwise mislead future operators after FP-0087 exists:

- `README.md`
- `CODEX_README.md`
- `START_HERE.md`
- `docs/ACTIVE_DOCS.md`
- `docs/PROJECT_STATE.md`
- `docs/V2_BOUNDARY.md`
- `plans/ROADMAP.md`

Do not edit product code, UI, routes, backend/control-plane HTTP routes, web API routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, sample data, public demo data, source-pack fixtures, public demo source packs, source-pack behavior, runtime-Codex finance behavior, LLM classification/summarization implementation, generated product prose, source truth, finance writes, autonomous-action behavior, or FP-0088. The later QA correction may touch only the V2F proof/spec gate that made this docs-only FP-0087 handoff impossible to validate.

Do not update `SECURITY.md`, `PRIVACY.md`, `CONTRIBUTING.md`, threat-model docs, demo-data policy, self-host baseline, or FP-0086 unless a direct stale statement requires it. Their current no-public-app/no-real-data/no-deployment boundaries remain true.

## Concrete Steps

1. Confirm preflight and readiness from repo truth.
   - Fetch `origin/main`.
   - Verify branch, clean status, GitHub auth, PR #241 merged, Docker services, FP-0086 on `origin/main`, FP-0087 absent, FP-0088 absent, and required proof tools present.
   - Run direct V2/V2F proof commands before creating FP-0087.

2. Read the active docs, shipped V2 plans, source contracts, control-plane evidence modules, web Evidence Atlas modules, and direct proof tools.
   - Treat current code and shipped plans as source truth.
   - Treat historical Pocket CTO/engineering material as reference-only.

3. Use official OpenAI docs only for current platform/security/schema/benchmark context.
   - Record each official source and how it informed this plan.
   - Do not use external docs to override repo source truth.

4. Search required terms and classify results.
   - Shipped V2A/V2B/V2C/V2D/V2E/V2F/FP-0083 foundation language is valid.
   - Active stale wording requiring V2G planning correction may be updated in allowed docs.
   - Valid internal scaffolding, including `@pocket-cto/*`, `pocket-cto`, GitHub modules, and engineering-twin modules, must stay.
   - Archived history remains reference-only.
   - Future-only planning language remains future-only unless this plan narrows it.
   - A behavior leak would stop this plan and recommend a smaller correction, but none was found.

5. Define V2G concepts without implementing them.
   - `ReadOnlyChatGptAppPlan`: a future data-only plan for how a ChatGPT App would present read-only evidence behavior, with no UI, endpoint, OAuth, submission, or model calls in this slice.
   - `ReadOnlyMcpServerPlan`: a future local proof-only contract for MCP-style tool descriptors and response envelopes, with no remote server in this slice.
   - `McpToolAllowlist`: the fixed read-only tool taxonomy permitted for future app/MCP planning.
   - `McpForbiddenTool`: every write/action/tool behavior that must be refused and proven absent.
   - `AppEvidenceQuery`: a planned read-only search/query concept over evidence metadata and bounded excerpts.
   - `AppEvidenceFetch`: a planned read-only evidence-card/source-anchor/document-map fetch concept.
   - `AppSourceCoverageFetch`: a planned read-only source coverage and freshness posture fetch concept.
   - `AppCapabilityBoundaryFetch`: a planned read-only capability, limitation, and permitted-next-action boundary fetch concept.
   - `AppRefusalPosture`: planned response semantics for missing citations, unsupported evidence, stale evidence, unsafe action requests, data exfiltration, raw full-file dump requests, and prompt injection.
   - `AppPromptInjectionBoundary`: source/user/model text must be treated as data, not instructions that can authorize new tools or weaken boundaries.
   - `AppPrivacyBoundary`: no raw full-file dumps, no real finance data in public demo posture, redaction-aware excerpts only, and no public sample packs without a later plan.
   - `AppNoRuntimeBoundary`: this slice starts no runtime app, endpoint, MCP server, model call, or persistent app state.
   - `AppOAuthDeferredBoundary`: OAuth waits for a threat model, approval path, and explicit plan.
   - `AppSubmissionDeferredBoundary`: app submission waits for local proof, security docs, V2F benchmark posture, and a later app-submission plan.
   - `AppProviderCertificationDeferredBoundary`: provider integration, certification, delivery, legal/audit opinion, payment, customer contact, and external communications remain out of scope.
   - `AppProofPlan`: future proof/spec ladder for fixed taxonomy, forbidden tools, refusal behavior, evidence/freshness/limitations/citations, and no real finance/public demo data.
   - `AppThreatModelQuestions`: questions that must be answered before any remote endpoint, OAuth, Apps SDK UI, Developer Mode connector, app submission, or public launch.

6. Narrow the first allowed app/MCP taxonomy.
   - `search_evidence` maps to `AppEvidenceQuery`.
   - `fetch_evidence_card` maps to `AppEvidenceFetch`.
   - `fetch_source_anchor` maps to `AppEvidenceFetch`.
   - `fetch_document_map` maps to `AppEvidenceFetch`.
   - `fetch_source_coverage` maps to `AppSourceCoverageFetch`.
   - `fetch_company_posture` maps to `AppSourceCoverageFetch` or posture fetch only when it remains read-only and evidence-linked.
   - `fetch_capability_boundaries` maps to `AppCapabilityBoundaryFetch`.

7. Define forbidden tools and actions.
   - No `upload_source`.
   - No `create_mission`.
   - No monitor rerun.
   - No report release.
   - No report circulation.
   - No approval.
   - No `send_report`.
   - No provider call.
   - No provider credential or `provider_connect`.
   - No certification, `certify_close`, close-complete status, sign-off, attestation, legal opinion, audit opinion, assurance, or tax filing.
   - No source mutation.
   - No finance write, `update_ledger`, accounting write, bank write, payment instruction, or autonomous remediation.
   - No customer contact or `contact_customer`.
   - No generated finance advice as product output.
   - No LLM summarization/classification implementation in this slice.

8. Define response posture for any future implementation.
   - Every app/MCP response plan must include evidence references, freshness posture, limitations, permitted next actions, citation posture, and refusal reason when unsupported.
   - Missing citations must refuse or return unsupported posture.
   - Unsupported evidence must refuse or return unsupported posture.
   - Stale evidence must be plainly represented and must not be masked by summary language.
   - Prompt injection must be treated as data and cannot add tools, widen scope, reveal secrets, or bypass refusal posture.
   - Data-exfiltration requests and raw full-file dump requests must refuse.
   - Unsafe-action requests must refuse in read-only/proof-only terms and may only suggest a safe human review next step when repo contracts permit it.

9. Define proof and QA posture for future implementation.
   - Prove a fixed read-only tool taxonomy.
   - Prove no write tools.
   - Prove no remote endpoint in the first implementation unless a later Finance Plan explicitly opens it.
   - Prove no OAuth until the app threat model and app plan are approved.
   - Prove no app submission until local proof, V2F benchmarks, and security docs are green.
   - Prove no OpenAI API/model calls.
   - Prove no vector/file-search/OCR/PageIndex integration.
   - Prove prompt injection is treated as data.
   - Prove no raw full-file dumps.
   - Prove no real finance data, public demo data, source-pack mutation, or public demo source packs.
   - Prove no provider/certification/delivery/payment/customer-contact/legal/audit behavior.
   - Prove evidence/freshness/limitations/permitted-next-action/citation posture in every response plan.
   - Prove unsafe-action refusals remain read-only and proof-only.

10. Run validation and, if green, commit and open the PR.

## Validation and Acceptance

Pre-creation readiness proofs already passed before this file existed:

```bash
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
```

Post-edit validation ladder:

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
pnpm --filter @pocket-cto/domain exec vitest run src/cfo-wiki.spec.ts src/source-registry.spec.ts src/finance-twin.spec.ts src/monitoring.spec.ts src/close-control.spec.ts src/close-control-certification-safety.spec.ts src/external-delivery-human-confirmation-boundary.spec.ts src/close-control-certification-boundary.spec.ts src/external-provider-boundary.spec.ts src/close-control-review-summary.spec.ts src/delivery-readiness.spec.ts src/proof-bundle.spec.ts src/evidence-index.spec.ts src/evidence-tool.spec.ts src/bounded-llm.spec.ts src/benchmark-community.spec.ts
zsh -lc "cd apps/control-plane && setopt NULL_GLOB && pnpm exec vitest run src/modules/evidence-index/**/*.spec.ts src/modules/wiki/**/*.spec.ts src/modules/sources/**/*.spec.ts src/modules/finance-twin/**/*.spec.ts src/modules/finance-discovery/**/*.spec.ts src/modules/monitoring/**/*.spec.ts src/modules/close-control/**/*.spec.ts src/modules/close-control-certification-safety/**/*.spec.ts src/modules/external-delivery-human-confirmation-boundary/**/*.spec.ts src/modules/close-control-certification-boundary/**/*.spec.ts src/modules/external-provider-boundary/**/*.spec.ts src/modules/close-control-review-summary/**/*.spec.ts src/modules/delivery-readiness/**/*.spec.ts src/modules/missions/**/*.spec.ts src/modules/approvals/**/*.spec.ts src/modules/evidence/**/*.spec.ts src/modules/reporting/**/*.spec.ts src/modules/bounded-llm-orchestration/**/*.spec.ts src/app.spec.ts"
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/twin/workflow-sync.spec.ts src/modules/twin/test-suite-sync.spec.ts src/modules/twin/codeowners-discovery.spec.ts
git diff --check
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Post-edit blocker observed in this thread:

```bash
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
```

Result: failed because `fp0087Absent` was false after `plans/FP-0087-read-only-chatgpt-app-mcp-master-plan.md` was created.

```bash
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts
```

Result: failed one test, `benchmark community pack foundation contracts > proves no-runtime, contributor, architecture, and final proof posture`, because `BenchmarkProofSchema` expected the literal `fp0087Absent: true`.

The QA correction updates the stale V2F code/test gate so the full post-edit ladder can run on a final tree where FP-0087 exists only as docs-and-plan.

Post-QA correction full validation:

Result: all 42 requested commands passed.

Log root: `/tmp/pocket-cfo-v2g-qa-full-20260509T130259Z-13834`.

Acceptance evidence:

- Exactly one new active plan exists: `plans/FP-0087-read-only-chatgpt-app-mcp-master-plan.md`.
- No FP-0088 exists.
- Allowed docs mention FP-0087 only as docs-and-plan-only V2G master planning.
- Public implementation, app submission, Apps SDK UI, OAuth, remote MCP, endpoint, OpenAI API/model calls, vector/file-search, OCR, PageIndex, provider integration, certification, delivery, deployment, external communications, source mutation, finance writes, generated product prose, runtime-Codex finance output, and autonomous action remain blocked.
- The active docs preserve FP-0086 as shipped V2F.
- Validation results are recorded in this plan before commit.

## Idempotence and Recovery

This is a docs-only slice. Reapplying it should be safe if FP-0087 remains the only new plan and active docs still point to it as docs-and-plan only.

If validation fails because of a docs typo or stale reference, fix the doc and rerun the failed command.

If validation fails because repo truth contradicts V2G readiness, stop, do not open the PR, and recommend the smallest safer correction slice: narrow V2F hardening correction, narrow V2E bounded-orchestration correction, narrow V2C evidence-tool correction, narrow V2D Atlas correction, or hold current V2F posture with no new implementation.

If a future operator sees `tools/benchmark-community-pack-proof.mjs` or `packages/domain/src/benchmark-community.spec.ts` fail after FP-0087 exists, check whether FP-0087 is still exactly `plans/FP-0087-read-only-chatgpt-app-mcp-master-plan.md`, still docs-and-plan only, and FP-0088 remains absent.

Rollback is a normal revert of docs-only changes. No migrations, source mutations, external calls, finance writes, object storage writes, replay mutations, or runtime side effects are created by this plan.

## Artifacts and Notes

Official OpenAI docs used, and what they were used for:

- OpenAI Apps SDK Quickstart: used to confirm that current ChatGPT apps are planned around an MCP server plus an optional iframe web component, supporting a no-UI/no-iframe boundary in this slice.
- OpenAI Apps SDK MCP Server concepts: used to confirm that MCP tools advertise schemas/annotations and return structured content, supporting future descriptor and response-contract planning only.
- OpenAI ChatGPT Developer Mode docs: used to confirm Developer Mode can expose read and write MCP tools and carries prompt-injection/data-loss risk, supporting explicit no-write and no-remote boundaries.
- OpenAI MCP and Connectors docs: used to confirm allowed-tool filtering and approval posture exist, supporting an explicit allowlist but not relying on host filtering as the sole control.
- OpenAI Structured Outputs docs: used only as schema/refusal context for future response and refusal planning; this slice adds no OpenAI API/model integration.
- OpenAI Evals and Graders docs: used only as benchmark/proof context for future app proof posture; this slice adds no eval datasets, graders, model calls, or benchmark runtime.

No other web research was used. Repo truth came from current code, current active docs, shipped Finance Plans, and this active Finance Plan.

Repo search classification before writing:

- FP-0087 hits before creation were only absence/future checks in FP-0086, V2F proof/spec, and active docs; no FP-0087 file existed.
- FP-0088 was absent.
- V2G hits were future-only roadmap/docs language requiring this planning correction.
- ChatGPT App/MCP/Apps SDK/Developer Mode/OAuth/app submission/remote MCP/public app hits were shipped safety boundaries, absence assertions, or future-only language.
- Provider/certification/delivery/deployment/external communications/legal/audit/tax/payment/customer-contact hits were existing shipped boundary modules, specs, docs, or forbidden-action/refusal language.
- OpenAI API/model/vector/file-search/OCR/PageIndex hits were future-only adapter/runtime boundaries, shipped absence assertions, or existing documentation.
- Route/schema/migration/package script/smoke alias/eval dataset/fixture/sample data/source pack hits were existing shipped code, proof commands, or absence/future-only language, not new V2G work.
- `@pocket-cto` and `pocket-cto` hits were valid internal scaffolding that must not be renamed.
- GitHub-first and engineering-first hits were active demotion warnings or archived reference-only history.

Replay and evidence-bundle implications:

- No replay event is created in this docs-only slice.
- No evidence bundle is created or mutated.
- No raw source, source snapshot, checksum, Finance Twin state, CFO Wiki page, EvidenceIndex record, V2C evidence-tool output, V2D Atlas UI behavior, V2E orchestration contract, or V2F benchmark/community contract is changed.
- Future app/MCP implementation must decide whether local proof audit events, V2E-style proof traces, or a named replay/event posture is required before any runtime surface opens.

Impact on `WORKFLOW.md`, stack packs, skills, and environment:

- No `WORKFLOW.md` change.
- No stack-pack change.
- No repo-local skill or plugin change.
- No environment variable added.
- No package script added.

## Interfaces and Dependencies

Authority model:

- Raw sources remain authoritative for document claims.
- Finance Twin remains authoritative for structured facts.
- CFO Wiki remains compiled/derived.
- EvidenceIndex remains the read-only anchor/trace/card/coverage/limitation layer.
- V2C tools remain the local/internal read-only evidence-tool contract.
- V2D Evidence Atlas remains visualization only.
- V2E remains local/internal proof-only bounded orchestration.
- V2F remains benchmark/community contract/proof posture.
- ChatGPT App/MCP artifacts are future distribution planning wrappers only.

Future read-only app/MCP responses must represent:

- `evidence`
- `freshness`
- `limitations`
- `permittedNextActions`
- `citations`
- `refusalReason` or unsupported posture when applicable
- capability boundaries and forbidden actions
- bounded excerpts only, never raw full-file dumps

Questions a future app/MCP threat model must answer before implementation:

- Which exact local read-only tools are exposed, and how is the allowlist enforced outside model prompts?
- How are prompt injections in source text, user text, tool output, and model-visible context treated as data?
- How are citations, bounded excerpts, freshness, limitations, and permitted-next-action fields guaranteed in every response?
- How are missing citations, unsupported evidence, stale evidence, data exfiltration, raw full-file dump requests, and unsafe actions refused?
- How is no-real-finance-data posture preserved for any public demo or community-facing proof?
- What redaction posture applies before any app/MCP output leaves local proof context?
- What logs or local audit events are safe without storing sensitive source text?
- What must happen before remote endpoints, OAuth, Apps SDK UI, Developer Mode connectors, or app submission are allowed?
- How does the future implementation prove no upload, source mutation, finance write, provider call, certification, delivery, payment, customer contact, legal/audit/tax behavior, or autonomous remediation exists?

Implementation should wait for:

- this FP-0087 plan to merge;
- active docs to clearly mark V2G planning as docs-and-plan only;
- a new later Finance Plan that names a local proof-only read-only MCP/app contract slice;
- a threat-model review that approves no-write/no-remote/no-OAuth/no-public-data boundaries;
- proof expectations that do not depend on real finance data, eval datasets, fixtures, sample data, source-pack mutations, or OpenAI API/model calls.

App submission should wait for:

- local read-only app/MCP proof green;
- V2F benchmark/community posture green without real finance data;
- security, privacy, and read-only-agent threat-model docs updated for the exact submission surface;
- OAuth and remote endpoint boundaries approved by a later Finance Plan;
- human review of app metadata, privacy posture, allowed tools, refusals, and app-submission checklist;
- no unresolved prompt-injection, data-exfiltration, raw-file-dump, unsafe-action, or public-demo-data risks.

## Outcomes & Retrospective

FP-0087 planning proved conceptually safe from repo truth. QA found and corrected one narrow V2F proof/spec gate that still encoded `fp0087Absent: true`.

No product runtime behavior was added. The only non-doc correction is a proof/spec hardening update so V2F can prove FP-0087 is docs-and-plan only instead of requiring it to be absent forever.

The final validation ladder passed on the corrected tree, including `pnpm ci:repro:current`.

Final root-tail validation after plan closeout edits also passed, including `pnpm ci:repro:current`.

Recommended next step after this PR merges: do not start public app implementation or submission. The next safe V2G slice, if desired, is a narrow local proof-only read-only MCP/app contract plan. Public app implementation, remote MCP deployment, OAuth, Apps SDK UI, app submission, provider integration, certification, deployment, and external communications should continue to wait.
