# FP-0105 read-only ChatGPT App/MCP endpoint route ownership and transport-adapter proof contracts

Status: shipped local/proof-only/read-only endpoint route ownership and transport-adapter proof-contract slice, created and closed 2026-05-11.

FP-0105 is not implementation. FP-0105 is local/proof-only/read-only endpoint route ownership and transport-adapter contract work. FP-0105 does not authorize endpoint implementation. FP-0105 does not authorize route implementation. FP-0105 does not authorize web API/backend/control-plane route implementation. FP-0105 does not authorize remote MCP server implementation or deployment. FP-0105 does not authorize OAuth/token/session implementation. FP-0105 does not authorize Apps SDK iframe/resource implementation. FP-0105 does not authorize public ChatGPT App implementation. FP-0105 does not authorize app submission, screenshots, listing copy, public assets, app-submission artifacts, or generated public assets. FP-0105 does not authorize OpenAI API/model calls.

FP-0105 defines future endpoint route ownership and transport-adapter proof contracts only. FP-0105 keeps FP-0106 absent. FP-0105 preserves FP-0104, FP-0103, FP-0102, FP-0101, FP-0100, FP-0099, FP-0098, FP-0087, V2F, and V2G proof boundaries. FP-0105 keeps public app implementation/submission future-only. FP-0105 keeps public app implementation and public app submission future-only.

This is contract/proof work only.

This is not endpoint implementation. This is not route implementation. This is not web API route implementation. This is not backend/control-plane route implementation. This is not remote MCP server implementation. This is not remote MCP deployment. This is not OAuth implementation. This is not token/session implementation. This is not Apps SDK iframe/resource implementation. This is not public ChatGPT App implementation. This is not app submission. This is not OpenAI API/model integration. This is not deployment. This is not product runtime behavior.

No endpoint implementation is required. No route implementation is required. No OAuth implementation is required. No token/session implementation is required. No remote MCP implementation is required. No Apps SDK resource implementation is required. No app submission is required. No OpenAI API/model calls are required. No public assets/listing copy/screenshots are required. No finance write or source mutation is required.

## Purpose

FP-0104 shipped docs-and-plan-only endpoint implementation readiness and exact future endpoint inventory planning. It named `/mcp` as the only future ChatGPT-facing endpoint path safe to name from current repo truth and official docs, but it deliberately deferred route ownership, route file placement, private health path, auth middleware, deployment host, transport implementation, and logging implementation.

FP-0105 closes the next contract gap before any endpoint route can be implemented: it names the future route owner family for `/mcp`, defines the future transport adapter boundary, and records the proof gates a later implementation plan must satisfy. It does not create route files.

Replay and evidence-bundle implications: this slice creates no mission state transition, ingest action, report action, approval, durable product finance output, source mutation, Finance Twin write, CFO Wiki write, EvidenceIndex mutation, evidence bundle, provider job, certification record, delivery record, endpoint, backend route, remote MCP server, Apps SDK resource, app submission, or app/MCP runtime behavior. No replay event is added because this is local/proof-only contract and proof-gate work only.

## Progress

