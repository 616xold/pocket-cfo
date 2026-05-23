# Define read-only ChatGPT App MCP Authorization parser contracts

## Purpose / Big Picture

Target phase: V2BN read-only ChatGPT App/MCP Authorization parser-contract and provider-selection-proof slice.

FP-0146 is the parser-contract/provider-selection-proof slice after merged FP-0145. FP-0146 is parser-contract/provider-selection-proof only. FP-0146 does not parse, decode, validate, introspect, fetch, store, authorize, authenticate, or route tokens.

FP-0145 shipped provider-neutral token-validation runtime contracts and proof hardening, while stating production token-validation runtime still cannot start, provider mode remains provider-neutral/unresolved, raw token material must not be carried in contracts, FP-0139 envelopes remain the only future validation output contract, missing-token remains the FP-0130 lane, invalid-token challenge remains downstream of sanitized FP-0139 envelopes, and public ChatGPT App demo/submission remains future-only.

FP-0146 records the next proof layer: the future Authorization parser input contract, allowed sanitized parser output fields, forbidden token-derived observability fields, parser failure-state mapping to FP-0139/FP-0130, and provider-selection matrix criteria. It does not implement an Authorization parser, production token validation, token parser, JWT decoder, JWKS fetching/caching, token introspection, OAuth, token/session storage, auth middleware, route behavior, DB query, schema, migration, package script, Apps SDK iframe/resource behavior, public ChatGPT App behavior, app submission, OpenAI API/model calls, provider calls, source mutation, finance writes, generated public prose, public assets, external communications, or autonomous action.

Production token-validation runtime still cannot start after FP-0146. Authorization parser implementation remains blocked after FP-0146; only a future implementation-readiness slice may open if this contract and proof bridge remain green.

## Progress

- [x] 2026-05-23T22:45:59Z - Invoked the repo-local `pocket-cfo-codex-operator` Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-23T22:45:59Z - Preflight confirmed work on `codex/v2bn-read-only-chatgpt-app-mcp-authorization-parser-contracts-provider-selection-proof-local-v1`, authenticated `gh`, PR #324 merged to main, current `HEAD` and `origin/main` at `6fd000554cbaf2afd8c33b0a986ee656612fc4f3`, local Postgres/object storage services available, FP-0145 present, FP-0146 absent, FP-0147 absent, and required proof tools present.
- [x] 2026-05-23T22:45:59Z - Baseline proof gates passed before edits for FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100.
- [x] 2026-05-23T22:45:59Z - Read `plugins.md`, active docs, roadmap, FP-0145 through FP-0139 plan records, token-validation runtime/proof files, protected-resource metadata and OAuth security files, and route specs before coding.
- [x] 2026-05-23T22:45:59Z - OpenAI Developers exposed only API-key setup tooling, not read-only documentation tooling. No OpenAI Platform key setup, OpenAI API, model call, or API key was used. Official MCP, RFC, and OpenAI web docs were used read-only as protocol planning context.
- [x] 2026-05-23T22:45:59Z - Patched stale FP-0145 closeout wording from PR #324 on this same branch.
- [x] 2026-05-23T22:45:59Z - Added FP-0146 plan, proof-only Authorization parser contract helpers, focused specs, direct proof tooling, and direct proof-gate compatibility so exactly this FP-0146 path is accepted while FP-0147 remains absent.
- [x] 2026-05-23T23:15:04Z - Focused validation and strict same-branch QA passed before closeout: direct FP-0146 proof, inherited FP-0145/0144/0143/0142/0141/0139/0130/0125/0107/0106/0100 proof ladder, focused domain specs, focused control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-05-23T23:15:04Z - Closed out this plan after validation. Because this closeout edits the plan after validation, the required post-closeout validation command set must rerun before the single commit.
- [ ] Commit once, push, and create the PR after post-closeout validation passes.

## Surprises & Discoveries

PR #324 is merged, and `gh pr view 324` confirms head SHA `9f79fe0c0ce17c9ce7e1a07990324c0ef2295fd3` and merge commit `6fd000554cbaf2afd8c33b0a986ee656612fc4f3`.

