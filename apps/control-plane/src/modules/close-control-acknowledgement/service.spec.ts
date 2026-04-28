import { describe, expect, it, vi } from "vitest";
import type {
  CloseControlChecklistItem,
  CloseControlChecklistItemFamily,
  CloseControlChecklistResult,
  CloseControlChecklistStatus,
  MonitorKind,
  OperatorAttentionItem,
  OperatorReadinessResult,
} from "@pocket-cto/domain";
import { CloseControlAcknowledgementService } from "./service";

const generatedAt = "2026-04-28T12:00:00.000Z";

describe("CloseControlAcknowledgementService", () => {
  it("maps ready checklist and readiness posture to internal acknowledgement readiness only", async () => {
    const service = buildService();

    const result = await service.getAcknowledgementReadiness("acme");

    expect(result.aggregateStatus).toBe("ready_for_acknowledgement");
    expect(
      result.acknowledgementTargets.map((target) => [
        target.targetKey,
        target.status,
      ]),
    ).toEqual([
      ["close-control:checklist-aggregate", "ready_for_acknowledgement"],
      [
        "close-control:item-family:source_coverage_review",
        "ready_for_acknowledgement",
      ],
      [
        "close-control:item-family:cash_source_freshness_review",
        "ready_for_acknowledgement",
      ],
      [
        "close-control:item-family:receivables_aging_source_freshness_review",
        "ready_for_acknowledgement",
      ],
      [
        "close-control:item-family:payables_aging_source_freshness_review",
        "ready_for_acknowledgement",
      ],
      [
        "close-control:item-family:policy_source_freshness_review",
        "ready_for_acknowledgement",
      ],
      [
        "close-control:item-family:monitor_replay_readiness",
        "ready_for_acknowledgement",
      ],
    ]);
    expect(result.runtimeActionBoundary).toMatchObject({
      runtimeCodexUsed: false,
      deliveryCreated: false,
      outboxSendCreated: false,
      reportCreated: false,
      approvalCreated: false,
      missionCreated: false,
      monitorRunTriggered: false,
      monitorResultCreated: false,
      paymentInstructionCreated: false,
      accountingWriteCreated: false,
      bankWriteCreated: false,
      taxFilingCreated: false,
      legalAdviceGenerated: false,
      policyAdviceGenerated: false,
      collectionInstructionCreated: false,
      customerContactInstructionCreated: false,
      autonomousActionCreated: false,
    });
  });

  it.each([
    ["needs_review", "needs_review_before_acknowledgement"],
    ["blocked_by_evidence", "blocked_by_evidence"],
  ] as const)(
    "maps checklist aggregate %s to %s",
    async (checklistStatus, acknowledgementStatus) => {
      const service = buildService({
        checklist: buildChecklist({
          itemStatuses: {
            cash_source_freshness_review: checklistStatus,
          },
        }),
      });

      const result = await service.getAcknowledgementReadiness("acme");
      const aggregate = requireTarget(
        result,
        "close-control:checklist-aggregate",
      );

      expect(aggregate.status).toBe(acknowledgementStatus);
      expect(result.aggregateStatus).toBe(acknowledgementStatus);
    },
  );

  it("carries non-ready checklist item-family posture into acknowledgement targets", async () => {
    const service = buildService({
      checklist: buildChecklist({
        itemStatuses: {
          cash_source_freshness_review: "needs_review",
          policy_source_freshness_review: "blocked_by_evidence",
        },
      }),
      readiness: buildReadiness({
        attentionItems: [
          buildAttentionItem({
            itemKey: "close-control:cash_source_freshness_review",
            relatedChecklistItemFamily: "cash_source_freshness_review",
            status: "needs_review",
          }),
          buildAttentionItem({
            itemKey: "close-control:policy_source_freshness_review",
            relatedChecklistItemFamily: "policy_source_freshness_review",
            status: "blocked_by_evidence",
          }),
        ],
        aggregateStatus: "blocked_by_evidence",
      }),
    });

    const result = await service.getAcknowledgementReadiness("acme");
    const cash = requireTarget(
      result,
      "close-control:item-family:cash_source_freshness_review",
    );
    const policy = requireTarget(
      result,
      "close-control:item-family:policy_source_freshness_review",
    );

    expect(cash).toMatchObject({
      status: "needs_review_before_acknowledgement",
      relatedReadinessItemKey: "close-control:cash_source_freshness_review",
      proofPosture: { state: "limited_by_coverage_gap" },
    });
    expect(policy).toMatchObject({
      status: "blocked_by_evidence",
      relatedReadinessItemKey: "close-control:policy_source_freshness_review",
      sourcePosture: { missingSource: true },
    });
    expect(policy.limitations.join(" ")).toContain(
      "Required stored source posture is missing",
    );
  });

  it("surfaces operator-readiness context and prevents a ready checklist from hiding readiness needs", async () => {
    const service = buildService({
      readiness: buildReadiness({
        attentionItems: [
          buildAttentionItem({
            itemKey: "monitor:cash_posture:alert",
            relatedMonitorKind: "cash_posture",
            status: "needs_review",
          }),
        ],
        aggregateStatus: "needs_review",
      }),
    });

    const result = await service.getAcknowledgementReadiness("acme");
    const aggregate = requireTarget(
      result,
      "close-control:checklist-aggregate",
    );

    expect(aggregate.status).toBe("needs_review_before_acknowledgement");
    expect(aggregate.sourcePosture).toMatchObject({
      state: "limited_source",
      missingSource: false,
    });
    expect(aggregate.freshnessSummary.state).toBe("mixed");
    expect(aggregate.proofPosture.state).toBe("limited_by_coverage_gap");
    expect(result.operatorReadinessContext).toMatchObject({
      operatorReadinessAggregateStatus: "needs_review",
      nonReadyReadinessItemKeys: ["monitor:cash_posture:alert"],
    });
    expect(aggregate.limitations.join(" ")).toContain(
      "Operator-readiness aggregate posture is needs_review",
    );
    expect(aggregate.limitations.join(" ")).toContain(
      "Latest persisted monitor result needs review",
    );
  });

  it("maps ready checklist plus blocked operator-readiness aggregate to blocked posture with missing evidence visible", async () => {
    const service = buildService({
      readiness: buildReadiness({
        attentionItems: [
          buildAttentionItem({
            itemKey: "close-control:policy_source_freshness_review",
            relatedChecklistItemFamily: "policy_source_freshness_review",
            status: "blocked_by_evidence",
          }),
        ],
        aggregateStatus: "blocked_by_evidence",
      }),
    });

    const result = await service.getAcknowledgementReadiness("acme");
    const aggregate = requireTarget(
      result,
      "close-control:checklist-aggregate",
    );
    const policy = requireTarget(
      result,
      "close-control:item-family:policy_source_freshness_review",
    );

    expect(result.aggregateStatus).toBe("blocked_by_evidence");
    expect(aggregate).toMatchObject({
      status: "blocked_by_evidence",
      sourcePosture: {
        state: "missing_source",
        missingSource: true,
      },
      freshnessSummary: { state: "missing" },
      proofPosture: { state: "limited_by_missing_source" },
    });
    expect(aggregate.limitations.join(" ")).toContain(
      "Operator-readiness aggregate posture is blocked_by_evidence",
    );
    expect(policy).toMatchObject({
      status: "blocked_by_evidence",
      relatedReadinessItemKey: "close-control:policy_source_freshness_review",
      sourcePosture: {
        state: "missing_source",
        missingSource: true,
      },
      freshnessSummary: { state: "missing" },
      proofPosture: { state: "limited_by_missing_source" },
    });
    expect(policy.limitations.join(" ")).toContain(
      "Related operator-readiness item close-control:policy_source_freshness_review is blocked_by_evidence",
    );
  });

  it("maps ready checklist item plus related needs-review operator-readiness item to item-family review posture", async () => {
    const service = buildService({
      readiness: buildReadiness({
        attentionItems: [
          buildAttentionItem({
            itemKey: "close-control:cash_source_freshness_review",
            relatedChecklistItemFamily: "cash_source_freshness_review",
            status: "needs_review",
          }),
        ],
        aggregateStatus: "needs_review",
      }),
    });

    const result = await service.getAcknowledgementReadiness("acme");
    const cash = requireTarget(
      result,
      "close-control:item-family:cash_source_freshness_review",
    );

    expect(cash).toMatchObject({
      status: "needs_review_before_acknowledgement",
      relatedReadinessItemKey: "close-control:cash_source_freshness_review",
      sourcePosture: {
        state: "limited_source",
        missingSource: false,
      },
      freshnessSummary: { state: "mixed" },
      proofPosture: { state: "limited_by_coverage_gap" },
    });
    expect(cash.limitations.join(" ")).toContain(
      "Related operator-readiness item close-control:cash_source_freshness_review is needs_review",
    );
  });

  it("does not call monitor run, mission, report, approval, outbox, runtime, or action methods supplied on dependencies", async () => {
    const forbiddenMethods = {
      createApproval: vi.fn(),
      createMission: vi.fn(),
      createOrOpenMonitorInvestigation: vi.fn(),
      createReport: vi.fn(),
      createRuntimeThread: vi.fn(),
      sendOutboxEvent: vi.fn(),
      runCashPostureMonitor: vi.fn(),
      runCollectionsPressureMonitor: vi.fn(),
      runPayablesPressureMonitor: vi.fn(),
      runPolicyCovenantThresholdMonitor: vi.fn(),
    };
    const service = buildService({
      extraCloseControlMethods: forbiddenMethods,
      extraReadinessMethods: forbiddenMethods,
    });

    const result = await service.getAcknowledgementReadiness("acme");

    expect(result.runtimeActionBoundary.monitorRunTriggered).toBe(false);
    expect(result.runtimeActionBoundary.monitorResultCreated).toBe(false);
    expect(result.runtimeActionBoundary.missionCreated).toBe(false);
    expect(result.runtimeActionBoundary.reportCreated).toBe(false);
    expect(result.runtimeActionBoundary.approvalCreated).toBe(false);
    for (const method of Object.values(forbiddenMethods)) {
      expect(method).not.toHaveBeenCalled();
    }
  });

  it("keeps acknowledgement statuses free of approval and close-complete states", async () => {
    const service = buildService();

    const result = await service.getAcknowledgementReadiness("acme");
    const statuses = [
      result.aggregateStatus,
      ...result.acknowledgementTargets.map((target) => target.status),
    ];

    expect(statuses).not.toContain("approved");
    expect(statuses).not.toContain("approval_pending");
    expect(statuses).not.toContain("signed_off");
    expect(statuses).not.toContain("certified");
    expect(statuses).not.toContain("close_complete");
  });
});

