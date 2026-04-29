import type { PocketCfoContractObligationSourcePack } from "../stack-pack";

export const pocketCfoContractObligationSourcePack: PocketCfoContractObligationSourcePack =
  {
    id: "pocket-cfo-contract-obligation-source-pack",
    displayName: "Pocket CFO Contract/Obligation Source Pack",
    purpose:
      "Checked-in F6R source-pack fixture for proving contract-metadata source/twin posture through existing source registry and Finance Twin contract/obligation routes only.",
    fixtureDirectory:
      "packages/testkit/fixtures/f6r-contract-obligation-source-pack",
    sourceFiles: [
      {
        role: "contract_metadata",
        fixturePath: "sources/contract-metadata.csv",
        sourceKind: "dataset",
        mediaType: "text/csv",
        expectedExtractorKey: "contract_metadata_csv",
      },
    ],
    sourceRoles: ["contract_metadata"],
    sourceKinds: ["dataset"],
    mediaTypes: ["text/csv"],
    expectedExtractorKeys: ["contract_metadata_csv"],
    expectedNormalizedPosturePath:
      "packages/testkit/fixtures/f6r-contract-obligation-source-pack/expected-source-twin-posture.json",
    limitations: [
      "The pack is one deterministic local fixture family, not a broad source-pack platform.",
      "The pack covers only contract-metadata CSV source posture.",
      "The pack proves existing source registry and Finance Twin contract inventory and obligation-calendar route behavior only; it does not add routes, schema, migrations, package scripts, monitor families, discovery families, or extractors.",
      "The pack does not create missions, reports, approvals, delivery, runtime-Codex drafts, provider calls, provider credentials, provider jobs, certification, close-complete status, sign-off, attestation, legal opinions, audit opinions, assurance artifacts, payment behavior, legal advice, policy advice, collection instructions, customer-contact instructions, generated prose, or autonomous finance action.",
    ],
    runtimeDeliveryActionBoundary:
      "Proof is source-backed and route-driven only; it remains runtime-free, delivery-free, provider-free, report-free, approval-free, certification-free, close-complete-free, sign-off-free, attestation-free, legal-opinion-free, audit-opinion-free, payment-free, legal-advice-free, policy-advice-free, collection/customer-contact-instruction-free, generated-prose-free, and non-autonomous.",
  };
