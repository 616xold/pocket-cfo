import type {
  CloseControlReviewEvidenceRef,
  CloseControlReviewSourcePostureState,
  MonitorSourceLineageRef,
} from "@pocket-cto/domain";
import { findWorstSourceState, hasMissingSourceState } from "./helpers";

export function buildReviewSourcePosture(
  states: string[],
  refs: CloseControlReviewEvidenceRef[],
  summary: string,
) {
  const state = findWorstSourceState(
    states.map((value) => value as CloseControlReviewSourcePostureState),
  );

  return {
    state,
    summary,
    missingSource: hasMissingSourceState(state),
    refs,
  };
}

export function dedupeLineageRefs(refs: MonitorSourceLineageRef[]) {
  const byKey = new Map<string, MonitorSourceLineageRef>();

  for (const ref of refs) {
    byKey.set(JSON.stringify(ref), ref);
  }

  return Array.from(byKey.values());
}

export function onlyValue<T>(values: T[]) {
  return values.length === 1 ? (values[0] ?? null) : null;
}
