import React from "react";
import type {
  CloseControlChecklistItem,
  CloseControlChecklistResult,
  CloseControlChecklistStatus,
} from "@pocket-cto/domain";
import { StatusPill } from "./status-pill";

type CloseControlChecklistCardProps = {
  checklist: CloseControlChecklistResult | null;
};

const boundaryFields = [
  "runtimeCodexUsed",
  "deliveryCreated",
  "reportCreated",
  "approvalCreated",
  "accountingWriteCreated",
  "bankWriteCreated",
  "taxFilingCreated",
  "legalAdviceGenerated",
  "policyAdviceGenerated",
  "paymentInstructionCreated",
  "collectionInstructionCreated",
  "customerContactInstructionCreated",
  "autonomousActionCreated",
  "monitorRunTriggered",
  "missionCreated",
] as const;

export function CloseControlChecklistCard({
  checklist,
}: CloseControlChecklistCardProps) {
  if (!checklist) {
    return (
      <article className="card status-card">
        <div className="section-head">
          <div>
            <p className="kicker">Close/control checklist</p>
            <h2>No checklist posture</h2>
          </div>
        </div>
        <p className="muted">
          No stored close/control checklist posture was available from the
          control plane.
        </p>
      </article>
    );
  }

  return (
    <article className="card status-card">
      <div className="section-head">
        <div>
          <p className="kicker">F6H close/control checklist</p>
          <h2>{checklist.companyKey}</h2>
        </div>
        <StatusPill
          label={readStatusLabel(checklist.aggregateStatus)}
          tone={readStatusTone(checklist.aggregateStatus)}
        />
      </div>

      <dl className="meta-grid">
        <div>
          <dt>Generated at</dt>
          <dd>{checklist.generatedAt}</dd>
        </div>
        <div>
          <dt>Aggregate status</dt>
          <dd>{checklist.aggregateStatus}</dd>
        </div>
        <div>
          <dt>Checklist items</dt>
          <dd>{checklist.items.length}</dd>
        </div>
        <div>
          <dt>Boundary</dt>
          <dd>review_only_no_actions_created</dd>
        </div>
      </dl>

      <section className="stack">
        <div>
          <h3>Evidence summary</h3>
          <p className="muted">{checklist.evidenceSummary}</p>
        </div>

        <div>
          <h3>Limitations</h3>
          <ChecklistList values={checklist.limitations} />
        </div>

        <div>
          <h3>Checklist items</h3>
          <div className="stack">
            {checklist.items.map((item) => (
              <CloseControlChecklistItemView key={item.family} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h3>Review-only boundary</h3>
          <p className="muted">{checklist.runtimeActionBoundary.summary}</p>
          <p className="muted">
            {checklist.runtimeActionBoundary.replayImplication}
          </p>
          <dl className="meta-grid">
            {boundaryFields.map((field) => (
              <div key={field}>
                <dt>{field}</dt>
                <dd>{String(checklist.runtimeActionBoundary[field])}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </article>
  );
}

function CloseControlChecklistItemView(input: {
  item: CloseControlChecklistItem;
}) {
  const { item } = input;

  return (
    <section>
      <div className="section-head">
        <div>
          <p className="kicker">{readFamilyLabel(item.family)}</p>
          <h4>{item.family}</h4>
        </div>
        <StatusPill
          label={readStatusLabel(item.status)}
          tone={readStatusTone(item.status)}
        />
      </div>

      <dl className="meta-grid">
        <div>
          <dt>Source posture</dt>
          <dd>{item.sourcePosture.state}</dd>
        </div>
        <div>
          <dt>Freshness</dt>
          <dd>{item.freshnessSummary.state}</dd>
        </div>
        <div>
          <dt>Evidence basis</dt>
          <dd>{item.evidenceBasis.basisKind}</dd>
        </div>
        <div>
          <dt>Proof posture</dt>
          <dd>{item.proofPosture.state}</dd>
        </div>
      </dl>

      <div className="stack">
        <div>
          <h5>Source posture</h5>
          <p className="muted">{item.sourcePosture.summary}</p>
        </div>
        <div>
          <h5>Freshness summary</h5>
          <p className="muted">{item.freshnessSummary.summary}</p>
        </div>
        <div>
          <h5>Proof and evidence basis</h5>
          <p className="muted">{item.evidenceBasis.summary}</p>
          <p className="muted">{item.proofPosture.summary}</p>
        </div>
        <div>
          <h5>Human review next step</h5>
          <p className="muted">{item.humanReviewNextStep}</p>
        </div>
        <div>
          <h5>Limitations</h5>
          <ChecklistList values={item.limitations} />
        </div>
      </div>
    </section>
  );
}

function ChecklistList({ values }: { values: string[] }) {
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

function readStatusLabel(status: CloseControlChecklistStatus) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function readStatusTone(status: CloseControlChecklistStatus) {
  if (status === "ready_for_review") {
    return "good";
  }

  if (status === "blocked_by_evidence") {
    return "warn";
  }

  return "default";
}

function readFamilyLabel(family: CloseControlChecklistItem["family"]) {
  switch (family) {
    case "source_coverage_review":
      return "Source coverage";
    case "cash_source_freshness_review":
      return "Cash source freshness";
    case "receivables_aging_source_freshness_review":
      return "Receivables aging source freshness";
    case "payables_aging_source_freshness_review":
      return "Payables aging source freshness";
    case "policy_source_freshness_review":
      return "Policy source freshness";
    case "monitor_replay_readiness":
      return "Monitor replay readiness";
  }
}
