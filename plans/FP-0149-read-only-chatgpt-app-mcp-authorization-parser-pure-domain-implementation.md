# Add read-only ChatGPT App MCP Authorization parser

## Purpose / Big Picture

Target phase: V2BQ read-only ChatGPT App/MCP Authorization parser pure-domain implementation.

FP-0149 is the first parser implementation slice after the merged FP-0148 readiness proof. It implements only a pure-domain/local-only Authorization header presence and scheme classifier in `packages/domain`. It does not wire the parser into `/mcp`, does not validate tokens, does not parse token bodies, does not decode JWTs, does not fetch JWKS, does not call introspection endpoints, does not implement OAuth, does not store token/session state, does not add auth middleware, does not select or call a provider, does not change route behavior, does not add DB/schema/package work, does not call OpenAI APIs or models, does not mutate sources, does not write finance state, and does not create public ChatGPT App submission material.

The user-visible proof point is narrow: Pocket CFO can classify whether an injected Authorization header is absent, structurally malformed, unsupported, or Bearer-present inside a deterministic parser stack while returning only the FP-0146 sanitized output fields and retaining no raw header, raw credential material, or token-derived fingerprint.

## Progress

- [x] 2026-05-24T12:46:30Z - Invoked the repo-local `pocket-cfo-codex-operator` Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-24T12:46:30Z - Preflight confirmed work on `codex/v2bq-read-only-chatgpt-app-mcp-authorization-parser-pure-domain-implementation-local-v1`, authenticated `gh`, PR #327 merged to `main`, current `HEAD` and `origin/main` at `9a562161b74ff8bc77d0366166300a6cac259444`, local Postgres/object storage services available, FP-0148 present, FP-0149 absent, FP-0150 absent, and required proof tools present.
- [x] 2026-05-24T12:46:30Z - Baseline proof gates passed before edits for FP-0148, FP-0147, FP-0146, FP-0145, FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100.
- [x] 2026-05-24T12:46:30Z - Official MCP, RFC, and OpenAI Apps SDK docs were reviewed read-only as boundary context. OpenAI Developers tool discovery exposed only API-key setup surfaces, so no OpenAI key setup, OpenAI API call, or model call was used.
- [x] 2026-05-24T12:46:30Z - Patched stale FP-0148 closeout freshness to record PR #327 merge facts and no post-merge QA requirement when `main` matches the validated PR head/merge posture and CI remains green.
- [x] 2026-05-24T12:46:30Z - Created the FP-0149 plan and began the pure-domain parser implementation, focused specs, and direct proof bridge.
- [x] 2026-05-24T13:30:36Z - Implemented the pure-domain parser, focused specs, exact FP-0149 proof command, bridge compatibility, and direct active-doc/plugin freshness refresh.
- [x] 2026-05-24T13:30:36Z - Strict same-branch QA found proof-gate compatibility gaps in inherited FP-0143, FP-0142, and FP-0107 changed-path boundaries for the exact FP-0149 parser/proof files. Those proof-only bridge corrections stayed on this branch and did not change route/runtime/provider behavior.
- [x] 2026-05-24T13:30:36Z - Final validation passed: `git diff --check`, the direct FP-0149 proof, the full requested proof ladder, focused domain/control-plane Vitest suites, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-05-24T14:55:19Z - FP-0150 preflight freshness correction recorded that PR #328 merged to `main` with head SHA `fdde3b35f195bb357db175116c511fe6ab10868d` and merge commit `bbefbbaf2f4bd65be96fbecf246eaca5120149b8`. Same-branch QA found no issues and made no correction. No separate polish branch or post-merge QA branch was created.

## Surprises & Discoveries

PR #327 is merged. `gh pr view 327` confirmed head SHA `2877d8caffb4ffecd5e99a7b59656903fca8682b` and merge commit `9a562161b74ff8bc77d0366166300a6cac259444`.

