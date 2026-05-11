# Codex Plugins

This file records the plugins available in this Codex local thread and the repo-local Pocket CFO plugin used for the FP-0105 local/proof-only/read-only endpoint route ownership and transport-adapter proof-contract slice.

## Repo-local plugin used

- `pocket-cfo-codex-operator`
  - Marketplace entry: `.agents/plugins/marketplace.json`
  - Bundle path: `plugins/pocket-cfo-codex-operator/`
  - Skills invoked for this FP-0105 endpoint route ownership, transport-adapter contract, proof-gate bridge, doc-refresh, and handoff slice:
    - Finance Plan Orchestrator
    - Modular Architecture Guard
    - Source Provenance Guard
    - CFO Wiki Maintainer
    - Evidence Bundle Auditor
    - F6 Monitoring Semantics Guard
    - Validation Ladder Composer
    - Pocket CFO Handoff Auditor
  - GitHub Connector Guard was not invoked because GitHub connector product behavior was out of scope.

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

- Routine `git` and `gh` CLI operations were used for repository and PR metadata.
- OpenAI Developers was available only as an installed plugin family; no callable read-only docs tool was exposed for this slice. It was not used to create API keys, call OpenAI APIs, call models, or widen app/runtime scope. Official OpenAI web docs were used as read-only platform context for Apps SDK, MCP Apps in ChatGPT, MCP server structure, authentication, deployment, Developer Mode testing, security/privacy, and submission sequencing.
- No Figma, app-submission, design-generation, OpenAI API/model-call, artifact-upload, dependency-installation, or public-asset generation plugin workflow was used for this slice.
