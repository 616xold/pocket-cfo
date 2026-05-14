# FP-0108 read-only ChatGPT App MCP evidence tool dispatch contracts

## Purpose / Big Picture

FP-0108 is the local/proof-only/read-only contract foundation for future `/mcp` `tools/call` evidence dispatch.

The user-visible purpose is to define the exact evidence tool dispatch surface before any runtime dispatch exists. A later Finance Plan may use these contracts to wire `tools/call` into read-only evidence services, but this plan does not change route behavior and does not implement dispatch.

Target phase: V2AB read-only ChatGPT App/MCP evidence tool dispatch contracts.

This is contract/proof work only. It creates pure domain contracts, focused tests, a direct proof command, and the minimum proof-gate bridge. It keeps the shipped FP-0107 local Fastify `/mcp` route-adapter shell fail-closed for all `tools/call` requests.

FP-0108 is not endpoint route expansion, read-only evidence dispatch runtime implementation, remote MCP deployment, OAuth/token/session implementation, Apps SDK iframe/resource implementation, public ChatGPT App implementation, app submission, OpenAI API/model integration, provider integration, source mutation, finance write, generated finance advice, external communication, or autonomous action.

## Progress

- [x] 2026-05-14T17:47:52Z - Invoked the repo-local Pocket CFO operator skills requested for this slice: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-14T17:47:52Z - Confirmed the working branch is `codex/v2ab-read-only-chatgpt-app-mcp-read-only-evidence-tool-dispatch-contracts-local-v1`.
- [x] 2026-05-14T17:47:52Z - Confirmed PR #272 is merged, PR #273 transport/status hardening is on `main`, FP-0107 exists and is shipped, FP-0108 is absent before this slice, FP-0109 is absent, and the worktree starts clean.
- [x] 2026-05-14T17:47:52Z - Ran all required baseline proof tools before edits; all passed.
- [x] 2026-05-14T18:06:12Z - Created pure domain evidence tool dispatch contracts and focused specs under `packages/domain/src/read-only-app-mcp-evidence-tool-dispatch*.ts`.
- [x] 2026-05-14T18:06:12Z - Added the direct `tools/read-only-mcp-evidence-tool-dispatch-proof.mjs` proof command.
- [x] 2026-05-14T18:06:12Z - Applied the minimum proof-gate bridge so FP-0108 is accepted and FP-0109 remains absent while FP-0107 `tools/call` remains fail-closed.
- [x] 2026-05-14T18:06:12Z - Refreshed directly stale active docs and `plugins.md` for the shipped FP-0108 contract-only boundary.
- [ ] Run focused validation, same-branch QA, final validation, closeout, one commit, push, and PR creation.

## Surprises & Discoveries

- No blocker was found in preflight. The repository already has shipped FP-0107 route shell state and a hardening merge on `main`.
- Official OpenAI Developers docs were reachable through official web docs. No OpenAI Developer plugin action, OpenAI Platform key setup, OpenAI API call, model call, upload, or dependency installation was used.
- The original contract file grew past the repo's preferred modular shape during implementation, so the dispatch surface was split into constants, argument schemas, boundary schemas, guardrails, per-tool contracts, builders, and proof helpers while preserving the public barrel exports.

## Decision Log

- FP-0108 will not modify `apps/control-plane/src/modules/read-only-app-mcp-endpoint/**` route, schema, formatter, or service files. Route fail-closed posture remains evidence for this slice.
- The contracts will live under `packages/domain/src/read-only-app-mcp-evidence-tool-dispatch*.ts`, with a barrel export from `packages/domain/src/read-only-app-mcp.ts` only if needed.
- The future service dependency boundary will name only existing read-only evidence/source-authority lanes: EvidenceIndex artifacts, Source Registry/source authority, Finance Twin read models, CFO Wiki compiled read models, mission answer refs, and proof bundle refs. No new control-plane service, DB query, schema, or migration is authorized.
- Tool results must be modeled as MCP structured content envelopes with evidence, source anchors, freshness, limitations, permitted next actions, refusal reason when applicable, and capability boundary. Refusals/errors remain structured and fail closed.
- The proof-gate bridge must accept exactly this FP-0108 plan and continue to reject FP-0109.
- The FP-0108 route proof bridge is intentionally limited to plan/changed-file acceptance and boundary wording. It does not add dispatch behavior and continues to assert the FP-0107 route adapter `tools/call` fail-closed posture.

