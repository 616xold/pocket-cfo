import type {
  FinanceDiscoveryAnswerArtifactMetadata,
  MissionRecord,
  MissionTaskRecord,
} from "@pocket-cto/domain";
import type { EvidenceArtifactDraft } from "../evidence/service";

export function buildFinanceDiscoveryAnswerArtifact(input: {
  answer: FinanceDiscoveryAnswerArtifactMetadata;
  mission: MissionRecord;
  task: MissionTaskRecord;
}): EvidenceArtifactDraft {
  return {
    missionId: input.mission.id,
    taskId: input.task.id,
    kind: "discovery_answer",
    uri: `pocket-cto://missions/${input.mission.id}/tasks/${input.task.id}/discovery-answer`,
    mimeType: "application/json",
    sha256: null,
    metadata: input.answer,
  };
}
