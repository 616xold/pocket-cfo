# FP-0106 read-only ChatGPT App/MCP protocol envelope and tool-dispatch proof contracts

Status: shipped local/proof-only/read-only MCP protocol envelope and tool-dispatch proof-contract slice, created and closed 2026-05-11.

FP-0106 is not implementation. FP-0106 is local/proof-only/read-only MCP protocol envelope and tool-dispatch contract work. FP-0106 does not authorize endpoint implementation. FP-0106 does not authorize route implementation. FP-0106 does not authorize web API/backend/control-plane route implementation. FP-0106 does not authorize remote MCP server implementation or deployment. FP-0106 does not authorize OAuth/token/session implementation. FP-0106 does not authorize Apps SDK iframe/resource implementation. FP-0106 does not authorize public ChatGPT App implementation. FP-0106 does not authorize app submission, screenshots, listing copy, public assets, app-submission artifacts, or generated public assets. FP-0106 does not authorize OpenAI API/model calls.

FP-0106 defines future MCP protocol envelope and read-only tool-dispatch proof contracts only. FP-0106 keeps FP-0107 absent. FP-0106 preserves FP-0105, FP-0104, FP-0103, FP-0102, FP-0101, FP-0100, FP-0099, FP-0098, FP-0087, V2F, and V2G proof boundaries. FP-0106 keeps public app implementation/submission future-only. Public ChatGPT App implementation and public ChatGPT App submission remain future-only.

This is contract/proof work only.

This is not endpoint implementation. This is not route implementation. This is not web API route implementation. This is not backend/control-plane route implementation. This is not remote MCP server implementation. This is not remote MCP deployment. This is not OAuth implementation. This is not token/session implementation. This is not Apps SDK iframe/resource implementation. This is not public ChatGPT App implementation. This is not app submission. This is not OpenAI API/model integration. This is not deployment. This is not product runtime behavior.

No endpoint implementation is required. No route implementation is required. No OAuth implementation is required. No token/session implementation is required. No remote MCP implementation is required. No Apps SDK resource implementation is required. No app submission is required. No OpenAI API/model calls are required. No public assets/listing copy/screenshots are required. No finance write or source mutation is required. No screenshots, no generated images, no public assets, no listing copy, and no app-submission artifacts are created or authorized.

## Purpose

FP-0104 named `/mcp` as the only future public ChatGPT-facing endpoint path. FP-0105 named `apps/control-plane` Fastify as the documentation-only future route owner for `/mcp` while keeping route implementation blocked. FP-0106 closes the next proof gap before any actual Fastify route file can be created: it defines local proof contracts for the future protocol envelope, required future MCP/JSON-RPC method families, the `ping` liveness utility boundary, fail-closed method rejection, exact read-only tool dispatch, structured evidence response envelope, refusal/error envelope, auth deferral, logging redaction, and no-runtime/no-route posture.

Replay and evidence-bundle implications: this slice creates no mission state transition, ingest action, report action, approval, durable product finance output, source mutation, Finance Twin write, CFO Wiki write, EvidenceIndex mutation, evidence bundle, provider job, certification record, delivery record, endpoint, backend route, remote MCP server, Apps SDK resource, app submission, or app/MCP runtime behavior. No replay event is added because this is local/proof-only contract and proof-gate work only.

## Progress

