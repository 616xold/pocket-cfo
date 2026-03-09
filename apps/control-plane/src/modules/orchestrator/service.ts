import type {
  MissionTaskRecord,
  MissionTaskStatus,
  TaskStatusChangeReason,
} from "@pocket-cto/domain";
import type { PersistenceSession } from "../../lib/persistence";
import type { MissionRepository } from "../missions/repository";
import type { ReplayService } from "../replay/service";
import {
  buildTaskStatusChangedPayload,
  taskStatusChangeReasons,
} from "./events";

export type OrchestratorTickResult =
  | { kind: "idle" }
  | {
      kind: "claimed";
      task: MissionTaskRecord;
    };

export class OrchestratorService {
  constructor(
    private readonly missionRepository: Pick<
      MissionRepository,
      | "claimNextRunnableTask"
      | "getTaskById"
      | "transaction"
      | "updateTaskStatus"
    >,
    private readonly replayService: Pick<ReplayService, "append">,
  ) {}

  async tick(): Promise<OrchestratorTickResult> {
    return this.missionRepository.transaction(async (session) => {
      const claimedTask =
        await this.missionRepository.claimNextRunnableTask(session);

      if (!claimedTask) {
        return { kind: "idle" };
      }

      await this.appendTaskStatusChanged(
        claimedTask,
        "pending",
        claimedTask.status,
        taskStatusChangeReasons.workerClaimed,
        session,
      );

      return {
        kind: "claimed",
        task: claimedTask,
      };
    });
  }

  async transitionTaskStatus(input: {
    reason: TaskStatusChangeReason;
    taskId: string;
    to: MissionTaskStatus;
  }) {
    return this.missionRepository.transaction(async (session) => {
      const currentTask = await this.getRequiredTask(input.taskId, session);

      if (currentTask.status === input.to) {
        return currentTask;
      }

      const updatedTask = await this.missionRepository.updateTaskStatus(
        input.taskId,
        input.to,
        session,
      );

      await this.appendTaskStatusChanged(
        updatedTask,
        currentTask.status,
        updatedTask.status,
        input.reason,
        session,
      );

      return updatedTask;
    });
  }

  private async appendTaskStatusChanged(
    task: MissionTaskRecord,
    from: MissionTaskStatus,
    to: MissionTaskStatus,
    reason: TaskStatusChangeReason,
    session: PersistenceSession,
  ) {
    await this.replayService.append(
      {
        missionId: task.missionId,
        taskId: task.id,
        type: "task.status_changed",
        payload: buildTaskStatusChangedPayload(from, to, reason),
      },
      session,
    );
  }

  private async getRequiredTask(
    taskId: string,
    session: PersistenceSession,
  ): Promise<MissionTaskRecord> {
    const task = await this.missionRepository.getTaskById(taskId, session);

    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    return task;
  }
}
