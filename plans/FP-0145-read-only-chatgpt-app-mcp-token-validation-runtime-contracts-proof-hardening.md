# Harden read-only ChatGPT App MCP token-validation runtime contracts

## Purpose / Big Picture

Target phase: V2BM read-only ChatGPT App/MCP token-validation runtime-contract and proof-hardening foundation.

FP-0145 is the local proof-hardening and runtime-contract slice required after shipped FP-0144. FP-0144 decided production token-validation runtime cannot start from current repo truth and that one more proof-hardening/runtime-contract slice is required before any runtime validation lane can open. FP-0145 is that slice.

FP-0145 defines provider-neutral runtime contracts and proof gates only. FP-0145 does not parse, decode, validate, introspect, fetch, store, authorize, authenticate, or route tokens. FP-0145 does not implement production token validation. FP-0145 does not implement an Authorization header parser, token parser, JWT decoder, JWKS fetch/cache, token introspection, OAuth, token/session storage, auth middleware, DB query, schema, migration, route behavior, missing-token behavior, invalid-token challenge behavior, protected-resource metadata route behavior, Apps SDK iframe/resource behavior, public ChatGPT App behavior, app submission, OpenAI API/model calls, provider calls, source mutation, finance writes, generated public prose, public assets, external communications, or autonomous action.

The purpose is to make future runtime work safer by proving exactly what later parser, provider-selection, JWT/JWKS, introspection, OAuth/session, and auth middleware slices may depend on. Production token-validation runtime still cannot start after FP-0145.

## Progress

