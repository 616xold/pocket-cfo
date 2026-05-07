import type {
  CfoWikiDocumentExtractRecord,
  CfoWikiSourceBindingRecord,
  DocumentMap,
  EvidenceCard,
  EvidenceClaim,
  EvidenceIndexFinanceTwinRef,
  EvidenceIndexFreshnessPosture,
  EvidenceIndexWikiRef,
  EvidenceTrace,
  SourceAnchor,
  SourceCoverageMatrix,
  SourceFileRecord,
  SourceKind,
  SourceRecord,
  SourceSnapshotRecord,
} from "@pocket-cto/domain";

export type EvidenceIndexBoundSourceInput = {
  binding: CfoWikiSourceBindingRecord;
  financeTwinRefs?: EvidenceIndexFinanceTwinRef[];
  freshnessOverride?: EvidenceIndexFreshnessPosture;
  latestExtract: CfoWikiDocumentExtractRecord | null;
  latestSnapshot: SourceSnapshotRecord | null;
  latestSourceFile: SourceFileRecord | null;
  limitations: string[];
  source: SourceRecord;
  wikiRefs?: EvidenceIndexWikiRef[];
};

export type EvidenceIndexAdditionalCoverageInput = {
  documentRole: CfoWikiSourceBindingRecord["documentRole"];
  freshnessOverride?: EvidenceIndexFreshnessPosture;
  latestSnapshot: SourceSnapshotRecord | null;
  latestSourceFile: SourceFileRecord | null;
  limitations: string[];
  source: Pick<SourceRecord, "id" | "kind" | "name"> & {
    kind: SourceKind;
  };
};

export type EvidenceIndexFoundationInput = {
  companyKey: string;
  generatedAt: string;
  sources: EvidenceIndexBoundSourceInput[];
  additionalCoverageSources?: EvidenceIndexAdditionalCoverageInput[];
};

export type EvidenceIndexFoundation = {
  companyKey: string;
  generatedAt: string;
  documentMaps: DocumentMap[];
  evidenceCards: EvidenceCard[];
  evidenceClaims: EvidenceClaim[];
  evidenceTraces: EvidenceTrace[];
  sourceAnchors: SourceAnchor[];
  sourceCoverageMatrix: SourceCoverageMatrix;
  runtimeBoundary: {
    readOnlyDerived: true;
    rawSourcesAuthoritative: true;
    financeTwinAuthoritativeForStructuredFacts: true;
    cfoWikiCompiledDerived: true;
    llmUsed: false;
    runtimeCodexUsed: false;
    vectorSearchUsed: false;
    pageIndexUsed: false;
    ocrUsed: false;
    sourceMutationCreated: false;
    financeWriteCreated: false;
    providerCallCreated: false;
    certificationCreated: false;
    deliveryCreated: false;
    autonomousActionCreated: false;
  };
};
