import {
  CloseControlAcknowledgementReadinessResultSchema,
  deriveCloseControlAcknowledgementAggregateStatus,
  type CloseControlAcknowledgementReadinessResult,
  type CloseControlAcknowledgementStatus,
  type CloseControlAcknowledgementTarget,
  type CloseControlAcknowledgementSourcePostureState,
  type CloseControlChecklistItem,
  type CloseControlChecklistResult,
  type CloseControlChecklistStatus,
  type CloseControlFreshnessState,
  type CloseControlProofPostureState,
  type OperatorAttentionItem,
  type OperatorReadinessResult,
} from "@pocket-cto/domain";

type BuildCloseControlAcknowledgementInput = {
  checklist: CloseControlChecklistResult;
  companyKey: string;
  generatedAt: string;
  readiness: OperatorReadinessResult;
};

export function buildCloseControlAcknowledgementReadinessResult(
  input: BuildCloseControlAcknowledgementInput,
): CloseControlAcknowledgementReadinessResult {
  const readinessContext = buildReadinessContext(input.readiness);
  const readinessStatusLimitations = buildReadinessStatusLimitations(
    input.readiness,
  );
  const acknowledgementTargets = [
    buildAggregateTarget(input.checklist, input.readiness),
    ...input.checklist.items.map((item) =>
      buildItemTarget(item, findRelatedReadinessItem(input.readiness, item)),
    ),
  ];

  return CloseControlAcknowledgementReadinessResultSchema.parse({
    companyKey: input.companyKey,
    generatedAt: input.generatedAt,
    aggregateStatus: deriveCloseControlAcknowledgementAggregateStatus(
      acknowledgementTargets,
    ),
    acknowledgementTargets,
    evidenceSummary:
      "F6K acknowledgement readiness is derived from the deterministic close/control checklist result and internal operator-readiness result only.",
    limitations: dedupe([
      "Acknowledgement readiness is an internal review read model and does not create an acknowledgement record.",
      "Acknowledgement readiness emits only internal acknowledgement-readiness statuses.",
      "F6K reads existing checklist and operator-readiness posture only and creates no new records or actions.",
      ...readinessStatusLimitations,
      ...input.checklist.limitations,
      ...input.readiness.limitations,
    ]),
    operatorReadinessContext: readinessContext,
    runtimeActionBoundary: buildRuntimeActionBoundary(),
  });
}

function buildAggregateTarget(
  checklist: CloseControlChecklistResult,
  readiness: OperatorReadinessResult,
): CloseControlAcknowledgementTarget {
  const status = mapAggregateStatus(checklist, readiness);
  const nonReadyReadinessItems = readiness.attentionItems.filter(
    (item) => item.status !== "ready_for_review",
  );
  const sourcePostureState = mapAggregateSourcePostureState(
    checklist,
    readiness,
    nonReadyReadinessItems,
    status,
  );
  const readinessLimitations = nonReadyReadinessItems.flatMap(
    (item) => item.limitations,
  );

  return {
    targetKey: "close-control:checklist-aggregate",
    targetKind: "checklist_aggregate",
    status,
    evidenceBasis: {
      summary:
        "Checklist aggregate acknowledgement readiness is based on the F6H aggregate checklist status plus F6J operator-readiness context.",
      checklistEvidenceRefs: [
        {
          kind: "derived_checklist_read",
          evidencePath: "closeControlChecklist.aggregateStatus",
          summary: "Derived close/control checklist aggregate posture.",
          sourceId: null,
          sourceSnapshotId: null,
          sourceFileId: null,
          syncRunId: null,
          pageKey: null,
          monitorKind: null,
          monitorResultId: null,
        },
      ],
      readinessEvidenceRefs: nonReadyReadinessItems.flatMap(
        (item) => item.evidenceBasis.refs,
      ),
    },
    sourcePosture: {
      state: sourcePostureState,
      summary: buildAggregateSourceSummary(
        checklist,
        readiness,
        nonReadyReadinessItems,
      ),
      missingSource:
        status === "blocked_by_evidence" &&
        (checklist.aggregateStatus === "blocked_by_evidence" ||
          readiness.aggregateStatus === "blocked_by_evidence" ||
          isMissingAcknowledgementSource(sourcePostureState)),
    },
    freshnessSummary: {
      state: mapAggregateFreshness(readiness, nonReadyReadinessItems, status),
      summary: buildAggregateFreshnessSummary(
        readiness,
        nonReadyReadinessItems,
        status,
      ),
      latestObservedAt: checklist.generatedAt,
    },
    limitations: dedupe([
      ...checklist.limitations,
      ...buildReadinessStatusLimitations(readiness),
      ...readinessLimitations,
      "Aggregate acknowledgement readiness remains internal review posture only.",
    ]),
    proofPosture: {
      state: mapAggregateProofState(readiness, nonReadyReadinessItems, status),
      summary: buildAggregateProofSummary(
        readiness,
        nonReadyReadinessItems,
        status,
      ),
    },
    humanReviewNextStep:
      status === "ready_for_acknowledgement"
        ? "Review the aggregate checklist evidence and readiness context before any future acknowledgement record path."
        : "Review non-ready checklist or operator-readiness posture before treating the aggregate as acknowledgement-ready.",
    relatedChecklistItemFamily: null,
    relatedReadinessItemKey: null,
  };
}

