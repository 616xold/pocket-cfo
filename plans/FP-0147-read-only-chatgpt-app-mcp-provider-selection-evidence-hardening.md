# Harden read-only ChatGPT App MCP provider-selection evidence

## Purpose / Big Picture

Target phase: V2BO read-only ChatGPT App/MCP provider-selection evidence-hardening and canonical resource OAuth-readiness proof slice.

FP-0147 is provider-selection evidence-hardening/proof only. FP-0147 is not provider selection implementation, not provider integration, not provider calls, not Authorization parser implementation, not production token-validation implementation, not token parser implementation, not JWT decoder implementation, not JWKS fetching/caching implementation, not token introspection implementation, not OAuth implementation, not token/session storage, not auth middleware, not route behavior change, not missing-token behavior change, not invalid-token challenge behavior change, not protected-resource metadata route behavior change, not Apps SDK iframe/resource implementation, not public ChatGPT App implementation, not public ChatGPT App demo/submission, not remote deployment, not DB query implementation, not schema or migration work, not package script work, not OpenAI API/model integration, not provider/certification/deployment execution, not external communications, not source mutation, not finance write, and not autonomous action.

FP-0146 shipped parser-contract/provider-selection-proof only. FP-0147 hardens the provider-selection evidence path after FP-0146 by recording canonical resource URI, protected-resource metadata, resource indicator, authorization-server discovery, provider evidence matrix, issuer/audience/resource, scope/RBAC/org/company, no-token-passthrough, no-credential-forwarding, metadata URL SSRF/URL-safety, replay, revocation, service-unavailable, dev/test tenant, and mTLS/egress/IP allowlist evidence requirements. It does not choose a provider without complete explicit repo evidence.

## Progress

- [x] 2026-05-23T23:52:03Z - Invoked the repo-local `pocket-cfo-codex-operator` Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-23T23:52:03Z - Preflight confirmed work on `codex/v2bo-read-only-chatgpt-app-mcp-provider-selection-evidence-hardening-local-v1`, authenticated `gh`, PR #325 merged to `main`, current `HEAD` and `origin/main` at `273d690c6897bad703df6bf59605ec28e120d633`, local Postgres/object storage services available, FP-0146 present, FP-0147 absent, FP-0148 absent, and required proof tools present.
- [x] 2026-05-23T23:52:03Z - Baseline proof gates passed before edits for FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100.
- [x] 2026-05-23T23:52:03Z - Read `plugins.md`, active docs, roadmap, FP-0146 through FP-0139 plan records, authorization parser contract/proof files, token-validation runtime/proof files, protected-resource metadata and OAuth security files, remote-host resource files, and route specs before coding.
- [x] 2026-05-23T23:52:03Z - OpenAI Developers exposed API-key setup tooling, not read-only docs tooling. No OpenAI Platform key setup, OpenAI API, model call, or API key was used. Official MCP, RFC, OIDC, and OpenAI web docs were used read-only as protocol planning context.
- [x] 2026-05-23T23:52:03Z - Patched stale FP-0146 closeout wording from PR #325 on this same FP-0147 branch.
- [x] 2026-05-23T23:52:03Z - Added the FP-0147 plan, provider-selection evidence-hardening domain proof bridge, focused specs, and direct proof command.
- [x] 2026-05-24T00:24:18Z - Focused validation and strict same-branch QA passed on this same branch. QA found proof-gate bridge compatibility gaps in existing app-wiring, route-integration sequencing, and route-adapter proof tools for the new FP-0147 plan/proof paths; those were patched before final validation. Final proof sanity also found proof-only authorization-field absence fixtures tripping inherited token-leakage scanners in FP-0144/0145/0146 proof tools; the scanner inputs were narrowed to sanitize only those absence fixtures while preserving real token-material detection, and the full validation ladder was rerun successfully.
- [x] 2026-05-24T00:24:18Z - Full validation passed before closeout, including `pnpm ci:repro:current`. This closeout edit records that the required post-closeout validation subset must remain green before the single commit, push, and PR creation.

