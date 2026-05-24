# Prove read-only ChatGPT App MCP Authorization parser readiness

## Purpose / Big Picture

Target phase: V2BP read-only ChatGPT App/MCP Authorization parser implementation-readiness and no-token-retention proof-hardening.

FP-0148 is implementation-readiness and proof hardening only. FP-0148 does not implement parsing. It does not implement an Authorization parser, production token validation, token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth, token/session storage, auth middleware, route behavior, missing-token behavior, invalid-token challenge behavior, protected-resource metadata route behavior, provider selection, provider integration, provider calls, DB queries, schemas, migrations, package scripts, OpenAI API/model calls, source mutation, finance writes, public assets, generated public prose, app submission, external communications, or autonomous action.

FP-0147 shipped provider-selection evidence-hardening with provider mode still provider-neutral/deferred. FP-0148 proves whether a later parser implementation slice can be planned without weakening no-token-retention, canonical resource, protected-resource metadata, resource indicator, company selector, provider-neutral/deferred posture, and route-preservation proofs. It also centralizes proof-only no-token-leakage fixture sanitization so future proof tools do not carry ad hoc sanitizer copies.

## Progress

- [x] 2026-05-24T10:58:40Z - Invoked the repo-local `pocket-cfo-codex-operator` Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-24T10:58:40Z - Preflight confirmed work on `codex/v2bp-read-only-chatgpt-app-mcp-authorization-parser-implementation-readiness-local-v1`, authenticated `gh`, PR #326 merged to `main`, current `HEAD` and `origin/main` at `a0b8439084ecb52e146b5111960d53ae76e13053`, local Postgres/object storage services available, FP-0147 present, FP-0148 absent, FP-0149 absent, and required proof tools present.
- [x] 2026-05-24T10:58:40Z - Baseline proof gates passed before edits for FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100.
- [x] 2026-05-24T10:58:40Z - Read `plugins.md`, README/CODEX/START/ACTIVE_DOCS/PROJECT_STATE/V2_BOUNDARY/ROADMAP, FP-0147 through FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, FP-0100, authorization parser contracts/proofs, provider-selection evidence files, token-validation runtime/proof files, protected-resource metadata files, OAuth/security files, remote-host files, and route specs before coding.
- [x] 2026-05-24T10:58:40Z - OpenAI Developers exposed only API-key setup tooling, not read-only documentation tooling. No OpenAI Platform key setup, OpenAI API, model call, or API key was used. Official MCP, RFC, and OpenAI web/help/docs sources were used read-only as planning context.
- [x] 2026-05-24T10:58:40Z - Patched stale FP-0147 closeout wording from PR #326 on this same FP-0148 branch.
- [x] 2026-05-24T10:58:40Z - Centralized proof-only no-token-leakage fixture sanitization and added focused self-tests for exact absence/retention terminology while keeping token-like material rejected.
- [x] 2026-05-24T10:58:40Z - Added FP-0148 readiness contracts, focused specs, direct proof tooling, and proof-gate bridges so exactly this FP-0148 plan is accepted while FP-0149 remains absent.
- [x] 2026-05-24T11:27:23Z - Strict same-branch QA found inherited proof-tool compatibility gaps for the new exact FP-0148 readiness path and one local proof-only scanner false positive path; both were corrected on this branch without widening runtime, route, provider, DB, package, source, finance, or public-app scope.
- [x] 2026-05-24T11:27:23Z - Final validation passed before closeout: full proof ladder, focused domain and control-plane vitest suites, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-05-24T11:27:23Z - Closeout recorded. Because this closeout edit happened after validation, rerun `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current` before commit.

## Surprises & Discoveries

PR #326 is merged, and `gh pr view 326` confirms head SHA `464fb3f7fb57b5a28ba282eedbfd087cd079114f` and merge commit `a0b8439084ecb52e146b5111960d53ae76e13053`.

FP-0147 had stale closeout wording that still described post-closeout validation and mechanical release work as pending after PR #326 merged. This branch patches that same-branch freshness issue directly, records that same-branch QA found no issues and made no correction, and records that no post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.