- [x] 2026-05-23T16:01:59Z - Invoked the repo-local `pocket-cfo-codex-operator` Finance Plan Orchestrator, Modular Architecture Guard, Source Provenance Guard, CFO Wiki Maintainer, Evidence Bundle Auditor, F6 Monitoring Semantics Guard, Validation Ladder Composer, and Pocket CFO Handoff Auditor. GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
- [x] 2026-05-23T16:01:59Z - Preflight confirmed work on `codex/v2bm-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-proof-hardening-local-v1`, clean worktree, authenticated `gh`, live local Postgres/object storage services, FP-0144 present, FP-0145 absent, FP-0146 absent, and required FP-0144 proof tooling present.
- [x] 2026-05-23T16:01:59Z - Baseline proof gates passed before edits for FP-0144, FP-0143, FP-0142, FP-0141, FP-0139, FP-0130, FP-0125, FP-0107, FP-0106, and FP-0100.
- [x] 2026-05-23T16:01:59Z - OpenAI Developers exposed only API-key setup tooling, not read-only documentation tooling. No OpenAI Platform key setup was used. Official web docs were used read-only for MCP Authorization, MCP Security Best Practices, Apps SDK Authentication, Apps SDK Security & Privacy, Apps SDK testing, and Apps SDK submission posture.
- [x] 2026-05-23T16:24:04Z - Patched the FP-0144 proof bridge so forbidden OpenAI/model/provider/source/finance/public/submission scope checks are top-level proof-failing fields and no-token-leakage scanning covers changed docs, TypeScript source, specs, and proof tools.
- [x] 2026-05-23T16:24:04Z - Added FP-0145 runtime-contract/proof-hardening domain helpers, focused specs, and direct proof tooling without runtime validation implementation.
- [x] 2026-05-23T16:24:04Z - Refreshed directly stale active docs/plugin notes that still described FP-0145 as absent or future-only.
- [x] 2026-05-23T16:24:04Z - Ran focused validation and the required proof ladder; same-branch QA found older proof tools that needed exact FP-0145 allowed-path compatibility updates, and those corrections were patched on this branch without runtime scope.
- [x] 2026-05-23T16:31:36Z - Post-closeout final validation passed: `git diff --check`, all required proof tools, focused domain/control-plane specs, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm ci:repro:current`.
- [x] 2026-05-23T22:45:59Z - Commit, push, and PR creation completed through PR #324. `gh pr view 324` confirms merged PR #324, head SHA `9f79fe0c0ce17c9ce7e1a07990324c0ef2295fd3`, and merge commit `6fd000554cbaf2afd8c33b0a986ee656612fc4f3`.
- [x] 2026-05-23T22:45:59Z - Same-branch QA corrected `plugins.md` only. No post-merge QA is required when current `main` matches the validated PR head/merge posture and CI remains green.

## Surprises & Discoveries

The pre-edit FP-0144 proof already had nested forbidden source-scope details, but the externally asserted proof bridge needed top-level fields for OpenAI API calls, model calls, provider calls, source mutation, finance writes, external communications, public assets, generated public prose, and app submission so those exclusions fail plainly.

OpenAI Developers docs tooling was not exposed as read-only tooling in this local thread. Only OpenAI Platform API-key setup tools were exposed, and those are out of scope. Official web docs and MCP/RFC docs were used as read-only planning context only.

Older proof bridge tools with exact changed-path allowlists needed direct compatibility refreshes for the single FP-0145 plan, domain proof-helper, and direct proof-tool paths. The QA correction stayed proof-only and did not widen route, DB, schema, package, source, finance, OpenAI, provider, public, or auth runtime scope.

`pnpm ci:repro:current` initially failed once in a temporary checkout on an unrelated control-plane orchestrator DB spec after the local full `pnpm test` run had passed. The isolated `src/modules/orchestrator/drizzle-service.spec.ts` spec then passed locally, so the defect was treated as transient integration-DB behavior and the final post-closeout reproducibility run remains the gating result.

Post-merge freshness for PR #324 was corrected on the FP-0146 branch only because this plan still had a stale unchecked commit/push/PR item. PR #324 is merged with head SHA `9f79fe0c0ce17c9ce7e1a07990324c0ef2295fd3` and merge commit `6fd000554cbaf2afd8c33b0a986ee656612fc4f3`; same-branch QA corrected `plugins.md` only, and no post-merge QA is required when current `main` matches the validated PR head/merge posture and CI remains green.

## Decision Log

- 2026-05-23T16:01:59Z - FP-0145 defines provider-neutral runtime contracts and proof gates only. It does not authorize production token-validation runtime.
- 2026-05-23T16:01:59Z - FP-0145 does not authorize production token validation runtime. Production token-validation runtime still cannot start after FP-0145.
- 2026-05-23T16:01:59Z - Provider mode remains provider-neutral/unresolved. JWT/JWKS and opaque-token introspection are future-only adapter contracts, not implementations.
- 2026-05-23T16:01:59Z - Only a parser contract may open next. Parser implementation remains blocked until no-token-leakage, canonical resource, provider/resource, and sanitized input-boundary prerequisites are proven.
- 2026-05-23T16:01:59Z - Future runtime input may represent Authorization presence, scheme classification, sanitized validation request metadata, canonical resource URI reference, resource indicator reference, and company selector reference, but not raw token material.
- 2026-05-23T16:01:59Z - Future validation source contracts are interfaces/specs only: provider-neutral validator, JWT/JWKS adapter future-only, opaque-token introspection adapter future-only, revocation/replay future-only, and issuer/audience/resource/scope/org/company checks future-only.
- 2026-05-23T16:01:59Z - Machine proof records the exact contract labels: provider neutral token validator contract, jwt jwks adapter future only, opaque introspection adapter future only, revocation replay future only, and issuer audience resource scope org company future checks.
- 2026-05-23T16:01:59Z - Canonical resource URI, protected-resource metadata, resource indicators, authorization server discovery, issuer, audience/resource, scope, org/company binding, company selector, and no-token-leakage are prerequisites.
- 2026-05-23T16:01:59Z - Clock skew, key rotation, JWKS cache, introspection availability, revocation, replay detection, validation-service-unavailable, and fail-closed behavior are future runtime prerequisites.
- 2026-05-23T16:01:59Z - FP-0139 result envelopes remain the only future validation output contract. Missing-token behavior stays the FP-0130 lane. Invalid-token challenge behavior stays downstream of sanitized FP-0139 envelopes.
- 2026-05-23T16:01:59Z - /mcp route behavior unchanged, missing-token behavior unchanged, invalid-token challenge behavior unchanged, and protected-resource metadata route behavior unchanged.
- 2026-05-23T16:01:59Z - A future FP-0146 may open parser-contract-only or provider-selection-proof-only work, not runtime implementation, unless this plan is explicitly superseded by a later proof slice.
- 2026-05-23T16:01:59Z - Public ChatGPT App demo and submission remain future-only.
- 2026-05-23T16:24:04Z - Compatibility updates to existing proof bridge tools may accept the exact FP-0145 proof-hardening artifacts while FP-0146 remains absent; they do not authorize generic successor plan sprawl or runtime token-validation behavior.
- 2026-05-23T22:45:59Z - PR #324 is the merged FP-0145 delivery record. The post-merge freshness correction updates this plan only; it does not create a separate polish branch or require post-merge QA when current `main` matches the validated PR head/merge posture and CI remains green.

## Context and Orientation

FP-0144 is closed as docs-and-plan/proof-gate compatibility only. It says production token-validation runtime cannot start from current repo truth, JWT/JWKS versus opaque-token introspection remains unresolved, Authorization parsing remains deferred, FP-0139 result envelopes remain the only output contract, missing-token behavior stays separate, invalid-token challenge emission remains downstream of sanitized FP-0139 envelopes, and one more local proof-hardening/runtime-contract slice is required.

Current repo truth:

- `POST /mcp` remains the existing local route.
- GET `/mcp` remains unchanged.
- GET `/.well-known/oauth-protected-resource/mcp` remains the existing local explicit-dependency protected-resource metadata route.
- FP-0130 missing-token challenge behavior remains separate.
- FP-0141/FP-0143 invalid-token behavior remains explicit local sanitized-envelope behavior only.
- FP-0139 result envelopes are proof/local envelopes, not production authentication decisions.
- There is no production token validation, Authorization parser, token parser, JWT decoder, token introspection, JWKS fetch/cache, OAuth, token/session storage, auth middleware, route consumption of test doubles, DB-backed validation, provider call, OpenAI call, public app behavior, or submission path.

Official research used only as read-only planning context:

- MCP Authorization, latest current spec, for protected-resource metadata, resource indicators, canonical resource URI, access token handling, audience/resource validation, and 400/401/403 posture.
- MCP Security Best Practices for token passthrough prohibition, confused-deputy prevention, audience/resource binding, least privilege, and no credential forwarding.
- OpenAI Apps SDK Authentication for MCP authorization expectations, protected-resource metadata, resource parameter echoing, authorization-server metadata, and ChatGPT client posture.
- OpenAI Apps SDK Security & Privacy for least privilege, explicit consent, server-side validation, redaction, audit logs, and avoiding secrets or tokens in surfaced data.
- OpenAI Apps SDK testing and submission docs only to record that public testing/submission remains downstream and out of scope.
- RFC 6750, RFC 8707, and RFC 9728 remain relevant protocol references from FP-0144 for Bearer scheme challenges, resource indicators, and protected-resource metadata.

These docs are context only. Product source truth for Pocket CFO finance answers remains raw source evidence, Finance Twin state, CFO Wiki state, and proof bundles. FP-0145 creates no finance answer and mutates no source.

## Plan of Work

1. Harden the existing FP-0144 proof bridge before or alongside FP-0145 so forbidden source-scope checks are top-level fields and no-token-leakage scanning covers changed docs, TypeScript source, specs, and proof tools.
2. Create exactly one Finance Plan: `plans/FP-0145-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-proof-hardening.md`.
3. Add proof-only domain helpers under `packages/domain/src/read-only-app-mcp-token-validation-runtime-proof-hardening.ts` and export them through the existing runtime/index boundary.
4. Add focused tests to existing token-validation runtime and token-validation specs so the named validation commands cover FP-0145.
5. Add `tools/read-only-mcp-token-validation-runtime-contracts-proof-hardening-proof.mjs` as the direct proof command.
6. Refresh directly stale active docs and `plugins.md` only where they still say FP-0145 is absent or future-only.
7. Run focused validation and full validation. If QA finds a real defect, patch this same branch and rerun the required gates.
8. Close out this plan, rerun the required post-closeout gates if this file changes after validation, commit exactly once, push, and create the PR.

## Concrete Steps

Edit only the authorized surfaces:

- `plans/FP-0145-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-proof-hardening.md`
- `plans/FP-0144-read-only-chatgpt-app-mcp-production-token-validation-sequencing-master-plan.md` only if a tiny shipped-state/proof-gap QA note is directly needed
- `packages/domain/src/read-only-app-mcp-token-validation*.ts`
- `packages/domain/src/read-only-app-mcp-token-validation-runtime*.ts`
- `packages/domain/src/read-only-app-mcp-token-validation-result-envelope*.ts`
- directly needed existing proof/spec bridge files
- `tools/read-only-mcp-token-validation-runtime-contracts-proof-hardening-proof.mjs`
- `tools/read-only-mcp-production-token-validation-sequencing-proof.mjs`
- directly stale active docs and `plugins.md`

Do not edit route behavior, DB/schema/migration files, package scripts, public assets, app-submission material, source data, provider configuration, OpenAI key setup, or runtime auth code.

## Validation and Acceptance

Acceptance is observable when:

- Exactly one FP-0145 file exists at `plans/FP-0145-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-proof-hardening.md`.
- FP-0146 remains absent.
- FP-0145 is contract/proof-hardening only.
- FP-0145 does not authorize production token-validation runtime.
- FP-0145 does not authorize Authorization parser implementation, token parser implementation, JWT decoder implementation, JWKS fetching/caching implementation, token introspection implementation, OAuth/session/auth middleware, route behavior changes, missing-token behavior changes, invalid-token challenge behavior changes, protected-resource metadata route behavior changes, DB/schema/package work, OpenAI API/model calls, provider calls, source mutation, finance writes, public assets, generated public prose, listing copy, app submission, external communications, or autonomous action.
- Runtime contract objects carry no raw token material and permit only sanitized presence/classification/metadata references.
- Provider mode remains provider-neutral/unresolved.
- Canonical resource URI, protected-resource metadata, resource indicators, authorization server discovery, issuer, audience/resource, scope, org/company binding, company selector, no-token-leakage, revocation, replay, clock-skew, key-rotation, JWKS cache, introspection availability, validation-service-unavailable, and fail-closed prerequisites are recorded.
- Failure modes map to FP-0139 envelopes: `missing-token`, `malformed_authorization`, `malformed_token`, `invalid`, `expired`, `revoked`, `wrong-audience`, `wrong-resource`, `wrong-scope`, `insufficient-scope`, `wrong-org`, `wrong-company`, `replayed`, `token-passthrough-attempt`, `unsupported-token-type`, and `validation-service-unavailable`.
- Missing-token remains separate from invalid-token.
- Invalid-token challenge behavior remains downstream of FP-0139 sanitized envelopes.
- `/mcp` route behavior, missing-token behavior, invalid-token challenge behavior, and protected-resource metadata route behavior remain unchanged.
- No real token examples, JWT-like examples, Bearer material, token echo, token logging, DB/schema/package/OpenAI/provider/source/finance-write/public/submission scope exists in changed docs, TypeScript source, specs, or proof tools.
- FP-0144 forbidden source-scope checks are top-level proof-failing fields.
- Prior FP-0144/0143/0142/0141/0139/0130/0125/0107/0106/0100 boundaries remain intact.

Validation commands:

```bash
git diff --check
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
pnpm --filter @pocket-cto/domain exec vitest run src/benchmark-community.spec.ts src/read-only-app-mcp.spec.ts src/read-only-app-mcp-descriptor.spec.ts src/read-only-app-mcp-public-security.spec.ts src/read-only-app-mcp-endpoint-architecture.spec.ts src/read-only-app-mcp-endpoint-route-ownership.spec.ts src/read-only-app-mcp-protocol-envelope.spec.ts src/read-only-app-mcp-evidence-tool-dispatch.spec.ts src/read-only-app-mcp-oauth-security.spec.ts src/read-only-app-mcp-remote-host-resource.spec.ts src/read-only-app-mcp-protected-resource-metadata.spec.ts src/read-only-app-mcp-token-validation.spec.ts src/read-only-app-mcp-token-validation-runtime.spec.ts src/read-only-app-mcp-token-validation-test-double.spec.ts src/read-only-app-mcp-invalid-token-challenge.spec.ts src/read-only-app-mcp-token-validation-result-envelope.spec.ts
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

