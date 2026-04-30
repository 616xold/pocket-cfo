import type {
  FinanceTwinExtractorKey,
  MissionType,
  MonitorKind,
  SourceKind,
} from "@pocket-cto/domain";

export type StackPack = {
  id: string;
  name: string;
  description: string;
  supportedMissionTypes: MissionType[];
  defaultRepos: string[];
  twinExtractors: string[];
  benchmarkMissionIds: string[];
  promptFragments: Partial<Record<MissionType, string>>;
};

export type PocketCfoDemoStackPackSourceFile = {
  role:
    | "bank_cash"
    | "receivables_aging"
    | "payables_aging"
    | "policy_thresholds";
  fixturePath: string;
  sourceKind: SourceKind;
  mediaType: string;
  expectedExtractorKey?: string;
  documentRole?: "policy_document";
};

export type PocketCfoDemoStackPack = {
  id: string;
  displayName: string;
  purpose: string;
  fixtureDirectory: string;
  sourceFiles: PocketCfoDemoStackPackSourceFile[];
  monitorFamiliesCovered: MonitorKind[];
  expectedOutputManifestPath: string;
  expectedCloseControlChecklistPath: string;
  cashAlertInvestigationHandoffExpected: boolean;
  limitations: string[];
  runtimeAndDeliveryBoundary: string;
};

export type PocketCfoBankCardSourcePackSourceRole =
  | "bank_account_summary"
  | "card_expense";

export type PocketCfoBankCardSourcePackSourceFile = {
  role: PocketCfoBankCardSourcePackSourceRole;
  fixturePath: string;
  sourceKind: SourceKind;
  mediaType: string;
  expectedExtractorKey: Extract<
    FinanceTwinExtractorKey,
    "bank_account_summary_csv" | "card_expense_csv"
  >;
};

export type PocketCfoBankCardSourcePack = {
  id: string;
  displayName: string;
  purpose: string;
  fixtureDirectory: string;
  sourceFiles: PocketCfoBankCardSourcePackSourceFile[];
  sourceRoles: PocketCfoBankCardSourcePackSourceRole[];
  sourceKinds: SourceKind[];
  mediaTypes: string[];
  expectedExtractorKeys: Array<
    Extract<
      FinanceTwinExtractorKey,
      "bank_account_summary_csv" | "card_expense_csv"
    >
  >;
  expectedNormalizedPosturePath: string;
  limitations: string[];
  runtimeDeliveryActionBoundary: string;
};

export type PocketCfoReceivablesPayablesSourcePackSourceRole =
  | "receivables_aging"
  | "payables_aging";

export type PocketCfoReceivablesPayablesSourcePackSourceFile = {
  role: PocketCfoReceivablesPayablesSourcePackSourceRole;
  fixturePath: string;
  sourceKind: SourceKind;
  mediaType: string;
  expectedExtractorKey: Extract<
    FinanceTwinExtractorKey,
    "receivables_aging_csv" | "payables_aging_csv"
  >;
};

export type PocketCfoReceivablesPayablesSourcePack = {
  id: string;
  displayName: string;
  purpose: string;
  fixtureDirectory: string;
  sourceFiles: PocketCfoReceivablesPayablesSourcePackSourceFile[];
  sourceRoles: PocketCfoReceivablesPayablesSourcePackSourceRole[];
  sourceKinds: SourceKind[];
  mediaTypes: string[];
  expectedExtractorKeys: Array<
    Extract<
      FinanceTwinExtractorKey,
      "receivables_aging_csv" | "payables_aging_csv"
    >
  >;
  expectedNormalizedPosturePath: string;
  limitations: string[];
  runtimeDeliveryActionBoundary: string;
};

export type PocketCfoContractObligationSourcePackSourceRole =
  "contract_metadata";

export type PocketCfoContractObligationSourcePackSourceFile = {
  role: PocketCfoContractObligationSourcePackSourceRole;
  fixturePath: string;
  sourceKind: SourceKind;
  mediaType: string;
  expectedExtractorKey: Extract<
    FinanceTwinExtractorKey,
    "contract_metadata_csv"
  >;
};

export type PocketCfoContractObligationSourcePack = {
  id: string;
  displayName: string;
  purpose: string;
  fixtureDirectory: string;
  sourceFiles: PocketCfoContractObligationSourcePackSourceFile[];
  sourceRoles: PocketCfoContractObligationSourcePackSourceRole[];
  sourceKinds: SourceKind[];
  mediaTypes: string[];
  expectedExtractorKeys: Array<
    Extract<FinanceTwinExtractorKey, "contract_metadata_csv">
  >;
  expectedNormalizedPosturePath: string;
  limitations: string[];
  runtimeDeliveryActionBoundary: string;
};

export type PocketCfoLedgerReconciliationSourcePackSourceRole =
  | "chart_of_accounts"
  | "trial_balance"
  | "general_ledger";

export type PocketCfoLedgerReconciliationSourcePackSourceFile = {
  role: PocketCfoLedgerReconciliationSourcePackSourceRole;
  fixturePath: string;
  sourceKind: SourceKind;
  mediaType: string;
  expectedExtractorKey: Extract<
    FinanceTwinExtractorKey,
    "chart_of_accounts_csv" | "trial_balance_csv" | "general_ledger_csv"
  >;
};

export type PocketCfoLedgerReconciliationSourcePack = {
  id: string;
  displayName: string;
  purpose: string;
  fixtureDirectory: string;
  sourceFiles: PocketCfoLedgerReconciliationSourcePackSourceFile[];
  sourceRoles: PocketCfoLedgerReconciliationSourcePackSourceRole[];
  sourceKinds: SourceKind[];
  mediaTypes: string[];
  expectedExtractorKeys: Array<
    Extract<
      FinanceTwinExtractorKey,
      "chart_of_accounts_csv" | "trial_balance_csv" | "general_ledger_csv"
    >
  >;
  expectedNormalizedPosturePath: string;
  limitations: string[];
  runtimeDeliveryActionBoundary: string;
};
