# F6R Contract/Obligation Source-Pack Fixture

This fixture is the checked-in Pocket CFO F6R source-pack family.
It bootstraps one deterministic company key, `demo-contract-obligation-source-pack`, from one static raw source file and proves only the existing contract/obligation Finance Twin posture:

- `contract_metadata`

The proof command must treat this file as an immutable raw input.
It may register a source, upload the source file, sync Finance Twin state, and compare normalized source/twin posture, but it must not rewrite files in this directory.

## Source Files

- `sources/contract-metadata.csv` is a contract-metadata CSV with four contracts, one duplicate source row, one undated contract, explicit renewal/notice/scheduled-payment/end-date facts, and USD/GBP/unknown-currency obligation buckets.

## Expected Output

`expected-source-twin-posture.json` records normalized source/twin posture for the pack.
Generated ids, timestamps, source ids, snapshot ids, source-file ids, sync-run ids, and storage refs are intentionally excluded from the expected comparison.

The fixture remains monitor-family-free, discovery-family-free, runtime-Codex-free, delivery-free, provider-free, report-free, approval-free, certification-free, close-complete-free, sign-off-free, attestation-free, legal-opinion-free, audit-opinion-free, payment-free, legal-advice-free, policy-advice-free, collection-instruction-free, customer-contact-instruction-free, generated-prose-free, source-mutation-free outside the proof upload/sync setup, and non-autonomous.
