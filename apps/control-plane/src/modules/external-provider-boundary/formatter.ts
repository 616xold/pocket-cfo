import {
  ExternalProviderBoundaryResultSchema,
  deriveExternalProviderBoundaryAggregateStatus,
  type CloseControlReviewSummaryResult,
  type DeliveryReadinessResult,
  type ExternalProviderBoundaryResult,
} from "@pocket-cto/domain";
import { buildDeliveryReadinessBoundaryTarget } from "./delivery-targets";
import { buildProofAndLimitationBoundaryTarget } from "./proof-target";
import { buildReviewSummaryBoundaryTarget } from "./review-summary-targets";
import { buildSourceFreshnessBoundaryTarget } from "./source-freshness-target";
import {
  buildHumanReviewGateBoundaryTarget,
  buildOutboxAbsenceBoundaryTarget,
} from "./static-boundary-targets";
import { buildRuntimeActionBoundary, dedupe } from "./helpers";

type BuildExternalProviderBoundaryInput = {
  companyKey: string;
  deliveryReadiness: DeliveryReadinessResult;
  generatedAt: string;
  reviewSummary: CloseControlReviewSummaryResult;
};

export function buildExternalProviderBoundaryResult(
  input: BuildExternalProviderBoundaryInput,
): ExternalProviderBoundaryResult {
  const targets = [
    buildDeliveryReadinessBoundaryTarget(input.deliveryReadiness),
    buildReviewSummaryBoundaryTarget(input.reviewSummary),
    buildSourceFreshnessBoundaryTarget(input),
    buildProofAndLimitationBoundaryTarget(input),
    buildHumanReviewGateBoundaryTarget(input),
    buildOutboxAbsenceBoundaryTarget(input),
  ];

  return ExternalProviderBoundaryResultSchema.parse({
    companyKey: input.companyKey,
    generatedAt: input.generatedAt,
    aggregateStatus: deriveExternalProviderBoundaryAggregateStatus(targets),
    externalProviderBoundaryTargets: targets,
    evidenceSummary:
      "F6P external provider boundary readiness is derived from shipped F6M delivery-readiness and F6N close/control review-summary posture only.",
    limitations: dedupe([
      "F6P is an internal provider-boundary readiness read model only; no provider call occurred and no send occurred.",
      "F6P does not create provider credentials, provider jobs, delivery records, outbox send events, reports, approvals, missions, monitor runs, monitor results, source mutations, runtime-Codex work, generated prose, finance writes, advice, instructions, or autonomous actions.",
      "Report artifacts, generic chat, runtime-Codex output, mission-generated prose, provider state, provider credentials, and external communication state are not primary inputs.",
      ...input.deliveryReadiness.limitations,
      ...input.reviewSummary.limitations,
      ...targets.flatMap((target) => target.limitations),
    ]),
    runtimeActionBoundary: buildRuntimeActionBoundary(),
  });
}
