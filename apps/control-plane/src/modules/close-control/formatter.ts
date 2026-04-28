import {
  CloseControlChecklistResultSchema,
  deriveCloseControlAggregateStatus,
  type CloseControlChecklistResult,
} from "@pocket-cto/domain";
import {
  buildCashItem,
  buildCollectionsItem,
  buildPayablesItem,
} from "./finance-items";
import { buildMonitorReplayItem } from "./monitor-replay-item";
import { buildPolicyItem } from "./policy-item";
import { buildSourceCoverageItem } from "./source-coverage-item";
import type { BuildCloseControlChecklistInput } from "./types";
import { buildRuntimeBoundary } from "./utils";

export function buildCloseControlChecklistResult(
  input: BuildCloseControlChecklistInput,
): CloseControlChecklistResult {
  const cash = buildCashItem(input.cashPosture);
  const collections = buildCollectionsItem(input.collectionsPosture);
  const payables = buildPayablesItem(input.payablesPosture);
  const policy = buildPolicyItem(input.policyPosture);
  const sourceCoverage = buildSourceCoverageItem([
    cash,
    collections,
    payables,
    policy,
  ]);
  const monitorReplay = buildMonitorReplayItem(input.latestMonitorResults);
  const items = [
    sourceCoverage,
    cash,
    collections,
    payables,
    policy,
    monitorReplay,
  ];

  return CloseControlChecklistResultSchema.parse({
    companyKey: input.companyKey,
    generatedAt: input.generatedAt,
    aggregateStatus: deriveCloseControlAggregateStatus(items),
    items,
    evidenceSummary:
      "F6H checklist is derived from stored Finance Twin source posture, stored CFO Wiki policy/source posture, and latest persisted monitor results as context only.",
    limitations: [
      "The checklist is read-only review posture and does not assert close completion.",
      "Checklist generation does not rerun monitors, create monitor results, create missions, create reports, create approvals, invoke runtime-Codex, or create external actions.",
      "Latest monitor results are context only; alerts are not treated as close/control approvals.",
    ],
    runtimeActionBoundary: buildRuntimeBoundary(),
  });
}
