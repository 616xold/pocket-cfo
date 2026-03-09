import type {
  MissionRecord,
  MissionTaskRecord,
  ProofBundleManifest,
} from "@pocket-cto/domain";
import type { MissionService } from "../modules/missions/service";
import type { OrchestratorWorker } from "../modules/orchestrator/worker";
import type { ReplayService } from "../modules/replay/service";

export type MissionDetailView = {
  mission: MissionRecord;
  tasks: MissionTaskRecord[];
  proofBundle: ProofBundleManifest;
};

export type AppContainer = {
  missionService: MissionService;
  replayService: ReplayService;
};

export type WorkerContainer = {
  worker: OrchestratorWorker;
};