The only stale FP-0145 closeout item found was the unchecked commit/push/PR line plus missing post-merge freshness notes. This branch patches that same-branch freshness issue without creating a separate polish or post-merge QA branch.

OpenAI Developers read-only docs tooling was not available in this local thread. The exposed OpenAI Platform path was API-key setup, which is out of scope, so official public docs were used read-only and no key flow was invoked.

## Decision Log

- 2026-05-23T22:45:59Z - FP-0146 is parser-contract/provider-selection-proof only. FP-0146 does not authorize parser implementation.
- 2026-05-23T22:45:59Z - Production token-validation runtime still cannot start after FP-0146. FP-0146 does not authorize production token validation runtime.
- 2026-05-23T22:45:59Z - Provider mode is provider-neutral/deferred. JWT/JWKS and opaque introspection remain candidate modes only; do not invent a provider.
- 2026-05-23T22:45:59Z - Future FP-0147 may open only parser-implementation-readiness or provider-selection-evidence-hardening, not production validation runtime.
- 2026-05-23T22:45:59Z - The future Authorization parser input contract may model request credential presence and resource/company references without retaining raw header and without retaining raw token material.
- 2026-05-23T22:45:59Z - Allowed sanitized parser output fields are `authorization_presence`, `authorization_scheme_classification`, `credential_material_observed`, `parser_contract_version`, `sanitized_request_metadata_reference`, `canonical_resource_uri_reference`, `resource_indicator_reference`, `company_selector_reference`, `no_raw_header_retained`, `no_raw_token_retained`, and `no_token_derived_fingerprint_retained`.
- 2026-05-23T22:45:59Z - Token-derived observability fields are forbidden until separately proven: `token_prefix`, `token_suffix`, `token_length`, `token_hash`, `token_digest`, `token_claims`, `decoded_header`, and `decoded_payload`.
- 2026-05-23T22:45:59Z - Missing authorization maps to `missing_token` and remains the FP-0130 lane.
- 2026-05-23T22:45:59Z - Unsupported scheme maps to `unsupported_validation_mode`, not `malformed_authorization`, because the parser contract can classify unsupported credential schemes separately from malformed syntax while still failing closed and without provider calls.
- 2026-05-23T22:45:59Z - Token material passthrough attempt maps to `invalid_token` and no forwarding.
- 2026-05-23T22:45:59Z - FP-0139 result envelopes remain the only future validation output contract. FP-0130 missing-token lane remains separate. Invalid-token challenge remains downstream of sanitized FP-0139 envelopes.
- 2026-05-23T22:45:59Z - `/mcp` route behavior unchanged, missing-token behavior unchanged, invalid-token challenge behavior unchanged, and protected-resource metadata route behavior unchanged.
- 2026-05-23T22:45:59Z - Public ChatGPT App demo/submission remains future-only.

## Context and Orientation

Current repo truth after FP-0145:

- `POST /mcp` remains the existing local route.
- GET `/mcp` remains unchanged.
- GET `/.well-known/oauth-protected-resource/mcp` remains the existing local explicit-dependency protected-resource metadata route.
- FP-0130 missing-token challenge behavior remains separate.
- FP-0141/FP-0143 invalid-token behavior remains explicit local sanitized-envelope behavior only.
- FP-0139 result envelopes are the only future validation output contract.
- There is no production token validation, Authorization parser implementation, token parser, JWT decoder, token introspection, JWKS fetch/cache, OAuth, token/session storage, auth middleware, route consumption of test doubles, DB-backed validation, provider call, OpenAI call, public app behavior, or submission path.

Official research used only as read-only planning context:

- MCP Authorization for protected-resource metadata, resource indicators, and access-token handling posture.
- MCP Security Best Practices for token passthrough prohibition, confused-deputy prevention, audience/resource binding, least privilege, and no credential forwarding.
- OpenAI Apps SDK Authentication for MCP authorization expectations, protected-resource metadata, resource parameter handling, authorization-server metadata, and ChatGPT client posture.
- OpenAI Apps SDK Security & Privacy for least privilege, server-side validation, redaction, audit logs, and avoiding secrets or tokens in surfaced data.
- OpenAI Apps SDK testing and submission docs only to record that public testing/submission remains downstream and out of scope.
- RFC 6750, RFC 8707, and RFC 9728 remain protocol references for Bearer challenge posture, resource indicators, and protected-resource metadata.