- [x] 2026-05-11T13:09:57Z - Ran preflight against fetched `origin/main` on branch `codex/v2y-read-only-chatgpt-app-mcp-endpoint-route-ownership-transport-adapter-proof-contracts-local-v1`; `HEAD` matched `origin/main`, the tree was clean, GitHub auth/repo access worked, PR #268 was merged, Docker Postgres/MinIO/OTel services were available, FP-0104 existed and shipped, FP-0105 was absent, FP-0106 was absent, and required proof tools existed.
- [x] 2026-05-11T13:09:57Z - Loaded repo-local Pocket CFO operator skills: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not used because GitHub connector product behavior is out of scope.
- [x] 2026-05-11T13:09:57Z - Ran the nine baseline proof gates before edits; the endpoint/public-app proof logs proved `fp0105Absent: true` as expected pre-edit state.
- [x] 2026-05-11T13:09:57Z - Used official OpenAI web docs only as current read-only Apps SDK/MCP/server/auth/deploy/connect/test/security/submission context. No OpenAI Developers key setup was used, no OpenAI API key was used, and no OpenAI API/model call was made.
- [x] 2026-05-11 - Added pure domain route ownership and transport-adapter proof contracts plus focused specs.
- [x] 2026-05-11 - Added `tools/read-only-endpoint-route-ownership-proof.mjs` with machine-readable JSON and fail-closed boolean verification.
- [x] 2026-05-11 - Applied the minimum proof-gate bridge so exactly this FP-0105 local/proof-only route ownership and transport-adapter contract foundation is accepted while FP-0106 remains absent.
- [x] 2026-05-11 - Refreshed directly stale README, CODEX, START, ACTIVE_DOCS, PROJECT_STATE, V2_BOUNDARY, ROADMAP, security, demo, and plugin metadata for the FP-0105 boundary; fixed directly stale FP-0104 OpenAI Help Center URL formatting.
- [x] 2026-05-11 - Ran focused validation, strict same-branch QA, final validation, and closeout. A post-closeout validation rerun is required before commit because this closeout section is a final doc edit.

## Official OpenAI Sources

Official OpenAI sources used as current read-only platform/security context:

- OpenAI Developer Mode / MCP apps in ChatGPT help, `https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta`: used to frame Developer Mode, full MCP beta, endpoint metadata, auth mechanism selection, HTTPS remote-server support, admin publishing/refresh controls, write-action confirmation risk, and safety responsibilities as future-only gates.
- OpenAI Apps SDK docs, `https://developers.openai.com/apps-sdk/`: used to confirm Apps SDK is the ChatGPT apps framework and to anchor Apps SDK/MCP as platform context only.
- OpenAI Apps SDK MCP Apps compatibility in ChatGPT docs, `https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt`: used for current ChatGPT app/MCP conceptual context and to keep app/UI/resource work future-only.
- OpenAI Apps SDK MCP server docs, `https://developers.openai.com/apps-sdk/concepts/mcp-server`: used to frame MCP list-tools, call-tools, structured content, optional component/resource metadata, Streamable HTTP and SSE transport families, and OAuth extensibility as future endpoint architecture inputs.
- OpenAI Apps SDK Authentication docs, `https://developers.openai.com/apps-sdk/build/auth`: used to frame future OAuth 2.1, protected-resource metadata, `WWW-Authenticate` challenges, scope enforcement, token refusal, and tool-level auth readiness only.
- OpenAI Apps SDK Deploy your app docs, `https://developers.openai.com/apps-sdk/deploy`: used to identify stable HTTPS `/mcp`, local tunnel, restart/refresh, hosting, TLS, logs, metrics, and rollout concerns as future deployment architecture gates.
- OpenAI Apps SDK Connect from ChatGPT docs, `https://developers.openai.com/apps-sdk/deploy/connect-chatgpt`: used to confirm the public connector URL is the server's public `/mcp` endpoint, and to frame Developer Mode connection, HTTPS reachability, tool-list refresh, payload inspection, and testing only.
- OpenAI Apps SDK Test your integration docs, `https://developers.openai.com/apps-sdk/deploy/testing`: used to define future MCP Inspector, raw request/response inspection, golden prompt, auth-flow, structured-content, widget, and regression testing gates only.
- OpenAI Apps SDK Security & Privacy guide, `https://developers.openai.com/apps-sdk/guides/security-privacy`: used to frame future least-privilege, explicit consent, defense-in-depth, audit logging, prompt-injection, malicious input, token rejection, logging redaction, and write-action gates.
- OpenAI Apps SDK Submit and maintain your app docs, `https://developers.openai.com/apps-sdk/deploy/submission`: used to keep organization verification, public domain, dashboard submission, OAuth credentials, screenshots, test prompts/responses, review, publishing, and maintenance future-only.
- OpenAI Apps SDK App submission guidelines, `https://developers.openai.com/apps-sdk/app-submission-guidelines`: used to frame publication trust, predictable tool behavior, correct read-only/destructive/open-world annotations, minimal inputs, auditability, screenshots, security, privacy, and submission requirements as a later submission lane.
- OpenAI API MCP docs, `https://developers.openai.com/api/docs/mcp`: used only as additional official context for remote MCP servers, read-only `search`/`fetch` data-only patterns, SSE example URLs, OAuth considerations, and custom MCP risk posture. Pocket CFO did not use the OpenAI API, vector stores, file search, or model calls.

