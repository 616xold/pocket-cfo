import {
  ExternalDeliveryHumanConfirmationBoundaryResultSchema,
  deriveExternalDeliveryHumanConfirmationAggregateStatus,
  type CloseControlCertificationBoundaryResult,
  type CloseControlReviewSummaryResult,
  type DeliveryReadinessResult,
  type ExternalDeliveryHumanConfirmationBoundaryResult,
  type ExternalProviderBoundaryResult,
} from "@pocket-cto/domain";
import { buildCertificationBoundaryConfirmationTarget } from "./certification-targets";
import { buildDeliveryReadinessConfirmationTarget } from "./delivery-targets";
import { buildProviderBoundaryConfirmationTarget } from "./provider-targets";
import { buildReviewSummaryConfirmationTarget } from "./review-summary-targets";
import { buildSourceProofConfirmationTarget } from "./source-proof-target";
import { buildHumanConfirmationAbsenceTarget } from "./static-boundary-targets";
import { buildRuntimeActionBoundary, dedupe } from "./helpers";

type BuildExternalDeliveryHumanConfirmationBoundaryInput = {
  certificationBoundary: CloseControlCertificationBoundaryResult;
  companyKey: string;
  deliveryReadiness: DeliveryReadinessResult;
  generatedAt: string;
  providerBoundary: ExternalProviderBoundaryResult;
  reviewSummary: CloseControlReviewSummaryResult;
};

export function buildExternalDeliveryHumanConfirmationBoundaryResult(
  input: BuildExternalDeliveryHumanConfirmationBoundaryInput,
): ExternalDeliveryHumanConfirmationBoundaryResult {
  const targets = [
    buildDeliveryReadinessConfirmationTarget(input.deliveryReadiness),
    buildProviderBoundaryConfirmationTarget(input.providerBoundary),
    buildCertificationBoundaryConfirmationTarget(input.certificationBoundary),
    buildReviewSummaryConfirmationTarget(input.reviewSummary),
    buildSourceProofConfirmationTarget(input),
    buildHumanConfirmationAbsenceTarget(input),
  ];

  return ExternalDeliveryHumanConfirmationBoundaryResultSchema.parse({
    companyKey: input.companyKey,
    generatedAt: input.generatedAt,
    aggregateStatus:
      deriveExternalDeliveryHumanConfirmationAggregateStatus(targets),
    deliveryGateTargets: targets,
    evidenceSummary:
      "F6S external-delivery human-confirmation boundary is derived from shipped F6M delivery-readiness, F6P provider-boundary, F6Q certification-boundary, and F6N review-summary posture only.",
    limitations: dedupe([
      "F6S is an internal delivery-preflight boundary only; no send occurred, no provider call occurred, and no outbox send occurred.",
      "F6S does not create provider credentials, provider jobs, delivery records, outbox send events, scheduled delivery, auto-send, reports, report releases, report circulation, approvals, certification records, close-complete records, sign-off records, attestations, legal opinions, audit opinions, assurance, missions, monitor runs, monitor results, source mutations, runtime-Codex work, generated prose, finance writes, advice, instructions, or autonomous actions.",
      "Report artifacts, generic chat, runtime-Codex output, mission-generated prose, approval records, release/circulation records, provider state, provider credentials, provider jobs, outbox jobs, generated notification prose, and external communication state are not primary inputs.",
      ...input.deliveryReadiness.limitations,
      ...input.providerBoundary.limitations,
      ...input.certificationBoundary.limitations,
      ...input.reviewSummary.limitations,
      ...targets.flatMap((target) => target.limitations),
    ]),
    runtimeActionBoundary: buildRuntimeActionBoundary(),
  });
}
