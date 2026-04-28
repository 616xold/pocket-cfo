import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const fixtureRoot = join(process.cwd(), "fixtures", "f6f-monitor-demo-stack");
const expectedChecklistFamilies = [
  "source_coverage_review",
  "cash_source_freshness_review",
  "receivables_aging_source_freshness_review",
  "payables_aging_source_freshness_review",
  "policy_source_freshness_review",
  "monitor_replay_readiness",
];
const runtimeActionBoundaryFields = [
  "runtimeCodexUsed",
  "deliveryCreated",
  "reportCreated",
  "approvalCreated",
  "accountingWriteCreated",
  "bankWriteCreated",
  "taxFilingCreated",
  "legalAdviceGenerated",
  "policyAdviceGenerated",
  "paymentInstructionCreated",
  "collectionInstructionCreated",
  "customerContactInstructionCreated",
  "autonomousActionCreated",
  "monitorRunTriggered",
  "missionCreated",
];

describe("F6F monitor demo fixture", () => {
  it("keeps a static source-backed expected-output contract", () => {
    const expected = JSON.parse(
      readFileSync(join(fixtureRoot, "expected-monitor-results.json"), "utf8"),
    ) as {
      demoCompany: { companyKey: string };
      monitorResults: Record<string, { monitorKind: string }>;
      sourceFiles: Array<{ path: string }>;
      cashInvestigationHandoff: { expected: boolean; monitorKind: string };
      collectionsInvestigationHandoff: {
        expected: boolean;
        monitorKind: string;
      };
      absenceAssertions: Record<string, boolean>;
    };
    const sourceHashesBefore = hashSourceFiles(expected.sourceFiles);

    expect(expected.demoCompany.companyKey).toBe("demo-monitor-stack");
    expect(Object.keys(expected.monitorResults).sort()).toEqual([
      "cash_posture",
      "collections_pressure",
      "payables_pressure",
      "policy_covenant_threshold",
    ]);
    expect(expected.cashInvestigationHandoff).toMatchObject({
      expected: true,
      monitorKind: "cash_posture",
    });
    expect(expected.collectionsInvestigationHandoff).toMatchObject({
      expected: true,
      monitorKind: "collections_pressure",
    });
    expect(expected.absenceAssertions).toMatchObject({
      payablesOrPolicyInvestigationsCreated: false,
      reportArtifactsCreated: false,
      approvalsCreated: false,
      deliveryOutboxEventsCreated: false,
      runtimeCodexThreadsCreated: false,
      paymentInstructionsCreated: false,
      newMonitorFamilyAdded: false,
      newDiscoveryFamilyAdded: false,
    });

    for (const sourceFile of expected.sourceFiles) {
      const body = readFileSync(join(fixtureRoot, sourceFile.path), "utf8");
      expect(body.trim().length).toBeGreaterThan(0);
    }

    expect(hashSourceFiles(expected.sourceFiles)).toEqual(sourceHashesBefore);
  });

  it("keeps a normalized close/control checklist expected-output contract", () => {
    const monitorExpected = JSON.parse(
      readFileSync(join(fixtureRoot, "expected-monitor-results.json"), "utf8"),
    ) as {
      demoCompany: { companyKey: string };
      sourceFiles: Array<{ path: string }>;
    };
    const checklistPath = join(
      fixtureRoot,
      "expected-close-control-checklist.json",
    );

    expect(existsSync(checklistPath)).toBe(true);

    const sourceHashesBefore = hashSourceFiles(monitorExpected.sourceFiles);
    const checklistExpected = JSON.parse(
      readFileSync(checklistPath, "utf8"),
    ) as {
      demoCompany: { companyKey: string };
      itemFamilies: string[];
      items: Record<string, unknown>;
      runtimeActionBoundary: Record<string, boolean>;
    };

    expect(checklistExpected.demoCompany.companyKey).toBe(
      monitorExpected.demoCompany.companyKey,
    );
    expect(checklistExpected.itemFamilies).toEqual(expectedChecklistFamilies);
    expect(Object.keys(checklistExpected.items)).toEqual(
      expectedChecklistFamilies,
    );

    for (const field of runtimeActionBoundaryFields) {
      expect(checklistExpected.runtimeActionBoundary[field]).toBe(false);
    }

    expect(hashSourceFiles(monitorExpected.sourceFiles)).toEqual(
      sourceHashesBefore,
    );
  });
});

function hashSourceFiles(sourceFiles: Array<{ path: string }>) {
  return Object.fromEntries(
    sourceFiles.map((sourceFile) => {
      const body = readFileSync(join(fixtureRoot, sourceFile.path));
      return [sourceFile.path, createHash("sha256").update(body).digest("hex")];
    }),
  );
}