OpenAI Developer Docs MCP tools were not exposed as callable read-only docs tools in this thread. OpenAI Platform key setup was exposed but was not used because this slice forbids API key setup and API/model calls.

## Route Ownership Decision

Decision: Outcome A - route owner can be safely named as documentation-only.

The future `/mcp` route owner family is exactly `apps/control-plane` Fastify route family.

The future route family is documentation-only: a later implementation plan may create a thin Fastify route adapter in `apps/control-plane`, but FP-0105 does not create it.

The future route file/path pattern is documentation-only: `apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts` plus adjacent `schema.ts`, `service.ts`, `formatter.ts`, and focused tests only if a later implementation plan opens that scope. This path pattern is not a route file in FP-0105 and must not be created by FP-0105.

Why this owner is safer than alternatives:

- `apps/control-plane` already owns HTTP route registration, service orchestration, source registry, Finance Twin, CFO Wiki, EvidenceIndex, evidence/proof surfaces, replay-aware workflows, and read-only mission/evidence modules.
- `apps/web` is the operator UI and read-model layer. It already has the local proof-only preview route boundary, but adding public ChatGPT-facing MCP transport there would mix public connector transport with UI rendering and read-model composition.
- A separate future MCP server package could isolate protocol transport, but no such package exists, it does not currently own source/evidence access, and introducing it would be new runtime/package architecture beyond this proof slice.
- Leaving route ownership unresolved is safer than guessing when current evidence is insufficient, but current repo architecture is sufficient to name `apps/control-plane` as the future owner while keeping implementation blocked.

Implementation remains blocked until a later implementation Finance Plan names exact route files, service boundaries, auth posture, logging/redaction, deployment host, health path, rollback mechanism, proof gates, and validation.

## Candidate Analysis

### `apps/control-plane` Fastify route family candidate

- Authority boundary: strongest fit. This family owns existing backend HTTP route registration and service orchestration.
- Source/evidence access boundary: strongest fit. This family already reaches source registry, evidence, Finance Twin, CFO Wiki, missions, monitoring, and replay-aware services.
- Finance Twin/CFO Wiki/EvidenceIndex access boundary: strongest fit because these services live in the control-plane bounded context today.
- Request/response envelope boundary: safe if route remains a thin adapter and delegates envelope construction to a dedicated service/formatter, using pure domain envelope contracts.
- Auth/token/session boundary: future-only. Any auth middleware, OAuth, token, or session code must be a later plan.
- Logging/redaction boundary: future-only but enforceable at the control-plane logging layer with explicit redaction of tokens, raw prompts, raw source files, private finance data, evidence dumps, cookies, sessions, OAuth material, provider credentials, object-store dumps, and database dumps.
- Route thinness: compatible with existing route style if route parses input, calls service, and serializes output only.
- Deployment boundary: future-only. The eventual public HTTPS `/mcp` host is a control-plane deployment concern, not FP-0105.
- Rollback boundary: safest fit because a later route registration can be isolated behind a single module and disabled or removed without touching UI components.
- Proofability: strongest fit because repo inventory scans can watch `apps/control-plane/src/modules/read-only-app-mcp-endpoint/**`, route registration, auth, deployment, and OpenAI/API/model patterns.
- Why no route may be added in FP-0105: FP-0105 is contract/proof work only and does not authorize route implementation.

### `apps/web` / Next.js route family candidate

