import React from "react";
import type {
  OperatorAttentionItem,
  OperatorReadinessResult,
  OperatorReadinessStatus,
} from "@pocket-cto/domain";
import { StatusPill } from "./status-pill";

type OperatorReadinessCardProps = {
  readiness: OperatorReadinessResult | null;
};

const boundaryFields = [
  "runtimeCodexUsed",
  "deliveryCreated",
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

export function OperatorReadinessCard({
  readiness,
}: OperatorReadinessCardProps) {
  if (!readiness) {
    return (
      <article className="card status-card">
        <div className="section-head">
          <div>
            <p className="kicker">Operator readiness</p>
            <h2>No readiness posture</h2>
          </div>
        </div>
        <p className="muted">
          No internal operator readiness posture was available from the control
          plane.
        </p>
      </article>
    );
  }

  return (
    <article className="card status-card">
      <div className="section-head">
        <div>
          <p className="kicker">F6J operator readiness</p>
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
          <dt>Attention items</dt>
          <dd>{readiness.attentionItems.length}</dd>
        </div>
        <div>
          <dt>Internal boundary</dt>
          <dd>internal_review_only_no_delivery_created</dd>
        </div>
      </dl>

      <section className="stack">
        <div>
          <h3>Evidence summary</h3>
          <p className="muted">{readiness.evidenceSummary}</p>
        </div>

        <div>
          <h3>Limitations</h3>
          <TextList values={readiness.limitations} />
        </div>

        <div>
          <h3>Operator attention items</h3>
          <div className="stack">
            {readiness.attentionItems.map((item) => (
              <OperatorAttentionItemView key={item.itemKey} item={item} />
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

function OperatorAttentionItemView(input: { item: OperatorAttentionItem }) {
  const { item } = input;

  return (
    <section>
      <div className="section-head">
        <div>
          <p className="kicker">{readFamilyLabel(item.family)}</p>
          <h4>{item.itemKey}</h4>
        </div>
        <StatusPill
          label={readStatusLabel(item.status)}
          tone={readStatusTone(item.status)}
        />
      </div>

      <dl className="meta-grid">
        <div>
          <dt>Family</dt>
          <dd>{item.family}</dd>
        </div>
        <div>
          <dt>Source posture</dt>
          <dd>{item.sourcePosture.state}</dd>
        </div>
        <div>
          <dt>Freshness</dt>
          <dd>{item.freshnessSummary.state}</dd>
        </div>
        <div>
          <dt>Proof posture</dt>
          <dd>{item.proofPosture.state}</dd>
        </div>
        {item.relatedMonitorKind ? (
          <div>
            <dt>Monitor kind</dt>
            <dd>{item.relatedMonitorKind}</dd>
          </div>
        ) : null}
        {item.relatedChecklistItemFamily ? (
          <div>
            <dt>Checklist item</dt>
            <dd>{item.relatedChecklistItemFamily}</dd>
          </div>
        ) : null}
      </dl>

      <div className="stack">
        <div>
          <h5>Evidence basis</h5>
          <p className="muted">{item.evidenceBasis.summary}</p>
        </div>
        <div>
          <h5>Source and freshness posture</h5>
          <p className="muted">{item.sourcePosture.summary}</p>
          <p className="muted">{item.freshnessSummary.summary}</p>
        </div>
        <div>
          <h5>Proof posture</h5>
          <p className="muted">{item.proofPosture.summary}</p>
        </div>
        <div>
          <h5>Human review next step</h5>
          <p className="muted">{item.humanReviewNextStep}</p>
        </div>
        <div>
          <h5>Limitations</h5>
          <TextList values={item.limitations} />
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

function readStatusLabel(status: OperatorReadinessStatus) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function readStatusTone(status: OperatorReadinessStatus) {
  if (status === "ready_for_review") {
    return "good";
  }

  if (status === "blocked_by_evidence") {
    return "warn";
  }

  return "default";
}

function readFamilyLabel(family: OperatorAttentionItem["family"]) {
  switch (family) {
    case "monitor_alert_attention":
      return "Monitor alert attention";
    case "close_control_attention":
      return "Close/control attention";
    case "source_freshness_attention":
      return "Source freshness attention";
    case "policy_source_attention":
      return "Policy source attention";
  }
}
