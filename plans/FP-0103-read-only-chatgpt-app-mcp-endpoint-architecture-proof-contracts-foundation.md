# FP-0103 - Read-only ChatGPT App MCP Endpoint Architecture Proof Contracts Foundation

## Purpose / Big Picture

FP-0103 is the V2W local/proof-only/read-only endpoint architecture proof-contract foundation for the future public read-only ChatGPT App/MCP path.

FP-0103 is not implementation. FP-0103 is local/proof-only/read-only endpoint architecture contract work. FP-0103 defines endpoint architecture proof contracts only. FP-0103 does not authorize endpoint implementation. FP-0103 does not authorize route implementation. FP-0103 does not authorize web API/backend/control-plane route implementation. FP-0103 does not authorize OAuth/token/session implementation. FP-0103 does not authorize remote MCP server implementation or deployment. FP-0103 does not authorize Apps SDK iframe/resource implementation. FP-0103 does not authorize public ChatGPT App implementation. FP-0103 does not authorize app submission, screenshots, listing copy, public assets, app-submission artifacts, or generated public assets. FP-0103 does not authorize OpenAI API/model calls.

FP-0103 keeps FP-0104 absent. FP-0103 preserves FP-0102, FP-0101, FP-0100, FP-0099, FP-0098, FP-0087, V2F, and V2G proof boundaries. FP-0103 keeps public app implementation/submission future-only.

FP-0102 shipped docs/proof-only endpoint/OAuth/remote-MCP architecture and security-readiness planning. FP-0102 explicitly recommended that endpoint/OAuth/remote-MCP implementation should not start from FP-0102 alone. This slice adds pure domain contracts and proof tooling that prove no endpoint exists yet, no route/API/backend path was added, endpoint inventory remains future-only, and future transport/TLS/envelope/refusal/failure requirements are explicit before any later implementation plan can begin.

Replay and evidence-bundle implications: this slice creates no mission state transition, ingest action, report action, approval, durable product finance output, source mutation, Finance Twin write, CFO Wiki write, evidence bundle, provider job, certification record, delivery record, endpoint, backend route, remote MCP server, Apps SDK resource, app submission, or app/MCP runtime behavior. No replay event is added because this is local proof-contract work only.

## Progress

- [x] 2026-05-11T00:06:00Z - Invoked the requested Pocket CFO operator skills before work: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor.
- [x] 2026-05-11T00:06:00Z - Ran preflight against fetched `origin/main` on branch `codex/v2w-read-only-chatgpt-app-mcp-endpoint-architecture-proof-contracts-foundation-local-v1`; the repo started clean, `HEAD` matched `origin/main`, GitHub auth/repo access worked, PR #266 was merged, Docker Postgres/MinIO/OTel services were available, FP-0102 existed and shipped, FP-0103 was absent, FP-0104 was absent, and required proof tools existed.
- [x] 2026-05-11T00:06:00Z - Ran all eight baseline proof gates before edits; the V2F/V2G/FP-0100/FP-0101/FP-0102 proof JSON proved `fp0103Absent: true`, which was the expected pre-edit state.
- [x] 2026-05-11T00:06:00Z - Used official OpenAI web docs only as current read-only Apps SDK/MCP/security/auth/deployment/submission context and made no OpenAI API/model calls.
- [x] 2026-05-11T00:06:00Z - Created this FP-0103 plan as the only allowed FP-0103 file.
- [x] 2026-05-11T01:31:00Z - Added pure domain contracts/builders/proof schema/specs for endpoint architecture proof contracts under `packages/domain/src/read-only-app-mcp-endpoint-architecture*.ts`.
- [x] 2026-05-11T01:31:00Z - Added the direct `tools/read-only-endpoint-architecture-proof.mjs` proof command with machine-readable JSON and route/runtime/OAuth/OpenAI/source-mutation/write-action absence gates.
- [x] 2026-05-11T01:31:00Z - Applied the minimum V2F/V2G/FP-0100/FP-0101/FP-0102 proof-gate bridge so exactly this local/proof-only FP-0103 endpoint architecture contract foundation is accepted while FP-0104 remains absent.
- [x] 2026-05-11T01:31:00Z - Refreshed directly stale active docs and `plugins.md` where they mention latest public-app endpoint architecture state.
- [x] 2026-05-11T01:31:00Z - Ran focused validation, strict same-branch QA, and final validation. A concurrent `pnpm ci:repro:current` attempt overlapped a full `pnpm test` run and failed in shared integration DB orchestrator tests; the isolated rerun passed. No product code, route, endpoint, OAuth, token/session, remote MCP, Apps SDK resource, public app, submission, source mutation, finance write, or OpenAI API/model behavior was added.
- [x] 2026-05-11T01:39:00Z - Prepared the single final commit, pushed the requested branch, and opened PR #267. This row is folded into the same final branch commit by amend so the branch still presents exactly one FP-0103 commit.

