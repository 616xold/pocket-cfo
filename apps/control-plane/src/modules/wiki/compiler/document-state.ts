import type {
  CfoWikiPageTemporalStatus,
  CfoWikiSourceBindingRecord,
  SourceFileRecord,
  SourceRecord,
  SourceSnapshotRecord,
} from "@pocket-cto/domain";
import type { SourceRepository } from "../../sources/repository";
import type { SourceFileStorage } from "../../sources/storage";
import type { CfoWikiRepository, PersistCfoWikiDocumentExtractInput } from "../repository";
import { resolveDocumentExtract } from "./document-extract";

export type WikiDocumentSnapshotState = {
  extract: PersistCfoWikiDocumentExtractInput;
  snapshot: SourceSnapshotRecord;
  sourceFile: SourceFileRecord | null;
  temporalStatus: Extract<CfoWikiPageTemporalStatus, "current" | "superseded">;
};

export type WikiDocumentSourceState = {
  binding: CfoWikiSourceBindingRecord;
  source: SourceRecord;
  snapshots: WikiDocumentSnapshotState[];
};

export async function resolveCompiledDocumentSources(input: {
  companyId: string;
  now: Date;
  sourceFileStorage: Pick<SourceFileStorage, "read">;
  sourceRepository: Pick<
    SourceRepository,
    "getSourceById" | "listSnapshotsBySourceId" | "listSourceFilesBySourceId"
  >;
  wikiRepository: Pick<
    CfoWikiRepository,
    "listDocumentExtractsByCompanyId" | "listSourceBindingsByCompanyId"
  >;
}): Promise<WikiDocumentSourceState[]> {
  const [allBindings, existingExtracts] = await Promise.all([
    input.wikiRepository.listSourceBindingsByCompanyId(input.companyId),
    input.wikiRepository.listDocumentExtractsByCompanyId(input.companyId),
  ]);
  const bindings = allBindings.filter((binding) => binding.includeInCompile);
  const existingExtractBySnapshotId = new Map(
    existingExtracts.map((extract) => [extract.sourceSnapshotId, extract] as const),
  );

  return Promise.all(
    bindings.map(async (binding) => {
      const source = await input.sourceRepository.getSourceById(binding.sourceId);

      if (!source) {
        throw new Error(
          `CFO Wiki source binding ${binding.id} references missing source ${binding.sourceId}`,
        );
      }

      const [snapshots, sourceFiles] = await Promise.all([
        input.sourceRepository.listSnapshotsBySourceId(binding.sourceId),
        input.sourceRepository.listSourceFilesBySourceId(binding.sourceId),
      ]);
      const sourceFileBySnapshotId = new Map(
        sourceFiles.map((sourceFile) => [sourceFile.sourceSnapshotId, sourceFile] as const),
      );
      const latestVersion = snapshots[0]?.version ?? null;

      const resolvedSnapshots = await Promise.all(
        snapshots.map(async (snapshot) => {
          const temporalStatus: WikiDocumentSnapshotState["temporalStatus"] =
            snapshot.version === latestVersion ? "current" : "superseded";

          return {
            extract: await resolveDocumentExtract({
              existingExtract: existingExtractBySnapshotId.get(snapshot.id) ?? null,
              now: input.now,
              snapshot,
              source,
              sourceFile: sourceFileBySnapshotId.get(snapshot.id) ?? null,
              sourceFileStorage: input.sourceFileStorage,
            }),
            snapshot,
            sourceFile: sourceFileBySnapshotId.get(snapshot.id) ?? null,
            temporalStatus,
          } satisfies WikiDocumentSnapshotState;
        }),
      );

      return {
        binding,
        source,
        snapshots: resolvedSnapshots,
      } satisfies WikiDocumentSourceState;
    }),
  );
}
