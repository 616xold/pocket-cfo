# Pocket CFO v1 UI Demo-Readiness Audit - 2026-05-07

## Scope

This F12 audit inspected the existing Pocket CFO v1 web/operator surface for manual demo readiness. It covered route visibility, source/freshness/limitations/proof posture, empty states, safety-boundary copy, shipped readiness cards, and stale public-demo copy. The slice did not add product runtime behavior, backend routes, web API routes, schema, migrations, package scripts, smoke commands, eval datasets, fixtures, source-pack changes, provider integration, certification, delivery, finance writes, source mutation, generated product prose, or autonomous action.

Direct fixes were limited to read-only UI copy proven stale or potentially confusing by the audit.

## Source of Truth

Source truth for this audit was the repository state on branch `codex/f12-manual-ui-demo-readiness-audit-implementation-local-v1`, fetched `origin/main`, active docs, FP-0079, the running local app, local Docker-backed synthetic source-pack/proof data, and current app/web source. Chat context and browser observations were not treated as finance source truth.

Primary repo files read included `plans/FP-0079-manual-ui-demo-readiness-audit.md`, `README.md`, `CODEX_README.md`, `START_HERE.md`, `docs/ACTIVE_DOCS.md`, `docs/PROJECT_STATE.md`, `docs/V2_BOUNDARY.md`, `AGENTS.md`, `PLANS.md`, `WORKFLOW.md`, `plans/ROADMAP.md`, `plans/FP-0078-public-repo-hygiene-and-v2-transition.md`, package metadata, ops docs, benchmark/eval docs, and `apps/web/app`, `apps/web/components`, and `apps/web/lib`.

No external web search was used.

## Setup Attempted

| Area | Command or method | Result |
| --- | --- | --- |
| Preflight fetch | `git fetch origin main --tags --prune` | Passed. |
| Branch/clean checks | `git rev-parse HEAD`, `git rev-parse origin/main`, `git status --short --untracked-files=all`, `git branch --show-current`, `git remote get-url origin` | Passed before edits; branch matched FP-0079 implementation branch and worktree was clean. |
| GitHub CLI | `gh auth status`, `gh repo view 616xold/pocket-cfo` | Passed. Used only for repository operations, not product GitHub connector behavior. |
| Docker services | `docker compose ps`, `docker compose up -d` | Postgres, MinIO, and OpenTelemetry collector were available. |
| Dependencies | `pnpm install` | Lockfile already up to date. |
| DB prep | `pnpm db:generate`, `pnpm db:migrate` | No schema changes or pending migrations. |
| Source-pack/demo proof seed | Six direct source-pack proof commands, `pnpm smoke:monitor-demo-replay:local`, `pnpm smoke:close-control-checklist:local`, `pnpm smoke:delivery-readiness:local`, `pnpm smoke:operator-readiness:local`, `pnpm smoke:close-control-acknowledgement:local` | Passed and created only synthetic local proof state. |
| Reporting route seed for inspection | `pnpm smoke:finance-memo:local`, `pnpm smoke:board-packet:local` | Passed and created synthetic local reporting/packet missions for route inspection. |
| Local app | `pnpm dev` | Started existing control-plane and web dev servers at `http://localhost:4000` and `http://localhost:3000`. |
| URLs opened | `http://localhost:3000/`, `/sources`, `/sources/:sourceId`, `/missions`, `/missions/:missionId`, `/monitoring`, `/close-control`, `/operator-readiness`, `/close-control/acknowledgement-readiness`, `/delivery-readiness`, `/missions/demo-mission` | Opened through Codex Browser. |

## Browser/Tooling Used

Codex Browser Use with the in-app browser backend opened and walked the local app. DOM route inspection worked. Screenshot capture did not: both full-page and visible screenshot calls timed out in the browser runtime with CDP screenshot capture timeouts. No screenshot artifacts are included, and no screenshots were invented.

Control-plane JSON routes linked from UI evidence sections were checked with local `curl` only. No external docs or web results were used.

## Routes/Pages Inspected

