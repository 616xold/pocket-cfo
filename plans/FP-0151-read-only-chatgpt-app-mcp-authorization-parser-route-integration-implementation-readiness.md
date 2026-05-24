# FP-0151 - Read-only ChatGPT App/MCP Authorization Parser Route-Integration Implementation-Readiness

Status: closed
Owner: Codex
Target phase: V2BS read-only ChatGPT App/MCP Authorization parser route-integration implementation-readiness.

FP-0151 is route-integration implementation-readiness and proof planning only after merged FP-0150. This is not route integration. This is not /mcp route consumption. This is not route behavior change, missing-token behavior change, invalid-token challenge behavior change, protected-resource metadata route behavior change, production token validation, token parser implementation, JWT decoder implementation, JWKS fetching/caching implementation, token introspection implementation, OAuth implementation, token/session storage, auth middleware, provider selection implementation, provider integration, provider calls, Apps SDK iframe/resource implementation, public ChatGPT App implementation, app submission, remote deployment, DB query implementation, schema or migration work, package script work, OpenAI API/model integration, provider/certification/deployment execution, external communications, source mutation, finance write, or autonomous action.

## Progress

- [x] 2026-05-24T16:04:51Z - Preflight confirmed work on `codex/v2bs-read-only-chatgpt-app-mcp-authorization-parser-route-integration-implementation-readiness-local-v1`, authenticated `gh`, PR #329 merged to `main`, current `HEAD` and `origin/main` at `a09c9b19975e6da1e21d386a16ccd2ff2406e988`, local Postgres/object storage services available, FP-0150 present, FP-0151 absent before this plan, FP-0152 absent, and required proof tools present.
- [x] 2026-05-24T16:04:51Z - Baseline proof gates for FP-0150, FP-0149, FP-0148, FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100 passed before FP-0151 edits.
- [x] 2026-05-24T16:04:51Z - Official MCP Authorization, MCP Security Best Practices, RFC 6750, RFC 9728, and OpenAI Apps SDK Authentication/Security docs were used read-only as implementation-readiness context only. No OpenAI API key setup, OpenAI API/model call, provider call, deployment action, public asset, app-submission action, or external communication was used.
- [x] 2026-05-24T16:04:51Z - Created the FP-0151 route-safe parser decision contract, focused pure-domain readiness helper/spec, direct proof command, FP-0150 closeout freshness correction, direct active-doc/plugin refresh, and FP-0149/FP-0150 bridge compatibility.
- [x] 2026-05-24T16:25:17Z - Strict same-branch QA found inherited FP-0142/FP-0143 proof-boundary allowlists that recognized FP-0150 but not the exact FP-0151 readiness successor; patched only proof-gate bridge compatibility without route/runtime/provider/OAuth/auth behavior changes.
- [x] 2026-05-24T16:27:04Z - Strict same-branch QA found the inherited FP-0107 route-adapter proof-boundary allowlist also needed exact FP-0151 successor recognition; patched only the proof allowlist without route-adapter behavior change.
- [x] 2026-05-24T16:36:03Z - Final validation passed: `git diff --check`, the direct FP-0151 proof, the full requested proof ladder, focused domain/control-plane Vitest suites, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-05-24T18:18:03Z - Post-merge freshness polish confirmed PR #330 merged to `main` with head SHA `9521cdc0db6138cf0d43d63fd62b983fb0748eaf` and merge commit `11bff71bc24970e2ca629ddc7320a5b41221cde6`; GitHub static and integration-db checks were green. Same-branch QA found no issues and made no correction, and no post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.

## Decisions

