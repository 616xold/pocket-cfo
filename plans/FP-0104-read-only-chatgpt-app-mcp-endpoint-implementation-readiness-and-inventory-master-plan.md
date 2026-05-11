# FP-0104 - Read-only ChatGPT App MCP Endpoint Implementation Readiness and Inventory Master Plan

## Purpose / Big Picture

Target phase: `V2X`.

Exact slice: `V2X-read-only-chatgpt-app-mcp-endpoint-implementation-readiness-and-inventory-master-plan-local-v1`.

Status: shipped docs-and-plan plus proof-gate compatibility endpoint implementation readiness and exact future endpoint inventory master plan.

FP-0104 is not implementation. FP-0104 is docs-and-plan plus proof-gate compatibility only. FP-0104 plans endpoint implementation readiness and exact future endpoint inventory only. FP-0104 does not authorize endpoint implementation. FP-0104 does not authorize route implementation. FP-0104 does not authorize web API/backend/control-plane route implementation. FP-0104 does not authorize OAuth/token/session implementation. FP-0104 does not authorize remote MCP server implementation or deployment. FP-0104 does not authorize Apps SDK iframe/resource implementation. FP-0104 does not authorize public ChatGPT App implementation. FP-0104 does not authorize app submission, screenshots, listing copy, public assets, app-submission artifacts, or generated public assets. FP-0104 does not authorize OpenAI API/model calls.

This is planning plus proof-gate compatibility only. This is not endpoint implementation. This is not route implementation. This is not web API route implementation. This is not backend/control-plane route implementation. This is not OAuth implementation. This is not token/session implementation. This is not remote MCP server implementation. This is not remote MCP deployment. This is not Apps SDK iframe/resource implementation. This is not public ChatGPT App implementation. This is not app submission. This is not OpenAI API/model integration. This is not deployment. This is not product runtime behavior.

FP-0104 keeps FP-0105 absent. FP-0104 preserves FP-0103, FP-0102, FP-0101, FP-0100, FP-0099, FP-0098, FP-0087, V2F, and V2G proof boundaries. FP-0104 keeps public app implementation/submission future-only.

Why this slice exists: FP-0102 shipped docs/proof-only endpoint/OAuth/remote-MCP architecture and security-readiness planning. FP-0103 shipped local/proof-only/read-only endpoint architecture proof contracts and explicitly does not provide enough authority to start endpoint implementation. FP-0104 is the missing readiness bridge: it records the future endpoint inventory, ownership questions, request/response envelope requirements, auth boundary, transport boundary, failure/refusal posture, logging posture, deployment deferral, and proof gates that a later implementation lane must satisfy before any route or endpoint file can be added.

Replay and evidence-bundle implications: this slice creates no mission state transition, ingest action, report action, approval, durable product finance output, source mutation, Finance Twin write, CFO Wiki write, evidence bundle, provider job, certification record, delivery record, endpoint, backend route, remote MCP server, Apps SDK resource, app submission, or app/MCP runtime behavior. No replay event is added because this is docs-and-plan plus proof-gate compatibility only.

## Progress

