import { describe, expect, it, vi } from "vitest";
import type {
  CfoWikiBoundSourceSummary,
  CfoWikiCompanySummary,
  CfoWikiPageView,
  FinanceCashPostureView,
  FinanceCollectionsPostureView,
  FinanceFreshnessState,
  FinancePayablesPostureView,
  MonitorKind,
  MonitorLatestResult,
  MonitorResult,
} from "@pocket-cto/domain";
import {
  buildCfoWikiConceptPageKey,
  buildCfoWikiPolicyPageKey,
} from "@pocket-cto/domain";
import { CloseControlService } from "./service";

const companyId = "11111111-1111-4111-8111-111111111111";
const sourceId = "22222222-2222-4222-8222-222222222222";
const sourceSnapshotId = "33333333-3333-4333-8333-333333333333";
const sourceFileId = "44444444-4444-4444-8444-444444444444";
const syncRunId = "55555555-5555-4555-8555-555555555555";
const generatedAt = "2026-04-28T12:00:00.000Z";

describe("CloseControlService", () => {
  it("builds a ready deterministic checklist from fresh source posture and latest persisted monitor context", async () => {
    const service = buildService();

    const checklist = await service.getChecklist("acme");

    expect(checklist.aggregateStatus).toBe("ready_for_review");
    expect(checklist.items.map((item) => [item.family, item.status])).toEqual([
      ["source_coverage_review", "ready_for_review"],
      ["cash_source_freshness_review", "ready_for_review"],
      ["receivables_aging_source_freshness_review", "ready_for_review"],
      ["payables_aging_source_freshness_review", "ready_for_review"],
      ["policy_source_freshness_review", "ready_for_review"],
      ["monitor_replay_readiness", "ready_for_review"],
    ]);
    expect(checklist.runtimeActionBoundary).toMatchObject({
      runtimeCodexUsed: false,
      deliveryCreated: false,
      reportCreated: false,
      approvalCreated: false,
      monitorRunTriggered: false,
      missionCreated: false,
      autonomousActionCreated: false,
    });
  });

  it("blocks readiness when required source posture is missing", async () => {
    const service = buildService({
      cashPosture: buildCashPosture("missing", { empty: true }),
      collectionsPosture: buildCollectionsPosture("missing", { empty: true }),
      payablesPosture: buildPayablesPosture("missing", { empty: true }),
      policySources: [],
    });

    const checklist = await service.getChecklist("acme");

    expect(checklist.aggregateStatus).toBe("blocked_by_evidence");
    expect(
      checklist.items.find((item) => item.family === "source_coverage_review")
        ?.status,
    ).toBe("blocked_by_evidence");
    expect(
      checklist.items.find(
        (item) => item.family === "cash_source_freshness_review",
      )?.proofPosture.state,
    ).toBe("limited_by_missing_source");
  });

  it("maps stale stored source posture to needs_review instead of readiness", async () => {
    const service = buildService({
      cashPosture: buildCashPosture("stale"),
    });

    const checklist = await service.getChecklist("acme");
    const cash = checklist.items.find(
      (item) => item.family === "cash_source_freshness_review",
    );

    expect(checklist.aggregateStatus).toBe("needs_review");
    expect(cash?.status).toBe("needs_review");
    expect(cash?.sourcePosture.state).toBe("stale_source");
    expect(cash?.proofPosture.state).toBe("limited_by_stale_source");
  });

  it("surfaces policy-source limitations and malformed threshold posture without advice", async () => {
    const service = buildService({
      policyExtractText:
        "Pocket CFO threshold: covenant_leverage_ratio <= 50 percent",
    });

    const checklist = await service.getChecklist("acme");
    const policy = checklist.items.find(
      (item) => item.family === "policy_source_freshness_review",
    );

    expect(policy?.status).toBe("needs_review");
    expect(policy?.proofPosture.state).toBe("limited_by_data_quality_gap");
    expect(policy?.limitations.join(" ")).toContain("unsupported F6E metric");
    expect(checklist.runtimeActionBoundary.legalAdviceGenerated).toBe(false);
    expect(checklist.runtimeActionBoundary.policyAdviceGenerated).toBe(false);
  });

  it("reads latest monitor results only as context and never exposes monitor rerun posture", async () => {
    const latestCash = vi.fn().mockResolvedValue(
      buildLatestMonitor("cash_posture", {
        status: "alert",
      }),
    );
    const service = buildService({
      latestMonitorFns: {
        getLatestCashPostureMonitorResult: latestCash,
      },
    });

    const checklist = await service.getChecklist("acme");
    const monitor = checklist.items.find(
      (item) => item.family === "monitor_replay_readiness",
    );

    expect(latestCash).toHaveBeenCalledWith("acme");
    expect(monitor?.status).toBe("needs_review");
    expect(monitor?.proofPosture.state).toBe("limited_by_alerting_monitor");
    expect(checklist.runtimeActionBoundary.monitorRunTriggered).toBe(false);
    expect(checklist.runtimeActionBoundary.missionCreated).toBe(false);
  });
});