| Route/page | Page purpose | Data state observed | Screenshot path | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | Operator home | Control plane reachable; latest synthetic sources and missions visible; home links to shipped readiness surfaces. | Not captured; browser screenshot timeout. | Pass | Strong source-first and no-provider/no-send/no-certification/no-action boundary copy. |
| `/sources` | Sources list and source registration | Synthetic source records visible; registration form present as existing shipped UI. | Not captured. | Pass | Copy says raw files remain immutable and ingest receipts do not send, call providers, certify, or write finance actions. |
| `/sources/7b230159-a883-4b74-aa2b-b95029cce02e` | Source detail | Synthetic source detail loaded with current summary, upload form, snapshots, source-file ledger, and ingest runs. | Not captured. | Pass | Source-file list and trigger-ingest controls are existing shipped source UI; raw-file immutability and explicit ingest posture are visible. |
| Source detail, source-file list section | Immutable raw-file ledger | One stored raw file visible with checksum, storage ref, latest ingest posture, and explicit parser receipt copy. | Not captured. | Pass | Good evidence UX for checksum/storage/freshness limitations. |
| `/missions` | Mission/discovery list and intake | Text intake, typed finance analysis intake, GitHub secondary intake, and summary cards visible. | Not captured. | Warn | Stale passkeys placeholder and GitHub empty-state instruction copy were corrected in this slice. Text intake remains a legacy/general path beside the typed finance path. |
| `/missions/919bc8e0-8782-4995-8afa-5660fe63a54e` | Monitor investigation mission detail | Synthetic collections-pressure alert investigation mission loaded with monitor source, proof bundle, approvals section, artifact ledger, and operator actions section. | Not captured. | Pass | Shows taskless monitor-alert handoff and proof posture. No runtime or delivery action was created by inspection. |
| `/missions/c16d527f-76ac-4d3d-8a80-86b93a40228a` | Finance memo reporting mission detail | Synthetic finance memo mission loaded with reporting output, draft memo body, evidence appendix body, related routes, related CFO Wiki pages, and linked evidence. | Not captured. | Pass | Reporting is draft/read-only output from stored evidence; file/export actions are pre-existing shipped controls. |
| `/missions/45394acd-022e-499c-a2ef-994e98275df8` | Board packet mission detail | Synthetic draft board packet loaded with packet body, proof bundle, and a pre-existing request-circulation-approval control. | Not captured. | Warn | The control is shipped F5 posture, not F12 work. Copy states no send/distribute/PDF/slide/runtime drafting; still not ideal for first public screenshots unless the demo route avoids action-focused states. |
| `/monitoring?companyKey=demo-monitor-stack` | Monitoring page | Four latest persisted monitor sections loaded for `demo-monitor-stack`; alert cards visible; cash and collections handoff buttons visible. | Not captured. | Pass | Alert cards expose source freshness, proof posture, lineage refs, limitations, and human-review next step. |
| Monitoring alert card | Alert-card detail | Synthetic alert cards exposed severity rationale, conditions, source posture, limitations, proof posture, and manual create/open investigation handoff for supported kinds. | Not captured. | Pass | Handoff copy says no monitor rerun, messages, customer contact, payment/collection instructions, or autonomous remediation. |
| `/close-control?companyKey=demo-monitor-stack` | Close/control checklist | Checklist rendered with evidence summary, limitation list, item-level source/freshness/proof posture, and review-only boundary fields. | Not captured. | Pass | Clearly not close completion, sign-off, attestation, certification, assurance, legal/audit opinion, approval, or finance action. |
| `/close-control/acknowledgement-readiness?companyKey=demo-monitor-stack` | Acknowledgement readiness | Acknowledgement targets rendered with evidence/freshness/proof posture and internal review boundary fields. | Not captured. | Pass | Copy says it creates no approval, close-complete, sign-off, attestation, certification, delivery, outbox send, or finance-action records. |
| `/operator-readiness?companyKey=demo-monitor-stack` | Operator readiness | Attention items rendered with source/freshness/proof posture and internal review boundary. | Not captured. | Pass | Read-only internal posture; no delivery/provider/outbox/monitor rerun/mission creation/runtime-Codex/autonomous finance action. |
| `/delivery-readiness?companyKey=demo-monitor-stack` | Delivery-readiness page/card | Delivery-readiness targets rendered with source/freshness/proof posture and `internal_review_only_no_send_no_provider_no_outbox`. | Not captured. | Pass | Strong no-send/no-provider/no-outbox/no-generated-notification copy. |
| CFO Wiki control-plane routes | Derived wiki pages and source lists | `/cfo-wiki/companies/local-board-packet-company-20260507163916/pages/company%2Foverview` returned compiler-owned page JSON with freshness and limitations; `/sources` returned explicit empty binding limitations. | Not captured; not a Next UI page. | Pass | CFO Wiki routes are present as control-plane/read-model routes, not app/web pages. |
| Finance Twin related route | Evidence read model | `/finance-twin/companies/local-board-packet-company-20260507163916/cash-posture` returned source-backed synthetic cash posture JSON. | Not captured; not a Next UI page. | Pass | Related routes are visible in reporting/discovery UI as proof links. |
| Close/control review-summary route | Readiness/control read model | `/close-control/companies/demo-monitor-stack/review-summary` returned deterministic internal review-summary JSON. | Not captured; not a Next UI page. | Pass | Present as backend read model; no web route in app/navigation. |
| `/missions/demo-mission` | Static fallback mission detail | Initially stale passkeys/demo engineering copy; corrected to static legacy mission-detail demo wording. | Not captured. | Warn | Still a legacy chrome fallback, not the public Pocket CFO demo journey. |
| `/not-found` behavior | Not-found surface | Source-detail missing state and app not-found route show honest unavailable/missing copy. | Not captured. | Pass | Missing state does not fake source or control-plane data. |