- [x] 2026-05-11T00:00:00Z - Invoked the requested Pocket CFO operator skills before work: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor.
- [x] 2026-05-11T00:00:00Z - Confirmed GitHub Connector Guard is out of scope because GitHub connector product behavior is not part of this slice.
- [x] 2026-05-11T00:00:00Z - Ran preflight against fetched `origin/main` on branch `codex/v2x-read-only-chatgpt-app-mcp-endpoint-implementation-readiness-and-inventory-master-plan-local-v1`; the repo started clean, `HEAD` matched `origin/main`, GitHub auth/repo access worked, PR #267 was merged, Docker Postgres/MinIO/OTel services were available, FP-0103 existed and shipped, FP-0104 was absent, FP-0105 was absent, and required proof tools existed.
- [x] 2026-05-11T00:00:00Z - Read the required active docs, shipped FP-0103/0102/0101/0100/0099/0098/0087 records, plugin notes, package metadata, endpoint architecture contracts, public-app proof gates, security/demo docs, roadmap, and active boundary docs before edits.
- [x] 2026-05-11T00:00:00Z - Ran all nine baseline proof gates before edits; they passed and proved `fp0104Absent: true`, which is the expected pre-edit state before this docs-only successor.
- [x] 2026-05-11T00:00:00Z - Used official OpenAI web docs only as current read-only Apps SDK/MCP/auth/deployment/testing/security/submission context and made no OpenAI API/model calls.
- [x] 2026-05-11T00:00:00Z - Created this FP-0104 plan as the only allowed FP-0104 file.
- [x] 2026-05-11T00:00:00Z - Added the proof-gate bridge so exactly this FP-0104 docs-only readiness plan is accepted while FP-0105 remains absent and endpoint/OAuth/token/session/remote-MCP/Apps-SDK/runtime/public-app implementation remains rejected.
- [x] 2026-05-11T00:00:00Z - Applied same-branch FP-0103 proof-durability polish by adding durable repository-inventory protection alongside the existing branch-diff scan.
- [x] 2026-05-11T00:00:00Z - Refreshed directly stale active docs and plugin notes that mention the latest public-app endpoint readiness state.
- [x] 2026-05-11T00:00:00Z - Ran strict same-branch QA and confirmed the changed files are limited to docs, proof-gate tooling, and domain proof contracts/specs; no FP-0105, route, endpoint, OAuth, token/session, remote-MCP, Apps SDK resource, app-submission, asset, fixture, schema, migration, source mutation, finance write, or OpenAI API/model scope was added.
- [x] 2026-05-11T00:00:00Z - Ran the full final validation stack before this closeout edit: `git diff --check`, all nine proof tools, focused domain specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed. Because this closeout is a post-validation doc edit, the required post-closeout tail validation must pass before commit, push, and PR creation.

## Surprises & Discoveries

Baseline proof gates intentionally proved `fp0104Absent: true`. That was correct before this slice. FP-0104 must replace the hard FP-0104 absence rule with an exact docs-only endpoint implementation readiness allowance while preserving FP-0105 absence.

OpenAI Developer Docs MCP tooling was not exposed as a callable read-only docs MCP tool in this thread. The exposed OpenAI Platform tool was API-key setup only, so it was not used. Official OpenAI web docs were used directly. No OpenAI Platform key setup was used. No OpenAI API key was used.

Official OpenAI Apps SDK docs make one endpoint path safe to name for future public connector readiness: the public MCP endpoint is `/mcp`, and deployment guidance expects a stable HTTPS endpoint with low-latency streaming responses on `/mcp`. Official docs do not decide Pocket CFO route ownership, package placement, internal service boundary, or private health path. Therefore FP-0104 names the future ChatGPT-facing endpoint path while keeping route ownership and health-path implementation blocked until a later implementation plan binds those details.

## Decision Log

Decision: FP-0104 is docs-and-plan plus proof-gate compatibility only.
Rationale: endpoint implementation must not start from FP-0103 alone, and this slice exists to define readiness gates before implementation.

Decision: FP-0104 does not authorize endpoint implementation, route implementation, web API route implementation, backend/control-plane route implementation, or app route implementation.
Rationale: all route surfaces are product runtime surfaces. A later implementation plan must name route ownership, runtime package, middleware, error handling, logging, auth boundary, replay implications, and proof gates before adding files.

Decision: the future ChatGPT-facing endpoint inventory can safely name exactly one public connector endpoint path: `/mcp`.
Rationale: current official Apps SDK deployment and connection docs refer to the public `/mcp` endpoint. Pocket CFO can use that as the future public MCP connector URL requirement without creating a route now.

Decision: the exact route owner and file placement cannot be named safely in FP-0104.
Rationale: current repo truth has `apps/web` local UI routes, `apps/control-plane` Fastify modules, and no public MCP runtime. Choosing Next.js, control-plane Fastify, a separate server package, or hosted adapter placement is implementation architecture work. Endpoint implementation must not start until a later plan names the route owner and why that layer is safe.

