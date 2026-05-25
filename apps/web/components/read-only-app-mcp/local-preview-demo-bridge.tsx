import React from "react";
import type {
  LocalPreviewDemoBridgeLane,
  LocalPreviewDemoBridgeSnapshot,
  LocalPreviewDemoBridgeStatus,
} from "./local-preview-demo-bridge-snapshot";
import {
  badgeStyle,
  bodyStyle,
  colors,
  compactPanelStyle,
  labelStyle,
  listStyle,
  stackStyle,
  strongBodyStyle,
  twoColumnGridStyle,
} from "./styles";
import { ReadOnlyPanel, SectionHeading } from "./ui";

type LocalPreviewDemoBridgeProps = {
  snapshot: LocalPreviewDemoBridgeSnapshot;
};

export function LocalPreviewDemoBridge({
  snapshot,
}: LocalPreviewDemoBridgeProps) {
  return (
    <section
      aria-labelledby="local-preview-demo-bridge-title"
      data-layout="local-preview-demo-bridge"
      data-local-only={String(snapshot.localOnly)}
      data-no-public-app={String(snapshot.noPublicApp)}
      data-no-real-data={String(snapshot.noRealFinanceData)}
      data-no-runtime={String(snapshot.noRuntime)}
      data-spacing="14"
      style={stackStyle}
    >
      <SectionHeading
        eyebrow="Local demo bridge"
        headingLevel={2}
        id="local-preview-demo-bridge-title"
        summary="Static synthetic bridge status for local preview only; it does not fetch route state or run proof harnesses during render."
        title="Local demo bridge"
      />
      <ul
        aria-label="Local demo bridge boundary badges"
        data-layout="local-preview-demo-bridge-boundaries"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {snapshot.boundaryBadges.map((badge) => (
          <li key={badge}>
            <span style={badgeStyle("proof")}>{badge}</span>
          </li>
        ))}
      </ul>
      <div
        aria-label="Separated local auth and evidence bridge lanes"
        data-layout="local-preview-demo-bridge-lanes"
        data-lanes="auth-boundary evidence-tool"
        data-responsive="narrow-wide"
        style={twoColumnGridStyle}
      >
        <BridgeLane lane={snapshot.authBoundaryLane} laneId="auth-boundary" />
        <BridgeLane lane={snapshot.evidenceToolLane} laneId="evidence-tool" />
      </div>
      <ReadOnlyPanel labelledBy="local-preview-demo-bridge-snapshot-title">
        <SectionHeading
          eyebrow="Synthetic evidence snapshot"
          headingLevel={3}
          id="local-preview-demo-bridge-snapshot-title"
          summary="Static in-memory snapshot only; no source body, provider data, generated model content, write-result content, or finance fact is displayed."
          title="Static synthetic evidence snapshot"
        />
        <dl
          aria-label="Synthetic evidence snapshot summaries"
          data-layout="local-preview-demo-bridge-snapshot"
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            margin: 0,
          }}
        >
          <SnapshotItem
            label="Evidence card"
            value={snapshot.evidenceSnapshot.evidenceCardSummary}
          />
          <SnapshotItem
            label="Bounded citation"
            value={snapshot.evidenceSnapshot.citationSummary}
          />
          <SnapshotItem
            label="Source anchor"
            value={snapshot.evidenceSnapshot.sourceAnchorSummary}
          />
          <SnapshotItem
            label="Document map"
            value={snapshot.evidenceSnapshot.documentMapSummary}
          />
          <SnapshotItem
            label="Source coverage"
            value={snapshot.evidenceSnapshot.sourceCoverageSummary}
          />
          <SnapshotItem
            label="Company posture"
            value={snapshot.evidenceSnapshot.companyPostureSummary}
          />
          <SnapshotItem
            label="Capability boundary"
            value={snapshot.evidenceSnapshot.capabilityBoundarySummary}
          />
        </dl>
      </ReadOnlyPanel>
      <p
        aria-label="Local demo bridge implementation flags"
        data-production-token-validation-implemented={String(
          snapshot.productionTokenValidationImplemented,
        )}
        data-public-chatgpt-app-implemented={String(
          snapshot.publicChatGptAppImplemented,
        )}
        style={bodyStyle}
      >
        productionTokenValidationImplemented:{" "}
        {String(snapshot.productionTokenValidationImplemented)}
        {" | "}
        publicChatGptAppImplemented:{" "}
        {String(snapshot.publicChatGptAppImplemented)}
      </p>
    </section>
  );
}

type BridgeLaneProps = {
  lane: LocalPreviewDemoBridgeLane;
  laneId: "auth-boundary" | "evidence-tool";
};

function BridgeLane({ lane, laneId }: BridgeLaneProps) {
  return (
    <ReadOnlyPanel labelledBy={`local-preview-demo-bridge-${laneId}-title`}>
      <div data-lane={laneId} style={stackStyle}>
        <SectionHeading
          eyebrow={lane.label}
          headingLevel={3}
          id={`local-preview-demo-bridge-${laneId}-title`}
          summary={lane.description}
          title={lane.title}
        />
        <ul style={listStyle}>
          {lane.statuses.map((status) => (
            <li key={status.label}>
              <StatusRow status={status} />
            </li>
          ))}
        </ul>
      </div>
    </ReadOnlyPanel>
  );
}

function StatusRow({ status }: { status: LocalPreviewDemoBridgeStatus }) {
  return (
    <span
      data-status-tone={status.tone}
      style={{
        ...badgeStyle(status.tone),
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
      {status.label}
    </span>
  );
}

function SnapshotItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        ...compactPanelStyle,
        background: colors.soft,
      }}
    >
      <dt style={labelStyle}>{label}</dt>
      <dd style={{ ...strongBodyStyle, margin: 0 }}>{value}</dd>
    </div>
  );
}
