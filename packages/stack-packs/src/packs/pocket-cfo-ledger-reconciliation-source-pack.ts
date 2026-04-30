import type { PocketCfoLedgerReconciliationSourcePack } from "../stack-pack";

export const pocketCfoLedgerReconciliationSourcePack: PocketCfoLedgerReconciliationSourcePack =
  {
    id: "pocket-cfo-ledger-reconciliation-source-pack",
    displayName: "Pocket CFO Ledger/Reconciliation Source Pack",
    purpose:
      "Checked-in F6U source-pack fixture for proving chart-of-accounts, trial-balance, general-ledger, and reconciliation source/twin posture through existing source registry and Finance Twin routes only.",
    fixtureDirectory:
      "packages/testkit/fixtures/f6u-ledger-reconciliation-source-pack",
    sourceFiles: [
      {
        role: "chart_of_accounts",
        fixturePath: "sources/chart-of-accounts.csv",
        sourceKind: "dataset",
        mediaType: "text/csv",
        expectedExtractorKey: "chart_of_accounts_csv",
      },
      {
        role: "trial_balance",
        fixturePath: "sources/trial-balance.csv",
        sourceKind: "dataset",
        mediaType: "text/csv",
        expectedExtractorKey: "trial_balance_csv",
      },
      {
        role: "general_ledger",
        fixturePath: "sources/general-ledger.csv",
        sourceKind: "dataset",
        mediaType: "text/csv",
        expectedExtractorKey: "general_ledger_csv",
      },
    ],
    sourceRoles: ["chart_of_accounts", "trial_balance", "general_ledger"],
    sourceKinds: ["dataset"],
    mediaTypes: ["text/csv"],
    expectedExtractorKeys: [
      "chart_of_accounts_csv",
      "trial_balance_csv",
      "general_ledger_csv",
    ],
    expectedNormalizedPosturePath:
      "packages/testkit/fixtures/f6u-ledger-reconciliation-source-pack/expected-source-twin-posture.json",
    limitations: [
      "The pack is one deterministic local fixture family, not a broad source-pack platform.",
      "The pack covers only chart-of-accounts CSV, trial-balance CSV, and general-ledger CSV source posture.",
      "The pack proves existing source registry and Finance Twin account-catalog, ledger, reconciliation, account-bridge, balance-bridge-prerequisites, balance-proof, balance-proof lineage, and period-context route behavior only; it does not add routes, schema, migrations, package scripts, monitor families, discovery families, or extractors.",
      "The pack does not create missions, reports, approvals, delivery, runtime-Codex drafts, provider calls, provider credentials, provider jobs, certification, close-complete status, sign-off, attestation, legal opinions, audit opinions, assurance artifacts, payment behavior, accounting writes, bank writes, tax filings, legal advice, policy advice, collection instructions, customer-contact instructions, generated prose, source mutation outside proof upload/sync setup, or autonomous finance action.",
    ],
    runtimeDeliveryActionBoundary:
      "Proof is source-backed and route-driven only; it remains runtime-free, delivery-free, provider-free, report-free, approval-free, certification-free, close-complete-free, sign-off-free, attestation-free, legal-opinion-free, audit-opinion-free, payment-free, accounting-write-free, bank-write-free, tax-filing-free, legal-advice-free, policy-advice-free, collection/customer-contact-instruction-free, generated-prose-free, source-mutation-free outside proof upload/sync setup, and non-autonomous.",
  };