Decision: no public health endpoint is named in FP-0104.
Rationale: official docs require reliable hosting, logs, metrics, and stable HTTPS, but do not require a ChatGPT-facing health path. A later implementation plan may add a private health path only if it names ownership, auth exposure, logging, and proof gates.

Decision: OAuth/token/session remains future-only.
Rationale: user consent, admin consent, scope minimization, audience validation, expiry, refresh, revocation, token storage, missing/expired token refusal, and token logging boundaries require a dedicated implementation plan and threat review.

Decision: remote MCP implementation and deployment remain future-only.
Rationale: stable HTTPS host, TLS, streaming transport, observability, rate limits, CSP/CORS, rollback, abuse handling, and deployment ownership require a later implementation plan.

Decision: Apps SDK iframe/resource implementation remains future-only.
Rationale: UI resources, component bundles, CSP metadata, iframe behavior, screenshots, public assets, and app-submission artifacts belong to later resource/submission lanes.

Decision: existing V2G read-only tool allowlist remains exact.
Rationale: endpoint readiness must not expose write/modify/action tools or renamed equivalents. `search_evidence`, `fetch_evidence_card`, `fetch_source_anchor`, `fetch_document_map`, `fetch_source_coverage`, `fetch_company_posture`, and `fetch_capability_boundaries` remain the only future read-only tool families.

Decision: endpoint implementation must not start next from FP-0104 alone if proof gates are red or if route ownership remains unnamed.
Rationale: FP-0104 is an implementation-readiness plan, not an implementation authorization. The next implementation lane must still be narrow, named, and proof-gated.

## Context and Orientation

FP-0104 sits after these shipped public-app boundaries:

- FP-0087: local proof-only read-only ChatGPT App/MCP contract and descriptor/envelope foundation.
- FP-0098: docs-only public-app readiness/security/submission-boundary planning.
- FP-0099: docs-only public-app security threat-model/platform-boundary planning.
- FP-0100: local/proof-only public-app security boundary contracts.
- FP-0101: docs-only public-app implementation sequencing/platform-readiness planning.
- FP-0102: docs/proof-only endpoint/OAuth/remote-MCP architecture and security-readiness planning.
- FP-0103: local/proof-only/read-only endpoint architecture proof contracts.

FP-0104 is not a successor implementation. It is the endpoint implementation readiness and exact future endpoint inventory planning gate. It keeps public app implementation, public app submission, endpoint runtime, route runtime, OAuth/token/session, remote MCP, Apps SDK resources, deployment, and public assets future-only.

Authority lanes remain unchanged:

- raw sources remain authoritative for document claims
- Finance Twin remains authoritative for structured finance facts
- CFO Wiki remains compiled and derived
- EvidenceIndex remains the source anchor, document map, evidence card, source coverage, freshness, and limitation layer
- V2C tools remain local/internal read-only evidence contracts
- V2D Atlas remains visualization-only
- V2E orchestration remains local/internal proof-only bounded orchestration
- V2F benchmark/community proof contracts remain docs/proof-only with no datasets or real finance data
- V2G app/MCP descriptors/envelopes remain local/proof-only and read-only
- FP-0100/0101/0102/0103 public-app security, sequencing, architecture, and proof-contract boundaries remain intact

## Plan of Work

Allowed files for this slice are this plan, directly stale active docs/plugin notes, pure domain endpoint architecture proof fields/specs/helpers, minimal V2F/V2G/FP-0100/FP-0101/FP-0102/FP-0103 proof-gate bridge surfaces, and direct proof tooling.

Forbidden behavior:

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
- no package scripts or smoke aliases
- no eval datasets
- no fixtures
- no sample data
- no public demo data
- no public source packs
- no source-pack mutation
- no FP-0105
- no provider integration, certification, OCR, vector/file-search, PageIndex, iOS/OpenClaw, deployment, external communications, source mutation, finance writes, generated product prose, runtime-Codex finance output, or autonomous action
- no OpenAI API/model calls
- no screenshots
- no generated images
- no public assets
- no listing copy
- no app-submission artifacts

