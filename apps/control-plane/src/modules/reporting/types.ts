import type {
  ArtifactRecord,
  CfoWikiExportRunRecord,
  CfoWikiPageRecord,
  EvidenceAppendixArtifactMetadata,
  FinanceDiscoveryAnswerArtifactMetadata,
  FinanceMemoArtifactMetadata,
  MissionRecord,
  ProofBundleManifest,
  ReportingPublicationView,
} from "@pocket-cto/domain";

export type ReportingSourceBundle = {
  discoveryAnswer: FinanceDiscoveryAnswerArtifactMetadata;
  discoveryAnswerArtifactId: string;
  sourceDiscoveryMission: MissionRecord;
  sourceProofBundle: ProofBundleManifest | null;
  sourceProofBundleArtifactId: string | null;
};

export type CompiledReportingArtifacts = {
  evidenceAppendix: EvidenceAppendixArtifactMetadata;
  financeMemo: FinanceMemoArtifactMetadata;
};

export type ReportingMissionContext = {
  artifacts: ArtifactRecord[];
  mission: MissionRecord;
  proofBundle: ProofBundleManifest;
};

export type ReportingPublicationFacts = {
  filedEvidenceAppendix: CfoWikiPageRecord | null;
  filedMemo: CfoWikiPageRecord | null;
  latestMarkdownExport: CfoWikiExportRunRecord | null;
  publication: ReportingPublicationView;
};