function buildItemTarget(
  item: CloseControlChecklistItem,
  readinessItem: OperatorAttentionItem | null,
): CloseControlAcknowledgementTarget {
  const status = mapItemStatus(item, readinessItem);
  const sourcePosture = mapItemSourcePosture(item, readinessItem, status);
  const freshnessSummary = mapItemFreshnessSummary(item, readinessItem, status);
  const proofPosture = mapItemProofPosture(item, readinessItem, status);

  return {
    targetKey: `close-control:item-family:${item.family}`,
    targetKind: "checklist_item_family",
    status,
    evidenceBasis: {
      summary: readinessItem
        ? `${item.evidenceBasis.summary} Related operator-readiness context is ${readinessItem.status}.`
        : item.evidenceBasis.summary,
      checklistEvidenceRefs: item.evidenceBasis.refs,
      readinessEvidenceRefs: readinessItem?.evidenceBasis.refs ?? [],
    },
    sourcePosture: {
      state: sourcePosture.state,
      summary: readinessItem
        ? `${sourcePosture.summary} Operator-readiness context is ${readinessItem.status}.`
        : item.sourcePosture.summary,
      missingSource: isMissingAcknowledgementSource(sourcePosture.state),
    },
    freshnessSummary,
    limitations: dedupe([
      ...item.limitations,
      ...buildRelatedReadinessLimitations(readinessItem),
      ...(readinessItem?.limitations ?? []),
      "Checklist item-family acknowledgement readiness is internal review posture only and creates no record or action.",
    ]),
    proofPosture,
    humanReviewNextStep:
      status === "ready_for_acknowledgement"
        ? "Review the cited checklist item-family evidence before any future acknowledgement record path."
        : item.humanReviewNextStep,
    relatedChecklistItemFamily: item.family,
    relatedReadinessItemKey: readinessItem?.itemKey ?? null,
  };
}

