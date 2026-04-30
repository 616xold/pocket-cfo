# F6U Ledger/Reconciliation Source-Pack Fixture

This fixture is the checked-in Pocket CFO F6U source-pack family.
It bootstraps one deterministic company key, `demo-ledger-reconciliation-source-pack`, from three static raw source files and proves only the existing ledger/reconciliation Finance Twin posture:

- `chart_of_accounts`
- `trial_balance`
- `general_ledger`

The proof command must treat these files as immutable raw inputs.
It may register one source-pack source, upload the three source files, sync Finance Twin state, and compare normalized source/twin/reconciliation posture, but it must not rewrite files in this directory.

## Source Files

- `sources/chart-of-accounts.csv` is a chart-of-accounts CSV with five ledger accounts, four active accounts, one inactive account, and one parent-linked account.
- `sources/trial-balance.csv` is a trial-balance CSV for the March 2026 reporting window with three accounts, three lines, balanced debit/credit totals, and USD posture.
- `sources/general-ledger.csv` is a general-ledger CSV for the same March 2026 reporting window with one journal entry, three journal lines, explicit source-declared period fields, and source-backed opening/ending balance proof for cash.

## Expected Output

`expected-source-twin-posture.json` records normalized source/twin/reconciliation posture for the pack.
Generated ids, timestamps, source ids, snapshot ids, source-file ids, sync-run ids, and storage refs are intentionally excluded from the expected comparison.

The fixture remains monitor-family-free, discovery-family-free, runtime-Codex-free, delivery-free, provider-free, report-free, approval-free, certification-free, close-complete-free, sign-off-free, attestation-free, legal-opinion-free, audit-opinion-free, payment-free, accounting-write-free, bank-write-free, tax-filing-free, legal-advice-free, policy-advice-free, collection-instruction-free, customer-contact-instruction-free, generated-prose-free, source-mutation-free outside the proof upload/sync setup, and non-autonomous.
