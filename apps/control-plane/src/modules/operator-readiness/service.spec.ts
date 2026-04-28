import { describe, expect, it, vi } from "vitest";
import type {
  CloseControlChecklistItem,
  CloseControlChecklistResult,
  CloseControlChecklistStatus,
  MonitorKind,
  MonitorLatestResult,
  MonitorResult,
} from "@pocket-cto/domain";
import { OperatorReadinessService } from "./service";

const companyId = "11111111-1111-4111-8111-111111111111";
const cashMonitorResultId = "22222222-2222-4222-8222-222222222222";
const collectionsMonitorResultId = "33333333-3333-4333-8333-333333333333";
const payablesMonitorResultId = "44444444-4444-4444-8444-444444444444";
const policyMonitorResultId = "55555555-5555-4555-8555-555555555555";
const sourceId = "66666666-6666-4666-8666-666666666666";
const sourceSnapshotId = "77777777-7777-4777-8777-777777777777";
const sourceFileId = "88888888-8888-4888-8888-888888888888";
const syncRunId = "99999999-9999-4999-8999-999999999999";
const generatedAt = "2026-04-28T12:00:00.000Z";
const sourceLineageTargetCounts = {
  reportingPeriodCount: 0,
  ledgerAccountCount: 0,
  bankAccountCount: 1,
  bankAccountSummaryCount: 1,
  customerCount: 0,
  receivablesAgingRowCount: 0,
  vendorCount: 0,
  payablesAgingRowCount: 0,
  contractCount: 0,
  contractObligationCount: 0,
  spendRowCount: 0,
  trialBalanceLineCount: 0,
  accountCatalogEntryCount: 0,
  journalEntryCount: 0,
  journalLineCount: 0,
  generalLedgerBalanceProofCount: 0,
} as const;