No separate app/web CFO Wiki page or reporting index page was discovered in `apps/web/app`; CFO Wiki and reporting evidence are reachable through mission detail cards and control-plane related route links.

## Demo Journey Assessment

A new reviewer can understand the product from README plus the running UI: the home page states Pocket CFO as source-backed finance evidence and readiness, the sources page explains immutable raw source truth, and mission/readiness pages consistently show proof/freshness/limitations posture.

A reviewer can follow a source-to-proof story if seeded with the existing synthetic commands: source inventory -> source detail/file ledger -> Finance Twin/CFO Wiki related routes -> finance memo or board packet mission -> monitoring/readiness surfaces. The route path is stable enough for local audit, but not yet packaged as a one-command public demo journey.

The best manual demo path after this audit is:

1. Run the existing setup and synthetic proof commands.
2. Open `/sources`.
3. Open a synthetic source detail.
4. Open `/missions` and a finance memo or board packet mission.
5. Open `/monitoring?companyKey=demo-monitor-stack`.
6. Open `/close-control?companyKey=demo-monitor-stack`, `/operator-readiness?companyKey=demo-monitor-stack`, `/close-control/acknowledgement-readiness?companyKey=demo-monitor-stack`, and `/delivery-readiness?companyKey=demo-monitor-stack`.

Missing before a public screenshot/demo: reliable screenshot capture in the audit tooling, a documented self-host/demo seed baseline, and a public-demo route sequence that avoids action-heavy release/circulation states unless the human reviewer is specifically auditing those shipped boundaries.

## Safety-Boundary Audit

