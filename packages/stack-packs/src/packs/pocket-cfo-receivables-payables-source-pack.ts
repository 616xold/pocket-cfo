import type { PocketCfoReceivablesPayablesSourcePack } from "../stack-pack";

export const pocketCfoReceivablesPayablesSourcePack: PocketCfoReceivablesPayablesSourcePack =
  {
    id: "pocket-cfo-receivables-payables-source-pack",
    displayName: "Pocket CFO Receivables/Payables Source Pack",
    purpose:
      "Checked-in F6O source-pack fixture for proving receivables-aging and payables-aging source/twin posture through existing routes only.",
    fixtureDirectory:
      "packages/testkit/fixtures/f6o-receivables-payables-source-pack",
    sourceFiles: [
      {
        role: "receivables_aging",
        fixturePath: "sources/receivables-aging.csv",
        sourceKind: "dataset",
        mediaType: "text/csv",
        expectedExtractorKey: "receivables_aging_csv",
      },
      {
        role: "payables_aging",
        fixturePath: "sources/payables-aging.csv",
        sourceKind: "dataset",
        mediaType: "text/csv",
        expectedExtractorKey: "payables_aging_csv",
      },
    ],
    sourceRoles: ["receivables_aging", "payables_aging"],
    sourceKinds: ["dataset"],
    mediaTypes: ["text/csv"],
    expectedExtractorKeys: ["receivables_aging_csv", "payables_aging_csv"],
    expectedNormalizedPosturePath:
      "packages/testkit/fixtures/f6o-receivables-payables-source-pack/expected-source-twin-posture.json",
    limitations: [
      "The pack is one deterministic local fixture family, not a broad source-pack platform.",
      "The pack covers only receivables-aging CSV and payables-aging CSV source posture.",
      "The pack proves existing source registry and Finance Twin route behavior only; it does not add routes, schema, migrations, package scripts, monitor families, discovery families, or extractors.",
      "The pack does not create missions, reports, approvals, delivery, runtime-Codex drafts, payment behavior, legal advice, policy advice, collection instructions, customer-contact instructions, generated prose, or autonomous finance action.",
    ],
    runtimeDeliveryActionBoundary:
      "Proof is source-backed and route-driven only; it remains runtime-free, delivery-free, report-free, approval-free, payment-free, legal-advice-free, policy-advice-free, collection/customer-contact-instruction-free, generated-prose-free, and non-autonomous.",
  };
