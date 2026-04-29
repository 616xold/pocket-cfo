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
7. the unfinished `plans/FP-*.md` file if one exists; otherwise use the latest shipped record. Right now `plans/FP-0064-receivables-payables-source-pack-foundation.md` is the shipped F6O record for one receivables/payables source-pack foundation only. F6O added one `pocket-cfo-receivables-payables-source-pack` manifest, one immutable checked-in receivables-aging/payables-aging fixture set, one normalized expected source/twin posture file, and one direct proof command: `pnpm exec tsx tools/receivables-payables-source-pack-proof.mjs`. F6O did not add F6P implementation, routes, schema, migrations, package scripts, smoke aliases, eval datasets, runtime-Codex, delivery, notification providers, reports, approvals, monitor families, discovery families, mission behavior, checklist/readiness/acknowledgement/delivery-readiness/review-summary behavior, payment behavior, accounting/bank/tax writes, legal/policy advice, collection/customer-contact instructions, generated prose, source mutation outside proof upload/sync setup, or autonomous action. F6P planning should start next only as a new Finance Plan. `plans/FP-0063-close-control-review-summary-foundation.md` remains the shipped F6N record, `plans/FP-0062-external-notification-delivery-planning-foundation.md` remains the shipped F6M record, `plans/FP-0061-source-pack-expansion-foundation.md` remains the shipped F6L bank/card source-pack record, `plans/FP-0060-close-control-acknowledgement-foundation.md` remains the shipped F6K record, `plans/FP-0059-operator-notification-readiness-foundation.md` remains the shipped F6J record, `plans/FP-0058-stack-pack-expansion-and-close-control-demo-foundation.md` remains the shipped F6I record, `plans/FP-0057-close-control-checklist-foundation.md` remains the shipped F6H record, `plans/FP-0056-non-cash-alert-investigation-generalization-foundation.md` remains the shipped F6G record, `plans/FP-0055-monitor-demo-replay-and-stack-pack-foundation.md` remains the shipped F6F implementation record, `plans/FP-0054-policy-covenant-threshold-monitor-foundation.md` remains the shipped F6E implementation record, `plans/FP-0053-payables-pressure-monitor-foundation.md` remains the shipped F6D record, `plans/FP-0052-collections-pressure-monitor-foundation.md` remains the shipped F6C record, `plans/FP-0051-alert-to-investigation-mission-foundation.md` remains the shipped first F6B record, `plans/FP-0050-monitoring-foundation-and-first-cash-posture-alert.md` remains the shipped first F6A record, and `plans/FP-0049-board-packet-circulation-note-reset-and-effective-record-hardening.md` remains the latest shipped F5C4I record. Treat older F5 and F4 records as shipped history unless a new plan names a concrete truthfulness gap.
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