### Future Endpoint Inventory

Exact future ChatGPT-facing endpoint path that can be named from current repo truth and official docs:

| Path | Method | Transport | Request envelope | Response envelope | Auth requirement | Health path if any | Refusal/failure behavior | Logging posture | Owner lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/mcp` | `POST` for future Streamable HTTP MCP requests; `GET` only if the later transport choice requires a stream/session handshake | Streamable HTTP is the preferred future transport to justify in the implementation plan; HTTP+SSE remains a documented fallback family only | MCP request envelope for initialize/list-tools/call-tool, bounded to the exact read-only tool allowlist and schema-validated inputs | structured content preserving evidence, source anchors, freshness, limitations, refusal reason, permitted next actions, and capability boundary fields | future OAuth/token/session or explicit no-auth development posture must be named by a later implementation plan; FP-0104 implements none | no public health path is named in FP-0104; a later private health path may be proposed only with route ownership and exposure gates | missing evidence, missing citation, unsupported evidence, stale evidence, conflicting evidence, prompt injection, raw dump, write action, data exfiltration, and unsafe action requests fail closed | no token values, raw prompts, raw source files, private finance data, full evidence dumps, OpenAI API keys, cookies, sessions, or OAuth material in logs; future audit correlation must preserve proof boundaries | later endpoint implementation plan only |

Endpoint path naming beyond `/mcp` is blocked. Route file placement, runtime package, private health path, auth middleware, deployment host, transport implementation, and handler/service/repository ownership remain deferred. Endpoint implementation must not start until a later implementation plan names those details and passes the FP-0104 proof gates.

### Route Ownership and Placement

Future route family candidates are documentation only:

- `apps/control-plane` Fastify route family candidate, if the later plan decides the endpoint belongs beside finance evidence services and can preserve route thinness.
- `apps/web` or Next.js route family candidate, only if the later plan proves it is a safe transport adapter and not a UI/API leakage path.
- a separate remote MCP server package candidate, only if the later plan proves module ownership, deployment, logging, auth, and no-write boundaries.

No `apps/web/app` route may be created. No `apps/web/api` route may be created. No `apps/control-plane` route may be created. No `packages/api`, `packages/server`, `packages/backend`, or `packages/db` route/runtime file may be created. A later implementation plan must name route ownership and why that route layer is safe.

### Request and Response Envelope

Future endpoint responses must preserve evidence, source anchors, freshness, limitations, refusal reason, permitted next actions, and capability boundary fields. Missing evidence, missing citation, unsupported evidence, stale evidence, conflicting evidence, prompt injection, raw dump, write action, data exfiltration, and unsafe action requests must fail closed.

No raw full-file dump may be exposed. No generated finance advice may be emitted. No model output may become source truth. No write/modify/action tools may be reachable.

### Transport and TLS

Future transport choice remains documentation only. Streamable HTTP, HTTP+SSE, and MCP server transport details are official-doc context only in FP-0104. HTTPS/TLS/stable host remains future-only. Deployment remains future-only.

### Auth and OAuth

OAuth/token/session remains future-only. FP-0104 defines readiness questions only:

- What consent is required from users and admins?
- What scopes are strictly necessary?
- What audience claim binds tokens to the MCP resource?
- What expiry, refresh, revocation, and reauthorization behavior is required?
- Where are tokens stored, and how is storage encrypted or avoided?
- How do missing, expired, malformed, wrong-audience, or insufficient-scope tokens fail closed?
- Which token/session fields are forbidden from logs, UI props, evidence cards, proof output, screenshots, public assets, app-submission artifacts, and docs?

No auth flow, callback, token exchange, session handler, middleware, cookie, or secret handling may be implemented in FP-0104.

### Observability and Logging

Future endpoint logging posture is readiness-only. No telemetry implementation is authorized.

No token values, raw prompts, raw source files, private finance data, full evidence dumps, OpenAI API keys, cookies, sessions, OAuth material, provider credentials, object-store dumps, or database dumps may appear in logs. Future audit correlation must preserve evidence/proof boundaries and use bounded correlation IDs, not raw finance content.

### Tool Allowlist and Permanent Limits

The existing V2G read-only tool allowlist remains exact:

- `search_evidence`
- `fetch_evidence_card`
- `fetch_source_anchor`
- `fetch_document_map`
- `fetch_source_coverage`
- `fetch_company_posture`
- `fetch_capability_boundaries`

Future endpoint must not expose write/modify/action tools. No `create_mission`, `upload_source`, `update_ledger`, `send_report`, `provider_connect`, `certify_close`, `contact_customer`, payment, legal advice, audit opinion, tax filing, form POST/server action, or renamed equivalent may be reachable.

Permanent public-app limits:

- no source mutation
- no finance writes
- no external communications
- no provider calls
- no certification/delivery/deployment action
- no generated product prose
- no runtime-Codex finance output
- no autonomous action
- no public demo with real finance data
- no public source packs

### Proof-Gate Bridge

The minimum proof-gate bridge must prove:

- exactly one FP-0104 file may exist at `plans/FP-0104-read-only-chatgpt-app-mcp-endpoint-implementation-readiness-and-inventory-master-plan.md`
- FP-0104 is docs-and-plan only
- FP-0104 plans endpoint implementation readiness and exact future endpoint inventory only
- FP-0104 does not authorize endpoint implementation, route implementation, web API/backend/control-plane routes, OAuth/token/session implementation, remote MCP implementation/deployment, Apps SDK iframe/resource registration, public app implementation, app submission, provider/certification/deployment, OpenAI API/model calls, source mutation, finance writes, generated product prose, runtime-Codex finance output, autonomous action, screenshots, generated images, public assets, listing copy, or app-submission artifacts
- FP-0105 remains absent
- existing FP-0103 endpoint architecture proof-contract boundary remains intact
- existing FP-0102 architecture planning boundary remains intact
- existing FP-0101 implementation-sequencing boundary remains intact
- existing FP-0100 local security boundary contract foundation remains intact
- existing FP-0099/0098 public-app planning boundaries remain intact
- existing FP-0087 descriptor/envelope boundary remains intact
- public app implementation and public app submission remain future-only

Proof fields:

- `fp0104AbsentOrDocsOnlyEndpointImplementationReadinessBoundaryVerified`
- `fp0105Absent`
- `endpointImplementationReadinessPlanBoundaryVerified`
- `exactFutureEndpointInventoryReadinessVerified`
- `noEndpointImplementationFromFp0104`
- `noRouteImplementationFromFp0104`
- `noApiBackendRoutesFromFp0104`
- `noOauthTokenSessionImplementationFromFp0104`
- `noRemoteMcpImplementationOrDeploymentFromFp0104`
- `noAppsSdkResourceFromFp0104`
- `noAppSubmissionFromFp0104`
- `noOpenAiApiCallsFromFp0104`
- `noSourceMutationFinanceWriteFromFp0104`
- `noPublicAssetsSubmissionArtifactsFromFp0104`
- `endpointRuntimeChangedFilesVerified`
- `endpointRuntimeRepositoryInventoryVerified`
- `fp0103EndpointArchitectureProofContractsStillVerified`
- `fp0103EndpointArchitecturePostmergeProofDurabilityVerified`
- `fp0102EndpointOauthRemoteMcpArchitectureBoundaryStillVerified`
- `fp0101ImplementationSequencingBoundaryStillVerified`
- `fp0100PublicSecurityBoundaryStillVerified`

### FP-0103 Proof-Durability Polish

The endpoint architecture proof must keep the existing branch-diff scan for PR validation and add a durable repository-inventory scan that proves no public-app endpoint runtime inventory exists on `main` unless explicitly authorized by a later implementation plan.

The durable inventory scan must not blindly fail on unrelated historical app files. It must allow shipped non-public route surfaces and shipped local preview route surfaces while failing files that look like public-app/MCP endpoint implementation, OAuth/token/session implementation for the public app path, remote MCP server runtime, Apps SDK resource registration, public app submission assets, OpenAI API/model client usage, public-app source mutation, public-app finance write, public-app write-action tool exposure, public-app external communication, provider call, or deployment surface.

## Concrete Steps

1. Run preflight.
2. Read first files from the prompt and active docs spine.
3. Run baseline proof gates and confirm FP-0104 absence.
4. Use official OpenAI docs only for current endpoint/MCP/security/auth/deploy/submission context and record source names and purposes in this plan.
5. Create exactly one Finance Plan at `plans/FP-0104-read-only-chatgpt-app-mcp-endpoint-implementation-readiness-and-inventory-master-plan.md`.
6. Add the minimum proof-gate fields/builders/specs/tools so the exact FP-0104 docs-only readiness plan is accepted while FP-0105 remains absent.
7. Apply FP-0103 proof-durability polish in this same branch.
8. Refresh directly stale active docs and `plugins.md`.
9. Run focused validation.
10. Run strict same-branch QA over changed files, route/API/backend paths, runtime markers, asset paths, FP-0104/FP-0105 plan names, and forbidden platform/runtime terms.
11. Run final validation.
12. If a post-validation closeout edit is made, rerun the required final-tail validation.
13. Commit exactly once.

## Validation and Acceptance

Focused validation:

```bash
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
```

Strict same-branch QA:

- Confirm changed files are docs/proof-gate/domain-contract only.
- Confirm exactly one FP-0104 file exists at `plans/FP-0104-read-only-chatgpt-app-mcp-endpoint-implementation-readiness-and-inventory-master-plan.md`.
- Confirm FP-0105 remains absent.
- Confirm no app routes, web API routes, backend routes, control-plane routes, endpoints, schemas, migrations, packages, fixtures, datasets, samples, source packs, screenshots, images, public assets, listing copy, OpenAI API/model calls, OAuth, token/session implementation, remote MCP server/deployment, Apps SDK resources, app submission artifacts, provider/deployment, external communications, source mutation, finance writes, generated product prose, runtime-Codex finance output, autonomous action, or public app implementation.
- Confirm README/CODEX/START/ACTIVE_DOCS/PROJECT_STATE/V2_BOUNDARY/ROADMAP/security-demo docs are fresh if they mention latest endpoint readiness state.

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

- exactly one FP-0104 file exists at the planned path
- FP-0104 is docs-and-plan plus proof-gate compatibility only
- FP-0104 plans endpoint implementation readiness and exact future endpoint inventory only
- FP-0105 remains absent
- future ChatGPT-facing endpoint inventory names `/mcp` as the only safe public connector path while route ownership and health-path implementation remain deferred
- no endpoint implementation exists from this slice
- no route/app route/API/backend/control-plane route exists from this slice
- no OAuth/token/session implementation exists from this slice
- no remote MCP implementation/deployment exists from this slice
- no Apps SDK iframe/resource implementation exists from this slice
- no public ChatGPT App implementation or app submission exists from this slice
- no public assets, listing copy, screenshots, generated images, or app-submission artifacts exist from this slice
- no OpenAI API/model/client/key usage exists from this slice
- no source mutation, finance write, write-action tool, external communication, generated finance advice, provider call, certification, delivery, deployment, generated product prose, runtime-Codex finance output, or autonomous action exists from this slice
- FP-0103, FP-0102, FP-0101, FP-0100, FP-0099, FP-0098, FP-0087, V2F, and V2G proof boundaries remain intact

## Idempotence and Recovery

Rerunning this slice should find this exact FP-0104 file and update it rather than creating another FP-0104 or FP-0105.

If proof gates fail because FP-0104 is present, patch only the proof-gate bridge, endpoint architecture proof durability fields, direct proof command, or FP-0104 plan wording so the exact docs-only endpoint readiness and endpoint inventory plan is accepted. Do not widen into endpoint implementation, routes, OAuth, token/session handling, remote MCP server implementation, remote MCP deployment, Apps SDK resource implementation, public app implementation, app submission, provider, deployment, OpenAI API/model calls, source mutation, finance writes, generated product prose, runtime-Codex finance output, external communications, or autonomous action.

If validation fails, do not widen scope. Stop and report the exact failing command. The smallest safer corrective slice is one of:

- FP-0104 endpoint readiness proof-gate correction
- FP-0103 endpoint architecture proof-contract correction
- FP-0102 architecture proof-gate bridge correction
- FP-0100 security boundary proof correction
- FP-0087 descriptor/envelope correction
- hold endpoint readiness planning until local endpoint architecture contracts can be proven

Rollback is document/proof-contract/proof-gate only: remove or correct the FP-0104 plan and proof-gate bridge fields if they accidentally authorize implementation or accept extra successor files.

## Artifacts and Notes

This slice creates one planning artifact: `plans/FP-0104-read-only-chatgpt-app-mcp-endpoint-implementation-readiness-and-inventory-master-plan.md`.

Official OpenAI sources used as current read-only platform/security context:

- OpenAI Developer Mode / MCP apps in ChatGPT help, `https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta.svgz`: used to frame Developer Mode, MCP app creation, endpoint metadata, auth mechanism selection, write-action confirmation risk, admin controls, and safety responsibilities as future-only readiness gates.
- OpenAI Apps SDK docs, `https://developers.openai.com/apps-sdk/`: used to confirm Apps SDK is the ChatGPT apps framework and to anchor Apps SDK/MCP as platform context only.
- OpenAI Apps SDK MCP server docs, `https://developers.openai.com/apps-sdk/concepts/mcp-server`: used to frame MCP list-tools, call-tools, structured content, component/resource metadata, Streamable HTTP/SSE transport families, and OAuth extensibility as future endpoint architecture inputs.
- OpenAI Apps SDK Authentication docs, `https://developers.openai.com/apps-sdk/build/auth`: used to frame future OAuth protected-resource metadata, `WWW-Authenticate` challenges, discovery documents, authorization-code PKCE flow, scope/audience enforcement, token refusal, and tool-level auth readiness only.
- OpenAI Apps SDK Deploy your app docs, `https://developers.openai.com/apps-sdk/deploy`: used to identify a stable HTTPS `/mcp` endpoint, low-latency streaming, TLS, logs, and metrics as future deployment architecture gates.
- OpenAI Apps SDK Connect from ChatGPT docs, `https://developers.openai.com/apps-sdk/deploy/connect-chatgpt`: used to name the future public connector URL as `/mcp`, and to frame Developer Mode connection, HTTPS reachability, tool-list refresh, payload inspection, and testing only.
- OpenAI Apps SDK Test your integration docs, `https://developers.openai.com/apps-sdk/deploy/testing`: used to define future MCP Inspector, raw request/response inspection, golden prompt, auth-flow, structured-content, widget, and regression testing gates only.
- OpenAI Apps SDK Security & Privacy guide, `https://developers.openai.com/apps-sdk/guides/security-privacy`: used to frame future least-privilege, explicit consent, defense-in-depth, audit logging, prompt-injection, malicious input, token rejection, logging redaction, and write-action gates.
- OpenAI Apps SDK Submit and maintain your app docs, `https://developers.openai.com/apps-sdk/deploy/submission`: used to keep organization verification, public domain, CSP, dashboard submission, OAuth credentials, screenshots, test prompts/responses, review, publishing, and maintenance future-only.
- OpenAI Apps SDK App submission guidelines, `https://developers.openai.com/apps-sdk/app-submission-guidelines`: used to frame publication trust, predictable tool behavior, correct read-only/destructive/open-world annotations, minimal inputs, auditability, screenshots, security, privacy, and submission requirements as a later submission lane.
- OpenAI API MCP docs, `https://developers.openai.com/api/docs/mcp`: used only as additional official context for remote MCP servers, read-only `search`/`fetch` data-only patterns, SSE example URLs, OAuth considerations, and custom MCP risk posture. Pocket CFO did not use the OpenAI API, vector stores, file search, or model calls.

