import type {
  CfoWikiBoundSourceSummary,
  CfoWikiCompanySummary,
  CfoWikiPageView,
  FinanceCashPostureView,
  FinanceCollectionsPostureView,
  FinancePayablesPostureView,
  MonitorKind,
  MonitorLatestResult,
} from "@pocket-cto/domain";

export const CLOSE_CONTROL_MONITOR_KINDS: MonitorKind[] = [
  "cash_posture",
  "collections_pressure",
  "payables_pressure",
  "policy_covenant_threshold",
];

export type CloseControlPolicyPosture = {
  companySummary: CfoWikiCompanySummary;
  policyCorpusPage: CfoWikiPageView | null;
  policyPages: Array<{
    page: CfoWikiPageView | null;
    pageKey: string;
    source: CfoWikiBoundSourceSummary;
  }>;
  policySources: CfoWikiBoundSourceSummary[];
};

export type BuildCloseControlChecklistInput = {
  cashPosture: FinanceCashPostureView;
  collectionsPosture: FinanceCollectionsPostureView;
  companyKey: string;
  generatedAt: string;
  latestMonitorResults: MonitorLatestResult[];
  payablesPosture: FinancePayablesPostureView;
  policyPosture: CloseControlPolicyPosture;
};
