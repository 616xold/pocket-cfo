import {
  CloseControlCertificationSafetyResultSchema,
  deriveCloseControlCertificationSafetyAggregateStatus,
  type CloseControlCertificationBoundaryResult,
  type CloseControlCertificationSafetyResult,
  type CloseControlReviewSummaryResult,
  type ExternalDeliveryHumanConfirmationBoundaryResult,
} from "@pocket-cto/domain";
import { buildCertificationBoundarySafetyTarget } from "./certification-boundary-targets";
import { buildHumanConfirmationBoundarySafetyTarget } from "./human-confirmation-targets";
import { buildProofAndLimitationSafetyTarget } from "./proof-target";
import { buildReviewSummarySafetyTarget } from "./review-summary-targets";
import { buildSourceLineageSafetyTarget } from "./source-lineage-target";
import {
  buildCertificationAbsenceSafetyTarget,
  buildHumanReviewNextStepSafetyTarget,
} from "./static-boundary-targets";
import { dedupe } from "./helpers";
import { buildRuntimeActionBoundary } from "./runtime-action-boundary";

type BuildCloseControlCertificationSafetyInput = {
  certificationBoundary: CloseControlCertificationBoundaryResult;
  companyKey: string;
  generatedAt: string;
  humanConfirmation: ExternalDeliveryHumanConfirmationBoundaryResult;
  reviewSummary: CloseControlReviewSummaryResult;
};

export function buildCloseControlCertificationSafetyResult(
  input: BuildCloseControlCertificationSafetyInput,
): CloseControlCertificationSafetyResult {
  const targets = [
    buildCertificationBoundarySafetyTarget(input.certificationBoundary),
    buildHumanConfirmationBoundarySafetyTarget(input.humanConfirmation),
    buildReviewSummarySafetyTarget(input.reviewSummary),
    buildSourceLineageSafetyTarget(input),
    buildProofAndLimitationSafetyTarget(input),
    buildHumanReviewNextStepSafetyTarget(input),
    buildCertificationAbsenceSafetyTarget(input),
  ];

  return CloseControlCertificationSafetyResultSchema.parse({
    companyKey: input.companyKey,
    generatedAt: input.generatedAt,
    aggregateStatus:
      deriveCloseControlCertificationSafetyAggregateStatus(targets),
    closeControlCertificationSafetyTargets: targets,
    evidenceSummary:
      "F6T close/control certification-safety readiness is derived from shipped F6Q certification-boundary, F6S human-confirmation, and F6N review-summary posture only.",
    limitations: dedupe([
      "F6T is an internal certification-safety/readiness read model only; no certification occurred, no close complete occurred, no sign-off occurred, no attestation occurred, no assurance occurred, and no legal or audit opinion occurred.",
      "F6T does not create certification records, certified status, close-complete records, sign-off records, attestation records, assurance records, legal opinions, audit opinions, approvals, reports, report releases, report circulation, delivery, provider calls, provider credentials, provider jobs, outbox sends, missions, monitor runs, monitor results, source mutations, runtime-Codex work, generated prose, finance writes, advice, instructions, or autonomous actions.",
      "Report artifacts, generic chat, runtime-Codex output, mission-generated prose, approval records, release/circulation records, provider state, provider credentials, provider jobs, outbox jobs, generated notification prose, and external communication state are not primary inputs.",
      ...input.certificationBoundary.limitations,
      ...input.humanConfirmation.limitations,
      ...input.reviewSummary.limitations,
      ...targets.flatMap((target) => target.limitations),
    ]),
    runtimeActionBoundary: buildRuntimeActionBoundary(),
  });
}