No screenshots, generated images, Figma exports, public listing assets, public app assets, app-submission assets, sample data, fixtures, eval datasets, source packs, schemas, migrations, package scripts, or smoke aliases are created. No listing copy and no app-submission artifacts are created or authorized.

No runtime interfaces are added. No HTTP routes, web API routes, backend/control-plane routes, app routes, remote MCP server, Apps SDK iframe/resource, OAuth flow, token/session handler, app submission packet, OpenAI API client, model client, provider connector, deployment path, source ingest path, Finance Twin write path, CFO Wiki write path, EvidenceIndex mutation path, or evidence-bundle interface is added.

GitHub connector product behavior is out of scope. Routine `git` and `gh` CLI operations for repository metadata, commit, push, and PR creation are repository workflow only, not product connector behavior.

## Interfaces and Dependencies

FP-0104 touches only docs, pure domain proof contracts, proof-gate compatibility surfaces, and direct proof tooling.

It depends on:

- shipped FP-0103 local/proof-only/read-only endpoint architecture proof contracts
- shipped FP-0102 docs/proof-only endpoint/OAuth/remote-MCP architecture and security-readiness planning
- shipped FP-0101 public-app implementation sequencing/platform-readiness planning
- shipped FP-0100 local/proof-only public-app security boundary contracts
- shipped FP-0099 public-app security threat-model/platform-boundary planning
- shipped FP-0098 public-app readiness/security/submission-boundary planning
- shipped FP-0087 local proof-only read-only ChatGPT App/MCP contract and descriptor/envelope foundation
- shipped V2F benchmark/community no-real-finance-data and no-runtime posture
- official OpenAI docs used as read-only platform context
- the existing proof tools and focused domain specs