| Boundary | Classification | Evidence |
| --- | --- | --- |
| Provider calls/setup/credentials/jobs | Allowed absence/warning copy | Home, missions, monitoring, delivery readiness, and source pages say provider calls/setup/jobs do not occur. No provider setup UI discovered. |
| External delivery/send/outbox/email/Slack/SMS/webhook | Allowed absence/warning copy plus shipped delivery-readiness boundary | Delivery-readiness card exposes no-send/no-provider/no-outbox fields. Existing GitHub webhook wording is secondary connector copy; stale empty-state instruction was corrected. |
| Report release/circulation | Pre-existing shipped controls with safe boundary copy | Mission detail has shipped release/circulation approval/log/correction controls for completed reporting missions. Copy says Pocket CFO does not send or distribute and records only external events after approval. No F12 control added. |
| Approvals | Pre-existing shipped controls with safe boundary copy | Mission detail renders persisted approval ledger and approval resolution forms when applicable. This is shipped mission/reporting posture, not new F12 behavior. |
| Certification/close complete/sign-off/attestation/assurance | Allowed absence/warning copy | Close/control and acknowledgement pages explicitly say they are not close completion, certification, sign-off, attestation, or assurance. |
| Legal/audit opinion | Allowed absence/warning copy | Home, missions, close/control, and delivery surfaces explicitly deny legal/audit opinion behavior. |
| Payment/accounting/bank/tax actions | Allowed absence/warning copy | Readiness cards expose boundary fields for paymentInstructionCreated, accountingWriteCreated, bankWriteCreated, and taxFilingCreated as false. |
| Customer contact/collection instruction | Allowed absence/warning copy | Monitoring alert copy says no customer contact and no payment/collection instructions. |
| Runtime-Codex drafting/generated prose | Allowed absence/warning copy | Home and mission/readiness copy deny runtime-Codex finance drafting; readiness boundaries expose runtimeCodexUsed false. |
| Source mutation/finance writes | Allowed absence/warning copy | Sources explain raw bytes are immutable after upload; delivery readiness exposes sourceMutationCreated false. Existing source upload/ingest controls are shipped source UI, not F12 expansion. |
| Autonomous action | Allowed absence/warning copy | Home, monitoring, readiness cards, and validation outputs consistently assert no autonomous action. |

No out-of-scope behavior leak requiring stop was found. The only high-liability UI controls observed are pre-existing shipped mission/reporting controls with boundary copy and stored-state gating.

## Evidence UX Audit

Source labels are strong on source inventory/detail pages: source kind, origin, created by, captured date, storage kind/ref, checksum, media type, snapshot version, and ingest status are visible.

Freshness labels are visible across discovery, proof bundles, monitoring alert cards, close/control items, acknowledgement targets, operator readiness, and delivery readiness. Some default home links use `acme`, while the seeded demo data uses synthetic company keys; that is a demo packaging gap rather than an evidence-label gap.

Limitation labels are visible and repeated in discovery answers, reporting outputs, proof bundles, source detail ingest limitations, CFO Wiki pages, close/control items, and readiness cards.

Proof links and source-backed posture are visible through related route paths, related CFO Wiki page keys, proof posture fields, evidence summaries, and runtime boundary booleans.

Empty states are generally honest: missing source detail shows an unavailable/missing limitation; source list and mission list do not invent data; readiness cards show no-posture states when the control plane has no read model. The GitHub issue empty state was corrected to avoid instructing a user to send a delivery.

## README/Docs Consistency Audit

| Doc | Audit result | Action |
| --- | --- | --- |
| `README.md` | Pre-closeout text still described F12 as the next future audit and screenshots as a future placeholder. | Refreshed after F12 to link this audit and point next to V2A planning only. |
| `CODEX_README.md` | Still useful as operator guidance. F11-specific examples are historical examples, not active product scope. | No direct stale line required a change. |
| `docs/PROJECT_STATE.md` | Pre-closeout state stopped at F11. | Refreshed after F12 to include F12 shipped audit record and FP-0079 link. |
| `docs/V2_BOUNDARY.md` | Pre-closeout phase sequence still described F12 as the audit step before V2A. | Refreshed to mark F12 shipped and keep V2A future-plan-only. |
| `docs/ACTIVE_DOCS.md` | Pre-closeout text described FP-0079 as active. | Refreshed after F12 closeout to mark FP-0079 shipped and no FP-0080 created. |
| `START_HERE.md` | Pre-closeout text described F12 as active next phase. | Refreshed after F12 to recommend V2A master-plan creation before implementation. |
| `plans/ROADMAP.md` | Pre-closeout F12 section said active through FP-0079. | Refreshed after F12 to mark F12 shipped and V2A future-plan-only. |

## Findings Table

