import type {
  MissionRecord,
  ReportingMissionInput,
} from "@pocket-cto/domain";
import {
  ReportingMissionInputSchema,
  isFinanceDiscoveryAnswerArtifactMetadata,
} from "@pocket-cto/domain";
import { readMissionDiscoveryAnswer } from "../missions/discovery-answer-view";
import type { MissionRepository } from "../missions/repository";
import { compileReportingArtifacts } from "./formatter";
import type { CompiledReportingArtifacts, ReportingSourceBundle } from "./types";

export class ReportingService {
  constructor(
    private readonly deps: {
      missionRepository: Pick<
        MissionRepository,
        "getMissionById" | "getProofBundleByMissionId" | "listArtifactsByMissionId"
      >;
    },
  ) {}

  async compileDraftReport(mission: MissionRecord): Promise<CompiledReportingArtifacts> {
    const reportingRequest = readReportingMissionInput(mission);
    const source = await this.loadSourceBundle(reportingRequest);
    return compileReportingArtifacts(source);
  }

  private async loadSourceBundle(
    reportingRequest: ReportingMissionInput,
  ): Promise<ReportingSourceBundle> {
    const sourceDiscoveryMission =
      await this.deps.missionRepository.getMissionById(
        reportingRequest.sourceDiscoveryMissionId,
      );

    if (!sourceDiscoveryMission) {
      throw new Error(
        `Source discovery mission ${reportingRequest.sourceDiscoveryMissionId} is missing.`,
      );
    }

    if (sourceDiscoveryMission.type !== "discovery") {
      throw new Error(
        `Source mission ${sourceDiscoveryMission.id} is ${sourceDiscoveryMission.type}, not discovery.`,
      );
    }

    if (sourceDiscoveryMission.status !== "succeeded") {
      throw new Error(
        `Source discovery mission ${sourceDiscoveryMission.id} must be succeeded before reporting compilation.`,
      );
    }

    const artifacts = await this.deps.missionRepository.listArtifactsByMissionId(
      sourceDiscoveryMission.id,
    );
    const discoveryAnswer = readMissionDiscoveryAnswer(artifacts);

    if (!discoveryAnswer) {
      throw new Error(
        `Source discovery mission ${sourceDiscoveryMission.id} has no stored discovery answer artifact.`,
      );
    }

    if (!isFinanceDiscoveryAnswerArtifactMetadata(discoveryAnswer)) {
      throw new Error(
        `Source discovery mission ${sourceDiscoveryMission.id} has a non-finance discovery answer that F5A reporting cannot compile.`,
      );
    }

    const discoveryAnswerArtifact = artifacts.find(
      (artifact) => artifact.kind === "discovery_answer",
    );

    if (!discoveryAnswerArtifact) {
      throw new Error(
        `Source discovery mission ${sourceDiscoveryMission.id} is missing a discovery answer artifact row.`,
      );
    }

    const sourceProofBundle =
      await this.deps.missionRepository.getProofBundleByMissionId(
        sourceDiscoveryMission.id,
      );
    const sourceProofBundleArtifact =
      [...artifacts]
        .filter((artifact) => artifact.kind === "proof_bundle_manifest")
        .sort(
          (left, right) =>
            right.createdAt.localeCompare(left.createdAt) ||
            right.id.localeCompare(left.id),
        )[0] ?? null;

    return {
      discoveryAnswer,
      discoveryAnswerArtifactId: discoveryAnswerArtifact.id,
      sourceDiscoveryMission,
      sourceProofBundle,
      sourceProofBundleArtifactId: sourceProofBundleArtifact?.id ?? null,
    };
  }
}

function readReportingMissionInput(mission: MissionRecord) {
  const parsed = ReportingMissionInputSchema.safeParse(
    mission.spec.input?.reportingRequest,
  );

  if (!parsed.success) {
    throw new Error(`Reporting mission ${mission.id} is missing reporting input.`);
  }

  return parsed.data;
}
