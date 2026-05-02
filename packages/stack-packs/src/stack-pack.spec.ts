import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { nextjsVercelPack } from "./packs/nextjs-vercel";
import { pocketCfoBankCardSourcePack } from "./packs/pocket-cfo-bank-card-source-pack";
import { pocketCfoBoardLenderDocumentSourcePack } from "./packs/pocket-cfo-board-lender-document-source-pack";
import { pocketCfoContractObligationSourcePack } from "./packs/pocket-cfo-contract-obligation-source-pack";
import { pocketCfoLedgerReconciliationSourcePack } from "./packs/pocket-cfo-ledger-reconciliation-source-pack";
import { pocketCfoMonitorDemoPack } from "./packs/pocket-cfo-monitor-demo";
import { pocketCfoPolicyCovenantDocumentSourcePack } from "./packs/pocket-cfo-policy-covenant-document-source-pack";
import { pocketCfoReceivablesPayablesSourcePack } from "./packs/pocket-cfo-receivables-payables-source-pack";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

type ManifestSourceFileDescriptor = {
  role: string;
  fixturePath: string;
  sourceKind: string;
  mediaType: string;
  expectedExtractorKey: string;
};

type ExpectedSourceFileDescriptor = {
  role: string;
  path: string;
  sourceKind: string;
  mediaType: string;
  expectedExtractorKey: string;
};

type DocumentManifestSourceFileDescriptor = {
  role: string;
  fixturePath: string;
  sourceKind: string;
  mediaType: string;
  documentRole: string;
  expectedDocumentKind: string;
};

type ExpectedDocumentSourceFileDescriptor = {
  role: string;
  path: string;
  sourceKind: string;
  mediaType: string;
  documentRole: string;
  expectedDocumentKind: string;
};