This slice is idempotent because it adds one exact FP-0145 plan path, proof-only domain contracts, focused tests, one direct proof command, a narrow FP-0144 proof hardening patch, and directly stale docs refresh only where needed. Re-running the proof command should accept exactly this FP-0145 file, reject duplicate FP-0145 paths, and reject any FP-0146 path.

If validation fails, do not widen scope. Patch only the FP-0145 plan/proof/domain/spec bridge or the FP-0144 proof-hardening gap on this same branch. If failure points to missing services or unrelated dirty files, stop and report the exact blocker.

Rollback is documentation/proof-only: remove the FP-0145 plan, proof-only helpers/specs, direct proof command, FP-0144 proof-hardening edits, and stale docs/plugin refresh. No raw source file, uploaded evidence, persisted finance state, database schema, route behavior, app construction, package script, provider state, OpenAI state, public asset, or external communication is mutated by this plan.

## Artifacts and Notes

Primary artifacts:

- `plans/FP-0145-read-only-chatgpt-app-mcp-token-validation-runtime-contracts-proof-hardening.md`
- `packages/domain/src/read-only-app-mcp-token-validation-runtime-proof-hardening.ts`
- focused additions to existing token-validation runtime/proof specs
- `tools/read-only-mcp-token-validation-runtime-contracts-proof-hardening-proof.mjs`
- FP-0144 proof-hardening edits in `tools/read-only-mcp-production-token-validation-sequencing-proof.mjs`
- directly stale active docs/plugin refresh only where required