- Route integration is not included in FP-0151. `/mcp route may not consume parser output in FP-0151`.
- Route-integration implementation may start after FP-0151 only in a separate FP-0152 implementation slice if FP-0151 readiness proof remains green and FP-0152 explicitly authorizes implementation.
- `/mcp` route may not consume parser output in FP-0151.
- Production token-validation runtime cannot start after FP-0151.
- Provider selection cannot start after FP-0151; provider mode remains provider-neutral/deferred unless a separate complete provider-evidence plan exists. Provider calls, provider integration, and provider selection implementation remain blocked.
- OAuth/session/auth middleware cannot start after FP-0151.
- Public ChatGPT App demo/submission cannot start after FP-0151.
- Parser material-observation correction is not needed after FP-0151 because FP-0150 parser material-observation hardening remains green.
- Provider-selection evidence correction is not needed after FP-0151 because FP-0147 provider-selection evidence hardening remains green.
- Narrow same-branch proof-gate bridge corrections were needed and applied for inherited FP-0107/FP-0142/FP-0143 allowlists; no additional proof-gate correction is needed after FP-0151 unless later validation detects a defect.
- Post-merge QA is not recommended when the branch merges without substantive post-validation correction, GitHub checks remain green, and current `main` matches the validated PR head/merge posture.
- PR #330 merged on 2026-05-24 with head SHA `9521cdc0db6138cf0d43d63fd62b983fb0748eaf` and merge commit `11bff71bc24970e2ca629ddc7320a5b41221cde6`. GitHub static and integration-db checks were green. Same-branch QA found no issues and made no correction, so no post-merge QA is required when current main matches that validated head/merge posture and CI remains green.

## Route-Safe Parser Decision Contract

The future route-safe parser decision contract is the only surface a route adapter may consume if a later Finance Plan authorizes route integration. It is derived from safe parser classification objects and FP-0130/FP-0139 mapping contracts, not raw headers or token material.

Required fields:

- `parser_route_decision_contract_version`
- `authorization_presence`
- `authorization_scheme_classification`
- `credential_material_observed`
- `parser_failure_state`
- `envelope_failure`
- `maps_to_fp0130_missing_token_lane`
- `maps_to_fp0139_result_envelope`
- `invalid_token_challenge_downstream_only`
- `no_raw_header_retained`
- `no_raw_token_retained`
- `no_token_derived_fingerprint_retained`
- `no_token_prefix_suffix_length_hash_digest_claims_decoded_output`
- `no_route_response_exposure`
- `no_logging_echo_storage_forwarding`

Forbidden route-decision fields remain forbidden until separately proven and authorized: token prefix, token suffix, token length, token hash, token digest, token claims, decoded header, decoded payload, raw header, raw token material, normalized credential text, credential fingerprint, provider identity, provider request/response body, and token-derived fingerprint.

## Future Dependency Injection Shape

- The route parser dependency is optional and explicitly injected.
- Default `/mcp` behavior remains unchanged when dependency is absent.
- The parser dependency may not be constructed inside route by default.
- The parser dependency may not call network/time/random/crypto/env/provider/db/openai APIs.
- The route adapter may consume only sanitized route decision outputs, not raw parser internals.
- The future adapter must not consume raw Authorization header values, token material, token-derived fingerprints, parser internals, evaluator/test-double outputs, provider responses, DB query results, source content, finance state, OpenAI model output, or environment-derived auth state.

## Future Route Sequencing

- Local origin validation still runs before auth challenge branches.
- Missing-token precedence remains before parser invalid-token/malformed-token route decision.
- Missing Authorization still uses FP-0130 missing-token lane.
- Malformed/unsupported parser classifications map through FP-0139 envelopes.
- Invalid-token challenge remains downstream of sanitized FP-0139 envelopes.
- Protected-resource metadata route behavior remains unchanged.
- Parser decision must not be returned directly in HTTP response body.
- No raw Authorization header/token material appears in logs, proof output, responses, or structured tool results.
- Invalid-token challenge remains downstream-only: FP-0151 does not add invalid-token behavior and does not alter the FP-0141/FP-0143 sanitized-envelope challenge posture.
- Protected-resource metadata remains independent: FP-0151 does not change `/.well-known/oauth-protected-resource/mcp`, metadata body fields, status codes, headers, route registration, or metadata challenge discovery behavior.

## Future Implementation Proof Prerequisites

A later FP-0152 route-integration implementation slice may open only if it explicitly names implementation scope and proves these prerequisites:

- `parser_pure_domain_proof_green`
- `fp0150_route_integration_sequencing_proof_green`
- `no_token_leakage_proof_green`
- `missing_token_proof_green`
- `invalid_token_challenge_proof_green`
- `fp0139_envelope_proof_green`
- `protected_resource_metadata_route_proof_green`
- `route_adapter_proof_green`
- `app_construction_dependency_injection_proof_green`
- `provider_runtime_oauth_auth_guardrails_green`

