import type {
  ExportReportingMissionMarkdownInput,
  FileReportingMissionArtifactsInput,
} from "@pocket-cto/domain";
import type { ProofBundleAssemblyService } from "../evidence/proof-bundle-assembly";
import type { ReportingService } from "../reporting/service";

export class MissionReportingActionsService {
  constructor(
    private readonly deps: {
      proofBundleAssembly: Pick<ProofBundleAssemblyService, "refreshProofBundle">;
      reportingService: Pick<
        ReportingService,
        "exportMarkdownBundle" | "fileDraftArtifacts"
      >;
    },
  ) {}

  async exportMarkdownBundle(
    missionId: string,
    input: ExportReportingMissionMarkdownInput,
  ) {
    const exported = await this.deps.reportingService.exportMarkdownBundle(
      missionId,
      input,
    );

    await this.deps.proofBundleAssembly.refreshProofBundle({
      details: {
        reportExportRunId:
          exported.publication.latestMarkdownExport?.exportRunId ?? null,
        reportFiledPageKeys: readFiledPageKeys(exported.publication),
        reportPublicationSummary: exported.publication.summary,
      },
      missionId,
      trigger: "reporting_export",
    });

    return exported;
  }

  async fileDraftArtifacts(
    missionId: string,
    input: FileReportingMissionArtifactsInput,
  ) {
    const filed = await this.deps.reportingService.fileDraftArtifacts(
      missionId,
      input,
    );

    await this.deps.proofBundleAssembly.refreshProofBundle({
      details: {
        reportFiledPageKeys: readFiledPageKeys(filed.publication),
        reportPublicationSummary: filed.publication.summary,
      },
      missionId,
      trigger: "reporting_filed_artifacts",
    });

    return filed;
  }
}

function readFiledPageKeys(input: {
  filedEvidenceAppendix: { pageKey: string } | null;
  filedMemo: { pageKey: string } | null;
}) {
  return [input.filedMemo?.pageKey, input.filedEvidenceAppendix?.pageKey].filter(
    (value): value is string => Boolean(value),
  );
}