- [x] 2026-05-11T14:32:58Z - Ran preflight against fetched `origin/main` on branch `codex/v2z-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts-local-v1`; `HEAD` matched `origin/main`, the tree was clean, GitHub auth/repo access worked, PR #269 was merged, Docker Postgres/MinIO/OTel services were available, FP-0105 existed and shipped, FP-0106 was absent, FP-0107 was absent, and required proof tools existed.
- [x] 2026-05-11T14:32:58Z - Loaded repo-local Pocket CFO operator skills: Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not used because GitHub connector product behavior is out of scope.
- [x] 2026-05-11T14:32:58Z - Ran the ten baseline proof gates before edits; the endpoint/public-app proof logs proved `fp0106Absent: true` as expected pre-edit state.
- [x] 2026-05-11 - Used official OpenAI web docs only as current read-only Apps SDK/MCP/server/auth/deploy/connect/test/security/submission context. No OpenAI Developers key setup was used, no OpenAI API key was used, and no OpenAI API/model call was made.
- [x] 2026-05-11 - Added pure domain MCP protocol envelope and tool-dispatch proof contracts plus focused protocol-envelope specs.
- [x] 2026-05-11 - Added `tools/read-only-mcp-protocol-envelope-proof.mjs` with machine-readable JSON and fail-closed boolean verification.
- [x] 2026-05-11 - Applied the minimum proof-gate bridge so exactly this FP-0106 local/proof-only protocol envelope and tool-dispatch contract foundation is accepted while FP-0107 remains absent.
- [x] 2026-05-11 - Refreshed directly stale README, CODEX, START, ACTIVE_DOCS, PROJECT_STATE, V2_BOUNDARY, ROADMAP, and plugin metadata for the FP-0106 boundary. Security/demo docs did not need wording changes from latest-state scans.
- [x] 2026-05-11 - Split the protocol-envelope contract surface into small constants, schema, type, builder, proof, and barrel modules to preserve modular code boundaries.
- [x] 2026-05-11 - Ran focused validation, strict same-branch QA, final validation, and closeout. Validation passed after one lint-only type-import correction in the new protocol-envelope type module.
- [x] 2026-05-11T15:40:03Z - Opened targeted post-merge FP-0106 hardening on branch `codex/v2z-read-only-chatgpt-app-mcp-protocol-envelope-ping-compatibility-hardening-local-v1`; preflight passed from shipped PR #270/main, FP-0106 exists and is shipped, FP-0107 is absent, required proof tools exist, Docker services and GitHub auth are available, and baseline proof gates passed before edits. The baseline protocol proof intentionally exposed the correction target: `ping` was still listed under rejected methods.
- [x] 2026-05-11T16:08:53Z - Completed the post-merge `ping` compatibility correction, directly stale docs/plugin refresh, and strict same-branch validation. The first `pnpm ci:repro:current` attempt exposed an unrelated timing edge in the large benchmark-community proof spec; the proof test now has an explicit timeout, and the full validation ladder passed before this closeout note. A minimum post-closeout gate rerun is required before commit because this plan was updated after validation.

## Official MCP And OpenAI Sources

Official Model Context Protocol sources used for this post-merge hardening:

- Model Context Protocol draft Ping utility page, `https://modelcontextprotocol.io/specification/draft/basic/utilities/ping`: used to correct the FP-0106 contract so `ping` is treated as an MCP-level liveness request that either party may send on an established connection, with a prompt empty JSON-RPC result required in a later route implementation, instead of a rejected method.
- Model Context Protocol draft Base Protocol overview, `https://modelcontextprotocol.io/specification/draft/basic`: used to keep the FP-0106 method boundary aligned with MCP JSON-RPC request/response/notification semantics while preserving local proof-only/no-route posture.

Official OpenAI sources used as current read-only platform/security context:

- OpenAI Developer Mode / MCP apps in ChatGPT help, `https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta`: used to frame Developer Mode, full MCP beta, endpoint metadata, auth mechanism selection, remote-server support, admin publishing/refresh controls, write-action confirmation risk, and safety responsibilities as future-only gates.
- OpenAI Apps SDK docs, `https://developers.openai.com/apps-sdk/`: used to confirm Apps SDK is the ChatGPT apps framework and to anchor Apps SDK/MCP as platform context only.
- OpenAI Apps SDK MCP Apps compatibility in ChatGPT docs, `https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt`: used for current ChatGPT app/MCP conceptual context and to keep app UI/resource work future-only.
- OpenAI Apps SDK MCP server docs, `https://developers.openai.com/apps-sdk/concepts/mcp-server`: used to frame MCP tool listing, tool calls, structured content, optional component/resource metadata, Streamable HTTP and SSE transport families, and OAuth extensibility as future protocol inputs.
- OpenAI Apps SDK Authentication docs, `https://developers.openai.com/apps-sdk/build/auth`: used to frame future OAuth 2.1, protected-resource metadata, challenges, scope enforcement, token refusal, and tool-level auth readiness only.
- OpenAI Apps SDK Deploy your app docs, `https://developers.openai.com/apps-sdk/deploy`: used to identify stable HTTPS `/mcp`, local tunnel, restart/refresh, hosting, TLS, logs, metrics, and rollout concerns as future deployment architecture gates.
- OpenAI Apps SDK Connect from ChatGPT docs, `https://developers.openai.com/apps-sdk/deploy/connect-chatgpt`: used to confirm the public connector URL is the server's public `/mcp` endpoint, and to frame Developer Mode connection, HTTPS reachability, tool-list refresh, payload inspection, and testing only.
- OpenAI Apps SDK Test your integration docs, `https://developers.openai.com/apps-sdk/deploy/testing`: used to define future MCP Inspector, raw request/response inspection, golden prompt, auth-flow, structured-content, widget, and regression testing gates only.
- OpenAI Apps SDK Security & Privacy guide, `https://developers.openai.com/apps-sdk/guides/security-privacy`: used to frame future least-privilege, explicit consent, defense-in-depth, audit logging, prompt-injection, malicious input, token rejection, logging redaction, and write-action gates.
- OpenAI Apps SDK Submit and maintain your app docs, `https://developers.openai.com/apps-sdk/deploy/submission`: used to keep organization verification, public domain, dashboard submission, OAuth credentials, screenshots, test prompts/responses, review, publishing, and maintenance future-only.
- OpenAI Apps SDK App submission guidelines, `https://developers.openai.com/apps-sdk/app-submission-guidelines`: used to frame publication trust, predictable tool behavior, correct read-only/destructive/open-world annotations, minimal inputs, auditability, screenshots, security, privacy, and submission requirements as a later submission lane.

OpenAI Developer Docs MCP tools were not exposed as callable read-only docs tools in this thread. OpenAI Platform key setup was not used because this slice forbids API key setup and API/model calls.

## Protocol Decisions

- `/mcp` remains the only future public ChatGPT-facing path.
- `POST /mcp` is the only future required public method for Streamable HTTP requests unless a later implementation Finance Plan proves a standards-required `GET /mcp` or session handshake from official protocol docs.
- `GET /mcp` remains future-only and blocked unless later required by official protocol docs.
- No route file may be created in FP-0106.
- No local or remote MCP server runtime may be added in FP-0106.
- Required future MCP/JSON-RPC message families are exactly `initialize`, `notifications/initialized` if protocol docs require it, `tools/list`, and `tools/call`. A health/metadata method remains future-only and may only be added by a later implementation plan if explicitly documented.
- The liveness utility method is `ping`. Per the official Model Context Protocol Ping utility spec, `ping` is a future protocol liveness request, not a rejected method and not a write/action/tool-dispatch method.
- A later route implementation must respond to a valid `ping` request on an established MCP session with an empty JSON-RPC result. `ping` remains unimplemented in this correction because no `/mcp` route exists and route implementation remains blocked.
- `ping` must not dispatch to tools, must not dispatch to evidence services, must not dispatch to Finance Twin, must not dispatch to CFO Wiki, must not trigger provider calls, must not create source mutation, must not create a finance write, must make no OpenAI API/model calls, and must create no external communications.
- All other methods must fail closed in the future route adapter, with `ping` handled only by the explicit liveness utility boundary. Unknown non-ping methods still fail closed.

## Tool Dispatch Decisions

The only future tool names allowed are the exact current V2G read-only allowlist:

- `search_evidence`
- `fetch_evidence_card`
- `fetch_source_anchor`
- `fetch_document_map`
- `fetch_source_coverage`
- `fetch_company_posture`
- `fetch_capability_boundaries`

Tool annotations must preserve read-only, no-destructive, no-open-world posture. Tool schemas must preserve evidence, freshness, limitations, and capability-boundary fields. Dynamic tools and tool drift remain forbidden.

Future tool calls must dispatch to read-only services only. No `create_mission`, `upload_source`, `update_ledger`, `send_report`, `provider_connect`, `certify_close`, `contact_customer`, payment, legal advice, audit opinion, tax filing, form POST/server action, or renamed equivalent may be reachable. Invalid tool names fail closed. Invalid arguments fail closed. Missing evidence or unsupported, stale, conflicting, or missing-citation evidence fails closed. No raw full-file dump may be returned. No generated finance advice may be emitted. No model output may become source truth.

## Response, Auth, And Logging Decisions

