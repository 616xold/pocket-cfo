# F6O Receivables/Payables Source-Pack Fixture

This fixture is the checked-in Pocket CFO F6O source-pack family.
It bootstraps one deterministic company key, `demo-receivables-payables-source-pack`, from static raw source files and proves only the existing receivables/payables Finance Twin posture:

- `receivables_aging`
- `payables_aging`

The proof command must treat these files as immutable raw inputs.
It may register sources, upload source files, sync Finance Twin state, and compare normalized source/twin posture, but it must not rewrite files in this directory.

## Source Files

- `sources/receivables-aging.csv` is a receivables-aging CSV with three customers, duplicate Alpha Co source lines, one undated USD row, and mixed USD/EUR posture.
- `sources/payables-aging.csv` is a payables-aging CSV with three vendors, duplicate Paper Supply Co source lines, one undated USD row, and mixed USD/EUR posture.

## Expected Output

`expected-source-twin-posture.json` records normalized source/twin posture for the pack.
Generated ids, timestamps, source ids, snapshot ids, source-file ids, sync-run ids, and storage refs are intentionally excluded from the expected comparison.

The fixture remains monitor-family-free, discovery-family-free, runtime-Codex-free, delivery-free, report-free, approval-free, payment-free, legal-advice-free, policy-advice-free, collection-instruction-free, customer-contact-instruction-free, generated-prose-free, source-mutation-free outside the proof upload/sync setup, and non-autonomous.