function buildService(
  input: {
    checklist?: CloseControlChecklistResult;
    extraCloseControlMethods?: Record<string, unknown>;
    extraReadinessMethods?: Record<string, unknown>;
    readiness?: OperatorReadinessResult;
  } = {},
) {
  return new CloseControlAcknowledgementService({
    closeControlService: {
      getChecklist: vi
        .fn()
        .mockResolvedValue(input.checklist ?? buildChecklist()),
      ...input.extraCloseControlMethods,
    },
    operatorReadinessService: {
      getReadiness: vi
        .fn()
        .mockResolvedValue(input.readiness ?? buildReadiness()),
      ...input.extraReadinessMethods,
    },
    now: () => new Date(generatedAt),
  });
}

function buildChecklist(
  input: {
    itemStatuses?: Partial<
      Record<CloseControlChecklistItemFamily, CloseControlChecklistStatus>
    >;
  } = {},
): CloseControlChecklistResult {
  const items = checklistFamilies.map((family) =>
    buildChecklistItem(
      family,
      input.itemStatuses?.[family] ?? "ready_for_review",
    ),
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
      "F6H checklist is derived from stored Finance Twin, CFO Wiki, and latest persisted monitor posture.",
    limitations: [
      "The checklist is review posture and does not assert close completion.",
    ],
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
      summary: "Checklist read is deterministic and action-free.",
      replayImplication: "Checklist read is not appended to mission replay.",
    },
  };
}

