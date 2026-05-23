# Codex Plugins

This file records the plugins available in this Codex local thread and the repo-local Pocket CFO plugin used for the FP-0143 invalid-token app-construction wiring slice, the FP-0142 invalid-token route integration sequencing slice, the FP-0141 invalid-token challenge local runtime slice, the FP-0140 invalid-token challenge implementation-planning slice, the FP-0139 token-validation result-envelope implementation slice, the FP-0138 token-validation runtime implementation-planning slice, the FP-0137 invalid-token WWW-Authenticate challenge implementation-readiness slice, the FP-0136 invalid-token WWW-Authenticate challenge contract foundation slice, and the targeted FP-0136 post-merge proof-source durability correction.

## Repo-local plugin used

- `pocket-cfo-codex-operator`
  - Marketplace entry: `.agents/plugins/marketplace.json`
  - Bundle path: `plugins/pocket-cfo-codex-operator/`
  - Skills invoked for the FP-0143 invalid-token app-construction wiring slice covering FP-0142/0141/0140/0139/0136/0130/0125/0107/0106/0100 boundary preservation, exact FP-0143 plan creation, optional explicit `AppContainer` dependency forwarding from `buildApp({ container })` into existing `/mcp` route registration, Authorization-present activation, missing-token precedence, protected-resource metadata and missing-token co-registration, sanitized FP-0139 result-envelope-only dependency posture, no default route behavior change, no production token validation/token parser/Authorization parser/JWT decoder/token introspection/session/OAuth/auth middleware runtime, no route expansion, no real token examples, no JWT-like examples, no Bearer token material, no token echo/logging, proof-gate bridge, direct stale-doc refresh, validation, and handoff:
    - Finance Plan Orchestrator
    - Modular Architecture Guard
    - Source Provenance Guard
    - CFO Wiki Maintainer
    - Evidence Bundle Auditor
    - F6 Monitoring Semantics Guard
    - Validation Ladder Composer
    - Pocket CFO Handoff Auditor
  - GitHub Connector Guard was not invoked because GitHub connector product behavior is out of scope.
  - Post-merge FP-0136 proof-source durability hardening on branch `codex/v2bd-read-only-chatgpt-app-mcp-invalid-token-challenge-contract-proof-doc-leakage-hardening-local-v1` used the same repo-local operator skills for a docs/proof-gate-only correction. The correction hardened committed branch-diff doc additions, dirty QA doc additions, full FP-0136 plan scanning, and focused no-leakage self-tests. It did not use OpenAI Developers docs, OpenAI Platform key setup, OpenAI APIs/models, deployment, app-submission tooling, public assets, source mutation, finance writes, or GitHub connector product behavior.
  - OpenAI Developers tooling exposed only API-key setup surfaces, not read-only docs. Official web documentation was used read-only for FP-0143 protocol/security context: MCP Authorization for Authorization-present challenge posture, protected-resource metadata, resource indicators, and token-passthrough posture; MCP Security Best Practices for no-passthrough and audience/resource posture; RFC 6750 for invalid_request / invalid_token / insufficient_scope and missing-versus-failed credentials; OpenAI Apps SDK Authentication for MCP challenge context; and OpenAI Apps SDK Security & Privacy for no-secret-leakage and least-privilege posture. No API-key setup, OpenAI API call, model call, provider call, deployment, external communication, source mutation, finance write, public asset generation, or app-submission action was used.
  - GitHub Connector Guard was not invoked because GitHub connector product behavior was out of scope.
  - Post-merge FP-0134 evaluator-taxonomy hardening on branch `codex/v2bb-read-only-chatgpt-app-mcp-token-validation-test-double-evaluator-taxonomy-hardening-local-v1` used the same repo-local operator skills for a local-only/read-only proof/spec correction. The correction did not use OpenAI Developers docs, OpenAI Platform key setup, OpenAI APIs/models, deployment, app-submission tooling, public assets, or GitHub connector product behavior.

## Installed Codex plugins available in this thread

- Browser
- Build iOS Apps
- Build macOS Apps
- Build Web Apps
- ChatGPT Apps
- Codex Security
- Documents
- Figma
- Game Studio
- GitHub
- Gmail
- OpenAI Developers
- Presentations
- Spreadsheets
- Test Android Apps

## Notes

- Routine `git` and `gh` CLI operations may be used for repository and PR metadata after validation.
- OpenAI Developers was available only as an installed plugin family; tool discovery exposed only OpenAI Platform API-key setup tools, not callable read-only docs. It was not used to create API keys, call OpenAI APIs, call models, or widen app/runtime scope. For FP-0142, official OpenAI web docs were used only as read-only context for Apps SDK Authentication and Apps SDK Security & Privacy. Official current Model Context Protocol docs and RFCs were used as read-only protocol/security context for authorization, protected-resource metadata, resource indicators, WWW-Authenticate metadata behavior, token handling, token passthrough prohibition, and MCP security best practices. Vercel documentation search and Vercel project/deployment tools were not used.
- No Figma, app-submission, design-generation, OpenAI API/model-call, artifact-upload, dependency-installation, or public-asset generation plugin workflow was used for this slice.