## Surprises & Discoveries

PR #325 is merged, and `gh pr view 325` confirms head SHA `a14f7f75475b56147891446bc3d514247d6b9360` and merge commit `273d690c6897bad703df6bf59605ec28e120d633`.

FP-0146 had stale closeout wording that still described post-closeout validation and mechanical release work as pending after PR #325 merged. This branch patches that freshness issue directly, records that same-branch QA found no issues and made no correction, and records that no post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.

OpenAI Developers read-only docs tooling was not available in this local thread. The exposed OpenAI Platform path was API-key setup, which is out of scope, so official public docs were used read-only and no key flow was invoked.

Strict same-branch QA found no provider-selection implementation, provider integration, provider calls, Authorization parser runtime, token parser, JWT decoder, JWKS fetcher, introspection client, OAuth/session/auth middleware, route behavior change, missing-token behavior change, invalid-token challenge behavior change, protected-resource metadata route behavior change, DB/schema/package work, OpenAI API/model call, source mutation, finance write, public asset, listing copy, generated public prose, app submission, external communication, or autonomous action. The only corrections were proof-gate bridge compatibility updates so prior boundary tools accept the exact FP-0147 plan/proof files while continuing to reject FP-0148 and forbidden scope, plus narrow proof-only scanner sanitizers for authorization-field absence fixtures that are not token material.

## Decision Log

- 2026-05-23T23:52:03Z - No provider is selected after FP-0147. Provider mode remains provider-neutral/deferred unless a later slice records complete explicit repo evidence for all required criteria.
- 2026-05-23T23:52:03Z - Parser implementation-readiness may be planned next only if no-token-retention, canonical resource, protected-resource metadata, resource indicator, company selector, provider-neutral/deferred posture, and route-preservation proofs remain green.
- 2026-05-23T23:52:03Z - Production token-validation runtime cannot start after FP-0147.
- 2026-05-23T23:52:03Z - OAuth/session/auth middleware cannot start after FP-0147.
- 2026-05-23T23:52:03Z - Public ChatGPT App demo/submission cannot start after FP-0147.
- 2026-05-23T23:52:03Z - Canonical MCP resource URI evidence must prove public/remote HTTPS posture, equality with protected-resource metadata `resource`, resource indicator binding for authorization and token requests, and a clear distinction between local-only routes and a future public canonical resource. `/mcp` route behavior unchanged.
- 2026-05-23T23:52:03Z - Protected-resource metadata evidence must cover `resource`, `authorization_servers`, `scopes_supported`, WWW-Authenticate metadata URL posture, and no real public metadata publication in this slice. Protected-resource metadata route behavior unchanged.
- 2026-05-23T23:52:03Z - Authorization-server discovery evidence must cover OAuth authorization server metadata, OIDC discovery if applicable, issuer source, authorization endpoint, token endpoint, JWKS URI if JWT/JWKS, introspection endpoint if opaque, token endpoint auth method posture, PKCE support, and client registration posture: CIMD, DCR, or predefined client.
- 2026-05-23T23:52:03Z - Provider evidence matrix contains `jwt_jwks_candidate`, `opaque_introspection_candidate`, and `provider_neutral_deferred`; no provider is selected unless the matrix is complete.
- 2026-05-23T23:52:03Z - Audience/resource binding evidence must cover aud/resource claim or equivalent, canonical resource equality, wrong audience failure mapping, and wrong resource failure mapping.
- 2026-05-23T23:52:03Z - Scope/RBAC/org/company evidence must cover least-privilege scopes, read-only scope naming posture, org binding source, company binding source, company selector fail-closed posture, and insufficient-scope challenge posture.
- 2026-05-23T23:52:03Z - Token-passthrough and credential-forwarding evidence must prove inbound tokens are issued for this MCP server, downstream provider credentials are separate future-only tokens, ChatGPT/OAuth user tokens are not forwarded, and no token echo/logging/fingerprinting exists.
- 2026-05-23T23:52:03Z - Metadata-discovery SSRF and URL-safety evidence must prove public-mode metadata URLs do not target localhost/private/internal networks, authorization server metadata URLs are HTTPS and explicit, no automatic fetching implementation exists in this slice, and future fetchers prove allowlist/denylist and timeout posture.
- 2026-05-23T23:52:03Z - Replay, revocation, and service-unavailable evidence is future runtime posture only and maps unavailable validation services fail-closed.
- 2026-05-23T23:52:03Z - Dev/test tenant evidence is required before runtime implementation; no real production credential examples and no real token examples are allowed.
- 2026-05-23T23:52:03Z - mTLS, egress, and IP allowlist evidence is documented as future public/remote hardening only. No deployment or network config exists in this slice.
- 2026-05-23T23:52:03Z - Future FP-0148 may open only parser-implementation-readiness or provider-evidence correction, not parser implementation and not production token-validation runtime unless a later proof explicitly supersedes this boundary.