Failure-mode mapping to FP-0139 result envelopes:

| Future state | FP-0139 envelope failure | Posture |
| --- | --- | --- |
| `missing-token` | `missing_token` | Separate FP-0130 missing-token lane. |
| `malformed_authorization` | `malformed_authorization` | Future failed-credential lane after parser contract proof. |
| `malformed_token` | `malformed_authorization` | Future malformed credential lane without token echo. |
| `invalid` | `invalid_token` | Downstream invalid-token challenge after sanitized envelope only. |
| `expired` | `expired_token` | Downstream invalid-token challenge after sanitized envelope only. |
| `revoked` | `revoked_token` | Downstream invalid-token challenge after sanitized envelope only. |
| `wrong-audience` | `wrong_audience` | Fail closed after audience/resource proof. |
| `wrong-resource` | `wrong_resource` | Fail closed after canonical resource proof. |
| `wrong-scope` | `insufficient_scope` | Future least-privilege scope challenge posture. |
| `insufficient-scope` | `insufficient_scope` | Future least-privilege scope challenge posture. |
| `wrong-org` | `wrong_org` | Fail closed after authenticated org binding proof. |
| `wrong-company` | `company_binding_mismatch` | Fail closed after authenticated company binding proof. |
| `replayed` | `replay_or_nonce_failure` | Fail closed after replay store proof. |
| `token-passthrough-attempt` | `invalid_token` | Fail closed without forwarding credential material. |
| `unsupported-token-type` | `unsupported_validation_mode` | Fail closed until selected provider/token mode is proven. |
| `validation-service-unavailable` | `production_validation_unavailable` | Fail closed and expose limitation without provider detail. |