## Surprises & Discoveries

Baseline proof gates intentionally proved `fp0103Absent: true`. That was correct before this slice. FP-0103 must replace the hard FP-0103 absence rule with an exact local/proof-only endpoint architecture proof-contract allowance while preserving FP-0104 absence.

Official OpenAI docs continue to separate the public/full MCP path into MCP server endpoint and tool schema, ChatGPT UI resource registration, OAuth/auth metadata and per-tool security schemes, HTTPS deployment, Developer Mode connection/testing, submission, and security/privacy review. FP-0103 records these only as future constraints for contracts and proof gates; it does not implement any of them.

OpenAI Developer Docs MCP tooling was not exposed as a callable read-only MCP tool in this thread, so official OpenAI web docs were used directly. No OpenAI Developers tool was used to create API keys. No OpenAI Platform key setup was used. No OpenAI API key was used.

One concurrent validation attempt ran `pnpm ci:repro:current` while a full local `pnpm test` was still exercising shared local Postgres-backed suites. That concurrent attempt failed inside `pnpm ci:integration-db` on three orchestrator DB-backed timeouts. The isolated rerun of `pnpm ci:repro:current` passed, so the final validation posture is based on serialized validation.

## Decision Log

Decision: FP-0103 is not implementation.
Rationale: FP-0102 was architecture planning. The next safe step is local proof contracts that prove the endpoint path is still absent and future-only, not endpoint/OAuth/remote-MCP/App SDK code.

Decision: FP-0103 does not authorize endpoint implementation or route implementation.
Rationale: a later implementation plan must first name endpoint inventory, path, method, transport, request envelope, response envelope, auth requirement, health path if any, refusal/failure behavior, logging posture, abuse posture, replay posture, and evidence/freshness/limitations posture.

Decision: FP-0103 does not authorize web API/backend/control-plane route implementation.
Rationale: route surfaces would be product runtime. This slice is proof-contract only and must fail if FP-0103 changes app route, web API route, backend route, control-plane route, endpoint, or server runtime files.

Decision: FP-0103 does not authorize OAuth/token/session implementation.
Rationale: OAuth, token storage, session handling, refresh, revocation, scope, consent, RBAC, and expiry handling require a later named auth plan and threat model.

Decision: FP-0103 does not authorize remote MCP server implementation or deployment.
Rationale: remote MCP requires future HTTPS host, transport, network, TLS, CORS, CSP, health, logging, metrics, rate limiting, rollback, and abuse controls.

Decision: FP-0103 does not authorize Apps SDK iframe/resource implementation, public ChatGPT App implementation, or app submission.
Rationale: these are separate later lanes after endpoint/OAuth/remote-MCP contracts and proof gates pass.

Decision: FP-0103 does not authorize app submission, screenshots, listing copy, public assets, app-submission artifacts, generated public assets, or generated product prose.
Rationale: submission and public artifacts require a later submission plan after implementation, privacy, security, and evidence gates pass.

Decision: FP-0103 does not authorize OpenAI API/model calls.
Rationale: this slice needs official docs context only, not API/model integration or model execution.

Decision: FP-0103 keeps FP-0104 absent.
Rationale: no successor implementation or submission plan should appear before this local proof-contract foundation closes.

Decision: FP-0103 preserves FP-0102, FP-0101, FP-0100, FP-0099, FP-0098, FP-0087, V2F, and V2G boundaries.
Rationale: endpoint architecture contracts must bridge from the shipped read-only evidence/public-app safety spine rather than replacing it.

## Context and Orientation

FP-0103 sits after these shipped public-app boundaries:

- FP-0087: local proof-only read-only ChatGPT App/MCP contract and descriptor/envelope foundation.
- FP-0098: docs-only public-app readiness/security/submission-boundary planning.
- FP-0099: docs-only public-app security threat-model/platform-boundary planning.
- FP-0100: local/proof-only public-app security boundary contracts.
- FP-0101: docs-only public-app implementation sequencing/platform-readiness planning.
- FP-0102: docs/proof-only endpoint/OAuth/remote-MCP architecture and security-readiness planning.

FP-0103 is the local proof-contract gate recommended after FP-0102. It proves endpoint inventory is future-only, no endpoint path is implemented, no route/app route/API route/backend route/control-plane route was added, and future endpoint inventory must name path, method, transport, request envelope, response envelope, auth requirement, health path if any, refusal/failure behavior, and logging posture before implementation.

Allowed files for this slice are this plan, pure domain endpoint architecture contracts/specs, the direct endpoint architecture proof command, minimal proof-gate bridges/specs, and directly stale active docs/plugin notes. No route, endpoint, schema, migration, package script, eval dataset, fixture, sample data, source pack, screenshot, image, public asset, listing copy, app-submission artifact, OAuth implementation, token/session implementation, remote MCP implementation/deployment, Apps SDK resource, OpenAI API/model call, source mutation, finance write, generated product prose, runtime-Codex finance output, autonomous action, provider/certification/deployment work, or external communication is in scope.

## Plan of Work

1. Keep FP-0103 local/proof-only/read-only endpoint architecture proof-contract work only.
2. Record official OpenAI source names and purposes for future endpoint/MCP/security/auth/deploy/submission gates.
3. Add pure domain contracts for endpoint inventory deferral, future path preconditions, trust model, transport choice, TLS/HTTPS future requirement, request/response envelope, evidence/freshness/limitations fields, refusal/failure posture, read-only allowlist preservation, and no-runtime/no-route/no-endpoint posture.
4. Add a direct machine-readable proof command that fails if any required boolean is false.
5. Add route/endpoint absence scans that reject FP-0103 changes under app route, web API route, control-plane/backend/server/API, DB, endpoint/runtime, OAuth/token/session, remote MCP, Apps SDK resource, public asset, listing, or submission surfaces.
6. Bridge existing public-app proof gates so exactly this FP-0103 local endpoint architecture proof-contract foundation is accepted and FP-0104 remains absent.
7. Harden touched proof-source scans under public-app proof-gate naming so executable OpenAI imports, clients, env-key usage, API host calls, response/chat/model calls, and `callModel` style calls are rejected.
8. Refresh directly stale active docs and `plugins.md` only where they mention latest public-app endpoint architecture state.
9. Run focused validation, strict same-branch QA, final validation, closeout, commit once, push, and open the requested PR.

### Endpoint Architecture Contract Gates

The endpoint inventory is future-only. No endpoint path is implemented. No app route is implemented. No API route is implemented. No backend route is implemented. No control-plane route is implemented. No route implementation is authorized by FP-0103.

Future endpoint inventory must name path, method, transport, request envelope, response envelope, auth requirement, health path if any, refusal/failure behavior, and logging posture before implementation.

The future trust model must name which caller is trusted, which caller is untrusted, which data is model-visible, which data is UI-visible, which data is server-only, and which authority layer can answer a finance question. Raw sources remain authoritative for document claims, Finance Twin remains authoritative for structured finance facts, CFO Wiki remains compiled/derived, EvidenceIndex remains the read-only anchor/trace/card layer, and V2G descriptors/envelopes remain read-only proof contracts.

Future transport choice is only an architecture input in FP-0103 and must be justified later against official docs. TLS/HTTPS is a future requirement, not implementation in this slice.

Request and response envelopes must preserve evidence, source anchors, freshness, limitations, refusals, and permitted next actions. Unsupported, stale, conflicting, missing-citation, data-exfiltration, raw-dump, write-action, and prompt-injection requests fail closed. No raw full-file dump is allowed. No write/modify/action tools are allowed. No source mutation, finance writes, external communications, generated finance advice, provider calls, certification, delivery, deployment, payment instruction, customer contact, legal advice, tax filing, audit opinion, or autonomous action may be reachable.

The existing V2G descriptor/envelope allowlist remains read-only.

### Deferred Future-Only Scope