| ID | Severity | Route/doc | Issue | Evidence | Recommended next action |
| --- | --- | --- | --- | --- | --- |
| F12-001 | Warn | Browser tooling | Screenshot capture unavailable in Codex Browser runtime. | Full-page and visible screenshot calls timed out with CDP capture timeouts. | Do not invent screenshots; defer public screenshot capture to a tool/runtime that can capture local pages reliably. |
| F12-002 | Warn | `/missions/demo-mission` | Static fallback used stale passkeys engineering demo copy. | Browser h1 initially showed `Implement passkeys for sign-in`; source confirmed hardcoded fallback. | Corrected to static legacy mission-detail demo copy. |
| F12-003 | Warn | `/missions` | Text mission intake placeholder used stale passkeys copy. | Source had placeholder `Implement passkeys without breaking email login.` | Corrected to finance-evidence human-review placeholder. |
| F12-004 | Warn | `/missions`, GitHub secondary intake | Empty-state copy instructed sending an issues webhook delivery. | Source had `Send an issues webhook delivery...` | Corrected to stored secondary delivery absence copy. |
| F12-005 | Warn | Finance analysis form | Internal policy lookup copy used `sends` for an internal form contract. | Source had `sends the explicit policySourceId contract`. | Corrected to `submits`. |
| F12-006 | Warn | Reporting/packet mission detail | Pre-existing release/circulation controls are action-heavy for public screenshots even though boundary copy is safe. | Board packet mission showed request-circulation-approval control; copy says no send/distribute/runtime drafting. | Avoid action-heavy reporting states in first public demo screenshots unless auditing F5/F6 boundaries. |
| F12-007 | Warn | Demo journey | Seeded data works, but there is no one-command public demo seed/self-host baseline. | Manual setup required multiple existing proof/smoke commands and query-specific company keys. | Defer demo seed/self-host baseline to later planning; do not build it in F12. |
| F12-008 | Pass | Safety boundary | No new high-liability affordance was introduced by F12. | Git diff limited to report, docs, and copy-only UI labels; no backend/routes/schema/scripts. | Keep V2A read-only and evidence-index scoped. |
| F12-009 | Pass | Evidence UX | Source/freshness/limitations/proof posture is visible across inspected shipped routes. | Browser route checks and local control-plane JSON showed labels, proof posture, related routes/wiki pages, and limitations. | Carry the same posture into V2A EvidenceIndex design. |

## Fixes Applied In This Slice

- Replaced the stale mission text placeholder in `apps/web/components/mission-intake-form.tsx`.
- Replaced `sends` with `submits` in policy lookup source-scope copy in `apps/web/components/discovery-mission-intake-form.tsx`.
- Reworded the GitHub issue-intake empty state in `apps/web/components/github-issue-intake-list.tsx`.
- Reworded legacy non-finance proof-bundle fallback copy in `apps/web/components/mission-card.tsx`.
- Reworded `/missions/demo-mission` static fallback data in `apps/web/app/missions/[missionId]/page.tsx`.

No runtime behavior, route, API, schema, package script, fixture, smoke command, eval dataset, source truth, or finance action changed.

## Deferred Follow-Up

- Demo seed/self-host baseline: still needed for a public reviewer who should not run a long manual ladder or know synthetic company keys.
- Screenshot/public demo polish: still needed with working screenshot capture.
- V2A EvidenceIndex: should start only through a new master-plan/Finance Plan after F12 ships.
- V2B document precision: future-only after V2A boundaries.
- V2C read-only MCP/ChatGPT Evidence App: future-only after V2A/V2B evidence substrate.
- Future OSS `SECURITY.md`, `PRIVACY.md`, and `CONTRIBUTING.md`: still future baseline docs if a later plan names them.

## Final Verdict

F12 is acceptable as a manual UI/demo-readiness audit after validation. The local app is understandable and source/evidence posture is visible enough to proceed to V2A EvidenceIndex master-plan planning. One more F12 correction is not required, provided the lack of screenshots and self-host demo baseline remain documented as deferred demo polish rather than claimed public demo evidence.

No high-liability UI affordance was introduced in this slice. No product runtime behavior was introduced in this slice.
