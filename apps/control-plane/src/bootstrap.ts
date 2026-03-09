import { loadEnv } from "@pocket-cto/config";
import { createDb } from "@pocket-cto/db";
import type { AppContainer, WorkerContainer } from "./lib/types";
import { EvidenceService } from "./modules/evidence/service";
import { StubMissionCompiler } from "./modules/missions/compiler";
import { DrizzleMissionRepository } from "./modules/missions/drizzle-repository";
import { InMemoryMissionRepository } from "./modules/missions/repository";
import { MissionService } from "./modules/missions/service";
import { OrchestratorService } from "./modules/orchestrator/service";
import { OrchestratorWorker } from "./modules/orchestrator/worker";
import { DrizzleReplayRepository } from "./modules/replay/drizzle-repository";
import { InMemoryReplayRepository } from "./modules/replay/repository";
import { ReplayService } from "./modules/replay/service";

export async function createContainer(): Promise<AppContainer> {
  const services = buildDbServices();

  return {
    missionService: services.missionService,
    replayService: services.replayService,
  };
}

export async function createWorkerContainer(): Promise<WorkerContainer> {
  const services = buildDbServices();

  return {
    worker: new OrchestratorWorker(services.orchestratorService),
  };
}

export function createInMemoryContainer(): AppContainer {
  const services = buildServices({
    missionRepository: new InMemoryMissionRepository(),
    replayRepository: new InMemoryReplayRepository(),
  });

  return {
    missionService: services.missionService,
    replayService: services.replayService,
  };
}

function buildServices(deps: {
  missionRepository: ConstructorParameters<typeof MissionService>[1];
  replayRepository: ConstructorParameters<typeof ReplayService>[0];
}) {
  const replayService = new ReplayService(
    deps.replayRepository,
    deps.missionRepository,
  );
  const evidenceService = new EvidenceService();
  const missionCompiler = new StubMissionCompiler();
  const missionService = new MissionService(
    missionCompiler,
    deps.missionRepository,
    replayService,
    evidenceService,
  );
  const orchestratorService = new OrchestratorService(
    deps.missionRepository,
    replayService,
  );

  return {
    missionService,
    replayService,
    orchestratorService,
  };
}

function buildDbServices() {
  const env = loadEnv();
  const db = createDb(env.DATABASE_URL);

  return buildServices({
    missionRepository: new DrizzleMissionRepository(db),
    replayRepository: new DrizzleReplayRepository(db),
  });
}