describe("OperatorReadinessService", () => {
  it("maps alerting latest persisted monitor results to operator attention without rerunning monitors", async () => {
    const runCashPostureMonitor = vi.fn();
    const service = buildService({
      extraMonitoringMethods: { runCashPostureMonitor },
      latest: {
        cash_posture: buildLatestMonitor(
          buildMonitorResult("cash_posture", {
            id: cashMonitorResultId,
            status: "alert",
            proofState: "source_backed",
            freshnessState: "fresh",
          }),
        ),
      },
    });

    const result = await service.getReadiness("acme");
    const cash = requireItem(result, `monitor:cash_posture:${cashMonitorResultId}`);

    expect(cash).toMatchObject({
      family: "monitor_alert_attention",
      status: "needs_review",
      relatedMonitorKind: "cash_posture",
      relatedAlertStatus: "alert",
      proofPosture: { state: "source_backed" },
    });
    expect(cash.humanReviewNextStep).toContain("Review cash posture");
    expect(result.runtimeActionBoundary.monitorRunTriggered).toBe(false);
    expect(result.runtimeActionBoundary.monitorResultCreated).toBe(false);
    expect(runCashPostureMonitor).not.toHaveBeenCalled();
  });

  it("maps source-backed non-alerting monitor results to ready review posture", async () => {
    const service = buildService();

    const result = await service.getReadiness("acme");

    expect(result.aggregateStatus).toBe("ready_for_review");
    expect(
      result.attentionItems
        .filter((item) => item.family === "monitor_alert_attention")
        .map((item) => [item.relatedMonitorKind, item.status]),
    ).toEqual([
      ["cash_posture", "ready_for_review"],
      ["collections_pressure", "ready_for_review"],
      ["payables_pressure", "ready_for_review"],
      ["policy_covenant_threshold", "ready_for_review"],
    ]);
  });

  it("blocks readiness when a latest monitor result is absent", async () => {
    const service = buildService({
      latest: {
        payables_pressure: {
          companyKey: "acme",
          monitorKind: "payables_pressure",
          monitorResult: null,
          alertCard: null,
        },
      },
    });

    const result = await service.getReadiness("acme");
    const item = requireItem(result, "monitor:payables_pressure:missing-latest");

    expect(result.aggregateStatus).toBe("blocked_by_evidence");
    expect(item).toMatchObject({
      status: "blocked_by_evidence",
      sourcePosture: { state: "monitor_context_missing" },
      proofPosture: { state: "limited_by_missing_monitor_context" },
      relatedMonitorKind: "payables_pressure",
    });
    expect(item.limitations.join(" ")).toContain(
      "does not rerun monitors or create monitor results",
    );
  });

  it("carries non-ready close/control checklist posture into source and policy attention items", async () => {
    const service = buildService({
      checklist: buildChecklist({
        items: [
          buildChecklistItem(
            "cash_source_freshness_review",
            "blocked_by_evidence",
          ),
          buildChecklistItem(
            "policy_source_freshness_review",
            "needs_review",
          ),
        ],
      }),
    });

    const result = await service.getReadiness("acme");
    const cash = requireItem(
      result,
      "close-control:cash_source_freshness_review",
    );
    const policy = requireItem(
      result,
      "close-control:policy_source_freshness_review",
    );

    expect(cash).toMatchObject({
      family: "source_freshness_attention",
      status: "blocked_by_evidence",
      relatedChecklistItemFamily: "cash_source_freshness_review",
      proofPosture: { state: "limited_by_missing_source" },
    });
    expect(policy).toMatchObject({
      family: "policy_source_attention",
      status: "needs_review",
      relatedChecklistItemFamily: "policy_source_freshness_review",
      proofPosture: { state: "limited_by_data_quality_gap" },
    });
    expect(cash.limitations.join(" ")).toContain(
      "does not acknowledge checklist items",
    );
  });

  it("propagates proof posture and limitations from persisted monitor results", async () => {
    const service = buildService({
      latest: {
        collections_pressure: buildLatestMonitor(
          buildMonitorResult("collections_pressure", {
            id: collectionsMonitorResultId,
            status: "alert",
            freshnessState: "stale",
            proofState: "limited_by_stale_source",
            limitations: [
              "Collections posture is stale and needs human freshness review.",
            ],
          }),
        ),
      },
    });

    const result = await service.getReadiness("acme");
    const item = requireItem(
      result,
      `monitor:collections_pressure:${collectionsMonitorResultId}`,
    );

    expect(item.status).toBe("needs_review");
    expect(item.sourcePosture.state).toBe("stale_source");
    expect(item.proofPosture.state).toBe("limited_by_stale_source");
    expect(item.limitations).toContain(
      "Collections posture is stale and needs human freshness review.",
    );
  });

  it("keeps all runtime, delivery, reporting, approval, mission, and action boundaries absent", async () => {
    const service = buildService();

    const result = await service.getReadiness("acme");

    expect(result.runtimeActionBoundary).toMatchObject({
      runtimeCodexUsed: false,
      deliveryCreated: false,
      outboxSendCreated: false,
      reportCreated: false,
      approvalCreated: false,
      missionCreated: false,
      monitorRunTriggered: false,
      monitorResultCreated: false,
      accountingWriteCreated: false,
      bankWriteCreated: false,
      taxFilingCreated: false,
      legalAdviceGenerated: false,
      policyAdviceGenerated: false,
      paymentInstructionCreated: false,
      collectionInstructionCreated: false,
      customerContactInstructionCreated: false,
      autonomousActionCreated: false,
    });
  });
});

function buildService(input: {
  checklist?: CloseControlChecklistResult;
  extraMonitoringMethods?: Record<string, unknown>;
  latest?: Partial<Record<MonitorKind, MonitorLatestResult>>;
} = {}) {
  const latest = {
    cash_posture: buildLatestMonitor(
      buildMonitorResult("cash_posture", { id: cashMonitorResultId }),
    ),
    collections_pressure: buildLatestMonitor(
      buildMonitorResult("collections_pressure", {
        id: collectionsMonitorResultId,
      }),
    ),
    payables_pressure: buildLatestMonitor(
      buildMonitorResult("payables_pressure", { id: payablesMonitorResultId }),
    ),
    policy_covenant_threshold: buildLatestMonitor(
      buildMonitorResult("policy_covenant_threshold", {
        id: policyMonitorResultId,
      }),
    ),
    ...input.latest,
  } satisfies Record<MonitorKind, MonitorLatestResult>;
  const closeControlService = {
    getChecklist: vi.fn().mockResolvedValue(input.checklist ?? buildChecklist()),
  };
  const monitoringService = {
    getLatestCashPostureMonitorResult: vi
      .fn()
      .mockResolvedValue(latest.cash_posture),
    getLatestCollectionsPressureMonitorResult: vi
      .fn()
      .mockResolvedValue(latest.collections_pressure),
    getLatestPayablesPressureMonitorResult: vi
      .fn()
      .mockResolvedValue(latest.payables_pressure),
    getLatestPolicyCovenantThresholdMonitorResult: vi
      .fn()
      .mockResolvedValue(latest.policy_covenant_threshold),
    ...input.extraMonitoringMethods,
  };

  return new OperatorReadinessService({
    closeControlService,
    monitoringService,
    now: () => new Date(generatedAt),
  });
}