describe("stack packs", () => {
  it("exports the example Next.js pack", () => {
    expect(nextjsVercelPack.id).toBe("nextjs-vercel");
    expect(nextjsVercelPack.supportedMissionTypes).toContain("build");
  });

  it("exports the Pocket CFO F6F monitor demo pack without engineering pack semantics", () => {
    expect(pocketCfoMonitorDemoPack.id).toBe("pocket-cfo-monitor-demo");
    expect(pocketCfoMonitorDemoPack.fixtureDirectory).toBe(
      "packages/testkit/fixtures/f6f-monitor-demo-stack",
    );
    expect(pocketCfoMonitorDemoPack.monitorFamiliesCovered).toEqual([
      "cash_posture",
      "collections_pressure",
      "payables_pressure",
      "policy_covenant_threshold",
    ]);
    expect(
      pocketCfoMonitorDemoPack.sourceFiles.map((file) => file.role),
    ).toEqual([
      "bank_cash",
      "receivables_aging",
      "payables_aging",
      "policy_thresholds",
    ]);
    expect(pocketCfoMonitorDemoPack.cashAlertInvestigationHandoffExpected).toBe(
      true,
    );
    expect(pocketCfoMonitorDemoPack.expectedOutputManifestPath).toBe(
      "packages/testkit/fixtures/f6f-monitor-demo-stack/expected-monitor-results.json",
    );
    expect(pocketCfoMonitorDemoPack.expectedCloseControlChecklistPath).toBe(
      "packages/testkit/fixtures/f6f-monitor-demo-stack/expected-close-control-checklist.json",
    );
    expect(pocketCfoMonitorDemoPack.runtimeAndDeliveryBoundary).toContain(
      "runtime-free",
    );
  });

  it("exports the Pocket CFO F6L bank/card source pack without monitor or discovery semantics", () => {
    expect(pocketCfoBankCardSourcePack.id).toBe(
      "pocket-cfo-bank-card-source-pack",
    );
    expect(pocketCfoBankCardSourcePack.fixtureDirectory).toBe(
      "packages/testkit/fixtures/f6l-bank-card-source-pack",
    );
    expect(pocketCfoBankCardSourcePack.sourceRoles).toEqual([
      "bank_account_summary",
      "card_expense",
    ]);
    expect(
      pocketCfoBankCardSourcePack.sourceFiles.map((file) => file.role),
    ).toEqual(pocketCfoBankCardSourcePack.sourceRoles);
    expect(pocketCfoBankCardSourcePack.sourceKinds).toEqual(["dataset"]);
    expect(pocketCfoBankCardSourcePack.mediaTypes).toEqual(["text/csv"]);
    expect(pocketCfoBankCardSourcePack.expectedExtractorKeys).toEqual([
      "bank_account_summary_csv",
      "card_expense_csv",
    ]);
    expect(
      pocketCfoBankCardSourcePack.sourceFiles.map(
        (file) => file.expectedExtractorKey,
      ),
    ).toEqual(pocketCfoBankCardSourcePack.expectedExtractorKeys);
    expect(pocketCfoBankCardSourcePack.expectedNormalizedPosturePath).toBe(
      "packages/testkit/fixtures/f6l-bank-card-source-pack/expected-source-twin-posture.json",
    );
    expect(pocketCfoBankCardSourcePack.runtimeDeliveryActionBoundary).toContain(
      "runtime-free",
    );
    expect(pocketCfoBankCardSourcePack).not.toHaveProperty(
      "monitorFamiliesCovered",
    );
    expect(pocketCfoBankCardSourcePack).not.toHaveProperty(
      "discoveryFamiliesCovered",
    );
  });

  it("exports the Pocket CFO F6O receivables/payables source pack without monitor or discovery semantics", () => {
    expect(pocketCfoReceivablesPayablesSourcePack.id).toBe(
      "pocket-cfo-receivables-payables-source-pack",
    );
    expect(pocketCfoReceivablesPayablesSourcePack.fixtureDirectory).toBe(
      "packages/testkit/fixtures/f6o-receivables-payables-source-pack",
    );
    expect(pocketCfoReceivablesPayablesSourcePack.sourceRoles).toEqual([
      "receivables_aging",
      "payables_aging",
    ]);
    expect(
      pocketCfoReceivablesPayablesSourcePack.sourceFiles.map(
        (file) => file.role,
      ),
    ).toEqual(pocketCfoReceivablesPayablesSourcePack.sourceRoles);
    expect(pocketCfoReceivablesPayablesSourcePack.sourceKinds).toEqual([
      "dataset",
    ]);
    expect(pocketCfoReceivablesPayablesSourcePack.mediaTypes).toEqual([
      "text/csv",
    ]);
    expect(
      pocketCfoReceivablesPayablesSourcePack.expectedExtractorKeys,
    ).toEqual(["receivables_aging_csv", "payables_aging_csv"]);
    expect(
      pocketCfoReceivablesPayablesSourcePack.sourceFiles.map(
        (file) => file.expectedExtractorKey,
      ),
    ).toEqual(pocketCfoReceivablesPayablesSourcePack.expectedExtractorKeys);
    expect(
      pocketCfoReceivablesPayablesSourcePack.expectedNormalizedPosturePath,
    ).toBe(
      "packages/testkit/fixtures/f6o-receivables-payables-source-pack/expected-source-twin-posture.json",
    );
    expect(
      normalizeManifestSourceFiles(
        pocketCfoReceivablesPayablesSourcePack.sourceFiles,
      ),
    ).toEqual(
      normalizeExpectedSourceFiles(
        loadExpectedPosture(
          pocketCfoReceivablesPayablesSourcePack.expectedNormalizedPosturePath,
        ).sourceFiles,
      ),
    );
    for (const sourceFile of normalizeManifestSourceFiles(
      pocketCfoReceivablesPayablesSourcePack.sourceFiles,
    )) {
      const absolutePath = join(
        repoRoot,
        pocketCfoReceivablesPayablesSourcePack.fixtureDirectory,
        sourceFile.path,
      );

      expect(existsSync(absolutePath)).toBe(true);
      expect(readFileSync(absolutePath, "utf8").trim().length).toBeGreaterThan(
        0,
      );
    }
    expect(
      pocketCfoReceivablesPayablesSourcePack.runtimeDeliveryActionBoundary,
    ).toContain("runtime-free");
    expect(pocketCfoReceivablesPayablesSourcePack).not.toHaveProperty(
      "monitorFamiliesCovered",
    );
    expect(pocketCfoReceivablesPayablesSourcePack).not.toHaveProperty(
      "discoveryFamiliesCovered",
    );
  });

  it("exports the Pocket CFO F6R contract/obligation source pack without monitor or discovery semantics", () => {
    expect(pocketCfoContractObligationSourcePack.id).toBe(
      "pocket-cfo-contract-obligation-source-pack",
    );
    expect(pocketCfoContractObligationSourcePack.fixtureDirectory).toBe(
      "packages/testkit/fixtures/f6r-contract-obligation-source-pack",
    );
    expect(pocketCfoContractObligationSourcePack.sourceRoles).toEqual([
      "contract_metadata",
    ]);
    expect(
      pocketCfoContractObligationSourcePack.sourceFiles.map(
        (file) => file.role,
      ),
    ).toEqual(pocketCfoContractObligationSourcePack.sourceRoles);
    expect(pocketCfoContractObligationSourcePack.sourceKinds).toEqual([
      "dataset",
    ]);
    expect(pocketCfoContractObligationSourcePack.mediaTypes).toEqual([
      "text/csv",
    ]);
    expect(pocketCfoContractObligationSourcePack.expectedExtractorKeys).toEqual(
      ["contract_metadata_csv"],
    );
    expect(
      pocketCfoContractObligationSourcePack.sourceFiles.map(
        (file) => file.expectedExtractorKey,
      ),
    ).toEqual(pocketCfoContractObligationSourcePack.expectedExtractorKeys);
    expect(
      pocketCfoContractObligationSourcePack.expectedNormalizedPosturePath,
    ).toBe(
      "packages/testkit/fixtures/f6r-contract-obligation-source-pack/expected-source-twin-posture.json",
    );
    expect(
      normalizeManifestSourceFiles(
        pocketCfoContractObligationSourcePack.sourceFiles,
      ),
    ).toEqual(
      normalizeExpectedSourceFiles(
        loadExpectedPosture(
          pocketCfoContractObligationSourcePack.expectedNormalizedPosturePath,
        ).sourceFiles,
      ),
    );
    for (const sourceFile of normalizeManifestSourceFiles(
      pocketCfoContractObligationSourcePack.sourceFiles,
    )) {
      const absolutePath = join(
        repoRoot,
        pocketCfoContractObligationSourcePack.fixtureDirectory,
        sourceFile.path,
      );

      expect(existsSync(absolutePath)).toBe(true);
      expect(readFileSync(absolutePath, "utf8").trim().length).toBeGreaterThan(
        0,
      );
    }
    expect(
      pocketCfoContractObligationSourcePack.runtimeDeliveryActionBoundary,
    ).toContain("runtime-free");
    expect(pocketCfoContractObligationSourcePack).not.toHaveProperty(
      "monitorFamiliesCovered",
    );
    expect(pocketCfoContractObligationSourcePack).not.toHaveProperty(
      "discoveryFamiliesCovered",
    );
  });

  it("exports the Pocket CFO F6U ledger/reconciliation source pack without monitor or discovery semantics", () => {
    expect(pocketCfoLedgerReconciliationSourcePack.id).toBe(
      "pocket-cfo-ledger-reconciliation-source-pack",
    );
    expect(pocketCfoLedgerReconciliationSourcePack.fixtureDirectory).toBe(
      "packages/testkit/fixtures/f6u-ledger-reconciliation-source-pack",
    );
    expect(pocketCfoLedgerReconciliationSourcePack.sourceRoles).toEqual([
      "chart_of_accounts",
      "trial_balance",
      "general_ledger",
    ]);
    expect(
      pocketCfoLedgerReconciliationSourcePack.sourceFiles.map(
        (file) => file.role,
      ),
    ).toEqual(pocketCfoLedgerReconciliationSourcePack.sourceRoles);
    expect(pocketCfoLedgerReconciliationSourcePack.sourceKinds).toEqual([
      "dataset",
    ]);
    expect(pocketCfoLedgerReconciliationSourcePack.mediaTypes).toEqual([
      "text/csv",
    ]);
    expect(
      pocketCfoLedgerReconciliationSourcePack.expectedExtractorKeys,
    ).toEqual([
      "chart_of_accounts_csv",
      "trial_balance_csv",
      "general_ledger_csv",
    ]);
    expect(
      pocketCfoLedgerReconciliationSourcePack.sourceFiles.map(
        (file) => file.expectedExtractorKey,
      ),
    ).toEqual(pocketCfoLedgerReconciliationSourcePack.expectedExtractorKeys);
    expect(
      pocketCfoLedgerReconciliationSourcePack.expectedNormalizedPosturePath,
    ).toBe(
      "packages/testkit/fixtures/f6u-ledger-reconciliation-source-pack/expected-source-twin-posture.json",
    );
    expect(
      normalizeManifestSourceFiles(
        pocketCfoLedgerReconciliationSourcePack.sourceFiles,
      ),
    ).toEqual(
      normalizeExpectedSourceFiles(
        loadExpectedPosture(
          pocketCfoLedgerReconciliationSourcePack.expectedNormalizedPosturePath,
        ).sourceFiles,
      ),
    );
    for (const sourceFile of normalizeManifestSourceFiles(
      pocketCfoLedgerReconciliationSourcePack.sourceFiles,
    )) {
      const absolutePath = join(
        repoRoot,
        pocketCfoLedgerReconciliationSourcePack.fixtureDirectory,
        sourceFile.path,
      );

      expect(existsSync(absolutePath)).toBe(true);
      expect(readFileSync(absolutePath, "utf8").trim().length).toBeGreaterThan(
        0,
      );
    }
    expect(
      pocketCfoLedgerReconciliationSourcePack.runtimeDeliveryActionBoundary,
    ).toContain("runtime-free");
    expect(pocketCfoLedgerReconciliationSourcePack).not.toHaveProperty(
      "monitorFamiliesCovered",
    );
    expect(pocketCfoLedgerReconciliationSourcePack).not.toHaveProperty(
      "discoveryFamiliesCovered",
    );
  });

  it("exports the Pocket CFO F6W policy/covenant document source pack without extractor, monitor, or discovery semantics", () => {
    expect(pocketCfoPolicyCovenantDocumentSourcePack.id).toBe(
      "pocket-cfo-policy-covenant-document-source-pack",
    );
    expect(pocketCfoPolicyCovenantDocumentSourcePack.displayName).toBe(
      "Pocket CFO Policy/Covenant Document Source Pack",
    );
    expect(pocketCfoPolicyCovenantDocumentSourcePack.fixtureDirectory).toBe(
      "packages/testkit/fixtures/f6w-policy-covenant-document-source-pack",
    );
    expect(pocketCfoPolicyCovenantDocumentSourcePack.sourceRoles).toEqual([
      "policy_document",
    ]);
    expect(
      pocketCfoPolicyCovenantDocumentSourcePack.sourceFiles.map(
        (file) => file.role,
      ),
    ).toEqual(["policy_document", "policy_document"]);
    expect(pocketCfoPolicyCovenantDocumentSourcePack.sourceKinds).toEqual([
      "document",
    ]);
    expect(pocketCfoPolicyCovenantDocumentSourcePack.documentRoles).toEqual([
      "policy_document",
    ]);
    expect(pocketCfoPolicyCovenantDocumentSourcePack.mediaTypes).toEqual([
      "text/markdown",
      "text/plain",
    ]);
    expect(
      pocketCfoPolicyCovenantDocumentSourcePack.expectedDocumentKinds,
    ).toEqual(["markdown_text", "plain_text"]);
    expect(
      pocketCfoPolicyCovenantDocumentSourcePack.sourceFiles.map(
        (file) => file.expectedDocumentKind,
      ),
    ).toEqual(pocketCfoPolicyCovenantDocumentSourcePack.expectedDocumentKinds);
    expect(
      pocketCfoPolicyCovenantDocumentSourcePack.expectedNormalizedPosturePath,
    ).toBe(
      "packages/testkit/fixtures/f6w-policy-covenant-document-source-pack/expected-source-wiki-policy-posture.json",
    );
    expect(
      normalizeDocumentManifestSourceFiles(
        pocketCfoPolicyCovenantDocumentSourcePack.sourceFiles,
      ),
    ).toEqual(
      normalizeExpectedDocumentSourceFiles(
        loadDocumentExpectedPosture(
          pocketCfoPolicyCovenantDocumentSourcePack.expectedNormalizedPosturePath,
        ).sourceFiles,
      ),
    );
    for (const sourceFile of normalizeDocumentManifestSourceFiles(
      pocketCfoPolicyCovenantDocumentSourcePack.sourceFiles,
    )) {
      const absolutePath = join(
        repoRoot,
        pocketCfoPolicyCovenantDocumentSourcePack.fixtureDirectory,
        sourceFile.path,
      );

      expect(existsSync(absolutePath)).toBe(true);
      expect(readFileSync(absolutePath, "utf8").trim().length).toBeGreaterThan(
        0,
      );
    }
    expect(
      pocketCfoPolicyCovenantDocumentSourcePack.runtimeDeliveryActionBoundary,
    ).toContain("runtime-free");
    expect(pocketCfoPolicyCovenantDocumentSourcePack).not.toHaveProperty(
      "expectedExtractorKeys",
    );
    expect(pocketCfoPolicyCovenantDocumentSourcePack).not.toHaveProperty(
      "monitorFamiliesCovered",
    );
    expect(pocketCfoPolicyCovenantDocumentSourcePack).not.toHaveProperty(
      "discoveryFamiliesCovered",
    );
    for (const forbidden of [
      "providerTargets",
      "deliveryTargets",
      "reportTargets",
      "approvalTargets",
      "certificationTargets",
      "runtimeCodexTargets",
      "actionTargets",
    ]) {
      expect(pocketCfoPolicyCovenantDocumentSourcePack).not.toHaveProperty(
        forbidden,
      );
    }
  });

  it("exports the Pocket CFO F6Y board/lender document source pack without extractor, monitor, or discovery semantics", () => {
    expect(pocketCfoBoardLenderDocumentSourcePack.id).toBe(
      "pocket-cfo-board-lender-document-source-pack",
    );
    expect(pocketCfoBoardLenderDocumentSourcePack.displayName).toBe(
      "Pocket CFO Board/Lender Document Source Pack",
    );
    expect(pocketCfoBoardLenderDocumentSourcePack.fixtureDirectory).toBe(
      "packages/testkit/fixtures/f6y-board-lender-document-source-pack",
    );
    expect(pocketCfoBoardLenderDocumentSourcePack.sourceRoles).toEqual([
      "board_material",
      "lender_document",
    ]);
    expect(
      pocketCfoBoardLenderDocumentSourcePack.sourceFiles.map(
        (file) => file.role,
      ),
    ).toEqual(pocketCfoBoardLenderDocumentSourcePack.sourceRoles);
    expect(pocketCfoBoardLenderDocumentSourcePack.sourceKinds).toEqual([
      "document",
    ]);
    expect(pocketCfoBoardLenderDocumentSourcePack.documentRoles).toEqual([
      "board_material",
      "lender_document",
    ]);
    expect(pocketCfoBoardLenderDocumentSourcePack.mediaTypes).toEqual([
      "text/markdown",
      "text/plain",
    ]);
    expect(
      pocketCfoBoardLenderDocumentSourcePack.expectedDocumentKinds,
    ).toEqual(["markdown_text", "plain_text"]);
    expect(
      pocketCfoBoardLenderDocumentSourcePack.sourceFiles.map(
        (file) => file.expectedDocumentKind,
      ),
    ).toEqual(pocketCfoBoardLenderDocumentSourcePack.expectedDocumentKinds);
    expect(
      pocketCfoBoardLenderDocumentSourcePack.expectedNormalizedPosturePath,
    ).toBe(
      "packages/testkit/fixtures/f6y-board-lender-document-source-pack/expected-source-wiki-posture.json",
    );
    expect(
      normalizeDocumentManifestSourceFiles(
        pocketCfoBoardLenderDocumentSourcePack.sourceFiles,
      ),
    ).toEqual(
      normalizeExpectedDocumentSourceFiles(
        loadDocumentExpectedPosture(
          pocketCfoBoardLenderDocumentSourcePack.expectedNormalizedPosturePath,
        ).sourceFiles,
      ),
    );
    for (const sourceFile of normalizeDocumentManifestSourceFiles(
      pocketCfoBoardLenderDocumentSourcePack.sourceFiles,
    )) {
      const absolutePath = join(
        repoRoot,
        pocketCfoBoardLenderDocumentSourcePack.fixtureDirectory,
        sourceFile.path,
      );

      expect(existsSync(absolutePath)).toBe(true);
      expect(readFileSync(absolutePath, "utf8").trim().length).toBeGreaterThan(
        0,
      );
    }
    expect(
      pocketCfoBoardLenderDocumentSourcePack.runtimeDeliveryActionBoundary,
    ).toContain("runtime-free");
    expect(pocketCfoBoardLenderDocumentSourcePack).not.toHaveProperty(
      "expectedExtractorKeys",
    );
    expect(
      pocketCfoBoardLenderDocumentSourcePack.sourceFiles.every(
        (sourceFile) => !Object.hasOwn(sourceFile, "expectedExtractorKey"),
      ),
    ).toBe(true);
    expect(pocketCfoBoardLenderDocumentSourcePack).not.toHaveProperty(
      "monitorFamiliesCovered",
    );
    expect(pocketCfoBoardLenderDocumentSourcePack).not.toHaveProperty(
      "discoveryFamiliesCovered",
    );
    for (const forbidden of [
      "providerTargets",
      "deliveryTargets",
      "reportTargets",
      "approvalTargets",
      "certificationTargets",
      "runtimeCodexTargets",
      "actionTargets",
    ]) {
      expect(pocketCfoBoardLenderDocumentSourcePack).not.toHaveProperty(
        forbidden,
      );
    }
  });
});