PR #328 merged. `gh pr view 328` confirmed head SHA `fdde3b35f195bb357db175116c511fe6ab10868d` and merge commit `bbefbbaf2f4bd65be96fbecf246eaca5120149b8`.

OpenAI Developers did not expose read-only docs tooling in this thread. The available OpenAI Platform path was API-key setup, which is explicitly out of scope. Official public MCP/RFC/OpenAI docs were used only as read-only boundary context.

FP-0148 closeout was missing PR #327 merge facts. This branch patches that freshness issue directly and does not create a separate polish or post-merge QA branch.

Inherited proof tools needed exact FP-0149 changed-path compatibility so older boundary proofs could distinguish pure-domain parser implementation from route/app-construction work. The corrections were limited to proof allowlists and did not alter runtime behavior, parser output, route integration posture, provider posture, or auth posture.

FP-0149 closeout wording was stale after PR #328 merged. The FP-0150 branch patches that freshness issue directly; no post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.

## Decision Log

- 2026-05-24T12:46:30Z - Authorization parser implementation is included in FP-0149, but only as pure-domain/local-only parser code and local proof tooling.
- 2026-05-24T12:46:30Z - Parser output may not carry raw header material or raw credential material.
- 2026-05-24T12:46:30Z - Parser output may not carry token-derived fingerprint, prefix, suffix, length, hash, digest, claims, decoded header, decoded payload, or normalized credential text. The exact forbidden token-derived output fields remain `token_prefix`, `token_suffix`, `token_length`, `token_hash`, `token_digest`, `token_claims`, `decoded_header`, and `decoded_payload`.
- 2026-05-24T12:46:30Z - `/mcp` route consumption remains blocked after FP-0149. Route integration remains future-only.
- 2026-05-24T12:46:30Z - Production token validation remains blocked after FP-0149.
- 2026-05-24T12:46:30Z - Provider selection remains provider-neutral/deferred after FP-0149. Provider calls and provider integration remain blocked.
- 2026-05-24T12:46:30Z - OAuth/session/auth middleware remains blocked after FP-0149.
- 2026-05-24T12:46:30Z - Public ChatGPT App demo/submission remains blocked after FP-0149.
- 2026-05-24T12:46:30Z - Pure parser input shape is `authorizationHeader?: string | readonly string[] | null`. Array input represents structurally multiple Authorization values only, not route integration. Input is inspected only inside the pure parser call and is never returned, stored, logged, hashed, digested, fingerprinted, or forwarded.
- 2026-05-24T12:46:30Z - Pure parser output is exactly the FP-0146 sanitized output object: `authorization_presence`, `authorization_scheme_classification`, `credential_material_observed`, `parser_contract_version`, `sanitized_request_metadata_reference`, `canonical_resource_uri_reference`, `resource_indicator_reference`, `company_selector_reference`, `no_raw_header_retained`, `no_raw_token_retained`, and `no_token_derived_fingerprint_retained`.
- 2026-05-24T12:46:30Z - Failure-state mapping remains separate from sanitized output: `missing_authorization` maps to the FP-0130 missing-token lane; `malformed_authorization`, `multiple_authorization_values`, `bearer_without_material`, and `bearer_with_unsafe_whitespace_or_control_characters` map to FP-0139 `malformed_authorization`; `unsupported_scheme` maps to FP-0139 `unsupported_validation_mode`; `token_material_passthrough_attempt` maps to FP-0139 `invalid_token`.
- 2026-05-24T12:46:30Z - Parser fixtures use safe sentinels only: `[credential omitted]`, `[not-a-token]`, `[credential-present]`, and `[passthrough-attempt]`. No realistic Authorization header examples, JWT-like strings, credential-looking bearer material, token-derived fingerprints, or copied external examples are allowed.
- 2026-05-24T12:46:30Z - Future FP-0150 may open only route-integration sequencing. It may not implement route integration, production token validation, OAuth/session/auth middleware, provider calls, public app behavior, or app submission.
- 2026-05-24T14:55:19Z - PR #328 merged. Same-branch QA found no issues and made no correction. No post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.

