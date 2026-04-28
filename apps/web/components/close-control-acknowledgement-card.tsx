import React from "react";
import type {
  CloseControlAcknowledgementReadinessResult,
  CloseControlAcknowledgementStatus,
  CloseControlAcknowledgementTarget,
} from "@pocket-cto/domain";
import { StatusPill } from "./status-pill";

type CloseControlAcknowledgementCardProps = {
  readiness: CloseControlAcknowledgementReadinessResult | null;
};

const boundaryFields = [
  "runtimeCodexUsed",
  "deliveryCreated",
  "outboxSendCreated",
  "reportCreated",
  "approvalCreated",
  "missionCreated",
  "monitorRunTriggered",
  "monitorResultCreated",
  "accountingWriteCreated",
  "bankWriteCreated",
  "taxFilingCreated",
  "legalAdviceGenerated",
  "policyAdviceGenerated",
  "paymentInstructionCreated",
  "collectionInstructionCreated",
  "customerContactInstructionCreated",
  "autonomousActionCreated",
] as const;

export function CloseControlAcknowledgementCard({
  readiness,
}: CloseControlAcknowledgementCardProps) {
  if (!readiness) {
    return (
      <article className="card status-card">
        <div className="section-head">
          <div>
            <p className="kicker">Acknowledgement readiness</p>
            <h2>No acknowledgement-readiness posture</h2>
          </div>
        </div>
        <p className="muted">
          No internal close/control acknowledgement-readiness posture was
          available from the control plane.
        </p>
      </article>
    );
  }

  return (
    <article className="card status-card">
      <div className="section-head">
        <div>
          <p className="kicker">F6K acknowledgement readiness</p>
          <h2>{readiness.companyKey}</h2>
        </div>
        <StatusPill
          label={readStatusLabel(readiness.aggregateStatus)}
          tone={readStatusTone(readiness.aggregateStatus)}
        />
      </div>

      <dl className="meta-grid">
        <div>
          <dt>Generated at</dt>
          <dd>{readiness.generatedAt}</dd>
        </div>
        <div>
          <dt>Aggregate status</dt>
          <dd>{readiness.aggregateStatus}</dd>
        </div>
        <div>
          <dt>Targets</dt>
          <dd>{readiness.acknowledgementTargets.length}</dd>
        </div>
        <div>
          <dt>Internal posture</dt>
          <dd>internal_review_only_no_approval_created_no_close_complete</dd>
        </div>
      </dl>

      <section className="stack">
        <div>
          <h3>Evidence summary</h3>
          <p className="muted">{readiness.evidenceSummary}</p>
        </div>

        <div>
          <h3>Operator-readiness context</h3>
          <dl className="meta-grid">
            <div>
              <dt>Readiness aggregate</dt>
              <dd>
                {readiness.operatorReadinessContext
                  .operatorReadinessAggregateStatus}
              </dd>
            </div>
            <div>
              <dt>Non-ready readiness items</dt>
              <dd>
                {
                  readiness.operatorReadinessContext
                    .nonReadyReadinessItemKeys.length
                }
              </dd>
            </div>
          </dl>
          <p className="muted">
            {readiness.operatorReadinessContext.summary}
          </p>
          <TextList values={readiness.operatorReadinessContext.limitations} />
        </div>

        <div>
          <h3>Limitations</h3>
          <TextList values={readiness.limitations} />
        </div>

        <div>
          <h3>Acknowledgement targets</h3>
          <div className="stack">
            {readiness.acknowledgementTargets.map((target) => (
              <AcknowledgementTargetView
                key={target.targetKey}
                target={target}
              />
            ))}
          </div>
        </div>

        <div>
          <h3>Internal review boundary</h3>
          <p className="muted">{readiness.runtimeActionBoundary.summary}</p>
          <p className="muted">
            {readiness.runtimeActionBoundary.replayImplication}
          </p>
          <dl className="meta-grid">
            {boundaryFields.map((field) => (
              <div key={field}>
                <dt>{field}</dt>
                <dd>{String(readiness.runtimeActionBoundary[field])}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </article>
  );
}

function AcknowledgementTargetView(input: {
  target: CloseControlAcknowledgementTarget;
}) {
  const { target } = input;

  return (
    <section>
      <div className="section-head">
        <div>
          <p className="kicker">{readTargetKindLabel(target.targetKind)}</p>
          <h4>{target.targetKey}</h4>
        </div>
        <StatusPill
          label={readStatusLabel(target.status)}
          tone={readStatusTone(target.status)}
        />
      </div>

      <dl className="meta-grid">
        <div>
          <dt>Target kind</dt>
          <dd>{target.targetKind}</dd>
        </div>
        <div>
          <dt>Target status</dt>
          <dd>{target.status}</dd>
        </div>
        <div>
          <dt>Source posture</dt>
          <dd>{target.sourcePosture.state}</dd>
        </div>
        <div>
          <dt>Freshness</dt>
          <dd>{target.freshnessSummary.state}</dd>
        </div>
        <div>
          <dt>Proof posture</dt>
          <dd>{target.proofPosture.state}</dd>
        </div>
        {target.relatedChecklistItemFamily ? (
          <div>
            <dt>Checklist item family</dt>
            <dd>{target.relatedChecklistItemFamily}</dd>
          </div>
        ) : null}
        {target.relatedReadinessItemKey ? (
          <div>
            <dt>Readiness item</dt>
            <dd>{target.relatedReadinessItemKey}</dd>
          </div>
        ) : null}
      </dl>

      <div className="stack">
        <div>
          <h5>Evidence basis</h5>
          <p className="muted">{target.evidenceBasis.summary}</p>
        </div>
        <div>
          <h5>Source and freshness posture</h5>
          <p className="muted">{target.sourcePosture.summary}</p>
          <p className="muted">{target.freshnessSummary.summary}</p>
        </div>
        <div>
          <h5>Proof posture</h5>
          <p className="muted">{target.proofPosture.summary}</p>
        </div>
        <div>
          <h5>Human review next step</h5>
          <p className="muted">{target.humanReviewNextStep}</p>
        </div>
        <div>
          <h5>Limitations</h5>
          <TextList values={target.limitations} />
        </div>
      </div>
    </section>
  );
}

function TextList({ values }: { values: string[] }) {
  if (values.length === 0) {
    return <p className="muted">none_recorded</p>;
  }

  return (
    <ul className="list-clean">
      {values.map((value) => (
        <li key={value}>{value}</li>
      ))}
    </ul>
  );
}

function readStatusLabel(status: CloseControlAcknowledgementStatus) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function readStatusTone(status: CloseControlAcknowledgementStatus) {
  if (status === "ready_for_acknowledgement") {
    return "good";
  }

  if (status === "blocked_by_evidence") {
    return "warn";
  }

  return "default";
}

function readTargetKindLabel(
  kind: CloseControlAcknowledgementTarget["targetKind"],
) {
  switch (kind) {
    case "checklist_aggregate":
      return "Checklist aggregate";
    case "checklist_item_family":
      return "Checklist item family";
  }
}