function buildChecklistItem(
  family: CloseControlChecklistItemFamily,
  status: CloseControlChecklistStatus,
): CloseControlChecklistItem {
  return {
    family,
    status,
    sourcePosture: {
      state:
        status === "blocked_by_evidence"
          ? "missing_source"
          : status === "needs_review"
            ? "limited_source"
            : family === "monitor_replay_readiness"
              ? "monitor_context_present"
              : "source_backed",
      summary:
        status === "blocked_by_evidence"
          ? "Required stored source posture is missing."
          : status === "needs_review"
            ? "Stored source posture needs human review."
            : "Stored source posture is available for review.",
      refs: [],
    },
    evidenceBasis: {
      basisKind:
        family === "source_coverage_review"
          ? "derived_source_coverage"
          : family === "policy_source_freshness_review"
            ? "stored_cfo_wiki_policy_posture"
            : family === "monitor_replay_readiness"
              ? "latest_persisted_monitor_result_context"
              : "stored_finance_twin_posture",
      summary: `${family} is derived from persisted evidence posture only.`,
      refs: [],
    },
    freshnessSummary: {
      state:
        status === "blocked_by_evidence"
          ? "missing"
          : status === "needs_review"
            ? "mixed"
            : "fresh",
      summary:
        status === "blocked_by_evidence"
          ? "Fresh stored source posture is missing."
          : status === "needs_review"
            ? "Freshness posture needs human review."
            : "Fresh stored source posture is available.",
      latestObservedAt: generatedAt,
    },
    limitations: [
      status === "ready_for_review"
        ? "The item is internal review posture only."
        : "Required stored source posture is missing or needs review.",
    ],
    humanReviewNextStep:
      "Review the cited source posture before relying on this checklist item.",
    proofPosture: {
      state:
        status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : status === "needs_review"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary:
        status === "blocked_by_evidence"
          ? "Proof is limited by missing stored evidence."
          : status === "needs_review"
            ? "Proof is limited by review-only coverage posture."
            : "Proof is backed by stored posture.",
    },
  };
}