function loadExpectedPosture(expectedPath: string) {
  return JSON.parse(readFileSync(join(repoRoot, expectedPath), "utf8")) as {
    sourceFiles: ExpectedSourceFileDescriptor[];
  };
}

function normalizeManifestSourceFiles(
  sourceFiles: ManifestSourceFileDescriptor[],
): ExpectedSourceFileDescriptor[] {
  return sourceFiles.map((sourceFile) => ({
    role: sourceFile.role,
    path: sourceFile.fixturePath,
    sourceKind: sourceFile.sourceKind,
    mediaType: sourceFile.mediaType,
    expectedExtractorKey: sourceFile.expectedExtractorKey,
  }));
}

function normalizeExpectedSourceFiles(
  sourceFiles: ExpectedSourceFileDescriptor[],
): ExpectedSourceFileDescriptor[] {
  return sourceFiles.map((sourceFile) => ({
    role: sourceFile.role,
    path: sourceFile.path,
    sourceKind: sourceFile.sourceKind,
    mediaType: sourceFile.mediaType,
    expectedExtractorKey: sourceFile.expectedExtractorKey,
  }));
}

function loadDocumentExpectedPosture(expectedPath: string) {
  return JSON.parse(readFileSync(join(repoRoot, expectedPath), "utf8")) as {
    sourceFiles: ExpectedDocumentSourceFileDescriptor[];
  };
}

function normalizeDocumentManifestSourceFiles(
  sourceFiles: DocumentManifestSourceFileDescriptor[],
): ExpectedDocumentSourceFileDescriptor[] {
  return sourceFiles.map((sourceFile) => ({
    role: sourceFile.role,
    path: sourceFile.fixturePath,
    sourceKind: sourceFile.sourceKind,
    mediaType: sourceFile.mediaType,
    documentRole: sourceFile.documentRole,
    expectedDocumentKind: sourceFile.expectedDocumentKind,
  }));
}

function normalizeExpectedDocumentSourceFiles(
  sourceFiles: ExpectedDocumentSourceFileDescriptor[],
): ExpectedDocumentSourceFileDescriptor[] {
  return sourceFiles.map((sourceFile) => ({
    role: sourceFile.role,
    path: sourceFile.path,
    sourceKind: sourceFile.sourceKind,
    mediaType: sourceFile.mediaType,
    documentRole: sourceFile.documentRole,
    expectedDocumentKind: sourceFile.expectedDocumentKind,
  }));
}
