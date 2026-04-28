# F6L Bank/Card Source-Pack Fixture

This fixture is the first checked-in Pocket CFO F6L source-pack family.
It bootstraps one deterministic company key, `demo-bank-card-source-pack`, from static raw source files and proves only the existing bank/card Finance Twin posture:

- `bank_account_summary`
- `card_expense`

The proof command must treat these files as immutable raw inputs.
It may register sources, upload source files, sync Finance Twin state, and compare normalized source/twin posture, but it must not rewrite files in this directory.

## Source Files

- `sources/bank-account-summary.csv` is a bank-account-summary CSV with three bank accounts, four reported balances, one ambiguous generic balance, and one undated balance.
- `sources/card-expense.csv` is a card-expense CSV with three explicit card spend rows, mixed transaction dates, reported amount posture, posted amount posture, and transaction amount posture.

## Expected Output

`expected-source-twin-posture.json` records normalized source/twin posture for the pack.
Generated ids, timestamps, source ids, snapshot ids, source-file ids, sync-run ids, and storage refs are intentionally excluded from the expected comparison.

The fixture remains runtime-Codex-free, delivery-free, report-free, approval-free, payment-free, legal-advice-free, policy-advice-free, collection-instruction-free, customer-contact-instruction-free, and non-autonomous.