## Future FP-0152 Boundary

Future FP-0152 may open only for one of these:

- route-integration implementation with explicit dependency injection
- readiness correction
- proof-gate correction

FP-0152 must not implement production token validation. FP-0152 must not implement OAuth/session/auth middleware. FP-0152 must not implement provider calls. FP-0152 must not implement provider integration, provider selection implementation, token parser implementation, JWT decoder implementation, JWKS fetching/caching implementation, token introspection implementation, DB/schema/package work, OpenAI API/model calls, public app behavior, app submission, source mutation, finance writes, public assets, listing copy, generated public prose, external communications, or autonomous action.

Preserve FP-0150 route sequencing, FP-0149 parser implementation, FP-0148 readiness, FP-0147 provider-selection evidence, FP-0146 parser contracts, FP-0145 runtime contracts, FP-0144 production token-validation sequencing, FP-0143 app wiring, FP-0142 route sequencing, FP-0141 invalid-token local runtime, FP-0139 result envelopes, FP-0130 missing-token challenge, FP-0125 protected-resource metadata route, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 security boundary.

## Scope

Allowed edit surfaces:

- `plans/FP-0151-read-only-chatgpt-app-mcp-authorization-parser-route-integration-implementation-readiness.md`
- `plans/FP-0150-read-only-chatgpt-app-mcp-authorization-parser-route-integration-sequencing.md` only for PR #329 closeout freshness correction
- `packages/domain/src/read-only-app-mcp-authorization-parser-route-integration-readiness.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser-route-integration-readiness.spec.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts` only for exact FP-0151 readiness and FP-0152 absence bridge helpers
- `packages/domain/src/read-only-app-mcp-authorization-parser.ts` only for proof-gate helper bridge compatibility
- `packages/domain/src/read-only-app-mcp-authorization-parser.spec.ts` only for exact FP-0151 readiness compatibility
- `packages/domain/src/index.ts` only for direct exports
- `tools/read-only-mcp-authorization-parser-route-integration-readiness-proof.mjs`
- `tools/read-only-mcp-authorization-parser-route-integration-sequencing-proof.mjs` only for exact FP-0151 successor bridge
- `tools/read-only-mcp-authorization-parser-pure-domain-implementation-proof.mjs` only for exact FP-0151 successor bridge
- `tools/read-only-mcp-route-adapter-proof.mjs` only for exact FP-0151 successor bridge compatibility
- `tools/read-only-mcp-invalid-token-app-wiring-proof.mjs` only for exact FP-0151 successor bridge compatibility
- `tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs` only for exact FP-0151 successor bridge compatibility
- directly stale active docs and `plugins.md` only where they still present FP-0151 as absent/future-only after this slice

Forbidden edit surfaces: route files, route behavior, missing-token route behavior, invalid-token challenge behavior, protected-resource metadata route behavior, DB/schema/migrations, package scripts, provider integration, OpenAI API/model code, source data, finance write paths, public assets, app-submission material, deployment config, and FP-0152.

## Proof Gates

The direct FP-0151 proof must show:

- Exactly one FP-0151 file exists at `plans/FP-0151-read-only-chatgpt-app-mcp-authorization-parser-route-integration-implementation-readiness.md`.
- FP-0152 remains absent.
- FP-0151 is implementation-readiness/proof only.
- FP-0151 does not wire parser into routes.
- FP-0151 does not authorize route behavior changes.
- FP-0151 does not authorize production token validation.
- FP-0151 does not authorize provider selection/calls/integration.
- FP-0151 does not authorize JWT/JWKS/introspection/OAuth/session/auth middleware.
- FP-0151 does not authorize DB/schema/package work.
- Route-safe parser decision contract is recorded.
- Future dependency-injection shape is recorded.
- Future route sequencing is recorded.
- Future implementation proof prerequisites are recorded.
- Parser output and route decision never carry raw header/token material.
- No token-derived prefix/suffix/length/hash/digest/claims/decoded output fields are allowed.
- Parser tests/proof fixtures contain no real token examples, JWT-like examples, Bearer material, or token-derived fingerprints.
- Shared proof-only no-token-leakage sanitizer remains strict for real token material.
- FP-0150 closeout freshness is patched.
- FP-0150/0149/0148/0147/0146/0145/0144/0143/0142/0141/0139/0130/0125/0107/0106/0100 boundaries remain intact.