- Authority boundary: weak fit. `apps/web` is operator UI and read models only.
- Source/evidence access boundary: weak fit. A public MCP endpoint here would need to reach control-plane state through another transport or duplicate backend behavior.
- Finance Twin/CFO Wiki/EvidenceIndex access boundary: weak fit. The web app consumes read models and local preview components; it is not the source/evidence authority.
- Request/response envelope boundary: possible in theory but would blur UI rendering, route handlers, and public connector transport.
- Auth/token/session boundary: risky because Next.js route handlers could tempt token/session handling into the UI app.
- Logging/redaction boundary: weaker than control-plane because existing logging/redaction and finance service boundaries are backend-oriented.
- Route thinness: possible but fragile because it may become a web API route around backend services.
- Deployment boundary: risky because app deployment and connector deployment would become coupled to UI hosting.
- Rollback boundary: weaker because route rollback could couple to web UI deployment.
- Proofability: weaker than control-plane because historical local preview route files are allowed and must remain distinct from public `/mcp` route handlers.
- Why no route may be added in FP-0105: FP-0105 is contract/proof work only and does not authorize web API or app route implementation.

### Separate future MCP server package candidate

- Authority boundary: unresolved. No package currently owns this runtime family.
- Source/evidence access boundary: unresolved. It would need new service boundaries or remote calls to control-plane state.
- Finance Twin/CFO Wiki/EvidenceIndex access boundary: unresolved because the package does not exist and has no access contract.
- Request/response envelope boundary: potentially clean protocol isolation, but only after a future architecture plan creates package ownership.
- Auth/token/session boundary: unresolved and would require a new security boundary.
- Logging/redaction boundary: unresolved and would require new shared logging/redaction contracts.
- Route thinness: potentially strong, but speculative without a package.
- Deployment boundary: separate deployment could be clean, but it is new deployment architecture.
- Rollback boundary: separate rollback could be clean, but it is new deployment architecture.
- Proofability: good only after package exists; today it would widen scope.
- Why no route may be added in FP-0105: FP-0105 is contract/proof work only and does not authorize remote MCP server implementation, package creation, route implementation, or deployment.

### Keeping route ownership unresolved

- Authority boundary: safe fallback if current repo evidence were insufficient.
- Source/evidence access boundary: safe fallback because it blocks implementation.
- Finance Twin/CFO Wiki/EvidenceIndex access boundary: safe fallback because it avoids guessing.
- Request/response envelope boundary: remains blocked.
- Auth/token/session boundary: remains blocked.
- Logging/redaction boundary: remains blocked.
- Route thinness: remains blocked.
- Deployment boundary: remains blocked.
- Rollback boundary: remains blocked.
- Proofability: strong as a block but less useful than naming a safe owner.
- Why no route may be added in FP-0105: FP-0105 is contract/proof work only and route implementation is still blocked.

## Contract Boundaries

FP-0105 adds pure domain contracts and proof schemas for:

- `EndpointRouteOwnershipProofContract`
- `EndpointRouteOwnerCandidateAnalysisBoundary`
- `EndpointRouteOwnerDecisionBoundary`
- `EndpointTransportAdapterBoundary`
- `EndpointMcpPathContractBoundary`
- `EndpointHandlerThinAdapterBoundary`
- `EndpointServiceDispatchBoundary`
- `EndpointReadOnlyToolDispatchBoundary`
- `EndpointRequestResponseEnvelopeAdapterBoundary`
- `EndpointRefusalAdapterBoundary`
- `EndpointAuthBoundaryDeferredBoundary`
- `EndpointLoggingRedactionBoundary`
- `EndpointDeploymentDeferredBoundary`
- `EndpointRollbackReadinessBoundary`
- `EndpointNoRouteImplementationBoundary`
- `EndpointNoRuntimeImplementationBoundary`
- `EndpointNoOauthTokenSessionBoundary`
- `EndpointNoRemoteMcpServerBoundary`
- `EndpointNoAppsSdkResourceBoundary`
- `EndpointNoOpenAiApiModelCallsBoundary`
- `EndpointRouteOwnershipProof`

The contracts must prove:

- `/mcp` is the only future public ChatGPT-facing endpoint path currently named.
- Route owner is exactly decided as `apps/control-plane` Fastify route family, documentation-only.
- Route implementation is still not authorized.
- No route file exists from FP-0105.
- No web API/backend/control-plane route is added from FP-0105.
- No endpoint runtime is added from FP-0105.
- No remote MCP server implementation is added.
- No OAuth/token/session implementation is added.
- No Apps SDK resource implementation is added.
- No public app implementation is added.
- No app submission/public assets/listing copy/screenshots are added.
- No generated images are added.
- No listing copy is added.
- No app-submission artifacts are added.
- No OpenAI API/model/client/key usage is added.
- No source mutation or finance write is added.
- No write-action tool exposure is added.
- Future transport adapter remains documentation/proof-only.
- Future handler must be a thin adapter, not finance logic.
- Future service dispatch must stay read-only and evidence-backed.
- Future tool dispatch must use the exact V2G read-only allowlist.
- Future response envelope must preserve evidence, anchors, freshness, limitations, refusal reason, permitted next actions, and capability boundary fields.
- Future logging must redact tokens, raw prompts, raw source files, private finance data, evidence dumps, cookies, sessions, OAuth material, provider credentials, object-store dumps, and database dumps.
- Deployment, rollback, and health path remain future-only.

## Proof-Gate Bridge

The bridge must prove:

- exactly one FP-0105 file may exist at `plans/FP-0105-read-only-chatgpt-app-mcp-endpoint-route-ownership-transport-adapter-proof-contracts.md`
- FP-0105 is local/proof-only route ownership and transport-adapter contracts only
- FP-0105 does not authorize endpoint implementation, route implementation, web API/backend/control-plane routes, remote MCP implementation/deployment, OAuth/token/session implementation, Apps SDK iframe/resource registration, public app implementation, app submission, provider/certification/deployment, OpenAI API/model calls, source mutation, finance writes, generated product prose, runtime-Codex finance output, autonomous action, screenshots, generated images, public assets, listing copy, or app-submission artifacts
- FP-0106 remains absent
- existing FP-0104 endpoint implementation readiness boundary remains intact
- existing FP-0103 endpoint architecture proof-contract boundary remains intact
- existing FP-0102 architecture planning boundary remains intact
- existing FP-0101 implementation-sequencing boundary remains intact
- existing FP-0100 local security boundary contract foundation remains intact
- existing FP-0099/0098 public-app planning boundaries remain intact
- existing FP-0087 descriptor/envelope boundary remains intact
- public app implementation and public app submission remain future-only

Machine-readable proof fields should include:

- `fp0105AbsentOrLocalEndpointRouteOwnershipTransportAdapterContractsVerified`
- `fp0106Absent`
- `endpointRouteOwnershipProofContractsFoundationVerified`
- `endpointRouteOwnerCandidateAnalysisVerified`
- `endpointRouteOwnerDecisionOrImplementationBlockedVerified`
- `endpointTransportAdapterContractVerified`
- `noEndpointImplementationFromFp0105`
- `noRouteImplementationFromFp0105`
- `noApiBackendRoutesFromFp0105`
- `noOauthTokenSessionImplementationFromFp0105`
- `noRemoteMcpImplementationOrDeploymentFromFp0105`
- `noAppsSdkResourceFromFp0105`
- `noAppSubmissionFromFp0105`
- `noOpenAiApiCallsFromFp0105`
- `noSourceMutationFinanceWriteFromFp0105`
- `noPublicAssetsSubmissionArtifactsFromFp0105`
- `endpointRuntimeRepositoryInventoryStillVerified`
- `fp0104EndpointReadinessBoundaryStillVerified`
- `fp0103EndpointArchitectureProofContractsStillVerified`
- `fp0100PublicSecurityBoundaryStillVerified`

## Required Direct Proof

Add `tools/read-only-endpoint-route-ownership-proof.mjs`.

It must print machine-readable JSON and fail if any boolean is false. The JSON must include at least:

- `schemaVersion`
- `localProofOnly`
- `endpointRouteOwnershipProofContractsVerified`
- `endpointRouteOwnerCandidateAnalysisVerified`
- `endpointRouteOwnerDecisionBoundaryVerified`
- `endpointRouteOwnerDecidedOrImplementationBlockedVerified`
- `futureMcpPathBoundaryVerified`
- `endpointTransportAdapterBoundaryVerified`
- `endpointHandlerThinAdapterBoundaryVerified`
- `endpointServiceDispatchBoundaryVerified`
- `endpointReadOnlyToolDispatchBoundaryVerified`
- `endpointRequestResponseEnvelopeAdapterBoundaryVerified`
- `endpointRefusalAdapterBoundaryVerified`
- `endpointAuthBoundaryDeferredVerified`
- `endpointLoggingRedactionBoundaryVerified`
- `endpointDeploymentDeferredBoundaryVerified`
- `endpointRollbackReadinessBoundaryVerified`
- `noEndpointImplementation`
- `noRouteImplementation`
- `noWebApiBackendControlPlaneRouteImplementation`
- `noRemoteMcpServerImplementation`
- `noOauthTokenSessionImplementation`
- `noAppsSdkResourceImplementation`
- `noPublicChatGptAppImplementation`
- `noAppSubmission`
- `noPublicAssets`
- `noListingCopy`
- `noOpenAiApiCalls`
- `noModelCalls`
- `noOpenAiClientOrKeyUsage`
- `noSourceMutation`
- `noFinanceWrite`
- `noWriteActionTools`
- `endpointRuntimeRepositoryInventoryVerified`
- `fp0105BoundaryVerified`
- `fp0106Absent`
- `fp0104EndpointReadinessBoundaryStillVerified`
- `fp0103EndpointArchitectureBoundaryStillVerified`
- `fp0100PublicSecurityBoundaryStillVerified`

## QA Scope

Allowed files are limited to the FP-0105 plan, pure domain route ownership and proof-contract files/specs, minimal existing proof-gate bridge fields/helpers/specs/tools, the new direct proof tool, and directly stale docs/plugin metadata named by this slice.

Forbidden scope remains:

- no product code
- no UI implementation
- no route code
- no app routes
- no web API routes
- no backend/control-plane routes
- no endpoints
- no remote MCP server
- no Apps SDK iframe/resource registration
- no OAuth
- no auth/session/token implementation
- no app submission
- no schema or migrations
- no package scripts
- no smoke commands
- no eval datasets
- no fixtures
- no sample data
- no public demo data
- no public source packs
- no source-pack fixture edits
- no FP-0106
- no OpenAI API/model call
- no `OPENAI_API_KEY` use
- no provider integration, certification, OCR/vector/PageIndex/OpenAI file-search, iOS/OpenClaw, deployment, external communications, source mutation, finance writes, generated product prose, runtime-Codex finance output, or autonomous action
- no screenshots, generated images, Figma exports, public listing assets, public app assets, app-submission assets, or listing copy

## Validation

Run:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

If validation fails, do not widen scope. Do not add route/runtime. Do not add endpoints. Do not add OAuth. Do not add token/session implementation. Do not add remote MCP. Do not add Apps SDK resources. Do not add data files. The smallest safer corrective slice is one of:

- FP-0105 endpoint route ownership proof-contract correction
- FP-0104 endpoint readiness proof-gate correction
- FP-0103 endpoint architecture proof-contract correction
- FP-0100 security boundary proof correction
- FP-0087 descriptor/envelope correction
- hold endpoint route ownership contracts until local endpoint readiness contracts can be proven

Do not publish a partially green branch.

## Decision Log

Decision: Name `apps/control-plane` Fastify route family as the future `/mcp` route owner, documentation-only.
Rationale: the current repository architecture places source registry, evidence/proof, Finance Twin, CFO Wiki, mission, monitoring, replay-aware services, and backend HTTP route registration in `apps/control-plane`. This owner can keep a future route thin and service-backed without pushing public connector transport into the UI app or inventing a new runtime package.

Decision: Name `/mcp` as the only future public ChatGPT-facing endpoint path currently named.
Rationale: FP-0104 already proved `/mcp` from official docs. FP-0105 preserves that inventory and names no additional public path.

Decision: Keep the future private health path unresolved and future-only.
Rationale: health path naming is deployment/runtime implementation detail. FP-0105 must not create a health route.

Decision: Keep transport adapter documentation/proof-only.
Rationale: official docs support Streamable HTTP and SSE, with Streamable HTTP recommended, but no transport implementation, MCP server runtime, route handler, or deployment host is authorized here.

