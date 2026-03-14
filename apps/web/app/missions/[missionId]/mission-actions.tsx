import React from "react";
import type { MissionDetailView } from "@pocket-cto/domain";
import {
  submitApprovalResolution,
  submitTaskInterrupt,
} from "./actions";

type MissionActionsProps = Pick<
  MissionDetailView,
  "approvals" | "liveControl" | "mission" | "tasks"
>;

const OPERATOR_IDENTITY = "web-operator";

export function MissionActions({
  approvals,
  liveControl,
  mission,
  tasks,
}: MissionActionsProps) {
  const pendingApprovals = approvals.filter(
    (approval) => approval.status === "pending",
  );
  const runningTasks = tasks.filter((task) => task.status === "running");
  const controlsUnavailable = !liveControl.enabled;

  return (
    <section className="card">
      <h2>Operator actions</h2>
      <p className="muted">
        {controlsUnavailable
          ? `Actions are unavailable while the control-plane server is running in ${liveControl.mode} mode. Start it with CONTROL_PLANE_EMBEDDED_WORKER=true to enable approval resolution and task interrupts.`
          : "These controls call the current approval-resolution and task-interrupt routes, then refresh the mission detail without optimistic updates."}
      </p>

      <div className="stack" style={{ marginTop: 18 }}>
        {pendingApprovals.length === 0 ? (
          <p className="muted">No pending approvals need a decision.</p>
        ) : (
          pendingApprovals.map((approval) => (
            <div key={approval.id} className="task-row">
              <div>
                <strong>{approval.kind}</strong>
                <p className="muted" style={{ marginTop: 4 }}>
                  Requested by {approval.requestedBy} at {approval.createdAt}
                </p>
              </div>

              <div className="button-row">
                <form action={submitApprovalResolution}>
                  <input name="missionId" type="hidden" value={mission.id} />
                  <input name="approvalId" type="hidden" value={approval.id} />
                  <input
                    name="resolvedBy"
                    type="hidden"
                    value={OPERATOR_IDENTITY}
                  />
                  <input name="decision" type="hidden" value="accept" />
                  <button
                    className="action-button"
                    disabled={controlsUnavailable}
                    type="submit"
                  >
                    Approve
                  </button>
                </form>

                <form action={submitApprovalResolution}>
                  <input name="missionId" type="hidden" value={mission.id} />
                  <input name="approvalId" type="hidden" value={approval.id} />
                  <input
                    name="resolvedBy"
                    type="hidden"
                    value={OPERATOR_IDENTITY}
                  />
                  <input name="decision" type="hidden" value="decline" />
                  <button
                    className="action-button secondary"
                    disabled={controlsUnavailable}
                    type="submit"
                  >
                    Decline
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="stack" style={{ marginTop: 18 }}>
        <h3>Interrupt active tasks</h3>
        {runningTasks.length === 0 ? (
          <p className="muted">No running tasks expose an interrupt action.</p>
        ) : (
          runningTasks.map((task) => (
            <div key={task.id} className="task-row">
              <div>
                <strong>
                  Task {task.sequence} · {task.role}
                </strong>
                <p className="muted" style={{ marginTop: 4 }}>
                  Status: {task.status}
                </p>
              </div>

              <form action={submitTaskInterrupt}>
                <input name="missionId" type="hidden" value={mission.id} />
                <input
                  name="requestedBy"
                  type="hidden"
                  value={OPERATOR_IDENTITY}
                />
                <input name="taskId" type="hidden" value={task.id} />
                <button
                  className="action-button secondary"
                  disabled={controlsUnavailable}
                  type="submit"
                >
                  Interrupt task
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