## Context and Orientation

FP-0107 shipped exactly one local/control-plane Fastify `/mcp` route-adapter shell. `POST /mcp` is the JSON-RPC request entrypoint. `GET /mcp` is handled only as SSE unavailable with HTTP 405 and `Allow: POST`. Accepted notifications return HTTP 202 with no body. Non-local `Origin` headers fail closed. `initialize`, `ping`, `notifications/initialized`, `tools/list`, structured JSON-RPC errors, and fail-closed `tools/call` are handled, but real read-only evidence dispatch is not implemented.

FP-0106 shipped the MCP protocol envelope and tool-dispatch proof-contract foundation. FP-0105 shipped route ownership and transport-adapter proof contracts. FP-0104 shipped endpoint implementation readiness planning. FP-0103 shipped endpoint architecture proof contracts. FP-0100 shipped public-app security boundary contracts.

FP-0108 builds on those records by defining exact future evidence tool dispatch contracts only. It keeps the route shell fail-closed until a later implementation Finance Plan opens dispatch.

Official docs used as read-only context:

- Model Context Protocol specification, "Tools" page, purpose: confirm `tools/call`, `inputSchema`, optional `outputSchema`, structuredContent, tool result content, and tool annotations context.
- Model Context Protocol specification, "Schema Reference" page, purpose: confirm `CallToolRequest`, `CallToolResult`, `isError`, structuredContent, and tool annotation fields.
- OpenAI Apps SDK, "Define tools" page, purpose: confirm tools as a contract surface with explicit inputs and predictable structured outputs before implementation.
- OpenAI Apps SDK, "Build your MCP server" page, purpose: confirm the future server boundary between MCP tools, auth, data returns, UI bundle, and model invocation choice. FP-0108 does not implement that server boundary.
- OpenAI Apps SDK, "Connect from ChatGPT" page, purpose: confirm public connector and HTTPS distribution remain future-only.
- OpenAI Apps SDK, "Security & Privacy" page, purpose: confirm least privilege, explicit consent, prompt-injection assumption, validation, audit logging, structured-content minimization, and secret/token exclusion context.

## Plan of Work

Create exactly one FP-0108 plan, then implement pure domain contracts for the future evidence tool dispatch mapping, argument schemas, service dependency boundaries, response envelopes, refusal envelopes, freshness/source-anchor requirements, and explicit no-runtime/no-mutation/no-write/no-provider/no-OpenAI/model boundaries.

Add one direct proof command that emits machine-readable JSON for the FP-0108 contract posture. Update the minimum existing proof gates so they accept exactly this plan while preserving FP-0107, FP-0106, FP-0105, FP-0104, FP-0103, FP-0100, V2G descriptor/envelope, V2F benchmark, and public-app security boundaries.

Refresh only directly stale active docs and `plugins.md`.

Required pure domain contract names for this slice are `EvidenceToolDispatchProofContract`, `EvidenceToolDispatchAllowlistBoundary`, `EvidenceToolArgumentSchemaBoundary`, `EvidenceToolServiceDependencyBoundary`, `EvidenceToolResponseEnvelopeBoundary`, `EvidenceToolRefusalEnvelopeBoundary`, `EvidenceToolFreshnessBoundary`, `EvidenceToolSourceAnchorBoundary`, `EvidenceToolNoRawDumpBoundary`, `EvidenceToolNoMutationBoundary`, `EvidenceToolNoFinanceWriteBoundary`, `EvidenceToolNoProviderExternalCallBoundary`, `EvidenceToolNoOpenAiModelBoundary`, `SearchEvidenceDispatchContract`, `FetchEvidenceCardDispatchContract`, `FetchSourceAnchorDispatchContract`, `FetchDocumentMapDispatchContract`, `FetchSourceCoverageDispatchContract`, `FetchCompanyPostureDispatchContract`, `FetchCapabilityBoundariesDispatchContract`, and `EvidenceToolDispatchProof`.

## Concrete Steps