function buildLatestMonitor(monitorResult: MonitorResult): MonitorLatestResult {
  return {
    companyKey: monitorResult.companyKey,
    monitorKind: monitorResult.monitorKind,
    monitorResult,
    alertCard: monitorResult.alertCard,
  };
}

function buildMonitorResult(
  monitorKind: MonitorKind,
  input: {
    freshnessState?: MonitorResult["sourceFreshnessPosture"]["state"];
    id: string;
    limitations?: string[];
    proofState?: MonitorResult["proofBundlePosture"]["state"];
    status?: MonitorResult["status"];
  },
): MonitorResult {
  const status = input.status ?? "no_alert";
  const severity = status === "alert" ? "warning" : "none";
  const condition =
    status === "alert"
      ? [
          {
            kind: "threshold_breach" as const,
            severity: "warning" as const,
            summary: `${monitorKind} needs human review.`,
            evidencePath: "conditions.0",
          },
        ]
      : [];
  const freshnessState = input.freshnessState ?? "fresh";
  const proofState = input.proofState ?? "source_backed";
  const limitations = input.limitations ?? [
    `${monitorKind} monitor reads stored source posture only.`,
  ];

  return {
    id: input.id,
    companyId,
    companyKey: "acme",
    monitorKind,
    runKey: `${monitorKind}:acme:test`,
    triggeredBy: "operator",
    status,
    severity,
    conditions: condition,
    sourceFreshnessPosture: {
      state: freshnessState,
      latestAttemptedSyncRunId: syncRunId,
      latestSuccessfulSyncRunId:
        freshnessState === "missing" ? null : syncRunId,
      latestSuccessfulSource:
        freshnessState === "missing"
          ? null
          : {
              sourceId,
              sourceSnapshotId,
              sourceFileId,
              syncRunId,
            },
      missingSource: freshnessState === "missing",
      failedSource: freshnessState === "failed",
      summary: `${monitorKind} source freshness is ${freshnessState}.`,
    },
    sourceLineageRefs:
      freshnessState === "missing"
        ? []
        : [
            {
              sourceId,
              sourceSnapshotId,
              sourceFileId,
              syncRunId,
              targetKind: "bank_account_summary",
              targetId: null,
              lineageCount: 1,
              lineageTargetCounts: sourceLineageTargetCounts,
              summary: `${monitorKind} source lineage.`,
            },
          ],
    deterministicSeverityRationale:
      status === "alert"
        ? `${monitorKind} latest persisted result is alerting.`
        : `${monitorKind} latest persisted result is clear.`,
    limitations,
    proofBundlePosture: {
      state: proofState,
      summary: `${monitorKind} proof posture is ${proofState}.`,
    },
    replayPosture: {
      state: "not_appended",
      reason: "Monitor results are company-scoped records.",
    },
    runtimeBoundary: {
      runtimeCodexUsed: false,
      deliveryActionUsed: false,
      investigationMissionCreated: false,
      autonomousFinanceActionUsed: false,
      summary: "Monitor result was produced by deterministic evaluation.",
    },
    humanReviewNextStep: `Review ${monitorKind.replaceAll("_", " ")} posture before any follow-up.`,
    alertCard:
      status === "alert"
        ? {
            companyKey: "acme",
            monitorKind,
            status: "alert",
            severity: "warning",
            deterministicSeverityRationale:
              `${monitorKind} latest persisted result is alerting.`,
            conditionSummaries: condition.map((item) => item.summary),
            sourceFreshnessPosture: {
              state: freshnessState,
              latestAttemptedSyncRunId: syncRunId,
              latestSuccessfulSyncRunId:
                freshnessState === "missing" ? null : syncRunId,
              latestSuccessfulSource:
                freshnessState === "missing"
                  ? null
                  : {
                      sourceId,
                      sourceSnapshotId,
                      sourceFileId,
                      syncRunId,
                    },
              missingSource: freshnessState === "missing",
              failedSource: freshnessState === "failed",
              summary: `${monitorKind} source freshness is ${freshnessState}.`,
            },
            sourceLineageRefs: [],
            sourceLineageSummary: `${monitorKind} source lineage summary.`,
            limitations,
            proofBundlePosture: {
              state: proofState,
              summary: `${monitorKind} proof posture is ${proofState}.`,
            },
            humanReviewNextStep: `Review ${monitorKind.replaceAll("_", " ")} posture before any follow-up.`,
            createdAt: generatedAt,
          }
        : null,
    createdAt: generatedAt,
  };
}