Future response envelopes must preserve evidence, source anchors, freshness, limitations, refusal reason, permitted next actions, and capability boundary fields. Future successful tool results must return structured content suitable for model/tool consumption and must not rely on freeform finance prose as source truth.

Future refusal/error responses must be structured and must not leak raw source files, token values, full evidence dumps, provider credentials, cookies, sessions, OAuth material, object-store dumps, database dumps, or private finance data.

OAuth/token/session remains future-only. FP-0106 may define tool-level auth policy questions only. No auth flow, callback, token exchange, session handler, middleware, cookie, or secret handling may be implemented.

Future logs must redact tokens, raw prompts, raw source files, private finance data, evidence dumps, cookies, sessions, OAuth material, provider credentials, object-store dumps, database dumps, and API keys. No telemetry implementation is authorized.

## Contract Boundaries

FP-0106 adds pure domain contracts and proof schemas for:

- `McpProtocolEnvelopeProofContract`
- `McpProtocolPathBoundary`
- `McpProtocolTransportBoundary`
- `McpProtocolAcceptedMethodsBoundary`
- `McpProtocolPingBoundary`
- `McpProtocolMethodCompatibilityWithOfficialSpecBoundary`
- `McpProtocolRejectedMethodsBoundary`
- `McpProtocolInitializeBoundary`
- `McpProtocolToolsListBoundary`
- `McpProtocolToolsCallBoundary`
- `McpProtocolReadOnlyToolAllowlistBoundary`
- `McpProtocolToolSchemaBoundary`
- `McpProtocolStructuredContentBoundary`
- `McpProtocolEvidenceEnvelopeBoundary`
- `McpProtocolRefusalEnvelopeBoundary`
- `McpProtocolArgumentValidationBoundary`
- `McpProtocolInvalidToolFailClosedBoundary`
- `McpProtocolAuthDeferredBoundary`
- `McpProtocolLoggingRedactionBoundary`
- `McpProtocolNoRouteImplementationBoundary`
- `McpProtocolNoRuntimeImplementationBoundary`
- `McpProtocolNoOpenAiApiModelCallsBoundary`
- `McpProtocolProof`

The contracts must prove:

- `/mcp` remains future-only and not implemented.
- No route file exists from FP-0106.
- No runtime endpoint was added from FP-0106.
- Accepted methods are exact and future-only.
- `ping` is an explicit future liveness utility method aligned with the official Model Context Protocol Ping utility spec.
- `ping` is not a rejected method.
- `ping` must require an empty JSON-RPC result in a later route implementation on an established MCP session.
- `ping` must not dispatch to tools, evidence services, Finance Twin, CFO Wiki, provider calls, source mutation, finance writes, OpenAI API/model calls, or external communications.
- `ping` remains unimplemented in this correction because no route exists.
- Rejected methods fail closed.
- Unknown non-ping methods still fail closed.
- Exact V2G read-only tool allowlist is preserved.
- Dynamic tools are forbidden.
- Invalid tool names fail closed.
- Invalid arguments fail closed.
- Evidence, freshness, limitations, refusal, permitted-next-action, and capability-boundary fields are required.
- No raw full-file dump is allowed.
- No generated finance advice is allowed.
- No source mutation or finance write is allowed.
- No write-action tools, provider calls, or external communications are allowed.
- No OAuth/token/session implementation is allowed.
- No remote MCP implementation/deployment is allowed.
- No Apps SDK resource implementation is allowed.
- No public app implementation is allowed.
- No app submission, public assets, listing copy, screenshots, or app-submission artifacts are allowed.
- No OpenAI API/model/client/key usage is allowed.
- Prior FP-0105, FP-0104, FP-0103, and FP-0100 boundaries remain intact.
- FP-0107 remains absent.

## Proof-Gate Bridge

The bridge must prove:

- Exactly one FP-0106 file may exist: `plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md`.
- FP-0106 is local/proof-only MCP protocol envelope and read-only tool-dispatch contracts only.
- FP-0106 does not authorize endpoint implementation, route implementation, web API/backend/control-plane routes, remote MCP implementation/deployment, OAuth/token/session implementation, Apps SDK iframe/resource registration, public app implementation, app submission, provider/certification/deployment, OpenAI API/model calls, source mutation, finance writes, generated product prose, runtime-Codex finance output, autonomous action, screenshots, generated images, public assets, listing copy, or app-submission artifacts.
- FP-0107 remains absent.
- Existing FP-0105 route ownership boundary remains intact.
- Existing FP-0104 endpoint implementation readiness boundary remains intact.
- Existing FP-0103 endpoint architecture proof-contract boundary remains intact.
- Existing FP-0102 architecture planning boundary remains intact.
- Existing FP-0101 implementation-sequencing boundary remains intact.
- Existing FP-0100 local security boundary contract foundation remains intact.
- Existing FP-0099/0098 public-app planning boundaries remain intact.
- Existing FP-0087 descriptor/envelope boundary remains intact.
- Public app implementation and public app submission remain future-only.

Machine-readable proof fields should include:

- `fp0106AbsentOrLocalMcpProtocolEnvelopeToolDispatchContractsVerified`
- `fp0107Absent`
- `mcpProtocolEnvelopeProofContractsFoundationVerified`
- `mcpProtocolAcceptedMethodsVerified`
- `mcpProtocolPingBoundaryVerified`
- `mcpProtocolMethodCompatibilityWithOfficialSpecVerified`
- `mcpProtocolReadOnlyToolDispatchVerified`
- `mcpProtocolEvidenceEnvelopeVerified`
- `mcpProtocolRefusalEnvelopeVerified`
- `noEndpointImplementationFromFp0106`
- `noRouteImplementationFromFp0106`
- `noApiBackendRoutesFromFp0106`
- `noOauthTokenSessionImplementationFromFp0106`
- `noRemoteMcpImplementationOrDeploymentFromFp0106`
- `noAppsSdkResourceFromFp0106`
- `noAppSubmissionFromFp0106`
- `noOpenAiApiCallsFromFp0106`
- `noSourceMutationFinanceWriteFromFp0106`
- `noPublicAssetsSubmissionArtifactsFromFp0106`
- `endpointRuntimeRepositoryInventoryStillVerified`
- `publicAppProofGateNoOpenAiApiSourceScanVerified`
- `fp0105RouteOwnershipBoundaryStillVerified`
- `fp0104EndpointReadinessBoundaryStillVerified`
- `fp0103EndpointArchitectureProofContractsStillVerified`
- `fp0100PublicSecurityBoundaryStillVerified`

## Required Direct Proof

Add `tools/read-only-mcp-protocol-envelope-proof.mjs`.

It must print machine-readable JSON and fail if any boolean is false. The JSON must include at least the direct protocol proof booleans for local proof-only posture, path, transport, required future methods, `ping` liveness boundary, official-spec method compatibility, rejected methods, initialize, tools/list, tools/call, allowlist, schemas, structured content, evidence envelope, refusal envelope, argument validation, invalid-tool fail-closed behavior, auth deferral, logging redaction, no endpoint/route/web API/backend/control-plane route/runtime, no remote MCP, no OAuth/token/session, no Apps SDK resource, no public app, no submission/public assets/listing copy, no OpenAI API/model/client/key usage, no source mutation, no finance write, no write-action tools, endpoint runtime inventory, proof-source scan, FP-0106 boundary, FP-0107 absence, and FP-0105/0104/0103/0100 boundary preservation.

## Validation Ladder

- Baseline before edits: existing ten proof tools must pass and prove FP-0106 absence.
- Focused validation: existing ten proof tools, new `tools/read-only-mcp-protocol-envelope-proof.mjs`, and the focused domain specs for benchmark, read-only app/MCP, descriptor, public security, endpoint architecture, endpoint route ownership, and protocol envelope.
- Strict same-branch QA: changed files must remain docs/proof-gate/domain-contract only, with no route/runtime/endpoint/schema/migration/package-script/fixture/data/public asset/OpenAI/OAuth/provider/deployment/external communication/source mutation/finance write/public-app scope.
- Final validation: `git diff --check`, all proof tools, focused domain specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

## Validation Results

