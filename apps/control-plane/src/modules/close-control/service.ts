import {
  buildCfoWikiConceptPageKey,
  buildCfoWikiPolicyPageKey,
  MonitorLatestResultSchema,
  type CfoWikiPageKey,
  type MonitorLatestResult,
} from "@pocket-cto/domain";
import type {
  CfoWikiServicePort,
  FinanceTwinServicePort,
  MonitoringServicePort,
} from "../../lib/types";
import { CfoWikiPageNotFoundError } from "../wiki/errors";
import { buildCloseControlChecklistResult } from "./formatter";
import {
  CLOSE_CONTROL_MONITOR_KINDS,
  type CloseControlPolicyPosture,
} from "./types";

type CloseControlServiceDeps = {
  cfoWikiService: Pick<
    CfoWikiServicePort,
    "getCompanySummary" | "getPage" | "listCompanySources"
  >;
  financeTwinService: Pick<
    FinanceTwinServicePort,
    "getCashPosture" | "getCollectionsPosture" | "getPayablesPosture"
  >;
  monitoringService?: Pick<
    MonitoringServicePort,
    | "getLatestCashPostureMonitorResult"
    | "getLatestCollectionsPressureMonitorResult"
    | "getLatestPayablesPressureMonitorResult"
    | "getLatestPolicyCovenantThresholdMonitorResult"
  >;
  now?: () => Date;
};

export class CloseControlService {
  private readonly now: () => Date;

  constructor(private readonly deps: CloseControlServiceDeps) {
    this.now = deps.now ?? (() => new Date());
  }

  async getChecklist(companyKey: string) {
    const [cashPosture, collectionsPosture, payablesPosture, policyPosture] =
      await Promise.all([
        this.deps.financeTwinService.getCashPosture(companyKey),
        this.deps.financeTwinService.getCollectionsPosture(companyKey),
        this.deps.financeTwinService.getPayablesPosture(companyKey),
        this.loadPolicyPosture(companyKey),
      ]);
    const latestMonitorResults =
      await this.loadLatestMonitorResults(companyKey);

    return buildCloseControlChecklistResult({
      cashPosture,
      collectionsPosture,
      companyKey,
      generatedAt: this.now().toISOString(),
      latestMonitorResults,
      payablesPosture,
      policyPosture,
    });
  }

  private async loadPolicyPosture(
    companyKey: string,
  ): Promise<CloseControlPolicyPosture> {
    const [companySummary, sourceList, policyCorpusPage] = await Promise.all([
      this.deps.cfoWikiService.getCompanySummary(companyKey),
      this.deps.cfoWikiService.listCompanySources(companyKey),
      this.readOptionalPage(
        companyKey,
        buildCfoWikiConceptPageKey("policy-corpus"),
      ),
    ]);
    const policySources = sourceList.sources.filter(
      (source) =>
        source.binding.includeInCompile &&
        source.binding.documentRole === "policy_document",
    );
    const policyPages = await Promise.all(
      policySources.map(async (source) => {
        const pageKey = buildCfoWikiPolicyPageKey(source.source.id);

        return {
          page: await this.readOptionalPage(companyKey, pageKey),
          pageKey,
          source,
        };
      }),
    );

    return {
      companySummary,
      policyCorpusPage,
      policyPages,
      policySources,
    };
  }

  private async loadLatestMonitorResults(
    companyKey: string,
  ): Promise<MonitorLatestResult[]> {
    if (!this.deps.monitoringService) {
      return CLOSE_CONTROL_MONITOR_KINDS.map((monitorKind) =>
        MonitorLatestResultSchema.parse({
          alertCard: null,
          companyKey,
          monitorKind,
          monitorResult: null,
        }),
      );
    }

    return Promise.all([
      this.deps.monitoringService.getLatestCashPostureMonitorResult(companyKey),
      this.deps.monitoringService.getLatestCollectionsPressureMonitorResult(
        companyKey,
      ),
      this.deps.monitoringService.getLatestPayablesPressureMonitorResult(
        companyKey,
      ),
      this.deps.monitoringService.getLatestPolicyCovenantThresholdMonitorResult(
        companyKey,
      ),
    ]);
  }

  private async readOptionalPage(companyKey: string, pageKey: CfoWikiPageKey) {
    try {
      return await this.deps.cfoWikiService.getPage(companyKey, pageKey);
    } catch (error) {
      if (error instanceof CfoWikiPageNotFoundError) {
        return null;
      }

      throw error;
    }
  }
}
