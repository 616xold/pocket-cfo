import { buildEvidenceArtifacts } from "./card";
import { buildSourceCoverageMatrix } from "./coverage";
import { buildDocumentMap } from "./document-map";
import { buildAdditionalCoverageDocument } from "./source-document";
import type {
  EvidenceIndexFoundation,
  EvidenceIndexFoundationInput,
} from "./types";

export class EvidenceIndexService {
  buildFoundation(
    input: EvidenceIndexFoundationInput,
  ): EvidenceIndexFoundation {
    const documentMaps = input.sources.map((source) =>
      buildDocumentMap({
        companyKey: input.companyKey,
        generatedAt: input.generatedAt,
        source,
      }),
    );
    const additionalDocuments = (input.additionalCoverageSources ?? []).map(
      (source) =>
        buildAdditionalCoverageDocument({
          companyKey: input.companyKey,
          generatedAt: input.generatedAt,
          source,
        }),
    );
    const evidence = buildEvidenceArtifacts({
      companyKey: input.companyKey,
      documentMaps,
      sources: input.sources,
    });
    const sourceCoverageMatrix = buildSourceCoverageMatrix({
      additionalDocuments,
      companyKey: input.companyKey,
      documentMaps,
      generatedAt: input.generatedAt,
    });

    return {
      companyKey: input.companyKey,
      documentMaps,
      evidenceCards: evidence.cards,
      evidenceClaims: evidence.claims,
      evidenceTraces: evidence.traces,
      generatedAt: input.generatedAt,
      runtimeBoundary: {
        autonomousActionCreated: false,
        certificationCreated: false,
        cfoWikiCompiledDerived: true,
        deliveryCreated: false,
        financeTwinAuthoritativeForStructuredFacts: true,
        financeWriteCreated: false,
        llmUsed: false,
        ocrUsed: false,
        pageIndexUsed: false,
        providerCallCreated: false,
        rawSourcesAuthoritative: true,
        readOnlyDerived: true,
        runtimeCodexUsed: false,
        sourceMutationCreated: false,
        vectorSearchUsed: false,
      },
      sourceAnchors: documentMaps.flatMap((map) => map.sourceAnchors),
      sourceCoverageMatrix,
    };
  }
}

export function buildEvidenceIndexFoundation(
  input: EvidenceIndexFoundationInput,
) {
  return new EvidenceIndexService().buildFoundation(input);
}