function buildReadiness(
  input: {
    aggregateStatus?: OperatorReadinessResult["aggregateStatus"];
    attentionItems?: OperatorAttentionItem[];
  } = {},
): OperatorReadinessResult {
  return {
    companyKey: "acme",
    generatedAt,
    aggregateStatus: input.aggregateStatus ?? "ready_for_review",
    attentionItems: input.attentionItems ?? [
      buildAttentionItem({
        itemKey: "close-control:aggregate",
        status: "ready_for_review",
      }),
    ],
    evidenceSummary:
      "F6J readiness is derived from latest persisted monitor results and close/control checklist posture.",
    limitations: ["Readiness is internal review posture only."],
    runtimeActionBoundary: {
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
      summary: "Readiness read is deterministic and action-free.",
      replayImplication: "Readiness read is not appended to mission replay.",
    },
  };
}

function buildAttentionItem(input: {
  itemKey: string;
  relatedChecklistItemFamily?: CloseControlChecklistItemFamily | null;
  relatedMonitorKind?: MonitorKind | null;
  status: OperatorAttentionItem["status"];
}): OperatorAttentionItem {
  return {
    itemKey: input.itemKey,
    family: input.relatedMonitorKind
      ? "monitor_alert_attention"
      : input.relatedChecklistItemFamily === "policy_source_freshness_review"
        ? "policy_source_attention"
        : input.relatedChecklistItemFamily
          ? "source_freshness_attention"
          : "close_control_attention",
    status: input.status,
    evidenceBasis: {
      basisKind: input.relatedMonitorKind
        ? "latest_persisted_monitor_result"
        : input.relatedChecklistItemFamily
          ? "source_freshness_posture"
          : "close_control_checklist_posture",
      summary:
        input.status === "ready_for_review"
          ? "Operator-readiness context is ready for review."
          : "Latest persisted monitor result needs review before acknowledgement readiness.",
      refs: [],
    },
    sourceLineageRefs: [],
    sourcePosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "missing_source"
          : input.status === "needs_review"
            ? "limited_source"
            : "source_backed",
      summary:
        input.status === "ready_for_review"
          ? "Operator-readiness source posture is available."
          : "Operator-readiness source posture needs review.",
      refs: [],
    },
    freshnessSummary: {
      state: input.status === "blocked_by_evidence" ? "missing" : "fresh",
      summary: "Operator-readiness freshness posture is carried forward.",
      latestObservedAt: generatedAt,
    },
    limitations: [
      input.status === "ready_for_review"
        ? "Readiness context is internal review posture only."
        : "Latest persisted monitor result needs review before acknowledgement readiness.",
    ],
    proofPosture: {
      state:
        input.status === "blocked_by_evidence"
          ? "limited_by_missing_source"
          : input.status === "needs_review"
            ? "limited_by_coverage_gap"
            : "source_backed",
      summary: "Readiness proof posture is carried forward.",
    },
    humanReviewNextStep:
      "Review operator-readiness context before any follow-up.",
    relatedMonitorKind: input.relatedMonitorKind ?? null,
    relatedChecklistItemFamily: input.relatedChecklistItemFamily ?? null,
    relatedAlertStatus: input.relatedMonitorKind
      ? input.status === "ready_for_review"
        ? "no_alert"
        : "alert"
      : null,
  };
}

function requireTarget(
  result: Awaited<
    ReturnType<
      CloseControlAcknowledgementService["getAcknowledgementReadiness"]
    >
  >,
  targetKey: string,
) {
  const target = result.acknowledgementTargets.find(
    (candidate) => candidate.targetKey === targetKey,
  );

  if (!target) {
    throw new Error(`Missing acknowledgement target ${targetKey}`);
  }

  return target;
}

const checklistFamilies = [
  "source_coverage_review",
  "cash_source_freshness_review",
  "receivables_aging_source_freshness_review",
  "payables_aging_source_freshness_review",
  "policy_source_freshness_review",
  "monitor_replay_readiness",
] as const satisfies CloseControlChecklistItemFamily[];