- `git diff --check` passed.
- Existing ten proof tools passed.
- `pnpm exec tsx tools/read-only-mcp-protocol-envelope-proof.mjs` passed and printed all required booleans as `true`.
- Focused domain specs passed: `src/benchmark-community.spec.ts`, `src/read-only-app-mcp.spec.ts`, `src/read-only-app-mcp-descriptor.spec.ts`, `src/read-only-app-mcp-public-security.spec.ts`, `src/read-only-app-mcp-endpoint-architecture.spec.ts`, `src/read-only-app-mcp-endpoint-route-ownership.spec.ts`, and `src/read-only-app-mcp-protocol-envelope.spec.ts`.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed.
- Strict same-branch QA confirmed changed files are docs/proof-gate/domain-contract only, FP-0107 is absent, and no endpoint, route, OAuth/token/session, remote MCP, Apps SDK resource, public-app implementation, app-submission artifact, OpenAI API/model/key usage, source mutation, finance write, or public asset was added.
- Post-merge `ping` hardening validation reran the requested proof ladder after the timing fix: `git diff --check`, all eleven requested proof tools, focused domain specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` passed before this closeout note.

## Decision Log

- 2026-05-11 - FP-0106 starts from shipped FP-0105 and keeps route implementation blocked. The slice defines protocol envelope and read-only tool-dispatch proof contracts only.
- 2026-05-11 - Official OpenAI docs are used only as read-only context. No OpenAI API/model/key setup is part of this plan.
- 2026-05-11 - The future method posture is `POST /mcp` as the only required public method for Streamable HTTP unless a later plan proves an official requirement for `GET /mcp` or a session handshake.
- 2026-05-11 - The exact V2G read-only tool allowlist remains the only permitted future public tool surface. Dynamic tools and tool drift remain forbidden.
- 2026-05-11 - The FP-0106 proof surface was split across constants, schema, type, builder, proof, and barrel modules to keep the protocol contracts auditable and modular.
- 2026-05-11 - Proof-source hardening was added to the endpoint route ownership proof so executable OpenAI/API/model/key patterns are scanned across proof surfaces, not only changed paths.
- 2026-05-11T15:40:03Z - Post-merge MCP compatibility hardening corrects `ping` from rejected-method posture to explicit future liveness utility posture. `ping` remains no-route/no-runtime in FP-0106, must not dispatch to tools or mutate state, and a later route implementation must answer a valid `ping` request on an established MCP session with an empty JSON-RPC result.
- 2026-05-11T16:08:53Z - The benchmark-community proof spec now has an explicit timeout for its large cross-plan proof posture test because repro validation showed the default 5s Vitest timeout could fail despite the proof remaining valid.

## Surprises And Scope Notes

- The first lint pass caught type-only imports in the new protocol-envelope type module. That was corrected without widening scope, and validation was rerun.
- The first post-merge `pnpm ci:repro:current` run failed on a default-timeout edge in `src/benchmark-community.spec.ts`; the narrow timeout correction stayed inside the allowed proof-gate spec scope and full validation was rerun.
- Security and demo policy docs were refreshed only where directly stale for the shipped FP-0106 protocol envelope, `ping` liveness boundary, and proof-gate posture.
- No replay event was added because this slice creates no mission state change, ingest action, report action, endpoint, runtime, source mutation, finance write, approval, or durable finance output.

## Remaining Work

- Endpoint route implementation remains blocked until a later named implementation Finance Plan explicitly opens it.
- OAuth/token/session implementation, remote MCP deployment, Apps SDK resources, public ChatGPT App implementation, app submission, screenshots, public assets, listing copy, provider/certification/deployment work, OpenAI API/model integration, and public-app submission remain future-only.
- No FP-0107 exists after FP-0106 closeout.

## Open Questions

- Which exact auth mechanism, scopes, and protected-resource metadata will be required for a later public connector?
- Whether a future implementation must support any standards-required `GET /mcp` or health/session handshake in addition to `POST /mcp`.
- Which production host, deployment rollback, monitoring, and log-redaction implementation will own the eventual endpoint.

## Closeout Checklist

- [x] Direct proof tool added and green.
- [x] Existing proof gates accept exactly this FP-0106 slice and still reject FP-0107.
- [x] Focused domain specs green.
- [x] Strict same-branch QA confirms no forbidden implementation scope.
- [x] Final validation green.
- [x] Status updated to shipped and remaining work stated before commit.