## Context and Orientation

Current repo truth after FP-0146:

- `POST /mcp` remains the existing local route.
- GET `/mcp` remains unchanged.
- GET `/.well-known/oauth-protected-resource/mcp` remains the existing local explicit-dependency protected-resource metadata route.
- FP-0130 missing-token challenge behavior remains separate.
- FP-0141/FP-0143 invalid-token behavior remains explicit local sanitized-envelope behavior only.
- FP-0139 result envelopes are the only future validation output contract.
- FP-0146 parser contracts remain intact.
- There is no production token validation, Authorization parser implementation, token parser, JWT decoder, token introspection, JWKS fetch/cache, OAuth, token/session storage, auth middleware, route consumption of test doubles, DB-backed validation, provider call, OpenAI call, public app behavior, or submission path.

Official research used only as read-only planning context:

- MCP Authorization for protected-resource metadata, authorization-server discovery, resource indicators, canonical resource posture, PKCE, access-token handling, and token audience validation.
- MCP Security Best Practices for token passthrough prohibition, confused-deputy prevention, audience/resource binding, least privilege, and no credential forwarding.
- OpenAI Apps SDK Authentication for MCP authorization expectations, protected-resource metadata, resource parameter handling, authorization-server metadata, CIMD/DCR/predefined client posture, token endpoint auth method posture, PKCE, and ChatGPT client posture.
- OpenAI Apps SDK Security & Privacy for least privilege, server-side validation, redaction, audit logs, no secrets/tokens in surfaced data, and launch security review posture.
- OpenAI Apps SDK testing/submission posture only to record that public testing and submission remain downstream and out of scope.
- RFC 8707, RFC 9728, RFC 8414, and OpenID Connect Discovery remain protocol references for resource indicators, protected-resource metadata, authorization-server metadata, and optional OIDC discovery.

These docs are context only. Product source truth for Pocket CFO finance answers remains raw source evidence, Finance Twin state, CFO Wiki state, and proof bundles. FP-0147 creates no finance answer and mutates no source.

## Provider Evidence Matrix

Provider mode after FP-0147: provider-neutral/deferred.

| Mode | Status | Evidence posture | Decision |
| --- | --- | --- | --- |
| `jwt_jwks_candidate` | Candidate only | Incomplete until issuer, audience/resource, JWKS URI, key rotation, unavailable-service fail-closed, scope, org, company, no-passthrough, SSRF, and dev/test tenant evidence are complete. | Not selected. |
| `opaque_introspection_candidate` | Candidate only | Incomplete until issuer, audience/resource or equivalent, introspection endpoint, revocation, unavailable-service fail-closed, scope, org, company, no-passthrough, SSRF, and dev/test tenant evidence are complete. | Not selected. |
| `provider_neutral_deferred` | Active | Complete as the only safe posture because repo evidence does not yet prove a provider decision. | Selected posture, not a provider. |

No provider is selected after FP-0147. The matrix is recorded to prevent provider drift, not to authorize provider integration.

## Evidence Requirements

Canonical resource evidence requirements:

- `https_required_for_public_remote_future`
- `resource_uri_matches_protected_resource_metadata_resource`
- `resource_indicator_binds_authorization_and_token_requests`
- `local_only_route_not_confused_with_public_canonical_resource`
- `no_route_behavior_change_in_this_slice`

Protected-resource metadata evidence requirements:

- `resource_field_posture`
- `authorization_servers_field_posture`
- `scopes_supported_posture`
- `www_authenticate_metadata_url_posture`
- `no_real_public_metadata_publication_in_this_slice`

Authorization-server discovery evidence requirements:

- `oauth_authorization_server_metadata`
- `oidc_discovery_if_applicable`
- `issuer_source`
- `authorization_endpoint`
- `token_endpoint`
- `jwks_uri_if_jwt_jwks`
- `introspection_endpoint_if_opaque`
- `token_endpoint_auth_method_posture`
- `pkce_support`
- `client_registration_posture_cimd_dcr_or_predefined_client`

Resource indicator evidence requirements:

- `authorization_request_resource_parameter`
- `token_request_resource_parameter`
- `canonical_resource_equality`

Audience/resource binding evidence requirements:

- `aud_or_resource_claim_or_equivalent`
- `canonical_resource_equality`
- `wrong_audience_failure_mapping`
- `wrong_resource_failure_mapping`

Scope/RBAC/org/company evidence requirements:

- `least_privilege_scopes`
- `read_only_scope_naming_posture`
- `org_binding_source`
- `company_binding_source`
- `company_selector_fail_closed_posture`
- `insufficient_scope_challenge_posture`

No token passthrough evidence requirements:

- `inbound_tokens_issued_for_this_mcp_server`
- `no_forwarding_of_chatgpt_or_oauth_user_token`
- `no_token_echo_logging_or_fingerprinting`

No credential forwarding evidence requirements:

- `downstream_provider_credentials_are_separate_future_only_tokens`
- `no_reuse_of_inbound_mcp_token_for_downstream_provider`

Metadata URL SSRF/URL-safety evidence requirements:

- `protected_resource_metadata_url_not_localhost_private_or_internal_in_public_mode`
- `authorization_server_metadata_urls_https_and_explicit`
- `no_automatic_fetching_implementation_in_this_slice`
- `future_fetchers_must_prove_allowlist_denylist_and_timeout_posture`

Replay/revocation/service-unavailable evidence requirements:

- `replay_nonce_future_posture`
- `revocation_future_posture`
- `validation_service_unavailable_fail_closed_mapping`
- `introspection_unavailable_fail_closed_mapping`
- `jwks_unavailable_key_rotation_fail_closed_mapping`

Development/test tenant requirements:

- `dev_tenant_or_test_tenant_required_before_runtime_implementation`
- `no_real_production_credential_examples`
- `no_real_token_examples`

mTLS/egress/IP allowlist future requirements:

- `mtls_future_public_remote_hardening_only`
- `egress_ip_allowlist_future_public_remote_hardening_only`
- `no_deployment_or_network_configuration_in_this_slice`

## Failure-State Mapping

Provider evidence failure states are mapped to FP-0139 envelopes or named future-only refusal state:

- `provider_metadata_missing` -> `unsupported_validation_mode`
- `authorization_server_metadata_missing` -> `unsupported_validation_mode`
- `issuer_unproven` -> `unsupported_validation_mode`
- `audience_unproven` -> `wrong_audience`
- `resource_unproven` -> `wrong_resource`
- `scope_unproven` -> `insufficient_scope`
- `org_binding_unproven` -> `wrong_org`
- `company_binding_unproven` -> `company_binding_mismatch`
- `jwks_unavailable` -> `production_validation_unavailable`
- `introspection_unavailable` -> `production_validation_unavailable`
- `revocation_unavailable` -> `production_validation_unavailable`
- `replay_unproven` -> `replay_or_nonce_failure`
- `provider_selection_incomplete` -> `unsupported_validation_mode`
- `token_passthrough_risk` -> `invalid_token`
- `metadata_url_unsafe` -> `future_only_provider_evidence_refusal`
- `validation_service_unavailable` -> `production_validation_unavailable`