1. Keep this plan current as work proceeds.
2. Add `packages/domain/src/read-only-app-mcp-evidence-tool-dispatch*.ts` contracts, builders, proof schema, and a barrel export.
3. Add `packages/domain/src/read-only-app-mcp-evidence-tool-dispatch.spec.ts`.
4. Add `tools/read-only-mcp-evidence-tool-dispatch-proof.mjs`.
5. Update only the proof-gate bridge surfaces needed for FP-0108 changed files and plan acceptance.
6. Refresh directly stale docs and plugin inventory if the shipped-state text still stops at FP-0107.
7. Run the required validation ladder and patch the same branch if QA finds a defect.
8. Close out this plan, commit once, push the requested branch, and create the requested PR.

## Validation and Acceptance

Baseline proof gates already passed before edits:

```bash
pnpm exec tsx tools/read-only-mcp-route-adapter-proof.mjs
pnpm exec tsx tools/read-only-mcp-protocol-envelope-proof.mjs
pnpm exec tsx tools/read-only-endpoint-route-ownership-proof.mjs
pnpm exec tsx tools/read-only-endpoint-architecture-proof.mjs
pnpm exec tsx tools/read-only-public-app-security-boundary-proof.mjs
pnpm exec tsx tools/read-only-mcp-descriptor-response-envelope-proof.mjs
pnpm exec tsx tools/read-only-chatgpt-app-mcp-proof.mjs
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
```

Final validation must include:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-route-adapter-proof.mjs
pnpm exec tsx tools/read-only-mcp-protocol-envelope-proof.mjs
pnpm exec tsx tools/read-only-endpoint-route-ownership-proof.mjs
pnpm exec tsx tools/read-only-endpoint-architecture-proof.mjs
pnpm exec tsx tools/read-only-public-app-security-boundary-proof.mjs
pnpm exec tsx tools/read-only-mcp-descriptor-response-envelope-proof.mjs
pnpm exec tsx tools/read-only-chatgpt-app-mcp-proof.mjs
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
pnpm exec tsx tools/read-only-mcp-evidence-tool-dispatch-proof.mjs
pnpm --filter @pocket-cto/domain test -- read-only-app-mcp-evidence-tool-dispatch.spec.ts read-only-app-mcp-protocol-envelope.spec.ts
pnpm --filter @pocket-cto/control-plane test -- read-only-app-mcp-endpoint
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Acceptance is observable when the new proof command prints machine-readable JSON with the FP-0108 fields requested in the prompt, focused specs prove exact allowlist/arguments/envelopes/refusals/no-runtime boundaries, the existing route adapter proof still shows `tools/call` fail-closed, and the changed-file QA confirms only domain/proof/docs files changed.

## Idempotence and Recovery

The slice is additive. If validation fails, patch this same branch and rerun the affected focused checks plus final validation. If a proof gate reveals that a route, DB, schema, provider, OpenAI, source mutation, finance write, or public app boundary was accidentally opened, revert only FP-0108 changes from this branch and narrow the contracts before proceeding.

If the plan file is accidentally duplicated, delete the duplicate and keep only `plans/FP-0108-read-only-chatgpt-app-mcp-read-only-evidence-tool-dispatch-contracts.md`. Do not create FP-0109 in this slice.

## Artifacts and Notes

Expected artifacts:

- `plans/FP-0108-read-only-chatgpt-app-mcp-read-only-evidence-tool-dispatch-contracts.md`
- `packages/domain/src/read-only-app-mcp-evidence-tool-dispatch*.ts`
- `packages/domain/src/read-only-app-mcp-evidence-tool-dispatch*.spec.ts`
- `tools/read-only-mcp-evidence-tool-dispatch-proof.mjs`
- Minimum proof-gate bridge edits
- Directly stale active-doc and `plugins.md` refreshes, if needed

No raw sources are changed. No generated finance advice, source mutation, finance write, provider call, external communication, OpenAI API/model call, public asset, screenshot, listing copy, app submission artifact, fixture, sample data, dataset, source pack, migration, DB query, package script, or runtime route behavior is created. FP-0108 has no dispatch runtime and no route behavior change.

For proof-gate clarity: FP-0108 has no DB query, no OpenAI API/model call, no source mutation, no finance write, and no autonomous action.

Additional proof-gate bridge wording: FP-0108 does not implement tools/call dispatch, tools/call remains fail-closed, public app implementation remains future-only, and public app submission remains future-only.

## Interfaces and Dependencies

Domain contracts depend on existing pure domain exports for the V2G MCP allowlist, forbidden tools, evidence-tool names, freshness posture, limitations, permitted next actions, and app/MCP envelope boundaries.