OpenAI Developers read-only docs tooling was not available in this local thread. The exposed OpenAI Platform path was API-key setup, which is out of scope, so official public docs were used read-only and no key flow was invoked.

The proof-only no-token-leakage scanner had local sanitizer copies in proof tools for absence fixtures. FP-0148 moves that sanitizer into the shared domain token-validation boundary and keeps it exact: only proof-only absence/retention boolean terminology and exact no-header/no-value fixtures are sanitized; credential-shaped material remains rejected.

## Decision Log

- 2026-05-24T10:58:40Z - Authorization parser implementation cannot start after FP-0148. Future FP-0149 may implement only if this readiness proof remains green and FP-0149 explicitly authorizes parser implementation.
- 2026-05-24T10:58:40Z - Production token-validation runtime cannot start after FP-0148.
- 2026-05-24T10:58:40Z - Provider selection cannot start after FP-0148. Provider mode remains provider-neutral/deferred unless separate complete evidence exists.
- 2026-05-24T10:58:40Z - OAuth/session/auth middleware cannot start after FP-0148.
- 2026-05-24T10:58:40Z - Public ChatGPT App demo/submission cannot start after FP-0148.
- 2026-05-24T10:58:40Z - Future parser input boundary is `injected_raw_request_header_future_pure_parser_only`, `no_raw_header_retained_outside_parser_stack`, `no_raw_token_material_retained`, `no_token_prefix_suffix_length_hash_digest_claims_or_decoded_payload`, and `no_logging_echo_storage_hashing_fingerprinting_or_forwarding`.
- 2026-05-24T10:58:40Z - Future parser output boundary is limited to the FP-0146 sanitized output fields only: `authorization_presence`, `authorization_scheme_classification`, `credential_material_observed`, `parser_contract_version`, `sanitized_request_metadata_reference`, `canonical_resource_uri_reference`, `resource_indicator_reference`, `company_selector_reference`, `no_raw_header_retained`, `no_raw_token_retained`, and `no_token_derived_fingerprint_retained`.
- 2026-05-24T10:58:40Z - Token-derived fields remain forbidden: `token_prefix`, `token_suffix`, `token_length`, `token_hash`, `token_digest`, `token_claims`, `decoded_header`, and `decoded_payload`.
- 2026-05-24T10:58:40Z - Parser failure mapping stays proof-only: `missing_authorization` maps to the FP-0130 missing-token lane; `malformed_authorization`, `multiple_authorization_values`, `bearer_without_material`, and `bearer_with_unsafe_whitespace_or_control_characters` map to `malformed_authorization`; unsupported scheme maps to unsupported_validation_mode; `token_material_passthrough_attempt` maps to invalid_token; token material passthrough attempt maps to invalid_token.
- 2026-05-24T10:58:40Z - Future parser implementation test matrix is token-free: `absent_header`, `empty_header`, `unsupported_scheme_without_token_like_material`, `malformed_scheme_text_without_token_like_material`, `multiple_header_values_structural_only`, `bearer_present_classification_with_sentinel_non_token_placeholder`, and `unsafe_whitespace_control_character_posture_without_token_material`.
- 2026-05-24T10:58:40Z - Future FP-0149 may open only `authorization_parser_implementation_only`, `pure_domain_local_only`, `no_route_consumption`, `no_token_validation`, `no_jwt_jwks_introspection_oauth_session_auth_middleware`, `no_db_schema_package_work`, `no_provider_calls`, `no_openai_or_model_calls`, and `no_public_app_or_submission`.
- 2026-05-24T10:58:40Z - Shared proof-only sanitizer accepts exact absence/retention booleans such as `authorization absent`, `authorization_presence: absent`, `no_raw_header_retained`, `no_raw_token_retained`, `no_token_derived_fingerprint_retained`, and `credential_material_observed: false`; it does not allow credential-shaped material, JWT-like strings, bearer material, token echo/logging, token prefixes/suffixes/length/hash/digest/claims, or raw authorization header fixtures with credential material.

## Context and Orientation

Current repo truth after FP-0147:

- `POST /mcp` remains the existing local route.
- GET `/mcp` remains unchanged.
- GET `/.well-known/oauth-protected-resource/mcp` remains the existing local explicit-dependency protected-resource metadata route.
- FP-0130 missing-token challenge behavior remains separate.
- FP-0141/FP-0143 invalid-token behavior remains explicit local sanitized-envelope behavior only.
- FP-0139 result envelopes remain the only future validation output contract.
- FP-0146 parser contracts remain intact.
- FP-0147 provider-selection evidence remains provider-neutral/deferred and does not select a provider.
- There is no production token validation, Authorization parser implementation, token parser, JWT decoder, token introspection, JWKS fetch/cache, OAuth, token/session storage, auth middleware, route consumption of test doubles, DB-backed validation, provider call, OpenAI call, public app behavior, or submission path.

Official research used only as read-only planning context:

- MCP Authorization for protected-resource metadata, resource indicators, 400/401/403 posture, token audience/resource validation, and token theft/no-retention posture.
- MCP Security Best Practices for token passthrough prohibition, confused-deputy prevention, audience/resource binding, least privilege, and no credential forwarding.
- RFC 8707 for resource indicators and audience restriction posture.
- RFC 9728 for protected-resource metadata, resource field posture, authorization server references, and metadata route derivation.
- OpenAI Apps SDK / help / app terms context for developer-mode testing, safety/privacy expectations, app submission posture, and why public submission remains downstream and out of scope.

These docs are context only. Product source truth for Pocket CFO finance answers remains raw source evidence, Finance Twin state, CFO Wiki state, and proof bundles. FP-0148 creates no finance answer and mutates no source.

## Plan of Work

1. Patch stale FP-0147 closeout wording in the same branch.
2. Centralize proof-only no-token-leakage fixture sanitization in the domain token-validation boundary.
3. Create exactly one Finance Plan at `plans/FP-0148-read-only-chatgpt-app-mcp-authorization-parser-implementation-readiness.md`.
4. Add proof-only readiness helpers in `packages/domain/src/read-only-app-mcp-authorization-parser-implementation-readiness.ts`.
5. Add focused specs in `packages/domain/src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts`.
6. Add `tools/read-only-mcp-authorization-parser-implementation-readiness-proof.mjs` as the direct proof command.
7. Patch existing proof bridge fields so exactly this FP-0148 readiness plan is accepted while FP-0149 remains absent.
8. Refresh directly stale active docs and `plugins.md` only where they still frame FP-0148 as absent/future-only or FP-0147 as active.
9. Run focused validation and strict same-branch QA. Patch only this branch if a real defect is found.
10. Close out this plan, rerun required checks if closeout edits happen after validation, commit exactly once, push, and create the PR.

## Concrete Steps

Authorized edit surfaces:

- `plans/FP-0148-read-only-chatgpt-app-mcp-authorization-parser-implementation-readiness.md`
- `plans/FP-0147-read-only-chatgpt-app-mcp-provider-selection-evidence-hardening.md` only for closeout/freshness correction
- `packages/domain/src/read-only-app-mcp-authorization-parser-implementation-readiness.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser-contracts*.ts` only for exact FP-0148 proof-gate compatibility
- `packages/domain/src/read-only-app-mcp-provider-selection-evidence-hardening*.ts` only for exact FP-0148 proof-gate compatibility
- `packages/domain/src/read-only-app-mcp-token-validation*.ts` only for shared proof-only leakage sanitizer helpers/specs and exact proof-gate compatibility
- `packages/domain/src/index.ts` for direct exports
- `tools/read-only-mcp-authorization-parser-implementation-readiness-proof.mjs`
- existing proof tools only for exact FP-0148 bridge compatibility and shared leakage-sanitizer reuse
- directly stale active docs and `plugins.md` only if directly stale

Do not edit route behavior, DB/schema/migration files, package scripts, public assets, app-submission material, source data, provider configuration, OpenAI key setup, or runtime auth code.

## Validation and Acceptance

Acceptance is observable when:

- Exactly one FP-0148 file exists at `plans/FP-0148-read-only-chatgpt-app-mcp-authorization-parser-implementation-readiness.md`.
- FP-0149 remains absent.
- FP-0148 is implementation-readiness/proof hardening only.
- FP-0148 does not implement parser runtime.
- FP-0148 does not authorize route consumption.
- FP-0148 does not authorize production token validation.
- FP-0148 does not authorize provider selection/calls/integration.
- FP-0148 does not authorize JWT/JWKS/introspection/OAuth/session/auth middleware.
- FP-0148 does not authorize DB/schema/package work.
- Parser input/output boundaries are recorded.
- No raw header retention, raw token retention, token-derived fingerprint retention, token echo/logging, or credential forwarding is recorded.
- No token-derived prefix/suffix/length/hash/digest/claims/decoded header/decoded payload fields are allowed.
- Parser failure states map to FP-0139 envelopes or the FP-0130 missing-token lane.
- Parser readiness test matrix contains no real token examples, JWT-like examples, bearer material, or token-derived fingerprints.
- Shared proof-only no-token-leakage sanitizer is centralized and proves exact absence/retention boolean terminology while real token-like material remains rejected.
- FP-0147 closeout freshness is patched if stale.
- `/mcp` route behavior unchanged. /mcp route behavior unchanged, missing-token behavior unchanged, invalid-token challenge behavior unchanged, and protected-resource metadata route behavior unchanged.
- FP-0147 provider-selection evidence, FP-0146 parser contracts, FP-0145 runtime contracts, FP-0144 production sequencing, FP-0143 app wiring, FP-0142 route integration sequencing, FP-0141 invalid-token local runtime, FP-0139 result envelopes, FP-0130 missing-token challenge, FP-0125 protected-resource metadata route, FP-0107 route adapter, FP-0106 protocol envelope, and FP-0100 public security boundary remain intact.

Validation commands:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts src/read-only-app-mcp-authorization-parser-contracts.spec.ts src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts
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

This slice is idempotent because it adds one exact FP-0148 plan path, proof-only readiness helpers/specs, one direct proof command, exact bridge edits, shared proof-only no-token-leakage sanitizer reuse, FP-0147 closeout correction, and directly stale docs/plugin refresh only where needed. Re-running the proof command should accept exactly this FP-0148 file, reject duplicate FP-0148 paths, and reject any FP-0149 path.

If validation fails, do not widen scope. Patch only the FP-0148 plan/proof/domain/spec bridge, shared sanitizer, FP-0147 closeout freshness, or direct stale docs on this same branch. If failure points to missing services, auth failure, unrelated dirty files, or proof failures that require runtime/auth/route/provider expansion, stop and report the exact blocker.

Rollback is documentation/proof-only: remove the FP-0148 plan, proof-only helpers/specs, direct proof command, exact bridge edits, shared sanitizer edits, FP-0147 closeout correction, and stale docs/plugin refresh. No raw source file, uploaded evidence, persisted finance state, database schema, route behavior, app construction, package script, provider state, OpenAI state, public asset, or external communication is mutated by this plan.

## Artifacts and Notes

Primary artifacts:

- `plans/FP-0148-read-only-chatgpt-app-mcp-authorization-parser-implementation-readiness.md`
- `packages/domain/src/read-only-app-mcp-authorization-parser-implementation-readiness.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser-implementation-readiness.spec.ts`
- shared sanitizer additions in `packages/domain/src/read-only-app-mcp-token-validation.ts`
- `tools/read-only-mcp-authorization-parser-implementation-readiness-proof.mjs`
- exact proof bridge compatibility edits in existing FP-0146/0147 proof surfaces
- stale FP-0147 closeout freshness correction

Evidence and replay posture: this is implementation-readiness/proof hardening only. It does not change mission state, ingest sources, source registry state, CFO Wiki finance facts, finance answers, reports, approvals, monitor findings, or durable finance artifacts. Replay implications are covered by the explicit no-runtime/no-mission-state posture and machine-readable proof output. Any future runtime slice must record replay behavior or a named reason why replay is not applicable.

