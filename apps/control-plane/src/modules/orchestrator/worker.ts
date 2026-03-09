import { setTimeout as delay } from "node:timers/promises";
import type {
  MissionTaskStatus,
  TaskStatusChangeReason,
} from "@pocket-cto/domain";
import type { OrchestratorService } from "./service";

export type WorkerLogger = {
  error(payload: unknown, message: string): void;
  info(payload: unknown, message: string): void;
};

export type WorkerRunOptions = {
  log: WorkerLogger;
  pollIntervalMs: number;
  runOnce: boolean;
  signal?: AbortSignal;
};

export class OrchestratorWorker {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  async tick() {
    return this.orchestratorService.tick();
  }

  async run(options: WorkerRunOptions) {
    if (options.runOnce) {
      return this.runTick(options.log);
    }

    while (!options.signal?.aborted) {
      await this.runTick(options.log);

      try {
        await delay(options.pollIntervalMs, undefined, {
          signal: options.signal,
        });
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        throw error;
      }
    }
  }

  async transitionTaskStatus(input: {
    reason: TaskStatusChangeReason;
    taskId: string;
    to: MissionTaskStatus;
  }) {
    return this.orchestratorService.transitionTaskStatus(input);
  }

  private async runTick(log: WorkerLogger) {
    try {
      const result = await this.orchestratorService.tick();

      if (result.kind === "idle") {
        log.info(
          {
            event: "worker.tick",
            outcome: "idle",
          },
          "Worker tick idle",
        );
        return result;
      }

      log.info(
        {
          event: "worker.tick",
          outcome: "claimed",
          attemptCount: result.task.attemptCount,
          missionId: result.task.missionId,
          role: result.task.role,
          sequence: result.task.sequence,
          taskId: result.task.id,
        },
        "Worker claimed task",
      );

      return result;
    } catch (error) {
      log.error(
        {
          err: error,
          event: "worker.tick",
          outcome: "error",
        },
        "Worker tick failed",
      );
      throw error;
    }
  }
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}
