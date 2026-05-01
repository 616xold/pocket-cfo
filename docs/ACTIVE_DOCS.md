# Active docs boundary

This repository is mid-pivot.
Use this file to know which docs are active, which are archived reference-only history, and where historical Pocket CTO materials now live.

## Read these first

Treat these as the active product and implementation guidance, in this order:

1. `START_HERE.md`
2. `README.md`
3. `AGENTS.md`
4. `PLANS.md`
5. `WORKFLOW.md`
6. `plans/ROADMAP.md`
7. the unfinished `plans/FP-*.md` file if one exists; right now `plans/FP-0071-policy-covenant-document-source-pack-foundation.md` is the active F6W implementation-ready planning contract. `plans/FP-0070-close-control-certification-safety-foundation.md` is the shipped F6T record for one deterministic internal close/control certification-safety/readiness foundation through `GET /close-control/companies/:companyKey/certification-safety`, derived only from shipped F6Q certification-boundary, F6S human-confirmation, and F6N review-summary posture. F6T is not actual certification, certified status, close complete, sign-off, attestation, assurance, legal opinion, audit opinion, approval, report creation, report release, report circulation, external delivery, provider integration, provider calls, provider credentials, provider jobs, outbox send behavior, scheduled delivery, auto-send, runtime-Codex, generated prose, source mutation, mission creation, monitor rerun/result creation, finance write, advice/instruction, customer-contact instruction, autonomous action, a new monitor family, or a new discovery family. `plans/FP-0069-ledger-reconciliation-source-pack-foundation.md` remains the shipped F6U record for one deterministic ledger/reconciliation source-pack foundation only. F6U is limited to source roles `chart_of_accounts`, `trial_balance`, and `general_ledger`; extractor keys `chart_of_accounts_csv`, `trial_balance_csv`, and `general_ledger_csv`; direct proof `pnpm exec tsx tools/ledger-reconciliation-source-pack-proof.mjs`; proof through existing source registry and Finance Twin sync/read/reconciliation routes only; and no product runtime behavior, package script, smoke alias, route, schema, migration, monitor family, discovery family, delivery, provider call, provider credential, provider job, outbox send, approval, report, certification, close-complete status, sign-off, attestation, legal/audit opinion, payment behavior, runtime-Codex, generated prose, finance action, source mutation outside proof upload/sync setup, advice/instruction, or autonomous action. `plans/FP-0068-external-delivery-human-confirmation-boundary-foundation.md` remains the shipped F6S record for one deterministic internal external-delivery human-confirmation / delivery-preflight boundary foundation through `GET /external-delivery/companies/:companyKey/human-confirmation-boundary`. F6S remains no-send, no-provider-call, no-provider-credential, no-provider-job, no-outbox-send, no-scheduled-delivery, no-auto-send, no-report-creation, no-report-release, no-report-circulation, no-approval, no-certification, no-close-complete, no-sign-off, no-attestation, no-legal/audit-opinion, no-generated-prose, no-runtime-Codex, no-monitor-rerun/result, no-mission, no-source-mutation, no-finance-write, no-advice/instruction, no-autonomous-action, no-new-monitor-family, and no-new-discovery-family. `plans/FP-0067-contract-obligation-source-pack-foundation.md` remains the shipped F6R record for one contract/obligation source-pack foundation only. `plans/FP-0066-close-control-certification-boundary-foundation.md` remains the shipped F6Q record for one deterministic internal close/control certification-boundary/readiness foundation only. `plans/FP-0065-external-provider-boundary-foundation.md` remains the shipped F6P record, `plans/FP-0064-receivables-payables-source-pack-foundation.md` remains the shipped F6O record, `plans/FP-0063-close-control-review-summary-foundation.md` remains the shipped F6N record, `plans/FP-0062-external-notification-delivery-planning-foundation.md` remains the shipped F6M record, `plans/FP-0061-source-pack-expansion-foundation.md` remains the shipped F6L bank/card source-pack record, `plans/FP-0060-close-control-acknowledgement-foundation.md` remains the shipped F6K record, `plans/FP-0059-operator-notification-readiness-foundation.md` remains the shipped F6J record, `plans/FP-0058-stack-pack-expansion-and-close-control-demo-foundation.md` remains the shipped F6I record, `plans/FP-0057-close-control-checklist-foundation.md` remains the shipped F6H record, `plans/FP-0056-non-cash-alert-investigation-generalization-foundation.md` remains the shipped F6G record, `plans/FP-0055-monitor-demo-replay-and-stack-pack-foundation.md` remains the shipped F6F record, `plans/FP-0054-policy-covenant-threshold-monitor-foundation.md` remains the shipped F6E record, `plans/FP-0053-payables-pressure-monitor-foundation.md` remains the shipped F6D record, `plans/FP-0052-collections-pressure-monitor-foundation.md` remains the shipped F6C record, `plans/FP-0051-alert-to-investigation-mission-foundation.md` remains the shipped first F6B record, `plans/FP-0050-monitoring-foundation-and-first-cash-posture-alert.md` remains the shipped first F6A record, and `plans/FP-0049-board-packet-circulation-note-reset-and-effective-record-hardening.md` remains the latest shipped F5C4I record. F6W planning is governed by `plans/FP-0071-policy-covenant-document-source-pack-foundation.md`; F6V, F6X, and later planning must wait for future Finance Plans. Treat older F5 and F4 records as shipped history unless a new plan names a concrete truthfulness gap.
8. `docs/ops/source-ingest-and-cfo-wiki.md`
9. `docs/ops/local-dev.md`
10. `docs/ops/codex-app-server.md`
11. `docs/ops/github-app-setup.md` only if GitHub connector work is actually in scope
12. `docs/benchmarks/seeded-missions.md`
13. `evals/README.md`

## Archived Pocket CTO reference material

These may contain reusable implementation ideas, but they are **not** the active product truth:

- `docs/architecture/**`
- `docs/archive/pocket-cto/plans/EP-*.md`
- `docs/archive/pocket-cto/ops/m2-exit-report.md`
- `docs/archive/pocket-cto/ops/m3-exit-report.md`
- GitHub-first or engineering-first milestone notes anywhere else in the repo

You may reuse them for control-plane, replay, evidence, or twin patterns.
Do not reuse their product wording or product assumptions as active scope.
The Pocket CTO archive root is `docs/archive/pocket-cto/`.

## Conflict rule

If active docs disagree with historical Pocket CTO docs:

- active docs win for **product direction**
- current code wins for **implemented behavior**
- the active Finance Plan decides how to close the gap

Do not claim a finance capability exists until code and acceptance prove it.

## Update rule

When you change product direction, operating procedure, or milestone sequencing, update the active doc in the same slice or archive the stale doc.
Do not leave ambiguous, competing guidance in place.