function buildService(
  input: {
    cashPosture?: FinanceCashPostureView;
    collectionsPosture?: FinanceCollectionsPostureView;
    latestMonitorFns?: Partial<ReturnType<typeof buildMonitoringService>>;
    payablesPosture?: FinancePayablesPostureView;
    policyExtractText?: string;
    policySources?: CfoWikiBoundSourceSummary[];
  } = {},
) {
  const policySources = input.policySources ?? [
    buildPolicySource(input.policyExtractText),
  ];
  const policyPageKey = policySources[0]
    ? buildCfoWikiPolicyPageKey(policySources[0].source.id)
    : null;
  const cfoWikiService = {
    getCompanySummary: vi.fn().mockResolvedValue(buildCompanySummary()),
    getPage: vi
      .fn()
      .mockImplementation((_companyKey: string, pageKey: string) => {
        if (pageKey === buildCfoWikiConceptPageKey("policy-corpus")) {
          return Promise.resolve(buildPageView(pageKey, "Policy corpus"));
        }
        if (policyPageKey && pageKey === policyPageKey) {
          return Promise.resolve(
            buildPageView(policyPageKey, input.policyExtractText),
          );
        }
        return Promise.resolve(null);
      }),
    listCompanySources: vi.fn().mockResolvedValue({
      companyId,
      companyKey: "acme",
      companyDisplayName: "Acme",
      sourceCount: policySources.length,
      sources: policySources,
      limitations: [],
    }),
  };
  const monitoringService = {
    ...buildMonitoringService(),
    ...input.latestMonitorFns,
  };

  return new CloseControlService({
    cfoWikiService,
    financeTwinService: {
      getCashPosture: vi
        .fn()
        .mockResolvedValue(input.cashPosture ?? buildCashPosture("fresh")),
      getCollectionsPosture: vi
        .fn()
        .mockResolvedValue(
          input.collectionsPosture ?? buildCollectionsPosture("fresh"),
        ),
      getPayablesPosture: vi
        .fn()
        .mockResolvedValue(
          input.payablesPosture ?? buildPayablesPosture("fresh"),
        ),
    },
    monitoringService,
    now: () => new Date(generatedAt),
  });
}

function buildMonitoringService() {
  return {
    getLatestCashPostureMonitorResult: vi
      .fn()
      .mockResolvedValue(buildLatestMonitor("cash_posture")),
    getLatestCollectionsPressureMonitorResult: vi
      .fn()
      .mockResolvedValue(buildLatestMonitor("collections_pressure")),
    getLatestPayablesPressureMonitorResult: vi
      .fn()
      .mockResolvedValue(buildLatestMonitor("payables_pressure")),
    getLatestPolicyCovenantThresholdMonitorResult: vi
      .fn()
      .mockResolvedValue(buildLatestMonitor("policy_covenant_threshold")),
  };
}

function buildCashPosture(
  state: FinanceFreshnessState,
  input: { empty?: boolean } = {},
): FinanceCashPostureView {
  return {
    company: buildCompany(),
    coverageSummary: {
      bankAccountCount: input.empty ? 0 : 1,
      reportedBalanceCount: input.empty ? 0 : 1,
    },
    currencyBuckets: [],
    diagnostics: [],
    freshness: buildFreshness(state, "bank-account-summary"),
    latestAttemptedSyncRun: state === "missing" ? null : buildSyncRun(),
    latestSuccessfulBankSummarySlice: {
      coverage: {},
      latestSource: state === "missing" ? null : buildSourceRef(),
      latestSyncRun: state === "missing" ? null : buildSyncRun(),
      summary: null,
    },
    limitations: [],
  } as unknown as FinanceCashPostureView;
}

