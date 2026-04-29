import { describe, expect, it } from "vitest";
import { nextjsVercelPack } from "./packs/nextjs-vercel";
import { pocketCfoBankCardSourcePack } from "./packs/pocket-cfo-bank-card-source-pack";
import { pocketCfoMonitorDemoPack } from "./packs/pocket-cfo-monitor-demo";
import { pocketCfoReceivablesPayablesSourcePack } from "./packs/pocket-cfo-receivables-payables-source-pack";

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
      pocketCfoReceivablesPayablesSourcePack.runtimeDeliveryActionBoundary,
    ).toContain("runtime-free");
    expect(pocketCfoReceivablesPayablesSourcePack).not.toHaveProperty(
      "monitorFamiliesCovered",
    );
    expect(pocketCfoReceivablesPayablesSourcePack).not.toHaveProperty(
      "discoveryFamiliesCovered",
    );
  });
});
