import type { MissionRecord, ProofBundleManifest } from "@pocket-cto/domain";

export class EvidenceService {
  createPlaceholder(mission: MissionRecord): ProofBundleManifest {
    return {
      missionId: mission.id,
      objective: mission.objective,
      changeSummary: "",
      verificationSummary: "",
      riskSummary: "",
      rollbackSummary: "",
      decisionTrace: [],
      artifactIds: [],
      replayEventCount: 0,
      status: "placeholder",
    };
  }
}