Evidence and replay posture: this is planning/proof hardening only. It does not change mission state, ingest sources, source registry state, CFO Wiki finance facts, finance answers, reports, approvals, monitor findings, or durable finance artifacts. Replay implications are covered by the explicit no-runtime/no-mission-state posture and machine-readable proof output. Any future runtime slice must record replay behavior or a named reason why replay is not applicable.

Provenance, freshness, and limitations: official MCP/RFC/OpenAI docs were used only as read-only planning context. Finance evidence remains the source of truth for product answers. FP-0145 creates no finance answer, no source-derived report, no public prose artifact, no generated advice, and no external communication.

Monitoring posture: F6 monitoring semantics are unchanged. No monitoring stored-state input contract, alert semantics, proof-bundle delivery path, freshness posture, missing-source posture, or human-review boundary changes in this slice.

Workflow and environment posture: no `WORKFLOW.md`, stack-pack, package script, dependency, deployment config, or environment variable change is needed.

## Interfaces and Dependencies

No runtime interface changes in FP-0145:

- `POST /mcp` remains the existing local route.
- GET `/mcp` remains unchanged.
- GET `/.well-known/oauth-protected-resource/mcp` remains unchanged.
- FP-0130 missing-token challenge behavior remains separate.
- FP-0141/FP-0143 invalid-token challenge behavior remains explicit local sanitized-envelope dependency behavior only.
- FP-0139 result envelopes remain proof/local envelopes, not production authentication decisions.
- No route consumes evaluator/test-double outputs.

