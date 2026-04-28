import type { PocketCfoBankCardSourcePack } from "../stack-pack";

export const pocketCfoBankCardSourcePack: PocketCfoBankCardSourcePack = {
  id: "pocket-cfo-bank-card-source-pack",
  displayName: "Pocket CFO Bank/Card Source Pack",
  purpose:
    "Checked-in F6L source-pack fixture for proving bank-account-summary and card-expense source/twin posture through existing routes only.",
  fixtureDirectory: "packages/testkit/fixtures/f6l-bank-card-source-pack",
  sourceFiles: [
    {
      role: "bank_account_summary",
      fixturePath: "sources/bank-account-summary.csv",
      sourceKind: "dataset",
      mediaType: "text/csv",
      expectedExtractorKey: "bank_account_summary_csv",
    },
    {
      role: "card_expense",
      fixturePath: "sources/card-expense.csv",
      sourceKind: "dataset",
      mediaType: "text/csv",
      expectedExtractorKey: "card_expense_csv",
    },
  ],
  sourceRoles: ["bank_account_summary", "card_expense"],
  sourceKinds: ["dataset"],
  mediaTypes: ["text/csv"],
  expectedExtractorKeys: ["bank_account_summary_csv", "card_expense_csv"],
  expectedNormalizedPosturePath:
    "packages/testkit/fixtures/f6l-bank-card-source-pack/expected-source-twin-posture.json",
  limitations: [
    "The pack is one deterministic local fixture family, not a broad source-pack platform.",
    "The pack covers only bank-account-summary CSV and card-expense CSV source posture.",
    "The pack proves existing source registry and Finance Twin route behavior only; it does not add routes, schema, migrations, package scripts, monitor families, discovery families, or extractors.",
    "The pack does not create missions, reports, approvals, delivery, runtime-Codex drafts, payment behavior, legal advice, policy advice, collection instructions, customer-contact instructions, or autonomous finance action.",
  ],
  runtimeDeliveryActionBoundary:
    "Proof is source-backed and route-driven only; it remains runtime-free, delivery-free, report-free, approval-free, payment-free, legal-advice-free, policy-advice-free, collection/customer-contact-instruction-free, and non-autonomous.",
};
