import type {
  ArtifactRecord,
  EvidenceAppendixArtifactMetadata,
  FinanceMemoArtifactMetadata,
  ProofBundleManifest,
  ReportingMissionView,
} from "@pocket-cto/domain";
import {
  EvidenceAppendixArtifactMetadataSchema,
  FinanceMemoArtifactMetadataSchema,
  ReportingMissionViewSchema,
} from "@pocket-cto/domain";
import type { EvidenceArtifactDraft } from "../evidence/service";
import { buildReportingPublicationViewFromProofBundle } from "./publication";

export function buildFinanceMemoArtifact(input: {
  memo: FinanceMemoArtifactMetadata;
  missionId: string;
  taskId: string;
}): EvidenceArtifactDraft {
  return {
    missionId: input.missionId,
    taskId: input.taskId,
    kind: "finance_memo",
    uri: `pocket-cto://missions/${input.missionId}/tasks/${input.taskId}/finance-memo`,
    mimeType: "text/markdown",
    sha256: null,
    metadata: input.memo,
  };
}

export function buildEvidenceAppendixArtifact(input: {
  evidenceAppendix: EvidenceAppendixArtifactMetadata;
  missionId: string;
  taskId: string;
}): EvidenceArtifactDraft {
  return {
    missionId: input.missionId,
    taskId: input.taskId,
    kind: "evidence_appendix",
    uri: `pocket-cto://missions/${input.missionId}/tasks/${input.taskId}/evidence-appendix`,
    mimeType: "text/markdown",
    sha256: null,
    metadata: input.evidenceAppendix,
  };
}

export function readFinanceMemoArtifactMetadata(
  artifact: Pick<ArtifactRecord, "kind" | "metadata"> | null | undefined,
) {
  if (!artifact || artifact.kind !== "finance_memo") {
    return null;
  }

  const parsed = FinanceMemoArtifactMetadataSchema.safeParse(artifact.metadata);
  return parsed.success ? parsed.data : null;
}

export function readEvidenceAppendixArtifactMetadata(
  artifact: Pick<ArtifactRecord, "kind" | "metadata"> | null | undefined,
) {
  if (!artifact || artifact.kind !== "evidence_appendix") {
    return null;
  }

  const parsed = EvidenceAppendixArtifactMetadataSchema.safeParse(
    artifact.metadata,
  );
  return parsed.success ? parsed.data : null;
}

export function readMissionReportingView(input: {
  artifacts: ArtifactRecord[];
  proofBundle: ProofBundleManifest;
}): ReportingMissionView | null {
  const financeMemo = readFinanceMemoArtifactMetadata(
    readLatestArtifactByKind(input.artifacts, "finance_memo"),
  );
  const evidenceAppendix = readEvidenceAppendixArtifactMetadata(
    readLatestArtifactByKind(input.artifacts, "evidence_appendix"),
  );
  const reportKind =
    financeMemo?.reportKind ??
    evidenceAppendix?.reportKind ??
    input.proofBundle.reportKind;
  const sourceDiscoveryMissionId =
    financeMemo?.sourceDiscoveryMissionId ??
    evidenceAppendix?.sourceDiscoveryMissionId ??
    input.proofBundle.sourceDiscoveryMissionId;

  if (!reportKind || !sourceDiscoveryMissionId) {
    return null;
  }

  return ReportingMissionViewSchema.parse({
    reportKind,
    draftStatus:
      financeMemo?.draftStatus ??
      evidenceAppendix?.draftStatus ??
      input.proofBundle.reportDraftStatus ??
      "draft_only",
    sourceDiscoveryMissionId,
    companyKey:
      financeMemo?.companyKey ??
      evidenceAppendix?.companyKey ??
      input.proofBundle.companyKey,
    questionKind:
      financeMemo?.questionKind ??
      evidenceAppendix?.questionKind ??
      input.proofBundle.questionKind,
    policySourceId:
      financeMemo?.policySourceId ??
      evidenceAppendix?.policySourceId ??
      input.proofBundle.policySourceId,
    policySourceScope:
      financeMemo?.policySourceScope ??
      evidenceAppendix?.policySourceScope ??
      input.proofBundle.policySourceScope,
    reportSummary:
      financeMemo?.memoSummary ?? input.proofBundle.reportSummary ?? null,
    freshnessSummary:
      financeMemo?.freshnessSummary ??
      evidenceAppendix?.freshnessSummary ??
      input.proofBundle.freshnessSummary ??
      null,
    limitationsSummary:
      financeMemo?.limitationsSummary ??
      evidenceAppendix?.limitationsSummary ??
      input.proofBundle.limitationsSummary ??
      null,
    relatedRoutePaths:
      financeMemo?.relatedRoutePaths ??
      evidenceAppendix?.relatedRoutePaths ??
      input.proofBundle.relatedRoutePaths,
    relatedWikiPageKeys:
      financeMemo?.relatedWikiPageKeys ??
      evidenceAppendix?.relatedWikiPageKeys ??
      input.proofBundle.relatedWikiPageKeys,
    appendixPresent:
      evidenceAppendix !== null || input.proofBundle.appendixPresent,
    financeMemo,
    evidenceAppendix,
    publication:
      buildReportingPublicationViewFromProofBundle({
        evidenceCompleteness: input.proofBundle.evidenceCompleteness,
        reportKind: input.proofBundle.reportKind,
        reportPublication: input.proofBundle.reportPublication,
      }) ?? null,
  });
}

function readLatestArtifactByKind(
  artifacts: ArtifactRecord[],
  kind: ArtifactRecord["kind"],
) {
  return (
    [...artifacts]
      .filter((artifact) => artifact.kind === kind)
      .sort(
        (left, right) =>
          right.createdAt.localeCompare(left.createdAt) ||
          right.id.localeCompare(left.id),
      )[0] ?? null
  );
}
