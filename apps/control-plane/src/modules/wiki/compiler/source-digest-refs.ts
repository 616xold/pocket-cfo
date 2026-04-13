import type { PersistCfoWikiPageRefInput } from "../repository";
import type { WikiDocumentSourceState, WikiDocumentSnapshotState } from "./document-state";

const MAX_EXCERPT_REFS = 3;

export function buildSourceDigestPageRefs(
  pageKey: string,
  documentSource: WikiDocumentSourceState,
  snapshotState: WikiDocumentSnapshotState,
) {
  const refs: PersistCfoWikiPageRefInput[] = [
    {
      pageKey,
      refKind:
        snapshotState.extract.extractStatus === "extracted"
          ? "source_excerpt"
          : "ambiguous",
      targetKind: "source_snapshot",
      targetId: snapshotState.snapshot.id,
      label: `${documentSource.source.name} snapshot v${snapshotState.snapshot.version}`,
      locator: `version ${snapshotState.snapshot.version}`,
      excerpt: `Snapshot version ${snapshotState.snapshot.version} captured ${snapshotState.snapshot.capturedAt}.`,
      notes: `Temporal status ${snapshotState.temporalStatus}; checksum ${truncateChecksum(
        snapshotState.snapshot.checksumSha256,
      )}.`,
    },
  ];

  if (snapshotState.sourceFile) {
    refs.push({
      pageKey,
      refKind:
        snapshotState.extract.extractStatus === "extracted"
          ? "source_excerpt"
          : "ambiguous",
      targetKind: "source_file",
      targetId: snapshotState.sourceFile.id,
      label: `${documentSource.source.name} raw file`,
      locator: snapshotState.sourceFile.originalFileName,
      excerpt: `Stored raw file ${snapshotState.sourceFile.originalFileName} captured ${snapshotState.sourceFile.capturedAt}.`,
      notes: `Media type ${snapshotState.sourceFile.mediaType}; storage kind ${snapshotState.sourceFile.storageKind}.`,
    });
  }

  if (snapshotState.extract.extractStatus === "extracted" && snapshotState.sourceFile) {
    refs.push(
      ...snapshotState.extract.excerptBlocks.slice(0, MAX_EXCERPT_REFS).map(
        (excerptBlock, index) => ({
          pageKey,
          refKind: "source_excerpt" as const,
          targetKind: "source_file" as const,
          targetId: snapshotState.sourceFile!.id,
          label:
            excerptBlock.heading ??
            `${documentSource.source.name} excerpt ${index + 1}`,
          locator: excerptBlock.heading ?? `excerpt-${index + 1}`,
          excerpt: excerptBlock.text,
          notes:
            "Excerpt is persisted from a deterministic F3B document extract, not from a freeform summary.",
        }),
      ),
    );
  }

  if (snapshotState.extract.extractStatus !== "extracted") {
    refs.push({
      pageKey,
      refKind: "ambiguous",
      targetKind: snapshotState.sourceFile ? "source_file" : "source_snapshot",
      targetId: snapshotState.sourceFile?.id ?? snapshotState.snapshot.id,
      label: `${documentSource.source.name} extract status is ${snapshotState.extract.extractStatus}`,
      locator: snapshotState.sourceFile?.originalFileName ?? `version ${snapshotState.snapshot.version}`,
      excerpt:
        snapshotState.extract.errorSummary ??
        snapshotState.extract.warnings[0] ??
        "No deterministic document extract could be persisted for this snapshot.",
      notes:
        "Unsupported or failed document extraction stays visible as a gap so the wiki does not invent document claims.",
    });
  }

  return refs;
}

function truncateChecksum(checksum: string) {
  return checksum.length <= 16 ? checksum : `${checksum.slice(0, 16)}...`;
}