These docs are context only. Product source truth for Pocket CFO finance answers remains raw source evidence, Finance Twin state, CFO Wiki state, and proof bundles. FP-0146 creates no finance answer and mutates no source.

## Provider-Selection Criteria

FP-0146 records provider-selection proof criteria without provider calls or provider implementation:

- `oauth_2_1_posture`
- `protected_resource_metadata_compatibility`
- `authorization_server_metadata_discovery`
- `resource_parameter_support`
- `issuer_claim_source`
- `audience_resource_binding`
- `scopes_and_least_privilege`
- `jwks_availability_and_key_rotation_if_jwt_jwks`
- `introspection_endpoint_revocation_service_unavailable_if_opaque`
- `replay_nonce_posture`
- `development_tenant_test_tenant_posture`
- `mtls_egress_ip_allowlist_posture_if_relevant`
- `no_token_passthrough`
- `no_credential_forwarding`
- `no_provider_calls_in_this_slice`

Candidate provider modes:

- `jwt_jwks_candidate`
- `opaque_introspection_candidate`
- `provider_neutral_deferred`

Decision: provider mode remains provider-neutral/deferred unless a later plan proves explicit provider evidence.

## Parser Contract Decisions

Future Authorization parser input contract:

- Future parser input contract may reference request metadata, canonical resource URI, resource indicator, and company selector.
- It must operate without retaining raw header and without retaining raw token material.
- It must not emit, store, forward, log, hash, digest, measure, or fingerprint credential material.
- It is not an implementation contract for this slice.

Allowed sanitized output:

- `authorization_presence`: `absent` or `present`
- `authorization_scheme_classification`: `bearer`, `unsupported`, `malformed`, or `not_evaluated`
- `credential_material_observed`: boolean only, not material itself
- `parser_contract_version`
- `sanitized_request_metadata_reference`
- `canonical_resource_uri_reference`
- `resource_indicator_reference`
- `company_selector_reference`
- `no_raw_header_retained`: true
- `no_raw_token_retained`: true
- `no_token_derived_fingerprint_retained`: true

Forbidden until separately proven:

- `token_prefix`
- `token_suffix`
- `token_length`
- `token_hash`
- `token_digest`
- `token_claims`
- `decoded_header`
- `decoded_payload`

## Failure-State Mapping

Parser failure states map to FP-0139 envelopes or the FP-0130 lane:

| Parser state | Mapping | Posture |
| --- | --- | --- |
| `missing_authorization` | `missing_token` | Separate FP-0130 missing-token lane. |
| `malformed_authorization` | `malformed_authorization` | Sanitized FP-0139 envelope only. |
| `unsupported_scheme` | `unsupported_validation_mode` | Fail closed until provider mode is proven. |
| `multiple_authorization_values` | `malformed_authorization` | Sanitized FP-0139 envelope only. |
| `bearer_without_material` | `malformed_authorization` | Sanitized FP-0139 envelope only. |
| `bearer_with_unsafe_whitespace_or_control_characters` | `malformed_authorization` | Sanitized FP-0139 envelope only. |
| `token_material_passthrough_attempt` | `invalid_token` | No forwarding and no credential echo. |

Phrase check: unsupported scheme -> unsupported_validation_mode. Token material passthrough attempt -> invalid_token.

## Plan of Work

1. Patch stale FP-0145 closeout wording in the same branch.
2. Create exactly one Finance Plan at `plans/FP-0146-read-only-chatgpt-app-mcp-authorization-parser-contracts-provider-selection-proof.md`.
3. Add proof-only domain contracts in `packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts`.
4. Add focused specs in `packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts`.
5. Add `tools/read-only-mcp-authorization-parser-contracts-provider-selection-proof.mjs` as the direct proof command.
6. Patch existing proof bridge fields so exactly this FP-0146 parser-contract/provider-selection-proof plan is accepted while FP-0147 remains absent.
7. Refresh directly stale active docs and `plugins.md` only where they still frame FP-0146 as absent/future-only or FP-0145 as active.
8. Run focused validation and strict same-branch QA. Patch only this branch if a real defect is found.
9. Close out this plan, rerun required checks if closeout edits happen after validation, commit exactly once, push, and create the PR.

