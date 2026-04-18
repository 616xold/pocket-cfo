import type {
  EvidenceAppendixArtifactMetadata,
  FinanceDiscoveryAnswerArtifactMetadata,
  FinanceMemoArtifactMetadata,
  MissionRecord,
  ProofBundleManifest,
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