function mapAggregateStatus(
  checklist: CloseControlChecklistResult,
  readiness: OperatorReadinessResult,
): CloseControlAcknowledgementStatus {
  if (checklist.aggregateStatus !== "ready_for_review") {
    return mapChecklistStatus(checklist.aggregateStatus);
  }

  if (readiness.aggregateStatus === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (readiness.aggregateStatus === "needs_review") {
    return "needs_review_before_acknowledgement";
  }

  return "ready_for_acknowledgement";
}

function mapChecklistStatus(
  status: CloseControlChecklistStatus,
): CloseControlAcknowledgementStatus {
  if (status === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (status === "needs_review") {
    return "needs_review_before_acknowledgement";
  }

  return "ready_for_acknowledgement";
}

function mapItemStatus(
  item: CloseControlChecklistItem,
  readinessItem: OperatorAttentionItem | null,
): CloseControlAcknowledgementStatus {
  if (item.status !== "ready_for_review") {
    return mapChecklistStatus(item.status);
  }

  if (readinessItem?.status === "blocked_by_evidence") {
    return "blocked_by_evidence";
  }

  if (readinessItem?.status === "needs_review") {
    return "needs_review_before_acknowledgement";
  }

  return "ready_for_acknowledgement";
}

function mapAggregateSourcePostureState(
  checklist: CloseControlChecklistResult,
  readiness: OperatorReadinessResult,
  nonReadyReadinessItems: OperatorAttentionItem[],
  status: CloseControlAcknowledgementStatus,
): CloseControlAcknowledgementSourcePostureState {
  if (status === "ready_for_acknowledgement") {
    return "source_backed";
  }

  if (checklist.aggregateStatus === "blocked_by_evidence") {
    return "missing_source";
  }

  if (readiness.aggregateStatus === "blocked_by_evidence") {
    return mapReadinessSourcePostureState(
      nonReadyReadinessItems,
      "missing_source",
    );
  }

  if (readiness.aggregateStatus === "needs_review") {
    return mapReadinessSourcePostureState(
      nonReadyReadinessItems,
      "limited_source",
    );
  }

  return "limited_source";
}

function mapAggregateFreshness(
  readiness: OperatorReadinessResult,
  nonReadyReadinessItems: OperatorAttentionItem[],
  status: CloseControlAcknowledgementStatus,
): CloseControlFreshnessState {
  if (status === "ready_for_acknowledgement") {
    return "fresh";
  }

  if (readiness.aggregateStatus !== "ready_for_review") {
    return mapReadinessFreshnessState(
      nonReadyReadinessItems,
      status === "blocked_by_evidence" ? "missing" : "mixed",
    );
  }

  return status === "blocked_by_evidence" ? "missing" : "mixed";
}

function mapAggregateProofState(
  readiness: OperatorReadinessResult,
  nonReadyReadinessItems: OperatorAttentionItem[],
  status: CloseControlAcknowledgementStatus,
): CloseControlProofPostureState {
  if (status === "ready_for_acknowledgement") {
    return "source_backed";
  }

  if (readiness.aggregateStatus !== "ready_for_review") {
    return mapReadinessProofState(
      nonReadyReadinessItems,
      status === "blocked_by_evidence"
        ? "limited_by_missing_source"
        : "limited_by_coverage_gap",
    );
  }

  return status === "blocked_by_evidence"
    ? "limited_by_missing_source"
    : "limited_by_coverage_gap";
}

function buildAggregateSourceSummary(
  checklist: CloseControlChecklistResult,
  readiness: OperatorReadinessResult,
  nonReadyReadinessItems: OperatorAttentionItem[],
) {
  const readinessSummary =
    nonReadyReadinessItems.length === 0
      ? `Operator-readiness aggregate context is ${readiness.aggregateStatus}.`
      : `Operator-readiness aggregate context is ${readiness.aggregateStatus}; non-ready readiness posture: ${nonReadyReadinessItems
          .map((item) => `${item.itemKey}=${item.status}`)
          .join(", ")}.`;

  return [checklist.evidenceSummary, readinessSummary].join(" ");
}

function buildAggregateFreshnessSummary(
  readiness: OperatorReadinessResult,
  nonReadyReadinessItems: OperatorAttentionItem[],
  status: CloseControlAcknowledgementStatus,
) {
  if (status === "ready_for_acknowledgement") {
    return "Checklist aggregate and operator-readiness context are ready for internal review acknowledgement.";
  }

  if (readiness.aggregateStatus !== "ready_for_review") {
    const readinessFreshness = nonReadyReadinessItems
      .map((item) => `${item.itemKey}: ${item.freshnessSummary.summary}`)
      .join(" ");
    return `Operator-readiness aggregate context is ${readiness.aggregateStatus}, so acknowledgement freshness is review-limited. ${readinessFreshness}`.trim();
  }

  return "Checklist aggregate posture needs review before internal acknowledgement readiness.";
}

function buildAggregateProofSummary(
  readiness: OperatorReadinessResult,
  nonReadyReadinessItems: OperatorAttentionItem[],
  status: CloseControlAcknowledgementStatus,
) {
  if (status === "ready_for_acknowledgement") {
    return "Aggregate acknowledgement readiness is backed by stored checklist and readiness posture.";
  }

  if (readiness.aggregateStatus !== "ready_for_review") {
    const readinessProof = nonReadyReadinessItems
      .map((item) => `${item.itemKey}: ${item.proofPosture.summary}`)
      .join(" ");
    return `Aggregate acknowledgement readiness is limited by operator-readiness ${readiness.aggregateStatus} posture. ${readinessProof}`.trim();
  }

  return "Aggregate acknowledgement readiness is limited by checklist posture that needs review.";
}

function mapItemSourcePosture(
  item: CloseControlChecklistItem,
  readinessItem: OperatorAttentionItem | null,
  status: CloseControlAcknowledgementStatus,
) {
  if (item.status !== "ready_for_review" || !readinessItem) {
    return {
      state: item.sourcePosture.state,
      summary: item.sourcePosture.summary,
    };
  }

  if (status === "ready_for_acknowledgement") {
    return {
      state: item.sourcePosture.state,
      summary: item.sourcePosture.summary,
    };
  }

  return {
    state: mapReadinessSourcePostureState(
      [readinessItem],
      status === "blocked_by_evidence" ? "missing_source" : "limited_source",
    ),
    summary: readinessItem.sourcePosture.summary,
  };
}

function mapItemFreshnessSummary(
  item: CloseControlChecklistItem,
  readinessItem: OperatorAttentionItem | null,
  status: CloseControlAcknowledgementStatus,
) {
  if (
    item.status !== "ready_for_review" ||
    !readinessItem ||
    status === "ready_for_acknowledgement"
  ) {
    return item.freshnessSummary;
  }

  return {
    ...readinessItem.freshnessSummary,
    state: mapReadinessFreshnessState(
      [readinessItem],
      status === "blocked_by_evidence" ? "missing" : "mixed",
    ),
    summary: `${readinessItem.freshnessSummary.summary} Related operator-readiness context is ${readinessItem.status}.`,
  };
}

function mapItemProofPosture(
  item: CloseControlChecklistItem,
  readinessItem: OperatorAttentionItem | null,
  status: CloseControlAcknowledgementStatus,
) {
  if (
    item.status !== "ready_for_review" ||
    !readinessItem ||
    status === "ready_for_acknowledgement"
  ) {
    return item.proofPosture;
  }

  return {
    state: mapReadinessProofState(
      [readinessItem],
      status === "blocked_by_evidence"
        ? "limited_by_missing_source"
        : "limited_by_coverage_gap",
    ),
    summary: `Related operator-readiness proof posture is ${readinessItem.proofPosture.state}: ${readinessItem.proofPosture.summary}`,
  };
}

function mapReadinessSourcePostureState(
  items: OperatorAttentionItem[],
  fallback: CloseControlAcknowledgementSourcePostureState,
): CloseControlAcknowledgementSourcePostureState {
  const states = new Set(items.map((item) => item.sourcePosture.state));
  return (
    (
      [
        "missing_source",
        "monitor_context_missing",
        "failed_source",
        "stale_source",
        "limited_source",
      ] as const
    ).find((state) => states.has(state)) ?? fallback
  );
}

function mapReadinessFreshnessState(
  items: OperatorAttentionItem[],
  fallback: CloseControlFreshnessState,
): CloseControlFreshnessState {
  const states = new Set(items.map((item) => item.freshnessSummary.state));
  return (
    (
      [
        "missing",
        "failed",
        "stale",
        "mixed",
        "not_applicable",
        ...(fallback === "fresh" ? (["fresh"] as const) : []),
      ] as const
    ).find((state) => states.has(state)) ?? fallback
  );
}

function mapReadinessProofState(
  items: OperatorAttentionItem[],
  fallback: CloseControlProofPostureState,
): CloseControlProofPostureState {
  const states = new Set(items.map((item) => item.proofPosture.state));
  return (
    (
      [
        "limited_by_missing_source",
        "limited_by_failed_source",
        "limited_by_stale_source",
        "limited_by_data_quality_gap",
        "limited_by_coverage_gap",
        "limited_by_missing_monitor_context",
        "limited_by_alerting_monitor",
        "review_only_context",
        "source_backed",
      ] as const
    ).find((state) => states.has(state)) ?? fallback
  );
}

function isMissingAcknowledgementSource(
  state: CloseControlAcknowledgementSourcePostureState,
) {
  return state === "missing_source" || state === "monitor_context_missing";
}

function buildReadinessStatusLimitations(readiness: OperatorReadinessResult) {
  if (readiness.aggregateStatus === "blocked_by_evidence") {
    return [
      "Operator-readiness aggregate posture is blocked_by_evidence and blocks acknowledgement readiness.",
    ];
  }

  if (readiness.aggregateStatus === "needs_review") {
    return [
      "Operator-readiness aggregate posture is needs_review and limits acknowledgement readiness until reviewed.",
    ];
  }

  return [];
}

function buildRelatedReadinessLimitations(
  readinessItem: OperatorAttentionItem | null,
) {
  if (!readinessItem || readinessItem.status === "ready_for_review") {
    return [];
  }

  return [
    `Related operator-readiness item ${readinessItem.itemKey} is ${readinessItem.status} and limits this item-family acknowledgement target.`,
  ];
}

function buildReadinessContext(readiness: OperatorReadinessResult) {
  const nonReadyItems = readiness.attentionItems.filter(
    (item) => item.status !== "ready_for_review",
  );

  return {
    operatorReadinessAggregateStatus: readiness.aggregateStatus,
    nonReadyReadinessItemKeys: nonReadyItems.map((item) => item.itemKey),
    summary:
      nonReadyItems.length === 0
        ? "Operator readiness context is ready for review."
        : `Operator readiness context has ${nonReadyItems.length} item(s) that need review before internal acknowledgement readiness.`,
    limitations: dedupe([
      ...readiness.limitations,
      ...nonReadyItems.flatMap((item) => item.limitations),
    ]),
  };
}

function findRelatedReadinessItem(
  readiness: OperatorReadinessResult,
  item: CloseControlChecklistItem,
) {
  return (
    readiness.attentionItems.find(
      (candidate) => candidate.relatedChecklistItemFamily === item.family,
    ) ?? null
  );
}

function buildRuntimeActionBoundary() {
  return {
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
    summary:
      "F6K acknowledgement readiness generation is deterministic, read-only, and records all runtime/action absence flags as false.",
    replayImplication:
      "The first F6K acknowledgement-readiness result is derived from current stored posture and is not persisted as a mission replay event.",
  };
}

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}
