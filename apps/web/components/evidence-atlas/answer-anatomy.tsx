import React from "react";
import type { EvidenceAtlasAnswerAnatomy } from "../../lib/evidence-atlas";
import { StatusPill } from "../status-pill";

type AnswerAnatomyProps = {
  answerAnatomy: EvidenceAtlasAnswerAnatomy | null;
};

export function AnswerAnatomy({ answerAnatomy }: AnswerAnatomyProps) {
  return (
    <section className="card">
      <div className="section-head">
        <div>
          <p className="kicker">Answer anatomy</p>
          <h2>Claim, evidence, and limitation breakdown</h2>
        </div>
        <StatusPill
          label={answerAnatomy ? "stored refs" : "not available"}
          tone={answerAnatomy ? "good" : "warn"}
        />
      </div>

      {answerAnatomy ? (
        <div className="stack">
          <p className="mission-summary-copy">
            {answerAnatomy.claimSummary}
          </p>
          <h3>Evidence refs</h3>
          <ul className="list-clean">
            {answerAnatomy.evidenceRefs.map((ref) => (
              <li key={ref}>{ref}</li>
            ))}
          </ul>
          <h3>Limitations</h3>
          <ul className="list-clean">
            {answerAnatomy.limitationSummaries.map((summary) => (
              <li key={summary}>{summary}</li>
            ))}
          </ul>
          <p className="muted">{answerAnatomy.freshnessSummary}</p>
        </div>
      ) : (
        <p className="muted">
          Existing web read models do not expose a stored mission-answer or
          proof-bundle evidence anatomy for this route. The atlas can render
          that breakdown when stored refs are supplied, but it does not ask an
          LLM to summarize or answer.
        </p>
      )}
    </section>
  );
}