## Context and Orientation

FP-0148 shipped readiness and no-token-retention proof hardening only. It explicitly said parser implementation could not start from FP-0148 alone and that a future FP-0149 could implement only a pure-domain/local-only parser if the readiness proof stayed green.

Current runtime posture before this slice:

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

- MCP Authorization and MCP Security Best Practices inform token audience/resource validation and token passthrough prohibition, but FP-0149 does not implement validation.
- RFC 6750 informs the Bearer scheme grammar posture, but FP-0149 does not validate bearer token contents.
- RFC 9728 informs protected-resource metadata and WWW-Authenticate discovery posture, but FP-0149 does not change metadata routes or challenges.
- OpenAI Apps SDK Authentication and Security & Privacy docs inform ChatGPT App auth boundaries, but FP-0149 does not implement an Apps SDK iframe, public app, OAuth flow, or submission.

## Plan of Work

1. Patch FP-0148 closeout freshness with PR #327 merge facts if stale.
2. Create exactly one FP-0149 plan at `plans/FP-0149-read-only-chatgpt-app-mcp-authorization-parser-pure-domain-implementation.md`.
3. Add a pure parser module at `packages/domain/src/read-only-app-mcp-authorization-parser.ts`.
4. Add focused parser specs at `packages/domain/src/read-only-app-mcp-authorization-parser.spec.ts`.
5. Add a direct proof command at `tools/read-only-mcp-authorization-parser-pure-domain-implementation-proof.mjs`.
6. Patch proof-gate bridge fields so exactly this FP-0149 plan is accepted while FP-0150 was absent during FP-0149 validation and older FP boundaries remain intact.
7. Refresh directly stale active docs and `plugins.md` only where they still frame FP-0148 as active/future-only or FP-0149 as blocked.
8. Run focused validation and strict same-branch QA. Patch this same branch if a real defect is found.
9. Close out the plan, rerun required validation if closeout edits happen after validation, commit exactly once, push, and create the PR.

## Concrete Steps

Authorized edit surfaces:

- `plans/FP-0149-read-only-chatgpt-app-mcp-authorization-parser-pure-domain-implementation.md`
- `plans/FP-0148-read-only-chatgpt-app-mcp-authorization-parser-implementation-readiness.md` only for closeout/freshness correction
- `packages/domain/src/read-only-app-mcp-authorization-parser.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser.spec.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser-contracts*.ts` only for direct type reuse/proof-gate compatibility
- `packages/domain/src/read-only-app-mcp-authorization-parser-implementation-readiness*.ts` only for FP-0149 bridge compatibility
- `packages/domain/src/read-only-app-mcp-provider-selection-evidence-hardening*.ts` only for bridge compatibility if needed
- `packages/domain/src/read-only-app-mcp-token-validation*.ts` only for shared no-token-leakage helper/spec reuse and bridge compatibility if needed
- `packages/domain/src/read-only-app-mcp-token-validation-result-envelope*.ts`, `read-only-app-mcp-www-authenticate*.ts`, `read-only-app-mcp-protected-resource-metadata*.ts`, `read-only-app-mcp-oauth-security*.ts`, and `read-only-app-mcp-remote-host-resource*.ts` only for proof bridge/spec compatibility if directly needed
- `packages/domain/src/index.ts` for direct exports
- `tools/read-only-mcp-authorization-parser-pure-domain-implementation-proof.mjs`
- existing proof tools only for exact FP-0149 bridge compatibility and shared leakage-sanitizer reuse
- directly stale README/CODEX_README/START/ACTIVE_DOCS/PROJECT_STATE/V2_BOUNDARY/ROADMAP/security-doc/demo-doc/plugins refresh only if directly stale