## Concrete Steps

Authorized edit surfaces:

- `plans/FP-0146-read-only-chatgpt-app-mcp-authorization-parser-contracts-provider-selection-proof.md`
- `plans/FP-0145-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-proof-hardening.md` only for closeout/freshness correction
- `packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts`
- existing `packages/domain/src/read-only-app-mcp-token-validation*.ts` and proof bridge/spec files only for exact FP-0146 compatibility
- `packages/domain/src/index.ts` for direct exports
- `tools/read-only-mcp-authorization-parser-contracts-provider-selection-proof.mjs`
- existing proof tools only for exact FP-0146 bridge compatibility
- directly stale active docs and `plugins.md` only if directly stale

Do not edit route behavior, DB/schema/migration files, package scripts, public assets, app-submission material, source data, provider configuration, OpenAI key setup, or runtime auth code.

## Validation and Acceptance

Acceptance is observable when:

- Exactly one FP-0146 file exists at `plans/FP-0146-read-only-chatgpt-app-mcp-authorization-parser-contracts-provider-selection-proof.md`.
- FP-0146 is parser-contract/provider-selection-proof only.
- FP-0147 remains absent.
- Authorization parser implementation remains absent.
- Production token validation remains absent.
- No token parser, JWT decoder, JWKS fetch/cache, token introspection, OAuth, token/session storage, or auth middleware exists.
- Parser contract output carries no raw header/token and no token-derived fingerprint.
- Token-derived prefix/suffix/length/hash/digest/claims/decoded header/decoded payload fields are forbidden.
- Parser failure states map to FP-0139 envelopes or the FP-0130 missing-token lane.
- Provider-selection proof criteria are recorded.
- Provider mode remains provider-neutral/deferred unless explicit repo evidence supports a decision.
- No provider calls are made.
- `/mcp` route behavior unchanged, missing-token behavior unchanged, invalid-token challenge behavior unchanged, and protected-resource metadata route behavior unchanged.
- FP-0145 closeout freshness is patched if stale.
- No real token examples, JWT-like examples, Bearer material, token echo, token logging, DB/schema/package/OpenAI/provider/source/finance-write/public/submission scope exists in changed docs, TypeScript source, specs, or proof tools.
- FP-0145/0144/0143/0142/0141/0139/0130/0125/0107/0106/0100 boundaries remain intact.

Validation commands:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts src/read-only-app-mcp-authorization-parser-contracts.spec.ts
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

This slice is idempotent because it adds one exact FP-0146 plan path, proof-only domain contracts, focused tests, one direct proof command, exact proof bridge compatibility, stale FP-0145 closeout correction, and directly stale docs refresh only where needed. Re-running the proof command should accept exactly this FP-0146 file, reject duplicate FP-0146 paths, and reject any FP-0147 path.

If validation fails, do not widen scope. Patch only the FP-0146 plan/proof/domain/spec bridge, FP-0145 closeout freshness, or direct stale docs on this same branch. If failure points to missing services, auth failure, unrelated dirty files, or proof failures that require runtime/auth/route/provider expansion, stop and report the exact blocker.

Rollback is documentation/proof-only: remove the FP-0146 plan, proof-only helpers/specs, direct proof command, exact bridge edits, FP-0145 closeout correction, and stale docs/plugin refresh. No raw source file, uploaded evidence, persisted finance state, database schema, route behavior, app construction, package script, provider state, OpenAI state, public asset, or external communication is mutated by this plan.

## Artifacts and Notes

Primary artifacts:

- `plans/FP-0146-read-only-chatgpt-app-mcp-authorization-parser-contracts-provider-selection-proof.md`
- `packages/domain/src/read-only-app-mcp-authorization-parser-contracts.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser-contracts.spec.ts`
- `tools/read-only-mcp-authorization-parser-contracts-provider-selection-proof.mjs`
- exact FP-0146 compatibility bridge in existing proof tools/specs
- directly stale active docs/plugin refresh only where required

