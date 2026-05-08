import React from "react";
import type { EvidenceAtlasReadModel } from "../../lib/evidence-atlas";
import { AnswerAnatomy } from "./answer-anatomy";
import { CapabilityBoundaryPanel } from "./capability-boundary-panel";
import { DocumentMapSummary } from "./document-map-summary";
import { EvidenceCardDetail } from "./evidence-card-detail";
import { EvidenceTimeline } from "./evidence-timeline";
import { SourceCoverageMatrixView } from "./source-coverage-matrix";

type EvidenceAtlasViewProps = {
  atlas: EvidenceAtlasReadModel;
};

export function EvidenceAtlasView({ atlas }: EvidenceAtlasViewProps) {
  return (
    <>
      <SourceCoverageMatrixView
        freshnessLegend={atlas.freshnessLegend}
        limitations={atlas.limitations}
        matrix={atlas.sourceCoverageMatrix}
        sourceCount={atlas.sourceCount}
        sourceInventorySummary={atlas.sourceInventorySummary}
        statusLegend={atlas.statusLegend}
      />

      <EvidenceTimeline steps={atlas.timeline} />

      <section className="grid two-up">
        <DocumentMapSummary
          documentMaps={atlas.documentMaps}
          safeExcerpts={atlas.safeExcerpts}
        />
        <EvidenceCardDetail evidenceCard={atlas.evidenceCards[0] ?? null} />
      </section>

      <section className="grid two-up">
        <AnswerAnatomy answerAnatomy={atlas.answerAnatomy} />
        <CapabilityBoundaryPanel
          forbiddenActions={atlas.forbiddenActions}
          limitations={atlas.limitations}
        />
      </section>
    </>
  );
}