Decision: Future handler must be a thin adapter.
Rationale: route files must parse input, call a service, and serialize output only. Finance math, SQL, ingest logic, prompt building, evidence formatting, and source access must stay behind service/domain/repository boundaries.

Decision: Future service dispatch must be read-only and evidence-backed.
Rationale: public `/mcp` must expose only the exact V2G read-only tool allowlist and must preserve evidence, anchors, freshness, limitations, refusal reason, permitted next actions, and capability boundary fields.

Decision: Auth, OAuth, token, and session handling remain deferred.
Rationale: official docs make OAuth/auth a distinct implementation/security surface. FP-0105 can define the boundary but cannot implement auth middleware, OAuth metadata, token exchange, sessions, cookies, or secret handling.

Decision: Logging and redaction are a future proof gate.
Rationale: future logs must redact tokens, raw prompts, raw source files, private finance data, evidence dumps, cookies, sessions, OAuth material, provider credentials, object-store dumps, and database dumps before any route implementation starts.

Decision: FP-0106 remains absent.
Rationale: this slice must close as FP-0105 only. A next plan may be created only after this branch is shipped and green.

Decision: Keep closeout as documentation-only and rerun validation after this final closeout edit.
Rationale: the final closeout updates plan truth but does not change contracts or runtime posture. The same branch must rerun `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` after this edit before commit.

## Closeout

FP-0105 shipped the local/proof-only/read-only endpoint route ownership and transport-adapter proof-contract foundation for the future public ChatGPT App/MCP `/mcp` path.

Verdict: Outcome A is decided. The documentation-only future `/mcp` route owner family is `apps/control-plane` Fastify. The documentation-only future path pattern is `apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts` plus adjacent schema/service/formatter/tests only if a later implementation Finance Plan opens that scope. Endpoint implementation remains blocked.

Implemented contracts: pure domain contracts now cover route owner candidate analysis, route owner decision or implementation block, transport-adapter boundary, `/mcp` path boundary, thin handler adapter, read-only service dispatch, exact V2G read-only tool dispatch, request/response/refusal envelope preservation, auth deferral, logging redaction, deployment deferral, rollback readiness, no-route/no-runtime posture, no OAuth/token/session, no remote MCP server, no Apps SDK resource, no OpenAI API/model/client/key use, no source mutation, no finance write, and no write-action tools.

Proof-gate bridge: existing FP-0104, FP-0103, FP-0102, FP-0101, FP-0100, FP-0099, FP-0098, FP-0087, V2F, and V2G boundaries remain intact while accepting exactly one FP-0105 plan file and rejecting FP-0106.

Validation completed before this closeout edit:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

Strict QA: changed files are limited to docs, plans, pure domain contracts/specs, proof-gate bridge helpers/specs, and proof tools. No app route, web API route, backend/control-plane route, endpoint, remote MCP server, OAuth, token/session implementation, Apps SDK resource, public app behavior, app submission, schema, migration, package script, eval dataset, fixture, sample data, public demo data, source pack, OpenAI API/model call, OCR/vector/PageIndex/file-search, provider/certification/deployment, external communication, source mutation, finance write, generated product prose, runtime-Codex finance output, autonomous action, screenshot binary, generated image asset, public asset, listing copy, app-submission artifact, or FP-0106 was added.

Surprises: OpenAI Developers read-only docs tools were not exposed in this thread, so official OpenAI web docs were used. No implementation blocker was found after PR #268/FP-0104 was confirmed merged and shipped.

Remaining work: endpoint implementation must wait for a later implementation Finance Plan. That later plan must name exact route files, auth posture, logging/redaction implementation, deployment host, health path, rollback mechanism, proof gates, and validation. Public ChatGPT App submission must wait.

## Next Recommendation

Endpoint implementation should not start from FP-0105 alone until this contract/proof branch is green and shipped. If green, the next narrow plan may be an implementation-readiness correction or the first endpoint implementation plan that creates exactly one thin `apps/control-plane` Fastify `/mcp` route adapter with auth/logging/deployment/rollback proof gates. Public ChatGPT App submission should wait.