function buildCollectionsPosture(
  state: FinanceFreshnessState,
  input: { empty?: boolean } = {},
): FinanceCollectionsPostureView {
  return {
    company: buildCompany(),
    coverageSummary: {
      customerCount: input.empty ? 0 : 1,
      currencyBucketCount: input.empty ? 0 : 1,
      rowCount: input.empty ? 0 : 1,
      rowsWithComputablePastDueCount: input.empty ? 0 : 1,
      rowsWithPartialPastDueOnlyCount: 0,
    },
    currencyBuckets: [],
    diagnostics: [],
    freshness: buildFreshness(state, "receivables-aging"),
    latestAttemptedSyncRun: state === "missing" ? null : buildSyncRun(),
    latestSuccessfulReceivablesAgingSlice: {
      coverage: {},
      latestSource: state === "missing" ? null : buildSourceRef(),
      latestSyncRun: state === "missing" ? null : buildSyncRun(),
      summary: null,
    },
    limitations: [],
  } as unknown as FinanceCollectionsPostureView;
}

function buildPayablesPosture(
  state: FinanceFreshnessState,
  input: { empty?: boolean } = {},
): FinancePayablesPostureView {
  return {
    company: buildCompany(),
    coverageSummary: {
      currencyBucketCount: input.empty ? 0 : 1,
      rowCount: input.empty ? 0 : 1,
      rowsWithComputablePastDueCount: input.empty ? 0 : 1,
      rowsWithPartialPastDueOnlyCount: 0,
      vendorCount: input.empty ? 0 : 1,
    },
    currencyBuckets: [],
    diagnostics: [],
    freshness: buildFreshness(state, "payables-aging"),
    latestAttemptedSyncRun: state === "missing" ? null : buildSyncRun(),
    latestSuccessfulPayablesAgingSlice: {
      coverage: {},
      latestSource: state === "missing" ? null : buildSourceRef(),
      latestSyncRun: state === "missing" ? null : buildSyncRun(),
      summary: null,
    },
    limitations: [],
  } as unknown as FinancePayablesPostureView;
}

function buildFreshness(state: FinanceFreshnessState, label: string) {
  return {
    state,
    latestSyncRunId: state === "missing" ? null : syncRunId,
    latestSyncStatus: state === "missing" ? null : "succeeded",
    latestCompletedAt: state === "missing" ? null : generatedAt,
    latestSuccessfulSyncRunId: state === "missing" ? null : syncRunId,
    latestSuccessfulCompletedAt: state === "missing" ? null : generatedAt,
    ageSeconds: state === "missing" ? null : state === "stale" ? 172800 : 60,
    staleAfterSeconds: 86400,
    reasonCode: `${label}_${state}`,
    reasonSummary: `${label} freshness is ${state}.`,
  };
}

function buildLatestMonitor(
  monitorKind: MonitorKind,
  input: Partial<Pick<MonitorResult, "status">> = {},
): MonitorLatestResult {
  const status = input.status ?? "no_alert";
  const monitorResult = {
    id: crypto.randomUUID(),
    monitorKind,
    status,
    sourceFreshnessPosture: { state: "fresh" },
    proofBundlePosture: { state: "source_backed" },
    createdAt: generatedAt,
  } as MonitorResult;

  return { companyKey: "acme", monitorKind, monitorResult, alertCard: null };
}

function buildPolicySource(
  extractText = "Pocket CFO threshold: collections_past_due_share <= 50 percent",
): CfoWikiBoundSourceSummary {
  return {
    binding: {
      includeInCompile: true,
      documentRole: "policy_document",
    },
    latestExtract: {
      extractStatus: "extracted",
      excerptBlocks: [],
      extractedText: extractText,
      renderedMarkdown: extractText,
    },
    latestSnapshot: { id: sourceSnapshotId },
    latestSourceFile: { id: sourceFileId },
    limitations: [],
    source: { id: sourceId, name: "Collections policy" },
  } as unknown as CfoWikiBoundSourceSummary;
}

function buildCompanySummary(): CfoWikiCompanySummary {
  return {
    latestSuccessfulCompileRun: { id: crypto.randomUUID() },
    limitations: [],
  } as unknown as CfoWikiCompanySummary;
}

function buildPageView(pageKey: string, markdownBody = ""): CfoWikiPageView {
  return {
    freshnessSummary: { state: "fresh", summary: "Fresh page." },
    limitations: [],
    page: {
      lastCompiledAt: generatedAt,
      markdownBody,
      pageKey,
    },
  } as unknown as CfoWikiPageView;
}

function buildCompany() {
  return {
    id: companyId,
    companyKey: "acme",
    displayName: "Acme",
    createdAt: generatedAt,
    updatedAt: generatedAt,
  };
}

function buildSourceRef() {
  return { sourceId, sourceSnapshotId, sourceFileId, syncRunId };
}

function buildSyncRun() {
  return { id: syncRunId };
}