function buildChecklist(input: {
  items?: CloseControlChecklistItem[];
} = {}): CloseControlChecklistResult {
  const overrides = new Map(
    (input.items ?? []).map((item) => [item.family, item]),
  );
  const families: CloseControlChecklistItem["family"][] = [
    "source_coverage_review",
    "cash_source_freshness_review",
    "receivables_aging_source_freshness_review",
    "payables_aging_source_freshness_review",
    "policy_source_freshness_review",
    "monitor_replay_readiness",
  ];
  const items = families.map(
    (family) => overrides.get(family) ?? buildChecklistItem(family),
  );
  const aggregateStatus = items.some(
    (item) => item.status === "blocked_by_evidence",
  )
    ? "blocked_by_evidence"
    : items.some((item) => item.status === "needs_review")
      ? "needs_review"
      : "ready_for_review";

  return {
    companyKey: "acme",
    generatedAt,
    aggregateStatus,
    items,
    evidenceSummary:
      "Checklist derives stored source, policy, and monitor context posture.",
    limitations: ["Checklist is review-only and does not close the books."],
    runtimeActionBoundary: {
      runtimeCodexUsed: false,
      deliveryCreated: false,
      reportCreated: false,
      approvalCreated: false,
      accountingWriteCreated: false,
      bankWriteCreated: false,
      taxFilingCreated: false,
      legalAdviceGenerated: false,
      policyAdviceGenerated: false,
      paymentInstructionCreated: false,
      collectionInstructionCreated: false,
      customerContactInstructionCreated: false,
      autonomousActionCreated: false,
      monitorRunTriggered: false,
      missionCreated: false,
      summary: "Checklist is deterministic and read-only.",
      replayImplication: "No checklist replay event is appended.",
    },
  };
}

function buildChecklistItem(
  family: CloseControlChecklistItem["family"],
  status: CloseControlChecklistStatus = "ready_for_review",
): CloseControlChecklistItem {
  const monitorFamily = family === "monitor_replay_readiness";
  const policyFamily = family === "policy_source_freshness_review";

  return {
    family,
    status,
    sourcePosture: {
      state:
        status === "blocked_by_evidence"
          ? "missing_source"
          : monitorFamily
            ? "monitor_context_present"
            : status === "needs_review"
              ? "limited_source"
              : "source_backed",
      summary: `${family} source posture is ${status}.`,
      refs: [
        {
          kind: monitorFamily ? "monitor_result" : "derived_checklist_read",
          evidencePath: `checklist.items.${family}`,
          summary: `${family} evidence ref.`,
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind: monitorFamily ? "cash_posture" : null,
          monitorResultId: monitorFamily ? cashMonitorResultId : null,
        },
      ],
    },
    evidenceBasis: {
      basisKind: monitorFamily
        ? "latest_persisted_monitor_result_context"
        : policyFamily
          ? "stored_cfo_wiki_policy_posture"
          : "stored_finance_twin_posture",
      summary: `${family} evidence basis is stored posture only.`,
      refs: [],
    },
    freshnessSummary: {
      state: status === "blocked_by_evidence" ? "missing" : "fresh",
      summary: `${family} freshness is ${status}.`,
      latestObservedAt: generatedAt,
    },
    limitations: [`${family} limitation is carried forward.`],
    humanReviewNextStep: `Review ${family} before any follow-up.`,
    proofPosture: {
      state:
        status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : status === "needs_review"
            ? policyFamily
              ? "limited_by_data_quality_gap"
              : "limited_by_coverage_gap"
            : "source_backed",
      summary: `${family} proof posture is ${status}.`,
    },
  };
}

function requireItem(
  result: Awaited<ReturnType<OperatorReadinessService["getReadiness"]>>,
  itemKey: string,
) {
  const item = result.attentionItems.find(
    (candidate) => candidate.itemKey === itemKey,
  );

  if (!item) {
    throw new Error(`Missing operator readiness item ${itemKey}`);
  }

  return item;
}