Forbidden edit surfaces: routes, route behavior, DB/schema/migrations, package scripts, provider integration, OpenAI API/model code, source data, finance write paths, public assets, app-submission material, deployment config, and FP-0150.

## Validation and Acceptance

Acceptance is observable when:

- Exactly one FP-0149 plan exists at `plans/FP-0149-read-only-chatgpt-app-mcp-authorization-parser-pure-domain-implementation.md`.
- Successor-plan posture is explicit: FP-0150 was absent at FP-0149 closeout, and the later FP-0150 branch may only record route-integration sequencing with FP-0151 absent.
- The parser is pure-domain/local-only.
- The parser module imports no route, DB, provider, OpenAI, crypto, fs, network, process/env, logger, or time APIs.
- The parser returns absent/missing behavior for undefined, null, and empty arrays.
- The parser returns `multiple_authorization_values` for structural multi-value input.
- The parser returns malformed for empty/whitespace input.
- The parser returns unsupported scheme without retaining material.
- The parser returns Bearer-present classification with `credential_material_observed: true` using only a safe sentinel.
- The parser returns `bearer_without_material` when the Bearer scheme has no material.
- The parser returns `bearer_with_unsafe_whitespace_or_control_characters` for unsafe whitespace/control structure without retaining material.
- The parser returns `token_material_passthrough_attempt` only through a safe sentinel path or fail-closed non-forwarding path.
- Parser output contains only FP-0146 sanitized fields.
- Parser output never includes raw header, raw credential material, token prefix/suffix/length/hash/digest/claims, decoded header, decoded payload, normalized credential text, or token-derived fingerprint.
- Parser failure states map to FP-0139 or FP-0130.
- Shared proof-only no-token-leakage sanitizer accepts safe proof-only absence/retention terms and rejects credential-shaped material.
- `/mcp` route behavior, missing-token behavior, invalid-token challenge behavior, and protected-resource metadata route behavior remain unchanged.
- FP-0148/0147/0146/0145/0144/0143/0142/0141/0139/0130/0125/0107/0106/0100 boundaries remain intact.

Validation commands:

```bash
git diff --check
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

This slice is idempotent because it accepts exactly one FP-0149 plan path, adds one pure parser module, one focused spec, one direct proof command, exact bridge compatibility, direct stale-doc refresh only where needed, and no runtime route wiring. Re-running the proof command should accept this exact FP-0149 file, reject duplicate FP-0149 files, and reject any FP-0150 file.

If validation fails, do not widen scope. Patch only the parser module, parser spec, FP-0149 plan, FP-0148 freshness note, proof bridge, shared sanitizer compatibility, or directly stale docs on this branch. If failure points to missing services, auth failure, unrelated dirty files, or a proof failure that requires runtime/auth/route/provider expansion, stop and report the exact blocker.

Rollback is local-only: remove the FP-0149 plan, parser module/spec, direct proof command, exact bridge edits, FP-0148 freshness correction, and stale-doc refresh. No raw source file, uploaded evidence, persisted finance state, database schema, route behavior, app construction, package script, provider state, OpenAI state, public asset, or external communication is mutated by this plan.

## Artifacts and Notes

Primary artifacts:

- `plans/FP-0149-read-only-chatgpt-app-mcp-authorization-parser-pure-domain-implementation.md`
- `packages/domain/src/read-only-app-mcp-authorization-parser.ts`
- `packages/domain/src/read-only-app-mcp-authorization-parser.spec.ts`
- `tools/read-only-mcp-authorization-parser-pure-domain-implementation-proof.mjs`
- exact FP-0149 proof bridge edits
- stale FP-0148 closeout freshness correction
- direct active-doc/plugin refresh if stale

Evidence and replay posture: FP-0149 changes pure-domain parser code only. It does not change mission state, ingest sources, source registry state, CFO Wiki finance facts, finance answers, reports, approvals, monitor findings, or durable finance artifacts. Replay implications are covered by the explicit no-route/no-runtime/no-mission-state posture and machine-readable proof output. Any future route consumption slice must record replay behavior or a named reason why replay is not applicable.

Provenance, freshness, and limitations: official MCP/RFC/OpenAI docs were used only as read-only parser boundary context. Finance evidence remains the source of truth for product answers. FP-0149 creates no finance answer, no source-derived report, no public prose artifact, no generated advice, and no external communication.

Monitoring posture: F6 monitoring semantics are unchanged. No monitoring stored-state input contract, alert semantics, proof-bundle delivery path, freshness posture, missing-source posture, or human-review boundary changes in this slice.

Workflow and environment posture: no `WORKFLOW.md`, stack-pack, package script, dependency, deployment config, or environment variable change is needed.

## Interfaces and Dependencies

No runtime interface changes in FP-0149:

- `POST /mcp` remains the existing local route.
- GET `/mcp` remains unchanged.
- GET `/.well-known/oauth-protected-resource/mcp` remains unchanged.
- FP-0130 missing-token behavior remains separate.
- FP-0141/FP-0143 invalid-token challenge behavior remains explicit local sanitized-envelope dependency behavior only.
- FP-0139 result envelopes remain the only future validation output contract.
- FP-0146 sanitized parser contracts remain the only parser output boundary.
- FP-0147 provider mode remains provider-neutral/deferred.
- No route consumes parser output, evaluator output, or test-double output.

Future-only dependencies after FP-0149:

- Route-integration sequencing may start only in a separate FP-0150 plan if all proof gates remain green.
- Route integration itself remains blocked.
- Production token validation remains blocked.
- Provider selection, provider integration, and provider calls remain blocked.
- Token parser, JWT decoder, JWKS fetch/cache, token introspection, OAuth/session/auth middleware, DB/schema/package work, OpenAI/model calls, public app behavior, app submission, source mutation, finance write, external communication, and autonomous action remain blocked.

## Outcomes & Retrospective

FP-0149 closes as a pure-domain/local-only Authorization parser implementation slice. It adds deterministic parser classification for absent, malformed, unsupported, Bearer-present sentinel, unsafe whitespace/control, structural multi-value, and safe passthrough-attempt sentinel cases while returning only the FP-0146 sanitized output fields.

The parser never returns, stores, hashes, digests, logs, forwards, or fingerprints raw Authorization header material or credential material. It emits no token prefix, suffix, length, hash, digest, claims, decoded header, decoded payload, normalized credential text, or token-derived fingerprint.

Strict same-branch QA found no product behavior issue. It did find narrow proof durability work: inherited FP-0143, FP-0142, and FP-0107 proof changed-path boundaries needed to accept the exact FP-0149 plan, parser module/spec, and proof tool. Those corrections remained proof-only and were rerun through the validation ladder.

Final validation passed before this closeout edit: `git diff --check`, the direct FP-0149 proof, FP-0148/0147/0146/0145/0144/0143/0142/0141/0139/0130/0125/0107/0106/0100 boundary proofs, endpoint ownership and architecture proofs, read-only app/evidence/document/index proofs, focused domain and control-plane Vitest suites, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.

At FP-0149 closeout, no successor plan had been created. This FP-0150 branch now creates exactly one successor record for parser material-observation hardening and route-integration sequencing only; route consumption, route integration implementation, production token validation, provider selection/calls/integration, token parser/JWT/JWKS/introspection, OAuth/session/auth middleware, DB/schema/package work, OpenAI/model calls, source mutation, finance writes, public assets, generated public prose, app submission, external communications, and autonomous action remain blocked.

The stale FP-0149 closeout wording was patched on the FP-0150 branch. PR #328 merged with head SHA `fdde3b35f195bb357db175116c511fe6ab10868d` and merge commit `bbefbbaf2f4bd65be96fbecf246eaca5120149b8`. Same-branch QA found no issues and made no correction. No post-merge QA is required when current main matches the validated PR head/merge posture and CI remains green.