Future-only dependencies before runtime validation can open:

- canonical resource URI proof
- protected-resource metadata proof
- authorization server discovery and issuer proof
- audience/resource and resource-indicator posture
- scope minimization and challenged-scope authority
- org/company binding source and fail-closed posture
- JWT/JWKS or opaque-token introspection provider decision
- JWKS fetch/cache, key rotation, and clock skew posture if JWT/JWKS is selected
- token introspection, revocation, and service-unavailable posture if opaque-token introspection is selected
- replay detection and nonce/store posture if applicable
- no-token-leakage proof for logs, docs, proof output, examples, error bodies, structured tool results, specs, and proof tools
- FP-0139 result-envelope-only output contract proof

Future-only scope remains: actual validation, parser/JWT/introspection implementation, OAuth/session/auth middleware, DB/storage, route behavior, remote deployment, public app, submission, provider/certification/deployment execution, OpenAI API/model integration, source mutation, finance writes, external communications, and autonomous action.

## Outcomes & Retrospective

Implemented the FP-0145 contract/proof-hardening foundation as a read-only local slice after FP-0144. The slice creates exactly one FP-0145 plan, adds provider-neutral runtime contract proof helpers and specs, adds the direct FP-0145 proof command, hardens FP-0144 top-level forbidden-scope proof fields, and refreshes directly stale active docs/plugin notes.

Production token validation remains blocked. Authorization parser implementation, token parser implementation, JWT decoder implementation, JWKS fetching/caching implementation, token introspection implementation, OAuth/session/auth middleware, route behavior changes, missing-token behavior changes, invalid-token challenge behavior changes, protected-resource metadata route behavior changes, DB/schema/package work, OpenAI API/model calls, provider calls, source mutation, finance writes, public assets, generated public prose, listing copy, app submission, external communications, and autonomous action remain out of scope and proof-blocked.

Validation posture at closeout: focused proof and spec validation passed; the full local `pnpm test` run passed; a first `pnpm ci:repro:current` attempt failed once in an unrelated control-plane orchestrator DB spec, and the isolated failing spec passed locally. The post-closeout rerun passed, including `pnpm ci:repro:current`.

Post-merge freshness correction: PR #324 is merged, `gh` confirms head SHA `9f79fe0c0ce17c9ce7e1a07990324c0ef2295fd3` and merge commit `6fd000554cbaf2afd8c33b0a986ee656612fc4f3`, same-branch QA corrected `plugins.md` only, and no post-merge QA is required when current `main` matches the validated PR head/merge posture and CI remains green.
