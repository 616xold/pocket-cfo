# FP-0083 - OSS Demo Self-Host Security Baseline

## Purpose / Big Picture

Status: active implementation-ready Finance Plan, created 2026-05-08T14:17:53Z.

Target phase: `V2-OSS-baseline`.

Exact slice: `FP-0083-oss-demo-self-host-security-baseline`.

This Finance Plan defines the next safe slice after shipped FP-0082/V2C. It is not product runtime. It is not deployment. It is not public ChatGPT App, remote MCP, Apps SDK UI, OAuth, or app submission work. It plans the OSS demo, self-host, security, privacy, contribution, and threat-model baseline needed before Pocket CFO is exposed as a public demo, community pack, public app alpha, remote MCP endpoint, or deployment track.

The user-visible purpose is to make the repository safer and clearer for an OSS reviewer or self-hosting operator. A reviewer should be able to understand what data is forbidden, how to run a safe local demo from existing proof commands, how local Postgres/object storage/secrets are handled, how security issues should be reported without leaking private finance data, and why public app/deployment work remains blocked.

This master-plan thread remains docs-and-plan only. The later implementation slice may create OSS baseline documentation, but this thread creates no code, UI, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, sample data, source-pack data, source mutation, finance writes, generated product prose, LLM orchestration, runtime-Codex finance output, or autonomous action.

Authority model remains unchanged:

- raw sources remain authoritative for document claims
- Finance Twin remains authoritative for structured finance facts
- CFO Wiki remains compiled and derived
- EvidenceIndex remains the read-only anchor, trace, card, coverage, and limitation layer
- V2C evidence tools remain a local/internal read-only contract only
- model output, ChatGPT App output, MCP output, runtime-Codex output, and documentation prose must not become source truth

GitHub connector product behavior is explicitly out of scope. Routine `git`, `gh`, push, and PR operations for this repository do not invoke GitHub Connector Guard.

No external web research was used for this FP-0083 planning slice. Repo source truth came from current code, current active docs, shipped Finance Plans, shipped FP-0082, and this plan.

## Progress