## Validation

Required validation:

```bash
git diff --check
pnpm exec tsx tools/read-only-mcp-authorization-parser-route-integration-readiness-proof.mjs
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts src/read-only-app-mcp-authorization-parser-contracts.spec.ts src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts src/read-only-app-mcp-authorization-parser.spec.ts src/read-only-app-mcp-authorization-parser-route-integration-readiness.spec.ts
pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts src/app.spec.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm ci:repro:current
```

## Evidence, Replay, And Freshness

Evidence and replay posture: FP-0151 changes pure-domain proof/docs only. It does not change mission state, ingest sources, source registry state, CFO Wiki finance facts, finance answers, reports, approvals, monitor findings, or durable finance artifacts. Replay implications are covered by the explicit no-route/no-runtime/no-mission-state posture and machine-readable proof output. Any future route consumption slice must record replay behavior or a named reason why replay is not applicable.

Provenance, freshness, and limitations: official MCP/RFC/OpenAI docs were used only as read-only route-readiness context. Finance evidence remains the source of truth for product answers. FP-0151 creates no finance answer, no source-derived report, no public prose artifact, no generated advice, and no external communication.

## Decision Log

- 2026-05-24T16:04:51Z - Preserve FP-0150 route sequencing and keep route integration blocked in FP-0151.
- 2026-05-24T16:04:51Z - Define a route-safe parser decision contract before any future route consumes parser output.
- 2026-05-24T16:04:51Z - Keep missing-token precedence separate from parser failure states: missing Authorization maps to the FP-0130 missing-token lane, while malformed/unsupported parser classifications map through FP-0139 envelopes.
- 2026-05-24T16:04:51Z - Keep invalid-token challenge downstream of sanitized FP-0139 envelopes and protected-resource metadata route behavior unchanged.
- 2026-05-24T16:04:51Z - Future route dependency injection must be explicit, optional, local-only, and sanitized-decision-only.
- 2026-05-24T16:04:51Z - FP-0152 may open only for explicit dependency-injected route integration, readiness correction, or proof-gate correction; runtime token validation, provider work, OAuth/session/auth middleware, DB/schema/package work, public app behavior, and app submission remain blocked.
- 2026-05-24T16:25:17Z - Same-branch QA may update inherited proof-gate allowlists only when the update recognizes this exact FP-0151 readiness successor and continues to reject route/runtime/provider/OAuth/auth behavior changes.
- 2026-05-24T16:27:04Z - The route-adapter proof remains behavior-preserving; its only FP-0151 change is exact successor recognition for this readiness/proof branch.

## Closeout

FP-0151 closes as a route-integration implementation-readiness and proof-planning slice only. It records the route-safe parser decision contract, future dependency-injection shape, route sequencing, proof prerequisites, FP-0152 boundary, no-retention/no-token-derived-output posture, and prior boundary preservation without wiring the parser into `/mcp`. Same-branch QA corrected only inherited FP-0107/FP-0142/FP-0143 proof-gate successor recognition for this exact FP-0151 readiness branch.

No route integration, route consumption, route behavior change, missing-token behavior change, invalid-token challenge behavior change, protected-resource metadata route behavior change, production token validation, provider selection implementation, provider integration, provider calls, token parser, JWT decoder, JWKS fetch/cache, token introspection, OAuth/session/auth middleware, evaluator/test-double route consumption, DB queries, schemas, migrations, package scripts, OpenAI API/model calls, source mutation, finance writes, public assets, listing copy, generated public prose, app submission, external communications, or autonomous action is included.

Future route-integration implementation may start only in a separate FP-0152 implementation slice if FP-0151 readiness proof remains green and FP-0152 explicitly authorizes implementation with explicit dependency injection. Public ChatGPT App submission should wait.

Post-merge freshness correction: PR #330 merged to `main` with head SHA `9521cdc0db6138cf0d43d63fd62b983fb0748eaf` and merge commit `11bff71bc24970e2ca629ddc7320a5b41221cde6`. GitHub static and integration-db checks were green. Same-branch QA found no issues and made no correction. No post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.
