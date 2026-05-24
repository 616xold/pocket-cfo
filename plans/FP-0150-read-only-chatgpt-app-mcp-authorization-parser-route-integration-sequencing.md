# Harden read-only ChatGPT App MCP Authorization parser observation

## Purpose / Big Picture

Target phase: V2BR read-only ChatGPT App/MCP Authorization parser material-observation hardening and route-integration sequencing.

FP-0150 includes only pure-domain parser material-observation hardening and route-integration sequencing after the merged FP-0149 pure-domain parser implementation. This is not route integration. This is not `/mcp` route consumption. This is not production token validation, token parser implementation, JWT decoder implementation, JWKS fetching/caching implementation, token introspection implementation, OAuth implementation, token/session storage, auth middleware, provider selection implementation, provider integration, provider calls, DB/schema/package work, OpenAI API/model calls, source mutation, finance write, public ChatGPT App implementation, app submission, external communication, public asset work, generated public prose, or autonomous action.

The user-visible proof point is narrow: syntactically safe, non-empty, single-piece Bearer-scheme credential material is observed as Bearer-present without returning, retaining, normalizing, hashing, digesting, logging, forwarding, decoding, introspecting, or fingerprinting that material. Route integration remains future-only and must follow the sequence recorded here.

## Progress

- [x] 2026-05-24T14:55:19Z - Invoked the repo-local `pocket-cfo-codex-operator` Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-24T14:55:19Z - Preflight confirmed work on `codex/v2br-read-only-chatgpt-app-mcp-authorization-parser-material-observation-route-integration-sequencing-local-v1`, authenticated `gh`, PR #328 merged to `main`, current `HEAD` and `origin/main` at `bbefbbaf2f4bd65be96fbecf246eaca5120149b8`, local Postgres/object storage services available, FP-0149 present, FP-0150 absent before this plan, FP-0151 absent, and required proof tools present.
- [x] 2026-05-24T14:55:19Z - Baseline proof gates passed before edits for FP-0149, FP-0148, FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100.
- [x] 2026-05-24T14:55:19Z - Official MCP, RFC, and OpenAI Apps SDK docs were reviewed read-only as boundary context. OpenAI Developers tool discovery exposed only API-key setup surfaces, so no OpenAI key setup, OpenAI API call, or model call was used. ChatGPT Apps did not expose a separate callable read-only docs tool in this thread.
- [x] 2026-05-24T14:55:19Z - Created the FP-0150 plan and began the parser material-observation hardening, focused specs, direct route-integration sequencing proof, FP-0149 closeout freshness correction, and direct active-doc/plugin refresh.
- [x] 2026-05-24T15:19:16Z - Implemented the parser material-observation hardening, exact FP-0150 proof command, focused parser specs, FP-0149 closeout freshness correction, direct active-doc/plugin refresh, and proof-gate bridge compatibility.
- [x] 2026-05-24T15:19:16Z - Strict same-branch QA found narrow proof compatibility gaps in inherited FP-0143, FP-0142, and FP-0107 changed-path boundaries plus one case-sensitive FP-0150 plan-text assertion. Corrections stayed proof/spec-only and did not change route/runtime/provider behavior.
- [x] 2026-05-24T15:19:16Z - Final validation passed before this closeout edit: `git diff --check`, the direct FP-0150 proof, the full requested proof ladder, focused domain/control-plane Vitest suites, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`. Because this closeout edit is post-validation documentation, the required post-closeout checks must be rerun.
- [x] 2026-05-24T16:04:51Z - FP-0151 same-branch freshness polish confirmed PR #329 merged, head SHA `2fbc25f890bf3c5f7d842776610a0267d0e3bd11`, merge commit `a09c9b19975e6da1e21d386a16ccd2ff2406e988`, and current `origin/main` at the merge commit. GitHub static and integration-db checks were green. Same-branch QA found no issues and made no correction. No post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.

## Surprises & Discoveries

PR #328 is merged. `gh pr view 328` confirmed head SHA `fdde3b35f195bb357db175116c511fe6ab10868d` and merge commit `bbefbbaf2f4bd65be96fbecf246eaca5120149b8`.

PR #329 merged after FP-0150 closeout. `gh pr view 329` confirmed head SHA `2fbc25f890bf3c5f7d842776610a0267d0e3bd11` and merge commit `a09c9b19975e6da1e21d386a16ccd2ff2406e988`. `gh pr checks 329` confirmed GitHub static and integration-db checks were green. Same-branch QA found no issues and made no correction, so no post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.

FP-0149 closeout was stale after the merge. This branch patches that freshness issue directly and does not create a separate polish branch or post-merge QA branch.

The FP-0149 parser was safe for no-leakage tests but too sentinel-specific for future route-integration sequencing because only `[credential-present]` classified as Bearer-present while other syntactically safe single-piece material classified as a passthrough attempt.

OpenAI Developers exposed only API-key setup tools in this thread. Those tools were not used. Official public documentation was used read-only for protocol, security, and Apps SDK boundary context.

Inherited proof gates needed exact FP-0150 changed-path compatibility so older boundaries could distinguish parser material-observation hardening and route-integration sequencing from route/app/provider/runtime work. The corrections were limited to proof changed-path allowlists and a focused spec assertion.

## Decision Log

- 2026-05-24T14:55:19Z - Pure-domain parser material-observation hardening is included as a narrow correction.
- 2026-05-24T14:55:19Z - Route integration may not start after FP-0150. Only a future route-integration implementation-readiness or route-integration implementation slice may open if this sequencing plan remains green.
- 2026-05-24T14:55:19Z - `/mcp` route may not consume the parser in FP-0150.
- 2026-05-24T14:55:19Z - Production token-validation runtime cannot start after FP-0150.
- 2026-05-24T14:55:19Z - Provider selection cannot start after FP-0150; provider mode remains provider-neutral/deferred unless separate complete provider evidence exists. Provider calls and provider integration remain blocked.
- 2026-05-24T14:55:19Z - OAuth/session/auth middleware cannot start after FP-0150.
- 2026-05-24T14:55:19Z - Public ChatGPT App demo/submission cannot start after FP-0150.
- 2026-05-24T14:55:19Z - Future FP-0151 may open only route-integration implementation-readiness, parser material-observation correction, or proof-gate correction. It must not implement route integration unless FP-0150 proves readiness and FP-0151 explicitly authorizes that implementation.
- 2026-05-24T14:55:19Z - Parser output remains limited to FP-0146 sanitized fields and never returns raw header/token material, token-derived fingerprint, token prefix, token suffix, token length, token hash, token digest, token claims, decoded header, decoded payload, or normalized credential text.
- 2026-05-24T14:55:19Z - Test fixtures remain proof-only and may use bracketed safe sentinels such as `[credential-present]`, `[credential-present-alt]`, and `[passthrough-attempt]`. They must not include real token examples, JWT-like examples, realistic Bearer material, credential-looking alphanumeric examples, token echo, or token-derived fingerprints.

## Context and Orientation

FP-0149 shipped a pure-domain/local-only Authorization parser in `packages/domain`. It returns only FP-0146 sanitized output fields and is not wired into `/mcp`. Route integration, production token validation, token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth/session/auth middleware, provider selection/calls/integration, public ChatGPT App behavior, and app submission remain blocked.

Current runtime posture before and during FP-0150:

- `POST /mcp` remains the existing local route.
- GET `/mcp` remains unchanged.
- GET `/.well-known/oauth-protected-resource/mcp` remains unchanged.
- FP-0130 missing-token behavior remains separate.
- FP-0141/FP-0143 invalid-token behavior remains explicit local sanitized-envelope behavior only.
- FP-0139 result envelopes remain the only future validation output contract.
- FP-0146 sanitized parser contracts remain the parser output boundary.
- FP-0147 provider-selection evidence remains provider-neutral/deferred.
- No production token validation, token parser, JWT decoder, JWKS fetch/cache, token introspection, OAuth, session storage, auth middleware, provider call, OpenAI/model call, DB-backed validation, route consumption of parser output, public app behavior, or app submission exists.

Official context was used read-only:

- MCP Authorization requires protected-resource metadata discovery, resource indicators, token audience/resource validation, and no token passthrough for real authorization work.
- MCP Security Best Practices reinforces that token passthrough is forbidden and that tokens must not be forwarded as a shortcut.
- RFC 6750 informs Bearer-scheme posture and challenge failure vocabulary, but FP-0150 does not validate Bearer-scheme contents.
- RFC 9728 informs protected-resource metadata and `WWW-Authenticate` metadata URL sequencing, but FP-0150 does not change metadata routes or challenge behavior.
- OpenAI Apps SDK Security & Privacy and reference docs reinforce least privilege, secret/token minimization in component data and logs, per-tool-call scope enforcement, and OAuth challenge posture, but FP-0150 does not implement Apps SDK iframe/resources, OAuth, public app behavior, testing, or submission.

## Plan of Work

1. Patch FP-0149 closeout freshness with PR #328 merge facts if stale.
2. Patch `classifyBearerHeader` so any syntactically safe, non-empty, single-piece Bearer-scheme credential material is classified as Bearer-present with `credential_material_observed: true` and `failure_state: null`.
3. Preserve the explicit safe passthrough-attempt sentinel as `token_material_passthrough_attempt`.
4. Preserve unsafe whitespace/control and empty Bearer-scheme malformed states.
5. Add `[credential-present-alt]` as a second safe sentinel and focused tests proving the implementation is not hardcoded to one sentinel.
6. Create this exact FP-0150 plan.
7. Add `tools/read-only-mcp-authorization-parser-route-integration-sequencing-proof.mjs`.
8. Add proof-gate bridge fields for exact FP-0150 acceptance and FP-0151 absence.
9. Refresh directly stale active docs and `plugins.md` only where they still say FP-0150 is absent or FP-0149 release/PR work is pending.
10. Run focused validation and strict same-branch QA. Patch this same branch if a real defect is found.
11. Close out this plan, rerun required validation after closeout edits, commit exactly once, push, and create the PR.

## Concrete Steps

Authorized edit surfaces:

- `plans/FP-0150-read-only-chatgpt-app-mcp-authorization-parser-route-integration-sequencing.md`
- `plans/FP-0149-read-only-chatgpt-app-mcp-authorization-parser-pure-domain-implementation.md` only for closeout/freshness correction
- `packages/domain/src/read-only-app-mcp-authorization-parser.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser.spec.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser-contracts*.ts` only for direct type reuse, proof-gate fields, helpers, specs, and contracts
- `tools/read-only-mcp-authorization-parser-route-integration-sequencing-proof.mjs`
- `tools/read-only-mcp-authorization-parser-pure-domain-implementation-proof.mjs` only for exact FP-0150 successor bridge and material-observation checks
- directly stale README/CODEX_README/START/ACTIVE_DOCS/PROJECT_STATE/V2_BOUNDARY/ROADMAP/plugins refresh only if directly stale

Forbidden edit surfaces: routes, route behavior, missing-token route behavior, invalid-token challenge behavior, protected-resource metadata route behavior, DB/schema/migrations, package scripts, provider integration, OpenAI API/model code, source data, finance write paths, public assets, app-submission material, deployment config, and FP-0151.

Future route-integration sequence:

- future route dependency injection only, not default route behavior
- parser result must be downstream of missing-token precedence
- missing Authorization still uses FP-0130 missing-token lane
- malformed/unsupported parser classifications map through FP-0139 envelopes
- invalid-token challenge remains downstream of sanitized FP-0139 envelopes
- parser output may not be logged, echoed, stored, or returned directly
- route responses must not expose raw header/token material or parser internals
- protected-resource metadata route behavior remains unchanged

Future route integration proof prerequisites:

- parser pure-domain proof green
- no-token-leakage proof green
- missing-token proof green
- invalid-token challenge proof green
- FP-0139 envelope proof green
- protected-resource metadata route proof green
- route adapter proof green
- app construction dependency-injection proof green
- provider/runtime/OAuth/auth guardrails green

## Validation and Acceptance

Acceptance is observable when:

- Exactly one FP-0150 file exists at `plans/FP-0150-read-only-chatgpt-app-mcp-authorization-parser-route-integration-sequencing.md`.
- FP-0151 remained absent at FP-0150 closeout; a later exact FP-0151 route-integration implementation-readiness successor may be accepted by its own plan/proof bridge.
- The parser material-observation correction remains pure-domain/local-only.
- Safe single-piece Bearer-scheme sentinels `[credential-present]` and `[credential-present-alt]` both classify as `authorization_presence: present`, `authorization_scheme_classification: bearer`, `credential_material_observed: true`, and `failure_state: null`.
- The explicit safe passthrough-attempt sentinel still maps to `token_material_passthrough_attempt`.
- Unsafe whitespace/control and empty Bearer still map to malformed states.
- Parser output remains limited to FP-0146 sanitized fields.
- The parser never returns raw header/token material, token-derived fingerprint, token prefix, token suffix, token length, token hash, token digest, token claims, decoded header, decoded payload, or normalized credential text.
- No token parser, no JWT decoder, no JWKS fetching/caching implementation, no token introspection, no OAuth/session/auth middleware, no DB/schema/package work, no OpenAI API/model calls, no provider calls, no source mutation, no finance write, no external communication, no generated public prose, no public assets, and no app submission work are added.
- `/mcp` route behavior, missing-token behavior, invalid-token challenge behavior, and protected-resource metadata route behavior remain unchanged.
- Preserve FP-0149 parser implementation, FP-0148 readiness, FP-0147 provider-selection evidence, FP-0146 parser contracts, FP-0145 runtime contracts, FP-0144 production token-validation sequencing, FP-0143 app wiring, FP-0142 route sequencing, FP-0141 invalid-token local runtime, FP-0139 result envelopes, FP-0130 missing-token challenge, FP-0125 protected-resource metadata route, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 security boundary.

Validation commands:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-authorization-parser-route-integration-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-pure-domain-implementation-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-implementation-readiness-proof.mjs
pnpm exec tsx tools/read-only-mcp-provider-selection-evidence-hardening-proof.mjs
pnpm exec tsx tools/read-only-mcp-authorization-parser-contracts-provider-selection-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-runtime-contracts-proof-hardening-proof.mjs
pnpm exec tsx tools/read-only-mcp-production-token-validation-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-app-wiring-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-local-runtime-proof.mjs
pnpm exec tsx tools/read-only-mcp-token-validation-result-envelope-proof.mjs
pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs
pnpm exec tsx tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs
pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-local-route-proof.mjs
pnpm exec tsx tools/read-only-mcp-route-adapter-proof.mjs
pnpm exec tsx tools/read-only-public-app-security-boundary-proof.mjs
pnpm exec tsx tools/read-only-mcp-protocol-envelope-proof.mjs
pnpm exec tsx tools/read-only-endpoint-route-ownership-proof.mjs
pnpm exec tsx tools/read-only-endpoint-architecture-proof.mjs
pnpm exec tsx tools/read-only-chatgpt-app-mcp-proof.mjs
pnpm exec tsx tools/benchmark-community-pack-proof.mjs
pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs
pnpm exec tsx tools/read-only-evidence-app-proof.mjs
pnpm exec tsx tools/document-precision-foundation-proof.mjs
pnpm exec tsx tools/evidence-index-foundation-proof.mjs
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts src/read-only-app-mcp-authorization-parser-contracts.spec.ts src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts src/read-only-app-mcp-authorization-parser.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts src/app.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

If a post-validation closeout edit is made, rerun:

```bash
git diff --check
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