OAuth/token/session implementation remains future-only. Remote MCP implementation/deployment remains future-only. Apps SDK iframe/resource implementation remains future-only. Public ChatGPT App implementation remains future-only. App submission, screenshots, generated images, public assets, listing copy, app-submission artifacts, and generated public assets remain future-only. OpenAI API/model/client/key usage remains out of scope.

## Concrete Steps

1. Run preflight.
2. Read first files from the prompt and active docs spine.
3. Run baseline proof gates and confirm FP-0103 absence.
4. Use official OpenAI docs only for current endpoint/MCP/security/auth/deploy/submission context and record source names and purposes in this plan.
5. Create exactly one Finance Plan at `plans/FP-0103-read-only-chatgpt-app-mcp-endpoint-architecture-proof-contracts-foundation.md`.
6. Add pure domain contracts/builders/proof schema/specs under `packages/domain/src/read-only-app-mcp-endpoint-architecture*.ts`.
7. Add `tools/read-only-endpoint-architecture-proof.mjs`.
8. Update the minimum V2F/V2G/FP-0100/FP-0101/FP-0102 proof schemas, builders, proof tools, and focused specs so the exact FP-0103 local/proof-only endpoint architecture contract foundation is accepted while FP-0104 remains absent.
9. Include proof-source hardening/naming polish across touched proof surfaces.
10. Refresh directly stale active docs and `plugins.md` only where needed.
11. Run focused validation.
12. Run strict same-branch QA over changed files, route/API/backend paths, runtime markers, asset paths, FP-0103/FP-0104 plan names, and forbidden platform/runtime terms.
13. Run final validation.
14. If a post-validation doc closeout edit is made, rerun the required final-tail validation.
15. Commit exactly once.

## Validation and Acceptance

Focused validation:

```bash
pnpm exec tsx tools/read-only-public-app-security-boundary-proof.mjs
pnpm exec tsx tools/read-only-mcp-descriptor-response-envelope-proof.mjs
pnpm exec tsx tools/read-only-chatgpt-app-mcp-proof.mjs
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
pnpm exec tsx tools/read-only-endpoint-architecture-proof.mjs
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts
```

Strict same-branch QA:

- Confirm changed files are docs/proof-gate/domain-contract only.
- Confirm exactly one FP-0103 file exists at `plans/FP-0103-read-only-chatgpt-app-mcp-endpoint-architecture-proof-contracts-foundation.md`.
- Confirm FP-0104 remains absent.
- Confirm no app routes, web API routes, backend routes, control-plane routes, endpoints, schemas, migrations, packages, fixtures, datasets, samples, source packs, screenshots, images, public assets, listing copy, OpenAI API/model calls, OAuth, token/session implementation, remote MCP server/deployment, Apps SDK resources, app submission artifacts, provider/deployment, external communications, source mutation, finance writes, generated product prose, runtime-Codex finance output, autonomous action, or public app implementation.
- Confirm README/CODEX/START/ACTIVE_DOCS/PROJECT_STATE/V2_BOUNDARY/ROADMAP/security-demo docs are fresh if they mention latest public-app endpoint architecture state.

Final validation:

```bash
git diff --check
pnpm exec tsx tools/read-only-endpoint-architecture-proof.mjs
pnpm exec tsx tools/read-only-public-app-security-boundary-proof.mjs
pnpm exec tsx tools/read-only-mcp-descriptor-response-envelope-proof.mjs
pnpm exec tsx tools/read-only-chatgpt-app-mcp-proof.mjs
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance evidence:

- exactly one FP-0103 file exists at the planned path
- FP-0103 is local/proof-only/read-only endpoint architecture proof-contract work only
- FP-0104 remains absent
- endpoint inventory remains future-only
- no endpoint path exists from this slice
- no app route, web API route, backend route, control-plane route, or server runtime exists from this slice
- no OAuth/token/session implementation exists from this slice
- no remote MCP implementation/deployment exists from this slice
- no Apps SDK iframe/resource implementation exists from this slice
- no public ChatGPT App implementation or app submission exists from this slice
- no public assets, listing copy, screenshots, generated images, or app-submission artifacts exist from this slice
- no OpenAI API/model/client/key usage exists from this slice
- no source mutation, finance write, write-action tool, external communication, generated finance advice, provider call, certification, delivery, deployment, generated product prose, runtime-Codex finance output, or autonomous action exists from this slice
- FP-0102, FP-0101, FP-0100, FP-0099, FP-0098, FP-0087, V2F, and V2G proof boundaries remain intact

## Idempotence and Recovery

Rerunning this slice should find this exact FP-0103 file and update it rather than creating another FP-0103 or FP-0104.

If proof gates fail because FP-0103 is present, patch only the proof-gate bridge, endpoint architecture proof contracts, direct proof command, or FP-0103 plan wording so the exact local/proof-only endpoint architecture contract foundation is accepted. Do not widen into endpoint implementation, routes, OAuth, token/session handling, remote MCP server implementation, remote MCP deployment, Apps SDK resource implementation, public app implementation, app submission, provider, deployment, OpenAI API/model calls, source mutation, finance writes, generated product prose, runtime-Codex finance output, external communications, or autonomous action.

If validation fails, do not widen scope. Stop and report the exact failing command. The smallest safer corrective slice is one of:

- FP-0103 endpoint architecture proof-contract correction
- FP-0102 architecture proof-gate bridge correction
- FP-0100 security boundary proof correction
- FP-0087 descriptor/envelope correction
- hold endpoint architecture contracts until local security contracts can be proven

Rollback is document/proof-contract/proof-gate only: remove or correct the FP-0103 plan and proof-gate bridge fields if they accidentally authorize implementation or accept extra successor files.

## Artifacts and Notes

This slice creates one planning artifact: `plans/FP-0103-read-only-chatgpt-app-mcp-endpoint-architecture-proof-contracts-foundation.md`.

Official OpenAI sources used as current read-only platform/security context:

- OpenAI Apps SDK docs, `https://developers.openai.com/apps-sdk/`: used to confirm Apps SDK is the ChatGPT apps framework and to anchor Apps SDK/MCP as platform context only.
- OpenAI Apps SDK MCP server docs, `https://developers.openai.com/apps-sdk/concepts/mcp-server`: used to frame MCP server tool listing, tool calling, structured content, metadata, and UI resource concepts as future architecture inputs.
- OpenAI Apps SDK Authentication docs, `https://developers.openai.com/apps-sdk/build/auth`: used to frame future OAuth protected-resource metadata, per-tool `securitySchemes`, scope minimization, and auth boundaries only.
- OpenAI Apps SDK Deploy your app docs, `https://developers.openai.com/apps-sdk/deploy`: used to identify stable HTTPS hosting, streaming responses, TLS, logs, and metrics as future deployment architecture gates.
- OpenAI Apps SDK Connect from ChatGPT docs, `https://developers.openai.com/apps-sdk/deploy/connect-chatgpt`: used to frame future Developer Mode connection, HTTPS reachability, connector metadata, and testing only.
- OpenAI Apps SDK Test your integration docs, `https://developers.openai.com/apps-sdk/deploy/testing`: used to define future MCP Inspector, raw request/response inspection, golden prompt, and confirmation-prompt testing gates only.
- OpenAI Apps SDK Security & Privacy guide, `https://developers.openai.com/apps-sdk/guides/security-privacy`: used to frame future least-privilege, explicit consent, defense-in-depth, audit logging, prompt-injection, malicious input, and write-action gates.
- OpenAI Apps SDK Submit and maintain your app docs, `https://developers.openai.com/apps-sdk/deploy/submission`: used to keep app drafts, organization verification, permissions, review, publishing, directory listing, and maintenance future-only.
- OpenAI Apps SDK App submission guidelines, `https://developers.openai.com/apps-sdk/app-submission-guidelines`: used to frame publication trust, policy, UX, security, privacy, and submission requirements as a later submission lane.

No screenshots, no generated images, Figma exports, public listing assets, public app assets, app-submission assets, sample data, fixtures, eval datasets, source packs, schemas, migrations, package scripts, or smoke aliases are created. No listing copy and no app-submission artifacts are created or authorized.

No runtime interfaces are added. No HTTP routes, web API routes, backend/control-plane routes, app routes, remote MCP server, Apps SDK iframe/resource, OAuth flow, token/session handler, app submission packet, OpenAI API client, model client, provider connector, deployment path, source ingest path, Finance Twin write path, CFO Wiki write path, EvidenceIndex mutation path, or evidence-bundle interface is added.

## Interfaces and Dependencies

FP-0103 touches only docs, pure domain proof contracts, proof-gate compatibility surfaces, and direct proof tooling.

