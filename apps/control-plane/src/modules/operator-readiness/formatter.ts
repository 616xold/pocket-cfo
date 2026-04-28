import {
  OperatorReadinessResultSchema,
  deriveOperatorReadinessAggregateStatus,
  type CloseControlChecklistResult,
  type MonitorLatestResult,
} from "@pocket-cto/domain";
import { buildCloseControlAttentionItems } from "./checklist-items";
import { buildRuntimeActionBoundary } from "./evidence";
import { buildMonitorAttentionItem, MONITOR_KINDS } from "./monitor-items";

export function buildOperatorReadinessResult(input: {
  checklist: CloseControlChecklistResult;
  companyKey: string;
  generatedAt: string;
  latestMonitorResults: MonitorLatestResult[];
}) {
  const monitorItems = MONITOR_KINDS.map((monitorKind) =>
    buildMonitorAttentionItem(
      input.latestMonitorResults.find(
        (latest) => latest.monitorKind === monitorKind,
      ) ?? {
        alertCard: null,
        companyKey: input.companyKey,
        monitorKind,
        monitorResult: null,
      },
    ),
  );
  const closeControlItems = buildCloseControlAttentionItems(input.checklist);
  const attentionItems = [...monitorItems, ...closeControlItems];

  return OperatorReadinessResultSchema.parse({
    companyKey: input.companyKey,
    generatedAt: input.generatedAt,
    aggregateStatus: deriveOperatorReadinessAggregateStatus(attentionItems),
    attentionItems,
    evidenceSummary:
      "F6J operator readiness is derived from latest persisted monitor results for the four shipped monitor families and the deterministic close/control checklist posture only.",
    limitations: [
      "Operator readiness is an internal review read model and does not create external communication, delivery, reports, approvals, missions, monitor runs, monitor results, or runtime-Codex work.",
      "Report artifacts, mission-generated prose, generic chat, runtime-Codex output, and external delivery state are not primary inputs.",
      "Demo replay proof is verified by packaged smokes and checked-in expected output; readiness generation does not run demo replay.",
    ],
    runtimeActionBoundary: buildRuntimeActionBoundary(),
  });
}