- [x] 2026-05-08T14:17:53Z - Invoked the requested Pocket CFO operator skills before work: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor.
- [x] 2026-05-08T14:17:53Z - Confirmed GitHub Connector Guard is not in scope because this slice does not touch GitHub connector product behavior.
- [x] 2026-05-08T14:17:53Z - Ran preflight against fetched `origin/main`; current branch was `codex/fp-0083-oss-demo-self-host-security-baseline-master-plan-local-v1`, the worktree started clean, GitHub auth/repo access worked, PR #229 was merged, Docker Postgres/MinIO were available, FP-0082 existed on `origin/main`, no FP-0083 or FP-0084 existed, and the required V2 proof commands existed.
- [x] 2026-05-08T14:17:53Z - Read the active documentation spine, shipped FP-0082/FP-0081/FP-0080/FP-0079 records, package metadata, ops/eval/benchmark docs, EvidenceIndex/evidence-tool sources, and source-pack proof tooling required for FP-0083 planning.
- [x] 2026-05-08T14:17:53Z - Completed the required repository search pass for FP-0083, FP-0084, OSS docs, threat-model/self-host/demo/data/security/privacy terms, V2/public app/deployment/provider/certification/action boundaries, internal scaffolding names, GitHub-first wording, and engineering-first wording.
- [x] 2026-05-08T14:17:53Z - Ran the three V2 proof gates before writing this plan: `pnpm exec tsx tools/read-only-evidence-app-proof.mjs`, `pnpm exec tsx tools/document-precision-foundation-proof.mjs`, and `pnpm exec tsx tools/evidence-index-foundation-proof.mjs`; all passed.
- [x] 2026-05-08T14:17:53Z - Decided FP-0083 is safe to create as one docs-only OSS demo/self-host/security baseline plan because the shipped V2C contract is local/internal, active docs identify OSS baseline gaps, and no public app, remote MCP, OAuth, deployment, provider, certification, package rename, fixture, source mutation, finance write, or autonomous action is required.
- [x] 2026-05-08T14:17:53Z - Created this FP-0083 active implementation-ready plan and refreshed only directly stale active docs/roadmap text.
- [x] 2026-05-08T14:29:24Z - Completed the required validation ladder for this docs-and-plan-only master-plan slice, including direct V2 proofs, source-pack proofs, CFO Wiki/Finance Twin/monitoring/delivery/operator smokes, focused web/domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`; all passed.

## Surprises & Discoveries

- FP-0082 is present locally and on fetched `origin/main` as the shipped V2C local/internal read-only evidence-tool contract record.
- FP-0083 and FP-0084 did not exist before this slice.
- `SECURITY.md`, `PRIVACY.md`, and `CONTRIBUTING.md` did not exist. README and the F12 demo-readiness audit explicitly identify contribution/security/privacy OSS baseline docs and demo/self-host packaging as future gaps.
- The V2C proof already covers the required proof-integrity follow-up posture: empty or whitespace-only `search_evidence` queries fail closed, document-map excerpts are bounded/redacted, unknown requested actions fail closed, redaction includes obvious token and account-like key/value strings, and direct absence booleans are marked as repo-scope audit notes.
- The existing source-pack proofs use checked-in synthetic fixture families for shipped F6 slices. That does not automatically authorize new sample source packs in FP-0083 implementation.
- `pocket-cto` and `@pocket-cto/*` remain valid internal scaffolding and must not be renamed in this slice.
- GitHub modules and engineering-twin modules remain valid internal/historical scaffolding and must not be deleted in this slice.
- Public ChatGPT App, remote MCP, Apps SDK UI, OAuth, app submission, V2D UI, V2E LLM orchestration, V2F community pack, F6V provider integration, F6X certification, OCR, vector search, PageIndex, OpenAI file-search/vector adapters, iOS, OpenClaw, deployment, and external communications remain future-only.
- Search hits for provider, certification, delivery, report release, payment, legal advice, audit opinion, source mutation, finance writes, generated prose, runtime-Codex, and autonomous action were active safety boundaries, shipped absence assertions, existing internal boundary/readiness modules, or reference-only history. No behavior leak requires a smaller corrective slice before FP-0083.
- No external web/search research was used. If a later implementation needs official/current OSS/security/Docker/OpenAI docs for wording accuracy, it must cite the official source names and what they were used for in this plan.

## Decision Log

Decision: FP-0083 is safe to plan now.
Rationale: FP-0082/V2C is merged and shipped, active docs support FP-0082 as local/internal only, V2A/V2B/V2C proofs exist and pass, README and F12 audit identify OSS/security/privacy/demo/self-host gaps, and the next slice can remain docs-and-plan-only in this thread.

Decision: FP-0083 is exactly `oss-demo-self-host-security-baseline`.
Rationale: a narrow OSS baseline is safer than jumping from local/internal read-only evidence tools to public ChatGPT App, remote MCP, Apps SDK UI, OAuth, app submission, community packs, deployment, or provider/security-sensitive work.

Decision: FP-0083 is not product runtime.
Rationale: the later implementation should create docs, baseline policies, threat models, and validation/handoff guidance only. It must not add code, UI, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, sample data, source-pack changes, source mutation, finance writes, generated product prose, LLM orchestration, runtime-Codex finance output, or autonomous action.

Decision: FP-0083 is not deployment.
Rationale: cloud hosting, SaaS multi-tenancy, DNS, production hosting, public marketing launch, external communications, and app submission require future named plans after the OSS baseline is implemented and QA'd.

Decision: FP-0083 is not public MCP or ChatGPT App.
Rationale: FP-0082 intentionally shipped only a local/internal read-only contract. Public ChatGPT App alpha, remote MCP deployment, Apps SDK UI, OAuth, and app submission remain blocked until security/privacy/self-host/demo/contribution docs exist and validation passes.

Decision: demo seed posture starts docs-only.
Rationale: the first FP-0083 implementation should document a safe local demo journey using existing proof commands and existing shipped synthetic proof posture. It should not add checked-in sample source-pack data, fixture files, eval datasets, or source-pack behavior unless a future plan proves the data is synthetic, non-private, non-confusing, and not a behavior change.

Decision: no package-scope rename belongs in FP-0083.
Rationale: root `package.json` remains `pocket-cto`, internal packages remain `@pocket-cto/*`, and active docs already describe those as internal scaffolding. Renaming requires a dedicated future plan.

Decision: no GitHub or engineering-twin deletion belongs in FP-0083.
Rationale: those modules are isolated internal/historical scaffolding. Deletion would be a separate refactor with replacement proof and is not necessary for OSS baseline docs.

Decision: no web/search was needed for this planning thread.
Rationale: repo source truth was sufficient. Future implementation may use official/current OpenAI, GitHub/OSS/security-advisory, or Docker docs only for wording accuracy, and must record source names plus use.

## Context and Orientation

Current shipped plan truth:

- FP-0082 is the shipped V2C local/internal read-only evidence-tool contract record.
- FP-0081 is the shipped V2B document precision adapters foundation record.
- FP-0080 is the shipped V2A EvidenceIndex/document-map foundation record.
- FP-0079 is the shipped F12 manual UI/demo-readiness audit record.
- FP-0078 is the shipped F11 public repo hygiene and V2 transition record.
- FP-0077 is the shipped F10/v1 public launch handoff record.
- FP-0076 is the shipped F9 read-only UI truthfulness polish record.
- FP-0075 is the shipped F8 future-scope triage record.
- FP-0074 is the shipped F7 launch-readiness record.
- FP-0050 through FP-0073 remain shipped F6 records.

The gap from V2A/V2B/V2C that justifies OSS baseline now is not another evidence feature. The gap is safe public orientation. V2A and V2B made evidence more precise; V2C made evidence locally navigable through a read-only tool contract. But the repository still lacks the formal OSS/security/privacy/contribution/demo/self-host threat-model layer that tells an outside user how to avoid committing real finance data, how to handle local secrets and object storage, how to report security issues privately, and how to run a safe demo without relying on Codex thread context.

Current repo truth supports this sequence:

- Public ChatGPT App and remote MCP work is blocked until the OSS baseline implementation exists and passes validation.
- V2D Evidence Atlas UI should wait for the OSS baseline plus a focused V2D plan, because a public-facing evidence UI would otherwise lack demo-data, privacy, screenshot, and security posture.
- V2E bounded LLM orchestration should wait for the OSS baseline plus stable evidence contracts and a separate LLM plan, because source text can contain prompt-injection strings and private finance data.
- V2F benchmark/community pack should wait for the OSS baseline plus a future fixture/sample-data policy, because community data must not leak real finance records or weaken source-pack semantics.

Conceptual model for FP-0083:

- `OssBaseline`: the checked-in documentation baseline that defines contribution, security, privacy, demo, self-host, data, and disclosure boundaries for an OSS reviewer.
- `SelfHostBoundary`: the limits of local self-hosting, including Docker services, local Postgres, S3-compatible object storage, secrets, network posture, and non-production assumptions.
- `DemoOperatorJourney`: a documented path a human can run locally from existing setup and proof commands without Codex context.
- `DemoDataPolicy`: the policy that says demo inputs must be synthetic, fixture, or explicitly approved; real finance data is forbidden.
- `FinanceDataThreatModel`: the threat model for raw exports, bank/accounting/payroll/customer/vendor data, board/lender/legal/tax material, credentials, local services, source packs, logs, excerpts, and public repo leakage.
- `ContributorSafetyBoundary`: the contribution rules that keep high-liability finance behavior, broad rewrites, provider work, package renames, source mutation, and real data out of PRs.
- `SecurityDisclosurePolicy`: a private reporting path for suspected vulnerabilities or accidental sensitive-data exposure.
- `PrivacyBoundary`: the documented privacy posture for local data, public repo data, logs, screenshots, source excerpts, and proof outputs.
- `LocalSecretsPolicy`: guidance for `.env`, provider tokens, GitHub secrets, object-store keys, OpenAI keys if ever introduced, and redaction expectations.
- `LocalStoragePolicy`: guidance for local Postgres, MinIO/S3-compatible buckets, object keys, cleanup, backups, and no-production-data warnings.
- `SampleDataPolicy`: the rule for future sample data, including synthetic-only, non-private, reviewable, and source-pack-safe requirements.
- `PublicRepoDataPolicy`: what is forbidden in Git history, issues, PRs, screenshots, fixtures, and docs.
- `EvidenceToolPrivacyBoundary`: how V2C local evidence tools handle queries, audit fields, bounded excerpts, redaction, no full-file dumps, and no public tool exposure.
- `PromptInjectionThreat`: the rule that instructions embedded in source text, excerpts, PDFs, wiki pages, or proof output are untrusted data and must not be followed.
- `ReadOnlyAgentThreatModel`: the risk model for local/internal read-only tools, including prompt injection, exfiltration, broad disclosure, query logs, and future public app wrappers.
- `ValidationRunbook`: the exact existing commands used to prove the docs baseline and shipped evidence spine without adding package scripts.
- `ScreenshotPolicy`: guidance that screenshots must not expose real company data, credentials, tokens, customer/vendor/payroll/tax/legal materials, or private board/lender contents.
- `NoRealFinanceDataRule`: the top-level rule that real company finance data and credentials must not be committed or used in public demo artifacts.
- `FutureFixturePolicy`: future sample/fixture expansion requires a later plan and explicit proof that the data is synthetic, non-private, reviewed, and not a source-pack behavior change.

## Plan of Work

The later FP-0083 implementation should create the first OSS baseline documentation set. It should prefer these files:

- `SECURITY.md`
- `PRIVACY.md`
- `CONTRIBUTING.md`
- `docs/security/finance-data-threat-model.md`
- `docs/security/read-only-agent-threat-model.md`
- `docs/demo/local-demo-operator-journey.md`
- `docs/demo/demo-data-policy.md`
- `docs/ops/self-host-baseline.md`

The implementation may update README, CODEX_README, START_HERE, docs/ACTIVE_DOCS, docs/PROJECT_STATE, docs/V2_BOUNDARY, plans/ROADMAP, and relevant ops/eval/benchmark docs only where they are directly stale after those baseline docs are created.

Required planning answers:

- What gap from V2A/V2B/V2C justifies OSS baseline now? The missing public safety layer: contribution/security/privacy/self-host/demo/data/threat-model docs are absent while V2C has made evidence locally navigable.
- Is public ChatGPT App or remote MCP work blocked until OSS baseline implementation? Yes. It must wait for FP-0083 implementation and QA, plus a later named public app/remote MCP plan.
- Which docs must be created in the first implementation? The preferred list above: SECURITY, PRIVACY, CONTRIBUTING, finance-data threat model, read-only-agent threat model, local demo operator journey, demo data policy, and self-host baseline.
- Should implementation create sample fixtures, or only demo docs and data policy? Only demo docs and data policy in the first implementation. No new sample fixtures or source-pack data unless a later plan proves safety.
- How should a user run a safe local demo without Codex context? The future local-demo doc should use README setup, local Docker services, existing direct V2/source-pack proofs, and existing smoke commands, with explicit synthetic-data and no-real-finance-data warnings.
- How should a contributor know what data is forbidden to commit? CONTRIBUTING, PRIVACY, SECURITY, demo-data policy, and README should all state the NoRealFinanceDataRule and credential/screenshot prohibitions.
- How should security issues be reported without creating public sensitive-data exposure? SECURITY.md should provide a private reporting path and tell reporters not to paste secrets, real finance records, customer/vendor data, screenshots with private data, or exploit details into public issues.
- What privacy warnings must be in README and demo docs? No real exports, bank data, payroll data, customer/vendor lists, tax records, legal materials, board/lender materials, credentials, tokens, object-store secrets, or production database dumps.
- What local secrets/object-storage/Postgres risks must be called out? `.env` keys, MinIO/S3 bucket contents, Postgres volumes, logs, dumps, screenshots, backups, and reused provider/API credentials.
- How will the read-only evidence-tool contract fit the threat model? V2C tools are local/internal read-only only; their query logs, audit fields, excerpts, redactions, full-file-dump absence, prompt-injection boundary, and future public wrapper risks must be documented.
- How will prompt-injection source text be handled in public docs? Public docs must say source text is untrusted data. Operators and future agents must never follow instructions embedded in finance sources, excerpts, PDFs, wiki pages, or proof output.
- What validation commands prove the baseline without adding scripts? Use the existing commands in this plan's Validation and Acceptance section. Do not add package scripts or smoke aliases.
- Should any active docs be refreshed after planning? Yes, only active-doc/roadmap lines that would otherwise hide FP-0083 as the active next plan.
- What should public ChatGPT App planning wait for? FP-0083 implementation, validation, security/privacy/self-host/demo docs, a read-only-agent threat model, and a later named public app plan.
- What should V2D Evidence Atlas UI wait for? FP-0083 implementation and a later V2D plan that consumes V2C without creating a second truth layer.
- What should V2F benchmark/community pack wait for? FP-0083 implementation and a later sample/fixture/community-pack policy that proves synthetic non-private data and no source-pack behavior leak.

## Concrete Steps

The next implementation thread should:

1. Re-run preflight against fetched `origin/main`, confirm branch, clean worktree, Docker services, PR #229 merged, FP-0083 exists, and FP-0084 absent.
2. Re-read this plan and the active documentation spine.
3. Re-run the direct V2 proofs before writing.
4. Create the OSS baseline docs listed in Plan of Work.
5. Keep docs factual and boundary-first. Do not claim public deployment, app submission, OAuth, provider integrations, certification, sample data, or public demo polish exists.
6. Define the finance-data threat model around real company exports, bank/accounting/payroll/customer/vendor data, board/lender/legal/tax materials, credentials/tokens, object storage, local Postgres, source-pack fixtures, prompt-injection strings, V2C query/audit logs, accidental full-file dumps, public repo leakage, and contributor mistakes.
7. Define contribution/governance boundaries: no real finance data, no provider credentials, no high-liability behavior, no package-scope rename, no GitHub/engineering-twin deletion, no broad rewrite, validation expectations, Finance Plan workflow, screenshot/demo-data handling, and security reporting.
8. Define demo/self-host docs around existing setup and proof commands only. Do not add scripts, smoke aliases, fixtures, sample source-pack data, eval datasets, routes, schema, migrations, or UI.
9. Inspect V2C proof-integrity follow-up checks before final handoff:
   - empty or whitespace-only `search_evidence` query behavior
   - bounded/redacted document-map excerpts
   - unknown requested action fail-closed behavior
   - redaction policy limitations
   - direct proof hardcoded absence booleans versus repo-scope audit checks
10. If a V2C defect appears, stop the OSS baseline implementation and recommend a narrow V2C correction instead of widening FP-0083.
11. Update this plan's Progress, Surprises & Discoveries, Decision Log, Validation and Acceptance, Artifacts and Notes, and Outcomes & Retrospective at closeout.

## Validation and Acceptance

FP-0083 implementation is accepted only if:

- `plans/FP-0083-oss-demo-self-host-security-baseline.md` remains the single active plan.
- FP-0084 does not exist.
- OSS baseline docs are created without code/runtime changes.
- No sample data, fixture, source-pack mutation, eval dataset, package script, smoke alias, route, schema, migration, UI, public ChatGPT App, remote MCP server, Apps SDK UI, OAuth, app submission, provider integration, certification, deployment, external communications, source mutation, finance write, generated product prose, LLM orchestration, runtime-Codex finance output, or autonomous action is added.
- Security/privacy/demo docs preserve raw-source, Finance Twin, CFO Wiki, EvidenceIndex, and V2C authority boundaries.
- Validation passes on the final tree.

Required validation commands for this master-plan slice and the later implementation:

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

Master-plan validation result on 2026-05-08: all required commands above passed. `pnpm ci:repro:current` succeeded from a clean temporary worktree snapshot and completed its clean-tree checks. No external web/browser research was used.

## Idempotence and Recovery

This plan is idempotent:

- rerunning the planning slice should find this FP-0083 plan and update it rather than creating a duplicate
- rerunning direct proofs should not mutate raw source fixtures
- rerunning DB-backed smokes should use existing local proof patterns and should not create new source-pack behavior
- rerunning implementation must not create FP-0084
- no raw source files should be rewritten
- active docs should only receive directly stale handoff updates

Recovery paths:

- If FP-0082 proof or V2C specs fail, stop FP-0083 and recommend a narrow V2C correction.
- If active docs contradict shipped FP-0082, stop implementation and create a docs-only correction inside FP-0083 or a smaller corrective plan if FP-0083 is no longer safe.
- If a proposed security/privacy/demo doc requires code, UI, routes, schema, scripts, fixtures, provider work, deployment, app submission, external communications, source mutation, finance writes, or autonomous action, stop and defer that work to a future named plan.
- If a contributor-data or sample-data policy cannot prove synthetic/non-private posture, do not add sample data.

## Artifacts and Notes

Artifacts created in this master-plan thread:

- `plans/FP-0083-oss-demo-self-host-security-baseline.md`
- directly stale active-doc/roadmap refreshes that point to FP-0083 as the active next OSS baseline plan

Future artifacts planned but not created in this master-plan thread:

- `SECURITY.md`
- `PRIVACY.md`
- `CONTRIBUTING.md`
- `docs/security/finance-data-threat-model.md`
- `docs/security/read-only-agent-threat-model.md`
- `docs/demo/local-demo-operator-journey.md`
- `docs/demo/demo-data-policy.md`
- `docs/ops/self-host-baseline.md`

Forbidden artifacts still absent:

- code, UI, routes, schema, migrations, package scripts, smoke aliases, eval datasets, fixtures, sample data, source-pack changes, monitor families, discovery families, public MCP server code, ChatGPT App code, Apps SDK code, OAuth, app submission, OpenAI API code, OpenAI vector/file-search code, OCR/vector/PageIndex code, iOS, OpenClaw, deployment, external communications, provider jobs, provider credentials, delivery, notification, approval, report-release, report-circulation behavior, certification, close-complete behavior, accounting writes, bank writes, tax filings, legal advice, payment behavior, source mutation, finance writes, generated product prose, runtime-Codex finance output, and autonomous action

External web/browser research:

- No external web or browser research was used in this FP-0083 planning thread.
- No web/search result was used to override repo source truth.

Replay and evidence implications:

- This master-plan thread is docs-and-plan only and creates no mission state changes, source ingest actions, report actions, approval actions, replay events, or evidence bundles.
- The later implementation should also remain docs-only. It should explicitly record that no replay event is created unless it unexpectedly touches product state, which should be treated as a blocker.

## Interfaces and Dependencies

FP-0083 depends on:

- shipped FP-0082 local/internal read-only evidence-tool contract and direct proof
- shipped FP-0081 TextPdfAdapter foundation and direct proof
- shipped FP-0080 EvidenceIndex/document-map foundation and direct proof
- shipped source-pack proof spine
- README/CODEX_README/START_HERE/ACTIVE_DOCS/PROJECT_STATE/V2_BOUNDARY/ROADMAP active-doc spine
- local Docker Postgres and S3-compatible object storage for validation
- existing package scripts and proof commands only

FP-0083 does not depend on:

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
- GitHub or engineering-twin deletion

## Outcomes & Retrospective

Planning outcome:

- FP-0083 is the active implementation-ready OSS demo/self-host/security baseline plan.
- The planned first implementation should create OSS/security/privacy/contribution/demo/self-host threat-model docs only.
- Public ChatGPT App alpha, remote MCP deployment, Apps SDK implementation, OAuth, app submission, V2D Evidence Atlas UI, V2E bounded LLM orchestration, V2F benchmark/community pack, F6V provider integration, F6X certification, OCR/vector/PageIndex/OpenAI file-search adapters, iOS, OpenClaw, deployment, external communications, package-scope rename, and later high-liability work remain future-plan-only.
- No FP-0084 was created.
- No implementation began in this master-plan thread.
- Required validation passed for the master-plan handoff.
