import { StatusPill } from "./status-pill";

type MissionCardProps = {
  mission: {
    id: string;
    type: string;
    status: string;
    title: string;
    objective: string;
    createdAt: string;
    primaryRepo: string | null;
  };
  tasks: Array<{
    id: string;
    role: string;
    status: string;
  }>;
  proofBundle: {
    status: string;
    objective: string;
    changeSummary: string;
    verificationSummary: string;
    riskSummary: string;
    rollbackSummary: string;
    decisionTrace: string[];
  };
};

export function MissionCard({ mission, tasks, proofBundle }: MissionCardProps) {
  return (
    <div className="mission-grid">
      <section className="card">
        <div className="mission-header">
          <div>
            <p className="kicker">Mission detail</p>
            <h1>{mission.title}</h1>
            <p className="lede">{mission.objective}</p>
          </div>
          <StatusPill
            label={mission.status}
            tone={mission.status === "succeeded" ? "good" : "warn"}
          />
        </div>

        <div className="meta-grid">
          <div>
            <dt>Mission type</dt>
            <dd>{mission.type}</dd>
          </div>
          <div>
            <dt>Primary repo</dt>
            <dd>{mission.primaryRepo ?? "not assigned"}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{mission.createdAt}</dd>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Run graph snapshot</h2>
        <div className="stack">
          {tasks.map((task) => (
            <div key={task.id} className="task-row">
              <div>
                <strong>{task.role}</strong>
              </div>
              <StatusPill
                label={task.status}
                tone={task.status === "succeeded" ? "good" : "default"}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Proof bundle</h2>
        <div className="meta-grid">
          <div>
            <dt>Status</dt>
            <dd>{proofBundle.status}</dd>
          </div>
          <div>
            <dt>Objective</dt>
            <dd>{proofBundle.objective}</dd>
          </div>
          <div>
            <dt>Change summary</dt>
            <dd>{proofBundle.changeSummary || "Pending evidence generation."}</dd>
          </div>
          <div>
            <dt>Verification</dt>
            <dd>{proofBundle.verificationSummary || "Pending validation."}</dd>
          </div>
          <div>
            <dt>Risk</dt>
            <dd>{proofBundle.riskSummary || "Pending risk summary."}</dd>
          </div>
          <div>
            <dt>Rollback</dt>
            <dd>{proofBundle.rollbackSummary || "Pending rollback note."}</dd>
          </div>
        </div>

        <div className="stack" style={{ marginTop: 18 }}>
          <h3>Decision trace</h3>
          {proofBundle.decisionTrace.length > 0 ? (
            <ul className="list-clean">
              {proofBundle.decisionTrace.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">
              No approval trace yet. This is expected during the mission-spine
              milestone.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
