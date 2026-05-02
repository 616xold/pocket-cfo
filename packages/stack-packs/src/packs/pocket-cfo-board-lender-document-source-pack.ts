import type { PocketCfoBoardLenderDocumentSourcePack } from "../stack-pack";

export const pocketCfoBoardLenderDocumentSourcePack: PocketCfoBoardLenderDocumentSourcePack =
  {
    id: "pocket-cfo-board-lender-document-source-pack",
    displayName: "Pocket CFO Board/Lender Document Source Pack",
    purpose:
      "Checked-in F6Y source-pack fixture for proving board/lender document source/wiki posture through existing source registry and CFO Wiki bind, compile, and read routes only.",
    fixtureDirectory:
      "packages/testkit/fixtures/f6y-board-lender-document-source-pack",
    sourceFiles: [
      {
        role: "board_material",
        fixturePath: "sources/board-material.md",
        sourceKind: "document",
        mediaType: "text/markdown",
        documentRole: "board_material",
        expectedDocumentKind: "markdown_text",
      },
      {
        role: "lender_document",
        fixturePath: "sources/lender-document.txt",
        sourceKind: "document",
        mediaType: "text/plain",
        documentRole: "lender_document",
        expectedDocumentKind: "plain_text",
      },
    ],
    sourceRoles: ["board_material", "lender_document"],
    sourceKinds: ["document"],
    documentRoles: ["board_material", "lender_document"],
    mediaTypes: ["text/markdown", "text/plain"],
    expectedDocumentKinds: ["markdown_text", "plain_text"],
    expectedNormalizedPosturePath:
      "packages/testkit/fixtures/f6y-board-lender-document-source-pack/expected-source-wiki-posture.json",
    limitations: [
      "The pack is one deterministic local fixture family, not a broad source-pack platform.",
      "The pack covers only text/markdown and text/plain document source posture for the explicit board_material and lender_document roles.",
      "The pack proves existing source registry and CFO Wiki bind, compile, and read route behavior only; it does not add routes, schema, migrations, package scripts, monitor families, discovery families, extractors, policy pages, reports, board packets, lender updates, approvals, release records, circulation records, delivery, providers, runtime-Codex, certification, generated prose, finance writes, advice, instructions, or autonomous action.",
      "The pack does not create missions, reports, board packets, lender updates, approvals, delivery, runtime-Codex drafts, provider calls, provider credentials, provider jobs, certification, certified status, close-complete status, sign-off, attestation, legal opinions, audit opinions, assurance artifacts, payment behavior, accounting writes, bank writes, tax filings, legal advice, policy advice, board advice, lender advice, collection instructions, customer-contact instructions, generated prose, source mutation outside proof upload/bind/compile setup, or autonomous finance action.",
    ],
    runtimeDeliveryActionBoundary:
      "Proof is source-backed and route-driven only; it remains runtime-free, delivery-free, provider-free, report-free, board-packet-free, lender-update-free, approval-free, report-release-free, report-circulation-free, certification-free, certified-status-free, close-complete-free, sign-off-free, attestation-free, legal-opinion-free, audit-opinion-free, assurance-free, payment-free, accounting-write-free, bank-write-free, tax-filing-free, legal-advice-free, policy-advice-free, board-advice-free, lender-advice-free, collection/customer-contact-instruction-free, generated-prose-free, source-mutation-free outside proof upload/bind/compile setup, and non-autonomous.",
  };
