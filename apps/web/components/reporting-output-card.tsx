import React from "react";
import type { MissionDetailView } from "@pocket-cto/domain";
import {
  isFinanceDiscoveryQuestionKind,
  readFinanceDiscoveryQuestionKindLabel,
  readReportingMissionReportKindLabel,
} from "@pocket-cto/domain";
import { PolicySourceScopeFields } from "./policy-source-scope-fields";
import { readFreshnessLabel } from "./freshness-label";
import { StatusPill } from "./status-pill";

type ReportingOutputCardProps = {
  proofBundle: MissionDetailView["proofBundle"];
  reporting: NonNullable<MissionDetailView["reporting"]>;
};

export function ReportingOutputCard({
  proofBundle,
  reporting,
}: ReportingOutputCardProps) {
  const financeMemo = reporting.financeMemo;
  const evidenceAppendix = reporting.evidenceAppendix;
  const questionKindLabel =
    reporting.questionKind && isFinanceDiscoveryQuestionKind(reporting.questionKind)
      ? readFinanceDiscoveryQuestionKindLabel(reporting.questionKind)
      : reporting.questionKind;

  return (
    <section className="card">
      <div className="section-head">
        <div>
          <p className="kicker">Reporting output</p>
          <h2>{readReportingMissionReportKindLabel(reporting.reportKind)}</h2>
        </div>
        <StatusPill label={reporting.draftStatus} />
      </div>

      <p className="muted">
        {reporting.freshnessSummary ??
          "The reporting mission exists, but no draft reporting artifact is stored yet."}
      </p>

      {reporting.reportSummary ? (
        <p className="mission-summary-copy">{reporting.reportSummary}</p>
      ) : null}

      <div className="meta-grid">
        <div>
          <dt>Report kind</dt>
          <dd>{readReportingMissionReportKindLabel(reporting.reportKind)}</dd>
        </div>
        <div>
          <dt>Draft posture</dt>
          <dd>{reporting.draftStatus}</dd>
        </div>
        <div>
          <dt>Source discovery mission</dt>
          <dd>
            <a href={`/missions/${reporting.sourceDiscoveryMissionId}`}>
              {reporting.sourceDiscoveryMissionId}
            </a>
          </dd>
        </div>
        <div>
          <dt>Company</dt>
          <dd>{reporting.companyKey ?? "Not recorded yet."}</dd>
        </div>
        <div>
          <dt>Source question kind</dt>
          <dd>{questionKindLabel ?? "Not recorded yet."}</dd>
        </div>
        {reporting.questionKind === "policy_lookup" || reporting.policySourceId ? (
          <PolicySourceScopeFields
            fallbackPolicySourceId={reporting.policySourceId}
            scope={reporting.policySourceScope}
          />
        ) : null}
        <div>
          <dt>Freshness</dt>
          <dd>{readFreshnessLabel(proofBundle.freshnessState)}</dd>
        </div>
        <div>
          <dt>Appendix</dt>
          <dd>{reporting.appendixPresent ? "Stored" : "Pending"}</dd>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 18 }}>
        <h3>Related routes</h3>
        {reporting.relatedRoutePaths.length > 0 ? (
          <ul className="list-clean">
            {reporting.relatedRoutePaths.map((routePath) => (
              <li key={routePath}>
                <code>{routePath}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No related routes were recorded yet.</p>
        )}
      </div>

      <div className="stack" style={{ marginTop: 18 }}>
        <h3>Related CFO Wiki pages</h3>
        {reporting.relatedWikiPageKeys.length > 0 ? (
          <ul className="list-clean">
            {reporting.relatedWikiPageKeys.map((pageKey) => (
              <li key={pageKey}>
                <code>{pageKey}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No related CFO Wiki pages were recorded yet.</p>
        )}
      </div>

      <div className="stack" style={{ marginTop: 18 }}>
        <h3>Linked evidence</h3>
        {(evidenceAppendix?.sourceArtifacts ?? financeMemo?.sourceArtifacts ?? [])
          .length > 0 ? (
          <ul className="list-clean">
            {(evidenceAppendix?.sourceArtifacts ?? financeMemo?.sourceArtifacts ?? []).map(
              (artifact) => (
                <li key={artifact.artifactId}>
                  {artifact.kind} · <code>{artifact.artifactId}</code>
                </li>
              ),
            )}
          </ul>
        ) : (
          <p className="muted">No source artifact linkage was recorded yet.</p>
        )}
      </div>

      <div className="stack" style={{ marginTop: 18 }}>
        <h3>Limitations</h3>
        {evidenceAppendix?.limitations.length ? (
          <ul className="list-clean">
            {evidenceAppendix.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        ) : reporting.limitationsSummary ? (
          <p className="muted">{reporting.limitationsSummary}</p>
        ) : (
          <p className="muted">
            Limitations will appear after the draft reporting artifacts are
            stored.
          </p>
        )}
      </div>
    </section>
  );
}