## Idempotence and Recovery

This slice is idempotent because it accepts exactly one FP-0150 plan path, adds one parser hardening correction, one focused proof command, exact bridge compatibility, direct stale-doc refresh only where needed, and no runtime route wiring. Re-running the proof command should accept this exact FP-0150 file, reject duplicate FP-0150 files, and allow only an exact later FP-0151 route-integration implementation-readiness successor.

If validation fails, do not widen scope. Patch only the parser module, parser spec, FP-0150 plan, FP-0149 freshness note, proof bridge, shared sanitizer compatibility, or directly stale docs on this branch. If failure points to missing services, auth failure, unrelated dirty files, or a proof failure that requires runtime/auth/route/provider expansion, stop and report the exact blocker.

Rollback is local-only: remove the FP-0150 plan, parser hardening change, focused spec updates, direct proof command, exact bridge edits, FP-0149 freshness correction, and stale-doc refresh. No raw source file, uploaded evidence, persisted finance state, database schema, route behavior, app construction, package script, provider state, OpenAI state, public asset, or external communication is mutated by this plan.

## Artifacts and Notes

Primary artifacts:

- `plans/FP-0150-read-only-chatgpt-app-mcp-authorization-parser-route-integration-sequencing.md`
- `plans/FP-0149-read-only-chatgpt-app-mcp-authorization-parser-pure-domain-implementation.md`
- `packages/domain/src/read-only-app-mcp-authorization-parser.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser.spec.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts`
- `tools/read-only-mcp-authorization-parser-route-integration-sequencing-proof.mjs`
- `tools/read-only-mcp-authorization-parser-pure-domain-implementation-proof.mjs`
- direct active-doc/plugin refresh if stale

