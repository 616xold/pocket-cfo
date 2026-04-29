import {
  CloseControlCertificationBoundaryResultSchema,
  deriveCloseControlCertificationBoundaryAggregateStatus,
  type CloseControlReviewSummaryResult,
  type ExternalProviderBoundaryResult,
} from "@pocket-cto/domain";
import { buildEvidenceAndSourceBoundaryTarget } from "./evidence-source-target";
import { buildProofAndLimitationBoundaryTarget } from "./proof-target";
import { buildProviderBoundaryTarget } from "./provider-boundary-targets";
import { buildReviewSummaryBoundaryTarget } from "./review-summary-targets";
import {
  buildCertificationAbsenceBoundaryTarget,
  buildHumanReviewGateBoundaryTarget,
} from "./static-boundary-targets";
import { buildRuntimeActionBoundary, dedupe } from "./helpers";

type BuildCloseControlCertificationBoundaryInput = {
  companyKey: string;
  generatedAt: string;
  providerBoundary: ExternalProviderBoundaryResult;
  reviewSummary: CloseControlReviewSummaryResult;
};

export function buildCloseControlCertificationBoundaryResult(
  input: BuildCloseControlCertificationBoundaryInput,
) {
  const targets = [
    buildReviewSummaryBoundaryTarget(input.reviewSummary),
    buildProviderBoundaryTarget(input.providerBoundary),
    buildEvidenceAndSourceBoundaryTarget(input),
    buildProofAndLimitationBoundaryTarget(input),
    buildHumanReviewGateBoundaryTarget(input),
    buildCertificationAbsenceBoundaryTarget(input),
  ];

  return CloseControlCertificationBoundaryResultSchema.parse({
    companyKey: input.companyKey,
    generatedAt: input.generatedAt,
    aggregateStatus:
      deriveCloseControlCertificationBoundaryAggregateStatus(targets),
    closeControlCertificationBoundaryTargets: targets,
    evidenceSummary:
      "F6Q close/control certification-boundary readiness is derived from shipped F6N review-summary and F6P provider-boundary posture only.",
    limitations: dedupe([
      "F6Q is an internal certification-boundary readiness read model only; no certification occurred and no close complete occurred.",
      "F6Q does not create certification records, close-complete records, sign-off records, attestation records, legal opinions, audit opinions, assurance, approvals, reports, report releases, report circulation, delivery, provider calls, provider credentials, provider jobs, outbox sends, missions, monitor runs, monitor results, source mutations, runtime-Codex work, generated prose, finance writes, advice, instructions, or autonomous actions.",
      "Report artifacts, generic chat, runtime-Codex output, mission-generated prose, approval records, release/circulation records, provider state, provider credentials, outbox jobs, and external communication state are not primary inputs.",
      ...input.reviewSummary.limitations,
      ...input.providerBoundary.limitations,
      ...targets.flatMap((target) => target.limitations),
    ]),
    runtimeActionBoundary: buildRuntimeActionBoundary(),
  });
}
