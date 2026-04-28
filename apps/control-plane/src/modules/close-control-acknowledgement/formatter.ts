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
  const acknowledgementTargets = [
    buildAggregateTarget(input.checklist, input.readiness),
    ...input.checklist.items.map((item) =>
      buildItemTarget(item, findRelatedReadinessItem(input.readiness, item)),
    ),
  ];

  return CloseControlAcknowledgementReadinessResultSchema.parse({
    companyKey: input.companyKey,
    generatedAt: input.generatedAt,
    aggregateStatus:
      deriveCloseControlAcknowledgementAggregateStatus(acknowledgementTargets),
    acknowledgementTargets,
    evidenceSummary:
      "F6K acknowledgement readiness is derived from the deterministic close/control checklist result and internal operator-readiness result only.",
    limitations: dedupe([
      "Acknowledgement readiness is an internal review read model and does not create an acknowledgement record.",
      "Acknowledgement readiness is not a finance authorization, no close-complete status is emitted, and no report-release or external-delivery posture is created.",
      "F6K does not rerun monitors, create monitor results, create missions, create reports, create approvals, invoke runtime-Codex, or create finance actions.",
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
      state: mapAggregateSourcePostureState(checklist, status),
      summary: buildAggregateSourceSummary(checklist, readiness),
      missingSource: status === "blocked_by_evidence",
    },
    freshnessSummary: {
      state: mapAcknowledgementFreshness(status),
      summary:
        status === "ready_for_acknowledgement"
          ? "Checklist aggregate and operator-readiness context are ready for internal review acknowledgement."
          : "Checklist aggregate or operator-readiness context needs review before internal acknowledgement readiness.",
      latestObservedAt: checklist.generatedAt,
    },
    limitations: dedupe([
      ...checklist.limitations,
      ...readinessLimitations,
      "Aggregate acknowledgement readiness remains internal review posture only.",
    ]),
    proofPosture: {
      state: mapAcknowledgementProofState(status),
      summary:
        status === "ready_for_acknowledgement"
          ? "Aggregate acknowledgement readiness is backed by stored checklist and readiness posture."
          : "Aggregate acknowledgement readiness is limited by checklist or operator-readiness posture that needs review.",
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
  const status = mapChecklistStatus(item.status);

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
      state: item.sourcePosture.state,
      summary: readinessItem
        ? `${item.sourcePosture.summary} Operator-readiness context: ${readinessItem.sourcePosture.summary}`
        : item.sourcePosture.summary,
      missingSource:
        item.sourcePosture.state === "missing_source" ||
        item.sourcePosture.state === "monitor_context_missing",
    },
    freshnessSummary: item.freshnessSummary,
    limitations: dedupe([
      ...item.limitations,
      ...(readinessItem?.limitations ?? []),
      "Checklist item-family acknowledgement readiness is internal review posture only and creates no record or action.",
    ]),
    proofPosture: item.proofPosture,
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

function mapAggregateSourcePostureState(
  checklist: CloseControlChecklistResult,
  status: CloseControlAcknowledgementStatus,
): CloseControlAcknowledgementSourcePostureState {
  if (status === "ready_for_acknowledgement") {
    return "source_backed";
  }

  if (checklist.aggregateStatus === "blocked_by_evidence") {
    return "missing_source";
  }

  return "limited_source";
}

function mapAcknowledgementFreshness(
  status: CloseControlAcknowledgementStatus,
): CloseControlFreshnessState {
  if (status === "ready_for_acknowledgement") {
    return "fresh";
  }

  if (status === "blocked_by_evidence") {
    return "missing";
  }

  return "mixed";
}

function mapAcknowledgementProofState(
  status: CloseControlAcknowledgementStatus,
): CloseControlProofPostureState {
  if (status === "ready_for_acknowledgement") {
    return "source_backed";
  }

  if (status === "blocked_by_evidence") {
    return "limited_by_missing_source";
  }

  return "limited_by_coverage_gap";
}

function buildAggregateSourceSummary(
  checklist: CloseControlChecklistResult,
  readiness: OperatorReadinessResult,
) {
  return [
    checklist.evidenceSummary,
    `Operator-readiness aggregate context is ${readiness.aggregateStatus}.`,
  ].join(" ");
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
      "F6K acknowledgement readiness generation is deterministic, read-only, runtime-free, delivery-free, outbox-free, report-free, approval-free, mission-free, monitor-run-free, monitor-result-free, and action-free.",
    replayImplication:
      "The first F6K acknowledgement-readiness result is derived from current stored posture and is not persisted as a mission replay event.",
  };
}

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}
