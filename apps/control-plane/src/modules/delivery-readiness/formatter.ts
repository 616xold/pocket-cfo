import {
  DeliveryReadinessResultSchema,
  deriveDeliveryReadinessAggregateStatus,
  type CloseControlAcknowledgementReadinessResult,
  type DeliveryReadinessResult,
  type OperatorReadinessResult,
} from "@pocket-cto/domain";
import {
  buildAcknowledgementAggregateTarget,
  buildAcknowledgementTarget,
} from "./acknowledgement-targets";
import { buildRuntimeActionBoundary, dedupe } from "./helpers";
import {
  buildOperatorAggregateTarget,
  buildOperatorItemTarget,
} from "./operator-targets";

type BuildDeliveryReadinessInput = {
  acknowledgementReadiness: CloseControlAcknowledgementReadinessResult;
  companyKey: string;
  generatedAt: string;
  operatorReadiness: OperatorReadinessResult;
};

export function buildDeliveryReadinessResult(
  input: BuildDeliveryReadinessInput,
): DeliveryReadinessResult {
  const nonReadyOperatorItems = input.operatorReadiness.attentionItems.filter(
    (item) => item.status !== "ready_for_review",
  );
  const nonReadyAcknowledgementTargets =
    input.acknowledgementReadiness.acknowledgementTargets.filter(
      (target) => target.status !== "ready_for_acknowledgement",
    );
  const deliveryReadinessTargets = [
    buildOperatorAggregateTarget(input.operatorReadiness),
    buildAcknowledgementAggregateTarget(input.acknowledgementReadiness),
    ...nonReadyOperatorItems.map(buildOperatorItemTarget),
    ...nonReadyAcknowledgementTargets.map(buildAcknowledgementTarget),
  ];

  return DeliveryReadinessResultSchema.parse({
    companyKey: input.companyKey,
    generatedAt: input.generatedAt,
    aggregateStatus: deriveDeliveryReadinessAggregateStatus(
      deliveryReadinessTargets,
    ),
    deliveryReadinessTargets,
    evidenceSummary:
      "F6M delivery readiness is derived from F6J operator-readiness posture and F6K close/control acknowledgement-readiness posture only.",
    limitations: dedupe([
      "Delivery readiness is an internal review-before-delivery read model and no send occurred.",
      "F6M reads existing readiness posture only; it does not call providers, create outbox send events, create reports, create approvals, create missions, rerun monitors, mutate sources, invoke runtime-Codex, or generate notification prose.",
      "Report artifacts, mission-generated prose, generic chat, runtime-Codex output, and external communication state are not primary inputs.",
      ...input.operatorReadiness.limitations,
      ...input.acknowledgementReadiness.limitations,
      ...nonReadyOperatorItems.flatMap((item) => item.limitations),
      ...nonReadyAcknowledgementTargets.flatMap((target) => target.limitations),
    ]),
    runtimeActionBoundary: buildRuntimeActionBoundary(),
  });
}