Evidence and replay posture: FP-0150 changes pure-domain parser code and proof/docs only. It does not change mission state, ingest sources, source registry state, CFO Wiki finance facts, finance answers, reports, approvals, monitor findings, or durable finance artifacts. Replay implications are covered by the explicit no-route/no-runtime/no-mission-state posture and machine-readable proof output. Any future route consumption slice must record replay behavior or a named reason why replay is not applicable.

Provenance, freshness, and limitations: official MCP/RFC/OpenAI docs were used only as read-only parser and route-sequencing boundary context. Finance evidence remains the source of truth for product answers. FP-0150 creates no finance answer, no source-derived report, no public prose artifact, no generated advice, and no external communication.

Monitoring posture: F6 monitoring semantics are unchanged. No monitoring stored-state input contract, alert semantics, proof-bundle delivery path, freshness posture, missing-source posture, or human-review boundary changes in this slice.

Workflow and environment posture: no `WORKFLOW.md`, stack-pack, package script, dependency, deployment config, or environment variable change is needed.

## Interfaces and Dependencies

No runtime interface changes in FP-0150:

- `POST /mcp` remains the existing local route.
- GET `/mcp` remains unchanged.
- GET `/.well-known/oauth-protected-resource/mcp` remains unchanged.
- FP-0130 missing-token behavior remains separate.
- FP-0141/FP-0143 invalid-token challenge behavior remains explicit local sanitized-envelope dependency behavior only.
- FP-0139 result envelopes remain the only future validation output contract.
- FP-0146 sanitized parser contracts remain the only parser output boundary.
- FP-0147 provider mode remains provider-neutral/deferred.
- No route consumes parser output, evaluator output, or test-double output.

