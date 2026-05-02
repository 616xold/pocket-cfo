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
7. the unfinished `plans/FP-*.md` file if one exists; right now there is no FP-0073. `plans/FP-0072-board-lender-document-source-pack-foundation.md` is the shipped F6Y record for one board/lender document source-pack foundation, with direct proof `pnpm exec tsx tools/board-lender-document-source-pack-proof.mjs`. It added no route, schema, migration, package script, smoke alias, eval dataset, UI, runtime-Codex, delivery, provider, outbox, report, board packet, lender update, approval, certification, monitor family, discovery family, mission, generated prose, source mutation outside proof upload/bind/compile setup, finance write, advice, instruction, or autonomous action. `plans/FP-0071-policy-covenant-document-source-pack-foundation.md` remains the shipped F6W record with direct proof `pnpm exec tsx tools/policy-covenant-document-source-pack-proof.mjs`. `plans/FP-0070-close-control-certification-safety-foundation.md` remains the shipped non-certifying F6T record. `plans/FP-0069-ledger-reconciliation-source-pack-foundation.md` remains the shipped F6U record. FP-0050 through FP-0072 remain shipped F6 records, and `plans/FP-0049-board-packet-circulation-note-reset-and-effective-record-hardening.md` remains the latest shipped F5C4I record. F6V, F6X, F6Z, and later planning must wait for future Finance Plans. Treat older F5 and F4 records as shipped history unless a new plan names a concrete truthfulness gap.
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
