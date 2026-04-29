import {
  CloseControlReviewSummaryResultSchema,
  deriveCloseControlReviewAggregateStatus,
  type CloseControlAcknowledgementReadinessResult,
  type CloseControlChecklistResult,
  type CloseControlReviewSummaryResult,
  type DeliveryReadinessResult,
  type OperatorReadinessResult,
} from "@pocket-cto/domain";
import { buildChecklistPostureSection } from "./checklist-sections";
import {
  buildMonitorContextPostureSection,
  buildSourceAndWikiFreshnessPostureSection,
} from "./derived-sections";
import { buildRuntimeActionBoundary, dedupe } from "./helpers";
import {
  buildAcknowledgementReadinessPostureSection,
  buildDeliveryBoundaryPostureSection,
  buildOperatorReadinessPostureSection,
} from "./readiness-sections";

type BuildCloseControlReviewSummaryInput = {
  acknowledgementReadiness: CloseControlAcknowledgementReadinessResult;
  checklist: CloseControlChecklistResult;
  companyKey: string;
  deliveryReadiness: DeliveryReadinessResult;
  generatedAt: string;
  operatorReadiness: OperatorReadinessResult;
};

export function buildCloseControlReviewSummaryResult(
  input: BuildCloseControlReviewSummaryInput,
): CloseControlReviewSummaryResult {
  const reviewSections = [
    buildChecklistPostureSection(input.checklist),
    buildOperatorReadinessPostureSection(input.operatorReadiness),
    buildAcknowledgementReadinessPostureSection(input.acknowledgementReadiness),
    buildDeliveryBoundaryPostureSection(input.deliveryReadiness),
    buildMonitorContextPostureSection(input),
    buildSourceAndWikiFreshnessPostureSection(input),
  ];

  return CloseControlReviewSummaryResultSchema.parse({
    companyKey: input.companyKey,
    generatedAt: input.generatedAt,
    aggregateStatus: deriveCloseControlReviewAggregateStatus(reviewSections),
    reviewSections,
    evidenceSummary:
      "F6N close/control review summary is derived from shipped F6H checklist, F6J operator-readiness, F6K acknowledgement-readiness, and F6M delivery-boundary posture only.",
    limitations: dedupe([
      "The review summary is read-only internal human-review posture and is not certification, close completion, sign-off, attestation, report release, report circulation, external delivery, or an approval.",
      "F6N does not create reports, approvals, missions, monitor results, delivery records, outbox send events, source mutations, runtime-Codex work, generated prose, finance writes, advice, instructions, or autonomous actions.",
      "Report artifacts, generic chat, runtime-Codex output, mission-generated prose, and external communication state are not primary inputs.",
      ...input.checklist.limitations,
      ...input.operatorReadiness.limitations,
      ...input.acknowledgementReadiness.limitations,
      ...input.deliveryReadiness.limitations,
      ...reviewSections.flatMap((section) => section.limitations),
    ]),
    runtimeActionBoundary: buildRuntimeActionBoundary(),
  });
}
