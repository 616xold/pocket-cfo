# Codex Plugins

This file records the plugins available in this Codex local thread and the repo-local Pocket CFO plugin used for the FP-0134 synthetic token-validation test-double evaluator slice.

## Repo-local plugin used

- `pocket-cfo-codex-operator`
  - Marketplace entry: `.agents/plugins/marketplace.json`
  - Bundle path: `plugins/pocket-cfo-codex-operator/`
  - Skills invoked for the FP-0134 local-only/read-only synthetic token-validation test-double evaluator slice covering explicit synthetic non-token scenario descriptors, accepted/rejected validation result envelopes without token material, issuer/audience/resource/scope/temporal/revocation/replay/subject/org/company scenario evaluation, selector-only `companyKey`, token-like input rejection, no real token examples, no JWT-like examples, no Bearer-scheme credential content, durable repository-inventory proof scans, FP-0133/FP-0132/FP-0131/FP-0130 boundary preservation, default `buildApp()` and default `/mcp` preservation, protected-resource metadata route preservation, no token parsing/validation/session/OAuth/auth middleware runtime, no invalid-token runtime behavior, no route consumption of test doubles, no remote/public/App SDK/app-submission scope, FP-0135 absence, proof-gate bridge, direct stale-doc refresh, validation, and handoff:
    - Finance Plan Orchestrator
    - Modular Architecture Guard
    - Source Provenance Guard
    - CFO Wiki Maintainer
    - Evidence Bundle Auditor
    - F6 Monitoring Semantics Guard
    - Validation Ladder Composer
    - Pocket CFO Handoff Auditor
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
- OpenAI Developers was available only as an installed plugin family; tool discovery exposed only OpenAI Platform API-key setup tools, not callable read-only docs. It was not used to create API keys, call OpenAI APIs, call models, or widen app/runtime scope. Official OpenAI web docs were used as read-only platform context for Apps SDK authentication, security/privacy, deploy, connect, test, submit, and submission posture only. Official current/latest Model Context Protocol web docs and RFC 9728 were used as read-only protocol/security context for transports, authorization, canonical resource URI, protected-resource metadata fields, resource indicators, WWW-Authenticate resource metadata behavior, Origin validation, token handling, token passthrough prohibition, bearer methods, route derivation, tools, and MCP security best practices. Vercel documentation search and Vercel project/deployment tools were not used.
- No Figma, app-submission, design-generation, OpenAI API/model-call, artifact-upload, dependency-installation, or public-asset generation plugin workflow was used for this slice.