Future-only dependencies after FP-0150:

- Route-integration implementation-readiness may start only in a separate FP-0151 plan if all proof gates remain green and FP-0151 explicitly authorizes implementation-readiness.
- Route integration itself remains blocked unless a later plan explicitly authorizes it after FP-0150 readiness is proven.
- Production token validation remains blocked.
- Provider selection, provider integration, and provider calls remain blocked.
- Token parser, JWT decoder, JWKS fetch/cache, token introspection, OAuth/session/auth middleware, DB/schema/package work, OpenAI/model calls, public app behavior, app submission, source mutation, finance write, external communication, and autonomous action remain blocked.

## Outcomes & Retrospective

FP-0150 closes as a parser material-observation hardening and route-integration sequencing slice. It hardens the pure-domain parser so syntactically safe, non-empty, single-piece Bearer-scheme material is classified as Bearer-present with `credential_material_observed: true` and `failure_state: null`, while retaining the explicit safe passthrough-attempt sentinel and malformed empty/unsafe whitespace-control behavior.

The parser still returns only FP-0146 sanitized output fields. It never returns, stores, normalizes, hashes, digests, logs, forwards, decodes, introspects, or fingerprints raw Authorization header material or credential material. It emits no token prefix, suffix, length, hash, digest, claims, decoded header, decoded payload, normalized credential text, or token-derived fingerprint.

FP-0150 records future route-integration sequencing and proof prerequisites only. Route integration may not start from FP-0150; only a future route-integration implementation-readiness or explicitly authorized later implementation plan may open if all proof gates remain green.

No FP-0151 is created by this plan. Route consumption, route integration, production token validation, provider selection/calls/integration, token parser/JWT/JWKS/introspection, OAuth/session/auth middleware, DB/schema/package work, OpenAI/model calls, source mutation, finance writes, public assets, generated public prose, app submission, external communications, and autonomous action remain blocked.

Post-merge freshness correction on the FP-0151 branch records that PR #329 merged with head SHA `2fbc25f890bf3c5f7d842776610a0267d0e3bd11` and merge commit `a09c9b19975e6da1e21d386a16ccd2ff2406e988`. GitHub static and integration-db checks were green. Same-branch QA found no issues and made no correction. No post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green. No separate polish branch or post-merge QA branch is needed.
