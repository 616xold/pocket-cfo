import React from "react";
import type { EvidenceAtlasTimelineStep } from "../../lib/evidence-atlas";
import { StatusPill } from "../status-pill";

type EvidenceTimelineProps = {
  steps: EvidenceAtlasTimelineStep[];
};

export function EvidenceTimeline({ steps }: EvidenceTimelineProps) {
  return (
    <section className="card">
      <div className="section-head">
        <div>
          <p className="kicker">Evidence timeline</p>
          <h2>Raw source to atlas path</h2>
        </div>
      </div>

      <div className="stack">
        {steps.map((step) => (
          <article key={step.id} className="source-note">
            <div className="section-head" style={{ marginBottom: 8 }}>
              <div>
                <h3>{step.label}</h3>
              </div>
              <StatusPill
                label={step.status}
                tone={step.status === "missing" ? "warn" : "default"}
              />
            </div>
            <p className="muted">{step.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