No new environment variables are introduced. No dependency is installed. No package script is added. No plugin install is required.

It does not add schema, migration, route, endpoint, app route, backend route, package script, smoke alias, fixture, sample data, eval dataset, source pack, Apps SDK resource, OAuth, token/session handling, remote MCP server, OpenAI API/model integration, or deployment dependency.

## Outcomes & Retrospective

FP-0104 closes as a docs-and-plan plus proof-gate compatibility endpoint implementation readiness and exact future endpoint inventory master plan only.

Outcome:

- FP-0104 exists as exactly one docs-only readiness plan at `plans/FP-0104-read-only-chatgpt-app-mcp-endpoint-implementation-readiness-and-inventory-master-plan.md`.
- Future ChatGPT-facing endpoint inventory names `/mcp` as the only safe public connector endpoint path from official docs.
- Route ownership, implementation placement, private health path, auth middleware, deployment host, and endpoint runtime remain blocked until a later implementation plan names them.
- Proof gates accept exactly this FP-0104 docs-only successor while rejecting FP-0105 and runtime/route/OAuth/token/session/remote-MCP/Apps-SDK/resource/submission/public-app implementation.
- FP-0103 endpoint architecture proof now has durable post-merge repository-inventory protection instead of relying only on branch-diff state.
- No endpoint, route, web API route, backend/control-plane route, OAuth flow, token/session handler, remote MCP server, Apps SDK iframe/resource, public ChatGPT App implementation, app submission, public asset, listing copy, screenshot, generated image, schema, migration, package script, fixture, sample data, source pack, OpenAI API/model call, provider/deployment action, external communication, source mutation, finance write, generated product prose, runtime-Codex finance output, autonomous action, or FP-0105 was created.

Retrospective:

- The useful narrowing move was separating the future public connector path (`/mcp`) from route ownership and implementation placement. Naming the path is safe from official docs; choosing the repo route layer is implementation architecture and remains blocked.
- The durable repository-inventory scan closes a proof gap that would otherwise appear after FP-0103 merged, when branch-diff-only proof could no longer see a historical runtime addition.
- Endpoint implementation should not start from this plan alone. The next implementation lane must be a narrow Finance Plan that names route ownership, transport, auth posture, logging redaction, deployment boundary, proof gates, and rollback before adding any route or endpoint file.
- Public ChatGPT App submission should wait until endpoint runtime, auth, Apps SDK resources, deployment, screenshots/assets, privacy/security checks, and submission artifacts are all opened by later named plans.