It depends on:

- shipped FP-0102 docs/proof-only endpoint/OAuth/remote-MCP architecture and security-readiness planning
- shipped FP-0101 public-app implementation sequencing/platform-readiness planning
- shipped FP-0100 local/proof-only public-app security boundary contracts
- shipped FP-0099 public-app security threat-model/platform-boundary planning
- shipped FP-0098 public-app readiness/security/submission-boundary planning
- shipped FP-0087 local proof-only read-only ChatGPT App/MCP contract and descriptor/envelope foundation
- shipped V2F benchmark/community no-real-finance-data and no-runtime posture
- official OpenAI docs used as read-only platform context
- the existing proof tools and focused domain specs

GitHub connector product behavior is out of scope. Routine `git` and `gh` CLI operations for repository metadata, commit, push, and PR creation are repository workflow only, not product connector behavior.

No new environment variables are introduced. No dependency is installed. No package script is added. No plugin install is required.

It does not add schema, migration, route, endpoint, app route, backend route, package script, smoke alias, fixture, sample data, eval dataset, source pack, Apps SDK resource, OAuth, token/session handling, remote MCP server, OpenAI API/model integration, or deployment dependency.

## Outcomes & Retrospective

FP-0103 shipped the local/proof-only/read-only endpoint architecture proof-contract foundation for the future public read-only ChatGPT App/MCP path.

Implemented outcomes:

- Added pure domain contracts for endpoint inventory deferral, future endpoint path preconditions, endpoint trust model, transport choice, TLS/HTTPS future requirement, request/response envelope preservation, evidence/freshness/limitations posture, refusal/failure behavior, read-only allowlist preservation, and no-runtime/no-route/no-endpoint/OAuth/token/session/remote-MCP/Apps-SDK/submission/OpenAI/source-mutation/finance-write/write-action boundaries.
- Added `tools/read-only-endpoint-architecture-proof.mjs`, which emits machine-readable JSON and fails if any required endpoint architecture proof boolean is false.
- Bridged existing public-app proof gates so exactly this FP-0103 local/proof-only endpoint architecture contract foundation is accepted while FP-0104, endpoint implementation, route/API/backend/control-plane implementation, OAuth/token/session, remote MCP implementation/deployment, Apps SDK resource implementation, public app implementation, app submission, public assets/listing copy, source mutation, finance writes, and OpenAI API/model usage remain rejected.
- Applied proof-source hardening and naming polish across touched public-app proof surfaces, including the public-app proof-gate source scan and executable OpenAI/API/model/key pattern rejection.
- Refreshed directly stale active docs and `plugins.md` so the latest public-app endpoint architecture state points to FP-0103 as shipped local/proof-only contracts while endpoint implementation and public app submission remain future-only.

Validation completed:

- Baseline pre-edit proof gates passed and proved FP-0103 absence as the expected starting state.
- Focused proof gates passed: `tools/read-only-endpoint-architecture-proof.mjs`, `tools/read-only-public-app-security-boundary-proof.mjs`, `tools/read-only-mcp-descriptor-response-envelope-proof.mjs`, `tools/read-only-chatgpt-app-mcp-proof.mjs`, `tools/benchmark-community-pack-proof.mjs`, `tools/bounded-llm-orchestration-proof.mjs`, `tools/read-only-evidence-app-proof.mjs`, `tools/document-precision-foundation-proof.mjs`, and `tools/evidence-index-foundation-proof.mjs`.
- Focused domain specs passed for benchmark community, read-only app/MCP, descriptor/envelope, public security, and endpoint architecture contracts.
- Strict same-branch QA confirmed changed files stayed in docs/proof-gate/domain-contract/direct-proof scope, no app/control-plane/backend/API/DB route/runtime files were changed, exactly one FP-0103 plan exists, and FP-0104 remains absent.
- Final validation passed with `git diff --check`, all proof tools, focused domain specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and isolated `pnpm ci:repro:current`.

Remaining work:

- No further FP-0103 local proof-contract work remains in this branch.
- Do not start endpoint implementation from FP-0103 alone. The next safe slice is a narrow endpoint implementation readiness/implementation plan that consumes these contracts and reopens route, endpoint, auth, deployment, and public-app questions explicitly. Public ChatGPT App submission must wait.
