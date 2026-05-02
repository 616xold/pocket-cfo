import type { PocketCfoPolicyCovenantDocumentSourcePack } from "../stack-pack";

export const pocketCfoPolicyCovenantDocumentSourcePack: PocketCfoPolicyCovenantDocumentSourcePack =
  {
    id: "pocket-cfo-policy-covenant-document-source-pack",
    displayName: "Pocket CFO Policy/Covenant Document Source Pack",
    purpose:
      "Checked-in F6W source-pack fixture for proving policy/covenant document source/wiki/policy posture through existing source registry and CFO Wiki bind, compile, and read routes only.",
    fixtureDirectory:
      "packages/testkit/fixtures/f6w-policy-covenant-document-source-pack",
    sourceFiles: [
      {
        role: "policy_document",
        fixturePath: "sources/policy-covenant-threshold.md",
        sourceKind: "document",
        mediaType: "text/markdown",
        documentRole: "policy_document",
        expectedDocumentKind: "markdown_text",
      },
      {
        role: "policy_document",
        fixturePath: "sources/policy-covenant-control.txt",
        sourceKind: "document",
        mediaType: "text/plain",
        documentRole: "policy_document",
        expectedDocumentKind: "plain_text",
      },
    ],
    sourceRoles: ["policy_document"],
    sourceKinds: ["document"],
    documentRoles: ["policy_document"],
    mediaTypes: ["text/markdown", "text/plain"],
    expectedDocumentKinds: ["markdown_text", "plain_text"],
    expectedNormalizedPosturePath:
      "packages/testkit/fixtures/f6w-policy-covenant-document-source-pack/expected-source-wiki-policy-posture.json",
    limitations: [
      "The pack is one deterministic local fixture family, not a broad source-pack platform.",
      "The pack covers only markdown and plain-text document source posture for the explicit `policy_document` role.",
      "The pack proves existing source registry and CFO Wiki bind, compile, and read route behavior only; it does not add routes, schema, migrations, package scripts, monitor families, discovery families, or extractors.",
      "The pack does not create missions, reports, approvals, delivery, runtime-Codex drafts, provider calls, provider credentials, provider jobs, certification, close-complete status, sign-off, attestation, legal opinions, audit opinions, assurance artifacts, payment behavior, accounting writes, bank writes, tax filings, legal advice, policy advice, collection instructions, customer-contact instructions, generated prose, source mutation outside proof upload/bind/compile setup, or autonomous finance action.",
    ],
    runtimeDeliveryActionBoundary:
      "Proof is source-backed and route-driven only; it remains runtime-free, delivery-free, provider-free, report-free, approval-free, certification-free, close-complete-free, sign-off-free, attestation-free, legal-opinion-free, audit-opinion-free, payment-free, accounting-write-free, bank-write-free, tax-filing-free, legal-advice-free, policy-advice-free, collection/customer-contact-instruction-free, generated-prose-free, source-mutation-free outside proof upload/bind/compile setup, and non-autonomous.",
  };