Provenance, freshness, and limitations: official MCP/RFC/OpenAI docs were used only as read-only planning context. Finance evidence remains the source of truth for product answers. FP-0148 creates no finance answer, no source-derived report, no public prose artifact, no generated advice, and no external communication.

Monitoring posture: F6 monitoring semantics are unchanged. No monitoring stored-state input contract, alert semantics, proof-bundle delivery path, freshness posture, missing-source posture, or human-review boundary changes in this slice.

Workflow and environment posture: no `WORKFLOW.md`, stack-pack, package script, dependency, deployment config, or environment variable change is needed.

## Interfaces and Dependencies

No runtime interface changes in FP-0148:

- `POST /mcp` remains the existing local route.
- GET `/mcp` remains unchanged.
- GET `/.well-known/oauth-protected-resource/mcp` remains unchanged.
- FP-0130 missing-token challenge behavior remains separate.
- FP-0141/FP-0143 invalid-token challenge behavior remains explicit local sanitized-envelope dependency behavior only.
- FP-0139 result envelopes remain proof/local envelopes and the only future validation output contract.
- FP-0146 sanitized parser contracts remain the only future parser output boundary.
- FP-0147 provider mode remains provider-neutral/deferred.
- No route consumes evaluator/test-double outputs.

Future-only dependencies before any parser implementation can open:

- FP-0148 readiness proof remains green.
- A future FP-0149 explicitly authorizes parser implementation only.
- Parser implementation remains pure-domain/local-only and does not get route consumption.
- No production token validation, token parser, JWT decoder, JWKS fetch/cache, token introspection, OAuth/session/auth middleware, DB/schema/package work, provider calls, OpenAI/model calls, public app behavior, app submission, source mutation, finance write, external communication, or autonomous action is opened by FP-0149 unless a later proof explicitly supersedes this boundary.

## Outcomes & Retrospective

FP-0148 closes as an implementation-readiness and proof-hardening slice only. It proves that the future parser boundary can be described without implementing an Authorization parser, production token validation, token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth, token/session storage, auth middleware, route behavior changes, provider selection, provider integration, provider calls, DB/schema/package work, OpenAI API/model calls, source mutation, finance writes, public assets, generated public prose, app submission, external communications, or autonomous action.

Final validation passed before this closeout edit: `git diff --check`, the direct FP-0148 proof, the prior FP-0147/0146/0145/0144/0143/0142/0141/0139/0130/0125/0107/0106/0100 proof ladder, endpoint ownership and architecture proofs, read-only app/evidence/document/index proofs, the focused domain and control-plane vitest suites, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

Strict same-branch QA found no product behavior issue. It did find proof durability work required by this slice: inherited proof tools needed exact FP-0148 readiness-path compatibility, and the provider-selection proof needed to avoid scanning unchanged strict-scanner self-test fixtures as if they were newly introduced credential material. Both corrections stayed in the proof-only bridge/sanitizer scope and were rerun through the validation ladder.

The stale FP-0147 closeout wording was patched on this branch. The plan now records that PR #326 merged with head SHA `464fb3f7fb57b5a28ba282eedbfd087cd079114f` and merge commit `a0b8439084ecb52e146b5111960d53ae76e13053`, that same-branch QA found no issues and made no correction, and that no post-merge QA is required when current `main` matches the validated PR head/merge posture and CI remains green.

The shared proof-only no-token-leakage sanitizer is centralized in the domain token-validation boundary. It accepts only exact proof-only absence/retention terminology and exact no-value fixtures, while keeping credential-shaped material, JWT-like examples, bearer material, token echo/logging, raw header fixtures with credential material, and token-derived fields rejected.

Authorization parser implementation still cannot start from FP-0148 alone. A future FP-0149 may open parser implementation only if this readiness proof remains green and FP-0149 explicitly authorizes a pure-domain/local-only parser implementation with no route consumption, no token validation, no JWT/JWKS/introspection/OAuth/session/auth middleware, no DB/schema/package work, no provider calls, no OpenAI/model calls, and no public app/submission work.
