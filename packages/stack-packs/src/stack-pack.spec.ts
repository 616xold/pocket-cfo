import { describe, expect, it } from "vitest";
import { nextjsVercelPack } from "./packs/nextjs-vercel";
import { pocketCfoMonitorDemoPack } from "./packs/pocket-cfo-monitor-demo";

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
});