Future implementation dependency names remain proof-only and read-only. Any later dispatch implementation must resolve through existing evidence/source-authority lanes and must keep routes thin. No DB helpers, control-plane services, runtime adapters, providers, OAuth, token/session, Apps SDK resources, OpenAI clients, model clients, or external deployment interfaces are introduced here.

Replay implications: FP-0108 itself performs no mission state change, ingest action, report action, source mutation, or finance write, so no replay event is emitted. The contracts require a later implementation plan to define replay/audit behavior before dispatch runtime starts.

Evidence, provenance, freshness, and limitations: every future successful tool result must include structured content, evidence refs, source anchors, freshness, limitations, permitted next actions, refusal reason when applicable, and capability boundary. Missing evidence, missing citation, unsupported evidence, stale evidence, conflicting evidence, prompt-injection content, raw-dump requests, generated finance-advice requests, source mutation, finance writes, provider calls, external communications, OpenAI API/model calls, and autonomous actions fail closed by contract.

GitHub connector work is explicitly out of scope. Routine `git`, `gh pr view`, `git push`, and `gh pr create` CLI actions are repository workflow actions, not product connector behavior.

## Outcomes & Retrospective

Implemented as local/proof-only/read-only domain contracts plus proof tooling only. The FP-0107 local Fastify `/mcp` route adapter shell remains unchanged, and `tools/call` remains fail-closed until a later Finance Plan explicitly opens read-only dispatch runtime.

Progress:

- Created exactly one FP-0108 plan file.
- Added modular domain contracts for exact V2G evidence tool allowlist, exact argument schemas, future read-only service dependency boundaries, structured evidence response envelopes, structured refusal envelopes, freshness/source-anchor requirements, no raw full-file dump, no generated finance advice, no source mutation, no finance writes, no provider or external communications calls, no OpenAI API/model calls, no autonomous action, and no dispatch runtime.
- Added focused domain specs for allowlist, argument schemas, response/refusal requirements, fail-closed evidence postures, no-runtime boundaries, and FP-0109 rejection posture.
- Added `tools/read-only-mcp-evidence-tool-dispatch-proof.mjs` with machine-readable JSON proof output.
- Applied the minimum route-adapter proof-gate bridge so exact FP-0108 contracts are accepted while FP-0109 remains absent and FP-0107/FP-0106/FP-0105/FP-0104/FP-0103/FP-0100 boundaries remain intact.
- Refreshed directly stale active docs, security/demo boundary docs, roadmap, and plugin inventory wording for the shipped FP-0108 contract posture.

Decision log:

- Kept dispatch contract types in `packages/domain` and route proof checks in `tools`; no control-plane route, service, repository, DB, migration, package script, fixture, dataset, source pack, asset, or public app implementation files were added.
- Treated future service dependencies as named proof-only read methods that must resolve through existing evidence/source-authority lanes before any later runtime work can begin.
- Kept GitHub connector guard out of scope; only routine repository CLI workflow is used for branch, commit, push, and PR handling.

Validation status before this closeout edit:

- Baseline pre-edit proof gates passed.
- Post-implementation proof gates passed, including the new evidence tool dispatch proof.
- Focused domain specs passed.
- Route adapter specs passed and still prove `tools/call` fail-closed.
- Same-branch QA confirmed changed files are domain/proof/docs only, with no route behavior change, DB change, schema/migration/package script change, fixture/data/source-pack/public asset addition, source mutation, finance write, provider call, external communication, OpenAI API/model call, or FP-0109 file.
- `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed before this closeout edit. Per the FP-0108 ladder, the final validation set must be rerun after this closeout-only documentation edit.

Surprises:

- No implementation blocker appeared. Existing FP-0107 transport/status hardening and route fail-closed posture were present on the branch baseline.
- The docs were directly stale in several active boundary files, so the slice includes small wording refreshes to keep the contract truth aligned with the code and proof gates.

Remaining:

- Commit exactly once after the post-closeout validation rerun.
- Push `codex/v2ab-read-only-chatgpt-app-mcp-read-only-evidence-tool-dispatch-contracts-local-v1`.
- Open the requested PR.
- Defer read-only evidence tool dispatch runtime implementation, public ChatGPT App behavior, public app submission, remote MCP deployment, OAuth/session work, Apps SDK resources, OpenAI/model integration, provider calls, source mutation, finance writes, and autonomous action to later named Finance Plans.