FP-0139 result envelopes remain the only future validation output contract. FP-0130 missing-token lane remains separate. Invalid-token challenge remains downstream of sanitized FP-0139 envelopes. Missing-token behavior unchanged. Invalid-token challenge behavior unchanged. Protected-resource metadata route behavior unchanged. The /mcp route behavior unchanged guarantee remains required.

## Proof Bridge

FP-0147 adds proof gates so exactly one FP-0147 path is accepted:

- `plans/FP-0147-read-only-chatgpt-app-mcp-provider-selection-evidence-hardening.md`

The bridge rejects FP-0148 and rejects any other FP-0147 path. It proves:

- FP-0147 is provider-selection evidence-hardening/proof only.
- FP-0147 does not choose provider without explicit complete evidence.
- FP-0147 does not authorize provider calls, provider integration, parser implementation, production token-validation runtime, token parser implementation, JWT decoder implementation, JWKS fetching/caching implementation, token introspection implementation, OAuth/session/auth middleware, route behavior changes, missing-token behavior changes, invalid-token challenge behavior changes, protected-resource metadata route behavior changes, DB/schema/package work, OpenAI API/model calls, source mutation, finance writes, public assets, generated public prose, listing copy, app submission, external communications, or autonomous action.
- Provider-selection evidence matrix is recorded.
- Canonical resource evidence requirements are recorded.
- Protected-resource metadata evidence requirements are recorded.
- Authorization-server discovery evidence requirements are recorded.
- Audience/resource/scope/org/company binding evidence requirements are recorded.
- No token passthrough and no credential forwarding evidence requirements are recorded.
- Metadata URL SSRF/URL-safety evidence requirements are recorded.
- Replay/revocation/service-unavailable fail-closed evidence requirements are recorded.
- Dev/test tenant and mTLS/egress/IP allowlist future evidence requirements are recorded.
- Failure states are mapped to FP-0139 envelopes or `future_only_provider_evidence_refusal`.
- FP-0146 stale closeout is patched if present.
- FP-0148 remains absent.
- FP-0146 parser contracts remain intact.
- FP-0145 runtime contracts remain intact.
- FP-0144 production token-validation sequencing remains intact.
- FP-0143 app wiring remains intact.
- FP-0142 route integration sequencing remains intact.
- FP-0141 invalid-token challenge mapping remains intact.
- FP-0139 result envelopes remain intact.
- FP-0130 missing-token challenge remains intact.
- FP-0125 protected-resource metadata route remains intact.
- FP-0107 route adapter remains intact.
- FP-0106 protocol envelope remains intact.
- FP-0100 public security boundary remains intact.

## Scope Guardrails

Allowed scope:

- This plan.
- FP-0146 closeout/freshness correction.
- Provider-selection evidence-hardening domain proof helpers/specs.
- Proof-gate bridge compatibility for exact FP-0147 acceptance.
- Direct stale active-doc/plugin freshness updates if directly stale.

Forbidden scope:

- Provider selection implementation.
- Provider integration.
- Provider calls.
- Authorization parser runtime or Authorization header parsing.
- Token parsing, JWT decoding, JWKS fetching/caching, token introspection, OAuth, token/session storage, auth middleware.
- `/mcp` route behavior change.
- Missing-token behavior change.
- Invalid-token challenge behavior change.
- Protected-resource metadata route behavior change.
- Evaluator/test-double route consumption.
- Real token examples, JWT-like examples, Bearer material, token-derived fingerprints, token echo, or token logging.
- DB/schema/package/data/OpenAI/provider/source/finance-write scope.
- Public assets, generated public prose, listing copy, screenshots, submission materials, external communications, provider/certification/deployment execution, or autonomous action.
- FP-0148 creation.

## Validation Ladder

Required validation for this slice:

- `git diff --check`
- `pnpm exec tsx tools/read-only-mcp-provider-selection-evidence-hardening-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-authorization-parser-contracts-provider-selection-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-token-validation-runtime-contracts-proof-hardening-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-production-token-validation-sequencing-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-invalid-token-app-wiring-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-invalid-token-route-integration-sequencing-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-local-runtime-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-token-validation-result-envelope-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-invalid-token-challenge-contract-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-www-authenticate-missing-token-challenge-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-protected-resource-metadata-local-route-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-route-adapter-proof.mjs`
- `pnpm exec tsx tools/read-only-public-app-security-boundary-proof.mjs`
- `pnpm exec tsx tools/read-only-mcp-protocol-envelope-proof.mjs`
- `pnpm exec tsx tools/read-only-endpoint-route-ownership-proof.mjs`
- `pnpm exec tsx tools/read-only-endpoint-architecture-proof.mjs`
- `pnpm exec tsx tools/read-only-chatgpt-app-mcp-proof.mjs`
- `pnpm exec tsx tools/benchmark-community-pack-proof.mjs`
- `pnpm exec tsx tools/bounded-llm-orchestration-proof.mjs`
- `pnpm exec tsx tools/read-only-evidence-app-proof.mjs`
- `pnpm exec tsx tools/document-precision-foundation-proof.mjs`
- `pnpm exec tsx tools/evidence-index-foundation-proof.mjs`
- `pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts src/read-only-app-mcp-authorization-parser-contracts.spec.ts src/read-only-app-mcp-provider-selection-evidence-hardening.spec.ts`
- `pnpm --filter @pocket-cto/control-plane exec vitest run src/modules/read-only-app-mcp-endpoint/routes.spec.ts src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.spec.ts src/modules/read-only-app-mcp-endpoint/invalid-token-challenge.spec.ts src/app.spec.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm ci:repro:current`

If a post-validation closeout edit is made, rerun `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

## Outcomes & Retrospective

FP-0147 closes as provider-selection evidence-hardening and canonical resource OAuth-readiness proof only.

Outcomes:

- Provider mode remains provider-neutral/deferred; no provider is selected.
- Parser implementation-readiness may be planned next only if no-token-retention, canonical resource, protected-resource metadata, resource indicator, company selector, provider-neutral/deferred posture, and route-preservation proofs remain green.
- Production token-validation runtime, OAuth/session/auth middleware, and public ChatGPT App demo/submission remain blocked.
- Canonical resource, protected-resource metadata, resource indicator, authorization-server discovery, provider matrix, issuer/audience/resource, scope/RBAC/org/company, no-token-passthrough, no-credential-forwarding, metadata URL SSRF/URL-safety, replay, revocation, service-unavailable, dev/test tenant, and mTLS/egress/IP allowlist evidence requirements are recorded.
- Failure states map to FP-0139 envelopes or `future_only_provider_evidence_refusal`.
- FP-0130 missing-token lane, invalid-token challenge downstream of sanitized FP-0139 envelopes, protected-resource metadata route posture, and `/mcp` route behavior are preserved.
- FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100 boundaries remain intact.
- FP-0146 closeout freshness was corrected with PR #325 head SHA `a14f7f75475b56147891446bc3d514247d6b9360`, merge commit `273d690c6897bad703df6bf59605ec28e120d633`, same-branch QA/no-correction posture, and no post-merge QA requirement when current main matches validated PR/merge posture and CI remains green.
- No FP-0148 was created.

Validation passed before this closeout:

- All required FP-0147 proof tools and inherited boundary proof tools passed, including the inherited proof-scanner sanitizer rerun for FP-0144/0145/0146.
- Focused domain specs passed: 18 files, 200 tests.
- Focused control-plane specs passed: 4 files, 123 tests.
- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm test` passed.
- `pnpm ci:repro:current` passed in a clean temp worktree.

Because this closeout is a post-validation doc edit, release requires the post-closeout subset to remain green: `git diff --check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

No post-merge QA is recommended unless this branch receives a substantive correction after final validation, GitHub checks are suspicious, or `main` behaves differently after merge.
