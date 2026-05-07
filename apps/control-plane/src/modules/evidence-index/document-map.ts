import { DocumentMapSchema, type DocumentMap } from "@pocket-cto/domain";
import { dedupeLimitations } from "./limitations";
import {
  buildAnchor,
  buildSourceDocument,
  isSupportedExtract,
} from "./source-document";
import { buildSupportedTextStructure } from "./text-structure";
import type { EvidenceIndexBoundSourceInput } from "./types";

type BuildDocumentMapInput = {
  companyKey: string;
  generatedAt: string;
  source: EvidenceIndexBoundSourceInput;
};

export function buildDocumentMap(input: BuildDocumentMapInput): DocumentMap {
  const sourceDocument = buildSourceDocument(input);

  if (!isSupportedExtract(input.source) || !input.source.latestExtract) {
    const unsupportedAnchor = buildAnchor({
      document: sourceDocument,
      extractionMethod: sourceDocument.extractionMethod,
      idSuffix: "boundary",
      limitationPosture: sourceDocument.limitations,
      locator: {
        endLine: null,
        kind: "unsupported_boundary",
        sectionTitle: null,
        startLine: null,
        value: sourceDocument.coverageStatus,
      },
    });

    return parseDocumentMap({
      companyKey: input.companyKey,
      coverageStatus: sourceDocument.coverageStatus,
      extractionMethod: sourceDocument.extractionMethod,
      id: `${sourceDocument.id}:map`,
      limitations: sourceDocument.limitations,
      sourceAnchors: [unsupportedAnchor],
      sourceDocument,
      sourceFigures: [],
      sourcePages: [],
      sourceSections: [],
      sourceTables: [],
    });
  }

  const structure = buildSupportedTextStructure({
    document: sourceDocument,
    extract: input.source.latestExtract,
  });

  return parseDocumentMap({
    companyKey: input.companyKey,
    coverageStatus: sourceDocument.coverageStatus,
    extractionMethod: sourceDocument.extractionMethod,
    id: `${sourceDocument.id}:map`,
    limitations: dedupeLimitations([
      ...sourceDocument.limitations,
      ...structure.limitations,
    ]),
    sourceAnchors: structure.anchors,
    sourceDocument,
    sourceFigures: structure.sourceFigures,
    sourcePages: structure.sourcePages,
    sourceSections: structure.sourceSections,
    sourceTables: structure.sourceTables,
  });
}

function parseDocumentMap(input: DocumentMap) {
  return DocumentMapSchema.parse(input);
}