Evidence and replay posture: this is planning/proof only. It does not change mission state, ingest sources, source registry state, CFO Wiki finance facts, finance answers, reports, approvals, monitor findings, or durable finance artifacts. Replay implications are covered by the explicit no-runtime/no-mission-state posture and machine-readable proof output. Any future runtime slice must record replay behavior or a named reason why replay is not applicable.

Provenance, freshness, and limitations: official MCP/RFC/OpenAI docs were used only as read-only planning context. Finance evidence remains the source of truth for product answers. FP-0146 creates no finance answer, no source-derived report, no public prose artifact, no generated advice, and no external communication.

Monitoring posture: F6 monitoring semantics are unchanged. No monitoring stored-state input contract, alert semantics, proof-bundle delivery path, freshness posture, missing-source posture, or human-review boundary changes in this slice.

Workflow and environment posture: no `WORKFLOW.md`, stack-pack, package script, dependency, deployment config, or environment variable change is needed.

## Interfaces and Dependencies

No runtime interface changes in FP-0146:

- `POST /mcp` remains the existing local route.
- GET `/mcp` remains unchanged.
- GET `/.well-known/oauth-protected-resource/mcp` remains unchanged.
- FP-0130 missing-token challenge behavior remains separate.
- FP-0141/FP-0143 invalid-token challenge behavior remains explicit local sanitized-envelope dependency behavior only.
- FP-0139 result envelopes remain proof/local envelopes and the only future validation output contract.
- No route consumes evaluator/test-double outputs.

Future-only dependencies before parser implementation readiness can open:

- no-token-retention and no-token-derived-fingerprint proof
- canonical resource URI reference proof
- protected-resource metadata proof
- resource indicator reference proof
- company selector reference proof
- provider-neutral/deferred mode posture preserved
- route behavior preservation proof

Future-only dependencies before provider-selection evidence-hardening can open:

- OAuth 2.1 posture evidence
- protected-resource metadata compatibility evidence
- authorization server metadata/discovery evidence
- resource parameter support evidence
- issuer claim/source evidence
- audience/resource binding evidence
- scopes and least privilege evidence
- JWKS availability/key rotation evidence if JWT/JWKS
- introspection endpoint/revocation/service-unavailable evidence if opaque token
- replay/nonce evidence
- development tenant/test tenant evidence
- mTLS/egress/IP allowlist evidence if relevant
- no token passthrough and no credential forwarding evidence

Production token-validation runtime remains future-only after those prerequisites; FP-0146 does not authorize it.

## Outcomes & Retrospective

FP-0146 created exactly one parser-contract/provider-selection-proof plan and exactly one direct proof command for the read-only ChatGPT App/MCP Authorization parser-contract lane. The slice added proof-only domain contracts and focused specs for sanitized Authorization parser output, parser failure mapping, provider-selection criteria, provider-neutral/deferred posture, and continued absence of FP-0147.

The provider decision remains deferred: JWT/JWKS and opaque introspection are candidate modes only, and provider-neutral/deferred remains the active posture because the repo does not contain enough explicit provider evidence to choose. Authorization parser implementation and production token-validation runtime remain blocked after FP-0146; only parser-implementation-readiness or provider-selection-evidence-hardening may open next if this proof stays green.

The stale FP-0145 closeout checkbox was patched in this branch with PR #324 merge evidence, the confirmed PR head SHA, the merge commit, and the same-branch QA note. No separate polish branch or post-merge QA branch was created.

Validation before closeout passed for the full requested proof ladder, focused domain/control-plane specs, lint, typecheck, full test suite, and current-worktree CI reproduction. Because this closeout updates the plan after validation, the required post-closeout set is still required before commit: `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

No raw source files, finance evidence, CFO Wiki finance facts, Finance Twin state, replay state, route behavior, DB/schema/migration files, package scripts, OpenAI/API/model state, provider state, public assets, app submission material, generated public prose, external communications, or autonomous action were changed by this slice.

What remains after this closeout is mechanical release work on the same branch only: rerun the post-closeout validation set, commit exactly once, push, and create the PR.
